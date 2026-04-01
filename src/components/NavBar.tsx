import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is logged in via Supabase localStorage (fallback for timeout scenarios)
  const hasSupabaseSession = typeof window !== 'undefined' &&
    Object.keys(localStorage).some(key => key.startsWith('sb-') && key.includes('auth-token'));

  // User is authenticated if either AuthContext says so OR there's a Supabase session in localStorage
  const effectivelyAuthenticated = isAuthenticated || hasSupabaseSession;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const toggleMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  return (
    <>
      <nav className="main-nav" aria-label="Main navigation">
        <div className="nav-container">
          <div className="nav-brand">
            {effectivelyAuthenticated && (
              <button
                type="button"
                className="hamburger-btn"
                onClick={toggleMenu}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-sidebar-drawer"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            )}
            <Link to="/" className="brand-link">
              <img src="/images/access-compass-logo.png" alt="Access Compass" className="brand-logo" />
            </Link>
          </div>

          <div className="nav-auth">
            {effectivelyAuthenticated ? (
              <button
                onClick={() => {
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
                Sign out
              </button>
            ) : (
              <Link to="/disclaimer" className="nav-link sign-in">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile sidebar drawer */}
      {effectivelyAuthenticated && (
        <>
          <div
            className={`mobile-sidebar-overlay ${mobileMenuOpen ? 'visible' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            id="mobile-sidebar-drawer"
            className={`mobile-sidebar-drawer ${mobileMenuOpen ? 'open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <Sidebar />
          </div>
        </>
      )}
    </>
  );
}
