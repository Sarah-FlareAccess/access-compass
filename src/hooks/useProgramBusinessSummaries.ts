/**
 * Per-business strengths and opportunities for a program, for the host view.
 *
 * Reads the same SECURITY DEFINER function the cohort report uses, but groups
 * by business instead of rolling up to the cohort. That function returns
 * generated narrative only, never raw question responses, so nothing here can
 * expose an individual answer.
 *
 * Modules that describe individual staff are dropped before grouping. See
 * authorityVisibility.ts.
 */
import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { isHiddenFromAuthority } from '../utils/authorityVisibility';

interface SummaryJson {
  doingWell?: string[];
  priorityActions?: Array<{ action?: string; priority?: string }>;
}

interface CohortRow {
  child_org_id: string;
  module_id: string;
  status: string | null;
  confidence_snapshot: string | null;
  summary: SummaryJson | null;
  completed_at: string | null;
}

export interface BusinessInsightItem {
  text: string;
  moduleId: string;
  priority?: string;
}

export interface BusinessInsight {
  childOrgId: string;
  /** Modules this business has a summary for, after the staff exclusion. */
  modulesSummarised: number;
  strengths: BusinessInsightItem[];
  opportunities: BusinessInsightItem[];
  /** Completed modules withheld from this view because they describe staff. */
  withheldModules: number;
}

// module_progress holds a row per session/site, so a business can appear many
// times per module. Keep the latest run per (business, module) so a superseded
// run cannot contribute stale strengths or recommendations.
function latestRunPerBusinessModule(rows: CohortRow[]): CohortRow[] {
  const rank = (r: CohortRow) =>
    r.completed_at ? new Date(r.completed_at).getTime() : (r.status === 'completed' ? 0 : -1);
  const best = new Map<string, CohortRow>();
  for (const r of rows) {
    const key = `${r.child_org_id}::${r.module_id}`;
    const cur = best.get(key);
    if (!cur || rank(r) > rank(cur)) best.set(key, r);
  }
  return Array.from(best.values());
}

export function useProgramBusinessSummaries(programId: string | null) {
  const [insights, setInsights] = useState<Map<string, BusinessInsight>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!programId || !isSupabaseEnabled() || !supabase) return;
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase
        .rpc('get_program_cohort_summaries', { p_program_id: programId });
      if (rpcError) throw new Error(rpcError.message);

      const rows = latestRunPerBusinessModule((data ?? []) as CohortRow[]);
      const byBusiness = new Map<string, BusinessInsight>();

      for (const row of rows) {
        let entry = byBusiness.get(row.child_org_id);
        if (!entry) {
          entry = {
            childOrgId: row.child_org_id,
            modulesSummarised: 0,
            strengths: [],
            opportunities: [],
            withheldModules: 0,
          };
          byBusiness.set(row.child_org_id, entry);
        }

        if (isHiddenFromAuthority(row.module_id)) {
          if (row.summary) entry.withheldModules += 1;
          continue;
        }
        if (!row.summary) continue;

        entry.modulesSummarised += 1;
        for (const text of row.summary.doingWell ?? []) {
          if (text) entry.strengths.push({ text, moduleId: row.module_id });
        }
        for (const action of row.summary.priorityActions ?? []) {
          if (action?.action) {
            entry.opportunities.push({
              text: action.action,
              moduleId: row.module_id,
              priority: action.priority,
            });
          }
        }
      }

      // Highest priority first so the top of a truncated list is the useful end.
      const weight = (p?: string) => (p === 'high' ? 0 : p === 'medium' ? 1 : 2);
      for (const entry of byBusiness.values()) {
        entry.opportunities.sort((a, b) => weight(a.priority) - weight(b.priority));
      }

      setInsights(byBusiness);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load business summaries');
    } finally {
      setIsLoading(false);
    }
  }, [programId]);

  useEffect(() => { load(); }, [load]);

  return { insights, isLoading, error, reload: load };
}
