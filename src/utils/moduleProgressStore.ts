/**
 * Module progress local store - per-site namespacing.
 *
 * Assessment data is site-scoped for multi-site orgs (migration 023) and the
 * cloud read is already partitioned by site (fetchOrgRecords). The browser
 * cache used to be a single blob keyed only by module id, so switching venues
 * showed an accumulated aggregate rather than that venue's modules. We
 * namespace the localStorage key by active site: org-wide (null site) keeps
 * the original key untouched, so legacy and single-site data is unaffected,
 * and each site gets its own blob.
 */

import { getActiveSiteId } from '../hooks/useSites';

const MODULE_PROGRESS_KEY = 'access_compass_module_progress';

export function moduleProgressKey(siteId?: string | null): string {
  return siteId ? `${MODULE_PROGRESS_KEY}::site::${siteId}` : MODULE_PROGRESS_KEY;
}

/**
 * Raw JSON string of the active site's progress blob (or null). Used by the
 * low-level readers that predate the hook and reach into localStorage
 * directly (related-response lookup, evidence listing, carryover check).
 */
export function readActiveModuleProgressRaw(): string | null {
  try {
    return localStorage.getItem(moduleProgressKey(getActiveSiteId()));
  } catch {
    return null;
  }
}
