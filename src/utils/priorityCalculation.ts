type Priority = 'high' | 'medium' | 'low';

interface PriorityInput {
  complianceLevel?: 'mandatory' | 'best-practice';
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

  const isMandatory = complianceLevel === 'mandatory';

  if (answer === 'no') {
    if (isMandatory) return 'high';
    if (impactLevel === 'high') return 'medium';
    return 'low';
  }

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
    description: 'Gaps in mandatory compliance requirements (Premises Standards, WCAG, NCC) and safety-related items. These carry the highest legal and safety risk and should be addressed first where possible.',
  },
  {
    level: 'medium',
    label: 'Medium',
    description: 'High-impact improvements that significantly affect the experience of people with disability, and items that need further investigation to determine their current state.',
  },
  {
    level: 'low',
    label: 'Low',
    description: 'Best-practice improvements that make a real, meaningful difference to accessibility and inclusion. These are not less important, just lower legal risk.',
  },
];

export const PRIORITY_ENCOURAGEMENT = 'Every action here is worth doing. Priority levels help you decide where to start, not what to skip. Even "low" priority items can have a meaningful impact on someone\'s experience. Start wherever you can and build from there.';
