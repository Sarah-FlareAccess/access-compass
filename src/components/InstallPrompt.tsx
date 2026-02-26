import { useState, useEffect, useCallback, useRef } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISS_KEY = 'access_compass_install_dismissed';
const VISIT_KEY = 'access_compass_visit_count';
const COOLDOWN_DAYS = 7;

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Track visits
    try {
      const count = parseInt(localStorage.getItem(VISIT_KEY) || '0', 10);
      localStorage.setItem(VISIT_KEY, String(count + 1));

      // Check cooldown
      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const elapsed = Date.now() - parseInt(dismissedAt, 10);
        if (elapsed < COOLDOWN_DAYS * 24 * 60 * 60 * 1000) return;
      }

      // Only show after second visit
      if (count < 1) return;
    } catch {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      // localStorage unavailable
    }
  }, []);

  if (!showBanner) return null;

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
