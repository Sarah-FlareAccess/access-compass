import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import '../styles/authority.css';

import type { AuthorityProgram, ProgramEnrolment, ChildOrgSummary } from '../types/access';

export default function AuthorityProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getProgram, getEnrolments, getChildOrgSummaries, enrolBusiness, isLoading } = useAuthorityAdmin();

  const [program, setProgram] = useState<AuthorityProgram | null>(null);
  const [enrolments, setEnrolments] = useState<ProgramEnrolment[]>([]);
  const [summaries, setSummaries] = useState<ChildOrgSummary[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrgName, setInviteOrgName] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  usePageTitle(program?.name || 'Program Detail');

  useEffect(() => {
    if (!id || !orgId) return;
    getProgram(id).then(setProgram);
    getEnrolments(id).then(setEnrolments);
    getChildOrgSummaries(orgId).then(s => {
      setSummaries(s.filter(summary => summary.program_id === id));
    });
  }, [id, orgId]);

  const handleEnrol = async () => {
    if (!id || !inviteOrgName.trim()) return;
    setEnrolling(true);
    const result = await enrolBusiness(id, inviteOrgName.trim(), inviteEmail.trim() || undefined);
    if (result) {
      setEnrolments(prev => [...prev, result]);
      setInviteOrgName('');
      setInviteEmail('');
    }
    setEnrolling(false);
  };

  if (!program && !isLoading) {
    return (
      <div className="authority-page">
        <Link to="/authority/programs" className="authority-back-link">Programs</Link>
        <p>Program not found.</p>
      </div>
    );
  }

  if (!program) return null;

  const enrolled = summaries.filter(s => s.enrolment_status === 'enrolled' || s.enrolment_status === 'in_progress');
  const completed = summaries.filter(s => s.enrolment_status === 'completed');
  const submitted = summaries.filter(s => s.enrolment_status === 'submitted');

  return (
    <div className="authority-page">
      <div className="authority-header">
        <div>
          <Link to="/authority/programs" className="authority-back-link">Programs</Link>
          <h1>{program.name}</h1>
          {program.description && <p className="authority-subtitle">{program.description}</p>}
        </div>
        <span className={`authority-program-status ${program.is_active ? 'active' : 'inactive'}`}>
          {program.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>

      {/* Program stats */}
      <div className="authority-stats">
        <div className="authority-stat-card">
          <div className="authority-stat-value">{program.required_module_ids.length}</div>
          <div className="authority-stat-label">Modules</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{summaries.length}</div>
          <div className="authority-stat-label">Enrolled</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{submitted.length}</div>
          <div className="authority-stat-label">Submitted</div>
        </div>
        <div className="authority-stat-card">
          <div className="authority-stat-value">{completed.length}</div>
          <div className="authority-stat-label">Completed</div>
        </div>
      </div>

      <div className="authority-program-meta">
        <span>{program.access_level === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</span>
        <span>Modules: {program.required_module_ids.join(', ')}</span>
        <span>{program.funding_model === 'authority_funded' ? 'Authority-funded' : program.funding_model === 'business_funded' ? 'Business-funded' : 'Co-funded'}</span>
        {program.license_price_cents != null && program.license_price_cents > 0 && (
          <span>${(program.license_price_cents / 100).toFixed(0)}/business</span>
        )}
      </div>

      {/* Shareable enrolment link */}
      {program.allow_self_enrol && program.is_active && (
        <div className="authority-form-card">
          <h2>Enrolment link</h2>
          <p className="authority-subtitle">Share this link with businesses to let them self-enrol in this program.</p>
          <div className="authority-enrol-row">
            <div className="authority-form-group">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/enrol/${program.slug}`}
                onFocus={e => e.target.select()}
              />
            </div>
            <button
              className="btn btn-outline"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/enrol/${program.slug}`);
              }}
            >
              Copy link
            </button>
          </div>
        </div>
      )}

      {/* Enrol a business */}
      {program.is_active && (
        <div className="authority-form-card">
          <h2>Enrol a business</h2>
          <div className="authority-enrol-row">
            <div className="authority-form-group">
              <label htmlFor="enrol-org">Business name</label>
              <input
                id="enrol-org"
                type="text"
                value={inviteOrgName}
                onChange={e => setInviteOrgName(e.target.value)}
                placeholder="e.g. Sunrise Cafe"
              />
            </div>
            <div className="authority-form-group">
              <label htmlFor="enrol-email">Contact email (optional)</label>
              <input
                id="enrol-email"
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="owner@business.com"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleEnrol}
              disabled={enrolling || !inviteOrgName.trim()}
            >
              {enrolling ? 'Enrolling...' : 'Enrol'}
            </button>
          </div>
        </div>
      )}

      {/* Enrolled businesses */}
      <div className="authority-section">
        <h2>Enrolled Businesses</h2>
        {summaries.length === 0 ? (
          <p className="authority-empty-text">No businesses enrolled yet.</p>
        ) : (
          <div className="authority-business-list">
            <div className="authority-business-header">
              <span>Business</span>
              <span>Status</span>
              <span>Enrolled</span>
              <span>Completed</span>
            </div>
            {summaries.map(summary => (
              <div key={summary.child_org_id} className="authority-business-row">
                <span className="authority-business-name">{summary.child_org_name}</span>
                <span className={`authority-enrolment-status ${summary.enrolment_status || 'enrolled'}`}>
                  {summary.enrolment_status || 'Enrolled'}
                </span>
                <span>{summary.enrolled_at ? new Date(summary.enrolled_at).toLocaleDateString('en-AU') : '-'}</span>
                <span>{summary.completed_at ? new Date(summary.completed_at).toLocaleDateString('en-AU') : '-'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
