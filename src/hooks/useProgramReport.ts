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
import { diapThemeForModules, diapThemeForAction, type AggregateTheme } from '../utils/aggregateTheme';
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
  priorityActions?: Array<string | { action: string; priority?: string; timeframe?: string; questionId?: string }>;
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
          .select('organisation_id, status')
          .eq('program_id', programId);
        if (eErr) throw new Error(eErr.message);
        const enrolments = (enrolmentRows ?? []) as { organisation_id: string; status: string }[];
        // Withdrawn businesses are excluded from every figure; the non-withdrawn
        // enrolment roster is the source of truth for who is in the program.
        const rosterIds = new Set(
          enrolments.filter(e => e.status !== 'withdrawn').map(e => e.organisation_id),
        );

        const { data: sumData, error: sErr } =
          await supabase.rpc('get_program_cohort_summaries', { p_program_id: programId });
        if (sErr) throw new Error(sErr.message);
        // module_progress holds a row per session/site, so a business can appear
        // many times per module. Keep only its latest run per module (and drop
        // withdrawn businesses) so every figure counts distinct businesses, not
        // runs, and stale recommendations from superseded runs are excluded.
        const cohortSummaries = latestRunPerBusinessModule(
          ((sumData ?? []) as CohortSummaryRow[]).filter(r => rosterIds.has(r.child_org_id)),
        );

        // Module + enrolment rollups are computed from that deduped set rather
        // than from program_enrolments.status (which the app never advances past
        // 'enrolled'), so completion reflects actual module progress.
        const moduleAggregates = computeModuleAggregates(program.required_module_ids, rosterIds, cohortSummaries);
        const enrolmentCounts = computeEnrolmentCounts(program.required_module_ids, rosterIds, cohortSummaries);

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

        // The saved-reports card renders the generated date alongside the name,
        // so the default name omits it to avoid showing the date twice.
        const defaultName = reportName?.trim() || `${program.name} report`;

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


// Collapse module_progress rows (one per session/site) to a single latest run
// per (business, module): prefer the most recently completed, else any started.
function latestRunPerBusinessModule(rows: CohortSummaryRow[]): CohortSummaryRow[] {
  const rank = (r: CohortSummaryRow) =>
    r.completed_at ? new Date(r.completed_at).getTime() : (r.status === 'completed' ? 0 : -1);
  const best = new Map<string, CohortSummaryRow>();
  for (const r of rows) {
    const key = `${r.child_org_id}::${r.module_id}`;
    const cur = best.get(key);
    if (!cur || rank(r) > rank(cur)) best.set(key, r);
  }
  return Array.from(best.values());
}

// Per-module completion + confidence distribution across the cohort, counting
// distinct businesses (the input is already one latest run per business-module).
function computeModuleAggregates(
  requiredModuleIds: string[],
  rosterIds: Set<string>,
  latest: CohortSummaryRow[],
): ModuleAggregate[] {
  const total = rosterIds.size;
  const byModule = new Map<string, CohortSummaryRow[]>();
  for (const r of latest) {
    const arr = byModule.get(r.module_id);
    if (arr) arr.push(r); else byModule.set(r.module_id, [r]);
  }
  return requiredModuleIds.map(mid => {
    const rows = byModule.get(mid) ?? [];
    const completed = rows.filter(r => r.status === 'completed').length;
    const inProgress = rows.filter(r => r.status === 'in-progress').length;
    return {
      module_id: mid,
      total_enrolments: total,
      completed,
      in_progress: inProgress,
      not_started: Math.max(0, total - completed - inProgress),
      confidence_strong: rows.filter(r => r.confidence_snapshot === 'strong').length,
      confidence_mixed: rows.filter(r => r.confidence_snapshot === 'mixed').length,
      confidence_needs_work: rows.filter(r => r.confidence_snapshot === 'needs-work').length,
    };
  });
}

// Business-level enrolment breakdown derived from actual module progress: a
// business is "completed" once every required module has a completed latest run.
function computeEnrolmentCounts(
  requiredModuleIds: string[],
  rosterIds: Set<string>,
  latest: CohortSummaryRow[],
): EnrolmentCounts {
  const required = new Set(requiredModuleIds);
  const completedByOrg = new Map<string, number>();
  const startedOrgs = new Set<string>();
  for (const r of latest) {
    if (!required.has(r.module_id)) continue;
    if (r.status === 'completed') completedByOrg.set(r.child_org_id, (completedByOrg.get(r.child_org_id) ?? 0) + 1);
    if (r.status === 'completed' || r.status === 'in-progress') startedOrgs.add(r.child_org_id);
  }
  let completed = 0;
  for (const org of rosterIds) {
    if (required.size > 0 && (completedByOrg.get(org) ?? 0) >= required.size) completed += 1;
  }
  const started = [...startedOrgs].filter(o => rosterIds.has(o)).length;
  return {
    total: rosterIds.size,
    completed,
    submitted: 0,
    in_progress: Math.max(0, started - completed),
    enrolled: Math.max(0, rosterIds.size - started),
  };
}

// The priority shown for a cohort pattern is the one MOST assessments assigned,
// not the single most-severe one. A lone business rating an item "high" should
// not promote a pattern that is "medium" for everyone else. Ties break toward
// the more severe level (iteration is severe-first with a strict >).
function modalPriority(votes: Record<string, number>): string | undefined {
  let best: string | undefined;
  let bestCount = 0;
  for (const p of ['high', 'medium', 'low']) {
    const c = votes[p] ?? 0;
    if (c > bestCount) {
      bestCount = c;
      best = p;
    }
  }
  return best;
}

function aggregateCohortSummaries(rows: CohortSummaryRow[]): {
  topPriorityActions: PriorityActionAggregate[];
  topStrengths: StrengthAggregate[];
  topAreasToExplore: AreaToExploreAggregate[];
} {
  // Count DISTINCT businesses per item, not (business, module) occurrences: a
  // business that flags the same action across two modules must count once, or
  // a pattern's "N businesses" can exceed the number of enrolled businesses.
  const priorityMap = new Map<string, { action: string; priorityVotes: Record<string, number>; moduleIds: string[]; businesses: Set<string>; questionId?: string }>();
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
      const priority = typeof pa === 'string' ? undefined : pa.priority;
      const questionId = typeof pa === 'string' ? undefined : pa.questionId;
      const existing = priorityMap.get(key);
      if (existing) {
        existing.businesses.add(business);
        if (!existing.moduleIds.includes(moduleId)) existing.moduleIds.push(moduleId);
        if (!existing.questionId && questionId) existing.questionId = questionId;
        // Tally each assessment's priority so the pattern can show the level
        // MOST assigned it, rather than being promoted by a single outlier.
        if (priority) existing.priorityVotes[priority] = (existing.priorityVotes[priority] ?? 0) + 1;
      } else {
        priorityMap.set(key, {
          action: text,
          priorityVotes: priority ? { [priority]: 1 } : {},
          moduleIds: [moduleId],
          businesses: new Set([business]),
          questionId,
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
    priority: modalPriority(v.priorityVotes),
    moduleIds: v.moduleIds,
    // Theme by the source question's own topic (content), not just its module,
    // so a website/WCAG action from a physical module lands in the right area.
    theme: diapThemeForAction(v.questionId, v.moduleIds),
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
