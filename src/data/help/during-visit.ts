/**
 * Help Content: During Visit
 * Modules: A4, A5, A6, B2, B3
 */

import type { HelpContent } from './types';

export const duringVisitHelp: HelpContent[] = [
  // A6: Lighting, Sound and Sensory Environment
  {
    questionId: 'A6-1-6',
    questionText: 'Are sensory kits or supports available for customers and visitors?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'customer-service',
    title: 'Sensory Kits and Supports',
    summary: 'Sensory kits contain items that help people manage sensory input—like ear defenders, fidget tools, or sunglasses. They\'re a simple way to make your venue more welcoming.',

    whyItMatters: {
      text: 'Many people experience sensory sensitivities—not just those with autism, but also people with anxiety, PTSD, migraines, or other conditions. A sensory kit gives them tools to manage their environment and stay longer.',
      statistic: {
        value: '1 in 70',
        context: 'Australians are on the autism spectrum. Many experience sensory processing differences.',
        source: 'Autism Awareness Australia'
      }
    },

    tips: [
      {
        icon: 'Headphones',
        text: 'Include noise-cancelling headphones or ear plugs',
        detail: 'Both adult and child sizes if you serve families.',
        priority: 1
      },
      {
        icon: 'Sun',
        text: 'Add sunglasses for bright environments',
        priority: 2
      },
      {
        icon: 'Hand',
        text: 'Include fidget tools (stress balls, tangles, fidget cubes)',
        detail: 'These help people self-regulate during overwhelming moments.',
        priority: 3
      },
      {
        icon: 'MessageCircle',
        text: 'Consider communication cards for non-verbal communication',
        priority: 4
      },
      {
        icon: 'Info',
        text: 'Keep kits at the entrance/reception so they\'re easy to request',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Creating a sensory kit',
      steps: [
        { text: 'Decide on contents based on your environment (noisy venue = ear defenders; bright venue = sunglasses)' },
        { text: 'Source items—many are available from disability suppliers or even general retailers' },
        { text: 'Create a clean, neutral bag or box to store items' },
        { text: 'Train staff on what\'s in the kit and how to offer it without judgment' },
        { text: 'Add hygiene protocol: clean items between uses, especially ear defenders' },
        { text: 'Promote availability on your website and at your entrance' }
      ],
      tools: ['Budget: approximately $50-150 per kit'],
      estimatedTime: '2-3 hours to set up'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Cinema',
        scenario: 'A cinema wanted to be more welcoming to neurodiverse audiences.',
        solution: 'Created sensory bags containing: ear plugs (disposable), fidget toy, "I need a break" card, and information card about their relaxed screenings. Available free on request at the candy bar.',
        outcome: 'Families with autistic children feel more confident attending regular screenings, not just relaxed sessions.',
        cost: '$15-20 per kit'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Shopping Centre',
        scenario: 'A shopping centre received feedback that the environment was overwhelming for some visitors.',
        solution: 'Partnered with a local autism organisation to create "Calm Kits" available from the information desk. Includes ear defenders, sunglasses, fidget spinner, sensory map showing quiet zones, and a "slow shopping" badge staff can recognise.',
        outcome: 'Became a certified "autism-friendly" shopping centre, attracting new customers.',
        cost: '$30-40 per kit'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Museum',
        scenario: 'A children\'s museum had very hands-on, busy exhibits that overwhelmed some children.',
        solution: 'Created "Comfort Backpacks" with noise-cancelling headphones, a weighted lap pad, a visual timer, and a map showing the quiet room location. Available for loan at reception.',
        outcome: 'Extended average visit length for neurodiverse families by 45 minutes.',
        cost: '$80-100 per kit'
      }
    ],

    resources: [
      {
        title: 'Amaze - Sensory Resources',
        url: 'https://www.amaze.org.au/',
        type: 'guide',
        source: 'Amaze Victoria',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Autism Spectrum Australia',
        url: 'https://www.autismspectrum.org.au/',
        type: 'website',
        source: 'Aspect',
        description: 'Resources for creating autism-friendly environments.',
        isAustralian: true,
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-7',
        questionText: 'Do you offer relaxed or sensory-friendly sessions?',
        relationship: 'Both support sensory-sensitive visitors',
        moduleCode: 'A6'
      },
      {
        questionId: 'A6-1-2',
        questionText: 'Are there quiet or reset spaces available?',
        relationship: 'Quiet spaces complement sensory kits',
        moduleCode: 'A6'
      }
    ],

    keywords: ['sensory', 'autism', 'headphones', 'fidget', 'neurodiverse', 'overwhelm'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'A6-1-7',
    questionText: 'Do you offer relaxed or sensory-friendly sessions?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'customer-service',
    title: 'Relaxed and Sensory-Friendly Sessions',
    summary: 'Relaxed sessions modify the environment—lower lighting, reduced sound, smaller crowds—to create a more comfortable experience for people with sensory sensitivities.',

    whyItMatters: {
      text: 'Standard experiences can be overwhelming for people with autism, dementia, anxiety, or sensory processing differences. Relaxed sessions don\'t change what you offer, just how you offer it—opening your venue to people who might otherwise stay away.',
      quote: {
        text: 'Relaxed sessions let my mum with dementia enjoy the cinema again. The quiet, the lights staying slightly on—it makes all the difference.',
        attribution: 'Carer, Dementia Australia feedback'
      }
    },

    tips: [
      {
        icon: 'SunDim',
        text: 'Reduce lighting intensity (but keep safe navigation levels)',
        priority: 1
      },
      {
        icon: 'VolumeX',
        text: 'Lower or eliminate background music and sudden loud sounds',
        priority: 2
      },
      {
        icon: 'Users',
        text: 'Limit capacity to reduce crowds and queuing',
        priority: 3
      },
      {
        icon: 'DoorOpen',
        text: 'Allow people to move around, leave and return without judgment',
        priority: 4
      },
      {
        icon: 'MessageCircle',
        text: 'Brief staff to be patient and not rush visitors',
        priority: 5
      },
      {
        icon: 'MapPin',
        text: 'Identify and communicate a quiet/break space',
        priority: 6
      }
    ],

    howToCheck: {
      title: 'Planning a relaxed session',
      steps: [
        { text: 'Identify a suitable time—usually quieter periods like early morning or weekday' },
        { text: 'List environmental changes: What can you dim/lower/turn off?' },
        { text: 'Decide on capacity limit (typically 50-70% of normal)' },
        { text: 'Identify or create a quiet space for breaks' },
        { text: 'Train staff: what\'s different, why it matters, how to interact' },
        { text: 'Promote the session: autism/disability organisations, carer groups, social media' },
        { text: 'Gather feedback after each session to improve' }
      ],
      estimatedTime: '2-4 hours planning; 1 hour staff briefing'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Cinema',
        scenario: 'A cinema chain wanted to serve autistic customers and families who couldn\'t manage regular screenings.',
        solution: 'Introduced "Sensory Friendly Screenings": lights dimmed but not off, sound at 80% volume, no trailers, freedom to move around, staff trained in autism awareness.',
        outcome: 'Now run weekly at most locations. Attendance has grown 200% over 3 years. Many parents report it\'s their child\'s first cinema experience.',
        timeframe: 'Monthly sessions to start'
      },
      {
        businessType: 'retail',
        businessTypeLabel: 'Supermarket',
        scenario: 'A supermarket received requests for a less overwhelming shopping experience.',
        solution: 'Introduced "Quiet Hour": first hour on Tuesdays has no announcements, no radio, dimmed lights, no trolley collection, staff avoid restocking busy aisles.',
        outcome: 'Popular with autistic shoppers, elderly customers, and parents with babies. Positive media coverage brought new customers.',
        cost: 'Nil (operational adjustment only)'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Zoo',
        scenario: 'A zoo found their popular exhibits were overwhelming for some visitors.',
        solution: 'Created "Early Explorer" sessions on selected mornings: entry 30 minutes before general opening, keeper talks moved outdoors (better acoustics), quiet space available in education centre, sensory bags provided.',
        outcome: 'Sessions sell out regularly. Zoo has developed partnerships with disability schools for educational visits.',
        timeframe: 'Once per month initially, now weekly in school holidays'
      }
    ],

    resources: [
      {
        title: 'Arts Access Australia - Relaxed Performances',
        url: 'https://www.artsaccess.com.au/',
        type: 'guide',
        source: 'Arts Access Australia',
        description: 'Guide for running relaxed performances in arts venues.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Dimensions Autism Friendly Award',
        url: 'https://www.dimensions-uk.org/get-involved/campaigns/autism-friendly-award/',
        type: 'website',
        source: 'Dimensions UK',
        description: 'Framework for becoming autism-friendly (UK-based but applicable).',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'A6-1-6',
        questionText: 'Are sensory kits or supports available?',
        relationship: 'Sensory kits complement relaxed sessions',
        moduleCode: 'A6'
      },
      {
        questionId: 'B1-F-7',
        questionText: 'Do you offer familiarisation visits?',
        relationship: 'Familiarisation visits help people prepare for relaxed sessions',
        moduleCode: 'B1'
      }
    ],

    keywords: ['relaxed', 'sensory-friendly', 'quiet', 'autism', 'dementia', 'low-sensory'],
    lastUpdated: '2024-12-18'
  },

  {
    questionId: 'A6-1-8',
    questionText: 'Do you offer assisted listening devices or hearing augmentation?',
    moduleCode: 'A6',
    moduleGroup: 'during-visit',
    diapCategory: 'information-communication-marketing',
    title: 'Assisted Listening Devices & Hearing Loops',
    summary: 'Assisted listening devices transmit audio directly to hearing aids or headsets, cutting through background noise. They\'re essential for people who are deaf or hard of hearing.',

    whyItMatters: {
      text: 'Background noise in venues makes it extremely difficult for hearing aid users to follow speech. A hearing loop or FM system transmits sound directly to their hearing aid, dramatically improving clarity. For venues with PA systems, hearing augmentation is a legal requirement.',
      statistic: {
        value: '3.6 million',
        context: 'Australians have hearing loss. This number is expected to double by 2060.',
        source: 'Hearing Australia'
      }
    },

    tips: [
      {
        icon: 'Ear',
        text: 'Hearing loops are the most common solution in Australia',
        detail: 'They work with hearing aids that have a "T-coil" or "telecoil" setting—most do.',
        priority: 1
      },
      {
        icon: 'Square',
        text: 'Display the hearing loop symbol prominently where loops are available',
        priority: 2
      },
      {
        icon: 'Wrench',
        text: 'Test your loop regularly—they can fail without you knowing',
        detail: 'Ask a hearing aid user to test, or use a loop listener device.',
        priority: 3
      },
      {
        icon: 'Users',
        text: 'Train staff to know where loops are and how to mention them',
        priority: 4
      },
      {
        icon: 'Headphones',
        text: 'For people without hearing aids, offer portable receivers with headphones',
        priority: 5
      }
    ],

    standardsReference: {
      primary: {
        code: 'Access-to-Premises',
        section: 'Part D3.7',
        requirement: 'Where an inbuilt amplification system (e.g., PA system) is provided, a hearing augmentation system must also be provided.'
      },
      related: [
        {
          code: 'AS1428.5',
          relevance: 'Specifies technical requirements for hearing augmentation systems.'
        }
      ],
      plainEnglish: 'If you have any kind of PA or speaker system, you\'re legally required to have hearing augmentation (usually a hearing loop) as well.',
      complianceNote: 'This applies to venues like theatres, cinemas, conference rooms, churches, and anywhere with an amplification system. Reception desks and service counters benefit from portable loops even without a PA.'
    },

    howToCheck: {
      title: 'Assessing your hearing augmentation',
      steps: [
        { text: 'Do you have a hearing loop installed? Check for the symbol or ask building management.' },
        { text: 'If yes, when was it last tested? Loops should be tested annually by a professional.' },
        { text: 'Test it yourself: Set a smartphone to record, hold it near the loop area, and play audio through your PA. Upload the recording to a loop testing app.' },
        { text: 'Is the hearing loop symbol displayed where people can see it?' },
        { text: 'Do staff know it exists and how to tell customers about it?' },
        { text: 'For service counters: Consider a portable counter loop ($300-500).' }
      ],
      tools: ['Loop listener device or smartphone app for testing']
    },

    examples: [
      {
        businessType: 'accommodation',
        businessTypeLabel: 'Hotel',
        scenario: 'A hotel had a hearing loop in their conference room but guests didn\'t know about it.',
        solution: 'Added hearing loop symbol to all conference room marketing, included loop availability in confirmation emails, trained AV staff to mention it during setup, and added a prompt on their booking form.',
        outcome: 'Loop usage increased significantly. Corporate clients specifically requested the venue for its accessibility.',
        cost: 'Nil (already installed)'
      },
      {
        businessType: 'restaurant-cafe',
        businessTypeLabel: 'Restaurant',
        scenario: 'A fine dining restaurant had frequent complaints about noise levels from hearing aid users.',
        solution: 'Installed a portable counter hearing loop at the host stand. When guests mention hearing loss, staff offer seating near the window (away from kitchen noise) and let them know about the loop for communication at the host stand.',
        outcome: 'Positive reviews mentioning accessibility. Loop cost recovered in goodwill within weeks.',
        cost: '$400 for portable counter loop'
      },
      {
        businessType: 'attraction',
        businessTypeLabel: 'Theatre',
        scenario: 'A community theatre had an old loop system that hadn\'t been tested in years.',
        solution: 'Hired an audio professional to test and service the loop ($300). It needed recalibration. Now promote "hearing loop equipped seating" prominently in bookings and signage.',
        outcome: 'Regular patrons who had stopped attending returned. Theatre now offers headsets for people without T-coil hearing aids.',
        cost: '$300 service call'
      }
    ],

    resources: [
      {
        title: 'Hearing Australia',
        url: 'https://www.hearing.com.au/',
        type: 'website',
        source: 'Hearing Australia',
        description: 'Information about hearing loops and where to find them.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Hearing Link - Loop Testing',
        url: 'https://www.hearinglink.org/technology/hearing-loops/loop-testing/',
        type: 'tool',
        source: 'Hearing Link',
        description: 'Free app to test if your hearing loop is working correctly.',
        isFree: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'C1-D-10',
        questionText: 'Do staff know how to communicate with customers who are Deaf or hard of hearing?',
        relationship: 'Staff awareness complements technical solutions',
        moduleCode: 'C1'
      }
    ],

    keywords: ['hearing loop', 'T-coil', 'deaf', 'hard of hearing', 'PA system', 'amplification'],
    lastUpdated: '2024-12-18'
  },

  // B3: Printed Materials
  {
    questionId: 'B3-1-4',
    questionText: 'Do you provide key information in alternative formats such as Easy Read and plain English?',
    moduleCode: 'B3',
    moduleGroup: 'during-visit',
    diapCategory: 'information-communication-marketing',
    title: 'Alternative Formats: Easy Read & Plain English',
    summary: 'Alternative formats make your information accessible to people with intellectual disability, low literacy, or those who speak English as a second language.',

    whyItMatters: {
      text: 'Not everyone can read complex documents. Easy Read uses simple words, short sentences, and images to explain information. Plain English removes jargon and unnecessary complexity. Both help more people understand your services.',
      statistic: {
        value: '44%',
        context: 'of Australian adults have literacy levels below what\'s needed for everyday life.',
        source: 'Australian Bureau of Statistics'
      }
    },

    tips: [
      {
        icon: 'FileText',
        text: 'Start with your most important documents: safety info, menus, key policies',
        priority: 1
      },
      {
        icon: 'Type',
        text: 'Use short sentences (max 15 words) and common words',
        priority: 2
      },
      {
        icon: 'Image',
        text: 'For Easy Read: add relevant images next to each key point',
        detail: 'Images should illustrate the text, not decorate it.',
        priority: 3
      },
      {
        icon: 'Layout',
        text: 'Use clear headings and lots of white space',
        priority: 4
      },
      {
        icon: 'Users',
        text: 'Test with your target audience—they\'re the best judges',
        priority: 5
      }
    ],

    howToCheck: {
      title: 'Creating alternative format documents',
      steps: [
        { text: 'Identify your most important documents (safety info, menus, booking info, key policies)' },
        { text: 'For Plain English: Rewrite using short sentences, common words, active voice' },
        { text: 'For Easy Read: Add explanatory images, use bullet points, increase font size to 14-16pt' },
        { text: 'Test with people who have intellectual disability or low literacy' },
        { text: 'Make alternative formats available: on website, at reception, in print' },
        { text: 'Train staff to offer alternative formats proactively' }
      ],
      estimatedTime: '2-4 hours per document'
    },

    examples: [
      {
        businessType: 'attraction',
        businessTypeLabel: 'Zoo',
        scenario: 'A zoo wanted to make their visitor guide accessible to all guests.',
        solution: 'Created an Easy Read version with: simple map, photos of key animals, icons for facilities, large text. Made available at entrance and online.',
        outcome: 'Used by visitors with intellectual disability, young children, and tourists with limited English.',
        cost: '$500 for professional Easy Read conversion'
      },
      {
        businessType: 'local-government',
        businessTypeLabel: 'Council',
        scenario: 'A council received feedback that their planning documents were too complex for residents to understand.',
        solution: 'Created Plain English summaries of major planning proposals. Also provided Easy Read versions for community consultation on significant decisions.',
        outcome: 'Increased community engagement in consultations. Fewer calls asking for explanations.',
        cost: 'Staff time + occasional professional Easy Read conversion'
      }
    ],

    resources: [
      {
        title: 'Easy Read Style Guide',
        url: 'https://www.scopeaust.org.au/',
        type: 'guide',
        source: 'Scope Australia',
        description: 'Guide to creating Easy Read documents.',
        isAustralian: true,
        isFree: true
      },
      {
        title: 'Plain English Foundation',
        url: 'https://www.plainenglishfoundation.com/',
        type: 'website',
        source: 'Plain English Foundation',
        description: 'Training and resources for writing in plain English.',
        isAustralian: true
      }
    ],

    relatedQuestions: [
      {
        questionId: 'B3-1-1',
        questionText: 'Are your printed materials available in large print?',
        relationship: 'Both are alternative formats for accessibility',
        moduleCode: 'B3'
      }
    ],

    keywords: ['easy read', 'plain english', 'simple language', 'intellectual disability', 'literacy'],
    lastUpdated: '2024-12-18'
  }
];

export default duringVisitHelp;
