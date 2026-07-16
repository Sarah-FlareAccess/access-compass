import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import {
  useProgramReport,
  type ProgramReportRow,
  type ProgramReportPayload,
  type OutcomesSnapshot,
} from '../hooks/useProgramReport';
import {
  moduleName as getModuleName,
  describeCohortMaturity,
  describeCompletion,
  generateKeyInsights,
} from '../utils/programReportModel';
import { generateProgramReportPdf } from '../utils/programReportPdfGenerator';
import type { AuthorityProgram } from '../types/access';
import '../styles/authority.css';
import '../styles/program-report.css';


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
  const [groupBy, setGroupBy] = useState<'theme' | 'framework'>('theme');

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
      groupBy,
    });
  };

  // Framework grouping is only offered when the snapshot carries statutory
  // outcomes (a mapped jurisdiction); otherwise there is nothing to group by.
  const outcomesFramework = selected?.snapshot_data.outcomes;

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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {(outcomesFramework || snapshots.length === 0) && (
            <div
              role="group"
              aria-label="Group recommendations by"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted, #6b7280)' }}>
                Group by
              </span>
              <div style={{ display: 'inline-flex', border: '1px solid #490E67', borderRadius: 6, overflow: 'hidden' }}>
                {([
                  { key: 'theme', label: 'Theme' },
                  { key: 'framework', label: outcomesFramework ? `${outcomesFramework.frameworkShort} outcome areas` : 'Outcome areas' },
                ] as const).map((opt, i) => {
                  const active = groupBy === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setGroupBy(opt.key)}
                      style={{
                        appearance: 'none',
                        border: 'none',
                        borderLeft: i > 0 ? '1px solid #490E67' : 'none',
                        cursor: 'pointer',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        background: active ? '#490E67' : '#fff',
                        color: active ? '#fff' : '#490E67',
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
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
            Generate a report to capture a snapshot of cohort progress, top priority actions and
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

  // Key insights come from the shared model (sample-guarded, single source of
  // truth) so the web and PDF read identically. Flattened for the callout list.
  const keyInsights = useMemo(() => {
    const g = generateKeyInsights(data, strongPct, completionPct);
    return [...g.strengths, ...g.barriers, ...g.opportunity].slice(0, 4);
  }, [data, strongPct, completionPct]);

  // Network Accessibility Maturity Score: a single, transparent 0-100 metric an
  // executive can track over time and put in a board paper. Each assessment
  // scores Strong = 100, Mixed = 50, Needs work = 0; the score is the cohort
  // average. Deliberately independent of participation so it measures the
  // cohort's accessibility, not how many have responded.
  const maturity = useMemo(() => {
    const t = confidence.total;
    const score = t > 0 ? Math.round((confidence.strong * 100 + confidence.mixed * 50) / t) : 0;
    const band =
      score >= 80 ? 'Leading' :
      score >= 60 ? 'Established' :
      score >= 40 ? 'Developing' :
      score >= 20 ? 'Emerging' : 'Foundational';
    return { score, band };
  }, [confidence]);

  // Recommended actions for the AUTHORITY (not the businesses): turn the
  // aggregate signal into a short set of decisions a council can act on.
  const recommendations = useMemo(() => {
    const recs: { text: string; kind: string }[] = [];
    const sortedNeeds = [...moduleAggregates]
      .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) > 0)
      .sort((a, b) => {
        const aT = a.confidence_strong + a.confidence_mixed + a.confidence_needs_work;
        const bT = b.confidence_strong + b.confidence_mixed + b.confidence_needs_work;
        return (b.confidence_needs_work / bT) - (a.confidence_needs_work / aT);
      });
    const weakest = sortedNeeds[0];
    if (weakest && weakest.confidence_needs_work > 0) {
      recs.push({ kind: 'Capability', text: `Deliver cohort-wide support on ${getModuleName(weakest.module_id)} — it carries the highest needs-work signal across the network.` });
    }
    if (topPriorityActions.length > 0) {
      const top = topPriorityActions[0];
      recs.push({ kind: 'Program', text: `Coordinate a shared, sector-wide program around the cohort's most common recommendations (the top pattern recurs across ${top.count} business${top.count !== 1 ? 'es' : ''}) — more efficient than supporting each business one at a time. Confirm the specific focus against the underlying plans.` });
    }
    if (topAreasToExplore.length > 0) {
      recs.push({ kind: 'Guidance', text: `Publish plain-language guidance in areas the cohort repeatedly flagged as unclear — a small number of shared explainers would resolve questions across many businesses.` });
    }
    if (enrolment.enrolled > 0) {
      recs.push({ kind: 'Participation', text: `Follow up with the ${enrolment.enrolled} enrolled business${enrolment.enrolled !== 1 ? 'es' : ''} yet to start, to firm up the cohort picture before public reporting.` });
    }
    if (weakest) {
      recs.push({ kind: 'Investment', text: `Focus the next funding round on ${getModuleName(weakest.module_id)} for the largest cohort-wide accessibility gain per dollar.` });
    }
    if (topStrengths.length > 0) {
      const top = topStrengths[0];
      recs.push({ kind: 'Recognition', text: `Showcase “${top.text}” publicly — already in place across ${top.count} business${top.count !== 1 ? 'es' : ''} — to build momentum and evidence outcomes.` });
    }
    return recs.slice(0, 6);
  }, [moduleAggregates, topPriorityActions, topAreasToExplore, topStrengths, enrolment]);

  // Priorities grouped by planning horizon (maps onto council planning cycles).
  const priorityHorizons = useMemo(() => {
    const at = (lvl: string) => topPriorityActions.filter(p => (p.priority || 'low').toLowerCase() === lvl);
    return [
      { key: 'immediate', label: 'Immediate', hint: 'High priority — act this cycle', accent: 'red', items: at('high') },
      { key: 'medium', label: 'Medium-term', hint: 'Plan into the next 6–12 months', accent: 'amber', items: at('medium') },
      { key: 'long', label: 'Longer-term', hint: 'Build into the multi-year roadmap', accent: 'blue', items: at('low') },
    ].filter(g => g.items.length > 0);
  }, [topPriorityActions]);

  // Network accessibility risk: councils plan around risk. A simple, transparent
  // read from maturity (how accessible), participation (how much is done) and
  // evidence volume (how confident we can be).
  const risk = useMemo(() => {
    const m = maturity.score, p = completionPct;
    let level: 'Low' | 'Moderate' | 'High';
    if (confidence.total < 5) level = 'High';
    else if (m >= 60 && p >= 60) level = 'Low';
    else if (m < 30 || p < 25) level = 'High';
    else level = 'Moderate';
    const note = level === 'Low'
      ? 'A mature, well-evidenced cohort. Findings are safe to cite in public reporting.'
      : level === 'High'
        ? 'Low maturity or thin evidence. Treat findings as a baseline and prioritise support and participation before public reporting.'
        : 'A developing cohort. Findings are directional; firm them up with more completions before citing publicly.';
    return { level, note };
  }, [maturity.score, completionPct, confidence.total]);

  return (
    <div className="program-report">
      {/* Network Accessibility Maturity Score — the headline, trackable metric */}
      <section className="report-maturity" aria-label="Network Accessibility Maturity Score">
        <div className="report-maturity__score">
          <div className="report-maturity__num">{maturity.score}<span className="report-maturity__denom">/100</span></div>
          <div className="report-maturity__band">{maturity.band}</div>
        </div>
        <div className="report-maturity__body">
          <h2>Network Accessibility Maturity</h2>
          <p>A single, trackable measure of the cohort&rsquo;s accessibility, drawn from all {confidence.total} assessment{confidence.total !== 1 ? 's' : ''} captured. Put it in board papers and annual reports and watch it move as the network improves.</p>
          <p className="report-maturity__method">
            <strong>How it&rsquo;s calculated:</strong> each assessment scores Strong = 100, Mixed = 50, Needs work = 0; the score is the cohort average. It measures accessibility maturity, not how many businesses have responded.
          </p>
        </div>
      </section>

      {/* Network accessibility risk — councils plan around risk */}
      <section className={`report-risk report-risk--${risk.level.toLowerCase()}`} aria-label="Network accessibility risk">
        <div className="report-risk__label">
          <span className="report-risk__kicker">Network accessibility risk</span>
          <span className="report-risk__level">{risk.level}</span>
        </div>
        <p className="report-risk__note">{risk.note}</p>
      </section>

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

      {/* Recommended actions for the authority — turns the report into a
          decision-making document, not just a description of the cohort. */}
      {recommendations.length > 0 && (
        <section className="authority-form-card report-section report-recommendations">
          <h2>Recommended actions for the authority</h2>
          <p className="report-section__subtitle">
            Where to focus next, derived from the cohort&rsquo;s aggregate signal — actions for the authority, not the individual businesses.
          </p>
          <ol className="report-recs">
            {recommendations.map((r, i) => (
              <li key={i}>
                <span className="report-recs__kind">{r.kind}</span>
                <span className="report-recs__text">{r.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Statutory framework outcomes — moved high: for many authorities this is
          the reason they buy (it saves statutory reporting). */}
      {data.outcomes && <OutcomesView outcomes={data.outcomes} />}

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
          Confidence distribution per module, with a verdict on where to focus. <strong>Maintain</strong> = doing well,
          keep it up · <strong>Invest</strong> = mixed, targeted support pays off · <strong>Improve</strong> = the biggest collective gap.
        </p>
        <div className="report-heatmap">
          {moduleAggregates.map(m => {
            const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
            const strongP = total > 0 ? (m.confidence_strong / total) * 100 : 0;
            const mixedP = total > 0 ? (m.confidence_mixed / total) * 100 : 0;
            const needsP = total > 0 ? (m.confidence_needs_work / total) * 100 : 0;
            const verdict = total === 0 ? null : strongP >= 55 ? { label: 'Maintain', cls: 'maintain' } : strongP >= 30 ? { label: 'Invest', cls: 'invest' } : { label: 'Improve', cls: 'improve' };
            return (
              <div key={m.module_id} className="report-heatmap__row">
                <div className="report-heatmap__label">
                  {getModuleName(m.module_id)} <strong>({m.module_id})</strong>
                </div>
                <div className="report-heatmap__bar" role="img" aria-label={`Strong ${m.confidence_strong}, Mixed ${m.confidence_mixed}, Needs work ${m.confidence_needs_work}`}>
                  {strongP > 0 && <div className="seg seg--strong" style={{ width: `${strongP}%` }}>{strongP >= 10 && <span>{m.confidence_strong}</span>}</div>}
                  {mixedP > 0 && <div className="seg seg--mixed" style={{ width: `${mixedP}%` }}>{mixedP >= 10 && <span>{m.confidence_mixed}</span>}</div>}
                  {needsP > 0 && <div className="seg seg--needs" style={{ width: `${needsP}%` }}>{needsP >= 10 && <span>{m.confidence_needs_work}</span>}</div>}
                </div>
                {verdict
                  ? <span className={`report-verdict report-verdict--${verdict.cls}`}>{verdict.label}</span>
                  : <span className="report-verdict report-verdict--none">—</span>}
                <div className="report-heatmap__count">{m.completed}/{m.total_enrolments}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Side-by-side priorities and strengths */}
      {priorityHorizons.length > 0 && (
        <section className="authority-form-card report-section">
          <h2>Priorities by planning horizon</h2>
          <p className="report-section__subtitle">
            The cohort&rsquo;s most common recommended actions, grouped so they map onto your planning cycles.
          </p>
          <div className="report-horizons">
            {priorityHorizons.map(g => (
              <div key={g.key} className={`report-horizon report-horizon--${g.accent}`}>
                <div className="report-horizon__head">
                  <h3>{g.label}</h3>
                  <span>{g.hint}</span>
                </div>
                <ol className="report-horizon__list">
                  {g.items.slice(0, 6).map((p, i) => (
                    <li key={p.action + i}>
                      <span className="report-horizon__text">{p.action}</span>
                      <span className="report-horizon__count">{p.count}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      )}

      {topStrengths.length > 0 && (
        <ExpandableSection
          title="What's working well"
          subtitle="Practices already in place across multiple businesses — worth celebrating and showcasing."
          items={topStrengths.map(s => ({ key: s.text, text: s.text, count: s.count }))}
          accent="green"
          wide
        />
      )}

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
// Statutory framework Outcomes view
// =====================================================
function OutcomesView({ outcomes }: { outcomes: OutcomesSnapshot }) {
  return (
    <section className="authority-form-card report-section" aria-labelledby="outcomes-heading">
      <h2 id="outcomes-heading">Against the {outcomes.frameworkName}</h2>
      <p className="report-section__subtitle">
        How this cohort&rsquo;s findings map to the {outcomes.frameworkShort} outcomes framework.
        These headings mirror the framework, so they can be pasted straight into your statutory report.
      </p>
      <p className="outcome-citation">{outcomes.citation}</p>
      <div className="outcome-domains">
        {outcomes.domains.map(d => (
          <div key={d.domainId} className="outcome-domain">
            <h3>{d.name}</h3>
            {d.outcomeStatement && <p className="outcome-statement">{d.outcomeStatement}</p>}
            {d.total > 0 ? (
              <>
                <div
                  className="report-heatmap__bar"
                  role="img"
                  aria-label={`Strong ${d.strong}, Mixed ${d.mixed}, Needs work ${d.needsWork} across ${d.total} assessments`}
                >
                  {d.strongPct > 0 && (
                    <div className="seg seg--strong" style={{ width: `${d.strongPct}%` }}>
                      {d.strongPct >= 12 && <span>{d.strongPct}%</span>}
                    </div>
                  )}
                  {d.mixedPct > 0 && (
                    <div className="seg seg--mixed" style={{ width: `${d.mixedPct}%` }}>
                      {d.mixedPct >= 12 && <span>{d.mixedPct}%</span>}
                    </div>
                  )}
                  {d.needsWorkPct > 0 && (
                    <div className="seg seg--needs" style={{ width: `${d.needsWorkPct}%` }}>
                      {d.needsWorkPct >= 12 && <span>{d.needsWorkPct}%</span>}
                    </div>
                  )}
                </div>
                <p className="outcome-modules">
                  <span className="outcome-modules__label">Contributing modules:</span>{' '}
                  {d.moduleIds.map(mId => `${getModuleName(mId)} (${mId})`).join(' · ')}
                </p>
              </>
            ) : (
              <p className="outcome-empty">
                No assessed modules map to this domain yet &mdash; a coverage gap for this cohort.
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
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

