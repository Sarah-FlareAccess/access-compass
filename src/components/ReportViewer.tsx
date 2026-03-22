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
              <div className="summary-stats">
                <div className="stat-card">
                  <div className="stat-number">{report.executiveSummary.modulesCompleted}</div>
                  <div className="stat-label">Modules Completed</div>
                </div>
                <div className="stat-card stat-positive">
                  <div className="stat-number">{report.executiveSummary.strengthsCount}</div>
                  <div className="stat-label">Strengths Identified</div>
                </div>
                <div className="stat-card stat-action">
                  <div className="stat-number">{report.executiveSummary.actionsCount}</div>
                  <div className="stat-label">Priority Actions</div>
                </div>
                <div className="stat-card stat-explore">
                  <div className="stat-number">{report.executiveSummary.areasToExploreCount}</div>
                  <div className="stat-label">To Investigate</div>
                </div>
              </div>
              <div className="completion-progress">
                <div className="progress-label">
                  Overall Completion: {report.executiveSummary.completionPercentage}%
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${report.executiveSummary.completionPercentage}%` }}
                  />
                </div>
              </div>

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
            <ReportGroup id="section-evidence" title="Assessment Evidence" defaultOpen={false}>
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
            {/* What's Going Well */}
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
                  advice doesn't mean you've failed — it's a normal next step for many organisations.
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
                contact Flare Access to engage an access consultant.
              </p>
            </section>

            <section className="report-section report-disclaimer">
              <h2>Important Disclaimer</h2>
              <p>
                This guidance is for information only. It is not legal advice, a compliance
                certificate, or a substitute for professional accessibility auditing. Actions are
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
