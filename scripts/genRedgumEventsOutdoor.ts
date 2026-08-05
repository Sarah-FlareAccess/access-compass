// Generates supabase/seeds/redgum_events_outdoor.sql
//
// The original Redgum seed only emitted yes-no-unsure answers, so every module
// built on single-select questions was invisible in the demo: all of events
// (6.x), outdoor spaces (3.11) and playgrounds (3.12). Those are exactly the
// modules a council recognises, so the gap showed.
//
// Question ids are read straight from accessModules.ts rather than typed by
// hand, so a renamed or removed question surfaces here instead of silently
// seeding a dead id. Run: npx tsx scripts/genRedgumEventsOutdoor.ts > supabase/seeds/redgum_events_outdoor.sql
import { accessModules } from '../src/data/accessModules';

// Deterministic pseudo-random from a string, so regenerating is stable.
// A plain (x*31 + c) rolling hash clusters badly on ids that share a long
// prefix, which every question id in a module does. That made the first
// several questions of a module land on the same verdict. Mixing the bits
// afterwards spreads them.
function h(s: string): number {
  let x = 2166136261;
  for (let i = 0; i < s.length; i++) {
    x ^= s.charCodeAt(i);
    x = Math.imul(x, 16777619) >>> 0;
  }
  x ^= x >>> 15;
  x = Math.imul(x, 2246822507) >>> 0;
  x ^= x >>> 13;
  return x >>> 0;
}

const PROFILE: Record<string, 'strong' | 'mixed' | 'needs-work'> = {
  '6.1': 'mixed', '6.2': 'strong', '6.3': 'mixed', '6.4': 'needs-work',
  '6.5': 'mixed', '3.11': 'mixed', '3.12': 'strong',
};

const SITE: Record<string, string> = {
  '6.1': 'Riverbend Summer Festival', '6.2': 'Riverbend Summer Festival',
  '6.3': 'Riverbend Summer Festival', '6.4': 'Riverbend Summer Festival',
  '6.5': 'Riverbend Summer Festival',
  '3.11': 'Botanic Gardens & Playground', '3.12': 'Botanic Gardens & Playground',
};

// [yes cutoff, partially cutoff] out of 100; the remainder answers no.
const WEIGHTS: Record<string, [number, number]> = {
  strong: [68, 88], mixed: [40, 74], 'needs-work': [20, 50],
};

const PARTIAL_NOTE: Record<string, string> = {
  '6.1': 'Access is considered for the main stage program but not consistently for the smaller pop-up events.',
  '6.2': 'Step-free routes are in place across the main site; the riverside stage still has a gravel approach.',
  '6.3': 'Auslan is provided at the opening and closing events, not across the whole program.',
  '6.4': 'A hearing loop is available in the marquee only, and it is not tested before every session.',
  '6.5': 'Briefings cover the paid crew; casual volunteers often start on the day and miss it.',
  '3.11': 'The main circuit is sealed and accessible; the secondary tracks are compacted gravel.',
  '3.12': 'The ground surface is compliant at the entry and under the main equipment, not across the whole space.',
};

const TEXT_ANSWER: Record<string, string> = {
  '6.1': 'Council is preparing an access plan template that every event lead completes at the scoping stage.',
  '6.2': 'The site plan is reviewed with an access consultant each year before the layout is locked.',
  '6.3': 'We publish the access guide four weeks out so people can plan before tickets are released.',
  '6.4': 'Portable hearing loops are hired each year. Owning a set is in the next budget bid.',
  '6.5': 'A staffed access hub sits beside the main entrance for the duration of the festival.',
  '3.11': 'A path condition audit is scheduled after each winter to catch surface damage early.',
  '3.12': 'The playground was co-designed with families through the Disability Advisory Committee.',
};

interface Summary { doingWell: string[]; actions: Array<[string, string, string]>; explore: string[] }

const SUMMARY: Record<string, Summary> = {
  '6.1': {
    doingWell: [
      'Accessibility is raised at the event scoping stage, not after the program is set.',
      'An accessibility budget line exists for the main festival program.',
    ],
    actions: [
      ['6.1-PC-1', 'Apply the same access planning to every event in the program, including the smaller pop-up and satellite events.', 'high'],
      ['6.1-PC-2', 'Publish access information on every event page, not only the festival landing page.', 'high'],
      ['6.1-D-2', 'Involve people with disability in planning the program, not only in feedback gathered after the event.', 'medium'],
    ],
    explore: [
      'Whether event leads know who to ask when an access request arrives late.',
      'How access requirements captured at registration reach the on-site team.',
    ],
  },
  '6.2': {
    doingWell: [
      'A step-free route runs from accessible parking to the main stage.',
      'Accessible toilets are distributed across the site rather than clustered at one end.',
      'Wheelchair viewing areas are provided at the main stage with a companion seat beside them.',
    ],
    actions: [
      ['6.2-D-15', 'Seal or matt the gravel approach to the riverside stage so the accessible route is continuous across the whole site.', 'high'],
      ['6.2-D-8', 'Keep the accessible path of travel clear of cabling, signage and food queues once the site is built.', 'high'],
      ['6.2-D-19', 'Add a second accessible drop-off closer to the eastern entry, and actively manage it during peak arrival.', 'medium'],
    ],
    explore: [
      'Whether temporary infrastructure narrows the accessible route once vendors are in place.',
      'How the site holds up after rain on the unsealed sections.',
    ],
  },
  '6.3': {
    doingWell: [
      'An access guide is published ahead of the festival.',
      'Key event information is offered in more than one format.',
    ],
    actions: [
      ['6.3-PC-2', 'Publish the access guide in plain language and Easy Read when tickets go on sale, so people can decide before they book.', 'high'],
      ['6.3-D-3', 'Produce a sensory map for the site showing the loud zones, the quiet spaces and the calmest times of day.', 'high'],
      ['6.3-D-5', 'Set out how program changes and delays will reach people who cannot hear an announcement over the PA.', 'medium'],
    ],
    explore: [
      'Whether the access guide is written in plain language and available in Easy Read.',
      'How last-minute program changes reach people who rely on the published access information.',
    ],
  },
  '6.4': {
    doingWell: [
      'A hearing loop is available in the main marquee.',
    ],
    actions: [
      ['6.4-PC-1', 'Extend hearing augmentation beyond the main marquee to the other staged venues, and test it before doors open at each one.', 'high'],
      ['6.4-PC-3', 'Provide a quiet or low-sensory space with clear signage and a staff member who knows where it is.', 'high'],
      ['6.4-D-7', 'Publish warnings for strobe lighting, loud passages and special effects ahead of the event, not only at the door.', 'high'],
    ],
    explore: [
      'Whether the hired hearing loops are tested on site rather than assumed to work.',
      'What sensory information people ask for most often when they contact the festival.',
    ],
  },
  '6.5': {
    doingWell: [
      'A staffed access hub operates beside the main entrance for the duration of the festival.',
      'Accessible facilities are signed and kept clear during the event.',
    ],
    actions: [
      ['6.5-PC-1', 'Bring casual volunteers into the access briefing, since many start on the day and currently miss it.', 'high'],
      ['6.5-D-1', 'Name one person as accountable for access on each day of the festival, and put that name on the run sheet.', 'high'],
      ['6.5-D-4', 'Agree in advance how a late access request on the day is handled, and who can authorise it.', 'medium'],
    ],
    explore: [
      'How access issues raised during the event are recorded and carried into next year.',
      'Whether the access hub is findable from the far end of the site.',
    ],
  },
  '3.11': {
    doingWell: [
      'The main circuit is sealed, level and wide enough for two-way passing.',
      'Seating with armrests is provided at intervals along the main circuit.',
      'Accessible parking sits close to the main entry.',
    ],
    actions: [
      ['3.11-PC-1', 'Upgrade the secondary tracks from loose gravel to a firm compacted surface, or publish clearly which routes are accessible.', 'high'],
      ['3.11-D-2', 'Add rest areas with seating and shade at regular intervals on the longer sections of the main circuit.', 'medium'],
      ['3.11-D-13', 'Publish a grounds access map showing surface types, gradients and the location of seating and toilets.', 'medium'],
    ],
    explore: [
      'Whether path widths are maintained as planting grows through the season.',
      'How the grounds are checked for surface damage after winter.',
    ],
  },
  '3.12': {
    doingWell: [
      'The playground was co-designed with families through the Disability Advisory Committee.',
      'An accessible path connects parking, toilets and the play space.',
      'The play space includes equipment usable by children who use mobility aids.',
      'Fencing and gates allow a carer to manage a child who may wander.',
    ],
    actions: [
      ['3.12-PC-2', 'Extend the accessible ground surface beyond the entry and main equipment to the whole play space.', 'high'],
      ['3.12-D-2', 'Add a quiet zone near the playground for children who become overstimulated.', 'medium'],
      ['3.12-PC-7', 'Bring the supporting facilities up to standard: an accessible toilet, drinking water and bins within easy reach of the play space.', 'medium'],
    ],
    explore: [
      'Whether shade covers the equipment most used by children who cannot self-regulate temperature.',
      'How families find out what the playground offers before they travel.',
    ],
  },
};

const esc = (s: string) => s.replace(/'/g, "''");
const out: string[] = [];

out.push([
  '-- =====================================================',
  '-- Redgum Shire Council: events (6.x) + outdoor (3.11, 3.12)',
  '-- =====================================================',
  '-- GENERATED by scripts/genRedgumEventsOutdoor.ts. Do not hand-edit, regenerate.',
  '--',
  '-- The original Redgum seed only emitted yes-no-unsure answers, so every',
  '-- module built on single-select questions was invisible in the demo. Those',
  '-- are exactly the modules a council recognises, so the gap showed.',
  '--',
  '-- Single-select and multi-select answers live in module_responses',
  '-- .multi_select_values as a JSON array (one element for single-select),',
  '-- which is the shape the app reads back.',
  '--',
  '-- Events map to the festival site, outdoor and playground to the gardens.',
  '-- Idempotent: each module deletes its own rows before re-inserting.',
  '-- =====================================================',
  'do $$',
  'declare',
  '  v_org uuid; v_user uuid; v_site uuid;',
  'begin',
  "  select id into v_org from organisations where name ilike '%shire council%' order by created_at limit 1;",
  "  if v_org is null then raise exception 'Redgum council org not found - run redgum_demo_seed.sql first.'; end if;",
  '  select user_id into v_user from organisation_memberships where organisation_id = v_org order by created_at limit 1;',
].join('\n'));

for (const code of Object.keys(PROFILE)) {
  const mod = accessModules.find(m => m.code === code);
  if (!mod) { console.error('MISSING MODULE ' + code); continue; }

  const sess = 'seed-redgum-' + code.replace('.', '-');
  const [yesCut, partCut] = WEIGHTS[PROFILE[code]];
  const rows: string[] = [];
  let partialUsed = false;

  for (const q of (mod.questions as Array<Record<string, unknown>>)) {
    const qid = q.id as string;
    const r = h(qid) % 100;
    const verdict = r < yesCut ? 'yes' : r < partCut ? 'partially' : 'no';
    const type = q.type as string;

    if (type === 'text' || type === 'textarea') {
      const t = TEXT_ANSWER[code];
      if (qid.endsWith('-OTHER') && t) {
        rows.push("    ('" + sess + "','" + code + "','" + qid + "',null,'" + esc(t) + "',null,null,v_org,v_site,v_user)");
      }
      continue;
    }

    const opts = (q.options ?? []) as Array<{ id: string }>;
    if (!opts.length) continue;
    const ids = opts.map(o => o.id);

    if (type === 'multi-select') {
      const take = verdict === 'yes' ? Math.min(3, ids.length) : verdict === 'partially' ? Math.min(2, ids.length) : 1;
      const picked: string[] = [];
      for (let i = 0; i < take; i++) picked.push(ids[h(qid + i) % ids.length]);
      const uniq = [...new Set(picked)];
      rows.push("    ('" + sess + "','" + code + "','" + qid + "',null,null,null,'" + JSON.stringify(uniq) + "',v_org,v_site,v_user)");
      continue;
    }

    const want = verdict === 'yes' ? ['yes', 'always', 'fully']
      : verdict === 'partially' ? ['partially', 'sometimes', 'partly']
      : ['no', 'never', 'not-yet'];
    const chosen = ids.find(i => want.includes(i)) ?? ids[h(qid) % ids.length];

    let partial: string | null = null;
    if (chosen === 'partially' && !partialUsed && PARTIAL_NOTE[code]) {
      partial = PARTIAL_NOTE[code];
      partialUsed = true;
    }
    rows.push("    ('" + sess + "','" + code + "','" + qid + "',null,null," +
      (partial ? "'" + esc(partial) + "'" : 'null') + ",'" + JSON.stringify([chosen]) + "',v_org,v_site,v_user)");
  }

  const s = SUMMARY[code];
  const summary = {
    doingWell: s.doingWell,
    priorityActions: s.actions.map(([qid, action, priority]) => {
      const found = (mod.questions as Array<Record<string, unknown>>).find(q => q.id === qid);
      if (!found) console.error('WARNING: ' + code + ' summary references unknown question ' + qid);
      return {
        questionId: qid,
        questionText: (found?.text as string) ?? action,
        action, priority, timeframe: '30-90 days',
      };
    }),
    areasToExplore: s.explore,
    professionalReview: [],
  };

  const days = 20 + (h(code) % 70);
  out.push([
    '',
    '  -- ' + code + ' ' + mod.name + ' -> ' + SITE[code],
    "  select id into v_site from sites where organisation_id = v_org and name = '" + esc(SITE[code]) + "';",
    // Delete by (org, site, module), NOT by session_id. The unique index is
    // module_responses_org_site_module_question_uniq, so a row seeded earlier
    // under a different session_id still collides. Scoping the delete to the
    // session only would leave those rows in place and the insert would fail.
    "  delete from module_responses where organisation_id = v_org and module_id = '" + code + "'",
    "    and coalesce(site_id::text,'-') = coalesce(v_site::text,'-');",
    "  delete from module_progress where organisation_id = v_org and module_id = '" + code + "'",
    "    and coalesce(site_id::text,'-') = coalesce(v_site::text,'-');",
    '  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary,',
    '    started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)',
    "  values ('" + sess + "','" + code + "','" + code + "','completed','" + PROFILE[code] + "','" +
      esc(JSON.stringify(summary)) + "'::jsonb, now() - interval '" + (days + 4) + " days', now() - interval '" +
      days + " days', v_org, v_site, v_user, v_user);",
    '  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values',
    rows.join(',\n') + ';',
  ].join('\n'));

  console.error(code + ': ' + rows.length + ' responses, confidence ' + PROFILE[code]);
}

out.push([
  '',
  "  raise notice 'Seeded events (6.1-6.5) and outdoor (3.11, 3.12) for Redgum Shire Council.';",
  'end $$;',
].join('\n'));

console.log(out.join('\n'));
