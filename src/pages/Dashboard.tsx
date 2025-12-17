/**
 * Dashboard Page
 *
 * Main hub showing:
 * - Welcome message with org name
 * - Quick action buttons (View Report, View DIAP)
 * - Overall progress
 * - Module grid organized by journey phase
 * - Evidence library access
 */

import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { getModuleById, getModulesByGroup } from '../data/accessModules';
import NavBar from '../components/NavBar';
import type { JourneyPhase } from '../types';
import '../styles/dashboard.css';

interface ModuleCardData {
  id: string;
  name: string;
  code: string;
  status: 'not-started' | 'in-progress' | 'completed';
  questionCount: number;
  answeredCount: number;
  doingWellCount: number;
  actionCount: number;
}

interface JourneyGroup {
  phase: JourneyPhase;
  label: string;
  icon: string;
  modules: ModuleCardData[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'modules' | 'evidence'>('modules');

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
            questionCount: moduleProgress?.totalQuestions || 0,
            answeredCount: moduleProgress?.answeredQuestions || 0,
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

    let doingWellTotal = 0;
    let actionsTotal = 0;

    Object.values(progress).forEach(p => {
      if (p.summary) {
        doingWellTotal += p.summary.doingWell?.length || 0;
        actionsTotal += p.summary.priorityActions?.length || 0;
      }
    });

    return {
      modulesCompleted: overall.completed,
      modulesTotal: overall.total,
      progressPercentage: overall.percentage,
      doingWellTotal,
      actionsTotal,
      diapStats,
    };
  }, [progress, getOverallProgress, getStats]);

  if (!session || progressLoading) {
    return (
      <>
        <NavBar />
        <div className="dashboard-page">
          <div className="dashboard-container">
            <div className="loading-state">Loading your dashboard...</div>
          </div>
        </div>
      </>
    );
  }

  const orgName = session?.business_snapshot?.organisation_name || 'your organisation';
  const hasCompletedModules = stats.modulesCompleted > 0;
  const hasDIAPItems = stats.diapStats.total > 0;

  return (
    <>
      <NavBar />
      <div className="dashboard-page">
        <div className="dashboard-container">
          {/* Page Header */}
          <div className="dashboard-header">
            <div className="header-content">
              <h1 className="page-title">Your Accessibility Pathway</h1>
              <p className="page-subtitle">
                Track progress, explore modules, and build your action plan.
              </p>
            </div>
          </div>

          {/* Welcome Card */}
          <div className="welcome-card">
            <div className="welcome-content">
              <h2 className="welcome-title">Welcome back, {orgName}</h2>
              <p className="welcome-text">Continue your accessibility self-audit below.</p>
            </div>
            <div className="welcome-actions">
              <Link
                to="/export"
                className={`btn-action ${hasCompletedModules ? '' : 'btn-disabled'}`}
              >
                View Report
              </Link>
              <Link
                to="/diap"
                className={`btn-action ${hasDIAPItems ? '' : 'btn-disabled'}`}
              >
                View DIAP
              </Link>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="progress-section">
            <h3 className="section-title">Overall Progress</h3>
            <div className="progress-card">
              <div className="progress-bar-container">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${stats.progressPercentage}%` }}
                />
              </div>
              <div className="progress-stats">
                <span className="progress-count">
                  {stats.modulesCompleted} of {stats.modulesTotal} modules completed
                </span>
                <span className="progress-percentage">{stats.progressPercentage}%</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="dashboard-tabs">
            <button
              className={`tab-button ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => setActiveTab('modules')}
            >
              Modules
            </button>
            <button
              className={`tab-button ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => setActiveTab('evidence')}
            >
              Evidence Library
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'modules' && (
            <div className="modules-section">
              {journeyGroups.map(group => (
                <div key={group.phase} className="journey-group">
                  <div className="group-header">
                    <span className="group-icon">{group.icon}</span>
                    <h4 className="group-title">{group.label}</h4>
                  </div>
                  <div className="modules-grid">
                    {group.modules.map(module => (
                      <Link
                        key={module.id}
                        to={`/questions?module=${module.id}`}
                        className={`module-card status-${module.status}`}
                      >
                        <div className="module-header">
                          <span className="module-code">{module.code}</span>
                          <span className={`status-indicator ${module.status}`}>
                            {module.status === 'completed' && '✓'}
                            {module.status === 'in-progress' && '•••'}
                          </span>
                        </div>
                        <h5 className="module-name">{module.name}</h5>
                        {module.status === 'completed' ? (
                          <div className="module-results">
                            <span className="result-good">{module.doingWellCount} good</span>
                            <span className="result-actions">{module.actionCount} actions</span>
                          </div>
                        ) : module.status === 'in-progress' ? (
                          <div className="module-progress">
                            {module.answeredCount} / {module.questionCount} questions
                          </div>
                        ) : (
                          <div className="module-cta">Start review</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {journeyGroups.length === 0 && (
                <div className="empty-state">
                  <p>No modules selected yet.</p>
                  <Link to="/modules" className="btn-primary">
                    Select Modules
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-section">
              <div className="evidence-placeholder">
                <div className="placeholder-icon">📁</div>
                <h4>Evidence Library</h4>
                <p>
                  Upload photos, documents, and links as you complete your review.
                  Evidence helps demonstrate progress and supports your action plan.
                </p>
                {hasCompletedModules ? (
                  <Link to="/questions" className="btn-secondary">
                    Continue Review
                  </Link>
                ) : (
                  <p className="placeholder-note">
                    Complete module reviews to start adding evidence.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Quick Stats Footer */}
          {hasCompletedModules && (
            <div className="quick-stats">
              <div className="stat-item">
                <span className="stat-value">{stats.doingWellTotal}</span>
                <span className="stat-label">Doing well</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.actionsTotal}</span>
                <span className="stat-label">Actions identified</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.diapStats.total}</span>
                <span className="stat-label">DIAP items</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
