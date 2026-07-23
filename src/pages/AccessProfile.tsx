import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useSites, getActiveSiteId } from '../hooks/useSites';
import { usePageTitle } from '../hooks/usePageTitle';
import { accessStatementModuleIds } from '../data/accessStatementFeatures';
import {
  generateAccessStatement,
  serializeAccessStatementText,
  buildAccessProfileProse,
  accessProfileIntro,
  accessProfileClosing,
} from '../utils/generateAccessStatement';
import { downloadAccessProfilePdf } from '../utils/accessStatementPdf';
import {
  applyOverrides,
  loadOverrides,
  saveOverrides,
  emptyOverrides,
  newId,
  featureKey,
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
  const sections = statement.sections ?? [];
  const hasContent = statement.featureCount > 0 || sections.length > 0;

  const hasEdits = Object.values(overrides.features ?? {}).some((f) => f?.hidden) || (overrides.sections ?? []).length > 0;

  const generatedDate = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const commit = (next: AccessProfileOverrides) => {
    setOverrides(next);
    saveOverrides(overridesKey, next);
  };

  const isHidden = (categoryId: string, label: string) =>
    Boolean(overrides.features[featureKey(categoryId, label)]?.hidden);

  const toggleHidden = (categoryId: string, label: string) => {
    const key = featureKey(categoryId, label);
    const hidden = !overrides.features[key]?.hidden;
    commit({ ...overrides, features: { ...overrides.features, [key]: { hidden } } });
  };

  const addSection = () => {
    commit({ ...overrides, sections: [...(overrides.sections ?? []), { id: newId(), heading: '', text: '' }] });
  };

  const updateSection = (id: string, patch: { heading?: string; text?: string }) => {
    commit({ ...overrides, sections: (overrides.sections ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };

  const removeSection = (id: string) => {
    commit({ ...overrides, sections: (overrides.sections ?? []).filter((s) => s.id !== id) });
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

  const inputStyle: React.CSSProperties = {
    padding: '8px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
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
              {editMode ? 'Done' : 'Customise'}
            </button>
            <button className="btn btn-primary" onClick={() => downloadAccessProfilePdf(statement)} disabled={!hasContent}>
              Download PDF
            </button>
            <button className="btn btn-secondary" onClick={handleCopy} disabled={!hasContent}>
              {copied ? 'Copied' : 'Copy for web page'}
            </button>
            {hasEdits && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (window.confirm('Reset to the generated profile? This removes anything you hid or added.')) commit(emptyOverrides());
                }}
              >
                Reset
              </button>
            )}
          </div>
        )}

        {!isLoading && !editMode && !hasContent && (
          <div className="card" style={{ border: '2px solid var(--warm-orange)', background: 'rgba(230, 119, 0, 0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
            <h3>No accessibility features to show yet</h3>
            <p style={{ color: 'var(--text-muted)', margin: '12px 0' }}>
              Complete the access modules to build your profile. Only features you have in place are
              shown. You can also add your own information with Customise.
            </p>
            <Link to="/dashboard" className="btn btn-primary" style={{ marginTop: '12px' }}>
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* View mode: warm written profile */}
        {!isLoading && !editMode && hasContent && (
          <div className="card" style={{ lineHeight: 1.7 }}>
            <div style={{ borderBottom: '2px solid var(--warm-orange)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: '0 0 10px 0', color: '#490E67' }}>{venueName}</h2>
              <p style={{ margin: '0 0 8px 0' }}>{accessProfileIntro(venueName)}</p>
              <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>Self-reported as of {generatedDate}.</p>
            </div>

            {prose.map((section) => (
              <div key={section.id} style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#490E67', fontSize: '17px' }}>{section.title}</h3>
                <p style={{ margin: 0 }}>{section.paragraph}</p>
              </div>
            ))}

            {sections.map((s, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#490E67', fontSize: '17px' }}>{s.heading?.trim() || 'More information'}</h3>
                <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{s.text}</p>
              </div>
            ))}

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '24px', marginBottom: 0, borderTop: '1px solid #eee', paddingTop: '16px' }}>
              {accessProfileClosing(venueName)}
            </p>
          </div>
        )}

        {/* Customise mode */}
        {!isLoading && editMode && (
          <>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Choose what to show</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 0 }}>
                These come straight from your self-review, so the wording stays accurate and can't be
                changed here. Untick anything you'd rather not publish.
              </p>
              {base.categories.map((cat) => (
                <div key={cat.id} style={{ marginBottom: '18px' }}>
                  <h3 style={{ margin: '0 0 8px 0', color: '#490E67', fontSize: '15px' }}>{cat.title}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {cat.features.map((f) => (
                      <label key={f.label} style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                        <input type="checkbox" checked={!isHidden(cat.id, f.label)} onChange={() => toggleHidden(cat.id, f.label)} style={{ width: '17px', height: '17px' }} />
                        <span style={{ color: isHidden(cat.id, f.label) ? 'var(--text-muted)' : 'inherit' }}>{f.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h2 style={{ marginTop: 0, fontSize: '18px' }}>Add your own information</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: 0 }}>
                Add anything your assessment doesn't cover, for example a sensory guide, a named
                contact, quiet times or specific parking directions.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {(overrides.sections ?? []).map((s) => (
                  <div key={s.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" value={s.heading || ''} placeholder="Heading (optional)" onChange={(e) => updateSection(s.id, { heading: e.target.value })} style={inputStyle} aria-label="Section heading" />
                    <textarea value={s.text} placeholder="Write your information here" onChange={(e) => updateSection(s.id, { text: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} aria-label="Section text" />
                    <button className="btn btn-secondary" onClick={() => removeSection(s.id)} style={{ alignSelf: 'flex-start', padding: '6px 12px' }}>
                      Remove
                    </button>
                  </div>
                ))}
                <button className="btn btn-secondary" onClick={addSection} style={{ alignSelf: 'flex-start', padding: '8px 14px' }}>
                  + Add section
                </button>
              </div>
            </div>
          </>
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
