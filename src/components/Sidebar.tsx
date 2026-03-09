/**
 * Sidebar Component
 *
 * Global navigation sidebar that appears on all authenticated pages.
 * Uses the same styling as the Dashboard sidebar for consistency.
 */

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSession } from '../utils/session';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useAlerts } from '../hooks/useAlerts';
import { OrgAdminPanel } from './OrgAdminPanel';
import { ReportProblem, ReportProblemTrigger } from './ReportProblem';
import '../styles/dashboard.css';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { accessState, user } = useAuth();
  const { canInstall, triggerInstall } = useInstallPrompt();
  const { alerts, unreadCount, markAsRead, markAllAsRead } = useAlerts();
  const [session, setSession] = useState<any>(null);
  const [showReportProblem, setShowReportProblem] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const alertsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessionData = getSession();
    setSession(sessionData);
  }, [location.pathname]); // Re-fetch when route changes

  // Close alerts dropdown on click outside
  useEffect(() => {
    if (!showAlerts) return;
    const handleClick = (e: MouseEvent) => {
      if (alertsRef.current && !alertsRef.current.contains(e.target as Node)) {
        setShowAlerts(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAlerts]);

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
        <Link to="/report" className="sidebar-nav-item" aria-current={location.pathname === '/report' ? 'page' : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          Report
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

      {/* Alerts */}
      <div className="sidebar-alerts-wrapper" ref={alertsRef}>
        <button
          type="button"
          className="sidebar-alerts-btn"
          onClick={() => setShowAlerts(!showAlerts)}
          aria-label={`Alerts${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
          aria-expanded={showAlerts}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          Alerts
          {unreadCount > 0 && (
            <span className="sidebar-alerts-badge" aria-hidden="true">{unreadCount}</span>
          )}
        </button>

        {showAlerts && (
          <div className="sidebar-alerts-dropdown" role="region" aria-label="Alerts">
            <div className="alerts-dropdown-header">
              <strong>Alerts</strong>
              {unreadCount > 0 && (
                <button type="button" className="alerts-mark-read" onClick={markAllAsRead}>
                  Mark all read
                </button>
              )}
            </div>
            {alerts.length === 0 ? (
              <p className="alerts-empty">No alerts</p>
            ) : (
              <ul className="alerts-list">
                {alerts.map(alert => (
                  <li key={alert.id} className={`alerts-item ${alert.read ? 'read' : 'unread'}`}>
                    <button
                      type="button"
                      className="alerts-item-btn"
                      onClick={() => {
                        markAsRead(alert.id);
                        if (alert.link) navigate(alert.link);
                        setShowAlerts(false);
                      }}
                    >
                      <span className="alerts-item-icon" aria-hidden="true">
                        {alert.type === 'diap-change' ? '⚠' : alert.type === 'training' ? '🎓' : alert.type === 'workshop' ? '📅' : '📢'}
                      </span>
                      <span className="alerts-item-content">
                        <span className="alerts-item-title">{alert.title}</span>
                        <span className="alerts-item-message">{alert.message}</span>
                      </span>
                      {!alert.read && <span className="alerts-unread-dot" aria-label="Unread" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="sidebar-section sidebar-help">
        <div className="sidebar-section-title">Need help?</div>
        <p className="sidebar-hint">Questions about accessibility auditing or using Access Compass?</p>
        <ReportProblemTrigger variant="sidebar" onClick={() => setShowReportProblem(true)} />
        <a href="mailto:support@accesscompass.com.au" className="sidebar-help-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginRight: '6px', verticalAlign: '-2px' }}>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
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

      <ReportProblem
        isOpen={showReportProblem}
        onClose={() => setShowReportProblem(false)}
      />
    </aside>
  );
}
