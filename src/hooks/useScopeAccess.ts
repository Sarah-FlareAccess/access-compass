// ============================================
// ACCESS COMPASS - SCOPED MEMBER ACCESS (phase 1a)
// ============================================
// Reads the current user's scope grants (which sites / events / programs they
// may access). DEFAULT OPEN: no grants of a type = full access ('all'). Admins
// and owners always get 'all'. Backed by membership_scope_access (migration
// 040). See .claude/plans/scoped-member-access.md.
// ============================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';

export type ScopeType = 'site' | 'event' | 'program';

/** 'all' = no restriction; otherwise the set of allowed ids for that scope. */
export type Allowed = 'all' | Set<string>;

export interface UseScopeAccessResult {
  siteIds: Allowed;
  eventIds: Allowed;
  programIds: Allowed;
  isLoading: boolean;
  /** Org-wide (null) items are always accessible. */
  canAccessSite: (siteId: string | null | undefined) => boolean;
  reload: () => Promise<void>;
}

const emptyGrants = (): Record<ScopeType, Set<string>> => ({
  site: new Set(),
  event: new Set(),
  program: new Set(),
});

export function useScopeAccess(): UseScopeAccessResult {
  const { accessState, user } = useAuth();
  const orgId = accessState.organisation?.id;
  const userId = user?.id;
  const role = accessState.membership?.role;
  const isAdmin = role === 'admin' || role === 'owner';

  const [grants, setGrants] = useState<Record<ScopeType, Set<string>>>(emptyGrants);
  const [isLoading, setIsLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase || !orgId || !userId) {
      setGrants(emptyGrants());
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('membership_scope_access')
        .select('scope_type, scope_id')
        .eq('user_id', userId)
        .eq('organisation_id', orgId);
      if (error) {
        // Fail open: a read error must not lock a user out of their own data.
        console.warn('[useScopeAccess] grant fetch failed, defaulting to full access:', error);
        setGrants(emptyGrants());
        return;
      }
      const next = emptyGrants();
      for (const row of (data ?? []) as { scope_type: ScopeType; scope_id: string }[]) {
        next[row.scope_type]?.add(row.scope_id);
      }
      setGrants(next);
    } finally {
      setIsLoading(false);
    }
  }, [orgId, userId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const resolve = useCallback(
    (type: ScopeType): Allowed =>
      isAdmin || grants[type].size === 0 ? 'all' : grants[type],
    [isAdmin, grants]
  );

  const canAccessSite = useCallback(
    (siteId: string | null | undefined): boolean => {
      if (!siteId) return true; // org-wide items are visible to everyone
      if (isAdmin || grants.site.size === 0) return true;
      return grants.site.has(siteId);
    },
    [isAdmin, grants.site]
  );

  return useMemo(
    () => ({
      siteIds: resolve('site'),
      eventIds: resolve('event'),
      programIds: resolve('program'),
      isLoading,
      canAccessSite,
      reload,
    }),
    [resolve, isLoading, canAccessSite, reload]
  );
}
