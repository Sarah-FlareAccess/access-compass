/**
 * Sites Hook
 *
 * CRUD over the `sites` table introduced in migration 023. Sites are
 * first-class multi-location entities for Multi-Site Pulse/Deep/Plus,
 * Premier/Major Venue, and Authority customers. Single-site orgs simply
 * have zero sites; the UI hides the picker until at least one exists.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { useAuth } from '../contexts/AuthContext';
import { logActivityStandalone } from './useActivityLog';

export interface Site {
  id: string;
  organisation_id: string;
  name: string;
  description: string | null;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
}

interface UseSitesResult {
  sites: Site[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createSite: (name: string, description?: string) => Promise<Site | null>;
  updateSite: (id: string, fields: Partial<Pick<Site, 'name' | 'description'>>) => Promise<boolean>;
  deleteSite: (id: string) => Promise<boolean>;
}

export function useSites(): UseSitesResult {
  const { accessState, user } = useAuth();
  const orgId = accessState.organisation?.id;
  const userId = user?.id;

  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase || !orgId) {
      setSites([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('sites')
        .select('*')
        .eq('organisation_id', orgId)
        .order('name', { ascending: true });
      if (fetchError) {
        setError(fetchError.message);
        setSites([]);
      } else {
        setSites((data as Site[]) ?? []);
      }
    } catch (err) {
      setError(String(err));
      setSites([]);
    } finally {
      setIsLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    reload();
  }, [reload]);

  const createSite = useCallback(
    async (name: string, description?: string): Promise<Site | null> => {
      if (!isSupabaseEnabled() || !supabase || !orgId || !userId) {
        setError('Not authenticated');
        return null;
      }
      const trimmed = name.trim();
      if (!trimmed) {
        setError('Site name is required');
        return null;
      }
      setError(null);
      try {
        const { data, error: insertError } = await supabase
          .from('sites')
          .insert({
            organisation_id: orgId,
            name: trimmed,
            description: description?.trim() || null,
            created_by_user_id: userId,
          })
          .select()
          .single();
        if (insertError) {
          setError(insertError.message);
          return null;
        }
        const newSite = data as Site;
        setSites(prev => [...prev, newSite].sort((a, b) => a.name.localeCompare(b.name)));
        logActivityStandalone('site-created', { siteName: newSite.name }, userId);
        return newSite;
      } catch (err) {
        setError(String(err));
        return null;
      }
    },
    [orgId, userId],
  );

  const updateSite = useCallback(
    async (id: string, fields: Partial<Pick<Site, 'name' | 'description'>>): Promise<boolean> => {
      if (!isSupabaseEnabled() || !supabase || !orgId) return false;
      setError(null);
      try {
        const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (fields.name !== undefined) payload.name = fields.name.trim();
        if (fields.description !== undefined) payload.description = fields.description?.trim() || null;
        const { error: updateError } = await supabase
          .from('sites')
          .update(payload)
          .eq('id', id)
          .eq('organisation_id', orgId);
        if (updateError) {
          setError(updateError.message);
          return false;
        }
        setSites(prev =>
          prev.map(s => (s.id === id ? { ...s, ...payload } as Site : s))
            .sort((a, b) => a.name.localeCompare(b.name)),
        );
        return true;
      } catch (err) {
        setError(String(err));
        return false;
      }
    },
    [orgId],
  );

  const deleteSite = useCallback(
    async (id: string): Promise<boolean> => {
      if (!isSupabaseEnabled() || !supabase || !orgId) return false;
      setError(null);
      try {
        // Sites referenced by module_responses, module_progress, sessions,
        // diap_items are protected by ON DELETE SET NULL on the foreign key,
        // so deleting a site doesn't drop the data — the rows just go back
        // to org-wide (site_id becomes NULL).
        const target = sites.find(s => s.id === id);
        const { error: deleteError } = await supabase
          .from('sites')
          .delete()
          .eq('id', id)
          .eq('organisation_id', orgId);
        if (deleteError) {
          setError(deleteError.message);
          return false;
        }
        setSites(prev => prev.filter(s => s.id !== id));
        if (target) {
          logActivityStandalone('site-deleted', { siteName: target.name }, userId);
        }
        return true;
      } catch (err) {
        setError(String(err));
        return false;
      }
    },
    [orgId, sites, userId],
  );

  return { sites, isLoading, error, reload, createSite, updateSite, deleteSite };
}

/**
 * Active site selection (per device, per user). When non-null, scopes
 * assessment reads and writes to that specific site. When null, the
 * canonical org-wide view applies.
 */
const ACTIVE_SITE_KEY = 'access_compass_active_site_id';

export function getActiveSiteId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_SITE_KEY);
  } catch {
    return null;
  }
}

export function setActiveSiteId(siteId: string | null): void {
  try {
    if (siteId) {
      localStorage.setItem(ACTIVE_SITE_KEY, siteId);
    } else {
      localStorage.removeItem(ACTIVE_SITE_KEY);
    }
    window.dispatchEvent(new CustomEvent('access-compass:active-site-changed', { detail: { siteId } }));
  } catch {
    /* ignore */
  }
}

export function useActiveSiteId(): [string | null, (id: string | null) => void] {
  const [activeId, setActiveIdState] = useState<string | null>(() => getActiveSiteId());

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ siteId: string | null }>).detail;
      setActiveIdState(detail?.siteId ?? null);
    };
    window.addEventListener('access-compass:active-site-changed', handler);
    return () => window.removeEventListener('access-compass:active-site-changed', handler);
  }, []);

  const update = useCallback((id: string | null) => {
    setActiveSiteId(id);
  }, []);

  return [activeId, update];
}
