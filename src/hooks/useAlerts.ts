/**
 * Alerts Hook
 *
 * Aggregates notifications from multiple sources:
 * - DIAP items with changed source responses
 * - Platform announcements (new training, workshops, updates)
 *
 * Reads DIAP and module progress directly from localStorage
 * so it works from any component (sidebar, navbar, etc.).
 */

import { useState, useMemo } from 'react';

export interface Alert {
  id: string;
  type: 'diap-change' | 'training' | 'announcement' | 'workshop';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const DISMISSED_KEY = 'access_compass_alerts_dismissed';

// Platform announcements — update this array to push new alerts to all users
const PLATFORM_ANNOUNCEMENTS: Omit<Alert, 'read'>[] = [
  {
    id: 'announce-ai-course-2026',
    type: 'training',
    title: 'New course available',
    message: 'Using AI to Create Accessible & Inclusive Resources is now available in the Training Hub.',
    timestamp: '2026-02-15T00:00:00Z',
    link: '/training/course/ai-accessible-resources',
  },
];

function getDismissedIds(): Set<string> {
  try {
    const data = localStorage.getItem(DISMISSED_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch { return new Set(); }
}

function saveDismissedIds(ids: Set<string>) {
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
}

function countDiapChanges(): number {
  try {
    const diapItems = JSON.parse(localStorage.getItem('diap_items') || '[]');
    // Build current response lookup from module progress
    const currentResponses: Record<string, string> = {};
    const progressKeys = Object.keys(localStorage).filter(k => k.startsWith('module_progress_'));
    progressKeys.forEach(key => {
      try {
        const mp = JSON.parse(localStorage.getItem(key) || '{}');
        if (mp.responses) {
          mp.responses.forEach((r: any) => {
            if (r.questionId && r.answer) currentResponses[r.questionId] = r.answer;
          });
        }
      } catch { /* skip */ }
    });
    let count = 0;
    diapItems.forEach((item: any) => {
      if (!item.questionSource || !item.sourceAnswer) return;
      const current = currentResponses[item.questionSource];
      if (current && current !== item.sourceAnswer) count++;
    });
    return count;
  } catch { return 0; }
}

export function useAlerts() {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(getDismissedIds);
  const diapChangedCount = useMemo(() => countDiapChanges(), []);

  const alerts = useMemo(() => {
    const result: Alert[] = [];

    // DIAP change alert
    if (diapChangedCount > 0) {
      result.push({
        id: 'diap-changes',
        type: 'diap-change',
        title: 'DIAP items need review',
        message: `${diapChangedCount} item${diapChangedCount !== 1 ? 's have' : ' has'} changed since your last assessment. Review and acknowledge the changes.`,
        timestamp: new Date().toISOString(),
        read: dismissedIds.has('diap-changes'),
        link: '/diap',
      });
    }

    // Platform announcements
    PLATFORM_ANNOUNCEMENTS.forEach(a => {
      result.push({ ...a, read: dismissedIds.has(a.id) });
    });

    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [diapChangedCount, dismissedIds]);

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAsRead = (alertId: string) => {
    const updated = new Set(dismissedIds);
    updated.add(alertId);
    setDismissedIds(updated);
    saveDismissedIds(updated);
  };

  const markAllAsRead = () => {
    const updated = new Set(dismissedIds);
    alerts.forEach(a => updated.add(a.id));
    setDismissedIds(updated);
    saveDismissedIds(updated);
  };

  return { alerts, unreadCount, markAsRead, markAllAsRead };
}
