// ============================================
// ACCESS COMPASS - AUTH CONTEXT
// ============================================
// Provides authentication state and access checking
// throughout the application
// ============================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseEnabled, supabaseRest } from '../utils/supabase';
import type {
  UserAccessState,
  Organisation,
  AccessLevel,
} from '../types/access';

// ============================================
// TYPES
// ============================================

interface AuthContextValue {
  // Auth state
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Access state
  accessState: UserAccessState;

  // Auth actions
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: AuthError | null }>;

  // Organisation actions
  createOrganisation: (data: {
    name: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    contactEmail: string;
    contactName: string;
    allowedEmails?: string[];
  }) => Promise<{
    error: string | null;
    organisation?: Organisation;
    inviteCode?: string;
    emailsAdded?: number;
  }>;
  joinOrganisation: (inviteCode: string) => Promise<{
    error: string | null;
    organisation?: Organisation;
  }>;
  checkDomainAutoJoin: () => Promise<{ organisation?: Organisation }>;

  // Session merge (anonymous -> authenticated)
  mergeAnonymousSession: (anonymousSessionId: string) => Promise<void>;

  // Refresh
  refreshAccessState: () => Promise<void>;

  // Access checking helpers
  hasAccessLevel: (level: AccessLevel) => boolean;
  canAccessDIAP: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ============================================
// DEFAULT ACCESS STATE
// ============================================

const defaultAccessState: UserAccessState = {
  isAuthenticated: false,
  hasAccess: false,
};

// ============================================
// PROVIDER COMPONENT
// ============================================

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessState, setAccessState] = useState<UserAccessState>(defaultAccessState);

  // ============================================
  // FETCH USER'S ACCESS STATE
  // ============================================

  const fetchAccessState = useCallback(async (userId: string): Promise<UserAccessState> => {
    try {
      // Use REST API to fetch membership (bypasses Supabase JS client issues)
      const { data: memberships } = await supabaseRest.query(
        'organisation_memberships',
        '*',
        { user_id: userId }
      );

      const membership = Array.isArray(memberships) ? memberships[0] : null;

      // If we have a membership, fetch the organisation separately
      let membershipOrg: Organisation | null = null;
      if (membership?.organisation_id) {
        const { data: orgs } = await supabaseRest.query(
          'organisations',
          '*',
          { id: membership.organisation_id }
        );
        membershipOrg = Array.isArray(orgs) && orgs.length > 0 ? orgs[0] as Organisation : null;

      }

      const membershipInfo = membership ? {
        role: membership.role,
        status: membership.status,
      } : undefined;

      // For now, skip entitlement check via RPC (can be added later)
      // Users with membership can access the app
      const hasAccess = !!membership && membership.status === 'active';

      return {
        isAuthenticated: true,
        hasAccess,
        organisation: membershipOrg,
        membership: membershipInfo,
        // Default access for members (can be enhanced with entitlements later)
        accessLevel: hasAccess ? 'deep_dive' : undefined,
      };
    } catch (error) {
      console.error('[fetchAccessState] Error:', error);
      return { isAuthenticated: true, hasAccess: false };
    }
  }, []);

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================

  useEffect(() => {
    if (!isSupabaseEnabled() || !supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session with timeout
    // Timeout after 60 seconds if Supabase doesn't respond (free tier can be slow)
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 60000);

    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        clearTimeout(timeoutId);
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          fetchAccessState(initialSession.user.id).then(setAccessState);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('[AuthContext] Error getting session:', error);
        setIsLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        // Check if a different user signed in - clear old user's localStorage data
        const LAST_USER_KEY = 'access_compass_last_user_id';
        const lastUserId = localStorage.getItem(LAST_USER_KEY);
        if (lastUserId && lastUserId !== newSession.user.id) {
          const keysToPreserve = [
            LAST_USER_KEY,
            'sb-ibvqlyyvlwnwjcoehjkt-auth-token',
            'access_compass_device_id',
          ];
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('access_compass_') && !keysToPreserve.includes(key)) {
              keysToRemove.push(key);
            }
            if (key && (key.startsWith('diap_') || key === 'access_compass_sync_queue')) {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach(key => localStorage.removeItem(key));
        }
        localStorage.setItem(LAST_USER_KEY, newSession.user.id);

        const newAccessState = await fetchAccessState(newSession.user.id);
        setAccessState(newAccessState);
        // Note: Domain auto-join is handled by Disclaimer page, not here
        // This allows users to see the organisation selection step
      } else {
        setAccessState(defaultAccessState);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchAccessState]);

  // ============================================
  // AUTH ACTIONS
  // ============================================

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    try {
      // Start signUp but don't wait forever
      let signUpCompleted = false;

      const signUpPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      }).then(result => {
        signUpCompleted = true;
        return result;
      });

      // Wait up to 60 seconds for signUp (free tier can be slow)
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 60000);
      });

      const result = await Promise.race([signUpPromise, timeoutPromise]);

      if (result && 'error' in result) {
        return { error: result.error };
      }

      if (!signUpCompleted) {
        // SignUp timed out - try signing in to see if account was created
        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError) {
            return { error: null };
          } else if (signInError.message?.includes('Invalid login credentials')) {
            // Account wasn't created or password is wrong
            return { error: { message: 'Sign up timed out. Please try again.' } as AuthError };
          } else {
            return { error: signInError };
          }
        } catch (signInErr) {
          console.error('[AuthContext.signUp] Sign in check failed:', signInErr);
          return { error: { message: 'Sign up timed out. Please try again.' } as AuthError };
        }
      }

      return { error: null };
    } catch (err) {
      console.error('[AuthContext.signUp] Exception:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      return { error: { message } as AuthError };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (err) {
      console.error('[AuthContext.signIn] Exception:', err);
      return { error: { message: 'Failed to sign in' } as AuthError };
    }
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    return { error };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) {
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error };
  }, []);

  // ============================================
  // REFRESH ACCESS STATE
  // ============================================

  const refreshAccessState = useCallback(async () => {
    if (user) {
      const newState = await fetchAccessState(user.id);
      setAccessState(newState);
    }
  }, [user, fetchAccessState]);

  // ============================================
  // ORGANISATION ACTIONS
  // ============================================

  const createOrganisation = useCallback(
    async (data: {
      name: string;
      size: 'small' | 'medium' | 'large' | 'enterprise';
      contactEmail: string;
      contactName: string;
      allowedEmails?: string[];
    }): Promise<{ error: string | null; organisation?: Organisation; inviteCode?: string; emailsAdded?: number }> => {
      if (!supabase || !user) {
        return { error: 'Not authenticated' };
      }

      try {

        // Generate slug from name
        let slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        slug = `${slug}-${Math.random().toString(36).substring(2, 8)}`;

        // Generate invite code
        const inviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

        // Determine org type from selected pricing tier
        let orgType = 'standard';
        try {
          const tierRaw = localStorage.getItem('access_compass_selected_tier');
          if (tierRaw) {
            const tierData = JSON.parse(tierRaw);
            console.log('[createOrganisation] Selected tier:', tierData);
            if (tierData.category === 'authority') {
              orgType = 'authority';
            }
          } else {
            console.log('[createOrganisation] No tier found in localStorage');
          }
        } catch { /* ignore */ }
        console.log('[createOrganisation] Using org_type:', orgType);

        // Step 1: Insert organisation via REST
        const { data: orgData, error: orgError } = await supabaseRest.insert('organisations', {
          name: data.name,
          slug,
          size: data.size,
          org_type: orgType,
          contact_email: data.contactEmail,
          contact_name: data.contactName,
          invite_code: inviteCode,
        });

        if (orgError) {
          console.error('[createOrganisation] Org insert error:', orgError);
          const errorStr = typeof orgError === 'string' ? orgError : JSON.stringify(orgError);
          if (errorStr.includes('organisations_slug_key') || errorStr.includes('23505')) {
            return { error: `An organisation named "${data.name}" has already been registered. Please choose a different name, or contact support if you believe this is an error.` };
          }
          return { error: 'Failed to create organisation. Please try again.' };
        }

        const newOrg = Array.isArray(orgData) ? orgData[0] : orgData;
        if (!newOrg?.id) {
          return { error: 'Failed to create organisation. No ID returned.' };
        }

        // Step 2: Insert membership via REST
        const { error: memberError } = await supabaseRest.insert('organisation_memberships', {
          organisation_id: newOrg.id,
          user_id: user.id,
          role: 'owner',
          status: 'active',
          invite_accepted_at: new Date().toISOString(),
        });

        if (memberError) {
          console.error('[createOrganisation] Membership error:', memberError);
          const errorStr = typeof memberError === 'string' ? memberError : JSON.stringify(memberError);
          if (errorStr.includes('foreign key') || errorStr.includes('23503')) {
            return { error: 'Your session appears to be invalid. Please sign out and sign in again.' };
          }
          return { error: 'Failed to add you as owner. Please try again.' };
        }

        // Refresh access state
        await refreshAccessState();

        return {
          error: null,
          organisation: newOrg as Organisation,
          inviteCode,
          emailsAdded: 0,
        };
      } catch (error) {
        console.error('[createOrganisation] Exception:', error);
        return { error: 'An error occurred while creating the organisation.' };
      }
    },
    [user, refreshAccessState]
  );

  const joinOrganisation = useCallback(
    async (inviteCode: string): Promise<{ error: string | null; organisation?: Organisation }> => {
      if (!supabase || !user) {
        return { error: 'Not authenticated' };
      }

      try {
        // First try the new validation RPC that checks email pre-registration
        const { data: validationData, error: validationError } = await supabase.rpc('validate_invite_code_for_email', {
          p_invite_code: inviteCode,
          p_email: user.email,
        });

        // If the new RPC doesn't exist, fall back to the old behavior
        if (validationError?.message?.includes('function') && validationError?.message?.includes('does not exist')) {
          const { data: orgData, error: findError } = await supabase.rpc('find_org_by_invite_code', {
            p_invite_code: inviteCode,
          });

          if (findError || !orgData || orgData.length === 0) {
            return { error: 'Invalid invite code' };
          }

          const org = orgData[0];

          // Check if already a member
          const { data: existingMembership } = await supabase
            .from('organisation_memberships')
            .select('id')
            .eq('organisation_id', org.id)
            .eq('user_id', user.id)
            .single();

          if (existingMembership) {
            return { error: 'Already a member of this organisation' };
          }

          // Create membership (old flow without email validation)
          const { error: memberError } = await supabase.from('organisation_memberships').insert({
            organisation_id: org.id,
            user_id: user.id,
            role: 'member',
            invite_accepted_at: new Date().toISOString(),
          });

          if (memberError) {
            return { error: 'Failed to join organisation' };
          }

          const { data: fullOrg } = await supabase
            .from('organisations')
            .select('*')
            .eq('id', org.id)
            .single();

          await refreshAccessState();
          return { error: null, organisation: fullOrg as Organisation };
        }

        // Handle validation result from new RPC
        if (validationError) {
          console.error('[joinOrganisation] Validation error:', validationError);
          return { error: 'Failed to validate invite code' };
        }

        if (!validationData || validationData.length === 0) {
          return { error: 'Invalid invite code' };
        }

        const validation = validationData[0];

        // Check if validation passed
        if (!validation.is_valid) {
          return { error: validation.error_message || 'Unable to join organisation' };
        }

        // Check if already a member
        const { data: existingMembership } = await supabase
          .from('organisation_memberships')
          .select('id')
          .eq('organisation_id', validation.organisation_id)
          .eq('user_id', user.id)
          .single();

        if (existingMembership) {
          return { error: 'Already a member of this organisation' };
        }

        // Create membership
        const { error: memberError } = await supabase.from('organisation_memberships').insert({
          organisation_id: validation.organisation_id,
          user_id: user.id,
          role: 'member',
          invite_accepted_at: new Date().toISOString(),
        });

        if (memberError) {
          console.error('Error creating membership:', memberError);
          return { error: 'Failed to join organisation' };
        }

        // Mark the allowed email as used
        await supabase.rpc('mark_allowed_email_as_used', {
          p_org_id: validation.organisation_id,
          p_email: user.email,
          p_user_id: user.id,
        });

        // Fetch full organisation details
        const { data: fullOrg } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', validation.organisation_id)
          .single();

        // Refresh access state
        await refreshAccessState();

        return { error: null, organisation: fullOrg as Organisation };
      } catch (error) {
        console.error('[joinOrganisation] Exception:', error);
        return { error: 'An error occurred' };
      }
    },
    [user, refreshAccessState]
  );

  const checkDomainAutoJoin = useCallback(async (): Promise<{ organisation?: Organisation }> => {
    if (!supabase || !user?.email) {
      return {};
    }

    try {
      // Check if user's email domain matches any org with auto-join enabled
      const { data, error } = await supabase.rpc('check_domain_auto_join', {
        p_user_email: user.email,
      });

      if (error || !data || data.length === 0) {
        return {};
      }

      const orgMatch = data[0];

      // Check if already a member
      const { data: existingMembership } = await supabase
        .from('organisation_memberships')
        .select('id')
        .eq('organisation_id', orgMatch.organisation_id)
        .eq('user_id', user.id)
        .single();

      if (existingMembership) {
        // Already a member, just return the org
        const { data: org } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', orgMatch.organisation_id)
          .single();

        return { organisation: org as Organisation };
      }

      // Auto-join the organisation
      await supabase.from('organisation_memberships').insert({
        organisation_id: orgMatch.organisation_id,
        user_id: user.id,
        role: 'member',
        invite_accepted_at: new Date().toISOString(),
      });

      // Refresh access state
      await refreshAccessState();

      // Return the organisation
      const { data: org } = await supabase
        .from('organisations')
        .select('*')
        .eq('id', orgMatch.organisation_id)
        .single();

      return { organisation: org as Organisation };
    } catch (error) {
      console.error('Error checking domain auto-join:', error);
      return {};
    }
  }, [user, refreshAccessState]);

  // ============================================
  // SESSION MERGE
  // ============================================

  const mergeAnonymousSession = useCallback(
    async (anonymousSessionId: string) => {
      if (!supabase || !user) return;

      try {
        // Update session to link to authenticated user
        await supabase
          .from('sessions')
          .update({ user_id: user.id })
          .eq('session_id', anonymousSessionId)
          .is('user_id', null);

      } catch (error) {
        console.error('Error merging anonymous session:', error);
      }
    },
    [user]
  );

  // ============================================
  // ACCESS CHECKING HELPERS
  // ============================================

  const hasAccessLevel = useCallback(
    (level: AccessLevel): boolean => {
      if (!accessState.hasAccess) return false;

      // Deep dive has access to everything
      if (accessState.accessLevel === 'deep_dive') return true;

      // Pulse only has pulse access
      return level === 'pulse';
    },
    [accessState]
  );

  const canAccessDIAP = useCallback((): boolean => {
    return accessState.hasAccess && accessState.accessLevel === 'deep_dive';
  }, [accessState]);

  // ============================================
  // MEMOIZED VALUE
  // ============================================

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      isLoading,
      isAuthenticated: !!user,
      accessState,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      createOrganisation,
      joinOrganisation,
      checkDomainAutoJoin,
      mergeAnonymousSession,
      refreshAccessState,
      hasAccessLevel,
      canAccessDIAP,
    }),
    [
      user,
      session,
      isLoading,
      accessState,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      createOrganisation,
      joinOrganisation,
      checkDomainAutoJoin,
      mergeAnonymousSession,
      refreshAccessState,
      hasAccessLevel,
      canAccessDIAP,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Safe version that returns null instead of throwing when used outside AuthProvider.
 * Used by data hooks that need userId/orgId for cloud sync but should still
 * work in localStorage-only mode without auth.
 */
export function useAuthSafe(): { userId: string | undefined; organisationId: string | undefined } {
  const context = useContext(AuthContext);
  if (!context) {
    return { userId: undefined, organisationId: undefined };
  }
  return {
    userId: context.user?.id,
    organisationId: context.accessState?.organisation?.id,
  };
}
