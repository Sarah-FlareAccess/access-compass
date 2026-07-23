import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSession } from '../utils/session';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { useSites, getActiveSiteId } from '../hooks/useSites';
import { usePageTitle } from '../hooks/usePageTitle';
import { ACCESS_STATEMENT_CATEGORIES, accessStatementModuleIds } from '../data/accessStatementFeatures';
import {
  generateAccessStatement,
  serializeAccessStatementText,
  buildAccessProfileLayout,
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
  const layout = useMemo(() => buildAccessProfileLayout(statement), [statement]);
  const hasContent = statement.featureCount > 0 || (statement.sections ?? []).length > 0;

  const partialKeys = useMemo(
    () =>
      statement.categories.flatMap(
        (c) => c.features.filter((f) => f.state === 'partial').map((f) => f.refKey).filter(Boolean) as string[],
      ),
    [statement],
  );
  const confirmedPartials = overrides.confirmedPartials ?? [];
  const unconfirmedPartials = partialKeys.filter((k) => !confirmedPartials.includes(k));
  const needsPartialReview = unconfirmedPartials.length > 0;

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

  const confirmPartials = () => commit({ ...overrides, confirmedPartials: partialKeys });

  const isHidden = (categoryId: string, label: string) =>
    Boolean(overrides.features[featureKey(categoryId, label)]?.hidden);

  const toggleHidden = (categoryId: string, label: string) => {
    const key = featureKey(categoryId, label);
    const current = overrides.features[key];
    commit({ ...overrides, features: { ...overrides.features, [key]: { ...current, hidden: !current?.hidden } } });
  };

  const featureNote = (categoryId: string, label: string, fallback?: string) => {
    const ov = overrides.features[featureKey(categoryId, label)]?.note;
    return ov !== undefined ? ov : fallback || '';
  };

  const setFeatureNote = (categoryId: string, label: string, note: string) => {
    const key = featureKey(categoryId, label);
    // Editing a note un-confirms that item, so the venue re-checks the new wording.
    commit({
      ...overrides,
      features: { ...overrides.features, [key]: { ...overrides.features[key], note } },
      confirmedPartials: (overrides.confirmedPartials ?? []).filter((k) => k !== key),
    });
  };

  const isPartialConfirmed = (categoryId: string, label: string) =>
    (overrides.confirmedPartials ?? []).includes(featureKey(categoryId, label));

  const confirmOnePartial = (categoryId: string, label: string) => {
    const set = new Set(overrides.confirmedPartials ?? []);
    set.add(featureKey(categoryId, label));
    commit({ ...overrides, confirmedPartials: Array.from(set) });
  };

  const addSection = () => {
    commit({ ...overrides, sections: [...(overrides.sections ?? []), { id: newId(), heading: '', text: '', placement: 'general' }] });
  };

  const updateSection = (id: string, patch: { heading?: string; text?: string; placement?: string }) => {
    commit({ ...overrides, sections: (overrides.sections ?? []).map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  };

  const removeSection = (id: string) => {
    commit({ ...overrides, sections: (overrides.sections ?? []).filter((s) => s.id !== id) });
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    const list = [...(overrides.sections ?? [])];
    const idx = list.findIndex((s) => s.id === id);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= list.length) return;
    [list[idx], list[j]] = [list[j], list[idx]];
    commit({ ...overrides, sections: list });
  };

  const confirmBeforeShare = () => {
    if (needsPartialReview) {
      window.alert(
        'Please review the partly-in-place features first. Open Customise, make sure each "In some areas" note is accurate, then confirm. Then you can share the profile.',
      );
      return false;
    }
    return window.confirm(
      'This profile is self-reported. Please make sure you have reviewed it for accuracy before sharing it publicly.\n\nContinue?',
    );
  };

  const handleCopy = async () => {
    if (!confirmBeforeShare()) return;
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
            <button className="btn btn-primary" onClick={() => { if (confirmBeforeShare()) downloadAccessProfilePdf(statement); }} disabled={!hasContent}>
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

        {!isLoading && hasContent && needsPartialReview && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', marginBottom: '20px', border: '2px solid #ea580c', background: 'rgba(234, 88, 12, 0.07)', borderRadius: '8px', fontSize: '14px' }}>
            <span aria-hidden="true">⚠️</span>
            <div>
              <strong>Review needed before you share.</strong>{' '}
              {editMode
                ? "The features flagged “partly in place” below each have a note describing what's available. Make sure each note is accurate, then confirm."
                : `Some features are only partly in place and appear on the profile as “In some areas”. Please make sure ${unconfirmedPartials.length === 1 ? 'that note is' : 'those notes are'} accurate before sharing.`}
              <div style={{ marginTop: '10px' }}>
                {editMode ? (
                  <button className="btn btn-primary" onClick={confirmPartials}>The notes are accurate, confirm</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setEditMode(true)}>Review partial features</button>
                )}
              </div>
            </div>
          </div>
        )}

        {!isLoading && hasContent && !needsPartialReview && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', marginBottom: '20px', border: '1px solid #fcd9a6', background: 'rgba(230, 119, 0, 0.06)', borderRadius: '8px', fontSize: '14px' }}>
            <span aria-hidden="true">ℹ️</span>
            <span>This profile is self-reported. Please review it for accuracy before sharing it publicly.</span>
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

            {layout.categories.map((block) => (
              <div key={block.id} style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', color: '#490E67', fontSize: '17px' }}>{block.title}</h3>
                {block.paragraph && <p style={{ margin: '0 0 10px 0' }}>{block.paragraph}</p>}
                {block.notes.length > 0 && (
                  <p style={{ margin: '0 0 10px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
                    <em>In some areas:</em> {block.notes.join(' ')}
                  </p>
                )}
                {block.sections.map((s) => (
                  <div key={s.id} style={{ marginTop: '10px' }}>
                    {s.heading?.trim() && <strong style={{ display: 'block' }}>{s.heading.trim()}</strong>}
                    <span style={{ whiteSpace: 'pre-wrap' }}>{s.text}</span>
                  </div>
                ))}
              </div>
            ))}

            {layout.general.map((s) => (
              <div key={s.id} style={{ marginBottom: '20px' }}>
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {cat.features.map((f) => {
                      const partial = f.state === 'partial';
                      const shown = !isHidden(cat.id, f.label);
                      const confirmed = isPartialConfirmed(cat.id, f.label);
                      const needsReview = partial && shown && !confirmed;
                      return (
                        <div
                          key={f.label}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            ...(needsReview
                              ? { border: '2px solid #ea580c', background: 'rgba(234,88,12,0.06)', borderRadius: '8px', padding: '10px' }
                              : partial && shown && confirmed
                                ? { border: '1px solid #86efac', background: 'rgba(22,163,74,0.05)', borderRadius: '8px', padding: '10px' }
                                : {}),
                          }}
                        >
                          <label style={{ display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer' }}>
                            <input type="checkbox" checked={shown} onChange={() => toggleHidden(cat.id, f.label)} style={{ width: '17px', height: '17px' }} />
                            <span style={{ color: shown ? 'inherit' : 'var(--text-muted)' }}>{f.label}</span>
                            {partial && (
                              <span style={{ fontSize: '12px', fontWeight: 700, borderRadius: '5px', padding: '1px 7px', color: confirmed ? '#166534' : '#7c3a09', background: confirmed ? '#dcfce7' : '#fef3c7' }}>
                                {confirmed ? 'reviewed' : 'needs review'}
                              </span>
                            )}
                          </label>
                          {partial && shown && (
                            <div style={{ marginLeft: '27px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                In your self-review you answered this "partly in place". The note below is your own description of what's available. Check or edit it for the public, then confirm.
                              </span>
                              <textarea
                                value={featureNote(cat.id, f.label, f.note)}
                                onChange={(e) => setFeatureNote(cat.id, f.label, e.target.value)}
                                placeholder="Describe what's available, e.g. 'ramp at the front entrance, not the rear'"
                                rows={2}
                                style={{ ...inputStyle, resize: 'vertical' }}
                                aria-label={`Note for ${f.label}`}
                              />
                              {!confirmed && (
                                <button className="btn btn-primary" onClick={() => confirmOnePartial(cat.id, f.label)} style={{ alignSelf: 'flex-start', padding: '6px 12px' }}>
                                  Confirm this is accurate
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                {(overrides.sections ?? []).map((s, i, arr) => (
                  <div key={s.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Show under:</label>
                      <select value={s.placement || 'general'} onChange={(e) => updateSection(s.id, { placement: e.target.value })} style={{ ...inputStyle, width: 'auto' }} aria-label="Where to show this section">
                        <option value="general">General (at the end)</option>
                        {ACCESS_STATEMENT_CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                      <button className="btn btn-secondary" onClick={() => moveSection(s.id, -1)} disabled={i === 0} style={{ padding: '4px 10px' }} aria-label="Move up">↑</button>
                      <button className="btn btn-secondary" onClick={() => moveSection(s.id, 1)} disabled={i === arr.length - 1} style={{ padding: '4px 10px' }} aria-label="Move down">↓</button>
                    </div>
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
