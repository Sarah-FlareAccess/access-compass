import { useCallback, useState } from 'react';
import type { Site } from '../hooks/useSites';

interface Props {
  membershipId: string;
  sites: Site[];
  getAccess: (membershipId: string) => Promise<string[]>;
  setAccess: (membershipId: string, siteIds: string[]) => Promise<boolean>;
}

/**
 * Admin control (phase 1a) to limit a member to specific sites. "All sites" =
 * no grant rows (default open); "Only specific sites" writes exactly the ticked
 * ones. Owners/admins bypass scoping, so this is only rendered for other roles.
 * Loads current grants lazily when expanded.
 */
export function MemberSiteAccessControl({ membershipId, sites, getAccess, setAccess }: Props) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const load = useCallback(async () => {
    const ids = await getAccess(membershipId);
    setSelected(new Set(ids));
    setRestricted(ids.length > 0);
    setLoaded(true);
  }, [membershipId, getAccess]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !loaded) load();
  };

  const toggle = (id: string) => {
    setSavedMsg(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setSavedMsg(null);
    const ids = restricted ? Array.from(selected) : [];
    const ok = await setAccess(membershipId, ids);
    setSaving(false);
    setSavedMsg(ok ? 'Saved' : 'Could not save');
    if (ok) setRestricted(ids.length > 0);
  };

  const summary =
    restricted && selected.size > 0 ? `${selected.size} of ${sites.length} sites` : 'All sites';

  return (
    <div className="member-site-access" style={{ marginTop: 8, width: '100%' }}>
      <button
        type="button"
        className="site-access-toggle"
        aria-expanded={open}
        onClick={handleToggle}
        style={{
          background: 'transparent',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          color: '#490E67',
          fontSize: '0.85rem',
          fontWeight: 600,
          textDecoration: 'underline',
        }}
      >
        Site access{loaded ? `: ${summary}` : ''}
      </button>

      {open && (
        <div
          className="site-access-body"
          style={{ marginTop: 6, paddingLeft: 8, fontSize: '0.85rem' }}
        >
          {!loaded ? (
            <p style={{ margin: 0 }}>Loading…</p>
          ) : (
            <>
              <label style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="radio"
                  name={`sa-${membershipId}`}
                  checked={!restricted}
                  onChange={() => {
                    setRestricted(false);
                    setSavedMsg(null);
                  }}
                />{' '}
                All sites
              </label>
              <label style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="radio"
                  name={`sa-${membershipId}`}
                  checked={restricted}
                  onChange={() => {
                    setRestricted(true);
                    setSavedMsg(null);
                  }}
                />{' '}
                Only specific sites
              </label>

              {restricted && (
                <ul style={{ listStyle: 'none', margin: '4px 0', padding: '0 0 0 16px' }}>
                  {sites.map(s => (
                    <li key={s.id} style={{ marginBottom: 2 }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={selected.has(s.id)}
                          onChange={() => toggle(s.id)}
                        />{' '}
                        {s.name}
                      </label>
                    </li>
                  ))}
                </ul>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || (restricted && selected.size === 0)}
                >
                  {saving ? 'Saving…' : 'Save access'}
                </button>
                {savedMsg && <span style={{ color: '#3E2B2F' }}>{savedMsg}</span>}
              </div>

              {restricted && selected.size === 0 && (
                <p style={{ margin: '4px 0 0', color: '#7c2d12' }}>
                  Select at least one site or choose All sites.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
