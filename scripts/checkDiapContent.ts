/**
 * Regression guard for per-question DIAP content
 * (src/data/diapQuestionContent.ts).
 *
 * Fails (exit 1) if:
 *   - any authored entry does not have 2-3 action steps
 *   - any authored entry does not have 2-4 success indicators
 *   - any step or indicator is empty/whitespace
 *   - a module that has ANY authored entry has an answerable deep-dive
 *     question with no entry (a gap within a started module)
 *
 * Run: npm run check:diap-content
 * This is what stops content silently slipping back to 1 step or a module
 * being left partly authored.
 */
import { DIAP_QUESTION_CONTENT } from '../src/data/diapQuestionContent';
import { accessModules, getQuestionsForMode } from '../src/data/accessModules';

const errors: string[] = [];

// 1. Structural checks on every authored entry.
for (const [id, c] of Object.entries(DIAP_QUESTION_CONTENT)) {
  if (!Array.isArray(c.steps) || c.steps.length < 2 || c.steps.length > 3) {
    errors.push(`[${id}] steps must be 2-3, got ${c.steps?.length ?? 0}`);
  }
  if (!Array.isArray(c.indicators) || c.indicators.length < 2 || c.indicators.length > 4) {
    errors.push(`[${id}] indicators must be 2-4, got ${c.indicators?.length ?? 0}`);
  }
  (c.steps || []).forEach((s, i) => { if (!s || !s.trim()) errors.push(`[${id}] step ${i + 1} is empty`); });
  (c.indicators || []).forEach((s, i) => { if (!s || !s.trim()) errors.push(`[${id}] indicator ${i + 1} is empty`); });
}

// 2. Coverage: any module with at least one entry must cover every answerable
//    deep-dive question (skip free-text and upload/analysis questions, which
//    do not generate DIAP action items).
const authoredModules = new Set(Object.keys(DIAP_QUESTION_CONTENT).map(id => id.split('-')[0]));
let authoredModuleCount = 0;
for (const m of accessModules as { code: string }[]) {
  if (!authoredModules.has(m.code)) continue;
  authoredModuleCount++;
  const dd = getQuestionsForMode(m as never, 'deep-dive') as { id: string; text?: string; type?: string; actionText?: { no?: string; partially?: string } }[];
  for (const q of dd) {
    if (!q.text || q.type === 'text') continue;
    if (!q.actionText || (!q.actionText.no && !q.actionText.partially)) continue; // upload/analysis prompt
    if (!DIAP_QUESTION_CONTENT[q.id]) errors.push(`[${m.code}] missing per-question content for ${q.id} ("${q.text.slice(0, 50)}")`);
  }
}

if (errors.length) {
  console.error(`\nDIAP content check FAILED - ${errors.length} issue${errors.length > 1 ? 's' : ''}:`);
  for (const e of errors) console.error('  - ' + e);
  console.error('');
  process.exit(1);
}

const total = Object.keys(DIAP_QUESTION_CONTENT).length;
console.log(`DIAP content check PASSED: ${total} entries across ${authoredModuleCount} modules; all 2-3 steps + 2-4 indicators, no gaps in authored modules.`);
