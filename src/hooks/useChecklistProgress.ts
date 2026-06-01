import { useCallback, useEffect, useState } from 'react';

const storageKey = (courseId: string, lessonId: string) =>
  `ac:checklist:${courseId}:${lessonId}`;

type ChecklistState = Record<string, number[]>;

export function useChecklistProgress(courseId: string, lessonId: string) {
  const [state, setState] = useState<ChecklistState>(() => {
    try {
      const raw = localStorage.getItem(storageKey(courseId, lessonId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      /* ignore */
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(courseId, lessonId), JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
  }, [state, courseId, lessonId]);

  const isChecked = useCallback(
    (checklistKey: string, itemIndex: number) =>
      state[checklistKey]?.includes(itemIndex) ?? false,
    [state]
  );

  const toggle = useCallback((checklistKey: string, itemIndex: number) => {
    setState((prev) => {
      const current = prev[checklistKey] ?? [];
      const next = current.includes(itemIndex)
        ? current.filter((i) => i !== itemIndex)
        : [...current, itemIndex];
      return { ...prev, [checklistKey]: next };
    });
  }, []);

  return { isChecked, toggle };
}
