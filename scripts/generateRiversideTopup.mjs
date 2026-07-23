// One-off: tops up the EXISTING Riverside Theatre in the Convention Centre org
// with the modules added later (accessible website, alt formats, equipment,
// content/sensory warnings). Reuses the already-generated answers from the main
// seed, re-pointed to the Convention Centre org + its existing Riverside site.
// No new venue, no move. Idempotent (ON CONFLICT DO NOTHING).
//
// Usage:  node scripts/generateRiversideTopup.mjs > supabase/seeds/riverside_convention_topup.sql

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(here, '..', 'supabase', 'seeds', 'redgum_demo_seed.sql'), 'utf8');

const TARGET = new Set(['1.2', '3.4', '3.6', '6.4', '7.2']);

// Riverside is the last venue in the seed; take from its banner to the closing notice.
const start = sql.indexOf('===== Riverside Theatre =====');
const endMarker = sql.indexOf("raise notice 'Redgum demo seed complete");
const section = sql.slice(start, endMarker === -1 ? undefined : endMarker);

// Each module emits a module_progress then a module_responses insert, both ending "do nothing;".
const statements = section.match(/insert into (?:module_progress|module_responses)[\s\S]*?do nothing;/g) || [];
const kept = statements.filter((s) => {
  const m = s.match(/'seed-redgum-riverside-theatre','([^']+)'/);
  return m && TARGET.has(m[1]);
});

if (kept.length === 0) {
  process.stderr.write('No target-module statements found; nothing to emit.\n');
  process.exit(1);
}

const out = [];
out.push('-- Riverside Theatre top-up for the Convention Centre org (generated).');
out.push('-- Adds the later modules to the EXISTING Riverside; safe to run once.');
out.push('do $$');
out.push('declare v_org uuid; v_user uuid; v_site uuid;');
out.push('begin');
out.push("  select id into v_org from organisations where name = 'Redgum Convention & Exhibition Centre' order by created_at limit 1;");
out.push("  if v_org is null then raise exception 'Convention Centre org not found'; end if;");
out.push("  select user_id into v_user from organisation_memberships where organisation_id = v_org and status = 'active' order by created_at limit 1;");
out.push("  select id into v_site from sites where organisation_id = v_org and name = 'Riverside Theatre';");
out.push("  if v_site is null then raise exception 'Riverside Theatre not found in the Convention Centre org'; end if;");
out.push('');
for (const s of kept) {
  out.push('  ' + s.trim());
}
out.push('');
out.push("  raise notice 'Riverside top-up complete for Convention Centre org %', v_org;");
out.push('end $$;');

process.stdout.write(out.join('\n') + '\n');
