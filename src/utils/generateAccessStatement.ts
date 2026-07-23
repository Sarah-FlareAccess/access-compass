/**
 * Access Statement generator
 *
 * Turns an organisation's module responses into a customer-facing Access Profile,
 * then composes it as warm, flowing copy (not a Yes/No list). Per product
 * decision, only features in place (Yes) or partly in place (Partial) appear.
 * "No" and unanswered features are omitted so nothing reads as a failing.
 */

import type { ModuleProgress, QuestionResponse } from '../hooks/useModuleProgress';
import { accessModules } from '../data/accessModules';
import { ACCESS_STATEMENT_CATEGORIES, type FeatureDef } from '../data/accessStatementFeatures';

export interface StatementFeature {
  label: string;
  state: 'yes' | 'partial';
  detail?: string;
  /** Warm mid-sentence fragment for composed copy. */
  phrase?: string;
  /** Set by applyOverrides so the edit UI can target a generated feature. */
  refKey?: string;
}

export interface ProfileSection {
  heading?: string;
  text: string;
}

export interface StatementCategory {
  id: string;
  title: string;
  lead?: string;
  features: StatementFeature[];
}

export interface AccessStatement {
  organisationName: string;
  generatedAt: string;
  categories: StatementCategory[];
  featureCount: number;
  /** Free-text sections the venue added (applied by applyOverrides). */
  sections?: ProfileSection[];
}

export interface ProseSection {
  id: string;
  title: string;
  paragraph: string;
}

/** questionId -> (optionId -> label). */
function buildOptionLabelIndex(): Map<string, Map<string, string>> {
  const index = new Map<string, Map<string, string>>();
  for (const mod of accessModules) {
    for (const q of mod.questions) {
      if (!q.options || q.options.length === 0) continue;
      const opts = new Map<string, string>();
      for (const opt of q.options) opts.set(opt.id, opt.label);
      index.set(q.id, opts);
    }
  }
  return index;
}

/** questionId -> (optionId -> sentiment), for grading select-type answers. */
function buildOptionSentimentIndex(): Map<string, Map<string, string>> {
  const index = new Map<string, Map<string, string>>();
  for (const mod of accessModules) {
    for (const q of mod.questions) {
      if (!q.options || q.options.length === 0) continue;
      const opts = new Map<string, string>();
      for (const opt of q.options) if (opt.sentiment) opts.set(opt.id, opt.sentiment);
      if (opts.size > 0) index.set(q.id, opts);
    }
  }
  return index;
}

/**
 * Grade the options selected for a single/multi-select answer, so a question
 * whose answer lives in multiSelectValues (not `answer`) is read correctly.
 * The question's own option sentiment wins; otherwise infer conservatively.
 */
function gradeSelectedOptions(
  questionId: string,
  values: string[],
  sentiments: Map<string, Map<string, string>>,
): 'positive' | 'neutral' | 'negative' | null {
  const map = sentiments.get(questionId);
  let pos = false;
  let neu = false;
  let neg = false;
  for (const v of values) {
    const s = map?.get(v);
    if (s === 'positive') pos = true;
    else if (s === 'negative') neg = true;
    else if (s === 'neutral') neu = true;
    else if (/^yes/i.test(v)) pos = true;
    else if (/^(no|none)$|not-applicable|^na$/i.test(v)) neg = true;
    else neu = true;
  }
  if (pos) return 'positive';
  if (neu) return 'neutral';
  if (neg) return 'negative';
  return null;
}

function resolveFeature(
  def: FeatureDef,
  responseByQuestion: Map<string, QuestionResponse>,
  optionLabels: Map<string, Map<string, string>>,
  optionSentiments: Map<string, Map<string, string>>,
): StatementFeature | null {
  let present = false;
  let partial = false;
  let partialDetail: string | undefined;
  const matchedLabels: string[] = [];

  for (const qid of def.yesNo ?? []) {
    const r = responseByQuestion.get(qid);
    if (!r) continue;
    if (r.answer === 'yes') { present = true; continue; }
    if (r.answer === 'partially') {
      partial = true;
      if (!partialDetail) partialDetail = r.partialDescription?.trim() || r.notes?.trim() || undefined;
      continue;
    }
    // Some questions mapped here are actually single/multi-select and store the
    // answer in multiSelectValues. Grade the selected options so they count too.
    if (!r.answer && r.multiSelectValues && r.multiSelectValues.length > 0) {
      const graded = gradeSelectedOptions(qid, r.multiSelectValues, optionSentiments);
      if (graded === 'positive') present = true;
      else if (graded === 'neutral') partial = true;
    }
  }

  for (const match of def.options ?? []) {
    const values = responseByQuestion.get(match.questionId)?.multiSelectValues ?? [];
    const hits = match.anyOf.filter((id) => values.includes(id));
    if (hits.length > 0) {
      present = true;
      for (const id of hits) {
        const label = optionLabels.get(match.questionId)?.get(id);
        if (label) matchedLabels.push(label);
      }
    }
  }

  for (const qid of def.yesOption ?? []) {
    const values = responseByQuestion.get(qid)?.multiSelectValues ?? [];
    if (values.some((v) => /^yes/i.test(v))) present = true;
    else if (values.some((v) => /partial|limited|request|some/i.test(v))) partial = true;
  }

  if (present) {
    const detail = Array.from(new Set(matchedLabels)).slice(0, 2).join(', ') || undefined;
    return { label: def.label, phrase: def.phrase, state: 'yes', detail };
  }
  if (partial) return { label: def.label, phrase: def.phrase, state: 'partial', detail: partialDetail };
  return null;
}

export function generateAccessStatement(
  progress: Record<string, ModuleProgress>,
  organisationName: string,
): AccessStatement {
  const responseByQuestion = new Map<string, QuestionResponse>();
  for (const mod of Object.values(progress)) {
    for (const r of mod.responses ?? []) responseByQuestion.set(r.questionId, r);
  }

  const optionLabels = buildOptionLabelIndex();
  const optionSentiments = buildOptionSentimentIndex();
  const categories: StatementCategory[] = [];
  let featureCount = 0;

  for (const cat of ACCESS_STATEMENT_CATEGORIES) {
    const features: StatementFeature[] = [];
    for (const def of cat.features) {
      const feature = resolveFeature(def, responseByQuestion, optionLabels, optionSentiments);
      if (feature) features.push(feature);
    }
    if (features.length > 0) {
      categories.push({ id: cat.id, title: cat.title, lead: cat.lead, features });
      featureCount += features.length;
    }
  }

  return { organisationName, generatedAt: new Date().toISOString(), categories, featureCount };
}

function lowerFirst(s: string): string {
  return s ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

/** Join without an Oxford comma: "a", "a and b", "a, b and c". */
function humanJoin(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

function phraseOf(f: StatementFeature): string {
  return f.phrase || lowerFirst(f.label);
}

/** Compose each category as a warm paragraph from its features. */
export function buildAccessProfileProse(statement: AccessStatement): ProseSection[] {
  return statement.categories
    .map((cat) => {
      const lead = cat.lead || cat.title;
      const yes = cat.features.filter((f) => f.state === 'yes').map(phraseOf);
      const partial = cat.features.filter((f) => f.state === 'partial').map(phraseOf);
      let paragraph = '';
      if (yes.length > 0) {
        if (yes.length <= 3) {
          paragraph = `${lead}, you'll find ${humanJoin(yes)}.`;
        } else {
          // Split a long list into two sentences so it reads naturally.
          const half = Math.ceil(yes.length / 2);
          paragraph = `${lead}, you'll find ${humanJoin(yes.slice(0, half))}. You'll also find ${humanJoin(yes.slice(half))}.`;
        }
        if (partial.length > 0) {
          paragraph += ` Some features are partly in place, including ${humanJoin(partial)}.`;
        }
      } else if (partial.length > 0) {
        paragraph = `${lead}, some features are partly in place, including ${humanJoin(partial)}.`;
      }
      return { id: cat.id, title: cat.title, paragraph };
    })
    .filter((s) => s.paragraph.length > 0);
}

export function accessProfileIntro(venueName: string): string {
  return `${venueName} is committed to a welcoming and accessible experience for every visitor. Here is what is in place today.`;
}

export function accessProfileClosing(venueName: string): string {
  return `This profile is self-reported and updated as ${venueName} keeps improving access. Features described as partly in place are being worked on. If you have an access need that is not covered here, please get in touch before your visit so we can help.`;
}

export function serializeAccessStatementText(statement: AccessStatement): string {
  const venue = statement.organisationName;
  const date = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  let out = `${venue}\nAccessibility profile\n\n${accessProfileIntro(venue)}\nSelf-reported as of ${date}.\n`;
  for (const section of buildAccessProfileProse(statement)) {
    out += `\n${section.title}\n${section.paragraph}\n`;
  }
  for (const s of statement.sections ?? []) {
    out += `\n${s.heading?.trim() || 'More information'}\n${s.text.trim()}\n`;
  }
  out += `\n${accessProfileClosing(venue)}\n\nPrepared with Access Compass.`;
  return out;
}
