// ============================================
// ACCESS COMPASS - ORG ADMIN HOOK
// ============================================
// Provides admin functions for organisation management
// ============================================

import { useState, useCallback } from 'react';
import { supabase } from '../utils/supabase';
import type {
  OrganisationMembership,
  InviteCode,
  AuditLog,
  OrgSecuritySettings,
  OrgRole,
} from '../types/access';

interface UseOrgAdminResult {
  // Loading states
  isLoading: boolean;
  error: string | null;

  // Member management
  getMembers: (orgId: string) => Promise<OrganisationMembership[]>;
  getPendingMembers: (orgId: string) => Promise<OrganisationMembership[]>;
  approveMember: (membershipId: string) => Promise<boolean>;
  rejectMember: (membershipId: string, reason?: string) => Promise<boolean>;
  suspendMember: (membershipId: string, reason: string) => Promise<boolean>;
  reactivateMember: (membershipId: string) => Promise<boolean>;
  changeRole: (membershipId: string, newRole: OrgRole) => Promise<boolean>;
  removeMember: (membershipId: string) => Promise<boolean>;

  // Ownership management
  transferOwnership: (orgId: string, newOwnerUserId: string) => Promise<{ success: boolean; message: string }>;
  leaveOrganisation: (orgId: string) => Promise<{ success: boolean; message: string }>;
  getOrgOwner: (orgId: string) => Promise<{ userId: string; email: string } | null>;
  isOrgOwner: (orgId: string) => Promise<boolean>;

  // Invite code management
  getInviteCodes: (orgId: string) => Promise<InviteCode[]>;
  createInviteCode: (
    orgId: string,
    options?: {
      expiresInDays?: number;
      maxUses?: number;
      allowedRoles?: OrgRole[];
      allowedEmailDomains?: string[];
      label?: string;
    }
  ) => Promise<{ code: string; expiresAt: string | null } | null>;
  revokeInviteCode: (code: string) => Promise<boolean>;

  // Audit logs
  getAuditLogs: (
    orgId: string,
    options?: { days?: number; limit?: number }
  ) => Promise<AuditLog[]>;

  // Security settings
  getSecuritySettings: (orgId: string) => Promise<OrgSecuritySettings | null>;
  updateSecuritySettings: (
    orgId: string,
    settings: Partial<{
      requireApproval: boolean;
      requireMfa: boolean;
      sessionTimeoutMinutes: number;
      allowedIpRanges: string[];
    }>
  ) => Promise<boolean>;

  // Data export
  exportUserData: (orgId: string, userId?: string) => Promise<Record<string, unknown> | null>;
  requestDataDeletion: (orgId: string) => Promise<boolean>;
}

export function useOrgAdmin(): UseOrgAdminResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // MEMBER MANAGEMENT
  // ============================================

  const getMembers = useCallback(async (orgId: string): Promise<OrganisationMembership[]> => {
    if (!supabase) return [];

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.rpc('get_org_members', {
        p_org_id: orgId,
      });

      if (fetchError) {
        setError(fetchError.message);
        return [];
      }

      return (data || []).map((m: Record<string, unknown>) => ({
        id: m.membership_id,
        organisation_id: orgId,
        user_id: m.user_id,
        user_email: m.user_email,
        role: m.role,
        status: m.status,
        joined_at: m.joined_at,
        approved_at: m.approved_at,
      })) as OrganisationMembership[];
    } catch (err) {
      setError('Failed to fetch members');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getPendingMembers = useCallback(async (orgId: string): Promise<OrganisationMembership[]> => {
    if (!supabase) return [];

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase.rpc('get_pending_members', {
        p_org_id: orgId,
      });

      if (fetchError) {
        setError(fetchError.message);
        return [];
      }

      return (data || []).map((m: Record<string, unknown>) => ({
        id: m.membership_id,
        organisation_id: orgId,
        user_id: m.user_id,
        user_email: m.user_email,
        role: m.role,
        status: 'pending' as const,
        joined_at: m.requested_at,
      })) as OrganisationMembership[];
    } catch (err) {
      setError('Failed to fetch pending members');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveMember = useCallback(async (membershipId: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: approveError } = await supabase.rpc('approve_member', {
        p_membership_id: membershipId,
      });

      if (approveError) {
        setError(approveError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to approve member');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const rejectMember = useCallback(async (membershipId: string, reason?: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: rejectError } = await supabase.rpc('reject_member', {
        p_membership_id: membershipId,
        p_reason: reason || null,
      });

      if (rejectError) {
        setError(rejectError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to reject member');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const suspendMember = useCallback(async (membershipId: string, reason: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: suspendError } = await supabase.rpc('suspend_member', {
        p_membership_id: membershipId,
        p_reason: reason,
      });

      if (suspendError) {
        setError(suspendError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to suspend member');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reactivateMember = useCallback(async (membershipId: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: reactivateError } = await supabase.rpc('reactivate_member', {
        p_membership_id: membershipId,
      });

      if (reactivateError) {
        setError(reactivateError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to reactivate member');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeRole = useCallback(async (membershipId: string, newRole: OrgRole): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: roleError } = await supabase.rpc('change_member_role', {
        p_membership_id: membershipId,
        p_new_role: newRole,
      });

      if (roleError) {
        setError(roleError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to change role');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (membershipId: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: removeError } = await supabase
        .from('organisation_memberships')
        .delete()
        .eq('id', membershipId);

      if (removeError) {
        setError(removeError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to remove member');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // OWNERSHIP MANAGEMENT
  // ============================================

  const transferOwnership = useCallback(
    async (orgId: string, newOwnerUserId: string): Promise<{ success: boolean; message: string }> => {
      if (!supabase) return { success: false, message: 'Supabase not available' };

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: transferError } = await supabase.rpc('transfer_ownership', {
          p_org_id: orgId,
          p_new_owner_user_id: newOwnerUserId,
        });

        if (transferError) {
          setError(transferError.message);
          return { success: false, message: transferError.message };
        }

        if (data && data.length > 0) {
          return { success: data[0].success, message: data[0].message };
        }

        return { success: false, message: 'Unknown error occurred' };
      } catch (err) {
        const message = 'Failed to transfer ownership';
        setError(message);
        return { success: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const leaveOrganisation = useCallback(
    async (orgId: string): Promise<{ success: boolean; message: string }> => {
      if (!supabase) return { success: false, message: 'Supabase not available' };

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: leaveError } = await supabase.rpc('leave_organisation', {
          p_org_id: orgId,
        });

        if (leaveError) {
          setError(leaveError.message);
          return { success: false, message: leaveError.message };
        }

        if (data && data.length > 0) {
          return { success: data[0].success, message: data[0].message };
        }

        return { success: false, message: 'Unknown error occurred' };
      } catch (err) {
        const message = 'Failed to leave organisation';
        setError(message);
        return { success: false, message };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getOrgOwner = useCallback(
    async (orgId: string): Promise<{ userId: string; email: string } | null> => {
      if (!supabase) return null;

      try {
        const { data, error: fetchError } = await supabase.rpc('get_org_owner', {
          p_org_id: orgId,
        });

        if (fetchError || !data || data.length === 0) {
          return null;
        }

        return {
          userId: data[0].user_id,
          email: data[0].user_email,
        };
      } catch (err) {
        return null;
      }
    },
    []
  );

  const isOrgOwner = useCallback(async (orgId: string): Promise<boolean> => {
    if (!supabase) return false;

    try {
      const { data, error: checkError } = await supabase.rpc('is_org_owner', {
        p_org_id: orgId,
      });

      if (checkError) return false;
      return data === true;
    } catch (err) {
      return false;
    }
  }, []);

  // ============================================
  // INVITE CODE MANAGEMENT
  // ============================================

  const getInviteCodes = useCallback(async (orgId: string): Promise<InviteCode[]> => {
    if (!supabase) return [];

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('organisation_invite_codes')
        .select('*')
        .eq('organisation_id', orgId)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
        return [];
      }

      return data as InviteCode[];
    } catch (err) {
      setError('Failed to fetch invite codes');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createInviteCode = useCallback(
    async (
      orgId: string,
      options?: {
        expiresInDays?: number;
        maxUses?: number;
        allowedRoles?: OrgRole[];
        allowedEmailDomains?: string[];
        label?: string;
      }
    ): Promise<{ code: string; expiresAt: string | null } | null> => {
      if (!supabase) return null;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: createError } = await supabase.rpc('create_invite_code', {
          p_org_id: orgId,
          p_expires_in_days: options?.expiresInDays ?? 30,
          p_max_uses: options?.maxUses ?? null,
          p_allowed_roles: options?.allowedRoles ?? ['member'],
          p_allowed_email_domains: options?.allowedEmailDomains ?? null,
          p_label: options?.label ?? null,
        });

        if (createError) {
          setError(createError.message);
          return null;
        }

        if (data && data.length > 0) {
          return {
            code: data[0].invite_code,
            expiresAt: data[0].expires_at,
          };
        }

        return null;
      } catch (err) {
        setError('Failed to create invite code');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const revokeInviteCode = useCallback(async (code: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: revokeError } = await supabase.rpc('revoke_invite_code', {
        p_code: code,
      });

      if (revokeError) {
        setError(revokeError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to revoke invite code');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ============================================
  // AUDIT LOGS
  // ============================================

  const getAuditLogs = useCallback(
    async (
      orgId: string,
      options?: { days?: number; limit?: number }
    ): Promise<AuditLog[]> => {
      if (!supabase) return [];

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase.rpc('get_audit_log_summary', {
          p_org_id: orgId,
          p_days: options?.days ?? 30,
          p_limit: options?.limit ?? 100,
        });

        if (fetchError) {
          setError(fetchError.message);
          return [];
        }

        return data as AuditLog[];
      } catch (err) {
        setError('Failed to fetch audit logs');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================
  // SECURITY SETTINGS
  // ============================================

  const getSecuritySettings = useCallback(
    async (orgId: string): Promise<OrgSecuritySettings | null> => {
      if (!supabase) return null;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: fetchError } = await supabase.rpc('get_org_security_settings', {
          p_org_id: orgId,
        });

        if (fetchError) {
          setError(fetchError.message);
          return null;
        }

        if (data && data.length > 0) {
          const settings = data[0];
          return {
            require_approval: settings.require_approval,
            require_mfa: settings.require_mfa,
            session_timeout_minutes: settings.session_timeout_minutes,
            has_ip_restrictions: settings.has_ip_restrictions,
            pending_member_count: settings.pending_member_count,
          };
        }

        return null;
      } catch (err) {
        setError('Failed to fetch security settings');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateSecuritySettings = useCallback(
    async (
      orgId: string,
      settings: Partial<{
        requireApproval: boolean;
        requireMfa: boolean;
        sessionTimeoutMinutes: number;
        allowedIpRanges: string[];
      }>
    ): Promise<boolean> => {
      if (!supabase) return false;

      setIsLoading(true);
      setError(null);

      try {
        const { error: updateError } = await supabase.rpc('update_org_security_settings', {
          p_org_id: orgId,
          p_require_approval: settings.requireApproval ?? null,
          p_require_mfa: settings.requireMfa ?? null,
          p_session_timeout_minutes: settings.sessionTimeoutMinutes ?? null,
          p_allowed_ip_ranges: settings.allowedIpRanges ?? null,
        });

        if (updateError) {
          setError(updateError.message);
          return false;
        }

        return true;
      } catch (err) {
        setError('Failed to update security settings');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // ============================================
  // DATA EXPORT
  // ============================================

  const exportUserData = useCallback(
    async (orgId: string, userId?: string): Promise<Record<string, unknown> | null> => {
      if (!supabase) return null;

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: exportError } = await supabase.rpc('export_user_data', {
          p_org_id: orgId,
          p_user_id: userId ?? null,
        });

        if (exportError) {
          setError(exportError.message);
          return null;
        }

        return data;
      } catch (err) {
        setError('Failed to export data');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const requestDataDeletion = useCallback(async (orgId: string): Promise<boolean> => {
    if (!supabase) return false;

    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase.rpc('request_data_deletion', {
        p_org_id: orgId,
      });

      if (deleteError) {
        setError(deleteError.message);
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to request deletion');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getMembers,
    getPendingMembers,
    approveMember,
    rejectMember,
    suspendMember,
    reactivateMember,
    changeRole,
    removeMember,
    transferOwnership,
    leaveOrganisation,
    getOrgOwner,
    isOrgOwner,
    getInviteCodes,
    createInviteCode,
    revokeInviteCode,
    getAuditLogs,
    getSecuritySettings,
    updateSecuritySettings,
    exportUserData,
    requestDataDeletion,
  };
}
