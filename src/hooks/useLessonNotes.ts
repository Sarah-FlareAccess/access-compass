import { useCallback, useEffect, useState } from 'react';
import { useAuthSafe } from '../contexts/AuthContext';

const storageKey = (userKey: string, courseId: string) =>
  `ac:lesson-notes:${userKey}:${courseId}`;

function loadNotes(key: string): string {
  try {
    return localStorage.getItem(key) ?? '';
  } catch {
    return '';
  }
}

export function useLessonNotes(courseId: string) {
  const { userId } = useAuthSafe();
  const key = storageKey(userId ?? 'anonymous', courseId);

  const [notes, setNotesState] = useState<string>(() => loadNotes(key));

  // Reload notes when the user (and therefore the key) changes.
  useEffect(() => {
    setNotesState(loadNotes(key));
  }, [key]);

  const setNotes = useCallback(
    (value: string) => {
      setNotesState(value);
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore quota */
      }
    },
    [key]
  );

  const clearNotes = useCallback(() => setNotes(''), [setNotes]);

  return { notes, setNotes, clearNotes };
}
