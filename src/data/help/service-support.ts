/**
 * Help Content: Service & Support
 * Modules: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1
 *
 * 26 consolidated entries covering all substantive questions across
 * modules 4.1-4.7 using coveredQuestionIds pattern.
 * Plus 2 legacy entries for module 5.1 (Organisation).
 */

import type { HelpContent } from './types';

export const serviceSupportHelp: HelpContent[] = [
  // =============================================
  // MODULE 4.1: Ways to reach us (4 entries)
  // =============================================

  {
    questionId: '4.1-PC-1',
    questionText: 'Do you offer alternatives to phone calls for customers who cannot or prefer not to use voice telephone?',
    moduleCode: '4.1',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Multi-Channel Contact Options',
    summary: 'Offering multiple ways for customers to reach you (email, text, chat, in-person) ensures people who cannot use voice calls still have equal access to your services.',

    whyItMatters: {
      text: 'Phone calls are impossible or very difficult for many people, including those who are Deaf, have speech disabilities, experience phone anxiety, or use communication devices. If your phone number is the only prominent contact option, you are excluding a significant portion of the community.',
      statistic: {
        value: '1 in 6',
        context: 'Australians have some form of hearing loss, and many cannot use standard voice calls.',
        source: 'Hearing Australia'
      }
    },

    tips: [
      {
        icon: 'MessageSquare',
        text: 'Offer at least three contact methods: phone, email, and one real-time option (chat or SMS)',
        priority: 1
      },
      {
        icon: 'Eye',
        text: 'Display all contact options equally prominently on your website and materials',
        detail: 'Do not bury email or chat behind a phone number. List all options side by side.',
        priority: 2
      },
      {
        icon: 'Clock',
        text: 'Respond to non-phone enquiries within the same timeframe as phone calls',
        priority: 3
      },
      {
        icon: 'Send',
        text: 'Respond in the customer\'s preferred format, not just your default',
        priority: 4
      },
      {
        icon: 'Clipboard',
        text: 'Ensure feedback and complaints can be submitted through all channels, not just online forms',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Auditing your contact channels',
      steps: [
        { text: 'List every way a customer can currently contact you (phone, email, form, chat, SMS, social media, in-person)' },
        { text: 'Check your website: Is the phone number larger or more prominent than other options?' },
        { text: 'Test each channel yourself. How long does a response take compared to a phone call?' },
        { text: 'Ask whether complaint and feedback processes accept all the same channels' },
        { text: 'Check that all channels are staffed during the same hours, or clearly state availability' },
        { text: 'Review printed materials (brochures, signage) for contact diversity' }
      ],
      estimatedTime: '30-60 minutes'
    },

    standardsReference: {
      primary: {
        code: 'DDA',
        section: 'Part 2, Division 2',
        requirement: 'It is unlawful to discriminate in the provision of goods, services, or facilities.'
      },
      related: [
        {
          code: 'WCAG2.2-AA',
          relevance: 'Online contact forms and chat must meet WCAG 2.2 Level AA for keyboard and screen reader access.'
        }
      ],
      plainEnglish: 'Under the Disability Discrimination Act, businesses must not make it harder for people with disabilities to access services. If phone-only contact creates a barrier, you need to provide accessible alternatives.'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel received complaints that guests with hearing loss could not make reservations because the booking line was phone-only.',
        solution: 'Added email booking, live chat on the website, and SMS enquiry option. All channels feed into the same booking system with equal priority.',
        outcome: 'Booking enquiries from people with hearing loss increased. Average response time for non-phone channels matched phone within two weeks.',
        cost: '$500-1,500 for chat integration; email is free'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council\'s customer service centre only accepted enquiries by phone or in-person visit.',
        solution: 'Implemented an online enquiry form (WCAG 2.2 compliant), email address, and SMS number. Trained staff to treat all channels equally in the queue.',
        outcome: 'Enquiries from residents with disabilities increased 40%. Satisfaction scores improved.',
        cost: '$2,000-5,000 for form and SMS setup'
      },
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Medical Practice',
        scenario: 'Patients who are Deaf could not book appointments because reception only took phone calls.',
        solution: 'Added online booking through an accessible portal and an SMS appointment line. Confirmations sent by the patient\'s preferred method.',
        outcome: 'Deaf patients can now book independently. Practice reports fewer no-shows due to text reminders.',
        cost: '$1,000-3,000 for booking system upgrade'
      }
    ],

    solutions: [
      {
        title: 'Add email and SMS contact options',
        description: 'Set up a monitored email address and SMS number as equal contact channels.',
        resourceLevel: 'low',
        costRange: 'Free-$200',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Create a dedicated customer enquiry email address',
          'Set up an SMS-capable phone number (many business phone plans include this)',
          'Add both to your website contact page with equal prominence to your phone number',
          'Update printed materials (business cards, brochures, signage) with all contact methods',
          'Set up email/SMS notifications so staff respond promptly',
          'Establish a response time target matching phone (e.g., within 1 business day)'
        ]
      },
      {
        title: 'Implement accessible live chat',
        description: 'Add a WCAG-compliant live chat widget to your website for real-time text communication.',
        resourceLevel: 'medium',
        costRange: '$500-2,000/year',
        timeRequired: '1-2 days',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Research chat platforms that meet WCAG 2.2 Level AA (check vendor accessibility statements)',
          'Install the chat widget on key pages (contact, booking, homepage)',
          'Test with keyboard-only navigation and a screen reader',
          'Train staff on chat etiquette: allow extra time, use plain language, confirm understanding',
          'Set clear availability hours and provide an alternative when chat is offline',
          'Monitor chat transcripts for accessibility improvement opportunities'
        ]
      },
      {
        title: 'Unified multi-channel enquiry system',
        description: 'Implement a single system that routes phone, email, chat, and SMS into one queue with equal priority.',
        resourceLevel: 'high',
        costRange: '$3,000-10,000',
        timeRequired: '2-4 weeks',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Select a customer service platform that supports phone, email, chat, SMS, and social media',
          'Configure routing so all channels enter the same priority queue',
          'Set up auto-responses confirming receipt on each channel',
          'Train all customer service staff on handling enquiries across channels',
          'Create response templates that work across all channels',
          'Establish and publish service level agreements for each channel',
          'Report on response times by channel monthly to identify gaps'
        ]
      }
    ],

    resources: [
      {
        title: 'National Relay Service',
        url: 'https://www.communications.gov.au/what-we-do/phone/services-people-disability/accesshub/national-relay-service',
        type: 'website',
        source: 'Australian Government',
        description: 'Free phone relay for Deaf and hearing-impaired Australians. Your staff should know how to receive NRS calls.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Accessible Customer Service Guide',
        url: 'https://www.and.org.au/',
        type: 'guide',
        source: 'Australian Network on Disability',
        description: 'Practical guidance on making customer service channels accessible.',
        isAustralian: true
      },
      {
        title: 'WCAG 2.2 Quick Reference',
        url: 'https://www.w3.org/WAI/WCAG22/quickref/',
        type: 'website',
        source: 'W3C',
        description: 'Reference for ensuring digital contact channels meet accessibility standards.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.1-PC-2',
        questionText: 'Are your staff trained to receive calls via the National Relay Service?',
        relationship: 'NRS is a key alternative to standard phone calls',
        moduleCode: '4.1'
      },
      {
        questionId: '4.5-F-1',
        questionText: 'Do you have a way for customers to provide feedback about accessibility?',
        relationship: 'Feedback channels should also be multi-format',
        moduleCode: '4.5'
      }
    ],

    coveredQuestionIds: ['4.1-PC-4', '4.1-PC-9', '4.1-PC-10', '4.1-DD-1a', '4.1-DD-1b', '4.1-DD-9a', '4.1-DD-10a'],
    keywords: ['contact', 'phone alternatives', 'email', 'chat', 'SMS', 'multi-channel', 'communication'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.1-PC-2',
    questionText: 'Are your staff trained to receive calls via the National Relay Service (NRS)?',
    moduleCode: '4.1',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'National Relay Service (NRS) Awareness',
    summary: 'The National Relay Service lets people who are Deaf, hard of hearing, or have a speech disability make and receive phone calls through a relay officer. Staff need to know how to handle these calls.',

    whyItMatters: {
      text: 'NRS calls may start with a relay officer announcing the service, which can confuse untrained staff who may hang up thinking it is a telemarketer. Every disconnected NRS call is a customer with a disability who has been turned away.',
      quote: {
        text: 'I have been hung up on so many times when calling through the relay service. Businesses just do not recognise what it is.',
        attribution: 'Deaf customer, advocacy forum'
      }
    },

    tips: [
      {
        icon: 'Phone',
        text: 'NRS calls start with "This is the National Relay Service." Train staff to recognise this and stay on the line.',
        priority: 1
      },
      {
        icon: 'Clock',
        text: 'NRS calls take longer than standard calls. Allow extra time and be patient.',
        priority: 2
      },
      {
        icon: 'MessageSquare',
        text: 'Speak directly to the customer, not the relay officer. The officer is just translating.',
        priority: 3
      },
      {
        icon: 'BookOpen',
        text: 'The NRS is free for the business. There is no cost to receive these calls.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Setting up NRS readiness',
      steps: [
        { text: 'Visit the NRS website and review the business guide' },
        { text: 'Brief all phone-answering staff on what NRS calls sound like' },
        { text: 'Add NRS handling instructions to your phone procedures or reception manual' },
        { text: 'Place a reminder card near phones: "NRS calls start with a relay officer. Stay on the line."' },
        { text: 'Test by calling your own number through the NRS to check the experience' },
        { text: 'Include NRS training in new staff onboarding' }
      ],
      estimatedTime: '30 minutes for staff briefing'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Retail Store',
        scenario: 'A retail store was unknowingly hanging up on NRS calls from Deaf customers.',
        solution: 'After a complaint, management briefed all staff in a 15-minute session. A laminated card was placed by each phone explaining NRS calls.',
        outcome: 'No more disconnected NRS calls. One regular Deaf customer now shops more frequently.',
        cost: 'Free (staff time only)'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant could not take reservations from a regular Deaf customer.',
        solution: 'Trained front-of-house staff on NRS calls. Also added online and SMS booking as alternatives.',
        outcome: 'The customer can now book independently. Staff feel confident handling relay calls.',
        cost: 'Free'
      }
    ],

    solutions: [
      {
        title: 'Staff awareness briefing',
        description: 'Brief all phone-answering staff on recognising and handling NRS calls.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '15-30 minutes',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Download the NRS business fact sheet from the NRS website',
          'Gather all staff who answer phones',
          'Explain what the NRS is and how calls begin',
          'Demonstrate by playing the NRS introduction audio or reading the script',
          'Emphasise: speak normally, be patient, address the customer (not the relay officer)',
          'Place reference cards near all phones'
        ]
      },
      {
        title: 'Add NRS to formal procedures',
        description: 'Embed NRS handling in phone procedures, onboarding, and customer service training.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Add an NRS section to your phone handling procedures document',
          'Include NRS awareness in new staff induction checklist',
          'Add the NRS number and business guide link to your intranet or shared drive',
          'Schedule an annual refresher (5 minutes in a team meeting)',
          'Consider displaying the NRS logo on your website to show you accept relay calls'
        ]
      }
    ],

    resources: [
      {
        title: 'National Relay Service - Business Guide',
        url: 'https://www.communications.gov.au/what-we-do/phone/services-people-disability/accesshub/national-relay-service',
        type: 'guide',
        source: 'Australian Government',
        description: 'Official guide on how businesses can receive and make NRS calls.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Deaf Australia',
        url: 'https://deafaustralia.org.au/',
        type: 'website',
        source: 'Deaf Australia',
        description: 'Peak body for the Deaf community with resources on communication access.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.1-PC-1',
        questionText: 'Do you offer alternatives to phone calls?',
        relationship: 'NRS is one part of multi-channel communication',
        moduleCode: '4.1'
      },
      {
        questionId: '4.2-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Broader Deaf communication awareness',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.1-DD-2a'],
    keywords: ['NRS', 'national relay service', 'deaf', 'hearing', 'phone', 'relay officer'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.1-PC-3',
    questionText: 'Do you capture and use customer communication preferences (preferred contact method, format needs)?',
    moduleCode: '4.1',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Communication Preferences and Follow-Up',
    summary: 'Recording how each customer prefers to be contacted (and in what format) prevents miscommunication and shows respect for individual needs.',

    whyItMatters: {
      text: 'A customer who is Deaf may request text-only contact. A customer with low vision may need large print correspondence. If preferences are not captured and stored, customers must repeat themselves at every interaction, which is frustrating and creates barriers.',
      quote: {
        text: 'Every time I call, I have to explain my needs again from scratch. It feels like they do not care enough to remember.',
        attribution: 'Customer with speech disability'
      }
    },

    tips: [
      {
        icon: 'Database',
        text: 'Add a communication preferences field to your CRM or customer record system',
        priority: 1
      },
      {
        icon: 'UserCheck',
        text: 'Ask about preferences at first contact, not only when problems arise',
        priority: 2
      },
      {
        icon: 'Eye',
        text: 'Make sure staff can easily see and act on stored preferences',
        detail: 'Preferences buried in notes fields that nobody reads are the same as having no preferences.',
        priority: 3
      },
      {
        icon: 'FileText',
        text: 'Offer written confirmation after important conversations as standard practice',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your preference capture process',
      steps: [
        { text: 'Check your CRM or booking system: Is there a field for communication preferences?' },
        { text: 'If not, identify where to add one (contact record, booking notes, customer profile)' },
        { text: 'Review whether staff are prompted to ask about preferences at first contact' },
        { text: 'Test: Can a staff member quickly find a customer\'s preferred contact method?' },
        { text: 'Check if written follow-up is offered after phone or in-person discussions' },
        { text: 'Verify that preferences are honoured, not just recorded' }
      ],
      estimatedTime: '30-60 minutes'
    },

    examples: [
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Medical Practice',
        scenario: 'A medical practice kept calling a Deaf patient by phone despite being told the patient needed SMS.',
        solution: 'Added a "preferred contact method" dropdown to the patient management system. Options: phone, SMS, email, post. Staff see preferences on the patient summary screen.',
        outcome: 'No more inappropriate phone calls. Patient reported feeling respected.',
        cost: '$200-500 for system customisation'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel guest with low vision requested large print invoices each stay but never received them.',
        solution: 'Added communication format preferences to guest profiles. Housekeeping and reception see preferences at check-in. Large print templates created for common documents.',
        outcome: 'Returning guests with format needs are served correctly from day one.',
        cost: '$300-800 for templates and system updates'
      }
    ],

    solutions: [
      {
        title: 'Add preferences to existing systems',
        description: 'Add a communication preferences field to your CRM, booking system, or customer database.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '1-3 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Identify your primary customer record system (CRM, POS, booking platform)',
          'Add a custom field for preferred contact method (phone, email, SMS, post)',
          'Add a field for format needs (standard, large print, audio, Easy Read)',
          'Train staff to ask and record preferences at first interaction',
          'Ensure the field is visible on main contact/booking screens, not hidden in notes',
          'Review preferences quarterly to ensure they are being used'
        ]
      },
      {
        title: 'Standardise written follow-up',
        description: 'Make written confirmation of important conversations a standard practice, not an exception.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1 hour',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Create a simple email/SMS template for post-conversation summaries',
          'Identify which interactions warrant written follow-up (bookings, complaints, service requests)',
          'Train staff to offer: "Would you like me to send you a written summary of what we discussed?"',
          'Send follow-up in the customer\'s preferred format',
          'File a copy in the customer record for future reference'
        ]
      }
    ],

    resources: [
      {
        title: 'Communication Access Symbol',
        url: 'https://www.scopeaust.org.au/services-for-organisations/communication-access/',
        type: 'website',
        source: 'Scope Australia',
        description: 'Resources on creating communication-accessible environments.',
        isAustralian: true
      },
      {
        title: 'Easy Read Guidelines',
        url: 'https://www.scopeaust.org.au/services-for-organisations/easy-english/',
        type: 'guide',
        source: 'Scope Australia',
        description: 'Guide to producing Easy Read documents for people with cognitive disabilities.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.6-D-6',
        questionText: 'Do you store customer accessibility preferences for future visits?',
        relationship: 'Broader preference storage for ongoing relationship',
        moduleCode: '4.6'
      },
      {
        questionId: '4.7-PC-7',
        questionText: 'Do you remember and apply customer communication preferences for ongoing correspondence?',
        relationship: 'Applying stored preferences to written communications',
        moduleCode: '4.7'
      }
    ],

    coveredQuestionIds: ['4.1-PC-8', '4.1-DD-3a', '4.1-DD-3b', '4.1-DD-8a'],
    keywords: ['preferences', 'CRM', 'communication', 'follow-up', 'written confirmation', 'format'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.1-PC-5',
    questionText: 'Are staff trained to communicate patiently with people who have speech disabilities, strong accents, or use AAC devices?',
    moduleCode: '4.1',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Supporting Speech Differences and AAC Users',
    summary: 'People with speech disabilities, those who use AAC (Augmentative and Alternative Communication) devices, and non-native speakers deserve patient, respectful communication. Staff training makes the difference.',

    whyItMatters: {
      text: 'Speech differences can be caused by cerebral palsy, stroke, autism, motor neurone disease, and many other conditions. AAC devices (tablets, speech-generating devices, communication boards) help people communicate but require patience and understanding from the listener. Rushing, interrupting, or pretending to understand creates exclusion.',
      statistic: {
        value: '1.2 million',
        context: 'Australians have a communication disability that affects their daily life.',
        source: 'Speech Pathology Australia'
      }
    },

    tips: [
      {
        icon: 'Clock',
        text: 'Allow extra time. Do not finish sentences or rush the person.',
        priority: 1
      },
      {
        icon: 'Volume2',
        text: 'If you do not understand, say so honestly and ask the person to repeat. Do not pretend.',
        priority: 2
      },
      {
        icon: 'Tablet',
        text: 'Learn what AAC devices look like and how they work at a basic level',
        detail: 'AAC includes speech-generating apps on tablets, picture boards, and eye-gaze technology.',
        priority: 3
      },
      {
        icon: 'Volume',
        text: 'Provide a quiet space for conversations when the environment is noisy',
        priority: 4
      },
      {
        icon: 'Image',
        text: 'Keep simple communication tools on hand: pen and paper, picture boards, or a tablet with a communication app',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Assessing speech and AAC readiness',
      steps: [
        { text: 'Ask staff: Have you interacted with someone using an AAC device? How did it go?' },
        { text: 'Check if your venue has a quiet area available for extended conversations' },
        { text: 'Identify whether any communication aids (pen, paper, picture board) are available on site' },
        { text: 'Review your training materials: Do they cover speech differences and AAC?' },
        { text: 'Test: Could a customer using a communication app complete a transaction at your venue?' },
        { text: 'Consider getting a free communication access assessment from Scope or similar' }
      ],
      estimatedTime: '30 minutes for review, 1 hour for staff training'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Cafe',
        scenario: 'A regular customer using an AAC device felt rushed when ordering because staff looked impatient.',
        solution: 'Held a 30-minute team training on communication patience. Introduced a laminated picture menu the customer could point to. Staff now allow extra time without hovering.',
        outcome: 'The customer visits more often and has recommended the cafe to friends. Other customers with language barriers also benefit from the picture menu.',
        cost: '$50 for picture menu; staff time for training'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council Service Centre',
        scenario: 'Counter staff struggled to understand customers with speech disabilities and resorted to asking them to come back with a carer.',
        solution: 'Partnered with Scope Australia for Communication Access training. Staff learned techniques: ask yes/no questions, use pen and paper, allow extra time, never redirect to a carer. Centre achieved Communication Access accreditation.',
        outcome: 'Customers with speech disabilities can access services independently. Staff confidence increased significantly.',
        cost: '$1,500-3,000 for accreditation program'
      }
    ],

    solutions: [
      {
        title: 'Basic communication patience training',
        description: 'Train staff on respectful communication with people who have speech differences.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '30-60 minutes',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Download Scope\'s free communication tips resources',
          'Run a team session covering: patience, honesty ("I did not catch that"), no finishing sentences',
          'Explain what AAC devices are and show examples (tablets with grid apps, picture boards)',
          'Practice asking yes/no questions to narrow down what someone is communicating',
          'Ensure pen and paper are always available at service points',
          'Identify a quiet area customers can use for longer conversations'
        ]
      },
      {
        title: 'Communication Access accreditation',
        description: 'Pursue formal Communication Access accreditation through Scope Australia.',
        resourceLevel: 'medium',
        costRange: '$1,500-3,000',
        timeRequired: '2-4 weeks',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Contact Scope Australia about the Communication Access program',
          'Complete the initial assessment to identify gaps',
          'Attend training sessions (typically 2-3 hours for all customer-facing staff)',
          'Implement recommended changes (signage, aids, procedures)',
          'Pass the accreditation assessment',
          'Display the Communication Access symbol at your entrance and on your website',
          'Schedule annual refresher training'
        ]
      }
    ],

    resources: [
      {
        title: 'Scope - Communication Access',
        url: 'https://www.scopeaust.org.au/services-for-organisations/communication-access/',
        type: 'website',
        source: 'Scope Australia',
        description: 'Communication Access accreditation, training, and resources for businesses.',
        isAustralian: true
      },
      {
        title: 'Speech Pathology Australia',
        url: 'https://www.speechpathologyaustralia.org.au/',
        type: 'website',
        source: 'Speech Pathology Australia',
        description: 'Resources on communication disabilities and AAC.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Communication Rights Australia',
        url: 'https://www.communicationrights.org.au/',
        type: 'website',
        source: 'Communication Rights Australia',
        description: 'Advocacy and resources for people with communication disabilities.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-D-12',
        questionText: 'Do staff know how to assist customers who may need extra time or have cognitive differences?',
        relationship: 'Patience and extra time are needed for both speech and cognitive differences',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.1-PC-6', '4.1-PC-7', '4.1-DD-5a', '4.1-DD-6a'],
    keywords: ['speech', 'AAC', 'augmentative communication', 'patience', 'communication disability', 'quiet space'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULE 4.2: Customer service and staff confidence (6 entries)
  // =============================================

  {
    questionId: '4.2-F-1',
    questionText: 'Have staff received disability awareness or accessibility training?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'people-culture',
    title: 'Disability Awareness Training',
    summary: 'Disability awareness training builds staff confidence to welcome and assist customers with disabilities naturally, without awkwardness or over-helping.',

    whyItMatters: {
      text: 'Even the most physically accessible venue fails if staff do not know how to interact respectfully. Training reduces awkwardness, builds genuine confidence, and creates a culture where inclusion is normal rather than an afterthought.',
      quote: {
        text: 'The ramp was perfect, but the staff talked to my carer instead of me. That is what I remember.',
        attribution: 'Wheelchair user, customer feedback survey'
      }
    },

    tips: [
      {
        icon: 'Users',
        text: 'Include ALL customer-facing staff, not just managers',
        priority: 1
      },
      {
        icon: 'UserCheck',
        text: 'Choose training delivered by people with lived experience of disability',
        detail: 'This creates authentic learning. Disability-led organisations like Get Skilled Access specialise in this.',
        priority: 2
      },
      {
        icon: 'RefreshCw',
        text: 'Make training ongoing: annual refreshers plus induction for new staff',
        priority: 3
      },
      {
        icon: 'MessageCircle',
        text: 'Focus on communication: always address the person directly, ask before helping, do not assume',
        priority: 4
      },
      {
        icon: 'Lightbulb',
        text: 'Include your own venue\'s accessibility features so staff can confidently guide customers',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Evaluating your training program',
      steps: [
        { text: 'Audit current training: Does it include disability awareness? When was it last delivered?' },
        { text: 'Check if training is in the onboarding process for new starters' },
        { text: 'Ask staff: Do you feel confident assisting a customer who is blind? Uses a wheelchair? Is Deaf?' },
        { text: 'Review whether training covers your specific venue features (accessible toilets, hearing loops, quiet rooms)' },
        { text: 'Check if training includes practical scenarios, not just theory' },
        { text: 'Look at customer feedback: Are there complaints about staff interactions?' },
        { text: 'Identify who delivered the training and whether it was disability-led' }
      ],
      estimatedTime: '1 hour for audit; 2-4 hours for training delivery'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel chain wanted to improve service for guests with disabilities after multiple complaints.',
        solution: 'Partnered with a disability-led training organisation. All front desk and housekeeping staff completed 3-hour face-to-face sessions. Online refresher modules are completed annually. Training covers: communication with guests who are Deaf/blind/have intellectual disability, describing accessible rooms accurately, evacuation procedures.',
        outcome: 'Staff report feeling more confident. Guest satisfaction scores for accessibility improved 25%.',
        cost: '$100-200 per staff member'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre wanted to become autism-friendly.',
        solution: 'Staff across all stores completed autism awareness training: recognising sensory overload, offering help without being intrusive, directing customers to quiet spaces, using visual supports.',
        outcome: 'Centre achieved Autism Friendly certification. Parents of autistic children specifically recommend the centre.',
        cost: '$80 per staff member for certified training'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant Group',
        scenario: 'A restaurant group wanted to build inclusive culture across 12 venues.',
        solution: 'Developed in-house training with disability consultant input. Key modules: disability etiquette (1 hour online), guide dog awareness, reading menus to customers with vision impairment, managing sensory environments.',
        outcome: 'Staff share positive interactions in team meetings. Several have suggested their own improvements.',
        cost: '$500 initial development, then staff time only'
      }
    ],

    solutions: [
      {
        title: 'Quick team awareness session',
        description: 'Run a 1-hour disability awareness session using free online resources.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1 hour',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Download free disability awareness materials from AND or JobAccess',
          'Gather customer-facing staff for a 1-hour session',
          'Cover basics: person-first language, ask before helping, speak directly to the person',
          'Walk through your venue and identify all accessible features staff should know about',
          'Role-play 3-4 common scenarios (helping a wheelchair user, guiding a blind person, assisting someone with an intellectual disability)',
          'Create a quick reference card for staff with key tips and facility locations'
        ]
      },
      {
        title: 'Professional disability-led training',
        description: 'Engage a disability-led organisation to deliver face-to-face training.',
        resourceLevel: 'medium',
        costRange: '$100-200 per staff member',
        timeRequired: '2-4 hours',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Research disability-led training providers (Get Skilled Access, AND, local disability organisations)',
          'Request a tailored program that covers your industry context',
          'Schedule sessions so all customer-facing staff attend',
          'Include venue-specific content: your accessible features, equipment, emergency procedures',
          'Collect staff feedback after training to gauge confidence levels',
          'Book annual refresher sessions',
          'Include the training in new staff onboarding checklists'
        ]
      }
    ],

    resources: [
      {
        title: 'Get Skilled Access',
        url: 'https://www.getskilledaccess.com.au/',
        type: 'website',
        source: 'Get Skilled Access',
        description: 'Disability-led accessibility training and consulting.',
        isAustralian: true
      },
      {
        title: 'Australian Network on Disability - Training',
        url: 'https://www.and.org.au/',
        type: 'website',
        source: 'AND',
        description: 'Disability awareness training programs for businesses.',
        isAustralian: true
      },
      {
        title: 'JobAccess - Employer Resources',
        url: 'https://www.jobaccess.gov.au/',
        type: 'guide',
        source: 'Australian Government',
        description: 'Free resources for employing and serving people with disabilities.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Deaf communication is a specific skill within broader training',
        moduleCode: '4.2'
      },
      {
        questionId: '4.4-1-4',
        questionText: 'Do staff know how to assist customers with different needs during an evacuation?',
        relationship: 'Evacuation assistance should be part of training',
        moduleCode: '4.4'
      }
    ],

    coveredQuestionIds: ['4.2-F-1b', '4.2-F-3', '4.2-D-9', '4.2-D-15', '4.2-D-16', '4.2-D-26'],
    keywords: ['training', 'disability awareness', 'staff confidence', 'onboarding', 'inclusive culture'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.2-F-5',
    questionText: 'Are staff trained in various communication strategies?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Inclusive Communication Strategies',
    summary: 'Different customers need different communication approaches. Staff who know multiple strategies (visual, written, simplified, sign language access) can serve everyone effectively.',

    whyItMatters: {
      text: 'A single communication style does not work for all customers. Someone who is Deaf needs visual communication. Someone with an intellectual disability may need simplified language. Someone with anxiety may need patience and calm. Staff who have a toolkit of approaches can adapt in real time.',
      statistic: {
        value: '30,000+',
        context: 'Australians use Auslan as their primary language.',
        source: 'Deaf Australia'
      }
    },

    tips: [
      {
        icon: 'Pen',
        text: 'Always have pen and paper available at service points for written communication',
        priority: 1
      },
      {
        icon: 'Video',
        text: 'Know how to access Video Remote Interpreting (VRI) for Auslan when needed',
        detail: 'Services like Auslan Connections offer on-demand video interpreting via tablet.',
        priority: 2
      },
      {
        icon: 'Clock',
        text: 'Allow extra time for customers with cognitive differences without rushing',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Always speak to the customer, not their carer or interpreter',
        priority: 4
      },
      {
        icon: 'Settings',
        text: 'Let customers choose their preferred level of interaction (more help or more independence)',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Assessing communication readiness',
      steps: [
        { text: 'Walk through your service points: Is pen and paper available at each one?' },
        { text: 'Check whether staff know what Auslan is and how to access interpretation' },
        { text: 'Ask staff: How would you serve a customer with an intellectual disability? A Deaf customer? Someone who stutters?' },
        { text: 'Review whether you have a tablet or device available for Video Remote Interpreting' },
        { text: 'Check if staff know about the National Relay Service for phone communication' },
        { text: 'Identify whether customers can request more or less assistance to suit their needs' }
      ],
      estimatedTime: '30 minutes for review'
    },

    examples: [
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Medical Practice',
        scenario: 'A medical practice struggled to communicate effectively with Deaf patients.',
        solution: 'Subscribed to a Video Remote Interpreting service. A tablet is kept at reception and interpreters are available within minutes. On-site interpreters are booked for complex procedures. Staff trained on interpreter etiquette.',
        outcome: 'Deaf patients access care independently. Doctors report better quality consultations.',
        cost: '$2-3 per minute for VRI; $100+ per hour for on-site interpreting'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Department Store',
        scenario: 'Sales staff were unsure how to assist customers with intellectual disabilities.',
        solution: 'Training covered: use simple language, offer one choice at a time, be patient with decision-making, check understanding by asking the customer to repeat back. Visual price tags with clear large numbers were added.',
        outcome: 'Staff feel confident. Customers with intellectual disabilities and their families report feeling welcomed.',
        cost: 'Free (staff time and minor signage updates)'
      }
    ],

    solutions: [
      {
        title: 'Communication toolkit at service points',
        description: 'Equip each service point with basic communication aids.',
        resourceLevel: 'low',
        costRange: '$20-100',
        timeRequired: '1 hour',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Place pen and notepad at every counter and service point',
          'Print a simple picture/icon communication board for common transactions',
          'Ensure staff know where these tools are and when to offer them',
          'Add a clear sign: "We are happy to communicate in whatever way works for you"',
          'Brief staff on using the tools naturally without making it feel awkward'
        ]
      },
      {
        title: 'Set up Auslan interpretation access',
        description: 'Establish a Video Remote Interpreting account so Auslan access is available on demand.',
        resourceLevel: 'medium',
        costRange: '$50-200/month plus per-minute fees',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'significant',
        steps: [
          'Research VRI providers (Auslan Connections, Deaf Connect)',
          'Create an account and set up billing',
          'Designate a tablet or laptop at your main service point for VRI calls',
          'Test the service before you need it: make a practice call',
          'Train staff on when to offer interpreting and how to work with an interpreter',
          'Add information about Auslan access to your website accessibility page'
        ]
      }
    ],

    resources: [
      {
        title: 'Auslan Connections',
        url: 'https://www.auslanconnections.com.au/',
        type: 'website',
        source: 'Auslan Connections',
        description: 'Video Remote Interpreting and on-site Auslan interpreter bookings.',
        isAustralian: true
      },
      {
        title: 'Deaf Connect',
        url: 'https://www.deafconnect.org.au/',
        type: 'website',
        source: 'Deaf Connect',
        description: 'Services for the Deaf and hard of hearing community including interpreting.',
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
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.1-PC-5',
        questionText: 'Are staff trained to communicate with people who have speech disabilities or use AAC devices?',
        relationship: 'AAC and speech differences are specific communication areas',
        moduleCode: '4.1'
      }
    ],

    coveredQuestionIds: ['4.2-D-10', '4.2-D-11', '4.2-D-12', '4.2-D-18b', '4.2-D-31'],
    keywords: ['communication', 'Auslan', 'Deaf', 'VRI', 'interpreter', 'pen and paper', 'cognitive'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.2-F-2',
    questionText: 'Do staff know how to welcome and assist customers with assistance animals?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Service Animals and Assistance Animals',
    summary: 'Under Australian law, assistance animals must be allowed in all public venues. Staff need to know the law, recognise assistance animals, and handle situations where other customers complain.',

    whyItMatters: {
      text: 'Assistance animals (guide dogs, hearing dogs, mobility dogs, psychiatric assistance dogs, and others) are legally protected under the Disability Discrimination Act. Refusing entry is unlawful. Yet many people with assistance animals report being turned away or challenged, often by well-meaning but uninformed staff.',
      statistic: {
        value: '62%',
        context: 'of assistance animal handlers in Australia report having been refused access to a business at least once.',
        source: 'Guide Dogs Australia survey'
      }
    },

    tips: [
      {
        icon: 'ShieldCheck',
        text: 'Under the DDA, assistance animals MUST be allowed in all areas open to the public',
        detail: 'This includes restaurants, shops, hotels, transport, and medical facilities. No exceptions for "no pets" policies.',
        priority: 1
      },
      {
        icon: 'Eye',
        text: 'Do not pat, distract, or feed an assistance animal. It is working.',
        priority: 2
      },
      {
        icon: 'AlertTriangle',
        text: 'If another customer complains about the animal, calmly explain the law and offer the complainant an alternative',
        priority: 3
      },
      {
        icon: 'FileText',
        text: 'Have a written service animal policy so staff have clear guidance',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Checking your service animal readiness',
      steps: [
        { text: 'Ask staff: What would you do if a customer arrived with a guide dog?' },
        { text: 'Check if your "no pets" signage has an exception for assistance animals' },
        { text: 'Review whether you have a written service animal policy' },
        { text: 'Check if staff know they cannot ask for proof of disability (only whether the animal is an assistance animal)' },
        { text: 'Consider providing a water bowl at your entrance for working animals' },
        { text: 'Review your complaint handling process for situations involving other customers' }
      ],
      estimatedTime: '20 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant turned away a blind customer with a guide dog, citing hygiene regulations.',
        solution: 'After a complaint to the Human Rights Commission, the restaurant updated its policy, trained all staff, and added "Assistance animals welcome" to its entrance signage and website.',
        outcome: 'No further incidents. The restaurant is now recommended in accessibility guides.',
        cost: 'Free (policy and training only)'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel guest complained about an assistance dog in the breakfast room.',
        solution: 'Staff calmly explained the legal requirement and offered the complainant an alternative table away from the dog. The hotel also added an FAQ about assistance animals to its website.',
        outcome: 'The situation was resolved without conflict. Both guests continued their stay.',
        cost: 'Free'
      }
    ],

    solutions: [
      {
        title: 'Create a service animal policy',
        description: 'Write and distribute a clear policy on assistance animals in your venue.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Draft a policy: Assistance animals are welcome in all areas. Staff must not refuse entry.',
          'Include guidance on what staff can ask (Is this an assistance animal?) and what they cannot (proof of disability)',
          'Add a section on handling complaints from other customers',
          'Include care basics: provide water, do not distract the animal, allow the handler to manage it',
          'Distribute to all staff and include in onboarding materials',
          'Add "Assistance animals welcome" signage to your entrance'
        ]
      },
      {
        title: 'Staff awareness training',
        description: 'Brief staff on legal requirements, etiquette, and common scenarios.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '30 minutes',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Explain the DDA requirement: assistance animals are legally allowed everywhere the public goes',
          'Show photos of different assistance animals (not just guide dogs: hearing dogs, mobility dogs, psychiatric assistance dogs)',
          'Role-play a scenario: customer arrives with assistance dog, another customer complains',
          'Emphasise: never separate a handler from their animal',
          'Share contact details for Guide Dogs or Assistance Dogs Australia for questions'
        ]
      }
    ],

    resources: [
      {
        title: 'Guide Dogs Australia',
        url: 'https://www.guidedogsaustralia.com/',
        type: 'website',
        source: 'Guide Dogs Australia',
        description: 'Information on guide dogs and assistance animals in Australia.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Assistance Dogs Australia',
        url: 'https://www.assistancedogs.org.au/',
        type: 'website',
        source: 'Assistance Dogs Australia',
        description: 'Peak body for assistance dog organisations.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'DDA - Assistance Animals',
        url: 'https://humanrights.gov.au/our-work/disability-rights/assistance-animals',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Legal information on assistance animal rights under the DDA.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.4-D-7',
        questionText: 'What happens to service animals during an emergency evacuation?',
        relationship: 'Evacuation plans should include assistance animals',
        moduleCode: '4.4'
      }
    ],

    coveredQuestionIds: ['4.2-D-21', '4.2-D-22'],
    keywords: ['service animal', 'assistance animal', 'guide dog', 'DDA', 'pets policy'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.2-F-4',
    questionText: 'Do you have a process for customers to request assistance before arriving?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Accessible Service Delivery and On-Site Assistance',
    summary: 'Practical service adaptations (pre-arrival requests, equipment loans, priority queuing, alternative delivery, and staff knowledge of accessible facilities) ensure customers with disabilities receive equal service.',

    whyItMatters: {
      text: 'Accessible infrastructure means little if the service around it is rigid. A customer who cannot stand in a queue, needs equipment brought to them, or requires a different service format deserves adaptations. These small adjustments often cost nothing but transform the experience.',
      quote: {
        text: 'I asked if I could skip the queue because I cannot stand. The staff member said "we treat everyone the same." That is not equality.',
        attribution: 'Customer with chronic pain condition'
      }
    },

    tips: [
      {
        icon: 'Phone',
        text: 'Let customers request assistance before arriving via your website, email, or phone',
        priority: 1
      },
      {
        icon: 'MapPin',
        text: 'Ensure all staff know the location of accessible toilets, lifts, quiet rooms, and hearing loops',
        priority: 2
      },
      {
        icon: 'Package',
        text: 'Maintain an inventory of available equipment (wheelchairs, hearing loops, magnifiers) and tell staff where it is',
        priority: 3
      },
      {
        icon: 'Clock',
        text: 'Communicate wait times clearly and offer seating or priority service for those who cannot stand',
        priority: 4
      },
      {
        icon: 'Repeat',
        text: 'Offer alternative service delivery if your standard process is not accessible',
        detail: 'For example: table service instead of counter service, personal shopping assistance, phone ordering with delivery to car.',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Reviewing your service adaptations',
      steps: [
        { text: 'Check your website and booking system: Can customers flag accessibility needs before arriving?' },
        { text: 'Ask frontline staff: Where is the nearest accessible toilet? Do we have a hearing loop? Where is the quiet room?' },
        { text: 'List all assistive equipment available and check it is working and charged' },
        { text: 'Observe your queue/waiting system: Would someone who cannot stand be accommodated?' },
        { text: 'Identify which services could be delivered differently if the standard approach is not accessible' },
        { text: 'Check whether information is available in alternative formats on request' }
      ],
      estimatedTime: '30-60 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre had accessible facilities but staff could not direct customers to them.',
        solution: 'Created an accessibility map for staff with locations of all facilities. Uploaded a customer version to the website. Concierge staff trained to proactively offer assistance.',
        outcome: 'Customer wayfinding complaints reduced 60%. Staff feel confident directing customers.',
        cost: '$200-500 for map design and printing'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A museum required all visitors to queue for 20-30 minutes at peak times with no seating.',
        solution: 'Introduced a priority entry option for visitors who cannot queue. Added seating at 10-metre intervals in the queue line. Communicated wait times on a display board and via SMS alert.',
        outcome: 'Visitors with mobility conditions and chronic pain can now attend comfortably.',
        cost: '$500-1,500 for seating and signage'
      }
    ],

    solutions: [
      {
        title: 'Pre-arrival assistance request process',
        description: 'Create a simple way for customers to flag accessibility needs before visiting.',
        resourceLevel: 'low',
        costRange: 'Free-$200',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Add an accessibility needs question to your booking or enquiry form',
          'Create a dedicated email address or phone option for accessibility requests',
          'Develop a checklist of common requests (wheelchair, hearing loop, ground floor, quiet room)',
          'Train staff to review requests before the customer arrives and prepare accordingly',
          'Confirm arrangements with the customer before their visit',
          'Store preferences for returning customers'
        ]
      },
      {
        title: 'Staff accessibility facility guide',
        description: 'Create a quick reference guide so all staff can direct customers to accessible facilities and equipment.',
        resourceLevel: 'low',
        costRange: '$50-200',
        timeRequired: '2-3 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Map all accessible facilities: toilets, lifts, hearing loops, quiet rooms, parking',
          'List all available equipment: wheelchairs, portable ramps, magnifiers, assisted listening devices',
          'Note where each item is stored and how to operate it',
          'Create a one-page guide for each service point',
          'Laminate and place at reception, concierge, and key service areas',
          'Brief all staff in a 15-minute session',
          'Update whenever facilities change'
        ]
      }
    ],

    resources: [
      {
        title: 'Accessible Tourism Guides',
        url: 'https://www.travability.travel/',
        type: 'website',
        source: 'Travability',
        description: 'Accessible tourism resources and destination guides for Australia.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Australian Network on Disability',
        url: 'https://www.and.org.au/',
        type: 'website',
        source: 'AND',
        description: 'Resources on accessible customer service for Australian businesses.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.3-D-7',
        questionText: 'Can customers book accessible spaces or equipment in advance?',
        relationship: 'Pre-arrival requests often relate to booking accessible features',
        moduleCode: '4.3'
      }
    ],

    coveredQuestionIds: ['4.2-F-6', '4.2-D-17', '4.2-D-18', '4.2-D-20', '4.2-D-23', '4.2-D-24', '4.2-D-25'],
    keywords: ['assistance', 'equipment', 'queue', 'wait times', 'alternative service', 'facilities', 'pre-arrival'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.2-D-13',
    questionText: 'Is there a quiet space available for customers who become overwhelmed?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'people-culture',
    title: 'Welcoming Environment, Carers, and Intersectionality',
    summary: 'A welcoming environment goes beyond physical access. It includes quiet spaces for sensory overload, proper accommodation of carers and support people, and understanding that disability intersects with culture, identity, and past experiences.',

    whyItMatters: {
      text: 'Customers with disabilities are not a single group. A First Nations person with a disability may face compounded barriers. A person from a culturally diverse background may have different expectations around help and independence. Someone who has experienced discrimination may be wary of seeking assistance. Recognising these layers creates genuinely inclusive service.',
      quote: {
        text: 'As an Aboriginal woman in a wheelchair, I deal with two kinds of assumptions at once. Good service sees me as a whole person.',
        attribution: 'Customer feedback, disability advocacy forum'
      }
    },

    tips: [
      {
        icon: 'Volume',
        text: 'Designate a quiet space where overwhelmed customers can take a break',
        detail: 'This is essential for autistic visitors, people with anxiety, and those experiencing sensory overload.',
        priority: 1
      },
      {
        icon: 'Users',
        text: 'Welcome carers and support people. Offer them seating and refreshments where appropriate.',
        priority: 2
      },
      {
        icon: 'Heart',
        text: 'Recognise intersectionality: disability plus culture, gender, age, or sexuality creates unique needs',
        priority: 3
      },
      {
        icon: 'Shield',
        text: 'Be patient with customers who seem hesitant. Past discrimination may make them cautious.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Assessing your welcoming environment',
      steps: [
        { text: 'Identify a suitable quiet/sensory space. It does not need to be dedicated, just available.' },
        { text: 'Check if carers/support people are welcomed and offered seating near the person they support' },
        { text: 'Review whether your training covers intersectionality and cultural sensitivity' },
        { text: 'Ask staff: How would you support a customer who appears distressed or anxious?' },
        { text: 'Check signage for the quiet space: Is it clearly marked and easy to find?' }
      ],
      estimatedTime: '20-30 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'Autistic visitors became overwhelmed during busy periods with no quiet retreat available.',
        solution: 'Converted a small meeting room into a sensory space with dimmed lights, comfortable seating, and noise-reducing design. Promoted it on the website and with signage.',
        outcome: 'Families with autistic members visit during times they previously avoided. The space is also used by people with anxiety and migraine.',
        cost: '$500-2,000 for basic fit-out'
      },
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Hospital',
        scenario: 'An Aboriginal patient with a disability felt uncomfortable because staff did not understand cultural protocols around family involvement in care.',
        solution: 'Training was updated to include cultural considerations alongside disability awareness. Staff learned to ask patients about their preferences for family involvement rather than assuming.',
        outcome: 'Aboriginal patients with disabilities reported feeling more respected and understood.',
        cost: 'Free (training update)'
      }
    ],

    solutions: [
      {
        title: 'Set up a quiet/sensory space',
        description: 'Designate an area where customers can retreat when feeling overwhelmed.',
        resourceLevel: 'low',
        costRange: '$100-500',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Identify a suitable room or area (can be a small meeting room, office, or screened corner)',
          'Reduce stimulation: dim lighting, no music, minimal visual clutter',
          'Add comfortable seating and, if possible, noise-cancelling headphones',
          'Place clear signage directing to the space',
          'Train staff to offer the space proactively when they notice someone is struggling',
          'Stock with water and simple sensory items (stress balls, weighted blanket)'
        ]
      },
      {
        title: 'Intersectionality-aware service training',
        description: 'Expand disability training to include cultural factors, intersectionality, and trauma awareness.',
        resourceLevel: 'medium',
        costRange: '$500-2,000',
        timeRequired: '2-3 hours',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Partner with a training provider that covers both disability and cultural competency',
          'Include content on First Nations disability perspectives',
          'Cover how cultural backgrounds affect attitudes to disability, help-seeking, and family roles',
          'Discuss trauma-informed approaches: patience, choice, control, transparency',
          'Practice scenarios involving multiple identity factors',
          'Review your feedback channels to ensure they are culturally safe'
        ]
      }
    ],

    resources: [
      {
        title: 'First Peoples Disability Network',
        url: 'https://fpdn.org.au/',
        type: 'website',
        source: 'FPDN',
        description: 'Advocacy and resources for Aboriginal and Torres Strait Islander people with disabilities.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Autism Friendly Accreditation',
        url: 'https://www.amaze.org.au/',
        type: 'website',
        source: 'Amaze (Autism Victoria)',
        description: 'Resources and accreditation for creating autism-friendly spaces.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-F-1',
        questionText: 'Have staff received disability awareness or accessibility training?',
        relationship: 'Foundational training that should include intersectionality',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.2-D-19', '4.2-D-28', '4.2-D-29', '4.2-D-30'],
    keywords: ['quiet space', 'sensory', 'carers', 'intersectionality', 'culture', 'trauma', 'autism'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.2-F-7',
    questionText: 'Is there a clear process for handling accessibility complaints or feedback?',
    moduleCode: '4.2',
    moduleGroup: 'service-support',
    diapCategory: 'operations-policy-procedure',
    title: 'Accessibility Complaints and Service Policy',
    summary: 'A documented process for handling accessibility complaints, supported by a written customer service policy for people with disabilities, gives staff clear guidance and gives customers confidence.',

    whyItMatters: {
      text: 'Without a clear process, accessibility complaints get lost in general feedback or handled inconsistently. A documented policy ensures every complaint is taken seriously, responded to promptly, and used as an opportunity to improve.',
      statistic: {
        value: '90%',
        context: 'of accessibility complaints never get made formally. People just stop coming back.',
        source: 'Disability advocacy research'
      }
    },

    tips: [
      {
        icon: 'FileText',
        text: 'Write a clear customer service policy that specifically addresses disability and accessibility',
        priority: 1
      },
      {
        icon: 'Clock',
        text: 'Set target response times for accessibility complaints (ideally within 2 business days)',
        priority: 2
      },
      {
        icon: 'ArrowUp',
        text: 'Establish an escalation path: frontline staff, manager, then external body if unresolved',
        priority: 3
      },
      {
        icon: 'MessageSquare',
        text: 'Allow staff to provide feedback on accessibility issues they observe, not just customer complaints',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your complaints process',
      steps: [
        { text: 'Check: Do you have a written policy on serving customers with disabilities?' },
        { text: 'Review your complaint form/process: Is there a way to flag accessibility issues?' },
        { text: 'Ask staff: What would you do if a customer complained about an accessibility barrier?' },
        { text: 'Check if accessibility complaints are tracked separately for trend analysis' },
        { text: 'Verify that the policy is available to staff (not just filed away)' },
        { text: 'Review whether the complaints process itself is accessible (multiple formats, not just online)' }
      ],
      estimatedTime: '30 minutes'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'Accessibility complaints were mixed in with general feedback and rarely actioned.',
        solution: 'Created a specific accessibility feedback category in the complaints system. All accessibility complaints are flagged and reviewed weekly by the accessibility officer. Response target: 2 business days.',
        outcome: 'Accessibility issues are resolved faster. Data is used in annual access improvement planning.',
        cost: 'Free (system configuration only)'
      },
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Theatre',
        scenario: 'A theatre had no written policy on disability, so staff made inconsistent decisions.',
        solution: 'Developed a 2-page Customer Accessibility Policy covering: assistance animals, wheelchair spaces, hearing loop, Auslan-interpreted performances, companion card, complaint handling. Distributed to all staff.',
        outcome: 'Consistent service across all staff. Complaints about inconsistency reduced to zero.',
        cost: 'Free (staff time to write policy)'
      }
    ],

    solutions: [
      {
        title: 'Write a customer accessibility policy',
        description: 'Create a short, clear policy on serving customers with disabilities.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '2-3 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Review the DDA requirements for your industry',
          'List all accessibility features and services you currently offer',
          'Write clear statements on: assistance animals, equipment, communication, complaint handling',
          'Include staff responsibilities and escalation paths',
          'Keep it to 1-2 pages in plain language',
          'Distribute to all staff and display in staff areas',
          'Review and update annually'
        ]
      },
      {
        title: 'Set up accessibility complaint tracking',
        description: 'Add accessibility as a tracked category in your feedback/complaints system.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1 hour',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Add an "Accessibility" category to your complaints/feedback system',
          'Set up automatic flagging or notification for accessibility complaints',
          'Establish a response target (recommend 2 business days)',
          'Assign responsibility for review (manager or accessibility champion)',
          'Report on accessibility complaints quarterly',
          'Use data to prioritise improvement projects'
        ]
      }
    ],

    resources: [
      {
        title: 'Australian Human Rights Commission - Disability',
        url: 'https://humanrights.gov.au/our-work/disability-rights',
        type: 'website',
        source: 'AHRC',
        description: 'Information on disability rights and complaint processes under the DDA.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'AND - Accessible Customer Service',
        url: 'https://www.and.org.au/',
        type: 'guide',
        source: 'Australian Network on Disability',
        description: 'Resources for creating accessible customer service policies.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.5-F-1',
        questionText: 'Do you have a way for customers to provide feedback about accessibility?',
        relationship: 'Feedback channels feed into the complaints process',
        moduleCode: '4.5'
      }
    ],

    coveredQuestionIds: ['4.2-D-14', '4.2-D-27'],
    keywords: ['complaints', 'policy', 'feedback', 'escalation', 'customer service policy'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULES 4.3-4.7 continue below
  // =============================================

  // =============================================
  // MODULE 4.3: Bookings and ticketing (4 entries)
  // =============================================

  {
    questionId: '4.3-D-1',
    questionText: 'Is your online booking system accessible?',
    moduleCode: '4.3',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Accessible Online Booking',
    summary: 'Your online booking system should be fully usable with a keyboard, screen reader, and other assistive technologies. Customers should be able to specify accessibility needs and receive confirmations in accessible formats.',

    whyItMatters: {
      text: 'If customers with disabilities cannot complete a booking independently online, they must call (which not everyone can do) or rely on someone else. This removes autonomy and creates an unequal experience from the very first interaction.',
      statistic: {
        value: '71%',
        context: 'of customers with disabilities will leave a website that is not accessible, taking their spending elsewhere.',
        source: 'Click-Away Pound Survey'
      }
    },

    tips: [
      {
        icon: 'Keyboard',
        text: 'Test your booking system with keyboard-only navigation (no mouse)',
        priority: 1
      },
      {
        icon: 'CheckSquare',
        text: 'Add an accessibility requirements field to the booking form',
        detail: 'Allow customers to specify wheelchair access, hearing loop, ground floor, dietary needs, etc.',
        priority: 2
      },
      {
        icon: 'FileText',
        text: 'Send booking confirmations in accessible formats (plain text email, not just image-based)',
        priority: 3
      },
      {
        icon: 'Package',
        text: 'Allow customers to book accessible spaces and equipment in advance',
        priority: 4
      },
      {
        icon: 'HelpCircle',
        text: 'Provide a clear way to request additional assistance during the booking process',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Testing your booking system',
      steps: [
        { text: 'Navigate the entire booking flow using only the Tab key and Enter (no mouse)' },
        { text: 'Test with a screen reader (NVDA is free for Windows, VoiceOver is built into Mac)' },
        { text: 'Check that all form fields have visible labels and error messages' },
        { text: 'Verify that date pickers and dropdown menus are keyboard accessible' },
        { text: 'Check if there is an accessibility needs field in the booking form' },
        { text: 'Test the booking confirmation email: Is it readable without images?' },
        { text: 'Ask your booking platform vendor for their WCAG compliance statement' }
      ],
      estimatedTime: '30-60 minutes'
    },

    standardsReference: {
      primary: {
        code: 'WCAG2.2-AA',
        section: 'All applicable criteria',
        requirement: 'Online booking systems must meet WCAG 2.2 Level AA for perceivability, operability, understandability, and robustness.'
      },
      related: [
        {
          code: 'DDA',
          relevance: 'Online services are covered by the DDA. Inaccessible booking systems may constitute discrimination.'
        }
      ],
      plainEnglish: 'Your online booking system must work for everyone, including people using screen readers, keyboard navigation, or voice control. This is both a legal requirement and good business practice.'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel\'s booking engine used a date picker that could not be operated by keyboard.',
        solution: 'Worked with the booking platform provider to replace the date picker with an accessible alternative. Added an "Accessibility requirements" text field to the booking form. Confirmation emails were redesigned in plain HTML.',
        outcome: 'Screen reader users can now complete bookings independently. Accessibility requests are captured at booking time.',
        cost: '$500-2,000 for platform customisation'
      },
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Theatre',
        scenario: 'Wheelchair users could not select accessible seating through the online ticketing system.',
        solution: 'Added an accessible seating category to the online seat map. Customers can filter for wheelchair spaces, companion seats, and hearing loop zones. An assistance request option was added to checkout.',
        outcome: 'Wheelchair users and hearing loop users can self-serve online. Box office phone calls for accessible bookings reduced 70%.',
        cost: '$1,000-3,000 for ticketing system update'
      }
    ],

    solutions: [
      {
        title: 'Add accessibility fields to existing booking system',
        description: 'Add accessibility requirements and assistance request options to your current booking form.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '1-3 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Add a text field: "Do you have any accessibility requirements?" to your booking form',
          'Add checkboxes for common needs: wheelchair access, hearing loop, ground floor, dietary requirements',
          'Ensure the field is optional but visible',
          'Set up notifications so staff see accessibility requests before the visit',
          'Add a note: "Contact us at [email/phone] if you need help completing this booking"',
          'Test the new fields with keyboard and screen reader'
        ]
      },
      {
        title: 'Full accessibility audit of booking platform',
        description: 'Conduct a WCAG 2.2 audit of your entire booking flow and fix issues.',
        resourceLevel: 'high',
        costRange: '$2,000-10,000',
        timeRequired: '2-4 weeks',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Engage an accessibility consultant to audit your booking system against WCAG 2.2 AA',
          'Prioritise issues by severity (keyboard traps and missing labels are critical)',
          'Work with your platform vendor to fix identified issues',
          'If the vendor cannot fix issues, evaluate alternative accessible platforms',
          'Re-test after fixes to confirm resolution',
          'Schedule annual re-audits',
          'Add accessibility as a requirement in any future platform procurement'
        ]
      }
    ],

    resources: [
      {
        title: 'WCAG 2.2 Quick Reference',
        url: 'https://www.w3.org/WAI/WCAG22/quickref/',
        type: 'website',
        source: 'W3C',
        description: 'Full reference for web accessibility standards.',
        isFree: true
      },
      {
        title: 'NVDA Screen Reader',
        url: 'https://www.nvaccess.org/',
        type: 'tool',
        source: 'NV Access',
        description: 'Free screen reader for Windows, useful for testing your booking system.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.3-1-2',
        questionText: 'Are payment terminals positioned at accessible heights?',
        relationship: 'Payment is the final step of the booking/purchase process',
        moduleCode: '4.3'
      }
    ],

    coveredQuestionIds: ['4.3-D-2', '4.3-D-6', '4.3-D-7', '4.3-D-8'],
    keywords: ['booking', 'online', 'WCAG', 'screen reader', 'keyboard', 'accessible forms'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.3-D-3',
    questionText: 'Do you recognise the Companion Card scheme?',
    moduleCode: '4.3',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Pricing, Concessions, and Companion Card',
    summary: 'Accessible pricing means recognising the Companion Card, offering concessions where appropriate, displaying pricing in accessible formats, and being flexible with cancellation policies for disability-related changes.',

    whyItMatters: {
      text: 'People with disabilities often face higher costs: paying for a carer\'s entry, needing to cancel last-minute due to health, or being unable to access discounts because they are only available online. Fair pricing removes financial barriers to participation.',
      statistic: {
        value: '450,000+',
        context: 'Companion Cards have been issued across Australia, providing free entry for carers.',
        source: 'Companion Card National Network'
      }
    },

    tips: [
      {
        icon: 'CreditCard',
        text: 'Register as a Companion Card affiliate (free to join)',
        priority: 1
      },
      {
        icon: 'Tag',
        text: 'Display concessions and discounts clearly in multiple formats (website, signage, verbally)',
        priority: 2
      },
      {
        icon: 'RefreshCw',
        text: 'Offer flexible cancellation for disability-related changes',
        detail: 'Health conditions can flare unpredictably. A rigid cancellation policy penalises disability.',
        priority: 3
      },
      {
        icon: 'Eye',
        text: 'Ensure pricing information is accessible: large print menus, screen-reader-friendly web pricing',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your pricing accessibility',
      steps: [
        { text: 'Check: Are you registered as a Companion Card affiliate?' },
        { text: 'Review your concessions: Can people with a Disability Support Pension or NDIS card access them?' },
        { text: 'Check if pricing is available in accessible formats (not just images, PDFs should be tagged)' },
        { text: 'Review your cancellation policy: Does it accommodate disability-related changes?' },
        { text: 'Ask staff: Can they explain available concessions clearly to customers?' },
        { text: 'Check that discounts are available through all channels, not just online' }
      ],
      estimatedTime: '20-30 minutes'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Theme Park',
        scenario: 'A theme park had no concession for people with disabilities and charged full price for carers.',
        solution: 'Registered as Companion Card affiliate (free entry for carers). Introduced a disability concession matching the seniors rate. Updated ticketing system and website. Added a note about flexible cancellation for health-related changes.',
        outcome: 'Visitation by families with disabled members increased. Positive social media mentions.',
        cost: 'Free to register; modest revenue impact offset by increased visits'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant\'s menu was only available as an image on social media, inaccessible to screen readers.',
        solution: 'Created an accessible web version of the menu with proper headings, prices in text (not images), and clear allergen information. Added a large print version for in-venue use.',
        outcome: 'Customers with vision impairment can browse the menu independently before and during visits.',
        cost: '$100-300 for web menu; $20 for large print copies'
      }
    ],

    solutions: [
      {
        title: 'Register for Companion Card and review concessions',
        description: 'Join the Companion Card program and review your concession pricing for disability.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '30-60 minutes',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Visit your state Companion Card website and complete affiliate registration',
          'Train ticketing/reception staff on the program',
          'Review existing concessions: Add a disability concession if you do not have one',
          'Update your website with concession information and Companion Card logo',
          'Add a note about flexible cancellation for disability-related changes to your terms',
          'Display concession information at the point of sale'
        ]
      },
      {
        title: 'Make pricing information accessible',
        description: 'Ensure pricing is available in multiple accessible formats.',
        resourceLevel: 'low',
        costRange: '$50-300',
        timeRequired: '2-4 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Convert image-based pricing to text on your website',
          'Create a large print version of your price list or menu',
          'Ensure PDF price lists are tagged and screen-reader-friendly',
          'Train staff to read pricing aloud when asked',
          'Display prices at point of sale in clear, high-contrast text (minimum 16pt)'
        ]
      }
    ],

    resources: [
      {
        title: 'Companion Card National Network',
        url: 'https://www.companioncard.gov.au/',
        type: 'website',
        source: 'Australian Government',
        description: 'Links to all state and territory Companion Card programs.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Disability Support Pension',
        url: 'https://www.servicesaustralia.gov.au/disability-support-pension',
        type: 'website',
        source: 'Services Australia',
        description: 'Information on DSP cards that may be used for concession pricing.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '5.1-F-4',
        questionText: 'Are you registered as a Companion Card affiliate?',
        relationship: 'Companion Card is an organisational commitment',
        moduleCode: '5.1'
      }
    ],

    coveredQuestionIds: ['4.3-D-4', '4.3-D-9', '4.3-D-10', '4.3-1-4'],
    keywords: ['companion card', 'concession', 'pricing', 'cancellation', 'discount', 'flexible'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.3-1-2',
    questionText: 'Are payment terminals positioned at accessible heights?',
    moduleCode: '4.3',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Payment Accessibility',
    summary: 'Payment terminals, methods, and receipts should all be accessible. This means terminals at reachable heights, portable options, diverse payment methods, and receipts in accessible formats.',

    whyItMatters: {
      text: 'Payment is often the final step in a customer interaction. If a wheelchair user cannot reach the EFTPOS terminal, a blind customer cannot read the screen, or a customer with dexterity issues cannot handle coins, the entire experience is undermined at the last moment.',
      quote: {
        text: 'The terminal was mounted on a high counter. I could not reach it or see the screen from my wheelchair. I had to hand my card to a stranger.',
        attribution: 'Wheelchair user, retail feedback'
      }
    },

    tips: [
      {
        icon: 'ArrowDown',
        text: 'Payment terminals should be reachable at 800-1,100mm height from the floor',
        priority: 1
      },
      {
        icon: 'Move',
        text: 'Use portable/handheld terminals that staff can bring to the customer',
        priority: 2
      },
      {
        icon: 'CreditCard',
        text: 'Accept tap-and-go, which is the most accessible payment method for most disabilities',
        priority: 3
      },
      {
        icon: 'FileText',
        text: 'Offer emailed or SMS receipts as an alternative to paper',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Checking payment accessibility',
      steps: [
        { text: 'Measure terminal height from the floor. Target: 800-1,100mm for seated users.' },
        { text: 'Test reach: Can someone in a wheelchair comfortably reach and see the screen?' },
        { text: 'Check if terminals can be detached or brought to the customer' },
        { text: 'Verify that tap-and-go is enabled on all terminals' },
        { text: 'Check screen contrast and text size on terminal displays' },
        { text: 'Test whether receipts can be emailed or sent by SMS' },
        { text: 'Ensure all payment methods available to other customers are available to people with disabilities' }
      ],
      estimatedTime: '15-20 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Retail Store',
        scenario: 'A retail store had EFTPOS terminals fixed to high counters, unreachable for wheelchair users.',
        solution: 'Replaced with wireless handheld terminals. Staff trained to bring the terminal to the customer rather than expecting them to reach. Tap-and-go enabled on all devices.',
        outcome: 'Wheelchair users can pay independently. Transaction times improved for all customers.',
        cost: '$200-500 per terminal upgrade'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Cafe',
        scenario: 'A cafe only accepted cash, creating barriers for customers with dexterity disabilities.',
        solution: 'Added card payment with tap-and-go. Staff offer to hold the terminal at a comfortable height and angle for each customer.',
        outcome: 'Customers with limited hand function can pay independently using contactless cards or phone wallets.',
        cost: '$30-50/month for card terminal rental'
      }
    ],

    solutions: [
      {
        title: 'Switch to portable payment terminals',
        description: 'Replace fixed terminals with wireless handheld devices that can be brought to any customer.',
        resourceLevel: 'low',
        costRange: '$200-500 per terminal',
        timeRequired: '1-2 days',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Contact your payment provider about wireless terminal options',
          'Enable tap-and-go on all devices',
          'Train staff to offer the terminal at a comfortable height and angle',
          'Ensure terminals have good screen contrast and readable text',
          'Set up digital receipt options (email or SMS)',
          'Keep at least one terminal charged and ready as a portable backup'
        ]
      },
      {
        title: 'Comprehensive payment accessibility review',
        description: 'Review all payment touchpoints for accessibility across your venue.',
        resourceLevel: 'medium',
        costRange: '$500-2,000',
        timeRequired: '1-2 days',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Audit all payment points for height, reach, and visibility',
          'Ensure all payment methods (cash, card, digital) are available at every point',
          'Check that self-service kiosks (if any) are accessible at seated height',
          'Add tactile markers to PIN pads if not already present',
          'Ensure receipts, invoices, and statements can be provided in accessible formats',
          'Test the full payment experience from a wheelchair',
          'Document and train staff on bringing payment to the customer'
        ]
      }
    ],

    resources: [
      {
        title: 'AS 1428.1 - Design for Access and Mobility',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Australian standard covering counter and terminal heights for accessibility.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.3-D-1',
        questionText: 'Is your online booking system accessible?',
        relationship: 'Online payment is part of accessible booking',
        moduleCode: '4.3'
      }
    ],

    coveredQuestionIds: ['4.3-1-1', '4.3-1-3', '4.3-D-5', '4.3-D-11', '4.3-D-12', '4.3-D-13'],
    keywords: ['payment', 'EFTPOS', 'terminal', 'tap and go', 'receipt', 'height', 'portable'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.3-D-14',
    questionText: 'Can customers bring their own food or drinks if they have specific dietary needs?',
    moduleCode: '4.3',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Dietary and Sensory Food Needs',
    summary: 'Some customers need to bring their own food due to severe allergies, medical conditions, or sensory processing differences. Others may need food prepared in specific ways (textures, separation). Flexible food policies support inclusion.',

    whyItMatters: {
      text: 'For people with severe allergies, sensory processing differences (common in autism), or medical dietary requirements (such as thickened fluids for swallowing difficulties), food is not just a preference. It can be a safety and participation issue. Rigid "no outside food" policies may exclude these customers entirely.',
      quote: {
        text: 'My son is autistic and only eats specific textures. If we cannot bring his food, we simply cannot visit.',
        attribution: 'Parent of autistic child'
      }
    },

    tips: [
      {
        icon: 'ShieldCheck',
        text: 'Allow customers to bring their own food for documented medical or disability reasons',
        priority: 1
      },
      {
        icon: 'Utensils',
        text: 'Offer to modify food preparation for sensory needs: foods not touching, specific textures, plain options',
        priority: 2
      },
      {
        icon: 'LayoutGrid',
        text: 'Stock divided/segmented plates for customers who need foods kept separate',
        priority: 3
      },
      {
        icon: 'AlertCircle',
        text: 'Train kitchen staff on common disability-related dietary needs beyond standard allergens',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your food flexibility',
      steps: [
        { text: 'Review your food policy: Does it allow outside food for medical/disability reasons?' },
        { text: 'Ask kitchen staff: Can you modify textures, serve foods separately, or prepare plain versions?' },
        { text: 'Check if divided plates are available (purchase from catering suppliers for $5-10 each)' },
        { text: 'Review allergen information: Is it available in accessible formats?' },
        { text: 'Ensure staff know to ask about dietary needs proactively, not just react to complaints' }
      ],
      estimatedTime: '15-20 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Family Restaurant',
        scenario: 'An autistic child could not eat any food on the menu due to texture sensitivities.',
        solution: 'Updated policy to allow outside food for medical/disability needs. Kitchen also added plain options (no sauce, foods separated, specific textures). Purchased divided plates.',
        outcome: 'The family became regular customers. Other families with autistic children followed.',
        cost: '$50-100 for divided plates; free policy update'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Zoo',
        scenario: 'A visitor with a swallowing disorder needed thickened fluids which the cafe could not provide.',
        solution: 'Updated "no outside food" policy to include a medical exemption. Added signage: "We welcome customers who need to bring their own food for medical reasons."',
        outcome: 'The visitor and their family can now enjoy full-day visits.',
        cost: 'Free'
      }
    ],

    solutions: [
      {
        title: 'Update food policy and add flexible options',
        description: 'Amend your food policy to accommodate disability-related dietary needs.',
        resourceLevel: 'low',
        costRange: 'Free-$100',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Add a medical/disability exemption to any "no outside food" policy',
          'Brief all staff: customers with medical or disability dietary needs may bring their own food',
          'Add plain/modified options to your menu (no sauce, separate items, smooth textures)',
          'Purchase divided plates (available from catering suppliers, $5-10 each)',
          'Ensure allergen information is displayed clearly and available in alternative formats',
          'Train kitchen staff on common disability-related needs: texture modification, thickened fluids, food separation'
        ]
      }
    ],

    resources: [
      {
        title: 'Autism Friendly Dining',
        url: 'https://www.amaze.org.au/',
        type: 'website',
        source: 'Amaze (Autism Victoria)',
        description: 'Resources on creating autism-friendly dining experiences.',
        isAustralian: true
      },
      {
        title: 'Food Standards Australia',
        url: 'https://www.foodstandards.gov.au/',
        type: 'website',
        source: 'FSANZ',
        description: 'Allergen labelling requirements and food safety standards.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-D-25',
        questionText: 'Do you offer alternative service delivery for customers who cannot access your standard service?',
        relationship: 'Food flexibility is a form of alternative service delivery',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.3-D-15', '4.3-D-16'],
    keywords: ['dietary', 'food', 'allergies', 'sensory', 'texture', 'divided plates', 'outside food'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULE 4.4: Safety and emergencies (3 entries)
  // =============================================

  {
    questionId: '4.4-1-1',
    questionText: 'Do your emergency procedures include plans for people with disabilities?',
    moduleCode: '4.4',
    moduleGroup: 'service-support',
    diapCategory: 'operations-policy-procedure',
    title: 'Emergency Planning and PEEPs',
    summary: 'Emergency procedures must specifically include people with disabilities. Personal Emergency Evacuation Plans (PEEPs) provide individualised plans for people who need assistance during evacuation.',

    whyItMatters: {
      text: 'Standard evacuation procedures assume everyone can hear alarms, see exit signs, and use stairs. For people who cannot, an emergency becomes life-threatening if there is no plan. PEEPs address individual needs before an emergency occurs.',
      statistic: {
        value: '15%',
        context: 'of the population has a disability that could affect their ability to evacuate independently.',
        source: 'Australian Bureau of Statistics'
      }
    },

    tips: [
      {
        icon: 'ClipboardList',
        text: 'Review your emergency plan: Does it mention people with disabilities at all?',
        priority: 1
      },
      {
        icon: 'UserCheck',
        text: 'Offer Personal Emergency Evacuation Plans (PEEPs) for regular visitors, staff, and tenants who need them',
        priority: 2
      },
      {
        icon: 'RefreshCw',
        text: 'Include disability scenarios in every evacuation drill, not just annual ones',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Assign specific staff to assist people with disabilities during evacuations',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your emergency planning',
      steps: [
        { text: 'Read your current emergency plan. Search for "disability", "wheelchair", "deaf", "blind".' },
        { text: 'Check if PEEPs are offered to staff, tenants, and regular visitors with disabilities' },
        { text: 'Review your last evacuation drill: Were disability scenarios included?' },
        { text: 'Ask wardens: What would you do if a wheelchair user was on the first floor during a fire?' },
        { text: 'Check if your plan accounts for people who are Deaf (visual alerts), blind (verbal guidance), or have cognitive disabilities (simplified instructions)' },
        { text: 'Verify that the plan is reviewed and updated at least annually' }
      ],
      estimatedTime: '30-60 minutes for review'
    },

    standardsReference: {
      primary: {
        code: 'NCC',
        section: 'Volume 1, Part E',
        requirement: 'Buildings must provide safe evacuation routes. Fire safety systems must consider all occupants.'
      },
      related: [
        {
          code: 'DDA',
          relevance: 'Failing to plan for people with disabilities in emergencies may constitute discrimination.'
        },
        {
          code: 'AS1428.1',
          relevance: 'Accessible paths of travel, including to emergency exits, must meet minimum widths and grades.'
        }
      ],
      plainEnglish: 'The law requires buildings to be safe for everyone. Emergency plans that only work for able-bodied people do not meet this standard. PEEPs are the accepted way to address individual evacuation needs.'
    },

    examples: [
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Conference Centre',
        scenario: 'A conference centre had no plan for evacuating delegates who use wheelchairs from upper floors.',
        solution: 'Developed PEEPs for regular wheelchair-using attendees. Installed refuge areas on each floor. Purchased evacuation chairs. Trained wardens on wheelchair-specific evacuation. All drills now include wheelchair and sensory disability scenarios.',
        outcome: 'All delegates have equal safety assurance. Building received an improved fire safety rating.',
        cost: '$2,000-5,000 for evacuation chairs; free for plan updates and training'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A Deaf guest missed a fire alarm because the alert was sound-only.',
        solution: 'Installed visual alert devices (flashing lights) in accessible rooms. Guest registration now asks about emergency alert preferences. Deaf guests receive a vibrating pillow alarm and visual alert unit.',
        outcome: 'All guests receive emergency alerts regardless of hearing ability.',
        cost: '$200-500 per room for visual/vibrating alert devices'
      }
    ],

    solutions: [
      {
        title: 'Update emergency plan to include disability',
        description: 'Add disability-specific sections to your existing emergency procedures.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '2-4 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Review your current emergency plan for gaps in disability coverage',
          'Add sections covering: mobility impairment, vision impairment, hearing impairment, cognitive/intellectual disability',
          'Identify refuge areas (safe waiting points) for people who cannot use stairs',
          'Assign specific wardens to disability-related roles in each drill',
          'Create a PEEP template for regular occupants with disabilities',
          'Update the plan annually and after any building changes'
        ]
      },
      {
        title: 'Implement PEEPs and evacuation equipment',
        description: 'Create individualised evacuation plans and acquire necessary equipment.',
        resourceLevel: 'medium',
        costRange: '$2,000-8,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'staff',
        impact: 'significant',
        steps: [
          'Create a PEEP template covering: mobility needs, communication needs, sensory needs, cognitive support',
          'Identify who needs a PEEP (staff, regular visitors, tenants)',
          'Complete PEEPs with each individual (not just for them)',
          'Purchase evacuation chairs if your building has stairs (one per stairwell is ideal)',
          'Train designated staff on evacuation chair use',
          'Include PEEP scenarios in all evacuation drills',
          'Review PEEPs every 6 months or when circumstances change'
        ]
      }
    ],

    resources: [
      {
        title: 'Evacuation Planning for People with Disability',
        url: 'https://www.humanrights.gov.au/',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Guidance on inclusive emergency planning.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Fire Safety for People with Disability',
        url: 'https://www.fire.nsw.gov.au/',
        type: 'guide',
        source: 'Fire and Rescue NSW',
        description: 'Fire safety guidance including considerations for people with disabilities.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.4-1-2',
        questionText: 'Are emergency exits accessible to people with mobility aids?',
        relationship: 'Accessible exits are fundamental to evacuation planning',
        moduleCode: '4.4'
      },
      {
        questionId: '4.2-D-16',
        questionText: 'Do staff know how to assist customers during an emergency evacuation?',
        relationship: 'Staff training is essential to execute PEEPs',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.4-D-1', '4.4-D-8'],
    keywords: ['emergency', 'evacuation', 'PEEP', 'fire safety', 'drill', 'warden'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.4-1-2',
    questionText: 'Are emergency exits accessible to people with mobility aids?',
    moduleCode: '4.4',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Evacuation Access and Equipment',
    summary: 'Emergency exits must be physically accessible, refuge areas should be available on upper floors, evacuation equipment (such as evacuation chairs) should be ready, and service animals must be included in evacuation plans.',

    whyItMatters: {
      text: 'In an emergency, time is critical. A blocked or inaccessible exit, a missing evacuation chair, or confusion about where a wheelchair user should wait can have serious consequences. Preparation and equipment save lives.',
      quote: {
        text: 'During the drill, the warden told me to "just wait" in the stairwell. No one came back for 20 minutes. In a real fire, I would be terrified.',
        attribution: 'Office worker who uses a wheelchair'
      }
    },

    tips: [
      {
        icon: 'DoorOpen',
        text: 'Check that at least one emergency exit on each level is step-free and wide enough for a wheelchair (minimum 850mm clear width)',
        priority: 1
      },
      {
        icon: 'Clock',
        text: 'Designate and sign refuge areas (safe waiting points) on floors above ground',
        detail: 'Refuge areas must have intercom or two-way communication with the control point.',
        priority: 2
      },
      {
        icon: 'Package',
        text: 'Evacuation chairs should be available at each stairwell in multi-storey buildings',
        priority: 3
      },
      {
        icon: 'Heart',
        text: 'Service animals stay with their handler during evacuation. Never separate them.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Checking evacuation access',
      steps: [
        { text: 'Walk each emergency exit route in a wheelchair or with a mobility aid. Note barriers.' },
        { text: 'Measure exit door widths: minimum 850mm clear opening required.' },
        { text: 'Check for steps, lips, or raised thresholds in exit paths' },
        { text: 'Identify refuge areas on upper floors. Are they signed and do they have communication devices?' },
        { text: 'Locate evacuation chairs: Are they accessible, charged (if powered), and signed?' },
        { text: 'Check that service animals are included in evacuation procedures' },
        { text: 'Verify that exit paths are kept clear of storage, furniture, and other obstructions' }
      ],
      estimatedTime: '30-60 minutes per floor'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council Office',
        scenario: 'A two-storey council office had no way to evacuate a wheelchair user from the upper floor.',
        solution: 'Installed refuge areas at each stairwell landing with intercoms. Purchased two evacuation chairs. Six staff trained as evacuation assistants. Signage updated throughout.',
        outcome: 'All staff can evacuate safely. Compliance with fire safety improved.',
        cost: '$3,000-6,000 for chairs and intercom; $500 for signage'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel had no plan for evacuating a guest with an assistance dog.',
        solution: 'Updated procedures: assistance animals stay with their handler at all times during evacuation. Refuge areas accommodate handler and animal. Staff trained not to separate them.',
        outcome: 'Guests with assistance animals feel safe. Staff know exactly what to do.',
        cost: 'Free (procedure update only)'
      }
    ],

    solutions: [
      {
        title: 'Audit and fix emergency exit accessibility',
        description: 'Walk all exit routes and fix physical barriers.',
        resourceLevel: 'low',
        costRange: '$200-2,000',
        timeRequired: '1-2 days',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Walk every emergency exit route from each area of the building',
          'Note door widths, steps, thresholds, and obstructions',
          'Fix quick wins: remove stored items, adjust door closers, add tactile floor markers',
          'Commission works for larger issues: ramps at exit doors, door widening',
          'Ensure exit signage includes international accessibility symbols where appropriate',
          'Re-walk routes after fixes to confirm accessibility'
        ]
      },
      {
        title: 'Install evacuation chairs and refuge areas',
        description: 'Set up equipment and safe waiting points for people who cannot use stairs.',
        resourceLevel: 'high',
        costRange: '$3,000-10,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Identify stairwells that need evacuation chairs (ideally all in multi-storey buildings)',
          'Select chairs appropriate for your building (stair type, number of floors)',
          'Install storage brackets near stairwells with clear signage',
          'Designate refuge areas with fire-resistant construction and intercoms',
          'Train at least 2 staff per floor in evacuation chair operation',
          'Include chair deployment in every evacuation drill',
          'Schedule 6-monthly equipment checks and maintenance'
        ]
      }
    ],

    resources: [
      {
        title: 'Evacuation Chair Suppliers Australia',
        url: 'https://www.evac-chair.com.au/',
        type: 'website',
        source: 'Evac+Chair',
        description: 'Evacuation chair products and training for Australian buildings.',
        isAustralian: true
      },
      {
        title: 'AS 1428.1 - Emergency Egress',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Requirements for accessible emergency exits and paths of travel.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.4-1-1',
        questionText: 'Do your emergency procedures include plans for people with disabilities?',
        relationship: 'Accessible exits enable the emergency plan to work',
        moduleCode: '4.4'
      }
    ],

    coveredQuestionIds: ['4.4-D-2', '4.4-D-3', '4.4-D-7'],
    keywords: ['evacuation', 'exit', 'refuge area', 'evacuation chair', 'service animal', 'stairs'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.4-1-3',
    questionText: 'Are there visual and audible alarms for emergencies?',
    moduleCode: '4.4',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Emergency Communication and Support',
    summary: 'Emergency alerts must reach everyone: audible alarms for sighted people, visual alarms (flashing lights) for Deaf people, and clear communication strategies for people with cognitive disabilities or anxiety.',

    whyItMatters: {
      text: 'A sound-only alarm is invisible to someone who is Deaf. Flashing lights without sound will not alert someone who is blind. Shouted instructions will not help someone with an intellectual disability who needs calm, simple guidance. Multi-format emergency communication ensures no one is left behind.',
      quote: {
        text: 'I am Deaf. During a real evacuation, I only knew something was wrong because other people started running. That is not safe.',
        attribution: 'Deaf office worker'
      }
    },

    tips: [
      {
        icon: 'Bell',
        text: 'Install both audible and visual (flashing strobe) alarms in all areas',
        priority: 1
      },
      {
        icon: 'Eye',
        text: 'Train wardens on communicating with Deaf people in emergencies: use gestures, written notes, or pre-agreed signals',
        priority: 2
      },
      {
        icon: 'FileText',
        text: 'Display emergency procedures in accessible formats: large print, pictorial/Easy Read, Braille at key points',
        priority: 3
      },
      {
        icon: 'Heart',
        text: 'Prepare for people with anxiety or cognitive differences: use calm voices, simple instructions, guide physically if consented',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Checking emergency communication',
      steps: [
        { text: 'Walk your venue with earplugs: Would you know about an alarm? Look for visual alerts.' },
        { text: 'Check all areas including toilets, lifts, and quiet rooms for visual alarm coverage' },
        { text: 'Review emergency signage: Is it in plain language with pictorial guidance?' },
        { text: 'Ask wardens: How would you communicate with a Deaf person during evacuation?' },
        { text: 'Check if emergency information is available in alternative formats (large print, Easy Read)' },
        { text: 'Test: During the last drill, could everyone hear and understand the instructions?' }
      ],
      estimatedTime: '30-45 minutes'
    },

    examples: [
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Stadium',
        scenario: 'Deaf spectators had no way to know about emergencies in a noisy stadium.',
        solution: 'Installed visual alert beacons throughout seating areas. Digital screens display emergency messages in text. Staff positioned near accessible seating are trained in basic Auslan emergency signs.',
        outcome: 'All spectators receive emergency alerts regardless of hearing ability.',
        cost: '$5,000-15,000 for visual alert system; free for staff training'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Aged Care Facility',
        scenario: 'Residents with dementia became extremely distressed during fire drills.',
        solution: 'Developed a calm evacuation protocol: gentle voice, physical guidance with consent, familiar faces leading each group. Drills are practiced in small groups rather than building-wide to reduce distress.',
        outcome: 'Residents respond more calmly. Staff feel equipped to manage evacuations compassionately.',
        cost: 'Free (procedure changes only)'
      }
    ],

    solutions: [
      {
        title: 'Add visual alarms and accessible signage',
        description: 'Install visual alerting and update emergency signage for accessibility.',
        resourceLevel: 'medium',
        costRange: '$500-5,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Audit all areas for visual alarm coverage (flashing strobes)',
          'Install visual alarms in areas without them, prioritising toilets, quiet rooms, and isolated spaces',
          'Create pictorial/Easy Read emergency procedure signs',
          'Install emergency signage at seated height (1,200-1,400mm) and standing height',
          'Add Braille emergency information at key exit points',
          'Brief wardens on multi-format communication strategies'
        ]
      },
      {
        title: 'Train wardens on inclusive evacuation communication',
        description: 'Equip wardens with skills for communicating with people across all disability types during emergencies.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Teach basic emergency signs in Auslan: "fire", "go", "follow me", "safe"',
          'Practice communicating through gestures and written notes',
          'Train on supporting people with anxiety: calm voice, simple instructions, physical guidance with consent',
          'Practice guiding a person who is blind: offer your elbow, describe the path',
          'Include diverse scenarios in every drill',
          'Create emergency communication cards that wardens carry'
        ]
      }
    ],

    resources: [
      {
        title: 'AS 1428.5 - Communication for Deaf or Hard of Hearing',
        url: 'https://www.standards.org.au/',
        type: 'guide',
        source: 'Standards Australia',
        description: 'Requirements for visual alarms and communication systems.',
        isAustralian: true
      },
      {
        title: 'Emergency Management for People with Disability',
        url: 'https://knowledge.aidr.org.au/',
        type: 'guide',
        source: 'Australian Institute for Disaster Resilience',
        description: 'Guidance on including people with disabilities in emergency management.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.4-1-1',
        questionText: 'Do your emergency procedures include plans for people with disabilities?',
        relationship: 'Communication is a core part of emergency planning',
        moduleCode: '4.4'
      }
    ],

    coveredQuestionIds: ['4.4-1-4', '4.4-D-4', '4.4-D-5', '4.4-D-6'],
    keywords: ['alarm', 'visual alert', 'Deaf', 'emergency communication', 'anxiety', 'cognitive', 'warden'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULE 4.5: Feedback and reviews (3 entries)
  // =============================================

  {
    questionId: '4.5-F-1',
    questionText: 'Do you have a way for customers to provide feedback about accessibility?',
    moduleCode: '4.5',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Collecting Accessible Feedback',
    summary: 'Customers need multiple accessible ways to tell you about their experience, including accessibility barriers. Feedback forms themselves must be accessible, and anonymous options should be available.',

    whyItMatters: {
      text: 'Most people who encounter an accessibility barrier do not complain. They just leave and do not return. Making it easy to give feedback, through multiple accessible channels, helps you catch problems you would never otherwise know about.',
      statistic: {
        value: '90%',
        context: 'of customers who have a negative accessibility experience never formally report it.',
        source: 'Disability advocacy research'
      }
    },

    tips: [
      {
        icon: 'MessageSquare',
        text: 'Offer at least three feedback channels: in-person, email/phone, and an accessible online form',
        priority: 1
      },
      {
        icon: 'Keyboard',
        text: 'Test your feedback form with a keyboard and screen reader. Fix any barriers.',
        priority: 2
      },
      {
        icon: 'EyeOff',
        text: 'Allow anonymous feedback for customers who do not want to identify themselves',
        priority: 3
      },
      {
        icon: 'Tag',
        text: 'Include an accessibility-specific prompt in your general feedback (e.g., "Did you experience any accessibility barriers?")',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your feedback channels',
      steps: [
        { text: 'List all the ways a customer can currently give feedback' },
        { text: 'Test each channel for accessibility: Can a screen reader user complete your online form?' },
        { text: 'Check if there is an anonymous option (no name or email required)' },
        { text: 'Review whether feedback forms specifically ask about accessibility' },
        { text: 'Check that feedback can be given in person, not just online' },
        { text: 'Verify that someone actually reads and responds to accessibility feedback' }
      ],
      estimatedTime: '20-30 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre only collected feedback through a touchscreen kiosk, inaccessible to blind shoppers.',
        solution: 'Added email, phone, and paper feedback options alongside the kiosk. Paper forms available at information desk. Added an accessibility question to all feedback channels. Anonymous option added.',
        outcome: 'Accessibility feedback increased 300%. Centre identified and fixed three barriers in the first month.',
        cost: '$200-500 for form updates'
      },
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Hospital',
        scenario: 'A hospital\'s patient feedback survey was a PDF that could not be completed on screen.',
        solution: 'Replaced with an accessible online form (WCAG 2.2 compliant). Added an accessibility section asking about physical access, communication, and staff interactions. Paper version available on request.',
        outcome: 'Response rate from patients with disabilities increased. Several systemic issues were identified and fixed.',
        cost: '$500-1,500 for form development'
      }
    ],

    solutions: [
      {
        title: 'Add accessibility prompts to existing feedback',
        description: 'Add accessibility-specific questions to your current feedback channels.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Add a question to existing forms: "Did you experience any accessibility barriers during your visit?"',
          'Include a free-text field for accessibility suggestions',
          'Ensure the form can be submitted without requiring identification (anonymous option)',
          'Add an email address for direct accessibility feedback',
          'Brief staff to proactively invite feedback from customers with visible disabilities',
          'Place "Tell us about your experience" cards with contact details in accessible areas'
        ]
      },
      {
        title: 'Create an accessible multi-channel feedback system',
        description: 'Build a comprehensive feedback system that works across all channels and disability types.',
        resourceLevel: 'medium',
        costRange: '$500-2,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Design an accessible online form (WCAG 2.2 AA compliant)',
          'Create a paper version in standard and large print formats',
          'Set up email and phone feedback options with equal visibility',
          'Add QR codes at key points linking to the online form',
          'Configure a feedback inbox that flags accessibility-related responses',
          'Train front-of-house staff to assist customers in providing feedback',
          'Create an Easy Read feedback card with simple questions and tick boxes'
        ]
      }
    ],

    resources: [
      {
        title: 'Australian Human Rights Commission - Complaints',
        url: 'https://humanrights.gov.au/complaints',
        type: 'website',
        source: 'AHRC',
        description: 'Understanding the formal complaint process helps you resolve issues before they escalate.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'WCAG 2.2 Forms Guidance',
        url: 'https://www.w3.org/WAI/tutorials/forms/',
        type: 'guide',
        source: 'W3C',
        description: 'How to create accessible web forms.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-F-7',
        questionText: 'Is there a clear process for handling accessibility complaints?',
        relationship: 'Complaints are a subset of feedback that needs a formal response process',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.5-F-2', '4.5-D-1', '4.5-D-7'],
    keywords: ['feedback', 'survey', 'form', 'accessible', 'anonymous', 'channels'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.5-F-3',
    questionText: 'Do you actively monitor and respond to online reviews?',
    moduleCode: '4.5',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Managing Online Reviews',
    summary: 'Online reviews (Google, TripAdvisor, social media) are often where people with disabilities share their experiences. Monitoring and responding to these reviews shows you are listening and improving.',

    whyItMatters: {
      text: 'Many people with disabilities check reviews before visiting a venue. They look for mentions of accessibility. A negative review left unanswered signals that you do not care. A thoughtful response, especially one that shows you have made changes, builds trust and attracts new customers.',
      quote: {
        text: 'I always search reviews for "wheelchair" or "accessible" before booking. If a business responds to accessibility feedback, I feel confident going.',
        attribution: 'Wheelchair user, travel forum'
      }
    },

    tips: [
      {
        icon: 'Search',
        text: 'Set up alerts for reviews mentioning "accessible", "wheelchair", "disability", "hearing loop"',
        priority: 1
      },
      {
        icon: 'MessageCircle',
        text: 'Respond to all accessibility-related reviews, positive and negative, within 48 hours',
        priority: 2
      },
      {
        icon: 'Share2',
        text: 'When you make improvements based on feedback, reply to the original review with an update',
        priority: 3
      },
      {
        icon: 'ThumbsUp',
        text: 'Thank positive accessibility reviewers. Their reviews help other people with disabilities find you.',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your online presence',
      steps: [
        { text: 'Search your business on Google, TripAdvisor, and Facebook for reviews mentioning accessibility' },
        { text: 'Check how many accessibility reviews have received a response from you' },
        { text: 'Look at your competitors: Do they respond to accessibility reviews?' },
        { text: 'Set up Google Alerts or review monitoring for accessibility keywords' },
        { text: 'Check if you communicate improvements publicly (website, social media, review replies)' }
      ],
      estimatedTime: '30 minutes'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A wheelchair user left a negative review about an inaccessible bathroom in the "accessible" room.',
        solution: 'Management responded within 24 hours, apologised, and explained specific changes being made. After renovation, they updated the review response with photos of the improved room.',
        outcome: 'The reviewer updated their rating. Other wheelchair users saw the response and booked with confidence.',
        cost: 'Free (response time only)'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A Deaf customer posted that staff were dismissive when they tried to communicate.',
        solution: 'Owner responded publicly, apologised, and shared that staff were now trained in basic communication with Deaf customers. Invited the reviewer to return. Staff completed a 1-hour training session.',
        outcome: 'The customer returned and posted a positive follow-up. Other Deaf customers tried the restaurant.',
        cost: 'Free'
      }
    ],

    solutions: [
      {
        title: 'Set up accessibility review monitoring',
        description: 'Create a system for tracking and responding to accessibility-related online reviews.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours setup, 30 minutes/week ongoing',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Set up Google Alerts for your business name plus accessibility keywords',
          'Claim your business on Google, TripAdvisor, and Facebook if not already done',
          'Designate a staff member to check reviews weekly',
          'Create response templates for common accessibility praise and complaints',
          'Set a 48-hour response target for all accessibility-related reviews',
          'When improvements are made, go back and update relevant review responses'
        ]
      },
      {
        title: 'Proactively communicate accessibility improvements',
        description: 'Share accessibility improvements publicly to build confidence among potential visitors with disabilities.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1 hour per update',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Create an accessibility page on your website listing features and recent improvements',
          'Post about accessibility improvements on social media',
          'Update review responses when issues raised have been fixed',
          'Include accessibility highlights in email newsletters',
          'Ask satisfied customers with disabilities if they would be willing to share a testimonial'
        ]
      }
    ],

    resources: [
      {
        title: 'Travability - Accessible Tourism Reviews',
        url: 'https://www.travability.travel/',
        type: 'website',
        source: 'Travability',
        description: 'Platform for accessible tourism reviews in Australia.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Google Business Profile Help',
        url: 'https://support.google.com/business/',
        type: 'website',
        source: 'Google',
        description: 'How to manage and respond to Google reviews.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.5-F-4',
        questionText: 'Do you regularly review and act on accessibility feedback?',
        relationship: 'Reviews are one source of feedback that should drive action',
        moduleCode: '4.5'
      }
    ],

    coveredQuestionIds: ['4.5-D-2', '4.5-D-5'],
    keywords: ['reviews', 'Google', 'TripAdvisor', 'online', 'reputation', 'respond'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.5-F-4',
    questionText: 'Do you regularly review and act on accessibility feedback?',
    moduleCode: '4.5',
    moduleGroup: 'service-support',
    diapCategory: 'operations-policy-procedure',
    title: 'Acting on Accessibility Feedback',
    summary: 'Collecting feedback only matters if you track it, identify patterns, respond promptly, and use it to drive real improvements. Systematic tracking and escalation processes turn complaints into progress.',

    whyItMatters: {
      text: 'Individual complaints often reveal systemic issues. If three people mention the same broken automatic door in different months, that is a pattern. Without tracking, each complaint is treated as isolated and nothing changes.',
      statistic: {
        value: '65%',
        context: 'of customers who provide negative feedback will return if the issue is resolved promptly.',
        source: 'Customer experience research'
      }
    },

    tips: [
      {
        icon: 'BarChart',
        text: 'Track accessibility feedback in a spreadsheet or system to identify patterns',
        priority: 1
      },
      {
        icon: 'Clock',
        text: 'Set target response times: acknowledge within 24 hours, resolve within 5 business days',
        priority: 2
      },
      {
        icon: 'ArrowUp',
        text: 'Have an escalation process: frontline staff, manager, executive, then external body',
        priority: 3
      },
      {
        icon: 'CheckCircle',
        text: 'Close the loop: tell the person what you did about their feedback',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your feedback process',
      steps: [
        { text: 'Check: Do you log accessibility feedback separately from general feedback?' },
        { text: 'Review the last 12 months of feedback: Can you identify patterns or recurring issues?' },
        { text: 'Check response times: How long did it take to acknowledge and resolve each complaint?' },
        { text: 'Ask: Is there an escalation process for serious or unresolved accessibility issues?' },
        { text: 'Verify: Do you report on accessibility feedback trends (quarterly or annually)?' },
        { text: 'Check: Are improvements communicated back to the people who raised the issue?' }
      ],
      estimatedTime: '30-60 minutes'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council received multiple accessibility complaints but had no way to see patterns.',
        solution: 'Created an accessibility feedback register (simple spreadsheet). Each complaint logged with: date, issue, category (physical, communication, service), status, resolution. Reviewed quarterly by the accessibility committee.',
        outcome: 'In the first quarter, three recurring issues were identified and fixed. Complaint volume dropped 40%.',
        cost: 'Free (spreadsheet and staff time)'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A museum resolved complaints individually but never tracked whether the same issues recurred.',
        solution: 'Added accessibility as a tracked category in their CRM. Set up quarterly reporting. Created an escalation path: front desk, operations manager, director. Serious complaints (safety, discrimination) escalated within 24 hours.',
        outcome: 'Museum can demonstrate continuous accessibility improvement with data. Used in DIAP reporting.',
        cost: 'Free (system configuration only)'
      }
    ],

    solutions: [
      {
        title: 'Create an accessibility feedback register',
        description: 'Set up a simple tracking system for all accessibility-related feedback.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Create a spreadsheet with columns: date, source, issue description, category, severity, status, assigned to, resolution, date resolved',
          'Log all accessibility feedback (complaints, suggestions, compliments)',
          'Review weekly for urgent items and monthly for patterns',
          'Assign each item to a responsible person with a target resolution date',
          'Report quarterly on: total issues, categories, resolution times, improvements made',
          'Share anonymised insights with staff to build awareness'
        ]
      },
      {
        title: 'Establish escalation and response protocols',
        description: 'Create clear rules for responding to and escalating accessibility feedback.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '2-3 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Define severity levels: low (suggestion), medium (barrier), high (safety/discrimination)',
          'Set response targets by severity: high = 24 hours, medium = 2 business days, low = 5 business days',
          'Define escalation path: Level 1 (frontline), Level 2 (manager), Level 3 (executive)',
          'Create response templates for each severity level',
          'Require a resolution summary for every closed issue',
          'Report unresolved high-severity items to leadership weekly'
        ]
      }
    ],

    resources: [
      {
        title: 'Disability Discrimination Act - Complaint Process',
        url: 'https://humanrights.gov.au/complaints/complaint-guides/making-complaint',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Understanding the formal DDA complaint process helps you resolve issues internally first.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.2-F-7',
        questionText: 'Is there a clear process for handling accessibility complaints?',
        relationship: 'Complaint handling is the immediate response; this is the systemic follow-through',
        moduleCode: '4.2'
      }
    ],

    coveredQuestionIds: ['4.5-D-3', '4.5-D-4', '4.5-D-6'],
    keywords: ['tracking', 'patterns', 'escalation', 'response time', 'improvement', 'register'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULE 4.6: Staying connected (3 entries)
  // =============================================

  {
    questionId: '4.6-F-1',
    questionText: 'Are your marketing emails and newsletters accessible?',
    moduleCode: '4.6',
    moduleGroup: 'service-support',
    diapCategory: 'information-communication-marketing',
    title: 'Accessible Marketing and Social Media',
    summary: 'Marketing emails, newsletters, social media posts, promotional offers, and other outbound communications should be accessible to people using screen readers, with alternative text on images and options like SMS and Auslan content.',

    whyItMatters: {
      text: 'If your marketing is not accessible, people with disabilities never learn about your offers, events, or improvements. They are excluded before they even decide to visit. Accessible marketing is both inclusive and commercially smart.',
      statistic: {
        value: '$54 billion',
        context: 'is the annual spending power of Australians with disabilities. Accessible marketing reaches this market.',
        source: 'AND Disability Confidence Report'
      }
    },

    tips: [
      {
        icon: 'Mail',
        text: 'Design emails to be readable without images: use real text, not text-in-images',
        priority: 1
      },
      {
        icon: 'Image',
        text: 'Add alt text to all images in emails and social media posts',
        priority: 2
      },
      {
        icon: 'Phone',
        text: 'Offer SMS alternatives for customers who cannot read email easily',
        priority: 3
      },
      {
        icon: 'Video',
        text: 'Caption all video content and consider Auslan interpretation for key announcements',
        priority: 4
      },
      {
        icon: 'Accessibility',
        text: 'Include accessibility information in your marketing (what features you offer, improvements you have made)',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Auditing your marketing for accessibility',
      steps: [
        { text: 'Open your last newsletter with images turned off. Is it still readable?' },
        { text: 'Check alt text on images in your last 5 social media posts' },
        { text: 'Test your email template with a screen reader' },
        { text: 'Review whether promotional offers are available in accessible formats (not just image-based)' },
        { text: 'Check if you offer SMS or text alternatives to email marketing' },
        { text: 'Review social media video content: Are captions included?' }
      ],
      estimatedTime: '30-45 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Department Store',
        scenario: 'A store\'s promotional emails were entirely image-based, invisible to screen readers.',
        solution: 'Redesigned email template using HTML text with images as supplements. Added alt text to all images. Offer details included in text, not just graphics. SMS opt-in added for key promotions.',
        outcome: 'Customers using screen readers can now access promotions. Email open rates improved overall (images-off readers can now engage).',
        cost: '$500-1,500 for template redesign'
      },
      {
        businessType: 'event-venue',
        businessTypeLabel: 'Theatre',
        scenario: 'A theatre promoted Auslan-interpreted performances but only on social media, where the posts had no captions or alt text.',
        solution: 'Added captions to all video posts. Used alt text on images. Created an accessible events calendar on the website. Key announcements include an Auslan video version.',
        outcome: 'Deaf community engagement increased. Auslan-interpreted performance bookings rose 50%.',
        cost: '$200-500 for captioning; free for alt text and calendar'
      }
    ],

    solutions: [
      {
        title: 'Make existing email marketing accessible',
        description: 'Update your current email templates and social media practices for accessibility.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '2-4 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Audit your current email template: ensure all content is in HTML text, not images',
          'Add alt text to every image in email and social media',
          'Include a plain text version of every email',
          'Use descriptive link text ("View our accessibility page" not "Click here")',
          'Add captions to all video content on social media',
          'Offer an SMS marketing opt-in for customers who prefer text messages',
          'Include accessibility highlights in regular marketing content'
        ]
      },
      {
        title: 'Add Auslan and alternative format content',
        description: 'Include Auslan video and alternative formats in key marketing communications.',
        resourceLevel: 'medium',
        costRange: '$500-3,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Identify your highest-impact communications (event announcements, major promotions, policy changes)',
          'Commission Auslan translation videos for these key items',
          'Add Auslan content to your website and social media',
          'Create Easy Read versions of important announcements',
          'Ensure all PDFs and documents in marketing are tagged and accessible',
          'Include access information (what features you offer) in regular communications'
        ]
      }
    ],

    resources: [
      {
        title: 'WebAIM - Accessible Email',
        url: 'https://webaim.org/techniques/email/',
        type: 'guide',
        source: 'WebAIM',
        description: 'Guide to creating accessible email communications.',
        isFree: true
      },
      {
        title: 'Social Media Accessibility Guide',
        url: 'https://www.w3.org/WAI/people-use-web/',
        type: 'guide',
        source: 'W3C',
        description: 'Understanding how people with disabilities use the web and social media.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.7-PC-2',
        questionText: 'Are your emails designed for accessibility?',
        relationship: 'Marketing emails overlap with general email accessibility practices',
        moduleCode: '4.7'
      }
    ],

    coveredQuestionIds: ['4.6-F-3', '4.6-D-1', '4.6-D-3', '4.6-D-4', '4.6-D-9'],
    keywords: ['email', 'newsletter', 'social media', 'marketing', 'alt text', 'captions', 'Auslan', 'SMS'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.6-F-4',
    questionText: 'Is your loyalty or rewards program accessible?',
    moduleCode: '4.6',
    moduleGroup: 'service-support',
    diapCategory: 'customer-service',
    title: 'Accessible Customer Programs',
    summary: 'Loyalty programs, referral schemes, and live chat services should all be usable by people with disabilities. If these programs are not accessible, you are excluding loyal customers from benefits.',

    whyItMatters: {
      text: 'Loyalty programs reward repeat customers. If the program app is not screen-reader-compatible, the referral link requires a phone call, or live chat does not work with assistive technology, people with disabilities are cut off from the same benefits as everyone else.',
      quote: {
        text: 'I have been a loyal customer for years, but I could not use the new app to earn points. They said "just use the app" but the app does not work with VoiceOver.',
        attribution: 'Blind customer, loyalty program user'
      }
    },

    tips: [
      {
        icon: 'Star',
        text: 'Test your loyalty program app or website with a screen reader and keyboard',
        priority: 1
      },
      {
        icon: 'Users',
        text: 'Offer a non-digital option for earning and redeeming loyalty points',
        priority: 2
      },
      {
        icon: 'MessageSquare',
        text: 'If you offer live chat, test it with assistive technology',
        detail: 'Many chat widgets are keyboard-inaccessible or do not work with screen readers.',
        priority: 3
      },
      {
        icon: 'Share2',
        text: 'Ensure referral programs can be accessed through multiple channels, not just one format',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Testing your customer programs',
      steps: [
        { text: 'Navigate your loyalty program sign-up using only a keyboard' },
        { text: 'Test the loyalty app (if any) with VoiceOver (iOS) or TalkBack (Android)' },
        { text: 'Check if points can be earned and redeemed without the app (e.g., card, phone number, staff assistance)' },
        { text: 'Test live chat (if offered) with keyboard and screen reader' },
        { text: 'Check that referral links/codes work in accessible formats' },
        { text: 'Verify that program terms and conditions are available in accessible formats' }
      ],
      estimatedTime: '30-45 minutes'
    },

    examples: [
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Cafe Chain',
        scenario: 'A cafe chain\'s loyalty app was not accessible, excluding blind and low-vision customers.',
        solution: 'Filed an accessibility audit of the app and fixed critical issues: added labels to all buttons, ensured VoiceOver compatibility, added a phone number option for earning points without the app.',
        outcome: 'Blind customers can now earn and redeem rewards. Overall app rating improved.',
        cost: '$2,000-5,000 for app accessibility fix'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Online Retailer',
        scenario: 'A retailer\'s live chat widget opened in a popup that was invisible to screen readers.',
        solution: 'Switched to an accessible chat platform that works with keyboard and screen readers. Chat window is focusable and navigable. Chat transcripts can be emailed after the session.',
        outcome: 'All customers can use live chat for support. Support satisfaction scores improved.',
        cost: '$500-2,000/year for accessible chat platform'
      }
    ],

    solutions: [
      {
        title: 'Add non-digital alternatives to loyalty programs',
        description: 'Ensure loyalty benefits are available without requiring app or web access.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Allow loyalty sign-up via phone number or physical card (not app only)',
          'Train staff to look up and apply points at the register',
          'Ensure redemption can happen in-person, not just online',
          'Communicate these alternatives on your website and at point of sale',
          'Include accessibility in the next app/platform update requirements'
        ]
      },
      {
        title: 'Audit and fix digital program accessibility',
        description: 'Test and fix your loyalty app, referral program, and live chat for WCAG compliance.',
        resourceLevel: 'medium',
        costRange: '$2,000-8,000',
        timeRequired: '2-4 weeks',
        implementedBy: 'specialist',
        impact: 'significant',
        steps: [
          'Conduct a WCAG 2.2 audit of your loyalty app or web portal',
          'Test live chat with keyboard, screen reader, and voice control',
          'Prioritise fixes: critical (cannot sign up/redeem) then moderate (difficult to use)',
          'Work with your development team or vendor to implement fixes',
          'Re-test after fixes with real assistive technology users if possible',
          'Add accessibility requirements to your vendor contracts for future updates'
        ]
      }
    ],

    resources: [
      {
        title: 'Mobile App Accessibility Guidelines',
        url: 'https://www.w3.org/TR/mobile-accessibility-mapping/',
        type: 'guide',
        source: 'W3C',
        description: 'How WCAG applies to mobile apps.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.6-F-1',
        questionText: 'Are your marketing emails and newsletters accessible?',
        relationship: 'Loyalty program communications should follow email accessibility practices',
        moduleCode: '4.6'
      }
    ],

    coveredQuestionIds: ['4.6-D-2', '4.6-D-5'],
    keywords: ['loyalty', 'rewards', 'app', 'live chat', 'referral', 'program'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.6-F-2',
    questionText: 'Can customers easily manage their communication preferences?',
    moduleCode: '4.6',
    moduleGroup: 'service-support',
    diapCategory: 'information-communication-marketing',
    title: 'Customer Preferences and Notifications',
    summary: 'Customers should be able to set, update, and manage how you communicate with them. Storing accessibility preferences for future visits and notifying customers about improvements builds lasting relationships.',

    whyItMatters: {
      text: 'A customer who needs large print should not have to ask every time. A customer who is Deaf should not receive phone call notifications. Storing and respecting preferences shows respect and reduces friction across every future interaction.',
      quote: {
        text: 'I told them three times that I need email, not phone calls. Each time a different staff member calls me. It is exhausting.',
        attribution: 'Customer who is hard of hearing'
      }
    },

    tips: [
      {
        icon: 'Settings',
        text: 'Create a self-service preference centre where customers can set communication method and format',
        priority: 1
      },
      {
        icon: 'Database',
        text: 'Store accessibility preferences centrally so all staff and systems can access them',
        priority: 2
      },
      {
        icon: 'Bell',
        text: 'When you make accessibility improvements, notify customers who have indicated disability-related preferences',
        priority: 3
      },
      {
        icon: 'Smartphone',
        text: 'If you use push notifications, test them with assistive technology (VoiceOver, TalkBack)',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your preference management',
      steps: [
        { text: 'Check: Can customers set their preferred contact method (email, SMS, phone, post)?' },
        { text: 'Check: Can customers set format preferences (standard, large print, audio, Easy Read)?' },
        { text: 'Test: If a customer updates preferences, does the change take effect across all touchpoints?' },
        { text: 'Review: Do you notify customers when you make accessibility improvements relevant to them?' },
        { text: 'Test push notifications (if applicable) with screen readers on iOS and Android' },
        { text: 'Check that unsubscribe/opt-out is accessible and does not require visual CAPTCHAs' }
      ],
      estimatedTime: '20-30 minutes'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council kept calling a Deaf resident despite being asked for email communication only.',
        solution: 'Created a central preference register in the CRM. All departments access the same record. Residents can update preferences online, by email, or in-person. System alerts staff to preferred method before any outbound contact.',
        outcome: 'Deaf residents receive all communications by their preferred method. Complaints about unwanted phone calls dropped to zero.',
        cost: '$500-2,000 for CRM configuration'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel Chain',
        scenario: 'A hotel chain had no way to remember returning guests\' accessibility needs.',
        solution: 'Added accessibility preferences to guest profiles: preferred room features (roll-in shower, visual alarm, low bed), communication method, dietary needs. Preferences are flagged at check-in.',
        outcome: 'Returning guests with disabilities are served correctly from arrival. Guest loyalty increased.',
        cost: '$1,000-3,000 for system update'
      }
    ],

    solutions: [
      {
        title: 'Add preference management to customer records',
        description: 'Add accessibility and communication preference fields to your customer database.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '2-4 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Add fields to your CRM or customer database: preferred contact method, preferred format, accessibility needs',
          'Make these fields visible to all customer-facing staff',
          'Train staff to ask about preferences at first interaction',
          'Set up system alerts when a customer with preferences is contacted',
          'Allow customers to update preferences through multiple channels (online, phone, in-person)',
          'Review stored preferences annually to ensure they are current'
        ]
      },
      {
        title: 'Create accessibility improvement notifications',
        description: 'Set up a system to notify customers when accessibility improvements are made that are relevant to them.',
        resourceLevel: 'low',
        costRange: 'Free',
        timeRequired: '1-2 hours per update',
        implementedBy: 'staff',
        impact: 'quick-win',
        steps: [
          'Maintain a list of customers who have disclosed accessibility needs',
          'When a relevant improvement is made (new hearing loop, accessible parking, ramp upgrade), notify these customers',
          'Use their preferred communication method for the notification',
          'Include the improvement on your website accessibility page',
          'Share on social media using accessible posting practices',
          'Update any previous review responses mentioning the issue'
        ]
      }
    ],

    resources: [
      {
        title: 'Push Notification Accessibility',
        url: 'https://developer.apple.com/accessibility/',
        type: 'guide',
        source: 'Apple Developer',
        description: 'Accessibility guidelines for iOS notifications.',
        isFree: true
      },
      {
        title: 'CRM Accessibility Best Practices',
        url: 'https://www.and.org.au/',
        type: 'guide',
        source: 'Australian Network on Disability',
        description: 'How to build accessibility into customer relationship management.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.1-PC-3',
        questionText: 'Do you capture and use customer communication preferences?',
        relationship: 'Initial capture of preferences that should be maintained over time',
        moduleCode: '4.1'
      },
      {
        questionId: '4.7-PC-7',
        questionText: 'Do you remember and apply preferences for ongoing correspondence?',
        relationship: 'Applying stored preferences to written communications',
        moduleCode: '4.7'
      }
    ],

    coveredQuestionIds: ['4.6-D-6', '4.6-D-7', '4.6-D-8'],
    keywords: ['preferences', 'notifications', 'push', 'CRM', 'remember', 'communication method'],
    lastUpdated: '2026-02-26'
  },

  // =============================================
  // MODULE 4.7: Keeping in touch (3 entries)
  // =============================================

  {
    questionId: '4.7-PC-1',
    questionText: 'Are your written communications (letters, emails, invoices) designed to be clear and accessible?',
    moduleCode: '4.7',
    moduleGroup: 'service-support',
    diapCategory: 'information-communication-marketing',
    title: 'Accessible Written Communications and Templates',
    summary: 'All written communications (letters, invoices, emails) should use clear language, logical structure, and accessible templates. Having accessible templates ensures consistency without relying on individual staff skills.',

    whyItMatters: {
      text: 'Every letter, email, and invoice is a touchpoint. If a customer cannot read your invoice, understand your letter, or navigate your email, you have created a barrier. Accessible templates solve this at scale because every document is accessible by default.',
      statistic: {
        value: '44%',
        context: 'of adults in Australia have literacy levels below what is needed for everyday tasks. Clear, accessible writing helps everyone.',
        source: 'Australian Bureau of Statistics'
      }
    },

    tips: [
      {
        icon: 'Type',
        text: 'Use minimum 12pt font, sans-serif, with good line spacing (1.5x) in all documents',
        priority: 1
      },
      {
        icon: 'Layout',
        text: 'Use proper heading hierarchy (Heading 1, 2, 3) instead of just making text bold and bigger',
        priority: 2
      },
      {
        icon: 'FileText',
        text: 'Create accessible templates in Word, InDesign, and your email platform so all staff produce accessible documents by default',
        priority: 3
      },
      {
        icon: 'Check',
        text: 'Write in plain language: short sentences, common words, active voice',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Reviewing your written communications',
      steps: [
        { text: 'Collect your 5 most common documents (letter, invoice, confirmation, newsletter, form)' },
        { text: 'Check font size (minimum 12pt), font type (sans-serif preferred), and line spacing (1.5x minimum)' },
        { text: 'Check if heading styles are used (not just bold text)' },
        { text: 'Test readability: Could someone with a Year 8 reading level understand it?' },
        { text: 'Check if you have accessible templates for staff to use' },
        { text: 'Verify that email templates have been tested with images turned off' }
      ],
      estimatedTime: '30-60 minutes'
    },

    standardsReference: {
      primary: {
        code: 'WCAG2.2-AA',
        section: '1.3.1, 1.4.3, 1.4.12',
        requirement: 'Digital documents must have proper structure, sufficient contrast, and adequate text spacing.'
      },
      related: [
        {
          code: 'DDA',
          relevance: 'Inaccessible communications about services may constitute discrimination under the DDA.'
        }
      ],
      plainEnglish: 'All documents you send to customers, whether digital or printed, should be structured, readable, and available in alternative formats on request.'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council\'s rates notices were in 9pt font with dense paragraphs, unreadable for many residents.',
        solution: 'Redesigned the rates notice: 12pt font, clear headings, white space, plain language summary at the top. Created accessible Word and InDesign templates for all departments.',
        outcome: 'Call volume about rates notices reduced 20%. Residents with low vision and literacy challenges can understand their notices.',
        cost: '$2,000-5,000 for template design'
      },
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Medical Practice',
        scenario: 'A practice\'s appointment confirmation emails were formatted as images that screen readers could not read.',
        solution: 'Redesigned email template using HTML text with a clear structure. Appointment details in plain text at the top. Added alt text to the practice logo. Plain text version included.',
        outcome: 'Patients using screen readers receive confirmation they can read independently.',
        cost: '$300-800 for template redesign'
      }
    ],

    solutions: [
      {
        title: 'Create accessible document templates',
        description: 'Develop Word, email, and print templates that are accessible by default.',
        resourceLevel: 'low',
        costRange: '$200-1,000',
        timeRequired: '1-2 days',
        implementedBy: 'staff',
        impact: 'significant',
        steps: [
          'Audit your most-used documents and emails for accessibility',
          'Create Word templates with: proper heading styles, 12pt+ sans-serif font, 1.5x line spacing, high-contrast colours',
          'Create email templates in your email platform with: HTML text (not images), proper headings, alt text fields',
          'Set these as the default templates in your systems',
          'Train staff on using templates correctly (especially heading styles and alt text)',
          'Create a simple style guide: font sizes, colours, heading use, plain language tips'
        ]
      },
      {
        title: 'Staff training on accessible document creation',
        description: 'Train staff who create documents on accessibility essentials.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Cover heading styles in Word: why they matter and how to use them',
          'Teach alt text: every image needs descriptive text',
          'Explain proper list formatting (use bullet/number tools, not manual dashes)',
          'Demonstrate plain language principles: short sentences, common words, active voice',
          'Show how to check accessibility in Word (File > Check Accessibility)',
          'Practice creating a document using the accessible template'
        ]
      }
    ],

    resources: [
      {
        title: 'Microsoft Office Accessibility Checker',
        url: 'https://support.microsoft.com/en-us/office/improve-accessibility-with-the-accessibility-checker',
        type: 'tool',
        source: 'Microsoft',
        description: 'Built-in tool for checking document accessibility in Word, PowerPoint, and Excel.',
        isFree: true
      },
      {
        title: 'Plain Language Australia',
        url: 'https://www.plainlanguageaustralia.com/',
        type: 'website',
        source: 'Plain Language Australia',
        description: 'Resources and training on writing in plain language.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.7-PC-2',
        questionText: 'Are your emails designed for accessibility?',
        relationship: 'Email is a subset of written communications',
        moduleCode: '4.7'
      }
    ],

    coveredQuestionIds: ['4.7-PC-4', '4.7-PC-5', '4.7-DD-1a', '4.7-DD-4a'],
    keywords: ['templates', 'letters', 'invoices', 'plain language', 'headings', 'font', 'accessible documents'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.7-PC-2',
    questionText: 'Are your emails designed for accessibility (readable without images, proper headings, plain text option)?',
    moduleCode: '4.7',
    moduleGroup: 'service-support',
    diapCategory: 'information-communication-marketing',
    title: 'Accessible Emails and Digital Documents',
    summary: 'Emails should work with images disabled and screen readers enabled. PDFs and attachments need proper tagging, headings, and alt text. Staff who create documents should know how to build in accessibility.',

    whyItMatters: {
      text: 'Many email clients block images by default. Screen readers cannot read text embedded in images. Untagged PDFs are completely inaccessible. These are common problems that are straightforward to fix but devastating when ignored.',
      statistic: {
        value: '43%',
        context: 'of email users view messages with images turned off. If your content is in images, nearly half miss it.',
        source: 'Email marketing research'
      }
    },

    tips: [
      {
        icon: 'Mail',
        text: 'Design emails so all key information is in HTML text, not embedded in images',
        priority: 1
      },
      {
        icon: 'FileText',
        text: 'Always include a plain text version of every HTML email',
        priority: 2
      },
      {
        icon: 'File',
        text: 'PDF attachments must be tagged: use "Save as PDF" from Word with accessibility settings, not print-to-PDF',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Train staff who create documents on heading styles, alt text, and list formatting',
        priority: 4
      }
    ],

    howToCheck: {
      title: 'Testing your emails and documents',
      steps: [
        { text: 'Send yourself your latest newsletter. Open it with images blocked. Can you understand the content?' },
        { text: 'Open your latest PDF attachment in Adobe Reader and try "Read Out Loud" (View > Read Out Loud)' },
        { text: 'Check if your PDFs have a tag tree: File > Properties > Tags should not say "No"' },
        { text: 'Check if staff know how to use heading styles in Word and PowerPoint' },
        { text: 'Verify that document templates include alt text fields for images' },
        { text: 'Test keyboard navigation through your emails: Can you tab through all links?' }
      ],
      estimatedTime: '30-45 minutes'
    },

    examples: [
      {
        businessType: 'retail',
        businessTypeLabel: 'Online Retailer',
        scenario: 'A retailer\'s order confirmation was a PDF generated without tags, unreadable by screen readers.',
        solution: 'Updated the PDF generation system to produce tagged PDFs with proper headings, alt text on product images, and reading order. Email confirmations also include all key details in the email body (not just the attachment).',
        outcome: 'Blind customers can read their order confirmations independently.',
        cost: '$1,000-3,000 for PDF generation update'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'Staff across 15 departments created documents inconsistently, with many inaccessible PDFs.',
        solution: 'Rolled out a 1-hour training session on accessible document creation. Covered: Word heading styles, alt text, list formatting, saving accessible PDFs. Created a checklist card for desks. All document templates updated.',
        outcome: 'PDF accessibility compliance went from 20% to 85% within three months.',
        cost: 'Free (staff time for training); $500 for checklist cards'
      }
    ],

    solutions: [
      {
        title: 'Fix email and PDF accessibility basics',
        description: 'Update your email and document practices to meet baseline accessibility.',
        resourceLevel: 'low',
        costRange: 'Free-$500',
        timeRequired: '2-4 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Ensure all emails include key information in text, not just images',
          'Enable plain text alternatives in your email sending platform',
          'Update PDF creation process: always "Save as PDF" from Word with accessibility checked',
          'Run the Word Accessibility Checker on all templates (File > Check Accessibility)',
          'Add alt text to all images in documents and emails',
          'Create a "Document Accessibility Checklist" for staff reference'
        ]
      },
      {
        title: 'Train all document creators',
        description: 'Provide training to all staff who create documents, emails, or presentations.',
        resourceLevel: 'low',
        costRange: 'Free-$1,000',
        timeRequired: '1-2 hours',
        implementedBy: 'staff',
        impact: 'significant',
        steps: [
          'Identify all staff who create outbound documents, emails, or presentations',
          'Run a practical training session covering: heading styles, alt text, list formatting, tagged PDFs',
          'Demonstrate the Word Accessibility Checker',
          'Show correct vs incorrect examples using your own documents',
          'Provide a desk reference card with quick tips',
          'Include document accessibility in new staff onboarding',
          'Schedule annual refreshers'
        ]
      }
    ],

    resources: [
      {
        title: 'Creating Accessible PDFs',
        url: 'https://helpx.adobe.com/acrobat/using/creating-accessible-pdfs.html',
        type: 'guide',
        source: 'Adobe',
        description: 'Official guide to creating accessible PDF documents.',
        isFree: true
      },
      {
        title: 'Accessibility in Microsoft 365',
        url: 'https://support.microsoft.com/en-us/accessibility',
        type: 'guide',
        source: 'Microsoft',
        description: 'Accessibility features and tools across Word, Outlook, and PowerPoint.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.7-PC-1',
        questionText: 'Are your written communications designed to be clear and accessible?',
        relationship: 'Overall document quality underpins email and PDF accessibility',
        moduleCode: '4.7'
      }
    ],

    coveredQuestionIds: ['4.7-PC-3', '4.7-DD-2a', '4.7-DD-3a', '4.7-DD-3b'],
    keywords: ['email', 'PDF', 'tagged', 'screen reader', 'documents', 'Word', 'headings', 'alt text'],
    lastUpdated: '2026-02-26'
  },

  {
    questionId: '4.7-PC-6',
    questionText: 'Can customers request important documents in alternative formats (large print, audio, Easy Read)?',
    moduleCode: '4.7',
    moduleGroup: 'service-support',
    diapCategory: 'information-communication-marketing',
    title: 'Alternative Formats and Preferences',
    summary: 'Customers should be able to request documents in alternative formats (large print, audio, Easy Read, Braille) and have their format preferences stored so they do not need to ask every time.',

    whyItMatters: {
      text: 'A standard 10pt letter is invisible to someone with significant vision loss. A complex legal document is incomprehensible to someone with an intellectual disability. Alternative formats ensure that important information actually reaches the people who need it.',
      statistic: {
        value: '575,000',
        context: 'Australians are blind or have low vision, many of whom need large print or audio formats.',
        source: 'Vision Australia'
      }
    },

    tips: [
      {
        icon: 'ZoomIn',
        text: 'Large print is the most requested format. Use 18pt minimum with high contrast.',
        priority: 1
      },
      {
        icon: 'Volume2',
        text: 'Audio versions can be created by recording a staff member reading the document clearly',
        priority: 2
      },
      {
        icon: 'Image',
        text: 'Easy Read uses short sentences and supporting images. Commission from a specialist.',
        priority: 3
      },
      {
        icon: 'Database',
        text: 'Store format preferences in your CRM so the right version is sent automatically',
        priority: 4
      },
      {
        icon: 'Mail',
        text: 'Make mailing list subscription and unsubscribe options keyboard-accessible with no visual CAPTCHAs',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Reviewing your alternative format process',
      steps: [
        { text: 'Check: Do you advertise that alternative formats are available? (Website, letters, signage)' },
        { text: 'Test: Can staff produce a large print version of your most common letter within 1 business day?' },
        { text: 'Check: Is there a process for creating audio or Easy Read versions when requested?' },
        { text: 'Review: Are customer format preferences stored in your system?' },
        { text: 'Test: If a customer requests large print, will all future correspondence automatically come in large print?' },
        { text: 'Check mailing lists: Can customers subscribe and unsubscribe using only a keyboard?' }
      ],
      estimatedTime: '20-30 minutes'
    },

    examples: [
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A resident with low vision requested large print rates notices but had to call and ask every quarter.',
        solution: 'Added a format preference field to the resident database. Options: standard, large print (18pt), audio CD, email (accessible PDF). Once set, the system automatically generates the correct format each quarter.',
        outcome: 'Resident receives large print automatically. 50 other residents have since registered format preferences.',
        cost: '$1,000-3,000 for system configuration; negligible per-document cost'
      },
      {
        businessType: 'health-wellness',
        businessTypeLabel: 'Hospital',
        scenario: 'Patients with intellectual disabilities could not understand consent forms or discharge instructions.',
        solution: 'Commissioned Easy Read versions of the 10 most common documents. Each has short sentences, supporting images, and a clear structure. Staff offer the Easy Read version alongside the standard version.',
        outcome: 'Patients with intellectual disabilities can understand their care information. Informed consent is genuinely informed.',
        cost: '$300-500 per Easy Read document'
      }
    ],

    solutions: [
      {
        title: 'Set up large print and audio capability',
        description: 'Create templates and processes for producing large print and audio versions on request.',
        resourceLevel: 'low',
        costRange: 'Free-$200',
        timeRequired: '2-3 hours',
        implementedBy: 'staff',
        impact: 'moderate',
        steps: [
          'Create a large print template: 18pt sans-serif font, 1.5x line spacing, high contrast',
          'Train staff on converting standard documents to large print (increase font, reflow layout)',
          'Set up a simple audio recording process: staff reads the document clearly into a phone or recorder',
          'Create a process flowchart: request received, format identified, document produced, sent within target time',
          'Add a note to all standard communications: "This document is available in alternative formats on request. Call [number] or email [address]."',
          'Store completed alternative format documents for reuse'
        ]
      },
      {
        title: 'Automate format preferences in your systems',
        description: 'Configure your CRM or document system to store and automatically apply format preferences.',
        resourceLevel: 'medium',
        costRange: '$1,000-5,000',
        timeRequired: '1-2 weeks',
        implementedBy: 'contractor',
        impact: 'significant',
        steps: [
          'Add a format preference field to your customer/client database',
          'Configure document generation to check preferences before producing output',
          'Set up automatic large print generation for customers who have requested it',
          'Create an Easy Read template for your most common documents',
          'Commission Easy Read versions of your top 5-10 documents from a specialist',
          'Test the automated process end-to-end: change a preference, generate a document, verify format',
          'Add the preference option to your sign-up and booking forms'
        ]
      }
    ],

    resources: [
      {
        title: 'Scope - Easy English',
        url: 'https://www.scopeaust.org.au/services-for-organisations/easy-english/',
        type: 'guide',
        source: 'Scope Australia',
        description: 'Training and resources for creating Easy Read documents.',
        isAustralian: true
      },
      {
        title: 'Vision Australia - Alternative Formats',
        url: 'https://www.visionaustralia.org/',
        type: 'website',
        source: 'Vision Australia',
        description: 'Services for producing Braille, audio, and large print documents.',
        isAustralian: true
      },
      {
        title: 'Clear Print Guidelines',
        url: 'https://www.visionaustralia.org/',
        type: 'guide',
        source: 'Vision Australia',
        description: 'Guidelines for creating clear, readable printed materials.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: '4.1-PC-3',
        questionText: 'Do you capture and use customer communication preferences?',
        relationship: 'Format preferences are part of broader communication preferences',
        moduleCode: '4.1'
      },
      {
        questionId: '4.6-F-2',
        questionText: 'Can customers easily manage their communication preferences?',
        relationship: 'Format preferences should be manageable through the same preference system',
        moduleCode: '4.6'
      }
    ],

    coveredQuestionIds: ['4.7-PC-7', '4.7-PC-8', '4.7-DD-6a', '4.7-DD-7a', '4.7-DD-7b'],
    keywords: ['large print', 'audio', 'Easy Read', 'Braille', 'alternative formats', 'preferences', 'mailing list'],
    lastUpdated: '2026-02-26'
  }
];

export default serviceSupportHelp;
