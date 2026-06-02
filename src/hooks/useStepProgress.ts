import { useCallback, useEffect, useState } from 'react';
import { useAuthSafe } from '../contexts/AuthContext';

const storageKey = (userKey: string, courseId: string, lessonId: string) =>
  `ac:step-progress:${userKey}:${courseId}:${lessonId}`;

function loadCompleted(key: string): number[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.filter((n): n is number => typeof n === 'number');
      }
    }
  } catch {
    /* ignore */
  }
  return [];
}

export function useStepProgress(courseId: string, lessonId: string) {
  const { userId } = useAuthSafe();
  const key = storageKey(userId ?? 'anonymous', courseId, lessonId);

  const [completed, setCompleted] = useState<number[]>(() => loadCompleted(key));

  // Reload state when the user (and therefore the key) changes.
  useEffect(() => {
    setCompleted(loadCompleted(key));
  }, [key]);

  const toggleStep = useCallback(
    (stepNum: number) => {
      setCompleted((prev) => {
        const next = prev.includes(stepNum) ? prev.filter((n) => n !== stepNum) : [...prev, stepNum];
        try {
          localStorage.setItem(key, JSON.stringify(next));
          window.dispatchEvent(
            new CustomEvent('ac:step-progress-changed', { detail: { courseId, lessonId } })
          );
        } catch {
          /* ignore quota */
        }
        return next;
      });
    },
    [key, courseId, lessonId]
  );

  const isStepDone = useCallback((n: number) => completed.includes(n), [completed]);

  return { completed, toggleStep, isStepDone };
}
