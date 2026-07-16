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
  computeConfidence,
  computeMaturity,
  computeRisk,
  authorityRecommendations,
  sharedRecommendations,
  pctOfCohort,
  formatAssessmentWindow,
  moduleVerdict,
  resolveGroupMode,
  groupWordFor,
  groupRecommendations,
  THEME_RATIONALE,
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

// Saved-report cards need the time as well as the date so two snapshots taken on
// the same day are distinguishable.
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${formatDate(iso)}, ${d.toLocaleTimeString('en-AU', { hour: 'numeric', minute: '2-digit' })}`;
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
  // Optional assessment-date window for the next generated report (by completion
  // date). Blank = all assessments.
  const [genFrom, setGenFrom] = useState('');
  const [genTo, setGenTo] = useState('');

  usePageTitle(program ? `${program.name} intelligence report` : 'Program intelligence report');

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
    const row = await generateReport(undefined, { from: genFrom || null, to: genTo || null });
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
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem', color: 'var(--text-muted, #6b7280)' }}
            title="Limit the report to assessments completed in this range. Leave blank to include all."
          >
            <span>Completed</span>
            <input
              type="date"
              aria-label="Assessments completed from"
              value={genFrom}
              max={genTo || undefined}
              onChange={e => setGenFrom(e.target.value)}
              style={{ padding: '0.3rem 0.4rem', border: '1px solid #d1cdd0', borderRadius: 6, fontSize: '0.8125rem' }}
            />
            <span>to</span>
            <input
              type="date"
              aria-label="Assessments completed to"
              value={genTo}
              min={genFrom || undefined}
              onChange={e => setGenTo(e.target.value)}
              style={{ padding: '0.3rem 0.4rem', border: '1px solid #d1cdd0', borderRadius: 6, fontSize: '0.8125rem' }}
            />
          </div>
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
        <div className="authority-form-card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
          <h2 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1rem' }}>Saved reports ({snapshots.length})</h2>
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
                      {`· ${formatDateTime(s.generated_at)} · ${s.enrolment_count} businesses, ${s.completed_count} completed`}
                      {formatAssessmentWindow(s.snapshot_data.assessmentWindow, true)
                        ? ` · ${formatAssessmentWindow(s.snapshot_data.assessmentWindow, true)}`
                        : ''}
                      {s.snapshot_data.outcomes
                        ? ` · view by theme or ${s.snapshot_data.outcomes.frameworkShort} outcome areas`
                        : ''}
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
      {selected && <ReportRender data={selected.snapshot_data} groupBy={groupBy} />}

      {/* Footer authority context */}
      {selected && accessState.organisation && (
        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid rgba(62, 43, 47, 0.1)', fontSize: '0.875rem', color: 'var(--text-secondary, #5C4A4E)' }}>
          Generated for {accessState.organisation.name} on {formatDate(selected.generated_at)}.
        </div>
      )}
    </div>
  );
}

function ReportRender({ data, groupBy }: { data: ProgramReportPayload; groupBy: 'theme' | 'framework' }) {
  const { program, enrolment, moduleAggregates, topPriorityActions, topStrengths, topAreasToExplore, methodology } = data;

  // Cohort-wide confidence totals for the maturity donut
  const confidence = useMemo(() => computeConfidence(data), [data]);
  const strongPct = confidence.strongPct;
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
  const maturity = useMemo(() => computeMaturity(confidence), [confidence]);
  const recommendations = useMemo(() => authorityRecommendations(data), [data]);
  const cohortSize = data.assessedBusinesses || completedDisplay || enrolment.total;
  const risk = useMemo(() => computeRisk(maturity.score, completionPct, confidence.total), [maturity.score, completionPct, confidence.total]);

  const groupMode = resolveGroupMode(groupBy, data.outcomes?.frameworkKey);
  const groupWord = groupWordFor(groupMode);
  const recGroups = useMemo(
    () => groupRecommendations(topPriorityActions, groupMode, data.outcomes?.frameworkKey),
    [topPriorityActions, groupMode, data.outcomes],
  );
  // The appendix is only worth showing when the body cannot show everything
  // (a group with more than the per-group cap, or one-off patterns); otherwise
  // it just repeats the body.
  const REC_SHOWN_PER_GROUP = 6;
  const appendixNeeded = topPriorityActions.length > recGroups.reduce(
    (n, g) => n + Math.min(REC_SHOWN_PER_GROUP, sharedRecommendations(g.items).length), 0,
  );

  return (
    <div className="program-report">
      {/* About this program - context (parity with the PDF). Stats live in the
          hero card below, so this stays to purpose + grouping + areas list. */}
      <section className="authority-form-card report-section">
        <h2>About this program</h2>
        {program.description && <p className="report-section__subtitle">{program.description}</p>}
        <p className="report-section__subtitle">
          {groupMode === 'framework'
            ? `Recommendations throughout are organised by the ${data.outcomes?.frameworkShort ?? 'jurisdiction'} outcome domains, so you can connect the findings to your access and inclusion planning and reporting. Each recommendation is mapped to the domain most closely related to its intent, and some relate to more than one; confirm the fit with your own plan before relying on it.`
            : 'Recommendations throughout are organised by accessibility theme (the area of the visitor journey they relate to).'}
        </p>
        {formatAssessmentWindow(data.assessmentWindow) && (
          <p className="report-section__subtitle" style={{ fontWeight: 600 }}>
            This report covers {formatAssessmentWindow(data.assessmentWindow)}. Businesses without an assessment completed in this period are not included.
          </p>
        )}
        <p className="report-section__subtitle" style={{ marginBottom: '0.25rem' }}>
          Areas assessed ({program.moduleIds.length}):
        </p>
        <ul className="report-areas-list" style={{ columns: program.moduleIds.length > 8 ? '2' : '1', margin: 0 }}>
          {program.moduleIds.map(mId => (
            <li key={mId}>{getModuleName(mId)} ({mId})</li>
          ))}
        </ul>
      </section>
      {/* Network Accessibility Maturity Score - the headline, trackable metric */}
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

      {/* Network support need - an implementation-planning indicator, not a
          risk/compliance rating (kept the report-risk-- class for styling). */}
      <section className={`report-risk report-risk--${risk.level.toLowerCase()}`} aria-label="Network support need">
        <div className="report-risk__label">
          <span className="report-risk__kicker">Network support need</span>
          <span className="report-risk__level">{risk.level}</span>
        </div>
        <p className="report-risk__note">{risk.note}</p>
      </section>

      {/* At-a-glance hero - 3 column visual layout */}
      <section className="report-hero">
        <div className="report-hero__card">
          <h3>Cohort readiness</h3>
          <p className="report-hero__subtitle">Assessment status across all assessed modules</p>
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

      {/* Potential network initiatives - the "so what" that turns the report
          into a decision-making document, not just a description of the cohort. */}
      {recommendations.length > 0 && (
        <section className="authority-form-card report-section report-recommendations">
          <h2>Potential network initiatives</h2>
          <p className="report-section__subtitle">
            The pattern of recommendations points to opportunities for shared support across the network - initiatives that would help many businesses at once rather than each in isolation.
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

      {/* Statutory framework outcomes - moved high: for many authorities this is
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
          Readiness distribution per module, with a tag showing how the cohort is tracking. <strong>On track</strong> = most businesses strong ·
          <strong>Developing</strong> = mixed, targeted support pays off · <strong>Priority</strong> = the biggest collective gap.
        </p>
        <div className="report-heatmap">
          {moduleAggregates.map(m => {
            const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
            const strongP = total > 0 ? (m.confidence_strong / total) * 100 : 0;
            const mixedP = total > 0 ? (m.confidence_mixed / total) * 100 : 0;
            const needsP = total > 0 ? (m.confidence_needs_work / total) * 100 : 0;
            const verdict = moduleVerdict(m);
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
                  ? <span className={`report-verdict report-verdict--${verdict.key}`}>{verdict.label}</span>
                  : <span className="report-verdict report-verdict--none">-</span>}
                <div className="report-heatmap__count">{m.completed}/{m.total_enrolments}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Most common recommendations grouped by area (or jurisdiction outcome
          area), with the specific actions under each so a council can see
          exactly what the gap is. Descriptive - count + share, no judgement. */}
      {recGroups.length > 0 && (
        <section className="authority-form-card report-section">
          <h2>Most common recommendations by {groupWord}</h2>
          <p className="report-section__subtitle">
            The specific recommendations raised across the cohort, grouped by {groupWord} and ordered by how many businesses raised each - so it&rsquo;s clear exactly where the gaps are. Priorities vary between organisations, but they show where shared resources, funding or capability-building could support several at once. Counts show how many of the {cohortSize} assessed business{cohortSize !== 1 ? 'es' : ''} raised each{appendixNeeded ? '; any beyond the top few per area are in the appendix' : ''}.
          </p>
          {recGroups.map(g => {
            const items = sharedRecommendations(g.items);
            if (items.length === 0) return null;
            const shown = appendixNeeded ? items.slice(0, REC_SHOWN_PER_GROUP) : items;
            return (
              <div className="report-rec-group" key={g.key}>
                <h3>{g.label}</h3>
                {THEME_RATIONALE[g.key] && <p className="report-rec-why">{THEME_RATIONALE[g.key]}</p>}
                <ul className="report-rec-list">
                  {shown.map((p, i) => (
                    <li key={p.action + i}>
                      <span className="report-rec-list__text">{p.action}</span>
                      <span className="report-rec-list__count">{p.count} business{p.count !== 1 ? 'es' : ''} ({pctOfCohort(p.count, cohortSize)}%)</span>
                    </li>
                  ))}
                </ul>
                {appendixNeeded && items.length > REC_SHOWN_PER_GROUP && (
                  <p className="report-rec-more">+ {items.length - REC_SHOWN_PER_GROUP} more in the appendix</p>
                )}
              </div>
            );
          })}
        </section>
      )}

      {topStrengths.length > 0 && (
        <ExpandableSection
          title="What's working well"
          subtitle="Practices already in place across multiple businesses - worth celebrating and showcasing."
          items={topStrengths.map(s => ({ key: s.text, text: s.text, count: s.count, pct: pctOfCohort(s.count, cohortSize) }))}
          accent="green"
          wide
        />
      )}

      {topAreasToExplore.length > 0 && (
        <ExpandableSection
          title="Areas to explore"
          subtitle="Topics businesses flagged as unable to check or unsure. Signal for sector-wide guidance and training."
          items={topAreasToExplore.map(a => ({ key: a.text, text: a.text, count: a.count, pct: pctOfCohort(a.count, cohortSize) }))}
          accent="purple"
          wide
        />
      )}

      {/* Appendix - full recommendation list, only when the body could not show
          everything (otherwise it would just repeat the body). */}
      {appendixNeeded && (
        <section className="authority-form-card report-section">
          <h2>Appendix: all recommendations by {groupWord}</h2>
          <p className="report-section__subtitle">
            The complete list of recommendation patterns, grouped by area. Counts show how many businesses each appears in.
          </p>
          {recGroups.map(g => (
            <div key={g.key} className="report-rec-group">
              <h3>{g.label} - {g.total} recommendation{g.total !== 1 ? 's' : ''} across the cohort</h3>
              <ul>
                {g.items.map((pa, i) => (
                  <li key={pa.action + i}>{pa.action} ({pa.count} business{pa.count !== 1 ? 'es' : ''}, {pctOfCohort(pa.count, cohortSize)}%)</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {/* Ongoing-value close - only what re-running genuinely provides. */}
      <section className="authority-form-card report-section report-overtime">
        <h2>Tracking progress over time</h2>
        <p>
          This is a point-in-time snapshot. Its value grows when the cohort reassesses - at the next funding round, or annually - and this report is re-run. Each new version turns a one-off picture into a measurable trend you can report against. With each round, re-running this report shows:
        </p>
        <ul>
          <li>Network maturity trend - the maturity score moving as businesses act on their gaps.</li>
          <li>Gaps closing - recommendations that have become strengths since the last assessment.</li>
          <li>New and emerging needs - fresh recommendations that surface as more businesses complete, or as practices evolve.</li>
          <li>Progress by business - each business&rsquo;s readiness change between rounds.</li>
        </ul>
        <p>
          Regular reassessment gives you evidence to put in front of funders and to report against year on year, and shows where a coordinated program is moving the network rather than each business in isolation.
        </p>
      </section>

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
                No assessed modules map to this domain yet - a coverage gap for this cohort.
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
  pct?: number;
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
            <span className="report-list__count">{item.count}{item.pct != null ? ` (${item.pct}%)` : ''}</span>
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

