import type { CategorisedItem } from '../hooks/useReportGeneration';

export interface ProfessionalSupportGroup {
  type: string;
  label: string;
  description: string;
  moduleCodes: string[];
}

export const FLARE_CONTACT = {
  label: 'Need a hand?',
  description: 'Flare Access provides expert support across all of these areas.',
  email: 'hello@flareaccess.com.au',
  website: 'flareaccess.com.au',
};

const EXPERTISE_TYPES: {
  type: string;
  label: string;
  description: string;
  modulePatterns: RegExp[];
  groupIds?: string[];
}[] = [
  {
    type: 'digital',
    label: 'Digital accessibility',
    description: 'Auditing websites, apps, and digital content against WCAG 2.2, including navigation, contrast, screen reader compatibility, and mobile usability.',
    modulePatterns: [/^1\.2$/, /^1\.3$/, /^1\.4$/],
  },
  {
    type: 'physical',
    label: 'Physical access',
    description: 'Assessing structural elements like entrances, ramps, paths, doors, and amenities against the Premises Standards and AS 1428.1.',
    modulePatterns: [/^2\./, /^3\.1$/, /^3\.2$/, /^3\.3$/, /^3\.4$/, /^3\.5$/, /^3\.6$/, /^3\.7$/, /^3\.9$/, /^3\.10$/],
    groupIds: ['getting-in'],
  },
  {
    type: 'experiences',
    label: 'Experience and activity access',
    description: 'Reviewing activities, tours, events, and recreational experiences to ensure they are accessible and welcoming for people with disability.',
    modulePatterns: [/^3\.8$/, /^6\./],
    groupIds: ['events'],
  },
  {
    type: 'communication',
    label: 'Communication and information',
    description: 'Reviewing pre-visit information, signage, wayfinding, and communication materials for clarity, plain language, and accessibility.',
    modulePatterns: [/^1\.1$/, /^1\.5$/, /^1\.6$/, /^3\.5$/, /^3\.6$/],
  },
  {
    type: 'service',
    label: 'Service design and training',
    description: 'Disability awareness training, inclusive service design, complaint handling, and customer service process improvement.',
    modulePatterns: [/^4\./],
    groupIds: ['service-support'],
  },
  {
    type: 'organisational',
    label: 'Organisational and strategic',
    description: 'Developing your Disability Inclusion Action Plan (DIAP), accessible procurement practices, and organisational accessibility strategy.',
    modulePatterns: [/^5\./],
    groupIds: ['organisational-commitment'],
  },
];

function getExpertiseType(moduleCode: string): string {
  for (const exp of EXPERTISE_TYPES) {
    if (exp.modulePatterns.some(p => p.test(moduleCode))) {
      return exp.type;
    }
  }
  return 'physical'; // default fallback
}

export function groupProfessionalReviewByExpertise(
  items: CategorisedItem[]
): ProfessionalSupportGroup[] {
  if (items.length === 0) return [];

  const grouped = new Map<string, Set<string>>();

  for (const item of items) {
    const type = getExpertiseType(item.moduleCode);
    let codes = grouped.get(type);
    if (!codes) {
      codes = new Set();
      grouped.set(type, codes);
    }
    codes.add(item.moduleCode);
  }

  const result: ProfessionalSupportGroup[] = [];

  for (const exp of EXPERTISE_TYPES) {
    const codes = grouped.get(exp.type);
    if (codes && codes.size > 0) {
      const sortedCodes = Array.from(codes).sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );
      result.push({
        type: exp.type,
        label: exp.label,
        description: exp.description,
        moduleCodes: sortedCodes,
      });
    }
  }

  return result;
}
