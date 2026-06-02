import type { TrainingCourse } from '../types';

export const aiAccessibleCommsCourse: TrainingCourse = {
  id: 'course-ai-accessible-comms',
  slug: 'ai-accessible-comms',
  title: 'Using AI to Create Accessible & Inclusive Communications',
  subtitle: 'A practical 2-hour workshop. Walk in with content. Walk out with a draft.',
  description: 'Use free AI tools to draft accessible content for your business in under 2 hours. Choose your format, bring your source material and leave with a real first draft you can refine and publish.',
  longDescription: 'This 4-lesson workshop pairs ChatGPT (as your drafting assistant) with Claude (as your reviewer and accessibility markup planner) to produce one piece of accessible content in a single session. You will set up persistent AI instructions, brief the AI on your business and audience, draft your content in your chosen format, sense-check the output against accessibility standards and use Claude to generate an accessibility markup plan you can apply in Word and export as a tagged PDF. The AI does not produce the tagged file directly; it gives you a structured plan (heading levels, alt text suggestions, link rewrites, table notes, document properties) and a checklist of what to apply in Word. Six formats covered: Easy Read, Plain Language, Social Story / Visual Narrative, Accessibility Guide, Large Print and Accessible Digital Document (Word/PDF, following NSW Digital Toolkit and Vic Government guidance, WCAG 2.2 AA). The full prompt pack travels home with you so you can keep going on more content after the session. This workshop is positioned upstream of consultation, never as a substitute. Lived-experience review, co-design with the disability community, your DIAP / DAIP process and specialist producers for high-stakes content (every format has its own producer ecosystem) remain essential.',
  category: 'ai-tools',
  accessTier: 'premium',
  totalEstimatedMinutes: 120,
  skillLevel: 'beginner',
  featured: true,
  author: 'Flare Access',
  publishedDate: '2026-05-18',
  lastUpdated: '2026-05-18',
  keywords: [
    'AI', 'accessible communications', 'Easy Read', 'Plain Language',
    'social story', 'visual narrative', 'accessibility guide', 'large print',
    'accessible Word', 'accessible PDF', 'tagged PDF', 'WCAG 2.2 AA',
    'NSW Digital Toolkit', 'Vic Government accessibility',
    'ChatGPT', 'Claude', 'Copilot', 'Gemini',
    'prompt engineering', 'workshop', 'cohort', 'pilot',
  ],
  learningOutcomes: [
    'Set up a reusable AI assistant configured for accessible content drafting',
    'Brief an AI on your business, your audience and your source material',
    'Draft a first version of accessible content in your chosen format',
    'Use Claude to sense-check your draft against accessibility standards',
    'Use Claude to generate an accessibility markup plan aligned to NSW Digital Toolkit, Vic Government guidance and WCAG 2.2 AA, then apply it in Word and export as a tagged PDF',
    'Apply a human review checklist before publishing',
    'Take home a reusable prompt pack covering six alternative formats',
  ],
  prerequisites: [
    'A free ChatGPT account (chat.openai.com)',
    'A free Claude account (claude.ai). Microsoft Copilot or Google Gemini are also fine as drafting alternatives.',
    'A laptop. Phone screens are too small for this work.',
    'At least 400 words of real source material from your business. Workable options: a webpage section, an FAQ, a policy excerpt, a brochure section, a menu page, signage copy or detailed bullet-point notes. Below 400 words the AI starts inventing access details, which is high-risk for content you intend to publish.',
  ],
  courseDownloads: [
    {
      title: 'Using AI to Create Accessible & Inclusive Communications — Workshop Prompt Pack (PDF)',
      description: 'The full workshop in one printable PDF: system prompt, reviewer prompt, briefing template, all 6 build prompts, iteration prompts, reset prompt, markup plan prompt and human review checklist.',
      fileName: 'ai-accessible-comms-prompt-pack.pdf',
      fileUrl: '/training/downloads/ai-accessible-comms-prompt-pack.pdf',
      fileType: 'PDF',
      fileSize: '23 KB',
    },
    {
      title: 'Using AI to Create Accessible & Inclusive Communications — Workshop Prompt Pack (TXT)',
      description: 'The same full prompt pack as plain text, easier for copying individual prompts into AI tools.',
      fileName: 'ai-accessible-comms-prompt-pack.txt',
      fileUrl: '/training/downloads/ai-accessible-comms-prompt-pack.txt',
      fileType: 'TXT',
      fileSize: '18 KB',
    },
    {
      title: 'AI Assistant System Prompt (PDF)',
      description: 'The ChatGPT system prompt formatted for printing.',
      fileName: 'ai-assistant-system-prompt.pdf',
      fileUrl: '/training/downloads/ai-assistant-system-prompt.pdf',
      fileType: 'PDF',
      fileSize: '7 KB',
    },
    {
      title: 'AI Assistant System Prompt (TXT)',
      description: 'The ChatGPT system prompt as plain text, ready to paste into Custom Instructions or a Project.',
      fileName: 'ai-assistant-system-prompt.txt',
      fileUrl: '/training/downloads/ai-assistant-system-prompt.txt',
      fileType: 'TXT',
      fileSize: '3 KB',
    },
    {
      title: 'Claude Reviewer and Markup Plan Prompts (PDF)',
      description: 'The two Claude prompts formatted for printing.',
      fileName: 'claude-reviewer-and-markup-prompts.pdf',
      fileUrl: '/training/downloads/claude-reviewer-and-markup-prompts.pdf',
      fileType: 'PDF',
      fileSize: '9 KB',
    },
    {
      title: 'Claude Reviewer and Markup Plan Prompts (TXT)',
      description: 'The Claude prompts for sense-checking your draft and generating the accessibility markup plan you apply in Word. Plain text, ready to paste.',
      fileName: 'claude-reviewer-and-markup-prompts.txt',
      fileUrl: '/training/downloads/claude-reviewer-and-markup-prompts.txt',
      fileType: 'TXT',
      fileSize: '5 KB',
    },
    {
      title: 'Human Review Checklist (PDF)',
      description: 'Printable checklist for the final human review pass before publishing. Includes the publishing checklist for tagged PDFs.',
      fileName: 'human-review-checklist.pdf',
      fileUrl: '/training/downloads/human-review-checklist.pdf',
      fileType: 'PDF',
      fileSize: '7 KB',
    },
    {
      title: 'Human Review Checklist (TXT)',
      description: 'Same checklist as plain text, easier for digital use.',
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
<li>Lived-experience review or co-design with the disability community. We know not every business has the resourcing to commission these. Where you do, use them. Where you do not, at minimum get one or two readers from your target audience to react to the draft before publishing.</li>
<li>Specialist producers for high-stakes content in your chosen format. Producer ecosystems exist for every format the workshop covers.
<details class="setup-detail">
<summary>Australian producer suggestions by format</summary>
<ul>
<li><strong>Easy Read</strong>: Inclusion Australia, Scope, AT Assist, Down Syndrome Australia, Council for Intellectual Disability</li>
<li><strong>Plain Language</strong>: Plain English Foundation</li>
<li><strong>Social Story or autistic-audience content</strong>: Amaze (Vic), Autism Awareness Australia, Aspect (NSW)</li>
<li><strong>Accessibility Guide</strong>: an accredited access consultant via the Association of Consultants in Access Australia (ACAA)</li>
<li><strong>Large Print</strong>: Vision Australia</li>
<li><strong>Accessible Digital Document (Word/PDF)</strong>: any of the above for content-level work; for technical accessibility (PDF tagging, PDF/UA conformance), an accredited document accessibility specialist</li>
</ul>
</details>
</li>
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
<li>A laptop with a working internet connection</li>
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
          heading: 'Step 2: Set up where you will paste your prompts (3 min)',
          body: `<p>The system prompt works best as <strong>persistent instructions</strong> that apply to every conversation. Pasting it into one chat works too, but the AI can drift over a long session. Pick the path that matches your drafting tool:</p>
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
<div class="version-note">
<strong>Captured June 2026.</strong> AI tools change their menus often. If a button name or menu in your tool does not match what is shown here, paste this prompt into your AI tool and ask it for current instructions:
<pre><code>I need to set up persistent custom instructions in [your tool, e.g. ChatGPT Plus, ChatGPT free, Claude Pro, Microsoft Copilot, Google Gemini]. Walk me through every click I need to make in the current UI, naming the buttons and menus exactly as they appear today.</code></pre>
</div>
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
</div>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 3: Paste the AI assistant system prompt (5 min)',
            instructions: 'Copy the system prompt below. Paste it into your AI tool, following the path you set up in Step 2 above. (If your tool does not have persistent instructions, paste it at the top of a new chat.)',
            promptTemplate: `ROLE & PURPOSE
You are my Accessible Communications Assistant.

Your job is to help me convert standard business content into accessible and inclusive formats including:
- Easy Read
- Plain Language
- Social Stories and Visual Narratives
- Accessibility Guides
- Accessible Word documents
- Large Print layouts
- Visual Communication (symbol-supported text)

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
- If you can generate a Word file or attachment directly (Artifacts, downloads etc.), APPLY all format-specific layout and typography settings to the file itself, do not just list them as instructions. State what you applied in your reply.
- If you can only return text in chat, append a numbered "Word-application checklist" at the end so I can apply each setting manually.
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- When I am vague, ask for specifics
- When I am stuck, simplify
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.

ACCESSIBILITY STANDARDS REFERENCE
- Easy Read: Inclusion Australia and CID guidelines for content (short sentences, common words, one idea per line, no metaphors). Australian Government Style Manual for layout (image LEFT and text RIGHT in a 2-column presentation table, never image above or below text, minimum 1.5 line spacing, wide margins, minimum 14pt body with larger headings, bold for headings and difficult words only).
- Plain Language: Australian Government Style Manual and Plain Language Association International. Year 7 to 8 reading level. Active voice. Common words.
- Social Stories: Carol Gray model. First person. Descriptive. Non-judgemental.
- Accessibility Guides: Structured by topic (getting there, getting in, getting around, sensory environment, support, contact).
- Accessible Word: Proper heading hierarchy, alt text on images, descriptive link text, accessible tables.
- WCAG 2.2 AA for web content.

WHAT TO DO IN ANY NEW TASK
Your first reply must include:
1. A one or two sentence summary of what you understand the task to be
2. 3 to 5 clarifying questions if needed to fill any gaps
3. Explain any assumptions you would have to make if I cannot answer those questions`,
            expectedOutcome: 'A short, structured confirmation reply once you send the test message below. That tells you the AI assistant is ready for any task in this conversation (or any conversation in the same Project / under the same Custom Instructions).',
            tips: [
              'On Plus or Pro tiers, set up the persistent instructions once and they apply forever. Worth the 2 extra minutes.',
              'On free tiers without persistent instructions, copy the system prompt into a note you can paste at the top of any new chat.',
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
- Does the draft follow the conventions of the requested format (Easy Read, Plain Language, etc.)?

For each draft I paste, reply with these five sections, in this order, using these exact headings so I can scan them quickly:

1. DIAGNOSIS (for me to read)
One sentence summarising the draft.

2. ISSUES TO ACTION (paste this section into ChatGPT)
3 to 5 numbered issues in priority order. Each issue is ONE short sentence naming the problem (not the fix). No commentary between items. This block must be paste-ready so I can copy it straight into ChatGPT and have it rewrite the draft.

3. SUGGESTED RE-WORDINGS (for me to read)
Concrete before-and-after fixes for the top 2 or 3 issues.

4. NEEDS HUMAN VERIFICATION (for me to read)
Facts, names, links, numbers or claims you may be guessing at.

5. NEXT-ITERATION QUESTIONS (for me to read)
1 or 2 questions that would strengthen another pass.

Be direct. If something is weak, say so. If something is excellent, say why.`,
            expectedOutcome: 'A short, structured confirmation from Claude once you send the test message below. You will return to this conversation in Lesson 4 with your draft.',
            tips: [
              'Claude free has no persistent instructions feature, so this prompt only applies to this conversation. Keep the tab open until Lesson 4.',
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
          type: 'take-home',
          takeHome: {
            title: 'Save 1 of 4: your setup prompts',
            introHtml: `<p><strong>This save: your AI assistant prompt and Reviewer prompt.</strong> These are the persistent setup pieces. Reuse them every time you start a new session.</p>
<p>You have already pasted them into ChatGPT and Claude. The prompts live inside those tools, not inside this app. Downloading now means you can paste them straight back in next time without retyping or hunting through this lesson.</p>`,
            promptPack: {
              label: 'AI assistant + reviewer prompts',
              filename: 'accessible-comms-setup-prompts',
              headerNote: 'Paste each of these prompts into the relevant tool to recreate your setup. The AI assistant goes in ChatGPT (or your drafting tool). The reviewer goes in Claude.',
              sections: [
                {
                  heading: 'AI Assistant System Prompt (paste into ChatGPT / drafting tool)',
                  content: `ROLE & PURPOSE
You are my Accessible Communications Assistant.

Your job is to help me convert standard business content into accessible and inclusive formats including:
- Easy Read
- Plain Language
- Social Stories and Visual Narratives
- Accessibility Guides
- Accessible Word documents
- Large Print layouts
- Visual Communication (symbol-supported text)

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
- If you can generate a Word file or attachment directly (Artifacts, downloads etc.), APPLY all format-specific layout and typography settings to the file itself, do not just list them as instructions. State what you applied in your reply.
- If you can only return text in chat, append a numbered "Word-application checklist" at the end so I can apply each setting manually.
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- When I am vague, ask for specifics
- When I am stuck, simplify
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.

ACCESSIBILITY STANDARDS REFERENCE
- Easy Read: Inclusion Australia and CID guidelines for content (short sentences, common words, one idea per line, no metaphors). Australian Government Style Manual for layout (image LEFT and text RIGHT in a 2-column presentation table, never image above or below text, minimum 1.5 line spacing, wide margins, minimum 14pt body with larger headings, bold for headings and difficult words only).
- Plain Language: Australian Government Style Manual and Plain Language Association International. Year 7 to 8 reading level. Active voice. Common words.
- Social Stories: Carol Gray model. First person. Descriptive. Non-judgemental.
- Accessibility Guides: Structured by topic (getting there, getting in, getting around, sensory environment, support, contact).
- Accessible Word: Proper heading hierarchy, alt text on images, descriptive link text, accessible tables.
- WCAG 2.2 AA for web content.

WHAT TO DO IN ANY NEW TASK
Your first reply must include:
1. A one or two sentence summary of what you understand the task to be
2. 3 to 5 clarifying questions if needed to fill any gaps
3. Explain any assumptions you would have to make if I cannot answer those questions`,
                },
                {
                  heading: 'Reviewer Prompt (paste into Claude)',
                  content: `You are my Accessible Communications Reviewer.

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
- Does the draft follow the conventions of the requested format (Easy Read, Plain Language, etc.)?

For each draft I paste, reply with these five sections, in this order, using these exact headings so I can scan them quickly:

1. DIAGNOSIS (for me to read)
One sentence summarising the draft.

2. ISSUES TO ACTION (paste this section into ChatGPT)
3 to 5 numbered issues in priority order. Each issue is ONE short sentence naming the problem (not the fix). No commentary between items. This block must be paste-ready so I can copy it straight into ChatGPT and have it rewrite the draft.

3. SUGGESTED RE-WORDINGS (for me to read)
Concrete before-and-after fixes for the top 2 or 3 issues.

4. NEEDS HUMAN VERIFICATION (for me to read)
Facts, names, links, numbers or claims you may be guessing at.

5. NEXT-ITERATION QUESTIONS (for me to read)
1 or 2 questions that would strengthen another pass.

Be direct. If something is weak, say so. If something is excellent, say why.`,
                },
              ],
            },
          },
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
<div class="version-note">
<strong>Captured June 2026.</strong> AI responses can vary as models update. If the AI's reply differs from what is described here (different question wording, slightly different format, extra or missing sections), proceed anyway. The briefing pattern is robust enough to still produce a usable draft. If something feels off, paste this prompt to reset it:
<pre><code>Please restart this task and follow the briefing prompt exactly. Confirm what you understand in 2 to 3 sentences, then ask 3 to 5 clarifying questions, then list any assumptions you would have to make.</code></pre>
</div>`,
        },
        {
          type: 'text',
          heading: 'Step 1: Choose your format (3 min)',
          body: `<p>Pick one format to create in this session. You can come back for the others later using the prompt pack.</p>
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
<td><strong>Accessible Digital Document (Word/PDF)</strong></td>
<td>Existing Word docs or PDFs (policies, info sheets, fact sheets, menus) that need to work with screen readers and meet WCAG 2.2 AA</td>
<td>Low-Medium</td>
</tr>
<tr>
<td><strong>Large Print</strong></td>
<td>Reformatting short content (menus, programs) for low-vision readers</td>
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
            helpText: 'Fill these in once. Your brief saves locally to your browser and pre-fills the briefing prompt in Step 3, the sense-check prompt in Lesson 4 and the markup plan prompt in Lesson 4. You can change it anytime. Use the Copy your brief button to take a plain-text version into other tools or save in your notes.',
            formats: [
              { value: 'Easy Read', label: 'Easy Read' },
              { value: 'Plain Language', label: 'Plain Language' },
              { value: 'Social Story / Visual Narrative', label: 'Social Story / Visual Narrative' },
              { value: 'Accessibility Guide', label: 'Accessibility Guide' },
              { value: 'Large Print', label: 'Large Print' },
              { value: 'Accessible Digital Document (Word/PDF)', label: 'Accessible Digital Document (Word/PDF)' },
            ],
            audienceLabel: 'For audience',
            audienceExample: 'parents of children visiting our museum, or first-time wheelchair users visiting our cafe, or staff onboarding into accessibility procedures',
            contextFields: [
              {
                key: 'WHO USES IT',
                label: 'Who will use this content',
                example: 'first-time visitors planning a trip, parents booking online, staff at our welcome desk',
              },
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
            ],
            briefGuidance: {
              title: 'What makes a good brief?',
              bodyHtml: `<p>A brief is the small set of facts the AI needs before it can draft anything useful. The shorter and more specific, the better the draft.</p>
<p><strong>Each field, what it does:</strong></p>
<ul>
<li><strong>Format</strong> tells the AI which set of writing rules to apply. Easy Read is short sentences with images. Plain Language is year 7 to 8 reading level. Accessibility Guide has a structured 7-section layout.</li>
<li><strong>Audience</strong> shapes vocabulary, tone and what to leave out. The more specific, the better. "Members of the public" is too vague. "People booking online who use a screen reader" lets the AI pick the right voice.</li>
<li><strong>Who uses it</strong> separates the person reading from the person being talked about. Sometimes the same, sometimes not. "Parents booking on behalf of their autistic teenager" tells the AI to address parents while still respecting the teenager's experience.</li>
<li><strong>What it helps them do</strong> is the outcome. "Plan a visit", "know what to expect at the entrance", "decide whether to come at all". Tells the AI what to lead with.</li>
<li><strong>Where it will live</strong> sets length and tone. A booking confirmation email is 3 short paragraphs. A website page can be longer with headings. Knowing this stops the AI writing a 1,500-word essay when you need a sign.</li>
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
              title: 'Not sure what to put in your brief? Get the AI to walk you through it',
              introHtml: `<p>Copy the prompt below and paste it into ChatGPT, Claude or Copilot in a new chat. The AI will ask you one question at a time, then summarise your brief at the end so you can fill in the fields above. No need to write it all yourself.</p>`,
              prompt: `You are helping me build a project brief for accessible content I want to make for my business. Ask me one question at a time and wait for my answer before asking the next.

Cover these in order:
1. What kind of business are you (in one or two sentences)?
2. What format do you want to make (Easy Read, Plain Language, Social Story, Accessibility Guide, Large Print or Accessible Digital Document)? If unsure, ask me about my situation and recommend one.
3. Who is your audience (be specific: think about access needs, age, familiarity with your business, language)?
4. Who will actually USE the content (sometimes different from the audience, e.g. parents using it on behalf of children)?
5. What does the content help them do (the practical outcome)?
6. Where will it live (specific website page, booking confirmation email, printed handout, etc.)?
7. What MUST the content get right (any tone, fact or detail that is non-negotiable)?

After my last answer, summarise my brief as five short bullet points labelled Format, Audience, Who uses it, Purpose, Where it lives. Stop there. Do not draft the content yet.`,
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
<td>An existing webpage, FAQ, brochure, policy doc or bullet-point notes</td>
<td>Paste a short description of the topic. The AI will ask you the questions it needs answered.</td>
</tr>
<tr>
<td>Plain Language</td>
<td>Any text document, letter, email, policy, set of instructions</td>
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
<td>Accessible Digital Document (Word/PDF)</td>
<td>An existing Word doc or PDF you want to make accessible (paste the text content; if PDF, you may need to copy text out first)</td>
<td>n/a (you need an existing document)</td>
</tr>
<tr>
<td>Large Print</td>
<td>Any short piece of text</td>
<td>The AI will help you reformat what you have</td>
</tr>
</tbody>
</table>
<p>If you have nothing prepared, you can still pick most formats. The AI can interview you for the facts it needs. Open the "I have no source material yet" panel below for the prompt that turns the AI into your interviewer.</p>
<details class="setup-detail">
<summary><strong>I have no source material yet</strong>: get the AI to interview you</summary>
<p>Paste this prompt into the same AI chat where you set up the system prompt (Lesson 1) and the briefing prompt (Step 3 below). The AI will ask you one question at a time and use your answers as the source for the draft.</p>
<pre><code>I do not have source material prepared. I want to create [FORMAT NAME] for [AUDIENCE].

The topic is: [one sentence on what your content is about].

Please interview me to gather the source material you need. Ask one question at a time, in this order:
1. What is the single most important thing my audience needs to know?
2. What specific facts, processes or details should the content include?
3. What tone fits my business (formal, friendly, technical)?
4. Are there any specific things I do not want to leave out?
5. What could go wrong if I get this wrong?

Ask 5 to 8 questions total. After my last answer, summarise what you learned in a short bullet list, then proceed to the build prompt for [FORMAT NAME].</code></pre>
</details>
<div class="heads-up-note">
<div class="heads-up-label">Heads up</div>
<p>Two formats really do need existing source content: <strong>Large Print</strong> (reformats short content you already have) and <strong>Accessible Digital Document (Word/PDF)</strong> (makes an existing document accessible). If you have neither, pick Plain Language, Easy Read, Social Story or Accessibility Guide. You can come back to Large Print or Accessible Digital Document once you have a finished draft.</p>
</div>
<h3 class="path-section-heading">Choose your path</h3>
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
<div class="upload-warning"><strong>Do not upload anything containing:</strong> personal information about staff or customers, your business's confidential intellectual property, client data, commercial-in-confidence material, paid research you do not own the rights to, or anything covered by an NDA. Use redacted or public-facing versions if you are unsure.</div>
</details>
</div>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'Got nothing prepared? You can still pick any format. The AI will prompt you for what it needs. Plain Language and Easy Read work well from bullet-point notes. Social Story works from a walkthrough description. Accessibility Guide is the most structured if you are unsure where to start, since the AI walks you through a checklist of venue questions and the answers become the guide.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 3: Brief your AI assistant (10 min)',
            instructions: 'Copy the briefing prompt below into ChatGPT. Fill in the brackets with your format, audience, source material and any "must get right" details.',
            promptTemplate: `I want to create a [FORMAT NAME] for [AUDIENCE].

This will be used by [WHO USES IT] to [PURPOSE].

It will live [WHERE IT WILL BE PUBLISHED].

Here is my source material:
[paste text, link or notes here]

Here are the most important things to get right:
[e.g., must mention wheelchair access, must use our cafe's friendly tone, must be under 500 words]

Before drafting:
1. Confirm in 2 to 3 sentences what you understand.
2. Ask me 3 to 5 clarifying questions to fill any gaps.
3. List any assumptions you would have to make if I cannot answer.`,
            expectedOutcome: 'ChatGPT replies with a short summary of what it understands, plus 3 to 5 clarifying questions. The AI now has full context once you have answered them.',
            tips: [
              'Examples of good answers: "Wheelchair access: yes, level entry through the side gate, contact reception."',
              'Examples of good answers: "Tone: friendly but professional, similar to our website homepage."',
              'If you do not know something, say "Don\'t know, please flag this as needing a human to confirm."',
            ],
          },
        },
        {
          type: 'text',
          body: `<details class="setup-detail">
<summary><strong>Not sure what is most important to get right?</strong></summary>
<p>The "Here are the most important things to get right" line is optional. You have three choices if you do not know what to put.</p>
<ol>
<li><strong>Skip it.</strong> Delete the bracketed example and that line entirely. The AI will surface anything important in its clarifying questions.</li>
<li><strong>Ask the AI to suggest them.</strong> Paste this prompt into the same chat and let the AI propose the top three based on your brief and source material.</li>
<li><strong>Write what you do know.</strong> One thing is enough. "Must use our friendly tone" or "Must mention the level entry" is plenty to anchor the draft.</li>
</ol>
<pre><code>Based on the brief and source material I have just given you, suggest the top 3 things I should treat as non-negotiable in the draft. For each one, explain in one sentence why it matters for my audience. Wait for me to confirm before drafting.</code></pre>
<p>Whichever path you pick, do not leave the example brackets in. The AI will read them as real instructions.</p>
</details>`,
        },
        {
          type: 'text',
          body: `<div class="do-now">
<div class="do-now-label">Do this next</div>
<p>When ChatGPT replies with its clarifying questions, answer them honestly. If you do not know an answer, say so. You can also ask ChatGPT to suggest one based on your brief and source material, then accept, edit or reject its suggestion. It is fine to answer in fragments and bullet points.</p>
</div>`,
        },
        {
          type: 'text',
          heading: 'Step 4: Confirm and proceed (1 min)',
          body: `<p>Once you have answered the AI's clarifying questions, type this:</p>
<pre><code>Summarise what you know. Flag any gap. If none, proceed to drafting in the next message.</code></pre>
<p>Read the reply. Fill any gaps the AI surfaces. Lesson 2 complete.</p>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'warning',
            text: 'Anything the AI tells you it "knows" about your business that you did not tell it is a guess. Treat it as a prompt to verify, not a fact.',
          },
        },
        {
          type: 'take-home',
          takeHome: {
            title: 'Save 2 of 4: your brief',
            introHtml: `<p><strong>This save: your filled-in brief.</strong> Format, audience, who uses it, purpose, where it lives. This is the only save in the workshop that is personalised to your business, so it is the slowest to recreate from scratch.</p>
<p>Use Download to save a file to your computer, or Copy to paste it into your own notes app, email or another AI tool.</p>
<p>The brief will still be saved in the app on this device the next time you open the lesson. Downloading is your insurance for when that device changes, the browser clears its storage or you want to share the brief with a colleague.</p>`,
            includeBrief: true,
          },
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
          body: `<p>Your build prompt is shown expanded below, based on the format you picked in Lesson 2. The other 5 are collapsed. Open any if you want to compare or try a different format later. Copy your build prompt and paste it into ChatGPT.</p>
<p>If you have not picked a format yet, all 6 will be collapsed. Open the one that matches your plan.</p>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Easy Read',
            formatKey: 'Easy Read',
            instructions: 'For Easy Read content following Inclusion Australia and CID guidelines for content, and the Australian Government Style Manual for layout. Copy the prompt below and paste it into your ChatGPT conversation (which already has your business context from Lesson 2).',
            promptTemplate: `Please draft this in Easy Read format following Inclusion Australia and CID guidelines for content, and the Australian Government Style Manual for layout.

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
- Image column format: "[Image: short description of what the picture shows]" on one line, then "Alt text: ..." on the next line. Do not generate the image, just describe it.

TYPOGRAPHY GUIDANCE FOR WHEN I PUT THIS IN WORD (include as a checklist at the end)
- Minimum 14pt body, larger for headings
- Minimum 1.5 line spacing
- Bold only for headings and difficult words
- Left-aligned text
- Wide margins (at least 2.5cm on each side)
- Use colour and contrast for emphasis but never as the only signal of meaning
- When I put the 2-column rows into Word as tables, set role="presentation" on each so screen readers do not announce them as data tables

After the draft, list:
- Any words you used that may still be too hard
- Any sections that would benefit from an example
- Anything I should verify with a human reviewer
- One line on why the 2-column image-left / text-right layout matters for this audience, so I can defend the design choice if asked`,
            expectedOutcome: 'A draft laid out as 2-column rows (image-suggestion left, text right) with alt text per chunk, plus a layout and typography checklist for applying it in Word and a list of words or sections that need extra attention.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Plain Language',
            formatKey: 'Plain Language',
            instructions: 'For Plain Language content following the Australian Government Style Manual.',
            promptTemplate: `Please draft this in Plain Language following the Australian Government Style Manual.

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
- One sentence on what the reader should walk away knowing`,
            expectedOutcome: 'A Plain Language draft at year 7 to 8 reading level, with an estimated reading level, a list of replacement word suggestions and a one-sentence summary of the key takeaway.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Social Story / Visual Narrative',
            formatKey: 'Social Story / Visual Narrative',
            instructions: 'For a first-person walkthrough of an experience using photos and short sentences.',
            promptTemplate: `Please draft this as a Social Story / Visual Narrative.

Apply these rules:
- Written in first person ("I will...", "I might see...")
- Descriptive and reassuring, not instructional or judgemental
- Walk the reader through the experience in the order it happens
- Note sensory details (what they will see, hear, smell, feel)
- Mention what staff or other people might do
- Acknowledge that things can change and that's okay
- Suggest where photos should sit (describe each photo, do not generate)
- Use short sentences

Structure the draft as:
1. Before I arrive
2. When I get there
3. What I will see and do inside
4. If I need help
5. When I leave

After the draft, list:
- Photos I should take to go with each section
- Anything I should verify or add from a real walk-through
- Variations to consider (e.g., for a quieter sensory experience)`,
            expectedOutcome: 'A first-person social story or visual narrative in 5 chronological sections, with photo suggestions and notes on what to verify in a real walk-through.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Accessibility Guide',
            formatKey: 'Accessibility Guide',
            instructions: 'For structured info about the access features of a venue, event or service.',
            promptTemplate: `Please draft an Accessibility Guide for my venue or event.

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
- Anything that would benefit from a human to verify`,
            expectedOutcome: 'An Accessibility Guide structured under 7 standard headings, with specific facts where you have provided them and "needs answer" flags where you have not.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Accessible Digital Document (Word/PDF)',
            formatKey: 'Accessible Digital Document (Word/PDF)',
            instructions: 'For making an existing Word document or PDF accessible to screen readers and meeting WCAG 2.2 AA. Built on NSW Digital Toolkit and Vic Government accessibility guidance. Works for policies, info sheets, fact sheets, menus, staff briefings and similar. This format needs an existing document to make accessible. If you have nothing yet, pick a different format (Plain Language, Easy Read, Social Story or Accessibility Guide) to create the content first, then come back here to make the finished version a tagged PDF.',
            promptTemplate: `I have a digital document I want to make accessible. I want to publish it as an accessible Word document and export a tagged PDF version. I will paste the content below.

Please apply this structure (based on NSW Digital Toolkit PDF accessibility guidance and Vic Government make-content-accessible standards, targeting WCAG 2.2 AA):

1. STRUCTURE
- Suggest a heading hierarchy. Mark each line as H1 / H2 / H3 etc. Do not skip levels.
- Set a logical reading order top-to-bottom. Flag any content that may float (text boxes, sidebars).
- Replace manual dashes or asterisks with proper bulleted or numbered lists.

2. PLAIN LANGUAGE PASS
- Estimate reading level. Flag any sentence over 20 words or any jargon a general audience would miss.
- Rewrite the top 5 hardest sentences in plainer language.

3. IMAGES
- For every image in the source, suggest alt text (one sentence, describing the message not the visual).
- If an image is purely decorative, mark it "decorative, no alt text required."
- Flag any place where colour alone conveys meaning (e.g., "red items are urgent") and suggest a non-colour fix.

4. LINKS
- Rewrite any "click here", "read more", "this page" link text so it makes sense out of context.
- For printed copies, suggest a footnote with the full URL.

5. TABLES
- Mark which row is the header.
- Flag any merged or split cells. Suggest a flat alternative.
- Add a one-sentence caption above each table describing its purpose.

6. DOCUMENT PROPERTIES (to set in Word File > Info > Properties before export)
- Suggest a document title (different from the file name).
- Document language: English (Australia).
- Author: my business name.
- Subject and keywords: suggest 3 to 5 from the content.

7. EXPORT NOTES
- Save in Word with "Document structure tags for accessibility" enabled when saving as PDF.
- Note: NSW and Vic Government both recommend an HTML equivalent for any PDF published online (PDFs are not mobile-friendly and slower to load). Suggest if a webpage version of this content should also exist.
- If using Adobe Acrobat Pro after export: run Tools > Prepare for Accessibility > Accessibility Check.

After your analysis, give me:
- A numbered checklist of every change to make in Word, in order
- A short list of items I need to verify or supply (alt text confirmation, missing source info)
- One paragraph I can paste into the document footer noting it follows WCAG 2.2 AA and how readers can request the content in another format

Here is the content:
[paste content]`,
            expectedOutcome: 'A numbered Word-application checklist (heading suggestions, link rewrites, alt text drafts, list conversions, colour-only fixes, table structure notes, document properties, export settings), a list of items to verify and a footer paragraph noting WCAG 2.2 AA conformance.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Build prompt: Large Print',
            formatKey: 'Large Print',
            instructions: 'For reformatting short content for low-vision readers, following Vision Australia clear print guidance. This format needs existing short content to reformat (a menu page, a flyer, an announcement, a one-page summary). If you have no source content yet, use Plain Language or Easy Read first, then come back to Large Print to reformat the result.',
            promptTemplate: `I have content I want to provide in Large Print. I will paste it below.

Please:
1. Confirm the content is appropriate for Large Print (short, high-priority information)
2. Suggest any text edits to make it scannable (shorter sentences, clearer headings, removing decorative content)
3. Give me the formatting checklist for Large Print (minimum font size, font family, line spacing, contrast, paper colour, margins) following Vision Australia guidance

Here is the content:
[paste content]`,
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
          body: `<p>Run 2 iteration rounds. One change per round works better than asking for everything at once. Pick the iteration prompts below that match what you want changed. (A 3rd round is rare when the first build prompt has done its job. Only run it if a real issue is unresolved.)</p>
<p><strong>Make it clearer:</strong></p>
<pre><code>Rewrite section [X] using shorter sentences and simpler words. Aim for a reading age of 12 or below.</code></pre>
<p><strong>Make it shorter:</strong></p>
<pre><code>The [section / overall draft] is too long. Cut it by 30% without losing the key information.</code></pre>
<p><strong>Make it friendlier:</strong></p>
<pre><code>The tone feels too formal. Rewrite it to sound warmer and more welcoming, while keeping the structure.</code></pre>
<p><strong>Add specifics:</strong></p>
<pre><code>Add concrete examples in section [X]. Use [these details I'll provide]: [paste details]</code></pre>
<p><strong>Fix accuracy:</strong></p>
<pre><code>You assumed [X]. The actual situation is [Y]. Please rewrite the relevant sections.</code></pre>
<p><strong>Add what is missing:</strong></p>
<pre><code>You haven't covered [X]. Please add a section about it. Here's what you need to know: [paste info]</code></pre>`,
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
        {
          type: 'take-home',
          takeHome: {
            title: 'Save 3 of 4: your draft',
            introHtml: `<p><strong>This save: the draft you just made.</strong> Different from the earlier saves. Saves 1 and 2 were infrastructure (prompts and brief). This one is the content itself.</p>
<p>Your draft lives inside your AI chat, not inside this app. If you close the tab without saving, you may lose it. Right now is the time to copy your draft from your AI tool into a Word doc, Google Doc or note app you control, and save it there.</p>
<p>Your build prompt and iteration prompts are still on this page, so you can re-run them later if you start over. Lesson 4 picks up where this leaves off, sense-checking the draft you just saved.</p>`,
          },
        },
      ],
    },
    {
      id: 'lesson-4-sense-check-and-save',
      courseId: 'course-ai-accessible-comms',
      title: 'Sense-Check and Save',
      subtitle: 'Cross-check with Claude, apply changes, save your prompt pack',
      description: 'Send your draft to Claude for an accessibility sense-check, apply the most important changes back in ChatGPT, run the human review checklist and save your reusable prompt pack.',
      order: 4,
      estimatedMinutes: 42,
      accessTier: 'premium',
      keywords: ['sense-check', 'cross-LLM', 'human review', 'prompt pack', 'maintenance'],
      contentBlocks: [
        {
          type: 'text',
          heading: 'What you will achieve in this lesson',
          body: `<p>By the end of this lesson, Claude has sense-checked your draft, you have applied the most important changes back in ChatGPT, Claude has generated an accessibility markup plan for you to apply in Word and export as a tagged PDF, you have run the human review checklist and your prompts are saved for next time.</p>
<p><strong>How the lesson runs:</strong></p>
<ol>
<li>Send your draft to Claude for sense-check (10 min)</li>
<li>Decide what to action (5 min)</li>
<li>Apply changes in ChatGPT (10 min)</li>
<li>Use Claude to build your accessibility markup plan (12 min)</li>
<li>Apply your format's settings in Word (8 min)</li>
<li>Final human review checklist (3 min)</li>
<li>Save your prompt pack (2 min)</li>
</ol>`,
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 1: Send your draft to Claude for sense-check (10 min)',
            instructions: 'Copy your current draft from ChatGPT. Switch to your Claude tab (which already has the Reviewer prompt set up from Lesson 1). Paste the message below and fill in the brackets.',
            promptTemplate: `Here is a draft I have created for [FORMAT NAME] aimed at [AUDIENCE].

Please sense-check it using the framework you've been set up with.

[paste draft]`,
            expectedOutcome: 'Claude returns a one-sentence diagnosis, the top 3 to 5 issues, suggested re-wordings for the top 2 or 3, items needing human verification and 1 to 2 questions for the next iteration.',
            tips: [
              'If Claude\'s free tier limit hits before you finish, paste the Reviewer prompt and this draft into ChatGPT, Copilot or Gemini instead. The framework is portable.',
              'If Claude\'s reply skips one of the five framework sections, ask it to redo the missing section. Do not let it drop categories silently.',
            ],
          },
        },
        {
          type: 'text',
          heading: 'Step 2: Decide what to action (5 min)',
          body: `<p>Read Claude's reply. The Reviewer prompt is set up so Claude labels the section you need: <strong>"2. ISSUES TO ACTION (paste this section into ChatGPT)"</strong>. That is the only part you feed back.</p>
<p>Within that section, pick the top 1 to 3 issues worth making now. Skip anything that is nice-to-have or needs info you do not have.</p>
<p><strong>You do not edit the draft yourself.</strong> ChatGPT rewrites the full draft from those issues in Step 3. Your job here is just to choose which ones to action.</p>
<div class="heads-up-note">
<div class="heads-up-label">Heads up</div>
<p>If your Claude chat was set up before this prompt was updated, the reply may use the old format (one-sentence diagnosis, top issues, re-wordings, etc.) with no "ISSUES TO ACTION" heading. The issues are still in the same place in priority order. To switch to the new format for future drafts, copy the Reviewer prompt from Course Materials and paste it into a fresh Claude chat.</p>
</div>`,
        },
        {
          type: 'callout',
          callout: {
            variant: 'tip',
            text: 'If Claude flags something you disagree with, that is fine. You know your business better than Claude does. Note your reasoning and move on.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 3: Apply the changes in ChatGPT (10 min)',
            instructions: 'Switch back to ChatGPT (same conversation as Lesson 3). Paste the message below and replace each [issue] line with one of the issues you picked from Claude\'s "ISSUES TO ACTION" section. The issues are already written as single short sentences, so you can copy them word-for-word. ChatGPT rewrites the full draft for you, you do not edit anything by hand.',
            promptTemplate: `A sense-check has flagged these issues with our latest draft:
1. [issue]
2. [issue]
3. [issue]

Please update the draft to address these. Show the full updated draft.`,
            expectedOutcome: 'ChatGPT returns an updated draft with the issues addressed. Save it.',
            tips: [
              'Only fill in the issue lines you actually have. If Claude only surfaced one issue worth acting on, delete lines 2 and 3 before sending.',
              'If you are uncertain how to phrase an issue, paste Claude\'s exact wording for it. ChatGPT will interpret it correctly in this context.',
            ],
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 4: Use Claude to build your accessibility markup plan (12 min)',
            instructions: 'Claude does not produce a tagged PDF or accessible Word file directly. What it produces is a structured markup plan: heading levels (H1, H2 etc.), alt text suggestions, link rewrites, table notes, document property suggestions and a numbered checklist of what to apply in Word. You apply that plan in Word and export with structure tags enabled to produce the actual tagged PDF. Claude is stronger than ChatGPT at producing this kind of structured longer output, which is why we use it here. Copy your updated draft from ChatGPT. Switch to your Claude tab (the Reviewer conversation from Lesson 1 is fine to reuse). Paste the prompt below with your reviewed draft at the bottom.',
            promptTemplate: `I have a reviewed draft I want to publish as an accessible Word document and export as a tagged PDF.

Please produce a structured version with the accessibility scaffolding marked up, following NSW Digital Toolkit PDF accessibility guidance, Vic Government make-content-accessible standards and the Australian Government Style Manual content-types (stylemanual.gov.au/content-types) for format-specific structure and typography, targeting WCAG 2.2 AA.

FORMAT CONTEXT
- My draft format is: [FORMAT NAME]
- If the format is Easy Read, preserve the 2-column image-left / text-right layout from the build prompt. Do NOT flatten it to a single column. Mark each layout table with role="presentation" so screen readers skip it. Apply Style Manual typography (minimum 14pt body, 1.5 line spacing, wide margins, bold for headings only).
- If the format is Plain Language, the structure is a clean single-column document. Left-aligned text (never justified). Keep line length under 70 characters wide for readability. Generic structure / images / links / tables guidance below applies as-is.
- If the format is Social Story / Visual Narrative, preserve the photo-per-chunk pairing from the build prompt (do not strip, batch or reorder images). Reading order must follow the chronological journey, do NOT add a table of contents. Alt text should match the first-person voice ("I will see automatic glass doors", not just "automatic glass doors"). Captions belong directly under each photo, not in a separate list.
- If the format is Accessibility Guide, preserve the 7-section order from the build prompt (Getting there, Getting in, Getting around, Toilets, Sensory environment, Support, Contact) so readers can compare across venues. Each section is an H2 under one H1. If this will be published as a webpage, add anchor links for each H2 and a jump menu at the top.
- If the format is Large Print, typography is the format. Apply Vision Australia clear print (minimum 16pt body) or RNIB large print (minimum 18pt). Sans-serif font family (Arial, Verdana, Calibri or APHont). No italics. No underlines except on links. No decorative fonts. Strong contrast (black on white, cream or yellow), never image-of-text. Single column. Headings 1.5x body size minimum. Line spacing minimum 1.5. Keep PDF text selectable and re-flowable, never flat-scan.

1. STRUCTURE
- Mark each line or section with its heading level (H1, H2, H3 etc.). Do not skip levels.
- Set a logical reading order top-to-bottom.
- Replace manual dashes or asterisks with proper bulleted or numbered lists.

2. IMAGES
- For each image in the draft (or that I describe), suggest alt text (one sentence, message-focused, not just visual description).
- Mark purely decorative images as "decorative, no alt text required."
- Flag any colour-only meaning and suggest a non-colour fix.

3. LINKS
- Rewrite any "click here", "read more", "this page" so the link text makes sense out of context.
- Suggest footnote-style full URLs for printed copies.

4. TABLES
- For DATA tables: mark which row is the header, flag merged or split cells and suggest a flat alternative, add a one-sentence caption above each.
- For LAYOUT tables (Easy Read 2-column image-left / text-right): preserve them, do NOT add a header row or caption and do NOT suggest flattening. Mark each with role="presentation". They are decorative scaffolding for screen readers.

5. DOCUMENT PROPERTIES (to set in Word File > Info > Properties before export)
- Suggest a document title (different from the file name).
- Document language: English (Australia).
- Author: my business name.
- 3 to 5 keywords from the content.

6. EXPORT NOTES
- In Word, save as PDF with "Document structure tags for accessibility" enabled.
- NSW and Vic Government both recommend an HTML equivalent for any PDF published online (PDFs are not mobile-friendly and slower to load). Note if a webpage version of this content should also exist.
- If using Adobe Acrobat Pro after export: Tools > Prepare for Accessibility > Accessibility Check.

After your marked-up draft, give me:
- A numbered checklist of every change to apply in Word, in order
- A short list of items I need to verify or supply (alt text confirmation, missing source info, photos to add)
- One paragraph I can paste into the document footer noting it follows WCAG 2.2 AA and how readers can request the content in another format

Here is my reviewed draft:
[paste reviewed draft]`,
            expectedOutcome: 'Claude returns the draft with heading levels marked, alt text suggestions, descriptive link text, table notes, document property suggestions, a Word-application checklist, a verification list and a footer paragraph about WCAG 2.2 AA conformance and alternative-format requests.',
            tips: [
              'For long source PDFs, paste the text content rather than uploading. Claude cannot see the visual layout of a PDF reliably from a file upload.',
              'After applying changes in Word, run Word\'s built-in Accessibility Checker: Review > Check Accessibility. Fix any remaining errors before exporting.',
              'When you export, choose "Best for electronic distribution and accessibility (PDF/A)" in the Save dialog to preserve the structure tags.',
              'If Claude\'s daily message limit hits before you finish, the same prompt works in ChatGPT, Copilot or Gemini. Output quality drops slightly but the structure is preserved.',
            ],
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Step 5: Apply your format\'s settings in Word (8 min)',
            introHtml: `<p>Claude\'s markup plan lists what to apply. This checklist tracks it. The items are <strong>specific to your chosen format</strong> and load automatically based on the brief you filled in Lesson 2. Tick each item as you apply it. Your progress saves to this device.</p>
<p><strong>If Claude generated the Word file directly</strong> (via Artifacts or a download), use this checklist to verify each setting is present. If Claude only returned text, use it as your apply-in-Word list.</p>
<p><strong>Using Google Docs instead of Word?</strong> Most items have a Google Docs equivalent: headings via Format &gt; Paragraph styles, alt text via right-click image &gt; Alt text, line spacing via Format &gt; Line and paragraph spacing, margins via File &gt; Page setup. Two real limitations to know about: Google Docs cannot mark tables as decorative (screen readers will announce layout tables as data tables) and Google Docs PDF export does not reliably preserve structure tags. For tagged PDF output, finish the document in Word or LibreOffice. Google Docs is fine for drafting, problematic for final accessible-document production.</p>`,
            items: [
              'Pick a format in Lesson 2 to load the right checklist for your draft.',
            ],
            byFormat: {
              'Easy Read': [
                'Mark each 2-column layout table as decorative (right-click table > Table Properties > Alt Text > tick "Mark table as decorative"). Repeat for every section.',
                'Set body text to 14pt minimum (Style Manual). 16pt is recommended.',
                'Set line spacing to 1.5 on body text (Home > Line and Paragraph Spacing > 1.5).',
                'Set page margins to at least 2.5cm on every side (Layout > Margins > Custom Margins).',
                'Replace each "IMAGE" placeholder cell with an actual picture (Insert > Pictures > This Device).',
                'Right-click each inserted picture > View Alt Text. Confirm or edit Claude\'s suggested alt text.',
                'Left-align all body text (never justify).',
                'Bold only used for headings and difficult words. Remove decorative bolding.',
                'Set table borders to none if Claude did not (Table Design > Borders > No Border) so the layout is invisible to sighted readers.',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Plain Language': [
                'Apply heading styles in order (Heading 1 for the title, Heading 2 for sections, Heading 3 for sub-sections). Do not skip levels.',
                'Left-align all text (never justify).',
                'Use a sans-serif font (Calibri, Arial or similar).',
                'Set line spacing to 1.5 on body text.',
                'Keep line length under 70 characters wide (adjust margins or column width).',
                'Confirm the reading level estimate Claude returned is year 7 to 8 or lower.',
                'Set page margins to at least 2.5cm on every side.',
                'Set document properties (File > Info > Properties): title, language English (Australia), author, 3-5 keywords.',
                'Add alt text to any images (right-click image > View Alt Text).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
                'When exporting PDF, tick "Document structure tags for accessibility" in the Save dialog.',
              ],
              'Social Story / Visual Narrative': [
                'Insert real photos in chronological order matching the build prompt sections (Before, When I get there, Inside, If I need help, When I leave).',
                'Add alt text to each photo in first-person voice ("I will see the automatic glass doors", not just "automatic glass doors").',
                'Place each caption directly under its photo, not in a separate list at the end.',
                'Remove any table of contents Claude may have added. A social story is linear, a TOC breaks the journey.',
                'Confirm reading order is strictly chronological top to bottom.',
                'Set body text to 14pt minimum.',
                'Set line spacing to 1.5.',
                'Set page margins to 2.5cm or wider.',
                'Set document properties (title, language English (Australia), author).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
              ],
              'Accessibility Guide': [
                'Confirm the 7 standard headings appear in order: Getting there, Getting in, Getting around, Toilets, Sensory environment, Support, Contact.',
                'Each section is a Heading 2 under one Heading 1.',
                'Insert venue photos and add alt text to each (right-click > View Alt Text).',
                'Confirm every fact is specific, not vague (e.g. "level entry, 90cm wide door" not "wheelchair accessible").',
                'Address any "needs answer" flags Claude left in the draft.',
                'Add a publishing date and a contact for access questions.',
                'If publishing as a webpage: add anchor link IDs to each H2 (e.g. id="getting-in") and a jump menu at the top.',
                'Set document properties (title, language English (Australia), author, keywords).',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix any errors.',
                'When exporting PDF, tick "Document structure tags for accessibility" in the Save dialog.',
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
                'Confirm any PDF version keeps text selectable and re-flowable (never flat-scan).',
                'When exporting PDF, tick "Document structure tags for accessibility" in the Save dialog.',
              ],
              'Accessible Digital Document (Word/PDF)': [
                'Apply heading styles in order (H1, H2, H3 etc.), do not skip levels.',
                'Replace manual dashes or asterisks with proper bulleted or numbered lists.',
                'Add alt text to every image (right-click image > View Alt Text). Use Claude\'s suggested alt text as a starting point.',
                'Mark decorative images as decorative (right-click image > View Alt Text > tick "Mark as decorative").',
                'Rewrite any "click here" or "read more" links to be descriptive out of context.',
                'For each data table: mark the header row, add a caption above, flag any merged cells.',
                'Set document properties (File > Info > Properties): title (different from filename), language English (Australia), author, 3-5 keywords.',
                'Save and run Word\'s Accessibility Checker (Review > Check Accessibility). Fix every error.',
                'When exporting PDF, tick "Document structure tags for accessibility" in the Save dialog.',
                'If using Adobe Acrobat Pro after export: run Tools > Prepare for Accessibility > Accessibility Check.',
              ],
            },
          },
        },
        {
          type: 'checklist',
          checklist: {
            title: 'Step 6: Final human review checklist (3 min)',
            items: [
              'Is everything factually correct about your business and venue?',
              'Have you tested it with at least one person from the target audience? (If not, plan to before publishing.)',
              'Have any photos or images been described accurately?',
              'For Easy Read or Visual Communication: have you sourced images or symbols?',
              'For Accessibility Guides: has someone walked the route and verified the details?',
              'Have you removed any AI-added claims that you cannot verify?',
              'Have you added the publishing date and a way for readers to give feedback?',
            ],
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
<li>Where the content is high-stakes (NDIS plans, health information, legal terms, behaviour support, crisis content): commission a specialist producer for your chosen format. Every format has a producer ecosystem in Australia.
<details class="setup-detail">
<summary>Australian producer suggestions by format</summary>
<ul>
<li><strong>Easy Read</strong>: Inclusion Australia, Scope, AT Assist, Down Syndrome Australia, Council for Intellectual Disability</li>
<li><strong>Plain Language</strong>: Plain English Foundation</li>
<li><strong>Social Story or autistic-audience content</strong>: Amaze (Vic), Autism Awareness Australia, Aspect (NSW)</li>
<li><strong>Accessibility Guide</strong>: an accredited access consultant via the Association of Consultants in Access Australia (ACAA)</li>
<li><strong>Large Print</strong>: Vision Australia</li>
<li><strong>Accessible Digital Document (Word/PDF)</strong>: any of the above for content-level work; for technical accessibility (PDF tagging, PDF/UA conformance), an accredited document accessibility specialist</li>
</ul>
</details>
</li>
</ol>
<p>This course does not replace lived-experience review or co-design. We know not every business has the resourcing to commission a specialist or run a co-design session. Where you do, use it. Where you do not, at minimum get one or two readers from your target audience to react to the draft before publishing.</p>`,
        },
        {
          type: 'text',
          heading: 'Step 7: Grab your prompt pack (2 min)',
          body: `<p>Scroll to the <strong>Take everything home</strong> panel below (marked with the orange TAKE HOME pill). The <strong>Download prompt pack</strong> buttons there bundle your full session into a single file, in either PDF or text. Inside you will find:</p>
<ol>
<li>The <strong>AI assistant system prompt</strong> (so you can re-start ChatGPT later)</li>
<li>The <strong>Claude reviewer prompt</strong></li>
<li>The <strong>briefing prompt</strong>, with your business details already filled in</li>
<li>All six <strong>build prompts</strong> (Easy Read, Plain Language, Social Story, Accessibility Guide, Large Print, Accessible Digital Document)</li>
<li>The <strong>Claude markup plan prompt</strong> for tagged Word and PDF output</li>
</ol>
<p>Next time you make a piece of accessible content, open the text file and paste the prompts back into ChatGPT and Claude. Coming back will take half the time.</p>
<p><strong>Your work belongs to you.</strong> Anything you have created in this session, including the draft and the prompts you save, is yours. Access Compass does not claim any rights to your content.</p>`,
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
            title: 'Save 4 of 4: the full kit for next time',
            introHtml: `<p><strong>This save: everything consolidated.</strong> Brief plus the full prompt pack, with your brief already substituted into the briefing prompt, plus every build prompt for all 6 formats so you can switch formats next time.</p>
<p>If you grabbed Saves 1, 2 and 3, you have most of this already. This one is the consolidated version: one file instead of three, with extras (build prompts for all 6 formats, not just the one you used today). Use this when you start a new piece of content.</p>`,
            includeBrief: true,
            browseAllLink: {
              label: 'Browse all Course Materials',
              description: 'Need other files? The Course Materials section at the top of this course has every prompt and the human review checklist as standalone PDF or text downloads, plus a Download all button for the whole set.',
              href: '/training/course/ai-accessible-comms',
            },
            promptPack: {
              label: 'Full session prompt pack',
              filename: 'accessible-comms-prompt-pack',
              headerNote: 'This pack reproduces your workshop session. Paste each prompt into the right tool when you start a new piece of content. The briefing prompt has your brief substituted in. Build prompts are listed for all 6 formats so you can switch formats next time.',
              sections: [
                {
                  heading: 'AI Assistant System Prompt (paste into ChatGPT / drafting tool)',
                  content: `ROLE & PURPOSE
You are my Accessible Communications Assistant.

Your job is to help me convert standard business content into accessible and inclusive formats including Easy Read, Plain Language, Social Stories, Accessibility Guides, Accessible Word documents and Large Print layouts.

You will help by asking clarifying questions before drafting, producing draft content in the requested format, explaining your formatting choices when asked, suggesting how to test the draft with the audience and flagging anything that needs a human reviewer.

FORMATTING RULES
- Use clear headings, short paragraphs and bullet points
- Avoid walls of text
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.

WHAT TO DO IN ANY NEW TASK
Your first reply must include a one or two sentence summary of what you understand the task to be, 3 to 5 clarifying questions if needed to fill any gaps, and an explanation of any assumptions you would have to make if I cannot answer those questions.`,
                },
                {
                  heading: 'Claude Reviewer Prompt (paste into Claude)',
                  content: `You are my Accessible Communications Reviewer.

Your role is to audit drafts for clarity, accessibility and inclusion.

When I paste a draft, evaluate it on plain language (estimated reading level, sentence length, jargon), structure (logical flow, heading hierarchy, white space), inclusion (person-first or identity-first language, stereotypes, missing audience considerations), accuracy risk (invented or assumed statements, internal contradictions) and format fidelity.

For each draft, reply with a one-sentence diagnosis, the top 3 to 5 issues in priority order, suggested re-wordings for the top 2 or 3, anything that must be checked by a human reviewer, and one or two questions that would strengthen the next iteration. Be direct.`,
                },
                {
                  heading: 'Briefing Prompt (paste into ChatGPT before drafting)',
                  content: `I want to create a [FORMAT NAME] for [AUDIENCE].

This will be used by [WHO USES IT] to [PURPOSE].

It will live [WHERE IT WILL BE PUBLISHED].

Here is my source material:
[paste text, link or notes here]

Here are the most important things to get right:
[e.g., must mention wheelchair access, must use our cafe's friendly tone, must be under 500 words]

Before drafting:
1. Confirm in 2 to 3 sentences what you understand.
2. Ask me 3 to 5 clarifying questions to fill any gaps.
3. List any assumptions you would have to make if I cannot answer.`,
                },
                {
                  heading: 'Build Prompt: Easy Read',
                  content: `Please draft this in Easy Read format following Inclusion Australia and CID guidelines. One main idea per line. Sentences under 15 words. Common words (year 6 reading level or below). No metaphors or idioms. Bullet points for lists. Short sections with clear headings. For each section, suggest an image that would support the meaning. Address the reader as "you".

After the draft, list any words that may still be too hard, sections that would benefit from an example, and anything I should verify with a human reviewer.`,
                },
                {
                  heading: 'Build Prompt: Plain Language',
                  content: `Please draft this in Plain Language following the Australian Government Style Manual. Year 7 to 8 reading level. Sentences under 20 words on average. Active voice. Common words. Short paragraphs (3 sentences or fewer). Clear headings. Bullet points for lists. Address the reader as "you" where appropriate.

After the draft, give an estimate of the reading level, a list of words to consider replacing, and one sentence on what the reader should walk away knowing.`,
                },
                {
                  heading: 'Build Prompt: Social Story / Visual Narrative',
                  content: `Please draft this as a Social Story / Visual Narrative. Written in first person. Descriptive and reassuring, not instructional. Walk the reader through the experience in the order it happens. Note sensory details. Mention what staff or other people might do. Acknowledge that things can change.

Structure: 1. Before I arrive. 2. When I get there. 3. What I will see and do inside. 4. If I need help. 5. When I leave.

Suggest where photos should sit and list anything I should verify or add from a real walk-through.`,
                },
                {
                  heading: 'Build Prompt: Accessibility Guide',
                  content: `Please draft an Accessibility Guide for my venue or event under these headings: 1. Getting there. 2. Getting in. 3. Getting around. 4. Toilets. 5. Sensory environment. 6. Support available. 7. Contact.

Plain Language throughout. Specific, not vague. If I have not provided info for a section, flag it as "needs answer". Use bullet points for facts, prose for context. After the draft, list every "needs answer" item, photos I should take, and anything that would benefit from human verification.`,
                },
                {
                  heading: 'Build Prompt: Large Print',
                  content: `I have content I want to provide in Large Print. Confirm the content is appropriate for Large Print (short, high-priority information). Suggest text edits to make it scannable (shorter sentences, clearer headings, removing decorative content). Give me the Large Print formatting checklist (minimum font size, font family, line spacing, contrast, paper colour, margins) following Vision Australia clear print guidance.

Here is the content:
[paste content]`,
                },
                {
                  heading: 'Build Prompt: Accessible Digital Document (Word/PDF)',
                  content: `I have a digital document I want to make accessible. I want to publish it as an accessible Word document and export a tagged PDF version.

Following NSW Digital Toolkit and Vic Government accessibility standards, WCAG 2.2 AA:

1. STRUCTURE: heading hierarchy (H1, H2, H3, no skipped levels), logical reading order, proper bulleted or numbered lists.
2. PLAIN LANGUAGE: estimate reading level, flag jargon, rewrite the top 5 hardest sentences.
3. IMAGES: suggest alt text for every image. Mark decorative images. Flag colour-only meaning.
4. LINKS: rewrite "click here", "read more" to be descriptive. Suggest footnote URLs for printed copies.
5. TABLES: mark header row. Flag merged or split cells. Add captions.
6. DOCUMENT PROPERTIES: suggest a document title, language (English Australia), author, 3 to 5 keywords.
7. EXPORT: save with structure tags enabled. Note if an HTML equivalent should also exist.

After your analysis, give a numbered checklist to apply in Word, a list of items to verify, and a footer paragraph noting WCAG 2.2 AA conformance.

Here is the content:
[paste content]`,
                },
                {
                  heading: 'Claude Markup Plan Prompt (paste into Claude with your reviewed draft)',
                  content: `I have a reviewed draft I want to publish as an accessible Word document and export as a tagged PDF.

Please produce a structured version with the accessibility scaffolding marked up, following NSW Digital Toolkit and Vic Government accessibility standards, WCAG 2.2 AA.

1. STRUCTURE: mark each line or section with its heading level. Logical reading order. Proper lists.
2. IMAGES: alt text per image. Mark decorative. Flag colour-only meaning.
3. LINKS: rewrite vague link text.
4. TABLES: mark header rows. Flag merged cells. Add captions.
5. DOCUMENT PROPERTIES: title, language, author, keywords.
6. EXPORT NOTES: structure tags enabled, HTML equivalent recommended.

After the marked-up draft, give a numbered Word-application checklist, a list of items to verify, and a footer paragraph about WCAG 2.2 AA conformance and alternative-format requests.

Here is my reviewed draft:
[paste reviewed draft]`,
                },
                {
                  heading: 'Reset Prompt (paste if the AI drifts off track)',
                  content: `Please restart this task and follow the briefing prompt exactly. Confirm what you understand in 2 to 3 sentences, then ask 3 to 5 clarifying questions, then list any assumptions you would have to make.`,
                },
              ],
            },
          },
        },
      ],
    },
  ],
};
