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
import { supabase, isSupabaseEnabled } from '../utils/supabase';
import type {
  UserAccessState,
  Organisation,
  UserEntitlementResult,
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

  // Organisation actions
  createOrganisation: (data: {
    name: string;
    size: 'small' | 'medium' | 'large' | 'enterprise';
    contactEmail: string;
    contactName: string;
  }) => Promise<{
    error: string | null;
    organisation?: Organisation;
    inviteCode?: string;
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
    if (!supabase) {
      return { isAuthenticated: true, hasAccess: false };
    }

    try {
      // Get user's entitlement using RPC function
      const { data: entitlementData, error: entitlementError } = await supabase
        .rpc('get_user_entitlement', { p_user_id: userId });

      if (entitlementError) {
        console.error('Error fetching entitlement:', entitlementError);
        return { isAuthenticated: true, hasAccess: false };
      }

      // If user has an entitlement
      if (entitlementData && entitlementData.length > 0) {
        const ent = entitlementData[0] as UserEntitlementResult;

        // Fetch organisation details if applicable
        let organisation: Organisation | null = null;
        if (ent.organisation_id) {
          const { data: orgData } = await supabase
            .from('organisations')
            .select('*')
            .eq('id', ent.organisation_id)
            .single();

          organisation = orgData as Organisation | null;
        }

        return {
          isAuthenticated: true,
          hasAccess: true,
          accessLevel: ent.access_level,
          moduleBundle: ent.module_bundle,
          maxModules: ent.max_modules,
          source: ent.source,
          expiresAt: ent.expires_at,
          organisation,
          entitlementId: ent.entitlement_id,
        };
      }

      // Check if user is member of any organisation (even without direct entitlement)
      const { data: memberships } = await supabase
        .from('organisation_memberships')
        .select(`
          *,
          organisation:organisations(*)
        `)
        .eq('user_id', userId);

      const organisation = memberships?.[0]?.organisation as Organisation | undefined;

      return {
        isAuthenticated: true,
        hasAccess: false,
        organisation: organisation || null,
      };
    } catch (error) {
      console.error('Error in fetchAccessState:', error);
      return { isAuthenticated: true, hasAccess: false };
    }
  }, []);

  // ============================================
  // INITIALIZE AUTH STATE
  // ============================================

  useEffect(() => {
    if (!isSupabaseEnabled() || !supabase) {
      console.log('[AuthContext] Supabase not enabled, skipping auth');
      setIsLoading(false);
      return;
    }

    // Get initial session with timeout
    console.log('[AuthContext] Getting initial session...');

    // Timeout after 30 seconds if Supabase doesn't respond (increased for high-latency regions)
    const timeoutId = setTimeout(() => {
      console.warn('[AuthContext] Session check timed out - Supabase may be unavailable');
      setIsLoading(false);
    }, 30000);

    supabase.auth.getSession()
      .then(({ data: { session: initialSession } }) => {
        clearTimeout(timeoutId);
        console.log('[AuthContext] Session retrieved:', initialSession ? 'exists' : 'none');
        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          console.log('[AuthContext] Fetching access state for user:', initialSession.user.id);
          fetchAccessState(initialSession.user.id).then(setAccessState);
        }

        setIsLoading(false);
        console.log('[AuthContext] Loading complete');
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error('[AuthContext] Error getting session:', error);
        setIsLoading(false);
      });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('[AuthContext] Auth state changed:', event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
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
    console.log('[AuthContext.signUp] Starting for:', email);

    if (!supabase) {
      console.error('[AuthContext.signUp] Supabase not configured');
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    console.log('[AuthContext.signUp] Calling supabase.auth.signUp...');

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

      // Wait up to 30 seconds for signUp (increased for high-latency regions)
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => resolve(null), 30000);
      });

      const result = await Promise.race([signUpPromise, timeoutPromise]);

      if (result && 'error' in result) {
        console.log('[AuthContext.signUp] Result:', { error: result.error });
        return { error: result.error };
      }

      if (!signUpCompleted) {
        // SignUp timed out - try signing in to see if account was created
        console.log('[AuthContext.signUp] Timed out, checking if account was created...');

        try {
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (!signInError) {
            console.log('[AuthContext.signUp] Account was created, sign in successful');
            return { error: null };
          } else if (signInError.message?.includes('Invalid login credentials')) {
            // Account wasn't created or password is wrong
            console.log('[AuthContext.signUp] Account not created or wrong password');
            return { error: { message: 'Sign up timed out. Please try again.' } as AuthError };
          } else {
            console.log('[AuthContext.signUp] Sign in failed:', signInError);
            return { error: signInError };
          }
        } catch (signInErr) {
          console.error('[AuthContext.signUp] Sign in check failed:', signInErr);
          return { error: { message: 'Sign up timed out. Please try again.' } as AuthError };
        }
      }

      console.log('[AuthContext.signUp] Success');
      return { error: null };
    } catch (err) {
      console.error('[AuthContext.signUp] Exception:', err);
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      return { error: { message } as AuthError };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[AuthContext.signIn] Starting for:', email);

    if (!supabase) {
      console.error('[AuthContext.signIn] Supabase not configured');
      return { error: { message: 'Supabase not configured' } as AuthError };
    }

    console.log('[AuthContext.signIn] Calling supabase.auth.signInWithPassword...');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('[AuthContext.signIn] Result:', { error });
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
    }): Promise<{ error: string | null; organisation?: Organisation; inviteCode?: string }> => {
      if (!supabase || !user) {
        return { error: 'Not authenticated' };
      }

      console.log('[createOrganisation] Starting with data:', data);
      console.log('[createOrganisation] User ID:', user.id);

      try {
        // Call RPC function with timeout
        console.log('[createOrganisation] Calling RPC create_organisation_with_admin...');

        const rpcPromise = supabase.rpc(
          'create_organisation_with_admin',
          {
            p_name: data.name,
            p_size: data.size,
            p_contact_email: data.contactEmail,
            p_contact_name: data.contactName,
            p_creator_user_id: user.id,
          }
        );

        // Timeout after 30 seconds (increased for slow connections)
        const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((resolve) => {
          setTimeout(() => {
            console.warn('[createOrganisation] RPC call timed out after 30 seconds');
            resolve({ data: null, error: { message: 'Request timed out. Please check your connection and try again.' } });
          }, 30000);
        });

        const { data: result, error: createError } = await Promise.race([rpcPromise, timeoutPromise]);

        console.log('[createOrganisation] RPC result:', { result, createError });

        if (createError) {
          console.error('[createOrganisation] Error:', createError);
          // Check for specific error types
          if (createError.message?.includes('function') && createError.message?.includes('does not exist')) {
            return { error: 'Database not configured. Please run the migration: 003_org_creation.sql' };
          }
          return { error: createError.message || 'Failed to create organisation' };
        }

        if (!result || result.length === 0) {
          console.error('[createOrganisation] No result returned');
          return { error: 'Failed to create organisation - no data returned' };
        }

        const orgResult = result[0];
        console.log('[createOrganisation] Org created:', orgResult);

        // Fetch full organisation details
        console.log('[createOrganisation] Fetching full org details...');
        const { data: fullOrg } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', orgResult.organisation_id)
          .single();

        // Refresh access state
        console.log('[createOrganisation] Refreshing access state...');
        await refreshAccessState();

        console.log('[createOrganisation] Success:', { fullOrg, inviteCode: orgResult.invite_code });

        return {
          error: null,
          organisation: fullOrg as Organisation,
          inviteCode: orgResult.invite_code,
        };
      } catch (error) {
        console.error('[createOrganisation] Exception:', error);
        return { error: 'An error occurred while creating the organisation' };
      }
    },
    [user, refreshAccessState]
  );

  const joinOrganisation = useCallback(
    async (inviteCode: string): Promise<{ error: string | null; organisation?: Organisation }> => {
      if (!supabase || !user) {
        return { error: 'Not authenticated' };
      }

      console.log('[joinOrganisation] Starting with code:', inviteCode);

      try {
        // Find organisation by invite code using RPC
        console.log('[joinOrganisation] Calling find_org_by_invite_code RPC...');
        const { data: orgData, error: findError } = await supabase.rpc('find_org_by_invite_code', {
          p_invite_code: inviteCode,
        });

        console.log('[joinOrganisation] RPC result:', { orgData, findError });

        if (findError || !orgData || orgData.length === 0) {
          console.log('[joinOrganisation] Invalid invite code');
          return { error: 'Invalid invite code' };
        }

        const org = orgData[0];
        console.log('[joinOrganisation] Found org:', org);

        // Check if already a member
        console.log('[joinOrganisation] Checking existing membership...');
        const { data: existingMembership } = await supabase
          .from('organisation_memberships')
          .select('id')
          .eq('organisation_id', org.id)
          .eq('user_id', user.id)
          .single();

        console.log('[joinOrganisation] Existing membership:', existingMembership);

        if (existingMembership) {
          console.log('[joinOrganisation] Already a member');
          return { error: 'Already a member of this organisation' };
        }

        // Create membership
        console.log('[joinOrganisation] Creating membership...');
        const { error: memberError } = await supabase.from('organisation_memberships').insert({
          organisation_id: org.id,
          user_id: user.id,
          role: 'member',
          invite_accepted_at: new Date().toISOString(),
        });

        console.log('[joinOrganisation] Membership creation result:', { memberError });

        if (memberError) {
          console.error('Error creating membership:', memberError);
          return { error: 'Failed to join organisation' };
        }

        // Fetch full organisation details
        console.log('[joinOrganisation] Fetching full org details...');
        const { data: fullOrg } = await supabase
          .from('organisations')
          .select('*')
          .eq('id', org.id)
          .single();

        console.log('[joinOrganisation] Full org:', fullOrg);

        // Refresh access state
        console.log('[joinOrganisation] Refreshing access state...');
        await refreshAccessState();
        console.log('[joinOrganisation] Access state refreshed');

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

        console.log('Merged anonymous session:', anonymousSessionId);
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
