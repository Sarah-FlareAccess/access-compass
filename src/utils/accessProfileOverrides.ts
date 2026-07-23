/**
 * Access Profile edits
 *
 * A venue can tweak its generated Access Profile: edit a feature's wording or
 * detail, change Yes to Partial, hide a feature, or add a custom one. Edits are
 * stored locally per organisation and applied on top of the generated statement.
 * The generated data is never changed, so removing all edits restores it exactly.
 */

import { ACCESS_STATEMENT_CATEGORIES } from '../data/accessStatementFeatures';
import type { AccessStatement, StatementCategory, StatementFeature } from './generateAccessStatement';

export interface FeatureOverride {
  hidden?: boolean;
  label?: string;
  detail?: string;
  state?: 'yes' | 'partial';
}

export interface CustomFeature {
  id: string;
  categoryId: string;
  label: string;
  detail?: string;
  state: 'yes' | 'partial';
}

export interface AccessProfileOverrides {
  features: Record<string, FeatureOverride>;
  custom: CustomFeature[];
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
  return { features: {}, custom: [] };
}

export function loadOverrides(organisationName: string): AccessProfileOverrides {
  try {
    const raw = localStorage.getItem(storageKey(organisationName));
    if (!raw) return emptyOverrides();
    const parsed = JSON.parse(raw) as Partial<AccessProfileOverrides>;
    return {
      features: parsed.features ?? {},
      custom: Array.isArray(parsed.custom) ? parsed.custom : [],
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

export function newCustomId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  return c?.randomUUID ? c.randomUUID() : `custom-${Math.round(performance.now())}-${Math.floor(Math.random() * 1e6)}`;
}

/** Apply saved edits to a generated statement, tagging features for the edit UI. */
export function applyOverrides(
  statement: AccessStatement,
  overrides: AccessProfileOverrides,
): AccessStatement {
  const titleById = new Map(ACCESS_STATEMENT_CATEGORIES.map((c) => [c.id, c.title]));
  const leadById = new Map(ACCESS_STATEMENT_CATEGORIES.map((c) => [c.id, c.lead]));
  const order = ACCESS_STATEMENT_CATEGORIES.map((c) => c.id);

  const categories: StatementCategory[] = statement.categories.map((cat) => {
    const features: StatementFeature[] = [];
    for (const f of cat.features) {
      const key = featureKey(cat.id, f.label);
      const ov = overrides.features[key];
      if (ov?.hidden) continue;
      features.push({
        label: ov?.label?.trim() || f.label,
        phrase: f.phrase,
        state: ov?.state ?? f.state,
        detail: ov?.detail !== undefined ? ov.detail.trim() || undefined : f.detail,
        refKey: key,
      });
    }
    return { id: cat.id, title: cat.title, lead: cat.lead, features };
  });

  const indexById = new Map(categories.map((c, i) => [c.id, i]));
  for (const cf of overrides.custom) {
    const feature: StatementFeature = {
      label: cf.label,
      phrase: cf.label ? cf.label.charAt(0).toLowerCase() + cf.label.slice(1) : cf.label,
      state: cf.state,
      detail: cf.detail?.trim() || undefined,
      customId: cf.id,
    };
    const idx = indexById.get(cf.categoryId);
    if (idx !== undefined) {
      categories[idx].features.push(feature);
    } else {
      categories.push({
        id: cf.categoryId,
        title: titleById.get(cf.categoryId) || 'Other',
        lead: leadById.get(cf.categoryId),
        features: [feature],
      });
      indexById.set(cf.categoryId, categories.length - 1);
    }
  }

  const visible = categories.filter((c) => c.features.length > 0);
  visible.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const featureCount = visible.reduce((n, c) => n + c.features.length, 0);

  return { ...statement, categories: visible, featureCount };
}
