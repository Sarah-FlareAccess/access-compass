/**
 * Help Content: Getting In (Consolidated)
 * Modules: 2.1, 2.2, 2.3, 2.4
 * 20 entries covering all 87 question IDs
 */

import type { HelpContent } from './types';

export const gettingInHelp: HelpContent[] = [

// ─── Entry 1: Accessible Parking Spaces ───
{
  questionId: '2.1-F-1',
  questionText: 'Is there accessible parking available for customers?',
  moduleCode: '2.1',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Accessible Parking Spaces',
  coveredQuestionIds: ['2.1-F-2', '2.1-F-3', '2.1-D-9', '2.1-D-13'],
  summary: 'Accessible parking spaces must be wider than standard spaces, located close to the accessible entrance, properly marked with the International Symbol of Access, and include drop-off zones for passengers who cannot use a parked vehicle.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'For many people with disability, accessible parking is not a convenience. It is essential. The extra width allows space to deploy a wheelchair ramp or transfer from the car to a mobility device. Proximity to the entrance reduces fatigue, pain, and exposure to weather and traffic hazards. Drop-off zones serve those who travel as passengers and need to alight close to the door. During events or peak periods, access must be maintained so that temporary signage, barriers, or overflow parking do not block accessible spaces.',
    statistic: {
      value: '4.4 million',
      context: 'Australians have a disability. Many rely on accessible parking to participate in community life.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'Maximize',
      text: 'Spaces must be wider: 2400mm with a 2400mm shared zone, or 3200mm for a single space.',
      detail: 'The shared zone sits between two accessible spaces so both users can deploy ramps or open doors fully. A single 3200mm space works where only one accessible space is provided. Measure from wall or line centre to line centre.',
      priority: 1
    },
    {
      icon: 'MapPin',
      text: 'Locate spaces within 30m of the accessible entrance.',
      detail: 'Measure from the space boundary to the entrance door, not to the general building. If the car park is multi-level, the accessible spaces should be on the same level as the entrance or connected by an accessible lift.',
      priority: 2
    },
    {
      icon: 'Signpost',
      text: 'Display the ISA on a bollard sign at 1200mm height and paint ground markings.',
      detail: 'A bollard-mounted sign is visible even when the space is occupied. Ground markings alone are not sufficient because they are hidden by parked vehicles. The ISA symbol should be at least 150mm in size.',
      priority: 3
    },
    {
      icon: 'Shield',
      text: 'Protect spaces from misuse with bollards, wheel stops, or regular monitoring.',
      detail: 'Misuse of accessible spaces is widespread. Physical deterrents such as bollards or raised kerbs prevent encroachment. If physical measures are not feasible, regular staff monitoring during peak periods helps.',
      priority: 4
    },
    {
      icon: 'ArrowRight',
      text: 'Provide a drop-off zone near the entrance for passengers who cannot park.',
      detail: 'A drop-off zone should be at least 3200mm wide and connected to the entrance by a step-free path. It does not need to be a parking space, just a safe area to stop, deploy equipment, and move to the entrance.',
      priority: 5
    },
    {
      icon: 'CheckCircle',
      text: 'Maintain access during events, construction, and peak periods.',
      detail: 'Temporary signage, overflow parking cones, food trucks, or construction barriers must never block accessible spaces or the path from them. Include accessible parking in your event planning checklist.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing your accessible parking',
    steps: [
      {
        text: 'Measure each accessible space width and shared zone.',
        measurement: { target: 'Space width', acceptable: 'Minimum 2400mm with 2400mm shared zone, or 3200mm single', unit: 'mm' }
      },
      {
        text: 'Measure the distance from the closest accessible space to the accessible entrance door.',
        measurement: { target: 'Distance to entrance', acceptable: 'Maximum 30m', unit: 'm' }
      },
      { text: 'Check signage: Is the ISA visible on a bollard sign at 1200mm height? Are ground markings clear and not faded?' },
      { text: 'Walk the path from the space to the entrance. Is it step-free, smooth, well-lit, and free of obstacles?' },
      { text: 'Check for a drop-off zone near the entrance with a step-free connection to the door.' },
      { text: 'Visit during an event or peak period and confirm accessible spaces are still available and unobstructed.' },
      { text: 'Check whether bins, deliveries, or temporary structures ever block accessible spaces or the path to the entrance.' }
    ],
    tools: ['Tape measure (at least 5m)', 'Camera for documentation', 'Lux meter or smartphone app'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 6',
      requirement: 'Accessible car parking spaces must be provided in accordance with AS/NZS 2890.6, with an accessible path of travel to the building entrance.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible parking where car parking is provided, with ratios based on total spaces (e.g. 1 accessible space for every 50 total spaces).' },
      { code: 'DDA', relevance: 'Prohibits discrimination in access to premises. Even older buildings not covered by building codes may be required to provide accessible parking under the DDA.' }
    ],
    plainEnglish: 'If you provide parking, you must provide accessible parking spaces that are wider, closer to the entrance, and properly signed. The number depends on total capacity.',
    complianceNote: 'Even if your building predates current standards, providing accessible parking is good practice and may be required under the DDA as a reasonable adjustment.'
  },

  solutions: [
    {
      title: 'Relocate existing spaces closer to the entrance',
      description: 'Move the designated accessible spaces to the positions nearest the accessible entrance. Repaint markings, install bollard signs, and improve lighting in the new location.',
      resourceLevel: 'low',
      costRange: '$300-800',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify the spaces closest to the accessible entrance that are not already designated accessible.',
        'Measure the candidate spaces to confirm they meet width requirements (2400mm + 2400mm shared zone or 3200mm single).',
        'Engage a line-marking contractor to repaint the old spaces as standard and mark the new spaces with ISA ground symbols.',
        'Install bollard-mounted ISA signs at 1200mm height at each new accessible space.',
        'Check the path from the new spaces to the entrance for any obstacles, uneven surfaces, or steps.',
        'Update any wayfinding signage in the car park to direct drivers to the new locations.',
        'Improve lighting if the new area is dimmer than the previous location (minimum 40 lux).',
        'Notify regular customers of the change via signage and your website.'
      ],
      notes: 'If your car park is managed by a body corporate or council, you may need approval before relocating spaces.'
    },
    {
      title: 'Create a new accessible space and drop-off zone',
      description: 'Where no accessible parking exists, convert standard spaces into compliant accessible spaces and add a passenger drop-off zone near the entrance.',
      resourceLevel: 'medium',
      costRange: '$1,500-4,000',
      timeRequired: '2-5 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Survey the car park to identify the best location: close to the entrance, level surface, good lighting, step-free path.',
        'Calculate the required number of accessible spaces based on total car park capacity (AS/NZS 2890.6 Table 1).',
        'Engage a contractor to widen spaces (removing one standard space to create the shared zone), install kerb ramps if needed, and apply line markings.',
        'Install bollard signs with the ISA at 1200mm height.',
        'Designate a drop-off zone at least 3200mm wide adjacent to the entrance, with a painted border and signage reading "Accessible Drop-Off Only".',
        'Connect the drop-off zone to the entrance with a step-free path at least 1000mm wide.',
        'Add lighting to the new spaces and drop-off zone if below 40 lux.',
        'Update your website and Google Maps listing with the new parking information.'
      ],
      notes: 'Council approval may be needed if you are modifying on-street parking or public car park spaces.'
    },
    {
      title: 'Install comprehensive parking management system',
      description: 'For larger venues, implement a full accessible parking management system with sensors, real-time availability displays, and enforcement.',
      resourceLevel: 'high',
      costRange: '$5,000-15,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a parking management consultant to audit your entire car park against AS/NZS 2890.6.',
        'Install in-ground sensors or overhead cameras to monitor accessible space occupancy.',
        'Connect sensors to a display at the car park entrance showing real-time accessible space availability.',
        'Install retractable bollards or boom gates on accessible spaces that require an ACROD permit to lower.',
        'Add CCTV coverage of accessible spaces to deter misuse.',
        'Create a monitoring protocol for staff to check accessible spaces during peak periods and events.',
        'Publish real-time availability on your website or app for pre-visit planning.',
        'Review the system quarterly and adjust based on usage data.'
      ],
      notes: 'Sensor systems can also provide data on usage patterns to help you plan for peak demand.'
    }
  ],

  examples: [
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre had accessible parking spaces located 50m from the nearest entrance, past a row of trolley bays and a speed bump.',
      solution: 'Relocated accessible spaces to the row directly outside the main entrance, removed the speed bump on the accessible path, and installed bollard signs and fresh markings.',
      outcome: 'Customer complaints about parking dropped to zero. Accessibility audit score improved from 3/10 to 9/10 for parking.',
      cost: '$2,400',
      timeframe: '3 days'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant with street parking had no accessible spaces. Wheelchair users had to park in the public car park 80m away and cross an intersection.',
      solution: 'Worked with the local council to designate one on-street space as accessible directly outside the entrance and added a short drop-off zone with a painted kerb.',
      outcome: 'Regular wheelchair-using customers reported the change made them feel welcomed. The council approved the space within 6 weeks at no cost to the restaurant.',
      cost: '$200 (signage only)',
      timeframe: '6 weeks for council approval'
    }
  ],

  resources: [
    {
      title: 'AS/NZS 2890.6 Off-street Parking for People with Disabilities',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as-slash-nzs--2890-dot-6-colon-2009',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary Australian standard for accessible parking design, dimensions, signage, and ratios.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Premises Standards Advisory Notes: Parking',
      url: 'https://www.ag.gov.au/rights-and-protections/human-rights-and-anti-discrimination/disability-standards/disability-access-premises-buildings',
      type: 'guide',
      source: 'Attorney-General\'s Department',
      description: 'Government advisory notes on applying the Premises Standards to car parking, including worked examples.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AHRC Accessible Parking Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guidance on accessible parking obligations under the DDA, including complaint case studies.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.1-F-4', questionText: 'Is the path from accessible parking to the entrance smooth and level?', relationship: 'The path from parking to entrance is the critical link between the space and the building.', moduleCode: '2.1' },
    { questionId: '2.1-F-6', questionText: 'Is there directional signage on the road approach directing visitors to accessible parking?', relationship: 'Wayfinding signage helps drivers find accessible spaces before entering the car park.', moduleCode: '2.1' },
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'Accessible parking is only useful if it connects to an accessible entrance.', moduleCode: '2.2' }
  ],

  keywords: ['parking', 'car park', 'accessible parking', 'ACROD', 'drop-off', 'markings', 'ISA symbol', 'event parking', 'proximity', 'space width', 'shared zone', 'bollard sign']
},

// ─── Entry 2: Path from Parking to Entrance ───
{
  questionId: '2.1-F-4',
  questionText: 'Is the path from accessible parking to the entrance smooth and level?',
  moduleCode: '2.1',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Path from Parking to Entrance',
  coveredQuestionIds: ['2.1-F-5', '2.1-F-8', '2.1-D-10', '2.1-D-11', '2.1-D-16', '2.1-D-20'],
  summary: 'The path connecting parking to the entrance must be smooth, level, wide enough for mobility aids, well-lit, with rest points on longer routes and tactile indicators for people with vision impairment.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Surface quality determines whether someone can safely travel from their car to your door. Every bump, crack, loose gravel section, or unexpected step is a potential barrier or fall risk. For wheelchair users, an uneven surface requires significantly more effort and can cause pain. For people with vision impairment, an unpredictable surface without tactile cues is disorienting and dangerous. Adequate lighting, rest points, and weather protection make the difference between a comfortable approach and an exhausting ordeal.',
    statistic: {
      value: '30%',
      context: 'of falls in public places occur on paths and walkways, with uneven surfaces being the most common cause.',
      source: 'Safe Work Australia'
    }
  },

  tips: [
    {
      icon: 'Layers',
      text: 'Use firm, slip-resistant surfaces such as concrete or sealed asphalt.',
      detail: 'Loose gravel, cobblestones, and uneven pavers are barriers for wheelchair users and trip hazards for everyone. If you cannot replace the surface, consider a sealed strip at least 1200mm wide along the main route.',
      priority: 1
    },
    {
      icon: 'Maximize',
      text: 'Maintain minimum 1000mm width (1200mm preferred) along the entire path.',
      detail: 'A standard wheelchair is 650-700mm wide, but users need clearance on both sides. At 1000mm, one wheelchair can pass. At 1200mm, a wheelchair and ambulant person can pass comfortably.',
      priority: 2
    },
    {
      icon: 'Gauge',
      text: 'Keep cross-fall (side slope) to a maximum of 1:40.',
      detail: 'A cross-fall steeper than 1:40 causes wheelchairs to veer sideways and is tiring to correct. Use a spirit level or inclinometer to check.',
      priority: 3
    },
    {
      icon: 'Sun',
      text: 'Provide minimum 40 lux lighting along the entire path.',
      detail: 'Good lighting helps everyone see obstacles, read signs, and feel safe. Solar bollard lights are an affordable option for paths without mains power.',
      priority: 4
    },
    {
      icon: 'Square',
      text: 'Install rest seating every 20m on longer paths.',
      detail: 'For people with fatigue conditions, chronic pain, or respiratory conditions, a 30m walk without a rest option may be impossible. Seats should have armrests and backrests to assist standing up.',
      priority: 5
    },
    {
      icon: 'Footprints',
      text: 'Install TGSIs (tactile ground surface indicators) from parking to entrance for vision impairment.',
      detail: 'Directional TGSIs guide people with vision impairment along the correct path. Warning TGSIs alert to hazards such as steps, ramps, or road crossings. Follow AS1428.4.1 for layout and dimensions.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing the path from parking to entrance',
    steps: [
      { text: 'Walk the full path from the accessible parking space to the accessible entrance, noting any cracks, lips, loose material, or level changes.' },
      {
        text: 'Measure the path width at the narrowest point.',
        measurement: { target: 'Path width', acceptable: 'Minimum 1000mm (1200mm preferred)', unit: 'mm' }
      },
      {
        text: 'Check the cross-fall using a spirit level or inclinometer.',
        measurement: { target: 'Cross-fall', acceptable: 'Maximum 1:40 (2.5%)', unit: 'ratio' }
      },
      {
        text: 'Measure lighting levels along the path at ground level.',
        measurement: { target: 'Lighting', acceptable: 'Minimum 40 lux', unit: 'lux' }
      },
      { text: 'Check for rest seating if the path is longer than 20m. Confirm seats have armrests and backrests.' },
      { text: 'Check for TGSIs along the path. Are directional indicators present? Are warning indicators at hazards?' },
      { text: 'Test the path in wet conditions or after rain. Check for pooling water, slippery patches, or mud.' },
      { text: 'Check whether the path is ever obstructed by bins, vehicles, sandwich boards, or outdoor furniture.' }
    ],
    tools: ['Tape measure (at least 5m)', 'Spirit level or inclinometer', 'Lux meter or smartphone app', 'Camera'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 7',
      requirement: 'Continuous accessible paths of travel must have firm, slip-resistant surfaces, minimum 1000mm width, maximum 1:40 cross-fall, and be free of obstacles.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies requirements for tactile ground surface indicators (TGSIs) including size, layout, luminance contrast, and placement at hazards.' },
      { code: 'Access-to-Premises', relevance: 'Requires an accessible path of travel from the site boundary, including car parking, to the building entrance.' }
    ],
    plainEnglish: 'The path from parking to your entrance must be smooth, wide enough for a wheelchair, gently sloped, well-lit, and have tactile indicators for people with vision impairment.',
    complianceNote: 'Path of travel requirements apply to new buildings and where existing buildings undergo significant renovation. However, maintaining a safe path is a general duty of care regardless of building age.'
  },

  solutions: [
    {
      title: 'Patch, repair, and light the existing path',
      description: 'Fix surface defects, remove trip hazards, and add lighting to make the current path safe and usable.',
      resourceLevel: 'low',
      costRange: '$200-1,500',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'quick-win',
      steps: [
        'Walk the path and mark every defect: cracks wider than 5mm, lips higher than 5mm, loose material, pooling areas.',
        'Fill cracks and level lips with concrete patching compound or asphalt filler.',
        'Remove or secure any loose gravel, pavers, or matting.',
        'Install solar bollard lights or LED path lights every 3-5m where lighting is below 40 lux.',
        'Trim vegetation that encroaches on the path width.',
        'Add a non-slip coating to any section that is slippery when wet.',
        'Schedule monthly inspections to catch new defects early.'
      ],
      notes: 'Patching is a short-term solution. If the surface is extensively damaged, full resurfacing will be more cost-effective long term.'
    },
    {
      title: 'Install lighting, rest points, and TGSIs',
      description: 'Add the supporting infrastructure that makes a structurally sound path fully accessible: adequate lighting, rest seating, and tactile indicators.',
      resourceLevel: 'medium',
      costRange: '$500-3,000',
      timeRequired: '2-5 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Audit current lighting levels using a lux meter at ground level every 5m along the path.',
        'Install additional lighting where levels fall below 40 lux. Solar bollard lights are suitable for most outdoor paths.',
        'Source and install rest seating with armrests and backrests at 20m intervals along paths longer than 30m.',
        'Engage a TGSI contractor to install directional (elongated) indicators along the path and warning (dot) indicators at hazards.',
        'Ensure TGSI colour contrasts with the surrounding surface (minimum 30% luminance contrast).',
        'Test all new installations in day and night conditions.'
      ],
      notes: 'TGSIs must comply with AS1428.4.1 for size, spacing, and luminance contrast. Incorrect TGSIs can be worse than none.'
    },
    {
      title: 'Resurface with fully compliant material',
      description: 'Replace the entire path surface with compliant concrete or sealed asphalt, incorporating correct width, cross-fall, drainage, lighting, and TGSIs from the design stage.',
      resourceLevel: 'high',
      costRange: '$5,000-25,000',
      timeRequired: '1-3 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Engage a civil engineer or access consultant to design the new path to AS1428.1 specifications.',
        'Specify minimum 1200mm width, maximum 1:40 cross-fall, P4 slip rating for exposed areas, and integrated drainage.',
        'Include TGSI installation in the design (directional along the path, warning at hazards and crossings).',
        'Include rest bays with seating at 20m intervals on paths longer than 30m.',
        'Integrate lighting (minimum 40 lux) into the path design using in-ground or bollard fixtures.',
        'Engage a licensed contractor to demolish the old surface and construct the new path.',
        'Provide a temporary accessible route during construction (signed, lit, and step-free).',
        'Commission the new path with a final audit against AS1428.1 before opening.'
      ],
      notes: 'Full resurfacing is the most expensive option but provides the longest-lasting and most compliant result. It may be eligible for government accessibility grants.'
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Motel',
      scenario: 'A motel\'s path from the car park to reception was damaged by tree roots, creating lips up to 30mm high and cracked pavers that pooled water in rain.',
      solution: 'Removed the damaged section, ground down tree roots (with arborist advice), and laid a new concrete path 1200mm wide with integrated LED strip lighting and a TGSI trail.',
      outcome: 'Guest complaints about the path dropped from weekly to zero. The motel highlighted the new accessible path on their website.',
      cost: '$4,800',
      timeframe: '5 days'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A cafe had a 15m gravel path from the street to the entrance. Wheelchair users could not traverse it, and it became muddy in rain.',
      solution: 'Laid a 1200mm-wide concrete path over the gravel with a gentle cross-fall for drainage and two solar bollard lights.',
      outcome: 'The cafe gained several regular wheelchair-using customers who had previously been unable to visit.',
      cost: '$2,200',
      timeframe: '2 days'
    }
  ],

  resources: [
    {
      title: 'AS1428.1: Design for Access and Mobility',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary standard for accessible paths of travel, including surface, width, gradient, and cross-fall requirements.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Accessible Path of Travel Fact Sheet',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Plain-English guide to accessible path requirements under the Premises Standards.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Slip Resistance Classification Guide (AS4586)',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/bd-091/as--4586-colon-2013',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Classification of new pedestrian surface materials for slip resistance, including P ratings for ramps and wet areas.',
      isAustralian: true,
      isFree: false
    }
  ],

  relatedQuestions: [
    { questionId: '2.1-F-1', questionText: 'Is there accessible parking available for customers?', relationship: 'The path starts at the accessible parking space.', moduleCode: '2.1' },
    { questionId: '2.1-F-6', questionText: 'Is there directional signage on the road approach directing visitors to accessible parking?', relationship: 'Signage along the path helps visitors confirm they are on the correct route.', moduleCode: '2.1' },
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'The path must connect seamlessly to the accessible entrance.', moduleCode: '2.2' }
  ],

  keywords: ['path', 'surface', 'lighting', 'rest points', 'TGSIs', 'width', 'cross-fall', 'weather protection', 'slip resistant', 'gravel', 'concrete', 'bollard lights']
},

// ─── Entry 3: External Wayfinding and Signage ───
{
  questionId: '2.1-F-6',
  questionText: 'Is there directional signage on the road approach directing visitors to accessible parking?',
  moduleCode: '2.1',
  moduleGroup: 'getting-in',
  diapCategory: 'information-communication-marketing',
  title: 'External Wayfinding and Signage',
  coveredQuestionIds: ['2.1-D-15', '2.1-D-17', '2.1-D-18', '2.1-D-19', '2.1-D-22'],
  summary: 'Comprehensive external wayfinding from road approach to parking to entrance, including online pre-visit arrival information and ongoing signage maintenance.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Searching for accessible parking in an unfamiliar car park is stressful, especially when you are managing a wheelchair, mobility aid, or fatigue. Without clear directional signage, visitors may circle the car park repeatedly, arrive at the wrong entrance, or give up entirely. Pre-visit information on your website lets people plan their route before they leave home, reducing anxiety and wasted time.',
    quote: {
      text: 'I drove around the car park three times looking for the accessible spaces. There were no signs at all. I ended up parking at the far end and it took me ten minutes to get to the door.',
      attribution: 'Wheelchair user, customer feedback survey'
    }
  },

  tips: [
    {
      icon: 'Signpost',
      text: 'Install directional signs at the car park entrance with the ISA symbol.',
      detail: 'The first sign should be visible as drivers enter the car park, showing the direction to accessible spaces. Use a large ISA symbol (minimum 150mm) with an arrow.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Ensure minimum 70% luminance contrast on all signs.',
      detail: 'High contrast means light text on dark background or dark text on light background. Test by photographing in black and white. If you cannot tell the text from the background, contrast is too low.',
      priority: 2
    },
    {
      icon: 'ArrowRight',
      text: 'Place signs at every decision point where a driver must choose a direction.',
      detail: 'Decision points include car park entrances, level changes, intersections, and turns. A driver should never have to guess which way to go.',
      priority: 3
    },
    {
      icon: 'Globe',
      text: 'Publish arrival information on your website including parking location and accessible entrance directions.',
      detail: 'Include a map or photo showing where accessible parking is located relative to the entrance. Mention the number of spaces, whether an ACROD permit is required, and any height clearances for modified vehicles.',
      priority: 4
    },
    {
      icon: 'CheckCircle',
      text: 'Inspect and maintain signs every 6 months.',
      detail: 'Faded, damaged, or obscured signs are as bad as no signs. Check that vegetation has not grown over signs, that they are still securely mounted, and that the information is still accurate.',
      priority: 5
    },
    {
      icon: 'Sun',
      text: 'Ensure signs are readable at night with reflective material or illumination.',
      detail: 'Reflective sign faces or solar-powered illumination ensure signs are visible when drivers arrive after dark.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing external wayfinding',
    steps: [
      { text: 'Drive the approach route to your venue. Count how many decision points exist between the road and the accessible parking spaces.' },
      { text: 'Check whether a directional sign with the ISA symbol exists at each decision point.' },
      {
        text: 'Measure or assess the contrast of each sign.',
        measurement: { target: 'Luminance contrast', acceptable: 'Minimum 70% (light on dark or dark on light)', unit: '%' }
      },
      { text: 'Check your website for arrival and parking information. Can a first-time visitor find your accessible parking from the information provided?' },
      { text: 'Check sign condition: Are any faded, damaged, or obscured by vegetation?' },
      { text: 'Visit at night and check whether signs are readable in headlights or with ambient lighting.' },
      { text: 'Ask a first-time visitor (or delivery driver who does not know the site) to find the accessible parking using only the signage.' }
    ],
    tools: ['Camera', 'Vehicle for drive-through test', 'Smartphone to check website'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 8',
      requirement: 'Signage on accessible paths of travel must include the International Symbol of Access, be located at decision points, and have adequate luminance contrast.'
    },
    related: [
      { code: 'DDA', relevance: 'Requires that information about services and premises be provided in accessible formats, including wayfinding.' },
      { code: 'Access-to-Premises', relevance: 'Requires identification of accessible entrances and paths of travel through signage.' }
    ],
    plainEnglish: 'Signs must guide visitors to accessible parking and the accessible entrance, be high-contrast and easy to read, and appear at every point where someone needs to make a navigation decision.',
    complianceNote: 'Good wayfinding is one of the most cost-effective accessibility improvements. Even if your building is older, adding signs is almost always feasible.'
  },

  solutions: [
    {
      title: 'Install basic directional signage',
      description: 'Add ISA directional signs at key decision points between the road approach and accessible parking spaces.',
      resourceLevel: 'low',
      costRange: '$100-400',
      timeRequired: '1 day',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Map the route from the road entrance to the accessible parking, marking every decision point.',
        'Purchase high-contrast ISA directional signs (available from safety supply stores, typically $20-60 each).',
        'Mount signs at each decision point at a height visible from a vehicle (1500-2000mm for pedestrian, 2400mm+ for vehicle).',
        'Add a final sign at the accessible spaces confirming arrival.',
        'Photograph the installed signs and add arrival directions to your website.',
        'Set a 6-month calendar reminder to inspect signs.'
      ],
      notes: 'Aluminium signs with reflective faces are durable and visible at night without requiring power.'
    },
    {
      title: 'Publish online arrival information',
      description: 'Create a detailed arrival guide on your website with maps, photos, and step-by-step directions to accessible parking and the accessible entrance.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Photograph the approach route, car park entrance, accessible spaces, and path to the entrance.',
        'Write step-by-step directions from the main road to the accessible parking (e.g. "Turn left at the car park entrance, accessible spaces are immediately on your right").',
        'Include the number of accessible spaces, whether an ACROD permit is required, and any height clearance limits.',
        'Add a simple map (hand-drawn or annotated photo) showing the route.',
        'Publish on your website\'s accessibility or "Getting Here" page.',
        'Add alt text to all images for screen reader users.'
      ],
      notes: 'This is free and can be done in an hour. It immediately helps every visitor who checks your website before arriving.'
    },
    {
      title: 'Establish a signage maintenance program',
      description: 'Create a scheduled maintenance program for all external signage, including regular inspections, cleaning, and replacement.',
      resourceLevel: 'low',
      costRange: '$0-200 per year',
      timeRequired: 'Ongoing (30 minutes every 6 months)',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Create a sign register listing every external sign, its location, and its condition.',
        'Photograph each sign as a baseline record.',
        'Schedule 6-monthly inspections (align with daylight saving changes as a reminder).',
        'During each inspection: check sign is present, securely mounted, not obscured by vegetation, text legible, reflective face intact.',
        'Replace any sign that is faded beyond 70% contrast or damaged.',
        'Update the register after each inspection.'
      ],
      notes: 'A simple spreadsheet or checklist is sufficient for the sign register.'
    }
  ],

  examples: [
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A multi-level shopping centre car park had accessible spaces on Level 2 but no directional signs from the car park entrance or between levels.',
      solution: 'Installed a 3-level wayfinding system: ISA signs at the car park entrance, directional signs at each level change and intersection, and confirmation signs at the accessible spaces. Also added arrival directions to the centre website.',
      outcome: 'Customer feedback indicated a significant reduction in time spent searching for accessible parking. The centre received positive mentions on disability forums.',
      cost: '$2,800',
      timeframe: '1 week'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Resort',
      scenario: 'A coastal resort had accessible parking behind the main building, invisible from the road approach. Guests frequently parked in the front lot and then had to navigate stairs to reach reception.',
      solution: 'Added three directional signs with distance indicators ("Accessible Parking 50m, turn right at pool gate") from the resort entrance to the rear car park.',
      outcome: 'Guests with disability stopped arriving at reception via the front stairs. Staff reported fewer requests for parking assistance.',
      cost: '$450',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Section 8: Signage',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Requirements for signage on accessible paths of travel including ISA placement, contrast, and positioning.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Wayfinding Design Guidelines',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on inclusive wayfinding design for public buildings and spaces.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'SEGD Signage Maintenance Best Practices',
      url: 'https://segd.org/resources',
      type: 'guide',
      source: 'Society for Experiential Graphic Design',
      description: 'Best practice guidance for maintaining wayfinding signage systems over time.',
      isAustralian: false,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.1-F-1', questionText: 'Is there accessible parking available for customers?', relationship: 'Signage must lead to the accessible parking spaces.', moduleCode: '2.1' },
    { questionId: '2.1-F-4', questionText: 'Is the path from accessible parking to the entrance smooth and level?', relationship: 'Signage should continue along the path from parking to entrance.', moduleCode: '2.1' },
    { questionId: '2.2-F-4', questionText: 'Is the main entrance clearly visible and identifiable as you approach the venue?', relationship: 'External wayfinding connects to entrance visibility.', moduleCode: '2.2' }
  ],

  keywords: ['signage', 'wayfinding', 'directional', 'ISA symbol', 'contrast', 'online info', 'sign maintenance', 'decision points', 'arrival information', 'reflective']
},

// ─── Entry 4: Staff Parking and Entry Guidance ───
{
  questionId: '2.1-F-7',
  questionText: 'Do staff know how to direct customers to accessible parking and entry points?',
  moduleCode: '2.1',
  moduleGroup: 'getting-in',
  diapCategory: 'customer-service',
  title: 'Staff Parking and Entry Guidance',
  summary: 'Staff are the human fallback when signage is unclear or visitors are unfamiliar with the venue. All front-line staff should be able to confidently direct customers to accessible parking and the accessible entrance.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'When signage is unclear or a visitor is arriving for the first time, staff are the fallback. Untrained staff who give vague or incorrect directions can leave a customer stranded at a non-accessible entrance, circling the car park, or feeling unwelcome. Phone enquiries about parking and entry are common, and staff who cannot answer confidently may lose the customer before they even arrive.',
    quote: {
      text: 'I called ahead to ask about accessible parking and the person on the phone said "I think there is some somewhere." I booked somewhere else.',
      attribution: 'Wheelchair user, customer feedback'
    }
  },

  tips: [
    {
      icon: 'Users',
      text: 'Include accessible parking and entrance directions in staff induction training.',
      detail: 'Every new staff member should walk the route from accessible parking to the accessible entrance during their first week. This builds firsthand knowledge they can share with customers.',
      priority: 1
    },
    {
      icon: 'FileText',
      text: 'Create a laminated reference card with directions and a simple map.',
      detail: 'Place a card at reception, the phone, and any customer-facing counter. Include: location of accessible spaces, distance to entrance, which entrance is accessible, and any access codes or buzzers needed.',
      priority: 2
    },
    {
      icon: 'Phone',
      text: 'Prepare a phone script for accessibility enquiries.',
      detail: 'Write a brief script covering the most common questions: "Where is accessible parking?", "Which entrance is accessible?", "Is there a ramp?", "How far is it from parking to the door?" Staff should be able to answer these without hesitation.',
      priority: 3
    },
    {
      icon: 'CheckCircle',
      text: 'Update information whenever parking or entrance arrangements change.',
      detail: 'Construction, events, seasonal changes, or new tenants can alter parking and entrance arrangements. Update reference cards and phone scripts immediately when changes occur.',
      priority: 4
    },
    {
      icon: 'AlertTriangle',
      text: 'Test staff knowledge at team meetings by asking them to give directions.',
      detail: 'Ask a team member to describe how to get from accessible parking to the entrance. If they hesitate or give incorrect information, it is time for a refresher.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing staff knowledge',
    steps: [
      { text: 'Ask three different front-line staff members (at different times) to direct you to accessible parking and the accessible entrance. Note accuracy and confidence.' },
      { text: 'Call your venue as a customer and ask about accessible parking. Assess the response.' },
      { text: 'Check whether induction materials include accessible parking and entrance information.' },
      { text: 'Look for reference cards or maps at reception, phone, and customer service points.' },
      { text: 'Ask the most recent new hire whether they were shown the accessible route during induction.' }
    ],
    tools: ['Phone for test call', 'Notepad for recording responses'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The Disability Discrimination Act requires that services be provided without discrimination. Staff who cannot direct customers to accessible facilities may be failing this obligation.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'While primarily a building standard, effective staff knowledge supports the intent of accessible premises by ensuring people can actually find and use the features provided.' }
    ],
    plainEnglish: 'There is no specific physical standard for staff knowledge, but the DDA requires that services be accessible. Staff who cannot help customers find accessible parking and entrances create a service barrier.',
    complianceNote: 'Staff training is one of the lowest-cost, highest-impact accessibility improvements you can make.'
  },

  solutions: [
    {
      title: 'Create a staff reference card and phone script',
      description: 'Produce a simple laminated card and phone script so every staff member can confidently answer accessibility questions.',
      resourceLevel: 'low',
      costRange: '$0-50',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Walk the route from accessible parking to the accessible entrance and note every detail: space numbers, distances, surface type, which door, any codes or buzzers.',
        'Write the information on a single A5 card with a simple map or diagram.',
        'Laminate copies and place at reception, beside the phone, and at any customer service point.',
        'Write a brief phone script covering the three most common questions (parking location, entrance location, path condition).',
        'Brief all staff at the next team meeting and ask each person to practice giving directions.',
        'Set a reminder to update the card whenever parking or entrance arrangements change.'
      ],
      notes: 'A hand-drawn map is perfectly adequate. It does not need to be professionally designed.'
    },
    {
      title: 'Implement structured accessibility training',
      description: 'Build accessibility awareness into your staff training program, covering not just parking and entrances but all aspects of welcoming customers with disability.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '2-4 hours initial, then 30 minutes per new hire',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Source or develop a 1-hour accessibility awareness training module. The Australian Network on Disability offers free online modules.',
        'Add a physical walkthrough of the accessible route (parking to entrance to key facilities) to your induction program.',
        'Include role-play scenarios: directing someone to parking by phone, greeting someone at the non-accessible entrance and redirecting them, assisting someone with a mobility aid.',
        'Create a knowledge quiz covering key locations and measurements (e.g. "How far is accessible parking from the entrance?" "Which entrance has the ramp?").',
        'Schedule annual refresher training aligned with IDPWD (International Day of People with Disability, 3 December).',
        'Record completion in staff training records.'
      ],
      notes: 'The AND (Australian Network on Disability) provides free online disability awareness training modules suitable for any industry.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had an accessible side entrance, but staff consistently directed phone callers to the front entrance which had two steps.',
      solution: 'Created a laminated card with a simple map showing the accessible entrance location and placed it beside every phone. Added the information to the voicemail greeting.',
      outcome: 'Callers with mobility requirements now receive correct directions every time. Two regular customers thanked the owner for the improvement.',
      cost: 'Free (printed in-house)',
      timeframe: '30 minutes'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre found that event organisers frequently gave incorrect parking instructions to attendees with disability because they did not know the venue layout.',
      solution: 'Added accessible parking and entrance details to the standard event briefing pack sent to all organisers, including a map and photo of the accessible route.',
      outcome: 'Event organisers now include correct accessibility information in their own communications. Complaints from attendees about parking dropped significantly.',
      cost: '$30 (printing)',
      timeframe: '1 hour to create'
    }
  ],

  resources: [
    {
      title: 'AND Disability Awareness eLearning',
      url: 'https://www.and.org.au/resources/disability-awareness-elearning/',
      type: 'website',
      source: 'Australian Network on Disability',
      description: 'Free online disability awareness training modules suitable for all staff.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AHRC Providing Goods, Services and Facilities',
      url: 'https://humanrights.gov.au/our-work/disability-rights/guides/brief-guide-disability-discrimination-act',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guide to DDA obligations in customer service, including reasonable adjustments.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Tourism Australia Accessible Tourism Toolkit',
      url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/building-an-accessible-tourism-business.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Practical toolkit for tourism businesses covering staff training, customer service, and marketing to visitors with disability.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.1-F-1', questionText: 'Is there accessible parking available for customers?', relationship: 'Staff need to know where accessible parking is located to direct customers.', moduleCode: '2.1' },
    { questionId: '2.1-F-6', questionText: 'Is there directional signage on the road approach directing visitors to accessible parking?', relationship: 'Staff directions supplement signage, especially for phone enquiries.', moduleCode: '2.1' }
  ],

  keywords: ['staff', 'training', 'directions', 'customer service', 'induction', 'reference card', 'phone script', 'knowledge', 'guidance']
},

// ─── Entry 5: Accessible Entrance ───
{
  questionId: '2.2-F-1',
  questionText: 'Is there an accessible entrance to your venue?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Accessible Entrance',
  summary: 'An accessible entrance allows everyone to enter independently, including wheelchair users, people with prams, and those with mobility difficulties. It is the single most important physical access feature of any venue.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'The entrance is literally the gateway to your business. If someone cannot get through the door, nothing else matters. An accessible entrance means step-free access, adequate door width, manageable door hardware, and enough space to approach and pass through. For the 1.4 million Australians who use mobility aids, and many more with temporary injuries, prams, or heavy loads, an inaccessible entrance means exclusion.',
    quote: {
      text: 'I have turned around at more venues than I can count because of one step at the entrance. One step is all it takes to shut someone out.',
      attribution: 'Wheelchair user, disability advocacy forum'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'Doorway must be minimum 850mm clear width.',
      detail: 'Measure the clear opening when the door is at 90 degrees, not the door leaf width. A standard wheelchair is 650-700mm wide, so 850mm is the minimum for comfortable passage.',
      priority: 1
    },
    {
      icon: 'Layers',
      text: 'No steps at the entrance. Maximum 5mm threshold.',
      detail: 'Even a single step is a complete barrier for wheelchair users. A threshold of up to 5mm is acceptable if bevelled. If steps are unavoidable, a ramp or platform lift must be provided.',
      priority: 2
    },
    {
      icon: 'Hand',
      text: 'Lever handles at 900-1100mm height.',
      detail: 'Round knobs require a twisting grip that many people cannot manage. Lever handles can be operated with a closed fist, an elbow, or a wrist.',
      priority: 3
    },
    {
      icon: 'Gauge',
      text: 'Door opening force must not exceed 20 Newtons.',
      detail: 'Test by pushing the door open with one finger. If you need significant effort, it is likely too heavy for someone with limited upper body strength.',
      priority: 4
    },
    {
      icon: 'Signpost',
      text: 'If the main entrance is not accessible, clearly sign the alternative accessible entrance.',
      detail: 'The sign at the main entrance should show the ISA symbol, the direction, and the distance to the accessible entrance. The alternative entrance must be open during all business hours.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing your entrance accessibility',
    steps: [
      {
        text: 'Measure the clear opening width of the entrance door at its narrowest point (door open to 90 degrees).',
        measurement: { target: 'Clear door width', acceptable: 'Minimum 850mm', unit: 'mm' }
      },
      {
        text: 'Measure the threshold height.',
        measurement: { target: 'Threshold', acceptable: 'Maximum 5mm (13mm absolute max with bevel)', unit: 'mm' }
      },
      { text: 'Check the handle type. Is it a lever (acceptable) or a round knob (barrier)?' },
      {
        text: 'Measure the handle height from the floor.',
        measurement: { target: 'Handle height', acceptable: '900-1100mm', unit: 'mm' }
      },
      { text: 'Test the door opening force. Can you open it with one finger?' },
      { text: 'Check the approach landing: is there at least 1200mm x 1200mm of level space in front of the door?' },
      { text: 'If the main entrance has steps, check for an alternative accessible entrance with clear signage.' }
    ],
    tools: ['Tape measure', 'Camera', 'Spring balance or force gauge (optional)'],
    estimatedTime: '10-15 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 13',
      requirement: 'Doorways on accessible paths of travel must have minimum 850mm clear opening, lever-action or push/pull hardware, maximum 20N opening force, and compliant threshold.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires at least one accessible entrance to all new buildings and to existing buildings undergoing significant renovation.' },
      { code: 'NCC', relevance: 'References AS1428.1 for entrance door requirements in all public buildings.' },
      { code: 'DDA', relevance: 'Requires reasonable adjustments to entrances even in older buildings not covered by the Premises Standards.' }
    ],
    plainEnglish: 'Your entrance must be step-free with a wide enough door that is easy to open. If the main entrance has steps, you must provide a clearly signed alternative accessible entrance.',
    complianceNote: 'The Premises Standards apply to new buildings and significant renovations. However, the DDA applies to all buildings regardless of age, and a complaint about an inaccessible entrance is likely to succeed if a reasonable adjustment exists.'
  },

  solutions: [
    {
      title: 'Install a doorbell or intercom at wheelchair height',
      description: 'Where the entrance door is too heavy or the entrance is locked, a doorbell or intercom at wheelchair height lets customers alert staff for assistance.',
      resourceLevel: 'low',
      costRange: '$30-80',
      timeRequired: '1 hour',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Purchase a wireless doorbell or intercom with a large, high-contrast button.',
        'Mount it at 900-1100mm height beside the entrance door, on the latch side.',
        'Add a sign above it reading "Press for assistance" in high-contrast text (minimum 15mm letter height).',
        'Test that staff can hear the bell from all work areas.',
        'Establish a response time target (maximum 30 seconds) and train staff.',
        'Check the battery and test the unit monthly.'
      ],
      notes: 'This is a temporary measure. The long-term goal should be independent entry without staff assistance.'
    },
    {
      title: 'Replace door hardware and add a portable ramp',
      description: 'Replace round knobs with lever handles, adjust the door closer to reduce force, and provide a portable ramp to overcome a single step.',
      resourceLevel: 'medium',
      costRange: '$300-600',
      timeRequired: '1 day',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Replace all round door knobs with lever handles. Choose D-type levers that return to the closed position.',
        'Adjust the door closer to reduce opening force to 20N or less. A locksmith can do this in minutes.',
        'If there is one step (up to 190mm), purchase a portable aluminium ramp with fold-out legs and non-slip surface.',
        'Store the ramp immediately inside the door where staff can deploy it quickly.',
        'Add a sign at the entrance: "Ramp available on request. Press bell or call [number]."',
        'Train all staff to deploy the ramp within 30 seconds of a request.',
        'Inspect the ramp monthly for damage, loose parts, or worn non-slip surface.'
      ],
      notes: 'Portable ramps are not ideal because they require staff assistance and remove independence. Consider a permanent ramp if feasible.'
    },
    {
      title: 'Install a power-assisted door opener',
      description: 'Fit an automatic or push-button door opener so customers can enter independently without needing to pull or push a heavy door.',
      resourceLevel: 'medium',
      costRange: '$1,500-3,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Engage a door automation specialist to assess your entrance door for compatibility.',
        'Choose between a full automatic (sensor-activated) or push-button system based on budget and door type.',
        'Install the opener, ensuring it holds the door open for at least 5 seconds.',
        'For push-button systems, mount the activation button at 900-1100mm height with the ISA symbol.',
        'Test with a wheelchair user or by sitting in an office chair to simulate wheelchair height and reach.',
        'Schedule annual servicing of the motor and sensor.',
        'Add the automatic door to your website accessibility information.'
      ],
      notes: 'Automatic sliding doors are the gold standard for accessibility but require more space and higher budget ($5,000-15,000).'
    },
    {
      title: 'Install a permanent ramp or platform lift',
      description: 'For entrances with multiple steps, install a permanent ramp or a platform lift to provide step-free access.',
      resourceLevel: 'high',
      costRange: '$3,000-25,000',
      timeRequired: '1-4 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Engage an access consultant or architect to assess the entrance and design a compliant solution.',
        'For 1-3 steps, a permanent ramp is usually the most cost-effective solution. Specify maximum 1:14 gradient, handrails both sides, non-slip surface, and TGSIs.',
        'For more than 3 steps or where space is limited, a vertical platform lift may be more appropriate.',
        'Obtain any required building permits and heritage approvals.',
        'Engage a licensed builder to construct the ramp or install the lift.',
        'Commission the new access feature with a compliance audit before opening.',
        'Update your website and signage to reflect the new accessible entrance.',
        'Schedule annual maintenance for ramps (surface condition, handrail stability) or lifts (mechanical service).'
      ],
      notes: 'Heritage buildings may qualify for exemptions but should still explore reasonable adjustments. An access consultant can advise on heritage-sensitive solutions.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A heritage-listed cafe had two steps at the only entrance. The owner assumed nothing could be done because of heritage restrictions.',
      solution: 'Purchased a portable aluminium ramp ($400) that staff deploy on request. Added a doorbell at wheelchair height and a sign. Applied for heritage approval for a permanent ramp (pending).',
      outcome: 'Wheelchair users can now visit the cafe with advance notice. The owner receives 2-3 ramp requests per week, confirming demand for a permanent solution.',
      cost: '$400 for ramp, $50 for doorbell and sign',
      timeframe: '1 day to implement'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shop',
      scenario: 'A retail shop had a heavy manual door with a round knob that customers with arthritis, wheelchair users, and parents with prams struggled to open.',
      solution: 'Installed a push-button automatic door opener with an ISA-marked button at 1000mm height. Replaced the round knob with a D-lever handle as a backup.',
      outcome: 'Customer flow improved for everyone, not just people with disability. The owner reported fewer instances of customers waiting outside for someone to hold the door.',
      cost: '$2,000-4,000',
      timeframe: '1 day installation'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Bed and Breakfast',
      scenario: 'A B&B had an accessible side entrance but the main entrance (with steps) was the only one signed and lit.',
      solution: 'Added ISA signage at the main entrance directing to the side entrance, improved lighting on the side path, and updated the website with photos of both entrances.',
      outcome: 'Guests with disability now use the side entrance independently. The B&B added "step-free entrance available" to their booking confirmation emails.',
      cost: '$200',
      timeframe: '2 hours'
    }
  ],

  resources: [
    {
      title: 'ABCB Accessible Door Design Summary',
      url: 'https://www.abcb.gov.au/resources/handbook-accessibility',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'Summary of NCC and AS1428.1 requirements for accessible door design, including width, hardware, and thresholds.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AND Portable Ramp Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Guide to selecting, deploying, and maintaining portable ramps for temporary access solutions.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-2', questionText: 'Is the main entrance door at least 850mm wide?', relationship: 'Door width is the first physical measurement to check at the entrance.', moduleCode: '2.2' },
    { questionId: '2.2-F-4', questionText: 'Is the main entrance clearly visible and identifiable as you approach the venue?', relationship: 'Visitors must be able to find the entrance before they can use it.', moduleCode: '2.2' },
    { questionId: '2.1-F-4', questionText: 'Is the path from accessible parking to the entrance smooth and level?', relationship: 'The path from parking must connect to the accessible entrance.', moduleCode: '2.1' }
  ],

  keywords: ['entrance', 'door', 'doorway', 'accessible', 'step-free', 'ramp', 'automatic door', 'threshold', 'lever handle', 'portable ramp']
},

// ─── Entry 6: Entrance Doors and Thresholds ───
{
  questionId: '2.2-F-2',
  questionText: 'Is the main entrance door at least 850mm wide?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Entrance Doors and Thresholds',
  coveredQuestionIds: ['2.2-F-3', '2.2-F-6', '2.2-F-7', '2.2-D-11', '2.2-D-12', '2.2-D-13', '2.2-D-14', '2.2-D-16', '2.2-D-17', '2.2-D-18'],
  summary: 'Covers everything about the physical entrance door: width, handles, thresholds, lighting, landing space, glass markings, intercom height, automatic door timing, and mat safety.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Door width is the most fundamental access requirement. A standard wheelchair is 650-700mm wide, so 850mm clear opening is the minimum for safe passage. But width alone is not enough. Round knobs exclude people with limited grip strength. Heavy doors stop people with one arm or low upper-body strength. High thresholds catch wheels and trip feet. Poor lighting makes the entrance unsafe at night. Loose mats are a fall hazard. Every element of the door must work together to allow independent, safe entry.',
    statistic: {
      value: '1 in 5',
      context: 'Australians report some form of hand or grip limitation, including arthritis, which makes round door knobs a barrier.',
      source: 'Arthritis Australia'
    }
  },

  tips: [
    {
      icon: 'Maximize',
      text: 'Measure clear opening at the narrowest point: minimum 850mm, 1000mm preferred.',
      detail: 'Measure with the door open to 90 degrees. The clear opening is from the door face to the opposite frame, not the door leaf width. If there is a vestibule, measure both doors.',
      priority: 1
    },
    {
      icon: 'Hand',
      text: 'Lever handles at 900-1100mm height. Replace round knobs.',
      detail: 'Lever handles can be operated with a closed fist, an elbow, or a hook on a cane. D-type levers that spring back to horizontal are ideal. Handle height must be within reach of both standing and seated users.',
      priority: 2
    },
    {
      icon: 'Layers',
      text: 'Threshold maximum 5mm (13mm absolute max with bevel).',
      detail: 'A threshold higher than 5mm will catch small caster wheels and trip people with reduced foot clearance. If the threshold cannot be reduced, add a bevelled transition strip.',
      priority: 3
    },
    {
      icon: 'Sun',
      text: 'Lighting minimum 150 lux at the entrance.',
      detail: 'Adequate lighting helps everyone see the door, handle, threshold, and any signage. It is especially important for people with low vision navigating an unfamiliar entrance.',
      priority: 4
    },
    {
      icon: 'Clock',
      text: 'Automatic doors must hold open for at least 5 seconds.',
      detail: 'A door that closes too quickly can trap a wheelchair or hit someone moving slowly. Adjust the timer on automatic closers or sensor doors to hold open for at least 5 seconds.',
      priority: 5
    },
    {
      icon: 'Footprints',
      text: 'Mats must be flush with the floor surface (maximum 3mm transition) and firm.',
      detail: 'Thick, soft, or loose mats catch wheelchair casters and trip people with reduced foot lift. Recessed mat wells with firm rubber matting are the best solution. Avoid thick coir or bristle mats.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing entrance doors and thresholds',
    steps: [
      {
        text: 'Measure the clear opening width with the door open to 90 degrees.',
        measurement: { target: 'Clear door width', acceptable: 'Minimum 850mm (1000mm preferred)', unit: 'mm' }
      },
      { text: 'If there is a vestibule (two doors in sequence), measure both openings and the space between them (minimum 1200mm + door swing).' },
      {
        text: 'Measure the handle height from the floor.',
        measurement: { target: 'Handle height', acceptable: '900-1100mm', unit: 'mm' }
      },
      {
        text: 'Measure the threshold height.',
        measurement: { target: 'Threshold', acceptable: 'Maximum 5mm (13mm with bevel)', unit: 'mm' }
      },
      {
        text: 'Check lighting level at the entrance.',
        measurement: { target: 'Entrance lighting', acceptable: 'Minimum 150 lux', unit: 'lux' }
      },
      { text: 'Time automatic doors from activation to closing. They should hold open for at least 5 seconds.' },
      { text: 'Check mats: Are they flush with the floor? Firm? Securely fixed? Can a wheelchair roll across smoothly?' },
      { text: 'Check glass doors for contrast markings (solid band or pattern at 900-1000mm and 1400-1600mm heights).' },
      {
        text: 'If there is an intercom or entry buzzer, check its height.',
        measurement: { target: 'Intercom height', acceptable: '900-1200mm', unit: 'mm' }
      }
    ],
    tools: ['Tape measure', 'Lux meter or smartphone app', 'Stopwatch', 'Camera'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 7 and 13',
      requirement: 'Doorways on accessible paths must have minimum 850mm clear opening, lever hardware at 900-1100mm, maximum 5mm threshold, and adequate approach space.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible entrance doors in new buildings and significant renovations.' },
      { code: 'NCC', relevance: 'References AS1428.1 for all public building entrance requirements.' },
      { code: 'DDA', relevance: 'Requires reasonable adjustments to entrance doors in all buildings, including older premises.' }
    ],
    plainEnglish: 'Entrance doors must be wide enough for a wheelchair (850mm minimum), have lever handles at a reachable height, have a near-flat threshold, and be easy to open. Glass doors need contrast markings.',
    complianceNote: 'Simple door hardware changes (levers, closers, mats) are low-cost and almost always considered reasonable adjustments under the DDA.'
  },

  solutions: [
    {
      title: 'Remove obstructions and install offset hinges',
      description: 'Gain extra door width by removing obstructions or fitting offset hinges, and fix immediate threshold and mat issues.',
      resourceLevel: 'low',
      costRange: '$0-2,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'quick-win',
      steps: [
        'Check for and remove any obstructions reducing the clear opening: coat hooks, display stands, signage, or weather strips.',
        'If the door opens to less than 90 degrees due to a wall or fixture, remove the obstruction or install a door stop at 90 degrees.',
        'Install offset (swing-clear) hinges to gain up to 50-60mm of additional clear width without replacing the door.',
        'Replace any thick coir or bristle mat with a flush, firm rubber mat (maximum 3mm transition).',
        'Apply a bevel strip to any threshold higher than 5mm.',
        'Replace round knobs with lever handles if not already done.'
      ],
      notes: 'Offset hinges are one of the most cost-effective ways to widen a doorway without structural changes.'
    },
    {
      title: 'Replace mats and adjust door closer timing',
      description: 'Address the most common entrance hazards: loose or thick mats, doors that close too fast, and inadequate glass markings.',
      resourceLevel: 'low',
      costRange: '$50-400',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Replace any loose, soft, or thick entrance mats with recessed mat wells or firm rubber mats with bevelled edges.',
        'Adjust the door closer to hold the door open for at least 5 seconds. Most closers have an adjustable valve screw.',
        'Reduce the closing force to 20N or less by adjusting the closer spring tension.',
        'Apply contrast marking strips to glass doors at two heights: 900-1000mm and 1400-1600mm. Use solid bands at least 75mm high.',
        'Test the adjusted door from a seated position (office chair) to simulate wheelchair approach.'
      ],
      notes: 'Door closer adjustment is often free and takes 5 minutes with a screwdriver.'
    },
    {
      title: 'Install automatic sliding doors',
      description: 'Replace manual doors with sensor-activated automatic sliding doors for fully independent entry.',
      resourceLevel: 'high',
      costRange: '$5,000-15,000',
      timeRequired: '3-5 days',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a door automation specialist to assess the entrance for sliding door compatibility (track space, power, structural support).',
        'Specify sensor activation with a minimum 5-second hold-open time and slow closing speed.',
        'Ensure the opening width is at least 900mm (1200mm preferred for high-traffic entrances).',
        'Include a manual override for power failures.',
        'Integrate with your fire and security systems as required.',
        'Add safety sensors to prevent the door closing on someone in the doorway.',
        'Commission the installation with a test by a wheelchair user.',
        'Schedule annual servicing of the motor, sensors, and track.'
      ],
      notes: 'Automatic sliding doors benefit everyone and can increase foot traffic. Many businesses report a positive return on investment from increased customer flow.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A cafe had an 800mm-wide entrance door. Widening the frame was not feasible due to heritage restrictions.',
      solution: 'Installed offset (swing-clear) hinges, gaining 55mm of additional clear width to reach 855mm. Replaced the round knob with a lever handle.',
      outcome: 'Wheelchair users can now enter independently. The total cost was under $250.',
      cost: '$250',
      timeframe: '2 hours'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre\'s automatic doors closed after 3 seconds, frequently hitting slower-moving customers and wheelchair users.',
      solution: 'Adjusted the door timer to hold open for 6 seconds and reduced closing speed. No parts were needed.',
      outcome: 'Customer complaints about doors dropped to zero. The adjustment took the maintenance team 10 minutes.',
      cost: 'Free',
      timeframe: '10 minutes'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A cafe had a thick coir mat at the entrance that caught wheelchair casters and caused a customer to trip.',
      solution: 'Replaced the coir mat with a flush rubber mat in a recessed well, providing the same dirt-trapping function without a trip hazard.',
      outcome: 'No further incidents. The new mat is easier to clean and lasts longer.',
      cost: '$90',
      timeframe: '1 hour'
    }
  ],

  resources: [
    {
      title: 'ABCB Accessible Door Design Handbook',
      url: 'https://www.abcb.gov.au/resources/handbook-accessibility',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'Comprehensive guide to door design for accessibility including width, hardware, thresholds, and automatic doors.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS1428.1: Design for Access and Mobility',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary Australian standard for accessible design, including all door and entrance requirements.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Premises Standards 2010',
      url: 'https://www.ag.gov.au/rights-and-protections/human-rights-and-anti-discrimination/disability-standards/disability-access-premises-buildings',
      type: 'guide',
      source: 'Attorney-General\'s Department',
      description: 'Mandatory building accessibility standards for new buildings and significant renovations in Australia.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Floor Surfaces and Entrance Mat Safety Guide',
      url: 'https://www.safeworkaustralia.gov.au/safety-topic/hazards/slips-trips-and-falls',
      type: 'guide',
      source: 'Safe Work Australia',
      description: 'Guidance on floor surface safety including entrance mats, slip resistance, and transition strips.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'This entry details the door-specific requirements of the accessible entrance.', moduleCode: '2.2' },
    { questionId: '2.2-F-4', questionText: 'Is the main entrance clearly visible and identifiable as you approach the venue?', relationship: 'Entrance visibility helps visitors find the door before assessing its accessibility.', moduleCode: '2.2' },
    { questionId: '2.3-D-18', questionText: 'Are internal doors easy to open for people with limited hand strength or dexterity?', relationship: 'The same door hardware and force principles apply to internal doors.', moduleCode: '2.3' }
  ],

  keywords: ['door width', 'threshold', 'handle', 'lever', 'lighting', 'glass marking', 'intercom', 'auto door', 'entrance mat', 'landing space', 'staff training', 'vestibule', 'offset hinges']
},

// ─── Entry 7: Entrance Visibility and Signage ───
{
  questionId: '2.2-F-4',
  questionText: 'Is the main entrance clearly visible and identifiable as you approach the venue?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'information-communication-marketing',
  title: 'Entrance Visibility and Signage',
  coveredQuestionIds: ['2.2-F-5', '2.2-D-21', '2.2-D-22'],
  summary: 'The entrance must be easy to find and identify from all approach directions. If an alternative accessible entrance exists, clear signage must direct people to it. Internal directional signage at the entrance helps visitors orient themselves on arrival.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Finding the entrance is the first step in any visit. For people with cognitive disabilities, anxiety, or vision impairment, an unclear entrance can cause confusion, distress, or abandonment of the visit. When a venue has multiple entrances or an alternative accessible entrance, the absence of clear signage can send someone to a door they cannot use. Internal signs at the entry point orient visitors immediately and reduce the need to ask for help.',
    statistic: {
      value: '45%',
      context: 'of people with disability report avoiding new venues due to uncertainty about finding the entrance and navigating inside.',
      source: 'Disability advocacy research'
    }
  },

  tips: [
    {
      icon: 'Eye',
      text: 'Make the entrance visible from all approach directions: street, car park, and public transport stops.',
      detail: 'Stand at each approach point and check whether you can clearly see which door is the entrance. If not, add visual cues.',
      priority: 1
    },
    {
      icon: 'Layers',
      text: 'Use contrasting colours, a canopy, or distinctive treatment to highlight the entrance.',
      detail: 'A brightly painted door frame, an awning, lighting, or a canopy draws the eye to the entrance. This is especially helpful when the building facade has multiple doors or a uniform appearance.',
      priority: 2
    },
    {
      icon: 'Signpost',
      text: 'If the main entrance is not accessible, sign the alternative accessible entrance clearly with the ISA symbol.',
      detail: 'Place a sign at the main entrance showing the ISA symbol, direction arrow, and distance to the accessible entrance. The alternative entrance must be open during all business hours.',
      priority: 3
    },
    {
      icon: 'MapPin',
      text: 'Install internal directional signs at the entrance for key destinations.',
      detail: 'As visitors enter, they should immediately see signs pointing to reception, toilets, lifts, and key areas. This reduces confusion and the need to ask for directions.',
      priority: 4
    },
    {
      icon: 'FileText',
      text: 'Ensure the business name is clearly visible and distinguishable from neighbouring premises.',
      detail: 'In a strip of shops or an office building, visitors need to identify your business from the street. Use large, high-contrast signage with your business name visible from at least 10m away.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing entrance visibility and signage',
    steps: [
      { text: 'Approach the venue from the street, car park, and nearest public transport stop. Can you identify the entrance from each direction?' },
      { text: 'Check whether the entrance stands out visually: does it have a distinctive colour, canopy, lighting, or signage?' },
      { text: 'If there is an alternative accessible entrance, check for signage at the main entrance directing people to it. Note the ISA symbol, direction, and distance.' },
      { text: 'Enter through the accessible entrance and check for internal directional signs pointing to key destinations (reception, toilets, lifts).' },
      { text: 'Check that your business name is clearly visible from the street and distinguishable from neighbouring businesses.' },
      { text: 'Ask a first-time visitor to find your entrance without assistance and note any hesitation or wrong turns.' }
    ],
    tools: ['Camera', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 8',
      requirement: 'Accessible entrances must be identified with the International Symbol of Access. Where the main entrance is not accessible, signs must direct to the accessible entrance.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires identification of accessible entrances through compliant signage.' },
      { code: 'DDA', relevance: 'Requires that services be accessible, which includes being able to find and reach the entrance.' }
    ],
    plainEnglish: 'Your entrance must be easy to find. If the main door is not accessible, you must sign the accessible entrance clearly. Internal signs should help visitors navigate from the moment they enter.',
    complianceNote: 'Entrance visibility improvements such as paint, canopies, and signage are low-cost and almost always feasible, even in heritage buildings.'
  },

  solutions: [
    {
      title: 'Improve entrance signage and visual cues',
      description: 'Add visual treatments and signage to make the entrance easy to find from all approach directions.',
      resourceLevel: 'low',
      costRange: '$100-500',
      timeRequired: '1 day',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Paint the entrance door frame in a contrasting colour (e.g. bright blue or red against a light wall).',
        'Install a sign with your business name above the entrance, readable from at least 10m (minimum 100mm letter height).',
        'If there is an alternative accessible entrance, install a sign at the main entrance: ISA symbol, arrow, and distance (e.g. "Accessible entrance 20m, left side of building").',
        'Add an ISA sign at the accessible entrance itself to confirm visitors have found the right door.',
        'Install internal directional signs just inside the entrance pointing to reception, toilets, and lifts.',
        'Ensure all signs have minimum 70% luminance contrast.'
      ],
      notes: 'Simple paint and signage changes can dramatically improve entrance findability at minimal cost.'
    },
    {
      title: 'Add internal wayfinding at the entrance',
      description: 'Install a comprehensive wayfinding system just inside the entrance to orient visitors immediately on arrival.',
      resourceLevel: 'medium',
      costRange: '$200-800',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Map the key destinations visitors need to reach from the entrance: reception, toilets, lifts, main service areas.',
        'Design a simple directional sign panel for the entrance foyer listing all key destinations with arrows.',
        'For larger venues, create a "You Are Here" floor plan and mount it at 1200-1600mm height.',
        'Include the ISA symbol on signs pointing to accessible toilets and lifts.',
        'Use consistent colour coding throughout the venue if multiple routes exist.',
        'Test the wayfinding by having a first-time visitor navigate to three destinations using only the signs.'
      ],
      notes: 'Good internal wayfinding benefits all visitors, not just those with disability. It also reduces staff time spent giving directions.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Heritage Restaurant',
      scenario: 'A heritage restaurant in a row of shops had an entrance that blended into the facade. Visitors, especially those with vision impairment, frequently walked past it.',
      solution: 'Painted the door frame in a bold colour, installed a larger business sign with a downlight, and added a small awning. The accessible side entrance received an ISA sign at the front.',
      outcome: 'Walk-past incidents reduced significantly. The restaurant also reported an increase in walk-in customers who had previously not noticed the entrance.',
      cost: '$400',
      timeframe: '1 day'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shop',
      scenario: 'A shop in a large building complex had its entrance behind a column, invisible from the main walkway.',
      solution: 'Installed a distinctive awning projecting past the column, added a blade sign (perpendicular to the wall) with the business name, and placed a floor decal on the main walkway pointing to the entrance.',
      outcome: 'New customers reported finding the shop much more easily. The blade sign and floor decal cost less than $200 combined.',
      cost: '$1,200 total (awning $1,000, signs $200)',
      timeframe: '3 days'
    }
  ],

  resources: [
    {
      title: 'AND Wayfinding Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide to wayfinding design for businesses, covering signage, colour coding, and inclusive design.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'ABCB Accessible Signage Requirements',
      url: 'https://www.abcb.gov.au/resources/handbook-accessibility',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'Requirements for accessible signage under the NCC, including ISA placement, contrast, and positioning.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'Visitors must find the entrance before they can assess its accessibility.', moduleCode: '2.2' },
    { questionId: '2.2-F-2', questionText: 'Is the main entrance door at least 850mm wide?', relationship: 'Entrance visibility leads to the physical door assessment.', moduleCode: '2.2' },
    { questionId: '2.3-D-5', questionText: 'Is there clear wayfinding signage to key destinations within your venue?', relationship: 'External and entrance signage connects to the internal wayfinding system.', moduleCode: '2.3' }
  ],

  keywords: ['entrance', 'visibility', 'signage', 'alternative entrance', 'ISA', 'wayfinding', 'business identification', 'directional', 'canopy', 'colour contrast']
},

// ─── Entry 8: Entrance Stairs ───
{
  questionId: '2.2-D-23',
  questionText: 'If there are stairs or steps at the entrance, do they have handrails or grab rails on both sides?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Entrance Stairs',
  coveredQuestionIds: ['2.2-F-8', '2.2-D-24', '2.2-D-25', '2.2-D-26'],
  summary: 'Entrance stairs need four safety features: handrails on both sides, contrasting nosing strips on every step, enclosed risers (no open gaps), and tactile ground surface indicators at top and bottom.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Stairs without handrails are a significant fall risk, especially for people with balance disorders, neurological conditions, or one-sided weakness. Without contrasting nosing strips, step edges are invisible to people with low vision, creating a trip hazard. Open risers (gaps between steps) catch cane tips and small wheelchair casters. Missing TGSIs leave people who are blind completely unaware of the stair hazard ahead. These four features together make stairs as safe as reasonably possible for all users.',
    statistic: {
      value: '20%',
      context: 'of stair fall injuries in public buildings are directly attributed to absent or inadequate handrails.',
      source: 'Safe Work Australia'
    }
  },

  tips: [
    {
      icon: 'Hand',
      text: 'Continuous handrails on both sides at 865-1000mm height.',
      detail: 'People with one-sided weakness need the handrail on their functional side, which means handrails must be on both sides. Continuous means no breaks at landings. The profile should be circular (30-50mm diameter) for a secure grip.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Contrasting nosing strips on every step: 50mm on tread, 30mm on riser.',
      detail: 'The nosing strip must contrast with both the tread and the riser surface (minimum 30% luminance contrast). This makes each step edge visible for people with low vision. Aluminium or rubber strips in a contrasting colour are most common.',
      priority: 2
    },
    {
      icon: 'Shield',
      text: 'Enclosed risers with no open gaps.',
      detail: 'Open-riser stairs have gaps between the tread and the step below. These gaps catch cane tips, small wheels, and shoe toes. Risers must be enclosed (solid) on all stairs used by the public.',
      priority: 3
    },
    {
      icon: 'Footprints',
      text: 'TGSIs at top and bottom: 300mm setback, 600mm deep.',
      detail: 'Warning TGSIs (raised dots) alert people using canes or feet to the presence of stairs. They must be set back 300mm from the first step nosing and extend 600mm deep across the full stair width.',
      priority: 4
    },
    {
      icon: 'ArrowRight',
      text: 'Handrails extend 300mm horizontally past the top and bottom steps.',
      detail: 'Extensions give users a stable handhold while transitioning from stairs to level ground. The extension must be horizontal, not ramped, and end with a smooth return to the wall or post.',
      priority: 5
    },
    {
      icon: 'CheckCircle',
      text: 'Check and maintain all stair safety features regularly.',
      detail: 'Loose handrails, worn nosing strips, and damaged TGSIs are dangerous. Include stair features in your monthly safety inspection.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing entrance stairs',
    steps: [
      { text: 'Check for handrails on both sides of every staircase. Test stability by pushing and pulling firmly.' },
      {
        text: 'Measure handrail height from the stair nosing.',
        measurement: { target: 'Handrail height', acceptable: '865-1000mm from nosing', unit: 'mm' }
      },
      { text: 'Check for contrasting nosing strips on every step (not just the first and last). Verify contrast by photographing in black and white.' },
      {
        text: 'Measure nosing strip dimensions.',
        measurement: { target: 'Nosing strip', acceptable: '50mm on tread, 30mm on riser face', unit: 'mm' }
      },
      { text: 'Check that all risers are enclosed (no gaps between treads).' },
      { text: 'Check for TGSIs at top and bottom of each staircase. Verify 300mm setback from the first nosing and 600mm depth.' },
      { text: 'Check that handrails extend at least 300mm horizontally past the top and bottom steps.' },
      { text: 'Test TGSI condition: are any loose, worn smooth, or damaged?' }
    ],
    tools: ['Tape measure', 'Camera', 'Spirit level (optional for handrail height consistency)'],
    estimatedTime: '15-20 minutes per staircase'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 9, 11, and 12',
      requirement: 'Stairs on accessible paths of travel must have handrails on both sides (865-1000mm height), contrasting nosing strips, enclosed risers, and handrail extensions of at least 300mm.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies TGSI requirements at stairs including size (300mm setback, 600mm deep), layout, and luminance contrast.' },
      { code: 'NCC', relevance: 'References AS1428.1 stair requirements for all public buildings.' }
    ],
    plainEnglish: 'Stairs at your entrance need handrails on both sides, contrasting strips on every step edge, no open gaps between steps, and textured warning indicators on the ground at the top and bottom.',
    complianceNote: 'Even in existing buildings, adding handrails, nosing strips, and TGSIs is almost always feasible and is considered a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Install handrails on both sides',
      description: 'Add continuous handrails to both sides of entrance stairs with correct height, profile, and extensions.',
      resourceLevel: 'medium',
      costRange: '$800-3,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Engage a metalworker or builder experienced in accessibility handrails.',
        'Specify: circular profile 30-50mm diameter, height 865-1000mm from nosing, continuous with no breaks, 300mm horizontal extensions at top and bottom.',
        'Choose a finish that contrasts with the wall or surroundings for visibility.',
        'Ensure fixings are secure and can support 1100N force (a person\'s full weight pulling sideways).',
        'Check clearance between handrail and wall (60-75mm for adult hand).',
        'Test the completed installation for stability and smooth transitions.'
      ],
      notes: 'Stainless steel is durable and low-maintenance. Powder-coated aluminium is lighter and available in contrasting colours.'
    },
    {
      title: 'Apply nosing strips and close open risers',
      description: 'Add contrasting nosing strips to every step and enclose any open risers.',
      resourceLevel: 'low',
      costRange: '$200-800',
      timeRequired: '1 day',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Purchase aluminium or rubber nosing strips in a colour that contrasts with both the tread and riser (minimum 30% luminance contrast).',
        'Clean step edges thoroughly before applying.',
        'Adhere or screw-fix nosing strips to every step: 50mm on the tread surface, wrapping 30mm down the riser face.',
        'If risers are open (gaps between treads), cut infill panels from plywood, metal, or composite and fix securely to close the gaps.',
        'Check all nosings and infills are secure and do not create new trip hazards.',
        'Inspect monthly and replace any that become loose or worn.'
      ],
      notes: 'Self-adhesive nosing strips are available but screw-fixed strips are more durable in high-traffic areas.'
    },
    {
      title: 'Install TGSIs at top and bottom of stairs',
      description: 'Add tactile ground surface indicators (warning type) at the top and bottom of entrance stairs.',
      resourceLevel: 'low',
      costRange: '$150-500',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Source warning TGSIs (raised dot pattern) that contrast with the surrounding surface (minimum 30% luminance contrast).',
        'Mark the installation area: full width of the stairs, 300mm setback from the first step nosing, 600mm deep.',
        'For concrete or tile surfaces, use adhesive-fixed polyurethane TGSIs or drill-in stainless steel studs.',
        'Ensure the TGSI pattern is consistent with AS1428.4.1 (35mm diameter dots, 50mm centre-to-centre spacing).',
        'Test the installation by walking over it with eyes closed to verify it is detectable underfoot.',
        'Inspect quarterly for loose or worn TGSIs.'
      ],
      notes: 'Stainless steel stud TGSIs are the most durable option for outdoor use. Polyurethane is more affordable but may need more frequent replacement.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had a single handrail on only one side of five entrance steps. A customer with a left-side weakness could not grip it and fell.',
      solution: 'Added a second handrail on the left side, applied nosing strips to all five steps, and installed TGSIs at top and bottom.',
      outcome: 'No further falls reported. The restaurant also avoided potential liability.',
      cost: '$1,200',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A gallery had open-riser steps at the entrance with no nosings or TGSIs. A visitor with low vision missed a step edge and fell.',
      solution: 'Enclosed all risers with metal infill panels, applied yellow nosing strips to every step, and installed stainless steel TGSI studs at top and bottom.',
      outcome: 'The gallery passed its next accessibility audit with full marks for stairs. Insurance assessors also noted the improvement.',
      cost: '$450',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'ABCB Stairway Requirements',
      url: 'https://www.abcb.gov.au/resources/handbook-accessibility',
      type: 'guide',
      source: 'Australian Building Codes Board',
      description: 'NCC and AS1428.1 requirements for stair design including handrails, nosings, and risers.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS1428.4.1 Tactile Ground Surface Indicators',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-4-dot-1-colon-2009',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The standard for TGSI design, placement, and luminance contrast at stairs, ramps, and other hazards.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Vision Australia TGSI Guide',
      url: 'https://www.visionaustralia.org/information/practical-support/home-modifications',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Practical guide to understanding and maintaining TGSIs for people with vision impairment.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'Stairs at the entrance may mean the main entrance is not accessible. An alternative must be provided.', moduleCode: '2.2' },
    { questionId: '2.2-D-27', questionText: 'If there is a ramp, does it have handrails on both sides?', relationship: 'A ramp is the accessible alternative to stairs. Both need handrails.', moduleCode: '2.2' },
    { questionId: '2.3-D-25', questionText: 'Do internal stairs have handrails on both sides?', relationship: 'The same stair safety requirements apply to internal stairs.', moduleCode: '2.3' }
  ],

  keywords: ['stairs', 'handrails', 'nosing strips', 'enclosed risers', 'TGSIs', 'entrance steps', 'stair safety', 'fall prevention', 'grab rails', 'contrast']
},

// ─── Entry 9: Entrance Ramps ───
{
  questionId: '2.2-D-27',
  questionText: 'If there is a ramp, does it have handrails on both sides?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Entrance Ramps',
  coveredQuestionIds: ['2.2-D-28', '2.2-D-29', '2.2-D-30'],
  summary: 'Entrance ramps must have handrails on both sides, a safe gradient, slip-resistant surface, and tactile indicators at top and bottom. A ramp that is too steep or lacks handrails can be more dangerous than stairs.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'A ramp without handrails is dangerous for anyone with balance issues or limited upper body strength. If the gradient is too steep, wheelchair users can lose control descending or cannot ascend without assistance. Wet surfaces on ramps become treacherous without adequate slip resistance. A properly built ramp provides independence for wheelchair users, people with prams, and delivery workers. A poorly built ramp creates a false sense of security and real injury risk.',
    statistic: {
      value: '1:14',
      context: 'is the maximum gradient for new ramps. Steeper gradients require significantly more effort and increase the risk of tipping or losing control.',
      source: 'AS1428.1:2021'
    }
  },

  tips: [
    {
      icon: 'Hand',
      text: 'Continuous handrails on both sides at 865-1000mm height.',
      detail: 'Handrails must be on both sides because people with one-sided weakness need the rail on their functional side. Wheelchair users may need to grab a handrail if they lose momentum going up. Circular profile 30-50mm diameter provides the best grip.',
      priority: 1
    },
    {
      icon: 'TrendingUp',
      text: 'Maximum gradient 1:14 for new ramps (1:8 for short existing ramps under 1900mm).',
      detail: 'A 1:14 gradient means 1m of rise over 14m of length. This is comfortable for most wheelchair users to self-propel. Existing ramps up to 1:8 are tolerated only for very short lengths. Steeper than 1:8 is never acceptable.',
      priority: 2
    },
    {
      icon: 'Maximize',
      text: 'Minimum width 1000mm (1200mm preferred).',
      detail: 'A 1000mm ramp fits a standard wheelchair. 1200mm allows a companion to walk alongside. Wider is always better.',
      priority: 3
    },
    {
      icon: 'Layers',
      text: 'Slip-resistant surface, especially when wet.',
      detail: 'Ramp surfaces must have a P4 slip rating (wet areas) or equivalent. Exposed aggregate concrete, textured rubber, or anti-slip coatings are good options. Test by walking on the ramp in leather-soled shoes when wet.',
      priority: 4
    },
    {
      icon: 'Footprints',
      text: 'TGSIs at top and bottom of the ramp (300mm setback, 600mm deep).',
      detail: 'Warning TGSIs alert people with vision impairment to the change in gradient. They must extend the full width of the ramp.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing entrance ramps',
    steps: [
      { text: 'Check for handrails on both sides. Test stability by pushing and pulling.' },
      {
        text: 'Measure handrail height.',
        measurement: { target: 'Handrail height', acceptable: '865-1000mm from ramp surface', unit: 'mm' }
      },
      {
        text: 'Measure the ramp gradient using a spirit level and tape measure or a digital inclinometer.',
        measurement: { target: 'Gradient', acceptable: 'Maximum 1:14 for new (1:8 for existing short ramps under 1900mm)', unit: 'ratio' }
      },
      {
        text: 'Measure the ramp width.',
        measurement: { target: 'Ramp width', acceptable: 'Minimum 1000mm (1200mm preferred)', unit: 'mm' }
      },
      { text: 'Test surface slip resistance by walking on it in wet conditions. Check for wear, moss, or algae growth.' },
      { text: 'Check for TGSIs at top and bottom of the ramp with correct setback (300mm) and depth (600mm).' },
      { text: 'Check for edge protection (kerb rail or upstand) on both sides if the ramp is elevated.' }
    ],
    tools: ['Tape measure', 'Spirit level or digital inclinometer', 'Camera', 'Water (for wet slip test)'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 10-12',
      requirement: 'Ramps on accessible paths of travel must have handrails on both sides (865-1000mm), maximum gradient 1:14 for new construction, slip-resistant surface, and edge protection.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies TGSI requirements at the top and bottom of ramps.' },
      { code: 'Access-to-Premises', relevance: 'Requires compliant ramps where level changes exist on accessible paths of travel.' }
    ],
    plainEnglish: 'Ramps must have handrails on both sides, a gentle slope (not too steep), a non-slip surface, and textured warning strips at the top and bottom.',
    complianceNote: 'An existing steep ramp may be tolerated for short distances but should be upgraded to 1:14 or gentler when any renovation occurs.'
  },

  solutions: [
    {
      title: 'Install handrails and TGSIs on an existing ramp',
      description: 'Add the essential safety features to an existing ramp that has the correct gradient but lacks handrails and tactile indicators.',
      resourceLevel: 'medium',
      costRange: '$1,000-4,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Verify the existing gradient is 1:14 or gentler. If steeper, the ramp may need reconstruction rather than just adding handrails.',
        'Engage a metalworker to fabricate and install handrails on both sides: circular profile 30-50mm, height 865-1000mm, with 300mm horizontal extensions at top and bottom.',
        'Add edge protection (kerb rail or 75mm upstand) if the ramp has open sides.',
        'Install warning TGSIs at top and bottom: 300mm setback from the ramp transition, 600mm deep, full width.',
        'Check surface slip resistance. Apply anti-slip coating if below P4 rating.',
        'Test the completed installation by wheelchair user or simulation.'
      ],
      notes: 'Budget for both sides of handrails in your cost estimate. Single-side handrails are non-compliant.'
    },
    {
      title: 'Improve surface slip resistance',
      description: 'Apply anti-slip treatments to an existing ramp surface to prevent falls in wet conditions.',
      resourceLevel: 'low',
      costRange: '$200-800',
      timeRequired: '1 day',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Clean the ramp surface thoroughly, removing moss, algae, and dirt.',
        'Apply an anti-slip coating suitable for the ramp material (concrete, metal, timber). Products are available in spray or roll-on application.',
        'For metal ramps, consider bonding non-slip rubber strips or fiberglass grating.',
        'Allow full curing time before reopening (typically 24 hours).',
        'Test in wet conditions after curing.',
        'Schedule re-application annually or when wear becomes visible.'
      ],
      notes: 'Anti-slip treatments are a maintenance item and need regular re-application, especially on high-traffic ramps.'
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Motel',
      scenario: 'A motel had a ramp to the entrance with a handrail on only one side and no TGSIs. A guest with right-sided weakness could not use the handrail.',
      solution: 'Installed a second handrail on the left side and added edge protection. Installed stainless steel TGSI studs at top and bottom.',
      outcome: 'The motel passed its accessibility audit and added "ramp with handrails" to its website accessibility information.',
      cost: '$1,800',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Library',
      scenario: 'A public library had a 10-year-old ramp that had become slippery due to moss growth and worn surface.',
      solution: 'Pressure-washed the surface, applied anti-slip coating, and installed new TGSIs to replace the worn originals.',
      outcome: 'The ramp is now safe in wet conditions. The library added it to their quarterly maintenance schedule.',
      cost: '$400',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Ramp Requirements',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Full requirements for ramp design including gradient, width, handrails, landings, and edge protection.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AHRC Building Accessible Ramps Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guide to ramp design and construction for accessibility, with worked examples.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-D-23', questionText: 'If there are stairs or steps at the entrance, do they have handrails or grab rails on both sides?', relationship: 'A ramp is the accessible alternative to stairs; both need handrails.', moduleCode: '2.2' },
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'A ramp is often the key feature enabling an accessible entrance.', moduleCode: '2.2' },
    { questionId: '2.3-D-14', questionText: 'Where there are internal ramps, do they have handrails on both sides?', relationship: 'Internal ramps have the same handrail requirements.', moduleCode: '2.3' }
  ],

  keywords: ['ramp', 'handrails', 'gradient', 'slope', 'TGSIs', 'slip resistance', 'edge protection', 'ramp safety', 'P4 rating']
},

// ─── Entry 10: Entrance Lifts and Escalators ───
{
  questionId: '2.2-D-31',
  questionText: 'Is the entrance lift large enough for a wheelchair user, with at least a 900mm door?',
  moduleCode: '2.2',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Entrance Lifts and Escalators',
  coveredQuestionIds: ['2.2-D-32', '2.2-D-33'],
  summary: 'Where the entrance involves a level change served by a lift or escalator, the lift must be large enough for wheelchairs, operable independently, and there must be an accessible alternative to any escalator.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'For wheelchair users and many others, the lift is the only way to reach another level. If the lift is too small, has controls that cannot be reached from a wheelchair, or requires staff to operate, independence is lost. Escalators are not accessible to most people with disability, including wheelchair users, people with balance disorders, people with vision impairment, and many older people. Every escalator must have a nearby lift or ramp as an alternative.',
    statistic: {
      value: '1.4 million',
      context: 'Australians use mobility aids. For them, a lift is not a convenience but the only option for changing levels.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'Maximize',
      text: 'Lift car minimum 1100mm wide x 1400mm deep, with a 900mm door.',
      detail: 'These dimensions accommodate a standard wheelchair with room for a companion or assistance animal. Larger lifts (1600mm x 1400mm) are better for powered wheelchairs and scooters.',
      priority: 1
    },
    {
      icon: 'Hand',
      text: 'Controls at 900-1100mm height with Braille and tactile numbers.',
      detail: 'Controls must be reachable from a wheelchair and identifiable by touch. Each button should have a raised number and Braille beside it. Emergency controls should also be within reach.',
      priority: 2
    },
    {
      icon: 'Volume2',
      text: 'Audible and visual floor indicators.',
      detail: 'Audible announcements tell people with vision impairment which floor they have reached. Visual displays tell people who are Deaf which floor is approaching. Both are essential.',
      priority: 3
    },
    {
      icon: 'Users',
      text: 'Lift must be operable independently without requiring staff assistance.',
      detail: 'If the lift requires a key, a code, or staff to operate, independence is compromised. If a key is unavoidable (e.g. for security), provide an accessible intercom at the lift so users can request activation.',
      priority: 4
    },
    {
      icon: 'ArrowUp',
      text: 'Provide an accessible alternative to every escalator.',
      detail: 'The alternative (lift or ramp) must be clearly signed at the escalator with the ISA symbol and direction. It must be available during all operating hours.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing entrance lifts and escalators',
    steps: [
      {
        text: 'Measure the lift car interior dimensions.',
        measurement: { target: 'Lift car size', acceptable: 'Minimum 1100mm wide x 1400mm deep', unit: 'mm' }
      },
      {
        text: 'Measure the lift door width.',
        measurement: { target: 'Lift door width', acceptable: 'Minimum 900mm', unit: 'mm' }
      },
      {
        text: 'Check control panel height (lowest and highest buttons).',
        measurement: { target: 'Control panel', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      { text: 'Check for Braille and raised tactile numbers beside each control button.' },
      { text: 'Test audible floor announcements by riding the lift with eyes closed.' },
      { text: 'Check whether the lift can be operated independently without a key or staff assistance.' },
      { text: 'At each escalator, check for a signed accessible alternative (lift or ramp) within visible distance.' }
    ],
    tools: ['Tape measure', 'Camera', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'Passenger lifts on accessible paths of travel must meet minimum car dimensions, door width, control height, Braille/tactile marking, and audible/visual indicator requirements.'
    },
    related: [
      { code: 'NCC', relevance: 'References AS1735.12 for lift installation requirements and AS1428.1 for accessible lift features.' },
      { code: 'DDA', relevance: 'Requires reasonable adjustments to lift access even in existing buildings.' }
    ],
    plainEnglish: 'Lifts must be big enough for a wheelchair, have reachable controls with Braille, announce floors by voice and display, and work without needing staff help. Escalators must always have a lift or ramp alternative.',
    complianceNote: 'Upgrading an existing lift with Braille panels, audio announcements, and a mirror is often much cheaper than replacing the entire lift.'
  },

  solutions: [
    {
      title: 'Upgrade existing lift with accessible features',
      description: 'Add Braille markers, tactile buttons, audio announcements, a lower control panel, and a rear-wall mirror to an existing lift.',
      resourceLevel: 'medium',
      costRange: '$1,000-4,000',
      timeRequired: '1-3 days',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a lift servicing company to assess the existing lift for upgrade potential.',
        'Install a secondary control panel at 900-1100mm height if the current panel is too high.',
        'Add Braille labels and raised tactile numbers beside each button.',
        'Install an audio announcement module if the lift does not already have one.',
        'Install a rear-wall mirror (bottom edge at 900mm, top edge at 1800mm) so wheelchair users can see the door behind them.',
        'Test all upgrades with a wheelchair user or from a seated position.',
        'Update the lift maintenance contract to include the new features.'
      ],
      notes: 'Some older lifts may not support audio modules. In that case, a simple Braille floor indicator at the door frame is a partial alternative.'
    },
    {
      title: 'Install a platform lift for short level changes',
      description: 'Where a full passenger lift is not feasible, install a vertical platform lift to bridge level changes of up to 3m.',
      resourceLevel: 'high',
      costRange: '$10,000-25,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant or architect to assess the site for a platform lift.',
        'Specify minimum platform size of 1100mm x 1400mm with 900mm clear door opening.',
        'Choose between enclosed shaft (for weather exposure) or open platform (for indoor short rises).',
        'Obtain building permits and any heritage approvals.',
        'Engage a licensed lift installer to supply and install the unit.',
        'Commission with a compliance audit including weight test and emergency stop.',
        'Ensure the lift can be operated independently (push-button control, not key-operated).',
        'Schedule regular servicing (typically every 3-6 months).'
      ],
      notes: 'Platform lifts are increasingly affordable and compact. They can be installed in many locations where a full shaft lift is impossible.'
    }
  ],

  examples: [
    {
      businessType: 'retail',
      businessTypeLabel: 'Department Store',
      scenario: 'A department store had a 1990s lift with high control buttons (1400mm), no Braille, no audio, and no mirror. Wheelchair users could not reach the top buttons and did not know which floor they had reached.',
      solution: 'Installed a lower secondary panel at 1000mm, added Braille and tactile labels to all buttons, fitted an audio announcement module, and installed a rear-wall mirror.',
      outcome: 'Wheelchair users can now operate the lift independently. The upgrades also helped parents with prams and people carrying heavy bags.',
      cost: '$3,200',
      timeframe: '2 days'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Venue',
      scenario: 'A heritage venue had a mezzanine level accessible only by escalator. Wheelchair users and many older patrons could not access the upper bar and viewing area.',
      solution: 'Installed a vertical platform lift beside the escalator with push-button controls, Braille, and clear signage.',
      outcome: 'The mezzanine is now accessible to all patrons. The venue can host wheelchair-accessible functions on the upper level for the first time.',
      cost: '$18,000',
      timeframe: '3 weeks'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Section 15: Lifts',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Requirements for accessible lift design including dimensions, controls, indicators, and emergency features.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AND Lift Accessibility Checklist',
      url: 'https://www.and.org.au/resources/',
      type: 'checklist',
      source: 'Australian Network on Disability',
      description: 'Checklist for auditing lift accessibility covering dimensions, controls, Braille, audio, and visual features.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.3-D-16', questionText: 'If your venue has a lift, does it have accessible features?', relationship: 'Internal lifts have the same accessibility requirements as entrance lifts.', moduleCode: '2.3' },
    { questionId: '2.2-F-1', questionText: 'Is there an accessible entrance to your venue?', relationship: 'A lift may be the key feature that makes a level-change entrance accessible.', moduleCode: '2.2' }
  ],

  keywords: ['lift', 'elevator', 'escalator', 'wheelchair', 'Braille', 'controls', 'independent', 'platform lift', 'audio', 'mirror']
},

// ─── Entry 11: Internal Wayfinding and Signage ───
{
  questionId: '2.3-D-5',
  questionText: 'Is there clear wayfinding signage to key destinations within your venue?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'information-communication-marketing',
  title: 'Internal Wayfinding and Signage',
  coveredQuestionIds: ['2.3-D-6', '2.3-D-7', '2.3-D-8', '2.3-D-9', '2.3-D-10'],
  summary: 'Comprehensive internal wayfinding covering directional signs at decision points, sign height for seated users, floor plans for complex venues, high-contrast readable text, tactile and auditory options, and clear identification of accessible routes.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Visitors who cannot find their way become frustrated, anxious, or leave early. For wheelchair users, getting lost means wasted energy on a potentially long detour. For people with vision impairment, wayfinding relies on tactile markers, Braille, and auditory cues that are often absent. For people with cognitive disabilities, complex layouts without clear signage create confusion and distress. Good wayfinding helps everyone, including first-time visitors, tourists, and people in a hurry.',
    statistic: {
      value: '60%',
      context: 'of first-time visitors to complex venues report difficulty finding key destinations such as toilets, lifts, and reception.',
      source: 'Centre for Inclusive Design'
    }
  },

  tips: [
    {
      icon: 'Signpost',
      text: 'Install directional signs at every decision point with text and symbols.',
      detail: 'A decision point is any location where a visitor must choose a direction: intersections, junctions, stairwell entries, and lift lobbies. Signs should show the destination name, an arrow, and any relevant symbol (ISA for accessible facilities).',
      priority: 1
    },
    {
      icon: 'Ruler',
      text: 'Mount signs at 1200-1600mm height for seated and standing users.',
      detail: 'Signs above 1600mm are out of the natural sightline for wheelchair users and children. Signs below 1200mm may be obscured by furniture or other people.',
      priority: 2
    },
    {
      icon: 'MapPin',
      text: 'Provide floor plans for complex venues with "You Are Here" markers and ISA symbols.',
      detail: 'Floor plans should be displayed at each entrance and at major decision points. Mark the viewer\'s current location, accessible toilets, lifts, exits, and key destinations. Use high-contrast colours and minimum 12pt text.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Minimum 30% luminance contrast, sans-serif fonts, no italics.',
      detail: 'High contrast means dark text on light background or vice versa. Sans-serif fonts (Arial, Helvetica, Verdana) are easier to read for people with dyslexia and low vision. Avoid italic, script, and decorative fonts.',
      priority: 4
    },
    {
      icon: 'Footprints',
      text: 'Add tactile and Braille signs for people with vision impairment.',
      detail: 'Tactile signs with raised text and Braille allow people who are blind to identify rooms and facilities by touch. Install at 1200-1600mm height on the wall beside the door (on the latch side).',
      priority: 5
    },
    {
      icon: 'ArrowRight',
      text: 'Mark accessible routes distinctly from non-accessible routes.',
      detail: 'Where a venue has both stairs and lifts, or accessible and non-accessible paths, signs must clearly distinguish the accessible option with the ISA symbol.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing internal wayfinding',
    steps: [
      { text: 'Walk from the entrance to each key destination (reception, toilets, lifts, main service area). Count every unsigned decision point.' },
      {
        text: 'Check sign mounting heights.',
        measurement: { target: 'Sign height', acceptable: '1200-1600mm from floor', unit: 'mm' }
      },
      { text: 'Check whether floor plans are displayed at entrances and major decision points in complex venues.' },
      { text: 'Check contrast and font readability on every sign. Photograph in black and white to assess contrast.' },
      { text: 'Check for tactile and Braille signs at key rooms and facilities.' },
      { text: 'Check whether accessible routes are marked with the ISA symbol where an alternative non-accessible route exists.' },
      { text: 'Ask a first-time visitor (or a staff member from a different area) to navigate to three destinations using only the signage. Note any hesitation or wrong turns.' }
    ],
    tools: ['Camera', 'Tape measure', 'Notepad', 'First-time visitor for navigation test'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 8',
      requirement: 'Signage on accessible paths of travel must include the ISA where relevant, have adequate luminance contrast, and be located at decision points.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires identification of accessible facilities through signage in all new and significantly renovated buildings.' },
      { code: 'DDA', relevance: 'Requires that information be provided in accessible formats, which extends to wayfinding signage.' }
    ],
    plainEnglish: 'Signs must appear at every place where visitors need to choose a direction. They must be high-contrast, at a readable height, and include tactile options for people with vision impairment. Accessible routes must be clearly identified.',
    complianceNote: 'Signage improvements are among the most affordable accessibility upgrades and benefit all visitors. They are almost always considered a reasonable adjustment.'
  },

  solutions: [
    {
      title: 'Relocate and add directional signs',
      description: 'Move signs that are too high or poorly positioned, and add new signs at unsigned decision points.',
      resourceLevel: 'low',
      costRange: '$0-200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Map your venue showing all decision points and current sign locations.',
        'Identify gaps: decision points with no sign, or signs mounted above 1600mm.',
        'Lower high-mounted signs to 1200-1600mm range.',
        'Create simple directional signs for unsigned decision points (printed, laminated, and mounted).',
        'Use the ISA symbol on signs pointing to accessible toilets, lifts, and routes.',
        'Test the updated signage with a first-time visitor.'
      ],
      notes: 'Even printed and laminated signs are effective while you plan for professional signage.'
    },
    {
      title: 'Create and display venue floor plans',
      description: 'Design high-contrast floor plans with "You Are Here" markers and install at key locations throughout the venue.',
      resourceLevel: 'medium',
      costRange: '$50-3,000',
      timeRequired: '1-3 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Create a simplified floor plan showing: walls, doors, corridors, lifts, stairs, toilets, exits, reception, and key destinations.',
        'Mark all accessible features with the ISA symbol: accessible toilets, lifts, ramps, and accessible routes.',
        'Add "You Are Here" markers specific to each display location.',
        'Use high-contrast colours (dark lines on white background or white on dark blue).',
        'Print at A3 or larger size and frame or mount behind acrylic at 1200-1600mm height.',
        'Install at each entrance and at major intersections within the venue.',
        'Update whenever the layout changes.'
      ],
      notes: 'DIY floor plans can be created in PowerPoint or Canva for $0-50. Professional wayfinding design firms charge $800-3,000 but produce a more polished result.'
    },
    {
      title: 'Add tactile and Braille signs at key locations',
      description: 'Install tactile room signs with raised text and Braille at key facilities for visitors with vision impairment.',
      resourceLevel: 'medium',
      costRange: '$300-1,500',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify key locations requiring tactile signs: toilets, lifts, reception, exits, meeting rooms.',
        'Order tactile signs with raised text (minimum 15mm high, sans-serif) and Grade 2 Braille. Specialist signage companies produce these.',
        'Mount signs on the wall beside the door, on the latch side, at 1200-1600mm height.',
        'Ensure a clear approach space in front of each sign (no obstructions within 300mm).',
        'For lift landings, install tactile floor numbers on the wall beside the lift door.',
        'Test with a person who uses Braille if possible.'
      ],
      notes: 'Tactile signs are relatively inexpensive (typically $30-80 each) and make a significant difference for visitors who are blind or have low vision.'
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel with 200 rooms had room number signs mounted at 1800mm (above most people\'s eye level) with small serif font and no Braille. Guests with vision impairment could not find their rooms.',
      solution: 'Replaced all room signs with tactile signs at 1500mm featuring raised numbers, Braille, and high-contrast sans-serif text. Added directional signs at each corridor intersection.',
      outcome: 'Guest satisfaction scores for wayfinding improved from 3.2 to 4.6 out of 5. The hotel received positive reviews from vision-impaired guests.',
      cost: '$2,400',
      timeframe: '2 days installation'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre had no floor plans and minimal signage. First-time delegates frequently got lost navigating between rooms.',
      solution: 'Designed colour-coded floor plans displayed at every entrance and major intersection, with "You Are Here" markers and ISA symbols. Added consistent directional signs at every decision point.',
      outcome: 'Requests for directions at reception dropped by 70%. Event organisers reported smoother attendee flow.',
      cost: '$1,500',
      timeframe: '1 week'
    }
  ],

  resources: [
    {
      title: 'AND Sign Design Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide to accessible sign design including contrast, font, tactile elements, and Braille.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS1428.1 Section 8: Signage',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Requirements for signage on accessible paths of travel.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Centre for Inclusive Design Wayfinding Guide',
      url: 'https://centreforinclusivedesign.org.au/resources/',
      type: 'guide',
      source: 'Centre for Inclusive Design',
      description: 'Research-based guide to inclusive wayfinding design for public buildings and spaces.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-4', questionText: 'Is the main entrance clearly visible and identifiable as you approach the venue?', relationship: 'Internal wayfinding begins where external wayfinding ends, at the entrance.', moduleCode: '2.2' },
    { questionId: '2.1-F-6', questionText: 'Is there directional signage on the road approach directing visitors to accessible parking?', relationship: 'External and internal wayfinding should be a seamless system.', moduleCode: '2.1' },
    { questionId: '2.3-D-18', questionText: 'Are internal doors easy to open for people with limited hand strength or dexterity?', relationship: 'Wayfinding signs should indicate which doors are on the accessible route.', moduleCode: '2.3' }
  ],

  keywords: ['wayfinding', 'signage', 'directions', 'floor plan', 'contrast', 'Braille', 'tactile', 'accessible routes', 'decision points', 'ISA symbol']
},

// ─── Entry 12: Floor Surfaces and Maintenance ───
{
  questionId: '2.3-D-11',
  questionText: 'Are floor surfaces slip-resistant, especially in areas that may get wet?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Floor Surfaces and Maintenance',
  coveredQuestionIds: ['2.3-D-15', '2.3-D-23', '2.3-D-24'],
  summary: 'Covers floor surface safety: slip resistance (especially in wet areas), visual contrast at level changes, contrast between floors, doors, and walls for low vision, and ongoing maintenance to prevent trip hazards.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Falls are the leading cause of injury in public places. Slippery floors, hidden level changes, and poorly maintained surfaces create serious risks for everyone, but especially for people with mobility impairment, balance disorders, or vision impairment. For people with low vision, floors that blend into walls and doors that disappear into frames make navigation dangerous. Regular maintenance prevents minor defects from becoming major hazards.',
    statistic: {
      value: '36%',
      context: 'of serious workplace injuries are caused by slips, trips, and falls. The rate is even higher in public venues where visitors are unfamiliar with the environment.',
      source: 'Safe Work Australia'
    }
  },

  tips: [
    {
      icon: 'Layers',
      text: 'P3 slip rating for dry areas, P4 for areas that may get wet.',
      detail: 'The P rating system classifies floor surfaces by slip resistance. P3 is adequate for indoor dry areas. P4 or P5 is needed for entrance zones, kitchens, bathrooms, and any area that may get wet from rain, spills, or cleaning.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Contrasting nosing strips at all level changes (minimum 30% luminance contrast).',
      detail: 'Every step, ramp transition, or platform edge should have a visible strip that contrasts with the surrounding surface. This makes the level change visible to people with low vision.',
      priority: 2
    },
    {
      icon: 'Layers',
      text: 'Floors must contrast with walls; doors must contrast with frames.',
      detail: 'When the floor blends into the wall, people with low vision cannot judge distances or see where the floor ends. When doors blend into surrounding walls, they become invisible. Aim for at least 30% luminance contrast.',
      priority: 3
    },
    {
      icon: 'CheckCircle',
      text: 'Conduct a monthly walk-through to identify and repair defects.',
      detail: 'Cracks, lifted carpet edges, loose tiles, worn transitions, and pooling water should be identified and fixed before they cause an injury.',
      priority: 4
    },
    {
      icon: 'Ruler',
      text: 'Repair any level change exceeding 5mm.',
      detail: 'A 5mm lip between surfaces can catch a wheelchair caster or trip someone with reduced foot lift. Use transition strips, grinding, or patching to eliminate level changes.',
      priority: 5
    },
    {
      icon: 'Shield',
      text: 'Secure all carpet edges and transition strips.',
      detail: 'Loose carpet edges are one of the most common trip hazards. Use metal transition strips or adhesive to secure every edge, especially at doorways and where carpet meets hard floor.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing floor surfaces and maintenance',
    steps: [
      { text: 'Walk every public area checking floor surfaces for slip resistance, especially in entrance zones, corridors, and areas near water sources.' },
      { text: 'Check for nosing strips at all steps, ramp transitions, and platform edges. Photograph any level changes without contrast treatment.' },
      { text: 'Assess floor/wall contrast: can you clearly see where the floor ends and the wall begins? Check doors against their frames.' },
      { text: 'Inspect for cracks, lifted carpet, loose tiles, worn transitions, and any defects that could cause a trip.' },
      {
        text: 'Measure any level changes between adjacent surfaces.',
        measurement: { target: 'Surface transitions', acceptable: 'Maximum 5mm', unit: 'mm' }
      },
      { text: 'Check that all transition strips are secure and not raised above the adjacent surface.' },
      { text: 'Pour a small amount of water on the floor in the entrance zone and test slip resistance by walking on it in shoes.' }
    ],
    tools: ['Tape measure', 'Camera', 'Small amount of water for slip test', 'Notepad'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 7 and 9',
      requirement: 'Floor surfaces on accessible paths of travel must be firm, slip-resistant, and free of trip hazards. Level changes must have contrasting nosing strips.'
    },
    related: [
      { code: 'NCC', relevance: 'References AS4586 for slip resistance classification of floor surfaces in public buildings.' },
      { code: 'DDA', relevance: 'Maintaining safe floor surfaces is a duty of care that applies to all premises regardless of age.' }
    ],
    plainEnglish: 'Floors must not be slippery, especially when wet. Every step or level change needs a visible contrast strip. Floors should look different from walls, and doors should stand out from their frames. Keep everything in good repair.',
    complianceNote: 'Floor maintenance is a general duty of care under workplace health and safety law as well as the DDA. Failure to maintain safe floors can result in both injury claims and discrimination complaints.'
  },

  solutions: [
    {
      title: 'Apply anti-slip treatment to smooth floors',
      description: 'Apply anti-slip coatings or treatments to floors that are slippery, especially in entrance zones and areas that get wet.',
      resourceLevel: 'low',
      costRange: '$300-1,500',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify all areas with smooth or potentially slippery floor surfaces, especially entrance zones, corridors near external doors, and areas near water.',
        'Engage a floor treatment contractor to apply anti-slip coating (chemical etch for tiles, polyurethane with grit for concrete, anti-slip strips for metal).',
        'Ensure the treatment achieves at least P3 (dry) or P4 (wet) slip resistance.',
        'Install recessed mat wells at entrances to capture water before it reaches the main floor.',
        'Allow full curing time before opening to foot traffic.',
        'Schedule re-application based on the manufacturer\'s recommendation (typically annually for high-traffic areas).'
      ],
      notes: 'Chemical etch treatments are invisible and do not change the appearance of tiles but need re-application.'
    },
    {
      title: 'Apply nosing strips to all level changes',
      description: 'Install contrasting nosing strips on every step, ramp transition, and platform edge throughout the venue.',
      resourceLevel: 'low',
      costRange: '$100-600',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify every level change in the venue: steps, ramp transitions, raised platforms, and sunken areas.',
        'Purchase nosing strips in a colour that contrasts with the floor surface (minimum 30% luminance contrast).',
        'Clean the surface and apply nosing strips: 50mm on the tread, wrapping 30mm down the riser face for steps.',
        'For ramp transitions and platform edges, apply a 50mm contrasting strip along the full edge.',
        'Check all strips are firmly adhered and do not create a new trip hazard.',
        'Inspect monthly and replace any that are lifting or worn.'
      ],
      notes: 'Aluminium nosing strips with carborundum inserts are the most durable option for high-traffic areas.'
    },
    {
      title: 'Establish a floor maintenance schedule',
      description: 'Create a systematic maintenance program to identify and repair floor defects before they become hazards.',
      resourceLevel: 'low',
      costRange: '$100-1,000 per year',
      timeRequired: 'Ongoing (30 minutes monthly)',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Create a floor inspection checklist covering: slip resistance, carpet edges, transition strips, cracks, level changes, nosing strips, and wet areas.',
        'Assign a staff member to conduct a monthly walk-through using the checklist.',
        'Photograph and record any defects found.',
        'Prioritise repairs: immediate for trip hazards over 5mm, within one week for lifted carpet edges, within one month for worn nosing strips.',
        'Engage a contractor for repairs beyond staff capability.',
        'Review the inspection log quarterly to identify recurring issues.'
      ],
      notes: 'A simple paper or digital checklist is sufficient. The key is consistency, not complexity.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had polished concrete floors in the entrance zone that became dangerously slippery when customers walked in with wet shoes during rain.',
      solution: 'Applied a chemical anti-slip etch to the entrance zone (3m x 2m) and installed a recessed coir mat well just inside the door.',
      outcome: 'No further slip incidents. The treatment is invisible and did not change the polished concrete appearance.',
      cost: '$750',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A gallery had two internal steps between exhibition rooms with no nosing strips. A visitor with low vision missed the steps and fell.',
      solution: 'Applied bright yellow aluminium nosing strips to both steps and added warning TGSIs at the top.',
      outcome: 'The steps are now clearly visible from a distance. The gallery added step warnings to their accessibility guide.',
      cost: '$85',
      timeframe: '1 hour'
    }
  ],

  resources: [
    {
      title: 'AS4586 Slip Resistance Classification',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/bd-091/as--4586-colon-2013',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Classification system for slip resistance of new pedestrian surface materials, including P rating definitions.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Safe Work Australia Slips, Trips and Falls Guide',
      url: 'https://www.safeworkaustralia.gov.au/safety-topic/hazards/slips-trips-and-falls',
      type: 'guide',
      source: 'Safe Work Australia',
      description: 'Comprehensive guide to preventing slips, trips, and falls in workplaces, including floor surface maintenance.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Vision Australia Contrast Guide',
      url: 'https://www.visionaustralia.org/information/practical-support',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Guide to luminance contrast for wayfinding and safety, including floor/wall and door/frame contrast.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.3-D-12', questionText: 'Is there adequate lighting throughout circulation paths?', relationship: 'Good lighting is essential for seeing floor hazards and contrast markings.', moduleCode: '2.3' },
    { questionId: '2.3-D-25', questionText: 'Do internal stairs have handrails on both sides?', relationship: 'Steps are a floor-level hazard that needs both nosing strips and handrails.', moduleCode: '2.3' },
    { questionId: '2.1-F-4', questionText: 'Is the path from accessible parking to the entrance smooth and level?', relationship: 'External path surfaces need the same slip resistance and maintenance attention.', moduleCode: '2.1' }
  ],

  keywords: ['slip resistant', 'floor', 'contrast', 'nosing strips', 'trip hazard', 'maintenance', 'level change', 'P rating', 'wet areas', 'carpet', 'transition strip']
},

// ─── Entry 13: Circulation Paths and Rest Points ───
{
  questionId: '2.3-D-12',
  questionText: 'Is there adequate lighting throughout circulation paths?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Circulation Paths and Rest Points',
  coveredQuestionIds: ['2.3-D-13', '2.3-D-20', '2.3-D-21'],
  summary: 'Internal circulation paths must be well-lit, wide enough for wheelchairs to pass, have adequate overhead clearance, and provide rest points along longer routes.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Poor lighting makes obstacles invisible and creates anxiety, particularly for people with low vision. Narrow paths block wheelchair access entirely and prevent two people from passing. Low overhead objects are dangerous for people with vision impairment who cannot see obstructions above cane height. Lack of rest points along longer routes excludes people with fatigue conditions, chronic pain, respiratory conditions, and many older people. These four elements together determine whether someone can move through your venue safely and comfortably.',
    statistic: {
      value: '80%',
      context: 'of the information we use for wayfinding is visual. Poor lighting reduces this to a fraction, making navigation difficult for everyone and dangerous for people with low vision.',
      source: 'Centre for Inclusive Design'
    }
  },

  tips: [
    {
      icon: 'Sun',
      text: 'Minimum 160 lux in corridors, 240 lux in circulation and service areas.',
      detail: 'Light levels should be measured at floor level. Common areas where people need to read signs, menus, or tickets should have higher levels (300+ lux). Avoid harsh bright-to-dark transitions which temporarily blind people moving between zones.',
      priority: 1
    },
    {
      icon: 'Maximize',
      text: 'Minimum 1000mm width (1500mm for two-way paths).',
      detail: 'At 1000mm, one wheelchair can pass. At 1200mm, a wheelchair and an ambulant person can pass. At 1500mm, two wheelchairs can pass. Narrower than 1000mm is a complete barrier.',
      priority: 2
    },
    {
      icon: 'ArrowUp',
      text: 'Maintain 2000mm overhead clearance throughout all paths.',
      detail: 'Anything below 2000mm is a head-strike hazard for people with vision impairment who cannot detect overhanging objects with a cane. Under-stair areas, low signs, hanging displays, and open windows are common offenders.',
      priority: 3
    },
    {
      icon: 'Square',
      text: 'Provide rest seating every 20m on longer routes (with armrests).',
      detail: 'Seats should have armrests and backrests to assist people who need help standing up. Position them off the main path so they do not obstruct circulation. Include at least one seat without armrests for people who need to transfer from a wheelchair.',
      priority: 4
    },
    {
      icon: 'Eye',
      text: 'Avoid harsh bright-to-dark transitions between zones.',
      detail: 'Moving from a brightly lit space into a dark corridor (or vice versa) temporarily blinds everyone and is especially disorienting for people with low vision. Use transitional lighting zones to ease the change.',
      priority: 5
    },
    {
      icon: 'ArrowRight',
      text: 'Plan passing spaces every 20m on narrow paths.',
      detail: 'Where paths cannot be widened to 1500mm, create passing bays (1800mm x 2000mm) at regular intervals so two wheelchairs or a wheelchair and a pram can pass.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing circulation paths and rest points',
    steps: [
      {
        text: 'Measure lighting levels at floor level along all circulation paths.',
        measurement: { target: 'Corridor lighting', acceptable: 'Minimum 160 lux (240 lux in circulation areas)', unit: 'lux' }
      },
      {
        text: 'Measure path widths at the narrowest points (including where furniture or displays encroach).',
        measurement: { target: 'Path width', acceptable: 'Minimum 1000mm (1500mm for two-way)', unit: 'mm' }
      },
      {
        text: 'Check overhead clearance along all paths.',
        measurement: { target: 'Overhead clearance', acceptable: 'Minimum 2000mm', unit: 'mm' }
      },
      { text: 'Check for rest seating along routes longer than 20m. Verify that seats have armrests and backrests.' },
      { text: 'Walk from the brightest area to the darkest area and note any harsh transitions.' },
      { text: 'Check for passing spaces on paths narrower than 1500mm.' }
    ],
    tools: ['Lux meter or smartphone app', 'Tape measure', 'Camera'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 7',
      requirement: 'Continuous accessible paths of travel must have minimum 1000mm width, minimum 2000mm overhead clearance, and be free of obstructions.'
    },
    related: [
      { code: 'NCC', relevance: 'References AS1680.1 for minimum illumination levels in public building circulation areas.' },
      { code: 'Access-to-Premises', relevance: 'Requires continuous accessible paths of travel within buildings with compliant dimensions and clearances.' }
    ],
    plainEnglish: 'Paths through your venue must be wide enough for a wheelchair, well-lit so people can see obstacles and signs, clear of low-hanging objects, and have places to sit and rest on longer routes.',
    complianceNote: 'Path width and lighting are both building code requirements and DDA obligations. Temporary obstructions (furniture, displays, stock) that reduce path width below 1000mm create an immediate barrier.'
  },

  solutions: [
    {
      title: 'Upgrade lighting in dim areas',
      description: 'Improve lighting levels in corridors and circulation areas that fall below minimum requirements.',
      resourceLevel: 'low',
      costRange: '$200-1,500',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Measure light levels at floor level every 5m along all circulation paths using a lux meter.',
        'Identify areas below 160 lux (corridors) or 240 lux (circulation areas).',
        'Replace existing bulbs with higher-output LED equivalents where possible (often free if bulbs need replacing anyway).',
        'Install additional fixtures in dark spots. LED panel lights, downlights, or wall washers are effective options.',
        'Eliminate harsh bright-to-dark transitions by adding intermediate lighting in transition zones.',
        'Test the result with a lux meter to confirm minimum levels are achieved.'
      ],
      notes: 'LED upgrades often pay for themselves through energy savings within 1-2 years.'
    },
    {
      title: 'Add rest seating and widen narrow points',
      description: 'Install rest seating along longer routes and widen or create passing spaces at narrow points.',
      resourceLevel: 'medium',
      costRange: '$300-2,000',
      timeRequired: '1-3 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Identify all routes longer than 20m and mark locations for rest seating at 20m intervals.',
        'Source bench seats with armrests and backrests. Commercial-grade indoor benches are available for $150-500 each.',
        'Position seats in alcoves or recessed areas where they do not narrow the path below 1000mm.',
        'At narrow points (under 1500mm), check whether furniture, displays, or fixtures can be moved to widen the path.',
        'Where widening is not possible, create passing bays (1800mm x 2000mm) at intervals of no more than 20m.',
        'Mark passing bays with floor markings if they are not visually obvious.'
      ],
      notes: 'Rest seating benefits far more people than just wheelchair users. Parents, older visitors, pregnant women, and people recovering from surgery all benefit.'
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel had a long corridor from the lobby to the restaurant with lighting levels of only 60 lux and no rest seating. Guests with low vision found it disorienting and guests with mobility difficulties found it exhausting.',
      solution: 'Upgraded corridor lighting to 200 lux with LED downlights and added two bench seats with armrests at equal intervals along the 40m corridor.',
      outcome: 'Guest complaints about the dark corridor stopped. The benches are used frequently by all guests.',
      cost: '$2,800',
      timeframe: '2 days'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A gallery had a 25m gallery corridor between exhibition rooms with no seating. Visitors with fatigue conditions had to complete the entire walk without rest.',
      solution: 'Added a gallery bench (without armrests, to also allow wheelchair users to sit beside companions) at the midpoint of the corridor.',
      outcome: 'Visitors with chronic conditions reported being able to view the full exhibition for the first time. The bench also became a popular spot for visitors to sketch.',
      cost: '$350',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'AS1680.1 Interior Lighting',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/electrotechnology/lt-011/as-slash-nzs--1680-dot-1-colon-2006',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Minimum illumination levels for different areas within public buildings.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Vision Australia Lighting for Accessibility',
      url: 'https://www.visionaustralia.org/information/practical-support',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Practical guide to lighting design for people with low vision, including minimum levels and transition management.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.3-D-11', questionText: 'Are floor surfaces slip-resistant, especially in areas that may get wet?', relationship: 'Good lighting is essential for seeing floor hazards.', moduleCode: '2.3' },
    { questionId: '2.3-D-18', questionText: 'Are internal doors easy to open for people with limited hand strength or dexterity?', relationship: 'Doors are part of the circulation path and must not narrow it.', moduleCode: '2.3' },
    { questionId: '2.3-D-5', questionText: 'Is there clear wayfinding signage to key destinations within your venue?', relationship: 'Lighting affects the readability of wayfinding signage.', moduleCode: '2.3' }
  ],

  keywords: ['lighting', 'lux', 'path width', 'rest points', 'seating', 'overhead clearance', 'turning space', 'circulation', 'corridors', 'passing space']
},

// ─── Entry 14: Internal Doors ───
{
  questionId: '2.3-D-18',
  questionText: 'Are internal doors easy to open for people with limited hand strength or dexterity?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Internal Doors',
  coveredQuestionIds: ['2.3-D-19', '2.3-D-22'],
  summary: 'Internal doors on the accessible path must have lever handles, be openable with minimal force, provide adequate clear width, and have enough approach space on both sides for wheelchair manoeuvring.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Round knobs require a twisting grip that is impossible for many people with arthritis, cerebral palsy, or limited hand function. Heavy doors powered by strong closers are a barrier for people with one arm, low upper-body strength, or balance disorders. Doors narrower than 850mm block wheelchairs. Inadequate approach clearance means wheelchair users cannot position themselves to reach the handle. Every internal door on the accessible path must be usable independently.',
    statistic: {
      value: '3.3 million',
      context: 'Australians have arthritis or a musculoskeletal condition affecting hand function. Round door knobs are a barrier for many of them.',
      source: 'Arthritis Australia'
    }
  },

  tips: [
    {
      icon: 'Hand',
      text: 'Lever handles at 900-1100mm height on all doors.',
      detail: 'Lever handles can be operated with a closed fist, an elbow, or by pressing down with a wrist. D-type levers that return to horizontal are the most accessible. Replace all round knobs.',
      priority: 1
    },
    {
      icon: 'Gauge',
      text: 'Maximum 20 Newtons opening force.',
      detail: 'Test by pushing the door with one finger. If significant effort is needed, adjust the door closer. Most closers have an adjustable screw that controls closing force and speed.',
      priority: 2
    },
    {
      icon: 'Maximize',
      text: 'Minimum 850mm clear width on all doors on the accessible path.',
      detail: 'Measure the clear opening with the door open to 90 degrees. If a door is too narrow, consider offset hinges (gain 50-60mm), removing the door entirely, or replacing with a wider frame.',
      priority: 3
    },
    {
      icon: 'Clock',
      text: 'Door closers set to minimum 5-second closing time.',
      detail: 'A door that snaps shut quickly can hit a wheelchair user or someone who moves slowly. Adjust the closer to take at least 5 seconds from fully open to fully closed.',
      priority: 4
    },
    {
      icon: 'ArrowRight',
      text: 'Approach clearance of 1500mm on the pull side of doors.',
      detail: 'A wheelchair user needs space to position themselves, reach the handle, and pull the door open while moving backwards. The pull side needs at least 1500mm clear depth from the door.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing internal doors',
    steps: [
      { text: 'Check every door on the accessible path for handle type. List all round knobs that need replacing.' },
      {
        text: 'Measure handle heights.',
        measurement: { target: 'Handle height', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      { text: 'Test opening force on every door. Can you open it with one finger? If not, the closer needs adjustment.' },
      {
        text: 'Measure clear opening width on every door.',
        measurement: { target: 'Clear width', acceptable: 'Minimum 850mm', unit: 'mm' }
      },
      { text: 'Check approach clearances on the pull side of every door (minimum 1500mm depth from the door face).' },
      { text: 'Time door closers: do they take at least 5 seconds from fully open to fully closed?' },
      { text: 'Try opening each door with a closed fist to simulate limited hand function.' }
    ],
    tools: ['Tape measure', 'Stopwatch', 'Camera', 'Notepad'],
    estimatedTime: '20-30 minutes (varies with number of doors)'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 13',
      requirement: 'Doors on accessible paths of travel must have lever or D-pull hardware at 900-1100mm, maximum 20N opening force, minimum 850mm clear width, and compliant approach clearances.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires all doors on accessible paths to meet AS1428.1 requirements in new and significantly renovated buildings.' },
      { code: 'NCC', relevance: 'References AS1428.1 door requirements for all public building classes.' }
    ],
    plainEnglish: 'Every door on the accessible path must have lever handles (not round knobs), be easy to push or pull open, be wide enough for a wheelchair, and have enough space to manoeuvre on both sides.',
    complianceNote: 'Replacing door hardware is one of the cheapest and most effective accessibility improvements. It is almost always a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Replace knobs with levers and adjust closers',
      description: 'Replace all round knobs with lever handles and adjust door closers to reduce force and increase closing time.',
      resourceLevel: 'low',
      costRange: '$200-1,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Count all doors on the accessible path with round knobs.',
        'Purchase lever handle sets compatible with your existing locks (typically $30-80 per door).',
        'Replace all round knobs with lever handles. Most sets use the same mounting holes.',
        'Adjust every door closer to reduce the closing force to 20N or less. Turn the adjustment screw slowly, testing between each quarter-turn.',
        'Set the closing speed to at least 5 seconds from fully open to fully closed.',
        'Add kick plates (150mm stainless steel) to the bottom of high-traffic doors to prevent wheelchair footrest damage.',
        'Test every door from a seated position.'
      ],
      notes: 'A locksmith can replace handles and adjust closers on 10-15 doors in a day.'
    },
    {
      title: 'Install automatic openers on high-traffic doors',
      description: 'Fit push-button or sensor-activated automatic openers on the most heavily used doors to eliminate the need for manual operation.',
      resourceLevel: 'medium',
      costRange: '$1,500-5,000',
      timeRequired: '1-2 days per door',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify the three to five most heavily used doors on the accessible path (entrance, toilets, main service area).',
        'Engage a door automation specialist to assess compatibility with each door.',
        'Install push-button or motion-sensor openers. Mount buttons at 900-1100mm with the ISA symbol.',
        'Set hold-open time to at least 5 seconds.',
        'For fire doors, use magnetic hold-open devices connected to the fire alarm system (door closes automatically on alarm).',
        'Test each installation with a wheelchair user or from a seated position.',
        'Schedule annual servicing of the motors and sensors.'
      ],
      notes: 'Magnetic hold-open devices for fire doors are a separate, lower-cost solution ($200-400 per door) that keeps fire doors open during normal use.'
    }
  ],

  examples: [
    {
      businessType: 'local-government',
      businessTypeLabel: 'Community Centre',
      scenario: 'A community centre had round knobs on all 22 internal doors and door closers set to slam shut in 2 seconds.',
      solution: 'Replaced all 22 knobs with lever handles ($35 each) and adjusted every closer to 6-second closing with reduced force.',
      outcome: 'Wheelchair users and older visitors can now move through the building independently. Staff also appreciated the easier doors.',
      cost: '$680 for handles plus $350 for locksmith time',
      timeframe: '1 day'
    },
    {
      businessType: 'general',
      businessTypeLabel: 'Office',
      scenario: 'An office had heavy fire doors that wheelchair users could not open. The doors were propped open with wedges, violating fire safety rules.',
      solution: 'Installed magnetic hold-open devices on all fire doors, connected to the fire alarm system. Doors stay open during normal operation and close automatically when the alarm activates.',
      outcome: 'Fire safety compliance restored while maintaining accessibility. The building\'s fire safety officer approved the installation.',
      cost: '$400 per door (6 doors, $2,400 total)',
      timeframe: '2 days'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Door Requirements',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Complete requirements for accessible door design including width, hardware, force, and approach clearances.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AND Accessible Door Hardware Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide to selecting and installing accessible door hardware for businesses.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-F-2', questionText: 'Is the main entrance door at least 850mm wide?', relationship: 'Entrance doors have the same width and hardware requirements.', moduleCode: '2.2' },
    { questionId: '2.3-D-12', questionText: 'Is there adequate lighting throughout circulation paths?', relationship: 'Doors are part of the circulation path and need adequate lighting.', moduleCode: '2.3' },
    { questionId: '2.3-D-5', questionText: 'Is there clear wayfinding signage to key destinations within your venue?', relationship: 'Door signage is part of the wayfinding system.', moduleCode: '2.3' }
  ],

  keywords: ['door', 'handle', 'lever', 'opening force', 'width', 'approach clearance', 'kick plate', 'door closer', 'fire door', 'magnetic hold-open']
},

// ─── Entry 15: Internal Stairs ───
{
  questionId: '2.3-D-25',
  questionText: 'Do internal stairs have handrails on both sides?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Internal Stairs',
  coveredQuestionIds: ['2.3-D-26', '2.3-D-27', '2.3-D-28'],
  summary: 'Internal stairs need the same four safety features as entrance stairs: handrails on both sides, contrasting nosing strips on every step, enclosed risers, and TGSIs at top and bottom.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Internal stairs are one of the most common locations for falls in public buildings. A single missing handrail, an invisible step edge, or an open riser can cause a serious injury. People with one-sided weakness, balance disorders, or vision impairment are at greatest risk, but anyone carrying items, wearing bifocals, or rushing can fall. The four safety features (handrails, nosings, enclosed risers, TGSIs) work together as a system. Removing any one element significantly increases risk.',
    statistic: {
      value: '20%',
      context: 'of stair fall injuries in public buildings occur because there is no handrail or only one handrail present.',
      source: 'Safe Work Australia'
    }
  },

  tips: [
    {
      icon: 'Hand',
      text: 'Continuous handrails on both sides at 865-1000mm from the nosing.',
      detail: 'Both sides are essential because people with one-sided weakness need the handrail on their usable side. The handrail should be continuous with no breaks at landings. Extend 300mm horizontally past the top and bottom steps.',
      priority: 1
    },
    {
      icon: 'ArrowRight',
      text: 'Handrails must extend 300mm past the top and bottom steps.',
      detail: 'The horizontal extension provides a stable handhold while transitioning between stairs and level floor. Ends must return smoothly to the wall or post to avoid snagging clothing.',
      priority: 2
    },
    {
      icon: 'Eye',
      text: 'Nosing strips on every step: 50mm on tread, 30mm on riser face.',
      detail: 'The strip must contrast with both the tread and the riser by at least 30% luminance. This makes every step edge visible for people with low vision.',
      priority: 3
    },
    {
      icon: 'Shield',
      text: 'Enclosed risers with no open gaps.',
      detail: 'Open risers catch cane tips, small wheels, and shoe toes. Even a 15mm gap can trap a cane tip. All risers on public stairs should be solid.',
      priority: 4
    },
    {
      icon: 'Footprints',
      text: 'TGSIs at top and bottom: 300mm setback from first nosing, 600mm deep.',
      detail: 'Warning TGSIs (raised dots) extend across the full width of the stairway. They alert people using canes or feet to the presence of the stair hazard.',
      priority: 5
    },
    {
      icon: 'Ruler',
      text: 'Handrail profile 30-50mm circular, contrasting with the wall.',
      detail: 'A circular profile of 30-50mm diameter provides the best grip for the widest range of hand sizes and grip abilities. The handrail should contrast visually with the wall behind it.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing internal stairs',
    steps: [
      { text: 'Check for handrails on both sides of every internal staircase. Test stability by pushing firmly.' },
      {
        text: 'Measure handrail height from the step nosing.',
        measurement: { target: 'Handrail height', acceptable: '865-1000mm from nosing', unit: 'mm' }
      },
      { text: 'Check that handrails extend at least 300mm horizontally past the top and bottom steps.' },
      { text: 'Check for contrasting nosing strips on every step. Verify contrast by photographing in black and white.' },
      { text: 'Check that all risers are enclosed (solid, no gaps between treads).' },
      { text: 'Check for TGSIs at the top and bottom of each staircase with correct dimensions (300mm setback, 600mm deep).' },
      { text: 'Test handrail stability by gripping and applying sideways force.' }
    ],
    tools: ['Tape measure', 'Camera', 'Notepad'],
    estimatedTime: '10-15 minutes per staircase'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 9, 11, and 12',
      requirement: 'Internal stairs on accessible paths must have handrails on both sides (865-1000mm), contrasting nosing strips on every step, enclosed risers, and 300mm handrail extensions.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies TGSI requirements at stairs including dimensions, layout, and luminance contrast.' },
      { code: 'NCC', relevance: 'Requires stairs in all public building classes to comply with AS1428.1.' }
    ],
    plainEnglish: 'Every internal staircase needs handrails on both sides, a visible contrast strip on every step edge, no open gaps between steps, and textured warning indicators at the top and bottom.',
    complianceNote: 'Adding a second handrail, nosing strips, and TGSIs to existing stairs is almost always feasible and cost-effective. These are considered reasonable adjustments under the DDA.'
  },

  solutions: [
    {
      title: 'Install handrails on both sides',
      description: 'Add a second handrail where only one exists, or install handrails on both sides of unrailed stairs.',
      resourceLevel: 'medium',
      costRange: '$600-3,000 per staircase',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify all internal staircases with missing or single-side handrails.',
        'Engage a metalworker or builder to fabricate and install compliant handrails: 30-50mm circular profile, 865-1000mm height, with 300mm horizontal extensions.',
        'Ensure the handrail contrasts visually with the wall (minimum 30% luminance contrast).',
        'Fix securely to the wall with brackets at maximum 1200mm spacing. Fixings must support 1100N lateral force.',
        'Maintain 60-75mm clearance between handrail and wall for grip space.',
        'Test the installation for stability and smooth transitions at corners and landings.'
      ],
      notes: 'Powder-coated aluminium handrails are available in many colours to match your interior while maintaining contrast with the wall.'
    },
    {
      title: 'Apply nosing strips to all steps',
      description: 'Install contrasting nosing strips on every step of every internal staircase.',
      resourceLevel: 'low',
      costRange: '$100-600',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Purchase aluminium or rubber nosing strips in a colour that contrasts with the tread and riser (minimum 30% luminance contrast).',
        'Clean step edges thoroughly.',
        'Apply strips to every step: 50mm on the tread surface, wrapping 30mm down the riser face.',
        'Use screw fixings in high-traffic areas for durability.',
        'Check all strips are secure and do not create a new trip hazard.',
        'Inspect monthly and replace any loose or worn strips.'
      ],
      notes: 'Nosing strips are one of the cheapest safety improvements you can make. Budget approximately $8-15 per step.'
    },
    {
      title: 'Install TGSIs at stair landings',
      description: 'Add warning TGSIs at the top and bottom of all internal staircases.',
      resourceLevel: 'low',
      costRange: '$150-500',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Source warning TGSIs (dot pattern) that contrast with the floor surface.',
        'Mark the installation area: full stair width, 300mm setback from the first nosing, 600mm deep.',
        'Install using adhesive or drill-in studs appropriate for the floor material.',
        'Ensure consistent spacing per AS1428.4.1 (35mm diameter dots, 50mm centre-to-centre).',
        'Check that the TGSI colour provides at least 30% luminance contrast with the surrounding floor.',
        'Inspect quarterly for loose or worn TGSIs.'
      ],
      notes: 'If you are installing TGSIs and nosing strips at the same time, coordinate the contractor to do both in a single visit.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A gallery had a single handrail on the right side of the main staircase between exhibition levels. Left-handed visitors and those with right-sided weakness had no support.',
      solution: 'Installed a matching handrail on the left side with correct height, profile, and extensions. Added nosing strips to all 12 steps.',
      outcome: 'Visitor confidence on the stairs visibly improved. The gallery received positive feedback from disability advocacy groups.',
      cost: '$1,400',
      timeframe: '1 day'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had three internal steps between the dining area and the bar with no nosing strips. The steps were the same colour as the floor, making them invisible to customers with low vision.',
      solution: 'Applied bright yellow aluminium nosing strips to all three steps.',
      outcome: 'No further trips on the steps. Several customers commented that they had not even noticed the steps before.',
      cost: '$85',
      timeframe: '1 hour'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Stairs and Handrails Requirements',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Complete requirements for stair and handrail design on accessible paths of travel.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AHRC Stair Safety Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guide to stair safety improvements, with cost estimates and case studies.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-D-23', questionText: 'If there are stairs or steps at the entrance, do they have handrails or grab rails on both sides?', relationship: 'Entrance stairs have the same handrail and nosing requirements.', moduleCode: '2.2' },
    { questionId: '2.3-D-14', questionText: 'Where there are internal ramps, do they have handrails on both sides?', relationship: 'Ramps are the accessible alternative to stairs and also need handrails.', moduleCode: '2.3' },
    { questionId: '2.3-D-11', questionText: 'Are floor surfaces slip-resistant, especially in areas that may get wet?', relationship: 'Stair treads need slip-resistant surfaces as well as nosing strips.', moduleCode: '2.3' }
  ],

  keywords: ['stairs', 'handrails', 'nosing strips', 'enclosed risers', 'TGSIs', 'internal stairs', 'stair safety', 'fall prevention', 'step edges']
},

// ─── Entry 16: Internal Ramps ───
{
  questionId: '2.3-D-14',
  questionText: 'Where there are internal ramps, do they have handrails on both sides?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Internal Ramps',
  coveredQuestionIds: ['2.3-D-29', '2.3-D-30'],
  summary: 'Internal ramps steeper than 1:20 must have handrails on both sides, comply with gradient limits, and have TGSIs at top and bottom.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'A ramp without handrails is hazardous for anyone with balance issues, reduced strength, or limited mobility. People with one-sided weakness need the handrail on their usable side, which means handrails must be on both sides. Wheelchair users may need to grab the handrail if they lose momentum going up or need to slow their descent. Internal ramps are often overlooked because they seem less dramatic than stairs, but they present real risks when gradient is too steep or handrails are absent.',
    quote: {
      text: 'The ramp in the restaurant was so steep I could not push myself up. I had to ask a stranger for help. That is not independence.',
      attribution: 'Wheelchair user, disability advocacy forum'
    }
  },

  tips: [
    {
      icon: 'Hand',
      text: 'Continuous handrails on both sides at 865-1000mm height.',
      detail: 'Required on any ramp steeper than 1:20. The handrail must be continuous with no breaks and extend 300mm horizontally past the top and bottom of the ramp.',
      priority: 1
    },
    {
      icon: 'TrendingUp',
      text: 'Maximum gradient 1:14 for new ramps.',
      detail: 'A 1:14 gradient means 1m of rise over 14m of length. Existing ramps up to 1:8 are tolerated for very short runs (under 1900mm) but should be improved when any renovation occurs.',
      priority: 2
    },
    {
      icon: 'ArrowRight',
      text: 'Extend handrails 300mm horizontally past the top and bottom.',
      detail: 'The extension provides a stable handhold during the transition from ramp to level floor. It must be horizontal and end with a smooth return.',
      priority: 3
    },
    {
      icon: 'Footprints',
      text: 'TGSIs at top and bottom of the ramp.',
      detail: 'Warning TGSIs (raised dots) alert people with vision impairment to the change in gradient. They must extend the full width of the ramp, set back 300mm from the transition.',
      priority: 4
    },
    {
      icon: 'Eye',
      text: 'Visual contrast at handrails and ramp edges.',
      detail: 'Handrails should contrast with the wall behind them for visibility. Ramp edges should have a contrasting strip so the edge is visible for people with low vision.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing internal ramps',
    steps: [
      { text: 'Identify all internal ramps steeper than 1:20 (i.e. noticeable slope).' },
      { text: 'Check for handrails on both sides. Test stability.' },
      {
        text: 'Measure the gradient using a spirit level and tape measure.',
        measurement: { target: 'Gradient', acceptable: 'Maximum 1:14 (1:8 for existing short ramps under 1900mm)', unit: 'ratio' }
      },
      {
        text: 'Measure handrail height.',
        measurement: { target: 'Handrail height', acceptable: '865-1000mm from ramp surface', unit: 'mm' }
      },
      { text: 'Check for TGSIs at top and bottom of each ramp.' },
      { text: 'Check for edge protection on both sides if the ramp is elevated.' },
      { text: 'Check handrail extensions (minimum 300mm horizontal past top and bottom).' }
    ],
    tools: ['Tape measure', 'Spirit level or digital inclinometer', 'Camera'],
    estimatedTime: '10-15 minutes per ramp'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 10-12',
      requirement: 'Ramps steeper than 1:20 on accessible paths of travel must have handrails on both sides (865-1000mm), maximum 1:14 gradient for new construction, and edge protection.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies TGSI requirements at the top and bottom of ramps.' },
      { code: 'NCC', relevance: 'References AS1428.1 ramp requirements for all public building classes.' }
    ],
    plainEnglish: 'Any ramp with a noticeable slope (steeper than 1:20) needs handrails on both sides, must not be too steep, and must have textured warning indicators at the top and bottom.',
    complianceNote: 'Internal ramps are frequently non-compliant in older buildings. Adding handrails and TGSIs is usually feasible and cost-effective.'
  },

  solutions: [
    {
      title: 'Install compliant handrails on both sides',
      description: 'Add handrails to both sides of internal ramps that currently lack them or have only one.',
      resourceLevel: 'medium',
      costRange: '$800-3,000 per ramp',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Identify all internal ramps steeper than 1:20 that lack handrails on both sides.',
        'Engage a metalworker to fabricate and install compliant handrails: 30-50mm circular profile, 865-1000mm height, with 300mm extensions.',
        'Ensure the handrail contrasts with the wall behind it.',
        'Add edge protection (75mm upstand or kerb rail) if the ramp has open sides.',
        'Fix securely with brackets at maximum 1200mm spacing.',
        'Test the installation for stability and smooth transitions.'
      ],
      notes: 'If the ramp also lacks TGSIs, combine both installations to save on contractor mobilisation costs.'
    },
    {
      title: 'Install TGSIs at internal ramps',
      description: 'Add warning TGSIs at the top and bottom of all internal ramps.',
      resourceLevel: 'low',
      costRange: '$150-500',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Source warning TGSIs that contrast with the floor surface (minimum 30% luminance contrast).',
        'Mark the installation area at the top and bottom of each ramp: 300mm setback from the ramp transition, 600mm deep, full ramp width.',
        'Install using adhesive or drill-in studs.',
        'Check spacing per AS1428.4.1.',
        'Test by walking over them with eyes closed to verify they are detectable.',
        'Inspect quarterly for wear or loosening.'
      ],
      notes: 'Coordinate with any planned handrail installation to minimise disruption.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A restaurant had a ramp between the dining area and the bar with no handrails. The ramp was steep enough that a customer in a wheelchair had difficulty ascending.',
      solution: 'Installed stainless steel handrails on both sides of the ramp and added TGSIs at top and bottom.',
      outcome: 'Wheelchair users can now self-propel up the ramp using the handrails for assistance. Older customers also use the handrails.',
      cost: '$1,800',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Ramps and Handrails Requirements',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Complete requirements for ramp gradient, width, handrails, and edge protection on accessible paths.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AHRC Accessible Ramps Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Practical guide to ramp accessibility requirements and improvements.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.3-D-25', questionText: 'Do internal stairs have handrails on both sides?', relationship: 'Where there are stairs there should also be a ramp or lift as the accessible alternative.', moduleCode: '2.3' },
    { questionId: '2.2-D-27', questionText: 'If there is a ramp, does it have handrails on both sides?', relationship: 'Entrance ramps have the same handrail requirements as internal ramps.', moduleCode: '2.2' }
  ],

  keywords: ['ramp', 'internal ramp', 'handrails', 'gradient', 'TGSIs', 'slope safety', 'edge protection', 'handrail extension']
},

// ─── Entry 17: Lifts and Escalators ───
{
  questionId: '2.3-D-16',
  questionText: 'If your venue has a lift, does it have accessible features?',
  moduleCode: '2.3',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Lifts and Escalators',
  coveredQuestionIds: ['2.3-D-17', '2.3-D-31', '2.3-D-32'],
  summary: 'Internal lifts must have accessible dimensions, controls at wheelchair height with Braille, audible and visual floor indicators, and be operable independently. Escalators must always have an accessible alternative, with TGSIs at top and bottom.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'For wheelchair users and many others, the lift is the only way between levels. If the lift is too small, has unreachable buttons, or requires staff assistance, independence is compromised. People who are blind need Braille and audio announcements to know which button to press and which floor they have reached. People who are Deaf need visual displays. Escalators exclude most people with disability, so an accessible alternative must always be available and clearly signed.',
    statistic: {
      value: '15%',
      context: 'of Australians aged 65 and over use a mobility aid. For them, a working, accessible lift is the difference between accessing all levels of your venue or being confined to one floor.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'Maximize',
      text: 'Lift car minimum 1100mm x 1400mm, door minimum 900mm.',
      detail: 'These minimum dimensions accommodate a standard wheelchair. Larger lifts (1600mm x 1400mm) are better for powered wheelchairs, scooters, and users with assistance animals.',
      priority: 1
    },
    {
      icon: 'Hand',
      text: 'Controls at 900-1100mm with Braille and tactile numbers.',
      detail: 'Every button must have a raised number and adjacent Braille. Emergency controls (alarm, phone) must also be within the 900-1100mm range.',
      priority: 2
    },
    {
      icon: 'Volume2',
      text: 'Audible floor announcements for people with vision impairment.',
      detail: 'The lift should announce each floor verbally as it arrives. This is essential for people who cannot see the floor indicator display.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Rear-wall mirror at 900-1800mm height.',
      detail: 'A mirror on the rear wall allows wheelchair users to see the door behind them and manoeuvre safely when reversing out of the lift.',
      priority: 4
    },
    {
      icon: 'ArrowUp',
      text: 'Provide an accessible alternative to every escalator.',
      detail: 'The lift or ramp alternative must be clearly signed at the escalator with the ISA symbol and direction arrow. It must be available during all operating hours.',
      priority: 5
    },
    {
      icon: 'Footprints',
      text: 'TGSIs at the top and bottom of all escalators.',
      detail: 'Warning TGSIs alert people with vision impairment to the escalator hazard. They must be set back 300mm from the escalator landing and extend 600mm deep.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing lifts and escalators',
    steps: [
      {
        text: 'Measure the lift car interior.',
        measurement: { target: 'Lift car dimensions', acceptable: 'Minimum 1100mm wide x 1400mm deep', unit: 'mm' }
      },
      {
        text: 'Measure the lift door width.',
        measurement: { target: 'Lift door width', acceptable: 'Minimum 900mm', unit: 'mm' }
      },
      {
        text: 'Check control button heights.',
        measurement: { target: 'Controls', acceptable: '900-1100mm from floor', unit: 'mm' }
      },
      { text: 'Check for Braille and raised tactile numbers beside each button.' },
      { text: 'Ride the lift and check for audible floor announcements.' },
      { text: 'Check for a rear-wall mirror (bottom edge at 900mm, top at 1800mm).' },
      { text: 'At each escalator, check for a signed accessible alternative within clear view.' },
      { text: 'Check for TGSIs at the top and bottom of all escalators.' }
    ],
    tools: ['Tape measure', 'Camera', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'Passenger lifts on accessible paths must meet minimum dimensions, control height with Braille, audible/visual indicators, and mirror requirements.'
    },
    related: [
      { code: 'AS1428.4.1', relevance: 'Specifies TGSI requirements at escalators.' },
      { code: 'NCC', relevance: 'References AS1428.1 and AS1735.12 for lift requirements in all public buildings.' }
    ],
    plainEnglish: 'Lifts must be big enough for a wheelchair, have controls you can reach and read by touch, announce floors by voice, and have a mirror so wheelchair users can see behind them. Escalators must have a lift or ramp alternative with clear signs.',
    complianceNote: 'Upgrading an existing lift with Braille, audio, a lower panel, and a mirror is significantly cheaper than replacing the lift entirely and is a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Upgrade existing lift accessibility features',
      description: 'Add Braille markers, a secondary lower control panel, audio announcements, and a rear-wall mirror to an existing lift.',
      resourceLevel: 'medium',
      costRange: '$1,000-4,000',
      timeRequired: '1-3 days',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Contact your lift maintenance company to assess the existing lift for upgrade options.',
        'Install a secondary control panel at 900-1100mm if the current panel is too high.',
        'Add Braille labels and raised tactile numbers beside each button on the new panel.',
        'Install an audio announcement module (many modern lift controllers support add-on modules).',
        'Install a rear-wall mirror with the bottom edge at 900mm and top edge at 1800mm.',
        'Update emergency controls (alarm button, intercom) to be within 900-1100mm reach.',
        'Test all new features from a wheelchair or seated position.',
        'Update the lift maintenance contract to include the new features.'
      ],
      notes: 'Some older lift controllers may not support audio modules. In that case, consult a lift modernisation specialist about controller upgrades.'
    },
    {
      title: 'Add TGSIs at all escalators',
      description: 'Install warning TGSIs at the top and bottom of every escalator to alert people with vision impairment.',
      resourceLevel: 'low',
      costRange: '$200-600',
      timeRequired: '2-4 hours',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify all escalators in the venue.',
        'Source warning TGSIs that contrast with the escalator landing surface.',
        'Mark installation areas: 300mm setback from the escalator comb plate, 600mm deep, full width of the escalator approach.',
        'Install using adhesive or drill-in studs appropriate for the floor material.',
        'Add ISA signage at each escalator pointing to the nearest accessible alternative (lift or ramp).',
        'Inspect TGSIs quarterly for wear.'
      ],
      notes: 'TGSIs at escalators are frequently overlooked. They are a quick, affordable improvement.'
    }
  ],

  examples: [
    {
      businessType: 'retail',
      businessTypeLabel: 'Department Store',
      scenario: 'A department store had a 1990s lift with buttons at 1400mm, no Braille, no audio, and no mirror. Wheelchair users could not reach the upper buttons independently.',
      solution: 'Installed a lower control panel at 1000mm with Braille, added an audio announcement module, and fitted a rear-wall mirror.',
      outcome: 'Wheelchair users can now operate the lift independently. The upgrades also benefited parents with prams, people carrying bags, and children.',
      cost: '$3,200',
      timeframe: '2 days'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A shopping centre had four escalators but TGSIs only at one. People with vision impairment had no warning at the other three.',
      solution: 'Installed stainless steel TGSI studs at the top and bottom of all four escalators and added ISA signage pointing to the nearest lift at each location.',
      outcome: 'Consistent TGSI coverage throughout the centre. The signage also helped parents with prams and older shoppers find the lift more easily.',
      cost: '$1,800',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'AS1428.1 Section 15: Lifts',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Complete requirements for accessible lift design in public buildings.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AND Lift Accessibility Checklist',
      url: 'https://www.and.org.au/resources/',
      type: 'checklist',
      source: 'Australian Network on Disability',
      description: 'Checklist for auditing lift accessibility including dimensions, controls, Braille, and audio features.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.2-D-31', questionText: 'Is the entrance lift large enough for a wheelchair user, with at least a 900mm door?', relationship: 'Entrance lifts have the same accessibility requirements as internal lifts.', moduleCode: '2.2' },
    { questionId: '2.3-D-25', questionText: 'Do internal stairs have handrails on both sides?', relationship: 'Where stairs exist, a lift is the accessible alternative.', moduleCode: '2.3' },
    { questionId: '2.3-D-5', questionText: 'Is there clear wayfinding signage to key destinations within your venue?', relationship: 'Lift locations must be clearly signed as part of the wayfinding system.', moduleCode: '2.3' }
  ],

  keywords: ['lift', 'elevator', 'escalator', 'Braille', 'controls', 'mirror', 'accessible features', 'TGSIs', 'independence', 'audio announcements']
},

// ─── Entry 18: Queue Layout and Physical Access ───
{
  questionId: '2.4-D-4',
  questionText: 'Is the queue layout accessible for wheelchair users and people with mobility aids?',
  moduleCode: '2.4',
  moduleGroup: 'getting-in',
  diapCategory: 'physical-access',
  title: 'Queue Layout and Physical Access',
  coveredQuestionIds: ['2.4-D-8', '2.4-D-10', '2.4-D-11', '2.4-D-12'],
  summary: 'Covers the physical aspects of queuing: layout width for wheelchairs, maintaining clear paths during busy periods, providing seating, ensuring barriers are visible, and keeping queue area floor surfaces safe.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'A queue that works for ambulant people can be a complete barrier for wheelchair users if stanchion spacing is too narrow, turns are too tight, or the floor is uneven. During busy periods, queues spill into pathways, blocking access to other parts of the venue. People with fatigue conditions, chronic pain, or balance disorders need seating while they wait. Barriers that blend into the floor are invisible to people with low vision.',
    statistic: {
      value: '60%',
      context: 'of accessibility complaints in retail and hospitality relate to temporary obstructions and queue layouts rather than permanent building features.',
      source: 'Australian Human Rights Commission complaint data'
    }
  },

  tips: [
    {
      icon: 'Maximize',
      text: 'Minimum 1000mm queue width (1500mm preferred for two-way flow).',
      detail: 'A standard wheelchair is 650-700mm wide and needs clearance on both sides. At 1000mm, one wheelchair fits. At 1500mm, a wheelchair and a standing person can pass comfortably.',
      priority: 1
    },
    {
      icon: 'ArrowRight',
      text: 'Provide 1500mm turning circles at direction changes.',
      detail: 'A wheelchair needs 1500mm diameter to make a 180-degree turn. At every point where the queue changes direction, ensure this space is available.',
      priority: 2
    },
    {
      icon: 'Shield',
      text: 'Maintain pathway access during busy periods.',
      detail: 'When queues grow, they must not block the main accessible path through your venue. Use queue management (stanchions, staff) to contain the queue without blocking doorways, corridors, or fire exits.',
      priority: 3
    },
    {
      icon: 'Square',
      text: 'Provide seating with armrests in the queue area.',
      detail: 'Standing for extended periods is painful or impossible for many people. Place seats at regular intervals along the queue, or provide a seated waiting area with a call-forward system.',
      priority: 4
    },
    {
      icon: 'Eye',
      text: 'Queue barriers must be visible for people with low vision.',
      detail: 'Stanchions, ropes, and retractable belts should contrast with the floor and walls. Clear or grey ropes on grey carpet are invisible to people with low vision.',
      priority: 5
    },
    {
      icon: 'Layers',
      text: 'Queue area floor must be firm, level, and slip-resistant.',
      detail: 'Uneven floors, thick mats, and slippery surfaces in queue areas are hazardous, especially for people using canes, walkers, or wheelchairs.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing queue layout',
    steps: [
      {
        text: 'Measure the queue width at the narrowest point.',
        measurement: { target: 'Queue width', acceptable: 'Minimum 1000mm (1500mm preferred)', unit: 'mm' }
      },
      { text: 'Check turning space at every direction change in the queue (minimum 1500mm diameter).' },
      { text: 'Visit during a peak period and check whether the queue blocks accessible paths, doorways, or fire exits.' },
      { text: 'Check for seating in or adjacent to the queue area.' },
      { text: 'Check barrier visibility: can you see stanchions and ropes clearly, especially from a low eye height (wheelchair level)?' },
      { text: 'Check floor surface in the queue area for level changes, loose mats, or slippery patches.' }
    ],
    tools: ['Tape measure', 'Camera', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 7',
      requirement: 'Accessible paths of travel (including queuing areas) must have minimum 1000mm width, be free of obstructions, and have firm, slip-resistant surfaces.'
    },
    related: [
      { code: 'DDA', relevance: 'Requires that services be provided without discrimination. An inaccessible queue is a barrier to service.' },
      { code: 'Access-to-Premises', relevance: 'Queue areas within a building must maintain accessible path of travel requirements.' }
    ],
    plainEnglish: 'Queue areas must be wide enough for wheelchairs, have turning space at corners, not block other pathways during busy times, have visible barriers, and keep floors safe.',
    complianceNote: 'Queue layout is a service delivery issue under the DDA. Even if the building itself is compliant, a poorly designed queue can create discrimination.'
  },

  solutions: [
    {
      title: 'Widen stanchion spacing and simplify layout',
      description: 'Reorganise queue stanchions to create wider lanes and simpler turning points, and add a bypass for wheelchair users.',
      resourceLevel: 'low',
      costRange: '$0-100',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Measure your current stanchion spacing and identify any points narrower than 1000mm.',
        'Move stanchions to achieve minimum 1000mm spacing (1500mm preferred) throughout the queue.',
        'Eliminate unnecessary turns. A simpler layout is faster for everyone and easier for wheelchair users.',
        'Ensure 1500mm turning space at every remaining direction change.',
        'Replace low-contrast barriers (clear or grey ropes) with high-contrast alternatives (bright red, blue, or black).',
        'Test the new layout by pushing an office chair through it.'
      ],
      notes: 'This is often free since it only requires moving existing stanchions. Staff can do it during a quiet period.'
    },
    {
      title: 'Install an accessible bypass with signage',
      description: 'Create a dedicated accessible queue bypass or priority lane with clear signage for customers who cannot use the standard queue.',
      resourceLevel: 'low',
      costRange: '$200-600',
      timeRequired: '1 day',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Designate an accessible bypass route from the queue entrance directly to the service counter.',
        'Mark the bypass with a sign: ISA symbol and text reading "Accessible queue bypass. Please ask staff for assistance."',
        'Ensure the bypass is at least 1000mm wide and step-free.',
        'Place a call button or bell at the bypass entrance so customers can alert staff.',
        'Train all staff to respond promptly to bypass requests without requiring proof of disability.',
        'During peak periods, assign a staff member to monitor the bypass.'
      ],
      notes: 'The bypass benefits not only wheelchair users but also parents with prams, people with invisible disabilities, and older customers.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme Park',
      scenario: 'A theme park had standard queue stanchions spaced at 700mm, too narrow for wheelchairs. Wheelchair users had to enter through the exit, which was confusing and embarrassing.',
      solution: 'Widened stanchion spacing to 1200mm on all major ride queues and added wheelchair bypass gates at 1500mm width with ISA signage.',
      outcome: 'Wheelchair users now queue alongside everyone else. The wider lanes also improved crowd flow during peak periods.',
      cost: '$500 per ride (12 rides, $6,000 total)',
      timeframe: '2 days'
    },
    {
      businessType: 'general',
      businessTypeLabel: 'Post Office',
      scenario: 'A post office had a maze-like queue layout with 800mm spacing and sharp turns. Customers with mobility aids could not navigate it.',
      solution: 'Simplified the layout to a single straight lane with 1200mm width and one turn with 1500mm turning space. Added a seat near the front for customers waiting.',
      outcome: 'All customers can now use the queue. Queue throughput also improved because the simpler layout moves faster.',
      cost: '$50 (new stanchion configuration)',
      timeframe: '30 minutes'
    }
  ],

  resources: [
    {
      title: 'Premises Standards 2010',
      url: 'https://www.ag.gov.au/rights-and-protections/human-rights-and-anti-discrimination/disability-standards/disability-access-premises-buildings',
      type: 'guide',
      source: 'Attorney-General\'s Department',
      description: 'Mandatory building accessibility standards including requirements for accessible paths of travel within service areas.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AND Accessible Queue Design Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide to designing accessible queue layouts for retail and hospitality venues.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS1428.1: Design for Access and Mobility',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary standard for accessible path of travel requirements applicable to queue areas.',
      isAustralian: true,
      isFree: false
    }
  ],

  relatedQuestions: [
    { questionId: '2.4-D-5', questionText: 'Is there signage indicating that queue assistance is available for those who need it?', relationship: 'Signage supplements the physical queue layout by communicating available assistance.', moduleCode: '2.4' },
    { questionId: '2.4-D-6', questionText: 'Do you offer alternative queue arrangements (e.g., text notification, numbered tickets)?', relationship: 'Alternative queue systems can bypass physical queue barriers entirely.', moduleCode: '2.4' },
    { questionId: '2.3-D-12', questionText: 'Is there adequate lighting throughout circulation paths?', relationship: 'Queue areas need the same lighting standards as other circulation paths.', moduleCode: '2.3' }
  ],

  keywords: ['queue', 'layout', 'width', 'turning space', 'wheelchair', 'busy periods', 'seating', 'barriers', 'floor surface', 'stanchions', 'bypass']
},

// ─── Entry 19: Queue Communication and Signage ───
{
  questionId: '2.4-D-5',
  questionText: 'Is there signage indicating that queue assistance is available for those who need it?',
  moduleCode: '2.4',
  moduleGroup: 'getting-in',
  diapCategory: 'information-communication-marketing',
  title: 'Queue Communication and Signage',
  coveredQuestionIds: ['2.4-D-7', '2.4-D-9', '2.4-D-13'],
  summary: 'Covers the communication side of queuing: signage offering assistance, communicating wait times visually and audibly, providing pre-visit queue information, and ensuring announcements reach people who are Deaf or hard of hearing.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Many people with disability feel uncomfortable asking for help without an explicit invitation. Without signage saying assistance is available, they may leave rather than approach staff. People who are Deaf miss verbal queue calls entirely. Without visual wait time displays, they do not know when their turn is approaching. Pre-visit information about queue arrangements lets people plan their energy expenditure and decide whether to visit during quieter periods.',
    quote: {
      text: 'They called my name three times but I could not hear them. By the time I realised, they had moved on. A screen showing my number would have changed everything.',
      attribution: 'Person with hearing loss, customer feedback'
    }
  },

  tips: [
    {
      icon: 'Signpost',
      text: 'Display queue assistance signage at the queue entrance with the ISA symbol.',
      detail: 'Sign text example: "If you need assistance with queuing, please ask a team member or press the button below." Use high-contrast text (minimum 30% luminance) and include the ISA symbol.',
      priority: 1
    },
    {
      icon: 'Clock',
      text: 'Display current wait times on a visible screen or whiteboard.',
      detail: 'A simple whiteboard showing "Current wait: approx 15 minutes" helps everyone plan. A digital display updated automatically is even better.',
      priority: 2
    },
    {
      icon: 'Globe',
      text: 'Publish busy period information on your website.',
      detail: 'Let customers know when your busiest periods are so they can visit during quieter times if long queues are a barrier. Google Maps "popular times" data can also help.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Provide visual displays alongside all verbal announcements.',
      detail: 'Every time a name or number is called verbally, it should also appear on a screen. This is essential for people who are Deaf or hard of hearing.',
      priority: 4
    },
    {
      icon: 'Volume2',
      text: 'Install a hearing loop at the service counter where feasible.',
      detail: 'A counter hearing loop transmits the staff member\'s voice directly to hearing aids set to the T (telecoil) setting. This is invaluable in noisy environments.',
      priority: 5
    },
    {
      icon: 'Users',
      text: 'Train staff to offer queue assistance proactively.',
      detail: 'Staff should approach anyone who appears to be struggling in the queue and offer alternatives, rather than waiting to be asked. This includes people using mobility aids, parents with prams, and people who seem confused or distressed.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing queue communication',
    steps: [
      { text: 'Check for assistance signage at all queue entry points. Is it visible, high-contrast, and at an accessible height (1200-1600mm)?' },
      { text: 'Check whether current wait times are displayed visually.' },
      { text: 'Check your website for queue and busy period information.' },
      { text: 'Stand at the back of the queue during a busy period. Can you hear verbal announcements? Can you see a visual display?' },
      { text: 'Check for a hearing loop at the service counter. Is it signed with the hearing loop symbol?' },
      { text: 'Ask three staff members what they would do if a customer with disability needed queue assistance.' }
    ],
    tools: ['Camera', 'Smartphone (to check website)', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The DDA requires reasonable adjustments in service delivery. Communicating queue information in accessible formats (visual, auditory, written) is a reasonable adjustment.'
    },
    related: [
      { code: 'AS1428.5', relevance: 'Specifies requirements for communication for people who are Deaf or hard of hearing, including hearing loops and visual displays.' },
      { code: 'AS1428.1', relevance: 'Section 8 covers signage requirements including contrast, positioning, and symbols.' }
    ],
    plainEnglish: 'You must communicate queue information in ways that everyone can access: visual displays for people who cannot hear, audio for people who cannot see, and clear signage offering assistance.',
    complianceNote: 'Providing queue assistance signage is free. Adding a visual display can cost as little as $10 for a whiteboard. These are among the most affordable accessibility improvements.'
  },

  solutions: [
    {
      title: 'Create and install queue assistance signs',
      description: 'Design and install high-contrast signs at every queue entry point offering assistance to customers who need it.',
      resourceLevel: 'low',
      costRange: '$20-80',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Design a sign with: ISA symbol, high-contrast text (dark on light or light on dark), and text reading "If you need assistance with queuing, please ask a team member."',
        'Print at A4 or A3 size and laminate, or order a permanent sign.',
        'Mount at every queue entry point at 1200-1500mm height.',
        'If a call button is available, include its location on the sign.',
        'Train all staff on the assistance procedure so they can respond promptly.',
        'Check signs monthly and replace if damaged.'
      ],
      notes: 'A simple printed and laminated sign is effective immediately. Upgrade to a permanent sign when budget allows.'
    },
    {
      title: 'Set up a wait time display',
      description: 'Implement a visual display showing current wait times so customers can see their queue progress without relying on verbal calls.',
      resourceLevel: 'low',
      costRange: '$10-800',
      timeRequired: '1-4 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'For the simplest option, use a whiteboard at the queue entrance. Staff update it every 15 minutes with the current approximate wait time.',
        'For a mid-range option, use a tablet or small TV screen mounted at 1200-1600mm showing queue numbers or names.',
        'For a digital option, implement a queue management system with numbered tickets and a display screen (e.g. Qmatic, Waitwhile).',
        'Ensure the display is visible from all parts of the queue, including from a seated or wheelchair position.',
        'If using verbal calls, display the same name or number on the screen simultaneously.',
        'Test the display from the back of the queue and from a low eye height.'
      ],
      notes: 'Even a $10 whiteboard makes a meaningful difference. Upgrade to digital as budget allows.'
    },
    {
      title: 'Add a visual number display for hearing access',
      description: 'Install a visual number or name display that updates each time a customer is called, eliminating reliance on verbal announcements.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Purchase a basic LED number display (available from $50-150 online) or a small TV/monitor.',
        'Mount the display at 1200-1600mm height, visible from the entire waiting area.',
        'Connect to your queue management system, or manually update when calling each customer.',
        'Ensure the display numbers are large enough to read from the back of the waiting area (minimum 75mm character height).',
        'Add a sign beside the display explaining the system: "Watch for your number on the screen."',
        'Test from the farthest point in the waiting area.'
      ],
      notes: 'A visual display benefits not just people with hearing loss but also anyone in a noisy environment or wearing headphones.'
    }
  ],

  examples: [
    {
      businessType: 'health-wellness',
      businessTypeLabel: 'Pharmacy',
      scenario: 'A pharmacy had no queue assistance signage and called customers by name. Customers with hearing loss frequently missed their turn.',
      solution: 'Installed ISA queue assistance signs, a call button at the counter, and a small LED number display. Customers now take a numbered ticket and watch the screen.',
      outcome: 'No more missed turns. Customer satisfaction improved across the board, not just for those with hearing loss.',
      cost: '$120 total',
      timeframe: '2 hours'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A busy restaurant called customers by name when their table was ready. Customers with hearing loss standing outside frequently missed their call.',
      solution: 'Replaced name-calling with a tablet display showing the next three names and estimated wait times. Also offered vibrating pagers for those who preferred.',
      outcome: 'All customers can now track their wait status independently. The restaurant also gained efficiency from fewer repeated calls.',
      cost: '$150 (tablet mount and app)',
      timeframe: '1 hour setup'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Food Court',
      scenario: 'A food court had 12 vendors all calling order numbers verbally. The noise level made it nearly impossible for anyone with hearing loss to hear their number.',
      solution: 'Installed vibrating pager systems at each vendor ($350 per set of 10 pagers). Customers take a pager with their order and it vibrates when ready.',
      outcome: 'The system transformed the food court experience for people with hearing loss and reduced the overall noise level.',
      cost: '$350 per vendor',
      timeframe: '1 day to roll out'
    }
  ],

  resources: [
    {
      title: 'AND Signage Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide to accessible signage design including contrast, symbols, and positioning.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AHRC Customer Service and Disability Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guide to meeting DDA obligations in customer service, including queue management and communication.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Hearing Australia Loop Information',
      url: 'https://www.hearing.com.au/hearing-health/hearing-aids/hearing-loops',
      type: 'guide',
      source: 'Hearing Australia',
      description: 'Information about hearing loop technology, benefits, and installation for service counters.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.4-D-4', questionText: 'Is the queue layout accessible for wheelchair users and people with mobility aids?', relationship: 'Physical layout and communication work together to make queuing accessible.', moduleCode: '2.4' },
    { questionId: '2.4-D-6', questionText: 'Do you offer alternative queue arrangements (e.g., text notification, numbered tickets)?', relationship: 'Alternative queue systems complement communication improvements.', moduleCode: '2.4' },
    { questionId: '2.3-D-5', questionText: 'Is there clear wayfinding signage to key destinations within your venue?', relationship: 'Queue signage is part of the broader venue signage system.', moduleCode: '2.3' }
  ],

  keywords: ['queue signage', 'wait times', 'hearing', 'announcements', 'pagers', 'assistance', 'pre-visit info', 'hearing loop', 'visual display', 'Deaf']
},

// ─── Entry 20: Priority Access and Companion Card ───
{
  questionId: '2.4-D-6',
  questionText: 'Do you offer alternative queue arrangements (e.g., text notification, numbered tickets)?',
  moduleCode: '2.4',
  moduleGroup: 'getting-in',
  diapCategory: 'customer-service',
  title: 'Priority Access and Companion Card',
  coveredQuestionIds: ['2.4-D-14', '2.4-D-15'],
  summary: 'Covers alternative queue systems (numbered tickets, SMS notifications, virtual queues), documented priority access policies, and Companion Card recognition.',
  lastUpdated: '2026-02-25',

  whyItMatters: {
    text: 'Standing in a queue for extended periods can be painful, exhausting, or physically impossible for many people with disability. Conditions such as chronic pain, fatigue syndromes, cardiovascular disease, and joint disorders make prolonged standing a significant barrier. Alternative arrangements let people wait comfortably until their turn. The Companion Card program, active in all Australian states and territories, provides free or discounted entry for a companion or carer who is needed for participation. Without recognising Companion Card, venues impose a financial penalty on disability.',
    statistic: {
      value: '2.1 million',
      context: 'Australians have a physical condition restricting mobility. Many cannot stand in queues for more than a few minutes without pain or risk of falls.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'Bell',
      text: 'Offer take-a-number or SMS queue alternatives.',
      detail: 'A numbered ticket system lets people sit while they wait. SMS or app-based queues let people wait in their car or elsewhere comfortable. Both eliminate the need to stand in line.',
      priority: 1
    },
    {
      icon: 'Phone',
      text: 'Allow phone or online booking to skip the queue.',
      detail: 'For appointment-based services, phone and online booking gives customers certainty and avoids queuing entirely. Mention this option on your website and at the queue.',
      priority: 2
    },
    {
      icon: 'FileText',
      text: 'Document your priority access system on your website and in booking confirmations.',
      detail: 'Write a clear statement of your priority access policy. Publish it on your accessibility page, in booking confirmation emails, and on signage at the venue. Example: "We offer priority access for customers with disability. Please ask a team member or call ahead."',
      priority: 3
    },
    {
      icon: 'Shield',
      text: 'Do not require proof of disability for queue assistance.',
      detail: 'Many disabilities are invisible. Requiring an ACROD permit, medical letter, or other proof creates an unnecessary barrier and can be humiliating. Trust customers who request assistance.',
      priority: 4
    },
    {
      icon: 'CreditCard',
      text: 'Register as a Companion Card affiliate (free).',
      detail: 'Companion Card provides free or discounted entry for a companion who is needed for participation. Registration is free in all states. Display the Companion Card logo at your entrance and on your website.',
      priority: 5
    },
    {
      icon: 'Users',
      text: 'Train staff to offer queue alternatives proactively.',
      detail: 'Staff should be trained to identify customers who may benefit from alternatives (people with visible mobility aids, people in pain, distressed customers) and offer options without being asked.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing priority access and Companion Card',
    steps: [
      { text: 'Check for queue alternatives at every service point: take-a-number, SMS, virtual queue, or booking options.' },
      { text: 'Check your website for priority access information. Is it easy to find? Is it clear and specific?' },
      { text: 'Call your venue as a customer and ask about priority access for someone with a disability. Assess the response.' },
      { text: 'Check your Companion Card registration status. Is the logo displayed at the entrance and on your website?' },
      { text: 'Test any queue alternatives yourself. Do they work smoothly? Can you complete the process from a seated position?' },
      { text: 'Ask three staff members what alternative queue options are available for customers with disability.' }
    ],
    tools: ['Phone for test call', 'Smartphone to check website', 'Notepad'],
    estimatedTime: '15-20 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The DDA requires reasonable adjustments in service delivery. Offering alternative queue arrangements for people who cannot stand in line is a reasonable adjustment.'
    },
    related: [
      { code: 'WCAG2.1-AA', relevance: 'Online booking and queue systems must be accessible, including to screen reader users and people who cannot use a mouse.' },
      { code: 'Access-to-Premises', relevance: 'While primarily a building standard, the intent of accessible premises is undermined if queue management creates service barriers.' }
    ],
    plainEnglish: 'You should offer alternatives to standing in a queue (numbered tickets, SMS, booking ahead) and recognise Companion Card. Document your priority access policy clearly on your website.',
    complianceNote: 'Alternative queue arrangements are not explicitly required by building standards, but they are a reasonable adjustment under the DDA. A customer who cannot access your service because of an inaccessible queue has grounds for a complaint.'
  },

  solutions: [
    {
      title: 'Install a take-a-number system',
      description: 'Set up a simple numbered ticket dispenser so customers can sit while waiting rather than standing in line.',
      resourceLevel: 'low',
      costRange: '$50-200',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Purchase a ticket dispenser and roll of numbered tickets (available from office supply stores, $50-100).',
        'Mount the dispenser at the queue entrance at 900-1200mm height.',
        'Install a "Now Serving" number display visible from the seating area.',
        'Add signage explaining the system: "Take a number and have a seat. We will call your number."',
        'Ensure adequate seating is available with armrests and backrests.',
        'Train all staff to use the system and announce numbers both verbally and on the display.'
      ],
      notes: 'This benefits all customers, not just those with disability. Many businesses report improved customer satisfaction after implementing numbered systems.'
    },
    {
      title: 'Document and publish your priority access procedure',
      description: 'Create a clear written priority access policy and make it available on your website, in booking confirmations, and on signage at the venue.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Write a clear priority access statement. Example: "We welcome customers with disability and offer priority access to reduce wait times. Please ask any team member, call ahead on [number], or press the assistance button at the queue entrance."',
        'Publish the statement on your website\'s accessibility page.',
        'Include it in booking confirmation emails.',
        'Print and display at the venue entrance and at queue entry points.',
        'Brief all staff on the policy and ensure they can describe it to customers.',
        'Review the policy annually and update contact details.'
      ],
      notes: 'A documented policy protects your business as well as serving your customers. It demonstrates a proactive approach to DDA compliance.'
    },
    {
      title: 'Register as a Companion Card affiliate',
      description: 'Register with your state or territory Companion Card program to offer free or discounted entry for companions of cardholders.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Visit the Companion Card website for your state or territory (search "Companion Card [your state]").',
        'Complete the online affiliate registration form (typically 10-15 minutes).',
        'Specify your Companion Card offer (most common: free entry or ticket for the companion).',
        'Download and display the Companion Card logo at your entrance and ticketing points.',
        'Add the Companion Card logo and your offer details to your website.',
        'Train all ticketing and reception staff to recognise and process Companion Cards.',
        'Include Companion Card information in your online booking system if applicable.'
      ],
      notes: 'Companion Card registration is free and typically approved within 2-4 weeks. It signals to customers with disability that your venue is welcoming.'
    }
  ],

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A popular brunch cafe had 30-minute weekend waits with no seating in the queue area. Customers with mobility conditions could not wait.',
      solution: 'Implemented a virtual queue using a free app (Waitwhile). Customers add their name via phone or at the host stand and receive an SMS when their table is ready.',
      outcome: 'Customers can now wait in their car, on a nearby bench, or anywhere comfortable. Walk-away rate dropped 40% and overall customer satisfaction increased.',
      cost: 'Free (app is free for up to 100 customers/month)',
      timeframe: '1 hour to set up'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme Park',
      scenario: 'A theme park had no published access program. Customers with disability had to explain their needs at every ride, often being turned away by staff who did not know the policy.',
      solution: 'Published a comprehensive access program on the website with ride-by-ride accessibility information. Offered a priority access pass at Guest Services with no requirement for proof of disability.',
      outcome: 'Registrations for the access program tripled within 6 months. Customer complaints about ride access dropped to near zero.',
      cost: 'Free (staff time to write and publish)',
      timeframe: '2 weeks to develop and launch'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A zoo charged full price for companions of visitors with disability who needed assistance. Families reported this as a financial barrier.',
      solution: 'Registered as a Companion Card affiliate, offering free entry for the companion. Displayed the Companion Card logo at the entrance and online.',
      outcome: 'Visitation by people with disability increased noticeably. The zoo received positive coverage from disability organisations.',
      cost: 'Free',
      timeframe: '30 minutes to register, 2 weeks for approval'
    }
  ],

  resources: [
    {
      title: 'Waitwhile Virtual Queue Platform',
      url: 'https://www.waitwhile.com/',
      type: 'tool',
      source: 'Waitwhile',
      description: 'Free virtual queue and waitlist management platform for businesses. Customers join via phone, web, or in person and receive SMS notifications.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'AND Inclusive Customer Service Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Comprehensive guide to providing inclusive customer service, including queue management and priority access.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AHRC Reasonable Adjustments Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guide to the concept of reasonable adjustments under the DDA, with examples relevant to queue management and service delivery.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Companion Card Australia',
      url: 'https://www.companioncard.gov.au/',
      type: 'website',
      source: 'Companion Card Australia',
      description: 'National portal for Companion Card information, affiliate registration, and state/territory program links.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    { questionId: '2.4-D-4', questionText: 'Is the queue layout accessible for wheelchair users and people with mobility aids?', relationship: 'Alternative queue arrangements complement physical queue accessibility.', moduleCode: '2.4' },
    { questionId: '2.4-D-5', questionText: 'Is there signage indicating that queue assistance is available for those who need it?', relationship: 'Signage communicates the availability of alternative arrangements.', moduleCode: '2.4' }
  ],

  keywords: ['queue alternative', 'numbered tickets', 'SMS', 'virtual queue', 'priority access', 'Companion Card', 'carer', 'documentation', 'booking', 'pager', 'waitlist']
},

];

export default gettingInHelp;
