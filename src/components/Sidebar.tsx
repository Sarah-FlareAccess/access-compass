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
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { OrgAdminPanel } from './OrgAdminPanel';
import '../styles/dashboard.css';

export function Sidebar() {
  const location = useLocation();
  const { accessState, user } = useAuth();
  const { canInstall, triggerInstall } = useInstallPrompt();
  const [session, setSession] = useState<any>(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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
    <aside className="dashboard-sidebar" role="complementary" aria-label="Sidebar navigation">
      {/* Organisation Identity */}
      <button
        type="button"
        className="sidebar-org-identity"
        onClick={() => setShowAdminPanel(true)}
        aria-label="Open organisation settings"
      >
        <div className="sidebar-org-info">
          <div className="sidebar-org-name">{orgName}</div>
          {hasOrgMembership && <span className="sidebar-user-role">{userRole}</span>}
        </div>
        <svg className="sidebar-org-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>

      <nav className="sidebar-nav" aria-label="Sidebar">
        {/* Dashboard */}
        <Link to="/dashboard" className="sidebar-nav-item sidebar-nav-featured" aria-current={location.pathname === '/dashboard' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Dashboard
        </Link>

        {/* Settings */}
        <div className="sidebar-section-title">Settings</div>
        <button
          type="button"
          className="sidebar-nav-item"
          onClick={() => setShowAdminPanel(true)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          Organisation Settings
        </button>

        {/* Discovery */}
        <div className="sidebar-section-title">Discovery</div>
        <Link to="/discovery/summary" className="sidebar-nav-item" aria-current={location.pathname === '/discovery/summary' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          Discovery
        </Link>

        {/* Your Outputs */}
        <div className="sidebar-section-title">Your Outputs</div>
        <Link to="/export" className="sidebar-nav-item" aria-current={location.pathname === '/export' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Accessibility Report
        </Link>
        <Link to="/diap" className="sidebar-nav-item" aria-current={location.pathname === '/diap' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
          DIAP Workspace
        </Link>

        {/* Learn */}
        <div className="sidebar-section-title">Learn</div>
        <Link to="/resources" className="sidebar-nav-item" aria-current={location.pathname === '/resources' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Resource Hub
        </Link>
        <Link to="/training" className="sidebar-nav-item" aria-current={location.pathname.startsWith('/training') ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
            <path d="M6 12v5c3 3 12 3 12 0v-5"/>
          </svg>
          Training Hub
        </Link>
      </nav>

      {/* Help Section */}
      <div className="sidebar-section sidebar-help">
        <div className="sidebar-section-title">Need help?</div>
        <p className="sidebar-hint">Questions about accessibility auditing or using Access Compass?</p>
        <a href="mailto:support@accesscompass.com.au" className="sidebar-help-link">
          Contact Support
        </a>
        {canInstall && (
          <button
            onClick={triggerInstall}
            className="sidebar-help-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', textAlign: 'left' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '6px', verticalAlign: '-2px' }}>
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </svg>
            Install app
          </button>
        )}
      </div>

      <OrgAdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />
    </aside>
  );
}
