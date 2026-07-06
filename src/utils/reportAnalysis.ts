/**
 * Report analysis layer.
 *
 * Turns the raw counts a report already holds into interpretation: what the
 * numbers mean, the patterns across recommendations, where the load sits, what
 * the strengths are, and a suggested order to work through it.
 *
 * Everything here is derived from the organisation's own data. There is no
 * benchmarking or peer comparison, because we hold no such dataset and must not
 * imply one. Language is deliberately hedged ("suggests", "appears").
 */

import type { MaturityResult } from './maturityModel';
import { groupLabel } from './maturityModel';

export interface AnalysisAction {
  text: string;
  priority?: 'high' | 'medium' | 'low';
  group?: string;
}

export interface AnalysisTheme {
  label: string;
  count: number;
}

export interface AnalysisInput {
  organisation: string;
  maturity: MaturityResult;
  actions: AnalysisAction[];
  strengths: { group?: string }[];
  quickWinsCount: number;
  areasToExploreCount: number;
  themeBreakdown: { group: string; label: string; performancePct: number; assessed: number; strengths: number; actions: number }[];
  high: number;
  medium: number;
  low: number;
}

export interface ThemeLead {
  theme: string;
  lead: string;
}

export interface EffortBreakdown {
  quickWins: number;
  operational: number;
  capital: number;
  investigate: number;
}

export interface PriorityGroup {
  heading: string;
  items: string[];
}

export interface ThematicSummary {
  label: string;
  pct: number;
  count: number;
  total: number;
  barriers: string[];
  scopeHigh: boolean;
}

export interface SequenceStep {
  heading: string;
  items: string[];
}

export interface ReportAnalysis {
  headline: string;
  interpretation: string[];
  whyItMatters: string;
  effort: EffortBreakdown;
  priorityGroups: PriorityGroup[];
  recurringThemes: AnalysisTheme[];
  recurringInsight: string;
  themeLeads: ThemeLead[];
  thematicSummaries: ThematicSummary[];
  strengthsByTheme: AnalysisTheme[];
  startingSequence: SequenceStep[];
}

// Recurring-theme taxonomy. Indicative pattern detection over recommendation
// text, not a classifier. Keep keywords lower case.
const THEME_KEYWORDS: { label: string; kws: string[] }[] = [
  { label: 'Signage & wayfinding', kws: ['signage', 'wayfind', 'directional'] },
  { label: 'Parking & arrival', kws: ['parking', 'car park', 'drop-off', 'drop off', 'set-down'] },
  { label: 'Entrances & doors', kws: ['entrance', 'doorway', 'door ', 'doors', 'entry point', 'threshold'] },
  { label: 'Paths & circulation', kws: ['pathway', 'path ', 'paths', 'circulation', 'corridor', 'ramp', 'handrail', 'stair', 'step ', 'steps', 'gradient', 'level access'] },
  { label: 'Toilets & amenities', kws: ['toilet', 'bathroom', 'amenit', 'change facilit', 'changing places'] },
  { label: 'Lighting', kws: ['lighting', 'glare', 'illuminat', 'well lit', 'well-lit'] },
  { label: 'Digital & website', kws: ['website', 'web page', 'online', 'digital', ' pdf', 'wcag', 'alt text', 'alt-text', 'caption', 'screen reader'] },
  { label: 'Information & formats', kws: ['easy read', 'plain language', 'large print', 'accessible format', 'pre-visit information', 'social stor'] },
  { label: 'Staff awareness & training', kws: ['staff training', 'staff awareness', 'disability awareness', 'training', 'awareness', 'customer service'] },
  { label: 'Policy & procurement', kws: ['policy', 'policies', 'procurement', 'procure', 'supplier', 'contract', 'governance'] },
  { label: 'Hearing & sensory', kws: ['hearing', 'induction loop', 'audio', 'sensory', 'quiet space', 'quiet room'] },
  { label: 'Bookings & ticketing', kws: ['booking', 'ticketing', 'ticket', 'reservation'] },
];

// Keywords that suggest a physical / capital-works change rather than an
// operational one. Used only to frame the operational-vs-structural balance.
const STRUCTURAL_KWS = [
  'ramp', 'entrance', 'doorway', 'parking', 'toilet', 'lift', 'stair', 'pathway',
  'handrail', 'lighting', 'install', 'construct', 'widen', 'kerb', 'threshold',
  'gradient', 'resurface', 'surface',
];

// Themes that typically involve built-environment / capital works, as opposed
// to operational changes. Used to sort the roadmap so operational items sit in
// the immediate band and never get held up behind capital works.
const STRUCTURAL_THEMES = new Set<string>([
  'Parking & arrival', 'Entrances & doors', 'Paths & circulation', 'Toilets & amenities', 'Lighting',
]);

// Suggested lead area per theme. A starting point for routing, not a fixed org
// chart, and worded so any organisation can map it to their own structure.
const THEME_LEADS: Record<string, string> = {
  'Signage & wayfinding': 'Facilities',
  'Parking & arrival': 'Facilities & Assets',
  'Entrances & doors': 'Assets',
  'Paths & circulation': 'Assets',
  'Toilets & amenities': 'Facilities & Assets',
  'Lighting': 'Facilities',
  'Digital & website': 'Communications & Digital',
  'Information & formats': 'Communications',
  'Staff awareness & training': 'People & Culture',
  'Policy & procurement': 'Governance',
  'Hearing & sensory': 'Facilities',
  'Bookings & ticketing': 'Customer Service',
};

function joinLower(items: string[]): string {
  const l = items.map(s => s.toLowerCase());
  if (l.length <= 1) return l[0] || '';
  if (l.length === 2) return `${l[0]} and ${l[1]}`;
  return `${l.slice(0, -1).join(', ')} and ${l[l.length - 1]}`;
}

// Higher-level domains, each a grouping of journey groups.
const DOMAINS: { label: string; groups: string[] }[] = [
  { label: 'Physical environment', groups: ['getting-in', 'during-visit'] },
  { label: 'Information & communication', groups: ['before-arrival'] },
  { label: 'Service & people', groups: ['service-support'] },
  { label: 'Organisation & policy', groups: ['organisational-commitment'] },
  { label: 'Events', groups: ['events', 'major-events'] },
];

function countThemes(actions: AnalysisAction[], limit = 6, minCount = 1): AnalysisTheme[] {
  const counts = new Map<string, number>();
  for (const theme of THEME_KEYWORDS) {
    let n = 0;
    for (const a of actions) {
      const t = a.text.toLowerCase();
      if (theme.kws.some(k => t.includes(k))) n += 1;
    }
    if (n >= minCount) counts.set(theme.label, n);
  }
  return Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function buildAnalysis(input: AnalysisInput): ReportAnalysis {
  const { organisation, maturity, actions, strengths, quickWinsCount, areasToExploreCount, themeBreakdown, high, medium, low } = input;

  const empty: ReportAnalysis = {
    headline: '',
    interpretation: [],
    whyItMatters: '',
    effort: { quickWins: 0, operational: 0, capital: 0, investigate: 0 },
    priorityGroups: [],
    recurringThemes: [],
    recurringInsight: '',
    themeLeads: [],
    thematicSummaries: [],
    strengthsByTheme: [],
    startingSequence: [],
  };
  if (!maturity.started || actions.length + strengths.length === 0) {
    return empty;
  }

  const totalActions = high + medium + low;
  const highActions = actions.filter(a => a.priority === 'high');
  const mediumActions = actions.filter(a => a.priority === 'medium');
  const lowActions = actions.filter(a => a.priority === 'low');
  const scopeHigh = highActions.length > 0;

  // Only themes with real findings are "rated". A theme at 0% with no findings
  // means it was not assessed enough to judge, NOT that performance is poor, so
  // it must never be surfaced as the weak spot or an "opportunity".
  const ratedThemes = themeBreakdown.filter(t => (t.strengths + t.actions) > 0);
  const strongest = ratedThemes.length
    ? ratedThemes.reduce((a, b) => (b.performancePct > a.performancePct ? b : a))
    : null;

  // --- Where the priority load sits, by domain ---
  const baseForDomains = scopeHigh ? highActions : actions;
  const totalForDomains = baseForDomains.length;
  const domainCounts = DOMAINS
    .map(d => ({
      label: d.label,
      count: baseForDomains.filter(a => a.group && d.groups.includes(a.group)).length,
      actions: baseForDomains.filter(a => a.group && d.groups.includes(a.group)),
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);
  const topDomain = domainCounts[0] || null;
  const topDomainThemes = topDomain ? countThemes(topDomain.actions, 3, 2).map(t => t.label) : [];

  const thematicSummaries: ThematicSummary[] = domainCounts.slice(0, 3).map(d => ({
    label: d.label,
    pct: totalForDomains > 0 ? Math.round((d.count / totalForDomains) * 100) : 0,
    count: d.count,
    total: totalForDomains,
    barriers: countThemes(d.actions, 3, 2).map(t => t.label),
    scopeHigh,
  }));

  // --- Recurring themes across all recommendations (appearing at least twice) ---
  const recurringThemes = countThemes(actions, 6, 2);
  let recurringInsight = '';
  if (recurringThemes.length >= 2) {
    recurringInsight = `Addressing ${recurringThemes[0].label.toLowerCase()} and ${recurringThemes[1].label.toLowerCase()} would remove several barriers at once.`;
  }
  const themeLeads: ThemeLead[] = recurringThemes.slice(0, 6).map(t => ({
    theme: t.label,
    lead: THEME_LEADS[t.label] || 'To be assigned',
  }));

  // Structural (built-environment / capital) vs operational split.
  const structuralCount = actions.filter(a => {
    const t = a.text.toLowerCase();
    return STRUCTURAL_KWS.some(k => t.includes(k));
  }).length;
  const operationalShare = totalActions > 0 ? 1 - structuralCount / totalActions : 1;
  const highPct = totalActions > 0 ? Math.round((high / totalActions) * 100) : 0;

  // --- Headline: the one-line answer to "are we doing well?" ---
  const levelPhrase = maturity.levelIdx >= 3 ? 'strongly embedded'
    : maturity.levelIdx === 2 ? 'well established'
      : maturity.levelIdx === 1 ? 'developing'
        : 'in the early stages';
  let headline = `Within the areas assessed, accessibility foundations are ${levelPhrase}`;
  headline += topDomain
    ? `. The greatest opportunities for improvement relate to ${topDomain.label.toLowerCase()}${topDomainThemes.length ? `, particularly ${joinLower(topDomainThemes)}` : ''}.`
    : '.';

  // --- Executive interpretation: tight, hedged, and supported by the data ---
  const interpretation: string[] = [];
  const article = /^[aeiou]/i.test(maturity.level) ? 'an' : 'a';
  interpretation.push(
    `Within the areas assessed, ${organisation} demonstrates ${article} ${maturity.level.toLowerCase()} level of accessibility maturity` +
    (strongest ? `, with its strongest practice in ${strongest.label.toLowerCase()}.` : '.')
  );
  if (topDomain) {
    interpretation.push(
      `The clearest opportunities for improvement relate to ${topDomain.label.toLowerCase()}` +
      (topDomainThemes.length ? `, particularly ${joinLower(topDomainThemes)}.` : '.')
    );
  }
  if (totalActions > 0) {
    interpretation.push(
      highPct >= 40
        ? `${highPct}% of the actions identified are high priority, so several important compliance and experience gaps sit alongside existing strengths.`
        : `Most of the actions identified are lower-risk refinements, with ${highPct}% high priority.`
    );
    interpretation.push(
      operationalShare >= 0.5
        ? 'Most improvements are operational rather than structural, so meaningful progress is achievable now without major capital works.'
        : 'Many actions involve the built environment, but the operational improvements and quick wins can be actioned immediately, even where major works are not currently feasible (for example in heritage or leased premises).'
    );
  }

  // --- Why this matters (executive framing; operational-first, non-deterring) ---
  const whyItMatters = totalActions > 0
    ? 'Addressing the identified barriers reduces accessibility and legal risk while improving the experience for a wide range of community members.'
      + (operationalShare >= 0.5
          ? 'Most improvements are operational and can begin immediately, without major capital works. '
          : 'Many improvements are operational and can begin immediately, with larger infrastructure works planned into future capital budgets. ')
      + 'Tracking these actions over time demonstrates measurable progress against your obligations.'
    : '';

  // --- Estimated effort, for budgeting (approximate; capital is keyword-based) ---
  const effort: EffortBreakdown = {
    quickWins: quickWinsCount,
    operational: Math.max(0, totalActions - structuralCount),
    capital: structuralCount,
    investigate: areasToExploreCount,
  };

  // --- Top priorities grouped strategically by theme (each action listed once) ---
  const highByTheme = new Map<string, string[]>();
  for (const a of highActions) {
    const t = a.text.toLowerCase();
    const theme = THEME_KEYWORDS.find(th => th.kws.some(k => t.includes(k)));
    if (theme) {
      if (!highByTheme.has(theme.label)) highByTheme.set(theme.label, []);
      highByTheme.get(theme.label)!.push(a.text);
    }
  }
  const priorityGroups: PriorityGroup[] = Array.from(highByTheme.entries())
    .sort((x, y) => y[1].length - x[1].length)
    .slice(0, 3)
    .map(([label, items]) => ({ heading: `Improve ${label.toLowerCase()}`, items: items.slice(0, 3) }));

  // --- Strengths, grouped by area ---
  const strengthMap = new Map<string, number>();
  for (const s of strengths) {
    const g = s.group || 'other';
    strengthMap.set(g, (strengthMap.get(g) || 0) + 1);
  }
  const strengthsByTheme: AnalysisTheme[] = Array.from(strengthMap.entries())
    .map(([g, count]) => ({ label: groupLabel(g), count }))
    .filter(t => t.count > 0 && t.label !== 'Other')
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // --- Suggested implementation roadmap (time bands; operational first, so the
  // achievable low-cost work is never held up behind capital projects) ---
  const isStructural = (label: string) => STRUCTURAL_THEMES.has(label);
  const seen = new Set<string>();
  const take = (labels: string[]) => labels.filter(l => !seen.has(l) && (seen.add(l), true));
  const highT = countThemes(highActions, 6).map(t => t.label);
  const medT = countThemes(mediumActions, 6).map(t => t.label);
  const lowT = countThemes(lowActions, 6).map(t => t.label);

  const immediate: string[] = [];
  if (quickWinsCount > 0) immediate.push('Quick wins');
  immediate.push(...take([...highT.filter(l => !isStructural(l)), ...medT.filter(l => !isStructural(l))]));
  const shortTerm = take([...highT.filter(isStructural), ...medT.filter(isStructural)]);
  const longTerm = take([...lowT]);
  longTerm.push('Reassess to measure progress');

  const startingSequence: SequenceStep[] = [];
  if (immediate.length) startingSequence.push({ heading: 'Immediate (0-3 months)', items: immediate });
  if (shortTerm.length) startingSequence.push({ heading: 'Short term (3-12 months)', items: shortTerm });
  startingSequence.push({ heading: 'Long term', items: longTerm });

  return { headline, interpretation, whyItMatters, effort, priorityGroups, recurringThemes, recurringInsight, themeLeads, thematicSummaries, strengthsByTheme, startingSequence };
}
