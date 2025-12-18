// ============================================
// ACCESS COMPASS - ROUTE GUARD
// ============================================
// Protects routes based on authentication and access level
// ============================================

import { type ReactNode } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { AccessLevel } from '../../types/access';

// ============================================
// TYPES
// ============================================

interface RouteGuardProps {
  /** Child elements to render if access is granted */
  children?: ReactNode;

  /** Whether authentication is required */
  requireAuth?: boolean;

  /** Required access level (pulse or deep_dive) */
  requireAccess?: AccessLevel;

  /** Path to redirect to if access is denied */
  fallbackPath?: string;
}

// ============================================
// LOADING COMPONENT
// ============================================

function LoadingScreen() {
  return (
    <div className="route-guard-loading">
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
      <style>{`
        .route-guard-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: var(--color-ivory, #ECE9E6);
        }
        .loading-container {
          text-align: center;
        }
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--color-steel-gray, #4a4a4a);
          border-top-color: var(--color-deep-purple, #3a0b52);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 16px;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .loading-container p {
          color: var(--color-steel-gray, #4a4a4a);
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
}

// ============================================
// ROUTE GUARD COMPONENT
// ============================================

/**
 * Route guard component for protecting routes
 *
 * @example
 * // Require authentication only
 * <RouteGuard requireAuth>
 *   <Dashboard />
 * </RouteGuard>
 *
 * @example
 * // Require Pulse access
 * <RouteGuard requireAuth requireAccess="pulse">
 *   <ModuleSelection />
 * </RouteGuard>
 *
 * @example
 * // Require Deep Dive access (for DIAP)
 * <RouteGuard requireAuth requireAccess="deep_dive">
 *   <DIAPWorkspace />
 * </RouteGuard>
 */
export function RouteGuard({
  children,
  requireAuth = false,
  requireAccess,
  fallbackPath = '/decision',
}: RouteGuardProps) {
  const { isAuthenticated, isLoading, hasAccessLevel } = useAuth();
  const location = useLocation();

  // 🚨 DEVELOPMENT MODE: Bypass all auth checks
  const isDevelopment = import.meta.env.DEV;
  if (isDevelopment) {
    console.log('[RouteGuard] DEV MODE: Bypassing auth checks');
    return <>{children ?? <Outlet />}</>;
  }

  // Show loading state while auth is initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    // Redirect to decision page with return URL
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${fallbackPath}?returnTo=${returnTo}`} replace />;
  }

  // Check access level
  if (requireAccess && isAuthenticated) {
    const hasRequiredAccess = hasAccessLevel(requireAccess);

    if (!hasRequiredAccess) {
      // User is authenticated but doesn't have required access
      // Redirect to decision page to purchase/upgrade
      const returnTo = encodeURIComponent(location.pathname + location.search);
      return <Navigate to={`${fallbackPath}?returnTo=${returnTo}`} replace />;
    }
  }

  // Access granted - render children or outlet
  return <>{children ?? <Outlet />}</>;
}

// ============================================
// PRE-CONFIGURED GUARDS
// ============================================

/**
 * Guard that only requires authentication (no specific access level)
 */
export function AuthenticatedRoute({ children }: { children?: ReactNode }) {
  return <RouteGuard requireAuth>{children}</RouteGuard>;
}

/**
 * Guard that requires Pulse access (or higher)
 */
export function PulseAccessRoute({ children }: { children?: ReactNode }) {
  return (
    <RouteGuard requireAuth requireAccess="pulse">
      {children}
    </RouteGuard>
  );
}

/**
 * Guard that requires Deep Dive access
 */
export function DeepDiveAccessRoute({ children }: { children?: ReactNode }) {
  return (
    <RouteGuard requireAuth requireAccess="deep_dive">
      {children}
    </RouteGuard>
  );
}

// ============================================
// LAYOUT GUARDS (for use with nested routes)
// ============================================

/**
 * Layout guard for routes that require authentication
 * Use with React Router's nested routes
 *
 * @example
 * <Route element={<AuthenticatedLayout />}>
 *   <Route path="/dashboard" element={<Dashboard />} />
 * </Route>
 */
export function AuthenticatedLayout() {
  return <RouteGuard requireAuth />;
}

/**
 * Layout guard for routes that require Pulse access
 */
export function PulseAccessLayout() {
  return <RouteGuard requireAuth requireAccess="pulse" />;
}

/**
 * Layout guard for routes that require Deep Dive access
 */
export function DeepDiveAccessLayout() {
  return <RouteGuard requireAuth requireAccess="deep_dive" />;
}
