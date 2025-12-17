import { Link, useLocation } from 'react-router-dom';
import { getSession } from '../utils/session';
import './NavBar.css';

export default function NavBar() {
  const location = useLocation();
  const session = getSession();
  const orgName = session?.business_snapshot?.organisation_name;

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
              to="/diap"
              className={`nav-link ${isActive('/diap') ? 'active' : ''}`}
            >
              DIAP
            </Link>
          </div>

          {orgName && (
            <span className="nav-divider"></span>
          )}

          <div className="nav-auth">
            {orgName ? (
              <span className="user-greeting">{orgName}</span>
            ) : (
              <Link to="/start" className="nav-link sign-in">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
