/**
 * Outcomes aggregation - the Statutory Plan Alignment core.
 *
 * Rolls per-business, per-module confidence bands up into the council's
 * framework domains, applying the two-layer mapping (inherent + facility
 * overlay) plus any per-org domain overrides. Pure function: the caller
 * supplies the data (fetched from get_program_cohort_summaries + a
 * child_org -> business_types lookup), so this stays testable and DB-free.
 *
 * Privacy: input is per-business only to attribute the facility sector; the
 * OUTPUT is domain-level counts only - no business identity leaves this layer.
 */

import { FRAMEWORKS, getFramework } from '../data/frameworks';
import { domainsForModule } from '../data/frameworkMappings';

export type ConfidenceBand = 'strong' | 'mixed' | 'needs_work';

export interface BusinessModuleConfidence {
  /** child_org_id - used only to look up the business's sector, never emitted. */
  businessId: string;
  moduleId: string;
  band: ConfidenceBand | null;
}

/** Per-org overrides stored in organisations.domain_overrides. */
export interface DomainOverrides {
  module?: Record<string, string[]>;
  action?: Record<string, string[]>;
}

export interface DomainAggregate {
  domainId: string;
  name: string;
  short: string;
  outcomeStatement?: string;
  moduleIds: string[];
  strong: number;
  mixed: number;
  needsWork: number;
  total: number;
  /** % of assessed findings in each band (0 when total is 0). */
  strongPct: number;
  mixedPct: number;
  needsWorkPct: number;
}

/** Normalise the various confidence spellings to our three bands. */
export function normaliseBand(raw: string | null | undefined): ConfidenceBand | null {
  if (!raw) return null;
  const v = raw.toLowerCase().replace(/[\s-]+/g, '_');
  if (v.includes('strong') || v === 'high') return 'strong';
  if (v.includes('needs') || v === 'low') return 'needs_work';
  if (v.includes('mixed') || v.includes('medium') || v.includes('partial')) return 'mixed';
  return null;
}

function pct(n: number, total: number): number {
  return total > 0 ? Math.round((n / total) * 100) : 0;
}

/**
 * Aggregate per-business confidence into framework domains.
 * Always returns every domain of the framework (empty ones included, so the
 * report honestly shows coverage gaps like Health & wellbeing).
 */
export function aggregateDomains(
  rows: BusinessModuleConfidence[],
  businessTypesById: Record<string, string[]>,
  frameworkKey: string | null | undefined,
  overrides: DomainOverrides = {}
): DomainAggregate[] {
  const framework = getFramework(frameworkKey);
  const key = FRAMEWORKS[frameworkKey ?? ''] ? (frameworkKey as string) : framework.key;

  const acc: Record<string, { strong: number; mixed: number; needsWork: number; modules: Set<string> }> = {};
  for (const d of framework.domains) {
    acc[d.id] = { strong: 0, mixed: 0, needsWork: 0, modules: new Set() };
  }

  for (const row of rows) {
    const band = row.band;
    if (!band) continue;
    const businessTypes = businessTypesById[row.businessId] ?? [];
    const moduleOverride = overrides.module?.[row.moduleId];
    const domains = domainsForModule(row.moduleId, key, businessTypes, moduleOverride);
    for (const domainId of domains) {
      const bucket = acc[domainId];
      if (!bucket) continue; // domain not in this framework
      bucket.modules.add(row.moduleId);
      if (band === 'strong') bucket.strong += 1;
      else if (band === 'mixed') bucket.mixed += 1;
      else bucket.needsWork += 1;
    }
  }

  return framework.domains.map((d) => {
    const b = acc[d.id];
    const total = b.strong + b.mixed + b.needsWork;
    return {
      domainId: d.id,
      name: d.name,
      short: d.short,
      outcomeStatement: d.outcomeStatement,
      moduleIds: [...b.modules].sort(),
      strong: b.strong,
      mixed: b.mixed,
      needsWork: b.needsWork,
      total,
      strongPct: pct(b.strong, total),
      mixedPct: pct(b.mixed, total),
      needsWorkPct: pct(b.needsWork, total),
    };
  });
}
