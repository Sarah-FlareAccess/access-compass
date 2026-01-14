-- =====================================================
-- ACCESS COMPASS - ENUM UPDATES
-- =====================================================
-- Migration: 004a_enum_updates.sql
-- Must be run FIRST and COMMITTED before 004b
-- =====================================================

-- Add new role values to org_role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'viewer' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'viewer';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'editor';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'approver' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'approver';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'owner' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'owner';
  END IF;
END $$;

-- Create membership status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE membership_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
  END IF;
END $$;

-- Create audit action enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
    CREATE TYPE audit_action AS ENUM (
      'user_login',
      'user_logout',
      'user_signup',
      'password_reset',
      'mfa_enabled',
      'mfa_disabled',
      'org_created',
      'org_updated',
      'org_settings_changed',
      'member_invited',
      'member_joined',
      'member_approved',
      'member_rejected',
      'member_suspended',
      'member_reactivated',
      'member_removed',
      'member_role_changed',
      'invite_created',
      'invite_used',
      'invite_revoked',
      'invite_expired',
      'module_started',
      'module_completed',
      'response_submitted',
      'response_updated',
      'evidence_uploaded',
      'evidence_deleted',
      'report_generated',
      'report_exported',
      'data_exported',
      'data_deleted',
      'access_denied',
      'suspicious_activity',
      'ip_blocked',
      'rate_limit_exceeded'
    );
  END IF;
END $$;
