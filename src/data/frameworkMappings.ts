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

// Layer 1: module -> framework -> domain IDs
export const MODULE_FRAMEWORK_MAPPINGS: Record<string, Record<string, string[]>> = {
  // Before arrival - information & communications
  '1.1': { 'AU-SA': ['SDIP-1'] },
  '1.2': { 'AU-SA': ['SDIP-1'] },
  '1.3': { 'AU-SA': ['SDIP-1'] },
  '1.4': { 'AU-SA': ['SDIP-1'] },
  '1.5': { 'AU-SA': ['SDIP-1'] },
  '1.6': { 'AU-SA': ['SDIP-1'] },
  // Getting in - built environment
  '2.1': { 'AU-SA': ['SDIP-1'] },
  '2.2': { 'AU-SA': ['SDIP-1'] },
  '2.3': { 'AU-SA': ['SDIP-1'] },
  '2.4': { 'AU-SA': ['SDIP-1'] },
  // During visit - on-site environment & participation
  '3.1': { 'AU-SA': ['SDIP-1'] },
  '3.2': { 'AU-SA': ['SDIP-1'] },
  '3.3': { 'AU-SA': ['SDIP-1'] },
  '3.4': { 'AU-SA': ['SDIP-1'] },
  '3.5': { 'AU-SA': ['SDIP-1'] },
  '3.6': { 'AU-SA': ['SDIP-1'] },
  '3.7': { 'AU-SA': ['SDIP-1'] },
  '3.8': { 'AU-SA': ['SDIP-1'] },
  '3.9': { 'AU-SA': ['SDIP-1'] },
  '3.10': { 'AU-SA': ['SDIP-1'] },
  '3.11': { 'AU-SA': ['SDIP-1'] },
  '3.12': { 'AU-SA': ['SDIP-1'] },
  // Service & support
  '4.1': { 'AU-SA': ['SDIP-3'] },
  '4.2': { 'AU-SA': ['SDIP-1', 'SDIP-3'] }, // customer service = community attitudes + support
  '4.3': { 'AU-SA': ['SDIP-3'] },
  '4.4': { 'AU-SA': ['SDIP-5'] }, // safety & emergencies
  '4.5': { 'AU-SA': ['SDIP-3'] },
  '4.6': { 'AU-SA': ['SDIP-3'] },
  '4.7': { 'AU-SA': ['SDIP-3'] },
  // Organisation / policy & operations
  '5.1': { 'AU-SA': ['SDIP-1', 'SDIP-5'] }, // policy & inclusion = communities + rights
  '5.3': { 'AU-SA': ['SDIP-1'] },
  '5.4': { 'AU-SA': ['SDIP-3'] },
  '5.5': { 'AU-SA': ['SDIP-1'] },
  '5.6': { 'AU-SA': ['SDIP-3'] },
  // Employment (inclusive working environments + employment opportunities)
  '5.7': { 'AU-SA': ['SDIP-2', 'SDIP-1'] },
  '5.8': { 'AU-SA': ['SDIP-2', 'SDIP-1'] },
  '5.9': { 'AU-SA': ['SDIP-2', 'SDIP-1'] },
  '5.10': { 'AU-SA': ['SDIP-2', 'SDIP-1'] },
  // Events
  '6.1': { 'AU-SA': ['SDIP-1'] },
  '6.2': { 'AU-SA': ['SDIP-1'] },
  '6.3': { 'AU-SA': ['SDIP-1'] },
  '6.4': { 'AU-SA': ['SDIP-1'] },
  '6.5': { 'AU-SA': ['SDIP-1'] },
  // Major events
  '7.1': { 'AU-SA': ['SDIP-1'] },
  '7.2': { 'AU-SA': ['SDIP-1'] },
  '7.3': { 'AU-SA': ['SDIP-1'] },
  '7.4': { 'AU-SA': ['SDIP-1', 'SDIP-2'] }, // performer access = cultural participation + employment
  '7.5': { 'AU-SA': ['SDIP-1', 'SDIP-2'] }, // volunteers/staff = participation + workforce
  '7.6': { 'AU-SA': ['SDIP-1'] },
  '7.7': { 'AU-SA': ['SDIP-1'] },
};

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
};

/**
 * Domains a module's findings contribute to, for a given framework and the
 * completing business's ticked types. Combines Layer 1 + (for facility modules)
 * Layer 2. Returns [] when the framework has no mappings yet.
 */
export function domainsForModule(
  moduleId: string,
  frameworkKey: string | null | undefined,
  businessTypes: string[] = [],
  moduleOverride?: string[]
): string[] {
  if (!frameworkKey || !FRAMEWORKS[frameworkKey]) return [];
  // A per-org override is the council's explicit choice - it wins outright
  // (no auto layers), so their tuning is respected exactly.
  if (moduleOverride) {
    const valid = new Set(FRAMEWORKS[frameworkKey].domains.map((d) => d.id));
    return moduleOverride.filter((d) => valid.has(d));
  }
  const base = MODULE_FRAMEWORK_MAPPINGS[moduleId]?.[frameworkKey] ?? [];
  const domains = new Set(base);
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
