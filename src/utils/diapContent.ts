/**
 * DIAP action-step and success-indicator content.
 *
 * Topic content is selected by the question's MODULE domain first, then by a
 * keyword match within that domain. Keying to the module stops digital and
 * physical questions from borrowing each other's guidance (e.g. "keyboard
 * navigation" no longer matches physical signage) and every domain has a
 * tailored default so questions that match no sub-topic still get relevant
 * steps instead of bland boilerplate.
 */

export type Domain =
  | 'physical'
  | 'sensory'
  | 'digital'
  | 'communication'
  | 'service'
  | 'policy'
  | 'experience';

const ALL_DOMAINS: Domain[] = ['physical', 'sensory', 'digital', 'communication', 'service', 'policy', 'experience'];

export interface DiapTopic {
  key: string;
  domains: Domain[];
  pattern: RegExp;
  steps: [string, string];
  indicators: string[];
}

// Ordered most-specific first. Selection is scoped to the module's domains, so
// a topic is only considered when its domain overlaps the module's domain.
const TOPICS: DiapTopic[] = [
  { key: 'doors', domains: ['physical'], pattern: /\bdoors?\b|\bentry\b|\bentrance|\bclearance|\blatch/i,
    steps: [
      'Measure current door clearances and hardware against AS 1428.1 requirements and document gaps',
      'Schedule a review of entry points after any renovation or layout change',
    ],
    indicators: [
      '• Aim for all primary entry points to meet accessible door clearance requirements (per AS 1428.1) within 12 months',
      '• Door hardware and clearance checked quarterly and after any renovation',
      '• All customer-facing staff can direct visitors to accessible entries',
    ] },
  { key: 'parking', domains: ['physical'], pattern: /\bparking\b|\bdrop.?off|\bpick.?up/i,
    steps: [
      'Audit accessible parking bays for correct dimensions, signage and proximity to entrance',
      'Add a weekly check of accessible parking and drop-off zones to your maintenance schedule',
    ],
    indicators: [
      '• Accessible parking spaces checked weekly for obstructions and kept clear',
      '• Drop-off zone clear and usable during operating hours',
      '• Accessible parking signage visible and in good condition, reviewed annually',
    ] },
  { key: 'paths', domains: ['physical'], pattern: /\bpaths?\b|\baisle|\bcorridor|\bcirculation|\bmanoeuvr/i,
    steps: [
      'Measure primary circulation paths and identify any pinch points below 1000mm width',
      'Establish a process for staff to report and clear path obstructions promptly',
    ],
    indicators: [
      '• Aim for primary internal paths to meet 1000mm minimum width (1200mm preferred) within 12 months',
      '• Floor surfaces assessed for slip hazards quarterly',
      '• Staff process in place to report and clear path obstructions within 1 hour',
    ] },
  { key: 'ramps', domains: ['physical'], pattern: /\bramps?\b|\bstairs?\b|\bgradient\b|\bstep-free\b|\bnosing\b|\bhandrail|\blevel change|\bkerb\b|\bthreshold/i,
    steps: [
      'Assess ramp gradients and handrail condition against AS 1428.1 requirements',
      'Install or improve signage directing visitors to alternative level access routes',
    ],
    indicators: [
      '• All primary access ramps to meet AS 1428.1 gradient requirements within 12 months; secondary ramps within 24 months',
      '• Non-slip strips and handrails inspected quarterly',
      '• Alternative level access route signed at all stepped entries within 6 months',
    ] },
  { key: 'signage', domains: ['physical'], pattern: /\bsign(?:s|age)?\b|\bwayfind|\bnavigat/i,
    steps: [
      'Audit existing signage for contrast, font size and mounting height compliance',
      'Prioritise upgrades at key decision points (entrances, intersections, lifts, toilets)',
    ],
    indicators: [
      '• Signage audit completed within 3 months; priority signs upgraded to high-contrast (min 70% luminance contrast) within 12 months',
      '• All new signage meets standard: sans-serif, appropriate height, high contrast',
      '• Signage reviewed annually and after any layout changes',
    ] },
  { key: 'braille', domains: ['physical'], pattern: /\bbraille|\btactile/i,
    steps: [
      'Identify priority rooms for tactile and Braille signage (toilets, lifts, reception, exits)',
      'Add tactile signage condition to your annual maintenance check',
    ],
    indicators: [
      '• Tactile/Braille signage installed on priority rooms (toilets, lifts, reception) within 12 months',
      '• Tactile signage condition checked annually and replaced when damaged',
    ] },
  { key: 'lighting', domains: ['physical', 'sensory'], pattern: /\blights?\b|\blighting\b|\bglare\b|\bbright/i,
    steps: [
      'Assess lighting levels and glare in all public areas, noting problem spots',
      'Prioritise fixes in high-traffic areas and review after any fit-out changes',
    ],
    indicators: [
      '• Lighting assessment completed in all public areas within 3 months',
      '• Priority glare and dim-area issues resolved within 6 months',
      '• Lighting reviewed after any fit-out changes and annually',
    ] },
  { key: 'noise', domains: ['physical', 'sensory'], pattern: /\bnoise\b|\bsound\b|\bacoustic|\bloud\b/i,
    steps: [
      'Measure or estimate noise levels in main service areas during peak times',
      'Identify practical solutions for problem areas (soft furnishings, screens, quiet zones)',
    ],
    indicators: [
      '• Noise levels assessed in main service areas within 3 months; solutions implemented for problem areas within 12 months',
      '• If hearing loop installed, tested monthly and confirmed operational',
      '• Quiet hours or quiet zones offered where suitable for the business type',
    ] },
  { key: 'sensory', domains: ['sensory'], pattern: /\bsensory\b|\bquiet\b|\bcalm\b/i,
    steps: [
      'Identify a suitable space that can serve as a quiet or sensory-friendly area',
      'Create a sensory guide describing the environment (noise, lighting, crowds) at different times',
    ],
    indicators: [
      '• At least 1 quiet/sensory-friendly space identified and available during operating hours within 6 months',
      '• Sensory guide or map created and published within 6 months, updated annually',
      '• Staff briefed on sensory-friendly options within 1 month of implementation',
    ] },
  { key: 'website', domains: ['digital'], pattern: /\bwebsite\b|\bweb page|\bdigital\b|\bonline\b/i,
    steps: [
      'Run an initial accessibility scan (e.g. WAVE or axe) on your key pages and note critical issues',
      'Prioritise fixing navigation, forms and content structure issues first',
    ],
    indicators: [
      '• Initial accessibility scan completed (e.g. WAVE or axe) and critical issues fixed within 3 months',
      '• Aim for WCAG 2.2 AA compliance on key pages within 12 months',
      '• Critical accessibility issues (navigation, forms, checkout) resolved within 30 days of discovery',
    ] },
  { key: 'screenreader', domains: ['digital'], pattern: /\bscreen reader|\bassistive\b|\bkeyboard\b/i,
    steps: [
      'Test key user journeys (homepage, booking, contact) using keyboard-only navigation',
      'Log any issues found and prioritise fixes by customer impact',
    ],
    indicators: [
      '• Key user journeys (homepage, booking, contact) keyboard-accessible within 6 months',
      '• Screen reader testing completed on primary pages within 6 months, then annually',
      '• Accessibility issues logged and critical items resolved within 30 days',
    ] },
  { key: 'contrast', domains: ['digital'], pattern: /\bcontrast\b|\bcolou?rs?\b/i,
    steps: [
      'Check text contrast ratios on key pages using a free tool like WebAIM Contrast Checker',
      'Ensure colour is never the only way information is communicated (add labels or patterns)',
    ],
    indicators: [
      '• All text on key pages meets 4.5:1 contrast ratio within 3 months',
      '• Colour is not the sole method of conveying information on any page',
      '• Contrast check included in content publishing process',
    ] },
  { key: 'forms', domains: ['digital'], pattern: /\bforms?\b|\binput\b|\bfields?\b|\bcheckout\b/i,
    steps: [
      'Review all customer-facing forms for visible labels, clear error messages and logical tab order',
      'Test form completion using keyboard only and fix any barriers found',
    ],
    indicators: [
      '• All customer-facing forms have visible labels and clear error messages within 3 months',
      '• All forms completable via keyboard only, confirmed by testing within 6 months',
      '• Form accessibility issues tracked and reduced by 50% within 12 months',
    ] },
  { key: 'mobile', domains: ['digital'], pattern: /\bmobile\b|\bresponsive\b|\bphone\b.*\bapp\b/i,
    steps: [
      'Test your website on common iOS and Android devices, noting any layout or interaction issues',
      'Check that touch targets are large enough (aim for 44x44px on key interactions)',
    ],
    indicators: [
      '• Website tested on iOS and Android devices; critical mobile issues fixed within 3 months',
      '• Touch targets meet 24x24px minimum (WCAG 2.2 AA), aim for 44x44px on key interactions',
      '• Mobile experience checked when making website updates',
    ] },
  { key: 'social', domains: ['digital', 'communication'], pattern: /\bsocial media|\bvideo\b|\bcaption|\bsubtitle/i,
    steps: [
      'Establish a process to add captions to all new videos before or within 48 hours of publishing',
      'Prioritise captioning your most-viewed existing videos first',
    ],
    indicators: [
      '• All new videos include captions before or within 48 hours of publishing',
      '• Alt text included on all new social media images from [start date]',
      '• Top 10 existing videos captioned within 6 months',
    ] },
  { key: 'audio', domains: ['digital', 'communication'], pattern: /\baudio\b|\bpodcast|\btranscript/i,
    steps: [
      'Set up a workflow to produce transcripts for all new audio content within one week',
      'Identify your most-accessed existing audio items and prioritise transcribing those',
    ],
    indicators: [
      '• All new audio content has a transcript published within 1 week',
      '• Top 5 most-accessed existing audio items transcribed within 6 months',
    ] },
  { key: 'alt-text', domains: ['digital'], pattern: /\balt text|\bimage desc|\bphoto\b.*\baccess/i,
    steps: [
      'Add descriptive alt text to images on your most-visited pages first',
      'Create a simple alt text guide for your team covering dos, don\'ts and examples',
    ],
    indicators: [
      '• All new images include descriptive alt text from [start date]',
      '• Alt text added to top 20 most-viewed existing pages within 3 months',
      '• Team provided with alt text guidelines and checklist',
    ] },
  { key: 'marketing', domains: ['communication'], pattern: /\bmarketing\b|\brepresentation\b|\binclusive\b.*\bimage|\bdiverse\b/i,
    steps: [
      'Review your current marketing imagery for diversity and disability representation',
      'Source or commission inclusive imagery for your next campaign or content refresh',
    ],
    indicators: [
      '• Aim for at least 1 in 5 marketing images to feature diverse representation including disability within 12 months',
      '• Inclusive imagery sourced or commissioned within 6 months',
      '• Representation reviewed as part of each campaign planning process',
    ] },
  { key: 'plain-language', domains: ['communication', 'digital'], pattern: /\bplain language|\beasy read|\breadab|\bjargon\b/i,
    steps: [
      'Review your top customer-facing documents against a Year 8 reading level target',
      'Add a plain language check step to your content publishing process',
    ],
    indicators: [
      '• Top 5 customer-facing documents reviewed and simplified to Year 8 reading level within 6 months',
      '• At least 1 key document (e.g. welcome guide) available in Easy Read within 12 months',
      '• Plain language check included in process for new content',
    ] },
  { key: 'bookings', domains: ['service', 'digital'], pattern: /\bbookings?\b|\bticket|\breserv/i,
    steps: [
      'Test your booking process for accessibility barriers (keyboard, screen reader, mobile)',
      'Ensure at least one alternative booking method is available (e.g. phone or email)',
    ],
    indicators: [
      '• Booking process accessibility tested and critical barriers fixed within 3 months',
      '• Companion/carer ticketing policy published and all booking staff briefed within 3 months',
      '• At least 1 alternative booking method available (e.g. phone or email)',
    ] },
  { key: 'seating', domains: ['physical'], pattern: /\bseat|\bchair\b|\bbench\b|\bfurniture\b|\btables?\b|\bcounters?\b/i,
    steps: [
      'Audit seating and counter options for wheelchair accessibility and height variety',
      'Check furniture arrangements maintain at least 1000mm clear circulation paths',
    ],
    indicators: [
      '• At least 1 wheelchair-accessible option available at each seating/counter type within 6 months',
      '• At least 1 lowered counter or service point available within 6 months',
      '• Furniture arrangement checked monthly to maintain minimum 1000mm clear circulation paths',
    ] },
  { key: 'toilet', domains: ['physical'], pattern: /\btoilet|\bbathroom|\bamenit|\bwashroom|\brestroom/i,
    steps: [
      'Verify accessible toilet features: grab rails, emergency cord to floor, clear signage',
      'Add accessible toilet checks to your daily cleaning and maintenance routine',
    ],
    indicators: [
      '• Accessible toilet included in daily cleaning checklist with access kept clear',
      '• Emergency cord verified to reach floor level, checked monthly',
      '• Grab rails, signage and fittings inspected quarterly',
    ] },
  { key: 'changing-places', domains: ['physical'], pattern: /\bchanging places|\badult change|\bhoist\b/i,
    steps: [
      'Confirm whether a Changing Places facility exists on site and its condition or identify the nearest one',
      'If a facility exists, register it on the National map and set a servicing schedule',
    ],
    indicators: [
      '• If Changing Places facility exists: registered on National map, checked daily, equipment serviced every 6 months',
      '• If not available: nearest Changing Places facility identified and information provided to visitors who enquire',
    ] },
  { key: 'equipment', domains: ['physical', 'service'], pattern: /\bequipment\b|\bresources?\b|\bassistive\b.*\bdevice|\bwheelchair\b.*\bloan|\bmobility\b.*\baid/i,
    steps: [
      'List all available assistive equipment and publish it on your website and at reception',
      'Set up a monthly equipment check for condition and functionality',
    ],
    indicators: [
      '• Available assistive equipment listed on website and at reception within 3 months',
      '• All equipment checked monthly for condition and functionality',
      '• Customer-facing staff briefed on equipment availability and use within 3 months',
    ] },
  { key: 'menus', domains: ['communication'], pattern: /\bmenus?\b|\bprinted\b|\bbrochure|\bpamphlet|\bflyer/i,
    steps: [
      'Identify your top 3 customer-facing printed materials and create large print or digital versions',
      'Set up a process to update accessible formats within 2 weeks of content changes',
    ],
    indicators: [
      '• Top 3 key printed materials available in large print and/or digital format within 6 months',
      '• Accessible formats updated within 2 weeks of content changes',
      '• Customers informed that accessible formats are available',
    ] },
  { key: 'staff-train', domains: ['service'], pattern: /\bstaff\b.*\btrain|\btrain\b.*\bstaff|\bawareness\b|\bdisability\b.*\bconfident|\bcustomer\b.*\bservice/i,
    steps: [
      'Schedule disability awareness training for all customer-facing staff within 3 months',
      'Plan annual refresher sessions and incorporate accessibility into regular team discussions',
    ],
    indicators: [
      '• All customer-facing staff complete disability awareness training within 3 months of starting',
      '• Annual refresher training or team discussion completed each year',
      '• Customer feedback on staff interactions reviewed at least every 6 months',
    ] },
  { key: 'auslan', domains: ['service', 'communication'], pattern: /\bauslan\b|\bsign language|\bdeaf\b|\bhearing\b/i,
    steps: [
      'Establish a process to arrange Auslan interpreting on request with 48 hours notice',
      'Make National Relay Service (NRS) details available to staff and promoted to customers',
    ],
    indicators: [
      '• Process established to arrange Auslan interpreter on request within 48 hours notice',
      '• National Relay Service (NRS) details available to staff and promoted to customers within 3 months',
      '• Team learns basic Auslan greetings (hello, thank you, help) within 6 months',
      '• Hearing loop or captioning available for group presentations where feasible',
    ] },
  { key: 'emergency', domains: ['physical', 'service'], pattern: /\bemergency\b|\bevacuat|\bsafety\b|\bfire\b|\balarm\b/i,
    steps: [
      'Review your evacuation plan to include at least one disability-specific scenario',
      'Check that alarms have both visual and audible alerts in all public areas',
    ],
    indicators: [
      '• Personal Emergency Evacuation Plans (PEEPs) offered to all visitors who identify a need',
      '• Evacuation drill includes at least 1 accessibility scenario annually',
      '• Visual and audible alarms reviewed within 6 months; upgrades planned where gaps are found',
    ] },
  { key: 'feedback', domains: ['service'], pattern: /\bfeedback\b|\breview\b|\bcomplaint|\bsurvey\b/i,
    steps: [
      'Ensure feedback is available in at least 2 formats (e.g. online, verbal, paper)',
      'Set up a 6-monthly review of accessibility-related feedback trends',
    ],
    indicators: [
      '• Feedback available in at least 2 formats (e.g. online, verbal, paper)',
      '• Accessibility-related feedback reviewed and responded to within 5 business days',
      '• Feedback trends reviewed every 6 months to identify common issues',
    ] },
  { key: 'contact', domains: ['communication', 'service'], pattern: /\bcontact\b|\bphone\b|\bemail\b|\bchat\b|\bcommunication channel/i,
    steps: [
      'Verify that at least 2 accessible contact channels are available and clearly promoted',
      'Set a response time target for accessibility enquiries (e.g. 1 business day)',
    ],
    indicators: [
      '• At least 2 accessible contact channels available (e.g. phone and email)',
      '• Enquiries responded to within 1 business day during business hours',
      '• Contact options clearly promoted on website and at venue',
    ] },
  { key: 'policy', domains: ['policy'], pattern: /\bpolicy\b|\bprocedure\b|\bgovernance\b|\bcompliance\b/i,
    steps: [
      'Draft or update your accessibility policy and share it with all staff',
      'Schedule annual policy reviews and quarterly accessibility discussions in team meetings',
    ],
    indicators: [
      '• Accessibility policy published and communicated to all staff within 6 months',
      '• Policy reviewed annually and updated within 30 days of relevant regulatory changes',
      '• Accessibility discussed in team or leadership meetings at least quarterly',
    ] },
  { key: 'employ', domains: ['policy'], pattern: /\bemploy|\brecruit|\bhiring\b|\bworkplace\b|\bjob\b|\bpositions?\b/i,
    steps: [
      'Add an accessibility and adjustment statement to all job advertisements',
      'Proactively offer interview adjustment options to all candidates',
    ],
    indicators: [
      '• All job advertisements include accessibility and adjustment statement from [start date]',
      '• Interview adjustment options offered proactively to all candidates',
      '• Workplace adjustment requests responded to within 5 business days',
    ] },
  { key: 'procure', domains: ['policy'], pattern: /\bprocure|\bsupplier|\bvendor\b|\bcontract\b/i,
    steps: [
      'Add accessibility criteria to your procurement checklist for new suppliers',
      'Review your top existing suppliers for accessibility and note any gaps',
    ],
    indicators: [
      '• Accessibility criteria included in procurement checklist for all new suppliers from [start date]',
      '• Top 5 existing suppliers reviewed for accessibility within 12 months',
      '• Supplier accessibility practices discussed at annual review',
    ] },
  { key: 'improve', domains: ['policy'], pattern: /\bimprov|\bprogress\b|\breports?\b|\bmeasur|\baudits?\b/i,
    steps: [
      'Set a schedule to report accessibility progress to leadership at least every 6 months',
      'Track at least one accessibility improvement per quarter and document it',
    ],
    indicators: [
      '• Accessibility progress reported to leadership at least every 6 months',
      '• At least 1 accessibility improvement completed per quarter',
      '• Annual accessibility summary documented and shared with team',
    ] },
  { key: 'programs', domains: ['experience'], pattern: /\bprograms?\b|\bactivit|\bexperience\b|\bevents?\b|\bparticipat/i,
    steps: [
      'Review your core programs or activities for accessibility barriers',
      'Develop at least one adapted option for each core experience within 12 months',
    ],
    indicators: [
      '• All core programs/activities reviewed for accessibility barriers within 12 months',
      '• At least 1 adapted option available for each core experience within 12 months',
      '• Feedback sought from participants with disability at least annually',
    ] },
  { key: 'accommod', domains: ['experience', 'physical'], pattern: /\baccommod|\brooms?\b|\bhotel\b|\bstay\b|\bguest\b/i,
    steps: [
      'Verify accessible room features as part of your standard pre-arrival check process',
      'Review and update accessibility information on your booking platform every 6 months',
    ],
    indicators: [
      '• Accessible room features verified before each guest arrival as part of standard check-in process',
      '• Accessibility information on booking platform reviewed and updated every 6 months',
      '• Guest accessibility feedback reviewed quarterly and used to guide improvements',
    ] },
  { key: 'retail', domains: ['experience'], pattern: /\bretail\b|\bshops?\b|\bshopping\b|\bpurchas|\bbrowse\b|\bproduct\b/i,
    steps: [
      'Ensure at least one accessible checkout option is available',
      'Review product information accessibility for your key product lines',
    ],
    indicators: [
      '• At least 1 accessible checkout option available within 6 months',
      '• Product information available in accessible format for key product lines within 12 months',
      '• Staff briefed to proactively offer assistance; approach reviewed every 6 months',
    ] },
  { key: 'maps', domains: ['communication', 'physical'], pattern: /\bmaps?\b|\bdirector(?:y|ies)\b|\blayout\b.*\bguide/i,
    steps: [
      'Create an accessible map or directory in both print and digital formats',
      'Include accessible routes, toilets, lifts and quiet spaces on the map',
    ],
    indicators: [
      '• Accessible map or directory available in print and digital format within 6 months',
      '• Map updated within 2 weeks of any layout change',
      '• Map includes accessible routes, toilets, lifts and quiet spaces',
    ] },
  { key: 'queue', domains: ['physical', 'service'], pattern: /\bqueue|\bwaiting\b|\bwait\b|\bbusy\b/i,
    steps: [
      'Set up a way to communicate wait times to customers (signage or staff)',
      'Ensure seating is available in main queue areas and priority access is offered where needed',
    ],
    indicators: [
      '• Wait times communicated to customers via signage or staff within 3 months',
      '• Seating available in main queue areas within 3 months',
      '• Priority or alternative access available for customers who need it',
    ] },
  { key: 'pre-visit', domains: ['communication'], pattern: /\bpre.?visit\b|\bbefore\b.*\bvisit|\binformation\b.*\bavailab|\baccess.*\binformation\b/i,
    steps: [
      'Publish accessibility information on your primary customer-facing channel',
      'Set a 6-monthly review to keep the information accurate and up to date',
    ],
    indicators: [
      '• Accessibility information published on primary customer-facing channel within 3 months',
      '• Information covers physical access, sensory environment and available supports',
      '• Information reviewed for accuracy every 6 months and after any venue changes',
    ] },
];

// Domain-appropriate default, used when no sub-topic matches within the
// module's domain. Replaces the old one-size-fits-all generic fallback.
const DOMAIN_DEFAULT: Record<Domain, { steps: [string, string]; indicators: string[] }> = {
  physical: {
    steps: [
      'Identify the specific physical barriers in this area and note their location and severity',
      'Prioritise fixes by impact and feasibility and flag major works for future capital budgets',
    ],
    indicators: [
      '• Priority physical barriers in this area addressed or scheduled within 12 months',
      '• Interim measures put in place where permanent works need budget or planning',
      '• Area reviewed for accessibility after any layout or fit-out change',
    ],
  },
  sensory: {
    steps: [
      'Assess the sensory environment (noise, lighting, crowding) at different times of day',
      'Identify practical adjustments and quieter options for people who need them',
    ],
    indicators: [
      '• Sensory environment assessed and problem areas identified within 6 months',
      '• At least one lower-sensory option or time offered where practical',
      '• Staff briefed on sensory-friendly options within 3 months',
    ],
  },
  digital: {
    steps: [
      'Run an accessibility check on the relevant pages or content and log the issues found',
      'Prioritise fixes by customer impact, starting with key user journeys',
    ],
    indicators: [
      '• Critical digital accessibility issues identified and fixed within 3 months',
      '• Aim for WCAG 2.2 AA on key pages within 12 months',
      '• Accessibility check built into the content publishing process',
    ],
  },
  communication: {
    steps: [
      'Review this information for plain language, clarity and available formats',
      'Make it available in at least one accessible alternative format',
    ],
    indicators: [
      '• Key information reviewed for plain language and clarity within 6 months',
      '• At least one accessible format available on request',
      '• Information reviewed for accuracy at least annually',
    ],
  },
  service: {
    steps: [
      'Review how this is handled day to day and where customers with disability may face barriers',
      'Brief customer-facing staff on the accessible options available',
    ],
    indicators: [
      '• Accessible options in place and staff briefed within 3 months',
      '• Customer feedback on this reviewed at least every 6 months',
      '• Approach reviewed annually and improved where gaps are found',
    ],
  },
  policy: {
    steps: [
      'Document the current approach and identify gaps against good practice',
      'Assign an owner and a review cycle to keep it current',
    ],
    indicators: [
      '• Approach documented and communicated to staff within 6 months',
      '• Reviewed at least annually and after relevant regulatory changes',
      '• Progress reported to leadership at least every 6 months',
    ],
  },
  experience: {
    steps: [
      'Review this experience for accessibility barriers across the full journey',
      'Develop at least one adapted or supported option and promote it clearly',
    ],
    indicators: [
      '• Core experiences reviewed for barriers within 12 months',
      '• At least one adapted option available and promoted',
      '• Feedback sought from participants with disability at least annually',
    ],
  },
};

// Module code -> the domain(s) its questions belong to, most relevant first.
const MODULE_DOMAINS: Record<string, Domain[]> = {
  '1.1': ['communication'],
  '1.2': ['digital'],
  '1.3': ['digital', 'service'],
  '1.4': ['digital', 'communication'],
  '1.5': ['communication'],
  '1.6': ['communication'],
  '2.1': ['physical'],
  '2.2': ['physical'],
  '2.3': ['physical'],
  '2.4': ['physical', 'service'],
  '3.1': ['physical'],
  '3.2': ['physical'],
  '3.3': ['sensory', 'physical'],
  '3.4': ['physical', 'service'],
  '3.5': ['physical'],
  '3.6': ['communication'],
  '3.7': ['communication'],
  '3.8': ['experience', 'physical'],
  '3.9': ['experience', 'physical'],
  '3.10': ['experience'],
  '3.11': ['physical'],
  '3.12': ['physical', 'experience'],
  '4.1': ['communication', 'service'],
  '4.2': ['service'],
  '4.3': ['service', 'digital'],
  '4.4': ['service', 'physical'],
  '4.5': ['service'],
  '4.6': ['communication', 'service'],
  '4.7': ['communication', 'service'],
  '5.1': ['policy'],
  '5.3': ['service', 'policy'],
  '5.4': ['policy'],
  '5.5': ['policy'],
  '5.6': ['policy'],
  '5.7': ['policy'],
  '5.8': ['policy'],
  '5.9': ['policy'],
  '5.10': ['policy'],
  '6.1': ['experience', 'communication'],
  '6.2': ['physical'],
  '6.3': ['communication'],
  '6.4': ['sensory'],
  '6.5': ['service', 'experience'],
  '7.1': ['physical', 'policy'],
  '7.2': ['experience', 'policy'],
  '7.3': ['service', 'digital'],
  '7.4': ['experience', 'service'],
  '7.5': ['service', 'policy'],
  '7.6': ['experience', 'sensory', 'physical'],
};

function domainsForModule(rawCode: string | undefined): Domain[] {
  const code = String(rawCode || '').trim().split('-')[0].trim();
  return MODULE_DOMAINS[code] || ALL_DOMAINS;
}

// Pick the in-domain topic whose keyword appears earliest in the question. A
// question like "adequate lighting throughout circulation paths" names its
// subject first, so leftmost-match chooses lighting over paths where plain
// list order would wrongly pick paths. Ties keep the earlier (more specific)
// TOPICS entry.
function matchTopic(moduleCode: string | undefined, questionText: string): DiapTopic | null {
  const domains = domainsForModule(moduleCode);
  const lower = (questionText || '').toLowerCase();
  let best: DiapTopic | null = null;
  let bestPos = Infinity;
  for (const t of TOPICS) {
    if (!t.domains.some(d => domains.includes(d))) continue;
    const pos = lower.search(t.pattern);
    if (pos >= 0 && pos < bestPos) {
      bestPos = pos;
      best = t;
    }
  }
  return best;
}

/**
 * Select the action steps and success indicators for a question, scoped to its
 * module's domain so unrelated topics can never be matched.
 */
export function selectDiapContent(moduleCode: string | undefined, questionText: string): { steps: [string, string]; indicators: string[] } {
  const t = matchTopic(moduleCode, questionText);
  if (t) return { steps: t.steps, indicators: t.indicators };
  const domains = domainsForModule(moduleCode);
  return DOMAIN_DEFAULT[domains[0]] || DOMAIN_DEFAULT.service;
}

// Returns the matched topic key (or `default:<domain>`). For auditing/tests.
export function selectDiapTopicKey(moduleCode: string | undefined, questionText: string): string {
  const t = matchTopic(moduleCode, questionText);
  if (t) return t.key;
  return `default:${domainsForModule(moduleCode)[0]}`;
}
