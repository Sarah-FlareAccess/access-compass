/**
 * Parse a stored `multi_select_values` value into a string[] of option ids.
 *
 * The column is jsonb, so a cloud read via supabase-js returns an array already,
 * while the app's own writes store a JSON string. Both must round-trip so single
 * and multi select answers survive a cloud reload, not just yes/no answers.
 * Returns undefined for null, empty, or malformed values.
 */
export function parseStoredMultiSelect(value: unknown): string[] | undefined {
  if (Array.isArray(value)) return value as string[];
  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as string[]) : undefined;
    } catch {
      return undefined;
    }
  }
  return undefined;
}
