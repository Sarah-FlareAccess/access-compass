import { useState, useEffect, useCallback, useRef } from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const DISMISS_KEY = 'access_compass_install_dismissed';
const COOLDOWN_DAYS = 7;

export function InstallPrompt() {
  const { canInstall, triggerInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);
  const [inCooldown, setInCooldown] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) {
          setInCooldown(true);
        }
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const handleInstall = useCallback(async () => {
    const accepted = await triggerInstall();
    if (accepted) setDismissed(true);
  }, [triggerInstall]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (!canInstall || dismissed || inCooldown) return null;

  return (
    <div
      ref={bannerRef}
      className="install-prompt"
      role="complementary"
      aria-label="Install Access Compass"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        margin: '0 0 16px 0',
        background: 'linear-gradient(135deg, rgba(73, 14, 103, 0.08), rgba(107, 33, 168, 0.05))',
        border: '1px solid rgba(73, 14, 103, 0.2)',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.4',
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#490E67"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
      <span style={{ flex: 1, color: 'var(--text-primary, #1a1a2e)' }}>
        Add Access Compass to your home screen for easy walk-around assessments.
      </span>
      <button
        onClick={handleInstall}
        style={{
          padding: '6px 14px',
          background: '#490E67',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        style={{
          padding: '4px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted, #6b7280)',
          fontSize: '18px',
          lineHeight: 1,
        }}
      >
        &times;
      </button>
    </div>
  );
}
