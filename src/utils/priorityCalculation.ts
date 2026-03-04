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

export function getTimeframeForPriority(priority: Priority): string {
  switch (priority) {
    case 'high': return 'Within 1 month';
    case 'medium': return 'Within 3 months';
    case 'low': return 'Within 6 months';
  }
}

export function getDIAPTimeframeForPriority(priority: Priority): string {
  switch (priority) {
    case 'high': return '0-30 days';
    case 'medium': return '30-90 days';
    case 'low': return '3-12 months';
  }
}

export const PRIORITY_LEGEND: { level: Priority; label: string; description: string }[] = [
  {
    level: 'high',
    label: 'High',
    description: 'Mandatory compliance gaps and safety items. Address within 1 month.',
  },
  {
    level: 'medium',
    label: 'Medium',
    description: 'High-impact best-practice gaps and items needing investigation. Address within 3 months.',
  },
  {
    level: 'low',
    label: 'Low',
    description: 'Lower-impact best-practice improvements. Address within 6 months.',
  },
];
