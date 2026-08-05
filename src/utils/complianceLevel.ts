/**
 * Compliance level: one resolver, one label, used everywhere.
 *
 * Three defects this exists to fix, all found together on 2026-08-05:
 *
 * 1. FOLLOW-UPS INHERITED NOTHING. A diagnostic follow-up carries no
 *    complianceLevel of its own. `1.2-1-1` ("Can all website content be
 *    accessed using only a keyboard?") is mandatory; `1.2-1-1a` ("Where does
 *    keyboard access break down?") had no value at all. The same obligation
 *    then rendered as "Mandatory" and "Best practice" in a single card, which
 *    is indefensible in front of a reviewer. A follow-up now inherits from the
 *    question that gates it.
 *
 * 2. FOUR VALUES, TWO BRANCHES. The renderer tested
 *    `=== 'mandatory' ? 'Mandatory' : 'Best Practice'`, so the 16 questions
 *    authored as `dda-compliant` and the one authored as `wcag-aa` displayed
 *    as Best Practice. Those are legal obligations being shown as optional.
 *    The same test in priorityCalculation meant they could never escalate to
 *    high priority however they were answered.
 *
 * 3. "MANDATORY" OVERSTATED THE LAW. The DDA does not mandate specific
 *    actions, it prohibits discrimination. Labelling a copy task "Mandatory"
 *    invites a council lawyer to look for the statute, fail to find it, and
 *    then distrust every other badge in the report. "Compliance" is accurate
 *    across the DDA, the Premises Standards, AS 1428 and WCAG AA without
 *    asserting that a statute compels the specific action.
 */

export type ComplianceLevel = 'mandatory' | 'best-practice' | 'wcag-aa' | 'dda-compliant';

/** Values that represent an obligation rather than an improvement. */
const OBLIGATION: ReadonlySet<string> = new Set(['mandatory', 'wcag-aa', 'dda-compliant']);

export function isComplianceObligation(level?: string | null): boolean {
  return !!level && OBLIGATION.has(level);
}

/**
 * The badge text. Deliberately two labels, not four: a reader does not need to
 * know whether the underlying authoring said `mandatory` or `dda-compliant`,
 * only whether it is an obligation.
 */
export function complianceLabel(level?: string | null): 'Compliance' | 'Best practice' | null {
  if (!level) return null;
  return isComplianceObligation(level) ? 'Compliance' : 'Best practice';
}

/** Class suffix, so the badge keeps a stable two-way visual treatment. */
export function complianceBadgeClass(level?: string | null): string {
  return isComplianceObligation(level) ? 'obligation' : 'best-practice';
}

interface QuestionLike {
  id: string;
  complianceLevel?: string;
  showWhen?: { questionId: string };
  showWhenOr?: { questionId: string };
}

/**
 * Resolve the effective level for a question, walking up the showWhen chain
 * when the question carries none of its own. Depth-capped and cycle-guarded:
 * authored branching is shallow, and a malformed chain must not hang a report.
 */
export function resolveComplianceLevel(
  question: QuestionLike | undefined,
  allQuestions: readonly QuestionLike[],
): ComplianceLevel | undefined {
  if (!question) return undefined;
  if (question.complianceLevel) return question.complianceLevel as ComplianceLevel;

  const seen = new Set<string>([question.id]);
  let current = question;

  for (let depth = 0; depth < 5; depth++) {
    const parentId = current.showWhen?.questionId ?? current.showWhenOr?.questionId;
    if (!parentId || seen.has(parentId)) return undefined;
    seen.add(parentId);

    const parent = allQuestions.find(q => q.id === parentId);
    if (!parent) return undefined;
    if (parent.complianceLevel) return parent.complianceLevel as ComplianceLevel;
    current = parent;
  }
  return undefined;
}
