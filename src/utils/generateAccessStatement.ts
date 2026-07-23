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
  /** The venue's own note explaining a partial answer (its exact words). */
  note?: string;
  /** Set by applyOverrides so the edit UI can target a generated feature. */
  refKey?: string;
}

export interface ProfileSection {
  id?: string;
  heading?: string;
  text: string;
  /** Category id this section renders under, or 'general' (rendered at the end). */
  placement?: string;
}

export interface ProfileBlock {
  id: string;
  title: string;
  intro: string;
  leadIn: string;
  bullets: string[];
  /** The venue's own notes for partial features (the "Good to know" callout). */
  notes: string[];
  sections: ProfileSection[];
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
  /** A warm one-line intro of what to expect. */
  intro: string;
  /** A varied lead-in phrase before the bullet list. */
  leadIn: string;
  /** In-place features as concise bullet points. */
  bullets: string[];
  /** The venue's own notes for partial features (the "Good to know" callout). */
  notes: string[];
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
  // Fully-present answers are shown as in place. Partial answers keep their
  // positive element but are shown as "working on". "No" answers are omitted.
  // Everything still flows to the internal report and DIAP.
  let present = false;
  let partial = false;
  let partialNote: string | undefined;
  const matchedLabels: string[] = [];

  for (const qid of def.yesNo ?? []) {
    const r = responseByQuestion.get(qid);
    if (!r) continue;
    if (r.answer === 'yes') { present = true; continue; }
    if (r.answer === 'partially') {
      partial = true;
      if (!partialNote) partialNote = r.partialDescription?.trim() || r.notes?.trim() || undefined;
      continue;
    }
    if (r.answer) continue; // 'no' / 'unable-to-check' are omitted
    // Some questions mapped here are single/multi-select; grade the selection.
    if (r.multiSelectValues && r.multiSelectValues.length > 0) {
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
  }

  if (present) {
    const detail = Array.from(new Set(matchedLabels)).slice(0, 2).join(', ') || undefined;
    return { label: def.label, phrase: def.phrase, state: 'yes', detail };
  }
  if (partial) return { label: def.label, phrase: def.phrase, state: 'partial', note: partialNote };
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

function phraseOf(f: StatementFeature): string {
  return f.phrase || lowerFirst(f.label);
}

// A warm one-line intro for each category, so a section opens with a welcome
// before the scannable bullet list.
const CATEGORY_INTROS: Record<string, string> = {
  planning: "A little planning goes a long way, so here's what you can sort out before you arrive.",
  'getting-there': 'Getting here is straightforward, whether you drive or come by public transport.',
  'getting-in': "We've worked to make coming through the door easy.",
  inside: "There's room to move around comfortably once you're inside.",
  toilets: 'Accessible facilities are available on site.',
  seating: 'There are seating options to suit different needs, with clear views of the stage.',
  sensory: "We've thought about comfort for a range of sensory needs.",
  'hearing-comms': 'Support is on hand so everyone can follow along.',
  service: 'Our team is here to help, and a few extras make your visit easier.',
};

// Varied lead-ins so no two sections open the same way.
const LEAD_INS = ["You'll find:", 'Features include:', 'Available at the venue:', 'You can expect:', "Here's what's on hand:", 'On offer:'];

export function buildAccessProfileProse(statement: AccessStatement): ProseSection[] {
  const sections: ProseSection[] = [];
  let index = 0;
  for (const cat of statement.categories) {
    const bullets = cat.features.filter((f) => f.state === 'yes').map((f) => f.label);
    // Partial features carry the venue's own note (its exact words). Fall back
    // to a plain "in some areas" line only if a note is somehow missing.
    const notes = cat.features
      .filter((f) => f.state === 'partial')
      .map((f) => {
        const n = f.note?.trim();
        if (n) return n;
        const p = phraseOf(f);
        return `${p.charAt(0).toUpperCase()}${p.slice(1)} is available in some areas.`;
      });
    if (bullets.length === 0 && notes.length === 0) continue;
    sections.push({
      id: cat.id,
      title: cat.title,
      intro: CATEGORY_INTROS[cat.id] || '',
      leadIn: LEAD_INS[index % LEAD_INS.length],
      bullets,
      notes,
    });
    index += 1;
  }
  return sections;
}

/**
 * Lay out the profile for rendering: each category with its prose and any custom
 * sections placed under it, in canonical order, plus general sections for the end.
 */
export function buildAccessProfileLayout(statement: AccessStatement): {
  categories: ProfileBlock[];
  general: ProfileSection[];
} {
  const proseById = new Map(buildAccessProfileProse(statement).map((p) => [p.id, p]));
  const titleById = new Map(ACCESS_STATEMENT_CATEGORIES.map((c) => [c.id, c.title]));
  const catIds = ACCESS_STATEMENT_CATEGORIES.map((c) => c.id);
  const sections = statement.sections ?? [];

  const categories: ProfileBlock[] = [];
  for (const cid of catIds) {
    const p = proseById.get(cid);
    const secs = sections.filter((s) => s.placement === cid);
    if (!p && secs.length === 0) continue;
    categories.push({
      id: cid,
      title: titleById.get(cid) || cid,
      intro: p?.intro || '',
      leadIn: p?.leadIn || '',
      bullets: p?.bullets ?? [],
      notes: p?.notes ?? [],
      sections: secs,
    });
  }
  const general = sections.filter((s) => !s.placement || s.placement === 'general' || !catIds.includes(s.placement));
  return { categories, general };
}

export function accessProfileIntro(venueName: string): string {
  return `${venueName} is committed to a welcoming and accessible experience for every visitor. Here is what is in place today.`;
}

export function accessProfileClosing(venueName: string): string {
  return `This profile is self-reported and updated as ${venueName} keeps improving access. Anything shown as "working on" is in progress. Please check it for accuracy before sharing it publicly. If you have an access need that is not covered here, please get in touch before your visit so we can help.`;
}

export function serializeAccessStatementText(statement: AccessStatement): string {
  const venue = statement.organisationName;
  const date = new Date(statement.generatedAt).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  let out = `${venue}\nAccessibility profile\n\n${accessProfileIntro(venue)}\nSelf-reported as of ${date}.\n`;
  const layout = buildAccessProfileLayout(statement);
  for (const b of layout.categories) {
    out += `\n${b.title}\n`;
    if (b.intro) out += `${b.intro}\n`;
    if (b.bullets.length > 0) {
      if (b.leadIn) out += `${b.leadIn}\n`;
      for (const bl of b.bullets) out += `- ${bl}\n`;
    }
    if (b.notes.length > 0) {
      out += 'Good to know:\n';
      for (const n of b.notes) out += `- ${n}\n`;
    }
    for (const s of b.sections) out += `${s.heading?.trim() ? `${s.heading.trim()}\n` : ''}${s.text.trim()}\n`;
  }
  for (const s of layout.general) {
    out += `\n${s.heading?.trim() || 'More information'}\n${s.text.trim()}\n`;
  }
  out += `\n${accessProfileClosing(venue)}\n\nPrepared with Access Compass.`;
  return out;
}
