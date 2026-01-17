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

import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { Sidebar } from './Sidebar';
import '../styles/dashboard.css';

// Pages that should NOT have the global nav bar (entry/onboarding pages)
const PAGES_WITHOUT_NAV = ['/', '/disclaimer'];

// Pages that should have the sidebar (authenticated/working pages)
// Note: /dashboard has its own built-in sidebar, so it's excluded
const PAGES_WITH_SIDEBAR = [
  '/modules',
  '/questions',
  '/constraints',
  '/discovery',
  '/discovery/summary',
  '/export',
  '/diap',
  '/clarify',
  '/resources',
  '/action/',
];

export default function AppLayout() {
  const location = useLocation();
  const showNav = !PAGES_WITHOUT_NAV.includes(location.pathname);

  // Check if current path should show sidebar
  const showSidebar = PAGES_WITH_SIDEBAR.some(path =>
    location.pathname === path || location.pathname.startsWith(path)
  );

  return (
    <>
      {/* Skip link for keyboard navigation - allows users to bypass navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {showNav && <NavBar />}
      {showSidebar ? (
        <div className="dashboard-layout">
          <Sidebar />
          <main id="main-content" className="dashboard-main" role="main" aria-label="Main content">
            <Outlet />
          </main>
        </div>
      ) : (
        <main id="main-content" role="main" aria-label="Main content">
          <Outlet />
        </main>
      )}
    </>
  );
}
