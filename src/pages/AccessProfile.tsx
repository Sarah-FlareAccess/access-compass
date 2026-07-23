import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useSites, getActiveSiteId } from '../hooks/useSites';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  ACCESS_STATEMENT_CATEGORIES,
  accessStatementModuleIds,
} from '../data/accessStatementFeatures';
import {
  generateAccessStatement,
  serializeAccessStatementText,
  buildAccessProfileProse,
  accessProfileIntro,
  accessProfileClosing,
  type StatementFeature,
} from '../utils/generateAccessStatement';
import { downloadAccessProfilePdf } from '../utils/accessStatementPdf';
import {
  applyOverrides,
  loadOverrides,
  saveOverrides,
  emptyOverrides,
  newCustomId,
  type AccessProfileOverrides,
} from '../utils/accessProfileOverrides';

export default function AccessProfile() {
  usePageTitle('Accessibility Profile');
  const { progress, isLoading } = useModuleProgress(accessStatementModuleIds);
  const { sites } = useSites();
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const venueName = useMemo(() => {
    const activeId = getActiveSiteId();
    const site = sites.find((s) => s.id === activeId);
    if (site?.name) return site.name;
    const session = getSession();
    return session?.business_snapshot?.organisation_name || 'Your Venue';
  }, [sites]);

  const overridesKey = useMemo(() => {
    const activeId = getActiveSiteId();
    if (activeId) return `site:${activeId}`;
    const session = getSession();
    return `org:${session?.business_snapshot?.organisation_name || 'venue'}`;
  }, []);

  const [overrides, setOverrides] = useState<AccessProfileOverrides>(() => loadOverrides(overridesKey));

  const base = useMemo(() => generateAccessStatement(progress, venueName), [progress, venueName]);
  const statement = useMemo(() => applyOverrides(base, overrides), [base, overrides]);
  const prose = useMemo(() => buildAccessProfileProse(statement), [statement]);

  const hasEdits = Object.keys(overrides.features).length > 0 || overrides.custom.length > 0;

  const generatedDate = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const commit = (next: AccessProfileOverrides) => {
    setOverrides(next);
    saveOverrides(overridesKey, next);
  };

  const patchFeature = (feature: StatementFeature, patch: { label?: string; detail?: string; state?: 'yes' | 'partial' }) => {
    if (feature.customId) {
      commit({ ...overrides, custom: overrides.custom.map((c) => (c.id === feature.customId ? { ...c, ...patch } : c)) });
    } else if (feature.refKey) {
      commit({ ...overrides, features: { ...overrides.features, [feature.refKey]: { ...overrides.features[feature.refKey], ...patch } } });
    }
  };

  const removeFeature = (feature: StatementFeature) => {
    if (feature.customId) {
      commit({ ...overrides, custom: overrides.custom.filter((c) => c.id !== feature.customId) });
    } else if (feature.refKey) {
      commit({ ...overrides, features: { ...overrides.features, [feature.refKey]: { ...overrides.features[feature.refKey], hidden: true } } });
    }
  };

  const addFeature = (categoryId: string) => {
    commit({ ...overrides, custom: [...overrides.custom, { id: newCustomId(), categoryId, label: 'New feature', state: 'yes' }] });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(serializeAccessStatementText(statement));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const featuresFor = (categoryId: string): StatementFeature[] =>
    statement.categories.find((c) => c.id === categoryId)?.features ?? [];

  const inputStyle: React.CSSProperties = {
    padding: '6px 8px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '14px',
  };

  return (
    <div className="export-page">
      <div className="export-container" style={{ maxWidth: '820px', margin: '0 auto', padding: '24px 20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ marginBottom: '6px' }}>Accessibility profile</h1>
          <p className="helper-text" style={{ color: 'var(--text-muted)', margin: 0 }}>
            A shareable, written summary of the accessibility features at {venueName}, drawn from your
            self-review. Share it with festivals, event organisers and patrons.
          </p>
        </div>

        {isLoading && <div className="card">Loading your accessibility profile...</div>}

        {!isLoading && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
            <button className={editMode ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setEditMode((v) => !v)}>
              {editMode ? 'Done editing' : 'Edit profile'}
            </button>
            <button className="btn btn-primary" onClick={() => downloadAccessProfilePdf(statement)} disabled={statement.featureCount === 0}>
              Download PDF
            </button>
            <button className="btn btn-secondary" onClick={handleCopy} disabled={statement.featureCount === 0}>
              {copied ? 'Copied' : 'Copy for web page'}
            </button>
            {hasEdits && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Remove all your edits and restore the generated profile?')) commit(emptyOverrides());
                }}
              >
                Reset edits
              </button>
            )}
          </div>
        )}

        {!isLoading && !editMode && statement.featureCount === 0 && (
          <div className="card" style={{ border: '2px solid var(--warm-orange)', background: 'rgba(230, 119, 0, 0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
            <h3>No accessibility features to show yet</h3>
            <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>
              Complete the access modules to build your profile. Only features you have in place are
              shown here. You can also add features by hand with Edit profile.
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* View mode: warm written profile */}
        {!isLoading && !editMode && statement.featureCount > 0 && (
          <div className="card" style={{ lineHeight: 1.7 }}>
            <div style={{ borderBottom: '2px solid var(--warm-orange)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#490E67' }}>{venueName}</h2>
              <p style={{ margin: '0 0 8px 0' }}>{accessProfileIntro(venueName)}</p>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                Self-reported as of {generatedDate}.
              </p>
            </div>

            {prose.map((section) => (
              <div key={section.id} style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#490E67', fontSize: '17px' }}>{section.title}</h3>
                <p style={{ margin: 0 }}>{section.paragraph}</p>
              </div>
            ))}

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px', marginBottom: 0, borderTop: '1px solid #eee', paddingTop: '16px' }}>
              {accessProfileClosing(venueName)}
            </p>
          </div>
        )}

        {/* Edit mode */}
        {!isLoading && editMode && (
          <div className="card">
            <p style={{ marginTop: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
              Change Yes to Partial, remove a feature or add your own. The written profile updates from
              these. Your edits are saved on this device, and Reset edits restores the generated profile.
            </p>

            {ACCESS_STATEMENT_CATEGORIES.map((cat) => {
              const feats = featuresFor(cat.id);
              return (
                <div key={cat.id} style={{ marginBottom: '22px' }}>
                  <h3 style={{ margin: '0 0 10px 0', color: '#490E67', fontSize: '16px' }}>{cat.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {feats.map((f, i) => (
                      <div
                        key={f.refKey || f.customId || i}
                        style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                      >
                        <select value={f.state} onChange={(e) => patchFeature(f, { state: e.target.value as 'yes' | 'partial' })} style={inputStyle} aria-label="Feature status">
                          <option value="yes">Yes</option>
                          <option value="partial">Partial</option>
                        </select>
                        <input type="text" value={f.label} onChange={(e) => patchFeature(f, { label: e.target.value })} style={{ ...inputStyle, flex: '1 1 240px' }} aria-label="Feature name" />
                        <button className="btn btn-secondary" onClick={() => removeFeature(f)} style={{ padding: '6px 10px' }}>
                          Remove
                        </button>
                      </div>
                    ))}
                    <button className="btn btn-secondary" onClick={() => addFeature(cat.id)} style={{ alignSelf: 'flex-start', padding: '6px 12px' }}>
                      + Add feature
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isLoading && (
          <div style={{ marginTop: '24px' }}>
            <Link to="/dashboard" className="btn btn-secondary">
              ← Back to dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
