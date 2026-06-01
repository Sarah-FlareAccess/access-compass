// Browser-driven walkthrough of the Accessible Comms Workshop.
// Run with: node scripts/ux-flow-test.mjs
// Reports observations to stdout. Saves screenshots to scripts/ux-flow-screenshots/.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SHOTS_DIR = path.join(__dirname, 'ux-flow-screenshots');
fs.mkdirSync(SHOTS_DIR, { recursive: true });

const BASE_URL = process.env.BASE_URL || 'http://localhost:5174';

const findings = [];
function report(label, ok, detail = '') {
  const symbol = ok ? '[PASS]' : '[FAIL]';
  const line = `${symbol} ${label}${detail ? '  ::  ' + detail : ''}`;
  console.log(line);
  findings.push({ label, ok, detail });
}

async function shot(page, name) {
  await page.screenshot({ path: path.join(SHOTS_DIR, `${name}.png`), fullPage: true });
}

// If the app's tab-conflict overlay shows up, fail hard rather than
// clicking through. The protection is deliberate (prevents two tabs from
// corrupting each other's localStorage). To run this test, close every
// other Access Compass tab first.
async function gotoAndCheck(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle').catch(() => {});
  const blocked = await page.locator('.tab-blocked-btn-primary').count();
  if (blocked > 0) {
    throw new Error('TAB_BLOCKED: another Access Compass tab is open. Close it and re-run.');
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  page.on('pageerror', (err) => report(`Uncaught page error: ${err.message}`, false));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      report(`Console error: ${msg.text().slice(0, 200)}`, false);
    }
  });

  // =========================================================================
  // 1. COURSE DETAIL PAGE
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms`);
    await shot(page, '01-course-detail');

    const title = await page.locator('h1.course-title').first().textContent();
    report(
      'Course title is the full workshop name',
      title?.includes('Using AI to Create Accessible'),
      `actual: "${title?.trim().slice(0, 80)}"`
    );

    const materialsHeading = await page.locator('text="Course Materials"').count();
    report('Course Materials section is present', materialsHeading > 0);

    const downloadAllBtn = await page.locator('button.course-download-all-btn').count();
    report('Download all (.zip) button exists', downloadAllBtn === 1);

    const downloadBlocks = await page.locator('.download-block').count();
    report('Eight download entries (PDF+TXT for each of 4 docs)', downloadBlocks === 8, `found ${downloadBlocks}`);

    // Heading hierarchy on course detail
    const h1Count = await page.locator('h1').count();
    const h2Count = await page.locator('h2').count();
    report('Single H1 on course detail page', h1Count === 1, `H1: ${h1Count}`);
    report('At least 3 H2 sections (outcomes, prereqs, materials, lessons)', h2Count >= 3, `H2: ${h2Count}`);

    // Lesson list
    const lessonCards = await page.locator('.course-lessons-list li').count();
    report('4 lesson cards visible', lessonCards === 4, `found ${lessonCards}`);
  } catch (e) {
    report('Course detail page load', false, e.message);
  }

  // =========================================================================
  // 2. LESSON 1: Get Set Up (free preview, should be accessible without login)
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-1-get-set-up`);
    await shot(page, '02-lesson-1');

    // Course progress tracker should show 4 segments per lesson (no real
    // progress yet, so 0/N each)
    const trackerSegments = await page.locator('.course-progress-segment').count();
    report('Progress tracker shows 4 lesson segments', trackerSegments === 4, `found ${trackerSegments}`);

    // Heading hierarchy
    const lessonH1 = await page.locator('h1.lesson-title').textContent();
    report('Lesson 1 H1 set', !!lessonH1?.includes('Get Set Up'), `actual: "${lessonH1}"`);

    const stepCards = await page.locator('.lesson-step-card').count();
    report('Lesson 1 has 4 step cards', stepCards === 4, `found ${stepCards}`);

    // Setup detail collapsibles in step 2
    const setupDetails = await page.locator('details.setup-detail').count();
    report('Lesson 1 Step 2 shows the per-tool collapsibles', setupDetails >= 4, `found ${setupDetails}`);

    // Skip link is in the DOM
    const skipLink = await page.locator('.lesson-skip-link').count();
    report('Skip-to-lesson-content link present', skipLink === 1);

    // Notes panel trigger
    const notesTrigger = await page.locator('.lesson-notes-trigger').count();
    report('Notes panel trigger visible', notesTrigger === 1);
  } catch (e) {
    report('Lesson 1 page load', false, e.message);
  }

  // =========================================================================
  // 3. LESSON 2: brief picker - the workhorse interaction
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-2-choose-format-and-brief`);
    await shot(page, '03-lesson-2-before-brief');

    const formatChoiceBlock = await page.locator('.format-choice-block').count();
    report('Brief picker fieldset is present', formatChoiceBlock === 1);

    const formatOptions = await page.locator('.format-choice-option input[type="radio"]').count();
    report('Six format radio options', formatOptions === 6, `found ${formatOptions}`);

    const contextFields = await page.locator('.format-choice-audience').count();
    report('Audience + three context inputs (4 total)', contextFields === 4, `found ${contextFields}`);

    // Pick Social Story
    await page.locator('label.format-choice-option', { hasText: 'Social Story / Visual Narrative' }).click();
    await page.locator('#format-choice-audience-course-ai-accessible-comms').fill('parents at our museum');
    await page.locator('#format-choice-who-uses-it-course-ai-accessible-comms').fill('parents');
    await page.locator('#format-choice-purpose-course-ai-accessible-comms').fill('prepare for the visit');
    await page.locator('#format-choice-where-it-will-be-published-course-ai-accessible-comms').fill('our website FAQ');
    await page.waitForTimeout(300); // let state settle

    const briefSummary = await page.locator('.format-choice-summary').textContent();
    report('Brief summary shows after fill', !!briefSummary?.includes('saved'));

    // Verify the prompt template substitution in Step 3
    const briefingPromptContent = await page.locator('pre.exercise-prompt-template').first().textContent();
    report(
      'Briefing prompt substitutes [FORMAT NAME] with chosen format',
      !!briefingPromptContent?.includes('Social Story / Visual Narrative') && !briefingPromptContent?.includes('[FORMAT NAME]'),
      `prompt starts: "${briefingPromptContent?.slice(0, 80)}"`
    );
    report(
      'Briefing prompt substitutes [AUDIENCE]',
      !!briefingPromptContent?.includes('parents at our museum') && !briefingPromptContent?.includes('[AUDIENCE]')
    );

    await shot(page, '04-lesson-2-after-brief');

    // Heads-up callout exists
    const headsUp = await page.locator('.heads-up-note').count();
    report('Heads-up note rendered', headsUp >= 1);

    // Path cards: free should be teal, pro green
    const freeCard = await page.locator('.path-card-free').count();
    const proCard = await page.locator('.path-card-pro').count();
    report('Free tier path card present', freeCard === 1);
    report('Plus/Pro tier path card present', proCard === 1);

    // Upload warning is collapsed by default
    const uploadDetails = await page.locator('details.upload-warning-details').count();
    report('Upload warning is in a details (collapsed by default)', uploadDetails === 1);
  } catch (e) {
    report('Lesson 2 brief interaction', false, e.message);
  }

  // =========================================================================
  // 4. LESSON 3: build prompt collapses to chosen format
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-3-build-your-draft`);
    await shot(page, '05-lesson-3');

    // Should be 5 collapsed build-prompt-detail elements (the non-matching ones)
    const collapsedBuildPrompts = await page.locator('details.build-prompt-detail').count();
    report(
      'Five of six build prompts collapsed (matching format expanded)',
      collapsedBuildPrompts === 5,
      `found ${collapsedBuildPrompts}`
    );

    // The expanded one should be Social Story
    const expandedExerciseTitle = await page.locator('.lesson-step-card-body .exercise-block h3.exercise-title').first().textContent();
    report(
      'Expanded build prompt is Social Story / Visual Narrative',
      !!expandedExerciseTitle?.includes('Social Story'),
      `actual: "${expandedExerciseTitle}"`
    );
  } catch (e) {
    report('Lesson 3 build prompt filter', false, e.message);
  }

  // =========================================================================
  // 5. LESSON 4: take-home panel + checklist + sense-check substitution
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-4-sense-check-and-save`);
    await shot(page, '06-lesson-4');

    // Sense-check prompt template should be substituted
    const senseCheckText = await page.locator('pre.exercise-prompt-template').first().textContent();
    report(
      'Sense-check prompt substitutes brief values',
      !!senseCheckText?.includes('Social Story / Visual Narrative') && !!senseCheckText?.includes('parents at our museum')
    );

    // Step 5 interactive checklist
    const checklistCheckboxes = await page.locator('.lesson-checklist-item input[type="checkbox"]').count();
    report('Step 5 checklist has interactive checkboxes', checklistCheckboxes >= 7);

    // Tick the first item, verify the counter updates
    const initialCount = (await page.locator('.lesson-checklist-count').textContent())?.trim();
    await page.locator('.lesson-checklist-item input[type="checkbox"]').first().check();
    await page.waitForTimeout(150);
    const newCount = (await page.locator('.lesson-checklist-count').textContent())?.trim();
    report(
      'Ticking a checklist item updates the counter',
      initialCount !== newCount,
      `${initialCount} -> ${newCount}`
    );

    // Take-home panel renders outside the step card
    const takeHomePanel = await page.locator('.take-home-panel').count();
    report('Take-home panel rendered', takeHomePanel === 1);

    // Take-home shows the user's brief summary
    const takeHomeSummary = await page.locator('.take-home-action-summary').first().textContent();
    report(
      'Take-home brief section shows chosen format + audience',
      !!takeHomeSummary?.includes('Social Story / Visual Narrative') && !!takeHomeSummary?.includes('parents at our museum')
    );

    // Browse all link to Course Materials
    const browseAllLink = await page.locator('.take-home-browse-all-link').count();
    report('Browse all Course Materials link present', browseAllLink === 1);
  } catch (e) {
    report('Lesson 4 interactions', false, e.message);
  }

  // =========================================================================
  // 6. NOTES PANEL flow
  // =========================================================================
  try {
    await page.locator('.lesson-notes-trigger').click();
    await page.waitForTimeout(200);
    await shot(page, '07-notes-panel');

    const textareaVisible = await page.locator('.lesson-notes-textarea').isVisible();
    report('Notes panel opens on trigger click', textareaVisible);

    // Focus should be on close button after open
    const focused = await page.evaluate(() => document.activeElement?.className);
    report(
      'Focus moves into the notes panel on open',
      focused?.includes('lesson-notes-close'),
      `active: "${focused}"`
    );

    // Type something
    await page.locator('.lesson-notes-textarea').fill('test note from playwright');
    await page.waitForTimeout(200);

    // Press Escape, panel should close
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    const panelGone = await page.locator('.lesson-notes-panel').count();
    report('Escape closes the notes panel', panelGone === 0);

    // Reopen, verify persisted note
    await page.locator('.lesson-notes-trigger').click();
    await page.waitForTimeout(200);
    const persistedValue = await page.locator('.lesson-notes-textarea').inputValue();
    report(
      'Notes persist after close + reopen',
      persistedValue === 'test note from playwright',
      `value: "${persistedValue}"`
    );
  } catch (e) {
    report('Notes panel interaction', false, e.message);
  }

  // =========================================================================
  // 7. STEP PROGRESS, AUTO-COMPLETE BEHAVIOUR
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-1-get-set-up`);

    // Mark all 4 step buttons done
    const stepButtons = await page.locator('.lesson-step-complete-btn').all();
    report('Lesson 1 has 4 Mark Step done buttons', stepButtons.length === 4, `found ${stepButtons.length}`);
    for (const btn of stepButtons) await btn.click();
    await page.waitForTimeout(400);

    // Lesson 1 should now be auto-marked complete
    const lessonCompletedBadge = await page.locator('.lesson-completed-badge').count();
    report('Auto-complete kicks in after marking every step', lessonCompletedBadge === 1);

    // Progress tracker shows L1 as done
    const l1DoneSegment = await page.locator('.course-progress-segment.is-done').count();
    report('Progress tracker reflects L1 done', l1DoneSegment >= 1, `found ${l1DoneSegment} done`);

    await shot(page, '08-lesson-1-after-all-steps-done');
  } catch (e) {
    report('Step progress + auto-complete', false, e.message);
  }

  // =========================================================================
  // 8. ACCESSIBILITY SMOKE
  // =========================================================================
  try {
    await gotoAndCheck(page, `${BASE_URL}/training/course/ai-accessible-comms/lesson/lesson-2-choose-format-and-brief`);

    // Tab once - should land on skip link
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.className);
    report(
      'First Tab focuses the skip link',
      focusedTag?.includes('lesson-skip-link'),
      `active: "${focusedTag}"`
    );

    // Activate skip link, focus should jump to lesson content
    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);
    const afterSkip = await page.evaluate(() => document.activeElement?.id);
    report(
      'Skip link jumps focus to #lesson-content',
      afterSkip === 'lesson-content',
      `active id: "${afterSkip}"`
    );
  } catch (e) {
    report('Keyboard skip link', false, e.message);
  }

  // =========================================================================
  // CLEANUP + SUMMARY
  // =========================================================================
  await browser.close();

  const passes = findings.filter((f) => f.ok).length;
  const fails = findings.filter((f) => !f.ok).length;
  console.log('\n' + '='.repeat(60));
  console.log(`SUMMARY: ${passes} pass, ${fails} fail`);
  console.log('='.repeat(60));
  if (fails > 0) {
    console.log('\nFailures:');
    for (const f of findings.filter((x) => !x.ok)) {
      console.log(`  - ${f.label}${f.detail ? ' :: ' + f.detail : ''}`);
    }
    process.exit(1);
  }
})();
