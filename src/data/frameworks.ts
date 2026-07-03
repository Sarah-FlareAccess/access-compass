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
  /**
   * Whether a local council is legally required to report against this
   * framework. Drives the "statutory" vs "voluntary alignment" badge so we
   * never overstate a council's obligation.
   *   statutory - council must report against it (NSW, SA, VIC via s38, WA)
   *   voluntary - no council mandate; offered as an alignment aid (QLD, TAS, NT)
   *   national  - the federal backbone/default (Australia's Disability Strategy)
   *   na        - no councils exist in the jurisdiction (ACT)
   */
  mandate?: 'statutory' | 'voluntary' | 'national' | 'na';
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
    mandate: 'national',
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
    mandate: 'statutory',
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

  // Victoria - the statutory framework a council reports against is NOT the
  // "Inclusive Victoria 2022-2026" state strategy pillars, but the four
  // objectives set out in Disability Act 2006 (Vic) s38(1). A council must
  // address these matters in either a Disability Action Plan (s38(4)) or its
  // Council Plan (s38(5A)). Objectives are verbatim from the authorised Act.
  // (An optional voluntary "Inclusive Victoria" alignment layer is a later add.)
  'AU-VIC': {
    key: 'AU-VIC',
    name: 'Disability Action Plan objectives (Disability Act 2006)',
    short: 'DAP',
    citation: 'Disability Act 2006 (Vic) s 38(1)',
    mandate: 'statutory',
    generalDomainId: 'VIC-A',
    domains: [
      {
        id: 'VIC-A',
        name: 'Reducing barriers to accessing goods, services and facilities',
        short: 'Access to goods & services',
      },
      {
        id: 'VIC-B',
        name: 'Reducing barriers to obtaining and maintaining employment',
        short: 'Employment',
      },
      {
        id: 'VIC-C',
        name: 'Promoting inclusion and participation in the community',
        short: 'Inclusion & participation',
      },
      {
        id: 'VIC-D',
        name: 'Achieving tangible changes in attitudes and practices which discriminate',
        short: 'Attitudes & practices',
      },
    ],
  },

  // New South Wales - Disability Inclusion Act 2014 (NSW) s12 requires every
  // local council (a "public authority") to have a Disability Inclusion Action
  // Plan addressing the four focus areas of the NSW Disability Inclusion Plan.
  'AU-NSW': {
    key: 'AU-NSW',
    name: 'Disability Inclusion Action Plan focus areas',
    short: 'DIAP',
    citation: 'Disability Inclusion Act 2014 (NSW) s 12',
    mandate: 'statutory',
    generalDomainId: 'NSW-2',
    domains: [
      {
        id: 'NSW-1',
        name: 'Developing positive community attitudes and behaviours',
        short: 'Attitudes & behaviours',
      },
      {
        id: 'NSW-2',
        name: 'Creating liveable communities',
        short: 'Liveable communities',
      },
      {
        id: 'NSW-3',
        name: 'Supporting access to meaningful employment',
        short: 'Employment',
      },
      {
        id: 'NSW-4',
        name: 'Improving access to services through better systems and processes',
        short: 'Systems & processes',
      },
    ],
  },

  // Western Australia - Disability Services Act 1993 (WA) s28 requires every
  // local government ("public authority") to have a Disability Access and
  // Inclusion Plan addressing the seven "desired outcomes" in the Disability
  // Services Regulations 2004 (WA) Schedule 3 (outcome names paraphrased from
  // the Schedule; the seventh, employment, was added to the original six).
  // These remain the statutory framework; the "WA for Everyone 2020-2030" state
  // strategy is policy overlay and does not replace them.
  'AU-WA': {
    key: 'AU-WA',
    name: 'Disability Access and Inclusion Plan desired outcomes',
    short: 'DAIP',
    citation: 'Disability Services Act 1993 (WA) s 28; Disability Services Regulations 2004 (WA) sch 3',
    mandate: 'statutory',
    generalDomainId: 'WA-2',
    domains: [
      {
        id: 'WA-1',
        name: 'Access to services and events organised by the authority',
        short: 'Services & events',
      },
      {
        id: 'WA-2',
        name: 'Access to buildings and other facilities',
        short: 'Buildings & facilities',
      },
      {
        id: 'WA-3',
        name: 'Access to information in accessible formats',
        short: 'Accessible information',
      },
      {
        id: 'WA-4',
        name: 'Same level and quality of service from staff',
        short: 'Quality of service',
      },
      {
        id: 'WA-5',
        name: 'Opportunity to make complaints',
        short: 'Complaints',
      },
      {
        id: 'WA-6',
        name: 'Opportunity to participate in public consultation',
        short: 'Public consultation',
      },
      {
        id: 'WA-7',
        name: 'Opportunity to obtain and maintain employment',
        short: 'Employment',
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
export const SUPPORTED_JURISDICTIONS: string[] = ['AU', 'AU-SA', 'AU-VIC', 'AU-NSW', 'AU-WA'];

export function getFramework(key: string | null | undefined): Framework {
  return (key && FRAMEWORKS[key]) || FRAMEWORKS[DEFAULT_JURISDICTION];
}
