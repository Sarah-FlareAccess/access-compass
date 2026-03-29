import { useCallback, useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../utils/session';
import { syncRecord } from '../utils/cloudSync';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import type { ActivityEntry, ActivityType, ActivityCategory } from '../types/activity';
import { getActivityCategory } from '../types/activity';

const STORAGE_KEY = 'access_compass_activity_log';
const MAX_ENTRIES = 500;
const RETENTION_MONTHS = 12;

function isWithinRetention(timestamp: string): boolean {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - RETENTION_MONTHS);
  return new Date(timestamp).getTime() >= cutoff.getTime();
}

function loadActivities(): ActivityEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const entries = JSON.parse(stored) as ActivityEntry[];

    // Deduplicate: same type + moduleId/diapItemId within 5 seconds = duplicate
    const deduped: ActivityEntry[] = [];
    for (const entry of entries) {
      const isDupe = deduped.some(e =>
        e.type === entry.type &&
        e.moduleId === entry.moduleId &&
        e.diapItemId === entry.diapItemId &&
        Math.abs(new Date(e.timestamp).getTime() - new Date(entry.timestamp).getTime()) < 5000
      );
      if (!isDupe) deduped.push(entry);
    }

    // Apply retention filter
    const retained = deduped.filter(e => isWithinRetention(e.timestamp));

    if (retained.length < entries.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(retained));
    }

    return retained;
  } catch { /* ignore */ }
  return [];
}

function saveActivities(entries: ActivityEntry[]): void {
  const trimmed = entries.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

function getActorName(): string {
  // 1. Try session contact name
  const session = getSession();
  const contactName = session?.business_snapshot?.contact_name;
  if (contactName) return contactName;

  // 2. Try the known Supabase auth token key
  try {
    const authKey = 'sb-ibvqlyyvlwnwjcoehjkt-auth-token';
    const raw = localStorage.getItem(authKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      const email = parsed?.user?.email
        || parsed?.currentSession?.user?.email;
      if (email) {
        const name = email.split('@')[0];
        return name.charAt(0).toUpperCase() + name.slice(1);
      }
    }
  } catch { /* ignore */ }

  // 3. Broader search for any auth key
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.includes('auth-token') || key.includes('sb-')) {
        const raw = localStorage.getItem(key);
        if (!raw || !raw.startsWith('{')) continue;
        try {
          const parsed = JSON.parse(raw);
          const email = parsed?.user?.email
            || parsed?.currentSession?.user?.email
            || parsed?.session?.user?.email;
          if (email) {
            const name = email.split('@')[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
          }
        } catch { /* skip */ }
      }
    }
  } catch { /* ignore */ }

  return 'Team member';
}

export function getActivityDescriptionText(entry: ActivityEntry): string {
  switch (entry.type) {
    case 'module-completed':
      return `completed ${entry.moduleName || 'a module'}`;
    case 'module-started':
      return `started ${entry.moduleName || 'a module'}`;
    case 'module-assigned':
      return `assigned ${entry.moduleName || 'a module'} to ${entry.assigneeName || 'someone'}`;
    case 'diap-item-created':
      return `created DIAP item: ${(entry.diapItemObjective || '').slice(0, 60)}`;
    case 'diap-status-changed': {
      const fmtOld = (entry.oldValue || 'unknown').replace(/-/g, ' ');
      const fmtNew = (entry.newValue || 'unknown').replace(/-/g, ' ');
      return `changed status of "${(entry.diapItemObjective || '').slice(0, 40)}" from ${fmtOld} to ${fmtNew}`;
    }
    case 'diap-assigned':
      return `assigned "${(entry.diapItemObjective || '').slice(0, 40)}" to ${entry.assigneeName || 'someone'}`;
    case 'diap-comment-added':
      return `commented on "${(entry.diapItemObjective || '').slice(0, 40)}"`;
    case 'report-generated':
      return 'generated a report';
    default:
      return 'performed an action';
  }
}

export function exportActivitiesAsCSV(activities: ActivityEntry[]): string {
  const headers = ['Date', 'Time', 'Category', 'Actor', 'Action', 'Details'];
  const rows = activities.map(a => {
    const date = new Date(a.timestamp);
    const category = getActivityCategory(a.type);
    const description = getActivityDescriptionText(a);
    const details = [a.moduleName, a.diapItemObjective, a.commentText].filter(Boolean).join(' | ');
    return [
      date.toLocaleDateString('en-AU'),
      date.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }),
      category.charAt(0).toUpperCase() + category.slice(1),
      a.actorName,
      description,
      details,
    ].map(v => `"${(v || '').replace(/"/g, '""')}"`).join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

export function useActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntry[]>(loadActivities);
  const [trimmedByRetention, setTrimmedByRetention] = useState(false);
  const userRef = useRef(user);
  userRef.current = user;

  // On mount: load from localStorage first, then fetch from Supabase and merge
  useEffect(() => {
    const localEntries = loadActivities();
    setActivities(localEntries);

    if (isSupabaseEnabled() && supabase && user) {
      supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500)
        .then(({ data }) => {
          if (!data || data.length === 0) return;

          const cloudEntries: ActivityEntry[] = data
            .map((row: Record<string, unknown>) => ({
              id: row.id as string,
              sessionId: row.session_id as string,
              type: row.type as ActivityType,
              actorName: row.actor_name as string,
              actorId: row.user_id as string,
              timestamp: row.created_at as string,
              ...(row.data as Record<string, unknown> || {}),
            } as ActivityEntry))
            .filter((e: ActivityEntry) => isWithinRetention(e.timestamp));

          setActivities(prev => {
            const existingIds = new Set(prev.map(e => e.id));
            const newEntries = cloudEntries.filter(e => !existingIds.has(e.id));
            if (newEntries.length === 0) return prev;

            const merged = [...prev, ...newEntries]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .slice(0, MAX_ENTRIES);

            saveActivities(merged);
            return merged;
          });
        })
        .catch(() => {});
    }

    // Check if any entries were trimmed by retention
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const raw = JSON.parse(stored) as ActivityEntry[];
        const hasOld = raw.some(e => !isWithinRetention(e.timestamp));
        if (hasOld) setTrimmedByRetention(true);
      }
    } catch { /* ignore */ }
  }, [user]);

  // Reload on storage changes from other tabs
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setActivities(loadActivities());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logActivity = useCallback((
    type: ActivityType,
    context: Omit<ActivityEntry, 'id' | 'sessionId' | 'type' | 'actorName' | 'actorId' | 'timestamp'>
  ) => {
    const session = getSession();
    const entry: ActivityEntry = {
      id: crypto.randomUUID(),
      sessionId: session?.session_id || '',
      type,
      actorName: getActorName(),
      actorId: userRef.current?.id,
      timestamp: new Date().toISOString(),
      ...context,
    };

    setActivities(prev => {
      const updated = [entry, ...prev].slice(0, MAX_ENTRIES);
      saveActivities(updated);
      return updated;
    });

    // Sync to cloud
    if (userRef.current?.id) {
      syncRecord('activity_log', {
        id: entry.id,
        session_id: entry.sessionId,
        type: entry.type,
        actor_name: entry.actorName,
        data: {
          moduleId: entry.moduleId,
          moduleName: entry.moduleName,
          diapItemId: entry.diapItemId,
          diapItemObjective: entry.diapItemObjective,
          oldValue: entry.oldValue,
          newValue: entry.newValue,
          assigneeName: entry.assigneeName,
          commentText: entry.commentText,
        },
        created_at: entry.timestamp,
      }, userRef.current.id, undefined).catch(() => {});
    }
  }, []);

  const getFilteredActivities = useCallback((filters?: {
    moduleId?: string;
    diapItemId?: string;
    type?: ActivityType;
    limit?: number;
  }): ActivityEntry[] => {
    let result = activities;
    if (filters?.moduleId) result = result.filter(a => a.moduleId === filters.moduleId);
    if (filters?.diapItemId) result = result.filter(a => a.diapItemId === filters.diapItemId);
    if (filters?.type) result = result.filter(a => a.type === filters.type);
    if (filters?.limit) result = result.slice(0, filters.limit);
    return result;
  }, [activities]);

  const getActivitiesByCategory = useCallback((category: ActivityCategory): ActivityEntry[] => {
    if (category === 'all') return activities;
    return activities.filter(a => getActivityCategory(a.type) === category);
  }, [activities]);

  return {
    activities,
    logActivity,
    getFilteredActivities,
    getActivitiesByCategory,
    trimmedByRetention,
    unreadCount: activities.filter(a => {
      const age = Date.now() - new Date(a.timestamp).getTime();
      return age < 24 * 60 * 60 * 1000; // Last 24 hours
    }).length,
  };
}

// Standalone function for use outside React components (e.g., in hooks)
export function logActivityStandalone(
  type: ActivityType,
  context: Omit<ActivityEntry, 'id' | 'sessionId' | 'type' | 'actorName' | 'actorId' | 'timestamp'>,
  userId?: string
): void {
  const session = getSession();
  const entry: ActivityEntry = {
    id: crypto.randomUUID(),
    sessionId: session?.session_id || '',
    type,
    actorName: getActorName(),
    actorId: userId,
    timestamp: new Date().toISOString(),
    ...context,
  };

  const existing = loadActivities();
  const updated = [entry, ...existing].slice(0, MAX_ENTRIES);
  saveActivities(updated);

  if (userId) {
    syncRecord('activity_log', {
      id: entry.id,
      session_id: entry.sessionId,
      type: entry.type,
      actor_name: entry.actorName,
      data: {
        moduleId: entry.moduleId,
        moduleName: entry.moduleName,
        diapItemId: entry.diapItemId,
        diapItemObjective: entry.diapItemObjective,
        oldValue: entry.oldValue,
        newValue: entry.newValue,
        assigneeName: entry.assigneeName,
        commentText: entry.commentText,
      },
      created_at: entry.timestamp,
    }, userId, undefined).catch(() => {});
  }
}
