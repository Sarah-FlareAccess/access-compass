/**
 * Access Profile edits
 *
 * A venue can tailor its public Access Profile in two safe ways, without ever
 * rewording a generated claim (which must stay faithful to the assessment):
 *   - hide a generated feature it would rather not publish (omission only), and
 *   - add its own free-text sections (heading + text) for extra context.
 *
 * Edits are stored locally per organisation and applied on top of the generated
 * statement. The assessment data, report and DIAP are never touched, so removing
 * all edits restores the generated profile exactly.
 */

import { ACCESS_STATEMENT_CATEGORIES } from '../data/accessStatementFeatures';
import type { AccessStatement, StatementCategory, StatementFeature } from './generateAccessStatement';

export interface FeatureOverride {
  hidden?: boolean;
  /** Venue-edited note for a partial feature, replacing the note from the module. */
  note?: string;
  /** Venue-edited wording for an in-place feature, replacing the default label. */
  label?: string;
}

export interface CustomSection {
  id: string;
  heading?: string;
  text: string;
  /** Which category this section renders under: a category id, or 'general' (at the end). */
  placement?: string;
}

export interface AccessProfileOverrides {
  features: Record<string, FeatureOverride>;
  sections: CustomSection[];
  /** refKeys of partial features the venue has reviewed and confirmed. */
  confirmedPartials?: string[];
  /** Venue-edited section intros, keyed by category id. */
  categoryIntros?: Record<string, string>;
}

const STORAGE_PREFIX = 'access-profile-overrides:';

export function featureKey(categoryId: string, label: string): string {
  return `${categoryId}::${label}`;
}

function storageKey(organisationName: string): string {
  const slug = organisationName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'venue';
  return `${STORAGE_PREFIX}${slug}`;
}

export function emptyOverrides(): AccessProfileOverrides {
  return { features: {}, sections: [] };
}

export function loadOverrides(organisationName: string): AccessProfileOverrides {
  try {
    const raw = localStorage.getItem(storageKey(organisationName));
    if (!raw) return emptyOverrides();
    const parsed = JSON.parse(raw) as Partial<AccessProfileOverrides>;
    return {
      features: parsed.features ?? {},
      sections: Array.isArray(parsed.sections) ? parsed.sections : [],
      confirmedPartials: Array.isArray(parsed.confirmedPartials) ? parsed.confirmedPartials : [],
      categoryIntros: parsed.categoryIntros && typeof parsed.categoryIntros === 'object' ? parsed.categoryIntros : {},
    };
  } catch {
    return emptyOverrides();
  }
}

export function saveOverrides(organisationName: string, overrides: AccessProfileOverrides): void {
  try {
    localStorage.setItem(storageKey(organisationName), JSON.stringify(overrides));
  } catch {
    // Local persistence is best-effort; ignore quota or serialisation errors.
  }
}

export function newId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return c?.randomUUID ? c.randomUUID() : `sec-${Math.round(performance.now())}-${Math.floor(Math.random() * 1e6)}`;
}

/** Apply saved edits: drop hidden features, tag the rest, attach custom sections. */
export function applyOverrides(
  statement: AccessStatement,
  overrides: AccessProfileOverrides,
): AccessStatement {
  const order = ACCESS_STATEMENT_CATEGORIES.map((c) => c.id);
  // Tolerate a partially-shaped overrides object (e.g. edit data saved by an
  // earlier version of this feature) so a stale local cache can never crash.
  const featureOverrides = overrides.features ?? {};
  const savedSections = Array.isArray(overrides.sections) ? overrides.sections : [];

  const categories: StatementCategory[] = statement.categories
    .map((cat) => {
      const features: StatementFeature[] = [];
      for (const f of cat.features) {
        const key = featureKey(cat.id, f.label);
        const ov = featureOverrides[key];
        if (ov?.hidden) continue;
        const note = ov?.note !== undefined ? ov.note.trim() || undefined : f.note;
        const label = ov?.label?.trim() || f.label;
        features.push({ ...f, label, note, refKey: key });
      }
      const intro = overrides.categoryIntros?.[cat.id] ?? cat.intro;
      return { id: cat.id, title: cat.title, lead: cat.lead, intro, features };
    })
    .filter((c) => c.features.length > 0);

  categories.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const featureCount = categories.reduce((n, c) => n + c.features.length, 0);
  const sections = savedSections.filter((s) => s && typeof s.text === 'string' && s.text.trim().length > 0);

  return { ...statement, categories, sections, featureCount };
}
