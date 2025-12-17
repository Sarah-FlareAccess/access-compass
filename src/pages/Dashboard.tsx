/**
 * Dashboard - Primary Working Hub
 *
 * The dashboard is where users return repeatedly to:
 * - Continue their assessment
 * - Manage progress across modules
 * - Access outputs (Report, DIAP)
 * - View and manage evidence
 * - Review/refine discovery responses
 *
 * This is NOT a summary screen - it's the central navigation point.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { accessModules, moduleGroups } from '../data/accessModules';
import type { AccessModule } from '../data/accessModules';
import '../styles/dashboard.css';

type TabType = 'modules' | 'evidence';

interface ModuleWithProgress {
  module: AccessModule;
  status: 'not-started' | 'in-progress' | 'completed';
  answeredCount: number;
  totalQuestions: number;
  doingWellCount: number;
  actionCount: number;
}

interface ModuleGroupWithProgress {
  id: string;
  label: string;
  description: string;
  modules: ModuleWithProgress[];
  completedCount: number;
  totalCount: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('modules');

  // Get recommended modules from discovery, falling back to selected modules
  const recommendedModuleIds: string[] = useMemo(() => {
    // Backward compatibility: map old codes to new codes
    const normalizeCode = (code: string): string => {
      const codeMap: Record<string, string> = {
        'A3': 'A3a',   // Old internal movement -> Paths and aisles
        'A7': 'A6',    // Old sensory environment code (if used)
        'A6': 'A5',    // Map old A6 toilets to new A5
      };
      return codeMap[code] || code;
    };

    // First try recommended modules from discovery
    if (discoveryData?.recommended_modules?.length > 0) {
      return discoveryData.recommended_modules.map(normalizeCode);
    }
    // Fall back to selected modules from session
    if (session?.selected_modules?.length > 0) {
      return session.selected_modules.map(normalizeCode);
    }
    // If nothing selected, show all modules
    return accessModules.map(m => m.id);
  }, [discoveryData, session]);

  // Module progress hook
  const { progress, isLoading: progressLoading, getOverallProgress } = useModuleProgress(recommendedModuleIds);

  // DIAP management hook
  const { items: diapItems, getStats: getDIAPStats } = useDIAPManagement();

  // Load session and discovery data
  useEffect(() => {
    const currentSession = getSession();
    const currentDiscovery = getDiscoveryData();

    if (!currentSession || !currentSession.session_id) {
      navigate('/');
      return;
    }

    setSession(currentSession);
    setDiscoveryData(currentDiscovery);
  }, [navigate]);

  // Organize modules by group with progress
  const groupedModules = useMemo((): ModuleGroupWithProgress[] => {
    return moduleGroups.map(group => {
      const groupModules = accessModules
        .filter(m => m.group === group.id)
        // Match by both module ID (e.g., 'M05') and code (e.g., 'A1')
        .filter(m => recommendedModuleIds.includes(m.id) || recommendedModuleIds.includes(m.code))
        .map(module => {
          const moduleProgress = progress[module.id];
          return {
            module,
            status: moduleProgress?.status || 'not-started',
            answeredCount: moduleProgress?.answeredQuestions || 0,
            totalQuestions: moduleProgress?.totalQuestions || module.questions.length,
            doingWellCount: moduleProgress?.summary?.doingWell?.length || 0,
            actionCount: moduleProgress?.summary?.priorityActions?.length || 0,
          };
        });

      const completedCount = groupModules.filter(m => m.status === 'completed').length;

      return {
        id: group.id,
        label: group.label,
        description: group.description,
        modules: groupModules,
        completedCount,
        totalCount: groupModules.length,
      };
    }).filter(g => g.modules.length > 0);
  }, [recommendedModuleIds, progress]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const diapStats = getDIAPStats();

    const totalModules = groupedModules.reduce((sum, g) => sum + g.totalCount, 0);
    const completedModules = groupedModules.reduce((sum, g) => sum + g.completedCount, 0);
    const inProgressModules = groupedModules.reduce(
      (sum, g) => sum + g.modules.filter(m => m.status === 'in-progress').length,
      0
    );

    return {
      modulesCompleted: completedModules,
      modulesInProgress: inProgressModules,
      modulesNotStarted: totalModules - completedModules - inProgressModules,
      modulesTotal: totalModules,
      progressPercentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      diapItemCount: diapStats.total,
    };
  }, [groupedModules, getDIAPStats]);

  // Get action button text and style based on status
  const getActionButton = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'not-started':
        return { text: 'Start', className: 'btn-start' };
      case 'in-progress':
        return { text: 'Continue', className: 'btn-continue' };
      case 'completed':
        return { text: 'Review', className: 'btn-review' };
    }
  };

  if (!session || progressLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const orgName = session?.business_snapshot?.organisation_name || 'there';
  const hasCompletedModules = overallStats.modulesCompleted > 0;
  const hasDIAPItems = overallStats.diapItemCount > 0;
  const reviewMode = discoveryData?.review_mode || 'pulse-check';

  return (
    <div className="dashboard-page">
      {/* Global Header */}
      <header className="dashboard-global-header">
        <div className="header-brand">
          <span className="brand-name">Access Compass</span>
          <span className="brand-byline">by Flare Access</span>
        </div>
        <div className="header-actions">
          <Link
            to="/export"
            className={`header-action-btn ${!hasCompletedModules ? 'disabled' : ''}`}
          >
            View Report
          </Link>
          <Link
            to="/diap"
            className={`header-action-btn ${!hasDIAPItems ? 'disabled' : ''}`}
          >
            View DIAP
          </Link>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Welcome + Context */}
          <section className="welcome-section">
            <h1 className="welcome-title">Welcome back, {orgName}</h1>
            <p className="welcome-subtitle">Continue your accessibility self-audit below.</p>
          </section>

          {/* Overall Progress Card */}
          <section className="progress-section">
            <div className="progress-card">
              <div className="progress-header">
                <h2 className="progress-title">Overall Progress</h2>
                <span className="progress-count">
                  {overallStats.modulesCompleted} of {overallStats.modulesTotal} modules completed
                </span>
              </div>
              <div className="progress-bar-wrapper">
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${overallStats.progressPercentage}%` }}
                  />
                </div>
                <span className="progress-percentage">{overallStats.progressPercentage}%</span>
              </div>

              {/* Progress Status Summary */}
              <div className="progress-status-summary">
                <div className="status-item status-completed">
                  <span className="status-dot"></span>
                  <span className="status-count">{overallStats.modulesCompleted}</span>
                  <span className="status-label">Completed</span>
                </div>
                <div className="status-item status-in-progress">
                  <span className="status-dot"></span>
                  <span className="status-count">{overallStats.modulesInProgress}</span>
                  <span className="status-label">In progress</span>
                </div>
                <div className="status-item status-not-started">
                  <span className="status-dot"></span>
                  <span className="status-count">{overallStats.modulesNotStarted}</span>
                  <span className="status-label">Not started</span>
                </div>
              </div>
            </div>
          </section>

          {/* Review Discovery Option */}
          <section className="discovery-review-section">
            <div className="discovery-review-card">
              <div className="review-content">
                <span className="review-icon">🔍</span>
                <div className="review-text">
                  <p className="review-label">
                    Your pathway: <strong>{reviewMode === 'deep-dive' ? 'Deep Dive' : 'Pulse Check'}</strong>
                  </p>
                  <p className="review-hint">
                    You can revisit or refine your discovery responses anytime.
                  </p>
                </div>
              </div>
              <Link to="/discovery" className="review-btn">
                Review Discovery
              </Link>
            </div>
          </section>

          {/* Navigation Tabs */}
          <nav className="dashboard-tabs">
            <button
              className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => setActiveTab('modules')}
            >
              Modules
            </button>
            <button
              className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              Evidence Library
            </button>
          </nav>

          {/* Tab Content */}
          {activeTab === 'modules' && (
            <div className="modules-content">
              {groupedModules.map(group => (
                <section key={group.id} className="module-group">
                  <div className="group-header">
                    <div className="group-info">
                      <h3 className="group-title">{group.label}</h3>
                      <p className="group-description">{group.description}</p>
                    </div>
                    <div className="group-progress">
                      <span className="group-counter">
                        {group.completedCount}/{group.totalCount}
                      </span>
                      <div className="group-progress-bar">
                        <div
                          className="group-progress-fill"
                          style={{ width: `${group.totalCount > 0 ? (group.completedCount / group.totalCount) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="module-tiles">
                    {group.modules.map(({ module, status, answeredCount, totalQuestions, doingWellCount, actionCount }) => {
                      const action = getActionButton(status);
                      return (
                        <div key={module.id} className={`module-tile status-${status}`}>
                          {/* Status Indicator Bar */}
                          <div className={`status-bar status-${status}`}></div>

                          <div className="tile-content">
                            <div className="tile-header">
                              <span className="module-icon">{module.icon}</span>
                              <span className={`status-badge status-${status}`}>
                                {status === 'not-started' && 'Not started'}
                                {status === 'in-progress' && 'In progress'}
                                {status === 'completed' && 'Completed'}
                              </span>
                            </div>

                            <h4 className="module-title">{module.name}</h4>
                            <p className="module-description">{module.description}</p>

                            <div className="module-meta">
                              <span className="module-time">
                                <span className="time-icon">⏱</span>
                                {module.estimatedTime}–{module.estimatedTime + 5} min
                              </span>
                            </div>

                            {/* Progress indicator for in-progress modules */}
                            {status === 'in-progress' && (
                              <div className="module-progress-indicator">
                                <div className="mini-progress-bar">
                                  <div
                                    className="mini-progress-fill"
                                    style={{ width: `${totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0}%` }}
                                  />
                                </div>
                                <span className="progress-text">{answeredCount}/{totalQuestions} questions</span>
                              </div>
                            )}

                            {/* Results for completed modules */}
                            {status === 'completed' && (
                              <div className="module-results">
                                <span className="result-good">{doingWellCount} doing well</span>
                                <span className="result-actions">{actionCount} actions</span>
                              </div>
                            )}

                            <Link
                              to={`/questions?module=${module.id}`}
                              className={`module-action-btn ${action.className}`}
                            >
                              {action.text}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}

              {/* Subtle Guidance Footer */}
              <footer className="guidance-footer">
                <p>You don't need to complete every module to get value. Focus on what matters most to your customers.</p>
              </footer>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-content">
              <div className="evidence-empty">
                <div className="evidence-icon">📁</div>
                <h3>Evidence Library</h3>
                <p>
                  As you complete module reviews, you can upload photos, documents, and links
                  to support your accessibility improvements.
                </p>
                <p className="evidence-note">
                  Evidence is linked to specific modules and actions, helping you track
                  progress and demonstrate compliance over time.
                </p>
                {hasCompletedModules ? (
                  <Link to="/questions" className="evidence-action-btn">
                    Continue reviewing modules
                  </Link>
                ) : (
                  <p className="evidence-hint">
                    Start a module review to begin adding evidence.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
