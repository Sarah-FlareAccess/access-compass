import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import {
  useProgramReport,
  type ProgramReportRow,
  type ProgramReportPayload,
} from '../hooks/useProgramReport';
import { accessModules } from '../data/accessModules';
import { generateProgramReportPdf } from '../utils/programReportPdfGenerator';
import type { AuthorityProgram } from '../types/access';
import '../styles/authority.css';
import '../styles/program-report.css';

function getModuleName(moduleId: string): string {
  return accessModules.find(m => m.id === moduleId)?.name || moduleId;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function pct(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 100);
}

export default function AuthorityProgramReport() {
  const { id } = useParams<{ id: string }>();
  const programId = id ?? null;
  const { accessState } = useAuth();
  const { getProgram } = useAuthorityAdmin();
  const {
    snapshots,
    isLoading,
    isGenerating,
    error,
    generateReport,
    deleteSnapshot,
  } = useProgramReport(programId);

  const [program, setProgram] = useState<AuthorityProgram | null>(null);
  const [selectedSnapshotId, setSelectedSnapshotId] = useState<string | null>(null);

  usePageTitle(program ? `${program.name} report` : 'Program report');

  useEffect(() => {
    if (!programId) return;
    getProgram(programId).then(p => { if (p) setProgram(p); });
  }, [programId]);

  // Auto-select the latest snapshot when snapshots load
  useEffect(() => {
    if (snapshots.length > 0 && !selectedSnapshotId) {
      setSelectedSnapshotId(snapshots[0].id);
    }
  }, [snapshots, selectedSnapshotId]);

  const selected: ProgramReportRow | null = useMemo(
    () => snapshots.find(s => s.id === selectedSnapshotId) ?? null,
    [snapshots, selectedSnapshotId],
  );

  const handleGenerate = async () => {
    const row = await generateReport();
    if (row) setSelectedSnapshotId(row.id);
  };

  const handleDelete = async (snapshotId: string) => {
    if (!confirm('Delete this report snapshot? This cannot be undone.')) return;
    const ok = await deleteSnapshot(snapshotId);
    if (ok && selectedSnapshotId === snapshotId) {
      setSelectedSnapshotId(snapshots.find(s => s.id !== snapshotId)?.id ?? null);
    }
  };

  const handleDownloadPdf = () => {
    if (!selected) return;
    generateProgramReportPdf({
      payload: selected.snapshot_data,
      reportName: selected.name,
      generatedAt: selected.generated_at,
    });
  };

  if (!programId) {
    return (
      <div className="authority-page">
        <p>Program not specified.</p>
      </div>
    );
  }

  return (
    <div className="authority-page">
      <div className="authority-header">
        <div>
          <Link to={`/authority/programs/${programId}`} className="authority-back-link">
            Back to program
          </Link>
          <h1>{program?.name || 'Program report'}</h1>
          {program?.description && <p className="authority-subtitle">{program.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {selected && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleDownloadPdf}
            >
              Download PDF
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating...' : 'Generate report'}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--coral-flare, #ea0b3f)', fontSize: '0.875rem', margin: '0.5rem 0 1rem' }}>
          {error}
        </p>
      )}

      {/* Snapshot picker */}
      {snapshots.length > 0 && (
        <div className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Saved reports ({snapshots.length})</h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {snapshots.map(s => {
              const isSelected = s.id === selectedSnapshotId;
              return (
                <li
                  key={s.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid rgba(62, 43, 47, 0.05)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedSnapshotId(s.id)}
                    style={{
                      background: 'none',
                      border: 0,
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? 'var(--deep-plum, #490E67)' : 'inherit',
                      flex: 1,
                      padding: '0.25rem 0',
                    }}
                  >
                    {s.name}
                    <span style={{ color: 'var(--text-secondary, #5C4A4E)', fontWeight: 400, marginLeft: '0.5rem', fontSize: '0.875rem' }}>
                      {formatDate(s.generated_at)} - {s.enrolment_count} businesses, {s.completed_count} completed
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline btn-small"
                    onClick={() => handleDelete(s.id)}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {snapshots.length === 0 && !isLoading && (
        <div className="authority-empty">
          <h2>No reports yet</h2>
          <p>
            Generate a report to capture a snapshot of cohort progress, top priority actions, and
            strengths across the businesses enrolled in this program. Snapshots are saved so you can
            compare quarter-on-quarter.
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #5C4A4E)' }}>
            Reports show aggregate counts, completion rates and generated narrative summaries.
            Individual business responses, evidence and DIAP details remain private.
          </p>
        </div>
      )}

      {/* Selected snapshot render */}
      {selected && <ReportRender data={selected.snapshot_data} />}

      {/* Footer authority context */}
      {selected && accessState.organisation && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid rgba(62, 43, 47, 0.1)', fontSize: '0.875rem', color: 'var(--text-secondary, #5C4A4E)' }}>
          Generated for {accessState.organisation.name} on {formatDate(selected.generated_at)}.
        </div>
      )}
    </div>
  );
}

function describeCohortMaturity(strongPct: number): string {
  if (strongPct >= 60) return 'a strong cohort overall, with most modules assessed at high confidence. Use the strength patterns below as case studies for the rest of the cohort.';
  if (strongPct >= 40) return 'a developing cohort with good foundations and visible areas for improvement. Focus shared support on the modules with high needs-work proportions.';
  if (strongPct >= 20) return 'an emerging cohort with significant collective opportunity. Sector-wide training, shared resources, and group programs will accelerate progress on the top priority actions below.';
  return 'a cohort at the start of its journey. Capacity-building investment now will pay off in measurable progress within 6 to 12 months.';
}

function describeCompletion(completedPct: number, total: number): string {
  if (total === 0) return 'No businesses are currently enrolled. Once enrolment begins this section will populate.';
  if (completedPct >= 80) return 'Most businesses have finished their assessments, giving this report a high-confidence basis. Findings can be cited in public reporting.';
  if (completedPct >= 40) return 'A meaningful proportion has finished. Findings are directional but reliable. Follow up with the in-progress cohort to firm up the picture before public reporting.';
  if (completedPct >= 15) return 'Early-stage program. Findings are indicative only. Consider this a baseline read, then re-run the report in 4 to 8 weeks once more businesses complete.';
  return 'Very early in the program. Treat the figures below as preliminary signal rather than conclusion.';
}

function ReportRender({ data }: { data: ProgramReportPayload }) {
  const { program, enrolment, moduleAggregates, topPriorityActions, topStrengths, topAreasToExplore, methodology } = data;

  // Cohort-wide confidence totals for the maturity donut
  const confidence = useMemo(() => {
    let strong = 0, mixed = 0, needsWork = 0;
    moduleAggregates.forEach(m => {
      strong += m.confidence_strong;
      mixed += m.confidence_mixed;
      needsWork += m.confidence_needs_work;
    });
    return { strong, mixed, needsWork, total: strong + mixed + needsWork };
  }, [moduleAggregates]);

  const strongPct = confidence.total > 0 ? Math.round((confidence.strong / confidence.total) * 100) : 0;
  // Merge submitted into completed for display (no review workflow exists yet)
  const completedDisplay = enrolment.completed + enrolment.submitted;
  const completionPct = pct(completedDisplay, enrolment.total);

  // Generate key insights
  const keyInsights = useMemo(() => {
    const insights: string[] = [];
    if (strongPct >= 50) {
      insights.push(`${strongPct}% of assessed modules show STRONG confidence. The cohort is doing well overall.`);
    } else if (strongPct >= 25) {
      insights.push(`${strongPct}% STRONG with mixed results elsewhere. Clear opportunities for targeted support.`);
    } else if (confidence.total > 0) {
      insights.push(`Cohort maturity is in development. ${strongPct}% STRONG suggests significant collective work ahead.`);
    }

    const sortedNeeds = [...moduleAggregates]
      .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0)
      .sort((a, b) => {
        const aT = a.confidence_strong + a.confidence_mixed + a.confidence_needs_work;
        const bT = b.confidence_strong + b.confidence_mixed + b.confidence_needs_work;
        return (b.confidence_needs_work / bT) - (a.confidence_needs_work / aT);
      });
    if (sortedNeeds.length > 0 && sortedNeeds[0].confidence_needs_work > 0) {
      const m = sortedNeeds[0];
      const t = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
      insights.push(`Module ${m.module_id} shows the most NEEDS-WORK signal (${m.confidence_needs_work} of ${t} assessments). Prioritise for cohort-wide support.`);
    }

    if (topPriorityActions.length > 0) {
      const top = topPriorityActions[0];
      insights.push(`The most common recommended action is "${top.action}" (appears in ${top.count} business${top.count !== 1 ? 'es' : ''}). Consider this for a sector-wide initiative.`);
    }

    if (topStrengths.length > 0) {
      const top = topStrengths[0];
      insights.push(`"${top.text}" is already in place across ${top.count} business${top.count !== 1 ? 'es' : ''}. Worth highlighting publicly.`);
    }

    return insights.slice(0, 4);
  }, [strongPct, confidence, moduleAggregates, topPriorityActions, topStrengths]);

  return (
    <div className="program-report">
      {/* At-a-glance hero - 3 column visual layout */}
      <section className="report-hero">
        <div className="report-hero__card">
          <h3>Cohort maturity</h3>
          <p className="report-hero__subtitle">Confidence across all assessed modules</p>
          <div className="report-donut-wrap">
            <Donut
              segments={[
                { value: confidence.strong, color: '#86EFAC' },
                { value: confidence.mixed, color: '#FCD34D' },
                { value: confidence.needsWork, color: '#FCA5A5' },
              ]}
            />
            <div className="report-donut-center">
              <div className="report-donut-value">{strongPct}%</div>
              <div className="report-donut-label">Strong</div>
            </div>
          </div>
          <div className="report-donut-legend">
            <span><span className="dot dot--green" />Strong {confidence.strong}</span>
            <span><span className="dot dot--amber" />Mixed {confidence.mixed}</span>
            <span><span className="dot dot--red" />Needs work {confidence.needsWork}</span>
          </div>
        </div>

        <div className="report-hero__card">
          <h3>Enrolment status</h3>
          <p className="report-hero__subtitle">Where the cohort sits today</p>
          <div className="report-donut-wrap">
            <Donut
              segments={[
                { value: completedDisplay, color: '#86EFAC' },
                { value: enrolment.in_progress, color: '#C4B5FD' },
                { value: enrolment.enrolled, color: 'rgba(62, 43, 47, 0.18)' },
              ]}
            />
            <div className="report-donut-center">
              <div className="report-donut-value">{completionPct}%</div>
              <div className="report-donut-label">Completed</div>
            </div>
          </div>
          <div className="report-donut-legend">
            <span><span className="dot dot--green" />Completed {completedDisplay}</span>
            <span><span className="dot dot--purple" />In progress {enrolment.in_progress}</span>
            <span><span className="dot dot--grey" />Not started {enrolment.enrolled}</span>
          </div>
        </div>

        <div className="report-hero__card report-hero__stats">
          <h3>At a glance</h3>
          <p className="report-hero__subtitle">{program.accessLevel === 'pulse' ? 'Pulse Check' : 'Deep Dive'} program</p>
          <div className="report-stat-row"><span className="report-stat-num">{enrolment.total}</span><span>businesses enrolled</span></div>
          <div className="report-stat-row"><span className="report-stat-num">{completedDisplay}</span><span>finished assessments</span></div>
          <div className="report-stat-row"><span className="report-stat-num">{program.moduleIds.length}</span><span>modules in scope</span></div>
          <div className="report-stat-row"><span className="report-stat-num">{confidence.total}</span><span>assessments captured</span></div>
        </div>
      </section>

      {/* Key insights callout */}
      {keyInsights.length > 0 && (
        <section className="report-insights">
          <h3>Key insights</h3>
          <ul>
            {keyInsights.map((insight, i) => (
              <li key={i}>{insight}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Plain-English interpretation */}
      <section className="report-interpretation">
        <p>
          <strong>Cohort maturity:</strong> This is {describeCohortMaturity(strongPct)}
        </p>
        <p>
          <strong>Completion:</strong> {completionPct}% of enrolled businesses have finished. {describeCompletion(completionPct, enrolment.total)}
        </p>
      </section>

      {/* Module heatmap */}
      <section className="authority-form-card report-section">
        <h2>Module maturity heatmap</h2>
        <p className="report-section__subtitle">
          Confidence distribution per module. Wider green = cohort is doing well. Wider red = needs collective attention.
        </p>
        <div className="report-heatmap">
          {moduleAggregates.map(m => {
            const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
            const strongP = total > 0 ? (m.confidence_strong / total) * 100 : 0;
            const mixedP = total > 0 ? (m.confidence_mixed / total) * 100 : 0;
            const needsP = total > 0 ? (m.confidence_needs_work / total) * 100 : 0;
            return (
              <div key={m.module_id} className="report-heatmap__row">
                <div className="report-heatmap__label">
                  <strong>{m.module_id}</strong> {getModuleName(m.module_id)}
                </div>
                <div className="report-heatmap__bar" role="img" aria-label={`Strong ${m.confidence_strong}, Mixed ${m.confidence_mixed}, Needs work ${m.confidence_needs_work}`}>
                  {strongP > 0 && <div className="seg seg--strong" style={{ width: `${strongP}%` }}>{strongP >= 10 && <span>{m.confidence_strong}</span>}</div>}
                  {mixedP > 0 && <div className="seg seg--mixed" style={{ width: `${mixedP}%` }}>{mixedP >= 10 && <span>{m.confidence_mixed}</span>}</div>}
                  {needsP > 0 && <div className="seg seg--needs" style={{ width: `${needsP}%` }}>{needsP >= 10 && <span>{m.confidence_needs_work}</span>}</div>}
                </div>
                <div className="report-heatmap__count">{m.completed}/{m.total_enrolments}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Side-by-side priorities and strengths */}
      <div className="report-two-col">
        {topPriorityActions.length > 0 && (
          <ExpandableSection
            title="Top priorities across the cohort"
            subtitle="Actions appearing most often across business assessments."
            items={topPriorityActions.map(pa => ({ key: pa.action, text: pa.action, count: pa.count, priority: pa.priority }))}
            accent="amber"
          />
        )}
        {topStrengths.length > 0 && (
          <ExpandableSection
            title="Strengths worth celebrating"
            subtitle="Practices already in place across multiple businesses."
            items={topStrengths.map(s => ({ key: s.text, text: s.text, count: s.count }))}
            accent="green"
          />
        )}
      </div>

      {topAreasToExplore.length > 0 && (
        <ExpandableSection
          title="Areas to explore"
          subtitle="Topics businesses flagged as unable to check or unsure. Signal for sector-wide guidance and training."
          items={topAreasToExplore.map(a => ({ key: a.text, text: a.text, count: a.count }))}
          accent="purple"
          wide
        />
      )}

      <section className="report-methodology">
        <strong>Methodology and privacy:</strong> {methodology}
      </section>
    </div>
  );
}

// =====================================================
// Donut chart (SVG, no chart lib)
// =====================================================
function Donut({ segments }: { segments: Array<{ value: number; color: string }> }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  const cx = 100, cy = 100, radius = 70, strokeWidth = 22;
  const c = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" aria-label="No data yet">
        <circle cx={cx} cy={cy} r={radius} stroke="#f1ecf5" strokeWidth={strokeWidth} fill="none" />
      </svg>
    );
  }

  let offset = 0;
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <circle cx={cx} cy={cy} r={radius} stroke="#f1ecf5" strokeWidth={strokeWidth} fill="none" />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {segments.map((seg, i) => {
          if (seg.value <= 0) return null;
          const len = (seg.value / total) * c;
          const dasharray = `${len} ${c - len}`;
          const dashoffset = -offset;
          offset += len;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              stroke={seg.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={dasharray}
              strokeDashoffset={dashoffset}
              strokeLinecap="butt"
            />
          );
        })}
      </g>
    </svg>
  );
}

// =====================================================
// Expandable list section (top-5 + Show all)
// =====================================================
interface ExpandableItem {
  key: string;
  text: string;
  count: number;
  priority?: string;
}

function ExpandableSection({
  title,
  subtitle,
  items,
  accent,
  wide,
}: {
  title: string;
  subtitle: string;
  items: ExpandableItem[];
  accent: 'green' | 'amber' | 'purple';
  wide?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const shown = expanded ? items : items.slice(0, 5);
  const accentClass = `report-list__rank--${accent}`;

  return (
    <section className={`authority-form-card report-section${wide ? ' report-section--wide' : ''}`}>
      <h2>{title}</h2>
      <p className="report-section__subtitle">{subtitle}</p>
      <ol className="report-list">
        {shown.map((item, i) => (
          <li key={item.key + i}>
            <span className={`report-list__rank ${accentClass}`}>{i + 1}</span>
            <span className="report-list__text">{item.text}</span>
            {item.priority && (
              <span className="report-list__priority">{item.priority.toUpperCase()}</span>
            )}
            <span className="report-list__count">{item.count}</span>
          </li>
        ))}
      </ol>
      {items.length > 5 && (
        <button
          type="button"
          className="report-list__toggle"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? `Show top 5` : `Show all ${items.length}`}
        </button>
      )}
    </section>
  );
}

