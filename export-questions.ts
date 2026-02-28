import { accessModules, moduleGroups } from './src/data/accessModules';
import * as XLSX from 'xlsx';

const groupLabel = (groupId: string): string => {
  const g = moduleGroups.find((mg) => mg.id === groupId);
  return g ? g.label : groupId;
};

interface QuestionRow {
  'Module Code': string;
  'Module Name': string;
  'Group': string;
  'Question ID': string;
  'Question Text': string;
  'Help Text': string;
  'Type': string;
  'Review Mode': string;
  'Category': string;
  'Impact Level': string;
  'Compliance Level': string;
  'Compliance Ref': string;
  'Safety Related': string;
  'Optional': string;
  'Is Entry Point': string;
  'Show When (Question ID)': string;
  'Show When (Answers)': string;
  'Show When OR (Question ID)': string;
  'Show When OR (Answers)': string;
  'Options': string;
  'Option Sentiments': string;
  'Option Recommendations': string;
  'Describe Option IDs': string;
  'Describe Placeholder': string;
  'Summary (Help)': string;
  'Understanding': string;
  'Tips': string;
  'Partial Placeholder': string;
  'Summary Behavior': string;
  'Supports Evidence': string;
  'Evidence Types': string;
  'Evidence Hint': string;
  'Measurement Unit': string;
  'Measurement Guidance': string;
  'Media Analysis Type': string;
  'Media Analysis Hint': string;
}

const questionRows: QuestionRow[] = [];

for (const mod of accessModules) {
  const group = groupLabel(mod.group);
  for (const q of mod.questions) {
    const sw = q.showWhen;
    const or0 = sw?.orConditions?.[0];

    let measurementGuidance = '';
    const mg = (q as any).measurementGuidance;
    if (mg) {
      const parts: string[] = [];
      if (mg.ideal != null) parts.push(`Ideal: ${mg.ideal}`);
      if (mg.min != null) parts.push(`Min: ${mg.min}`);
      if (mg.max != null) parts.push(`Max: ${mg.max}`);
      if (mg.interpretation) parts.push(`Interpretation: ${mg.interpretation}`);
      measurementGuidance = parts.join('; ');
    }

    questionRows.push({
      'Module Code': mod.code,
      'Module Name': mod.name,
      'Group': group,
      'Question ID': q.id,
      'Question Text': q.text,
      'Help Text': q.helpText ?? '',
      'Type': q.type,
      'Review Mode': q.reviewMode ?? '',
      'Category': q.category ?? '',
      'Impact Level': q.impactLevel ?? '',
      'Compliance Level': q.complianceLevel ?? '',
      'Compliance Ref': q.complianceRef ?? '',
      'Safety Related': q.safetyRelated ? 'Yes' : '',
      'Optional': q.optional ? 'Yes' : '',
      'Is Entry Point': q.isEntryPoint ? 'Yes' : '',
      'Show When (Question ID)': sw?.questionId ?? '',
      'Show When (Answers)': sw?.answers?.join(', ') ?? '',
      'Show When OR (Question ID)': or0?.questionId ?? '',
      'Show When OR (Answers)': or0?.answers?.join(', ') ?? '',
      'Options': q.options?.map((o) => `${o.id}: ${o.label}`).join('\n') ?? '',
      'Option Sentiments': q.options?.filter((o) => o.sentiment).map((o) => `${o.id}: ${o.sentiment}`).join('\n') ?? '',
      'Option Recommendations': q.options?.filter((o) => o.recommendation).map((o) => `${o.id}: ${o.recommendation}`).join('\n') ?? '',
      'Describe Option IDs': q.describeOptionIds?.join(', ') ?? '',
      'Describe Placeholder': q.describePlaceholder ?? '',
      'Summary (Help)': q.helpContent?.summary ?? '',
      'Understanding': q.helpContent?.understanding?.join('\n') ?? '',
      'Tips': q.helpContent?.tips?.join('\n') ?? '',
      'Partial Placeholder': q.partialPlaceholder ?? '',
      'Summary Behavior': q.summaryBehavior ?? '',
      'Supports Evidence': q.supportsEvidence ? 'Yes' : '',
      'Evidence Types': q.evidenceTypes?.join(', ') ?? '',
      'Evidence Hint': (q as any).evidenceHint ?? '',
      'Measurement Unit': q.measurementUnit ?? '',
      'Measurement Guidance': measurementGuidance,
      'Media Analysis Type': (q as any).mediaAnalysisType ?? '',
      'Media Analysis Hint': (q as any).mediaAnalysisHint ?? '',
    });
  }
}

interface ModuleRow {
  'Code': string;
  'Name': string;
  'Group': string;
  'Description': string;
  'Total Questions': number;
  'Pulse Check Qs': number;
  'Deep Dive Qs': number;
  'Mandatory Qs': number;
  'Est. Time (Pulse)': number;
  'Est. Time (Deep Dive)': string;
  'Universal': string;
  'Universal Reason': string;
}

const moduleRows: ModuleRow[] = accessModules.map((mod) => {
  const pulseCount = mod.questions.filter(
    (q) => q.reviewMode === 'pulse-check' || q.reviewMode === 'both'
  ).length;
  const deepCount = mod.questions.filter(
    (q) => q.reviewMode === 'deep-dive'
  ).length;
  const mandatoryCount = mod.questions.filter(
    (q) => q.complianceLevel === 'mandatory'
  ).length;

  return {
    'Code': mod.code,
    'Name': mod.name,
    'Group': groupLabel(mod.group),
    'Description': mod.description,
    'Total Questions': mod.questions.length,
    'Pulse Check Qs': pulseCount,
    'Deep Dive Qs': deepCount,
    'Mandatory Qs': mandatoryCount,
    'Est. Time (Pulse)': mod.estimatedTime,
    'Est. Time (Deep Dive)': mod.estimatedTimeDeepDive != null ? String(mod.estimatedTimeDeepDive) : '',
    'Universal': mod.isUniversal ? 'Yes' : '',
    'Universal Reason': mod.universalReason ?? '',
  };
});

const wb = XLSX.utils.book_new();

const ws1 = XLSX.utils.json_to_sheet(questionRows);
XLSX.utils.book_append_sheet(wb, ws1, 'All Questions');

const ws2 = XLSX.utils.json_to_sheet(moduleRows);
XLSX.utils.book_append_sheet(wb, ws2, 'Modules');

const filename = 'access-compass-questions.xlsx';
XLSX.writeFile(wb, filename);

console.log(`Exported ${questionRows.length} questions across ${moduleRows.length} modules to ${filename}`);
