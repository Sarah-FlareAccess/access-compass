import { useEffect, useRef, useState } from 'react';

interface SyncErrorEventDetail {
  table?: string;
  message?: string;
}

/**
 * Surfaces cloud-sync write failures that the sync layer would otherwise
 * swallow into its retry queue (a rejected upsert, e.g. a missing column or a
 * permission error). Without this, a broken write is invisible and changes
 * silently never reach other devices. Stays until dismissed because a failed
 * write can mean data loss. Transient network drops do not raise this event
 * (the OfflineBanner covers those). See feature-surface-sync-errors.
 */
export function SyncErrorBanner() {
  const [visible, setVisible] = useState(false);
  const dismissBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handler(event: Event) {
      const detail = (event as CustomEvent<SyncErrorEventDetail>).detail;
      if (detail?.message) {
        console.warn('[SyncErrorBanner] sync failure surfaced:', detail);
      }
      setVisible(true);
    }
    window.addEventListener('access-compass:sync-error', handler);
    return () => window.removeEventListener('access-compass:sync-error', handler);
  }, []);

  useEffect(() => {
    if (visible) dismissBtnRef.current?.focus();
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10000,
        maxWidth: 520,
        width: 'calc(100% - 32px)',
        background: '#fef2f2',
        border: '2px solid #dc2626',
        borderRadius: 8,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        color: '#7f1d1d',
        fontSize: 14,
        lineHeight: 1.4,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
        ⚠️
      </span>
      <p style={{ margin: 0, flex: 1 }}>
        Some changes couldn't be saved to the cloud. They're safe on this device
        for now. Please try again shortly and if it keeps happening let your
        administrator know.
      </p>
      <button
        ref={dismissBtnRef}
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss notification"
        style={{
          background: 'transparent',
          border: 'none',
          color: '#7f1d1d',
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
