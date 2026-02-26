/**
 * Help Content: Events
 * Modules: 6.1, 6.2, 6.3, 6.4, 6.5
 * 17 entries covering all substantive questions using coveredQuestionIds pattern.
 */

import type { HelpContent } from './types';

export const eventsHelp: HelpContent[] = [

// ─── Entry 1: Accessibility in Event Planning ───
{
  questionId: '6.1-PC-1',
  questionText: 'Is accessibility considered from the beginning of event planning?',
  moduleCode: '6.1',
  moduleGroup: 'events',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility in Event Planning',
  coveredQuestionIds: ['6.1-D-1', '6.1-D-2', '6.1-D-9', '6.1-D-11'],
  summary: 'Accessibility must be embedded from the first planning meeting, not added as an afterthought. This means budgeting for access features, using an accessibility checklist, and ensuring representation in event programming.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'When accessibility is treated as an afterthought, it costs more to fix, delivers a poorer experience, and signals to people with disability that they were not considered. Embedding accessibility from the outset makes it part of the event DNA rather than a bolt-on accommodation. It also reduces the risk of last-minute access failures that damage your reputation and may breach the Disability Discrimination Act.',
    statistic: {
      value: '1 in 5',
      context: 'Australians have a disability. Events that exclude this audience lose up to 20% of potential attendees, plus their companions, families, and colleagues.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'ClipboardList',
      text: 'Use an accessibility checklist from the very first planning meeting.',
      detail: 'Include items covering venue access, communication formats, staffing, emergency procedures, and feedback. Review the checklist at every planning milestone. The Australian Human Rights Commission provides free event accessibility checklists.',
      priority: 1
    },
    {
      icon: 'DollarSign',
      text: 'Allocate a specific budget line for accessibility (typically 5-10% of total event budget).',
      detail: 'Common costs include Auslan interpreters, captioning, accessible portable toilets, hearing loop hire, large print materials, and additional staffing. Budgeting upfront prevents cost-cutting later.',
      priority: 2
    },
    {
      icon: 'Users',
      text: 'Include people with disability in your programming and planning committee.',
      detail: 'Representation in event programming (speakers, performers, panellists) signals genuine inclusion. Including people with lived experience on the planning team catches access barriers that others miss.',
      priority: 3
    },
    {
      icon: 'Building',
      text: 'Choose venues with demonstrated accessibility, not just claimed compliance.',
      detail: 'Visit the venue in person. Check entrances, toilets, stage access, and paths of travel. Ask for their accessibility audit report. Do not rely on "yes, we are accessible" without verification.',
      priority: 4
    },
    {
      icon: 'Calendar',
      text: 'Build accessibility milestones into the event timeline.',
      detail: 'Book interpreters 6-8 weeks out. Confirm captioning 4 weeks out. Send accessibility information to attendees 2 weeks before. Run a walkthrough 1 week before. These lead times are necessary because qualified providers book out quickly.',
      priority: 5
    },
    {
      icon: 'FileCheck',
      text: 'Document your accessibility plan and share it with all suppliers and staff.',
      detail: 'A written accessibility plan ensures everyone involved understands their responsibilities. Include specific requirements for each supplier (e.g. caterer must provide allergy-labelled and textured food options, AV supplier must provide hearing loop and captioning feed).',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Reviewing your event planning process',
    steps: [
      { text: 'Check your event planning template or project plan. Is accessibility listed as a standing agenda item at planning meetings?' },
      { text: 'Review your budget. Is there a named line item for accessibility, or are access features funded ad hoc?' },
      { text: 'Look at your supplier briefing documents. Do they include specific accessibility requirements for each supplier?' },
      { text: 'Review your event timeline. Are accessibility milestones (interpreter booking, captioning confirmation, accessibility info distribution) included with lead times?' },
      { text: 'Check your speaker or performer lineup. Does it include people with disability? Is diversity of disability represented, not just one type?' },
      { text: 'Review previous event feedback. Were there accessibility complaints? Were they acted upon for the next event?' },
      { text: 'Confirm you have a named accessibility coordinator for the event who has authority to make decisions and allocate resources.' },
      { text: 'Check whether your event complies with the Disability Discrimination Act by reviewing the AHRC event accessibility guidelines.' }
    ],
    tools: ['Event planning template or project management tool', 'Budget spreadsheet', 'AHRC event accessibility checklist'],
    estimatedTime: '45-60 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The Disability Discrimination Act 1992 requires that events and services be accessible to people with disability. Organisers must make reasonable adjustments to ensure equal participation.'
    },
    related: [
      { code: 'WCAG2.2-AA', relevance: 'Event websites, registration forms, and digital communications must meet WCAG 2.2 Level AA for web accessibility.' },
      { code: 'Access-to-Premises', relevance: 'Venue selection must consider physical access requirements under the Premises Standards.' }
    ],
    plainEnglish: 'Event organisers have a legal obligation to make events accessible. Planning for accessibility from the start is both the most effective and most cost-efficient approach.',
    complianceNote: 'Even where specific building standards do not apply (e.g. outdoor events), the DDA general duty to provide accessible services still applies.'
  },

  solutions: [
    {
      title: 'Add an accessibility checklist to your existing planning process',
      description: 'Download or create a simple accessibility checklist and integrate it into your current event planning workflow. This low-cost step ensures accessibility is considered at each planning stage.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Download the AHRC accessible events checklist or create your own based on your event type.',
        'Add "Accessibility" as a standing item on every planning meeting agenda.',
        'Assign an accessibility lead from your existing team to own the checklist and report progress at each meeting.',
        'Review the checklist against your venue contract to identify any gaps in venue-provided access features.',
        'Add accessibility requirements to all supplier briefing documents.',
        'Create a pre-event walkthrough checklist to verify all access features are in place on the day.'
      ],
      notes: 'Even a simple checklist dramatically reduces the chance of overlooking critical access features.'
    },
    {
      title: 'Develop a comprehensive accessibility plan with dedicated budget',
      description: 'Create a detailed accessibility plan with specific deliverables, timelines, and a dedicated budget line. Train your planning team on accessibility requirements.',
      resourceLevel: 'medium',
      costRange: '$500-2,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Conduct a gap analysis of your last three events, reviewing feedback and complaints related to accessibility.',
        'Develop a written accessibility policy for your events that includes scope, responsibilities, and minimum standards.',
        'Allocate 5-10% of your event budget to accessibility as a dedicated line item.',
        'Create an accessibility timeline with milestones: interpreter booking (6-8 weeks), captioning (4 weeks), attendee information (2 weeks), walkthrough (1 week).',
        'Brief all team members on the plan and their specific responsibilities.',
        'Establish relationships with local Auslan interpreters, captioners, and accessible equipment hire companies so you can book quickly.',
        'Include accessibility KPIs in your post-event review process.'
      ],
      notes: 'A written plan can be reused and improved for each event, building institutional knowledge over time.'
    },
    {
      title: 'Engage an accessibility consultant for event planning',
      description: 'Commission an accessibility consultant to audit your event planning process, train your team, co-design the accessibility plan, and attend the event to provide real-time support.',
      resourceLevel: 'high',
      costRange: '$3,000-10,000',
      timeRequired: '4-8 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant with event experience (check the Australian Network on Disability consultant directory).',
        'Brief the consultant on your event type, scale, venue, and audience.',
        'Have the consultant audit your current planning process and identify gaps.',
        'Co-develop a comprehensive accessibility plan covering physical access, communication, sensory environment, staffing, and emergency procedures.',
        'Have the consultant deliver training to your full planning team and key volunteers.',
        'Include the consultant in the pre-event walkthrough and on-call on the day for troubleshooting.',
        'Conduct a post-event debrief with the consultant to document lessons learned.',
        'Use the consultant\'s report to update your planning templates for future events.'
      ],
      notes: 'A consultant engagement for your flagship event creates templates and knowledge that reduce costs for subsequent events.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre regularly hosted corporate events but had no accessibility planning process. Access features were arranged ad hoc, often resulting in missing interpreters or inaccessible stages.',
      solution: 'Developed a standard accessibility planning template used for all events. Required all event organisers to complete an accessibility checklist during booking. Allocated a staff accessibility coordinator for events over 100 attendees.',
      outcome: 'Accessibility complaints dropped 80% within one year. The centre was recognised by the local council for inclusive practices.',
      cost: 'Free (staff time to develop template)',
      timeframe: '2 weeks to develop, ongoing implementation'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Local Council',
      scenario: 'A regional council\'s annual community festival had no accessibility budget. Wheelchair users could not access the main stage area, and there was no Auslan interpretation for speeches.',
      solution: 'Council allocated $5,000 (3% of event budget) to accessibility. Hired Auslan interpreters for main stage events, installed temporary accessible paths, and designated a quiet zone with seating.',
      outcome: 'Attendance by people with disability increased noticeably. Positive feedback in post-event survey led to the budget being doubled for the following year.',
      cost: '$5,000',
      timeframe: '6 weeks lead time'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Arts Festival',
      scenario: 'A multi-day arts festival included performers with disability but had not considered audience accessibility. Ticketing was only available online with no phone option, and venue maps were only in standard print.',
      solution: 'Added phone booking and TTY/NRS options. Created large print, Braille, and audio-described venue maps. Included an accessibility statement on all marketing materials with a named contact person.',
      outcome: 'Ticket sales to people identifying as having a disability increased 35%. Two performers with disability became festival ambassadors.',
      cost: '$1,200',
      timeframe: '4 weeks'
    }
  ],

  resources: [
    {
      title: 'AHRC Accessible Events Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Comprehensive guide to planning and delivering accessible events under the DDA.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AND Accessible Events Checklist',
      url: 'https://www.and.org.au/resources/',
      type: 'checklist',
      source: 'Australian Network on Disability',
      description: 'Practical checklist covering all stages of event planning from venue selection to post-event review.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Attitudes Foundation Inclusive Events Toolkit',
      url: 'https://www.attitudes.org.au/',
      type: 'guide',
      source: 'Attitudes Foundation',
      description: 'Australian toolkit for creating inclusive events, with templates and case studies.',
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

  keywords: ['event planning', 'accessibility checklist', 'budget', 'inclusion', 'representation', 'programming', 'DDA', 'event accessibility', 'planning process']
},

// ─── Entry 2: Accessible Event Promotion and Registration ───
{
  questionId: '6.1-PC-2',
  questionText: 'Are event promotion and registration accessible?',
  moduleCode: '6.1',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Accessible Event Promotion and Registration',
  coveredQuestionIds: ['6.1-PC-3', '6.1-PC-5', '6.1-D-3', '6.1-D-4', '6.1-D-5', '6.1-D-10', '6.1-D-12'],
  summary: 'Event promotion must reach people with disability through accessible channels, and registration forms must allow attendees to indicate access requirements. Pre-event confirmation of accommodations builds trust and prevents day-of failures.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'If people with disability cannot access your event information or complete registration, they are excluded before the event even begins. Inaccessible websites, PDF-only flyers, and registration forms without access needs questions create invisible barriers. Asking about access requirements during registration (not after) gives your team time to arrange accommodations properly.',
    quote: {
      text: 'I registered for a conference and there was nowhere to say I needed Auslan. I emailed three times with no reply. I did not attend.',
      attribution: 'Deaf community member, Victorian event survey'
    }
  },

  tips: [
    {
      icon: 'Globe',
      text: 'Ensure your event website meets WCAG 2.2 Level AA standards.',
      detail: 'Use the WAVE browser extension to check for accessibility errors. Key issues include missing alt text on images, poor colour contrast, inaccessible navigation, and forms without labels. Test with a screen reader (NVDA is free for Windows).',
      priority: 1
    },
    {
      icon: 'FormInput',
      text: 'Include access needs questions in registration forms, not as a separate process.',
      detail: 'Ask "Do you have any access requirements?" with common options (Auslan interpreter, captioning, wheelchair access, dietary needs, quiet space) plus a free-text field. Make the question optional, not mandatory, and use respectful language.',
      priority: 2
    },
    {
      icon: 'Mail',
      text: 'Confirm accommodations with registrants at least one week before the event.',
      detail: 'Send a personalised confirmation listing exactly what has been arranged (e.g. "Auslan interpreter confirmed for all main stage sessions"). This builds confidence and allows time to resolve any gaps.',
      priority: 3
    },
    {
      icon: 'Megaphone',
      text: 'Promote through disability community channels, not just mainstream media.',
      detail: 'Share event details with local disability organisations, supported employment services, and disability-specific social media groups. Ask disability organisations to share your event with their networks.',
      priority: 4
    },
    {
      icon: 'UserCircle',
      text: 'Name a specific accessibility contact person on all promotional materials.',
      detail: 'Provide a direct phone number, email, and SMS option. Include National Relay Service (NRS) details. State expected response time (e.g. "within 2 business days"). A named person is more approachable than a generic inbox.',
      priority: 5
    },
    {
      icon: 'FileText',
      text: 'Provide promotional materials in multiple formats: HTML, large print, Easy Read, and plain text.',
      detail: 'PDFs are often inaccessible to screen readers. Always provide an HTML or plain text alternative. For key documents, create an Easy Read version with simple language and images.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing your event promotion and registration',
    steps: [
      { text: 'Run your event website through the WAVE accessibility checker (wave.webaim.org). Note and fix any errors.' },
      { text: 'Test the registration form using only a keyboard (Tab to navigate, Enter to submit). Can you complete the entire form without a mouse?' },
      { text: 'Check the registration form for an access needs question. Is it included in the main form flow, not a separate page or email address?' },
      { text: 'Review promotional materials. Are they available in at least two formats (e.g. web page plus plain text email)?' },
      { text: 'Check whether a named accessibility contact person is listed on the event page with phone, email, and NRS details.' },
      { text: 'Test the registration confirmation email. Does it acknowledge any access requirements the registrant indicated?' },
      { text: 'Review your process for following up on access requests. Is there a defined workflow, or does it depend on someone remembering?' },
      { text: 'Check social media posts for image alt text and video captions.' }
    ],
    tools: ['WAVE browser extension', 'Screen reader (NVDA, free)', 'Keyboard (for keyboard-only testing)', 'Mobile phone (for mobile testing)'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.2-AA',
      requirement: 'All web content, including event websites and registration forms, must meet WCAG 2.2 Level AA. This includes perceivable content, operable navigation, understandable forms, and robust markup.'
    },
    related: [
      { code: 'DDA', relevance: 'The DDA requires that event information and registration be accessible to people with disability as a reasonable adjustment.' }
    ],
    plainEnglish: 'Your event website and registration must work for people using screen readers, keyboard navigation, and other assistive technology. Event information must be available in accessible formats.',
    complianceNote: 'The AHRC has confirmed that the DDA applies to websites and digital services. Inaccessible online registration may constitute unlawful discrimination.'
  },

  solutions: [
    {
      title: 'Add access needs questions and alternative contact methods',
      description: 'Update your existing registration form to include access needs questions and provide alternative ways to register (phone, email). This is a fast, low-cost improvement.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Add a question to your registration form: "Do you have any access requirements for this event?" with checkboxes for common needs (Auslan, captioning, wheelchair access, dietary, quiet space) and a free-text field.',
        'Add a note on the registration page: "For assistance with registration, contact [Name] on [phone/email]. We welcome National Relay Service calls."',
        'Create a simple spreadsheet to track access requests and their fulfilment status.',
        'Set up an auto-reply for access request emails confirming receipt and expected response time.',
        'Draft a confirmation email template that lists the specific accommodations arranged.',
        'Test the updated form with a screen reader to ensure the new fields are accessible.'
      ],
      notes: 'Even adding a single free-text question about access needs is a significant improvement over nothing.'
    },
    {
      title: 'Build an accessible registration system with accommodation workflow',
      description: 'Implement a fully accessible registration platform with integrated access needs management, automated confirmation, and a tracking dashboard for your team.',
      resourceLevel: 'medium',
      costRange: '$200-1,500',
      timeRequired: '3-5 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Select a registration platform with demonstrated WCAG 2.2 AA compliance (e.g. Humanitix, which is Australian and accessibility-focused).',
        'Configure access needs questions as part of the standard registration flow with structured response options.',
        'Set up automated confirmations that acknowledge access requests and provide the accessibility contact\'s details.',
        'Create a dashboard or spreadsheet for your team to track each access request, its status, and the assigned team member.',
        'Build an accommodation confirmation email template that is sent 7-10 days before the event.',
        'Develop promotional materials in HTML, large print, and Easy Read versions.',
        'Promote the event through at least three disability community channels (organisations, social media groups, newsletters).'
      ],
      notes: 'Humanitix is an Australian not-for-profit ticketing platform that prioritises accessibility. Its forms are screen-reader compatible and keyboard navigable.'
    },
    {
      title: 'Commission professional accessible communications package',
      description: 'Engage a digital accessibility specialist to audit and remediate your event website, build accessible registration, create multi-format promotional materials, and establish a reusable communications framework.',
      resourceLevel: 'high',
      costRange: '$3,000-8,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a WCAG-certified digital accessibility consultant to audit your event website and registration system.',
        'Remediate all WCAG 2.2 AA failures identified in the audit.',
        'Build or configure a fully accessible registration system with integrated access needs management.',
        'Create a multi-format communications package: accessible HTML email, large print PDF, Easy Read version, and plain text.',
        'Develop an Auslan video summary of key event information for social media and the website.',
        'Establish a media partnership with at least one disability media outlet or organisation.',
        'User-test the registration process with 3-5 people with different disabilities before launch.',
        'Document the accessible communications framework for reuse at future events.'
      ],
      notes: 'This investment creates reusable templates and processes that reduce the cost of accessible communications for subsequent events.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Convention Centre',
      scenario: 'A convention centre\'s event registration was PDF-based and required printing, signing, and scanning back. The website had no accessibility statement and no way to indicate access needs.',
      solution: 'Moved to Humanitix for online registration with built-in accessibility. Added access needs checkboxes and a free-text field. Published an accessibility statement with a named contact.',
      outcome: 'Registrations from people with disability increased 25%. The convention centre received positive feedback from disability organisations who began recommending the venue.',
      cost: 'Free (Humanitix is free for free events, small fee for paid events)',
      timeframe: '1 day to set up'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Local Council',
      scenario: 'A council\'s annual awards night promoted only via a PDF flyer emailed as an attachment. No alternative formats were offered, and the registration link was embedded in the PDF image.',
      solution: 'Created an accessible HTML email with the same content. Added an accessible online registration form with access needs questions. Shared the event through the council\'s disability advisory committee networks.',
      outcome: 'Three attendees requested Auslan interpreters through the new form, which the council arranged in time. Previously, these attendees had not attended.',
      cost: 'Free',
      timeframe: '2 hours'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Music Festival',
      scenario: 'A multi-day music festival had accessible ticketing but no way for attendees to indicate access needs until they arrived at the gate. This caused long delays and missed accommodations.',
      solution: 'Added an access needs section to online ticket purchase. Created a dedicated accessibility email with a 24-hour response commitment. Sent personalised confirmation emails listing all arranged accommodations one week before the festival.',
      outcome: 'Day-of access issues dropped 60%. Attendees reported feeling confident their needs would be met before arriving.',
      cost: '$500 (developer time to add form fields)',
      timeframe: '1 week'
    },
    {
      businessType: 'general',
      businessTypeLabel: 'Corporate Event Organiser',
      scenario: 'A corporate event organiser used a third-party registration platform that was not keyboard-navigable. Screen reader users could not complete registration independently.',
      solution: 'Switched to an accessible platform and added a phone registration option. All email communications were converted from image-heavy HTML to clean, structured HTML with alt text.',
      outcome: 'No further complaints about registration accessibility. The organiser included the accessible platform in their standard event toolkit.',
      cost: '$200 (platform subscription)',
      timeframe: '3 days'
    }
  ],

  resources: [
    {
      title: 'Humanitix Accessible Ticketing',
      url: 'https://www.humanitix.com/',
      type: 'tool',
      source: 'Humanitix',
      description: 'Australian not-for-profit ticketing and registration platform with built-in accessibility features and WCAG compliance.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'WAVE Web Accessibility Evaluation Tool',
      url: 'https://wave.webaim.org/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free browser extension that checks web pages for accessibility errors against WCAG standards.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'W3C WCAG 2.2 Quick Reference',
      url: 'https://www.w3.org/WAI/WCAG22/quickref/',
      type: 'guide',
      source: 'World Wide Web Consortium',
      description: 'Filterable quick reference for all WCAG 2.2 success criteria with techniques and examples.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'Easy Read Guidelines',
      url: 'https://www.scopeaust.org.au/service/easy-english/',
      type: 'guide',
      source: 'Scope Australia',
      description: 'Guidelines for creating Easy Read and Easy English documents that are accessible to people with intellectual disability.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['registration', 'promotion', 'website', 'WCAG', 'access needs', 'Auslan', 'captioning', 'accommodation confirmation', 'contact person', 'accessible forms', 'Easy Read']
},

// ─── Entry 3: Ticketing and Attendance Equity ───
{
  questionId: '6.1-PC-4',
  questionText: 'Is your ticketing system accessible and equitable?',
  moduleCode: '6.1',
  moduleGroup: 'events',
  diapCategory: 'customer-service',
  title: 'Ticketing and Attendance Equity',
  coveredQuestionIds: ['6.1-D-6', '6.1-D-7', '6.1-D-8'],
  summary: 'Accessible ticketing means people with disability can purchase tickets independently, receive equitable pricing, use the Companion Card for a free companion ticket, and access wheelchair or accessible seating areas without paying a premium.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Inequitable ticketing is one of the most common complaints from people with disability attending events. Being charged more for accessible seating, unable to book wheelchair spaces online, or forced to call a special number to purchase tickets creates a two-tier system. The Companion Card program exists specifically to address the cost barrier of needing an attendant, yet many event organisers are not registered as affiliates.',
    statistic: {
      value: '65%',
      context: 'of people with disability report that the cost of attending events (including companion tickets) is a significant barrier to participation.',
      source: 'Companion Card Victoria evaluation report'
    }
  },

  tips: [
    {
      icon: 'CreditCard',
      text: 'Ensure wheelchair and accessible seats can be booked through the same online system as all other tickets.',
      detail: 'Do not require people to phone a special number or email to book accessible seating. If your ticketing platform cannot handle accessible seat selection, work with the provider to add it or switch platforms.',
      priority: 1
    },
    {
      icon: 'Heart',
      text: 'Register as a Companion Card affiliate to offer free companion tickets.',
      detail: 'The Companion Card is a national scheme. Registration is free and takes about 30 minutes online. It demonstrates your commitment to equitable access and removes a major financial barrier for attendees who need support.',
      priority: 2
    },
    {
      icon: 'Equal',
      text: 'Price accessible seating the same as equivalent standard seating.',
      detail: 'Wheelchair spaces and accessible seats must not cost more than comparable seats in the same area. If accessible seats happen to be in a premium zone, offer the option to book at the standard price.',
      priority: 3
    },
    {
      icon: 'Armchair',
      text: 'Allocate wheelchair spaces at multiple price points, not only in the cheapest section.',
      detail: 'People with disability should have the same choice of viewing experience as everyone else. Offer wheelchair spaces in front, mid, and rear sections at corresponding price points.',
      priority: 4
    },
    {
      icon: 'Clock',
      text: 'Open accessible ticket sales at the same time as general sales.',
      detail: 'Do not make people with disability wait for a "special release" of accessible tickets. Priority access (early window) is even better, as accessible seats often sell out quickly.',
      priority: 5
    },
    {
      icon: 'Ticket',
      text: 'Allow ticket transfers and refunds if access needs change.',
      detail: 'Disability and health conditions can fluctuate. Offer flexible transfer and refund policies for accessible ticket holders whose circumstances change before the event.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing your ticketing equity',
    steps: [
      { text: 'Attempt to book a wheelchair space or accessible seat through your online ticketing system. Can you complete the purchase independently without calling or emailing?' },
      { text: 'Compare the price of an accessible seat to the equivalent standard seat in the same section. Is the price the same or lower?' },
      { text: 'Check whether wheelchair spaces are available at multiple price points and locations, not only in one section.' },
      { text: 'Confirm your Companion Card affiliate status. Search your organisation name on the Companion Card website.' },
      { text: 'Review your ticketing terms and conditions. Is there a flexible refund or transfer policy for accessible ticket holders?' },
      { text: 'Check whether accessible tickets go on sale at the same time as general admission.' },
      { text: 'Test the ticketing website with a screen reader and keyboard-only navigation. Can a blind or vision-impaired user purchase a ticket independently?' }
    ],
    tools: ['Computer with screen reader (NVDA)', 'Companion Card website for affiliate check', 'Ticketing platform admin access'],
    estimatedTime: '20-30 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The Disability Discrimination Act prohibits charging people with disability more for equivalent goods and services. Accessible seating must be priced equitably.'
    },
    related: [
      { code: 'WCAG2.2-AA', relevance: 'Online ticketing platforms must be accessible, including seat selection maps, payment forms, and confirmation pages.' }
    ],
    plainEnglish: 'People with disability must be able to buy event tickets through the same channels, at the same price, and with the same choices as everyone else. Companion Card holders are entitled to a free companion ticket at affiliated venues.',
    complianceNote: 'Companion Card affiliation is voluntary but strongly recommended. Charging a premium for accessible seating may breach the DDA.'
  },

  solutions: [
    {
      title: 'Register for Companion Card and review pricing',
      description: 'Register as a Companion Card affiliate and review your accessible seating pricing to ensure equity. These are free actions that have immediate impact.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Visit companioncard.gov.au and complete the online affiliate registration for your state or territory.',
        'Review your current accessible seating prices against equivalent standard seats. Adjust any that are priced higher.',
        'Add the Companion Card logo to your ticketing page, venue signage, and promotional materials.',
        'Train box office and ticketing staff on Companion Card procedures.',
        'Add a Companion Card ticket option to your online booking system.',
        'Publish your Companion Card policy on your accessibility page.'
      ],
      notes: 'Companion Card registration is typically approved within 2-4 weeks. The cost of free companion tickets is offset by increased attendance from people with disability.'
    },
    {
      title: 'Configure accessible seat booking in your ticketing platform',
      description: 'Work with your ticketing provider to ensure wheelchair spaces and accessible seats can be booked online with the same ease as standard tickets. Add accessible seating at multiple price points.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Contact your ticketing platform provider and request accessible seating functionality (seat maps with wheelchair icons, companion seat linking, accessible pricing).',
        'Map wheelchair spaces and accessible seats at multiple price points in the venue seating plan.',
        'Configure Companion Card ticket type as a linked free ticket that can be selected alongside an accessible seat.',
        'Test the booking flow with a screen reader and keyboard-only navigation.',
        'Add clear information about accessible seating options and how to book them on the ticketing page.',
        'Set accessible tickets to release at the same time as general admission (or earlier for priority access).',
        'Monitor accessible seat availability during on-sale periods and release additional stock if demand is high.'
      ],
      notes: 'Major ticketing platforms (Ticketmaster, Ticketek, Humanitix) all offer accessible seating features. Contact their accessibility teams for setup guidance.'
    },
    {
      title: 'Implement a comprehensive accessible ticketing and pricing policy',
      description: 'Develop a formal accessible ticketing policy, engage with disability organisations for feedback, and implement a best-practice ticketing system with priority access, flexible policies, and monitoring.',
      resourceLevel: 'high',
      costRange: '$2,000-5,000',
      timeRequired: '3-6 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a disability access consultant to review your ticketing system and pricing structure.',
        'Develop a written accessible ticketing policy covering pricing equity, Companion Card, priority access, refund flexibility, and online accessibility.',
        'Consult with local disability organisations on the draft policy before finalising.',
        'Implement priority booking windows for people with disability (e.g. 24-hour early access for accessible seating).',
        'Commission accessibility testing of the online booking journey by users with different disabilities.',
        'Publish the policy on your website and include a summary in all event marketing.',
        'Monitor accessible ticket sales data and feedback to identify ongoing improvements.',
        'Review the policy annually with input from disability community representatives.'
      ],
      notes: 'Publicly committing to an accessible ticketing policy signals genuine inclusion and builds loyalty among attendees with disability.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Concert Venue',
      scenario: 'A concert venue only offered wheelchair spaces at the back of the general admission area. Wheelchair users had no option for premium or front-section seating and had to phone to book.',
      solution: 'Added wheelchair platforms at three locations: front, mid, and rear. Made all accessible seats bookable online at the same price as adjacent standard seats. Registered as a Companion Card affiliate.',
      outcome: 'Accessible ticket sales tripled. The venue received an accessibility award from the state arts council.',
      cost: '$3,500 (platform construction)',
      timeframe: '3 weeks'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Sports Stadium',
      scenario: 'A sports stadium charged wheelchair users the premium reserve price regardless of location because the accessible section happened to be adjacent to premium seating.',
      solution: 'Restructured accessible seating pricing to match the nearest equivalent standard section. Added wheelchair spaces in two additional sections at different price points.',
      outcome: 'Complaint to the AHRC was withdrawn after the pricing change. Season ticket uptake by wheelchair users doubled.',
      cost: '$500 (ticketing system reconfiguration)',
      timeframe: '2 weeks'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Event',
      scenario: 'A council\'s free community cinema screenings had no Companion Card recognition, no wheelchair viewing area, and registrations were only via a web form that was not keyboard-accessible.',
      solution: 'Added phone and email registration options. Designated a wheelchair viewing area at the front with companion seating. Registered as a Companion Card affiliate for all council events.',
      outcome: 'Attendance by families with members with disability increased. The council adopted the same approach for all events.',
      cost: 'Free',
      timeframe: '1 day'
    }
  ],

  resources: [
    {
      title: 'Companion Card Australia',
      url: 'https://www.companioncard.gov.au/',
      type: 'website',
      source: 'Companion Card Australia',
      description: 'National portal for Companion Card affiliate registration and cardholder information.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AHRC Guidelines on Equitable Pricing',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on pricing obligations under the DDA, including event ticketing.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Ticketmaster Accessible Seating Guide',
      url: 'https://help.ticketmaster.com.au/hc/en-au',
      type: 'guide',
      source: 'Ticketmaster Australia',
      description: 'Guide for event organisers on configuring accessible seating and Companion Card tickets on the Ticketmaster platform.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['ticketing', 'Companion Card', 'wheelchair seating', 'pricing', 'equity', 'booking', 'accessible seats', 'priority access', 'refund', 'companion ticket']
},

// ─── Entry 4: Venue Physical Accessibility ───
{
  questionId: '6.2-PC-1',
  questionText: 'Is the event venue physically accessible?',
  moduleCode: '6.2',
  moduleGroup: 'events',
  diapCategory: 'physical-access',
  title: 'Venue Physical Accessibility',
  coveredQuestionIds: ['6.2-D-1', '6.2-D-2', '6.2-D-5', '6.2-D-8', '6.2-D-10', '6.2-D-15'],
  summary: 'An accessible event venue has step-free entry, wide pathways, accessible stages and presentation areas, firm ground surfaces for temporary structures, accessible food and beverage service points, and charging stations for mobility devices.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Physical access is the foundation of event inclusion. If an attendee cannot enter the venue, reach the stage area, navigate between activity zones, or access food service, no amount of accessible communication will make the event inclusive. Temporary event infrastructure (stages, marquees, stalls) often creates new barriers that do not exist in the permanent venue, so event-specific planning is essential.',
    statistic: {
      value: '2.1 million',
      context: 'Australians use mobility aids. Outdoor and temporary event sites frequently fail to account for wheelchair and mobility scooter access.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'DoorOpen',
      text: 'Ensure at least one step-free entrance with minimum 850mm clear opening.',
      detail: 'For events in temporary structures, this may mean installing portable ramps or choosing sites with level ground. The accessible entrance must be the same entrance or immediately adjacent to the main entrance, not a service entrance around the back.',
      priority: 1
    },
    {
      icon: 'Move',
      text: 'Maintain 1200mm minimum pathway width throughout the event site.',
      detail: 'Account for crowd flow, stall displays, and temporary signage that narrow pathways. Set up pathways at 1500mm to allow for encroachment. Mark accessible routes clearly with high-contrast ground markings or signage.',
      priority: 2
    },
    {
      icon: 'Presentation',
      text: 'Provide ramped or lift access to stages and presentation areas.',
      detail: 'If speakers or performers with disability cannot access the stage, your event is not inclusive. Temporary stage ramps should have a maximum gradient of 1:14 with handrails. Confirm the ramp can support powered wheelchairs (minimum 300kg load).',
      priority: 3
    },
    {
      icon: 'Zap',
      text: 'Provide charging points for powered wheelchairs and mobility scooters.',
      detail: 'Powered mobility devices have limited battery life. For events longer than 4 hours, provide at least one charging station with standard 240V outlets at a height of 600-1000mm. Locate it near a rest area.',
      priority: 4
    },
    {
      icon: 'Utensils',
      text: 'Ensure food and beverage service points have a lowered counter section.',
      detail: 'At least one service point at each food area should have a counter no higher than 870mm. If using food trucks, provide a ground-level service window or arrange for staff to deliver orders.',
      priority: 5
    },
    {
      icon: 'HardHat',
      text: 'Check temporary structures (marquees, stages, stalls) for accessibility before the event opens.',
      detail: 'Temporary structures often have lips, steps, guy ropes across paths, and uneven flooring. Walk the entire site in a wheelchair or with a mobility aid to identify barriers. Schedule this check at least 2 hours before doors open.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing venue physical accessibility',
    steps: [
      {
        text: 'Check the main entrance for step-free access and adequate door width.',
        measurement: { target: 'Door clear opening', acceptable: 'Minimum 850mm', unit: 'mm' }
      },
      {
        text: 'Measure pathway widths at the narrowest points, particularly around stalls, stages, and seating areas.',
        measurement: { target: 'Pathway width', acceptable: 'Minimum 1200mm (1500mm preferred)', unit: 'mm' }
      },
      { text: 'Check the ground surface along all pathways. Is it firm, level, and slip-resistant? Flag any grass, gravel, sand, or uneven sections.' },
      { text: 'Verify stage access. Is there a ramp or lift? Check the ramp gradient (maximum 1:14) and handrails.' },
      { text: 'Locate food and beverage service points. Is at least one counter at 870mm or lower? Can wheelchair users reach the service point independently?' },
      { text: 'Check for charging points. Are standard 240V outlets available at an accessible height (600-1000mm) near a rest area?' },
      { text: 'Walk the entire site looking for trip hazards: cables, guy ropes, raised thresholds, temporary ramps without edge protection.' },
      { text: 'Check that accessible routes are clearly signed and that signage is at wheelchair-visible height (1200-1600mm).' }
    ],
    tools: ['Tape measure (at least 5m)', 'Spirit level or inclinometer', 'Camera for documentation', 'Clipboard and site map'],
    estimatedTime: '45-60 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Sections 6-10',
      requirement: 'Continuous accessible paths of travel must be provided from site entry to all key areas. Paths must be firm, slip-resistant, minimum 1000mm wide, with maximum 1:40 cross-fall.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Permanent venues must meet the Premises Standards for physical access. Temporary modifications must not reduce existing access.' },
      { code: 'NCC', relevance: 'The National Construction Code sets minimum accessibility requirements for buildings used as event venues.' }
    ],
    plainEnglish: 'Event venues must provide step-free paths to all key areas, wide enough for wheelchairs, with firm surfaces and adequate signage. Temporary event infrastructure must not create new barriers.',
    complianceNote: 'For outdoor events on temporary sites, the DDA general duty applies even where building codes do not. Reasonable adjustments must be made to ensure physical access.'
  },

  solutions: [
    {
      title: 'Conduct a pre-event site walkthrough and fix immediate barriers',
      description: 'Walk the event site with an accessibility lens and address quick fixes: cable covers, portable ramps, pathway widening, and signage.',
      resourceLevel: 'low',
      costRange: '$100-500',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Walk the entire site from the accessible parking or drop-off to every event area, noting every barrier.',
        'Install cable covers over any cables crossing pathways (available from hardware stores, $20-50 each).',
        'Place portable ramps at any steps or lips (aluminium threshold ramps are $50-200 each).',
        'Widen any pathway pinch points by moving stalls, signage, or furniture.',
        'Add "Accessible Route" signage at decision points along the path.',
        'Brief all stall holders and vendors on keeping their frontage clear of trip hazards and maintaining pathway widths.'
      ],
      notes: 'A pre-event walkthrough using a wheelchair or mobility aid is the most effective way to find barriers that are invisible when walking.'
    },
    {
      title: 'Install temporary accessible infrastructure',
      description: 'Hire or install temporary accessible pathways, ramps, stages, and charging points designed for event use.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Hire portable accessible pathways (interlocking panels) for grass or gravel sections. Suppliers include Signature Event Hire and similar.',
        'Install a temporary stage ramp meeting AS1428.1 gradient requirements (1:14 maximum) with handrails and edge protection.',
        'Set up at least one lowered food service counter or arrange ground-level food truck service windows.',
        'Install a charging station with two 240V outlets near the accessible rest area.',
        'Lay high-contrast directional signage along accessible routes.',
        'Arrange for an accessibility coordinator to be on-site during bump-in to verify all temporary infrastructure meets requirements.'
      ],
      notes: 'Portable pathway panels can be hired by the day or weekend. They are reusable and significantly cheaper than permanent construction.'
    },
    {
      title: 'Engage an access consultant for venue design and certification',
      description: 'Commission an access consultant to review the venue and event layout, specify accessible infrastructure, oversee installation, and certify the site before opening.',
      resourceLevel: 'high',
      costRange: '$5,000-15,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant with event venue experience.',
        'Provide the site plan and event layout for review.',
        'Have the consultant specify all required accessible infrastructure: paths, ramps, stages, counters, charging, rest areas, signage.',
        'Include consultant specifications in tender documents for temporary infrastructure suppliers.',
        'Have the consultant conduct an on-site inspection during bump-in to verify compliance.',
        'Obtain a written compliance statement from the consultant before doors open.',
        'Use the consultant\'s specifications as a template for future events at the same venue.',
        'Conduct a post-event debrief to document what worked and what needs improvement.'
      ],
      notes: 'A consultant-certified site provides legal protection and demonstrates due diligence under the DDA.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Outdoor Festival Site',
      scenario: 'An annual food and wine festival on a grassy riverbank had no accessible pathways. Wheelchair users could not move between stalls after rain.',
      solution: 'Hired interlocking portable pathway panels for the main route between all stall areas. Installed a temporary ramp to the elevated main stage viewing area. Added a mobility device charging station near the first aid tent.',
      outcome: 'Wheelchair users and scooter users could navigate the entire site independently. Social media feedback was overwhelmingly positive.',
      cost: '$2,800',
      timeframe: '1 day to install'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Event Space',
      scenario: 'A council event space had a permanent stage with steps only. Speakers and performers with disability could not access the stage independently.',
      solution: 'Installed a permanent ramp to the stage with a gradient of 1:14 and handrails on both sides. Added a portable lift as backup for heavier powered wheelchairs.',
      outcome: 'The space became a preferred venue for disability sector events. Annual bookings increased 20%.',
      cost: '$8,000 (permanent ramp)',
      timeframe: '2 weeks'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Agricultural Show',
      scenario: 'A regional agricultural show had food vans with high service windows inaccessible from a wheelchair.',
      solution: 'Required all food vendors to provide ground-level ordering (either a lowered window or a staff member taking orders at ground level). Marked accessible food service points on the site map.',
      outcome: 'Wheelchair users reported being able to buy food independently for the first time. The requirement was added to all vendor contracts going forward.',
      cost: 'Free (policy change)',
      timeframe: '1 meeting to implement'
    }
  ],

  resources: [
    {
      title: 'AS 1428.1:2021 Design for Access and Mobility',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'The primary Australian standard for accessible design including paths of travel, ramps, doors, and ground surfaces.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AHRC Accessible Events Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on physical accessibility requirements for event venues under the DDA.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Accessible Event Venue Checklist (AND)',
      url: 'https://www.and.org.au/resources/',
      type: 'checklist',
      source: 'Australian Network on Disability',
      description: 'Checklist for assessing physical accessibility of event venues including temporary infrastructure.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Changing Places Australia',
      url: 'https://changingplaces.org.au/',
      type: 'website',
      source: 'Changing Places Australia',
      description: 'Directory of Changing Places accessible toilets in Australia, essential for events serving people with high support needs.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['venue', 'physical access', 'pathways', 'ramp', 'stage access', 'food service', 'charging', 'temporary structures', 'wheelchair', 'ground surface']
},

// ─── Entry 5: Event Parking, Transport and Drop-off ───
{
  questionId: '6.2-PC-2',
  questionText: 'Are parking, transport and drop-off arrangements accessible?',
  moduleCode: '6.2',
  moduleGroup: 'events',
  diapCategory: 'physical-access',
  title: 'Event Parking, Transport and Drop-off',
  coveredQuestionIds: ['6.2-D-4', '6.2-D-16', '6.2-D-17', '6.2-D-19'],
  summary: 'Accessible event transport includes designated accessible parking close to the entrance, a managed drop-off zone, links to accessible public transport, and shuttle services with wheelchair-accessible vehicles where the venue is remote from transport.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Getting to the event is the first barrier many people with disability encounter. If accessible parking is full, too far away, or blocked by general traffic, the event may as well not exist. Drop-off zones are critical for people who travel as passengers and need to alight close to the entrance. For events not near public transport, accessible shuttle services bridge the gap.',
    quote: {
      text: 'We drove 90 minutes to a festival only to find the accessible parking was a muddy field 300 metres from the gate. We turned around and went home.',
      attribution: 'Parent of wheelchair user, regional event feedback'
    }
  },

  tips: [
    {
      icon: 'Car',
      text: 'Designate accessible parking as close as possible to the accessible entrance, on firm level ground.',
      detail: 'For outdoor events, use compacted gravel or portable pathway panels between parking and the entrance. Accessible spaces need to be 3200mm wide (or 2400mm with a shared zone). Mark them clearly with ISA signs on bollards at 1200mm height.',
      priority: 1
    },
    {
      icon: 'ArrowDownToLine',
      text: 'Create a managed drop-off zone immediately adjacent to the entrance.',
      detail: 'The drop-off zone should be at least 3200mm wide, on firm level ground, and staffed during peak arrival times. Vehicles need space to deploy ramps. Allow at least 5 minutes per vehicle for assisted transfers.',
      priority: 2
    },
    {
      icon: 'Bus',
      text: 'Publish accessible public transport options and walking routes from stops.',
      detail: 'Include bus, train, and tram routes that have accessible vehicles. Note the distance from the stop to the venue entrance and describe the path (e.g. "150m, level footpath, no steps"). Publish this on your event website and in confirmation emails.',
      priority: 3
    },
    {
      icon: 'Truck',
      text: 'Provide wheelchair-accessible shuttle services for remote venues.',
      detail: 'If the venue is more than 200m from accessible public transport or accessible parking, provide a shuttle with a wheelchair ramp or lift. Schedule runs every 15-20 minutes during arrival and departure periods.',
      priority: 4
    },
    {
      icon: 'Shield',
      text: 'Protect accessible parking and drop-off zones from encroachment by general traffic.',
      detail: 'Use bollards, traffic marshals, or physical barriers to prevent non-permit vehicles from using accessible spaces. Brief traffic management staff on accessibility requirements. Monitor throughout the event.',
      priority: 5
    },
    {
      icon: 'Lightbulb',
      text: 'Provide adequate lighting in parking, drop-off, and pathway areas.',
      detail: 'Minimum 40 lux along pathways and in parking areas. For evening events, add temporary lighting (solar bollards, LED floodlights) along the accessible route from parking and drop-off to the entrance.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing event parking and transport',
    steps: [
      {
        text: 'Count accessible parking spaces and measure their width.',
        measurement: { target: 'Space width', acceptable: 'Minimum 2400mm with shared zone, or 3200mm single', unit: 'mm' }
      },
      {
        text: 'Measure the distance from accessible parking to the event entrance.',
        measurement: { target: 'Distance to entrance', acceptable: 'Maximum 30m (shorter is better)', unit: 'm' }
      },
      { text: 'Check the surface between parking and the entrance. Is it firm, level, and free of mud, gravel, or trip hazards?' },
      { text: 'Locate the drop-off zone. Is it immediately adjacent to the entrance? Is it signed, managed, and wide enough for ramp deployment?' },
      { text: 'Review published transport information. Does it include accessible routes, distances from stops, and path descriptions?' },
      { text: 'If a shuttle is provided, confirm at least one vehicle is wheelchair accessible and the schedule is frequent enough.' },
      {
        text: 'Check lighting levels in parking, drop-off, and pathway areas.',
        measurement: { target: 'Lighting', acceptable: 'Minimum 40 lux', unit: 'lux' }
      },
      { text: 'Observe whether accessible spaces are protected from misuse during the event.' }
    ],
    tools: ['Tape measure', 'Lux meter or smartphone app', 'Camera', 'Site map'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 6',
      requirement: 'Accessible car parking must be located close to the accessible entrance with a continuous accessible path of travel. Spaces must meet dimensional requirements of AS/NZS 2890.6.'
    },
    related: [
      { code: 'Access-to-Premises', relevance: 'Requires accessible parking where car parking is provided, connected to the building entrance by an accessible path.' },
      { code: 'DDA', relevance: 'Requires reasonable adjustments to transport arrangements to ensure people with disability can access events.' }
    ],
    plainEnglish: 'If your event has parking, some of it must be accessible, close to the entrance, and connected by a smooth path. You should also provide drop-off zones and transport information.',
    complianceNote: 'For temporary event sites where building standards may not directly apply, the DDA general duty still requires reasonable transport accommodations.'
  },

  solutions: [
    {
      title: 'Designate and sign accessible parking and drop-off zones',
      description: 'Mark accessible parking spaces and a drop-off zone at the closest point to the entrance. Add signage and brief traffic management staff.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Identify the closest firm, level ground to the accessible entrance for parking and drop-off.',
        'Mark accessible spaces with temporary ISA signs on weighted bases (do not rely on cones alone).',
        'Designate a drop-off zone at least 3200mm wide immediately adjacent to the entrance.',
        'Brief traffic management staff on protecting these spaces and assisting with drop-offs.',
        'Add accessible parking and drop-off location details to the event website and confirmation emails.',
        'Monitor spaces throughout the event and reposition signage if needed.'
      ],
      notes: 'Temporary ISA signs on weighted bases can be purchased for $30-50 each and reused at every event.'
    },
    {
      title: 'Install temporary accessible pathways and transport links',
      description: 'Hire portable pathway panels from parking to the entrance and arrange accessible shuttle services from public transport hubs.',
      resourceLevel: 'medium',
      costRange: '$800-3,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Hire interlocking pathway panels for the route from accessible parking to the entrance.',
        'Install panels the day before the event, ensuring they are level, stable, and at least 1200mm wide.',
        'Arrange an accessible shuttle (wheelchair ramp or lift equipped) to run every 15-20 minutes from the nearest accessible public transport stop.',
        'Publish shuttle timetable and pick-up/drop-off points on the event website.',
        'Install temporary lighting along the accessible route if the event extends into evening.',
        'Station a volunteer at the drop-off zone during peak arrival and departure to assist.'
      ],
      notes: 'Accessible shuttle services can often be arranged through local community transport organisations at reasonable rates.'
    },
    {
      title: 'Commission comprehensive accessible transport management',
      description: 'Engage a traffic management company with accessibility expertise to design and implement the full parking, drop-off, shuttle, and wayfinding system.',
      resourceLevel: 'high',
      costRange: '$5,000-15,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a traffic management company and brief them on accessibility requirements.',
        'Have them design the parking layout with accessible spaces, drop-off zone, and accessible pathways.',
        'Include accessible shuttle routes and timetables in the transport management plan.',
        'Install real-time accessible parking availability signage at the venue entrance.',
        'Provide trained marshals at accessible parking, drop-off, and shuttle stops throughout the event.',
        'Set up a phone hotline for real-time transport assistance during the event.',
        'Conduct a post-event review of transport data (usage, complaints, wait times) to improve future events.',
        'Document the transport management plan as a reusable template.'
      ],
      notes: 'For large events, comprehensive transport management prevents the chaotic parking and drop-off situations that disproportionately affect attendees with disability.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Showground',
      scenario: 'A regional showground directed all attendees to a gravel car park 200m from the gate. Wheelchair users could not traverse the gravel independently.',
      solution: 'Designated 10 accessible spaces on firm ground next to the main gate. Installed portable pathway panels from the spaces to the gate. Added a staffed drop-off zone at the entrance.',
      outcome: 'Wheelchair users could attend independently for the first time. The setup was adopted as standard for all showground events.',
      cost: '$1,500',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Music Festival',
      scenario: 'A multi-day music festival in a rural location had no public transport links. Attendees with disability who could not drive had no way to reach the site.',
      solution: 'Arranged a wheelchair-accessible shuttle running hourly from the nearest train station (15km away). Published the shuttle schedule on the website and in ticket confirmation emails.',
      outcome: 'Over 40 attendees used the accessible shuttle across the weekend. Post-event survey showed transport was no longer the top access barrier.',
      cost: '$3,200 (shuttle hire for 3 days)',
      timeframe: '3 weeks to arrange'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council New Year Event',
      scenario: 'A council\'s New Year\'s Eve event closed surrounding streets to traffic but did not plan for accessible drop-off. Wheelchair users had to be dropped 400m from the event area.',
      solution: 'Established a designated accessible drop-off zone 20m from the main gate, exempted from road closures. Stationed a volunteer at the zone to assist and manage traffic.',
      outcome: 'No complaints about transport access for the first time in the event\'s history. The drop-off zone was included in all future road closure plans.',
      cost: 'Free (volunteer time)',
      timeframe: '1 planning meeting'
    }
  ],

  resources: [
    {
      title: 'AS/NZS 2890.6 Accessible Parking Standards',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as-slash-nzs--2890-dot-6-colon-2009',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Australian standard for accessible parking dimensions, signage, and ratios.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Transport for NSW Accessible Transport Guide',
      url: 'https://transportnsw.info/travel-info/using-public-transport/accessible-travel',
      type: 'guide',
      source: 'Transport for NSW',
      description: 'Guide to accessible public transport options in NSW, useful for event transport planning.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Community Transport Organisation Australia',
      url: 'https://www.ctoa.org.au/',
      type: 'website',
      source: 'CTOA',
      description: 'National body for community transport providers who can supply accessible shuttle services for events.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['parking', 'drop-off', 'transport', 'shuttle', 'accessible parking', 'public transport', 'ISA', 'pathway', 'lighting', 'traffic management']
},

// ─── Entry 6: Event Seating and Viewing ───
{
  questionId: '6.2-PC-4',
  questionText: 'Do seating and viewing areas include accessible options?',
  moduleCode: '6.2',
  moduleGroup: 'events',
  diapCategory: 'physical-access',
  title: 'Event Seating and Viewing',
  coveredQuestionIds: ['6.2-D-6', '6.2-D-7', '6.2-D-14', '6.2-D-18'],
  summary: 'Accessible seating at events means designated wheelchair spaces with companion seating, sightline protection so standing crowds do not block views, elevated viewing platforms where needed, and crowd barriers that allow wheelchair passage.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Wheelchair users at events routinely have their view blocked by standing audiences. Being placed in a back corner with no companion seating, or behind a crowd barrier with no pass-through, means paying for an experience you cannot actually enjoy. Sightline protection and dispersed accessible seating give people with disability the same range of viewing experiences available to everyone else.',
    statistic: {
      value: '78%',
      context: 'of wheelchair users report having their view blocked at events where they had purchased accessible seating.',
      source: 'UK Euan\'s Guide survey (findings consistent with Australian experience)'
    }
  },

  tips: [
    {
      icon: 'Eye',
      text: 'Protect wheelchair sightlines by elevating accessible viewing areas above standing crowd height.',
      detail: 'If the audience stands, wheelchair users at ground level cannot see. Provide a raised platform (minimum 150mm, adjustable up to 600mm) or position wheelchair spaces at a natural elevation. Test sightlines from seated wheelchair height (approximately 1200mm eye level).',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Provide companion seating immediately adjacent to each wheelchair space.',
      detail: 'Companions must be able to sit at the same level, immediately next to the wheelchair user. Do not separate them. Provide one companion seat per wheelchair space as a minimum.',
      priority: 2
    },
    {
      icon: 'LayoutGrid',
      text: 'Disperse wheelchair spaces across multiple locations and price points.',
      detail: 'Offer accessible seating in front, middle, and rear sections. People with disability should have the same choice of experience as everyone else. For general admission, designate accessible viewing areas at multiple points.',
      priority: 3
    },
    {
      icon: 'Fence',
      text: 'Ensure crowd barriers have wheelchair pass-through points.',
      detail: 'Standard crowd barriers block wheelchair users from moving between zones. Install removable barrier sections or gates at regular intervals (every 20-30m) that are wide enough for a wheelchair (minimum 900mm clear opening).',
      priority: 4
    },
    {
      icon: 'Armchair',
      text: 'Provide seating with armrests and backs for people who cannot stand for long periods.',
      detail: 'Not all accessibility needs involve wheelchairs. People with chronic pain, fatigue, and balance conditions need seats with armrests and backrests throughout the venue, not only in the "accessible section".',
      priority: 5
    },
    {
      icon: 'ArrowUpDown',
      text: 'Design raised viewing platforms with ramp access and edge protection.',
      detail: 'Platforms should have a ramp no steeper than 1:14, edge protection to prevent wheelchairs rolling off, and a non-slip surface. Minimum platform depth of 2000mm allows comfortable positioning.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing event seating and viewing areas',
    steps: [
      { text: 'Sit at wheelchair height (approximately 1200mm eye level) in each designated accessible viewing area. Can you see the stage, screen, or main activity clearly?' },
      { text: 'Check whether the standing crowd would block the view from the accessible area. If so, the area needs elevation.' },
      {
        text: 'Measure wheelchair space dimensions.',
        measurement: { target: 'Wheelchair space', acceptable: 'Minimum 900mm wide x 1400mm deep', unit: 'mm' }
      },
      { text: 'Confirm companion seating is immediately adjacent to each wheelchair space at the same level.' },
      { text: 'Check whether accessible seating is available at multiple locations and price points, not only in one section.' },
      { text: 'Walk the crowd barrier line. Are there wheelchair pass-through gates every 20-30m?' },
      {
        text: 'If a raised platform is provided, check the ramp gradient.',
        measurement: { target: 'Ramp gradient', acceptable: 'Maximum 1:14', unit: 'ratio' }
      },
      { text: 'Check for general seating with armrests and backrests distributed throughout the venue for people who cannot stand.' }
    ],
    tools: ['Tape measure', 'Spirit level or inclinometer', 'Camera', 'Wheelchair or low stool for sightline testing'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 14',
      requirement: 'Fixed seating areas must include wheelchair spaces with companion seating. Wheelchair spaces must have unobstructed sightlines to the focal point, both when the audience is seated and standing.'
    },
    related: [
      { code: 'NCC', relevance: 'The National Construction Code requires accessible seating in assembly buildings with specific ratios based on total capacity.' },
      { code: 'DDA', relevance: 'The DDA requires equal participation, which includes being able to see the event you have paid to attend.' }
    ],
    plainEnglish: 'Wheelchair users must have clear sightlines to the stage or action, even when the rest of the audience stands. They need companion seating next to them and choices about where to sit.',
    complianceNote: 'Sightline protection is a common source of DDA complaints. Providing elevated platforms is one of the most effective ways to comply.'
  },

  solutions: [
    {
      title: 'Add companion seating and sightline markers to existing areas',
      description: 'Designate wheelchair spaces with adjacent companion seats and use temporary markers to protect sightlines. A low-cost improvement for any event.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Identify locations with natural elevation or unobstructed views for wheelchair spaces.',
        'Mark each wheelchair space (900mm x 1400mm minimum) with tape or signage.',
        'Place a chair with armrests immediately adjacent to each wheelchair space for the companion.',
        'Add "Reserved: Accessible Seating" signage visible to the general audience to prevent encroachment.',
        'Brief front-of-house staff to monitor accessible areas and redirect people who stand in sightlines.',
        'Test sightlines from wheelchair height before the audience arrives.'
      ],
      notes: 'Even simple measures like a reserved sign and a companion chair make a noticeable difference to the experience.'
    },
    {
      title: 'Install temporary elevated viewing platforms',
      description: 'Hire or build temporary raised platforms at key viewing locations with ramp access, edge protection, and companion seating.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Determine the number and location of platforms needed based on event capacity and layout.',
        'Hire modular staging platforms (available from event hire companies) rated for wheelchair loads (minimum 300kg per space).',
        'Install ramp access to each platform at maximum 1:14 gradient with handrails.',
        'Add edge protection (minimum 75mm kerb) around all platform edges.',
        'Place companion chairs on the platform adjacent to each wheelchair space.',
        'Test sightlines from the platform at wheelchair eye height with the stage setup in place.',
        'Add signage directing attendees to accessible viewing platforms.'
      ],
      notes: 'Modular staging platforms can be configured to different heights and are available from most event hire companies.'
    },
    {
      title: 'Design a comprehensive accessible seating plan',
      description: 'Engage an access consultant to design the venue seating layout with dispersed accessible options, sightline-protected platforms, companion seating, and barrier pass-throughs.',
      resourceLevel: 'high',
      costRange: '$5,000-20,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant to review the venue and event layout.',
        'Map accessible seating at multiple locations: front, mid, rear, and at different price points.',
        'Design elevated platforms with integrated ramp access for locations where standing crowds block sightlines.',
        'Specify crowd barrier modifications including wheelchair pass-through gates every 20-30m.',
        'Include companion seating, armrest seating for ambulant disabled people, and transfer seats at each accessible zone.',
        'Commission construction or hire of platforms, barriers, and seating.',
        'Test the complete layout with wheelchair users before the first event.',
        'Document the seating plan as a reusable template for the venue.'
      ],
      notes: 'A well-designed accessible seating plan is a long-term investment that benefits every event held at the venue.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Outdoor Amphitheatre',
      scenario: 'An amphitheatre placed wheelchair users at the back of the flat area behind all standing audience. Wheelchair users could not see the stage.',
      solution: 'Built a raised viewing platform (500mm elevation) at the centre of the venue with ramp access. Provided 6 wheelchair spaces with companion seats.',
      outcome: 'Wheelchair users could see the stage clearly even when the audience stood. Positive reviews specifically mentioned the accessible viewing.',
      cost: '$4,500 (portable platform hire for season)',
      timeframe: '2 days to install'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Cricket Ground',
      scenario: 'A cricket ground had wheelchair spaces only behind the boundary fence with no companion seating. The view was partially blocked by advertising hoardings.',
      solution: 'Relocated wheelchair spaces to a raised section in each grandstand with clear sightlines. Added companion seats. Installed wheelchair pass-through gates in perimeter barriers.',
      outcome: 'Season ticket sales to wheelchair users doubled. The ground received an accessibility commendation from the sport\'s governing body.',
      cost: '$12,000',
      timeframe: '4 weeks (off-season installation)'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council Concert',
      scenario: 'A free council concert in a park had no designated accessible viewing. Wheelchair users ended up at the edges where sound quality was poor and views were blocked.',
      solution: 'Roped off a central accessible viewing area at the front with 8 wheelchair spaces and companion chairs. Added a "Reserved: Accessible Viewing" banner. Stationed a volunteer to manage the space.',
      outcome: 'Wheelchair users had the best views at the event. Other attendees commented positively on the council\'s inclusion efforts.',
      cost: '$80 (signage and rope)',
      timeframe: '30 minutes to set up'
    }
  ],

  resources: [
    {
      title: 'AS 1428.1:2021 Section 14: Fixed Seating',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Detailed requirements for wheelchair spaces and companion seating in assembly areas.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Attitude Foundation Event Seating Guide',
      url: 'https://www.attitudes.org.au/',
      type: 'guide',
      source: 'Attitudes Foundation',
      description: 'Practical guide to accessible seating at events with diagrams and case studies.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Euan\'s Guide Accessible Events Reviews',
      url: 'https://www.euansguide.com/',
      type: 'website',
      source: 'Euan\'s Guide',
      description: 'Disabled access reviews of venues and events, useful for benchmarking your seating arrangements.',
      isAustralian: false,
      isFree: true
    }
  ],

  keywords: ['seating', 'viewing', 'wheelchair', 'sightlines', 'companion', 'platform', 'crowd barriers', 'elevated', 'accessible viewing', 'pass-through']
},

// ─── Entry 7: Event Toilets, Amenities and Weather ───
{
  questionId: '6.2-PC-3',
  questionText: 'Are event toilets, amenities and weather provisions accessible?',
  moduleCode: '6.2',
  moduleGroup: 'events',
  diapCategory: 'physical-access',
  title: 'Event Toilets, Amenities and Weather',
  coveredQuestionIds: ['6.2-D-3', '6.2-PC-5', '6.2-D-9', '6.2-D-11', '6.2-D-12', '6.2-D-13'],
  summary: 'Accessible event amenities include properly specified accessible portable toilets (Changing Places units preferred), weather protection such as shade structures and rain cover, quiet rest areas with seating, accessible water stations, and device charging points.',
  lastUpdated: '2026-02-26',

  whyItMatters: {
    text: 'Accessible toilets at events are one of the most frequently cited failures. Standard accessible portable toilets are often too small, placed on uneven ground, or missing grab rails. For people with high support needs, a Changing Places toilet (with hoist, adult change table, and space for two carers) is the only viable option. Weather protection, rest areas, and water access are equally important for people with fatigue, pain, and sensory conditions who cannot manage extended exposure to heat, cold, or crowds.',
    statistic: {
      value: '41%',
      context: 'of people with disability avoid events due to inadequate or inaccessible toilet facilities.',
      source: 'Changing Places Australia user survey'
    }
  },

  tips: [
    {
      icon: 'Bath',
      text: 'Hire at least one Changing Places portable unit for events over 500 attendees.',
      detail: 'A standard accessible portable toilet is not sufficient for people who need hoisting or an adult change table. Changing Places units are available for hire and include a ceiling hoist, height-adjustable change table, peninsular toilet, and adequate space for two carers.',
      priority: 1
    },
    {
      icon: 'Accessibility',
      text: 'Place accessible toilets on firm, level ground at the same location as general toilets.',
      detail: 'Do not isolate accessible toilets away from other facilities. Ensure the path to the accessible toilet is firm and level (no grass slopes or gravel). Place them within 50m of main activity areas.',
      priority: 2
    },
    {
      icon: 'Umbrella',
      text: 'Provide shade and rain protection at key areas: entrance, viewing, dining, and rest zones.',
      detail: 'People with certain conditions are highly sensitive to heat, UV, and cold rain. Shade structures, marquees, or covered areas should be available at the entrance, main viewing area, food service, and rest zones.',
      priority: 3
    },
    {
      icon: 'Sofa',
      text: 'Create designated quiet rest areas with seating, shade, and low stimulation.',
      detail: 'Quiet rest areas serve people with sensory conditions, fatigue, chronic pain, and anxiety. Provide seating with armrests and backs, shade, and reduced noise. Locate rest areas away from stages and loudspeakers but within the event perimeter.',
      priority: 4
    },
    {
      icon: 'Droplets',
      text: 'Ensure water stations are at an accessible height with cup dispensers.',
      detail: 'Water bubblers should have a basin at 750-800mm height, or provide a tap and cups. Ensure the approach path is wheelchair accessible. Provide at least one accessible water station per activity zone.',
      priority: 5
    },
    {
      icon: 'BatteryCharging',
      text: 'Provide power outlets for mobility device charging in rest areas.',
      detail: 'Standard 240V outlets at 600-1000mm height in or near rest areas allow powered wheelchair and scooter users to recharge during long events. Clearly sign the charging locations on the event map.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing event amenities',
    steps: [
      { text: 'Check accessible portable toilets: are they on firm level ground? Do they have grab rails, adequate turning space (1500mm diameter), and clear signage?' },
      {
        text: 'Measure the internal space of accessible portable toilets.',
        measurement: { target: 'Internal turning circle', acceptable: 'Minimum 1500mm diameter', unit: 'mm' }
      },
      { text: 'If a Changing Places unit is provided, verify it has a ceiling hoist, adult change table, peninsular toilet, and space for two carers.' },
      { text: 'Check the path from main activity areas to accessible toilets. Is it firm, level, and no more than 50m?' },
      { text: 'Identify shade structures. Are they available at the entrance, main viewing area, food service, and rest zones?' },
      { text: 'Locate quiet rest areas. Do they have seating with armrests, shade, and reduced noise?' },
      { text: 'Check water stations for accessible height and approach path.' },
      { text: 'Verify charging points are available and signed on the event map.' }
    ],
    tools: ['Tape measure', 'Camera', 'Event site map', 'Decibel meter or smartphone app (for quiet area verification)'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'AS1428.1',
      section: 'Section 15',
      requirement: 'Accessible sanitary facilities must provide adequate space for wheelchair turning (1500mm), grab rails, and appropriate fixture heights. Where temporary facilities are provided, accessible units must be included.'
    },
    related: [
      { code: 'NCC', relevance: 'The NCC specifies minimum numbers of accessible toilets based on building class and occupancy.' },
      { code: 'DDA', relevance: 'The DDA requires accessible amenities as a reasonable adjustment for events.' }
    ],
    plainEnglish: 'Events must provide accessible toilets that are properly sized, equipped, and located. Additional amenities like shade, rest areas, and water must also be accessible.',
    complianceNote: 'Changing Places toilets go beyond minimum compliance but are increasingly expected at large events and may be considered a reasonable adjustment under the DDA.'
  },

  solutions: [
    {
      title: 'Improve placement and signage of existing accessible toilets',
      description: 'Relocate accessible portable toilets to firm level ground near other toilets, add clear signage, and ensure the approach path is accessible.',
      resourceLevel: 'low',
      costRange: '$50-200',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Check the current location of accessible portable toilets. If they are on grass, gravel, or a slope, arrange relocation to firm level ground.',
        'Place accessible toilets in the same area as general toilets, not isolated.',
        'Add ISA signage on the unit and directional signage from main pathways.',
        'Ensure the path from the nearest accessible route to the toilet door is firm and level.',
        'Check that the unit has grab rails, adequate space, and a functioning lock.',
        'Brief cleaning staff to prioritise accessible units and report any issues immediately.'
      ],
      notes: 'Simply moving the unit to firm ground and adding signage can transform the experience for users.'
    },
    {
      title: 'Hire Changing Places unit and add weather protection',
      description: 'Hire a Changing Places portable toilet, add shade structures, and set up a quiet rest area with water and charging.',
      resourceLevel: 'medium',
      costRange: '$1,500-5,000',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Hire a Changing Places portable unit from a specialist supplier. Confirm it includes ceiling hoist, adult change table, peninsular toilet, and carer space.',
        'Position the unit on firm level ground near other toilet facilities with clear directional signage.',
        'Hire shade structures (marquees or shade sails) for the entrance, main viewing area, and food service area.',
        'Set up a quiet rest area under cover with 6-8 chairs with armrests and backs, away from stage noise.',
        'Install an accessible water station near the rest area.',
        'Add a charging station (two 240V outlets at accessible height) in the rest area.'
      ],
      notes: 'Changing Places portable units are available from specialist hire companies in most capital cities. Book at least 4-6 weeks ahead for peak event season.'
    },
    {
      title: 'Commission comprehensive accessible amenities plan',
      description: 'Engage an access consultant to design the complete amenities layout including toilets, rest areas, weather protection, water, charging, and first aid.',
      resourceLevel: 'high',
      costRange: '$5,000-15,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an access consultant to review the event site and design the amenities layout.',
        'Specify the number and type of accessible toilets based on expected attendance (minimum 1 accessible per 10 standard units).',
        'Include at least one Changing Places unit for events over 500 attendees.',
        'Design weather protection coverage for all key areas: entrance, viewing, dining, rest.',
        'Specify quiet rest area requirements: seating, shade, noise levels below 60dB, distance from stages.',
        'Include accessible water stations and charging points in the amenities plan.',
        'Have the consultant inspect the site during bump-in to verify all amenities meet specifications.',
        'Document the plan as a reusable template for future events at the venue.'
      ],
      notes: 'A comprehensive amenities plan demonstrates duty of care and can be used as evidence of reasonable adjustments under the DDA.'
    }
  ],

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Festival Site',
      scenario: 'A multi-day festival had accessible portable toilets on a grassy slope that became muddy after rain. Wheelchair users could not reach them.',
      solution: 'Relocated units to a paved area near the first aid tent. Hired a Changing Places unit for the first time. Added portable pathway panels to all toilet areas.',
      outcome: 'Zero complaints about toilet access (previously the top complaint). The Changing Places unit was used by 15 attendees across the weekend.',
      cost: '$3,800',
      timeframe: '1 day to set up'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Australia Day Event',
      scenario: 'A council\'s outdoor Australia Day event had no shade and no rest areas. Attendees with heat sensitivity and fatigue conditions left early or avoided the event entirely.',
      solution: 'Installed three shade marquees at the viewing area, food zone, and a new quiet rest area. The rest area included seating with armrests, water, and a first aid volunteer.',
      outcome: 'Event duration for attendees with disability increased on average. Several attendees thanked the council for the rest area.',
      cost: '$1,200 (marquee hire)',
      timeframe: '1 day to set up'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Agricultural Show',
      scenario: 'A regional show had water bubblers mounted on posts too high for wheelchair users, and the only accessible toilet was at the far end of the site.',
      solution: 'Installed a portable accessible water station at wheelchair height in the centre of the site. Moved the accessible toilet to the central facilities block. Added a second accessible unit near the grandstand.',
      outcome: 'Wheelchair users could hydrate and use toilets without crossing the entire site. Site planning was updated for all future shows.',
      cost: '$600',
      timeframe: '2 hours'
    }
  ],

  resources: [
    {
      title: 'Changing Places Australia',
      url: 'https://changingplaces.org.au/',
      type: 'website',
      source: 'Changing Places Australia',
      description: 'Information on Changing Places toilets, hire options for events, and the directory of permanent facilities.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'AS 1428.1:2021 Sanitary Facilities',
      url: 'https://www.standards.org.au/standards-catalogue/sa-snz/building/me-064/as--1428-dot-1-colon-2021',
      type: 'guide',
      source: 'Standards Australia',
      description: 'Standards for accessible toilet design including dimensions, grab rails, and fixture heights.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'AHRC Temporary Event Facilities Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/publications',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on accessible temporary facilities at events including toilets, rest areas, and weather protection.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Heat Health Guidelines for Event Organisers',
      url: 'https://www.health.gov.au/',
      type: 'guide',
      source: 'Australian Government Department of Health',
      description: 'Guidelines on managing heat-related health risks at outdoor events, including shade and hydration requirements.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['toilets', 'Changing Places', 'shade', 'weather', 'rest area', 'quiet space', 'water', 'charging', 'portable toilets', 'amenities', 'hoist', 'adult change']
},

// ─── Entry 8: Accessible event wayfinding and signage ───
{
  questionId: '6.3-PC-1',
  questionText: 'Does your event have clear, accessible wayfinding signage?',
  moduleCode: '6.3',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Accessible event wayfinding and signage',
  coveredQuestionIds: ['6.3-D-1', '6.3-D-2', '6.3-D-3', '6.3-D-8'],
  summary: 'Event wayfinding needs large-print, high-contrast directional signage at every decision point, accessible maps at entrances, tactile elements for blind attendees, and information points staffed by trained volunteers.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Events are temporary environments where usual wayfinding cues are absent. Attendees with disability cannot rely on familiarity and need clear, consistent signage. Poor wayfinding at events causes anxiety, missed sessions, and safety risks.',
    statistic: { value: '4.4 million', context: 'Australians have a disability. At a 10,000-person festival, approximately 1,800 attendees may need accessible wayfinding.', source: 'ABS' }
  },
  tips: [
    { icon: 'MapPin', text: 'Place directional signs at every intersection and decision point.', detail: 'Use minimum 30mm letter height, sans-serif font, high contrast (white on dark or yellow on black).', priority: 1 },
    { icon: 'Map', text: 'Provide accessible event maps at entrances in large print and digital format.', priority: 2 },
    { icon: 'Users', text: 'Station trained wayfinding volunteers at key locations wearing identifiable vests.', priority: 3 },
    { icon: 'Smartphone', text: 'Offer digital wayfinding via event app with screen reader support.', priority: 4 },
    { icon: 'Lightbulb', text: 'Ensure signage is illuminated for evening events.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing event wayfinding',
    steps: [
      { text: 'Walk the event site from each entry point. Can you navigate to all key areas using signage alone?' },
      { text: 'Check sign size, font, and contrast.', measurement: { target: 'Letter height', acceptable: 'Minimum 30mm for directional signs', unit: 'mm' } },
      { text: 'Check for accessible event maps at each entrance.' },
      { text: 'Test digital wayfinding with a screen reader.' },
      { text: 'Check signage for accessible toilets, first aid, quiet rooms, and exits.' },
      { text: 'Verify signage is illuminated for low-light conditions.' }
    ],
    tools: ['Tape measure', 'Camera', 'Screen reader'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Event providers must ensure attendees with disability can navigate the event safely and independently.' },
    related: [{ code: 'AS1428.1', relevance: 'Section 8 provides signage standards applicable to event environments.' }],
    plainEnglish: 'Your event signage must be large enough, clear enough, and consistent enough for people with vision impairment or cognitive disability to navigate independently.',
    complianceNote: 'Temporary events have the same DDA obligations as permanent venues. Wayfinding is a key compliance area.'
  },
  solutions: [
    {
      title: 'Create accessible event signage kit',
      description: 'Develop reusable signage for accessible events.',
      resourceLevel: 'low', costRange: '$200-800', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Design signage templates: 30mm+ letters, sans-serif, high contrast.', 'Create directional signs, area labels, and accessible facility indicators.', 'Print on weatherproof material.', 'Create large-print event map.', 'Brief wayfinding volunteers.', 'Place signs at every decision point during setup.']
    },
    {
      title: 'Digital wayfinding and staffed information',
      description: 'App-based navigation with trained staff at key points.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '4-6 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Develop accessible event map for app or website.', 'Add screen reader support and zoom.', 'Create QR codes at key locations linking to map.', 'Recruit and train wayfinding volunteers.', 'Provide volunteer identifiers (vests, badges).', 'Station at entrances, intersections, and accessible features.', 'Test with people with vision impairment pre-event.']
    },
    {
      title: 'Comprehensive accessible event environment',
      description: 'Full wayfinding system designed by accessibility specialist.',
      resourceLevel: 'high', costRange: '$8,000-25,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage event accessibility consultant.', 'Design comprehensive wayfinding plan.', 'Install tactile ground surface indicators on key routes.', 'Deploy Bluetooth beacons for app-based navigation.', 'Create tactile event map.', 'Design illuminated signage for evening events.', 'Train all volunteers in accessible wayfinding assistance.', 'Conduct pre-event walkthrough with disability advisors.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Music Festival', scenario: 'Attendees with vision impairment could not navigate between stages.', solution: 'Created high-contrast signage at every path junction. Deployed wayfinding volunteers with orange vests. Offered guided walks between stages.', outcome: 'Vision-impaired attendees navigated independently. Positive social media feedback.', cost: '$1,500', timeframe: '2 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'Complex venue with multiple buildings.', solution: 'Created accessible app-based map with screen reader support. Placed QR codes at all entrances and junctions. Trained staff at information desks.', outcome: 'Attendees with disability rated wayfinding highly. App used by 60% of all attendees.', cost: '$5,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Accessible Events Guide', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on accessible event planning including wayfinding.', isAustralian: true, isFree: true },
    { title: 'Vision Australia Event Access', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', description: 'Resources for making events accessible for people with vision impairment.', isAustralian: true, isFree: true }
  ],
  keywords: ['wayfinding', 'signage', 'event map', 'navigation', 'volunteers', 'accessible directions', 'digital map']
},

// ─── Entry 9: Event information and communication ───
{
  questionId: '6.3-PC-2',
  questionText: 'Is event information provided in multiple accessible formats?',
  moduleCode: '6.3',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Event information and communication',
  coveredQuestionIds: ['6.3-PC-3', '6.3-D-4', '6.3-D-5', '6.3-D-6', '6.3-D-10', '6.3-D-11'],
  summary: 'Event programs, schedules, and updates should be available in large print, digital, Easy Read, and audio formats. Real-time updates must reach attendees through visual displays, app notifications, and plain language announcements. Event apps must be accessibility tested.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Events are dynamic environments where information changes rapidly. If updates are only announced over PA, Deaf attendees miss them. If programs are only in standard print, people with low vision cannot read them. Multi-format information is essential.',
    quote: { text: 'I missed three schedule changes because they were only announced over the loudspeaker. I am Deaf. Nobody thought to put them on a screen.', attribution: 'Deaf attendee, conference feedback' }
  },
  tips: [
    { icon: 'FileText', text: 'Produce event programs in large print (18pt+), digital, and standard formats.', priority: 1 },
    { icon: 'Monitor', text: 'Display all PA announcements on screens as text.', priority: 2 },
    { icon: 'Smartphone', text: 'Push schedule changes via event app, SMS, and social media simultaneously.', priority: 3 },
    { icon: 'Type', text: 'Use plain language for all announcements: short sentences, clear instructions.', priority: 4 },
    { icon: 'Globe', text: 'Test event app with screen readers and keyboard navigation before launch.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing event communication',
    steps: [
      { text: 'Check event program: available in large print and digital?' },
      { text: 'Are PA announcements also displayed visually?' },
      { text: 'Test event app with VoiceOver/TalkBack: is it navigable?' },
      { text: 'Check update process: can information reach Deaf attendees?' },
      { text: 'Review language: is it plain and clear?' },
      { text: 'Is Easy Read version available for complex information?' }
    ],
    tools: ['Screen reader', 'Event program samples'],
    estimatedTime: '30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Event information must be accessible. Providing information in only one format may discriminate against people who cannot access that format.' },
    related: [{ code: 'WCAG', relevance: 'Event apps and websites must meet WCAG 2.1 AA.' }],
    plainEnglish: 'Provide event information in multiple formats so everyone can access it regardless of disability.',
    complianceNote: 'Test your event app before the event, not during. An inaccessible app cannot be fixed on the day.'
  },
  solutions: [
    {
      title: 'Multi-format event information',
      description: 'Produce programs and communications in accessible formats.',
      resourceLevel: 'low', costRange: '$100-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create large-print program (18pt, sans-serif).', 'Create digital version (accessible PDF or web page).', 'Set up visual display for PA announcements.', 'Establish SMS or social media channel for updates.', 'Brief all announcers on speaking clearly.', 'Have spare large-print programs at information desk.']
    },
    {
      title: 'Accessible event app and real-time communication',
      description: 'Deploy accessible event technology.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '4-8 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Select event app platform with accessibility features.', 'Test with screen readers before launch.', 'Configure push notifications for schedule changes.', 'Set up visual announcement displays.', 'Create Easy Read event guide.', 'Train event staff on multi-channel communication.', 'Test complete communication flow pre-event.']
    },
    {
      title: 'Comprehensive accessible event communications',
      description: 'Full multi-channel accessible communication system.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage event accessibility communications specialist.', 'Design multi-channel communication plan.', 'Build fully accessible event app.', 'Install visual display network across event site.', 'Create Braille and tactile program.', 'Produce audio program.', 'Deploy real-time captioning for all announcements.', 'Test with diverse disability group pre-event.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'Only standard print program. PA-only announcements.', solution: 'Created large-print and digital programs. Installed screen at registration showing announcements. SMS updates.', outcome: 'Deaf attendees received all updates. Vision-impaired attendees read program on their devices.', cost: '$400', timeframe: '1 week' },
    { businessType: 'event-venue', businessTypeLabel: 'Festival', scenario: 'Event app not screen-reader compatible.', solution: 'Engaged developer to fix app accessibility. Added push notifications. Created accessible web alternative for those without app.', outcome: 'Screen reader users navigated festival schedule independently. 40% higher app satisfaction.', cost: '$5,000', timeframe: '3 weeks' }
  ],
  resources: [
    { title: 'Accessible Events Toolkit', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Practical toolkit for accessible event communications.', isAustralian: true, isFree: true },
    { title: 'WCAG 2.1 Quick Reference', url: 'https://www.w3.org/WAI/WCAG21/quickref/', type: 'website', source: 'W3C', description: 'Standards for making event apps and websites accessible.', isFree: true }
  ],
  keywords: ['event program', 'large print', 'PA announcements', 'event app', 'schedule updates', 'plain language', 'multi-format']
},

// ─── Entry 10: Speaker and presenter accessibility ───
{
  questionId: '6.3-PC-4',
  questionText: 'Are speakers and presenters briefed on accessibility requirements?',
  moduleCode: '6.3',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Speaker and presenter accessibility',
  coveredQuestionIds: ['6.3-D-7', '6.3-D-9'],
  summary: 'Speakers must be briefed on using microphones consistently, describing visual content verbally, pacing for interpreters and captioners, providing slides in advance, and ensuring their content is accessible.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Even with perfect hearing loops and captioning, a speaker who does not use the microphone, speaks too fast for captioners, or does not describe visual slides creates barriers. Speaker briefings are the cheapest and most impactful accessibility investment for events.',
    quote: { text: 'The captioner was excellent but the speaker spoke so fast the captions were 30 seconds behind. A simple briefing would have fixed this.', attribution: 'Conference attendee, accessibility feedback' }
  },
  tips: [
    { icon: 'Megaphone', text: 'Brief all speakers to use the microphone at all times, even for "quick comments".', priority: 1 },
    { icon: 'Eye', text: 'Ask speakers to describe visual content: "This slide shows a graph with sales increasing from 100 to 500."', priority: 2 },
    { icon: 'Users', text: 'Ask speakers to pace their delivery for interpreters and captioners.', priority: 3 },
    { icon: 'FileText', text: 'Request slides 48 hours in advance for captioners and interpreters to prepare.', priority: 4 },
    { icon: 'Monitor', text: 'Ensure slides use minimum 24pt font with high contrast.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing speaker accessibility',
    steps: [
      { text: 'Is a speaker accessibility brief sent to all presenters?' },
      { text: 'Does it cover microphone use, visual description, pacing, and slide format?' },
      { text: 'Are slides requested in advance for captioners/interpreters?' },
      { text: 'Is a face-to-face or video briefing offered for keynotes?' },
      { text: 'Are speakers reminded at the venue before their session?' }
    ],
    tools: ['Speaker brief template', 'Checklist'],
    estimatedTime: '15 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Event organisers must ensure presentations are accessible, which includes briefing speakers on accessibility requirements.' },
    related: [{ code: 'WCAG', relevance: 'Presentation slides shared digitally should meet WCAG 2.1 AA.' }],
    plainEnglish: 'Brief your speakers on how to present accessibly. This is free and makes a significant difference.',
    complianceNote: 'Speaker briefings are an extremely low-cost intervention with high impact on accessibility.'
  },
  solutions: [
    {
      title: 'Create and send speaker accessibility brief',
      description: 'Develop a one-page brief for all speakers.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '2-3 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft one-page speaker accessibility guide.', 'Cover: microphone use, visual description, pacing, slide format, advance slides.', 'Send with speaker confirmation email.', 'Remind speakers on the day.', 'Brief session chairs to enforce microphone use.', 'Provide speaker guide in event kit.']
    },
    {
      title: 'Speaker training and accessible presentation support',
      description: 'Offer speaker training and check slides for accessibility.',
      resourceLevel: 'medium', costRange: '$500-2,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Create 15-minute speaker training video.', 'Offer optional 1:1 briefing for keynotes.', 'Review submitted slides for accessibility.', 'Provide feedback and template with accessible formatting.', 'Train session chairs on accessibility prompts.', 'Record and share best practice examples.', 'Follow up post-event with speaker feedback.']
    },
    {
      title: 'Comprehensive presenter accessibility program',
      description: 'Full program ensuring all presentations are accessible.',
      resourceLevel: 'high', costRange: '$3,000-10,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Develop mandatory speaker accessibility requirements.', 'Create accessible slide template with guidance.', 'Assign accessibility reviewer for all presentations.', 'Brief captioners and interpreters with advance slides.', 'Offer rehearsal with accessibility check.', 'Deploy real-time accessibility monitoring during sessions.', 'Collect audience accessibility feedback per session.', 'Publish accessible presentation guidelines for your industry.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'Speakers ignored microphones and spoke too fast.', solution: 'Created one-page brief. Sent with confirmation. Session chairs instructed to ensure mic use. Captioner received slides 48 hours ahead.', outcome: 'Captioning accuracy improved from 80% to 95%. Deaf attendees reported much better experience.', cost: '$0', timeframe: '3 hours' },
    { businessType: 'event-venue', businessTypeLabel: 'Industry Event', scenario: 'Slides had tiny text and no visual descriptions.', solution: 'Provided accessible slide template. Reviewed all presentations. Briefed speakers on describing visual content.', outcome: 'All slides readable from rear. Blind attendees followed content through descriptions.', cost: '$500', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Accessible Presentations Guide', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'How to create and deliver accessible presentations.', isAustralian: true, isFree: true },
    { title: 'W3C Accessible Slide Design', url: 'https://www.w3.org/WAI/teach-advocate/accessible-presentations/', type: 'guide', source: 'W3C', description: 'Guidelines for creating accessible presentation materials.', isFree: true }
  ],
  keywords: ['speaker', 'presenter', 'microphone', 'captioning', 'slides', 'visual description', 'pacing', 'briefing']
},

// ─── Entry 11: Hearing access at events ───
{
  questionId: '6.4-PC-1',
  questionText: 'Does your event provide hearing augmentation such as hearing loops or captioning?',
  moduleCode: '6.4',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Hearing access at events',
  coveredQuestionIds: ['6.4-D-1', '6.4-D-2', '6.4-D-3', '6.4-D-5', '6.4-D-6', '6.4-D-9'],
  summary: 'Hearing access at events includes hearing loops or portable systems, live captioning (CART), Auslan interpreters for key sessions, assistive listening devices for loan, and clear audio quality management across the event.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Events rely heavily on spoken content. Without hearing access, Deaf and hard-of-hearing attendees are excluded from the core experience. Live captioning and Auslan interpretation open up events to 3.6 million Australians with hearing loss.',
    statistic: { value: '3.6 million', context: 'Australians have hearing loss. At any large event, hundreds of attendees will benefit from hearing access provisions.', source: 'Hearing Australia' }
  },
  tips: [
    { icon: 'Ear', text: 'Provide hearing loops or portable systems in main presentation areas.', priority: 1 },
    { icon: 'Monitor', text: 'Offer live captioning (CART) on screens visible from Deaf seating.', priority: 2 },
    { icon: 'Users', text: 'Book Auslan interpreters for keynotes and key sessions.', detail: 'Book through your state Deaf society at least 4 weeks ahead.', priority: 3 },
    { icon: 'Headphones', text: 'Have assistive listening devices available at registration for loan.', priority: 4 },
    { icon: 'Volume2', text: 'Manage audio quality: test levels, reduce echo, minimise background noise.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing hearing access at events',
    steps: [
      { text: 'Check hearing loops: installed, tested, working, and signed.' },
      { text: 'Check captioning: visible from Deaf seating, synchronised with speaker.' },
      { text: 'Check Auslan provision: interpreter positioned in well-lit area visible from front rows.' },
      { text: 'Check assistive listening devices: available, charged, instructions provided.' },
      { text: 'Test audio levels from all seating areas.' },
      { text: 'Check whether hearing access is promoted in event marketing.' }
    ],
    tools: ['Hearing loop tester', 'Sound level meter', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'AS1428.5', section: 'Hearing augmentation', requirement: 'Hearing augmentation is required in venues with amplified sound systems.' },
    related: [
      { code: 'DDA', relevance: 'Failing to provide hearing access at events may discriminate against Deaf and hard-of-hearing attendees.' }
    ],
    plainEnglish: 'If your event uses microphones and speakers, you need hearing access for people who cannot hear the standard audio.',
    complianceNote: 'Live captioning (CART) can be provided remotely at lower cost. Consider this for events where on-site captioners are unavailable.'
  },
  solutions: [
    {
      title: 'Portable hearing access for events',
      description: 'Deploy portable hearing systems and captioning.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Hire portable hearing loop for main stage/room.', 'Book remote captioning service (CART).', 'Set up captioning display visible from front rows.', 'Purchase or hire 5-10 assistive listening receivers.', 'Display hearing loop symbol at equipped areas.', 'Brief AV team on hearing access requirements.']
    },
    {
      title: 'Comprehensive hearing access program',
      description: 'Full hearing access including loops, captioning, and Auslan.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '4-6 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Install or hire hearing loops for all session rooms.', 'Book live captioning for all main sessions.', 'Book Auslan interpreters for keynotes (in pairs for sessions over 30 minutes).', 'Set up captioning screens at front of each room.', 'Purchase assistive listening device fleet.', 'Create designated Deaf seating area with good sightlines.', 'Promote hearing access in event marketing.']
    },
    {
      title: 'Best-practice hearing access',
      description: 'Industry-leading hearing access for large events.',
      resourceLevel: 'high', costRange: '$15,000-40,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage hearing access consultant.', 'Design hearing access plan for entire event.', 'Install permanent or semi-permanent loops.', 'Deploy real-time captioning across all sessions.', 'Book Auslan interpreters for all sessions.', 'Create communication access hub at event.', 'Offer personal captioning devices.', 'Survey Deaf and hard-of-hearing attendees post-event.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'No hearing access. Deaf attendees left early.', solution: 'Hired portable loop. Booked remote captioning. Reserved front rows for Deaf attendees. Promoted in registration.', outcome: 'Deaf attendance doubled next year. Captioning used by non-English speakers too.', cost: '$3,000', timeframe: '3 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Music Festival', scenario: 'No hearing support at spoken stages.', solution: 'Installed hearing loop at main stage. Provided Auslan interpreter for headline acts. Captioned comedy tent.', outcome: 'Deaf community promoted the festival. National media coverage of accessibility.', cost: '$8,000', timeframe: '4 weeks' }
  ],
  resources: [
    { title: 'Hearing Australia Events Guide', url: 'https://www.hearing.com.au/', type: 'guide', source: 'Hearing Australia', description: 'Hearing access guidance for event organisers.', isAustralian: true, isFree: true },
    { title: 'CART Providers Australia', url: 'https://www.mediaaccess.org.au/', type: 'guide', source: 'Media Access Australia', description: 'Directory and guidance for live captioning services.', isAustralian: true, isFree: true }
  ],
  keywords: ['hearing loop', 'captioning', 'CART', 'Auslan', 'assistive listening', 'hearing access', 'Deaf', 'interpreter']
},

// ─── Entry 12: Vision access at events ───
{
  questionId: '6.4-PC-2',
  questionText: 'Does your event provide supports for people who are blind or have low vision?',
  moduleCode: '6.4',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Vision access at events',
  coveredQuestionIds: ['6.4-D-4', '6.4-D-11', '6.4-D-12'],
  summary: 'Vision access includes audio description of visual content, large-print programs, guided orientation walks, touch tours, lighting management for low vision, and guide dog rest and relief areas.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Events are highly visual. Stage shows, presentations, exhibitions, and signage all rely on sight. Without audio description, guided support, and tactile alternatives, blind and low-vision attendees miss the core content.',
    statistic: { value: '575,000+', context: 'Australians are blind or have low vision. Many are active event attendees with the right support.', source: 'Vision Australia' }
  },
  tips: [
    { icon: 'Headphones', text: 'Provide audio description for visual performances and exhibitions.', priority: 1 },
    { icon: 'Type', text: 'Print programs in large print (18pt minimum, sans-serif).', priority: 2 },
    { icon: 'Hand', text: 'Offer touch tours or familiarisation walks before the event.', detail: 'Let blind attendees explore the venue layout before crowds arrive.', priority: 3 },
    { icon: 'Lightbulb', text: 'Manage lighting: avoid sudden blackouts, maintain path lighting, minimise glare.', priority: 4 },
    { icon: 'Heart', text: 'Provide guide dog rest and relief areas with water.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing vision access',
    steps: [
      { text: 'Is audio description provided for visual performances?' },
      { text: 'Are programs available in large print and digital format?' },
      { text: 'Are touch tours or orientation walks offered?' },
      { text: 'Is lighting managed to avoid sudden blackouts and glare?' },
      { text: 'Is there a guide dog rest and relief area?' },
      { text: 'Are event staff trained to guide blind attendees?' }
    ],
    tools: ['Checklist', 'Camera'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Event providers must make reasonable adjustments for people with vision impairment.' },
    related: [{ code: 'DDA', relevance: 'Section 9 protects the right of guide dog users to access all public venues.' }],
    plainEnglish: 'Provide alternatives for visual content (audio description, large print) and support for navigation (orientation walks, staff assistance).',
    complianceNote: 'Touch tours and orientation walks are low-cost, high-impact accessibility features unique to events.'
  },
  solutions: [
    {
      title: 'Basic vision access provisions',
      description: 'Large print, guide dog area, and staff guidance.',
      resourceLevel: 'low', costRange: '$100-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Print 50 copies of large-print program.', 'Designate guide dog relief area with water.', 'Train 3-5 staff in sighted guide technique.', 'Offer pre-event orientation walk for blind attendees.', 'Ensure all event materials are available digitally.', 'Brief front-of-house on proactive assistance.']
    },
    {
      title: 'Audio description and structured support',
      description: 'Audio description and touch tours.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '4-6 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Book audio describer for key performances.', 'Provide headsets for audio description.', 'Create tactile event map.', 'Schedule structured touch tours.', 'Manage lighting for low-vision comfort.', 'Train volunteers in sighted guide.', 'Promote vision access in event marketing.']
    },
    {
      title: 'Comprehensive vision access program',
      description: 'Full vision access including technology and specialist support.',
      resourceLevel: 'high', costRange: '$8,000-25,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage vision access specialist.', 'Develop audio description scripts for all visual content.', 'Create tactile models of key exhibits or stages.', 'Deploy indoor navigation app for blind users.', 'Install tactile wayfinding strips.', 'Provide Braille program.', 'Recruit vision access volunteers.', 'Survey blind and low-vision attendees.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Arts Festival', scenario: 'No vision access for visual art exhibitions.', solution: 'Created audio guides for exhibitions. Offered touch tours with artist. Large-print labels. Guide dog area.', outcome: 'Blind arts enthusiasts attended. Featured in Arts Access newsletter.', cost: '$3,000', timeframe: '4 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Outdoor Festival', scenario: 'Blind attendees could not navigate site.', solution: 'Offered pre-event orientation walks. Trained wayfinding volunteers in sighted guide. Created audio site guide via app.', outcome: 'Blind attendees reported feeling welcome and independent.', cost: '$1,500', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Arts Access Australia', url: 'https://artsaccess.com.au/', type: 'guide', source: 'Arts Access Australia', description: 'Resources on vision access at arts and cultural events.', isAustralian: true, isFree: true },
    { title: 'Vision Australia Events', url: 'https://www.visionaustralia.org/', type: 'guide', source: 'Vision Australia', description: 'How to make events accessible for blind and low-vision people.', isAustralian: true, isFree: true }
  ],
  keywords: ['audio description', 'large print', 'touch tour', 'guide dog', 'orientation', 'blind', 'low vision', 'tactile']
},

// ─── Entry 13: Sensory safety and neurodivergent access ───
{
  questionId: '6.4-PC-3',
  questionText: 'Does your event provide sensory management strategies for neurodivergent attendees?',
  moduleCode: '6.4',
  moduleGroup: 'events',
  diapCategory: 'information-communication-marketing',
  title: 'Sensory safety and neurodivergent access',
  coveredQuestionIds: ['6.4-D-7', '6.4-D-8', '6.4-D-10'],
  summary: 'Sensory safety for neurodivergent attendees includes quiet rooms, sensory maps warning of loud or bright areas, noise warnings before pyrotechnics, fragrance-free policies, and availability of earplugs and sunglasses.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Events can be overwhelming for autistic people and others with sensory processing differences. Loud music, flashing lights, strong smells, and crowds can cause sensory overload, meltdowns, or shutdowns. Sensory safety measures make the difference between inclusion and exclusion.',
    statistic: { value: '1 in 70', context: 'Australians are autistic. Many more have ADHD, sensory processing disorder, or anxiety that makes typical event environments challenging.', source: 'Autism CRC' }
  },
  tips: [
    { icon: 'Volume2', text: 'Create a quiet room: low lighting, minimal noise, comfortable seating, away from main areas.', priority: 1 },
    { icon: 'Map', text: 'Publish a sensory map showing noise levels, lighting intensity, and quiet zones.', priority: 2 },
    { icon: 'AlertTriangle', text: 'Warn attendees before loud noises (pyrotechnics, sirens) with at least 30 seconds notice on screens.', priority: 3 },
    { icon: 'Shield', text: 'Implement a fragrance-free or fragrance-reduced policy for indoor events.', priority: 4 },
    { icon: 'Glasses', text: 'Provide free earplugs and tinted sunglasses at information desks.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing sensory safety',
    steps: [
      { text: 'Is a quiet room available and clearly signed?' },
      { text: 'Is a sensory map or guide published?' },
      { text: 'Are noise warnings given before pyrotechnics or sudden loud sounds?' },
      { text: 'Is there a fragrance policy for indoor areas?' },
      { text: 'Are earplugs and sunglasses available for free?' },
      { text: 'Are staff trained to assist someone experiencing sensory overload?' }
    ],
    tools: ['Sound level meter app', 'Checklist'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must make reasonable adjustments for people with disability, including sensory and neurological conditions.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 30 recognises the right to participate in cultural and recreational activities.' }],
    plainEnglish: 'Provide sensory safety features so neurodivergent attendees can participate comfortably. A quiet room and sensory map are minimum provisions.',
    complianceNote: 'Sensory safety is rapidly becoming an industry standard for events. Early adoption positions your event as inclusive.'
  },
  solutions: [
    {
      title: 'Basic sensory safety provisions',
      description: 'Set up quiet room and provide sensory aids.',
      resourceLevel: 'low', costRange: '$100-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Designate a quiet room: low lighting, comfortable seating, minimal decoration.', 'Create simple sensory map showing noise zones.', 'Purchase bulk earplugs and sunglasses for free distribution.', 'Brief staff on sensory overload: give space, offer quiet room, speak calmly.', 'Post noise warnings on screens 30 seconds before loud events.', 'Add sensory information to event marketing.']
    },
    {
      title: 'Structured sensory management',
      description: 'Comprehensive sensory program with mapped zones and trained staff.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Create detailed sensory map with noise levels measured in dB.', 'Equip quiet room with weighted blankets, fidget tools, dim lighting.', 'Implement fragrance-reduced policy for indoor areas.', 'Train all staff and volunteers on neurodivergent support.', 'Create social story for the event.', 'Offer early entry for sensory familiarisation.', 'Promote sensory features in accessible marketing.']
    },
    {
      title: 'Sensory-inclusive event design',
      description: 'Event designed from the ground up for sensory inclusion.',
      resourceLevel: 'high', costRange: '$5,000-20,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage autism and sensory inclusion consultant.', 'Design event layout with sensory zones.', 'Create professional sensory guide.', 'Build multi-room quiet space with different environments.', 'Schedule sensory-friendly sessions with reduced stimuli.', 'Deploy noise monitoring with real-time display.', 'Engage autistic advisors in event design.', 'Evaluate with post-event sensory access survey.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Music Festival', scenario: 'Autistic attendees overwhelmed by noise and crowds.', solution: 'Created quiet tent with beanbags and dim lighting. Published sensory map. Free earplugs at entry. Warned before pyrotechnics.', outcome: 'Autistic attendees and families attended for the first time. Social media praise.', cost: '$800', timeframe: '1 week' },
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'No sensory considerations at all.', solution: 'Designated quiet room near main hall. Fragrance-reduced policy. Sensory guide published. Staff trained.', outcome: 'Neurodivergent professionals could attend full day. Positive feedback.', cost: '$300', timeframe: '3 days' }
  ],
  resources: [
    { title: 'Amaze Autism-Friendly Events', url: 'https://www.amaze.org.au/', type: 'guide', source: 'Amaze', description: 'Guide to making events autism-friendly.', isAustralian: true, isFree: true },
    { title: 'Autism CRC', url: 'https://www.autismcrc.com.au/', type: 'guide', source: 'Autism CRC', description: 'Research and resources on autism inclusion.', isAustralian: true, isFree: true }
  ],
  keywords: ['sensory', 'quiet room', 'autism', 'neurodivergent', 'earplugs', 'sensory map', 'fragrance', 'overload']
},

// ─── Entry 14: Staff, volunteers and accessibility roles ───
{
  questionId: '6.5-PC-1',
  questionText: 'Have event staff and volunteers received disability awareness training?',
  moduleCode: '6.5',
  moduleGroup: 'events',
  diapCategory: 'customer-service',
  title: 'Staff, volunteers and accessibility roles',
  coveredQuestionIds: ['6.5-D-1', '6.5-D-10', '6.5-D-14'],
  summary: 'All event staff and volunteers need disability awareness training. Designated accessibility stewards should be identifiable, trained to assist with specific needs, and empowered to make decisions. Security and entry staff need particular focus.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Event staff and volunteers are the frontline of accessibility. Untrained staff create barriers: blocking wheelchair paths, refusing guide dogs, not knowing about accessible features. Trained staff transform the experience.',
    statistic: { value: '73%', context: 'of people with disability say staff attitudes affect their event experience more than physical accessibility.', source: 'AND Customer Insights' }
  },
  tips: [
    { icon: 'GraduationCap', text: 'Include disability awareness in all volunteer and staff briefings.', priority: 1 },
    { icon: 'UserCheck', text: 'Designate accessibility stewards identifiable by a specific lanyard or vest.', priority: 2 },
    { icon: 'Shield', text: 'Train security staff specifically on disability-related scenarios.', detail: 'Assistance animals, wheelchair users, people with invisible disability, sensory overload situations.', priority: 3 },
    { icon: 'Phone', text: 'Give all staff a contact number for the accessibility coordinator.', priority: 4 },
    { icon: 'Heart', text: 'Empower staff to make accessibility decisions without escalation for simple requests.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing event staffing for accessibility',
    steps: [
      { text: 'Is disability awareness included in staff/volunteer briefings?' },
      { text: 'Are accessibility stewards designated and identifiable?' },
      { text: 'Have security staff been trained on disability scenarios?' },
      { text: 'Do all staff know who the accessibility coordinator is and how to reach them?' },
      { text: 'Can staff direct attendees to accessible features (toilets, quiet room, hearing loop)?' }
    ],
    tools: ['Briefing materials', 'Staff roster'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 122', requirement: 'Event organisers have vicarious liability for discriminatory acts of staff and volunteers. Training demonstrates due diligence.' },
    related: [{ code: 'DDA', relevance: 'Section 9 requires staff to allow assistance animals.' }],
    plainEnglish: 'Train your event team on disability awareness. Make sure they know what accessible features exist and how to help.',
    complianceNote: 'A brief 15-minute disability awareness session for volunteers can prevent most accessibility incidents at events.'
  },
  solutions: [
    {
      title: 'Add accessibility to volunteer briefings',
      description: 'Include a 15-minute disability awareness segment in briefings.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 hours to prepare', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create 15-minute disability awareness segment.', 'Cover: assistance animals, wheelchair assistance, communication tips, accessible features.', 'Designate 2-3 accessibility stewards per shift.', 'Provide lanyard or badge for stewards.', 'Print reference card with accessibility coordinator contact.', 'Brief security staff separately on specific scenarios.']
    },
    {
      title: 'Dedicated accessibility team',
      description: 'Recruit and train a dedicated accessibility team.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Recruit accessibility volunteers with disability awareness.', 'Provide 2-hour training covering all disability types and event features.', 'Position at entry, information, and key decision points.', 'Equip with radio and accessibility information pack.', 'Create escalation pathway to accessibility coordinator.', 'Debrief team after event for improvements.', 'Recognise contributions.']
    },
    {
      title: 'Professional event accessibility staffing',
      description: 'Comprehensive staffing program with professional training.',
      resourceLevel: 'high', costRange: '$5,000-15,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage event accessibility training provider.', 'Train all staff and volunteers (online pre-event, in-person on-day).', 'Recruit paid accessibility coordinators.', 'Deploy accessibility response team with radios.', 'Create accessibility operations centre for real-time support.', 'Implement mystery shopping by people with disability.', 'Collect and act on accessibility feedback.', 'Publish accessibility staffing commitments.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Festival', scenario: 'Volunteers did not know about quiet room or accessible toilets.', solution: 'Added 15-minute accessibility brief to volunteer induction. Created laminated reference cards. Designated accessibility stewards.', outcome: 'Attendees with disability report faster, more helpful assistance.', cost: '$100', timeframe: '2 hours' },
    { businessType: 'event-venue', businessTypeLabel: 'Sports Event', scenario: 'Security refused entry to assistance dog.', solution: 'Trained all security on assistance animal rights. Created disability scenario cards. Accessibility stewards at every gate.', outcome: 'Zero assistance animal incidents since. Disability community trust restored.', cost: '$500', timeframe: '1 week' }
  ],
  resources: [
    { title: 'AND Event Accessibility Guide', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Training resources for event staff on disability awareness.', isAustralian: true, isFree: true },
    { title: 'Guide Dogs Event Access', url: 'https://www.guidedogs.com.au/', type: 'guide', source: 'Guide Dogs Australia', description: 'Resources on assistance animals at events.', isAustralian: true, isFree: true }
  ],
  keywords: ['staff training', 'volunteers', 'accessibility steward', 'security', 'disability awareness', 'event team']
},

// ─── Entry 15: Priority access, food and service animals ───
{
  questionId: '6.5-PC-2',
  questionText: 'Does your event offer priority access for people with disability?',
  moduleCode: '6.5',
  moduleGroup: 'events',
  diapCategory: 'customer-service',
  title: 'Priority access, food and service animals',
  coveredQuestionIds: ['6.5-PC-3', '6.5-PC-4', '6.5-D-7', '6.5-D-8', '6.5-D-3', '6.5-D-12'],
  summary: 'Priority access includes fast-track entry, Companion Card acceptance, accessible food service with dietary accommodation, and service animal provisions including relief areas and water.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Standing in long queues is not just uncomfortable for people with disability; for some, it is impossible. People with chronic pain, fatigue conditions, or mobility impairment may not be able to stand for extended periods. Priority access is a reasonable adjustment.',
    quote: { text: 'I have a condition that means I cannot stand for more than 5 minutes. Without priority entry, I cannot attend events at all. It is not a luxury; it is a necessity.', attribution: 'Event attendee with chronic fatigue' }
  },
  tips: [
    { icon: 'DoorOpen', text: 'Offer priority entry for people with disability and their companions.', priority: 1 },
    { icon: 'CreditCard', text: 'Accept the Companion Card for free companion admission.', priority: 2 },
    { icon: 'Heart', text: 'Ensure food vendors can accommodate dietary needs related to disability.', detail: 'Texture modification, allergen awareness, assistance with carrying food.', priority: 3 },
    { icon: 'Shield', text: 'Welcome assistance animals with water and relief areas.', priority: 4 },
    { icon: 'Users', text: 'Train food service staff to assist: describe items, carry trays, accommodate seating.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing priority access and services',
    steps: [
      { text: 'Is priority entry available and promoted?' },
      { text: 'Is the Companion Card accepted?' },
      { text: 'Can food vendors accommodate disability-related dietary needs?' },
      { text: 'Is there an assistance animal relief area with water?' },
      { text: 'Are food service areas wheelchair accessible with lowered counters?' },
      { text: 'Can staff assist with carrying food and finding seating?' }
    ],
    tools: ['Checklist'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Sections 9 and 24', requirement: 'Assistance animals must be permitted. Priority access is a reasonable adjustment for people who cannot queue.' },
    related: [{ code: 'DDA', relevance: 'Companion Card acceptance removes financial barriers to participation.' }],
    plainEnglish: 'Offer priority entry, accept the Companion Card, accommodate dietary needs, and welcome assistance animals.',
    complianceNote: 'Priority access systems should be discreet and dignified. Avoid requiring people to publicly disclose or prove their disability.'
  },
  solutions: [
    {
      title: 'Establish priority access and basic services',
      description: 'Set up priority entry and assistance animal provisions.',
      resourceLevel: 'low', costRange: '$0-300', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create priority entry lane at main gates.', 'Register as Companion Card affiliate.', 'Brief food vendors on dietary accommodation.', 'Set up assistance animal relief area with water and waste bags.', 'Train entry staff on priority access process.', 'Promote all accessible services in event marketing.']
    },
    {
      title: 'Comprehensive accessible event services',
      description: 'Full service program covering all attendee needs.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Design accessible food service areas with lowered counters.', 'Require all food vendors to list allergens and offer assistance.', 'Create accessible picnic area with wheelchair-height tables.', 'Implement wristband system for priority access.', 'Set up assistance animal water stations at multiple locations.', 'Train all staff on accessible service delivery.', 'Create accessibility information on event website.']
    },
    {
      title: 'Best-practice accessible event experience',
      description: 'Industry-leading accessible event services.',
      resourceLevel: 'high', costRange: '$5,000-20,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage event accessibility consultant.', 'Design end-to-end accessible attendee journey.', 'Create dedicated accessible services hub.', 'Deploy personal assistance team for attendees needing support.', 'Create accessible VIP experience for Companion Card holders.', 'Design assistance animal lounge with amenities.', 'Survey attendees with disability post-event.', 'Publish accessibility services report.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Music Festival', scenario: 'No priority entry. Wheelchair users waited in long queues in sun.', solution: 'Created accessible entry lane. Accepted Companion Card. Set up shaded waiting area. Assistance dog relief zone.', outcome: 'Queue-related complaints eliminated. Companion Card community promotes festival.', cost: '$200', timeframe: '1 week' },
    { businessType: 'event-venue', businessTypeLabel: 'Food Festival', scenario: 'No dietary accommodation or food assistance.', solution: 'Required all vendors to display allergens. Trained volunteers to assist with food carrying. Created accessible dining area.', outcome: 'Attendees with disability could enjoy food festival fully. Vendors reported positive feedback.', cost: '$500', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Companion Card', url: 'https://www.companioncard.gov.au/', type: 'website', source: 'Australian Government', description: 'Registration and information for Companion Card affiliates.', isAustralian: true, isFree: true },
    { title: 'Assistance Animals DDA', url: 'https://humanrights.gov.au/', type: 'guide', source: 'AHRC', description: 'Rights of assistance animals at events and venues.', isAustralian: true, isFree: true }
  ],
  keywords: ['priority access', 'Companion Card', 'food service', 'dietary', 'assistance animal', 'guide dog', 'queue']
},

// ─── Entry 16: Emergency plans and safety ───
{
  questionId: '6.5-PC-5',
  questionText: 'Does your event have an accessible emergency plan?',
  moduleCode: '6.5',
  moduleGroup: 'events',
  diapCategory: 'customer-service',
  title: 'Emergency plans and safety',
  coveredQuestionIds: ['6.5-D-13', '6.5-D-15', '6.5-D-16'],
  summary: 'Accessible emergency plans must account for wheelchair evacuation, visual and audible alarms, assembly points on accessible routes, accessible security screening, and protocols for assisting distressed attendees including those experiencing sensory overload or mental health crises.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'In an emergency, people with disability face the greatest risk. Wheelchair users cannot use stairs. Deaf people may not hear alarms. Blind people lose orientation in crowds. Autistic people may freeze. Your emergency plan must specifically address these scenarios.',
    statistic: { value: '50%', context: 'of emergency deaths in public venues involve people with disability or older adults who could not evacuate in time.', source: 'Australian Institute for Disaster Resilience' }
  },
  tips: [
    { icon: 'AlertTriangle', text: 'Include wheelchair evacuation procedures in your emergency plan (evac chairs, refuge areas).', priority: 1 },
    { icon: 'Zap', text: 'Ensure both visual (strobe) and audible alarms at all event areas.', priority: 2 },
    { icon: 'MapPin', text: 'Locate assembly points on accessible routes.', priority: 3 },
    { icon: 'Shield', text: 'Make security screening accessible: separate line for wheelchair users, communication support, sensitivity to invisible disability.', priority: 4 },
    { icon: 'Heart', text: 'Train staff on supporting distressed attendees: sensory overload, panic attacks, medical episodes.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing emergency accessibility',
    steps: [
      { text: 'Does the emergency plan specifically address people with disability?' },
      { text: 'Are evacuation chairs available and staff trained to use them?' },
      { text: 'Are both visual and audible alarms installed?' },
      { text: 'Are assembly points on accessible routes?' },
      { text: 'Is security screening accessible for wheelchair users and people with invisible disability?' },
      { text: 'Are staff trained on assisting distressed attendees?' },
      { text: 'Has the plan been tested with people with disability?' }
    ],
    tools: ['Emergency plan', 'Site map', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'NCC', section: 'Part E', requirement: 'Emergency provisions must include accessible egress and refuge areas.' },
    related: [
      { code: 'DDA', relevance: 'Failure to plan for emergency evacuation of people with disability may constitute discrimination.' },
      { code: 'AS1428.1', relevance: 'Accessible paths of travel requirements apply to emergency egress routes.' }
    ],
    plainEnglish: 'Your emergency plan must include specific procedures for evacuating and supporting people with disability.',
    complianceNote: 'Regular drills should include disability scenarios. A plan that has never been tested with wheelchair users is untested.'
  },
  solutions: [
    {
      title: 'Update emergency plan for accessibility',
      description: 'Add disability-specific procedures to existing plan.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Review emergency plan for disability-specific procedures.', 'Add wheelchair evacuation protocol.', 'Identify refuge areas on each level.', 'Ensure assembly points are on accessible paths.', 'Brief security on accessible screening.', 'Train first aid team on disability scenarios.']
    },
    {
      title: 'Accessible emergency infrastructure',
      description: 'Install emergency equipment and conduct accessible drills.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '2-4 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Purchase evacuation chairs for multi-level venues.', 'Install visual alarm strobes at all event areas.', 'Train designated staff on evacuation chair use.', 'Conduct accessible emergency drill with disability participants.', 'Train security on accessible screening protocols.', 'Create distressed attendee support procedure.', 'Review and update for each event.']
    },
    {
      title: 'Comprehensive accessible emergency management',
      description: 'Full emergency accessibility program designed by specialist.',
      resourceLevel: 'high', costRange: '$8,000-25,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage emergency accessibility consultant.', 'Design accessible emergency plan for your specific venue.', 'Install comprehensive visual alarm system.', 'Create Personal Emergency Evacuation Plans (PEEPs) process for attendees.', 'Conduct full-scale accessible emergency drill.', 'Train all staff including scenario exercises.', 'Deploy accessible emergency communication system.', 'Review after every event.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Stadium', scenario: 'Emergency plan did not address wheelchair evacuation from upper levels.', solution: 'Purchased evacuation chairs. Trained 20 staff. Identified refuge areas. Conducted drill with wheelchair users.', outcome: 'Successfully evacuated wheelchair users in drill within acceptable timeframe.', cost: '$5,000', timeframe: '4 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Conference Centre', scenario: 'No accessible security screening.', solution: 'Created separate accessible screening lane. Trained security on invisible disability. Sensitivity protocol for pat-downs.', outcome: 'Zero complaints about screening. Attendees with disability feel respected.', cost: '$200', timeframe: '1 week' }
  ],
  resources: [
    { title: 'Emergency Evacuation for People with Disability', url: 'https://humanrights.gov.au/', type: 'guide', source: 'AHRC', description: 'Guidance on accessible emergency planning.', isAustralian: true, isFree: true },
    { title: 'AIDR Inclusive Emergency Planning', url: 'https://www.aidr.org.au/', type: 'guide', source: 'Australian Institute for Disaster Resilience', description: 'Resources on disability-inclusive emergency management.', isAustralian: true, isFree: true }
  ],
  keywords: ['emergency', 'evacuation', 'wheelchair', 'alarm', 'security screening', 'distressed', 'safety', 'PEEP']
},

// ─── Entry 17: Feedback, re-entry and accommodation follow-through ───
{
  questionId: '6.5-D-2',
  questionText: 'Does your event collect and act on accessibility feedback?',
  moduleCode: '6.5',
  moduleGroup: 'events',
  diapCategory: 'customer-service',
  title: 'Feedback, re-entry and accommodation follow-through',
  coveredQuestionIds: ['6.5-D-4', '6.5-D-5', '6.5-D-6', '6.5-D-9', '6.5-D-11', '6.5-D-17'],
  summary: 'Collecting and acting on accessibility feedback, flexible re-entry policies for medical or sensory needs, clear lost property procedures, and following through on pre-event accommodation requests all contribute to a complete accessible event experience.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'The event experience extends beyond the main program. If a person with sensory overload leaves for a break and cannot re-enter, they have paid for an event they cannot finish. If pre-event accommodation requests are not followed through, trust is broken. Feedback drives improvement.',
    quote: { text: 'I requested Auslan interpretation when I registered. On the day, there was no interpreter. They said they forgot. That is not acceptable.', attribution: 'Deaf attendee, post-event feedback' }
  },
  tips: [
    { icon: 'MessageSquare', text: 'Collect accessibility feedback during and after the event via accessible survey.', priority: 1 },
    { icon: 'DoorOpen', text: 'Allow re-entry for attendees who need medical, sensory, or assistance animal breaks.', priority: 2 },
    { icon: 'ClipboardList', text: 'Track all pre-event accommodation requests and confirm delivery on the day.', priority: 3 },
    { icon: 'Package', text: 'Ensure lost property is accessible: lowered counter, clear signage, assistance available.', priority: 4 },
    { icon: 'TrendingUp', text: 'Publish an accessibility report after major events showing what worked and what will improve.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing feedback and follow-through',
    steps: [
      { text: 'Is an accessible feedback mechanism available during and after the event?' },
      { text: 'Is re-entry permitted for medical, sensory, or assistance animal needs?' },
      { text: 'Are pre-event accommodation requests tracked and confirmed?' },
      { text: 'Is lost property accessible?' },
      { text: 'Is a post-event accessibility report produced?' },
      { text: 'Are feedback results used to improve the next event?' }
    ],
    tools: ['Feedback form', 'Accommodation tracker'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers must follow through on accommodation commitments. Failure to deliver requested adjustments may constitute discrimination.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 21 requires access to information and communication through forms of choice.' }],
    plainEnglish: 'Follow through on accessibility commitments. Allow flexible re-entry. Collect and act on feedback.',
    complianceNote: 'A commitment to provide accessibility that is not delivered on the day is worse than no commitment, as it sets expectations that are not met.'
  },
  solutions: [
    {
      title: 'Basic feedback and re-entry',
      description: 'Set up feedback collection and re-entry policy.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create accessible online feedback form (screen reader compatible).', 'Implement re-entry wristband for attendees with disability.', 'Create accommodation request tracking spreadsheet.', 'Assign someone to confirm each request is delivered on the day.', 'Collect feedback at information desk.', 'Review all feedback within 2 weeks of event.']
    },
    {
      title: 'Structured accessibility management system',
      description: 'Formal tracking and reporting system.',
      resourceLevel: 'medium', costRange: '$1,000-5,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Deploy accommodation request management system.', 'Create day-of-event verification checklist.', 'Set up multi-channel feedback (form, SMS, in-person).', 'Implement formal re-entry policy with clear communication.', 'Produce post-event accessibility report.', 'Share report with disability advisory group.', 'Present improvements plan for next event.']
    },
    {
      title: 'Comprehensive accessible event evaluation',
      description: 'Full evaluation and continuous improvement program.',
      resourceLevel: 'high', costRange: '$5,000-15,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage event accessibility evaluator.', 'Deploy real-time accessibility feedback system.', 'Conduct post-event focus groups with attendees with disability.', 'Produce detailed accessibility evaluation report.', 'Benchmark against accessible event standards.', 'Develop multi-event improvement plan.', 'Publish report publicly.', 'Invite disability community to help plan next event.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Conference', scenario: 'Pre-event accommodation requests not tracked. Several missed on the day.', solution: 'Created request tracking spreadsheet. Assigned coordinator to verify each on day. Follow-up call to each requestor.', outcome: 'All accommodations delivered. Attendee satisfaction with accessibility increased 40%.', cost: '$0', timeframe: '1 week' },
    { businessType: 'event-venue', businessTypeLabel: 'Festival', scenario: 'No re-entry for sensory breaks.', solution: 'Implemented wristband re-entry for anyone needing a medical, sensory, or assistance animal break. Quiet exit and re-entry point.', outcome: 'Attendees with sensory needs stay for full event. Positive community feedback.', cost: '$50', timeframe: '1 day' }
  ],
  resources: [
    { title: 'Accessible Events Post-Event Guide', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Guidance on collecting and acting on accessibility feedback.', isAustralian: true, isFree: true },
    { title: 'AHRC Events Accessibility', url: 'https://humanrights.gov.au/', type: 'guide', source: 'AHRC', description: 'Rights and obligations for accessible event services.', isAustralian: true, isFree: true }
  ],
  keywords: ['feedback', 're-entry', 'accommodation', 'follow-through', 'survey', 'lost property', 'post-event', 'reporting']
},

];

export default eventsHelp;
