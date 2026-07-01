// Generates a self-contained SQL seed for Redgum Shire Council's OWN multi-site
// assessment: venues as sites, ~20 modules of realistic council-voice answers
// (yes / partially-with-description / no / unable-to-check), plus a few
// cloud-persisted reassessment snapshots to demo the reassessment feature.
//
// Resolves the Redgum org + an admin user + sites by NAME at run time, so no
// hard-coded IDs. Idempotent: re-running upserts with ON CONFLICT DO NOTHING.
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

// ---- minimal RFC-4180 CSV parser (handles quotes, embedded commas/newlines)
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
const cActNo = col('Action Text (No)');
const cActPart = col('Action Text (Partially)');

// module code -> list of assessable yes/no questions
const byModule = new Map();
for (let i = 1; i < raw.length; i++) {
  const r = raw[i];
  if (!r || r.length <= cType) continue;
  if ((r[cType] || '').trim() !== 'yes-no-unsure') continue; // core assessable questions only
  const code = (r[cCode] || '').trim();
  if (!code) continue;
  if (!byModule.has(code)) byModule.set(code, []);
  byModule.get(code).push({
    qid: (r[cQid] || '').trim(),
    text: (r[cText] || '').trim(),
    impact: (r[cImpact] || '').trim(),
    compliance: (r[cCompliance] || '').trim(),
    safety: (r[cSafety] || '').trim().toLowerCase() === 'yes',
    actionNo: (r[cActNo] || '').trim(),
    actionPart: (r[cActPart] || '').trim(),
  });
}

// ---- the council's venues and which modules each ran --------------------
// NOTE: events (6.x), major events (7.x), outdoor (3.11) and playground (3.12)
// modules use single-select questions (option ids), a different response shape,
// so they are not seeded here. Every venue is populated with the general
// yes-no-unsure access modules that apply to any site type.
const VENUES = [
  { name: 'Central Library', maturity: 'high', modules: ['1.1', '1.2', '2.1', '2.2', '3.1', '3.5', '4.1', '4.2', '4.3', '5.3'] },
  { name: 'Regional Art Gallery', maturity: 'high', modules: ['1.1', '2.1', '2.2', '3.1', '3.3', '3.5', '4.2'] },
  { name: 'Visitor Information Centre', maturity: 'med', modules: ['1.1', '1.4', '1.5', '2.1', '4.1', '4.2'] },
  { name: 'Aquatic & Leisure Centre', maturity: 'med', modules: ['2.1', '2.2', '2.3', '3.2', '4.2', '4.4'] },
  { name: 'Botanic Gardens & Playground', maturity: 'med', modules: ['2.1', '2.3', '3.5', '4.1'] },
  { name: 'Winter Markets', maturity: 'low', modules: ['1.1', '2.1', '2.4', '3.5', '4.2'] },
  { name: 'Riverbend Summer Festival', maturity: 'low', modules: ['1.1', '1.4', '2.1', '2.4', '3.6', '4.2', '4.7'] },
  { name: 'Town Hall & Civic Centre', maturity: 'high', modules: ['1.1', '2.1', '2.2', '3.1', '4.2', '5.1', '5.3', '5.5'] },
];

// (venue, module) pairs that get a prior reassessment snapshot (improved since)
const REASSESSED = new Set(['Central Library|3.1', 'Aquatic & Leisure Centre|2.1', 'Winter Markets|2.1']);

const DIST = {
  high: { yes: 0.68, partially: 0.18, no: 0.08, 'unable-to-check': 0.06 },
  med: { yes: 0.55, partially: 0.22, no: 0.14, 'unable-to-check': 0.09 },
  low: { yes: 0.42, partially: 0.25, no: 0.22, 'unable-to-check': 0.11 },
};
function rollAnswer(maturity) {
  const d = DIST[maturity]; const x = rnd();
  let acc = 0;
  for (const a of ['yes', 'partially', 'no', 'unable-to-check']) { acc += d[a]; if (x <= acc) return a; }
  return 'yes';
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
  '',
  '',
];

function priorityFor(q, answer) {
  if (q.safety) return 'high';
  if ((q.compliance || '').toLowerCase() === 'mandatory') return 'high';
  if ((q.impact || '').toLowerCase() === 'high') return answer === 'no' ? 'high' : 'medium';
  return 'medium';
}
function confidence(answers) {
  const total = answers.length || 1;
  const yes = answers.filter(a => a.answer === 'yes').length;
  const neg = answers.filter(a => a.answer === 'no' || a.answer === 'unable-to-check').length;
  if ((yes / total) * 100 >= 70) return 'strong';
  if ((neg / total) * 100 >= 50) return 'needs-work';
  return 'mixed';
}
const esc = (s) => String(s).replace(/'/g, "''");
const jsonLit = (o) => `'${esc(JSON.stringify(o))}'::jsonb`;

// build one module's answers + summary
function buildModule(code, maturity, worse = false) {
  const qs = (byModule.get(code) || []).slice(0, 12);
  const answers = qs.map(q => {
    let answer = rollAnswer(maturity);
    if (worse && answer === 'yes' && rnd() < 0.45) answer = pick(['partially', 'no']); // prior run was worse
    let notes = null, partial = null;
    if (answer === 'partially') partial = pick(PARTIAL_NOTES);
    else if (answer === 'unable-to-check') notes = pick(UNSURE_NOTES);
    else if (answer === 'yes') { const n = pick(YES_NOTES); notes = n || null; }
    return { ...q, answer, notes, partial };
  });
  const doingWell = answers.filter(a => a.answer === 'yes').slice(0, 3).map(a => a.text);
  const priorityActions = answers.filter(a => a.answer === 'no' || a.answer === 'partially').slice(0, 4).map(a => ({
    questionId: a.qid,
    questionText: a.text,
    action: (a.answer === 'no' ? a.actionNo : a.actionPart) || 'Review and improve this area.',
    priority: priorityFor(a, a.answer),
    timeframe: a.answer === 'no' ? '30-90 days' : '90-180 days',
    complianceLevel: a.compliance || undefined,
    safetyRelated: a.safety || undefined,
  }));
  const areasToExplore = answers.filter(a => a.answer === 'unable-to-check').slice(0, 3).map(a => a.text);
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
out.push("  select id into v_org from organisations where name ilike '%redgum%' order by created_at limit 1;");
out.push("  if v_org is null then raise exception 'Redgum org not found - no organisation name contains redgum'; end if;");
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
    if (!byModule.has(code)) { out.push(`  -- (module ${code} has no yes/no questions in export - skipped)`); continue; }
    const started = `now() - interval '${dayOffset} days'`;
    const completed = `now() - interval '${dayOffset - 2} days'`;
    dayOffset = Math.max(6, dayOffset - 1);
    const m = buildModule(code, venue.maturity);
    out.push(`  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)`);
    out.push(`  values ('${sess}','${code}','${code}','completed','${m.confidence}',${jsonLit(m.summary)},${started},${completed},v_org,v_site,v_user,v_user)`);
    out.push(`  on conflict (organisation_id, site_id, module_id) do nothing;`);
    if (m.answers.length) {
      const vals = m.answers.map(a =>
        `('${sess}','${code}','${a.qid}','${a.answer}',${a.notes ? `'${esc(a.notes)}'` : 'null'},${a.partial ? `'${esc(a.partial)}'` : 'null'},v_org,v_site,v_user)`
      ).join(',\n    ');
      out.push(`  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, organisation_id, site_id, user_id) values\n    ${vals}`);
      out.push(`  on conflict (organisation_id, site_id, module_id, question_id) do nothing;`);
    }
    // prior reassessment snapshot for chosen pairs
    if (REASSESSED.has(`${venue.name}|${code}`)) {
      const prior = buildModule(code, venue.maturity, true);
      const runId = `seed-run-redgum-${slug}-${code}-r1`;
      const responses = prior.answers.map(a => ({
        questionId: a.qid, answer: a.answer,
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
