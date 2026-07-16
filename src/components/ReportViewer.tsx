/**
 * Report Viewer Component
 *
 * Displays the accessibility review report in-app with different layouts
 * for pulse-check (1-page summary) vs deep-dive (detailed report).
 *
 * Features:
 * - Collapsible report sections (ReportGroup)
 * - Priority actions grouped by module (CategorisedList)
 * - Jump-to-details for every priority action item
 * - Back-to-priority-actions from detailed findings
 * - Sticky jump navigation bar
 * - Scroll-to-top button
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ExternalLink, ArrowUp } from 'lucide-react';
import type { Report, CategorisedItem } from '../hooks/useReportGeneration';
import { downloadPDFReport } from '../utils/pdfGenerator';
import { RESPONSE_LABELS } from '../constants/responseOptions';
import { hasHelpContent, getHelpByQuestionId } from '../data/help';
import { getResourceLink } from '../utils/resourceLinks';
import { PRIORITY_LEGEND } from '../utils/priorityCalculation';
import './ReportViewer.css';

function formatAnalysisType(analysisType: string): string {
  const labels: Record<string, string> = {
    'menu': 'Menu',
    'brochure': 'Brochure',
    'flyer': 'Flyer',
    'large-print': 'Large Print',
    'signage': 'Signage',
    'lighting': 'Lighting',
    'ground-surface': 'Ground Surface',
    'pathway': 'Pathway',
    'entrance': 'Entrance',
    'ramp': 'Ramp',
    'stairs': 'Stairs',
    'door': 'Door',
    'social-media-post': 'Social Media Post',
    'social-media-url': 'Social Media Profile',
    'website-wave': 'Website Audit',
  };
  return labels[analysisType] || analysisType;
}

function formatStatus(status: string): string {
  const labels: Record<string, string> = {
    'excellent': 'Excellent',
    'good': 'Good',
    'needs-improvement': 'Needs Improvement',
    'poor': 'Poor',
    'not-assessable': 'Not Assessable',
    'missing': 'Missing',
  };
  return labels[status] || status;
}

// --- Collapsible section wrapper ---
function ReportGroup({
  id,
  title,
  defaultOpen = true,
  children,
}: {
  id: string;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = `${id}-content`;

  return (
    <div className="report-group" id={id}>
      <button
        className="report-group-header"
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(v => !v)}
        title={open ? `Collapse ${title}` : `Expand ${title}`}
      >
        <span className="report-group-title">{title}</span>
        <ChevronDown
          size={20}
          className={`report-group-chevron${open ? ' report-group-chevron-open' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id={contentId}
        className={`report-group-body${open ? '' : ' report-group-body-collapsed'}`}
        role="region"
        aria-labelledby={id}
      >
        {open && children}
      </div>
    </div>
  );
}

// --- Priority sort order ---
const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

// --- Group CategorisedItems by module, sorted by module code ---
function groupByModule(items: CategorisedItem[]): { moduleCode: string; moduleName: string; items: CategorisedItem[] }[] {
  const map = new Map<string, { moduleCode: string; moduleName: string; items: CategorisedItem[] }>();
  for (const item of items) {
    const key = item.moduleCode;
    if (!map.has(key)) {
      map.set(key, { moduleCode: item.moduleCode, moduleName: item.moduleName, items: [] });
    }
    map.get(key)!.items.push(item);
  }
  const groups = Array.from(map.values());
  groups.sort((a, b) => a.moduleCode.localeCompare(b.moduleCode, undefined, { numeric: true }));
  for (const group of groups) {
    group.items.sort((a, b) => (PRIORITY_ORDER[a.priority || 'low'] ?? 2) - (PRIORITY_ORDER[b.priority || 'low'] ?? 2));
  }
  return groups;
}

// --- Priority badge labels ---
const PRIORITY_BADGE_LABEL: Record<string, string> = { high: 'H', medium: 'M', low: 'L' };

// --- Summary counts for a module group ---
function PrioritySummary({ items }: { items: CategorisedItem[] }) {
  const counts = { high: 0, medium: 0, low: 0 };
  for (const item of items) {
    const p = item.priority || 'low';
    counts[p]++;
  }
  const parts: { key: string; label: string; count: number }[] = [];
  if (counts.high > 0) parts.push({ key: 'high', label: 'H', count: counts.high });
  if (counts.medium > 0) parts.push({ key: 'medium', label: 'M', count: counts.medium });
  if (counts.low > 0) parts.push({ key: 'low', label: 'L', count: counts.low });
  if (parts.length === 0) return null;
  return (
    <span className="priority-summary" aria-label={parts.map(p => `${p.count} ${p.key === 'high' ? 'high' : p.key === 'medium' ? 'medium' : 'low'} priority`).join(', ')}>
      {parts.map((p, i) => (
        <span key={p.key}>
          {i > 0 && <span className="priority-summary-sep" aria-hidden="true"> · </span>}
          <span className={`priority-summary-count priority-summary-${p.key}`}>{p.count}{p.label}</span>
        </span>
      ))}
    </span>
  );
}

// Strip legacy "(high priority)" etc. suffix from action text
function stripPrioritySuffix(text: string): string {
  return text.replace(/\s*\((high|medium|low) priority\)\s*$/i, '');
}

// Priority tier labels for sub-group headings
const PRIORITY_TIER_LABEL: Record<string, string> = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

// --- Categorised list grouped by module, with jump-to-details ---
function CategorisedList({
  items,
  detailedIssueIds,
  onJumpToIssue,
  listClass,
}: {
  items: CategorisedItem[];
  detailedIssueIds: Set<string>;
  onJumpToIssue: (questionId: string) => void;
  listClass: string;
}) {
  const groups = groupByModule(items);

  const showPriority = listClass === 'report-list-actions';

  return (
    <div className="categorised-list">
      {groups.map(group => {
        // Sub-group items by priority tier
        const tiers = showPriority
          ? (['high', 'medium', 'low'] as const).map(p => ({
              priority: p,
              items: group.items.filter(i => (i.priority || 'low') === p),
            })).filter(t => t.items.length > 0)
          : [{ priority: null as string | null, items: group.items }];

        return (
          <div key={group.moduleCode} className="categorised-module-group">
            <div className="categorised-module-heading">
              <span className="categorised-module-code">{group.moduleCode}</span>
              <span className="categorised-module-name">{group.moduleName}</span>
              {showPriority && <PrioritySummary items={group.items} />}
            </div>
            {tiers.map(tier => (
              <div key={tier.priority || 'all'} className={tier.priority ? `action-tier action-tier-${tier.priority}` : undefined}>
                {tier.priority && (
                  <div className={`action-tier-heading action-tier-heading-${tier.priority}`}>
                    <span
                      className={`action-priority-badge action-priority-badge-${tier.priority}`}
                      aria-hidden="true"
                    >
                      {PRIORITY_BADGE_LABEL[tier.priority]}
                    </span>
                    <span>{PRIORITY_TIER_LABEL[tier.priority]}</span>
                    <span className="action-tier-count">({tier.items.length})</span>
                  </div>
                )}
                <ul className={`report-list ${listClass}`}>
                  {tier.items.map((item, index) => (
                    <li key={index} className={showPriority && item.priority ? `action-priority-${item.priority}` : undefined}>
                      <span>{showPriority ? stripPrioritySuffix(item.text) : item.text}</span>
                      {item.questionId && detailedIssueIds.has(item.questionId) && (
                        <a
                          href={`#issue-${item.questionId}`}
                          className="jump-to-details-btn"
                          aria-label={`View detailed finding for: ${stripPrioritySuffix(item.text)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            onJumpToIssue(item.questionId!);
                          }}
                        >
                          <ExternalLink size={14} aria-hidden="true" />
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// --- Collapsible notes ---
function CollapsibleNotes({
  notes,
}: {
  notes: Report['questionNotes'];
}) {
  const INITIAL_SHOW = 3;
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? notes : notes.slice(0, INITIAL_SHOW);
  const remaining = notes.length - INITIAL_SHOW;

  return (
    <div className="notes-list">
      {visible.map((note, index) => (
        <div key={index} className="note-card">
          <div className="note-header">
            <span className="note-module">{note.moduleName}</span>
            {note.answer && (
              <span className={`note-answer answer-${note.answer}`}>
                {RESPONSE_LABELS[note.answer as keyof typeof RESPONSE_LABELS] || note.answer}
              </span>
            )}
          </div>
          <div className="note-question">{note.questionText}</div>
          <div className="note-content">{note.notes}</div>
        </div>
      ))}
      {remaining > 0 && (
        <button
          className="notes-toggle-btn"
          onClick={() => setShowAll(v => !v)}
          aria-expanded={showAll}
          title={showAll ? 'Show fewer notes' : 'Show all notes'}
        >
          {showAll ? 'Show fewer notes' : `Show all ${notes.length} notes (+${remaining} more)`}
        </button>
      )}
    </div>
  );
}

// --- Navigation section definitions ---
interface NavSection {
  id: string;
  label: string;
}

interface ReportViewerProps {
  report: Report;
  onClose: () => void;
  onDownload?: () => void;
}

export function ReportViewer({ report, onClose, onDownload }: ReportViewerProps) {
  const handleDownload = () => {
    downloadPDFReport(report);
    onDownload?.();
  };
  const isPulseCheck = report.reportType === 'pulse-check';
  const contentRef = useRef<HTMLDivElement>(null);

  // Build set of questionIds in detailed findings for jump links
  const detailedIssueIds = new Set<string>(
    (report.detailedFindings || []).flatMap(f => f.issues.map(i => i.questionId))
  );

  // Jump-to-details state
  const [jumpedToIssue, setJumpedToIssue] = useState<string | null>(null);
  const savedScrollPos = useRef<number>(0);

  const handleJumpToIssue = useCallback((questionId: string) => {
    savedScrollPos.current = contentRef.current?.scrollTop || 0;
    setJumpedToIssue(questionId);
    setTimeout(() => {
      const el = document.getElementById(`issue-${questionId}`);
      if (el && contentRef.current) {
        const containerRect = contentRef.current.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        contentRef.current.scrollTop += elRect.top - containerRect.top;
      }
    }, 50);
  }, []);

  const handleBackToPriority = useCallback(() => {
    setJumpedToIssue(null);
    contentRef.current?.scrollTo({ top: savedScrollPos.current, behavior: 'instant' });
  }, []);

  // Scroll-to-top
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 400);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Build nav sections based on what content exists
  const navSections: NavSection[] = [];
  navSections.push({ id: 'section-overview', label: 'Overview' });
  if (report.progressComparison?.enabled) {
    navSections.push({ id: 'section-progress', label: 'Progress' });
  }
  if (report.moduleEvidence?.length > 0) {
    navSections.push({ id: 'section-evidence', label: 'Evidence' });
  }
  if ((report.urlAnalysisResults?.length > 0) || (report.mediaAnalysisResults?.length > 0)) {
    navSections.push({ id: 'section-analysis', label: 'Analysis' });
  }
  if (report.questionNotes?.length > 0 || report.questionEvidence?.length > 0) {
    navSections.push({ id: 'section-notes', label: 'Notes' });
  }
  navSections.push({ id: 'section-findings', label: 'Key Findings' });
  if (report.detailedFindings?.length) {
    navSections.push({ id: 'section-detailed', label: 'Details' });
  }
  navSections.push({ id: 'section-next-steps', label: 'Next Steps' });

  // Track active nav section via IntersectionObserver
  const [activeNav, setActiveNav] = useState(navSections[0]?.id || '');
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;
    const sectionEls = navSections
      .map(s => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveNav(entry.target.id);
          }
        }
      },
      { root: container, rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );
    sectionEls.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [navSections.length]);

  const handleNavClick = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el && contentRef.current) {
      const containerRect = contentRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      contentRef.current.scrollTo({
        top: contentRef.current.scrollTop + elRect.top - containerRect.top - 8,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className="report-viewer-overlay">
      <div className="report-viewer-container">
        {/* Header with actions */}
        <div className="report-viewer-header">
          <h2>
            {isPulseCheck ? 'Pulse Check Summary' : 'Deep Dive Report'}
          </h2>
          <div className="report-actions">
            <button className="btn-download-report" onClick={handleDownload}>
              Download PDF
            </button>
            <button className="btn-close-report" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Jump navigation bar */}
        <nav className="report-jump-nav" aria-label="Report sections">
          {navSections.map(section => (
            <button
              key={section.id}
              className={`report-jump-nav-btn${activeNav === section.id ? ' report-jump-nav-btn-active' : ''}`}
              onClick={() => handleNavClick(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>

        {/* Report content */}
        <div className="report-content" ref={contentRef}>
          {/* Cover page */}
          <section className="report-cover">
            <h1 className="report-title">
              Accessibility Self-Review Report
            </h1>
            <div className="report-subtitle">
              {isPulseCheck ? 'Pulse Check Summary' : 'Deep Dive Assessment'}
            </div>
            <div className="report-org-name">{report.organisation}</div>
            <div className="report-date">
              Generated: {new Date(report.generatedAt).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
          </section>

          {/* === OVERVIEW GROUP === */}
          <ReportGroup id="section-overview" title="Overview" defaultOpen={true}>
            {/* Executive Summary */}
            <section className="report-section report-executive-summary">
              <h2>Executive Summary</h2>

              {/* Accessibility maturity — the headline "where are we" */}
              {report.maturity.started && (
                <div className="report-maturity">
                  <div className="report-maturity-head">
                    <span className="report-maturity-tag">Accessibility maturity</span>
                    <b className={`report-maturity-level mat-${report.maturity.levelIdx}`}>{report.maturity.level}</b>
                    {report.maturity.nextStage && (
                      <span className="report-maturity-next">Next: reach {report.maturity.nextStage}</span>
                    )}
                  </div>
                  <div
                    className="report-maturity-meter"
                    role="img"
                    aria-label={`Maturity level ${report.maturity.level}, ${report.maturity.levelIdx + 1} of 4`}
                  >
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`mat-seg${i <= report.maturity.levelIdx ? ` mat-seg-on mat-${i}` : ''}`} />
                    ))}
                  </div>
                  <div className="report-maturity-labels" aria-hidden="true">
                    {['Emerging', 'Developing', 'Established', 'Embedded'].map((lv, i) => (
                      <span key={lv} className={i === report.maturity.levelIdx ? 'cur' : ''}>{lv}</span>
                    ))}
                  </div>
                  <div className="report-maturity-coverage">
                    <span className={`report-maturity-conf conf-${report.maturity.confidence.toLowerCase()}`}>
                      {report.maturity.confidence} confidence
                    </span>
                    <span>
                      Based on {report.executiveSummary.modulesCompleted} of {report.executiveSummary.totalModules} areas
                      assessed ({report.maturity.coveragePct}%) · {report.maturity.performancePct}% doing well
                    </span>
                  </div>
                  <p className="report-maturity-meaning">{report.maturity.meaning}</p>
                </div>
              )}

              {/* Executive interpretation - what the data means */}
              {report.analysis.interpretation.length > 0 && (
                <div className="report-interpretation">
                  <h3>Executive interpretation</h3>
                  {report.analysis.interpretation.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              )}

              {report.coveredSites && report.coveredSites.length > 0 && (
                <p className="report-scope">
                  <span className="report-scope-label">This organisation-wide report aggregates self-review assessments across {report.coveredSites.length} {report.coveredSites.length === 1 ? 'venue' : 'venues'}:</span>{' '}
                  <span className="report-scope-list">{report.coveredSites.join(', ')}</span>
                </p>
              )}

              {report.analysis.headline && (
                <p className="report-headline"><strong>Overall finding:</strong> {report.analysis.headline}</p>
              )}

              {/* Summary tiles: two even rows of three */}
              <div className="summary-stats summary-three">
                <div className="stat-card">
                  <div className="stat-number">{report.executiveSummary.modulesCompleted}</div>
                  <div className="stat-label">Areas reviewed</div>
                </div>
                <div className="stat-card stat-positive">
                  <div className="stat-number">{report.executiveSummary.strengthsCount}</div>
                  <div className="stat-label">Strengths Identified</div>
                </div>
                <div className="stat-card stat-action">
                  <div className="stat-number">{report.executiveSummary.actionsCount}</div>
                  <div className="stat-label">Priority Actions</div>
                </div>
              </div>
              <div className="summary-stats summary-three">
                <div className="stat-card stat-op">
                  <div className="stat-number">{report.analysis.effort.operational}</div>
                  <div className="stat-label">Operational</div>
                </div>
                <div className="stat-card stat-cap">
                  <div className="stat-number">{report.analysis.effort.capital}</div>
                  <div className="stat-label">Capital works likely</div>
                </div>
                <div className="stat-card stat-explore">
                  <div className="stat-number">{report.executiveSummary.areasToExploreCount}</div>
                  <div className="stat-label">To Investigate</div>
                </div>
              </div>
              <p className="effort-caption">The priority actions split by the nature of the change. Operational items can begin now without major works (communications, customer service, policy, staff training and signage). Capital works are built-environment items likely to need planning and budget.</p>

              {/* Legislative alignment - right after the executive summary */}
              {report.frameworkAlignment && (
                <div className="report-legal">
                  <h3>Legislative alignment</h3>
                  <div className="report-legal-head">
                    <span className={`report-legal-badge report-legal-badge-${report.frameworkAlignment.mandate}`}>
                      {report.frameworkAlignment.mandate === 'statutory' ? 'Statutory reporting framework'
                        : report.frameworkAlignment.mandate === 'voluntary' ? 'Voluntary alignment aid'
                        : report.frameworkAlignment.mandate === 'national' ? 'National framework' : 'Reference framework'}
                    </span>
                    <span className="report-legal-fw">{report.frameworkAlignment.frameworkName}</span>
                  </div>
                  <p className="report-analysis-sub">
                    How your self-review aligns to this framework's outcome domains and where coverage gaps remain. An
                    alignment aid, not a compliance audit or certification.
                  </p>
                  {report.frameworkAlignment.mandate === 'national' && (
                    <p className="report-legal-nudge">
                      You're viewing alignment to the national framework. Set your reporting jurisdiction in Organisation
                      settings to align to your state or territory's statutory disability plan.
                    </p>
                  )}
                  <div className="report-legal-domains">
                    {report.frameworkAlignment.domains.map(d => (
                      <div key={d.domainId} className="report-legal-domain">
                        <div className="report-legal-domain-head">
                          <span className="report-legal-domain-name">{d.name}</span>
                          {d.total === 0
                            ? <span className="report-legal-gap-chip">Not yet assessed</span>
                            : <span className="report-legal-count">{d.moduleIds.length} area{d.moduleIds.length !== 1 ? 's' : ''} assessed</span>}
                        </div>
                        {d.total > 0 && (
                          <div className="report-legal-bar" role="img" aria-label={`${d.strongPct}% doing well, ${d.mixedPct}% mixed, ${d.needsWorkPct}% needs work`}>
                            {d.strong > 0 && <span className="report-legal-seg report-legal-strong" style={{ flex: d.strong }} />}
                            {d.mixed > 0 && <span className="report-legal-seg report-legal-mixed" style={{ flex: d.mixed }} />}
                            {d.needsWork > 0 && <span className="report-legal-seg report-legal-needs" style={{ flex: d.needsWork }} />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="report-legal-cite">{report.frameworkAlignment.citation}</p>
                </div>
              )}

              {/* Performance by area */}
              {report.themeBreakdown.length > 0 && (
                <div className="theme-breakdown">
                  <h3>Performance by area</h3>
                  <div className="theme-rows">
                    {report.themeBreakdown.map(t => {
                      const noFindings = t.strengths + t.actions === 0;
                      return (
                        <div key={t.group} className="theme-row">
                          <span className="theme-label">{t.label}</span>
                          <span className="theme-bar">
                            {!noFindings && <span className={`theme-bar-fill perf-${t.performancePct >= 67 ? 'good' : t.performancePct >= 34 ? 'mid' : 'low'}`} style={{ width: `${t.performancePct}%` }} />}
                          </span>
                          <span className="theme-pct">{noFindings ? 'No findings' : `${t.performancePct}%`}</span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="theme-note">Share of checks already going well in each area assessed. Lower bars are where to focus.</p>
                </div>
              )}

              {/* Recurring themes */}
              {report.analysis.recurringThemes.length > 0 && (
                <div className="report-analysis-block">
                  <h3>Key themes</h3>
                  <p className="report-analysis-sub">The themes running through your recommendations, most frequent first.</p>
                  <div className="report-freq-rows">
                    {report.analysis.recurringThemes.map(t => (
                      <div key={t.label} className="report-freq-row">
                        <span className="report-freq-label">{t.label}</span>
                        <span className="report-freq-bar">
                          <span className="report-freq-fill" style={{ width: `${Math.round((t.count / report.analysis.recurringThemes[0].count) * 100)}%` }} />
                        </span>
                        <span className="report-freq-count">{t.count}</span>
                      </div>
                    ))}
                  </div>
                  {report.analysis.recurringInsight && (
                    <p className="report-analysis-insight">{report.analysis.recurringInsight}</p>
                  )}
                </div>
              )}

              {/* Where the priorities sit */}
              {report.analysis.thematicSummaries.length > 0 && (
                <div className="report-analysis-block">
                  <h3>Where the priorities sit</h3>
                  <p className="report-analysis-sub">The domains carrying the most high-priority actions. Address these first.</p>
                  <div className="report-thematic-rows">
                    {report.analysis.thematicSummaries.map((s) => (
                      <div key={s.label} className="report-thematic-row">
                        <div className="report-thematic-head">
                          <span className="report-thematic-name">{s.label}</span>
                          <span className="report-thematic-pct">{s.pct}%</span>
                        </div>
                        <div className="report-thematic-bar"><span className="report-thematic-fill" style={{ width: `${s.pct}%` }} /></div>
                        <p className="report-thematic-sub">
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
                <div className="report-analysis-block">
                  <h3>Where you're strongest</h3>
                  <p className="report-analysis-sub">Areas with the most strengths identified, highest first.</p>
                  <div className="report-freq-rows">
                    {report.analysis.strengthsByTheme.map(t => (
                      <div key={t.label} className="report-freq-row">
                        <span className="report-freq-label">{t.label}</span>
                        <span className="report-freq-bar">
                          <span className="report-freq-fill report-freq-fill-good" style={{ width: `${Math.round((t.count / report.analysis.strengthsByTheme[0].count) * 100)}%` }} />
                        </span>
                        <span className="report-freq-count">{t.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested starting sequence */}
              {report.analysis.startingSequence.length > 0 && (
                <div className="report-analysis-block">
                  <h3>Suggested implementation roadmap</h3>
                  <p className="report-analysis-sub">Indicative time bands, with the achievable operational items first. A starting point for your own planning, not a fixed schedule.</p>
                  <div className="report-sequence">
                    {report.analysis.startingSequence.map((step, i) => (
                      <div key={i} className="report-sequence-step">
                        <div className="report-sequence-head">{step.heading}</div>
                        <ul>{step.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why this matters */}
              {report.analysis.whyItMatters && (
                <div className="report-analysis-block">
                  <h3>Why this matters</h3>
                  <p className="report-why">{report.analysis.whyItMatters}</p>
                </div>
              )}

              {report.reportContext && report.reportContext.filterType !== 'all' && (
                <div className="report-context-info">
                  <span className="context-label">Report filtered by:</span>
                  <span className="context-value">
                    {report.reportContext.filterType === 'context'
                      ? report.reportContext.contextName
                      : 'Custom selection'}
                  </span>
                  <span className="context-modules">
                    ({report.reportContext.modulesIncluded} module{report.reportContext.modulesIncluded !== 1 ? 's' : ''} included)
                  </span>
                </div>
              )}
            </section>
          </ReportGroup>

          {/* === PROGRESS COMPARISON GROUP === */}
          {report.progressComparison && report.progressComparison.enabled && (
            <ReportGroup id="section-progress" title="Progress Comparison" defaultOpen={true}>
              <section className="report-section report-progress-comparison">
                <p className="section-intro">
                  Changes compared to previous assessments:
                </p>

                <div className={`comparison-overall-summary trend-${report.progressComparison.overallSummary.overallTrend}`}>
                  <div className="trend-icon">
                    {report.progressComparison.overallSummary.overallTrend === 'improving' && '↑'}
                    {report.progressComparison.overallSummary.overallTrend === 'declining' && '↓'}
                    {report.progressComparison.overallSummary.overallTrend === 'stable' && '→'}
                    {report.progressComparison.overallSummary.overallTrend === 'mixed' && '↔'}
                  </div>
                  <div className="trend-details">
                    <div className="trend-label">
                      {report.progressComparison.overallSummary.overallTrend === 'improving' && 'Overall Improving'}
                      {report.progressComparison.overallSummary.overallTrend === 'declining' && 'Attention Needed'}
                      {report.progressComparison.overallSummary.overallTrend === 'stable' && 'Stable'}
                      {report.progressComparison.overallSummary.overallTrend === 'mixed' && 'Mixed Results'}
                    </div>
                    <div className="trend-stats">
                      <span className="stat-improving">{report.progressComparison.overallSummary.totalImprovements} improvements</span>
                      <span className="stat-declining">{report.progressComparison.overallSummary.totalRegressions} areas needing attention</span>
                    </div>
                  </div>
                </div>

                <div className="comparison-modules-list">
                  {report.progressComparison.comparisons.map((comparison, index) => (
                    <div key={index} className={`comparison-module-card trend-${comparison.trend}`}>
                      <div className="comparison-module-header">
                        <h4>{comparison.moduleName}</h4>
                        <span className={`trend-badge trend-${comparison.trend}`}>
                          {comparison.trend === 'improving' && '↑ Improving'}
                          {comparison.trend === 'declining' && '↓ Attention'}
                          {comparison.trend === 'stable' && '→ Stable'}
                          {comparison.trend === 'mixed' && '↔ Mixed'}
                        </span>
                      </div>
                      <div className="comparison-module-runs">
                        <div className="run-info previous">
                          <span className="run-label">Previous:</span>
                          <span className="run-name">{comparison.previousRun.contextName}</span>
                          {comparison.previousRun.completedAt && (
                            <span className="run-date">
                              ({new Date(comparison.previousRun.completedAt).toLocaleDateString('en-AU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })})
                            </span>
                          )}
                        </div>
                        <div className="run-arrow">→</div>
                        <div className="run-info current">
                          <span className="run-label">Current:</span>
                          <span className="run-name">{comparison.currentRun.contextName}</span>
                          {comparison.currentRun.completedAt && (
                            <span className="run-date">
                              ({new Date(comparison.currentRun.completedAt).toLocaleDateString('en-AU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="comparison-module-stats">
                        <span className="stat stat-improvements">{comparison.improvements} improved</span>
                        <span className="stat stat-unchanged">{comparison.unchanged} unchanged</span>
                        <span className="stat stat-regressions">{comparison.regressions} need attention</span>
                        {comparison.scoreChange !== 0 && (
                          <span className={`stat stat-score ${comparison.scoreChange > 0 ? 'positive' : 'negative'}`}>
                            {comparison.scoreChange > 0 ? '+' : ''}{comparison.scoreChange}% change
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </ReportGroup>
          )}

          {/* === ASSESSMENT EVIDENCE GROUP === */}
          {report.moduleEvidence && report.moduleEvidence.length > 0 && (
            <ReportGroup id="section-evidence" title="Assessment Evidence" defaultOpen={true}>
              <section className="report-section report-module-evidence">
                <h2>Modules Reviewed</h2>
                <p className="section-intro">
                  Evidence of completed self-review modules and who completed them:
                </p>
                <div className="module-evidence-list">
                  {report.moduleEvidence.map((evidence, index) => (
                    <div key={index} className="module-evidence-card">
                      <div className="module-evidence-header">
                        <div className="module-evidence-name">
                          <span className="module-code">{evidence.moduleCode}</span>
                          <span className="module-name">{evidence.moduleName}</span>
                        </div>
                        {evidence.confidenceSnapshot && (
                          <span className={`confidence-badge confidence-${evidence.confidenceSnapshot}`}>
                            {evidence.confidenceSnapshot === 'strong' ? 'Strong' :
                             evidence.confidenceSnapshot === 'mixed' ? 'Mixed' : 'Needs Work'}
                          </span>
                        )}
                      </div>
                      <div className="module-evidence-meta">
                        {evidence.completedAt && (
                          <div className="evidence-item">
                            <span className="evidence-label">Completed:</span>
                            <span className="evidence-value">
                              {new Date(evidence.completedAt).toLocaleDateString('en-AU', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                        {evidence.completedBy && (
                          <div className="evidence-item">
                            <span className="evidence-label">By:</span>
                            <span className="evidence-value">
                              {evidence.completedBy}
                              {evidence.completedByRole && ` (${evidence.completedByRole})`}
                            </span>
                          </div>
                        )}
                        {evidence.assignedTo && (
                          <div className="evidence-item">
                            <span className="evidence-label">Assigned to:</span>
                            <span className="evidence-value">{evidence.assignedTo}</span>
                          </div>
                        )}
                      </div>
                      <div className="module-evidence-stats">
                        <span className="stat-positive">{evidence.strengthsCount} strengths</span>
                        <span className="stat-action">{evidence.actionsCount} actions</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </ReportGroup>
          )}

          {/* === ANALYSIS RESULTS GROUP === */}
          {((report.urlAnalysisResults?.length > 0) || (report.mediaAnalysisResults?.length > 0)) && (
            <ReportGroup id="section-analysis" title="Analysis Results" defaultOpen={false}>
              {/* URL Analysis */}
              {report.urlAnalysisResults && report.urlAnalysisResults.length > 0 && (
                <section className="report-section report-url-analysis">
                  <h2>Website Accessibility Analysis</h2>
                  <p className="section-intro">
                    Analysis of your online accessibility information:
                  </p>
                  {report.urlAnalysisResults.map((analysis, index) => (
                    <div key={index} className="url-analysis-card">
                      <div className="url-analysis-header">
                        <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="url-link">
                          {analysis.url}
                        </a>
                        <div className="url-analysis-score">
                          <span className={`score-badge score-${analysis.overallStatus}`}>
                            {analysis.overallScore}/100
                          </span>
                          <span className="score-status">
                            {analysis.overallStatus === 'excellent' ? 'Excellent' :
                             analysis.overallStatus === 'good' ? 'Good' :
                             analysis.overallStatus === 'needs-improvement' ? 'Needs Improvement' : 'Missing'}
                          </span>
                        </div>
                      </div>
                      <p className="url-analysis-summary">{analysis.summary}</p>
                      {analysis.strengths.length > 0 && (
                        <div className="url-analysis-strengths">
                          <h4>Strengths</h4>
                          <ul>
                            {analysis.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {analysis.improvements.length > 0 && (
                        <div className="url-analysis-improvements">
                          <h4>Areas for Improvement</h4>
                          <ul>
                            {analysis.improvements.map((improvement, idx) => (
                              <li key={idx}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}

              {/* Media Analysis */}
              {report.mediaAnalysisResults && report.mediaAnalysisResults.length > 0 && (
                <section className="report-section report-media-analysis">
                  <h2>Media Analysis Results</h2>
                  <p className="section-intro">
                    Accessibility analysis of uploaded materials and media:
                  </p>
                  {report.mediaAnalysisResults.map((analysis, index) => (
                    <div key={index} className="media-analysis-card">
                      <div className="media-analysis-header">
                        <div className="media-analysis-type">
                          <span className="analysis-type-badge">
                            {formatAnalysisType(analysis.analysisType)}
                          </span>
                          {analysis.fileName && (
                            <span className="analysis-filename">{analysis.fileName}</span>
                          )}
                          {analysis.url && !analysis.fileName && (
                            <a href={analysis.url} target="_blank" rel="noopener noreferrer" className="analysis-url">
                              {analysis.url}
                            </a>
                          )}
                        </div>
                        <div className="media-analysis-score">
                          <span className={`score-badge score-${analysis.overallStatus}`}>
                            {analysis.overallScore}/100
                          </span>
                          <span className="score-status">
                            {formatStatus(analysis.overallStatus)}
                          </span>
                        </div>
                      </div>

                      {analysis.thumbnailDataUrl && (
                        <div className="media-analysis-thumbnail">
                          <img src={analysis.thumbnailDataUrl} alt="Analysed media thumbnail" />
                        </div>
                      )}

                      <p className="media-analysis-summary">{analysis.summary}</p>

                      {analysis.standardsAssessed.length > 0 && (
                        <div className="media-analysis-standards">
                          <span className="standards-label">Standards:</span>
                          {analysis.standardsAssessed.map((standard, idx) => (
                            <span key={idx} className="standard-badge">{standard}</span>
                          ))}
                        </div>
                      )}

                      {analysis.strengths.length > 0 && (
                        <div className="media-analysis-strengths">
                          <h4>Strengths</h4>
                          <ul>
                            {analysis.strengths.map((strength, idx) => (
                              <li key={idx}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.quickWins.length > 0 && (
                        <div className="media-analysis-quickwins">
                          <h4>Quick Wins</h4>
                          <ul>
                            {analysis.quickWins.map((win, idx) => (
                              <li key={idx}>{win}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.improvements.length > 0 && (
                        <div className="media-analysis-improvements">
                          <h4>Areas for Improvement</h4>
                          <ul>
                            {analysis.improvements.map((improvement, idx) => (
                              <li key={idx}>{improvement}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {analysis.needsProfessionalReview && (
                        <div className="media-analysis-professional">
                          <strong>Professional Review Recommended:</strong>
                          <p>{analysis.professionalReviewReason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </section>
              )}
            </ReportGroup>
          )}

          {/* === NOTES & EVIDENCE GROUP === */}
          {(report.questionNotes?.length > 0 || report.questionEvidence?.length > 0) && (
            <ReportGroup id="section-notes" title="Notes &amp; Evidence" defaultOpen={false}>
              {/* User Notes */}
              {report.questionNotes && report.questionNotes.length > 0 && (
                <section className="report-section report-notes">
                  <h2>Your Notes &amp; Observations</h2>
                  <p className="section-intro">
                    Notes recorded during your self-review:
                  </p>
                  <CollapsibleNotes notes={report.questionNotes} />
                </section>
              )}

              {/* Evidence Photos & Documents */}
              {report.questionEvidence && report.questionEvidence.length > 0 && (
                <section className="report-section report-evidence">
                  <h2>Supporting Evidence</h2>
                  <p className="section-intro">
                    Photos and documents uploaded during your self-review:
                  </p>
                  <div className="evidence-grid">
                    {report.questionEvidence.map((evidence, index) => (
                      <div key={index} className="evidence-card">
                        <div className="evidence-header">
                          <span className="evidence-type-badge">
                            {evidence.evidenceType === 'photo' ? '📷' :
                             evidence.evidenceType === 'document' ? '📄' : '🔗'}
                            {evidence.evidenceType}
                          </span>
                          <span className="evidence-module">{evidence.moduleName}</span>
                        </div>
                        {evidence.evidenceType === 'photo' && evidence.dataUrl && (
                          <div className="evidence-image">
                            <img src={evidence.dataUrl} alt={evidence.fileName} />
                          </div>
                        )}
                        <div className="evidence-filename">{evidence.fileName}</div>
                        <div className="evidence-question">{evidence.questionText}</div>
                        {evidence.description && (
                          <div className="evidence-description">{evidence.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </ReportGroup>
          )}

          {/* === KEY FINDINGS GROUP === */}
          <ReportGroup id="section-findings" title="Key Findings" defaultOpen={true}>
            {/* Priority Actions */}
            {report.sections.priorityActions.content.length > 0 && (
              <section className="report-section" id="priority-actions-section">
                <h2>{report.sections.priorityActions.title}</h2>
                {report.sections.priorityActions.categorised?.length ? (
                  <CategorisedList
                    items={report.sections.priorityActions.categorised}
                    detailedIssueIds={detailedIssueIds}
                    onJumpToIssue={handleJumpToIssue}
                    listClass="report-list-actions"
                  />
                ) : (
                  <ul className="report-list report-list-actions">
                    {(report.sections.priorityActions.content as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Quick Wins */}
            {report.quickWins.length > 0 && (
              <section className="report-section">
                <h2>Quick Wins</h2>
                <p className="section-intro">
                  These actions offer significant accessibility improvements with minimal effort:
                </p>
                <div className="quick-wins-grid">
                  {report.quickWins.map((win, index) => (
                    <div key={index} className="quick-win-card">
                      <div className="quick-win-header">
                        <h3>{win.title}</h3>
                        <div className="quick-win-badges">
                          <span className={`badge-effort ${win.effort}`}>
                            {win.effort} effort
                          </span>
                          <span className={`badge-impact ${win.impact}`}>
                            {win.impact} impact
                          </span>
                        </div>
                      </div>
                      <p>{win.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Areas to Explore */}
            {report.sections.areasToExplore.content.length > 0 && (
              <section className="report-section">
                <h2>{report.sections.areasToExplore.title}</h2>
                <p className="section-explainer">These items were marked as "Unable to check" during your assessment. We recommend investigating these areas to confirm your current accessibility status.</p>
                {report.sections.areasToExplore.categorised?.length ? (
                  <CategorisedList
                    items={report.sections.areasToExplore.categorised}
                    detailedIssueIds={detailedIssueIds}
                    onJumpToIssue={handleJumpToIssue}
                    listClass="report-list-explore"
                  />
                ) : (
                  <ul className="report-list report-list-explore">
                    {(report.sections.areasToExplore.content as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* What's Going Well - at end so actions come first */}
            {report.sections.strengths.content.length > 0 && (
              <section className="report-section">
                <h2>{report.sections.strengths.title}</h2>
                {report.sections.strengths.categorised?.length ? (
                  <CategorisedList
                    items={report.sections.strengths.categorised}
                    detailedIssueIds={detailedIssueIds}
                    onJumpToIssue={handleJumpToIssue}
                    listClass="report-list-positive"
                  />
                ) : (
                  <ul className="report-list report-list-positive">
                    {(report.sections.strengths.content as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}

            {/* Professional Review */}
            {report.sections.professionalReview.content.length > 0 && (
              <section className="report-section">
                <h2>{report.sections.professionalReview.title}</h2>
                {report.sections.professionalReview.categorised?.length ? (
                  <CategorisedList
                    items={report.sections.professionalReview.categorised}
                    detailedIssueIds={detailedIssueIds}
                    onJumpToIssue={handleJumpToIssue}
                    listClass="report-list-professional"
                  />
                ) : (
                  <ul className="report-list report-list-professional">
                    {(report.sections.professionalReview.content as string[]).map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </ReportGroup>

          {/* === DETAILED FINDINGS GROUP === */}
          {report.detailedFindings && report.detailedFindings.length > 0 && (
            <ReportGroup id="section-detailed" title="Detailed Findings" defaultOpen={true}>
              <section className="report-section report-detailed-findings">
                <dl className="priority-legend" aria-label="Priority level definitions">
                  {PRIORITY_LEGEND.map(({ level, label, description }) => (
                    <div key={level} className={`priority-legend-item priority-legend-${level}`}>
                      <dt>{label}</dt>
                      <dd>{description}</dd>
                    </div>
                  ))}
                </dl>
                {report.detailedFindings.map((finding, index) => (
                  <div key={index} className="finding-module">
                    <h3>{finding.moduleName}</h3>
                    {finding.issues.map((issue, issueIndex) => (
                      <div
                        key={issueIndex}
                        className={`finding-issue${jumpedToIssue === issue.questionId ? ' finding-issue-highlighted' : ''}`}
                        id={`issue-${issue.questionId}`}
                      >
                        {jumpedToIssue === issue.questionId && (
                          <button
                            className="back-to-findings-btn"
                            onClick={handleBackToPriority}
                          >
                            &larr; Back to Priority Actions
                          </button>
                        )}
                        <div className="issue-header">
                          <h4>{issue.questionText}</h4>
                          <div className="issue-badges">
                            <span className={`priority-badge priority-${issue.priority}`}>
                              {issue.priority} priority
                            </span>
                            {issue.complianceLevel && (
                              <span className={`compliance-badge compliance-${issue.complianceLevel}`}>
                                {issue.complianceLevel === 'mandatory' ? 'Mandatory' : 'Best Practice'}
                                {issue.complianceRef && ` (${issue.complianceRef})`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="issue-reasoning">
                          <strong>Reasoning:</strong> {issue.reasoning}
                        </div>
                        <div className="issue-actions">
                          <strong>Recommended Actions:</strong>
                          <ul>
                            {issue.recommendedActions.map((action, actionIndex) => (
                              <li key={actionIndex}>{action}</li>
                            ))}
                          </ul>
                        </div>
                        {hasHelpContent(issue.questionId) && (() => {
                          const help = getHelpByQuestionId(issue.questionId);
                          return (
                            <div className="issue-resource-link">
                              <Link
                                to={getResourceLink(issue.questionId)}
                                state={{ from: 'report' }}
                                className="resource-guide-link"
                              >
                                View guide: {help?.title || 'Resource guide'}
                              </Link>
                            </div>
                          );
                        })()}
                      </div>
                    ))}
                  </div>
                ))}
              </section>
            </ReportGroup>
          )}

          {/* === NEXT STEPS GROUP === */}
          <ReportGroup id="section-next-steps" title="Next Steps" defaultOpen={true}>
            <section className="report-section report-next-steps">
              <p className="next-steps-platform-note">
                The priority actions in this report can be added to your action plan in Access Compass, where each one can be
                assigned to a responsible team, given a due date, tracked, evidenced and reported on over time. This assessment
                is the starting point. The platform helps you manage delivery.
              </p>
              <div className="next-steps-container">
                <div className="next-steps-column">
                  <h3>Things you can explore now</h3>
                  <ul className="next-steps-list">
                    {report.nextSteps.exploreNow.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>

                <div className="next-steps-column">
                  <h3>Things to plan for later</h3>
                  <ul className="next-steps-list">
                    {report.nextSteps.planForLater.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="report-section report-professional-support">
              <h2>When Professional Support May Help</h2>
              <p className="section-intro">
                Based on your self-review, you may benefit from professional advice if:
              </p>

              <ul className="professional-support-list">
                {report.professionalSupport.indicators
                  .filter(indicator => indicator.detected)
                  .map((indicator, index) => (
                    <li key={index}>
                      <strong>{indicator.category}:</strong> {indicator.reason}
                    </li>
                  ))}
              </ul>

              {report.professionalSupport.recommended && (
                <div className="support-recommendation">
                  <p>
                    <strong>Based on your responses, we recommend considering professional support.</strong>
                  </p>
                </div>
              )}

              <div className="support-disclaimer">
                <p>
                  This self-review is designed to support learning and planning. Seeking professional
                  advice doesn't mean you've failed. It's a normal next step for many organisations.
                </p>
                <p className="support-link">
                  <a href="mailto:hello@flareaccess.com.au"><strong>Learn about professional support</strong></a>
                </p>
              </div>
            </section>

            <section className="report-section report-compliance-note">
              <h2>A Note on Compliance</h2>
              <p>
                This report covers key compliance considerations, though not every element will apply
                to your venue. Even a "Yes" response may still have opportunities for improvement
                towards full compliance or best practice. For detailed auditing specific to your venue,
                contact Flare Access to learn more.
              </p>
            </section>

            <section className="report-section report-disclaimer">
              <h2>Important Disclaimer</h2>
              <p>
                This guidance is for information only. It is not legal advice, a compliance
                certificate or a substitute for professional accessibility auditing. Actions are
                suggestions based on your responses.
              </p>
              <p>
                This review is indicative only and based on self-reported information. It does not
                verify accuracy or confirm compliance with accessibility standards or legal
                requirements.
              </p>
            </section>
          </ReportGroup>

          {/* Footer */}
          <footer className="report-footer">
            <div className="report-branding">
              <strong>Access Compass</strong> by Flare Access
            </div>
            <div className="report-generated">
              Generated {new Date(report.generatedAt).toLocaleDateString('en-AU')}
            </div>
          </footer>
        </div>

        {/* Scroll to top button */}
        {showScrollTop && (
          <button
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll to top"
          >
            <ArrowUp size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
