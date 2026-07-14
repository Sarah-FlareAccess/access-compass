// Two-layer mapping of Access Compass modules to statutory framework domains.
//
// Layer 1 (MODULE_FRAMEWORK_MAPPINGS): each module's inherent domain(s) - always
//   true regardless of who completes it.
// Layer 2 (INDUSTRY_SERVICE_DOMAINS): a business's sector adds its "service
//   domain" to the general on-site experience modules (FACILITY_CONTEXT_MODULES),
//   e.g. a leisure/health facility's access findings also count toward Health &
//   wellbeing. Derived from the existing multi-select business_types field.
//
// domainsForModule() combines both. DRAFT mapping - pending Sarah sign-off.
// v1 ships SA (AU-SA) only; other jurisdictions added in Session 2.

import { FRAMEWORKS } from './frameworks';
import { AUTO_QUESTION_FRAMEWORK_OVERRIDES } from './frameworkQuestionOverrides';

// Layer 1: module -> framework -> domain IDs
//
// AU (national ADS) mappings are a faithful transform of the SA (AU-SA) logic:
//   SDIP-1 Inclusive environments/communities -> ADS-2 Inclusive homes and communities
//   SDIP-2 Education and employment           -> ADS-1 Employment and financial security
//   SDIP-3 Personal and community support     -> ADS-4 Personal and community support
//   SDIP-5 Safety, rights and justice         -> ADS-3 Safety, rights and justice
// (ADS-5 Education, ADS-6 Health, ADS-7 Attitudes are reached via the Layer 2
// service overlay / future work.) DRAFT - pending Sarah sign-off, as with SA.
//
// VIC (AU-VIC) = the four Disability Act 2006 (Vic) s38(1) objectives:
//   VIC-A access to goods/services/facilities | VIC-B employment
//   VIC-C inclusion & participation | VIC-D attitudes & practices
// NSW (AU-NSW) = the four Disability Inclusion Act 2014 focus areas:
//   NSW-1 attitudes & behaviours | NSW-2 liveable communities
//   NSW-3 employment | NSW-4 access to services via systems & processes
export const MODULE_FRAMEWORK_MAPPINGS: Record<string, Record<string, string[]>> = {
  // Before arrival - information & communications
  '1.1': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  '1.2': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  '1.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  '1.4': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  '1.5': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  '1.6': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-3'] },
  // Getting in - built environment
  '2.1': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '2.2': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '2.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '2.4': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  // During visit - on-site environment & participation
  '3.1': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.2': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.4': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.5': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.6': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.7': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.8': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.9': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.10': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.11': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  '3.12': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-2'] },
  // Service & support
  '4.1': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  '4.2': { 'AU-SA': ['SDIP-1', 'SDIP-3'], AU: ['ADS-2', 'ADS-4'], 'AU-VIC': ['VIC-A', 'VIC-D'], 'AU-NSW': ['NSW-1', 'NSW-4'], 'AU-WA': ['WA-4'] }, // customer service = attitudes + support
  '4.3': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  '4.4': { 'AU-SA': ['SDIP-5'], AU: ['ADS-3'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] }, // safety & emergencies
  '4.5': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  '4.6': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  '4.7': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  // Organisation / policy & operations
  '5.1': { 'AU-SA': ['SDIP-1', 'SDIP-5'], AU: ['ADS-2', 'ADS-3'], 'AU-VIC': ['VIC-C', 'VIC-D'], 'AU-NSW': ['NSW-1', 'NSW-4'], 'AU-WA': ['WA-1'] }, // policy & inclusion = culture + rights
  '5.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-C'], 'AU-NSW': ['NSW-1'], 'AU-WA': ['WA-1'] },
  '5.4': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  '5.5': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-C'], 'AU-NSW': ['NSW-1'], 'AU-WA': ['WA-6'] }, // engagement/consultation
  '5.6': { 'AU-SA': ['SDIP-3'], AU: ['ADS-4'], 'AU-VIC': ['VIC-A'], 'AU-NSW': ['NSW-4'], 'AU-WA': ['WA-1'] },
  // Employment (inclusive working environments + employment opportunities)
  '5.7': { 'AU-SA': ['SDIP-2', 'SDIP-1'], AU: ['ADS-1', 'ADS-2'], 'AU-VIC': ['VIC-B'], 'AU-NSW': ['NSW-3'], 'AU-WA': ['WA-7'] },
  '5.8': { 'AU-SA': ['SDIP-2', 'SDIP-1'], AU: ['ADS-1', 'ADS-2'], 'AU-VIC': ['VIC-B'], 'AU-NSW': ['NSW-3'], 'AU-WA': ['WA-7'] },
  '5.9': { 'AU-SA': ['SDIP-2', 'SDIP-1'], AU: ['ADS-1', 'ADS-2'], 'AU-VIC': ['VIC-B'], 'AU-NSW': ['NSW-3'], 'AU-WA': ['WA-7'] },
  '5.10': { 'AU-SA': ['SDIP-2', 'SDIP-1'], AU: ['ADS-1', 'ADS-2'], 'AU-VIC': ['VIC-B', 'VIC-D'], 'AU-NSW': ['NSW-3', 'NSW-1'], 'AU-WA': ['WA-7'] }, // retention/culture adds attitudes
  // Events
  '6.1': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '6.2': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '6.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '6.4': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '6.5': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  // Major events
  '7.1': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '7.2': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '7.3': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '7.4': { 'AU-SA': ['SDIP-1', 'SDIP-2'], AU: ['ADS-2', 'ADS-1'], 'AU-VIC': ['VIC-C', 'VIC-B'], 'AU-NSW': ['NSW-2', 'NSW-3'], 'AU-WA': ['WA-1', 'WA-7'] }, // performer access = participation + employment
  '7.5': { 'AU-SA': ['SDIP-1', 'SDIP-2'], AU: ['ADS-2', 'ADS-1'], 'AU-VIC': ['VIC-C', 'VIC-B'], 'AU-NSW': ['NSW-2', 'NSW-3'], 'AU-WA': ['WA-1', 'WA-7'] }, // volunteers/staff = participation + workforce
  '7.6': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
  '7.7': { 'AU-SA': ['SDIP-1'], AU: ['ADS-2'], 'AU-VIC': ['VIC-A', 'VIC-C'], 'AU-NSW': ['NSW-2'], 'AU-WA': ['WA-1'] },
};

// Voluntary jurisdictions (no statutory council-plan mandate). QLD and TAS adopt
// Australia's Disability Strategy outcomes verbatim, so they alias the AU
// mapping. NT (5 outcomes) and ACT (6 focus areas) have their own outcome sets.
const NT_MODULE_MAP: Record<string, string[]> = {
  '1.1': ['NT-3'], '1.2': ['NT-3'], '1.3': ['NT-3'], '1.4': ['NT-3'], '1.5': ['NT-3'], '1.6': ['NT-3'],
  '2.1': ['NT-3'], '2.2': ['NT-3'], '2.3': ['NT-3'], '2.4': ['NT-3'],
  '3.1': ['NT-3'], '3.2': ['NT-3'], '3.3': ['NT-3'], '3.4': ['NT-3'], '3.5': ['NT-3'], '3.6': ['NT-3'],
  '3.7': ['NT-3'], '3.8': ['NT-3'], '3.9': ['NT-3'], '3.10': ['NT-3'], '3.11': ['NT-3'], '3.12': ['NT-3'],
  '4.1': ['NT-3'], '4.2': ['NT-3'], '4.3': ['NT-3'], '4.4': ['NT-1'], '4.5': ['NT-3'], '4.6': ['NT-3'], '4.7': ['NT-3'],
  '5.1': ['NT-1'], '5.3': ['NT-2'], '5.4': ['NT-3'], '5.5': ['NT-2'], '5.6': ['NT-3'],
  '5.7': ['NT-4'], '5.8': ['NT-4'], '5.9': ['NT-4'], '5.10': ['NT-4'],
  '6.1': ['NT-2'], '6.2': ['NT-2'], '6.3': ['NT-2'], '6.4': ['NT-2'], '6.5': ['NT-2'],
  '7.1': ['NT-2'], '7.2': ['NT-2'], '7.3': ['NT-2'], '7.4': ['NT-2', 'NT-4'], '7.5': ['NT-2', 'NT-4'], '7.6': ['NT-2'], '7.7': ['NT-2'],
};
const ACT_MODULE_MAP: Record<string, string[]> = {
  '1.1': ['ACT-4'], '1.2': ['ACT-4'], '1.3': ['ACT-4'], '1.4': ['ACT-4'], '1.5': ['ACT-4'], '1.6': ['ACT-4'],
  '2.1': ['ACT-4'], '2.2': ['ACT-4'], '2.3': ['ACT-4'], '2.4': ['ACT-4'],
  '3.1': ['ACT-4'], '3.2': ['ACT-4'], '3.3': ['ACT-4'], '3.4': ['ACT-4'], '3.5': ['ACT-4'], '3.6': ['ACT-4'],
  '3.7': ['ACT-4'], '3.8': ['ACT-4'], '3.9': ['ACT-4'], '3.10': ['ACT-4'], '3.11': ['ACT-4'], '3.12': ['ACT-4'],
  '4.1': ['ACT-4'], '4.2': ['ACT-4'], '4.3': ['ACT-4'], '4.4': ['ACT-2'], '4.5': ['ACT-4'], '4.6': ['ACT-4'], '4.7': ['ACT-4'],
  '5.1': ['ACT-1'], '5.3': ['ACT-3'], '5.4': ['ACT-4'], '5.5': ['ACT-1'], '5.6': ['ACT-4'],
  '5.7': ['ACT-6'], '5.8': ['ACT-6'], '5.9': ['ACT-6'], '5.10': ['ACT-6'],
  '6.1': ['ACT-3'], '6.2': ['ACT-3'], '6.3': ['ACT-3'], '6.4': ['ACT-3'], '6.5': ['ACT-3'],
  '7.1': ['ACT-3'], '7.2': ['ACT-3'], '7.3': ['ACT-3'], '7.4': ['ACT-3', 'ACT-6'], '7.5': ['ACT-3', 'ACT-6'], '7.6': ['ACT-3'], '7.7': ['ACT-3'],
};
for (const [mod, entry] of Object.entries(MODULE_FRAMEWORK_MAPPINGS)) {
  if (entry.AU) {
    entry['AU-QLD'] = entry.AU;
    entry['AU-TAS'] = entry.AU;
  }
  if (NT_MODULE_MAP[mod]) entry['AU-NT'] = NT_MODULE_MAP[mod];
  if (ACT_MODULE_MAP[mod]) entry['AU-ACT'] = ACT_MODULE_MAP[mod];
}

// The general "when they're here" on-site experience modules. Only these pick up
// the facility service-domain overlay (Layer 2). Employment/policy/support/comms
// modules keep their inherent domains regardless of sector.
export const FACILITY_CONTEXT_MODULES = new Set<string>([
  '2.1', '2.2', '2.3', '2.4',
  '3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11', '3.12',
  '6.1', '6.2', '6.3', '6.4', '6.5',
  '7.1', '7.2', '7.3', '7.4', '7.6', '7.7',
]);

// Layer 2: framework -> business_type (industry) -> service-domain IDs.
// Corporate deliberately omitted: its D2 relevance comes from its employment
// modules, not from its physical facilities.
export const INDUSTRY_SERVICE_DOMAINS: Record<string, Record<string, string[]>> = {
  'AU-SA': {
    'leisure-recreation': ['SDIP-4'],
    'health-wellness': ['SDIP-4'],
    'education-training': ['SDIP-2'],
  },
  AU: {
    'leisure-recreation': ['ADS-6'],
    'health-wellness': ['ADS-6'],
    'education-training': ['ADS-5'],
  },
  // QLD and TAS reuse the ADS outcomes, so the same overlay applies.
  'AU-QLD': {
    'leisure-recreation': ['ADS-6'],
    'health-wellness': ['ADS-6'],
    'education-training': ['ADS-5'],
  },
  'AU-TAS': {
    'leisure-recreation': ['ADS-6'],
    'health-wellness': ['ADS-6'],
    'education-training': ['ADS-5'],
  },
  'AU-NT': {
    'leisure-recreation': ['NT-5'],
    'health-wellness': ['NT-5'],
  },
  'AU-ACT': {
    'leisure-recreation': ['ACT-2'],
    'health-wellness': ['ACT-2'],
    'education-training': ['ACT-6'],
  },
  // VIC (s38) and NSW (focus areas) have no health/education outcome domain,
  // so facility sector adds nothing beyond the module's inherent Layer 1 domain.
};

// Layer 1.5a: question-category -> framework domain refinement. A question's own
// category (from accessModules) reflects what it is actually about, independent
// of its module, so an action inherits the right domain even when its module is
// a grab-bag. Only "distinctive" categories that clearly imply a domain are
// listed; generic buckets (operational, policy, improvement, evidence,
// measurement) fall back to the module default. DRAFT - VIC + national first;
// other jurisdictions to follow. QLD/TAS reuse the AU (ADS) values (aliased below).
export const CATEGORY_FRAMEWORK_OVERRIDES: Record<string, Record<string, string[]>> = {
  training: { 'AU-VIC': ['VIC-D'], AU: ['ADS-7'] },
  feedback: { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  employment: { 'AU-VIC': ['VIC-B'], AU: ['ADS-1'] },
  procurement: { 'AU-VIC': ['VIC-A'], AU: ['ADS-4'] },
  'lived-experience': { 'AU-VIC': ['VIC-C'], AU: ['ADS-2'] },
  physical: { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  information: { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  digital: { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  communication: { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  'sensory-environment': { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  safety: { 'AU-VIC': ['VIC-A'], AU: ['ADS-3'] },
};

// Layer 1.5b: specific per-question overrides for questions whose OWN category is
// misleading or resolved by the classify+verify pass. Keyed by base question id.
// Highest-precedence auto layer (below only a manual per-item move). The bulk
// comes from the generated classification file; hand-authored entries below win.
export const QUESTION_FRAMEWORK_OVERRIDES: Record<string, Record<string, string[]>> = {
  ...AUTO_QUESTION_FRAMEWORK_OVERRIDES,
  // Hand-authored overrides win over the generated classification. Kept current
  // with question wording changes so filing matches the latest text. AU values
  // are aliased to QLD/TAS by the loop below.
  // "Do you have a process for handling accessibility-related complaints?" (5.1)
  '5.1-D-12': { 'AU-VIC': ['VIC-A'], AU: ['ADS-2'] },
  // "Is there a pathway for people with disability to progress into leadership
  // and decision-making positions?" - employment progression into leadership.
  '5.1-D-16': { 'AU-VIC': ['VIC-B', 'VIC-C'], 'AU-NSW': ['NSW-3'], 'AU-WA': ['WA-7'], 'AU-SA': ['SDIP-2'], AU: ['ADS-1'], 'AU-NT': ['NT-4'], 'AU-ACT': ['ACT-6'] },
  // "When creating marketing that represents disability, do you draw on
  // lived-experience expertise?" - lived-experience involvement + representation.
  '1.6-DD-2a': { 'AU-VIC': ['VIC-C'], 'AU-NSW': ['NSW-1'], 'AU-WA': ['WA-6'], 'AU-SA': ['SDIP-1'], AU: ['ADS-7'], 'AU-NT': ['NT-2'], 'AU-ACT': ['ACT-3'] },
  // "Do you include Disabled staff in customer-facing decisions where their
  // expertise is relevant?" - inclusive employment culture (module 5.10).
  '5.10-DD-11': { 'AU-VIC': ['VIC-B', 'VIC-C'], 'AU-NSW': ['NSW-3'], 'AU-WA': ['WA-7'], 'AU-SA': ['SDIP-2'], AU: ['ADS-1'], 'AU-NT': ['NT-4'], 'AU-ACT': ['ACT-6'] },
};

// QLD and TAS reuse the national ADS domains, so alias the AU category values.
for (const cat of Object.keys(CATEGORY_FRAMEWORK_OVERRIDES)) {
  const au = CATEGORY_FRAMEWORK_OVERRIDES[cat].AU;
  if (au) {
    CATEGORY_FRAMEWORK_OVERRIDES[cat]['AU-QLD'] = au;
    CATEGORY_FRAMEWORK_OVERRIDES[cat]['AU-TAS'] = au;
  }
}
for (const qid of Object.keys(QUESTION_FRAMEWORK_OVERRIDES)) {
  const au = QUESTION_FRAMEWORK_OVERRIDES[qid].AU;
  if (au) {
    QUESTION_FRAMEWORK_OVERRIDES[qid]['AU-QLD'] = au;
    QUESTION_FRAMEWORK_OVERRIDES[qid]['AU-TAS'] = au;
  }
}

/**
 * Domains a module's findings contribute to, for a given framework and the
 * completing business's ticked types. Precedence (highest first):
 *   1. moduleOverride     - a per-org explicit choice, wins outright.
 *   2. question.id        - a per-question override (misleading category fix).
 *   3. question.category  - a distinctive-category refinement.
 *   4. module default      - the module's inherent domain(s).
 * Layers 2-4 also pick up the Layer 2 facility service overlay for facility
 * modules. Returns [] when the framework has no mappings yet.
 */
export function domainsForModule(
  moduleId: string,
  frameworkKey: string | null | undefined,
  businessTypes: string[] = [],
  moduleOverride?: string[],
  question?: { id?: string | null; category?: string | null }
): string[] {
  if (!frameworkKey || !FRAMEWORKS[frameworkKey]) return [];
  const valid = new Set(FRAMEWORKS[frameworkKey].domains.map((d) => d.id));
  // A per-org override is the council's explicit choice - it wins outright
  // (no auto layers), so their tuning is respected exactly.
  if (moduleOverride) {
    return moduleOverride.filter((d) => valid.has(d));
  }
  // Question-level then category-level refinement replaces the module default.
  const qid = question?.id;
  const qOverride = qid ? QUESTION_FRAMEWORK_OVERRIDES[qid]?.[frameworkKey] : undefined;
  const cat = question?.category;
  const cOverride = cat ? CATEGORY_FRAMEWORK_OVERRIDES[cat]?.[frameworkKey] : undefined;
  const base = qOverride ?? cOverride ?? MODULE_FRAMEWORK_MAPPINGS[moduleId]?.[frameworkKey] ?? [];
  const domains = new Set(base.filter((d) => valid.has(d)));
  if (FACILITY_CONTEXT_MODULES.has(moduleId)) {
    const overlay = INDUSTRY_SERVICE_DOMAINS[frameworkKey] ?? {};
    for (const type of businessTypes) {
      for (const d of overlay[type] ?? []) domains.add(d);
    }
  }
  return [...domains];
}

/** True once a jurisdiction has module mappings (drives "coming soon" gating). */
export function hasMappings(frameworkKey: string | null | undefined): boolean {
  if (!frameworkKey) return false;
  return Object.values(MODULE_FRAMEWORK_MAPPINGS).some((m) => m[frameworkKey]?.length);
}
