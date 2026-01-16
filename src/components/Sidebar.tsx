/**
 * Sidebar Component
 *
 * Global navigation sidebar that appears on all authenticated pages.
 * Uses the same styling as the Dashboard sidebar for consistency.
 */

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../utils/session';
import '../styles/dashboard.css';

export function Sidebar() {
  const location = useLocation();
  const { accessState, user } = useAuth();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessionData = getSession();
    setSession(sessionData);
  }, [location.pathname]); // Re-fetch when route changes

  // Priority: Auth context org name > Session business snapshot > Email > Fallback
  // Filter out "Test Organisation" as it's a dev fallback
  const sessionOrgName = session?.business_snapshot?.organisation_name;
  const validSessionOrgName = sessionOrgName && sessionOrgName !== 'Test Organisation' ? sessionOrgName : null;

  const orgName = accessState.organisation?.name ||
    validSessionOrgName ||
    (user?.email ? user.email.split('@')[0] : null) ||
    'Your Organisation';

  // Only show role if user has an actual organisation membership
  const hasOrgMembership = !!accessState.membership?.role;
  const userRole = accessState.membership?.role === 'owner' ? 'Lead' :
    accessState.membership?.role === 'admin' ? 'Admin' : 'Contributor';

  return (
    <aside className="dashboard-sidebar">
      {/* Organisation Identity */}
      <div className="sidebar-org-identity">
        <div className="sidebar-org-info">
          <h2 className="sidebar-org-name">{orgName}</h2>
          {hasOrgMembership && <span className="sidebar-user-role">{userRole}</span>}
        </div>
      </div>

      {/* Main Navigation */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Navigation</h3>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="sidebar-nav-item sidebar-nav-featured">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </Link>
        </nav>
      </div>

      {/* Discovery Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Discovery</h3>
        <p className="sidebar-hint">Your business context and module selection</p>
        <nav className="sidebar-nav">
          <Link to="/discovery/summary" className="sidebar-nav-item sidebar-nav-featured">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            View Discovery Summary
          </Link>
          <Link to="/discovery" className="sidebar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Edit Discovery
          </Link>
        </nav>
      </div>

      {/* Outputs Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Your Outputs</h3>
        <nav className="sidebar-nav">
          <Link to="/export" className="sidebar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Accessibility Report
          </Link>
          <Link to="/diap" className="sidebar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            DIAP Workspace
          </Link>
        </nav>
      </div>

      {/* Resources Section */}
      <div className="sidebar-section">
        <h3 className="sidebar-section-title">Resources</h3>
        <nav className="sidebar-nav">
          <Link to="/resources" className="sidebar-nav-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            Resource Centre
          </Link>
        </nav>
      </div>

      {/* Help Section */}
      <div className="sidebar-section sidebar-help">
        <h3 className="sidebar-section-title">Need Help?</h3>
        <p className="sidebar-hint">Questions about accessibility auditing or using Access Compass?</p>
        <a href="mailto:support@accesscompass.com.au" className="sidebar-help-link">
          Contact Support
        </a>
      </div>
    </aside>
  );
}
