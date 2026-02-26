import type { TrainingCourse } from '../types';

export const aiAccessibleResourcesCourse: TrainingCourse = {
  id: 'course-ai-accessible-resources',
  slug: 'ai-accessible-resources',
  title: 'Using AI to Create Accessible & Inclusive Resources',
  subtitle: 'A practical mini-program for creating Easy Read, Plain Language, social stories, sensory maps, and more',
  description: 'Learn to use AI tools like Claude, ChatGPT, Copilot, and Gemini to create high-quality accessible resources. This beginner-friendly program walks you through structured prompting methods and real-world exercises.',
  longDescription: 'This seven-lesson program teaches you a practical, repeatable method for using generative AI to create accessible and inclusive resources. You will learn to create Easy Read documents, Plain Language content, social stories, pre-visit guides, sensory maps, visual schedules, large print materials, and accessibility guides. Each lesson includes video instruction, hands-on exercises, reusable prompt templates, and quality checklists aligned with Inclusion Australia guidelines and the Australian Government Style Manual.',
  category: 'ai-tools',
  accessTier: 'premium',
  totalEstimatedMinutes: 160,
  skillLevel: 'beginner',
  featured: true,
  author: 'Flare Access',
  publishedDate: '2026-02-27',
  lastUpdated: '2026-02-27',
  keywords: [
    'AI', 'accessible resources', 'Easy Read', 'Plain Language', 'social stories',
    'sensory maps', 'visual schedules', 'inclusive communications', 'ChatGPT',
    'Claude', 'Copilot', 'Gemini', 'prompt engineering', 'disability inclusion',
  ],
  learningOutcomes: [
    'Use a structured 5-step prompting method to produce accessible content with AI',
    'Create Easy Read documents that follow Inclusion Australia guidelines',
    'Write social stories and pre-visit guides for neurodiverse audiences',
    'Produce sensory maps, visual schedules, and accessibility guides',
    'Convert existing documents to Plain Language and Large Print formats',
    'Apply quality review checklists to ensure content meets Australian standards',
    'Maintain and update accessible resources as part of an ongoing workflow',
  ],
  prerequisites: [
    'No prior AI experience required',
    'Basic computer literacy (web browsing, copy-paste, file management)',
    'Access to at least one AI tool (free tiers of ChatGPT, Claude, Copilot, or Gemini are sufficient)',
  ],
  courseDownloads: [
    {
      title: 'Complete Course Workbook',
      description: 'All prompt templates, quality checklists, and exercise worksheets in one document',
      fileName: 'ai-accessible-resources-workbook.pdf',
      fileUrl: '/training/downloads/ai-accessible-resources-workbook.pdf',
      fileType: 'PDF',
      fileSize: '3.2 MB',
    },
  ],
  lessons: [
    // ========================================
    // LESSON 1: Why Accessible Resources Matter
    // ========================================
    {
      id: 'lesson-1-why-accessible',
      courseId: 'course-ai-accessible-resources',
      title: 'Why Accessible Resources Matter',
      subtitle: 'The case for inclusive communications',
      description: 'Understand who benefits from accessible resources, why they matter, and what formats you will learn to create in this program.',
      order: 1,
      estimatedMinutes: 15,
      accessTier: 'free',
      isPreview: true,
      keywords: ['accessible resources', 'literacy', 'inclusion', 'overview'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000001',
            title: 'Why Accessible Resources Matter',
            duration: '8:30',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'The accessibility gap in everyday communications',
          body: `<p>44% of Australian adults have literacy levels below what is needed to cope with the demands of everyday life (ABS, Programme for the International Assessment of Adult Competencies). That means nearly half of your potential audience may struggle with standard documents, forms, and communications.</p>
<p>Accessible resources are not just "nice to have." They are essential for reaching people with:</p>
<ul>
<li>Intellectual disability or learning difficulties</li>
<li>Low English literacy or English as an additional language</li>
<li>Autism and other neurodivergent conditions</li>
<li>Acquired brain injury or cognitive fatigue</li>
<li>Sensory processing differences</li>
<li>Age-related cognitive changes</li>
</ul>
<p>When you create accessible resources, you improve the experience for everyone, not just people with disability. This is the "curb-cut effect": improvements designed for accessibility benefit all users.</p>`,
        },
        {
          type: 'text',
          heading: 'What you will create in this program',
          body: `<p>Over seven lessons, you will learn to use AI tools to create:</p>
<ul>
<li><strong>Easy Read documents</strong> using short sentences, simple words, and supporting images</li>
<li><strong>Plain Language content</strong> that is clear, concise, and jargon-free</li>
<li><strong>Social stories</strong> that prepare people for new experiences</li>
<li><strong>Pre-visit guides</strong> with step-by-step information about visiting a venue</li>
<li><strong>Sensory maps</strong> that describe the sensory environment of a space</li>
<li><strong>Visual schedules</strong> that show a sequence of events or activities</li>
<li><strong>Large print materials</strong> that meet typographic accessibility standards</li>
<li><strong>Accessibility guides</strong> that describe the access features of a venue or service</li>
</ul>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'info',
            text: 'This program uses a tool-agnostic approach. The prompting methods work with Claude, ChatGPT, Microsoft Copilot, Google Gemini, and other generative AI tools. You only need access to one.',
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Resource formats covered in this program',
            items: [
              'Easy Read (Inclusion Australia guidelines)',
              'Plain Language (Australian Government Style Manual)',
              'Social stories (Carol Gray framework)',
              'Pre-visit guides',
              'Sensory maps',
              'Visual schedules',
              'Large print (18pt minimum)',
              'Accessibility guides',
            ],
          },
        },
        {
          type: 'text',
          heading: 'How AI fits in',
          body: `<p>AI does not replace the need for consultation with people with disability, but it dramatically reduces the time and cost of creating a first draft. A document that might take days to write from scratch can be drafted in minutes, freeing you to focus on review, refinement, and co-design.</p>
<p>In the next lesson, you will learn the Structured Prompting Method: a 5-step approach that produces consistently high-quality results from any AI tool.</p>`,
        },
      ],
    },

    // ========================================
    // LESSON 2: The Structured Prompting Method
    // ========================================
    {
      id: 'lesson-2-structured-prompting',
      courseId: 'course-ai-accessible-resources',
      title: 'The Structured Prompting Method',
      subtitle: 'A 5-step framework for reliable AI outputs',
      description: 'Learn the 5-step Structured Prompting Method that produces consistently high-quality accessible content from any AI tool.',
      order: 2,
      estimatedMinutes: 25,
      accessTier: 'premium',
      keywords: ['prompting', 'structured method', 'AI', 'framework'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000002',
            title: 'The Structured Prompting Method',
            duration: '12:15',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'The 5-step method',
          body: `<p>The Structured Prompting Method gives you a repeatable framework for getting high-quality, accessible content from AI tools. Each step builds on the previous one:</p>
<ol>
<li><strong>Role</strong>: Tell the AI what expert role to adopt (e.g., "You are an accessibility communications specialist")</li>
<li><strong>Audience</strong>: Define who the content is for (e.g., "adults with intellectual disability" or "families preparing for their first visit")</li>
<li><strong>Format</strong>: Specify the output format and its rules (e.g., "Easy Read: one idea per sentence, no jargon, suggest image placement")</li>
<li><strong>Content</strong>: Provide the source material or topic to be transformed</li>
<li><strong>Constraints</strong>: Add quality criteria, word limits, tone, standards to follow, and anything to avoid</li>
</ol>
<p>When you include all five steps, the AI has enough context to produce a strong first draft that needs only minor editing rather than a complete rewrite.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'Start with the full 5-step prompt. You can shorten it in follow-up messages once the AI has context, but always give the complete framework in your first message of a conversation.',
          },
        },
        {
          type: 'text',
          heading: 'Anatomy of a structured prompt',
          body: `<p>Here is how the five steps look when combined into a single prompt:</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Create a Plain Language version',
            instructions: 'Take a paragraph from your organisation\'s website (e.g., an "About Us" section, a policy statement, or a service description) and use the Structured Prompting Method to convert it to Plain Language. Paste the original text where indicated in the prompt template below.',
            promptTemplate: `Role: You are a Plain Language specialist who follows the Australian Government Style Manual.

Audience: General public readers, including people with low English literacy and people who use English as an additional language. Aim for a reading level equivalent to Year 7-8 (age 12-13).

Format: Plain Language. Use short sentences (under 20 words where possible). Use active voice. Use common words instead of jargon. Use headings to break up content. Use dot points for lists.

Content: Please rewrite the following text in Plain Language:

[PASTE YOUR ORIGINAL TEXT HERE]

Constraints:
- Keep the meaning and all important facts
- Do not add information that is not in the original
- Aim for 40-60% fewer words than the original
- Flag any technical terms that cannot be simplified (and provide a brief definition)
- Use Australian English spelling`,
            expectedOutcome: 'A clear, concise version of your original text that a Year 7-8 student could understand, with any unavoidable technical terms defined.',
            tips: [
              'Choose text that is currently hard to read (long sentences, jargon, passive voice)',
              'Compare the AI output side-by-side with the original to check that no meaning was lost',
              'If the AI misses a key fact, ask it to add it back in a follow-up message',
              'Try the same text in two different AI tools and compare the results',
            ],
            exampleOutput: `Original (62 words):
"The organisation endeavours to facilitate optimal outcomes for all stakeholders through the implementation of comprehensive accessibility protocols that are aligned with current legislative requirements and international best-practice frameworks, ensuring that all individuals regardless of their abilities are afforded equitable access to services, programs, and facilities."

Plain Language (32 words):
"We work to make our services, programs, and facilities accessible to everyone. We follow Australian accessibility laws and international best-practice guidelines. Our goal is equal access for all people, including people with disability."`,
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'example',
            text: 'Notice how the rewrite uses "we" instead of "the organisation," replaces "endeavours to facilitate optimal outcomes" with "work to make," and breaks one 62-word sentence into three short sentences. That is the power of Plain Language.',
          },
        },
        {
          type: 'text',
          heading: 'Iterating and refining',
          body: `<p>Your first AI output is a draft, not a final product. Use follow-up prompts to refine:</p>
<ul>
<li>"Make sentence 3 shorter."</li>
<li>"Replace [technical term] with a simpler word."</li>
<li>"Add a heading before the section about [topic]."</li>
<li>"This is still too complex. Simplify further for a Year 5 reading level."</li>
</ul>
<p>Iteration is normal and expected. Two or three rounds of refinement usually produce an excellent result.</p>`,
        },
      ],
    },

    // ========================================
    // LESSON 3: Creating Easy Read Documents
    // ========================================
    {
      id: 'lesson-3-easy-read',
      courseId: 'course-ai-accessible-resources',
      title: 'Creating Easy Read Documents',
      subtitle: 'Inclusion Australia guidelines and AI workflows',
      description: 'Learn Easy Read principles, formatting rules from Inclusion Australia, and how to use AI to create Easy Read content with proper image placement suggestions.',
      order: 3,
      estimatedMinutes: 30,
      accessTier: 'premium',
      keywords: ['Easy Read', 'Inclusion Australia', 'intellectual disability', 'simple language'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000003',
            title: 'Creating Easy Read Documents with AI',
            duration: '14:45',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'What is Easy Read?',
          body: `<p>Easy Read is a way of writing information so it is easier to understand. It was developed for people with intellectual disability, but it benefits many people including those with low literacy, acquired brain injury, or English as an additional language.</p>
<p>Easy Read uses:</p>
<ul>
<li>Short sentences with one idea each</li>
<li>Simple, everyday words</li>
<li>Pictures next to the text to support meaning</li>
<li>Large font (minimum 16pt, recommended 14-16pt for body text)</li>
<li>Plenty of white space</li>
<li>Left-aligned text (never justified)</li>
<li>No background images or watermarks</li>
</ul>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Easy Read is not the same as Plain Language. Easy Read is simpler, uses images, and typically has one sentence per line. Plain Language is simpler than standard writing but still uses paragraphs and more complex sentence structures.',
          },
        },
        {
          type: 'text',
          heading: 'Inclusion Australia guidelines',
          body: `<p>Inclusion Australia (formerly the Australian Council for Intellectual Disability) publishes guidelines for Easy Read. Key rules:</p>
<ul>
<li>One idea per sentence</li>
<li>Maximum 15 words per sentence (aim for fewer)</li>
<li>Use common words. If you must use a hard word, explain it right away</li>
<li>Write in first person ("we") or second person ("you")</li>
<li>Use active voice ("We will help you" not "You will be helped")</li>
<li>Every sentence or key idea should have a supporting image on the left</li>
<li>Use real photographs or clear, simple illustrations (not clip art)</li>
<li>Number pages and include a contents page for longer documents</li>
<li>Test with people with intellectual disability before publishing</li>
</ul>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Create an Easy Read document',
            instructions: 'Choose a short document from your organisation (a policy summary, welcome letter, or event information) and use the prompt template below to create an Easy Read version. After the AI produces the text, you will need to add images manually or use an image-generation tool.',
            promptTemplate: `Role: You are an Easy Read content specialist. You follow Inclusion Australia's guidelines for creating Easy Read information.

Audience: Adults with intellectual disability. The content must be understandable by people with a reading age of approximately 8-10 years.

Format: Easy Read. Follow these rules strictly:
- One idea per sentence
- Maximum 15 words per sentence
- Use common, everyday words only
- If a hard word is unavoidable, explain it immediately in brackets
- Write in second person ("you") where possible
- Use active voice only
- Left-aligned text
- After each sentence, add [IMAGE: brief description of a supporting image]
- Number each section

Content: Please convert the following text to Easy Read format:

[PASTE YOUR ORIGINAL TEXT HERE]

Constraints:
- Do not add information that is not in the original
- Do not use metaphors, idioms, or figures of speech
- Do not use abbreviations unless you explain them first
- Keep the document structure logical (introduction, main points, what to do next)
- Use Australian English spelling
- At the end, list any hard words you had to include and their Easy Read definitions`,
            expectedOutcome: 'An Easy Read version of your document with one sentence per line, image placement suggestions, and a word list for any unavoidable complex terms.',
            tips: [
              'Start with a short document (under 500 words) for your first attempt',
              'Check that every sentence truly has only one idea',
              'The [IMAGE] suggestions are for you to source real photos. Do not publish AI-generated image descriptions as actual images',
              'Ask someone with intellectual disability or a self-advocacy group to review the final version',
            ],
            exampleOutput: `Easy Read version:

1. Welcome to our centre

You can visit our centre any day of the week.
[IMAGE: Photo of the centre entrance with the front door open]

The centre is open from 9 in the morning to 5 in the afternoon.
[IMAGE: A clock showing 9:00 and another showing 5:00]

You do not need to book before you come.
[IMAGE: A person walking through a door, looking happy]

2. What you can do here

You can swim in the pool.
[IMAGE: A person swimming in an indoor pool]

You can use the gym.
[IMAGE: A person using gym equipment]

You can join a group class.
[IMAGE: A group of people exercising together]

Hard words:
- Centre: A building where you go to do activities
- Gym: A room with machines and weights for exercise`,
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Easy Read quality checklist',
            items: [
              'Every sentence has only one idea',
              'No sentence exceeds 15 words',
              'All hard words are explained immediately',
              'Every key idea has an image suggestion',
              'Text uses "you" or "we" (not third person)',
              'All sentences use active voice',
              'No metaphors, idioms, or figures of speech',
              'No abbreviations without explanation',
              'Content follows a logical order',
              'A contents page is included for documents over 4 pages',
            ],
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'When sourcing images for Easy Read, prioritise real photographs over illustrations. Stock photo sites with diversity filters can help you find images that represent people with disability. Always check image licensing before use.',
          },
        },
      ],
    },

    // ========================================
    // LESSON 4: Social Stories and Pre-Visit Guides
    // ========================================
    {
      id: 'lesson-4-social-stories',
      courseId: 'course-ai-accessible-resources',
      title: 'Social Stories and Pre-Visit Guides',
      subtitle: 'Preparing people for new experiences',
      description: 'Learn the structure of social stories (Carol Gray framework) and pre-visit guides, then create your own using AI prompt templates.',
      order: 4,
      estimatedMinutes: 25,
      accessTier: 'premium',
      keywords: ['social stories', 'pre-visit guides', 'autism', 'neurodiverse'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000004',
            title: 'Social Stories and Pre-Visit Guides',
            duration: '11:30',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'What are social stories?',
          body: `<p>Social stories were developed by Carol Gray in 1991. They are short, personalised stories that describe a situation, skill, or concept using specific guidelines. They help people (particularly autistic people and children) understand what to expect in a new or unfamiliar situation.</p>
<p>A social story follows a specific sentence ratio:</p>
<ul>
<li><strong>Descriptive sentences</strong>: Describe what happens ("The library has many books on shelves.")</li>
<li><strong>Perspective sentences</strong>: Describe how others might feel or think ("Some people like to read quietly.")</li>
<li><strong>Directive sentences</strong>: Gently suggest a response ("I can try to use a quiet voice in the library.")</li>
<li><strong>Affirmative sentences</strong>: Express a shared value ("It is good to be kind to others.")</li>
</ul>
<p>The ratio should be at least 2 descriptive/perspective/affirmative sentences for every 1 directive sentence. Social stories should never be punitive or use "must" language.</p>`,
        },
        {
          type: 'text',
          heading: 'What are pre-visit guides?',
          body: `<p>Pre-visit guides are practical, step-by-step documents that help someone prepare for visiting a venue or attending an event. They typically include:</p>
<ul>
<li>Photos of the exterior, entrance, and key areas</li>
<li>Information about what will happen, in chronological order</li>
<li>Sensory information (noise levels, lighting, smells)</li>
<li>Practical details (parking, toilets, food, quiet spaces)</li>
<li>What to bring and what to expect</li>
<li>Contact information if help is needed</li>
</ul>
<p>While social stories are personal ("I will..."), pre-visit guides are informational ("The venue has..."). Both reduce anxiety by removing uncertainty.</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Create a social story or pre-visit guide',
            instructions: 'Choose a venue or experience your organisation offers. Use the prompt template below to create either a social story (for a child or young person visiting for the first time) or a pre-visit guide (for an adult or family preparing for a visit).',
            promptTemplate: `Role: You are a specialist in creating social stories and pre-visit guides for neurodiverse individuals. You follow Carol Gray's Social Story framework and understand sensory processing.

Audience: [Choose one]
Option A - Social story: A child (age 6-12) who is autistic and visiting [YOUR VENUE/EVENT] for the first time. The story is written in first person ("I").
Option B - Pre-visit guide: An adult or family including a neurodiverse member, preparing to visit [YOUR VENUE/EVENT].

Format: [Choose one]
Option A - Social story:
- Written in first person ("I will...", "I can...")
- Use at least 2 descriptive/perspective sentences for every 1 directive sentence
- Never use "must," "should," or punitive language
- Each sentence has a [PHOTO] suggestion
- 10-15 sentences total
- Gentle, reassuring tone

Option B - Pre-visit guide:
- Step-by-step chronological order (before you arrive, arriving, during your visit, leaving)
- Include sensory information for each area (noise level, lighting, smells)
- Include practical information (parking, toilets, food, quiet spaces)
- [PHOTO] suggestions for each step
- Written in second person ("you")

Content: The venue/event is [DESCRIBE YOUR VENUE OR EVENT: include name, type of venue, what happens there, any sensory features like noise or lighting, key areas visitors go to, and any accessibility features you have].

Constraints:
- Use simple, concrete language
- Avoid idioms, metaphors, and abstract concepts
- Include what the person might see, hear, feel, and smell
- Include at least one reference to what to do if feeling overwhelmed (quiet space, asking for help)
- Australian English spelling`,
            expectedOutcome: 'A complete social story (10-15 sentences with correct sentence ratio) or pre-visit guide (chronological steps with sensory details) tailored to your specific venue.',
            tips: [
              'Provide as much detail about your venue as possible. The more context you give, the more specific and useful the output',
              'For social stories, read the output aloud. Does it sound calm and reassuring?',
              'For pre-visit guides, walk through the visit yourself and check that no step is missing',
              'Include information about what happens if plans change (e.g., a show is cancelled) to reduce anxiety about unexpected changes',
            ],
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Social stories should always be reviewed by someone with expertise in autism and/or by autistic people themselves. AI can produce a strong draft, but lived experience review is essential for tone and accuracy.',
          },
        },
      ],
    },

    // ========================================
    // LESSON 5: Sensory Maps, Visual Schedules, and Accessibility Guides
    // ========================================
    {
      id: 'lesson-5-sensory-maps',
      courseId: 'course-ai-accessible-resources',
      title: 'Sensory Maps, Visual Schedules and Accessibility Guides',
      subtitle: 'Creating spatial and sequential accessible resources',
      description: 'Learn format principles for sensory maps, visual schedules, and accessibility guides, then create one for your venue using AI.',
      order: 5,
      estimatedMinutes: 25,
      accessTier: 'premium',
      keywords: ['sensory maps', 'visual schedules', 'accessibility guides', 'wayfinding'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000005',
            title: 'Sensory Maps, Visual Schedules, and Accessibility Guides',
            duration: '11:00',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'Sensory maps',
          body: `<p>A sensory map describes the sensory environment of a space: what you might see, hear, feel, and smell in each area. They help people with sensory processing differences plan their visit and identify areas they might want to avoid or spend more time in.</p>
<p>Key elements of a sensory map:</p>
<ul>
<li><strong>Area-by-area breakdown</strong>: Each distinct zone or room gets its own section</li>
<li><strong>Sensory dimensions</strong>: Sound level (quiet/moderate/loud), lighting (dim/natural/bright/fluorescent), smells (food/chemicals/neutral), textures (flooring type, seating material), temperature</li>
<li><strong>Variability notes</strong>: "This area gets louder during peak times (11am-2pm)"</li>
<li><strong>Quiet spaces</strong>: Where to go for a sensory break</li>
<li><strong>Visual format</strong>: Best presented as a floor plan overlay or area-by-area table</li>
</ul>`,
        },
        {
          type: 'text',
          heading: 'Visual schedules',
          body: `<p>A visual schedule shows a sequence of events or activities using images and short text. They are commonly used for:</p>
<ul>
<li>Daily programs at camps or day services</li>
<li>Event timelines (what happens first, next, last)</li>
<li>Step-by-step processes (checking in, using a self-service kiosk)</li>
</ul>
<p>Each step should have: a number, a simple image or icon, a short label (2-5 words), and optionally a time.</p>`,
        },
        {
          type: 'text',
          heading: 'Accessibility guides',
          body: `<p>An accessibility guide (sometimes called an Access Statement or Accessibility Information page) describes the access features of a venue or service. It covers:</p>
<ul>
<li>Physical access: ramps, lifts, door widths, accessible toilets, parking</li>
<li>Sensory access: hearing loops, quiet spaces, lighting, tactile features</li>
<li>Communication: staff training, Auslan, Easy Read materials available</li>
<li>Getting there: accessible transport options, drop-off zones</li>
<li>What to expect: typical noise, crowd levels, and duration</li>
<li>Contact: who to call with access questions</li>
</ul>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Create a sensory map, visual schedule, or accessibility guide',
            instructions: 'Choose the format most relevant to your venue or service and use the prompt template below. Provide as much detail about your space as possible.',
            promptTemplate: `Role: You are an accessibility content specialist experienced in creating sensory maps, visual schedules, and accessibility guides for venues and events.

Audience: People with disability, their families, and support workers who are planning a visit. Content should be useful for people with sensory processing differences, mobility requirements, and communication needs.

Format: [Choose one]
Option A - Sensory map: Create an area-by-area sensory description with these columns: Area Name | Sound Level (quiet/moderate/loud) | Lighting (dim/natural/bright/fluorescent) | Smells | Floor Surface | Temperature | Notes. Include a "Quiet Spaces" section and a "Peak Times" note.

Option B - Visual schedule: Create a numbered, step-by-step schedule with: Step Number | Time (if applicable) | Activity | [IMAGE suggestion] | Duration | Notes. One step per line.

Option C - Accessibility guide: Create a structured accessibility guide with sections: Getting Here, Parking, Entrance, Moving Around Inside, Toilets, Sensory Environment, Communication & Assistance, Food & Drink, Quiet Spaces, Emergency Procedures, Contact for Access Questions.

Content: My venue/event is: [DESCRIBE YOUR VENUE: name, type, layout, number of areas/rooms, typical noise levels, lighting, flooring, what happens there, any existing access features, typical visit duration].

Constraints:
- Use factual, specific language (e.g., "3 accessible parking bays within 20m of the entrance" not "accessible parking available")
- Include measurements where relevant (door widths, ramp gradients, distances)
- Note any features that change by time of day or season
- Australian English spelling
- If information is unknown, mark it as [TO CONFIRM] rather than guessing`,
            expectedOutcome: 'A structured, detailed document you can refine and publish on your website or provide as a printed handout.',
            tips: [
              'Walk through your venue with this template and fill in real measurements and observations before running the prompt',
              'For sensory maps, visit at different times of day. A cafe at 8am is very different from the same cafe at 12pm',
              'Ask staff who work in each area to verify sensory descriptions',
              'For accessibility guides, check that all information is current. Outdated accessibility information is worse than none',
            ],
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'For sensory maps, consider creating a simple visual overlay on your floor plan using colour coding: green (calm), yellow (moderate), red (intense). Many free design tools (Canva, Google Drawings) make this straightforward.',
          },
        },
      ],
    },

    // ========================================
    // LESSON 6: Large Print, Plain Language, and Other Formats
    // ========================================
    {
      id: 'lesson-6-other-formats',
      courseId: 'course-ai-accessible-resources',
      title: 'Large Print, Plain Language and Other Formats',
      subtitle: 'Converting existing content to accessible formats',
      description: 'Learn large print standards, the distinction between Plain Language and Easy Read, and how to convert existing documents into accessible formats.',
      order: 6,
      estimatedMinutes: 20,
      accessTier: 'premium',
      keywords: ['large print', 'Plain Language', 'accessible formats', 'conversion'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000006',
            title: 'Large Print, Plain Language, and Other Formats',
            duration: '9:45',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'Large print standards',
          body: `<p>Large print is one of the most commonly requested accessible formats, yet many organisations get it wrong. Key standards:</p>
<ul>
<li><strong>Minimum 18pt font</strong> for body text (Vision Australia recommends 18pt as large print, 24pt+ for giant print)</li>
<li><strong>Sans-serif fonts</strong>: Arial, Helvetica, Verdana, or Calibri. Avoid decorative fonts</li>
<li><strong>Bold for headings</strong>, not italics (italics are harder to read at large sizes)</li>
<li><strong>High contrast</strong>: Black text on white or cream background. Avoid coloured text on coloured backgrounds</li>
<li><strong>Line spacing</strong>: 1.5 to 2.0 line spacing</li>
<li><strong>Left-aligned only</strong>: Never justified text (uneven word spacing is hard to track)</li>
<li><strong>Matte paper</strong>: Glossy paper causes glare. Use uncoated or matte stock</li>
<li><strong>No text over images</strong>: Text must be on a plain background</li>
</ul>`,
        },
        {
          type: 'text',
          heading: 'Plain Language vs Easy Read',
          body: `<p>These two formats are often confused. Here is how they differ:</p>
<p><strong>Plain Language</strong> (covered in Lesson 2) targets the general public. It uses short sentences, active voice, and common words, but still uses paragraphs, moderate sentence complexity, and assumes basic literacy. Reading level target: Year 7-8 (age 12-13).</p>
<p><strong>Easy Read</strong> (covered in Lesson 3) targets people with intellectual disability or very low literacy. It uses one idea per sentence, images supporting every concept, and much simpler vocabulary. Reading level target: Year 3-4 (age 8-10).</p>
<p>For most organisations, you should offer both: Plain Language as your default communication style, and Easy Read as an alternative format available on request or downloadable from your website.</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Convert an existing document',
            instructions: 'Take a document your organisation currently publishes (a policy, brochure, form, or webpage) and use the prompt below to convert it to Large Print format guidelines AND Plain Language in one pass.',
            promptTemplate: `Role: You are a document accessibility specialist experienced in creating large print and Plain Language versions of standard business documents.

Audience: People with low vision (large print version) and the general public including people with low literacy (Plain Language version).

Format: Provide TWO versions of the content:

VERSION 1 - Large Print formatting instructions:
- Reformat the content for 18pt Arial
- Add [HEADING - 24pt Bold] markers for section headings
- Break long paragraphs into shorter ones (max 4-5 sentences)
- Replace any tables with linear lists
- Note where images should be removed or repositioned
- Add [PAGE BREAK] suggestions for logical page breaks

VERSION 2 - Plain Language rewrite:
- Short sentences (under 20 words where possible)
- Active voice throughout
- Common words replacing jargon (with a jargon-to-plain glossary at the end)
- Headings every 2-3 paragraphs
- Dot points for lists

Content: Please convert the following document:

[PASTE YOUR DOCUMENT TEXT HERE]

Constraints:
- Preserve all essential information and meaning
- Do not add information not in the original
- Flag anything that may need a subject matter expert to simplify
- Australian English spelling
- For the large print version, note any content that would not work well at 18pt (e.g., complex diagrams, dense tables)`,
            expectedOutcome: 'Two ready-to-use versions of your document: one with large print formatting guidance, and one rewritten in Plain Language.',
            tips: [
              'For the large print version, actually set your word processor to 18pt Arial and see how it looks before publishing',
              'Test the Plain Language version with someone outside your industry to check if they understand it',
              'Forms are particularly challenging. Consider whether the form itself can be simplified, not just the language',
            ],
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'info',
            text: 'Other accessible formats to consider: audio descriptions, Auslan (Australian Sign Language) video translations, Braille, and digital accessible formats (tagged PDFs, HTML). AI can help draft the text content, but specialist providers are needed for Auslan, Braille, and audio production.',
          },
        },
      ],
    },

    // ========================================
    // LESSON 7: Review, Refine, and Maintain
    // ========================================
    {
      id: 'lesson-7-review-refine',
      courseId: 'course-ai-accessible-resources',
      title: 'Review, Refine and Maintain',
      subtitle: 'Quality assurance and ongoing workflows',
      description: 'Learn to review AI-generated content against the Australian Government Style Manual and Inclusion Australia guidelines, set up a maintenance workflow, and plan next steps.',
      order: 7,
      estimatedMinutes: 20,
      accessTier: 'premium',
      keywords: ['quality review', 'Style Manual', 'maintenance', 'co-design', 'workflow'],
      contentBlocks: [
        {
          type: 'video',
          video: {
            vimeoId: '000000007',
            title: 'Review, Refine, and Maintain',
            duration: '10:00',
            hasCaptions: true,
            hasTranscript: true,
          },
        },
        {
          type: 'text',
          heading: 'Why review matters',
          body: `<p>AI produces drafts, not final products. Every piece of accessible content should go through a review process before publication. This lesson gives you a structured review workflow and the checklists to make it efficient.</p>
<p>Common AI mistakes to watch for:</p>
<ul>
<li><strong>Hallucinated details</strong>: AI may add information not in your source material</li>
<li><strong>Inconsistent reading level</strong>: Some sentences may be too complex for the target audience</li>
<li><strong>Missing cultural context</strong>: AI may not account for Australian-specific terminology or conventions</li>
<li><strong>Passive voice creep</strong>: Despite instructions, AI sometimes reverts to passive constructions</li>
<li><strong>Over-simplification</strong>: Important nuance or safety information may be lost</li>
<li><strong>Tone issues</strong>: Social stories may sound condescending if not carefully tuned</li>
</ul>`,
        },
        {
          type: 'text',
          heading: 'The review workflow',
          body: `<p>Follow this 4-step review process for every AI-generated accessible document:</p>
<ol>
<li><strong>Accuracy check</strong>: Compare side-by-side with the source. Is all essential information present? Has anything been added that was not in the original?</li>
<li><strong>Format compliance</strong>: Use the relevant checklist (Easy Read, Plain Language, Large Print, etc.) to verify format rules are followed</li>
<li><strong>Readability test</strong>: Read the content aloud. Does it flow naturally? Would the target audience understand every sentence?</li>
<li><strong>Lived experience review</strong>: Have the content reviewed by someone from the target audience, or by an advocacy organisation. This is the most important step and cannot be replaced by AI</li>
</ol>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Exercise: Peer review using the quality checklist',
            instructions: 'Take one of the documents you created in a previous lesson (Easy Read, social story, or Plain Language version) and work through the review checklist below. Mark each item as Pass, Fail, or N/A. Fix any failures using a follow-up AI prompt or manual editing.',
            promptTemplate: `Role: You are a quality reviewer for accessible content. You check content against Inclusion Australia Easy Read guidelines and the Australian Government Style Manual for Plain Language.

Audience: Internal team member reviewing AI-generated accessible content before publication.

Format: Review the following content and provide:
1. A completed checklist (Pass/Fail/N/A for each item)
2. Specific issues found (with line references)
3. Suggested fixes for each issue
4. An overall quality rating (Ready to publish / Needs minor edits / Needs major revision)

Content: Please review this [Easy Read / Plain Language / Social Story / Pre-visit Guide]:

[PASTE YOUR AI-GENERATED CONTENT HERE]

Constraints:
- Be specific about what needs changing and why
- Reference the relevant guideline for each issue
- Suggest exact replacement text where possible
- Check for Australian English spelling
- Verify the sentence-to-directive ratio for social stories (at least 2:1)`,
            expectedOutcome: 'A detailed review report with specific, actionable feedback you can use to polish the content for publication.',
            tips: [
              'Do not skip the lived experience review step. AI can check format compliance but cannot assess whether content truly makes sense to the target audience',
              'Keep a log of common issues you find. Over time, you can add these to your prompt constraints to prevent them',
              'Build review into your content calendar. Schedule reviews at creation and then every 6-12 months for currency',
            ],
          },
        },
        {
          type: 'text',
          heading: 'Maintenance workflow',
          body: `<p>Accessible resources need ongoing maintenance. Set up this workflow:</p>
<ul>
<li><strong>Content calendar</strong>: Schedule a review of each accessible document every 6-12 months</li>
<li><strong>Trigger-based updates</strong>: Update whenever the source content changes (new opening hours, new services, renovations)</li>
<li><strong>Version control</strong>: Keep the AI conversation/prompts you used so you can re-run them with updated content</li>
<li><strong>Feedback loop</strong>: Add a "Was this helpful?" feedback mechanism to published resources</li>
<li><strong>Format register</strong>: Maintain a list of which documents have which accessible versions, and when each was last updated</li>
</ul>`,
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Your accessible resources action plan',
            items: [
              'Identify your top 5 documents that need accessible versions',
              'Create Easy Read and Plain Language versions of at least one key document',
              'Publish a pre-visit guide or social story for your main venue/service',
              'Add a sensory map or accessibility guide to your website',
              'Set up a review schedule (6-month and 12-month check-ins)',
              'Establish a feedback mechanism for accessible resources',
              'Save your prompt templates for reuse and iteration',
              'Connect with a disability advocacy organisation for lived experience review',
            ],
          },
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'Save your best prompts in a shared document or prompt library. When a team member needs to create a new accessible resource, they can start from a proven template rather than starting from scratch. This ensures consistency and quality across your organisation.',
          },
        },
        {
          type: 'text',
          heading: 'Congratulations and next steps',
          body: `<p>You have completed the "Using AI to Create Accessible & Inclusive Resources" program. You now have the skills and templates to create:</p>
<ul>
<li>Easy Read documents following Inclusion Australia guidelines</li>
<li>Plain Language content meeting Style Manual standards</li>
<li>Social stories using the Carol Gray framework</li>
<li>Pre-visit guides with sensory and practical information</li>
<li>Sensory maps, visual schedules, and accessibility guides</li>
<li>Large print materials meeting vision accessibility standards</li>
</ul>
<p>Remember: AI accelerates the creation process, but the quality of your accessible resources ultimately depends on review, refinement, and input from people with lived experience of disability. Keep practising, keep iterating, and keep including people with disability in the process.</p>`,
        },
      ],
    },
  ],
};
