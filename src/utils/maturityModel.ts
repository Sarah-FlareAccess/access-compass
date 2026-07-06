/**
 * Accessibility maturity: a practice-based level (not a pass-rate). Reflects how
 * far an organisation has moved through the improvement cycle, gated by coverage
 * and performance so partial or self-selected data cannot overclaim.
 *
 * Shared by the Dashboard snapshot and the generated report so both always agree.
 * Every input already exists in the dashboard's overallStats and can be assembled
 * from a report's aggregated summaries, so it works at site, org and report scope.
 */

export interface MaturityStats {
  /** Coverage: % of in-scope modules completed. */
  progressPercentage: number;
  totalDoingWell: number;
  totalActions: number;
  modulesCompleted: number;
  modulesInProgress: number;
  diapItemCount: number;
  diapAchieved: number;
  diapOngoing: number;
  diapInProgress: number;
}

export interface MaturityResult {
  started: boolean;
  levelIdx: number;
  level: string;
  stageIdx: number;
  stages: string[];
  confidence: 'High' | 'Medium' | 'Low';
  coveragePct: number;
  performancePct: number;
  nextStage: string | null;
  /** Plain-language meaning of the level, generic to any organisation. */
  meaning: string;
}

// What each maturity level means and where the focus goes next. Level-generic
// (never assumes the gaps are physical or operational for a given org).
const LEVEL_MEANING: string[] = [
  'Accessibility is in the early stages of being built into how the organisation works. The focus now is to assess more areas and begin planning.',
  'Accessibility foundations are forming across the organisation. The focus now is to turn the assessment into a plan and start acting on it.',
  'Strong accessibility foundations are in place across most assessed areas. The focus now shifts from putting systems in place to acting on the plan and embedding continuous improvement.',
  'Accessibility is part of everyday operations. The focus now is to sustain it, keep measuring progress and keep improving.',
];

export function computeMaturity(s: MaturityStats): MaturityResult {
  const cov = s.progressPercentage;
  const rated = s.totalDoingWell + s.totalActions;
  const perf = rated > 0 ? Math.round((s.totalDoingWell / rated) * 100) : 0;
  const started = s.modulesCompleted + s.modulesInProgress > 0;
  const hasPlan = s.diapItemCount > 0;
  const acting = s.diapAchieved + s.diapInProgress > 0;
  const embedding = s.diapOngoing > 0;

  const stages = ['Aware', 'Assessing', 'Planning', 'Acting', 'Embedding'];
  let stage = started ? 0 : -1;
  if (cov >= 40) stage = Math.max(stage, 1);
  if (hasPlan) stage = Math.max(stage, 2);
  if (acting) stage = Math.max(stage, 3);
  if (embedding) stage = Math.max(stage, 4);

  const confidence: MaturityResult['confidence'] = cov >= 70 ? 'High' : cov >= 40 ? 'Medium' : 'Low';

  // Follow-through: of the findings raised, how many are being acted on
  // (achieved / ongoing / in progress). This rewards doing what you can, NOT
  // feature-perfection, so a small org with barriers it cannot remove (heritage
  // building, leased premises) can still reach the top by acting on everything
  // within its control. Performance (% doing well) is shown as context but never
  // gates the level.
  const followThrough = s.diapItemCount > 0
    ? (s.diapAchieved + s.diapOngoing + s.diapInProgress) / s.diapItemCount
    : 0;

  const levels = ['Emerging', 'Developing', 'Established', 'Embedded'];
  let levelIdx: number;
  if (stage <= 1) levelIdx = 0;
  else if (stage === 2) levelIdx = 1;
  else if (stage === 3) levelIdx = cov >= 50 ? 2 : 1;
  else levelIdx = cov >= 70 && followThrough >= 0.7 ? 3 : 2;
  // Low coverage can never present above Developing, however deep the practice.
  if (confidence === 'Low' && levelIdx > 1) levelIdx = 1;

  return {
    started,
    levelIdx,
    level: levels[levelIdx],
    stageIdx: stage,
    stages,
    confidence,
    coveragePct: cov,
    performancePct: perf,
    nextStage: stage >= 0 && stage < stages.length - 1 ? stages[stage + 1] : null,
    meaning: LEVEL_MEANING[levelIdx] || LEVEL_MEANING[0],
  };
}

/** Journey-group labels and a suggested owning area, for report theme and routing. */
export const GROUP_META: { id: string; label: string; ownerArea: string }[] = [
  { id: 'before-arrival', label: 'Before arrival', ownerArea: 'Communications & Digital' },
  { id: 'getting-in', label: 'Getting in & moving around', ownerArea: 'Facilities & Assets' },
  { id: 'during-visit', label: 'During the visit', ownerArea: 'Facilities & Assets' },
  { id: 'service-support', label: 'Service & support', ownerArea: 'Customer Service' },
  { id: 'organisational-commitment', label: 'Organisation & policy', ownerArea: 'Governance & People' },
  { id: 'events', label: 'Events', ownerArea: 'Events' },
  { id: 'major-events', label: 'Major events', ownerArea: 'Events' },
];

export function groupLabel(groupId: string): string {
  return GROUP_META.find(g => g.id === groupId)?.label || 'Other';
}

export function groupOwnerArea(groupId: string): string {
  return GROUP_META.find(g => g.id === groupId)?.ownerArea || 'To be assigned';
}

export function groupOrderIndex(groupId: string): number {
  const i = GROUP_META.findIndex(g => g.id === groupId);
  return i === -1 ? GROUP_META.length : i;
}
