import { useCallback, useEffect, useState } from 'react';
import { useAuthSafe } from '../contexts/AuthContext';

const storageKey = (userKey: string, courseId: string, lessonId: string) =>
  `ac:checklist:${userKey}:${courseId}:${lessonId}`;

type ChecklistState = Record<string, number[]>;

function loadState(key: string): ChecklistState {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const clean: ChecklistState = {};
        for (const [k, value] of Object.entries(parsed)) {
          if (Array.isArray(value)) {
            clean[k] = value.filter((n): n is number => typeof n === 'number');
          }
        }
        return clean;
      }
    }
  } catch {
    /* ignore */
  }
  return {};
}

export function useChecklistProgress(courseId: string, lessonId: string) {
  const { userId } = useAuthSafe();
  const key = storageKey(userId ?? 'anonymous', courseId, lessonId);

  const [state, setState] = useState<ChecklistState>(() => loadState(key));

  // Reload state when the user (and therefore the key) changes.
  useEffect(() => {
    setState(loadState(key));
  }, [key]);

  const isChecked = useCallback(
    (checklistKey: string, itemIndex: number) =>
      state[checklistKey]?.includes(itemIndex) ?? false,
    [state]
  );

  const toggle = useCallback(
    (checklistKey: string, itemIndex: number) => {
      setState((prev) => {
        const current = prev[checklistKey] ?? [];
        const nextList = current.includes(itemIndex)
          ? current.filter((i) => i !== itemIndex)
          : [...current, itemIndex];
        const next = { ...prev, [checklistKey]: nextList };
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore quota */
        }
        return next;
      });
    },
    [key]
  );

  return { isChecked, toggle };
}
