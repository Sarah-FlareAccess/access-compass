import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { accessModules, moduleGroups } from '../src/data/accessModules';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Group labels mapping
const groupLabels: Record<string, string> = {
  'before-arrival': 'Before Arrival',
  'getting-in': 'Getting In',
  'during-visit': 'During Visit',
  'service-support': 'Service & Support'
};

interface QuestionRow {
  group: string;
  moduleCode: string;
  moduleName: string;
  questionId: string;
  reviewMode: string;
  impactLevel: string;
  questionText: string;
  helpText: string;
}

const allQuestions: QuestionRow[] = [];

// Iterate through all modules and their questions
for (const module of accessModules) {
  for (const question of module.questions) {
    allQuestions.push({
      group: groupLabels[module.group] || module.group,
      moduleCode: module.code,
      moduleName: module.name,
      questionId: question.id,
      reviewMode: question.reviewMode === 'pulse-check' ? 'Pulse Check' : 'Deep Dive',
      impactLevel: question.impactLevel,
      questionText: question.text,
      helpText: (question.helpText || '').substring(0, 500)
    });
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
const escapeCSV = (str: string): string => {
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

console.log('=== Extraction Complete ===');
console.log(`Total questions: ${allQuestions.length}`);
console.log(`Pulse Check: ${pulseCount}`);
console.log(`Deep Dive: ${deepCount}`);
console.log(`\nOutput saved to: ${outputPath}`);

// Print by module
console.log('\n=== Questions by Module ===');
const byModule: Record<string, { pulse: number; deep: number }> = {};
for (const q of allQuestions) {
  const key = `${q.moduleCode} - ${q.moduleName}`;
  if (!byModule[key]) byModule[key] = { pulse: 0, deep: 0 };
  if (q.reviewMode === 'Pulse Check') byModule[key].pulse++;
  else byModule[key].deep++;
}

for (const [mod, counts] of Object.entries(byModule)) {
  console.log(`${mod}: ${counts.pulse} Pulse, ${counts.deep} Deep (${counts.pulse + counts.deep} total)`);
}
