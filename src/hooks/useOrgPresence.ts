/**
 * Organisation Presence Hook
 *
 * Tracks which org members are currently active and shows
 * a notification when another member is using the app.
 *
 * Uses the sync_metadata table: updates last_synced_at as a heartbeat,
 * queries for other org members active in the last 5 minutes.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import { getDeviceId, getDeviceLabel } from '../utils/cloudSync';

interface ActiveMember {
  userId: string;
  email: string;
  deviceLabel: string;
  lastSeenAt: string;
}

const PRESENCE_INTERVAL = 60000; // Update presence every 60 seconds
const ACTIVE_THRESHOLD = 5 * 60 * 1000; // Consider active if seen in last 5 minutes

export function useOrgPresence(
  userId: string | undefined,
  organisationId: string | undefined
): { activeMembers: ActiveMember[]; isLoading: boolean } {
  const [activeMembers, setActiveMembers] = useState<ActiveMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  // Update this user's presence
  const updatePresence = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase || !userId) return;

    try {
      await supabase.from('sync_metadata').upsert({
        user_id: userId,
        device_id: getDeviceId(),
        device_label: getDeviceLabel(),
        session_id: 'presence',
        last_synced_at: new Date().toISOString(),
        data_tables_synced: ['presence'],
      }, { onConflict: 'user_id,device_id' });
    } catch {
      // Non-critical
    }
  }, [userId]);

  // Fetch active org members
  const fetchActiveMembers = useCallback(async () => {
    if (!isSupabaseEnabled() || !supabase || !userId || !organisationId) return;

    try {
      // Get org member user IDs
      const { data: memberships } = await supabase
        .from('organisation_memberships')
        .select('user_id')
        .eq('organisation_id', organisationId)
        .eq('status', 'active')
        .neq('user_id', userId);

      if (!memberships || memberships.length === 0) {
        setActiveMembers([]);
        return;
      }

      const memberIds = memberships.map(m => m.user_id);
      const cutoff = new Date(Date.now() - ACTIVE_THRESHOLD).toISOString();

      // Get recent sync metadata for those members
      const { data: presence } = await supabase
        .from('sync_metadata')
        .select('user_id, device_label, last_synced_at')
        .in('user_id', memberIds)
        .gte('last_synced_at', cutoff);

      if (!presence || presence.length === 0) {
        setActiveMembers([]);
        return;
      }

      // Get emails for active members
      const activeUserIds = [...new Set(presence.map(p => p.user_id))];
      const members: ActiveMember[] = activeUserIds.map(uid => {
        const latestPresence = presence
          .filter(p => p.user_id === uid)
          .sort((a, b) => new Date(b.last_synced_at).getTime() - new Date(a.last_synced_at).getTime())[0];

        return {
          userId: uid,
          email: '', // Will be filled if we can get it
          deviceLabel: latestPresence.device_label || 'Unknown device',
          lastSeenAt: latestPresence.last_synced_at,
        };
      });

      setActiveMembers(members);
    } catch {
      // Non-critical
    }
  }, [userId, organisationId]);

  useEffect(() => {
    if (!userId || !organisationId) return;

    setIsLoading(true);

    // Initial presence update and fetch
    updatePresence().then(() => {
      fetchActiveMembers().finally(() => setIsLoading(false));
    });

    // Periodic updates
    intervalRef.current = setInterval(() => {
      updatePresence();
      fetchActiveMembers();
    }, PRESENCE_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [userId, organisationId, updatePresence, fetchActiveMembers]);

  return { activeMembers, isLoading };
}
