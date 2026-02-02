/**
 * BottomTabBar Component
 *
 * Mobile-only bottom navigation bar that replaces the sidebar on small screens.
 * Conditionally shows different items based on user state:
 * - First-time users (no modules): Just Help
 * - Returning users (has modules): Dashboard, DIAP (if deep_dive), Report, Resources
 *
 * Access levels:
 * - 'pulse' (pulse check): No DIAP access
 * - 'deep_dive': Full access including DIAP
 *
 * Accessibility features:
 * - aria-label on nav element
 * - aria-current="page" on active tab
 * - Minimum 48px touch targets
 * - Visible focus indicators
 * - Respects prefers-reduced-motion
 */

import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSession, getDiscoveryData } from '../utils/session';
import { useAuth } from '../contexts/AuthContext';
import { HelpSheet } from './HelpSheet';
import './BottomTabBar.css';

// Icons as inline SVGs for consistency
const DashboardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7"/>
    <rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/>
  </svg>
);

const DIAPIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9"/>
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const ResourcesIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

interface TabItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  matchPaths?: string[]; // Additional paths that should highlight this tab
  action?: 'help'; // Special action instead of navigation
}

export function BottomTabBar() {
  const location = useLocation();
  const { accessState } = useAuth();
  const [hasModules, setHasModules] = useState<boolean | null>(null);
  const [helpSheetOpen, setHelpSheetOpen] = useState(false);

  // Check if user has deep_dive access (required for DIAP)
  const hasDeepDiveAccess = accessState.accessLevel === 'deep_dive';

  useEffect(() => {
    const session = getSession();
    const discoveryData = getDiscoveryData();

    // Check if user has selected/recommended modules
    const hasSelectedModules = (session?.selected_modules?.length ?? 0) > 0;
    const hasRecommendedModules = (discoveryData?.recommended_modules?.length ?? 0) > 0;

    setHasModules(hasSelectedModules || hasRecommendedModules);
  }, [location.pathname]); // Re-check when route changes

  // Don't render until we know the user state
  if (hasModules === null) {
    return null;
  }

  // Define tabs based on user state and access level
  const tabsWithModules: TabItem[] = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <DashboardIcon />
    },
    // Only show DIAP tab for users with deep_dive access
    ...(hasDeepDiveAccess ? [{
      path: '/diap',
      label: 'DIAP',
      icon: <DIAPIcon />
    }] : []),
    {
      path: '/export',
      label: 'Report',
      icon: <ReportIcon />
    },
    {
      path: '/resources',
      label: 'Resources',
      icon: <ResourcesIcon />
    },
  ];

  const tabsWithoutModules: TabItem[] = [
    {
      path: '#help',
      label: 'Help',
      icon: <HelpIcon />,
      action: 'help'
    },
  ];

  const tabs = hasModules ? tabsWithModules : tabsWithoutModules;

  const isActive = (tab: TabItem) => {
    if (location.pathname === tab.path) return true;
    if (tab.matchPaths?.some(p => location.pathname.startsWith(p))) return true;
    return false;
  };

  // Don't show tab bar on landing/onboarding pages
  const hideOnPages = ['/', '/disclaimer', '/login', '/auth/callback'];
  if (hideOnPages.includes(location.pathname)) {
    return null;
  }

  // For first-time users, only show tab bar if they're past the discovery intro
  if (!hasModules) {
    // During active discovery flow, show minimal help-only bar
    const inDiscoveryFlow = location.pathname.startsWith('/discovery') ||
                            location.pathname === '/start';
    if (!inDiscoveryFlow) {
      return null; // Don't show tab bar on random pages if no modules
    }
  }

  return (
    <>
      <nav className="bottom-tab-bar" aria-label="Main navigation">
        <ul className="tab-bar-list" role="menubar">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const isExternal = tab.path.startsWith('mailto:') || tab.path.startsWith('http');
            const isAction = !!tab.action;

            return (
              <li key={tab.path} role="none">
                {isAction ? (
                  <button
                    className={`tab-bar-item ${active ? 'active' : ''}`}
                    onClick={() => {
                      if (tab.action === 'help') {
                        setHelpSheetOpen(true);
                      }
                    }}
                    role="menuitem"
                    aria-haspopup="dialog"
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                ) : isExternal ? (
                  <a
                    href={tab.path}
                    className={`tab-bar-item ${active ? 'active' : ''}`}
                    role="menuitem"
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </a>
                ) : (
                  <Link
                    to={tab.path}
                    className={`tab-bar-item ${active ? 'active' : ''}`}
                    aria-current={active ? 'page' : undefined}
                    role="menuitem"
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help Sheet for onboarding users */}
      <HelpSheet
        isOpen={helpSheetOpen}
        onClose={() => setHelpSheetOpen(false)}
      />
    </>
  );
}
