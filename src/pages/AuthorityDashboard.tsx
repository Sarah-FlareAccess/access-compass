import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
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
          <div className="authority-stat-value">{submittedEnrolments}</div>
          <div className="authority-stat-label">Submitted</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{completedEnrolments}</div>
          <div className="authority-stat-label">Completed</div>
        </div>
      </div>

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

      {/* Quick links */}
      <div className="authority-quicklinks">
        <Link to="/authority/programs" className="authority-quicklink">
          <h3>Programs</h3>
          <p>Create and manage assessment programs for permits, grants, and compliance.</p>
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
