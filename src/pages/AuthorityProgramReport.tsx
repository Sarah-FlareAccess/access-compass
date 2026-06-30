import { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import {
  useProgramReport,
  type ProgramReportRow,
  type ProgramReportPayload,
  type ModuleAggregate,
} from '../hooks/useProgramReport';
import { accessModules } from '../data/accessModules';
import { generateProgramReportPdf } from '../utils/programReportPdfGenerator';
import type { AuthorityProgram } from '../types/access';
import '../styles/authority.css';

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

function ReportRender({ data }: { data: ProgramReportPayload }) {
  const { program, enrolment, moduleAggregates, topPriorityActions, topStrengths, topAreasToExplore, methodology } = data;

  return (
    <div className="program-report">
      {/* Executive summary */}
      <section className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Executive summary</h2>
        <div className="authority-stats" style={{ marginTop: '0.5rem' }}>
          <div className="authority-stat-card">
            <div className="authority-stat-value">{enrolment.total}</div>
            <div className="authority-stat-label">Businesses enrolled</div>
          </div>
          <div className="authority-stat-card">
            <div className="authority-stat-value">{enrolment.completed}</div>
            <div className="authority-stat-label">Completed</div>
          </div>
          <div className="authority-stat-card">
            <div className="authority-stat-value">{enrolment.submitted}</div>
            <div className="authority-stat-label">Submitted</div>
          </div>
          <div className="authority-stat-card">
            <div className="authority-stat-value">{enrolment.in_progress}</div>
            <div className="authority-stat-label">In progress</div>
          </div>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9375rem' }}>
          This {program.accessLevel === 'pulse' ? 'Pulse Check' : 'Deep Dive'} program covers {program.moduleIds.length} module{program.moduleIds.length !== 1 ? 's' : ''}.
          {' '}{pct(enrolment.completed, enrolment.total)}% of enrolled businesses have completed their assessments,
          {' '}{pct(enrolment.submitted + enrolment.completed, enrolment.total)}% have submitted at least one module for review.
        </p>
      </section>

      {/* Per-module rollup */}
      <section className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginTop: 0 }}>Module progress</h2>
        <p style={{ color: 'var(--text-secondary, #5C4A4E)', marginTop: 0 }}>
          Completion rate and confidence band distribution for each module in the program.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {moduleAggregates.map(agg => (
            <ModuleAggregateRow key={agg.module_id} agg={agg} />
          ))}
        </div>
      </section>

      {/* Top priority actions */}
      {topPriorityActions.length > 0 && (
        <section className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Top priority actions across the cohort</h2>
          <p style={{ color: 'var(--text-secondary, #5C4A4E)', marginTop: 0 }}>
            Recommended actions appearing most often across business assessments. Useful for
            sector-wide initiatives, group training, or shared infrastructure investment.
          </p>
          <ol style={{ paddingLeft: '1.5rem' }}>
            {topPriorityActions.map((pa, i) => (
              <li key={i} style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontWeight: 500 }}>{pa.action}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)' }}>
                  Appears in {pa.count} business{pa.count !== 1 ? 'es' : ''}
                  {pa.priority && (
                    <span style={{ marginLeft: '0.5rem', padding: '1px 6px', borderRadius: '3px', background: 'rgba(124, 58, 237, 0.1)', color: 'var(--deep-plum, #490E67)', fontSize: '0.75rem', fontWeight: 600 }}>
                      {pa.priority.toUpperCase()}
                    </span>
                  )}
                  {pa.moduleIds.length > 0 && (
                    <span style={{ marginLeft: '0.5rem' }}>
                      Modules: {pa.moduleIds.join(', ')}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Strengths */}
      {topStrengths.length > 0 && (
        <section className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Strengths across the cohort</h2>
          <p style={{ color: 'var(--text-secondary, #5C4A4E)', marginTop: 0 }}>
            Practices already in place across multiple businesses. Worth celebrating publicly and
            using as case studies for businesses still building these capabilities.
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {topStrengths.map((s, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {s.text}
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)', marginLeft: '0.5rem' }}>
                  ({s.count} business{s.count !== 1 ? 'es' : ''})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Areas to explore */}
      {topAreasToExplore.length > 0 && (
        <section className="authority-form-card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ marginTop: 0 }}>Areas to explore</h2>
          <p style={{ color: 'var(--text-secondary, #5C4A4E)', marginTop: 0 }}>
            Topics businesses flagged as "unable to check" or "unsure". These often indicate where
            the cohort would benefit from clearer guidance, training, or sector-wide support.
          </p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {topAreasToExplore.map((a, i) => (
              <li key={i} style={{ marginBottom: '0.5rem' }}>
                {a.text}
                <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)', marginLeft: '0.5rem' }}>
                  ({a.count})
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Methodology */}
      <section style={{ padding: '1rem 1.25rem', background: 'rgba(73, 14, 103, 0.04)', borderRadius: '6px', fontSize: '0.875rem', color: 'var(--text-secondary, #5C4A4E)' }}>
        <strong>Methodology and privacy:</strong> {methodology}
      </section>
    </div>
  );
}

function ModuleAggregateRow({ agg }: { agg: ModuleAggregate }) {
  const completedPct = pct(agg.completed, agg.total_enrolments);
  const inProgressPct = pct(agg.in_progress, agg.total_enrolments);
  const notStartedPct = pct(agg.not_started, agg.total_enrolments);
  const confidenceTotal = agg.confidence_strong + agg.confidence_mixed + agg.confidence_needs_work;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.25rem' }}>
        <span style={{ fontWeight: 500 }}>
          {agg.module_id} {getModuleName(agg.module_id)}
        </span>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #5C4A4E)' }}>
          {agg.completed}/{agg.total_enrolments} completed
        </span>
      </div>
      {/* Completion bar */}
      <div
        role="img"
        aria-label={`${completedPct}% completed, ${inProgressPct}% in progress, ${notStartedPct}% not started`}
        style={{
          display: 'flex',
          height: '10px',
          borderRadius: '4px',
          overflow: 'hidden',
          background: 'rgba(62, 43, 47, 0.08)',
          marginBottom: '0.5rem',
        }}
      >
        {completedPct > 0 && <div style={{ width: `${completedPct}%`, background: '#16A34A' }} />}
        {inProgressPct > 0 && <div style={{ width: `${inProgressPct}%`, background: '#F59E0B' }} />}
        {notStartedPct > 0 && <div style={{ width: `${notStartedPct}%`, background: 'rgba(62, 43, 47, 0.15)' }} />}
      </div>
      {/* Confidence band counts */}
      {confidenceTotal > 0 && (
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary, #5C4A4E)', display: 'flex', gap: '0.75rem' }}>
          <span>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', marginRight: '4px' }} aria-hidden="true" />
            Strong: {agg.confidence_strong}
          </span>
          <span>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', marginRight: '4px' }} aria-hidden="true" />
            Mixed: {agg.confidence_mixed}
          </span>
          <span>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', marginRight: '4px' }} aria-hidden="true" />
            Needs work: {agg.confidence_needs_work}
          </span>
        </div>
      )}
    </div>
  );
}
