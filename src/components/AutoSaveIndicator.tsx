/**
 * Auto-Save Indicator
 *
 * Shows a subtle "Saved" indicator when data is automatically saved.
 * Appears briefly after each save, then fades out.
 */

import { useState, useEffect, useRef } from 'react';
import './AutoSaveIndicator.css';

interface AutoSaveIndicatorProps {
  /** Increment this value each time a save occurs to trigger the indicator */
  saveCount: number;
}

export function AutoSaveIndicator({ saveCount }: AutoSaveIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const prevCount = useRef(saveCount);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (saveCount > prevCount.current) {
      setVisible(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setVisible(false), 2000);
    }
    prevCount.current = saveCount;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [saveCount]);

  return (
    <span
      className={`auto-save-indicator ${visible ? 'visible' : ''}`}
      role="status"
      aria-live="polite"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Saved
    </span>
  );
}
