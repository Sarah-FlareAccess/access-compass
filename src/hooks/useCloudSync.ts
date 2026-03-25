/**
 * useCloudSync Hook
 *
 * Orchestrates the cloud sync lifecycle:
 * 1. On mount (when authenticated): check for device conflicts
 * 2. Process any pending sync queue
 * 3. Provide sync utilities to child hooks/components
 * 4. Listen for online/offline transitions
 *
 * This hook should be used once at a high level (e.g. App or Dashboard).
 * Individual data hooks (useModuleProgress, etc.) call the sync utilities directly.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkForDeviceConflict,
  processSyncQueue,
  getPendingCount,
  updateSyncMetadata,
  onUserOnline,
  type SyncState,
} from '../utils/cloudSync';
import { isSupabaseEnabled } from '../utils/supabase';
import { getSession } from '../utils/session';

interface UseCloudSyncReturn {
  syncState: SyncState;
  conflictDetected: boolean;
  conflictDevice: { label: string; lastSyncedAt: string } | null;
  resolveConflict: (resolution: 'use-cloud' | 'use-local') => void;
  dismissConflict: () => void;
  triggerSync: () => Promise<void>;
}

export function useCloudSync(
  userId: string | undefined,
  _organisationId: string | undefined
): UseCloudSyncReturn {
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSyncedAt: null,
    pendingChanges: getPendingCount(),
    error: null,
  });

  const [conflictDetected, setConflictDetected] = useState(false);
  const [conflictDevice, setConflictDevice] = useState<{ label: string; lastSyncedAt: string } | null>(null);
  const conflictResolutionRef = useRef<((resolution: 'use-cloud' | 'use-local') => void) | null>(null);
  const initialCheckDone = useRef(false);

  // Check for device conflicts on mount
  useEffect(() => {
    if (!userId || !isSupabaseEnabled() || initialCheckDone.current) return;
    initialCheckDone.current = true;

    const checkConflict = async () => {
      const { hasConflict, otherDevice } = await checkForDeviceConflict(userId);
      if (hasConflict && otherDevice) {
        setConflictDetected(true);
        setConflictDevice(otherDevice);
      } else {
        // No conflict: process any pending queue and record sync
        await processQueueAndRecord();
      }
    };

    checkConflict();
  }, [userId]);

  // Process queue and record device sync
  const processQueueAndRecord = useCallback(async () => {
    if (!userId) return;

    setSyncState(prev => ({ ...prev, isSyncing: true, error: null }));

    try {
      await processSyncQueue(userId);
      const session = getSession();
      if (session?.session_id) {
        await updateSyncMetadata(userId, session.session_id, [
          'sessions', 'module_progress', 'module_responses',
          'diap_items', 'diap_documents', 'discovery_data',
          'actions', 'evidence',
          'clarifications', 'training_progress',
        ]);
      }

      setSyncState({
        isSyncing: false,
        lastSyncedAt: new Date().toISOString(),
        pendingChanges: getPendingCount(),
        error: null,
      });
    } catch (err) {
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        error: String(err),
      }));
    }
  }, [userId]);

  // Handle conflict resolution
  const resolveConflict = useCallback((resolution: 'use-cloud' | 'use-local') => {
    setConflictDetected(false);
    setConflictDevice(null);

    if (conflictResolutionRef.current) {
      conflictResolutionRef.current(resolution);
    }

    // After resolution, process queue and record this device
    processQueueAndRecord();
  }, [processQueueAndRecord]);

  const dismissConflict = useCallback(() => {
    setConflictDetected(false);
    setConflictDevice(null);
    // Still process queue even if user defers
    processQueueAndRecord();
  }, [processQueueAndRecord]);

  // Manual sync trigger
  const triggerSync = useCallback(async () => {
    await processQueueAndRecord();
  }, [processQueueAndRecord]);

  // Listen for online events
  useEffect(() => {
    if (!userId) return;

    const handleOnline = () => {
      onUserOnline(userId).then(() => {
        setSyncState(prev => ({
          ...prev,
          pendingChanges: getPendingCount(),
        }));
      });
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [userId]);

  // Periodically update pending count
  useEffect(() => {
    const interval = setInterval(() => {
      setSyncState(prev => ({
        ...prev,
        pendingChanges: getPendingCount(),
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    syncState,
    conflictDetected,
    conflictDevice,
    resolveConflict,
    dismissConflict,
    triggerSync,
  };
}
