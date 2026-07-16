// Single source of truth for everything DERIVED from a ProgramReportPayload:
// metrics, narratives, insights, groupings and shared-response copy. The PDF
// generator and the on-screen ReportRender both consume these so the two views
// can never drift in wording or logic - fix a number or a sentence once, here.

import { accessModules } from '../data/accessModules';
import type { ProgramReportPayload } from '../hooks/useProgramReport';

export function moduleName(moduleId: string): string {
  return accessModules.find(m => m.id === moduleId)?.name || moduleId;
}

// Cohort maturity band from the % of assessed module-confidence bands that are
// strong. Speaks to "assessed areas", not "businesses" (the metric is band- not
// business-weighted).
export function maturityBand(strongPct: number): string {
  if (strongPct >= 60) return 'Established';
  if (strongPct >= 40) return 'Developing';
  if (strongPct >= 20) return 'Emerging';
  return 'Early';
}

export function describeCohortMaturity(strongPct: number): string {
  if (strongPct >= 60) return 'an established cohort. Most assessed areas show solid foundations at high confidence. The opportunity now is to capture what the strongest performers do well as shared case studies and lift the rest to the same standard.';
  if (strongPct >= 40) return 'a developing cohort. The cohort shows good foundations across most assessed areas, with clear, visible areas to improve. Shared support focused on the themes with the highest needs signal will move several businesses forward at once.';
  if (strongPct >= 20) return 'an emerging cohort. Accessibility foundations are just starting to show across the assessed areas - most are early in the journey and still need structured guidance and practical implementation support. Sector-wide training and shared resources will accelerate progress on the priorities below.';
  return 'a cohort at the very start of its journey. Capacity-building investment now, targeted at the most common barriers, will produce measurable progress within 6 to 12 months.';
}

export function describeCompletion(completedPct: number, total: number): string {
  if (total === 0) return 'No businesses are currently enrolled. Once enrolment begins this section will populate.';
  if (completedPct >= 80) return 'Most businesses have finished their assessments, giving this report a high-confidence basis. Findings can be cited in public reporting.';
  if (completedPct >= 40) return 'A meaningful proportion has finished. Findings are directional but reliable. Follow up with the in-progress cohort to firm up the picture before public reporting.';
  if (completedPct >= 15) return 'Early-stage program. Findings are indicative only. Consider this a baseline read; re-run the report in 4-8 weeks once more businesses complete.';
  return 'Very early in the program. Treat the figures below as preliminary signal, not conclusion.';
}

// Cohort-wide confidence-band totals + the % strong (band-weighted).
export function computeConfidence(payload: ProgramReportPayload): { strong: number; mixed: number; needsWork: number; total: number; strongPct: number } {
  let strong = 0, mixed = 0, needsWork = 0;
  for (const m of payload.moduleAggregates) {
    strong += m.confidence_strong;
    mixed += m.confidence_mixed;
    needsWork += m.confidence_needs_work;
  }
  const total = strong + mixed + needsWork;
  return { strong, mixed, needsWork, total, strongPct: total > 0 ? Math.round((strong / total) * 100) : 0 };
}

// Templated shared-response suggestion per DIAP-category theme. Generic wording
// only - no invented figures, costs or benchmarks.
const THEME_SHARED_RESPONSE: Record<string, string> = {
  'physical-access': 'a shared works grant or bulk procurement (e.g. ramps, signage, hearing augmentation)',
  'information-communication-marketing': 'a shared accessible-information template or group communications training',
  'customer-service': 'a group disability-awareness and service training session',
  'operations-policy-procedure': 'a shared policy template or joint procedure workshop',
  'people-culture': 'a cohort-wide capability and inclusion training program',
};
export function sharedResponseFor(themeKey?: string): string {
  return (themeKey && THEME_SHARED_RESPONSE[themeKey]) || 'a shared initiative or group program';
}

export interface ThemeGroup<T> { key: string; label: string; total: number; items: T[]; }
export function groupByTheme<T extends { count: number; theme?: { key: string; label: string } }>(items: T[]): ThemeGroup<T>[] {
  const map = new Map<string, ThemeGroup<T>>();
  for (const it of items) {
    const key = it.theme?.key ?? 'other';
    const label = it.theme?.label ?? 'Other';
    let g = map.get(key);
    if (!g) { g = { key, label, total: 0, items: [] }; map.set(key, g); }
    g.total += it.count;
    g.items.push(it);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

export interface GroupedInsights { strengths: string[]; barriers: string[]; opportunity: string[]; }

// A module needs at least this many assessed businesses before it can be named
// as the cohort's headline barrier - a 1-2 sample module can top a ratio ranking
// on noise and misdirect shared investment.
export const MIN_ASSESSED_TO_FLAG = 3;

// The module with the strongest needs-work signal, guarded by a minimum sample
// so a 1-2 assessment module can't top the ratio ranking on noise.
export function topNeedsWorkModule(payload: ProgramReportPayload) {
  return [...payload.moduleAggregates]
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) >= MIN_ASSESSED_TO_FLAG)
    .sort((a, b) => {
      const at = a.confidence_strong + a.confidence_mixed + a.confidence_needs_work;
      const bt = b.confidence_strong + b.confidence_mixed + b.confidence_needs_work;
      return (b.confidence_needs_work / bt) - (a.confidence_needs_work / at);
    })[0];
}

export function generateKeyInsights(payload: ProgramReportPayload, strongPct: number, completedPct: number): GroupedInsights {
  const { topPriorityActions, topStrengths } = payload;
  const strengths: string[] = [];
  const barriers: string[] = [];
  const opportunity: string[] = [];

  if (strongPct >= 50) strengths.push(`${strongPct}% of assessed modules show strong confidence - the cohort is doing well overall.`);
  else if (strongPct >= 25) strengths.push(`${strongPct}% of assessed modules are already strong - a solid base to build on.`);
  if (topStrengths.length > 0) {
    const t = topStrengths[0];
    strengths.push(`Established strengths are already in place across the cohort${t.theme?.label ? `, strongest in ${t.theme.label}` : ''} - worth highlighting publicly (see Strengths across the cohort).`);
  }

  const m = topNeedsWorkModule(payload);
  if (m && m.confidence_needs_work > 0) {
    const tot = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
    barriers.push(`${moduleName(m.module_id)} (${m.module_id}) shows the most needs-work signal (${m.confidence_needs_work} of ${tot}). Prioritise for cohort-wide support.`);
  }
  if (strongPct < 25) barriers.push(`Cohort maturity is still developing (${strongPct}% strong), so meaningful collective work remains.`);

  if (topPriorityActions.length > 0) {
    const area = topPriorityActions[0].theme?.label;
    opportunity.push(area
      ? `${area} is where recommendations cluster most across the cohort - the strongest area for a shared, council-led response rather than supporting businesses one at a time.`
      : `Recommendations cluster in a few areas across the cohort - a shared, council-led response reaches more businesses than one-at-a-time support.`);
  }
  if (completedPct >= 40 && completedPct < 80) opportunity.push(`At ${completedPct}% completion, re-running in 4 to 6 weeks will firm up findings before public reporting.`);

  return { strengths, barriers, opportunity };
}
