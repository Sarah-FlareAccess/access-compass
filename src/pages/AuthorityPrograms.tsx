import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuthorityAdmin } from '../hooks/useAuthorityAdmin';
import { ModuleDetailModal } from '../components/discovery/ModuleDetailModal';
import { accessModules, moduleGroups } from '../data/accessModules';
import '../styles/authority.css';

import type { AuthorityProgram, AccessLevel, FundingModel } from '../types/access';

export default function AuthorityPrograms() {
  usePageTitle('Programs');
  const { accessState } = useAuth();
  const orgId = accessState.organisation?.id;
  const { getPrograms, createProgram, updateProgram, isLoading } = useAuthorityAdmin();

  const [programs, setPrograms] = useState<AuthorityProgram[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAccessLevel, setNewAccessLevel] = useState<AccessLevel>('pulse');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [allowSelfEnrol, setAllowSelfEnrol] = useState(false);
  const [fundingModel, setFundingModel] = useState<FundingModel>('authority_funded');
  const [licensePrice, setLicensePrice] = useState('');
  const [enrolMessage, setEnrolMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [detailModuleId, setDetailModuleId] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId) return;
    getPrograms(orgId).then(setPrograms);
  }, [orgId]);

  const handleCreate = async () => {
    if (!orgId || !newName.trim() || selectedModules.length === 0) return;
    setSaving(true);
    setCreateError(null);
    const slug = newName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let priceCents: number | undefined;
    if (fundingModel === 'business_funded') {
      priceCents = newAccessLevel === 'pulse' ? 9900 : 34900;
    } else if (fundingModel === 'co_funded' && licensePrice) {
      priceCents = Math.round(parseFloat(licensePrice) * 100);
    }
    const program = await createProgram({
      organisation_id: orgId,
      name: newName.trim(),
      slug,
      description: newDescription.trim() || undefined,
      required_module_ids: selectedModules,
      access_level: newAccessLevel,
      allow_self_enrol: allowSelfEnrol,
      funding_model: fundingModel,
      license_price_cents: priceCents,
      enrol_message: enrolMessage.trim() || undefined,
    });
    if (program) {
      setPrograms(prev => [...prev, program]);
      setShowCreate(false);
      setNewName('');
      setNewDescription('');
      setSelectedModules([]);
      setNewAccessLevel('pulse');
      setAllowSelfEnrol(false);
      setFundingModel('authority_funded');
      setLicensePrice('');
      setEnrolMessage('');
    } else {
      setCreateError('Could not create program. Make sure the authority database tables have been set up (run migration 015_authority_orgs.sql).');
    }
    setSaving(false);
  };

  const toggleModule = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleToggleActive = async (program: AuthorityProgram) => {
    const updated = await updateProgram(program.id, { is_active: !program.is_active });
    if (updated) {
      setPrograms(prev => prev.map(p => p.id === program.id ? { ...p, is_active: !p.is_active } : p));
    }
  };

  if (!orgId) return null;

  return (
    <div className="authority-page">
      <Link to="/authority" className="authority-back-link">Authority Portal</Link>
      <div className="authority-header">
        <h1>Programs</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(!showCreate)}
        >
          {showCreate ? 'Cancel' : 'New Program'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="authority-form-card">
          <h2>Create Program</h2>
          <div className="authority-form-group">
            <label htmlFor="program-name">Program name</label>
            <input
              id="program-name"
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="e.g. Event Permit 2026, Tourism Grant Round 3"
            />
          </div>
          <div className="authority-form-group">
            <label htmlFor="program-desc">Description (optional)</label>
            <textarea
              id="program-desc"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="What is this program for?"
              rows={2}
            />
          </div>
          <div className="authority-form-group">
            <label htmlFor="access-level">Assessment depth</label>
            <select id="access-level" value={newAccessLevel} onChange={e => setNewAccessLevel(e.target.value as AccessLevel)}>
              <option value="pulse">Pulse Check</option>
              <option value="deep_dive">Deep Dive</option>
            </select>
            <p className="authority-form-hint">
              {newAccessLevel === 'pulse'
                ? 'Pulse Check: Key questions per module for a quick baseline. Identifies biggest gaps.'
                : 'Deep Dive: All questions per module. Comprehensive compliance and best-practice coverage.'}
            </p>
          </div>
          <div className="authority-form-group">
            <label>Required modules</label>
            <p className="authority-form-hint">{selectedModules.length} selected. Select the modules businesses will be assessed on.</p>
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
                            checked={selectedModules.includes(mod.id)}
                            onChange={() => toggleModule(mod.id)}
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
          </div>
          <div className="authority-form-group">
            <label className="authority-toggle-checkbox">
              <input
                type="checkbox"
                checked={allowSelfEnrol}
                onChange={e => setAllowSelfEnrol(e.target.checked)}
              />
              <span className="authority-toggle-label">Allow businesses to self-enrol via link</span>
              <span className="authority-toggle-hint">Generates a shareable URL businesses can use to enrol themselves</span>
            </label>
          </div>
          <div className="authority-form-group">
            <label htmlFor="funding-model">Who pays for business licenses?</label>
            <select id="funding-model" value={fundingModel} onChange={e => setFundingModel(e.target.value as FundingModel)}>
              <option value="authority_funded">Authority-funded (no cost to business)</option>
              <option value="business_funded">Business-funded (business pays at enrolment)</option>
              <option value="co_funded">Co-funded (reduced rate for business)</option>
            </select>
          </div>
          {fundingModel === 'business_funded' && (
            <div className="authority-form-group">
              <label htmlFor="license-price">License price per business (AUD)</label>
              <input
                id="license-price"
                type="text"
                readOnly
                value={newAccessLevel === 'pulse' ? '$99' : '$349'}
              />
              <p className="authority-form-hint">Set by your plan. Pulse Check: $99, Deep Dive cohort: $349.</p>
            </div>
          )}
          {fundingModel === 'co_funded' && (
            <div className="authority-form-group">
              <label htmlFor="license-price">Subsidised price per business (AUD)</label>
              <input
                id="license-price"
                type="number"
                min="0"
                step="1"
                value={licensePrice}
                onChange={e => setLicensePrice(e.target.value)}
                placeholder={newAccessLevel === 'pulse' ? 'Standard rate: $99' : 'Standard rate: $349'}
              />
              <p className="authority-form-hint">Set a reduced rate. Your organisation covers the difference.</p>
            </div>
          )}
          {allowSelfEnrol && (
            <div className="authority-form-group">
              <label htmlFor="enrol-message">Enrolment page message (optional)</label>
              <textarea
                id="enrol-message"
                value={enrolMessage}
                onChange={e => setEnrolMessage(e.target.value)}
                placeholder="e.g. City of Melbourne requires this accessibility assessment as part of your event permit application."
                rows={2}
              />
            </div>
          )}
          {createError && (
            <p style={{ color: 'var(--coral-flare, #ea0b3f)', fontSize: '0.875rem', marginBottom: '1rem' }}>{createError}</p>
          )}
          <button
            className="btn btn-primary"
            onClick={handleCreate}
            disabled={saving || !newName.trim() || selectedModules.length === 0}
          >
            {saving ? 'Creating...' : 'Create Program'}
          </button>
        </div>
      )}

      {/* Program list */}
      <div className="authority-program-list">
        {programs.map(program => (
          <div key={program.id} className="authority-program-card">
            <div className="authority-program-card-header">
              <Link to={`/authority/programs/${program.id}`}>
                <h3>{program.name}</h3>
              </Link>
              <div className="authority-program-actions">
                <button
                  className={`btn btn-small ${program.is_active ? 'btn-outline' : 'btn-primary'}`}
                  onClick={() => handleToggleActive(program)}
                >
                  {program.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
            {program.description && <p>{program.description}</p>}
            <div className="authority-program-meta">
              <span className={`authority-program-status ${program.is_active ? 'active' : 'inactive'}`}>
                {program.is_active ? 'Active' : 'Inactive'}
              </span>
              <span>{program.access_level === 'pulse' ? 'Pulse Check' : 'Deep Dive'}</span>
              <span>{program.required_module_ids.length} modules</span>
            </div>
          </div>
        ))}
        {programs.length === 0 && !isLoading && (
          <p className="authority-empty-text">No programs yet. Create one to get started.</p>
        )}
      </div>

      {/* Module detail popup */}
      {detailModuleId && (
        <ModuleDetailModal
          moduleId={detailModuleId}
          isSelected={selectedModules.includes(detailModuleId)}
          onClose={() => setDetailModuleId(null)}
          onToggleSelect={toggleModule}
        />
      )}
    </div>
  );
}
