import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  // Check if user is logged in via Supabase localStorage (fallback for timeout scenarios)
  const hasSupabaseSession = typeof window !== 'undefined' &&
    Object.keys(localStorage).some(key => key.startsWith('sb-') && key.includes('auth-token'));

  // User is authenticated if either AuthContext says so OR there's a Supabase session in localStorage
  const effectivelyAuthenticated = isAuthenticated || hasSupabaseSession;

  const isActive = (path: string) => location.pathname === path;

  const closeMobileMenu = () => setMobileMenuOpen(false);

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

        <div className={`nav-right ${mobileMenuOpen ? 'mobile-open' : ''}`} id="nav-menu">
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
