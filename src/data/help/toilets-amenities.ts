/**
 * Help Content: Toilets and Amenities
 * Module: 3.2
 * 6 entries covering all 20 substantive question IDs
 */

import type { HelpContent } from './types';

export const toiletsAmenitiesHelp: HelpContent[] = [

// ─── Entry 1: Accessible Toilet Essentials ───
{
  questionId: '3.2-1-1',
  questionText: 'Do you have at least one accessible toilet?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Accessible Toilet Essentials',
  coveredQuestionIds: ['3.2-1-2', '3.2-1-4'],
  summary: 'An accessible toilet is often the single biggest factor in whether someone can visit your venue. It is not simply a large toilet. It is a purpose-built facility with specific dimensions, grab rails, clear floor space for wheelchair transfer, and step-free entry. If you do not have one on-site, you must know where the nearest one is and be able to direct visitors to it.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Without an accessible toilet, many people with disability will limit their visit to under an hour, or not come at all. This includes wheelchair users, people with stomas, those who need carer assistance, and anyone with continence issues. Keeping the accessible toilet free of storage, cleaning equipment, or boxes is just as important as having one. A blocked or cluttered accessible toilet is effectively no accessible toilet at all.',
    statistic: {
      value: '4.4 million',
      context: 'Australians have a disability. Accessible toilets are a basic requirement for participation in community life.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'The door must open outward or slide, with a minimum clear opening of 850mm.',
      detail: 'Inward-opening doors reduce internal space and can trap someone who has fallen. An outward-opening or sliding door allows rescue access.',
      priority: 1
    },
    {
      icon: 'Maximize',
      text: 'Minimum internal dimensions: 1900mm x 2300mm (current standard).',
      detail: 'Older installations may be 1600mm x 2000mm. Both require clear floor space beside the toilet for wheelchair transfer.',
      priority: 2
    },
    {
      icon: 'CircleAlert',
      text: 'Never use the accessible toilet for storage.',
      detail: 'Mops, high chairs, spare stock, and cleaning carts must be stored elsewhere. Do a weekly check.',
      priority: 3
    },
    {
      icon: 'MapPin',
      text: 'Know the nearest accessible toilet, even if it is off-site.',
      detail: 'If yours is out of order or you do not have one, staff must be able to direct visitors. Identify the nearest public accessible toilet and keep the address at reception.',
      priority: 4
    },
    {
      icon: 'Accessibility',
      text: 'The toilet must be on an accessible path of travel from your main areas.',
      detail: 'A toilet behind a heavy fire door, up a step, or through a narrow corridor is not effectively accessible.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Checking your accessible toilet',
    steps: [
      {
        text: 'Measure the door clear opening width.',
        measurement: { target: 'Door clear opening', acceptable: 'Minimum 850mm', unit: 'mm' }
      },
      {
        text: 'Measure the internal floor space.',
        measurement: { target: 'Internal dimensions', acceptable: '1900mm x 2300mm (current); 1600mm x 2000mm (older)', unit: 'mm' }
      },
      { text: 'Check the path from your main area to the toilet: is it step-free, wide enough (min 1000mm), and clearly signed?' },
      { text: 'Open the door and look inside: is the floor space completely clear of stored items, bins, cleaning gear, or furniture?' },
      { text: 'Try the door handle and lock from inside, ideally from a seated position. Can it be operated with one hand?' },
      { text: 'Check if the toilet is listed on the National Public Toilet Map (toiletmap.gov.au) if it is available to the public.' }
    ],
    tools: ['Tape measure (5m)', 'Camera for documentation'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'Where sanitary facilities are provided, at least one accessible unisex toilet must be provided. It must meet specific dimensional, grab rail, and fixture requirements.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible sanitary facilities in all buildings to which the public has access, with specific ratios for larger buildings.' },
      { code: 'NCC', relevance: 'National Construction Code references AS 1428.1 for accessible toilet design requirements in new buildings and major renovations.' }
    ],
    plainEnglish: 'If your venue has toilets for visitors, at least one must be fully accessible. It must be large enough for a wheelchair, have grab rails, and be on a step-free path.',
    complianceNote: 'Even if your building predates the current standard, the DDA may require you to make reasonable adjustments to provide accessible toilet facilities.'
  },

  solutions: [
    {
      title: 'Clear and maintain the existing accessible toilet',
      description: 'Remove all stored items, add a weekly check to your cleaning roster, and post a small notice on the door asking staff not to store items inside.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Walk through the accessible toilet and remove all items that are not fixed fixtures (mops, buckets, high chairs, stock).',
        'Find a new storage location for displaced items.',
        'Add "Check accessible toilet is clear" to your daily or weekly cleaning checklist.',
        'Brief all staff that the accessible toilet is not a storeroom.'
      ]
    },
    {
      title: 'Identify and signpost the nearest off-site accessible toilet',
      description: 'If you do not have an accessible toilet, identify the nearest one and make directions available to all front-of-house staff.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1 hour',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Search toiletmap.gov.au for the nearest accessible public toilet to your venue.',
        'Walk the route to confirm it is accessible (step-free, reasonable distance).',
        'Write simple directions (with distance and estimated time) and keep at reception.',
        'Brief all customer-facing staff so they can direct visitors confidently.'
      ]
    },
    {
      title: 'Upgrade an existing toilet to meet accessibility standards',
      description: 'Commission an access consultant to assess your existing toilet space and engage a builder to refit it to AS 1428.1 requirements.',
      resourceLevel: 'high',
      costRange: '$8,000-25,000',
      timeRequired: '2-6 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Engage an access consultant to assess the most suitable toilet for conversion.',
        'Obtain a design that meets AS 1428.1 Section 15 (dimensions, grab rails, fixtures, door swing).',
        'Get quotes from at least two builders experienced in accessible construction.',
        'Submit for building approval if required (check with your local council).',
        'After installation, have the access consultant verify the completed work against the standard.',
        'Register the toilet on toiletmap.gov.au if it is available to the public.'
      ]
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A popular cafe had an accessible toilet that was regularly filled with highchairs, mop buckets, and a spare fridge.',
      solution: 'Relocated storage to a small cupboard under the stairs. Added a laminated sign inside the door: "This is an accessible toilet. Please do not store items here." Added a weekly check to the cleaning roster.',
      outcome: 'Wheelchair-using customers could actually use the toilet for the first time. Staff awareness improved across the board.',
      cost: 'Free'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping strip',
      scenario: 'A small retail shop had no customer toilet at all.',
      solution: 'Identified the nearest public accessible toilet (150m away in the local library). Printed simple directions with a map and kept them at the counter. Staff were briefed to offer the information proactively.',
      outcome: 'Customers with disability could plan their visit knowing a toilet was nearby. The shop received positive feedback for being upfront about it.',
      cost: 'Free'
    }
  ],

  resources: [
    {
      title: 'National Public Toilet Map',
      url: 'https://toiletmap.gov.au/',
      type: 'tool',
      source: 'Australian Government',
      description: 'Searchable map of public toilets across Australia, including accessible facilities.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS 1428.1:2021 Summary',
      url: 'https://www.access.asn.au/standards',
      type: 'guide',
      source: 'Association of Consultants in Access Australia',
      description: 'Overview of current accessible toilet requirements.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.2-D-8',
      questionText: 'Are grab rails present on both sides of the toilet?',
      relationship: 'Grab rails are a core component of accessible toilet compliance',
      moduleCode: '3.2'
    },
    {
      questionId: '2.3-D-1',
      questionText: 'Are paths of travel to facilities step-free?',
      relationship: 'The path to the toilet must be accessible',
      moduleCode: '2.3'
    }
  ],

  keywords: ['accessible toilet', 'wheelchair toilet', 'storage', 'dimensions', 'nearest toilet', 'toilet map'],
},

// ─── Entry 2: Layout, Transfer Space and Grab Rails ───
{
  questionId: '3.2-D-8',
  questionText: 'Are grab rails present on both sides of the toilet?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Layout, Transfer Space and Grab Rails',
  coveredQuestionIds: ['3.2-D-9', '3.2-D-13'],
  summary: 'Grab rails, adequate transfer space beside the toilet, and a backrest are the three elements that make a wheelchair-to-toilet transfer possible. Without them, the toilet is unusable for many wheelchair users regardless of how large the room is.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'A wheelchair user typically transfers sideways onto the toilet. This requires clear space beside the pan (at least 800mm from the centre of the pan to the nearest wall or fixture), a horizontal grab rail to push up from, and a vertical or angled rail to steady themselves during the transfer. A backrest provides trunk support for people who cannot sit unsupported. If any of these are missing, the person may not be able to use the toilet safely.',
    quote: {
      text: 'The grab rails are not optional. They are what stops me falling. If one is missing or loose, I cannot use that toilet.',
      attribution: 'Wheelchair user, access audit feedback'
    }
  },

  tips: [
    {
      icon: 'ArrowLeftRight',
      text: 'Clear space beside the toilet must be at least 800mm from pan centre to nearest wall.',
      detail: 'This is the wheelchair landing zone. It must be completely clear: no bins, no pipes, no radiators.',
      priority: 1
    },
    {
      icon: 'Grip',
      text: 'Horizontal grab rail on the transfer side at 800-810mm above floor level.',
      detail: 'The rail must be strong enough to bear a person\'s full weight (minimum 1100N). Check it is firmly fixed and does not wobble.',
      priority: 2
    },
    {
      icon: 'Grip',
      text: 'A hinged drop-down rail on the open (transfer) side allows the wheelchair to approach.',
      detail: 'When folded up, it clears the transfer space. When folded down, it provides support once seated.',
      priority: 3
    },
    {
      icon: 'ArrowUp',
      text: 'Add a backrest if one is not fitted.',
      detail: 'A padded backrest behind the cistern (or a separate wall-mounted backrest) supports people who lack trunk stability. It should be 150mm behind the toilet seat.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Checking grab rails and transfer space',
    steps: [
      {
        text: 'Measure the clear space beside the toilet (pan centre to nearest wall or fixture).',
        measurement: { target: 'Transfer space', acceptable: 'Minimum 800mm from pan centre', unit: 'mm' }
      },
      {
        text: 'Check the fixed grab rail height on the wall side.',
        measurement: { target: 'Grab rail height', acceptable: '800-810mm above floor', unit: 'mm' }
      },
      { text: 'Grip each rail firmly and try to move it. It should not flex, rotate, or pull away from the wall.' },
      { text: 'If there is a drop-down rail, test that it locks securely in both the up and down positions.' },
      { text: 'Check for a backrest. If the cistern is flush against the wall, a separate backrest may be needed.' },
      { text: 'Confirm nothing is stored in the transfer space (bins, cleaning supplies, or signage stands).' }
    ],
    tools: ['Tape measure', 'Camera for documentation'],
    estimatedTime: '10 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15.3',
      requirement: 'Grab rails must be provided on both sides of the toilet pan. The wall-side rail must be horizontal at 800-810mm. The transfer side must have a drop-down rail or equivalent. A backrest must be provided where no cistern backrest exists.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Incorporates AS 1428.1 grab rail and transfer space requirements for all new and substantially renovated buildings.' }
    ],
    plainEnglish: 'Both sides of the toilet need a grab rail. One is fixed to the wall; the other folds up so a wheelchair can get alongside. The toilet also needs a backrest.',
    complianceNote: 'Grab rails must be rated to support 1100N (about 110kg of force). Standard towel rails and decorative rails are not suitable.'
  },

  solutions: [
    {
      title: 'Test and tighten existing grab rails',
      description: 'Check each rail for looseness and have a handyperson retighten or refix any that have worked loose.',
      resourceLevel: 'low',
      costRange: 'Free-$100',
      timeRequired: '30 minutes',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Grip each grab rail and try to move it in all directions.',
        'If any rail moves, mark it and schedule a fix.',
        'A handyperson can retighten wall bolts. If the wall anchor has failed, a contractor should refix into solid structure.',
        'Test again after repair.'
      ]
    },
    {
      title: 'Install a drop-down grab rail on the transfer side',
      description: 'Add a hinged grab rail that folds up for wheelchair approach and down for support once seated.',
      resourceLevel: 'medium',
      costRange: '$200-500 installed',
      timeRequired: '1-2 hours',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Confirm the transfer side wall can support the load (solid masonry, timber stud with blocking, or steel frame).',
        'Purchase an AS 1428.1-compliant drop-down rail (brands: Bobrick, Gentec, Barben).',
        'Install at 800-810mm height, centred on the toilet pan.',
        'Test the locking mechanism in both positions.',
        'Confirm the rail clears the wheelchair approach when folded up.'
      ]
    },
    {
      title: 'Add a backrest',
      description: 'Install a padded backrest behind the toilet for people who need trunk support.',
      resourceLevel: 'low',
      costRange: '$150-350 installed',
      timeRequired: '1 hour',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Check if the existing cistern or wall provides any back support. If the cistern is low-profile or concealed, a separate backrest is needed.',
        'Purchase a padded backrest designed for accessible toilets.',
        'Install so the front face is approximately 150mm behind the toilet seat.',
        'Ensure the backrest is securely fixed and can support body weight.'
      ]
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel accessible room had grab rails but one had worked loose over time.',
      solution: 'Included grab rail checks in the monthly maintenance schedule. The loose rail was refixed into a steel backing plate for long-term strength.',
      outcome: 'No further complaints. Maintenance now checks all accessible room fittings quarterly.',
      cost: '$120 for refix'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Community centre',
      scenario: 'An accessible toilet had been built to the older, smaller standard and lacked a drop-down rail.',
      solution: 'Installed a drop-down rail on the transfer side and a padded backrest. Also cleared a filing cabinet that had been placed in the transfer zone.',
      outcome: 'Local wheelchair users reported the facility was now genuinely usable for the first time.',
      cost: '$600 total'
    }
  ],

  resources: [
    {
      title: 'Grab Rail Positioning Guide',
      url: 'https://www.access.asn.au/standards',
      type: 'guide',
      source: 'Association of Consultants in Access Australia',
      description: 'Visual guide to correct grab rail heights and positions.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.2-1-1',
      questionText: 'Do you have at least one accessible toilet?',
      relationship: 'Grab rails are a core requirement of an accessible toilet',
      moduleCode: '3.2'
    }
  ],

  keywords: ['grab rails', 'transfer space', 'backrest', 'wheelchair transfer', 'drop-down rail'],
},

// ─── Entry 3: Doors, Taps, and Fittings ───
{
  questionId: '3.2-D-1',
  questionText: 'Are toilet doors easy to open and lock from inside?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Doors, Taps, and Fittings',
  coveredQuestionIds: ['3.2-D-4', '3.2-D-5', '3.2-D-6', '3.2-D-10', '3.2-D-11', '3.2-D-12'],
  summary: 'Every fixture inside an accessible toilet must be usable by someone with limited grip, reach, or fine motor control. This covers the door lock, taps, soap dispensers, hand dryers, bins, washbasin, toilet paper holder, flush button, coat hook, and mirror. If any one fixture is unusable, it undermines the whole facility.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Many people with disability have reduced hand strength, limited reach, or use only one hand. A twist-lock they cannot operate means they cannot use the toilet privately. A sensor tap that does not detect their hand means they cannot wash. A toilet paper holder behind their shoulder means they cannot reach it. Every detail matters because the person is in a vulnerable position.',
    statistic: {
      value: '1.3 million',
      context: 'Australians have a physical condition affecting their upper limbs. Grip-free fixtures benefit all of them.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'Door lock: lever or push-slide type, operable with one hand and no tight grip.',
      detail: 'The lock indicator should show red/green (occupied/vacant) clearly from outside. The lock must be releasable from outside in emergencies.',
      priority: 1
    },
    {
      icon: 'Droplets',
      text: 'Taps: lever, sensor, or push-type. No twist or cross-head taps.',
      detail: 'Sensor taps are ideal but must detect hands reliably (some struggle with dark skin tones or prosthetics). Lever taps are the most universally reliable.',
      priority: 2
    },
    {
      icon: 'Hand',
      text: 'Soap and hand dryer must be reachable from a seated position (900-1100mm height).',
      detail: 'Wall-mounted soap dispensers should be push-operated, not twist. Paper towel is often easier than air dryers for people with limited hand function.',
      priority: 3
    },
    {
      icon: 'ArrowDown',
      text: 'Washbasin must have knee clearance underneath for wheelchair approach.',
      detail: 'Minimum 600mm from floor to underside of basin. Pipes underneath must be recessed or insulated to prevent burns.',
      priority: 4
    },
    {
      icon: 'RotateCw',
      text: 'Flush button, toilet paper, and coat hook must all be reachable from the toilet.',
      detail: 'Mount these on the transfer side (not behind the user). Coat hook at 1200mm, toilet paper at 600-700mm height and within arm\'s reach.',
      priority: 5
    },
    {
      icon: 'Scan',
      text: 'Mirror should be usable from both standing and seated positions.',
      detail: 'A tilted mirror or a full-length mirror (from 900mm to at least 1800mm) serves both. Avoid mirrors mounted too high for wheelchair users.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Checking accessible toilet fittings',
    steps: [
      { text: 'Sit in a chair (simulating wheelchair height, roughly 450-500mm seat height) and try to operate the door lock with one hand.' },
      {
        text: 'Test taps: can you turn them on with a closed fist? If not, they need replacing.',
      },
      {
        text: 'Reach for the soap dispenser from the seated position.',
        measurement: { target: 'Soap dispenser height', acceptable: '900-1100mm above floor', unit: 'mm' }
      },
      {
        text: 'Check washbasin knee clearance.',
        measurement: { target: 'Knee clearance under basin', acceptable: 'Minimum 600mm from floor', unit: 'mm' }
      },
      { text: 'From the toilet seat, reach for the flush button, toilet paper, and coat hook. All should be within arm\'s reach without leaning dangerously.' },
      { text: 'Check the mirror: can you see your face from both standing and seated?' },
      { text: 'Open the sanitary bin: is it within reach and operable with one hand?' }
    ],
    tools: ['Tape measure', 'A standard dining chair (to simulate wheelchair height)'],
    estimatedTime: '15 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'All fixtures in an accessible toilet must be operable with one hand without tight grasping, pinching, or twisting. Washbasins must provide knee and toe clearance. Fittings must be within prescribed reach ranges.'
    },
    related: [
      { code: 'AS1428.2', relevance: 'Enhanced provisions recommend additional features including automatic taps and hands-free soap dispensers.' }
    ],
    plainEnglish: 'Everything in the accessible toilet must work for someone using one hand, from a seated position, without needing to grip or twist. Taps, locks, soap, flush, toilet paper, and hooks all count.',
    complianceNote: 'Replacing non-compliant fixtures (e.g. twist taps, high-mounted soap) is often straightforward and inexpensive. It is one of the highest-impact upgrades you can make.'
  },

  solutions: [
    {
      title: 'Replace twist taps with lever taps',
      description: 'Swap cross-head or twist taps for lever-operated or sensor taps. Lever taps are the most cost-effective upgrade.',
      resourceLevel: 'low',
      costRange: '$80-250 per tap (supply and install)',
      timeRequired: '1-2 hours',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify which taps are twist or cross-head type.',
        'Purchase lever taps compatible with your existing plumbing (most standard basins accept lever replacements).',
        'Engage a plumber to swap them. This is typically a 30-minute job per tap.',
        'Test water flow and temperature after installation.'
      ]
    },
    {
      title: 'Reposition toilet paper, soap, and coat hook within reach',
      description: 'Move fixtures that are out of reach to positions compliant with AS 1428.1 reach ranges.',
      resourceLevel: 'low',
      costRange: '$50-200',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Sit on the toilet and note which fixtures you cannot comfortably reach.',
        'Move the toilet paper holder to the transfer side, 600-700mm above floor.',
        'Relocate the coat hook to 1200mm height on a side wall.',
        'If the soap dispenser is above 1100mm, lower it or add a second one at 900-1000mm.',
        'Patch old screw holes with filler and repaint if needed.'
      ]
    },
    {
      title: 'Replace the door lock with a lever-type accessible lock',
      description: 'Swap a twist or pinch lock for a lever-slide lock with a clear red/green indicator and emergency external release.',
      resourceLevel: 'low',
      costRange: '$40-120',
      timeRequired: '1 hour',
      implementedBy: 'staff',
      impact: 'significant',
      steps: [
        'Purchase an accessible toilet lock with lever operation and occupancy indicator (brands: Metlam, Bobrick).',
        'Remove the existing lock.',
        'Install the new lock. Most accessible locks use the same screw pattern as standard locks.',
        'Test from inside: can it be operated with a closed fist?',
        'Test the emergency release from outside with a coin or flat tool.'
      ]
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had an accessible toilet with twist taps and a soap dispenser mounted at 1400mm.',
      solution: 'Replaced both taps with levers ($160 total), lowered the soap dispenser to 1000mm, and added a paper towel dispenser at 950mm to complement the wall-mounted air dryer that some customers found difficult to use.',
      outcome: 'Positive feedback from customers with arthritis and wheelchair users. Total spend under $250.',
      cost: '$250'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Library',
      scenario: 'A library accessible toilet had the toilet paper holder behind the user and the mirror mounted at standing height only.',
      solution: 'Moved the toilet paper holder to the side wall within reach, installed a tilted mirror lower on the wall, and replaced the pinch-type lock with a lever lock.',
      outcome: 'All fixtures now reachable from the toilet. Reported as a model upgrade for other council buildings.',
      cost: '$300'
    }
  ],

  resources: [
    {
      title: 'Building Access Handbook',
      url: 'https://www.humanrights.gov.au/our-work/disability-rights/publications/building-access-handbook',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guidance on accessible building features including sanitary facilities.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.2-D-8',
      questionText: 'Are grab rails present on both sides of the toilet?',
      relationship: 'Grab rails and fixtures together determine toilet usability',
      moduleCode: '3.2'
    }
  ],

  keywords: ['taps', 'lever', 'door lock', 'soap', 'washbasin', 'toilet paper', 'mirror', 'coat hook', 'flush', 'fittings'],
},

// ─── Entry 4: Signage, Contrast, and Emergency ───
{
  questionId: '3.2-1-3',
  questionText: 'Is toilet signage clear, with tactile and Braille elements where required?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Signage, Contrast, and Emergency Alarm',
  coveredQuestionIds: ['3.2-1-5', '3.2-D-14'],
  summary: 'Clear signage helps everyone find the toilet. Tactile and Braille signage is essential for people who are blind or have low vision. Visual contrast on surfaces and fittings helps people with low vision use the facility independently. An emergency alarm allows someone who has fallen to call for help.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'People who are blind or have low vision rely on tactile signs (raised text and Braille) at a consistent location beside the door to identify the toilet. Inside, if the grab rails, seat, and flush are the same colour as the walls, a person with low vision cannot locate them. An emergency pull cord or button is a safety requirement: falls in toilets are common, and someone on the floor may not be able to reach a standard call button.',
    statistic: {
      value: '453,000',
      context: 'Australians are blind or have low vision. Contrast and tactile signage are essential for their independence.',
      source: 'Vision Australia'
    }
  },

  tips: [
    {
      icon: 'Fingerprint',
      text: 'Tactile signs with raised text and Braille beside every toilet door, on the latch side.',
      detail: 'Mount at 1200-1600mm height, on the wall beside the door handle (not on the door itself, as the door may be open).',
      priority: 1
    },
    {
      icon: 'Contrast',
      text: 'Grab rails, seat, and flush must visually contrast with surrounding surfaces.',
      detail: 'A white grab rail on a white wall is invisible to someone with low vision. Use a minimum 30% luminance contrast ratio between the fitting and its background.',
      priority: 2
    },
    {
      icon: 'Bell',
      text: 'Emergency alarm cord must reach the floor so it can be activated by someone who has fallen.',
      detail: 'The cord should be clearly distinguishable (typically red with a red triangular pull) and connected to an alarm or staff notification system.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Door frame should contrast with the surrounding wall.',
      detail: 'This helps people with low vision locate the entrance. A dark frame on a light wall, or vice versa.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Checking signage, contrast, and emergency features',
    steps: [
      { text: 'Check the toilet door: is there a tactile sign with raised text and Braille on the wall beside the latch side?' },
      {
        text: 'Check the sign mounting height.',
        measurement: { target: 'Tactile sign height', acceptable: '1200-1600mm above floor', unit: 'mm' }
      },
      { text: 'Look at grab rails, toilet seat, and flush button: do they contrast with the wall and pan? Squint to simulate low vision. If they disappear, contrast is inadequate.' },
      { text: 'Check for an emergency alarm cord or button. Does the cord reach within 100mm of the floor?' },
      { text: 'Test the alarm: does it produce an audible and/or visual alert in a staffed area?' },
      { text: 'Check the door frame: does it contrast with the surrounding wall colour?' }
    ],
    tools: ['Camera for documentation'],
    estimatedTime: '10 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 8 and 15',
      requirement: 'Tactile and Braille signage is required at sanitary facilities. An emergency call system must be provided in accessible toilets. Luminance contrast is required between key surfaces.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies requirements for tactile ground surface indicators, relevant to toilet approaches in some settings.' }
    ],
    plainEnglish: 'Toilet doors need tactile signs people can feel. Fittings need to be a different colour from the walls. There must be an emergency alarm someone can reach from the floor.',
    complianceNote: 'Emergency alarm cords are frequently found tied up out of reach (to prevent accidental activation). This defeats their purpose. Train cleaners to leave the cord hanging to the floor.'
  },

  solutions: [
    {
      title: 'Install tactile and Braille signage',
      description: 'Add compliant tactile signs beside each toilet door with raised text, Braille, and the appropriate pictogram.',
      resourceLevel: 'low',
      costRange: '$40-80 per sign',
      timeRequired: '30 minutes per door',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Order tactile toilet signs from a signage supplier (search "AS 1428.1 tactile toilet sign"). Ensure they include raised text, Grade 2 Braille, and the ISA or toilet pictogram.',
        'Install each sign on the wall beside the door on the latch side, at 1200-1600mm height.',
        'Do not mount on the door itself (it may be open when someone reaches for the sign).',
        'Include signs for male, female, accessible, and ambulant toilets as applicable.'
      ]
    },
    {
      title: 'Improve visual contrast on fittings',
      description: 'Replace or add contrast to grab rails, toilet seat, flush, and door furniture so they are visible to people with low vision.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Photograph the toilet interior and review: which fittings blend into the background?',
        'Replace white grab rails on white walls with a contrasting colour (dark grey, blue, or red are common).',
        'If the toilet seat matches the pan and wall colour, replace it with a contrasting seat (dark seat on white pan, or vice versa).',
        'Ensure the flush button contrasts with the cistern or wall behind it.',
        'Check that the emergency cord is red and visible against the wall.'
      ]
    },
    {
      title: 'Install or reposition the emergency alarm cord',
      description: 'Ensure the accessible toilet has a working emergency alarm cord that reaches within 100mm of the floor.',
      resourceLevel: 'low',
      costRange: '$100-400',
      timeRequired: '1-2 hours',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Check if an alarm already exists but has been tied up. If so, untie it and extend the cord to floor level.',
        'If no alarm exists, install a pull-cord alarm connected to a buzzer or light in a staffed area.',
        'The cord should have a red triangular pull handle.',
        'Test the alarm to confirm it is audible or visible where staff will notice it.',
        'Add a note to your cleaning checklist: "Confirm emergency cord is hanging freely, not tied up."'
      ]
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A gallery had a minimalist accessible toilet where everything was white: walls, grab rails, seat, and flush.',
      solution: 'Replaced the toilet seat with a dark grey one, swapped white grab rails for charcoal, and added a red emergency pull cord. Total material cost under $200.',
      outcome: 'Visitors with low vision could identify all fixtures immediately. Staff reported fewer questions about locating the flush.',
      cost: '$200'
    }
  ],

  resources: [
    {
      title: 'Vision Australia - Contrast Guide',
      url: 'https://www.visionaustralia.org/',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Guidance on luminance contrast for buildings and signage.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.5-D-1',
      questionText: 'Do signs include tactile and Braille elements?',
      relationship: 'Toilet signage follows the same tactile standards as general wayfinding',
      moduleCode: '3.5'
    }
  ],

  keywords: ['tactile signage', 'Braille', 'contrast', 'emergency alarm', 'pull cord', 'low vision'],
},

// ─── Entry 5: Ambulant Accessible Toilet ───
{
  questionId: '3.2-D-3',
  questionText: 'Do you have an ambulant accessible toilet?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Ambulant Accessible Toilets',
  summary: 'An ambulant accessible toilet serves people who can walk but need support: those with mobility aids, reduced balance, joint conditions, or who are recovering from surgery. It is a standard-sized cubicle with grab rails and a wider door, not a full wheelchair-accessible toilet.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Not everyone who needs toilet support uses a wheelchair. People with walking frames, crutches, prosthetic limbs, chronic pain, or balance disorders need a toilet with grab rails and a wider door, but do not need the full-sized wheelchair-accessible room. An ambulant toilet fills this gap and reduces pressure on the single accessible toilet, which is often the only option. When only one accessible toilet exists and is occupied, people with less visible mobility needs have no alternative.',
    statistic: {
      value: '2.1 million',
      context: 'Australians use mobility aids other than wheelchairs, including walking sticks, frames, and crutches.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'Door must open outward with a minimum clear width of 850mm.',
      detail: 'This allows someone with a walking frame to enter without having to manoeuvre around an inward-swinging door.',
      priority: 1
    },
    {
      icon: 'Grip',
      text: 'Grab rails on both sides: one fixed horizontal rail, one vertical rail near the door.',
      detail: 'The horizontal rail helps with sitting and standing. The vertical rail near the door helps with balance when entering and locking.',
      priority: 2
    },
    {
      icon: 'Maximize',
      text: 'Wider than a standard cubicle, but not full wheelchair size.',
      detail: 'Typically 900-1000mm wide (versus 800mm standard). Enough room to use a walking frame beside the toilet.',
      priority: 3
    },
    {
      icon: 'Signpost',
      text: 'Sign it with the ambulant accessible symbol (person with cane).',
      detail: 'This distinguishes it from the wheelchair-accessible toilet and signals that it is for people with mobility needs.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Checking your ambulant toilet',
    steps: [
      {
        text: 'Measure the cubicle width.',
        measurement: { target: 'Cubicle width', acceptable: 'Minimum 900mm', unit: 'mm' }
      },
      {
        text: 'Measure the door clear opening.',
        measurement: { target: 'Door clear opening', acceptable: 'Minimum 850mm', unit: 'mm' }
      },
      { text: 'Check the door swings outward (not inward).' },
      { text: 'Check for a horizontal grab rail beside the toilet at 800-810mm height.' },
      { text: 'Check for a vertical grab rail near the door at approximately 900-1200mm height.' },
      { text: 'Confirm the toilet is signed with the ambulant accessible symbol.' }
    ],
    tools: ['Tape measure'],
    estimatedTime: '5 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15.4',
      requirement: 'Ambulant accessible toilet cubicles must be provided in addition to accessible unisex toilets where toilet facilities include multiple cubicles. They require outward-opening doors, grab rails, and wider dimensions.'
    },
    plainEnglish: 'If you have a bank of toilet cubicles, at least one should be an ambulant toilet with grab rails and a wider door for people who walk with aids.',
    complianceNote: 'An ambulant toilet does not replace the need for a full wheelchair-accessible toilet. They serve different users.'
  },

  solutions: [
    {
      title: 'Convert one existing cubicle to ambulant accessible',
      description: 'Modify a standard cubicle by widening it slightly, reversing the door swing, and adding grab rails.',
      resourceLevel: 'medium',
      costRange: '$500-2,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify the most suitable cubicle (end cubicle is usually easiest to widen).',
        'If possible, widen to 900-1000mm by adjusting the partition.',
        'Reverse the door swing to open outward (or install a sliding door).',
        'Install a horizontal grab rail beside the toilet at 800-810mm.',
        'Install a vertical grab rail near the door.',
        'Install ambulant accessible signage on the door.'
      ]
    },
    {
      title: 'Add grab rails to an existing wider cubicle',
      description: 'If you already have an end cubicle that is wider than standard, adding grab rails and appropriate signage may be all that is needed.',
      resourceLevel: 'low',
      costRange: '$200-500',
      timeRequired: '2-3 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Measure the cubicle: if it is already 900mm+ wide, it may qualify with grab rails added.',
        'Install a horizontal grab rail at 800-810mm on the wall beside the toilet.',
        'Install a vertical grab rail near the door entry.',
        'Reverse the door swing if it currently opens inward.',
        'Add an ambulant accessible sign to the door.'
      ]
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference centre',
      scenario: 'A conference centre had one wheelchair-accessible toilet but nothing for ambulant visitors. During events, the accessible toilet was often occupied by people who needed grab rails but not a full-sized room.',
      solution: 'Converted the end cubicle in each restroom to ambulant accessible: widened partition by 100mm, reversed door, added two grab rails, installed signage.',
      outcome: 'Reduced queuing at the wheelchair-accessible toilet. Attendees with walking aids had a dedicated option.',
      cost: '$800 per cubicle'
    }
  ],

  resources: [
    {
      title: 'Ambulant Toilet Requirements',
      url: 'https://www.access.asn.au/standards',
      type: 'guide',
      source: 'Association of Consultants in Access Australia',
      description: 'Summary of ambulant accessible toilet specifications.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.2-1-1',
      questionText: 'Do you have at least one accessible toilet?',
      relationship: 'Ambulant toilets complement full accessible toilets, not replace them',
      moduleCode: '3.2'
    }
  ],

  keywords: ['ambulant', 'walking frame', 'crutches', 'grab rails', 'mobility aid', 'cubicle'],
},

// ─── Entry 6: Baby Change and Adult Change Facilities ───
{
  questionId: '3.2-D-2',
  questionText: 'Are baby change facilities accessible?',
  moduleCode: '3.2',
  moduleGroup: 'during-visit',
  diapCategory: 'physical-access',
  title: 'Baby Change and Adult Change Facilities',
  coveredQuestionIds: ['3.2-D-7'],
  summary: 'Accessible baby change tables allow parents with disability to change their child safely. Adult change facilities (sometimes called Changing Places) provide a height-adjustable change table and hoist for adults and older children who cannot use a standard toilet. Both are critical for inclusion.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'A parent in a wheelchair cannot safely use a wall-mounted baby change table that is too high or in a cubicle too narrow for their chair. And for the estimated 250,000 Australians who need full body-lifting assistance to use the toilet or change, a standard accessible toilet is not enough. They need a height-adjustable adult-sized change table, a ceiling hoist, and adequate space. Without these facilities, they cannot leave home for more than a few hours.',
    quote: {
      text: 'Without a Changing Places toilet, my daughter simply cannot go anywhere for more than two hours. It limits our entire family\'s life.',
      attribution: 'Parent of adult with disability, Changing Places Australia'
    }
  },

  tips: [
    {
      icon: 'Baby',
      text: 'Baby change tables should be inside or adjacent to the accessible toilet.',
      detail: 'This allows a parent with disability to change their child in a room they can actually access. Placing the change table only in the standard toilet excludes them.',
      priority: 1
    },
    {
      icon: 'ArrowDown',
      text: 'Baby change table height should be usable from a seated position when lowered.',
      detail: 'Fold-down tables at a fixed height of 900mm are too high for many wheelchair users. Wall-mounted tables with a lower range (750mm) or a separate lower surface are preferable.',
      priority: 2
    },
    {
      icon: 'Maximize',
      text: 'Adult change: a height-adjustable table (peninsula or wall-mounted) at least 1800mm x 750mm.',
      detail: 'The table must lower to wheelchair transfer height (~500mm) and raise to standing carer height (~900mm).',
      priority: 3
    },
    {
      icon: 'ArrowUpFromLine',
      text: 'Adult change: a ceiling-mounted hoist covering the route from wheelchair to table to toilet.',
      detail: 'The hoist track should allow the carer to lift the person from wheelchair, position over the table or toilet, and lower. This requires a tracked or gantry system, not a portable floor hoist.',
      priority: 4
    },
    {
      icon: 'Accessibility',
      text: 'Adult change rooms need at least 3m x 4m of clear floor space.',
      detail: 'This allows the wheelchair, carer, hoist, and table to all fit without collision. The space must include an accessible toilet within the same room.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Checking change facilities',
    steps: [
      { text: 'Check if a baby change table exists within or beside the accessible toilet (not only in standard cubicles).' },
      {
        text: 'Measure the baby change table height when folded down.',
        measurement: { target: 'Baby change table height', acceptable: '750-900mm (lower is better for seated users)', unit: 'mm' }
      },
      { text: 'If you have an adult change facility, check the table adjusts from ~500mm to ~900mm.' },
      { text: 'Check the ceiling hoist track covers the path from entry to table to toilet.' },
      {
        text: 'Measure adult change room floor space.',
        measurement: { target: 'Room dimensions', acceptable: 'Minimum 3m x 4m clear', unit: 'm' }
      },
      { text: 'Search changingplaces.org.au to check if your facility (or the nearest one) is registered.' }
    ],
    tools: ['Tape measure'],
    estimatedTime: '10-15 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'Where baby change facilities are provided, at least one must be accessible. Adult change facilities are not yet mandated by the standard but are increasingly required by local planning policies and strongly recommended.'
    },
    related: [
      { code: 'NCC', relevance: 'NCC 2022 introduced requirements for adult change facilities in certain building classes, including large shopping centres, airports, and entertainment venues.' }
    ],
    plainEnglish: 'If you provide baby change, make sure at least one is in a space a wheelchair user can access. For adult change, large venues should provide a Changing Places facility with a hoist and adjustable table.',
    complianceNote: 'Adult change facilities (Changing Places) are mandated by the NCC for Class 6 and 9b buildings over certain thresholds. Even if not required for your building, they dramatically expand who can visit.'
  },

  solutions: [
    {
      title: 'Relocate baby change table into the accessible toilet',
      description: 'Move or add a fold-down baby change table inside the accessible toilet so parents with disability can access it.',
      resourceLevel: 'low',
      costRange: '$200-500',
      timeRequired: '1-2 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Check the accessible toilet has sufficient wall space for a fold-down table (when folded up, it should not obstruct grab rails or transfer space).',
        'Purchase a wall-mounted fold-down baby change table.',
        'Install on a wall that does not interfere with wheelchair circulation.',
        'Ensure the table, when folded down, does not block the door or transfer space.',
        'Add signage indicating baby change is available in the accessible toilet.'
      ]
    },
    {
      title: 'Install a Changing Places facility',
      description: 'Provide a full adult change room with height-adjustable table, ceiling hoist, accessible toilet, and adequate space. This is a significant investment but transforms access for people with high support needs.',
      resourceLevel: 'high',
      costRange: '$50,000-120,000',
      timeRequired: '3-6 months (planning, approval, construction)',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Review the Changing Places Design Specifications at changingplaces.org.au.',
        'Identify a suitable location: ground floor, close to main areas, with adequate plumbing and structural capacity for a ceiling hoist.',
        'Engage an access consultant and architect experienced in Changing Places design.',
        'Include: height-adjustable adult change table, ceiling hoist with full room coverage, accessible toilet, washbasin, and privacy screen.',
        'Apply for any available government grants (many states offer Changing Places grants).',
        'After completion, register on the Changing Places Australia map.'
      ],
      notes: 'Government grants of $50,000-100,000 are available in most states. Check your state disability or infrastructure department.'
    }
  ],

  examples: [
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping centre',
      scenario: 'A shopping centre had baby change tables only in the parents\' room, which had a step at the entrance.',
      solution: 'Installed a fold-down baby change table inside the accessible toilet on each level. Cost $350 per table.',
      outcome: 'Parents using wheelchairs could change their babies independently for the first time at this centre.',
      cost: '$350 per table'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme park',
      scenario: 'A theme park received repeated requests for adult change facilities from families with older children with disability.',
      solution: 'Built a Changing Places facility near the main entrance. Applied for and received a $80,000 state government grant covering most of the cost. Registered on the national map.',
      outcome: 'Families who previously could only visit for 1-2 hours now spend full days. The facility is used 15-20 times per week.',
      cost: '$95,000 (after $80,000 grant: $15,000 net)'
    }
  ],

  resources: [
    {
      title: 'Changing Places Australia',
      url: 'https://changingplaces.org.au/',
      type: 'website',
      source: 'Changing Places Australia',
      description: 'Design specifications, facility map, and grant information for adult change facilities.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'NCC 2022 Adult Change Facility Requirements',
      url: 'https://ncc.abcb.gov.au/',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'National Construction Code requirements for adult change facilities.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.2-1-1',
      questionText: 'Do you have at least one accessible toilet?',
      relationship: 'Change facilities should be located within or adjacent to accessible toilets',
      moduleCode: '3.2'
    }
  ],

  keywords: ['baby change', 'adult change', 'Changing Places', 'hoist', 'change table', 'nappy'],
},

];

export default toiletsAmenitiesHelp;
