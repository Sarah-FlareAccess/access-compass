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
  high: 'Essential',
  medium: 'Important',
  low: 'Beneficial',
};

export const PRIORITY_BADGE_ABBR: Record<Priority, string> = {
  high: 'E',
  medium: 'I',
  low: 'B',
};

export const PRIORITY_LEGEND: { level: Priority; label: string; description: string }[] = [
  {
    level: 'high',
    label: 'Essential',
    description: 'Mandatory compliance gaps and safety items.',
  },
  {
    level: 'medium',
    label: 'Important',
    description: 'High-impact best-practice gaps and items needing investigation.',
  },
  {
    level: 'low',
    label: 'Beneficial',
    description: 'Best-practice improvements that enhance the experience for people with disability.',
  },
];
