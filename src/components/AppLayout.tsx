/**
 * AppLayout Component
 *
 * Provides consistent navigation across all pages with the NavBar and Sidebar.
 * Used to wrap pages that should have the global navigation.
 *
 * Accessibility features:
 * - Skip link for keyboard users to bypass navigation
 * - Proper ARIA landmarks for screen reader navigation
 */

import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { BackToTop } from './BackToTop';
import { TabBlockedOverlay } from './TabBlockedOverlay';
import { OrgPresenceBanner } from './OrgPresenceBanner';
import { StorageWarningBanner } from './StorageWarningBanner';
import { OfflineBanner } from './OfflineBanner';
import { SyncErrorBanner } from './SyncErrorBanner';
import { useTabLock } from '../hooks/useTabLock';
import { useAuth } from '../contexts/AuthContext';
import { useCloudSync } from '../hooks/useCloudSync';
import '../styles/dashboard.css';

// Pages that should NOT have the global nav bar (entry/onboarding pages)
const PAGES_WITHOUT_NAV = ['/', '/disclaimer', '/pricing'];

// Pages that should have the sidebar (authenticated/working pages)
// Note: /dashboard has its own built-in sidebar, so it's excluded
const PAGES_WITH_SIDEBAR = [
  '/dashboard',
  '/discovery/summary',
  '/assessment',
  '/evidence',
  '/activity',
  '/questions',
  '/constraints',
  '/report',
  '/diap',
  '/clarify',
  '/resources',
  '/training',
  '/action/',
  '/authority',
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [routeAnnouncement, setRouteAnnouncement] = useState('');
  const showNav = !PAGES_WITHOUT_NAV.includes(location.pathname);
  const { user, accessState } = useAuth();
  const { isBlocked, forceUnlock } = useTabLock();
  // Re-enabled cloud sync (2026-04-15) after fixing sync_metadata 409 via onConflict option
  useCloudSync(user?.id, accessState.organisation?.id);
  const activeMembers: { userId: string; email: string; deviceLabel: string; lastSeenAt: string }[] = [];

  // Workshop participants (training_hub_only): redirect any non-allowed route to the AI Comms course.
  // Auth and landing routes stay open so they can sign in and sign out.
  useEffect(() => {
    const isTrainingHubOnly = accessState.organisation?.training_hub_only === true;
    if (!isTrainingHubOnly) return;
    const allowedPrefixes = ['/training/course/ai-accessible-comms', '/training/resource'];
    const openPaths = ['/', '/disclaimer', '/login', '/pricing', '/accessibility'];
    const isOnAllowed = allowedPrefixes.some(p => location.pathname.startsWith(p));
    const isOnOpen = openPaths.includes(location.pathname);
    if (!isOnAllowed && !isOnOpen) {
      navigate('/training/course/ai-accessible-comms', { replace: true });
    }
  }, [accessState.organisation?.training_hub_only, location.pathname, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRouteAnnouncement(document.title || '');
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Check if current path should show sidebar
  const showSidebar = PAGES_WITH_SIDEBAR.some(path =>
    location.pathname === path || location.pathname.startsWith(path)
  );

  // Tab lock blocks everything
  if (isBlocked) {
    return <TabBlockedOverlay onForceOpen={forceUnlock} />;
  }

  return (
    <>
      {/* Route change announcer for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {routeAnnouncement}
      </div>

      {/* Skip link for keyboard navigation - MUST be first focusable element */}
      <a
        href="#main-content"
        className="skip-link"
        tabIndex={1}
        onClick={() => {
          // Small delay to let native hash navigation happen first
          setTimeout(() => {
            const main = document.getElementById('main-content');
            if (main) {
              main.setAttribute('tabindex', '-1');
              main.focus();
              // Find first focusable element inside main and announce
              const firstFocusable = main.querySelector<HTMLElement>(
                'h1, h2, h3, [tabindex], a, button, input, select, textarea'
              );
              if (firstFocusable) {
                firstFocusable.focus();
              }
            }
          }, 50);
        }}
      >
        Skip to main content
      </a>

      {/* Org member presence banner */}
      {activeMembers.length > 0 && showNav && (
        <OrgPresenceBanner members={activeMembers} />
      )}

      <OfflineBanner />
      <StorageWarningBanner />
      <SyncErrorBanner />

      {showNav && <NavBar />}
      {showSidebar ? (
        <div className="dashboard-layout">
          <main id="main-content" className="dashboard-main" role="main" aria-label="Main content" tabIndex={-1}>
            <Outlet />
          </main>
          <Sidebar />
        </div>
      ) : (
        <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
          <Outlet />
        </main>
      )}

      {/* Mobile bottom tab bar - replaces sidebar on small screens */}
      {showNav && <BottomTabBar />}

      {showNav && <BackToTop />}

      {/* Device conflict resolution - disabled for stability */}
    </>
  );
}
