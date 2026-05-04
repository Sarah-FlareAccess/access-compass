/**
 * Help Content: Major Events (7.x)
 * Modules: 7.1 (Precinct & multi-venue coordination)
 * Future: 7.2-7.6 to be added in subsequent phases.
 */

import type { HelpContent } from './types';

export const majorEventsHelp: HelpContent[] = [

// ─── Entry 1: Precinct and multi-venue coordination ───
{
  questionId: '7.1-PC-1',
  questionText: 'Multi-venue accessibility coordination plan',
  moduleCode: '7.1',
  moduleGroup: 'major-events',
  diapCategory: 'operations-policy-procedure',
  title: 'Precinct and multi-venue coordination',
  coveredQuestionIds: ['7.1-PC-2', '7.1-PC-3', '7.1-PC-4', '7.1-PC-5', '7.1-PC-6', '7.1-DD-1', '7.1-DD-2', '7.1-DD-3', '7.1-DD-4', '7.1-DD-5', '7.1-DD-6', '7.1-DD-7', '7.1-DD-8', '7.1-DD-9', '7.1-DD-10'],
  summary: 'Major events span many venues, days, and audience cohorts. The accessibility difference between a single venue with strong access and a precinct with consistently strong access is precinct-wide coordination: a documented plan, a senior named owner, a live information register, a minimum venue standard, consistent wayfinding, and a real-time issue propagation process.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'A festival like Fringe runs across 100+ venues; Melbourne Fashion Week activates a precinct of stages and pop-ups; Vivid lights up multiple districts. Without coordination, the audience experience varies wildly by which venue they walk into, and the accessibility commitment becomes a slogan. Precinct-wide coordination is what turns "we care about access" into "any audience member can plan a multi-venue day with confidence".',
    statistic: { value: '#1', context: 'cause of accessibility complaints at multi-venue major events is inconsistent or stale information across venues, not the venues themselves. A central register and 24-hour propagation process resolves the majority.', source: 'Practitioner observation across major Australian festivals' },
  },
  tips: [
    { icon: 'FileText', text: 'Document a multi-venue coordination plan covering minimum standard, owners, escalation, and review.', priority: 1 },
    { icon: 'UserCheck', text: 'Name a senior precinct-wide accessibility owner with cross-venue authority and budget.', priority: 2 },
    { icon: 'Database', text: 'Maintain a live central register of accessibility info across all venues with 24-hour SLA on changes.', priority: 3 },
    { icon: 'ShieldCheck', text: 'Set a documented minimum venue accessibility standard and make it a contract requirement.', priority: 4 },
    { icon: 'MapPin', text: 'Standardise accessible wayfinding from HUB to satellite venues across visual, tactile, and digital formats.', priority: 5 },
    { icon: 'Map', text: 'Publish a multi-format accessible event map (digital WCAG AA, print high-contrast, tactile and Easy Read for major events).', priority: 6 },
  ],
  howToCheck: {
    title: 'Auditing precinct-wide accessibility coordination',
    steps: [
      { text: 'Locate your multi-venue coordination plan. Is it documented? When was it last updated?' },
      { text: 'Ask three random venue managers: "Who do you contact about an access issue precinct-wide?" Is the answer consistent?' },
      { text: 'Pick a random venue from your program and check its access info on the website, in the program, and at the venue. Do they match?' },
      { text: 'Pull your minimum venue standard. Has every contracted venue been audited against it?' },
      { text: 'Walk a route from HUB to a satellite venue. Is wayfinding consistent? Could a wheelchair user follow it? A Blind user?' },
      { text: 'Try the event map in WCAG checker (WAVE, axe). Does it pass AA? Are tactile and Easy Read versions available on request?' },
    ],
    estimatedTime: '4-6 hours',
  },
  solutions: [
    {
      title: 'Establish a coordination plan + named owner',
      description: 'Stand up the foundation: documented plan and a senior named owner with cross-venue authority.',
      resourceLevel: 'low', costRange: '$2,000-8,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'quick-win',
      steps: [
        'Draft a one-page multi-venue accessibility plan covering minimum standard, owners, escalation, and review.',
        'Name a senior role (Director / Head of Operations) as precinct-wide accessibility owner.',
        'Document their authority in writing — budget, escalation, contract enforcement.',
        'Brief venue managers and event leadership on the plan and owner.',
        'Add the plan to the DIAP as a named artefact.',
      ],
    },
    {
      title: 'Central register with 24-hour SLA',
      description: 'Build a live central accessibility register covering every venue with rapid update propagation.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '2-4 months', implementedBy: 'staff', impact: 'significant',
      steps: [
        'List every venue and the accessibility info that applies (entry, toilets, hearing aug, viewing, parking).',
        'Choose a central data source (shared document, intranet page, or simple database).',
        'Map every customer-facing channel that publishes venue accessibility info (website, program, app, social, on-site signage).',
        'Set a 24-hour propagation SLA for any access change during the event.',
        'Run a "lift outage" drill before opening to test propagation across all channels.',
      ],
    },
    {
      title: 'Minimum venue standard + pre-audit',
      description: 'Document a minimum accessibility standard and audit every venue against it before contracting.',
      resourceLevel: 'medium', costRange: '$8,000-25,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: [
        'Define the minimum standard (e.g., AS 1428.1 entrance access or tested alternative, accessible toilet within 50m, accessible viewing).',
        'Add the standard as a contract requirement for participating venues.',
        'Engage an accessibility consultant or train internal auditors.',
        'Pre-audit every contracted venue. Cluster small venues for practicality.',
        'Disclose any venue gaps publicly so audiences can plan.',
        'Audit a sample again before the event opens to confirm nothing has slipped.',
      ],
    },
    {
      title: 'Coordinated wayfinding and accessible event map',
      description: 'Standardise wayfinding from HUB to satellites; produce multi-format accessible map.',
      resourceLevel: 'medium', costRange: '$10,000-40,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: [
        'Develop wayfinding standard: WCAG-compliant visual style, mounting heights, alternative formats.',
        'Apply standard at HUB and all satellite venues.',
        'Produce digital map (WCAG 2.2 AA, interactive) and print map (high contrast, large type, plain language).',
        'For major events, add tactile maps at HUB and major venues plus Easy Read version.',
        'Test wayfinding with wheelchair user, Deaf user, and Blind user before opening (paid walk-through).',
        'Include accessible alternatives in event app: audio descriptions of routes, captioned wayfinding videos.',
      ],
    },
  ],
  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Major Festival',
      scenario: 'Festival across 80 venues. Disabled audience members reported wildly inconsistent experiences year over year. Some venues excellent, others booked despite step-only access. Box office staff couldn\'t reliably answer which venues had hearing loops.',
      solution: 'Established a Festival Access Director role (senior, cross-venue authority). Built a central accessibility register feeding the website, app, and box office staff briefings. Set a documented minimum venue standard and pre-audited every venue before contracting.',
      outcome: 'Disabled audience disclosure at booking up 40%. Complaint volume halved. Festival cited by Australian Disability Network as model for major event coordination.',
      cost: '$45,000 (Director time + register + audits)',
      timeframe: '12 months to bed in',
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Civic Festival',
      scenario: 'Council ran a 3-week civic festival across 12 council-owned venues plus 8 partner venues. No coordinated standard. Inconsistent wayfinding meant some accessible routes weren\'t signed.',
      solution: 'Used council\'s existing accessibility info register (Module 5.1) and extended to cover festival venues. Set a written minimum standard for partner venues as a participation condition. Council Access Officer became precinct-wide owner during festival.',
      outcome: 'Audience feedback noted festival as best-coordinated council event for accessibility. Two partner venues completed permanent access upgrades to meet the standard.',
      cost: '$12,000',
      timeframe: '6 months',
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Fashion Week',
      scenario: 'Fashion week ran shows at 15 pop-up venues and 5 permanent ones. Each venue had its own front-of-house team, wayfinding, and access info. No central coordination.',
      solution: 'Hired a precinct accessibility coordinator for the 8-week peak season. Established daily access huddles during show week. Pre-event audit of all pop-ups (cheaper than ramp hire on the day). Common branded wayfinding kit shipped to every venue.',
      outcome: 'Disabled fashion press attended in significantly higher numbers. International coverage of accessibility commitments. Coordinator role retained year-round at 0.4 FTE.',
      cost: '$28,000 (coordinator + audits + kit)',
      timeframe: '4 months',
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Sporting Major Event',
      scenario: 'Multi-day sporting precinct event activating 6 venues plus public viewing zones. Emergency evacuation plans existed venue-by-venue but no precinct strategy. PEEP-holders unaccounted for in cross-venue scenarios.',
      solution: 'Developed precinct-wide evacuation strategy with disability-access scenarios. Coordinated with state emergency services. Ran a drill before opening including a wheelchair-user-on-second-floor scenario.',
      outcome: 'Drill identified two refuge points needed retrofit. Resolved before opening. Precinct evacuation now drilled annually.',
      cost: '$15,000',
      timeframe: '5 months',
    },
  ],
  resources: [
    { title: 'IncludeAbility - Accessible Events Toolkit', url: 'https://includeability.gov.au/', type: 'website', source: 'Australian Human Rights Commission', description: 'Free practical guidance on accessible event planning at scale.', isAustralian: true, isFree: true },
    { title: 'Safe Work Australia - Emergency Plans', url: 'https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/emergency-plan', type: 'guide', source: 'Safe Work Australia', description: 'WHS guidance for emergency planning including disability-access scenarios.', isAustralian: true, isFree: true },
    { title: 'AHRC - Accessible Communications', url: 'https://humanrights.gov.au/our-work/disability-rights', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on consistent and accessible communication of access information.', isAustralian: true, isFree: true },
    { title: 'WCAG 2.2 Quick Reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/', type: 'tool', source: 'W3C', description: 'Standard for digital event maps, websites, and apps publishing accessibility info.', isAustralian: false, isFree: true },
    { title: 'Vision Australia - Accessible Wayfinding', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', description: 'Tactile mapping and accessible wayfinding consultancy.', isAustralian: true, isFree: false },
  ],
  keywords: ['precinct', 'multi-venue', 'festival', 'major event', 'coordination', 'access register', 'minimum venue standard', 'wayfinding', 'event map', 'evacuation', 'real-time updates'],
}

];

export default majorEventsHelp;
