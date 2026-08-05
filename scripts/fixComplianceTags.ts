/**
 * Compliance-tag sweep: every obligation-tagged question that cited no standard.
 *
 * An item claiming a legal obligation must be able to name the instrument. 92
 * could not. Each is resolved one of two ways:
 *
 *   CITE   - a standard genuinely applies and was simply never recorded. The
 *            tag stays and a complianceRef is added.
 *   UNTAG  - no instrument compels it. The tag is removed. These keep their
 *            priority through impactLevel, which since 2026-08-05 reaches high
 *            on its own, so nothing important is demoted by untagging.
 *
 * WCAG success criteria are cited by number because they are precise and
 * checkable. Physical items cite the instrument (Premises Standards 2010,
 * AS 1428.1) WITHOUT inventing a clause number: a wrong clause in front of a
 * council is worse than no clause.
 *
 * Run: npx tsx scripts/fixComplianceTags.ts [--apply]
 */
import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'src/data/accessModules.ts';

type Fix = { ref: string } | { untag: true; why: string };

const FIXES: Record<string, Fix> = {
  // ---- 1.1 Pre-visit information -------------------------------------
  // Publishing pre-visit information is not compelled by any instrument. The
  // DDA prohibits discrimination; it does not mandate a web page. High impact
  // carries these on priority instead.
  '1.1-F-1': { untag: true, why: 'No instrument requires publishing pre-visit access information' },
  '1.1-D-1a': { untag: true, why: 'Where information is published is a choice, not a requirement' },
  '1.1-D-5d': { untag: true, why: 'Testing contact channels is good practice, not a mandated act' },

  // ---- 1.2 Website basics (WCAG 2.2 AA) ------------------------------
  '1.2-1-1': { ref: 'WCAG 2.2 SC 2.1.1 Keyboard' },
  '1.2-1-1b': { ref: 'WCAG 2.2 SC 2.4.7 Focus Visible' },
  '1.2-1-2': { ref: 'WCAG 2.2 SC 1.1.1 Non-text Content' },
  '1.2-1-3': { ref: 'WCAG 2.2 SC 1.4.3 Contrast (Minimum)' },
  '1.2-1-4': { ref: 'WCAG 2.2 SC 1.4.4 Resize Text' },
  '1.2-1-5': { ref: 'WCAG 2.2 SC 1.4.10 Reflow' },
  '1.2-1-5c': { ref: 'WCAG 2.2 SC 2.5.8 Target Size (Minimum)' },
  '1.2-1-6a': { ref: 'WCAG 2.2 SC 1.2.2 Captions (Prerecorded)' },
  '1.2-1-6b': { ref: 'WCAG 2.2 SC 1.2.3 Audio Description or Media Alternative' },
  '1.2-1-7': { ref: 'WCAG 2.2 SC 2.4.4 Link Purpose (In Context)' },
  '1.2-1-9': { ref: 'WCAG 2.2 SC 3.3.2 Labels or Instructions' },
  '1.2-F-10': { ref: 'WCAG 2.2 SC 3.3.1 Error Identification' },
  '1.2-D-10': { ref: 'WCAG 2.2 SC 2.2.1 Timing Adjustable' },
  // Testing with a screen reader is a method for finding failures, not a
  // requirement in itself. No SC says "you must test".
  '1.2-1-8': { untag: true, why: 'Screen-reader testing is a method, not a requirement' },

  // ---- 1.3 Making a booking ------------------------------------------
  '1.3-PC-1': { ref: 'WCAG 2.2 SC 2.1.1 Keyboard' },
  '1.3-PC-5': { ref: 'WCAG 2.2 SC 3.3.1 Error Identification' },
  '1.3-PC-9': { ref: 'WCAG 2.2 SC 1.4.10 Reflow' },
  '1.3-DD-5b': { ref: 'WCAG 2.2 SC 4.1.3 Status Messages' },
  '1.3-DD-1b': { ref: 'WCAG 2.2 SC 4.1.2 Name, Role, Value' },
  '1.3-DD-1c': { ref: 'WCAG 2.2 SC 2.2.1 Timing Adjustable' },
  '1.3-DD-1g': { ref: 'WCAG 2.2 Level AA (payment flow)' },
  // Equal access to the same booking path is the DDA duty itself.
  '1.3-PC-8': { ref: 'DDA 1992 s24 (goods, services and facilities)' },
  '1.3-PC-2': { untag: true, why: 'Inviting access requirements is good practice, not compelled' },
  '1.3-PC-3': { untag: true, why: 'Internal follow-up process is not compelled by an instrument' },

  // ---- 1.4 Social media, video and audio ------------------------------
  '1.4-PC-1': { ref: 'WCAG 2.2 SC 1.2.2 Captions (Prerecorded)' },
  '1.4-PC-2': { ref: 'WCAG 2.2 SC 1.2.5 Audio Description (Prerecorded)' },
  '1.4-PC-3': { ref: 'WCAG 2.2 SC 1.1.1 Non-text Content' },
  '1.4-PC-4': { ref: 'WCAG 2.2 SC 2.1.1 Keyboard' },
  '1.4-DD-4b': { ref: 'WCAG 2.2 SC 1.4.2 Audio Control' },
  '1.4-DD-1a': { ref: 'WCAG 2.2 SC 1.2.2 Captions (Prerecorded)' },
  '1.4-DD-5c': { ref: 'WCAG 2.2 SC 2.3.1 Three Flashes or Below Threshold' },
  '1.4-D-9': { ref: 'WCAG 2.2 SC 1.2.1 Audio-only and Video-only (Prerecorded)' },

  // ---- 1.5 / 3.6 / 4.x / 5.7 / 6.1 / 7.x digital ----------------------
  '1.5-DD-8b': { ref: 'WCAG 2.2 SC 1.1.1 Non-text Content' },
  '3.6-D-1': { ref: 'WCAG 2.2 Level AA (linked content)' },
  '3.6-D-7': { ref: 'WCAG 2.2 SC 1.2.2 Captions (Prerecorded)' },
  '3.6-D-8': { ref: 'WCAG 2.2 SC 1.2.5 Audio Description (Prerecorded)' },
  '4.1-DD-11a': { ref: 'WCAG 2.2 Level AA' },
  '4.3-D-1': { ref: 'WCAG 2.2 Level AA (booking system)' },
  '4.6-F-1': { ref: 'WCAG 2.2 Level AA (electronic communications)' },
  '4.6-D-10': { ref: 'WCAG 2.2 SC 1.2.2 and SC 1.2.5' },
  '4.7-PC-2': { ref: 'WCAG 2.2 Level AA (electronic communications)' },
  '4.7-PC-3': { ref: 'WCAG 2.2 Level AA (PDF documents)' },
  '5.7-PC-5': { ref: 'DDA 1992 s15 (employment) with WCAG 2.2 Level AA' },
  '6.1-PC-5': { ref: 'WCAG 2.2 Level AA (registration flow)' },
  '7.3-DD-6': { ref: 'DDA 1992 s24 (goods, services and facilities)' },
  '7.2-DD-4': { untag: true, why: 'Using certified providers is a quality choice, not compelled' },
  '4.3-D-7': { untag: true, why: 'Advance booking of equipment is a service design choice' },
  '6.1-PC-3': { untag: true, why: 'Accepting accommodation requests at registration is not compelled' },
  '6.1-D-4': { untag: true, why: 'Alternative promotional formats are best practice' },

  // ---- 2.x / 3.x physical (instrument named, no invented clause) -------
  '2.1-F-2': { ref: 'Premises Standards 2010 and AS 1428.1' },
  '2.1-D-20': { ref: 'AS 1428.4.1 (tactile ground surface indicators)' },
  '2.2-D-32': { ref: 'Premises Standards 2010 (accessible lifts)' },
  '2.3-D-17': { ref: 'Premises Standards 2010 (accessible lifts)' },
  '3.2-1-5': { ref: 'AS 1428.1 (accessible sanitary facilities)' },
  '2.5-D-14': { ref: 'Premises Standards 2010 and AS 1428.1' },
  '2.1-F-3a': { untag: true, why: 'Drop-off design is not itself a mandated element' },
  '2.1-D-9': { untag: true, why: 'Managing bays during events is an operational choice' },
  '2.1-D-16': { untag: true, why: 'Lighting and signage on the route are best practice here' },
  '2.1-D-18': { untag: true, why: 'Signage placement at decision points is best practice' },
  '2.2-F-4': { untag: true, why: 'Entrance visibility is best practice, not a mandated element' },
  '2.2-F-7': { untag: true, why: 'Entrance lighting level is best practice here' },
  '2.2-D-17': { untag: true, why: 'Door timing beyond the standard is an adjustment, not a duty' },
  '2.5-D-7': { untag: true, why: 'Shared-zone design guidance is not a compliance duty on the operator' },
  '3.12-D-6': { untag: true, why: 'Caregiver access across a playground is best practice' },

  // ---- 6.x events ------------------------------------------------------
  // Temporary event infrastructure is not a "building" under the Premises
  // Standards, so those do not bite. The DDA duty still does.
  '6.2-PC-1': { ref: 'DDA 1992 s23 (access to premises)' },
  '6.2-PC-3': { ref: 'DDA 1992 s23 (access to premises)' },
  '6.2-PC-2': { untag: true, why: 'Event parking provision is best practice, not compelled' },
  '6.2-PC-4': { untag: true, why: 'Seating mix is a design choice for a temporary event' },
  '6.2-D-7': { untag: true, why: 'Accessible viewing at standing events is best practice' },
  '6.2-D-8': { untag: true, why: 'Trip-hazard management sits under WHS, not accessibility law' },
  '6.2-D-10': { untag: true, why: 'Edge definition is best practice for a temporary stage' },
  '6.2-D-14': { untag: true, why: 'Elevated viewing platforms are best practice' },
  '6.3-PC-3': { untag: true, why: 'Announcement method is an operational choice' },
  '6.3-D-1': { untag: true, why: 'QR codes to accessible content are best practice' },
  '6.3-D-2': { untag: true, why: 'Tactile wayfinding at a temporary event is best practice' },
  '6.4-D-3': { untag: true, why: 'Hearing loop coverage at a temporary venue is best practice' },
  '6.4-D-7': { untag: true, why: 'Sensory trigger warnings are best practice' },
  '6.5-D-13': { untag: true, why: 'First aid provision is not an accessibility obligation' },
  '6.5-D-15': { untag: true, why: 'Security screening design is best practice' },

  // ---- 5.7 to 5.9 employment -------------------------------------------
  // The DDA employment provisions are real and bite here, but only where the
  // duty is discrimination or reasonable adjustment. Process improvements
  // around them are not themselves compelled.
  '5.8-PC-4': { ref: 'DDA 1992 s15 (employment) and s30 (unlawful questions)' },
  '5.9-DD-5': { ref: 'DDA 1992 s15 (employment), reasonable adjustment' },
  '5.9-DD-7': { ref: 'DDA 1992 s15 (employment), reasonable adjustment' },
  '5.9-DD-8': { ref: 'DDA 1992 s15 (employment)' },
  '5.8-DD-5': { ref: 'DDA 1992 s15 (employment), reasonable adjustment' },
  '5.9-PC-4': { ref: 'DDA 1992 s15 (employment), reasonable adjustment' },
  // A PEEP is the accepted way to meet the duty, not the duty itself, and it
  // sits under WHS law rather than the DDA.
  '5.9-DD-3': { untag: true, why: 'PEEPs sit under WHS duties, not the DDA' },
  '5.8-PC-3': { untag: true, why: 'Confirming venue access in advance is good practice' },
  '5.8-DD-9': { untag: true, why: 'A selection-specific complaints route is best practice' },
  '5.7-DD-8': { untag: true, why: 'Annual audit cadence for careers content is best practice' },
};

const src = readFileSync(FILE, 'utf8');
const lines = src.split('\n');

let currentId = '';
const out: string[] = [];
const cited: string[] = [];
const untagged: string[] = [];
const notSeen = new Set(Object.keys(FIXES));

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const idMatch = line.match(/^\s*id: '([^']+)',\s*$/);
  if (idMatch) currentId = idMatch[1];

  const clMatch = line.match(/^(\s*)complianceLevel: '([^']+)',\s*$/);
  if (clMatch && FIXES[currentId]) {
    const fix = FIXES[currentId];
    notSeen.delete(currentId);
    const indent = clMatch[1];
    // Only touch a tag that has no reference on the following line.
    const next = lines[i + 1] ?? '';
    if (/complianceRef:/.test(next)) { out.push(line); continue; }

    if ('untag' in fix) {
      untagged.push(`${currentId}  ${fix.why}`);
      continue; // drop the complianceLevel line entirely
    }
    out.push(line);
    out.push(`${indent}complianceRef: '${fix.ref}',`);
    cited.push(`${currentId}  ${fix.ref}`);
    continue;
  }
  out.push(line);
}

if (process.argv.includes('--apply')) {
  writeFileSync(FILE, out.join('\n'));
  console.log('APPLIED to ' + FILE);
} else {
  console.log('DRY RUN, pass --apply to write');
}

console.log(`\nCITED (tag kept, standard recorded): ${cited.length}`);
cited.forEach(c => console.log('  ' + c));
console.log(`\nUNTAGGED (no instrument compels it): ${untagged.length}`);
untagged.forEach(u => console.log('  ' + u));
if (notSeen.size) {
  console.log(`\nNOT FOUND IN FILE (check the id): ${[...notSeen].join(', ')}`);
}
