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
  themeBreakdown: { group: string; label: string; performancePct: number; assessed: number }[];
  high: number;
  medium: number;
  low: number;
}

export interface ThematicSummary {
  title: string;
  body: string;
}

export interface SequenceStep {
  heading: string;
  items: string[];
}

export interface ReportAnalysis {
  interpretation: string[];
  recurringThemes: AnalysisTheme[];
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

function joinList(items: string[]): string {
  const lower = items.map(s => s.toLowerCase());
  if (lower.length <= 1) return lower[0] || '';
  if (lower.length === 2) return `${lower[0]} and ${lower[1]}`;
  return `${lower.slice(0, -1).join(', ')} and ${lower[lower.length - 1]}`;
}

export function buildAnalysis(input: AnalysisInput): ReportAnalysis {
  const { organisation, maturity, actions, strengths, quickWinsCount, themeBreakdown, high, medium, low } = input;

  const empty: ReportAnalysis = {
    interpretation: [],
    recurringThemes: [],
    thematicSummaries: [],
    strengthsByTheme: [],
    startingSequence: [],
  };
  if (!maturity.started || actions.length + strengths.length === 0) {
    return empty;
  }

  const totalActions = high + medium + low;
  const rated = themeBreakdown.filter(t => t.assessed > 0);
  const strongest = rated.length ? rated.reduce((a, b) => (b.performancePct > a.performancePct ? b : a)) : null;
  const weakest = rated.length ? rated.reduce((a, b) => (b.performancePct < a.performancePct ? b : a)) : null;

  // --- Executive interpretation ---
  const interpretation: string[] = [];
  interpretation.push(
    `${organisation} demonstrates an ${maturity.level.toLowerCase()} level of accessibility maturity` +
    (strongest ? `, with its strongest practice in ${strongest.label.toLowerCase()}.` : '.')
  );

  const embeddedPhrase = maturity.levelIdx >= 2
    ? 'is increasingly part of everyday operations'
    : maturity.levelIdx === 1
      ? 'is developing across the organisation'
      : 'is in the early stages of being built into operations';
  interpretation.push(
    `This suggests accessibility ${embeddedPhrase}` +
    (weakest && (!strongest || weakest.group !== strongest.group)
      ? `, while the clearest opportunities remain in ${weakest.label.toLowerCase()}.`
      : '.')
  );

  if (totalActions > 0) {
    const highPct = Math.round((high / totalActions) * 100);
    interpretation.push(
      highPct >= 40
        ? `${highPct}% of the actions identified are high priority, indicating that alongside existing foundations there are several important compliance and experience gaps to close.`
        : `Most of the actions identified are lower-risk refinements, with ${highPct}% high priority.`
    );

    const structuralCount = actions.filter(a => {
      const t = a.text.toLowerCase();
      return STRUCTURAL_KWS.some(k => t.includes(k));
    }).length;
    const operationalShare = 1 - structuralCount / totalActions;
    interpretation.push(
      operationalShare >= 0.6
        ? 'Most recommended improvements appear operational rather than structural, so meaningful progress is achievable without major capital works.'
        : 'A number of the improvements involve the physical environment and are likely to need capital planning alongside operational changes.'
    );
  }

  // --- Recurring themes across all recommendations ---
  // A theme only "recurs" if it appears at least twice.
  const recurringThemes = countThemes(actions, 6, 2);

  // --- Thematic summaries: where the high-priority load sits by domain ---
  const highActions = actions.filter(a => a.priority === 'high');
  const baseForDomains = highActions.length > 0 ? highActions : actions;
  const totalForDomains = baseForDomains.length;
  const domainCounts = DOMAINS
    .map(d => ({
      label: d.label,
      count: baseForDomains.filter(a => a.group && d.groups.includes(a.group)).length,
      actions: baseForDomains.filter(a => a.group && d.groups.includes(a.group)),
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count);

  const thematicSummaries: ThematicSummary[] = domainCounts.slice(0, 2).map(d => {
    const pct = totalForDomains > 0 ? Math.round((d.count / totalForDomains) * 100) : 0;
    const topThemes = countThemes(d.actions, 3, 2).map(t => t.label);
    const scope = highActions.length > 0 ? 'the high-priority actions' : 'the actions identified';
    return {
      title: d.label,
      body:
        `The ${d.label.toLowerCase()} accounts for about ${pct}% of ${scope} (${d.count} of ${totalForDomains}).` +
        (topThemes.length ? ` The most common barriers relate to ${joinList(topThemes)}.` : '') +
        ' Addressing these early removes barriers that affect the whole visitor journey.',
    };
  });

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

  // --- Suggested starting sequence (not a fixed schedule) ---
  // Each step names the concrete themes at that priority, so nothing reads as a
  // vague placeholder.
  const startHere = countThemes(highActions, 3).map(t => t.label);
  if (quickWinsCount > 0) startHere.push('Quick wins');
  const next = countThemes(actions.filter(a => a.priority === 'medium'), 3).map(t => t.label);
  const later = countThemes(actions.filter(a => a.priority === 'low'), 3).map(t => t.label);

  const startingSequence: SequenceStep[] = [];
  if (startHere.length) startingSequence.push({ heading: 'Start here', items: startHere });
  if (next.length) startingSequence.push({ heading: 'Next', items: next });
  if (later.length) startingSequence.push({ heading: 'Later', items: later });
  startingSequence.push({ heading: 'Ongoing', items: ['Reassess to measure progress', 'Embed actions into your action plan'] });

  return { interpretation, recurringThemes, thematicSummaries, strengthsByTheme, startingSequence };
}
