// Statutory disability inclusion frameworks per jurisdiction.
// Drives the Statutory Plan Alignment "Outcomes view": Access Compass findings
// are categorised against the council's home framework for statutory reporting.
//
// v1 supports domain-level categorisation only (no measures/indicators yet;
// those are a v2 addition if a customer asks). See feature scope memory.
//
// SA (SDIP) domains + outcome statements are taken verbatim from the official
// "Disability Access and Inclusion Plan (DAIP) Guidelines for South Australian
// state authorities" (Dept of Human Services), which operationalise the State
// Disability Inclusion Plan 2025-2029 outcomes framework.

export interface FrameworkDomain {
  id: string;
  name: string;
  short: string;
  /** Official outcome statement for the domain, shown as the section subhead. */
  outcomeStatement?: string;
}

export interface Framework {
  key: string;
  name: string;
  short: string;
  citation: string;
  domains: FrameworkDomain[];
  /**
   * The "inclusive environments/communities" domain. Modules mapped to this
   * domain are the general on-site/access modules that also roll up into a
   * business's facility service-domain (Layer 2 overlay).
   */
  generalDomainId: string;
}

export const FRAMEWORKS: Record<string, Framework> = {
  // Australia's Disability Strategy 2021-2031 - national default.
  AU: {
    key: 'AU',
    name: "Australia's Disability Strategy 2021-2031",
    short: 'ADS',
    citation: "Australia's Disability Strategy 2021-2031 (Commonwealth)",
    generalDomainId: 'ADS-2',
    domains: [
      { id: 'ADS-1', name: 'Employment and financial security', short: 'Employment' },
      { id: 'ADS-2', name: 'Inclusive homes and communities', short: 'Inclusive communities' },
      { id: 'ADS-3', name: 'Safety, rights and justice', short: 'Safety & rights' },
      { id: 'ADS-4', name: 'Personal and community support', short: 'Support' },
      { id: 'ADS-5', name: 'Education and learning', short: 'Education' },
      { id: 'ADS-6', name: 'Health and wellbeing', short: 'Health' },
      { id: 'ADS-7', name: 'Community attitudes', short: 'Attitudes' },
    ],
  },

  // South Australia - State Disability Inclusion Plan 2025-2029 ("Inclusive SA").
  'AU-SA': {
    key: 'AU-SA',
    name: 'State Disability Inclusion Plan 2025-2029 (Inclusive SA)',
    short: 'SDIP',
    citation:
      'Disability Inclusion Act 2018 (SA), as amended by the Disability Inclusion (Review Recommendations) Amendment Act 2024',
    generalDomainId: 'SDIP-1',
    domains: [
      {
        id: 'SDIP-1',
        name: 'Inclusive environments and communities',
        short: 'Inclusive communities',
        outcomeStatement:
          'A South Australia where all people with disability can participate as equal citizens and feel connected to their communities.',
      },
      {
        id: 'SDIP-2',
        name: 'Education and employment',
        short: 'Education & employment',
        outcomeStatement:
          'A South Australia where all people with disability benefit from inclusive educational experiences, equitable employment opportunities and financial security.',
      },
      {
        id: 'SDIP-3',
        name: 'Personal and community support',
        short: 'Personal & community support',
        outcomeStatement:
          'A South Australia where people with disability can access quality, tailored personal and community supports addressing their individual needs.',
      },
      {
        id: 'SDIP-4',
        name: 'Health and wellbeing',
        short: 'Health & wellbeing',
        outcomeStatement:
          'A South Australia where all people with disability can attain the highest possible health and wellbeing outcomes throughout their lives.',
      },
      {
        id: 'SDIP-5',
        name: 'Safety, rights and justice',
        short: 'Safety, rights & justice',
        outcomeStatement:
          'A South Australia where all people with disability feel safe, have their rights upheld and have full and equal protection before the law.',
      },
    ],
  },
};

// SA priority groups councils must explicitly address (DAIP Guidelines).
// Not used by the domain-level Outcomes view yet; retained for the priority-group
// coverage work (modules 5.11/5.12) and future reporting.
export const SA_PRIORITY_GROUPS = [
  'Aboriginal people with disability',
  'People from culturally and linguistically diverse backgrounds with disability',
  'Women with disability',
  'Children with disability',
  'People with disability who identify as LGBTIQA+',
  'People with significant intellectual disability or high levels of vulnerability',
  'People with disability who live in regional communities',
];

export const DEFAULT_JURISDICTION = 'AU';

// Jurisdictions with a fully defined framework + module mappings shipped so far.
// Add keys here as each state's mappings land (Session 2+).
export const SUPPORTED_JURISDICTIONS: string[] = ['AU', 'AU-SA'];

export function getFramework(key: string | null | undefined): Framework {
  return (key && FRAMEWORKS[key]) || FRAMEWORKS[DEFAULT_JURISDICTION];
}
