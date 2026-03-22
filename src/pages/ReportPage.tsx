import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, Award, BarChart3, Settings, Eye, Users as UsersIcon } from 'lucide-react';
import { getSession, getDiscoveryData } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { ReportConfigSelector, type ReportConfig } from '../components/ReportConfigSelector';
import { downloadPDFReport } from '../utils/pdfGenerator';
import { getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PRIORITY_LEGEND, PRIORITY_LABELS, PRIORITY_BADGE_ABBR, PRIORITY_ENCOURAGEMENT } from '../utils/priorityCalculation';
import { groupProfessionalReviewByExpertise, FLARE_CONTACT } from '../utils/professionalSupportGroups';
import { accessModules, moduleGroups } from '../data/accessModules';
import { PageFooter } from '../components/PageFooter';
import { usePageTitle } from '../hooks/usePageTitle';
import { useBadgeProgress } from '../hooks/useBadgeProgress';
import { downloadCertificate } from '../utils/certificateGenerator';
import type { ReviewMode } from '../types/index';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import './ReportPage.css';

const REPORT_FEATURES: GuideFeature[] = [
  { icon: Download, title: 'Download PDF', description: 'Export your full accessibility report as a formatted PDF document.' },
  { icon: Award, title: 'Certificate', description: 'Download a completion certificate when you finish modules.' },
  { icon: Settings, title: 'Report options', description: 'Switch between pulse check and full review, or filter by module.' },
  { icon: ChevronDown, title: 'Expand and collapse', description: 'Click module headers to expand or collapse individual findings.' },
  { icon: Eye, title: 'Show strengths', description: 'Toggle positive findings on or off alongside priority actions.' },
  { icon: UsersIcon, title: 'Professional support', description: 'See recommended specialist areas grouped by expertise type.' },
];

const PRIORITY_BADGE_LABEL = PRIORITY_BADGE_ABBR;

const GROUP_ORDER = ['before-arrival', 'getting-in', 'during-visit', 'service-support', 'organisational-commitment', 'events'];

interface ModuleFindings {
  moduleCode: string;
  moduleName: string;
  moduleId: string;
  group: string;
  actions: CategorisedItem[];
  strengths: CategorisedItem[];
  explores: CategorisedItem[];
  priorityCounts: { high: number; medium: number; low: number };
}

function getModuleGroup(moduleCode: string): string {
  const mod = accessModules.find(m => m.code === moduleCode);
  return mod?.group || 'during-visit';
}

function getModuleId(moduleCode: string): string {
  const mod = accessModules.find(m => m.code === moduleCode);
  return mod?.id || moduleCode;
}

function buildModuleFindings(report: Report): ModuleFindings[] {
  const map = new Map<string, ModuleFindings>();

  const ensure = (code: string, name: string) => {
    if (!map.has(code)) {
      map.set(code, {
        moduleCode: code,
        moduleName: name,
        moduleId: getModuleId(code),
        group: getModuleGroup(code),
        actions: [],
        strengths: [],
        explores: [],
        priorityCounts: { high: 0, medium: 0, low: 0 },
      });
    }
    return map.get(code)!;
  };

  for (const item of report.sections.priorityActions.categorised || []) {
    const mf = ensure(item.moduleCode, item.moduleName);
    mf.actions.push(item);
    const p = item.priority || 'low';
    mf.priorityCounts[p]++;
  }
  for (const item of report.sections.strengths.categorised || []) {
    ensure(item.moduleCode, item.moduleName).strengths.push(item);
  }
  for (const item of report.sections.areasToExplore.categorised || []) {
    ensure(item.moduleCode, item.moduleName).explores.push(item);
  }

  const findings = Array.from(map.values());
  findings.sort((a, b) => a.moduleCode.localeCompare(b.moduleCode, undefined, { numeric: true }));
  return findings;
}

function PriorityCountBadges({ counts }: { counts: { high: number; medium: number; low: number } }) {
  const parts: { key: string; label: string; count: number }[] = [];
  if (counts.high > 0) parts.push({ key: 'high', label: PRIORITY_BADGE_ABBR.high, count: counts.high });
  if (counts.medium > 0) parts.push({ key: 'medium', label: PRIORITY_BADGE_ABBR.medium, count: counts.medium });
  if (counts.low > 0) parts.push({ key: 'low', label: PRIORITY_BADGE_ABBR.low, count: counts.low });
  if (parts.length === 0) return <span className="rp-no-actions">No actions needed</span>;
  return (
    <span className="rp-priority-counts" aria-label={parts.map(p => `${p.count} ${PRIORITY_LABELS[p.key as keyof typeof PRIORITY_LABELS]}`).join(', ')}>
      {parts.map((p) => (
        <span key={p.key} className={`rp-priority-count rp-priority-${p.key}`}>{p.count}{p.label}</span>
      ))}
    </span>
  );
}

function stripPrioritySuffix(text: string): string {
  return text.replace(/\s*\((high|medium|low) priority\)\s*$/i, '');
}

function getRelevantHelp(questionId: string): ReturnType<typeof getHelpByQuestionId> | undefined {
  const help = getHelpByQuestionId(questionId);
  if (!help) return undefined;
  const qModule = questionId.replace(/-.*$/, '');
  const helpModule = help.questionId.replace(/-.*$/, '');
  if (qModule !== helpModule) return undefined;
  return help;
}

function cleanStatementText(text: string): string {
  let s = text;
  // Fix question-format text that wasn't properly converted to statements
  s = s.replace(/\?$/, '');
  // "Do images on..." → "Images on..."
  s = s.replace(/^Do /i, '');
  // "Can all website..." → "All website..."
  s = s.replace(/^Can /i, '');
  // "Is your..." → "Your..."
  s = s.replace(/^Is your /i, 'Your ');
  s = s.replace(/^Is there /i, 'There is ');
  s = s.replace(/^Is /i, '');
  // "Are there..." → "There are..."
  s = s.replace(/^Are there /i, 'There are ');
  s = s.replace(/^Are your /i, 'Your ');
  s = s.replace(/^Are /i, '');
  // "Has your..." → "Your..."
  s = s.replace(/^Has your /i, 'Your ');
  // "Have you..." → "You have..."
  s = s.replace(/^Have you /i, 'You have ');
  // Capitalize
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s;
}

function formatActionText(item: CategorisedItem): React.ReactNode {
  const raw = stripPrioritySuffix(item.text);

  if (raw.startsWith('Complete improvements to: ')) {
    const core = raw.replace('Complete improvements to: ', '');
    return <>Improve {core.charAt(0).toLowerCase() + core.slice(1)}</>;
  }

  return raw;
}

function ModuleTile({
  finding,
  isExpanded,
  onToggle,
  detailedFindings,
  showStrengths = true,
}: {
  finding: ModuleFindings;
  isExpanded: boolean;
  onToggle: () => void;
  detailedFindings?: Report['detailedFindings'];
  showStrengths?: boolean;
}) {
  const totalActions = finding.actions.length;
  const totalStrengths = finding.strengths.length;

  const tiers = (['high', 'medium', 'low'] as const)
    .map(p => ({ priority: p, items: finding.actions.filter(i => (i.priority || 'low') === p) }))
    .filter(t => t.items.length > 0);

  const moduleDetailedFindings = detailedFindings?.find(f => f.moduleCode === finding.moduleCode);

  return (
    <div className={`rp-module-tile${isExpanded ? ' rp-module-tile-expanded' : ''}`}>
      <button
        className="rp-module-tile-header"
        onClick={onToggle}
        aria-expanded={isExpanded}
      >
        <div className="rp-module-tile-info">
          <span className="rp-module-code">{finding.moduleCode}</span>
          <span className="rp-module-name">{finding.moduleName}</span>
        </div>
        <div className="rp-module-tile-meta">
          <PriorityCountBadges counts={finding.priorityCounts} />
          {finding.explores.length > 0 && (
            <span className="rp-priority-count rp-priority-explore" aria-label={`${finding.explores.length} to investigate`}>
              {finding.explores.length}E
            </span>
          )}
          {isExpanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </div>
      </button>

      {isExpanded && (
        <div className="rp-module-tile-body">
          {/* Actions by priority tier */}
          {totalActions > 0 && tiers.map(tier => (
                <details key={tier.priority} className={`rp-module-section rp-collapsible-section rp-action-tier-section`} open>
                  <summary className={`rp-module-section-title rp-section-actions rp-tier-heading rp-tier-heading-${tier.priority}`}>
                    <span className={`rp-tier-badge rp-tier-badge-${tier.priority}`} aria-hidden="true">
                      {PRIORITY_BADGE_LABEL[tier.priority]}
                    </span>
                    <span>{PRIORITY_LABELS[tier.priority]} priority ({tier.items.length})</span>
                  </summary>
                  <ul className="rp-item-list rp-list-actions">
                    {tier.items.map((item, i) => {
                      const issue = moduleDetailedFindings?.issues.find(
                        iss => iss.questionId === item.questionId
                      );
                      return (
                        <li key={i} className={`rp-action-item rp-action-${tier.priority}`}>
                          {issue ? (
                            <div className="rp-action-row">
                              <details className="rp-action-details">
                                <summary className="rp-action-summary">
                                  <span>{formatActionText(item)}</span>
                                </summary>
                                <div className="rp-action-recommendation">
                                  <p className="rp-issue-reasoning">{issue.reasoning}</p>
                                  <div className="rp-issue-actions">
                                    <strong>Recommended actions</strong>
                                    <ul>
                                      {issue.recommendedActions.map((action, ai) => (
                                        <li key={ai}>{action}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  {issue.complianceRef && (
                                    <p className="rp-issue-ref">Reference: {issue.complianceRef}</p>
                                  )}
                                  {(() => {
                                    const help = getRelevantHelp(issue.questionId);
                                    if (!help) return null;
                                    return (
                                      <Link
                                        to={getResourceLink(issue.questionId)}
                                        state={{ from: 'report' }}
                                        className="rp-resource-link"
                                      >
                                        View guide: {help.title || 'Resource guide'}
                                      </Link>
                                    );
                                  })()}
                                </div>
                              </details>
                              <span className={`rp-compliance-tag rp-compliance-${item.complianceLevel || 'best-practice'}`}>
                                {item.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best practice'}
                              </span>
                            </div>
                          ) : (
                            <>
                              <span>{formatActionText(item)}</span>
                              <span className={`rp-compliance-tag rp-compliance-${item.complianceLevel || 'best-practice'}`}>
                                {item.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best practice'}
                              </span>
                            </>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}

          {/* Areas to explore */}
          {finding.explores.length > 0 && (
            <details className="rp-module-section rp-collapsible-section" open>
              <summary className="rp-module-section-title rp-section-explore">Areas to explore ({finding.explores.length})</summary>
              <ul className="rp-item-list rp-list-explore">
                {finding.explores.map((item, i) => {
                  const help = item.questionId ? getRelevantHelp(item.questionId) : undefined;
                  // Only use howToCheck if this is the primary question for the help entry
                  const isPrimaryQuestion = help && item.questionId === help.questionId;
                  const howToCheck = isPrimaryQuestion ? help.howToCheck : undefined;
                  const hasSteps = howToCheck?.steps && howToCheck.steps.length > 0;

                  // Build fallback steps from inline question tips or helpText
                  let fallbackSteps: string[] = [];
                  if (!hasSteps && item.questionId) {
                    const mod = accessModules.find(m => item.questionId!.startsWith(m.code));
                    const q = mod?.questions.find(qq => qq.id === item.questionId);
                    if (q?.helpContent?.tips && q.helpContent.tips.length > 0) {
                      fallbackSteps = q.helpContent.tips.slice(0, 4);
                    } else if (q?.helpText) {
                      fallbackSteps = [q.helpText];
                    }
                  }

                  const steps = hasSteps
                    ? howToCheck!.steps.map(s => s.text)
                    : fallbackSteps;
                  const tools = hasSteps ? howToCheck!.tools : undefined;
                  const categoryLink = `/resources?category=${encodeURIComponent(
                    finding.group === 'organisational-commitment' ? 'organisation' : finding.group
                  )}`;

                  return (
                    <li key={i}>
                      <details className="rp-explore-details">
                        <summary className="rp-explore-summary">
                          {cleanStatementText(item.text)}
                        </summary>
                        <div className="rp-explore-guidance">
                          {steps.length > 0 && (
                            <div className="rp-explore-steps">
                              <strong>{hasSteps ? 'How to assess this' : 'What to look for'}</strong>
                              <ul>
                                {steps.map((step, si) => <li key={si}>{step}</li>)}
                              </ul>
                              {tools && tools.length > 0 && (
                                <p className="rp-explore-tools">You will need: {tools.join(', ')}</p>
                              )}
                            </div>
                          )}
                          {help ? (
                            <Link
                              to={getResourceLink(item.questionId!)}
                              state={{ from: 'report' }}
                              className="rp-resource-link"
                            >
                              View guide: {help.title || 'Resource guide'}
                            </Link>
                          ) : (
                            <Link
                              to={categoryLink}
                              state={{ from: 'report' }}
                              className="rp-resource-link"
                            >
                              Browse related resources
                            </Link>
                          )}
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </details>
          )}

          {/* Strengths - shown at end so actions come first */}
          {showStrengths && totalStrengths > 0 && (
            <details className="rp-module-section rp-collapsible-section">
              <summary className="rp-module-section-title rp-section-strengths">What's going well ({totalStrengths})</summary>
              <ul className="rp-item-list rp-list-strengths">
                {finding.strengths.map((item, i) => (
                  <li key={i}>{cleanStatementText(item.text)}</li>
                ))}
              </ul>
            </details>
          )}

        </div>
      )}
    </div>
  );
}

export default function ReportPage() {
  usePageTitle('Report');
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [report, setReport] = useState<Report | null>(null);
  const [reportConfig, setReportConfig] = useState<ReportConfig | undefined>(undefined);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showConfig, setShowConfig] = useState(false);
  const [showStrengths, setShowStrengths] = useState(true);

  useEffect(() => {
    try {
      const currentSession = getSession();
      const currentDiscovery = getDiscoveryData();
      if (!currentSession || !currentSession.session_id) {
        navigate('/');
        return;
      }
      setSession(currentSession);
      setDiscoveryData(currentDiscovery);
    } catch {
      console.error('Error loading session');
    }
  }, [navigate]);

  const selectedModuleIds: string[] = useMemo(() => {
    if (discoveryData?.recommended_modules?.length > 0) {
      return discoveryData.recommended_modules.map(normalizeModuleCode);
    }
    if (session?.selected_modules?.length > 0) {
      return session.selected_modules.map(normalizeModuleCode);
    }
    return [];
  }, [discoveryData, session]);

  const reviewMode: ReviewMode = discoveryData?.review_mode || 'pulse-check';
  const isPulseCheck = reviewMode === 'pulse-check';
  const organisationName = session?.business_snapshot?.organisation_name || 'Your Organisation';

  const { generateReport, isReady, getModuleRuns } = useReportGeneration(selectedModuleIds);
  const { progress } = useModuleProgress(selectedModuleIds);
  const badgeProgress = useBadgeProgress(progress);

  const handleDownloadCertificate = useCallback(() => {
    const completedModuleNames = Object.entries(progress)
      .filter(([, p]) => p.status === 'completed')
      .map(([id]) => {
        const mod = accessModules.find(m => m.id === id);
        return mod ? `${mod.code} ${mod.name}` : id;
      });
    downloadCertificate({
      organisationName,
      level: badgeProgress.level,
      completedModules: completedModuleNames,
      totalModules: badgeProgress.totalModules,
      completionDate: new Date().toISOString(),
    });
  }, [progress, organisationName, badgeProgress.level, badgeProgress.totalModules]);

  const hasCompletedModules = useMemo(() => {
    return Object.values(progress).some(p => p.status === 'completed');
  }, [progress]);

  const handleGenerateReport = useCallback(() => {
    if (!isReady) return;
    const r = generateReport(reviewMode, organisationName, reportConfig);
    setReport(r);
  }, [isReady, generateReport, reviewMode, organisationName, reportConfig]);

  // Auto-generate on first load only
  const [hasAutoGenerated, setHasAutoGenerated] = useState(false);
  useEffect(() => {
    if (isReady && hasCompletedModules && !hasAutoGenerated) {
      setHasAutoGenerated(true);
      const r = generateReport(reviewMode, organisationName, reportConfig);
      setReport(r);
    }
  }, [isReady, hasCompletedModules, hasAutoGenerated, generateReport, reviewMode, organisationName, reportConfig]);

  const handleConfigChange = useCallback((config: ReportConfig) => {
    setReportConfig(config);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    if (!report) return;
    downloadPDFReport(report);
  }, [report]);

  const moduleFindings = useMemo(() => {
    if (!report) return [];
    return buildModuleFindings(report);
  }, [report]);

  const priorityDistribution = useMemo(() => {
    if (!report) return { high: 0, medium: 0, low: 0, total: 0 };
    const counts = { high: 0, medium: 0, low: 0, total: 0 };
    for (const item of report.sections.priorityActions.categorised || []) {
      const p = item.priority || 'low';
      counts[p]++;
      counts.total++;
    }
    return counts;
  }, [report]);


  const groupedModules = useMemo(() => {
    const groups: { groupId: string; label: string; modules: ModuleFindings[] }[] = [];
    for (const gId of GROUP_ORDER) {
      const groupDef = moduleGroups.find(g => g.id === gId);
      const mods = moduleFindings.filter(mf => mf.group === gId);
      if (mods.length > 0) {
        groups.push({ groupId: gId, label: groupDef?.label || gId, modules: mods });
      }
    }
    return groups;
  }, [moduleFindings]);

  const toggleModule = useCallback((code: string) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    setExpandedModules(new Set(moduleFindings.map(mf => mf.moduleCode)));
  }, [moduleFindings]);

  const collapseAll = useCallback(() => {
    setExpandedModules(new Set());
  }, []);

  if (!session) {
    return <div className="rp-page"><div className="rp-container"><div className="loading-state">Loading...</div></div></div>;
  }

  if (!hasCompletedModules) {
    return (
      <div className="rp-page">
        <div className="rp-container">
          <div className="rp-empty-state">
            <BarChart3 size={48} />
            <h2>No modules completed yet</h2>
            <p>Complete at least one module to view your accessibility report.</p>
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return <div className="rp-page"><div className="rp-container"><div className="loading-state">Generating report...</div></div></div>;
  }

  return (
    <div className="rp-page">
      <div className="rp-container">
        {/* Page header */}
        <div className="rp-header">
          <div className="rp-header-text">
            <h1>{isPulseCheck ? 'Pulse Check Summary' : 'Accessibility Report'}</h1>
            <p className="rp-subtitle">
              {organisationName} · Generated {new Date(report.generatedAt).toLocaleDateString('en-AU', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          <div className="rp-header-actions">
            <button className="btn-export rp-config-toggle" onClick={() => setShowConfig(!showConfig)}>
              {showConfig ? 'Close options' : 'Report options'}
            </button>
            <button className="btn-export" onClick={handleDownloadPDF}>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </button>
            {badgeProgress.level !== 'none' && (
              <button className="btn-export" onClick={handleDownloadCertificate}>
                <Award size={16} aria-hidden="true" />
                Certificate
              </button>
            )}
          </div>
        </div>

        <PageGuide pageId="report" features={REPORT_FEATURES} />

        {/* Collapsible report config */}
        {showConfig && (
          <div className="rp-config-panel">
            <div className="rp-config-panel-header">
              <h3 className="rp-config-panel-title">Report options</h3>
              <button
                className="rp-config-close"
                onClick={() => setShowConfig(false)}
                aria-label="Close report options"
              >
                &times;
              </button>
            </div>
            <ReportConfigSelector
              selectedModuleIds={selectedModuleIds}
              getModuleRuns={getModuleRuns}
              currentProgress={progress}
              onConfigChange={handleConfigChange}
              initialConfig={reportConfig}
            />
            <div className="rp-display-options">
              <div className="config-row comparison-toggle">
                <label className="toggle-label">
                  <input
                    type="checkbox"
                    checked={showStrengths}
                    onChange={() => setShowStrengths(s => !s)}
                  />
                  <span className="toggle-text">
                    <strong>Show strengths / what you are doing well</strong>
                    <span className="toggle-hint">Include positive findings alongside priority actions</span>
                  </span>
                </label>
              </div>
            </div>
            <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleGenerateReport}>
              Regenerate report
            </button>
          </div>
        )}

        {/* Introduction */}
        <div className="rp-intro">
          <p>
            This report summarises the findings of {isPulseCheck ? 'a pulse check' : 'an accessibility review'} conducted
            using Access Compass. {isPulseCheck
              ? 'A pulse check provides a high-level snapshot of current accessibility across selected areas.'
              : 'The review covers detailed findings across selected accessibility areas.'
            } Findings are benchmarked against the Disability (Access to Premises-Buildings) Standards 2010,
            the National Construction Code, relevant Australian Standards including AS 1428.1, and the
            Web Content Accessibility Guidelines (WCAG) 2.2 for digital content.
            Recommendations that extend beyond mandatory compliance are identified as best practice.
          </p>
          <details className="rp-intro-details" open>
            <summary className="rp-intro-summary">Your obligations under the Disability Discrimination Act</summary>
            <div className="rp-intro-body">
              <p>
                All organisations have responsibilities under the <strong>Disability Discrimination Act 1992</strong> to
                provide equitable and dignified access to premises, goods and services. Disability is broadly defined and
                includes physical, intellectual, sensory, neurological, cognitive and psychosocial conditions.
              </p>
              <p>
                The <strong>Disability (Access to Premises-Buildings) Standards 2010</strong> set minimum access
                requirements for new buildings and those undergoing significant upgrade or refurbishment. Mandatory
                compliance requirements are triggered when building work requires development approval.
                However, organisations can voluntarily make accessibility improvements at any time.
                Elements not covered by the Premises Standards remain subject to the broader provisions of the DDA.
              </p>
              <p>
                Regardless of whether building work is planned, any person with disability may lodge a complaint
                under the DDA if they experience discrimination in accessing premises, goods or services.
                Proactively addressing accessibility barriers reduces this risk and demonstrates a commitment
                to equitable access.
              </p>
              <p>
                Where a person with disability seeks to access or use premises, appropriate and reasonable adjustments
                are required. Provision of wheelchair access alone does not meet all access needs. Older people and
                people with disability experience a wide range of needs affecting sight, hearing, mobility, balance
                and cognitive processing.
              </p>
            </div>
          </details>
        </div>

        {/* Executive summary stats */}
        <div className="rp-summary-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-number">{report.executiveSummary.modulesCompleted}</div>
            <div className="rp-stat-label">Modules completed</div>
          </div>
          <div className="rp-stat-card rp-stat-positive">
            <div className="rp-stat-number">{report.executiveSummary.strengthsCount}</div>
            <div className="rp-stat-label">Strengths</div>
          </div>
          <div className="rp-stat-card rp-stat-action">
            <div className="rp-stat-number">{report.executiveSummary.actionsCount}</div>
            <div className="rp-stat-label">Priority actions</div>
          </div>
          <div className="rp-stat-card rp-stat-explore">
            <div className="rp-stat-number">{report.executiveSummary.areasToExploreCount}</div>
            <div className="rp-stat-label">To investigate</div>
          </div>
        </div>

        {/* Priority distribution */}
        {priorityDistribution.total > 0 && (
          <div className="rp-priority-distribution">
            <h2>Priority distribution</h2>
            <div className="rp-distribution-bar" role="img" aria-label={`${priorityDistribution.high} high, ${priorityDistribution.medium} medium, ${priorityDistribution.low} low priority actions`}>
              {priorityDistribution.high > 0 && (
                <div className="rp-dist-segment rp-dist-high" style={{ flex: priorityDistribution.high }}>
                  {priorityDistribution.high}
                </div>
              )}
              {priorityDistribution.medium > 0 && (
                <div className="rp-dist-segment rp-dist-medium" style={{ flex: priorityDistribution.medium }}>
                  {priorityDistribution.medium}
                </div>
              )}
              {priorityDistribution.low > 0 && (
                <div className="rp-dist-segment rp-dist-low" style={{ flex: priorityDistribution.low }}>
                  {priorityDistribution.low}
                </div>
              )}
            </div>
            <div className="rp-distribution-legend">
              <span className="rp-legend-item"><span className="rp-legend-dot rp-dot-high" /> High ({priorityDistribution.high}) - {priorityDistribution.total > 0 ? Math.round((priorityDistribution.high / priorityDistribution.total) * 100) : 0}%</span>
              <span className="rp-legend-item"><span className="rp-legend-dot rp-dot-medium" /> Medium ({priorityDistribution.medium}) - {priorityDistribution.total > 0 ? Math.round((priorityDistribution.medium / priorityDistribution.total) * 100) : 0}%</span>
              <span className="rp-legend-item"><span className="rp-legend-dot rp-dot-low" /> Low ({priorityDistribution.low}) - {priorityDistribution.total > 0 ? Math.round((priorityDistribution.low / priorityDistribution.total) * 100) : 0}%</span>
            </div>
          </div>
        )}

        {/* Critical issues section removed - findings by module provides this detail */}

        {/* Module findings - grouped by category */}
        <div className="rp-modules-section">
          <div className="rp-modules-header">
            <h2>Findings by module</h2>
            <div className="rp-modules-controls">
              <button className="rp-text-btn" onClick={expandAll}>Expand all</button>
              <span aria-hidden="true">|</span>
              <button className="rp-text-btn" onClick={collapseAll}>Collapse all</button>
            </div>
          </div>

          <dl className="rp-priority-legend" aria-label="Priority level definitions">
            {PRIORITY_LEGEND.map(({ level, label, description }) => (
              <div key={level} className={`rp-legend-def rp-legend-def-${level}`}>
                <dt>{label}</dt>
                <dd>{description}</dd>
              </div>
            ))}
            <div className="rp-legend-def rp-legend-def-explore">
              <dt>Areas to explore</dt>
              <dd>Items marked "Unable to check" during your assessment — investigate these to confirm your accessibility status</dd>
            </div>
            <div className="rp-legend-def rp-legend-def-strengths">
              <dt>What's going well</dt>
              <dd>Areas where your current practices meet or exceed accessibility expectations</dd>
            </div>
          </dl>
          <p className="rp-priority-encouragement">{PRIORITY_ENCOURAGEMENT}</p>

          {groupedModules.map(group => (
            <div key={group.groupId} className="rp-category-group">
              <h3 className="rp-category-heading">{group.label}</h3>
              <div className="rp-module-tiles">
                {group.modules.map(mf => (
                  <ModuleTile
                    key={mf.moduleCode}
                    finding={mf}
                    isExpanded={expandedModules.has(mf.moduleCode)}
                    onToggle={() => toggleModule(mf.moduleCode)}
                    detailedFindings={report.detailedFindings}
                    showStrengths={showStrengths}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Next steps */}
        <div className="rp-next-steps">
          <h2>Next steps</h2>
          <div className="rp-next-steps-grid">
            <div className="rp-next-step-col">
              <h3>Things you can explore now</h3>
              <ul>
                {report.nextSteps.exploreNow.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
            <div className="rp-next-step-col">
              <h3>Things to plan for later</h3>
              <ul>
                {report.nextSteps.planForLater.map((step, i) => <li key={i}>{step}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* Professional Support */}
        {report.sections.professionalReview?.categorised &&
          report.sections.professionalReview.categorised.length > 0 && (
          <div className="rp-professional-support">
            <h2>Professional support</h2>
            <p className="rp-prof-intro">
              Based on your responses, the following areas may benefit from specialist input.
              Items are grouped by the type of professional who can help.
            </p>
            {groupProfessionalReviewByExpertise(report.sections.professionalReview.categorised).map(group => (
              <div key={group.type} className="rp-prof-group">
                <div className="rp-prof-group-header">
                  <strong>{group.label}</strong>
                  <span className="rp-prof-codes">{group.moduleCodes.join(', ')}</span>
                </div>
                <p className="rp-prof-group-desc">{group.description}</p>
              </div>
            ))}
            <div className="rp-prof-cta">
              <span className="rp-prof-cta-label">{FLARE_CONTACT.label}</span>
              <div className="rp-prof-cta-links">
                <a href={`mailto:${FLARE_CONTACT.email}`}>{FLARE_CONTACT.email}</a>
                <span className="rp-prof-cta-sep" aria-hidden="true">|</span>
                <a href={`https://${FLARE_CONTACT.website}`} target="_blank" rel="noopener noreferrer">{FLARE_CONTACT.website}</a>
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="rp-disclaimer">
          <h2>Important disclaimer</h2>
          <p>
            This guidance is for information only. It is not legal advice, a compliance
            certificate, or a substitute for professional accessibility auditing. Actions are
            suggestions based on your responses.
          </p>
          <p>
            This review is indicative only and based on self-reported information. It does not
            verify accuracy or confirm compliance with accessibility standards or legal requirements.
          </p>
        </div>

        <PageFooter />
      </div>

    </div>
  );
}
