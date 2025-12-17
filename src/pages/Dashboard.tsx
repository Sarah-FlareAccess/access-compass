/**
 * Dashboard Page
 *
 * Enhanced dashboard showing:
 * - Module progress organized by journey phase
 * - Overall accessibility score
 * - Priority actions from completed modules
 * - DIAP items preview
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { getModuleById, getModulesByGroup } from '../data/accessModules';
import type { JourneyPhase } from '../types';
import '../styles/dashboard.css';

interface JourneyGroup {
  phase: JourneyPhase;
  label: string;
  icon: string;
  modules: {
    id: string;
    name: string;
    code: string;
    status: 'not-started' | 'in-progress' | 'completed';
    doingWellCount: number;
    actionCount: number;
  }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);

  // Get selected modules from session
  const selectedModuleIds: string[] = useMemo(() => {
    if (!session?.selected_modules) return [];
    return session.selected_modules;
  }, [session]);

  // Module progress hook
  const { progress, isLoading: progressLoading, getOverallProgress } = useModuleProgress(selectedModuleIds);

  // DIAP management hook
  const { items: diapItems, isLoading: diapLoading, getStats } = useDIAPManagement();

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

  // Organize modules by journey phase
  const journeyGroups = useMemo((): JourneyGroup[] => {
    if (!selectedModuleIds.length) return [];

    const phases: { phase: JourneyPhase; label: string; icon: string }[] = [
      { phase: 'before-arrival', label: 'Before Arrival', icon: '🔍' },
      { phase: 'during-visit', label: 'During Visit', icon: '🏢' },
      { phase: 'after-visit', label: 'After Visit', icon: '📝' },
    ];

    return phases.map(({ phase, label, icon }) => {
      const groupModules = getModulesByGroup(
        phase === 'before-arrival' ? 'before' :
        phase === 'during-visit' ? 'during' : 'after'
      );

      const modules = groupModules
        .filter(m => selectedModuleIds.includes(m.id))
        .map(m => {
          const moduleProgress = progress[m.id];
          const summary = moduleProgress?.summary;

          return {
            id: m.id,
            name: m.name,
            code: m.code,
            status: moduleProgress?.status || 'not-started',
            doingWellCount: summary?.doingWell?.length || 0,
            actionCount: summary?.priorityActions?.length || 0,
          };
        });

      return { phase, label, icon, modules };
    }).filter(g => g.modules.length > 0);
  }, [selectedModuleIds, progress]);

  // Calculate statistics
  const stats = useMemo(() => {
    const overall = getOverallProgress();
    const diapStats = getStats();

    // Calculate doing well vs needs attention
    let doingWellTotal = 0;
    let actionsTotal = 0;
    let exploreTotal = 0;

    Object.values(progress).forEach(p => {
      if (p.summary) {
        doingWellTotal += p.summary.doingWell?.length || 0;
        actionsTotal += p.summary.priorityActions?.length || 0;
        exploreTotal += p.summary.areasToExplore?.length || 0;
      }
    });

    return {
      modulesCompleted: overall.completed,
      modulesTotal: overall.total,
      progressPercentage: overall.percentage,
      doingWellTotal,
      actionsTotal,
      exploreTotal,
      diapStats,
    };
  }, [progress, getOverallProgress, getStats]);

  // Get priority actions from all completed modules
  const priorityActions = useMemo(() => {
    const actions: { questionText: string; action: string; priority: string; module: string }[] = [];

    Object.values(progress).forEach(p => {
      if (p.summary?.priorityActions) {
        p.summary.priorityActions.forEach(a => {
          actions.push({
            questionText: a.questionText,
            action: a.action,
            priority: a.priority,
            module: p.moduleCode,
          });
        });
      }
    });

    // Sort by priority
    return actions.sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return (order[a.priority as keyof typeof order] || 2) - (order[b.priority as keyof typeof order] || 2);
    });
  }, [progress]);

  if (!session || progressLoading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading-state">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const reviewMode = discoveryData?.reviewMode || 'foundation';

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Your Accessibility Dashboard</h1>
          <p className="subtext">
            {reviewMode === 'foundation' ? 'Foundation Review' : 'Detailed Review'} for{' '}
            {session?.business_snapshot?.business_type?.replace(/-/g, ' ') || 'your business'}
          </p>
        </div>

        {/* Progress Overview */}
        <div className="progress-overview">
          <div className="progress-card main-progress">
            <div className="progress-ring">
              <svg viewBox="0 0 100 100">
                <circle
                  className="progress-ring-bg"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                />
                <circle
                  className="progress-ring-fill"
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  strokeDasharray={`${stats.progressPercentage * 2.83} 283`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="progress-ring-text">
                <span className="progress-value">{stats.progressPercentage}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
            <div className="progress-details">
              <h3>Review Progress</h3>
              <p>{stats.modulesCompleted} of {stats.modulesTotal} modules completed</p>
              {stats.modulesCompleted < stats.modulesTotal && (
                <Link to="/questions" className="btn-continue-review">
                  Continue Review
                </Link>
              )}
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card doing-well">
              <span className="stat-icon">&#10003;</span>
              <span className="stat-value">{stats.doingWellTotal}</span>
              <span className="stat-label">Doing well</span>
            </div>
            <div className="stat-card actions-needed">
              <span className="stat-icon">!</span>
              <span className="stat-value">{stats.actionsTotal}</span>
              <span className="stat-label">Actions needed</span>
            </div>
            <div className="stat-card to-explore">
              <span className="stat-icon">?</span>
              <span className="stat-value">{stats.exploreTotal}</span>
              <span className="stat-label">To explore</span>
            </div>
          </div>
        </div>

        {/* Journey Phase Modules */}
        <div className="journey-modules-section">
          <h2>Your Modules by Journey Phase</h2>

          {journeyGroups.map(group => (
            <div key={group.phase} className={`journey-group journey-${group.phase}`}>
              <div className="journey-group-header">
                <span className="journey-icon">{group.icon}</span>
                <h3>{group.label}</h3>
              </div>

              <div className="module-cards">
                {group.modules.map(module => (
                  <div
                    key={module.id}
                    className={`module-card status-${module.status}`}
                  >
                    <div className="module-card-header">
                      <span className="module-code">{module.code}</span>
                      <span className={`status-badge ${module.status}`}>
                        {module.status === 'completed' && '✓ Complete'}
                        {module.status === 'in-progress' && 'In Progress'}
                        {module.status === 'not-started' && 'Not Started'}
                      </span>
                    </div>
                    <h4>{module.name}</h4>
                    {module.status === 'completed' && (
                      <div className="module-stats">
                        <span className="stat-good">{module.doingWellCount} good</span>
                        <span className="stat-actions">{module.actionCount} actions</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Priority Actions */}
        {priorityActions.length > 0 && (
          <div className="priority-actions-section">
            <div className="section-header">
              <h2>Priority Actions</h2>
              <Link to="/diap" className="view-all-link">View all in DIAP</Link>
            </div>

            <div className="priority-actions-list">
              {priorityActions.slice(0, 5).map((action, index) => (
                <div key={index} className={`priority-action-card priority-${action.priority}`}>
                  <div className="priority-indicator" />
                  <div className="action-content">
                    <p className="action-text">{action.action}</p>
                    <span className="action-module">{action.module}</span>
                  </div>
                </div>
              ))}

              {priorityActions.length > 5 && (
                <div className="more-actions">
                  +{priorityActions.length - 5} more actions
                </div>
              )}
            </div>
          </div>
        )}

        {/* DIAP Summary */}
        <div className="diap-summary-section">
          <div className="diap-card">
            <div className="diap-icon">📋</div>
            <h3>Disability Inclusion Action Plan</h3>
            <div className="diap-stats">
              <div className="diap-stat">
                <span className="stat-value">{stats.diapStats.total}</span>
                <span className="stat-label">Total items</span>
              </div>
              <div className="diap-stat">
                <span className="stat-value">{stats.diapStats.byStatus['in-progress']}</span>
                <span className="stat-label">In progress</span>
              </div>
              <div className="diap-stat">
                <span className="stat-value">{stats.diapStats.byStatus['completed']}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
            <Link to="/diap" className="btn btn-primary">
              Manage DIAP
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-actions">
          <Link to="/questions" className="btn btn-secondary">
            Continue Review
          </Link>
          <Link to="/diap" className="btn btn-secondary">
            View Full DIAP
          </Link>
          <Link to="/export" className="btn btn-secondary">
            Export Summary
          </Link>
        </div>
      </div>
    </div>
  );
}
