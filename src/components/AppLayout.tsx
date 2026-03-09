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
import '../styles/dashboard.css';

// Pages that should NOT have the global nav bar (entry/onboarding pages)
const PAGES_WITHOUT_NAV = ['/', '/disclaimer'];

// Pages that should have the sidebar (authenticated/working pages)
// Note: /dashboard has its own built-in sidebar, so it's excluded
const PAGES_WITH_SIDEBAR = [
  '/modules',
  '/questions',
  '/constraints',
  '/report',
  '/diap',
  '/clarify',
  '/resources',
  '/training',
  '/action/',
];

export default function AppLayout() {
  const location = useLocation();
  const [routeAnnouncement, setRouteAnnouncement] = useState('');
  const showNav = !PAGES_WITHOUT_NAV.includes(location.pathname);

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

  return (
    <>
      {/* Route change announcer for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {routeAnnouncement}
      </div>

      {/* Skip link for keyboard navigation - allows users to bypass navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {showNav && <NavBar />}
      {showSidebar ? (
        <div className="dashboard-layout">
          <Sidebar />
          <main id="main-content" className="dashboard-main" role="main" aria-label="Main content" tabIndex={-1}>
            <Outlet />
          </main>
        </div>
      ) : (
        <main id="main-content" role="main" aria-label="Main content" tabIndex={-1}>
          <Outlet />
        </main>
      )}

      {/* Mobile bottom tab bar - replaces sidebar on small screens */}
      {showNav && <BottomTabBar />}

      {showNav && <BackToTop />}
    </>
  );
}
