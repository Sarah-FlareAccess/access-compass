/**
 * Help Content: Before Arrival
 * Modules: B1, B4.1, B4.2, B4.3
 */

import type { HelpContent } from './types';

export const beforeArrivalHelp: HelpContent[] = [
  // B1: Pre-visit Information
  {
    questionId: 'B1-F-1',
    questionText: 'Do you have accessibility information available for customers before they visit?',
    moduleCode: 'B1',
    moduleGroup: 'before-arrival',
    diapCategory: 'information-communication-marketing',
    title: 'Pre-visit Accessibility Information',
    summary: 'Sharing accessibility information before customers visit helps them plan confidently and shows your venue is welcoming to everyone.',

    whyItMatters: {
      text: 'People with disabilities often spend significant time researching venues before visiting. Clear, detailed accessibility information reduces anxiety, prevents wasted trips, and demonstrates your commitment to inclusion.',
      statistic: {
        value: '4.4 million',
        context: 'Australians have a disability—that\'s 1 in 5 people. Many more travel with someone who does.',
        source: 'ABS Survey of Disability, Ageing and Carers 2018'
      },
      quote: {
        text: 'When I can\'t find accessibility info, I assume the worst and go somewhere else.',
        attribution: 'Wheelchair user, Tourism Research Australia study'
      }
    },

    tips: [
      {
        icon: 'Globe',
        text: 'Create a dedicated accessibility page on your website',
        detail: 'Don\'t bury this in FAQs—make it prominent in your main navigation.',
        priority: 1
      },
      {
        icon: 'Camera',
        text: 'Include photos of your entrance, pathways, and accessible features',
        detail: 'Photos help people assess if your venue works for their specific needs.',
        priority: 2
      },
      {
        icon: 'ListChecks',
        text: 'Be specific, not vague—list actual features and measurements',
        detail: '"We\'re accessible" is less useful than "Level entry via Smith St, accessible bathroom on ground floor, hearing loop at reception."',
        priority: 3
      },
      {
        icon: 'Phone',
        text: 'Provide contact details for accessibility questions',
        detail: 'Some people prefer to call and discuss their specific requirements.',
        priority: 4
      },
      {
        icon: 'RefreshCw',
        text: 'Keep information current—update when things change',
        detail: 'Outdated information erodes trust. Review quarterly.',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Audit your current accessibility information',
      steps: [
        { text: 'Search your website for "accessibility" or "access"—can you find relevant information easily?' },
        { text: 'Check your main navigation—is there a link to accessibility info (not just in the footer)?' },
        { text: 'Review the content: Does it answer the key questions below?' },
        { text: 'Key questions to answer: How do I get in? Is there parking? Where\'s the bathroom? Can I get help if needed?' },
        { text: 'Test from a customer perspective: Could someone plan a visit using only your online information?' }
      ],
      estimatedTime: '15-20 minutes'
    },

    standardsReference: {
      primary: {
        code: 'DDA',
        requirement: 'The Disability Discrimination Act requires businesses to provide information in accessible ways and not discriminate in the provision of services.'
      },
      related: [
        {
          code: 'WCAG2.1-AA',
          relevance: 'Your accessibility page itself should be accessible—proper headings, alt text on images, readable contrast.'
        }
      ],
      plainEnglish: 'While there\'s no specific legal requirement to have an accessibility page, providing clear information demonstrates compliance with DDA obligations to make services accessible.',
      complianceNote: 'This is about going beyond minimum compliance to genuinely welcome customers with disabilities.'
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A boutique hotel had no accessibility information online. Potential guests would call with detailed questions, taking up staff time.',
        solution: 'Created a comprehensive accessibility page with: room-by-room access features with photos, bathroom dimensions, parking info with distance to entrance, nearest accessible public transport, and a form for guests to submit specific questions.',
        outcome: 'Phone enquiries about accessibility dropped 60%, and the hotel received positive feedback from guests who appreciated being able to plan in advance.',
        timeframe: '1-2 days to create'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A restaurant frequently had wheelchair users arrive only to find they couldn\'t fit between tables.',
        solution: 'Added a simple "Access" section to their website: photos of the entrance (showing one step), a note about their portable ramp, table spacing info, and accessible bathroom location.',
        outcome: 'Wheelchair users now call ahead to request the ramp, and the restaurant has a table ready with appropriate spacing.',
        cost: 'Free (just time to write and photograph)'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum/Gallery',
        scenario: 'A regional gallery assumed their heritage building meant they couldn\'t do much about accessibility.',
        solution: 'Documented everything honestly: "Main entrance has 3 steps—accessible entrance via rear car park with buzzer. Ground floor fully accessible. Upper gallery accessible via platform lift (staff operated). Accessible bathroom available."',
        outcome: 'Visitors appreciated the honesty and were able to plan their visit accordingly. Some said they visited specifically because the information was so clear.',
        cost: 'Free (documentation only)'
      }
    ],

    resources: [
      {
        title: 'Accessible Tourism Resource Kit',
        url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/accessible-tourism.html',
        type: 'guide',
        source: 'Tourism Australia',
        description: 'Comprehensive guide to making tourism businesses more accessible, including website templates.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Australian Network on Disability',
        url: 'https://www.and.org.au/',
        type: 'website',
        source: 'Australian Network on Disability',
        description: 'Resources and guidance for what to include on your accessibility page.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Disability Discrimination Act Guide',
        url: 'https://humanrights.gov.au/our-work/disability-rights/brief-guide-disability-discrimination-act',
        type: 'guide',
        source: 'Australian Human Rights Commission',
        description: 'Overview of your obligations under the DDA.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'B1-F-5',
        questionText: 'Can customers contact you in a variety of ways to ask accessibility questions?',
        relationship: 'Complements online information with personal contact options',
        moduleCode: 'B1'
      }
    ],

    keywords: ['website', 'online', 'information', 'pre-visit', 'planning', 'accessibility page'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'B1-F-7',
    questionText: 'Do you offer familiarisation visits or orientation sessions?',
    moduleCode: 'B1',
    moduleGroup: 'before-arrival',
    diapCategory: 'customer-service',
    title: 'Familiarisation Visits',
    summary: 'Familiarisation visits let people explore your venue before their main visit, reducing anxiety and helping them feel comfortable with the environment.',

    whyItMatters: {
      text: 'For many people—particularly those with autism, anxiety, cognitive disabilities, or sensory sensitivities—visiting a new place can be overwhelming. A familiarisation visit allows them to understand the layout, meet staff, and know what to expect without the pressure of a "real" visit.',
      quote: {
        text: 'Being able to walk through the venue before my son\'s birthday party made all the difference. He knew where everything was and had a great time.',
        attribution: 'Parent of child with autism'
      }
    },

    tips: [
      {
        icon: 'Calendar',
        text: 'Offer visits during quieter times when the venue is less overwhelming',
        priority: 1
      },
      {
        icon: 'Video',
        text: 'Create a virtual tour or video walkthrough as an alternative',
        detail: 'A 2-3 minute video showing the journey from entrance to key areas can be viewed repeatedly at home.',
        priority: 2
      },
      {
        icon: 'FileText',
        text: 'Provide a social story or visual guide that can be reviewed beforehand',
        detail: 'Social stories use simple text and photos to explain what will happen during a visit.',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Introduce key staff members who will be there during the actual visit',
        priority: 4
      },
      {
        icon: 'Clock',
        text: 'Allow flexibility—some people need 10 minutes, others need an hour',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Setting up familiarisation visits',
      steps: [
        { text: 'Identify quiet times when familiarisation visits could be accommodated' },
        { text: 'Create a simple process: How do people request a visit? Who handles them?' },
        { text: 'Prepare a basic "tour" route covering key areas: entrance, main space, bathroom, quiet area (if available)' },
        { text: 'Train relevant staff on what a familiarisation visit involves and why it matters' },
        { text: 'Add information about this service to your accessibility page' }
      ],
      estimatedTime: '1-2 hours to set up process'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Theatre',
        scenario: 'A regional theatre wanted to welcome more neurodiverse audiences but found some couldn\'t cope with the full experience.',
        solution: 'Introduced "Pre-Show Tours" available by appointment. Visitors can see the auditorium with lights on, hear what the bells and announcements sound like, and meet front-of-house staff.',
        outcome: 'Several families now attend regularly who had never been to live theatre before. Staff found the tours rewarding.',
        cost: 'Staff time only',
        timeframe: '30 minutes per visit'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A family-friendly restaurant received requests from parents of autistic children who wanted to try dining out.',
        solution: 'Offered to let families visit during setup time (before opening). They could see the space, look at menus, meet the manager, and choose a preferred table for their booking.',
        outcome: 'Word spread in local autism support groups, bringing new loyal customers.',
        cost: 'Free'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A museum noticed that school groups with students with disabilities sometimes struggled on the day.',
        solution: 'Created a free "Teacher Preview" program—teachers can visit with a support person to plan routes, identify quiet spaces, and receive a social story template to customise for their students.',
        outcome: 'Participating schools reported much smoother visits. The social story template is now their most downloaded resource.',
        timeframe: '1-hour appointments'
      }
    ],

    resources: [
      {
        title: 'Social Stories Overview',
        url: 'https://carolgraysocialstories.com/social-stories/what-is-it/',
        type: 'guide',
        source: 'Carol Gray Social Stories',
        description: 'Learn about the social story format and how to create effective ones.',
        isFree: true
      },
      {
        title: 'Amaze - Autism Victoria',
        url: 'https://www.amaze.org.au/',
        type: 'website',
        source: 'Amaze',
        description: 'Resources for creating visual supports and sensory-friendly experiences.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-7',
        questionText: 'Do you offer relaxed or sensory-friendly sessions?',
        relationship: 'Both support neurodiverse visitors',
        moduleCode: 'A6'
      },
      {
        questionId: 'B1-F-1',
        questionText: 'Do you have accessibility information available for customers before they visit?',
        relationship: 'Familiarisation info should be on your accessibility page',
        moduleCode: 'B1'
      }
    ],

    keywords: ['familiarisation', 'orientation', 'preview', 'social story', 'autism', 'anxiety', 'neurodiverse'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'B1-F-8',
    questionText: 'Do you provide information about accessible transport options to your venue?',
    moduleCode: 'B1',
    moduleGroup: 'before-arrival',
    diapCategory: 'information-communication-marketing',
    title: 'Accessible Transport Information',
    summary: 'Helping customers understand how to get to your venue using accessible transport options removes a major barrier to visiting.',

    whyItMatters: {
      text: 'Getting to a venue is often the hardest part of a visit for people with disabilities. Many cannot drive, rely on accessible public transport, or need to book accessible taxis in advance. Providing clear transport information shows you\'ve thought about the whole journey.',
      statistic: {
        value: '38%',
        context: 'of people with disabilities report transport as a barrier to participation in the community.',
        source: 'Disability Royal Commission research'
      }
    },

    tips: [
      {
        icon: 'Train',
        text: 'List nearest accessible public transport stops with distances',
        detail: 'Include which stations/stops have lifts, ramps, or level boarding.',
        priority: 1
      },
      {
        icon: 'Car',
        text: 'Describe accessible parking options and how to book if needed',
        priority: 2
      },
      {
        icon: 'MapPin',
        text: 'Provide directions from transport stops to your accessible entrance',
        detail: 'Include information about path surfaces, gradients, and any obstacles.',
        priority: 3
      },
      {
        icon: 'Phone',
        text: 'Include contact numbers for accessible taxi services',
        priority: 4
      }
    ],

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'Visitors often arrived at the wrong entrance after using public transport.',
        solution: 'Created a "Getting Here" page with photos showing: the accessible tram stop, the path from the stop (noting it\'s level), the accessible entrance location, and a note about the intercom to call for assistance.',
        outcome: 'Reduced confusion and complaints. Staff no longer need to give directions over the phone as often.',
        cost: 'Free (photos and website update)'
      },
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'Guests with mobility requirements would arrive expecting accessible transport from the airport.',
        solution: 'Added transport section to booking confirmation emails including: wheelchair-accessible taxi companies with booking numbers, accessible public transport route with step-free directions, and offer to arrange accessible airport transfer.',
        outcome: 'Guests arrive less stressed. Several booked the accessible transfer service.',
        cost: 'Free'
      }
    ],

    resources: [
      {
        title: 'Public Transport Victoria - Accessibility',
        url: 'https://www.ptv.vic.gov.au/more/travelling-on-the-network/accessibility/',
        type: 'website',
        source: 'PTV',
        description: 'Information about accessible public transport in Victoria.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Transport for NSW - Accessibility',
        url: 'https://transportnsw.info/travel-info/using-public-transport/accessible-travel',
        type: 'website',
        source: 'Transport for NSW',
        description: 'Accessible travel information for NSW.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A1-F-1',
        questionText: 'Is there accessible parking close to the entrance?',
        relationship: 'Parking is part of the transport journey',
        moduleCode: 'A1'
      },
      {
        questionId: 'B1-F-1',
        questionText: 'Do you have accessibility information available for customers before they visit?',
        relationship: 'Transport info is part of pre-visit information',
        moduleCode: 'B1'
      }
    ],

    keywords: ['transport', 'public transport', 'taxi', 'parking', 'getting there', 'directions'],
    lastUpdated: '2024-12-18'
  }
];

export default beforeArrivalHelp;
