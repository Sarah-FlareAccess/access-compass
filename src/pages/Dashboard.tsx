/**
 * Dashboard - Primary Working Hub
 *
 * The dashboard is where users return repeatedly to:
 * - Continue their assessment
 * - Manage progress across modules
 * - Access outputs (Report, DIAP)
 * - View and manage evidence
 *
 * This is NOT a summary screen - it's the central navigation point.
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { accessModules, moduleGroups, getModulesByGroup } from '../data/accessModules';
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

  // Get selected modules from session
  const selectedModuleIds: string[] = useMemo(() => {
    if (!session?.selected_modules) return [];
    return session.selected_modules;
  }, [session]);

  // Module progress hook
  const { progress, isLoading: progressLoading, getOverallProgress } = useModuleProgress(selectedModuleIds);

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
        .filter(m => selectedModuleIds.length === 0 || selectedModuleIds.includes(m.id))
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
  }, [selectedModuleIds, progress]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const overall = getOverallProgress();
    const diapStats = getDIAPStats();

    // Count total modules across all groups
    const totalModules = groupedModules.reduce((sum, g) => sum + g.totalCount, 0);
    const completedModules = groupedModules.reduce((sum, g) => sum + g.completedCount, 0);

    return {
      modulesCompleted: completedModules,
      modulesTotal: totalModules,
      progressPercentage: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
      diapItemCount: diapStats.total,
    };
  }, [groupedModules, getOverallProgress, getDIAPStats]);

  // Get action button text based on status
  const getActionText = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'not-started': return 'Start';
      case 'in-progress': return 'Continue';
      case 'completed': return 'Review';
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
                    <span className="group-counter">
                      {group.completedCount}/{group.totalCount}
                    </span>
                  </div>

                  <div className="module-cards">
                    {group.modules.map(({ module, status, answeredCount, totalQuestions, doingWellCount, actionCount }) => (
                      <div key={module.id} className={`module-card status-${status}`}>
                        <div className="module-card-header">
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
                          <span className="module-time">{module.estimatedTime}–{module.estimatedTime + 5} min</span>
                          {status === 'in-progress' && (
                            <span className="module-progress-text">
                              {answeredCount}/{totalQuestions} questions
                            </span>
                          )}
                          {status === 'completed' && (
                            <span className="module-results-text">
                              {doingWellCount} good · {actionCount} actions
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/questions?module=${module.id}`}
                          className={`module-action-btn status-${status}`}
                        >
                          {getActionText(status)}
                        </Link>
                      </div>
                    ))}
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
