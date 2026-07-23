// Generates a self-contained SQL seed for Redgum Shire Council's OWN multi-site
// assessment: venues as sites, with realistic council-voice answers across ALL
// assessable question types (yes-no-unsure, single-select, multi-select) so the
// DIAP captures every response and the SDIP outcome pillars are all covered.
// Single/multi-select answers are written to module_responses.multi_select_values
// (a JSON array of option ids), matching how the app stores them, so the shared
// generateModuleSummary grades them into DIAP actions.
//
// Resolves the Redgum org + an admin user + sites by NAME at run time (no
// hard-coded IDs). Idempotent: re-running upserts with ON CONFLICT DO NOTHING.
//
// Usage:  node scripts/generateRedgumSeed.mjs > supabase/seeds/redgum_demo_seed.sql

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV = join(__dirname, '..', 'exports', 'all-modules-questions.csv');

// ---- tiny deterministic PRNG so re-runs are identical -------------------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rnd = mulberry32(20260701);
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];

// ---- minimal RFC-4180 CSV parser ---------------------------------------
function parseCSV(text) {
  const rows = []; let row = []; let field = ''; let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\r') { /* skip */ }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const raw = parseCSV(readFileSync(CSV, 'utf8'));
const header = raw[0];
const col = (name) => header.indexOf(name);
const cCode = col('Module Code');
const cQid = col('Question ID');
const cText = col('Question Text');
const cType = col('Type');
const cImpact = col('Impact Level');
const cCompliance = col('Compliance Level');
const cSafety = col('Safety Related');
const cOptions = col('Options');
const cSentiments = col('Option Sentiments');
const cActNo = col('Action Text (No)');
const cActPart = col('Action Text (Partially)');
const cActUnsure = col('Action Text (Unsure)');

// options string "id: label / id: label" -> [{id,label}]
function parseOptions(s) {
  if (!s) return [];
  return s.split(' / ').map(p => {
    const idx = p.indexOf(': ');
    return idx < 0 ? { id: p.trim(), label: p.trim() } : { id: p.slice(0, idx).trim(), label: p.slice(idx + 2).trim() };
  }).filter(o => o.id);
}
// sentiments string "id: positive / id: negative" -> { id: sentiment }
function parseSentiments(s) {
  const map = {};
  if (!s) return map;
  for (const p of s.split(' / ')) { const idx = p.indexOf(': '); if (idx > 0) map[p.slice(0, idx).trim()] = p.slice(idx + 2).trim(); }
  return map;
}

// grade an option: explicit sentiment first, else keyword on the label
// (mirrors generateModuleSummary.categorizeResponseSentiment ordering).
const NEU = ['sometimes', 'somewhat', 'not sure', 'unsure', 'maybe', 'partially', 'moderate', 'fair', 'average', 'on request', 'only', 'shared', 'some '];
const NEG = ['no ', 'none', 'limited', 'poor', 'never', 'difficult', 'hard', 'inaccessible', 'missing', 'lack', 'not very', 'no clear', 'over a year', 'more than a year', "don't", 'not yet', 'rarely'];
const POS = ['yes', 'consistently', 'confident', 'multiple', 'all ', 'excellent', 'good', 'very', 'always', 'easy', 'clear', 'accessible', 'named', 'within', 'fully', 'comprehensive'];
function grade(opt, sentiments) {
  if (sentiments[opt.id]) return sentiments[opt.id];
  const l = ' ' + opt.label.toLowerCase() + ' ';
  if (NEU.some(k => l.includes(k))) return 'neutral';
  if (NEG.some(k => l.includes(k))) return 'negative';
  if (POS.some(k => l.includes(k))) return 'positive';
  return null;
}
const isSkip = (o) => /not.?sure|unsure|^na$|not.?applicable|none-of|^none$|^other$/i.test(o.id);

// module code -> assessable questions (yes-no-unsure, single-select, multi-select)
const byModule = new Map();
for (let i = 1; i < raw.length; i++) {
  const r = raw[i];
  if (!r || r.length <= cType) continue;
  const type = (r[cType] || '').trim();
  if (type !== 'yes-no-unsure' && type !== 'single-select' && type !== 'multi-select') continue;
  const code = (r[cCode] || '').trim();
  if (!code) continue;
  if (!byModule.has(code)) byModule.set(code, []);
  byModule.get(code).push({
    qid: (r[cQid] || '').trim(),
    text: (r[cText] || '').trim(),
    type,
    impact: (r[cImpact] || '').trim(),
    compliance: (r[cCompliance] || '').trim(),
    safety: (r[cSafety] || '').trim().toLowerCase() === 'yes',
    options: parseOptions(r[cOptions] || ''),
    sentiments: parseSentiments(r[cSentiments] || ''),
    actionNo: (r[cActNo] || '').trim(),
    actionPart: (r[cActPart] || '').trim(),
    actionUnsure: (r[cActUnsure] || '').trim(),
  });
}

// ---- the council's venues and which modules each ran --------------------
// Now spans yes/no AND single/multi-select modules so every SDIP pillar is
// represented: employment (5.7-5.10 -> SDIP-2), service/support (4.x -> SDIP-3),
// safety/policy (4.4, 5.1 -> SDIP-5), events/outdoor/playground (single-select).
const VENUES = [
  { name: 'Central Library', maturity: 'high', modules: ['1.1', '1.2', '2.1', '2.2', '3.1', '3.5', '4.1', '4.2', '4.3', '4.5', '4.4', '5.1', '5.3', '5.4', '5.7'] },
  { name: 'Regional Art Gallery', maturity: 'high', modules: ['1.1', '2.1', '2.2', '3.1', '3.3', '3.5', '4.2', '4.1', '4.4', '4.6', '5.5', '5.7'] },
  { name: 'Visitor Information Centre', maturity: 'med', modules: ['1.1', '1.4', '1.5', '2.1', '4.1', '4.2', '4.4', '4.5', '5.4', '5.7'] },
  { name: 'Aquatic & Leisure Centre', maturity: 'med', modules: ['2.1', '2.2', '2.3', '3.2', '4.2', '4.4', '4.1', '4.5', '5.1', '5.9'] },
  { name: 'Botanic Gardens & Playground', maturity: 'med', modules: ['2.1', '2.3', '3.5', '4.1', '4.4', '4.6', '3.11', '3.12'] },
  { name: 'Winter Markets', maturity: 'low', modules: ['1.1', '2.1', '2.4', '3.5', '4.2', '4.4', '4.7', '6.1', '6.2'] },
  { name: 'Riverbend Summer Festival', maturity: 'low', modules: ['1.1', '1.4', '2.1', '2.4', '3.6', '4.2', '4.7', '4.4', '4.5', '6.1', '6.3', '7.1'] },
  { name: 'Town Hall & Civic Centre', maturity: 'high', modules: ['1.1', '2.1', '2.2', '3.1', '4.2', '5.1', '5.3', '5.5', '4.4', '4.5', '4.6', '5.4', '5.6', '5.7', '5.8', '5.9', '5.10'] },
  // Showcase venue for the public Accessibility Profile: runs every module the
  // profile draws from, answered in full (not just the first questions) and
  // skewed strongly positive, so the shared profile reads rich and welcoming.
  { name: 'Riverside Theatre', maturity: 'showcase', modules: ['1.1', '1.2', '1.3', '2.1', '2.2', '2.3', '2.4', '3.1', '3.2', '3.3', '3.4', '3.6', '3.7', '3.8', '4.1', '4.2', '4.3', '5.1', '5.3', '6.4', '7.2'] },
];

// (venue, module) pairs that get a prior reassessment snapshot (improved since)
const REASSESSED = new Set(['Central Library|3.1', 'Aquatic & Leisure Centre|2.1', 'Winter Markets|2.1']);

const DIST = {
  showcase: { yes: 1, partially: 0, no: 0, 'unable-to-check': 0 },
  high: { yes: 0.68, partially: 0.18, no: 0.08, 'unable-to-check': 0.06 },
  med: { yes: 0.55, partially: 0.22, no: 0.14, 'unable-to-check': 0.09 },
  low: { yes: 0.42, partially: 0.25, no: 0.22, 'unable-to-check': 0.11 },
};
function rollAnswer(maturity) {
  const d = DIST[maturity]; const x = rnd(); let acc = 0;
  for (const a of ['yes', 'partially', 'no', 'unable-to-check']) { acc += d[a]; if (x <= acc) return a; }
  return 'yes';
}
const GRADE_DIST = {
  showcase: { positive: 1, neutral: 0, negative: 0 },
  high: { positive: 0.66, neutral: 0.2, negative: 0.14 },
  med: { positive: 0.5, neutral: 0.27, negative: 0.23 },
  low: { positive: 0.36, neutral: 0.3, negative: 0.34 },
};
function rollGrade(maturity) {
  const d = GRADE_DIST[maturity]; const x = rnd(); let acc = 0;
  for (const g of ['positive', 'neutral', 'negative']) { acc += d[g]; if (x <= acc) return g; }
  return 'positive';
}

const PARTIAL_NOTES = [
  'Ramp at the main entrance but the side entrance still has a single step.',
  'Accessibility information is on the website but scattered across a few pages rather than one place.',
  'Hearing loop installed at the main desk only, not in meeting rooms.',
  'Accessible toilet available but the change table is not adult-sized.',
  'Staff had training in 2023; a refresher is scheduled but not yet booked.',
  'Large-print materials available on request but not routinely offered.',
  'Signage is clear at the entry but wayfinding inside is inconsistent.',
  'Designated accessible parking exists but line-marking has faded.',
];
const UNSURE_NOTES = [
  'Need to confirm current measurements with the facilities team.',
  'Awaiting sign-off from the venue coordinator before we can confirm.',
  'Not sure this has been checked since the last refurbishment.',
];
const YES_NOTES = [
  'Confirmed on site during the March access walk-through.',
  'Verified with the venue coordinator.',
  '', '',
];

function priorityFor(q, answer) {
  if (q.safety) return 'high';
  if ((q.compliance || '').toLowerCase() === 'mandatory') return 'high';
  if ((q.impact || '').toLowerCase() === 'high') return answer === 'no' ? 'high' : 'medium';
  return 'medium';
}
function confidence(answers) {
  const total = answers.length || 1;
  const pos = answers.filter(a => a.grade === 'positive').length;
  const neg = answers.filter(a => a.grade === 'negative').length;
  if ((pos / total) * 100 >= 70) return 'strong';
  if ((neg / total) * 100 >= 50) return 'needs-work';
  return 'mixed';
}
const esc = (s) => String(s).replace(/'/g, "''");
const jsonLit = (o) => `'${esc(JSON.stringify(o))}'::jsonb`;

// Pick an answer for one question, returning a normalised shape:
//  { qid, type, answer, selected[], notes, partial, grade }
function answerQuestion(q, maturity, worse) {
  if (q.type === 'yes-no-unsure') {
    let answer = rollAnswer(maturity);
    if (worse && answer === 'yes' && rnd() < 0.45) answer = pick(['partially', 'no']);
    let notes = null, partial = null;
    if (answer === 'partially') partial = pick(PARTIAL_NOTES);
    else if (answer === 'unable-to-check') notes = pick(UNSURE_NOTES);
    else if (answer === 'yes') { const n = pick(YES_NOTES); notes = n || null; }
    const grade = answer === 'yes' ? 'positive' : answer === 'unable-to-check' ? 'neutral' : 'negative';
    return { qid: q.qid, type: q.type, answer, selected: null, notes, partial, grade };
  }
  if (q.type === 'single-select') {
    if (!q.options.length) return null;
    let target = rollGrade(maturity);
    if (worse && target === 'positive' && rnd() < 0.45) target = pick(['neutral', 'negative']);
    const graded = q.options.map(o => ({ o, g: grade(o, q.sentiments) }));
    let choice = pick(graded.filter(x => x.g === target && !isSkip(x.o)).map(x => x.o));
    if (!choice) choice = pick(q.options.filter(o => !isSkip(o))) || pick(q.options);
    return { qid: q.qid, type: q.type, answer: null, selected: [choice.id], notes: null, partial: null, grade: grade(choice, q.sentiments) };
  }
  // multi-select: select a subset of the positive options by maturity
  if (!q.options.length) return null;
  // Showcase venue: select every real option so the public profile surfaces the
  // full set of features (option ids the Access Profile looks for).
  if (maturity === 'showcase') {
    const chosen = q.options.filter(o => !isSkip(o));
    const sel = chosen.length ? chosen : q.options;
    return { qid: q.qid, type: q.type, answer: null, selected: sel.map(o => o.id), notes: null, partial: null, grade: 'positive' };
  }
  const positives = q.options.filter(o => grade(o, q.sentiments) === 'positive' && !isSkip(o));
  const p = maturity === 'high' ? 0.8 : maturity === 'med' ? 0.55 : 0.35;
  let selected = positives.filter(() => rnd() < p);
  if (selected.length === 0 && positives.length) selected = [pick(positives)];
  if (selected.length === 0) selected = [pick(q.options.filter(o => !isSkip(o)) || q.options)];
  const allPos = positives.length > 0 && positives.every(o => selected.includes(o));
  return { qid: q.qid, type: q.type, answer: null, selected: selected.map(o => o.id), notes: null, partial: null, grade: allPos ? 'positive' : 'neutral' };
}

// A few curated partials for the showcase venue, so the "in some areas" notes
// on the Access Profile read as real, specific detail rather than generic text.
const SHOWCASE_PARTIALS = {
  '2.2-D-23': 'Handrails are on one side of the entrance steps, not both.',
  '3.2-D-8': 'Grab rails are on one side of the accessible toilet.',
  '4.3-D-1': 'Most shows can be booked online; a few still need a quick phone call.',
};

// build one module's answers + summary
function buildModule(code, maturity, worse = false) {
  const qs = (byModule.get(code) || []).slice(0, maturity === 'showcase' ? 200 : 16);
  const answers = qs.map(q => answerQuestion(q, maturity, worse)).filter(Boolean);
  if (maturity === 'showcase') {
    for (const a of answers) {
      const note = SHOWCASE_PARTIALS[a.qid];
      if (note) { a.answer = 'partially'; a.partial = note; a.selected = null; a.grade = 'negative'; }
    }
  }
  const doingWell = answers.filter(a => a.grade === 'positive').slice(0, 3)
    .map(a => qs.find(q => q.qid === a.qid)?.text).filter(Boolean);
  const priorityActions = answers.filter(a => a.grade === 'negative').slice(0, 4).map(a => {
    const q = qs.find(qq => qq.qid === a.qid);
    return {
      questionId: a.qid,
      questionText: q?.text,
      action: q?.actionNo || 'Review and improve this area.',
      priority: priorityFor(q || {}, 'no'),
      timeframe: '30-90 days',
      complianceLevel: q?.compliance || undefined,
      safetyRelated: q?.safety || undefined,
    };
  });
  const areasToExplore = answers.filter(a => a.grade === 'neutral').slice(0, 3)
    .map(a => qs.find(q => q.qid === a.qid)?.text).filter(Boolean);
  const summary = { doingWell, priorityActions, areasToExplore, professionalReview: [] };
  return { answers, summary, confidence: confidence(answers) };
}

// ---- emit SQL -----------------------------------------------------------
const out = [];
out.push('-- Redgum Shire Council: own multi-site demo assessment (generated).');
out.push('-- Safe to run once; ON CONFLICT DO NOTHING makes re-runs no-ops.');
out.push('do $$');
out.push('declare v_org uuid; v_user uuid; v_site uuid;');
out.push('begin');
// Resolve the council org specifically: there can be more than one org whose
// name contains "redgum" (e.g. a separate convention-centre demo org), so match
// the exact council name first and only fall back to a loose match.
out.push("  select id into v_org from organisations where name = 'Redgum Shire Council' order by created_at limit 1;");
out.push("  if v_org is null then select id into v_org from organisations where name ilike '%redgum%shire%' order by created_at limit 1; end if;");
out.push("  if v_org is null then select id into v_org from organisations where name ilike '%redgum%' order by created_at limit 1; end if;");
out.push("  if v_org is null then raise exception 'Redgum council org not found'; end if;");
out.push("  select user_id into v_user from organisation_memberships where organisation_id = v_org and status = 'active' order by created_at limit 1;");
out.push("  update organisations set jurisdiction = 'AU-SA' where id = v_org;");
out.push('');

let dayOffset = 60;
for (const venue of VENUES) {
  const slug = venue.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sess = `seed-redgum-${slug}`;
  out.push(`  -- ===== ${venue.name} =====`);
  out.push(`  insert into sites (organisation_id, name) values (v_org, '${esc(venue.name)}') on conflict (organisation_id, name) do nothing;`);
  out.push(`  select id into v_site from sites where organisation_id = v_org and name = '${esc(venue.name)}';`);
  for (const code of venue.modules) {
    if (!byModule.has(code)) { out.push(`  -- (module ${code} has no assessable questions in export - skipped)`); continue; }
    const started = `now() - interval '${dayOffset} days'`;
    const completed = `now() - interval '${dayOffset - 2} days'`;
    dayOffset = Math.max(6, dayOffset - 1);
    const m = buildModule(code, venue.maturity);
    out.push(`  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)`);
    out.push(`  values ('${sess}','${code}','${code}','completed','${m.confidence}',${jsonLit(m.summary)},${started},${completed},v_org,v_site,v_user,v_user)`);
    out.push(`  on conflict (organisation_id, site_id, module_id) do nothing;`);
    if (m.answers.length) {
      const vals = m.answers.map(a => {
        const ans = a.answer ? `'${esc(a.answer)}'` : 'null';
        const msv = a.selected ? `'${esc(JSON.stringify(a.selected))}'` : 'null';
        const notes = a.notes ? `'${esc(a.notes)}'` : 'null';
        const part = a.partial ? `'${esc(a.partial)}'` : 'null';
        return `('${sess}','${code}','${a.qid}',${ans},${notes},${part},${msv},v_org,v_site,v_user)`;
      }).join(',\n    ');
      out.push(`  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values\n    ${vals}`);
      out.push(`  on conflict (organisation_id, site_id, module_id, question_id) do nothing;`);
    }
    if (REASSESSED.has(`${venue.name}|${code}`)) {
      const prior = buildModule(code, venue.maturity, true);
      const runId = `seed-run-redgum-${slug}-${code}-r1`;
      const responses = prior.answers.map(a => ({
        questionId: a.qid, answer: a.answer || undefined,
        multiSelectValues: a.selected || undefined,
        notes: a.notes || undefined, partialDescription: a.partial || undefined,
        timestamp: '2026-01-15T00:00:00.000Z',
      }));
      const ctx = { type: 'general', name: 'Initial assessment (2026)' };
      out.push(`  insert into module_assessment_snapshots (organisation_id, site_id, module_id, module_code, run_id, context, status, started_at, completed_at, confidence_snapshot, summary, responses, created_by_user_id)`);
      out.push(`  values (v_org,v_site,'${code}','${code}','${runId}',${jsonLit(ctx)},'completed', now() - interval '210 days', now() - interval '208 days','${prior.confidence}',${jsonLit(prior.summary)},${jsonLit(responses)},v_user)`);
      out.push(`  on conflict (run_id) do nothing;`);
    }
  }
  out.push('');
}
out.push("  raise notice 'Redgum demo seed complete for org %', v_org;");
out.push('end $$;');

process.stdout.write(out.join('\n') + '\n');
