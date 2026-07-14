import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import type { ProgramReportRow } from '../hooks/useProgramReport';
import '../styles/authority.css';

import type { AuthorityProgram, ChildOrgSummary } from '../types/access';

const STATUS_COLORS: Record<string, string> = {
  enrolled: '#490E67',
  in_progress: '#7C3AED',
  submitted: '#F59E0B',
  completed: '#16A34A',
  withdrawn: '#9CA3AF',
};

const STATUS_LABELS: Record<string, string> = {
  enrolled: 'Enrolled',
  in_progress: 'In Progress',
  submitted: 'Submitted',
  completed: 'Completed',
  withdrawn: 'Withdrawn',
};

// Group modules into plain-English access categories so the cohort heatmap
// reads at a glance (physical, comms, service...) instead of module numbers.
const CATEGORY_ORDER = [
  'Physical access & spaces',
  'Communication & sensory access',
  'Customer service & staff',
  'Events & programming',
  'Policy & people',
];

const CATEGORY_OVERRIDES: Record<string, string> = {
  '4.1': 'Communication & sensory access',
  '6.2': 'Physical access & spaces',
  '6.3': 'Communication & sensory access',
  '6.4': 'Communication & sensory access',
  '7.1': 'Physical access & spaces',
  '7.3': 'Customer service & staff',
  '7.5': 'Customer service & staff',
};

function moduleCategory(moduleId: string): string {
  const override = CATEGORY_OVERRIDES[moduleId];
  if (override) return override;
  switch (moduleId.split('.')[0]) {
    case '1': return 'Communication & sensory access';
    case '2':
    case '3': return 'Physical access & spaces';
    case '4': return 'Customer service & staff';
    case '5': return 'Policy & people';
    case '6':
    case '7': return 'Events & programming';
    default: return 'Other';
  }
}

export default function AuthorityDashboard() {
  usePageTitle('Authority Portal');
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const orgIdRef = useRef(orgId);
  if (orgId) orgIdRef.current = orgId;
  const effectiveOrgId = orgId || orgIdRef.current;
  const { getPrograms, getChildOrgSummaries, isLoading } = useAuthorityAdmin();

  const [programs, setPrograms] = useState<AuthorityProgram[]>([]);
  const [childSummaries, setChildSummaries] = useState<ChildOrgSummary[]>([]);
  const [latestSnapshots, setLatestSnapshots] = useState<ProgramReportRow[]>([]);
  const [filterProgramId, setFilterProgramId] = useState<string>('all');

  useEffect(() => {
    if (!effectiveOrgId) return;
    Promise.all([
      getPrograms(effectiveOrgId),
      getChildOrgSummaries(effectiveOrgId),
    ]).then(([progs, summaries]) => {
      if (progs.length > 0) setPrograms(progs);
      if (summaries.length > 0) setChildSummaries(summaries);
    });
  }, [effectiveOrgId]);

  // Load the most-recent program_report per program so the dashboard
  // can surface cohort-wide maturity, priorities and strengths.
  useEffect(() => {
    if (!effectiveOrgId || !isSupabaseEnabled() || !supabase) return;
    supabase
      .from('program_reports')
      .select('*')
      .eq('organisation_id', effectiveOrgId)
      .order('generated_at', { ascending: false })
      .then(({ data, error: snapErr }) => {
        if (snapErr || !data) return;
        const seen = new Set<string>();
        const latest = (data as ProgramReportRow[]).filter(r => {
          if (seen.has(r.program_id)) return false;
          seen.add(r.program_id);
          return true;
        });
        setLatestSnapshots(latest);
      });
  }, [effectiveOrgId]);

  // Snapshots filtered by the dropdown selection
  const filteredSnapshots = useMemo(() => {
    if (filterProgramId === 'all') return latestSnapshots;
    return latestSnapshots.filter(s => s.program_id === filterProgramId);
  }, [latestSnapshots, filterProgramId]);

  // Cohort-wide confidence band totals from filtered snapshots
  const cohortMaturity = useMemo(() => {
    let strong = 0, mixed = 0, needsWork = 0;
    filteredSnapshots.forEach(s => {
      s.snapshot_data.moduleAggregates.forEach(m => {
        strong += m.confidence_strong;
        mixed += m.confidence_mixed;
        needsWork += m.confidence_needs_work;
      });
    });
    return { strong, mixed, needsWork, total: strong + mixed + needsWork };
  }, [filteredSnapshots]);

  // Aggregate top priorities across filtered snapshots
  const cohortTopPriorities = useMemo(() => {
    const map = new Map<string, { action: string; count: number; priority?: string; programIds: string[] }>();
    filteredSnapshots.forEach(s => {
      s.snapshot_data.topPriorityActions.forEach(pa => {
        const key = pa.action.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          existing.count += pa.count;
          if (!existing.programIds.includes(s.program_id)) existing.programIds.push(s.program_id);
        } else {
          map.set(key, { action: pa.action, count: pa.count, priority: pa.priority, programIds: [s.program_id] });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredSnapshots]);

  // Aggregate top strengths across filtered snapshots
  const cohortTopStrengths = useMemo(() => {
    const map = new Map<string, { text: string; count: number }>();
    filteredSnapshots.forEach(s => {
      s.snapshot_data.topStrengths.forEach(st => {
        const key = st.text.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          existing.count += st.count;
        } else {
          map.set(key, { text: st.text, count: st.count });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredSnapshots]);

  // Aggregate top areas to explore across filtered snapshots
  const cohortAreasToExplore = useMemo(() => {
    const map = new Map<string, { text: string; count: number }>();
    filteredSnapshots.forEach(s => {
      (s.snapshot_data.topAreasToExplore || []).forEach(a => {
        const key = a.text.toLowerCase().trim();
        const existing = map.get(key);
        if (existing) {
          existing.count += a.count;
        } else {
          map.set(key, { text: a.text, count: a.count });
        }
      });
    });
    return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
  }, [filteredSnapshots]);

  // Roll module aggregates up into plain-English access categories so the
  // heatmap is graspable at a glance rather than 20+ numbered rows.
  const categoryHeatmap = useMemo(() => {
    const map = new Map<string, { strong: number; mixed: number; needsWork: number; total: number; modules: Set<string> }>();
    filteredSnapshots.forEach(s => {
      s.snapshot_data.moduleAggregates.forEach(m => {
        const cat = moduleCategory(m.module_id);
        const existing = map.get(cat) ?? { strong: 0, mixed: 0, needsWork: 0, total: 0, modules: new Set<string>() };
        existing.strong += m.confidence_strong;
        existing.mixed += m.confidence_mixed;
        existing.needsWork += m.confidence_needs_work;
        existing.total = existing.strong + existing.mixed + existing.needsWork;
        existing.modules.add(m.module_id);
        map.set(cat, existing);
      });
    });
    return CATEGORY_ORDER
      .filter(cat => map.has(cat))
      .map(cat => {
        const c = map.get(cat)!;
        return { category: cat, strong: c.strong, mixed: c.mixed, needsWork: c.needsWork, total: c.total, moduleCount: c.modules.size };
      })
      .filter(r => r.total > 0);
  }, [filteredSnapshots]);

  // Last 7 days enrolment activity (for the activity pulse card)
  const recentActivity = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const sevenDays = childSummaries.filter(s => {
      if (!s.enrolled_at) return false;
      return now - new Date(s.enrolled_at).getTime() < 7 * dayMs;
    }).length;
    const priorSeven = childSummaries.filter(s => {
      if (!s.enrolled_at) return false;
      const d = now - new Date(s.enrolled_at).getTime();
      return d >= 7 * dayMs && d < 14 * dayMs;
    }).length;
    const delta = sevenDays - priorSeven;
    return { sevenDays, priorSeven, delta };
  }, [childSummaries]);

  const totalBusinesses = new Set(childSummaries.map(s => s.child_org_id)).size;
  const completedEnrolments = childSummaries.filter(s => s.enrolment_status === 'completed').length;
  const submittedEnrolments = childSummaries.filter(s => s.enrolment_status === 'submitted').length;
  const activePrograms = programs.filter(p => p.is_active).length;

  // Status breakdown for donut/bar chart
  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    childSummaries.forEach(s => {
      const status = s.enrolment_status || 'enrolled';
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      status,
      count,
      label: STATUS_LABELS[status] || status,
      color: STATUS_COLORS[status] || '#9CA3AF',
      percent: childSummaries.length > 0 ? Math.round((count / childSummaries.length) * 100) : 0,
    }));
  }, [childSummaries]);

  // Per-program progress
  const programProgress = useMemo(() => {
    return programs.map(program => {
      const enrolments = childSummaries.filter(s => s.program_id === program.id);
      const completed = enrolments.filter(s => s.enrolment_status === 'completed').length;
      const submitted = enrolments.filter(s => s.enrolment_status === 'submitted').length;
      const inProgress = enrolments.filter(s => s.enrolment_status === 'in_progress').length;
      const total = enrolments.length;
      return { program, total, completed, submitted, inProgress };
    });
  }, [programs, childSummaries]);

  // Enrolment timeline (last 6 months)
  const timeline = useMemo(() => {
    const months: { label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
      const count = childSummaries.filter(s => {
        if (!s.enrolled_at) return false;
        const enrolled = new Date(s.enrolled_at);
        return enrolled.getFullYear() === d.getFullYear() && enrolled.getMonth() === d.getMonth();
      }).length;
      months.push({ label, count });
    }
    return months;
  }, [childSummaries]);

  const timelineMax = Math.max(...timeline.map(m => m.count), 1);

  if (!orgId) {
    return (
      <div className="authority-page">
        <h1>Authority Portal</h1>
        <p>You need to be a member of an authority organisation to access this page.</p>
      </div>
    );
  }

  return (
    <div className="authority-page">
      <div className="authority-header">
        <h1>Authority Portal</h1>
        <p className="authority-subtitle">{accessState.organisation?.name}</p>
      </div>

      {/* Stats cards */}
      <div className="authority-stats">
        <div className="authority-stat-card">
          <div className="authority-stat-value">{activePrograms}</div>
          <div className="authority-stat-label">Active Programs</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{totalBusinesses}</div>
          <div className="authority-stat-label">Businesses</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{completedEnrolments + submittedEnrolments}</div>
          <div className="authority-stat-label">Completed</div>
        </div>
      </div>

      {/* Cohort snapshot - rich visuals from latest program reports */}
      <CohortSnapshot
        maturity={cohortMaturity}
        categoryHeatmap={categoryHeatmap}
        recentActivity={recentActivity}
        hasReports={latestSnapshots.length > 0}
        programs={programs}
        filterProgramId={filterProgramId}
        setFilterProgramId={setFilterProgramId}
        programCount={programs.length}
      />


      {/* Charts section */}
      {childSummaries.length > 0 && (
        <div className="authority-charts">
          {/* Status breakdown */}
          <div className="authority-chart-card">
            <h3>Enrolment status</h3>
            <div className="authority-status-bar" role="img" aria-label="Enrolment status breakdown">
              {statusBreakdown.map(({ status, percent, color }) => (
                percent > 0 && (
                  <div
                    key={status}
                    className="authority-status-segment"
                    style={{ width: `${percent}%`, backgroundColor: color }}
                    title={`${STATUS_LABELS[status]}: ${percent}%`}
                  />
                )
              ))}
            </div>
            <div className="authority-status-legend">
              {statusBreakdown.map(({ status, count, label, color }) => (
                <div key={status} className="authority-legend-item">
                  <span className="authority-legend-dot" style={{ backgroundColor: color }} aria-hidden="true" />
                  <span>{label}: {count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enrolment timeline */}
          <div className="authority-chart-card">
            <h3>Enrolments (last 6 months)</h3>
            <div className="authority-timeline" role="img" aria-label="Monthly enrolment chart">
              {timeline.map(({ label, count }) => (
                <div key={label} className="authority-timeline-bar">
                  <div className="authority-timeline-fill" style={{ height: `${(count / timelineMax) * 100}%` }}>
                    {count > 0 && <span className="authority-timeline-count">{count}</span>}
                  </div>
                  <span className="authority-timeline-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Per-program progress */}
      {programProgress.length > 0 && (
        <div className="authority-section">
          <h2>Program progress</h2>
          <div className="authority-progress-list">
            {programProgress.map(({ program, total, completed, submitted, inProgress }) => {
              const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
              const submittedPct = total > 0 ? Math.round((submitted / total) * 100) : 0;
              const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
              return (
                <Link key={program.id} to={`/authority/programs/${program.id}`} className="authority-progress-item">
                  <div className="authority-progress-header">
                    <span className="authority-progress-name">{program.name}</span>
                    <span className="authority-progress-count">{completed}/{total} completed</span>
                  </div>
                  <div
                    className="authority-progress-bar"
                    role="progressbar"
                    aria-valuenow={completedPct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${program.name}: ${completedPct}% completed`}
                  >
                    <div className="authority-progress-fill completed" style={{ width: `${completedPct}%` }} />
                    <div className="authority-progress-fill submitted" style={{ width: `${submittedPct}%` }} />
                    <div className="authority-progress-fill in-progress" style={{ width: `${inProgressPct}%` }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Cohort narrative lists - detailed read, kept at the foot of the page */}
      {latestSnapshots.length > 0 && programs.length > 0 && (
        <CohortActionLists
          topPriorities={cohortTopPriorities}
          topStrengths={cohortTopStrengths}
          topAreasToExplore={cohortAreasToExplore}
        />
      )}

      {/* Quick links */}
      <div className="authority-quicklinks">
        <Link to="/authority/programs" className="authority-quicklink">
          <h3>Programs</h3>
          <p>Create and manage assessment programs for permits, grants and compliance.</p>
        </Link>
        <Link to="/authority/businesses" className="authority-quicklink">
          <h3>Businesses</h3>
          <p>View enrolled businesses and their assessment progress.</p>
        </Link>
        <Link to="/authority/guidance" className="authority-quicklink">
          <h3>Guidance Notes</h3>
          <p>Add local context and guidance to standard assessment questions.</p>
        </Link>
      </div>

      {programs.length === 0 && !isLoading && (
        <div className="authority-empty">
          <h2>Get started</h2>
          <p>Create your first program to start provisioning accessibility assessments to businesses.</p>
          <Link to="/authority/programs" className="btn btn-primary">Create a program</Link>
        </div>
      )}
    </div>
  );
}

// =====================================================
// Cohort Snapshot section
// =====================================================
interface CohortSnapshotProps {
  maturity: { strong: number; mixed: number; needsWork: number; total: number };
  categoryHeatmap: Array<{ category: string; strong: number; mixed: number; needsWork: number; total: number; moduleCount: number }>;
  recentActivity: { sevenDays: number; priorSeven: number; delta: number };
  hasReports: boolean;
  programs: AuthorityProgram[];
  filterProgramId: string;
  setFilterProgramId: (id: string) => void;
  programCount: number;
}

function CohortSnapshot({ maturity, categoryHeatmap, recentActivity, hasReports, programs, filterProgramId, setFilterProgramId, programCount }: CohortSnapshotProps) {
  if (programCount === 0) return null;

  if (!hasReports) {
    return (
      <section className="cohort-snapshot cohort-snapshot--empty">
        <h2>Cohort snapshot</h2>
        <p className="cohort-snapshot__empty-text">
          Generate a report for each active program to populate this section. Once you have
          reports saved, this snapshot surfaces cohort-wide maturity, the top priority actions
          showing up across businesses and the strengths worth celebrating.
        </p>
        <Link to="/authority/programs" className="btn btn-outline">Go to programs</Link>
      </section>
    );
  }

  const strongPct = maturity.total > 0 ? Math.round((maturity.strong / maturity.total) * 100) : 0;
  const deltaText = recentActivity.delta > 0
    ? `+${recentActivity.delta} vs prior week`
    : recentActivity.delta < 0
      ? `${recentActivity.delta} vs prior week`
      : 'same as prior week';

  const selectedProgram = programs.find(p => p.id === filterProgramId);

  return (
    <section className="cohort-snapshot">
      <div className="cohort-snapshot__head">
        <div>
          <h2>Cohort snapshot</h2>
          <p className="cohort-snapshot__intro">
            At-a-glance view of how the businesses you've enrolled are actually doing, drawn from the
            latest report for each program. More than completion: this captures the quality of what's
            been assessed.
          </p>
        </div>
        <div className="cohort-snapshot__controls">
          <label htmlFor="cohort-program-filter" className="cohort-snapshot__filter-label">View</label>
          <select
            id="cohort-program-filter"
            className="cohort-snapshot__filter"
            value={filterProgramId}
            onChange={(e) => setFilterProgramId(e.target.value)}
          >
            <option value="all">All programs ({programs.length})</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {selectedProgram && (
            <Link
              to={`/authority/programs/${selectedProgram.id}/report`}
              className="btn btn-outline btn-small"
            >
              Full report
            </Link>
          )}
        </div>
      </div>

      <div className="cohort-snapshot__grid">
        {/* Maturity donut */}
        <div className="cohort-card">
          <div className="cohort-card__header">
            <h3>Cohort maturity</h3>
            <span className="cohort-card__subtitle">Confidence band across all assessed modules</span>
          </div>
          <div className="cohort-donut-wrap">
            <MaturityDonut strong={maturity.strong} mixed={maturity.mixed} needsWork={maturity.needsWork} />
            <div className="cohort-donut-center">
              <div className="cohort-donut-value">{strongPct}%</div>
              <div className="cohort-donut-label">Strong</div>
            </div>
          </div>
          <div className="cohort-donut-legend">
            <span><span className="dot dot--green" /> Strong: {maturity.strong}</span>
            <span><span className="dot dot--amber" /> Mixed: {maturity.mixed}</span>
            <span><span className="dot dot--red" /> Needs work: {maturity.needsWork}</span>
          </div>
        </div>

        {/* Recent activity */}
        <div className="cohort-card">
          <div className="cohort-card__header">
            <h3>This week</h3>
            <span className="cohort-card__subtitle">Enrolments in the last 7 days</span>
          </div>
          <div className="cohort-bignum">
            <span className="cohort-bignum__value">{recentActivity.sevenDays}</span>
            <span className="cohort-bignum__label">new business{recentActivity.sevenDays !== 1 ? 'es' : ''}</span>
          </div>
          <div className={`cohort-delta cohort-delta--${recentActivity.delta > 0 ? 'up' : recentActivity.delta < 0 ? 'down' : 'flat'}`}>
            {deltaText}
          </div>
        </div>

        {/* Category heatmap - the visual companion to the maturity donut */}
        {categoryHeatmap.length > 0 && (
          <div className="cohort-card cohort-card--span2">
            <div className="cohort-card__header">
              <h3>Maturity by access category</h3>
              <span className="cohort-card__subtitle">
                Confidence grouped by area of access. Wider green = cohort is genuinely doing well.
                Wider red = needs collective attention.
              </span>
            </div>
            <ModuleHeatmap rows={categoryHeatmap} />
          </div>
        )}

      </div>
    </section>
  );
}

// The narrative cohort lists live at the foot of the dashboard: the visual
// snapshot up top reads at a glance, these detailed reads come last.
interface CohortActionListsProps {
  topPriorities: Array<{ action: string; count: number; priority?: string; programIds: string[] }>;
  topStrengths: Array<{ text: string; count: number }>;
  topAreasToExplore: Array<{ text: string; count: number }>;
}

function CohortActionLists({ topPriorities, topStrengths, topAreasToExplore }: CohortActionListsProps) {
  return (
    <section className="cohort-snapshot">
      <div className="cohort-snapshot__grid">
        {/* Top priorities */}
        <div className="cohort-card cohort-card--span2">
          <div className="cohort-card__header">
            <h3>Top priorities across the cohort</h3>
            <span className="cohort-card__subtitle">Actions appearing in the most business assessments. Worth tackling as a group.</span>
          </div>
          {topPriorities.length > 0 ? (
            <ol className="cohort-list cohort-list--priority">
              {topPriorities.map((p, i) => (
                <li key={i}>
                  <span className="cohort-list__rank">{i + 1}</span>
                  <span className="cohort-list__text">{p.action}</span>
                  <span className="cohort-list__count">{p.count}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="cohort-card__empty">No priority actions captured yet.</p>
          )}
        </div>

        {/* Top strengths */}
        <div className="cohort-card cohort-card--span2">
          <div className="cohort-card__header">
            <h3>Strengths worth celebrating</h3>
            <span className="cohort-card__subtitle">Practices already in place across multiple businesses.</span>
          </div>
          {topStrengths.length > 0 ? (
            <ol className="cohort-list cohort-list--strength">
              {topStrengths.map((s, i) => (
                <li key={i}>
                  <span className="cohort-list__rank cohort-list__rank--green">{i + 1}</span>
                  <span className="cohort-list__text">{s.text}</span>
                  <span className="cohort-list__count">{s.count}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="cohort-card__empty">No strengths captured yet.</p>
          )}
        </div>

        {/* Top areas to explore */}
        {topAreasToExplore.length > 0 && (
          <div className="cohort-card cohort-card--span2">
            <div className="cohort-card__header">
              <h3>Areas to explore</h3>
              <span className="cohort-card__subtitle">
                Topics businesses flagged as "unable to check" or "unsure". Often signal the
                cohort needs clearer guidance, training or sector-wide support.
              </span>
            </div>
            <ol className="cohort-list cohort-list--explore">
              {topAreasToExplore.map((a, i) => (
                <li key={i}>
                  <span className="cohort-list__rank cohort-list__rank--amber">{i + 1}</span>
                  <span className="cohort-list__text">{a.text}</span>
                  <span className="cohort-list__count">{a.count}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  );
}

function ModuleHeatmap({ rows }: { rows: Array<{ category: string; strong: number; mixed: number; needsWork: number; total: number; moduleCount: number }> }) {
  return (
    <div className="cohort-heatmap" role="table" aria-label="Confidence heatmap by access category">
      <div className="cohort-heatmap__legend" aria-hidden="true">
        <span><span className="dot dot--green" /> Strong</span>
        <span><span className="dot dot--amber" /> Mixed</span>
        <span><span className="dot dot--red" /> Needs work</span>
      </div>
      {rows.map(r => {
        const strongPct = r.total > 0 ? (r.strong / r.total) * 100 : 0;
        const mixedPct = r.total > 0 ? (r.mixed / r.total) * 100 : 0;
        const needsWorkPct = r.total > 0 ? (r.needsWork / r.total) * 100 : 0;
        return (
          <div key={r.category} className="cohort-heatmap__row" role="row">
            <div className="cohort-heatmap__label" role="rowheader">
              {r.category}
            </div>
            <div
              className="cohort-heatmap__bar"
              role="cell"
              aria-label={`Strong ${r.strong}, Mixed ${r.mixed}, Needs work ${r.needsWork}`}
            >
              {strongPct > 0 && (
                <div
                  className="cohort-heatmap__seg cohort-heatmap__seg--strong"
                  style={{ width: `${strongPct}%` }}
                  title={`Strong: ${r.strong}`}
                >
                  {strongPct >= 12 && <span>{r.strong}</span>}
                </div>
              )}
              {mixedPct > 0 && (
                <div
                  className="cohort-heatmap__seg cohort-heatmap__seg--mixed"
                  style={{ width: `${mixedPct}%` }}
                  title={`Mixed: ${r.mixed}`}
                >
                  {mixedPct >= 12 && <span>{r.mixed}</span>}
                </div>
              )}
              {needsWorkPct > 0 && (
                <div
                  className="cohort-heatmap__seg cohort-heatmap__seg--needs"
                  style={{ width: `${needsWorkPct}%` }}
                  title={`Needs work: ${r.needsWork}`}
                >
                  {needsWorkPct >= 12 && <span>{r.needsWork}</span>}
                </div>
              )}
            </div>
            <div className="cohort-heatmap__count">{r.total}</div>
          </div>
        );
      })}
    </div>
  );
}

function MaturityDonut({ strong, mixed, needsWork }: { strong: number; mixed: number; needsWork: number }) {
  const total = strong + mixed + needsWork;
  const radius = 70;
  const cx = 100, cy = 100;
  const strokeWidth = 22;
  const c = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" aria-label="No maturity data yet">
        <circle cx={cx} cy={cy} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
      </svg>
    );
  }

  const strongPct = strong / total;
  const mixedPct = mixed / total;
  const needsWorkPct = needsWork / total;
  const strongLen = strongPct * c;
  const mixedLen = mixedPct * c;
  const needsWorkLen = needsWorkPct * c;

  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      role="img"
      aria-label={`Cohort maturity. Strong: ${strong}, Mixed: ${mixed}, Needs work: ${needsWork}`}
    >
      <circle cx={cx} cy={cy} r={radius} stroke="#f1ecf5" strokeWidth={strokeWidth} fill="none" />
      <g transform={`rotate(-90 ${cx} ${cy})`}>
        {strongLen > 0 && (
          <circle
            cx={cx} cy={cy} r={radius}
            stroke="#86EFAC" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${strongLen} ${c - strongLen}`}
            strokeDashoffset={0}
            strokeLinecap="butt"
          />
        )}
        {mixedLen > 0 && (
          <circle
            cx={cx} cy={cy} r={radius}
            stroke="#FCD34D" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${mixedLen} ${c - mixedLen}`}
            strokeDashoffset={-strongLen}
            strokeLinecap="butt"
          />
        )}
        {needsWorkLen > 0 && (
          <circle
            cx={cx} cy={cy} r={radius}
            stroke="#FCA5A5" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={`${needsWorkLen} ${c - needsWorkLen}`}
            strokeDashoffset={-(strongLen + mixedLen)}
            strokeLinecap="butt"
          />
        )}
      </g>
    </svg>
  );
}
