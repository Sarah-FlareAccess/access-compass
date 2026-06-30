/**
 * useProgramReport
 *
 * Cohort-level reporting for an Authority program. Loads existing snapshots
 * from program_reports, generates new ones by calling the SECURITY DEFINER
 * RPCs added in migration 029, and aggregates priorities/strengths in JS
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

export interface PriorityActionAggregate {
  action: string;
  count: number;
  priority?: string;
  moduleIds: string[];
}

export interface StrengthAggregate {
  text: string;
  count: number;
  moduleIds: string[];
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
  'Individual responses, evidence files, and DIAP details remain private to each business.';

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
  const priorityMap = new Map<string, PriorityActionAggregate>();
  const strengthMap = new Map<string, StrengthAggregate>();
  const areaMap = new Map<string, AreaToExploreAggregate>();

  for (const row of rows) {
    if (!row.summary) continue;
    const moduleId = row.module_id;

    for (const pa of row.summary.priorityActions ?? []) {
      const text = typeof pa === 'string' ? pa : pa.action;
      if (!text) continue;
      const key = normaliseText(text);
      const existing = priorityMap.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.moduleIds.includes(moduleId)) existing.moduleIds.push(moduleId);
      } else {
        priorityMap.set(key, {
          action: text,
          count: 1,
          priority: typeof pa === 'string' ? undefined : pa.priority,
          moduleIds: [moduleId],
        });
      }
    }

    for (const s of row.summary.doingWell ?? []) {
      if (!s) continue;
      const key = normaliseText(s);
      const existing = strengthMap.get(key);
      if (existing) {
        existing.count += 1;
        if (!existing.moduleIds.includes(moduleId)) existing.moduleIds.push(moduleId);
      } else {
        strengthMap.set(key, { text: s, count: 1, moduleIds: [moduleId] });
      }
    }

    for (const a of row.summary.areasToExplore ?? []) {
      const text = typeof a === 'string' ? a : a.action;
      if (!text) continue;
      const key = normaliseText(text);
      const existing = areaMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        areaMap.set(key, { text, count: 1 });
      }
    }
  }

  const byCount = <T extends { count: number }>(a: T, b: T) => b.count - a.count;

  return {
    topPriorityActions: Array.from(priorityMap.values()).sort(byCount).slice(0, 20),
    topStrengths: Array.from(strengthMap.values()).sort(byCount).slice(0, 15),
    topAreasToExplore: Array.from(areaMap.values()).sort(byCount).slice(0, 10),
  };
}

function normaliseText(s: string): string {
  return s.toLowerCase().trim().replace(/\s+/g, ' ').replace(/[.,;:!?]+$/g, '');
}
