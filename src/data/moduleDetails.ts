/**
 * Extended Module Details
 *
 * Provides additional context for each module to help users understand
 * what's covered, why it matters, and who benefits.
 */

export interface ModuleDetail {
  id: string;
  overview: string;
  topics: string[];
  whyMatters: string;
  whoHelps: string[];
}

export const MODULE_DETAILS: Record<string, ModuleDetail> = {
  // ============================================
  // BEFORE THEY ARRIVE
  // ============================================
  'B1': {
    id: 'B1',
    overview: 'This module helps you communicate accessibility information before customers visit. When people can find out what to expect, they can plan with confidence and feel welcome before they even arrive.',
    topics: [
      'Creating an accessibility page or guide',
      'What information to include (parking, entrances, toilets, sensory environment)',
      'Where to share accessibility information',
      'Using photos and virtual tours',
      'Keeping information up to date',
    ],
    whyMatters: 'Many people with disability research venues before visiting. Without clear information, they may assume your business isn\'t accessible and go elsewhere. Providing pre-visit information reduces anxiety, prevents wasted trips, and shows you welcome everyone.\n\nIn Australia, 1 in 5 people have a disability, and they influence the spending decisions of family and friends. When someone with disability finds clear accessibility information on your website, they don\'t just visit themselves—they recommend you to others. Conversely, a lack of information often means a lost customer who never even contacts you to ask.',
    whoHelps: [
      'People who use wheelchairs or mobility aids',
      'People with chronic pain or fatigue who need to plan rest breaks',
      'Autistic people and those with anxiety who benefit from knowing what to expect',
      'Deaf and hard of hearing people checking for communication support',
      'Parents with prams and elderly visitors',
    ],
  },
  'B4.1': {
    id: 'B4.1',
    overview: 'This module covers the fundamentals of making your website accessible to everyone, including people who use screen readers, keyboard navigation, or have visual impairments.',
    topics: [
      'Text alternatives for images (alt text)',
      'Colour contrast and readability',
      'Keyboard navigation',
      'Clear headings and structure',
      'Mobile accessibility',
      'Testing your website with accessibility tools',
    ],
    whyMatters: 'Your website is often the first interaction customers have with your business. If it\'s not accessible, you\'re excluding millions of Australians with disability from finding information, making bookings, or purchasing from you.\n\nWeb accessibility isn\'t just ethical—it\'s increasingly a legal requirement. The Disability Discrimination Act applies to websites, and complaints are rising. Beyond compliance, accessible websites often perform better in search rankings, work better on mobile devices, and provide a better experience for all users, including older people and those with temporary impairments.',
    whoHelps: [
      'Blind and vision impaired people using screen readers',
      'People with low vision who need larger text or high contrast',
      'People with motor disabilities who navigate by keyboard',
      'People with cognitive disabilities who benefit from clear structure',
      'Older adults experiencing age-related vision or dexterity changes',
    ],
  },
  'B4.2': {
    id: 'B4.2',
    overview: 'This module helps you make online booking, ticketing, and forms accessible so everyone can complete transactions independently.',
    topics: [
      'Accessible form design',
      'Clear error messages and validation',
      'Time limits and session management',
      'Accessible date and time pickers',
      'Capturing accessibility requirements',
      'Confirmation and receipt accessibility',
    ],
    whyMatters: 'Complicated or inaccessible booking systems force people to call or email for help, creating extra work for everyone. Accessible booking means independence, dignity, and more completed transactions.\n\nEvery abandoned booking is lost revenue. When forms time out too quickly, error messages are unclear, or date pickers don\'t work with keyboards, customers give up. Studies show that accessible checkout processes have higher completion rates across all users, not just those with disabilities. Small improvements here directly impact your bottom line.',
    whoHelps: [
      'Screen reader users completing forms',
      'People with cognitive disabilities who need clear instructions',
      'People with motor disabilities who struggle with complex interfaces',
      'Customers who need extra time to complete bookings',
      'Anyone requesting accessibility accommodations',
    ],
  },
  'B4.3': {
    id: 'B4.3',
    overview: 'This module covers making your video content, social media, and audio materials accessible to everyone.',
    topics: [
      'Adding captions to videos',
      'Audio descriptions for visual content',
      'Accessible social media posts',
      'Alt text for images on social platforms',
      'Podcast and audio accessibility',
      'Live streaming considerations',
    ],
    whyMatters: 'Video and social media are powerful marketing tools, but without captions and descriptions, you\'re excluding deaf, blind, and hard of hearing audiences. Accessible content also helps people watching without sound and improves SEO.\n\nSocial media platforms increasingly reward accessible content with better algorithmic reach. Captions increase video engagement by up to 40% because most people scroll with sound off. Audio descriptions open your content to the 357,000+ Australians who are blind or have low vision. Making your content accessible isn\'t just inclusive—it\'s smart marketing.',
    whoHelps: [
      'Deaf and hard of hearing people (captions)',
      'Blind and vision impaired people (audio descriptions)',
      'People watching in noisy environments or with sound off',
      'Non-native English speakers',
      'People with cognitive disabilities who benefit from multiple formats',
    ],
  },
  'B5': {
    id: 'B5',
    overview: 'This module helps you communicate about accessibility before people visit—ensuring your language is clear, welcoming, and helps customers plan with confidence.',
    topics: [
      'Plain language principles and readability',
      'Respectful, person-centred disability language',
      'Positive framing of accessibility features',
      'Information findability and completeness',
      'Communicating your accessibility commitment',
      'Alternative formats and how to mention them',
      'Visual content (photos, videos, virtual tours)',
      'Content creator training and style guides',
    ],
    whyMatters: 'How you communicate about accessibility shapes whether customers feel genuinely welcome. Complex language, buried information, or negative framing can deter visitors before they even contact you.\n\nNearly half of Australian adults have literacy levels that affect their daily lives. When you use plain language, you\'re not "dumbing down"—you\'re communicating effectively. Clear, findable, and positively framed accessibility information helps customers decide if your venue works for them and plan their visit with confidence. The language you use also signals whether you see accessibility as a priority or an afterthought.',
    whoHelps: [
      'People with cognitive disabilities who benefit from plain language',
      'People with learning disabilities like dyslexia',
      'Autistic visitors who want to know what to expect',
      'People from culturally diverse backgrounds',
      'Anyone researching venues before visiting',
      'Older adults who prefer straightforward information',
    ],
  },
  'B6': {
    id: 'B6',
    overview: 'This module helps you create inclusive marketing that represents and speaks to the full diversity of your potential customers.',
    topics: [
      'Inclusive imagery and representation',
      'Avoiding stereotypes and tokenism',
      'Diverse casting in advertising',
      'Accessible marketing materials',
      'Language that welcomes everyone',
      'Consulting with disability communities',
    ],
    whyMatters: 'People with disability rarely see themselves represented in marketing. Inclusive representation signals that your business welcomes them, while stereotypical or absent representation does the opposite.\n\nResearch shows that consumers increasingly expect brands to reflect diversity. Inclusive advertising doesn\'t just appeal to people with disability—it resonates with the 65% of consumers who say diversity in advertising influences their purchasing decisions. Authentic representation (not tokenism) builds trust and loyalty with a much broader audience than you might expect.',
    whoHelps: [
      'People with visible disabilities who want to see themselves represented',
      'People with invisible disabilities who feel excluded by narrow representations',
      'Families and friends of people with disability',
      'Your broader customer base who values inclusive businesses',
    ],
  },

  // ============================================
  // GETTING IN AND MOVING AROUND
  // ============================================
  'A1': {
    id: 'A1',
    overview: 'This module covers how customers arrive at your premises, including parking, drop-off zones, and the path from transport to your entrance.',
    topics: [
      'Accessible parking spaces and signage',
      'Drop-off and pick-up zones',
      'Path of travel from parking/transport',
      'Surface conditions and obstacles',
      'Lighting and visibility',
      'Connections to public transport',
    ],
    whyMatters: 'The customer journey starts before your front door. If someone can\'t park nearby or navigate from the street to your entrance, they can\'t access your business at all.\n\nAccessible parking isn\'t just about having a space with a wheelchair symbol—it\'s about the entire arrival experience. Is the path from parking to your door step-free? Is it well-lit at night? Are there obstacles like sandwich boards or outdoor furniture? Many businesses lose customers who drive past, see no accessible parking, and don\'t return. First impressions matter, and arrival is your first impression.',
    whoHelps: [
      'Wheelchair users and people with mobility aids',
      'People with chronic pain or limited walking distance',
      'Parents with prams',
      'Elderly customers',
      'Delivery drivers and service providers',
    ],
  },
  'A2': {
    id: 'A2',
    overview: 'This module covers your entrance, including doors, steps, ramps, and how people know where to come in.',
    topics: [
      'Step-free access and ramps',
      'Door width, weight, and operation',
      'Automatic and accessible door options',
      'Entry signage and visibility',
      'Doorbells and intercom systems',
      'Managing temporary access barriers',
    ],
    whyMatters: 'Heavy doors, steps, and narrow entrances are some of the most common physical barriers. Even a single step can completely block access for wheelchair users.\n\nYour entrance is a statement about who\'s welcome. When someone struggles with a heavy door or faces an unexpected step, they feel like an afterthought. Simple solutions often exist—automatic door buttons, portable ramps, or just propping a door open during business hours. The cost of these solutions is typically far less than the revenue lost from excluded customers.',
    whoHelps: [
      'Wheelchair users and people using walking frames',
      'People with limited upper body strength',
      'Parents with prams and strollers',
      'Delivery people with trolleys',
      'Anyone with temporary mobility restrictions',
    ],
  },
  'A3a': {
    id: 'A3a',
    overview: 'This module covers internal navigation, including aisle widths, floor surfaces, obstacles, and how people move through your space.',
    topics: [
      'Clear path widths and turning spaces',
      'Floor surfaces and trip hazards',
      'Obstacle management and clear sightlines',
      'Stairs, ramps, and level changes',
      'Lifts and escalators',
      'Staff assistance for navigation',
    ],
    whyMatters: 'Getting in is only the first step. If customers can\'t move freely through your space, reach products, or access all areas, they\'re not getting the full experience.\n\nCluttered aisles and poor layouts affect everyone, but they\'re dealbreakers for wheelchair users who need 900mm clear width to pass and 1500mm to turn. Vision impaired people may not see that stack of boxes or that A-frame sign. Good spatial design improves flow, reduces accidents, and creates a more pleasant experience for all customers—not just those with disabilities.',
    whoHelps: [
      'Wheelchair users needing clear paths and turning space',
      'Vision impaired people navigating obstacles',
      'People with balance issues on uneven surfaces',
      'Parents manoeuvring prams',
      'Anyone carrying luggage or equipment',
    ],
  },
  'A3b': {
    id: 'A3b',
    overview: 'This module covers managing queues, waiting areas, and busy periods to ensure everyone can wait comfortably and fairly.',
    topics: [
      'Queue management systems',
      'Seating in waiting areas',
      'Priority service options',
      'Communication during waits',
      'Managing peak periods',
      'Alternatives to standing queues',
    ],
    whyMatters: 'Long queues and standing waits can be painful or impossible for many people. Without alternatives, you force some customers to choose between their health and your service.\n\nQueue anxiety affects more people than you might think. Someone with an invisible disability may look fine but be in significant pain. A person with anxiety may leave rather than wait in a crowded space. Offering alternatives—seating while waiting, text notifications, or priority service for those who need it—costs little but dramatically improves the experience for vulnerable customers.',
    whoHelps: [
      'People with chronic pain who cannot stand for long',
      'Pregnant women and elderly customers',
      'People with invisible disabilities like heart conditions',
      'Autistic people who find crowds overwhelming',
      'Parents managing children',
    ],
  },
  'A4': {
    id: 'A4',
    overview: 'This module covers seating arrangements, table heights, and furniture that works for customers with different needs.',
    topics: [
      'Variety of seating options',
      'Table heights and clearance',
      'Moveable furniture flexibility',
      'Accessible counter heights',
      'Space between furniture',
      'Seating in different areas',
    ],
    whyMatters: 'Fixed seating, bar-height tables, and cramped layouts exclude wheelchair users and many others. Flexible furniture options mean everyone can be comfortable.\n\nConsider the wheelchair user who arrives for a business lunch only to find all tables are bar-height. Or the person with back pain faced with backless stools. They may manage once, but they won\'t return—and they\'ll tell others. Offering a variety of seating options at different heights, with different support levels, costs little more than uniform furniture but serves many more customers.',
    whoHelps: [
      'Wheelchair users needing table clearance',
      'People who need chairs with arms or back support',
      'Larger-bodied customers',
      'People with young children',
      'Anyone needing space for mobility aids or equipment',
    ],
  },
  'A5': {
    id: 'A5',
    overview: 'This module covers accessible toilets, baby change facilities, and amenities that meet diverse customer needs.',
    topics: [
      'Accessible toilet facilities',
      'Grab rails and transfer space',
      'Accessible baby change facilities',
      'Changing Places toilets',
      'Sanitary disposal and sharps bins',
      'Signage and wayfinding to amenities',
    ],
    whyMatters: 'Inaccessible toilets can prevent people from visiting at all or limit how long they can stay. This is one of the most critical accessibility features.\n\nToilet access is non-negotiable. Without it, visits are cut short or avoided entirely. Many "accessible" toilets fail because they\'re used for storage, lack grab rails, or don\'t have enough transfer space. For people with stomas, continence needs, or who require assistance, toilet facilities determine whether they can participate in public life at all. Getting this right shows genuine commitment to inclusion.',
    whoHelps: [
      'Wheelchair users needing transfer space',
      'People with stomas or continence needs',
      'Parents with young children',
      'People with hidden disabilities',
      'Older adults needing grab rails',
    ],
  },
  'A6': {
    id: 'A6',
    overview: 'This module covers the sensory environment of your space, including lighting, sound levels, and creating comfortable conditions for everyone.',
    topics: [
      'Lighting levels and control',
      'Acoustic environment and noise management',
      'Quiet spaces and low-sensory areas',
      'Sensory-friendly sessions or times',
      'Temperature and ventilation',
      'Managing overwhelming stimuli',
    ],
    whyMatters: 'Bright lights, loud music, and busy environments can be physically painful or overwhelming for many people, including autistic people and those with sensory processing differences.\n\nSensory accessibility is increasingly recognised but still often overlooked. Around 1 in 70 Australians are autistic, and many more have sensory sensitivities due to anxiety, PTSD, migraines, or neurological conditions. Offering quiet hours, adjustable lighting, or simply being aware of sensory overload can transform an inaccessible space into a welcoming one. These changes often benefit everyone—who doesn\'t prefer a less overwhelming environment?',
    whoHelps: [
      'Autistic people who may be sensory sensitive',
      'People with migraines or light sensitivity',
      'Deaf and hard of hearing people in noisy environments',
      'People with PTSD or anxiety',
      'Older adults with sensory changes',
    ],
  },
  'A6a': {
    id: 'A6a',
    overview: 'This module covers equipment and resources you provide for customers, ensuring they are accessible to people with different abilities.',
    topics: [
      'Accessible self-service equipment',
      'Screen and display accessibility',
      'Touch screen alternatives',
      'Adjustable and flexible equipment',
      'Assistance animal facilities',
      'Equipment for loan (wheelchairs, hearing loops)',
    ],
    whyMatters: 'Touch screens, kiosks, and equipment designed for one type of user exclude many others. Accessible equipment means everyone can participate independently.\n\nSelf-service is everywhere now, but inaccessible kiosks and equipment create new barriers. A touch screen mounted too high for wheelchair users, a PIN pad without tactile markers, or ordering systems with no audio—these force people to ask for help or give up entirely. When you\'re investing in equipment, accessibility should be a purchasing criterion, not an afterthought.',
    whoHelps: [
      'Vision impaired people using equipment',
      'People with motor disabilities operating controls',
      'Deaf people needing visual alternatives to audio',
      'Wheelchair users accessing screens at different heights',
      'Anyone unfamiliar with technology',
    ],
  },
  'A7': {
    id: 'A7',
    overview: 'This module covers emergency procedures and safety planning for customers with disability.',
    topics: [
      'Accessible emergency alarms (visual and audio)',
      'Evacuation procedures for people with disability',
      'Personal Emergency Evacuation Plans (PEEPs)',
      'Staff training for emergency assistance',
      'Refuge areas and communication',
      'First aid and medical emergency readiness',
    ],
    whyMatters: 'In emergencies, people with disability may not hear alarms, move quickly, or know what to do. Without proper planning, their safety is at risk.\n\nEmergency planning for people with disability isn\'t optional—it\'s a workplace health and safety requirement and a moral imperative. When alarms only sound audibly, deaf customers don\'t know to evacuate. When evacuation plans only use stairs, wheelchair users are stranded. Taking time now to plan for different needs could save lives. It also demonstrates to all customers that you take their safety seriously.',
    whoHelps: [
      'Deaf people who may not hear alarms',
      'Wheelchair users and people with mobility limitations',
      'Blind people unfamiliar with emergency routes',
      'People with cognitive disabilities needing clear instructions',
      'Anyone who may need assistance to evacuate',
    ],
  },
  'B2': {
    id: 'B2',
    overview: 'This module covers signage and wayfinding systems that help everyone navigate your space independently.',
    topics: [
      'Clear and readable signage',
      'Colour contrast and visibility',
      'Pictograms and universal symbols',
      'Tactile and braille signage',
      'Digital wayfinding options',
      'Consistent and logical placement',
    ],
    whyMatters: 'Good signage benefits everyone but is essential for people with vision impairments, cognitive disabilities, or anyone unfamiliar with your space. Poor signage creates confusion and dependence on staff.\n\nThink about how frustrating it is to wander around looking for a toilet or exit. Now imagine doing that with low vision or a cognitive disability that makes reading difficult. Clear, consistent signage with good contrast, readable fonts, and intuitive symbols allows people to navigate independently with dignity. It also reduces the burden on your staff who otherwise spend time giving directions.',
    whoHelps: [
      'Vision impaired people needing large print or tactile signs',
      'People with cognitive disabilities needing clear symbols',
      'Deaf people relying on visual information',
      'Anyone unfamiliar with your venue',
      'People in a hurry or under stress',
    ],
  },
  'B3': {
    id: 'B3',
    overview: 'This module covers printed materials like menus, brochures, and price lists, ensuring they are readable and available in accessible formats.',
    topics: [
      'Font size and readability',
      'Colour contrast in print materials',
      'Alternative formats (large print, audio, digital)',
      'QR codes linking to accessible versions',
      'Menu accessibility in hospitality',
      'Plain language in written materials',
    ],
    whyMatters: 'Small print, fancy fonts, and low contrast make materials unreadable for many people. Accessible print materials ensure everyone can access the information they need.\n\nThat stylish menu with pale grey text on white paper? Unreadable for the 13% of men and 1% of women with colour vision deficiency, plus anyone with low vision or in dim lighting. Simple fixes—larger fonts, better contrast, offering a digital version via QR code—cost almost nothing but make a huge difference. Accessible documents also help people who\'ve forgotten their glasses or are reading in bright sunlight.',
    whoHelps: [
      'People with low vision or age-related vision changes',
      'People with dyslexia or reading difficulties',
      'Non-native English speakers',
      'Anyone in low light conditions',
      'People who prefer digital access',
    ],
  },
  'D1': {
    id: 'D1',
    overview: 'This module covers how customers access information during their visit through signage, printed materials, real-time communication, and on-site support.',
    topics: [
      'On-site alternative formats (large print, Easy Read, audio)',
      'Digital information access (QR codes, apps)',
      'Signage readability and wayfinding',
      'Tactile information and Braille',
      'Hearing support signage',
      'Real-time captioning for live events',
      'Audio information and descriptions',
      'Communication supports (boards, pen and paper)',
      'Communicating changes and disruptions',
    ],
    whyMatters: 'Pre-visit information is only part of the picture. Once customers arrive, they need to navigate your space, understand what\'s available, and communicate with your team—all in real time.\n\nGood on-site information reduces anxiety and builds independence. Readable signage, clear wayfinding, and available alternative formats mean customers can find what they need without constantly asking for help. Communication supports ensure customers who communicate differently can interact with your staff effectively. When information is accessible during the visit, customers feel welcomed and respected throughout their experience.',
    whoHelps: [
      'People with low vision who need large print or audio',
      'Deaf and hard of hearing people needing visual information and captioning',
      'People who are blind needing tactile and audio information',
      'People who communicate differently or use AAC devices',
      'Autistic people who benefit from clear, predictable information',
      'Anyone unfamiliar with your venue',
    ],
  },

  // ============================================
  // SERVICE AND SUPPORT
  // ============================================
  'S1': {
    id: 'S1',
    overview: 'This module covers how customers can contact you, the communication channels you offer, and how you accommodate different communication needs and preferences.',
    topics: [
      'Phone call alternatives (email, SMS, chat)',
      'National Relay Service (NRS) training',
      'Capturing communication preferences',
      'Response time parity across channels',
      'Supporting customers with speech differences',
      'AAC (Augmentative and Alternative Communication) awareness',
      'Quiet spaces for communication',
      'Written confirmation of conversations',
      'Accessible feedback channels',
      'Flexible response formats',
    ],
    whyMatters: 'Phone calls are inaccessible for many people—those who are deaf, have speech disabilities, experience phone anxiety, or simply prefer other channels. Offering only phone contact excludes a significant portion of potential customers.\n\nEqual service means equal access across all communication channels. If your email takes three days to respond but phone calls get immediate attention, you\'re disadvantaging customers who can\'t use the phone. Capturing and applying communication preferences shows customers you value them as individuals. Patient, skilled communication with customers who communicate differently ensures everyone receives the same quality service.',
    whoHelps: [
      'Deaf and hard of hearing people who can\'t use voice calls',
      'People with speech disabilities who struggle with phone communication',
      'Autistic people who find phone calls stressful',
      'People with anxiety who prefer written communication',
      'Customers who use AAC devices to communicate',
      'Non-native English speakers who prefer written English',
    ],
  },
  'C1': {
    id: 'C1',
    overview: 'This module builds staff confidence in serving customers with disability, covering communication, assistance, and creating welcoming interactions.',
    topics: [
      'Disability awareness fundamentals',
      'Communication tips for different disabilities',
      'Assistance without assumptions',
      'Using respectful language',
      'Supporting assistance animals',
      'Handling difficult situations with grace',
    ],
    whyMatters: 'Staff attitudes and confidence have the biggest impact on customer experience. Well-meaning but awkward interactions can be just as excluding as physical barriers.\n\nPeople with disability consistently report that staff behaviour matters more than physical accessibility. Being ignored, patronised, or treated as incompetent hurts. Conversely, confident, respectful service creates loyalty. Training doesn\'t need to be extensive—basic awareness, communication tips, and permission to ask "How can I help?" goes a long way. Confident staff also feel better about their work.',
    whoHelps: [
      'All customers with disability who interact with staff',
      'Staff who want to help but feel unsure',
      'Customers who need assistance but don\'t want to feel like a burden',
      'People who have had negative experiences elsewhere',
    ],
  },
  'C2': {
    id: 'C2',
    overview: 'This module covers accessible booking, payment, and service delivery options that give customers flexibility and independence.',
    topics: [
      'Flexible booking and cancellation policies',
      'Accessible payment options',
      'Service adjustments and accommodations',
      'Communication preferences',
      'Capturing accessibility needs',
      'Follow-up and feedback',
    ],
    whyMatters: 'Rigid policies and inflexible services create barriers. Customers with disability often need adjustments that aren\'t unreasonable but aren\'t offered unless asked.\n\nFlexibility doesn\'t mean having no policies—it means building in room for reasonable adjustments. A strict no-refund policy excludes people whose health conditions flare unexpectedly. A booking system without an accessibility notes field means customers must call to explain their needs. Small policy changes that allow for human situations benefit everyone, not just people with disability.',
    whoHelps: [
      'Customers whose conditions fluctuate day to day',
      'People who need extra time or modified service',
      'Deaf customers who prefer text communication',
      'Anyone with specific accessibility requirements',
    ],
  },
  'C3': {
    id: 'C3',
    overview: 'This module covers gathering feedback accessibly and responding to reviews and complaints in ways that demonstrate your commitment to improvement.',
    topics: [
      'Accessible feedback forms and surveys',
      'Multiple ways to provide feedback',
      'Responding to accessibility complaints',
      'Managing online reviews about accessibility',
      'Using feedback to improve',
      'Closing the loop with customers',
    ],
    whyMatters: 'If your feedback methods aren\'t accessible, you\'ll never hear from customers with disability about their experiences. Their insights are essential for improvement.\n\nSilence isn\'t satisfaction. When feedback forms are inaccessible, or complaints go nowhere, you lose valuable information. Customers with disability often have detailed knowledge of what works and what doesn\'t—they\'re experts in navigating barriers. Accessible feedback channels, prompt responses, and genuine follow-through turn critics into advocates and complaints into improvements.',
    whoHelps: [
      'Customers with disability who want to share their experience',
      'People who prefer different communication methods',
      'Anyone who has had a problem they want resolved',
      'Your business learning what to improve',
    ],
  },
  'C4': {
    id: 'C4',
    overview: 'This module covers ongoing customer engagement, including newsletters, loyalty programs, and marketing communications that remain accessible.',
    topics: [
      'Accessible email newsletters',
      'Inclusive loyalty programs',
      'Accessible promotional materials',
      'Communication preferences and frequency',
      'Unsubscribe and preference management',
      'Maintaining relationships accessibly',
    ],
    whyMatters: 'Ongoing engagement keeps customers coming back. If your communications aren\'t accessible, customers with disability miss out on offers, updates, and feeling valued.\n\nEvery inaccessible email is a missed opportunity. Newsletters with images but no alt text, loyalty programs requiring inaccessible apps, promotional videos without captions—these exclude customers you\'ve already won. Retention is cheaper than acquisition. Making your ongoing communications accessible keeps valuable customers engaged and shows you care about them beyond the first transaction.',
    whoHelps: [
      'Customers with disability who want to stay connected',
      'Screen reader users receiving emails',
      'People with cognitive disabilities preferring simple communications',
      'Anyone managing communication overload',
    ],
  },
  'S5': {
    id: 'S5',
    overview: 'This module covers how you maintain accessible communication with customers over time through correspondence, documents, and ongoing engagement.',
    topics: [
      'Accessible written correspondence (letters, emails, invoices)',
      'Accessible email design (images, headings, plain text)',
      'Accessible PDF documents and attachments',
      'Email templates for staff',
      'Document templates (Word, InDesign)',
      'Alternative format requests',
      'Remembering communication preferences',
      'Accessible subscription management',
    ],
    whyMatters: 'Your website might be accessible, but what about the invoice you send? The booking confirmation email? The terms and conditions PDF? These ongoing communications are often overlooked, yet they contain important information customers need to understand.\n\nMany PDFs are completely inaccessible to screen reader users. Emails that rely on images with no alt text are meaningless when images are blocked. Complex formatting and small fonts in letters create barriers. Accessible ongoing communication ensures customers can understand important information about their bookings, accounts, and relationship with your business. Remembering their preferences shows you value them as individuals.',
    whoHelps: [
      'Screen reader users who receive your emails and documents',
      'People with low vision who need larger text',
      'People with cognitive disabilities who benefit from clear structure',
      'Customers who prefer specific formats (large print, plain text)',
      'Anyone who needs to refer back to important correspondence',
    ],
  },

  // ============================================
  // POLICY AND OPERATIONS
  // ============================================
  'P1': {
    id: 'P1',
    overview: 'This module helps you create formal accessibility policies, commitments, and inclusion statements that guide your organisation.',
    topics: [
      'Writing an accessibility statement',
      'Accessibility policy development',
      'Leadership commitment and accountability',
      'Communicating your commitments',
      'Integrating accessibility into strategy',
      'Measuring and reporting progress',
    ],
    whyMatters: 'Without formal policies, accessibility depends on individual goodwill rather than organisational commitment. Policies create accountability and signal serious intent.\n\nPublished accessibility commitments do more than guide internal behaviour—they set expectations with customers and create accountability. When accessibility is a documented policy rather than informal goodwill, it survives staff changes, busy periods, and competing priorities. Many government contracts and corporate partnerships now require accessibility policies, making this increasingly a business necessity.',
    whoHelps: [
      'Staff who need guidance on expectations',
      'Customers who want to know your commitments',
      'Leadership making decisions about resources',
      'The organisation building consistent practice',
    ],
  },
  'P2': {
    id: 'P2',
    overview: 'This module covers inclusive employment practices, from recruitment to retention, for people with disability.',
    topics: [
      'Accessible recruitment processes',
      'Workplace adjustments and accommodations',
      'Disclosure and support',
      'Career development for employees with disability',
      'Disability Employment Services partnerships',
      'Creating an inclusive workplace culture',
    ],
    whyMatters: 'People with disability face significant barriers to employment. Inclusive employers access a wider talent pool, benefit from diverse perspectives, and demonstrate genuine commitment to inclusion.\n\nWith unemployment rates for people with disability nearly double the general rate, there\'s an untapped talent pool waiting. Employees with disability often demonstrate exceptional problem-solving skills, loyalty, and commitment. The cost of workplace adjustments is typically far lower than expected—most cost nothing or under $500. Inclusive employment also builds authenticity: it\'s hard to claim you welcome customers with disability while excluding them from your workforce.',
    whoHelps: [
      'Job seekers with disability',
      'Current employees who may acquire disability',
      'Teams benefiting from diverse perspectives',
      'The organisation meeting diversity goals',
    ],
  },
  'P3': {
    id: 'P3',
    overview: 'This module covers staff training and building disability confidence across your organisation.',
    topics: [
      'Disability awareness training options',
      'Role-specific accessibility training',
      'Ongoing learning and refreshers',
      'Training resources and providers',
      'Measuring training effectiveness',
      'Building a learning culture',
    ],
    whyMatters: 'One-off training isn\'t enough. Ongoing learning builds genuine confidence and ensures accessibility becomes embedded in how your team operates.\n\nInitial awareness training is just the start. Real confidence comes from practice, role-specific skills, and reinforcement over time. When staff genuinely understand disability and feel equipped to help, they stop avoiding customers with disability and start engaging naturally. This shift benefits everyone—customers receive better service, staff feel more competent, and accessibility stops being "someone else\'s job."',
    whoHelps: [
      'Staff at all levels building confidence',
      'Customers receiving consistently good service',
      'New employees learning expectations',
      'The organisation developing expertise',
    ],
  },
  'P4': {
    id: 'P4',
    overview: 'This module covers embedding accessibility requirements into procurement, supplier relationships, and partnerships.',
    topics: [
      'Accessibility requirements in tenders',
      'Supplier accessibility assessments',
      'Accessible product and service procurement',
      'Partnership accessibility expectations',
      'Contractor and vendor management',
      'Social procurement and disability enterprises',
    ],
    whyMatters: 'Your accessibility depends on your suppliers and partners. If you procure inaccessible products or services, you create barriers for customers and staff.\n\nEvery product you buy and service you engage affects your accessibility. An inaccessible point-of-sale system, a venue booking platform without keyboard navigation, or printed materials from a supplier who ignores contrast guidelines—these choices accumulate. Building accessibility into procurement ensures you don\'t accidentally create barriers. It also drives market change: when more buyers demand accessibility, more suppliers provide it.',
    whoHelps: [
      'Customers using procured products or services',
      'Staff using workplace tools and systems',
      'Suppliers understanding expectations',
      'Disability enterprises gaining business opportunities',
    ],
  },
  'P5': {
    id: 'P5',
    overview: 'This module covers measuring, tracking, and reporting on accessibility progress over time.',
    topics: [
      'Setting accessibility goals and targets',
      'Accessibility audits and assessments',
      'Tracking progress and metrics',
      'Reporting to stakeholders',
      'Continuous improvement cycles',
      'Celebrating and communicating progress',
    ],
    whyMatters: 'What gets measured gets managed. Without tracking, accessibility improvements are ad hoc rather than strategic. Reporting creates accountability and demonstrates progress.\n\nAccessibility is a journey, not a destination. Regular measurement shows where you\'ve improved and where gaps remain. Reporting to stakeholders—whether your board, customers, or the public—creates accountability that drives action. Celebrating progress motivates teams. And documented improvement provides evidence of due diligence if complaints or legal challenges arise.',
    whoHelps: [
      'Leadership understanding progress',
      'Staff seeing the impact of their efforts',
      'Customers seeing demonstrated commitment',
      'The organisation building evidence of improvement',
    ],
  },
};

/**
 * Get module detail by ID
 */
export function getModuleDetail(moduleId: string): ModuleDetail | undefined {
  return MODULE_DETAILS[moduleId];
}
