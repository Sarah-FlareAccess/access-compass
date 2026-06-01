import { useCallback, useEffect, useState } from 'react';

const storageKey = (courseId: string) => `ac:format-choice:${courseId}`;

export interface FormatChoice {
  format: string;
  audience: string;
  contextFields: Record<string, string>;
}

const EMPTY_CHOICE: FormatChoice = { format: '', audience: '', contextFields: {} };

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
          return {
            format: parsed.format,
            audience: parsed.audience,
            contextFields:
              parsed.contextFields && typeof parsed.contextFields === 'object'
                ? parsed.contextFields
                : {},
          };
        }
      }
    } catch {
      /* ignore */
    }
    return EMPTY_CHOICE;
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

  const setContextField = useCallback((key: string, value: string) => {
    setChoice((prev) => ({
      ...prev,
      contextFields: { ...prev.contextFields, [key]: value },
    }));
  }, []);

  return { choice, setFormat, setAudience, setContextField };
}
