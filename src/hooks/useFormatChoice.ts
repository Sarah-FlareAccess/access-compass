import { useCallback, useEffect, useState } from 'react';
import { useAuthSafe } from '../contexts/AuthContext';

const storageKey = (userKey: string, courseId: string) =>
  `ac:format-choice:${userKey}:${courseId}`;

export interface FormatChoice {
  format: string;
  audience: string;
  contextFields: Record<string, string>;
}

const EMPTY_CHOICE: FormatChoice = { format: '', audience: '', contextFields: {} };

function loadChoice(key: string): FormatChoice {
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.format === 'string' && typeof parsed.audience === 'string') {
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
}

export function useFormatChoice(courseId: string) {
  const { userId } = useAuthSafe();
  const key = storageKey(userId ?? 'anonymous', courseId);

  const [choice, setChoice] = useState<FormatChoice>(() => loadChoice(key));

  // Reload choice when the user (and therefore the key) changes.
  useEffect(() => {
    setChoice(loadChoice(key));
  }, [key]);

  const persist = useCallback(
    (next: FormatChoice) => {
      try {
        localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* ignore quota */
      }
    },
    [key]
  );

  const setFormat = useCallback(
    (format: string) => {
      setChoice((prev) => {
        const next = { ...prev, format };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setAudience = useCallback(
    (audience: string) => {
      setChoice((prev) => {
        const next = { ...prev, audience };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  const setContextField = useCallback(
    (fieldKey: string, value: string) => {
      setChoice((prev) => {
        const next = {
          ...prev,
          contextFields: { ...prev.contextFields, [fieldKey]: value },
        };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { choice, setFormat, setAudience, setContextField };
}
