import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import '../styles/authority.css';

import type { AuthorityProgram, ChildOrgSummary } from '../types/access';

export default function AuthorityDashboard() {
  usePageTitle('Authority Portal');
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getPrograms, getChildOrgSummaries, isLoading } = useAuthorityAdmin();

  const [programs, setPrograms] = useState<AuthorityProgram[]>([]);
  const [childSummaries, setChildSummaries] = useState<ChildOrgSummary[]>([]);

  useEffect(() => {
    if (!orgId) return;
    Promise.all([
      getPrograms(orgId),
      getChildOrgSummaries(orgId),
    ]).then(([progs, summaries]) => {
      setPrograms(progs);
      setChildSummaries(summaries);
    });
  }, [orgId]);

  const totalBusinesses = new Set(childSummaries.map(s => s.child_org_id)).size;
  const completedEnrolments = childSummaries.filter(s => s.enrolment_status === 'completed').length;
  const activePrograms = programs.filter(p => p.is_active).length;

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
          <div className="authority-stat-value">{completedEnrolments}</div>
          <div className="authority-stat-label">Assessments Completed</div>
        </div>
      </div>

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

      {/* Recent program activity */}
      {programs.length > 0 && (
        <div className="authority-section">
          <h2>Your Programs</h2>
          <div className="authority-program-list">
            {programs.map(program => {
              const enrolments = childSummaries.filter(s => s.program_id === program.id);
              const completed = enrolments.filter(s => s.enrolment_status === 'completed').length;
              return (
                <Link key={program.id} to={`/authority/programs/${program.id}`} className="authority-program-card">
                  <div className="authority-program-card-header">
                    <h3>{program.name}</h3>
                    <span className={`authority-program-status ${program.is_active ? 'active' : 'inactive'}`}>
                      {program.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {program.description && <p>{program.description}</p>}
                  <div className="authority-program-meta">
                    <span>{program.access_level === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</span>
                    <span>{program.required_module_ids.length} modules</span>
                    <span>{enrolments.length} enrolled</span>
                    <span>{completed} completed</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

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
