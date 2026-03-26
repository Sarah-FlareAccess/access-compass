import { useCallback, useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../utils/session';
import { syncRecord } from '../utils/cloudSync';
import type { ActivityEntry, ActivityType } from '../types/activity';

const STORAGE_KEY = 'access_compass_activity_log';
const MAX_ENTRIES = 500;

function loadActivities(): ActivityEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored) as ActivityEntry[];
  } catch { /* ignore */ }
  return [];
}

function saveActivities(entries: ActivityEntry[]): void {
  const trimmed = entries.slice(0, MAX_ENTRIES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

function getActorName(): string {
  const session = getSession();
  const contactName = session?.business_snapshot?.contact_name;
  if (contactName) return contactName;
  // Fallback: try auth email from localStorage
  try {
    const authKey = Object.keys(localStorage).find(k => k.includes('auth-token'));
    if (authKey) {
      const authData = JSON.parse(localStorage.getItem(authKey) || '{}');
      const email = authData?.user?.email;
      if (email) return email.split('@')[0];
    }
  } catch { /* ignore */ }
  return 'Team member';
}

export function useActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityEntry[]>(loadActivities);
  const userRef = useRef(user);
  userRef.current = user;

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

  return {
    activities,
    logActivity,
    getFilteredActivities,
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
