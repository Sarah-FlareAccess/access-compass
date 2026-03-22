import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, signOut } = useAuth();

  // Check if user is logged in via Supabase localStorage (fallback for timeout scenarios)
  const hasSupabaseSession = typeof window !== 'undefined' &&
    Object.keys(localStorage).some(key => key.startsWith('sb-') && key.includes('auth-token'));

  // User is authenticated if either AuthContext says so OR there's a Supabase session in localStorage
  const effectivelyAuthenticated = isAuthenticated || hasSupabaseSession;

  return (
    <nav className="main-nav" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="brand-link">
            <img src="/images/access-compass-logo.png" alt="Access Compass" className="brand-logo" />
          </Link>
        </div>

        <div className="nav-auth">
          {effectivelyAuthenticated ? (
            <button
              onClick={() => {
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
  );
}
