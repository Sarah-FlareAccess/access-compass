/**
 * Access Statement feature map
 *
 * Curated list of customer-facing accessibility FEATURES surfaced on a venue's
 * public Access Profile. This is deliberately NOT the full module set: it draws
 * a small set of "what does this venue have" answers from the assessment, mapped
 * to the real question ids, grouped by the patron journey.
 *
 * Each feature carries a `phrase`: a warm, mid-sentence fragment used to compose
 * the profile as flowing copy rather than a cold Yes/No list. Each category
 * carries a `lead` that opens its paragraph.
 *
 * The feature set and wording were validated against the MICF 2026 Access Survey
 * (119 responses). Internal modules (5.2 HR, 5.4 procurement, 5.5 DIAP) never
 * appear here.
 */

/** How a feature is detected from one or more question responses. */
export interface FeatureDef {
  /** Short label for the edit UI. */
  label: string;
  /** Warm, lowercase, mid-sentence fragment for the composed copy. */
  phrase: string;
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
  /** Opens the category's composed paragraph, e.g. "Getting here". */
  lead: string;
  features: FeatureDef[];
}

export const ACCESS_STATEMENT_CATEGORIES: FeatureCategory[] = [
  {
    id: 'planning',
    title: 'Planning your visit',
    lead: 'To plan ahead',
    features: [
      { label: 'Accessible website', phrase: 'a website tested with screen readers', options: [{ questionId: '1.2-1-8', anyOf: ['yes-regular', 'yes-once'] }] },
      { label: 'Social story or visual guide', phrase: 'a social story or visual guide to preview your visit', options: [{ questionId: '1.1-D-13', anyOf: ['yes-downloadable', 'yes-online'] }] },
      { label: 'Sensory map or guide', phrase: 'a sensory map or guide to the venue', options: [{ questionId: '3.3-D-10', anyOf: ['yes-detailed', 'yes-basic'] }] },
      { label: 'Information in large print or Easy Read', phrase: 'key information in large print or Easy Read', yesNo: ['3.6-1-1'], options: [{ questionId: '3.6-1-4', anyOf: ['yes-both', 'easy-read', 'plain-english'] }] },
      { label: 'Quiet and busy times published', phrase: 'information about quiet and busy times to help you plan', yesNo: ['2.4-D-9'] },
      { label: 'Content and sensory warnings', phrase: 'content and sensory warnings in advance', options: [{ questionId: '7.2-PC-6', anyOf: ['yes-detailed', 'yes-basic'] }, { questionId: '6.4-D-7', anyOf: ['yes-advance-and-immediate', 'yes-advance', 'yes-immediate'] }] },
    ],
  },
  {
    id: 'getting-there',
    title: 'Getting to the venue',
    lead: 'Getting here',
    features: [
      { label: 'Accessible parking', phrase: 'accessible parking', yesNo: ['2.1-F-1', '2.1-F-2'] },
      { label: 'Drop-off point near the entrance', phrase: 'a drop-off point right by the entrance', yesNo: ['2.1-F-3'] },
      { label: 'Step-free path from parking to the entrance', phrase: 'a level, step-free path from the car park to the door', yesNo: ['2.1-F-4'] },
      { label: 'Accessible transport information provided', phrase: 'clear information about accessible public transport', yesNo: ['1.1-F-8'] },
    ],
  },
  {
    id: 'getting-in',
    title: 'Getting in',
    lead: 'Coming in',
    features: [
      { label: 'Step-free access at the main entrance', phrase: 'step-free entry at the main entrance', options: [{ questionId: '2.2-F-1', anyOf: ['level-access'] }] },
      { label: 'Step-free access at a secondary entrance', phrase: 'a step-free secondary entrance', options: [{ questionId: '2.2-F-1', anyOf: ['secondary-entrance'] }] },
      { label: 'Ramp access', phrase: 'a ramp for level access', options: [{ questionId: '2.2-F-1', anyOf: ['permanent-ramp', 'portable-ramp'] }] },
      { label: 'Lift at the entrance', phrase: 'a lift at the entrance', options: [{ questionId: '2.2-F-1', anyOf: ['lift-at-entrance'] }] },
      { label: 'Handrails on entrance steps', phrase: 'handrails on the entrance steps', yesNo: ['2.2-D-23'] },
      { label: 'Entrance door at least 850mm wide', phrase: 'an entrance door at least 850mm wide', yesNo: ['2.2-F-2'] },
      { label: 'Easy-open or automatic doors', phrase: 'doors that are easy to open, or automatic', yesNo: ['2.2-F-3'] },
    ],
  },
  {
    id: 'inside',
    title: 'Moving around inside',
    lead: 'Moving around inside',
    features: [
      { label: 'Step-free access to all audience areas', phrase: 'step-free access throughout, including all audience areas', yesNo: ['3.8-D-8'], options: [{ questionId: '2.3-1-3', anyOf: ['no-level-changes'] }] },
      { label: 'Lift between levels inside', phrase: 'a lift between levels', options: [{ questionId: '2.3-1-3', anyOf: ['lift', 'platform-lift'] }] },
      { label: 'Main paths at least 1 metre wide', phrase: 'wide, uncluttered paths', yesNo: ['2.3-1-1'] },
      { label: 'Room to pass or turn a wheelchair', phrase: 'room to pass others or turn a wheelchair', yesNo: ['2.3-D-21'] },
      { label: 'Slip-resistant floors', phrase: 'firm, slip-resistant floors', yesNo: ['2.3-D-11'] },
      { label: 'Clear signage and wayfinding', phrase: 'clear signage and wayfinding to key places', yesNo: ['2.3-D-5'] },
      { label: 'Seating to rest along the way', phrase: 'places to sit and rest along the way', yesNo: ['2.3-D-13', '3.1-D-5'] },
    ],
  },
  {
    id: 'toilets',
    title: 'Toilets',
    lead: 'For amenities',
    features: [
      { label: 'Accessible toilet', phrase: 'an accessible toilet', yesNo: ['3.2-1-1'] },
      { label: 'Ambulant accessible toilet', phrase: 'an ambulant accessible toilet with support rails', yesNo: ['3.2-D-3'] },
      { label: 'Grab rails beside the toilet', phrase: 'grab rails beside the toilet', yesNo: ['3.2-D-8'] },
      { label: 'Space to transfer beside the toilet', phrase: 'space to transfer alongside the toilet', yesNo: ['3.2-D-9'] },
    ],
  },
  {
    id: 'seating',
    title: 'Seating and viewing',
    lead: 'For seating and views',
    features: [
      { label: 'Wheelchair spaces', phrase: 'dedicated wheelchair spaces in the audience', yesNo: ['3.8-D-3'], options: [{ questionId: '3.1-D-4', anyOf: ['wca'] }] },
      { label: 'Companion seat beside wheelchair spaces', phrase: 'companion seating right beside the wheelchair spaces', yesNo: ['3.8-D-5'], options: [{ questionId: '3.1-D-4', anyOf: ['companion'] }] },
      { label: 'Easy-access and aisle seating', phrase: 'easy-access seats on the aisle with extra legroom', yesNo: ['3.8-D-4'], options: [{ questionId: '3.1-D-4', anyOf: ['eaa', 'eas'] }] },
      { label: 'Wider seats for larger bodies', phrase: 'wider seats for extra comfort', options: [{ questionId: '3.1-D-4', anyOf: ['extra-width'] }] },
      { label: 'A variety of seating options', phrase: 'a choice of seating, with and without armrests', yesNo: ['3.1-1-1'] },
      { label: 'Clear sightlines from accessible seats', phrase: 'clear sightlines to the stage from the accessible seats', yesNo: ['3.1-D-12', '3.8-D-6'] },
      { label: 'Accessible seating as easy to book as standard', phrase: 'accessible seats you can book as easily as any other', yesNo: ['3.1-D-13'] },
    ],
  },
  {
    id: 'sensory',
    title: 'Sensory environment',
    lead: 'For sensory comfort',
    features: [
      { label: 'Comfortable lighting for navigation', phrase: 'comfortable, even lighting to move around by', yesNo: ['3.3-1-1'] },
      { label: 'Adjustable or dimmable lighting', phrase: 'lighting that can be dimmed or adjusted', yesNo: ['3.3-D-1'] },
      { label: 'Quiet or sensory-break space', phrase: 'a quiet space set aside for a sensory break', yesNo: ['3.3-1-2'] },
      { label: 'Relaxed or sensory-friendly sessions', phrase: 'relaxed and sensory-friendly performances', yesNo: ['3.3-1-7'] },
      { label: 'Background noise kept manageable', phrase: 'background noise kept to a comfortable level', yesNo: ['3.3-1-3'] },
    ],
  },
  {
    id: 'hearing-comms',
    title: 'Hearing and communication access',
    lead: 'For hearing and communication',
    features: [
      { label: 'Hearing loop or assistive listening', phrase: 'a hearing loop and assistive listening', options: [{ questionId: '3.8-D-25', anyOf: ['yes-fixed', 'yes-portable'] }, { questionId: '3.3-D-7', anyOf: ['hearing-loops', 'assistive-listening'] }], yesOption: ['3.3-1-8'] },
      { label: 'Captioned performances', phrase: 'captioning for performances', yesOption: ['3.8-D-23'], yesNo: ['3.7-PC-7'] },
      { label: 'Auslan interpretation available', phrase: 'Auslan interpreted performances', yesOption: ['3.8-D-11', '4.2-D-18b'] },
      { label: 'Audio description available', phrase: 'audio description for visual moments', yesOption: ['3.8-D-22'] },
    ],
  },
  {
    id: 'service',
    title: 'Service and support',
    lead: 'For service and support',
    features: [
      { label: 'Staff disability-awareness training', phrase: 'staff trained in disability awareness', yesNo: ['4.2-F-1', '5.3-F-1'] },
      { label: 'Assistance animals welcome', phrase: 'a warm welcome for assistance animals', yesNo: ['4.2-F-2', '5.1-F-6'] },
      { label: 'Companion Card accepted', phrase: 'the Companion Card for a support person', yesNo: ['4.3-D-3', '5.1-F-4'] },
      { label: 'Priority access when needed', phrase: 'priority entry ahead of the crowd', yesNo: ['2.4-1-2'] },
      { label: 'Access needs captured at booking', phrase: 'the chance to share your access needs when booking', yesNo: ['1.3-PC-2', '4.3-D-2'] },
      { label: 'Accessible online booking', phrase: 'an accessible online booking process', yesNo: ['4.3-D-1'] },
      { label: 'Assistive equipment to borrow', phrase: 'assistive equipment to borrow', options: [{ questionId: '3.4-F-1', anyOf: ['yes-multiple', 'yes-limited'] }] },
      { label: 'Alternatives to phone contact', phrase: 'ways to reach us beyond the phone', yesNo: ['4.1-PC-1'] },
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
