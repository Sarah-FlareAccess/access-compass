/**
 * Help Content: Organisation (modules 5.1-5.5)
 * 17 entries covering organisational accessibility policy, employment, training, procurement, and performance.
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
    statistic: { value: '77%', context: 'of Australian organisations with a DIAP report improved customer satisfaction from people with disability, compared to 23% without one.', source: 'Australian Network on Disability' },
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
    { title: 'AHRC DIAP Guide', url: 'https://humanrights.gov.au/our-work/disability-rights/action-plans', type: 'guide', source: 'Australian Human Rights Commission', description: 'How to develop and register a Disability Action Plan.', isAustralian: true, isFree: true },
    { title: 'AND DIAP Toolkit', url: 'https://www.and.org.au/', type: 'template', source: 'Australian Network on Disability', description: 'Templates and resources for developing a DIAP.', isAustralian: true, isFree: true },
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
    statistic: { value: '90%', context: 'of organisations that appoint a senior accessibility champion report faster progress on their DIAP goals than those without one.', source: 'Australian Network on Disability Benchmarking Study' }
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
    { title: 'AND Access and Inclusion Index', url: 'https://www.and.org.au/', type: 'tool', source: 'Australian Network on Disability', description: 'Benchmarking tool for disability inclusion maturity including governance.', isAustralian: true, isFree: false },
    { title: 'AHRC Advisory Committee Guide', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on establishing disability advisory committees.', isAustralian: true, isFree: true }
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

// ─── Entry 5: Inclusive recruitment and hiring ───
{
  questionId: '5.2-F-1',
  questionText: 'Are your recruitment processes accessible to people with disability?',
  moduleCode: '5.2',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Inclusive recruitment and hiring',
  coveredQuestionIds: ['5.2-F-2', '5.2-D-4', '5.2-D-7', '5.2-D-12'],
  summary: 'Inclusive recruitment means job ads in accessible formats, application systems compatible with assistive technology, interview adjustments offered proactively, accessible onboarding, and a culture where disability disclosure feels safe.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'People with disability face a 48% employment rate compared to 80% for people without disability. Many barriers are in the recruitment process itself: inaccessible job ads, online forms that do not work with screen readers, and interviews without offered adjustments.',
    statistic: { value: '48%', context: 'employment rate for people with disability vs 80% for those without. The gap represents over 1 million Australians locked out of work.', source: 'ABS Labour Force Survey' }
  },
  tips: [
    { icon: 'FileText', text: 'Include an accessibility statement in every job ad inviting applicants to request adjustments.', priority: 1 },
    { icon: 'Globe', text: 'Ensure your online application system is screen-reader compatible and keyboard-navigable.', priority: 2 },
    { icon: 'Users', text: 'Offer interview adjustments proactively: extra time, alternative formats, Auslan interpreters, accessible location.', priority: 3 },
    { icon: 'ClipboardList', text: 'Create an accessible onboarding checklist covering equipment, workspace, and communication needs.', priority: 4 },
    { icon: 'Heart', text: 'Use inclusive language in job ads: focus on essential functions, not physical requirements that are not essential.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing recruitment accessibility',
    steps: [
      { text: 'Test your online application with a screen reader.' },
      { text: 'Review job ads: do they include an accessibility statement?' },
      { text: 'Check: are interview adjustments offered before the interview, not just on request?' },
      { text: 'Review essential criteria: are they genuinely essential or habit?' },
      { text: 'Check onboarding: is there a process for identifying and providing workplace adjustments?' },
      { text: 'Review the last 12 months of recruitment: were any applicants with disability hired?' }
    ],
    tools: ['Screen reader', 'Job ad samples', 'Recruitment data'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 15', requirement: 'It is unlawful to discriminate in recruitment, including in the terms and conditions of job offers, and in the provision of access to application processes.' },
    related: [
      { code: 'DDA', relevance: 'Section 21B requires employers to make reasonable adjustments for employees and applicants with disability.' }
    ],
    plainEnglish: 'You must not discriminate against job applicants because of disability. Your recruitment process must be accessible and you must offer reasonable adjustments.',
    complianceNote: 'JobAccess provides free support for employers on making recruitment accessible, including funding for workplace modifications through the Employment Assistance Fund.'
  },
  solutions: [
    {
      title: 'Update job ads and interview process',
      description: 'Add accessibility statements and proactive adjustment offers.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add accessibility statement to job ad template.', 'Review essential criteria for genuine necessity.', 'Add adjustment offer to interview invitation email.', 'Brief interview panels on disability awareness.', 'Create accessible onboarding checklist.', 'Share adjustments process with all hiring managers.']
    },
    {
      title: 'Accessible recruitment system and training',
      description: 'Fix application systems and train hiring managers.',
      resourceLevel: 'medium', costRange: '$2,000-10,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Audit online application system for WCAG compliance.', 'Fix accessibility issues or switch to accessible platform.', 'Train all hiring managers on inclusive interviewing.', 'Develop adjustment request and provision workflow.', 'Partner with disability employment services for candidate sourcing.', 'Track and report on disability representation in applicant pools.', 'Promote your organisation as an inclusive employer.']
    },
    {
      title: 'Disability employment strategy',
      description: 'Comprehensive strategy to increase disability employment.',
      resourceLevel: 'high', costRange: '$10,000-30,000', timeRequired: '3-6 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage disability employment consultant.', 'Set disability employment targets.', 'Redesign recruitment for universal access.', 'Create internship and traineeship pathways for people with disability.', 'Partner with Disability Employment Services providers.', 'Apply for JobAccess Employment Assistance Fund for workplace modifications.', 'Join AND as a Disability Confident Recruiter.', 'Report on disability employment annually.']
    }
  ],
  examples: [
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'Online application form not accessible. No adjustment offers.', solution: 'Fixed application form. Added accessibility statement to all ads. Trained hiring managers. Partnered with local DES.', outcome: 'Hired 12 employees with disability in first year. Retention rate higher than average.', cost: '$5,000', timeframe: '3 months' },
    { businessType: 'retail', businessTypeLabel: 'Supermarket', scenario: 'Wanted to increase disability employment but did not know how.', solution: 'Partnered with local disability employment service. Created supported roles with workplace adjustments. Provided disability awareness training for managers.', outcome: 'Disability employment from 0% to 8% in two years. Won employer of the year.', cost: '$3,000', timeframe: '6 months' }
  ],
  resources: [
    { title: 'JobAccess', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'Australian Government', description: 'Free advice and funding for employers on disability employment.', isAustralian: true, isFree: true },
    { title: 'AND Disability Confident Recruiter', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Program to improve disability inclusion in recruitment.', isAustralian: true, isFree: false },
    { title: 'Employment Assistance Fund', url: 'https://www.jobaccess.gov.au/employment-assistance-fund-eaf', type: 'guide', source: 'JobAccess', description: 'Funding for workplace modifications and assistive technology for employees with disability.', isAustralian: true, isFree: true }
  ],
  keywords: ['recruitment', 'hiring', 'job ads', 'interview', 'onboarding', 'adjustments', 'employment', 'DES']
},

// ─── Entry 6: Workplace adjustments and support ───
{
  questionId: '5.2-F-3',
  questionText: 'Does your organisation have a clear process for requesting and providing workplace adjustments?',
  moduleCode: '5.2',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Workplace adjustments and support',
  coveredQuestionIds: ['5.2-D-1', '5.2-D-5', '5.2-D-9', '5.2-D-13', '5.2-D-14'],
  summary: 'Workplace adjustments (reasonable adjustments) enable employees with disability to perform their roles effectively. This includes physical modifications, assistive technology, flexible work arrangements, accessible internal communications, and a confidential process for requesting support.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Most workplace adjustments are low-cost or free, yet many employees with disability never request them because the process is unclear, stigmatised, or non-existent. A clear, confidential adjustment process unlocks productivity and retention.',
    statistic: { value: '59%', context: 'of workplace adjustments cost nothing. A further 21% cost under $500. The Employment Assistance Fund covers most remaining costs.', source: 'JobAccess' }
  },
  tips: [
    { icon: 'FileText', text: 'Document a clear workplace adjustment request and approval process.', priority: 1 },
    { icon: 'Shield', text: 'Keep adjustment requests confidential between the employee, manager, and HR.', priority: 2 },
    { icon: 'Lightbulb', text: 'Know the Employment Assistance Fund (EAF): it covers most adjustment costs up to set limits.', priority: 3 },
    { icon: 'Users', text: 'Offer flexible work arrangements: hours, location, and breaks.', priority: 4 },
    { icon: 'Globe', text: 'Ensure internal communications (intranet, emails, documents) are accessible.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing workplace adjustments',
    steps: [
      { text: 'Is there a documented adjustment request process?' },
      { text: 'Do employees know the process exists and how to use it?' },
      { text: 'Are adjustments processed within a reasonable timeframe (2-4 weeks)?' },
      { text: 'Is the Employment Assistance Fund used for eligible adjustments?' },
      { text: 'Are flexible work policies genuinely available to people with disability?' },
      { text: 'Is the intranet and internal communication accessible (WCAG compliant)?' },
      { text: 'Review adjustment request data: how many requests, approval rate, time to implement.' }
    ],
    tools: ['HR records', 'Policy documents', 'Screen reader for intranet test'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 21B', requirement: 'Employers must make reasonable adjustments for employees with disability unless doing so would cause unjustifiable hardship.' },
    related: [
      { code: 'DDA', relevance: 'Section 5 defines disability broadly, including physical, intellectual, psychiatric, and neurological conditions.' }
    ],
    plainEnglish: 'You must make reasonable changes to the workplace so employees with disability can do their jobs. Most adjustments are cheap or free, and government funding is available.',
    complianceNote: 'Refusing reasonable adjustments is discrimination under the DDA. The bar for "unjustifiable hardship" is high.'
  },
  solutions: [
    {
      title: 'Create an adjustments process',
      description: 'Document and communicate a simple adjustment request workflow.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 days', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Draft a 1-page adjustment request form.', 'Define approval pathway: employee to manager to HR.', 'Set a 2-week response target.', 'Register with JobAccess for EAF eligibility.', 'Communicate the process to all staff via email and intranet.', 'Brief all managers on their role.']
    },
    {
      title: 'Accessible workplace infrastructure',
      description: 'Invest in universally accessible workplace features and assistive technology library.',
      resourceLevel: 'medium', costRange: '$3,000-15,000', timeRequired: '4-8 weeks', implementedBy: 'staff', impact: 'moderate',
      steps: ['Audit physical workplace for basic accessibility.', 'Purchase commonly needed assistive technology (screen readers, ergonomic equipment).', 'Make internal communications accessible (intranet, documents, training).', 'Formalise flexible work policy covering disability-related needs.', 'Train managers on adjustment conversations.', 'Track adjustment requests and outcomes.', 'Report to leadership quarterly.']
    },
    {
      title: 'Comprehensive workplace inclusion program',
      description: 'Transform workplace culture and infrastructure for full disability inclusion.',
      resourceLevel: 'high', costRange: '$20,000-60,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage workplace inclusion consultant.', 'Conduct workplace accessibility audit.', 'Develop adjustment passport system (portable between roles).', 'Build assistive technology lending library.', 'Make all internal systems accessible.', 'Create disability employee network.', 'Implement universal design for all new office fit-outs.', 'Report on disability employment and adjustment metrics annually.']
    }
  ],
  examples: [
    { businessType: 'general', businessTypeLabel: 'Corporate Office', scenario: 'No formal adjustment process. Employees asked managers individually with inconsistent results.', solution: 'Created adjustment request form, 2-week response guarantee, and manager training. Registered for EAF.', outcome: 'Adjustment requests increased 300% (from suppressed demand). Satisfaction improved. EAF covered $40,000 in modifications.', cost: '$0 (EAF covered costs)', timeframe: '1 month' },
    { businessType: 'accommodation', businessTypeLabel: 'Hotel', scenario: 'Housekeeping staff member developed chronic pain. At risk of leaving.', solution: 'Provided ergonomic trolley, flexible shift patterns, and rest breaks. JobAccess funded the trolley.', outcome: 'Employee retained. Productivity maintained. Other staff also benefited from ergonomic improvements.', cost: '$0 (EAF funded)', timeframe: '2 weeks' }
  ],
  resources: [
    { title: 'JobAccess Workplace Adjustments', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'Australian Government', description: 'Comprehensive guide to workplace adjustments with examples and funding information.', isAustralian: true, isFree: true },
    { title: 'Employment Assistance Fund', url: 'https://www.jobaccess.gov.au/employment-assistance-fund-eaf', type: 'guide', source: 'JobAccess', description: 'Government funding for workplace modifications.', isAustralian: true, isFree: true }
  ],
  keywords: ['workplace adjustments', 'reasonable adjustments', 'assistive technology', 'flexible work', 'EAF', 'internal communications']
},

// ─── Entry 7: Career development and equity ───
{
  questionId: '5.2-D-6',
  questionText: 'Do employees with disability have equal access to career development, promotion, and training?',
  moduleCode: '5.2',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Career development and equity',
  coveredQuestionIds: ['5.2-D-10'],
  summary: 'Employees with disability must have equal access to training, mentoring, promotion, and leadership development. This requires accessible training materials, inclusive selection processes, and proactive career conversations.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'Hiring people with disability is only the beginning. Without equal access to development and promotion, employees with disability remain in entry-level roles. This is both a waste of talent and potentially discriminatory.',
    statistic: { value: '34%', context: 'of employees with disability report being overlooked for promotion compared to 14% of employees without disability.', source: 'AND Disability Confidence Survey' }
  },
  tips: [
    { icon: 'TrendingUp', text: 'Include employees with disability in leadership development programs.', priority: 1 },
    { icon: 'GraduationCap', text: 'Ensure all training is accessible: captioned videos, screen-reader compatible materials, physical access.', priority: 2 },
    { icon: 'Users', text: 'Offer mentoring programs connecting employees with disability to senior leaders.', priority: 3 },
    { icon: 'Target', text: 'Track promotion rates for employees with disability vs overall.', priority: 4 },
    { icon: 'Heart', text: 'Conduct career conversations that explore aspirations, not assumptions about limitations.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing career equity',
    steps: [
      { text: 'Review training materials: are they accessible (captioned, screen-reader ready)?' },
      { text: 'Check promotion data: what percentage of promotions went to employees with disability?' },
      { text: 'Review leadership program participation: are employees with disability represented?' },
      { text: 'Ask employees with disability about their career development experience.' },
      { text: 'Check mentoring programs: are they inclusive?' },
      { text: 'Review performance management: are managers trained on equitable assessment?' }
    ],
    tools: ['HR data', 'Training records', 'Employee survey'],
    estimatedTime: '30-45 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 15', requirement: 'Employers must not discriminate in promotion, transfer, training, or any other benefit associated with employment.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 27 recognises the right of people with disability to work on an equal basis including career advancement.' }],
    plainEnglish: 'Employees with disability must have equal opportunity for training, promotion, and career development. Excluding them is discrimination.',
    complianceNote: 'Tracking career progression data by disability status (with voluntary disclosure) helps identify systemic barriers.'
  },
  solutions: [
    {
      title: 'Make training accessible and track promotion data',
      description: 'Quick fixes to ensure training inclusion and visibility of career equity.',
      resourceLevel: 'low', costRange: '$0-500', timeRequired: '2-4 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Audit training materials for accessibility (captions, alt text, screen reader).', 'Add accessibility requirements to training procurement.', 'Begin tracking promotion rates by disability status (voluntary disclosure).', 'Brief managers on equitable career conversations.', 'Invite employees with disability to nominate for development programs.', 'Review performance assessment criteria for bias.']
    },
    {
      title: 'Disability-inclusive career development program',
      description: 'Create structured pathways for career advancement.',
      resourceLevel: 'medium', costRange: '$5,000-15,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Launch mentoring program pairing employees with disability with senior leaders.', 'Reserve places in leadership programs for employees with disability.', 'Create accessible e-learning library.', 'Develop disability-inclusive talent identification criteria.', 'Train all managers in inclusive performance management.', 'Report career progression data to leadership.', 'Celebrate career achievements of employees with disability.']
    },
    {
      title: 'Comprehensive disability talent strategy',
      description: 'Strategic approach to disability representation at all levels.',
      resourceLevel: 'high', costRange: '$15,000-40,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage diversity and inclusion consultant.', 'Set representation targets for management and leadership.', 'Create disability leadership pipeline program.', 'Partner with disability-specific recruitment firms for senior roles.', 'Develop sponsorship program (not just mentoring).', 'Integrate disability inclusion into succession planning.', 'Report publicly on disability representation at all levels.', 'Benchmark against AND Access and Inclusion Index.']
    }
  ],
  examples: [
    { businessType: 'general', businessTypeLabel: 'Corporate Office', scenario: 'No employees with disability in management.', solution: 'Launched disability mentoring program. Reserved leadership development places. Made all training accessible. Tracked promotion data.', outcome: 'Three employees with disability promoted to management within 18 months.', cost: '$8,000', timeframe: '6 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Training videos not captioned. Employees with hearing loss excluded.', solution: 'Captioned all training videos. Added Auslan interpretation for key sessions. Created accessible e-learning modules.', outcome: 'Training completion rates for employees with hearing loss matched the average.', cost: '$3,000', timeframe: '2 months' }
  ],
  resources: [
    { title: 'AND Inclusive Employment', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Resources for inclusive career development.', isAustralian: true, isFree: true },
    { title: 'JobAccess Career Support', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'JobAccess', description: 'Career development resources for employees with disability.', isAustralian: true, isFree: true }
  ],
  keywords: ['career development', 'promotion', 'training', 'mentoring', 'leadership', 'equity', 'accessible training']
},

// ─── Entry 8: Disability employment tracking and culture ───
{
  questionId: '5.2-D-2',
  questionText: 'Does your organisation voluntarily track disability employment data?',
  moduleCode: '5.2',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Disability employment tracking and culture',
  coveredQuestionIds: ['5.2-D-3', '5.2-D-8', '5.2-D-11'],
  summary: 'Tracking voluntary disability disclosure, setting employment targets, measuring workplace culture, and monitoring retention helps organisations understand their disability inclusion maturity and identify areas for improvement.',
  lastUpdated: '2026-02-26',
  whyItMatters: {
    text: 'You cannot improve what you do not measure. Without voluntary disclosure data, organisations have no idea how many employees have a disability, what barriers they face, or whether inclusion efforts are working. A safe disclosure culture is essential.',
    statistic: { value: '17.7%', context: 'of working-age Australians have a disability, but most employers estimate their disability employment rate at under 5%. The gap indicates low disclosure, not low representation.', source: 'ABS' }
  },
  tips: [
    { icon: 'BarChart3', text: 'Create a voluntary, confidential disability disclosure mechanism.', priority: 1 },
    { icon: 'Shield', text: 'Guarantee confidentiality and explain why disclosure data is collected.', priority: 2 },
    { icon: 'Target', text: 'Set disability employment targets (e.g., match working-age population rate).', priority: 3 },
    { icon: 'Heart', text: 'Conduct regular inclusion culture surveys including disability-specific questions.', priority: 4 },
    { icon: 'TrendingUp', text: 'Track retention rates for employees with disability vs overall.', priority: 5 }
  ],
  howToCheck: {
    title: 'Auditing employment tracking',
    steps: [
      { text: 'Is there a voluntary disability disclosure mechanism?' },
      { text: 'What is the current disclosure rate?' },
      { text: 'Are disability employment targets set?' },
      { text: 'Is disability included in engagement surveys?' },
      { text: 'Are retention rates tracked by disability status?' },
      { text: 'Is disclosure data kept confidential and used only for aggregate reporting?' }
    ],
    tools: ['HR data', 'Survey results'],
    estimatedTime: '20-30 minutes'
  },
  standardsReference: {
    primary: { code: 'DDA', section: 'Section 15', requirement: 'While not required to collect disability data, doing so helps demonstrate compliance and identify barriers.' },
    related: [{ code: 'UNCRPD', relevance: 'Article 31 requires collection of disaggregated data to assess implementation of obligations.' }],
    plainEnglish: 'Collecting voluntary disability data helps you understand your workforce and improve inclusion. It must be confidential and voluntary.',
    complianceNote: 'Disability disclosure is always voluntary. Never pressure employees to disclose. Create a culture where disclosure feels safe and beneficial.'
  },
  solutions: [
    {
      title: 'Establish voluntary disclosure',
      description: 'Set up a confidential disclosure mechanism.',
      resourceLevel: 'low', costRange: '$0', timeRequired: '1-2 weeks', implementedBy: 'staff', impact: 'quick-win',
      steps: ['Add voluntary disability question to HR system (yes/no/prefer not to say).', 'Communicate purpose and confidentiality to all staff.', 'Set initial target (e.g., 5% disclosure rate in year one).', 'Add disability questions to next engagement survey.', 'Report aggregate data only (never individual).', 'Use results to identify improvement areas.']
    },
    {
      title: 'Disability inclusion measurement program',
      description: 'Comprehensive measurement framework.',
      resourceLevel: 'medium', costRange: '$3,000-8,000', timeRequired: '2-3 months', implementedBy: 'staff', impact: 'moderate',
      steps: ['Design disability-specific engagement survey.', 'Set employment and retention targets.', 'Track recruitment, promotion, and exit data by disability status.', 'Benchmark against AND Access and Inclusion Index.', 'Report to board quarterly.', 'Develop action plans based on findings.', 'Celebrate milestones publicly.']
    },
    {
      title: 'Advanced inclusion analytics',
      description: 'Data-driven disability inclusion with external benchmarking.',
      resourceLevel: 'high', costRange: '$10,000-25,000', timeRequired: '6-12 months', implementedBy: 'specialist', impact: 'significant',
      steps: ['Engage inclusion analytics specialist.', 'Develop comprehensive disability data framework.', 'Integrate disclosure data with HR analytics platform.', 'Conduct pay equity analysis including disability.', 'Benchmark against industry and national data.', 'Publish annual disability inclusion report.', 'Set multi-year targets with board accountability.', 'Join AND Access and Inclusion Index.']
    }
  ],
  examples: [
    { businessType: 'general', businessTypeLabel: 'Corporate', scenario: 'No disability data. Estimated 2% representation.', solution: 'Launched voluntary disclosure campaign with leadership endorsement. Added to engagement survey. Set 10% disclosure target.', outcome: 'Disclosure reached 12% in first year, revealing true representation of 9%. Informed targeted improvements.', cost: '$0', timeframe: '3 months' },
    { businessType: 'local-government', businessTypeLabel: 'Council', scenario: 'Required to report under state legislation.', solution: 'Created confidential disclosure process. Tracked recruitment, retention, and promotion. Published annual report.', outcome: 'Identified retention gap. Targeted support improved retention to parity within 2 years.', cost: '$2,000', timeframe: '6 months' }
  ],
  resources: [
    { title: 'AND Access and Inclusion Index', url: 'https://www.and.org.au/', type: 'tool', source: 'Australian Network on Disability', description: 'Benchmarking tool for disability inclusion including employment data.', isAustralian: true, isFree: false },
    { title: 'AHRC Employment Guide', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guide to disability employment rights and best practice.', isAustralian: true, isFree: true }
  ],
  keywords: ['disclosure', 'employment data', 'targets', 'retention', 'culture survey', 'benchmarking', 'inclusion metrics']
},

// ─── Entry 9: Disability awareness training program ───
{
  questionId: '5.3-F-1',
  questionText: 'Do all customer-facing staff receive disability awareness training?',
  moduleCode: '5.3',
  moduleGroup: 'organisational-commitment',
  diapCategory: 'people-culture',
  title: 'Disability awareness training program',
  coveredQuestionIds: ['5.3-F-2', '5.3-D-1', '5.3-D-2', '5.3-D-7', '5.3-D-11'],
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
    { title: 'AND Disability Confidence Training', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Professional disability awareness training services.', isAustralian: true, isFree: false },
    { title: 'JobAccess Employer Toolkit', url: 'https://www.jobaccess.gov.au/', type: 'guide', source: 'JobAccess', description: 'Free disability awareness resources for employers.', isAustralian: true, isFree: true },
    { title: 'Scope Communication Access Training', url: 'https://www.scopeaust.org.au/', type: 'guide', source: 'Scope Australia', description: 'Training on communicating with people who have communication disability.', isAustralian: true, isFree: false }
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
    statistic: { value: '80%+', context: 'of disabilities are invisible. If your staff only think about wheelchair users, they are missing the vast majority of customers with disability.', source: 'Australian Network on Disability' }
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
    { title: 'Accessible Equipment Checklist', url: 'https://www.and.org.au/', type: 'checklist', source: 'Australian Network on Disability', description: 'Checklist for accessibility equipment management.', isAustralian: true, isFree: true }
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
    { title: 'AND Supplier Guidelines', url: 'https://www.and.org.au/', type: 'guide', source: 'Australian Network on Disability', description: 'Guidance on accessible procurement practices.', isAustralian: true, isFree: true }
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
    { title: 'AND Contract Clauses Guide', url: 'https://www.and.org.au/', type: 'template', source: 'Australian Network on Disability', description: 'Template accessibility clauses for contracts.', isAustralian: true, isFree: true },
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
    { title: 'AND Access and Inclusion Index', url: 'https://www.and.org.au/', type: 'tool', source: 'Australian Network on Disability', description: 'Comprehensive benchmarking tool for accessibility maturity.', isAustralian: true, isFree: false },
    { title: 'AHRC DIAP Monitoring', url: 'https://humanrights.gov.au/', type: 'guide', source: 'Australian Human Rights Commission', description: 'Guidance on monitoring and reporting DIAP progress.', isAustralian: true, isFree: true }
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
    { businessType: 'general', businessTypeLabel: 'Corporate', scenario: 'Wanted to demonstrate accessibility leadership.', solution: 'Published first accessibility report. Participated in AND Index. Presented results at industry conference.', outcome: 'Ranked in top 10 AND Index. Media coverage. Talent attraction improved.', cost: '$10,000', timeframe: '3 months' }
  ],
  resources: [
    { title: 'AND Access and Inclusion Index', url: 'https://www.and.org.au/', type: 'tool', source: 'Australian Network on Disability', description: 'Australia\'s leading disability inclusion benchmarking program.', isAustralian: true, isFree: false },
    { title: 'Global Reporting Initiative', url: 'https://www.globalreporting.org/', type: 'guide', source: 'GRI', description: 'Framework for sustainability reporting including disability.', isFree: true }
  ],
  keywords: ['reporting', 'benchmarking', 'transparency', 'annual report', 'AND Index', 'public reporting', 'roadmap']
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
    { businessType: 'accommodation', businessTypeLabel: 'Hotel Group', scenario: 'Wanted to celebrate accessibility progress.', solution: 'Nominated for AND Employer of Choice award. Published blog series on accessibility journey. Hosted International Day of People with Disability event.', outcome: 'Won award. Media coverage. Employee pride. Community engagement strengthened.', cost: '$3,000', timeframe: '3 months' }
  ],
  resources: [
    { title: 'International Day of People with Disability', url: 'https://www.idpwd.com.au/', type: 'website', source: 'IDPWD', description: 'Resources for celebrating International Day of People with Disability on 3 December.', isAustralian: true, isFree: true },
    { title: 'AND Awards', url: 'https://www.and.org.au/', type: 'website', source: 'Australian Network on Disability', description: 'Information about disability inclusion awards and recognition programs.', isAustralian: true, isFree: true }
  ],
  keywords: ['co-design', 'engagement', 'community', 'awards', 'sharing learnings', 'IDPwD', 'recognition', 'advocacy']
}

];

export default organisationHelp;
