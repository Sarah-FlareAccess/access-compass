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

import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { accessModules, moduleGroups } from '../data/accessModules';
import type { AccessModule } from '../data/accessModules';
import type { ModuleOwnership } from '../hooks/useModuleProgress';
import '../styles/dashboard.css';

type TabType = 'modules' | 'evidence';

interface ModuleWithProgress {
  module: AccessModule;
  status: 'not-started' | 'in-progress' | 'completed';
  answeredCount: number;
  totalQuestions: number;
  doingWellCount: number;
  actionCount: number;
  ownership?: ModuleOwnership;
  completedAt?: string;
  confidenceSnapshot?: 'strong' | 'mixed' | 'needs-work';
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
  const { progress, isLoading: progressLoading, getOverallProgress, updateModuleOwnership } = useModuleProgress(recommendedModuleIds);

  // Assignment modal state
  const [assignmentModal, setAssignmentModal] = useState<{
    isOpen: boolean;
    moduleId: string;
    moduleName: string;
    currentOwnership?: ModuleOwnership;
    showEmailTemplate?: boolean;
    savedAssignment?: {
      assignedTo: string;
      assignedToEmail: string;
      targetDate: string;
    };
  } | null>(null);

  // Copy to clipboard state
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

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
            answeredCount: moduleProgress?.responses?.length || 0,
            totalQuestions: module.questions.length,
            doingWellCount: moduleProgress?.summary?.doingWell?.length || 0,
            actionCount: moduleProgress?.summary?.priorityActions?.length || 0,
            ownership: moduleProgress?.ownership,
            completedAt: moduleProgress?.completedAt,
            confidenceSnapshot: moduleProgress?.confidenceSnapshot,
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

  // Open assignment modal
  const handleOpenAssignment = useCallback((moduleId: string, moduleName: string, currentOwnership?: ModuleOwnership) => {
    setAssignmentModal({
      isOpen: true,
      moduleId,
      moduleName,
      currentOwnership,
    });
  }, []);

  // Save assignment
  const handleSaveAssignment = useCallback((assignedTo: string, assignedToEmail: string, targetDate: string) => {
    if (!assignmentModal) return;

    updateModuleOwnership(assignmentModal.moduleId, {
      assignedTo: assignedTo || undefined,
      assignedToEmail: assignedToEmail || undefined,
      targetCompletionDate: targetDate || undefined,
    });

    // If we have an email, show the email template
    if (assignedTo && assignedToEmail) {
      setAssignmentModal({
        ...assignmentModal,
        showEmailTemplate: true,
        savedAssignment: { assignedTo, assignedToEmail, targetDate },
      });
      setCopiedToClipboard(false);
    } else {
      setAssignmentModal(null);
    }
  }, [assignmentModal, updateModuleOwnership]);

  // Generate email template
  const generateEmailTemplate = useCallback(() => {
    if (!assignmentModal?.savedAssignment) return '';

    const { assignedTo, targetDate } = assignmentModal.savedAssignment;
    const moduleName = assignmentModal.moduleName;
    const moduleId = assignmentModal.moduleId;
    const orgName = session?.business_snapshot?.organisation_name || 'our organisation';
    const targetDateFormatted = targetDate
      ? new Date(targetDate).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
      : null;

    // Generate direct link to the module
    const baseUrl = window.location.origin;
    const moduleUrl = `${baseUrl}/questions?module=${moduleId}`;

    return `Hi ${assignedTo.split(' ')[0]},

You've been assigned to complete the "${moduleName}" accessibility self-review module for ${orgName}.

This is part of our accessibility improvement initiative using Access Compass. The module will ask you questions about ${moduleName.toLowerCase()} and help identify what we're doing well and where we can improve.

${targetDateFormatted ? `Target completion date: ${targetDateFormatted}\n` : ''}
To get started, click here:
${moduleUrl}

The review should take about 10-15 minutes. Your insights will help us create a more inclusive experience for all our customers.

If you have any questions or need access, please let me know.

Thanks!`;
  }, [assignmentModal, session]);

  // Copy email to clipboard
  const handleCopyEmail = useCallback(async () => {
    const emailText = generateEmailTemplate();
    try {
      await navigator.clipboard.writeText(emailText);
      setCopiedToClipboard(true);
      setTimeout(() => setCopiedToClipboard(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [generateEmailTemplate]);

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
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

  return (
    <div className="dashboard-page">
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
                    {group.modules.map(({ module, status, answeredCount, totalQuestions, doingWellCount, actionCount, ownership, completedAt, confidenceSnapshot }) => {
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

                            {/* Ownership info - only show if filled */}
                            {(ownership?.assignedTo || ownership?.targetCompletionDate) && (
                              <div className="module-ownership">
                                {ownership.assignedTo && (
                                  <span className="ownership-assigned">
                                    Assigned to: {ownership.assignedTo}
                                  </span>
                                )}
                                {ownership.targetCompletionDate && (
                                  <span className="ownership-target">
                                    Target: {formatDate(ownership.targetCompletionDate)}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Completion metadata for completed modules */}
                            {status === 'completed' && (ownership?.completedBy || completedAt) && (
                              <div className="module-completion-info">
                                {ownership?.completedBy && (
                                  <span className="completion-by">
                                    Completed by: {ownership.completedBy}
                                  </span>
                                )}
                                {completedAt && (
                                  <span className="completion-date">
                                    {formatDate(completedAt)}
                                  </span>
                                )}
                              </div>
                            )}

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
                                {confidenceSnapshot && (
                                  <span className={`confidence-badge confidence-${confidenceSnapshot}`}>
                                    {confidenceSnapshot === 'strong' && 'Strong'}
                                    {confidenceSnapshot === 'mixed' && 'Mixed'}
                                    {confidenceSnapshot === 'needs-work' && 'Needs work'}
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="module-actions">
                              <Link
                                to={`/questions?module=${module.id}`}
                                className={`module-action-btn ${action.className}`}
                              >
                                {action.text}
                              </Link>
                              <button
                                type="button"
                                className={`btn-assign-module ${status === 'completed' ? 'btn-assign-disabled' : ''}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (status !== 'completed') {
                                    handleOpenAssignment(module.id, module.name, ownership);
                                  }
                                }}
                                disabled={status === 'completed'}
                                title={
                                  status === 'completed'
                                    ? 'Module already completed'
                                    : ownership?.assignedTo
                                    ? 'Edit assignment'
                                    : 'Assign module (optional)'
                                }
                              >
                                {ownership?.assignedTo ? (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                                  </svg>
                                ) : (
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <line x1="19" y1="8" x2="19" y2="14"/>
                                    <line x1="22" y1="11" x2="16" y2="11"/>
                                  </svg>
                                )}
                              </button>
                            </div>
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

      {/* Assignment Modal */}
      {assignmentModal && (
        <div className="assignment-modal-overlay" onClick={() => setAssignmentModal(null)}>
          <div className="assignment-modal" onClick={(e) => e.stopPropagation()}>
            {!assignmentModal.showEmailTemplate ? (
              <>
                <div className="assignment-modal-header">
                  <h3>Assign Module <span className="optional-badge">(optional)</span></h3>
                  <button
                    className="btn-close-modal"
                    onClick={() => setAssignmentModal(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="assignment-modal-content">
                  <p className="assignment-module-name">{assignmentModal.moduleName}</p>

                  <div className="assignment-field">
                    <label htmlFor="assignedTo">Assigned to</label>
                    <input
                      type="text"
                      id="assignedTo"
                      placeholder="e.g., Jane Smith, Visitor Experience Manager"
                      defaultValue={assignmentModal.currentOwnership?.assignedTo || ''}
                    />
                    <span className="field-hint">Name or role responsible for this module</span>
                  </div>

                  <div className="assignment-field">
                    <label htmlFor="assignedToEmail">Email</label>
                    <input
                      type="email"
                      id="assignedToEmail"
                      placeholder="e.g., jane.smith@example.com"
                      defaultValue={assignmentModal.currentOwnership?.assignedToEmail || ''}
                    />
                    <span className="field-hint">Add email to generate a notification message</span>
                  </div>

                  <div className="assignment-field">
                    <label htmlFor="targetDate">Target completion date</label>
                    <input
                      type="date"
                      id="targetDate"
                      defaultValue={assignmentModal.currentOwnership?.targetCompletionDate?.split('T')[0] || ''}
                    />
                    <span className="field-hint">Optional - when should this be completed?</span>
                  </div>
                </div>
                <div className="assignment-modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setAssignmentModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-save-assignment"
                    onClick={() => {
                      const assignedTo = (document.getElementById('assignedTo') as HTMLInputElement)?.value || '';
                      const assignedToEmail = (document.getElementById('assignedToEmail') as HTMLInputElement)?.value || '';
                      const targetDate = (document.getElementById('targetDate') as HTMLInputElement)?.value || '';
                      handleSaveAssignment(assignedTo, assignedToEmail, targetDate);
                    }}
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="assignment-modal-header">
                  <h3>Assignment Saved</h3>
                  <button
                    className="btn-close-modal"
                    onClick={() => setAssignmentModal(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="assignment-modal-content">
                  <div className="email-template-intro">
                    <div className="success-icon">✓</div>
                    <p>
                      <strong>{assignmentModal.savedAssignment?.assignedTo}</strong> has been assigned to{' '}
                      <strong>{assignmentModal.moduleName}</strong>.
                    </p>
                    <p className="email-template-hint">
                      Copy the message below to notify them via email, Slack, or Teams:
                    </p>
                  </div>

                  <div className="email-template-container">
                    <textarea
                      readOnly
                      className="email-template-text"
                      value={generateEmailTemplate()}
                      rows={12}
                    />
                  </div>
                </div>
                <div className="assignment-modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setAssignmentModal(null)}
                  >
                    Done
                  </button>
                  <button
                    className="btn-copy-email"
                    onClick={handleCopyEmail}
                  >
                    {copiedToClipboard ? '✓ Copied!' : 'Copy Message'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
