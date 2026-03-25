/**
 * Device Conflict Alert
 *
 * Shown when the app detects data from another device in Supabase
 * that may differ from the current device's localStorage data.
 * Lets the user choose how to resolve the conflict.
 *
 * Accessibility: focus trap, Escape to dismiss, aria-live announcement.
 */

import { useEffect, useRef, useCallback } from 'react';
import './DeviceConflictAlert.css';

interface DeviceConflictAlertProps {
  otherDeviceLabel: string;
  otherDeviceSyncTime: string;
  onUseCloud: () => void;
  onKeepLocal: () => void;
  onDismiss: () => void;
}

export function DeviceConflictAlert({
  otherDeviceLabel,
  otherDeviceSyncTime,
  onUseCloud,
  onKeepLocal,
  onDismiss,
}: DeviceConflictAlertProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  const formatTime = (iso: string): string => {
    try {
      const date = new Date(iso);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);

      if (diffMins < 1) return 'just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return 'recently';
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onDismiss();
    }
    if (e.key === 'Tab' && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onDismiss]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    firstButtonRef.current?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="device-conflict-overlay"
      role="presentation"
      onClick={onDismiss}
    >
      <div
        className="device-conflict-modal"
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="conflict-title"
        aria-describedby="conflict-desc"
        onClick={e => e.stopPropagation()}
      >
        <div className="device-conflict-icon" aria-hidden="true">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
            <path d="M15 10l-3-3-3 3" />
          </svg>
        </div>

        <h2 id="conflict-title" className="device-conflict-title">
          Data found from another device
        </h2>

        <p id="conflict-desc" className="device-conflict-desc">
          Your account was last used on <strong>{otherDeviceLabel}</strong> ({formatTime(otherDeviceSyncTime)}).
          That device may have newer changes than what is saved on this one.
        </p>

        <p className="device-conflict-note">
          This can also appear if you have the app open in another browser tab or window.
        </p>

        <div className="device-conflict-actions">
          <button
            ref={firstButtonRef}
            className="device-conflict-btn device-conflict-btn-primary"
            onClick={onUseCloud}
          >
            Use cloud data
            <span className="device-conflict-btn-hint">
              Replace this device's data with the latest from the cloud
            </span>
          </button>

          <button
            className="device-conflict-btn device-conflict-btn-secondary"
            onClick={onKeepLocal}
          >
            Keep this device's data
            <span className="device-conflict-btn-hint">
              Keep what is on this device and overwrite the cloud
            </span>
          </button>
        </div>

        <button
          className="device-conflict-dismiss"
          onClick={onDismiss}
          aria-label="Decide later"
        >
          Decide later
        </button>
      </div>
    </div>
  );
}
