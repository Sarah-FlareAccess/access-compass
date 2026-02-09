/**
 * Help Content: Service & Support
 * Modules: 4.2, 4.3, 4.4, 4.5, 5.1
 */

import type { HelpContent } from './types';

export const serviceSupportHelp: HelpContent[] = [
  // 4.2: Staff and Customer Service
  {
    questionId: '4.2-F-1b',
    questionText: 'Do you provide disability inclusion training to staff for an inclusive culture?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'people-culture',
    title: 'Disability Inclusion Training',
    summary: 'Disability inclusion training helps staff understand different disabilities, communicate effectively, and provide welcoming service to all customers.',

    whyItMatters: {
      text: 'Even the most accessible venue can feel unwelcoming if staff don\'t know how to interact with customers with disabilities. Training builds confidence, reduces awkwardness, and creates a genuinely inclusive culture—not just accessible infrastructure.',
      quote: {
        text: 'The physical access was fine, but the staff treated me like I was invisible—talked to my companion instead of me. That\'s what I remember.',
        attribution: 'Wheelchair user, customer feedback'
      }
    },

    tips: [
      {
        icon: 'Users',
        text: 'Include all customer-facing staff, not just managers',
        priority: 1
      },
      {
        icon: 'UserCheck',
        text: 'Training should be delivered by people with lived experience of disability',
        detail: 'This creates authentic learning and lasting impact.',
        priority: 2
      },
      {
        icon: 'RefreshCw',
        text: 'Make training ongoing, not a one-off session',
        detail: 'Annual refresher plus induction for new staff.',
        priority: 3
      },
      {
        icon: 'MessageCircle',
        text: 'Focus on respectful communication: ask, don\'t assume',
        priority: 4
      },
      {
        icon: 'Lightbulb',
        text: 'Cover your specific accessibility features so staff can guide customers',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Implementing disability training',
      steps: [
        { text: 'Audit current training: Does it include disability awareness? When was it last updated?' },
        { text: 'Identify training providers: Look for organisations led by people with disabilities' },
        { text: 'Decide on format: Online modules for basics, face-to-face for deeper learning' },
        { text: 'Include your venue\'s specific accessibility features in training' },
        { text: 'Train staff on any equipment: hearing loops, portable ramps, evacuation procedures' },
        { text: 'Create quick reference guides for staff (what to do, where things are)' },
        { text: 'Gather feedback from customers with disabilities to identify training gaps' }
      ],
      estimatedTime: '2-4 hours for initial training'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel chain wanted to improve service for guests with disabilities.',
        solution: 'Partnered with a disability-led training organisation. All front desk and housekeeping staff completed a 3-hour face-to-face session. Online refresher modules are completed annually. Training covers: communication with guests who are deaf/blind/have intellectual disability, how to describe accessible rooms accurately, evacuation procedures.',
        outcome: 'Staff report feeling more confident. Guest satisfaction scores for accessibility improved 25%.',
        cost: '$100-200 per staff member for quality training'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant group wanted to create a more inclusive culture.',
        solution: 'Developed in-house training with input from disability consultants. Key modules: disability etiquette basics (1 hour online), guide dog awareness, how to read a menu to a customer with vision impairment, handling loud sensory environments for anxious customers.',
        outcome: 'Staff members share positive customer interactions in team meetings. Several have suggested their own improvements.',
        cost: '$500 initial development, then staff time only'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre wanted to become autism-friendly.',
        solution: 'Staff across all stores completed autism awareness training, including: recognising signs of sensory overload, how to offer help without being intrusive, directing customers to quiet spaces, and using visual supports.',
        outcome: 'Centre achieved Autism Friendly certification. Parents of autistic children specifically recommend the centre.',
        cost: '$80 per staff member for certified training'
      }
    ],

    resources: [
      {
        title: 'Australian Network on Disability - Training',
        url: 'https://www.and.org.au/',
        type: 'website',
        source: 'AND',
        description: 'Disability awareness training programs for businesses.',
        isAustralian: true
      },
      {
        title: 'Get Skilled Access',
        url: 'https://www.getskilledaccess.com.au/',
        type: 'website',
        source: 'Get Skilled Access',
        description: 'Accessibility training and consulting led by people with disabilities.',
        isAustralian: true
      },
      {
        title: 'JobAccess - Employer Resources',
        url: 'https://www.jobaccess.gov.au/',
        type: 'guide',
        source: 'Australian Government',
        description: 'Resources for employing and serving people with disabilities.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Part of broader disability awareness training',
        moduleCode: '4.2'
      },
      {
        questionId: '4.2-D-18b',
        questionText: 'Can staff access Auslan interpretation services when needed?',
        relationship: 'Training should cover when and how to access interpreters',
        moduleCode: '4.2'
      }
    ],

    keywords: ['training', 'staff', 'disability awareness', 'inclusive culture', 'customer service'],
    lastUpdated: '2024-12-18'
  },

  // 5.1: Policy & Procurement
  {
    questionId: '5.1-F-2',
    questionText: 'Do you provide information about accessibility practices to procurement partners to support inclusive service delivery?',
    moduleCode: '5.1',
    moduleGroup: 'service-support',
    diapCategory: 'operations-policy-procedure',
    title: 'Accessible Procurement',
    summary: 'Accessible procurement means considering accessibility when selecting suppliers, contractors, and partners—ensuring your whole supply chain supports inclusion.',

    whyItMatters: {
      text: 'Your accessibility efforts can be undermined by third parties who don\'t share your standards. From catering to entertainment to technology vendors, every supplier interaction potentially affects customers with disabilities.',
      statistic: {
        value: '$54 billion',
        context: 'is spent annually by Australians with disabilities. Accessible procurement opens doors to this market.',
        source: 'AND Disability Confidence Report'
      }
    },

    tips: [
      {
        icon: 'FileCheck',
        text: 'Include accessibility requirements in tender documents and contracts',
        priority: 1
      },
      {
        icon: 'MessageSquare',
        text: 'Ask suppliers about their accessibility practices during selection',
        priority: 2
      },
      {
        icon: 'Users',
        text: 'Prefer suppliers with demonstrated accessibility credentials',
        detail: 'Look for Disability Confident Recruiters, AND members, or accessibility certifications.',
        priority: 3
      },
      {
        icon: 'ClipboardCheck',
        text: 'Include accessibility in performance reviews of ongoing suppliers',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing procurement for accessibility',
      steps: [
        { text: 'Review current tender/contract templates: Do they mention accessibility?' },
        { text: 'Identify key supplier categories that impact customer experience' },
        { text: 'Develop accessibility questions for supplier evaluation' },
        { text: 'Add accessibility clauses to standard contracts' },
        { text: 'Brief procurement staff on why accessibility matters' },
        { text: 'Consider weighting accessibility criteria in tender evaluation' }
      ],
      estimatedTime: '1-2 hours to review and update templates'
    },

    examples: [
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Conference Venue',
        scenario: 'A venue found that catering suppliers didn\'t understand accessibility requirements for events.',
        solution: 'Added accessibility clause to all catering contracts requiring: staff awareness training, clear allergen labelling, assistance available for guests with mobility/vision impairment, and flexible service arrangements.',
        outcome: 'Caterers now proactively ask about accessibility needs. Guest feedback improved.',
        cost: 'Nil (contract update only)'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council\'s new website wasn\'t accessible because the vendor didn\'t prioritise it.',
        solution: 'Updated all IT procurement to require WCAG 2.1 AA compliance, accessibility testing evidence, and ongoing accessibility maintenance. Vendors must demonstrate previous accessible projects.',
        outcome: 'All new digital products meet accessibility standards. Vendor accountability is clear.',
        cost: 'Nil (procurement policy update)'
      }
    ],

    resources: [
      {
        title: 'Accessible Procurement Guide',
        url: 'https://www.and.org.au/',
        type: 'guide',
        source: 'Australian Network on Disability',
        description: 'Guide to including accessibility in procurement processes.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Social Procurement Framework',
        url: 'https://www.buyingfor.vic.gov.au/',
        type: 'guide',
        source: 'Victorian Government',
        description: 'Framework for including social outcomes in procurement.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '5.1-F-1',
        questionText: 'Do you have a formal accessibility policy?',
        relationship: 'Procurement is often part of accessibility policy',
        moduleCode: '5.1'
      },
      {
        questionId: '5.1-F-3',
        questionText: 'Do you have a Disability Inclusion Action Plan?',
        relationship: 'DIAP often includes procurement commitments',
        moduleCode: '5.1'
      }
    ],

    keywords: ['procurement', 'suppliers', 'contracts', 'tenders', 'vendors'],
    lastUpdated: '2024-12-18'
  },

  // 5.1: Companion Card
  {
    questionId: '5.1-F-4',
    questionText: 'Are you registered as a Companion Card affiliate?',
    moduleCode: '5.1',
    moduleGroup: 'service-support',
    diapCategory: 'operations-policy-procedure',
    title: 'Companion Card Program',
    summary: 'The Companion Card provides free or discounted entry for support workers or carers accompanying people with significant disabilities who require attendant care.',

    whyItMatters: {
      text: 'Many people with disabilities require a support person to access venues and services. Without the Companion Card, they effectively pay double—once for themselves and once for their carer. This creates a significant financial barrier to participation.',
      statistic: {
        value: '450,000+',
        context: 'Companion Cards have been issued across Australia.',
        source: 'Companion Card National Network'
      }
    },

    tips: [
      {
        icon: 'CreditCard',
        text: 'Registration is free—there\'s no cost to become an affiliate',
        priority: 1
      },
      {
        icon: 'BadgeCheck',
        text: 'Display the Companion Card logo at entry points and on your website',
        priority: 2
      },
      {
        icon: 'Users',
        text: 'Train staff to recognise the card and process it correctly',
        priority: 3
      },
      {
        icon: 'Ticket',
        text: 'The cardholder pays; the companion gets free entry',
        detail: 'Cardholders still pay standard admission—the companion\'s entry is what\'s waived.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Becoming a Companion Card affiliate',
      steps: [
        { text: 'Visit your state/territory\'s Companion Card website' },
        { text: 'Complete the online affiliate registration (5-10 minutes)' },
        { text: 'Download and display the Companion Card logo' },
        { text: 'Train staff: what the card looks like, how to check validity, what to charge' },
        { text: 'Update ticketing systems if applicable' },
        { text: 'Promote your affiliate status on your website and marketing' }
      ],
      estimatedTime: '15-30 minutes to register, 30 minutes for staff briefing'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Zoo',
        scenario: 'A zoo was charging full price for carers of visitors with disabilities.',
        solution: 'Registered as a Companion Card affiliate. Updated ticketing system to apply companion discount automatically. Added Companion Card info to website accessibility page.',
        outcome: 'Families with a member who has a disability can visit affordably. Positive word of mouth in disability community.',
        cost: 'Free (small revenue impact offset by increased visitation)'
      },
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Theatre',
        scenario: 'A theatre didn\'t know about the Companion Card program.',
        solution: 'Registered online in 15 minutes. Box office staff were briefed on the program. Added companion seating option to online booking.',
        outcome: 'Increased attendance from people with disabilities. Staff appreciate the clear, consistent policy.',
        cost: 'Free'
      }
    ],

    resources: [
      {
        title: 'Companion Card NSW',
        url: 'https://www.companioncard.nsw.gov.au/',
        type: 'website',
        source: 'NSW Government',
        description: 'Information and affiliate registration for NSW.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Companion Card Victoria',
        url: 'https://www.companioncard.vic.gov.au/',
        type: 'website',
        source: 'Victorian Government',
        description: 'Information and affiliate registration for Victoria.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Companion Card National Network',
        url: 'https://www.companioncard.gov.au/',
        type: 'website',
        source: 'Australian Government',
        description: 'Links to all state and territory Companion Card programs.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '5.1-F-5',
        questionText: 'Do you have accessible pricing options?',
        relationship: 'Companion Card is part of accessible pricing strategy',
        moduleCode: '5.1'
      }
    ],

    keywords: ['companion card', 'carer', 'support worker', 'free entry', 'concession'],
    lastUpdated: '2024-12-18'
  },

  // 4.2: Auslan interpretation
  {
    questionId: '4.2-D-18b',
    questionText: 'Can staff access Auslan interpretation services when needed?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Auslan Interpretation Services',
    summary: 'Auslan (Australian Sign Language) interpreters enable communication between Deaf customers and your staff, ensuring equal access to services.',

    whyItMatters: {
      text: 'For Deaf Australians, Auslan is their first language. Written English may be a second language they find challenging. Providing access to Auslan interpretation shows respect for Deaf culture and ensures effective communication.',
      statistic: {
        value: '30,000+',
        context: 'Australians use Auslan as their primary language.',
        source: 'Deaf Australia'
      }
    },

    tips: [
      {
        icon: 'Video',
        text: 'Video Remote Interpreting (VRI) provides instant access without booking',
        detail: 'Services like Auslan Connections offer on-demand video interpreting.',
        priority: 1
      },
      {
        icon: 'Calendar',
        text: 'For planned appointments, book an on-site interpreter in advance',
        priority: 2
      },
      {
        icon: 'Phone',
        text: 'Know how to access the National Relay Service for phone communication',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Train staff on how to work with an interpreter',
        detail: 'Speak to the Deaf person, not the interpreter. Maintain normal pace.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Setting up Auslan access',
      steps: [
        { text: 'Identify a Video Remote Interpreting service and create an account' },
        { text: 'Ensure you have a device with camera/screen available (tablet works well)' },
        { text: 'Test the service before you need it' },
        { text: 'Identify local on-site interpreter providers for scheduled appointments' },
        { text: 'Train staff: when to offer interpreting, how to access it, basic interpreter etiquette' },
        { text: 'Add information about Auslan access to your accessibility page' }
      ],
      estimatedTime: '1 hour to set up, 30 minutes for staff training'
    },

    examples: [
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Medical Practice',
        scenario: 'A medical practice struggled to communicate with Deaf patients.',
        solution: 'Subscribed to a Video Remote Interpreting service. Tablet kept at reception. Interpreters available within minutes for consultations. On-site interpreters booked for complex procedures.',
        outcome: 'Deaf patients can access care independently. Doctors report better consultations.',
        cost: '$2-3 per minute for VRI, $100+ per hour for on-site'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council wanted to make public consultations accessible to Deaf residents.',
        solution: 'Now books Auslan interpreters for all major public meetings. Promotes interpreted sessions in Deaf community networks. VRI available for counter enquiries.',
        outcome: 'Deaf residents actively participate in consultations. Council received positive media coverage.',
        cost: '$200-300 per meeting for interpreters'
      }
    ],

    resources: [
      {
        title: 'Auslan Connections',
        url: 'https://www.auslanconnections.com.au/',
        type: 'website',
        source: 'Auslan Connections',
        description: 'Video Remote Interpreting and on-site interpreter bookings.',
        isAustralian: true
      },
      {
        title: 'National Relay Service',
        url: 'https://www.communications.gov.au/what-we-do/phone/services-people-disability/accesshub/national-relay-service',
        type: 'website',
        source: 'Australian Government',
        description: 'Free phone relay service for Deaf and hearing-impaired Australians.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Deaf Australia',
        url: 'https://deafaustralia.org.au/',
        type: 'website',
        source: 'Deaf Australia',
        description: 'Peak body for Deaf community—resources on Deaf culture and access.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '3.3-1-8',
        questionText: 'Do you offer assisted listening devices or hearing augmentation?',
        relationship: 'Both support people who are Deaf or hard of hearing',
        moduleCode: '3.3'
      },
      {
        questionId: '4.2-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Staff awareness complements interpreter services',
        moduleCode: '4.2'
      }
    ],

    keywords: ['auslan', 'sign language', 'deaf', 'interpreter', 'VRI', 'relay service'],
    lastUpdated: '2024-12-18'
  }
];

export default serviceSupportHelp;
