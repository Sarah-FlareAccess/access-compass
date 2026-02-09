/**
 * Help Content: Getting In
 * Modules: 2.1, 2.2, 2.3, 2.4
 */

import type { HelpContent } from './types';

export const gettingInHelp: HelpContent[] = [
  // 2.1: Parking
  {
    questionId: '2.1-F-1',
    questionText: 'Is there accessible parking available for customers?',
    moduleCode: '2.1',
    moduleGroup: 'getting-in',
    diapCategory: 'physical-access',
    title: 'Accessible Parking',
    summary: 'Accessible parking spaces are wider, located close to entrances, and designed for people who use wheelchairs, walkers, or have mobility difficulties.',

    whyItMatters: {
      text: 'For many people with disabilities, accessible parking isn\'t a convenience—it\'s essential. The extra width allows space to deploy wheelchair ramps or transfer from car to mobility device. Proximity to entrances reduces fatigue and exposure to hazards.',
      statistic: {
        value: '4.4 million',
        context: 'Australians have a disability. Many rely on accessible parking to participate in community life.',
        source: 'ABS Survey of Disability, Ageing and Carers'
      }
    },

    tips: [
      {
        icon: 'ParkingSquare',
        text: 'Accessible spaces must be close to the accessible entrance (within 30m)',
        detail: 'Measure from the space to the entrance—not the general building.',
        priority: 1
      },
      {
        icon: 'Maximize',
        text: 'Spaces need extra width: 2400mm wide with a 2400mm shared space or 3200mm for single spaces',
        priority: 2
      },
      {
        icon: 'Signpost',
        text: 'Display the international symbol of access on a bollard sign at 1200mm height',
        priority: 3
      },
      {
        icon: 'ArrowRight',
        text: 'Ensure a clear, level path from parking to entrance without steps or obstacles',
        priority: 4
      },
      {
        icon: 'Lightbulb',
        text: 'Good lighting (minimum 40 lux) improves safety and visibility',
        priority: 5
      }
    ],

    standardsReference: {
      primary: {
        code: 'AS1428.1',
        section: 'Section 6',
        requirement: 'Accessible car parking spaces must be provided in accordance with AS2890.6, with accessible path of travel to building entrance.'
      },
      related: [
        {
          code: 'Access-to-Premises',
          relevance: 'Requires accessible parking where car parking is provided, with specific ratios based on total parking spaces.'
        }
      ],
      plainEnglish: 'If you provide parking, you must provide accessible parking spaces. The number required depends on your total parking capacity (e.g., 1 accessible space for 1-50 total spaces).',
      complianceNote: 'Even if not required by building regulations (e.g., older buildings), providing accessible parking is good practice and may be required under the DDA.'
    },

    howToCheck: {
      title: 'Auditing your accessible parking',
      steps: [
        {
          text: 'Measure the space width',
          measurement: { target: 'Space width', acceptable: 'Minimum 2400mm with 2400mm shared zone, or 3200mm single', unit: 'mm' }
        },
        {
          text: 'Measure distance to accessible entrance',
          measurement: { target: 'Distance to entrance', acceptable: 'Maximum 30m', unit: 'm' }
        },
        { text: 'Check signage: Is the international access symbol visible from the driver\'s position?' },
        { text: 'Check the path to entrance: Is it step-free? Any obstacles? Surface condition?' },
        { text: 'Check lighting levels: Can users see clearly at night?' },
        { text: 'Test for obstacles: Is the space ever blocked by bins, deliveries, or other vehicles?' }
      ],
      tools: ['Tape measure (at least 5m)', 'Camera for documentation'],
      estimatedTime: '15-20 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant had accessible parking but it was at the far end of the car park.',
        solution: 'Relocated accessible parking to the space closest to the ramp entrance. Added bollard signage, repainted ground markings, and improved lighting in that area.',
        outcome: 'Customers with mobility requirements can now arrive independently. Staff no longer need to offer to valet park.',
        cost: '$300-500 for signage and paint'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Retail Store',
        scenario: 'A retail store had one accessible space that was often misused.',
        solution: 'Installed a small camera and signage indicating monitoring. Staff were trained to politely request misusers move if noticed. Added a second accessible space.',
        outcome: 'Misuse dropped significantly. Customers appreciated the extra space.',
        cost: '$200 for camera, $500 for new space marking'
      }
    ],

    resources: [
      {
        title: 'AS2890.6 Accessible Parking',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Official standard for accessible parking design.',
        isAustralian: true
      },
      {
        title: 'Accessible Parking Guide',
        url: 'https://humanrights.gov.au/',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Overview of accessible parking requirements.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '2.2-F-1',
        questionText: 'Is there an accessible entrance?',
        relationship: 'Accessible parking must connect to accessible entrance',
        moduleCode: '2.2'
      },
      {
        questionId: '1.1-F-8',
        questionText: 'Do you provide information about accessible transport options?',
        relationship: 'Parking info is part of transport guidance',
        moduleCode: '1.1'
      }
    ],

    keywords: ['parking', 'car park', 'wheelchair parking', 'mobility parking', 'ACROD'],
    lastUpdated: '2024-12-18'
  },

  // 2.2: Entrance
  {
    questionId: '2.2-F-1',
    questionText: 'Is there an accessible entrance to your venue?',
    moduleCode: '2.2',
    moduleGroup: 'getting-in',
    diapCategory: 'physical-access',
    title: 'Accessible Entrance',
    summary: 'An accessible entrance allows everyone to enter independently, including wheelchair users, people with prams, and those with mobility difficulties.',

    whyItMatters: {
      text: 'The entrance is literally the gateway to your business. If someone can\'t get through the door, nothing else matters. An accessible entrance benefits not just wheelchair users but parents with prams, delivery workers, and anyone with temporary mobility issues.',
      quote: {
        text: 'I\'ve turned around at so many venues because I couldn\'t get through the door. It\'s demoralising.',
        attribution: 'Wheelchair user, disability advocacy feedback'
      }
    },

    tips: [
      {
        icon: 'DoorOpen',
        text: 'Doorway must be at least 850mm clear width (1000mm preferred)',
        detail: 'Measure the clear opening, not the door itself.',
        priority: 1
      },
      {
        icon: 'ArrowDown',
        text: 'No steps at entrance—maximum 5mm threshold',
        detail: 'Even a single step can be an absolute barrier.',
        priority: 2
      },
      {
        icon: 'Hand',
        text: 'Door handle should be lever-style at 900-1100mm height',
        detail: 'Knobs are difficult for people with limited grip strength.',
        priority: 3
      },
      {
        icon: 'Gauge',
        text: 'Door opening force should be 20 Newtons or less',
        detail: 'Heavy doors are a barrier. Consider automatic or power-assist.',
        priority: 4
      },
      {
        icon: 'Signpost',
        text: 'If main entrance isn\'t accessible, clearly sign the accessible entrance',
        priority: 5
      }
    ],

    standardsReference: {
      primary: {
        code: 'AS1428.1',
        section: 'Section 13',
        requirement: 'Doorways must provide a minimum 850mm clear opening width. Thresholds must not exceed 5mm. Door handles must be operable with one hand without tight grasping.'
      },
      related: [
        {
          code: 'Access-to-Premises',
          relevance: 'Requires an accessible path of travel from entrance to all publicly accessible areas.'
        },
        {
          code: 'NCC',
          relevance: 'Building Code includes accessibility requirements for new construction and major renovations.'
        }
      ],
      plainEnglish: 'Your main entrance (or at least one entrance) must be accessible. This means: wide enough for wheelchairs, no steps, doors that open easily, and handles that work with limited hand function.',
      complianceNote: 'Older buildings may have exemptions for structural changes, but you should still make reasonable adjustments where possible.'
    },

    howToCheck: {
      title: 'Checking your entrance accessibility',
      steps: [
        {
          text: 'Measure the clear door opening width',
          measurement: { target: 'Clear opening', acceptable: 'Minimum 850mm', unit: 'mm' }
        },
        {
          text: 'Check for steps or thresholds',
          measurement: { target: 'Threshold height', acceptable: 'Maximum 5mm', unit: 'mm' }
        },
        { text: 'Check door handle type: Is it a lever (good) or knob (barrier)?' },
        { text: 'Test door opening force: Can you open it with one finger? Too heavy needs power assist.' },
        { text: 'Check approach: Is there level landing space (1500mm x 1500mm) in front of door?' },
        { text: 'Look for signage: If not the main entrance, is it clearly signed?' }
      ],
      tools: ['Tape measure', 'Force gauge (optional, or just test by feel)'],
      estimatedTime: '10-15 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Cafe',
        scenario: 'A cafe had a beautiful heritage entrance with two steps.',
        solution: 'Installed a portable ramp stored inside near the door. Added a doorbell at wheelchair height. Trained staff to deploy ramp immediately when the bell rings.',
        outcome: 'Wheelchair users can enter with minimal wait. Staff report it\'s become routine.',
        cost: '$400 for portable ramp, $50 for doorbell'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shop',
        scenario: 'A shop had a heavy glass door that was difficult for many customers.',
        solution: 'Installed an automatic door opener activated by a push button at wheelchair height and a motion sensor for ambulant customers.',
        outcome: 'Easier entry for everyone. Parents with prams particularly appreciated it.',
        cost: '$2,000-4,000 depending on door type'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'B&B',
        scenario: 'A B&B\'s main entrance had steps, but there was a side entrance at ground level.',
        solution: 'Made the side entrance the designated accessible entrance. Added signage at front directing people there, improved lighting and path surface, and ensured it was unlocked during business hours.',
        outcome: 'Guests with mobility needs can enter independently. Clear signage means they don\'t arrive at the wrong door.',
        cost: '$200 for signage and path improvements'
      }
    ],

    solutions: [
      {
        title: 'Doorbell at wheelchair height',
        description: 'Install a simple doorbell or call button at 900mm height so customers can request assistance getting through the door.',
        resourceLevel: 'low',
        costRange: '$30-80',
        timeRequired: '30 minutes',
        implementedBy: 'diy',
        impact: 'quick-win',
        steps: [
          'Purchase a wireless doorbell or call button',
          'Mount at 900mm height beside the door',
          'Add signage: "Press for assistance"',
          'Train staff to respond immediately'
        ],
        notes: 'A temporary solution while planning more permanent improvements. Ensure staff respond within 30 seconds.'
      },
      {
        title: 'Replace door handle with lever',
        description: 'Swap round doorknobs for lever-style handles that can be operated with one hand, a closed fist, or an elbow.',
        resourceLevel: 'low',
        costRange: '$50-150',
        timeRequired: '1-2 hours',
        implementedBy: 'diy',
        impact: 'moderate',
        steps: [
          'Measure your door thickness and backset',
          'Purchase compatible lever handles',
          'Remove existing hardware',
          'Install new lever handles',
          'Test that door still closes and latches properly'
        ]
      },
      {
        title: 'Portable ramp for steps',
        description: 'Purchase a high-quality portable ramp for entrances with 1-2 steps. Store near the door with staff trained to deploy it quickly.',
        resourceLevel: 'low',
        costRange: '$300-600',
        timeRequired: '1 hour setup',
        implementedBy: 'staff',
        impact: 'significant',
        steps: [
          'Measure the height of steps to determine ramp length needed',
          'Purchase ramp with non-slip surface (ensure 1:8 or gentler gradient)',
          'Designate storage location just inside the door',
          'Add "Ramp Available" signage at entrance',
          'Train all staff on quick deployment'
        ],
        notes: 'Check gradient: for 150mm step, you need at least 1.2m ramp length for safe gradient.'
      },
      {
        title: 'Door pressure adjustment',
        description: 'Adjust the door closer to reduce opening force. Most closers have adjustment screws that can reduce resistance.',
        resourceLevel: 'low',
        costRange: 'Free - $100',
        timeRequired: '30 minutes',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Locate the door closer mechanism at top of door',
          'Find the adjustment screws (usually labelled S, L, BC)',
          'Turn screws counter-clockwise to reduce force',
          'Test until door can be opened with one finger but still closes properly',
          'If adjustment insufficient, consider replacing closer'
        ]
      },
      {
        title: 'Door hold-open device',
        description: 'Install a magnetic hold-open device that keeps the door open during business hours, removing the door barrier entirely.',
        resourceLevel: 'medium',
        costRange: '$150-400',
        timeRequired: '2-4 hours',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Check fire regulations—fire doors may need special hold-open devices',
          'Select appropriate device (magnetic with fire alarm release for fire doors)',
          'Install floor plate or wall mount',
          'Connect to fire alarm if required',
          'Train staff on operation'
        ],
        notes: 'Must comply with fire safety requirements. Fire doors need devices that release automatically on alarm.'
      },
      {
        title: 'Power-assist door opener',
        description: 'Install a push-button operated power assist that helps swing the door open when activated.',
        resourceLevel: 'medium',
        costRange: '$1,500-3,000',
        timeRequired: '4-8 hours',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Assess door type and frame condition',
          'Get quotes from accessibility equipment suppliers',
          'Schedule installation (usually half day)',
          'Mount activation button at accessible height (900-1100mm)',
          'Test and adjust opening speed'
        ]
      },
      {
        title: 'Fully automatic sliding door',
        description: 'Replace the manual door with automatic sliding doors that open via motion sensor—the gold standard for accessibility.',
        resourceLevel: 'high',
        costRange: '$5,000-15,000',
        timeRequired: '1-2 days',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Consult with door automation specialist',
          'Assess structural requirements and power supply',
          'Select door style (sliding preferred for accessibility)',
          'Schedule installation',
          'Configure motion sensors for appropriate sensitivity',
          'Arrange regular maintenance schedule'
        ],
        notes: 'Consider glass safety requirements and emergency breakout functionality.'
      },
      {
        title: 'Permanent ramped entrance',
        description: 'Construct a permanent ramp compliant with AS1428.1, fully integrated with your building entrance.',
        resourceLevel: 'high',
        costRange: '$5,000-20,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Engage access consultant to design compliant ramp',
          'Check council permits and heritage requirements',
          'Get quotes from builders experienced in access work',
          'Construction typically takes 3-5 days',
          'Include handrails, tactile indicators, and edge protection',
          'Ensure landing areas at top and bottom'
        ],
        notes: 'Cost varies significantly based on height change, material choice, and site conditions. Heritage buildings may need special approvals.'
      }
    ],

    resources: [
      {
        title: 'AS1428.1 Door Requirements Summary',
        url: 'https://www.abcb.gov.au/',
        type: 'guide',
        source: 'Australian Building Codes Board',
        description: 'Summary of accessible door requirements.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Portable Ramp Guide',
        url: 'https://www.and.org.au/',
        type: 'guide',
        source: 'Australian Network on Disability',
        description: 'Guidance on using portable ramps as a reasonable adjustment.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '2.2-F-3',
        questionText: 'Do you have a ramp at the entrance?',
        relationship: 'Ramps overcome steps at entrances',
        moduleCode: '2.2'
      },
      {
        questionId: '2.1-F-1',
        questionText: 'Is there accessible parking?',
        relationship: 'Parking should connect to accessible entrance',
        moduleCode: '2.1'
      }
    ],

    keywords: ['entrance', 'door', 'doorway', 'ramp', 'steps', 'threshold', 'automatic door'],
    lastUpdated: '2024-12-18'
  },

  // 2.2: Ramps
  {
    questionId: '2.2-F-3',
    questionText: 'If there are steps, is there a ramp or alternative accessible entrance?',
    moduleCode: '2.2',
    moduleGroup: 'getting-in',
    diapCategory: 'physical-access',
    title: 'Ramps and Step-Free Access',
    summary: 'Ramps provide step-free access for wheelchair users, people with mobility aids, prams, and anyone who struggles with stairs.',

    whyItMatters: {
      text: 'Steps are the most common barrier to physical access. A single step can completely prevent entry for many wheelchair users. Ramps must be designed correctly—too steep and they become dangerous; too narrow and they\'re unusable.',
      statistic: {
        value: '1.1 million',
        context: 'Australians use a mobility aid. Ramps enable their independence.',
        source: 'ABS Survey of Disability, Ageing and Carers'
      }
    },

    tips: [
      {
        icon: 'TrendingUp',
        text: 'Maximum gradient is 1:14 (7%) for new ramps, 1:8 (12.5%) for short existing ramps',
        detail: 'Measure the rise (height) and run (length) to calculate gradient.',
        priority: 1
      },
      {
        icon: 'Maximize',
        text: 'Minimum width 1000mm (1200mm preferred)',
        priority: 2
      },
      {
        icon: 'Hand',
        text: 'Handrails on both sides at 865-1000mm height',
        detail: 'Handrails provide safety and support for ambulant people.',
        priority: 3
      },
      {
        icon: 'Square',
        text: 'Level landings at top and bottom (1200mm x 1200mm minimum)',
        detail: 'Allows wheelchair users to stop safely before doors.',
        priority: 4
      },
      {
        icon: 'AlertTriangle',
        text: 'Tactile ground surface indicators at top and bottom for people with vision impairment',
        priority: 5
      }
    ],

    standardsReference: {
      primary: {
        code: 'AS1428.1',
        section: 'Section 10',
        requirement: 'Ramps must have a maximum gradient of 1:14, minimum width of 1000mm, handrails on both sides, and landing areas at intervals of 9m maximum.'
      },
      related: [
        {
          code: 'AS1428.4.1',
          relevance: 'Specifies requirements for tactile ground surface indicators at ramps.'
        }
      ],
      plainEnglish: 'Ramps must be gentle enough to wheel up (1:14 means 1m height over 14m length), wide enough for wheelchairs, and have handrails for safety.',
      complianceNote: 'Portable ramps are acceptable for minor level changes but must still meet gradient requirements and be available when needed.'
    },

    howToCheck: {
      title: 'Measuring your ramp',
      steps: [
        {
          text: 'Measure the rise (vertical height) and run (horizontal length)',
          measurement: { target: 'Gradient', acceptable: 'Maximum 1:14 (or 1:8 for short ramps under 1900mm)', unit: 'ratio' }
        },
        {
          text: 'Measure ramp width',
          measurement: { target: 'Width', acceptable: 'Minimum 1000mm', unit: 'mm' }
        },
        { text: 'Check handrails: Are they on both sides? Correct height (865-1000mm)? Continuous?' },
        { text: 'Check landing areas at top and bottom: At least 1200mm x 1200mm?' },
        { text: 'Check surface: Is it non-slip, even when wet?' },
        { text: 'Check for edge protection: Kerbs or rails to prevent wheelchairs rolling off?' },
        { text: 'Check for tactile indicators at top and bottom' }
      ],
      tools: ['Tape measure (5m+)', 'Spirit level or inclinometer app', 'Camera for documentation'],
      estimatedTime: '15-20 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant had a single step at the entrance, creating a barrier for wheelchair users.',
        solution: 'Installed a small permanent ramp at the side of the step. Added handrail on wall side. The ramp has a gentle 1:12 gradient and is only 1.5m long.',
        outcome: 'Seamless entry for all customers. The ramp is visually integrated with the entrance design.',
        cost: '$3,000-5,000 for custom ramp'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shop',
        scenario: 'A heritage building couldn\'t have permanent modifications to its entrance steps.',
        solution: 'Purchased a high-quality portable ramp (1.2m) with non-slip surface. Stored just inside the door with a "Ramp Available" sign. Staff trained to deploy it immediately upon request or when they see someone approaching with a wheelchair.',
        outcome: 'Wheelchair users can enter within 30 seconds of arrival. Staff view it as normal procedure.',
        cost: '$400-600 for quality portable ramp'
      }
    ],

    resources: [
      {
        title: 'Ramp Gradient Calculator',
        url: 'https://www.visionaustralia.org/',
        type: 'tool',
        source: 'Vision Australia',
        description: 'Tool to calculate if your ramp meets requirements.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'AS1428.1 Ramp Requirements',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Official standard for accessible ramp design.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '2.2-F-1',
        questionText: 'Is there an accessible entrance?',
        relationship: 'Ramps are part of creating accessible entrances',
        moduleCode: '2.2'
      }
    ],

    keywords: ['ramp', 'gradient', 'slope', 'steps', 'handrail', 'portable ramp'],
    lastUpdated: '2024-12-18'
  }
];

export default gettingInHelp;
