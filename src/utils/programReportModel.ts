// Single source of truth for everything DERIVED from a ProgramReportPayload:
// metrics, narratives, insights, groupings and shared-response copy. The PDF
// generator and the on-screen ReportRender both consume these so the two views
// can never drift in wording or logic - fix a number or a sentence once, here.

import { accessModules } from '../data/accessModules';
import { domainsForModule } from '../data/frameworkMappings';
import { getFramework } from '../data/frameworks';
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

// Grouping mode for the recommendation sections: DIAP theme (default) or the
// jurisdiction's statutory outcome domain. Shared so the PDF and web group
// identically for the same groupBy choice.
// Show the full appendix only when there are enough distinct recommendation
// patterns to be worth it - below this the by-horizon list already shows them
// all, so a separate full appendix would just restate it.
export const APPENDIX_MIN_PATTERNS = 7;

export type GroupMode = 'theme' | 'framework';
export function resolveGroupMode(groupBy: GroupMode | undefined, frameworkKey?: string): GroupMode {
  return groupBy === 'framework' && frameworkKey && getFramework(frameworkKey) ? 'framework' : 'theme';
}
export function groupWordFor(mode: GroupMode): string {
  return mode === 'framework' ? 'outcome area' : 'theme';
}
export function groupRecommendations<T extends { count: number; moduleIds: string[]; theme?: { key: string; label: string } }>(
  items: T[], mode: GroupMode, frameworkKey?: string,
): ThemeGroup<T>[] {
  if (mode !== 'framework' || !frameworkKey) return groupByTheme(items);
  const fw = getFramework(frameworkKey);
  const shortById = fw ? new Map(fw.domains.map(d => [d.id, d.short || d.name])) : new Map<string, string>();
  const groupOf = (moduleIds: string[]): { key: string; label: string } => {
    const tally = new Map<string, number>();
    for (const mid of moduleIds) {
      const code = mid.match(/\d+\.\d+/)?.[0] ?? mid;
      for (const dId of domainsForModule(code, frameworkKey)) tally.set(dId, (tally.get(dId) ?? 0) + 1);
    }
    let best: string | undefined;
    let bestN = 0;
    for (const [k, n] of tally) if (n > bestN) { bestN = n; best = k; }
    if (!best) return { key: 'unmapped', label: 'Not yet mapped to an outcome area' };
    return { key: best, label: shortById.get(best) ?? best };
  };
  const map = new Map<string, ThemeGroup<T>>();
  for (const it of items) {
    const g = groupOf(it.moduleIds);
    let e = map.get(g.key);
    if (!e) { e = { key: g.key, label: g.label, total: 0, items: [] }; map.set(g.key, e); }
    e.total += it.count;
    e.items.push(it);
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

// Per-module verdict from its strong-confidence share: Maintain (doing well),
// Invest (mixed, targeted support pays off) or Improve (biggest collective gap).
export function moduleVerdict(m: { confidence_strong: number; confidence_mixed: number; confidence_needs_work: number }): { label: string; key: 'maintain' | 'invest' | 'improve' } | null {
  const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
  if (total === 0) return null;
  const strongP = (m.confidence_strong / total) * 100;
  return strongP >= 55 ? { label: 'Maintain', key: 'maintain' } : strongP >= 30 ? { label: 'Invest', key: 'invest' } : { label: 'Improve', key: 'improve' };
}

// Friendly labels for the finer question categories, used to show a broad DIAP
// theme's internal make-up (e.g. Information, Communication & Marketing is mostly
// Digital). Falls back to a capitalised slug for any unmapped category.
const QUESTION_CATEGORY_LABEL: Record<string, string> = {
  operational: 'Operations', policy: 'Policy', information: 'Information', digital: 'Digital',
  communication: 'Communication', physical: 'Physical', feedback: 'Feedback', training: 'Training',
  improvement: 'Improvement', procurement: 'Procurement', 'sensory-environment': 'Sensory environment',
  safety: 'Safety', measurement: 'Measurement', 'lived-experience': 'Lived experience',
  evidence: 'Evidence', employment: 'Employment',
};

// Break a theme group's recommendations down by their finer question category,
// as a share of the group total. Returns [] when the group spans only one finer
// category (nothing to add) so callers can skip the breakdown entirely.
export function themeComposition(items: { count: number; questionCategory?: string }[]): { label: string; count: number }[] {
  const tally = new Map<string, number>();
  for (const it of items) {
    if (!it.questionCategory) continue;
    tally.set(it.questionCategory, (tally.get(it.questionCategory) ?? 0) + it.count);
  }
  if (tally.size < 2) return [];
  return Array.from(tally.entries())
    .map(([k, c]) => ({ label: QUESTION_CATEGORY_LABEL[k] ?? (k.charAt(0).toUpperCase() + k.slice(1)), count: c }))
    .sort((a, b) => b.count - a.count);
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

// Network Accessibility Maturity Score: a single trackable 0-100 metric (Strong
// = 100, Mixed = 50, Needs work = 0, averaged) an executive can put in a board
// paper. Band-weighted like strongPct, so it measures accessibility, not
// participation.
export interface Maturity { score: number; band: string; }
export function computeMaturity(confidence: { strong: number; mixed: number; total: number }): Maturity {
  const t = confidence.total;
  const score = t > 0 ? Math.round((confidence.strong * 100 + confidence.mixed * 50) / t) : 0;
  const band =
    score >= 80 ? 'Leading' :
    score >= 60 ? 'Established' :
    score >= 40 ? 'Developing' :
    score >= 20 ? 'Emerging' : 'Foundational';
  return { score, band };
}

// A transparent risk read from maturity (how accessible), participation (how
// much is done) and evidence volume (how confident we can be).
export interface Risk { level: 'Low' | 'Moderate' | 'High'; note: string; }
export function computeRisk(maturityScore: number, completionPct: number, confidenceTotal: number): Risk {
  let level: 'Low' | 'Moderate' | 'High';
  if (confidenceTotal < 5) level = 'High';
  else if (maturityScore >= 60 && completionPct >= 60) level = 'Low';
  else if (maturityScore < 30 || completionPct < 25) level = 'High';
  else level = 'Moderate';
  const note = level === 'Low'
    ? 'A mature, well-evidenced cohort. Findings are safe to cite in public reporting.'
    : level === 'High'
      ? 'Low maturity or thin evidence. Treat findings as a baseline and prioritise support and participation before public reporting.'
      : 'A developing cohort. Findings are directional; firm them up with more completions before citing publicly.';
  return { level, note };
}

// Decisions for the AUTHORITY (not the businesses): turn the aggregate signal
// into a short set of actions a council can take.
export interface AuthorityRec { kind: string; text: string; }
export function authorityRecommendations(payload: ProgramReportPayload): AuthorityRec[] {
  const { topPriorityActions, topAreasToExplore, topStrengths, enrolment } = payload;
  const recs: AuthorityRec[] = [];
  const weakest = topNeedsWorkModule(payload);
  if (weakest && weakest.confidence_needs_work > 0) {
    recs.push({ kind: 'Capability', text: `Deliver cohort-wide support on ${moduleName(weakest.module_id)} - it carries the highest needs-work signal across the network.` });
  }
  if (topPriorityActions.length > 0) {
    const top = topPriorityActions[0];
    recs.push({ kind: 'Shared initiative', text: `Pool effort on "${top.action}" - raised by ${top.count} business${top.count !== 1 ? 'es' : ''}, so a shared template, group training or joint procurement would reach them all at once rather than one at a time.` });
  }
  if (topAreasToExplore.length > 0) {
    recs.push({ kind: 'Guidance', text: 'Publish plain-language guidance in areas the cohort repeatedly flagged as unclear - a small number of shared explainers would resolve questions across many businesses.' });
  }
  if (enrolment.enrolled > 0) {
    recs.push({ kind: 'Participation', text: `Follow up with the ${enrolment.enrolled} enrolled business${enrolment.enrolled !== 1 ? 'es' : ''} yet to start, to firm up the cohort picture before public reporting.` });
  }
  if (weakest) {
    recs.push({ kind: 'Investment', text: `Focus the next funding round on ${moduleName(weakest.module_id)} for the largest cohort-wide accessibility gain per dollar.` });
  }
  if (topStrengths.length > 0) {
    const top = topStrengths[0];
    recs.push({ kind: 'Recognition', text: `Showcase "${top.text}" publicly - already in place across ${top.count} business${top.count !== 1 ? 'es' : ''} - to build momentum and evidence outcomes.` });
  }
  return recs.slice(0, 6);
}

// Recommendations grouped by PREVALENCE - how many businesses raised each, as a
// share of the cohort. This is purely descriptive: it reports the data rather
// than making a priority judgement, so it does not depend on the (unreliable)
// per-question compliance tags. Only patterns shared by at least MIN_SHARED
// businesses appear; one-off items live in the appendix.
export const MIN_SHARED = 3;
export interface PrevalenceBand { key: string; label: string; hint: string; items: ProgramReportPayload['topPriorityActions']; }
export function pctOfCohort(count: number, cohortSize: number): number {
  return cohortSize > 0 ? Math.min(100, Math.round((count / cohortSize) * 100)) : 0;
}
export function prevalenceBands(actions: ProgramReportPayload['topPriorityActions'], cohortSize: number): PrevalenceBand[] {
  const ratio = (n: number) => (cohortSize > 0 ? n / cohortSize : 0);
  // Sort by count so each band lists its most-shared items first, regardless of
  // the order the aggregation happened to produce.
  const shared = actions.filter(a => a.count >= MIN_SHARED).slice().sort((a, b) => b.count - a.count);
  const pick = (lo: number, hi: number) => shared.filter(a => { const r = ratio(a.count); return r >= lo && r < hi; });
  return [
    { key: 'very', label: 'Very common', hint: 'Raised by most of the cohort', items: pick(0.6, Infinity) },
    { key: 'common', label: 'Common', hint: 'Raised by a sizeable share of the cohort', items: pick(0.3, 0.6) },
    { key: 'emerging', label: 'Emerging', hint: 'Raised by a smaller group, an early signal', items: pick(0, 0.3) },
  ].filter(b => b.items.length > 0);
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
