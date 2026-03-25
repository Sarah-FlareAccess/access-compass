/**
 * Cloud Sync Utility
 *
 * Provides offline-first data synchronisation between localStorage and Supabase.
 *
 * Pattern:
 * 1. WRITE: Save to localStorage immediately (never fails), then queue Supabase sync
 * 2. READ: Load from localStorage instantly, then fetch from Supabase and merge
 * 3. CONFLICT: Per-record timestamp comparison; newest wins
 * 4. OFFLINE: Full functionality via localStorage, sync queue persists across reloads
 */

import { supabase, isSupabaseEnabled } from './supabase';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// TYPES
// ============================================

export interface SyncState {
  isSyncing: boolean;
  lastSyncedAt: string | null;
  pendingChanges: number;
  error: string | null;
}

export interface ConflictInfo {
  localUpdatedAt: string;
  cloudUpdatedAt: string;
  deviceLabel: string | null;
  tableName: string;
}

export type ConflictResolution = 'use-local' | 'use-cloud' | 'merge';

// Pending sync operations stored in localStorage for offline resilience
interface PendingSyncOp {
  id: string;
  table: string;
  operation: 'upsert' | 'delete';
  data: Record<string, unknown>;
  filters?: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

const SYNC_QUEUE_KEY = 'access_compass_sync_queue';
const DEVICE_ID_KEY = 'access_compass_device_id';
const MAX_RETRIES = 5;
const RETRY_DELAYS = [1000, 5000, 15000, 30000, 60000]; // exponential-ish backoff

// ============================================
// DEVICE IDENTIFICATION
// ============================================

export function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function getDeviceLabel(): string {
  const ua = navigator.userAgent;
  let browser = 'Unknown browser';
  if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome')) browser = 'Chrome';
  else if (ua.includes('Safari')) browser = 'Safari';

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac')) os = 'macOS';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

// ============================================
// SYNC QUEUE (offline resilience)
// ============================================

function getSyncQueue(): PendingSyncOp[] {
  try {
    const data = localStorage.getItem(SYNC_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveSyncQueue(queue: PendingSyncOp[]): void {
  try {
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch {
    // localStorage full; drop oldest entries to make room
    const trimmed = queue.slice(-50);
    try {
      localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(trimmed));
    } catch {
      // Give up on queue persistence
    }
  }
}

export function addToSyncQueue(
  table: string,
  operation: 'upsert' | 'delete',
  data: Record<string, unknown>,
  filters?: Record<string, unknown>
): void {
  const queue = getSyncQueue();

  // Deduplicate: if there's already a pending op for same table + same primary key, replace it
  const key = data.id || data.session_id || JSON.stringify(filters);
  const existingIdx = queue.findIndex(
    op => op.table === table && (op.data.id === key || op.data.session_id === key)
  );

  const op: PendingSyncOp = {
    id: uuidv4(),
    table,
    operation,
    data,
    filters,
    createdAt: new Date().toISOString(),
    retryCount: 0,
  };

  if (existingIdx >= 0) {
    queue[existingIdx] = op;
  } else {
    queue.push(op);
  }

  saveSyncQueue(queue);
}

export function getPendingCount(): number {
  return getSyncQueue().length;
}

// ============================================
// CORE SYNC OPERATIONS
// ============================================

/**
 * Upsert a record to Supabase. If offline or failed, queues for retry.
 * Always non-blocking: returns immediately, sync happens in background.
 */
export async function syncRecord(
  table: string,
  data: Record<string, unknown>,
  userId: string | undefined,
  organisationId: string | undefined
): Promise<boolean> {
  if (!isSupabaseEnabled() || !supabase || !userId) {
    addToSyncQueue(table, 'upsert', { ...data, user_id: userId, organisation_id: organisationId });
    return false;
  }

  try {
    const record = {
      ...data,
      user_id: userId,
      organisation_id: organisationId || null,
      updated_at: new Date().toISOString(),
    };

    // Specify onConflict for tables with composite unique keys
    const conflictMap: Record<string, string> = {
      module_progress: 'session_id,module_id',
      module_responses: 'session_id,module_id,question_id',
      diap_custom_category_names: 'user_id,category_id',
      diap_team_roles: 'organisation_id,role_name',
      sync_metadata: 'user_id,device_id',
      discovery_data: 'session_id',
      discovery_progress: 'session_id',
      training_progress: 'user_id',
    };

    const onConflict = conflictMap[table];
    const { error } = onConflict
      ? await supabase.from(table).upsert(record, { onConflict })
      : await supabase.from(table).upsert(record);

    if (error) {
      console.warn(`[CloudSync] Failed to sync to ${table}:`, error.message);
      addToSyncQueue(table, 'upsert', record);
      return false;
    }

    return true;
  } catch (err) {
    console.warn(`[CloudSync] Network error syncing to ${table}:`, err);
    addToSyncQueue(table, 'upsert', { ...data, user_id: userId, organisation_id: organisationId });
    return false;
  }
}

/**
 * Delete a record from Supabase.
 */
export async function deleteRecord(
  table: string,
  filters: Record<string, unknown>,
  userId: string | undefined
): Promise<boolean> {
  if (!isSupabaseEnabled() || !supabase || !userId) {
    addToSyncQueue(table, 'delete', {}, filters);
    return false;
  }

  try {
    let query = supabase.from(table).delete();
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value as string);
    }
    const { error } = await query;

    if (error) {
      console.warn(`[CloudSync] Failed to delete from ${table}:`, error.message);
      addToSyncQueue(table, 'delete', {}, filters);
      return false;
    }

    return true;
  } catch {
    addToSyncQueue(table, 'delete', {}, filters);
    return false;
  }
}

/**
 * Fetch all records for the current user from a table.
 */
export async function fetchRecords<T = Record<string, unknown>>(
  table: string,
  userId: string,
  filters?: Record<string, unknown>
): Promise<{ data: T[] | null; error: string | null }> {
  if (!isSupabaseEnabled() || !supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    let query = supabase.from(table).select('*').eq('user_id', userId);

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        query = query.eq(key, value as string);
      }
    }

    const { data, error } = await query;

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as T[], error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

/**
 * Fetch a single record by unique key.
 */
export async function fetchRecord<T = Record<string, unknown>>(
  table: string,
  userId: string,
  filters: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  if (!isSupabaseEnabled() || !supabase) {
    return { data: null, error: 'Supabase not configured' };
  }

  try {
    let query = supabase.from(table).select('*').eq('user_id', userId);

    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value as string);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as T | null, error: null };
  } catch (err) {
    return { data: null, error: String(err) };
  }
}

// ============================================
// PROCESS SYNC QUEUE (flush pending operations)
// ============================================

let isProcessingQueue = false;

export async function processSyncQueue(userId: string): Promise<number> {
  if (!isSupabaseEnabled() || !supabase || !userId || isProcessingQueue) {
    return 0;
  }

  isProcessingQueue = true;
  const queue = getSyncQueue();
  let processed = 0;
  const remaining: PendingSyncOp[] = [];

  for (const op of queue) {
    try {
      if (op.operation === 'upsert') {
        const record = { ...op.data, user_id: userId };
        const { error } = await supabase.from(op.table).upsert(record);

        if (error) {
          if (op.retryCount < MAX_RETRIES) {
            remaining.push({ ...op, retryCount: op.retryCount + 1 });
          }
          // else: drop after max retries
        } else {
          processed++;
        }
      } else if (op.operation === 'delete' && op.filters) {
        let query = supabase.from(op.table).delete();
        for (const [key, value] of Object.entries(op.filters)) {
          query = query.eq(key, value as string);
        }
        const { error } = await query;

        if (error) {
          if (op.retryCount < MAX_RETRIES) {
            remaining.push({ ...op, retryCount: op.retryCount + 1 });
          }
        } else {
          processed++;
        }
      }
    } catch {
      if (op.retryCount < MAX_RETRIES) {
        remaining.push({ ...op, retryCount: op.retryCount + 1 });
      }
    }
  }

  saveSyncQueue(remaining);
  isProcessingQueue = false;
  return processed;
}

// ============================================
// DEVICE SYNC METADATA
// ============================================

/**
 * Record that this device just synced. Used for conflict detection.
 */
export async function updateSyncMetadata(
  userId: string,
  sessionId: string,
  tablesSynced: string[]
): Promise<void> {
  if (!isSupabaseEnabled() || !supabase) return;

  try {
    await supabase.from('sync_metadata').upsert({
      user_id: userId,
      session_id: sessionId,
      device_id: getDeviceId(),
      device_label: getDeviceLabel(),
      last_synced_at: new Date().toISOString(),
      data_tables_synced: tablesSynced,
    });
  } catch {
    // Non-critical, silently fail
  }
}

/**
 * Check if another device has synced more recently than this one.
 * Returns the other device's info if a conflict is detected.
 */
export async function checkForDeviceConflict(
  userId: string
): Promise<{ hasConflict: boolean; otherDevice: { label: string; lastSyncedAt: string } | null }> {
  if (!isSupabaseEnabled() || !supabase) {
    return { hasConflict: false, otherDevice: null };
  }

  try {
    const { data, error } = await supabase
      .from('sync_metadata')
      .select('*')
      .eq('user_id', userId)
      .neq('device_id', getDeviceId())
      .order('last_synced_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return { hasConflict: false, otherDevice: null };
    }

    const otherDevice = data[0];
    const otherSyncTime = new Date(otherDevice.last_synced_at).getTime();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Only flag as conflict if the other device synced within the last 24 hours
    if (now - otherSyncTime < oneDay) {
      return {
        hasConflict: true,
        otherDevice: {
          label: otherDevice.device_label || 'Another device',
          lastSyncedAt: otherDevice.last_synced_at,
        },
      };
    }

    return { hasConflict: false, otherDevice: null };
  } catch {
    return { hasConflict: false, otherDevice: null };
  }
}

// ============================================
// TIMESTAMP-BASED MERGE HELPER
// ============================================

/**
 * Compare local and cloud timestamps, return which is newer.
 * If timestamps are equal or missing, local wins (preserves user's current work).
 */
export function resolveByTimestamp(
  localUpdatedAt: string | undefined,
  cloudUpdatedAt: string | undefined
): 'local' | 'cloud' {
  if (!cloudUpdatedAt) return 'local';
  if (!localUpdatedAt) return 'cloud';

  const localTime = new Date(localUpdatedAt).getTime();
  const cloudTime = new Date(cloudUpdatedAt).getTime();

  // Cloud must be strictly newer to override local
  return cloudTime > localTime ? 'cloud' : 'local';
}

// ============================================
// ONLINE/OFFLINE MONITORING
// ============================================

let onlineCallbacks: Array<(userId: string) => void> = [];

export function onBackOnline(callback: (userId: string) => void): () => void {
  onlineCallbacks.push(callback);
  return () => {
    onlineCallbacks = onlineCallbacks.filter(cb => cb !== callback);
  };
}

// Listen for online events and process the queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[CloudSync] Back online, processing sync queue...');
    // Callbacks will be invoked by the hook that has the userId
  });
}

/**
 * Call this when the app knows the user is authenticated and online.
 * Processes the sync queue and notifies listeners.
 */
export async function onUserOnline(userId: string): Promise<void> {
  const processed = await processSyncQueue(userId);
  if (processed > 0) {
    console.log(`[CloudSync] Processed ${processed} queued sync operations`);
  }
  for (const cb of onlineCallbacks) {
    try { cb(userId); } catch { /* ignore */ }
  }
}
