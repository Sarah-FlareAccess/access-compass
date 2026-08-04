/**
 * What a program host can see about an individual participant, and what it
 * cannot.
 *
 * One set of facts, two voices. The host reads the HOST_ lists on its own
 * screens; the participant reads the PARTICIPANT_ lists on the enrolment screen
 * before agreeing to join. Keep the two in step: they are deliberately adjacent
 * here so a change to one that is not mirrored is obvious in review.
 *
 * The boundary is enforced server-side rather than here:
 * get_program_cohort_summaries (supabase/migrations/029_program_reports.sql)
 * returns generated narrative only and never raw question responses. This file
 * is the honest description of that, plus the narrower module exclusion below.
 */

/**
 * Modules withheld from the host view because they describe individual staff
 * rather than the premises or the service. The public access profile already
 * excludes these for the same reason.
 *
 * 5.2 is employment and HR. 5.3 is staff training specifics.
 * Procurement (5.4) and plan modules are NOT excluded: they describe the
 * organisation, not a person, and a procurement program needs them.
 */
export const AUTHORITY_HIDDEN_MODULE_IDS: readonly string[] = ['5.2', '5.3'];

export const AUTHORITY_HIDDEN_REASON =
  'Modules covering employment and individual staff training are withheld from this view, because they describe people rather than the place.';

/* ------------------------------------------------------------------ */
/* Host voice: shown to the authority on the program and business pages */
/* ------------------------------------------------------------------ */

export const HOST_CAN_SEE: readonly string[] = [
  'Each business by name, its enrolment status and the dates it starts and finishes',
  'Which of the required modules it has completed',
  'A summary of its strengths and the opportunities its assessment identifies',
];

export const HOST_CANNOT_SEE: readonly string[] = [
  'Its individual answers to any question',
  'Photos, documents or other evidence it uploads',
  'Its action plan, or how far through it the business is',
  'Anything in the employment and staff training modules',
];

/* ------------------------------------------------------------------ */
/* Participant voice: shown on the enrolment screen, before they join   */
/* ------------------------------------------------------------------ */

export const PARTICIPANT_CAN_SEE: readonly string[] = [
  'Your enrolment status, and the dates you start and finish',
  'Which of the required modules you have completed',
  'A summary of your strengths and the opportunities your assessment identifies',
];

export const PARTICIPANT_CANNOT_SEE: readonly string[] = [
  'Your individual answers to any question',
  'Photos, documents or other evidence you upload',
  'Your action plan, or how far through it you are',
  'Anything in the employment and staff training modules',
];

/** One-line host-voice version, for places with no room for the full lists. */
export const AUTHORITY_VISIBILITY_SUMMARY =
  'You see each business by name with its status, its dates and a summary of strengths and opportunities. Individual answers, evidence and action plans stay private to the business.';

export function isHiddenFromAuthority(moduleId: string): boolean {
  return AUTHORITY_HIDDEN_MODULE_IDS.includes(moduleId);
}
