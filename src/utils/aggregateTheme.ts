import { DIAP_CATEGORIES, DIAP_SECTIONS, MODULE_TO_DIAP_MAPPING } from '../data/diapMapping';

// A DIAP-category theme derived from an aggregate's source modules, so cohort
// actions and strengths can be grouped by area (e.g. "Information &
// Communication"). Optional on an aggregate: it is absent on report snapshots
// saved before theming existed, in which case the report re-derives it from the
// aggregate's stored module ids via diapThemeForModules.
export interface AggregateTheme {
  key: string;
  label: string;
}

// module code -> DIAP category, via the section mapping.
const SECTION_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  DIAP_SECTIONS.map(s => [s.id, s.categoryId]),
);
const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  DIAP_CATEGORIES.map(c => [c.id, c.name]),
);

export function diapThemeForModules(moduleIds: string[]): AggregateTheme {
  // Tally the DIAP category of each source module and pick the most common.
  const tally = new Map<string, number>();
  for (const mid of moduleIds) {
    const code = mid.match(/\d+\.\d+/)?.[0] ?? mid;
    const sectionId = MODULE_TO_DIAP_MAPPING[code] || MODULE_TO_DIAP_MAPPING['default'];
    const catId = SECTION_TO_CATEGORY[sectionId] || 'operations-policy-procedure';
    tally.set(catId, (tally.get(catId) ?? 0) + 1);
  }
  let bestKey = 'operations-policy-procedure';
  let bestN = -1;
  for (const [k, n] of tally) {
    if (n > bestN) { bestN = n; bestKey = k; }
  }
  return { key: bestKey, label: CATEGORY_LABEL[bestKey] ?? 'Other' };
}
