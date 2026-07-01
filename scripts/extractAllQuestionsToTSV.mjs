/**
 * Extract every question across all 50 modules of accessModules.ts to a TSV file.
 *
 * Strategy: read accessModules.ts as text, strip TS-only syntax (type imports,
 * interface, type annotations on functions/declarations), write a transformed
 * .mjs file, dynamic-import it, then walk the data structure.
 */
import { readFileSync, writeFileSync, mkdirSync, statSync, unlinkSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sourceFile = join(__dirname, '..', 'src', 'data', 'accessModules.ts');
const tempFile = join(__dirname, '_accessModules.temp.mjs');
const outputDir = join(__dirname, '..', 'exports');
const outputFile = join(outputDir, 'all-modules-questions.tsv');

// --- 1. Read and transform source ---
let src = readFileSync(sourceFile, 'utf-8');

// Drop the type-only import line.
src = src.replace(/^import type \{[^}]*\} from ['"][^'"]+['"];?\s*$/m, '');

// Remove the entire `export interface AccessModule { ... }` block.
src = src.replace(/export interface AccessModule \{[\s\S]*?^\}\s*/m, '');

// Strip type annotation from accessModules declaration.
src = src.replace(
  /export const accessModules\s*:\s*AccessModule\[\]\s*=/,
  'export const accessModules ='
);

// We don't need the helper functions for extraction, and they have TS types.
// Strip everything from the first helper comment to end of file.
const helperIdx = src.indexOf('// Helper to get module by ID or code');
if (helperIdx !== -1) {
  src = src.slice(0, helperIdx);
}

writeFileSync(tempFile, src, 'utf-8');

// --- 2. Dynamic import the transformed module ---
const mod = await import(pathToFileURL(tempFile).href);
const { accessModules, moduleGroups } = mod;

if (!Array.isArray(accessModules)) {
  throw new Error('accessModules did not load as an array');
}

console.log(`Loaded ${accessModules.length} modules`);

// --- 3. Build TSV ---
const HEADERS = [
  'Module Code',
  'Module Name',
  'Group',
  'Question ID',
  'Question Text',
  'Help Text',
  'Type',
  'Review Mode',
  'Category',
  'Impact Level',
  'Compliance Level',
  'Compliance Ref',
  'Safety Related',
  'Optional',
  'Is Entry Point',
  'Show When (Question ID)',
  'Show When (Answers)',
  'Show When OR (Question ID)',
  'Show When OR (Answers)',
  'Options',
  'Option Sentiments',
  'Option Recommendations',
  'Describe Option IDs',
  'Describe Placeholder',
  'Summary (Help)',
  'Understanding',
  'Tips',
  'Partial Placeholder',
  'Summary Behavior',
  'Supports Evidence',
  'Evidence Types',
  'Evidence Hint',
  'Measurement Unit',
  'Measurement Guidance',
  'Media Analysis Type',
  'Media Analysis Hint',
  'Action Text (Yes)',
  'Action Text (No)',
  'Action Text (Partially)',
  'Action Text (Unsure)',
];

/**
 * Sanitise a cell for TSV: strip tabs, preserve newlines, never write
 * 'undefined' / 'null'. The reader (Excel/Sheets) handles in-cell \n natively.
 */
function cell(v) {
  if (v === undefined || v === null) return '';
  let s = String(v);
  // Replace tabs and CR with single space so they don't break the TSV grid.
  s = s.replace(/\t/g, ' ').replace(/\r/g, '');
  return s;
}

function boolCell(v) {
  return v === true ? 'Yes' : '';
}

function joinKV(pairs) {
  // pairs: [[id, val], ...] -> "id: val\nid: val"
  return pairs.filter(([, v]) => v !== undefined && v !== null && v !== '').map(([k, v]) => `${k}: ${v}`).join('\n');
}

function formatOptions(options) {
  if (!Array.isArray(options)) return '';
  return options.map(o => `${o.id}: ${o.label}`).join('\n');
}

function formatOptionSentiments(options) {
  if (!Array.isArray(options)) return '';
  return joinKV(options.map(o => [o.id, o.sentiment]));
}

function formatOptionRecommendations(options) {
  if (!Array.isArray(options)) return '';
  return joinKV(options.map(o => [o.id, o.recommendation]));
}

function formatMeasurementGuidance(g) {
  if (!g || typeof g !== 'object') return '';
  const parts = [];
  if (g.min !== undefined) parts.push(`min: ${g.min}`);
  if (g.max !== undefined) parts.push(`max: ${g.max}`);
  if (g.ideal !== undefined) parts.push(`ideal: ${g.ideal}`);
  if (g.interpretation) parts.push(`interpretation: ${g.interpretation}`);
  return parts.join('\n');
}

const rows = [HEADERS.join('\t')];

// Track which fields are ever populated, to report empty columns at the end.
const populated = new Set();
let totalQuestions = 0;
const moduleQuestionCounts = [];

for (const m of accessModules) {
  const qList = Array.isArray(m.questions) ? m.questions : [];
  moduleQuestionCounts.push({ code: m.code, name: m.name, count: qList.length });

  for (const q of qList) {
    totalQuestions++;

    const showWhen = q.showWhen || {};
    const orConds = Array.isArray(showWhen.orConditions) ? showWhen.orConditions : [];
    const help = q.helpContent || {};
    const action = q.actionText || {};

    const row = [
      cell(m.code),
      cell(m.name),
      cell(m.group),
      cell(q.id),
      cell(q.text),
      cell(q.helpText),
      cell(q.type),
      cell(q.reviewMode),
      cell(q.category),
      cell(q.impactLevel),
      cell(q.complianceLevel),
      cell(q.complianceRef),
      boolCell(q.safetyRelated),
      boolCell(q.optional),
      boolCell(q.isEntryPoint),
      cell(showWhen.questionId),
      cell(Array.isArray(showWhen.answers) ? showWhen.answers.join(', ') : ''),
      cell(orConds.map(c => c.questionId).join('\n')),
      cell(orConds.map(c => (Array.isArray(c.answers) ? c.answers.join(', ') : '')).join('\n')),
      cell(formatOptions(q.options)),
      cell(formatOptionSentiments(q.options)),
      cell(formatOptionRecommendations(q.options)),
      cell(Array.isArray(q.describeOptionIds) ? q.describeOptionIds.join(', ') : ''),
      cell(q.describePlaceholder),
      cell(help.summary),
      cell(Array.isArray(help.understanding) ? help.understanding.join('\n') : ''),
      cell(Array.isArray(help.tips) ? help.tips.join('\n') : ''),
      cell(q.partialPlaceholder),
      cell(q.summaryBehavior),
      boolCell(q.supportsEvidence),
      cell(Array.isArray(q.evidenceTypes) ? q.evidenceTypes.join(', ') : ''),
      cell(q.evidenceHint),
      cell(q.measurementUnit),
      cell(formatMeasurementGuidance(q.measurementGuidance)),
      cell(q.mediaAnalysisType),
      cell(q.mediaAnalysisHint),
      cell(action.yes),
      cell(action.no),
      cell(action.partially),
      cell(action.unsure),
    ];

    row.forEach((v, idx) => {
      if (v !== '') populated.add(HEADERS[idx]);
    });

    rows.push(row.join('\t'));
  }
}

// --- 4. Write output ---
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, rows.join('\n'), 'utf-8');

// --- 5. Cleanup temp file ---
try { unlinkSync(tempFile); } catch {}

// --- 6. Verification report ---
const fileSize = statSync(outputFile).size;
const emptyColumns = HEADERS.filter(h => !populated.has(h));

console.log('\n=== Extraction Complete ===');
console.log(`Modules extracted: ${accessModules.length}`);
console.log(`Total questions:   ${totalQuestions}`);
console.log(`Output file:       ${outputFile}`);
console.log(`File size:         ${fileSize.toLocaleString()} bytes (${(fileSize / 1024).toFixed(1)} KB)`);

console.log('\n=== Questions per module ===');
for (const r of moduleQuestionCounts) {
  console.log(`  ${r.code.padEnd(6)} ${String(r.count).padStart(3)}q  ${r.name}`);
}

console.log('\n=== Columns never populated ===');
if (emptyColumns.length === 0) {
  console.log('  (all 40 columns have at least one value)');
} else {
  for (const c of emptyColumns) console.log(`  - ${c}`);
}

console.log('\n=== Group breakdown ===');
const byGroup = {};
for (const m of accessModules) {
  byGroup[m.group] = (byGroup[m.group] || 0) + (m.questions?.length || 0);
}
for (const [g, n] of Object.entries(byGroup)) {
  console.log(`  ${g.padEnd(28)} ${n}q`);
}
