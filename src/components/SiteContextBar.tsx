/**
 * SiteContextBar
 *
 * Prominent, always-visible "Working in: <site>" selector for the pages where
 * site context matters (dashboard, assessment, evidence). Complements the
 * sidebar picker - people can flick between sites from here too. Renders
 * nothing until the org has at least one site, so single-site orgs never see
 * it. WCAG AA: labelled native select (full keyboard + screen-reader support),
 * live-region hint describing the current scope.
 */

import { useSites, useActiveSiteId } from '../hooks/useSites';

export function SiteContextBar() {
  const { sites } = useSites();
  const [activeSiteId, setActiveSiteId] = useActiveSiteId();

  if (sites.length === 0) return null;

  const activeSite = sites.find(s => s.id === activeSiteId);

  return (
    <div className="site-context-bar" role="region" aria-label="Active site">
      <span className="site-context-bar__icon" aria-hidden="true">📍</span>
      <label className="site-context-bar__label" htmlFor="site-context-select">
        Working in
      </label>
      <div className="site-context-bar__control">
        <select
          id="site-context-select"
          className="site-context-bar__select"
          value={activeSiteId ?? ''}
          onChange={(e) => setActiveSiteId(e.target.value || null)}
        >
          <option value="">Organisation-wide</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
        <svg className="site-context-bar__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      <span className="site-context-bar__hint" aria-live="polite">
        {activeSite
          ? `Answers, evidence and actions apply to ${activeSite.name}`
          : 'Assessing organisation-wide policies'}
      </span>
    </div>
  );
}
