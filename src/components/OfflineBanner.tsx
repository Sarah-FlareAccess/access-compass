import { useEffect, useState } from 'react';

/**
 * Surfaces network-offline state so users on flaky mobile connections
 * know the app is working from local storage and changes will sync once
 * they're back online. Doesn't disable any feature — cloud sync is
 * offline-first.
 */
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine
  );

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        padding: '8px 16px',
        background: '#FEF3C7',
        borderBottom: '1px solid #F59E0B',
        color: '#78350F',
        fontSize: '0.875rem',
        textAlign: 'center',
        fontWeight: 500,
      }}
    >
      You're offline. Your changes are saved locally and will sync when you're back online.
    </div>
  );
}
