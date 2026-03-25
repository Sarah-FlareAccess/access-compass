/**
 * Tab Lock Hook
 *
 * Prevents the app from being open in multiple browser tabs simultaneously.
 * Uses localStorage + BroadcastChannel to detect and block duplicate tabs.
 *
 * Pattern:
 * 1. On mount, claim a lock with a unique tab ID and timestamp
 * 2. Heartbeat every 2 seconds to prove the tab is still alive
 * 3. If another tab claims the lock, this tab shows a blocked message
 * 4. Uses BroadcastChannel for instant cross-tab communication
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const LOCK_KEY = 'access_compass_tab_lock';
const HEARTBEAT_INTERVAL = 2000; // 2 seconds
const LOCK_TIMEOUT = 5000; // Consider lock stale after 5 seconds
const CHANNEL_NAME = 'access_compass_tab';

interface TabLock {
  tabId: string;
  timestamp: number;
}

export function useTabLock(): { isBlocked: boolean; forceUnlock: () => void } {
  const [isBlocked, setIsBlocked] = useState(false);
  const tabId = useRef(uuidv4());
  const heartbeatRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const channelRef = useRef<BroadcastChannel | null>(null);

  const claimLock = useCallback(() => {
    const lock: TabLock = {
      tabId: tabId.current,
      timestamp: Date.now(),
    };
    localStorage.setItem(LOCK_KEY, JSON.stringify(lock));
  }, []);

  const checkLock = useCallback((): boolean => {
    try {
      const raw = localStorage.getItem(LOCK_KEY);
      if (!raw) return true; // No lock, safe to claim

      const lock: TabLock = JSON.parse(raw);

      // This tab owns the lock
      if (lock.tabId === tabId.current) return true;

      // Lock is stale (other tab crashed or closed without cleanup)
      if (Date.now() - lock.timestamp > LOCK_TIMEOUT) return true;

      // Another tab is active
      return false;
    } catch {
      return true;
    }
  }, []);

  const forceUnlock = useCallback(() => {
    claimLock();
    setIsBlocked(false);

    // Tell other tabs this one is taking over
    try {
      channelRef.current?.postMessage({ type: 'claim', tabId: tabId.current });
    } catch { /* BroadcastChannel not supported */ }
  }, [claimLock]);

  useEffect(() => {
    // Try to set up BroadcastChannel for instant communication
    try {
      channelRef.current = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current.onmessage = (event) => {
        if (event.data?.type === 'claim' && event.data.tabId !== tabId.current) {
          // Another tab is claiming the lock
          setIsBlocked(true);
          if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        }
        if (event.data?.type === 'ping') {
          // Another tab is checking if anyone is alive
          channelRef.current?.postMessage({ type: 'pong', tabId: tabId.current });
        }
      };
    } catch {
      // BroadcastChannel not supported, fall back to localStorage only
    }

    // Check if we can claim the lock
    if (checkLock()) {
      claimLock();
      setIsBlocked(false);

      // Announce to other tabs
      try {
        channelRef.current?.postMessage({ type: 'claim', tabId: tabId.current });
      } catch { /* ignore */ }

      // Start heartbeat
      heartbeatRef.current = setInterval(() => {
        claimLock();
      }, HEARTBEAT_INTERVAL);
    } else {
      setIsBlocked(true);
    }

    // Listen for storage changes from other tabs
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== LOCK_KEY) return;
      if (!e.newValue) return;

      try {
        const lock: TabLock = JSON.parse(e.newValue);
        if (lock.tabId !== tabId.current) {
          setIsBlocked(true);
          if (heartbeatRef.current) clearInterval(heartbeatRef.current);
        }
      } catch { /* ignore */ }
    };

    window.addEventListener('storage', handleStorage);

    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorage);
      if (heartbeatRef.current) clearInterval(heartbeatRef.current);

      // Release lock if this tab owns it
      try {
        const raw = localStorage.getItem(LOCK_KEY);
        if (raw) {
          const lock: TabLock = JSON.parse(raw);
          if (lock.tabId === tabId.current) {
            localStorage.removeItem(LOCK_KEY);
          }
        }
      } catch { /* ignore */ }

      try {
        channelRef.current?.close();
      } catch { /* ignore */ }
    };
  }, [checkLock, claimLock]);

  return { isBlocked, forceUnlock };
}
