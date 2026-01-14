// ============================================
// ACCESS COMPASS - SESSION TIMEOUT HOOK
// ============================================
// Handles automatic session timeout based on org settings
// ============================================

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseSessionTimeoutOptions {
  /** Timeout in minutes. If not provided, uses org setting or default (480 = 8 hours) */
  timeoutMinutes?: number;
  /** Warning before timeout in minutes (default: 5) */
  warningMinutes?: number;
  /** Callback when session times out */
  onTimeout?: () => void;
  /** Callback when warning is triggered */
  onWarning?: (remainingSeconds: number) => void;
  /** Whether the hook is enabled (default: true) */
  enabled?: boolean;
}

interface UseSessionTimeoutResult {
  /** Whether the warning is currently showing */
  isWarningVisible: boolean;
  /** Seconds remaining until timeout */
  remainingSeconds: number;
  /** Reset the activity timer */
  resetActivity: () => void;
  /** Extend the session (resets timer) */
  extendSession: () => void;
}

export function useSessionTimeout(options: UseSessionTimeoutOptions = {}): UseSessionTimeoutResult {
  const { accessState, signOut, isAuthenticated } = useAuth();
  const {
    timeoutMinutes = accessState.organisation?.session_timeout_minutes ?? 480,
    warningMinutes = 5,
    onTimeout,
    onWarning,
    enabled = true,
  } = options;

  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(timeoutMinutes * 60);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Clear all timers
  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    timeoutRef.current = null;
    warningRef.current = null;
    countdownRef.current = null;
  }, []);

  // Handle timeout
  const handleTimeout = useCallback(async () => {
    clearAllTimers();
    setIsWarningVisible(false);

    if (onTimeout) {
      onTimeout();
    } else {
      // Default behavior: sign out
      await signOut();
    }
  }, [clearAllTimers, onTimeout, signOut]);

  // Start countdown when warning appears
  const startWarningCountdown = useCallback(() => {
    const warningSeconds = warningMinutes * 60;
    setRemainingSeconds(warningSeconds);
    setIsWarningVisible(true);

    if (onWarning) {
      onWarning(warningSeconds);
    }

    // Start countdown interval
    countdownRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        const newValue = prev - 1;
        if (newValue <= 0) {
          handleTimeout();
          return 0;
        }
        return newValue;
      });
    }, 1000);
  }, [warningMinutes, onWarning, handleTimeout]);

  // Set up timers
  const setupTimers = useCallback(() => {
    if (!enabled || !isAuthenticated) return;

    clearAllTimers();

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer
    if (warningMinutes > 0 && timeoutMinutes > warningMinutes) {
      warningRef.current = setTimeout(() => {
        startWarningCountdown();
      }, warningMs);
    }

    // Set timeout timer (backup in case countdown fails)
    timeoutRef.current = setTimeout(() => {
      handleTimeout();
    }, timeoutMs);

    lastActivityRef.current = Date.now();
  }, [
    enabled,
    isAuthenticated,
    timeoutMinutes,
    warningMinutes,
    clearAllTimers,
    startWarningCountdown,
    handleTimeout,
  ]);

  // Reset activity (called on user interaction)
  const resetActivity = useCallback(() => {
    if (!enabled || !isAuthenticated) return;

    lastActivityRef.current = Date.now();

    // If warning is showing, hide it and reset timers
    if (isWarningVisible) {
      setIsWarningVisible(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    }

    setupTimers();
  }, [enabled, isAuthenticated, isWarningVisible, setupTimers]);

  // Extend session (explicit user action)
  const extendSession = useCallback(() => {
    resetActivity();
  }, [resetActivity]);

  // Set up activity listeners
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      clearAllTimers();
      return;
    }

    // Activity events to listen for
    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
    ];

    // Throttle activity resets (don't reset on every mouse move)
    let lastReset = Date.now();
    const throttleMs = 30000; // Only reset every 30 seconds max

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastReset > throttleMs) {
        lastReset = now;
        resetActivity();
      }
    };

    // Add event listeners
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initial setup
    setupTimers();

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      clearAllTimers();
    };
  }, [enabled, isAuthenticated, setupTimers, resetActivity, clearAllTimers]);

  // Clean up when disabled or logged out
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      clearAllTimers();
      setIsWarningVisible(false);
    }
  }, [enabled, isAuthenticated, clearAllTimers]);

  return {
    isWarningVisible,
    remainingSeconds,
    resetActivity,
    extendSession,
  };
}

// ============================================
// SESSION TIMEOUT WARNING COMPONENT
// ============================================

interface SessionTimeoutWarningProps {
  remainingSeconds: number;
  onExtend: () => void;
  onLogout: () => void;
}

export function SessionTimeoutWarning({
  remainingSeconds,
  onExtend,
  onLogout,
}: SessionTimeoutWarningProps) {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="session-timeout-overlay">
      <div className="session-timeout-modal">
        <div className="timeout-icon">&#9200;</div>
        <h2>Session Expiring Soon</h2>
        <p>
          Your session will expire in{' '}
          <strong>
            {minutes > 0 ? `${minutes}m ` : ''}
            {seconds}s
          </strong>
        </p>
        <p className="timeout-hint">
          Click "Stay Logged In" to continue your session.
        </p>
        <div className="timeout-actions">
          <button className="btn-timeout-logout" onClick={onLogout}>
            Log Out Now
          </button>
          <button className="btn-timeout-extend" onClick={onExtend}>
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
