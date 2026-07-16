import { DIAP_CATEGORIES, DIAP_SECTIONS, MODULE_TO_DIAP_MAPPING } from '../data/diapMapping';
import { getQuestionCategory } from '../data/accessModules';

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

// A question's own topical category -> DIAP category. Themes an action by what
// its source question is actually about, so a website/WCAG recommendation
// raised inside a physical-access module is grouped under Information &
// Communication, not Physical Access.
const QUESTION_CATEGORY_TO_DIAP: Record<string, string> = {
  operational: 'operations-policy-procedure',
  information: 'information-communication-marketing',
  policy: 'operations-policy-procedure',
  physical: 'physical-access',
  feedback: 'customer-service',
  training: 'people-culture',
  improvement: 'operations-policy-procedure',
  procurement: 'operations-policy-procedure',
  'sensory-environment': 'physical-access',
  safety: 'physical-access',
  measurement: 'operations-policy-procedure',
  digital: 'information-communication-marketing',
  communication: 'information-communication-marketing',
  'lived-experience': 'people-culture',
  evidence: 'operations-policy-procedure',
  employment: 'people-culture',
};

// Theme a recommendation by its source question's own category when available,
// falling back to the module-derived theme (older snapshots store no question id).
export function diapThemeForAction(questionId: string | undefined, moduleIds: string[]): AggregateTheme {
  if (questionId) {
    const baseId = questionId.replace(/-(media|url)-\d+$/, '');
    const cat = getQuestionCategory(baseId);
    const diap = cat ? QUESTION_CATEGORY_TO_DIAP[cat] : undefined;
    if (diap) return { key: diap, label: CATEGORY_LABEL[diap] ?? 'Other' };
  }
  return diapThemeForModules(moduleIds);
}
