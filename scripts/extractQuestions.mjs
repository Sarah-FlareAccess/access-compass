import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the source file
const sourceFile = join(__dirname, '..', 'src', 'data', 'accessModules.ts');
const content = readFileSync(sourceFile, 'utf-8');

// Group labels mapping
const groupLabels = {
  'before-arrival': 'Before Arrival',
  'getting-in': 'Getting In',
  'during-visit': 'During Visit',
  'service-support': 'Service & Support'
};

// Find all module definitions with their positions
const moduleRegex = /\{\s*\n\s*id:\s*'([^']+)',\s*\n\s*code:\s*'([^']+)',\s*\n\s*name:\s*'([^']+)',\s*\n\s*description:\s*'[^']*',\s*\n\s*group:\s*'([^']+)'/g;

let modulePositions = [];
let match;
while ((match = moduleRegex.exec(content)) !== null) {
  modulePositions.push({
    id: match[1],
    code: match[2],
    name: match[3],
    group: match[4],
    position: match.index
  });
}

console.log(`Found ${modulePositions.length} modules`);

// Find all questions - look for the pattern: { id: 'XXX', text: '...' ... reviewMode: '...' }
// We need to capture the full question block to extract all fields
const allQuestions = [];

// Split content into question blocks by finding each { id: pattern
const questionStartRegex = /\{\s*\n?\s*id:\s*'([A-Z0-9]+-[A-Z0-9a-z-]+)'/g;
let questionStarts = [];

while ((match = questionStartRegex.exec(content)) !== null) {
  // Skip module IDs (they don't have hyphens followed by letters/numbers in the same pattern)
  const id = match[1];
  if (id.includes('-')) {
    questionStarts.push({
      id: id,
      position: match.index
    });
  }
}

console.log(`Found ${questionStarts.length} potential questions`);

// For each question, extract its properties
for (const qStart of questionStarts) {
  // Find the end of this question block (next question or end of questions array)
  const startPos = qStart.position;

  // Extract a chunk of content starting from this question (enough to capture all fields)
  const chunk = content.substring(startPos, startPos + 3000);

  // Find the closing brace for this question (accounting for nested braces)
  let braceCount = 0;
  let endPos = 0;
  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i] === '{') braceCount++;
    if (chunk[i] === '}') {
      braceCount--;
      if (braceCount === 0) {
        endPos = i + 1;
        break;
      }
    }
  }

  const questionBlock = chunk.substring(0, endPos);

  // Extract fields from the question block
  const idMatch = questionBlock.match(/id:\s*'([^']+)'/);
  const textMatch = questionBlock.match(/text:\s*'((?:[^'\\]|\\.)*)'/);
  const helpTextMatch = questionBlock.match(/helpText:\s*'((?:[^'\\]|\\[\s\S])*)'/);
  const reviewModeMatch = questionBlock.match(/reviewMode:\s*'([^']+)'/);
  const impactLevelMatch = questionBlock.match(/impactLevel:\s*'([^']+)'/);

  if (!idMatch || !textMatch || !reviewModeMatch || !impactLevelMatch) {
    console.log(`Skipping incomplete question at position ${startPos}: ${idMatch?.[1] || 'unknown'}`);
    continue;
  }

  const qId = idMatch[1];
  const qText = textMatch[1].replace(/\\'/g, "'").replace(/\\n/g, ' ');
  const helpText = helpTextMatch ? helpTextMatch[1].replace(/\\'/g, "'").replace(/\\n/g, ' ').substring(0, 500) : '';
  const reviewMode = reviewModeMatch[1];
  const impactLevel = impactLevelMatch[1];

  // Find which module this question belongs to
  let belongsToModule = null;
  for (let i = modulePositions.length - 1; i >= 0; i--) {
    if (startPos > modulePositions[i].position) {
      belongsToModule = modulePositions[i];
      break;
    }
  }

  if (belongsToModule) {
    allQuestions.push({
      group: groupLabels[belongsToModule.group] || belongsToModule.group,
      moduleCode: belongsToModule.code,
      moduleName: belongsToModule.name,
      questionId: qId,
      reviewMode: reviewMode === 'pulse-check' ? 'Pulse Check' : 'Deep Dive',
      impactLevel: impactLevel,
      questionText: qText,
      helpText: helpText
    });
  } else {
    console.log(`Could not find module for question ${qId}`);
  }
}

// Sort by group order, then module code
const groupOrder = ['Before Arrival', 'Getting In', 'During Visit', 'Service & Support'];
allQuestions.sort((a, b) => {
  const groupDiff = groupOrder.indexOf(a.group) - groupOrder.indexOf(b.group);
  if (groupDiff !== 0) return groupDiff;
  return a.moduleCode.localeCompare(b.moduleCode);
});

// Generate CSV
const escapeCSV = (str) => {
  if (!str) return '';
  // If contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
};

const headers = ['Group', 'Module Code', 'Module Name', 'Question ID', 'Review Mode', 'Impact Level', 'Question Text', 'Helper Text'];
const csvLines = [headers.join(',')];

for (const q of allQuestions) {
  const row = [
    escapeCSV(q.group),
    escapeCSV(q.moduleCode),
    escapeCSV(q.moduleName),
    escapeCSV(q.questionId),
    escapeCSV(q.reviewMode),
    escapeCSV(q.impactLevel),
    escapeCSV(q.questionText),
    escapeCSV(q.helpText)
  ];
  csvLines.push(row.join(','));
}

const outputPath = join(__dirname, '..', 'AccessCompass_Questions_Reference.csv');
writeFileSync(outputPath, csvLines.join('\n'), 'utf-8');

// Print summary
const pulseCount = allQuestions.filter(q => q.reviewMode === 'Pulse Check').length;
const deepCount = allQuestions.filter(q => q.reviewMode === 'Deep Dive').length;

console.log('\n=== Extraction Complete ===');
console.log(`Total questions: ${allQuestions.length}`);
console.log(`Pulse Check: ${pulseCount}`);
console.log(`Deep Dive: ${deepCount}`);
console.log(`\nOutput saved to: ${outputPath}`);

// Print by module
console.log('\n=== Questions by Module ===');
const byModule = {};
for (const q of allQuestions) {
  const key = `${q.moduleCode} - ${q.moduleName}`;
  if (!byModule[key]) byModule[key] = { pulse: 0, deep: 0 };
  if (q.reviewMode === 'Pulse Check') byModule[key].pulse++;
  else byModule[key].deep++;
}

for (const [mod, counts] of Object.entries(byModule)) {
  console.log(`${mod}: ${counts.pulse} Pulse, ${counts.deep} Deep (${counts.pulse + counts.deep} total)`);
}
