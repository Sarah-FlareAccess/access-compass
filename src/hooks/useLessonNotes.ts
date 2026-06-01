import { useCallback, useEffect, useState } from 'react';

const storageKey = (courseId: string) => `ac:lesson-notes:${courseId}`;

export function useLessonNotes(courseId: string) {
  const [notes, setNotes] = useState<string>(() => {
    try {
      return localStorage.getItem(storageKey(courseId)) ?? '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(courseId), notes);
    } catch {
      /* ignore quota */
    }
  }, [notes, courseId]);

  const clearNotes = useCallback(() => setNotes(''), []);

  return { notes, setNotes, clearNotes };
}
