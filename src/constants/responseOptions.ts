/**
 * Response Options Constants
 *
 * Standardized response options for all yes-no questions.
 * These are non-negotiable and must be used consistently across the product.
 *
 * Layout:
 * - 4 main options in a 2x2 grid: Yes, Partially, No, Unable to check
 * - 1 secondary option below: Not applicable
 */

// The 5 standardized response options
export const RESPONSE_OPTIONS = ['yes', 'partially', 'no', 'unable-to-check', 'not-applicable'] as const;

// The 4 main options (displayed in 2x2 grid)
export const MAIN_RESPONSE_OPTIONS = ['yes', 'partially', 'no', 'unable-to-check'] as const;

// TypeScript type derived from the constant
export type ResponseOption = typeof RESPONSE_OPTIONS[number];

// Response option labels for UI display
export const RESPONSE_LABELS: Record<ResponseOption, string> = {
  'yes': 'Yes',
  'partially': 'Partially',
  'no': 'No',
  'unable-to-check': 'Unable to check',
  'not-applicable': 'Not applicable',
};

// Response option descriptions (for internal logic and reporting)
export const RESPONSE_MEANINGS: Record<ResponseOption, string> = {
  'yes': 'The requirement is met or in place.',
  'partially': 'Some elements are in place, but coverage is incomplete or inconsistent.',
  'no': 'The requirement is not currently met.',
  'unable-to-check': 'The user cannot confidently confirm the answer at this time.',
  'not-applicable': 'This question does not apply to the organisation\'s situation.',
};

// Helper text for "Unable to check" (subtle, supportive)
export const UNABLE_TO_CHECK_HELPER =
  'Includes situations where you\'re not sure or don\'t have access to the information right now.';

// CSS class mappings for styling
export const RESPONSE_CSS_CLASSES: Record<ResponseOption, string> = {
  'yes': 'answer-yes',
  'partially': 'answer-partial',
  'no': 'answer-no',
  'unable-to-check': 'answer-unable',
  'not-applicable': 'answer-na',
};

// Validation helper
export function isValidResponse(value: string | null): value is ResponseOption {
  return value !== null && RESPONSE_OPTIONS.includes(value as ResponseOption);
}

// Check if response indicates a follow-up is needed
export function needsFollowUp(response: ResponseOption | null): boolean {
  return response === 'unable-to-check';
}

// Check if response is negative (for DIAP action generation)
export function isNegativeResponse(response: ResponseOption | null): boolean {
  return response === 'no';
}

// Check if response is positive
export function isPositiveResponse(response: ResponseOption | null): boolean {
  return response === 'yes';
}

// Check if response is partial
export function isPartialResponse(response: ResponseOption | null): boolean {
  return response === 'partially';
}

// Check if response is not applicable
export function isNotApplicableResponse(response: ResponseOption | null): boolean {
  return response === 'not-applicable';
}
