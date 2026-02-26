/**
 * Help Content: During Visit (Consolidated)
 * Modules: 3.1, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10
 * 40 entries covering all substantive questions using coveredQuestionIds pattern.
 */

import type { HelpContent } from './types';

export const duringVisitHelp: HelpContent[] = [

// ─── Entry 1: Seating variety and wheelchair spaces ───
{
  questionId: '3.1-1-1',
  questionText: 'Is there a variety of seating options available for customers and visitors?',
  moduleCode: '3.1',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Seating variety and wheelchair spaces',
  coveredQuestionIds: ['3.1-1-2', '3.1-D-1', '3.1-D-4', '3.1-D-5', '3.1-D-12', '3.1-D-13', '3.1-D-14'],
  summary: 'Providing diverse seating options, designated wheelchair spaces with companion seating, and accessible seating during events and peak periods ensures every visitor can participate comfortably regardless of mobility, size, or pain needs.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Seating is not a one-size-fits-all proposition. People who use wheelchairs need clear floor space to pull up to a table or event row. People with chronic pain need seats with firm back support. People of larger body size need chairs without fixed armrests. Companion seating next to wheelchair spaces ensures people with disability can sit with family and friends rather than being isolated. During events and peak periods, accessible seating is often the first to be removed or repurposed, leaving wheelchair users with nowhere to go.',
    statistic: {
      value: '2.1 million',
      context: 'Australians use mobility aids including wheelchairs, scooters, and walking frames. All need seating that works for them.',
      source: 'ABS Survey of Disability, Ageing and Carers 2018'
    },
    quote: {
      text: 'I went to a concert and my wheelchair spot was right at the back, away from everyone. My friends were in the front row. I felt like an afterthought.',
      attribution: 'Wheelchair user, Live Performance Australia feedback'
    }
  },

  tips: [
    {
      icon: 'Accessibility',
      text: 'Provide at least one wheelchair space for every 100 seats, with a minimum of one.',
      detail: 'Each wheelchair space should be 800mm wide by 1300mm deep on a level surface. Position them at various locations throughout the venue, not grouped in one area. This gives wheelchair users the same choice of view and experience as everyone else.',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Place a companion seat immediately adjacent to every wheelchair space.',
      detail: 'Companion seats must be at the same level as the wheelchair space so conversation is natural. Fixed companion seats should not have a fixed armrest on the wheelchair-adjacent side. Remove or fold the armrest to allow physical proximity.',
      priority: 2
    },
    {
      icon: 'Armchair',
      text: 'Offer seats of varied types: standard, wide (EAS/extra-width), chairs with arms, and seats with back support.',
      detail: 'Wide Companion Area (WCA) seating is 600mm wide. Enhanced Amenity Seating (EAS) provides additional width and legroom. Extra-width seating accommodates people of larger body size. Having a mix available means fewer people need to ask for special treatment.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Ensure accessible seating has equivalent sightlines to standard seating.',
      detail: 'Wheelchair users seated behind standing spectators cannot see the stage or screen. Place accessible seating where sightlines are maintained even when the audience stands. Raised platforms or front-row positions work well.',
      priority: 4
    },
    {
      icon: 'CalendarCheck',
      text: 'Protect accessible seating during events and peak periods.',
      detail: 'Create a procedure that prevents accessible seating areas from being converted to standing room, storage, or additional standard seating during busy times. Brief event setup crews specifically about this.',
      priority: 5
    },
    {
      icon: 'ClipboardList',
      text: 'Mark accessible seating on floor plans and booking systems.',
      detail: 'Online booking platforms should clearly indicate accessible seating locations and allow customers to select them. Include photos showing the view from accessible seats so customers know what to expect.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing seating variety and wheelchair spaces',
    steps: [
      {
        text: 'Count the total number of seats and the number of designated wheelchair spaces.',
        measurement: { target: 'Wheelchair spaces', acceptable: 'Minimum 1 per 100 seats (at least 1)', unit: 'spaces' }
      },
      {
        text: 'Measure each wheelchair space for clear floor area.',
        measurement: { target: 'Wheelchair space size', acceptable: '800mm wide x 1300mm deep minimum', unit: 'mm' }
      },
      {
        text: 'Check that each wheelchair space has a companion seat immediately adjacent, at the same level, without a fixed armrest blocking proximity.',
        measurement: { target: 'Companion seat gap', acceptable: 'Adjacent with no barrier, same floor level', unit: 'mm' }
      },
      { text: 'Sit in a wheelchair or low seat at each accessible position and check whether the stage, screen, or main attraction is visible when other audience members are standing.' },
      { text: 'Catalogue the range of seat types available: standard, wide/EAS/extra-width (minimum 600mm), armrest chairs, firm-back chairs, and seats with removable armrests.' },
      { text: 'Check your booking system or reservation process. Can customers select or request accessible seating online without needing to phone?' },
      { text: 'Simulate an event or peak scenario. Set up as you would for a busy period and confirm that accessible seating has not been displaced by extra chairs, equipment, or standing room.' },
      { text: 'Review your event setup procedures or run sheets. Is there a specific step requiring staff to verify accessible seating is in place and unobstructed?' },
      { text: 'Check the floor surface at each wheelchair space. It must be level (maximum 1:40 gradient) and firm.' }
    ],
    tools: ['Tape measure (5m)', 'Wheelchair or low stool for sightline testing', 'Camera for documentation', 'Floor plan or seating chart'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'Access-to-Premises',
      section: 'Part D3.8',
      requirement: 'Wheelchair seating spaces must be provided in assembly buildings in accordance with Table D3.8. Spaces must have clear dimensions, be on an accessible path of travel, and have companion seating.'
    },
    related: [
      { code: 'AS1428.1', relevance: 'Section 15 specifies wheelchair seating space dimensions (800mm x 1300mm), surface requirements, and adjacency to companion seating.' },
      { code: 'DDA', relevance: 'Discrimination includes providing inferior seating locations or failing to maintain accessible seating during events.' },
      { code: 'NCC', relevance: 'Table D3.8 sets ratios: 1 space for up to 100 seats, 2 for 101-400, then 1 additional per 200.' }
    ],
    plainEnglish: 'If your venue has fixed seating or hosts events, you must provide wheelchair spaces that are properly sized, have companion seats, offer good sightlines, and are maintained during all events.',
    complianceNote: 'The ratios in Table D3.8 are minimums. Best practice is to exceed them and distribute accessible seating throughout the venue rather than concentrating it in one area.'
  },

  solutions: [
    {
      title: 'Designate and mark wheelchair spaces in existing seating',
      description: 'Identify positions in your current layout that can serve as wheelchair spaces. Remove one or two fixed seats to create clear floor areas, add companion seat markers, and update your floor plan.',
      resourceLevel: 'low',
      costRange: '$0-300',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Walk your seating area and identify positions with the best combination of sightlines, level surface, and proximity to an accessible path.',
        'Remove or fold back one seat at each chosen position to create an 800mm x 1300mm clear floor space.',
        'Mark the companion seat next to each space. If it has a fixed armrest on the wheelchair-adjacent side, remove the armrest or replace the seat with one that has a flip-up arm.',
        'Place a small floor marker or tactile indicator at each wheelchair space so setup crews can locate them quickly.',
        'Update your floor plan or seating chart to show wheelchair positions and add them to your booking system.',
        'Brief all front-of-house and event setup staff on the locations and the rule that these spaces must never be filled with extra chairs or equipment.',
        'Print a laminated card for the setup crew listing each accessible position by row and seat number.'
      ],
      notes: 'Start with two or three spaces distributed across the venue. You can add more based on demand.'
    },
    {
      title: 'Introduce a varied seating catalogue and flexible layout',
      description: 'Purchase a mix of seat types (standard, wide, arms, high-back) and design a flexible layout that allows wheelchair spaces to be created at multiple locations throughout the venue.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Audit your current seat inventory by type, width, and condition.',
        'Purchase additional seat types to fill gaps: at least 10% wide or extra-width seats (600mm+), chairs with firm lumbar support, and seats with flip-up armrests.',
        'Design two or three layout templates for different event sizes, each showing wheelchair space locations distributed throughout the seating area.',
        'Install removable seat brackets or floor sockets that allow seats to be removed to create wheelchair spaces at various positions.',
        'Create a written seating policy that specifies the minimum number and distribution of wheelchair spaces for each event type.',
        'Add accessible seating selection to your online booking system with clear descriptions and photos of the view from each position.',
        'Train event setup crews on each layout template and require a supervisor sign-off that accessible seating is correctly positioned before doors open.',
        'Collect feedback from wheelchair users after events and adjust positions based on their input.'
      ],
      notes: 'Wide seats benefit many people, not just wheelchair users. People with hip replacements, larger body sizes, or chronic pain conditions all appreciate extra width.'
    },
    {
      title: 'Professional accessible seating redesign',
      description: 'Engage an access consultant and seating specialist to redesign your venue seating for maximum flexibility, compliance, and inclusion, including raised platforms, sightline engineering, and integrated booking.',
      resourceLevel: 'high',
      costRange: '$10,000-50,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant to audit your current seating against AS1428.1 and NCC Table D3.8.',
        'Commission a seating layout design that exceeds minimum wheelchair space ratios by 50% and distributes spaces across front, middle, and rear sections.',
        'Design raised platforms at rear wheelchair positions so sightlines are maintained when the audience stands.',
        'Specify a seat mix including standard, WCA (600mm), EAS (enhanced amenity), and bariatric-rated options.',
        'Install removable seat mounting systems so wheelchair spaces can be created at any position in the venue.',
        'Integrate accessible seating into your booking platform with 3D view previews, showing the actual sightline from each position.',
        'Commission the installation and conduct a compliance audit before reopening.',
        'Promote your upgraded accessible seating through disability organisations, tourism channels, and your website.'
      ],
      notes: 'A well-designed accessible seating layout often improves flow and comfort for all patrons, not just those with disability. Consider this investment as a general venue upgrade.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Theatre',
      scenario: 'A 500-seat community theatre had two wheelchair spaces, both at the very back of the stalls with obstructed views. Companion seats were across the aisle, not adjacent.',
      solution: 'Removed selected seats to create six wheelchair spaces: two front stalls, two mid-stalls, and two rear stalls. Installed flip-up armrests on adjacent seats for companions. Added a small raised platform at the rear positions for standing-audience sightlines.',
      outcome: 'Wheelchair bookings increased threefold. The theatre received an accessibility award from the local disability advisory committee.',
      cost: '$8,500',
      timeframe: '3 weeks'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular restaurant had uniform bistro-style seating with narrow, fixed chairs. Wheelchair users could not pull up to tables, and larger guests were uncomfortable in the narrow seats.',
      solution: 'Replaced 20% of chairs with wider models (550mm seat width), removed one chair from three tables to create wheelchair pull-up spaces, and added two high-back chairs with armrests near the entrance for guests who need extra support.',
      outcome: 'Positive reviews mentioning comfort. Staff reported fewer awkward conversations about seating limitations.',
      cost: '$2,200',
      timeframe: '1 week'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Stadium',
      scenario: 'A regional sports stadium concentrated all wheelchair seating in one corner behind a barrier, separated from the general crowd. Companions had to stand.',
      solution: 'Redistributed wheelchair spaces to four sections of the stadium, each with adjacent companion seats at the same level. Installed small platforms to maintain sightlines. Updated online ticketing to show accessible seat locations with photos.',
      outcome: 'Disability advocacy groups praised the changes publicly. Season ticket sales to wheelchair users doubled.',
      cost: '$35,000',
      timeframe: '6 weeks (off-season)'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre set up theatre-style seating for 200 but never left wheelchair spaces. Wheelchair users arriving at conferences had to wait while staff hurriedly rearranged chairs.',
      solution: 'Created three standard room layout templates, each showing four wheelchair spaces distributed through the seating area. Laminated setup cards placed in the AV cupboard. Setup checklist requires supervisor verification of accessible positions.',
      outcome: 'Zero incidents of missing wheelchair spaces since implementation. Conference organisers appreciate the consistency.',
      cost: '$0 (procedure change only)',
      timeframe: '1 day to create templates'
    }
  ],

  resources: [
    {
      title: 'AS1428.1:2021 Design for Access and Mobility',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Section 15 covers wheelchair seating spaces, companion seating, and sightline requirements in assembly buildings.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'NCC Volume 1: Accessible Seating (Table D3.8)',
      url: 'https://ncc.abcb.gov.au/',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'Specifies the required number of wheelchair spaces based on total seating capacity.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Accessible Events Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Includes guidance on accessible seating at events, sightlines, and companion seating requirements.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Live Performance Accessibility Guidelines',
      url: 'https://liveperformance.com.au/resources/',
      type: 'guide',
      source: 'Live Performance Australia',
      description: 'Industry guidance on wheelchair spaces, sightlines, and accessible booking systems for performance venues.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['seating', 'wheelchair space', 'companion seat', 'sightline', 'EAS', 'WCA', 'extra-width', 'event seating', 'accessible seating', 'bariatric', 'wide chair', 'assembly building']
},

// ─── Entry 2: Tables, counters and writing surfaces ───
{
  questionId: '3.1-1-3',
  questionText: 'Are tables and counters accessible to people using wheelchairs or mobility aids?',
  moduleCode: '3.1',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Tables, counters and writing surfaces',
  coveredQuestionIds: ['3.1-D-3', '3.1-D-10'],
  summary: 'Accessible tables and counters have the right height for wheelchair approach (750-850mm), sufficient knee clearance underneath (700mm high, 500mm deep), and a lowered section at service counters so all customers can interact face-to-face.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'A wheelchair user who cannot reach the counter, write on a form, or eat at a table is effectively excluded from your service. Standard bench-height counters (900-1000mm) are too high for someone seated in a wheelchair. Without knee clearance under a table, a wheelchair cannot pull in close enough for comfortable use. These are simple dimensional issues with straightforward solutions.',
    statistic: {
      value: '1 in 5',
      context: 'Australian adults has disability. For those using wheelchairs, inaccessible counters and tables are among the most frequently reported barriers.',
      source: 'People with Disability Australia'
    },
    quote: {
      text: 'I had to sign a document on my lap because the counter was too high. It felt humiliating when everyone else just walked up and signed normally.',
      attribution: 'Wheelchair user, Australian Human Rights Commission complaint summary'
    }
  },

  tips: [
    {
      icon: 'RulerIcon',
      text: 'Table tops should be 750-850mm from the floor for wheelchair approach.',
      detail: 'Standard dining table height (750mm) is generally suitable. Cafe bar-height tables (1000-1100mm) are not accessible. Provide at least some tables at the lower height in every seating area.',
      priority: 1
    },
    {
      icon: 'MoveVertical',
      text: 'Provide at least 700mm knee clearance height and 500mm depth under tables.',
      detail: 'Wheelchair footplates extend forward, so the clear space under the table must be at least 500mm deep from the table edge. Pedestal-base tables often provide better clearance than four-legged tables.',
      priority: 2
    },
    {
      icon: 'Store',
      text: 'Include a lowered counter section (750-850mm) at service points.',
      detail: 'The lowered section should be at least 800mm wide, with a clear floor space of 800mm x 1300mm in front. Position it where staff can serve from it naturally, not off to the side where it becomes an afterthought.',
      priority: 3
    },
    {
      icon: 'PenLine',
      text: 'Provide a writing surface at reception and service areas at accessible height.',
      detail: 'An accessible writing shelf (750-850mm height) near the reception counter allows wheelchair users to fill in forms, sign documents, or review paperwork. A clipboard is a simple alternative if a permanent surface is not feasible.',
      priority: 4
    },
    {
      icon: 'CircleDot',
      text: 'Ensure table edges are rounded and surfaces have contrast with the floor.',
      detail: 'Rounded edges reduce injury risk for people with vision impairment. A contrasting table edge (e.g. dark border on a light table) helps people with low vision locate the surface.',
      priority: 5
    },
    {
      icon: 'Scan',
      text: 'Leave 800mm x 1300mm clear floor space in front of counters and accessible tables.',
      detail: 'This is the minimum manoeuvring area for a wheelchair to approach and turn. Ensure furniture, displays, or queue barriers do not encroach on this space.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Measuring table and counter accessibility',
    steps: [
      {
        text: 'Measure the height of each table top from the floor.',
        measurement: { target: 'Table top height', acceptable: '750-850mm', unit: 'mm' }
      },
      {
        text: 'Measure knee clearance under each table: height from floor to underside of table structure.',
        measurement: { target: 'Knee clearance height', acceptable: 'Minimum 700mm', unit: 'mm' }
      },
      {
        text: 'Measure knee clearance depth from the table edge inward.',
        measurement: { target: 'Knee clearance depth', acceptable: 'Minimum 500mm', unit: 'mm' }
      },
      {
        text: 'Measure your service counter height.',
        measurement: { target: 'Counter height', acceptable: '750-850mm for accessible section', unit: 'mm' }
      },
      {
        text: 'Measure the width of any lowered counter section.',
        measurement: { target: 'Lowered counter width', acceptable: 'Minimum 800mm', unit: 'mm' }
      },
      {
        text: 'Check clear floor space in front of the lowered counter and accessible tables.',
        measurement: { target: 'Clear floor space', acceptable: '800mm x 1300mm minimum', unit: 'mm' }
      },
      { text: 'Attempt to pull a wheelchair (or office chair at similar seat height) up to each table and counter. Can you reach the surface comfortably and write on it?' },
      { text: 'Check that no cable trays, decorative panels, or structural bracing blocks knee space under tables.' },
      { text: 'Count the total tables and the number that meet accessible height and clearance requirements. Aim for at least 25% of tables to be accessible, spread across all seating zones.' }
    ],
    tools: ['Tape measure (3m)', 'Wheelchair or low office chair for testing', 'Camera for documentation'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.2',
      section: 'Section 25',
      requirement: 'Work surfaces and counters used by people in wheelchairs must be 750-850mm high with minimum 700mm knee clearance height and 500mm knee clearance depth.'
    },
    related: [
      { code: 'AS1428.1', relevance: 'Section 11 requires an accessible path of travel to and from service counters, including 800mm x 1300mm clear floor space.' },
      { code: 'Access-to-Premises', relevance: 'Service counters must include a section usable by a person in a wheelchair wherever the public interacts with staff.' },
      { code: 'DDA', relevance: 'Failure to provide accessible service points may constitute discrimination in the provision of goods and services.' }
    ],
    plainEnglish: 'Tables need to be the right height (750-850mm) with enough space underneath for wheelchair footplates. Service counters must have a lowered section so wheelchair users can interact face-to-face with staff.',
    complianceNote: 'AS1428.2 is a best-practice standard, not mandatory under the Premises Standards. However, the DDA requires reasonable adjustments, and providing accessible counters and tables is generally considered reasonable.'
  },

  solutions: [
    {
      title: 'Add a portable writing surface and rearrange existing tables',
      description: 'Provide a clipboard or portable writing board at service counters and rearrange existing tables to ensure accessible-height options are available in every seating zone.',
      resourceLevel: 'low',
      costRange: '$0-200',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Measure all existing tables and identify which ones already meet 750-850mm height with 700mm knee clearance.',
        'Move at least one compliant table into each seating zone so wheelchair users have choice of location.',
        'If no tables meet the requirements, identify the closest candidates and check whether leg height can be adjusted.',
        'Place a clipboard and pen at each service counter at a reachable height (no higher than 850mm) for form-filling.',
        'Remove any under-table obstructions (bags, bins, cable boxes) that block knee clearance.',
        'Brief staff that certain tables should be offered first to wheelchair users and not cluttered with reserved signs or table decorations that reduce usable surface.'
      ],
      notes: 'This costs nothing if you already have suitable tables. Simply redistributing them can make a significant difference.'
    },
    {
      title: 'Install a lowered counter section and purchase accessible tables',
      description: 'Add a lowered section to your service counter and replace a proportion of tables with accessible-height models that have pedestal bases for maximum knee clearance.',
      resourceLevel: 'medium',
      costRange: '$800-4,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Engage a joiner or shopfitter to design a lowered counter section: 750-850mm height, minimum 800mm wide, with clear space underneath.',
        'Position the lowered section where staff naturally serve from it, not at the far end of the counter.',
        'Purchase pedestal-base tables at 750mm height for at least 25% of your dining or work positions.',
        'Verify knee clearance under new tables (700mm height, 500mm depth minimum).',
        'Add a contrasting edge strip to new tables and the lowered counter for visibility.',
        'Install a writing surface or pull-out shelf at reception for paperwork.',
        'Update your accessibility information to mention the lowered counter and accessible tables.',
        'Train staff to direct wheelchair users to accessible tables proactively.'
      ],
      notes: 'Pedestal-base tables provide the best knee clearance. Avoid tables with cross-bracing between legs.'
    },
    {
      title: 'Redesign service areas with height-adjustable furniture',
      description: 'Install motorised height-adjustable counters at key service points and equip your venue with a mix of adjustable and fixed-height accessible furniture for maximum flexibility.',
      resourceLevel: 'high',
      costRange: '$5,000-20,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant to audit all service points, writing surfaces, and dining/work tables.',
        'Specify motorised height-adjustable counter sections at reception and primary service points (adjustment range 650-1100mm covers seated and standing users).',
        'Select a furniture system with adjustable-height tables for at least 25% of positions.',
        'Design the service area layout so all counters have 800mm x 1300mm clear floor space and an accessible path of travel.',
        'Install contrast strips, rounded edges, and tactile markers on all new surfaces.',
        'Commission installation and verify all dimensions against AS1428.2 specifications.',
        'Train staff on operating adjustable counters and the rationale behind the design.',
        'Promote the upgraded facilities on your website and accessibility page.'
      ],
      notes: 'Motorised height-adjustable counters also benefit staff members with disability or those who prefer to alternate between sitting and standing.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A busy cafe had only bar-height tables (1050mm) and a service counter at 1000mm. Wheelchair users could not eat comfortably or pay at the counter without staff leaning over to them.',
      solution: 'Replaced four bar-height tables with 750mm pedestal-base tables spread across the cafe. Added a lowered counter section (800mm high, 900mm wide) at the main service point.',
      outcome: 'Wheelchair users could now dine and pay independently. Staff reported smoother service interactions.',
      cost: '$3,200',
      timeframe: '1 week'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Service Centre',
      scenario: 'A council customer service centre had a high bench counter (1050mm) running the full width of the room. Wheelchair users had to conduct business by looking up at staff, and could not sign forms on the counter.',
      solution: 'Cut a 1200mm-wide lowered section into the existing counter at 800mm height with knee clearance underneath. Added a pull-out writing shelf and a lowered EFTPOS terminal.',
      outcome: 'Council received positive feedback from disability advisory committee. The approach was rolled out to all branch offices.',
      cost: '$2,800',
      timeframe: '4 days'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel reception desk was a solid timber structure at 1100mm height. Guests in wheelchairs could not see the receptionist or sign the check-in forms.',
      solution: 'Installed a motorised height-adjustable section (700-1100mm range) at one end of the reception desk. Staff press a button to lower it when a wheelchair user approaches.',
      outcome: 'Guest satisfaction scores for accessibility improved significantly. The hotel was featured in an accessible travel blog.',
      cost: '$6,500',
      timeframe: '2 weeks'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Pharmacy',
      scenario: 'A pharmacy had a high consultation counter (1050mm) and no accessible writing surface for customers filling in scripts or forms.',
      solution: 'Added a lowered counter extension (800mm, 900mm wide) at the consultation point and placed a clipboard at the script drop-off window. Moved the EFTPOS terminal to the lowered section.',
      outcome: 'Elderly customers using walkers and wheelchair users praised the change. Staff found the lowered section useful for reviewing documents with customers.',
      cost: '$1,500',
      timeframe: '3 days'
    }
  ],

  resources: [
    {
      title: 'AS1428.2:1992 Enhanced and Additional Requirements',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-2-colon-1992',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Specifies work surface heights, knee clearance dimensions, and counter requirements for wheelchair access.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Accessible Reception and Service Counters Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guidance on designing service counters that work for everyone.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Premises Standards Advisory Notes: Counters',
      url: 'https://www.ag.gov.au/rights-and-protections/human-rights-and-anti-discrimination/disability-standards/disability-access-premises-buildings',
      type: 'guide',
      source: 'Attorney-General\'s Department',
      description: 'Government guidance on applying the Premises Standards to reception desks and service counters.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['table height', 'counter', 'knee clearance', 'writing surface', 'lowered counter', 'wheelchair', 'pedestal table', 'service point', 'reception desk', 'EFTPOS']
},

// ─── Entry 3: Furniture flexibility and circulation ───
{
  questionId: '3.1-1-4',
  questionText: 'Can furniture be rearranged to accommodate different access needs?',
  moduleCode: '3.1',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Furniture flexibility and circulation',
  coveredQuestionIds: ['3.1-D-2', '3.1-D-15'],
  summary: 'Moveable furniture allows staff to create wheelchair-accessible pathways, clear floor space, and outdoor seating options. Aisles between furniture should be at least 900mm wide (1200mm preferred) to allow comfortable passage for wheelchairs and mobility aids.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'A venue with beautiful fixed furniture arranged in tight rows can be completely inaccessible to a wheelchair user. Moveable furniture gives you the flexibility to create clear pathways, open up space for wheelchair users at tables, and respond to different group configurations. Outdoor seating areas are often overlooked for accessibility, but they are popular destinations, especially in Australian climates, and must be reachable and usable by everyone.',
    statistic: {
      value: '900mm',
      context: 'is the absolute minimum clear width for a wheelchair to pass through. At this width, turning is very difficult. 1200mm allows comfortable two-way traffic.',
      source: 'AS1428.1:2021'
    },
    quote: {
      text: 'The restaurant looked lovely but the tables were so close together I could not get my wheelchair through. The waiter said "sorry, we cannot move anything." I left.',
      attribution: 'Wheelchair user, disability advocacy forum'
    }
  },

  tips: [
    {
      icon: 'Move',
      text: 'Choose lightweight, stackable furniture that staff can rearrange quickly.',
      detail: 'Heavy or bolted-down furniture limits your ability to accommodate wheelchair users, walkers, and prams. Lightweight aluminium or moulded chairs can be moved in seconds. Keep at least two spare chairs stored nearby for quick swaps.',
      priority: 1
    },
    {
      icon: 'Maximize',
      text: 'Maintain minimum 900mm aisle width between furniture (1200mm preferred).',
      detail: 'Measure the narrowest point between chair backs when chairs are occupied (add 150mm to the chair depth for seated posture). If aisle width drops below 900mm when chairs are pulled out, respace the tables.',
      priority: 2
    },
    {
      icon: 'TreePine',
      text: 'Ensure outdoor seating areas have a firm, level path and at least one accessible table.',
      detail: 'Outdoor areas on grass, gravel, or uneven pavers are barriers for wheelchair users. A concrete or decking path at least 1000mm wide leading to a level, firm-surface area with an accessible table makes outdoor seating inclusive.',
      priority: 3
    },
    {
      icon: 'Route',
      text: 'Create and mark a primary accessible route through the venue.',
      detail: 'Even in flexible layouts, designate one route that must always remain at least 1200mm wide. Mark it on setup plans and brief staff not to place furniture, displays, or queue barriers in this path.',
      priority: 4
    },
    {
      icon: 'Undo2',
      text: 'Establish a "reset" layout that staff return to after events or rearrangements.',
      detail: 'Without a defined default layout, furniture gradually migrates into narrower configurations. Take a photo of the accessible default layout, laminate it, and post it in the staff area as a reference.',
      priority: 5
    },
    {
      icon: 'ClipboardCheck',
      text: 'Include furniture placement in your opening checklist.',
      detail: 'Add a daily check to your opening procedure: "Confirm main aisle is 1200mm wide, accessible tables are unobstructed, outdoor path is clear." This prevents gradual drift.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing furniture flexibility and circulation space',
    steps: [
      {
        text: 'Measure the width of the main circulation aisle between tables when chairs are pushed in.',
        measurement: { target: 'Aisle width (chairs in)', acceptable: 'Minimum 1200mm', unit: 'mm' }
      },
      {
        text: 'Measure the aisle width when chairs are pulled out for seated diners (add 150mm to chair depth).',
        measurement: { target: 'Aisle width (chairs out)', acceptable: 'Minimum 900mm', unit: 'mm' }
      },
      {
        text: 'Check the width of the narrowest point on the route from the entrance to the furthest seating area.',
        measurement: { target: 'Narrowest point on route', acceptable: 'Minimum 900mm (1200mm preferred)', unit: 'mm' }
      },
      { text: 'Try to move three different pieces of furniture. Can one person do it without excessive effort? If furniture is too heavy, note which items need replacing with lighter alternatives.' },
      { text: 'Walk the route to outdoor seating. Is the surface firm and level the entire way? Is there at least one table at accessible height (750-850mm) on a level surface?' },
      { text: 'Check whether queue barriers, A-frame signs, flower pots, or displays narrow any aisle below 900mm.' },
      { text: 'Sit in a wheelchair or low office chair and attempt to navigate from the entrance to three different seating positions. Note any points where you cannot pass or turn.' },
      { text: 'Review your event or function layout plans. Do they show accessible routes and wheelchair positions?' }
    ],
    tools: ['Tape measure (5m)', 'Camera for documentation', 'Wheelchair or low office chair for testing'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 7',
      requirement: 'Accessible paths of travel within buildings must have a minimum unobstructed width of 1000mm, with passing spaces of 1800mm x 2000mm at intervals not exceeding 20m.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Section 7 recommends 1200mm minimum width for comfortable circulation and specifies turning space requirements.' },
      { code: 'Access-to-Premises', relevance: 'Requires accessible paths of travel to and within all areas available to the public.' },
      { code: 'DDA', relevance: 'Failure to provide accessible circulation may constitute discrimination in access to services and premises.' }
    ],
    plainEnglish: 'The spaces between your furniture must be wide enough for a wheelchair to pass through comfortably. The ideal is 1200mm, and 900mm is the bare minimum. Outdoor seating must also be reachable on a firm, level surface.',
    complianceNote: 'While furniture layout is not prescribed by building codes (which focus on fixed elements), the DDA requires that the way you arrange and use your space does not create barriers for people with disability.'
  },

  solutions: [
    {
      title: 'Respace existing furniture and create an accessible layout plan',
      description: 'Rearrange your current furniture to achieve minimum aisle widths, document the layout as your default, and brief staff on maintaining it.',
      resourceLevel: 'low',
      costRange: '$0-100',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Measure your main aisles with chairs pulled out. If any are below 900mm, push tables further apart until the minimum is reached.',
        'Identify the primary route from the entrance to the service counter and the most popular seating area. Ensure this route is at least 1200mm wide.',
        'Remove one chair from at least two tables to create ready-made wheelchair pull-up spaces.',
        'Photograph the layout from several angles as the "default accessible layout."',
        'Laminate the photo and post it in the staff area with a note: "Reset to this layout at end of each shift."',
        'Add a line to the opening checklist: "Check main aisle is clear, accessible tables are unobstructed."'
      ],
      notes: 'This is free and takes less than an hour. The biggest challenge is maintaining the layout over time, which is why the reset photo and checklist are essential.'
    },
    {
      title: 'Replace heavy furniture with lightweight, moveable alternatives',
      description: 'Purchase lightweight, stackable chairs and tables that staff can easily rearrange, and create a firm path to outdoor seating.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Audit your current furniture. Identify items that are too heavy for one person to move or that have wide bases blocking aisle space.',
        'Source lightweight replacements: aluminium or polypropylene stacking chairs (typically 3-5kg each), tables with folding or nesting capability.',
        'Purchase at least 10-15% more chairs than positions so you always have spares for flexible arrangements.',
        'Install a concrete strip or composite decking path (minimum 1000mm wide) to outdoor seating if the current surface is grass or gravel.',
        'Place one accessible-height table (750mm, pedestal base) on a level surface in the outdoor area.',
        'Create two or three layout templates for different scenarios (quiet service, busy service, function) and laminate them for staff reference.',
        'Train staff on how to quickly reconfigure the layout and the minimum clearances to maintain.'
      ],
      notes: 'Lightweight commercial-grade furniture is available from hospitality suppliers. It withstands daily use and is often more durable than heavy timber pieces.'
    },
    {
      title: 'Professional space planning with flexible furniture system',
      description: 'Engage an interior designer or access consultant to create a fully flexible furniture system with multiple layout options, all meeting accessibility standards.',
      resourceLevel: 'high',
      costRange: '$5,000-25,000',
      timeRequired: '3-6 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant to audit current circulation, identify pinch points, and recommend improvements.',
        'Commission an interior designer to create a furniture plan with modular pieces that can be reconfigured for different events and capacities.',
        'Specify furniture with integrated accessibility features: flip-up arms, adjustable height, nesting capability, and contrasting edges.',
        'Install floor markers or subtle guide strips showing the minimum accessible route width.',
        'Design outdoor areas with compliant surfaces, accessible tables, shade structures, and level paving.',
        'Create a digital layout tool (even a simple PowerPoint template) so event organisers can plan configurations that maintain accessible routes.',
        'Commission the fit-out and conduct a walkthrough with wheelchair users before reopening.',
        'Establish a quarterly layout audit schedule.'
      ],
      notes: 'Professional space planning often reveals that you can fit more covers (not fewer) when furniture is properly arranged, because the layout is more efficient.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Bistro',
      scenario: 'A bistro had heavy timber tables spaced 600mm apart. Staff could barely squeeze between them, let alone wheelchair users. Outdoor courtyard seating was on uneven bluestone pavers.',
      solution: 'Replaced timber chairs with lightweight aluminium stackers, respaced tables to 1200mm aisles, and laid a 1200mm-wide concrete strip through the courtyard to one accessible table on a level pad.',
      outcome: 'Increased covers by 8% (better flow meant faster table turns). Wheelchair users could dine inside or outside for the first time.',
      cost: '$4,500',
      timeframe: '2 weeks'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Library',
      scenario: 'A public library had study desks arranged in long rows with only 700mm between rows. Wheelchair users could not access the majority of desks.',
      solution: 'Rearranged desks into pods of four with 1300mm aisles. Removed one desk per pod to create a wheelchair space. Documented the layout on the floor plan for cleaning staff to reference.',
      outcome: 'Wheelchair users could now reach desks throughout the library. Study space utilisation actually improved as the pod arrangement felt less crowded.',
      cost: '$0 (existing furniture)',
      timeframe: '1 afternoon'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Function Centre',
      scenario: 'A function centre set up tables in a standard grid pattern for every event, leaving narrow 800mm aisles and no wheelchair circulation route.',
      solution: 'Created three layout templates (banquet, conference, cocktail) with a marked 1500mm-wide accessible route through the centre of each. Laminated templates posted in the setup cupboard.',
      outcome: 'Setup crew consistently delivered accessible layouts. Complaints from wheelchair-using guests dropped to zero.',
      cost: '$50 (laminating and printing)',
      timeframe: '2 hours to create templates'
    }
  ],

  resources: [
    {
      title: 'AS1428.1:2021 Accessible Paths of Travel',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Specifies minimum widths, passing spaces, and turning areas for accessible paths within buildings.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Inclusive Design for Hospitality Spaces',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical tips for arranging hospitality spaces to be accessible while maintaining ambiance and capacity.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Outdoor Dining Accessibility Checklist',
      url: 'https://www.and.org.au/resources/',
      type: 'checklist',
      source: 'Australian Network on Disability',
      description: 'Checklist for making outdoor dining and seating areas accessible, including surface, shade, and table requirements.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['furniture', 'moveable', 'aisle width', 'circulation', 'outdoor seating', 'flexible layout', 'rearrange', 'stackable', 'pathway', 'clear width']
},

// ─── Entry 4: Assistance animals at your venue ───
{
  questionId: '3.1-D-6',
  questionText: 'Do you welcome and accommodate assistance animals?',
  moduleCode: '3.1',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Assistance animals at your venue',
  coveredQuestionIds: ['3.1-D-7'],
  summary: 'Under Australian law, assistance animals must be allowed in all public areas. Venues should provide water bowls, relief areas, and staff training to ensure handlers and their animals are welcomed confidently.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Assistance animals perform vital tasks for their handlers: guiding people with vision impairment, alerting people who are deaf, detecting seizures, and providing psychiatric support. Refusing entry to an assistance animal is unlawful under the Disability Discrimination Act 1992. Despite this, handlers regularly report being challenged, turned away, or subjected to uncomfortable questioning. Clear policies and staff training prevent these incidents and protect your business from legal liability.',
    statistic: {
      value: '63%',
      context: 'of assistance animal handlers in Australia report being denied access or challenged at least once in the past year.',
      source: 'Assistance Dogs Australia survey'
    },
    quote: {
      text: 'Every time I enter a new venue, I brace myself for the "no dogs allowed" confrontation. When a business welcomes my guide dog without hesitation, I feel an enormous sense of relief.',
      attribution: 'Guide dog handler, Vision Australia feedback'
    }
  },

  tips: [
    {
      icon: 'PawPrint',
      text: 'Under the DDA, assistance animals must be permitted in all areas open to the public.',
      detail: 'This applies regardless of food safety regulations, "no pets" policies, or strata rules. The only lawful exceptions are operating theatres and other sterile clinical environments. Food preparation areas must allow the animal to accompany the handler through, though the handler should be offered seating away from food preparation if practical.',
      priority: 1
    },
    {
      icon: 'Shield',
      text: 'Never ask for "proof" beyond what the law allows.',
      detail: 'Under the DDA, you may ask to see evidence that the animal is an assistance animal (e.g. ID card, vest, or a letter from a health professional). However, you cannot require specific documentation or refuse entry while the person obtains proof. If in doubt, allow entry.',
      priority: 2
    },
    {
      icon: 'Droplets',
      text: 'Keep a clean water bowl available at reception or entrance.',
      detail: 'Assistance animals work hard. A water bowl costs nothing and signals that your venue welcomes them. Use a stainless steel bowl (easy to clean) and refresh the water regularly.',
      priority: 3
    },
    {
      icon: 'MapPin',
      text: 'Identify a designated relief area and communicate its location.',
      detail: 'A small grassy area or garden bed near the entrance works well. Add the location to your accessibility information so handlers know in advance. Provide a waste bag dispenser if possible.',
      priority: 4
    },
    {
      icon: 'Users',
      text: 'Train all front-line staff on assistance animal rights and etiquette.',
      detail: 'Staff should know: do not pat or distract the animal, do not feed the animal, speak to the handler (not the animal), and never separate the handler from the animal. Include this in induction training.',
      priority: 5
    },
    {
      icon: 'BookOpen',
      text: 'Document your assistance animal policy in writing and display it.',
      detail: 'A brief, visible policy (e.g. a small sign at the entrance) reassures handlers and prevents staff from making ad-hoc decisions. Include: "Assistance animals are welcome in all areas of this venue."',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing your assistance animal readiness',
    steps: [
      { text: 'Review your current policy. Does it explicitly state that assistance animals are permitted in all public areas? If you have a "no pets" sign, does it include an exception for assistance animals?' },
      { text: 'Check whether front-line staff (reception, security, wait staff) know what an assistance animal is and what to do when one arrives. Ask three staff members and note their responses.' },
      { text: 'Walk through the venue from the entrance to key areas (dining, seating, counter). Is there enough floor space for a large dog (such as a Labrador) to lie beside the handler at each point?' },
      { text: 'Identify a relief area: a grassy or garden area within 50m of the entrance that the handler can easily reach.' },
      { text: 'Check if a water bowl is available and if so, where it is located. Is it clean and accessible?' },
      { text: 'Review your signage. Is there any sign that might be interpreted as prohibiting assistance animals (e.g. "No Animals", "No Dogs")?' },
      { text: 'Check your website and booking communications. Do they mention that assistance animals are welcome?' },
      { text: 'Review any incidents in the past 12 months where an assistance animal handler was challenged or turned away. Investigate what went wrong and what training gap contributed.' }
    ],
    tools: ['Written assistance animal policy', 'Staff training records', 'Camera for documenting signage'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Sections 8-9',
      requirement: 'It is unlawful to discriminate against a person with disability who is accompanied by an assistance animal. The animal must be permitted in any place the public is allowed to enter.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'The Premises Standards require premises to be accessible, which includes not creating barriers through policies that exclude assistance animals.' },
      { code: 'NCC', relevance: 'The Building Code does not restrict assistance animals. Food safety regulations include exemptions for assistance animals in dining areas.' }
    ],
    plainEnglish: 'Assistance animals must be allowed everywhere the public can go. You cannot refuse entry, charge extra, or require them to be separated from their handler. Staff should welcome them calmly and provide water and a relief area.',
    complianceNote: 'Refusing entry to an assistance animal can result in a complaint to the Australian Human Rights Commission. Conciliation outcomes can include apologies, policy changes, and financial compensation. Penalties under state legislation may also apply.'
  },

  solutions: [
    {
      title: 'Create an assistance animal policy and brief all staff',
      description: 'Write a one-page assistance animal policy, train all front-line staff, update signage, and set up a water station.',
      resourceLevel: 'low',
      costRange: '$0-50',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Write a one-page policy covering: assistance animals are welcome in all areas; staff should speak to the handler, not the animal; staff must not pat, feed, or distract the animal; only lawful questions about evidence are permitted; provide water and relief area information.',
        'Print the policy and include it in the staff handbook or induction pack.',
        'Brief all current front-line staff at the next team meeting (15-minute agenda item).',
        'Update any "No Pets" or "No Dogs" signs to read "No pets (assistance animals welcome)" or remove them entirely.',
        'Place a stainless steel water bowl near the entrance or reception.',
        'Identify the nearest grassy relief area and add its location to your accessibility page.'
      ],
      notes: 'Vision Australia, Guide Dogs Australia, and Assistance Dogs Australia all provide free template policies and training materials.'
    },
    {
      title: 'Develop comprehensive staff training with scenario-based learning',
      description: 'Create a training module for all staff covering assistance animal law, etiquette, and common scenarios, delivered annually with refreshers for new starters.',
      resourceLevel: 'medium',
      costRange: '$200-800',
      timeRequired: '2-4 hours to develop; 30 minutes per staff member',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Source training materials from Guide Dogs Australia, Vision Australia, or Assistance Dogs Australia (many provide free resources).',
        'Develop a 30-minute training module covering: types of assistance animals (guide, hearing, medical alert, psychiatric), legal requirements, appropriate questions, floor space and water provision, and relief areas.',
        'Include scenario-based exercises: "A customer arrives with a small dog in a vest. Another customer complains about allergies. What do you do?"',
        'Deliver training to all current staff and include in the induction program for new hires.',
        'Create a laminated quick-reference card for reception and service points.',
        'Schedule annual refresher training and update materials when legislation changes.',
        'Invite a local assistance animal organisation to bring a trained animal to a staff session for familiarisation.'
      ],
      notes: 'Guide Dogs Australia and Assistance Dogs Australia offer free workplace presentations in many areas. Contact your local branch.'
    },
    {
      title: 'Establish a fully welcoming assistance animal environment',
      description: 'Partner with an assistance animal organisation to audit and certify your venue as assistance-animal-friendly, including designated rest areas, staff certification, and marketing.',
      resourceLevel: 'high',
      costRange: '$500-2,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Contact Guide Dogs Australia, Assistance Dogs Australia, or your state equivalent to discuss a venue partnership or certification program.',
        'Commission an audit of your venue from the perspective of an assistance animal handler: space under tables, floor surfaces, relief areas, water access, staff knowledge.',
        'Install a permanent, signed relief area with grass or synthetic turf, waste bag dispenser, and a small waste bin.',
        'Design and install signage at the entrance: "Assistance Animals Welcome" with the ISA symbol.',
        'Have all front-line staff complete accredited training and display the certification.',
        'Add assistance animal welcome information to your website, booking system, and marketing materials.',
        'Include a question on your booking form: "Will you be accompanied by an assistance animal? Let us know so we can prepare."',
        'Review and update your approach annually in consultation with the partner organisation.'
      ],
      notes: 'Promoting your venue as assistance-animal-friendly is a genuine marketing advantage. Many handlers actively seek out welcoming venues and share recommendations within their community.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had a strict "No Dogs" sign and a staff member turned away a guide dog handler, citing food safety. The handler lodged a complaint with the Australian Human Rights Commission.',
      solution: 'After conciliation, the restaurant removed the sign, trained all staff, placed a water bowl at reception, and added "Assistance Animals Welcome" to their door and website. The manager attended a Guide Dogs presentation.',
      outcome: 'No further incidents. The restaurant was recommended by Guide Dogs Victoria as a welcoming dining option.',
      cost: '$300 (training and signage)',
      timeframe: '2 weeks'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel charged an assistance dog handler a $200 "pet cleaning fee" for their guide dog. The handler complained to the AHRC.',
      solution: 'The hotel revised its policy to explicitly exempt assistance animals from all pet fees. Added the exemption to the booking terms, trained reservations staff, and placed a water bowl and waste bags in the lobby.',
      outcome: 'Policy change applied across all properties in the chain. The hotel group partnered with Assistance Dogs Australia for annual staff training.',
      cost: '$0 (policy change)',
      timeframe: '1 week'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'Security guards at a shopping centre repeatedly questioned assistance animal handlers, asking for specific documentation and occasionally escorting them out. Multiple complaints were received.',
      solution: 'Centre management engaged Guide Dogs NSW to deliver training for all security staff. Created a recognition guide showing common assistance animal vests and ID formats. Added "Assistance Animals Welcome" signs at all entrances.',
      outcome: 'Complaints dropped to zero within three months. Security staff became confident advocates, sometimes proactively greeting handlers.',
      cost: '$1,200 (training for 15 security staff)',
      timeframe: '1 month'
    },
    {
      businessType: 'health-wellness',
      businessTypeLabel: 'Medical Centre',
      scenario: 'A medical centre asked a psychiatric assistance dog handler to leave the dog in the car during appointments, claiming hygiene requirements.',
      solution: 'Reviewed the DDA and updated the clinic policy to allow assistance animals in all patient areas. Designated a relief area in the garden courtyard. Placed a water bowl in the waiting room.',
      outcome: 'The handler was able to attend appointments with their dog, which was essential for managing their anxiety. Other patients responded positively.',
      cost: '$50 (water bowl and waste bags)',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'Assistance Animals and the DDA',
      url: 'https://humanrights.gov.au/our-work/disability-rights/frequently-asked-questions-assistance-animals',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Official FAQ covering legal requirements, what counts as an assistance animal, and evidence requirements.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Guide Dogs Australia: Business Resources',
      url: 'https://www.guidedogsaustralia.com/access-awareness',
      type: 'guide',
      source: 'Guide Dogs Australia',
      description: 'Free training materials, policy templates, and workplace presentations for businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Assistance Dogs Australia: Access Awareness',
      url: 'https://www.assistancedogs.org.au/access-awareness/',
      type: 'guide',
      source: 'Assistance Dogs Australia',
      description: 'Resources for businesses on welcoming assistance dogs, including video training modules.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Food Standards Code and Assistance Animals',
      url: 'https://www.foodstandards.gov.au/',
      type: 'guide',
      source: 'Food Standards Australia New Zealand',
      description: 'Clarification that food safety codes do not override the DDA requirement to admit assistance animals.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['assistance animal', 'guide dog', 'hearing dog', 'service animal', 'DDA', 'no pets', 'water bowl', 'relief area', 'companion animal', 'disability discrimination']
},

// ─── Entry 5: Accessible storage and controls ───
{
  questionId: '3.1-D-8',
  questionText: 'Are storage areas and controls accessible from a seated position?',
  moduleCode: '3.1',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible storage and controls',
  coveredQuestionIds: ['3.1-D-9'],
  summary: 'Coat hooks, lockers, and controls should be mounted at 900-1100mm height so they can be reached from a seated position. Controls must be operable with one hand and without tight grasping, pinching, or twisting.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'When a wheelchair user cannot reach a coat hook, locker, light switch, or power point, they lose independence and must ask for help with basic tasks. Controls that require tight gripping, pinching, or twisting exclude people with limited hand dexterity, arthritis, or upper limb conditions. Mounting storage and controls within the accessible reach range (900-1100mm) and using lever or push-button mechanisms is a simple design principle that benefits everyone.',
    statistic: {
      value: '3.4 million',
      context: 'Australians have arthritis. Many have difficulty with gripping, twisting, and fine motor tasks.',
      source: 'Arthritis Australia'
    },
    quote: {
      text: 'The coat hooks were above my head. The light switch was behind a narrow door I could not reach from my chair. Small things, but they add up to feeling like the place was not built for me.',
      attribution: 'Wheelchair user, disability accessibility survey'
    }
  },

  tips: [
    {
      icon: 'ArrowUpDown',
      text: 'Mount coat hooks, lockers, and shelves at 900-1100mm from the floor.',
      detail: 'This range is reachable for most wheelchair users (forward reach from a seated position). If you need hooks at standard height for standing users as well, install a second set at the lower height rather than only providing high hooks.',
      priority: 1
    },
    {
      icon: 'Hand',
      text: 'Use lever handles, rocker switches, or push buttons for all controls.',
      detail: 'Round door knobs, twist locks, and small toggle switches are difficult or impossible for people with limited hand dexterity. Lever handles can be operated with a closed fist, elbow, or forearm.',
      priority: 2
    },
    {
      icon: 'Plug',
      text: 'Install at least some power points at 600-1100mm height.',
      detail: 'Standard power points at skirting level (300mm) require bending or reaching down, which is difficult from a wheelchair. Points at 600-1100mm are accessible from a seated position. Install these near accessible seating areas and at workstations.',
      priority: 3
    },
    {
      icon: 'Scan',
      text: 'Provide 800mm x 1300mm clear floor space in front of storage and controls.',
      detail: 'A wheelchair needs this space to approach and use the control. Ensure no furniture, bins, or displays block the approach.',
      priority: 4
    },
    {
      icon: 'Contrast',
      text: 'Use contrasting colours for controls so they are visually distinct from the wall.',
      detail: 'A white switch on a white wall is invisible to someone with low vision. Use a contrasting switch plate or surround (e.g. dark plate on light wall) with at least 30% luminance contrast.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing storage and control accessibility',
    steps: [
      {
        text: 'Measure the height of all coat hooks available to customers.',
        measurement: { target: 'Coat hook height', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      {
        text: 'Measure the height of locker locks and shelf access points.',
        measurement: { target: 'Locker/shelf height', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      {
        text: 'Check the height of light switches, thermostats, and other customer-operated controls.',
        measurement: { target: 'Control height', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      {
        text: 'Check the height of power points near accessible seating or workstations.',
        measurement: { target: 'Power point height', acceptable: '600-1100mm from floor', unit: 'mm' }
      },
      { text: 'Test each control for one-hand operation. Can you operate it with a closed fist (simulating limited dexterity)? If you must grip, pinch, or twist, the control needs replacing.' },
      { text: 'Check the clear floor space in front of each control and storage unit. Is there at least 800mm x 1300mm of unobstructed space?' },
      { text: 'Assess colour contrast between controls and their background. Can you easily see the switch or handle from 1 metre away?' },
      { text: 'Sit in a wheelchair or low chair and attempt to use each control and storage point. Note any that are unreachable or require excessive effort.' }
    ],
    tools: ['Tape measure (3m)', 'Wheelchair or low stool for reach testing', 'Camera for documentation'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 13',
      requirement: 'Controls and operating mechanisms on accessible paths must be located between 900mm and 1100mm from the floor, be operable with one hand, and not require tight grasping, pinching, or twisting of the wrist.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Section 22 specifies forward and side reach ranges for people in wheelchairs: 400-1200mm side reach, 400-1100mm forward reach.' },
      { code: 'Access-to-Premises', relevance: 'Controls along accessible paths of travel must comply with AS1428.1 reach and operability requirements.' }
    ],
    plainEnglish: 'Switches, handles, hooks, and controls that customers use must be at a height a wheelchair user can reach (900-1100mm) and must work with one hand without needing to grip tightly or twist.',
    complianceNote: 'These requirements apply to new construction and significant renovations. For existing buildings, retrofitting controls is usually inexpensive and is a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Add lower hooks and replace problematic controls',
      description: 'Install additional coat hooks at accessible height and swap twist-type or hard-to-reach controls with lever or push-button alternatives.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-3 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Walk through customer areas and list every hook, switch, control, and power point that is above 1100mm or below 900mm.',
        'Install additional coat hooks at 1000mm height alongside existing high hooks (typically $5-10 per hook from hardware stores).',
        'Replace round door knobs on customer-facing doors with lever handles ($20-50 per handle).',
        'Replace any toggle or twist light switches in customer areas with rocker-style switches ($10-20 each).',
        'If power points near accessible seating are at skirting level, install a surface-mounted extension outlet at 700mm height.',
        'Add contrasting coloured switch plates where controls are the same colour as the wall.'
      ],
      notes: 'These are simple DIY tasks for most of the items. An electrician is needed for power point and switch changes.'
    },
    {
      title: 'Upgrade lockers and install accessible control panels',
      description: 'Replace customer lockers with models featuring accessible locks and install a consistent control system throughout customer areas.',
      resourceLevel: 'medium',
      costRange: '$500-3,000',
      timeRequired: '2-5 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Audit all customer-operated controls and storage against the 900-1100mm height range and one-hand operability test.',
        'Replace existing lockers with models that have push-button or RFID locks at 1000mm height. Ensure at least 25% of lockers are at accessible height.',
        'Install lever-style handles on all customer-facing doors.',
        'Replace twist thermostats with digital or push-button models.',
        'Add accessible-height power points (700mm) near accessible seating and workstations.',
        'Install contrasting switch plates throughout customer areas.',
        'Create an accessible features guide showing customers where accessible storage and controls are located.',
        'Add information about accessible lockers and controls to your website accessibility page.'
      ],
      notes: 'RFID or keypad lockers eliminate dexterity barriers entirely. Many commercial locker suppliers offer accessible models.'
    },
    {
      title: 'Comprehensive accessible controls and smart building integration',
      description: 'Integrate accessible control systems throughout the venue, including smart lighting, automated doors, and a centralised control system accessible from a smartphone app.',
      resourceLevel: 'high',
      costRange: '$5,000-20,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant and building services engineer to audit all customer-operated systems.',
        'Design a smart building system that allows lighting, temperature, and other controls to be operated from a smartphone app (eliminating the need to reach physical switches).',
        'Install automatic door openers on heavy customer-facing doors, activated by push pads at accessible height.',
        'Replace all customer storage with RFID-operated lockers at 900-1100mm height.',
        'Install accessible-height power points and USB charging outlets at all accessible seating positions.',
        'Add occupancy sensors for lighting in corridors and toilets to reduce the need for manual switches.',
        'Commission the system and test with wheelchair users and people with limited dexterity.',
        'Document the system for staff and include a user guide for customers.'
      ],
      notes: 'Smart building controls benefit everyone and can reduce energy costs. The accessibility benefits are an added advantage of a general efficiency upgrade.'
    }
  ],

  examples: [
    {
      businessType: 'health-wellness',
      businessTypeLabel: 'Gym',
      scenario: 'A gym had lockers with combination twist locks at 1500mm height. Wheelchair users and people with arthritis could not use them.',
      solution: 'Replaced the bottom row of lockers (20 lockers) with push-button keypad models at 900-1000mm height. Added lower coat hooks in the changing area.',
      outcome: 'Members with mobility and dexterity conditions could now use the lockers independently. The keypad locks were popular with all members.',
      cost: '$2,800 (20 locker conversions)',
      timeframe: '3 days'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hostel',
      scenario: 'A hostel had round door knobs, high light switches (1300mm), and no accessible coat hooks in dormitory rooms.',
      solution: 'Replaced door knobs with lever handles, installed rocker switches at 1000mm in accessible rooms, and added lower coat hooks. Total cost was modest across four accessible rooms.',
      outcome: 'Guests with mobility conditions reported a much-improved experience. The hostel received positive reviews mentioning the accessible room details.',
      cost: '$600 (4 rooms)',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Aquatic Centre',
      scenario: 'An aquatic centre had coin-operated lockers at varying heights (500-1800mm) with small twist mechanisms. Many patrons could not use the upper or lower lockers.',
      solution: 'Installed a new locker bank with RFID wristband access. All locks at 900-1000mm height, operated by tapping a waterproof wristband. Wristbands issued at reception.',
      outcome: 'Universal design solution eliminated all access barriers. Locker complaints dropped to zero.',
      cost: '$12,000 (full locker replacement)',
      timeframe: '2 weeks'
    }
  ],

  resources: [
    {
      title: 'AS1428.1:2021 Controls and Operating Mechanisms',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Section 13 specifies height ranges, operability requirements, and clear floor space for controls.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Universal Design Principles: Controls',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on applying universal design principles to controls and switches in public buildings.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Arthritis-Friendly Design Guide',
      url: 'https://www.arthritisaustralia.com.au/',
      type: 'guide',
      source: 'Arthritis Australia',
      description: 'Practical guidance on designing controls, handles, and switches that work for people with arthritis and limited hand dexterity.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['controls', 'coat hooks', 'lockers', 'lever handle', 'power point', 'reach range', 'one-hand operation', 'dexterity', 'switches', 'height', 'storage']
},

// ─── Entry 6: Lighting for comfort and safety ───
{
  questionId: '3.3-1-1',
  questionText: 'Is the lighting in your venue adequate for people with low vision?',
  moduleCode: '3.3',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Lighting for comfort and safety',
  coveredQuestionIds: ['3.3-D-1', '3.3-D-2', '3.3-D-3', '3.3-D-15'],
  summary: 'Good lighting supports people with low vision, reduces fall risk for everyone, and creates a safer environment. General areas need at least 150 lux, task areas need 300 lux, and transitions between bright and dark areas should be gradual to allow eyes to adjust.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'For the estimated 575,000 Australians with low vision, lighting is the single biggest environmental factor affecting their ability to navigate, read signs, recognise faces, and avoid hazards. Poor lighting increases fall risk for elderly visitors and creates trip hazards that sighted people would normally avoid. Glare from reflective surfaces or unshielded lights can be painful and blinding for people with conditions like cataracts, macular degeneration, or photosensitivity. Sudden transitions between bright and dark areas (e.g. stepping from bright sunlight into a dim lobby) cause temporary blindness that lasts 20-30 seconds.',
    statistic: {
      value: '575,000',
      context: 'Australians have low vision that cannot be fully corrected with glasses or contact lenses. Good lighting is their primary environmental support.',
      source: 'Vision Australia'
    },
    quote: {
      text: 'When I step from bright sunshine into a dark restaurant, I am completely blind for about 30 seconds. If someone does not guide me, I will bump into furniture or fall.',
      attribution: 'Person with macular degeneration, Vision Australia feedback'
    }
  },

  tips: [
    {
      icon: 'Sun',
      text: 'Maintain minimum 150 lux in general circulation areas and 300 lux at task points.',
      detail: 'General areas include corridors, lobbies, and dining rooms. Task areas include reception desks, menus, information boards, and wayfinding signs. Use a lux meter app on a smartphone for a quick indicative reading.',
      priority: 1
    },
    {
      icon: 'Contrast',
      text: 'Reduce glare by using matte surfaces, diffused lighting, and shielded fixtures.',
      detail: 'Glossy floors, glass tabletops, and unshielded downlights create glare that is painful for people with photosensitivity. Replace glossy surfaces with matte finishes and use frosted or diffused light fittings rather than exposed bulbs.',
      priority: 2
    },
    {
      icon: 'Layers',
      text: 'Create gradual lighting transitions between indoor and outdoor areas.',
      detail: 'Place a transitional zone at entrances (such as a covered verandah or well-lit foyer) where lighting is between outdoor and indoor levels. This gives eyes time to adjust, reducing the temporary blindness that comes from sudden changes.',
      priority: 3
    },
    {
      icon: 'SlidersHorizontal',
      text: 'Provide adjustable lighting where practical, such as dimmers or task lamps.',
      detail: 'Not everyone needs the same amount of light. Some conditions (like migraines or photosensitivity) require less light, while low vision requires more. Dimmers and individual task lamps give customers control.',
      priority: 4
    },
    {
      icon: 'Lightbulb',
      text: 'Use warm white (3000-4000K) LED lighting for the best balance of visibility and comfort.',
      detail: 'Cool white (above 5000K) lighting can feel harsh and cause glare. Very warm light (below 2700K) makes reading difficult. The 3000-4000K range provides good colour rendering and comfortable brightness.',
      priority: 5
    },
    {
      icon: 'ArrowDown',
      text: 'Light stairways, ramps, and level changes to at least 200 lux.',
      detail: 'Level changes are high-risk areas. Illuminate the edges of stairs and ramps directly, and ensure the nosings (front edges) are marked with a contrasting strip. Shadow-free lighting prevents misjudging step depth.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing lighting levels throughout your venue',
    steps: [
      {
        text: 'Measure lighting in general circulation areas (corridors, lobbies, main floor).',
        measurement: { target: 'General circulation lighting', acceptable: 'Minimum 150 lux', unit: 'lux' }
      },
      {
        text: 'Measure lighting at task areas (reception desk, menus, information boards, signage).',
        measurement: { target: 'Task area lighting', acceptable: 'Minimum 300 lux', unit: 'lux' }
      },
      {
        text: 'Measure lighting on stairways, ramps, and level changes.',
        measurement: { target: 'Stairway/ramp lighting', acceptable: 'Minimum 200 lux', unit: 'lux' }
      },
      {
        text: 'Measure the transition lighting ratio between the brightest and darkest areas that a visitor passes through consecutively.',
        measurement: { target: 'Transition ratio', acceptable: 'No greater than 10:1 between adjacent areas', unit: 'ratio' }
      },
      { text: 'Walk the venue looking for glare sources: unshielded downlights, reflective floors, glass surfaces in direct sunlight, or bright windows behind service counters.' },
      { text: 'Check for dark spots or shadows along main paths, especially near steps, doorways, and changes in direction.' },
      { text: 'Visit your venue in the evening (if open at night) and repeat measurements. Night conditions may reveal lighting gaps not visible during daylight hours.' },
      { text: 'Check outdoor areas: car park, entrance path, and outdoor seating. Minimum 40 lux for pathways, 80 lux at entrances.' },
      { text: 'Review whether staff can adjust lighting in different zones (dimmers, zone switches) to respond to customer needs.' }
    ],
    tools: ['Lux meter or smartphone lux meter app', 'Tape measure', 'Camera for documenting problem areas', 'Notepad for recording readings'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 10',
      requirement: 'Lighting along accessible paths of travel must provide adequate and uniform illumination. Minimum levels vary by location: 40 lux outdoors, 150 lux in general indoor areas, 200 lux on stairs.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Section 13 recommends enhanced lighting levels of 300 lux at task areas and smooth transitions between light levels.' },
      { code: 'NCC', relevance: 'The NCC references AS1680.0 for lighting design. Emergency lighting requirements are separate and address safe evacuation.' },
      { code: 'Access-to-Premises', relevance: 'Adequate lighting is an implied requirement for accessible paths of travel and signage visibility.' }
    ],
    plainEnglish: 'Your venue needs to be well-lit so people with low vision can navigate safely, read signs, and avoid hazards. Key numbers: 150 lux in corridors, 300 lux at reading points, and smooth transitions between bright and dark areas.',
    complianceNote: 'Lighting requirements apply to new buildings and significant renovations. For existing buildings, improving lighting is usually one of the most cost-effective accessibility upgrades and is a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Improve lighting at key points and reduce glare',
      description: 'Add task lighting at critical points, reduce glare from reflective surfaces, and ensure stairways are well-lit. This targets the highest-impact areas first.',
      resourceLevel: 'low',
      costRange: '$100-800',
      timeRequired: '1-2 days',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Measure current lighting levels at reception, menus/information boards, stairways, and main pathways using a lux meter or smartphone app.',
        'Add plug-in task lamps at reception, information desks, and menu-reading areas where levels are below 300 lux.',
        'Replace any exposed or unshielded bulbs with frosted or diffused fittings to reduce glare.',
        'Apply anti-glare film to glass surfaces that catch direct sunlight (e.g. glass tabletops, display cabinets).',
        'Add clip-on or adhesive LED strips to illuminate stair nosings and ramp edges.',
        'Replace any bulbs in customer areas with warm white LEDs (3000-4000K, high CRI) for better visibility and comfort.'
      ],
      notes: 'LED replacement bulbs are energy-efficient and pay for themselves in reduced electricity costs within months.'
    },
    {
      title: 'Upgrade lighting zones and install dimmers',
      description: 'Install a zoned lighting system with dimmers so staff can adjust lighting levels in different areas to suit conditions and customer needs.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '3-7 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Engage an electrician to audit current circuits and identify opportunities for zoning.',
        'Install dimmer controls for key zones: entrance/transition area, main floor, task areas, and stairways.',
        'Add additional light fittings where current levels are below minimums, targeting task areas first.',
        'Install a well-lit transition zone at the main entrance (canopy with lighting, or a gradually lit foyer).',
        'Replace reflective flooring in high-glare areas with matte-finish alternatives or apply anti-slip matte coating.',
        'Create a "lighting settings guide" for staff showing recommended levels for daytime, evening, and different event types.',
        'Label each dimmer control clearly so any staff member can operate the system.',
        'Schedule quarterly maintenance to replace any failed or dimming bulbs.'
      ],
      notes: 'Zoned lighting also improves energy efficiency and allows you to create ambiance while maintaining safety standards.'
    },
    {
      title: 'Professional lighting design for accessibility',
      description: 'Commission a lighting designer to create a fully compliant, comfortable lighting scheme that addresses low vision, glare, transitions, and ambiance throughout the venue.',
      resourceLevel: 'high',
      costRange: '$5,000-25,000',
      timeRequired: '2-6 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a lighting designer with accessibility experience to audit the entire venue.',
        'Specify design requirements: minimum lux levels per area, maximum glare ratings, transition zones, and adjustability.',
        'Design a layered lighting scheme: ambient (general illumination), task (reading and working points), accent (wayfinding and hazard highlighting), and emergency (evacuation routes).',
        'Select fittings with high colour rendering index (CRI 90+) and appropriate colour temperature (3000-4000K).',
        'Install the lighting system with automated controls that adjust based on time of day and ambient daylight levels.',
        'Create a smooth transition zone at each entrance where lighting gradually changes between outdoor and indoor levels.',
        'Commission the installation with a formal lux-level audit of every area.',
        'Train staff on the control system and create a maintenance schedule for regular checks.'
      ],
      notes: 'Good lighting design improves the experience for all visitors, not just those with low vision. It can transform the feel of a space while meeting accessibility requirements.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A dimly lit fine-dining restaurant had multiple complaints from older customers who could not read the menu. The low-contrast, small-font menus were compounded by ambient lighting of only 50 lux at tables.',
      solution: 'Added rechargeable LED table lamps (warm white, dimmable) at each table, increasing reading light to 300 lux. Printed a large-print menu on matte card stock. Installed a brighter entry foyer light to smooth the outdoor-indoor transition.',
      outcome: 'Menu complaints stopped entirely. Older diners returned and spent more on wine (they could read the wine list). The table lamps added to the ambiance.',
      cost: '$600 (20 table lamps at $30 each)',
      timeframe: '1 day'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre had very bright outdoor car park lighting (500 lux) transitioning abruptly to a dim entry corridor (30 lux). Older visitors reported feeling disoriented and unsteady.',
      solution: 'Installed a graduated lighting scheme in the entry corridor: 300 lux at the outside door, decreasing gradually to 150 lux at the mall entrance over a 10-metre corridor.',
      outcome: 'Reported falls in the entry corridor dropped by 80% in the following year. All visitors commented on the improved welcome feel.',
      cost: '$3,500',
      timeframe: '1 week'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A museum had very low lighting in gallery spaces (30 lux) to protect artworks, but visitors with low vision could not read labels, navigate safely, or appreciate the exhibits.',
      solution: 'Added focused LED spotlights on labels (300 lux, narrow beam), installed subtle floor-level LED strips along pathways, and provided free handheld magnifier-torch devices at reception for visitors who needed additional light.',
      outcome: 'Visitors with low vision reported a dramatically improved experience. The torch-magnifiers were popular with all age groups.',
      cost: '$4,200 (lighting) + $500 (20 magnifier-torches)',
      timeframe: '2 weeks'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel had bright fluorescent lighting in corridors (harsh glare) but dim lighting in room corridors (80 lux). Guests with migraines found the fluorescent lights painful, while guests with low vision struggled in the dim corridors.',
      solution: 'Replaced fluorescent tubes with diffused LED panels (warm white, no flicker) in corridors, increasing levels to 150 lux without glare. Added bedside reading lamps with adjustable brightness in accessible rooms.',
      outcome: 'Guest complaints about lighting dropped significantly. Energy costs also decreased by 35% due to LED efficiency.',
      cost: '$8,000 (corridor-wide LED retrofit)',
      timeframe: '2 weeks'
    }
  ],

  resources: [
    {
      title: 'AS1428.1:2021 Section 10: Lighting',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Requirements for lighting on accessible paths of travel, including minimum lux levels and uniformity.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Vision Australia: Lighting and Low Vision',
      url: 'https://www.visionaustralia.org/information/living-with-low-vision',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Practical guidance on lighting levels and glare reduction for people with low vision.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS/NZS 1680.0: Interior and Workplace Lighting',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/electrotechnology/el-014/as-slash-nzs--1680-dot-0-colon-2009',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Comprehensive standard for interior lighting design, including recommended lux levels for different space types.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Lighting for Accessible Environments Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Plain-English guidance on creating well-lit, glare-free environments in public buildings.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['lighting', 'lux', 'glare', 'low vision', 'transition', 'brightness', 'dimmer', 'task lighting', 'LED', 'matte', 'stairway lighting', 'photosensitivity']
},

// ─── Entry 7: Sound environment and acoustic management ───
{
  questionId: '3.3-1-3',
  questionText: 'Have you considered the sound environment for people with hearing loss?',
  moduleCode: '3.3',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Sound environment and acoustic management',
  coveredQuestionIds: ['3.3-D-4', '3.3-D-5', '3.3-D-6'],
  summary: 'Background noise makes it extremely difficult for people with hearing loss to follow conversation. Managing acoustics through sound-absorbing materials, zoning noisy equipment, and providing quiet areas supports the 3.6 million Australians with hearing loss.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Hearing aids amplify all sounds, not just the ones you want to hear. In a venue with hard surfaces, background music, air conditioning noise, and crowd chatter, a hearing aid user may hear a wall of distorted sound rather than the person speaking to them. For people without hearing aids who have mild to moderate hearing loss (the majority), noisy environments make communication exhausting. Acoustic management benefits everyone: it reduces fatigue, improves service interactions, and creates a more pleasant atmosphere. A quiet zone gives everyone a place to retreat when they need a break from noise.',
    statistic: {
      value: '3.6 million',
      context: 'Australians have hearing loss. By 2060, this is expected to reach 7.8 million due to population ageing.',
      source: 'Hearing Australia'
    },
    quote: {
      text: 'I stopped going to restaurants because I could not hear my family talking. The music, the clatter, the echoey room. I just sat there smiling and nodding.',
      attribution: 'Person with hearing loss, Hearing Matters Australia survey'
    }
  },

  tips: [
    {
      icon: 'VolumeX',
      text: 'Keep background music at conversation level or lower.',
      detail: 'Background music should be at least 10 dB below normal conversation level (60 dB). If people need to raise their voice to be heard over the music, it is too loud. Consider turning music off during quieter periods or in areas where conversation is the primary activity.',
      priority: 1
    },
    {
      icon: 'Layers',
      text: 'Add sound-absorbing materials to reduce reverberation.',
      detail: 'Hard surfaces (concrete floors, glass walls, metal ceilings) reflect sound and create echo. Acoustic panels, fabric wall hangings, carpet, upholstered furniture, and ceiling baffles all absorb sound. Even adding tablecloths and seat cushions makes a noticeable difference.',
      priority: 2
    },
    {
      icon: 'MapPin',
      text: 'Zone noisy equipment away from conversation areas.',
      detail: 'Coffee machines, blenders, ice machines, and HVAC outlets should be positioned or screened so their noise does not intrude on customer seating. Even partial screening (a wall, partition, or acoustic curtain) helps significantly.',
      priority: 3
    },
    {
      icon: 'Mic',
      text: 'Ensure PA announcements are clear, slow, and repeated.',
      detail: 'PA systems should produce clear speech, not distorted echoes. Position speakers to avoid reflection and use modern digital PA systems with speech enhancement. Repeat important announcements and supplement with visual displays.',
      priority: 4
    },
    {
      icon: 'DoorClosed',
      text: 'Provide at least one quiet zone or low-noise area.',
      detail: 'A quiet zone does not have to be a separate room. It can be a section of the venue away from speakers, kitchen noise, and high-traffic areas. Mark it on your map so visitors can find it easily.',
      priority: 5
    },
    {
      icon: 'Gauge',
      text: 'Measure background noise levels and aim for under 45 dB in conversation areas.',
      detail: 'Use a free smartphone decibel meter app for a quick reading. Normal conversation is 55-65 dB. If background noise exceeds 45 dB, hearing aid users will struggle to distinguish speech from noise.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing the sound environment',
    steps: [
      {
        text: 'Measure background noise in the main customer area when the venue is empty (HVAC, kitchen, equipment only).',
        measurement: { target: 'Background noise (empty)', acceptable: 'Under 40 dB', unit: 'dB' }
      },
      {
        text: 'Measure background noise during normal operating hours (customers, music, equipment).',
        measurement: { target: 'Background noise (operating)', acceptable: 'Under 55 dB in conversation areas', unit: 'dB' }
      },
      {
        text: 'Measure the reverberation time by clapping once sharply and counting how long the echo persists.',
        measurement: { target: 'Reverberation time', acceptable: 'Under 1 second for small rooms, under 1.5 seconds for large spaces', unit: 'seconds' }
      },
      { text: 'Stand at a service counter and try to hold a conversation at normal volume. Can you understand every word? If not, identify the noise source that is interfering.' },
      { text: 'Check the PA system: Play an announcement and listen from the furthest customer area. Is it clear and intelligible, or distorted and echoey?' },
      { text: 'Identify all sources of background noise: music, HVAC, kitchen, coffee machine, traffic, other customers. List each one and rate whether it can be reduced, relocated, or screened.' },
      { text: 'Walk the venue and identify the quietest area. Could this be designated as a quiet zone with a sign or map marker?' },
      { text: 'Check whether staff are aware of noise levels and can adjust music volume or redirect customers to quieter areas on request.' }
    ],
    tools: ['Smartphone decibel meter app (free)', 'Notepad for logging sources', 'Camera for documenting surfaces'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.5',
      section: 'Section 3',
      requirement: 'Venues with PA or amplification systems must manage reverberation and background noise to ensure speech intelligibility. Background noise must not exceed specified levels in areas where communication occurs.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Section 13 recommends acoustic treatments in public buildings to support people with hearing loss.' },
      { code: 'NCC', relevance: 'Part F5 addresses sound insulation requirements for buildings, though primarily between rooms rather than within public spaces.' },
      { code: 'DDA', relevance: 'Noise environments that prevent people with hearing loss from accessing services may constitute indirect discrimination.' }
    ],
    plainEnglish: 'If your venue is too noisy for people with hearing loss to communicate, you may need to reduce background noise, add sound-absorbing materials, and ensure your PA system produces clear speech.',
    complianceNote: 'While there is no specific dB limit mandated for most venues, the DDA requires reasonable adjustments. Acoustic management is generally considered a reasonable step, especially where it also improves the experience for all customers.'
  },

  solutions: [
    {
      title: 'Reduce noise sources and designate a quiet zone',
      description: 'Lower background music, relocate or screen noisy equipment, and identify the quietest area as a designated low-noise zone.',
      resourceLevel: 'low',
      costRange: '$0-300',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Turn background music down by at least 5 dB (or off) in conversation areas. Test with a decibel meter app.',
        'Identify the three loudest equipment sources and check whether they can be moved, screened, or scheduled to operate during quieter periods.',
        'Add soft furnishings where possible: tablecloths, seat cushions, curtains, or fabric wall hangings. These absorb sound at minimal cost.',
        'Designate the quietest area as a "low-noise zone" and add a small sign. Include it on any venue map.',
        'Brief staff to offer the quiet zone to customers who mention hearing difficulty.',
        'Add a note to your website: "Quiet seating available on request."'
      ],
      notes: 'Turning music down or off is free and instantly improves the experience for people with hearing loss. Many venues find that customers actually prefer lower music levels.'
    },
    {
      title: 'Install acoustic panels and upgrade PA clarity',
      description: 'Add acoustic absorption materials to walls and ceilings, and upgrade the PA system for speech clarity.',
      resourceLevel: 'medium',
      costRange: '$1,000-8,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Engage an acoustics supplier to assess reverberation and recommend panel placement.',
        'Install acoustic panels on walls and/or ceiling baffles in areas with hard, reflective surfaces. Target 30-50% wall coverage in the noisiest spaces.',
        'Add carpet or acoustic underlay in conversation areas if currently hard flooring.',
        'Screen noisy equipment (coffee machine, ice machine) with acoustic partitions or enclosures.',
        'Upgrade the PA system to a modern digital model with speech-optimised processing and properly aimed speakers.',
        'Install a visual display (screen or LED sign) near the PA speakers to supplement audio announcements with text.',
        'Measure reverberation and background noise after installation to confirm improvement.'
      ],
      notes: 'Acoustic panels are available in decorative designs that enhance the interior. They do not have to look institutional.'
    },
    {
      title: 'Professional acoustic design and treatment',
      description: 'Commission an acoustic consultant to design a comprehensive sound management solution, including absorption, isolation, PA design, and ongoing monitoring.',
      resourceLevel: 'high',
      costRange: '$8,000-30,000',
      timeRequired: '3-6 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an acoustic consultant to model the current sound environment and identify problem areas.',
        'Specify target noise levels for each zone: under 40 dB in quiet zones, under 50 dB in general areas, under 55 dB in active/social areas.',
        'Design a treatment plan including: wall and ceiling acoustic panels, floor treatments, equipment enclosures, and partition walls.',
        'Design a new PA system with zoned speakers, speech-enhancement processing, and hearing loop integration.',
        'Install acoustic treatments and the new PA system.',
        'Conduct post-installation testing with calibrated equipment to verify target levels are met.',
        'Train staff on the system including zone controls and how to adjust for different event types.',
        'Establish a quarterly noise monitoring schedule to maintain standards over time.'
      ],
      notes: 'Professional acoustic treatment can significantly increase dwell time and customer spending. Research shows customers stay longer and spend more in acoustically comfortable environments.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A trendy cafe with polished concrete floors, exposed brick, and metal ceiling had noise levels exceeding 70 dB during peak hours. Older customers and hearing aid users had stopped visiting.',
      solution: 'Installed decorative acoustic panels on the ceiling (printed with coffee-themed art), added felt pads under chair legs, placed fabric banquette seating along one wall, and turned music down to background level.',
      outcome: 'Noise levels dropped from 70 dB to 52 dB during peak. Older customers returned and several mentioned the improvement specifically. Staff also reported less fatigue.',
      cost: '$4,500',
      timeframe: '1 week'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre received repeated feedback that speakers could not be understood in the main hall due to reverberation. The PA echoed off the hard walls and ceiling.',
      solution: 'Installed ceiling baffles and wall panels covering 40% of surfaces. Upgraded the PA to a line array system with digital speech processing. Added a text captioning display at the front of the room.',
      outcome: 'Speech intelligibility scores rose from 0.45 to 0.82. The centre marketed itself as "acoustically optimised" and attracted more conference bookings.',
      cost: '$22,000',
      timeframe: '4 weeks'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre food court was extremely noisy (75 dB+). Complaints from elderly shoppers and parents of children with autism were frequent.',
      solution: 'Designated one corner as a "quiet dining zone" with acoustic screens, no background music, and carpet tiles. Added acoustic panels to the ceiling above the main food court and reduced PA announcement frequency.',
      outcome: 'The quiet zone became the most popular area. Centre-wide noise levels dropped 8 dB with the ceiling panels alone.',
      cost: '$15,000',
      timeframe: '3 weeks'
    }
  ],

  resources: [
    {
      title: 'AS1428.5: Communication for People who are Deaf or Hard of Hearing',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-5-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Covers acoustic requirements in buildings including reverberation and background noise management.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Hearing Australia: Communication Tips',
      url: 'https://www.hearing.com.au/Hearing-loss/Living-with-hearing-loss/Communication-tips',
      type: 'guide',
      source: 'Hearing Australia',
      description: 'Practical tips for communicating with people with hearing loss, including environmental modifications.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Acoustic Design for Accessible Environments',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on managing noise environments in public buildings to support people with hearing loss.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['sound', 'acoustics', 'noise', 'hearing loss', 'reverberation', 'background music', 'PA system', 'quiet zone', 'decibel', 'acoustic panels', 'echo']
},

// ─── Entry 8: Hearing augmentation systems ───
{
  questionId: '3.3-1-8',
  questionText: 'Do you offer assisted listening devices or hearing augmentation?',
  moduleCode: '3.3',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Hearing augmentation systems',
  coveredQuestionIds: ['3.3-D-7', '3.3-D-8'],
  summary: 'Hearing augmentation systems (hearing loops, FM, or infrared) transmit audio directly to hearing aids or receivers, cutting through background noise. Where a PA or amplification system is installed, hearing augmentation is a legal requirement under the Premises Standards.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'A hearing aid amplifies everything. In a venue with a PA system, a hearing aid user hears the PA, the echo, the crowd, and the air conditioning, all at similar volume. A hearing loop transmits the PA audio directly to their hearing aid via an electromagnetic signal, bypassing the room noise entirely. The result is crystal-clear speech. Most hearing aids sold in Australia have a T-coil (telecoil) that receives loop signals. FM and infrared systems serve those without T-coils by using portable receivers. Without hearing augmentation, venues with PA systems are effectively excluding millions of Australians from understanding announcements, presentations, performances, and counter-service interactions.',
    statistic: {
      value: '3.6 million',
      context: 'Australians have hearing loss, and this is projected to double by 2060. Most hearing aids have T-coils that work with hearing loops.',
      source: 'Hearing Australia'
    },
    quote: {
      text: 'When the hearing loop works properly, it is like someone turned off all the background noise and the speaker is talking directly into my ear. Without it, I understand maybe 30% of what is said.',
      attribution: 'Hearing loop user, Hearing Matters Australia'
    }
  },

  tips: [
    {
      icon: 'Ear',
      text: 'Install hearing loops at all points where a PA or amplification system is used.',
      detail: 'This includes theatres, cinemas, conference rooms, churches, and any venue with speakers. Loops can cover a full room (area loop) or a specific zone (perimeter loop). Both require professional installation and calibration to AS1428.5.',
      priority: 1
    },
    {
      icon: 'Headphones',
      text: 'Provide portable counter loops at reception and service desks.',
      detail: 'A portable counter loop ($300-500) sits on or under the counter and creates a small loop field for one-on-one conversation. Staff speak into the microphone and the audio is transmitted directly to the customer\'s hearing aid. These are easy to set up and require no installation.',
      priority: 2
    },
    {
      icon: 'CheckCircle2',
      text: 'Test your hearing loop at least quarterly and have it professionally serviced annually.',
      detail: 'Hearing loops can fail silently. The loop may be on but producing a weak or distorted signal. Use a loop listener device (a small handheld receiver, about $50) to test the signal strength and quality in different parts of the loop area. Professional testing uses calibrated equipment to measure against AS1428.5 field strength standards.',
      priority: 3
    },
    {
      icon: 'SignpostBig',
      text: 'Display the hearing loop symbol prominently wherever a loop is active.',
      detail: 'The international hearing loop symbol (an ear with a T) must be displayed at the entrance and at the point of use. Include text: "Hearing loop available. Switch hearing aid to T-coil." Signs should be at least A5 size with high contrast.',
      priority: 4
    },
    {
      icon: 'Radio',
      text: 'Offer FM or infrared receivers with headphones for people without T-coils.',
      detail: 'Not all visitors will have hearing aids with T-coils. FM receivers with headphones provide an alternative. Keep a stock of clean receivers at reception and train staff to issue and collect them. Clean ear pads between uses.',
      priority: 5
    },
    {
      icon: 'Users',
      text: 'Train all front-of-house staff to mention the hearing loop proactively.',
      detail: 'Do not wait for customers to ask. Train staff to mention the loop when greeting customers, particularly at reception, ticketing, and service counters: "We have a hearing loop available if that would help." Include this in staff induction.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing hearing augmentation systems',
    steps: [
      { text: 'Identify every area with a PA or amplification system. List them: main hall, conference rooms, chapel, cinema, etc.' },
      { text: 'Check whether a hearing loop is installed in each area. Look for the loop symbol, ask building management, or check the electrical plans.' },
      {
        text: 'Test each loop using a loop listener device. Walk the entire loop area and check for consistent signal strength.',
        measurement: { target: 'Loop field strength', acceptable: '-2 to +2 dB relative to 400mA/m at 1.6m height (per AS1428.5)', unit: 'dB' }
      },
      { text: 'Check when each loop was last professionally tested and serviced. If it has been more than 12 months, schedule a service.' },
      { text: 'Check whether hearing loop signage is displayed at the entrance and at the point of use (e.g. near the stage, at the counter).' },
      { text: 'Check whether portable counter loops are available at reception and service desks. Test them using a loop listener or by asking a hearing aid user.' },
      { text: 'Check whether FM or infrared receivers with headphones are available for people without T-coils. Are they charged, clean, and stored where staff can find them?' },
      { text: 'Ask three front-of-house staff members: "Do we have a hearing loop? Where is it? How do customers use it?" Assess their confidence.' },
      { text: 'Check your website and booking materials. Is hearing augmentation mentioned, and does it specify which system is available and where?' }
    ],
    tools: ['Loop listener device ($50) or smartphone loop testing app', 'Notepad for documenting coverage areas', 'Camera for signage photos'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'Access-to-Premises',
      section: 'Part D3.7',
      requirement: 'Where an inbuilt amplification system is provided, a hearing augmentation system must also be installed. This applies to assembly areas including theatres, cinemas, conference rooms, lecture halls, and places of worship.'
    },
    related: [
      { code: 'AS1428.5', relevance: 'Specifies technical requirements for hearing augmentation systems including loop field strength (400mA/m +/- 3dB), frequency response, and signal-to-noise ratio.' },
      { code: 'NCC', relevance: 'Part D3.7 references the Premises Standards requirement for hearing augmentation where amplification is provided.' },
      { code: 'DDA', relevance: 'Failure to provide hearing augmentation where PA systems exist may constitute discrimination in access to information and services.' }
    ],
    plainEnglish: 'If you have a PA system or speakers, you are legally required to have hearing augmentation (usually a hearing loop). This applies to performance spaces, conference rooms, cinemas, and any venue where sound is amplified for an audience.',
    complianceNote: 'This is a legal requirement, not just best practice. The Premises Standards specifically mandate hearing augmentation where amplification exists. Counter loops at service desks are not legally required but are strongly recommended as a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Install portable counter loops and display signage',
      description: 'Start with affordable portable counter loops at service desks, display the hearing loop symbol, and train staff to offer the service.',
      resourceLevel: 'low',
      costRange: '$300-800',
      timeRequired: '1-2 hours per counter',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Purchase a portable counter loop for each main service desk ($300-500 each from hearing equipment suppliers).',
        'Place the loop pad under or on the counter, plug into a power point, and connect the microphone to the staff position.',
        'Print and display the hearing loop symbol (at least A5 size) at each counter where a loop is available.',
        'Train all counter staff to mention the loop: "We have a hearing loop at this counter if that would help."',
        'Create a brief troubleshooting guide: check power, check microphone connection, test with a loop listener.',
        'Add hearing loop availability to your website accessibility page.',
        'Purchase a loop listener device ($50) and test each loop weekly.'
      ],
      notes: 'Portable counter loops are the fastest, cheapest hearing augmentation you can provide. They make an immediate difference for hearing aid users at service points.'
    },
    {
      title: 'Install a room-wide hearing loop system',
      description: 'Professionally install a hearing loop covering your main assembly or performance space, with signage, testing equipment, and staff training.',
      resourceLevel: 'medium',
      costRange: '$3,000-15,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a qualified hearing loop installer (look for IEC 60118-4 accreditation) to assess your space.',
        'Specify the loop type based on the room: perimeter loop for simple rooms, phased array for large or metal-framed buildings.',
        'Install the loop cable, amplifier, and connection to the PA system.',
        'Commission the loop with field strength testing across the entire coverage area, measured at seated ear height (approximately 1.2m).',
        'Install hearing loop signage at room entrances, near the stage or screen, and at ticketing points.',
        'Purchase a loop listener device and train at least two staff members to test the loop before each event.',
        'Set up a maintenance contract for annual professional testing and calibration.',
        'Add the hearing loop to all marketing materials, booking confirmations, and your website.'
      ],
      notes: 'Metal-framed buildings may cause interference with standard perimeter loops. A phased array design overcomes this but costs more. Always use an accredited installer.'
    },
    {
      title: 'Implement a comprehensive hearing augmentation ecosystem',
      description: 'Install hearing loops in all PA-equipped areas, provide FM/IR receivers, integrate with captioning services, and establish a maintenance and marketing program.',
      resourceLevel: 'high',
      costRange: '$15,000-50,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a hearing augmentation specialist to audit every space with amplification and design a comprehensive system.',
        'Install hearing loops in all assembly areas: main hall, breakout rooms, conference rooms, and any space with a PA.',
        'Install portable counter loops at all service desks, reception, and ticketing points.',
        'Purchase FM or infrared receivers with headphones (at least 5% of the largest room capacity) for visitors without T-coils.',
        'Integrate hearing augmentation with live captioning services (CART or AI-assisted) for major events.',
        'Commission all systems with calibrated testing against AS1428.5.',
        'Train all front-of-house, AV, and event staff on operating and testing the systems.',
        'Establish quarterly staff testing, annual professional servicing, and a replacement schedule for receivers.'
      ],
      notes: 'A comprehensive system positions your venue as a leader in hearing accessibility. Promote it actively. Many organisations specifically seek venues with proven hearing augmentation.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Theatre',
      scenario: 'A community theatre had an old hearing loop installed 15 years ago that had never been tested. Hearing aid users reported no benefit from switching to T-coil.',
      solution: 'Engaged a loop specialist who found the loop cable was damaged and the amplifier was miscalibrated. Replaced the cable, recalibrated the amplifier, and installed new signage. Added a loop listener for pre-show testing.',
      outcome: 'Patrons with hearing aids reported a dramatic improvement. The theatre now tests the loop before every performance.',
      cost: '$2,800 (repair and recalibration)',
      timeframe: '3 days'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A high-end restaurant had no hearing augmentation at the host stand or bar. Customers with hearing aids struggled to communicate their orders and booking details.',
      solution: 'Installed a portable counter loop at the host stand and a second at the bar. Displayed the hearing loop symbol at both points and trained staff to mention it.',
      outcome: 'Regular customers with hearing aids said it transformed their experience. Staff found the loops also helped in noisy periods with all customers.',
      cost: '$700 (two counter loops)',
      timeframe: '1 hour setup'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Chambers',
      scenario: 'Council meetings were broadcast over a PA system but residents with hearing loss could not follow the discussion. Public consultation was effectively excluding people with hearing loss.',
      solution: 'Installed a phased array hearing loop covering the public gallery and council table. Provided 10 FM receivers with headphones for visitors without T-coils. Added live captioning for major meetings.',
      outcome: 'Hearing-impaired residents attended meetings for the first time. Council received positive media coverage for the initiative.',
      cost: '$18,000',
      timeframe: '3 weeks'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel had a hearing loop in its conference room but it was never mentioned in marketing. Conference organisers did not know it existed, and staff could not operate it.',
      solution: 'Added hearing loop information to the conference booking kit, trained AV staff to test the loop before each event, included a "Hearing loop available" line on all conference room signage, and added it to the hotel website.',
      outcome: 'Loop usage increased from near-zero to regular use at most events. Two corporate clients specifically chose the venue for its hearing accessibility.',
      cost: '$0 (existing equipment, just marketing and training)',
      timeframe: '2 days'
    }
  ],

  resources: [
    {
      title: 'AS1428.5:2021 Communication for People who are Deaf or Hard of Hearing',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-5-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary standard for hearing augmentation systems, specifying loop field strength, frequency response, and testing procedures.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Hearing Australia: Hearing Loops',
      url: 'https://www.hearing.com.au/Hearing-loss/Hearing-Devices/Hearing-loops',
      type: 'website',
      source: 'Hearing Australia',
      description: 'Overview of hearing loop technology, how T-coils work, and where to find loops in Australia.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Hearing Link: Loop Testing App',
      url: 'https://www.hearinglink.org/technology/hearing-loops/loop-testing/',
      type: 'tool',
      source: 'Hearing Link',
      description: 'Free app for testing hearing loop signal strength using a smartphone.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'IEC 60118-4 Hearing Loop Standard',
      url: 'https://www.iec.ch/homepage',
      type: 'guide',
      source: 'International Electrotechnical Commission',
      description: 'International standard for hearing loop performance that AS1428.5 references for field strength and signal quality.',
      isAustralian: false,
      isFree: false
    }
  ],

  keywords: ['hearing loop', 'T-coil', 'telecoil', 'hearing augmentation', 'FM system', 'infrared', 'counter loop', 'PA system', 'amplification', 'deaf', 'hard of hearing', 'receiver']
},

// ─── Entry 9: Sensory spaces, kits and support ───
{
  questionId: '3.3-1-6',
  questionText: 'Are sensory kits or supports available for customers and visitors?',
  moduleCode: '3.3',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Sensory spaces, kits and support',
  coveredQuestionIds: ['3.3-1-2', '3.3-1-4', '3.3-1-5', '3.3-1-7', '3.3-D-9', '3.3-D-10', '3.3-D-11', '3.3-D-12'],
  summary: 'Sensory supports include quiet rooms, sensory kits (ear defenders, fidget tools, sunglasses), relaxed sessions, sensory guides, and sensory-friendly signage. Together, they enable people with autism, anxiety, PTSD, dementia, migraines, and other conditions to participate comfortably in your venue.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Sensory processing differences affect a wide range of people. Autism, anxiety, PTSD, dementia, migraines, chronic fatigue, and many other conditions can make standard environments overwhelming. Bright lights, loud sounds, strong smells, crowds, and unpredictable stimuli can trigger distress, pain, or the need to leave immediately. Sensory supports are not just about autism (though 1 in 70 Australians are autistic). They benefit a much broader population. A quiet room, a sensory kit, or a relaxed session can be the difference between someone participating in community life and staying home.',
    statistic: {
      value: '1 in 70',
      context: 'Australians are on the autism spectrum. But sensory sensitivities also affect people with anxiety (2.7 million), PTSD, dementia (nearly 500,000), migraines, and many other conditions.',
      source: 'Autism Awareness Australia; ABS National Health Survey'
    },
    quote: {
      text: 'My daughter is autistic. The only time she has been to the cinema was a relaxed screening. The lights stayed on a little, the sound was lower, and she could move around. She watched the whole film. She still talks about it.',
      attribution: 'Parent, Amaze Victoria feedback'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'Designate a quiet room or calm space away from the main activity.',
      detail: 'A quiet room does not need to be large or specially equipped. A small room with dim lighting, comfortable seating, minimal decoration, and no background noise is sufficient. It should be unlocked, clearly signed, and shown on your venue map. If a dedicated room is not available, a quiet corner with a partition can serve the purpose.',
      priority: 1
    },
    {
      icon: 'Headphones',
      text: 'Create sensory kits with ear defenders, sunglasses, fidget tools, and communication cards.',
      detail: 'A basic kit costs $15-40 per unit. Include noise-cancelling ear muffs (adult and child sizes), tinted sunglasses, two or three fidget items (stress ball, tangle, fidget cube), and a visual communication card ("I need a break", "Too loud", "Help please"). Store kits at reception for easy access. Clean between uses.',
      priority: 2
    },
    {
      icon: 'SunDim',
      text: 'Offer relaxed or sensory-friendly sessions with modified environmental conditions.',
      detail: 'Relaxed sessions reduce sensory stimulation: lower music volume or silence, dimmed but safe lighting levels, reduced crowd numbers (50-70% capacity), freedom to move around and leave without judgment, and trained staff. Schedule them at quieter times such as early morning or mid-week.',
      priority: 3
    },
    {
      icon: 'FileText',
      text: 'Publish a sensory guide or social story for your venue.',
      detail: 'A sensory guide describes the sensory environment in each area (noise level, lighting, smells, textures, crowds) so visitors can prepare. A social story uses photos and simple text to walk through a visit step by step ("When you arrive, you will see...", "The next area is..."). Both are invaluable for autistic visitors and their carers.',
      priority: 4
    },
    {
      icon: 'SignpostBig',
      text: 'Use sensory-friendly signage: simple icons, low-contrast backgrounds, and minimal visual clutter.',
      detail: 'Busy, high-contrast signage with many colours and fonts is itself a sensory stressor. In sensory-sensitive areas, use calm colours, simple icons, and minimal text. Display the sunflower lanyard symbol if your staff are trained to recognise it.',
      priority: 5
    },
    {
      icon: 'RefreshCw',
      text: 'Gather feedback from neurodiverse visitors and update supports regularly.',
      detail: 'Invite autistic adults and parents of autistic children to test your sensory supports and provide feedback. Their lived experience will reveal gaps you cannot identify from outside. Partner with a local autism or disability organisation for ongoing consultation.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing sensory supports at your venue',
    steps: [
      { text: 'Check for a designated quiet room or calm space. Is it signed, unlocked during opening hours, and shown on the venue map?' },
      { text: 'Check whether sensory kits are available. Are they stocked, clean, and accessible at reception? Do staff know to offer them?' },
      { text: 'Review whether you offer relaxed or sensory-friendly sessions. If yes, how often and how are they promoted? If not, identify a suitable time slot.' },
      { text: 'Check whether a sensory guide or social story exists for your venue. Is it available on your website in an easy-to-find location?' },
      { text: 'Walk the venue and rate the sensory intensity of each area: note noise level, lighting brightness, scents (food, cleaning products), visual complexity, and crowd density.' },
      { text: 'Check signage in sensory-sensitive areas. Is it simple, calm, and clear? Are there visual overload points (too many signs, colours, or moving displays)?' },
      { text: 'Ask three front-line staff: "What would you do if a customer was becoming distressed due to sensory overload?" Assess their confidence and knowledge.' },
      { text: 'Check whether your website mentions sensory supports (quiet room, kits, relaxed sessions, sensory guide). Is the information easy to find?' },
      { text: 'Review feedback from the past 12 months for any sensory-related complaints or suggestions.' }
    ],
    tools: ['Smartphone decibel meter app', 'Lux meter app', 'Venue map', 'Sensory kit inventory checklist'],
    estimatedTime: '30-40 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Part 2',
      requirement: 'The DDA prohibits discrimination in the provision of goods and services. Failing to provide reasonable adjustments for sensory sensitivities may constitute indirect discrimination where the adjustment is reasonable in the circumstances.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Section 13 addresses environmental design for people with sensory processing differences, including lighting and acoustic provisions.' },
      { code: 'WCAG2.2-AA', relevance: 'Guideline 2.3 requires content not to cause seizures or physical reactions. This principle extends to physical environments with flashing or rapidly changing stimuli.' }
    ],
    plainEnglish: 'While no specific law requires sensory kits or quiet rooms, the DDA requires reasonable adjustments. Providing sensory supports is generally considered a reasonable and low-cost adjustment, and failing to do so for a venue where sensory overload is a known risk could attract a discrimination complaint.',
    complianceNote: 'Sensory supports are an area of growing expectation. The Hidden Disabilities Sunflower scheme, autism-friendly certifications, and industry awards increasingly recognise venues that provide these supports.'
  },

  solutions: [
    {
      title: 'Create sensory kits and identify a quiet space',
      description: 'Assemble basic sensory kits, designate an existing room or area as a quiet space, and brief staff on sensory awareness.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Assemble 3-5 sensory kits, each containing: noise-cancelling ear muffs (one adult, one child), sunglasses, 2-3 fidget items, and a visual communication card. Use a neutral fabric bag.',
        'Identify the quietest existing room or area in your venue. Clear it of clutter, dim the lighting, add one or two comfortable chairs, and sign it as "Quiet Room" or "Calm Space."',
        'Create a simple hygiene protocol: wipe ear muffs and sunglasses with antibacterial wipes between uses. Replace fidget items when worn.',
        'Brief all front-of-house staff: explain what a sensory kit is, who might use one, and how to offer one without judgment ("We have a sensory kit available if that would be helpful for you").',
        'Add a note to your website: "Sensory kits and a quiet space are available. Ask at reception."',
        'Print a simple venue map showing the quiet room location and include it in the sensory kit bag.'
      ],
      notes: 'Sensory kits are popular with many visitors, not just those with diagnosed conditions. Parents of young children, elderly visitors, and people having a stressful day all appreciate the option.'
    },
    {
      title: 'Launch relaxed sessions and create a sensory guide',
      description: 'Introduce regular relaxed sessions with modified environmental conditions, and create a downloadable sensory guide or social story for your venue.',
      resourceLevel: 'medium',
      costRange: '$200-1,500',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Choose a suitable time slot for relaxed sessions: a quieter period (e.g. first hour on a weekday) works best.',
        'Define environmental modifications for the relaxed session: reduce music to silent or very low, dim lighting to a comfortable level (maintain safety minimum of 100 lux), cap capacity at 50-70%, and remove any loud or sudden stimuli.',
        'Train staff for relaxed sessions: be patient, allow visitors to move around or leave and return, do not rush people, and be prepared to assist with sensory distress calmly.',
        'Create a sensory guide for your venue: walk through each area and describe the sensory environment (noise level, lighting, smells, textures, crowd level). Use photos and simple language. Format as a downloadable PDF and print copies for reception.',
        'For family-focused venues, create a social story: a photo-based step-by-step guide to a visit ("First you arrive at the front door...", "Next you walk to the ticket desk...").',
        'Promote relaxed sessions through local autism organisations (Amaze, Aspect, Autism SA, etc.), carer groups, and your social media.',
        'Gather feedback after the first three sessions and adjust based on what you learn.'
      ],
      notes: 'Relaxed sessions often attract new customers who would never have visited otherwise. They also provide a more comfortable experience for older visitors and anyone who prefers a calmer environment.'
    },
    {
      title: 'Establish a comprehensive sensory inclusion program',
      description: 'Partner with a disability organisation to design, implement, and certify a venue-wide sensory inclusion program, including a purpose-built sensory room, staff certification, and ongoing co-design.',
      resourceLevel: 'high',
      costRange: '$2,000-15,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Partner with an autism or disability organisation (e.g. Amaze, Aspect, or a local disability service) to co-design your sensory inclusion program.',
        'Conduct a sensory audit of the entire venue with input from autistic adults and carers.',
        'Design and fit out a purpose-built sensory or quiet room: low lighting (adjustable), comfortable seating (including a bean bag or cocoon chair), neutral colours, no background noise, and a visual timer for managing breaks.',
        'Develop a comprehensive sensory guide with input from the community, including ratings for each area (noise, light, smell, crowd) and suggested routes for lower sensory exposure.',
        'Train all staff through an accredited sensory awareness program. Provide ongoing refresher training.',
        'Implement the Hidden Disabilities Sunflower scheme so staff can recognise visitors who have identified themselves as needing extra support.',
        'Schedule regular relaxed sessions (at least monthly) and promote them widely.',
        'Apply for autism-friendly or sensory-friendly certification through your partner organisation.'
      ],
      notes: 'Certification programs provide external validation, marketing materials, and ongoing support. They also connect you with a community of visitors who actively seek certified venues.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Cinema',
      scenario: 'A cinema chain wanted to serve autistic customers and families who could not manage regular screenings.',
      solution: 'Introduced weekly "Sensory Friendly Screenings": lights dimmed but not off, sound at 80% volume, no trailers or advertisements, freedom to move around, pre-show social story emailed to ticket holders. Sensory bags available at the candy bar (ear plugs, fidget toy, "I need a break" card).',
      outcome: 'Attendance grew 200% over three years. Many parents reported it was their child\'s first cinema experience. Regular screenings also saw improved sensory awareness from staff.',
      cost: '$500 initial setup (kits and signage)',
      timeframe: 'Monthly sessions, scaling to weekly'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Supermarket',
      scenario: 'A supermarket received requests for a less overwhelming shopping experience from customers with autism and anxiety.',
      solution: 'Introduced "Quiet Hour" on Tuesday mornings: no announcements, no radio, dimmed lighting, no trolley collection, staff avoid restocking busy aisles, and checkout scanners set to silent. Sensory guide available at the entrance showing a map of quieter aisles.',
      outcome: 'Popular with autistic shoppers, elderly customers, and parents with babies. Positive media coverage brought new customers from outside the usual catchment.',
      cost: '$0 (operational adjustment only)',
      timeframe: '1 week to plan and implement'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A children\'s museum had very hands-on, busy exhibits that overwhelmed some children with autism and sensory processing differences.',
      solution: 'Created "Comfort Backpacks" containing noise-cancelling headphones, a weighted lap pad, a visual timer, and a map showing the quiet room location. Fitted out a dedicated sensory room with dim lighting, a bubble tube, and beanbags. Published a detailed social story with photos on their website.',
      outcome: 'Extended average visit length for neurodiverse families by 45 minutes. The sensory room became popular with all families during busy periods.',
      cost: '$5,000 (sensory room fit-out) + $80-100 per backpack kit',
      timeframe: '4 weeks'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Zoo',
      scenario: 'A zoo found their popular animal shows and busy exhibits were overwhelming for some visitors, leading to distressed children and families leaving early.',
      solution: 'Created "Early Explorer" sessions: entry 30 minutes before general opening, keeper talks moved outdoors (better acoustics), quiet space available in education centre, sensory bags provided, and a sensory map rating each zone from "calm" to "busy."',
      outcome: 'Sessions sell out regularly. The zoo developed partnerships with disability schools for educational visits during quiet hours.',
      cost: '$800 (kits, signage, and sensory map)',
      timeframe: 'Once per month initially, now weekly in school holidays'
    }
  ],

  resources: [
    {
      title: 'Amaze: Autism-Friendly Business Resources',
      url: 'https://www.amaze.org.au/creating-connections/autism-friendly/',
      type: 'guide',
      source: 'Amaze Victoria',
      description: 'Comprehensive toolkit for making your business autism-friendly, including sensory kits, quiet rooms, and relaxed sessions.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Autism Spectrum Australia (Aspect): Accessible Environments',
      url: 'https://www.autismspectrum.org.au/',
      type: 'website',
      source: 'Aspect',
      description: 'Resources for creating accessible environments for autistic people, including environmental modifications and staff training.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Hidden Disabilities Sunflower Scheme',
      url: 'https://hdsunflower.com/au/',
      type: 'website',
      source: 'Hidden Disabilities Sunflower',
      description: 'The Sunflower is a discreet way for people with hidden disabilities to indicate they may need extra support. Free for businesses to participate.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Social Stories Template',
      url: 'https://carolgraysocialstories.com/',
      type: 'template',
      source: 'Carol Gray Social Stories',
      description: 'Guidelines and templates for creating social stories. Developed by the creator of the Social Stories method.',
      isAustralian: false,
      isFree: false
    },
    {
      title: 'Arts Access Australia: Relaxed Performances Guide',
      url: 'https://www.artsaccess.com.au/',
      type: 'guide',
      source: 'Arts Access Australia',
      description: 'Guide for running relaxed performances and sensory-friendly events in arts and entertainment venues.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['sensory', 'autism', 'quiet room', 'calm space', 'sensory kit', 'ear defenders', 'fidget', 'relaxed session', 'social story', 'sensory guide', 'neurodiverse', 'sunflower', 'overwhelm', 'sensory-friendly']
},

// ─── Entry 10: Sensory wayfinding and tactile elements ───
{
  questionId: '3.3-D-13',
  questionText: 'Do you use tactile or sensory elements to support wayfinding?',
  moduleCode: '3.3',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Sensory wayfinding and tactile elements',
  coveredQuestionIds: ['3.3-D-14'],
  summary: 'Tactile ground surface indicators (TGSIs), contrasting edges, textured surfaces, and scent-based wayfinding help people with vision impairment navigate independently. These elements supplement visual signage with information that can be felt or sensed through other channels.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Visual signage only works for people who can see it. For the estimated 575,000 Australians with low vision and the 66,000 who are legally blind, wayfinding depends on other senses: touch (tactile indicators under foot or hand), sound (acoustic cues from materials and spaces), and smell (scent landmarks). Tactile ground surface indicators (TGSIs) are the primary navigational aid for people using white canes. Warning TGSIs (dots) alert to hazards like stairs and roads. Directional TGSIs (bars) guide along paths. Without them, a person with vision impairment relies entirely on memory or another person.',
    statistic: {
      value: '66,000',
      context: 'Australians are legally blind, and 575,000 have low vision that cannot be corrected with glasses. Tactile wayfinding is their primary navigation method.',
      source: 'Vision Australia'
    },
    quote: {
      text: 'The tactile indicators are my GPS. Without them, every journey through a building is guesswork. With them, I can walk confidently and independently.',
      attribution: 'White cane user, Guide Dogs Australia feedback'
    }
  },

  tips: [
    {
      icon: 'Footprints',
      text: 'Install warning TGSIs (dot pattern) at the top and bottom of stairs, escalators, and ramps.',
      detail: 'Warning TGSIs extend the full width of the hazard, at least 300mm deep, with the leading edge 300mm back from the stair nosing or ramp start. They must contrast with the surrounding surface by at least 30% luminance.',
      priority: 1
    },
    {
      icon: 'ArrowRight',
      text: 'Install directional TGSIs (bar pattern) along primary paths of travel in open areas.',
      detail: 'Directional TGSIs are elongated bars that run parallel to the direction of travel. They guide people with vision impairment through open spaces (like lobbies and concourses) where there are no walls or edges to follow. Bars should be 600mm wide on the path.',
      priority: 2
    },
    {
      icon: 'Contrast',
      text: 'Mark edges of stairs, ramps, and level changes with contrasting strips.',
      detail: 'A 50-75mm contrasting strip on the nosing (front edge) of each stair tread makes steps visible to people with low vision. Use a colour that contrasts with both the tread and the riser (e.g. yellow or white on dark stairs). Anti-slip strips with contrast serve a dual purpose.',
      priority: 3
    },
    {
      icon: 'Hand',
      text: 'Add tactile information to handrails at stairs and key decision points.',
      detail: 'Handrails at stairs can include raised floor level numbers or Braille indicators. At the top of a stairway, a tactile indicator on the handrail can signal the floor level. This helps people with vision impairment orient themselves in multi-level buildings.',
      priority: 4
    },
    {
      icon: 'TreePine',
      text: 'Use different floor textures and materials to signal changes in area or function.',
      detail: 'Transitioning from carpet to tile can signal the boundary between a corridor and a room. A textured strip along the edge of a wide corridor helps cane users track their position. These cues occur naturally in many buildings and can be enhanced intentionally.',
      priority: 5
    },
    {
      icon: 'Wind',
      text: 'Consider scent and sound landmarks for multisensory wayfinding.',
      detail: 'Distinctive but subtle scents (such as a herb garden near an entrance or coffee near a cafe) create olfactory landmarks. Water features, music from a specific zone, and changes in acoustic properties (open versus enclosed spaces) all provide navigation cues for people with vision impairment.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing tactile wayfinding elements',
    steps: [
      { text: 'Identify every stairway, ramp, and escalator in customer areas. Check for warning TGSIs at the top and bottom of each one.' },
      {
        text: 'Measure the TGSI depth (distance from hazard edge to leading edge of TGSI).',
        measurement: { target: 'TGSI setback from hazard', acceptable: '300mm from stair nosing or ramp start', unit: 'mm' }
      },
      {
        text: 'Measure the luminance contrast between TGSIs and the surrounding floor.',
        measurement: { target: 'TGSI luminance contrast', acceptable: 'Minimum 30%', unit: '%' }
      },
      { text: 'Check for directional TGSIs in open areas (lobbies, concourses, large foyers). Are they present where there are no walls or edges to follow?' },
      {
        text: 'Check stair nosings for contrasting strips.',
        measurement: { target: 'Nosing strip width', acceptable: '50-75mm wide, contrasting with tread and riser', unit: 'mm' }
      },
      { text: 'Walk the venue using a cane or with eyes closed (with a sighted guide for safety). Can you detect changes in floor surface, TGSI lines, and contrasting edges?' },
      { text: 'Check whether TGSIs are in good condition: not worn smooth, not covered by carpet or mats, not cracked or missing.' },
      { text: 'Look for opportunities for sensory landmarks: scent (plants, coffee), sound (water feature, distinct acoustic zones), or texture (changes in flooring material).' }
    ],
    tools: ['Tape measure', 'Luminance contrast meter or smartphone app', 'White cane (for testing)', 'Camera for documentation'],
    estimatedTime: '30-40 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.4.1',
      section: 'Sections 2-5',
      requirement: 'Tactile ground surface indicators must be installed at stairways, ramps, escalators, and overhead obstacles. Warning TGSIs (dot pattern) must be 300mm deep, set back 300mm from the hazard, and have minimum 30% luminance contrast with surrounding surface.'
    },
    related: [
      { code: 'AS1428.1', relevance: 'Section 11 requires luminance contrast on stair nosings (50-75mm strip on leading edge) and handrail extensions at stairways.' },
      { code: 'Access-to-Premises', relevance: 'TGSIs are required at all stairs, ramps, and escalators on accessible paths of travel in buildings covered by the Premises Standards.' },
      { code: 'NCC', relevance: 'Part D3.8 references TGSI requirements for new buildings and significant renovations.' }
    ],
    plainEnglish: 'You must have tactile bumps (dots) at the top and bottom of stairs, ramps, and escalators to warn people with vision impairment. Directional bars guide people through open spaces. Stair edges need contrasting strips. All tactile elements must contrast visually with the floor.',
    complianceNote: 'TGSI requirements are mandatory for new buildings and significant renovations under the Premises Standards. For existing buildings, installing TGSIs is a reasonable adjustment under the DDA, especially at stairs and other fall-risk locations.'
  },

  solutions: [
    {
      title: 'Install TGSIs at stairs and add contrasting nosings',
      description: 'Address the highest-risk locations first by installing warning TGSIs at all stairways and adding contrasting strips to stair nosings.',
      resourceLevel: 'low',
      costRange: '$200-1,500',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'quick-win',
      steps: [
        'Identify every stairway in customer areas, including external steps, internal stairs, and any single steps or level changes.',
        'Purchase adhesive warning TGSI tiles (available from safety supply stores, typically $15-30 per tile).',
        'Install TGSIs at the top and bottom of each stairway: full width of the stair, 300mm deep, with leading edge 300mm back from the nosing.',
        'Ensure TGSI colour contrasts with the floor by at least 30% luminance (e.g. yellow on dark grey concrete).',
        'Apply contrasting anti-slip nosing strips (50-75mm wide) to the leading edge of each stair tread.',
        'Check that existing TGSIs at ramps and escalators are in good condition and replace any worn or damaged ones.'
      ],
      notes: 'Adhesive TGSI tiles are a retrofit solution suitable for existing buildings. They can be installed without modifying the floor structure.'
    },
    {
      title: 'Add directional TGSIs and floor texture variations',
      description: 'Install directional TGSIs in open areas and introduce deliberate floor texture changes to create a tactile navigation system.',
      resourceLevel: 'medium',
      costRange: '$1,500-5,000',
      timeRequired: '3-7 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Map the primary routes through your venue, identifying open areas where there are no walls or edges to follow.',
        'Engage a TGSI contractor to install directional indicators (bar pattern, 600mm wide) along primary routes in open spaces.',
        'Ensure directional TGSIs lead from building entrance to key destinations: reception, lifts, toilets, and main activity areas.',
        'Introduce deliberate floor texture changes at zone boundaries (e.g. carpet in circulation areas, tile in service areas) to create sensory landmarks.',
        'Add tactile floor level indicators to handrails at stairways (raised numbers or Braille plates).',
        'Add a contrasting strip along the edge of corridors where the wall colour does not contrast with the floor.',
        'Test the system with a person who uses a white cane and adjust based on their feedback.'
      ],
      notes: 'Directional TGSIs must comply with AS1428.4.1 for size, spacing, and luminance. Incorrect installation can misdirect rather than guide.'
    },
    {
      title: 'Design a comprehensive multisensory wayfinding system',
      description: 'Commission an access consultant and wayfinding specialist to design a fully integrated tactile, auditory, and olfactory wayfinding system.',
      resourceLevel: 'high',
      costRange: '$10,000-40,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant and wayfinding designer with experience in tactile navigation.',
        'Conduct a wayfinding audit with people with vision impairment to identify navigation barriers and opportunities.',
        'Design a layered wayfinding system: TGSIs for primary navigation, contrasting edges for hazards, texture changes for zones, and sensory landmarks for orientation.',
        'Specify and install compliant TGSIs (warning and directional) throughout the venue.',
        'Introduce auditory wayfinding cues: subtle, consistent sounds at key decision points (e.g. a water feature at the main junction, music in the cafe zone).',
        'Incorporate scent landmarks where appropriate (herb planting near entrances, distinctive materials in key zones).',
        'Install tactile maps at the entrance and at key decision points (raised-relief maps showing the venue layout).',
        'Test the complete system with a group of people with different levels of vision impairment and refine based on feedback.'
      ],
      notes: 'A comprehensive sensory wayfinding system is a standout feature that can position your venue as a leader in inclusive design. It benefits all visitors by creating a richer, more navigable environment.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A museum had an open-plan ground floor with no walls, columns, or floor changes between the entrance and galleries. White cane users could not find their way without a sighted guide.',
      solution: 'Installed directional TGSI trails from the entrance to reception, reception to each gallery, and from galleries to toilets and exits. Added a tactile floor plan at the entrance. Changed flooring material at gallery boundaries to create tactile zones.',
      outcome: 'White cane users could navigate independently for the first time. The museum hosted a "Touch Tour" program that attracted national media attention.',
      cost: '$12,000',
      timeframe: '3 weeks'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Building',
      scenario: 'A council building had stairs at three locations but no TGSIs. A resident with vision impairment fell down a flight of stairs and sustained injuries.',
      solution: 'Installed warning TGSIs at all stairways, contrasting nosing strips on all treads, and directional TGSIs from the entrance to the lift and service counters. Added Braille floor numbers to handrails at each level.',
      outcome: 'No further falls reported. The council rolled out the same approach across all public buildings.',
      cost: '$4,500',
      timeframe: '1 week'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A large hotel had a sprawling ground floor with conference rooms, restaurants, and a pool, all reached through identical beige corridors. Guests with vision impairment regularly got lost.',
      solution: 'Introduced multisensory wayfinding: different carpet textures for each wing, a water feature at the central junction, herb planters outside the restaurant, and directional TGSIs from the lift lobby to key destinations.',
      outcome: 'Guests with vision impairment reported being able to navigate independently for the first time. All guests commented on the improved sense of place and character in each wing.',
      cost: '$18,000',
      timeframe: '5 weeks'
    }
  ],

  resources: [
    {
      title: 'AS1428.4.1: TGSIs',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-4-dot-1-colon-2009',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary standard for tactile ground surface indicators, covering dimensions, patterns, luminance contrast, and placement requirements.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Vision Australia: Orientation and Mobility',
      url: 'https://www.visionaustralia.org/services/orientation-and-mobility',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Information about how people with vision impairment navigate environments and how to support them.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Guide Dogs Australia: Accessible Built Environments',
      url: 'https://www.guidedogsaustralia.com/',
      type: 'guide',
      source: 'Guide Dogs Australia',
      description: 'Resources for designing built environments that support independent navigation by people with vision impairment.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Tactile Maps and Wayfinding Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on tactile maps, raised-relief plans, and multisensory wayfinding in public buildings.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['TGSI', 'tactile', 'warning indicators', 'directional indicators', 'stair nosing', 'contrast', 'white cane', 'vision impairment', 'wayfinding', 'floor texture', 'Braille', 'scent', 'multisensory']
},

// ─── Entry 11: Customer equipment and resources ───
{
  questionId: '3.4-F-1',
  questionText: 'Do you provide any accessibility equipment or resources for customers?',
  moduleCode: '3.4',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Customer equipment and resources',
  coveredQuestionIds: ['3.4-F-2', '3.4-F-3', '3.4-F-4', '3.4-D-1', '3.4-D-6', '3.4-D-7', '3.4-D-8', '3.4-D-9'],
  summary: 'Providing accessibility equipment for customer use (wheelchairs, scooters, hearing loops, magnifiers) removes barriers and enables participation. Equipment should be well-maintained, stored accessibly, available in a range of sizes, and provided equitably without surcharges.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Not everyone brings their own accessibility equipment everywhere they go. A person who can walk short distances may need a wheelchair for a large venue. A visitor with low vision may benefit from a magnifier to read exhibit labels. Providing this equipment shows genuine commitment to inclusion and opens your venue to people who would otherwise not be able to participate. Equipment must be well-maintained (charged, clean, in good repair), stored where staff can access it quickly, available in different sizes (adult, child, larger frames), and offered equitably. Charging extra for accessibility equipment while standard equipment is free creates an unfair barrier.',
    statistic: {
      value: '64%',
      context: 'of people with mobility disability say the availability of loan equipment at a venue significantly influences their decision to visit.',
      source: 'Tourism Research Australia, Accessible Tourism Study'
    },
    quote: {
      text: 'The zoo lent us a wheelchair at reception. My mother had not been to a zoo in ten years. She cried with happiness. That wheelchair cost them nothing extra but it gave us a family day out.',
      attribution: 'Carer, Tourism Australia accessible tourism research'
    }
  },

  tips: [
    {
      icon: 'Wheelchair',
      text: 'Keep at least one wheelchair and one scooter available for loan at larger venues.',
      detail: 'For venues where visitors walk long distances (zoos, museums, shopping centres, airports), loan wheelchairs and scooters are essential. Maintain at least one standard adult wheelchair, one bariatric/wide wheelchair, and one mobility scooter (charged). Smaller venues may need only a wheelchair.',
      priority: 1
    },
    {
      icon: 'Wrench',
      text: 'Maintain equipment regularly: charge batteries, check tyres, clean seats.',
      detail: 'A flat battery or broken footrest makes equipment useless. Schedule weekly checks of all loan equipment. Replace worn parts immediately. Keep a maintenance log for each item.',
      priority: 2
    },
    {
      icon: 'Archive',
      text: 'Store equipment where it can be issued quickly, near the main entrance.',
      detail: 'If equipment is locked in a back shed, visitors must wait while staff find keys and retrieve it. Store near reception or the main entrance where front-line staff can issue it in under two minutes.',
      priority: 3
    },
    {
      icon: 'Scaling',
      text: 'Provide equipment in a range of sizes including children and larger adults.',
      detail: 'A single standard-sized wheelchair does not suit everyone. Stock at least one wider frame (minimum 500mm seat width) for larger adults and child-sized equipment for family venues. Adjustable equipment (e.g. adjustable-width wheelchairs) covers more users with fewer items.',
      priority: 4
    },
    {
      icon: 'Scale',
      text: 'Do not charge extra for accessibility equipment when standard equipment is free.',
      detail: 'If your venue provides free trolleys, baskets, or prams, charging for a wheelchair or scooter creates an equity issue. Where a deposit is needed for security, ensure it is refundable and the same as for other loaned items.',
      priority: 5
    },
    {
      icon: 'Globe',
      text: 'List available equipment on your website so visitors can plan ahead.',
      detail: 'Include what equipment is available, how to reserve it, whether a deposit is required, and any limitations (e.g. weight capacity, battery range). This lets visitors plan their visit with confidence.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing customer accessibility equipment',
    steps: [
      { text: 'List all accessibility equipment currently available for customer use: wheelchairs, scooters, hearing loops, magnifiers, portable ramps, shower chairs, etc.' },
      { text: 'Check the condition of each item. Is it clean, charged (if applicable), and in good working order? Test brakes, tyres, batteries, and adjustable parts.' },
      {
        text: 'Check the range of sizes available.',
        measurement: { target: 'Wheelchair seat width range', acceptable: 'Standard (400-450mm) and wide (500mm+) options', unit: 'mm' }
      },
      { text: 'Time how long it takes to retrieve and issue a piece of equipment from the main entrance. Can it be done in under two minutes?' },
      { text: 'Check your pricing. Is there a charge for accessibility equipment? If so, is it equitable compared with other loaned items (trolleys, prams, audio guides)?' },
      { text: 'Review your maintenance log (or create one if it does not exist). When was each item last serviced? When are batteries due for replacement?' },
      { text: 'Check your website and booking materials. Is available equipment listed? Can visitors reserve items in advance?' },
      { text: 'Ask three front-line staff: "What accessibility equipment do we have? Where is it stored? How do you issue it?" Assess their knowledge and confidence.' }
    ],
    tools: ['Inventory checklist', 'Tape measure for seat widths', 'Battery tester', 'Camera for documentation'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Part 2',
      requirement: 'The DDA requires providers of goods, services, and facilities to make reasonable adjustments to ensure people with disability can access and use their services. Providing loan equipment is a common reasonable adjustment.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'While the Premises Standards focus on the built environment, the DDA obligation to provide reasonable adjustments extends to equipment and services within premises.' },
      { code: 'AS1428.2', relevance: 'Section 25 specifies dimensions and features for accessible equipment including wheelchairs and mobility aids.' }
    ],
    plainEnglish: 'There is no specific law requiring you to provide loan wheelchairs, but providing accessibility equipment is widely recognised as a reasonable adjustment under the DDA. Charging more for accessibility equipment than comparable standard equipment may constitute discrimination.',
    complianceNote: 'The Australian Human Rights Commission considers the nature and size of the business when assessing whether an adjustment is reasonable. Large venues (shopping centres, airports, theme parks) are expected to provide more equipment than small businesses.'
  },

  solutions: [
    {
      title: 'Source and set up basic loan equipment',
      description: 'Acquire a wheelchair and essential aids, establish a storage and issuing system, and list them on your website.',
      resourceLevel: 'low',
      costRange: '$200-800',
      timeRequired: '1-2 days',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Purchase or source a standard adult manual wheelchair. Refurbished models are available from wheelchair suppliers or disability organisations for $150-300.',
        'If budget allows, add a portable magnifier ($20-50), a portable hearing loop ($300-500), and a portable ramp ($150-400).',
        'Designate a storage location near reception or the main entrance where equipment can be accessed within one minute.',
        'Create a simple sign-out register: visitor name, equipment issued, time out, time returned.',
        'Brief all front-of-house staff on available equipment, storage location, and issuing procedure.',
        'Add equipment availability to your website accessibility page: what is available, how to request it, and any booking requirements.'
      ],
      notes: 'Many disability organisations (e.g. Independent Living Centres) sell refurbished wheelchairs at a fraction of new price. Some local councils have equipment lending libraries.'
    },
    {
      title: 'Expand equipment range and establish maintenance program',
      description: 'Build a comprehensive equipment inventory covering different sizes and needs, with a scheduled maintenance program and advance booking system.',
      resourceLevel: 'medium',
      costRange: '$2,000-8,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Audit visitor feedback and staff reports to identify the most requested equipment types and sizes.',
        'Expand inventory to include: standard wheelchair, wide/bariatric wheelchair (500mm+ seat), child wheelchair (if family-oriented), powered scooter (with charger), portable hearing loop, handheld magnifiers, and a portable ramp.',
        'Purchase a storage unit or cabinet near the main entrance for secure, organised equipment storage.',
        'Create a weekly maintenance checklist: charge batteries, check brakes and tyres, clean seats and handles, test hearing loops, replace worn items.',
        'Set up an advance booking system (phone, email, or web form) so visitors can reserve equipment before arrival.',
        'Train staff on equipment operation, maintenance checks, and customer interaction (offer equipment discreetly, without requiring explanation of disability).',
        'Review and update inventory quarterly based on usage data and visitor feedback.'
      ],
      notes: 'Powered scooters are the most expensive item but have the highest impact for large venues. Budget for battery replacement every 1-2 years.'
    },
    {
      title: 'Comprehensive equipment program with fleet management',
      description: 'Establish a professional equipment lending program with fleet management, online booking, GPS tracking for large venues, and partnership with equipment suppliers.',
      resourceLevel: 'high',
      costRange: '$10,000-40,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessible equipment supplier to conduct a needs assessment based on venue size, visitor numbers, and typical visit duration.',
        'Specify a fleet covering all sizes and types: manual wheelchairs (standard and wide), powered scooters (multiple), portable hearing loops, assistive listening devices, magnifiers, and portable ramps.',
        'Set up a fleet management system: asset register, maintenance schedule, battery health tracking, and usage reporting.',
        'Implement online booking through your website and confirmation system.',
        'For large venues (shopping centres, airports, theme parks), consider GPS tracking to manage scooter locations and availability.',
        'Negotiate a maintenance contract with the equipment supplier for regular servicing and emergency repairs.',
        'Train a designated "equipment champion" on each shift who is responsible for daily checks and issuing.',
        'Promote the equipment program through your marketing, disability organisations, and tourism directories.'
      ],
      notes: 'Some equipment suppliers offer lease arrangements that include maintenance, reducing upfront costs and ensuring equipment is always in good condition.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A large zoo had two old wheelchairs in poor condition locked in a maintenance shed. Visitors had to wait up to 20 minutes for staff to retrieve and prepare one.',
      solution: 'Purchased four new wheelchairs (two standard, one wide, one child), two powered scooters, and set up a loan counter at the main gate with a simple sign-out system. Added equipment booking to the website.',
      outcome: 'Equipment loan requests increased from 5 per week to 30. Average visit length for equipment users was 3 hours (matching non-disabled visitors). Positive reviews specifically mentioned the loan equipment.',
      cost: '$6,500',
      timeframe: '2 weeks'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre charged $20/hour for scooter hire while providing trolleys and prams free. A disability advocate raised the equity issue publicly.',
      solution: 'Made all scooter and wheelchair loans free of charge with a refundable $20 deposit (same as trolleys). Added three more scooters to meet demand and installed a charging station near the customer service desk.',
      outcome: 'Scooter usage tripled. The equity issue was resolved, and positive media coverage boosted the centre\'s reputation.',
      cost: '$4,000 (three scooters and charging station)',
      timeframe: '1 week'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Resort',
      scenario: 'A coastal resort had no accessibility equipment. Guests with mobility conditions were confined to the accessible room and main restaurant, missing the pool, beach, and gardens.',
      solution: 'Purchased a beach wheelchair, a pool hoist sling, two manual wheelchairs, and a portable shower chair. Stored all equipment in a purpose-built cupboard near reception. Listed everything on the website with photos.',
      outcome: 'Guests with disability could access the beach and pool for the first time. The resort was featured in an accessible travel blog and received a steady stream of bookings from the disability community.',
      cost: '$5,500',
      timeframe: '2 weeks'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Convention Centre',
      scenario: 'A convention centre hosted events for thousands but had no loan equipment. Attendees with mobility conditions who did not bring their own wheelchair or scooter could not navigate the large venue.',
      solution: 'Partnered with a mobility equipment hire company to provide 10 scooters, 5 wheelchairs, and portable hearing loops for every major event. Equipment was included in the venue hire cost, not charged separately to attendees.',
      outcome: 'Event organisers appreciated the seamless provision. Attendee accessibility satisfaction scores rose from 4.2/10 to 8.8/10.',
      cost: '$3,000 per major event (hire)',
      timeframe: 'Ongoing'
    }
  ],

  resources: [
    {
      title: 'Independent Living Centres Australia',
      url: 'https://ilcaustralia.org.au/',
      type: 'website',
      source: 'ILCA',
      description: 'Advice on selecting and maintaining accessibility equipment. Some centres offer equipment loans or sell refurbished items.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Tourism Australia: Accessible Tourism Equipment',
      url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/building-accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Guidance for tourism operators on providing accessibility equipment to visitors.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Network on Disability: Reasonable Adjustments',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Framework for determining what reasonable adjustments (including equipment provision) are appropriate for your business size and type.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['wheelchair', 'scooter', 'loan equipment', 'magnifier', 'hearing loop', 'portable ramp', 'equipment hire', 'maintenance', 'bariatric', 'sizing', 'equity', 'charging']
},

// ─── Entry 12: Sensory and communication supports ───
{
  questionId: '3.4-D-2',
  questionText: 'Do you provide communication supports for people with speech or language needs?',
  moduleCode: '3.4',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Sensory and communication supports',
  coveredQuestionIds: ['3.4-D-4', '3.4-D-5'],
  summary: 'Communication supports such as picture boards, symbol cards, text-to-speech devices, tactile exhibits, and audio description guides enable people with speech, language, cognitive, or sensory needs to engage with your venue and interact with staff.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Communication is the foundation of every service interaction. When a customer cannot speak, read standard text, or process verbal instructions, they need alternative communication methods. Augmentative and alternative communication (AAC) includes picture boards, symbol cards, text-to-speech apps, and simple gestures. Providing these tools at your venue means a person with aphasia, autism, intellectual disability, or a speech impairment can order food, ask for help, or navigate your space. Audio descriptions and tactile exhibits extend this further, making visual content accessible to people with vision impairment.',
    statistic: {
      value: '1.2 million',
      context: 'Australians have a communication disability. This includes people with speech impairment, aphasia, intellectual disability, autism, and acquired brain injury.',
      source: 'Speech Pathology Australia'
    },
    quote: {
      text: 'I have aphasia from a stroke. When a cafe has a picture menu, I can point to what I want. Without it, I cannot order and I leave.',
      attribution: 'Person with aphasia, Australian Aphasia Association'
    }
  },

  tips: [
    {
      icon: 'Image',
      text: 'Create a communication board with common requests using pictures and symbols.',
      detail: 'A laminated A4 or A3 board with 20-30 common symbols (food items, toilet, help, yes, no, pain, water, quiet) allows people to point to what they need. Use clear, simple icons with text labels underneath. Place boards at reception and service counters.',
      priority: 1
    },
    {
      icon: 'MessageCircle',
      text: 'Train staff to use multiple communication methods: gestures, writing, pointing, patience.',
      detail: 'Staff do not need to be communication experts. They need to be patient, willing to try different approaches, and comfortable with silence. Offer a pen and paper, point to a communication board, use gestures, or ask yes/no questions. Never finish a person\'s sentence for them.',
      priority: 2
    },
    {
      icon: 'Volume2',
      text: 'Provide audio description guides for visual content.',
      detail: 'For museums, galleries, and attractions with visual exhibits, an audio description guide narrates what can be seen, including spatial relationships, colours, and details that sighted visitors take in visually. These can be delivered via an app, a handheld device, or printed Braille/large-print descriptions.',
      priority: 3
    },
    {
      icon: 'Hand',
      text: 'Offer tactile versions of key exhibits or products where possible.',
      detail: 'Touchable scale models, tactile diagrams, or handling objects allow people with vision impairment to experience content that is otherwise visual-only. Even one or two tactile elements per exhibition make a significant difference.',
      priority: 4
    },
    {
      icon: 'Smartphone',
      text: 'Point customers to free communication apps on their own devices.',
      detail: 'Apps like Proloquo2Go, TouchChat, and the free NHS AAC app turn a smartphone or tablet into a communication device. Staff should know about these options and be ready to allow extra time for customers who use them.',
      priority: 5
    },
    {
      icon: 'FileText',
      text: 'Provide picture menus, visual schedules, and icon-based wayfinding.',
      detail: 'A menu with photos of each dish, a visual schedule of the day\'s events, or directional signs with universal icons all support people with cognitive or language differences. They also help visitors who speak languages other than English.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing communication and sensory supports',
    steps: [
      { text: 'Check whether a communication board or picture card set is available at reception and service counters.' },
      { text: 'Review your menu or product information. Is a picture version available? Can customers point to items rather than speaking or reading?' },
      { text: 'Check whether audio description is available for visual exhibits, performances, or tours. How is it delivered (app, device, live describer)?' },
      { text: 'Identify any tactile or touchable elements available in your venue (scale models, handling objects, tactile diagrams).' },
      { text: 'Ask three staff members: "How would you communicate with a customer who cannot speak?" Assess their confidence and the strategies they suggest.' },
      { text: 'Check your wayfinding for icon use. Can a person who cannot read English navigate using pictures and symbols alone?' },
      { text: 'Review your website. Is communication support mentioned? Can visitors request specific supports in advance?' },
      { text: 'Check whether staff have been trained in basic communication strategies (gestures, writing, patience, yes/no questions).' }
    ],
    tools: ['Communication board examples (downloadable from communication charities)', 'Notepad for audit', 'Camera'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Part 2',
      requirement: 'The DDA requires reasonable adjustments to ensure equal access to services. Communication supports (boards, picture menus, audio descriptions) are recognised as reasonable adjustments for people with communication disability.'
    },
    related: [
      { code: 'WCAG2.2-AA', relevance: 'Digital communication supports (apps, audio descriptions) should meet WCAG AA standards for accessibility.' },
      { code: 'AS1428.2', relevance: 'Section 16 addresses communication provisions in buildings, including signage, audio, and tactile elements.' }
    ],
    plainEnglish: 'You should provide ways for people who cannot speak, read, or see standard content to communicate with your staff and engage with your venue. Communication boards, picture menus, audio description, and tactile elements are common solutions.',
    complianceNote: 'The level of communication support expected depends on your venue type and size. A museum is expected to offer audio description; a small cafe may only need a picture menu and a willingness to use pen and paper.'
  },

  solutions: [
    {
      title: 'Create a communication board and picture menu',
      description: 'Design and print a communication board for service interactions and a picture version of your menu or key information.',
      resourceLevel: 'low',
      costRange: '$0-100',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Download a free communication board template from Scope Australia, Communication Matters, or the AAC Institute.',
        'Customise the board with symbols relevant to your venue: common items (food, drink, toilet), requests (help, quiet, slow down), responses (yes, no, more, stop), and navigation (exit, this way, wait).',
        'Print the board on A3 card stock and laminate it. Make at least two copies (reception and main service counter).',
        'Create a picture menu or information sheet with photos of each item/service alongside text labels.',
        'Brief staff: show them the board, explain who might use it, and practice a mock interaction.',
        'Add a note to your accessibility page: "Communication boards available at reception."'
      ],
      notes: 'Scope Australia and Communication Matters provide free, downloadable communication board templates that can be customised for different business types.'
    },
    {
      title: 'Develop audio description and tactile resources',
      description: 'Create audio description guides for visual content and introduce tactile elements for key exhibits or products.',
      resourceLevel: 'medium',
      costRange: '$500-5,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Identify the visual content that would most benefit from audio description: key exhibits, artworks, products, menus, or performance elements.',
        'Write audio description scripts: describe what can be seen including spatial layout, colours, sizes, textures, and details. Use clear, concise language.',
        'Record the scripts as audio files and make them available via a free app (e.g. a QR code linking to audio files) or handheld devices loaned at reception.',
        'Commission one or two tactile elements: a scale model of your venue, a tactile version of a key exhibit, or handling objects that represent visual content.',
        'Train staff to offer audio description and tactile resources proactively to visitors with vision impairment.',
        'Promote audio description and tactile resources on your website and at the entrance.',
        'Gather feedback from users and refine the content based on their experience.'
      ],
      notes: 'Audio description does not require professional narrators. Clear, well-written scripts recorded by a staff member with a good speaking voice work well.'
    },
    {
      title: 'Comprehensive communication accessibility program',
      description: 'Implement a venue-wide communication accessibility program including multiple AAC options, professional audio description, tactile exhibits, and staff training certified by a speech pathologist.',
      resourceLevel: 'high',
      costRange: '$5,000-25,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a speech pathologist to audit your venue for communication accessibility and recommend a tailored program.',
        'Develop a suite of AAC resources: communication boards (venue-specific), picture menus, visual schedules, symbol-based wayfinding, and digital AAC options.',
        'Commission professional audio description for all major exhibits, performances, or tours, delivered via app and handheld devices.',
        'Create a tactile exhibit program with scale models, handling objects, and raised-relief diagrams at key points.',
        'Deliver certified communication accessibility training to all staff, covering AAC, patience strategies, and interaction with people with different communication needs.',
        'Install Auslan (Australian Sign Language) video relay at reception for Deaf visitors.',
        'Promote the full program through disability organisations, tourism channels, and your website.',
        'Review and update all communication resources annually in consultation with people with communication disability.'
      ],
      notes: 'A comprehensive program positions your venue as a communication-accessible leader. It also benefits tourists with limited English, young children, and anyone who processes information differently.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A cafe had a text-only chalkboard menu. Customers with intellectual disability, aphasia, or limited English could not order independently.',
      solution: 'Created a laminated picture menu with photos of every item, plus a communication board at the counter with common requests (water, toilet, bill, help). Trained staff to be patient and allow pointing.',
      outcome: 'Several regular customers with disability began ordering independently for the first time. Staff reported that the picture menu also helped international tourists.',
      cost: '$80 (printing and laminating)',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'An art gallery had no audio description. Visitors with vision impairment could not access any of the artwork.',
      solution: 'Wrote audio descriptions for the 20 key works in the permanent collection and recorded them as MP3 files. Created QR codes on large-print labels next to each work that link to the audio. Provided two handheld audio players at reception for visitors without smartphones.',
      outcome: 'Visitors with vision impairment could engage with the gallery for the first time. The gallery was invited to present their approach at a state museum conference.',
      cost: '$1,200 (writing, recording, QR labels, two players)',
      timeframe: '3 weeks'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Customer Service',
      scenario: 'A council customer service centre had no communication supports. Residents with communication disability (aphasia, intellectual disability, autism) could not access services without a carer present.',
      solution: 'Installed communication boards at every service window, trained all staff in basic AAC use, provided a tablet with a communication app at the information desk, and offered Auslan video relay via a dedicated screen.',
      outcome: 'Residents with communication disability reported being able to access council services independently. Staff confidence in communicating with diverse customers increased significantly.',
      cost: '$3,500 (boards, tablet, training, video relay subscription)',
      timeframe: '4 weeks'
    }
  ],

  resources: [
    {
      title: 'Scope Australia: Communication Boards',
      url: 'https://www.scopeaust.org.au/services/communication/',
      type: 'template',
      source: 'Scope Australia',
      description: 'Free downloadable communication board templates for different business types.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Speech Pathology Australia: AAC Resources',
      url: 'https://www.speechpathologyaustralia.org.au/',
      type: 'guide',
      source: 'Speech Pathology Australia',
      description: 'Resources for understanding augmentative and alternative communication (AAC) and its application in community settings.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Audio Description Australia',
      url: 'https://www.audiodescription.com.au/',
      type: 'guide',
      source: 'Audio Description Australia',
      description: 'Guidance and services for providing audio description in Australian venues.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Communication Matters: AAC Guide',
      url: 'https://www.communicationmatters.org.uk/',
      type: 'guide',
      source: 'Communication Matters UK',
      description: 'Comprehensive guide to AAC types, selection, and implementation (UK-based but applicable).',
      isAustralian: false,
      isFree: true
    }
  ],

  keywords: ['communication board', 'AAC', 'picture menu', 'audio description', 'tactile', 'speech impairment', 'aphasia', 'symbol cards', 'Auslan', 'sign language', 'text-to-speech']
},

// ─── Entry 13: Aquatic access and pool equipment ───
{
  questionId: '3.4-D-10',
  questionText: 'If you have aquatic facilities, are they accessible?',
  moduleCode: '3.4',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Aquatic access and pool equipment',
  coveredQuestionIds: ['3.4-D-11', '3.4-D-12', '3.4-D-13'],
  summary: 'Accessible aquatic facilities include pool hoists or lifts, graduated (zero-depth) entry, beach wheelchairs, accessible change facilities, and water-safe mobility aids. These enable people with disability to enjoy swimming, hydrotherapy, and beach or waterpark activities.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Water-based activities (swimming, hydrotherapy, beach visits) are among the most therapeutic and enjoyable experiences for people with disability. The buoyancy of water reduces pain, supports movement, and provides sensory regulation. Yet aquatic facilities are often the least accessible part of a venue. Steep pool ladders, raised spa edges, soft sand, and a lack of hoists or ramps mean many people simply cannot get into the water. Accessible change rooms with hoists, adult-sized change tables, and non-slip surfaces are equally important. Without them, the water may be accessible but the preparation process is not.',
    statistic: {
      value: '85%',
      context: 'of Australians live within 50km of the coast. Beach and pool access is central to Australian culture, yet most beaches and many pools lack accessible entry.',
      source: 'Geoscience Australia'
    },
    quote: {
      text: 'My son is 15 and loves water. But there is no hoist at our local pool and he is too heavy for me to lift in. He watches from his wheelchair while other kids swim.',
      attribution: 'Parent of child with disability, Disability Advocacy NSW'
    }
  },

  tips: [
    {
      icon: 'Waves',
      text: 'Install a pool hoist or lift at the main pool and spa.',
      detail: 'A ceiling-mounted or deck-mounted pool hoist allows a person to transfer from their wheelchair into a sling and be lowered into the water. Fixed-track ceiling hoists are the most reliable and easy to use. Portable pool lifts are an alternative where fixed installation is not feasible. Ensure the hoist is rated for at least 150kg.',
      priority: 1
    },
    {
      icon: 'ArrowDown',
      text: 'Provide zero-depth (graduated/beach-style) entry to at least one pool.',
      detail: 'A zero-depth entry slopes gradually from the pool deck into the water, allowing wheelchair users to roll in. This is the gold standard for pool access and benefits everyone: families with small children, elderly swimmers, and people recovering from injuries.',
      priority: 2
    },
    {
      icon: 'Accessibility',
      text: 'Offer beach wheelchairs for sand and water access.',
      detail: 'Beach wheelchairs have wide, balloon tyres that float on sand and shallow water. They can be purchased ($1,500-3,000) or hired. Store them near the beach access point and promote availability on your website.',
      priority: 3
    },
    {
      icon: 'DoorOpen',
      text: 'Provide accessible change facilities with a hoist and adult-sized change table.',
      detail: 'Standard accessible toilets are often too small for aquatic facility change needs. A Changing Places facility (or equivalent) includes a ceiling hoist, adult-sized change table (1800mm x 700mm), adequate space for a carer, and a non-slip floor with floor drain.',
      priority: 4
    },
    {
      icon: 'ThermometerSun',
      text: 'Ensure pool temperature information is available for people with temperature sensitivity.',
      detail: 'Some medical conditions (multiple sclerosis, some heart conditions) are affected by water temperature. Display current pool temperatures prominently and include them on your website.',
      priority: 5
    },
    {
      icon: 'ShieldCheck',
      text: 'Train lifeguards and pool staff in disability-specific water safety.',
      detail: 'Staff should know how to operate the pool hoist, assist transfers safely, recognise signs of distress in swimmers with disability, and understand the specific risks (e.g. reduced sensation, fatigue, seizure risk). Royal Life Saving Australia offers disability-specific training.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing aquatic accessibility',
    steps: [
      { text: 'Check for pool hoist or lift access. Is there a working hoist at the main pool and spa? When was it last serviced and tested?' },
      {
        text: 'Check the hoist weight capacity.',
        measurement: { target: 'Pool hoist capacity', acceptable: 'Minimum 150kg', unit: 'kg' }
      },
      { text: 'Check for zero-depth or graduated entry. Is there a sloped entry to any pool? If not, how do wheelchair users access the water?' },
      { text: 'Check for beach wheelchair availability (if beachfront venue). Where is it stored? How do visitors request it?' },
      {
        text: 'Assess the accessible change facility. Does it have a hoist, adult change table, and adequate space?',
        measurement: { target: 'Change table dimensions', acceptable: 'Minimum 1800mm x 700mm, height-adjustable preferred', unit: 'mm' }
      },
      { text: 'Check the path from the change facility to the pool edge. Is it non-slip, level, and free of obstacles?' },
      { text: 'Check whether pool temperature is displayed and available on the website.' },
      { text: 'Ask lifeguard or pool staff: "How do you assist a wheelchair user into the pool? When was the hoist last tested?" Assess their confidence.' },
      { text: 'Review your website and promotional materials. Is aquatic accessibility mentioned? Are hoist, beach wheelchair, and entry options described?' }
    ],
    tools: ['Checklist', 'Tape measure', 'Camera for documentation', 'Hoist maintenance log'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 16',
      requirement: 'Where swimming pools are provided for public use, an accessible means of entry to the water must be provided. This includes a hoist, ramp, or graduated entry.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'The Premises Standards require accessible facilities wherever the public has access, including aquatic facilities.' },
      { code: 'NCC', relevance: 'Part D3.10 addresses accessible swimming pool provisions in new buildings.' },
      { code: 'DDA', relevance: 'Failing to provide accessible pool entry where it is a core service (e.g. aquatic centres, resorts) may constitute discrimination.' }
    ],
    plainEnglish: 'If you have a pool or aquatic facility that the public uses, you need to provide a way for wheelchair users to get into the water. This is usually a hoist, a ramp, or a zero-depth entry.',
    complianceNote: 'Pool hoists and graduated entries are required in new aquatic facilities. For existing facilities, installing a portable hoist is usually a reasonable adjustment under the DDA. Beach access is not specifically covered by building codes but is increasingly expected under DDA obligations.'
  },

  solutions: [
    {
      title: 'Install a portable pool hoist and improve change facilities',
      description: 'Purchase a portable pool hoist for the main pool and upgrade the nearest accessible change room with non-slip surfaces and a bench.',
      resourceLevel: 'low',
      costRange: '$2,000-5,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Research portable pool hoist options suitable for your pool edge design. Battery-operated models are most versatile ($2,000-4,000).',
        'Ensure the pool deck is strong enough to support the hoist plus user weight (minimum 200kg combined).',
        'Install or position the hoist at the widest section of the pool edge, away from the deep end.',
        'Provide at least two sling sizes (standard and large) and store them hygienically.',
        'Upgrade the nearest accessible change room: install grab rails near the shower, add a fold-down bench (if no adult change table), and apply non-slip floor coating.',
        'Train all pool staff on hoist operation, sling fitting, and safe transfer techniques.',
        'Add pool hoist availability to your website and signage at the pool entrance.'
      ],
      notes: 'Portable hoists can be moved between pools if you have multiple facilities. They are also useful for spa access.'
    },
    {
      title: 'Add beach wheelchair and zero-depth pool access',
      description: 'Purchase a beach wheelchair for sand/water access and construct a graduated (zero-depth) entry to one pool.',
      resourceLevel: 'medium',
      costRange: '$5,000-25,000',
      timeRequired: '2-6 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Purchase a beach wheelchair with balloon tyres ($1,500-3,000). Choose a model that is also submersible for shallow water use.',
        'Designate a beach access point with a firm surface mat or boardwalk from the car park or path to the sand.',
        'Store the beach wheelchair near the access point with clear signage and a simple booking system.',
        'For pool access, engage a pool contractor to design a zero-depth (graduated) entry to one pool. The slope should be no steeper than 1:14.',
        'Install non-slip surface treatment on the ramp and surrounding pool deck.',
        'Add handrails on both sides of the graduated entry.',
        'Promote beach and pool access on your website with photos showing the wheelchair and entry options.'
      ],
      notes: 'Zero-depth entries are a significant construction project for existing pools but are standard in new pool designs. They benefit all users and reduce the need for hoists.'
    },
    {
      title: 'Comprehensive aquatic accessibility upgrade',
      description: 'Design and implement a fully accessible aquatic facility including multiple entry options, Changing Places facility, beach access, and staff training program.',
      resourceLevel: 'high',
      costRange: '$30,000-150,000',
      timeRequired: '2-6 months',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant and pool designer to audit the entire aquatic facility.',
        'Design and install zero-depth entries on at least one pool and the spa.',
        'Install fixed-track ceiling hoists at the main pool and spa for transfer from wheelchair to water.',
        'Build or upgrade to a Changing Places facility: ceiling hoist, adult change table (height-adjustable), privacy screen, shower with adjustable-height nozzle, and non-slip floor with drain.',
        'Construct an accessible beach access system: boardwalk, matting, and a beach wheelchair fleet.',
        'Train all aquatic staff through Royal Life Saving Australia disability water safety program.',
        'Develop partnerships with local disability organisations for regular accessible swim sessions.',
        'Market the facility as a fully accessible aquatic destination through tourism and disability channels.'
      ],
      notes: 'Accessible aquatic facilities attract significant visitation from people with disability, their families, and rehabilitation groups. The investment often generates a strong return through increased usage.'
    }
  ],

  examples: [
    {
      businessType: 'health-wellness',
      businessTypeLabel: 'Aquatic Centre',
      scenario: 'A council aquatic centre had no pool hoist. The only access was via a steep ladder. Disability groups had to cancel hydrotherapy bookings.',
      solution: 'Installed a battery-powered portable pool hoist at the main pool and a smaller hoist at the hydrotherapy pool. Added a fold-down change bench in the accessible change room. Trained all lifeguards on hoist operation.',
      outcome: 'Hydrotherapy bookings resumed immediately. Individual wheelchair users could access the pool for the first time. Usage by people with disability increased from 2% to 12% of total visits.',
      cost: '$7,500 (two hoists and bench)',
      timeframe: '2 weeks'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Beach Resort',
      scenario: 'A beachside resort had no way for guests with mobility disability to access the beach or the pool. The beach was 50m of soft sand and the pool had a ladder.',
      solution: 'Purchased two beach wheelchairs, installed a boardwalk mat from the path to the waterline, and added a portable pool hoist. Created a "Beach Butler" service where staff assist with wheelchair transfers and positioning.',
      outcome: 'The resort became known as a leading accessible beach destination. Bookings from the disability community increased 40% in the first year.',
      cost: '$8,000 (wheelchairs, matting, hoist)',
      timeframe: '3 weeks'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Municipal Pool',
      scenario: 'A 30-year-old municipal pool had no accessible entry, no Changing Places facility, and lifeguards with no disability training.',
      solution: 'Major renovation included a zero-depth entry on the 25m pool, a ceiling hoist at the deep end, a Changing Places room, and staff training through Royal Life Saving. Also added a weekly "Accessible Swim" session with extra staff.',
      outcome: 'The pool became the most popular aquatic venue for disability groups in the region. School groups with students with disability booked regularly.',
      cost: '$120,000 (as part of a broader renovation)',
      timeframe: '4 months'
    }
  ],

  resources: [
    {
      title: 'Royal Life Saving Australia: Disability Aquatic Programs',
      url: 'https://www.royallifesaving.com.au/',
      type: 'guide',
      source: 'Royal Life Saving Australia',
      description: 'Training and resources for making aquatic facilities accessible, including staff training in disability water safety.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Changing Places Australia',
      url: 'https://changingplaces.org.au/',
      type: 'website',
      source: 'Changing Places',
      description: 'Design guide and directory for Changing Places facilities, including aquatic centre requirements.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Beach Access Information',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Information about beach wheelchairs, beach matting, and making coastal venues accessible.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['pool', 'hoist', 'aquatic', 'beach wheelchair', 'zero depth', 'graduated entry', 'changing places', 'swimming', 'hydrotherapy', 'spa', 'water access', 'lifeguard']
},

// ─── Entry 14: Digital connectivity and device charging ───
{
  questionId: '3.4-D-14',
  questionText: 'Is WiFi or internet access available for customers who rely on digital accessibility tools?',
  moduleCode: '3.4',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Digital connectivity and device charging',
  coveredQuestionIds: ['3.4-D-15'],
  summary: 'Many people with disability rely on smartphones, tablets, and apps as assistive technology. Free WiFi, accessible-height charging stations, and power outlets near accessible seating enable visitors to use speech-to-text, navigation, communication, and magnification apps throughout their visit.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'For many people with disability, their smartphone is their primary assistive device. It serves as a magnifier, hearing aid remote control, communication board, navigation tool, voice-to-text converter, and connection to emergency support. Without WiFi, data-intensive features like video relay interpreting, real-time captioning, and audio streaming may not function. Without power, a device dies mid-visit, leaving the person without their assistive tools. Charging stations that are mounted at standard height or hidden under counters may be unreachable from a wheelchair. Providing free WiFi, clearly signed, and charging stations at accessible heights is a straightforward way to support digital assistive technology.',
    statistic: {
      value: '72%',
      context: 'of people with disability use a smartphone as an assistive device, relying on apps for communication, magnification, hearing, and navigation.',
      source: 'Australian Communications Consumer Action Network (ACCAN)'
    },
    quote: {
      text: 'My phone is my voice. I use an AAC app to communicate. When the battery dies and there is nowhere to charge, I literally cannot speak.',
      attribution: 'AAC user, Communication Rights Australia'
    }
  },

  tips: [
    {
      icon: 'Wifi',
      text: 'Provide free WiFi with a simple login process.',
      detail: 'Complex captive portals with small text, CAPTCHAs, and multiple steps are barriers for people with vision impairment, cognitive disability, or limited dexterity. Use a simple one-tap connection or open network. If a password is required, display it in large print at the entrance and on your website.',
      priority: 1
    },
    {
      icon: 'BatteryCharging',
      text: 'Install charging stations at accessible height (700-1000mm) near accessible seating.',
      detail: 'Standard charging stations on high counters or low floor outlets may be unreachable from a wheelchair. Mount charging points at 700-1000mm height, adjacent to accessible seating areas. Include both USB-A and USB-C ports, plus at least one standard power outlet.',
      priority: 2
    },
    {
      icon: 'Plug',
      text: 'Ensure at least one power outlet near every accessible seating area.',
      detail: 'Powered wheelchairs, laptop-based AAC devices, and other assistive technology need mains power for extended visits. An outlet at 600-1100mm height near each accessible seating zone covers this need.',
      priority: 3
    },
    {
      icon: 'SignpostBig',
      text: 'Sign WiFi availability and charging locations clearly.',
      detail: 'Display the WiFi network name and password in large print (minimum 18pt) at the entrance, reception, and near charging stations. Use the universal WiFi symbol and a charging/power symbol. Include this information on your website accessibility page.',
      priority: 4
    },
    {
      icon: 'ShieldCheck',
      text: 'Ensure WiFi bandwidth supports assistive technology needs.',
      detail: 'Video relay interpreting, real-time captioning, and audio streaming require reliable bandwidth. Test your WiFi connection with video calling to confirm it can handle these demands during peak periods.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing WiFi and charging accessibility',
    steps: [
      { text: 'Check WiFi availability. Is there a free WiFi network? What is the login process? Can someone with vision impairment or limited dexterity connect using a screen reader?' },
      { text: 'Test WiFi bandwidth. Run a speed test from the main seating area. Is download speed at least 10 Mbps (sufficient for video relay)?' },
      {
        text: 'Locate all charging stations. Measure the height of charging ports.',
        measurement: { target: 'Charging port height', acceptable: '700-1000mm from floor', unit: 'mm' }
      },
      {
        text: 'Check for power outlets near accessible seating areas.',
        measurement: { target: 'Power outlet height', acceptable: '600-1100mm from floor', unit: 'mm' }
      },
      { text: 'Check signage. Is the WiFi name and password displayed in large print at the entrance and near charging stations?' },
      { text: 'Attempt to connect to WiFi using VoiceOver (iOS) or TalkBack (Android) to test screen reader compatibility of the login process.' },
      { text: 'Check that charging cables (if provided) include Lightning, USB-C, and micro-USB options to cover common devices.' }
    ],
    tools: ['Smartphone for WiFi testing', 'Speed test app', 'Tape measure', 'Screen reader (VoiceOver or TalkBack)'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Part 2',
      requirement: 'The DDA requires reasonable adjustments to services. Providing WiFi and charging access to support assistive technology is increasingly recognised as a reasonable adjustment, particularly in venues where visitors spend extended time.'
    },
    related: [
      { code: 'WCAG2.2-AA', relevance: 'WiFi captive portals (login pages) should meet WCAG AA accessibility standards, including screen reader compatibility and sufficient text size.' },
      { code: 'AS1428.1', relevance: 'Section 13 specifies accessible heights for controls and outlets (900-1100mm), applicable to power points and charging stations.' }
    ],
    plainEnglish: 'Providing WiFi and charging points is not a legal requirement in itself, but when customers rely on digital devices as assistive technology, facilitating their use is a reasonable adjustment that supports equal access.',
    complianceNote: 'WiFi captive portal accessibility is a growing area of complaint. Ensure your login page works with screen readers and does not rely solely on visual CAPTCHAs.'
  },

  solutions: [
    {
      title: 'Simplify WiFi access and add charging at accessible seating',
      description: 'Remove WiFi barriers, display the password prominently, and add charging capability near accessible seating areas.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Simplify the WiFi login: remove CAPTCHAs, reduce to a one-tap or one-password connection. If a captive portal is required, test it with VoiceOver/TalkBack.',
        'Print the WiFi network name and password in large print (minimum 24pt) and laminate signs for the entrance, reception, and main seating areas.',
        'Purchase a multi-port USB charging hub ($30-80) and mount it on or near an accessible table at approximately 800mm height.',
        'Provide a multi-tip charging cable (Lightning, USB-C, micro-USB) secured to the charging station.',
        'If no mains power is available near accessible seating, use a high-capacity portable power bank ($50-100) that can be loaned from reception.',
        'Add WiFi and charging information to your website accessibility page.'
      ],
      notes: 'The simplest improvement is printing the WiFi password in large text and placing it where everyone can see it. This takes five minutes and helps many people.'
    },
    {
      title: 'Install permanent charging stations at accessible locations',
      description: 'Install built-in charging stations with USB and power outlets at accessible height near all accessible seating areas.',
      resourceLevel: 'medium',
      costRange: '$500-3,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify all accessible seating areas and map the nearest power sources.',
        'Engage an electrician to install surface-mounted or furniture-integrated charging stations at each accessible area.',
        'Specify stations with USB-A, USB-C, and one standard power outlet, mounted at 800mm height on a pedestal or table-edge unit.',
        'Install clear signage at each charging point with the charging symbol and the WiFi password.',
        'Upgrade WiFi bandwidth if necessary to support video relay and real-time captioning (minimum 10 Mbps per concurrent user).',
        'Test the setup with a wheelchair user to confirm all ports are reachable from a seated position.',
        'Add charging station locations to your venue map and accessibility page.'
      ],
      notes: 'Furniture-integrated charging (built into table edges or armrests) provides the neatest result and is popular with all customers.'
    },
    {
      title: 'Deploy a comprehensive digital accessibility infrastructure',
      description: 'Implement venue-wide accessible WiFi, integrated charging, digital wayfinding, and support for all major assistive technology platforms.',
      resourceLevel: 'high',
      costRange: '$5,000-20,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a WiFi and network specialist to design a system that provides reliable coverage and bandwidth throughout the venue.',
        'Implement an accessible captive portal that meets WCAG 2.2 AA standards, tested with multiple screen readers.',
        'Install charging stations at every accessible seating area, every service counter, and in waiting areas, all at 800mm height.',
        'Deploy a digital wayfinding system (app-based or beacon-based) that works with common assistive technology platforms.',
        'Provide charging lockers (with accessible-height locks) where visitors can leave devices charging while they explore.',
        'Install a dedicated WiFi network for assistive technology with prioritised bandwidth.',
        'Test the complete system with users of different assistive technologies and refine based on feedback.',
        'Market your digital accessibility infrastructure on your website and through disability and technology channels.'
      ],
      notes: 'Venues that support digital assistive technology well attract tech-savvy visitors with disability who share their experiences widely on social media and review platforms.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A museum had WiFi with a complex captive portal requiring an email, CAPTCHA, and terms checkbox. Screen reader users could not complete the login. There were no charging points in the galleries.',
      solution: 'Replaced the captive portal with a simple password connection. Displayed the password in large print at the entrance and on information cards. Installed USB charging ports at four accessible seating benches in the galleries.',
      outcome: 'Visitors using assistive technology apps (magnification, audio description) could stay connected throughout their visit. Complaints about WiFi access dropped to zero.',
      cost: '$1,200 (charging ports and signage)',
      timeframe: '1 week'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had no WiFi and no accessible power outlets. An AAC user\'s tablet died during dinner, leaving them unable to communicate for the rest of the meal.',
      solution: 'Installed free WiFi with a simple one-tap connection. Added a multi-port USB charger at the accessible table near the wall and a second at the bar. Trained staff to offer charging proactively.',
      outcome: 'The AAC user returned and left a glowing review. Other diners appreciated the free WiFi and charging.',
      cost: '$300 (WiFi upgrade and two charging stations)',
      timeframe: '1 day'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre had charging stations at high standing-height counters (1200mm) in the food court. Wheelchair users could not reach the ports.',
      solution: 'Installed additional charging points at 800mm height at three accessible seating positions. Added clear signage with the WiFi password and charging locations on the centre map.',
      outcome: 'Wheelchair users could charge devices while shopping. The lower charging points were also popular with elderly shoppers and parents.',
      cost: '$800',
      timeframe: '2 days'
    }
  ],

  resources: [
    {
      title: 'ACCAN: Digital Accessibility Report',
      url: 'https://accan.org.au/',
      type: 'guide',
      source: 'Australian Communications Consumer Action Network',
      description: 'Research on how Australians with disability use digital technology and what barriers they face.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'WCAG 2.2 Quick Reference',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Quick reference for WCAG 2.2 requirements, applicable to WiFi captive portal design.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'AS1428.1: Accessible Controls and Power Points',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Section 13 specifies accessible heights for power points and controls (900-1100mm).',
      isAustralian: true,
      isFree: false
    }
  ],

  keywords: ['WiFi', 'charging', 'power outlet', 'assistive technology', 'device', 'USB', 'captive portal', 'AAC', 'screen reader', 'bandwidth', 'digital accessibility']
},
// ─── Entry 21: Captioned and Audio-Described Video Content ───
{
  questionId: '3.6-D-7',
  questionText: 'Are videos used in your venue captioned and audio-described?',
  moduleCode: '3.6',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Captioned and Audio-Described Video Content',
  coveredQuestionIds: ['3.6-D-8', '3.6-D-5'],
  summary: 'All video content displayed in your venue should include closed captions for people who are deaf or hard of hearing, and audio description tracks for people who are blind or have low vision. Transcripts should also be available on request.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Video is increasingly used in venues for wayfinding, safety briefings, promotional content, and interpretive displays. Without captions, people who are deaf or hard of hearing miss spoken dialogue and important sound cues. Without audio description, people who are blind or have low vision miss visual information that is not conveyed through dialogue alone. Providing both ensures your video content reaches the widest possible audience and meets your obligations under the DDA.',
    statistic: {
      value: '3.6 million',
      context: 'Australians have hearing loss, and over 575,000 are blind or have low vision. Captions and audio description are essential, not optional.',
      source: 'Hearing Australia and Vision Australia'
    }
  },

  tips: [
    {
      icon: 'Subtitles',
      text: 'Add closed captions to every video, including sound effects and speaker identification.',
      detail: 'Closed captions should include all spoken dialogue, identify who is speaking when multiple people are on screen, and describe important sounds (e.g., [alarm sounding], [applause]). Use a legible sans-serif font at minimum 22px on a semi-transparent dark background for readability.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Include audio description tracks that narrate key visual information.',
      detail: 'Audio description fills the gaps between dialogue, describing actions, settings, facial expressions, and on-screen text that a viewer with low vision would otherwise miss. It should be concise and timed to fit naturally into pauses in the soundtrack.',
      priority: 2
    },
    {
      icon: 'FileText',
      text: 'Provide a full text transcript for every video, available on request or online.',
      detail: 'Transcripts benefit people who are deafblind (using refreshable Braille displays), people in noisy environments, and anyone who prefers reading. Include speaker identification, dialogue, and descriptions of relevant visual and audio content.',
      priority: 3
    },
    {
      icon: 'Monitor',
      text: 'Use accessible video players with keyboard-navigable controls.',
      detail: 'Ensure the video player supports keyboard navigation for play, pause, volume, captions toggle, and full screen. Avoid auto-playing videos with sound. Players like Able Player or configured YouTube embeds meet these requirements.',
      priority: 4
    },
    {
      icon: 'Globe',
      text: 'Consider multilingual captions for venues with international visitors.',
      detail: 'If your venue regularly welcomes visitors who speak languages other than English, adding subtitle tracks in common visitor languages improves access for both deaf and hearing visitors. At minimum, provide English captions and consider Simplified Chinese, Japanese, or other relevant languages based on your visitor demographics.',
      priority: 5
    },
    {
      icon: 'RefreshCw',
      text: 'Audit all video content annually and caption new videos before they go live.',
      detail: 'Build captioning and audio description into your video production workflow so accessibility is not an afterthought. Set a policy that no video goes live without captions. Review existing content annually to ensure captions remain accurate after any edits.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing video accessibility in your venue',
    steps: [
      { text: 'Create an inventory of all video content displayed in your venue, including promotional screens, safety briefings, interpretive displays, digital menus, and any content on your website or app.' },
      { text: 'For each video, check whether closed captions are present. Play the video with sound muted and confirm that all dialogue, speaker identification, and important sounds are displayed as text.' },
      { text: 'Check caption quality: Are they accurately synchronised with speech? Are they free of errors? Do they use readable fonts on a contrasting background?' },
      { text: 'For each video, check whether an audio description track is available. Listen to the audio description version and confirm that key visual information (actions, scene changes, on-screen text) is described.' },
      { text: 'Check whether a text transcript is available for each video. Verify it includes speaker identification, dialogue, and descriptions of visual and audio content.' },
      { text: 'Test video players for keyboard accessibility: Can you play, pause, adjust volume, toggle captions, and enter full screen using only the Tab and Enter keys?' },
      { text: 'Check that videos do not auto-play with sound. Auto-playing audio can be disorienting for screen reader users and distressing for people with sensory sensitivities.' },
      { text: 'Verify that caption font size is legible from the typical viewing distance for each display.',
        measurement: { target: 'Caption font size', acceptable: 'Minimum 22px at 1m viewing distance, scale up proportionally for larger displays', unit: 'px' }
      }
    ],
    tools: ['Video inventory spreadsheet', 'Keyboard (for player testing)', 'Caption quality checklist'],
    estimatedTime: '1-3 hours depending on video count'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: 'SC 1.2.2, 1.2.3, 1.2.5',
      requirement: 'Pre-recorded video must have captions (1.2.2), audio description or media alternative (1.2.3), and audio description for pre-recorded video (1.2.5 at AA).'
    },
    related: [
      { code: 'DDA', relevance: 'The DDA requires that information provided to the public is accessible to people with disability. Uncaptioned video content in venues may constitute indirect discrimination.' },
      { code: 'WCAG2.2-AA', relevance: 'WCAG 2.2 maintains the same media requirements as 2.1 and adds clarity around captions for live content.' }
    ],
    plainEnglish: 'If you show videos in your venue or on your website, they need captions for people who cannot hear and audio description for people who cannot see. Transcripts are also strongly recommended.',
    complianceNote: 'WCAG requirements apply directly to web and app content. For in-venue displays, the DDA general obligation to provide accessible information applies. The Australian Government has adopted WCAG 2.1 AA as the benchmark for digital accessibility.'
  },

  solutions: [
    {
      title: 'Add captions and transcripts to existing videos',
      description: 'Use free or low-cost captioning tools to add closed captions to your current video library and create downloadable transcripts.',
      resourceLevel: 'low',
      costRange: '$0-500',
      timeRequired: '2-4 hours per video',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'List all videos currently displayed in your venue or published on your website.',
        'Upload each video to a free auto-captioning service (YouTube Studio, Otter.ai, or Microsoft Stream) to generate draft captions.',
        'Review and correct the auto-generated captions for accuracy, especially proper nouns, technical terms, and Australian place names.',
        'Add speaker identification labels where multiple people speak (e.g., [Tour guide], [Visitor]).',
        'Add descriptions of important non-speech sounds (e.g., [fire alarm], [waves crashing]).',
        'Export the corrected captions as SRT or VTT files and embed them in your video player.',
        'Create a plain-text transcript for each video by copying the corrected captions and formatting them as a readable document.',
        'Make transcripts available as downloadable files on your website and as printed copies on request at your venue.'
      ],
      notes: 'Auto-captioning accuracy varies. Always review and correct generated captions before publishing. Budget approximately 3 to 5 times the video length for correction.'
    },
    {
      title: 'Commission professional captions and audio description',
      description: 'Engage a professional captioning and audio description service to produce high-quality accessible versions of your key video content.',
      resourceLevel: 'medium',
      costRange: '$500-3,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'specialist',
      impact: 'moderate',
      steps: [
        'Prioritise videos by audience reach: safety videos, main promotional content, and interpretive displays should be done first.',
        'Request quotes from Australian captioning providers (e.g., Ai-Media, The Captioning Studio, or Red Bee Media).',
        'Provide the captioning company with your video files, any scripts or speaker lists, and a glossary of venue-specific terms.',
        'Request both closed caption files (SRT/VTT) and open-captioned versions for in-venue displays where viewers cannot toggle captions.',
        'For audio description, provide the service with your video and any existing scripts. The describer will write a narration script and record it.',
        'Review the delivered captions and audio description for accuracy before publishing.',
        'Update your video player to include caption and audio description track selection controls.',
        'Add the International Symbol of Access for Hearing and the audio description symbol to signage near in-venue displays.'
      ],
      notes: 'Professional captioning typically costs $1.50 to $3.00 per minute of video. Audio description costs $15 to $40 per minute. Bulk discounts are common.'
    },
    {
      title: 'Build accessibility into your video production workflow',
      description: 'Establish a policy and workflow ensuring all new video content is produced with captions, audio description, and transcripts from the start.',
      resourceLevel: 'high',
      costRange: '$2,000-8,000',
      timeRequired: '2-4 weeks to establish',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Draft an accessible video policy stating that no video content will be published without captions, audio description, and a transcript.',
        'Brief your video production team or agency on accessibility requirements, including caption standards (timing, accuracy, formatting) and audio description conventions.',
        'Include captioning and audio description line items in every video production budget and timeline.',
        'Script videos with audio description in mind: leave natural pauses for descriptions and avoid relying solely on visual information to convey key messages.',
        'Engage a professional captioning and audio description provider on a retainer or preferred supplier arrangement for consistent quality.',
        'Implement a review process where captions and audio description are checked by a person with relevant lived experience before publishing.',
        'Configure all in-venue video displays to show open captions by default (since viewers may not have access to a remote control).',
        'Review the policy and workflow annually, incorporating feedback from visitors and staff.'
      ],
      notes: 'Building accessibility into production is more cost-effective than retrofitting. A $5,000 video produced with captions and audio description from the start costs far less to make accessible than adding these elements after the fact.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A museum had 40 interpretive videos throughout its galleries, none of which had captions or audio description. Deaf visitors and visitors with low vision missed significant content.',
      solution: 'Prioritised the 10 most-viewed videos for professional captioning and audio description. Used auto-captioning with manual correction for the remaining 30. Added open captions to all in-gallery displays and made transcripts available via QR codes beside each screen.',
      outcome: 'Visitor satisfaction among people with hearing loss increased markedly. The museum received an accessibility commendation from the local council.',
      cost: '$4,500 for professional services plus staff time for the remaining 30 videos',
      timeframe: '6 weeks'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre played safety briefing videos at the start of every event but had never captioned them.',
      solution: 'Engaged a captioning provider to produce open-captioned and audio-described versions of all three safety videos. Updated the venue AV template so the captioned version plays by default.',
      outcome: 'Event organisers appreciated not having to arrange their own captions for the safety briefing. Several noted it as a selling point when choosing the venue.',
      cost: '$900 for three videos',
      timeframe: '1 week'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre ran promotional videos on screens throughout the complex. The videos had background music but no captions, making them inaccessible in the noisy environment for everyone, not just people with hearing loss.',
      solution: 'Added open captions to all promotional videos as standard. Included this as a requirement in their digital signage content guidelines for all tenants.',
      outcome: 'Customer engagement with the screens increased across all demographics. Tenants reported the captioned content performed better than uncaptioned versions.',
      cost: '$200 per video (bulk rate from captioning provider)',
      timeframe: 'Ongoing as new content is produced'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A tour operator produced short destination preview videos for their website but had not considered accessibility.',
      solution: 'Used YouTube auto-captioning as a starting point, then manually corrected each video. Added audio description narration using a staff member with a clear voice. Published transcripts alongside each video on the website.',
      outcome: 'Website engagement time on video pages increased. The operator received positive feedback from a vision-impaired travel blogger who featured the company in a review.',
      cost: '$0 (staff time only)',
      timeframe: '2 hours per video'
    }
  ],

  resources: [
    {
      title: 'Ai-Media Captioning Services',
      url: 'https://www.ai-media.tv/',
      type: 'website',
      source: 'Ai-Media',
      description: 'Australian-founded captioning and translation company offering live and pre-recorded captioning services.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Audio Description Australia',
      url: 'https://www.audiodescription.com.au/',
      type: 'website',
      source: 'Audio Description Australia',
      description: 'Resources and services for audio description in Australia, including training and production.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'W3C Making Audio and Video Media Accessible',
      url: 'https://www.w3.org/WAI/media/av/',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Comprehensive guide to making media accessible, covering captions, audio description, transcripts, and sign language.',
      isFree: true
    },
    {
      title: 'YouTube Studio Caption Editor',
      url: 'https://support.google.com/youtube/answer/2734796',
      type: 'tool',
      source: 'Google',
      description: 'Free tool for adding and editing captions on YouTube-hosted videos, with auto-captioning as a starting point.',
      isFree: true
    }
  ],

  keywords: ['captions', 'subtitles', 'audio description', 'video accessibility', 'transcripts', 'closed captions', 'open captions', 'multimedia', 'deaf', 'blind', 'low vision', 'video player']
},

// ─── Entry 22: On-Site Alternative Formats ───
{
  questionId: '3.7-PC-1',
  questionText: 'Do you provide on-site information in alternative formats?',
  moduleCode: '3.7',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'On-site Alternative Formats',
  coveredQuestionIds: ['3.7-DD-1a', '3.7-DD-1b', '3.7-PC-2', '3.7-DD-2a'],
  summary: 'Providing information in multiple formats on-site (large print, Easy Read, Braille, digital alternatives, and accessible interactive displays) ensures all visitors can engage with your content regardless of their abilities.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'When visitors arrive at your venue, they need to navigate, understand what is on offer, and engage with your content. If information is only available in standard print, you exclude people with low vision, intellectual disability, literacy challenges, or those who learn better through digital or audio formats. Proactively offering alternative formats, rather than waiting for visitors to ask, sends a clear message that everyone is welcome and expected.',
    statistic: {
      value: '44%',
      context: 'of Australian adults have literacy levels below what is needed for everyday tasks. Alternative formats help far more people than you might expect.',
      source: 'Australian Bureau of Statistics'
    }
  },

  tips: [
    {
      icon: 'FileText',
      text: 'Keep large print versions of key documents ready at reception (minimum 18pt, sans-serif font).',
      detail: 'Large print is the most commonly requested alternative format. Prepare your visitor guide, menu, safety information, and map in 18pt Arial or similar sans-serif font on matte (non-glossy) paper. Use high contrast (black text on white or cream background).',
      priority: 1
    },
    {
      icon: 'Smartphone',
      text: 'Offer digital alternatives via QR codes that link to accessible web pages.',
      detail: 'QR codes allow visitors to access information on their own devices, where they can adjust text size, use screen readers, or translate content. Place QR codes at key points throughout your venue. Ensure the linked pages meet WCAG 2.1 AA standards.',
      priority: 2
    },
    {
      icon: 'Image',
      text: 'Create Easy Read versions of essential information using simple words and supporting images.',
      detail: 'Easy Read uses short sentences (maximum 15 words), everyday vocabulary, and a relevant image beside each key point. It benefits people with intellectual disability, acquired brain injury, low literacy, and visitors with limited English.',
      priority: 3
    },
    {
      icon: 'Monitor',
      text: 'Ensure interactive exhibits and touchscreens are accessible to people with different disabilities.',
      detail: 'Touchscreens should be mounted at a height reachable from a wheelchair (between 900mm and 1100mm to the centre). Provide audio output, adjustable text size, and high-contrast mode. Offer an alternative way to access the same content for people who cannot use a touchscreen.',
      priority: 4
    },
    {
      icon: 'Users',
      text: 'Train staff to proactively offer alternative formats rather than waiting for requests.',
      detail: 'Many visitors will not ask for alternative formats because they do not know they exist, they feel embarrassed, or they assume none are available. A brief mention at the point of welcome ("We have large print and Easy Read guides available, would you like one?") removes this barrier.',
      priority: 5
    },
    {
      icon: 'Braille',
      text: 'Provide Braille labels on key signage and consider Braille versions of important documents.',
      detail: 'While not all people with vision impairment read Braille, those who do rely on it heavily. At minimum, add Braille labels to room numbers, lift buttons, and toilet signage. For frequently requested documents, a Braille version can be produced by organisations like Vision Australia.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing on-site information formats',
    steps: [
      { text: 'List all printed materials visitors encounter: visitor guides, maps, menus, safety information, interpretive panels, wayfinding signage, event programs, and feedback forms.' },
      { text: 'For each item, check whether a large print version exists. Verify it uses minimum 18pt sans-serif font on non-glossy paper with high contrast.',
        measurement: { target: 'Large print font size', acceptable: 'Minimum 18pt (ideally 24pt for key documents)', unit: 'pt' }
      },
      { text: 'Check whether an Easy Read version exists for your most important visitor documents (guide, safety info, map).' },
      { text: 'Check whether digital alternatives are available. Scan any QR codes and verify the linked pages are accessible (keyboard navigable, screen reader compatible, adequate contrast).' },
      { text: 'Test any interactive exhibits or touchscreens. Check mounting height, screen readability, audio output, and whether alternative access methods are available.',
        measurement: { target: 'Touchscreen centre height', acceptable: '900mm to 1100mm from floor', unit: 'mm' }
      },
      { text: 'Ask three front-line staff members whether they know what alternative formats are available and how to offer them. Note any gaps in awareness.' },
      { text: 'Check whether Braille labels are present on room numbers, lift buttons, and key signage.' },
      { text: 'Visit as a mystery shopper and note whether alternative formats are mentioned or offered without being requested.' }
    ],
    tools: ['Ruler or tape measure', 'Smartphone (for QR code testing)', 'Alternative format checklist'],
    estimatedTime: '45-60 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The Disability Discrimination Act requires that information provided to the public is accessible to people with disability. Providing information only in standard print may constitute indirect discrimination.'
    },
    related: [
      { code: 'WCAG2.1-AA', relevance: 'Digital alternatives (QR code destinations, apps, websites) must meet WCAG 2.1 AA for text alternatives, contrast, and keyboard navigation.' },
      { code: 'AS1428.1', relevance: 'Section 8 covers signage requirements including Braille and tactile characters on room identification signs.' }
    ],
    plainEnglish: 'You should provide your information in more than one format so that people with different disabilities can access it. This includes large print, Easy Read, digital, Braille, and audio alternatives.',
    complianceNote: 'There is no prescriptive list of required formats under the DDA. The test is whether a person with disability can access the same information as other visitors. Offering multiple formats demonstrates good faith compliance.'
  },

  solutions: [
    {
      title: 'Create large print and Easy Read versions of key documents',
      description: 'Produce large print and Easy Read versions of your most important visitor documents in-house using word processing software.',
      resourceLevel: 'low',
      costRange: '$0-200',
      timeRequired: '2-4 hours per document',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Identify your top three most-used visitor documents (e.g., visitor guide, menu, safety information).',
        'For each document, create a large print version: reformat to 18pt minimum (24pt preferred) in Arial or Verdana, left-aligned, with generous line spacing (1.5x).',
        'Print on matte A4 or A3 paper (not glossy) using high-contrast black text on white or cream paper.',
        'For Easy Read, rewrite each document using sentences of 15 words or fewer, everyday vocabulary, and one idea per sentence.',
        'Add a relevant image or icon beside each key point in the Easy Read version. Use real photographs where possible.',
        'Print 5 to 10 copies of each format and store them at reception or your main service point.',
        'Brief reception staff on what is available and practise offering the formats as part of the welcome script.',
        'Set a quarterly reminder to reprint and update as content changes.'
      ],
      notes: 'Easy Read conversion is straightforward for simple documents but may benefit from review by a person with intellectual disability to confirm it is genuinely easy to understand.'
    },
    {
      title: 'Add QR codes and digital alternatives throughout the venue',
      description: 'Deploy QR codes at key points linking to accessible web pages, giving visitors the option to access information on their own devices with their preferred settings.',
      resourceLevel: 'medium',
      costRange: '$300-1,500',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Map the visitor journey and identify every point where information is displayed (entrance, wayfinding, exhibits, menus, safety notices).',
        'Create accessible web pages for each information point, meeting WCAG 2.1 AA standards (proper headings, alt text, keyboard navigation, 4.5:1 contrast ratio).',
        'Generate QR codes linking to each page. Use a reliable QR generator that creates high-resolution codes with good error correction.',
        'Design and print QR code signs with clear instructions: "Scan for accessible version" with the ISA symbol. Mount at heights accessible from a wheelchair (1000mm to 1200mm centre height).',
        'Test every QR code with multiple devices and screen readers (VoiceOver on iOS, TalkBack on Android).',
        'Include text size controls, language options, and a "read aloud" function on the digital pages where feasible.',
        'Monitor QR code usage analytics to understand which formats and pages are most accessed.',
        'Update digital content immediately when venue information changes and retest QR codes monthly.'
      ],
      notes: 'QR codes are not accessible to everyone. Always maintain physical alternative formats alongside digital options. Some visitors may not have smartphones or may not be familiar with QR codes.'
    },
    {
      title: 'Commission a comprehensive alternative formats program',
      description: 'Engage accessibility specialists to produce a full suite of alternative formats including Braille, tactile maps, audio guides, and accessible interactive displays.',
      resourceLevel: 'high',
      costRange: '$3,000-15,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant to audit all visitor-facing information and recommend priority formats for each piece of content.',
        'Commission Braille translations of key documents through Vision Australia or a Braille production house.',
        'Develop a tactile map of your venue showing key landmarks, pathways, and facilities in raised relief.',
        'Produce audio guide content for self-guided tours, available via a dedicated device or a free app.',
        'Upgrade interactive exhibits with accessibility features: audio output, adjustable font size, high-contrast mode, and switch access for people who cannot use a touchscreen.',
        'Engage a person with intellectual disability to review and test Easy Read materials before finalising.',
        'Install signage at every information point listing available formats with the relevant accessibility symbols.',
        'Develop a maintenance plan: assign responsibility for keeping all formats current when content changes.'
      ],
      notes: 'A Braille document typically costs $3 to $8 per page to produce. Tactile maps range from $500 to $5,000 depending on complexity. Audio guides can be produced in-house with good equipment for under $1,000.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A regional museum had interpretive panels in standard 12pt text with no alternative formats. Visitors with low vision or intellectual disability could not engage with exhibit content.',
      solution: 'Created large print companion booklets for each gallery, Easy Read summaries of key exhibits with photos, QR codes linking to audio descriptions, and a tactile map at the entrance. Staff were trained to offer formats at the welcome desk.',
      outcome: 'Visitor feedback from disability groups improved significantly. The museum was featured in a Vision Australia newsletter as a recommended accessible destination.',
      cost: '$2,800 for initial production',
      timeframe: '5 weeks'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had an elaborate menu in small decorative font that was difficult for many customers to read, not only those with vision impairment.',
      solution: 'Created a large print menu (20pt, sans-serif) with allergen information clearly marked. Added a QR code on each table linking to a mobile-friendly accessible menu with text-to-speech capability.',
      outcome: 'Customer complaints about menu readability stopped. The QR code menu proved popular with all customers, not just those with disabilities.',
      cost: '$150 for large print menus plus $400 for the digital menu page',
      timeframe: '1 week'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Library',
      scenario: 'A public library provided all event programs and community notices in standard print only, excluding community members with low literacy or intellectual disability.',
      solution: 'Developed an Easy Read template for all community notices. Trained library staff to produce Easy Read versions of event programs. Installed a QR code station at the entrance linking to accessible digital versions of all current notices.',
      outcome: 'Participation in library events by supported living residents increased. The Easy Read notices were also popular with culturally diverse community members learning English.',
      cost: '$0 (staff time only, using free Easy Read templates from Scope Australia)',
      timeframe: '2 weeks to establish the process'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel chain had room information compendiums in each room but no accessible alternatives. Guests with vision impairment could not access in-room information about services, safety procedures, or local attractions.',
      solution: 'Produced large print and Braille versions of the room compendium for accessible rooms. Added a QR code on the compendium cover linking to an accessible web version. Installed a smart speaker in accessible rooms allowing guests to ask for information verbally.',
      outcome: 'Guest satisfaction scores for accessible rooms improved. The digital compendium reduced printing costs by 30% as all rooms eventually adopted the QR code option.',
      cost: '$1,200 for Braille production, $500 for digital version, $150 per smart speaker',
      timeframe: '3 weeks'
    }
  ],

  resources: [
    {
      title: 'Scope Australia Easy Read Resources',
      url: 'https://www.scopeaust.org.au/service/communication-access/',
      type: 'guide',
      source: 'Scope Australia',
      description: 'Tools, templates, and training for creating Easy Read documents. Includes a symbol library and style guide.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Vision Australia Braille Production',
      url: 'https://www.visionaustralia.org/',
      type: 'website',
      source: 'Vision Australia',
      description: 'Braille transcription, tactile graphics, and alternative format production services for businesses.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'W3C Web Accessibility Initiative (WAI) Tutorials',
      url: 'https://www.w3.org/WAI/tutorials/',
      type: 'guide',
      source: 'W3C',
      description: 'Step-by-step tutorials for creating accessible web content, including images, tables, and forms.',
      isFree: true
    },
    {
      title: 'Communication Access Symbol',
      url: 'https://www.scopeaust.org.au/service/communication-access/',
      type: 'guide',
      source: 'Scope Australia',
      description: 'Information about the Communication Access Symbol program, helping businesses demonstrate their commitment to accessible communication.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['alternative formats', 'large print', 'Easy Read', 'Braille', 'QR code', 'digital', 'touchscreen', 'accessible information', 'on-site', 'interactive exhibit', 'tactile map', 'audio guide']
},


// ─── Entry 15: Clear and Readable Signage ───
{
  questionId: '3.5-1-1',
  questionText: 'Is your signage clear and easy to read for people with low vision?',
  moduleCode: '3.5',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Clear and readable signage',
  coveredQuestionIds: ['3.5-1-2', '3.5-D-2', '3.5-D-5', '3.5-D-7'],
  summary: 'Signage must use clear, sans-serif fonts at appropriate sizes, with high contrast between text and background. Non-reflective materials, consistent placement, and adequate lighting ensure people with low vision can read signs independently.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Clear signage is the foundation of independent navigation. When signs are too small, use decorative fonts, or have poor contrast, people with low vision cannot read them. This affects not only people with diagnosed vision impairment but also older adults experiencing age-related vision changes.',
    statistic: { value: '575,000+', context: 'Australians are blind or have low vision. Many more experience uncorrected or age-related vision changes that affect reading.', source: 'Vision Australia' }
  },
  tips: [
    { icon: 'Type', text: 'Use sans-serif fonts (Arial, Helvetica, Verdana) for all signage.', detail: 'Decorative, serif, and italic fonts are significantly harder to read for people with low vision.', priority: 1 },
    { icon: 'Maximize', text: 'Scale font size to viewing distance: 15mm minimum for door signs, larger for corridor signs.', detail: 'A general rule is 25mm of letter height per metre of expected reading distance.', priority: 2 },
    { icon: 'Contrast', text: 'Ensure at least 70% luminance contrast between text and background.', priority: 3 },
    { icon: 'Sun', text: 'Use matte, non-reflective materials to prevent glare.', priority: 4 },
    { icon: 'MapPin', text: 'Place signs consistently at 1400mm to 1600mm centre height throughout the venue.', priority: 5 },
    { icon: 'AlertCircle', text: 'Ensure emergency exit signs are illuminated and visible from all areas.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing your signage',
    steps: [
      { text: 'Walk through your venue and list all signs: room identification, directional, informational, safety, and emergency.' },
      { text: 'Measure the font size on key signs.', measurement: { target: 'Door sign letter height', acceptable: 'Minimum 15mm', unit: 'mm' } },
      { text: 'Check contrast between text and background using a contrast checker app.' },
      { text: 'Check for glare at different times of day.' },
      { text: 'Verify consistent placement height.', measurement: { target: 'Sign centre height', acceptable: '1400mm to 1600mm from floor', unit: 'mm' } },
      { text: 'Check that emergency exit signs are illuminated and visible from all areas.' },
      { text: 'Ask a person with low vision to navigate using your signage alone.' },
      { text: 'Check that Easy Read signs are available for key information areas.' }
    ],
    tools: ['Tape measure', 'Smartphone with contrast checker app', 'Camera'],
    estimatedTime: '45-60 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 8', requirement: 'Signs identifying rooms and facilities must have characters of adequate size, colour contrast, and finish. Tactile and Braille characters are required on room identification signs.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires signage to comply with AS 1428.1 in new buildings and significant renovations.' },
      { code: 'NCC', relevance: 'The National Construction Code references AS 1428.1 for signage in accessible buildings.' }
    ],
    plainEnglish: 'Signs must be big enough, high-contrast, and placed consistently so people with low vision can read them. Room identification signs need raised text and Braille.',
    complianceNote: 'Even if your building predates current standards, improving signage is one of the most cost-effective accessibility improvements.'
  },
  solutions: [
    {
      title: 'Improve contrast and size of existing signs', description: 'Replace or overlay existing signs with high-contrast, larger-font versions.',
      resourceLevel: 'low', costRange: '$100-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify the 10 most critical signs.', 'Reprint using sans-serif font at minimum 15mm letter height.', 'Use high-contrast colour combinations: black on white, white on dark blue, or yellow on black.', 'Print on matte paper or vinyl.', 'Replace in existing frames or mount with adhesive.', 'Add large-print room numbers beside room identification signs.']
    },
    {
      title: 'Replace key signage with compliant signs', description: 'Commission signs meeting AS 1428.1 for contrast, font, and tactile elements.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Engage a signage company experienced in accessible signage.', 'Provide a floor plan and list of all rooms requiring signs.', 'Specify: sans-serif font, minimum 70% luminance contrast, matte finish, tactile raised text and Braille.', 'Confirm mounting height: 1400mm to 1600mm centre, on the latch side of doors.', 'Install and verify each sign.', 'Brief cleaning staff not to obscure or remove signs.']
    },
    {
      title: 'Full signage audit and replacement program', description: 'Engage an accessibility consultant to audit all signage and develop a phased replacement program.',
      resourceLevel: 'high', costRange: '$5,000-20,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission a signage audit.', 'Receive a prioritised report.', 'Develop a phased replacement plan.', 'Select a signage supplier.', 'Install replacements in phases.', 'Establish a quarterly maintenance schedule.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Museum', scenario: 'A museum had decorative signs in thin serif font with gold on cream. Visitors with low vision could not read them.', solution: 'Replaced wayfinding signs with high-contrast sans-serif (white on dark charcoal, 30mm letters). Added tactile room plates.', outcome: 'Visitor complaints about navigation dropped by 60%.', cost: '$4,500' },
    { businessType: 'retail', businessTypeLabel: 'Shopping Centre', scenario: 'A shopping centre used small directory signs with multiple fonts.', solution: 'Redesigned using consistent sans-serif at 20mm minimum with high-contrast colour coding by zone. Added tactile maps at entrances.', outcome: '25% improvement in navigation ease on surveys.', cost: '$8,000' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Room numbers etched into brass plates were nearly invisible in dim corridors.', solution: 'Replaced with high-contrast signs (white on dark, 30mm raised text with Braille). Improved corridor lighting to 150 lux.', outcome: 'Guest feedback about difficulty finding rooms ceased.', cost: '$2,200' }
  ],
  resources: [
    { title: 'Vision Australia Signage Guidelines', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', isAustralian: true, isFree: true },
    { title: 'AS 1428.1:2021 Section 8', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', isAustralian: true, isFree: false },
    { title: 'WebAIM Contrast Checker', url: 'https://webaim.org/resources/contrastchecker/', type: 'tool', source: 'WebAIM', isFree: true }
  ],
  keywords: ['signage', 'wayfinding', 'contrast', 'font size', 'low vision', 'readable', 'sans-serif', 'emergency signs']
},

// ─── Entry 16: Navigating Your Venue Independently ───
{
  questionId: '3.5-1-4',
  questionText: 'Can visitors navigate independently using your wayfinding systems?',
  moduleCode: '3.5',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Navigating your venue independently',
  coveredQuestionIds: ['3.5-1-3', '3.5-D-3', '3.5-D-4', '3.5-D-6'],
  summary: 'Effective wayfinding combines directional signage at every decision point, accessible maps and floor plans, logical zoning or numbering, and clear approach signage from parking and transport.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Independent navigation is fundamental to dignity. When wayfinding is poor, people with disabilities must repeatedly ask for help, which is tiring and can feel embarrassing. Good wayfinding benefits everyone but is essential for people with mobility, vision, or cognitive disabilities.',
    quote: { text: 'I rely on clear signage and maps. When a venue is well-signed, I can explore independently. When it is not, I have to keep asking for help and it takes the enjoyment out of the visit.', attribution: 'Wheelchair user, tourism feedback survey' }
  },
  tips: [
    { icon: 'Navigation', text: 'Place directional signs at every decision point (intersections, stairwells, lifts).', priority: 1 },
    { icon: 'Map', text: 'Provide an accessible venue map at the entrance in large print and tactile formats.', priority: 2 },
    { icon: 'Smartphone', text: 'Consider a digital wayfinding option via QR code or app with screen reader support.', priority: 3 },
    { icon: 'Signpost', text: 'Install approach signage visible from the car park, bus stop, and drop-off area.', priority: 4 },
    { icon: 'Hash', text: 'Use logical, sequential numbering or colour-coded zones.', priority: 5 },
    { icon: 'Eye', text: 'Include landmarks and visual cues that help people orient themselves.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing your wayfinding system',
    steps: [
      { text: 'Start at the nearest car park or bus stop. Can you see clear signage directing you to the entrance?' },
      { text: 'Enter the building and look for a "You Are Here" map within 3 metres of the entrance.' },
      { text: 'Navigate to the most distant public area using only signage. Note every hesitation point.' },
      { text: 'Check that directional signs are present at every corridor intersection and lift lobby.' },
      { text: 'Verify that numbering follows a logical sequence.' },
      { text: 'Test from a wheelchair: are signs visible at seated eye height (1000-1400mm)?' },
      { text: 'Check whether an accessible map is available in large print, tactile, or digital format.' },
      { text: 'Walk the accessible parking route to the entrance. Is it clearly signed?' }
    ],
    tools: ['Camera', 'Notepad'],
    estimatedTime: '30-45 minutes'
  },
  solutions: [
    {
      title: 'Add directional signs at key decision points', description: 'Install directional arrows and destination labels at every intersection.',
      resourceLevel: 'low', costRange: '$200-800', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Map every corridor intersection, lift, and stairwell.', 'Design consistent directional signs with arrows and names.', 'Print on matte material with high contrast.', 'Mount at 1400-1600mm at each decision point.', 'Include accessible route indicators where paths differ.', 'Test with three visitors navigating by signs only.']
    },
    {
      title: 'Develop accessible venue maps', description: 'Create maps in large print, tactile, and digital formats.',
      resourceLevel: 'medium', costRange: '$1,000-4,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Commission a simplified floor plan highlighting accessible routes.', 'Produce large print version (A3, 18pt labels, high contrast).', 'Produce tactile version with raised pathways and Braille labels.', 'Create digital version via QR code, screen reader optimised.', 'Place at entrance, lifts, and each floor lobby.', 'Train staff to offer maps proactively.']
    },
    {
      title: 'Implement digital wayfinding', description: 'Deploy smartphone-accessible navigation with voice guidance and screen reader integration.',
      resourceLevel: 'high', costRange: '$5,000-25,000', timeRequired: '2-4 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Research accessible wayfinding platforms (Blindsquare, Goodmaps, Lazarillo).', 'Map venue with Bluetooth beacons or indoor positioning.', 'Configure accessible routes and points of interest.', 'Test with screen reader users and wheelchair users.', 'Deploy QR codes at entrance linking to the app.', 'Maintain as layout changes.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Art Gallery', scenario: 'No directional signage between floors. Visitors frequently got lost.', solution: 'Installed colour-coded directional signs at every stairwell and lift, with exhibition names. Added tactile map and QR digital map.', outcome: 'Significant reduction in directional enquiries. Visitor dwell time increased.', cost: '$3,200' },
    { businessType: 'local-government', businessTypeLabel: 'Council Office', scenario: 'Confusing room numbering across three levels.', solution: 'Renumbered rooms sequentially by floor (100s, 200s, 300s). Added directional signs from car park. Installed large directory in foyer.', outcome: 'Confusion and late arrivals decreased.', cost: '$1,800' },
    { businessType: 'accommodation', businessTypeLabel: 'Resort', scenario: 'Multiple buildings with minimal signage. Guests with mobility impairments struggled.', solution: 'Installed directional signage at all path intersections with distances and gradient info. Marked accessible routes. Added resort map in large print and digital.', outcome: 'Guest satisfaction improved. Fewer direction calls to reception.', cost: '$5,500' }
  ],
  resources: [
    { title: 'Vision Australia Wayfinding', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', isAustralian: true, isFree: true },
    { title: 'AND Accessible Wayfinding', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', isAustralian: true, isFree: true }
  ],
  keywords: ['wayfinding', 'navigation', 'directional signs', 'maps', 'floor plans', 'digital wayfinding']
},

// ─── Entry 17: Tactile Signage and Braille ───
{
  questionId: '3.5-D-1',
  questionText: 'Do you have tactile signs and Braille at key locations?',
  moduleCode: '3.5',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Tactile signage and Braille',
  summary: 'Tactile signs use raised text and Braille to convey information to people who are blind or have low vision. AS 1428.1 requires tactile and Braille signs on room identification plates, stairway identification, and lift controls.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'People who are blind rely on touch to read signs. Tactile raised text can be traced with fingers, while Braille provides detailed information. Without tactile signs, blind visitors cannot independently identify rooms, floors, or facilities.',
    statistic: { value: '35%', context: 'of Braille-literate Australians report difficulty finding tactile signs in public buildings.', source: 'Vision Australia survey' }
  },
  tips: [
    { icon: 'Layers', text: 'Install tactile room signs with raised text and Grade 2 Braille on the latch side of doors.', detail: 'Place at 1200mm to 1600mm height.', priority: 1 },
    { icon: 'Ruler', text: 'Raised text must be at least 1mm high with letter height of 15mm to 55mm.', priority: 2 },
    { icon: 'Contrast', text: 'Use contrasting background for raised text.', priority: 3 },
    { icon: 'ArrowUpDown', text: 'Install tactile stairway identification on handrails or landings.', priority: 4 },
    { icon: 'CheckCircle', text: 'Include Braille on lift controls for floor numbers and emergency buttons.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing tactile signage',
    steps: [
      { text: 'Check all room identification signs for raised text and Braille.', measurement: { target: 'Raised text height', acceptable: 'Minimum 1mm raised, letters 15-55mm', unit: 'mm' } },
      { text: 'Verify placement on latch side of door.', measurement: { target: 'Mounting height', acceptable: '1200mm to 1600mm centre', unit: 'mm' } },
      { text: 'Check lift controls for Braille floor numbers.' },
      { text: 'Check stairway handrails for tactile floor identification.' },
      { text: 'Verify toilet signs include tactile indicators.' },
      { text: 'Check contrast between raised text and background.' },
      { text: 'Run your finger over text to confirm it is genuinely raised, not just printed.' }
    ],
    tools: ['Tape measure', 'Camera'],
    estimatedTime: '30 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 8', requirement: 'Room identification signs must include tactile characters and Grade 2 Braille. Characters must be raised at least 1mm and be between 15mm and 55mm high.' },
    related: [{ code: 'Access-to-Premises', relevance: 'Requires room identification signage in new buildings to comply with AS 1428.1.' }],
    plainEnglish: 'Room signs must have raised text you can feel with your fingers, plus Braille. This is required in new buildings and a best-practice improvement for older ones.'
  },
  solutions: [
    {
      title: 'Add Braille labels to existing signs', description: 'Apply adhesive Braille labels to current room signs.',
      resourceLevel: 'low', costRange: '$50-300', timeRequired: '2-4 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Order adhesive Braille labels.', 'Apply consistently to lower portion of each room sign.', 'Verify correct Braille.', 'Prioritise: toilets, lifts, reception, exits.', 'Add Braille floor indicators to stairwell handrails.', 'Brief staff so labels are not removed during cleaning.']
    },
    {
      title: 'Replace room signs with tactile signs', description: 'Commission AS 1428.1 compliant tactile room signs.',
      resourceLevel: 'medium', costRange: '$1,000-4,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['List all rooms requiring signs.', 'Engage a tactile signage supplier.', 'Choose materials: aluminium, acrylic, or thermoformed.', 'Confirm specifications (15-55mm letters, 1mm raised, Grade 2 Braille).', 'Install on latch side at 1200-1600mm height.', 'Verify with touch test.']
    },
    {
      title: 'Comprehensive tactile wayfinding system', description: 'Full tactile system including signs, maps, and stairway identification.',
      resourceLevel: 'high', costRange: '$5,000-15,000', timeRequired: '1-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Audit current tactile signage.', 'Develop specifications for all tactile sign types.', 'Commission tactile floor plans.', 'Install stairway identification.', 'Add tactile ground surface indicators per AS 1428.4.1.', 'Train staff on maintenance.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'No tactile signage on room doors. Blind guests could not find their rooms.', solution: 'Installed tactile room numbers with raised text and Braille on every door. Added Braille to lift controls and stairwell handrails.', outcome: 'Blind guests navigate independently. Positive reviews on accessibility platforms.', cost: '$3,500 for 120 rooms' },
    { businessType: 'local-government', businessTypeLabel: 'Library', scenario: 'Standard printed signs with no tactile elements.', solution: 'Replaced room signs with tactile versions. Added tactile floor plan at entrance and Braille shelf labels.', outcome: 'Blind members navigate independently for the first time.', cost: '$2,200' },
    { businessType: 'attraction', businessTypeLabel: 'Zoo', scenario: 'Wanted to improve navigation for blind visitors.', solution: 'Installed tactile wayfinding strips along pathways, tactile enclosure signs with Braille, and tactile trail map at entrance.', outcome: 'Became a recommended accessible destination.', cost: '$8,000' }
  ],
  resources: [
    { title: 'Vision Australia Tactile Signage', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', isAustralian: true, isFree: true },
    { title: 'AS 1428.1 Section 8', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', isAustralian: true, isFree: false },
    { title: 'Braille Authority of Australia', url: 'https://brailleaustralia.org/', type: 'website', source: 'Braille Australia', isAustralian: true, isFree: true }
  ],
  keywords: ['tactile', 'Braille', 'raised text', 'room signs', 'blind', 'vision impairment', 'AS 1428.1']
},

// ─── Entry 18: Large Print and Readable Materials ───
{
  questionId: '3.6-1-1',
  questionText: 'Are your printed materials available in large print?',
  moduleCode: '3.6',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Large print and readable materials',
  coveredQuestionIds: ['3.6-1-2', '3.6-1-5', '3.6-D-9', '3.6-D-10', '3.6-D-11', '3.6-MA-1', '3.6-MA-2', '3.6-MA-3'],
  summary: 'Printed materials should be available in large print (minimum 18pt) using sans-serif fonts with high contrast on matte paper. Keep alternative versions current when content changes, and ensure pricing is displayed accessibly.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Standard print (10-12pt) is too small for many people. Large print is the most commonly requested alternative format and benefits a wide audience: people with low vision, older adults, people with reading difficulties, and anyone in a low-light environment.',
    statistic: { value: '44%', context: 'of Australian adults have literacy levels below what is needed for everyday tasks. Larger, clearer print helps far more people than those with diagnosed vision impairment.', source: 'Australian Bureau of Statistics' }
  },
  tips: [
    { icon: 'Type', text: 'Use minimum 18pt font (24pt preferred) for large print.', priority: 1 },
    { icon: 'Eye', text: 'Choose sans-serif fonts: Arial, Verdana, or Calibri.', priority: 2 },
    { icon: 'Contrast', text: 'Print black text on white or cream matte paper.', priority: 3 },
    { icon: 'AlignLeft', text: 'Use left-aligned text with 1.5 line spacing. Avoid justified text.', priority: 4 },
    { icon: 'RefreshCw', text: 'Update large print versions whenever the standard version changes.', priority: 5 },
    { icon: 'DollarSign', text: 'Display pricing in at least 14pt with clear contrast.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing printed materials',
    steps: [
      { text: 'List all printed materials visitors encounter.' },
      { text: 'Measure font size in standard materials.', measurement: { target: 'Body text', acceptable: 'Min 12pt standard, 18pt large print', unit: 'pt' } },
      { text: 'Check whether large print versions exist for each item.' },
      { text: 'Verify font choice is sans-serif and clean.' },
      { text: 'Check paper stock: matte (good) or glossy (bad for glare).' },
      { text: 'Compare dates of large print vs standard versions.' },
      { text: 'Check pricing displays for readability.' },
      { text: 'Ask staff if they know where large print materials are stored.' }
    ],
    tools: ['Ruler or typography scale'],
    estimatedTime: '30-45 minutes'
  },
  solutions: [
    {
      title: 'Create large print versions in-house', description: 'Reformat key documents to large print using word processing software.',
      resourceLevel: 'low', costRange: '$0-100', timeRequired: '1-3 hours per document', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify top 5 documents.', 'Reformat to 18pt minimum, Arial, left-aligned, 1.5 spacing.', 'Print on A4 matte white paper.', 'Keep 5-10 copies at reception.', 'Set reminder to reprint when content changes.', 'Brief staff to offer proactively.']
    },
    {
      title: 'Professional large print design', description: 'Engage a designer for branded accessible materials with editable templates.',
      resourceLevel: 'medium', costRange: '$500-2,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Brief designer on accessible standards.', 'Provide content for top documents.', 'Request editable templates for future updates.', 'Produce print runs.', 'Store in labelled location for staff.', 'Include feedback card with each document.']
    },
    {
      title: 'Accessible publications program', description: 'Policy and workflow ensuring all documents are accessible from creation.',
      resourceLevel: 'high', costRange: '$2,000-8,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Draft accessible publishing policy.', 'Create templates for large print, Easy Read, and standard.', 'Train document-producing staff.', 'Build checks into approval process.', 'Engage professionals for Braille and audio.', 'Review annually.']
    }
  ],
  examples: [
    { businessType: 'restaurant-cafe', businessTypeLabel: 'Restaurant', scenario: 'Menu in 9pt cursive on dark paper. Customers frequently asked staff to read it aloud.', solution: 'Created large print menu (20pt Arial, black on cream matte) and QR code menu. Staff offer large print when seating.', outcome: 'Menu complaints eliminated. QR menu popular with all diners.', cost: '$80' },
    { businessType: 'attraction', businessTypeLabel: 'National Park', scenario: 'Trail guides in 10pt only.', solution: 'Reformatted to large print (18pt, sans-serif) and simplified version with photos. Available at information desk.', outcome: 'Guides popular with older visitors and families too.', cost: '$150' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Community notices in 8pt dense text.', solution: 'Adopted 12pt minimum standard. Created 18pt versions for libraries. Established template for staff.', outcome: 'Community engagement increased. Readability praised.', cost: 'Staff time only' }
  ],
  resources: [
    { title: 'RNIB Clear Print Guidelines', url: 'https://www.rnib.org.uk/', type: 'guide', source: 'RNIB', description: 'Detailed guide to readable printed materials.', isFree: true },
    { title: 'Vision Australia Print Access', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', isAustralian: true, isFree: true },
    { title: 'Scope Easy Read Resources', url: 'https://www.scopeaust.org.au/', type: 'guide', source: 'Scope Australia', isAustralian: true, isFree: true }
  ],
  keywords: ['large print', 'readable', 'font size', 'sans-serif', 'contrast', 'matte paper', 'pricing display']
},

// ─── Entry 19: Digital Alternatives and QR Codes ───
{
  questionId: '3.6-1-3',
  questionText: 'Do you offer digital versions of key documents?',
  moduleCode: '3.6',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Digital alternatives and QR codes',
  coveredQuestionIds: ['3.6-D-1', '3.6-D-2'],
  summary: 'Digital versions of your documents let visitors access information on their own devices, where they can adjust text size, use screen readers, translate content, and save for later. QR codes provide a simple bridge from physical to digital.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Smartphones are powerful assistive technology. A person with low vision can zoom in, a screen reader user can have content read aloud, and someone with limited English can translate. But only if you provide a digital version that is properly structured and accessible.',
    quote: { text: 'When a venue has a QR code that links to an accessible page, I can read everything independently using my screen reader. It is the simplest thing a venue can do to include me.', attribution: 'Screen reader user, accessibility forum' }
  },
  tips: [
    { icon: 'Smartphone', text: 'Place QR codes at key information points linking to accessible web pages.', priority: 1 },
    { icon: 'FileText', text: 'Ensure PDFs are tagged and structured for screen readers, not just scanned images.', priority: 2 },
    { icon: 'Globe', text: 'Make web versions responsive and WCAG 2.1 AA compliant.', priority: 3 },
    { icon: 'Volume2', text: 'Include a text-to-speech option on digital pages where possible.', priority: 4 },
    { icon: 'RefreshCw', text: 'Keep digital versions in sync with printed versions.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing digital alternatives',
    steps: [
      { text: 'List all printed materials and check which have a digital equivalent.' },
      { text: 'Open each digital version with a screen reader and confirm it is navigable.' },
      { text: 'Check PDF accessibility: tagged headings, alt text, reading order.' },
      { text: 'Scan all QR codes and verify links work and land on accessible pages.' },
      { text: 'Test pages for WCAG 2.1 AA: contrast, keyboard navigation, heading structure.' },
      { text: 'Check pages display well on mobile at 200% zoom.' },
      { text: 'Verify digital content matches current printed version.' }
    ],
    tools: ['Smartphone with screen reader', 'WAVE or axe accessibility checker'],
    estimatedTime: '30-60 minutes'
  },
  solutions: [
    {
      title: 'Add QR codes to existing web content', description: 'Create QR codes for existing pages and place alongside printed materials.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '2-4 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify materials with existing web equivalents.', 'Generate QR codes using a free generator.', 'Print labels with "Scan for accessible digital version".', 'Place beside printed materials.', 'Test each code with multiple devices.', 'Check linked pages with screen readers.']
    },
    {
      title: 'Create accessible web pages for key documents', description: 'Build dedicated accessible HTML pages for top visitor documents.',
      resourceLevel: 'medium', costRange: '$500-3,000', timeRequired: '1-3 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Prioritise top 5 documents.', 'Create responsive HTML with proper headings, alt text, keyboard nav.', 'Test against WCAG 2.1 AA.', 'Generate QR codes and deploy signage.', 'Include font size controls and high-contrast toggle.', 'Set up analytics.']
    },
    {
      title: 'Integrated accessible content management', description: 'CMS that auto-generates accessible digital versions alongside print.',
      resourceLevel: 'high', costRange: '$3,000-15,000', timeRequired: '1-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Select CMS with accessibility features.', 'Migrate key content.', 'Configure automatic accessible output.', 'Train staff on entry standards.', 'Implement QR code generation in workflow.', 'Review accessibility quarterly.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Aquarium', scenario: 'Printed panels at exhibits with no digital option.', solution: 'Added QR codes beside each panel linking to accessible pages with audio descriptions. Each page screen reader tested.', outcome: 'Blind visitors access exhibit info independently. Engagement time increased for all.', cost: '$1,200' },
    { businessType: 'restaurant-cafe', businessTypeLabel: 'Cafe', scenario: 'Chalkboard menu with no digital option.', solution: 'Created accessible one-page menu website and placed QR code on each table.', outcome: 'Screen reader users read the full menu independently.', cost: '$0 (free website builder)' },
    { businessType: 'retail', businessTypeLabel: 'Department Store', scenario: 'Paper catalogues with no accessible version.', solution: 'Published as accessible PDF with tagged headings and alt text. QR codes in-store link to relevant sections.', outcome: 'Screen reader users browse products independently.', cost: '$800' }
  ],
  resources: [
    { title: 'WCAG 2.1 Quick Reference', url: 'https://www.w3.org/WAI/WCAG21/quickref/', type: 'website', source: 'W3C', isFree: true },
    { title: 'PDF Accessibility Checker (PAC)', url: 'https://pdfua.foundation/en/pac-download', type: 'tool', source: 'PDF/UA Foundation', isFree: true },
    { title: 'QR Code Monkey', url: 'https://www.qrcode-monkey.com/', type: 'tool', source: 'QR Code Monkey', isFree: true }
  ],
  keywords: ['QR code', 'digital', 'accessible PDF', 'screen reader', 'web version', 'mobile', 'WCAG']
},

// ─── Entry 20: Alternative Formats: Braille, Audio, Easy Read ───
{
  questionId: '3.6-1-4',
  questionText: 'Do you provide key information in alternative formats such as Easy Read and plain English?',
  moduleCode: '3.6',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Alternative formats: Braille, audio, Easy Read',
  coveredQuestionIds: ['3.6-D-3', '3.6-D-4', '3.6-D-6'],
  summary: 'Alternative formats go beyond large print to include Braille, audio guides, Easy Read (simple language with images), and plain English versions. These serve people with a range of disabilities including blindness, intellectual disability, and literacy challenges.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Not everyone can read standard documents regardless of print size. People who are blind need Braille or audio. People with intellectual disability need Easy Read with images. People with low literacy need plain English. Providing a range of formats ensures no one is excluded.',
    statistic: { value: '4.4 million', context: 'Australians have a disability. Many need information in formats other than standard print to participate fully.', source: 'ABS Survey of Disability, Ageing and Carers' }
  },
  tips: [
    { icon: 'FileText', text: 'Start with your most critical documents: safety info, menus, key policies, visitor guides.', priority: 1 },
    { icon: 'Image', text: 'For Easy Read, pair every key point with a supporting image or icon.', priority: 2 },
    { icon: 'Type', text: 'For plain English, use short sentences (max 15 words), active voice, common words.', priority: 3 },
    { icon: 'Headphones', text: 'Offer audio versions via QR code, app, or device loan.', priority: 4 },
    { icon: 'Users', text: 'Test alternative formats with people from the target audience.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing alternative formats',
    steps: [
      { text: 'List top 5 visitor documents. Check for Braille, audio, and Easy Read versions.' },
      { text: 'Review Easy Read: short sentences, common words, supporting images?' },
      { text: 'Have Braille documents verified by a Braille reader.' },
      { text: 'Listen to audio versions: clear, well-paced, free of background noise?' },
      { text: 'Check plain English: active voice, no jargon, defined terms?' },
      { text: 'Ask staff whether they know what formats are available.' },
      { text: 'Verify all formats are current (match latest standard version).' }
    ],
    tools: ['Alternative format checklist'],
    estimatedTime: '30-45 minutes'
  },
  solutions: [
    {
      title: 'Create Easy Read and plain English in-house', description: 'Rewrite key documents using free templates from Scope Australia.',
      resourceLevel: 'low', costRange: '$0-300', timeRequired: '3-6 hours per document', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Choose top 3 documents.', 'Rewrite in plain English: max 15 words per sentence.', 'For Easy Read: add image beside each point, 16pt minimum.', 'Use Scope Australia free templates.', 'Test with a person with intellectual disability.', 'Print and store at reception.']
    },
    {
      title: 'Commission professional alternative formats', description: 'Engage specialists for Braille, audio, and validated Easy Read.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'specialist', impact: 'moderate',
      steps: ['Commission Braille from Vision Australia.', 'Record audio using professional narrator.', 'Engage Easy Read conversion service.', 'Review by people with target disabilities.', 'Store at reception, make digital versions online.', 'Brief staff on available formats.']
    },
    {
      title: 'Establish alternative formats program', description: 'Policy and workflow for producing all documents in multiple formats.',
      resourceLevel: 'high', costRange: '$3,000-10,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Draft formats policy specifying which documents need which formats.', 'Engage preferred suppliers.', 'Build format production into document workflow.', 'Train all document-producing staff.', 'Create register tracking conversions and dates.', 'Review annually with disability advisory input.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Zoo', scenario: 'Visitor guides in standard print only.', solution: 'Created Easy Read version with animal photos and simple instructions. Produced Braille map. Audio descriptions via QR codes.', outcome: 'Supported accommodation groups visit regularly. Easy Read guide popular with families too.', cost: '$2,500' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Planning documents too complex for residents with intellectual disability.', solution: 'Produced Easy Read summaries. Used plain English for all consultation materials.', outcome: 'Engagement from people with disability increased. Fewer explanation calls.', cost: '$300 for Easy Read review' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'No Braille or audio info in guest rooms.', solution: 'Braille room information cards and audio welcome via QR code in accessible rooms.', outcome: 'Blind guests report markedly improved experience.', cost: '$1,800' }
  ],
  resources: [
    { title: 'Scope Australia Easy Read', url: 'https://www.scopeaust.org.au/', type: 'guide', source: 'Scope Australia', isAustralian: true, isFree: true },
    { title: 'Vision Australia Alternative Formats', url: 'https://www.visionaustralia.org/', type: 'website', source: 'Vision Australia', isAustralian: true },
    { title: 'Plain English Foundation', url: 'https://www.plainenglishfoundation.com/', type: 'website', source: 'Plain English Foundation', isAustralian: true }
  ],
  keywords: ['Easy Read', 'Braille', 'audio', 'plain English', 'alternative formats', 'intellectual disability']
},


// ─── Entry 23: Tactile, audio and visual information ───
{
  questionId: '3.7-PC-5',
  questionText: 'Do you provide tactile or multi-sensory information displays at your venue?',
  moduleCode: '3.7',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Tactile, audio and visual information',
  coveredQuestionIds: ['3.7-DD-5a', '3.7-PC-8', '3.7-DD-8a'],
  summary: 'Multi-sensory information provision ensures visitors who cannot rely on vision alone can still access key content. Tactile models, audio descriptions, and visual displays working together create an inclusive information environment.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Information presented in only one sensory mode excludes people who cannot access that mode. A person who is blind cannot read a wall panel. A person who is Deaf cannot hear an audio guide. Multi-sensory approaches ensure everyone can engage with your content regardless of their sensory abilities.',
    statistic: { value: '575,000+', context: 'Australians are blind or have low vision, and 3.6 million have some hearing loss. Multi-sensory information serves both groups.', source: 'Vision Australia and Hearing Australia' }
  },
  tips: [
    { icon: 'Hand', text: 'Provide tactile models or 3D representations of key exhibits or features.', detail: 'Tactile models allow blind visitors to understand spatial layouts, artwork, or objects through touch.', priority: 1 },
    { icon: 'Headphones', text: 'Offer audio descriptions via handsets, app, or QR-triggered audio.', detail: 'Audio descriptions should cover visual content that sighted visitors take in naturally: colours, spatial arrangements, facial expressions.', priority: 2 },
    { icon: 'Monitor', text: 'Use visual displays with captions for any audio content.', detail: 'Digital screens showing captions ensure Deaf visitors access spoken information.', priority: 3 },
    { icon: 'Layers', text: 'Combine text, images, tactile, and audio at key information points.', priority: 4 },
    { icon: 'Volume2', text: 'Keep background noise below 35dB in areas with audio information.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing multi-sensory information',
    steps: [
      { text: 'List all information points in your venue (panels, exhibits, displays, kiosks).' },
      { text: 'For each, note which senses it uses: sight only, hearing only, touch, or multiple.' },
      { text: 'Identify gaps: are any key information points single-sense only?' },
      { text: 'Check audio content for captions or transcripts.' },
      { text: 'Check visual content for audio description availability.' },
      { text: 'Test tactile elements: are they clearly labelled in Braille and large print?' },
      { text: 'Measure ambient noise near audio information points.', measurement: { target: 'Background noise', acceptable: 'Below 35dB for speech clarity', unit: 'dB' } }
    ],
    tools: ['Sound level meter app', 'Camera', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must not discriminate by failing to provide information in accessible formats. Multi-sensory provision is a reasonable adjustment.' },
    related: [
      { code: 'AS1428.1', relevance: 'Section 8 covers tactile and Braille signage requirements.' },
      { code: 'WCAG', relevance: 'Guideline 1.1 requires text alternatives for non-text content; Guideline 1.2 covers time-based media alternatives.' }
    ],
    plainEnglish: 'You must provide information in ways that people with different sensory abilities can access. This means not relying solely on sight or hearing.',
    complianceNote: 'Multi-sensory information is both a legal obligation under the DDA and a significant enhancer of visitor experience for all audiences.'
  },
  solutions: [
    {
      title: 'Add audio and tactile supplements to key displays',
      description: 'Create QR-triggered audio descriptions and simple tactile elements for your top information points.',
      resourceLevel: 'low', costRange: '$200-800', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify 5-10 most important information points.', 'Write audio description scripts (60-90 seconds each).', 'Record using a clear voice in a quiet room.', 'Upload to your website and generate QR codes.', 'Place QR codes beside each display with "Audio description available" label.', 'For tactile: create simple raised diagrams using puff paint or 3D printing.']
    },
    {
      title: 'Multi-sensory information stations',
      description: 'Install dedicated stations combining visual, audio, and tactile elements at key locations.',
      resourceLevel: 'medium', costRange: '$2,000-10,000', timeRequired: '4-8 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Design station layout with screen, speaker, and tactile surface.', 'Commission tactile models from a specialist supplier.', 'Record professional audio descriptions.', 'Install captioned video content on screens.', 'Add Braille labels to all tactile elements.', 'Test with blind, Deaf, and deafblind users.', 'Train staff on how the stations work.']
    },
    {
      title: 'Comprehensive multi-sensory interpretation program',
      description: 'Engage an accessibility consultant to redesign your entire information delivery for multi-sensory access.',
      resourceLevel: 'high', costRange: '$15,000-50,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission an interpretation accessibility audit.', 'Develop a multi-sensory interpretation strategy.', 'Design tactile models for all key exhibits or features.', 'Create a full audio description tour.', 'Install captioned screens at all audio information points.', 'Develop a companion app with integrated audio, visual, and haptic feedback.', 'Test with diverse disability groups.', 'Train all staff.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Museum', scenario: 'Exhibition panels were text-only with no audio or tactile options.', solution: 'Added QR-triggered audio descriptions, tactile reproductions of 6 key artefacts, and captioned video summaries at each gallery entrance.', outcome: 'Blind and Deaf visitor numbers doubled. Won a national accessibility award.', cost: '$12,000', timeframe: '3 months' },
    { businessType: 'attraction', businessTypeLabel: 'Botanic Gardens', scenario: 'Plant labels were small text only.', solution: 'Created tactile plant identification stations with textured leaf samples, Braille labels, and audio triggered by NFC tags.', outcome: 'Became a recommended destination for blind and low-vision visitors.', cost: '$5,500', timeframe: '6 weeks' },
    { businessType: 'local-government', businessTypeLabel: 'Visitor Centre', scenario: 'Tourism information was visual brochures only.', solution: 'Added audio kiosk with regional highlights, tactile map of the area, and large-print brochures.', outcome: 'Positive feedback from vision-impaired visitors. Audio kiosk popular with all visitors.', cost: '$3,200', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Museums and Galleries Accessibility Toolkit', url: 'https://www.museumsandgalleries.nsw.gov.au/', type: 'guide', source: 'Museums and Galleries NSW', description: 'Guidance on multi-sensory interpretation in cultural venues.', isAustralian: true, isFree: true },
    { title: 'Audio Description Guidelines', url: 'https://www.mediaaccess.org.au/', type: 'guide', source: 'Media Access Australia', description: 'How to create quality audio descriptions for exhibitions and venues.', isAustralian: true, isFree: true },
    { title: 'Tactile Graphics Resources', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', description: 'Creating tactile maps, models, and diagrams.', isAustralian: true, isFree: true }
  ],
  keywords: ['tactile', 'audio description', 'multi-sensory', 'captions', 'Braille', 'touch', 'visual display', '3D model']
},

// ─── Entry 24: Hearing support and captioning on-site ───
{
  questionId: '3.7-PC-6',
  questionText: 'Do you provide hearing support such as captioning or hearing loops for on-site information?',
  moduleCode: '3.7',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Hearing support and captioning on-site',
  coveredQuestionIds: ['3.7-DD-6a', '3.7-DD-6b', '3.7-PC-7', '3.7-DD-7a', '3.7-DD-7b'],
  summary: 'On-site hearing support includes hearing loops at service counters and presentation areas, real-time captioning on screens, Auslan interpretation for tours and events, and assistive listening devices available for loan.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Hearing loss is one of the most common disabilities in Australia. Many people with hearing aids or cochlear implants rely on hearing loops to filter out background noise and receive clear audio. Without on-site hearing support, spoken information at counters, during tours, or in presentations is inaccessible.',
    statistic: { value: '3.6 million', context: 'Australians have some degree of hearing loss, and this is projected to grow to 7.8 million by 2060.', source: 'Hearing Australia' },
    quote: { text: 'When a venue has a hearing loop, the difference is like night and day. Without it, everything is just noise. With it, I can hear every word clearly.', attribution: 'Hearing aid user, accessibility survey' }
  },
  tips: [
    { icon: 'Ear', text: 'Install hearing loops at reception, service counters, and main presentation areas.', detail: 'Counter loops cover a 1-2 metre area. Area loops cover an entire room. Both must meet AS 1428.5 for signal quality.', priority: 1 },
    { icon: 'Monitor', text: 'Display captions on screens for all spoken content in public areas.', priority: 2 },
    { icon: 'Users', text: 'Offer Auslan interpreters for scheduled tours and key events.', detail: 'Book through Auslan Services or your state Deaf society. Give 2 weeks notice minimum.', priority: 3 },
    { icon: 'Headphones', text: 'Keep assistive listening devices (ALDs) at reception for loan.', priority: 4 },
    { icon: 'AlertTriangle', text: 'Display the hearing loop symbol wherever a loop is installed.', priority: 5 },
    { icon: 'Volume2', text: 'Test hearing loops monthly and log results.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing on-site hearing support',
    steps: [
      { text: 'List all locations where spoken information is provided (counters, tour start points, presentation rooms, information desks).' },
      { text: 'Check for hearing loop installations at each location. Look for the loop symbol.' },
      { text: 'Test each loop using a hearing loop receiver or smartphone app.', measurement: { target: 'Loop signal strength', acceptable: 'Clear speech without distortion at all positions within the loop area', unit: 'quality check' } },
      { text: 'Check whether captions are displayed for PA announcements or video content.' },
      { text: 'Ask staff if assistive listening devices are available and where they are stored.' },
      { text: 'Check whether Auslan interpreters are offered for tours or events.' },
      { text: 'Review the maintenance log for hearing loops: when were they last tested?' },
      { text: 'Verify the hearing loop symbol is displayed at each loop location.' }
    ],
    tools: ['Hearing loop test receiver or smartphone app', 'Camera', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.5', section: 'Hearing augmentation', requirement: 'Hearing augmentation systems must be provided in rooms where amplified speech is used. Induction loops must comply with AS 60118.4 for field strength and frequency response.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires hearing augmentation in assembly areas, ticket counters, and information desks in new buildings.' },
      { code: 'DDA', relevance: 'Failing to provide hearing support may constitute discrimination against people who are Deaf or hard of hearing.' }
    ],
    plainEnglish: 'If you have service counters, presentation rooms, or public address systems, you need hearing loops or equivalent systems so people with hearing aids can hear clearly.',
    complianceNote: 'Hearing loops require regular testing. A loop that is installed but not working provides no benefit and may give a false impression of accessibility.'
  },
  solutions: [
    {
      title: 'Install portable counter loops',
      description: 'Purchase portable hearing loop pads for service counters and information desks.',
      resourceLevel: 'low', costRange: '$300-800', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Purchase portable counter loop units (one per service desk).', 'Place on counter connected to existing microphone or standalone.', 'Display the hearing loop symbol prominently.', 'Train staff to check the loop is switched on each morning.', 'Set up monthly testing schedule.', 'Keep spare batteries or charger accessible.']
    },
    {
      title: 'Install fixed hearing loops and captioning screens',
      description: 'Install permanent hearing loops in key areas and captioning displays for public announcements.',
      resourceLevel: 'medium', costRange: '$3,000-15,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Engage a hearing loop installer certified to AS 60118.4.', 'Survey key areas: reception, main hall, meeting rooms.', 'Install loops with appropriate coverage for each space.', 'Install captioning screens connected to PA system.', 'Commission and test each loop to standard.', 'Display loop symbols at all installed locations.', 'Train staff on operation and basic troubleshooting.']
    },
    {
      title: 'Comprehensive hearing access program',
      description: 'Full hearing access including loops, captioning, Auslan provision, and assistive device library.',
      resourceLevel: 'high', costRange: '$20,000-50,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission a hearing access audit.', 'Install hearing loops throughout the venue.', 'Deploy real-time captioning system (CART) for events.', 'Establish Auslan interpreter booking relationship.', 'Purchase a library of assistive listening devices for loan.', 'Install visual alert systems linked to fire and PA.', 'Create hearing access page on your website.', 'Train all staff on hearing access equipment and communication.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Theatre', scenario: 'No hearing support for performances.', solution: 'Installed area hearing loop in the auditorium, captioning screen for select performances, and partnered with a local Auslan interpreter.', outcome: 'Deaf and hard-of-hearing attendance tripled. Captioned performances sell out.', cost: '$18,000', timeframe: '6 weeks' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Reception counter had no hearing loop.', solution: 'Installed portable counter loops at reception and in meeting rooms. Added the hearing loop symbol to signage.', outcome: 'Residents with hearing aids can now conduct business independently.', cost: '$600', timeframe: '2 days' },
    { businessType: 'accommodation', businessTypeLabel: 'Convention Centre', scenario: 'Conference rooms lacked hearing augmentation.', solution: 'Installed permanent hearing loops in all conference rooms, provided portable receivers, and offered live captioning as a bookable service.', outcome: 'Became the preferred venue for conferences requiring hearing access.', cost: '$25,000', timeframe: '8 weeks' }
  ],
  resources: [
    { title: 'Hearing Loop Installers Guide', url: 'https://www.hearingaustralia.gov.au/', type: 'guide', source: 'Hearing Australia', description: 'Guidance on selecting and installing hearing loops to Australian standards.', isAustralian: true, isFree: true },
    { title: 'Auslan Services', url: 'https://www.deaf.org.au/', type: 'website', source: 'Deaf Australia', description: 'Booking Auslan interpreters for events and tours.', isAustralian: true, isFree: true },
    { title: 'Media Access Australia Captioning', url: 'https://www.mediaaccess.org.au/', type: 'guide', source: 'Media Access Australia', description: 'Standards and providers for live and pre-recorded captioning.', isAustralian: true, isFree: true },
    { title: 'AS 60118.4 Hearing Loop Standard', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', description: 'Technical standard for hearing loop performance.', isAustralian: true, isFree: false }
  ],
  keywords: ['hearing loop', 'captioning', 'Auslan', 'hearing aid', 'assistive listening', 'counter loop', 'CART', 'hearing augmentation']
},

// ─── Entry 25: Communication supports and accessible updates ───
{
  questionId: '3.7-PC-9',
  questionText: 'Do you provide communication supports for people who use alternative communication methods?',
  moduleCode: '3.7',
  moduleGroup: 'during-visit',
  diapCategory: 'information-communication-marketing',
  title: 'Communication supports and accessible updates',
  coveredQuestionIds: ['3.7-DD-9a', '3.7-DD-9b', '3.7-PC-10', '3.7-DD-10a', '3.7-DD-11a'],
  summary: 'Communication supports include picture-based communication boards, plain language materials, AAC (augmentative and alternative communication) device awareness, and delivering real-time updates in accessible formats including visual, auditory, and digital channels.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Not everyone communicates using speech. People with intellectual disability, autism, aphasia, or motor conditions may use picture boards, AAC devices, sign language, or gestures. Without communication supports, these visitors cannot ask questions, make requests, or understand updates. Real-time updates (schedule changes, safety alerts) must also reach people who cannot hear PA announcements or read small screens.',
    statistic: { value: '1.2 million', context: 'Australians have a communication disability. Many use alternative methods that require venues to adapt their communication approach.', source: 'Speech Pathology Australia' }
  },
  tips: [
    { icon: 'MessageSquare', text: 'Display a picture-based communication board at reception and key service points.', detail: 'Boards should include common requests: toilet, help, pain, drink, directions. Use universally recognised symbols.', priority: 1 },
    { icon: 'Users', text: 'Train staff to recognise and be patient with alternative communication methods.', priority: 2 },
    { icon: 'Type', text: 'Use plain language (short sentences, common words) in all visitor-facing signage and announcements.', priority: 3 },
    { icon: 'Monitor', text: 'Display real-time updates on screens with text, not just audio announcements.', priority: 4 },
    { icon: 'Smartphone', text: 'Push digital notifications via app or SMS for schedule changes and alerts.', priority: 5 },
    { icon: 'Lightbulb', text: 'Provide pen and paper as a backup communication method at every counter.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing communication supports',
    steps: [
      { text: 'Check if a picture communication board is displayed at reception or service counters.' },
      { text: 'Ask staff: what would you do if a visitor used a communication device or pointed to pictures?' },
      { text: 'Review PA announcements: are they also displayed visually on screens?' },
      { text: 'Check whether schedule changes or delays are communicated in text as well as speech.' },
      { text: 'Look for plain language in visitor-facing materials (short sentences, common words, no jargon).' },
      { text: 'Check if pen and paper are available at service counters.' },
      { text: 'Ask whether staff have received training on communicating with people who use AAC.' }
    ],
    tools: ['Checklist', 'Camera'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must make reasonable adjustments to communicate effectively with people with disability, including providing information in accessible formats.' },
    related: [
      { code: 'UNCRPD', relevance: 'Article 21 requires States Parties to ensure people with disability can receive and impart information through all forms of communication of their choice.' }
    ],
    plainEnglish: 'You must be willing and able to communicate with visitors who do not use speech. This means having visual aids, written options, and staff who know how to adapt.',
    complianceNote: 'Communication access is often overlooked but is a core requirement of the DDA. The Communication Access Symbol program recognises venues that meet this standard.'
  },
  solutions: [
    {
      title: 'Set up basic communication supports',
      description: 'Download and display free communication boards and train staff on basic alternative communication.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '2-4 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Download free communication boards from Scope Australia.', 'Laminate and display at reception, service counters, and information desks.', 'Place pen and notepad at every counter.', 'Brief staff: allow extra time, maintain eye contact, use gestures, and point to pictures.', 'Add visual display screens for PA announcements where possible.', 'Create a one-page staff guide on alternative communication.']
    },
    {
      title: 'Communication access accreditation',
      description: 'Apply for the Communication Access Symbol through Scope Australia.',
      resourceLevel: 'medium', costRange: '$500-3,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Contact Scope Australia about the Communication Access Symbol program.', 'Complete the self-assessment against their criteria.', 'Train all customer-facing staff in communication access.', 'Install communication boards and visual aids.', 'Arrange an assessment visit from Scope.', 'Display the Communication Access Symbol once accredited.', 'Schedule annual review.']
    },
    {
      title: 'Integrated accessible communication system',
      description: 'Deploy multi-channel communication including digital displays, app notifications, and staff trained in key signs.',
      resourceLevel: 'high', costRange: '$5,000-20,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Install digital display screens at key locations connected to your PA system.', 'Deploy a visitor notification system (app or SMS) for real-time updates.', 'Commission custom communication boards tailored to your venue.', 'Train all staff in basic Auslan signs and AAC awareness.', 'Implement plain language policy for all visitor communications.', 'Engage people with communication disability in testing.', 'Review and update quarterly.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Zoo', scenario: 'Visitors using AAC devices could not communicate with staff.', solution: 'Installed communication boards at entry, cafe, and gift shop. Trained all staff in basic communication strategies. Applied for Communication Access Symbol.', outcome: 'Became a Communication Access accredited venue. Support groups visit regularly.', cost: '$800', timeframe: '3 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Sports Stadium', scenario: 'PA announcements were the only way to communicate schedule changes.', solution: 'Added visual display screens at all gates showing real-time updates. Implemented push notifications via the venue app.', outcome: 'Deaf and hard-of-hearing fans no longer miss important updates.', cost: '$8,000', timeframe: '6 weeks' },
    { businessType: 'local-government', businessTypeLabel: 'Library', scenario: 'Staff unsure how to help non-verbal patrons.', solution: 'Displayed communication boards at all service points. Staff completed Scope communication access training. Pen and paper always available.', outcome: 'Non-verbal patrons visit independently. Staff confidence improved markedly.', cost: '$200', timeframe: '1 week' }
  ],
  resources: [
    { title: 'Communication Access Symbol', url: 'https://www.scopeaust.org.au/service/communication-access/', type: 'guide', source: 'Scope Australia', description: 'Information about the Communication Access Symbol program and how to become accredited.', isAustralian: true, isFree: true },
    { title: 'Free Communication Boards', url: 'https://www.scopeaust.org.au/', type: 'template', source: 'Scope Australia', description: 'Downloadable picture communication boards for various settings.', isAustralian: true, isFree: true },
    { title: 'Speech Pathology Australia', url: 'https://www.speechpathologyaustralia.org.au/', type: 'guide', source: 'Speech Pathology Australia', description: 'Resources on communicating with people who use AAC.', isAustralian: true, isFree: true }
  ],
  keywords: ['communication board', 'AAC', 'alternative communication', 'plain language', 'real-time updates', 'visual display', 'non-verbal', 'Communication Access Symbol']
},

// ─── Entry 26: Inclusive activity design ───
{
  questionId: '3.8-1-2',
  questionText: 'Are your activities and experiences designed to include people with disability?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Inclusive activity design',
  coveredQuestionIds: ['3.8-1-3', '3.8-D-1', '3.8-D-2', '3.8-D-18'],
  summary: 'Inclusive activity design means building accessibility into experiences from the start rather than retrofitting. This includes offering adaptive alternatives, flexible participation options, and ensuring people with disability can engage meaningfully alongside everyone else.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'When activities are designed without considering disability, people are excluded or offered inferior alternatives. Inclusive design creates experiences where everyone participates together. This benefits not only people with disability but also older adults, parents with prams, and anyone with temporary limitations.',
    statistic: { value: '4.4 million', context: 'Australians have a disability. Many want to participate in the same activities as everyone else, with appropriate support or adaptation.', source: 'ABS Survey of Disability, Ageing and Carers 2018' },
    quote: { text: 'I do not want a separate "accessible" version. I want to do the same thing as everyone else, just with the right support.', attribution: 'Wheelchair user, recreation survey' }
  },
  tips: [
    { icon: 'Accessibility', text: 'Design every activity with at least one adaptive participation option.', detail: 'For example, a walking tour could offer a seated version, a kayak tour could include a stable adaptive kayak.', priority: 1 },
    { icon: 'Users', text: 'Include people with disability in activity design and testing.', priority: 2 },
    { icon: 'ClipboardList', text: 'Publish accessibility information for each activity before booking.', detail: 'Include physical requirements, sensory elements, available adaptations, and how to request support.', priority: 3 },
    { icon: 'Heart', text: 'Allow companions and support workers to participate free or at reduced cost.', priority: 4 },
    { icon: 'AlertTriangle', text: 'Never assume someone cannot participate. Ask what support they need.', priority: 5 },
    { icon: 'BookOpen', text: 'Provide social stories or visual schedules for activities to support neurodivergent visitors.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing activity inclusiveness',
    steps: [
      { text: 'List all activities and experiences you offer.' },
      { text: 'For each, identify the physical, sensory, and cognitive demands.' },
      { text: 'Note what adaptive options currently exist for each activity.' },
      { text: 'Check your booking/information materials: is accessibility information published for each activity?' },
      { text: 'Review whether companions/support workers are accommodated in pricing.' },
      { text: 'Ask: has anyone with a disability tested this activity and provided feedback?' },
      { text: 'Check whether social stories or visual schedules are available.' },
      { text: 'Review complaint or feedback records for accessibility-related issues with activities.' }
    ],
    tools: ['Activity checklist', 'Camera'],
    estimatedTime: '30-60 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must not discriminate in the way they provide goods and services, including recreational and leisure activities. Reasonable adjustments must be made.' },
    related: [
      { code: 'UNCRPD', relevance: 'Article 30 recognises the right of people with disability to participate in cultural life, recreation, and sport on an equal basis.' }
    ],
    plainEnglish: 'You must make reasonable adjustments so people with disability can participate in your activities. You cannot refuse participation based on disability alone.',
    complianceNote: 'A blanket policy of "must be able-bodied to participate" is likely discriminatory. Individual risk assessments are acceptable; blanket exclusions are not.'
  },
  solutions: [
    {
      title: 'Create adaptive options for existing activities',
      description: 'Review each activity and develop at least one adaptive participation pathway.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['List all activities with their physical, sensory, and cognitive demands.', 'For each, brainstorm one adaptive option (seated version, guided version, sensory-modified version).', 'Document the adaptive options in your booking information.', 'Train activity leaders on offering and facilitating adaptations.', 'Create a feedback mechanism for participants with disability.', 'Review and update quarterly.']
    },
    {
      title: 'Acquire adaptive equipment and train staff',
      description: 'Purchase adaptive equipment and train activity leaders in inclusive facilitation.',
      resourceLevel: 'medium', costRange: '$2,000-10,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Research adaptive equipment for your activities (adaptive bikes, beach wheelchairs, sensory kits).', 'Purchase priority items.', 'Train activity leaders in inclusive facilitation techniques.', 'Create social stories and visual schedules for each activity.', 'Partner with local disability organisations to test activities.', 'Publish detailed accessibility information online.', 'Promote adaptive options through disability networks.']
    },
    {
      title: 'Co-design inclusive activity program',
      description: 'Engage disability consultants and community members to redesign your activity program for inclusion.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage an inclusive recreation consultant.', 'Recruit a disability advisory panel.', 'Audit all activities against universal design principles.', 'Co-design adaptive options with people with disability.', 'Purchase specialist adaptive equipment.', 'Train all activity staff.', 'Create comprehensive accessibility guides for each activity.', 'Launch with disability community event.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Adventure Park', scenario: 'All activities required walking and standing. Wheelchair users had nothing to do.', solution: 'Introduced adaptive flying fox harness, all-terrain wheelchair for bush walk, and seated archery. Published accessibility info for each activity.', outcome: 'Wheelchair bookings went from zero to 15% of total. Featured in disability travel blog.', cost: '$8,500', timeframe: '6 weeks' },
    { businessType: 'attraction', businessTypeLabel: 'Art Gallery', scenario: 'Workshops assumed fine motor skills.', solution: 'Offered adaptive tools (large-grip brushes, mouth/foot painting options). Created sensory-friendly sessions with reduced noise and lighting.', outcome: 'Workshop participation by people with disability tripled.', cost: '$500', timeframe: '2 weeks' },
    { businessType: 'recreation', businessTypeLabel: 'Surf School', scenario: 'No option for people with physical disability.', solution: 'Partnered with Disabled Surfers Association. Acquired adaptive surfboards and trained instructors. Offered inclusive group sessions.', outcome: 'Regular inclusive surf days. Strong media coverage and community goodwill.', cost: '$3,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Disability Sports Australia', url: 'https://www.sports.org.au/', type: 'guide', source: 'Disability Sports Australia', description: 'Resources for making sport and recreation inclusive.', isAustralian: true, isFree: true },
    { title: 'Inclusive Tourism Guidelines', url: 'https://www.tourism.australia.com/en/events-and-tools/accessible-tourism.html', type: 'guide', source: 'Tourism Australia', description: 'Guidance on creating inclusive tourism experiences.', isAustralian: true, isFree: true },
    { title: 'Social Stories Templates', url: 'https://www.amaze.org.au/', type: 'template', source: 'Amaze (Autism Victoria)', description: 'Templates for creating social stories for venues and activities.', isAustralian: true, isFree: true }
  ],
  keywords: ['inclusive design', 'adaptive', 'activity', 'participation', 'recreation', 'social story', 'companion', 'support worker']
},

// ─── Entry 27: Spectator seating and event spaces ───
{
  questionId: '3.8-D-3',
  questionText: 'Do your spectator and event spaces have accessible seating areas with companion positions?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Spectator seating and event spaces',
  coveredQuestionIds: ['3.8-D-4', '3.8-D-5', '3.8-D-6', '3.8-D-7', '3.8-D-8'],
  summary: 'Accessible spectator areas require wheelchair spaces distributed throughout the venue with companion seating, maintained sightlines when others stand, elevated viewing options, and protection from weather while maintaining the same experience as other attendees.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Spectator events are a core social and cultural experience. When wheelchair users are grouped in one corner with poor views, or when sightlines are blocked by standing crowds, the event experience is fundamentally unequal. Good spectator access means equivalent choice, views, and social connection.',
    statistic: { value: '1 in 6', context: 'Australians have a disability. At a 5,000-person event, that means approximately 830 attendees may need some form of accessible seating or viewing.', source: 'ABS' }
  },
  tips: [
    { icon: 'Eye', text: 'Ensure accessible seating has equivalent sightlines maintained when others stand.', priority: 1 },
    { icon: 'Accessibility', text: 'Distribute wheelchair spaces across multiple locations, not just one area.', detail: 'Provide options at front, middle, and rear of the venue.', priority: 2 },
    { icon: 'Users', text: 'Place companion seats immediately adjacent to every wheelchair space.', priority: 3 },
    { icon: 'Shield', text: 'Provide weather protection equivalent to covered general seating.', priority: 4 },
    { icon: 'MapPin', text: 'Ensure accessible seating is on an accessible path from entrance, toilets, and concessions.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing spectator accessibility',
    steps: [
      { text: 'Count wheelchair spaces and compare to total capacity.', measurement: { target: 'Wheelchair spaces', acceptable: 'Minimum 1 per 100 seats', unit: 'ratio' } },
      { text: 'Check distribution: are accessible seats available in multiple price/view categories?' },
      { text: 'Sit in a wheelchair at each accessible position and check sightlines when surrounding seats are occupied.' },
      { text: 'Verify companion seats are adjacent, at the same level.' },
      { text: 'Check accessible path from entrance to seating, toilets, and food.' },
      { text: 'Check weather protection at accessible seating locations.' },
      { text: 'Review booking system: can customers select accessible seating online?' }
    ],
    tools: ['Tape measure', 'Wheelchair for sightline testing', 'Camera'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'Access-to-Premises', section: 'Part D3.8', requirement: 'Wheelchair seating spaces in assembly buildings per Table D3.8 with companion seating and maintained sightlines.' },
    related: [
      { code: 'AS1428.1', relevance: 'Section 15 specifies wheelchair space dimensions (800mm x 1300mm) and surface requirements.' },
      { code: 'DDA', relevance: 'Providing inferior seating to people with disability constitutes discrimination.' }
    ],
    plainEnglish: 'If you host events with seating, you must provide wheelchair spaces with good views, companion seats, and equivalent experience to general seating.',
    complianceNote: 'Best practice significantly exceeds minimum ratios. Many venues now provide 2-3% accessible seating rather than the minimum.'
  },
  solutions: [
    {
      title: 'Designate and improve existing accessible seating',
      description: 'Mark wheelchair positions with best available sightlines and add companion seating.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify positions with best sightlines for wheelchair users.', 'Remove seats to create 800mm x 1300mm clear spaces.', 'Mark companion positions adjacent to each.', 'Add to floor plans and briefing materials.', 'Update booking system.', 'Brief event staff.']
    },
    {
      title: 'Install raised viewing platforms and flexible seating',
      description: 'Build platforms at rear positions and install modular seating allowing wheelchair integration.',
      resourceLevel: 'medium', costRange: '$5,000-20,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Design raised platforms at rear seating positions.', 'Install guardrails and ramp access to platforms.', 'Purchase modular seating that can be reconfigured for wheelchair spaces.', 'Add weather protection at accessible positions.', 'Update online booking with view photos from accessible positions.', 'Test with wheelchair users.', 'Train crew on setup.']
    },
    {
      title: 'Professional accessible seating redesign',
      description: 'Full venue seating redesign by an access consultant maximising choice and sightlines.',
      resourceLevel: 'high', costRange: '$20,000-80,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage access consultant for seating audit.', 'Design distributed accessible positions exceeding minimums by 50%.', 'Install platforms with sightline engineering.', 'Integrate into booking system with 3D view previews.', 'Add accessible concession service at accessible seating.', 'Install hearing loops at accessible positions.', 'Commission and test.', 'Promote through disability organisations.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Football Stadium', scenario: 'All wheelchair seating at rear with obstructed views.', solution: 'Added raised platforms at three locations with weather protection. Installed companion seating and hearing loops. Online booking shows view from each position.', outcome: 'Season ticket sales to wheelchair users increased 200%.', cost: '$45,000', timeframe: '8 weeks (off-season)' },
    { businessType: 'event-venue', businessTypeLabel: 'Outdoor Amphitheatre', scenario: 'Grass hill seating with no wheelchair provision.', solution: 'Created three paved viewing areas at different levels with companion bench seating. Added accessible path from parking.', outcome: 'Wheelchair users attend concerts regularly. Positive reviews online.', cost: '$12,000', timeframe: '4 weeks' },
    { businessType: 'attraction', businessTypeLabel: 'Racecourse', scenario: 'Accessible seating hidden behind a barrier.', solution: 'Relocated wheelchair positions to trackside. Added companion seats, shade structure, and dedicated accessible viewing of the finish line.', outcome: 'Disability groups organised days at the races. Media coverage.', cost: '$18,000', timeframe: '6 weeks' }
  ],
  resources: [
    { title: 'Live Performance Australia Accessibility', url: 'https://liveperformance.com.au/resources/', type: 'guide', source: 'Live Performance Australia', description: 'Industry guidance on accessible seating at performance venues.', isAustralian: true, isFree: true },
    { title: 'NCC Table D3.8 Accessible Seating', url: 'https://ncc.abcb.gov.au/', type: 'guide', source: 'Australian Building Codes Board', description: 'Minimum wheelchair seating ratios for assembly buildings.', isAustralian: true, isFree: true }
  ],
  keywords: ['spectator', 'event seating', 'wheelchair space', 'sightline', 'companion seat', 'viewing platform', 'stadium', 'amphitheatre']
},

// ─── Entry 28: Accessible conferences and meeting rooms ───
{
  questionId: '3.8-D-9',
  questionText: 'Are your conference and meeting rooms set up for accessible participation?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible conferences and meeting rooms',
  coveredQuestionIds: ['3.8-D-10', '3.8-D-11', '3.8-D-12'],
  summary: 'Accessible conference rooms need wheelchair-accessible table layouts, hearing augmentation, captioning capability, adjustable lighting, accessible presentation technology, and breakout rooms on accessible paths. Pre-event accessibility planning with organisers is essential.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Conferences and meetings are essential professional and community activities. When rooms are inaccessible, people with disability are excluded from professional development, networking, and decision-making. Accessible conferencing is not just about physical access but also about communication access.',
    quote: { text: 'I have missed promotions because I could not attend industry conferences. The venues did not have hearing loops and captioning was never provided.', attribution: 'Professional with hearing loss, employment survey' }
  },
  tips: [
    { icon: 'Accessibility', text: 'Leave wheelchair spaces at multiple positions around the table, not just at the end.', priority: 1 },
    { icon: 'Ear', text: 'Install a hearing loop or provide portable loop for every meeting room.', priority: 2 },
    { icon: 'Monitor', text: 'Ensure screen content is visible from wheelchair height and have a second screen if room is large.', priority: 3 },
    { icon: 'Lightbulb', text: 'Provide adjustable lighting so Auslan interpreters and lip-readers can see faces clearly.', priority: 4 },
    { icon: 'MapPin', text: 'Locate breakout rooms on accessible routes close to the main room.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing conference room accessibility',
    steps: [
      { text: 'Check doorway width to conference rooms.', measurement: { target: 'Door clear width', acceptable: 'Minimum 850mm', unit: 'mm' } },
      { text: 'Measure table height and knee clearance for wheelchair users.', measurement: { target: 'Table knee clearance', acceptable: 'Minimum 700mm clear height', unit: 'mm' } },
      { text: 'Check for hearing loop or portable loop availability.' },
      { text: 'Test screen visibility from wheelchair seated position at various table locations.' },
      { text: 'Check lighting controls: can lights be adjusted for sign language interpreters?' },
      { text: 'Verify accessible path from conference room to breakout rooms, toilets, and refreshments.' },
      { text: 'Check power access for assistive devices.' }
    ],
    tools: ['Tape measure', 'Hearing loop tester', 'Camera'],
    estimatedTime: '20-30 minutes per room'
  },
  standardsReference: {
    primary: { code: 'Access-to-Premises', section: 'Part D3', requirement: 'Accessible paths of travel to and within rooms used for assembly purposes. Hearing augmentation where amplified sound is provided.' },
    related: [
      { code: 'AS1428.1', relevance: 'General requirements for accessible room layouts, door widths, and circulation space.' },
      { code: 'DDA', relevance: 'Failure to provide accessible meeting facilities may constitute discrimination in employment or service delivery.' }
    ],
    plainEnglish: 'Meeting rooms must be physically accessible and have hearing support. People with disability must be able to participate equally in meetings and conferences.',
    complianceNote: 'Even in older buildings where rooms are not fully compliant, portable solutions (ramps, loops, captioning) can significantly improve access.'
  },
  solutions: [
    {
      title: 'Optimise existing rooms with portable solutions',
      description: 'Use portable hearing loops, flexible seating, and presentation adjustments.',
      resourceLevel: 'low', costRange: '$300-1,000', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Rearrange seating to create wheelchair spaces at multiple table positions.', 'Purchase portable hearing loop for each meeting room.', 'Position screen so it is visible from wheelchair height.', 'Place power boards at wheelchair positions for device charging.', 'Create a conference accessibility checklist for event coordinators.', 'Brief AV staff on accessible presentation setup.']
    },
    {
      title: 'Upgrade room infrastructure for accessibility',
      description: 'Install permanent hearing loops, adjustable lighting, and accessible AV in key rooms.',
      resourceLevel: 'medium', costRange: '$5,000-20,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install permanent hearing loops in main conference rooms.', 'Add adjustable lighting with zones.', 'Install height-adjustable lectern or accessible alternative.', 'Add second screen for large rooms.', 'Install power and data at all table positions.', 'Ensure breakout rooms are on accessible paths.', 'Update room booking to include accessibility features.']
    },
    {
      title: 'Purpose-built accessible conference facility',
      description: 'Design or refit conference rooms to best-practice accessibility standards.',
      resourceLevel: 'high', costRange: '$30,000-100,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage access consultant for conference facility design.', 'Install hearing loops exceeding AS 60118.4.', 'Install real-time captioning system.', 'Design flexible furniture allowing easy reconfiguration.', 'Add Auslan interpreter positioning with appropriate lighting.', 'Install hybrid meeting technology for remote accessible participation.', 'Create accessible breakout and refreshment areas.', 'Market as an accessible conference venue.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Convention Centre', scenario: 'Conference rooms had fixed theatre seating with no wheelchair spaces.', solution: 'Replaced fixed seating with modular furniture. Installed hearing loops and captioning screens. Created accessible speaker positions.', outcome: 'Became top choice for disability sector conferences. Bookings increased 30%.', cost: '$35,000', timeframe: '8 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Hotel', scenario: 'Meeting rooms had no hearing augmentation.', solution: 'Purchased portable hearing loops for each room. Added adjustable lighting and accessible power points.', outcome: 'Corporate clients appreciate the accessibility. Positive TripAdvisor reviews.', cost: '$2,500', timeframe: '1 week' },
    { businessType: 'local-government', businessTypeLabel: 'Council Chambers', scenario: 'Community members with disability could not participate in council meetings.', solution: 'Installed hearing loop, live captioning screen, and wheelchair spaces at the public gallery. Offered remote participation via accessible video platform.', outcome: 'Community participation from people with disability increased significantly.', cost: '$12,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Accessible Meetings Guide', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidelines for running accessible meetings and conferences.', isAustralian: true, isFree: true },
    { title: 'Hearing Loop Standards', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', description: 'AS 60118.4 hearing loop performance requirements.', isAustralian: true, isFree: false },
    { title: 'Accessible Events Toolkit', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Practical toolkit for planning accessible events and conferences.', isAustralian: true, isFree: true }
  ],
  keywords: ['conference', 'meeting room', 'hearing loop', 'captioning', 'wheelchair', 'presentation', 'AV', 'Auslan']
},

// ─── Entry 29: Accessible routes and active experiences ───
{
  questionId: '3.8-D-13',
  questionText: 'Are your guided tours, recreation areas, and active experiences accessible?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible routes and active experiences',
  coveredQuestionIds: ['3.8-D-14', '3.8-D-15', '3.8-D-16', '3.8-D-17', '3.8-D-19', '3.8-D-19a'],
  summary: 'Guided tours, fitness facilities, recreation areas, and active experiences need accessible routes, adaptive equipment options, trained guides, and clear information about physical requirements so people with disability can make informed choices and participate safely.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Active experiences are often the highlight of a visit. Excluding people from tours, fitness classes, or recreation because of inaccessible routes or lack of adaptive equipment denies them the core experience. With planning and the right equipment, most activities can accommodate a wide range of abilities.',
    statistic: { value: '60%', context: 'of Australians with disability report wanting to be more physically active but face barriers including inaccessible facilities and lack of adaptive equipment.', source: 'Sport Australia' }
  },
  tips: [
    { icon: 'MapPin', text: 'Map accessible routes through your activity areas with gradient and surface information.', priority: 1 },
    { icon: 'Accessibility', text: 'Provide adaptive equipment: all-terrain wheelchairs, adaptive bikes, pool hoists.', priority: 2 },
    { icon: 'Users', text: 'Train tour guides and activity leaders in inclusive facilitation.', priority: 3 },
    { icon: 'ClipboardList', text: 'Publish accessibility details for each tour or activity: distance, gradient, surface, rest stops.', priority: 4 },
    { icon: 'Armchair', text: 'Install rest seating every 60 metres on long routes.', priority: 5 },
    { icon: 'AlertTriangle', text: 'Ensure gym equipment includes at least 2-3 wheelchair-accessible machines.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing active experience accessibility',
    steps: [
      { text: 'Walk/wheel each tour route or activity area noting surface type, gradient, and barriers.' },
      { text: 'Measure path width on tour routes.', measurement: { target: 'Path width', acceptable: 'Minimum 1200mm, prefer 1800mm for passing', unit: 'mm' } },
      { text: 'Check gradients.', measurement: { target: 'Maximum gradient', acceptable: '1:14 for ramps, 1:20 preferred for paths', unit: 'ratio' } },
      { text: 'List adaptive equipment available.' },
      { text: 'Check rest seating along routes.', measurement: { target: 'Rest seating spacing', acceptable: 'Every 60 metres', unit: 'm' } },
      { text: 'Check gym or fitness area: are any machines wheelchair accessible?' },
      { text: 'Review published activity information for accessibility details.' },
      { text: 'Ask activity leaders what adaptations they offer.' }
    ],
    tools: ['Tape measure', 'Gradient measure', 'Camera'],
    estimatedTime: '45-90 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 7', requirement: 'Accessible paths of travel must have minimum clear width of 1000mm (1200mm preferred), firm and slip-resistant surfaces, and ramps no steeper than 1:14.' },
    related: [
      { code: 'DDA', relevance: 'Excluding people from activities due to disability without individual assessment is discriminatory.' },
      { code: 'Access-to-Premises', relevance: 'Accessible paths of travel requirements apply to public recreation facilities.' }
    ],
    plainEnglish: 'Tours and activity routes must be navigable by wheelchair where possible. Where they are not, alternative experiences of equivalent quality should be offered.',
    complianceNote: 'Not every trail or activity must be fully accessible, but you must offer meaningful alternatives and clear information so people can make informed choices.'
  },
  solutions: [
    {
      title: 'Map and publish route accessibility information',
      description: 'Document accessibility features of all tours and activity routes.',
      resourceLevel: 'low', costRange: '$0-300', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Walk each route documenting surface, width, gradient, and barriers.', 'Note rest seating locations and toilet access.', 'Create accessibility information for each activity listing physical requirements.', 'Publish on website and at booking points.', 'Train staff to discuss accessibility honestly.', 'Mark accessible route options on maps.']
    },
    {
      title: 'Acquire adaptive equipment and improve routes',
      description: 'Purchase adaptive equipment and make priority route improvements.',
      resourceLevel: 'medium', costRange: '$3,000-15,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Purchase priority adaptive equipment (all-terrain wheelchair, adaptive cycles).', 'Install rest seating every 60m on main routes.', 'Improve surfaces on primary accessible routes.', 'Train guides in inclusive tour facilitation.', 'Add accessible gym equipment (hand cycles, seated machines).', 'Partner with local disability sports organisations.', 'Promote adapted activities through disability networks.']
    },
    {
      title: 'Comprehensive accessible recreation program',
      description: 'Full redesign of recreation offerings for universal access.',
      resourceLevel: 'high', costRange: '$20,000-80,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission accessible recreation audit.', 'Redesign primary routes for accessibility.', 'Purchase full adaptive equipment range.', 'Develop inclusive tour scripts and activity modifications.', 'Create sensory-friendly tour options.', 'Build accessible viewing platforms at key points.', 'Install wayfinding for accessible routes.', 'Launch inclusive recreation marketing campaign.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'National Park', scenario: 'Walking trails were gravel with no accessible options.', solution: 'Upgraded main trail to compacted gravel with boardwalks at soft sections. Acquired two all-terrain wheelchairs. Published trail accessibility ratings.', outcome: 'Wheelchair visitors use the main trail daily. All-terrain chairs booked every weekend.', cost: '$25,000', timeframe: '3 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Gym', scenario: 'No wheelchair-accessible exercise equipment.', solution: 'Purchased hand cycle, seated rowing machine, and wheelchair-accessible weight station. Trained staff in adaptive exercise.', outcome: 'Members with disability joined. Word of mouth brought more members.', cost: '$8,000', timeframe: '2 weeks' },
    { businessType: 'attraction', businessTypeLabel: 'Winery', scenario: 'Vineyard tours on uneven ground excluded wheelchair users.', solution: 'Created accessible vineyard route with compacted path, rest stops, and tasting table at wheelchair height.', outcome: 'Tour operator tourism award. Positive disability travel reviews.', cost: '$6,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Sport Australia Inclusive Sport', url: 'https://www.sportaus.gov.au/', type: 'guide', source: 'Sport Australia', description: 'Resources for making sport and recreation inclusive.', isAustralian: true, isFree: true },
    { title: 'Trail Accessibility Standards', url: 'https://www.environment.nsw.gov.au/', type: 'guide', source: 'NSW National Parks', description: 'Guidance on accessible trail design and grading.', isAustralian: true, isFree: true },
    { title: 'Accessible Tourism Resources', url: 'https://www.tourism.australia.com/', type: 'guide', source: 'Tourism Australia', description: 'Guides for accessible tourism experiences.', isAustralian: true, isFree: true }
  ],
  keywords: ['guided tour', 'recreation', 'gym', 'fitness', 'adaptive equipment', 'trail', 'accessible route', 'all-terrain wheelchair']
},

// ─── Entry 30: Health, wellness and treatment accessibility ───
{
  questionId: '3.8-D-20',
  questionText: 'Are your health, wellness, or treatment facilities accessible?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Health, wellness and treatment accessibility',
  coveredQuestionIds: ['3.8-D-21'],
  summary: 'Health and wellness facilities including treatment rooms, spa areas, and therapy spaces need height-adjustable treatment tables, ceiling or portable hoists, accessible change areas, and trained staff who can support people with disability through treatments.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Health and wellness services are important for everyone, but people with disability often face extra barriers. Standard treatment tables are too high to transfer onto, change areas are too small for wheelchair users, and staff may not know how to safely assist. These barriers exclude people who often need these services most.',
    statistic: { value: '1 in 5', context: 'Australians have a disability. Many have pain or mobility conditions that would benefit from wellness treatments but cannot access them.', source: 'ABS' }
  },
  tips: [
    { icon: 'Bed', text: 'Provide at least one height-adjustable treatment table that lowers to wheelchair transfer height.', detail: 'Transfer height is approximately 450-500mm. The table should lower to this level and have a firm, stable surface.', priority: 1 },
    { icon: 'Accessibility', text: 'Install a ceiling hoist or have a portable hoist available for transfers.', priority: 2 },
    { icon: 'DoorOpen', text: 'Ensure at least one treatment room has a doorway of 850mm+ and turning circle of 1500mm.', priority: 3 },
    { icon: 'Users', text: 'Train therapists in safe manual handling and disability awareness.', priority: 4 },
    { icon: 'ClipboardList', text: 'Ask about access needs at booking, not at arrival.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing health and wellness accessibility',
    steps: [
      { text: 'Measure treatment room doorways.', measurement: { target: 'Door width', acceptable: 'Minimum 850mm clear', unit: 'mm' } },
      { text: 'Check treatment table: does it adjust to wheelchair transfer height?', measurement: { target: 'Lowest table height', acceptable: '450-500mm', unit: 'mm' } },
      { text: 'Measure turning circle in treatment rooms.', measurement: { target: 'Turning space', acceptable: 'Minimum 1500mm diameter', unit: 'mm' } },
      { text: 'Check for hoist (ceiling or portable).' },
      { text: 'Check accessible change area with grab rails and bench.' },
      { text: 'Review booking process: are access needs asked about?' },
      { text: 'Ask therapists about their disability awareness training.' }
    ],
    tools: ['Tape measure', 'Camera'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Health and wellness providers must make reasonable adjustments to accommodate people with disability.' },
    related: [
      { code: 'AS1428.1', relevance: 'General accessibility requirements apply to health facility rooms used by the public.' }
    ],
    plainEnglish: 'Your treatment rooms and wellness facilities must be accessible to people with disability. At minimum, one room should accommodate wheelchair users with appropriate equipment.',
    complianceNote: 'Height-adjustable tables are a relatively low-cost investment that dramatically improves access.'
  },
  solutions: [
    {
      title: 'Adapt one treatment room for accessibility',
      description: 'Equip one room with height-adjustable table and clear access.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Select the room with widest doorway and most floor space.', 'Purchase a height-adjustable treatment table.', 'Clear furniture to create a 1500mm turning circle.', 'Install grab rails at the door and table.', 'Train staff on safe transfers.', 'Update booking system to flag the accessible room.']
    },
    {
      title: 'Install hoist and accessible facilities',
      description: 'Add a ceiling hoist, accessible change area, and adjustable equipment.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install ceiling hoist track in accessible treatment room.', 'Create accessible change area with bench, grab rails, and privacy curtain.', 'Purchase adjustable treatment furniture.', 'Widen doorway if needed.', 'Train all therapists in hoist use and disability awareness.', 'Promote accessible services.', 'Collect feedback from clients with disability.']
    },
    {
      title: 'Full accessible wellness facility design',
      description: 'Design or refit wellness area for comprehensive accessibility.',
      resourceLevel: 'high', costRange: '$20,000-60,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission accessibility audit of wellness facilities.', 'Design accessible treatment rooms with hoists, adjustable tables, and turning space.', 'Create accessible spa/pool area with ramp or hoist entry.', 'Install accessible change and shower facilities.', 'Train all staff in disability awareness and manual handling.', 'Develop accessible wellness programs.', 'Market as an accessible wellness destination.', 'Partner with disability organisations for referrals.']
    }
  ],
  examples: [
    { businessType: 'health-wellness', businessTypeLabel: 'Day Spa', scenario: 'No accessible treatment rooms. Wheelchair users turned away.', solution: 'Equipped largest room with height-adjustable table and portable hoist. Widened doorway. Trained therapists in safe transfers.', outcome: 'Now serves clients with physical disability. Referrals from OTs and physios.', cost: '$4,500', timeframe: '2 weeks' },
    { businessType: 'accommodation', businessTypeLabel: 'Resort', scenario: 'Spa area had steps and narrow doorways.', solution: 'Added ramp to spa entrance, widened one treatment room door, installed ceiling hoist, and added pool hoist for spa pool.', outcome: 'Resort advertises accessible spa. Package deals for accessible stays with spa.', cost: '$18,000', timeframe: '6 weeks' },
    { businessType: 'health-wellness', businessTypeLabel: 'Physiotherapy Clinic', scenario: 'Standard tables too high for transfers.', solution: 'Replaced two tables with height-adjustable models. Created accessible consulting room with turning space.', outcome: 'Referrals from NDIS providers. Consistent client base.', cost: '$3,000', timeframe: '1 week' }
  ],
  resources: [
    { title: 'JobAccess Workplace Modifications', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'JobAccess', description: 'Guidance on equipment modifications including hoists and adjustable furniture.', isAustralian: true, isFree: true },
    { title: 'Accessible Health Services', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Rights and obligations for accessible health and wellness services.', isAustralian: true, isFree: true }
  ],
  keywords: ['treatment room', 'hoist', 'adjustable table', 'wellness', 'spa', 'health', 'transfer', 'therapy']
},

// ─── Entry 31: Performance accessibility and sensory sessions ───
{
  questionId: '3.8-D-22',
  questionText: 'Do you offer audio description, captioning, or Auslan interpretation at performances?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Performance accessibility and sensory sessions',
  coveredQuestionIds: ['3.8-D-23', '3.8-D-24', '3.8-D-25'],
  summary: 'Accessible performances include audio description for blind patrons, captioning for Deaf patrons, Auslan interpretation, hearing augmentation, and relaxed or sensory-friendly sessions with reduced stimuli for autistic and neurodivergent audiences.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Live performance is a fundamental cultural experience. Without audio description, a blind person misses the visual storytelling. Without captioning, a Deaf person misses dialogue and song lyrics. Without relaxed performances, neurodivergent people may be overwhelmed by sudden lighting, loud sounds, or social expectations of silence. Accessible performances make culture available to everyone.',
    statistic: { value: '4.4 million', context: 'Australians have a disability. Many want to attend live performances but cannot access them without specific supports.', source: 'ABS' },
    quote: { text: 'My son is autistic. Relaxed performances are the only way he can experience live theatre. When a venue offers them, it tells us we belong.', attribution: 'Parent, autism community feedback' }
  },
  tips: [
    { icon: 'Headphones', text: 'Schedule audio-described performances with trained describers and headset equipment.', priority: 1 },
    { icon: 'Monitor', text: 'Provide captioned performances using open or closed captioning systems.', priority: 2 },
    { icon: 'Users', text: 'Book Auslan interpreters positioned in a well-lit area visible from Deaf seating.', priority: 3 },
    { icon: 'Volume2', text: 'Offer relaxed performances: house lights up slightly, reduced volume, no strobe, exits open.', priority: 4 },
    { icon: 'Heart', text: 'Create a sensory guide for each show listing triggers (loud sounds, strobe, smoke).', priority: 5 },
    { icon: 'Ear', text: 'Ensure hearing augmentation is active and tested before every performance.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing performance accessibility',
    steps: [
      { text: 'Review your performance schedule: how many are audio-described, captioned, Auslan-interpreted, or relaxed?' },
      { text: 'Check audio description equipment: headsets available, charged, working.' },
      { text: 'Test hearing loop during a performance.' },
      { text: 'Check captioning display: visible from Deaf seating area, correct timing.' },
      { text: 'Review relaxed performance protocols: lighting, volume, audience rules, exit access.' },
      { text: 'Check whether a sensory guide is published for each production.' },
      { text: 'Ask: how do patrons book accessible performances and request supports?' }
    ],
    tools: ['Hearing loop tester', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Entertainment providers must make reasonable adjustments to enable people with disability to access performances.' },
    related: [
      { code: 'UNCRPD', relevance: 'Article 30 recognises the right of people with disability to enjoy arts and cultural activities.' },
      { code: 'AS1428.5', relevance: 'Hearing augmentation requirements apply to auditoriums and performance venues.' }
    ],
    plainEnglish: 'Performance venues should offer a regular schedule of accessible performances so people with disability have meaningful access to cultural events.',
    complianceNote: 'Leading venues offer at least one accessible performance per production season. This is rapidly becoming the industry standard.'
  },
  solutions: [
    {
      title: 'Schedule accessible performances for existing season',
      description: 'Add one audio-described, one captioned, and one relaxed performance per production.',
      resourceLevel: 'low', costRange: '$500-2,000 per production', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify one performance per production for each access type.', 'Book audio describer through Arts Access or state equivalent.', 'Book captioning provider.', 'Develop relaxed performance protocol: adjust lighting, sound, audience rules.', 'Create sensory guides for each production.', 'Promote accessible performances through disability networks.']
    },
    {
      title: 'Build accessible performance infrastructure',
      description: 'Install permanent captioning, audio description, and hearing augmentation systems.',
      resourceLevel: 'medium', costRange: '$5,000-20,000', timeRequired: '4-8 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install permanent captioning screen or LED display.', 'Purchase audio description headset system.', 'Install or upgrade hearing loop in auditorium.', 'Create dedicated Auslan interpreter position with lighting.', 'Develop sensory guide template for all productions.', 'Train front-of-house staff on accessible performances.', 'Add accessible performance filter to online booking.']
    },
    {
      title: 'Comprehensive accessible programming',
      description: 'Integrate accessibility into all productions from planning stage.',
      resourceLevel: 'high', costRange: '$20,000-50,000 per year', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Hire or contract an access coordinator.', 'Build accessibility into production budgets from the start.', 'Offer accessible performances for every production.', 'Install state-of-the-art captioning and AD systems.', 'Create touch tours before audio-described performances.', 'Develop relaxed performance program with community input.', 'Partner with disability organisations for programming advice.', 'Report on accessible attendance annually.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Theatre', scenario: 'No accessible performances offered.', solution: 'Scheduled one audio-described, one captioned, and one relaxed performance per production. Partnered with Arts Access Victoria. Promoted through disability networks.', outcome: 'Accessible performances at 70% capacity within first year. Season ticket holders include regular AD and captioned patrons.', cost: '$8,000 per year', timeframe: '3 months to establish' },
    { businessType: 'attraction', businessTypeLabel: 'Cinema', scenario: 'No captioned or audio-described sessions.', solution: 'Installed open captioning on selected sessions. Purchased audio description receivers. Scheduled one accessible session per new release.', outcome: 'Deaf and blind patrons return regularly. Positive social media coverage.', cost: '$4,000', timeframe: '4 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Concert Venue', scenario: 'Autistic attendees overwhelmed by standard concerts.', solution: 'Launched relaxed concert series with adjusted lighting and volume, chill-out room, and visual song guide. Partnered with Autism CRC.', outcome: 'Relaxed concerts sell out. Families report it is the only way their family members can attend live music.', cost: '$2,000 per event', timeframe: '2 weeks per event' }
  ],
  resources: [
    { title: 'Arts Access Australia', url: 'https://artsaccess.com.au/', type: 'guide', source: 'Arts Access Australia', description: 'National body for arts and disability. Resources for accessible performances.', isAustralian: true, isFree: true },
    { title: 'Media Access Australia', url: 'https://www.mediaaccess.org.au/', type: 'guide', source: 'Media Access Australia', description: 'Captioning and audio description resources and providers.', isAustralian: true, isFree: true },
    { title: 'Relaxed Performance Guidelines', url: 'https://www.artscentremelbourne.com.au/', type: 'guide', source: 'Arts Centre Melbourne', description: 'Guide to planning and running relaxed performances.', isAustralian: true, isFree: true }
  ],
  keywords: ['audio description', 'captioning', 'Auslan', 'relaxed performance', 'sensory-friendly', 'hearing loop', 'performance', 'theatre', 'cinema']
},

// ─── Entry 32: Food accessibility and outdoor/nature access ───
{
  questionId: '3.8-D-26',
  questionText: 'Are your food service areas accessible and do you accommodate dietary needs related to disability?',
  moduleCode: '3.8',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Food accessibility and outdoor/nature access',
  coveredQuestionIds: ['3.8-D-27', '3.8-D-28', '3.8-D-29', '3.8-D-30', '3.8-D-31', '3.8-D-32', '3.8-D-33', '3.8-D-34'],
  summary: 'Food accessibility includes menus in alternative formats, staff assistance with buffets, dietary modification for disability-related needs, and accessible dining furniture. Outdoor and nature access covers accessible trails, beach matting, playground equipment, camping facilities, lookouts, and trail information in accessible formats.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Eating and outdoor experiences are core social activities. When a restaurant has no large print menu, a blind person cannot order independently. When a beach has no matting, a wheelchair user stops at the sand. When a playground has no accessible equipment, a child with disability watches from the sideline. These barriers affect not just the person with disability but their entire family and social group.',
    statistic: { value: '$14 billion', context: 'is the estimated annual spending power of Australian disability tourism. Accessible food and outdoor experiences are key drivers of this market.', source: 'Tourism Research Australia' }
  },
  tips: [
    { icon: 'BookOpen', text: 'Provide menus in large print and digital format (QR code to accessible page).', priority: 1 },
    { icon: 'Users', text: 'Train food service staff to assist with buffets: describe items, carry plates, guide to tables.', priority: 2 },
    { icon: 'Heart', text: 'Accommodate disability-related dietary needs (texture modification, allergen awareness).', priority: 3 },
    { icon: 'MapPin', text: 'Install beach matting or accessible boardwalks for sand access.', priority: 4 },
    { icon: 'Accessibility', text: 'Include at least one accessible piece of playground equipment.', priority: 5 },
    { icon: 'Eye', text: 'Provide trail information in accessible formats: large print, audio, tactile maps.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing food and outdoor accessibility',
    steps: [
      { text: 'Check menus for alternative formats (large print, Braille, digital).' },
      { text: 'Ask food service staff: how do you assist a blind person at a buffet?' },
      { text: 'Check dining furniture for wheelchair clearance.', measurement: { target: 'Table knee clearance', acceptable: 'Minimum 700mm', unit: 'mm' } },
      { text: 'Inspect outdoor paths for accessibility: surface, width, gradient.' },
      { text: 'Check beach access: is there matting, a beach wheelchair, or boardwalk?' },
      { text: 'Inspect playground: is there accessible equipment?' },
      { text: 'Check camping facilities: is there an accessible campsite with firm ground and accessible amenities nearby?' },
      { text: 'Review lookout and viewing areas: can wheelchair users see over barriers?' },
      { text: 'Check trail information for accessibility details and alternative formats.' }
    ],
    tools: ['Tape measure', 'Camera', 'Checklist'],
    estimatedTime: '45-90 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Sections 23-24', requirement: 'Providers of goods and services, including food service and recreation, must not discriminate and must make reasonable adjustments.' },
    related: [
      { code: 'AS1428.1', relevance: 'Path of travel requirements apply to outdoor public spaces and dining areas.' },
      { code: 'Access-to-Premises', relevance: 'Dining areas in new buildings must be on accessible paths with accessible furniture.' }
    ],
    plainEnglish: 'Food service and outdoor areas open to the public must be accessible. This means accessible paths, adaptable dining, and alternatives where full access is not possible.',
    complianceNote: 'Natural environments may have inherent access limitations, but providing accessible alternatives (beach matting, accessible trails, viewing platforms) demonstrates commitment to inclusion.'
  },
  solutions: [
    {
      title: 'Quick improvements to food and outdoor access',
      description: 'Create accessible menus, train staff, and add basic outdoor access aids.',
      resourceLevel: 'low', costRange: '$100-1,000', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create large print menu and QR code digital menu.', 'Brief food staff on buffet assistance and dietary accommodation.', 'Ensure at least one table per dining area has wheelchair clearance.', 'Purchase temporary beach matting for sand crossings.', 'Add accessible trail information signs at trailheads.', 'Review playground for simple accessible additions (accessible swing, ground-level play).']
    },
    {
      title: 'Invest in accessible outdoor infrastructure',
      description: 'Install permanent beach access, accessible playground equipment, and trail improvements.',
      resourceLevel: 'medium', costRange: '$5,000-30,000', timeRequired: '4-8 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install permanent beach access matting or boardwalk.', 'Purchase beach wheelchair for public loan.', 'Install accessible playground equipment (liberty swing, accessible roundabout).', 'Upgrade primary trail surfaces for wheelchair access.', 'Install accessible picnic tables at key locations.', 'Create accessible camping pad with firm surface and nearby accessible amenities.', 'Produce trail guides in large print and audio.']
    },
    {
      title: 'Comprehensive accessible outdoor precinct',
      description: 'Full redesign of outdoor and food areas for universal access.',
      resourceLevel: 'high', costRange: '$30,000-100,000+', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Commission accessible recreation and dining audit.', 'Design accessible trail network with graded difficulty levels.', 'Install all-abilities playground.', 'Build accessible beach access with shade and seating.', 'Design accessible lookout with lowered viewing panels.', 'Create accessible camping precinct.', 'Redesign dining area for universal access.', 'Launch as accessible destination with marketing campaign.']
    }
  ],
  examples: [
    { businessType: 'restaurant-cafe', businessTypeLabel: 'Beachside Cafe', scenario: 'Menu was handwritten on a chalkboard. No wheelchair path to beach.', solution: 'Created large print menu, QR digital menu, and trained staff on buffet assistance. Installed 20m beach access matting and purchased a beach wheelchair.', outcome: 'Became known as the accessible beachside cafe. Tourism award nomination.', cost: '$2,500', timeframe: '3 weeks' },
    { businessType: 'attraction', businessTypeLabel: 'National Park', scenario: 'No accessible trails or camping.', solution: 'Upgraded 2km trail to compacted surface with rest stops. Created accessible campsite with firm pad and accessible amenities. Audio trail guide via app.', outcome: 'Wheelchair visitors use trail daily. Accessible campsite booked most weekends.', cost: '$45,000', timeframe: '4 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council Park', scenario: 'Playground had no accessible equipment.', solution: 'Installed liberty swing, wheelchair-accessible roundabout, and sensory play panel. Added accessible path through playground. Rubber softfall surface.', outcome: 'Children with disability play alongside peers. Park became a family destination.', cost: '$35,000', timeframe: '6 weeks' }
  ],
  resources: [
    { title: 'Accessible Beach Guide', url: 'https://www.travability.travel/', type: 'guide', source: 'Travability', description: 'Guide to accessible beaches across Australia.', isAustralian: true, isFree: true },
    { title: 'All-Abilities Playground Design', url: 'https://www.playaustralia.org.au/', type: 'guide', source: 'Play Australia', description: 'Resources for designing inclusive playgrounds.', isAustralian: true, isFree: true },
    { title: 'Accessible Camping Guidelines', url: 'https://www.parks.vic.gov.au/', type: 'guide', source: 'Parks Victoria', description: 'Standards for accessible camping facilities in parks.', isAustralian: true, isFree: true }
  ],
  keywords: ['food service', 'menu', 'dietary', 'beach access', 'playground', 'camping', 'trail', 'lookout', 'outdoor', 'nature', 'buffet']
},

// ─── Entry 33: Accessible room essentials ───
{
  questionId: '3.9-1-2',
  questionText: 'Do your accessible rooms meet minimum space and layout requirements?',
  moduleCode: '3.9',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible room essentials',
  coveredQuestionIds: ['3.9-1-4', '3.9-1-5', '3.9-D-1', '3.9-D-2', '3.9-D-9', '3.9-D-10'],
  summary: 'Accessible guest rooms need wide doorways (850mm+), adequate circulation space (1500mm turning circle), accessible bed height for transfers, reachable controls and switches, accessible lighting, and clear floor paths between furniture.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'An accessible room that cannot actually be used by a wheelchair user is worse than having none, because it creates false expectations. Room essentials like doorway width, bed transfer space, switch height, and circulation space determine whether someone can independently use the room or needs constant assistance for basic tasks.',
    statistic: { value: '1 in 6', context: 'Australians travelling domestically have a disability or care for someone who does. Accessible accommodation is the single biggest barrier reported by disability travellers.', source: 'Tourism Research Australia' },
    quote: { text: 'I booked an "accessible" room and could not even get my wheelchair through the bathroom door. The bed was too high to transfer. I ended up sleeping in my chair.', attribution: 'Wheelchair user, accommodation review' }
  },
  tips: [
    { icon: 'DoorOpen', text: 'Ensure all doorways in accessible rooms are 850mm+ clear width with lever handles.', priority: 1 },
    { icon: 'Accessibility', text: 'Provide 1500mm turning circle on at least one side of the bed and at the room entry.', priority: 2 },
    { icon: 'Bed', text: 'Set bed height to 450-500mm (top of mattress) to match wheelchair seat for lateral transfers.', detail: 'Use bed risers or adjustable bases. The bed should be firm enough to support transfers.', priority: 3 },
    { icon: 'Lightbulb', text: 'Place light switches, power points, and climate controls at 900-1100mm height.', priority: 4 },
    { icon: 'Eye', text: 'Provide a bedside panel controlling lights and calling for assistance.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing accessible room essentials',
    steps: [
      { text: 'Measure all doorways in the accessible room.', measurement: { target: 'Door clear width', acceptable: 'Minimum 850mm', unit: 'mm' } },
      { text: 'Check turning circle at room entry and beside the bed.', measurement: { target: 'Turning circle', acceptable: 'Minimum 1500mm diameter', unit: 'mm' } },
      { text: 'Measure bed height (top of mattress to floor).', measurement: { target: 'Bed height', acceptable: '450-500mm', unit: 'mm' } },
      { text: 'Check transfer space beside the bed.', measurement: { target: 'Transfer space', acceptable: 'Minimum 1200mm clear on one side', unit: 'mm' } },
      { text: 'Measure height of light switches and power points.', measurement: { target: 'Switch height', acceptable: '900-1100mm', unit: 'mm' } },
      { text: 'Check wardrobe: can items be reached from seated position?' },
      { text: 'Check that paths between furniture are clear and wide enough for a wheelchair.' },
      { text: 'Test all controls: can they be operated with one hand and minimal force?' }
    ],
    tools: ['Tape measure', 'Camera', 'Room accessibility checklist'],
    estimatedTime: '20-30 minutes per room'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 7 and 15', requirement: 'Door openings 850mm minimum clear. Circulation space 1500mm turning. Controls operable with one hand at 900-1100mm.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible rooms in new accommodation buildings with specified ratios.' },
      { code: 'NCC', relevance: 'Volume 1 Part D3.4 specifies accessible room requirements for Class 3 buildings.' }
    ],
    plainEnglish: 'Accessible rooms must have wide enough doors, enough space to turn a wheelchair, a bed at the right height for transfers, and controls within reach from a seated position.',
    complianceNote: 'Even if your building predates current standards, adjusting bed height, switch positions, and furniture layout can significantly improve room accessibility.'
  },
  solutions: [
    {
      title: 'Adjust existing room layout and furniture',
      description: 'Rearrange furniture, adjust bed height, and lower controls in existing accessible rooms.',
      resourceLevel: 'low', costRange: '$200-1,000', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Remove unnecessary furniture to create turning space.', 'Adjust bed height to 450-500mm using risers or frame adjustment.', 'Move bedside table to create 1200mm clear transfer space.', 'Lower wardrobe rail to reachable height (1200mm max).', 'Install rocker-style light switches at 1000mm if needed.', 'Add extension cables to bring power points within reach.']
    },
    {
      title: 'Upgrade accessible room infrastructure',
      description: 'Widen doorways, install accessible controls, and purchase adjustable furniture.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Widen doorways to 850mm+ where needed.', 'Install lever door handles throughout.', 'Relocate switches and power points to 900-1100mm.', 'Purchase height-adjustable bed.', 'Install bedside control panel for lights, curtains, and assistance call.', 'Add emergency call cord reaching the floor.', 'Update room listing with accurate accessibility details.']
    },
    {
      title: 'Purpose-built accessible room design',
      description: 'Full room redesign by access consultant meeting best-practice standards.',
      resourceLevel: 'high', costRange: '$15,000-40,000', timeRequired: '4-8 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage an access consultant for room design.', 'Design room with 1800mm circulation spaces.', 'Install ceiling hoist track from bed to bathroom.', 'Specify adjustable-height bed with profiling function.', 'Install smart room controls (voice-activated lights, curtains, temperature).', 'Design accessible wardrobe with pull-down rail.', 'Include visual fire alarm and vibrating pillow alert.', 'Photograph and create detailed accessibility room guide for website.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Accessible room had furniture blocking wheelchair circulation.', solution: 'Removed armchair and second bedside table. Lowered bed to 480mm. Moved wardrobe items to reachable height. Added bedside light control.', outcome: 'Guest feedback improved immediately. Room gets positive reviews on accessibility platforms.', cost: '$350', timeframe: '1 day' },
    { businessType: 'accommodation', businessTypeLabel: 'Motel', scenario: 'Room doors too narrow for powered wheelchairs.', solution: 'Widened doorways to 900mm and installed lever handles. Adjusted bed height and added transfer board.', outcome: 'Can now accommodate powered wheelchair users. NDIS provider referrals.', cost: '$4,500', timeframe: '1 week' },
    { businessType: 'accommodation', businessTypeLabel: 'Resort', scenario: 'Accessible room controls too high.', solution: 'Installed bedside control panel at 800mm for all lights, curtains, and AC. Added voice control option. Lowered wardrobe rail.', outcome: 'Guests with quadriplegia can control room independently. Outstanding reviews.', cost: '$8,000', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Accessible Accommodation Guide', url: 'https://www.travability.travel/', type: 'guide', source: 'Travability', description: 'Detailed guide to accessible accommodation features and standards.', isAustralian: true, isFree: true },
    { title: 'AS 1428.1 Accommodation', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', description: 'Section covering accessible room requirements.', isAustralian: true, isFree: false },
    { title: 'Tourism Australia Accessible Accommodation', url: 'https://www.tourism.australia.com/', type: 'guide', source: 'Tourism Australia', description: 'Resources for accommodation providers on accessibility.', isAustralian: true, isFree: true }
  ],
  keywords: ['accessible room', 'bed height', 'transfer', 'doorway width', 'turning circle', 'controls', 'switches', 'circulation']
},

// ─── Entry 34: Accessible bathroom and safety ───
{
  questionId: '3.9-1-3',
  questionText: 'Do accessible room bathrooms have roll-in showers, grab rails, and appropriate toilet height?',
  moduleCode: '3.9',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible bathroom and safety',
  coveredQuestionIds: ['3.9-D-4', '3.9-D-5', '3.9-D-15'],
  summary: 'Accessible bathrooms in guest rooms require roll-in (hobless) showers with fold-down seats, grab rails at toilet and shower, toilet at correct height (460-480mm), non-slip surfaces, emergency pull cords reaching floor level, and adequate lighting.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'The bathroom is where accessibility is most critical and where injuries are most likely. A bathroom without grab rails, with a shower step, or with a toilet at the wrong height can mean a guest cannot use the room at all, or worse, falls and is injured. Bathroom accessibility is non-negotiable for genuine room accessibility.',
    statistic: { value: '30%', context: 'of falls among older Australians happen in the bathroom. Grab rails and non-slip surfaces prevent injuries for all guests, not just those with disability.', source: 'Australian Institute of Health and Welfare' }
  },
  tips: [
    { icon: 'Bath', text: 'Install hobless (zero-step) roll-in shower with fold-down seat.', detail: 'The shower must be flush with the floor so a wheelchair can roll directly in. Fold-down seat at 460-480mm height.', priority: 1 },
    { icon: 'Hand', text: 'Install L-shaped grab rails at toilet and shower per AS 1428.1.', priority: 2 },
    { icon: 'Ruler', text: 'Set toilet seat height to 460-480mm (use raised toilet seat if needed).', priority: 3 },
    { icon: 'AlertTriangle', text: 'Install emergency pull cord reachable from floor level in bathroom.', priority: 4 },
    { icon: 'Shield', text: 'Use non-slip flooring rated R10 or higher throughout bathroom.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing accessible bathrooms',
    steps: [
      { text: 'Check shower entry: is it hobless (zero step)?', measurement: { target: 'Shower lip', acceptable: 'Zero (flush with floor)', unit: 'mm' } },
      { text: 'Check shower seat height.', measurement: { target: 'Seat height', acceptable: '460-480mm', unit: 'mm' } },
      { text: 'Check grab rail placement at toilet and shower against AS 1428.1 diagrams.' },
      { text: 'Measure toilet seat height.', measurement: { target: 'Toilet height', acceptable: '460-480mm', unit: 'mm' } },
      { text: 'Check emergency pull cord: does it hang to 100mm from floor?', measurement: { target: 'Cord reach', acceptable: '100mm from floor', unit: 'mm' } },
      { text: 'Check floor surface for non-slip rating.' },
      { text: 'Measure clear floor space in front of toilet and vanity for wheelchair.', measurement: { target: 'Clear floor', acceptable: 'Minimum 1200mm x 900mm', unit: 'mm' } },
      { text: 'Check vanity height and knee clearance.' }
    ],
    tools: ['Tape measure', 'Camera', 'Non-slip test (water splash test)'],
    estimatedTime: '15-20 minutes per bathroom'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 10 and 11', requirement: 'Accessible bathrooms require hobless showers, grab rails to specified dimensions, toilet at 460-480mm, and emergency call within reach of the floor.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible sanitary facilities in accommodation buildings.' },
      { code: 'NCC', relevance: 'Part F2.4 specifies sanitary facility requirements for accessible rooms.' }
    ],
    plainEnglish: 'Accessible bathrooms must have step-free showers, grab rails for support, toilets at the right height, and emergency cords you can reach from the floor in case of a fall.',
    complianceNote: 'Many older properties have bathrooms that partially comply. Focus on the highest-impact improvements first: grab rails and shower accessibility.'
  },
  solutions: [
    {
      title: 'Add grab rails and safety features',
      description: 'Retrofit grab rails, non-slip mats, and emergency cords to existing bathrooms.',
      resourceLevel: 'low', costRange: '$300-1,000', timeRequired: '1-2 days', implementedBy: 'contractor', impact: 'quick-win',
      steps: ['Install grab rails at toilet (one horizontal, one vertical) per AS 1428.1.', 'Install grab rails in shower (L-shaped).', 'Add fold-down shower seat if not present.', 'Place non-slip mat in shower and on bathroom floor.', 'Install or extend emergency pull cord to floor level.', 'Add raised toilet seat if height is below 460mm.']
    },
    {
      title: 'Convert to hobless shower and accessible layout',
      description: 'Remove shower hob, retile with non-slip surface, and reconfigure layout.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Remove shower hob and retile floor for zero-step entry.', 'Install linear drain for water containment.', 'Tile with R10+ non-slip surface.', 'Install fixed and detachable shower heads.', 'Install fold-down shower seat at 460-480mm.', 'Add grab rails per AS 1428.1.', 'Install emergency pull cord.']
    },
    {
      title: 'Full accessible bathroom rebuild',
      description: 'Complete bathroom redesign meeting AS 1428.1.',
      resourceLevel: 'high', costRange: '$15,000-35,000', timeRequired: '2-4 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage access consultant for bathroom design.', 'Design hobless shower with 1160mm x 1100mm minimum area.', 'Install wall-mounted toilet at correct height with backrest.', 'Install accessible vanity with knee clearance.', 'Tile with non-slip, light-coloured surfaces for contrast.', 'Install ceiling hoist track if room also has one.', 'Add heated towel rail within reach from shower.', 'Install good lighting without glare.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Accessible bathroom had a shower with 50mm step. No grab rails.', solution: 'Removed hob, retiled with non-slip, installed grab rails, fold-down seat, and emergency cord. Adjusted toilet height.', outcome: 'Room fully usable by wheelchair guests. Bookings for accessible room increased.', cost: '$8,000', timeframe: '10 days' },
    { businessType: 'accommodation', businessTypeLabel: 'B&B', scenario: 'Ground-floor room bathroom had bathtub only.', solution: 'Replaced tub with hobless shower with seat. Added grab rails and non-slip flooring. Extended emergency cord to floor.', outcome: 'Room now genuinely accessible. Listed on Travability. Consistent bookings.', cost: '$12,000', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'AS 1428.1 Sanitary Facilities', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', description: 'Detailed requirements for accessible bathrooms.', isAustralian: true, isFree: false },
    { title: 'Travability Accommodation Reviews', url: 'https://www.travability.travel/', type: 'website', source: 'Travability', description: 'Reviews of accessible accommodation including bathroom details.', isAustralian: true, isFree: true }
  ],
  keywords: ['bathroom', 'shower', 'grab rail', 'hobless', 'toilet height', 'emergency cord', 'non-slip', 'roll-in shower']
},

// ─── Entry 35: Guest communication and alerting ───
{
  questionId: '3.9-D-3',
  questionText: 'Do your accessible rooms have visual fire alarms and vibrating alert systems?',
  moduleCode: '3.9',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Guest communication and alerting',
  coveredQuestionIds: ['3.9-D-11', '3.9-D-17'],
  summary: 'Deaf and hard-of-hearing guests need visual fire alarms (strobe lights), vibrating pillow or bed shaker alerts, visual door knock indicators, and accessible communication methods including text-based contact with reception. Medication and medical equipment storage facilities support guests with chronic conditions.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'A Deaf person sleeping cannot hear a fire alarm. Without a visual or vibrating alert, they may not evacuate in time. Similarly, if the only way to contact reception is by phone, Deaf guests cannot request help. Alerting and communication systems are life-safety features, not optional extras.',
    statistic: { value: '3.6 million', context: 'Australians have hearing loss. Many remove hearing aids at night, making audible alarms completely ineffective.', source: 'Hearing Australia' }
  },
  tips: [
    { icon: 'Zap', text: 'Install visual fire alarm (strobe) in bedroom and bathroom of accessible rooms.', priority: 1 },
    { icon: 'Bed', text: 'Provide vibrating pillow alert or bed shaker connected to fire alarm and door knock.', priority: 2 },
    { icon: 'DoorOpen', text: 'Install visual door knock indicator (flashing light when someone knocks).', priority: 3 },
    { icon: 'Smartphone', text: 'Offer text-based communication with reception (SMS, app, or messaging).', priority: 4 },
    { icon: 'Thermometer', text: 'Provide a small fridge for medication storage.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing guest alerting systems',
    steps: [
      { text: 'Check accessible room for visual fire alarm in bedroom and bathroom.' },
      { text: 'Test the visual alarm: does it activate with the building fire alarm?' },
      { text: 'Check for vibrating pillow alert or bed shaker.' },
      { text: 'Check for visual door knock indicator.' },
      { text: 'Ask reception: how can a Deaf guest contact you from their room?' },
      { text: 'Check if a medication fridge is available or can be requested.' },
      { text: 'Check whether room information is available in accessible formats (large print, Braille).' }
    ],
    tools: ['Checklist', 'Camera'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'NCC', section: 'Part E2.2', requirement: 'Visual fire alarm signals (strobes) must be provided in accessible rooms in Class 3 buildings (accommodation).' },
    related: [
      { code: 'AS1428.1', relevance: 'General requirements for accessible rooms include alerting systems.' },
      { code: 'DDA', relevance: 'Failing to provide alerting systems for Deaf guests may constitute discrimination and create safety risks.' }
    ],
    plainEnglish: 'Accessible rooms must have visual fire alarms so Deaf guests can evacuate safely. Best practice also includes vibrating alerts and text-based communication.',
    complianceNote: 'Visual fire alarms are a legal requirement in new accommodation buildings. For existing buildings, they are a critical safety improvement.'
  },
  solutions: [
    {
      title: 'Install basic alerting and communication',
      description: 'Add visual alarms and offer text-based reception contact.',
      resourceLevel: 'low', costRange: '$300-1,000', timeRequired: '1-2 days', implementedBy: 'contractor', impact: 'quick-win',
      steps: ['Install visual fire alarm strobes in bedroom and bathroom.', 'Purchase portable vibrating pillow alert (can be stored and placed on request).', 'Set up a dedicated SMS number or messaging channel for guest-reception communication.', 'Create large-print room information card.', 'Brief reception staff on Deaf guest communication.', 'Add a small bar fridge for medication if not already present.']
    },
    {
      title: 'Integrated alerting system',
      description: 'Install connected alerting system with visual, vibrating, and door notification.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install integrated alerting system connecting fire alarm, door knock, and phone to visual and vibrating alerts.', 'Install visual door knock indicator.', 'Provide bed shaker connected to all alert sources.', 'Install accessible telephone with amplification and TTY compatibility.', 'Set up guest app or tablet for text communication.', 'Provide in-room medication fridge.', 'Document all features in room accessibility guide.']
    },
    {
      title: 'Smart room alerting and communication',
      description: 'Deploy smart room technology for comprehensive alerting and guest independence.',
      resourceLevel: 'high', costRange: '$8,000-20,000', timeRequired: '2-4 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Install smart room hub connecting all alerts.', 'Deploy wearable alert device (vibrating wristband) for mobile alerting.', 'Install smart display showing all room information and alerts.', 'Connect to hotel PMS for text-based room service, housekeeping, and reception.', 'Add video doorbell with screen for visual identification.', 'Install medical-grade fridge for temperature-sensitive medication.', 'Create comprehensive accessible room technology guide.', 'Train all staff on system operation.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'No visual fire alarm in accessible room. Deaf guest was unaware of a drill.', solution: 'Installed visual strobes in bedroom and bathroom of all accessible rooms. Purchased vibrating pillow alerts. Set up SMS reception line.', outcome: 'Deaf guests feel safe. Positive reviews mentioning alerting systems.', cost: '$1,200 per room', timeframe: '3 days' },
    { businessType: 'accommodation', businessTypeLabel: 'Resort', scenario: 'Only phone contact with reception.', solution: 'Deployed in-room tablets with text chat to reception, visual alerts, and door camera. Added medication fridge.', outcome: 'Deaf guests book independently. Resort featured in accessible travel guide.', cost: '$5,000 per room', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Hearing Australia Accommodation Guide', url: 'https://www.hearing.com.au/', type: 'guide', source: 'Hearing Australia', description: 'Guidance on alerting systems for accommodation providers.', isAustralian: true, isFree: true },
    { title: 'NCC Accessible Room Requirements', url: 'https://ncc.abcb.gov.au/', type: 'guide', source: 'ABCB', description: 'National Construction Code requirements for accessible rooms.', isAustralian: true, isFree: true }
  ],
  keywords: ['visual alarm', 'vibrating alert', 'door knock', 'Deaf', 'fire alarm', 'strobe', 'medication', 'communication']
},

// ─── Entry 36: Kitchenette and in-room amenities ───
{
  questionId: '3.9-D-6',
  questionText: 'Does your accessible room have an accessible kitchenette?',
  moduleCode: '3.9',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Kitchenette and in-room amenities',
  coveredQuestionIds: ['3.9-D-7', '3.9-D-8'],
  summary: 'Accessible kitchenettes need lowered benchtops with knee clearance, front-operated appliances, reachable storage, and accessible tea and coffee facilities. In-room entertainment (TV, remote, information) must also be accessible.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Self-catering is important for guests who have dietary requirements related to disability, need to prepare medication, or simply want the independence of making their own meals. Standard kitchenettes with high benchtops and rear-controlled appliances are unusable from a wheelchair.',
    quote: { text: 'I have coeliac disease and need to prepare my own food. When the kitchenette bench is too high and the microwave is above head height, I cannot use it at all.', attribution: 'Wheelchair user, accommodation review' }
  },
  tips: [
    { icon: 'Ruler', text: 'Lower at least a section of benchtop to 850mm with knee clearance underneath.', priority: 1 },
    { icon: 'Lightbulb', text: 'Use front-operated controls on oven, microwave, and cooktop.', priority: 2 },
    { icon: 'Package', text: 'Place frequently used items (kettle, cups, utensils) within reach: 400-1200mm height.', priority: 3 },
    { icon: 'Monitor', text: 'Ensure TV remote has large buttons and TV has audio description and caption settings enabled.', priority: 4 },
    { icon: 'BookOpen', text: 'Provide room compendium in large print and digital format.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing kitchenette and amenities',
    steps: [
      { text: 'Measure benchtop height.', measurement: { target: 'Lowered section', acceptable: '850mm with 700mm knee clearance', unit: 'mm' } },
      { text: 'Check appliance controls: are they front-operated and reachable from seated position?' },
      { text: 'Check storage: can essential items be reached at 400-1200mm?' },
      { text: 'Check kettle and tea/coffee: are they at bench height with stable, easy-pour kettle?' },
      { text: 'Check TV: does remote have large buttons? Are captions and audio description enabled?' },
      { text: 'Check room information: is it available in large print?' },
      { text: 'Check power points near benchtop for assistive devices.' }
    ],
    tools: ['Tape measure', 'Camera'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 15', requirement: 'Kitchen benchtops in accessible dwellings must include a section at 850mm with 700mm knee clearance for wheelchair users.' },
    related: [
      { code: 'DDA', relevance: 'In-room amenities that are inaccessible may constitute discrimination if accessible alternatives are not provided.' }
    ],
    plainEnglish: 'If your accessible room has a kitchenette, at least part of the bench must be low enough to use from a wheelchair, and appliances must be reachable and operable.',
    complianceNote: 'Even rooms without full kitchenettes should have accessible tea and coffee facilities.'
  },
  solutions: [
    {
      title: 'Rearrange amenities for reach',
      description: 'Move items to reachable heights and provide accessible alternatives.',
      resourceLevel: 'low', costRange: '$50-300', timeRequired: '1-2 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Move kettle, cups, and tea/coffee to bench height.', 'Replace wall-mounted microwave with benchtop model.', 'Place frequently used items at 400-1200mm.', 'Provide a pour-assist kettle with tipping frame.', 'Add large-print room compendium.', 'Enable captions and audio description on TV.']
    },
    {
      title: 'Modify kitchenette for wheelchair access',
      description: 'Lower a section of benchtop and install front-operated appliances.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Remove base cabinet under one section of bench to create knee clearance.', 'Lower that section to 850mm.', 'Install front-operated cooktop and oven.', 'Install pull-out shelving in upper cabinets.', 'Replace tap with lever-operated or sensor model.', 'Install D-handle pulls on all drawers and doors.', 'Add non-slip mat under work area.']
    },
    {
      title: 'Full accessible kitchenette design',
      description: 'Design and install a fully accessible kitchenette.',
      resourceLevel: 'high', costRange: '$8,000-20,000', timeRequired: '2-4 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage kitchen designer with accessibility experience.', 'Design with full wheelchair clearance throughout.', 'Install height-adjustable benchtop if budget allows.', 'Specify induction cooktop (safer, front controls).', 'Install pull-down upper storage.', 'Include accessible sink with lever taps.', 'Add good task lighting.', 'Document all features in room guide.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Serviced Apartment', scenario: 'Kitchenette bench at 900mm with overhead microwave.', solution: 'Removed base cabinet under one section for knee clearance. Moved microwave to bench. Rearranged storage to reachable heights.', outcome: 'Wheelchair guests can self-cater. Extended stay bookings increased.', cost: '$1,500', timeframe: '3 days' },
    { businessType: 'accommodation', businessTypeLabel: 'Holiday Park', scenario: 'Accessible cabin had standard kitchen.', solution: 'Lowered one bench section, installed benchtop oven and induction cooktop with front controls. Added pull-out shelving.', outcome: 'Cabin rated highly on accessible travel sites. Repeat bookings.', cost: '$6,000', timeframe: '1 week' }
  ],
  resources: [
    { title: 'Livable Housing Design Guidelines', url: 'https://www.livablehousingaustralia.org.au/', type: 'guide', source: 'Livable Housing Australia', description: 'Kitchen design guidelines for accessible housing.', isAustralian: true, isFree: true },
    { title: 'Independent Living Centre', url: 'https://ilcaustralia.org.au/', type: 'guide', source: 'ILC Australia', description: 'Advice on accessible kitchen equipment and aids.', isAustralian: true, isFree: true }
  ],
  keywords: ['kitchenette', 'bench height', 'knee clearance', 'appliances', 'tea', 'coffee', 'TV', 'room amenities', 'in-room']
},

// ─── Entry 37: Booking, inventory and shared facilities ───
{
  questionId: '3.9-D-12',
  questionText: 'Can guests book accessible rooms through your standard booking system?',
  moduleCode: '3.9',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Booking, inventory and shared facilities',
  coveredQuestionIds: ['3.9-D-13', '3.9-D-14', '3.9-D-16'],
  summary: 'Accessible rooms must be bookable through standard online systems with clear descriptions and photos. Properties should track accessible room inventory, locate accessible rooms near lifts and shared facilities, and ensure pools, gyms, and dining areas are on accessible paths from accessible rooms.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'If a guest cannot find or book an accessible room online, they may assume you do not have one. Many people with disability will not phone to ask. Proximity to shared facilities matters because long distances on inaccessible routes effectively cut off accessible room guests from the full property experience.',
    quote: { text: 'I always book online. If I cannot see and select an accessible room on the website, I go elsewhere. I should not have to call.', attribution: 'Frequent traveller with disability' }
  },
  tips: [
    { icon: 'Monitor', text: 'List accessible rooms as a filterable category on your booking system.', priority: 1 },
    { icon: 'Camera', text: 'Include photos of accessibility features: bathroom, doorways, bed, controls.', priority: 2 },
    { icon: 'ClipboardList', text: 'Describe accessibility features in detail, not just "accessible room".', detail: 'List door widths, shower type, grab rails, bed height, alerting systems, and distance to lift.', priority: 3 },
    { icon: 'MapPin', text: 'Locate accessible rooms on ground floor or near lifts.', priority: 4 },
    { icon: 'Building2', text: 'Ensure accessible paths connect accessible rooms to pool, gym, restaurant, and reception.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing booking and shared facility access',
    steps: [
      { text: 'Search your own booking system as a guest: can you filter for or find accessible rooms?' },
      { text: 'Check room descriptions: do they list specific accessibility features?' },
      { text: 'Check room photos: do they show accessibility features?' },
      { text: 'Walk the path from accessible room to pool, gym, restaurant, and reception. Note any barriers.' },
      { text: 'Check whether accessible rooms are near lifts.' },
      { text: 'Review your room inventory: how many accessible rooms do you have and what types?' },
      { text: 'Check third-party booking platforms: do they accurately list your accessible rooms?' }
    ],
    tools: ['Computer or phone for booking test', 'Camera', 'Notepad'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Sections 23-24', requirement: 'Accommodation providers must not discriminate in providing accommodation. This includes making accessible rooms discoverable and bookable on equal terms.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible paths from accessible rooms to communal facilities in new buildings.' }
    ],
    plainEnglish: 'Guests must be able to find and book accessible rooms through your normal booking channels. Accessible rooms should be conveniently located near shared facilities.',
    complianceNote: 'Third-party booking platforms (Booking.com, Expedia) have accessibility filter features. Ensure your listings are accurate.'
  },
  solutions: [
    {
      title: 'Update online listings with accessibility details',
      description: 'Add detailed descriptions and photos of accessibility features to all booking channels.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '2-4 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Photograph all accessibility features in accessible rooms.', 'Write detailed descriptions listing specific features and measurements.', 'Add to your website and all third-party booking platforms.', 'Enable accessibility filters where available.', 'Add an accessibility page to your website with room details.', 'Test the booking flow as a guest seeking an accessible room.']
    },
    {
      title: 'Improve accessible room connectivity to facilities',
      description: 'Ensure accessible paths between rooms and shared amenities.',
      resourceLevel: 'medium', costRange: '$1,000-10,000', timeRequired: '1-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Map paths from each accessible room to pool, gym, restaurant, reception, and parking.', 'Identify and fix barriers on each path.', 'Install directional signage from accessible rooms to facilities.', 'Relocate accessible rooms closer to lifts or facilities if possible.', 'Add pool hoist or ramp if pool is on the accessible path.', 'Ensure gym has accessible entry and at least 2 accessible machines.', 'Document accessible routes in room information guide.']
    },
    {
      title: 'Integrated accessible booking and facility planning',
      description: 'Redesign booking system and facility access for comprehensive inclusion.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage access consultant for property-wide assessment.', 'Redesign booking system with detailed accessibility filtering and features.', 'Add virtual room tours showing accessibility features.', 'Relocate or create accessible rooms near all key facilities.', 'Ensure all shared facilities have accessible entry and equipment.', 'Train all front desk staff on accessible room features.', 'Create accessibility information pack for each room.', 'List on Travability and accessible travel platforms.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Chain', scenario: 'Accessible rooms not findable online. Guests had to phone.', solution: 'Added accessibility filter to booking engine. Created detailed room descriptions with photos. Listed on Travability.', outcome: 'Online accessible room bookings increased 400%. Phone enquiries decreased.', cost: '$500 (staff time)', timeframe: '1 week' },
    { businessType: 'accommodation', businessTypeLabel: 'Holiday Park', scenario: 'Accessible cabin far from pool and amenities.', solution: 'Relocated accessible cabin to site near pool and amenities block. Installed pool hoist. Created accessible path with signage.', outcome: 'Guests with disability access all facilities. Family bookings increased.', cost: '$15,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Travability Accommodation Listing', url: 'https://www.travability.travel/', type: 'website', source: 'Travability', description: 'Platform for listing and finding accessible accommodation in Australia.', isAustralian: true, isFree: true },
    { title: 'Tourism Australia Accessible Accommodation', url: 'https://www.tourism.australia.com/', type: 'guide', source: 'Tourism Australia', description: 'Resources for accommodation providers on accessibility listing.', isAustralian: true, isFree: true }
  ],
  keywords: ['booking', 'online', 'accessible room', 'inventory', 'shared facilities', 'pool', 'gym', 'proximity', 'Travability']
},

// ─── Entry 38: Product access and shopping assistance ───
{
  questionId: '3.10-PC-1',
  questionText: 'Can customers with disability independently access products on shelves and displays?',
  moduleCode: '3.10',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Product access and shopping assistance',
  coveredQuestionIds: ['3.10-PC-2', '3.10-PC-3', '3.10-D-8', '3.10-D-9'],
  summary: 'Product access means ensuring items on shelves are within reach from a wheelchair (400-1200mm), price tags are readable (large print, high contrast), shelf labels are clear, and trained staff are available to assist without being intrusive.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Shopping is an everyday activity that most people take for granted. When products are displayed above reach height, price tags are tiny, or staff do not know how to assist, people with disability lose independence. Wheelchair users can typically reach items between 400mm and 1200mm. Anything higher requires assistance.',
    statistic: { value: '$54 billion', context: 'is the annual spending power of Australians with disability. Retailers who are accessible capture more of this market.', source: 'Australian Network on Disability' }
  },
  tips: [
    { icon: 'ShoppingCart', text: 'Place popular and essential items within reach range: 400mm to 1200mm from floor.', priority: 1 },
    { icon: 'Type', text: 'Use price tags with minimum 14pt font and high contrast.', priority: 2 },
    { icon: 'Users', text: 'Train staff to offer assistance proactively but not intrusively.', detail: 'Ask "Can I help you reach anything?" rather than assuming someone needs help with everything.', priority: 3 },
    { icon: 'Eye', text: 'Ensure aisle width allows wheelchair passage and turning.', measurement: { target: 'Aisle width', acceptable: 'Minimum 1200mm clear, 1800mm for passing', unit: 'mm' }, priority: 4 },
    { icon: 'Smartphone', text: 'Offer digital product catalogue for browsing from accessible devices.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing product access',
    steps: [
      { text: 'Measure shelf heights for key product areas.', measurement: { target: 'Reach range', acceptable: '400mm to 1200mm for essential items', unit: 'mm' } },
      { text: 'Check price tag readability: font size and contrast.' },
      { text: 'Measure aisle widths.', measurement: { target: 'Aisle width', acceptable: 'Minimum 1200mm clear', unit: 'mm' } },
      { text: 'Navigate the store in a wheelchair or with a mobility aid. Note all barriers.' },
      { text: 'Ask staff: how would you help a vision-impaired customer find a product?' },
      { text: 'Check whether an assistance bell or call button is available.' },
      { text: 'Check shelf edge labels: are they clear and unobstructed?' }
    ],
    tools: ['Tape measure', 'Camera', 'Wheelchair for testing'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Retail providers must not discriminate in providing goods. This includes making products accessible and providing assistance.' },
    related: [
      { code: 'AS1428.1', relevance: 'Reach range for controls and items: 900-1100mm optimal, 400-1200mm acceptable from wheelchair.' }
    ],
    plainEnglish: 'Customers with disability must be able to browse and purchase products. Arrange key items within reach and offer assistance.',
    complianceNote: 'Not every item needs to be at wheelchair height, but essential and popular items should be, and staff assistance must be readily available for higher items.'
  },
  solutions: [
    {
      title: 'Rearrange displays and train staff',
      description: 'Move popular items to reach height and train staff in accessible customer service.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify top-selling and essential items.', 'Relocate to 400-1200mm height range.', 'Increase price tag font size to 14pt minimum.', 'Train staff: offer help proactively, describe products to vision-impaired customers, carry baskets.', 'Install an assistance bell at accessible height.', 'Brief on disability awareness and respectful communication.']
    },
    {
      title: 'Redesign store layout for accessibility',
      description: 'Widen aisles, lower displays, and install digital product-finding aids.',
      resourceLevel: 'medium', costRange: '$2,000-10,000', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Widen main aisles to 1500mm minimum.', 'Lower gondola displays so all shelves are below 1200mm.', 'Install pull-out lower shelves for heavy items.', 'Add magnifying sheet holders near small print (prescriptions, ingredients).', 'Create digital product catalogue accessible via QR code.', 'Install accessible customer service counter.', 'Add way-finding signage with large print.']
    },
    {
      title: 'Universal design retail fit-out',
      description: 'Full store redesign with universal design principles.',
      resourceLevel: 'high', costRange: '$20,000-60,000', timeRequired: '4-8 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage retail access consultant.', 'Design fixture layout with universal reach ranges.', 'Install motorised display units where needed.', 'Deploy in-store navigation app for vision-impaired customers.', 'Design accessible checkout zone.', 'Install sensory-friendly lighting zones.', 'Create quiet shopping hours.', 'Market as an accessible shopping destination.']
    }
  ],
  examples: [
    { businessType: 'retail', businessTypeLabel: 'Supermarket', scenario: 'Essential items on top shelves. Tiny price tags.', solution: 'Moved essential items to middle shelves. Increased price tag size to 16pt. Trained staff in assisted shopping. Added assistance bell.', outcome: 'Customers with disability shop more independently. Fewer staff complaints about unreachable items.', cost: '$100', timeframe: '2 days' },
    { businessType: 'retail', businessTypeLabel: 'Pharmacy', scenario: 'Products behind high counter. No browsing possible from wheelchair.', solution: 'Lowered part of counter. Created browse-able display at wheelchair height. Staff trained to bring items for comparison.', outcome: 'Wheelchair customers browse independently. Sales from accessible section strong.', cost: '$3,000', timeframe: '1 week' },
    { businessType: 'retail', businessTypeLabel: 'Clothing Store', scenario: 'Racks too high and aisles too narrow for wheelchair.', solution: 'Widened aisles to 1500mm. Lowered main clothing racks. Added seated browsing area with samples at reach height.', outcome: 'Accessible shopping experience praised online. Increased foot traffic.', cost: '$5,000', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'AND Retail Accessibility Guide', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Guide for retailers on accessible customer service.', isAustralian: true, isFree: true },
    { title: 'Disability Confident Customer Service', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'JobAccess', description: 'Training resources for disability-confident customer service.', isAustralian: true, isFree: true }
  ],
  keywords: ['retail', 'shopping', 'reach height', 'shelves', 'price tags', 'assistance', 'aisle width', 'product access']
},

// ─── Entry 39: Accessible checkout and fitting rooms ───
{
  questionId: '3.10-PC-4',
  questionText: 'Do you have an accessible checkout counter and fitting rooms?',
  moduleCode: '3.10',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Accessible checkout and fitting rooms',
  coveredQuestionIds: ['3.10-D-1', '3.10-D-2', '3.10-D-3', '3.10-D-4', '3.10-D-5'],
  summary: 'Accessible checkouts need a lowered counter section (850mm), accessible EFTPOS terminals within reach, and space for a wheelchair. Fitting rooms need wide doors (850mm+), 1500mm turning circle, grab rails, mirror at seated height, and a fold-down seat.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Checkout and fitting rooms are where many retail accessibility failures occur. A counter that is too high means a wheelchair user cannot see the cashier or reach the EFTPOS terminal. A fitting room that is too small means a wheelchair user cannot try on clothes. These barriers are easily avoidable with basic design considerations.',
    quote: { text: 'I cannot see over the counter to interact with the cashier. I have to hold my card up and hope they can reach it. It is dehumanising.', attribution: 'Wheelchair user, retail survey' }
  },
  tips: [
    { icon: 'CreditCard', text: 'Provide at least one checkout counter section at 850mm height.', priority: 1 },
    { icon: 'Smartphone', text: 'Mount EFTPOS terminal on a flexible arm or present it at counter height.', priority: 2 },
    { icon: 'DoorOpen', text: 'Provide at least one fitting room with 850mm+ door and 1500mm turning circle.', priority: 3 },
    { icon: 'Hand', text: 'Install grab rails and a fold-down seat in the accessible fitting room.', priority: 4 },
    { icon: 'Eye', text: 'Mount mirror so it serves both standing and seated users (full-length or tilted).', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing checkout and fitting rooms',
    steps: [
      { text: 'Measure checkout counter height.', measurement: { target: 'Lowered section', acceptable: '850mm maximum', unit: 'mm' } },
      { text: 'Check EFTPOS terminal reach from wheelchair position.' },
      { text: 'Check self-checkout: is at least one at accessible height with screen readable from wheelchair?' },
      { text: 'Measure fitting room door width.', measurement: { target: 'Door clear width', acceptable: 'Minimum 850mm', unit: 'mm' } },
      { text: 'Measure fitting room floor space.', measurement: { target: 'Turning circle', acceptable: 'Minimum 1500mm diameter', unit: 'mm' } },
      { text: 'Check for grab rails and fold-down seat in accessible fitting room.' },
      { text: 'Check mirror: visible from seated position?' },
      { text: 'Check accessible fitting room signage and availability (not used as storage).' }
    ],
    tools: ['Tape measure', 'Camera'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.1', section: 'Section 15', requirement: 'Service counters must include a section at 850mm maximum height. Fitting rooms must meet minimum dimensions with grab rails and seat.' },
    related: [
      { code: 'Access-to-Premises', relevance: 'New retail buildings must provide accessible service counters and at least one accessible fitting room.' },
      { code: 'DDA', relevance: 'Inaccessible checkout or fitting rooms may constitute discrimination in providing goods.' }
    ],
    plainEnglish: 'You need at least one lower checkout counter and one spacious fitting room with support features so wheelchair users can pay and try on clothes independently.',
    complianceNote: 'Accessible fitting rooms are frequently used as storage. Establish a clear policy that they must remain clear and available at all times.'
  },
  solutions: [
    {
      title: 'Quick adjustments to checkout and fitting rooms',
      description: 'Lower EFTPOS placement, clear the accessible fitting room, add basic supports.',
      resourceLevel: 'low', costRange: '$100-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Mount EFTPOS on flexible arm that can be lowered to 850mm.', 'Clear accessible fitting room of any stored items.', 'Add a sturdy fold-down seat or chair.', 'Install a hook at 1200mm for garments.', 'Add a full-length mirror or tilt existing mirror.', 'Post clear signage identifying the accessible fitting room.']
    },
    {
      title: 'Install accessible counter and upgrade fitting room',
      description: 'Build a lowered counter section and properly equip the accessible fitting room.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '1-2 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install lowered counter section at 850mm.', 'Widen fitting room doorway to 900mm.', 'Install grab rails per AS 1428.1.', 'Install fold-down shower-style seat at 480mm.', 'Install accessible mirror and lighting.', 'Add emergency call button in fitting room.', 'Ensure self-checkout has at least one accessible unit.']
    },
    {
      title: 'Redesign checkout and fitting area for universal access',
      description: 'Full redesign of customer service areas.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '2-4 weeks', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage retail access consultant.', 'Design checkout zone with universal height counters.', 'Install accessible self-checkout with wheelchair approach.', 'Build spacious accessible fitting rooms exceeding minimum standards.', 'Install hearing loop at checkout.', 'Add tactile floor indicators to guide to accessible features.', 'Train all staff on accessible fitting room procedures.', 'Install sensory-friendly lighting in fitting area.']
    }
  ],
  examples: [
    { businessType: 'retail', businessTypeLabel: 'Department Store', scenario: 'All counters at 1100mm. No accessible fitting room.', solution: 'Lowered one section of checkout to 850mm. Converted largest fitting room to accessible with grab rails, seat, and 1500mm space. EFTPOS on flexible arm.', outcome: 'Wheelchair customers served independently. Staff appreciate clear process.', cost: '$4,500', timeframe: '1 week' },
    { businessType: 'retail', businessTypeLabel: 'Clothing Boutique', scenario: 'Fitting rooms too small for wheelchair.', solution: 'Combined two cubicles into one accessible space. Added grab rail, seat, and curtain (easier than door for wheelchair entry).', outcome: 'Wheelchair customers try clothes on for the first time. Loyal customer base.', cost: '$2,000', timeframe: '3 days' }
  ],
  resources: [
    { title: 'Retail Accessibility Guidelines', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Guidance on accessible retail design including checkout and fitting rooms.', isAustralian: true, isFree: true },
    { title: 'AS 1428.1 Service Counters', url: 'https://www.standards.org.au/', type: 'guide', source: 'Standards Australia', description: 'Requirements for accessible service counters and fitting rooms.', isAustralian: true, isFree: false }
  ],
  keywords: ['checkout', 'counter', 'EFTPOS', 'fitting room', 'self-checkout', 'grab rail', 'mirror', 'retail']
},

// ─── Entry 40: Returns, delivery and alternative channels ───
{
  questionId: '3.10-D-6',
  questionText: 'Do you offer accessible alternatives to in-store shopping such as delivery or click-and-collect?',
  moduleCode: '3.10',
  moduleGroup: 'during-visit',
  diapCategory: 'customer-service',
  title: 'Returns, delivery and alternative channels',
  coveredQuestionIds: ['3.10-D-7'],
  summary: 'Alternative shopping channels ensure people who face barriers in-store can still access your products. This includes accessible online ordering, home delivery, click-and-collect with accessible pickup points, phone ordering, and accessible returns processes.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Not every shopping trip can happen in store. Some people have conditions that make in-store shopping extremely difficult or impossible on certain days. Energy-limiting conditions, chronic pain, agoraphobia, and severe mobility restrictions all create barriers. Alternative channels provide equitable access to your products and services.',
    statistic: { value: '87%', context: 'of Australians with disability shop online. Accessible e-commerce and delivery services are essential to reaching this market.', source: 'Australian Communications and Media Authority' }
  },
  tips: [
    { icon: 'Truck', text: 'Offer home delivery with accessible scheduling (flexible time windows, ground-floor options).', priority: 1 },
    { icon: 'Package', text: 'Make click-and-collect pickup points wheelchair accessible with lowered counters.', priority: 2 },
    { icon: 'Globe', text: 'Ensure online store meets WCAG 2.1 AA for screen reader users.', priority: 3 },
    { icon: 'Phone', text: 'Offer phone ordering as an alternative for people who cannot use digital platforms.', priority: 4 },
    { icon: 'Heart', text: 'Make returns easy: accept by post, in-store at accessible counter, or via home collection.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing alternative shopping channels',
    steps: [
      { text: 'Check online store accessibility with a screen reader and keyboard-only navigation.' },
      { text: 'Test click-and-collect: is the pickup point accessible?' },
      { text: 'Review delivery options: are flexible time windows available?' },
      { text: 'Check phone ordering: is the process clear and staff trained?' },
      { text: 'Test the returns process: can it be done accessibly in-store and by post?' },
      { text: 'Check whether accessibility information is published for all channels.' }
    ],
    tools: ['Screen reader', 'Computer', 'Phone'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must ensure goods and services are accessible. This extends to all delivery channels.' },
    related: [
      { code: 'WCAG', relevance: 'Online stores must meet WCAG 2.1 AA for accessibility.' }
    ],
    plainEnglish: 'If customers with disability face barriers shopping in store, you should offer accessible alternatives like delivery, online ordering, and phone ordering.',
    complianceNote: 'Alternative channels are not a substitute for in-store accessibility, but they complement it for customers who face specific barriers.'
  },
  solutions: [
    {
      title: 'Set up basic alternative channels',
      description: 'Offer phone ordering, accessible returns, and delivery options.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Establish a phone ordering process with trained staff.', 'Ensure returns can be posted with a prepaid label.', 'Set up flexible delivery windows.', 'Create accessible click-and-collect point at an accessible counter.', 'Publish all options on website and in-store signage.', 'Brief staff on assisting customers using alternative channels.']
    },
    {
      title: 'Develop accessible online store',
      description: 'Build or upgrade online ordering to WCAG 2.1 AA with integrated delivery.',
      resourceLevel: 'medium', costRange: '$3,000-15,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Audit existing online store against WCAG 2.1 AA.', 'Fix identified accessibility issues.', 'Add alt text to all product images.', 'Ensure checkout is keyboard-navigable and screen reader compatible.', 'Integrate delivery with flexible scheduling.', 'Add accessible click-and-collect booking.', 'Test with people with disability.']
    },
    {
      title: 'Omnichannel accessible retail',
      description: 'Full accessible shopping experience across all channels.',
      resourceLevel: 'high', costRange: '$15,000-50,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage accessibility consultant for omnichannel review.', 'Redesign online store for universal access.', 'Implement accessible delivery tracking with SMS and email.', 'Create accessible personal shopping service.', 'Deploy live chat with accessibility features.', 'Build accessible product information database.', 'Launch accessible shopping app.', 'Monitor and improve based on customer feedback.']
    }
  ],
  examples: [
    { businessType: 'retail', businessTypeLabel: 'Grocery Store', scenario: 'No delivery service. In-store shopping difficult for many customers with disability.', solution: 'Launched phone and online ordering with home delivery. Flexible 2-hour delivery windows. Accessible website tested with screen readers.', outcome: 'Customers with disability order weekly. Delivery service profitable for all customers.', cost: '$8,000 setup', timeframe: '4 weeks' },
    { businessType: 'retail', businessTypeLabel: 'Bookshop', scenario: 'Only in-store shopping available.', solution: 'Added phone ordering and accessible click-and-collect with curbside pickup option. Free postal returns.', outcome: 'Regular phone orders from housebound customers. Click-and-collect popular.', cost: '$200', timeframe: '1 week' }
  ],
  resources: [
    { title: 'WCAG 2.1 Quick Reference', url: 'https://www.w3.org/WAI/WCAG21/quickref/', type: 'website', source: 'W3C', description: 'Full reference for web accessibility standards.', isFree: true },
    { title: 'Accessible E-commerce Guide', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Guidance on making online shopping accessible.', isAustralian: true, isFree: true }
  ],
  keywords: ['delivery', 'click-and-collect', 'online shopping', 'phone ordering', 'returns', 'alternative channels', 'e-commerce', 'WCAG']
},

];

export default duringVisitHelp;
