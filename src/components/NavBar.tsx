import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // Check if user is logged in via Supabase localStorage (fallback for timeout scenarios)
  const hasSupabaseSession = typeof window !== 'undefined' &&
    Object.keys(localStorage).some(key => key.startsWith('sb-') && key.includes('auth-token'));

  // User is authenticated if either AuthContext says so OR there's a Supabase session in localStorage
  const effectivelyAuthenticated = isAuthenticated || hasSupabaseSession;

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    // Return focus to the menu button when closing
    menuButtonRef.current?.focus();
  }, []);

  // Handle Escape key and focus trap for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    // Focus first menu item when opening
    const firstLink = menuRef.current?.querySelector('a, button') as HTMLElement;
    firstLink?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        return;
      }
      if (event.key === 'Tab' && menuRef.current && menuButtonRef.current) {
        const menuItems = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')
        );
        const allFocusable = [menuButtonRef.current as HTMLElement, ...menuItems];
        if (allFocusable.length === 0) return;
        const first = allFocusable[0];
        const last = allFocusable[allFocusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        closeMobileMenu();
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  return (
    <nav className="main-nav" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link" onClick={closeMobileMenu}>
            <span className="brand-name">Access Compass</span>
            <span className="brand-byline">by Flare Access</span>
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          ref={menuButtonRef}
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-controls="nav-menu"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div
          ref={menuRef}
          className={`nav-right ${mobileMenuOpen ? 'mobile-open' : ''}`}
          id="nav-menu"
        >
          <div className="nav-links">
            {isActive('/dashboard') ? (
              <span className="nav-link active" aria-current="page">
                Dashboard
              </span>
            ) : (
              <Link to="/dashboard" className="nav-link" onClick={closeMobileMenu}>
                Dashboard
              </Link>
            )}
            {location.pathname.startsWith('/discovery') ? (
              <span className="nav-link active" aria-current="page">
                Discovery
              </span>
            ) : (
              <Link to="/discovery/summary" className="nav-link" onClick={closeMobileMenu}>
                Discovery
              </Link>
            )}
            {isActive('/resources') ? (
              <span className="nav-link active" aria-current="page">
                Resources
              </span>
            ) : (
              <Link to="/resources" className="nav-link" onClick={closeMobileMenu}>
                Resources
              </Link>
            )}
          </div>

          {/* Mobile-only help link */}
          <div className="nav-help-mobile">
            <a
              href="mailto:support@accesscompass.com.au"
              className="nav-link nav-help-link"
              onClick={closeMobileMenu}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              Need Help?
            </a>
          </div>

          <div className="nav-auth">
            {effectivelyAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    // Clear localStorage auth data directly to handle timeout scenarios
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith('sb-') || key.includes('supabase')) {
                        localStorage.removeItem(key);
                      }
                    });
                    sessionStorage.clear();
                    signOut();
                    navigate('/');
                  }}
                  className="nav-link logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/disclaimer" className="nav-link sign-in" onClick={closeMobileMenu}>
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
