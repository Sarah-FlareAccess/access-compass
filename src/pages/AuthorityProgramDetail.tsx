import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [, setEnrolments] = useState<ProgramEnrolment[]>([]);
  const [summaries, setSummaries] = useState<ChildOrgSummary[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrgName, setInviteOrgName] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<{ success: number; failed: string[] } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

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

  const handleCsvUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id) return;

    setCsvUploading(true);
    setCsvResult(null);

    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(line => line.trim());

    // Skip header if it looks like one
    const firstLine = lines[0]?.toLowerCase() || '';
    const startIndex = (firstLine.includes('business') || firstLine.includes('name') || firstLine.includes('email')) ? 1 : 0;

    let success = 0;
    const failed: string[] = [];

    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      const name = parts[0];
      const email = parts[1] || undefined;

      if (!name) continue;

      const result = await enrolBusiness(id, name, email);
      if (result) {
        setEnrolments(prev => [...prev, result]);
        success++;
      } else {
        failed.push(name);
      }
    }

    setCsvResult({ success, failed });
    setCsvUploading(false);

    // Refresh summaries
    if (orgId) {
      getChildOrgSummaries(orgId).then(s => {
        setSummaries(s.filter(summary => summary.program_id === id));
      });
    }

    // Reset file input
    if (csvInputRef.current) csvInputRef.current.value = '';
  }, [id, orgId, enrolBusiness, getChildOrgSummaries]);

  if (!program && !isLoading) {
    return (
      <div className="authority-page">
        <Link to="/authority/programs" className="authority-back-link">Programs</Link>
        <p>Program not found.</p>
      </div>
    );
  }

  if (!program) return null;

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

      {/* CSV bulk upload */}
      {program.is_active && (
        <div className="authority-form-card">
          <h2>Bulk enrol from CSV</h2>
          <p className="authority-subtitle">
            Upload a CSV file with columns: business name, contact email (optional).
            One business per row.
          </p>
          <div className="authority-enrol-row">
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,.txt"
              onChange={handleCsvUpload}
              disabled={csvUploading}
              aria-label="Upload CSV file for bulk enrolment"
            />
            {csvUploading && <span>Enrolling businesses...</span>}
          </div>
          {csvResult && (
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ color: 'var(--deep-plum, #490E67)', fontWeight: 600 }}>
                {csvResult.success} business{csvResult.success !== 1 ? 'es' : ''} enrolled successfully.
              </p>
              {csvResult.failed.length > 0 && (
                <p style={{ color: 'var(--coral-flare, #ea0b3f)', fontSize: '0.875rem' }}>
                  Failed: {csvResult.failed.join(', ')}
                </p>
              )}
            </div>
          )}
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
