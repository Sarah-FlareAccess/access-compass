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

// Interpretation only - both renderers already state the completion percentage
// before this, so it must not restate "X have completed".
export function describeCompletion(completedPct: number, total: number): string {
  if (total === 0) return 'No businesses are currently enrolled. Once enrolment begins this section will populate.';
  if (completedPct >= 100) return 'This gives a complete picture of the cohort across the areas assessed. Findings are self-reported indicators of readiness, not independently verified accessibility outcomes.';
  if (completedPct >= 80) return 'That gives a solid read of the cohort across the areas assessed. Findings are self-reported, not independently verified.';
  if (completedPct >= 40) return 'Findings are directional; following up with the businesses yet to finish will round out the picture. They are self-reported, not independently verified.';
  if (completedPct >= 15) return 'Treat the findings as an initial baseline and re-run once more businesses complete.';
  return 'Treat the figures below as a preliminary signal, not a conclusion.';
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
  // Full outcome-domain names (not the short labels), so the recommendation
  // groupings read with the same domain names as the readiness-by-outcome-area
  // section rather than a second, shorter set.
  const labelById = fw ? new Map(fw.domains.map(d => [d.id, d.name])) : new Map<string, string>();
  // Every outcome area a recommendation maps to (via its backing modules),
  // deduped. A rec that spans several domains appears under each - matching the
  // DIAP and the readiness section - rather than collapsing to a single primary
  // domain (which previously left the appendix showing just one area).
  const domainsOf = (moduleIds: string[]): string[] => {
    const ids = new Set<string>();
    for (const mid of moduleIds) {
      const code = mid.match(/\d+\.\d+/)?.[0] ?? mid;
      for (const dId of domainsForModule(code, frameworkKey)) ids.add(dId);
    }
    return ids.size ? Array.from(ids) : ['unmapped'];
  };
  const map = new Map<string, ThemeGroup<T>>();
  for (const it of items) {
    for (const dId of domainsOf(it.moduleIds)) {
      const label = dId === 'unmapped' ? 'Not yet mapped to an outcome area' : (labelById.get(dId) ?? dId);
      let e = map.get(dId);
      if (!e) { e = { key: dId, label, total: 0, items: [] }; map.set(dId, e); }
      e.total += it.count;
      e.items.push(it);
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

// Per-module verdict from its strong-confidence share: Maintain (doing well),
// Invest (mixed, targeted support pays off) or Improve (biggest collective gap).
export function moduleVerdict(m: { confidence_strong: number; confidence_mixed: number; confidence_needs_work: number }): { label: string; key: 'maintain' | 'invest' | 'improve' } | null {
  const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
  if (total === 0) return null;
  const strongP = (m.confidence_strong / total) * 100;
  return strongP >= 55 ? { label: 'On track', key: 'maintain' } : strongP >= 30 ? { label: 'Developing', key: 'invest' } : { label: 'Priority', key: 'improve' };
}

export interface GroupedInsights { strengths: string[]; barriers: string[]; opportunity: string[]; }

// A module needs at least this many assessed businesses before it can be named
// as the cohort's headline barrier - a 1-2 sample module can top a ratio ranking
// on noise and misdirect shared investment.
export const MIN_ASSESSED_TO_FLAG = 3;

// The module with the strongest needs-work signal, guarded by a minimum sample
// so a 1-2 assessment module can't top the ratio ranking on noise.
// The module(s) carrying the strongest needs-work signal. Ranked by needs-work
// proportion, then absolute count as the tiebreak (so a 4-of-4 outranks a 1-of-1).
// Returns EVERY module tied at the top on both keys, so a genuine tie is reported
// as a tie rather than one module being arbitrarily singled out as "the strongest".
export function topNeedsWorkGroup(payload: ProgramReportPayload) {
  const ranked = [...payload.moduleAggregates]
    .filter(m => (m.confidence_strong + m.confidence_mixed + m.confidence_needs_work) >= MIN_ASSESSED_TO_FLAG)
    .map(m => {
      const total = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
      return { m, prop: total > 0 ? m.confidence_needs_work / total : 0, count: m.confidence_needs_work };
    })
    .sort((a, b) => (b.prop - a.prop) || (b.count - a.count));
  if (ranked.length === 0) return [];
  const lead = ranked[0];
  return ranked.filter(r => r.prop === lead.prop && r.count === lead.count).map(r => r.m);
}

export function topNeedsWorkModule(payload: ProgramReportPayload) {
  return topNeedsWorkGroup(payload)[0];
}

// Format module ids as "Name (id)", joined "A", "A and B", "A, B and C" (no Oxford comma).
export function moduleNameList(ids: string[]): string {
  const parts = ids.map(id => `${moduleName(id)} (${id})`);
  if (parts.length <= 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}`;
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
    ? 'A mature cohort with consistent practices across the areas assessed. Little shared support is needed - focus on maintaining and showcasing. This is an implementation-planning indicator, not a legal, safety or compliance assessment.'
    : level === 'High'
      ? 'An early-stage cohort or limited data so far. Prioritise participation and foundational support before drawing firm conclusions. This is an implementation-planning indicator, not a legal, safety or compliance assessment.'
      : 'There are clear opportunities for shared, network-wide support across the cohort. This is an implementation-planning indicator, not a legal, safety or compliance assessment.';
  return { level, note };
}

// Decisions for the AUTHORITY (not the businesses): turn the aggregate signal
// into a short set of actions a council can take.
export interface AuthorityRec { kind: string; text: string; }
export function authorityRecommendations(payload: ProgramReportPayload): AuthorityRec[] {
  const { topPriorityActions, topAreasToExplore, topStrengths, enrolment } = payload;
  const recs: AuthorityRec[] = [];
  const weakestGroup = topNeedsWorkGroup(payload).filter(m => m.confidence_needs_work > 0);
  if (weakestGroup.length > 0) {
    const ids = weakestGroup.map(m => m.module_id);
    recs.push({ kind: 'Capability', text: `Deliver cohort-wide support on ${moduleNameList(ids)} - ${ids.length > 1 ? 'they carry' : 'it carries'} the highest needs-work signal across the network.` });
  }
  if (topPriorityActions.length > 0) {
    const top = topPriorityActions[0];
    recs.push({ kind: 'Shared initiative', text: `Develop a coordinated response to "${top.action.charAt(0).toLowerCase()}${top.action.slice(1)}" - raised by ${top.count} business${top.count !== 1 ? 'es' : ''}. Depending on the need this could combine shared guidance, group training and joint procurement, reaching them all at once rather than one at a time.` });
  }
  if (topAreasToExplore.length > 0) {
    recs.push({ kind: 'Guidance', text: 'Publish plain-language guidance in areas the cohort repeatedly flagged as unclear - a small number of shared explainers would resolve questions across many businesses.' });
  }
  if (enrolment.enrolled > 0) {
    recs.push({ kind: 'Participation', text: `Follow up with the ${enrolment.enrolled} enrolled business${enrolment.enrolled !== 1 ? 'es' : ''} yet to start, to firm up the cohort picture before public reporting.` });
  }
  if (weakestGroup.length > 0) {
    recs.push({ kind: 'Investment', text: `Consider prioritising the next funding round for ${moduleNameList(weakestGroup.map(m => m.module_id))}, where targeted investment could address a common barrier across multiple businesses (subject to site-specific feasibility and cost).` });
  }
  if (topStrengths.length > 0) {
    const top = topStrengths[0];
    recs.push({ kind: 'Recognition', text: `Showcase "${top.text}" publicly - already in place across ${top.count} business${top.count !== 1 ? 'es' : ''} - to build momentum and evidence outcomes.` });
  }
  return recs.slice(0, 6);
}

// Only recommendations shared by at least this many businesses are listed in the
// report body (a shared, council-worthy pattern rather than a one-off); the rest
// live in the appendix.
export const MIN_SHARED = 3;
export function pctOfCohort(count: number, cohortSize: number): number {
  return cohortSize > 0 ? Math.min(100, Math.round((count / cohortSize) * 100)) : 0;
}

// Human-readable description of a report's assessment-date window (by completion
// date). Returns null when there is no window (all assessments). compact form is
// for the saved-report card; the full form for the report body.
export function formatAssessmentWindow(
  w?: { from: string | null; to: string | null } | null,
  compact = false,
): string | null {
  if (!w || (!w.from && !w.to)) return null;
  const fmt = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  if (compact) {
    if (w.from && w.to) return `${fmt(w.from)} to ${fmt(w.to)}`;
    if (w.from) return `since ${fmt(w.from)}`;
    return `up to ${fmt(w.to!)}`;
  }
  if (w.from && w.to) return `assessments completed between ${fmt(w.from)} and ${fmt(w.to)}`;
  if (w.from) return `assessments completed since ${fmt(w.from)}`;
  return `assessments completed up to ${fmt(w.to!)}`;
}
// The shared recommendations within a group, most-raised first. Descriptive - no
// priority judgement, so it does not lean on the (unreliable) compliance tags.
export function sharedRecommendations<T extends { count: number }>(items: T[]): T[] {
  return items.filter(a => a.count >= MIN_SHARED).slice().sort((a, b) => b.count - a.count);
}

// One-line "why this matters" per theme, so each area reads as expertise rather
// than a bare list. Keyed by DIAP theme; only shown when grouping by theme.
export const THEME_RATIONALE: Record<string, string> = {
  'information-communication-marketing': 'Information and digital barriers stop many visitors before they arrive, so fixing them helps the most people for the least cost - and tends to improve search visibility too.',
  'physical-access': 'Physical changes are more site-specific and usually suit targeted grant funding rather than network-wide training.',
  'people-culture': 'Staff capability is a common network-wide challenge, well suited to shared workshops and coaching rather than site-by-site investment.',
  'customer-service': 'Service and feedback practices are low-cost to improve and shape whether visitors feel welcome and come back.',
  'operations-policy-procedure': 'Policies and procedures set the foundation - shared templates and guidance can move many businesses at once.',
};

export function generateKeyInsights(payload: ProgramReportPayload, strongPct: number, completedPct: number): GroupedInsights {
  const { topPriorityActions, topStrengths } = payload;
  const strengths: string[] = [];
  const barriers: string[] = [];
  const opportunity: string[] = [];

  if (strongPct >= 50) strengths.push(`${strongPct}% of assessed modules are strong - the cohort is doing well overall.`);
  else if (strongPct >= 25) strengths.push(`${strongPct}% of assessed modules are already strong - a solid base to build on.`);
  if (topStrengths.length > 0) {
    // Name the most common SPECIFIC strength, not the theme. Theme totals are
    // biased by how many topics a theme covers, so the broadest theme wins both
    // "most strengths" and "most recommendations", which reads as a contradiction.
    const top = topStrengths[0];
    strengths.push(`"${top.text}" is already in place across ${top.count} business${top.count !== 1 ? 'es' : ''} - the most common strength, worth highlighting publicly (see Strengths across the cohort).`);
  }

  const m = topNeedsWorkModule(payload);
  if (m && m.confidence_needs_work > 0) {
    const tot = m.confidence_strong + m.confidence_mixed + m.confidence_needs_work;
    barriers.push(`${moduleName(m.module_id)} (${m.module_id}) shows the most needs-work signal (${m.confidence_needs_work} of ${tot}). Prioritise for cohort-wide support.`);
  }
  if (strongPct < 25) barriers.push(`Cohort maturity is still developing (${strongPct}% strong), so meaningful collective work remains.`);

  if (topPriorityActions.length > 0) {
    // Name the single most common SPECIFIC recommendation (not the theme), so this
    // never collides with the "most strengths" line above.
    const top = topPriorityActions[0];
    opportunity.push(`The clearest shared opportunity is "${top.action}", recommended for ${top.count} business${top.count !== 1 ? 'es' : ''} - the strongest candidate for a coordinated, network-wide response rather than supporting each business one at a time.`);
  }
  if (completedPct >= 40 && completedPct < 80) opportunity.push(`At ${completedPct}% completion, re-running in 4 to 6 weeks will firm up findings before public reporting.`);

  return { strengths, barriers, opportunity };
}
