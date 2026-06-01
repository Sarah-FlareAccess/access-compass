import { useCallback, useEffect, useState } from 'react';

const storageKey = (courseId: string) => `ac:format-choice:${courseId}`;

export interface FormatChoice {
  format: string;
  audience: string;
}

export function useFormatChoice(courseId: string) {
  const [choice, setChoice] = useState<FormatChoice>(() => {
    try {
      const raw = localStorage.getItem(storageKey(courseId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed.format === 'string' &&
          typeof parsed.audience === 'string'
        ) {
          return parsed;
        }
      }
    } catch {
      /* ignore */
    }
    return { format: '', audience: '' };
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey(courseId), JSON.stringify(choice));
    } catch {
      /* ignore quota */
    }
  }, [choice, courseId]);

  const setFormat = useCallback((format: string) => {
    setChoice((prev) => ({ ...prev, format }));
  }, []);

  const setAudience = useCallback((audience: string) => {
    setChoice((prev) => ({ ...prev, audience }));
  }, []);

  return { choice, setFormat, setAudience };
}
