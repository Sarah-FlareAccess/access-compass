// ============================================
// ACCESS COMPASS - ACCESS CHECK HOOK
// ============================================
// Provides access checking utilities
// ============================================

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import type { AccessLevel, UserAccessState } from '../types/access';

interface AccessCheckResult {
  /** Whether the user can access the requested level */
  canAccess: boolean;

  /** Whether the user is authenticated */
  isAuthenticated: boolean;

  /** Whether auth is still loading */
  isLoading: boolean;

  /** Whether the user needs to pay to access */
  needsPayment: boolean;

  /** Whether the user needs to sign in first */
  needsAuth: boolean;

  /** The user's current access state */
  accessState: UserAccessState;

  /** Quick check: can access Pulse features */
  canAccessPulse: boolean;

  /** Quick check: can access Deep Dive features (DIAP) */
  canAccessDeepDive: boolean;
}

/**
 * Hook for checking user access to features
 *
 * @param requiredLevel - Optional access level required (pulse or deep_dive)
 * @returns Access check result with various flags
 *
 * @example
 * // Check if user can access any paid features
 * const { canAccess, needsPayment } = useAccessCheck();
 *
 * @example
 * // Check if user can access Deep Dive features
 * const { canAccess, needsAuth } = useAccessCheck('deep_dive');
 */
export function useAccessCheck(requiredLevel?: AccessLevel): AccessCheckResult {
  const { isAuthenticated, isLoading, accessState, hasAccessLevel } = useAuth();

  return useMemo(() => {
    // Determine if user can access the requested level
    let canAccess = false;
    if (requiredLevel) {
      canAccess = hasAccessLevel(requiredLevel);
    } else {
      // If no specific level required, just check if they have any access
      canAccess = accessState.hasAccess;
    }

    return {
      canAccess,
      isAuthenticated,
      isLoading,
      needsPayment: isAuthenticated && !accessState.hasAccess,
      needsAuth: !isAuthenticated,
      accessState,
      canAccessPulse: hasAccessLevel('pulse'),
      canAccessDeepDive: hasAccessLevel('deep_dive'),
    };
  }, [isAuthenticated, isLoading, accessState, hasAccessLevel, requiredLevel]);
}

/**
 * Hook for checking if user can access DIAP workspace
 * Shorthand for useAccessCheck('deep_dive')
 */
export function useDIAPAccess(): AccessCheckResult {
  return useAccessCheck('deep_dive');
}

/**
 * Hook for checking if user can access basic paid features
 * Shorthand for useAccessCheck('pulse')
 */
export function usePulseAccess(): AccessCheckResult {
  return useAccessCheck('pulse');
}
