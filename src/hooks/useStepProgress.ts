import { useCallback, useEffect, useState } from 'react';

const storageKey = (courseId: string, lessonId: string) =>
  `ac:step-progress:${courseId}:${lessonId}`;

export function useStepProgress(courseId: string, lessonId: string) {
  const [completed, setCompleted] = useState<number[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey(courseId, lessonId));
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
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(courseId, lessonId), JSON.stringify(completed));
    } catch {
      /* ignore quota */
    }
  }, [completed, courseId, lessonId]);

  const toggleStep = useCallback((stepNum: number) => {
    setCompleted((prev) =>
      prev.includes(stepNum) ? prev.filter((n) => n !== stepNum) : [...prev, stepNum]
    );
  }, []);

  const isStepDone = useCallback((n: number) => completed.includes(n), [completed]);

  return { completed, toggleStep, isStepDone };
}
