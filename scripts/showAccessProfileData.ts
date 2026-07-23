// Shows the raw assessment answers behind Riverside Theatre's Access Profile:
// every profile feature, whether it is shown, and the exact question id + raw
// answer / selected options it was collated from. Read-only audit tool.
//
// Usage:  npx tsx scripts/showAccessProfileData.ts

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ACCESS_STATEMENT_CATEGORIES } from '../src/data/accessStatementFeatures';
import { parseStoredMultiSelect } from '../src/utils/parseStoredMultiSelect';

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, '..', 'supabase', 'seeds', 'redgum_demo_seed.sql'), 'utf8');

function unquote(field: string): string | null {
  if (field === 'null') return null;
  return field.slice(1, -1).replace(/''/g, "'");
}

const rowRe = /\('seed-redgum-riverside-theatre','([^']*)','([^']*)',(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),(null|'(?:[^']|'')*'),v_org,v_site,v_user\)/g;

interface Raw { answer: string | null; msv: string[] | undefined; notes: string | null; partial: string | null; }
const byQid = new Map<string, Raw>();
for (const m of sql.matchAll(rowRe)) {
  const [, , questionId, ansF, notesF, partF, msvF] = m;
  byQid.set(questionId, {
    answer: unquote(ansF),
    msv: parseStoredMultiSelect(unquote(msvF) ?? undefined),
    notes: unquote(notesF),
    partial: unquote(partF),
  });
}

const log = (s = '') => console.log(s);
log(`Riverside Theatre: ${byQid.size} raw answers parsed from the seed.\n`);

for (const cat of ACCESS_STATEMENT_CATEGORIES) {
  log(`==== ${cat.title} ====`);
  for (const f of cat.features) {
    const evidence: string[] = [];
    let shown: 'Yes' | 'Partial' | null = null;

    for (const qid of f.yesNo ?? []) {
      const r = byQid.get(qid);
      if (!r) { evidence.push(`${qid}: (not answered)`); continue; }
      evidence.push(`${qid} answer=${r.answer}${r.partial ? ` note="${r.partial}"` : ''}`);
      if (r.answer === 'yes') shown = 'Yes';
      else if (r.answer === 'partially' && shown !== 'Yes') shown = 'Partial';
    }
    for (const o of f.options ?? []) {
      const r = byQid.get(o.questionId);
      const vals = r?.msv ?? [];
      const hit = o.anyOf.filter((id) => vals.includes(id));
      evidence.push(`${o.questionId} selected=[${vals.join(', ') || '-'}]  looking for [${o.anyOf.join(', ')}]${hit.length ? `  MATCH=${hit.join(', ')}` : ''}`);
      if (hit.length) shown = 'Yes';
    }
    for (const qid of f.yesOption ?? []) {
      const r = byQid.get(qid);
      const vals = r?.msv ?? [];
      const yesHit = vals.filter((v) => /^yes/i.test(v));
      evidence.push(`${qid} selected=[${vals.join(', ') || '-'}]${yesHit.length ? `  MATCH(yes*)=${yesHit.join(', ')}` : ''}`);
      if (yesHit.length) shown = 'Yes';
    }

    log(`${shown ? `[SHOWN: ${shown}]` : '[not shown]'}  ${f.label}`);
    for (const e of evidence) log(`      ${e}`);
  }
  log();
}
