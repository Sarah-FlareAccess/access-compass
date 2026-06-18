import type { TrainingCourse } from '../types';

export const aiAccessibleCommsCourse: TrainingCourse = {
  id: 'course-ai-accessible-comms',
  slug: 'ai-accessible-comms',
  title: 'Using AI to Create Accessible & Inclusive Communications',
  subtitle: 'A practical 2-hour workshop. Walk in with content. Walk out with a draft.',
  description: 'Use free AI tools to draft accessible content for your business in around 2 hours. Choose your format, bring your source material and leave with a real first draft you can refine and publish.',
  longDescription: 'This 4-lesson workshop pairs ChatGPT (as your drafting assistant) with Claude (as your reviewer and formatting checklist builder) to produce one piece of accessible content in a single session. You will set up saved AI instructions, brief the AI on your business and audience, draft your content in your chosen format, sense-check the output against accessibility standards and use Claude to build an accessibility formatting checklist you can apply. The AI gives you a structured checklist (heading levels, alt text suggestions, link rewrites, table notes, document properties, typography) of what to apply in Word — or, for Large Print, in your design tool if that\'s where the layout lives. Six formats covered: Easy Read, Plain Language, Social Story / Visual Narrative, Accessibility Guide, Large Print and Accessible Word Document (following the Australian Government Style Manual, equivalent state-government guidance, moving toward WCAG 2.2 AA conformance). PDF accessibility verification is out of scope (it needs a paid external tool such as Adobe Acrobat Pro). The full prompt pack travels home with you so you can keep going on more content after the session. This workshop is positioned upstream of consultation, never as a substitute. Lived-experience review, co-design with the disability community, your DIAP / DAIP process and specialist producers for high-stakes content (every format has its own producer ecosystem) remain essential.',
  category: 'ai-tools',
  accessTier: 'premium',
  totalEstimatedMinutes: 128,
  skillLevel: 'beginner',
  featured: true,
  author: 'Flare Access',
  publishedDate: '2026-05-18',
  lastUpdated: '2026-05-18',
  keywords: [
    'AI', 'accessible communications', 'Easy Read', 'Plain Language',
    'social story', 'visual narrative', 'accessibility guide', 'large print',
    'accessible Word', 'WCAG 2.2 AA',
    'Australian Government Style Manual',
    'ChatGPT', 'Claude', 'Copilot', 'Gemini',
    'prompt engineering', 'workshop', 'cohort', 'pilot',
  ],
  learningOutcomes: [
    'Set up a reusable AI assistant configured for accessible content drafting',
    'Brief an AI on your business, your audience and your source material',
    'Draft a first version of accessible content in your chosen format',
    'Use Claude to sense-check your draft against accessibility standards',
    'Use Claude to build an accessibility formatting checklist aligned to the Australian Government Style Manual, equivalent state-government guidance and WCAG 2.2 AA, then apply it in Word or your design tool',
    'Apply a human review checklist before publishing',
    'Take home a reusable prompt pack covering six alternative formats',
  ],
  prerequisites: [
    'A ChatGPT account at chat.openai.com (free is fine, a paid Plus / Team / Enterprise account works too)',
    'A Claude account at claude.ai (free is fine, a paid Pro / Team / Enterprise account works too). Microsoft Copilot or Google Gemini are also fine as drafting alternatives.',
    'A laptop or desktop computer. Not a phone, screens are too small for this work.',
    'At least 400 words of real source material from your business. Workable options: a webpage section, an FAQ, a policy excerpt, a brochure section, a menu page, signage copy or detailed bullet-point notes. Below 400 words the AI starts inventing access details, which is high-risk for content you intend to publish.',
  ],
  courseDownloads: [
    {
      title: 'Prompt Booklet: Easy Read (PDF)',
      description: 'Every prompt for an Easy Read piece in one printable file: system prompt, reviewer, briefing, build prompt, iteration prompts, sense-check, accessibility formatting checklist and reset.',
      fileName: 'prompt-booklet-easy-read.pdf',
      fileUrl: '/training/downloads/prompt-booklet-easy-read.pdf',
      fileType: 'PDF',
      fileSize: '116 KB',
    },
    {
      title: 'Prompt Booklet: Easy Read (TXT)',
      description: 'The same Easy Read booklet as plain text, ready to paste individual prompts into AI tools.',
      fileName: 'prompt-booklet-easy-read.txt',
      fileUrl: '/training/downloads/prompt-booklet-easy-read.txt',
      fileType: 'TXT',
      fileSize: '26 KB',
    },
    {
      title: 'Prompt Booklet: Plain Language (PDF)',
      description: 'Every prompt for a Plain Language piece in one printable file: system prompt, reviewer, briefing, build prompt, iteration prompts, sense-check, accessibility formatting checklist and reset.',
      fileName: 'prompt-booklet-plain-language.pdf',
      fileUrl: '/training/downloads/prompt-booklet-plain-language.pdf',
      fileType: 'PDF',
      fileSize: '115 KB',
    },
    {
      title: 'Prompt Booklet: Plain Language (TXT)',
      description: 'The same Plain Language booklet as plain text.',
      fileName: 'prompt-booklet-plain-language.txt',
      fileUrl: '/training/downloads/prompt-booklet-plain-language.txt',
      fileType: 'TXT',
      fileSize: '25 KB',
    },
    {
      title: 'Prompt Booklet: Social Story / Visual Narrative (PDF)',
      description: 'Every prompt for a Social Story / Visual Narrative in one printable file.',
      fileName: 'prompt-booklet-social-story-visual-narrative.pdf',
      fileUrl: '/training/downloads/prompt-booklet-social-story-visual-narrative.pdf',
      fileType: 'PDF',
      fileSize: '116 KB',
    },
    {
      title: 'Prompt Booklet: Social Story / Visual Narrative (TXT)',
      description: 'The same Social Story booklet as plain text.',
      fileName: 'prompt-booklet-social-story-visual-narrative.txt',
      fileUrl: '/training/downloads/prompt-booklet-social-story-visual-narrative.txt',
      fileType: 'TXT',
      fileSize: '26 KB',
    },
    {
      title: 'Prompt Booklet: Accessibility Guide (PDF)',
      description: 'Every prompt for an Accessibility Guide in one printable file.',
      fileName: 'prompt-booklet-accessibility-guide.pdf',
      fileUrl: '/training/downloads/prompt-booklet-accessibility-guide.pdf',
      fileType: 'PDF',
      fileSize: '116 KB',
    },
    {
      title: 'Prompt Booklet: Accessibility Guide (TXT)',
      description: 'The same Accessibility Guide booklet as plain text.',
      fileName: 'prompt-booklet-accessibility-guide.txt',
      fileUrl: '/training/downloads/prompt-booklet-accessibility-guide.txt',
      fileType: 'TXT',
      fileSize: '25 KB',
    },
    {
      title: 'Prompt Booklet: Accessible Word Document (PDF)',
      description: 'Every prompt for making an existing Word doc more accessible and inclusive in one printable file. Includes brand-colour contrast checking and the locked-copy override.',
      fileName: 'prompt-booklet-accessible-word-document.pdf',
      fileUrl: '/training/downloads/prompt-booklet-accessible-word-document.pdf',
      fileType: 'PDF',
      fileSize: '119 KB',
    },
    {
      title: 'Prompt Booklet: Accessible Word Document (TXT)',
      description: 'The same Accessible Word Document booklet as plain text.',
      fileName: 'prompt-booklet-accessible-word-document.txt',
      fileUrl: '/training/downloads/prompt-booklet-accessible-word-document.txt',
      fileType: 'TXT',
      fileSize: '29 KB',
    },
    {
      title: 'Prompt Booklet: Large Print (PDF)',
      description: 'Every prompt for a Large Print reformat in one printable file. Includes brand-colour contrast checking and the locked-copy override.',
      fileName: 'prompt-booklet-large-print.pdf',
      fileUrl: '/training/downloads/prompt-booklet-large-print.pdf',
      fileType: 'PDF',
      fileSize: '116 KB',
    },
    {
      title: 'Prompt Booklet: Large Print (TXT)',
      description: 'The same Large Print booklet as plain text.',
      fileName: 'prompt-booklet-large-print.txt',
      fileUrl: '/training/downloads/prompt-booklet-large-print.txt',
      fileType: 'TXT',
      fileSize: '26 KB',
    },
    {
      title: 'Human Review Checklist (PDF)',
      description: 'Printable checklist for the final human review pass before publishing. Use alongside any of the format booklets.',
      fileName: 'human-review-checklist.pdf',
      fileUrl: '/training/downloads/human-review-checklist.pdf',
      fileType: 'PDF',
      fileSize: '96 KB',
    },
    {
      title: 'Human Review Checklist (TXT)',
      description: 'The same checklist as plain text.',
      fileName: 'human-review-checklist.txt',
      fileUrl: '/training/downloads/human-review-checklist.txt',
      fileType: 'TXT',
      fileSize: '3 KB',
    },
  ],
  lessons: [
    {
      id: 'lesson-1-get-set-up',
      courseId: 'course-ai-accessible-comms',
      title: 'Get Set Up',
      subtitle: 'Tools, accounts and persistent AI instructions',
      description: 'Open your AI tools, set up a project or custom instructions and paste in the AI assistant and Reviewer prompts so both are ready when you start drafting.',
      order: 1,
      estimatedMinutes: 13,
      accessTier: 'free',
      isPreview: true,
      keywords: ['setup', 'ChatGPT', 'Claude', 'system prompt', 'custom instructions'],
      contentBlocks: [
        {
          type: 'text',
          heading: 'Before you start: what this course is for',
          body: `<p><strong>This course is for first drafts.</strong> AI-assisted drafting is fast and produces a usable starting point, but a draft is not finished content. Treat what comes out of this workshop as the beginning of a process, not the end of it.</p>
<p><strong>The course works well for:</strong></p>
<ul>
<li>SMEs and small venues drafting their first accessible content</li>
<li>Councils and authorities producing internal staff briefings or first-pass public content</li>
<li>Multi-site organisations building reusable templates</li>
<li>Anyone moving from "we have no accessible content" to "we have a working draft to refine"</li>
</ul>
<p><strong>The course does NOT replace:</strong></p>
<ul>
<li>Lived-experience review or co-design with the disability community. Where you have the resourcing for these, use them. Where you do not, at minimum get one or two readers from your target audience to react to the draft before publishing.</li>
<li>Hiring someone who specialises in making your format. For high-stakes content (NDIS plans, health information, legal terms, behaviour support, crisis content), commission a provider instead of publishing an AI draft.</li>
<li>Your DIAP, DAIP or AAP consultation process</li>
<li>Any statutory consultation requirements that may apply to your organisation</li>
</ul>
<p>This workshop sits upstream of those processes, never as a substitute for them.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Do not use this workshop to draft these content types: behaviour support documentation, crisis information (mental health helplines, emergency procedures, family violence resources), content for very young children, content about Aboriginal and Torres Strait Islander communities, NDIS plan documents, legal terms or contracts, diagnostic or clinical information. For these, commission a specialist producer or work with the relevant community directly.',
          },
        },
        {
          type: 'text',
          heading: 'What you will achieve in this lesson',
          body: `<p>By the end of this lesson, your ChatGPT and Claude accounts are ready, your AI assistant has its instructions and you have sent a successful test message to both tools.</p>
<p><strong>What you need:</strong></p>
<ul>
<li>A laptop, PC or desktop computer with a working internet connection</li>
<li>An email address for signing up to ChatGPT and Claude if you do not already have accounts</li>
</ul>`,
        },
        {
          type: 'text',
          heading: 'Step 1: Open your tools (3 min)',
          body: `<p>Open these in separate browser tabs:</p>
<ol>
<li><strong>ChatGPT</strong> (<a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">chat.openai.com</a>) or your preferred drafting AI tool</li>
<li><strong>Claude</strong> (<a href="https://claude.ai" target="_blank" rel="noopener noreferrer">claude.ai</a>)</li>
</ol>
<p>Sign in or create a free account for each.</p>
<p><strong>Optional alternative for your drafting tool:</strong> If your business uses Microsoft 365, you can use <a href="https://copilot.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft Copilot</a> instead of ChatGPT. If you use Google Workspace, <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer">Google Gemini</a> is the equivalent. The prompts in this course work in all four tools.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'Claude often produces the highest quality drafts for accessible content. Its free tier has tighter daily message limits than ChatGPT, so we use ChatGPT as the drafting tool during the session (lots of iteration) and Claude as the reviewer (fewer messages). After the session, try a draft in Claude and compare. You may find it becomes your default once you see the quality difference.',
          },
        },
        {
          type: 'text',
          heading: 'Step 2: Set up where to paste it in your tool (3 min)',
          body: `<p>The system prompt works best as <strong>saved instructions</strong> that apply to every conversation. Pasting it into one chat works too, but the AI can drift over a long session. Pick the path that matches your drafting tool:</p>
<table>
<caption class="sr-only">Where to paste system prompts by AI tool, and whether instructions persist across chats</caption>
<thead>
<tr>
<th scope="col">Your tool</th>
<th scope="col">Where to paste</th>
<th scope="col">Persists?</th>
</tr>
</thead>
<tbody>
<tr>
<td>ChatGPT Plus</td>
<td>Profile &rarr; Projects &rarr; New Project &rarr; Edit instructions</td>
<td>Yes (project)</td>
</tr>
<tr>
<td>ChatGPT free</td>
<td>Settings &rarr; Personalisation &rarr; Custom Instructions</td>
<td>Yes (all chats)</td>
</tr>
<tr>
<td>Claude Pro</td>
<td>Create a Project &rarr; Custom instructions</td>
<td>Yes (project)</td>
</tr>
<tr>
<td>Claude free, Copilot, Gemini free</td>
<td>Paste at the top of each new chat</td>
<td>No</td>
</tr>
</tbody>
</table>
<div class="setup-group">
<h3 class="setup-group-heading">New to these tools?</h3>
<p class="setup-group-intro">Open the path for yours below to see every click. The table above is the short version; this is the every-button-by-name version.</p>
<details class="setup-detail">
<summary><strong>ChatGPT Plus</strong>: every click</summary>
<ol>
<li>In the left sidebar, click <strong>+ New project</strong>. (If you do not see Projects in the sidebar, click your profile name in the bottom-left first, then choose <strong>Projects</strong>.)</li>
<li>Give the project a name like "Accessible Comms" and click <strong>Create</strong>.</li>
<li>Click into the project from the sidebar to open it.</li>
<li>At the top of the project, click the three-dot menu <strong>(...)</strong> next to the project name.</li>
<li>Choose <strong>Project settings</strong> (sometimes labelled "Manage project").</li>
<li>Find the <strong>Instructions</strong> section and click into it.</li>
<li>Paste the system prompt from Step 3 below.</li>
<li>Click <strong>Save</strong>. Close the settings panel.</li>
<li>Start a new chat from inside the project to test it.</li>
</ol>
<figure class="setup-screenshot">
<img src="/training/screenshots/chatgpt-plus-project-settings.png" alt="ChatGPT Plus Project settings dialog showing the Project name, Instructions text box, Memory field and Cancel / Save buttons. The Instructions box is where you paste the system prompt." loading="lazy" />
<figcaption>The Project settings dialog. Paste the system prompt into the Instructions box.</figcaption>
</figure>
</details>
<details class="setup-detail">
<summary><strong>ChatGPT free</strong>: every click</summary>
<ol>
<li>Click your name or initials in the <strong>bottom-left</strong> of the screen.</li>
<li>Choose <strong>Settings</strong> from the menu.</li>
<li>In the Settings panel, click <strong>Personalization</strong> on the left (ChatGPT uses American spelling for this menu).</li>
<li>Scroll down to the <strong>Custom instructions</strong> section. It sits below Base style and tone, Characteristics and Fast answers.</li>
<li>Paste the system prompt from Step 3 below into the Custom instructions text box.</li>
<li>Settings auto-save. Close the panel.</li>
<li>Start a new chat to test it.</li>
</ol>
<figure class="setup-screenshot">
<img src="/training/screenshots/chatgpt-free-personalization.png" alt="ChatGPT Personalization settings panel with the left navigation showing General, Notifications, Personalization (selected), Apps, Billing and other items. The right side shows Base style and tone, Characteristics, Fast answers and the Custom instructions text box where you paste the system prompt." loading="lazy" />
<figcaption>The Personalization panel. Paste the system prompt into the Custom instructions box.</figcaption>
</figure>
</details>
<details class="setup-detail">
<summary><strong>Claude Pro</strong>: every click</summary>
<ol>
<li>In the left sidebar, click <strong>Projects</strong>.</li>
<li>Click <strong>+ Create project</strong> (or the "+" tile if you already have projects).</li>
<li>Give the project a name like "Accessible Comms" and click <strong>Create project</strong>.</li>
<li>You land on the project page. You will see two cards: <strong>Instructions</strong> and <strong>Files</strong>.</li>
<li>Click the <strong>+</strong> on the <strong>Instructions</strong> card. A "Set project instructions" modal opens.</li>
<li>Paste the system prompt from Step 3 below into the text box.</li>
<li>Click <strong>Save Instructions</strong>.</li>
<li><em>Optional:</em> on the <strong>Files</strong> card, click <strong>+</strong> to upload reference docs (brand guidelines, accessibility policies, sample accessible content from your business). Claude will consult them in every chat in this project.
<div class="upload-warning"><strong>Before you upload:</strong> do not upload anything containing personal information about staff or customers, your business's confidential intellectual property, client data, commercial-in-confidence material, paid research you do not own the rights to or anything covered by an NDA. Use redacted or public-facing versions if you are unsure.</div>
</li>
<li>Start a new chat from inside the project to test it.</li>
</ol>
<figure class="setup-screenshot">
<img src="/training/screenshots/claude-pro-set-project-instructions.png" alt="Claude Pro project page titled 'Using AI to Create Accessible and Inclusive Communications' with the Set project instructions modal open over it. The modal has a large text box for project instructions and Cancel / Save Instructions buttons." loading="lazy" />
<figcaption>The Set project instructions modal opens after you click the + on the Instructions card. Paste the system prompt here, then click Save Instructions.</figcaption>
</figure>
</details>
<details class="setup-detail">
<summary><strong>Claude free, Microsoft Copilot or Google Gemini free</strong>: every chat</summary>
<ol>
<li>Open the tool and start a <strong>new chat</strong>.</li>
<li>Paste the system prompt from Step 3 below as the <strong>first message</strong> in that chat.</li>
<li>Wait for the AI to confirm it understands the role before you send your real instructions.</li>
<li>Important: if you start another new chat later, you must paste the system prompt again at the top. Free tiers do not remember instructions between chats.</li>
<li>Tip: keep the system prompt open in a separate note or document so you can copy and paste it quickly.</li>
</ol>
<figure class="setup-screenshot">
<img src="/training/screenshots/copilot-paste-at-top.png" alt="Microsoft Copilot home screen with the system prompt pasted into the chat input box as a first message. The 'Smart' model selector and the send arrow are visible at the bottom of the input." loading="lazy" />
<figcaption>Microsoft Copilot example. Same pattern works in Claude free and Gemini free: paste the system prompt as the first message in a new chat.</figcaption>
</figure>
</details>
<div class="version-note">
<strong>Captured June 2026.</strong> AI tools change their menus often. If a button name or menu in your tool does not match what is shown above, expand the helper prompt below and paste it into your AI tool.
<details>
<summary><strong>Helper prompt</strong> (only if your menus do not match)</summary>
<pre><code>I need to set up persistent custom instructions in [your tool, e.g. ChatGPT Plus, ChatGPT free, Claude Pro, Microsoft Copilot, Google Gemini]. Walk me through every click I need to make in the current UI, naming the buttons and menus exactly as they appear today.</code></pre>
</details>
</div>
</div>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 3: Paste the AI assistant system prompt (5 min)',
            targetTool: 'drafting',
            instructions: 'Copy the system prompt below. Paste it into your AI tool, following the path described in Step 2 above. (If your tool does not have saved instructions, paste it at the top of a new chat.) The prompt contains some technical terms (Artifacts, sandbox, attachments) that are file-creation features in different AI tools. The AI knows what to do with them. You do not need to understand them.',
            promptTemplate: `ROLE & PURPOSE
You are my Accessible Communications Assistant.

Your job is to help me convert standard business content into accessible and inclusive formats including:
- Easy Read
- Plain Language
- Social Stories and Visual Narratives
- Accessibility Guides
- Accessible Word documents
- Large Print layouts

You will help by:
- asking clarifying questions before drafting
- producing draft content in the requested format
- explaining your formatting choices when asked
- suggesting how to test the draft with the audience
- flagging anything that needs a human reviewer

FORMATTING RULES
- Use clear headings, short paragraphs and bullet points
- Avoid walls of text
- When producing Easy Read or Plain Language drafts, follow the published standards for each format
- If you can generate a Word file or attachment directly (Artifacts, downloads, Python sandbox etc.), do so proactively without waiting for me to ask. APPLY all format-specific layout and typography settings to the file itself. ALSO provide the same content as text in chat so I can verify and edit. Never make me ask twice for a file when you can produce one.
- If you cannot generate a file (no Artifacts, no sandbox, no attachment capability), return the content as text in chat AND append a numbered "application checklist" so I can apply each setting manually in Word or my design tool.
- Either way, state in your reply which mode you used (file + text, or text + checklist) so I know what I am working with.
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Never ask clarifying questions about choices that the requested format already dictates by convention. Apply the convention and move on. Examples: Social Stories are always first person ("I will…"), Easy Read uses short sentences with image suggestions, Plain Language targets year 7 to 8 reading level, Accessibility Guides follow the standard 7-section structure. The standards reference below tells you which conventions apply per format.
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- When I am vague, ask for specifics
- When I am stuck, simplify
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.
- When my source material or brief contains [NEEDS ANSWER: question] markers, preserve them verbatim in the draft. Do not replace them with guesses or filler. After the draft, list every [NEEDS ANSWER] marker in a separate section at the end so I can see what still needs research before publishing.
- When I ask you to iterate, edit, rewrite, shorten, lengthen, adjust tone, fix accuracy or add anything to a draft, ALWAYS return the COMPLETE updated draft from heading to sign-off line. The full document, every section, all the changes applied. NEVER show only the changed sections. NEVER show a recommendation list or evaluation marks (✅, ⚠️, ❌). NEVER explain your reasoning above or alongside the draft. If you disagree with a change I asked for, still produce the full updated draft applying the changes you accept, then raise the disagreement in ONE short sentence below the draft. Never block or replace the draft with discussion. The user re-reads the whole draft after each iteration and needs the actual updated content to do that.
- When I answer the verification items, clarifying questions or assumption flags you raised, that is your signal to return the COMPLETE updated draft incorporating my answers. Do not ask further questions. Do not propose additional changes. Do not recommend new content (photos, extra sections, structural reordering, related documents). Stop after the updated draft.
- Volunteered scope creep is not allowed. Do not suggest new sections, photo lists, structural reordering or additional information sources unless I explicitly ask. If you genuinely believe one suggestion is important, name it in ONE short sentence at the end of the draft and let me decide. Never block or delay the draft on it.
- When my iteration request includes a numbered list of issues, after the full updated draft return a numbered confirmation list saying what you changed for each issue. For structural changes (moving content between sections, merging or splitting sections), name the section you moved. For wording changes, quote the before/after. If you could not action an issue, say so and explain why. Structural changes are easy to skip silently, so they must be called out explicitly.
- Never produce a draft directly after I answer your clarifying questions. After my answers, confirm what you now know, name any remaining gaps as specific questions, and wait for an explicit drafting trigger from me (a build prompt with format rules, "Please draft this", "Proceed to drafting" or similar). Drafting requires BOTH my answers AND an explicit go-ahead. If an assumption you raised was not addressed in my answers, do not bake it into the draft as fact. Re-raise it as a question or leave a [TO CONFIRM] placeholder in the draft.
- BRANDING: when my briefing includes BRANDING fields (voice, always-use words, never-use words, colours, background, fonts, logo and style notes), treat them as binding for every draft and revision in this conversation. Apply voice and word lists to every sentence. Apply colour, font, background and logo rules to every formatting checklist and any file you produce. For every brand colour I give you with a hex code, calculate WCAG 2.2 AA contrast against the background colour I specified (or white by default) and flag any failures with a suggested fix. Never silently change a brand colour. If any branding field is blank, apply accessible defaults for that aspect (sans-serif, black on white, no colour-only meaning) without prompting me.
- INCLUSIVE LANGUAGE BASELINE (always-on, regardless of branding fields): never use ableist or deficit-framed language in any draft. Avoid "suffers from", "afflicted with", "wheelchair-bound", "confined to a wheelchair", "special needs", "differently abled", "handicapped", "able-bodied" (use "non-disabled" only where contrast is needed), "the disabled", "victim of", "normal" as the opposite of disabled, or any euphemism that distances disability. Use person-first or identity-first language per Australian Federation of Disability Organisations and People with Disability Australia guidance, defaulting to identity-first for the autistic and Deaf communities and person-first elsewhere unless the brief tells you otherwise. The user does not need to list these in BRAND WORDS AVOID — they are off by default.

ACCESSIBILITY STANDARDS REFERENCE
- Easy Read: Inclusion Australia and CID guidelines for content (short sentences, common words, one idea per line, no metaphors). Australian Government Style Manual for layout (image LEFT and text RIGHT in a 2-column presentation table, never image above or below text, minimum 1.5 line spacing, wide margins, minimum 14pt body with larger headings, bold for headings and difficult words only).
- Plain Language: Australian Government Style Manual and Plain Language Association International, informed by ISO 24495-1:2023 (the international plain language standard: content readers can find, understand and use). Year 7 to 8 reading level. Active voice. Common words.
- Social Stories: Carol Gray model. First person. Descriptive. Non-judgemental.
- Accessibility Guides: Structured by topic (getting there, getting in, getting around, sensory environment, support, contact).
- Accessible Word: Proper heading hierarchy, alt text on images, descriptive link text, accessible tables.
- WCAG 2.2 AA for web content.

INITIAL SETUP RESPONSE (this message)
When I paste these instructions with no task attached, just acknowledge in 1 to 2 sentences ("Set up. Ready for your first task.") and wait. Do NOT preview questions about hypothetical future tasks, defaults or file-generation behaviour. Defaults are: Australian English, formats follow the standards reference above, file generation when the platform allows it. We will handle real choices when a real task arrives.

WHAT TO DO ON A NEW TASK
When I bring you actual content to work on (source material plus a format request, or a briefing prompt), your first reply on that task must include:
1. A one or two sentence summary of what you understand the task to be
2. 3 to 5 clarifying questions if needed to fill any gaps
3. Any assumptions you would have to make if I cannot answer those questions`,
            expectedOutcome: 'A short, structured confirmation reply once you send the test message below. That tells you the AI assistant is ready for any task in this conversation (or any conversation in the same Project / under the same Custom Instructions).',
            tips: [
              'On Plus or Pro tiers, save the instructions once and they apply forever. Worth the 2 extra minutes.',
              'On free tiers without saved instructions, copy the system prompt into a note you can paste at the top of any new chat.',
              'If the AI starts going off-piste later in the conversation, paste the system prompt again to reset its context.',
            ],
          },
        },
        {
          type: 'text',
          body: `<div class="do-now">
<div class="do-now-label">Do this next</div>
<p>Once you have pasted and saved the system prompt, send this message to the AI:</p>
<pre><code>Ready to start. Please confirm you understand your role.</code></pre>
<p>You will know it is working when the AI replies with a short structured confirmation.</p>
</div>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 4: Set up Claude as your Reviewer (2 min)',
            targetTool: 'reviewer',
            instructions: 'Switch to your Claude tab. Start a new conversation. Paste the prompt below and press Enter.',
            promptTemplate: `You are my Accessible Communications Reviewer.

Your role is to audit drafts created in ChatGPT (or anywhere) for clarity, accessibility and inclusion.

When I paste a draft, evaluate it on:

A. PLAIN LANGUAGE
- Estimated reading level (years of schooling required)
- Sentence length (flag any over 15 words for accessible content)
- Jargon, idioms or cultural references that may exclude readers

B. STRUCTURE
- Logical flow
- Heading hierarchy
- White space and chunking

C. INCLUSION
- Person-first or identity-first language used appropriately
- Stereotypes or assumptions about disability
- Missing audience considerations

D. ACCURACY RISK
- Statements that appear invented or assumed (and would need human verification)
- Internal contradictions

E. FORMAT FIDELITY
- The user declares the draft format at the top of their message. Apply ONLY that format's conventions in your review.
- Do not reference other formats by name. Do not blend conventions across formats (Easy Read is not Social Story, Social Story is not Easy Read, Plain Language is not Accessibility Guide). Do not assume the draft is a different format from what the user declared.

F. SOURCE COVERAGE
- If the user pasted source material along with the draft, compare the two: list facts in the source that did not make it into the draft, and facts in the draft that do not appear in the source (likely AI invention).
- If no source was provided, skip this check and say so.

For each draft I paste, reply with these five sections, in this order, using these exact headings so I can scan them quickly:

1. DIAGNOSIS (for you to read)
One sentence summarising the draft.

2. ISSUES TO ACTION (paste this section back into your drafting AI)
3 to 5 numbered issues in priority order. Each issue is ONE short sentence naming the problem (not the fix). No commentary between items. This block must be paste-ready so I can copy it straight into my drafting AI and have it rewrite the draft.

3. SUGGESTED RE-WORDINGS (for you to read)
Concrete before-and-after fixes for the top 2 or 3 issues.

4. NEEDS HUMAN VERIFICATION (for you to read)
Facts, names, links, numbers or claims you may be guessing at.

5. NEXT-ITERATION QUESTIONS (for you to read)
1 or 2 questions that would strengthen another pass.

6. SOURCE COVERAGE (for you to read)
If the user provided source material with the draft, list any facts in the source that did not make it into the draft, and any facts in the draft that were not in the source. If no source was provided, write "No source provided for comparison" and stop.

LANGUAGE
Write all your feedback in plain language. The user is a beginner. Avoid reviewer jargon like "demote", "gloss", "scaffolding", "elide" or "remit". Examples: instead of "demote unverified facts to scaffolding", say "Change facts you have not confirmed into 'Needs answer' notes". Instead of "gloss the term in plain words at first use", say "Explain what the word means the first time you use it". Aim for year 7 to 8 reading level in your own feedback, the same level the course teaches.

Be direct. If something is weak, say so. If something is excellent, say why.`,
            expectedOutcome: 'A short, structured confirmation from Claude once you send the test message below. You will return to this conversation in Lesson 4 with your draft.',
            tips: [
              'Claude free has no saved instructions feature, so this prompt only applies to this conversation. Keep the tab open until Lesson 4.',
              'If you accidentally close the Claude tab, just open a new one and re-paste the prompt.',
            ],
          },
        },
        {
          type: 'image',
          image: {
            src: '/training/screenshots/claude-reviewer-paste.png',
            alt: 'Claude free chat with the reviewer prompt pasted into the input box. The greeting "Welcome, Flare Access! I\'m Claude." sits above and the Sonnet 4.6 model selector and send arrow are at the bottom of the input.',
            caption: 'Reviewer prompt pasted into a fresh Claude chat, ready to send.',
          },
        },
        {
          type: 'text',
          body: `<div class="do-now">
<div class="do-now-label">Do this next</div>
<p>Send this message to Claude:</p>
<pre><code>Ready to review. Please confirm you understand your role.</code></pre>
<p>A short structured confirmation reply means Claude is set up correctly.</p>
</div>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'info',
            text: 'Lesson 1 complete once both ChatGPT and Claude have confirmed their roles with a short structured reply.',
          },
        },
        {
          type: 'text',
          heading: 'Setup prompts are saved',
          body: `<p>Your AI assistant and Reviewer prompts are now pasted into ChatGPT and Claude. They will stay there. If you need to start a new chat later or paste them somewhere else, both prompts are downloadable any time from <strong>Course Materials</strong> at the top of this course (PDF or text). No need to retype.</p>`,
        },
      ],
    },
    {
      id: 'lesson-2-choose-format-and-brief',
      courseId: 'course-ai-accessible-comms',
      title: 'Choose Your Format and Brief the AI',
      subtitle: 'Pick what to create, gather your source and give the AI everything it needs',
      description: 'Choose your alternative format, identify or assemble your source material and brief your AI assistant so it has full context before drafting.',
      order: 2,
      estimatedMinutes: 22,
      accessTier: 'premium',
      keywords: ['format selection', 'briefing', 'source material', 'clarifying questions'],
      contentBlocks: [
        {
          type: 'text',
          heading: 'What you will achieve in this lesson',
          body: `<p>By the end of this lesson, your AI assistant knows your format, your audience, your source material and any constraints. It is ready to draft.</p>
<details class="setup-detail">
<summary><strong>Key terms in this lesson</strong> (tap to expand)</summary>
<ul>
<li><strong>Screen reader</strong>: software that reads digital content aloud for people who are blind or have low vision.</li>
<li><strong>WCAG 2.2 AA</strong>: the international web accessibility standard. AA is the level most government and large business sites aim for.</li>
</ul>
</details>
<div class="version-note">
<strong>Captured June 2026.</strong> AI responses can vary as models update. If the AI's reply differs from what is described here (different question wording, slightly different format, extra or missing sections), proceed anyway. The briefing pattern is robust enough to still produce a usable draft. If something feels off, expand the reset prompt below and paste it into the AI.
<details>
<summary><strong>Reset prompt</strong> (only if the AI goes off track)</summary>
<pre><code>Please restart this task and follow the briefing prompt exactly. Confirm what you understand in 2 to 3 sentences, then ask 3 to 5 clarifying questions, then list any assumptions you would have to make.</code></pre>
</details>
</div>`,
        },
        {
          type: 'text',
          heading: 'Step 1: Pick your format and build your brief (5 min)',
          body: `<p>Compare the six options in the table below. You will make your choice in the brief-builder panel that follows the table, not in the table itself. You can come back to the other formats later using the prompt pack.</p>
<table>
<caption class="sr-only">Alternative format options with audience fit and difficulty rating</caption>
<thead>
<tr>
<th scope="col">Format</th>
<th scope="col">Best for</th>
<th scope="col">Difficulty</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Easy Read</strong></td>
<td>Important info for readers with intellectual disability, low literacy or English as an additional language</td>
<td>Medium</td>
</tr>
<tr>
<td><strong>Plain Language</strong></td>
<td>Any content you want a broad public audience to understand quickly</td>
<td>Low</td>
</tr>
<tr>
<td><strong>Social Story / Visual Narrative</strong></td>
<td>Pre-visit prep for first-time visitors, especially autistic and neurodiverse customers</td>
<td>Medium</td>
</tr>
<tr>
<td><strong>Accessibility Guide</strong></td>
<td>Helping customers with access needs plan a visit to your venue or event</td>
<td>Medium-High</td>
</tr>
<tr>
<td><strong>Accessible Word Document</strong></td>
<td>Existing Word docs (policies, info sheets, fact sheets, menus) you want to make more accessible AND more inclusive: heading hierarchy, alt text, plain language, link text, table structure, document properties. Best when you are open to suggested copy improvements alongside the structural work. If your copy is locked (board-approved, legal), see the locked-copy note in the build prompt.</td>
<td>Low-Medium</td>
</tr>
<tr>
<td><strong>Large Print</strong></td>
<td>Reformatting short content (menus, programs, flyers) for low-vision readers. The AI confirms fit, suggests scannability improvements (shorter sentences, clearer headings) and supplies the typography checklist. Best when you are open to copy adjustments that help readability at large type sizes.</td>
<td>Low</td>
</tr>
</tbody>
</table>
`,
        },
        {
          type: 'format-choice',
          formatChoice: {
            legend: 'Build your brief',
            helpText: 'Fill these in once. Your brief saves locally to your browser and pre-fills the briefing prompt in Step 3, the sense-check prompt in Lesson 4 and the accessibility formatting checklist prompt in Lesson 4. You can change it anytime. Use the Copy your brief button to take a plain-text version into other tools or save in your notes.',
            formats: [
              { value: 'Easy Read', label: 'Easy Read' },
              { value: 'Plain Language', label: 'Plain Language' },
              { value: 'Social Story / Visual Narrative', label: 'Social Story / Visual Narrative' },
              { value: 'Accessibility Guide', label: 'Accessibility Guide' },
              { value: 'Large Print', label: 'Large Print' },
              { value: 'Accessible Word Document', label: 'Accessible Word Document' },
            ],
            audienceLabel: 'For audience',
            audienceExample: 'parents of children visiting our museum, or first-time wheelchair users visiting our cafe, or staff onboarding into accessibility procedures',
            contextFields: [
              {
                key: 'PURPOSE',
                label: 'What it helps them do',
                example: 'prepare for their visit, know what to expect at the entrance, find their way to accessible toilets',
              },
              {
                key: 'WHERE IT WILL BE PUBLISHED',
                label: 'Where it will live',
                example: 'our website accessibility page, our booking confirmation email, a printed handout at reception',
              },
              {
                key: 'BRAND VOICE',
                label: 'Brand voice and tone (optional)',
                example: 'warm and direct, plainspoken, written in second person ("you"). Or paste a paragraph from your About page or homepage and the AI will match that voice.',
                multiline: true,
              },
              {
                key: 'BRAND WORDS USE',
                label: 'Words we always use (optional)',
                example: 'visitor (not guest), member, our team, accessible (not disabled access). Business-specific terms only — the AI already uses inclusive language by default.',
              },
              {
                key: 'BRAND WORDS AVOID',
                label: 'Words we never use (optional)',
                example: 'guest, customer, patron, or any internal jargon. You do not need to list ableist terms — the AI already avoids those.',
              },
              {
                key: 'BRAND COLOURS',
                label: 'Brand colours with hex codes (optional)',
                example: 'navy #0A2540 (primary), coral #FF6B6B (accent), sand #F5F1E8 (background)',
                multiline: true,
              },
              {
                key: 'BRAND BACKGROUND',
                label: 'Page or background colour preference (optional)',
                example: 'white, cream, yellow, dark with light text',
              },
              {
                key: 'BRAND FONTS',
                label: 'Brand fonts, heading and body (optional)',
                example: 'Atkinson Hyperlegible for headings and body, or Calibri for both',
              },
              {
                key: 'BRAND OTHER',
                label: 'Logo rules and other style notes (optional)',
                example: 'logo top-left, never stretched, leave clear space, always include date stamp at footer',
                multiline: true,
              },
            ],
            briefGuidance: {
              title: 'What makes a good brief?',
              bodyHtml: `<p>A brief is the small set of facts the AI needs before it can draft anything useful. The shorter and more specific, the better the draft.</p>
<p><strong>Each field, what it does:</strong></p>
<ul>
<li><strong>Format</strong> tells the AI which set of writing rules to apply. Easy Read is short sentences with images. Plain Language is year 7 to 8 reading level. Accessibility Guide has a structured 7-section layout.</li>
<li><strong>Audience</strong> shapes vocabulary, tone and what to leave out. The more specific, the better. "Members of the public" is too vague. "People booking online who use a screen reader" lets the AI pick the right voice. If the actual reader is different from the subject (parent reading on behalf of an autistic teenager, support worker reading aloud), name both: "parents booking on behalf of their autistic teenager".</li>
<li><strong>What it helps them do</strong> is the outcome. "Plan a visit", "know what to expect at the entrance", "decide whether to come at all". Tells the AI what to lead with.</li>
<li><strong>Where it will live</strong> sets length and tone. A booking confirmation email is 3 short paragraphs. A website page can be longer with headings. Knowing this stops the AI writing a 1,500-word essay when you need a sign.</li>
<li><strong>Branding fields (all optional)</strong> let the draft reflect your business. Voice, words to use, words to avoid, brand colours with hex codes, background, fonts, logo rules. Any field you leave blank falls back to an accessible default (sans-serif, black on white, no colour-only meaning). Brand colours with hex codes are auto-checked against WCAG 2.2 AA contrast and flagged if they fail.</li>
</ul>
<p><strong>Bad vs good answers:</strong></p>
<ul>
<li>Audience: "everyone" (bad) versus "first-time wheelchair users visiting on a Saturday" (good)</li>
<li>Purpose: "be accessible" (bad) versus "let parents work out whether the sensory environment will suit their child" (good)</li>
<li>Where: "the website" (bad) versus "the Plan Your Visit page, between Getting Here and Tickets" (good)</li>
</ul>
<p>If you only fill two fields well (audience and purpose), you will still get a usable draft. Specificity beats completeness.</p>`,
            },
            briefHelpPrompt: {
              title: 'Not sure what to put in your brief? Get the AI to suggest options',
              introHtml: `<p>Copy the prompt below and paste it into ChatGPT, Claude or Copilot in a new chat. The AI will ask about your business and format, then <strong>propose audiences and purposes for you to pick from</strong>. You do not need to invent them. If none of the suggestions feel right, give the AI more detail about your business or your customers and it will propose new options.</p>`,
              prompt: `You are helping me build a project brief for accessible content I want to make for my business. Your job is to PROPOSE options I can pick from, not ask me to invent them. Most small business owners do not know which audiences most need accessible content or what specific purpose to write to. You do.

Step 1: Ask me what kind of business I run (one or two sentences) and what format I am making (Easy Read, Plain Language, Social Story, Accessibility Guide, Large Print or Accessible Word Document). If I am unsure about format, recommend one based on my situation.

Step 2: Based on my business and format, propose 4 likely AUDIENCES who would benefit most. Be specific (access needs, language, age, familiarity with my business, whether the reader is the subject or someone reading on behalf). Label them A, B, C, D so I can pick one or more.

If I say none of them feel right, ask me 1 or 2 short questions to learn more about my customers, then propose 4 NEW audience options. Repeat until I pick.

Step 3: Based on the audience(s) I picked, propose 4 likely PURPOSES the content could serve (the practical outcome for the reader, for example: decide whether to book, prepare for the visit, know what to do on arrival, understand eligibility rules). Label them A, B, C, D.

If I say none feel right, ask me 1 or 2 short questions about what I want this content to achieve, then propose 4 NEW purpose options. Repeat until I pick.

Step 4: Ask me where the content will live (specific website page, booking confirmation email, printed handout, etc.). If I am unsure, propose 2 or 3 likely places based on what I have told you.

Step 5: Ask me what the content MUST get right (any tone, fact or detail that is non-negotiable). If I do not know, say "that is fine, we can leave it blank" and move on.

After Step 5, summarise my brief as four short bullet points labelled Format, Audience, Purpose, Where it lives. Stop there. Do not draft the content yet.`,
            },
          },
        },
        {
          type: 'text',
          heading: 'Step 2: Gather your source material (3 min)',
          body: `<p>You do not need a finished document. You need <em>something</em> to start from. Here is what works for each format:</p>
<table>
<caption class="sr-only">Source material options for each format, including what to do if you have nothing prepared</caption>
<thead>
<tr>
<th scope="col">If you want to create</th>
<th scope="col">Your source can be</th>
<th scope="col">If you have nothing prepared</th>
</tr>
</thead>
<tbody>
<tr>
<td>Easy Read</td>
<td>An existing webpage, FAQ, brochure, policy doc or bullet-point notes about the topic you want the Easy Read to cover</td>
<td>Paste a short description of the topic. The AI will ask you the questions it needs answered.</td>
</tr>
<tr>
<td>Plain Language</td>
<td>Any text document, letter, email, policy, set of instructions, webpage copy or FAQs about the topic you want the Plain Language version to cover</td>
<td>Paste your raw notes</td>
</tr>
<tr>
<td>Social Story / Visual Narrative</td>
<td>A webpage link to your venue info, photos with short captions or walkthrough notes</td>
<td>Walk through the experience out loud, paste your description, let the AI prompt you for the rest</td>
</tr>
<tr>
<td>Accessibility Guide</td>
<td>An existing access statement, floor plan, photos of entrances/bathrooms/parking, walkthrough notes or a website link</td>
<td>The AI will run you through an access information checklist</td>
</tr>
<tr>
<td>Accessible Word Document</td>
<td>An existing Word doc (paste the text content). If you only have a PDF, copy the text out first. The output is always a Word doc.</td>
<td>n/a (you need an existing document)</td>
</tr>
<tr>
<td>Large Print</td>
<td>The actual short piece of text you want to reformat for Large Print</td>
<td>The AI will help you reformat what you have</td>
</tr>
</tbody>
</table>
<div class="heads-up-note">
<div class="heads-up-label">Heads up</div>
<p>Two formats really do need existing source content: <strong>Large Print</strong> (reformats short content you already have) and <strong>Accessible Word Document</strong> (makes an existing document accessible). If you have neither, pick Plain Language, Easy Read, Social Story or Accessibility Guide. You can come back to Large Print or Accessible Word Document once you have a finished draft.</p>
</div>
<p>If you picked one of the other 4 formats and have nothing prepared, you can still proceed. The AI can interview you for the facts it needs. The "I have no source material yet" panel further down has the prompt that turns the AI into your interviewer.</p>
<div class="heads-up-note">
<div class="heads-up-label">Source under 400 words?</div>
<p>Below 400 words the AI starts inventing detail to fill gaps, which is risky for content you will publish. Try these in order before drafting:</p>
<ol>
<li><strong>Add more from the same business.</strong> Paste in your FAQs, accessibility page, terms, booking confirmation copy or a relevant blog post. Same voice, same facts, no risk of fabrication.</li>
<li><strong>Switch to a richer doc.</strong> Better to leave with a confident draft of a different document than a shaky draft of this one.</li>
<li><strong>Last resort: have the AI interview you.</strong> Open the "I have no source material yet" panel below. The AI asks questions and you answer from your knowledge, so nothing is invented. Slower than the other two, but works.</li>
</ol>
</div>
<details class="setup-detail">
<summary><strong>I have no source material yet</strong>: get the AI to interview you</summary>
<p>Paste this prompt into the same AI chat where you set up the AI assistant in Lesson 1. The AI will ask you one question at a time, then return a structured summary of your answers. The summary is your source material for the rest of the workshop.</p>
<p>When the interview ends, copy the structured summary into your notes app or workshop documents for safekeeping. Then continue with <strong>Step 3 (Brief your AI assistant)</strong> below as normal. You will paste the structured summary as your source material in that step.</p>
<pre><code>I do not have source material prepared. I want to create [FORMAT NAME] for [AUDIENCE].

The topic is: [one sentence on what your content is about].

Please interview me to gather the source material. Follow these rules.

ROLE
You already know what [FORMAT NAME] needs to be useful. Do not ask me what should be included. Ask me for the specific facts that fill the standard structure.

QUESTIONING STYLE
- Ask one CHECKLIST question per topic. Each checklist must list every sub-item below as a bullet, so I can answer each in turn inside the same reply.
- Wait for my full answer (covering every sub-item or "don't know") before moving to the next checklist.
- For each sub-item, name the unit, format or 2 to 3 example answers (e.g. "in centimetres", "yes / no / partially", "asphalt / concrete / gravel / other") so I know exactly what to give you.
- If my answer is vague ("all", "everyone", "we are flexible", "yes"), follow up asking for a specific example, number or unit.
- If I do not know an answer, accept it and move on. Note the gap.
- Number each checklist (Question 1 of N) so I can track progress.

FORMAT-SPECIFIC CHECKLIST COVERAGE
Walk me through every item under [FORMAT NAME] below. Do not skip any.

- Accessibility Guide: ask one checklist per section, in this order.
  1. Getting there: accessible parking (count, distance to entrance in metres, surface: asphalt / concrete / gravel / other); drop-off zone (yes/no, location, level/sloped); nearest public transport stop (distance in metres, path surface).
  2. Getting in: main entrance door (width in cm, manual or automatic, lightweight or heavy); threshold or lip (yes/no, height in mm); alternative step-free entrance (yes/no, location).
  3. Getting around: paths between visitor areas (step-free / steps / both); internal ramps (yes/no, locations, gradient if known); internal lifts (yes/no, locations); wayfinding signage (verbal / visual / tactile / none); distances between key areas worth knowing; alternative step-free route to any stepped areas; seating types available (bar stools, standard chairs, lounge, etc.).
  4. Toilets: accessible toilet (count, location, grab rails yes/no, hours available); ambulant toilet (yes/no); all-gender toilet (yes/no); Changing Places toilet (yes/no); hearing loop in toilet area (yes/no).
  5. Sensory environment: noise sources (music / conversation / machinery / other), usual volume (low / moderate / loud), volume adjustability (yes/no); lighting type (warm / cool / mixed), lighting adjustability (yes/no); regular smells; crowd levels (low / variable / consistently busy); quiet area available (yes/no, location); quieter days or times to visit.
  6. Support: Companion Card accepted (yes/no); assistance animals welcome throughout (yes/no, exceptions); staff disability or accessibility training (yes/no, year completed); information formats offered (large print / Easy Read on request / Auslan / audio); hearing loop in main spaces (yes/no, locations); staff assistance offered (table service, help to seating, etc.).
  7. Contact: best phone number; best email; named contact person and role; recommended lead time for pre-visit access questions.

- Easy Read: ask one checklist per topic.
  1. Audience: who the reader concretely is (e.g. people with intellectual disability over 18, support workers reading aloud, EAL readers); likely reading age; familiarity with my business.
  2. Single decision or action the reader should take after reading (one sentence).
  3. Hard words to replace: 5 to 10 specific words from my content that need plain alternatives (e.g. "admission" to "cost to come in", "commence" to "start").
  4. Length and chunks: rough word count of source content; how many sections it should have.

- Plain Language: ask one checklist per topic.
  1. Audience: who specifically the reader is; reading level (estimate years of schooling); prior knowledge of the topic.
  2. The single action the reader should take after reading.
  3. Jargon to replace: 5 to 10 jargon or insider words from my content that need plain alternatives.
  4. The one fact that must not be misunderstood (most important takeaway).
  5. Length and format: word count target, paragraph length preference, headings yes/no.

- Social Story / Visual Narrative: ask one checklist per topic.
  1. The reader: specifically who (autistic teen, sensory-sensitive child, etc.), first-time or returning visitor, who they will be with.
  2. Chronological journey: every beat in order (before arrival, arrival, entry, what happens inside beat by beat, leaving). List the beats first; we will detail each below.
  3. Sensory details at each beat: what they will see, hear, smell, feel.
  4. People they will meet: staff roles, what staff will say or do, will they be greeted, queued or directed.
  5. Unexpected things: what might happen differently than expected (queues, closed sections, sudden noises).

- Large Print: ask me to paste the actual short text I want enlarged. Then ask one checklist covering:
  1. Audience: who is reading and any specific visual conditions to design for.
  2. Font size target (16pt / 18pt / 22pt or other).
  3. Line break preferences (where breaks matter).
  4. Must-keep emphasis (any words that must stay bold or italic).
  5. Contrast and brand colours: background colour preference (white, cream, yellow, dark with light text). Brand colours the user wants to keep — list each as a name and hex code (e.g. "Flare amethyst #490E67") so I can flag any that fail WCAG AA contrast at large type sizes.

- Accessible Word Document: ask me to paste or summarise the existing document. Then ask one checklist covering:
  1. Current heading structure (does it use Word styles? H1 / H2 / H3 in order?).
  2. Images: how many, alt text already present yes/no, decorative vs informative.
  3. Tables: count, header rows marked yes/no, merged cells yes/no.
  4. Links: descriptive text yes/no, any "click here" style links.
  5. Audience and accessibility target (WCAG 2.2 AA, screen reader users, low vision, cognitive accessibility, all of these).
  6. Document properties currently set (title and language) yes/no.
  7. Brand colours: list any brand colours used in the document — colour name and hex code if known (e.g. "Flare amethyst #490E67", "sunrise #FF9015"). I will flag any that fail WCAG AA contrast against the page background and suggest accessible alternatives where needed.

ALWAYS ASK ABOUT PHOTOS (for Accessibility Guide, Social Story / Visual Narrative and Easy Read)
After the section checklists, ask one final checklist about photos. List the photos this format typically needs based on what I told you. For each, ask whether I "Have it", "Need to take it", or "Not applicable". Examples for an Accessibility Guide: accessible parking, drop-off area, route from parking to entrance, main entrance door, entrance threshold (if present), internal pathways, each visitor area mentioned, accessible toilet exterior and interior, seating options, any signage. Tailor the list to what I described in the earlier sections.

NUMBER OF QUESTIONS
- Accessibility Guide: 8 questions (7 section checklists + photos checklist).
- Easy Read, Plain Language, Social Story: 5 to 6 questions.
- Large Print, Accessible Word Document: 2 questions (paste source, then one checklist).
Each question is a checklist covering 4 to 8 sub-items. Stop when every checklist item has an answer or "don't know".

AFTER THE INTERVIEW
1. Produce a STRUCTURED summary of what I told you. Use [FORMAT NAME]'s standard sections as headings. Under each heading, list the specific facts I gave you in plain bullet points.
2. Wherever I said "don't know" or did not give you a fact, write [NEEDS ANSWER: specific question] under the relevant heading. Be precise about what you need.
3. Add a "Photos" section at the end of the summary, split into two lists: "Photos I have" and "Photos to take or source". Make each photo description specific (e.g. "Photo of accessible parking spaces showing distance and surface to entrance"), so the list works as a shot list.
4. Do NOT draft the actual [FORMAT NAME] now. Stop after the structured summary. Drafting happens later in the workshop.
5. Tell me to copy the structured summary (including the Photos section) into my notes app or workshop documents for safekeeping. This is now my source material.
6. End by telling me to return to the workshop and continue with Step 3 (Brief your AI assistant). I will paste the structured summary as my source material when Step 3 asks for it.

DO NOT
- Do not ask me what should be included. You know the format. Ask me for the facts that fit the structure.
- Do not skip checklist items. If you have a list of sub-items under a section, ask about every one. Accept "don't know" as a valid answer and move on.
- Do not draft the actual [FORMAT NAME]. Drafting happens later in the workshop, not in this interview.
- Do not end with a "now provide all this information" checklist. End with a structured summary that captures what I told you, with [NEEDS ANSWER] markers for the gaps and a separate Photos section.
- Do not invent specific measurements, distances, gradients, names of accessibility features or staff procedures. If you do not have the fact, write [NEEDS ANSWER].</code></pre>
</details>
<h3 class="path-section-heading">How to give the AI your source</h3>
<div class="path-card path-card-free">
<div class="path-card-label">Free tier (Claude free, ChatGPT free, Copilot, Gemini)</div>
<p><strong>Have your source handy in a note app, browser tab or Word doc.</strong> You will copy and paste it into the chat in Step 3.</p>
</div>
<div class="path-card path-card-pro">
<div class="path-card-label">Plus or Pro tier (ChatGPT Plus, Claude Pro)</div>
<p>For long sources (multi-page policies, brand guides, detailed staff manuals), <strong>upload the file to your project's Files area now</strong>. In Step 3 you will reference it with this line:</p>
<pre><code>See the source document I have uploaded to this project.</code></pre>
<details class="upload-warning-details">
<summary>Before you upload, check this list (tap to expand)</summary>
<div class="upload-warning"><strong>Do not upload anything containing:</strong> personal information about staff or customers, your business's confidential intellectual property, client data, commercial-in-confidence material, paid research you do not own the rights to or anything covered by an NDA. Use redacted or public-facing versions if you are unsure.</div>
</details>
</div>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 3: Brief your AI assistant (10 min)',
            targetTool: 'drafting',
            instructions: 'Copy the briefing prompt below into ChatGPT. Your format, audience, purpose, where it will live and any branding fields you filled in are auto-injected from the brief above. Paste your source material into the marked spot. Any branding fields you left blank will fall back to accessible defaults.',
            promptTemplate: `I want to create a [FORMAT NAME] for [AUDIENCE].

It will help them to [PURPOSE].

It will live [WHERE IT WILL BE PUBLISHED].

Here is my source material:
[paste the actual content as text. Copy and paste from the webpage, PDF or doc. AI tools cannot reliably extract content from URLs; pasting the text is the only path that works]

BRANDING (any field left blank means no constraint, use accessible defaults)
- Brand voice and tone: [BRAND VOICE]
- Words we always use: [BRAND WORDS USE]
- Words we never use: [BRAND WORDS AVOID]
- Brand colours with hex codes: [BRAND COLOURS]
- Page or background colour preference: [BRAND BACKGROUND]
- Brand fonts (heading and body): [BRAND FONTS]
- Logo rules and other style notes: [BRAND OTHER]

How you must use the branding fields
- Apply voice and word lists to every sentence you draft.
- Apply font, colour, background and logo rules to any formatting checklist or file you produce.
- For every brand colour I gave you with a hex code, calculate WCAG 2.2 AA contrast against the background and flag any that fail (4.5:1 for body under 18pt, 3:1 for large text 18pt+ or 14pt bold). Suggest a darkened or lightened variant, or restrict the failing colour to large headings only. Never silently change a brand colour.
- If a branding field is blank, apply accessible defaults for that aspect (sans-serif, black on white, no colour-only meaning) without prompting me.

Before drafting:
1. Confirm in 2 to 3 sentences what you understand about my business, audience, purpose and where this will live.
2. Audit my source material against the structural requirements of [FORMAT NAME]. You know what this format needs to be useful (e.g. Social Story needs chronological beats, sensory details at each beat, what staff will do and what unexpected things might happen; Easy Read needs one decision or action the reader should take and hard words to replace; Accessibility Guide needs facts for all seven sections). For every required element my source does NOT cover, ask me a specific question to fill the gap. There is no fixed limit — ask as many as the format needs, but each question should be answerable in one short sentence. Group related gaps into a single numbered checklist where it helps.
3. List any assumptions you would have to make if I cannot answer.
4. STOP HERE. Wait for my answers. Do NOT produce a draft yet. After I answer your clarifying questions, confirm what you now know, restate any remaining gaps as specific questions, then wait for an explicit drafting trigger from me (a build prompt with format rules, "Please draft this", "Proceed to drafting" or similar). Drafting only happens AFTER both my answers AND an explicit go-ahead.`,
            expectedOutcome: 'ChatGPT replies with a short summary of what it understands plus a list of format-specific clarifying questions. The number of questions depends on how much your source already covers for your chosen format. Social Story and Accessibility Guide typically need more questions than Plain Language. Answer each one and the AI has full context.',
            tips: [
              'Got something the draft MUST get right (a tone, a fact, a length limit)? Add it as a line just before "Before drafting:" or mention it when ChatGPT asks its clarifying questions. Examples: "Must mention wheelchair access", "Stay under 500 words", "Use our friendly tone, similar to our website homepage".',
              'Branding fields above are all optional. Fill in any you have, leave any blank. Hex codes are ideal for colours but "navy blue" works too. Any field left blank falls back to an accessible default.',
              'If you do not know the answer to a clarifying question, say "Don\'t know, please flag this as needing a human to confirm."',
            ],
          },
        },
        {
          type: 'text',
          body: `<div class="do-now">
<div class="do-now-label">Do this next</div>
<p>When ChatGPT replies with its clarifying questions:</p>
<ul>
<li>Answer them honestly. It is fine to answer in fragments and bullet points.</li>
<li>If you do not know an answer, say so. You can ask ChatGPT to suggest one based on your brief and source material, then accept, edit or reject its suggestion.</li>
<li>After your answers, ChatGPT will confirm what it now knows and re-list any remaining gaps. Answer those, or reply <em>"I do not know, please flag this in the draft as needing a human to confirm"</em>.</li>
<li>When ChatGPT is ready and waiting, you are done with Lesson 2. The build prompt in Lesson 3 is the explicit drafting trigger.</li>
</ul>
</div>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Anything the AI tells you it "knows" about your business that you did not tell it is a guess. Treat it as a prompt to verify, not a fact.',
          },
        },
        {
          type: 'text',
          heading: 'Your brief is saved',
          body: `<p>Your brief is saved on this device and pre-fills the prompts in Lessons 3 and 4. You will get one downloadable session record at the end of Lesson 4 — brief, follow-up notes and a pointer to your reusable prompts, all in one place.</p>`,
        },
      ],
    },
    {
      id: 'lesson-3-build-your-draft',
      courseId: 'course-ai-accessible-comms',
      title: 'Build Your Draft',
      subtitle: 'Use a format-specific build prompt, then iterate',
      description: 'Send the build prompt for your chosen format, read the first draft and iterate 2 to 3 times to produce a working draft you are happy with.',
      order: 3,
      estimatedMinutes: 43,
      accessTier: 'premium',
      keywords: ['drafting', 'iteration', 'build prompts', 'format-specific'],
      contentBlocks: [
        {
          type: 'text',
          heading: 'What you will achieve in this lesson',
          body: `<p>By the end of this lesson, you will have a first draft of your chosen format that you have iterated on at least twice.</p>
<p><strong>How the lesson runs:</strong></p>
<ol>
<li>Send the format-specific build prompt for your chosen format (10 min)</li>
<li>Read the first draft. Do not fix yet. (3 min)</li>
<li>Iterate 2 times using the iteration prompts below (28 min)</li>
<li>Save your work in progress (2 min)</li>
</ol>
`,
        },
        {
          type: 'text',
          heading: 'Step 1: Send your build prompt (10 min)',
          body: `<p>Your build prompt is shown expanded below, based on the format you picked in Lesson 2. The other 5 are collapsed. Open any if you want to compare or try a different format later. Copy your build prompt and paste it into the <strong>same ChatGPT conversation you used in Lesson 2</strong>. That conversation already holds your brief, your source material and your clarifying answers, so the build prompt draws on all of it.</p>
<p><strong>Started a new chat?</strong> Paste your Lesson 2 briefing prompt in again first. Without it the AI has no brief to work from and will draft from scratch.</p>
<p>If you have not picked a format yet, all 6 will be collapsed. Open the one that matches your plan.</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Easy Read',
            targetTool: 'drafting',
            formatKey: 'Easy Read',
            instructions: 'For Easy Read content following Inclusion Australia and CID guidelines for content, and the Australian Government Style Manual for layout. Copy the prompt below and paste it into your ChatGPT conversation (which already has your business context from Lesson 2).',
            promptTemplate: `Please draft this in Easy Read format following Inclusion Australia and CID guidelines for content, and the Australian Government Style Manual for layout.

BRANDING
Honour the BRANDING fields from my brief (voice, person, always-use words, never-use words, colours, fonts, background, logo rules). Apply voice and word lists to every sentence. Apply colour, font and background rules to the typography checklist at the end. Flag any brand colour that fails WCAG 2.2 AA contrast against the background. If the branding block was empty, note that no branding was provided and use accessible defaults.

CONTENT RULES
- One main idea per line
- Sentences under 15 words wherever possible
- Common words (year 6 reading level or below)
- No metaphors, idioms or figures of speech
- No abbreviations, spell things out
- Active voice
- Address the reader as "you"
- Bullet points for lists

STRUCTURE
- Break the draft into short sections, each with a clear heading.
- For each chunk of meaning, pair ONE image suggestion with ONE short piece of text.

LAYOUT (this is the part most AI drafts get wrong for Easy Read)
- Output each chunk as a row in a 2-column table: image-suggestion on the LEFT, text on the RIGHT.
- Never put an image above or below its text. The pairing is always side-by-side.
- For section headings, use a heading row that spans both columns.
- Image column format: "[Image: short description of what the picture should show]" on one line. Do NOT write alt text — you have not seen the actual photo. The user will write alt text after sourcing the real image. Do not generate the image either, just describe what should go there.

WHITE SPACE AND TYPOGRAPHY (Easy Read needs generous white space, do NOT condense)
If you generate a Word file, apply all of these IN the file itself, not just as a checklist. Easy Read drafts fail most often by being too cramped, so always err on the side of more white space.
- Line spacing at least 1.5 everywhere, including inside table cells. Never tighter than 1.5.
- Clear space between every image and text row, so each chunk has room to breathe. Add space after each paragraph and after each row.
- Generous padding inside every table cell. Text must not touch the cell edges.
- Body text at least 14pt, headings larger. Never below 14pt.
- Wide page margins, at least 2.5cm on each side.
- Bold only for headings and difficult words.
- Left-aligned text, never justified.
- Use colour and contrast for emphasis but never as the only signal of meaning.
- One idea per line with space around it. Never compress the layout to fit more on a page.
- Mark each 2-column layout table with role="presentation" so screen readers do not announce it as a data table.

Then repeat these as a short checklist at the end, so I can verify them when I open the file in Word.

After the draft, list:
- Any words you used that may still be too hard
- Any sections that would benefit from an example
- Anything I should verify with a human reviewer
- One line on why the 2-column image-left / text-right layout matters for this audience, so I can defend the design choice if asked

Before publishing, test the draft with two or three people from your intended audience and fix anything they stumble on. Real readers are the only reliable test of whether the content works for them.`,
            expectedOutcome: 'A draft laid out as 2-column rows (image-suggestion left, text right), plus a layout and typography checklist for applying it in Word and a list of words or sections that need extra attention. Alt text is not drafted in this step — you write alt text after sourcing real photos by uploading them to an AI that can look at images.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Plain Language',
            targetTool: 'drafting',
            formatKey: 'Plain Language',
            instructions: 'For Plain Language content following the Australian Government Style Manual.',
            promptTemplate: `Please draft this in Plain Language following the Australian Government Style Manual.

BRANDING
Honour the BRANDING fields from my brief (voice, person, always-use words, never-use words, colours, fonts, background). Apply voice and word lists to every sentence. Apply font, colour and background rules to any formatting checklist you produce. Flag any brand colour that fails WCAG 2.2 AA contrast against the background. If the branding block was empty, note that no branding was provided and use accessible defaults.

Apply these rules:
- Reading level: year 7 to year 8
- Sentences under 20 words on average
- Active voice
- Common words. No jargon. If you must use a technical term, define it.
- Short paragraphs (3 sentences or fewer)
- Use clear headings
- Bullet points for lists
- Address the reader as "you" where appropriate

After the draft, give me:
- An estimate of the reading level
- A list of any words I should consider replacing
- One sentence on what the reader should walk away knowing

Before publishing, test the draft with two or three intended readers and fix anything they stumble on. This is the "usable" check from ISO 24495-1:2023: the content only works if real readers can find, understand and act on it.`,
            expectedOutcome: 'A Plain Language draft at year 7 to 8 reading level, with an estimated reading level, a list of replacement word suggestions and a one-sentence summary of the key takeaway.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Social Story / Visual Narrative',
            targetTool: 'drafting',
            formatKey: 'Social Story / Visual Narrative',
            instructions: 'For a first-person walkthrough of an experience using photos and short sentences.',
            promptTemplate: `Please draft this as a Social Story / Visual Narrative following Carol Gray Social Story convention.

BRANDING
Honour the BRANDING fields from my brief (voice, always-use words, never-use words, colours, fonts, background, logo rules). For Social Story, voice and word lists shape every sentence. Colour, font and logo rules go into the typography checklist at the end so I can apply them when I lay the story out in Word or a design tool. Flag any brand colour that fails WCAG 2.2 AA contrast against the background. If the branding block was empty, note that no branding was provided and use accessible defaults.

Note on Social Story voice: Carol Gray convention uses first person ("I will see..."). If my brand voice asks for second or third person elsewhere, keep first person for the story body itself and apply my brand voice to any wrapping headings, captions or supporting copy. Flag this in one sentence at the end of the draft.

Apply these rules:
- Written in first person ("I will...", "I might see...")
- Descriptive and reassuring, not instructional or judgemental
- Walk the reader through the experience in the order it happens
- Note sensory details (what they will see, hear, smell, feel)
- Mention what staff or other people might do
- Acknowledge that things can change and that's okay
- Use short sentences

LAYOUT RULES (this is the part most AI drafts get wrong for Social Stories)
- One main idea per photo. If you find yourself introducing a new concept (tour length, then sensory kits, then arrival logistics), insert a new photo placeholder for each concept rather than stacking them all under one photo.
- 2 to 4 short sentences per photo MAXIMUM. If a chunk needs more text, split it into multiple photo + text pairs.
- One page per photo + text pair (Carol Gray Social Story booklet convention). Insert a clear page break instruction between each chunk so the user can add Word page breaks. Mark this in the draft as "[PAGE BREAK]" on its own line between each photo + text pair.
- Suggest where each photo should sit (describe each photo, do not generate). Place the photo placeholder ABOVE its text block.
- Cognitive load per page stays low. A reader scans the image first, then reads 2 to 4 short lines, then moves on.

Structure the draft as:
1. Before I arrive
2. When I get there
3. What I will see and do inside
4. If I need help
5. When I leave

Each section may contain multiple photo + text pairs (not just one). Use as many pairs as needed to keep each photo paired with one focused idea and 2 to 4 sentences.

After the draft, list:
- Photos I should take to go with each section, in order
- Anything I should verify or add from a real walk-through
- Variations to consider (e.g., for a quieter sensory experience)

Before publishing, test the draft with two or three people from your intended audience and fix anything they stumble on. Real readers are the only reliable test of whether the content works for them.`,
            expectedOutcome: 'A first-person social story or visual narrative in 5 chronological sections, with multiple photo + text pairs per section (2 to 4 short sentences under each photo), photo suggestions and notes on what to verify in a real walk-through.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Accessibility Guide',
            targetTool: 'drafting',
            formatKey: 'Accessibility Guide',
            instructions: 'For structured info about the access features of a venue, event or service. Best published as a webpage on your own site so search engines can index it and screen readers can navigate it directly. The AI will produce the text with a clean H1 / H2 hierarchy you can paste into your CMS (or hand to a developer in a Word doc). Also keep a designed Word or PDF copy as your on-request fallback for when a recipient can only accept an email attachment.',
            promptTemplate: `Please draft an Accessibility Guide for my venue or event.

BRANDING
Honour the BRANDING fields from my brief (voice, person, always-use words, never-use words, colours, fonts, background, logo rules). Apply voice and word lists to every section. Apply colour, font, background and logo rules to the typography and webpage-styling checklist at the end so I can apply them when I publish. Flag any brand colour that fails WCAG 2.2 AA contrast against the background. If the branding block was empty, note that no branding was provided and use accessible defaults.

Structure it under these headings:
1. Getting there (transport, parking, drop-off)
2. Getting in (entrance, doors, level access, alternative entrances)
3. Getting around (paths, ramps, lifts, signage, distances)
4. Toilets (accessible, ambulant, all-gender, changing places)
5. Sensory environment (lighting, noise, crowds, quiet areas)
6. Support available (staff training, assistance dogs, companion cards, large print or Easy Read on request)
7. Contact (best way to ask access questions before visiting)

Apply these rules:
- Plain Language throughout
- Specific, not vague. "Wheelchair accessible" is too vague. Say "level entry through the front door, 90cm wide" instead.
- If I haven't told you something for a section, leave it blank and flag it as "needs answer"
- Use bullet points for facts, prose for context

After the draft, give me:
- A list of every "needs answer" item I still need to fill in
- Photos I should take to go with the guide
- Anything that would benefit from a human to verify

Before publishing, test the draft with two or three people from your intended audience and fix anything they stumble on. Real readers are the only reliable test of whether the content works for them.`,
            expectedOutcome: 'An Accessibility Guide structured under 7 standard headings, with specific facts where you have provided them and "needs answer" flags where you have not.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Accessible Word Document',
            targetTool: 'drafting',
            formatKey: 'Accessible Word Document',
            instructions: 'For making an existing Word document more accessible AND more inclusive — heading hierarchy, alt text, plain language, link text, table structure, document properties. Built on Australian Government Style Manual and NSW / Vic Government accessibility guidance, moving toward WCAG 2.2 AA. Works for policies, info sheets, fact sheets, menus, staff briefings and similar. Best when you are open to suggested copy improvements alongside the structural work. If you have no existing doc yet, pick a different format (Plain Language, Easy Read, Social Story or Accessibility Guide) to create the content first, then come back here. PDF accessibility verification (Adobe Acrobat Pro) sits outside this workshop.',
            promptTemplate: `I have a Word document I want to make more accessible AND more inclusive — accessibility scaffolding (heading hierarchy, alt text, links, tables, document properties) PLUS suggestions to improve plain language and structure where they help readers.

LOCKED COPY OVERRIDE: if my copy is board-approved, legally signed off or otherwise unchangeable, I will tell you "flag suggestions only, do not rewrite" before I start. Otherwise treat your suggestions as opportunities I can choose to apply.

BRANDING
Honour the BRANDING fields from my brief (voice, person, always-use words, never-use words, colours, fonts, background, logo rules). Apply voice and word lists to every rewrite suggestion. Apply font, colour, background and logo rules inside the Word formatting checklist. Section 6 below contains the brand-colour contrast check. If the branding block was empty, note that no branding was provided and use accessible defaults.

Please work through this (based on Australian Government Style Manual content-types and NSW / Vic Government accessibility guidance, moving toward WCAG 2.2 AA conformance in the Word document):

1. STRUCTURE
- Suggest a heading hierarchy. Mark each line as H1 / H2 / H3 etc. Do not skip levels.
- Set a logical reading order top-to-bottom. Flag any content that may float (text boxes, sidebars).
- Replace manual dashes or asterisks with proper bulleted or numbered lists.

2. PLAIN LANGUAGE PASS
- Estimate the document's reading level.
- Note any sentence over 20 words or any jargon a general audience would miss.
- For the top 5 hardest, list each one with the original sentence and a suggested plainer alternative. Format each as: original + suggested rewrite + the label "SUGGESTED — apply if you want plainer wording, skip if your copy is locked". Leave the original sentences in my draft untouched; I will tell you which suggestions to apply.

3. IMAGES
- For each image the user has described to you in detail in the source material, draft alt text as a starting point: one sentence, factual visual description, message-focused. Tell the user to verify against the actual image before saving.
- For images you have not seen and the user has not described in detail, DO NOT generate fictional alt text. Tell the user to upload each real image to an AI that can look at images (Claude, ChatGPT Plus, Microsoft Copilot or Google Gemini) and ask for alt text describing the actual image.
- If an image is purely decorative, mark it "decorative, no alt text required."
- Flag any place where colour alone conveys meaning (e.g., "red items are urgent") and suggest a non-colour fix.

4. LINKS
- Rewrite any "click here", "read more", "this page" link text so it makes sense out of context.
- For printed copies, suggest a footnote with the full URL.

5. TABLES
- Mark which row is the header.
- Flag any merged or split cells. Suggest a flat alternative.
- Add a one-sentence caption above each table describing its purpose.

6. BRAND COLOURS (if listed in the briefing)
- For each brand colour the user listed, calculate the contrast ratio against the page background (white unless they said otherwise).
- Flag any that fail WCAG 2.2 AA: 4.5:1 for body text under 18pt, 3:1 for large text (18pt+ or 14pt bold).
- For failing colours, suggest either a darkened/lightened variant that meets contrast OR a use restriction (e.g. "restrict #ABC123 to large headings only, do not use for body text").
- Do not change brand colours in the draft itself. List as suggestions the user can choose to apply in Word.

7. DOCUMENT PROPERTIES (to set in Word File > Info > Properties before export)
- Suggest a document title (different from the file name).
- Document language: English (Australia).

8. EXPORT NOTES
- This workshop produces an accessible Word document. PDF accessibility verification is out of scope (requires Adobe Acrobat Pro).
- If the user wants a PDF copy, note that Word's built-in PDF export with "Document structure tags for accessibility" enabled is a basic starting point only, not full PDF accessibility.
- For web content, NSW and Vic Government recommend an HTML version over a PDF. Suggest if a webpage version of this content should also exist.

After your analysis, give me:
- A numbered checklist of every change to make in Word, in order
- A short list of items I need to verify or supply (alt text confirmation, missing source info)
- The Plain Language suggestions from step 2 (each as: original sentence + suggested rewrite + the "SUGGESTED" label)
- One paragraph I can paste into the document footer noting it moves toward WCAG 2.2 AA conformance and how readers can request the content in another format

Source content: if I have already pasted the document earlier in this chat (e.g. in the briefing step), tell me "I will use the content you shared above" and proceed — do not ask me to re-paste. Otherwise paste it below:

[paste content if not already shared]

Before publishing, test the draft with two or three people from your intended audience and fix anything they stumble on. Real readers are the only reliable test of whether the content works for them.`,
            expectedOutcome: 'A numbered Word-application checklist (heading suggestions, link rewrites, alt text drafts, list conversions, colour-only fixes, table structure notes, document properties), a list of items to verify and a footer paragraph noting the document moves toward WCAG 2.2 AA conformance.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Large Print',
            targetTool: 'drafting',
            formatKey: 'Large Print',
            instructions: 'For reformatting short content for low-vision readers, following Vision Australia clear print guidance. Works for a menu page, a flyer, an announcement, a one-page summary. Best when you are open to copy adjustments that help readability at large type sizes (shorter sentences, clearer headings). If you have no source content yet, use Plain Language or Easy Read first, then come back to Large Print to reformat the result.',
            promptTemplate: `I have content I want to provide in Large Print. Please confirm the content suits the format, suggest scannability improvements where they would help readers at large type sizes, and apply the Large Print typography to any Word file you generate as well as giving me the checklist.

LOCKED COPY OVERRIDE: if my copy is board-approved, legally signed off or otherwise unchangeable, I will tell you "flag suggestions only, do not rewrite" before I start. Otherwise treat your suggestions as opportunities I can choose to apply.

BRANDING
Honour the BRANDING fields from my brief (voice, person, always-use words, never-use words, colours, fonts, background, logo rules). Apply voice and word lists to any scannability rewrites you suggest. Apply font, colour, background and logo rules to the typography checklist. Step 4 below contains the brand-colour contrast check at large type sizes. If the branding block was empty, note that no branding was provided and use accessible defaults.

Please:
1. Confirm the content is appropriate for Large Print (short, high-priority information). If it is too long for Large Print as a format, say so — do not condense the copy yourself, but tell me what would need to come out and let me decide.
2. Suggest scannability improvements where they help at large type sizes (shorter sentences for very long ones, clearer headings, removing decorative wording). Format each suggestion as: original line + suggested change + the label "SUGGESTED — apply if you want better scannability, skip if your copy is locked". Leave my original sentences in the draft; I will tell you which suggestions to apply.
3. WHITE SPACE AND TYPOGRAPHY (for Large Print the typography IS the deliverable, so never compress it). If you generate a Word file, apply all of these IN the file itself, not just as a checklist, and always err on the side of more white space:
- Body text at least 16pt (Vision Australia clear print), or 18pt if I asked for RNIB large print. Never below 16pt.
- Headings at least 1.5 times the body size.
- Sans-serif font only (Arial, Verdana, Calibri or APHont). No italics. No decorative fonts. No underlines except on links.
- Line spacing at least 1.5 everywhere. Never tighter than 1.5.
- Generous space after every paragraph and heading. Wide page margins, at least 2.5cm on each side.
- Single column. Left-aligned, never justified.
- Strong contrast (black on white, cream or yellow). Never use an image of text.
Then repeat these as a short checklist at the end, following Vision Australia guidance and including paper colour, so I can verify them when I open the file in Word.
4. If I listed brand colours in the briefing, calculate the contrast ratio of each against the background colour I specified (or white by default). Flag any that fail WCAG 2.2 AA at large type sizes (3:1 minimum for 18pt+ text). For failing brand colours, suggest either a darkened/lightened variant that meets contrast OR a use restriction (e.g. "use only for accent elements, not body text"). Do not change brand colours unless I ask — list as suggestions.

Source content: if I have already pasted the content earlier in this chat (e.g. in the briefing step), tell me "I will use the content you shared above" and proceed — do not ask me to re-paste. Otherwise paste it below:

[paste content if not already shared]

Before publishing, test the draft with two or three people from your intended audience and fix anything they stumble on. Real readers are the only reliable test of whether the content works for them.`,
            expectedOutcome: 'A scannable text version of your content plus a formatting checklist (font size, family, spacing, contrast, paper, margins) you can apply in Word or your design tool.',
          },
        },
        {
          type: 'text',
          heading: 'Step 2: Read your first draft, do not fix yet (3 min)',
          body: `<p>Read your first draft top to bottom. Resist the urge to start editing. Ask yourself:</p>
<ul>
<li>Does this sound like my business?</li>
<li>Is anything obviously wrong?</li>
<li>Is anything missing?</li>
<li>Where would a reader get confused or stuck?</li>
</ul>
<p>Make a short list (3 to 5 items max) of what you want changed.</p>`,
        },
        {
          type: 'text',
          heading: 'Step 3: Iterate (28 min)',
          body: `<p>Run 2 iteration rounds. One change per round works better than asking for everything at once. The prompts below are <strong>examples</strong> for the most common requests, split into two groups. Pick one that fits, or write your own iteration prompt in plain words. Every prompt ends with "Show the full updated draft" so the AI returns the complete revised version, not a summary of what would change. If you write your own, finish it the same way. (A 3rd round is rare when the first build prompt has done its job. Only run it if a real issue is unresolved.)</p>
<h3>A. Copy iterations</h3>
<p><strong>Use when:</strong> you are drafting new content from raw source (Easy Read, Plain Language, Social Story / Visual Narrative, Accessibility Guide). <strong>Skip if:</strong> your copy is already finalised.</p>
<p><strong>Make it clearer:</strong></p>
<pre><code>Rewrite section [X] using shorter sentences and simpler words. Aim for a reading age of 12 or below. Show the full updated draft.</code></pre>
<p><strong>Make it shorter:</strong></p>
<pre><code>The [section / overall draft] is too long. Cut it by 30% without losing the key information. Show the full updated draft.</code></pre>
<p><strong>Make it friendlier:</strong></p>
<pre><code>The tone feels too formal. Rewrite it to sound warmer and more welcoming, while keeping the structure. Show the full updated draft.</code></pre>
<p><strong>Add specifics:</strong></p>
<pre><code>Add concrete examples in section [X]. Use [these details I'll provide]: [paste details]. Show the full updated draft.</code></pre>
<p><strong>Fix accuracy:</strong></p>
<pre><code>You assumed [X]. The actual situation is [Y]. Please rewrite the relevant sections. Show the full updated draft.</code></pre>
<p><strong>Add what is missing:</strong></p>
<pre><code>You haven't covered [X]. Please add a section about it. Here's what you need to know: [paste info]. Show the full updated draft.</code></pre>
<p><strong>Merge chunks (Social Story, Easy Read, Visual Narrative):</strong></p>
<pre><code>This [FORMAT NAME] has too many photo + text chunks. Merge similar or thematically connected chunks (e.g. busy/quiet pairs, related sensory descriptions, sparse 2-sentence chunks) into combined chunks of 3 to 4 sentences. Target roughly [N] photo chunks total. Preserve one main idea per chunk and the 2 to 4 sentence rule. Show the full updated draft.</code></pre>
<h3>B. Accessibility iterations</h3>
<p><strong>Use when:</strong> your copy is set and you only need to refine the accessibility scaffolding around it (Accessible Word Document and Large Print most often, but useful for any format where the draft text is final). These do not rewrite your wording.</p>
<p><strong>Redo alt text:</strong></p>
<pre><code>The alt text you drafted for [image X / section Y] is wrong. Here is what the image actually shows: [describe the image]. Rewrite the alt text in one factual sentence. Show the full updated draft.</code></pre>
<p><strong>Promote or demote a heading:</strong></p>
<pre><code>Section [X] is currently Heading [N] but it should be Heading [M]. Promote / demote it. Adjust the surrounding heading hierarchy so nothing skips a level. Show the full updated draft.</code></pre>
<p><strong>Rewrite link text:</strong></p>
<pre><code>The link text "[click here / read more / this page]" in section [X] is not descriptive out of context. Rewrite each instance so a screen reader reading the link in isolation knows where it goes. Show the full updated draft.</code></pre>
<p><strong>Fix table structure:</strong></p>
<pre><code>The table in section [X] has no caption and no header row marked. Add a one-sentence caption above describing what the table shows, mark the first row as the header, and flag any merged cells. Show the full updated draft.</code></pre>
<p><strong>Mark an image as decorative:</strong></p>
<pre><code>The image at [location] is purely decorative — it adds visual interest but no information. Mark it as decorative with no alt text required. Show the full updated draft.</code></pre>
<p><strong>Fix colour-only meaning:</strong></p>
<pre><code>Section [X] uses colour alone to convey meaning (e.g. red text for urgent, green for available). Add a non-colour cue (text label, icon, bold weight) alongside the colour so the meaning works for everyone. Show the full updated draft.</code></pre>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'After each iteration, re-read the whole draft, not just the changed bit. AI sometimes changes things you did not ask it to.',
          },
        },
        {
          type: 'text',
          heading: 'Step 4: Save your work in progress (2 min)',
          body: `<p>Copy your current draft into a Word doc, Google Doc or wherever you normally work. Save it.</p>
<p>Do not close ChatGPT. You will keep using this conversation in Lesson 4.</p>
<p>Lesson 3 complete. You have a working draft.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'The draft is not ready to publish yet. Lesson 4 catches issues that are easy to miss when you have been staring at the same content.',
          },
        },
      ],
    },
    {
      id: 'lesson-4-sense-check-and-save',
      courseId: 'course-ai-accessible-comms',
      title: 'Sense-Check and Save',
      subtitle: 'Cross-check with Claude, apply changes, save your session record',
      description: 'Send your draft to Claude for an accessibility sense-check, apply the most important changes back in ChatGPT, run the human review checklist and save your personalised session record. Reusable prompts stay in Course Materials at the top of the course.',
      order: 4,
      estimatedMinutes: 50,
      accessTier: 'premium',
      keywords: ['sense-check', 'cross-LLM', 'human review', 'prompt pack', 'maintenance'],
      contentBlocks: [
        {
          type: 'text',
          heading: 'What you will achieve in this lesson',
          body: `<p>By the end of this lesson, Claude has sense-checked your draft, you have applied the most important changes back in ChatGPT, Claude has generated an accessibility formatting checklist for you to apply (in Word or your design tool, depending on your format), you have run the human review checklist and you have saved a personalised session record.</p>
<details class="setup-detail">
<summary><strong>Key terms in this lesson</strong> (tap to expand)</summary>
<ul>
<li><strong>Alt text</strong>: a short written description of an image, so people using screen readers know what the picture shows.</li>
<li><strong>Screen reader</strong>: software that reads digital content aloud for people who are blind or have low vision.</li>
<li><strong>Heading hierarchy</strong>: the order of Heading 1, Heading 2 and Heading 3 styles in your document. Screen readers use this to let users skim and navigate the structure.</li>
<li><strong>WCAG 2.2 AA</strong>: the international web accessibility standard. AA is the level most government and large business sites aim for.</li>
</ul>
</details>
<p><strong>How the lesson runs:</strong></p>
<ol>
<li>Send your draft to Claude for sense-check (10 min)</li>
<li>Pick the issues and apply them in ChatGPT (15 min)</li>
<li>Use Claude to build your accessibility formatting checklist (12 min)</li>
<li>Apply your format's settings in Word or your design tool (8 min)</li>
<li>Final human review checklist (3 min)</li>
<li>Save your session record (2 min)</li>
</ol>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Always paste BOTH your source material AND your draft into the sense-check, in that order. Without source, Claude cannot tell your real facts apart from AI guesses and will over-correct, suggesting you demote your own confirmed facts (parking spaces, distances, door details) to "Needs answer". With source provided, Claude keeps your real facts in the draft and only flags actual AI inventions. Use the structured summary from your interview if you used one, otherwise use the source you pasted in Lesson 2.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 1: Send your draft to Claude for sense-check (10 min)',
            targetTool: 'reviewer',
            instructions: 'Copy your current draft from ChatGPT. Switch to your Claude tab (which already has the Reviewer prompt set up from Lesson 1). Paste the message below, fill in the brackets, paste your source material under SOURCE and your draft under DRAFT.',
            promptTemplate: `Here is a draft I have created for [FORMAT NAME] aimed at [AUDIENCE].

SOURCE (the material I gave the drafting AI to work from):

[paste source]

DRAFT (the version to sense-check):

[paste draft]

Please sense-check the draft using the framework you've been set up with, including the SOURCE COVERAGE check.`,
            expectedOutcome: 'Claude returns a one-sentence diagnosis, the top 3 to 5 issues, suggested re-wordings for the top 2 or 3, items needing human verification and 1 to 2 questions for the next iteration.',
            tips: [
              'If Claude\'s free tier limit hits before you finish, paste the Reviewer prompt and this draft into ChatGPT, Copilot or Gemini instead. The framework is portable.',
              'If Claude\'s reply skips one of the five framework sections, ask it to redo the missing section. Do not let it drop categories silently.',
            ],
          },
        },
        {
          type: 'text',
          heading: 'Step 2: Pick the issues and apply them in ChatGPT (15 min)',
          body: `<p>Read Claude's reply. The Reviewer prompt is set up so Claude labels the section you need: <strong>"2. ISSUES TO ACTION (paste this section back into your drafting AI)"</strong>. That is the only part you feed back.</p>
<p><strong>Pick which issues to action:</strong></p>
<ul>
<li>Usually 1 to 3 issues. You can paste all of them if they are not in conflict.</li>
<li>Skip anything that is nice-to-have or needs info you do not have.</li>
<li>If Claude flags something you disagree with, that is fine. You know your business better than Claude does. Skip it and move on.</li>
<li>You do not edit the draft yourself. ChatGPT rewrites the full draft from the issues you paste.</li>
</ul>
<p><strong>Then apply them:</strong></p>
<ul>
<li>Switch back to your drafting AI, same conversation as Lesson 3.</li>
<li>Paste the prompt below and replace each <code>[issue]</code> line with one of the issues you picked.</li>
<li>The issues are already written as single short sentences in Claude's reply, so you can copy them word-for-word.</li>
</ul>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Apply the changes in ChatGPT',
            targetTool: 'drafting',
            instructions: 'Paste this prompt into your drafting AI. Replace each [issue] line with one of the issues you picked from Claude\'s "ISSUES TO ACTION" section.',
            promptTemplate: `A sense-check has flagged these issues with our latest draft:
1. [issue]
2. [issue]
3. [issue]

Please update the draft to address each issue.

Then return:
A. The COMPLETE updated draft from heading to sign-off line.
B. A numbered confirmation list saying what you changed for each issue (1, 2, 3...). For structural changes name the section you moved or merged. For wording changes quote the before/after. If you could not action an issue, say so and explain why.

Do not skip Part B. It is how I verify nothing was silently missed. Structural changes (moving content between sections, merging sections) are easy to skip by accident, so call those out explicitly.`,
            expectedOutcome: 'ChatGPT returns an updated draft with the issues addressed. Save it.',
            tips: [
              'Only fill in the issue lines you actually have. If Claude only surfaced one issue worth acting on, delete lines 2 and 3 before sending. If you want to action more than 3, add lines 4 and 5.',
              'If you are uncertain how to phrase an issue, paste Claude\'s exact wording for it. ChatGPT will interpret it correctly in this context.',
              'If ChatGPT replies with a list of changes, evaluation marks (✅ ⚠️) or only the changed sections instead of the full updated draft, paste this to force it: "That was a summary, not the updated draft. Return the COMPLETE updated document from heading to sign-off line with all the changes already applied. Do not show only the changed sections. Do not explain your reasoning. Just the full draft."',
            ],
          },
        },
        {
          type: 'text',
          heading: 'Step 3: Use Claude to build your accessibility formatting checklist (12 min)',
          body: `<p><strong>What this step does.</strong> Claude returns a formatting checklist you can apply and verify yourself. The checklist covers heading levels, alt text, link wording, table notes, document properties and typography.</p>
<p><strong>Word or design tool.</strong> Most formats are built in Word. Large Print can also be laid out in Canva, InDesign or Affinity — the same checklist works there. Heading sizes, font family, line spacing, contrast and margins all translate across.</p>
<p><strong>Why Claude, not ChatGPT.</strong> Claude is stronger at structured longer output. If Claude also produces a downloadable file, treat the file as a starting point and still work through the checklist below.</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Send the checklist prompt',
            targetTool: 'reviewer',
            instructions: 'Copy your updated draft from ChatGPT. Switch to your Claude tab (the Reviewer conversation from Lesson 1 is fine to reuse). Paste the prompt below with your reviewed draft at the bottom.',
            promptTemplate: `I have a reviewed draft I want to publish in an accessible format.

If you can generate the final accessible file directly (via Artifacts, downloads or attachment), do so PROACTIVELY in this same reply without waiting for me to confirm. Apply the formatting structure (heading styles, bulleted or numbered lists, document properties, typography) inside the file itself. Also provide the formatting checklist as text below so I can verify and adjust. Do NOT ask me whether I want the file. Produce it if you can.

Please produce a structured version with the accessibility scaffolding marked up, following the Australian Government Style Manual content-types (stylemanual.gov.au/content-types) for format-specific structure and typography, moving toward WCAG 2.2 AA conformance.

FORMAT CONTEXT
- My draft format is: [FORMAT NAME]
- If the format is Easy Read, preserve the 2-column image-left / text-right layout from the build prompt. Do NOT flatten it to a single column. Mark each layout table with role="presentation" so screen readers skip it. Apply Style Manual typography (minimum 14pt body, 1.5 line spacing, wide margins, bold for headings only).
- If the format is Plain Language, the structure is a clean single-column document. Left-aligned text (never justified). Keep line length under 70 characters wide for readability. Generic structure / images / links / tables guidance below applies as-is.
- If the format is Social Story / Visual Narrative, preserve the photo-per-chunk pairing AND the 2 to 4 sentences-per-photo rule from the build prompt. Do not strip, batch or reorder images. Do not merge multiple photo + text pairs into longer chunks. One main idea per photo, do not stack concepts (e.g. tour length and sensory kits should not share a photo). Preserve any [PAGE BREAK] markers from the build draft — these signal one page per photo + text pair (Carol Gray Social Story booklet convention). The user will insert Word page breaks at each marker. Reading order must follow the chronological journey, do NOT add a table of contents. Captions belong directly under each photo, not in a separate list. Do NOT generate alt text for photos that do not yet exist. Instead, instruct the user to upload each real photo to an AI that can look at images (Claude, ChatGPT Plus, Microsoft Copilot or Google Gemini) once sourced and ask it to suggest alt text describing the actual image.
- If the format is Accessibility Guide, preserve the 7-section order from the build prompt (Getting there, Getting in, Getting around, Toilets, Sensory environment, Support, Contact) so readers can compare across venues. Each section is an H2 under one H1. If this will be published as a webpage, add anchor links for each H2 and a jump menu at the top.
- If the format is Large Print, typography is the format. Apply Vision Australia clear print (minimum 16pt body) or RNIB large print (minimum 18pt). Sans-serif font family (Arial, Verdana, Calibri or APHont). No italics. No underlines except on links. No decorative fonts. Strong contrast (black on white, cream or yellow), never image-of-text. Single column. Headings 1.5x body size minimum. Line spacing minimum 1.5.

1. STRUCTURE
- Mark each line or section with its heading level (H1, H2, H3 etc.). Do not skip levels.
- Set a logical reading order top-to-bottom.
- Replace manual dashes or asterisks with proper bulleted or numbered lists.

2. IMAGES
- For images that the user has described to you in detail (with specific visual content, e.g. an existing photo described in the source material), draft alt text as a starting point: one sentence, factual visual description, message-focused. State clearly that the user must verify against the actual image before saving.
- For placeholder photos that do not yet exist (e.g. an Easy Read draft or Social Story scaffold where photos will be sourced later), DO NOT draft fictional alt text. Instead, instruct the user to upload each real photo to an AI that can look at images (Claude, ChatGPT Plus, Microsoft Copilot or Google Gemini) once sourced and ask for an alt text suggestion describing the actual image.
- Mark purely decorative images as "decorative, no alt text required."
- Flag any colour-only meaning and suggest a non-colour fix.

3. LINKS
- Rewrite any "click here", "read more", "this page" so the link text makes sense out of context.
- Suggest footnote-style full URLs for printed copies.

4. TABLES
- For DATA tables: mark which row is the header, flag merged or split cells and suggest a flat alternative, add a one-sentence caption above each.
- For LAYOUT tables (Easy Read 2-column image-left / text-right): preserve them, do NOT add a header row or caption and do NOT suggest flattening. Mark each with role="presentation". They are decorative scaffolding for screen readers.

5. DOCUMENT PROPERTIES (set these in Word: File > Info > Properties before export. In Google Docs: File > Document details. In design tools: in document or export settings.)
- Suggest a document title (different from the file name).
- Document language: English (Australia).

6. EXPORT NOTES
- This workshop produces an accessible Word document (or, for Large Print, a Word doc or a layout produced in a design tool). PDF accessibility verification is out of scope (requires Adobe Acrobat Pro).
- If the user wants a PDF copy, note that Word's built-in PDF export with "Document structure tags for accessibility" enabled is a basic starting point only, not full PDF accessibility.
- For web content, NSW and Vic Government recommend an HTML version over a PDF. Note if a webpage version of this content should also exist.

After your marked-up draft, give me:
- A numbered checklist of every change to apply (in Word or my design tool), in order
- A short list of items I need to verify or supply (alt text confirmation, missing source info, photos to add)
- One paragraph I can paste into the document footer noting it follows WCAG 2.2 AA and how readers can request the content in another format

Here is my reviewed draft:
[paste reviewed draft]`,
            expectedOutcome: 'Claude returns the draft with heading levels marked, alt text suggestions, descriptive link text, table notes, document property suggestions, a numbered application checklist, a verification list and a footer paragraph about WCAG 2.2 AA conformance and alternative-format requests.',
            tips: [
              'For long source PDFs, paste the text content rather than uploading. Claude cannot see the visual layout of a PDF reliably from a file upload.',
              'If you finished in Word, run Word\'s built-in Accessibility Checker before exporting: Review > Check Accessibility. Fix any remaining errors. (For Large Print laid out in a design tool, the checker won\'t apply — work through the human review checklist instead.)',
              'If Claude\'s daily message limit hits before you finish, the same prompt works in ChatGPT, Copilot or Gemini. Output quality drops slightly but the structure is preserved.',
              'AI file-generation capability is inconsistent across tools. You may get marked-up text, a downloadable file, or both. All three paths are valid. Whichever you get, run the Step 4 checklist below to verify accessibility. Never publish a file straight from the AI without that check. If the AI returns text only and you have to ask twice for a file, that is also normal: the file capability varies by account state and session, not just by tool.',
            ],
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Step 4: Apply your format\'s settings in Word or your design tool (8 min)',
            introHtml: `<p>Items below are <strong>specific to your chosen format</strong> (loaded from your Lesson 2 brief) and to the tool you choose below. Switch between <strong>Microsoft Word</strong> and <strong>Google Docs</strong> with the selector, your ticks for each are saved separately. Progress saves to this device.</p>
<p><strong>Run this whether the AI returned a file or only text.</strong> AI-generated files routinely miss semantic heading styles, decorative-table marking and document properties. They look right but fail an accessibility check, so treat any AI file as a scaffold, not a final document.</p>`,
            items: [
              'Pick a format in Lesson 2 to load the right checklist for your draft.',
            ],
            toolOptions: [
              { value: 'word', label: 'Microsoft Word' },
              { value: 'google', label: 'Google Docs' },
            ],
            byFormatByTool: {
              word: {
              'Easy Read': [
                'Mark each 2-column layout table as decorative (right-click table > Table Properties > Alt Text > tick "Mark table as decorative"). Repeat for every section.',
                'Set body text to 14pt minimum (Style Manual). 16pt is recommended.',
                'Set line spacing to 1.5 on body text (Home > Line and Paragraph Spacing > 1.5).',
                'Set page margins to at least 2.5cm on every side (Layout > Margins > Custom Margins).',
                'Replace each "IMAGE" placeholder cell with an actual picture (Insert > Pictures > This Device).',
                'For each inserted picture, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask "Suggest alt text for this image." Then add the result via right-click > View Alt Text. Verify it matches the picture before saving. Do not use Claude\'s drafted alt text from Lesson 4 for placeholder photos — Claude could not see them.',
                'Left-align all body text (never justify).',
                'Bold only used for headings and difficult words. Remove decorative bolding.',
                'Set table borders to none if Claude did not (Table Design > Borders > No Border) so the layout is invisible to sighted readers.',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Plain Language': [
                'Apply heading styles in order (Heading 1 for the title, Heading 2 for sections, Heading 3 for sub-sections). Do not skip levels. Verify visually via View > Navigation Pane (Ctrl+F on Windows): the Headings tab shows your document outline so you can confirm every section is at the right level.',
                'Left-align all text (never justify).',
                'Use a sans-serif font (Calibri, Arial or similar).',
                'Set line spacing to 1.5 on body text.',
                'Keep line length under 70 characters wide (adjust margins or column width).',
                'Confirm the reading level estimate Claude returned is year 7 to 8 or lower.',
                'Set page margins to at least 2.5cm on every side.',
                'Set document properties (File > Info > Properties): title and language English (Australia).',
                'For each image in the document, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text describing what the picture shows. Add via right-click image > View Alt Text. Verify before saving.',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Social Story / Visual Narrative': [
                'Insert real photos in chronological order matching the build prompt sections (Before, When I get there, Inside, If I need help, When I leave).',
                'For each inserted photo, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask "Suggest alt text for this image." The alt text should describe what the picture shows (e.g. "Wide view of the market interior with food stalls and shoppers"), NOT the social story narrative. Add via right-click image > View Alt Text. Verify before saving.',
                'Insert a Word page break after each photo + text chunk (Insert > Page Break, or Ctrl+Enter on Windows / Cmd+Enter on Mac) so each photo and its 2 to 4 sentences sit on their own page. This matches the published Social Story booklet convention.',
                'Place each caption directly under its photo, not in a separate list at the end.',
                'Remove any table of contents Claude may have added. A social story is linear, a TOC breaks the journey.',
                'Confirm reading order is strictly chronological top to bottom.',
                'Set body text to 14pt minimum.',
                'Set line spacing to 1.5.',
                'Set page margins to 2.5cm or wider.',
                'Set document properties: title and language English (Australia).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Accessibility Guide': [
                'Confirm the 7 standard headings appear in order: Getting there, Getting in, Getting around, Toilets, Sensory environment, Support, Contact. Each section is a Heading 2 under one Heading 1. Verify visually via View > Navigation Pane (Ctrl+F on Windows): the Headings tab shows your document outline so you can confirm the 7 sections appear as Heading 2 under one Heading 1, in order.',
                'Insert venue photos. For each, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text describing what the photo shows. Add via right-click > View Alt Text. Verify before saving.',
                'Confirm every fact is specific, not vague (e.g. "level entry, 90cm wide door" not "wheelchair accessible").',
                'Address any "needs answer" flags Claude left in the draft.',
                'Add a publishing date and a contact for access questions.',
                'Plan two outputs. Primary: webpage embed on your own site so search engines and screen readers can reach the content directly. Paste the AI text into your CMS keeping the H1 / H2 hierarchy, then add anchor link IDs to each H2 (e.g. id="getting-in") and a jump menu at the top.',
                'Secondary: a designed Word or PDF copy you can send on request when a recipient can only accept an email attachment. Keep heading styles, alt text and document properties intact in the Word version so a screen reader can still navigate it.',
                'Set document properties: title and language English (Australia).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Large Print': [
                'Set body text to 16pt minimum (Vision Australia clear print) or 18pt (RNIB large print).',
                'Set all headings to at least 1.5x the body size.',
                'Use a sans-serif font: Arial, Verdana, Calibri or APHont.',
                'Remove all italics.',
                'Remove all underlines except on hyperlinks.',
                'Apply strong contrast: black text on white, cream or yellow background. Never image-of-text.',
                'Set to single column layout.',
                'Set line spacing to 1.5 minimum.',
                'Set page margins to at least 2.5cm on every side.',
                'If you are working in Word: apply heading styles in order (Heading 1, Heading 2, Heading 3) for each heading, do not skip levels. Verify via View > Navigation Pane. (If you are laying out in a design tool like Canva or InDesign, semantic heading styles do not apply — sizing alone is your structure cue.)',
                'For any image, logo or photo in the document, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text. In Word, add via right-click image > View Alt Text. In a design tool, set alt text in the image properties panel (Canva: Image > Accessibility > Alt text; InDesign: Object Export Options > Alt Text). Mark any purely decorative image as decorative.',
                'Set document properties: title (different from filename) and language English (Australia). Word: File > Info > Properties. Google Docs: File > Document details.',
                'If you are working in Word, save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors. (Design-tool layouts do not have this — rely on the final human review checklist instead.)',
                'If you intend to export to PDF: full PDF accessibility verification is out of scope for this workshop (it needs Adobe Acrobat Pro). Use Word\'s "Document structure tags for accessibility" option on export as a starting point only. Never publish a flat-scan or image-of-text PDF.',
              ],
              'Accessible Word Document': [
                'Apply heading styles in order (H1, H2, H3 etc.), do not skip levels. Verify visually via View > Navigation Pane (Ctrl+F on Windows): the Headings tab shows your document outline so you can confirm every section is at the right level.',
                'Set body text to 12pt minimum. Use a sans-serif font (Calibri, Arial, Verdana).',
                'Set line spacing to 1.15 minimum on body text (1.5 is recommended for longer documents). Home > Line and Paragraph Spacing.',
                'Set page margins to at least 2.5cm on every side (Layout > Margins > Custom Margins).',
                'Left-align body text (never justify).',
                'Replace manual dashes or asterisks with proper bulleted or numbered lists.',
                'For each image, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text. If Claude already drafted alt text from a detailed source description, you can use it as a starting point and verify against the actual image. Add via right-click image > View Alt Text. Verify before saving.',
                'Mark decorative images as decorative (right-click image > View Alt Text > tick "Mark as decorative").',
                'Rewrite any "click here" or "read more" links to be descriptive out of context.',
                'For each data table: mark the header row, add a caption above, flag any merged cells.',
                'Set document properties (File > Info > Properties): title (different from filename) and language English (Australia).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix every error.',
              ],
              },
              google: {
                'Easy Read': [
                  'Build each chunk as a row in a 2-column table (image on the LEFT, text on the RIGHT) via Insert > Table > 2x1.',
                  'Google Docs cannot mark a layout table as decorative, so a screen reader announces it as a data table. Set the table border to 0pt (select the table > Format > Table > Table border > 0pt) so the layout is invisible to sighted readers, and keep every row to one image and its text. If screen reader users are a key audience for this piece, produce the final file in Word, which can mark layout tables as decorative.',
                  'Set body text to 14pt minimum (16pt recommended) using the font size box in the toolbar.',
                  'Set line spacing to 1.5 on body text (Format > Line & paragraph spacing > 1.5).',
                  'Set page margins to at least 2.5cm on every side (File > Page setup > Margins).',
                  'Replace each "IMAGE" placeholder cell with a real picture (Insert > Image > Upload from computer).',
                  'For each inserted picture, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask "Suggest alt text for this image." Then add the result via right-click image > Alt text. Verify it matches the picture before saving. Do not use Claude\'s drafted alt text from Lesson 4 for placeholder photos, Claude could not see them.',
                  'Left-align all body text (never justify).',
                  'Use bold only for headings and difficult words. Remove decorative bolding.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
                'Plain Language': [
                  'Apply heading styles in order via Format > Paragraph styles (Heading 1 for the title, Heading 2 for sections, Heading 3 for sub-sections). Do not skip levels. Do not use the "Title" style as a heading. Verify visually via View > Show outline: the outline panel shows your document structure so you can confirm every section is at the right level.',
                  'Left-align all text (never justify).',
                  'Use a sans-serif font (Arial or similar) from the font menu.',
                  'Set line spacing to 1.5 on body text (Format > Line & paragraph spacing > 1.5).',
                  'Keep line length readable (adjust the margins via File > Page setup).',
                  'Confirm the reading level estimate Claude returned is year 7 to 8 or lower.',
                  'Set page margins to at least 2.5cm on every side (File > Page setup > Margins).',
                  'Set the document title and language to English (Australia) via File > Document details.',
                  'For each image in the document, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text describing what the picture shows. Add via right-click image > Alt text. Verify before saving.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
                'Social Story / Visual Narrative': [
                  'Insert real photos in chronological order matching the build prompt sections (Before, When I get there, Inside, If I need help, When I leave) via Insert > Image > Upload from computer.',
                  'For each inserted photo, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask "Suggest alt text for this image." The alt text should describe what the picture shows (e.g. "Wide view of the market interior with food stalls and shoppers"), NOT the social story narrative. Add via right-click image > Alt text. Verify before saving.',
                  'Insert a page break after each photo + text chunk (Insert > Break > Page break, or Ctrl+Enter on Windows / Cmd+Enter on Mac) so each photo and its 2 to 4 sentences sit on their own page. This matches the published Social Story booklet convention.',
                  'Place each caption directly under its photo, not in a separate list at the end.',
                  'Remove any table of contents Claude may have added. A social story is linear, a TOC breaks the journey.',
                  'Confirm reading order is strictly chronological top to bottom.',
                  'Set body text to 14pt minimum.',
                  'Set line spacing to 1.5 (Format > Line & paragraph spacing).',
                  'Set page margins to 2.5cm or wider (File > Page setup).',
                  'Set the document title and language to English (Australia) via File > Document details.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
                'Accessibility Guide': [
                  'Confirm the 7 standard headings appear in order: Getting there, Getting in, Getting around, Toilets, Sensory environment, Support, Contact. Apply each as Heading 2 via Format > Paragraph styles, under one Heading 1. Verify visually via View > Show outline.',
                  'Insert venue photos (Insert > Image). For each, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text describing what the photo shows. Add via right-click image > Alt text. Verify before saving.',
                  'Confirm every fact is specific, not vague (e.g. "level entry, 90cm wide door" not "wheelchair accessible").',
                  'Address any "needs answer" flags Claude left in the draft.',
                  'Add a publishing date and a contact for access questions.',
                  'Plan two outputs. Primary: a webpage embed on your own site so search engines and screen readers can reach the content directly. Paste the AI text into your CMS keeping the H1 / H2 hierarchy, then add anchor link IDs to each H2 (e.g. id="getting-in") and a jump menu at the top.',
                  'Secondary: a copy you can send on request when a recipient can only accept an email attachment. Keep heading styles, alt text and the document title intact so a screen reader can still navigate it.',
                  'Set the document title and language to English (Australia) via File > Document details.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
                'Large Print': [
                  'Set body text to 16pt minimum (Vision Australia clear print) or 18pt (RNIB large print) using the font size box.',
                  'Set all headings to at least 1.5x the body size.',
                  'Use a sans-serif font: Arial, Verdana or similar. (Google Docs does not include APHont.)',
                  'Remove all italics.',
                  'Remove all underlines except on hyperlinks.',
                  'Apply strong contrast: black text on white, cream or yellow background. Never image-of-text.',
                  'Set to single column layout.',
                  'Set line spacing to 1.5 minimum (Format > Line & paragraph spacing).',
                  'Set page margins to at least 2.5cm on every side (File > Page setup).',
                  'Apply heading styles in order via Format > Paragraph styles (Heading 1, Heading 2, Heading 3), do not skip levels. Verify via View > Show outline.',
                  'For any image, logo or photo, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text. Add via right-click image > Alt text. Google Docs cannot mark an image as decorative, so if an image carries no information, remove it rather than leaving it for a screen reader to announce.',
                  'Set the document title and language to English (Australia) via File > Document details.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
                'Accessible Word Document': [
                  'Apply heading styles in order via Format > Paragraph styles (Heading 1, Heading 2, Heading 3), do not skip levels. Verify visually via View > Show outline.',
                  'Set body text to 12pt minimum. Use a sans-serif font (Arial, Verdana).',
                  'Set line spacing to 1.15 minimum (1.5 recommended for longer documents) via Format > Line & paragraph spacing.',
                  'Set page margins to at least 2.5cm on every side (File > Page setup).',
                  'Left-align body text (never justify).',
                  'Replace manual dashes or asterisks with proper bulleted or numbered lists (toolbar list buttons).',
                  'For each image, upload it to ChatGPT Plus, Claude, Microsoft Copilot or Google Gemini and ask for alt text. If Claude already drafted alt text from a detailed source description, use it as a starting point and verify against the actual image. Add via right-click image > Alt text. Verify before saving.',
                  'Google Docs cannot mark images as decorative. If an image is purely decorative, remove it, since a screen reader will still announce it.',
                  'Rewrite any "click here" or "read more" links to be descriptive out of context (select the text > Insert > Link).',
                  'For data tables: keep one header row and avoid merged cells. Google Docs cannot tag a semantic header row, so keep tables simple. You can repeat the header row visually via right-click > Pin header row.',
                  'Set the document title and language to English (Australia) via File > Document details.',
                  'Google Docs has no built-in accessibility checker. Work through the final human review checklist (Step 5) carefully before publishing.',
                ],
              },
            },
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Step 5: Final human review checklist (3 min)',
            items: [
              'Is everything factually correct about your business and venue?',
              'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
              'Have any photos or images been described accurately?',
              'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
              'Have you added the publishing date and a way for readers to give feedback?',
            ],
            byFormat: {
              'Easy Read': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Have you sourced an image for every text chunk?',
                'Have the images been described accurately in the alt text?',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
              'Plain Language': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
              'Social Story / Visual Narrative': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Have you sourced a photo for every page?',
                'Have the photos been described accurately in the alt text?',
                'Does the photo + text order follow the actual chronological journey?',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
              'Accessibility Guide': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Has someone walked the route and verified the details (entrances, paths, toilets, sensory environment)?',
                'Have any photos or images been described accurately?',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
              'Large Print': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Have you printed a copy and read it at the distance the reader is likely to use? Letters should remain crisp, no pixelation, no crowding.',
                'Have you confirmed the body font size meets the audience\'s stated minimum (16pt Vision Australia clear print, 18pt RNIB)?',
                'Have you checked contrast meets WCAG 2.2 AA (at minimum 4.5:1 for body text)? Black on white, cream or yellow works. Avoid grey-on-white.',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you offered an alternative format on request (electronic copy, audio, Braille via specialist provider)?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
              'Accessible Word Document': [
                'Is everything factually correct about your business and venue?',
                'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
                'Have any photos or images been described accurately in the alt text?',
                'Have you removed any AI-added claims that you cannot verify?',
                'Have you filled every [NEEDS ANSWER] placeholder, or confirmed those gaps will stay as "contact us for current info" in the published version?',
                'Have you added the publishing date and a way for readers to give feedback?',
              ],
            },
          },
        },
        {
          type: 'text',
          heading: 'Layer your review before publishing',
          body: `<p>This workshop is one layer in a larger review process. The full picture, in order:</p>
<ol>
<li>AI draft (this workshop)</li>
<li>Your internal review of facts, tone and accuracy</li>
<li>Claude sense-check (Step 1 of this lesson)</li>
<li>Where resourcing allows: lived-experience review or co-design with the disability community. This is strongly encouraged, particularly for council, authority, NDIS and public-facing content.</li>
<li>Where the content is high-stakes (NDIS plans, health information, legal terms, behaviour support, crisis content): hire an organisation that specialises in making your format. The AI draft can still serve as a brief for them.</li>
</ol>
<p>This course does not replace lived-experience review or co-design. Where you have the resourcing for these, use them. Where you do not, at minimum get one or two readers from your target audience to react to the draft before publishing.</p>`,
        },
        {
          type: 'text',
          heading: 'Step 6: Save your session record (2 min)',
          body: `<p>Scroll to the <strong>Your session record</strong> panel below (marked with the orange TAKE HOME pill). It has two jobs:</p>
<ol>
<li><strong>Download your brief</strong> — format, audience, purpose and where it will live. The only personalised artefact from today.</li>
<li><strong>Note your follow-ups before you leave</strong> — open <code>[NEEDS ANSWER]</code> markers, items Claude flagged for human verification and any assumptions you have not confirmed. Save them next to your draft so you can chase them before publishing.</li>
</ol>
<p>The reusable prompts you used today (system, reviewer, briefing template, all 6 build prompts, iteration, reset, accessibility formatting checklist, human review checklist) live in <strong>Course Materials</strong> at the top of this course. Browse-all link is in the panel below. Re-use them with a new brief next time — half the time, fresh content.</p>
<p><strong>Your work belongs to you.</strong> Anything you have created in this session, including the draft and the brief, is yours. Access Compass does not claim any rights to your content.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'The draft you have created is a draft. Do not publish until a human has reviewed it. Ideally, test with a person from the audience first.',
          },
        },
        {
          type: 'text',
          heading: 'Where to from here',
          body: `<div class="action-cards">
<div class="action-card">
<div class="action-card-num" aria-hidden="true">1</div>
<div class="action-card-body">
<h3>Build momentum</h3>
<p>The hardest part is starting. List every customer-facing piece of communication you have: website pages, signage, menus, booking confirmations, "what to expect" emails, social posts. Mark which would most benefit from an accessible version. Pick one more this week and use your saved prompt pack to convert it. Then keep going at one per week.</p>
</div>
</div>
<div class="action-card">
<div class="action-card-num" aria-hidden="true">2</div>
<div class="action-card-body">
<h3>Connect with people with lived experience</h3>
<p>AI helps you draft. Lived experience tells you whether the draft works. Find one or two people you can pay or partner with for review. While you are at it, add a feedback line to every accessible piece you publish ("Was this useful? Tell us what we could do better.") with a real address that a real person reads.</p>
</div>
</div>
<div class="action-card">
<div class="action-card-num" aria-hidden="true">3</div>
<div class="action-card-body">
<h3>Update your accessible content when your business changes</h3>
<p>Accessible content goes stale. When you renovate, change your hours, change your menu, change your booking system, the accessible versions need updating too. Add this to your business-as-usual checklist.</p>
</div>
</div>
</div>`,
        },
        {
          type: 'take-home',
          takeHome: {
            title: 'Your session record',
            introHtml: `<p><strong>The only personalised takeaway from today.</strong> Your brief baked in, plus a checklist of what to do before you leave. The reusable prompts live in <strong>Course Materials</strong> at the top of this course — same place, always current. Re-use them with a new brief next time.</p>
<p><strong>Before you finish, do these two things:</strong></p>
<ol>
<li><strong>Copy your draft out of ChatGPT.</strong> If your draft is still only in your ChatGPT tab, paste it into Word, Google Docs or a note app now. Close the tab and the draft is gone.</li>
<li><strong>Note your follow-ups.</strong> Open <code>[NEEDS ANSWER]</code> markers in the draft, items Claude's sense-check flagged for human verification, anything you assumed and have not confirmed. Save those next to your draft so you can chase them before publishing.</li>
</ol>
<p><strong>Why the prompts are not bundled in here:</strong> next time you create accessible content, your brief will be different (different audience, different purpose, possibly different format). The generic prompts apply to every session — grab them fresh from Course Materials. Your personalised brief is specific to this session and worth saving as a record of what you used today.</p>`,
            includeBrief: true,
            browseAllLink: {
              label: 'Browse all Course Materials',
              description: 'Every prompt you used today, plus the human review checklist, is downloadable there as PDF or text. Re-use them with a new brief whenever you start a new piece of content.',
              href: '/training/course/ai-accessible-comms',
            },
          },
        },
      ],
    },
  ],
};
