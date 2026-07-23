// Verifies the Access Profile end to end against the REAL Riverside Theatre seed
// data, using the same code the app runs. Proves the cloud-reload fix: single
// and multi select answers must survive parsing and surface as features. Exits
// non-zero if any option-based feature is missing, so it is a regression guard.
//
// Usage:  npm run verify:access-profile

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { generateAccessStatement, buildAccessProfileProse } from '../src/utils/generateAccessStatement';
import { parseStoredMultiSelect } from '../src/utils/parseStoredMultiSelect';

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, '..', 'supabase', 'seeds', 'redgum_demo_seed.sql'), 'utf8');

function unquote(field: string): string | null {
  if (field === 'null') return null;
  return field.slice(1, -1).replace(/''/g, "'");
}

// module_responses rows: ('seed-...','<mod>','<qid>',<answer>,<notes>,<partial>,<msv>,v_org,v_site,v_user)
const rowRe = /\('seed-redgum-riverside-theatre','([^']*)','([^']*)',(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),v_org,v_site,v_user\)/g;

type Prog = Record<string, { moduleId: string; responses: Array<Record<string, unknown>> }>;
const progress: Prog = {};
let count = 0;
for (const m of sql.matchAll(rowRe)) {
  const [, moduleId, questionId, ansF, notesF, partF, msvF] = m;
  const raw = unquote(msvF); // the JSON string the DB stores; parseStoredMultiSelect handles it
  (progress[moduleId] ??= { moduleId, responses: [] }).responses.push({
    questionId,
    answer: unquote(ansF),
    notes: unquote(notesF) ?? undefined,
    partialDescription: unquote(partF) ?? undefined,
    multiSelectValues: parseStoredMultiSelect(raw ?? undefined),
    timestamp: '',
  });
  count += 1;
}

// eslint-disable-next-line no-console
const log = (s = '') => console.log(s);
log(`Parsed ${count} Riverside Theatre responses across ${Object.keys(progress).length} modules.\n`);

const statement = generateAccessStatement(progress as never, 'Riverside Theatre');
for (const s of buildAccessProfileProse(statement)) {
  log(s.title);
  if (s.paragraph) log('  ' + s.paragraph);
  if (s.notes.length > 0) log('  In some areas: ' + s.notes.join(' '));
  log('');
}

// Prove the fix matters: the same data with multi-select answers dropped (the old bug).
const stripped: Prog = Object.fromEntries(
  Object.entries(progress).map(([k, v]) => [k, { ...v, responses: v.responses.map((r) => ({ ...r, multiSelectValues: undefined })) }]),
);
const before = generateAccessStatement(stripped as never, 'Riverside Theatre').featureCount;

log(`Features WITH the fix:                 ${statement.featureCount}`);
log(`Features if multi-select is dropped:   ${before}   (this is what the bug produced)`);

// These features come only from multi/single select answers, so they are the
// canary for the cloud-reload bug.
const labels = statement.categories.flatMap((c) => c.features.map((f) => f.label));
const mustHave = [
  'Step-free access at the main entrance',
  'Wheelchair spaces',
  'Wider seats for larger bodies',
  'Hearing loop or assistive listening',
  'Accessible toilet', // single-select question read via option sentiment
];
const missing = mustHave.filter((l) => !labels.includes(l));

if (missing.length > 0) {
  console.error(`\nFAIL: option-based features missing: ${missing.join(', ')}`);
  process.exit(1);
}
log('\nPASS: all option-based features present. The cloud-reload fix is holding.');
