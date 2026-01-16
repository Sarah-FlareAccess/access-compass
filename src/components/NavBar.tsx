import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './NavBar.css';

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, user } = useAuth();

  // Check if user is logged in via Supabase localStorage (fallback for timeout scenarios)
  const hasSupabaseSession = typeof window !== 'undefined' &&
    Object.keys(localStorage).some(key => key.startsWith('sb-') && key.includes('auth-token'));

  // User is authenticated if either AuthContext says so OR there's a Supabase session in localStorage
  const effectivelyAuthenticated = isAuthenticated || hasSupabaseSession;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/dashboard" className="brand-link">
            <span className="brand-name">Access Compass</span>
            <span className="brand-byline">by Flare Access</span>
          </Link>
        </div>

        <div className="nav-right">
          <div className="nav-links">
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              Dashboard
            </Link>
            <Link
              to="/export"
              className={`nav-link ${isActive('/export') ? 'active' : ''}`}
            >
              Report
            </Link>
            <Link
              to="/resources"
              className={`nav-link ${isActive('/resources') ? 'active' : ''}`}
            >
              Resources
            </Link>
            <Link
              to="/diap"
              className={`nav-link ${isActive('/diap') ? 'active' : ''}`}
            >
              DIAP
            </Link>
          </div>

          <div className="nav-auth">
            {effectivelyAuthenticated ? (
              <>
                {user?.email && <span className="user-greeting">{user.email}</span>}
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
                  Logout
                </button>
              </>
            ) : (
              <Link to="/disclaimer" className="nav-link sign-in">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
