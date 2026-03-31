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

import { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSession, getDiscoveryData } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useDIAPManagement } from '../hooks/useDIAPManagement';
import { useAuth } from '../contexts/AuthContext';
import { useProgramEnrolment } from '../hooks/useProgramEnrolment';
import { accessModules, moduleGroups, getModuleById } from '../data/accessModules';
import type { AccessModule } from '../data/accessModules';
import type { ModuleOwnership, ModuleRunContext, RunComparison } from '../hooks/useModuleProgress';
import { ModuleRunSelector } from '../components/ModuleRunSelector';
import { RunComparisonView } from '../components/RunComparisonView';
import { OrgAdminPanel } from '../components/OrgAdminPanel';
import { ReportProblem } from '../components/ReportProblem';
import { ResourceInfoRequest } from '../components/ResourceInfoRequest';
import { usePageTitle } from '../hooks/usePageTitle';
import { InstallPrompt } from '../components/InstallPrompt';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import { logActivityStandalone, useActivityLog, exportActivitiesAsCSV, getActivityDescriptionText } from '../hooks/useActivityLog';
import { ActivityFeed } from '../components/ActivityFeed';
import { ShareButton } from '../components/ShareButton';
import { CopyMessageButton } from '../components/CopyMessageButton';
import { generateWeeklyDigestMessage } from '../utils/notificationMessages';
import { generateOverallProgressSummary } from '../utils/shareSummary';
import '../styles/share-button.css';
import { GitCompare, Gauge, Users, ImagePlus, BarChart3, ListChecks, ClipboardList } from 'lucide-react';
import { getCategoryLink } from '../utils/resourceLinks';
import '../styles/dashboard.css';

export type DashboardView = 'overview' | 'modules' | 'evidence' | 'activity';
type TabType = DashboardView;

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

const DASHBOARD_FEATURES: GuideFeature[] = [
  { icon: Users, title: 'Module allocation', description: 'Assign modules to team members so the right people review the right areas.' },
  { icon: GitCompare, title: 'Run comparison', description: 'Compare responses across multiple assessment runs side by side.' },
  { icon: Gauge, title: 'Confidence snapshot', description: 'See how confident each module assessment is (strong, mixed, needs work).' },
  { icon: ImagePlus, title: 'Evidence Library', description: 'Upload and manage photos and documents collected during assessments.' },
  { icon: BarChart3, title: 'Report and DIAP', description: 'Jump to your Report or DIAP directly from any completed module.' },
  { icon: ClipboardList, title: 'Activity Log', description: 'Track completed modules, DIAP changes, and team actions. Copy a weekly digest or share progress.' },
  { icon: ListChecks, title: 'Expand module groups', description: 'Click group headers to expand and see individual module progress.' },
];

export default function Dashboard({ view = 'overview' }: { view?: DashboardView }) {
  usePageTitle('Dashboard');
  const navigate = useNavigate();
  const { accessState, user, hasAccessLevel } = useAuth();
  const { program: enrolledProgram } = useProgramEnrolment(accessState.organisation?.id);
  const isDeepDive = hasAccessLevel('deep_dive');
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>(view);
  const [evidenceSearch, setEvidenceSearch] = useState('');
  const [evidenceTypeFilter, setEvidenceTypeFilter] = useState<'all' | 'photo' | 'document' | 'link'>('all');
  const { activities, trimmedByRetention } = useActivityLog();
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showReportProblem, setShowReportProblem] = useState(false);
  const [showInfoRequest, setShowInfoRequest] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Sync activeTab with route-driven view prop
  useEffect(() => {
    setActiveTab(view);
  }, [view]);

  // Group icons mapping
  const groupIcons: Record<string, string> = {
    'before-arrival': '🔍',
    'getting-in': '🚪',
    'during-visit': '🏛️',
    'service-support': '🤝',
    'organisational-commitment': '📋',
    'events': '🎪',
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
  // Program enrolment takes priority: enrolled businesses only see required modules
  const recommendedModuleIds: string[] = useMemo(() => {
    // If enrolled in a program, scope to that program's required modules
    if (enrolledProgram?.required_module_ids?.length) {
      return enrolledProgram.required_module_ids.map(normalizeModuleCode);
    }
    // First try recommended modules from discovery
    if (discoveryData?.recommended_modules?.length > 0) {
      return discoveryData.recommended_modules.map(normalizeModuleCode);
    }
    // Fall back to selected modules from session
    if (session?.selected_modules?.length > 0) {
      return session.selected_modules.map(normalizeModuleCode);
    }
    // If nothing selected, show all modules
    return accessModules.map(m => m.id);
  }, [enrolledProgram, discoveryData, session]);

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

  // Assignment modal focus management
  const assignmentModalRef = useRef<HTMLDivElement>(null);
  const assignmentTriggerRef = useRef<Element | null>(null);

  // Run selector modal focus management
  const runSelectorTriggerRef = useRef<Element | null>(null);
  const runSelectorOpen = !!runSelectorModal;
  useEffect(() => {
    if (runSelectorOpen) {
      runSelectorTriggerRef.current = document.activeElement;
    } else if (runSelectorTriggerRef.current instanceof HTMLElement) {
      runSelectorTriggerRef.current.focus();
      runSelectorTriggerRef.current = null;
    }
  }, [runSelectorOpen]);

  const assignmentModalOpen = !!assignmentModal;
  useEffect(() => {
    if (!assignmentModalOpen) {
      if (assignmentTriggerRef.current instanceof HTMLElement) {
        assignmentTriggerRef.current.focus();
        assignmentTriggerRef.current = null;
      }
      return;
    }
    assignmentTriggerRef.current = document.activeElement;
    const timer = setTimeout(() => {
      const firstInput = assignmentModalRef.current?.querySelector<HTMLElement>('input, button');
      firstInput?.focus();
    }, 50);
    return () => clearTimeout(timer);
  }, [assignmentModalOpen]);

  useEffect(() => {
    if (!assignmentModal) return;
    const selector = 'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setAssignmentModal(null);
        if (assignmentTriggerRef.current instanceof HTMLElement) {
          assignmentTriggerRef.current.focus();
        }
        return;
      }
      if (e.key !== 'Tab' || !assignmentModalRef.current) return;
      const focusable = Array.from(assignmentModalRef.current.querySelectorAll<HTMLElement>(selector));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [assignmentModal]);

  // DIAP management hook
  const { getStats: getDIAPStats } = useDIAPManagement();

  // Load session and discovery data
  useEffect(() => {
    let currentSession = getSession();
    const currentDiscovery = getDiscoveryData();

    // DEV MODE: Create a mock session ONLY if no session exists at all
    // Don't overwrite existing sessions that have user data
    if (!currentSession) {
      // Create a default session when none exists
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
        // Match by both module ID (e.g., 'M05') and code (e.g., '2.1')
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

    if (assignedTo) {
      logActivityStandalone('module-assigned', {
        moduleId: assignmentModal.moduleId,
        moduleName: assignmentModal.moduleName,
        assigneeName: assignedTo,
      });
    }

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


  return (
    <div className="dashboard-page">
        <main className="dashboard-content">
          <h1 className="sr-only">Accessibility Dashboard</h1>
          <div className="dashboard-container">
            <InstallPrompt />
            <PageGuide pageId="dashboard" features={DASHBOARD_FEATURES} />
            {/* Primary Action Hero - Clickable */}
            {overallStats.modulesInProgress > 0 ? (
              <button
                type="button"
                className="primary-action-hero clickable"
                onClick={() => {
                  // Switch to modules tab first
                  navigate('/assessment');
                  // Find the first group with in-progress modules and expand it
                  const groupWithInProgress = groupedModules.find(g =>
                    g.modules.some(m => m.status === 'in-progress')
                  );
                  if (groupWithInProgress) {
                    setExpandedGroups(prev => new Set([...prev, groupWithInProgress.id]));
                    // Scroll to modules section after tab switch renders
                    setTimeout(() => {
                      document.querySelector('.modules-content')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
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
                  navigate('/assessment');
                  const groupWithNotStarted = groupedModules.find(g =>
                    g.modules.some(m => m.status === 'not-started')
                  );
                  if (groupWithNotStarted) {
                    setExpandedGroups(prev => new Set([...prev, groupWithNotStarted.id]));
                    setTimeout(() => {
                      document.querySelector('.modules-content')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
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

          {/* Mobile Quick Links - visible only on mobile where sidebar is hidden */}
          <div className="mobile-quick-links">
            <Link to="/discovery/summary" className="mobile-quick-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <span>Review Discovery</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chevron">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
            <a href="mailto:support@accesscompass.com.au" className="mobile-quick-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Need help?</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="chevron">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </a>
          </div>

          {/* Navigation Tabs - only show on assessment and evidence views */}
          {(activeTab === 'modules' || activeTab === 'evidence') && <div className="dashboard-tabs" role="tablist" aria-label="Dashboard sections">
            <button
              className={`tab-btn ${activeTab === 'modules' ? 'active' : ''}`}
              onClick={() => navigate('/assessment')}
              role="tab"
              aria-selected={activeTab === 'modules'}
              aria-controls="tab-panel-modules"
              id="tab-modules"
            >
              Modules
            </button>
            <button
              className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
              onClick={() => navigate('/evidence')}
              role="tab"
              aria-selected={activeTab === 'evidence'}
              aria-controls="tab-panel-evidence"
              id="tab-evidence"
            >
              Evidence Library
            </button>
          </div>}

          {/* Tab Content */}
          {activeTab === 'modules' && (
            <div className="modules-content" role="tabpanel" id="tab-panel-modules" aria-labelledby="tab-modules">
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
                            <defs>
                              <linearGradient id={`progress-gradient-${group.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#CC7700" />
                                <stop offset="100%" stopColor="#490E67" />
                              </linearGradient>
                            </defs>
                            <path
                              className="progress-ring-bg"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className="progress-ring-fill"
                              strokeDasharray={`${groupProgress}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              stroke={group.completedCount === group.totalCount && group.totalCount > 0 ? '#16a34a' : `url(#progress-gradient-${group.id})`}
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
                                {isDeepDive && ownership?.assignedTo && status !== 'completed' && (
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
                            {isDeepDive && activeRunContext && (runsCount > 1 || activeRunContext.type !== 'general') && (
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
                                {(() => {
                                  const deepDiveTime = module.estimatedTimeDeepDive ?? module.estimatedTime * 3;
                                  return currentReviewMode === 'pulse-check'
                                    ? `${module.estimatedTime}–${module.estimatedTime + 5} min`
                                    : `${deepDiveTime}–${deepDiveTime + 10} min`;
                                })()}
                              </span>
                            </div>

                            {/* Ownership info - only show if filled */}
                            {isDeepDive && (ownership?.assignedTo || ownership?.targetCompletionDate) && (
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
                                to={`/questions?module=${module.id}${status === 'completed' ? '&view=review' : ''}`}
                                className={`module-action-btn ${action.className}`}
                                aria-label={`${action.text} ${module.name}`}
                              >
                                {action.text}
                              </Link>
                              {status === 'completed' && (
                                <Link
                                  to={getCategoryLink(group.id)}
                                  state={{ from: 'dashboard' }}
                                  className="module-action-btn btn-resources"
                                  aria-label={`Browse resources for ${module.name}`}
                                >
                                  Resources
                                </Link>
                              )}
                              {isDeepDive && (
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
                              )}
                              {isDeepDive && (
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
                                  title={runsCount > 0 ? `${runsCount} assessment${runsCount !== 1 ? 's' : ''} - View history or start new` : 'New assessment'}
                                  aria-label={`Assessment history for ${module.name}`}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19"/>
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                  </svg>
                                  {runsCount > 1 && <span className="runs-badge">{runsCount}</span>}
                                </button>
                              )}
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
            </div>
          )}

          {activeTab === 'evidence' && (() => {
            // Collect all evidence from module responses
            const allEvidence: { moduleCode: string; moduleName: string; questionId: string; questionText: string; file: import('../hooks/useModuleProgress').EvidenceFile }[] = [];
            for (const mod of accessModules) {
              const modProgress = progress[mod.id];
              if (!modProgress?.responses) continue;
              for (const resp of modProgress.responses) {
                if (resp.evidence && resp.evidence.length > 0) {
                  const question = mod.questions.find(q => q.id === resp.questionId);
                  for (const file of resp.evidence) {
                    allEvidence.push({
                      moduleCode: mod.code,
                      moduleName: mod.name,
                      questionId: resp.questionId,
                      questionText: question?.text || resp.questionId,
                      file,
                    });
                  }
                }
              }
            }

            return (
              <div className="evidence-content" role="tabpanel" id="tab-panel-evidence" aria-labelledby="tab-evidence">
                {allEvidence.length === 0 ? (
                  <div className="evidence-empty">
                    <div className="evidence-icon">📁</div>
                    <h3>Evidence Library</h3>
                    <p>
                      As you complete module reviews, you can upload photos, documents, and links
                      to support your accessibility improvements.
                    </p>
                    <p className="evidence-note">
                      Evidence is linked to specific modules and questions, helping you track
                      progress and demonstrate compliance over time.
                    </p>
                    <button
                      type="button"
                      className="evidence-action-btn"
                      onClick={() => navigate('/assessment')}
                    >
                      Continue reviewing modules
                    </button>
                  </div>
                ) : (
                  <div className="evidence-library">
                    <div className="evidence-library-header">
                      <h3>Evidence Library</h3>
                      <p className="evidence-count">{allEvidence.length} item{allEvidence.length !== 1 ? 's' : ''} uploaded</p>
                    </div>

                    {/* Search and filter */}
                    <div className="evidence-toolbar">
                      <input
                        type="search"
                        className="evidence-search"
                        placeholder="Search by file name or question..."
                        value={evidenceSearch}
                        onChange={(e) => setEvidenceSearch(e.target.value)}
                        aria-label="Search evidence"
                      />
                      <div className="evidence-type-filters" role="group" aria-label="Filter by type">
                        {(['all', 'photo', 'document', 'link'] as const).map(t => (
                          <button
                            key={t}
                            type="button"
                            className={`evidence-type-btn ${evidenceTypeFilter === t ? 'active' : ''}`}
                            onClick={() => setEvidenceTypeFilter(t)}
                            aria-pressed={evidenceTypeFilter === t}
                          >
                            {t === 'all' ? 'All' : t === 'photo' ? 'Photos' : t === 'document' ? 'Documents' : 'Links'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      // Apply filters
                      const searchLower = evidenceSearch.toLowerCase();
                      const filtered = allEvidence.filter(item => {
                        if (evidenceTypeFilter !== 'all' && item.file.type !== evidenceTypeFilter) return false;
                        if (searchLower && !item.file.name.toLowerCase().includes(searchLower) && !item.questionText.toLowerCase().includes(searchLower)) return false;
                        return true;
                      });

                      if (filtered.length === 0) {
                        return <p className="evidence-no-results">No evidence matches your search or filter.</p>;
                      }

                      // Group by module
                      const grouped = new Map<string, typeof allEvidence>();
                      for (const item of filtered) {
                        const key = item.moduleCode;
                        if (!grouped.has(key)) grouped.set(key, []);
                        grouped.get(key)!.push(item);
                      }
                      return Array.from(grouped.entries()).map(([moduleCode, items]) => (
                        <details key={moduleCode} className="evidence-module-group" open>
                          <summary className="evidence-module-heading">
                            <span className="evidence-module-code">{moduleCode}</span>
                            {items[0].moduleName}
                            <span className="evidence-module-count">{items.length}</span>
                          </summary>
                          <div className="evidence-items">
                            {items.map(item => {
                              const fileUrl = item.file.url || item.file.dataUrl;
                              const handleClick = () => {
                                if (fileUrl) {
                                  const a = document.createElement('a');
                                  a.href = fileUrl;
                                  a.target = '_blank';
                                  a.rel = 'noopener noreferrer';
                                  if (item.file.dataUrl && !item.file.url) {
                                    a.download = item.file.name;
                                  }
                                  a.click();
                                }
                              };
                              return (
                                <div
                                  key={item.file.id}
                                  className="evidence-item-card"
                                  onClick={handleClick}
                                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
                                  tabIndex={0}
                                  role="button"
                                  aria-label={`Open ${item.file.name}`}
                                >
                                  <div className="evidence-item-icon" aria-hidden="true">
                                    {item.file.type === 'photo' ? '🖼️' : item.file.type === 'link' ? '🔗' : '📄'}
                                  </div>
                                  <div className="evidence-item-details">
                                    <span className="evidence-item-name">{item.file.name}</span>
                                    <span className="evidence-item-question">{item.questionText}</span>
                                    <span className="evidence-item-date">
                                      {new Date(item.file.uploadedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                  </div>
                                  {(item.file.url || item.file.dataUrl) && item.file.type === 'photo' && (
                                    <img
                                      src={item.file.url || item.file.dataUrl}
                                      alt={item.file.name}
                                      className="evidence-item-thumbnail"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </details>
                      ));
                    })()}
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === 'activity' && (
            <div className="activity-content" role="tabpanel" id="tab-panel-activity" aria-labelledby="tab-activity">
              <div className="activity-header-actions">
                <CopyMessageButton
                  getMessage={() => generateWeeklyDigestMessage(activities, session?.business_snapshot?.organisation_name || 'Our Organisation')}
                  label="Copy Weekly Digest"
                  className="btn-digest"
                />
                <ShareButton
                  getSummary={() => generateOverallProgressSummary(progress, session?.selected_modules?.length || 0, session?.business_snapshot?.organisation_name || 'Our Organisation')}
                  filename={`access-compass-progress-${new Date().toISOString().split('T')[0]}.txt`}
                  label="Share Progress"
                />
              </div>
              <ActivityFeed
                activities={activities}
                trimmedByRetention={trimmedByRetention}
                onExportCSV={() => {
                  const csv = exportActivitiesAsCSV(activities);
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                onExportPDF={() => {
                  const orgName = session?.business_snapshot?.organisation_name || 'N/A';
                  const lines = [
                    'ACTIVITY LOG',
                    `Generated: ${new Date().toLocaleDateString('en-AU')}`,
                    `Organisation: ${orgName}`,
                    '',
                    ...activities.map(a => {
                      const date = new Date(a.timestamp).toLocaleDateString('en-AU');
                      const time = new Date(a.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' });
                      return `[${date} ${time}] ${a.actorName} - ${getActivityDescriptionText(a)}`;
                    }),
                  ];
                  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `activity-log-${new Date().toISOString().split('T')[0]}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              />
            </div>
          )}
        </div>
        <div className="dashboard-footer-link">
          <Link to="/accessibility">Accessibility Statement</Link>
        </div>
      </main>

      {/* Assignment Modal */}
      {assignmentModal && (
        <div className="assignment-modal-overlay" onClick={() => setAssignmentModal(null)}>
          <div ref={assignmentModalRef} className="assignment-modal" role="dialog" aria-modal="true" aria-label="Assign Module" onClick={(e) => e.stopPropagation()}>
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
                    <span className="field-hint">Name or role (e.g., Jane Smith, Visitor Experience Manager)</span>
                    <input
                      type="text"
                      id="assignedTo"
                      defaultValue={assignmentModal.currentOwnership?.assignedTo || ''}
                    />
                  </div>

                  <div className="assignment-field">
                    <label htmlFor="assignedToEmail">Email</label>
                    <span className="field-hint">Add email to generate a notification (e.g., jane.smith@example.com)</span>
                    <input
                      type="email"
                      id="assignedToEmail"
                      defaultValue={assignmentModal.currentOwnership?.assignedToEmail || ''}
                    />
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

      <ResourceInfoRequest
        isOpen={showInfoRequest}
        onClose={() => setShowInfoRequest(false)}
      />

    </div>
  );
}
