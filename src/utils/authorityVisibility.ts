/**
 * What a program host can see about an individual participant, and what it
 * cannot.
 *
 * One definition, stated to both sides. The authority-facing summary renders it
 * so the host understands the limits of what it is reading, and the enrolment
 * screen shows the participant the same list before they agree to join.
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

/** Shown to both the host and the participant, worded for the participant. */
export const AUTHORITY_CAN_SEE: readonly string[] = [
  'Your enrolment status, and the dates you start and finish',
  'Which of the required modules you have completed',
  'A summary of your strengths and the opportunities your assessment identifies',
];

export const AUTHORITY_CANNOT_SEE: readonly string[] = [
  'Your individual answers to any question',
  'Photos, documents or other evidence you upload',
  'Your action plan, or how far through it you are',
  'Anything in the employment and staff training modules',
];

export function isHiddenFromAuthority(moduleId: string): boolean {
  return AUTHORITY_HIDDEN_MODULE_IDS.includes(moduleId);
}
