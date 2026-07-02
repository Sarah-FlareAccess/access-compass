// Regression guard: every possible answer to every module question must be
// captured by the shared summary logic (generateModuleSummary), so nothing is
// silently dropped from the report or the DIAP.
//
// It mirrors categorizeResponseSentiment's classification and runs it over
// EVERY question x possible-answer in the question export. Exits non-zero if any
// combination would be dropped. Keep the logic below in sync with
// src/utils/generateModuleSummary.ts (see the INVARIANT note there).
//
// Regenerate exports/all-modules-questions.csv first if modules changed, then:
//   node scripts/checkDiapCapture.mjs   (or: npm run check:diap-capture)

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV = join(__dirname, '..', 'exports', 'all-modules-questions.csv');

function parseCSV(t) {
  const rows = []; let row = [], f = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ',') { row.push(f); f = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; }
    else f += c;
  }
  if (f.length || row.length) { row.push(f); rows.push(row); }
  return rows;
}

const raw = parseCSV(readFileSync(CSV, 'utf8'));
const h = raw[0]; const I = (n) => h.indexOf(n);
const ti = I('Type'), qi = I('Question ID'), oi = I('Options'), si = I('Option Sentiments');
const pOpts = (s) => !s ? [] : s.split(' / ').map(p => { const x = p.indexOf(': '); return x < 0 ? { id: p.trim(), label: p.trim() } : { id: p.slice(0, x).trim(), label: p.slice(x + 2).trim() }; }).filter(o => o.id);
const pSent = (s) => { const m = {}; if (!s) return m; for (const p of s.split(' / ')) { const x = p.indexOf(': '); if (x > 0) m[p.slice(0, x).trim()] = p.slice(x + 2).trim(); } return m; };

const POS = ['yes', 'consistently', 'confident', 'multiple', 'all', 'excellent', 'good', 'very', 'always', 'easy', 'clear', 'accessible'];
const NEG = ['no', 'none', 'limited', 'poor', 'never', 'difficult', 'hard', 'inaccessible', 'missing', 'lack'];
const NEU = ['sometimes', 'somewhat', 'not sure', 'unsure', 'maybe', 'partially', 'moderate', 'fair', 'average', 'on request', 'only'];
const skipRe = /not.?sure|unsure|^na$|not.?applicable|^none$|^other$/i;
function catSent(ids, opts) {
  const sel = ids.map(id => opts.find(o => o.id === id)).filter(Boolean);
  if (sel.some(o => o.sentiment)) {
    const hp = sel.some(o => o.sentiment === 'positive'), hn = sel.some(o => o.sentiment === 'negative'), hu = sel.some(o => o.sentiment === 'neutral');
    if (hu) return 'neutral'; if (hn) return 'negative';
    if (hp) { const allP = opts.filter(o => o.sentiment === 'positive'); const selP = new Set(sel.filter(o => o.sentiment === 'positive').map(o => o.id)); return (allP.length && allP.every(o => selP.has(o.id))) ? 'positive' : 'neutral'; }
  }
  const lab = ids.map(id => (opts.find(o => o.id === id) || {}).label || id).join(' ').toLowerCase();
  if (NEU.some(k => lab.includes(k))) return 'neutral';
  if (NEG.some(k => lab.includes(k))) return 'negative';
  if (POS.some(k => lab.includes(k))) return 'positive';
  if (ids.length === 1 && opts.length) {
    const selOpt = opts.find(o => o.id === ids[0]);
    if (selOpt && skipRe.test(selOpt.id)) return 'neutral';
    const nonSkip = opts.filter(o => !skipRe.test(o.id));
    const idx = nonSkip.findIndex(o => o.id === ids[0]);
    if (idx === 0) return 'positive';
    if (idx >= 0 && idx === nonSkip.length - 1) return 'negative';
    if (idx > 0) return 'neutral';
  }
  return 'neutral';
}
function classify(ans, ids, opts) {
  if (ans === 'yes') return 'doingWell';
  if (ans === 'no' || ans === 'partially') return 'action';
  if (ans === 'unable-to-check') return 'explore';
  if (ids && ids.length) {
    const posOpts = opts.filter(o => o.sentiment === 'positive'); const selSet = new Set(ids);
    if (posOpts.length && posOpts.some(o => selSet.has(o.id)) && posOpts.some(o => !selSet.has(o.id))) return 'action';
    const s = catSent(ids, opts);
    return s || 'DROPPED';
  }
  return 'DROPPED';
}

let tested = 0; const dropped = [];
for (let i = 1; i < raw.length; i++) {
  const r = raw[i]; if (!r || r.length <= ti) continue;
  const type = (r[ti] || '').trim(); const qid = (r[qi] || '').trim(); if (!qid) continue;
  const sent = pSent(r[si] || ''); const opts = pOpts(r[oi] || '').map(o => ({ ...o, sentiment: sent[o.id] }));
  if (type === 'yes-no-unsure') { for (const a of ['yes', 'no', 'partially', 'unable-to-check']) { tested++; if (classify(a, null, opts) === 'DROPPED') dropped.push(`${qid} ans=${a}`); } }
  else if (type === 'single-select') { for (const o of opts) { tested++; if (classify(null, [o.id], opts) === 'DROPPED') dropped.push(`${qid} opt=${o.id}`); } }
  else if (type === 'multi-select') { for (const o of opts) { tested++; if (classify(null, [o.id], opts) === 'DROPPED') dropped.push(`${qid} opt=${o.id}`); } if (opts.length > 1) { tested++; if (classify(null, [opts[0].id, opts[opts.length - 1].id], opts) === 'DROPPED') dropped.push(`${qid} combo`); } }
}

console.log(`DIAP capture check: ${tested} question x answer combinations tested.`);
if (dropped.length) {
  console.error(`FAIL: ${dropped.length} combinations would be DROPPED from the DIAP/report:`);
  dropped.slice(0, 40).forEach(d => console.error('   -', d));
  process.exit(1);
}
console.log('PASS: every response is captured. Nothing is silently dropped.');
