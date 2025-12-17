/**
 * AppLayout Component
 *
 * Provides consistent navigation across all pages with the NavBar.
 * Used to wrap pages that should have the global navigation header.
 */

import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';

// Pages that should NOT have the global nav bar (entry/onboarding pages)
const PAGES_WITHOUT_NAV = ['/', '/disclaimer'];

export default function AppLayout() {
  const location = useLocation();
  const showNav = !PAGES_WITHOUT_NAV.includes(location.pathname);

  return (
    <>
      {showNav && <NavBar />}
      <Outlet />
    </>
  );
}
