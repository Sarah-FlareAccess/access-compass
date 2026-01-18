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
import { useAuth } from '../contexts/AuthContext';
import { accessModules, moduleGroups, getModuleById } from '../data/accessModules';
import type { AccessModule } from '../data/accessModules';
import type { ModuleOwnership, ModuleRunContext, RunComparison } from '../hooks/useModuleProgress';
import { ModuleRunSelector } from '../components/ModuleRunSelector';
import { RunComparisonView } from '../components/RunComparisonView';
import { OrgAdminPanel } from '../components/OrgAdminPanel';
import { ReportProblem, ReportProblemTrigger } from '../components/ReportProblem';
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
  runsCount: number;
  activeRunContext?: ModuleRunContext;  // Current run context being viewed
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
  const { accessState, user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('modules');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showReportProblem, setShowReportProblem] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Group icons mapping
  const groupIcons: Record<string, string> = {
    'before-arrival': '🔍',
    'getting-in': '🚪',
    'during-visit': '🏛️',
    'service-support': '🤝',
  };

  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  // Get recommended modules from discovery, falling back to selected modules
  const recommendedModuleIds: string[] = useMemo(() => {
    // Backward compatibility: map very old codes to current codes
    // Note: Only map codes that no longer exist in the current system
    const normalizeCode = (code: string): string => {
      const codeMap: Record<string, string> = {
        'A3': 'A3a',   // Old internal movement -> Paths and aisles
        // A6 and A7 are valid current codes - don't remap them
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
  const {
    progress,
    isLoading: progressLoading,
    updateModuleOwnership,
    startNewRun,
    getModuleRuns,
    switchToRun,
    deleteRun,
    compareRuns,
  } = useModuleProgress(recommendedModuleIds);

  // Run selector modal state
  const [runSelectorModal, setRunSelectorModal] = useState<{
    isOpen: boolean;
    moduleId: string;
    moduleName: string;
    moduleCode: string;
  } | null>(null);

  // Comparison view state
  const [comparisonView, setComparisonView] = useState<{
    isOpen: boolean;
    comparison: RunComparison;
    moduleId: string;
    moduleName: string;
  } | null>(null);

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
  const { getStats: getDIAPStats } = useDIAPManagement();

  // Load session and discovery data
  useEffect(() => {
    let currentSession = getSession();
    const currentDiscovery = getDiscoveryData();

    // DEV MODE: Create a mock session ONLY if no session exists at all
    // Don't overwrite existing sessions that have user data
    if (!currentSession) {
      console.log('[Dashboard] No local session found - creating dev session');
      const devSession = {
        session_id: 'dev-session',
        created_at: new Date().toISOString(),
        last_updated: new Date().toISOString(),
        business_snapshot: {
          organisation_name: 'Test Organisation',
          organisation_size: 'small' as const,
          business_types: ['hospitality' as const],
          user_role: 'owner' as const,
          has_physical_venue: true,
          has_online_presence: true,
          serves_public_customers: true,
          has_online_services: false,
        },
        selected_modules: [],
        discovery_responses: {},
        constraints: {
          budget_range: 'not_sure' as const,
          capacity: 'not_sure' as const,
          timeframe: 'exploring' as const,
        },
        ai_response: null,
      };
      localStorage.setItem('access_compass_session', JSON.stringify(devSession));
      currentSession = devSession;
    } else if (!currentSession.session_id) {
      // Session exists but missing session_id - add it without overwriting data
      currentSession.session_id = currentSession.session_id || 'session-' + Date.now();
      localStorage.setItem('access_compass_session', JSON.stringify(currentSession));
    }

    setSession(currentSession);
    setDiscoveryData(currentDiscovery);
  }, [navigate, accessState.isAuthenticated, user]);

  // Get current review mode from discovery data
  const currentReviewMode = discoveryData?.review_mode || 'deep-dive';

  // Organize modules by group with progress
  const groupedModules = useMemo((): ModuleGroupWithProgress[] => {
    return moduleGroups.map(group => {
      const groupModules = accessModules
        .filter(m => m.group === group.id)
        // Match by both module ID (e.g., 'M05') and code (e.g., 'A1')
        .filter(m => recommendedModuleIds.includes(m.id) || recommendedModuleIds.includes(m.code))
        .map(module => {
          const moduleProgress = progress[module.id];
          const runs = getModuleRuns(module.id);

          // Get the active run context
          let activeRunContext: ModuleRunContext | undefined;
          if (moduleProgress?.activeRunId && runs.length > 0) {
            const activeRun = runs.find(r => r.id === moduleProgress.activeRunId);
            activeRunContext = activeRun?.context;
          } else if (runs.length > 0) {
            // Default to the most recent run's context
            activeRunContext = runs[runs.length - 1]?.context;
          }

          // Filter questions based on review mode
          // In pulse-check mode: only count pulse-check questions
          // In deep-dive mode: count all questions
          const relevantQuestions = currentReviewMode === 'pulse-check'
            ? module.questions.filter(q => q.reviewMode === 'pulse-check')
            : module.questions;

          // Get IDs of relevant questions to filter answered count
          const relevantQuestionIds = new Set(relevantQuestions.map(q => q.id));

          // Count only responses for questions in the current review mode
          const relevantAnsweredCount = moduleProgress?.responses?.filter(
            (r: { questionId: string }) => relevantQuestionIds.has(r.questionId)
          ).length || 0;

          return {
            module,
            status: moduleProgress?.status || 'not-started',
            answeredCount: relevantAnsweredCount,
            totalQuestions: relevantQuestions.length,
            doingWellCount: moduleProgress?.summary?.doingWell?.length || 0,
            actionCount: moduleProgress?.summary?.priorityActions?.length || 0,
            ownership: moduleProgress?.ownership,
            completedAt: moduleProgress?.completedAt,
            confidenceSnapshot: moduleProgress?.confidenceSnapshot,
            runsCount: runs.length,
            activeRunContext,
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
  }, [recommendedModuleIds, progress, currentReviewMode]);

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

  // Show loading only briefly, then show empty state if no session
  if (progressLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no session, show a helpful message instead of infinite loading
  if (!session) {
    const isReturningUser = accessState.isAuthenticated && accessState.organisation;
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          <h2>{isReturningUser ? 'Welcome back!' : 'No active session found'}</h2>
          <p style={{ marginBottom: '1rem' }}>
            {isReturningUser
              ? 'Your local session data was cleared. Let\'s get you back on track by selecting your modules again.'
              : 'You need to complete the setup process first.'}
          </p>
          <Link to="/start" className="btn btn-primary">
            {isReturningUser ? 'Select Modules' : 'Start Setup'}
          </Link>
        </div>
      </div>
    );
  }

  const hasCompletedModules = overallStats.modulesCompleted > 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-layout">
        {/* Left Sidebar */}
        <aside className="dashboard-sidebar" role="complementary" aria-label="Dashboard sidebar">
          {/* Organisation Identity - Always show */}
          <button
            type="button"
            className="sidebar-org-identity"
            onClick={() => setShowAdminPanel(true)}
            aria-label="Open organisation settings"
          >
            <div className="sidebar-org-info">
              <h2 className="sidebar-org-name">
                {accessState.organisation?.name || session?.business_snapshot?.organisation_name || user?.email || 'Your Organisation'}
              </h2>
              <div className="sidebar-org-meta">
                {accessState.membership?.role && (
                  <span className="sidebar-user-role">
                    {accessState.membership?.role === 'owner' ? 'Lead' :
                     accessState.membership?.role === 'admin' ? 'Admin' : 'Contributor'}
                  </span>
                )}
              </div>
            </div>
            <svg className="sidebar-org-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>


          {/* Quick Actions */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Settings</h3>
            <nav className="sidebar-nav">
              <button
                type="button"
                className="sidebar-nav-item"
                onClick={() => setShowAdminPanel(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Organisation Settings
              </button>
            </nav>
          </div>

          {/* Discovery Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Discovery</h3>
            <nav className="sidebar-nav">
              <Link to="/discovery/summary" className="sidebar-nav-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                View Discovery Summary
              </Link>
            </nav>
          </div>

          {/* Outputs Section */}
          <div className="sidebar-section">
            <h3 className="sidebar-section-title">Your Outputs</h3>
            <nav className="sidebar-nav">
              <Link to="/export" className="sidebar-nav-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
                Accessibility Report
              </Link>
              <Link to="/diap" className="sidebar-nav-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
                Resource Centre
              </Link>
            </nav>
          </div>

          {/* Quick Stats */}
          {hasCompletedModules && (
            <div className="sidebar-section sidebar-stats">
              <h3 className="sidebar-section-title">Quick Stats</h3>
              <div className="sidebar-stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{overallStats.progressPercentage}%</span>
                  <span className="stat-label">Complete</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{overallStats.modulesCompleted}</span>
                  <span className="stat-label">Modules done</span>
                </div>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="sidebar-section sidebar-help">
            <h3 className="sidebar-section-title">Need Help?</h3>
            <p className="sidebar-hint">Questions about accessibility auditing or using Access Compass?</p>
            <a href="mailto:support@accesscompass.com.au" className="sidebar-help-link">
              Contact Support
            </a>
            <ReportProblemTrigger
              variant="sidebar"
              onClick={() => setShowReportProblem(true)}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main id="main-content" className="dashboard-main" role="main" aria-label="Main content">
          <div className="dashboard-container">
            {/* Primary Action Hero - Clickable */}
            {overallStats.modulesInProgress > 0 ? (
              <button
                type="button"
                className="primary-action-hero clickable"
                onClick={() => {
                  // Find the first group with in-progress modules and expand it
                  const groupWithInProgress = groupedModules.find(g =>
                    g.modules.some(m => m.status === 'in-progress')
                  );
                  if (groupWithInProgress) {
                    setExpandedGroups(prev => new Set([...prev, groupWithInProgress.id]));
                    // Scroll to modules section
                    document.querySelector('.modules-content')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="hero-icon">▶</span>
                <div className="hero-text">
                  <span className="hero-title">Continue where you left off</span>
                  <span className="hero-subtitle">
                    {overallStats.modulesInProgress} module{overallStats.modulesInProgress !== 1 ? 's' : ''} in progress
                  </span>
                </div>
                <span className="hero-arrow">→</span>
              </button>
            ) : overallStats.modulesNotStarted > 0 ? (
              <button
                type="button"
                className="primary-action-hero clickable"
                onClick={() => {
                  // Expand the first group with not-started modules
                  const groupWithNotStarted = groupedModules.find(g =>
                    g.modules.some(m => m.status === 'not-started')
                  );
                  if (groupWithNotStarted) {
                    setExpandedGroups(prev => new Set([...prev, groupWithNotStarted.id]));
                    document.querySelector('.modules-content')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span className="hero-icon">🚀</span>
                <div className="hero-text">
                  <span className="hero-title">Ready to begin?</span>
                  <span className="hero-subtitle">Start your accessibility self-audit</span>
                </div>
                <span className="hero-arrow">→</span>
              </button>
            ) : (
              <div className="primary-action-hero completed-state">
                <span className="hero-icon">✓</span>
                <div className="hero-text">
                  <span className="hero-title">All modules complete!</span>
                  <span className="hero-subtitle">Review your results below</span>
                </div>
              </div>
            )}

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
              {groupedModules.map(group => {
                const isExpanded = expandedGroups.has(group.id);
                const groupProgress = group.totalCount > 0 ? Math.round((group.completedCount / group.totalCount) * 100) : 0;
                const inProgressCount = group.modules.filter(m => m.status === 'in-progress').length;

                return (
                  <section key={group.id} className="module-group">
                    {/* Topic Tile - Always visible */}
                    <button
                      type="button"
                      className={`topic-tile ${isExpanded ? 'expanded' : ''} ${group.completedCount === group.totalCount && group.totalCount > 0 ? 'completed' : ''}`}
                      onClick={() => toggleGroupExpansion(group.id)}
                      aria-expanded={isExpanded}
                    >
                      <span className="topic-icon">{groupIcons[group.id] || '📋'}</span>
                      <div className="topic-info">
                        <h3 className="topic-title">{group.label}</h3>
                        <p className="topic-description">{group.description}</p>
                        <div className="topic-meta">
                          <span className="topic-module-count">{group.totalCount} modules</span>
                          {inProgressCount > 0 && (
                            <span className="topic-in-progress">{inProgressCount} in progress</span>
                          )}
                        </div>
                      </div>
                      <div className="topic-progress-section">
                        <div className="topic-progress-ring">
                          <svg viewBox="0 0 36 36" className="progress-ring-svg">
                            <path
                              className="progress-ring-bg"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="progress-ring-fill"
                              strokeDasharray={`${groupProgress}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="progress-ring-text">{groupProgress}%</span>
                        </div>
                        <span className="topic-expand-icon">
                          {isExpanded ? '▾' : '▸'}
                        </span>
                      </div>
                    </button>

                    {/* Expanded Module Tiles */}
                    {isExpanded && (
                      <div className="module-tiles">
                    {group.modules.map(({ module, status, answeredCount, totalQuestions, doingWellCount, actionCount, ownership, completedAt, confidenceSnapshot, runsCount, activeRunContext }) => {
                      const action = getActionButton(status);
                      return (
                        <div key={module.id} className={`module-tile status-${status}`}>
                          {/* Status Indicator Bar */}
                          <div className={`status-bar status-${status}`}></div>

                          <div className="tile-content">
                            <div className="tile-header">
                              <span className="module-icon">{module.icon}</span>
                              <div className="tile-badges">
                                <span className={`status-badge status-${status}`}>
                                  {status === 'not-started' && 'Not started'}
                                  {status === 'in-progress' && 'In progress'}
                                  {status === 'completed' && 'Completed'}
                                </span>
                                {ownership?.assignedTo && status !== 'completed' && (
                                  <span className="allocated-badge" title={`Assigned to ${ownership.assignedTo}`}>
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                      <circle cx="9" cy="7" r="4"/>
                                    </svg>
                                    Assigned
                                  </span>
                                )}
                              </div>
                            </div>

                            <h4 className="module-title">{module.name}</h4>

                            {/* Active run context indicator - show when there are multiple runs or a non-general context */}
                            {activeRunContext && (runsCount > 1 || activeRunContext.type !== 'general') && (
                              <div className="active-run-indicator">
                                <span className="run-context-icon">
                                  {activeRunContext.type === 'team' && '👥'}
                                  {activeRunContext.type === 'department' && '🏢'}
                                  {activeRunContext.type === 'event' && '📅'}
                                  {activeRunContext.type === 'location' && '📍'}
                                  {activeRunContext.type === 'experience' && '🎯'}
                                  {activeRunContext.type === 'general' && '📋'}
                                  {activeRunContext.type === 'other' && '📝'}
                                </span>
                                <span className="run-context-name">{activeRunContext.name}</span>
                                {runsCount > 1 && (
                                  <span className="run-count-hint">({runsCount} assessments)</span>
                                )}
                              </div>
                            )}

                            <p className="module-description">{module.description}</p>

                            <div className="module-meta">
                              <span className="module-time">
                                <span className="time-icon">⏱</span>
                                {currentReviewMode === 'pulse-check'
                                  ? `${module.estimatedTime}–${module.estimatedTime + 5} min`
                                  : `${module.estimatedTimeDeepDive}–${module.estimatedTimeDeepDive + 10} min`}
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
                                className={`btn-assign-module ${status === 'completed' ? 'btn-assign-disabled' : ''} ${ownership?.assignedTo ? 'is-assigned' : ''}`}
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
                                    ? `Assigned to ${ownership.assignedTo} - click to edit`
                                    : 'Assign module (optional)'
                                }
                              >
                                {/* Person icon - color changes based on assignment state */}
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                                  <circle cx="9" cy="7" r="4"/>
                                  {!ownership?.assignedTo && (
                                    <>
                                      <line x1="19" y1="8" x2="19" y2="14"/>
                                      <line x1="22" y1="11" x2="16" y2="11"/>
                                    </>
                                  )}
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="btn-run-history"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setRunSelectorModal({
                                    isOpen: true,
                                    moduleId: module.id,
                                    moduleName: module.name,
                                    moduleCode: module.code,
                                  });
                                }}
                                title={runsCount > 0 ? `${runsCount} assessment${runsCount !== 1 ? 's' : ''} - View history or start new` : 'Start new assessment or repeat checklist'}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="1 4 1 10 7 10"/>
                                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
                                </svg>
                                {runsCount > 1 && <span className="runs-badge">{runsCount}</span>}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                      </div>
                    )}
                  </section>
                );
              })}

              {/* Subtle Guidance Footer */}
              <footer className="guidance-footer">
                <p>Start with the areas most relevant to your visitors. You can always revisit other modules later.</p>
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

      {/* Run Selector Modal */}
      {runSelectorModal && (
        <ModuleRunSelector
          moduleId={runSelectorModal.moduleId}
          moduleName={runSelectorModal.moduleName}
          runs={getModuleRuns(runSelectorModal.moduleId)}
          activeRunId={progress[runSelectorModal.moduleId]?.activeRunId}
          onStartNewRun={(context: ModuleRunContext) => {
            startNewRun(runSelectorModal.moduleId, runSelectorModal.moduleCode, context);
            setRunSelectorModal(null);
          }}
          onSwitchRun={(runId: string) => {
            switchToRun(runSelectorModal.moduleId, runId);
            setRunSelectorModal(null);
          }}
          onDeleteRun={(runId: string) => {
            deleteRun(runSelectorModal.moduleId, runId);
          }}
          onCompareRuns={(runIdA: string, runIdB: string) => {
            const comparison = compareRuns(runSelectorModal.moduleId, runIdA, runIdB);
            if (comparison) {
              setComparisonView({
                isOpen: true,
                comparison,
                moduleId: runSelectorModal.moduleId,
                moduleName: runSelectorModal.moduleName,
              });
            }
          }}
          onClose={() => setRunSelectorModal(null)}
        />
      )}

      {/* Comparison View Modal */}
      {comparisonView && (
        <RunComparisonView
          comparison={comparisonView.comparison}
          questions={getModuleById(comparisonView.moduleId)?.questions || []}
          moduleName={comparisonView.moduleName}
          onClose={() => setComparisonView(null)}
        />
      )}

      {/* Organisation Admin Panel */}
      <OrgAdminPanel
        isOpen={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
      />

      {/* Report Problem Modal */}
      <ReportProblem
        isOpen={showReportProblem}
        onClose={() => setShowReportProblem(false)}
      />
    </div>
  );
}
