import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, BarChart3, Settings, Eye, Users as UsersIcon } from 'lucide-react';
import { getSession, getDiscoveryData } from '../utils/session';
import { normalizeModuleCode } from '../utils/moduleCompat';
import { useReportGeneration } from '../hooks/useReportGeneration';
import { useModuleProgress } from '../hooks/useModuleProgress';
import type { ModuleProgress, ModuleSummary, QuestionResponse } from '../hooks/useModuleProgress';
import { useAuth } from '../contexts/AuthContext';
import { useSites, useActiveSiteId } from '../hooks/useSites';
import { supabase } from '../utils/supabase';
import { SiteContextBar } from '../components/SiteContextBar';
import { ReportConfigSelector, type ReportConfig } from '../components/ReportConfigSelector';
import { downloadPDFReport, downloadExecutiveSummaryPDF } from '../utils/pdfGenerator';
import { getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PRIORITY_LEGEND, PRIORITY_LABELS, PRIORITY_BADGE_ABBR, PRIORITY_ENCOURAGEMENT } from '../utils/priorityCalculation';
import { groupProfessionalReviewByExpertise, FLARE_CONTACT } from '../utils/professionalSupportGroups';
import { accessModules, moduleGroups } from '../data/accessModules';
import { PageFooter } from '../components/PageFooter';
import { usePageTitle } from '../hooks/usePageTitle';

import type { ReviewMode } from '../types/index';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import { PageGuide, type GuideFeature } from '../components/PageGuide';
import './ReportPage.css';

const REPORT_FEATURES: GuideFeature[] = [
  { icon: Download, title: 'Download PDF', description: 'Export your full accessibility report as a formatted PDF document.' },
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
  onResourceClick,
}: {
  finding: ModuleFindings;
  isExpanded: boolean;
  onToggle: () => void;
  detailedFindings?: Report['detailedFindings'];
  showStrengths?: boolean;
  onResourceClick?: () => void;
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
                                        state={{ from: 'report', returnTo: '/report' }}
                                        onClick={onResourceClick}
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
                              state={{ from: 'report', returnTo: '/report' }}
                                        onClick={onResourceClick}
                              className="rp-resource-link"
                            >
                              View guide: {help.title || 'Resource guide'}
                            </Link>
                          ) : (
                            <Link
                              to={categoryLink}
                              state={{ from: 'report', returnTo: '/report' }}
                                        onClick={onResourceClick}
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
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    const saved = sessionStorage.getItem('report_expanded_modules');
    if (saved) {
      try { return new Set(JSON.parse(saved)); } catch { /* ignore */ }
    }
    return new Set();
  });
  const [showConfig, setShowConfig] = useState(false);
  const [showStrengths, setShowStrengths] = useState(true);

  // Restore scroll position after report renders when returning from resource hub
  useEffect(() => {
    if (!report) return;
    const savedScroll = sessionStorage.getItem('report_scroll_position');
    if (savedScroll) {
      // Wait for DOM to update with expanded modules and report content
      requestAnimationFrame(() => {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScroll, 10));
          sessionStorage.removeItem('report_scroll_position');
          sessionStorage.removeItem('report_expanded_modules');
        }, 300);
      });
    }
  }, [report]);

  // Save scroll position and expanded modules before navigating to resource
  const handleResourceClick = useCallback(() => {
    sessionStorage.setItem('report_scroll_position', String(window.scrollY));
    sessionStorage.setItem('report_expanded_modules', JSON.stringify([...expandedModules]));
  }, [expandedModules]);

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
  // Prefer the authenticated org name; the onboarding business_snapshot can
  // hold a stale/leftover test-org name.
  const { accessState } = useAuth();
  const { sites } = useSites();
  const [activeSiteId] = useActiveSiteId();
  const activeSiteName = sites.find(s => s.id === activeSiteId)?.name;
  const organisationName = accessState.organisation?.name
    || session?.business_snapshot?.organisation_name
    || 'Your Organisation';

  // Organisation-wide on a multi-site org: aggregate every venue's assessment
  // into one progress map so the report covers the whole council, not the empty
  // org-level scope. Per-venue views leave this null and use site-scoped data.
  const orgId = accessState.organisation?.id;
  const isOrgWideMultiSite = !activeSiteId && sites.length > 0;
  const [orgWideProgress, setOrgWideProgress] = useState<Record<string, ModuleProgress> | null>(null);

  useEffect(() => {
    if (!isOrgWideMultiSite || !orgId || !supabase) { setOrgWideProgress(null); return; }
    const sb = supabase;
    const oid = orgId;
    let cancelled = false;
    (async () => {
      const [mpRes, respRes] = await Promise.all([
        sb.from('module_progress').select('module_id, module_code, status, summary, confidence_snapshot').eq('organisation_id', oid),
        sb.from('module_responses').select('module_id, question_id, answer, notes, partial_description, other_description, link_value, updated_at').eq('organisation_id', oid),
      ]);
      if (cancelled) return;
      const map: Record<string, ModuleProgress> = {};
      for (const r of (mpRes.data as Record<string, unknown>[] | null) ?? []) {
        const id = r.module_id as string;
        const summary = r.summary as ModuleSummary | null;
        const existing = map[id];
        if (!existing) {
          map[id] = {
            moduleId: id,
            moduleCode: (r.module_code as string) || id,
            status: (r.status as ModuleProgress['status']) || 'not-started',
            responses: [],
            summary: summary ? { ...summary } : undefined,
            confidenceSnapshot: (r.confidence_snapshot as ModuleProgress['confidenceSnapshot']) ?? undefined,
          };
        } else {
          if (r.status === 'completed') existing.status = 'completed';
          if (summary) {
            const s = existing.summary ?? { doingWell: [], priorityActions: [], areasToExplore: [], professionalReview: [] };
            existing.summary = {
              doingWell: [...(s.doingWell || []), ...(summary.doingWell || [])],
              priorityActions: [...(s.priorityActions || []), ...(summary.priorityActions || [])],
              areasToExplore: [...(s.areasToExplore || []), ...(summary.areasToExplore || [])],
              professionalReview: [...(s.professionalReview || []), ...(summary.professionalReview || [])],
            };
          }
        }
      }
      for (const r of (respRes.data as Record<string, unknown>[] | null) ?? []) {
        const id = r.module_id as string;
        if (!map[id]) continue;
        map[id].responses.push({
          questionId: r.question_id as string,
          answer: (r.answer as QuestionResponse['answer']) ?? null,
          notes: (r.notes as string) || undefined,
          partialDescription: (r.partial_description as string) || undefined,
          otherDescription: (r.other_description as string) || undefined,
          linkValue: (r.link_value as string) || undefined,
          timestamp: (r.updated_at as string) || new Date().toISOString(),
        });
      }
      setOrgWideProgress(map);
    })().catch(() => { if (!cancelled) setOrgWideProgress(null); });
    return () => { cancelled = true; };
  }, [isOrgWideMultiSite, orgId]);

  // Statutory reporting jurisdiction, for the legislative-alignment section.
  const [jurisdiction, setJurisdiction] = useState<string>('AU');
  useEffect(() => {
    if (!orgId || !supabase) return;
    supabase.from('organisations').select('jurisdiction').eq('id', orgId).maybeSingle()
      .then(({ data }) => {
        const j = (data as { jurisdiction?: string } | null)?.jurisdiction;
        if (j) setJurisdiction(j);
      });
  }, [orgId]);

  const { generateReport, isReady, getModuleRuns } = useReportGeneration(
    selectedModuleIds,
    isOrgWideMultiSite ? orgWideProgress : null,
  );
  const { progress } = useModuleProgress(selectedModuleIds);


  const hasCompletedModules = useMemo(() => {
    const source = isOrgWideMultiSite && orgWideProgress ? orgWideProgress : progress;
    return Object.values(source).some(p => p.status === 'completed');
  }, [progress, isOrgWideMultiSite, orgWideProgress]);

  const handleGenerateReport = useCallback(() => {
    if (!isReady) return;
    const r = generateReport(reviewMode, organisationName, reportConfig, activeSiteName, jurisdiction);
    setReport(r);
  }, [isReady, generateReport, reviewMode, organisationName, reportConfig, activeSiteName, jurisdiction]);

  // Auto-generate on first load only
  const [hasAutoGenerated, setHasAutoGenerated] = useState(false);
  useEffect(() => {
    if (isReady && hasCompletedModules && !hasAutoGenerated) {
      setHasAutoGenerated(true);
      const r = generateReport(reviewMode, organisationName, reportConfig, activeSiteName, jurisdiction);
      setReport(r);
    }
  }, [isReady, hasCompletedModules, hasAutoGenerated, generateReport, reviewMode, organisationName, reportConfig, activeSiteName, jurisdiction]);

  // Keep the report in step with the active venue. Module progress is
  // site-scoped, so generateReport's identity changes once the new site's
  // progress has loaded; regenerate then so switching venues refreshes the
  // report instead of leaving a stale one on screen.
  useEffect(() => {
    if (!isReady || !hasAutoGenerated) return;
    setReport(generateReport(reviewMode, organisationName, reportConfig, activeSiteName, jurisdiction));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSiteName, generateReport, jurisdiction]);

  const handleConfigChange = useCallback((config: ReportConfig) => {
    setReportConfig(config);
  }, []);

  const handleDownloadPDF = useCallback(() => {
    if (!report) return;
    downloadPDFReport(report);
  }, [report]);

  const handleDownloadExecSummary = useCallback(() => {
    if (!report) return;
    downloadExecutiveSummaryPDF(report);
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
          <SiteContextBar />
          <div className="rp-empty-state">
            <BarChart3 size={48} />
            <h2>No modules completed yet</h2>
            <p>Complete at least one module to view your accessibility report{sites.length > 0 ? ', or switch venue above' : ''}.</p>
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
        <SiteContextBar />
        {/* Page header */}
        <div className="rp-header">
          <div className="rp-header-text">
            <h1>{isPulseCheck ? 'Pulse Check Summary' : 'Accessibility Report'}</h1>
            <p className="rp-subtitle">
              {organisationName}{report.siteName ? ` · ${report.siteName}` : ''} · Generated {new Date(report.generatedAt).toLocaleDateString('en-AU', {
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
            <button className="btn-export" onClick={handleDownloadExecSummary} title="One-page board / exec summary">
              <Download size={16} aria-hidden="true" />
              Exec summary
            </button>
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
            the National Construction Code, relevant Australian Standards including AS 1428.1 and the
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

        {/* Overall finding - the one-line "are we doing well?" answer */}
        {report.analysis.headline && (
          <p className="rp-headline"><strong>Overall finding:</strong> {report.analysis.headline}</p>
        )}

        {/* Accessibility maturity - the headline "where are we" */}
        {report.maturity.started && (
          <div className="rp-maturity">
            <div className="rp-maturity-head">
              <span className="rp-maturity-tag">Accessibility maturity</span>
              <b className={`rp-maturity-level rp-mat-${report.maturity.levelIdx}`}>{report.maturity.level}</b>
              {report.maturity.nextStage && (
                <span className="rp-maturity-next">Next: reach {report.maturity.nextStage}</span>
              )}
            </div>
            <div
              className="rp-maturity-meter"
              role="img"
              aria-label={`Maturity level ${report.maturity.level}, ${report.maturity.levelIdx + 1} of 4`}
            >
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`rp-mat-seg${i <= report.maturity.levelIdx ? ` rp-mat-seg-on rp-mat-${i}` : ''}`} />
              ))}
            </div>
            <div className="rp-maturity-labels" aria-hidden="true">
              {['Emerging', 'Developing', 'Established', 'Embedded'].map((lv, i) => (
                <span key={lv} className={i === report.maturity.levelIdx ? 'cur' : ''}>{lv}</span>
              ))}
            </div>
            <div className="rp-maturity-coverage">
              <span className={`rp-maturity-conf rp-conf-${report.maturity.confidence.toLowerCase()}`}>
                {report.maturity.confidence} confidence
              </span>
              <span>
                Based on {report.executiveSummary.modulesCompleted} of {report.executiveSummary.totalModules} areas
                assessed ({report.maturity.coveragePct}%) · {report.maturity.performancePct}% doing well
              </span>
            </div>
            <p className="rp-maturity-meaning">{report.maturity.meaning}</p>
          </div>
        )}

        {/* Executive interpretation - what the data means */}
        {report.analysis.interpretation.length > 0 && (
          <div className="rp-interpretation">
            <h2>Executive interpretation</h2>
            {report.analysis.interpretation.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}

        {/* Executive summary stats */}
        <div className="rp-summary-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-number">{report.executiveSummary.modulesCompleted}</div>
            <div className="rp-stat-label">Areas reviewed</div>
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

        {/* Estimated effort - the budgeting view */}
        <div className="rp-effort rp-effort-three">
          <div className="rp-effort-tile"><b>{report.analysis.effort.quickWins}</b><span>Quick wins</span></div>
          <div className="rp-effort-tile rp-effort-op"><b>{report.analysis.effort.operational}</b><span>Operational</span></div>
          <div className="rp-effort-tile rp-effort-cap"><b>{report.analysis.effort.capital}</b><span>Capital works likely</span></div>
        </div>
        <p className="rp-effort-caption">Estimated effort. Operational covers changes that can begin now without major works (communications, customer service, policy, staff training and signage). Capital works are built-environment items likely to need planning and budget.</p>

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

        {/* Legislative alignment - coverage & gaps against the jurisdiction's framework */}
        {report.frameworkAlignment && (
          <div className="rp-legal">
            <h2>Legislative alignment</h2>
            <div className="rp-legal-head">
              <span className={`rp-legal-badge rp-legal-badge-${report.frameworkAlignment.mandate}`}>
                {report.frameworkAlignment.mandate === 'statutory' ? 'Statutory reporting framework'
                  : report.frameworkAlignment.mandate === 'voluntary' ? 'Voluntary alignment aid'
                  : report.frameworkAlignment.mandate === 'national' ? 'National framework'
                  : 'Reference framework'}
              </span>
              <span className="rp-legal-fw">{report.frameworkAlignment.frameworkName}</span>
            </div>
            <p className="rp-legal-note">
              How your self-review aligns to this framework's outcome domains and where coverage gaps remain. This is an
              alignment aid to support planning and reporting, not a compliance audit or certification.
            </p>
            {report.frameworkAlignment.mandate === 'national' && (
              <p className="rp-legal-nudge">
                You're viewing alignment to the national framework. If you report against a state or territory disability
                plan (for example South Australia's Inclusive SA), set your reporting jurisdiction in Organisation
                settings to align this report to that statutory framework.
              </p>
            )}
            <div className="rp-legal-legend" aria-hidden="true">
              <span><span className="rp-legal-dot rp-legal-strong" /> Doing well</span>
              <span><span className="rp-legal-dot rp-legal-mixed" /> Mixed</span>
              <span><span className="rp-legal-dot rp-legal-needs" /> Needs work</span>
              <span><span className="rp-legal-dot rp-legal-gap" /> Not yet assessed</span>
            </div>
            <div className="rp-legal-domains">
              {report.frameworkAlignment.domains.map(d => (
                <div key={d.domainId} className="rp-legal-domain">
                  <div className="rp-legal-domain-head">
                    <span className="rp-legal-domain-name">{d.name}</span>
                    {d.total === 0
                      ? <span className="rp-legal-gap-chip">Not yet assessed</span>
                      : <span className="rp-legal-count">{d.moduleIds.length} area{d.moduleIds.length !== 1 ? 's' : ''} assessed</span>}
                  </div>
                  {d.outcomeStatement && <p className="rp-legal-outcome">{d.outcomeStatement}</p>}
                  {d.total > 0 && (
                    <div className="rp-legal-bar" role="img" aria-label={`${d.strongPct}% doing well, ${d.mixedPct}% mixed, ${d.needsWorkPct}% needs work`}>
                      {d.strong > 0 && <span className="rp-legal-seg rp-legal-strong" style={{ flex: d.strong }} />}
                      {d.mixed > 0 && <span className="rp-legal-seg rp-legal-mixed" style={{ flex: d.mixed }} />}
                      {d.needsWork > 0 && <span className="rp-legal-seg rp-legal-needs" style={{ flex: d.needsWork }} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <p className="rp-legal-cite">{report.frameworkAlignment.citation}</p>
          </div>
        )}

        {/* Performance by area (theme breakdown) */}
        {report.themeBreakdown.length > 0 && (
          <div className="rp-theme-breakdown">
            <h2>Performance by area</h2>
            <div className="rp-theme-rows">
              {report.themeBreakdown.map(t => {
                const noFindings = t.strengths + t.actions === 0;
                return (
                  <div key={t.group} className="rp-theme-row">
                    <span className="rp-theme-label">{t.label}</span>
                    <span className="rp-theme-bar">
                      {!noFindings && (
                        <span
                          className={`rp-theme-bar-fill rp-perf-${t.performancePct >= 67 ? 'good' : t.performancePct >= 34 ? 'mid' : 'low'}`}
                          style={{ width: `${t.performancePct}%` }}
                        />
                      )}
                    </span>
                    <span className={`rp-theme-pct${noFindings ? ' rp-theme-na' : ''}`}>{noFindings ? 'No findings' : `${t.performancePct}%`}</span>
                  </div>
                );
              })}
            </div>
            <p className="rp-theme-note">Share of checks already going well in each area assessed. Lower bars are where to focus.</p>
          </div>
        )}

        {/* Recurring themes across recommendations */}
        {report.analysis.recurringThemes.length > 0 && (
          <div className="rp-analysis-block">
            <h2>Recurring themes</h2>
            <p className="rp-analysis-sub">Themes that appear across multiple recommendations, most frequent first.</p>
            <div className="rp-freq-rows">
              {report.analysis.recurringThemes.map(t => (
                <div key={t.label} className="rp-freq-row">
                  <span className="rp-freq-label">{t.label}</span>
                  <span className="rp-freq-bar">
                    <span className="rp-freq-fill" style={{ width: `${Math.round((t.count / report.analysis.recurringThemes[0].count) * 100)}%` }} />
                  </span>
                  <span className="rp-freq-count">{t.count}</span>
                </div>
              ))}
            </div>
            {report.analysis.recurringInsight && (
              <p className="rp-analysis-insight">{report.analysis.recurringInsight}</p>
            )}
            {report.analysis.themeLeads.length > 0 && (
              <table className="rp-leads">
                <thead><tr><th>Theme</th><th>Suggested lead</th></tr></thead>
                <tbody>
                  {report.analysis.themeLeads.map(l => (
                    <tr key={l.theme}><td>{l.theme}</td><td>{l.lead}</td></tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Where the priorities sit */}
        {report.analysis.thematicSummaries.length > 0 && (
          <div className="rp-analysis-block">
            <h2>Where the priorities sit</h2>
            <p className="rp-analysis-sub">The domains carrying the most high-priority actions. Address these first, they affect the whole visitor journey.</p>
            <div className="rp-thematic-rows">
              {report.analysis.thematicSummaries.map((s) => (
                <div key={s.label} className="rp-thematic-row">
                  <div className="rp-thematic-head">
                    <span className="rp-thematic-name">{s.label}</span>
                    <span className="rp-thematic-pct">{s.pct}%</span>
                  </div>
                  <div className="rp-thematic-bar"><span className="rp-thematic-fill" style={{ width: `${s.pct}%` }} /></div>
                  <p className="rp-thematic-sub">
                    {s.count} of {s.total} {s.scopeHigh ? 'high-priority' : 'total'} actions
                    {s.barriers.length > 0 ? ` · Barriers: ${s.barriers.join(', ')}` : ''}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Where you're strongest */}
        {report.analysis.strengthsByTheme.length > 0 && (
          <div className="rp-analysis-block">
            <h2>Where you're strongest</h2>
            <p className="rp-analysis-sub">Areas with the most strengths identified, highest first.</p>
            <div className="rp-freq-rows">
              {report.analysis.strengthsByTheme.map(t => (
                <div key={t.label} className="rp-freq-row">
                  <span className="rp-freq-label">{t.label}</span>
                  <span className="rp-freq-bar">
                    <span className="rp-freq-fill rp-freq-fill-good" style={{ width: `${Math.round((t.count / report.analysis.strengthsByTheme[0].count) * 100)}%` }} />
                  </span>
                  <span className="rp-freq-count">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested starting sequence */}
        {report.analysis.startingSequence.length > 0 && (
          <div className="rp-analysis-block">
            <h2>Suggested implementation roadmap</h2>
            <p className="rp-analysis-sub">Indicative time bands to work through the actions, with the achievable operational items first. A starting point for your own planning, not a fixed schedule.</p>
            <div className="rp-sequence">
              {report.analysis.startingSequence.map((step, i) => (
                <div key={i} className="rp-sequence-step">
                  <div className="rp-sequence-head">{step.heading}</div>
                  <ul>{step.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Why this matters */}
        {report.analysis.whyItMatters && (
          <div className="rp-analysis-block rp-why">
            <h2>Why this matters</h2>
            <p>{report.analysis.whyItMatters}</p>
          </div>
        )}

        {/* Critical issues section removed - findings by module provides this detail */}

        {/* Module findings - grouped by category */}
        <div className="rp-modules-section">
          <div className="rp-modules-header">
            <h2>Findings by module</h2>
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
              <dd>Items marked "Unable to check" during your assessment. Investigate these to confirm your accessibility status</dd>
            </div>
            <div className="rp-legend-def rp-legend-def-strengths">
              <dt>What's going well</dt>
              <dd>Areas where your current practices meet or exceed accessibility expectations</dd>
            </div>
          </dl>
          <p className="rp-priority-encouragement">{PRIORITY_ENCOURAGEMENT}</p>

          <div className="rp-expand-controls">
            <button className="rp-text-btn" onClick={expandAll}>Expand all</button>
            <span aria-hidden="true">|</span>
            <button className="rp-text-btn" onClick={collapseAll}>Collapse all</button>
          </div>

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
                    onResourceClick={handleResourceClick}
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
