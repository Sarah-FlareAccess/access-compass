/**
 * Supabase Session Hook
 *
 * Manages session data with Supabase sync and localStorage fallback.
 * Works offline-first: saves to localStorage immediately, syncs to Supabase when available.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import {
  getSession,
  initializeSession,
  updateSession as updateLocalSession,
  getDiscoveryData,
  saveDiscoveryData,
  type StoredDiscoveryData,
} from '../utils/session';
import type { Session, DiscoveryData, RecommendationResult, ReviewMode } from '../types';

interface UseSupabaseSessionReturn {
  session: Session | null;
  discoveryData: StoredDiscoveryData | null;
  isLoading: boolean;
  error: string | null;
  isSynced: boolean;

  // Session actions
  updateSession: (updates: Partial<Session>) => Promise<void>;
  refreshSession: () => Promise<void>;

  // Discovery actions
  updateDiscovery: (data: Partial<StoredDiscoveryData>) => Promise<void>;

  // Sync actions
  syncToCloud: () => Promise<void>;
}

export function useSupabaseSession(): UseSupabaseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [discoveryData, setDiscoveryData] = useState<StoredDiscoveryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSynced, setIsSynced] = useState(false);

  // Initialize session on mount
  useEffect(() => {
    const init = async () => {
      try {
        // First, load from localStorage (instant)
        const localSession = getSession() || initializeSession();
        const localDiscovery = getDiscoveryData();

        setSession(localSession);
        setDiscoveryData(localDiscovery);

        // If Supabase is enabled, try to sync
        if (isSupabaseEnabled() && supabase) {
          await syncFromCloud();
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  // Sync from cloud (pull latest data)
  const syncFromCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase) return;

    try {
      const localSession = getSession();
      if (!localSession?.session_id) return;

      // Try to fetch session from Supabase
      const { data: cloudSession, error: fetchError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', localSession.session_id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = not found, which is OK for new sessions
        console.warn('Error fetching cloud session:', fetchError);
        return;
      }

      if (cloudSession) {
        // Cloud session exists - check if it's newer
        const cloudUpdated = new Date(cloudSession.last_updated);
        const localUpdated = new Date(localSession.last_updated);

        if (cloudUpdated > localUpdated) {
          // Cloud is newer - update local
          const mergedSession = {
            ...localSession,
            ...cloudSession,
            session_id: localSession.session_id,
          };
          updateLocalSession(mergedSession);
          setSession(mergedSession);
        }

        setIsSynced(true);
      }

      // Also fetch discovery data
      const { data: cloudDiscovery } = await supabase
        .from('discovery_data')
        .select('*')
        .eq('session_id', localSession.session_id)
        .single();

      if (cloudDiscovery) {
        const discoveryUpdate: StoredDiscoveryData = {
          discovery_data: {
            selectedTouchpoints: cloudDiscovery.selected_touchpoints || [],
            selectedSubTouchpoints: cloudDiscovery.selected_sub_touchpoints || [],
            responses: cloudDiscovery.touchpoint_responses || {},
          },
          recommendation_result: cloudDiscovery.recommendation_result,
          review_mode: cloudDiscovery.review_mode || 'foundation',
          recommended_modules: cloudDiscovery.recommended_modules || [],
        };
        saveDiscoveryData(discoveryUpdate);
        setDiscoveryData(discoveryUpdate);
      }
    } catch (err) {
      console.error('Error syncing from cloud:', err);
    }
  }, []);

  // Sync to cloud (push local data)
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase) {
      setError('Supabase not configured');
      return;
    }

    try {
      const localSession = getSession();
      const localDiscovery = getDiscoveryData();

      if (!localSession?.session_id) return;

      // Upsert session
      const { error: sessionError } = await supabase
        .from('sessions')
        .upsert({
          id: localSession.session_id,
          business_snapshot: localSession.business_snapshot,
          selected_modules: localSession.selected_modules,
          discovery_responses: localSession.discovery_responses,
          constraints: localSession.constraints,
          ai_response: localSession.ai_response,
          last_updated: new Date().toISOString(),
        });

      if (sessionError) throw sessionError;

      // Upsert discovery data if exists
      if (localDiscovery) {
        const { error: discoveryError } = await supabase
          .from('discovery_data')
          .upsert({
            session_id: localSession.session_id,
            selected_touchpoints: localDiscovery.discovery_data.selectedTouchpoints,
            selected_sub_touchpoints: localDiscovery.discovery_data.selectedSubTouchpoints,
            touchpoint_responses: localDiscovery.discovery_data.responses || {},
            recommendation_result: localDiscovery.recommendation_result,
            review_mode: localDiscovery.review_mode,
            recommended_modules: localDiscovery.recommended_modules,
          });

        if (discoveryError) throw discoveryError;
      }

      setIsSynced(true);
      setError(null);
    } catch (err) {
      console.error('Error syncing to cloud:', err);
      setError('Failed to sync to cloud');
    }
  }, []);

  // Update session (local + optional cloud sync)
  const updateSession = useCallback(async (updates: Partial<Session>) => {
    try {
      const updatedSession = updateLocalSession(updates);
      setSession(updatedSession);

      // Sync to cloud in background if enabled
      if (isSupabaseEnabled()) {
        syncToCloud().catch(console.error);
      }
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session');
    }
  }, [syncToCloud]);

  // Update discovery data
  const updateDiscovery = useCallback(async (updates: Partial<StoredDiscoveryData>) => {
    try {
      const existing = getDiscoveryData() || {
        discovery_data: { selectedTouchpoints: [], selectedSubTouchpoints: [] },
        recommendation_result: {} as RecommendationResult,
        review_mode: 'foundation' as ReviewMode,
        recommended_modules: [],
      };

      const updated = { ...existing, ...updates };
      saveDiscoveryData(updated);
      setDiscoveryData(updated);

      // Sync to cloud in background if enabled
      if (isSupabaseEnabled()) {
        syncToCloud().catch(console.error);
      }
    } catch (err) {
      console.error('Error updating discovery:', err);
      setError('Failed to update discovery');
    }
  }, [syncToCloud]);

  // Refresh session from localStorage
  const refreshSession = useCallback(async () => {
    const localSession = getSession();
    const localDiscovery = getDiscoveryData();
    setSession(localSession);
    setDiscoveryData(localDiscovery);
  }, []);

  return {
    session,
    discoveryData,
    isLoading,
    error,
    isSynced,
    updateSession,
    refreshSession,
    updateDiscovery,
    syncToCloud,
  };
}
