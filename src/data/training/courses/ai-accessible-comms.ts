import type { TrainingCourse } from '../types';

export const aiAccessibleCommsCourse: TrainingCourse = {
  id: 'course-ai-accessible-comms',
  slug: 'ai-accessible-comms',
  title: 'Using AI to Create Accessible & Inclusive Communications',
  subtitle: 'A practical 2-hour workshop. Walk in with content. Walk out with a draft.',
  description: 'Use free AI tools to draft accessible content for your business in under 2 hours. Choose your format, bring your source material and leave with a real first draft you can refine and publish.',
  longDescription: 'This 4-lesson workshop pairs ChatGPT (as your drafting assistant) with Claude (as your reviewer and accessibility markup planner) to produce one piece of accessible content in a single session. You will set up persistent AI instructions, brief the AI on your business and audience, draft your content in your chosen format, sense-check the output against accessibility standards and use Claude to generate an accessibility markup plan you can apply in Word and export as a tagged PDF. The AI does not produce the tagged file directly; it gives you a structured plan (heading levels, alt text suggestions, link rewrites, table notes, document properties) and a checklist of what to apply in Word. Six formats covered: Easy Read, Plain Language, Social Story / Visual Narrative, Accessibility Guide, Large Print and Accessible Digital Document (Word/PDF, following NSW Digital Toolkit and Vic Government guidance, WCAG 2.2 AA). The full prompt pack travels home with you so you can keep going on more content after the session.',
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
      title: 'Accessible Comms Prompt Pack (PDF)',
      description: 'The full workshop in one printable PDF: system prompt, reviewer prompt, briefing template, all 6 build prompts, iteration prompts, reset prompt, markup plan prompt and human review checklist.',
      fileName: 'ai-accessible-comms-prompt-pack.pdf',
      fileUrl: '/training/downloads/ai-accessible-comms-prompt-pack.pdf',
      fileType: 'PDF',
      fileSize: '23 KB',
    },
    {
      title: 'Accessible Comms Prompt Pack (TXT)',
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
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- When I am vague, ask for specifics
- When I am stuck, simplify
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.

ACCESSIBILITY STANDARDS REFERENCE
- Easy Read: Inclusion Australia and CID Easy Read guidelines. Short sentences, common words, one idea per line, supporting images.
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

For each draft I paste, reply with:
1. A one-sentence diagnosis
2. The top 3 to 5 issues to fix, in priority order
3. Suggested re-wordings for the top 2 or 3 issues
4. Anything that must be checked by a human reviewer
5. One or two questions that would strengthen the next iteration

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
            title: 'Take your setup home',
            introHtml: `<p>You have set up an AI assistant in ChatGPT and a reviewer in Claude. The prompts you pasted are saved inside those tools, not inside this app. Download them now so next time you start a new chat you can paste them in without retyping or hunting through this lesson.</p>`,
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
- Always finish any draft with: "This draft was AI-generated. Please review before publishing."

BEHAVIOUR RULES
- Ask clarifying questions when you don't have enough context
- Preserve context from earlier in the conversation
- Default to simplicity over complexity
- When I am vague, ask for specifics
- When I am stuck, simplify
- Never invent facts about my business, venue, audience or accessibility features. If you do not know, ask.

ACCESSIBILITY STANDARDS REFERENCE
- Easy Read: Inclusion Australia and CID Easy Read guidelines. Short sentences, common words, one idea per line, supporting images.
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

For each draft I paste, reply with:
1. A one-sentence diagnosis
2. The top 3 to 5 issues to fix, in priority order
3. Suggested re-wordings for the top 2 or 3 issues
4. Anything that must be checked by a human reviewer
5. One or two questions that would strengthen the next iteration

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
<p><strong>Heads up:</strong> two formats really do need existing source content. Large Print is for reformatting short content you already have. Accessible Digital Document (Word/PDF) is for making an existing document accessible. If you have neither, pick Plain Language, Easy Read, Social Story or Accessibility Guide instead. You can come back to Large Print or Accessible Digital Document once you have a finished draft.</p>
</details>
<div class="path-card">
<div class="path-card-label">Free tier path (Claude free, ChatGPT free, Copilot, Gemini)</div>
<p><strong>Have your source ready in a note app, browser tab or Word doc.</strong> You will copy and paste it directly into the chat in Step 3.</p>
</div>
<div class="path-card">
<div class="path-card-label">Plus or Pro tier path (ChatGPT Plus, Claude Pro)</div>
<p>For long sources (multi-page policies, brand guides, detailed staff manuals), <strong>upload the file to your project's Files area now</strong>. In Step 3, you will reference it with this line:</p>
<pre><code>See the source document I have uploaded to this project.</code></pre>
<div class="upload-warning"><strong>Before you upload:</strong> do not upload anything containing personal information about staff or customers, your business's confidential intellectual property, client data, commercial-in-confidence material, paid research you do not own the rights to or anything covered by an NDA. Use redacted or public-facing versions if you are unsure.</div>
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
          body: `<div class="do-now">
<div class="do-now-label">Do this next</div>
<p>When ChatGPT replies with its clarifying questions, answer them honestly. If you do not know an answer, say so. It is fine to answer in fragments and bullet points.</p>
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
            title: 'Take your brief home',
            introHtml: `<p>Your brief is the slowest part of this workshop to recreate. Grab a copy now so you can reuse it next time without retyping every field. Use Download to save a file to your computer, or Copy to paste it into your own notes app, email or another AI tool.</p>
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
            instructions: 'For Easy Read content following Inclusion Australia and CID guidelines. Copy the prompt below and paste it into your ChatGPT conversation (which already has your business context from Lesson 2).',
            promptTemplate: `Please draft this in Easy Read format following Inclusion Australia and CID guidelines.

Apply these rules:
- One main idea per line
- Sentences under 15 words wherever possible
- Use common words (year 6 reading level or below)
- Avoid metaphors, idioms and figures of speech
- Use bullet points for lists
- Break the draft into short sections with clear headings
- For each section, suggest an image that would support the meaning (describe the image, do not generate it)
- Avoid abbreviations. Spell things out.
- Use the active voice
- Address the reader as "you"

After the draft, list:
- Any words you used that may still be too hard
- Any sections that would benefit from an example
- Anything I should verify with a human reviewer`,
            expectedOutcome: 'A draft in Easy Read format with one idea per line, image suggestions for each section and a list of words or sections that need extra attention.',
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
            title: 'Take your draft home',
            introHtml: `<p>Your draft lives inside your AI chat, not inside this app. If you close the tab without saving, you may lose it. Right now is the time to copy your draft from your AI tool into a Word doc, Google Doc or note app you control, and save it there.</p>
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
          body: `<p>Read Claude's sense-check. Make a short list of the top 1 to 3 changes worth making now. Skip anything that is nice-to-have or needs info you do not have.</p>`,
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
            instructions: 'Switch back to ChatGPT (same conversation as Lesson 3). Paste the message below with the top issues filled in.',
            promptTemplate: `A sense-check has flagged these issues with our latest draft:
1. [issue]
2. [issue]
3. [issue]

Please update the draft to address these. Show the full updated draft.`,
            expectedOutcome: 'ChatGPT returns an updated draft with the issues addressed. Save it.',
          },
        },
        {
          type: 'exercise',
          exercise: {
            title: 'Step 4: Use Claude to build your accessibility markup plan (12 min)',
            instructions: 'Claude does not produce a tagged PDF or accessible Word file directly. What it produces is a structured markup plan: heading levels (H1, H2 etc.), alt text suggestions, link rewrites, table notes, document property suggestions and a numbered checklist of what to apply in Word. You apply that plan in Word and export with structure tags enabled to produce the actual tagged PDF. Claude is stronger than ChatGPT at producing this kind of structured longer output, which is why we use it here. Copy your updated draft from ChatGPT. Switch to your Claude tab (the Reviewer conversation from Lesson 1 is fine to reuse). Paste the prompt below with your reviewed draft at the bottom.',
            promptTemplate: `I have a reviewed draft I want to publish as an accessible Word document and export as a tagged PDF.

Please produce a structured version with the accessibility scaffolding marked up, following NSW Digital Toolkit PDF accessibility guidance and Vic Government make-content-accessible standards, targeting WCAG 2.2 AA.

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
- Mark which row is the header.
- Flag merged or split cells and suggest a flat alternative.
- Add a one-sentence caption above each table.

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
            title: 'Step 5: Final human review checklist (3 min)',
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
          heading: 'Step 6: Grab your prompt pack (2 min)',
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
            title: 'Take everything home',
            introHtml: `<p>You have a brief, a reviewed draft and a set of prompts that worked for your business. Grab them all now so you can pick up the next piece of content without redoing this workshop.</p>
<p>The brief saves your business context. The prompt pack saves every prompt you used (with your brief already substituted into the briefing prompt). Together they are your reusable kit.</p>`,
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
