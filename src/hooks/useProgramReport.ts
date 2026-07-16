/**
 * useProgramReport
 *
 * Cohort-level reporting for an Authority program. Loads existing snapshots
 * from program_reports, generates new ones by calling the SECURITY DEFINER
 * RPCs added in migration 029 and aggregates priorities/strengths in JS
 * from the per-business module summaries.
 *
 * Privacy contract (see migration 015 + 029):
 *  - Counts and confidence bands only at module level
 *  - module_progress.summary jsonb is generated narrative (priorities,
 *    strengths, areas to explore), never raw question responses
 *  - No business names appear in the snapshot payload; child_org_id is
 *    used internally for de-duplication only
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { AuthorityProgram, AccessLevel } from '../types/access';
import { diapThemeForModules, type AggregateTheme } from '../utils/aggregateTheme';
import { getFramework } from '../data/frameworks';
import { hasMappings } from '../data/frameworkMappings';
import {
  aggregateDomains,
  normaliseBand,
  type BusinessModuleConfidence,
  type DomainAggregate,
  type DomainOverrides,
} from '../lib/outcomesAggregation';

// =====================================================
// Types
// =====================================================

export interface ModuleAggregate {
  module_id: string;
  total_enrolments: number;
  completed: number;
  in_progress: number;
  not_started: number;
  confidence_strong: number;
  confidence_mixed: number;
  confidence_needs_work: number;
}

interface CohortSummaryRow {
  child_org_id: string;
  module_id: string;
  status: string | null;
  confidence_snapshot: string | null;
  summary: ModuleSummaryJson | null;
  completed_at: string | null;
}

interface ModuleSummaryJson {
  doingWell?: string[];
  priorityActions?: Array<string | { action: string; priority?: string; timeframe?: string }>;
  areasToExplore?: Array<string | { action: string }>;
}

export type { AggregateTheme };

export interface PriorityActionAggregate {
  action: string;
  count: number;
  priority?: string;
  moduleIds: string[];
  theme?: AggregateTheme;
}

export interface StrengthAggregate {
  text: string;
  count: number;
  moduleIds: string[];
  theme?: AggregateTheme;
}

export interface AreaToExploreAggregate {
  text: string;
  count: number;
}

export interface EnrolmentCounts {
  total: number;
  completed: number;
  submitted: number;
  in_progress: number;
  enrolled: number;
}

export interface OutcomesSnapshot {
  frameworkKey: string;
  frameworkName: string;
  frameworkShort: string;
  citation: string;
  domains: DomainAggregate[];
}

// Before/after improvement across the cohort, computed only from businesses that
// have assessed more than once (a baseline archived to snapshots plus a current
// run). Readiness is a band-weighted score (strong 100 / mixed 50 / needs-work
// 0). Absent when the baseline RPC (migration 037) is unavailable or no business
// has re-assessed yet - so it is never a fabricated "before".
export interface ProgramImprovement {
  reassessedCount: number;
  improvedCount: number;
  avgBaselineReadiness: number;
  avgCurrentReadiness: number;
  avgDelta: number;
}

export interface ProgramReportPayload {
  generatedAt: string;
  program: {
    id: string;
    name: string;
    description: string | null;
    accessLevel: AccessLevel;
    moduleIds: string[];
  };
  authority: {
    id: string;
    name: string;
  };
  enrolment: EnrolmentCounts;
  moduleAggregates: ModuleAggregate[];
  topPriorityActions: PriorityActionAggregate[];
  topStrengths: StrengthAggregate[];
  topAreasToExplore: AreaToExploreAggregate[];
  methodology: string;
  /** Statutory framework domain roll-up. Absent on snapshots generated before
   *  the Statutory Plan Alignment feature or when jurisdiction has no mappings. */
  outcomes?: OutcomesSnapshot;
  /** Before/after readiness improvement for the re-assessed subset. Absent when
   *  migration 037 is not applied or no business has re-assessed. */
  improvement?: ProgramImprovement;
}

export interface ProgramReportRow {
  id: string;
  program_id: string;
  organisation_id: string;
  name: string;
  generated_by_user_id: string | null;
  generated_at: string;
  access_level: AccessLevel | null;
  module_ids_snapshot: string[];
  enrolment_count: number;
  completed_count: number;
  submitted_count: number;
  in_progress_count: number;
  snapshot_data: ProgramReportPayload;
  created_at: string;
  updated_at: string;
}

const METHODOLOGY_NOTE =
  'Program reports aggregate completion and confidence bands across enrolled businesses. ' +
  'Priority actions and strengths are generated narrative from each business assessment, not raw question responses. ' +
  'Individual responses, evidence files and DIAP details remain private to each business.';

// =====================================================
// Hook
// =====================================================

export function useProgramReport(programId: string | null) {
  const { user, accessState } = useAuth();
  const [snapshots, setSnapshots] = useState<ProgramReportRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSnapshots = useCallback(async () => {
    if (!programId || !isSupabaseEnabled() || !supabase) return;
    setIsLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('program_reports')
      .select('*')
      .eq('program_id', programId)
      .order('generated_at', { ascending: false });
    setIsLoading(false);
    if (fetchError) {
      setError(fetchError.message);
      return;
    }
    setSnapshots((data as ProgramReportRow[]) ?? []);
  }, [programId]);

  useEffect(() => {
    if (programId) loadSnapshots();
  }, [programId, loadSnapshots]);

  const generateReport = useCallback(
    async (reportName?: string): Promise<ProgramReportRow | null> => {
      if (!programId || !isSupabaseEnabled() || !supabase || !user) return null;
      setIsGenerating(true);
      setError(null);

      try {
        const { data: programRow, error: pErr } = await supabase
          .from('authority_programs')
          .select('*')
          .eq('id', programId)
          .single();
        if (pErr || !programRow) throw new Error(pErr?.message || 'Program not found');
        const program = programRow as AuthorityProgram;

        const { data: enrolmentRows, error: eErr } = await supabase
          .from('program_enrolments')
          .select('status')
          .eq('program_id', programId);
        if (eErr) throw new Error(eErr.message);
        const enrolments = (enrolmentRows ?? []) as { status: string }[];
        const enrolmentCounts: EnrolmentCounts = {
          total: enrolments.length,
          completed: enrolments.filter(e => e.status === 'completed').length,
          submitted: enrolments.filter(e => e.status === 'submitted').length,
          in_progress: enrolments.filter(e => e.status === 'in_progress').length,
          enrolled: enrolments.filter(e => e.status === 'enrolled').length,
        };

        const [aggRes, sumRes] = await Promise.all([
          supabase.rpc('get_program_module_aggregates', { p_program_id: programId }),
          supabase.rpc('get_program_cohort_summaries', { p_program_id: programId }),
        ]);
        if (aggRes.error) throw new Error(aggRes.error.message);
        if (sumRes.error) throw new Error(sumRes.error.message);

        const moduleAggregates = (aggRes.data ?? []) as ModuleAggregate[];
        const cohortSummaries = (sumRes.data ?? []) as CohortSummaryRow[];

        const { topPriorityActions, topStrengths, topAreasToExplore } =
          aggregateCohortSummaries(cohortSummaries);

        // Statutory framework domain roll-up, baked into the snapshot so it
        // stays accurate to this point in time (privacy: domain counts only).
        const outcomes = await computeOutcomes(programId, program.organisation_id, cohortSummaries);

        // Before/after improvement (re-assessed subset only; omitted if the
        // baseline RPC is unavailable or nobody has re-assessed).
        const improvement = await computeImprovement(programId, cohortSummaries);

        const payload: ProgramReportPayload = {
          generatedAt: new Date().toISOString(),
          program: {
            id: program.id,
            name: program.name,
            description: program.description ?? null,
            accessLevel: program.access_level,
            moduleIds: program.required_module_ids,
          },
          authority: {
            id: accessState.organisation?.id ?? '',
            name: accessState.organisation?.name ?? '',
          },
          enrolment: enrolmentCounts,
          moduleAggregates,
          topPriorityActions,
          topStrengths,
          topAreasToExplore,
          methodology: METHODOLOGY_NOTE,
          outcomes,
          improvement,
        };

        const dateLabel = new Date().toLocaleDateString('en-AU', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        const defaultName = reportName?.trim() || `${program.name} report ${dateLabel}`;

        const { data: inserted, error: insErr } = await supabase
          .from('program_reports')
          .insert({
            program_id: programId,
            organisation_id: program.organisation_id,
            name: defaultName,
            generated_by_user_id: user.id,
            access_level: program.access_level,
            module_ids_snapshot: program.required_module_ids,
            enrolment_count: enrolmentCounts.total,
            completed_count: enrolmentCounts.completed,
            submitted_count: enrolmentCounts.submitted,
            in_progress_count: enrolmentCounts.in_progress,
            snapshot_data: payload,
          })
          .select()
          .single();
        if (insErr || !inserted) throw new Error(insErr?.message || 'Failed to save snapshot');

        const newRow = inserted as ProgramReportRow;
        setSnapshots(prev => [newRow, ...prev]);
        return newRow;
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [programId, user, accessState],
  );

  const deleteSnapshot = useCallback(async (snapshotId: string): Promise<boolean> => {
    if (!isSupabaseEnabled() || !supabase) return false;
    const { error: dErr } = await supabase
      .from('program_reports')
      .delete()
      .eq('id', snapshotId);
    if (dErr) {
      setError(dErr.message);
      return false;
    }
    setSnapshots(prev => prev.filter(s => s.id !== snapshotId));
    return true;
  }, []);

  const renameSnapshot = useCallback(
    async (snapshotId: string, newName: string): Promise<boolean> => {
      if (!isSupabaseEnabled() || !supabase) return false;
      const trimmed = newName.trim();
      if (!trimmed) return false;
      const { error: uErr } = await supabase
        .from('program_reports')
        .update({ name: trimmed })
        .eq('id', snapshotId);
      if (uErr) {
        setError(uErr.message);
        return false;
      }
      setSnapshots(prev => prev.map(s => (s.id === snapshotId ? { ...s, name: trimmed } : s)));
      return true;
    },
    [],
  );

  return {
    snapshots,
    isLoading,
    isGenerating,
    error,
    generateReport,
    deleteSnapshot,
    renameSnapshot,
    reload: loadSnapshots,
  };
}

// =====================================================
// JS-side aggregation
// =====================================================


function aggregateCohortSummaries(rows: CohortSummaryRow[]): {
  topPriorityActions: PriorityActionAggregate[];
  topStrengths: StrengthAggregate[];
  topAreasToExplore: AreaToExploreAggregate[];
} {
  // Count DISTINCT businesses per item, not (business, module) occurrences: a
  // business that flags the same action across two modules must count once, or
  // a pattern's "N businesses" can exceed the number of enrolled businesses.
  const priorityMap = new Map<string, { action: string; priority?: string; moduleIds: string[]; businesses: Set<string> }>();
  const strengthMap = new Map<string, { text: string; moduleIds: string[]; businesses: Set<string> }>();
  const areaMap = new Map<string, { text: string; businesses: Set<string> }>();

  for (const row of rows) {
    if (!row.summary) continue;
    const moduleId = row.module_id;
    const business = row.child_org_id;

    for (const pa of row.summary.priorityActions ?? []) {
      const text = typeof pa === 'string' ? pa : pa.action;
      if (!text) continue;
      const key = normaliseText(text);
      const existing = priorityMap.get(key);
      if (existing) {
        existing.businesses.add(business);
        if (!existing.moduleIds.includes(moduleId)) existing.moduleIds.push(moduleId);
      } else {
        priorityMap.set(key, {
          action: text,
          priority: typeof pa === 'string' ? undefined : pa.priority,
          moduleIds: [moduleId],
          businesses: new Set([business]),
        });
      }
    }

    for (const s of row.summary.doingWell ?? []) {
      if (!s) continue;
      const key = normaliseText(s);
      const existing = strengthMap.get(key);
      if (existing) {
        existing.businesses.add(business);
        if (!existing.moduleIds.includes(moduleId)) existing.moduleIds.push(moduleId);
      } else {
        strengthMap.set(key, { text: s, moduleIds: [moduleId], businesses: new Set([business]) });
      }
    }

    for (const a of row.summary.areasToExplore ?? []) {
      const text = typeof a === 'string' ? a : a.action;
      if (!text) continue;
      const key = normaliseText(text);
      const existing = areaMap.get(key);
      if (existing) {
        existing.businesses.add(business);
      } else {
        areaMap.set(key, { text, businesses: new Set([business]) });
      }
    }
  }

  const byCount = <T extends { count: number }>(a: T, b: T) => b.count - a.count;

  const priorityActions: PriorityActionAggregate[] = Array.from(priorityMap.values()).map(v => ({
    action: v.action,
    count: v.businesses.size,
    priority: v.priority,
    moduleIds: v.moduleIds,
    theme: diapThemeForModules(v.moduleIds),
  }));
  const strengths: StrengthAggregate[] = Array.from(strengthMap.values()).map(v => ({
    text: v.text,
    count: v.businesses.size,
    moduleIds: v.moduleIds,
    theme: diapThemeForModules(v.moduleIds),
  }));

  return {
    topPriorityActions: priorityActions.sort(byCount).slice(0, 20),
    topStrengths: strengths.sort(byCount).slice(0, 15),
    topAreasToExplore: Array.from(areaMap.values())
      .map(v => ({ text: v.text, count: v.businesses.size }))
      .sort(byCount).slice(0, 10),
  };
}

function normaliseText(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,;:!?]+$/g, '');
}

/**
 * Roll cohort confidence up into the authority's framework domains.
 * Returns undefined when the org's jurisdiction has no module mappings yet
 * (e.g. AU until Session 2), so the Outcomes view is simply hidden there.
 */
async function computeOutcomes(
  programId: string,
  orgId: string,
  cohortSummaries: CohortSummaryRow[],
): Promise<OutcomesSnapshot | undefined> {
  if (!supabase) return undefined;

  const { data: orgRow } = await supabase
    .from('organisations')
    .select('jurisdiction, domain_overrides')
    .eq('id', orgId)
    .single();
  const jurisdiction = (orgRow?.jurisdiction as string) || 'AU';
  if (!hasMappings(jurisdiction)) return undefined;
  const overrides = (orgRow?.domain_overrides as DomainOverrides) ?? {};

  // Per-business sectors for the Layer 2 facility overlay. Tolerate the RPC
  // being unavailable (migration 031 not yet applied) - fall back to Layer 1.
  const businessTypesById: Record<string, string[]> = {};
  try {
    const secRes = await supabase.rpc('get_program_business_sectors', { p_program_id: programId });
    if (!secRes.error && Array.isArray(secRes.data)) {
      for (const s of secRes.data as { child_org_id: string; business_types: string[] }[]) {
        businessTypesById[s.child_org_id] = s.business_types ?? [];
      }
    }
  } catch {
    /* Layer 1 only */
  }

  const rows: BusinessModuleConfidence[] = cohortSummaries.map((r) => ({
    businessId: r.child_org_id,
    moduleId: r.module_id,
    band: normaliseBand(r.confidence_snapshot),
  }));
  const domains = aggregateDomains(rows, businessTypesById, jurisdiction, overrides);
  const fw = getFramework(jurisdiction);
  return {
    frameworkKey: fw.key,
    frameworkName: fw.name,
    frameworkShort: fw.short,
    citation: fw.citation,
    domains,
  };
}

// Band-weighted readiness score for a single module assessment.
function bandScore(band: string | null | undefined): number | null {
  switch ((band ?? '').toLowerCase().replace(/[_\s]+/g, '-')) {
    case 'strong': return 100;
    case 'mixed': return 50;
    case 'needs-work': return 0;
    default: return null;
  }
}

// Cohort before/after improvement. Baseline = earliest archived confidence per
// (business, module) from the get_program_baseline_readiness RPC; current = the
// live band from the cohort summaries. Compared per business over the modules
// where BOTH exist, so only genuinely re-assessed businesses count. Tolerates
// the RPC being absent (migration 037 not applied) - returns undefined so the
// report simply omits the section rather than inventing a "before".
async function computeImprovement(
  programId: string,
  cohortSummaries: CohortSummaryRow[],
): Promise<ProgramImprovement | undefined> {
  if (!supabase) return undefined;
  let baselineRows: { child_org_id: string; module_id: string; baseline_confidence: string | null }[] = [];
  try {
    const res = await supabase.rpc('get_program_baseline_readiness', { p_program_id: programId });
    if (res.error || !Array.isArray(res.data)) return undefined;
    baselineRows = res.data as typeof baselineRows;
  } catch {
    return undefined;
  }
  if (baselineRows.length === 0) return undefined;

  const baseline = new Map<string, number>();
  for (const r of baselineRows) {
    const s = bandScore(r.baseline_confidence);
    if (s !== null) baseline.set(`${r.child_org_id}|${r.module_id}`, s);
  }
  const current = new Map<string, number>();
  for (const r of cohortSummaries) {
    const s = bandScore(r.confidence_snapshot);
    if (s !== null) current.set(`${r.child_org_id}|${r.module_id}`, s);
  }

  // Per business, average baseline vs current over modules present in both.
  const perBiz = new Map<string, { base: number[]; curr: number[] }>();
  for (const [key, baseScore] of baseline) {
    const currScore = current.get(key);
    if (currScore === undefined) continue;
    const org = key.split('|')[0];
    let e = perBiz.get(org);
    if (!e) { e = { base: [], curr: [] }; perBiz.set(org, e); }
    e.base.push(baseScore);
    e.curr.push(currScore);
  }
  if (perBiz.size === 0) return undefined;

  const mean = (a: number[]) => a.reduce((sum, x) => sum + x, 0) / a.length;
  let improved = 0;
  const baseAvgs: number[] = [];
  const currAvgs: number[] = [];
  for (const { base, curr } of perBiz.values()) {
    const b = mean(base);
    const c = mean(curr);
    baseAvgs.push(b);
    currAvgs.push(c);
    if (c > b) improved += 1;
  }
  const avgBaselineReadiness = Math.round(mean(baseAvgs));
  const avgCurrentReadiness = Math.round(mean(currAvgs));
  return {
    reassessedCount: perBiz.size,
    improvedCount: improved,
    avgBaselineReadiness,
    avgCurrentReadiness,
    avgDelta: avgCurrentReadiness - avgBaselineReadiness,
  };
}
