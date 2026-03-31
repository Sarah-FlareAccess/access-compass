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
import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Sidebar } from './Sidebar';
import { BottomTabBar } from './BottomTabBar';
import { BackToTop } from './BackToTop';
import { DeviceConflictAlert } from './DeviceConflictAlert';
import { TabBlockedOverlay } from './TabBlockedOverlay';
import { OrgPresenceBanner } from './OrgPresenceBanner';
import { useCloudSync } from '../hooks/useCloudSync';
import { useTabLock } from '../hooks/useTabLock';
import { useOrgPresence } from '../hooks/useOrgPresence';
import { useAuth } from '../contexts/AuthContext';
import '../styles/dashboard.css';

// Pages that should NOT have the global nav bar (entry/onboarding pages)
const PAGES_WITHOUT_NAV = ['/', '/disclaimer', '/pricing'];

// Pages that should have the sidebar (authenticated/working pages)
// Note: /dashboard has its own built-in sidebar, so it's excluded
const PAGES_WITH_SIDEBAR = [
  '/dashboard',
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
  const [routeAnnouncement, setRouteAnnouncement] = useState('');
  const showNav = !PAGES_WITHOUT_NAV.includes(location.pathname);
  const { user, accessState } = useAuth();
  const { isBlocked, forceUnlock } = useTabLock();
  const {
    conflictDetected,
    conflictDevice,
    resolveConflict,
    dismissConflict,
  } = useCloudSync(user?.id, accessState.organisation?.id);
  const { activeMembers } = useOrgPresence(user?.id, accessState.organisation?.id);

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

      {/* Device conflict resolution modal */}
      {conflictDetected && conflictDevice && (
        <DeviceConflictAlert
          otherDeviceLabel={conflictDevice.label}
          otherDeviceSyncTime={conflictDevice.lastSyncedAt}
          onUseCloud={() => resolveConflict('use-cloud')}
          onKeepLocal={() => resolveConflict('use-local')}
          onDismiss={dismissConflict}
        />
      )}
    </>
  );
}
