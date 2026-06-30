import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import { ModuleDetailModal } from '../components/discovery/ModuleDetailModal';
import { supabaseRest } from '../utils/supabase';
import { accessModules, moduleGroups } from '../data/accessModules';
import '../styles/authority.css';

import type { AuthorityProgram, ProgramEnrolment, ChildOrgSummary } from '../types/access';

interface CarryoverDeclaration {
  id: string;
  organisation_id: string;
  module_id: string;
  original_completed_at: string;
  declared_at: string;
  expires_at: string;
}

// Being in the table means the business is already enrolled, so the
// 'enrolled' status maps to "Not started" (signed up, hasn't begun).
function formatEnrolmentStatus(status: string | null | undefined): string {
  switch (status) {
    case 'in_progress':
    case 'in-progress':
      return 'In progress';
    case 'submitted':
      return 'Submitted';
    case 'completed':
      return 'Completed';
    case 'withdrawn':
      return 'Withdrawn';
    case 'enrolled':
    case null:
    case undefined:
    default:
      return 'Not started';
  }
}

export default function AuthorityProgramDetail() {
  const { id } = useParams<{ id: string }>();
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getProgram, getEnrolments, getChildOrgSummaries, enrolBusiness, updateProgram, isLoading } = useAuthorityAdmin();

  const [program, setProgram] = useState<AuthorityProgram | null>(null);
  const [, setEnrolments] = useState<ProgramEnrolment[]>([]);
  const [summaries, setSummaries] = useState<ChildOrgSummary[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteOrgName, setInviteOrgName] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvResult, setCsvResult] = useState<{ success: number; failed: string[] } | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [carryovers, setCarryovers] = useState<CarryoverDeclaration[]>([]);
  const [expandedBusiness, setExpandedBusiness] = useState<string | null>(null);
  const [editingModules, setEditingModules] = useState(false);
  const [editedModuleIds, setEditedModuleIds] = useState<string[]>([]);
  const [savingModules, setSavingModules] = useState(false);
  const [moduleSaveError, setModuleSaveError] = useState<string | null>(null);
  const [detailModuleId, setDetailModuleId] = useState<string | null>(null);

  usePageTitle(program?.name || 'Program Detail');

  // Store orgId in ref so it survives accessState resets
  const orgIdRef = useRef(orgId);
  if (orgId) orgIdRef.current = orgId;
  const effectiveOrgId = orgId || orgIdRef.current;

  useEffect(() => {
    if (!id || !effectiveOrgId) return;
    getProgram(id).then(p => { if (p) setProgram(p); });
    getEnrolments(id).then(e => { if (e.length > 0) setEnrolments(e); });
    getChildOrgSummaries(effectiveOrgId).then(s => {
      const filtered = s.filter(summary => summary.program_id === id);
      if (filtered.length > 0) setSummaries(filtered);
    });
    // Fetch carryover declarations for this program
    supabaseRest.query('module_carryover_declarations', '*', { program_id: id }).then(({ data }) => {
      if (data) setCarryovers(data as CarryoverDeclaration[]);
    });
  }, [id, orgId]);

  const handleStartEditModules = () => {
    if (!program) return;
    setEditedModuleIds([...program.required_module_ids]);
    setModuleSaveError(null);
    setEditingModules(true);
  };

  const handleCancelEditModules = () => {
    setEditingModules(false);
    setEditedModuleIds([]);
    setModuleSaveError(null);
  };

  const toggleEditModule = (moduleId: string) => {
    setEditedModuleIds(prev =>
      prev.includes(moduleId) ? prev.filter(mid => mid !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSaveModules = async () => {
    if (!program || editedModuleIds.length === 0) return;
    setSavingModules(true);
    setModuleSaveError(null);
    const updated = await updateProgram(program.id, { required_module_ids: editedModuleIds });
    setSavingModules(false);
    if (updated) {
      setProgram({ ...program, required_module_ids: editedModuleIds });
      setEditingModules(false);
      setEditedModuleIds([]);
    } else {
      setModuleSaveError('Could not save module changes. Please try again.');
    }
  };

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
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link
            to={`/authority/programs/${program.id}/report`}
            className="btn btn-outline"
          >
            Reports
          </Link>
          <span className={`authority-program-status ${program.is_active ? 'active' : 'inactive'}`}>
            {program.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
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
        <span>{program.funding_model === 'authority_funded' ? 'Authority-funded' : program.funding_model === 'business_funded' ? 'Business-funded' : 'Co-funded'}</span>
        {program.license_price_cents != null && program.license_price_cents > 0 && (
          <span>${(program.license_price_cents / 100).toFixed(0)}/business</span>
        )}
      </div>

      {/* Modules section with edit */}
      <div className="authority-form-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>Modules ({program.required_module_ids.length})</h2>
          {!editingModules && (
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={handleStartEditModules}
            >
              Edit modules
            </button>
          )}
        </div>

        {!editingModules && (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '0.375rem 1.25rem',
            }}
          >
            {program.required_module_ids.map(mid => {
              const mod = accessModules.find(m => m.id === mid);
              return (
                <li
                  key={mid}
                  style={{
                    padding: '0.25rem 0',
                    fontSize: '0.9375rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={mod?.name || mid}
                >
                  <strong style={{ color: 'var(--amethyst-diamond, #490E67)', marginRight: '0.25rem' }}>{mid}</strong>
                  {mod?.name || '(module not found)'}
                </li>
              );
            })}
          </ul>
        )}

        {editingModules && (
          <>
            {summaries.length > 0 && (
              <p
                role="status"
                style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: '4px',
                  padding: '0.75rem',
                  fontSize: '0.875rem',
                  marginBottom: '1rem',
                  color: '#92400E',
                }}
              >
                This program has {summaries.length} enrolled business{summaries.length !== 1 ? 'es' : ''}. Removing modules will not delete existing responses, but those modules will no longer appear in their assessment.
              </p>
            )}
            <p className="authority-form-hint">
              {editedModuleIds.length} selected. Update the modules businesses will be assessed on.
            </p>
            <div className="authority-module-grid">
              {moduleGroups.map(group => {
                const groupModules = accessModules.filter(m => m.group === group.id);
                return (
                  <div key={group.id} className="authority-module-group">
                    <h4>{group.label}</h4>
                    {groupModules.map(mod => (
                      <div key={mod.id} className="authority-module-row">
                        <label className="authority-module-checkbox">
                          <input
                            type="checkbox"
                            checked={editedModuleIds.includes(mod.id)}
                            onChange={() => toggleEditModule(mod.id)}
                          />
                          <span>{mod.id} {mod.name}</span>
                        </label>
                        <button
                          type="button"
                          className="authority-module-info-btn"
                          onClick={() => setDetailModuleId(mod.id)}
                          aria-label={`More info about ${mod.name}`}
                        >
                          ?
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
            {moduleSaveError && (
              <p style={{ color: 'var(--coral-flare, #ea0b3f)', fontSize: '0.875rem', marginTop: '0.75rem' }}>{moduleSaveError}</p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveModules}
                disabled={savingModules || editedModuleIds.length === 0}
              >
                {savingModules ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancelEditModules}
                disabled={savingModules}
              >
                Cancel
              </button>
            </div>
          </>
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
              <span>Assessment</span>
            </div>
            {summaries.map(summary => {
              const bizCarryovers = carryovers.filter(c => c.organisation_id === summary.child_org_id);
              const hasCarryovers = bizCarryovers.length > 0;
              const isExpanded = expandedBusiness === summary.child_org_id;

              return (
                <div key={summary.child_org_id}>
                  <div
                    className="authority-business-row"
                    style={{ cursor: hasCarryovers ? 'pointer' : undefined }}
                    onClick={() => hasCarryovers && setExpandedBusiness(isExpanded ? null : summary.child_org_id)}
                  >
                    <span className="authority-business-name">
                      {summary.child_org_name}
                      {hasCarryovers && (
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', verticalAlign: 'middle' }}>
                          {isExpanded ? '▾' : '▸'}
                        </span>
                      )}
                    </span>
                    <span className={`authority-enrolment-status ${summary.enrolment_status || 'enrolled'}`}>
                      {formatEnrolmentStatus(summary.enrolment_status)}
                    </span>
                    <span>{summary.enrolled_at ? new Date(summary.enrolled_at).toLocaleDateString('en-AU') : '-'}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
                      {hasCarryovers ? (
                        <span style={{
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(251, 191, 36, 0.1)',
                          color: '#92400E',
                          border: '1px solid rgba(251, 191, 36, 0.2)',
                        }}>
                          {bizCarryovers.length} carried forward
                        </span>
                      ) : (
                        <>
                          <span style={{
                            fontSize: '0.6875rem',
                            fontWeight: 600,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: 'rgba(22, 163, 74, 0.08)',
                            color: '#14532d',
                            border: '1px solid rgba(22, 163, 74, 0.15)',
                          }}>
                            New assessment
                          </span>
                          <button
                            type="button"
                            aria-label="What does New assessment mean?"
                            title="This business is starting fresh. No modules have been carried forward from a previous program cycle (within the last 6 months) so they are answering every module from scratch."
                            style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: '1px solid rgba(73, 14, 103, 0.25)',
                              background: 'transparent',
                              color: 'var(--amethyst-diamond, #490E67)',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              lineHeight: 1,
                              cursor: 'help',
                              padding: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            ?
                          </button>
                        </>
                      )}
                    </span>
                  </div>
                  {isExpanded && hasCarryovers && (
                    <div style={{
                      padding: '0.75rem 1rem 0.75rem 2rem',
                      background: 'rgba(251, 191, 36, 0.04)',
                      borderBottom: '1px solid rgba(62, 43, 47, 0.05)',
                      fontSize: '0.8125rem',
                    }}>
                      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        Modules carried forward (declared no changes):
                      </div>
                      {bizCarryovers.map(c => {
                        const mod = accessModules.find(m => m.id === c.module_id);
                        const expired = new Date(c.expires_at) < new Date();
                        return (
                          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', color: 'var(--text-secondary, #5C4A4E)' }}>
                            <span>{c.module_id} {mod?.name || c.module_id}</span>
                            <span style={{ fontSize: '0.75rem' }}>
                              Originally completed {new Date(c.original_completed_at).toLocaleDateString('en-AU')}
                              {expired && (
                                <span style={{ color: '#DC2626', fontWeight: 600, marginLeft: '0.5rem' }}>Expired</span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                        Declared on {new Date(bizCarryovers[0].declared_at).toLocaleDateString('en-AU')}. Valid for 6 months from original completion.
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Module detail popup */}
      {detailModuleId && (
        <ModuleDetailModal
          moduleId={detailModuleId}
          isSelected={editedModuleIds.includes(detailModuleId)}
          onClose={() => setDetailModuleId(null)}
          onToggleSelect={toggleEditModule}
          accessLevel={program.access_level}
        />
      )}
    </div>
  );
}
