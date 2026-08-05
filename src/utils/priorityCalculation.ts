import { isComplianceObligation } from './complianceLevel';

type Priority = 'high' | 'medium' | 'low';

interface PriorityInput {
  complianceLevel?: 'mandatory' | 'best-practice' | 'wcag-aa' | 'dda-compliant';
  safetyRelated?: boolean;
  impactLevel?: 'high' | 'medium' | 'low';
  answer: string;
}

export function calculateQuestionPriority({
  complianceLevel,
  safetyRelated,
  impactLevel,
  answer,
}: PriorityInput): Priority {
  if (safetyRelated) return 'high';

  if (answer === 'unable-to-check' || answer === 'not-sure') return 'medium';

  // Was `=== 'mandatory'`, which silently excluded the 16 questions authored
  // as dda-compliant and the one as wcag-aa. Those are obligations too, and
  // could never reach high priority however they were answered.
  const isMandatory = isComplianceObligation(complianceLevel);

  // A flat "no" on a high-impact item now reaches high priority on its own.
  // Previously the only routes to high were compliance and safety, so high
  // impact was capped at medium and "high priority but best practice" was
  // unreachable. That forced the compliance badge to do the priority's job:
  // items were tagged as obligations to get them into the top band, which is
  // how a copy task ended up labelled as compliance.
  //
  // Priority answers "where do I start", the compliance badge answers "is this
  // a legal obligation". They are separate questions and both can now be true
  // or false independently.
  if (answer === 'no') {
    if (isMandatory) return 'high';
    if (impactLevel === 'high') return 'high';
    return 'low';
  }

  // "Partially" stays at medium for high impact. Something part-done is not
  // the same as absent, and promoting both would flood the top band and make
  // the ranking useless, which is the failure this is meant to fix.
  if (answer === 'partially') {
    if (isMandatory) return 'high';
    if (impactLevel === 'high') return 'medium';
    return 'low';
  }

  return 'medium';
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

export const PRIORITY_BADGE_ABBR: Record<Priority, string> = {
  high: 'H',
  medium: 'M',
  low: 'L',
};

export const PRIORITY_LEGEND: { level: Priority; label: string; description: string }[] = [
  {
    level: 'high',
    label: 'High',
    description: 'Safety-related items, gaps against a compliance obligation (the DDA, the Premises Standards, AS 1428, WCAG 2.2 AA or the NCC), and high-impact items that are not in place at all. These carry the greatest legal, safety or human cost, and are where to start.',
  },
  {
    level: 'medium',
    label: 'Medium',
    description: 'High-impact items that are partly in place and need finishing, and items that need further investigation to determine their current state. Real improvements to the experience of people with disability, on foundations that already exist.',
  },
  {
    level: 'low',
    label: 'Low',
    description: 'Best-practice improvements that make a real, meaningful difference to accessibility and inclusion. These are not less important, just lower legal risk.',
  },
];

export const PRIORITY_ENCOURAGEMENT = 'Every action here is worth doing. Priority levels help you decide where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Start wherever you can and build from there.';
