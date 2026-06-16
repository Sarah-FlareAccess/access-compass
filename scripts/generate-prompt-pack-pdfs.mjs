// Generates designed PDF versions of the workshop prompt packs.
// Run with: node scripts/generate-prompt-pack-pdfs.mjs
// Uses jsPDF (already a project dependency).
import { jsPDF } from 'jspdf';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const downloadsDir = path.join(projectRoot, 'public', 'training', 'downloads');
const logoPath = path.join(projectRoot, 'public', 'training', 'branding', 'flare-access-logo.png');
const logoDataUrl = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString('base64')}`
  : null;

// Flare Access brand
const BRAND = {
  amethyst: [73, 14, 103], // #490E67
  amethystLight: [107, 45, 138], // #6b2d8a
  amethystDark: [53, 10, 77], // #350a4d
  sunrise: [255, 144, 21], // #FF9015
  sunriseDark: [204, 119, 0], // #CC7700
  walnut: [62, 43, 47], // #3E2B2F
  ivory: [236, 233, 230], // #ECE9E6
  cream: [250, 248, 245], // #FAF8F5
  bodyText: [28, 20, 16], // #1c1410 (darkened from #2d2420 for punchier prompt-block text on cream bg)
  mutedText: [106, 99, 96], // #6a6360
  promptBg: [248, 247, 246],
  promptBorder: [220, 215, 210],
};

const PAGE = { width: 595.28, height: 841.89 }; // A4 pt
const MARGIN = { left: 56, right: 56, top: 56, bottom: 70 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

// Per-format booklet configs — title, intro and the formatKey we use to
// pull the right build prompt out of the booklet TXT (already pre-built by
// scripts/build-format-booklets.ts).
const formatBooklets = [
  {
    slug: 'prompt-booklet-easy-read',
    title: 'Prompt Booklet: Easy Read',
    intro:
      'Easy Read uses short sentences, common words and image-supported chunks. Best for readers with intellectual disability, low literacy or English as an additional language. This booklet contains every prompt you need for an Easy Read piece in one file.',
  },
  {
    slug: 'prompt-booklet-plain-language',
    title: 'Prompt Booklet: Plain Language',
    intro:
      'Plain Language targets year 7 to 8 reading level, active voice and common words. Best for general public communications, policies, forms and customer-facing content where you want broad comprehension. This booklet contains every prompt you need for a Plain Language piece in one file.',
  },
  {
    slug: 'prompt-booklet-social-story-visual-narrative',
    title: 'Prompt Booklet: Social Story / Visual Narrative',
    intro:
      'Social Stories walk a reader through an experience in first person, with sensory detail, in chronological order. Best for autistic visitors, sensory-sensitive children or anyone who benefits from knowing what to expect. This booklet contains every prompt you need for a Social Story / Visual Narrative piece in one file.',
  },
  {
    slug: 'prompt-booklet-accessibility-guide',
    title: 'Prompt Booklet: Accessibility Guide',
    intro:
      'Accessibility Guides use a fixed 7-section order so readers can compare across venues. Best published as a webpage on your own site with anchor links, kept as a Word or PDF copy for on-request distribution. This booklet contains every prompt you need for an Accessibility Guide in one file.',
  },
  {
    slug: 'prompt-booklet-accessible-word-document',
    title: 'Prompt Booklet: Accessible Word Document',
    intro:
      'Make an existing Word document more accessible AND more inclusive. Covers heading hierarchy, alt text, plain language, link text, table structure, document properties and brand-colour contrast. Best when you are open to suggested copy improvements. If your copy is locked, use the locked-copy override in the build prompt.',
  },
  {
    slug: 'prompt-booklet-large-print',
    title: 'Prompt Booklet: Large Print',
    intro:
      'Reformat short content (menus, programs, flyers, one-page summaries) for low-vision readers, following Vision Australia clear print guidance. The AI confirms fit, suggests scannability improvements where they help at large type sizes, and supplies the typography checklist.',
  },
];

const HOW_TO_USE_BOOKLET = [
  'Run the prompts in order the first time, then reuse the booklet whenever you create a new piece in this format.',
  'Sections 1 and 2 set up your drafting AI (ChatGPT, Copilot, Gemini or similar) and Claude. Section 3 collects your business context. Section 4 generates the first draft.',
  'Section 5 has iteration prompts split into copy iterations (refining new content) and accessibility iterations (refining scaffolding without rewriting copy).',
  'Sections 6 and 7 are Claude\'s sense-check and the accessibility formatting checklist you apply in Word (or your design tool for Large Print).',
  'Section 8 is the reset prompt if the AI drifts off task. Pair this booklet with the standalone Human Review Checklist before publishing.',
];

function bookletSections(slug) {
  const text = readTxt(slug);
  const grab = (start, end) => extractBetween(text, start, end);
  // Section heading is the format-specific build prompt label — find it
  // dynamically since each booklet has a different format name in section 4.
  const buildMatch = text.match(/4\. BUILD PROMPT: ([A-Z /]+)/);
  const buildLabel = buildMatch ? `4. BUILD PROMPT: ${buildMatch[1]}` : '4. BUILD PROMPT';
  return [
    {
      title: '1. AI assistant system prompt',
      intro:
        'Paste into your drafting AI (ChatGPT, Copilot, Gemini or your tool of choice). For tools that support saved instructions, paste it into Custom Instructions or a Project\'s Instructions field. For tools without saved instructions, paste it as the first message in every fresh chat. Sets up the AI with the role, formatting rules and accessibility standards reference it needs.',
      prompt: grab('1. AI ASSISTANT SYSTEM PROMPT', '2. CLAUDE REVIEWER PROMPT'),
    },
    {
      title: '2. Claude reviewer prompt',
      intro:
        'Paste into a fresh Claude chat. Once Claude confirms its role, paste any draft you want sense-checked.',
      prompt: grab('2. CLAUDE REVIEWER PROMPT', '3. BRIEFING PROMPT'),
    },
    {
      title: '3. Briefing prompt',
      intro:
        'Paste into your drafting AI after the system prompt is set up. Fill in the [PLACEHOLDERS] with your format, audience, purpose, where it lives and source material.',
      prompt: grab('3. BRIEFING PROMPT', buildLabel),
    },
    {
      title: buildLabel.replace(/^4\. BUILD PROMPT: /, '4. Build prompt: '),
      intro: 'After the AI has confirmed the brief, paste this to generate the first draft.',
      prompt: grab(buildLabel, '5. ITERATION PROMPTS'),
    },
    {
      title: '5. Iteration prompts',
      intro:
        'Copy iterations refine new content; accessibility iterations refine the scaffolding without rewriting copy. One change per round works better than asking for everything at once.',
      prompt: grab('5. ITERATION PROMPTS', '6. SENSE-CHECK PROMPT'),
    },
    {
      title: '6. Sense-check prompt',
      intro:
        'Paste into Claude with your source material and current draft. Claude returns a structured review across six sections.',
      prompt: grab('6. SENSE-CHECK PROMPT (Lesson 4 Step 1)', '7. ACCESSIBILITY FORMATTING CHECKLIST PROMPT'),
    },
    {
      title: '7. Accessibility formatting checklist prompt',
      intro:
        'Paste into Claude with your reviewed draft at the bottom. Claude returns the draft with accessibility scaffolding marked up plus a numbered application checklist.',
      prompt: grab('7. ACCESSIBILITY FORMATTING CHECKLIST PROMPT (Lesson 4 Step 3)', '8. RESET PROMPT'),
    },
    {
      title: '8. Reset prompt',
      intro: 'If the AI drifts off task, paste this to re-anchor it.',
      prompt: grab('8. RESET PROMPT', 'HUMAN REVIEW BEFORE PUBLISHING'),
    },
  ];
}

// Document configurations — six per-format booklets plus the standalone
// Human Review Checklist.
const docs = [
  ...formatBooklets.map((b) => ({
    slug: b.slug,
    title: b.title,
    subtitle: `From the workshop "Using AI to Create Accessible & Inclusive Communications"`,
    intro: b.intro,
    howToUse: HOW_TO_USE_BOOKLET,
    sections: bookletSections(b.slug),
  })),
  {
    slug: 'human-review-checklist',
    title: 'Human Review Checklist',
    subtitle: 'Before you publish, work through this list · From the workshop "Using AI to Create Accessible & Inclusive Communications"',
    intro:
      'AI drafts well. AI does not walk your venue, verify facts about your business, or speak to your real audience. That work is yours. Use this checklist before every accessible piece you publish. The second half is the publishing checklist for tagged Word and PDF documents.',
    howToUse: [
      'Print or save this checklist alongside each piece of content you draft.',
      'Tick every item before you publish.',
      'If any item cannot be ticked, do not publish yet. Either get the answer or remove the claim.',
    ],
    sections: [
      {
        title: '1. Content review checklist',
        intro:
          'Run through this before every publication. Each item is a quality gate. If any is unticked, the content is not yet ready to publish.',
        prompt: getSection('human-review-checklist', 'review'),
      },
      {
        title: '2. Tagged PDF publishing checklist',
        intro:
          'Use this when the format you are producing is an Accessible Word document or tagged PDF. Step through in Word, then export with structure tags enabled. If you have Adobe Acrobat Pro, run its Accessibility Check after export.',
        prompt: getSection('human-review-checklist', 'publishing'),
      },
      {
        title: '3. Feedback paragraph template',
        intro:
          'Add this to every accessible piece you publish, using a real address that a real person reads. Reader feedback is the strongest signal you have for what to update next.',
        prompt: getSection('human-review-checklist', 'feedback'),
      },
    ],
  },
];

function readTxt(slug) {
  return fs.readFileSync(path.join(downloadsDir, `${slug}.txt`), 'utf-8');
}

function extractBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return text;
  const afterStart = start + startMarker.length;
  const end = endMarker ? text.indexOf(endMarker, afterStart) : -1;
  const chunk = end === -1 ? text.slice(afterStart) : text.slice(afterStart, end);
  // Drop leading/trailing divider lines and trim
  return chunk
    .split('\n')
    .filter((l) => !/^=+$/.test(l.trim()))
    .join('\n')
    .trim();
}

function getSection(slug, key) {
  const text = readTxt(slug);
  if (slug === 'ai-assistant-system-prompt') {
    return extractBetween(text, 'PROMPT', 'END');
  }
  if (slug === 'claude-reviewer-and-markup-prompts') {
    if (key === 'reviewer') {
      return extractBetween(text, '1. REVIEWER PROMPT', '2. MARKUP PLAN PROMPT');
    }
    if (key === 'markup') {
      // Skip the explanatory paragraph by finding the actual prompt start
      const raw = extractBetween(text, '2. MARKUP PLAN PROMPT', 'END');
      const startIdx = raw.indexOf('I have a reviewed draft');
      return startIdx === -1 ? raw : raw.slice(startIdx).trim();
    }
  }
  if (slug === 'human-review-checklist') {
    if (key === 'review') return extractBetween(text, 'CHECKLIST', 'FEEDBACK PARAGRAPH TEMPLATE');
    if (key === 'feedback')
      return extractBetween(text, 'FEEDBACK PARAGRAPH TEMPLATE', 'PUBLISHING CHECKLIST FOR TAGGED PDFs');
    if (key === 'publishing') return extractBetween(text, 'PUBLISHING CHECKLIST FOR TAGGED PDFs', 'END');
  }
  return text;
}

function getFullPackSections() {
  const text = readTxt('ai-accessible-comms-prompt-pack');
  const grab = (start, end) => extractBetween(text, start, end);
  return [
    {
      title: '1. AI assistant system prompt',
      intro:
        'Paste into ChatGPT Custom Instructions or a Project. Sets up the AI with the role, formatting rules and accessibility standards reference it needs.',
      prompt: grab('1. AI ASSISTANT SYSTEM PROMPT', '2. CLAUDE REVIEWER PROMPT'),
    },
    {
      title: '2. Claude reviewer prompt',
      intro: 'Paste into a fresh Claude chat. Claude becomes your reviewer for any draft you paste.',
      prompt: grab('2. CLAUDE REVIEWER PROMPT', '3. BRIEFING PROMPT'),
    },
    {
      title: '3. Briefing prompt',
      intro:
        'Paste into ChatGPT after the system prompt is set up. Fill in the [PLACEHOLDERS] with your format, audience, who uses it, purpose, where it lives, source material and any non-negotiables.',
      prompt: grab('3. BRIEFING PROMPT', '4a. BUILD PROMPT: EASY READ'),
    },
    {
      title: '4a. Build prompt: Easy Read',
      intro: 'For readers with intellectual disability, low literacy or English as an additional language.',
      prompt: grab('4a. BUILD PROMPT: EASY READ', '4b. BUILD PROMPT: PLAIN LANGUAGE'),
    },
    {
      title: '4b. Build prompt: Plain Language',
      intro: 'Year 7 to 8 reading level, active voice, common words. Australian Government Style Manual.',
      prompt: grab('4b. BUILD PROMPT: PLAIN LANGUAGE', '4c. BUILD PROMPT: SOCIAL STORY / VISUAL NARRATIVE'),
    },
    {
      title: '4c. Build prompt: Social Story / Visual Narrative',
      intro: 'First-person walk-through of an experience. Reassuring, descriptive, with sensory detail.',
      prompt: grab('4c. BUILD PROMPT: SOCIAL STORY / VISUAL NARRATIVE', '4d. BUILD PROMPT: ACCESSIBILITY GUIDE'),
    },
    {
      title: '4d. Build prompt: Accessibility Guide',
      intro: 'Structured 7-section guide for a venue, event or service.',
      prompt: grab('4d. BUILD PROMPT: ACCESSIBILITY GUIDE', '4e. BUILD PROMPT: LARGE PRINT'),
    },
    {
      title: '4e. Build prompt: Large Print',
      intro: 'Reformat short content for low-vision readers, following Vision Australia clear print guidance.',
      prompt: grab('4e. BUILD PROMPT: LARGE PRINT', '4f. BUILD PROMPT: ACCESSIBLE DIGITAL DOCUMENT'),
    },
    {
      title: '4f. Build prompt: Accessible Digital Document (Word/PDF)',
      intro: 'Make an existing Word doc or PDF accessible, meeting WCAG 2.2 AA, NSW Digital Toolkit and Vic Government guidance.',
      prompt: grab('4f. BUILD PROMPT: ACCESSIBLE DIGITAL DOCUMENT (WORD/PDF)', '5. ITERATION PROMPTS'),
    },
    {
      title: '5. Iteration prompts',
      intro: 'Six short prompts you reach for between drafts. Pick the one that matches what you want changed and run a single iteration round.',
      prompt: grab('5. ITERATION PROMPTS', '6. RESET PROMPT'),
    },
    {
      title: '6. Reset prompt',
      intro: 'If the AI drifts off task or stops following the briefing, paste this to re-anchor it.',
      prompt: grab('6. RESET PROMPT', '7. CLAUDE MARKUP PLAN PROMPT'),
    },
    {
      title: '7. Claude markup plan prompt',
      intro:
        'Paste into Claude with your reviewed draft at the bottom. Claude returns a structured markup plan: heading levels, alt text, link rewrites, table notes, document properties and a Word-application checklist. You apply that plan in Word, then export with structure tags enabled. Claude does not produce the tagged file directly.',
      prompt: grab('7. CLAUDE MARKUP PLAN PROMPT', '8. HUMAN REVIEW CHECKLIST'),
    },
    {
      title: '8. Human review checklist',
      intro: 'Run before publishing. AI cannot do these for you.',
      prompt: grab('8. HUMAN REVIEW CHECKLIST', 'YOUR WORK BELONGS TO YOU'),
    },
  ];
}

// ---------------------------------------------------------------- rendering
function rgb(arr) {
  return arr;
}

function makeDoc() {
  return new jsPDF({ unit: 'pt', format: 'a4', compress: true });
}

function drawFooter(doc, pageNum) {
  const y = PAGE.height - 30;
  doc.setDrawColor(...BRAND.ivory);
  doc.setLineWidth(0.5);
  doc.line(MARGIN.left, y - 14, PAGE.width - MARGIN.right, y - 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.mutedText);
  doc.text(
    'Flare Access  ·  Using AI to Create Accessible & Inclusive Communications',
    MARGIN.left,
    y
  );
  doc.text(`Page ${pageNum}`, PAGE.width - MARGIN.right, y, { align: 'right' });
}

function ensureSpace(state, neededHeight) {
  if (state.y + neededHeight > PAGE.height - MARGIN.bottom) {
    drawFooter(state.doc, state.page);
    state.doc.addPage();
    state.page += 1;
    state.y = MARGIN.top;
  }
}

function drawCover(doc, doc_config, state) {
  // Amethyst bar at top
  doc.setFillColor(...BRAND.amethyst);
  doc.rect(0, 0, PAGE.width, 8, 'F');
  doc.setFillColor(...BRAND.sunrise);
  doc.rect(0, 8, PAGE.width, 2, 'F');

  // Brand mark: logo if available, otherwise text wordmark
  let logoHeight = 0;
  if (logoDataUrl) {
    const props = doc.getImageProperties(logoDataUrl);
    const targetWidth = 110;
    logoHeight = (props.height / props.width) * targetWidth;
    doc.addImage(logoDataUrl, 'PNG', MARGIN.left, MARGIN.top + 10, targetWidth, logoHeight);
  } else {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.amethyst);
    doc.text('FLARE ACCESS', MARGIN.left, MARGIN.top + 30);
  }

  // Title block - pushed down to clear the logo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.setTextColor(...BRAND.amethyst);
  const titleLines = doc.splitTextToSize(doc_config.title, CONTENT_WIDTH);
  let titleY = MARGIN.top + (logoDataUrl ? Math.max(logoHeight + 60, 200) : 200);
  for (const line of titleLines) {
    doc.text(line, MARGIN.left, titleY);
    titleY += 34;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND.walnut);
  const subLines = doc.splitTextToSize(doc_config.subtitle, CONTENT_WIDTH);
  let subY = titleY + 6;
  for (const line of subLines) {
    doc.text(line, MARGIN.left, subY);
    subY += 18;
  }

  // Sunrise underline accent
  doc.setDrawColor(...BRAND.sunrise);
  doc.setLineWidth(2);
  doc.line(MARGIN.left, subY + 16, MARGIN.left + 80, subY + 16);

  // Date and meta
  const now = new Date();
  const stamp = now.toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.mutedText);
  doc.text(`Generated ${stamp}`, MARGIN.left, PAGE.height - 100);
  doc.text(
    'Your work belongs to you. Flare Access does not claim any rights to content you produce.',
    MARGIN.left,
    PAGE.height - 86,
    { maxWidth: CONTENT_WIDTH }
  );

  drawFooter(doc, state.page);
  doc.addPage();
  state.page += 1;
  state.y = MARGIN.top;
}

function drawHeading(state, text, level = 1) {
  const sizes = { 1: 20, 2: 14, 3: 11 };
  const colors = { 1: BRAND.amethyst, 2: BRAND.amethyst, 3: BRAND.amethystLight };
  const before = { 1: 6, 2: 24, 3: 14 };
  const after = { 1: 12, 2: 10, 3: 6 };
  // Reserve room for at least N body lines (~14pt each) after the heading so
  // we never orphan a heading at the bottom of a page. Level 1 and 2 headings
  // get more lookahead because they introduce a substantial chunk; level 3
  // headings can sit closer to their content.
  const minFollowingLines = { 1: 5, 2: 4, 3: 3 };
  const bodyLineHeight = 14;
  const wrappedLines = state.doc.splitTextToSize(text, CONTENT_WIDTH);
  const headingHeight = before[level] + wrappedLines.length * (sizes[level] + 2) + after[level];
  const followingReserve = minFollowingLines[level] * bodyLineHeight;
  ensureSpace(state, headingHeight + followingReserve);
  state.y += before[level];
  state.doc.setFont('helvetica', 'bold');
  state.doc.setFontSize(sizes[level]);
  state.doc.setTextColor(...colors[level]);
  for (const line of wrappedLines) {
    state.doc.text(line, MARGIN.left, state.y);
    state.y += sizes[level] + 2;
  }
  state.y += after[level];
}

function drawParagraph(state, text, opts = {}) {
  const size = opts.size ?? 10;
  const color = opts.color ?? BRAND.bodyText;
  const fontStyle = opts.italic ? 'italic' : 'normal';
  state.doc.setFont('helvetica', fontStyle);
  state.doc.setFontSize(size);
  state.doc.setTextColor(...color);
  const lineHeight = size + 4;
  const lines = state.doc.splitTextToSize(text, CONTENT_WIDTH);
  for (const line of lines) {
    ensureSpace(state, lineHeight);
    state.doc.text(line, MARGIN.left, state.y);
    state.y += lineHeight;
  }
  state.y += 4;
}

function drawBulletList(state, items, opts = {}) {
  const size = opts.size ?? 10;
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(size);
  state.doc.setTextColor(...BRAND.bodyText);
  const lineHeight = size + 4;
  const bulletIndent = 14;
  for (const item of items) {
    const itemLines = state.doc.splitTextToSize(item, CONTENT_WIDTH - bulletIndent);
    let first = true;
    for (const line of itemLines) {
      ensureSpace(state, lineHeight);
      if (first) {
        state.doc.setFillColor(...BRAND.sunriseDark);
        state.doc.circle(MARGIN.left + 3, state.y - 3, 1.8, 'F');
        first = false;
      }
      state.doc.text(line, MARGIN.left + bulletIndent, state.y);
      state.y += lineHeight;
    }
    state.y += 2;
  }
  state.y += 4;
}

function drawPromptBlock(state, prompt) {
  state.doc.setFont('courier', 'normal');
  state.doc.setFontSize(8.5);
  state.doc.setTextColor(...BRAND.bodyText);

  const promptPadding = 12;
  const innerWidth = CONTENT_WIDTH - promptPadding * 2;
  const lineHeight = 11.5;

  // Pre-split prompt into wrapped lines
  const rawLines = prompt.split('\n');
  const wrappedLines = [];
  for (const raw of rawLines) {
    if (raw.length === 0) {
      wrappedLines.push('');
      continue;
    }
    const wrapped = state.doc.splitTextToSize(raw, innerWidth);
    for (const w of wrapped) wrappedLines.push(w);
  }

  let i = 0;
  while (i < wrappedLines.length) {
    // How many lines fit before bottom?
    const linesAvailable = Math.floor(
      (PAGE.height - MARGIN.bottom - state.y - promptPadding * 2) / lineHeight
    );
    if (linesAvailable <= 4) {
      // Not enough room here - push to next page
      drawFooter(state.doc, state.page);
      state.doc.addPage();
      state.page += 1;
      state.y = MARGIN.top;
      continue;
    }
    const chunkEnd = Math.min(i + linesAvailable, wrappedLines.length);
    const chunkLines = wrappedLines.slice(i, chunkEnd);
    const boxHeight = chunkLines.length * lineHeight + promptPadding * 2;

    // Draw the prompt box background + border
    state.doc.setFillColor(...BRAND.promptBg);
    state.doc.setDrawColor(...BRAND.promptBorder);
    state.doc.setLineWidth(0.5);
    state.doc.roundedRect(MARGIN.left, state.y, CONTENT_WIDTH, boxHeight, 4, 4, 'FD');

    // Left accent bar
    state.doc.setFillColor(...BRAND.amethyst);
    state.doc.rect(MARGIN.left, state.y, 3, boxHeight, 'F');

    // Continued marker if needed
    if (i > 0) {
      state.doc.setFont('helvetica', 'italic');
      state.doc.setFontSize(8);
      state.doc.setTextColor(...BRAND.mutedText);
      state.doc.text('(continued)', PAGE.width - MARGIN.right, state.y - 3, { align: 'right' });
      state.doc.setFont('courier', 'normal');
      state.doc.setFontSize(8.5);
      state.doc.setTextColor(...BRAND.bodyText);
    }

    // Render lines
    let ly = state.y + promptPadding + 8;
    for (const line of chunkLines) {
      state.doc.text(line, MARGIN.left + promptPadding, ly);
      ly += lineHeight;
    }

    state.y += boxHeight + 10;
    i = chunkEnd;

    if (i < wrappedLines.length) {
      // Continue on next page
      drawFooter(state.doc, state.page);
      state.doc.addPage();
      state.page += 1;
      state.y = MARGIN.top;
    }
  }

  state.y += 4;
}

function drawDivider(state) {
  ensureSpace(state, 20);
  state.doc.setDrawColor(...BRAND.ivory);
  state.doc.setLineWidth(0.5);
  state.doc.line(MARGIN.left, state.y, MARGIN.left + 80, state.y);
  state.y += 18;
}

function drawTableOfContents(state, sections) {
  drawHeading(state, 'In this pack', 1);
  state.doc.setFont('helvetica', 'normal');
  state.doc.setFontSize(10.5);
  state.doc.setTextColor(...BRAND.bodyText);
  const lineHeight = 16;
  for (const s of sections) {
    ensureSpace(state, lineHeight);
    state.doc.setTextColor(...BRAND.amethyst);
    state.doc.setFont('helvetica', 'bold');
    state.doc.text(s.title, MARGIN.left, state.y);
    state.y += lineHeight;
  }
  state.y += 8;
}

function buildDoc(doc_config) {
  const doc = makeDoc();
  const state = { doc, page: 1, y: MARGIN.top };

  // Cover
  drawCover(doc, doc_config, state);

  // How to use page
  drawHeading(state, 'How to use this pack', 1);
  drawParagraph(state, doc_config.intro);
  state.y += 4;
  drawHeading(state, 'Quick setup', 3);
  drawBulletList(state, doc_config.howToUse);
  drawDivider(state);

  // Optional table of contents for big pack
  if (doc_config.sections.length > 3) {
    drawTableOfContents(state, doc_config.sections);
    drawDivider(state);
  }

  // Sections
  for (const section of doc_config.sections) {
    // Estimate the height of heading + intro + first ~6 lines of prompt block.
    // If that does not fit in the remaining page space, page-break first so the
    // heading and its content stay together instead of stranding the heading
    // (and an empty paragraph) at the bottom of the previous page.
    const headingHeight = 14 + 24 + 10 + 6; // size + before + after + first-line padding
    const introLines = section.intro
      ? state.doc.splitTextToSize(section.intro, CONTENT_WIDTH).length
      : 0;
    const introHeight = introLines * 14 + (section.intro ? 4 : 0);
    const promptFirstChunkHeight = 6 * 11.5 + 12 * 2; // 6 lines + box padding
    const sectionMinHeight = headingHeight + introHeight + promptFirstChunkHeight;
    if (state.y + sectionMinHeight > PAGE.height - MARGIN.bottom) {
      drawFooter(state.doc, state.page);
      state.doc.addPage();
      state.page += 1;
      state.y = MARGIN.top;
    }
    drawHeading(state, section.title, 2);
    if (section.intro) drawParagraph(state, section.intro);
    drawPromptBlock(state, section.prompt);
  }

  drawFooter(state.doc, state.page);
  return doc;
}

for (const config of docs) {
  const doc = buildDoc(config);
  const pdfPath = path.join(downloadsDir, `${config.slug}.pdf`);
  const buf = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(pdfPath, buf);
  console.log(`Generated ${config.slug}.pdf (${(buf.length / 1024).toFixed(1)} KB)`);
}
