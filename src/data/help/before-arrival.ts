/**
 * Help Content: Before Arrival
 * Modules: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6
 */

import type { HelpContent } from './types';

export const beforeArrivalHelp: HelpContent[] = [
// Module 1.1: Pre-visit Information

// 1.1-F-1
{
  questionId: '1.1-F-1',
  questionText: 'Do you have accessibility information available for customers before they visit?',
  moduleCode: '1.1',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Pre-visit Accessibility Information',
  summary: 'Sharing accessibility information before customers visit helps them plan confidently and shows your venue is welcoming to everyone.',

  whyItMatters: {
    text: 'People with disabilities often spend significant time researching venues before visiting. Clear, detailed accessibility information reduces anxiety, prevents wasted trips, and demonstrates your commitment to inclusion.',
    statistic: {
      value: '4.4 million',
      context: 'Australians have a disability, that\'s 1 in 5 people. Many more travel with someone who does.',
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
      text: 'Create a dedicated accessibility page on your website.',
      detail: 'Do not bury this information in FAQs or a PDF download. Place a direct link in your main navigation menu or header. According to web usability research, users should be able to reach any key page within two clicks of the homepage. Label it clearly as "Accessibility" or "Access Information" so visitors do not have to guess where to look.',
      priority: 1
    },
    {
      icon: 'Camera',
      text: 'Include photos of your entrance, pathways, and accessible features.',
      detail: 'Photos let visitors assess whether your venue works for their specific needs far better than text alone. Photograph the accessible entrance (showing the door width and any threshold), the path from parking to the door, accessible toilets (showing grab rails and space), and any equipment like portable ramps or hearing loops. Use well-lit, uncluttered images taken at wheelchair height where possible.',
      priority: 2
    },
    {
      icon: 'ListChecks',
      text: 'Be specific, not vague. List actual features and measurements.',
      detail: '"We\'re accessible" is far less useful than "Level entry via Smith St, 900mm wide automatic doors, accessible bathroom on ground floor with left-hand transfer, hearing loop at reception." Include door widths in millimetres, distances in metres, number of steps, and ramp gradients where known. Specificity builds trust and prevents unpleasant surprises on arrival.',
      priority: 3
    },
    {
      icon: 'Phone',
      text: 'Provide contact details for accessibility questions.',
      detail: 'Some people prefer to call or email to discuss requirements that are hard to cover on a webpage. Include a direct phone number, email address, and mention of National Relay Service (NRS) availability for deaf or hard of hearing callers. State expected response times so customers know when to expect a reply.',
      priority: 4
    },
    {
      icon: 'RefreshCw',
      text: 'Keep information current and update when things change.',
      detail: 'Outdated information erodes trust and can result in wasted trips. Set a quarterly calendar reminder to review your accessibility page. Update immediately after renovations, equipment changes, or seasonal adjustments (e.g. temporary ramp removed for construction). Note the "last updated" date on the page so visitors know the information is current.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Audit your current accessibility information',
    steps: [
      { text: 'Open your website in a browser and search for "accessibility" or "access" using the site search or Ctrl+F. Note how many clicks it takes to reach relevant information from the homepage.' },
      { text: 'Check your main navigation menu and footer. Is there a clearly labelled link to accessibility information? If it is only in the footer or buried in a submenu, note this as a gap.' },
      { text: 'Review the content on the page against this checklist: entrance type (level, ramped, steps), door widths, parking (number of spaces, distance to entrance), accessible toilets (location, transfer side), hearing augmentation (loop, caption), quiet spaces, and assistance options.' },
      {
        text: 'Check for specific measurements rather than vague claims. Look for door widths, distances, step counts, and ramp gradients.',
        measurement: {
          target: 'Door width mentioned on page',
          acceptable: '850mm minimum clear opening (AS 1428.1 standard)',
          unit: 'mm'
        }
      },
      { text: 'Verify that photos are included showing the accessible entrance, pathways, parking, accessible toilet, and any mobility equipment. Check that every photo has descriptive alt text.' },
      { text: 'Test the accessibility page itself: Can you navigate it using only a keyboard (Tab key)? Do images have alt text? Is the text contrast ratio at least 4.5:1? Use a free tool like the WAVE browser extension to check.' },
      { text: 'Open the page on a mobile phone. Is it readable and usable on a small screen? Many customers will check accessibility info on their phone while planning.' },
      { text: 'Ask a colleague unfamiliar with your venue to read the page and tell you if they could plan a visit. Note any questions they still have, as these represent gaps in your content.' },
      { text: 'Check the page load time. If it contains many large images or a PDF download, it may be slow or inaccessible. Compress images and avoid PDFs where possible.' },
      { text: 'Record the date of your review and note any items that need updating. Schedule a follow-up review in 3 months.' }
    ],
    tools: ['Computer or smartphone with web browser', 'WAVE browser extension (free)', 'Stopwatch or timer for page load testing', 'Accessibility information checklist (printed or digital)'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      requirement: 'The Disability Discrimination Act requires businesses to provide information in accessible ways and not discriminate in the provision of services.'
    },
    related: [
      {
        code: 'WCAG2.1-AA',
        relevance: 'Your accessibility page itself should be accessible: proper headings, alt text on images, readable contrast.'
      }
    ],
    plainEnglish: 'While there\'s no specific legal requirement to have an accessibility page, providing clear information demonstrates compliance with DDA obligations to make services accessible.',
    complianceNote: 'This is about going beyond minimum compliance to genuinely welcome customers with disabilities. The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  solutions: [
    {
      title: 'Add a basic accessibility section to your existing website',
      description: 'Create a simple text-based accessibility section on your current website covering the essential information visitors need. This is a fast, free starting point that immediately helps customers plan their visit. Even a short page with honest, specific details is far better than no information at all.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Walk through your venue from the car park or street to the main areas, noting every accessibility feature and barrier along the way.',
        'Write a plain-English summary covering: entrance type (level, ramped, or steps), door width, accessible parking availability and distance to entrance, accessible toilet location and features, hearing augmentation, quiet spaces, and how to get help.',
        'Take clear photos of the accessible entrance, pathway from parking, accessible toilet, and any assistive equipment (portable ramp, hearing loop, etc.).',
        'Add a new page or section to your website titled "Accessibility" or "Access Information". Place the text and photos on this page.',
        'Add a link to this page in your main navigation menu or footer. Aim for it to be reachable within two clicks from the homepage.',
        'Include a contact email address and phone number for accessibility questions. Add a note that you welcome National Relay Service (NRS) calls.',
        'Add alt text to every photo describing what it shows (e.g. "Level entrance with automatic sliding doors, 1000mm wide opening").',
        'Test the page on both desktop and mobile to ensure it is readable.',
        'Ask a colleague or customer with disability to review the page and suggest improvements.',
        'Set a calendar reminder to review and update the page every 3 months.'
      ],
      notes: 'Focus on honesty over perfection. Listing limitations (e.g. "Upper floor not wheelchair accessible, no lift available") is more helpful than omitting them.'
    },
    {
      title: 'Create a comprehensive accessibility page with photos and downloadable guide',
      description: 'Build a detailed, well-structured accessibility page with photos, measurements, and a downloadable PDF or print-friendly version. This mid-level approach gives customers thorough information to plan their visit with confidence. It also reduces staff time spent answering phone enquiries.',
      resourceLevel: 'medium',
      costRange: '$200-800',
      timeRequired: '1-2 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Conduct a thorough accessibility walkthrough of your venue, measuring door widths (mm), path widths (mm), ramp gradients (ratio), distances between key points (metres), and step counts.',
        'Photograph each accessibility feature: entrance (showing threshold and door width), pathway (showing surface type and width), parking (showing signage and proximity), accessible toilet (showing layout, grab rails, basin), hearing loop signage, and any portable equipment.',
        'Organise information into clear sections: Getting Here (transport and parking), Getting In (entrances), Getting Around (internal paths, lifts, stairs), Facilities (toilets, baby change), Sensory Environment (noise, lighting, quiet spaces), and Getting Help (contact details, assistance animals).',
        'Write content for each section using specific measurements and honest descriptions. Use plain language at a Year 8 reading level.',
        'Brief your web developer or use your CMS to create a dedicated page at yoursite.com/accessibility. Use proper heading hierarchy (H1, H2, H3) for screen reader compatibility.',
        'Add all photos with descriptive alt text. Compress images so the page loads quickly (under 3 seconds).',
        'Create a print-friendly or downloadable version for customers who prefer to have information on paper.',
        'Include a "Last updated" date on the page and a contact form or email specifically for accessibility questions.',
        'Submit the page URL to Google Maps, TripAdvisor, and relevant tourism directories so customers can find it when searching.',
        'Run the page through the WAVE accessibility checker and fix any errors before publishing.'
      ],
      notes: 'Consider using an accessibility information template from Tourism Australia or your state tourism body to ensure you cover all the key topics visitors look for.'
    },
    {
      title: 'Commission a professional accessibility content package',
      description: 'Engage an accessibility consultant and web developer to create a best-practice accessibility information hub including virtual tour, interactive features, and integration with booking systems. This approach delivers a standout experience that positions your venue as an accessibility leader and can be used as a marketing asset.',
      resourceLevel: 'high',
      costRange: '$2,000-8,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant (e.g. through the Australian Network on Disability or a local access consultant) to conduct a detailed access audit of your venue.',
        'Brief a photographer to capture high-quality images at wheelchair height showing all access features, pathways, and key areas. Include 360-degree photos for a virtual tour if budget allows.',
        'Commission a short video walkthrough (2-3 minutes) showing the journey from arrival to key areas. Include captions, audio description, and an Auslan (Australian Sign Language) interpreter overlay.',
        'Work with your web developer to build a dedicated accessibility hub page with interactive floor map, photo gallery, virtual tour embed, and structured data markup for search engines.',
        'Integrate accessibility information into your booking system so customers can request specific accommodations (accessible room, hearing loop seat, wheelchair space) during booking.',
        'Create downloadable resources: a visual guide/social story for neurodiverse visitors, a large print summary, and an Easy Read version for people with intellectual disability.',
        'Add structured data (schema.org accessibility properties) to your website so search engines can surface your accessibility information directly in results.',
        'Arrange user testing with 3-5 people with different disabilities to identify gaps and usability issues before launch.',
        'Develop a maintenance plan: assign a staff member to review content quarterly, update photos annually, and refresh information immediately after any venue changes.',
        'Promote the new accessibility hub through your social media, email newsletters, local disability organisations, and tourism directories.'
      ],
      notes: 'This investment typically pays for itself through increased visitation from the disability community and positive word-of-mouth. Request case studies from your consultant showing ROI from similar projects.'
    }
  ],

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A boutique hotel in regional Victoria had no accessibility information online. Potential guests with mobility requirements would call with detailed questions about room layouts, bathroom dimensions, and parking distances, taking up front desk staff time and often resulting in long hold times during busy periods.',
      solution: 'The hotel created a comprehensive accessibility page with room-by-room access features including photos taken at wheelchair height. Each room listing included door widths (measured in mm), bathroom layout diagrams showing grab rail positions and transfer side, shower type (roll-in vs. hob), parking information with exact distance to entrance (15m), nearest accessible public transport (bus stop 200m, level path), and a web form for guests to submit specific questions before booking.',
      outcome: 'Phone enquiries about accessibility dropped 60% within three months. The hotel received positive Google reviews specifically mentioning the accessibility page. Two travel bloggers who use wheelchairs featured the hotel, generating 15 additional bookings in the first quarter.',
      cost: 'Free (3 hours of staff time to write, photograph, and publish)',
      timeframe: '1-2 days to create, then 30 minutes quarterly to review'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular inner-city restaurant frequently had wheelchair users arrive only to find they could not fit between tables. The only entrance had one step, and staff were unsure how to direct customers to the accessible toilet. This led to awkward situations and negative reviews online.',
      solution: 'The owner added a simple "Access" section to their website with four clear photos: the entrance (showing the single step and noting the portable ramp available on request), the interior (showing table spacing), the accessible toilet (ground floor, left of bar, right-hand transfer), and the path from the nearest accessible parking bay (50m, level footpath). They also noted that tables 1 through 4 could accommodate wheelchairs with at least 1200mm clearance.',
      outcome: 'Wheelchair users now call ahead to request the ramp, and the restaurant reserves an appropriate table. Negative reviews about access stopped completely. The owner estimated a 10% increase in bookings from customers who previously avoided the venue.',
      cost: 'Free (1 hour to photograph and write content)',
      timeframe: '1 evening to set up'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum/Gallery',
      scenario: 'A regional gallery in a heritage building assumed their old structure meant they could not do much about accessibility and therefore avoided mentioning it online. Visitors with disabilities would arrive unprepared for the three front steps, the narrow internal doorways, and the upper gallery only accessible by a staff-operated platform lift.',
      solution: 'The gallery manager documented everything honestly on a new accessibility page: "Main entrance has 3 steps (no handrails). Accessible entrance via rear car park with intercom buzzer (staff will open within 1 minute). Ground floor fully accessible with 1000mm wide pathways. Upper gallery accessible via platform lift (staff operated, please ask at reception). Accessible unisex toilet on ground floor near gift shop." They included a simple hand-drawn map and photos of each access point.',
      outcome: 'Visitors with disabilities appreciated the honesty and were able to plan their visit route in advance. Several visitors told staff they chose this gallery specifically because the information was so clear and upfront. Local disability support groups began recommending the gallery to their members.',
      cost: 'Free (documentation and website update only)',
      timeframe: '2 hours to document, photograph, and publish'
    }
  ],

  resources: [
    {
      title: 'Accessible Tourism Resource Kit',
      url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Comprehensive guide to making tourism businesses more accessible, including website content templates and checklists for what to include on your accessibility page.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Network on Disability - Accessible Information',
      url: 'https://www.and.org.au/',
      type: 'website',
      source: 'Australian Network on Disability',
      description: 'Resources and guidance for what to include on your accessibility page, plus examples of best-practice accessibility information from Australian businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Discrimination Act Guide',
      url: 'https://humanrights.gov.au/our-work/disability-rights/brief-guide-disability-discrimination-act',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Overview of your obligations under the DDA, including requirements around providing accessible information and services.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'WAVE Web Accessibility Evaluation Tool',
      url: 'https://wave.webaim.org/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free browser extension that checks your web pages for accessibility issues including missing alt text, poor contrast, and heading structure problems.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'Travability - Accessible Accommodation Directory',
      url: 'https://www.travability.travel/',
      type: 'website',
      source: 'Travability',
      description: 'Australian directory of accessible tourism businesses. Listing your venue here increases visibility and provides a model for what accessibility information to include.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.1-F-5',
      questionText: 'Can customers contact you in a variety of ways to ask accessibility questions?',
      relationship: 'Complements online information with personal contact options',
      moduleCode: '1.1'
    }
  ],

  keywords: ['website', 'online', 'information', 'pre-visit', 'planning', 'accessibility page'],
  lastUpdated: '2026-02-24'
},

// 1.1-F-7
{
  questionId: '1.1-F-7',
  questionText: 'Do you offer familiarisation visits or orientation sessions?',
  moduleCode: '1.1',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Familiarisation Visits',
  summary: 'Familiarisation visits let people explore your venue before their main visit, reducing anxiety and helping them feel comfortable with the environment.',

  whyItMatters: {
    text: 'For many people (particularly those with autism, anxiety, cognitive disabilities, or sensory sensitivities) visiting a new place can be overwhelming. A familiarisation visit allows them to understand the layout, meet staff, and know what to expect without the pressure of a "real" visit.',
    quote: {
      text: 'Being able to walk through the venue before my son\'s birthday party made all the difference. He knew where everything was and had a great time.',
      attribution: 'Parent of child with autism'
    }
  },

  tips: [
    {
      icon: 'Calendar',
      text: 'Offer visits during quieter times when the venue is less overwhelming.',
      detail: 'Early mornings, late afternoons, or days with lower foot traffic are ideal. For venues with variable noise levels (e.g. restaurants before dinner rush, theatres before show setup), choose times when lighting is normal but crowds are absent. Allow customers to request a specific day and time that suits their schedule, rather than offering only one slot per week.',
      priority: 1
    },
    {
      icon: 'Video',
      text: 'Create a virtual tour or video walkthrough as an alternative.',
      detail: 'A 2-3 minute video showing the journey from car park or street to each key area (entrance, main space, toilets, quiet area) can be viewed repeatedly at home. Film at eye level and wheelchair height. Include captions, audio description, and keep background music to a minimum. Upload to YouTube (free hosting, caption support) and embed on your accessibility page. This serves customers who cannot attend in person.',
      priority: 2
    },
    {
      icon: 'FileText',
      text: 'Provide a social story or visual guide that can be reviewed beforehand.',
      detail: 'Social stories use simple text and real photos to explain what will happen during a visit, step by step. Include photos of the building exterior, entrance, reception area, main spaces, toilets, and key staff. Use first-person language ("When I arrive, I will see the front desk"). Keep sentences short and factual. Offer the guide as a downloadable PDF and as a webpage. The Autism CRC and Amaze websites have free templates.',
      priority: 3
    },
    {
      icon: 'Users',
      text: 'Introduce key staff members who will be there during the actual visit.',
      detail: 'Meeting staff in advance reduces anxiety significantly for people who find social interactions challenging. During the familiarisation visit, introduce the visitor to reception staff, floor staff, or any support person who will be present on their actual visit day. Share staff names and photos in the social story or confirmation email so the visitor recognises familiar faces on arrival.',
      priority: 4
    },
    {
      icon: 'Clock',
      text: 'Allow flexibility in visit duration and structure.',
      detail: 'Some people need 10 minutes to check one specific area, while others benefit from an hour exploring every corner. Do not rush the visit or follow a rigid schedule. Let the visitor lead and explore at their own pace. Ask at the start what they would like to see and tailor the visit accordingly. Some visitors may want to return for a second familiarisation visit before their main event.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Setting up familiarisation visits',
    steps: [
      { text: 'Review your weekly schedule and identify at least two quiet time slots (different days) when a familiarisation visit could be accommodated without disrupting operations. Consider early mornings, Monday afternoons, or periods between events.' },
      { text: 'Create a simple booking process: decide whether customers request visits by phone, email, or web form. Draft a short request form capturing: visitor name, date preferences, specific areas they want to see, any support needs, and whether they will bring a support person.' },
      { text: 'Map out a standard tour route covering all key areas: accessible entrance, reception or front desk, main space or auditorium, accessible toilets, quiet or low-sensory area (if available), emergency exits, and any equipment (hearing loop, wheelchair spaces, portable ramp).' },
      { text: 'Prepare a brief staff guide (one page) explaining: what a familiarisation visit is, why it matters, what to say and do during the visit, how to introduce themselves, and how to handle questions they cannot answer ("I will find out and email you today").' },
      { text: 'Train at least two staff members on conducting familiarisation visits so there is always someone available. Include the training in new staff induction procedures.' },
      { text: 'Create a social story template with photos of your venue that can be emailed to visitors before or after their familiarisation visit. Use real photos, not stock images, and update them whenever the venue appearance changes.' },
      { text: 'Add information about familiarisation visits to your accessibility page, including: how to request one, what to expect, typical duration (e.g. 15-45 minutes), and that the service is free.' },
      { text: 'After each familiarisation visit, send a brief follow-up email asking if the visitor has any additional questions and confirming details of their upcoming main visit. Track the number of familiarisation visits conducted per month to measure uptake.' },
      { text: 'Review and improve your familiarisation visit process every 6 months. Ask visitors for feedback: Was the visit helpful? Was there anything else they wish they had seen or been told?' }
    ],
    tools: ['Printed or digital venue map', 'Camera or smartphone for social story photos', 'One-page staff guide (printed and laminated)', 'Booking form (paper or online)', 'Social story template (Word or Google Docs)'],
    estimatedTime: '2-3 hours to set up the process, then 20-60 minutes per visit'
  },

  solutions: [
    {
      title: 'Offer informal walkthrough visits by appointment',
      description: 'Set up a simple process for customers to request an informal walkthrough of your venue at a quiet time. This low-cost approach lets people see the space, identify their preferred seating or route, and meet staff without any formal program. Most venues can start offering this within a day.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours to set up',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Identify 2-3 quiet time slots per week when a walkthrough could happen (e.g. Tuesday 9-10am, Thursday 3-4pm).',
        'Add a note to your accessibility page and contact page: "We offer free familiarisation visits so you can explore our venue before your main visit. Call or email to arrange a time."',
        'Prepare a one-paragraph script for staff answering requests: confirm the visitor\'s name, preferred date, what they want to see, and any support needs.',
        'On the day, have a staff member greet the visitor at the accessible entrance, introduce themselves by name, and offer to show key areas or let the visitor explore independently.',
        'Allow 15-45 minutes depending on the visitor\'s needs. Do not rush.',
        'After the visit, offer a printed map or email a photo summary of the route they will take on their main visit day.',
        'Log each familiarisation visit in a simple spreadsheet to track demand and feedback.'
      ],
      notes: 'Even if no one requests a visit for weeks, advertising the option signals that you welcome customers with disability. The offer itself builds goodwill.'
    },
    {
      title: 'Create a structured familiarisation program with social stories',
      description: 'Develop a formal familiarisation visit program including downloadable social stories, a virtual tour video, and trained staff guides. This approach serves a wider audience because the digital resources help people who cannot attend in person. It also ensures a consistent, high-quality experience for every visitor.',
      resourceLevel: 'medium',
      costRange: '$200-600',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Photograph every key area of your venue at eye level and wheelchair height: exterior, entrance, reception, main spaces, toilets, quiet area, emergency exits, and parking.',
        'Create a social story document using the photos: 10-15 pages, one photo per page, with a simple first-person sentence per page (e.g. "When I arrive, I will see the blue front door. I can press the buzzer if I need help."). Save as PDF and web page.',
        'Record a 2-3 minute video walkthrough using a smartphone on a stabiliser or gimbal. Walk the route from arrival to key areas, narrating as you go. Add captions using YouTube\'s free captioning tool.',
        'Embed the video and link the social story PDF on your accessibility page under a "Plan Your Visit" heading.',
        'Write a staff familiarisation visit guide (1-2 pages): greeting protocol, standard tour route, key facts to share (measurements, equipment locations), how to handle questions, and follow-up process.',
        'Train 2-3 staff members using the guide. Practice with a role-play session (one person plays the visitor, the other the guide).',
        'Set up a dedicated email address or web form for familiarisation visit requests (e.g. access@yourvenue.com.au).',
        'Create a follow-up email template sent after each visit with: a thank-you message, the social story PDF attached, and a link to book their main visit.',
        'Promote the program to local disability organisations, schools, and support groups by sending an introductory email with the social story attached.',
        'Review the program every 6 months: update photos if the venue has changed, refresh the video, and incorporate visitor feedback.'
      ],
      notes: 'Social stories are most commonly associated with autism support but are valued by many people including those with intellectual disability, anxiety disorders, and acquired brain injury. Offering them signals broad inclusivity.'
    },
    {
      title: 'Develop a comprehensive pre-visit support package with virtual and in-person options',
      description: 'Commission a professional pre-visit support package including a 360-degree virtual tour, professionally produced social stories in multiple formats (standard, Easy Read, and translated), and a dedicated familiarisation coordinator role. This positions your venue as a leader in accessible tourism and serves the widest possible audience.',
      resourceLevel: 'high',
      costRange: '$2,000-6,000',
      timeRequired: '4-6 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a professional photographer or virtual tour company to create a 360-degree virtual tour of your venue, covering the route from parking/transport to all key areas. Specify wheelchair-height camera positioning for ground-level spaces.',
        'Commission an accessibility consultant to develop social stories in three formats: a standard visual guide, an Easy Read version (simplified language with symbols, suitable for people with intellectual disability), and at least one translated version for your most common non-English speaking visitor group.',
        'Produce a professional video walkthrough (3-5 minutes) with embedded captions, audio description, and an Auslan (Australian Sign Language) interpreter in a picture-in-picture overlay.',
        'Build a "Plan Your Visit" section on your website hosting: the virtual tour (embeddable via Matterport, Kuula, or similar platform), downloadable social stories, the video walkthrough, and the familiarisation visit booking form.',
        'Appoint a familiarisation coordinator (an existing staff member with dedicated time allocation) to manage requests, conduct visits, and maintain resources.',
        'Develop a familiarisation visit protocol document covering: pre-visit preparation, greeting procedure, tour route options (short 15-min vs. comprehensive 45-min), accessibility information to share at each stop, and post-visit follow-up.',
        'Partner with 3-5 local disability organisations, special schools, and support groups to offer free group familiarisation sessions. Schedule one per month initially.',
        'Create a feedback mechanism: a short survey (3-5 questions) sent after each visit to measure satisfaction and identify improvements.',
        'Integrate the familiarisation program into your marketing: feature it on social media, in press releases, and in tourism directory listings.',
        'Review the entire program annually with input from the disability community. Update all resources (photos, video, social stories) whenever the venue changes.'
      ],
      notes: 'Consider applying for a grant through your state tourism body or local council to fund this initiative. Many offer grants specifically for accessible tourism improvements. Document the program for award submissions (e.g. Australian Tourism Awards accessible tourism category).'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theatre',
      scenario: 'A regional theatre wanted to welcome more neurodiverse audiences but found some visitors could not cope with the full experience on their first attempt. The auditorium bells, dimming lights, and crowd noise triggered sensory overload. Parents reported leaving before the show started because their children became distressed by the unfamiliar environment.',
      solution: 'The theatre introduced "Pre-Show Tours" available by appointment at no charge. During a tour, visitors see the auditorium with house lights on, hear what the warning bells and announcements sound like at reduced volume, sit in their assigned seats, explore the foyer and toilets, and meet front-of-house staff by name. The theatre also created a downloadable social story with 12 photos showing each stage of a visit from arrival to curtain call. Staff who conduct tours received a half-day training session from a local autism support organisation.',
      outcome: 'Within six months, several families became regular attendees who had never been to live theatre before. The social story was downloaded over 200 times. Staff reported the tours were personally rewarding and improved their confidence with all customers. The theatre won a local access award and saw a 15% increase in bookings for their relaxed performances.',
      cost: 'Staff time only (approximately $50 per tour in labour costs)',
      timeframe: '30-45 minutes per tour, with 2 hours initial setup'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A family-friendly restaurant in suburban Sydney received requests from parents of autistic children who wanted to try dining out but were anxious about sensory triggers including background music, unfamiliar food smells, and crowded seating. Previous attempts at other restaurants had ended in meltdowns and embarrassment, making the families reluctant to try again.',
      solution: 'The restaurant offered families the option to visit during setup time (30 minutes before opening) on quieter weekday evenings. During the visit, families could see the space with lights at normal levels but no music or crowd noise, browse the physical menu and discuss options with the chef, meet the manager and their allocated server, choose a preferred table for their booking (typically near the exit for easy departure if needed), and try a sample of bread from the menu. The manager photographed the table and entrance for the family to review at home before their booking.',
      outcome: 'Word spread through two local autism support groups, bringing in at least eight new family bookings in the first two months. Three families became weekly regulars. The restaurant received a feature in a local parenting magazine about inclusive dining, which generated significant positive attention and further bookings from families with and without disability.',
      cost: 'Free (15-20 minutes of staff time per visit)',
      timeframe: '15-20 minutes per visit, immediate to implement'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A state museum noticed that school groups with students with disabilities sometimes struggled badly on excursion day. Students with autism became overwhelmed by echoing galleries, unfamiliar layouts, and the pressure of keeping up with the group. Teachers reported spending more time managing distress than engaging with exhibits.',
      solution: 'The museum created a free "Teacher Preview" program. Teachers could visit with a support person to plan their route, identify quiet retreat spaces, test noise levels in each gallery, and receive a customisable social story template. The template included 20 captioned photos that teachers could select, reorder, and annotate for their specific student group. The museum also provided a suggested "sensory map" rating each gallery from low to high sensory load, so teachers could plan the visit sequence to start in calmer spaces.',
      outcome: 'Participating schools reported 70% fewer incidents of student distress during visits. The social story template became the museum\'s most downloaded resource with over 500 downloads in the first year. Three disability-specific schools that had stopped visiting resumed regular excursions. The program was featured as a case study by the Australian Museum and Galleries Association.',
      cost: '$200 for template design, then staff time per appointment',
      timeframe: '1-hour appointments, with 1 week to set up the program initially'
    }
  ],

  resources: [
    {
      title: 'Social Stories Overview',
      url: 'https://carolgraysocialstories.com/social-stories/what-is-it/',
      type: 'guide',
      source: 'Carol Gray Social Stories',
      description: 'Learn about the social story format, the 10 criteria for a proper social story, and how to create effective ones for your venue.',
      isFree: true
    },
    {
      title: 'Amaze - Autism-Friendly Resources',
      url: 'https://www.amaze.org.au/',
      type: 'website',
      source: 'Amaze (Autism Victoria)',
      description: 'Resources for creating visual supports, sensory-friendly experiences, and social stories. Includes free templates and guidance for Victorian businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Autism CRC - Inclusive Tourism Toolkit',
      url: 'https://www.autismcrc.com.au/',
      type: 'guide',
      source: 'Autism CRC',
      description: 'Research-based toolkit for creating autism-inclusive visitor experiences, including social story templates and staff training guides.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Matterport Virtual Tour Platform',
      url: 'https://matterport.com/',
      type: 'tool',
      source: 'Matterport',
      description: '360-degree virtual tour creation platform. Free tier available for single spaces. Used by many museums and venues for accessibility virtual tours.',
      isAustralian: false,
      isFree: false
    },
    {
      title: 'Scope Australia - Communication Access',
      url: 'https://www.scopeaust.org.au/service/communication-access/',
      type: 'guide',
      source: 'Scope Australia',
      description: 'Guidance on creating Easy Read documents, visual supports, and communication-accessible environments for people with intellectual disability.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '3.3-1-7',
      questionText: 'Do you offer relaxed or sensory-friendly sessions?',
      relationship: 'Both support neurodiverse visitors',
      moduleCode: '3.3'
    },
    {
      questionId: '1.1-F-1',
      questionText: 'Do you have accessibility information available for customers before they visit?',
      relationship: 'Familiarisation info should be on your accessibility page',
      moduleCode: '1.1'
    }
  ],

  keywords: ['familiarisation', 'orientation', 'preview', 'social story', 'autism', 'anxiety', 'neurodiverse'],
  lastUpdated: '2026-02-24'
},

// 1.1-F-8
{
  questionId: '1.1-F-8',
  questionText: 'Do you provide information about accessible transport options to your venue?',
  moduleCode: '1.1',
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
      text: 'List nearest accessible public transport stops with distances.',
      detail: 'Include the name of each stop or station, the distance in metres from the stop to your accessible entrance, and whether the stop has step-free access (lifts, ramps, or level boarding). Note if the route from the stop to your venue is flat, sealed, and free of obstacles. For example: "Flinders Street Station (350m). Exit via Elizabeth Street lift. Level footpath to our entrance." Check your state transport authority website for current accessibility status of stops.',
      priority: 1
    },
    {
      icon: 'Car',
      text: 'Describe accessible parking options and how to book if needed.',
      detail: 'List the number of designated accessible parking bays, their exact location (e.g. "Level B1 of car park, near Lift 2"), the distance to your accessible entrance, and any booking or time-limit requirements. If your venue does not have its own accessible parking, identify the nearest accessible on-street spaces or public car parks. Note whether parking is free for permit holders and if a valid Australian Disability Parking Permit is required.',
      priority: 2
    },
    {
      icon: 'MapPin',
      text: 'Provide directions from transport stops to your accessible entrance.',
      detail: 'Write step-by-step walking directions from each major transport point, noting path surfaces (concrete, gravel, grass), gradients (flat, slight slope, steep), any obstacles (kerbs, construction, uneven surfaces), and distance in metres. Include a photo of the route if possible. A direction like "Turn left out of station, 200m flat concrete footpath, accessible entrance is the glass door with blue signage on your right" is far more useful than "5-minute walk from station."',
      priority: 3
    },
    {
      icon: 'Phone',
      text: 'Include contact numbers for accessible taxi and rideshare services.',
      detail: 'List local wheelchair accessible taxi (WAT) booking numbers for your area. In most Australian states, 13CABS (13 2227) and Uber WAV offer wheelchair-accessible vehicles. Note typical wait times for accessible vehicles (which are often longer than standard taxis) and recommend booking at least 24 hours ahead. If your venue offers a courtesy shuttle, note whether it is wheelchair accessible.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your accessible transport information',
    steps: [
      { text: 'Check your website (accessibility page, "Getting Here" section, contact page, and Google Maps listing) for any existing transport information. Note what is currently published and what is missing.' },
      {
        text: 'Identify the nearest accessible public transport stops. Visit your state transport authority website (PTV, Transport for NSW, Translink, etc.) and search for stops within 500m of your venue that have step-free access.',
        measurement: {
          target: 'Distance from nearest accessible stop to venue entrance',
          acceptable: 'Under 500m with level, sealed pathway',
          unit: 'metres'
        }
      },
      { text: 'Walk the route from each transport stop to your accessible entrance. Note the exact distance (use your phone\'s step counter or a mapping app), path surface type, any hills or slopes, kerb ramps, pedestrian crossings, and potential obstacles such as construction or street furniture.' },
      { text: 'Count and note the number of designated accessible parking bays available (your venue and nearby public options). Record the distance from each to your accessible entrance and any booking requirements.' },
      {
        text: 'Measure the walking distance from the closest accessible parking bay to your accessible entrance.',
        measurement: {
          target: 'Distance from accessible parking to entrance',
          acceptable: 'Under 40m preferred, ideally under 20m',
          unit: 'metres'
        }
      },
      { text: 'Research local wheelchair accessible taxi services. Call each provider and ask: How far in advance should customers book? What is the typical wait time in your area? Is there a dedicated WAT booking line?' },
      { text: 'Check if any rideshare services (Uber WAV, DiDi Assist) operate in your area. Download the app and verify that the wheelchair-accessible option appears for your venue location.' },
      { text: 'Write or update your transport information with all findings. Include specific distances, directions, and booking numbers. Add photos of key landmarks along walking routes to help customers navigate.' },
      { text: 'Test the information by asking a colleague unfamiliar with your area to follow the directions from a transport stop to your entrance. Note any confusing or missing steps.' },
      { text: 'Set a reminder to re-check transport information every 6 months, as public transport routes, stop accessibility, and taxi services change over time.' }
    ],
    tools: ['Smartphone with mapping app (Google Maps or Apple Maps)', 'State transport authority website or app', 'Measuring tape or phone step counter for distances', 'Camera for photographing routes and landmarks', 'Pen and paper or note-taking app for recording details'],
    estimatedTime: '1-2 hours (including walking routes)'
  },

  solutions: [
    {
      title: 'Add basic transport information to your website',
      description: 'Write a simple "Getting Here" section covering the three main accessible transport options: public transport, parking, and taxis. This quick update gives customers the key information they need to plan their journey. Even basic details are far more helpful than no transport information at all.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Identify the nearest accessible public transport stops using your state transport authority website. Note the stop name, route numbers, distance to your venue, and whether the stop is step-free.',
        'Walk the route from each stop to your accessible entrance. Note the distance in metres and any hazards or slopes.',
        'Count your accessible parking bays and note their location, distance to entrance, and any booking or time-limit rules.',
        'Look up the local wheelchair accessible taxi booking number (e.g. 13CABS 13 2227) and note whether advance booking is recommended.',
        'Write a "Getting Here" section on your website with three subheadings: Public Transport, Parking, and Taxis/Rideshare.',
        'Under each subheading, list the specific details you gathered (stop names, distances, directions, phone numbers).',
        'Add this section to your accessibility page and your contact or "Find Us" page.',
        'Include a link to Google Maps directions to your accessible entrance (you can set the destination pin to the exact entrance location).'
      ],
      notes: 'Ask customers how they got to your venue during their visit. Their answers may reveal transport options or challenges you had not considered.'
    },
    {
      title: 'Create illustrated transport guides with photos and maps',
      description: 'Develop detailed, photo-illustrated transport guides for each major route to your venue. Include annotated maps, step-by-step photo directions, and information about each transport option. This level of detail helps customers navigate with confidence, especially those using the route for the first time.',
      resourceLevel: 'medium',
      costRange: '$100-400',
      timeRequired: '1 week',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Walk each major route to your venue (from the nearest train station, bus stop, tram stop, and car park) and photograph key landmarks, path surfaces, kerb ramps, and your accessible entrance.',
        'Create an annotated map of the area around your venue showing: accessible transport stops (with route numbers), accessible parking bays, the walking route from each transport point to your accessible entrance, and any obstacles or features to note.',
        'Write step-by-step directions for each route, pairing each step with a photo. Example: "Step 1: Exit the station via the lift to Elizabeth Street (photo of lift). Step 2: Turn right and follow the footpath for 150m (photo of footpath). Step 3: Our accessible entrance is the blue door on your left (photo of entrance)."',
        'Create a downloadable PDF version of each route guide for customers to save to their phone or print.',
        'Add a Google Maps embed to your website with your accessible entrance pinned (not just the general venue location).',
        'Include information about pick-up and drop-off zones for taxis and rideshare, noting the exact location and whether it is step-free.',
        'Research and list any accessible shuttle services, community transport options, or venue-provided transport in your area.',
        'Publish the guides on your accessibility page and "Getting Here" page. Email the guides to customers who have booked, especially those who mentioned accessibility requirements.',
        'Ask local disability organisations to review the guides and suggest improvements.',
        'Update photos and directions seasonally or after any construction, roadworks, or transport changes in the area.'
      ],
      notes: 'Google Maps allows you to create custom maps with annotations for free using My Maps. You can mark accessible routes, entrances, and parking and share the link on your website.'
    },
    {
      title: 'Partner with transport providers for integrated accessible journey planning',
      description: 'Establish partnerships with local transport providers and develop an integrated journey planning service for customers with disability. This may include pre-arranged accessible transfers, real-time transport assistance, and coordination with your venue to ensure a seamless arrival experience. This approach removes the burden of transport planning from the customer.',
      resourceLevel: 'high',
      costRange: '$500-3,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Contact your local wheelchair accessible taxi provider and negotiate a partnership: pre-booked accessible transfers at a set rate for your customers, with the ability to charge to the customer\'s booking.',
        'If your venue has a shuttle service, investigate the cost of making it wheelchair accessible (e.g. a ramp-equipped vehicle or partner with an accessible vehicle hire company). A single accessible vehicle may cost $60,000-$120,000 to purchase, or $200-$500/day to hire.',
        'Work with your state transport authority to ensure your venue appears on their accessible journey planner with accurate information about the nearest accessible stops and walking routes.',
        'Create a "Transport Concierge" service: customers can email or call ahead with their transport needs, and a staff member helps plan their journey, book accessible taxis, or arrange transfers.',
        'Develop real-time arrival assistance: customers can text or call when they are 10 minutes away, and a staff member meets them at the accessible entrance or parking bay to assist.',
        'Install clear wayfinding signage from the nearest accessible transport stops to your venue, including tactile ground surface indicators (TGSIs) if your venue is on a public pathway.',
        'Create an "Arriving by accessible transport" section in your booking confirmation emails with personalised information based on the customer\'s postcode or stated transport method.',
        'Train front-desk and concierge staff on all local accessible transport options, including booking procedures, typical wait times, and troubleshooting (e.g. what to do if an accessible taxi does not arrive).',
        'Monitor and log transport-related feedback from customers with disability. Use this data to identify recurring problems and work with transport providers to resolve them.',
        'Publish a comprehensive, annually updated transport guide covering every accessible transport option to your venue, available in standard, large print, and Easy Read formats.'
      ],
      notes: 'Some state governments offer grants for accessible tourism infrastructure, which may cover the cost of an accessible shuttle vehicle or wayfinding signage installation. Check with your state tourism body and local council.'
    }
  ],

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A city museum found that visitors using wheelchairs or mobility aids often arrived at the wrong entrance after following standard Google Maps directions from the nearest tram stop. The default map route led to the main entrance, which had four steps. The accessible entrance was around the corner via the car park, but this was not documented anywhere online. Visitors reported feeling frustrated and unwelcome after circling the building looking for a way in.',
      solution: 'The museum created a detailed "Getting Here" page with separate sections for tram, train, bus, car, and taxi. Each section included: a photo of the relevant stop or parking area, step-by-step walking directions to the accessible entrance with distance in metres, photos of the route at key decision points, a note about path surfaces (all sealed, level concrete), and the accessible entrance photo showing the intercom button. They also updated their Google Maps pin to point to the accessible entrance rather than the main entrance, and added a Google Maps custom direction link.',
      outcome: 'Complaints about the "wrong entrance" problem dropped to zero within two months. Staff no longer needed to give verbal directions over the phone. The "Getting Here" page became the second most visited page on the website. Visitor satisfaction scores for "ease of arrival" improved by 25% in the next quarterly survey.',
      cost: 'Free (3 hours of staff time for photography, writing, and website updates)',
      timeframe: '1 day to complete, then 30 minutes per quarter to review'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A coastal resort hotel frequently had guests with mobility requirements arrive expecting accessible transport from the nearest airport (45 minutes away). Standard airport shuttles were not wheelchair accessible, and the local taxi fleet had only two wheelchair-accessible vehicles that needed 48 hours advance booking. Guests who had not planned ahead often waited over an hour at the airport or had to cancel their trip entirely.',
      solution: 'The hotel added a comprehensive transport section to booking confirmation emails, personalised based on whether the guest indicated accessibility requirements. The email included: wheelchair-accessible taxi companies with booking numbers and the recommendation to book 48 hours ahead, the accessible public transport route from the airport (bus route 700 to town centre, then taxi) with a note about step-free boarding, an offer to arrange an accessible airport transfer through their partner company ($85 each way, wheelchair-accessible van), and driving directions noting the location of the three accessible parking bays (nearest is 8m from the front entrance). The hotel also trained front desk staff to proactively ask about transport needs at the time of booking.',
      outcome: 'Guest complaints about transport dropped by 80%. The accessible transfer service was booked by 30% of guests who indicated accessibility needs, generating additional revenue for the hotel. Several guests specifically mentioned the transport information in 5-star reviews, calling it "the best pre-arrival communication they had experienced." The hotel was listed as a recommended property by a national disability travel blogger.',
      cost: '$85 per transfer (charged to guest), zero cost for email template updates',
      timeframe: '2 hours to set up email template, then ongoing per-booking personalisation'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A convention centre hosting a large disability sector conference received dozens of pre-event enquiries about accessible transport. Delegates were travelling from across the state, many using powered wheelchairs, and the venue was in an area with limited public transport. The venue had no information about accessible transport options on their website or in event materials.',
      solution: 'The venue created a dedicated "Accessible Transport" page for the conference, covering: accessible train services to the nearest station (2km away) with a free accessible shuttle running every 20 minutes during the event, wheelchair accessible taxi booking numbers with a recommendation to book 24 hours ahead, a drop-off zone directly outside the accessible entrance (flat, covered, with staff assistance available), accessible parking for 15 vehicles within 30m of the entrance, and a map showing the accessible route from parking and drop-off to the registration desk. The shuttle service was arranged through a partnership with a local community transport provider at a cost of $400 per day.',
      outcome: 'The conference ran smoothly with no transport-related issues reported. The shuttle service was used by 40% of delegates and received excellent feedback. The venue adopted the accessible transport page as a permanent feature of their website (not just for that conference) and now includes transport information in all event planning packages. The community transport partnership continued for subsequent events.',
      cost: '$400/day for accessible shuttle, plus 4 hours staff time for page creation',
      timeframe: '1 week to arrange shuttle partnership and create content'
    }
  ],

  resources: [
    {
      title: 'Public Transport Victoria - Accessibility',
      url: 'https://www.ptv.vic.gov.au/more/travelling-on-the-network/accessibility/',
      type: 'website',
      source: 'PTV',
      description: 'Information about accessible public transport in Victoria, including which stations and stops have step-free access, lifts, and tactile indicators.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Transport for NSW - Accessible Travel',
      url: 'https://transportnsw.info/travel-info/using-public-transport/accessible-travel',
      type: 'website',
      source: 'Transport for NSW',
      description: 'Accessible travel information for NSW including trip planner with accessibility filters, station accessibility details, and travel assistance booking.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Translink Queensland - Accessibility',
      url: 'https://translink.com.au/travel-information/accessibility',
      type: 'website',
      source: 'Translink',
      description: 'Queensland accessible transport information, including which bus stops are wheelchair accessible and how to request assistance on the network.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Wheelchair Accessible Taxi Booking (13CABS)',
      url: 'https://www.13cabs.com.au/ride-options/wheelchair-accessible/',
      type: 'website',
      source: '13CABS',
      description: 'National wheelchair accessible taxi booking service available in most Australian capital cities. Book online, via app, or by calling 13 2227.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Google Maps - Wheelchair Accessible Routes',
      url: 'https://support.google.com/maps/answer/9628997',
      type: 'guide',
      source: 'Google',
      description: 'How to find wheelchair accessible public transport routes in Google Maps, and how to update your business listing with accurate entrance and parking information.',
      isAustralian: false,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '2.1-F-1',
      questionText: 'Is there accessible parking close to the entrance?',
      relationship: 'Parking is part of the transport journey',
      moduleCode: '2.1'
    },
    {
      questionId: '1.1-F-1',
      questionText: 'Do you have accessibility information available for customers before they visit?',
      relationship: 'Transport info is part of pre-visit information',
      moduleCode: '1.1'
    }
  ],

  keywords: ['transport', 'public transport', 'taxi', 'parking', 'getting there', 'directions'],
  lastUpdated: '2026-02-24'
},

// 1.1-F-5
{
  questionId: '1.1-F-5',
  questionText: 'Can customers contact you in a variety of ways to ask accessibility questions before visiting?',
  moduleCode: '1.1',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Multiple Contact Channels for Accessibility Questions',
  summary: 'Offering phone, email, live chat, and social media contact options ensures customers with different communication needs can reach you before visiting.',

  whyItMatters: {
    text: 'People communicate differently depending on their disability, preferences, and situation. A deaf person may need email or live chat. Someone with anxiety may prefer texting over calling. A person with low vision may find phone easiest. Providing multiple contact options removes communication barriers and shows you are genuinely prepared to help.',
    quote: {
      text: 'I always email first because phone calls are impossible for me. If there is no email option, I just do not go.',
      attribution: 'Deaf customer, accessibility feedback survey'
    }
  },

  tips: [
    {
      icon: 'Phone',
      text: 'Offer at least three contact methods: phone, email, and one other.',
      detail: 'Phone suits customers who are blind or have low vision, as well as those who prefer real-time conversation. Email suits deaf and hard of hearing customers, those with speech impairments, and people who need time to formulate their questions. Adding a third option such as live chat, SMS, or social media messaging covers even more communication preferences. Avoid making any single channel the only way to reach you for accessibility queries.',
      priority: 1
    },
    {
      icon: 'MessageSquare',
      text: 'Mention the National Relay Service for deaf and hard of hearing callers.',
      detail: 'The National Relay Service (NRS) is a free Australian Government service that allows deaf, hard of hearing, and speech-impaired people to make and receive phone calls. Add your NRS contact details to your website and printed materials. The format is: "NRS: If you are deaf or have a hearing or speech impairment, contact us through the National Relay Service. TTY: 133 677, Voice Relay: 1300 555 727, SMS Relay: 0423 677 767." Display this near your standard phone number, not hidden in a footnote.',
      priority: 2
    },
    {
      icon: 'Clock',
      text: 'State your response times so customers know what to expect.',
      detail: 'For example: "We respond to emails within 24 hours on business days" or "Live chat available 9am-5pm weekdays. Outside these hours, leave a message and we will reply by next business day." If accessibility enquiries go to a different queue or person, note this. Customers with disability are often planning well in advance, so even a 24-48 hour response time is usually fine as long as it is clearly stated. Avoid open-ended promises like "we will get back to you soon."',
      priority: 3
    },
    {
      icon: 'UserCheck',
      text: 'Designate a staff member who can confidently answer accessibility questions.',
      detail: 'Customers feel reassured when someone knowledgeable responds rather than being passed around between departments. Assign one primary and one backup staff member as the accessibility contact. Give them a reference sheet listing all your venue\'s accessibility features, measurements, and equipment. Ensure they have authority to make reasonable adjustments (e.g. reserving a specific table, arranging a portable ramp) without needing manager approval for every request.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your contact channels',
    steps: [
      { text: 'List every way a customer can currently contact you. Include: phone (landline and mobile), email (general and any dedicated addresses), web contact form, live chat, SMS, social media (Facebook Messenger, Instagram DM, X/Twitter DM), and any third-party platforms (TripAdvisor, Google Business messages).' },
      { text: 'Visit your own website as a customer would. Can you find contact details within two clicks of the homepage? Are they on your accessibility page, contact page, and footer? Is the text large enough to read and the links clearly clickable?' },
      { text: 'Test each channel yourself. Send an email, submit the web form, send a social media message, and try the live chat. Record how long each takes to get a response and whether the response adequately answers an accessibility question.' },
      {
        text: 'Check response times against your stated commitments. If you promise "within 24 hours," verify that accessibility enquiries actually receive a response within that timeframe.',
        measurement: {
          target: 'Email response time for accessibility enquiries',
          acceptable: 'Within 24 hours on business days',
          unit: 'hours'
        }
      },
      { text: 'Check whether your contact page or accessibility page mentions the National Relay Service (NRS). If not, note this as a gap. The NRS details should appear alongside your phone number.' },
      { text: 'Test your web contact form for accessibility: Can it be completed using only a keyboard? Do form fields have proper labels? Is the contrast sufficient? Does it work with a screen reader? Use the WAVE browser extension for a quick check.' },
      { text: 'Ask three different staff members the same accessibility question (e.g. "Do you have an accessible toilet?"). Note whether they all give the same correct answer and whether they know where to find additional information if needed.' },
      { text: 'Check your social media accounts for any unanswered accessibility questions in comments, reviews, or direct messages. Search for keywords like "wheelchair," "accessible," "disability," and "hearing loop" in your message history.' },
      { text: 'Review your Google Business Profile: Is messaging enabled? Are accessibility questions in the Q&A section answered? Is the "Accessibility" section of your listing filled in?' },
      { text: 'Create a summary of gaps found and prioritise fixes. Quick wins (adding NRS info, enabling social media messaging) can be done immediately. Larger changes (adding live chat, creating a web form) may need scheduling.' }
    ],
    tools: ['Computer and smartphone for testing all channels', 'WAVE browser extension for form accessibility testing', 'Stopwatch or timer for measuring response times', 'Screen reader (VoiceOver on Mac/iPhone, NVDA on Windows, TalkBack on Android) for testing form usability', 'Spreadsheet or checklist for recording results'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A CBD hotel only listed a phone number for general enquiries on their website. Deaf guests could not easily ask about accessible rooms, and the phone line was often busy during peak check-in hours. The hotel received complaints that it was "impossible to get through" and lost at least two bookings per month from customers who gave up trying to contact them about accessibility.',
      solution: 'The hotel added four additional contact options: a dedicated accessibility email address (access@hotel.com.au), a web booking form with an "Accessibility requirements" text field, WhatsApp messaging linked from their contact page, and a note about NRS calls with full NRS contact details next to their phone number. They assigned their guest services coordinator as the primary accessibility contact, with the duty manager as backup. Both had a laminated reference card listing all accessibility features and measurements for every room type.',
      outcome: 'Accessibility enquiries increased by 40%, indicating that previously blocked demand was now being captured. Deaf travellers made up 8% of new bookings in the first quarter, up from near zero. The hotel received three unsolicited positive reviews on TripAdvisor mentioning the ease of communication. Staff reported that the reference card saved time because they could answer questions immediately without needing to check rooms.',
      cost: 'Free (2 hours to set up email, update web form, and add NRS details)',
      timeframe: '1 day for initial setup, with 30 minutes to brief staff'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A large regional zoo received accessibility questions through Facebook Messenger, Instagram DMs, and Google reviews, but had no process for monitoring or responding to them. Questions sat unanswered for days or weeks. One parent publicly commented that they had waited two weeks for a response about wheelchair-accessible viewing areas and ended up visiting a competitor instead. The negative comment received 47 reactions.',
      solution: 'The zoo assigned one staff member (30 minutes per day) to monitor all social media channels for accessibility questions. They created a shared document of template responses for the 15 most common accessibility enquiries, covering wheelchair access, quiet spaces, companion card acceptance, accessible toilets, pram-friendly paths, hearing loops, accessible parking, and assistance animal policy. The staff member personalised each template response before sending. They also enabled Google Business messaging and set up auto-replies on Facebook and Instagram acknowledging receipt and promising a response within 4 hours during business hours.',
      outcome: 'Average response time for accessibility enquiries dropped from 5 days to under 3 hours. The zoo received positive comments on social media about their responsiveness. The parent who had posted the negative comment updated it to note the improvement. Monthly social media sentiment around accessibility shifted from mixed to overwhelmingly positive. The template document also improved consistency across all staff.',
      cost: 'Staff time only (approximately $25/day for 30 minutes of monitoring)',
      timeframe: '2 hours to create templates, then 30 minutes daily for ongoing monitoring'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A suburban shopping centre had a general enquiries phone number and a basic contact form, but neither was monitored for accessibility-specific questions. A customer using a power wheelchair submitted a form asking about accessible change rooms and charging stations for mobility devices. The form went to the marketing team, who were unsure who should answer and forwarded it to three different people before a response was sent 8 days later. By then, the customer had found the information elsewhere and chosen a different centre.',
      solution: 'The centre created a dedicated "Accessibility Enquiries" option in their web contact form dropdown, which routed directly to the centre management team. They added a direct email address (access@centre.com.au) and an SMS number for text-based enquiries. Their concierge desk was trained as the in-person and phone accessibility contact point, with a comprehensive reference binder covering every store\'s access features, accessible toilet locations, hearing loop availability, mobility scooter hire, and quiet hours. The centre also added NRS details to their website footer and printed directories.',
      outcome: 'Accessibility enquiry response time improved from 8 days to under 24 hours. The centre received 15 accessibility enquiries in the first month via the new channels (compared to 2-3 per month previously), indicating significant unmet demand. Customer satisfaction surveys showed a 20% improvement in the "ease of getting information" score for customers with disability.',
      cost: '$200 for web form update, plus staff time for training',
      timeframe: '1 week for form update and staff training'
    }
  ],

  solutions: [
    {
      title: 'Add email and NRS info to contact page',
      description: 'Update your contact page to include an email address and full National Relay Service (NRS) contact details alongside your phone number. This is the simplest step to open communication for deaf and hard of hearing customers who cannot use the phone. It takes under 30 minutes and costs nothing.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Decide on the email address for accessibility enquiries. You can use your existing general email or create a dedicated one (e.g. access@yourbusiness.com.au) for easier routing.',
        'Look up the National Relay Service contact details. The standard text to add is: "National Relay Service: TTY 133 677, Voice Relay 1300 555 727, SMS Relay 0423 677 767."',
        'Update your contact page to display the email address prominently (not just as a mailto link, but as visible text that can be copied).',
        'Add the NRS details directly below or beside your phone number. Do not hide them in a footnote or expandable section.',
        'Add the same NRS details to your accessibility page if you have one.',
        'Update your email footer or auto-reply to include NRS details so they appear in all outgoing correspondence.',
        'If you have printed materials (brochures, business cards, flyers), add the email and NRS details at the next reprint.',
        'Brief all staff who monitor email on what NRS calls look and sound like (a relay officer will introduce themselves and explain the process). Staff should be patient, as relay calls take longer than standard calls.'
      ],
      notes: 'NRS calls involve a relay officer who reads the caller\'s typed message aloud and types your spoken response back. Speak at a normal pace and pause after each sentence to allow typing time. The call will take roughly twice as long as a standard call.'
    },
    {
      title: 'Add web form with accessibility field and social media monitoring',
      description: 'Create a contact form that includes an optional "Accessibility requirements or questions" field, and establish a process for monitoring and responding to accessibility enquiries on social media. This gives customers two additional ways to reach you and ensures no enquiry falls through the cracks.',
      resourceLevel: 'medium',
      costRange: '$0-200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Add an "Accessibility requirements or questions" text area to your existing contact or booking form. Make it optional (not required) and place it after the standard fields.',
        'If your form has a "Subject" or "Enquiry type" dropdown, add "Accessibility enquiry" as an option. Configure this to route to a specific staff member or team.',
        'Set up form routing so accessibility enquiries go to a designated staff member rather than a general inbox. Configure a backup recipient for when the primary person is away.',
        'Create an auto-acknowledgement email: "Thank you for your accessibility enquiry. We will respond within 24 hours on business days. For urgent questions, please call [phone number] or use NRS [details]."',
        'Enable messaging on your Facebook page, Instagram account, and Google Business Profile if not already active.',
        'Assign a staff member to check social media messages and comments for accessibility questions at least twice daily (morning and afternoon).',
        'Write template responses for the 10 most common accessibility questions your venue receives. Include specific details, not vague assurances.',
        'Test the web form for keyboard accessibility and screen reader compatibility using the WAVE browser extension and Tab key navigation.',
        'Set a weekly calendar reminder to review response times and ensure no enquiry has been missed across any channel.',
        'Track accessibility enquiry volumes by channel per month to understand which channels customers prefer and where to focus resources.'
      ],
      notes: 'Social media accessibility questions are often visible to other potential customers. A prompt, helpful public response demonstrates your commitment to inclusion and can influence other visitors\' decisions.'
    },
    {
      title: 'Implement live chat with accessibility training and omnichannel management',
      description: 'Add a live chat tool to your website and implement an omnichannel enquiry management system that consolidates messages from all channels (phone, email, web form, live chat, social media) into a single dashboard. Train all operators on answering accessibility questions confidently. This ensures no accessibility enquiry is missed regardless of how it arrives.',
      resourceLevel: 'high',
      costRange: '$50-300/month',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Research live chat tools that meet accessibility standards (WCAG 2.1 AA compliant). Options include Zendesk Chat, LiveChat, Intercom, and Freshchat. Check that the chat widget is keyboard navigable and screen-reader compatible.',
        'Select and install a live chat tool on your website. Place the chat widget on your accessibility page, contact page, and booking page at minimum.',
        'Configure the chat to display operating hours and an offline message form. Set the offline message to include: "For accessibility questions, you can also email access@yourbusiness.com.au or call [number] (NRS available)."',
        'Set up an omnichannel dashboard (most live chat tools offer this) that pulls in messages from email, web form, live chat, Facebook Messenger, Instagram DM, and Google Business messages.',
        'Create a comprehensive accessibility knowledge base for chat operators: a shared document or wiki covering every accessibility feature, measurement, policy, and common question with approved responses.',
        'Run a 2-hour training session for all staff who will use the chat or respond to enquiries. Cover: your venue\'s accessibility features, how to check the knowledge base, appropriate language and terminology, how to handle requests for adjustments, and escalation procedures.',
        'Role-play 10 common accessibility enquiry scenarios during training. Include: wheelchair access questions, hearing loop enquiries, requests for Auslan interpreters, service animal policies, and requests for adjustments not covered by your standard offerings.',
        'Set up response time targets: live chat under 2 minutes, email within 24 hours, social media within 4 hours. Configure alerts when targets are at risk of being breached.',
        'Create a monthly report tracking: number of accessibility enquiries by channel, average response time, common question topics, and any enquiries that could not be resolved (indicating a gap in your offerings).',
        'Review the system quarterly. Update the knowledge base when venue features change, add new template responses for emerging question types, and adjust staffing based on enquiry volume patterns.'
      ],
      notes: 'When evaluating live chat tools, request a demo specifically testing screen reader and keyboard compatibility. Some chat widgets look accessible in marketing materials but have significant usability issues in practice. Ask the vendor for their VPAT (Voluntary Product Accessibility Template) or accessibility conformance report.'
    }
  ],

  resources: [
    {
      title: 'National Relay Service',
      url: 'https://www.infrastructure.gov.au/media-communications-arts/phone/services-people-disability/accesshub/national-relay-service',
      type: 'website',
      source: 'Australian Government',
      description: 'Free service enabling deaf, hard of hearing, and speech-impaired people to make phone calls. Includes NRS number formats and instructions for businesses receiving relay calls.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Accessible Customer Service Guide',
      url: 'https://www.and.org.au/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Tips for providing accessible customer communication, including guidance on multiple contact channels and staff training.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'WCAG 2.1 AA - Forms and Interactive Elements',
      url: 'https://www.w3.org/WAI/WCAG21/quickref/?showtechniques=1.3.1%2C1.3.5%2C2.4.6%2C3.3.2',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Technical guidance for ensuring your contact forms and live chat are accessible to people using screen readers, keyboard navigation, and assistive technologies.',
      isAustralian: false,
      isFree: true
    },
    {
      title: 'Deaf Australia - Communicating with Deaf People',
      url: 'https://deafaustralia.org.au/',
      type: 'website',
      source: 'Deaf Australia',
      description: 'Guidance on communication best practices for businesses interacting with deaf and hard of hearing customers, including NRS usage tips.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.1-F-1',
      questionText: 'Do you have accessibility information available for customers before they visit?',
      relationship: 'Contact options complement published accessibility information',
      moduleCode: '1.1'
    },
    {
      questionId: '1.1-F-6',
      questionText: 'Do staff know how to confidently respond to accessibility enquiries?',
      relationship: 'Staff training ensures contact channels are effective',
      moduleCode: '1.1'
    }
  ],

  keywords: ['contact', 'phone', 'email', 'chat', 'NRS', 'National Relay Service', 'communication', 'enquiry'],
  lastUpdated: '2026-02-24'
},

// 1.1-F-6
{
  questionId: '1.1-F-6',
  questionText: 'Do staff know how to confidently respond to accessibility enquiries?',
  moduleCode: '1.1',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Staff Confidence in Accessibility Enquiries',
  summary: 'When staff can answer accessibility questions with knowledge and confidence, customers feel welcomed and can plan their visit with certainty.',

  whyItMatters: {
    text: 'A customer calling to ask about wheelchair access or hearing loops needs a clear, accurate answer. If staff hesitate, give vague responses, or need to "check and call back" for basic questions, it signals that accessibility is not a priority. Confident responses build trust and directly influence whether someone chooses to visit.',
    statistic: {
      value: '83%',
      context: 'of people with disability say staff attitude is the biggest factor in whether they return to a business.',
      source: 'People with Disability Australia survey'
    }
  },

  tips: [
    {
      icon: 'BookOpen',
      text: 'Create a one-page accessibility fact sheet for staff.',
      detail: 'Cover the key topics customers ask about: accessible entrance location and how to get there, accessible parking (number of bays, distance to entrance), accessible toilets (location, transfer side, features), hearing augmentation (hearing loop location, how to activate it), quiet or low-sensory spaces, companion card acceptance policy, assistance animal policy, and who to escalate complex questions to. Laminate it and keep copies at reception, the phone area, and on the staff intranet. Update it immediately whenever anything changes.',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Include accessibility in staff induction, not just one-off training.',
      detail: 'New staff should learn your accessibility features as part of their standard orientation, just like fire exits and WHS procedures. Walk new staff through the accessible entrance, show them the accessible toilet, demonstrate the hearing loop, and point out any mobility equipment. Give them the fact sheet and allow time to read it. Test their knowledge informally after one week. If accessibility is treated as "additional" rather than "standard," staff will treat it as optional.',
      priority: 2
    },
    {
      icon: 'HelpCircle',
      text: 'Teach staff it is OK to say "I am not sure, let me find out" honestly.',
      detail: 'Guessing is worse than checking, because an incorrect answer can ruin a customer\'s visit. Train staff to respond: "That is a great question. I want to make sure I give you accurate information, so let me check and get back to you within [timeframe]." Always follow through within the stated timeframe. If a customer asks about something your venue does not offer, say so directly rather than giving a vague or evasive answer.',
      priority: 3
    },
    {
      icon: 'MessageCircle',
      text: 'Role-play common accessibility questions during team meetings.',
      detail: 'Practice builds confidence more effectively than reading a document. Dedicate 10 minutes at a monthly team meeting to role-play scenarios. Start with basic questions: "Where is the accessible entrance?", "Do you have a hearing loop?", "Can I bring my assistance dog?". Progress to more complex scenarios: "I use a power wheelchair and need a table with 750mm clearance, do you have one?", "My child has autism and loud noises are distressing. What can you do?". Rotate roles so every staff member practises both asking and answering.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Test staff accessibility knowledge',
    steps: [
      { text: 'Prepare a list of the 10 most common accessibility questions your venue receives (or is likely to receive). Examples: "Where is the accessible entrance?", "Do you have an accessible toilet?", "Is there a hearing loop?", "Do you accept companion cards?", "Can I bring my assistance dog?", "What is the wheelchair seating like?", "Is the path from parking to the entrance level?", "Do you have a quiet space?".' },
      { text: 'Ask three different front-line staff members the same 3-4 questions from your list (without warning). Record whether they answer correctly, consistently, and confidently. Note any hesitation, incorrect answers, or requests to "check and get back to you" for basic information.' },
      { text: 'Call your venue as a customer (or have a friend call) and ask about wheelchair access and one other accessibility feature. Rate the response on: accuracy, confidence, helpfulness, and whether the staff member offered additional information proactively.' },
      { text: 'Check if a written reference document (fact sheet, FAQ, or knowledge base) exists and is easily accessible to staff at all customer-facing points. Is it up to date? Does it cover all major accessibility features?' },
      { text: 'Ask staff: "What would you do if someone asked about a feature you were unsure about?" The ideal answer involves checking the fact sheet or asking a designated person, then getting back to the customer within a stated timeframe. If staff say they would guess or say "I think so," this indicates a training gap.' },
      { text: 'Review when accessibility was last covered in team training, induction, or meetings. If it has been more than 6 months, schedule a refresher. Check whether new staff hired in the past 6 months received any accessibility orientation.' },
      {
        text: 'Count the number of accessibility enquiries received in the past month across all channels. Compare this to the number that were escalated or required follow-up. A high escalation rate (over 30%) suggests staff lack the knowledge to answer common questions on the spot.',
        measurement: {
          target: 'Percentage of accessibility enquiries resolved on first contact',
          acceptable: '70% or higher resolved without escalation',
          unit: 'percent'
        }
      },
      { text: 'Survey staff anonymously: "On a scale of 1-5, how confident do you feel answering accessibility questions from customers?" and "What accessibility topics would you like more training on?" Use the results to target your next training session.' },
      { text: 'Check whether your staff handbook or operations manual includes a section on accessibility. If not, note this as a gap. The accessibility section should cover: venue features, customer communication guidelines, assistance procedures, and escalation contacts.' }
    ],
    tools: ['List of common accessibility questions (prepared in advance)', 'Phone (for mystery shopper test call)', 'Anonymous survey tool (Google Forms, SurveyMonkey, or paper)', 'Current staff fact sheet or FAQ document for review', 'Stopwatch for timing response times'],
    estimatedTime: '30-45 minutes for testing, plus 15 minutes to review documentation'
  },

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'Staff at a busy inner-city cafe gave inconsistent answers about wheelchair access. When a wheelchair user called to ask, one staff member said "yes, we are fully accessible," another said "not really, there is a step," and a third said they did not know. The customer visited based on the first answer, encountered the step, and posted a negative Google review. The owner was embarrassed to realise staff had never been briefed on the venue\'s actual access features.',
      solution: 'The owner created a laminated card displayed at the counter listing: accessible entrance (side door via laneway, ring bell for staff to open, 950mm wide), one step at front entrance (75mm, portable ramp available on request), accessible toilet (ground floor, left of bar, right-hand transfer, 1550mm turning circle), table spacing (tables 1-4 can accommodate wheelchairs with 1200mm clearance), and hearing loop (not available). All new staff reviewed the card during induction and signed off that they had read it. The card was updated whenever anything changed, with the revision date visible.',
      outcome: 'All staff now give consistent, accurate responses. The wheelchair user who posted the negative review was contacted, invited back with the ramp arranged, and updated their review to 4 stars. Three regular customers with mobility requirements commented on the improvement. The owner estimated the laminated card cost $3 to produce and saves 10 minutes per week of staff uncertainty.',
      cost: '$3 for laminated card, plus 1 hour to write content and brief staff',
      timeframe: '1 hour to create, then 5 minutes per new staff member for induction briefing'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'Front desk staff at a large conference centre could not answer questions about hearing loops, accessible seating configurations, or Auslan interpreter arrangements. Event organisers reported frustration at being transferred between departments or told "someone will call you back" for questions that should have had immediate answers. One organiser chose a competitor venue specifically because their staff could answer every accessibility question on the first call.',
      solution: 'The venue ran a 90-minute training session covering all accessibility features with a physical walkthrough of every accessible feature in the building. Staff visited the hearing loop control panel, sat in wheelchair seating positions, tested the accessible toilets, and practised operating the platform lift. A digital FAQ document was created with 25 questions and answers, accessible on all staff devices via a shared drive. The FAQ included photos, measurements, and the direct contact for the technical team if a question exceeded front-desk knowledge. Monthly 10-minute "accessibility check-ins" were added to team meetings for ongoing practice.',
      outcome: 'First-contact resolution for accessibility enquiries rose from 40% to 85%. Staff began proactively mentioning accessibility features during event bookings rather than waiting to be asked, which event organisers appreciated. The venue won back the organiser who had previously chosen a competitor venue. Staff survey scores for "confidence in answering accessibility questions" rose from 2.1 to 4.3 out of 5 within three months.',
      cost: 'Staff time only (90 minutes for initial training, 10 minutes monthly for check-ins)',
      timeframe: '90-minute training session, with ongoing 10-minute monthly check-ins'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Resort',
      scenario: 'A coastal resort with 120 rooms had three accessible rooms but reception staff frequently could not describe their features accurately. Guests would arrive expecting a roll-in shower and find a shower over bath, or expect grab rails that were not installed. Two guests in one month requested refunds due to misleading information provided at the time of booking. The resort manager realised no staff member had actually inspected the accessible rooms recently.',
      solution: 'The manager organised a "room familiarisation" session where all reception and reservations staff physically visited each accessible room with a checklist. They measured door widths, noted grab rail positions, photographed bathroom layouts, and recorded every feature. This information was compiled into a detailed room specification document with photos, stored in the booking system as a pop-up note for each accessible room. Staff were required to reference this document when answering any question about accessible rooms. A brief accessibility quiz was added to the annual performance review for all customer-facing staff.',
      outcome: 'Refund requests related to accessibility misinformation dropped to zero over the following six months. Guest satisfaction scores for accessible rooms improved from 3.2 to 4.6 out of 5. The room specification document was also shared on the website, further reducing pre-booking phone calls. Staff reported feeling much more confident and one reception team member said the familiarisation session was "the most useful training I have done here."',
      cost: '$0 (2 hours of staff time for familiarisation and document creation)',
      timeframe: '2-hour familiarisation session, then 15 minutes to update whenever rooms are refurbished'
    }
  ],

  solutions: [
    {
      title: 'Create an accessibility cheat sheet',
      description: 'Write a one-page summary of your venue\'s accessibility features and keep laminated copies at all customer-facing points. This is the fastest way to give every staff member consistent, accurate answers to the most common accessibility questions without requiring formal training.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1 hour',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Walk through your venue and list every accessibility feature and limitation. Cover: entrance type and location, door widths, parking, toilets, hearing augmentation, quiet spaces, lifts, ramps, assistance animal policy, and companion card acceptance.',
        'Organise the information under clear headings matching the questions customers actually ask: "How do I get in?", "Where can I park?", "Where is the accessible toilet?", "Do you have a hearing loop?", "Can I bring my assistance dog?", "Do you accept companion cards?".',
        'Note any limitations honestly. For example: "Upper floor not wheelchair accessible (no lift). Portable ramp available for front entrance step (ask staff)."',
        'Include specific measurements where relevant: door widths in mm, distances in metres, step heights, ramp gradient if known.',
        'Add the name and contact details of the staff member to escalate complex questions to.',
        'Print, laminate, and place copies at: reception desk, phone answering area, staff break room, and any other customer-facing point.',
        'Upload a digital version to your staff intranet or shared drive so it is accessible on phones and tablets.',
        'Brief all current staff on the cheat sheet in a 5-minute huddle. Walk through the key answers together.',
        'Add a "Review the accessibility cheat sheet" step to your new staff induction checklist.',
        'Set a calendar reminder to review and update the cheat sheet every 3 months or immediately after any venue changes.'
      ],
      notes: 'Print the date of the last update on the cheat sheet itself. This helps staff know the information is current and reminds you to update it regularly.'
    },
    {
      title: 'Add accessibility to staff induction and team meetings',
      description: 'Build accessibility knowledge into your standard staff induction process and reinforce it through regular team meeting check-ins. This ensures that every staff member, including new hires, has baseline knowledge and that skills are maintained over time rather than fading after a one-off training session.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours to set up, then 10 minutes monthly',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Write an accessibility induction module (1-2 pages) covering: your venue\'s specific features and limitations, where to find the cheat sheet, common questions and how to answer them, language and etiquette guidelines (e.g. ask before helping, speak directly to the person), and who to escalate complex requests to.',
        'Create a physical walkthrough route for new staff inductions: start at the accessible entrance, proceed to reception, demonstrate the hearing loop (if available), visit the accessible toilet, show the quiet space (if available), and point out any portable equipment and where it is stored.',
        'Allocate 15 minutes during every new staff induction for the accessibility walkthrough and module review.',
        'Add a sign-off checkbox to your induction form: "I have reviewed the accessibility information and completed the venue walkthrough."',
        'Add a 10-minute "accessibility scenario" to one team meeting per month. Present a question (e.g. "A customer calls and says they are deaf and want to book for a group of 8. What do you do?") and discuss as a team.',
        'Rotate scenarios to cover different disability types and situations: mobility, hearing, vision, cognitive, sensory, and complex requests involving multiple needs.',
        'Collect and share positive feedback from customers about staff accessibility responses. Recognising good practice reinforces the behaviour.',
        'Review the induction module every 6 months to update features, fix any inaccuracies, and incorporate lessons learned from real customer interactions.'
      ],
      notes: 'Treat accessibility induction as mandatory, not optional. If it is framed as "extra" or "nice to have," busy managers will skip it for new hires during busy periods.'
    },
    {
      title: 'Disability awareness training for all staff',
      description: 'Engage a professional disability awareness trainer to run a half-day or full-day session covering communication etiquette, practical assistance skills, and lived-experience perspectives. Professional training goes beyond venue-specific knowledge to build genuine empathy and understanding that transforms how staff interact with all customers.',
      resourceLevel: 'high',
      costRange: '$500-2,000',
      timeRequired: 'Half-day session, plus 1-2 hours for planning',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Research accredited disability awareness training providers in your area. The Australian Network on Disability (AND), local disability organisations, and state tourism bodies can recommend trainers. Ask for trainers with lived experience of disability.',
        'Brief the trainer on your venue type, typical customers, and the specific accessibility features and limitations of your premises. Share your cheat sheet and any customer feedback about accessibility.',
        'Schedule a half-day session (3-4 hours) at a time when the maximum number of customer-facing staff can attend. Ideally run two sessions to cover all shifts.',
        'Request the training covers: disability types and communication preferences, language and etiquette (person-first vs. identity-first, asking before helping), practical assistance scenarios specific to your venue, hearing from people with lived experience (either the trainer or guest speakers), role-playing accessibility enquiry conversations, and an action-planning exercise for your venue.',
        'Ensure the training venue and materials are themselves accessible (large print handouts, captioned videos, accessible room layout).',
        'After the training, distribute a summary of key takeaways and action items to all staff, including those who could not attend.',
        'Schedule a 1-hour refresher session every 12 months to maintain knowledge and address new situations that have arisen.',
        'Implement a "buddy system" where newly trained staff are paired with experienced colleagues during their first month for support on accessibility interactions.',
        'Track the impact: compare customer feedback and complaint data before and after training. Survey staff confidence levels before and 3 months after.',
        'Consider pursuing formal accreditation such as AND\'s "Access and Inclusion Index" or your state\'s accessible tourism certification to recognise your investment.'
      ],
      notes: 'Ask the trainer to include at least one person with lived experience of disability in the session. Research consistently shows that hearing directly from people with disability is the most effective way to shift attitudes and build genuine empathy. Budget $500 for a basic half-day session, or up to $2,000 for a full-day session with multiple presenters and follow-up coaching.'
    }
  ],

  resources: [
    {
      title: 'Disability Awareness Training - Australian Network on Disability',
      url: 'https://www.and.org.au/pages/disability-confidence-training.html',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Find accredited disability awareness training for your team. Includes both online modules and in-person facilitated sessions across Australia.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Disability Awareness eLearning - Australian Human Rights Commission',
      url: 'https://humanrights.gov.au/our-work/disability-rights',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Free resources on disability rights, communication guidelines, and employer obligations under the DDA.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'People with Disability Australia - Disability Etiquette',
      url: 'https://pwd.org.au/',
      type: 'guide',
      source: 'People with Disability Australia',
      description: 'Practical etiquette guidance written by people with disability, covering communication, physical assistance, and common mistakes to avoid.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'JobAccess - Employer Toolkit',
      url: 'https://www.jobaccess.gov.au/employers',
      type: 'website',
      source: 'Australian Government',
      description: 'Free employer resources covering workplace adjustments, communication strategies, and funding options for disability-related workplace modifications.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.1-F-5',
      questionText: 'Can customers contact you in a variety of ways to ask accessibility questions?',
      relationship: 'Contact channels are only as good as the staff answering them',
      moduleCode: '1.1'
    }
  ],

  keywords: ['staff', 'training', 'confidence', 'enquiries', 'customer service', 'induction', 'knowledge'],
  lastUpdated: '2026-02-24'
},

// 1.1-F-4
{
  questionId: '1.1-F-4',
  questionText: 'Would you like us to review a link to your accessibility information to help identify gaps and opportunities?',
  moduleCode: '1.1',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Reviewing and Improving Your Accessibility Page',
  summary: 'A well-structured accessibility page helps customers plan their visit. Regular review ensures the information stays accurate, comprehensive, and genuinely useful.',

  whyItMatters: {
    text: 'Your accessibility page is often the first thing a potential customer with disability checks. If it is incomplete, outdated, or hard to find, they may choose a competitor instead. Regular review ensures you are communicating your genuine accessibility features clearly and catching any changes that need updating.',
    quote: {
      text: 'I visited a venue that said it had an accessible entrance online, but when I arrived the ramp was removed for renovations. I drove 45 minutes for nothing.',
      attribution: 'Wheelchair user, online accessibility review'
    }
  },

  tips: [
    {
      icon: 'ClipboardCheck',
      text: 'Review your accessibility page quarterly or whenever something changes.',
      detail: 'Set a calendar reminder for the first Monday of each quarter (January, April, July, October). Also update immediately after any renovations, equipment changes, furniture rearrangements, or seasonal adjustments. If a hearing loop breaks, a ramp is removed for repair, or construction blocks an accessible entrance, update the page the same day. Note the "last reviewed" date at the bottom of the page so visitors can see when the information was confirmed.',
      priority: 1
    },
    {
      icon: 'MapPin',
      text: 'Walk the route a customer would take and verify every detail matches.',
      detail: 'Start from where a customer would arrive (car park, bus stop, taxi drop-off) and follow the path to every area mentioned on your page. Check that stated distances, step counts, door widths, and equipment availability still match reality. Bring a tape measure for door widths and a phone for distance tracking. Common discrepancies include: ramp gradient changes after resurfacing, door widths reduced by new door closers, and equipment moved to a different location.',
      priority: 2
    },
    {
      icon: 'Eye',
      text: 'Ask someone with disability to review your page for gaps.',
      detail: 'People with lived experience notice gaps that insiders overlook, such as missing information about surface types (gravel vs. concrete), noise levels in different areas, lighting quality, or the location of power outlets for charging mobility devices. Offer a small gift card or complimentary visit in exchange for their time. If you do not know anyone personally, contact a local disability organisation or advocacy group and ask if they can recommend a reviewer.',
      priority: 3
    },
    {
      icon: 'Image',
      text: 'Include recent, accurate photos of accessibility features.',
      detail: 'Photos are worth more than descriptions for accessibility planning. Photograph: the accessible entrance (showing the full doorway including threshold), the path from parking to entrance (showing surface and width), the accessible toilet (full room showing layout, grab rails, and space), any assistive equipment (hearing loop, portable ramp, wheelchair), and signage. Take photos at wheelchair height (approximately 1200mm from ground) where relevant. Replace photos after any changes and at least annually to ensure they reflect current conditions.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Conduct an accessibility page review',
    steps: [
      { text: 'Open your accessibility page (or wherever you list access features) in a web browser. Read it from start to finish as if you are a first-time visitor who has never been to your venue. Note anything that is unclear, vague, or assumes prior knowledge of the layout.' },
      { text: 'Check coverage against this topic list: entrances (type, location, door width), parking (number of bays, distance, booking), internal paths (width, surface, obstacles), lifts and ramps (location, dimensions), toilets (location, features, transfer side), hearing augmentation (type, location, how to use), sensory environment (noise, lighting, quiet spaces), equipment (portable ramps, wheelchairs, magnifiers), food and drink (dietary options, allergen labelling), assistance animals (policy, relief areas), and how to get help (contact details, NRS, staff assistance). Mark each topic as covered, partially covered, or missing.' },
      { text: 'Physically walk the venue with your page open on a phone or tablet. At each area mentioned, verify: Is the description still accurate? Have measurements changed? Is equipment still present and working? Are photos current?' },
      {
        text: 'Check specific measurements where stated on the page. Measure door widths, path widths, ramp lengths, and distances with a tape measure.',
        measurement: {
          target: 'Accuracy of stated door widths',
          acceptable: 'Within 20mm of actual measurement',
          unit: 'mm'
        }
      },
      { text: 'Test the page itself for web accessibility. Use the WAVE browser extension (free) to check for: missing alt text on images, poor colour contrast (below 4.5:1 ratio), missing heading structure, broken links, and form accessibility issues. Fix any errors identified.' },
      { text: 'Check the page on a mobile phone. Is it readable without horizontal scrolling? Are images sized appropriately? Can you tap links and buttons easily? Over 60% of accessibility page views are on mobile devices.' },
      { text: 'Verify the page is easy to find on your website. Test by: searching "accessibility" in your site search, checking the main navigation menu, checking the footer links, and counting clicks from the homepage. The page should be reachable within 2 clicks.' },
      { text: 'Ask someone unfamiliar with your venue (ideally someone with disability) to review the page and tell you whether they could plan a confident visit based solely on the information provided. Record their questions and gaps they identify.' },
      { text: 'Check that photos are current, well-lit, and accurately represent the feature. Remove or replace any photos that show outdated layouts, removed equipment, or conditions that have changed. Ensure every photo has descriptive alt text.' },
      { text: 'Document all findings in a simple spreadsheet or checklist: item, current status, action required, responsible person, and target completion date. Schedule a follow-up review in 3 months.' }
    ],
    tools: ['Computer and smartphone for testing the page', 'WAVE browser extension (free) for accessibility checking', 'Tape measure for verifying physical measurements', 'Camera or smartphone for updated photos', 'Printed checklist of topics to verify', 'Stopwatch for page load time testing'],
    estimatedTime: '45-60 minutes for full review'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A state gallery\'s accessibility page had not been updated in two years. It listed a hearing loop that had been removed during renovations, stated the accessible entrance was on Collins Street when it had been moved to Flinders Lane, and included photos showing the old reception layout. A visitor relying on the hearing loop drove 40 minutes to attend a talk, only to discover it was unavailable. The gallery received a formal complaint.',
      solution: 'The gallery manager conducted a full page review using a printed checklist, physically walking every area mentioned on the page. All outdated information was corrected, including the entrance location, toilet refurbishment details, and removal of the hearing loop reference (with a note that a replacement was being installed). Current photos were taken at wheelchair height. The page was reorganised into clear sections with proper headings. A quarterly review schedule was created with calendar reminders, and the "Last updated" date was displayed prominently at the top of the page. A local disability advocate was paid $150 to review the updated page and suggest further improvements.',
      outcome: 'The gallery received zero complaints about inaccurate information in the following 12 months. Visitor survey scores for "information quality" improved from 3.1 to 4.4 out of 5. The quarterly review process caught two further changes (a temporary exhibition blocking a pathway, and new construction near the accessible entrance) before they affected visitors. The disability advocate\'s review identified three gaps the team had missed, including the lack of information about tactile floor indicators and power outlet locations for scooter charging.',
      cost: '$150 for disability advocate review, plus 3 hours staff time for full review and updates',
      timeframe: '2 hours for initial full review, then 30 minutes per quarterly review'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A large suburban shopping centre had accessibility information buried in a 14-page PDF document that was itself not accessible to screen readers. The PDF had not been updated in three years and contained incorrect lift locations (one lift had been replaced), missing information about new accessible toilets added during a refurbishment, and no photos. Customers with vision impairments could not read the PDF at all, and customers with mobility requirements found the information unreliable.',
      solution: 'The centre moved all content to a dedicated HTML webpage with clear headings, alt-text photos of every access feature, and an interactive map showing accessible routes, lifts, escalators, and toilets. Each section was expandable so visitors could quickly find the specific information they needed. The interactive map was built using a free tool (Mapplic) and was keyboard navigable. Information was verified by walking the centre with a tape measure and camera. The old PDF was removed and redirected to the new page. The centre also listed each store\'s individual access features (step-free entry, width, etc.) in a sortable table.',
      outcome: 'Page views tripled compared to PDF downloads in the same period. Customer feedback specifically praised the interactive map and the per-store access table. The centre received an Accessible Tourism commendation from their state tourism body. The new format made quarterly updates simple because staff could edit individual sections without reformatting the entire document. Three accessibility bloggers linked to the page, further increasing visibility.',
      cost: '$500-1,000 (web developer time for interactive map and page build)',
      timeframe: '2 weeks for full content creation and page build'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Bed and Breakfast',
      scenario: 'A small B&B in a rural town had a single sentence on their website: "Please contact us for accessibility information." This told potential guests nothing useful and placed the burden entirely on them to investigate. The owner assumed their property was "not very accessible" and did not want to highlight limitations. As a result, they missed bookings from guests who would have been happy with the ground-floor room and accessible bathroom that actually existed.',
      solution: 'With guidance from their local tourism association, the owner completed an honest self-assessment of the property. They created a new accessibility section listing: ground-floor room available (no steps, 850mm doorway, queen bed 550mm high), ensuite with grab rail near toilet and step-free shower (800mm wide entry), car park 10m from entrance on gravel surface, no hearing loop, breakfast room accessible (level entry, table height 750mm), and a note that the garden path is uneven gravel not suitable for all wheelchairs. Photos of each feature were included. The owner also added their phone number and email with an invitation to discuss specific needs.',
      outcome: 'Within two months, the B&B received three bookings from guests with mobility requirements who specifically mentioned the detailed information helped them decide. One guest said it was "the most honest and useful accessibility description I have found for rural accommodation." The owner reported feeling relieved rather than anxious about the information, because being upfront about limitations prevented any negative surprises. Annual revenue from the ground-floor room increased by approximately $4,000.',
      cost: 'Free (2 hours to assess, photograph, and write content)',
      timeframe: '1 afternoon to complete'
    }
  ],

  solutions: [
    {
      title: 'DIY accessibility page audit',
      description: 'Walk through your venue with your accessibility page open on a phone and verify every claim against reality. Update text and photos wherever information is outdated, inaccurate, or missing. This self-guided audit catches the most common and harmful errors, like features that no longer exist or directions that have changed.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Print or save a copy of your current accessibility page (or take screenshots) so you can annotate it during the walkthrough.',
        'Start from where customers arrive: car park, street, or public transport stop. Walk the accessible route to the entrance, comparing every detail against what the page says.',
        'At each area mentioned on the page, check: Is the description accurate? Is the equipment present and working? Have distances, door widths, or layouts changed? Are photos current?',
        'Bring a tape measure and verify any stated measurements (door widths, path widths, counter heights). Record actual measurements next to stated measurements.',
        'Note any features that exist but are not mentioned on the page (e.g. a recently installed grab rail, a new quiet space, power outlets for mobility device charging).',
        'Note any features listed on the page that no longer exist or have changed (e.g. a removed hearing loop, a relocated entrance, a temporary closure).',
        'Update all text on the page to reflect current reality. Add new features, remove or correct outdated information, and update measurements.',
        'Take new photos where existing ones are outdated. Photograph at wheelchair height (approximately 1200mm) and ensure good lighting.',
        'Run the updated page through the WAVE browser extension to check for alt text, contrast, and heading issues. Fix any errors.',
        'Add or update the "Last reviewed" date on the page. Publish the changes and set a calendar reminder for the next quarterly review.'
      ],
      notes: 'Do the walkthrough at a time when the venue is set up normally (not during maintenance or events). If your venue has seasonal configurations (e.g. outdoor seating in summer, closed areas in winter), note these on the page with dates.'
    },
    {
      title: 'Peer review by disability community',
      description: 'Invite local disability organisations or individual customers with disability to review your accessibility page and suggest improvements. People with lived experience identify gaps that insiders consistently overlook. They can tell you not just what is missing, but what information they actually need to plan a confident visit.',
      resourceLevel: 'medium',
      costRange: 'Free-$200',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Identify 2-3 reviewers. Options include: customers with disability who visit your venue, members of local disability organisations (contact your local council for referrals), volunteers from advocacy groups like People with Disability Australia or your state\'s disability peak body, or staff members with disability within your own organisation.',
        'Prepare a brief for reviewers explaining what you are asking them to do: review the page from a customer\'s perspective and note any missing information, confusing language, or features they would want to know about. Provide 3-5 specific questions, such as: "Could you plan a visit based on this information alone?" and "What questions do you still have after reading it?"',
        'Offer fair compensation for their time: a gift card ($50-$100), complimentary visit, or payment. Do not expect unpaid labour from people with disability, even for "feedback."',
        'Send the page link to reviewers and allow at least one week for responses. Offer to accept feedback in whatever format works for them (written, phone call, video message, in-person meeting).',
        'Compile all feedback into a single document. Group suggestions by theme: missing information, inaccurate information, confusing language, page structure and navigation, photos and visual content, and technical accessibility.',
        'Prioritise fixes: address safety-critical inaccuracies immediately, then missing core information, then language and structure improvements.',
        'Implement changes and send the updated page to reviewers with a thank-you note explaining which suggestions were adopted and any that were not feasible (with reasons).',
        'Invite reviewers to become ongoing advisors for future reviews (quarterly or as needed). Building a long-term relationship is more valuable than a one-off review.'
      ],
      notes: 'Aim for reviewers with different types of disability (mobility, vision, hearing, cognitive, sensory) to get a range of perspectives. One reviewer with a wheelchair will identify different gaps than a reviewer who is deaf or a reviewer with autism.'
    },
    {
      title: 'Professional accessibility audit of web content',
      description: 'Engage an accessibility consultant to review both the content accuracy of your accessibility information and the technical accessibility of your website. A professional audit provides expert recommendations backed by standards (WCAG 2.1 AA, DDA), identifies compliance risks, and delivers a prioritised action plan that you can implement over time.',
      resourceLevel: 'high',
      costRange: '$1,000-3,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Research accessibility consultants who offer both content review and technical web accessibility auditing. Check the Australian Network on Disability directory, the Access Consultants Australia register, and your state tourism body for referrals.',
        'Request proposals from 2-3 consultants. The brief should specify: review of accessibility page content for accuracy and completeness, technical WCAG 2.1 AA audit of the accessibility page and booking pages, on-site visit to verify stated features, and a written report with prioritised recommendations.',
        'Select a consultant and schedule the audit. Allow 2-4 weeks for the full process (on-site visit, technical testing, report writing, and presentation).',
        'Provide the consultant with: your current accessibility page URL, any venue floor plans or maps, recent renovation or change records, and any customer feedback about accessibility information.',
        'Accompany the consultant on the on-site visit to answer questions and learn from their observations.',
        'Review the written report. It should include: a list of content inaccuracies and gaps, technical accessibility issues with severity ratings, WCAG 2.1 AA conformance status, and a prioritised action plan with estimated costs and timeframes for each fix.',
        'Implement quick-win fixes immediately (typically content corrections, alt text, and heading structure). Schedule medium-term fixes (new photos, content additions) within 1-2 months. Plan long-term fixes (technical web redevelopment, new features) within the annual budget cycle.',
        'After implementing fixes, ask the consultant to do a brief re-check (many include this in their fee) to verify the changes meet standards.',
        'Use the audit report to support funding applications for further accessibility improvements. Many grants require evidence of a professional audit.',
        'Schedule a repeat audit every 2 years or after major website or venue changes.'
      ],
      notes: 'A good accessibility consultant will not just list problems. They will explain the impact on real users and propose practical solutions for your specific venue type and budget. Ask for references from businesses similar to yours. Budget approximately $1,000 for a basic page review and $2,000-$3,000 for a comprehensive audit including on-site visit and technical testing.'
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.1-F-1',
      questionText: 'Do you have accessibility information available for customers before they visit?',
      relationship: 'Creating the page is step one; reviewing it keeps it useful',
      moduleCode: '1.1'
    },
    {
      questionId: '1.5-PC-4',
      questionText: 'Is accessibility information easy to find on your website (not buried or hidden)?',
      relationship: 'A great page is wasted if customers cannot find it',
      moduleCode: '1.5'
    }
  ],

  resources: [
    {
      title: 'Accessible Tourism Resource Kit',
      url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Comprehensive guide to making tourism businesses accessible, including templates for accessibility pages.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'WAVE Web Accessibility Evaluation Tool',
      url: 'https://wave.webaim.org/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free browser extension that identifies accessibility issues on your website pages.',
      isFree: true
    },
    {
      title: 'Access Consultants Australia',
      url: 'https://access.asn.au/',
      type: 'website',
      source: 'Association of Consultants in Access Australia',
      description: 'Find accredited access consultants who can professionally audit your accessibility information.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Human Rights Commission - Disability Rights',
      url: 'https://humanrights.gov.au/our-work/disability-rights',
      type: 'guide',
      source: 'Australian Human Rights Commission',
      description: 'Overview of disability rights obligations and guidance for businesses.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['review', 'audit', 'accessibility page', 'website', 'update', 'accuracy', 'photos'],
  lastUpdated: '2026-02-24'
},

// Module 1.2: Website Basics

// 1.2-1-1
{
  questionId: '1.2-1-1',
  questionText: 'Can all website content be accessed using only a keyboard (no mouse required)?',
  moduleCode: '1.2',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Keyboard Navigation for Your Website',
  summary: 'Keyboard navigation ensures people who cannot use a mouse (screen reader users, people with motor impairments, power users) can access all content and complete tasks on your website.',

  whyItMatters: {
    text: 'Keyboard access is the foundation of web accessibility. Screen readers, switch devices, voice control, and many other assistive technologies all rely on keyboard navigation working properly. If your website fails keyboard testing, it likely fails for a wide range of users with disabilities.',
    statistic: {
      value: '1 in 6',
      context: 'Australians use assistive technology. Many of these technologies depend on keyboard navigation to function.',
      source: 'Media Access Australia'
    }
  },

  tips: [
    {
      icon: 'Keyboard',
      text: 'Test by putting your mouse aside and navigating with Tab, Enter, and arrow keys.',
      detail: 'Tab moves forward between interactive elements and Shift+Tab moves backward. Enter or Space activates buttons and links, while Escape closes modals, dropdowns, and popups. Arrow keys navigate within composite widgets such as tab panels, radio groups, and menus. A common mistake is testing only the homepage; make sure to test every major page template including forms, galleries, and the booking flow.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Check for a visible focus indicator on every interactive element.',
      detail: 'WCAG 2.2 (criterion 2.4.7) requires a visible focus indicator at all times. The indicator should be at least a 2px solid outline in a colour with a 3:1 contrast ratio against the surrounding background. A common mistake is using CSS like "outline: none" or ":focus { outline: 0 }" to remove the browser default, without providing a replacement style. Check links, buttons, form fields, and embedded components individually.',
      priority: 2
    },
    {
      icon: 'AlertTriangle',
      text: 'Watch for keyboard traps where focus gets stuck.',
      detail: 'Keyboard traps occur when a user can Tab into an element but cannot Tab or Escape out. Common culprits include embedded Google Maps iframes, third-party chat widgets, video players, carousels with custom JavaScript, and CAPTCHA challenges. Test each of these by tabbing in and confirming you can leave with Tab or Escape. If a trap exists, add a skip link or implement proper focus management so users can exit the component.',
      priority: 3
    },
    {
      icon: 'ShoppingCart',
      text: 'Test the full booking or purchase flow with keyboard only.',
      detail: 'Date pickers, payment forms, and CAPTCHAs are the three most common points of keyboard failure in booking flows. Many date pickers only respond to mouse clicks. Payment iframes from third-party processors sometimes lack keyboard support. Always confirm that you can select dates, enter card details, check terms-and-conditions checkboxes, and submit the form using only keyboard. Provide a phone booking fallback for anything that cannot be made accessible quickly.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Keyboard navigation test',
    steps: [
      { text: 'Close or disconnect your mouse. Open your homepage in Chrome or Firefox and press Tab once. Observe where the focus indicator appears. It should land on the first interactive element (often the skip link or logo link).' },
      { text: 'Continue pressing Tab through the entire page. Count how many times you Tab before reaching the main content. If it takes more than 5-6 presses, your site may need a "Skip to main content" link.' },
      {
        text: 'Check that the focus order follows a logical reading sequence: left to right, top to bottom. Note any instances where focus jumps unexpectedly or skips visible elements.',
        measurement: {
          target: 'Focus order matches visual layout',
          acceptable: 'Focus never jumps more than one section ahead or backward unexpectedly',
          unit: 'sequence'
        }
      },
      { text: 'Tab through the main navigation. Press Enter on a menu item with a dropdown. Confirm the dropdown opens and you can navigate its items with arrow keys. Press Escape and confirm the dropdown closes and focus returns to the parent menu item.' },
      { text: 'Navigate to a page with forms (contact, booking, or enquiry). Tab through every field, select every dropdown option with arrow keys, check and uncheck checkboxes with Space, and submit with Enter. Note any fields that cannot receive focus or any controls that do not respond to keyboard input.' },
      { text: 'Try your booking flow end-to-end. Pay special attention to date pickers (can you select a date using arrow keys?), file upload fields, CAPTCHAs, and multi-step wizards. Record any step where keyboard-only completion is impossible.' },
      { text: 'Open any modal, popup, or dialog on the site. Confirm that focus moves into the modal when it opens, that you can interact with all elements inside it, and that pressing Escape closes it and returns focus to the trigger element.' },
      { text: 'Test any embedded third-party content: maps, social media feeds, chat widgets, video players. Tab into each and confirm you can Tab out again without getting stuck.' },
      {
        text: 'Check focus indicator visibility. As you Tab through, confirm every element shows a visible outline or highlight. Note any elements where focus is present (you can see it in DevTools) but no visual indicator appears.',
        measurement: {
          target: 'Focus indicator contrast ratio',
          acceptable: 'At least 3:1 against adjacent colours',
          unit: 'ratio'
        }
      },
      { text: 'Repeat the Tab test on at least three different page templates: homepage, a content page, and the booking or contact page. Record all failures in a spreadsheet with columns for page URL, element description, and the issue found.' }
    ],
    tools: ['Any web browser (Chrome, Firefox, Edge, Safari)', 'Browser DevTools (press F12 to inspect focus state)', 'Spreadsheet for recording issues (Google Sheets or Excel)'],
    estimatedTime: '30-45 minutes for a thorough audit'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '2.1.1 Keyboard, 2.1.2 No Keyboard Trap',
      requirement: 'All functionality must be operable through a keyboard interface without requiring specific timings. Users must not get trapped in any component.'
    },
    related: [
      {
        code: 'DDA',
        relevance: 'The DDA requires websites providing services to be accessible. Keyboard access is a core requirement.'
      }
    ],
    plainEnglish: 'Every link, button, form field, and interactive element on your website must work with just a keyboard. Users must never get stuck.',
    complianceNote: 'WCAG 2.1 AA is referenced in Australian Government accessibility policy and is increasingly expected of commercial websites under the DDA. The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A boutique hotel in Melbourne relied on a custom JavaScript date picker for its booking system. The picker opened on mouse click only and had no keyboard event handlers. Screen reader users, keyboard-only users, and people using switch devices could not select check-in or check-out dates, effectively blocking them from booking online.',
      solution: 'The developer replaced the custom date picker with the accessible Duet Date Picker component, which supports typed date entry (dd/mm/yyyy), arrow key navigation between days, and proper ARIA labels for screen readers. They also added a visible phone booking option on the same page as a fallback, and configured the existing booking confirmation email to mention the phone line for future changes.',
      outcome: 'Online bookings from assistive technology users increased by 18% in the first quarter. The phone fallback was also used by older guests, and the hotel received positive feedback on TripAdvisor mentioning the easy booking experience.',
      cost: '$200-500 (developer time for component swap)',
      timeframe: '1-2 days'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Online Shop',
      scenario: 'An Australian souvenir shop had a product filter sidebar that only worked with mouse hover interactions. Keyboard users could not filter by category, price range, or product type. The shopping cart "Update quantity" buttons were also custom div elements without keyboard event handlers, so keyboard users could add items but could not change quantities or remove them.',
      solution: 'The developer rewrote the filter using native HTML button and select elements, which have built-in keyboard support. They replaced the custom div quantity buttons with proper HTML button elements and added aria-label attributes (e.g., "Increase quantity of Koala Plush"). Visible focus styles with a 3px blue outline were added to all interactive elements. A skip link was added to jump directly to the product grid, bypassing the filter controls.',
      outcome: 'Checkout completion rates improved by 12% across all users, as the cleaner interaction model benefited mouse users too. Accessibility audit score on WAVE went from 23 errors to 2. The remaining 2 issues were in a third-party review widget and were reported to the vendor.',
      cost: '$500-1,000 (developer time for refactor)',
      timeframe: '2-3 days'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A regional zoo website featured an interactive map built with a canvas element. Visitors could click on animal enclosures to see feeding times and accessibility information. The entire map was inaccessible to keyboard and screen reader users. Additionally, the "Buy Tickets" call-to-action used a custom-styled span element instead of a button, so it could not receive keyboard focus.',
      solution: 'The zoo added an accessible text-based alternative to the map, organised as a collapsible list of areas with the same information. They converted the span-based "Buy Tickets" element to a native HTML button with matching CSS styling. They also implemented a skip link at the top of the map section reading "Skip interactive map, view text alternative." An accessibility statement page was created noting these improvements and inviting feedback.',
      outcome: 'Time on site for visitors using assistive technology increased by 35%. The text-based map alternative also improved SEO, as search engines could now index enclosure names and feeding times. Online ticket sales increased by 8% in the month following the fix, partly attributed to the more prominent and keyboard-accessible Buy Tickets button.',
      cost: '$800-1,500 (developer and content writer time)',
      timeframe: '3-5 days'
    }
  ],

  solutions: [
    {
      title: 'Fix visible focus indicators',
      description: 'Add or improve the CSS :focus and :focus-visible styles so keyboard users can always see which element is selected. This is the single highest-impact quick fix because it makes keyboard navigation usable without changing any HTML or JavaScript. Most sites only need 5-10 lines of CSS.',
      resourceLevel: 'low',
      costRange: 'Free-$100',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Open your site in Chrome and press Ctrl+Shift+F in DevTools to search all CSS files for "outline: none", "outline: 0", and ":focus { outline" to find any rules that remove the default focus indicator.',
        'Remove or comment out any CSS rules that set outline to none or zero on interactive elements. Keep outline removal only on :focus (not :focus-visible) if your design requires it, but ensure :focus-visible has a visible style.',
        'Add a global focus style in your main stylesheet: *:focus-visible { outline: 3px solid #1a73e8; outline-offset: 2px; } This provides a clear blue outline on all focusable elements.',
        'For dark backgrounds, add a specific rule: .dark-section *:focus-visible { outline-color: #ffffff; } to ensure the outline is visible against dark colours.',
        'Test the focus styles by tabbing through your homepage, a content page, and your booking page. Confirm the outline is visible on every link, button, form field, dropdown, and custom component.',
        'Check that the focus outline has at least a 3:1 contrast ratio against adjacent colours using the WebAIM Contrast Checker. Adjust the outline colour if needed.',
        'Verify that focus styles work in Chrome, Firefox, Safari, and Edge, as each browser handles :focus-visible slightly differently.',
        'Document the focus style rules in your team style guide or CMS documentation so future content and design updates maintain them.'
      ],
      notes: 'The :focus-visible pseudo-class only shows the focus ring for keyboard navigation, not mouse clicks. This gives a clean design for mouse users while maintaining accessibility for keyboard users. If you need to support older browsers, use :focus as a fallback.'
    },
    {
      title: 'Replace inaccessible interactive components',
      description: 'Swap custom dropdowns, date pickers, modals, and carousels for accessible alternatives from established component libraries. This addresses the root cause of most keyboard failures, which is custom JavaScript widgets that were built without keyboard support. The goal is to ensure every interactive element responds to Tab, Enter, Escape, and arrow keys appropriately.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Create an inventory of all custom interactive components on your site: date pickers, dropdowns, modals, carousels, accordions, tabs, tooltips, autocomplete fields, and image galleries.',
        'Test each component with keyboard only and record which ones fail. Prioritise components in the booking flow and main navigation.',
        'For date pickers, replace with Duet Date Picker (free, accessible) or Pikaday with keyboard plugin. Configure to accept typed dates in dd/mm/yyyy format.',
        'For dropdowns and select menus, use native HTML select elements where possible. For custom-styled dropdowns, use Headless UI (React), Radix UI, or Reach UI components that include keyboard support out of the box.',
        'For modals and dialogs, ensure they use the HTML dialog element or an accessible library (e.g., a11y-dialog). Focus must move into the modal on open, trap within the modal while open, and return to the trigger element on close.',
        'For carousels and sliders, use Splide.js or Flickity with accessibility options enabled. Ensure arrow keys navigate slides and the carousel has pause/play controls.',
        'For accordion and tab components, follow the WAI-ARIA Authoring Practices patterns. Arrow keys should move between tabs/headers, and Enter or Space should activate them.',
        'Test each replaced component with Tab, Shift+Tab, Enter, Space, Escape, and arrow keys. Verify focus management is correct.',
        'Run the WAVE extension on each page with replaced components to confirm no new errors were introduced.',
        'Document the accessible component choices in your development guidelines so future work uses the same libraries.'
      ],
      notes: 'When choosing component libraries, prefer those that follow WAI-ARIA Authoring Practices 1.2. Avoid building custom accessible components from scratch unless your team has specific accessibility expertise.'
    },
    {
      title: 'Full keyboard accessibility audit and remediation',
      description: 'Engage a web accessibility specialist to audit all interactive elements and fix keyboard navigation issues site-wide. This comprehensive approach catches issues that automated tools miss, such as incorrect focus order, missing skip links, improper ARIA usage, and subtle keyboard traps in third-party widgets. The specialist will provide a prioritised report and work with your development team to implement fixes.',
      resourceLevel: 'high',
      costRange: '$2,000-5,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Request quotes from at least two Australian accessibility consultancies. Look for firms that employ people with disabilities as testers. Reputable Australian firms include Intopia, Access iQ (now part of the Centre for Accessibility), and Digital Access Consulting.',
        'Provide the auditor with a list of all page templates and key user flows (booking, contact, account creation, search) so they can test the full range of interactions.',
        'Request that the audit include both automated scanning (axe, WAVE) and manual keyboard testing by a human tester, including testing with screen readers (NVDA on Windows, VoiceOver on Mac).',
        'Review the audit report. Expect findings categorised by severity (Critical, Major, Minor) with specific element selectors and remediation guidance for each issue.',
        'Prioritise Critical findings first: keyboard traps, completely inaccessible booking steps, and missing focus management on modals.',
        'Work with your developer or the specialist to fix Critical issues. Each fix should be tested by tabbing through the affected component before and after the change.',
        'Address Major findings next: poor focus order, missing skip links, non-standard keyboard patterns on custom components.',
        'Re-test all fixed issues and have the specialist verify the fixes meet WCAG 2.1 AA requirements.',
        'Implement an ongoing monitoring plan: schedule quarterly keyboard spot-checks on key pages and test any new features before launch.',
        'Document all changes and update your internal accessibility guidelines with the lessons learned from the audit.'
      ],
      notes: 'An accessibility audit is often the most cost-effective investment because it identifies all issues at once, preventing piecemeal fixes that miss interconnected problems. Many Australian government grants and tourism funding programs will cover accessibility audit costs.'
    }
  ],

  resources: [
    {
      title: 'WebAIM Keyboard Accessibility Guide',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'guide',
      source: 'WebAIM',
      description: 'Comprehensive guide covering keyboard testing methodology, expected keyboard behaviours for common components, and techniques for implementing keyboard support.',
      isFree: true
    },
    {
      title: 'WAVE Web Accessibility Evaluation Tool',
      url: 'https://wave.webaim.org/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free browser extension that identifies accessibility issues including missing focus indicators, keyboard traps, and ARIA errors. Available for Chrome, Firefox, and Edge.',
      isFree: true
    },
    {
      title: 'WAI-ARIA Authoring Practices 1.2',
      url: 'https://www.w3.org/WAI/ARIA/apg/',
      type: 'guide',
      source: 'W3C WAI',
      description: 'Official patterns and examples for building accessible widgets such as menus, tabs, dialogs, and carousels. Each pattern includes expected keyboard behaviour.',
      isFree: true
    },
    {
      title: 'Intopia Digital Accessibility Resources',
      url: 'https://intopia.digital/articles/',
      type: 'website',
      source: 'Intopia',
      description: 'Australian accessibility consultancy providing free articles, webinars, and guides on web accessibility including keyboard navigation best practices.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'Australian Government Digital Service Standard',
      url: 'https://www.dta.gov.au/help-and-advice/about-digital-service-standard',
      type: 'guide',
      source: 'Digital Transformation Agency (DTA)',
      description: 'Australian Government standard that mandates WCAG 2.1 AA compliance. Useful reference for understanding the legal context of web accessibility requirements in Australia.',
      isFree: true,
      isAustralian: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-3',
      questionText: 'Is your website text easy to read with good contrast between text and background?',
      relationship: 'Both are core WCAG requirements for basic web accessibility',
      moduleCode: '1.2'
    },
    {
      questionId: '1.3-PC-1',
      questionText: 'Have you tested whether someone can complete your booking using only a keyboard?',
      relationship: 'Booking-specific keyboard testing builds on general website keyboard access',
      moduleCode: '1.3'
    }
  ],

  keywords: ['keyboard', 'navigation', 'tab', 'focus', 'screen reader', 'WCAG', 'web accessibility'],
  lastUpdated: '2026-02-24'
},

// 1.2-1-2
{
  questionId: '1.2-1-2',
  questionText: 'Do images on your website have alt text or image descriptions?',
  moduleCode: '1.2',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Alt Text and Image Descriptions',
  summary: 'Alt text provides short descriptions of images so screen reader users understand visual content. Without it, images are invisible to people who cannot see them.',

  whyItMatters: {
    text: 'Screen readers announce images using their alt text. Without it, users hear "image" or the file name (like "IMG_3847.jpg"), which tells them nothing. For a tourism or hospitality website, images convey crucial information: what the venue looks like, how to find the entrance, what the rooms or spaces look like. Missing alt text hides all of this from blind and low-vision users.',
    statistic: {
      value: '575,000+',
      context: 'Australians are blind or have low vision. Many rely on screen readers to browse the web.',
      source: 'Vision Australia'
    }
  },

  tips: [
    {
      icon: 'Type',
      text: 'Describe the purpose of the image, not just what it shows.',
      detail: 'Think about why the image is on the page and what information it communicates. Good example: "Step-free entrance via side ramp on King Street." Poor example: "Photo of a building." For tourism sites, include accessibility-relevant details such as ramp visibility, step counts, door widths, and pathway surfaces. Keep alt text under 125 characters where possible, as some screen readers truncate longer text.',
      priority: 1
    },
    {
      icon: 'Image',
      text: 'Use empty alt text (alt="") for purely decorative images.',
      detail: 'Background patterns, decorative borders, spacer images, and purely aesthetic icons should have alt="" (an empty alt attribute, not a missing one). This tells screen readers to skip the image entirely. A missing alt attribute is different from an empty one: missing alt causes screen readers to read the file name, while empty alt causes them to skip it silently. Common mistake: adding alt text to decorative divider images, which clutters the screen reader experience.',
      priority: 2
    },
    {
      icon: 'FileText',
      text: 'Complex images like maps and infographics need longer descriptions.',
      detail: 'For complex visuals such as floor plans, maps, charts, and infographics, the alt attribute should contain a brief summary (e.g., "Floor plan of Level 1 showing accessible route from entrance to lift"), and a full text description should be provided nearby in an expandable section or a linked page. Use the aria-describedby attribute to connect the image to its long description. Never use "map" or "infographic" as the only alt text.',
      priority: 3
    },
    {
      icon: 'Search',
      text: 'Use the WAVE browser extension to find missing alt text quickly.',
      detail: 'WAVE highlights every image without alt text with a red error icon and every image with empty alt with a green "decorative" icon. Run WAVE on your top 10 most-visited pages first. Also check images added dynamically (e.g., in carousels or galleries loaded by JavaScript) by running WAVE after the page has fully loaded. WAVE also flags suspiciously short or duplicate alt text, which helps catch "image" or "photo" placeholders.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit images for alt text',
    steps: [
      { text: 'Install the WAVE browser extension (free, available for Chrome, Firefox, and Edge) from wave.webaim.org. Pin it to your browser toolbar for easy access.' },
      { text: 'Run WAVE on your homepage by clicking the extension icon. Wait for the page to finish loading, including any lazy-loaded images or carousels. Look for red error icons labelled "Missing alternative text." Count the total number of errors.' },
      {
        text: 'For each image with missing alt text, determine its purpose: Is it informative (conveys content), functional (is part of a link or button), or decorative (purely aesthetic)? Record this in a spreadsheet alongside the image file name and page URL.',
        measurement: {
          target: 'Images with appropriate alt text',
          acceptable: '100% of informative and functional images have descriptive alt text',
          unit: 'percentage'
        }
      },
      { text: 'For images that already have alt text, assess quality. Right-click the image, select "Inspect", and read the alt attribute in the HTML. Ask: Does it describe the purpose? Is it accurate? Would a blind user understand what the image communicates? Flag any that simply say "image", "photo", "DSC_0042.jpg", or similar unhelpful text.' },
      { text: 'Check that decorative images (backgrounds, dividers, icons next to text that already conveys the meaning) have alt="" (empty). In WAVE, these show as green icons. If a decorative image has descriptive alt text, change it to alt="" to reduce screen reader clutter.' },
      { text: 'Test complex images such as maps, floor plans, charts, and infographics. These should have a brief alt attribute summarising the key message plus a nearby text description or expandable details section providing the full information.' },
      { text: 'Open a screen reader (NVDA on Windows is free, or VoiceOver on Mac with Cmd+F5) and navigate through a photo gallery or image-heavy page. Listen to how each image is announced. Note any images that are confusing, missing, or redundant.' },
      {
        text: 'Check linked images (images inside anchor tags). The alt text for these must describe the link destination, not the image itself. For example, an image linking to a room details page should have alt="View Accessible King Room details" rather than alt="Photo of room."',
        measurement: {
          target: 'Linked image alt text describes destination',
          acceptable: '100% of linked images have alt text describing the link purpose',
          unit: 'percentage'
        }
      },
      { text: 'Repeat the WAVE scan on your 5-10 most-visited pages (check your analytics to identify these). Common candidates include: homepage, rooms/products page, booking page, contact page, and accessibility information page.' },
      { text: 'Compile your findings into a prioritised action list. Fix images on high-traffic pages first, then work through the rest. Aim to complete all Critical fixes (missing alt on informative images) within one week.' }
    ],
    tools: ['WAVE browser extension (free, wave.webaim.org)', 'Browser developer tools (built-in, press F12)', 'NVDA screen reader (free, nvaccess.org) or VoiceOver (built into Mac)', 'Spreadsheet for tracking (Google Sheets or Excel)'],
    estimatedTime: '30-60 minutes for a full audit of 5-10 pages'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '1.1.1 Non-text Content',
      requirement: 'All non-text content (images, icons, charts) must have a text alternative that serves the equivalent purpose.'
    },
    plainEnglish: 'Every meaningful image needs a text description. Decorative images should be marked so screen readers skip them.',
    complianceNote: 'This is one of the most commonly failed WCAG criteria and one of the easiest to fix. The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'B&B',
      scenario: 'A bed and breakfast in the Blue Mountains had 45 room photos across its website with no alt text on any of them. Screen reader users heard "IMG_3201.jpg" and similar filenames when browsing the gallery. A guest later reported they had wanted to book an accessible room but could not determine which room photos showed accessible features such as grab rails, roll-in showers, or step-free access.',
      solution: 'The owner spent one afternoon writing descriptive alt text for every photo, guided by the W3C Alt Text Decision Tree. Examples included: "Accessible King Room showing lowered bed frame, wide doorway to ensuite, and chrome grab rails beside toilet." They also added a text summary below each room photo gallery describing key accessibility features in plain English. The CMS (WordPress) was configured with the "Force Alt Text" plugin to prevent future image uploads without alt text.',
      outcome: 'Within two months, a blind traveller booked for the first time, later leaving a review saying it was the first accommodation website where they could actually understand the rooms. The text descriptions also improved Google Image Search rankings, resulting in a 22% increase in organic traffic to room pages.',
      cost: 'Free (3 hours of writing alt text, 15 minutes for plugin setup)',
      timeframe: '3-4 hours total'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular Sydney restaurant posted its seasonal menu as a series of JPEG images (photographed from the printed menu) with no alt text and no text-based alternative. Screen reader users encountered four unlabelled images and had no way to read the menu, allergen information, or pricing. The restaurant also used an image of their daily specials board on the homepage, which changed weekly but never had alt text updated.',
      solution: 'The restaurant added alt text summarising each menu image section (e.g., "Entrees section: six options ranging from $16 to $24, including vegetarian and gluten-free marked items"). They also created a dedicated text-based menu page in HTML with proper headings (h2 for each section), tables with allergen columns, and prices. The daily specials image was given a standing process: each Monday, the manager updates both the image and its alt text. A template was created to make this quick: "Today\'s specials: [dish 1] $[price], [dish 2] $[price], [dish 3] $[price]."',
      outcome: 'Screen reader users and people who use high zoom can now read the full menu independently. Search engine indexing of menu items improved SEO, driving a 15% increase in organic search traffic from queries like "gluten free restaurant Surry Hills." The daily specials update takes the manager under 2 minutes with the template.',
      cost: 'Free (4 hours to create HTML menu page, ongoing 2 minutes per weekly update)',
      timeframe: '4-5 hours initial setup, 2 minutes per week ongoing'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A regional art gallery website displayed 200+ artwork images in its online collection. None had alt text. The gallery had detailed catalogue information (artist, title, medium, dimensions, year) stored in their CMS database but this information was not connected to the image alt attributes. Blind art enthusiasts could not browse the collection at all, and the gallery was also missing an opportunity for search engine visibility.',
      solution: 'The web developer wrote a script to auto-populate alt text from the existing CMS catalogue fields using the template: "[Title] by [Artist], [Year]. [Medium], [Dimensions]." For 30 key works, a staff member also added a brief visual description (e.g., "Abstract composition with bold red and black geometric shapes on a white background"). A style guide was created for future additions, with examples of good and poor alt text. The CMS was configured to require alt text before any image could be published.',
      outcome: 'The online collection became accessible for the first time in the gallery\'s 15-year web history. Google Image Search traffic increased by 40% within three months as artwork titles and artists became indexable. The gallery received recognition from the Australian Network on Disability for their digital accessibility improvements.',
      cost: '$300-500 (developer time for script, plus 4 hours staff time for visual descriptions)',
      timeframe: '1-2 days'
    }
  ],

  solutions: [
    {
      title: 'Add alt text to key images on main pages',
      description: 'Start with your homepage, accessibility page, and most-visited pages. Write 1-2 sentence descriptions for each meaningful image, focusing on the information the image communicates rather than a literal description of every visual detail. This quick-win approach addresses the most visible gaps first.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Use your website analytics (Google Analytics or similar) to identify your top 5 most-visited pages.',
        'Open each page and list every image. For each, decide: Is it informative (shows something meaningful), functional (part of a link or button), or decorative (purely aesthetic)?',
        'For informative images, write alt text that describes the purpose and key information. Use this formula: "[What it shows] + [why it matters to the visitor]." Example: "Wide accessible entrance with automatic sliding doors on George Street."',
        'For functional images (images inside links), write alt text that describes the link destination. Example: for an image linking to your booking page, use alt="Book your accessible room."',
        'For decorative images, set alt="" (empty string). Do not delete the alt attribute entirely.',
        'Log into your CMS (WordPress, Squarespace, Wix, etc.) and edit each image to add the alt text. In most CMS platforms, click on the image and look for an "Alt text" or "Alternative text" field.',
        'After updating, run WAVE on each page to confirm all red "missing alt" errors are resolved.',
        'Preview the page and quickly tab through with a screen reader (NVDA or VoiceOver) to confirm the alt text sounds natural and informative.'
      ],
      notes: 'Most CMS platforms make adding alt text simple through the media library or image settings. If you use WordPress, the alt text field appears when you click on any image in the editor or media library.'
    },
    {
      title: 'Audit and update all website images',
      description: 'Use WAVE to systematically find every image missing alt text across your entire site and add appropriate descriptions. This medium-effort approach ensures full coverage and establishes a baseline inventory of all images. It also identifies quality issues with existing alt text such as duplicate descriptions, placeholder text, and overly generic labels.',
      resourceLevel: 'medium',
      costRange: 'Free-$500',
      timeRequired: '1-2 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Create a spreadsheet with columns: Page URL, Image File Name, Current Alt Text, Image Purpose (informative/functional/decorative), New Alt Text, Status (done/pending).',
        'Generate a list of all pages on your site using your sitemap (usually at yoursite.com/sitemap.xml) or a tool like Screaming Frog SEO Spider (free for up to 500 pages).',
        'Run WAVE on each page and record every image with missing or inadequate alt text in your spreadsheet.',
        'For each image, determine its type (informative, functional, or decorative) and write appropriate alt text. Use the W3C Alt Text Decision Tree (w3.org/WAI/tutorials/images/decision-tree/) for guidance on edge cases.',
        'Prioritise fixes by page traffic: high-traffic pages first, then work through lower-traffic pages.',
        'Update alt text in your CMS for all images. For images hard-coded in HTML templates (not managed by the CMS), provide the developer with a list of changes.',
        'For image galleries and carousels, ensure dynamically loaded images also have alt text. This often requires editing the gallery plugin settings or the data source (e.g., custom fields in WordPress).',
        'After all updates, re-run WAVE on a sample of 10 pages to verify the fixes. Confirm zero "missing alt" errors on those pages.',
        'Run a final check with a screen reader on 2-3 key pages to ensure alt text reads naturally and does not include unnecessary words like "image of" or "picture of" (screen readers already announce it is an image).'
      ],
      notes: 'Screen readers automatically announce "image" before reading the alt text. So writing alt="Image of the hotel entrance" results in the user hearing "Image, image of the hotel entrance." Simply write "Hotel entrance with step-free access via ramp" for a cleaner experience.'
    },
    {
      title: 'Establish alt text guidelines and CMS workflow',
      description: 'Create an alt text style guide for your team and configure your CMS to require alt text before images can be published. This long-term solution prevents future gaps by building accessibility into your content workflow. It includes training materials, templates, and automated checks.',
      resourceLevel: 'high',
      costRange: '$500-1,500',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Draft an alt text style guide covering: when to use descriptive alt text, when to use empty alt, maximum recommended length (125 characters), tone and language guidelines, and examples specific to your business type.',
        'Include a template library with common scenarios. For accommodation: room photos, bathroom features, building exterior, dining areas. For attractions: exhibits, maps, event spaces. For restaurants: menu images, dining spaces, food photos.',
        'Configure your CMS to require alt text on all image uploads. In WordPress, install the "Flavor" or "Force Alt Text" plugin. In Squarespace, add a reminder to your content publishing checklist. In custom CMS systems, add a validation rule requiring the alt field.',
        'Create a quick-reference card (one page, printable) with the top 5 rules for writing good alt text and pin it near content editors\' workstations.',
        'Conduct a 30-minute training session for all staff who upload content. Cover the basics of alt text, demonstrate the CMS workflow, and show a screen reader in action so staff understand the impact.',
        'Set up a quarterly review process: run WAVE on your 10 most-visited pages each quarter and check for any new images missing alt text.',
        'Document the alt text guidelines in your internal wiki or shared drive so new staff can find them during onboarding.',
        'Review and update the style guide annually or whenever your site undergoes a major redesign.'
      ],
      notes: 'Investing in a style guide and CMS workflow now prevents the accumulation of alt text debt over time. Without it, each new staff member or agency will handle images differently, and gaps will reappear.'
    }
  ],

  resources: [
    {
      title: 'Alt Text Decision Tree',
      url: 'https://www.w3.org/WAI/tutorials/images/decision-tree/',
      type: 'guide',
      source: 'W3C WAI',
      description: 'Official flowchart guide to deciding what alt text an image needs based on its context and purpose. Covers informative, decorative, functional, and complex images with examples.',
      isFree: true
    },
    {
      title: 'WAVE Web Accessibility Evaluation Tool',
      url: 'https://wave.webaim.org/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free browser extension that finds missing alt text, flags empty alt attributes, and identifies other image accessibility issues. Available for Chrome, Firefox, and Edge.',
      isFree: true
    },
    {
      title: 'Vision Australia Digital Access Hub',
      url: 'https://www.visionaustralia.org/services/digital-access',
      type: 'website',
      source: 'Vision Australia',
      description: 'Australian organisation providing web accessibility services, training, and resources. Offers audits conducted by people who are blind or have low vision.',
      isFree: false,
      isAustralian: true
    },
    {
      title: 'Australian Government Content Guide: Images',
      url: 'https://www.stylemanual.gov.au/content-types/images',
      type: 'guide',
      source: 'Australian Government Style Manual',
      description: 'Official Australian Government guidance on using images accessibly in digital content, including alt text writing tips and examples.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'Axe DevTools Browser Extension',
      url: 'https://www.deque.com/axe/devtools/',
      type: 'tool',
      source: 'Deque Systems',
      description: 'Free browser extension that runs automated accessibility checks including image alt text validation. Provides detailed remediation guidance for each issue found.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.4-PC-3',
      questionText: 'Do you include alt text or image descriptions when posting images on social media?',
      relationship: 'Alt text principles apply to social media images too',
      moduleCode: '1.4'
    }
  ],

  keywords: ['alt text', 'image description', 'screen reader', 'images', 'WCAG', 'accessibility', 'photos'],
  lastUpdated: '2026-02-24'
},

// 1.2-1-3
{
  questionId: '1.2-1-3',
  questionText: 'Is your website text easy to read with good contrast between text and background?',
  moduleCode: '1.2',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Text Contrast and Readability',
  summary: 'Good colour contrast between text and background ensures content is readable for people with low vision, colour blindness, and everyone using screens in bright environments.',

  whyItMatters: {
    text: 'Low contrast text is one of the most common accessibility barriers on the web. Light grey text on white backgrounds, text overlaid on photos, and "subtle" design trends can make content unreadable for the 1 in 8 men with colour blindness and the hundreds of thousands of Australians with low vision. Good contrast benefits everyone, including people reading on mobile screens in sunlight.',
    statistic: {
      value: '86%',
      context: 'of homepages have at least one instance of low-contrast text, making it the most common web accessibility failure.',
      source: 'WebAIM Million Report 2024'
    }
  },

  tips: [
    {
      icon: 'Contrast',
      text: 'Body text needs a contrast ratio of at least 4.5:1.',
      detail: 'Use a contrast checker tool to verify your colour combinations. Black (#000000) on white (#FFFFFF) gives a maximum 21:1 ratio. Dark grey (#333333) on white gives about 12.6:1, which is excellent. The common offender is medium grey (#999999) on white, which only achieves 2.8:1 and fails the requirement. For large text (18pt/24px regular or 14pt/18.5px bold and above), the minimum drops to 3:1, but aiming for 4.5:1 everywhere is simpler and safer.',
      priority: 1
    },
    {
      icon: 'Type',
      text: 'Check commonly missed areas: footer, placeholders, captions, and buttons.',
      detail: 'Footer links and copyright text are frequently set in light grey that fails contrast. Form placeholder text (the hint inside empty fields) often fails because browsers render it in a light colour by default. Image captions, breadcrumbs, "last updated" dates, and disabled button text are other frequent offenders. Make a checklist of these elements and test each one specifically with a contrast checker.',
      priority: 2
    },
    {
      icon: 'ImageOff',
      text: 'Avoid placing text directly over photographs.',
      detail: 'Photographs have varying light and dark areas, making consistent contrast impossible. If you must overlay text on an image, place a solid or semi-transparent dark overlay (at least 70% opacity black) behind the text area. A better approach is to place text in a solid colour block beside or below the image. If using a gradient overlay, test contrast at the lightest point of the image behind the text, not just the average.',
      priority: 3
    },
    {
      icon: 'Palette',
      text: 'Never rely on colour alone to convey meaning.',
      detail: 'Error messages should include an icon or text label in addition to red colouring, because people with red-green colour blindness may not distinguish them. Links should be underlined (not just a different colour) or have a non-colour indicator on hover/focus. Required form fields should have an asterisk or "required" label, not just a red border. Charts and graphs should use patterns or labels in addition to colour coding. This is a separate WCAG requirement (1.4.1 Use of Color) often tested alongside contrast.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Check your website contrast',
    steps: [
      { text: 'Install the WAVE browser extension and run it on your homepage. Look for yellow warning icons labelled "Very low contrast" and orange icons labelled "Low contrast." Count the total number of contrast warnings.' },
      {
        text: 'Open the WebAIM Contrast Checker at webaim.org/resources/contrastchecker. Enter your primary body text colour (foreground) and background colour. Record the ratio.',
        measurement: {
          target: 'Normal body text contrast ratio',
          acceptable: '4.5:1 minimum (7:1 recommended for AAA)',
          unit: 'ratio'
        }
      },
      { text: 'Test your heading text colours. Headings are often styled differently from body text and may use a brand colour that looks good but fails contrast requirements. Check each heading level (h1 through h4) against its actual background.' },
      {
        text: 'Check your footer specifically. Inspect the footer background colour and text colour. Footers frequently use light text on medium backgrounds that fail the 4.5:1 requirement.',
        measurement: {
          target: 'Footer text contrast ratio',
          acceptable: '4.5:1 minimum',
          unit: 'ratio'
        }
      },
      { text: 'Inspect form elements: check the contrast of placeholder text, field labels, helper text, error messages, and button text. For each, use the browser eyedropper tool (in Chrome DevTools, Elements tab, click on a colour swatch to open the picker with eyedropper) to sample the exact colours.' },
      { text: 'Check any text overlaid on images or coloured backgrounds. Use the Colour Contrast Analyser desktop app (free from TPGi) which has an eyedropper tool that can sample colours directly from the screen, including text on photos.' },
      { text: 'View your website on a mobile phone outdoors in bright sunlight. Can you read all text clearly? This real-world test often reveals contrast issues that look acceptable on a calibrated desktop monitor but fail in typical mobile usage conditions.' },
      { text: 'Install the "NoCoffee Vision Simulator" browser extension and enable the "Low contrast" or "Cataracts" simulation. Browse your site and note which areas become unreadable. These are your highest-priority fixes.' },
      {
        text: 'Download the TPGi Colour Contrast Analyser desktop application. Use its batch testing feature to check all colour combinations used in your CSS stylesheet systematically.',
        measurement: {
          target: 'All text-background combinations',
          acceptable: '100% of combinations meet 4.5:1 for normal text and 3:1 for large text',
          unit: 'percentage'
        }
      },
      { text: 'Record all failures in a spreadsheet with columns: Page, Element Description, Foreground Colour, Background Colour, Current Ratio, Required Ratio. Prioritise fixes by page traffic and severity (lower ratios are more urgent).' }
    ],
    tools: ['WebAIM Contrast Checker (free, online at webaim.org/resources/contrastchecker)', 'WAVE browser extension (free)', 'Colour Contrast Analyser desktop app (free, from TPGi)', 'NoCoffee Vision Simulator browser extension (free)', 'Browser DevTools eyedropper (built-in)'],
    estimatedTime: '20-40 minutes for a thorough check of 3-5 pages'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '1.4.3 Contrast (Minimum)',
      requirement: 'Text must have a contrast ratio of at least 4.5:1 against its background. Large text (18pt or 14pt bold) requires at least 3:1.'
    },
    plainEnglish: 'All text on your website must be clearly readable. Dark text on light backgrounds (or the reverse) with enough difference between the two colours.',
    complianceNote: 'Contrast failures are easily fixable once identified and often improve the design for all users. The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A Perth-based tour company used their brand colour palette extensively on the website, resulting in light grey (#999999) body text on a white background with a contrast ratio of only 2.8:1. Their primary call-to-action button used white text on a pastel orange (#FFB347) background with a ratio of 1.8:1. Visitors with low vision and colour blindness reported difficulty reading tour descriptions and could not see the booking buttons clearly.',
      solution: 'The marketing team worked with their graphic designer to update the brand style guide with minimum contrast ratios. Body text was changed to dark grey (#333333, ratio 12.6:1). The button colour was darkened to a deep orange (#C65102, ratio 4.6:1 with white text). They created a "Digital Colour Palette" supplement to the brand guide specifying exact hex codes approved for text, backgrounds, and interactive elements, each with their tested contrast ratio listed.',
      outcome: 'No negative design feedback from customers or stakeholders; several noted the site "looked cleaner." Customer engagement metrics improved: average time on page increased by 14% and bounce rate dropped by 8%. The company now checks contrast ratios as part of their content publishing workflow.',
      cost: 'Free (CSS colour value changes and updated style guide)',
      timeframe: '2-3 hours for CSS changes, half a day for style guide update'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme Park',
      scenario: 'A Queensland theme park website featured large hero banners on every page with promotional text overlaid directly on colourful photographs of rides and attractions. The text colour was white with no overlay or shadow, meaning contrast varied wildly depending on the underlying image area. On some images, text was nearly invisible. The "Buy Tickets" overlay text on the homepage photo had a contrast ratio as low as 1.3:1 against the bright sky portion of the image.',
      solution: 'The web team implemented three changes. First, they added a dark semi-transparent gradient overlay (linear-gradient from rgba(0,0,0,0.65) to transparent) behind all text on hero images. Second, for key promotional banners, they switched to a layout with text on a solid dark colour block beside the image rather than overlaid. Third, they added a text-shadow (0 2px 4px rgba(0,0,0,0.5)) as a secondary safety net for any remaining text-on-image instances. All changes were documented in the CMS content guidelines with visual examples of approved and rejected layouts.',
      outcome: 'Readability improved dramatically, with all text-on-image combinations now meeting at least 4.5:1 contrast. The marketing team adopted the new layout patterns for all future campaign pages. An accessibility advocacy group publicly praised the improvement, generating positive social media coverage that reached over 15,000 people.',
      cost: 'Free (CSS and layout template changes)',
      timeframe: '1 day for CSS implementation, half a day for guideline documentation'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Holiday Park',
      scenario: 'A coastal holiday park website used a custom font in a light weight (300) at 14px for body text. Even with adequate colour contrast (ratio of 5.2:1), the thin font weight made text difficult to read for people with low vision, dyslexia, and even typical users on mobile devices. Form labels used an even lighter weight (200) with a medium grey colour, compounding the readability problem.',
      solution: 'The developer increased the body font weight from 300 to 400 (regular) and the base font size from 14px to 16px. Form labels were updated to font-weight 500 (medium) with a darker colour achieving a 7:1 contrast ratio. Line height was increased from 1.3 to 1.5 for improved readability. The CSS changes were scoped carefully to avoid layout shifts on existing pages. A design token system was introduced to centralise all typography values.',
      outcome: 'Customer feedback surveys showed a 20% improvement in "ease of finding information" scores. Support calls asking for help with online bookings decreased by 30%, as visitors could now read form fields and instructions clearly on both desktop and mobile. The design token system also simplified future style updates.',
      cost: '$100-300 (developer time for CSS updates and testing)',
      timeframe: '3-4 hours'
    }
  ],

  solutions: [
    {
      title: 'Fix the worst contrast offenders',
      description: 'Run WAVE on your top 5 pages and fix any text that fails the 4.5:1 contrast requirement. This quick-win approach targets the most visible issues first, using free tools to identify and fix colour values. Most fixes require only changing a hex colour code in your stylesheet or CMS theme settings.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Run WAVE on your homepage and note all contrast warnings (yellow and orange icons).',
        'For each warning, click the icon in WAVE to see the exact foreground and background colours and the current contrast ratio.',
        'Open the WebAIM Contrast Checker and enter the failing colour combination. Use the lightness slider to find the nearest compliant colour that still fits your brand.',
        'Log into your CMS theme settings or CSS editor. Search for the failing colour hex code and replace it with the compliant alternative.',
        'If you cannot access CSS directly (e.g., on Squarespace or Wix), look in the theme customiser under Typography or Colours for the relevant setting.',
        'After making changes, re-run WAVE to confirm the warnings are resolved. Check that the visual design still looks good.',
        'Repeat for your 4 next most-visited pages.',
        'Document the approved colour values and share with anyone who creates content for the website.'
      ]
    },
    {
      title: 'Update brand style guide with contrast requirements',
      description: 'Add minimum contrast ratios to your brand guidelines so all future content meets standards automatically. This prevents contrast issues from recurring and gives your team a clear reference when creating new pages, marketing materials, and social media graphics. Include a tested digital colour palette with approved text and background combinations.',
      resourceLevel: 'medium',
      costRange: 'Free-$200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Compile a list of every colour used on your website: primary brand colour, secondary colours, text colours, background colours, button colours, and link colours.',
        'Test every foreground-background combination using the WebAIM Contrast Checker and record the ratios in a spreadsheet.',
        'For any combination that fails (below 4.5:1 for normal text or 3:1 for large text), use the contrast checker lightness slider to find the closest compliant alternative.',
        'Create a "Digital Colour Palette" page in your brand guide showing: each colour swatch, its hex code, which backgrounds it can be used on, and the tested contrast ratio for each approved combination.',
        'Add a rule to the style guide: "No text-background combination shall be used unless it appears in the approved Digital Colour Palette or has been tested to meet 4.5:1 minimum contrast."',
        'Include examples of common mistakes to avoid: light grey on white, white text on pastel backgrounds, brand colour on brand colour.',
        'Distribute the updated guide to all staff who create or approve web content, social media graphics, and email newsletters.',
        'Add a contrast check step to your content publishing workflow or checklist.'
      ],
      notes: 'A style guide only works if people use it. Consider printing the digital colour palette as a desk reference card and including it in new staff onboarding.'
    },
    {
      title: 'Site-wide contrast audit and CSS remediation',
      description: 'Have a developer audit your CSS for all colour combinations and fix them systematically. This thorough approach covers every page template, component state (hover, focus, active, disabled), and responsive breakpoint. It includes creating a design token system to prevent future regressions.',
      resourceLevel: 'high',
      costRange: '$500-2,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Export your complete CSS stylesheet(s) and generate a list of all unique colour values used (tools like CSS Stats at cssstats.com can do this automatically).',
        'Map every colour to its usage context: body text, headings, links, buttons, backgrounds, borders, form fields, error states, disabled states, hover states, and focus states.',
        'Test every foreground-background combination for WCAG compliance. Record results in a matrix showing which combinations pass and which fail.',
        'For each failing combination, determine the compliant replacement colour. Use the original colour as a starting point and adjust lightness/darkness until it passes while staying as close to the brand palette as possible.',
        'Implement a design token system (CSS custom properties) to centralise all colour values. Example: --color-text-primary: #333333; --color-text-secondary: #555555; --color-bg-surface: #FFFFFF;',
        'Replace all hard-coded colour values in your CSS with the corresponding design tokens.',
        'Test the updated styles across all page templates, checking both light and dark sections of the site.',
        'Verify hover, focus, and active states for all interactive elements. These are frequently missed in contrast audits.',
        'Test on multiple browsers (Chrome, Firefox, Safari, Edge) and devices (desktop, tablet, phone) to ensure consistent rendering.',
        'Set up an automated accessibility check in your deployment pipeline using a tool like axe-core or Pa11y to catch contrast regressions before they go live.'
      ],
      notes: 'A design token approach means contrast fixes only need to happen once. When you update a token value, it propagates everywhere that token is used. This dramatically reduces the chance of regressions.'
    }
  ],

  resources: [
    {
      title: 'WebAIM Contrast Checker',
      url: 'https://webaim.org/resources/contrastchecker/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Enter foreground and background colours to check if they meet WCAG requirements. Includes lightness sliders to find the nearest compliant colour.',
      isFree: true
    },
    {
      title: 'Colour Contrast Analyser',
      url: 'https://www.tpgi.com/color-contrast-checker/',
      type: 'tool',
      source: 'TPGi',
      description: 'Free desktop application (Windows and Mac) with an eyedropper tool for sampling colours directly from any area of the screen, including text on images.',
      isFree: true
    },
    {
      title: 'Australian Government Style Manual: Colour and Contrast',
      url: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/colour-and-contrast',
      type: 'guide',
      source: 'Australian Government Style Manual',
      description: 'Official Australian Government guidance on colour accessibility, including contrast requirements, colour-blind-friendly palettes, and testing methods.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'Who Can Use: Colour Contrast Simulator',
      url: 'https://www.whocanuse.com/',
      type: 'tool',
      source: 'Who Can Use',
      description: 'Free tool that shows how your colour choices affect readability for people with different types of vision impairments including cataracts, glaucoma, and colour blindness.',
      isFree: true
    },
    {
      title: 'Accessible Colour Palette Generator',
      url: 'https://venngage.com/tools/accessible-color-palette-generator',
      type: 'tool',
      source: 'Venngage',
      description: 'Free tool that generates accessible colour palettes meeting WCAG contrast requirements. Useful for creating brand-compliant colour schemes that work for everyone.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-1',
      questionText: 'Can all website content be accessed using only a keyboard?',
      relationship: 'Both are core WCAG requirements for basic web accessibility',
      moduleCode: '1.2'
    }
  ],

  keywords: ['contrast', 'colour', 'readability', 'text', 'WCAG', 'low vision', 'colour blindness'],
  lastUpdated: '2026-02-24'
},

// 1.2-1-4
{
  questionId: '1.2-1-4',
  questionText: 'Can users resize text or zoom the page without losing content or functionality?',
  moduleCode: '1.2',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Zoom and Text Resizing',
  summary: 'Many people with low vision zoom their browser to 200% or more. Your website should remain usable without content getting cut off, overlapping, or breaking.',

  whyItMatters: {
    text: 'About 1 in 6 Australians have some form of vision impairment. Many use browser zoom daily to read web content comfortably. If your website breaks at 200% zoom (text overlaps, menus disappear, content gets cut off), these users cannot access your information or complete bookings. Responsive design that handles zoom well also tends to work better on mobile devices.',
  },

  tips: [
    {
      icon: 'ZoomIn',
      text: 'Test at 200% zoom as a minimum (press Ctrl/Cmd and + to zoom).',
      detail: '200% is the WCAG 2.1 AA requirement under criterion 1.4.4 Resize Text. Press Ctrl/Cmd and + four times from the default 100% to reach 200%. Press Ctrl/Cmd and 0 to reset when done. A common mistake is only testing at 150% and assuming it will scale to 200%; layout issues often appear abruptly at specific breakpoints rather than gradually.',
      priority: 1
    },
    {
      icon: 'Layout',
      text: 'Content should reflow to fit the screen, not require horizontal scrolling.',
      detail: 'At 200% zoom and above, the page should behave like a narrow mobile screen with single-column layout. WCAG 1.4.10 (Reflow) requires that content at 400% zoom (equivalent to a 320px viewport width) is usable without horizontal scrolling. Horizontal scrolling is only acceptable for content that requires two-dimensional layout by nature, such as data tables, maps, and diagrams. If your regular text paragraphs require horizontal scrolling at 200%, your CSS likely uses fixed-width containers or pixel-based widths instead of relative units.',
      priority: 2
    },
    {
      icon: 'Menu',
      text: 'Navigation menus should adapt gracefully at high zoom levels.',
      detail: 'At 200% zoom, desktop navigation menus often run out of horizontal space and items wrap or overlap. The solution is to use responsive breakpoints that switch to a hamburger (mobile-style) menu when the viewport becomes narrow. A hamburger menu appearing at high zoom is perfectly acceptable. Menus disappearing entirely, overlapping content, or becoming unusable are failures. Also test that dropdown submenus remain fully visible when zoomed.',
      priority: 3
    },
    {
      icon: 'Maximize',
      text: 'Also test at 400% zoom for users with significant vision impairments.',
      detail: 'At 400% zoom, the layout will be very narrow (equivalent to a 320px mobile viewport). The page should be fully single-column with content stacked vertically. The key test is whether all content remains accessible and readable, even if the visual layout changes dramatically. Data tables may need horizontal scrolling at this level, which is acceptable. However, forms, navigation, and body text should never require horizontal scrolling. Users at this zoom level are typically using screen magnifiers like ZoomText or the built-in Windows Magnifier.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Test zoom behaviour',
    steps: [
      {
        text: 'Open your website in Chrome at default zoom (100%). Note the current viewport width by opening DevTools (F12), looking at the top-right of the responsive design toolbar. Record this as your baseline.',
        measurement: {
          target: 'Default viewport width',
          acceptable: 'Record for reference (typically 1280-1920px on desktop)',
          unit: 'pixels'
        }
      },
      { text: 'Zoom to 200% by pressing Ctrl/Cmd and + four times. Alternatively, use Ctrl/Cmd and scroll wheel, or go to the browser menu and set zoom to 200%. Check that the zoom level is displayed in the address bar or status bar.' },
      {
        text: 'Check text readability at 200%. Is all body text, heading text, button text, and navigation text fully visible? Does any text overlap other text or get cut off by container boundaries? Note any text that is truncated with "..." or hidden behind other elements.',
        measurement: {
          target: 'Text visibility at 200%',
          acceptable: '100% of text content visible and readable without horizontal scrolling',
          unit: 'percentage'
        }
      },
      { text: 'Test navigation at 200%. Can you access the full menu? If the menu has switched to a hamburger icon, open it and verify all menu items are present and clickable. Check that dropdown submenus open fully within the viewport and do not extend off-screen.' },
      { text: 'Scroll through the page at 200%. Confirm there is no horizontal scrollbar for regular content. If a horizontal scrollbar appears, identify which element is causing it (use DevTools to inspect overflow). Tables, wide images, and fixed-width containers are common causes.' },
      { text: 'Navigate to your booking or contact form. At 200%, verify that all form labels are visible next to or above their fields, all input fields are wide enough to see typed content, dropdown menus open and are fully readable, and the submit button is visible without horizontal scrolling.' },
      {
        text: 'Zoom to 400% (press Ctrl/Cmd and + eight times from 100%). The viewport is now equivalent to approximately 320px wide. Check that content reflows into a single column and remains accessible.',
        measurement: {
          target: 'Effective viewport at 400%',
          acceptable: 'All content accessible at 320px equivalent width',
          unit: 'pixels'
        }
      },
      { text: 'At 400%, test the same form or booking flow. Fields should stack vertically, labels should be above fields (not beside them), and all buttons should be full-width or at least easily tappable.' },
      { text: 'Check that no content is hidden behind sticky headers or footers at high zoom levels. Fixed-position elements can consume a large proportion of the viewport at 400%, leaving little room for actual content. If your header is 60px at 100%, it appears to be 240px at 400%.' },
      { text: 'Test the text-only zoom feature in Firefox: go to View then Zoom and select "Zoom Text Only." Increase to 200%. This tests whether your layout handles larger text without container overflow, which is a different scenario from full-page zoom.' }
    ],
    tools: ['Chrome, Firefox, or Edge browser (built-in zoom controls)', 'Browser DevTools for inspecting overflow and viewport dimensions (press F12)', 'Firefox "Zoom Text Only" mode (View menu)', 'Optional: Windows Magnifier (Win + Plus key) or macOS Zoom (Cmd+Option+Equals) for testing system-level magnification'],
    estimatedTime: '20-30 minutes for a thorough test across 3 page types'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '1.4.4 Resize Text, 1.4.10 Reflow',
      requirement: 'Text must be resizable up to 200% without loss of content or functionality. At 400% zoom (1280px viewport), content must reflow without horizontal scrolling.'
    },
    plainEnglish: 'Your website must remain usable when people zoom in. Text should not overlap, menus should still work, and content should not be hidden.',
    complianceNote: 'The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A Darwin hotel website used a fixed-width layout of 1200px for its main content container. At 200% zoom, the page required extensive horizontal scrolling to read room descriptions and the booking form. The room gallery thumbnails overflowed their container and overlapped the sidebar at 150% zoom. Visitors with low vision could not complete bookings online and were forced to call the front desk.',
      solution: 'The developer migrated the CSS from fixed pixel widths to relative units (max-width: 75rem with percentage-based padding). Media queries were added at 768px and 480px breakpoints to stack the layout into a single column. The image gallery was updated to use CSS grid with auto-fit and minmax() so thumbnails resize and reflow automatically. The booking form fields were changed from inline layout to stacked layout below 600px effective width. The navigation switched to a hamburger menu below 900px.',
      outcome: 'The site now works at 200% and 400% zoom without horizontal scrolling. Mobile usability scores in Google PageSpeed Insights improved from 62 to 91. Online booking conversions increased by 15% in the first month, partly from improved mobile performance and partly from low-vision users who could now book independently.',
      cost: '$1,500-3,000 (developer time for responsive refactor)',
      timeframe: '1-2 weeks'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A regional museum website had an event calendar built with a third-party plugin that used fixed-width table cells. At 150% zoom, the calendar overlapped with the sidebar, hiding event titles and ticket links. At 200%, the page was completely unusable. The museum had received complaints from older visitors and members with low vision who could not find event details or register for workshops online.',
      solution: 'The web team replaced the fixed-width calendar with a responsive alternative (The Events Calendar plugin with a responsive theme). They added a CSS media query that hides the sidebar and gives the calendar full width at viewports below 900px (which corresponds to approximately 150% zoom on a standard 1366px laptop). For high zoom levels, the calendar switches from a grid view to a list view, showing events in a readable single-column format with clear date headings. A "text view" toggle was also added for users who prefer a simple chronological list at any zoom level.',
      outcome: 'The calendar is now readable at all zoom levels up to 500%. The text view toggle became popular with all users, not just those with vision impairments, and reduced support enquiries about event schedules by 40%. The museum used the improvement as a case study in their annual accessibility report.',
      cost: '$200-500 (plugin cost and developer configuration time)',
      timeframe: '2-3 days'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe Chain',
      scenario: 'A cafe chain with 12 locations had a "Find a Cafe" page with an interactive map and location cards in a three-column grid. At 200% zoom, the location cards overlapped each other and the map extended off-screen to the right. Users could see only one and a half location cards, with text truncated, and the "Get Directions" buttons were hidden behind adjacent cards.',
      solution: 'The developer changed the location grid from a fixed three-column layout to CSS grid with auto-fit: grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)). At 200% zoom, cards automatically reflow to a two-column then single-column layout. The map was wrapped in a container with overflow: auto to allow independent scrolling, and a text-based location list was added below the map as an accessible alternative. Each location card was given a minimum height to prevent content truncation.',
      outcome: 'All 12 location cards are now fully readable at 400% zoom in single-column layout. The accessible location list also improved SEO for local search queries. Two customers specifically emailed thanking the cafe for making the location finder usable with their screen magnifier software.',
      cost: 'Free (CSS-only changes, 3 hours developer time)',
      timeframe: '3-4 hours'
    }
  ],

  solutions: [
    {
      title: 'Identify and fix critical zoom issues',
      description: 'Test your top pages at 200% zoom and fix the most impactful layout breaks, including overlapping text, hidden menus, and cut-off content. This quick-win approach addresses the issues that completely block users from accessing content or completing tasks. Most fixes involve changing CSS width values from pixels to relative units.',
      resourceLevel: 'low',
      costRange: 'Free-$200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Open your homepage at 200% zoom and take a screenshot. Annotate any areas where content overlaps, is hidden, or requires horizontal scrolling.',
        'Repeat for your booking/contact page and one content page. You should now have a list of 3-10 specific issues.',
        'For each issue, open DevTools (F12) and inspect the problematic element. Look for fixed pixel widths (e.g., width: 1200px) or overflow: hidden that clips content.',
        'Replace fixed widths with relative values: change "width: 1200px" to "max-width: 75rem" or "width: 100%". Change "width: 300px" on sidebars to "width: 25%" or use CSS grid/flexbox.',
        'For text that overlaps, check for fixed-height containers (e.g., height: 200px) and change them to min-height or remove the height restriction.',
        'For menus that break, add a media query that switches to a hamburger menu at the breakpoint where wrapping occurs. Example: @media (max-width: 900px) { .desktop-nav { display: none; } .mobile-nav { display: block; } }',
        'Test each fix at 200% and 400% zoom to confirm the issue is resolved without creating new problems.',
        'Re-test the full booking flow at 200% zoom to ensure all steps remain completable.'
      ],
      notes: 'The most common root cause of zoom failures is CSS that uses fixed pixel values for widths and heights. Switching to relative units (rem, em, %, vw) fixes most issues. If your site uses a CSS framework like Bootstrap, check that you are using its responsive grid classes correctly.'
    },
    {
      title: 'Ensure responsive design across breakpoints',
      description: 'Review and update CSS media queries so content reflows properly at all zoom levels from 100% to 400%. This involves a systematic review of every page template to ensure layouts adapt gracefully at common breakpoints (1200px, 900px, 600px, and 320px effective viewport widths). The result is a site that works for both zoom users and mobile device users.',
      resourceLevel: 'medium',
      costRange: '$500-2,000',
      timeRequired: '3-5 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Audit all page templates on your site. List each unique layout: homepage, content page, listing page, detail page, form page, gallery page, and any special pages.',
        'For each template, identify the layout structure: header, navigation, main content area, sidebar(s), footer, and any fixed-position elements.',
        'Test each template at 100%, 150%, 200%, 300%, and 400% zoom. Record every breakage in a spreadsheet with columns: Template, Zoom Level, Element, Issue, and Screenshot.',
        'Establish responsive breakpoints at these effective viewport widths: 1200px (large desktop), 900px (tablet/zoomed desktop), 600px (small tablet/high zoom), and 320px (mobile/400% zoom). Define the expected layout at each breakpoint.',
        'Update CSS for the header and navigation first, as these affect every page. Ensure the navigation switches to a mobile-style menu at the appropriate breakpoint.',
        'Update CSS for content areas: switch from multi-column to single-column layout at the 600px breakpoint. Ensure images resize within their containers using max-width: 100%.',
        'Address data tables: add overflow-x: auto to table containers so wide tables scroll horizontally within their container rather than breaking the page layout.',
        'Test forms at each breakpoint. Labels should move above fields (not beside) at narrow widths. Input fields should be full-width. Buttons should be easily tappable.',
        'Check fixed-position elements (sticky headers, cookie banners, chat widgets). At 400% zoom, these can consume the majority of the viewport. Consider making them position: static at high zoom levels.',
        'Perform a final end-to-end test at 200% and 400% zoom, navigating through the full user journey from homepage to booking completion.'
      ],
      notes: 'Browser zoom behaves the same as narrowing the viewport, so responsive design improvements benefit both zoom users and mobile users simultaneously. This makes the investment doubly valuable.'
    }
  ],

  resources: [
    {
      title: 'WCAG 2.1 Understanding Reflow',
      url: 'https://www.w3.org/WAI/WCAG21/Understanding/reflow.html',
      type: 'guide',
      source: 'W3C WAI',
      description: 'Official W3C guidance explaining the Reflow success criterion (1.4.10), including what qualifies as an exception and how to test for compliance at 400% zoom.',
      isFree: true
    },
    {
      title: 'Intopia: Understanding Zoom and Reflow',
      url: 'https://intopia.digital/articles/understanding-zoom-and-reflow/',
      type: 'guide',
      source: 'Intopia',
      description: 'Australian accessibility consultancy guide explaining the difference between page zoom and text-only zoom, with practical testing instructions and common failure patterns.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'Responsive Design Checker',
      url: 'https://responsivedesignchecker.com/',
      type: 'tool',
      source: 'Responsive Design Checker',
      description: 'Free online tool that previews your website at different viewport sizes, helping you identify layout issues that would appear at various zoom levels.',
      isFree: true
    },
    {
      title: 'Australian Government Style Manual: Accessible Design',
      url: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content',
      type: 'guide',
      source: 'Australian Government Style Manual',
      description: 'Official Australian guidance on creating accessible digital content, including requirements for responsive design and zoom compatibility.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'MDN Web Docs: Responsive Design',
      url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
      type: 'guide',
      source: 'Mozilla',
      description: 'Comprehensive developer guide to responsive CSS techniques including media queries, flexible grids, and relative units. Practical code examples included.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-5',
      questionText: 'Does your website work well on mobile devices?',
      relationship: 'Good zoom behaviour and mobile responsiveness share the same CSS techniques',
      moduleCode: '1.2'
    }
  ],

  keywords: ['zoom', 'resize', 'text size', 'reflow', 'responsive', 'low vision', 'magnification'],
  lastUpdated: '2026-02-24'
},

// 1.2-1-5
{
  questionId: '1.2-1-5',
  questionText: 'Does your website work well on mobile devices?',
  moduleCode: '1.2',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Mobile Accessibility',
  summary: 'Over 60% of tourism website visits come from mobile devices. A mobile-friendly site with readable text, easy-to-tap buttons, and smooth navigation is essential for all customers.',

  whyItMatters: {
    text: 'Mobile accessibility matters for everyone, but especially for people with disabilities. Many assistive technology users browse primarily on mobile (using VoiceOver on iPhone or TalkBack on Android). Small tap targets, tiny text, and broken mobile menus create real barriers. A site that works well on mobile is also likely to work well with assistive technology.',
    statistic: {
      value: '60%+',
      context: 'of website visits in tourism and hospitality come from mobile devices.',
      source: 'Google Travel Industry benchmarks'
    }
  },

  tips: [
    {
      icon: 'Smartphone',
      text: 'Buttons and links should be at least 44x44 pixels for easy tapping.',
      detail: 'WCAG 2.1 (criterion 2.5.5) specifies a minimum target size of 44x44 CSS pixels for touch targets. This prevents accidental taps on the wrong element, which is especially important for people with motor impairments, tremors, or limited fine motor control. Common offenders include inline text links in paragraphs (add padding to increase the tap area), close buttons on modals (often only 20x20px), and footer navigation links crammed together. Measure tap targets using DevTools: inspect the element and check its computed padding-inclusive dimensions.',
      priority: 1
    },
    {
      icon: 'Type',
      text: 'Text should be readable without pinching to zoom.',
      detail: 'Set your base font size to at least 16px for body text on mobile. Smaller text forces users to pinch-zoom, which is difficult for people with motor impairments and frustrating for everyone. Never use "maximum-scale=1" or "user-scalable=no" in your viewport meta tag, as these disable pinch-to-zoom and violate WCAG 1.4.4 (Resize Text). Check your viewport meta tag in the HTML head section to ensure it reads: <meta name="viewport" content="width=device-width, initial-scale=1">.',
      priority: 2
    },
    {
      icon: 'Columns',
      text: 'Content should fit the screen width with no horizontal scrolling.',
      detail: 'Wide data tables, images without max-width: 100%, embedded iframes (maps, videos) with fixed pixel widths, and pre-formatted code blocks are the most common causes of horizontal overflow on mobile. Use CSS overflow-x: auto on table containers so tables scroll independently. Set img { max-width: 100%; height: auto; } globally. For iframes, use a responsive wrapper: a container with padding-bottom: 56.25% (for 16:9 aspect ratio) and the iframe set to position: absolute with 100% width and height.',
      priority: 3
    },
    {
      icon: 'FormInput',
      text: 'Use appropriate input types for mobile keyboards.',
      detail: 'HTML input types trigger specific mobile keyboards that make data entry faster and less error-prone. Use type="email" for email fields (shows the @ symbol), type="tel" for phone numbers (shows the number pad), type="url" for website addresses, type="number" for quantities, and type="search" for search boxes (shows a Search button on the keyboard). For date fields, use type="date" to trigger the native date picker. Also add autocomplete attributes (e.g., autocomplete="email", autocomplete="tel") so browsers and password managers can auto-fill fields.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Mobile accessibility test',
    steps: [
      { text: 'Open your website on an actual mobile phone (not just a desktop browser resized). Use both an iPhone and an Android device if possible, as they render differently. Start with the homepage and navigate to your accessibility information page.' },
      {
        text: 'Check text readability without zooming. All body text should be comfortable to read at arm\'s length. If you need to squint or bring the phone closer, the text is too small. Measure body text size in DevTools: it should be at least 16px.',
        measurement: {
          target: 'Mobile body text size',
          acceptable: '16px minimum (18px recommended for body text)',
          unit: 'pixels'
        }
      },
      {
        text: 'Test tap target sizes on navigation links, buttons, form fields, and any interactive elements. Use Chrome DevTools mobile emulation (F12, then toggle device toolbar) and hover over elements to see their dimensions. Each interactive element should be at least 44x44 pixels including padding.',
        measurement: {
          target: 'Tap target dimensions',
          acceptable: '44x44 CSS pixels minimum (48x48 recommended)',
          unit: 'pixels'
        }
      },
      { text: 'Test the navigation menu on mobile. Tap the hamburger icon (if present). Does the menu open smoothly? Can you reach all pages? Do dropdown submenus work with touch? Can you close the menu by tapping the X button or tapping outside it?' },
      { text: 'Scroll through a long content page. Check for any horizontal scrolling (swipe left/right). If the page scrolls horizontally, identify the cause: a wide image, table, iframe, or fixed-width element. Note the URL and element for fixing.' },
      { text: 'Navigate to your booking or contact form. Fill in every field on mobile. Check that the correct keyboard appears for each field type: standard keyboard for names, email keyboard (with @) for email, number pad for phone, and date picker for dates. Ensure you can submit the form without issues.' },
      { text: 'Turn on VoiceOver (iPhone: Settings then Accessibility then VoiceOver) or TalkBack (Android: Settings then Accessibility then TalkBack). Navigate your homepage by swiping right to move through elements. Listen for meaningful announcements. Check that images are described, buttons are labelled, and the reading order makes sense.' },
      {
        text: 'Check your viewport meta tag by viewing page source (long-press the URL bar and select "View Source" or use DevTools). Confirm it does NOT contain "maximum-scale=1", "user-scalable=no", or "user-scalable=0", as these prevent pinch-to-zoom.',
        measurement: {
          target: 'Viewport meta tag',
          acceptable: 'width=device-width, initial-scale=1 (no zoom restrictions)',
          unit: 'meta tag value'
        }
      },
      { text: 'Test page load speed on mobile using Google PageSpeed Insights (pagespeed.web.dev). Enter your URL and view the mobile results. Slow-loading pages are an accessibility barrier for users on limited data plans or older devices. Aim for a Performance score of 70 or above.' },
      { text: 'Compile all findings into a prioritised list. Group issues as Critical (prevents task completion), Major (significantly impairs usability), and Minor (inconvenience). Fix Critical issues first, targeting resolution within one week.' }
    ],
    tools: ['An iPhone and/or Android phone for real-device testing', 'Chrome DevTools mobile emulation mode (press F12, then Ctrl+Shift+M)', 'VoiceOver (built into iPhone) or TalkBack (built into Android)', 'Google PageSpeed Insights (free, pagespeed.web.dev)', 'Spreadsheet for recording issues'],
    estimatedTime: '30-45 minutes for thorough mobile testing'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '2.5.5 Target Size, 1.4.10 Reflow',
      requirement: 'Interactive targets should be at least 44x44 CSS pixels. Content must reflow without loss of information at mobile viewport widths.'
    },
    plainEnglish: 'Your website must work well on phones and tablets, with easy-to-tap buttons, readable text, and no need for horizontal scrolling.',
    complianceNote: 'The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Operator',
      scenario: 'A Great Ocean Road tour operator had a mobile site with "Book Now" buttons measuring only 28x28 pixels and a hamburger menu that intermittently failed to respond to taps. The JavaScript touch event handler used "click" instead of "touchstart" causing a 300ms delay that users interpreted as the button not working. People with motor impairments found it nearly impossible to accurately tap the small booking buttons, and several abandoned the mobile site entirely.',
      solution: 'The developer increased all button and link tap targets to a minimum of 48x48 pixels by adding padding (padding: 12px 24px on buttons, padding: 10px on navigation links). The JavaScript was updated to use a "pointer events" approach compatible with both touch and mouse input, eliminating the 300ms delay. The hamburger menu icon was enlarged from 24x24 to 44x44 pixels with a visible active state (colour change on press) to provide feedback. Menu item spacing was increased to 16px between items to prevent accidental taps on adjacent links.',
      outcome: 'Mobile booking conversion rate improved by 25% in the first month. Customer support calls about "the website not working on my phone" dropped from approximately 8 per week to 1. The tour operator received positive Google reviews specifically mentioning the easy mobile booking experience. Bounce rate on mobile decreased by 18%.',
      cost: '$400-800 (developer time for CSS and JavaScript updates)',
      timeframe: '1-2 days'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A popular Melbourne cafe posted its weekly menu as a PDF optimised for A4 printing. On mobile, the PDF was nearly impossible to read without extensive pinch-to-zoom and scrolling. The text appeared at approximately 6px equivalent on a phone screen. Users with low vision could zoom in, but the two-column PDF layout required constant horizontal and vertical scrolling to read each item. The cafe also had a daily specials board photographed and posted on the homepage with no text alternative, and the photo was illegible on small screens.',
      solution: 'The cafe created an HTML version of the menu designed for mobile, using collapsible accordion sections for each category (Breakfast, Lunch, Drinks, Desserts). Each item shows the name, price, dietary icons (V, VG, GF, DF), and a brief description. Text is set at 18px with comfortable line height. The daily specials image was replaced with a styled HTML card that the manager updates each morning using a simple CMS form with fields for dish name, description, and price. A structured data markup (schema.org/Menu) was added for improved search engine visibility.',
      outcome: 'The menu page became the most visited page on the mobile site, with 3x more views than the previous PDF. Customers frequently mentioned using it at the table instead of waiting for a paper menu. The structured data improved Google search visibility for queries like "gluten free cafe Fitzroy" and "vegan breakfast Carlton." Weekly menu updates now take the manager 5 minutes instead of 20 (no more PDF creation and upload).',
      cost: '$150-300 (developer time for HTML menu template, or free with CMS template)',
      timeframe: '3-5 hours initial setup, 5 minutes per weekly update'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Resort',
      scenario: 'A Sunshine Coast resort had a mobile website that disabled pinch-to-zoom using "user-scalable=no" in the viewport meta tag. This was done intentionally to prevent the "double-tap zoom" behaviour that occasionally interfered with image galleries. However, this also prevented users with low vision from enlarging any text on the site. The booking form on mobile used tiny 12px font in input fields, and the date picker was a custom component that did not trigger the native mobile date picker, requiring precise taps on small calendar cells.',
      solution: 'The developer removed "user-scalable=no" from the viewport meta tag and instead fixed the double-tap issue by adding CSS touch-action: manipulation to the image gallery. The booking form font size was increased to 16px (which also prevents iOS Safari from auto-zooming into form fields). The custom date picker was replaced with native HTML date inputs (type="date") that trigger the built-in iOS and Android date pickers. All form labels were moved above their fields for a clean vertical layout on mobile. Autocomplete attributes were added to name, email, phone, and address fields.',
      outcome: 'Mobile bookings increased by 32% in the two months following the changes. The form completion time decreased from an average of 4 minutes 20 seconds to 2 minutes 45 seconds (measured via analytics). Accessibility complaints dropped to zero. The native date pickers were significantly easier to use for everyone, and the autocomplete attributes reduced typing by approximately 40% for returning visitors.',
      cost: '$200-500 (developer time)',
      timeframe: '1 day'
    }
  ],

  solutions: [
    {
      title: 'Increase tap target sizes',
      description: 'Update CSS to make all buttons, links, and form fields at least 44x44 pixels on mobile viewports. This is the single most impactful mobile accessibility quick-win because undersized tap targets cause frustration and errors for all users, and completely block some users with motor impairments. The fix is purely CSS with no JavaScript changes needed.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Open your website in Chrome DevTools mobile emulation (F12, then toggle device toolbar icon or Ctrl+Shift+M). Select a common phone size like iPhone 12 or Samsung Galaxy S21.',
        'Identify all interactive elements: buttons, links, form inputs, checkboxes, radio buttons, menu items, and icons. Use the element inspector to measure each element\'s clickable area (check computed width and height including padding).',
        'List all elements smaller than 44x44 pixels. Common offenders include: navigation links, footer links, social media icons, close buttons, pagination numbers, and inline text links.',
        'For buttons, add sufficient padding to meet the minimum size. Example: .btn { min-height: 44px; min-width: 44px; padding: 12px 24px; }',
        'For inline text links in paragraphs, increase line-height to at least 1.5 and add padding: .content a { padding: 4px 0; display: inline-block; } This increases the vertical tap area without changing the visual layout.',
        'For navigation menu items, ensure each item has at least 44px height with padding: .nav-link { padding: 12px 16px; display: block; }',
        'For small icon buttons (close, expand, share), add padding around the icon: .icon-btn { padding: 10px; min-width: 44px; min-height: 44px; }',
        'Ensure adequate spacing between adjacent tap targets. The gap between two tappable elements should be at least 8px to prevent accidental taps on the wrong element.',
        'Re-test all modified elements in mobile emulation to confirm they now meet the 44x44px minimum.',
        'Test on an actual phone to verify the improvements feel natural and the layout is not disrupted by the increased padding.'
      ],
      notes: 'Apple Human Interface Guidelines recommend 44x44 point tap targets, and Google Material Design recommends 48x48dp. Aiming for 48x48 pixels gives a comfortable buffer above the WCAG minimum.'
    },
    {
      title: 'Mobile-first responsive redesign',
      description: 'Rebuild key pages using a mobile-first approach, ensuring content works on small screens first then expands for desktop. This comprehensive solution addresses layout, typography, navigation, forms, and media for a fully mobile-accessible experience. It typically involves restructuring CSS from desktop-first media queries to mobile-first, and may include updating HTML structure for better content ordering.',
      resourceLevel: 'high',
      costRange: '$2,000-5,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Audit current mobile experience: test all page templates on a real phone, document every issue (layout breaks, small text, small tap targets, broken forms, horizontal scrolling), and prioritise by user impact.',
        'Define mobile-first breakpoints. Start with the mobile layout as default CSS (no media query), then add breakpoints for tablet (min-width: 768px) and desktop (min-width: 1024px). This ensures the mobile experience is the foundation.',
        'Restructure the CSS for typography: set base font size to 16px minimum, line-height to 1.5, and heading sizes that scale well on mobile. Use relative units (rem) for all font sizes so they scale with user preferences.',
        'Rebuild the navigation as a mobile hamburger menu by default, expanding to a horizontal menu at the tablet breakpoint. Ensure the mobile menu is accessible: focusable toggle button with aria-expanded, keyboard navigation inside the menu, and proper focus trapping.',
        'Convert all layouts to CSS flexbox or grid with responsive behaviour. Main content should be full-width on mobile, with sidebars stacking below. Use min() and clamp() CSS functions for fluid sizing.',
        'Update all images to be responsive: img { max-width: 100%; height: auto; }. For hero images, use the picture element with different image sources for mobile and desktop to serve appropriately sized files.',
        'Rebuild forms for mobile: labels above fields, full-width inputs, appropriate input types (email, tel, url, date), autocomplete attributes, and visible validation messages that do not require scrolling to see.',
        'Fix the viewport meta tag: <meta name="viewport" content="width=device-width, initial-scale=1">. Remove any maximum-scale or user-scalable restrictions.',
        'Optimise page load speed for mobile: compress images, defer non-critical JavaScript, minimise CSS, and enable browser caching. Test with Google PageSpeed Insights and aim for a mobile Performance score of 70+.',
        'Conduct a final review with screen reader testing (VoiceOver on iPhone, TalkBack on Android) to ensure the new mobile layout is fully accessible to assistive technology users. Fix any reading order issues caused by CSS layout changes.',
        'Set up ongoing monitoring: use Google Search Console mobile usability report to catch regressions, and include mobile testing in your pre-launch checklist for all future content updates.'
      ],
      notes: 'A mobile-first redesign benefits all users, not just those with disabilities. Google uses mobile-first indexing, meaning your mobile experience directly affects search rankings. Many tourism businesses see 60-70% of traffic from mobile, making this investment critical for business performance as well as accessibility.'
    }
  ],

  resources: [
    {
      title: 'Google Mobile-Friendly Test',
      url: 'https://search.google.com/test/mobile-friendly',
      type: 'tool',
      source: 'Google',
      description: 'Free tool to test if your website meets Google\'s mobile usability standards. Identifies specific issues such as text too small, clickable elements too close, and content wider than screen.',
      isFree: true
    },
    {
      title: 'Google PageSpeed Insights',
      url: 'https://pagespeed.web.dev/',
      type: 'tool',
      source: 'Google',
      description: 'Free tool that analyses your page load speed and usability on mobile devices. Provides specific recommendations for improving performance and a score out of 100.',
      isFree: true
    },
    {
      title: 'Intopia: Mobile Accessibility Testing Guide',
      url: 'https://intopia.digital/articles/mobile-accessibility-testing/',
      type: 'guide',
      source: 'Intopia',
      description: 'Australian accessibility consultancy guide to testing mobile websites with VoiceOver and TalkBack, including step-by-step instructions for common testing scenarios.',
      isFree: true,
      isAustralian: true
    },
    {
      title: 'Apple VoiceOver User Guide',
      url: 'https://support.apple.com/en-au/guide/iphone/iph3e2e415f/ios',
      type: 'guide',
      source: 'Apple',
      description: 'Official guide to using VoiceOver on iPhone, the most commonly used mobile screen reader in Australia. Useful for understanding how your mobile site is experienced by blind users.',
      isFree: true
    },
    {
      title: 'Australian Government Digital Service Standard: Mobile',
      url: 'https://www.dta.gov.au/help-and-advice/about-digital-service-standard',
      type: 'guide',
      source: 'Digital Transformation Agency (DTA)',
      description: 'Australian Government standard requiring digital services to work on mobile devices. Provides context for mobile accessibility requirements in Australian law and policy.',
      isFree: true,
      isAustralian: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-4',
      questionText: 'Can users resize text or zoom the page without losing content or functionality?',
      relationship: 'Mobile and zoom accessibility share responsive design techniques',
      moduleCode: '1.2'
    },
    {
      questionId: '1.3-PC-9',
      questionText: 'Does your booking process work well on mobile devices?',
      relationship: 'Mobile booking accessibility is a specific aspect of overall mobile usability',
      moduleCode: '1.3'
    }
  ],

  keywords: ['mobile', 'responsive', 'phone', 'tablet', 'touch', 'tap target', 'mobile-friendly'],
  lastUpdated: '2026-02-24'
},

// Module 1.3: Booking and Ticketing

// 1.3-PC-2
{
  questionId: '1.3-PC-2',
  questionText: 'Are customers invited to share their accessibility requirements during the booking or enquiry process?',
  moduleCode: '1.3',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Capturing Accessibility Requirements During Booking',
  summary: 'Proactively asking customers about accessibility needs during booking shows you are prepared to welcome them and allows your team to prepare in advance.',

  whyItMatters: {
    text: 'Many customers with disabilities do not mention their needs unless asked, often from past experience of being treated as difficult. A visible, optional accessibility field in your booking process signals that you welcome them and want to help. It also gives your team time to prepare, reducing stress for everyone on the day.',
    quote: {
      text: 'When a booking form asks about my access needs, I already feel welcomed before I arrive.',
      attribution: 'Wheelchair user, accessible tourism survey'
    }
  },

  tips: [
    {
      icon: 'FormInput',
      text: 'Add a dedicated "Accessibility requirements" field to your booking form.',
      detail: 'Make it optional but visible, placing it directly after the main booking details (such as dates and guest count). Do not bury it behind conditional logic, inside a collapsible "Other" section, or at the very end of the form where customers may miss it. Research from the Centre for Inclusive Design shows that visible accessibility fields increase self-disclosure by up to 60%.',
      priority: 1
    },
    {
      icon: 'Eye',
      text: 'Use inviting language that normalises the question.',
      detail: 'Try: "Do you have any accessibility requirements we can help with?" rather than "Special needs" or "Disabled requirements." The word "special" is considered patronising by many people with disabilities. Avoid medical language ("disability," "condition") and focus on practical language ("requirements," "preferences"). Test your wording with people who have lived experience before finalising it.',
      priority: 2
    },
    {
      icon: 'ListChecks',
      text: 'Offer common options as checkboxes plus a free-text field.',
      detail: 'Include options like "Wheelchair access," "Hearing loop," "Quiet seating," "Auslan interpreter," "Companion card," and "Large print or Braille materials." Always include an "Other (please specify)" free-text box because no checkbox list covers every need. Checkboxes reduce typing effort and help customers remember to mention needs they might otherwise forget. A common mistake is providing only a free-text field, which puts all the burden on the customer to know what to ask for.',
      priority: 3
    },
    {
      icon: 'Bell',
      text: 'Ensure someone actually reviews and acts on the information collected.',
      detail: 'A field nobody reads is worse than no field at all, as it creates a false expectation that the customer will be prepared for. Assign a specific person or role to review accessibility fields within 24 hours of each booking. Set up email notifications or booking system flags so requests do not get buried in a general notes field. Audit compliance monthly by checking what percentage of accessibility requests received a follow-up action.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your booking process for accessibility capture',
    steps: [
      { text: 'Open your booking platform (website, app, or third-party system like Rezdy, FareHarbor, or Little Hotelier) and start a new test booking as if you were a customer.' },
      { text: 'Progress through each step of the booking flow. Note whether there is any mention of accessibility requirements at any point. Record the exact step number and page where accessibility is (or is not) mentioned.' },
      { text: 'If a field exists, assess its visibility. Is it above the fold or does the user need to scroll? Is the label written in welcoming language? Is it clearly optional so customers do not feel pressured?' },
      { text: 'Check the field type. Is it a free-text box, checkboxes, or both? A best-practice setup includes 5 to 8 common checkboxes plus a free-text "Tell us more" field.' },
      { text: 'Submit a test booking with specific accessibility requirements (e.g., "Wheelchair user, need ground floor room with roll-in shower"). Track what happens to this information in your backend system.' },
      { text: 'Check your booking confirmation email within 5 minutes of submitting. Does it acknowledge the accessibility request by name, or does it only show generic booking details?' },
      { text: 'Log into your admin dashboard or booking management system. Can staff easily see and filter bookings that include accessibility requirements? Is the information prominent or buried?' },
      { text: 'Ask two front-line staff members: "When a booking includes accessibility requirements, what is the current process?" Compare their answers to identify inconsistencies.' },
      {
        text: 'Count how many bookings in the last 30 days included accessibility information. If the number seems low (under 2-3% of total bookings), the field may not be visible enough.',
        measurement: {
          target: 'Percentage of bookings with accessibility information',
          acceptable: '2-5% or higher of total bookings',
          unit: 'percent'
        }
      }
    ],
    tools: ['Computer or mobile device', 'Access to booking admin/backend', 'Booking confirmation email inbox', 'Spreadsheet for tracking results'],
    estimatedTime: '25-35 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A 45-room regional hotel only had a general "Notes" field at the bottom of their third-party booking engine. Guests with accessibility needs often did not think to use it, or their notes were overlooked by front desk staff during check-in preparation. This meant guests arrived to find rooms were unprepared, leading to complaints and last-minute room changes.',
      solution: 'The hotel worked with their booking platform provider (Little Hotelier) to add a dedicated "Accessibility and mobility requirements" section immediately after the room selection step. The section included checkboxes for six common needs (ground floor, grab rails, roll-in shower, hearing kit, visual doorbell alert, wheelchair-width doorway) and a free-text box labelled "Tell us anything else that will help us prepare for your stay." They also added an automated email rule that flags any booking with accessibility data for the Guest Services Manager to review within 24 hours.',
      outcome: 'Accessibility requests doubled from 3% to 6% of bookings in the first month (they were always there, just not being captured). Housekeeping now prepares rooms in advance, eliminating last-minute room changes. Guest satisfaction scores for accessibility went from 3.1 to 4.5 out of 5 within two quarters.',
      cost: '$350 (booking system customisation by provider)',
      timeframe: '2 days to configure and test'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Theatre',
      scenario: 'A 600-seat regional theatre used an online ticketing system with no way to request accessible seating, wheelchair spaces, companion seats, or audio description headsets. Patrons with disabilities had to phone the box office separately after booking online, which was inconvenient and meant the theatre often could not accommodate last-minute requests for equipment.',
      solution: 'The theatre added an "Access requirements" step in their Ticketmaster-hosted booking flow. This step appeared after seat selection and included checkboxes for: wheelchair space (with companion), transfer seat, audio description headset, hearing loop receiver, large-print programme, and "Other (please specify)." They also added a prominent note: "We welcome National Relay Service calls on 133 677." The box office team created a daily report of upcoming shows with accessibility requests so front-of-house could prepare equipment.',
      outcome: 'Phone calls to the box office for accessibility requests dropped by 70%. Equipment preparation is now done 24 hours before each show rather than scrambled at the door. Audio description headset usage increased by 40% because patrons could pre-book them easily.',
      cost: '$800 (ticketing system customisation)',
      timeframe: '3 days including staff training'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular waterfront restaurant used an online reservation system (OpenTable) that had no accessibility field. A regular customer who uses a power wheelchair stopped dining there after twice arriving to find no accessible table available, requiring an awkward rearrangement of furniture in front of other diners.',
      solution: 'The restaurant added a "Seating or accessibility preferences" free-text field to their OpenTable reservation flow and trained host staff to review it before each service. They also created three designated accessible table positions that are held until 2 hours before service if an accessibility request is pending. A laminated "accessibility prep" card was added to the pre-service checklist for floor managers.',
      outcome: 'The wheelchair-using customer returned and became a weekly regular again. Accessibility-related complaints dropped to zero over six months. The restaurant estimates the accessible table system generates an additional $15,000 per year in repeat business from customers with disabilities and their families.',
      cost: 'Free (OpenTable field configuration) plus $50 for laminated checklist cards',
      timeframe: '1 hour to configure, 30 minutes for staff briefing'
    }
  ],

  solutions: [
    {
      title: 'Add an accessibility field to your booking form',
      description: 'Add a single free-text field labelled "Do you have any accessibility requirements we can help with?" to your existing booking form. This is the minimum viable approach and can be done with most booking platforms in under an hour. It immediately signals to customers that you welcome accessibility conversations.',
      resourceLevel: 'low',
      costRange: 'Free-$100',
      timeRequired: '30 minutes - 2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Log into your booking platform admin panel (e.g., Rezdy, FareHarbor, Bookeo, Little Hotelier, OpenTable, or your website CMS).',
        'Navigate to the booking form editor or custom fields section.',
        'Add a new optional text field. Label it: "Do you have any accessibility requirements we can help with?"',
        'Set the field to "optional" so it does not block bookings for customers who do not need it.',
        'Position the field after the main booking details (dates, guests, room/service type) but before payment. Do not place it in a hidden "Additional info" section.',
        'Add placeholder text inside the field: "e.g., wheelchair access, hearing loop, ground floor, dietary requirements related to disability"',
        'Save and publish the updated form.',
        'Complete a test booking with accessibility text to verify it appears in your admin dashboard and confirmation email.',
        'Brief all staff who handle bookings on where to find this field in the system and what to do when it contains information.'
      ],
      notes: 'If your booking platform does not support custom fields, add the question to your booking confirmation email as a reply prompt: "Do you have any accessibility requirements? Reply to this email and we will prepare for your visit."'
    },
    {
      title: 'Build a structured accessibility capture with checkboxes',
      description: 'Create a dedicated section with common accessibility options as checkboxes plus a free-text field, integrated into your booking flow as a visible step. This reduces effort for customers and produces structured data your team can act on consistently. It also helps you identify patterns in the types of accessibility support most commonly requested.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Review accessibility requests from the last 6 to 12 months to identify the top 5 to 8 most common needs for your business type.',
        'Draft checkbox options based on your findings. Common options include: Wheelchair access, Hearing loop, Auslan interpreter, Ground floor or lift access, Quiet/low-sensory environment, Large print or Braille, Companion card, and Assistance animal.',
        'Brief your web developer or booking platform provider on the requirements. Share this checklist and specify placement (after main booking details, before payment).',
        'Request that checkboxes use clear, respectful labels. Avoid abbreviations or jargon (write "Hearing loop receiver" not "T-coil").',
        'Include an "Other (please tell us)" free-text box after the checkboxes for needs not covered by the preset options.',
        'Add a short introductory sentence above the section: "We want every guest to have a great experience. Let us know if any of these would help."',
        'Ensure the section is keyboard accessible and screen reader compatible (proper form labels, fieldset/legend grouping).',
        'Configure your booking system to flag or tag bookings that include any accessibility selection, so staff can filter and review them.',
        'Update your booking confirmation email template to include a line such as: "We have noted your accessibility requirements: [list selections]. Our team will be in touch if we need any further details."',
        'Test the full flow on desktop and mobile, including with a screen reader (VoiceOver on iPhone or NVDA on Windows) to verify the checkboxes are properly labelled.',
        'Train staff on interpreting and acting on the structured data. Create a one-page reference guide for common checkbox responses and what action each requires.'
      ],
      notes: 'Review and update checkbox options annually based on actual requests received. New needs will emerge as your customer base diversifies.'
    },
    {
      title: 'Integrate accessibility data with operations workflow',
      description: 'Connect booking accessibility data to your operational systems (PMS, event management, CRM) so the right teams are automatically notified and can prepare without manual handoff. This eliminates the risk of accessibility requests being seen by the booking team but not communicated to housekeeping, front-of-house, or event setup staff. The result is a seamless preparation process that scales with booking volume.',
      resourceLevel: 'high',
      costRange: '$1,000-3,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Map the full journey of an accessibility request from booking to day-of-visit. Document every handoff point where information currently gets lost or delayed.',
        'Identify the systems involved: booking engine, property management system (PMS), event management tool, CRM, staff communication (e.g., Slack, Teams, email).',
        'Work with your IT provider or a Zapier/Make automation specialist to create triggers: when a booking contains accessibility data, automatically notify the relevant team.',
        'For accommodation: route wheelchair or mobility requests to housekeeping, hearing loop requests to front desk, and dietary/allergy notes to the restaurant.',
        'For events: route Auslan interpreter requests to the events coordinator, wheelchair space requests to the seating team, and audio description requests to the AV team.',
        'Set up a confirmation workflow: when the responsible team member has prepared for the request, they mark it as "actioned" in the system, creating an audit trail.',
        'Build a pre-arrival report that runs daily, listing all upcoming bookings (next 48 hours) with accessibility requirements and their preparation status.',
        'Create escalation rules: if an accessibility request has not been actioned within 24 hours of the booking (or 48 hours before arrival, whichever is sooner), an alert goes to a manager.',
        'Test the entire workflow end-to-end with realistic scenarios: a wheelchair user booking a room, a deaf customer booking a tour, a blind customer booking event tickets.',
        'Train all relevant staff on their role in the workflow, including how to mark requests as actioned and how to escalate issues.',
        'Review the workflow quarterly using data: average response time, percentage of requests actioned before arrival, and any requests that were missed.'
      ],
      notes: 'If full system integration is not feasible, a shared spreadsheet or Trello board with automated email notifications from your booking system can achieve 80% of the benefit at 20% of the cost.'
    }
  ],

  resources: [
    {
      title: 'Accessible Tourism: Booking Systems Best Practice Guide',
      url: 'https://www.tourism.australia.com/en/events-and-tools/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Guidance on making tourism booking systems welcoming and accessible for people with disabilities.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Inclusive Design Toolkit: Forms and Data Collection',
      url: 'https://www.centreforinclusivedesign.org.au/',
      type: 'guide',
      source: 'Centre for Inclusive Design',
      description: 'Research-backed principles for designing inclusive forms that capture accessibility needs respectfully.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Companion Card Program',
      url: 'https://www.companioncard.gov.au/',
      type: 'website',
      source: 'Australian Government',
      description: 'Information on the Companion Card program, which allows a companion to accompany a person with disability at no extra charge.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'W3C Forms Tutorial: Accessible Form Design',
      url: 'https://www.w3.org/WAI/tutorials/forms/',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Technical guidance on building accessible web forms with proper labels, grouping, and error handling.',
      isFree: true
    },
    {
      title: 'Disability Discrimination Act 1992: Service Providers',
      url: 'https://humanrights.gov.au/our-work/disability-rights/disability-discrimination',
      type: 'website',
      source: 'Australian Human Rights Commission',
      description: 'Overview of service provider obligations under the DDA, including booking and reservation processes.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.3-PC-3',
      questionText: 'If a customer shares accessibility requirements, is there a process to follow up before their visit?',
      relationship: 'Capturing needs is only useful if someone follows up on them',
      moduleCode: '1.3'
    },
    {
      questionId: '1.3-PC-6',
      questionText: 'Are alternative ways to book available if someone cannot use the online booking system?',
      relationship: 'Alternative channels should also capture accessibility needs',
      moduleCode: '1.3'
    }
  ],

  keywords: ['booking', 'reservation', 'accessibility requirements', 'needs capture', 'form', 'accommodation'],
  lastUpdated: '2026-02-24'
},

// 1.3-PC-1
{
  questionId: '1.3-PC-1',
  questionText: 'Have you tested whether someone can complete your booking using only a keyboard (no mouse)?',
  moduleCode: '1.3',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Booking Form Keyboard Accessibility',
  summary: 'If your booking process cannot be completed with a keyboard alone, people who use screen readers, switch devices, or voice control are locked out of booking independently.',

  whyItMatters: {
    text: 'Booking is the moment a potential customer becomes an actual customer. If this step is inaccessible, all the other work you do on accessibility is undermined. Date pickers, payment forms, CAPTCHAs, and multi-step wizards are the most common points where keyboard access fails in booking systems.',
  },

  tips: [
    {
      icon: 'Keyboard',
      text: 'Put your mouse aside and try to complete your entire booking with keyboard only.',
      detail: 'Use Tab to move forward between fields, Shift+Tab to move backward, Enter or Space to select buttons and checkboxes, and arrow keys to navigate within dropdowns and date pickers. If you get "stuck" at any point (Tab does not move you forward, or focus jumps to an unexpected location), that is a keyboard trap, which is one of the most serious WCAG failures. Record the exact step where each issue occurs so you can brief your developer precisely.',
      priority: 1
    },
    {
      icon: 'Calendar',
      text: 'Pay special attention to date pickers, which are the most common failure point.',
      detail: 'Many custom date pickers require mouse clicks to open the calendar, select a month, and click a date. Accessible date pickers support arrow keys to move between days, Page Up/Page Down for months, and also accept typed dates in DD/MM/YYYY format as a fallback. If your date picker fails keyboard testing, consider replacing it with an accessible alternative such as Pikaday, React-Datepicker (with keyboard support enabled), or Duet Date Picker (built for accessibility). A common mistake is testing only the calendar popup and forgetting to test the month/year navigation controls.',
      priority: 2
    },
    {
      icon: 'CreditCard',
      text: 'Test the payment step separately, as it often uses third-party components.',
      detail: 'Payment forms from Stripe, Square, PayPal, and Braintree are embedded iframes with their own keyboard handling. Stripe Elements and PayPal Checkout generally have good keyboard support by default, but only if you have not overridden their default styling in ways that hide focus indicators. Check that you can Tab into the card number field, type details, Tab to expiry and CVV, and Tab to the submit button. If your payment provider offers an "accessible mode" or "ARIA-enhanced" option, make sure it is enabled in your integration settings.',
      priority: 3
    },
    {
      icon: 'Phone',
      text: 'Always offer a phone or email booking alternative as a safety net.',
      detail: 'Even with excellent keyboard accessibility, a human alternative ensures nobody is excluded. Display the alternative prominently near the booking button (not in the footer). Include a note such as: "Prefer to book by phone? Call us on (02) XXXX XXXX. We welcome National Relay Service calls on 133 677." This is especially important while you are working on fixing keyboard barriers in your online system.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Keyboard test your booking flow',
    steps: [
      { text: 'Open your booking page in Chrome or Firefox on a desktop computer. Unplug or set aside your mouse completely. If you are on a laptop, avoid using the trackpad.' },
      { text: 'Press Tab repeatedly to move through the page. Verify that a visible focus indicator (outline or highlight) appears on each interactive element. If focus disappears at any point, there may be hidden elements trapping focus.' },
      {
        text: 'Count the number of Tab presses needed to reach the first booking form field from the top of the page. Excessive tabs (more than 10 to 15) suggest missing skip links or poor page structure.',
        measurement: {
          target: 'Tab presses to reach first form field',
          acceptable: '10-15 or fewer',
          unit: 'key presses'
        }
      },
      { text: 'Tab through every form field in order. Verify they follow a logical sequence (e.g., date, then guests, then room type, then contact details). If focus jumps around unpredictably, the tab order needs fixing.' },
      { text: 'Test the date picker: press Enter or Space to open it, use arrow keys to navigate between dates, use Page Up/Page Down or equivalent to change months, and press Enter to select. If any of these fail, try typing a date directly into the field as a fallback. Note which actions work and which do not.' },
      { text: 'Test any dropdown menus or select boxes. Press Enter or Space to open, use arrow keys to navigate options, and Enter to select. Custom dropdown components (styled divs rather than native select elements) are the most likely to fail.' },
      { text: 'Fill in all required fields and proceed to the payment step. Verify you can enter card details, select payment method, and press the submit/pay button using only keyboard.' },
      { text: 'After submitting, check whether the confirmation page or message is announced. If using a screen reader (NVDA is free for Windows), verify the confirmation text is read aloud.' },
      { text: 'Repeat the entire test on your mobile booking flow if it differs from desktop. Mobile browsers have different keyboard/focus behaviour.' },
      { text: 'Document every failure point in a spreadsheet with columns: Step Number, Element Description, Expected Behaviour, Actual Behaviour, Severity (Critical/Major/Minor). Share this with your developer.' }
    ],
    tools: ['Desktop computer with Chrome or Firefox', 'Keyboard (external keyboard recommended for laptops)', 'NVDA screen reader (free, Windows) or VoiceOver (built into Mac/iOS)', 'Spreadsheet for documenting issues'],
    estimatedTime: '15-25 minutes'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '2.1.1 Keyboard',
      requirement: 'All functionality of the content must be operable through a keyboard interface.'
    },
    related: [
      {
        code: 'DDA',
        relevance: 'An inaccessible booking system may constitute discrimination in providing services under the DDA.'
      }
    ],
    plainEnglish: 'Your entire booking process must work with a keyboard. If someone cannot book independently because of keyboard barriers, that is a potential legal issue as well as a lost customer.',
    complianceNote: 'The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A tour company offering Blue Mountains day trips used a custom-built date picker that only responded to mouse clicks. Screen reader users and people with motor disabilities could not select tour dates, forcing them to call the office. The office was only staffed 9am to 5pm weekdays, meaning evening and weekend browsers were completely locked out of booking.',
      solution: 'The company replaced their custom date picker with the open-source Duet Date Picker component, which supports full keyboard navigation (arrow keys for days, Page Up/Down for months) and also accepts typed dates in DD/MM/YYYY format. They also added a visible focus indicator (2px blue outline) to all form fields and ensured the Tab order matched the visual layout. The developer time was approximately 4 hours.',
      outcome: 'Online bookings from assistive technology users became possible for the first time. The typed date option was unexpectedly popular with all users, with 35% of customers preferring to type dates rather than use the calendar. Mobile booking completion rates also improved by 12% because the typed fallback was easier on small screens.',
      cost: '$400 (4 hours developer time)',
      timeframe: '1 day'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A major zoo used a drag-and-drop interface to add tickets to cart (drag "Adult" tile into a basket icon). This was impossible without a mouse, excluding keyboard users, screen reader users, and many people with motor disabilities. The zoo had received three formal complaints through the Australian Human Rights Commission in one year.',
      solution: 'The development team added standard increment (+) and decrement (-) buttons for each ticket type alongside the existing drag-and-drop interface. Both methods now coexist. They also added proper ARIA labels to each button (e.g., "Add one adult ticket, current count: 2") and ensured the running total updates were announced to screen readers using an ARIA live region. The "Add to cart" button was given a visible focus indicator and a clear keyboard shortcut (Alt+C).',
      outcome: 'All users can now select tickets independently. The + and - buttons turned out to be preferred by 78% of all users, including on mobile devices where drag-and-drop was also difficult. Formal accessibility complaints dropped to zero. The zoo estimates the fix took 2 days of developer time and saved over $10,000 in potential complaint resolution costs.',
      cost: '$600 (2 days developer time)',
      timeframe: '2 days'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Boutique Hotel',
      scenario: 'A 20-room boutique hotel in the Barossa Valley used a booking widget embedded from a third-party provider. The widget had a CAPTCHA ("Select all images with traffic lights") that was impossible for screen reader users and extremely difficult for people with low vision. The hotel did not realise this because they only tested the booking flow with a mouse.',
      solution: 'The hotel contacted their booking widget provider and requested the CAPTCHA be replaced with an accessible alternative. The provider switched to hCaptcha with its accessibility cookie option, which offers an audio challenge alternative. The hotel also added a prominent "Having trouble booking? Call us on (08) XXXX XXXX or email stay@hotel.com.au" message directly above the CAPTCHA step. They set up a quarterly keyboard testing schedule for the entire booking flow.',
      outcome: 'Booking abandonment at the CAPTCHA step dropped from 18% to 4%. Two guests specifically mentioned in reviews that they appreciated the audio CAPTCHA option. The quarterly testing schedule caught a regression when the provider updated their widget six months later, allowing the hotel to request a fix before customers were affected.',
      cost: 'Free (provider configuration change) plus staff time for testing',
      timeframe: '3 days (waiting for provider to implement change)'
    }
  ],

  solutions: [
    {
      title: 'Test and document keyboard barriers',
      description: 'Go through your booking process with keyboard only and document every point where it fails or gets difficult. This creates a prioritised fix list that saves developer time and ensures the most critical barriers are addressed first. Even without technical skills, anyone can perform this test and produce useful documentation.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Open a spreadsheet and create columns: Step Number, Page/Screen, Element Description, Expected Behaviour, Actual Behaviour, Severity (Critical = cannot proceed, Major = difficult, Minor = annoying).',
        'Open your booking page in Chrome on a desktop computer and set your mouse aside.',
        'Press Tab repeatedly to navigate from the top of the page to the first booking form field. Count the number of presses and note if focus is always visible.',
        'Attempt to complete every step of the booking flow using only Tab, Shift+Tab, Enter, Space, and arrow keys.',
        'At each failure point, record the exact step, what you expected to happen, and what actually happened (e.g., "Date picker: expected arrow keys to change date, but nothing happened").',
        'After completing (or failing to complete) the flow, sort your findings by severity, with Critical items first.',
        'Take screenshots of each failure point by pressing Alt+PrintScreen (Windows) or Cmd+Shift+4 (Mac) and paste them into your spreadsheet.',
        'Share the document with your developer or booking platform provider with a request to fix Critical items within 2 weeks and Major items within 4 weeks.'
      ],
      notes: 'This documentation is valuable for prioritising fixes and briefing developers. Even if you cannot fix the issues yourself, a clear report dramatically reduces the time and cost of developer fixes.'
    },
    {
      title: 'Fix keyboard barriers in your booking flow',
      description: 'Replace inaccessible components (date pickers, dropdowns, CAPTCHAs) with accessible alternatives that support full keyboard navigation. Focus on the Critical and Major issues identified in your keyboard audit. This may involve swapping third-party components, adding ARIA attributes, or requesting updates from your booking platform provider.',
      resourceLevel: 'medium',
      costRange: '$500-2,000',
      timeRequired: '2-5 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Share your keyboard audit document (from the low-resource solution) with your web developer or booking platform provider.',
        'For date pickers: replace custom date pickers with accessible alternatives such as Duet Date Picker (web component, free), React-Datepicker (React, free), or Pikaday (vanilla JS, free). Ensure the replacement supports arrow key navigation and typed date entry.',
        'For dropdowns: replace custom styled dropdowns with either native HTML select elements or accessible custom components that use proper ARIA roles (listbox, option) and support arrow key navigation.',
        'For CAPTCHAs: switch to hCaptcha (offers audio alternative), Google reCAPTCHA v3 (invisible, score-based), or implement a honeypot field that catches bots without any user interaction.',
        'For multi-step wizards: ensure each step change is announced to screen readers using ARIA live regions, and that the user can navigate back to previous steps with keyboard.',
        'Add visible focus indicators to all interactive elements. Use CSS such as: outline: 2px solid #005fcc; outline-offset: 2px; on the :focus-visible pseudo-class.',
        'Ensure the Tab order matches the visual layout by checking that tabindex values are not set to positive numbers (use tabindex="0" or no tabindex for natural order).',
        'Test the fixes by repeating the full keyboard audit. Verify every Critical and Major issue is resolved.',
        'Run an automated accessibility scan using axe DevTools (free Chrome extension) or WAVE to catch any remaining issues the manual test might miss.',
        'Set up a quarterly reminder to re-test keyboard accessibility, especially after any booking system updates or redesigns.'
      ],
      notes: 'If your booking is through a third-party platform (Rezdy, FareHarbor, Bookeo), raise keyboard issues with their support team. Many platforms have accessibility settings that are not enabled by default. Document your request in writing for compliance records.'
    }
  ],

  resources: [
    {
      title: 'WebAIM Keyboard Accessibility Guide',
      url: 'https://webaim.org/techniques/keyboard/',
      type: 'guide',
      source: 'WebAIM',
      description: 'Comprehensive guide to keyboard accessibility testing and implementation, including common patterns and fixes.',
      isFree: true
    },
    {
      title: 'NVDA Screen Reader (Free Download)',
      url: 'https://www.nvaccess.org/download/',
      type: 'tool',
      source: 'NV Access',
      description: 'Free, open-source screen reader for Windows. Essential for testing how your booking flow works for screen reader users.',
      isFree: true
    },
    {
      title: 'axe DevTools Browser Extension',
      url: 'https://www.deque.com/axe/devtools/',
      type: 'tool',
      source: 'Deque Systems',
      description: 'Free Chrome and Firefox extension that scans web pages for accessibility issues, including keyboard traps and missing ARIA labels.',
      isFree: true
    },
    {
      title: 'Australian Government Digital Service Standard: Accessibility',
      url: 'https://www.dta.gov.au/help-and-advice/about-digital-service-standard',
      type: 'guide',
      source: 'Digital Transformation Agency (Australia)',
      description: 'Australian government standards for digital accessibility, applicable as best practice for private sector booking systems.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Duet Date Picker (Accessible Date Component)',
      url: 'https://github.com/niclaslindstedt/duet-date-picker',
      type: 'tool',
      source: 'Duet Design System',
      description: 'Free, open-source accessible date picker web component with full keyboard and screen reader support. Drop-in replacement for inaccessible date pickers.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-1',
      questionText: 'Can all website content be accessed using only a keyboard?',
      relationship: 'General website keyboard access is the foundation for booking accessibility',
      moduleCode: '1.2'
    }
  ],

  keywords: ['booking', 'keyboard', 'date picker', 'payment', 'forms', 'CAPTCHA', 'screen reader'],
  lastUpdated: '2026-02-24'
},

// 1.3-PC-6
{
  questionId: '1.3-PC-6',
  questionText: 'Are alternative ways to book available if someone cannot use the online booking system?',
  moduleCode: '1.3',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Alternative Booking Methods',
  summary: 'Phone, email, and in-person booking options ensure that customers who cannot use online systems are not excluded. These alternatives should offer the same service quality.',

  whyItMatters: {
    text: 'No matter how accessible your online booking is, some people will always need alternatives. A person with a complex cognitive disability may need a support worker to book by phone. Someone with severe low vision may find phone easier. Deaf customers may prefer email. Alternative methods should be genuinely equivalent, not a reduced experience.',
  },

  tips: [
    {
      icon: 'Phone',
      text: 'Display alternative booking options prominently, not as small print.',
      detail: 'Place alternative booking methods directly alongside or immediately below your online booking button, not buried in the footer or on a separate "Contact us" page. Use clear, inviting language such as "Prefer to book by phone? Call us on (02) XXXX XXXX" rather than a generic phone number with no context. Research shows that customers who need alternative channels often leave the site entirely if they cannot find the option within 10 seconds of looking.',
      priority: 1
    },
    {
      icon: 'Equal',
      text: 'Ensure all channels offer the same prices, availability, and confirmation.',
      detail: 'Online-only discounts, "web exclusive" rates, or features available only through the website create a two-tier system that penalises people who cannot use online systems. Under the Disability Discrimination Act 1992, providing a materially inferior service to someone because of their disability is unlawful. Audit your pricing across all channels quarterly. If you offer online promo codes, ensure phone and email staff can apply the same discounts. A common mistake is having real-time availability online but outdated availability for phone staff.',
      priority: 2
    },
    {
      icon: 'MessageSquare',
      text: 'Mention the National Relay Service for phone bookings.',
      detail: 'The National Relay Service (NRS) enables deaf, hard of hearing, and speech-impaired Australians to make phone calls through a relay officer. Adding "We welcome NRS calls on 133 677" to your website and promotional materials signals genuine inclusion. Train your phone staff on how NRS calls work: there will be a relay officer who speaks the caller\'s typed or signed words aloud, and the conversation takes roughly twice as long as a standard call. Never hang up on a relay call thinking it is a telemarketer.',
      priority: 3
    },
    {
      icon: 'Mail',
      text: 'Offer email booking for customers who prefer written communication.',
      detail: 'Email gives customers time to compose their message at their own pace, provides a written record of the booking, and works well for people who use assistive technology for text input. Commit to a maximum response time (24 hours is best practice, 48 hours is acceptable) and include this timeframe on your website so customers know what to expect. Use an auto-reply confirming the email was received and stating the response timeframe. A common mistake is having a booking email address that is checked infrequently or not at all.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your alternative booking channels',
    steps: [
      { text: 'Visit your website as a customer would. Without scrolling past the first screen, can you see at least one alternative to online booking (phone number, email address, or "book by phone" link)? Time how long it takes to find the first alternative booking option from the homepage.',
        measurement: {
          target: 'Time to find alternative booking method from homepage',
          acceptable: 'Under 10 seconds',
          unit: 'seconds'
        }
      },
      { text: 'Count the number of alternative booking channels available (phone, email, in-person, SMS, live chat, social media messaging). Best practice is at least two alternatives in addition to online booking.',
        measurement: {
          target: 'Number of alternative booking channels',
          acceptable: '2 or more alternatives besides online',
          unit: 'channels'
        }
      },
      { text: 'Call your own booking phone number. How many rings before someone answers? Is there a voicemail option with a callback promise? Is the phone number staffed during your advertised hours?',
        measurement: {
          target: 'Phone answer time',
          acceptable: 'Under 30 seconds or 5 rings',
          unit: 'seconds'
        }
      },
      { text: 'Send a test booking email to your booking address. Record the time until you receive: (a) an auto-acknowledgement, and (b) a human response confirming the booking.',
        measurement: {
          target: 'Email response time for booking request',
          acceptable: 'Auto-reply within 5 minutes, human response within 24 hours',
          unit: 'hours'
        }
      },
      { text: 'Compare pricing across all channels. Search for your most popular product/service and check the price online, then ask by phone, then ask by email. Are they identical? Are any promotional offers or discounts available on all channels?' },
      { text: 'Check whether phone and email staff can see real-time availability, or whether they are working from a separate (potentially outdated) system. Book the last available slot online and then immediately try to book the same slot by phone to verify synchronisation.' },
      { text: 'Look for National Relay Service (NRS) information on your website. Is "We welcome NRS calls on 133 677" displayed near your phone number? Ask your phone staff if they know what an NRS call is and how to handle one.' },
      { text: 'Attempt a phone booking and ask about accessibility requirements during the call. Does the phone staff member know how to record and action the request, or are they unsure?' },
      { text: 'Review your booking confirmation process across channels. Does a phone booking result in the same confirmation email as an online booking? Does an email booking receive a confirmation with the same detail level?' }
    ],
    tools: ['Phone (to test calling your own booking number)', 'Email account (to send test booking request)', 'Computer or mobile device for website review', 'Stopwatch or timer for measuring response times', 'Spreadsheet to record pricing across channels'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A regional museum switched to online-only ticketing during COVID and never reinstated alternative options. Elderly visitors, people with cognitive disabilities, and those without reliable internet access were effectively excluded. The museum received a formal complaint through the Australian Human Rights Commission from a blind visitor who could not complete the inaccessible online booking and found no alternative.',
      solution: 'The museum reinstated phone booking with a dedicated line staffed during opening hours, added email booking with a 24-hour response commitment, and reintroduced walk-up tickets for same-day visits. They added a prominent banner on their ticketing page: "Book online, by phone on (02) XXXX XXXX (NRS: 133 677), or by email at tickets@museum.org.au. Walk-up tickets also available." Phone and email staff were given access to the same real-time inventory system used by the online platform. The museum also created a simple one-page booking email template for staff to use when confirming email bookings.',
      outcome: 'Phone and email bookings now account for 15% of all tickets. Visitor satisfaction surveys improved by 22%, particularly among visitors aged 65+ and visitors with disabilities. The formal complaint was resolved without further action. Staff reported that phone bookings often result in longer, more personalised interactions that build loyalty.',
      cost: 'Staff time only (approximately 5 hours per week for phone and email bookings)',
      timeframe: '1 week to set up processes and train staff'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A whale-watching tour company on the NSW coast only accepted bookings through their website, which was not screen reader accessible and had a complex multi-step form. A support worker tried to book on behalf of a client with an intellectual disability but could not navigate the form. The company was losing bookings from disability support organisations who wanted to bring groups.',
      solution: 'While working on long-term website accessibility fixes, the company immediately added phone and email booking with clear promotion on the homepage: "Book online, by phone, or by email. All options offer the same tours, times, and prices." They created a dedicated email template for group bookings from disability support organisations, which included fields for group size, accessibility requirements, and support worker contact details. Phone staff were trained on the NRS and on asking about accessibility needs during every phone booking. The company also added a "Group and accessible booking enquiry" web form as a simpler alternative to the full booking flow.',
      outcome: 'Phone and email bookings filled the accessibility gap while website fixes were underway. The company kept all three channels even after the website was fixed because they found phone bookings had a higher average value (customers often upgraded or added extras when speaking to a person). Bookings from disability support organisations increased from 2 per year to approximately 15 per year, representing $12,000 in additional annual revenue.',
      cost: 'Free (process and training changes only)',
      timeframe: '2 days to set up processes and train 4 staff members'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Caravan Park',
      scenario: 'A popular beachside caravan park used an online booking system that offered a 10% "book online" discount. Customers who needed to book by phone (including elderly travellers and a regular guest who is blind) paid the full rate, effectively being charged more because of their inability to use the website. A guest raised this as a DDA concern in a Google review.',
      solution: 'The park immediately extended the 10% discount to all booking channels. They updated their website to state: "Same great rates whether you book online, by phone, or by email." Phone staff were given a discount code to apply to phone bookings. The park also added their phone number in large text next to the "Book Now" button on every page, with the note: "We welcome National Relay Service calls." Email bookings were set up with an auto-reply promising confirmation within 4 hours during business hours.',
      outcome: 'The negative Google review was updated by the guest to reflect the positive change. Phone bookings increased by 25% once the pricing disparity was removed. The blind guest who had raised the concern became a regular twice-yearly visitor and referred three other families. The park estimated the pricing equalisation cost $3,000 per year in reduced online-only discount revenue but generated over $8,000 in retained and new bookings.',
      cost: '$0 upfront (ongoing cost of approximately $3,000/year in equalised discounts, offset by increased bookings)',
      timeframe: '1 day to update pricing and train staff'
    }
  ],

  solutions: [
    {
      title: 'Promote existing alternative channels',
      description: 'If you already accept phone or email bookings, make these options visible on your website directly alongside or immediately below the online booking button. This is a zero-cost change that can be implemented in minutes and immediately removes barriers for customers who cannot use your online system.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Identify every page on your website that contains a "Book Now" or equivalent button.',
        'Add a line of text directly below or beside each booking button: "Prefer to book by phone? Call (your number). We welcome NRS calls on 133 677."',
        'Add a second line: "You can also book by email at (your booking email address)."',
        'Ensure the phone number is a clickable tel: link (e.g., <a href="tel:0200000000">) so mobile users can tap to call.',
        'Ensure the email address is a clickable mailto: link.',
        'Check that the alternative booking text is in a readable font size (at least 14px) and has sufficient colour contrast (4.5:1 ratio minimum against the background).',
        'Verify the information appears on both desktop and mobile versions of your site.',
        'If you have a Google Business Profile, update the "Booking" section to mention phone and email alternatives.',
        'Test by asking someone unfamiliar with your site to find how to book by phone. If it takes them more than 10 seconds from any page with a booking button, the text is not prominent enough.'
      ]
    },
    {
      title: 'Set up a structured email booking process',
      description: 'Create a booking email address, auto-reply, staff response template, and confirmation workflow so email bookings are handled efficiently and consistently. Email is particularly valuable for deaf and hard of hearing customers, people with speech disabilities, and anyone who needs time to compose their communication. A structured process ensures email bookings receive the same quality of service as online bookings.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Create a dedicated booking email address (e.g., bookings@yourbusiness.com.au) if you do not already have one. Avoid using a generic info@ address where booking requests may be lost among other enquiries.',
        'Set up an auto-reply that is sent immediately when an email is received. Template: "Thank you for your booking enquiry. We have received your email and will respond with a confirmed booking within [24 hours / 1 business day]. If your visit is within 24 hours, please call us on [phone number]."',
        'Create a staff response template for confirming bookings. Include fields for: booking date/time, service/product, number of guests, price, cancellation policy, accessibility arrangements if mentioned, and payment instructions.',
        'Create a second template for requesting additional information if the enquiry is incomplete.',
        'Assign responsibility for monitoring the booking email. Define who checks it, how often (at least 3 times per day), and who covers during leave.',
        'Ensure email staff have access to the same real-time availability and pricing as the online booking system. If they do not, create a process for checking availability before confirming.',
        'Add an accessibility prompt to the response template: "Do you have any accessibility requirements we can help with for your visit?"',
        'Set up a shared mailbox or CRM so multiple staff can see the booking email history and there is continuity if the primary person is unavailable.',
        'Test the entire email booking process end-to-end: send an enquiry, receive the auto-reply, receive the confirmation, and verify the booking appears in your main booking system.',
        'Review email booking metrics monthly: number of email bookings, average response time, and customer satisfaction.'
      ],
      notes: 'If you use Gmail, the "Canned Responses" (Templates) feature allows you to save and reuse booking confirmation templates. If you use Outlook, use Quick Parts or email templates for the same purpose.'
    }
  ],

  resources: [
    {
      title: 'National Relay Service: Information for Businesses',
      url: 'https://www.communications.gov.au/what-we-do/phone/services-people-disability/accesshub/national-relay-service',
      type: 'guide',
      source: 'Australian Government Department of Communications',
      description: 'Explains how the NRS works and how businesses can welcome NRS calls. Includes staff training tips.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Discrimination Act 1992: Goods, Services and Facilities',
      url: 'https://humanrights.gov.au/our-work/disability-rights/disability-discrimination',
      type: 'website',
      source: 'Australian Human Rights Commission',
      description: 'Explains obligations for service providers, including the requirement to provide equivalent service across all channels.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Accessible Customer Service Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical guide for businesses on providing accessible customer service across phone, email, and in-person channels.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Companion Card Australia',
      url: 'https://www.companioncard.gov.au/',
      type: 'website',
      source: 'Australian Government',
      description: 'Information on accepting Companion Cards across all booking channels, ensuring companions can attend at no extra cost.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Inclusive Tourism: Multi-Channel Booking Best Practices',
      url: 'https://www.tourism.australia.com/en/events-and-tools/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Best practice guidance for tourism businesses on providing multiple accessible booking channels.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.3-PC-2',
      questionText: 'Are customers invited to share their accessibility requirements during the booking process?',
      relationship: 'All booking channels should capture accessibility requirements',
      moduleCode: '1.3'
    }
  ],

  keywords: ['booking', 'alternative', 'phone', 'email', 'NRS', 'in-person', 'equivalent service'],
  lastUpdated: '2026-02-24'
},

// 1.3-PC-3
{
  questionId: '1.3-PC-3',
  questionText: 'If a customer shares accessibility requirements, is there a process to follow up before their visit?',
  moduleCode: '1.3',
  moduleGroup: 'before-arrival',
  diapCategory: 'customer-service',
  title: 'Following Up on Accessibility Requests',
  summary: 'When a customer shares their accessibility needs during booking, following up before their visit builds confidence and ensures your team is prepared.',

  whyItMatters: {
    text: 'Collecting accessibility information without acting on it is worse than not collecting it at all. It creates an expectation that the customer\'s needs will be met, and when they arrive unprepared, trust is broken. A simple follow-up call or email confirming arrangements makes customers feel valued and gives your team time to prepare.',
    quote: {
      text: 'I mentioned needing a hearing loop in my booking. Nobody acknowledged it, and when I arrived the loop was not switched on. A quick email beforehand would have made all the difference.',
      attribution: 'Hard of hearing patron, venue feedback'
    }
  },

  tips: [
    {
      icon: 'Mail',
      text: 'Send an automated confirmation acknowledging the request was received.',
      detail: 'Even a single line in the booking confirmation email saying "We have noted your accessibility requirements and will be in touch to confirm arrangements" provides reassurance. Without this, customers are left wondering whether anyone saw their request. Most booking platforms (Rezdy, FareHarbor, Little Hotelier) support conditional email content that triggers when an accessibility field is filled in. If your platform does not support this, add the line to all confirmation emails, as it signals inclusivity even when no specific request was made.',
      priority: 1
    },
    {
      icon: 'Phone',
      text: 'Follow up personally within 48 hours to discuss specifics.',
      detail: 'A brief phone call or email within 48 hours of booking is best practice. Template: "Thank you for letting us know about your accessibility requirements. Here is how we have prepared: [specific actions]. Please let us know if you need anything else." Personal follow-up is especially important for complex needs (Auslan interpreters, accessible transport coordination, equipment setup) that require advance preparation. Avoid follow-up calls more than 48 hours before the visit, as customers\' situations may change.',
      priority: 2
    },
    {
      icon: 'UserCheck',
      text: 'Assign a specific person or role to review and action accessibility requests.',
      detail: 'Without clear ownership, requests fall through the cracks. Designate one person (or one role, e.g., "Guest Services Manager" or "Duty Manager") as the accessibility request owner. This person should check for new requests at least once daily and is responsible for ensuring each request is actioned, communicated to relevant teams, and followed up with the customer. A common mistake is assuming "everyone" is responsible, which in practice means nobody is.',
      priority: 3
    },
    {
      icon: 'AlertCircle',
      text: 'Be upfront if you cannot fully meet a request.',
      detail: 'Honesty allows the customer to plan alternatives and avoids a worse experience on the day. For example: "We do not currently have a portable hearing loop, but we can seat you in the front row closest to the speakers and provide a printed script of the presentation." Always offer what you can do, not just what you cannot. If a request is completely beyond your capacity, offer to help the customer find a provider who can meet their needs. Never ignore a request you cannot fulfil, as silence feels like rejection.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Test your follow-up process',
    steps: [
      { text: 'Make a test booking through your online system and include specific accessibility requirements (e.g., "I use a wheelchair and need a ground floor room with a roll-in shower. I also use a hearing loop"). Note the exact time of the booking submission.' },
      { text: 'Check your booking confirmation email. Does it mention or acknowledge the accessibility request? If not, note this as a gap. Best practice is an explicit acknowledgement within the confirmation.',
        measurement: {
          target: 'Time from booking to confirmation email with accessibility acknowledgement',
          acceptable: 'Within 5 minutes (automated)',
          unit: 'minutes'
        }
      },
      { text: 'Wait 48 hours. Has anyone from your team followed up with a personal call or email about the accessibility request? Record whether follow-up occurred and how long it took.',
        measurement: {
          target: 'Time from booking to personal follow-up on accessibility request',
          acceptable: 'Within 48 hours',
          unit: 'hours'
        }
      },
      { text: 'Ask 3 different staff members (front desk, housekeeping/setup, and management): "Who is responsible for reviewing accessibility requests from bookings? What is the process?" Compare their answers. If answers are inconsistent, the process is not well defined or communicated.' },
      { text: 'Review your booking system data for the last 30 days. Count how many bookings included accessibility requirements. For each one, verify whether a follow-up action was taken and documented.',
        measurement: {
          target: 'Percentage of accessibility requests that received follow-up',
          acceptable: '100%',
          unit: 'percent'
        }
      },
      { text: 'Check whether the accessibility request information is communicated to the on-the-day team. For a hotel, does the housekeeping or front desk briefing sheet include it? For an event, does the setup team know about it? Pull up a recent booking with accessibility requirements and trace where the information went.' },
      { text: 'If possible and with permission, contact a past customer who submitted an accessibility request. Ask: "Did you receive any follow-up about your accessibility requirements before your visit? Was the experience what you expected when you arrived?" Their feedback is the most valuable data point.' },
      { text: 'Review what happens when an accessibility request cannot be fully met. Is there a documented process for communicating limitations honestly? Check if any past requests were left unanswered or ignored.' },
      { text: 'Check for a day-before reminder process. Best practice is a final check 24 hours before the customer\'s visit to ensure all preparations are in place (equipment charged, room configured, staff briefed).' }
    ],
    tools: ['Access to booking system admin panel', 'Booking confirmation email inbox', 'Pen and paper or spreadsheet for recording findings', 'Timer or clock for measuring response times'],
    estimatedTime: '30-40 minutes (spread across 48 hours to test follow-up timing)'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A 120-room coastal hotel collected accessibility requests through their booking form, but the information was stored in a general "Notes" field that different staff handled inconsistently. Some requests were actioned promptly by one particular front desk employee, while others were missed entirely when that employee was not on shift. A guest who had requested grab rail installation arrived to find the room unprepared, requiring a 45-minute wait while maintenance installed equipment.',
      solution: 'The hotel created a clear four-step workflow: (1) The booking system automatically flags any booking containing accessibility data and sends an email alert to the Guest Services Manager. (2) The Guest Services Manager reviews the request within 24 hours and assigns actions to relevant departments (housekeeping, maintenance, front desk). (3) A personal email is sent to the guest within 48 hours confirming specific arrangements: "We have prepared Room 12 for you with grab rails in the bathroom, a shower chair, and a lowered robe hook. Is there anything else we can prepare?" (4) A briefing note is added to the guest file visible to all arrival staff, and a day-before checklist ensures everything is ready.',
      outcome: 'Every accessibility request is now actioned before arrival without exception. Guest satisfaction scores for accessibility improved from 3.2 to 4.6 out of 5 within three months. The hotel received a TripAdvisor Travellers\' Choice badge mention for accessibility. Staff reported feeling more confident because the process removes guesswork.',
      cost: 'Free (process change only, using existing booking system features)',
      timeframe: '2 hours to design the workflow, 1 hour for staff training'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre hosting 200+ events per year received accessibility requests through their event registration system, but requests for Auslan interpreters, hearing loops, or wheelchair-accessible seating were sometimes missed in the volume of event logistics. Three attendees arrived at a major industry conference to find that the Auslan interpreter they had requested had not been booked, making the keynote session inaccessible to them. The incident was shared on social media and caused significant reputational damage.',
      solution: 'The centre built a simple checklist system triggered by any accessibility request in their event management platform (Eventbrite). When a registration includes accessibility data, the events coordinator receives an automated Slack notification. The coordinator adds the request to a shared "Accessibility Preparation" Trello board with the event name, date, and specific requirements. Each request card has a checklist: Confirm with customer (within 48 hours), Book external services if needed (Auslan interpreter, captioner), Brief AV team, Brief front-of-house, and Day-before final check. The board is reviewed in the weekly events meeting. One week before each event, the coordinator sends a confirmation email to every attendee who submitted an accessibility request.',
      outcome: 'Zero missed accessibility requests in the 14 months since implementation, across over 250 events. Attendee feedback on accessibility improved by 35%. The centre now promotes their accessibility commitment in marketing materials, which has attracted three new corporate clients who specifically sought accessible conference venues. The Trello board also provides data for the centre\'s annual accessibility report.',
      cost: 'Free (Trello free tier plus existing Eventbrite features)',
      timeframe: '3 hours to set up Trello board and train 6 staff members'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Whale Watching Tour',
      scenario: 'A whale-watching tour operator received accessibility requests through email and phone bookings but had no formal process. A customer who uses a power wheelchair booked a tour and mentioned needing ramp access to the vessel. The booking was taken by a casual staff member who wrote the note on a Post-it that was later lost. The customer arrived at the wharf to find the vessel could not accommodate their wheelchair, and no alternative arrangements had been made.',
      solution: 'The operator created a digital "Accessibility Request Register" using Google Sheets, shared with all booking staff and the operations manager. Every accessibility request is entered with: customer name, booking date, tour date, specific requirements, actions needed, person responsible, and status (Received, In Progress, Confirmed, Completed). When a request is entered, the operations manager receives an automatic email notification via a Google Sheets trigger. The manager reviews the request within 24 hours, determines what can be accommodated, and calls the customer personally to discuss. If a tour cannot accommodate a specific need, the manager offers alternatives (different vessel, different date, full refund with help finding an accessible operator). A day-before SMS is sent to the customer confirming arrangements.',
      outcome: 'The wheelchair-using customer rebooked for a date when the accessible vessel was scheduled and had an excellent experience. The Google Sheets register now shows that 4% of all bookings include accessibility requests. The operator has identified that investing in a portable ramp ($1,200) would accommodate 80% of mobility-related requests. Customer reviews mentioning accessibility went from zero to seven positive mentions in the first year.',
      cost: 'Free (Google Sheets and existing phone/email)',
      timeframe: '2 hours to create the register and train 5 staff members'
    }
  ],

  solutions: [
    {
      title: 'Add accessibility acknowledgement to booking confirmation',
      description: 'Update your confirmation email template to include a line acknowledging any accessibility requirements submitted. This is the simplest possible improvement and provides immediate reassurance to customers that their request was received. It takes less than 30 minutes and requires no technical skills beyond editing an email template.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Log into your booking platform admin panel and navigate to the email template editor (usually under Settings > Notifications or Communications).',
        'Find your booking confirmation email template.',
        'Add the following line after the booking details section: "If you have shared any accessibility requirements, our team has been notified and will be in touch to confirm arrangements before your visit."',
        'If your platform supports conditional content (e.g., Mailchimp merge tags, Rezdy custom fields), make this line appear only when the accessibility field has been filled in. Otherwise, include it in all confirmations as a general statement of welcome.',
        'Add a contact line below: "Have accessibility questions? Contact [name/role] directly at [email] or [phone]."',
        'Send a test confirmation email to yourself and verify the new lines appear correctly and are readable on both desktop and mobile email clients.',
        'Forward the updated template to all staff who handle bookings so they are aware of the new commitment being made to customers.'
      ],
      notes: 'Even if you do not yet have a formal follow-up process, adding this line to confirmations creates accountability and motivates your team to develop one.'
    },
    {
      title: 'Create an accessibility request workflow',
      description: 'Define who reviews accessibility requests, the timeline for follow-up, how to communicate with the customer, and how to brief on-the-day staff. This is a process change, not a technology change, so it costs nothing but staff time. A clear workflow eliminates the single biggest reason accessibility requests are missed: nobody knowing whose job it is to act on them.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Designate one person (or role) as the "Accessibility Request Owner." This is the person who reviews all incoming accessibility requests and is accountable for ensuring each one is actioned. For small businesses, this may be the owner or manager. For larger organisations, it could be the Guest Services Manager or Events Coordinator.',
        'Set a maximum response time for personal follow-up. Best practice is 48 hours from booking, or 24 hours if the visit is within the next 7 days.',
        'Create a follow-up email template. Example: "Dear [Name], thank you for booking with us and for letting us know about your accessibility requirements. Here is how we are preparing for your visit: [specific actions]. If you have any questions or additional requirements, please contact me directly at [phone/email]. We look forward to welcoming you. Kind regards, [Name], [Role]."',
        'Create a follow-up phone call script for staff who prefer calling: introduce yourself, confirm you have received their accessibility request, explain what you are doing to prepare, ask if there is anything else they need, and provide a direct contact for further questions.',
        'Define how accessibility request information is communicated to on-the-day teams. Options include: a printed briefing sheet, a digital note in the booking system visible at check-in, a Slack/Teams message to the relevant department, or a physical prep card placed in the room or event folder.',
        'Create a "day-before" checklist for the Accessibility Request Owner: verify all preparations are in place, equipment is charged and tested, rooms are configured, and staff are briefed.',
        'Set up a simple tracking system. This can be as basic as a column in your booking spreadsheet (Status: Received / Followed Up / Prepared / Completed) or a shared Google Sheet.',
        'Document the workflow on one page (who, what, when) and post it in the staff area. Walk through it with all staff who handle bookings or customer service.',
        'Test the workflow with a realistic scenario: have a colleague make a booking with accessibility requirements and track it through the entire process.',
        'Schedule a quarterly review to assess: how many requests were received, what percentage were followed up within the target timeframe, and whether any were missed. Use this data to improve the process.'
      ],
      notes: 'The most common reason this workflow fails is staff changeover. Ensure the process is documented clearly enough that a new staff member can follow it without verbal instructions from the previous person in the role.'
    }
  ],

  resources: [
    {
      title: 'Accessible Customer Service: Pre-Visit Communication Guide',
      url: 'https://www.and.org.au/resources/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Practical templates and guidance for communicating with customers about accessibility requirements before their visit.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Tourism Australia: Accessible Tourism Toolkit',
      url: 'https://www.tourism.australia.com/en/events-and-tools/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Includes sections on pre-visit communication, accessibility request handling, and staff training for tourism businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Discrimination Act 1992: Service Provider Obligations',
      url: 'https://humanrights.gov.au/our-work/disability-rights/disability-discrimination',
      type: 'website',
      source: 'Australian Human Rights Commission',
      description: 'Explains why follow-up on accessibility requests is not just good service but a legal obligation for service providers.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Google Sheets Accessibility Request Register Template',
      url: 'https://docs.google.com/spreadsheets/',
      type: 'template',
      source: 'Google',
      description: 'Free spreadsheet tool that can be used to create a shared accessibility request tracking register with automated email notifications.',
      isFree: true
    },
    {
      title: 'Trello: Free Project Management for Small Teams',
      url: 'https://trello.com/',
      type: 'tool',
      source: 'Atlassian',
      description: 'Free visual task management tool that works well for tracking accessibility requests through stages (Received, In Progress, Confirmed, Completed).',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.3-PC-2',
      questionText: 'Are customers invited to share their accessibility requirements during booking?',
      relationship: 'Capturing requirements is the first step; follow-up is what makes it matter',
      moduleCode: '1.3'
    }
  ],

  keywords: ['follow-up', 'confirmation', 'preparation', 'workflow', 'accessibility requests', 'booking'],
  lastUpdated: '2026-02-24'
}
,

// Module 1.4: Social Media, Video and Audio

// 1.4-PC-1
{
  questionId: '1.4-PC-1',
  questionText: 'Do your videos have captions or subtitles?',
  moduleCode: '1.4',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Video Captions and Subtitles',
  summary: 'Captions display spoken content as on-screen text, making videos accessible to deaf and hard of hearing viewers, people in noisy or quiet environments, and non-native English speakers.',

  whyItMatters: {
    text: 'Captions are the single most important accessibility feature for video content. Without them, 3.6 million Australians with hearing loss cannot access your message. Captions also benefit the 85% of social media users who watch videos with sound off, people in noisy environments, and anyone whose first language is not English.',
    statistic: {
      value: '3.6 million',
      context: 'Australians have some form of hearing loss. That number is projected to grow to 7.8 million by 2060.',
      source: 'Hearing Australia'
    }
  },

  tips: [
    {
      icon: 'Captions',
      text: 'Always review auto-generated captions for accuracy.',
      detail: 'YouTube and social platforms generate automatic captions, but accuracy rates typically sit around 60-80%. They frequently mishandle Australian place names (e.g., "Woolloomooloo" becomes "woolly moo moo"), brand names, and accents. Always download the auto-generated .srt file, correct it in a text editor, and re-upload. A common mistake is assuming auto-captions are "good enough" without checking.',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Include speaker identification when multiple people are talking.',
      detail: 'Add labels like "[Manager]:" or "[Tour guide]:" at each speaker change so viewers know who is speaking. This is especially critical for panel discussions, interviews, and testimonial compilations. Without speaker labels, deaf viewers lose context about who is making each point. Place the label on its own caption line or at the start of the first caption for each new speaker.',
      priority: 2
    },
    {
      icon: 'Music',
      text: 'Caption relevant sound effects, not just speech.',
      detail: 'Include descriptions like [upbeat music], [crowd cheering], [door opens] when these sounds convey meaning or set the scene. Use square brackets to distinguish non-speech captions from dialogue. A common mistake is captioning only words and ignoring audio cues that hearing viewers take for granted, such as suspenseful music in a promotional video or birdsong in a nature tour clip.',
      priority: 3
    },
    {
      icon: 'FileText',
      text: 'Provide a full transcript alongside videos for maximum accessibility.',
      detail: 'Transcripts allow users to search, translate, and read at their own pace. They are essential for deafblind users who access content via refreshable braille displays, which cannot parse timed captions. Post transcripts as expandable text below embedded videos or as a downloadable document. Transcripts also significantly improve SEO by giving search engines indexable text content.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your video captions',
    steps: [
      { text: 'Create a spreadsheet listing every video on your website, YouTube channel, Facebook page, Instagram, and TikTok. Include columns for: URL, platform, has captions (yes/no), caption type (auto/edited/professional), and date last checked.' },
      { text: 'For each video, check whether captions exist. On YouTube, click the CC button. On Facebook, check Video Settings. On Instagram Reels, look for the captions toggle. Record the status in your spreadsheet.' },
      { text: 'For videos with auto-generated captions, play at least the first 2 minutes with sound off. Note any errors in names, technical terms, or Australian place names. Count the number of errors per minute as an accuracy benchmark.',
        measurement: {
          target: 'Caption accuracy rate',
          acceptable: '99% or higher for edited captions',
          unit: 'percentage'
        }
      },
      { text: 'Check caption timing and readability. Captions should appear within 1 second of the spoken word, stay on screen long enough to read (minimum 1 second per line, 3 seconds for two full lines), and not overlap with on-screen text or graphics.',
        measurement: {
          target: 'Caption display duration',
          acceptable: '1-7 seconds per caption segment',
          unit: 'seconds'
        }
      },
      { text: 'Verify speaker identification. For any video with more than one speaker, check that captions indicate who is speaking at each change. Labels should appear before the first words of each new speaker.' },
      { text: 'Check for non-speech audio descriptions in captions. Watch 1-2 minutes of any video that includes music, sound effects, or ambient sounds. Are these captioned in square brackets where they convey meaning?' },
      { text: 'Confirm caption formatting is readable. Captions should use a clear sans-serif font, have sufficient contrast against the background (white text on a dark semi-transparent bar is standard), and contain no more than two lines per caption segment.',
        measurement: {
          target: 'Characters per caption line',
          acceptable: '32-42 characters maximum per line',
          unit: 'characters'
        }
      },
      { text: 'For your top 5 most-viewed videos, check whether a full text transcript is available. If not, flag these as priority items. Transcripts should include speaker labels, timestamps for key sections, and descriptions of relevant visual content.' },
      { text: 'Record your findings and prioritise: fix the highest-traffic videos first, then work through the backlog. Set a target date for 100% caption coverage.' }
    ],
    tools: ['Spreadsheet (Google Sheets or Excel)', 'Screen reader (NVDA or VoiceOver) for testing', 'Caption editing tool (YouTube Studio, Amara, or Subtitle Edit)'],
    estimatedTime: '45-90 minutes depending on number of videos'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '1.2.2 Captions (Prerecorded)',
      requirement: 'Captions must be provided for all prerecorded audio content in synchronized media.'
    },
    related: [
      {
        code: 'DDA',
        relevance: 'Under the DDA, providing video content without captions may constitute discrimination against deaf and hard of hearing people.'
      }
    ],
    plainEnglish: 'Every video with speech must have accurate captions. This includes promotional videos, tutorials, testimonials, and social media content.',
    complianceNote: 'The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Museum',
      scenario: 'A regional museum created a 10-minute virtual tour video narrated by the curator, featuring detailed descriptions of exhibits and historical context. The video had no captions. Deaf visitors and school groups in noisy classrooms could see the spaces but missed all narrated information about the collection.',
      solution: 'The museum uploaded the video to YouTube and used the auto-generated captions as a starting point. A volunteer with transcription experience edited the .srt file in Subtitle Edit (free software), correcting place names, exhibit titles, and Aboriginal language words. They also added speaker labels and descriptions of ambient audio like [traditional music plays]. A downloadable PDF transcript was linked below the embedded video on the museum website.',
      outcome: 'Deaf visitors reported being able to preview the museum independently for the first time. The transcript became popular with teachers planning school visits, and the museum saw a 25% increase in education booking enquiries within three months. The video also ranked higher in Google search results due to the indexed transcript text.',
      cost: '$50-150 per video using a captioning service, or free if edited in-house',
      timeframe: '2-3 days turnaround per video via a service, or 1-2 hours per 10-minute video if editing in-house'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular cafe posted weekly recipe and behind-the-scenes videos on Instagram Reels and TikTok. None of the 40+ videos had captions. The chef spoke quickly with a strong accent, making the content especially hard to follow without text support. Followers had commented asking for captions but the requests were overlooked.',
      solution: 'The cafe owner started using Instagram and TikTok auto-caption features, then reviewed and corrected the generated text before publishing (taking about 10-15 minutes per video). For longer YouTube recipe videos, the owner used the free tool Subtitle Edit to create .srt caption files and uploaded them via YouTube Studio. They also established a new workflow: script key talking points before filming, which improved both caption accuracy and video quality.',
      outcome: 'Video engagement increased by 40% within six weeks. Several followers sent direct messages thanking them for adding captions, including one regular customer who is hard of hearing and had been unable to follow the recipe steps previously. The scripting habit also reduced filming time by roughly 20%.',
      cost: 'Free (time investment only)',
      timeframe: '10-15 minutes extra per video for caption review'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Operator',
      scenario: 'A whale watching tour company had a library of 15 promotional videos on their website and YouTube channel showing tour highlights. Only 3 videos had auto-generated captions, and those were riddled with errors (e.g., "humpback breach" captioned as "homework beach"). The other 12 videos had no captions at all.',
      solution: 'The company used the Australian captioning provider Ai-Media to professionally caption their top 5 most-viewed videos at a cost of $3 per minute. For the remaining 10 videos, staff edited YouTube auto-captions in-house using YouTube Studio. They created a simple style guide noting correct spellings of species names, local place names, and technical terminology to use when editing future captions.',
      outcome: 'Within two months, all 15 videos had accurate captions. Website session duration on pages with video increased by 18%. A travel blogger who is deaf featured the company in an article about accessible tourism experiences, generating an estimated 200 additional website visits and 12 direct bookings.',
      cost: '$200 for professional captioning of top 5 videos, free for in-house editing of remainder',
      timeframe: '1 week to complete full backlog'
    }
  ],

  solutions: [
    {
      title: 'Edit auto-generated captions on existing videos',
      description: 'Review and correct YouTube or social media auto-captions on your most important videos. This is the fastest way to improve caption quality without any cost. Focus on your top 5-10 most-viewed videos first for maximum impact.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '15-30 minutes per video',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Open YouTube Studio and navigate to Subtitles in the left menu.',
        'Select your highest-traffic video and click on the auto-generated English captions.',
        'Click "Duplicate and edit" to create an editable copy of the auto-generated captions.',
        'Play the video at 0.75x speed and correct each caption segment. Pay special attention to proper nouns, place names, and technical terms.',
        'Add speaker labels in the format "[Speaker Name]:" at each speaker change.',
        'Add non-speech audio descriptions in square brackets, e.g., [upbeat background music], [waves crashing].',
        'Check caption timing: ensure each segment appears within 1 second of the spoken word and stays on screen at least 1 second.',
        'Click "Save" and then preview the video with captions to verify readability.',
        'Repeat for your next most-viewed video. Aim to complete your top 5 videos within the first week.',
        'Download the corrected .srt file as a backup by clicking the three-dot menu next to the caption track.'
      ],
      notes: 'YouTube auto-captions can also be edited directly in YouTube Studio on mobile, making it possible to review captions during downtime.'
    },
    {
      title: 'Use a captioning service for professional quality',
      description: 'Send videos to a professional captioning service for accurate, timed captions with speaker identification and non-speech audio descriptions. This approach is best for high-value content such as promotional videos, training materials, and key social media content that represents your brand.',
      resourceLevel: 'medium',
      costRange: '$2-5 per minute of video',
      timeRequired: '2-3 day turnaround',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Identify all videos that need professional captioning. Prioritise customer-facing promotional videos, homepage hero videos, and any content over 5 minutes long.',
        'Request quotes from Australian captioning providers: Ai-Media (ai-media.tv), Capital Captions, or Rev (rev.com). Ask about bulk pricing for multiple videos.',
        'Provide the captioning service with a style guide including correct spellings of your business name, staff names, product names, and location-specific terms.',
        'Upload your video files or share YouTube/Vimeo links with the provider.',
        'Review the returned caption files (.srt or .vtt format) against the video. Check for accuracy, timing, and completeness.',
        'Upload the caption files to each platform: YouTube Studio (Subtitles section), Facebook (Video settings > Captions), and Vimeo (Distribution > Subtitles).',
        'For Instagram and TikTok videos, use a tool like Kapwing or CapCut to burn captions (open captions) directly into the video file before uploading.',
        'Create a transcript version of the caption file by removing timestamps. Post this as a text block or downloadable file alongside each video on your website.'
      ],
      notes: 'Many captioning services offer volume discounts. If you have 10 or more videos to caption, request a bulk rate. Ai-Media is an Australian company specialising in accessibility services.'
    },
    {
      title: 'Build captioning into your content production workflow',
      description: 'Make captioning a standard step in every video production, with clear responsibilities, a quality review process, and templates for consistency. This ensures every new video is captioned before it goes live, preventing a backlog from building up again.',
      resourceLevel: 'high',
      costRange: '$500-2,000 (workflow setup + ongoing per-video costs)',
      timeRequired: '1-2 weeks to establish',
      implementedBy: 'staff',
      impact: 'significant',
      steps: [
        'Draft a Video Accessibility Policy stating that no video will be published on any platform without reviewed captions. Get sign-off from management.',
        'Create a captioning style guide for your organisation. Include: preferred caption font and size, maximum characters per line (42), minimum display time (1 second), speaker label format, and a glossary of commonly used terms with correct spellings.',
        'Add captioning as a mandatory step in your content production checklist, positioned between final video edit and publish/upload.',
        'Assign caption review responsibility. This could be a specific team member or rotated across the marketing team. Ensure at least one person reviews captions before every publish.',
        'Set up accounts with your chosen captioning tools: YouTube Studio for YouTube content, Subtitle Edit (free, open-source) for offline editing, and your preferred captioning service for high-priority content.',
        'Create caption file templates (.srt format) pre-populated with your standard intro and outro text, speaker labels, and formatting conventions.',
        'Establish a caption file storage system. Save all .srt and .vtt files in a shared folder alongside the corresponding video files, named consistently (e.g., "2026-02-promo-video.srt").',
        'Train all team members involved in video production. Cover: how to script with captioning in mind, how to edit auto-captions, how to upload caption files to each platform, and common mistakes to avoid.',
        'Schedule a quarterly caption audit. Review 5 random videos from each platform to verify caption quality has not slipped.',
        'Track caption coverage metrics: percentage of videos captioned, average caption accuracy, and time from video completion to caption completion. Report these quarterly.'
      ],
      notes: 'Scripting videos before filming dramatically improves caption accuracy and reduces editing time. Consider adding a teleprompter or cue cards to your filming setup.'
    }
  ],

  resources: [
    {
      title: 'Media Access Australia - Captioning Guide',
      url: 'https://mediaaccess.org.au/practical-web-accessibility/media/captions',
      type: 'guide',
      source: 'Media Access Australia',
      description: 'Comprehensive guide to captioning standards and best practices in Australia, including legal requirements and platform-specific instructions.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Ai-Media Captioning Services',
      url: 'https://www.ai-media.tv/',
      type: 'website',
      source: 'Ai-Media',
      description: 'Australian-founded captioning and transcription service provider offering both AI-powered and human-edited captions with fast turnaround.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Subtitle Edit - Free Caption Editing Software',
      url: 'https://nikse.dk/subtitleedit/',
      type: 'tool',
      source: 'Nikse.dk',
      description: 'Free, open-source subtitle editor for creating and editing .srt and .vtt caption files. Works on Windows and supports over 300 subtitle formats.',
      isFree: true
    },
    {
      title: 'W3C - Making Audio and Video Media Accessible',
      url: 'https://www.w3.org/WAI/media/av/',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Official W3C resource covering captions, audio descriptions, transcripts, and sign language for web media. Includes planning guides, checklists, and decision trees.',
      isFree: true
    },
    {
      title: 'Australian Human Rights Commission - Disability Discrimination',
      url: 'https://humanrights.gov.au/our-work/disability-rights',
      type: 'website',
      source: 'Australian Human Rights Commission',
      description: 'Guidance on disability discrimination obligations under Australian law, including requirements for accessible digital communications and media.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.4-PC-4',
      questionText: 'Can users control video playback using keyboard, screen readers, or other assistive technology?',
      relationship: 'Captions and player controls work together for accessible video',
      moduleCode: '1.4'
    }
  ],

  keywords: ['captions', 'subtitles', 'video', 'deaf', 'hearing', 'transcript', 'SRT', 'VTT'],
  lastUpdated: '2026-02-24'
},

// 1.4-PC-3
{
  questionId: '1.4-PC-3',
  questionText: 'Do you include alt text or image descriptions when posting images on social media?',
  moduleCode: '1.4',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Social Media Image Accessibility',
  summary: 'Adding alt text or image descriptions to social media posts ensures blind and low-vision users can understand your visual content. You can use either method, and each platform has built-in tools to help.',

  whyItMatters: {
    text: 'Social media is increasingly visual, with platforms prioritising images, videos, and graphics. Without text descriptions, blind and low-vision users miss out entirely. Adding alt text takes seconds per post and dramatically improves the experience for screen reader users. It also helps when images fail to load on slow connections.',
  },

  tips: [
    {
      icon: 'Image',
      text: 'Use built-in platform alt text for straightforward images.',
      detail: 'Instagram, Facebook, LinkedIn, and X/Twitter all have alt text fields in their image upload settings. On Instagram, tap "Advanced settings" then "Write alt text." On Facebook, click the image and select "Edit alt text." Keep alt text under 125 characters and describe the essential visual information. A common mistake is writing vague descriptions like "photo of our business" instead of specific details like "exterior view of the cafe showing the ramp entrance and outdoor seating area."',
      priority: 1
    },
    {
      icon: 'FileText',
      text: 'Use caption image descriptions for detailed or emotional images.',
      detail: 'Start with [Image description:] or [ID:] in your caption for images where mood, context, or fine detail matters. This method is visible to all users, not just screen reader users, and works well for images where a longer description adds value. For example, a scenic photo might benefit from: "[Image description: A golden sunset over Uluru, with red desert sand in the foreground and scattered spinifex grass.]" Caption descriptions can be longer than alt text and are especially useful on platforms where alt text is limited.',
      priority: 2
    },
    {
      icon: 'BarChart',
      text: 'Infographics and text-on-images need the full text repeated.',
      detail: 'If an image contains text (quote graphics, statistics, announcements, menus, event details), that text must appear in either the alt text or the caption. Alt text fields often have character limits (Instagram allows 100 characters in alt text), so for text-heavy images, put the full content in the caption. A common mistake is posting an event poster as an image with only "Check out our upcoming event!" as the caption, leaving screen reader users with no access to dates, times, or locations.',
      priority: 3
    },
    {
      icon: 'Sparkles',
      text: 'Keep CamelCase for hashtags so screen readers read them correctly.',
      detail: '#AccessibleTourism reads as three separate words. #accessibletourism reads as one long jumble that a screen reader may mispronounce or skip entirely. This applies to all multi-word hashtags. Also avoid using special Unicode characters or excessive emoji strings, as screen readers read out each emoji individually (e.g., five clapping emojis become "clapping hands, clapping hands, clapping hands, clapping hands, clapping hands").',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your social media for image accessibility',
    steps: [
      { text: 'Create a checklist spreadsheet with columns for: platform, post date, post URL, has alt text (yes/no), has caption description (yes/no), contains text-in-image (yes/no), text-in-image repeated in caption (yes/no), and hashtag format (CamelCase yes/no).' },
      { text: 'Check your last 10 Instagram posts. For each image, tap the three-dot menu, select "Edit," then "Edit alt text" (at the bottom). Record whether alt text exists and whether it meaningfully describes the image, not just the auto-generated description.',
        measurement: {
          target: 'Posts with alt text',
          acceptable: '100% of posts should have alt text or caption descriptions',
          unit: 'percentage'
        }
      },
      { text: 'Check your last 10 Facebook posts. Click each image, then click "Edit" and look for the "Alternative text" section. Facebook auto-generates alt text (e.g., "Image may contain: 2 people, outdoor"), but these are generic. Record whether custom alt text has been added.' },
      { text: 'Check your last 10 posts on X/Twitter (if applicable). When composing a post with an image, there is an "Add description" button on the image. Review whether past posts used this feature.' },
      { text: 'Identify all posts containing text-on-image graphics (event posters, quote cards, infographics, menus). For each, verify that the full text content is reproduced in either the alt text or the post caption. Flag any where it is missing.',
        measurement: {
          target: 'Text-in-image posts with text in caption',
          acceptable: '100%',
          unit: 'percentage'
        }
      },
      { text: 'Check hashtag formatting across your last 20 posts. Every multi-word hashtag should use CamelCase (e.g., #AccessForAll, not #accessforall). Note any that need correcting in future posts.' },
      { text: 'Test with a screen reader. On an iPhone, enable VoiceOver (Settings > Accessibility > VoiceOver). Open your Instagram or Facebook profile and swipe through your recent posts. Listen to how the screen reader announces each image. Does the description make sense without seeing the image?' },
      { text: 'Check for excessive emoji use. Screen readers read each emoji by name. Review your last 10 posts for instances where more than 3 of the same emoji appear in a row, or where emoji strings interrupt the flow of text.' },
      { text: 'Compile findings and calculate your current alt text coverage rate. Set a target of 100% for all new posts going forward, and a timeline for updating the most important older posts (e.g., pinned posts, event announcements that are still current).' }
    ],
    tools: ['Smartphone with VoiceOver (iPhone) or TalkBack (Android)', 'Spreadsheet for tracking audit results', 'Desktop browser for checking Facebook and X/Twitter alt text fields'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A boutique hotel posted beautiful room photos on Instagram daily but none had alt text or descriptions. The hotel had 2,000+ followers, including several who used screen readers. Those followers experienced every post as simply "photo" with no additional context, meaning they missed all visual information about room features, views, and amenities.',
      solution: 'The social media manager started adding alt text to every image via Instagram settings (Advanced Settings > Write Alt Text). Descriptions were specific and useful, e.g., "Accessible Superior Room with king bed, wide clear pathways on both sides, and a roll-in shower visible through the open bathroom door. Natural light from floor-to-ceiling windows." For special posts featuring detailed or atmospheric images, they added [Image description:] paragraphs in the caption. The manager also created a shared document with pre-written alt text templates for common photo types (room interiors, restaurant dishes, pool area, exterior views) to speed up the process for the whole team.',
      outcome: 'Within one month, the hotel received direct messages from three blind followers thanking them for the change. Staff found that writing specific descriptions also improved their general caption writing and engagement rates. Average caption length increased, and post engagement rose by 15% as the richer descriptions gave all followers more context.',
      cost: 'Free',
      timeframe: '30 seconds to 2 minutes per post'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council',
      scenario: 'A local council shared event posters, infographics about community services, and maps as images on social media. None of these had alt text, and the captions typically said things like "Check out what is happening this weekend!" without repeating the text shown in the poster image. Screen reader users missed all event dates, times, locations, and registration details.',
      solution: 'The digital communications team created a one-page Social Media Accessibility Guide covering four rules: (1) every image gets alt text, (2) any image containing text must have that text reproduced in the caption, (3) hashtags use CamelCase, and (4) limit emoji to 3 per post. The guide included platform-specific instructions with screenshots for adding alt text on Instagram, Facebook, X/Twitter, and LinkedIn. It was printed and pinned at every desk and added to the staff intranet. The team also added an "Alt text added?" checkbox to their social media approval workflow in their scheduling tool (Hootsuite).',
      outcome: 'Complaints about inaccessible posts stopped within two weeks. The guide was adopted by three other council departments and shared with neighbouring councils. An accessibility audit conducted six months later found 97% alt text compliance across all platforms, up from 0%.',
      cost: 'Free',
      timeframe: '2 hours to create the guide, then ongoing 30 seconds per post'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Gift Shop',
      scenario: 'A regional gift shop posted product photos on Instagram and Facebook to drive online sales. Product images had no alt text, and captions focused on pricing and availability without describing the items visually. Blind customers who followed the shop on social media could not determine what products looked like, their colours, or their features without asking someone sighted for help.',
      solution: 'The shop owner began adding descriptive alt text to every product image, covering material, colour, size, and key design features (e.g., "Hand-thrown ceramic mug in speckled blue glaze, 350ml, with a wide comfortable handle"). For product collections and flat-lay photos featuring multiple items, they added a numbered [Image description:] in the caption listing each visible product. The owner also used CamelCase hashtags (#HandmadeGifts, #AustralianMade) and reduced emoji use to 1-2 per post.',
      outcome: 'Two blind customers contacted the shop saying they could now browse independently and had placed online orders for the first time. The shop owner reported that writing specific product descriptions for alt text also improved their Etsy and website product listings. Online sales from social media referrals increased by 12% over three months.',
      cost: 'Free',
      timeframe: '1-2 minutes extra per post'
    }
  ],

  solutions: [
    {
      title: 'Start adding alt text to new posts today',
      description: 'From today, add alt text to every image you post on every platform. Start with your primary platform and expand from there. This single habit change immediately makes all new content accessible to screen reader users.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30 seconds per image',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'On Instagram: Before posting, tap "Advanced settings" at the bottom of the caption screen, then tap "Write alt text." Describe what is in the image in 1-2 sentences.',
        'On Facebook: After uploading a photo, click "Edit" on the image, then click "Alternative text" in the left panel. Replace the auto-generated text with your own description.',
        'On X/Twitter: After adding an image to a tweet, click the "Add description" button (or ALT badge) on the image thumbnail. Write a concise description.',
        'On LinkedIn: After uploading an image, click the "Add alt text" button that appears on the image. Describe the visual content.',
        'For images containing text (posters, infographics, quotes), copy the full text into your caption so it is accessible even if alt text is missed.',
        'Use CamelCase for all multi-word hashtags: #AccessibleTourism not #accessibletourism.',
        'Keep alt text under 125 characters where possible. Focus on what is important about the image in context.',
        'Avoid starting alt text with "Image of" or "Photo of" as screen readers already announce it as an image.'
      ],
      notes: 'If you manage multiple accounts, start with the platform where you have the most followers and work outward. Consistency matters more than perfection.'
    },
    {
      title: 'Create social media accessibility guidelines for your team',
      description: 'Write a one-page guide covering alt text, image descriptions, CamelCase hashtags, emoji limits, and video captions for your social media team. Integrate the guidelines into your content approval workflow so accessibility checks happen before publishing, not after.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Draft a one-page guide with four sections: (1) Alt text and image descriptions, (2) Text-in-image rules, (3) Hashtag and emoji formatting, (4) Video caption requirements.',
        'For the alt text section, include platform-specific instructions with step-by-step directions for Instagram, Facebook, X/Twitter, and LinkedIn. Add 3-4 examples of good vs. poor alt text for your typical content types.',
        'Create a simple template for common post types. For example: Room photo alt text template: "[Room type] with [bed configuration], showing [key accessibility features]. [Notable visual elements like view or decor]."',
        'Add a "Text-in-image" rule: Any image that contains readable text must have that text reproduced in the caption. No exceptions.',
        'Include a "Do and Don\'t" section with real examples from your own past posts (anonymised if needed).',
        'Add the guide to your social media scheduling tool as a checklist. If using Hootsuite, Later, or Buffer, create a custom field or tag for "Alt text added."',
        'Print the guide and place copies at workstations where social media is managed. Save a digital version to your shared drive or intranet.',
        'Schedule a 30-minute training session for all staff who post on social media. Walk through the guide, demonstrate adding alt text on each platform, and answer questions.',
        'Set a monthly 5-minute spot-check: review 5 random recent posts for compliance and share feedback with the team.'
      ],
      notes: 'Make the guide visual and practical, not policy-heavy. Staff are more likely to follow a clear, friendly one-pager than a 10-page policy document.'
    },
    {
      title: 'Backfill alt text on high-value existing posts',
      description: 'Go back through your most important existing posts (pinned posts, top-performing content, posts linked from your website or email campaigns) and add alt text retrospectively. This ensures your most-seen content is accessible, not just new posts going forward.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Identify your top 20 most important existing posts across all platforms. Prioritise: pinned posts, posts linked from your website, posts with the highest engagement, and posts promoting current offers or events.',
        'On Instagram, edit each post (three-dot menu > Edit), scroll down, and tap "Edit alt text." Add a meaningful description.',
        'On Facebook, click the image in each post, then click "Edit" and update the "Alternative text" field.',
        'On X/Twitter, note that alt text cannot be added to already-published tweets. For critical content, consider reposting with alt text included.',
        'For posts containing text-in-image graphics that lack text in the caption, edit the caption to include the full text content.',
        'Update any hashtags to CamelCase format while editing.',
        'Log each updated post in your tracking spreadsheet so you know what has been completed.',
        'Set a target to work through the next 20 posts the following week, continuing until all important historical content is covered.'
      ],
      notes: 'You cannot add alt text to already-published tweets or TikTok posts. For those platforms, focus on getting it right for all new content.'
    }
  ],

  resources: [
    {
      title: 'Accessible Social - Platform-by-Platform Guide',
      url: 'https://www.accessible-social.com/',
      type: 'guide',
      source: 'Accessible Social',
      description: 'Practical, up-to-date guide to making social media content accessible across all major platforms. Includes platform-specific instructions, examples, and downloadable checklists.',
      isFree: true
    },
    {
      title: 'Vision Australia - Digital Accessibility Resources',
      url: 'https://www.visionaustralia.org/services/digital-access',
      type: 'website',
      source: 'Vision Australia',
      description: 'Resources and consulting services from Australia\'s leading blindness and low-vision organisation. Includes guidance on image descriptions and digital content accessibility.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'WebAIM - Alternative Text Guide',
      url: 'https://webaim.org/techniques/alttext/',
      type: 'guide',
      source: 'WebAIM',
      description: 'Comprehensive guide to writing effective alt text, with decision trees for different image types (decorative, functional, informative, complex) and many before-and-after examples.',
      isFree: true
    },
    {
      title: 'Australian Government - Social Media Accessibility Toolkit',
      url: 'https://www.stylemanual.gov.au/content-types/images-and-alt-text',
      type: 'guide',
      source: 'Australian Government Style Manual',
      description: 'Official Australian Government guidance on writing alt text and image descriptions, including rules for different content types and contexts.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Hootsuite - Social Media Accessibility Checklist',
      url: 'https://blog.hootsuite.com/inclusive-design-social-media/',
      type: 'checklist',
      source: 'Hootsuite',
      description: 'Practical checklist covering alt text, captions, hashtags, emoji, colour contrast, and video accessibility for social media managers.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-2',
      questionText: 'Do images on your website have alt text or image descriptions?',
      relationship: 'Alt text principles are the same for websites and social media',
      moduleCode: '1.2'
    },
    {
      questionId: '1.4-PC-1',
      questionText: 'Do your videos have captions or subtitles?',
      relationship: 'Captions and alt text together make multimedia content fully accessible',
      moduleCode: '1.4'
    }
  ],

  keywords: ['social media', 'alt text', 'image description', 'Instagram', 'Facebook', 'hashtag', 'CamelCase'],
  lastUpdated: '2026-02-24'
},

// 1.4-PC-4
{
  questionId: '1.4-PC-4',
  questionText: 'Can users control video playback using keyboard, screen readers, or other assistive technology?',
  moduleCode: '1.4',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Accessible Video Player Controls',
  summary: 'Video players must be controllable without a mouse. Users need to play, pause, adjust volume, enable captions, and seek through content using keyboard and assistive technology.',

  whyItMatters: {
    text: 'A captioned video is still inaccessible if a user cannot reach the play button with their keyboard, or cannot find and enable the caption control. Video player accessibility means all controls (play, pause, volume, captions, fullscreen) work with Tab, Enter, and arrow keys, and are labelled for screen readers.',
  },

  tips: [
    {
      icon: 'Play',
      text: 'Use YouTube or Vimeo embeds for reliable built-in accessibility.',
      detail: 'Both platforms have invested heavily in accessible players that handle keyboard navigation, screen reader labels, and caption controls out of the box. Custom or third-party video players often fail keyboard and screen reader testing because developers overlook focus management and ARIA labelling. Unless you have a specific need that YouTube or Vimeo cannot meet, their embedded players are the safest choice.',
      priority: 1
    },
    {
      icon: 'Keyboard',
      text: 'Test: Can you Tab to the video, play/pause with Enter or Space, and adjust volume?',
      detail: 'Try this on every embedded video on your website. Put your mouse aside and use only the keyboard. Press Tab until the video player receives focus (look for a visible focus outline). Press Enter or Space to play/pause. Use arrow keys to adjust volume and seek. If any control requires a mouse hover or click to appear, it is inaccessible to keyboard users and many assistive technology users.',
      priority: 2
    },
    {
      icon: 'VolumeX',
      text: 'Never autoplay videos with sound.',
      detail: 'Autoplaying audio is disorienting for screen reader users because it competes with their screen reader voice output, making both inaudible. It is also distressing for people with sensory sensitivities and annoying for most users. WCAG 2.1 SC 1.4.2 requires that any audio playing automatically for more than 3 seconds must have a mechanism to pause or stop it, or to control volume independently of the system volume. The safest approach is to never autoplay with sound at all.',
      priority: 3
    },
    {
      icon: 'Captions',
      text: 'Ensure the caption button (CC) is visible without hovering.',
      detail: 'Some custom players hide the CC button until the user hovers over the video control bar, making it invisible to keyboard-only users and people who cannot use a mouse. The CC button should be permanently visible in the player controls. It should also be properly labelled with an aria-label like "Toggle captions" so screen readers can announce its purpose and current state (on/off).',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Test video player accessibility on your website',
    steps: [
      { text: 'Open your website in Chrome or Firefox. Navigate to a page containing a video. Put your mouse to one side and do not touch it for the remainder of this test.' },
      { text: 'Press the Tab key repeatedly until keyboard focus reaches the video player area. Look for a visible focus indicator (outline, highlight, or colour change) on the first video control. If no focus indicator appears on any part of the video player, it fails the keyboard accessibility test.',
        measurement: {
          target: 'Tab presses to reach video player',
          acceptable: 'Should be reachable within a reasonable number of Tab presses (under 20 from page top)',
          unit: 'key presses'
        }
      },
      { text: 'With focus on the play button, press Enter or Space. The video should start playing. Press Enter or Space again. The video should pause. If these keys do not work, the player fails.' },
      { text: 'Tab to the volume control. Use arrow keys (Up/Down or Left/Right) to adjust volume. The volume should change smoothly. If there is no keyboard-accessible volume control, this fails.' },
      { text: 'Tab to the caption/CC button. Press Enter or Space to toggle captions on. Verify that captions appear. Press again to toggle off. If the CC button cannot be reached or activated by keyboard, this fails.' },
      { text: 'Tab to the timeline/progress bar (also called the seek bar). Use Left and Right arrow keys to move backward and forward through the video. The playback position should change. If seeking is not possible via keyboard, this fails.' },
      { text: 'Tab to the fullscreen button (if present). Press Enter to enter fullscreen mode. Verify that all controls remain keyboard-accessible in fullscreen. Press Escape to exit fullscreen.' },
      { text: 'Test with a screen reader. On Windows, open NVDA (free) or Narrator (built-in). On Mac, enable VoiceOver (Cmd+F5). Navigate to the video and listen to how the screen reader announces each control. Each button should have a meaningful label (e.g., "Play," "Pause," "Mute," "Captions on/off"), not just "button" or a meaningless string.',
        measurement: {
          target: 'Controls with meaningful screen reader labels',
          acceptable: '100% of interactive controls must have descriptive labels',
          unit: 'percentage'
        }
      },
      { text: 'Check for autoplay behaviour. Load the page fresh (clear cache or open in a private/incognito window). Does any video start playing automatically? If so, does it play with sound? Autoplay with sound is a WCAG failure. Autoplay without sound is acceptable if a visible pause button is immediately available.',
        measurement: {
          target: 'Autoplay with sound',
          acceptable: 'No videos should autoplay with sound',
          unit: 'pass/fail'
        }
      },
      { text: 'Record your findings for each video on the site. For any failures, note the specific issue (e.g., "CC button not keyboard accessible," "No focus indicator on play button") and the page URL. Prioritise fixes for your homepage and most-visited pages.' }
    ],
    tools: ['Keyboard (no mouse)', 'Screen reader: NVDA (free, Windows), VoiceOver (built-in, Mac/iOS), or Narrator (built-in, Windows)', 'Chrome or Firefox browser', 'Notepad or spreadsheet for recording results'],
    estimatedTime: '20-40 minutes (5 minutes per video, plus screen reader testing)'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '2.1.1 Keyboard',
      requirement: 'All functionality of the content must be operable through a keyboard interface without requiring specific timings for individual keystrokes.'
    },
    related: [
      {
        code: 'WCAG2.1-AA',
        relevance: 'SC 1.4.2 Audio Control: If audio plays automatically for more than 3 seconds, a mechanism must be available to pause, stop, or control the volume.'
      },
      {
        code: 'DDA',
        relevance: 'Inaccessible video controls may constitute discrimination under the Disability Discrimination Act 1992 by preventing people with disability from accessing information.'
      }
    ],
    plainEnglish: 'Every video control (play, pause, volume, captions, seek, fullscreen) must work with a keyboard and be announced correctly by screen readers. Videos must never autoplay with sound.',
    complianceNote: 'YouTube and Vimeo embeds generally meet these requirements out of the box. Custom players require specific development effort to achieve compliance. The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theatre',
      scenario: 'A regional theatre used a custom JavaScript video player for show trailers on their website. The player looked polished, with a sleek dark interface and animated controls. However, it had no keyboard support at all. Users could not Tab to the player, could not play or pause without a mouse, and the caption button only appeared on mouse hover. A blind patron trying to preview a show trailer could not interact with the video at all.',
      solution: 'The theatre replaced all custom player instances with standard YouTube embeds. They uploaded the trailer videos to their YouTube channel, added .srt caption files via YouTube Studio, and used the YouTube iframe embed code on their website. They also added a title attribute to each iframe (e.g., title="Trailer: A Midsummer Night\'s Dream, Captioned") so screen readers announce the video purpose. The migration covered 12 trailers and took one staff member half a day.',
      outcome: 'All 12 trailers became fully keyboard accessible with working caption controls. The theatre saved approximately $1,500 per year in developer costs that had been spent maintaining the custom player. A blind theatre subscriber emailed to say they could finally preview shows independently, and booked tickets to three upcoming performances.',
      cost: 'Free (staff time for migration only)',
      timeframe: '4-5 hours for 12 videos'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A whale watching tour company had a cinematic background video on their homepage that autoplayed with full audio (whale sounds and narration) as soon as the page loaded. There was no visible pause button. The video looped continuously. Screen reader users found the audio competed with their screen reader output, making the entire page unusable. Other visitors reported being startled by the sudden loud audio, especially when browsing on mobile in quiet settings.',
      solution: 'The web developer changed the video to autoplay muted (adding the "muted" attribute to the HTML video tag). They added a large, visible play/pause button overlaid on the bottom-left corner of the video, with an aria-label of "Play background video with sound" that updated to "Pause background video" when active. They also added a brief text overlay on the video reading "Humpback whales breaching off the coast of Hervey Bay" for users who could not see the video. All controls were tested with keyboard and NVDA screen reader.',
      outcome: 'Website bounce rate on the homepage decreased by 22% within one month. Users appreciated being able to control their experience. The text overlay improved SEO for the target keyword "Hervey Bay whale watching." No further complaints about unexpected audio were received.',
      cost: '$300 for web developer (2 hours)',
      timeframe: '1 day including testing'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel website featured room tour videos embedded using a third-party player (JW Player with a default configuration). The player worked with a mouse but had poor keyboard support: the Tab key skipped over the video entirely, and the caption toggle had no aria-label. Guests using keyboard navigation or screen readers could not access the video content, which was the primary way the hotel showcased its accessible rooms.',
      solution: 'The hotel\'s web developer updated the JW Player configuration to enable the built-in accessibility features: keyboard navigation mode, ARIA labels on all controls, and visible focus indicators. They set captions to display by default rather than requiring the user to enable them. They also added a text-based room description below each video as an alternative for users who could not access video content at all. The configuration changes took about 3 hours and were applied globally to all player instances.',
      outcome: 'Keyboard users could now fully control all room tour videos. Screen readers announced each control clearly (e.g., "Play button," "Captions, currently on," "Volume, 80%"). The hotel received positive feedback from a disability travel blogger who featured the accessible room tours in a review, generating an estimated 50 additional bookings from travellers with disability over the following quarter.',
      cost: '$500 (web developer, 3 hours)',
      timeframe: '1 day'
    }
  ],

  solutions: [
    {
      title: 'Switch to YouTube or Vimeo embeds',
      description: 'Replace custom video players with accessible platform embeds that handle keyboard navigation, screen reader support, and caption controls automatically. This is the fastest and most reliable way to achieve accessible video playback on your website.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Audit all video players on your website. List each page URL, the current player type (custom HTML5, JW Player, Flowplayer, etc.), and whether it has known accessibility issues.',
        'For each video, upload it to YouTube (or Vimeo if you prefer an ad-free experience). Set privacy to "Unlisted" if you do not want the video appearing in YouTube search results.',
        'Add captions to each YouTube video via YouTube Studio > Subtitles. Upload an .srt file if you have one, or edit the auto-generated captions.',
        'On YouTube, click "Share" then "Embed" to get the iframe embed code. Add a descriptive title attribute to the iframe, e.g., title="Virtual tour of accessible guest room with captions".',
        'Replace the custom player code on your website with the YouTube iframe embed code. Ensure the iframe has width and height attributes or is wrapped in a responsive container.',
        'Test each embedded video with keyboard only: Tab to the player, Space/Enter to play/pause, Tab to CC button, arrow keys for volume and seeking.',
        'Test with NVDA or VoiceOver to verify screen reader announcements for each control.',
        'Remove any old custom player JavaScript and CSS files that are no longer needed to improve page load speed.'
      ],
      notes: 'YouTube embeds include ads on free accounts. Consider YouTube Premium or Vimeo Pro if ad-free playback is important for your brand.'
    },
    {
      title: 'Fix autoplay and add visible controls',
      description: 'Disable autoplay sound, add visible and keyboard-accessible play/pause buttons, and ensure all video controls are operable without a mouse. This solution is for situations where you need to keep your existing player but must fix its accessibility issues.',
      resourceLevel: 'medium',
      costRange: '$200-800',
      timeRequired: '1-2 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'If any video autoplays with sound, add the "muted" attribute to the HTML video element. Change autoplay to muted autoplay: <video autoplay muted>.',
        'Add a visible play/pause button that is always shown (not hidden behind a hover state). Use a button element with an aria-label that updates dynamically (e.g., "Play video" when paused, "Pause video" when playing).',
        'Ensure all player controls (play, pause, volume, captions, seek bar, fullscreen) are focusable via Tab key. Add tabindex="0" to any custom controls that are not natively focusable.',
        'Add visible focus indicators (outline or highlight) to all controls. Use CSS like :focus-visible { outline: 2px solid #005fcc; outline-offset: 2px; }.',
        'Add ARIA labels to all controls: aria-label="Play," aria-label="Mute," aria-label="Enable captions," aria-label="Seek bar, current position 30 seconds." Use aria-pressed="true/false" for toggle buttons.',
        'Ensure the CC/caption button is visible at all times in the control bar, not hidden behind a submenu or hover state.',
        'Add keyboard event handlers: Space/Enter for play/pause, Up/Down arrows for volume, Left/Right arrows for seeking (5-10 second increments), C key for toggling captions, F key for fullscreen.',
        'Test the complete keyboard navigation flow end-to-end. Document the keyboard shortcuts and include them in the player\'s help or tooltip text.',
        'Test with NVDA (Windows) and VoiceOver (Mac) screen readers. Verify that each control is announced with its name, role, and state.',
        'Add a text alternative below the video for users who cannot interact with video players at all. Include a brief summary of the video content and a link to a transcript.'
      ],
      notes: 'If your custom player is older than 3 years or is not actively maintained, it is often cheaper and more reliable to switch to YouTube/Vimeo embeds than to fix accessibility issues in legacy code.'
    },
    {
      title: 'Implement an accessible custom video player',
      description: 'If your brand requires a custom player appearance or features that YouTube and Vimeo do not offer, use an accessible open-source player like Able Player or Plyr. These players are built with accessibility as a core feature, including full keyboard support, screen reader compatibility, and caption management.',
      resourceLevel: 'high',
      costRange: '$800-3,000',
      timeRequired: '3-5 days',
      implementedBy: 'contractor',
      impact: 'significant',
      steps: [
        'Choose an accessible video player library. Able Player (ableplayer.github.io) is purpose-built for accessibility and supports captions, audio descriptions, transcripts, and sign language tracks. Plyr (plyr.io) is a lightweight alternative with good keyboard support.',
        'Have your web developer install the chosen player library on your website. Follow the library documentation for setup and configuration.',
        'Configure the player to show all controls by default (no hidden menus or hover states). Enable keyboard shortcuts and visible focus indicators.',
        'Upload caption files (.vtt or .srt) and configure the player to load them automatically. Set captions to display by default if your audience includes many deaf or hard of hearing users.',
        'If applicable, add audio description tracks for videos with important visual-only content. Able Player supports synchronised audio descriptions that pause the main video.',
        'Add a transcript panel below or beside the player. Able Player can auto-generate an interactive transcript from caption files, with click-to-seek functionality.',
        'Style the player to match your brand colours and design system, using the player\'s CSS customisation options.',
        'Test thoroughly: keyboard navigation, screen reader (NVDA, VoiceOver, and Narrator), high contrast mode, zoom to 200%, and mobile touch interaction.',
        'Create documentation for your content team on how to add new videos, upload captions, and manage the player settings.',
        'Schedule quarterly accessibility testing of the player, especially after any website updates or player library upgrades.'
      ],
      notes: 'Able Player was developed by the University of Washington specifically for accessibility and is free and open-source. It is the gold standard for accessible custom video players.'
    }
  ],

  resources: [
    {
      title: 'Able Player - Accessible Media Player',
      url: 'https://ableplayer.github.io/ableplayer/',
      type: 'tool',
      source: 'University of Washington',
      description: 'Free, open-source HTML5 media player designed for accessibility. Supports captions, audio descriptions, interactive transcripts, and sign language. Full keyboard and screen reader support built in.',
      isFree: true
    },
    {
      title: 'W3C WAI - Accessible Video Player Resources',
      url: 'https://www.w3.org/WAI/media/av/player/',
      type: 'guide',
      source: 'W3C Web Accessibility Initiative',
      description: 'Official W3C guidance on choosing and configuring accessible media players, including a comparison of player features and accessibility support.',
      isFree: true
    },
    {
      title: 'Media Access Australia - Video Player Accessibility',
      url: 'https://mediaaccess.org.au/practical-web-accessibility/media/accessible-video-players',
      type: 'guide',
      source: 'Media Access Australia',
      description: 'Australian guide to selecting and configuring accessible video players, with recommendations for common content management systems like WordPress and Drupal.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'NVDA Screen Reader (Free)',
      url: 'https://www.nvaccess.org/download/',
      type: 'tool',
      source: 'NV Access',
      description: 'Free, open-source screen reader for Windows. Essential for testing video player accessibility and verifying that controls are properly labelled for assistive technology users.',
      isFree: true
    },
    {
      title: 'Plyr - Accessible HTML5 Media Player',
      url: 'https://plyr.io/',
      type: 'tool',
      source: 'Plyr',
      description: 'Lightweight, customisable HTML5 video player with good keyboard accessibility, caption support, and responsive design. Free and open-source.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.4-PC-1',
      questionText: 'Do your videos have captions or subtitles?',
      relationship: 'Captions are only useful if users can enable them through accessible controls',
      moduleCode: '1.4'
    }
  ],

  keywords: ['video player', 'controls', 'keyboard', 'autoplay', 'captions', 'screen reader', 'YouTube'],
  lastUpdated: '2026-02-24'
},

// 1.4-PC-6
{
  questionId: '1.4-PC-6',
  questionText: 'Does your video and social media content include diverse representation, including people with disability?',
  moduleCode: '1.4',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Diverse Representation in Video and Social Content',
  summary: 'When people with disability see themselves in your video and social media content, they know they are welcome as customers, not an afterthought.',

  whyItMatters: {
    text: 'Representation sends a powerful signal. If your promotional videos and social media only show non-disabled people, customers with disabilities receive an unspoken message that your venue is not for them. Authentic, natural inclusion of people with visible and non-visible disabilities across your content normalises disability and actively welcomes a market of 4.4 million Australians.',
  },

  tips: [
    {
      icon: 'Users',
      text: 'Include people with disability naturally across all content, not just awareness campaigns.',
      detail: 'A wheelchair user dining at your restaurant in a general promotional post is far more powerful than a disability-specific campaign posted once a year. Segregated "accessibility" content can feel tokenistic. Instead, ensure people with disability appear in your everyday content: seasonal promotions, new product launches, staff spotlights, and event highlights. The goal is natural presence, not special treatment. A common mistake is only featuring disability representation during International Day of People with Disability (3 December) and then reverting to non-inclusive imagery for the rest of the year.',
      priority: 1
    },
    {
      icon: 'Camera',
      text: 'Feature real customers and staff with their permission.',
      detail: 'Authentic representation from real people resonates far more than stock imagery. Ask loyal customers with disability if they would be willing to appear in your content (always with informed, written consent). Offer something in return, such as a complimentary meal, free admission, or a gift voucher. Real photos show genuine interaction with your venue and demonstrate that people with disability actually visit and enjoy your space. Avoid staging scenarios that look forced or overly sentimental.',
      priority: 2
    },
    {
      icon: 'Heart',
      text: 'Show people with disability doing ordinary things, not being "inspirational."',
      detail: 'Enjoying a meal, browsing exhibits, attending an event, or checking in at a hotel. Not "overcoming" their disability or being "brave." The disability community widely rejects "inspiration porn," which is content that frames ordinary activities as extraordinary simply because the person has a disability. Instead, show people with disability as customers, colleagues, and community members engaged in the same activities as everyone else. If your post would not be remarkable without the disability, it should not be remarkable with it.',
      priority: 3
    },
    {
      icon: 'Eye',
      text: 'Represent a range of disabilities, not just wheelchair users.',
      detail: 'Only 4.4% of people with disability use a wheelchair, yet wheelchair users dominate disability representation in media. Include people who are blind or have low vision (white cane, guide dog), deaf or hard of hearing (hearing aids, cochlear implants, Auslan signers), neurodiverse (autism, ADHD), people with chronic illness or invisible disability, people with prosthetic limbs, people using walkers or mobility scooters, and people with intellectual disability. Diverse representation signals welcome to a much broader audience.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your content for disability representation',
    steps: [
      { text: 'Open a spreadsheet and create columns for: platform, post date, post URL, people visible (yes/no), disability representation visible (yes/no), type of disability shown, context (general content vs. disability-specific), and tone (natural vs. inspirational/tokenistic).' },
      { text: 'Review your last 30 social media posts across all platforms (Instagram, Facebook, TikTok, LinkedIn, X/Twitter). For each post that includes images or video of people, record whether any person with a visible disability is present.',
        measurement: {
          target: 'Posts with disability representation',
          acceptable: 'At least 10-15% of posts featuring people should include visible disability representation',
          unit: 'percentage'
        }
      },
      { text: 'Review your last 5 promotional videos (website hero videos, YouTube content, social media video ads). Note whether people with disability appear and in what context. Are they shown as customers enjoying your venue, or only in a special "accessibility" segment?' },
      { text: 'Check the range of disabilities represented. Tally how many instances show wheelchair users versus other disabilities (vision impairment, hearing aids, prosthetics, guide dogs, mobility aids other than wheelchairs, visible neurodiverse traits). A common gap is over-representing wheelchair users while ignoring all other disabilities.',
        measurement: {
          target: 'Diversity of disabilities represented',
          acceptable: 'At least 2-3 different types of disability represented across your content library',
          unit: 'count'
        }
      },
      { text: 'Check the context of disability representation. Is it concentrated around awareness dates (International Day of People with Disability, National Week of Deaf People) or spread naturally across the year? Representation should appear in everyday content, not only special campaigns.' },
      { text: 'Review the tone. For each post featuring disability, ask: Would this post exist if the person did not have a disability? Does it frame the person as "inspiring" for doing something ordinary? Does it use language like "brave," "overcoming," or "despite"? These are red flags for tokenistic or patronising content.' },
      { text: 'Check your stock image library (if you use one). Search for terms like "disability," "wheelchair," "accessible," and "diverse." What images are available? Are they natural and contemporary, or staged and outdated? Note whether your stock library needs updating.' },
      { text: 'Survey your team. Ask marketing and social media staff whether they have ever considered disability representation when planning content. If not, this identifies a training opportunity.' },
      { text: 'Compile your findings into a brief report noting: current representation rate, types of disability shown, context patterns, tone issues, and specific gaps. Set measurable targets (e.g., disability representation in at least 10% of people-featuring posts within 3 months).' }
    ],
    tools: ['Spreadsheet (Google Sheets or Excel) for tracking', 'Access to all social media accounts and analytics', 'Content calendar or scheduling tool for reviewing planned content'],
    estimatedTime: '45-60 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Resort',
      scenario: 'A coastal resort had been posting on Instagram for over two years, accumulating 500+ posts showing guests enjoying the pool, restaurant, spa, and beach. A content audit revealed zero visible disability representation across all posts. The resort had accessible rooms and facilities, but their social media gave no indication of this. Potential guests with disability browsing the Instagram feed saw no one like themselves and assumed the resort was not accessible.',
      solution: 'The resort invited four guests with disability (a wheelchair user, a person with a guide dog, a family with a child who has Down syndrome, and a person with a prosthetic leg) to participate in a professional photo and video shoot. Each guest received a complimentary two-night stay and a $200 resort credit. The photographer captured natural moments: swimming, dining, exploring the grounds, and relaxing on the balcony. The resort used these images across their regular content calendar throughout the year, interspersed with other guest photos. They explicitly avoided grouping all disability images into a single "accessible resort" post.',
      outcome: 'Within three months, the resort received 15 direct messages from potential guests with disability saying they felt welcome and were considering booking. Bookings from guests requesting accessible rooms increased by 30% over six months. The resort was featured in an accessible travel blog, generating significant additional reach. Staff reported that the photo shoot also strengthened relationships with local disability organisations who helped recruit participants.',
      cost: '$1,500-3,000 (photographer fee plus complimentary stays and credits for participants)',
      timeframe: '1 day for the photo shoot, then ongoing use of images across 6-12 months of content'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme Park',
      scenario: 'A major theme park reviewed their social media analytics and realised disability representation only appeared during International Day of People with Disability (3 December). On that one day each year, they posted a dedicated "accessibility" highlight reel. The rest of the year, across hundreds of posts, no person with a visible disability appeared. This pattern unintentionally sent the message that disability was a once-a-year consideration, not an everyday part of the park experience.',
      solution: 'The marketing team created a revised content calendar with a standing rule: at least one post per week must include a person with a visible disability in a general context (not disability-themed). They sourced images from a combination of real guest photos (with permission), an inclusive stock library (Disability:IN image library and Getty Images "Disability Collection"), and a commissioned photo shoot of families with disability enjoying the park. They also trained all content creators to naturally consider disability inclusion when planning any shoot or selecting images, rather than treating it as a separate category.',
      outcome: 'Disability representation went from 0.3% of posts (1 day per year) to 12% of posts within four months. Social media engagement from followers with disability increased measurably. The park was nominated for an accessibility award by a national disability advocacy organisation for their inclusive marketing. Staff reported that thinking about diverse representation improved their overall content quality and creativity.',
      cost: '$500 for stock image licences, plus $2,000 for a commissioned photo shoot',
      timeframe: '2 weeks to set up the new content calendar and source initial images, then ongoing'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Cafe',
      scenario: 'A popular brunch cafe with a strong social media following (8,000+ Instagram followers) posted daily photos of food and customers. The owner realised that despite having regular customers who use wheelchairs and other mobility aids, these customers never appeared in the cafe\'s social media content. The photographer instinctively framed shots to exclude wheelchairs and mobility aids from the background, reinforcing the invisibility of disability in the cafe\'s online presence.',
      solution: 'The owner spoke with three regular customers with disability and asked if they would be comfortable being featured in social media posts (with a complimentary brunch as thanks). All three agreed enthusiastically. The cafe also stopped the practice of framing out mobility aids and instead captured natural images of customers as they were. The owner added a line to the social media briefing document: "Our content should reflect our real customer base, including people with disability, older adults, and families with young children." Photos of customers with disability were posted in the regular feed rotation alongside other customer features.',
      outcome: 'Two of the three featured customers shared the posts with their own followers, reaching an audience of disability community members who had not previously known about the cafe. The cafe gained 400 new followers within a month. A local disability support coordinator began recommending the cafe to clients as a welcoming and accessible venue, generating an estimated 15-20 new regular customers over three months.',
      cost: 'Free (three complimentary brunches, approximately $90 total)',
      timeframe: '1 week to arrange, then ongoing inclusion in regular content'
    }
  ],

  solutions: [
    {
      title: 'Audit your last 30 social media posts for representation',
      description: 'Review recent content and count how many posts include people with visible or non-visible disabilities. This baseline audit helps identify gaps, set improvement targets, and create accountability for inclusive content going forward.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30-45 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Open your Instagram, Facebook, and other social media profiles. Scroll through your last 30 posts on each platform.',
        'For each post featuring people, ask: Is any person with a visible disability present? Record your count in a simple spreadsheet.',
        'Calculate your representation rate: (posts with disability representation / total posts featuring people) x 100.',
        'Note the context of any existing representation. Is it in general content or only disability-specific posts?',
        'Identify the types of disability shown. Is it only wheelchair users, or does it include a range of disabilities?',
        'Set a target: aim for disability representation in at least 10% of posts that feature people, spread naturally across the year.',
        'Share your findings and target with your marketing team or any staff involved in social media content creation.',
        'Schedule a follow-up audit in 3 months to measure progress against your target.'
      ],
      notes: 'This baseline audit often reveals that representation is at 0-2%, which is a powerful motivator for change. Frame it as an opportunity, not a criticism.'
    },
    {
      title: 'Source inclusive stock imagery',
      description: 'Use disability-inclusive stock photo and video libraries for future content where real customer photos are not yet available. This provides an immediate source of diverse imagery while you build a library of authentic, original content featuring your own customers and staff.',
      resourceLevel: 'medium',
      costRange: '$50-500 (stock photo licences)',
      timeRequired: '1-2 hours to source initial images',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Browse these disability-inclusive stock libraries: Getty Images "Disability Collection," Pexels (search "disability" or "wheelchair" or "accessible"), Unsplash (search similar terms), and the Global Disability Inclusion stock library.',
        'Download 15-20 images that are relevant to your business type and feel natural, not staged. Avoid images that look overly posed or "inspirational."',
        'Check that the images represent a range of disabilities: wheelchair users, people with guide dogs or white canes, hearing aid users, people with prosthetic limbs, people with Down syndrome, and other visible disabilities.',
        'Organise downloaded images in a shared folder labelled "Inclusive imagery library." Tag each image with the disability type and context (e.g., "dining," "outdoor," "family") for easy retrieval.',
        'Brief your social media team: when selecting images for posts, check the inclusive imagery library first. Aim to use at least one inclusive stock image per week until you have sufficient original content.',
        'Review and refresh your stock library quarterly. Replace any images that feel outdated or that you have overused.',
        'Transition toward original photography over time. Stock images are a good starting point, but real customers and staff make the most authentic content.'
      ],
      notes: 'Free stock libraries like Pexels and Unsplash have limited disability-inclusive content but are improving. Paid collections from Getty and Shutterstock tend to have more options and higher quality.'
    },
    {
      title: 'Commission an inclusive photo and video shoot',
      description: 'Hire a photographer and invite customers and staff with disability to participate in creating authentic, original content. This is the highest-impact approach, producing a library of genuine images and video clips that reflect your actual venue and customer base.',
      resourceLevel: 'high',
      costRange: '$1,000-5,000',
      timeRequired: '2-4 weeks (planning through to delivery)',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Identify 3-5 customers or community members with disability who might be willing to participate. Reach out through your existing customer relationships, local disability organisations, or disability advisory networks. Always approach people respectfully and make participation genuinely voluntary.',
        'Offer fair compensation to all participants. This could be a complimentary service (free stay, meal, admission), a gift voucher, or a cash payment. Never ask people with disability to provide their image for free "for exposure."',
        'Brief the photographer on inclusive photography principles: shoot at eye level with wheelchair users (do not shoot down), capture natural moments rather than posed shots, include mobility aids and assistive devices naturally in frame (do not crop them out), and avoid "inspiration" framing.',
        'Plan the shoot locations to showcase your venue in normal operation. Photograph participants doing the same activities any customer would: checking in, dining, browsing, attending events, using facilities.',
        'Ensure the shoot itself is accessible. Confirm accessible parking, pathways, restrooms, and breaks for participants who need them. Have water and seating available.',
        'Obtain signed image release forms from all participants, specifying how the images will be used (social media, website, print marketing, etc.).',
        'Review the images and video with participants before publishing. Give them the opportunity to approve or reject any images they are uncomfortable with.',
        'Organise the final images into your content library, tagged by scenario, disability type, and platform suitability. Plan to distribute them across at least 6 months of content, not all at once.',
        'Share the images with participants for their own use as well. This builds goodwill and often leads to organic sharing within disability communities.',
        'Schedule the next inclusive shoot in 6-12 months to keep your content library fresh and expand the range of people and scenarios represented.'
      ],
      notes: 'Connect with local disability organisations like People with Disability Australia (PWDA), local disability advisory committees, or your state disability advocacy service. They can often recommend participants and advise on respectful engagement.'
    }
  ],

  resources: [
    {
      title: 'People with Disability Australia (PWDA) - Inclusive Communications',
      url: 'https://pwd.org.au/',
      type: 'website',
      source: 'People with Disability Australia',
      description: 'National disability rights organisation that can advise on respectful representation, inclusive language, and connecting with the disability community for content creation.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Getty Images - Disability Collection',
      url: 'https://www.gettyimages.com.au/collections/disability',
      type: 'website',
      source: 'Getty Images',
      description: 'Curated collection of high-quality, authentic stock photos and videos featuring people with disability in everyday situations. Developed in partnership with disability organisations.',
      isFree: false
    },
    {
      title: 'Tourism Australia - Accessible Tourism Resources',
      url: 'https://www.tourism.australia.com/en/markets-and-stats/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'National tourism body resources on marketing to travellers with disability, including guidance on inclusive imagery, language, and representation in tourism marketing.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability:IN - Disability-Inclusive Stock Photography',
      url: 'https://disabilityin.org/resource/disability-inclusive-stock-photography/',
      type: 'website',
      source: 'Disability:IN',
      description: 'Free curated list of disability-inclusive stock photo sources, with guidance on selecting authentic and respectful imagery for marketing and communications.',
      isFree: true
    },
    {
      title: 'Australian Network on Disability - Inclusive Marketing Guide',
      url: 'https://www.and.org.au/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Resources and guidance for businesses on inclusive marketing, disability confidence, and engaging authentically with customers and employees with disability.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.6-PC-1',
      questionText: 'Does your marketing imagery include people with disability?',
      relationship: 'Marketing and social media representation should be consistent',
      moduleCode: '1.6'
    }
  ],

  keywords: ['representation', 'diversity', 'inclusion', 'social media', 'video', 'disability', 'imagery'],
  lastUpdated: '2026-02-24'
},

// Module 1.5: Clear and Welcoming Information

// 1.5-PC-1
{
  questionId: '1.5-PC-1',
  questionText: 'Do your website and communications use clear, plain language that is easy to understand?',
  moduleCode: '1.5',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Plain Language in Communications',
  summary: 'Plain language helps everyone understand your content, including people with cognitive disabilities, learning differences, non-native English speakers, and people who are stressed or distracted.',

  whyItMatters: {
    text: 'Complex language excludes people. About 44% of Australian adults have literacy levels below what is needed to cope with everyday life demands. People with cognitive disabilities, intellectual disabilities, acquired brain injuries, and learning differences such as dyslexia all benefit from plain language. So does everyone else when they are tired, distracted, or in a hurry.',
    statistic: {
      value: '44%',
      context: 'of Australian adults have literacy skills below Level 3, meaning they struggle with complex or lengthy texts.',
      source: 'Australian Bureau of Statistics, Programme for International Assessment of Adult Competencies'
    }
  },

  tips: [
    {
      icon: 'Type',
      text: 'Aim for a reading level of Year 8-9 (Flesch-Kincaid Grade 8-9).',
      detail: 'This is not "dumbing down." Major newspapers, government communications, and health information all target this level. The Australian Government Style Manual recommends Grade 8 or below for public-facing content. A common mistake is assuming your audience is as familiar with your industry as you are. Test every page, not just the homepage.',
      priority: 1
    },
    {
      icon: 'Scissors',
      text: 'Keep sentences short: aim for 15-20 words on average.',
      detail: 'Long sentences force readers to hold too much information in working memory, which is especially difficult for people with cognitive disabilities or acquired brain injuries. If a sentence has more than 25 words, split it at the conjunction or comma. Avoid stacking multiple clauses. One idea per sentence is the gold standard.',
      priority: 2
    },
    {
      icon: 'Replace',
      text: 'Replace jargon with everyday words.',
      detail: 'Use "help" instead of "facilitate", "use" instead of "utilise", "start" instead of "commence", "about" instead of "approximately". Tourism and hospitality jargon like "amenities", "complimentary", and "concierge" should also be tested with your audience. If in doubt, use the simpler option. The Plain English Foundation recommends choosing the word a 14-year-old would know.',
      priority: 3
    },
    {
      icon: 'ListChecks',
      text: 'Use headings, bullet points, and short paragraphs to break up text.',
      detail: 'Walls of text are daunting for everyone and particularly challenging for people using screen magnifiers, who see only a small portion of the page at a time. Keep paragraphs to 3-4 sentences maximum. Use descriptive headings (not clever or vague ones) so people scanning the page can find what they need. Numbered lists work best for sequential steps, bullet points for non-ordered items.',
      priority: 4
    },
    {
      icon: 'TestTube',
      text: 'Test readability with free tools like Hemingway Editor.',
      detail: 'Paste your text into hemingwayapp.com to see the reading level and find complex sentences. Microsoft Word also has built-in readability statistics (File > Options > Proofing > check "Show readability statistics"). Run tests on at least five key pages: homepage, accessibility page, booking page, contact page, and FAQ. A common mistake is only testing the homepage and missing dense content buried on internal pages.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Test your content readability',
    steps: [
      { text: 'Copy the full text from your homepage and paste it into hemingwayapp.com. Record the grade level it reports. A score of Grade 9 or below is the target.' },
      {
        text: 'Repeat for your accessibility page, booking page, contact page, and FAQ page. Record each score separately.',
        measurement: {
          target: 'Flesch-Kincaid Grade Level',
          acceptable: 'Grade 8-9 or below',
          unit: 'grade level'
        }
      },
      { text: 'In each page, highlight every sentence that is longer than 25 words. Count how many there are. If more than 20% of sentences exceed 25 words, the page needs reworking.' },
      { text: 'Search for common jargon terms. Use Ctrl+F (or Cmd+F) to search for: "utilise", "facilitate", "commence", "approximately", "amenities", "complimentary", "pursuant", "in accordance with". Make a list of every instance found.' },
      { text: 'Check for unexplained acronyms. Search for capital-letter sequences (e.g., "NDIS", "TGA", "FAQ") and verify that each one is spelled out on first use on every page where it appears.' },
      { text: 'Read three key paragraphs aloud. If you stumble, run out of breath, or lose track of the meaning, the sentence is too complex. Mark these for rewriting.' },
      { text: 'Ask someone outside your industry (a friend, family member, or new staff member) to read your accessibility page and explain it back to you. Note anything they misunderstand or find confusing.' },
      {
        text: 'Check paragraph lengths across all tested pages. Count the sentences in each paragraph and flag any paragraph with more than 5 sentences.',
        measurement: {
          target: 'Sentences per paragraph',
          acceptable: '3-4 sentences maximum',
          unit: 'sentences'
        }
      },
      { text: 'Review headings on each page. Are they descriptive (e.g., "How to book an accessible room") or vague (e.g., "More info")? Vague headings need rewriting.' },
      { text: 'Document your findings in a simple spreadsheet with columns: Page Name, Grade Level, Jargon Count, Long Sentence Count, Action Needed. This becomes your improvement plan.' }
    ],
    tools: ['Hemingway Editor (hemingwayapp.com, free)', 'Microsoft Word readability statistics (built-in)', 'Google Docs (Tools > Word count for sentence-level checks)', 'Readable.com (free tier available, provides multiple readability scores)'],
    estimatedTime: '45-60 minutes'
  },

  examples: [
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council',
      scenario: 'A regional council\'s tourism website used formal language throughout, including phrases like "patrons are advised to utilise the designated accessible egress points" and "complimentary parking amenities are available pursuant to Council regulation 4.12." The average reading level across 40 visitor-facing pages was Grade 14, equivalent to a university-level text. Visitor feedback repeatedly mentioned "confusing website."',
      solution: 'A staff member spent two days rewriting all 40 visitor information pages using plain language principles. "Patrons are advised to utilise the designated accessible egress points" became "Use the accessible exits, which are marked with signs." Each page was tested in Hemingway Editor and rewritten until it scored Grade 8 or below. A jargon glossary was created listing 35 terms that were replaced across the site. The team also broke long paragraphs into bullet points and added clear headings to each section.',
      outcome: 'Average page reading level dropped from Grade 14 to Grade 8. Page engagement (time on page) increased by 35%. Complaints about "confusing website" dropped by 60% in the following quarter. The jargon glossary was adopted by all council departments as a style reference.',
      cost: 'Free (staff rewriting time, approximately 16 hours)',
      timeframe: '2 days for key pages, 1 additional week for remaining pages'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'National Park',
      scenario: 'A national park visitor centre published trail information using scientific and technical terms like "undulating terrain with intermittent bituminous surfaces and a gradient not exceeding 1:14." Visitors with cognitive disabilities and those with English as a second language found the descriptions unusable. Park staff reported spending significant time on the phone explaining trail conditions to confused visitors.',
      solution: 'The park created two versions of each trail description. The default plain language version said "Mostly flat sealed path with a gentle hill near the lookout. Suitable for wheelchairs and prams." A "Detailed trail information" link provided the full technical version for experienced hikers and access consultants. Each plain language description included: surface type, steepness in simple terms, distance, estimated time, and rest stop locations. All descriptions were reviewed by a local disability advisory group before publication.',
      outcome: 'Phone enquiries about trail conditions dropped by 40% in the first three months. Visitors with disability reported feeling more confident planning their visits. The plain language trail descriptions were shared by three disability travel blogs, driving a 15% increase in visitors who identified as having a disability. Two schools for students with intellectual disability began booking regular group visits.',
      cost: 'Free (ranger and admin staff time, approximately 20 hours)',
      timeframe: '1 week for 12 trail descriptions'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Boutique Hotel',
      scenario: 'A boutique hotel\'s booking confirmation emails used hospitality jargon such as "complementary in-room amenities", "concierge-facilitated arrangements", and "check-in commences at 1400 hours." Guests frequently called to clarify details, and guests with cognitive disabilities reported feeling anxious about misunderstanding the booking terms.',
      solution: 'The hotel rewrote all automated emails using Hemingway Editor, targeting Grade 7 reading level. "Check-in commences at 1400 hours" became "Check-in is from 2:00 pm." "Complementary in-room amenities" became "Free items in your room (coffee, tea, shampoo, soap)." They also added a "Questions about your booking?" section at the bottom of each email with a direct phone number and email address. Staff were trained to use the same plain language in phone and in-person conversations.',
      outcome: 'Pre-arrival phone calls asking for clarification dropped by 50%. Guest satisfaction scores for "clear communication" increased from 3.8 to 4.6 out of 5. Two disability advocacy organisations added the hotel to their recommended accommodation lists, generating an estimated 25 additional bookings in the first six months.',
      cost: 'Free (staff time to rewrite 8 email templates)',
      timeframe: '1 day for email templates, 1 hour for staff briefing'
    }
  ],

  solutions: [
    {
      title: 'Run your top 5 pages through a readability checker',
      description: 'Use Hemingway Editor or similar tools to identify complex sentences and high reading levels on your most visited pages. Focus on your homepage, accessibility page, booking page, contact page, and FAQ. This gives you a baseline score and a hit-list of sentences to simplify.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Open hemingwayapp.com in your browser.',
        'Navigate to your website homepage in another tab.',
        'Select all visible text on the homepage (Ctrl+A or Cmd+A), copy it (Ctrl+C), and paste it into Hemingway Editor.',
        'Record the grade level shown in the bottom-right corner. Target is Grade 9 or below.',
        'Review sentences highlighted in red (very hard to read) and yellow (hard to read). Rewrite each one to be shorter and simpler.',
        'Replace any words highlighted in purple (complex words) with simpler alternatives. Hemingway suggests replacements.',
        'Repeat steps 3-6 for your accessibility page, booking/reservations page, contact page, and FAQ page.',
        'For each page, create a simple note: Page Name, Original Grade, Revised Grade, Number of Changes Made.',
        'Update the rewritten content on your live website. If you use a CMS like WordPress, edit each page directly.',
        'Bookmark hemingwayapp.com and commit to testing all new content before publishing.'
      ],
      notes: 'Microsoft Word users can also enable readability statistics: go to File > Options > Proofing > tick "Show readability statistics." After running a spelling and grammar check, Word will display the Flesch-Kincaid Grade Level.'
    },
    {
      title: 'Create a plain language style guide for your team',
      description: 'Document your preferred tone, reading level target, and a jargon-to-plain-language glossary for all content creators. This ensures consistency across your website, social media, printed materials, and email communications. A good style guide prevents new jargon from creeping back in.',
      resourceLevel: 'medium',
      costRange: 'Free-$500',
      timeRequired: '1-2 days',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Download the Australian Government Style Manual plain language checklist from stylemanual.gov.au as a starting template.',
        'Set your target reading level (recommended: Grade 8 for public-facing content, Grade 10 maximum for technical content).',
        'Create a two-column "Jargon Swap" table. In the left column, list every industry term, acronym, and formal word your organisation commonly uses. In the right column, write the plain language alternative.',
        'Write 3-5 example paragraphs showing before (jargon-heavy) and after (plain language) versions from your own content.',
        'Add a section on sentence structure: maximum 20 words per sentence, one idea per sentence, active voice preferred over passive.',
        'Include a paragraph structure rule: maximum 4 sentences per paragraph, use bullet points for lists of 3 or more items.',
        'Add guidance on headings: use descriptive headings (not clever ones), format as questions where possible (e.g., "How do I book?").',
        'Share the guide with all staff who create content: marketing, front desk, social media, email communications.',
        'Schedule a 30-minute team briefing to walk through the guide and answer questions.',
        'Set a quarterly review reminder to update the jargon list and check new content against the guide.',
        'Pin the guide in your team communication channel (Slack, Teams) and print a one-page summary for desks.'
      ],
      notes: 'The Australian Government Style Manual (stylemanual.gov.au) is free and provides excellent plain language guidance that works for any organisation, not just government.'
    },
    {
      title: 'Professional content rewrite to plain language standards',
      description: 'Engage a plain language specialist or accessibility-focused copywriter to audit and rewrite your entire website and key printed materials. This is ideal for organisations with large volumes of content or content that includes legal, medical, or technical information. The specialist will also provide a style guide tailored to your organisation for maintaining plain language in future content.',
      resourceLevel: 'high',
      costRange: '$2,000-5,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Compile a list of all pages and documents that need rewriting. Prioritise customer-facing content.',
        'Search for plain language specialists in Australia. The Plain English Foundation (plainenglishfoundation.com) maintains a directory. Centre for Inclusive Design also offers content services.',
        'Request quotes from 2-3 specialists. Provide your page count, current grade level (from your Hemingway audit), and target grade level.',
        'Brief the chosen specialist on your audience: who visits your website, what they need to find, and any accessibility-specific requirements.',
        'Ask the specialist to deliver a style guide alongside the rewritten content so your team can maintain the standard.',
        'Review the rewritten content with your team. Check that technical accuracy has been preserved while language has been simplified.',
        'Ask at least two people with disability (or a disability advisory group) to review the rewritten content for clarity and tone.',
        'Publish the rewritten content and update your CMS templates to include readability reminders for future authors.',
        'Schedule a 6-month follow-up audit using Hemingway Editor to check that new content added since the rewrite still meets your target grade level.'
      ],
      notes: 'When briefing the specialist, provide examples of customer enquiries and complaints related to confusing content. This helps them understand real pain points.'
    }
  ],

  resources: [
    {
      title: 'Hemingway Editor',
      url: 'https://hemingwayapp.com/',
      type: 'tool',
      source: 'Hemingway',
      description: 'Free online tool that checks reading level and highlights complex sentences, passive voice, and hard-to-read phrases.',
      isFree: true
    },
    {
      title: 'Australian Government Style Manual - Plain Language',
      url: 'https://www.stylemanual.gov.au/writing-and-designing-content/clear-language-and-writing-style/plain-language-and-word-choice',
      type: 'guide',
      source: 'Australian Government',
      description: 'Official Australian Government guide to plain language writing, with practical tips and examples. Free and regularly updated.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Plain English Foundation',
      url: 'https://www.plainenglishfoundation.com/',
      type: 'website',
      source: 'Plain English Foundation',
      description: 'Australian organisation offering training, editing services, and resources for clear communication. Provides a directory of plain language professionals.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Plain Language Action and Information Network',
      url: 'https://www.plainlanguage.gov/guidelines/',
      type: 'guide',
      source: 'US Federal Government',
      description: 'Comprehensive plain language guidelines with before-and-after examples applicable to any content type.',
      isFree: true
    },
    {
      title: 'Readable.com',
      url: 'https://readable.com/',
      type: 'tool',
      source: 'Readable',
      description: 'Content readability scoring tool with free tier. Provides Flesch-Kincaid, Gunning Fog, and other readability metrics plus keyword density analysis.',
      isFree: false
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.5-PC-2',
      questionText: 'Do you use respectful, person-centred language when referring to people with disability?',
      relationship: 'Plain language and respectful language work together for inclusive communications',
      moduleCode: '1.5'
    }
  ],

  keywords: ['plain language', 'readability', 'simple', 'clear', 'Hemingway', 'Flesch', 'jargon'],
  lastUpdated: '2026-02-24'
},

// 1.5-PC-2
{
  questionId: '1.5-PC-2',
  questionText: 'Do you use respectful, person-centred language when referring to people with disability?',
  moduleCode: '1.5',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Respectful Disability Language',
  summary: 'The words you use shape how customers feel. Respectful, person-centred language avoids outdated terms and treats people with disability as individuals, not defined by their condition.',

  whyItMatters: {
    text: 'Language that was once common (like "handicapped", "wheelchair-bound", or "suffers from") is now understood to be disrespectful. These terms frame disability as a personal tragedy rather than a characteristic. Using current, respectful language shows customers that your organisation understands disability and values them as people first.',
  },

  tips: [
    {
      icon: 'UserCheck',
      text: 'Both "person with disability" and "disabled person" are acceptable in Australia.',
      detail: 'Different communities have different preferences. "Person with disability" (person-first) is standard in Australian Government communications. "Disabled person" (identity-first) is preferred by some in the Deaf community and autistic community. Both are respectful. Terms like "special needs", "handicapped", and "differently abled" are not acceptable. When writing for a broad audience, use "person with disability" as your default.',
      priority: 1
    },
    {
      icon: 'XCircle',
      text: 'Avoid terms like "wheelchair-bound", "suffers from", and "special needs".',
      detail: 'Say "wheelchair user" (the wheelchair provides freedom, not confinement). Say "has [condition]" or "lives with [condition]" (not "suffers from", which implies constant misery). Say "accessibility requirements" or describe the specific need (not "special needs", which is vague and patronising). Also avoid "brave", "inspiring", or "overcomes" when describing routine activities, as this frames disability as inherently tragic.',
      priority: 2
    },
    {
      icon: 'MessageCircle',
      text: 'When unsure, ask the person how they prefer to be described.',
      detail: 'Asking respectfully is always better than guessing. A simple "Do you have a preferred way you like us to describe accessibility needs in your booking?" works well. Some people prefer identity-first language ("autistic person"), while others prefer person-first ("person with autism"). Individual preference always takes priority over general guidelines. Never argue with someone about how they identify.',
      priority: 3
    },
    {
      icon: 'Search',
      text: 'Search your website for outdated terms and update them.',
      detail: 'Use Ctrl+F (or Cmd+F) to search for these specific terms: "handicap", "handicapped", "wheelchair-bound", "confined to a wheelchair", "suffers from", "suffering", "special needs", "differently abled", "the disabled", "able-bodied" (use "non-disabled" instead), "normal" (when contrasted with disabled). Check every page, not just the accessibility section. Marketing copy and blog posts often contain overlooked instances.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your language',
    steps: [
      { text: 'Open your website in a browser. Use Ctrl+F (or Cmd+F) on each page to search for: "handicap", "wheelchair-bound", "suffers from", "special needs", "differently abled", "confined to", "the disabled", "able-bodied", "normal" (in disability context). Record every instance found, noting the page URL and the surrounding sentence.' },
      { text: 'Review your dedicated accessibility page line by line. Check that every reference to disability uses current, respectful terminology. Look specifically for phrases like "disabled toilets" (use "accessible toilets"), "disabled parking" (use "accessible parking"), and "handicapped access" (use "accessible entrance").' },
      { text: 'Download or open your printed marketing materials (brochures, flyers, event programs). Search for the same outdated terms. Note that printed materials may contain older language that was not updated when the website was.' },
      { text: 'Review your social media accounts. Scroll through the last 6 months of posts and search for disability-related terms. Social media posts are often written quickly and may contain casual language that would not pass a formal review.' },
      { text: 'Check staff communication templates: booking confirmation emails, enquiry response templates, phone scripts, and any standard letters. These are often overlooked and may contain phrases like "Do you have any special needs?" (replace with "Do you have any accessibility requirements we can assist with?").' },
      { text: 'Review any forms (online or paper) that ask about disability. Check that questions are framed positively and use current terms. For example, "Do you have a disability? Yes/No" is better replaced with "Do you have any accessibility requirements? If so, please describe them so we can assist."' },
      {
        text: 'Count the total number of outdated terms found across all channels. This gives you a baseline to measure improvement.',
        measurement: {
          target: 'Outdated disability terms',
          acceptable: '0 instances across all channels',
          unit: 'instances'
        }
      },
      { text: 'If possible, ask a disability organisation or consultant to review your communications for tone and language. People with Disability Australia (pwd.org.au) and state disability peak bodies can sometimes assist or recommend reviewers.' }
    ],
    tools: ['Browser search function (Ctrl+F or Cmd+F)', 'People with Disability Australia Language Guide (pwd.org.au)', 'Australian Government Style Manual disability language section'],
    estimatedTime: '45-60 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A hotel chain\'s website referred to "handicapped rooms" on 14 separate pages, described guests who "suffer from mobility issues" in its accessibility policy, and used "wheelchair-bound guests" in booking confirmation emails. A disability advocacy group publicly flagged the language in a review, stating they would not recommend the hotel to their members.',
      solution: 'The marketing manager conducted a full audit of the website, email templates, and printed materials using the search terms from People with Disability Australia\'s language guide. "Handicapped room" became "accessible room" on all 14 pages. "Suffers from mobility issues" became "has a mobility disability." "Wheelchair-bound" became "wheelchair user." They also updated booking forms, replacing "Do you have any special needs?" with "Do you have any accessibility requirements we can assist with?" A one-page language reference card was printed and placed at every front desk terminal.',
      outcome: 'The disability advocacy group updated their review to acknowledge the changes and added the hotel to their recommended list. Bookings from guests identifying as having a disability increased by 18% in the following quarter. Three other hotels in the group adopted the same language guide.',
      cost: 'Free (marketing manager spent 4 hours on audit and updates)',
      timeframe: '1 day for website, 1 additional day for templates and printed materials'
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council',
      scenario: 'A metropolitan council\'s communications used "special needs" and "the disabled" across hundreds of pages spanning 12 department websites. Attempts to fix language piecemeal had been inconsistent, with some departments using "people with disability" and others still using "disabled people" or "handicapped." There was no shared standard, and the disability advisory committee had raised the issue at three consecutive meetings.',
      solution: 'The council engaged their disability advisory committee to co-author an official language style guide. The guide specified "person with disability" as the default for council communications, with a list of 20 specific term replacements. IT staff ran a site-wide search across all 12 department websites, generating a report of every instance of outdated terms (312 instances found). A two-week sprint was organised with content editors from each department to update their pages. The style guide was then embedded into the CMS as an editorial prompt that appears when authors use flagged terms.',
      outcome: 'All 312 instances were resolved within three weeks. The disability advisory committee formally commended the council. The style guide was published as a public resource and adopted by two neighbouring councils. A CMS plugin now flags outdated terms in real time, preventing regression. Six months later, a follow-up audit found only 4 new instances (all in recently uploaded documents), which were corrected immediately.',
      cost: 'Free (staff time across departments, approximately 60 hours total)',
      timeframe: '3 weeks for full implementation'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Operator',
      scenario: 'A whale-watching tour operator\'s website described their accessible boat as suitable for "the handicapped" and stated tours were "not recommended for people suffering from severe disabilities." The language appeared on their homepage, booking page, and in Google search snippets. A potential customer contacted them asking what "severe disabilities" meant and whether her daughter, who uses a power wheelchair, would be turned away.',
      solution: 'The owner rewrote all disability-related content with guidance from the local tourism accessibility network. "Suitable for the handicapped" became "Our vessel is wheelchair accessible with a flat boarding ramp and accessible viewing deck." The exclusionary statement was replaced with specific practical information: "Our vessel accommodates manual and power wheelchairs up to 80cm wide. The accessible viewing area is on the lower deck. Please contact us to discuss your specific requirements so we can ensure a great experience." They added a direct phone number and email for accessibility enquiries.',
      outcome: 'The customer booked the tour for her daughter and later left a 5-star review mentioning the welcoming language. Accessibility-related bookings increased by 30% over the next season. The tour operator was featured in a disability travel blog as a positive example of inclusive language.',
      cost: 'Free (2 hours of the owner\'s time)',
      timeframe: '2 hours'
    }
  ],

  solutions: [
    {
      title: 'Search and replace outdated terms on your website',
      description: 'Use browser search and your CMS find-and-replace to systematically update the most common outdated terms across your website and marketing materials. This is the fastest way to eliminate the most visible language issues and can be completed in a single sitting.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Download and print the People with Disability Australia Language Guide from pwd.org.au/resources/language-guide/ as your reference.',
        'Open your website CMS (WordPress, Squarespace, etc.) and use its global search function.',
        'Search for "handicap" (catches "handicapped", "handicap accessible", etc.). Replace all instances with "accessible" or "person with disability" depending on context.',
        'Search for "wheelchair-bound" and "confined to a wheelchair." Replace with "wheelchair user" or "uses a wheelchair."',
        'Search for "suffers from" and "suffering from." Replace with "has" or "lives with."',
        'Search for "special needs." Replace with "accessibility requirements", "accessibility needs", or describe the specific requirement.',
        'Search for "the disabled" and "disabled people" (if your style preference is person-first). Replace with "people with disability."',
        'Search for "able-bodied." Replace with "non-disabled" or rephrase the sentence.',
        'Search for "normal" in contexts comparing to disability (e.g., "normal entrance"). Replace with "main entrance" or "standard."',
        'After all replacements, re-read each changed sentence in context to ensure it still makes grammatical sense and reads naturally.',
        'Check your Google Business Profile, TripAdvisor listing, and any third-party directory listings for the same outdated terms.'
      ],
      notes: 'If your CMS does not have global search-and-replace, use a browser extension like "Search and Replace" for Chrome, or export your content and use a text editor.'
    },
    {
      title: 'Create a disability language guide for your team',
      description: 'Write a one-page quick-reference guide of preferred vs. outdated terminology for all staff to use in written and verbal communications. This ensures consistency and prevents individual staff members from accidentally using outdated terms. Laminate copies for reception desks and break rooms.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Use the People with Disability Australia Language Guide as your starting template.',
        'Create a two-column table: "Instead of..." (left column) and "Use..." (right column). Include at least 15 specific term replacements relevant to your industry.',
        'Add a section explaining person-first ("person with disability") and identity-first ("disabled person") language, noting both are acceptable in Australia.',
        'Include 3-5 example sentences specific to your business. For example, for a hotel: "Instead of: Do you have any special needs? Use: Do you have any accessibility requirements we can help with?"',
        'Add a note on tone: avoid pity ("unfortunate"), heroism ("brave"), or surprise ("amazing that you travel"). Treat the interaction as you would with any customer.',
        'Include guidance on what to do when unsure: "If you are not sure how to refer to a person\'s disability, it is always okay to ask: How would you like me to note your requirements?"',
        'Format the guide as a single A4 page (front and back if needed) so it can be printed and pinned up.',
        'Review the draft with any staff members who have disability, or with your local disability advisory group.',
        'Print and laminate copies for reception, reservations desk, and staff break room.',
        'Distribute a digital copy via email to all staff and pin it in your team chat channel (Slack, Teams).',
        'Include the guide in new staff onboarding packs.',
        'Schedule a 6-month review to update the guide based on any new feedback or evolving terminology.'
      ],
      notes: 'Language evolves. What is considered respectful may change over time. Review your guide annually and update it based on current guidance from disability peak bodies.'
    }
  ],

  resources: [
    {
      title: 'People with Disability Australia - Language Guide',
      url: 'https://pwd.org.au/resources/language-guide/',
      type: 'guide',
      source: 'People with Disability Australia',
      description: 'Comprehensive Australian guide to respectful disability language with specific term replacements and explanations of why certain terms are outdated.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Government Style Manual - Disability Language',
      url: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/inclusive-language/people-disability',
      type: 'guide',
      source: 'Australian Government',
      description: 'Official Australian Government guidance on inclusive disability language for public communications. Regularly updated to reflect current community preferences.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Network on Disability - Inclusive Language Guide',
      url: 'https://www.and.org.au/resources/inclusive-language/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Workplace-focused guide to disability-inclusive language from Australia\'s leading employer disability network. Includes tips for verbal and written communication.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Language Style Guide',
      url: 'https://ncdj.org/style-guide/',
      type: 'guide',
      source: 'National Center on Disability and Journalism (US)',
      description: 'Detailed A-Z guide covering hundreds of disability-related terms with guidance on preferred usage. Useful as a comprehensive reference alongside Australian guides.',
      isFree: true
    },
    {
      title: 'Scope Australia - Communication Access Resources',
      url: 'https://www.scopeaust.org.au/disability-info/communication/',
      type: 'website',
      source: 'Scope Australia',
      description: 'Resources on accessible communication from one of Australia\'s largest disability service providers. Includes information on augmentative and alternative communication.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.5-PC-3',
      questionText: 'Do you describe your accessibility features positively, focusing on what IS available?',
      relationship: 'Respectful language and positive framing together create welcoming communications',
      moduleCode: '1.5'
    },
    {
      questionId: '1.6-PC-2',
      questionText: 'Do your promotional materials avoid stereotypes or "inspiration porn" when depicting disability?',
      relationship: 'Both address how disability is portrayed in your communications',
      moduleCode: '1.6'
    }
  ],

  keywords: ['language', 'respectful', 'person-centred', 'terminology', 'disability language', 'inclusive'],
  lastUpdated: '2026-02-24'
},

// 1.5-PC-3
{
  questionId: '1.5-PC-3',
  questionText: 'Do you describe your accessibility features positively, focusing on what IS available?',
  moduleCode: '1.5',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Positive Framing of Accessibility Information',
  summary: 'Describing what you offer (rather than what you lack) creates a welcoming tone. "Step-free access via side entrance" is more helpful and inviting than "Wheelchair users cannot use the main entrance."',

  whyItMatters: {
    text: 'The way you describe accessibility shapes how customers feel before they arrive. Negative framing ("unfortunately we cannot...", "limited access", "no disabled parking") creates a sense of unwelcome. Positive framing ("accessible parking on Level 1", "step-free route via garden path", "assistance available on request") presents the same information in a way that empowers customers to plan their visit confidently.',
  },

  tips: [
    {
      icon: 'ThumbsUp',
      text: 'Lead with what IS available, then add honest context if needed.',
      detail: '"Accessible entrance via King Street (main entrance has 2 steps)" gives the solution first. This approach gives customers the information they need to act on immediately, with the limitation as secondary context. A common mistake is leading with the barrier ("Main entrance has steps") and burying the solution further down the page or not mentioning it at all.',
      priority: 1
    },
    {
      icon: 'Smile',
      text: 'Avoid apologetic language like "unfortunately" or "we only have".',
      detail: 'Say "We have one accessible room on the ground floor" not "Unfortunately we only have one accessible room." Apologetic language implies that accessibility is a burden or afterthought. It also creates doubt in the customer\'s mind about whether your organisation genuinely welcomes them. State the facts confidently without qualifiers.',
      priority: 2
    },
    {
      icon: 'Target',
      text: 'Be specific rather than vague.',
      detail: '"Accessible toilet on ground floor, 30m from main entrance, left-hand transfer" is more useful than "some accessible facilities available." Specific details allow people to make informed decisions. Vague descriptions force customers to phone ahead, which many find stressful. Include distances, directions, transfer sides, and any equipment available.',
      priority: 3
    },
    {
      icon: 'Heart',
      text: 'Include a welcoming statement that sets the tone.',
      detail: 'Start your accessibility page with something like "We welcome all visitors and want everyone to enjoy their experience. Here is what we have in place to support you." This framing positions accessibility as something your organisation actively provides, not something you were forced to do. Place it at the very top of the page, before the detailed information.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your accessibility information framing',
    steps: [
      { text: 'Open your accessibility page (or the page where you describe accessibility features). Print it out or copy it into a document so you can annotate it.' },
      { text: 'Use a highlighter or text colour to mark every sentence that contains negative framing. Look for: "unfortunately", "cannot", "no", "not able to", "limited", "only", "restricted", "unable", "we apologise", "we regret". Count the total number of negatively framed statements.' },
      {
        text: 'Count the ratio of positive statements to negative statements. Your goal is at least 3 positive statements for every 1 limitation mentioned.',
        measurement: {
          target: 'Positive to negative statement ratio',
          acceptable: '3:1 or higher',
          unit: 'ratio'
        }
      },
      { text: 'For each negatively framed statement, rewrite it using positive framing. Example: "No accessible parking on site" becomes "Accessible street parking available on George Street, 50m from the entrance." If there genuinely is no alternative to offer, state the fact neutrally without apology: "The upper floor is accessed by stairs only."' },
      { text: 'Check whether your accessibility page leads with a welcoming statement. If not, draft one that sets an inclusive tone. For example: "We welcome all visitors. Here is what we have in place to make your visit comfortable."' },
      { text: 'Review the specificity of each accessibility feature described. Flag any statement that is vague, such as "some accessible facilities" or "limited wheelchair access." Rewrite each one with specific details: what the feature is, where it is located, and how to access it.' },
      { text: 'Check the order of information on your page. Ensure the most commonly needed information appears first: entrance access, parking, toilets, and how to get help. Information about limitations should appear after the relevant solution, not before it.' },
      { text: 'Review email templates and phone scripts for the same negative framing patterns. Staff responding to accessibility enquiries by phone or email should use the same positive framing as the website.' },
      { text: 'Ask someone with disability (a friend, customer, or advisory group member) to read your rewritten page and give feedback on how it makes them feel. Ask specifically: "Does this make you feel welcome? Is there anything that feels discouraging?"' },
      { text: 'Document your before-and-after versions for training purposes. These real examples from your own content are the most effective way to teach staff the difference between negative and positive framing.' }
    ],
    tools: ['Printed copy of your accessibility page or digital document for annotation', 'Highlighter pens or text highlighting tool', 'People with Disability Australia framing guidelines'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Gallery',
      scenario: 'A city gallery\'s accessibility page opened with: "Unfortunately the main entrance is not wheelchair accessible. Access is limited to the ground floor only. We apologise for the inconvenience." The page listed 8 accessibility features but framed 6 of them negatively. Visitors with disability reported that reading the page made them feel like they would be a burden, and several chose not to visit.',
      solution: 'The gallery manager rewrote the entire page with positive framing. "Unfortunately the main entrance is not wheelchair accessible" became "Wheelchair access is via the Garden Entrance on Smith Street (clearly signposted, level entry)." "Access is limited to the ground floor only" became "The ground floor galleries are fully accessible with wide pathways. The upper floor is accessible via the platform lift (ask staff for assistance)." They added a welcoming opening paragraph: "We are committed to making art accessible to everyone. Here is what we offer to support your visit." Each feature was described with specific location details and directions.',
      outcome: 'Same physical building, completely different impression. Feedback from visitors with disability shifted from "felt unwelcome" to "felt genuinely invited." The gallery saw a 25% increase in visitors who requested accessibility support in the first three months after the rewrite. The approach was adopted as a template by the state gallery network.',
      cost: 'Free (gallery manager spent 2 hours rewriting)',
      timeframe: '2 hours for the accessibility page, 1 additional hour to update email templates'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A popular restaurant\'s website said: "We have limited disabled facilities. No disabled parking. Wheelchair access to ground floor only." The total accessibility information was three sentences, all negative. The restaurant actually had level entry, wide aisles, an accessible toilet, and nearby street parking with accessible bays, but none of this was described.',
      solution: 'The owner created a proper accessibility section: "Accessible features: Level entry via front door (no steps). Wide aisles throughout ground floor dining area. Accessible table seating available (please request when booking). Accessible toilet on ground floor (left-hand transfer, grab rails both sides). Accessible street parking bays on George Street, 50m from entrance. Our staff are happy to assist with seating, menus, and any other requirements." They also added "Accessibility information" as a menu item in the website navigation so it was easy to find.',
      outcome: 'The restaurant began receiving bookings specifically mentioning the helpful accessibility information. A wheelchair user who had driven past the restaurant for years (assuming it was inaccessible) became a weekly regular. Online reviews mentioning accessibility went from 0 to 8 in six months, all positive. The accessible parking information alone was cited in 5 reviews as especially helpful.',
      cost: 'Free (owner spent 1 hour writing content)',
      timeframe: '1 hour'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Holiday Park',
      scenario: 'A coastal holiday park\'s accessibility section read: "We only have 2 accessible cabins. Unfortunately pets are not allowed in accessible cabins. Pool is not accessible. No beach wheelchair available." Four sentences, all framed as limitations. Potential guests with disability described the experience of reading this as "being told all the things we can\'t do before we even arrive."',
      solution: 'The park rewrote the section to lead with what is available: "Two accessible cabins are located closest to the amenities block, with roll-in showers, grab rails, and lowered kitchen benches. Cabin 12 has ocean views. Accessible amenities block with shower, toilet, and change area is 30m from cabins. Our pool has a hoist for water entry (staff can demonstrate). Beach access is via a compacted gravel path to the viewing platform." For genuine limitations, they added neutral context: "The beach sand is not firm enough for standard wheelchairs. We are investigating beach wheelchair options for the 2027 season." They also added contact details for accessibility enquiries.',
      outcome: 'Accessible cabin bookings increased by 40% in the first season. Guests with disability began recommending the park in online disability travel forums. The park received a local tourism award for accessibility improvements (noting the communication changes as a key factor). They have since purchased a beach wheelchair based on demand.',
      cost: 'Free (manager spent 2 hours rewriting)',
      timeframe: '2 hours for website content'
    }
  ],

  solutions: [
    {
      title: 'Rewrite your accessibility page with positive framing',
      description: 'Review every sentence on your accessibility page and rewrite negative statements to lead with solutions. This single change transforms how customers perceive your venue before they arrive. Most businesses can complete this in one sitting with dramatic results.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Print your current accessibility page or copy the text into a document.',
        'Highlight every sentence that contains: "unfortunately", "cannot", "no", "limited", "only", "not able to", "we apologise".',
        'For each highlighted sentence, identify the underlying accessibility feature or fact. Write it down in neutral terms.',
        'Rewrite each sentence to lead with the positive aspect. "No accessible parking" becomes "Accessible parking available on [street name], [distance] from entrance." "Limited wheelchair access" becomes "[Specific areas] are wheelchair accessible via [specific route]."',
        'Where a genuine limitation exists with no alternative, state it neutrally: "The upper floor is accessed by stairs only" (no apology, no "unfortunately").',
        'Add a welcoming opening paragraph at the top of the page. Example: "We welcome all visitors and want everyone to enjoy their experience. Here is what we have in place to support you."',
        'Add specific details to every feature: location, distance from entrance, how to find it, and how to get help if needed.',
        'Include a contact option at the bottom: "Have questions about accessibility? Contact [name] at [phone] or [email]. We are happy to help you plan your visit."',
        'Read the entire page aloud and ask yourself: "Would I feel welcome and confident visiting after reading this?"',
        'Publish the updated content and ask a friend or colleague with disability to review it.'
      ],
      notes: 'Keep a copy of your before-and-after text. It makes an excellent training resource for staff.'
    },
    {
      title: 'Create a positive framing template for staff communications',
      description: 'Provide before-and-after examples of negative vs. positive framing that staff can reference when responding to accessibility enquiries by phone, email, or in person. This ensures consistency across all customer touchpoints and empowers staff to respond confidently rather than awkwardly.',
      resourceLevel: 'medium',
      costRange: 'Free',
      timeRequired: '2-3 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Collect the most common accessibility questions your staff receive (by phone, email, and in person). Aim for at least 10 common scenarios.',
        'For each question, write a "negative framing" example (how staff might instinctively respond) and a "positive framing" alternative.',
        'Example: Question: "Is your venue wheelchair accessible?" Negative: "Unfortunately our main entrance has steps." Positive: "Yes, wheelchair access is via our King Street entrance, which has level entry. I can give you directions from our car park if that helps."',
        'Create an email template for accessibility enquiries that opens with a welcoming statement and provides key information in bullet points.',
        'Create a phone script guide with 5-6 suggested opening phrases. Example: "Thanks for calling. I would love to help you plan your visit. Let me tell you about our accessible features."',
        'Include a section on what to say when you genuinely cannot accommodate a request: "I am sorry we don\'t have that feature at the moment. What I can offer is [alternative]. Would that work for you?"',
        'Format the guide as a quick-reference card (laminated, double-sided A5) that can be kept at reception and phone stations.',
        'Role-play 3-4 scenarios in a team meeting so staff can practise the new framing in a safe environment.',
        'Ask staff to report back on any new questions or awkward situations so you can add responses to the guide.',
        'Review and update the guide every 6 months based on staff feedback and new accessibility features.'
      ],
      notes: 'The most powerful training tool is real examples from your own organisation. Use your before-and-after website text and actual customer enquiries (anonymised) in the training.'
    }
  ],

  resources: [
    {
      title: 'Tourism Australia - Accessible Tourism Guide',
      url: 'https://www.tourism.australia.com/en/events-and-tools/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'National guide for tourism operators on describing and promoting accessibility features, including examples of positive framing.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Visit England - Accessibility Information Guide for Businesses',
      url: 'https://www.visitengland.com/accessibility',
      type: 'guide',
      source: 'Visit England',
      description: 'Practical guide to writing welcoming accessibility descriptions for tourism and hospitality businesses. Includes before-and-after examples.',
      isFree: true
    },
    {
      title: 'Australian Human Rights Commission - Disability Discrimination',
      url: 'https://humanrights.gov.au/our-work/disability-rights',
      type: 'website',
      source: 'Australian Human Rights Commission',
      description: 'Background on disability rights and the Disability Discrimination Act 1992, which underpins the obligation to provide accessible information.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Travability - Accessible Accommodation Listings',
      url: 'https://www.travability.travel/',
      type: 'website',
      source: 'Travability',
      description: 'Australian accessible travel platform showing examples of well-described accessibility information. Useful as a benchmark for how to frame your own features.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Centre for Inclusive Design - Communication Resources',
      url: 'https://centreforinclusivedesign.org.au/',
      type: 'website',
      source: 'Centre for Inclusive Design',
      description: 'Australian organisation providing resources and consulting on inclusive communication, including how to describe accessibility features positively.',
      isAustralian: true,
      isFree: false
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.5-PC-1',
      questionText: 'Do your website and communications use clear, plain language?',
      relationship: 'Plain language and positive framing together create the most welcoming communications',
      moduleCode: '1.5'
    }
  ],

  keywords: ['positive framing', 'welcoming', 'tone', 'language', 'accessibility description', 'inclusive'],
  lastUpdated: '2026-02-24'
},

// 1.5-PC-7
{
  questionId: '1.5-PC-7',
  questionText: 'Do you let customers know that information is available in alternative formats?',
  moduleCode: '1.5',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Alternative Information Formats',
  summary: 'Offering information in large print, Easy Read, audio, or digital formats ensures customers with different needs can access your content. Even if you cannot produce these in advance, being willing to provide them on request matters.',

  whyItMatters: {
    text: 'Not everyone reads standard print. People with low vision may need large print. People with intellectual disabilities may need Easy Read (simple words with pictures). Blind people may need audio or digital formats compatible with screen readers. If customers do not know these options exist, they cannot ask for them.',
  },

  tips: [
    {
      icon: 'FileText',
      text: 'Add "Available in other formats on request" to key documents.',
      detail: 'Menus, brochures, event programs, and visitor guides are priorities. A simple note in the footer of each document is all it takes. Use 12pt minimum font for the notice itself. Common mistake: adding the notice only to the website but not to the physical documents where people encounter them.',
      priority: 1
    },
    {
      icon: 'ZoomIn',
      text: 'Large print is the most commonly requested format.',
      detail: 'Large print means 18pt font minimum (16pt absolute minimum), preferably in a sans-serif font like Arial, Verdana, or Calibri. Use bold for headings but not body text. Maintain high contrast (dark text on light background, avoid coloured backgrounds). You can produce a large print version from any existing Word document in minutes by simply increasing the font size and adjusting margins.',
      priority: 2
    },
    {
      icon: 'Image',
      text: 'Easy Read uses simple words and supporting images.',
      detail: 'Easy Read documents use short sentences (8-10 words), common words, and one idea per line, with photographs or simple illustrations to support each point. They benefit people with intellectual disabilities, cognitive impairments, low literacy, and English as a second language. While professional Easy Read design is ideal, you can create a basic version yourself using the Scope Australia guidelines.',
      priority: 3
    },
    {
      icon: 'Globe',
      text: 'Digital formats (HTML, accessible PDF) work with screen readers.',
      detail: 'If your content is on your website in proper HTML with heading structure and alt text for images, it is already in a screen-reader-friendly format. PDFs are often not accessible unless they have been specifically tagged. To check, open a PDF and try selecting text; if you cannot, it is an image-based PDF and is completely inaccessible to screen readers. Adobe Acrobat Pro can add tags to make PDFs accessible.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Assess your alternative format provision',
    steps: [
      { text: 'Gather all your key customer-facing documents: menus, brochures, visitor guides, event programs, booking confirmations, safety information, and maps. Check each one for a notice about alternative formats. Record which documents have the notice and which do not.' },
      {
        text: 'Check your accessibility page on your website. Does it list what formats are available and how to request them? It should include a phone number and email address for format requests.',
        measurement: {
          target: 'Alternative format notice presence',
          acceptable: 'Listed on accessibility page with contact details',
          unit: 'yes/no'
        }
      },
      { text: 'Test your large print readiness. Open your most important document (e.g., menu or visitor guide) in Word or your design software. Increase the body text to 18pt sans-serif font. Can you produce a usable large print version within 15 minutes? If yes, you are ready to fulfil requests. If no, note what changes are needed.' },
      {
        text: 'Check your PDFs for accessibility. Open each PDF on your website and attempt to select and copy text. If the text cannot be selected, it is an image-based PDF and needs to be recreated or tagged. Also check if the PDF has a tagged structure by opening it in Adobe Acrobat and checking File > Properties > Description tab.',
        measurement: {
          target: 'PDF accessibility (text selectable and tagged)',
          acceptable: 'All PDFs are text-based and tagged',
          unit: 'pass/fail per document'
        }
      },
      { text: 'Ask your front-line staff: "If a customer asked for a large print menu right now, could you provide one? How quickly?" If the answer is "no" or "I would not know how", there is a process gap to address.' },
      { text: 'Check whether your website content is available in a screen-reader-friendly format. Navigate your key pages using only a keyboard (Tab to move, Enter to activate). If you cannot reach all content and interactive elements, screen reader users will have the same problem.' },
      { text: 'Review whether you have any Easy Read materials. If not, identify your single most important document for a future Easy Read version. Typically this is a visitor guide, safety information, or a "What to expect" overview.' },
      { text: 'Check if your booking confirmation emails and pre-visit communications mention alternative formats. Many businesses add the notice to their website but forget transactional emails.' },
      {
        text: 'Count the total number of key documents you have and how many are available in at least one alternative format (large print, Easy Read, accessible digital, or audio). Calculate your coverage percentage.',
        measurement: {
          target: 'Documents available in alternative formats',
          acceptable: 'Top 3 documents available in at least large print and accessible digital',
          unit: 'percentage of key documents'
        }
      },
      { text: 'Create an action plan listing: which formats you can offer now, which you could produce on request within 24 hours, and which would need professional help. This becomes your "alternative formats" capability statement.' }
    ],
    tools: ['Adobe Acrobat Reader (free, for checking PDF text selection)', 'Adobe Acrobat Pro (paid, for PDF tagging)', 'Microsoft Word (for creating large print versions)', 'Keyboard-only navigation testing (no additional tools needed)', 'PAC 2024 PDF Accessibility Checker (free, pdfua.foundation)'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A family restaurant had only printed menus in 10pt font on a dark patterned background. Customers with low vision had to ask staff to read items aloud, which many found embarrassing and time-consuming. One regular customer with macular degeneration stopped visiting because she did not want to "be a bother." The restaurant was unaware that low vision affects 1 in 5 Australians over age 55.',
      solution: 'The owner created a large print menu in 18pt Arial on cream paper with high contrast black text, using bold only for section headings. They also added a QR code to each table linking to the full menu on their website, which was already screen-reader compatible. Staff were trained to proactively offer "We have a large print menu and a digital version on your phone via QR code. Which would you prefer?" rather than waiting for customers to ask. A note "Menu available in large print and digital formats" was added to the bottom of the standard menu.',
      outcome: 'The regular customer with macular degeneration returned and became a weekly visitor again. Staff reported 3-4 requests per week for the large print menu, far more than expected, indicating a previously unmet need. Customer satisfaction scores for the over-55 age group increased by 22%. The QR code menu was also popular with younger customers who preferred browsing on their phones.',
      cost: '$50-100 (printing large print menus, QR code generation is free)',
      timeframe: '3 hours to create large print version and QR code, 30 minutes for staff briefing'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Zoo',
      scenario: 'A metropolitan zoo\'s 24-page visitor guide was a glossy brochure with 8pt text overlaid on photographs, making it extremely difficult to read for people with low vision, dyslexia, or cognitive disabilities. The guide was the primary way visitors navigated the zoo and learned about feeding times and shows. No alternative versions existed. Staff at the information desk frequently encountered visitors who could not read the guide and needed verbal directions, creating queues during peak periods.',
      solution: 'The zoo created three alternative versions of the visitor guide. First, a large print version (18pt, plain background, high contrast) covering the essential information: map, show times, accessible routes, and facility locations. Second, an Easy Read version created with a specialist from Scope Australia, using simple sentences and photographs to explain what visitors would experience, where key facilities were, and how to ask for help. Third, the full guide was published on the website as accessible HTML with proper heading structure and alt text for all images. A note "This guide is available in large print, Easy Read, and digital formats. Ask at the information desk or visit [URL]" was printed on the front cover of the standard guide.',
      outcome: 'The Easy Read guide became unexpectedly popular with families, international visitors, and school groups. Over 2,000 Easy Read copies were distributed in the first year, compared to an initial print run of 500. Three schools for students with intellectual disability began booking regular visits specifically because the Easy Read guide existed. Requests for verbal directions at the information desk dropped by 35% during peak periods. The zoo won a state accessibility award, citing the alternative format guides as a key initiative.',
      cost: '$1,200 for Easy Read specialist, $300 for large print printing, free for website version',
      timeframe: '3 weeks for Easy Read version, 1 day for large print, 2 days for website version'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre provided event programs only as standard A5 booklets in 9pt font. Delegates with low vision, acquired brain injuries, and learning disabilities could not follow the program independently. When delegates contacted the centre to request alternative formats, staff did not know how to respond. One delegate with low vision publicly complained on social media that "a venue that hosts disability sector events cannot even provide a large print program."',
      solution: 'The centre developed an alternative format policy and workflow. For every event, they now produce: a large print program (A4, 18pt font, high contrast), an accessible digital program emailed to all delegates one week before the event, and a simplified "at a glance" schedule on A3 laminated cards placed at information points. They added "Program available in large print, accessible digital, and simplified formats. Please contact us at [email] to request your preferred format" to all event confirmation emails. Staff were trained on the process, and a template for each format was created to speed up production.',
      outcome: 'Format requests increased from 0 to an average of 12 per event, confirming previously unmet demand. The social media complaint was replaced by a positive post from the same delegate praising the improvement. Three disability sector organisations switched their annual conferences to the venue, citing the alternative format policy as a deciding factor. Revenue from these events was approximately $45,000 in the first year.',
      cost: '$200 per event (staff time for format conversion and printing)',
      timeframe: '1 week to create templates and train staff, 2-3 hours per event ongoing'
    }
  ],

  solutions: [
    {
      title: 'Add "Available in other formats" notices',
      description: 'Add a line to your key documents and website stating that information is available in alternative formats on request. This costs nothing and immediately signals that you are willing to accommodate different needs. Even if you have not yet created alternative versions, the notice tells customers they can ask.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '30-60 minutes',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Draft your standard notice text. Suggested wording: "This information is available in large print, Easy Read, and digital formats on request. Contact [name/role] on [phone] or [email]."',
        'Add this notice to the footer or back page of your top 3 most important printed documents (menu, visitor guide, event program).',
        'Add the notice to your website accessibility page. Include the specific formats you can offer and an estimated response time (e.g., "within 24 hours").',
        'Add the notice to your booking confirmation email template so customers know about the option before they arrive.',
        'Ensure the notice itself is in at least 12pt font and high contrast so it can be read by people who need alternative formats.',
        'Brief front-line staff on what to do if someone requests an alternative format. At minimum, they should know: who to contact, what formats are available, and how long it takes.',
        'Create a simple internal process note: "If a customer requests [format], [staff member] will produce it using [method] within [timeframe]."',
        'Test the process by having a colleague "request" a large print version of your most important document. Can you fulfil the request within 24 hours?'
      ],
      notes: 'You do not need to have every format ready in advance. The key is to be willing and able to produce them on request within a reasonable timeframe (24-48 hours for most formats).'
    },
    {
      title: 'Create a large print version of your main document',
      description: 'Reformat your most important customer document (menu, visitor guide, event program) in 18pt sans-serif font with high contrast. Large print is the most commonly requested alternative format and can be produced from any existing Word document in under an hour. Having copies ready at your venue means you can offer them proactively.',
      resourceLevel: 'medium',
      costRange: '$50-200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Identify your most important customer-facing document. For restaurants this is usually the menu. For attractions it is the visitor guide. For events it is the program.',
        'Open the document in Microsoft Word (or create a new Word version if the original is in a design tool like InDesign or Canva).',
        'Set the body text to 18pt minimum in a sans-serif font: Arial, Verdana, Calibri, or Tahoma. Set headings to 22-24pt bold.',
        'Set page size to A4 (you may need to use A3 for documents with a lot of content, then fold to A4).',
        'Remove or simplify background images and patterns. Use a plain white or cream background with black text for maximum contrast.',
        'Ensure line spacing is set to at least 1.5 (Format > Paragraph > Line Spacing). This prevents lines from appearing to merge together.',
        'Left-align all text (do not justify, as justified text creates uneven word spacing that is difficult for some readers).',
        'Use bold for headings and key information, but avoid italics (which are harder to read at any size) and underlining (which can obscure descenders like g, p, y).',
        'Print a test copy and hold it at arm\'s length. Can you read it comfortably? Ask someone with reading glasses to test it too.',
        'Print 5-10 copies to keep at your venue. Store them at the front desk or information point where staff can offer them proactively.',
        'Add "Large print version available. Please ask staff." as a note on your standard printed document.',
        'Set a reminder to update the large print version whenever the standard version changes (e.g., seasonal menu updates).'
      ],
      notes: 'For menus that change frequently, consider creating a large print template with fixed formatting. Then you only need to update the content each time, not redo the formatting.'
    },
    {
      title: 'Commission an Easy Read version of key information',
      description: 'Engage an Easy Read specialist to create a version of your most important visitor information using simple language and supporting images. Easy Read benefits people with intellectual disabilities, cognitive impairments, acquired brain injuries, low literacy, and English as a second language. It is a specialised format that follows specific guidelines and is best produced by trained writers.',
      resourceLevel: 'high',
      costRange: '$500-2,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Identify the single most important document to convert to Easy Read. This is usually a "What to expect" visitor guide, a safety information sheet, or a simplified menu/program.',
        'Contact an Easy Read specialist. In Australia, Scope Australia (scopeaust.org.au) is the leading provider. Other options include: Access Easy English, Inclusion Melbourne, and some disability advocacy organisations.',
        'Request quotes from 2-3 providers. Provide the source document, the target audience, and the intended use (printed, digital, or both).',
        'Brief the specialist on your organisation: what you do, who visits, and what information is most important for visitors to understand.',
        'Ask the specialist to include photographs or clear illustrations (not clip art) to support the text. Photos of your actual venue are ideal.',
        'Review the draft Easy Read version with people who will use it. The specialist should include user testing with people with intellectual disability as part of their process. Confirm this is included in the quote.',
        'Request both a print-ready PDF and a Word version so you can make minor updates yourself in future (e.g., changing opening hours).',
        'Print an initial run of 50-100 copies. Track how quickly they are distributed to gauge demand.',
        'Make the Easy Read version available as a downloadable PDF on your website, alongside the standard version.',
        'Add "Easy Read version available" to your standard documents and accessibility page.',
        'Brief front-line staff on what Easy Read is and where to find copies, so they can offer it confidently.'
      ],
      notes: 'Easy Read is a specific format with established guidelines (from Scope Australia and international bodies). It is not simply "plain language." If budget is limited, start with a 2-4 page Easy Read "What to expect" overview rather than converting a full document.'
    }
  ],

  resources: [
    {
      title: 'Scope Australia - Easy English / Easy Read Services',
      url: 'https://www.scopeaust.org.au/service/easy-english/',
      type: 'guide',
      source: 'Scope Australia',
      description: 'Australia\'s leading Easy Read provider. Offers guidelines, training, and document conversion services. Includes free resources on Easy Read principles.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Vision Australia - Alternative Formats',
      url: 'https://www.visionaustralia.org/',
      type: 'website',
      source: 'Vision Australia',
      description: 'Information on alternative formats for people with low vision and blindness, including large print guidelines, audio format standards, and braille services.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'PAC 2024 - PDF Accessibility Checker',
      url: 'https://pdfua.foundation/en/pac-2024/',
      type: 'tool',
      source: 'PDF/UA Foundation',
      description: 'Free tool to check whether your PDFs meet accessibility standards (PDF/UA). Reports issues with tagging, reading order, alt text, and structure.',
      isFree: true
    },
    {
      title: 'Australian Government Style Manual - Alternative Formats',
      url: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/designing-accessible-content',
      type: 'guide',
      source: 'Australian Government',
      description: 'Government guidance on creating accessible content in multiple formats, including large print, Easy Read, accessible PDF, and digital content.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'W3C - Making Content Usable for People with Cognitive and Learning Disabilities',
      url: 'https://www.w3.org/TR/coga-usable/',
      type: 'guide',
      source: 'W3C',
      description: 'International guidelines for creating content that is accessible to people with cognitive and learning disabilities. Covers format, structure, and language considerations.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.5-PC-1',
      questionText: 'Do your website and communications use clear, plain language?',
      relationship: 'Plain language is the foundation for all formats, including Easy Read',
      moduleCode: '1.5'
    }
  ],

  keywords: ['alternative formats', 'large print', 'Easy Read', 'audio', 'accessible PDF', 'braille'],
  lastUpdated: '2026-02-24'
},

// Module 1.6: Marketing and Representation

// 1.6-PC-1
{
  questionId: '1.6-PC-1',
  questionText: 'Does your marketing imagery include people with disability?',
  moduleCode: '1.6',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Disability Representation in Marketing Imagery',
  summary: 'When people with disability see themselves in your marketing, they know they are welcome. Inclusive imagery should appear naturally across all your content, not just on accessibility-specific pages.',

  whyItMatters: {
    text: 'Marketing imagery sends a powerful message about who is welcome. If your brochures, website, and advertisements only show non-disabled people, customers with disabilities may assume your venue is not for them. The disability market in Australia represents 4.4 million people, plus their families and carers. Inclusive marketing is both the right thing to do and a sound business decision.',
    statistic: {
      value: '$54 billion',
      context: 'is the estimated annual spending power of Australians with disability and their households.',
      source: 'Australian Network on Disability'
    }
  },

  tips: [
    {
      icon: 'Image',
      text: 'Review your existing marketing: How many images include people with disability?',
      detail: 'Audit your website hero images, brochures, social media posts, and email newsletters. Count total images, then count how many feature people with visible or indicated disability. If the answer is zero or under 5%, start with your next scheduled photo update or stock image refresh. Aim for at least 15-20% of "people" images to include disability representation.',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Show people with disability as ordinary customers, not "featured" for being disabled.',
      detail: 'A wheelchair user dining naturally in your restaurant photo is far more effective than a separate "spotlight on accessibility" feature. Avoid centering the disability as the subject of the image. The focus should be on the activity (eating, browsing, swimming) with disability simply present in the scene. Common mistake: placing disabled people alone in images rather than with friends, family, or other customers.',
      priority: 2
    },
    {
      icon: 'Palette',
      text: 'Represent diverse disabilities, not only wheelchair users.',
      detail: 'Wheelchair users make up only about 5% of people with disability. Include people who are blind or have low vision (using a cane or guide dog), Deaf or hard of hearing (wearing hearing aids or using Auslan), neurodiverse individuals, people with chronic conditions or invisible disabilities, and people using various mobility aids like walkers, crutches, or prosthetics. Avoid the common mistake of treating wheelchair imagery as sufficient representation.',
      priority: 3
    },
    {
      icon: 'Camera',
      text: 'Use real customers (with permission) rather than generic stock photos.',
      detail: 'Authentic representation resonates more strongly than staged stock imagery. Ask satisfied customers if they would be willing to participate in a photo shoot, and always obtain written consent using a model release form. Offer compensation such as a voucher or free experience. If using stock photos as a starting point, choose libraries that feature real disabled people rather than actors simulating disability.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Marketing imagery audit',
    steps: [
      { text: 'Create a spreadsheet with columns for: material name, total people images, images with disability representation, type of disability shown, and context (natural vs tokenised).' },
      { text: 'Collect your top 20 marketing materials across all channels: website pages, brochures, social media posts from the last 3 months, email newsletters, print advertisements, and directory listings.' },
      {
        text: 'Count total images that include people across all materials.',
        measurement: {
          target: 'Images with disability representation',
          acceptable: 'At least 15-20% of people images',
          unit: 'percentage'
        }
      },
      { text: 'For each image with disability representation, note whether the person is shown in an active, natural role (customer, participant, decision-maker) or a passive, tokenised role (alone, being helped, singled out).' },
      { text: 'Check whether disability representation appears across general marketing or only on accessibility-specific pages. Mark any pages or materials that confine disability imagery to a separate section.' },
      { text: 'Review diversity of disability types shown. Note whether you only show wheelchair users or also include people with sensory, cognitive, and invisible disabilities.' },
      { text: 'Audit your stock photo library or image folder. Flag any images that are clearly staged, show outdated equipment, or depict disability in a pitying or inspirational tone.' },
      { text: 'Compare your imagery to 2-3 competitors or industry leaders known for inclusive marketing. Note specific gaps where your materials fall short.' },
      { text: 'Compile findings into a brief report with specific recommendations, prioritising your highest-traffic materials (website homepage, main brochure, social media profiles) for first updates.' }
    ],
    tools: ['Spreadsheet (Excel or Google Sheets)', 'WebAIM contrast checker (for related accessibility checks)', 'Screenshot tool for documenting current state'],
    estimatedTime: '45-60 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel Chain',
      scenario: 'A mid-size hotel chain with 12 properties audited their website and found that across 240 marketing images, not a single one included a person with a visible disability. Their accessible room pages showed empty rooms only. Guest surveys indicated that travellers with disability often chose competitor hotels that showed inclusive imagery, because they felt more confident about the welcome they would receive.',
      solution: 'The marketing manager commissioned a dedicated photo shoot at three properties, hiring five models with diverse disabilities including a wheelchair user, a person with a guide dog, a person wearing hearing aids, and a person with a prosthetic limb. They also invited four regular guests with disability to participate (with compensation of a free night stay). Images were integrated across all room pages, the dining section, pool and recreation galleries, and the homepage hero rotation. The photographer was briefed to capture natural, candid moments rather than posed "accessibility" shots.',
      outcome: 'Within 6 months, bookings through disability organisations increased by 35%. The hotel received unprompted positive media coverage in two travel publications. Staff surveys showed increased pride in the brand. The investment paid for itself within the first quarter through new bookings alone.',
      cost: '$2,500-5,000 (professional photo shoot across 3 properties, including model fees and guest compensation)',
      timeframe: '1 day shooting per property + 2 weeks for editing and rollout across digital channels'
    },
    {
      businessType: 'retail',
      businessTypeLabel: 'Shopping Centre',
      scenario: 'A suburban shopping centre used generic stock photos across their website, seasonal campaigns, and printed directories. After a complaint from a local disability advocacy group, management reviewed their entire image library and found zero disability representation across 150+ images. The centre had recently invested $200,000 in physical accessibility upgrades but had not communicated these improvements visually.',
      solution: 'The centre switched to disability-inclusive stock libraries (The Disability Collection and Getty Disability Collection) for immediate use, purchasing 30 licences covering diverse disabilities and shopping scenarios. They also organised a "Real Shoppers" photo event, inviting local customers (including members of the disability advocacy group) to participate in a professionally photographed shopping experience with $50 gift card incentives. The resulting images were integrated into the seasonal campaign, website, and a new digital directory.',
      outcome: 'Social media engagement on posts featuring the "Real Shoppers" images was 3.2x higher than average posts. The centre was featured in a local newspaper story about inclusive business practices. Foot traffic from disability groups visiting the upgraded accessible facilities increased noticeably in the following quarter.',
      cost: '$300-600 (stock licences) + $800 (customer photo day with photographer and gift cards)',
      timeframe: '2 weeks for stock image sourcing, 1 day for photo event, 1 week for rollout'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Adventure Tour Company',
      scenario: 'An adventure tour operator running accessible kayaking and bushwalking experiences had no disability representation in their marketing. Their Instagram feed and website showed only non-disabled participants. Despite offering genuinely accessible tours, they received almost no enquiries from customers with disability because potential customers could not see evidence that the tours were suitable for them.',
      solution: 'The operator asked three past participants with disability (a wheelchair user who kayaked, a blind hiker with a guide dog, and a Deaf couple) if they would be willing to share their photos and short testimonials. With written consent, these were featured on the homepage, in a dedicated Instagram highlights reel, and in the Google My Business listing. Each image was captioned with the activity, not the disability (e.g., "Sunset kayak tour on the Murray" rather than "Accessible kayaking").',
      outcome: 'Enquiries from customers with disability increased by 60% over the next season. The operator was listed in the Accessible Tourism Guide for South Australia. Three disability support organisations began recommending the tours to their clients.',
      cost: 'Free (used customer-supplied photos with permission)',
      timeframe: '3-5 days to collect permissions, curate content, and update listings'
    }
  ],

  solutions: [
    {
      title: 'Source disability-inclusive stock imagery',
      description: 'Use inclusive stock photo libraries for your next website or marketing update. This provides immediate visual representation while you plan longer-term authentic content creation. Focus on selecting images that show disabled people in natural, active roles relevant to your business.',
      resourceLevel: 'low',
      costRange: '$50-300',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Visit The Disability Collection (thedisabilitycollection.com), an Australian-based inclusive stock library, and browse their catalogue for images relevant to your industry.',
        'Also check Getty Images Disability Collection, Pexels (search "disability" or "wheelchair"), and Canva stock library (filter for diversity).',
        'Select 10-15 images showing diverse disabilities (mobility, sensory, cognitive) in scenarios that match your business: dining, shopping, touring, relaxing.',
        'Ensure images show people in active roles (ordering food, browsing products, enjoying activities) rather than passive or isolated poses.',
        'Download and organise images in a shared folder labelled "Inclusive Marketing Assets" with licence details noted.',
        'Replace 3-5 of your most visible marketing images (homepage hero, brochure cover, social media profile) with inclusive alternatives.',
        'Update alt text on all new images to describe the scene naturally without centring disability (e.g., "Guests enjoying poolside drinks" not "Disabled guest at pool").',
        'Schedule remaining images for integration across other pages and materials over the next 2-4 weeks.'
      ],
      notes: 'Free options exist on Pexels and Unsplash, though the selection is more limited. The Disability Collection offers the best Australian-specific imagery.'
    },
    {
      title: 'Include disability representation in your next photo shoot',
      description: 'When you next commission photography, ensure the brief includes diverse representation including people with disability. This integrates inclusive imagery into your regular marketing workflow without requiring a separate budget line. The result is authentic, on-brand content that shows your actual venue and services.',
      resourceLevel: 'medium',
      costRange: '$500-2,000 (within existing shoot budget)',
      timeRequired: '1 day',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Add a diversity requirement to your photography brief: "Models and participants must include at least one person with a visible disability, representing a range of disability types across the shoot."',
        'Contact local disability organisations (e.g., People with Disability Australia, local independent living centres) to ask if any members would like to participate. Offer fair compensation ($100-200 per person or equivalent in-kind).',
        'Alternatively, contact inclusive modelling agencies such as Zebedee Management or The Able Agency who represent models with disability.',
        'Brief the photographer to capture candid, natural moments. Provide examples of good inclusive imagery from The Disability Collection or similar sources as reference.',
        'Plan shots that show people with disability in the same activities as other participants: ordering food, checking in, browsing, playing, relaxing.',
        'Ensure the venue is set up accessibly for the shoot day (clear pathways, accessible facilities available) so participants are comfortable.',
        'Have a model release form ready for all participants. Explain how and where images will be used.',
        'During the shoot, take at least 3 setups where disabled and non-disabled participants are together in group scenes.',
        'In post-production, select images where disability is naturally present but not the focal point of the composition.',
        'Integrate the new images across all marketing channels within 2 weeks of receiving edited files.'
      ],
      notes: 'Ask participants for input on how they would like to be photographed. Avoid directing poses that emphasise the disability.'
    },
    {
      title: 'Develop an inclusive marketing strategy',
      description: 'Create a marketing policy that requires disability representation across all materials, with guidelines, accountability measures, and a content calendar. This ensures inclusivity is embedded in your marketing processes permanently rather than being a one-off effort. A documented strategy also helps train new marketing staff and maintain consistency.',
      resourceLevel: 'high',
      costRange: '$1,000-3,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage a disability marketing consultant or organisation (such as the Australian Network on Disability) to review your current marketing and provide a baseline assessment.',
        'Draft an Inclusive Marketing Policy document covering: representation targets (e.g., minimum 15% disability representation in people imagery), language guidelines, image sourcing standards, and review processes.',
        'Establish a disability advisory panel of 3-5 people with diverse disabilities who can review marketing materials quarterly. Budget $100-200 per person per review session.',
        'Create an inclusive image library brief for your design team, specifying acceptable sources, diversity requirements, and examples of authentic vs. tokenistic representation.',
        'Build accessibility and representation checkpoints into your marketing approval workflow. No campaign goes live without a diversity check.',
        'Develop a content calendar with at least 4 dedicated social media posts per year celebrating accessibility milestones, International Day of People with Disability (3 December), and your own accessibility improvements.',
        'Train all marketing staff on disability etiquette, inclusive language, and the difference between authentic representation and "inspiration porn." Budget 2-3 hours for initial training.',
        'Set up annual marketing audits to track representation metrics and identify gaps. Report results to senior management alongside other marketing KPIs.',
        'Partner with disability-led media outlets (such as Disability Loop or Starting With Julius) to amplify your inclusive marketing reach.',
        'Review and update the strategy annually based on advisory panel feedback and evolving best practices.'
      ],
      notes: 'The Australian Human Rights Commission offers free resources on inclusive communications that can inform your strategy development.'
    }
  ],

  resources: [
    {
      title: 'The Disability Collection',
      url: 'https://thedisabilitycollection.com/',
      type: 'website',
      source: 'The Disability Collection',
      description: 'Australian disability-inclusive stock photography featuring authentic representation of people with diverse disabilities in everyday scenarios.',
      isAustralian: true,
      isFree: false
    },
    {
      title: 'Getty Images Disability Collection',
      url: 'https://www.gettyimages.com.au/photos/disability',
      type: 'website',
      source: 'Getty Images',
      description: 'Diverse disability stock photography from a major image library. Filter by disability type, activity, and setting.',
      isFree: false
    },
    {
      title: 'Starting With Julius: Inclusive Marketing Guide',
      url: 'https://www.startingwithjulius.org.au/',
      type: 'guide',
      source: 'Starting With Julius (Cerebral Palsy Alliance)',
      description: 'Australian initiative promoting authentic representation of people with disability in advertising, media, and marketing. Includes guidelines, case studies, and a pledge for businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Network on Disability: Inclusive Marketing',
      url: 'https://www.and.org.au/',
      type: 'website',
      source: 'Australian Network on Disability',
      description: 'Resources and advisory services for businesses wanting to improve disability inclusion in marketing and communications.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Loop',
      url: 'https://www.disabilityloop.com/',
      type: 'website',
      source: 'Disability Loop',
      description: 'Australian disability-led media platform providing news, reviews, and resources. Useful for understanding the perspective of your target audience and finding collaboration opportunities.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.6-PC-2',
      questionText: 'Do your promotional materials avoid stereotypes or "inspiration porn"?',
      relationship: 'Inclusive imagery must also be authentic and avoid stereotypes',
      moduleCode: '1.6'
    },
    {
      questionId: '1.4-PC-6',
      questionText: 'Does your video and social media content include diverse representation?',
      relationship: 'Representation should be consistent across marketing and social media',
      moduleCode: '1.4'
    }
  ],

  keywords: ['marketing', 'imagery', 'representation', 'disability', 'inclusive', 'stock photos', 'branding'],
  lastUpdated: '2026-02-24'
},

// 1.6-PC-2
{
  questionId: '1.6-PC-2',
  questionText: 'Do your promotional materials avoid stereotypes or "inspiration porn" when depicting disability?',
  moduleCode: '1.6',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Avoiding Disability Stereotypes in Marketing',
  summary: 'Authentic representation shows people with disability as ordinary customers and community members, not as objects of pity or inspiration for simply living their lives.',

  whyItMatters: {
    text: '"Inspiration porn" is content that frames people with disability as inspirational simply for existing or doing everyday things. It might seem positive, but it objectifies disabled people for the benefit of non-disabled audiences. Authentic marketing shows people with disability shopping, dining, travelling, and working, not "overcoming" their disability or being "brave" for leaving the house.',
    quote: {
      text: 'I am not brave for going to a restaurant. I am hungry. Show me as a customer, not an inspiration.',
      attribution: 'Disability advocate, marketing feedback'
    }
  },

  tips: [
    {
      icon: 'XCircle',
      text: 'Avoid narratives like "despite their disability" or "brave" for everyday activities.',
      detail: 'Shopping, dining, attending events, and travelling are ordinary activities, not feats of courage. Phrases like "confined to a wheelchair," "suffers from," and "overcame their disability" are red flags. Review all copy for these patterns. If you would not write "despite being tall" then do not write "despite their disability." Also avoid framing accessibility features as acts of charity ("We generously provide ramps").',
      priority: 1
    },
    {
      icon: 'Users',
      text: 'Show people with disability in active, empowered roles.',
      detail: 'Depict disabled people as decision-makers, leaders, experts, and customers in charge of their own experience, not as passive recipients of help. A common mistake is showing a non-disabled person pushing a wheelchair user or guiding a blind person as the central action of the image. Instead, show the disabled person making a purchase, choosing from a menu, leading a group, or enjoying an activity independently or with peers.',
      priority: 2
    },
    {
      icon: 'Equal',
      text: 'Apply the "non-disabled test" to every image and caption.',
      detail: 'If an image or piece of text only "works" because someone in it is disabled, it is likely stereotypical. For example, a photo of someone in a wheelchair eating lunch is just a lunch photo. But if the caption says "Nothing stops Sarah from enjoying a meal out," the disability has been made the story. The test: would you write the same caption for a non-disabled person? If it sounds absurd ("Nothing stops Tom from eating lunch"), rewrite it.',
      priority: 3
    },
    {
      icon: 'MessageSquare',
      text: 'Get feedback from people with disability on your marketing.',
      detail: 'Recruit 2-3 people with diverse disabilities to review your materials before publication. Pay them fairly for their time ($50-100 per review session). Ask specifically: "Does this feel authentic? Would you feel welcomed? Is there anything that feels patronising?" Unpaid feedback requests are themselves a form of exploitation, so always offer compensation.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Stereotype and authenticity review',
    steps: [
      { text: 'Gather all current marketing materials that include or reference people with disability: website pages, brochures, social media posts, press releases, and internal communications.' },
      { text: 'For each image, apply the "non-disabled test." Ask: Would this image be used if the person did not have a disability? If the image only exists because of the disability, flag it for review.' },
      { text: 'Review all captions, headlines, and body copy for problematic language. Flag phrases like: "despite their disability," "brave," "inspiring," "suffers from," "confined to," "special needs," "differently abled," and "handicapped."' },
      {
        text: 'Count the ratio of active vs. passive depictions of disabled people.',
        measurement: {
          target: 'Active depictions (person making choices, leading, enjoying)',
          acceptable: 'At least 80% of disability images show active roles',
          unit: 'percentage'
        }
      },
      { text: 'Check whether disability content is segregated into a separate "accessibility" section or naturally integrated throughout. Segregated content often signals a tokenistic approach.' },
      { text: 'Review whether disabled people are shown alone or with others. People with disability socialising, working, and spending time with friends and family reflects reality. Isolated depictions can inadvertently reinforce ideas of exclusion.' },
      { text: 'Ask 2-3 people with disability to review the flagged materials and provide honest feedback. Provide specific questions: "Does this feel patronising? Would you share this post? Does this make you feel like a valued customer?"' },
      { text: 'Create a "Do and Don\'t" reference sheet based on your findings for the marketing team. Include specific examples from your own materials as illustrations.' },
      { text: 'Schedule a quarterly review checkpoint where the marketing team re-runs this audit on all new materials published in the previous 3 months.' }
    ],
    tools: ['Printed copies or screenshots of all marketing materials', 'Spreadsheet for tracking flagged items', 'Feedback forms for disability reviewers'],
    estimatedTime: '1-2 hours for initial audit, plus 1 hour for reviewer feedback'
  },

  examples: [
    {
      businessType: 'attraction',
      businessTypeLabel: 'Theme Park',
      scenario: 'A theme park ran a social media campaign showing a child in a wheelchair being pushed by smiling staff with text saying "Making dreams come true for kids who can\'t ride." The post went viral but was widely criticised by disability advocates, who pointed out that many rides were in fact accessible, the child was portrayed as a passive recipient of charity, and the language implied disabled children could only "dream" of participation.',
      solution: 'The park engaged a disability consultant and two parent advocates to redesign the campaign. New imagery showed children with various disabilities (including the wheelchair user) actively enjoying rides, playing carnival games, eating ice cream alongside friends, and choosing their own activities. Captions focused on the experiences: "Roller coaster faces," "Best ice cream in the park," and "Fun for everyone." Staff were shown in the background, not as rescuers.',
      outcome: 'The revised campaign received praise from disability organisations and parenting networks. Engagement was 2.4x higher than the original post. The park established a permanent disability advisory panel of 5 parents and 3 young people with disability, who now review all campaigns before launch.',
      cost: '$500 (consultant fee for campaign review) + internal staff time for reshooting',
      timeframe: '2 weeks for consultant review and new content creation'
    },
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Holiday Park',
      scenario: 'A holiday park\'s brochure contained a separate section titled "We help those less fortunate enjoy a holiday too" with images of smiling staff assisting disabled guests. The section used phrases like "despite their challenges" and "making the impossible possible." A guest with disability submitted a formal complaint, noting that the language was demeaning and the imagery showed disabled guests as passive recipients of staff kindness rather than independent holiday-makers.',
      solution: 'The park removed the separate section entirely and integrated images of guests with disability throughout the main brochure. Photos showed a family (including a wheelchair user) cooking at the BBQ, children (including one with Down syndrome) playing in the pool, and a couple (one using a walking frame) relaxing on the veranda. No special captions or separate sections. The "accessible facilities" information was included in the general facilities list, not a separate page. Staff completed a 2-hour disability awareness training session focused on respectful communication.',
      outcome: 'Complaints dropped to zero. Repeat bookings from guests with disability increased by 25% over the following year. The park received a commendation from the local disability advisory committee. The guest who originally complained became a regular visitor and informal ambassador.',
      cost: 'Free (content changes made at next scheduled brochure reprint) + $400 for staff training',
      timeframe: '1 week for content revision, aligned with next print run'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant Group',
      scenario: 'A restaurant group posted an Instagram story featuring a Deaf customer with the caption "She can\'t hear, but she can taste! Nothing stops our guests." The post was intended as positive but received backlash from the Deaf community, who pointed out that being Deaf does not affect taste, the framing was condescending, and the customer had not been asked for permission.',
      solution: 'The restaurant immediately removed the post and issued a genuine apology (reviewed by a Deaf advocate before posting). They then partnered with a local Deaf community organisation to create new social media guidelines. Future posts featuring customers with disability followed the same format as all customer features: name, dish ordered, and a genuine quote. They also added Auslan-interpreted menu videos as a practical improvement.',
      outcome: 'The apology was well-received. The Auslan menu videos were shared widely by the Deaf community, generating 15,000 views. The restaurant saw a 20% increase in bookings from Deaf customers and groups over the following 6 months.',
      cost: '$200 (Deaf advocate review fee) + $600 (Auslan video production)',
      timeframe: '1 week for apology and guidelines, 3 weeks for Auslan menu videos'
    }
  ],

  solutions: [
    {
      title: 'Review existing materials for stereotypes',
      description: 'Go through current marketing with the "non-disabled test" and identify any content that relies on disability for emotional impact. This low-cost audit is the essential first step, as you cannot fix problems you have not identified. Document each finding with a screenshot and recommended action.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Download or screenshot every marketing asset that includes or references people with disability (website, social media, brochures, advertisements, email templates).',
        'For each asset, apply the "non-disabled test": Would this image, caption, or story exist if the person did not have a disability? Flag anything that fails this test.',
        'Highlight specific problematic words and phrases: "brave," "inspiring," "despite," "suffers from," "confined to," "special needs," "less fortunate," "handicapped."',
        'Check image composition: Is the disabled person shown in an active role (choosing, leading, enjoying) or a passive role (being helped, watched, pitied)?',
        'Review whether non-disabled people in the image are positioned as "helpers" or "saviours" rather than peers.',
        'Create a simple traffic-light spreadsheet: green (authentic, keep as is), amber (needs minor revision such as a caption change), red (remove or completely redo).',
        'Prioritise red items for immediate removal or replacement. Schedule amber items for revision at next content update.',
        'Brief any team members involved in marketing on the findings, sharing 2-3 specific before/after examples from your own materials.'
      ],
      notes: 'Even well-intentioned content can be stereotypical. Approach the audit with curiosity rather than blame. The goal is improvement, not perfection.'
    },
    {
      title: 'Engage a disability consultant to review marketing',
      description: 'Have a disability advocate or consultancy review your marketing materials for authentic representation and provide actionable recommendations. An external perspective catches blind spots that internal teams may miss, especially around tone and framing that non-disabled staff may not recognise as problematic.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'specialist',
      impact: 'moderate',
      steps: [
        'Identify 2-3 disability consultants or organisations in your area. In Australia, options include the Australian Network on Disability, local Disabled People\'s Organisations, and independent disability consultants listed on AND\'s directory.',
        'Request a quote for a marketing materials review. Specify the scope: number of assets, types of materials, and whether you want a written report or a workshop-style debrief.',
        'Provide the consultant with all current marketing materials, your brand guidelines, and any planned campaigns or upcoming photo shoots.',
        'Ask the consultant to specifically assess: language and tone, image composition and roles, segregation vs integration of disability content, and overall authenticity.',
        'Schedule a 1-hour debrief meeting where the consultant walks through their findings with your marketing team.',
        'Request a simple "Do and Don\'t" reference document that the marketing team can use as an ongoing checklist.',
        'Implement the highest-priority recommendations within 2 weeks.',
        'Establish a recurring review arrangement (e.g., quarterly or before each major campaign) to maintain standards.'
      ],
      notes: 'Always pay consultants fairly for their time and expertise. Many disabled people are asked to provide free labour on accessibility issues. A paid engagement signals respect and produces better outcomes.'
    }
  ],

  resources: [
    {
      title: 'Starting With Julius: Authentic Representation',
      url: 'https://www.startingwithjulius.org.au/',
      type: 'guide',
      source: 'Starting With Julius (Cerebral Palsy Alliance)',
      description: 'Australian initiative with guidelines and examples for authentic disability representation in advertising and marketing. Includes a pledge program for businesses committing to inclusive representation.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Language Guide: Disability',
      url: 'https://www.and.org.au/resources/disability-language-guide/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Comprehensive guide to respectful disability language for use in marketing, communications, and everyday interaction. Covers Australian-preferred terminology.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Disability Royal Commission: Inclusive Communication',
      url: 'https://disability.royalcommission.gov.au/',
      type: 'website',
      source: 'Australian Government',
      description: 'Resources and findings from the Royal Commission into Violence, Abuse, Neglect and Exploitation of People with Disability, including guidance on respectful portrayal.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'People with Disability Australia: Media Guide',
      url: 'https://pwd.org.au/',
      type: 'guide',
      source: 'People with Disability Australia',
      description: 'Guidance from Australia\'s peak disability rights organisation on respectful language, imagery, and storytelling when featuring people with disability.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Scope UK: End the Awkward Campaign Resources',
      url: 'https://www.scope.org.uk/',
      type: 'website',
      source: 'Scope UK',
      description: 'International examples and campaign materials showing how to depict disability naturally and without stereotypes. Includes video resources and toolkits.',
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.6-PC-1',
      questionText: 'Does your marketing imagery include people with disability?',
      relationship: 'Representation must be both present and authentic',
      moduleCode: '1.6'
    },
    {
      questionId: '1.5-PC-2',
      questionText: 'Do you use respectful, person-centred language when referring to people with disability?',
      relationship: 'Respectful language and authentic imagery work together',
      moduleCode: '1.5'
    }
  ],

  keywords: ['stereotypes', 'inspiration porn', 'authentic', 'representation', 'marketing', 'disability'],
  lastUpdated: '2026-02-24'
},

// 1.6-PC-3
{
  questionId: '1.6-PC-3',
  questionText: 'Are your marketing materials (brochures, flyers, advertisements) accessible?',
  moduleCode: '1.6',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Accessible Marketing Materials',
  summary: 'Marketing materials should be designed so everyone can read them: good contrast, readable fonts, tagged PDFs, and alternative formats available on request.',

  whyItMatters: {
    text: 'Your marketing materials are often the first touchpoint a potential customer has with your business. If a brochure has tiny text, low contrast, or is only available as an image-based PDF that screen readers cannot read, you are excluding the very customers you want to welcome. Accessible design is good design: it benefits all readers.',
  },

  tips: [
    {
      icon: 'Type',
      text: 'Use a minimum 12pt font for body text (14pt is better).',
      detail: 'Sans-serif fonts like Arial, Helvetica, Calibri, or Verdana are generally easier to read than serif or decorative fonts. Avoid thin or light font weights, as they reduce readability for people with low vision. For headings, use at least 16pt. Line spacing (leading) should be at least 1.5x the font size. A common mistake is using 9pt or 10pt text to fit more content on a page, which makes the entire document inaccessible.',
      priority: 1
    },
    {
      icon: 'Contrast',
      text: 'Ensure text has at least 4.5:1 contrast ratio with the background.',
      detail: 'Dark text on light backgrounds is easiest to read. Use the WebAIM Contrast Checker (webaim.org/resources/contrastchecker) to verify specific colour combinations. Avoid light grey text on white, yellow text on light backgrounds, and text placed directly over photographs or complex patterns. For large text (18pt+ or 14pt+ bold), the minimum ratio drops to 3:1, but aiming for 4.5:1 across all text is safer.',
      priority: 2
    },
    {
      icon: 'FileCheck',
      text: 'Create tagged, accessible PDFs rather than image-based ones.',
      detail: 'Tagged PDFs contain a logical reading order, headings structure, and alt text that screen readers can interpret. Image-based PDFs (created by scanning a printed document) are completely inaccessible to screen reader users. Always export PDFs from the source application (Word, InDesign, Canva) rather than scanning. In Adobe InDesign, use the Accessibility panel to set reading order. In Microsoft Word, use built-in heading styles before exporting to PDF.',
      priority: 3
    },
    {
      icon: 'Copy',
      text: 'Offer alternative formats: large print, digital, Easy Read.',
      detail: 'Add "Available in large print, digital, or Easy Read format on request" to all printed materials, ideally on the back cover or footer. Large print means 18pt minimum. Easy Read uses simple language with supporting images and is designed for people with intellectual disability. Having a Word or HTML version available means you can quickly produce alternative formats when requested, rather than scrambling to create them.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Audit your marketing materials for accessibility',
    steps: [
      { text: 'Gather your main marketing materials: brochures, flyers, menus, event programs, printed advertisements, and any PDFs available on your website or sent via email.' },
      {
        text: 'Check font sizes using a typographic ruler or the document properties. Measure body text, captions, footnotes, and fine print.',
        measurement: {
          target: 'Body text font size',
          acceptable: '12pt minimum, 14pt preferred',
          unit: 'pt'
        }
      },
      {
        text: 'Check colour contrast using the WebAIM Contrast Checker (webaim.org/resources/contrastchecker). Test the most common text/background combinations in each material.',
        measurement: {
          target: 'Text to background contrast ratio',
          acceptable: '4.5:1 minimum for body text, 3:1 for large text',
          unit: 'ratio'
        }
      },
      { text: 'For printed materials, check readability at arm\'s length (approximately 40-50cm). If you need to squint or hold the document closer, the text is likely too small or low contrast.' },
      { text: 'For digital PDFs, open in Adobe Acrobat Reader and try selecting and copying text. If text cannot be selected, the PDF is image-based and inaccessible to screen readers.' },
      { text: 'Run the Adobe Acrobat accessibility checker if available: Edit > Accessibility > Full Check. Note any failures related to reading order, alt text, or language settings.' },
      { text: 'Test with a screen reader if possible. On Windows, use NVDA (free download from nvaccess.org). Open each PDF and listen to whether the content is read in a logical order.' },
      { text: 'Check whether alternative formats are mentioned on any materials. Look for statements like "Available in large print on request" or a contact method for requesting alternative formats.' },
      {
        text: 'Verify line spacing and paragraph spacing. Cramped text is difficult for many readers.',
        measurement: {
          target: 'Line spacing (leading)',
          acceptable: '1.5x font size minimum',
          unit: 'multiplier'
        }
      },
      { text: 'Compile findings into a priority list: urgent (image-based PDFs, unreadable text), important (low contrast, missing alt text), and recommended (alternative format statements, Easy Read versions).' }
    ],
    tools: ['WebAIM Contrast Checker (free, webaim.org)', 'Adobe Acrobat Reader (free) or Adobe Acrobat Pro (paid)', 'NVDA screen reader (free, nvaccess.org)', 'Typographic ruler or font size reference card'],
    estimatedTime: '30-45 minutes'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: '1.4.3 Contrast, 1.4.4 Resize Text',
      requirement: 'Digital materials must meet minimum contrast ratios and allow text resizing.'
    },
    related: [
      {
        code: 'DDA',
        relevance: 'Marketing materials should be accessible to ensure equitable service provision.'
      }
    ],
    plainEnglish: 'Printed materials should be readable (good fonts, contrast, and size). Digital materials should also work with screen readers and allow text resizing.',
    complianceNote: 'The AHRC formally acknowledges that the DDA applies to online services, mobile apps, AI, and digital products, and has acted on digital accessibility discrimination complaints.'
  },

  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Convention Centre',
      scenario: 'A convention centre produced event programs using 8pt text in light grey on white backgrounds with decorative serif fonts. Attendees frequently complained they could not read the schedule. Several attendees with low vision said they had to use their phone cameras to zoom in on every page. The digital version was a scanned image PDF that screen readers could not interpret at all.',
      solution: 'The design team redesigned programs with 13pt body text in Arial, dark charcoal (#333333) on white background, clear bold headings at 18pt, and generous line spacing at 1.6x. They added a QR code on the front cover linking to an accessible HTML version of the program online. The PDF version was exported from InDesign with proper tagging, reading order, and alt text on images. A "Large print version available at the information desk" note was added to the back cover.',
      outcome: 'Attendee complaints about readability dropped by 90%. The QR code to the online version was used by 45% of attendees (not just those with disability) as it allowed easy zooming on phones. The convention centre reported the accessible design actually looked more modern and professional.',
      cost: '$300-600 (design update, including InDesign accessibility tagging)',
      timeframe: '2-3 days for redesign, implemented at next event'
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tour Company',
      scenario: 'A tour company offered 15 different tour brochures, all created by scanning printed documents into PDF format. Screen reader users received no usable information from these files. When a blind customer contacted the company requesting tour details, staff had to read the brochure aloud over the phone, taking 20 minutes per brochure. The company was also at risk of a DDA complaint.',
      solution: 'The company recreated all 15 brochures as properly tagged PDFs exported from their original Word and InDesign files. Each PDF included reading order tags, alt text on all 80+ images (describing the tour scenery and activities), navigational bookmarks for each section, and document language set to English. They also created a plain HTML version of each brochure on their website. The footer of each brochure now reads: "Available in large print, Easy Read, or audio description format. Contact us at access@example.com."',
      outcome: 'Blind and low-vision customers could access tour information independently for the first time. The HTML versions also improved SEO, with the company reporting a 22% increase in organic search traffic to tour pages. Staff time spent reading brochures over the phone dropped to near zero.',
      cost: '$500-1,500 (PDF remediation for 15 brochures, including alt text writing)',
      timeframe: '1-2 weeks for full suite, prioritising top 5 most popular tours first'
    },
    {
      businessType: 'restaurant-cafe',
      businessTypeLabel: 'Restaurant',
      scenario: 'A fine dining restaurant prided itself on elegant menu design: cream text on a dark background, italic script font at 10pt, and no digital version available. Customers with low vision, dyslexia, or reading difficulties frequently asked staff to read the menu aloud. The restaurant also had no way to provide dietary information in an accessible format.',
      solution: 'The restaurant worked with their graphic designer to create a second "accessible" menu format: 14pt sans-serif font, high-contrast dark text on cream background, clear section headings, and dietary symbols explained in a legend. This was available on request and also as a QR code linking to a responsive HTML menu on their website. The original "design" menu was kept for atmosphere, but staff were trained to proactively offer the accessible version. Dietary and allergen information was integrated into the HTML version with filtering options.',
      outcome: 'Requests for staff to read the menu dropped by 80%. The HTML menu was popular with all diners for checking dietary information. The restaurant received positive reviews specifically mentioning the accessible menu option. Several other restaurants in the area adopted the same approach after seeing the positive response.',
      cost: '$400-800 (accessible menu design + HTML version setup)',
      timeframe: '1 week for design, 1 week for HTML version and staff training'
    }
  ],

  solutions: [
    {
      title: 'Quick-fix: Increase font sizes and improve contrast',
      description: 'Update your most-used materials with larger fonts and better contrast at the next print run or digital update. This addresses the two most common accessibility barriers in printed materials and can be done by anyone with access to the source files. Focus on the materials that reach the most customers first.',
      resourceLevel: 'low',
      costRange: 'Free-$100',
      timeRequired: '1-2 hours',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Identify your top 3 most-distributed marketing materials (e.g., main brochure, menu, event flyer).',
        'Open the source file (Word, InDesign, Canva, or other design tool) for each material.',
        'Select all body text and change the font size to at least 12pt (14pt preferred). Use a sans-serif font such as Arial, Calibri, or Verdana.',
        'Check that headings are at least 16pt and clearly differentiated from body text using bold weight or larger size.',
        'Use the WebAIM Contrast Checker (webaim.org/resources/contrastchecker) to test your primary text colour against the background. Enter the hex colour codes and verify the ratio is at least 4.5:1.',
        'Replace any text-over-image sections with solid background panels behind the text, or add a semi-opaque overlay to ensure contrast.',
        'Increase line spacing to at least 1.5x the font size (e.g., for 12pt font, use 18pt line spacing).',
        'Add the statement "Available in large print or alternative format on request" to the back page or footer of each material.',
        'Save and export. For PDFs, export from the source application (do not scan a printout).'
      ],
      notes: 'If you do not have access to the original design files, ask your designer or printer for the editable source. Updating from a scanned copy will not produce an accessible result.'
    },
    {
      title: 'Create accessible PDF versions',
      description: 'Convert your main marketing PDFs to tagged, accessible format with proper reading order, alt text on images, and navigational bookmarks. This ensures screen reader users can access the same information as sighted readers. Tagged PDFs also improve usability for people who use text-to-speech tools or zoom magnification.',
      resourceLevel: 'medium',
      costRange: '$200-1,000',
      timeRequired: '1-3 days',
      implementedBy: 'contractor',
      impact: 'moderate',
      steps: [
        'Inventory all PDFs currently available on your website, in email communications, and at your premises. Prioritise the top 5 by download count or distribution volume.',
        'For each PDF, determine the source: Was it exported from Word/InDesign (good) or scanned from a printed copy (needs complete remediation)?',
        'For scanned PDFs, use Adobe Acrobat Pro\'s OCR function (Edit PDF > Recognize Text) as a starting point, then manually correct any recognition errors.',
        'In Adobe Acrobat Pro, open the Tags panel (View > Navigation Panels > Tags) and verify the document has a logical tag structure: headings (H1, H2), paragraphs (P), lists (L), and figures (Figure).',
        'Add alt text to every image: right-click the image tag > Properties > Alternate Text. Describe what the image shows in 1-2 sentences relevant to the marketing context.',
        'Set the reading order by opening the Reading Order tool (Accessibility > Reading Order). Verify that content is read in the correct sequence by tabbing through the document.',
        'Add bookmarks for major sections so users can navigate quickly (View > Navigation Panels > Bookmarks).',
        'Set the document language: File > Properties > Advanced > Language: English.',
        'Run the full accessibility check: Accessibility > Full Check. Address any failures flagged.',
        'Test the final PDF with a screen reader (NVDA is free) to verify the reading experience is logical and complete.'
      ],
      notes: 'If you use Adobe InDesign, it is much easier to build accessibility into the design stage than to retrofit it. Ask your designer to use paragraph styles, alt text fields, and the Articles panel during layout.'
    },
    {
      title: 'Establish accessible design standards for all materials',
      description: 'Create a design brief and style guide that requires all marketing materials to meet accessibility standards from the outset, preventing the need for costly retrofitting. This includes font specifications, colour palettes with verified contrast ratios, PDF export settings, and alternative format procedures. The result is a consistent, professional, accessible brand.',
      resourceLevel: 'high',
      costRange: '$500-2,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant or accessible design specialist to audit your current brand guidelines and identify gaps.',
        'Define minimum typography standards: body text 12pt+ sans-serif, headings 16pt+ bold, line spacing 1.5x minimum, paragraph spacing at least 6pt.',
        'Create an accessible colour palette: select 3-5 primary colour combinations and verify each meets 4.5:1 contrast ratio. Document the hex codes and ratios in the style guide.',
        'Write alt text guidelines for your brand: how to describe product images, venue photos, staff portraits, and decorative elements. Include 5-10 examples specific to your business.',
        'Define PDF export settings for each design tool used (InDesign, Word, Canva): tagging enabled, reading order set, bookmarks included, language set.',
        'Create a "pre-publish accessibility checklist" that must be completed before any material goes to print or is uploaded online. Include: font size check, contrast check, PDF tag check, alt text check, alternative format statement included.',
        'Establish an alternative formats procedure: who produces large print versions, how Easy Read requests are handled, where digital versions are hosted.',
        'Train all marketing and design staff on the new standards (2-3 hour session). Provide hands-on practice with accessibility checking tools.',
        'Add the accessible design standards to your brief template so every external designer or agency receives them automatically.',
        'Review and update the standards annually, incorporating feedback from customers and staff.'
      ],
      notes: 'Many design agencies now offer accessible design as a standard service. When selecting a new agency, ask about their accessibility capabilities and experience with WCAG compliance.'
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.2-1-3',
      questionText: 'Is your website text easy to read with good contrast?',
      relationship: 'Contrast requirements apply to both web and print materials',
      moduleCode: '1.2'
    }
  ],

  resources: [
    {
      title: 'WebAIM Contrast Checker',
      url: 'https://webaim.org/resources/contrastchecker/',
      type: 'tool',
      source: 'WebAIM',
      description: 'Free online tool for checking colour contrast ratios against WCAG standards. Enter foreground and background hex colours to instantly verify compliance.',
      isFree: true
    },
    {
      title: 'NVDA Screen Reader',
      url: 'https://www.nvaccess.org/download/',
      type: 'tool',
      source: 'NV Access',
      description: 'Free, open-source screen reader for Windows. Use it to test how your PDFs and digital materials sound when read aloud by assistive technology.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Creating Accessible Documents (Australian Government)',
      url: 'https://www.stylemanual.gov.au/accessible-and-inclusive-content/designing-accessible-content',
      type: 'guide',
      source: 'Australian Government Style Manual',
      description: 'Official Australian Government guidance on creating accessible documents, covering Word, PDF, and web content. Includes practical tips and examples.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Adobe Acrobat Accessibility Guide',
      url: 'https://www.adobe.com/accessibility/products/acrobat.html',
      type: 'guide',
      source: 'Adobe',
      description: 'Step-by-step instructions for creating and remediating accessible PDFs using Adobe Acrobat Pro, including tagging, reading order, and alt text.',
      isFree: true
    },
    {
      title: 'Vision Australia: Accessible Print Design',
      url: 'https://www.visionaustralia.org/',
      type: 'guide',
      source: 'Vision Australia',
      description: 'Australian-specific guidance on designing print materials that are accessible to people with low vision, including font recommendations, contrast guidelines, and layout principles.',
      isAustralian: true,
      isFree: true
    }
  ],

  keywords: ['brochures', 'flyers', 'PDF', 'print', 'accessible design', 'fonts', 'contrast', 'marketing materials'],
  lastUpdated: '2026-02-24'
},

// 1.6-PC-4
{
  questionId: '1.6-PC-4',
  questionText: 'Do you feature accessibility as a positive attribute in your marketing (not just compliance)?',
  moduleCode: '1.6',
  moduleGroup: 'before-arrival',
  diapCategory: 'information-communication-marketing',
  title: 'Marketing Accessibility as a Positive Attribute',
  summary: 'Proactively marketing your accessibility attracts customers, differentiates your business, and shows that inclusion is part of your values, not just a legal obligation.',

  whyItMatters: {
    text: 'Many businesses treat accessibility as a compliance checkbox hidden away on their website. Businesses that actively promote their accessible features attract a loyal customer base. When people with disability find a venue that genuinely welcomes them, they tell their friends, families, and disability networks. This word-of-mouth is powerful and underestimated.',
    statistic: {
      value: '1 in 5',
      context: 'Australians have a disability. When you include their families and carers, the market reach extends to nearly half the population.',
      source: 'ABS Survey of Disability, Ageing and Carers'
    }
  },

  tips: [
    {
      icon: 'Megaphone',
      text: 'Highlight accessible features as benefits in your general marketing.',
      detail: 'Use welcoming phrases like "Easy access for everyone" or "Welcoming venue for all abilities" in your main promotions, not relegated to a small accessibility page. Integrate accessibility features into your general room descriptions, tour listings, and venue highlights. A common mistake is creating a separate "accessibility" section that customers must hunt for. Instead, mention step-free access, hearing loops, and accessible parking within your standard facility descriptions.',
      priority: 1
    },
    {
      icon: 'Star',
      text: 'Share customer testimonials from people with disability.',
      detail: 'With written permission, feature positive experiences from customers with disability alongside your other testimonials. Do not group disability testimonials separately. A wheelchair user reviewing your restaurant should appear in your general reviews section, not a special "accessible dining" testimonial page. Ask specifically: "Would you be happy for us to share your review, including that you found the venue accessible?" Offer to let them approve the final wording.',
      priority: 2
    },
    {
      icon: 'TrendingUp',
      text: 'Share your accessibility journey and improvements openly.',
      detail: 'Posts like "We recently installed a new hearing loop in our conference room" or "Our team completed disability awareness training this month" show ongoing commitment. Customers appreciate transparency about progress rather than claims of perfection. Avoid vague statements like "We are committed to accessibility." Instead, share specific, measurable improvements. A common mistake is only promoting accessibility once and never mentioning it again.',
      priority: 3
    },
    {
      icon: 'Shield',
      text: 'Only promote what you can deliver. Authenticity builds trust.',
      detail: 'Overclaiming accessibility features and underdelivering is worse than honest, modest promotion. If your venue has some accessible features but also known limitations, be upfront about both. For example: "Our ground floor is fully step-free with accessible bathrooms. Please note our upper floor is only accessible via stairs. We are planning a lift installation for 2027." This honesty builds far more trust than vague claims of being "fully accessible" that disappoint on arrival.',
      priority: 4
    }
  ],

  howToCheck: {
    title: 'Assess how you currently market accessibility',
    steps: [
      { text: 'Search your own website for the word "accessible" or "accessibility." Note where it appears: Is it only on a dedicated page, or is it integrated into general content like room descriptions, tour listings, and venue information?' },
      {
        text: 'Count how many times accessibility features are mentioned positively in your main marketing channels (homepage, brochures, social media, email newsletters).',
        measurement: {
          target: 'Positive accessibility mentions in main marketing',
          acceptable: 'At least 3-5 mentions across primary channels',
          unit: 'count'
        }
      },
      { text: 'Review your Google My Business listing. Have you selected all relevant accessibility attributes (wheelchair accessible entrance, accessible parking, accessible bathroom, etc.)? Are these attributes up to date?' },
      { text: 'Check your listings on industry directories and booking platforms (TripAdvisor, Booking.com, your state tourism website). Have you filled in accessibility fields? Many platforms offer accessibility filters that customers use to find you.' },
      { text: 'Search for your business name plus "accessible" or "disability" on Google. What comes up? If there are no results linking your business with accessibility, you have a visibility gap.' },
      { text: 'Review your social media posts from the last 6 months. Count any posts that mention accessibility improvements, inclusive features, or disability-related events like International Day of People with Disability (3 December).' },
      { text: 'Check whether you have customer testimonials that mention accessibility. If so, are they displayed prominently alongside other reviews, or hidden away?' },
      { text: 'Ask 3-5 staff members: "If a customer asked what makes us accessible, what would you say?" If staff cannot articulate your accessible features, your marketing is not reaching them either.' },
      { text: 'Compare your accessibility marketing to 2-3 businesses known for proactive inclusive marketing in your industry. Identify specific tactics they use that you do not.' }
    ],
    tools: ['Google search', 'Google My Business dashboard', 'Social media analytics for post history', 'Spreadsheet for tracking mentions'],
    estimatedTime: '30-45 minutes'
  },

  examples: [
    {
      businessType: 'accommodation',
      businessTypeLabel: 'Hotel',
      scenario: 'A boutique hotel had invested $150,000 in accessible room upgrades including ceiling hoists, roll-in showers, adjustable-height beds, and hearing alert systems. Despite this investment, accessible rooms were only mentioned in a small "Accessibility" footer link on the website. The rooms were listed last on the booking page with minimal photos. As a result, accessible rooms had 60% lower occupancy than standard rooms, and the hotel was not recovering its investment.',
      solution: 'The marketing manager restructured the website to feature accessible rooms in the main room listing at the same prominence as other room types, with a full photo gallery showing the spacious bathroom, hoisting equipment, and adjustable features. An "Accessible" filter was added to the room search. A testimonial from a guest who uses a wheelchair was featured on the homepage alongside other guest reviews. The hotel sent targeted email campaigns to 15 disability organisations, NDIS providers, and accessible travel agents. They also updated their Booking.com and TripAdvisor listings with detailed accessibility information and photos.',
      outcome: 'Accessible room bookings increased by 45% within 4 months. The hotel won a regional accessible tourism award, generating further publicity. They were listed in the Travability accessible accommodation directory, bringing ongoing referrals. The total marketing cost was effectively zero (staff time only), while the revenue increase fully recovered the original room upgrade investment within 18 months.',
      cost: 'Free (website restructure and marketing changes using existing staff time)',
      timeframe: '2 days for website changes, 1 week for outreach to disability organisations'
    },
    {
      businessType: 'attraction',
      businessTypeLabel: 'Winery',
      scenario: 'A winery in the Barossa Valley had invested in a fully accessible cellar door experience: level entry, wide tasting counter, accessible bathroom, and Braille wine labels. However, they never mentioned accessibility in their marketing because they assumed customers "would just know" from looking at photos. Disability tourism groups regularly visited competitors who actively promoted their accessible facilities, even though those competitors offered a less accessible experience.',
      solution: 'The winery added "Fully accessible cellar door experience" with specific details (level entry, accessible tasting counter, accessible bathroom, Braille wine labels) to their Google My Business listing, TripAdvisor profile, South Australian Tourism Commission directory, and Cellar Door Association listing. They created a short social media series called "Access at the Cellar Door" showing each feature with a brief explanation. They also partnered with a local accessible tourism operator to be included in their guided tour itinerary.',
      outcome: 'The winery was featured in the South Australian Accessible Tourism Guide within 3 months. Group bookings from disability organisations increased from zero to an average of 2 per month. Social media reach increased by 40% during the "Access at the Cellar Door" series. The winery owner estimated the additional group bookings alone generated $15,000-20,000 in additional annual revenue.',
      cost: 'Free (listing updates and social media posts using existing photos and staff time)',
      timeframe: '1 day for listing updates, 2 weeks for social media series'
    },
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Conference Centre',
      scenario: 'A conference centre had hearing loops in all meeting rooms, adjustable-height lecterns, captioning capability, and wheelchair-accessible staging. None of these features appeared in their venue hire brochure, website, or sales presentations. When event organisers enquired about accessibility, the sales team had to manually compile information each time. Several large disability sector conferences chose other venues because they could not easily verify accessibility before booking.',
      solution: 'The centre created an "Inclusive Venue Features" section in their main venue brochure (not a separate accessibility document) listing all features with icons and photos. The website room pages were updated to include accessibility features alongside standard specifications (capacity, AV equipment, catering). The sales team was given a one-page accessibility fact sheet to include in every proposal, regardless of whether accessibility was mentioned by the client. The centre also registered with Meetings and Events Australia as an accessible venue and joined the local disability chamber of commerce.',
      outcome: 'Within 6 months, the centre secured 4 major disability sector conferences that had previously booked elsewhere, worth approximately $120,000 in combined revenue. General clients also responded positively, with several mentioning that the accessibility information demonstrated professionalism and attention to detail. The sales team reported that including accessibility information proactively in proposals eliminated back-and-forth enquiries and shortened the booking process by an average of 3 days.',
      cost: '$300 (brochure redesign) + $200 (industry registrations)',
      timeframe: '1 week for brochure and website updates, 2 days for industry registrations'
    }
  ],

  solutions: [
    {
      title: 'Add accessibility to your business listings',
      description: 'Update Google My Business, TripAdvisor, Booking.com, and directory listings to highlight accessible features. This is the single highest-impact, lowest-cost action because listing platforms are where many customers with disability search for accessible venues. Completing accessibility fields also improves your visibility in filtered searches.',
      resourceLevel: 'low',
      costRange: 'Free',
      timeRequired: '1 hour',
      implementedBy: 'diy',
      impact: 'quick-win',
      steps: [
        'Log into Google My Business. Navigate to "Info" and scroll to the "Accessibility" attributes section. Select all that apply: wheelchair accessible entrance, wheelchair accessible seating, wheelchair accessible bathroom, wheelchair accessible parking.',
        'Add accessible features to your Google My Business description. Example: "Our venue features step-free access, accessible bathrooms, hearing loop, and accessible parking."',
        'Upload 2-3 photos showing accessible features (accessible entrance, bathroom, parking) to your Google My Business photo gallery.',
        'Log into TripAdvisor owner portal. Update your listing with accessibility information in the "Details" section. Respond to any reviews that mention accessibility with a thank-you and additional details.',
        'If listed on Booking.com, update the "Facilities" section to include all accessibility features. Booking.com has specific accessibility fields that appear in search filters.',
        'Update your listing on your state/territory tourism website (e.g., Visit Victoria, Destination NSW, South Australian Tourism Commission). Most offer accessibility fields.',
        'If applicable, register with Travability (travability.travel), Australia\'s accessible tourism directory.',
        'Set a calendar reminder to review and update these listings every 6 months, or whenever you make accessibility improvements.'
      ],
      notes: 'Many customers with disability use Google Maps accessibility filters to find businesses. Completing your Google My Business accessibility attributes is essential for visibility.'
    },
    {
      title: 'Feature accessibility in your next marketing campaign',
      description: 'Include accessible features and inclusive imagery in your next planned marketing campaign rather than creating a separate "disability" campaign. This normalises accessibility as part of your brand identity and reaches both disabled and non-disabled audiences. It also avoids the common mistake of siloing accessibility messaging.',
      resourceLevel: 'medium',
      costRange: 'Free (within existing budget)',
      timeRequired: 'Aligned with campaign timeline',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Before your next campaign brief is finalised, add an accessibility integration requirement: "This campaign must include at least one reference to accessible features and at least one image including a person with disability."',
        'Identify 3-5 specific accessible features to highlight that are relevant to the campaign theme. For example, a summer campaign could mention accessible pool entry, beach wheelchairs, or accessible outdoor dining.',
        'Source inclusive imagery (see 1.6-PC-1 solutions for stock photo libraries) that matches the campaign look and feel.',
        'Write accessibility references as natural benefits, not separate call-outs. Example: "Enjoy our poolside bar, with easy step-free access and shaded seating for all" rather than "We also have a ramp."',
        'Include a customer testimonial from someone with disability if available, integrated with other testimonials.',
        'Share the campaign draft with 1-2 people with disability for feedback before launch. Ask: "Does this feel welcoming? Is the accessibility messaging authentic?"',
        'When the campaign launches, monitor engagement on posts that include accessibility messaging. Track any new enquiries or bookings that mention accessibility.',
        'After the campaign, document what worked and incorporate lessons into future campaign templates.'
      ],
      notes: 'Accessibility messaging works best when it is woven into the fabric of the campaign, not bolted on as an afterthought. If the accessibility reference feels forced, revise the approach.'
    },
    {
      title: 'Develop an accessible tourism marketing strategy',
      description: 'Create a specific strategy for reaching customers with disability through tourism networks, disability organisations, and targeted channels. This comprehensive approach positions your business as a destination of choice for the accessible tourism market, which is one of the fastest-growing segments in Australian tourism. A dedicated strategy ensures sustained effort rather than one-off mentions.',
      resourceLevel: 'high',
      costRange: '$1,000-5,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessible tourism consultant or marketing specialist with disability sector experience. In Australia, options include Travability, the Australian Network on Disability, and state-based accessible tourism advisors.',
        'Conduct a competitive analysis: identify 5 businesses in your region or industry known for accessible tourism marketing. Document their tactics, messaging, channels, and partnerships.',
        'Define your target segments within the disability market: wheelchair users, people with sensory disabilities, people with intellectual disability and their carers, seniors with mobility challenges, and families with disabled children.',
        'Audit and document all your accessible features with professional photos, measurements, and honest descriptions of both capabilities and limitations.',
        'Create a dedicated (but not hidden) accessibility page on your website with detailed information, photos, a virtual tour if possible, and a direct contact for accessibility enquiries.',
        'Build a mailing list of disability organisations, NDIS providers, accessible travel agents, disability employment services, and carer support organisations in your target market.',
        'Develop a quarterly email newsletter or update specifically for disability sector contacts, highlighting new accessibility improvements, upcoming accessible events, and special offers.',
        'Register with accessible tourism directories: Travability, your state tourism body\'s accessible tourism section, and Accessibility Tick (if pursuing certification).',
        'Plan 4-6 social media posts per year around key dates: International Day of People with Disability (3 December), Global Accessibility Awareness Day (May), and your own accessibility milestones.',
        'Establish partnerships with 2-3 disability organisations for cross-promotion, group bookings, or joint events.',
        'Set measurable goals: number of accessibility-related enquiries per quarter, bookings from disability organisations, and social media engagement on accessibility content.',
        'Review strategy quarterly and adjust based on results. Share progress reports with management to maintain internal support for the initiative.'
      ],
      notes: 'The accessible tourism market is estimated to be worth $8 billion annually in Australia. A small investment in targeted marketing can yield significant returns, especially for businesses with genuine accessible facilities.'
    }
  ],

  resources: [
    {
      title: 'Accessible Tourism Resource Kit',
      url: 'https://www.tourism.australia.com/en/events-and-tools/industry-resources/accessible-tourism.html',
      type: 'guide',
      source: 'Tourism Australia',
      description: 'Comprehensive resources for marketing your business as accessible to the tourism market, including case studies, checklists, and industry data on the accessible tourism opportunity.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Travability: Accessible Tourism Directory',
      url: 'https://travability.travel/',
      type: 'website',
      source: 'Travability',
      description: 'Australia\'s dedicated accessible tourism directory where businesses can list their accessible features and be found by travellers with disability. Includes a review and rating system.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Australian Network on Disability: Accessible Tourism Toolkit',
      url: 'https://www.and.org.au/',
      type: 'guide',
      source: 'Australian Network on Disability',
      description: 'Business resources for understanding and reaching the disability market, including marketing guidance, customer service tips, and case studies from Australian businesses.',
      isAustralian: true,
      isFree: true
    },
    {
      title: 'Google My Business Accessibility Attributes Guide',
      url: 'https://support.google.com/business/answer/6321194',
      type: 'guide',
      source: 'Google',
      description: 'Instructions for adding accessibility attributes to your Google My Business listing, ensuring your accessible features appear in search results and Google Maps.',
      isFree: true
    },
    {
      title: 'Destination NSW: Accessible Tourism Resources',
      url: 'https://www.destinationnsw.com.au/',
      type: 'guide',
      source: 'Destination NSW',
      description: 'State tourism body resources for promoting accessible tourism experiences, including marketing templates, industry events, and partnership opportunities.',
      isAustralian: true,
      isFree: true
    }
  ],

  relatedQuestions: [
    {
      questionId: '1.6-PC-1',
      questionText: 'Does your marketing imagery include people with disability?',
      relationship: 'Inclusive imagery is part of actively marketing accessibility',
      moduleCode: '1.6'
    },
    {
      questionId: '1.5-PC-6',
      questionText: 'Do you actively communicate your commitment to accessibility?',
      relationship: 'Communicating commitment and marketing accessibility are closely related',
      moduleCode: '1.5'
    }
  ],

  keywords: ['marketing', 'promotion', 'accessibility', 'positive', 'tourism', 'business case', 'inclusion'],
  lastUpdated: '2026-02-24'
},

];

export default beforeArrivalHelp;
