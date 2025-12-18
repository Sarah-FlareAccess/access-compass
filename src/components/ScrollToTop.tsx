/**
 * ScrollToTop Component
 *
 * Automatically scrolls to the top of the page on route changes.
 * Place this component inside the Router to enable global scroll behavior.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use 'instant' to avoid jarring smooth scroll on page transition
    });
  }, [pathname]);

  return null;
}
