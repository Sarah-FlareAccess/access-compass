import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, BarChart3, Shield, ArrowUp } from 'lucide-react';
import { getSession, getDiscoveryData } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { ReportConfigSelector, type ReportConfig } from '../components/ReportConfigSelector';
import { downloadPDFReport } from '../utils/pdfGenerator';
import { getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PRIORITY_LEGEND } from '../utils/priorityCalculation';
import { accessModules, moduleGroups } from '../data/accessModules';
import { PageFooter } from '../components/PageFooter';
import { usePageTitle } from '../hooks/usePageTitle';
import type { ReviewMode } from '../types/index';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import './ReportPage.css';

const PRIORITY_BADGE_LABEL: Record<string, string> = { high: 'H', medium: 'M', low: 'L' };

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
  if (counts.high > 0) parts.push({ key: 'high', label: 'H', count: counts.high });
  if (counts.medium > 0) parts.push({ key: 'medium', label: 'M', count: counts.medium });
  if (counts.low > 0) parts.push({ key: 'low', label: 'L', count: counts.low });
  if (parts.length === 0) return <span className="rp-no-actions">No actions needed</span>;
  return (
    <span className="rp-priority-counts" aria-label={parts.map(p => `${p.count} ${p.key} priority`).join(', ')}>
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
          {isExpanded ? <ChevronUp size={18} aria-hidden="true" /> : <ChevronDown size={18} aria-hidden="true" />}
        </div>
      </button>

      {isExpanded && (
        <div className="rp-module-tile-body">
          {/* Strengths */}
          {showStrengths && totalStrengths > 0 && (
            <div className="rp-module-section">
              <h4 className="rp-module-section-title rp-section-strengths">What's going well ({totalStrengths})</h4>
              <ul className="rp-item-list rp-list-strengths">
                {finding.strengths.map((item, i) => (
                  <li key={i}>{cleanStatementText(item.text)}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions by priority tier */}
          {totalActions > 0 && (
            <div className="rp-module-section">
              <h4 className="rp-module-section-title rp-section-actions">Priority actions ({totalActions})</h4>
              {tiers.map(tier => (
                <div key={tier.priority} className="rp-action-tier">
                  <div className={`rp-tier-heading rp-tier-heading-${tier.priority}`}>
                    <span className={`rp-tier-badge rp-tier-badge-${tier.priority}`} aria-hidden="true">
                      {PRIORITY_BADGE_LABEL[tier.priority]}
                    </span>
                    <span>{tier.priority.charAt(0).toUpperCase() + tier.priority.slice(1)} priority</span>
                    <span className="rp-tier-count">({tier.items.length})</span>
                  </div>
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
                </div>
              ))}
            </div>
          )}

          {/* Areas to explore */}
          {finding.explores.length > 0 && (
            <div className="rp-module-section">
              <h4 className="rp-module-section-title rp-section-explore">Areas to explore ({finding.explores.length})</h4>
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
            </div>
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
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showStrengths, setShowStrengths] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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

  const hasCompletedModules = useMemo(() => {
    return Object.values(progress).some(p => p.status === 'completed');
  }, [progress]);

  const handleGenerateReport = useCallback(() => {
    if (!isReady) return;
    const r = generateReport(reviewMode, organisationName, reportConfig);
    setReport(r);
  }, [isReady, generateReport, reviewMode, organisationName, reportConfig]);

  useEffect(() => {
    if (isReady && hasCompletedModules && !report) {
      handleGenerateReport();
    }
  }, [isReady, hasCompletedModules, report, handleGenerateReport]);

  const handleConfigChange = useCallback((config: ReportConfig) => {
    setReportConfig(config);
    setReport(null);
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

  const criticalIssues = useMemo(() => {
    if (!report) return [];
    const highItems = (report.sections.priorityActions.categorised || [])
      .filter(i => i.priority === 'high')
      .slice(0, 7);
    return highItems;
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
            <button className="btn btn-secondary rp-config-toggle" onClick={() => setShowConfig(!showConfig)}>
              Report options
            </button>
            <button className="btn btn-primary" onClick={handleDownloadPDF}>
              <Download size={16} aria-hidden="true" />
              Download PDF
            </button>
          </div>
        </div>

        {/* Collapsible report config */}
        {showConfig && (
          <div className="rp-config-panel">
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
            <div className="rp-stat-label">Areas to explore</div>
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

        {/* Critical issues */}
        {criticalIssues.length > 0 && (
          <div className="rp-critical-issues">
            <h2><Shield size={20} aria-hidden="true" /> Critical issues requiring priority attention</h2>
            <ol className="rp-critical-list">
              {criticalIssues.map((item, i) => (
                <li key={i}>
                  <span className="rp-critical-module">{item.moduleCode}</span>
                  <span>{formatActionText(item)}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

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
          </dl>

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

      {showScrollTop && (
        <button
          className="rp-back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <ArrowUp size={20} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
