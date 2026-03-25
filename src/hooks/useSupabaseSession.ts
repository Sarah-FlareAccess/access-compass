/**
 * Supabase Session Hook
 *
 * Manages session data with Supabase sync and localStorage fallback.
 * Works offline-first: saves to localStorage immediately, syncs to Supabase when available.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { isSupabaseEnabled } from '../utils/supabase';
import { syncRecord, fetchRecord, resolveByTimestamp } from '../utils/cloudSync';
import { useAuthSafe } from '../contexts/AuthContext';
import {
  getSession,
  initializeSession,
  updateSession as updateLocalSession,
  getDiscoveryData,
  saveDiscoveryData,
  type StoredDiscoveryData,
} from '../utils/session';
import type { Session, RecommendationResult, ReviewMode, DiscoveryData } from '../types';

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
  const { userId, organisationId } = useAuthSafe();
  const userIdRef = useRef(userId);
  const orgIdRef = useRef(organisationId);

  useEffect(() => {
    userIdRef.current = userId;
    orgIdRef.current = organisationId;
  }, [userId, organisationId]);

  // Sync session to cloud
  const pushSessionToCloud = useCallback((localSession: Session) => {
    if (!userIdRef.current || !localSession.session_id) return;
    syncRecord('sessions', {
      id: localSession.session_id,
      business_snapshot: localSession.business_snapshot || null,
      selected_modules: localSession.selected_modules || [],
      discovery_responses: localSession.discovery_responses || null,
      constraints: localSession.constraints || null,
      ai_response: localSession.ai_response || null,
      last_updated: new Date().toISOString(),
    }, userIdRef.current, orgIdRef.current).catch(() => {});
  }, []);

  // Sync discovery to cloud
  const pushDiscoveryToCloud = useCallback((data: StoredDiscoveryData, sessionId: string) => {
    if (!userIdRef.current) return;
    syncRecord('discovery_data', {
      session_id: sessionId,
      selected_touchpoints: data.discovery_data?.selectedTouchpoints || [],
      selected_sub_touchpoints: data.discovery_data?.selectedSubTouchpoints || [],
      touchpoint_responses: data.discovery_data?.responses || {},
      recommendation_result: data.recommendation_result || null,
      review_mode: data.review_mode || 'pulse-check',
      recommended_modules: data.recommended_modules || [],
      budget_range: data.budget_range || null,
      work_approach: data.work_approach || null,
      action_timing: data.action_timing || null,
    }, userIdRef.current, orgIdRef.current).catch(() => {});
  }, []);

  // Initialize session on mount
  useEffect(() => {
    const init = async () => {
      try {
        // First, load from localStorage (instant)
        const localSession = getSession() || initializeSession();
        const localDiscovery = getDiscoveryData();

        setSession(localSession);
        setDiscoveryData(localDiscovery);

        // If authenticated and Supabase enabled, try to merge from cloud
        if (isSupabaseEnabled() && userId && localSession.session_id) {
          const { data: cloudSession } = await fetchRecord<Record<string, unknown>>(
            'sessions', userId, { id: localSession.session_id }
          );

          if (cloudSession) {
            const cloudUpdatedAt = (cloudSession.last_updated || cloudSession.updated_at) as string | undefined;
            if (resolveByTimestamp(localSession.last_updated, cloudUpdatedAt) === 'cloud') {
              const mergedSession: Session = {
                ...localSession,
                selected_modules: (cloudSession.selected_modules as Session['selected_modules']) || localSession.selected_modules,
                last_updated: cloudUpdatedAt || localSession.last_updated,
              };
              updateLocalSession(mergedSession);
              setSession(mergedSession);
            }
            setIsSynced(true);
          }

          // Also fetch discovery data
          const { data: cloudDiscovery } = await fetchRecord<Record<string, unknown>>(
            'discovery_data', userId, { session_id: localSession.session_id }
          );

          if (cloudDiscovery) {
            const discoveryUpdate: StoredDiscoveryData = {
              discovery_data: {
                selectedTouchpoints: (cloudDiscovery.selected_touchpoints as string[]) || [],
                selectedSubTouchpoints: (cloudDiscovery.selected_sub_touchpoints as string[]) || [],
                responses: (cloudDiscovery.touchpoint_responses as DiscoveryData['responses']) || {},
              },
              recommendation_result: cloudDiscovery.recommendation_result as RecommendationResult,
              review_mode: (cloudDiscovery.review_mode as ReviewMode) || 'pulse-check',
              recommended_modules: (cloudDiscovery.recommended_modules as string[]) || [],
              budget_range: cloudDiscovery.budget_range as string | undefined,
              work_approach: cloudDiscovery.work_approach as string | undefined,
              action_timing: cloudDiscovery.action_timing as string | undefined,
            };

            // Merge: cloud wins if it has data we don't
            const existingLocal = localDiscovery;
            if (!existingLocal || (discoveryUpdate.recommended_modules.length > 0 && !existingLocal.recommended_modules?.length)) {
              saveDiscoveryData(discoveryUpdate);
              setDiscoveryData(discoveryUpdate);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing session:', err);
        setError('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [userId]);

  // Sync to cloud (full push)
  const syncToCloud = useCallback(async () => {
    if (!isSupabaseEnabled() || !userIdRef.current) {
      return;
    }

    const localSession = getSession();
    const localDiscovery = getDiscoveryData();

    if (!localSession?.session_id) return;

    pushSessionToCloud(localSession);

    if (localDiscovery) {
      pushDiscoveryToCloud(localDiscovery, localSession.session_id);
    }

    setIsSynced(true);
    setError(null);
  }, [pushSessionToCloud, pushDiscoveryToCloud]);

  // Update session (local + background cloud sync)
  const updateSession = useCallback(async (updates: Partial<Session>) => {
    try {
      const updatedSession = updateLocalSession(updates);
      setSession(updatedSession);
      pushSessionToCloud(updatedSession);
    } catch (err) {
      console.error('Error updating session:', err);
      setError('Failed to update session');
    }
  }, [pushSessionToCloud]);

  // Update discovery data
  const updateDiscovery = useCallback(async (updates: Partial<StoredDiscoveryData>) => {
    try {
      const existing = getDiscoveryData() || {
        discovery_data: { selectedTouchpoints: [], selectedSubTouchpoints: [] },
        recommendation_result: {} as RecommendationResult,
        review_mode: 'pulse-check' as ReviewMode,
        recommended_modules: [],
      };

      const updated = { ...existing, ...updates };
      saveDiscoveryData(updated);
      setDiscoveryData(updated);

      const localSession = getSession();
      if (localSession?.session_id) {
        pushDiscoveryToCloud(updated, localSession.session_id);
      }
    } catch (err) {
      console.error('Error updating discovery:', err);
      setError('Failed to update discovery');
    }
  }, [pushDiscoveryToCloud]);

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
