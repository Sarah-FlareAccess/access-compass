/**
 * Access Statement feature map
 *
 * Curated list of customer-facing accessibility FEATURES surfaced on a venue's
 * public Access Profile. This is deliberately NOT the full module set: it draws
 * a small set of "what does this venue have" answers from the assessment, mapped
 * to the real question ids, grouped by the patron journey.
 *
 * The feature set and wording were validated against the MICF 2026 Access Survey
 * (119 responses): step-free access, accessible toilets, hearing loops, seating,
 * lighting, sound, staff support and honest, specific detail.
 *
 * Internal modules (5.2 HR, 5.4 procurement, 5.5 DIAP) never appear here. Only a
 * handful of customer-relevant questions from 5.1 and 5.3 are included.
 */

/** How a feature is detected from one or more question responses. */
export interface FeatureDef {
  label: string;
  /** yes-no-unsure questions: 'yes' means present, 'partially' means partial. */
  yesNo?: string[];
  /** multi/single-select questions where selecting any listed option means present. */
  options?: { questionId: string; anyOf: string[] }[];
  /** single-select questions where a selected option id starting with "yes" means present. */
  yesOption?: string[];
}

export interface FeatureCategory {
  id: string;
  title: string;
  features: FeatureDef[];
}

export const ACCESS_STATEMENT_CATEGORIES: FeatureCategory[] = [
  {
    id: 'getting-there',
    title: 'Getting to the venue',
    features: [
      { label: 'Accessible parking', yesNo: ['2.1-F-1'] },
      { label: 'Accessible parking close to the entrance', yesNo: ['2.1-F-2'] },
      { label: 'Drop-off point near the entrance', yesNo: ['2.1-F-3'] },
      { label: 'Step-free path from parking to the entrance', yesNo: ['2.1-F-4'] },
      { label: 'Accessible transport information provided', yesNo: ['1.1-F-8'] },
    ],
  },
  {
    id: 'getting-in',
    title: 'Getting in',
    features: [
      { label: 'Step-free access at the main entrance', options: [{ questionId: '2.2-F-1', anyOf: ['level-access'] }] },
      { label: 'Step-free access at a secondary entrance', options: [{ questionId: '2.2-F-1', anyOf: ['secondary-entrance'] }] },
      { label: 'Ramp access', options: [{ questionId: '2.2-F-1', anyOf: ['permanent-ramp', 'portable-ramp'] }] },
      { label: 'Lift at the entrance', options: [{ questionId: '2.2-F-1', anyOf: ['lift-at-entrance'] }] },
      { label: 'Handrails on entrance steps', yesNo: ['2.2-D-23'] },
      { label: 'Entrance door at least 850mm wide', yesNo: ['2.2-F-2'] },
      { label: 'Easy-open or automatic doors', yesNo: ['2.2-F-3'] },
    ],
  },
  {
    id: 'inside',
    title: 'Moving around inside',
    features: [
      { label: 'Step-free access to all audience areas', yesNo: ['3.8-D-8'], options: [{ questionId: '2.3-1-3', anyOf: ['no-level-changes'] }] },
      { label: 'Lift between levels inside', options: [{ questionId: '2.3-1-3', anyOf: ['lift', 'platform-lift'] }] },
      { label: 'Main paths at least 1 metre wide', yesNo: ['2.3-1-1'] },
      { label: 'Room to pass or turn a wheelchair', yesNo: ['2.3-D-21'] },
      { label: 'Slip-resistant floors', yesNo: ['2.3-D-11'] },
      { label: 'Seating to rest along the way', yesNo: ['2.3-D-13', '3.1-D-5'] },
    ],
  },
  {
    id: 'toilets',
    title: 'Toilets',
    features: [
      { label: 'Accessible toilet', yesNo: ['3.2-1-1'] },
      { label: 'Ambulant accessible toilet', yesNo: ['3.2-D-3'] },
      { label: 'Grab rails beside the toilet', yesNo: ['3.2-D-8'] },
      { label: 'Space to transfer beside the toilet', yesNo: ['3.2-D-9'] },
    ],
  },
  {
    id: 'seating',
    title: 'Seating and viewing',
    features: [
      { label: 'Wheelchair spaces', yesNo: ['3.8-D-3'], options: [{ questionId: '3.1-D-4', anyOf: ['wca'] }] },
      { label: 'Companion seat beside wheelchair spaces', yesNo: ['3.8-D-5'], options: [{ questionId: '3.1-D-4', anyOf: ['companion'] }] },
      { label: 'Easy-access and aisle seating', yesNo: ['3.8-D-4'], options: [{ questionId: '3.1-D-4', anyOf: ['eaa', 'eas'] }] },
      { label: 'Wider seats for larger bodies', options: [{ questionId: '3.1-D-4', anyOf: ['extra-width'] }] },
      { label: 'A variety of seating options', yesNo: ['3.1-1-1'] },
      { label: 'Clear sightlines from accessible seats', yesNo: ['3.1-D-12', '3.8-D-6'] },
      { label: 'Accessible seating as easy to book as standard', yesNo: ['3.1-D-13'] },
    ],
  },
  {
    id: 'sensory',
    title: 'Sensory environment',
    features: [
      { label: 'Comfortable lighting for navigation', yesNo: ['3.3-1-1'] },
      { label: 'Adjustable or dimmable lighting', yesNo: ['3.3-D-1'] },
      { label: 'Quiet or sensory-break space', yesNo: ['3.3-1-2'] },
      { label: 'Relaxed or sensory-friendly sessions', yesNo: ['3.3-1-7'] },
      { label: 'Background noise kept manageable', yesNo: ['3.3-1-3'] },
    ],
  },
  {
    id: 'hearing-comms',
    title: 'Hearing and communication access',
    features: [
      { label: 'Hearing loop or assistive listening', options: [{ questionId: '3.8-D-25', anyOf: ['yes-fixed', 'yes-portable'] }, { questionId: '3.3-D-7', anyOf: ['hearing-loops', 'assistive-listening'] }], yesOption: ['3.3-1-8'] },
      { label: 'Captioned performances', yesOption: ['3.8-D-23'], yesNo: ['3.7-PC-7'] },
      { label: 'Auslan interpretation available', yesOption: ['3.8-D-11', '4.2-D-18b'] },
      { label: 'Audio description available', yesOption: ['3.8-D-22'] },
    ],
  },
  {
    id: 'service',
    title: 'Service and support',
    features: [
      { label: 'Staff disability-awareness training', yesNo: ['4.2-F-1', '5.3-F-1'] },
      { label: 'Assistance animals welcome', yesNo: ['4.2-F-2', '5.1-F-6'] },
      { label: 'Companion Card accepted', yesNo: ['4.3-D-3', '5.1-F-4'] },
      { label: 'Priority access when needed', yesNo: ['2.4-1-2'] },
      { label: 'Access needs captured at booking', yesNo: ['1.3-PC-2', '4.3-D-2'] },
      { label: 'Accessible online booking', yesNo: ['4.3-D-1'] },
      { label: 'Alternatives to phone contact', yesNo: ['4.1-PC-1'] },
    ],
  },
];

/** Module codes referenced by the feature map, so the page loads their progress. */
export const accessStatementModuleIds: string[] = Array.from(
  new Set(
    ACCESS_STATEMENT_CATEGORIES.flatMap((c) =>
      c.features.flatMap((f) => [
        ...(f.yesNo ?? []),
        ...(f.options ?? []).map((o) => o.questionId),
        ...(f.yesOption ?? []),
      ]),
    ).map((qid) => qid.split('-')[0]),
  ),
);
