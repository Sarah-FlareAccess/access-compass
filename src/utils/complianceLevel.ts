/**
 * Compliance level: one resolver, one label, used everywhere.
 *
 * Three defects this exists to fix, all found together on 2026-08-05:
 *
 * 1. FOLLOW-UPS CARRY NO LEVEL, AND MUST NOT INHERIT ONE. `1.2-1-1a` ("Where
 *    does keyboard access break down?") has no complianceLevel while its
 *    gating question `1.2-1-1` is an obligation, so one card showed two
 *    different badges.
 *
 *    Inheriting from the gating question was TRIED AND REVERTED on
 *    2026-08-05. In module 1.1 almost every follow-up gates off `1.1-F-1`,
 *    which is an obligation, so inheritance promoted the entire module to
 *    Compliance and High, including "Consider also adding: sensory
 *    considerations", which is plainly optional. Being gated by an obligation
 *    does not make a follow-up an obligation: most add something extra rather
 *    than diagnosing the same requirement, and only the authoring knows which.
 *
 *    So the mixed badge is left as-is. Where a follow-up genuinely restates
 *    its parent's requirement, the fix is to tag that question, not to infer
 *    it from branching. This resolver is kept because it re-derives the value
 *    from the question at read time, which is what makes an authoring
 *    correction reach a module that was assessed months ago.
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
  _allQuestions: readonly QuestionLike[],
): ComplianceLevel | undefined {
  return question?.complianceLevel as ComplianceLevel | undefined;
}
