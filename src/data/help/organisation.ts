/**
 * Help Content: Organisation (modules 5.1-5.10)
 * Covers organisational accessibility policy, employment framework, training, procurement, performance, supplier accessibility,
 * inclusive job design, accessible interviews, onboarding & workplace adjustments, and retention & culture.
 */

import type { HelpContent } from './types';

export const organisationHelp: HelpContent[] = [

// ─── Entry 1: Accessibility policy and DIAP ───
{
  questionId: '5.1-F-1',
  questionText: 'Does your organisation have a documented accessibility policy or Disability Inclusion Action Plan (DIAP)?',
  moduleCode: '5.1',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility policy and DIAP',
  coveredQuestionIds: ['5.1-F-3', '5.1-D-11', '5.1-D-14', '5.1-D-15', '5.1-D-19', '5.1-D-20'],
  summary: 'A written accessibility policy or Disability Inclusion Action Plan (DIAP) establishes your organisation\'s commitment to accessibility with measurable goals, timelines, and accountability. It should cover physical access, digital accessibility, communications, customer service, employment, and procurement.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Without a documented plan, accessibility improvements happen ad hoc and inconsistently. A DIAP provides a roadmap, assigns responsibility, and creates accountability. Organisations with DIAPs consistently outperform those without in accessibility outcomes.',
    statistic: { value: '77%', context: 'of Australian organisations with a DIAP report improved customer satisfaction from people with disability, compared to 23% without one.', source: 'Australia\'s Disability Strategy outcome reporting' },
    quote: { text: 'Before our DIAP, accessibility was something we talked about but never acted on. The plan gave us deadlines, budgets, and someone responsible for each action.', attribution: 'Operations Manager, regional tourism operator' }
  },
  tips: [
    { icon: 'FileText', text: 'Start with a simple 1-2 page accessibility statement if a full DIAP feels overwhelming.', detail: 'An accessibility statement commits to key principles and can evolve into a full DIAP.', priority: 1 },
    { icon: 'Target', text: 'Set SMART goals: specific, measurable, achievable, relevant, and time-bound.', priority: 2 },
    { icon: 'Users', text: 'Involve people with disability in developing the plan.', detail: 'Nothing about us without us. Consultation with people with lived experience ensures the plan addresses real barriers.', priority: 3 },
    { icon: 'ClipboardList', text: 'Cover all areas: physical access, digital, communications, employment, procurement, and emergency planning.', priority: 4 },
    { icon: 'AlertTriangle', text: 'Include your digital products and services in the policy, not just physical premises.', priority: 5 },
    { icon: 'Shield', text: 'Add accessibility to your risk register and business continuity plan.', priority: 6 }
  ],
  howToCheck: {
    title: 'Auditing your accessibility policy',
    steps: [
      { text: 'Does a written accessibility policy or DIAP exist?' },
      { text: 'When was it last reviewed or updated?' },
      { text: 'Does it have measurable goals with timelines?' },
      { text: 'Is someone specifically responsible for implementation?' },
      { text: 'Does it cover physical access, digital access, communications, employment, and procurement?' },
      { text: 'Were people with disability consulted in its development?' },
      { text: 'Is it published and available to staff and the public?' },
      { text: 'Is accessibility included in the risk register and business continuity plan?' }
    ],
    tools: ['Policy document', 'Checklist'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 54', requirement: 'Organisations can develop action plans (DIAPs) to comply with the DDA. While not mandatory, they demonstrate good faith and provide a framework for compliance.' },
    related: [
      { code: 'UNCRPD', relevance: 'Article 4 requires States Parties and organisations to adopt measures for the realisation of rights of persons with disabilities.' }
    ],
    plainEnglish: 'While a DIAP is not legally required for most private organisations, having one shows you are serious about accessibility and helps defend against discrimination claims.',
    complianceNote: 'NSW, Victoria, and Queensland require some organisations to develop Disability Action Plans under state legislation.'
  },
  solutions: [
    {
      title: 'Create an accessibility statement',
      description: 'Draft a simple accessibility commitment statement as a first step.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '2-4 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Review your current accessibility strengths and gaps.', 'Draft a 1-2 page statement covering commitment, key areas, and contact.', 'Include a feedback mechanism for people with disability.', 'Get senior leadership sign-off.', 'Publish on website and share with staff.', 'Set a date to review and expand into a full DIAP.']
    },
    {
      title: 'Develop a Disability Inclusion Action Plan',
      description: 'Create a comprehensive DIAP with goals, timelines, and accountability.',
      resourceLevel: 'medium', costRange: '$2,000-10,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Establish a working group including people with disability.', 'Conduct an accessibility audit of your premises, services, and employment.', 'Identify priority areas and set SMART goals for each.', 'Assign responsibility and budget to each action.', 'Draft the DIAP using the AHRC template.', 'Consult with disability organisations.', 'Publish and communicate to all staff.', 'Set quarterly review checkpoints.']
    },
    {
      title: 'Comprehensive DIAP with external facilitation',
      description: 'Engage a consultant to develop a multi-year DIAP with co-design.',
      resourceLevel: 'high', costRange: '$15,000-40,000', timeRequired: '4-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage a disability inclusion consultant.', 'Conduct comprehensive accessibility audit.', 'Run co-design workshops with people with disability.', 'Benchmark against industry leaders.', 'Develop 3-year DIAP with annual milestones.', 'Integrate with strategic plan and budget cycle.', 'Register with AHRC if applicable.', 'Establish disability advisory committee for ongoing governance.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'No formal accessibility policy. Improvements were reactive.', solution: 'Developed a 3-year DIAP covering physical access, staff training, digital booking, and employment. Formed disability advisory panel.', outcome: 'Accessibility improvements on track. Won AND Disability Confident employer recognition.', cost: '$20,000', timeframe: '4 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Required to develop a DIAP under state legislation.', solution: 'Co-designed DIAP with local disability groups. Covered all council services, facilities, and employment.', outcome: 'Community satisfaction improved. Used as model by neighbouring councils.', cost: '$30,000', timeframe: '6 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Customer complaints about inaccessible stores.', solution: 'Created simple accessibility statement first, then expanded to a full DIAP with store-by-store improvement plans.', outcome: 'Complaints reduced 60%. Staff know what to do. Clear improvement roadmap.', cost: '$5,000', timeframe: '2 months' }
  ],
  resources: [
    { title: 'AHRC DIAP Guide and Register', url: 'https://humanrights.gov.au/our-work/disability-rights/action-plans', type: 'guide', source: 'Australian Human Rights Commission', description: 'How to develop and register a Disability Action Plan.', isAustralian: true, isFree: true },
    { title: 'Disability Gateway', url: 'https://www.disabilitygateway.gov.au/', type: 'website', source: 'Australian Government', description: 'National gateway with policy, planning, and information resources.', isAustralian: true, isFree: true },
    { title: 'NSW Disability Inclusion Act', url: 'https://legislation.nsw.gov.au/', type: 'guide', source: 'NSW Government', description: 'Legislative requirements for Disability Inclusion Action Plans in NSW.', isAustralian: true, isFree: true }
  ],
  keywords: ['DIAP', 'policy', 'action plan', 'disability inclusion', 'accessibility statement', 'risk register', 'digital policy']
},

// ─── Entry 2: Accessibility leadership and representation ───
{
  questionId: '5.1-D-9',
  questionText: 'Does your organisation have a senior leader or executive champion responsible for accessibility?',
  moduleCode: '5.1',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility leadership and representation',
  coveredQuestionIds: ['5.1-D-10', '5.1-D-16', '5.1-D-7', '5.1-D-8'],
  summary: 'Effective accessibility requires executive sponsorship, dedicated governance structures, and lived experience representation. A senior champion ensures accessibility has board-level visibility, budget allocation, and strategic priority. Advisory committees with people with disability provide authentic guidance.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Accessibility initiatives without senior leadership sponsorship stall. When accessibility is no one\'s specific responsibility, it becomes everyone\'s afterthought. Executive champions ensure accessibility is discussed at board level, receives budget, and is integrated into strategic planning.',
    statistic: { value: '90%', context: 'of organisations that appoint a senior accessibility champion report faster progress on their DIAP goals than those without one.', source: 'Industry benchmarking studies, Australia' }
  },
  tips: [
    { icon: 'UserCheck', text: 'Appoint a senior leader as accessibility champion with explicit accountability.', priority: 1 },
    { icon: 'Users', text: 'Establish a disability advisory committee including people with lived experience.', priority: 2 },
    { icon: 'Target', text: 'Include accessibility KPIs in the champion\'s performance objectives.', priority: 3 },
    { icon: 'BarChart3', text: 'Report accessibility progress to the board at least annually.', priority: 4 },
    { icon: 'Heart', text: 'Ensure people with disability are represented in decision-making, not just consulted.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing accessibility leadership',
    steps: [
      { text: 'Is there a named senior leader responsible for accessibility?' },
      { text: 'Is accessibility a standing item on board or executive meeting agendas?' },
      { text: 'Does the organisation have a disability advisory committee?' },
      { text: 'Are people with disability represented on the committee (not just allies)?' },
      { text: 'Does the accessibility champion have authority to allocate resources?' },
      { text: 'Are accessibility KPIs in anyone\'s performance plan?' },
      { text: 'When was the last board-level report on accessibility progress?' }
    ],
    tools: ['Organisational chart', 'Meeting agendas', 'Performance frameworks'],
    estimatedTime: '30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 122', requirement: 'Employers and organisations have vicarious liability for discriminatory acts of employees. Senior leadership engagement demonstrates due diligence.' },
    related: [
      { code: 'UNCRPD', relevance: 'Article 33 requires coordination mechanisms and involvement of people with disability in monitoring.' }
    ],
    plainEnglish: 'While no law requires a specific accessibility champion, having one demonstrates your organisation takes its legal obligations seriously and helps prevent discrimination.',
    complianceNote: 'Board-level engagement on accessibility is becoming a governance expectation, particularly for listed companies and government-funded organisations.'
  },
  solutions: [
    {
      title: 'Appoint an accessibility champion',
      description: 'Assign a senior leader with explicit accessibility responsibility.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify a senior leader with genuine interest in accessibility.', 'Define the role: attend disability sector events, chair accessibility meetings, report to board.', 'Add accessibility KPIs to their performance plan.', 'Announce the appointment internally and externally.', 'Schedule quarterly accessibility progress reviews.', 'Connect them with disability networks.']
    },
    {
      title: 'Establish a disability advisory committee',
      description: 'Create a formal advisory group including people with lived experience.',
      resourceLevel: 'medium', costRange: '$2,000-8,000 per year', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Define terms of reference: purpose, scope, meeting frequency.', 'Recruit 4-6 members with diverse disability experience.', 'Pay members for their time and expertise.', 'Ensure meetings are accessible (location, format, communication).', 'Set quarterly meeting schedule.', 'Report committee recommendations to the board.', 'Publish committee membership and key outcomes.']
    },
    {
      title: 'Integrated accessibility governance',
      description: 'Embed accessibility into all governance structures with lived experience at every level.',
      resourceLevel: 'high', costRange: '$10,000-30,000 per year', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage governance consultant with disability expertise.', 'Embed accessibility into board charter and committee terms.', 'Appoint person with disability to the board if possible.', 'Create accessibility function in organisational structure.', 'Integrate accessibility into all strategic planning.', 'Establish lived experience advisory panel with remuneration.', 'Develop accessibility competency framework for leaders.', 'Report publicly on accessibility governance.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Chain', scenario: 'Accessibility was managed ad hoc by facilities.', solution: 'CEO appointed the COO as accessibility champion. Formed advisory panel of 5 people with disability. Quarterly board reports.', outcome: 'DIAP implementation accelerated. Capital budget allocated for accessibility improvements.', cost: '$5,000/year (advisory panel costs)', timeframe: '3 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Disability advisory committee inactive.', solution: 'Reconstituted committee with paid positions. General Manager attended quarterly. Committee reviewed all major projects.', outcome: 'New facilities consistently more accessible. Community trust improved.', cost: '$8,000/year', timeframe: '2 months' }
  ],
  resources: [
    { title: 'AHRC - Advisory Committees and Lived Experience', url: 'https://humanrights.gov.au/our-work/disability-rights', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on establishing disability advisory committees and engaging lived experience.', isAustralian: true, isFree: true },
    { title: 'IncludeAbility - Governance and Leadership', url: 'https://includeability.gov.au/', type: 'website', source: 'AHRC', description: 'National resources for governance, leadership, and co-designed decision-making.', isAustralian: true, isFree: true }
  ],
  keywords: ['champion', 'leadership', 'advisory committee', 'governance', 'board', 'lived experience', 'representation']
},

// ─── Entry 3: Accessible communications and pricing ───
{
  questionId: '5.1-D-6',
  questionText: 'Are your public communications available in accessible formats?',
  moduleCode: '5.1',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessible communications and pricing',
  coveredQuestionIds: ['5.1-D-17', '5.1-D-18', '5.1-F-5', '5.1-D-12'],
  summary: 'All public communications should be available in accessible formats: plain language, large print, Easy Read, and digital versions meeting WCAG 2.1 AA. Pricing and fees must be displayed clearly and accessibly. Marketing materials should include diverse representation.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'If people with disability cannot access your communications, they cannot become your customers. Inaccessible websites, brochures in small print, and complex language all create barriers. Accessible communications reach a broader audience and demonstrate genuine inclusion.',
    statistic: { value: '71%', context: 'of customers with disability will leave a website that is not accessible, taking their spending elsewhere.', source: 'Click-Away Pound Survey (adapted for Australian context)' }
  },
  tips: [
    { icon: 'Globe', text: 'Ensure your website meets WCAG 2.1 AA standards.', priority: 1 },
    { icon: 'Type', text: 'Use plain language in all customer-facing documents: short sentences, common words, active voice.', priority: 2 },
    { icon: 'Eye', text: 'Provide large print versions of key documents (18pt minimum).', priority: 3 },
    { icon: 'Users', text: 'Include people with disability in marketing images and stories.', priority: 4 },
    { icon: 'DoorOpen', text: 'Display pricing clearly with minimum 14pt text and high contrast.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing communications accessibility',
    steps: [
      { text: 'Test your website with a screen reader (NVDA or VoiceOver).' },
      { text: 'Run an automated WCAG check (WAVE or axe).' },
      { text: 'Review printed materials: font size, contrast, language complexity.' },
      { text: 'Check social media posts for image alt text and captioned videos.' },
      { text: 'Review pricing displays for readability.' },
      { text: 'Check marketing materials for diverse disability representation.' },
      { text: 'Test email newsletters with a screen reader.' }
    ],
    tools: ['Screen reader', 'WAVE or axe accessibility checker', 'Readability checker'],
    estimatedTime: '45-60 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Information provided as part of a service must be accessible to people with disability.' },
    related: [
      { code: 'WCAG', relevance: 'Web Content Accessibility Guidelines 2.1 AA is the accepted standard for digital accessibility in Australia.' }
    ],
    plainEnglish: 'Your communications, including website, brochures, and pricing, must be accessible to people with disability.',
    complianceNote: 'The Australian Government has endorsed WCAG 2.1 AA as the standard for web accessibility. Private sector compliance is expected under the DDA.'
  },
  solutions: [
    {
      title: 'Quick communication fixes',
      description: 'Address the most impactful accessibility issues in your communications.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add alt text to all website images.', 'Ensure all videos have captions.', 'Create large print versions of top 5 customer documents.', 'Simplify language on key web pages.', 'Increase pricing display font size to 14pt minimum.', 'Add accessibility information to your website footer.']
    },
    {
      title: 'Website accessibility remediation',
      description: 'Fix website against WCAG 2.1 AA and establish accessible communication standards.',
      resourceLevel: 'medium', costRange: '$3,000-15,000', timeRequired: '4-8 weeks', implementedBy: 'contractor', impact: 'moderate',
      steps: ['Commission WCAG 2.1 AA audit of website.', 'Fix identified issues in priority order.', 'Create accessible document templates for staff.', 'Establish plain language guidelines.', 'Set up captioning workflow for video content.', 'Train marketing team on accessible content creation.', 'Schedule annual accessibility re-audit.']
    },
    {
      title: 'Comprehensive accessible communications program',
      description: 'Transform all communications for accessibility with ongoing governance.',
      resourceLevel: 'high', costRange: '$15,000-50,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage accessibility communications consultant.', 'Audit all communication channels.', 'Develop accessible brand guidelines including fonts, colours, and imagery.', 'Redesign website for universal access.', 'Create Easy Read, large print, and audio versions of key materials.', 'Develop inclusive marketing strategy with disability representation.', 'Train all communications staff.', 'Establish accessibility review in content approval workflow.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Museum', scenario: 'Website failed WCAG tests. Brochures in 9pt font.', solution: 'Remediated website to WCAG 2.1 AA. Created large print and Easy Read visitor guides. Added alt text to all online images.', outcome: 'Online bookings from people with disability increased 45%. Website won accessibility recognition.', cost: '$12,000', timeframe: '2 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Pricing displayed in small, low-contrast text.', solution: 'Redesigned all price tags to 16pt minimum with high contrast. Website pricing made screen-reader compatible.', outcome: 'Customer complaints about price readability ceased. Older customers also benefit.', cost: '$800', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'WCAG 2.1 Quick Reference', url: 'https://www.w3.org/WAI/WCAG21/quickref/', type: 'website', source: 'W3C', description: 'Complete quick reference for web accessibility standards.', isFree: true },
    { title: 'Plain English Foundation', url: 'https://www.plainenglishfoundation.com/', type: 'guide', source: 'Plain English Foundation', description: 'Resources for writing in plain English.', isAustralian: true, isFree: true },
    { title: 'Media Access Australia', url: 'https://www.mediaaccess.org.au/', type: 'guide', source: 'Media Access Australia', description: 'Resources on accessible media and communications.', isAustralian: true, isFree: true }
  ],
  keywords: ['WCAG', 'website', 'plain language', 'large print', 'communications', 'pricing', 'marketing', 'representation']
},

// ─── Entry 4: Companion Card and assistance animals ───
{
  questionId: '5.1-F-4',
  questionText: 'Does your organisation accept the Companion Card?',
  moduleCode: '5.1',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Companion Card and assistance animals',
  coveredQuestionIds: ['5.1-F-6', '5.1-D-13'],
  summary: 'The Companion Card provides free admission for carers accompanying people with disability. Assistance animal policies must comply with the DDA, which gives assistance animals the right to enter all public premises. Staff need training on both programs.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'People who need a companion to access your venue effectively pay double without the Companion Card. Assistance animals are legally protected under the DDA, but many venues still refuse entry or create awkward situations. Clear policies and trained staff prevent both issues.',
    statistic: { value: '450,000+', context: 'Companion Cards have been issued across Australia. Registration as an affiliate is free and signals genuine welcome.', source: 'Companion Card National Network' }
  },
  tips: [
    { icon: 'CreditCard', text: 'Register as a Companion Card affiliate (free) through your state program.', priority: 1 },
    { icon: 'Heart', text: 'Display the Companion Card logo at entry points and on your website.', priority: 2 },
    { icon: 'Shield', text: 'Create a clear assistance animal policy: all assistance animals are welcome under the DDA.', detail: 'You cannot require proof of training or certification. Assistance animals are identified by their behaviour, not by a vest or ID.', priority: 3 },
    { icon: 'Users', text: 'Train staff on both programs: recognising the card and welcoming assistance animals.', priority: 4 },
    { icon: 'MapPin', text: 'Provide water bowls and relief areas for assistance animals.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing Companion Card and assistance animal readiness',
    steps: [
      { text: 'Check: is your organisation registered as a Companion Card affiliate?' },
      { text: 'Check: is the Companion Card logo displayed at entry and online?' },
      { text: 'Ask staff: how do you process a Companion Card?' },
      { text: 'Check: do you have a written assistance animal policy?' },
      { text: 'Ask staff: can you refuse entry to an assistance animal? (No, under DDA.)' },
      { text: 'Check: is there a water bowl and relief area for assistance animals?' },
      { text: 'Review any incidents of Companion Card or assistance animal refusal.' }
    ],
    tools: ['Checklist'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 9', requirement: 'It is unlawful to discriminate against a person with a disability who has an assistance animal. Assistance animals must be permitted in all public premises.' },
    related: [
      { code: 'DDA', relevance: 'Section 54A allows assistance animals to accompany people with disability in all public places.' }
    ],
    plainEnglish: 'You must allow assistance animals in your venue. You should also accept the Companion Card to remove financial barriers for people who need a support person.',
    complianceNote: 'Refusing an assistance animal is a breach of the DDA. Staff must be trained that they cannot ask for proof of certification, only that the animal is an assistance animal.'
  },
  solutions: [
    {
      title: 'Register and train',
      description: 'Register as Companion Card affiliate and brief staff on both programs.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 hours', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Visit your state Companion Card website and register online (10 minutes).', 'Download and display the logo at entry points.', 'Write a one-page assistance animal policy.', 'Brief all customer-facing staff at next team meeting.', 'Place water bowl at entrance.', 'Update website with Companion Card and assistance animal information.']
    },
    {
      title: 'Comprehensive inclusion policies',
      description: 'Develop detailed policies and integrate into training programs.',
      resourceLevel: 'medium', costRange: '$500-2,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Develop written Companion Card processing procedure.', 'Integrate into ticketing or booking system.', 'Develop assistance animal welcome kit: water bowl, relief map, mat.', 'Add to staff induction training.', 'Create signage welcoming assistance animals.', 'Establish procedure for handling any complaints.', 'Promote on website and social media.']
    },
    {
      title: 'Industry leadership on inclusion',
      description: 'Go beyond compliance to become a model of inclusion.',
      resourceLevel: 'high', costRange: '$2,000-5,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Become a Companion Card promotional partner.', 'Develop advanced assistance animal accommodations (relief areas, dog-sitting during rides).', 'Create staff training module with scenario role-plays.', 'Partner with Guide Dogs, Assistance Dogs Australia for staff engagement.', 'Share your policies publicly as templates for your industry.', 'Celebrate International Day of People with Disability with visible inclusion actions.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Theme Park', scenario: 'Carers charged full price. Assistance dogs turned away from food areas.', solution: 'Registered as Companion Card affiliate. Trained all staff on assistance animal rights. Installed water stations and relief areas.', outcome: 'Disability community visits increased. Zero assistance animal incidents since.', cost: '$200', timeframe: '1 week' },
    { businessType: 'restaurant-cafe', businessTypeLabel: 'Restaurant', scenario: 'Staff unsure if they had to allow guide dogs.', solution: 'Created simple policy card: assistance animals always welcome. Trained all staff. Provided water bowl and mat at entrance.', outcome: 'Positive reviews from blind and vision-impaired diners. Staff confident.', cost: '$0', timeframe: '1 day' }
  ],
  resources: [
    { title: 'Companion Card National Network', url: 'https://www.companioncard.gov.au/', type: 'website', source: 'Australian Government', description: 'Links to all state and territory Companion Card programs.', isAustralian: true, isFree: true },
    { title: 'Assistance Animals and the DDA', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Legal rights of assistance animals under the DDA.', isAustralian: true, isFree: true },
    { title: 'Guide Dogs Australia', url: 'https://www.guidedogs.com.au/', type: 'guide', source: 'Guide Dogs Australia', description: 'Resources on welcoming guide dogs in your venue.', isAustralian: true, isFree: true }
  ],
  keywords: ['Companion Card', 'assistance animal', 'guide dog', 'carer', 'free entry', 'DDA', 'support person']
},
// ─── Entry 5: Accessibility information register and source of truth ───
{
  questionId: '5.1-F-7',
  questionText: 'Do you maintain a single, named accessibility information register that all customer-facing channels reference?',
  moduleCode: '5.1',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility information register and source of truth',
  coveredQuestionIds: ['5.1-D-21', '5.1-D-22'],
  summary: 'A single, named accessibility information register is the internal source of truth that prevents the most common operational failure: drift between what your website, booking system, signage, and front-line staff say. Pair the register with a named owner, a documented update cadence, and a 24-hour change-propagation process across all customer-facing channels.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'When the website says one thing, the brochure says another, and a customer arrives to find the third version, trust breaks. For multi-site organisations, councils, and venues with many channels, drift is the default unless an owned, audited register exists. A register is a low-cost, high-leverage governance instrument: it removes the work of remembering everywhere accessibility info is published and replaces it with a single update path.',
    statistic: { value: '#1', context: 'cause of accessibility complaints in operational reviews of councils and large venues is information drift between channels (lift status, accessible toilet availability, opening hours, accessibility services), not the underlying access itself.', source: 'Practitioner observation across council and venue audits' },
  },
  tips: [
    { icon: 'FileText', text: 'A register can start as a shared, version-controlled document; format matters less than ownership.', priority: 1 },
    { icon: 'UserCheck', text: 'Name a single role (not a committee) as the register owner with a backup for leave coverage.', priority: 2 },
    { icon: 'Calendar', text: 'Set a documented cadence: monthly review, quarterly full audit, annual major review.', priority: 3 },
    { icon: 'Network', text: 'Map every customer-facing channel including third-party listings (Google Business, peak body directories, booking aggregators).', priority: 4 },
    { icon: 'Zap', text: 'Set a 24-hour SLA for change propagation across all channels after any access change.', priority: 5 },
    { icon: 'CheckCircle', text: 'Run a "lift outage" drill annually and measure channel update times.', priority: 6 },
  ],
  howToCheck: {
    title: 'Auditing your accessibility information governance',
    steps: [
      { text: 'Try to find your authoritative accessibility information register. Can you locate it in under 60 seconds? Is there a single document everyone agrees is the source?' },
      { text: 'Compare your website, booking system, brochure, and any third-party listings against the register. Note every discrepancy.' },
      { text: 'Identify the named owner of the register. Confirm it is a specific role, not a committee, with a backup nominated.' },
      { text: 'Check when the register was last reviewed and last fully audited.' },
      { text: 'Pull the change log: when access changed last, how long did it take for every channel to reflect the new state?' },
      { text: 'Stage a "lift outage" drill: notify the owner of a fictional change at 9am and time how long until website, booking, signage, staff, and third-party listings all reflect it.' },
    ],
    estimatedTime: '3-4 hours',
  },
  solutions: [
    {
      title: 'Establish the register',
      description: 'Stand up a single accessibility information register as the named source of truth.',
      resourceLevel: 'low', costRange: '$0-2,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: [
        'Choose a format: shared document, intranet page, or simple database.',
        'Document the scope: physical access, sensory access, communication options, support services, current exceptions.',
        'Map every customer-facing channel that publishes accessibility info.',
        'Publish the register internally and require channels to reference it.',
        'Add the register URL to onboarding documentation for all customer-facing staff.',
      ],
    },
    {
      title: 'Name the owner and cadence',
      description: 'Assign a specific role as register owner with a documented review and audit cadence.',
      resourceLevel: 'low', costRange: '$0-1,500', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: [
        'Name a specific role (not a committee), with backup for leave coverage.',
        'Add ownership to the role description and DIAP.',
        'Document monthly review, quarterly full audit, and annual major review cadence.',
        'Tie register currency to the owner\'s performance review or a quarterly Exec report.',
        'Brief leadership on the role and cadence.',
      ],
    },
    {
      title: 'Build the change-propagation process',
      description: 'Document and roll out a 24-hour propagation process for all access changes.',
      resourceLevel: 'medium', costRange: '$2,000-6,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'significant',
      steps: [
        'List every customer-facing channel including third-party listings.',
        'Designate the trigger: any access change must notify the register owner within 1 hour.',
        'Build a 24-hour propagation checklist (register, website, booking, staff, signage, third-party).',
        'Include temporary changes (planned works, equipment outage) and permanent changes.',
        'Brief all staff who can trigger changes (operations, facilities, maintenance, IT).',
        'Run a drill annually and measure performance.',
      ],
    },
    {
      title: 'Authority/multi-site governance overlay',
      description: 'For councils and multi-site organisations: standardise the register format across sites with central oversight.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: [
        'Define a standard register template all sites must use.',
        'Set a central oversight role responsible for cross-site consistency.',
        'Aggregate site-level register currency into a single dashboard.',
        'Quarterly cross-site audit comparing registers and downstream channels.',
        'Publish aggregate currency and propagation metrics in DIAP.',
      ],
    },
  ],
  examples: [
    {
      businessType: 'event-venue',
      businessTypeLabel: 'Major Venue',
      scenario: 'Lift to accessible mezzanine seating broke down on Saturday morning. Website was updated by Monday; signage updated Wednesday; staff still directing patrons to it on Friday.',
      solution: 'Built register with named owner (Operations Manager). Documented 24-hour propagation checklist. Drilled annually. Subsequent equipment outage saw all channels updated within 4 hours.',
      outcome: 'Subsequent patron complaints about outdated info dropped to zero. Reputation with disability advocacy network significantly improved.',
      cost: '$4,500',
      timeframe: '4 months',
    },
    {
      businessType: 'local-government',
      businessTypeLabel: 'Council',
      scenario: 'Accessibility info scattered across 14 facility pages on the council website, plus printed brochures, plus the council Google Business listing. No central register. Discrepancies discovered at audit.',
      solution: 'Established central register owned by the Disability Inclusion Officer. Required all 14 facility pages and external listings to reference the register quarterly. Built propagation checklist for any change.',
      outcome: 'Discrepancy count dropped from 47 at baseline to 3 at next audit. Auditor cited register as best practice.',
      cost: '$6,000 (register build + initial audit)',
      timeframe: '8 months',
    },
    {
      businessType: 'health-wellness',
      businessTypeLabel: 'Health Service Network',
      scenario: 'Patient-facing accessibility info varied across clinic websites, MyAgedCare listing, and patient reception scripts. Patients receiving conflicting info before appointments.',
      solution: 'Stood up a network-wide register. Each clinic site references the central register. Reception scripts auto-pull from register. Quarterly audit by patient experience team.',
      outcome: 'Pre-appointment complaints about access uncertainty halved. Network adopted register as model for other communication needs.',
      cost: '$8,500',
      timeframe: '6 months',
    },
    {
      businessType: 'tour-operator',
      businessTypeLabel: 'Tourism Operator',
      scenario: 'Operator listed on its own site, on regional tourism portal, and on TripAdvisor. Each had slightly different accessibility info, last updated at different times. Customer arrived expecting features that had been changed.',
      solution: 'Built simple register (one shared document). Set rule: any access change notified to operator owner within 1 hour. Owner updates own site, then regional portal, then TripAdvisor within 24 hours.',
      outcome: 'Three subsequent access changes all reflected across channels within timeframe. One refund avoided.',
      cost: '$1,200 (register + process design)',
      timeframe: '6 weeks',
    },
  ],
  resources: [
    { title: 'AHRC - Accessibility Communications Guidance', url: 'https://humanrights.gov.au/our-work/disability-rights', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on accurate, accessible information about access services.', isAustralian: true, isFree: true },
    { title: 'Australian Government Style Manual - Plain Language', url: 'https://www.stylemanual.gov.au/writing-and-designing-content/plain-language-and-word-choice', type: 'guide', source: 'Australian Government', description: 'Standards for clear, consistent communication of access information.', isAustralian: true, isFree: true },
    { title: 'NSW Disability Inclusion Action Planning Guidelines', url: 'https://www.nsw.gov.au/community-services/disability-inclusion-action-plans', type: 'guide', source: 'NSW Government', description: 'Reference framework that includes information governance as a DIAP component.', isAustralian: true, isFree: true },
    { title: 'WCAG 2.2 Quick Reference', url: 'https://www.w3.org/WAI/WCAG22/quickref/', type: 'tool', source: 'W3C', description: 'For digital channels referencing the register, the standard the published content must meet.', isAustralian: false, isFree: true },
  ],
  keywords: ['source of truth', 'accessibility register', 'information governance', 'channel sync', 'change propagation', 'authoritative information', 'multi-site', 'authority', 'information drift'],
},
// ─── Entry 9: Disability awareness training program ───
{
  questionId: '5.3-F-1',
  questionText: 'Do all customer-facing staff receive disability awareness training?',
  moduleCode: '5.3',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Disability awareness training program',
  coveredQuestionIds: ['5.3-F-2', '5.3-D-1', '5.3-D-7', '5.3-D-11'],
  summary: 'All staff who interact with customers should complete disability awareness training covering types of disability, communication techniques, the social model of disability, and your venue\'s specific accessibility features. Training should be part of induction and refreshed annually.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Staff attitudes and confidence make or break the customer experience for people with disability. Even in a perfectly accessible building, untrained staff can create barriers through awkwardness, assumptions, or well-meaning but inappropriate behaviour.',
    statistic: { value: '73%', context: 'of people with disability say staff attitudes are as important as physical access when choosing where to spend their money.', source: 'AND Customer Insights' },
    quote: { text: 'The building was accessible but the staff made me feel like a burden. They talked to my carer instead of me and made a fuss about my wheelchair. Training would have made all the difference.', attribution: 'Customer with disability, feedback survey' }
  },
  tips: [
    { icon: 'GraduationCap', text: 'Include disability awareness in all staff inductions, not as a separate optional module.', priority: 1 },
    { icon: 'Users', text: 'Use trainers with lived experience of disability.', detail: 'Training delivered by people with disability is consistently rated more impactful than theoretical training alone.', priority: 2 },
    { icon: 'ClipboardList', text: 'Cover the social model: disability is created by barriers, not by medical conditions.', priority: 3 },
    { icon: 'Heart', text: 'Include practical scenarios relevant to your venue type.', priority: 4 },
    { icon: 'CalendarCheck', text: 'Refresh training annually and after any significant accessibility changes.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing disability awareness training',
    steps: [
      { text: 'Is disability awareness training part of staff induction?' },
      { text: 'What percentage of current staff have completed the training?' },
      { text: 'When was the training content last updated?' },
      { text: 'Does the training include practical scenarios and role-play?' },
      { text: 'Is training delivered or co-delivered by people with disability?' },
      { text: 'Is there an annual refresher?' },
      { text: 'Can staff articulate how to assist a person with vision impairment, a wheelchair user, or a person who communicates differently?' }
    ],
    tools: ['Training records', 'Staff survey'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 122', requirement: 'Employers have vicarious liability for discriminatory actions by employees. Training demonstrates due diligence.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 8 requires awareness-raising including training of professionals and staff.' }],
    plainEnglish: 'While not explicitly required by law, disability awareness training protects your organisation from discrimination claims and improves customer experience.',
    complianceNote: 'Training records are valuable evidence if a discrimination complaint is made. Document who was trained, when, and on what.'
  },
  solutions: [
    {
      title: 'Basic disability awareness briefing',
      description: 'Deliver a 1-hour briefing to all customer-facing staff.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Download free disability awareness resources from AND or JobAccess.', 'Create a 1-hour briefing covering: social model, communication tips, your venue\'s features.', 'Include 3-4 scenario role-plays.', 'Deliver to all teams over 2 weeks.', 'Record attendance.', 'Add to induction checklist.']
    },
    {
      title: 'Professional training program',
      description: 'Engage a specialist trainer to deliver comprehensive disability awareness.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'moderate',
      steps: ['Engage a disability training provider (many use trainers with lived experience).', 'Customise content to your venue and customer base.', 'Deliver 3-4 hour workshop to all customer-facing staff.', 'Include practical exercises and scenario role-plays.', 'Provide reference cards staff can keep.', 'Set annual refresher schedule.', 'Measure pre/post confidence levels.']
    },
    {
      title: 'Comprehensive accessibility training program',
      description: 'Multi-level training embedded in organisational learning culture.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Develop tiered training: basic (all staff), intermediate (supervisors), advanced (accessibility champions).', 'Create e-learning modules for scalable delivery.', 'Include lived experience panels and immersive exercises.', 'Develop venue-specific accessibility guide for staff.', 'Create ongoing learning calendar with monthly topics.', 'Train internal trainers for sustainability.', 'Link completion to performance objectives.', 'Report training metrics to leadership.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Staff avoided interacting with guests with disability.', solution: 'Engaged trainer with disability to deliver 3-hour workshops. Included role-plays and a Q&A. All 120 staff trained in 3 weeks.', outcome: 'Guest feedback from people with disability improved dramatically. Staff report higher confidence.', cost: '$4,000', timeframe: '3 weeks' },
    { businessType: 'retail', businessTypeLabel: 'Shopping Centre', scenario: 'Customer complaints about staff attitudes.', solution: 'Mandatory 1-hour awareness briefing for all 300+ retail staff. Created pocket reference cards. Annual refreshers.', outcome: 'Complaints reduced 80%. Centre featured in disability community newsletter.', cost: '$6,000', timeframe: '6 weeks' }
  ],
  resources: [
    { title: 'JobAccess Employer Toolkit', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'JobAccess', description: 'Free government disability awareness resources for employers.', isAustralian: true, isFree: true },
    { title: 'Scope Communication Access', url: 'https://www.scopeaust.org.au/', type: 'guide', source: 'Scope Australia', description: 'Training on communicating with people who have communication disability.', isAustralian: true, isFree: false },
    { title: 'PWDA - Language and Awareness Resources', url: 'https://pwd.org.au/resources/', type: 'guide', source: 'People with Disability Australia', description: 'Peak body resources on disability awareness and respectful communication.', isAustralian: true, isFree: true }
  ],
  keywords: ['training', 'disability awareness', 'induction', 'social model', 'communication', 'staff attitudes', 'role-play']
},

// ─── Entry 10: Training content - disability types and communication ───
{
  questionId: '5.3-D-4',
  questionText: 'Does your training cover different types of disability and appropriate communication techniques?',
  moduleCode: '5.3',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Training content: disability types and communication',
  coveredQuestionIds: ['5.3-D-5', '5.3-D-9', '5.3-D-10', '5.3-D-12', '5.3-D-13'],
  summary: 'Training content should cover visible and invisible disabilities, communication techniques for each type, assistive technology awareness, person-first language, and practical scenarios staff will encounter. Include both knowledge and hands-on practice.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Many staff think "disability" means wheelchairs. In reality, most disabilities are invisible: chronic pain, mental health conditions, autism, hearing loss, and cognitive disabilities. Without understanding the breadth of disability, staff miss opportunities to help and may inadvertently cause harm.',
    statistic: { value: '80%+', context: 'of disabilities are invisible. If your staff only think about wheelchair users, they are missing the vast majority of customers with disability.', source: 'Australian Bureau of Statistics - Survey of Disability, Ageing and Carers' }
  },
  tips: [
    { icon: 'Eye', text: 'Cover both visible and invisible disabilities: mobility, vision, hearing, cognitive, psychosocial, chronic illness.', priority: 1 },
    { icon: 'MessageSquare', text: 'Teach specific communication techniques for each: speak directly to the person, face lip-readers, allow extra time.', priority: 2 },
    { icon: 'Lightbulb', text: 'Include assistive technology awareness: what hearing aids, screen readers, and AAC devices look like and how they work.', priority: 3 },
    { icon: 'ClipboardList', text: 'Use practical scenarios: "A customer is having a panic attack", "A customer\'s guide dog is with them".', priority: 4 },
    { icon: 'Heart', text: 'Emphasise person-first and respectful language: "person with disability" not "disabled person" (unless they prefer otherwise).', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing training content',
    steps: [
      { text: 'Review training materials: are all major disability types covered?' },
      { text: 'Does training include invisible disabilities (mental health, chronic pain, autism)?' },
      { text: 'Are communication techniques specific and practical?' },
      { text: 'Does training cover assistive technology awareness?' },
      { text: 'Are practical scenarios included relevant to your venue?' },
      { text: 'Is respectful language covered with examples?' },
      { text: 'Quiz staff: can they describe how to assist someone with vision impairment versus someone with hearing loss?' }
    ],
    tools: ['Training materials', 'Staff quiz'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 5', requirement: 'The DDA defines disability broadly including physical, intellectual, psychiatric, neurological, and learning disabilities, as well as conditions that may exist in the future.' },
    related: [{ code: 'UNCRPD', relevance: 'Preamble recognises that disability is an evolving concept resulting from interaction with barriers.' }],
    plainEnglish: 'Staff need to understand the full range of disabilities, not just those that are visible. Training should be practical and relevant to your workplace.',
    complianceNote: 'Knowledge of different disability types and communication techniques reduces the risk of discriminatory behaviour and complaint.'
  },
  solutions: [
    {
      title: 'Update training content',
      description: 'Expand existing training to cover all disability types with practical scenarios.',
      resourceLevel: 'low', costRange: '$0-300', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Review current training content against a disability type checklist.', 'Add modules on invisible disability, autism, and mental health.', 'Create scenario cards for common situations at your venue.', 'Add assistive technology show-and-tell (hearing loop receiver, communication board).', 'Include a language guide with dos and don\'ts.', 'Deliver updated content at next staff meeting.']
    },
    {
      title: 'Engage specialist trainers for comprehensive content',
      description: 'Commission new training content from disability specialists.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '4-8 weeks', implementedBy: 'specialist', impact: 'moderate',
      steps: ['Engage disability training specialists.', 'Co-design content with people with different disabilities.', 'Create venue-specific scenarios and role-plays.', 'Film short demonstration videos for ongoing use.', 'Develop assistive technology familiarisation kit.', 'Train internal facilitators to deliver content.', 'Create assessment to verify understanding.']
    },
    {
      title: 'Immersive disability awareness program',
      description: 'Full immersive program with simulation and lived experience engagement.',
      resourceLevel: 'high', costRange: '$10,000-25,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Develop multi-module training with progressive depth.', 'Include ethical simulation exercises (wheelchair navigation, vision simulation).', 'Recruit lived experience panel for Q&A sessions.', 'Create interactive e-learning with video scenarios.', 'Develop advanced modules for supervisors and accessibility champions.', 'Build a library of assistive technology for hands-on learning.', 'Link completion to competency framework.', 'Evaluate through mystery shopping by people with disability.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Zoo', scenario: 'Training only covered physical disability.', solution: 'Expanded to cover autism (sensory needs), vision impairment (guiding techniques), hearing loss (communication), and intellectual disability (Easy English). Added scenario role-plays.', outcome: 'Staff handle diverse situations confidently. Autism-friendly sessions launched.', cost: '$2,000', timeframe: '4 weeks' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Staff did not know how to interact with guests using AAC devices.', solution: 'Added AAC awareness to training. Staff practised using communication boards. Invited local speech pathologist to demonstrate devices.', outcome: 'Staff comfortable with non-verbal guests. Communication boards installed at reception.', cost: '$500', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'Amaze Autism Training', url: 'https://www.amaze.org.au/', type: 'guide', source: 'Amaze', description: 'Training resources on autism awareness for businesses.', isAustralian: true, isFree: true },
    { title: 'Beyond Blue Workplace Training', url: 'https://www.beyondblue.org.au/', type: 'guide', source: 'Beyond Blue', description: 'Mental health awareness training for workplaces.', isAustralian: true, isFree: true }
  ],
  keywords: ['training content', 'disability types', 'invisible disability', 'communication techniques', 'assistive technology', 'autism', 'mental health', 'scenarios']
},

// ─── Entry 11: Equipment knowledge and escalation ───
{
  questionId: '5.3-F-3',
  questionText: 'Are staff trained to operate accessibility equipment at your venue?',
  moduleCode: '5.3',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Equipment knowledge and escalation',
  coveredQuestionIds: ['5.3-D-3', '5.3-D-6', '5.3-D-8'],
  summary: 'Staff must know how to operate accessibility equipment (hearing loops, portable ramps, hoists, communication boards), troubleshoot common issues, and escalate when they cannot resolve a situation. Equipment that staff cannot use is equipment that does not exist.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Investing in accessibility equipment is wasted if staff do not know it exists, where it is stored, or how to use it. A hearing loop that is never switched on, a portable ramp in a locked cupboard, or a hoist that no one is trained to operate all represent failed investment.',
    quote: { text: 'I asked about the hearing loop and the staff member said they did not know they had one. It was right there on the counter, switched off.', attribution: 'Hearing aid user, venue feedback' }
  },
  tips: [
    { icon: 'Settings', text: 'Create a list of all accessibility equipment with locations and operating instructions.', priority: 1 },
    { icon: 'Users', text: 'Train at least 2 staff per shift to operate each piece of equipment.', priority: 2 },
    { icon: 'AlertTriangle', text: 'Include equipment checks in opening/closing procedures.', priority: 3 },
    { icon: 'Phone', text: 'Establish a clear escalation path when staff cannot resolve an accessibility issue.', priority: 4 },
    { icon: 'ClipboardList', text: 'Maintain equipment and test regularly (monthly for hearing loops, weekly for portable ramps).', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing equipment knowledge',
    steps: [
      { text: 'List all accessibility equipment. Can staff locate each item?' },
      { text: 'Ask a staff member to demonstrate operating the hearing loop.' },
      { text: 'Ask a staff member to deploy a portable ramp.' },
      { text: 'Check maintenance logs: when was each item last tested?' },
      { text: 'Ask staff: who do you call if you cannot solve an accessibility problem?' },
      { text: 'Check opening/closing checklists for equipment items.' }
    ],
    tools: ['Equipment list', 'Checklist'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Providing accessibility equipment that staff cannot operate may not constitute a reasonable adjustment if the equipment is effectively unavailable.' },
    related: [{ code: 'AS1428.5', relevance: 'Hearing augmentation systems must be maintained and operational.' }],
    plainEnglish: 'If you have accessibility equipment, your staff must know how to use it. Equipment that is not operational or not known about provides no benefit.',
    complianceNote: 'Regular testing and maintenance records demonstrate that your equipment provision is genuine, not tokenistic.'
  },
  solutions: [
    {
      title: 'Create equipment guide and train staff',
      description: 'Document all equipment and deliver practical training.',
      resourceLevel: 'low', costRange: '$0-200', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Photograph and list all accessibility equipment with locations.', 'Write simple operating instructions for each item.', 'Laminate and place at the equipment location.', 'Demonstrate each item at next team meeting.', 'Add equipment checks to opening checklist.', 'Define escalation contact for accessibility issues.']
    },
    {
      title: 'Structured equipment training and maintenance',
      description: 'Formal training program with scheduled maintenance.',
      resourceLevel: 'medium', costRange: '$500-3,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Create equipment competency checklist for all staff.', 'Schedule practical training sessions for each equipment type.', 'Establish monthly testing schedule.', 'Create maintenance log for each item.', 'Designate equipment champion per shift.', 'Set up spare parts and batteries supply.', 'Review and update annually.']
    },
    {
      title: 'Comprehensive accessibility operations program',
      description: 'Integrate equipment management into venue operations.',
      resourceLevel: 'high', costRange: '$3,000-10,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Create accessibility operations manual covering all equipment.', 'Film training videos for each equipment type.', 'Integrate into learning management system.', 'Require annual competency assessment.', 'Establish preventive maintenance contracts.', 'Create real-time equipment status dashboard.', 'Build escalation matrix with named contacts.', 'Report equipment uptime to management.']
    }
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Theatre', scenario: 'Hearing loop installed but never switched on. Staff unaware.', solution: 'Created equipment guide with photos. Added loop activation to opening checklist. Trained all front-of-house. Monthly testing.', outcome: 'Loop used at every performance. Hearing aid users notice and comment positively.', cost: '$0', timeframe: '1 day' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Portable ramp stored in basement. Staff could not find it when needed.', solution: 'Moved to reception storage. Trained 2 staff per shift on deployment. Added to shift handover checklist.', outcome: 'Ramp available within 2 minutes of request. Guest satisfaction improved.', cost: '$0', timeframe: '1 hour' }
  ],
  resources: [
    { title: 'Hearing Loop Maintenance Guide', url: 'https://www.hearingaustralia.gov.au/', type: 'guide', source: 'Hearing Australia', description: 'How to test and maintain hearing loop systems.', isAustralian: true, isFree: true },
    { title: 'Vision Australia - Assistive Technology', url: 'https://www.visionaustralia.org/services/assistive-technology', type: 'guide', source: 'Vision Australia', description: 'Accessibility equipment selection and maintenance guidance for blind and low-vision access.', isAustralian: true, isFree: true }
  ],
  keywords: ['equipment', 'hearing loop', 'portable ramp', 'hoist', 'maintenance', 'training', 'escalation', 'troubleshooting']
},

// ─── Entry 12: Accessibility in supplier selection ───
{
  questionId: '5.4-F-1',
  questionText: 'Does your organisation include accessibility requirements when selecting suppliers and vendors?',
  moduleCode: '5.4',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility in supplier selection',
  coveredQuestionIds: ['5.4-D-1', '5.4-D-2', '5.4-D-4', '5.4-D-7', '5.4-D-11'],
  summary: 'Accessible procurement means evaluating suppliers on their accessibility practices, requiring WCAG compliance for digital products, considering disability-owned enterprises, and making the tendering process itself accessible.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Your accessibility chain is only as strong as its weakest supplier. If a third-party catering company, technology vendor, or event supplier does not understand accessibility, your customers with disability suffer. Procurement is a powerful lever for driving accessibility across your supply chain.',
    statistic: { value: '$54 billion', context: 'annual spending by Australians with disability is influenced by the entire supply chain, not just the front-line provider.', source: 'AND' }
  },
  tips: [
    { icon: 'ClipboardList', text: 'Add accessibility criteria to all tender evaluation scorecards.', priority: 1 },
    { icon: 'Globe', text: 'Require WCAG 2.1 AA compliance for all digital products and services.', priority: 2 },
    { icon: 'Users', text: 'Ask suppliers about their disability employment and inclusion practices.', priority: 3 },
    { icon: 'Heart', text: 'Consider disability-owned businesses (Australian Disability Enterprises) in procurement.', priority: 4 },
    { icon: 'FileText', text: 'Make tender documents themselves accessible: plain language, available in alternative formats.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing procurement accessibility',
    steps: [
      { text: 'Review tender templates: do they include accessibility requirements?' },
      { text: 'Check evaluation criteria: is accessibility weighted in scoring?' },
      { text: 'Review recent procurements: were accessibility questions asked?' },
      { text: 'Check digital procurement: are WCAG requirements specified?' },
      { text: 'Are tender documents available in accessible formats?' },
      { text: 'Do you consider disability-owned enterprises?' }
    ],
    tools: ['Procurement templates', 'Contract samples'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers are responsible for the accessibility of services they procure on behalf of their customers.' },
    related: [{ code: 'WCAG', relevance: 'WCAG 2.1 AA should be specified for all digital procurement.' }],
    plainEnglish: 'You are responsible for the accessibility of services your suppliers deliver. Include accessibility in your procurement requirements.',
    complianceNote: 'Several Australian state governments require accessibility in procurement. Private sector adoption is growing as a best practice.'
  },
  solutions: [
    {
      title: 'Add accessibility to procurement templates',
      description: 'Update tender and evaluation templates with accessibility criteria.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add accessibility question to supplier evaluation template.', 'Include WCAG 2.1 AA requirement for digital procurement.', 'Add "accessibility practices" question to RFP template.', 'Brief procurement staff on what to look for.', 'Create list of disability-owned enterprises for consideration.', 'Track accessibility in procurement decisions.']
    },
    {
      title: 'Accessible procurement policy and training',
      description: 'Formal policy with procurement staff training.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Develop accessible procurement policy.', 'Create accessibility evaluation criteria with weighting.', 'Train procurement team on accessibility assessment.', 'Develop supplier accessibility questionnaire.', 'Establish preferred supplier list of accessible vendors.', 'Make all tender documents accessible.', 'Report procurement accessibility metrics.']
    },
    {
      title: 'Supply chain accessibility program',
      description: 'Comprehensive program embedding accessibility throughout supply chain.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage procurement accessibility consultant.', 'Audit entire supply chain for accessibility.', 'Develop tiered accessibility requirements by supplier category.', 'Create supplier accessibility certification program.', 'Integrate accessibility into supplier management system.', 'Establish annual supplier accessibility reviews.', 'Publish supply chain accessibility report.', 'Share policies as industry templates.']
    }
  ],
  examples: [
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'New website vendor delivered inaccessible site.', solution: 'Added WCAG 2.1 AA to all IT contracts. Required accessibility testing evidence. Added penalty clauses.', outcome: 'All new digital products meet WCAG standards. Vendor accountability clear.', cost: '$0 (policy change)', timeframe: '2 weeks' },
    { businessType: 'event-venue', businessTypeLabel: 'Convention Centre', scenario: 'Catering suppliers unaware of accessibility needs.', solution: 'Added accessibility clause to all catering contracts. Required staff awareness training. Evaluated in renewal decisions.', outcome: 'Caterers proactively ask about access needs. Event feedback improved.', cost: '$0', timeframe: '1 month' }
  ],
  resources: [
    { title: 'Social Procurement Framework', url: 'https://www.buyingfor.vic.gov.au/', type: 'guide', source: 'Victorian Government', description: 'Framework for social outcomes in procurement including disability.', isAustralian: true, isFree: true },
    { title: 'Department of Social Services - Disability Employment', url: 'https://www.dss.gov.au/disability-and-carers/programmes-services/for-people-with-disability', type: 'website', source: 'Australian Government', description: 'Federal information on Australian Disability Enterprises and inclusive procurement pathways.', isAustralian: true, isFree: true }
  ],
  keywords: ['procurement', 'supplier', 'tender', 'WCAG', 'evaluation', 'disability enterprise', 'supply chain']
},

// ─── Entry 13: Accessibility requirements in contracts ───
{
  questionId: '5.4-F-2',
  questionText: 'Do your contracts and service agreements include accessibility clauses?',
  moduleCode: '5.4',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility requirements in contracts',
  coveredQuestionIds: ['5.4-D-3', '5.4-D-5', '5.4-D-6', '5.4-D-12'],
  summary: 'Contracts should include specific accessibility requirements, compliance standards (WCAG for digital, AS 1428.1 for physical), testing obligations, remediation timelines, and consideration of total cost of ownership including accessibility maintenance.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Without accessibility clauses in contracts, you have no leverage when suppliers deliver inaccessible products or services. Contractual requirements make accessibility a business obligation, not a goodwill request.',
    quote: { text: 'We spent $200,000 on a new booking system and it did not work with screen readers. Without an accessibility clause, we had no contractual remedy.', attribution: 'IT Manager, tourism operator' }
  },
  tips: [
    { icon: 'FileText', text: 'Include specific accessibility standards in contracts (WCAG 2.1 AA for digital, AS 1428.1 for physical).', priority: 1 },
    { icon: 'Shield', text: 'Require accessibility testing evidence before accepting deliverables.', priority: 2 },
    { icon: 'ClipboardList', text: 'Include remediation timelines for accessibility defects.', priority: 3 },
    { icon: 'Scale', text: 'Consider total cost of ownership: accessible solutions may cost more upfront but less over time.', priority: 4 },
    { icon: 'CalendarCheck', text: 'Include accessibility in contract renewal criteria.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing contract accessibility',
    steps: [
      { text: 'Review 5 recent contracts: do any mention accessibility?' },
      { text: 'Check digital contracts: is WCAG 2.1 AA specified?' },
      { text: 'Check physical/construction contracts: is AS 1428.1 specified?' },
      { text: 'Are acceptance criteria linked to accessibility compliance?' },
      { text: 'Do contracts include remediation obligations for accessibility defects?' },
      { text: 'Is total cost of ownership (including accessibility) evaluated?' }
    ],
    tools: ['Contract samples', 'Legal review'],
    estimatedTime: '30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Service providers remain liable for accessibility of procured services. Contractual requirements protect both parties.' },
    related: [{ code: 'WCAG', relevance: 'WCAG 2.1 AA is the Australian standard for digital accessibility.' }],
    plainEnglish: 'Include accessibility requirements in your contracts so suppliers know what is expected and you have a remedy if they do not deliver.',
    complianceNote: 'Legal teams should review accessibility clauses. Template clauses are available from AND and government procurement frameworks.'
  },
  solutions: [
    {
      title: 'Add accessibility clauses to contract templates',
      description: 'Insert standard accessibility clauses into your contract templates.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft standard accessibility clause for digital contracts.', 'Draft standard clause for physical/construction contracts.', 'Add to contract templates.', 'Brief legal team on the clauses.', 'Brief procurement team on enforcement.', 'Apply to all new contracts going forward.']
    },
    {
      title: 'Develop comprehensive accessibility contract framework',
      description: 'Create detailed requirements for different supplier categories.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Engage legal review of accessibility obligations.', 'Develop tiered requirements by supplier category.', 'Create accessibility testing requirements for digital deliverables.', 'Define remediation SLAs.', 'Create total cost of ownership evaluation framework.', 'Train procurement and legal staff.', 'Apply to all new and renewal contracts.']
    },
    {
      title: 'Accessibility compliance management system',
      description: 'System for managing and tracking supplier accessibility compliance.',
      resourceLevel: 'high', costRange: '$10,000-25,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Develop accessibility compliance framework.', 'Integrate into contract management system.', 'Create automated testing for digital accessibility.', 'Establish supplier scorecard with accessibility metrics.', 'Build remediation tracking workflow.', 'Report compliance to board.', 'Share framework publicly.', 'Review and update annually.']
    }
  ],
  examples: [
    { businessType: 'general', businessTypeLabel: 'Corporate', scenario: 'New HR system failed accessibility tests after deployment.', solution: 'Added WCAG 2.1 AA clause to all IT contracts. Required pre-acceptance testing. Included 30-day remediation SLA.', outcome: 'All new systems meet WCAG. Vendor accountability established.', cost: '$500 (legal review)', timeframe: '2 weeks' },
    { businessType: 'local-government', businessTypeLabel: 'State Government', scenario: 'Construction contractors not meeting AS 1428.1.', solution: 'Added AS 1428.1 compliance and independent access audit to all construction contracts. Non-compliance triggers remediation at contractor cost.', outcome: 'New facilities consistently meet standards. Reduced post-construction modifications.', cost: '$2,000', timeframe: '1 month' }
  ],
  resources: [
    { title: 'Digital Transformation Agency - Accessibility Standard', url: 'https://www.dta.gov.au/help-and-advice/digital-service-standard', type: 'guide', source: 'Digital Transformation Agency', description: 'Federal government digital service standard including accessibility procurement expectations.', isAustralian: true, isFree: true },
    { title: 'Victorian ICT Accessibility', url: 'https://www.vic.gov.au/', type: 'guide', source: 'Victorian Government', description: 'Government ICT accessibility procurement requirements.', isAustralian: true, isFree: true }
  ],
  keywords: ['contracts', 'clauses', 'WCAG', 'AS 1428.1', 'remediation', 'testing', 'compliance', 'total cost of ownership']
},

// ─── Entry 14: Ongoing supplier accountability ───
{
  questionId: '5.4-D-8',
  questionText: 'Do you regularly review supplier compliance with accessibility requirements?',
  moduleCode: '5.4',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Ongoing supplier accountability',
  coveredQuestionIds: ['5.4-D-9', '5.4-D-10'],
  summary: 'Accessibility requirements in contracts are only effective if compliance is monitored. Regular supplier reviews, accessibility audits, performance reporting, and contract renewal criteria ensure ongoing accountability.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Suppliers may meet accessibility requirements at the start of a contract but let standards slip over time. Software updates may break accessibility features. Staff turnover at supplier organisations may erode training. Regular review maintains standards.',
    statistic: { value: '60%', context: 'of websites that pass an initial accessibility audit fail a follow-up audit within 12 months due to content changes and updates.', source: 'WebAIM Million Study' }
  },
  tips: [
    { icon: 'CalendarCheck', text: 'Schedule annual accessibility reviews for key suppliers.', priority: 1 },
    { icon: 'Search', text: 'Conduct periodic accessibility testing of digital products and services.', priority: 2 },
    { icon: 'BarChart3', text: 'Include accessibility in supplier performance scorecards.', priority: 3 },
    { icon: 'Target', text: 'Use contract renewal as leverage for accessibility improvements.', priority: 4 },
    { icon: 'AlertTriangle', text: 'Develop remediation plans for non-compliant suppliers.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing supplier accountability',
    steps: [
      { text: 'List key suppliers with accessibility requirements.' },
      { text: 'When was each last reviewed for accessibility compliance?' },
      { text: 'Have any accessibility issues been identified and resolved?' },
      { text: 'Is accessibility included in supplier performance reviews?' },
      { text: 'Are accessibility results considered in renewal decisions?' }
    ],
    tools: ['Supplier list', 'Accessibility test results'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 24', requirement: 'Ongoing responsibility for accessibility of services extends to procured services.' },
    related: [{ code: 'WCAG', relevance: 'Digital accessibility requires ongoing monitoring as content and functionality change.' }],
    plainEnglish: 'Check that your suppliers continue to meet accessibility requirements, especially for digital products that change frequently.',
    complianceNote: 'Automated accessibility monitoring tools can provide continuous checking of digital products.'
  },
  solutions: [
    {
      title: 'Add accessibility to supplier reviews',
      description: 'Include accessibility check in existing supplier review process.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 hours per supplier', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add accessibility question to supplier review template.', 'Run automated accessibility test on digital products (WAVE, axe).', 'Ask suppliers to report any accessibility changes.', 'Document review results.', 'Follow up on identified issues.', 'Consider results in renewal decisions.']
    },
    {
      title: 'Structured supplier accessibility program',
      description: 'Formal monitoring and remediation program.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Create supplier accessibility scorecard.', 'Schedule annual audits for key suppliers.', 'Deploy automated monitoring for digital suppliers.', 'Develop remediation protocol with timelines.', 'Include in quarterly supplier management meetings.', 'Report to procurement leadership.', 'Share results with suppliers for improvement.']
    },
    {
      title: 'Continuous accessibility monitoring',
      description: 'Automated and manual monitoring system.',
      resourceLevel: 'high', costRange: '$8,000-20,000 per year', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Deploy continuous accessibility monitoring platform.', 'Integrate with supplier management system.', 'Set up automated alerts for accessibility regression.', 'Conduct annual manual expert audit.', 'Engage people with disability for user testing.', 'Publish supplier accessibility ratings.', 'Tie supplier bonuses or penalties to accessibility scores.', 'Report annually on supply chain accessibility.']
    }
  ],
  examples: [
    { businessType: 'general', businessTypeLabel: 'Corporate', scenario: 'Website vendor update broke screen reader navigation.', solution: 'Deployed automated accessibility monitoring. Set up alerts for WCAG violations. Added accessibility regression testing to change management.', outcome: 'Issues detected within hours. Vendor fixes within SLA. No customer impact.', cost: '$3,000/year', timeframe: '1 month' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Annual audit found supplier systems had degraded.', solution: 'Added accessibility to quarterly supplier reviews. Required annual compliance evidence. Non-compliance affects renewal scoring.', outcome: 'Supplier accountability improved. Systems maintain accessibility over time.', cost: '$0', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'WebAIM WAVE', url: 'https://wave.webaim.org/', type: 'tool', source: 'WebAIM', description: 'Free web accessibility evaluation tool.', isFree: true },
    { title: 'Deque axe', url: 'https://www.deque.com/axe/', type: 'tool', source: 'Deque Systems', description: 'Automated accessibility testing tool.', isFree: true }
  ],
  keywords: ['supplier review', 'monitoring', 'compliance', 'remediation', 'automated testing', 'scorecard', 'accountability']
},

// ─── Entry 15: Accessibility performance review ───
{
  questionId: '5.5-F-1',
  questionText: 'Does your organisation regularly review its accessibility performance?',
  moduleCode: '5.5',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Accessibility performance review',
  coveredQuestionIds: ['5.5-D-1', '5.5-D-6', '5.5-D-10', '5.5-D-11', '5.5-F-2'],
  summary: 'Regular accessibility performance reviews assess progress against DIAP goals, measure customer and employee experience, identify new barriers, and ensure accountability through board-level reporting and multi-year roadmaps.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Accessibility is not a destination but a continuous improvement journey. Without regular reviews, organisations lose momentum, new barriers emerge unnoticed, and staff revert to old habits. Performance reviews keep accessibility visible and accountable.',
    statistic: { value: '85%', context: 'of organisations that review accessibility performance quarterly report achieving DIAP goals on time, compared to 30% that review annually or less.', source: 'AND Benchmarking Data' }
  },
  tips: [
    { icon: 'CalendarCheck', text: 'Review accessibility performance quarterly, not just annually.', priority: 1 },
    { icon: 'BarChart3', text: 'Track meaningful KPIs: customer satisfaction, complaint trends, physical audit scores, digital compliance.', priority: 2 },
    { icon: 'Target', text: 'Maintain a multi-year accessibility roadmap aligned with your strategic plan.', priority: 3 },
    { icon: 'Users', text: 'Include feedback from people with disability in performance reviews.', priority: 4 },
    { icon: 'TrendingUp', text: 'Report to the board at least annually with progress and challenges.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing performance review processes',
    steps: [
      { text: 'When was the last accessibility performance review?' },
      { text: 'What KPIs are tracked?' },
      { text: 'Is there a multi-year accessibility roadmap?' },
      { text: 'Does the board receive accessibility reports?' },
      { text: 'Is customer feedback from people with disability collected and analysed?' },
      { text: 'Are DIAP actions tracked against timelines?' },
      { text: 'When was the last physical accessibility audit?' }
    ],
    tools: ['DIAP progress tracker', 'KPI dashboard', 'Customer feedback data'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 54', requirement: 'Action plans should be reviewed and updated regularly. The AHRC encourages ongoing monitoring.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 33 requires monitoring of implementation of disability rights.' }],
    plainEnglish: 'Regularly check how you are going against your accessibility goals. Report progress to leadership and use feedback to improve.',
    complianceNote: 'Performance reviews create an evidence trail that demonstrates ongoing commitment to accessibility.'
  },
  solutions: [
    {
      title: 'Establish basic accessibility KPI tracking',
      description: 'Set up simple tracking of key accessibility metrics.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Define 5-8 accessibility KPIs.', 'Create a simple tracking spreadsheet.', 'Assign data collection responsibilities.', 'Schedule quarterly review meetings.', 'Report to leadership at least annually.', 'Adjust actions based on results.']
    },
    {
      title: 'Structured accessibility management system',
      description: 'Formal system for tracking, reporting, and improving.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Develop accessibility dashboard with real-time KPIs.', 'Create multi-year roadmap aligned to strategic plan.', 'Establish quarterly review cycle with leadership.', 'Integrate customer feedback from people with disability.', 'Commission annual physical and digital accessibility audits.', 'Publish annual accessibility progress report.', 'Benchmark against peers.']
    },
    {
      title: 'Continuous improvement excellence program',
      description: 'Comprehensive system with external benchmarking and public reporting.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage accessibility management consultant.', 'Develop comprehensive measurement framework.', 'Implement accessibility management software.', 'Establish internal and external audit program.', 'Participate in AND Access and Inclusion Index.', 'Publish annual accessibility report with targets and results.', 'Set executive remuneration links to accessibility goals.', 'Develop continuous improvement culture with staff awards.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'DIAP created but never reviewed. Progress unknown.', solution: 'Established quarterly DIAP review. Created KPI dashboard. Annual board report. Customer satisfaction surveys.', outcome: 'DIAP actions completed on time. Board engaged. Customer satisfaction measurably improved.', cost: '$0', timeframe: '2 weeks to set up' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Annual review too infrequent to drive change.', solution: 'Moved to quarterly reviews with disability advisory committee. Real-time KPI dashboard. Monthly progress updates to executive.', outcome: 'DIAP completion rate went from 45% to 92% in one year.', cost: '$5,000', timeframe: '3 months' }
  ],
  resources: [
    { title: 'AHRC DIAP Monitoring', url: 'https://humanrights.gov.au/our-work/disability-rights/action-plans', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on monitoring and reporting DIAP progress.', isAustralian: true, isFree: true },
    { title: 'Australia\'s Disability Strategy - Outcome Reporting', url: 'https://www.disabilitygateway.gov.au/ads', type: 'website', source: 'Australian Government', description: 'National strategy outcome areas and progress reporting framework.', isAustralian: true, isFree: true }
  ],
  keywords: ['performance review', 'KPIs', 'roadmap', 'board reporting', 'DIAP progress', 'audit', 'continuous improvement']
},

// ─── Entry 16: Reporting and benchmarking ───
{
  questionId: '5.5-F-3',
  questionText: 'Does your organisation publicly report on accessibility progress?',
  moduleCode: '5.5',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Reporting and benchmarking',
  coveredQuestionIds: ['5.5-D-2', '5.5-D-3', '5.5-D-4', '5.5-D-12'],
  summary: 'Public reporting on accessibility progress builds trust, creates accountability, and enables benchmarking. Annual reports should cover progress against goals, challenges encountered, customer and employee outcomes, and plans for the next period.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Transparency builds trust. When organisations publicly report on accessibility, people with disability can make informed choices and the disability community can recognise genuine effort. Benchmarking against peers drives competitive improvement.',
    statistic: { value: '65%', context: 'of Australians with disability say they would prefer to give their business to organisations that publicly report on accessibility.', source: 'AND Consumer Research' }
  },
  tips: [
    { icon: 'BarChart3', text: 'Publish an annual accessibility progress report.', priority: 1 },
    { icon: 'TrendingUp', text: 'Benchmark against industry peers and national standards.', priority: 2 },
    { icon: 'Globe', text: 'Publish your accessibility statement and DIAP on your website.', priority: 3 },
    { icon: 'Target', text: 'Include both achievements and areas for improvement in reports.', priority: 4 },
    { icon: 'CalendarCheck', text: 'Develop a multi-year roadmap showing where you are heading.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing reporting and benchmarking',
    steps: [
      { text: 'Is an annual accessibility report published?' },
      { text: 'Is the DIAP or accessibility statement on your website?' },
      { text: 'Do you participate in any benchmarking program?' },
      { text: 'Does reporting include both achievements and gaps?' },
      { text: 'Is a multi-year roadmap published or available to stakeholders?' }
    ],
    tools: ['Annual report', 'Website'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 54', requirement: 'DIAPs registered with AHRC should include reporting mechanisms.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 33 requires public reporting on disability rights implementation.' }],
    plainEnglish: 'Publicly reporting on your accessibility progress demonstrates commitment and enables informed decisions by customers and employees with disability.',
    complianceNote: 'Public reporting is not mandatory for most private organisations but is increasingly expected by consumers and investors.'
  },
  solutions: [
    {
      title: 'Publish accessibility information online',
      description: 'Create a web page with your accessibility commitment and progress.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Create an accessibility page on your website.', 'Publish your accessibility statement or DIAP.', 'List key accessibility features of your venue.', 'Provide contact details for accessibility enquiries.', 'Update annually with progress.', 'Share on social media.']
    },
    {
      title: 'Annual accessibility report and benchmarking',
      description: 'Produce a formal report and participate in benchmarking.',
      resourceLevel: 'medium', costRange: '$2,000-8,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Compile annual accessibility data.', 'Write progress report covering achievements, challenges, and plans.', 'Participate in AND Access and Inclusion Index.', 'Publish report on website and share with stakeholders.', 'Present results at board meeting.', 'Use benchmarking results to set next year\'s priorities.', 'Promote publicly.']
    },
    {
      title: 'Industry leadership in transparency',
      description: 'Lead your industry in accessibility reporting and benchmarking.',
      resourceLevel: 'high', costRange: '$8,000-20,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Develop comprehensive reporting framework.', 'Integrate with annual report or sustainability report.', 'Participate in multiple benchmarking programs.', 'Commission third-party verification of claims.', 'Publish detailed multi-year roadmap.', 'Present at industry conferences.', 'Mentor other organisations.', 'Advocate for industry-wide reporting standards.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'No public accessibility information.', solution: 'Created accessibility web page with features, DIAP, and contact. Published annual progress update.', outcome: 'Bookings from disability travel community increased. Featured on Travability.', cost: '$0', timeframe: '1 week' },
    { businessType: 'general', businessTypeLabel: 'Corporate', scenario: 'Wanted to demonstrate accessibility leadership.', solution: 'Published first accessibility report. Registered DIAP with AHRC. Presented results at industry conference.', outcome: 'Public DIAP registration. Media coverage. Talent attraction improved.', cost: '$10,000', timeframe: '3 months' }
  ],
  resources: [
    { title: 'AHRC DIAP Register', url: 'https://humanrights.gov.au/our-work/disability-rights/action-plans', type: 'website', source: 'Australian Human Rights Commission', description: 'Public register for DIAPs - visibility and accountability for your reporting.', isAustralian: true, isFree: true },
    { title: 'Australia\'s Disability Strategy', url: 'https://www.disabilitygateway.gov.au/ads', type: 'website', source: 'Australian Government', description: 'National reporting framework with outcome areas, indicators, and targets.', isAustralian: true, isFree: true },
    { title: 'Global Reporting Initiative', url: 'https://www.globalreporting.org/', type: 'guide', source: 'GRI', description: 'Framework for sustainability reporting including disability.', isFree: true }
  ],
  keywords: ['reporting', 'benchmarking', 'transparency', 'annual report', 'DIAP register', 'public reporting', 'roadmap']
},

// ─── Entry 17: Learning, engagement and recognition ───
{
  questionId: '5.5-D-5',
  questionText: 'Does your organisation actively engage with the disability community to improve accessibility?',
  moduleCode: '5.5',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Learning, engagement and recognition',
  coveredQuestionIds: ['5.5-D-7', '5.5-D-8', '5.5-D-9', '5.5-D-13'],
  summary: 'Meaningful disability community engagement goes beyond consultation to include co-design, ongoing relationships, sharing learnings publicly, and celebrating accessibility achievements. Recognition motivates continued effort and signals commitment to the community.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'The disability community is your most valuable accessibility resource. Engaging genuinely, sharing what you learn, and celebrating progress creates a virtuous cycle of improvement. Organisations that engage with the community consistently achieve better accessibility outcomes.',
    quote: { text: 'When an organisation invites us to co-design, not just consult, the results are transformative. We know what works because we live it every day.', attribution: 'Disability advocate, co-design participant' }
  },
  tips: [
    { icon: 'Users', text: 'Move from consultation to co-design: involve people with disability in creating solutions, not just reviewing them.', priority: 1 },
    { icon: 'Heart', text: 'Pay community members for their expertise and time.', priority: 2 },
    { icon: 'Award', text: 'Nominate for accessibility awards to celebrate team achievements.', priority: 3 },
    { icon: 'Globe', text: 'Share your learnings publicly: blog posts, conference presentations, case studies.', priority: 4 },
    { icon: 'CalendarCheck', text: 'Mark International Day of People with Disability (3 December) with visible activities.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing community engagement',
    steps: [
      { text: 'Do you have ongoing relationships with disability organisations?' },
      { text: 'Have people with disability been involved in co-design (not just consultation)?' },
      { text: 'Are community members paid for their time?' },
      { text: 'Do you share accessibility learnings publicly?' },
      { text: 'Has your organisation nominated for or won accessibility awards?' },
      { text: 'Do you celebrate International Day of People with Disability?' }
    ],
    tools: ['Engagement log', 'Event records'],
    estimatedTime: '15-20 minutes'
  },
  standardsReference: {
    primary: { code: 'UNCRPD', section: 'Article 4(3)', requirement: 'States Parties shall closely consult with and actively involve persons with disabilities through their representative organisations in developing and implementing policies.' },
    related: [{ code: 'DDA', relevance: 'Genuine community engagement demonstrates good faith compliance efforts.' }],
    plainEnglish: 'Engage meaningfully with the disability community. Pay for expertise. Share what you learn. Celebrate achievements.',
    complianceNote: 'Community engagement is not a legal requirement for most private organisations but is universally recognised as best practice.'
  },
  solutions: [
    {
      title: 'Build community relationships',
      description: 'Establish connections with local disability organisations.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify local disability organisations relevant to your business.', 'Attend disability sector events.', 'Invite disability groups to visit and provide feedback.', 'Share your accessibility improvements on social media.', 'Plan an activity for International Day of People with Disability.', 'Follow disability advocacy accounts on social media.']
    },
    {
      title: 'Structured engagement program',
      description: 'Ongoing engagement with paid co-design and public sharing.',
      resourceLevel: 'medium', costRange: '$3,000-10,000 per year', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Establish partnerships with 3-5 disability organisations.', 'Create co-design opportunities for all major projects.', 'Pay co-design participants market rates.', 'Nominate for relevant accessibility awards.', 'Write and publish case studies of accessibility improvements.', 'Present at industry events.', 'Celebrate accessibility milestones internally and externally.']
    },
    {
      title: 'Accessibility thought leadership',
      description: 'Position your organisation as an accessibility leader through sharing and advocacy.',
      resourceLevel: 'high', costRange: '$10,000-25,000 per year', implementedBy: 'specialist', impact: 'significant',
      timeRequired: '6-12 months',
      steps: ['Develop accessibility thought leadership strategy.', 'Establish research partnerships with disability organisations.', 'Create and share accessibility resources for your industry.', 'Sponsor disability events and conferences.', 'Mentor other organisations on their accessibility journey.', 'Publish annual learnings report.', 'Advocate for industry-wide accessibility standards.', 'Build an accessibility community of practice.']
    }
  ],
  examples: [
    { businessType: 'attraction', businessTypeLabel: 'Museum', scenario: 'Little connection with disability community.', solution: 'Partnered with 3 disability organisations. Co-designed new exhibition with blind and Deaf advisors. Shared process publicly.', outcome: 'Exhibition won accessibility award. Ongoing relationships for future projects. Industry recognition.', cost: '$5,000', timeframe: '6 months' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'Wanted to celebrate accessibility progress.', solution: 'Published blog series on accessibility journey. Hosted International Day of People with Disability event. Registered DIAP with AHRC.', outcome: 'Media coverage. Employee pride. Community engagement strengthened.', cost: '$3,000', timeframe: '3 months' }
  ],
  resources: [
    { title: 'International Day of People with Disability', url: 'https://www.idpwd.com.au/', type: 'website', source: 'IDPWD', description: 'Resources for celebrating International Day of People with Disability on 3 December.', isAustralian: true, isFree: true },
    { title: 'Disability Gateway', url: 'https://www.disabilitygateway.gov.au/', type: 'website', source: 'Australian Government', description: 'National gateway supporting community engagement and recognition of inclusive organisations.', isAustralian: true, isFree: true }
  ],
  keywords: ['co-design', 'engagement', 'community', 'awards', 'sharing learnings', 'IDPwD', 'recognition', 'advocacy']
},

// ─── MODULE 5.6: Supplier and third-party accessibility ─────────────────

// ─── Entry: Third-party service standards and verification ───
{
  questionId: '5.6-PC-1',
  questionText: 'Do you set accessibility standards for third-party service providers?',
  moduleCode: '5.6',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Third-party service standards and verification',
  coveredQuestionIds: ['5.6-PC-3', '5.6-PC-4', '5.6-PC-5', '5.6-D-3', '5.6-D-4', '5.6-D-5'],
  summary: 'Your accessibility reputation depends on every touchpoint, including those delivered by third parties. Setting clear accessibility standards for suppliers, delivery partners, contractors, and outsourced services ensures customers with disability receive consistent, quality experiences regardless of who delivers the service.',
  lastUpdated: '2026-03-31',

  whyItMatters: {
    text: 'Customers do not distinguish between your staff and your contractors. If a catering company you hired serves food at an inaccessible height, if a cleaning contractor blocks an accessible toilet with equipment, or if a transport partner sends a vehicle without wheelchair access, the customer blames your organisation. Under the DDA, you cannot outsource your accessibility obligations. Section 24 makes it unlawful to discriminate in the provision of goods, services, and facilities, whether delivered directly or through third parties. Setting standards, briefing suppliers, verifying compliance, and reviewing performance at contract renewal are essential to maintaining accessible service across your full operation.',
    statistic: {
      value: '4.4 million',
      context: 'Australians have disability. When they encounter an accessibility failure from a third-party provider at your venue or event, the complaint comes to you. Proactive supplier management prevents reputational and legal risk.',
      source: 'ABS Survey of Disability, Ageing and Carers 2018'
    },
    quote: {
      text: 'The hotel was fantastic. But the airport transfer they booked for us was a standard van with no ramp. We were stranded at the airport for an hour. The hotel apologised, but the damage was done.',
      attribution: 'Wheelchair user, travel review'
    }
  },

  tips: [
    {
      icon: 'FileText',
      text: 'Include accessibility requirements in all supplier contracts and service level agreements.',
      detail: 'Add a standard accessibility clause to your procurement templates. Specify what you expect: staff trained in disability awareness, accessible equipment, compliance with DDA and relevant standards, and a process for handling accessibility complaints. Make it a condition of contract, not an optional extra.',
      priority: 1
    },
    {
      icon: 'ClipboardList',
      text: 'Create an accessibility briefing template for all contractors and casual suppliers.',
      detail: 'A one-page briefing covering: key accessibility features of your venue (accessible toilets, paths, parking), behaviours expected (do not block accessible routes, offer assistance without assuming), emergency procedures for people with disability, and who to contact with accessibility questions. Hand it to every caterer, cleaner, AV technician, and event crew member.',
      priority: 2
    },
    {
      icon: 'Target',
      text: 'Verify supplier accessibility performance before and during the contract.',
      detail: 'Ask suppliers about their accessibility capabilities during procurement (not after the contract is signed). Conduct spot checks during service delivery. Include accessibility as a line item in performance reviews and contract renewal assessments.',
      priority: 3
    },
    {
      icon: 'Users',
      text: 'Establish a customer reporting pathway for third-party accessibility issues.',
      detail: 'Customers need a clear way to report accessibility problems with any service provider at your venue, not just your staff. A single feedback channel (online form, phone, email) that you monitor and act on ensures issues reach you, even when a third party caused them.',
      priority: 4
    },
    {
      icon: 'Shield',
      text: 'Review supplier accessibility performance at contract renewal.',
      detail: 'At renewal, assess each supplier against their accessibility obligations. Have there been complaints? Did they meet the standards in the contract? Are there patterns of failure? Use this data to decide whether to renew, renegotiate, or find an alternative supplier with stronger accessibility credentials.',
      priority: 5
    },
    {
      icon: 'AlertTriangle',
      text: 'Brief delivery partners specifically on accessible delivery practices.',
      detail: 'Delivery partners need to know: knock and wait (do not leave packages at a distance), communicate via the customer\'s preferred method (text, call, email), handle goods carefully for customers who cannot inspect on delivery, and offer flexible delivery windows for customers with support worker schedules.',
      priority: 6
    }
  ],

  howToCheck: {
    title: 'Auditing third-party accessibility standards',
    steps: [
      { text: 'Review your standard procurement contract or SLA template. Is there an accessibility clause? Does it specify requirements, not just aspirations?' },
      { text: 'List all current third-party providers (caterers, cleaners, transport, security, AV, maintenance, etc.). For each, check whether accessibility requirements were communicated at contract signing.' },
      { text: 'Check whether an accessibility briefing template exists for contractors and casual suppliers. When was it last used?' },
      { text: 'Review customer complaint records for the past 12 months. How many relate to third-party service accessibility? Were they resolved? Were suppliers notified?' },
      { text: 'Check whether accessibility performance is included in supplier performance reviews or scorecards.' },
      { text: 'Review the last three contract renewals. Was accessibility discussed or assessed as part of the renewal decision?' },
      { text: 'Ask 2-3 current suppliers whether they know your accessibility expectations. Can they describe what is required of them?' },
      { text: 'Check whether delivery partners have been briefed on accessible delivery practices.' }
    ],
    tools: ['Procurement contracts and SLAs', 'Supplier contact list', 'Customer complaint log', 'Supplier performance review records'],
    estimatedTime: '30-60 minutes'
  },

  standardsReference: {
    primary: {
      code: 'DDA',
      section: 'Section 24',
      requirement: 'It is unlawful to discriminate in the provision of goods, services, and facilities. This extends to services delivered by third parties on your behalf. You cannot outsource your DDA obligations.'
    },
    related: [
      { code: 'UNCRPD', relevance: 'Article 9: Accessibility obligations apply to services provided by private entities to the public, including through contractors and suppliers.' }
    ],
    plainEnglish: 'If a third party delivers a service on your behalf and that service discriminates against someone with disability, you are responsible. Setting accessibility standards for suppliers, verifying compliance, and acting on complaints protects your customers and your organisation.',
    complianceNote: 'The AHRC has found organisations liable for third-party accessibility failures in multiple conciliation outcomes. Including accessibility in contracts and actively managing supplier performance is the strongest defence.'
  },

  solutions: [
    {
      title: 'Accessibility briefing template for suppliers',
      description: 'Create a simple one-page accessibility briefing that all contractors and suppliers receive before starting work.',
      resourceLevel: 'low',
      costRange: '$0-200',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Draft a one-page accessibility briefing covering: venue accessible features, expected behaviours, emergency procedures, and contact for accessibility questions.',
        'Include a simple map showing accessible routes, toilets, and parking.',
        'Add a section on disability etiquette: offer assistance, do not assume, communicate respectfully.',
        'Distribute to all current contractors and include in onboarding for new suppliers.',
        'Keep copies at reception and loading dock for casual suppliers (caterers, AV, delivery).',
        'Review and update annually or when venue accessibility features change.'
      ]
    },
    {
      title: 'Vendor accessibility scorecard and contract clauses',
      description: 'Embed accessibility in procurement processes with standard contract clauses and a supplier assessment scorecard.',
      resourceLevel: 'medium',
      costRange: '$1,000-5,000',
      timeRequired: '1-2 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Draft a standard accessibility clause for inclusion in all procurement contracts and SLAs.',
        'Develop a vendor accessibility scorecard with 5-10 criteria (staff training, equipment accessibility, complaint handling, DDA awareness, etc.).',
        'Assess all current major suppliers against the scorecard.',
        'Include scorecard results in annual supplier performance reviews.',
        'Establish a customer feedback channel for third-party accessibility issues, monitored weekly.',
        'Add accessibility as a weighted criterion in tender evaluation for new contracts.',
        'Brief procurement staff on accessibility requirements and how to assess supplier capability.'
      ],
      notes: 'Start with your highest-risk suppliers (those with direct customer contact) and expand to all suppliers over 12 months.'
    },
    {
      title: 'Comprehensive supplier accessibility program',
      description: 'Formal program embedding accessibility across the full supplier lifecycle: procurement, onboarding, monitoring, and renewal.',
      resourceLevel: 'high',
      costRange: '$10,000-30,000',
      timeRequired: '2-3 months',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant to develop a supplier accessibility framework.',
        'Rewrite procurement templates to include mandatory accessibility requirements with measurable KPIs.',
        'Develop supplier onboarding program with accessibility training module (online, 30 minutes).',
        'Implement quarterly spot-check audits of supplier accessibility performance.',
        'Build a supplier accessibility dashboard tracking complaints, scores, and improvement trends.',
        'Include accessibility as a mandatory criterion in all tender evaluations (minimum 10% weighting).',
        'Create a preferred supplier list recognising suppliers with strong accessibility credentials.',
        'Conduct annual supplier accessibility summit sharing best practice and expectations.',
        'Integrate supplier accessibility data into DIAP reporting and board-level accessibility KPIs.'
      ],
      notes: 'A formal program signals market expectations and drives industry-wide improvement. Suppliers invest in accessibility when customers require it.'
    }
  ],

  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Event Organiser', scenario: 'Hired caterers who placed food tables at standing height only. Hired security who blocked wheelchair access to the VIP area. Multiple complaints.', solution: 'Created an event supplier accessibility briefing template. Added accessibility clauses to all supplier contracts. Required caterers to provide food at two heights. Briefed security on accessible entry requirements.', outcome: 'No accessibility complaints from supplier-delivered services in the following 6 months. Suppliers report clearer expectations.', cost: '$500', timeframe: '1 week' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Airport transfer partner consistently sent inaccessible vehicles despite requests. Guest complaints eroding the hotel\'s accessibility reputation.', solution: 'Added a mandatory wheelchair-accessible vehicle clause to the transfer contract. Switched to a partner with a verified accessible fleet. Implemented a pre-arrival confirmation process for accessible transfers.', outcome: 'Zero transfer complaints in 12 months. Guests specifically praise the accessible door-to-door experience.', cost: '$200', timeframe: '2 weeks' },
    { businessType: 'retail', businessTypeLabel: 'Shopping Centre', scenario: 'Cleaning contractor regularly blocked accessible toilets and ramps with equipment carts. No accountability mechanism.', solution: 'Included accessible route clearance in the cleaning contract with penalty clauses. Provided an accessibility briefing and accessible route map to all cleaning staff. Implemented monthly spot checks.', outcome: 'Route blockages eliminated. Cleaning contractor now trains their own staff on accessibility. Approach adopted by other centres managed by the same group.', cost: '$300', timeframe: '1 week' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Council outsourced library programs, pool management, and waste collection. No accessibility requirements in any contract. Complaints about inaccessible library events and pool staff who did not understand adaptive equipment.', solution: 'Developed a council-wide supplier accessibility framework with mandatory contract clauses, onboarding training, and annual performance reviews. Required all major suppliers to nominate an accessibility contact.', outcome: 'Supplier-related accessibility complaints reduced 70%. Council uses the framework as a model for neighbouring councils. Library program participation by people with disability doubled.', cost: '$15,000', timeframe: '3 months' }
  ],

  keywords: ['supplier', 'third-party', 'contractor', 'procurement', 'SLA', 'service level agreement', 'vendor', 'outsource', 'delivery partner', 'contract', 'briefing', 'DDA section 24']
},

// ─── Entry: Digital platform and franchise accessibility ───
{
  questionId: '5.6-PC-2',
  questionText: 'Do you assess the accessibility of third-party digital platforms used by your customers?',
  moduleCode: '5.6',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'operations-policy-procedure',
  title: 'Digital platform and franchise accessibility',
  coveredQuestionIds: ['5.6-D-1', '5.6-D-2', '5.6-D-6'],
  summary: 'When customers interact with your organisation through third-party booking platforms, franchise templates, procurement portals, or outsourced digital services, accessibility barriers in those platforms become your barriers. Assessing digital platforms for WCAG compliance, including accessibility in procurement criteria, and ensuring franchise or brand templates meet accessibility standards protects your customers and your brand.',
  lastUpdated: '2026-03-31',

  whyItMatters: {
    text: 'Digital platforms are increasingly the front door to your organisation. If a customer with vision impairment cannot complete a booking through your third-party reservation system, or a screen reader user cannot navigate your franchise website template, or a person with motor impairment cannot use the procurement portal to do business with you, the barrier is just as real as a step at your physical entrance. Many organisations assume their platform provider has handled accessibility, but most third-party platforms have significant WCAG gaps. The DDA applies to digital services, and you are responsible for the customer experience you offer, even when a third party built the platform.',
    statistic: {
      value: '96.3%',
      context: 'of the top one million websites have detectable WCAG 2.1 failures. Third-party platforms you rely on are very likely to have accessibility issues unless you specifically require and verify compliance.',
      source: 'WebAIM Million, 2024'
    },
    quote: {
      text: 'I tried to book a room through the hotel\'s online system. The date picker was completely inaccessible with my screen reader. I called the hotel and they said to just use the website. They had no idea their booking platform excluded blind people.',
      attribution: 'Screen reader user, accessibility complaint'
    }
  },

  tips: [
    {
      icon: 'Eye',
      text: 'Test key third-party platforms with a screen reader and keyboard-only navigation before signing a contract.',
      detail: 'Before committing to a booking platform, event registration system, or digital service, test it with NVDA (free screen reader) and keyboard-only navigation. Can a user complete the full workflow (search, select, pay, confirm) without a mouse? If not, the platform is not accessible. This 30-minute test can save months of complaints.',
      priority: 1
    },
    {
      icon: 'FileText',
      text: 'Request a VPAT or accessibility conformance report from every digital platform provider.',
      detail: 'A Voluntary Product Accessibility Template (VPAT) documents a product\'s WCAG conformance level. Ask for it during procurement. If the vendor cannot provide one, that is a red flag. Compare VPATs between competing products to choose the most accessible option.',
      priority: 2
    },
    {
      icon: 'ClipboardList',
      text: 'Include WCAG 2.1 AA conformance as a mandatory requirement in digital procurement.',
      detail: 'Add a standard clause to all digital procurement: "The platform must conform to WCAG 2.1 Level AA. The vendor must provide a current VPAT or accessibility conformance report and commit to remediating identified issues within agreed timeframes." Make it a weighted evaluation criterion, not just a checkbox.',
      priority: 3
    },
    {
      icon: 'Shield',
      text: 'Audit franchise or brand website templates for WCAG compliance before distributing to franchisees.',
      detail: 'If you provide website templates, booking widgets, or digital assets to franchisees or partner businesses, test them for WCAG 2.1 AA compliance first. Every franchisee site that uses your inaccessible template multiplies the barrier. Fix the template once and every site benefits.',
      priority: 4
    },
    {
      icon: 'AlertTriangle',
      text: 'Provide an accessible alternative when a third-party platform is not accessible.',
      detail: 'While working with the vendor to fix accessibility issues, offer an alternative: phone booking, email, or an accessible form on your own website. Publish this alternative prominently so customers who encounter barriers know how to complete their transaction.',
      priority: 5
    }
  ],

  howToCheck: {
    title: 'Auditing digital platform and franchise accessibility',
    steps: [
      { text: 'List all third-party digital platforms your customers use: booking systems, event registration, payment portals, loyalty apps, franchise websites, etc.' },
      { text: 'For each platform, check: does a current VPAT or accessibility conformance report exist? Request it from the vendor if not.' },
      { text: 'Test the most critical customer-facing platform with keyboard-only navigation. Can you complete the full workflow (search, select, pay, confirm) without a mouse?' },
      { text: 'Test the same platform with a screen reader (NVDA is free). Can you complete the full workflow? Are form labels, buttons, and error messages announced correctly?' },
      { text: 'Run an automated accessibility scan (axe DevTools browser extension, free) on the platform. Note the number and severity of issues found.' },
      { text: 'Review your digital procurement contracts. Do any include WCAG conformance requirements? If so, have they been verified?' },
      { text: 'If you distribute franchise or brand templates, test one franchisee site built from the template against WCAG 2.1 AA.' },
      { text: 'Check whether an accessible alternative (phone, email, accessible form) is published for any platform with known accessibility issues.' }
    ],
    tools: ['NVDA screen reader (free download)', 'axe DevTools browser extension (free)', 'Keyboard (no mouse)', 'VPAT documents from vendors', 'WCAG 2.1 AA checklist'],
    estimatedTime: '1-2 hours'
  },

  standardsReference: {
    primary: {
      code: 'WCAG2.1-AA',
      section: 'All success criteria',
      requirement: 'WCAG 2.1 Level AA is the accepted standard for web accessibility in Australia. All customer-facing digital platforms, whether built in-house or provided by third parties, should conform to this standard.'
    },
    related: [
      { code: 'DDA', relevance: 'Section 24: Digital services provided to the public are covered. The DDA applies to websites, apps, and digital platforms regardless of who built or hosts them.' }
    ],
    plainEnglish: 'Digital platforms your customers use must be accessible. This means they work with screen readers, keyboard navigation, and assistive technology. Ask vendors for proof of accessibility (VPAT), test platforms yourself, and include accessibility in contracts.',
    complianceNote: 'The AHRC has accepted complaints about inaccessible third-party platforms used by Australian organisations. The organisation offering the service to customers is responsible for the platform\'s accessibility, not just the vendor who built it.'
  },

  solutions: [
    {
      title: 'Test key platforms and request VPATs',
      description: 'Conduct basic accessibility testing of your most critical customer-facing platforms and request conformance documentation from vendors.',
      resourceLevel: 'low',
      costRange: '$0-500',
      timeRequired: '2-4 hours',
      implementedBy: 'staff',
      impact: 'quick-win',
      steps: [
        'Identify your top 3 customer-facing digital platforms (booking, registration, payment).',
        'Test each with keyboard-only navigation: tab through the full workflow and note any barriers.',
        'Run the axe DevTools browser extension on each platform and export the report.',
        'Email each vendor requesting a current VPAT or accessibility conformance report.',
        'If critical barriers are found, publish an accessible alternative (phone number, email, accessible form) on your website immediately.',
        'Document findings and share with your procurement team for future contract discussions.'
      ]
    },
    {
      title: 'Accessibility requirements in procurement and platform audit',
      description: 'Embed WCAG requirements in procurement processes and conduct a structured audit of all customer-facing platforms.',
      resourceLevel: 'medium',
      costRange: '$2,000-10,000',
      timeRequired: '2-4 weeks',
      implementedBy: 'staff',
      impact: 'moderate',
      steps: [
        'Draft a standard digital accessibility clause for all procurement contracts requiring WCAG 2.1 AA conformance, VPAT provision, and remediation commitments.',
        'Conduct a structured accessibility audit of all customer-facing platforms using a WCAG 2.1 AA checklist.',
        'Engage a screen reader user (paid tester or disability organisation) to test the most critical platform end-to-end.',
        'Score each platform and prioritise remediation based on customer impact and contract timing.',
        'Negotiate accessibility remediation plans with vendors of non-conformant platforms.',
        'If distributing franchise templates, commission a WCAG audit of the template and fix all Level A and AA failures.',
        'Add digital accessibility to the agenda of quarterly vendor performance reviews.'
      ],
      notes: 'Testing with real assistive technology users reveals issues that automated tools miss. Budget for paid user testing alongside automated scanning.'
    },
    {
      title: 'WCAG-compliant platform procurement program',
      description: 'Formal program ensuring all digital platforms meet WCAG 2.1 AA, with ongoing monitoring, vendor accountability, and franchise template governance.',
      resourceLevel: 'high',
      costRange: '$15,000-50,000',
      timeRequired: '2-3 months',
      implementedBy: 'specialist',
      impact: 'significant',
      steps: [
        'Engage an accessibility consultant to develop a digital procurement accessibility framework.',
        'Mandate WCAG 2.1 AA conformance in all new digital procurement with minimum 15% weighting in tender evaluation.',
        'Commission independent WCAG audits of all current customer-facing platforms.',
        'Negotiate remediation roadmaps with vendors of non-conformant platforms, with contractual deadlines.',
        'Establish annual WCAG re-certification requirement for all digital platform vendors.',
        'If operating a franchise model, develop an accessible website template and require all franchisees to use it.',
        'Implement continuous monitoring using automated accessibility scanning tools (e.g., Siteimprove, Level Access) across all platforms.',
        'Create a digital accessibility register tracking conformance status, VPAT dates, and remediation progress for all platforms.',
        'Report digital platform accessibility status in DIAP progress reports.'
      ],
      notes: 'Continuous monitoring tools cost $5,000-20,000 per year but catch regressions introduced by platform updates. Essential for organisations with many digital touchpoints.'
    }
  ],

  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hospitality Group', scenario: 'Booking engine provided by a major platform vendor was inaccessible to screen reader users. Complaints from blind travellers.', solution: 'Requested VPAT from vendor (none existed). Tested with NVDA and documented 23 WCAG failures. Negotiated a remediation plan in the contract renewal. Published phone booking alternative immediately.', outcome: 'Vendor fixed critical issues within 3 months. Phone bookings from customers with disability handled smoothly in the interim. Group now requires VPATs from all digital vendors.', cost: '$2,000', timeframe: '3 months' },
    { businessType: 'event-venue', businessTypeLabel: 'Event Venue', scenario: 'Third-party event registration platform had an inaccessible date picker and payment form. Attendees with disability could not register online.', solution: 'Tested three alternative platforms and selected the most accessible. Added WCAG 2.1 AA requirement to the new contract. Published an accessible registration form on the venue website as a backup.', outcome: 'Online registration accessible to all. No more registration complaints. New platform vendor provides annual VPAT updates.', cost: '$500 (testing time)', timeframe: '2 weeks' },
    { businessType: 'retail', businessTypeLabel: 'Franchise', scenario: 'Franchise website template provided to 50 locations had missing alt text, no keyboard navigation, and poor colour contrast. Every franchisee site was inaccessible.', solution: 'Commissioned a WCAG audit of the template. Fixed 35 issues in the core template. Pushed the updated template to all franchisee sites. Added WCAG compliance to the franchise agreement.', outcome: 'All 50 franchise websites now meet WCAG 2.1 AA baseline. Customer complaints about website accessibility dropped to zero.', cost: '$8,000', timeframe: '4 weeks' },
    { businessType: 'attraction', businessTypeLabel: 'Tourism Operator', scenario: 'Used three different third-party platforms: booking, reviews, and loyalty. None had been assessed for accessibility.', solution: 'Tested all three with keyboard and screen reader. Requested VPATs. Found the loyalty platform was the worst offender. Switched loyalty platforms and negotiated remediation plans for the other two.', outcome: 'All customer-facing digital touchpoints now assessed. Accessibility included in annual vendor review for all three platforms.', cost: '$3,000', timeframe: '1 month' }
  ],

  keywords: ['digital accessibility', 'WCAG', 'VPAT', 'booking platform', 'franchise', 'procurement', 'screen reader', 'keyboard navigation', 'third-party platform', 'vendor', 'template', 'DDA section 24']
},

// ─── Module 5.7: Inclusive Job Design & Advertising ───
{
  questionId: '5.7-PC-1',
  questionText: 'Inclusive job design and advertising',
  moduleCode: '5.7',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Inclusive job design and advertising',
  coveredQuestionIds: ['5.7-PC-2', '5.7-PC-3', '5.7-PC-4', '5.7-PC-5', '5.7-PC-6'],
  summary: 'The way roles are designed and advertised determines who applies. Inherent requirements, plain language, named access statements, specialist channels, accessible application systems, and authentic employer branding together broaden who sees the role as "for them."',
  lastUpdated: '2026-04-14',
  whyItMatters: {
    text: 'Access Compass positions inclusive recruitment as part of whole-of-organisation accessibility, across education, health & wellness, retail, tourism, local government, events, and venues. For deep organisation-wide workforce transformation programs, specialist providers like the Australian Disability Network are a natural pair.',
    statistic: { value: '48%', context: 'of Australians with disability are in the labour force, compared to 80% of those without disability. Most of the gap is recruitment practice, not capability.', source: 'Australian Bureau of Statistics' },
  },
  tips: [
    { icon: 'FileText', text: 'Separate inherent requirements from preferences on every job description.', priority: 1 },
    { icon: 'MessageSquare', text: 'Write ads at grade 8 reading level and disclose salary range.', priority: 2 },
    { icon: 'UserCheck', text: 'Name a real contact person in the access statement, offer specific formats.', priority: 3 },
    { icon: 'Network', text: 'Partner with at least one DES provider or disability-led network.', priority: 4 },
    { icon: 'Keyboard', text: 'Test your ATS with screen reader and keyboard only.', priority: 5 },
    { icon: 'Camera', text: 'Feature Disabled staff authentically in careers content (paid, consensual).', priority: 6 },
  ],
  howToCheck: {
    title: 'Auditing recruitment inclusion',
    steps: [
      { text: 'Pull 3 recent job ads. Count inherent-vs-preferred requirements.' },
      { text: 'Run readability check on ad copy. Confirm salary disclosed.' },
      { text: 'Check access statement — is a real person named with multiple contact methods?' },
      { text: 'Attempt to complete an application with only a keyboard and a screen reader.' },
      { text: 'Review careers page for representation (photos, stories, testimonials).' },
      { text: 'Check advertising channels used in the last 12 months — any specialist channels?' },
    ],
    estimatedTime: '2-3 hours',
  },
  solutions: [
    {
      title: 'Ad template refresh',
      description: 'Update job ad templates with plain language, salary disclosure, and named-contact access statement.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1 day', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Pull existing templates.', 'Apply inherent-vs-preferred filter.', 'Rewrite in plain language.', 'Add salary range and access statement.', 'Pilot on next 3 ads and measure applicant diversity.'],
    },
    {
      title: 'Recruitment process co-design',
      description: 'Redesign the full recruitment journey with input from Disabled employees or external advisors.',
      resourceLevel: 'medium', costRange: '$3,000-8,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Audit the current journey stage-by-stage.', 'Engage Disabled advisors (paid).', 'Test ATS accessibility.', 'Redesign templates, process, and employer brand.', 'Train hiring managers on new practice.', 'Publish updated recruitment commitment.'],
    },
    {
      title: 'Specialist partnership program',
      description: 'Build ongoing relationships with DES providers and disability-led networks.',
      resourceLevel: 'medium', costRange: '$2,000-5,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Identify 2-3 providers relevant to your sector.', 'Meet and brief them on typical roles.', 'Establish a pre-advertising brief cadence.', 'Consider a paid internship or traineeship pathway.', 'Review partnerships annually.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Festival', scenario: 'Seasonal hiring of 80+ FOH, box office, and production crew. Low disability disclosure among applicants despite stated inclusion commitment.', solution: 'Rewrote ad templates (plain language, salary disclosed, named access contact). Partnered with sector Disabled People\'s Organisations. Added paid 4-hour work trial as alternative to second-round panel.', outcome: 'Disclosure rate at application up 3x. Two new crew hires through disability-led network. Retention at end of season +15%.', cost: '$3,000', timeframe: '2 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Recruiting library, community centre, and customer service staff. ATS was unreliable for screen reader users.', solution: 'Council procured VPAT from ATS vendor, found 14 critical failures. Added email alternative on every ad. Briefed all hiring panels on adjustments. Began CV-blind shortlisting for customer roles.', outcome: 'Applications from disabled candidates up. Council cited as inclusion leader by peer councils.', cost: '$5,000', timeframe: '3 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Allied Health Clinic', scenario: 'Small clinic hiring reception and admin staff. No formal recruitment process.', solution: 'Adopted AC module templates. Used plain-language ads. Partnered with a local DES provider for one role. Offered phone interview option.', outcome: 'First disabled hire in clinic\'s history. Process now standard.', cost: '$500', timeframe: '1 month' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'High turnover in customer-facing roles. Generic EEO statement but no specific access offer.', solution: 'Rolled out named-contact access statement across all job ads. Added to hiring manager training. Began tracking disclosure at application.', outcome: 'Applicant disclosure up. Feedback to HR: "The named contact made me feel safe to ask."', cost: '$1,500', timeframe: '6 weeks' },
  ],
  resources: [
    { title: 'JobAccess - Employment Assistance Fund', url: 'https://www.jobaccess.gov.au/employment-assistance-fund-eaf', type: 'website', source: 'Australian Government', description: 'Free funding for workplace adjustments including assistive tech, Auslan, and modifications.', isAustralian: true, isFree: true },
    { title: 'JobAccess - Attracting and recruiting people with disability', url: 'https://www.jobaccess.gov.au/employers/attracting-recruiting-people-disability', type: 'guide', source: 'Australian Government', description: 'Free government guide covering job design, advertising, and inclusive recruitment.', isAustralian: true, isFree: true },
    { title: 'Australian Human Rights Commission - Employers', url: 'https://humanrights.gov.au/our-work/employers', type: 'guide', source: 'AHRC', description: 'AHRC employer guidance on inclusive hiring and DDA compliance.', isAustralian: true, isFree: true },
    { title: 'IncludeAbility', url: 'https://includeability.gov.au/', type: 'website', source: 'AHRC', description: 'National initiative with tools, resources, and employer case studies.', isAustralian: true, isFree: true },
  ],
  keywords: ['recruitment', 'job ads', 'ATS', 'inherent requirements', 'access statement', 'DES', 'JobAccess', 'inclusive hiring', 'employer branding'],
},

{
  questionId: '5.7-DD-1',
  questionText: 'Recruitment governance, role design, and pipeline partnerships',
  moduleCode: '5.7',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Recruitment governance, role design, and pipeline partnerships',
  coveredQuestionIds: ['5.7-DD-2', '5.7-DD-5', '5.7-DD-6', '5.7-DD-9'],
  summary: 'Inclusive recruitment is built upstream. Clear sign-off on inherent requirements, default consideration of flexible arrangements, briefed external recruiters, consistent standards across all worker types, and ongoing pipeline partnerships make inclusion structural rather than incidental.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Without governance, inherent requirements drift back toward how the role used to be done. Without flexible arrangements considered upfront, full-time defaults exclude people who could thrive part-time. Without briefed external recruiters, your access standards stop at the agency door. Pipeline partnerships build the long-term candidate flow that one-off ads cannot.',
    statistic: { value: '53%', context: 'of Australians with disability in the labour force work part-time, compared to 32% of those without disability. Roles only advertised as full-time exclude this workforce by default.', source: 'Australian Bureau of Statistics' },
  },
  tips: [
    { icon: 'ShieldCheck', text: 'Name a sign-off owner for inherent requirements before any role is advertised.', priority: 1 },
    { icon: 'Clock', text: 'Default to considering part-time, job-share, and flexible options for every role.', priority: 2 },
    { icon: 'Briefcase', text: 'Brief recruitment agencies on your access statement, formats, and selection standards.', priority: 3 },
    { icon: 'Users', text: 'Apply the same accessibility standards to volunteers, casuals, and interns.', priority: 4 },
    { icon: 'Handshake', text: 'Build at least one ongoing pipeline partnership with a Disabled-led network or DES provider.', priority: 5 },
  ],
  howToCheck: {
    title: 'Auditing recruitment upstream practice',
    steps: [
      { text: 'Identify who currently signs off on inherent requirements. Is it a named role or an ad-hoc decision?' },
      { text: 'Pull last 10 ads. Count how many considered flexible arrangements before being posted.' },
      { text: 'Ask your top 2 external recruiters to quote your access statement back to you. Can they?' },
      { text: 'Compare your latest casual or volunteer role ads against your permanent role standards.' },
      { text: 'List active pipeline partnerships. Confirm they include disability-led or specialist providers.' },
    ],
    estimatedTime: '2 hours',
  },
  solutions: [
    {
      title: 'Inherent requirements sign-off',
      description: 'Establish a quick governance step where inherent requirements are signed off before advertising.',
      resourceLevel: 'low', costRange: '$0-1,000', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Name an owner (HR Lead, Director, or DEI Champion).', 'Add a one-page checklist to the role-creation form.', 'Pilot on next 5 roles.', 'Refine and roll out.'],
    },
    {
      title: 'Flexible-by-default policy',
      description: 'Adopt a written policy that all roles are considered for flexible arrangements before being advertised as full-time only.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Draft a flexible work principle statement.', 'Update role-creation templates to include the consideration.', 'Train hiring managers on options (part-time, job-share, compressed week).', 'Track outcomes annually.', 'Publish in DIAP and careers content.'],
    },
    {
      title: 'External recruiter charter',
      description: 'Brief and charter all external recruitment partners to your access standards.',
      resourceLevel: 'low', costRange: '$1,000-3,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Document your access standards in a one-page brief.', 'Include access statement template, format alternatives, and panel expectations.', 'Brief all current external partners.', 'Add to procurement requirements for new partners.', 'Audit compliance annually.'],
    },
    {
      title: 'Disability pipeline partnerships',
      description: 'Build sustained partnerships with Disabled-led organisations, DES providers, or specialist programs.',
      resourceLevel: 'medium', costRange: '$3,000-12,000/year', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Identify 2-3 partners aligned to your sector and roles.', 'Establish a regular brief cadence.', 'Co-design a paid traineeship or internship pathway.', 'Allocate recurring budget.', 'Review outcomes annually with partners.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Theatre Company', scenario: 'Production manager role advertised full-time only for years. No applications from carers or part-time-seeking applicants.', solution: 'Reframed as 0.8 FTE with job-share open. Two strong applicants applied; hired one carer who works flexibly around school hours.', outcome: 'Role filled in 3 weeks (previous searches took 3 months). Approach now standard.', cost: '$0', timeframe: 'Next vacancy' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'External recruiter advertised council roles using stock templates that excluded the access statement.', solution: 'Council issued a one-page partner brief. Required confirmation that briefs included access statement and named contact. Audited next 3 ads.', outcome: 'Compliance verified. Two disabled applicants progressed via the agency where none had previously.', cost: '$1,200', timeframe: '6 weeks' },
    { businessType: 'health-wellness', businessTypeLabel: 'Allied Health Network', scenario: 'No formal pipeline partnership. Disability hire was 2% over 3 years.', solution: 'Partnered with a state DES provider and a Disabled-led graduate program. Ran 2 paid clinical internships in year one.', outcome: 'One intern hired permanently. Pipeline built for ongoing recruitment.', cost: '$8,000/year', timeframe: '12 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Casual ads were generic, no access statement, while permanent ads carried the full inclusion language.', solution: 'Standardised all worker-type ads to the same access standard. Updated casual templates first; rolled out to volunteer next.', outcome: 'Disclosure rate at application equalised across worker types within 6 months.', cost: '$500', timeframe: '2 months' },
  ],
  resources: [
    { title: 'JobAccess - Employer Toolkit', url: 'https://www.jobaccess.gov.au/employers', type: 'website', source: 'Australian Government', description: 'Resources on inclusive recruitment, role design, and inherent requirements.', isAustralian: true, isFree: true },
    { title: 'Fair Work Ombudsman - Flexible Working', url: 'https://www.fairwork.gov.au/employment-conditions/flexibility-in-the-workplace/flexible-working-arrangements', type: 'guide', source: 'Fair Work Ombudsman', description: 'Right to request flexible work and employer obligations.', isAustralian: true, isFree: true },
    { title: 'IncludeAbility - Pathway Programs', url: 'https://includeability.gov.au/', type: 'website', source: 'AHRC', description: 'Examples and toolkits for traineeship and internship pipelines.', isAustralian: true, isFree: true },
    { title: 'DES Provider Locator', url: 'https://jobsearch.gov.au/serviceproviders', type: 'tool', source: 'Australian Government', description: 'Locate DES providers in your area for partnership.', isAustralian: true, isFree: true },
  ],
  keywords: ['governance', 'inherent requirements', 'flexible work', 'job share', 'recruitment agency', 'volunteer', 'casual', 'pipeline', 'traineeship', 'internship', 'DES partnership'],
},

{
  questionId: '5.7-DD-3',
  questionText: 'Inclusive recruitment reach, accessibility, and measurement',
  moduleCode: '5.7',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Inclusive recruitment reach, accessibility, and measurement',
  coveredQuestionIds: ['5.7-DD-4', '5.7-DD-7', '5.7-DD-8'],
  summary: 'Reaching disabled candidates means offering ads in alternative formats, removing bias from shortlisting, measuring diversity at each funnel stage, and keeping careers content accessible. Without measurement you cannot know whether your changes work.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Inclusive intent without measurement is hard to defend or improve. Tracking applicant disclosure, shortlist composition, and offer rates by stage shows where the funnel still leaks. Alternative formats and accessible careers content open the funnel in the first place.',
    quote: { text: 'I had to apply through a screen reader. Their PDF application form was an unusable image. I gave up at stage one. They never knew they lost me.', attribution: 'Blind candidate, sector unspecified' },
  },
  tips: [
    { icon: 'FileText', text: 'Offer ads in Easy Read, audio, plain text, and Auslan video on request.', priority: 1 },
    { icon: 'EyeOff', text: 'Pilot CV-blind or name-blind shortlisting on at least one role per quarter.', priority: 2 },
    { icon: 'BarChart3', text: 'Measure disclosure, shortlist, and offer rates against labour market benchmarks.', priority: 3 },
    { icon: 'Globe', text: 'Audit careers page, employer-brand video, and testimonial content against WCAG 2.2 AA annually.', priority: 4 },
  ],
  howToCheck: {
    title: 'Auditing recruitment reach and accessibility',
    steps: [
      { text: 'Try requesting an alternative format from your own ad. Can you?' },
      { text: 'Run an automated WCAG check on your careers page (WAVE or axe DevTools).' },
      { text: 'Pull 12 months of recruitment data: disclosure rate, shortlist composition, offer rate.' },
      { text: 'Compare your applicant disclosure rate to the ABS labour-force benchmark for your sector.' },
      { text: 'Manually test your application form with a screen reader and keyboard only.' },
    ],
    estimatedTime: '3-4 hours',
  },
  solutions: [
    {
      title: 'Alternative format provision',
      description: 'Set up a low-friction process for offering ads in Easy Read, audio, plain text, and Auslan formats.',
      resourceLevel: 'low', costRange: '$1,000-3,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add "available in Easy Read, plain text, audio, or Auslan video on request" to access statements.', 'Identify a provider for on-demand alternative formats.', 'Create plain-text version of all ad templates.', 'Track requests to right-size capacity.'],
    },
    {
      title: 'Bias-aware shortlisting',
      description: 'Pilot CV-blind or name-blind shortlisting on selected roles.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Choose 1-2 role types to pilot.', 'Strip identifying info from CVs before panel review.', 'Compare shortlists with and without redaction.', 'Decide which role types to expand to permanently.', 'Brief panels on what is hidden and why.'],
    },
    {
      title: 'Recruitment measurement framework',
      description: 'Build a recruitment funnel dashboard segmented by disclosure status.',
      resourceLevel: 'medium', costRange: '$3,000-8,000', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Add voluntary disclosure to ATS or HRIS.', 'Build dashboard: applicants, shortlist, interview, offer, hire by disclosure.', 'Compare to ABS sector benchmarks.', 'Review quarterly with hiring leadership.', 'Publish headline metrics in DIAP.'],
    },
    {
      title: 'Careers content WCAG audit',
      description: 'Annual audit of careers page, employer brand video, and testimonials against WCAG 2.2 AA.',
      resourceLevel: 'medium', costRange: '$2,000-6,000', timeRequired: '1-2 months', implementedBy: 'specialist', impact: 'moderate',
      steps: ['Engage a digital accessibility auditor.', 'Test page, video captions, transcripts, alt text.', 'Fix critical issues within 30 days.', 'Set new content WCAG 2.2 AA acceptance criteria.', 'Repeat annually.'],
    },
  ],
  examples: [
    { businessType: 'tour-operator', businessTypeLabel: 'Tourism Operator', scenario: 'Strong inclusion language but careers page used image-only PDFs and inaccessible video carousel.', solution: 'Audited and rebuilt careers page to WCAG 2.2 AA. Added captions and transcripts to all videos. Offered Easy Read summary of major roles.', outcome: 'Application completion rate up 22%. Disabled applicant disclosure tripled in 6 months.', cost: '$5,500', timeframe: '3 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'No measurement of recruitment funnel by disclosure status. Could not answer "are we improving?"', solution: 'Built quarterly recruitment dashboard segmented by disclosure. Compared to ABS labour-force benchmarks for council sector.', outcome: 'Identified offer-stage bias. Targeted panel training and language review. Offer-stage gap closed in 12 months.', cost: '$4,000', timeframe: '6 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Service', scenario: 'CV-blind not used; panels admitted name-based assumptions in debrief.', solution: 'Piloted CV-blind shortlisting on 4 graduate roles. Compared shortlists pre and post redaction.', outcome: 'Shortlisted candidate diversity widened by 30%. Process now standard for entry-level recruitment.', cost: '$1,500', timeframe: '4 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Easy Read job ads requested by a candidate; HR had no way to produce one.', solution: 'Engaged an Easy Read consultancy to produce ad templates. Added "available in Easy Read on request" to access statements.', outcome: 'Three Easy Read requests in year one. One hire who would not have applied otherwise.', cost: '$2,500', timeframe: '2 months' },
  ],
  resources: [
    { title: 'JobAccess - Recruiting and Hiring', url: 'https://www.jobaccess.gov.au/employers/attracting-recruiting-people-disability', type: 'guide', source: 'Australian Government', description: 'Free guidance on inclusive recruitment practices and measurement.', isAustralian: true, isFree: true },
    { title: 'Inclusion Australia - Easy Read', url: 'https://www.inclusionaustralia.org.au/easy-read/', type: 'guide', source: 'Inclusion Australia', description: 'Easy Read principles, examples, and provider listing.', isAustralian: true, isFree: true },
    { title: 'WAVE Web Accessibility Tool', url: 'https://wave.webaim.org/', type: 'tool', source: 'WebAIM', description: 'Free WCAG checker for careers pages and online forms.', isAustralian: false, isFree: true },
    { title: 'ABS Disability and Labour Force', url: 'https://www.abs.gov.au/statistics/people/people-with-disability/disability-ageing-and-carers-australia-summary-findings', type: 'website', source: 'Australian Bureau of Statistics', description: 'Labour-force participation benchmarks for sector comparison.', isAustralian: true, isFree: true },
  ],
  keywords: ['alternative formats', 'Easy Read', 'Auslan', 'CV-blind', 'name-blind', 'shortlisting', 'measurement', 'WCAG 2.2', 'careers page', 'disclosure rate'],
},

// ─── Module 5.8: Accessible Interviews & Selection ───
{
  questionId: '5.8-PC-1',
  questionText: 'Accessible interviews and selection',
  moduleCode: '5.8',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Accessible interviews and selection',
  coveredQuestionIds: ['5.8-PC-2', '5.8-PC-3', '5.8-PC-4', '5.8-PC-5', '5.8-PC-6'],
  summary: 'Default adjustments (questions in advance, format choice, confirmed venue access) give every candidate a fair shot without requiring disclosure. Trained panels and alternative assessment paths match the process to the role.',
  lastUpdated: '2026-04-14',
  whyItMatters: {
    text: 'Interview processes are where many recruitment journeys quietly fail for candidates with disability. The good news: most fixes are free or low cost — they require process change, not budget. Embedding interview inclusion into your whole-of-organisation practice keeps it consistent regardless of who is hiring.',
    quote: { text: 'I had interviewed five times at other places. Access Compass-aligned employers were the first to send questions in advance. I got the offer.', attribution: 'Autistic candidate, regional council hire' },
  },
  tips: [
    { icon: 'Send', text: 'Send interview questions 24-48 hours in advance as default.', priority: 1 },
    { icon: 'Video', text: 'Offer at least three interview formats (in-person, video, phone, written).', priority: 2 },
    { icon: 'MapPin', text: 'Pre-audit and confirm venue access before inviting candidates.', priority: 3 },
    { icon: 'GraduationCap', text: 'Train all panel members in disability-confident interviewing.', priority: 4 },
    { icon: 'Briefcase', text: 'Offer paid work trials or portfolio reviews as fair alternatives.', priority: 5 },
    { icon: 'BarChart', text: 'Track candidate drop-off by disclosure status at each stage.', priority: 6 },
  ],
  solutions: [
    {
      title: 'Interview SOP update',
      description: 'Update the interview standard operating procedure to embed default adjustments.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1 day', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Document: questions in advance, format choice, venue access check, adjustment check-in.', 'Add to hiring manager checklist.', 'Update interview invitation templates.', 'Brief all current hiring managers.'],
    },
    {
      title: 'Panel training program',
      description: 'Run disability-confident interviewing training for all panel members.',
      resourceLevel: 'medium', costRange: '$3,000-8,000', timeRequired: '2-3 months', implementedBy: 'specialist', impact: 'moderate',
      steps: ['Source a training provider (JobAccess, Scope Australia, state disability employment body, or disability-led consultant).', 'Schedule for all existing panel members.', 'Add to onboarding for new managers.', 'Set 2-year refresh cadence.', 'Test through scenario roleplays.'],
    },
    {
      title: 'Alternative assessment design',
      description: 'Design and pilot work trials, portfolio reviews, or scenario tasks for roles where panels are a weak signal.',
      resourceLevel: 'medium', costRange: '$2,000-6,000', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Identify 2-3 roles where interviews under-predict performance.', 'Co-design alternative with current role holders.', 'Pilot with next 3 vacancies.', 'Compare hire quality and retention.', 'Expand to more roles if successful.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Festival', scenario: 'Box office hiring — quick selection, high volume, varied candidate communication styles.', solution: 'Switched to paid 2-hour work trial at a preview event. Shortlisted 6, trialled 3, hired 2. All candidates paid, trial structured against role criteria.', outcome: 'Hired two candidates including one with anxiety disorder who had interviewed poorly. Both became season MVPs.', cost: '$600 (trial wages)', timeframe: 'Immediate' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Community services manager role. Three-round panel process. Disabled applicants consistently dropped off between round 1 and 2.', solution: 'Root cause: round 2 used stress-testing questions without prep time. Switched to structured questions sent in advance. Added scenario-based written task as an alternative to in-person round 2.', outcome: 'Drop-off between rounds equalised across disclosure status. New hire: disabled candidate who had been rejected from earlier round.', cost: '$0', timeframe: 'Next hiring cycle' },
    { businessType: 'health-wellness', businessTypeLabel: 'Allied Health Clinic', scenario: 'Interview venue was up two flights of stairs with no lift. No one noticed until a wheelchair-using candidate asked.', solution: 'Added venue access check to hiring checklist. Reserved ground-floor meeting room for all interviews. Added access info to invite emails by default.', outcome: 'No more last-minute venue problems. Candidate retention into employment improved.', cost: '$0', timeframe: 'Immediate' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Store manager role. Untrained regional panel asked an applicant "how would you manage your condition?"', solution: 'Rolled out panel training nationally. Documented lawful/unlawful question guide. Added compliance to hiring manager KPIs.', outcome: 'Zero discriminatory-question complaints since. Legal risk reduced.', cost: '$6,000', timeframe: '3 months' },
  ],
  resources: [
    { title: 'JobAccess - Inclusive Interviews and Selection', url: 'https://www.jobaccess.gov.au/employers/attracting-recruiting-people-disability', type: 'guide', source: 'Australian Government', description: 'Government guidance on interview adjustments, lawful questioning, and fair selection.', isAustralian: true, isFree: true },
    { title: 'AHRC - Disability Rights and Employment', url: 'https://humanrights.gov.au/our-work/disability-rights/employment', type: 'guide', source: 'AHRC', description: 'Legal framework and best-practice interview and selection guidance.', isAustralian: true, isFree: true },
    { title: 'IncludeAbility - Employer Resources', url: 'https://includeability.gov.au/resources-employers', type: 'website', source: 'AHRC', description: 'Practical interview and assessment resources with employer case studies.', isAustralian: true, isFree: true },
  ],
  keywords: ['interviews', 'selection', 'panel', 'work trial', 'adjustments', 'questions in advance', 'format choice', 'disclosure'],
},

{
  questionId: '5.8-DD-1',
  questionText: 'Selection process design and assessment fairness',
  moduleCode: '5.8',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Selection process design and assessment fairness',
  coveredQuestionIds: ['5.8-DD-2', '5.8-DD-3', '5.8-DD-4'],
  summary: 'Fair selection requires structured rubrics with behavioural anchors, sensory-checked interview environments, default break flexibility, and bias-audited assessment tools. Together these reduce reliance on panel "feel" that often disadvantages candidates with disability.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Unstructured interviews and unaudited assessment tools are where disability bias most often hides in selection. Structured rubrics make ratings defensible. Sensory-checked environments stop the room itself from being a barrier. Break flexibility removes a hidden cost on candidates who fatigue or process differently.',
    statistic: { value: '3x', context: 'increase in predictive validity when interviews are structured (defined questions, behavioural rubrics) compared to unstructured panels.', source: 'Decades of meta-analytic research on selection methods' },
  },
  tips: [
    { icon: 'ListChecks', text: 'Use structured scoring rubrics with defined behavioural anchors for every interview question.', priority: 1 },
    { icon: 'Sun', text: 'Pre-check the room or platform for lighting, noise, captions, and camera framing.', priority: 2 },
    { icon: 'Pause', text: 'Offer break flexibility (pause, extended time, multi-session) by default.', priority: 3 },
    { icon: 'AlertTriangle', text: 'Audit psychometric and cognitive tools for disability bias before use.', priority: 4 },
  ],
  howToCheck: {
    title: 'Auditing selection process design',
    steps: [
      { text: 'Pull the last 3 panel scoresheets. Are scores anchored to behaviours, or just gut numbers?' },
      { text: 'Walk through your interview venue or video platform. Score lighting, noise, glare, and platform captions.' },
      { text: 'Check your interview invitation. Does it offer breaks proactively, or only on request?' },
      { text: 'List all assessment tools used in the last 12 months. For each, has the vendor provided a bias audit or accessibility statement?' },
    ],
    estimatedTime: '2-3 hours',
  },
  solutions: [
    {
      title: 'Structured rubric rollout',
      description: 'Build behavioural-anchor rubrics for all interview questions and train panels.',
      resourceLevel: 'low', costRange: '$500-3,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Develop rubric template with 1-5 anchors per question.', 'Pilot on next 3 hires.', 'Train all panel members on use.', 'Audit panel ratings vs hire outcomes after 6 months.'],
    },
    {
      title: 'Interview environment audit',
      description: 'Standardise sensory-checked interview rooms and video platforms.',
      resourceLevel: 'low', costRange: '$0-1,500', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Identify 1-2 reserved rooms with controlled lighting and low noise.', 'Test default video platform for captions, screen-reader, and keyboard nav.', 'Document the standard in a one-page checklist.', 'Add to interview booking process.'],
    },
    {
      title: 'Default break flexibility',
      description: 'Build break flexibility into all interview invitations and assessments.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Update invitation templates: "We offer breaks, extended time, or multi-session formats. Tell us what works for you."', 'Train panels to honour requests without questioning them.', 'Build buffer time into scheduling.', 'Track uptake to right-size capacity.'],
    },
    {
      title: 'Assessment tool bias audit',
      description: 'Audit all psychometric, cognitive, and technical assessments for disability bias.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['List every tool in use. Request vendor documentation on disability validation.', 'Engage an organisational psychologist or accessibility consultant.', 'Replace or modify tools that fail audit.', 'Document the standard for new tool selection.', 'Re-audit annually.'],
    },
  ],
  examples: [
    { businessType: 'tour-operator', businessTypeLabel: 'Tour Operator', scenario: 'Panel hiring guide rates was rating candidates on "energy" and "vibe". Disabled candidates rated lower without specific feedback.', solution: 'Replaced gut ratings with behavioural rubric: "Describe how this candidate handled X scenario. Score 1-5 against anchors."', outcome: 'Hire decisions defensible. Panel debrief revealed bias patterns. Two recent hires include people who would have been rated low under old approach.', cost: '$1,200', timeframe: '6 weeks' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Cognitive assessment used for graduate hiring had no disability validation. Candidates with ADHD and dyslexia consistently underperformed despite strong work samples.', solution: 'Audited tool with org psychologist. Vendor could not provide disability validation. Switched to work-sample assessment with extended-time default.', outcome: 'Graduate cohort diversified. New tool predicts performance better than old.', cost: '$8,000', timeframe: '6 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Allied Health Clinic', scenario: 'Interview room had fluorescent flicker and street noise. Autistic candidate disclosed sensory overload, scored poorly.', solution: 'Switched all interviews to a quiet, naturally-lit consult room. Added sensory check to interview booking.', outcome: 'Subsequent autistic candidate hired successfully. Process now standard.', cost: '$0', timeframe: 'Immediate' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Online application included a 60-minute timed cognitive test. Candidates with chronic fatigue and ADHD dropped out at this stage at 4x the rate.', solution: 'Added "extended time available on request" prominently. Defaulted to no time pressure for accessibility-disclosed candidates.', outcome: 'Drop-off rate equalised. Hiring quality unchanged.', cost: '$500', timeframe: '2 months' },
  ],
  resources: [
    { title: 'JobAccess - Inclusive Selection', url: 'https://www.jobaccess.gov.au/employers/attracting-recruiting-people-disability', type: 'guide', source: 'Australian Government', description: 'Government guidance on selection design and assessment.', isAustralian: true, isFree: true },
    { title: 'AHRC - Disability Discrimination Act guidance', url: 'https://humanrights.gov.au/our-work/disability-rights/about-disability-rights', type: 'guide', source: 'AHRC', description: 'Legal framework for adjustments in selection.', isAustralian: true, isFree: true },
    { title: 'Australian Psychological Society - Workplace assessment', url: 'https://psychology.org.au/', type: 'website', source: 'APS', description: 'Find org psychologists qualified to audit assessment tools.', isAustralian: true, isFree: true },
  ],
  keywords: ['structured interview', 'rubric', 'behavioural anchor', 'sensory check', 'breaks', 'psychometric', 'cognitive assessment', 'bias audit'],
},

{
  questionId: '5.8-DD-5',
  questionText: 'Candidate experience, decisions, and accountability in selection',
  moduleCode: '5.8',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Candidate experience, decisions, and accountability in selection',
  coveredQuestionIds: ['5.8-DD-6', '5.8-DD-7', '5.8-DD-8', '5.8-DD-9'],
  summary: 'How you treat candidates after they apply matters as much as the design of the process. Support persons, reimbursed costs, bias-aware reference checks, respectful feedback, and a clear complaints path build trust and protect against discrimination claims.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Candidates experience selection as a sign of how the organisation treats people generally. A candidate who is reimbursed for an interpreter, given respectful feedback, and told how to escalate concerns will share that experience whether or not they got the job. So will the one who waited months for a generic rejection.',
    quote: { text: 'I had asked for a support person for my interview because of my anxiety. The panel was clearly thrown by it. I did not get the job. I never got feedback that addressed why. The complaints email bounced.', attribution: 'Candidate, retail sector' },
  },
  tips: [
    { icon: 'Heart', text: 'Welcome support persons, interpreters, and advocates as standard.', priority: 1 },
    { icon: 'DollarSign', text: 'Reimburse interview-related costs (travel, interpreter, support, care, AT rental).', priority: 2 },
    { icon: 'Search', text: 'Train reference-checkers to spot disability bias (gaps, complicated past relationships).', priority: 3 },
    { icon: 'MessageCircle', text: 'Provide specific, respectful feedback to unsuccessful candidates.', priority: 4 },
    { icon: 'AlertCircle', text: 'Publish a clear complaints and review path with named owner.', priority: 5 },
  ],
  howToCheck: {
    title: 'Auditing candidate experience and accountability',
    steps: [
      { text: 'Check your invitation: does it actively offer support person, interpreter, or AT?' },
      { text: 'Pull cost reimbursement policy. Does it cover interview-related disability costs?' },
      { text: 'Sample 5 reference check notes from last 12 months. Were any gaps or complicated histories assumed negative?' },
      { text: 'Pull 5 rejection emails. Are they specific and respectful, or generic templates?' },
      { text: 'Find your complaints channel. Is it published, named, and time-bound?' },
    ],
    estimatedTime: '2 hours',
  },
  solutions: [
    {
      title: 'Support person and reimbursement policy',
      description: 'Publish a one-page policy welcoming support persons and reimbursing interview-related costs.',
      resourceLevel: 'low', costRange: '$1,000-3,000/year', timeRequired: '1 month', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft policy and reimbursement scope (travel, interpreter, AT rental, care).', 'Set per-candidate cap and approval path.', 'Publish in invitation templates and on careers page.', 'Track uptake and budget impact for year-one review.'],
    },
    {
      title: 'Reference-check bias review',
      description: 'Train reference-checkers and review past references for bias.',
      resourceLevel: 'low', costRange: '$1,500-4,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Train HR and panels on common reference bias (gaps, manager conflict, attendance patterns).', 'Build reference question template that focuses on role-relevant evidence.', 'Audit 6 months of reference notes for patterns.', 'Refresh training annually.'],
    },
    {
      title: 'Feedback standard',
      description: 'Set and meet a standard for respectful, specific feedback to unsuccessful candidates.',
      resourceLevel: 'low', costRange: '$500', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Define what "specific and respectful" means: 1-2 sentences referencing actual interview content.', 'Brief panels and HR on the standard.', 'Add to recruitment SLA.', 'Sample audit quarterly.'],
    },
    {
      title: 'Complaints and review pathway',
      description: 'Establish and publicise a clear complaints channel for selection decisions.',
      resourceLevel: 'medium', costRange: '$2,000-5,000', timeRequired: '2-4 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Name a senior owner outside the original panel.', 'Document the process: lodging, timeframes, escalation.', 'Publish on careers page and in rejection emails.', 'Train owner on disability-aware complaint handling.', 'Report aggregate complaints to leadership annually.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Major Venue', scenario: 'Interpreter cost for Deaf candidate was passed to candidate. Candidate withdrew.', solution: 'Implemented reimbursement policy: venue pays Auslan interpreter for any candidate who requests one. Capped at $1,500 per interview round.', outcome: 'Two Deaf hires made within 12 months who would not have proceeded under old approach.', cost: '$2,800/year', timeframe: '1 month' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Reference checks asked "what was their attendance like?" Disabled candidate with chronic illness rated negatively.', solution: 'Replaced attendance question with "describe how they delivered on commitments". Trained reference-checkers on disability-aware questioning.', outcome: 'Reference outcomes equalised. One new hire who previously failed reference stage.', cost: '$1,800', timeframe: '3 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Service', scenario: 'Rejection emails were generic auto-sends. No feedback. High volume of "why?" complaints from candidates.', solution: 'Set standard: every interviewed candidate gets 2 sentences referencing actual interview content. Allocated 30 mins per panel for feedback drafting.', outcome: 'Complaint volume halved. Glassdoor candidate reviews improved.', cost: '$0 (process change)', timeframe: 'Immediate' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'No published complaints channel. Three discrimination complaints went via FWC because candidates could not find an internal path.', solution: 'Published complaints process on careers page. Named senior owner outside the panel. Set 14-day acknowledgement, 30-day response.', outcome: 'Internal channel used for 4 of 5 subsequent concerns. FWC complaints stopped.', cost: '$3,500', timeframe: '4 months' },
  ],
  resources: [
    { title: 'JobAccess - Adjustments in Recruitment', url: 'https://www.jobaccess.gov.au/employers/attracting-recruiting-people-disability', type: 'guide', source: 'Australian Government', description: 'Guidance on supporting candidates through recruitment.', isAustralian: true, isFree: true },
    { title: 'Fair Work Commission - Anti-Discrimination', url: 'https://www.fwc.gov.au/issues-we-help/discrimination-bullying-and-harassment', type: 'guide', source: 'Fair Work Commission', description: 'Legal framework around recruitment-stage discrimination.', isAustralian: true, isFree: true },
    { title: 'AHRC - Complaints Pathway Guidance', url: 'https://humanrights.gov.au/complaints', type: 'guide', source: 'AHRC', description: 'How to design accessible internal complaint mechanisms.', isAustralian: true, isFree: true },
  ],
  keywords: ['support person', 'interpreter', 'reimbursement', 'reference check', 'feedback', 'rejection', 'complaints', 'review pathway'],
},

// ─── Module 5.9: Onboarding & Workplace Adjustments ───
{
  questionId: '5.9-PC-1',
  questionText: 'Onboarding and workplace adjustments',
  moduleCode: '5.9',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Onboarding and workplace adjustments',
  coveredQuestionIds: ['5.9-PC-2', '5.9-PC-3', '5.9-PC-4', '5.9-PC-5', '5.9-PC-6'],
  summary: 'Proactive adjustment conversations, portable adjustment passports, awareness of JobAccess EAF funding, accessible induction content, manager training, and a documented adjustment process together make workplace inclusion operational, not aspirational.',
  lastUpdated: '2026-04-14',
  whyItMatters: {
    text: 'A hire is only a start. Without proactive onboarding and embedded adjustment practice, new disabled employees face a disclosure tax and a higher early-exit risk. These practices also benefit staff without diagnosed disability — flexible setup, clear communication preferences, and accessible content help everyone.',
    statistic: { value: '$6,000', context: 'typical per-adjustment cap under JobAccess Employment Assistance Fund — free to eligible employers. Most organisations do not know this exists.', source: 'JobAccess' },
  },
  tips: [
    { icon: 'MessageCircle', text: 'Offer a workplace adjustment conversation to every new hire in week 1-2.', priority: 1 },
    { icon: 'BookOpen', text: 'Implement a workplace adjustment passport that travels with the employee.', priority: 2 },
    { icon: 'DollarSign', text: 'Train managers to use JobAccess EAF — most adjustments are free to the employer.', priority: 3 },
    { icon: 'Captions', text: 'Onboarding content meets WCAG 2.2 AA by default: captions, tagged PDFs, plain language.', priority: 4 },
    { icon: 'Users', text: 'Disability-confident management training for all people managers.', priority: 5 },
    { icon: 'ClipboardCheck', text: 'Document the adjustment request process: timeframes, roles, escalation.', priority: 6 },
  ],
  solutions: [
    {
      title: 'Onboarding adjustment addition',
      description: 'Add a standard adjustment conversation to every new-hire onboarding.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '1 day', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft a 30-min adjustment conversation script.', 'Add to onboarding checklist.', 'Brief managers.', 'Track completion at the 2-week check-in.'],
    },
    {
      title: 'Adjustment passport program',
      description: 'Launch a workplace adjustment passport available to all staff.',
      resourceLevel: 'medium', costRange: '$2,000-5,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Adapt a template (UK Civil Service workplace adjustment passport is a public, free starting point).', 'Pilot with volunteer staff.', 'Finalise and roll out via HR.', 'Train managers on how to receive and honour it.', 'Publish internally as standard practice.'],
    },
    {
      title: 'Manager capability uplift',
      description: 'Comprehensive manager training program on disability-confident management.',
      resourceLevel: 'high', costRange: '$8,000-25,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Select provider (AC training hub, disability-led training specialist, or state disability employment body).', 'Mandatory for all people managers.', 'Scenario-based learning + assessment.', 'Include EAF awareness module.', 'Refresh every 2 years.', 'Measure through staff engagement scores.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Performing Arts Centre', scenario: 'New Deaf stage technician hired. No experience with Auslan interpreting cost in their budget.', solution: 'Applied to JobAccess EAF for interpreting for induction week and quarterly all-staff meetings. Approved, reimbursed, zero cost to venue. Built this into future hiring cost models.', outcome: 'Smooth induction. Technician became an informal trainer on accessible stage practice for the whole team.', cost: '$0 (EAF reimbursed)', timeframe: 'Week 1' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Employee moved from library to customer service role. Had to re-disclose and re-negotiate all adjustments.', solution: 'Council launched adjustment passport program. Employee documented agreed adjustments once. New manager received passport at role transition.', outcome: 'Employee retention and satisfaction up. Passport adopted by 40+ staff in year one.', cost: '$3,500', timeframe: '3 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Clinic Group', scenario: 'Onboarding videos auto-captioned only. Deaf new hire spent days reviewing incorrect captions.', solution: 'Retroactively added human-reviewed captions to all onboarding videos. Set WCAG 2.2 AA as default for new content. Procured captioning service.', outcome: 'Induction time for Deaf hires reduced. Content reused for external patient-facing materials.', cost: '$4,500', timeframe: '2 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Store manager refused adjustment request (flexible start time) on grounds of "fairness to team." Complaint lodged.', solution: 'Organisation realised no documented process existed. Published adjustment request workflow with 2-week response timeline and escalation path. Manager training rolled out.', outcome: 'Consistent practice across stores. Complaint resolved and adjustment honoured. Legal risk reduced.', cost: '$5,000', timeframe: '4 months' },
  ],
  resources: [
    { title: 'JobAccess - Employment Assistance Fund', url: 'https://www.jobaccess.gov.au/employment-assistance-fund-eaf', type: 'website', source: 'Australian Government', description: 'Free funding for most workplace adjustments.', isAustralian: true, isFree: true },
    { title: 'JobAccess - Workplace Adjustment Tool', url: 'https://www.jobaccess.gov.au/tools', type: 'tool', source: 'Australian Government', description: 'Interactive tool for identifying suitable workplace adjustments.', isAustralian: true, isFree: true },
    { title: 'Fair Work Ombudsman - Workplace Rights', url: 'https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/workplace-rights-and-obligations', type: 'guide', source: 'Fair Work Ombudsman', description: 'Rights and obligations on workplace adjustments under Australian law.', isAustralian: true, isFree: true },
    { title: 'Safe Work Australia', url: 'https://www.safeworkaustralia.gov.au/', type: 'website', source: 'Safe Work Australia', description: 'WHS guidance including psychological health and chronic illness considerations.', isAustralian: true, isFree: true },
  ],
  keywords: ['onboarding', 'induction', 'workplace adjustments', 'adjustment passport', 'JobAccess', 'EAF', 'manager training', 'reasonable adjustment'],
},

{
  questionId: '5.9-DD-1',
  questionText: 'Adjustment infrastructure: champion role, technology, capability, and EAP access',
  moduleCode: '5.9',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Adjustment infrastructure: champion role, technology, capability, and EAP access',
  coveredQuestionIds: ['5.9-DD-5', '5.9-DD-6', '5.9-DD-9'],
  summary: 'Without infrastructure, every adjustment becomes an individual negotiation. A named champion, fast assistive technology provisioning, targeted first-time-manager training, and proactive EAP access make adjustment a system, not a favour.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'When the same adjustment must be re-fought every time someone joins, transfers, or gets a new manager, employees with disability burn energy on logistics that everyone else uses on their job. Infrastructure shifts that cost off the individual.',
    statistic: { value: '14 days', context: 'is a reasonable benchmark for assistive technology provisioning. Most Australian organisations take weeks or months due to procurement delays. JobAccess EAF reimburses most cost.', source: 'JobAccess and practitioner benchmarks' },
  },
  tips: [
    { icon: 'UserCog', text: 'Name a Workplace Adjustment Champion or coordinator who owns the process organisation-wide.', priority: 1 },
    { icon: 'Zap', text: 'Provision assistive technology within 2 weeks of identified need.', priority: 2 },
    { icon: 'GraduationCap', text: 'Train first-time managers before (or at) the point of first managing a disclosed disabled employee.', priority: 3 },
    { icon: 'Heart', text: 'Make EAP, occupational health, and mental health support proactively known with named entry paths.', priority: 4 },
  ],
  howToCheck: {
    title: 'Auditing adjustment infrastructure',
    steps: [
      { text: 'Ask 3 random people managers: "Who handles workplace adjustments here?" Do you get a consistent name?' },
      { text: 'Pull last 5 AT requests. Time from request to delivery — is it under 14 days?' },
      { text: 'Check first-time manager onboarding. Is there a disability-confident management module?' },
      { text: 'Ask 5 random staff: "How do you access the EAP?" Do they know the entry point?' },
    ],
    estimatedTime: '2 hours',
  },
  solutions: [
    {
      title: 'Adjustment Champion role',
      description: 'Name and resource a Workplace Adjustment Champion or coordinator.',
      resourceLevel: 'low', costRange: '$5,000-15,000/year (allocated time)', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Create role description (can be 0.1-0.2 FTE add-on initially).', 'Appoint or invite EOI from existing staff.', 'Document responsibilities: process, escalation, EAF liaison, manager support.', 'Publish internally as the named entry point.', 'Allocate budget for training and external advice.'],
    },
    {
      title: 'AT provisioning SLA',
      description: 'Set a 14-day service level for assistive technology provisioning.',
      resourceLevel: 'medium', costRange: '$3,000-10,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Map current provisioning process and bottlenecks.', 'Pre-approve common AT (screen reader, magnification, ergonomic basics) to skip procurement loops.', 'Establish JobAccess EAF claim process.', 'Set 14-day SLA and monitor monthly.', 'Reduce SLA to 10 days as process matures.'],
    },
    {
      title: 'First-time manager curriculum',
      description: 'Build a disability-confident management module into first-time manager onboarding.',
      resourceLevel: 'medium', costRange: '$8,000-20,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Source provider (AC training hub, disability-led training specialist, JobAccess workshops).', 'Add to mandatory new manager onboarding.', 'Cover: lawful conduct, adjustment process, EAP referral, communication preferences.', 'Refresh every 2 years.', 'Track confidence via post-training survey.'],
    },
    {
      title: 'Proactive EAP and wellbeing pathways',
      description: 'Make wellbeing supports actively visible and easy to access.',
      resourceLevel: 'low', costRange: '$1,000-3,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Confirm EAP, OH, and mental health entry paths.', 'Publish on intranet, payslip, and onboarding pack.', 'Brief managers on referral process.', 'Track utilisation by EAP provider report (anonymised).', 'Address utilisation gaps via communications.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Convention Centre', scenario: 'Adjustment requests routed to whichever manager was available. Inconsistent decisions, slow turnaround, repeated escalations.', solution: 'Named the People & Culture Lead as Workplace Adjustment Champion (0.15 FTE). All requests now routed to her with 5-day acknowledgement SLA.', outcome: 'Median time-to-resolution dropped from 6 weeks to 11 days. Repeat escalations down 80%.', cost: '$12,000/year (time allocation)', timeframe: '6 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'AT requests stuck in IT procurement for 8-12 weeks. Two new hires resigned before equipment arrived.', solution: 'Pre-approved standard AT bundle (screen reader, ergonomic kit, monitor stand, headset). Set 14-day SLA. JobAccess EAF claim handled centrally.', outcome: 'Median provisioning time dropped to 9 days. Zero AT-related early exits in next 18 months.', cost: '$5,000 (initial bundle stock)', timeframe: '4 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Service', scenario: 'New first-time manager mishandled disclosure conversation. Employee complaint lodged.', solution: 'Built and rolled out 4-hour disability-confident management module for all new managers. Mandatory before line management starts.', outcome: 'Zero similar complaints in following 18 months. Manager confidence scores up 40%.', cost: '$15,000 (curriculum + delivery)', timeframe: '6 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'EAP utilisation by store staff was 2% (head office: 9%). Stores did not know how to access it.', solution: 'Added EAP card to every store staff lanyard. Briefed store managers in monthly meeting. Posted in break rooms.', outcome: 'Store-staff utilisation tripled in 6 months.', cost: '$2,000 (cards + comms)', timeframe: '3 months' },
  ],
  resources: [
    { title: 'JobAccess - Employment Assistance Fund', url: 'https://www.jobaccess.gov.au/employment-assistance-fund-eaf', type: 'website', source: 'Australian Government', description: 'Free funding for assistive technology and workplace adjustments.', isAustralian: true, isFree: true },
    { title: 'JobAccess - National Disability Recruitment Coordinator', url: 'https://www.jobaccess.gov.au/employers/national-disability-recruitment-coordinator-ndrc', type: 'website', source: 'Australian Government', description: 'Free dedicated employer advisor for adjustment infrastructure.', isAustralian: true, isFree: true },
    { title: 'Beyond Blue - Workplace Mental Health', url: 'https://www.beyondblue.org.au/mental-health/workplace-mental-health', type: 'website', source: 'Beyond Blue', description: 'EAP, manager training, and wellbeing pathway resources.', isAustralian: true, isFree: true },
    { title: 'Heads Up - Workplace Mental Health', url: 'https://www.headsup.org.au/', type: 'website', source: 'Beyond Blue', description: 'Free workplace mental health planning toolkit.', isAustralian: true, isFree: true },
  ],
  keywords: ['adjustment champion', 'assistive technology', 'AT provisioning', 'manager training', 'EAP', 'occupational health', 'mental health', 'EAF'],
},

{
  questionId: '5.9-DD-2',
  questionText: 'Critical employee-journey moments: induction, evacuation, check-ins, return-to-work, probation',
  moduleCode: '5.9',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Critical employee-journey moments: induction, evacuation, check-ins, return-to-work, probation',
  coveredQuestionIds: ['5.9-DD-3', '5.9-DD-4', '5.9-DD-7', '5.9-DD-8'],
  summary: 'Generic induction, untested PEEPs, performance-only check-ins, ad-hoc return-to-work and unaudited probation are where disabled employees quietly fall out of the workforce. Designing these moments deliberately prevents predictable losses.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Most disability-related departures happen at predictable inflection points: a botched induction, an emergency evacuation that exposed a gap, a 90-day check-in that focused on output without asking about adjustments, a return-to-work assumed to "just resume", or a probation ended without checking whether adjustments were actually delivered. Each of these is engineerable.',
    quote: { text: 'My PEEP was a piece of paper in a folder. There was a fire alarm one Tuesday and nobody looked at me. I went down four flights of stairs alone. I left the job inside three months.', attribution: 'Wheelchair-using employee, government sector' },
  },
  tips: [
    { icon: 'BookOpen', text: 'Build a personalised induction plan that covers adjustments and communication preferences explicitly.', priority: 1 },
    { icon: 'Siren', text: 'Practise every PEEP, do not just document it.', priority: 2 },
    { icon: 'Calendar', text: 'Use 30, 60, 90-day check-ins to review adjustments and inclusion experience, not just performance.', priority: 3 },
    { icon: 'RefreshCw', text: 'Design a return-to-work process specific to disability-related leave.', priority: 4 },
    { icon: 'ClipboardCheck', text: 'Audit probation decisions for bias and confirm adjustment delivery before any probation fail.', priority: 5 },
  ],
  howToCheck: {
    title: 'Auditing critical journey moments',
    steps: [
      { text: 'Pull last 3 disabled-hire induction plans. Are adjustments and communication preferences explicit?' },
      { text: 'Check date of last PEEP practice for each documented PEEP. More than 12 months ago?' },
      { text: 'Sample 30/60/90-day check-in notes. How many specifically discussed adjustments?' },
      { text: 'Check return-to-work documentation. Is there a disability-specific path, or one generic policy?' },
      { text: 'Pull last 12 months of failed probation decisions. Was adjustment delivery audited before each?' },
    ],
    estimatedTime: '3-4 hours',
  },
  solutions: [
    {
      title: 'Personalised induction template',
      description: 'Build a personalised induction plan template that includes adjustments, communication preferences, and a named buddy.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1 month', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Adapt existing onboarding template.', 'Add sections: adjustments confirmed, communication preferences, AT delivery dates, named buddy.', 'Brief managers and HR on use.', 'Pilot on next 3 hires.'],
    },
    {
      title: 'PEEP practice program',
      description: 'Establish a routine for practising every PEEP, not just documenting them.',
      resourceLevel: 'low', costRange: '$1,500-4,000/year', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Identify all current PEEPs.', 'Schedule annual practice with WHS coordinator.', 'Add new-PEEP practice to onboarding.', 'Document outcomes and update PEEP if gaps found.', 'Brief evacuation wardens on disability-aware response.'],
    },
    {
      title: 'Inclusion-aware check-ins',
      description: 'Restructure 30/60/90 check-ins to include adjustments and inclusion experience.',
      resourceLevel: 'low', costRange: '$0-1,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Add adjustment review and inclusion-experience prompts to check-in template.', 'Train managers to ask without assumptions.', 'Document outcomes alongside performance notes.', 'Review aggregate themes annually.'],
    },
    {
      title: 'Disability-specific return-to-work pathway',
      description: 'Build a return-to-work process specifically for disability-related leave.',
      resourceLevel: 'medium', costRange: '$3,000-8,000', timeRequired: '2-4 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Co-design pathway with HR, WHS, and EAP partner.', 'Cover: pre-return planning, gradual return option, role adjustment, manager preparation.', 'Brief all managers.', 'Set check-in cadence after return.', 'Review outcomes annually.'],
    },
    {
      title: 'Probation audit process',
      description: 'Add an adjustment-delivery audit to every probation decision involving a disabled employee.',
      resourceLevel: 'low', costRange: '$0-1,000', timeRequired: '1 month', implementedBy: 'staff', impact: 'moderate',
      steps: ['Add to probation review checklist: were agreed adjustments delivered? Within what timeframe?', 'Require sign-off from HR before any probation fail.', 'Track patterns annually.', 'Refresh manager guidance based on patterns.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Performing Arts Centre', scenario: 'Wheelchair-using technician hired. PEEP documented but never practised. Routine alarm exposed gap.', solution: 'Practised PEEP with WHS and the technician. Identified that lift-isolation procedure left him without an exit. Reconfigured lift control protocol for alarm events.', outcome: 'Subsequent drill resolved evacuation in under 4 minutes. Process now standard for all PEEPs.', cost: '$2,500 (control system mod)', timeframe: '2 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Disabled new hire failed probation despite strong evidence on file. Investigation showed agreed AT was never delivered.', solution: 'Added adjustment-delivery audit to all probation decisions. HR sign-off required.', outcome: 'Two probation fails reversed. Pattern stopped within 6 months.', cost: '$0 (process change)', timeframe: '3 months' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Network', scenario: 'Employee returned from chronic illness leave. Manager assumed full duties resumption immediately. Employee relapsed within 6 weeks.', solution: 'Built disability-aware return-to-work pathway: pre-return planning meeting, graduated hours over 4 weeks, role accommodation review.', outcome: 'Subsequent returns sustained. EAP partnership extended to support pre-return planning.', cost: '$5,500 (pathway design + training)', timeframe: '4 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Generic onboarding for all roles. Deaf hire spent first week unable to follow team meetings.', solution: 'Personalised induction plan included Auslan interpreter for inductions, captioned video alternatives, named buddy.', outcome: 'Hire integrated into team in week one. Plan now standard for all hires with disclosed access needs.', cost: '$1,200 (interpreter for induction week)', timeframe: 'Immediate' },
  ],
  resources: [
    { title: 'Safe Work Australia - Emergency Plans', url: 'https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/emergency-plan', type: 'guide', source: 'Safe Work Australia', description: 'WHS guidance on PEEPs and inclusive emergency planning.', isAustralian: true, isFree: true },
    { title: 'Fair Work - Return to Work', url: 'https://www.fairwork.gov.au/employment-conditions/leave/sick-and-carers-leave/returning-to-work-after-an-illness-or-injury', type: 'guide', source: 'Fair Work Ombudsman', description: 'Legal framework for return to work after illness or injury.', isAustralian: true, isFree: true },
    { title: 'Comcare - Mentally Healthy Workplaces', url: 'https://www.comcare.gov.au/safe-healthy-work/mentally-healthy-workplaces', type: 'guide', source: 'Comcare', description: 'Return-to-work and check-in resources for mental-health-related leave.', isAustralian: true, isFree: true },
  ],
  keywords: ['induction', 'PEEP', 'evacuation', '30 60 90 day', 'check-in', 'return to work', 'probation', 'adjustment audit'],
},

// ─── Module 5.10: Retention, ERGs & Inclusive Culture ───
{
  questionId: '5.10-PC-1',
  questionText: 'Retention, ERGs and inclusive culture',
  moduleCode: '5.10',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Retention, ERGs and inclusive culture',
  coveredQuestionIds: ['5.10-PC-2', '5.10-PC-3', '5.10-PC-4', '5.10-PC-5', '5.10-PC-6'],
  summary: 'Hiring disabled staff is a start. Retention depends on data (disclosure and retention tracking), resourced ERGs, visible senior representation, honest exit interviews, co-designed policies, and inclusion-specific engagement measurement.',
  lastUpdated: '2026-04-14',
  whyItMatters: {
    text: 'Organisations that hire well but retain poorly burn trust with the disability community fast. Disabled employees talk to each other. A reputation for "getting in but not getting on" follows. Culture work is slower than process work, but it is where long-term inclusion happens.',
    quote: { text: 'I disclosed at my last place. Adjustments happened on paper, never in meetings. I left inside a year. At my current role, the ERG had already shaped the policies before I arrived. Different world.', attribution: 'Disabled employee, tourism sector' },
  },
  tips: [
    { icon: 'TrendingUp', text: 'Collect voluntary disclosure and review retention by disclosure status annually.', priority: 1 },
    { icon: 'Users', text: 'Resource the ERG properly: paid time, budget, exec sponsor.', priority: 2 },
    { icon: 'Award', text: 'Track promotion rates by disclosure status. Set targets.', priority: 3 },
    { icon: 'MessageSquare', text: 'Ask specific disability inclusion questions in exit interviews.', priority: 4 },
    { icon: 'PencilRuler', text: 'Co-design (not consult on) policies affecting disabled staff.', priority: 5 },
    { icon: 'BarChart3', text: 'Report disability inclusion metrics in annual engagement surveys and DIAP.', priority: 6 },
  ],
  solutions: [
    {
      title: 'Data foundation',
      description: 'Set up voluntary disclosure collection and annual retention analysis.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add voluntary disclosure to HR records.', 'Separate from performance data.', 'Build quarterly retention report by disclosure status.', 'Review annually with leadership.', 'Publish headline metrics in DIAP.'],
    },
    {
      title: 'Launch a resourced ERG',
      description: 'Establish and fund an Employee Resource Group for staff with disability.',
      resourceLevel: 'medium', costRange: '$3,000-10,000/year', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Invite interested staff to express interest.', 'Co-design terms of reference.', 'Allocate meeting time in work hours.', 'Set annual budget ($500-5000).', 'Secure an exec sponsor with real decision-making power.', 'Define feedback loop to senior leadership.'],
    },
    {
      title: 'Culture transformation program',
      description: 'Multi-year program: data + ERG + co-design + survey + manager capability.',
      resourceLevel: 'high', costRange: '$25,000-80,000', timeRequired: '2-3 years', implementedBy: 'specialist', impact: 'significant',
      steps: ['Baseline current culture through survey and focus groups.', 'Establish ERG and advisory panel.', 'Co-design key policies.', 'Build manager capability program.', 'Track and report year-over-year.', 'Embed in DIAP and strategic plan.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Major Venue', scenario: 'Strong recruitment outcomes, low retention among disabled hires (63% at 12 months vs 81% org average).', solution: 'Launched Disability Access ERG (paid time, budget, CEO sponsor). ERG identified 3 key friction points: meeting culture, flexible work interpretation, promotion pathways. Leadership committed to change on all 3.', outcome: '12-month retention for disabled hires rose to 79% over 2 years. ERG now drives annual DIAP review.', cost: '$12,000/year', timeframe: '18 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Annual engagement survey showed disabled staff scored 15 points lower on belonging. Root cause unclear.', solution: 'Council commissioned focused listening sessions with disabled staff (paid, external facilitator). Patterns emerged: invisible disability stigma, poor meeting accessibility, slow adjustment process. Council co-designed improvements with staff.', outcome: 'Belonging score gap closed to 4 points over 2 annual cycles. Case study shared nationally.', cost: '$18,000', timeframe: '2 years' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Service', scenario: 'Exit interviews were generic. No disability-specific data. Departing disabled staff cited the same issues anecdotally but pattern not visible.', solution: 'Added disability-specific exit prompts. Built annual review cycle. Found: 60% of disabled leavers cited manager capability as a factor. Rolled out manager training as direct response.', outcome: 'Exit pattern changed within 12 months. Exit feedback now explicitly informs manager development.', cost: '$1,500 (survey redesign)', timeframe: '1 year' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Policy on flexible work drafted by HR and rolled out. Disabled staff fed back it did not address real barriers. Low uptake.', solution: 'Reopened policy development. Paid ERG to co-design v2. Resulting policy addressed break flexibility, commute considerations, invisible disability fatigue. Uptake tripled.', outcome: 'Policy used as HR best-practice example. Disabled staff engagement score up year-over-year.', cost: '$4,500', timeframe: '4 months' },
  ],
  resources: [
    { title: 'Australia\'s Disability Strategy 2021-2031', url: 'https://www.disabilitygateway.gov.au/ads', type: 'website', source: 'Australian Government', description: 'National strategy including Employment outcome area with indicators and targets.', isAustralian: true, isFree: true },
    { title: 'AHRC - Employers', url: 'https://humanrights.gov.au/our-work/employers', type: 'guide', source: 'AHRC', description: 'Guidance on inclusive workplace culture, policy, and reporting.', isAustralian: true, isFree: true },
    { title: 'People with Disability Australia (PWDA)', url: 'https://pwd.org.au/', type: 'website', source: 'PWDA', description: 'National peak body. Policy positions, research, and lived-experience perspective.', isAustralian: true, isFree: true },
    { title: 'IncludeAbility - Inclusive Workplaces', url: 'https://includeability.gov.au/', type: 'website', source: 'AHRC', description: 'Tools and templates for building sustained inclusive culture.', isAustralian: true, isFree: true },
  ],
  keywords: ['retention', 'ERG', 'employee resource group', 'culture', 'engagement', 'exit interview', 'co-design', 'promotion', 'disclosure'],
},

{
  questionId: '5.10-DD-1',
  questionText: 'Inclusive operational practice: meetings, development, pay equity, and chronic illness support',
  moduleCode: '5.10',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Inclusive operational practice: meetings, development, pay equity, and chronic illness support',
  coveredQuestionIds: ['5.10-DD-2', '5.10-DD-3', '5.10-DD-9', '5.10-DD-10'],
  summary: 'Retention is built in the small operational moments. Inclusive meeting culture, proactive development opportunities, pay equity that includes disability, structured mentoring, and flexibility that supports chronic illness and mental health together signal that this is a workplace where disabled people can build careers, not just hold jobs.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Disabled employees often report that the systems work but the daily texture does not. Meetings without agendas exclude processing-different staff. Stretch projects assigned only to those who "ask" exclude staff with confidence-eroding past experiences. Pay reviews that ignore disclosure status hide systemic underpayment. Chronic illness flexibility offered grudgingly burns trust faster than it fixes anything.',
    statistic: { value: '11.6%', context: 'pay gap between disabled and non-disabled employees in Australia, controlled for occupation. Without disclosure-segmented pay review, this gap is invisible to employers.', source: 'Australian Institute of Health and Welfare' },
  },
  tips: [
    { icon: 'Calendar', text: 'Design meeting culture for inclusion: agendas in advance, captions, recording option, clear speaking order.', priority: 1 },
    { icon: 'TrendingUp', text: 'Proactively offer development opportunities to disabled staff, do not wait for them to ask.', priority: 2 },
    { icon: 'DollarSign', text: 'Conduct pay equity analysis cut by disclosure status alongside gender and ethnicity.', priority: 3 },
    { icon: 'Users', text: 'Run a mentoring or sponsorship program specifically for disabled staff with trained mentors.', priority: 4 },
    { icon: 'Heart', text: 'Support chronic illness and mental health beyond statutory minimums (recovery leave, flexible cycles).', priority: 5 },
  ],
  howToCheck: {
    title: 'Auditing inclusive operational practice',
    steps: [
      { text: 'Sit in 3 routine meetings. Score: was an agenda sent in advance? Were captions used? Was speaking order clear?' },
      { text: 'Pull last 12 months of conference, training, and stretch project allocations. Are disabled staff over- or under-represented?' },
      { text: 'Run pay equity analysis cut by disclosure status. What gap appears, controlled for role and tenure?' },
      { text: 'Check whether a mentoring or sponsorship program exists, who is in it, and what mentor training is provided.' },
      { text: 'Review chronic illness and mental health support against statutory minimum. What is the gap?' },
    ],
    estimatedTime: '4-6 hours',
  },
  solutions: [
    {
      title: 'Inclusive meeting standard',
      description: 'Adopt and roll out a written standard for inclusive meetings.',
      resourceLevel: 'low', costRange: '$500-2,000', timeRequired: '1-2 months', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft standard: agenda 24h advance, captions on by default, recording offered, speaking order managed, breaks every 60-90 mins.', 'Roll out to all people leaders.', 'Add to manager onboarding.', 'Audit a sample of meetings quarterly.'],
    },
    {
      title: 'Proactive development allocation',
      description: 'Build a process for proactively offering development opportunities to disabled staff.',
      resourceLevel: 'low', costRange: '$1,000-3,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Audit last 12 months of development allocation by disclosure.', 'Set target for proportional allocation.', 'Train managers to offer, not wait for requests.', 'Track quarterly and review with leadership.'],
    },
    {
      title: 'Pay equity by disclosure',
      description: 'Add disclosure to existing pay equity analysis.',
      resourceLevel: 'medium', costRange: '$3,000-8,000/year', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Add voluntary disclosure to pay analysis dataset.', 'Run analysis controlling for role, tenure, location.', 'Review findings with leadership and ERG.', 'Address gaps via remuneration committee.', 'Report annually internally; consider external reporting.'],
    },
    {
      title: 'Disabled-staff sponsorship program',
      description: 'Launch a structured mentoring or sponsorship program with trained mentors.',
      resourceLevel: 'medium', costRange: '$5,000-15,000/year', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Co-design program with current disabled staff and ERG.', 'Train senior leaders as sponsors (with disability awareness training).', 'Set 12-month cohort cycles.', 'Track progression outcomes.', 'Publish outcomes annually.'],
    },
    {
      title: 'Chronic illness and mental health flex policy',
      description: 'Build and publish flexibility provisions that go beyond statutory minimums.',
      resourceLevel: 'medium', costRange: '$2,000-6,000', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Co-design with disabled staff, ERG, and EAP partner.', 'Cover: flexible sick leave banking, recovery leave, medication-cycle hours, episodic flexibility.', 'Train managers on use.', 'Publish in policy library and onboarding.', 'Review annually.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Major Venue', scenario: 'Stretch projects routinely assigned to whoever "spoke up" in leadership meetings. Disabled staff under-represented in growth opportunities.', solution: 'Quarterly opportunity allocation review by disclosure status. Managers trained to proactively offer opportunities to capable disabled staff.', outcome: 'Disabled staff in stretch roles up from 4% to 22% in 18 months. Two promotions resulted.', cost: '$3,500/year (review process)', timeframe: '12 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Annual pay equity report covered gender and ATSI status but not disability. ERG raised concern.', solution: 'Added disclosure to next pay equity cycle. Found 8% controlled gap. Remediation plan agreed by Exec.', outcome: 'Gap closed to 2% within 2 cycles. Disclosure rate also rose as trust built.', cost: '$5,500 (analysis + remediation)', timeframe: '2 years' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Service', scenario: 'No disability-specific mentoring. Disabled clinicians cited isolation in exit interviews.', solution: 'Launched sponsorship program: senior clinical leaders matched with disabled staff for 12 months. Mentor training included disability cultural awareness.', outcome: 'Three sponsored staff promoted within program. Retention up. ERG reported program as turning point.', cost: '$8,000/year', timeframe: '12 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Chronic illness sick leave was statutory only. Employees with conditions like MS and lupus exhausted leave during flares and resigned.', solution: 'Built recovery leave provision (10 days/year above statutory). Flexible start times for medication cycles. Managers trained on episodic flexibility.', outcome: 'Two valued staff retained who would have resigned. Adopted as company policy.', cost: '$4,500 (policy + training)', timeframe: '6 months' },
  ],
  resources: [
    { title: 'AHRC - Workplace Culture and Inclusion', url: 'https://humanrights.gov.au/our-work/employers', type: 'guide', source: 'AHRC', description: 'Guidance on inclusive operational practice and culture.', isAustralian: true, isFree: true },
    { title: 'Workplace Gender Equality Agency - Pay Equity', url: 'https://www.wgea.gov.au/pay-and-gender', type: 'tool', source: 'WGEA', description: 'Methods for cut-by-cut pay equity analysis adaptable to disability.', isAustralian: true, isFree: true },
    { title: 'Beyond Blue - Workplace Mental Health', url: 'https://www.beyondblue.org.au/mental-health/workplace-mental-health', type: 'website', source: 'Beyond Blue', description: 'Mental health flexibility and chronic illness support resources.', isAustralian: true, isFree: true },
    { title: 'Fair Work - Personal/Carers Leave', url: 'https://www.fairwork.gov.au/employment-conditions/leave/sick-and-carers-leave', type: 'guide', source: 'Fair Work Ombudsman', description: 'Statutory minimums to design beyond.', isAustralian: true, isFree: true },
  ],
  keywords: ['inclusive meetings', 'development', 'pay equity', 'mentoring', 'sponsorship', 'chronic illness', 'mental health', 'flexible work'],
},

{
  questionId: '5.10-DD-4',
  questionText: 'Voice, accountability, and intersectional data',
  moduleCode: '5.10',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Voice, accountability, and intersectional data',
  coveredQuestionIds: ['5.10-DD-5', '5.10-DD-6', '5.10-DD-7', '5.10-DD-8'],
  summary: 'Inclusion that lasts ties senior accountability to measurable outcomes, surfaces voice through paid Disabled-led partnerships, measures psychological safety honestly, and tracks intersectional patterns. Without these, "culture work" becomes a values poster.',
  lastUpdated: '2026-05-04',
  whyItMatters: {
    text: 'Performative inclusion is detected fast by the disability community and does long-term reputational damage. Real inclusion has accountability tied to executive and board metrics, paid (not volunteer) engagement with Disabled-led organisations, intersectional data that recognises disability is not a single category, and customer-facing decisions shaped by Disabled staff whose lived expertise matters commercially.',
    quote: { text: 'They asked me to share my disability story for free at three internal events. They paid the catering. I declined the fourth ask. They were surprised.', attribution: 'Disabled employee, education sector' },
  },
  tips: [
    { icon: 'Mic', text: 'Include Disabled staff in customer-facing decisions where their expertise is relevant.', priority: 1 },
    { icon: 'Activity', text: 'Run recurring psychological safety pulse cut by disclosure status with team-level action plans.', priority: 2 },
    { icon: 'Handshake', text: 'Pay Disabled-led organisations and individual advisors for engagement, never expect goodwill.', priority: 3 },
    { icon: 'Layers', text: 'Track intersectional data (disability x gender, x First Nations, x LGBTQ+, x age) where sample size allows.', priority: 4 },
    { icon: 'Trophy', text: 'Tie leadership accountability to measurable inclusion outcomes, reviewed at Board or Exec level.', priority: 5 },
  ],
  howToCheck: {
    title: 'Auditing voice, accountability, and data',
    steps: [
      { text: 'Pull last 5 customer-facing decisions (product, service, venue change). Were Disabled staff or customers consulted? Paid?' },
      { text: 'Check engagement survey methodology. Is psychological safety measured? Is it cut by disclosure?' },
      { text: 'List all Disabled-led organisations engaged in last 12 months. Were they paid market rate?' },
      { text: 'Pull HR data dimensions. Can you cut by disability x gender, disability x First Nations, etc.?' },
      { text: 'Check executive scorecard. Are inclusion metrics named with targets, or vague aspirations?' },
    ],
    estimatedTime: '3-4 hours',
  },
  solutions: [
    {
      title: 'Disabled staff in customer decisions',
      description: 'Build a process for routinely consulting Disabled staff (paid for time outside their core role) on customer-facing decisions.',
      resourceLevel: 'low', costRange: '$2,000-6,000/year', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Map decision points where Disabled lived experience is relevant.', 'Identify Disabled staff with relevant expertise.', 'Create a paid panel or rotation process.', 'Apply to next 3 product/service/venue decisions.', 'Document outcomes.'],
    },
    {
      title: 'Psychological safety measurement',
      description: 'Add psychological safety to engagement surveys cut by disclosure status.',
      resourceLevel: 'medium', costRange: '$3,000-8,000/year', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Add validated psych safety items to existing survey.', 'Cut results by disclosure (and gender, ATSI, etc.).', 'Action plan owned at team level for any 10-point gap.', 'Re-measure within 12 months.', 'Publish summary in DIAP.'],
    },
    {
      title: 'Paid Disabled-led partnerships',
      description: 'Convert all Disabled-led engagement to paid partnerships at market rate.',
      resourceLevel: 'medium', costRange: '$5,000-20,000/year', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Audit all current goodwill engagements.', 'Set market-rate pay schedule.', 'Allocate annual budget.', 'Renegotiate existing relationships on paid basis.', 'Track engagement outcomes annually.'],
    },
    {
      title: 'Intersectional data tracking',
      description: 'Build intersectional cuts into HR analytics.',
      resourceLevel: 'medium', costRange: '$2,000-6,000', timeRequired: '3-6 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Confirm voluntary disclosure dimensions in HRIS.', 'Build intersectional cuts for retention, promotion, pay.', 'Apply small-cell-size suppression to protect identity.', 'Review annually with ERG and DEI Committee.', 'Address patterns identified.'],
    },
    {
      title: 'Executive accountability tied to outcomes',
      description: 'Embed measurable inclusion outcomes into executive scorecards reviewed at Board level.',
      resourceLevel: 'medium', costRange: '$0-5,000', timeRequired: '6-12 months', implementedBy: 'staff', impact: 'significant',
      steps: ['Define 3-5 outcome metrics (recruitment %, retention %, promotion %, engagement gap, complaint volume).', 'Set 1-year and 3-year targets.', 'Add to exec performance reviews.', 'Quarterly review at Exec; annual at Board.', 'Publish progress in DIAP and annual report.'],
    },
  ],
  examples: [
    { businessType: 'event-venue', businessTypeLabel: 'Major Venue', scenario: 'New venue layout designed without consulting Disabled staff. Costly redesign needed after launch when wheelchair access proved unworkable.', solution: 'Built Disabled Staff Customer Experience Panel (paid). All future venue, product, and service decisions consulted with panel pre-launch.', outcome: 'Subsequent layout changes accessibility-compliant first time. Estimated $400k saved on redesigns over 3 years.', cost: '$8,000/year (panel honorarium + meeting time)', timeframe: '12 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Engagement survey showed disabled staff scored 18 points lower on psych safety. No team-level action.', solution: 'Cut survey by disclosure at team level. Any team with 10-point gap required action plan owned by team leader. CEO reviewed quarterly.', outcome: 'Gap halved within 18 months. Three managers identified for capability uplift; two for coaching out.', cost: '$5,500/year (survey instrument + facilitation)', timeframe: '2 years' },
    { businessType: 'health-wellness', businessTypeLabel: 'Health Network', scenario: 'CEO regularly invited PWDA and other Disabled-led organisations to "advise" without paying. Network publicly declined further engagement.', solution: 'Set $10,000 annual budget for Disabled-led advisory engagement. Paid all current advisors retrospectively for past unpaid time. Renegotiated relationships.', outcome: 'PWDA re-engaged. Network became advisor on next strategic plan. Reputation in sector restored.', cost: '$10,000/year', timeframe: '6 months' },
    { businessType: 'retail', businessTypeLabel: 'Retail Chain', scenario: 'Disability metrics in CEO scorecard were "improve disability inclusion" with no measurable target. No accountability when results plateaued.', solution: 'Set hard targets: 7% disclosed disability hire by year 2, retention parity within 3 years, engagement gap under 5 points by year 4. Tied to CEO and CHRO bonus.', outcome: 'Hiring target met in year 2. Retention parity reached year 3. Annual report cited externally as best practice.', cost: '$0 (existing process change)', timeframe: '4 years' },
  ],
  resources: [
    { title: 'People with Disability Australia (PWDA)', url: 'https://pwd.org.au/', type: 'website', source: 'PWDA', description: 'National peak disability rights organisation. Engage on paid basis.', isAustralian: true, isFree: true },
    { title: 'First Peoples Disability Network', url: 'https://fpdn.org.au/', type: 'website', source: 'FPDN', description: 'National peak body for First Nations Australians with disability. Intersectional advisory.', isAustralian: true, isFree: true },
    { title: 'Australia\'s Disability Strategy 2021-2031', url: 'https://www.disabilitygateway.gov.au/ads', type: 'website', source: 'Australian Government', description: 'National strategy with measurable outcome areas for accountability framing.', isAustralian: true, isFree: true },
    { title: 'WGEA - Reporting Framework', url: 'https://www.wgea.gov.au/reporting', type: 'guide', source: 'WGEA', description: 'Reporting model adaptable for disability inclusion accountability.', isAustralian: true, isFree: true },
  ],
  keywords: ['voice', 'consultation', 'paid engagement', 'psychological safety', 'intersectional', 'accountability', 'executive scorecard', 'board reporting'],
}

];

export default organisationHelp;
