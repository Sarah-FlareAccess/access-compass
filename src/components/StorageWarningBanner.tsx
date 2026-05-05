import { useEffect, useRef, useState } from 'react';

type WarningLevel = 'warning' | 'error';

interface StorageWarning {
  id: number;
  level: WarningLevel;
  message: string;
}

interface StorageWarningEventDetail {
  level: WarningLevel;
  message: string;
}

const AUTO_DISMISS_MS = 8000;

export function StorageWarningBanner() {
  const [warning, setWarning] = useState<StorageWarning | null>(null);
  const dismissBtnRef = useRef<HTMLButtonElement | null>(null);
  const idCounter = useRef(0);

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<StorageWarningEventDetail>).detail;
      if (!detail?.message) return;
      idCounter.current += 1;
      setWarning({
        id: idCounter.current,
        level: detail.level || 'warning',
        message: detail.message,
      });
    }
    window.addEventListener('access-compass:storage-warning', handler);
    return () => window.removeEventListener('access-compass:storage-warning', handler);
  }, []);

  useEffect(() => {
    if (!warning) return;
    const timer = window.setTimeout(() => {
      setWarning(current => (current && current.id === warning.id ? null : current));
    }, AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [warning]);

  if (!warning) return null;

  const isError = warning.level === 'error';
  const bgColor = isError ? '#fef2f2' : '#fff7ed';
  const borderColor = isError ? '#dc2626' : '#ea580c';
  const textColor = isError ? '#7f1d1d' : '#7c2d12';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        maxWidth: 480,
        width: 'calc(100% - 32px)',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: textColor,
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
        {isError ? 'Heads up:' : 'Heads up:'}
      </span>
      <p style={{ margin: 0, flex: 1 }}>{warning.message}</p>
      <button
        ref={dismissBtnRef}
        type="button"
        onClick={() => setWarning(null)}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: textColor,
          cursor: 'pointer',
          fontSize: 18,
          lineHeight: 1,
          padding: 4,
          fontWeight: 700,
        }}
      >
        ×
      </button>
    </div>
  );
}
