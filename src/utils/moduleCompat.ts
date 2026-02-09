/**
 * Module ID Backward Compatibility
 *
 * Maps old letter-based module codes (A1, B2, etc.) to new numbered codes (2.1, 3.5, etc.)
 * and migrates localStorage data from old format to new format.
 */

const MODULE_CODE_MAP: Record<string, string> = {
  'B1': '1.1', 'B4.1': '1.2', 'B4.2': '1.3', 'B4.3': '1.4', 'B5': '1.5', 'B6': '1.6',
  'A1': '2.1', 'A2': '2.2', 'A3': '2.3', 'A3a': '2.3', 'A3b': '2.4',
  'A4': '3.1', 'A5': '3.2', 'A6': '3.3', 'A6a': '3.4', 'B2': '3.5', 'B3': '3.6', 'D1': '3.7',
  'S1': '4.1', 'C1': '4.2', 'C2': '4.3', 'A7': '4.4', 'C3': '4.5', 'C4': '4.6', 'S5': '4.7',
  'P1': '5.1', 'P2': '5.2', 'P3': '5.3', 'P4': '5.4', 'P5': '5.5',
  'E1': '6.1', 'E2': '6.2', 'E3': '6.3', 'E4': '6.4', 'E5': '6.5',
};

// Sorted longest-first to avoid partial matches (B4.1 before B4, A3a before A3, etc.)
const SORTED_OLD_CODES = Object.keys(MODULE_CODE_MAP).sort((a, b) => b.length - a.length);

/** Normalize a single module code from old to new format */
export function normalizeModuleCode(code: string): string {
  return MODULE_CODE_MAP[code] || code;
}

/** Normalize a question ID by replacing its old module prefix with the new one */
function normalizeQuestionId(questionId: string): string {
  for (const oldCode of SORTED_OLD_CODES) {
    if (questionId.startsWith(oldCode + '-')) {
      return MODULE_CODE_MAP[oldCode] + questionId.slice(oldCode.length);
    }
  }
  return questionId;
}

const MIGRATION_FLAG = 'access_compass_module_migration_v1';

/**
 * One-time migration of localStorage data from old module IDs to new ones.
 * Call this before the app renders. Safe to call multiple times (idempotent).
 */
export function migrateModuleIds(): void {
  if (localStorage.getItem(MIGRATION_FLAG)) return;

  try {
    migrateSession();
    migrateDiscovery();
    migrateProgress();
    migrateDIAP();
    localStorage.setItem(MIGRATION_FLAG, new Date().toISOString());
  } catch (err) {
    console.error('[moduleCompat] Migration error:', err);
  }
}

function migrateSession(): void {
  const raw = localStorage.getItem('access_compass_session');
  if (!raw) return;

  const session = JSON.parse(raw);
  let changed = false;

  if (Array.isArray(session.selected_modules)) {
    const normalized = session.selected_modules.map((code: string) => {
      const newCode = normalizeModuleCode(code);
      if (newCode !== code) changed = true;
      return newCode;
    });
    if (changed) {
      session.selected_modules = normalized;
    }
  }

  if (changed) {
    session.last_updated = new Date().toISOString();
    localStorage.setItem('access_compass_session', JSON.stringify(session));
  }
}

function migrateDiscovery(): void {
  const raw = localStorage.getItem('access_compass_discovery');
  if (!raw) return;

  const discovery = JSON.parse(raw);
  let changed = false;

  if (Array.isArray(discovery.recommended_modules)) {
    const normalized = discovery.recommended_modules.map((code: string) => {
      const newCode = normalizeModuleCode(code);
      if (newCode !== code) changed = true;
      return newCode;
    });
    if (changed) {
      discovery.recommended_modules = normalized;
    }
  }

  if (changed) {
    localStorage.setItem('access_compass_discovery', JSON.stringify(discovery));
  }
}

function migrateProgress(): void {
  const raw = localStorage.getItem('access_compass_module_progress');
  if (!raw) return;

  const progress = JSON.parse(raw);
  const migrated: Record<string, unknown> = {};
  let changed = false;

  for (const [key, value] of Object.entries(progress)) {
    const newKey = normalizeModuleCode(key);
    const entry = value as Record<string, unknown>;

    if (newKey !== key) {
      changed = true;
      entry.moduleId = newKey;
      entry.moduleCode = newKey;
    }

    // Migrate question IDs in responses
    if (Array.isArray(entry.responses)) {
      entry.responses = entry.responses.map((r: Record<string, unknown>) => {
        if (typeof r.questionId === 'string') {
          const newQId = normalizeQuestionId(r.questionId);
          if (newQId !== r.questionId) {
            changed = true;
            return { ...r, questionId: newQId };
          }
        }
        return r;
      });
    }

    // Migrate question IDs in runs
    if (Array.isArray(entry.runs)) {
      entry.runs = (entry.runs as Array<Record<string, unknown>>).map(run => {
        if (Array.isArray(run.responses)) {
          const migratedResponses = run.responses.map((r: Record<string, unknown>) => {
            if (typeof r.questionId === 'string') {
              const newQId = normalizeQuestionId(r.questionId);
              if (newQId !== r.questionId) {
                changed = true;
                return { ...r, questionId: newQId };
              }
            }
            return r;
          });
          return { ...run, responses: migratedResponses };
        }
        return run;
      });
    }

    migrated[newKey] = entry;
  }

  if (changed) {
    localStorage.setItem('access_compass_module_progress', JSON.stringify(migrated));
  }
}

function migrateDIAP(): void {
  const raw = localStorage.getItem('access_compass_diap_items');
  if (!raw) return;

  const items = JSON.parse(raw);
  if (!Array.isArray(items)) return;

  let changed = false;
  const migrated = items.map((item: Record<string, unknown>) => {
    let itemChanged = false;

    if (typeof item.moduleSource === 'string') {
      const newCode = normalizeModuleCode(item.moduleSource);
      if (newCode !== item.moduleSource) {
        item = { ...item, moduleSource: newCode };
        itemChanged = true;
      }
    }

    if (typeof item.questionSource === 'string') {
      const newQId = normalizeQuestionId(item.questionSource);
      if (newQId !== item.questionSource) {
        item = { ...item, questionSource: newQId };
        itemChanged = true;
      }
    }

    if (itemChanged) changed = true;
    return item;
  });

  if (changed) {
    localStorage.setItem('access_compass_diap_items', JSON.stringify(migrated));
  }
}
