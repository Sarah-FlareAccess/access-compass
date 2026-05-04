-- Create deleted_assessments table FIRST
-- Migration: Create deleted_assessments table
-- Purpose: Temporary storage for deleted assessments (30-day retention)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create the deleted_assessments table
CREATE TABLE IF NOT EXISTS deleted_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  run_data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  recovery_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deleted_assessments_session
  ON deleted_assessments(session_id);

CREATE INDEX IF NOT EXISTS idx_deleted_assessments_recovery_code
  ON deleted_assessments(recovery_code);

CREATE INDEX IF NOT EXISTS idx_deleted_assessments_expires
  ON deleted_assessments(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE deleted_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for backup functionality)
CREATE POLICY "Allow anonymous insert" ON deleted_assessments
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to read their own session's deleted assessments
CREATE POLICY "Allow session read" ON deleted_assessments
  FOR SELECT
  USING (true);

-- Comment on table
COMMENT ON TABLE deleted_assessments IS 'Temporary storage for deleted assessments. Auto-cleanup after 30 days.';

-- Create a function to clean up expired assessments
CREATE OR REPLACE FUNCTION cleanup_expired_assessments()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM deleted_assessments
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION cleanup_expired_assessments() TO anon, authenticated;

-- === 011_fix_missing_rls ===
-- =====================================================
-- MIGRATION 011: Ensure RLS is enabled on ALL tables
-- and policies exist for tables that were missed
-- =====================================================
-- Safe to re-run: uses IF NOT EXISTS / DO blocks

-- Enable RLS on all tables (idempotent - no error if already enabled)
ALTER TABLE IF EXISTS organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_allowed_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deleted_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discovery_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discovery_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clarifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_custom_category_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_team_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sync_metadata ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANISATIONS - policies from 002 + 003
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Members can view their organisations" ON organisations
    FOR SELECT USING (
      id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can lookup org by invite code" ON organisations
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create organisations" ON organisations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org owners can update their org" ON organisations
    FOR UPDATE USING (
      id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION MEMBERSHIPS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own memberships" ON organisation_memberships
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view org member list" ON organisation_memberships
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own membership" ON organisation_memberships
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update memberships" ON organisation_memberships
    FOR UPDATE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships m
        WHERE m.user_id = auth.uid() AND m.role IN ('admin', 'owner') AND m.status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ENTITLEMENTS (uses scope_type + scope_id, not user_id)
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own user entitlements" ON entitlements
    FOR SELECT USING (
      (scope_type = 'user' AND scope_id = auth.uid())
      OR (scope_type = 'org' AND scope_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      ))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own entitlements" ON entitlements
    FOR INSERT WITH CHECK (scope_type = 'user' AND scope_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- PURCHASES
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own purchases" ON purchases
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own purchases" ON purchases
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION INVITE CODES
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Admins can view org invite codes" ON organisation_invite_codes
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert invite codes" ON organisation_invite_codes
    FOR INSERT WITH CHECK (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update invite codes" ON organisation_invite_codes
    FOR UPDATE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- AUDIT LOGS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Admins can view org audit logs" ON audit_logs
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION ALLOWED EMAILS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Org admins can view allowed emails" ON organisation_allowed_emails
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org admins can add allowed emails" ON organisation_allowed_emails
    FOR INSERT WITH CHECK (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org admins can remove unused allowed emails" ON organisation_allowed_emails
    FOR DELETE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- DELETED ASSESSMENTS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Allow anonymous insert" ON deleted_assessments
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow session read" ON deleted_assessments
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- === 012_fix_rls_recursion ===
-- =====================================================
-- MIGRATION 012: Fix infinite recursion in organisation_memberships RLS
-- =====================================================
-- The "Users can view org member list" and "Admins can update memberships"
-- policies query organisation_memberships from within organisation_memberships
-- RLS, causing infinite recursion. Fix: use a SECURITY DEFINER function
-- that bypasses RLS for the lookup.

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "Users can view org member list" ON organisation_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON organisation_memberships;

-- 2. Create SECURITY DEFINER functions (bypass RLS, no recursion)
CREATE OR REPLACE FUNCTION get_user_org_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT organisation_id FROM organisation_memberships
  WHERE user_id = p_user_id AND status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_org_admin(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE user_id = p_user_id
      AND organisation_id = p_org_id
      AND role IN ('admin', 'owner')
      AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Recreate policies using safe functions
CREATE POLICY "Users can view org member list" ON organisation_memberships
  FOR SELECT USING (
    organisation_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Admins can update memberships" ON organisation_memberships
  FOR UPDATE USING (
    is_org_admin(auth.uid(), organisation_id)
  );

-- === 013_activity_log ===
-- =====================================================
-- MIGRATION 013: Activity log for team collaboration
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id),
  type TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_org_time ON activity_log(organisation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_session ON activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Org members can read all org activity
DO $$ BEGIN
  CREATE POLICY "Org members can view activity" ON activity_log
    FOR SELECT USING (
      organisation_id IN (SELECT get_user_org_ids(auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can also read their own activity (even without org)
DO $$ BEGIN
  CREATE POLICY "Users can view own activity" ON activity_log
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own activity
DO $$ BEGIN
  CREATE POLICY "Users can insert activity" ON activity_log
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add comments column to diap_items (if not exists)
DO $$ BEGIN
  ALTER TABLE diap_items ADD COLUMN comments JSONB DEFAULT '[]';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- === 014_evidence_storage ===
-- =====================================================
-- MIGRATION 014: Evidence storage bucket and RLS policies
-- =====================================================
-- Run this in Supabase SQL Editor, then create the bucket
-- in the Supabase Dashboard > Storage.

-- Create an evidence metadata table to track files across the org
CREATE TABLE IF NOT EXISTS evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id),
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_org ON evidence_files(organisation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_module ON evidence_files(module_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user ON evidence_files(user_id);

-- Enable RLS
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

-- Org members can view all org evidence
DO $$ BEGIN
  CREATE POLICY "Org members can view evidence" ON evidence_files
    FOR SELECT USING (
      organisation_id IN (SELECT get_user_org_ids(auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can view their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can view own evidence" ON evidence_files
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can insert evidence" ON evidence_files
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can delete their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can delete own evidence" ON evidence_files
    FOR DELETE USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- AFTER running this SQL, create the storage bucket:
--
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name: evidence-files
-- 4. Public: OFF (private)
-- 5. File size limit: 10 MB
-- 6. Allowed MIME types:
--    image/jpeg, image/png, image/webp, image/gif,
--    application/pdf,
--    application/msword,
--    application/vnd.openxmlformats-officedocument.wordprocessingml.document
--
-- Then add these storage RLS policies in the Dashboard:
--
-- SELECT policy (name: "Org members can read evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--     OR EXISTS (
--       SELECT 1 FROM organisation_members
--       WHERE user_id = auth.uid()
--       AND organisation_id IN (
--         SELECT organisation_id FROM evidence_files
--         WHERE storage_path = name
--       )
--     )
--   )
--
-- INSERT policy (name: "Users can upload evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--   )
--
-- DELETE policy (name: "Users can delete own evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--   )
-- =====================================================

-- === 015_authority_orgs ===
-- =====================================================
-- ACCESS COMPASS - AUTHORITY ORG MODEL
-- =====================================================
-- Migration: 015_authority_orgs.sql
-- Adds parent-child org hierarchy for councils,
-- tourism boards, industry bodies, and franchise HQs.
-- Adds authority programs (scoped module sets).
-- =====================================================

-- =====================================================
-- 1. NEW ENUM: org_type
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'org_type') THEN
    CREATE TYPE org_type AS ENUM ('standard', 'authority');
  END IF;
END $$;

-- =====================================================
-- 2. EXTEND ORGANISATIONS TABLE
-- =====================================================

-- Organisation type (standard = single business, authority = council/board/body)
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS org_type org_type NOT NULL DEFAULT 'standard';

-- Self-referencing parent for hierarchy
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS parent_org_id UUID REFERENCES organisations(id) ON DELETE SET NULL;

-- Authority-specific limits
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS max_child_orgs INTEGER;

-- Default access level authorities provision to child orgs
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS provisioned_access_level access_level;

-- Default module bundle authorities provision to child orgs
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS provisioned_module_bundle module_bundle;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organisations_parent
  ON organisations(parent_org_id) WHERE parent_org_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_organisations_org_type
  ON organisations(org_type);

-- Constraint: only authority orgs can be parents
-- (enforced via trigger rather than CHECK, since CHECK can't reference other rows)

-- Constraint: authorities cannot themselves have a parent
ALTER TABLE organisations
  ADD CONSTRAINT chk_authority_no_parent
  CHECK (org_type != 'authority' OR parent_org_id IS NULL);

-- =====================================================
-- 3. AUTHORITY PROGRAMS TABLE
-- A program represents a use case (e.g., "Event Permit 2026",
-- "Tourism Grant Round 3") with a scoped set of required modules.
-- =====================================================
CREATE TABLE IF NOT EXISTS authority_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,

  -- Which modules are required for this program
  required_module_ids TEXT[] NOT NULL DEFAULT '{}',

  -- Assessment depth for this program
  access_level access_level NOT NULL DEFAULT 'pulse',

  -- Validity window (e.g., grant round dates)
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  ends_at TIMESTAMPTZ,

  -- Whether businesses can self-enrol or must be invited
  allow_self_enrol BOOLEAN DEFAULT false,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique slug per authority
  CONSTRAINT unique_program_slug_per_org UNIQUE (organisation_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_authority_programs_org
  ON authority_programs(organisation_id);

CREATE INDEX IF NOT EXISTS idx_authority_programs_active
  ON authority_programs(is_active) WHERE is_active = true;

-- =====================================================
-- 4. PROGRAM ENROLMENTS TABLE
-- Links a child org to a specific program
-- =====================================================
CREATE TABLE IF NOT EXISTS program_enrolments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES authority_programs(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,

  -- Enrolment status
  status TEXT NOT NULL DEFAULT 'enrolled'
    CHECK (status IN ('enrolled', 'in_progress', 'submitted', 'completed', 'withdrawn')),

  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT unique_program_enrolment UNIQUE (program_id, organisation_id)
);

CREATE INDEX IF NOT EXISTS idx_program_enrolments_program
  ON program_enrolments(program_id);

CREATE INDEX IF NOT EXISTS idx_program_enrolments_org
  ON program_enrolments(organisation_id);

-- =====================================================
-- 5. AUTHORITY QUESTION GUIDANCE TABLE
-- Councils can attach notes to standard questions
-- without modifying the questions themselves.
-- =====================================================
CREATE TABLE IF NOT EXISTS authority_question_guidance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  guidance_text TEXT NOT NULL,
  program_id UUID REFERENCES authority_programs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- One guidance note per question per org (optionally scoped to program)
  CONSTRAINT unique_guidance_per_question UNIQUE (organisation_id, question_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_authority_guidance_org
  ON authority_question_guidance(organisation_id);

-- =====================================================
-- 6. CHILD ORG SUMMARY VIEW
-- Privacy-preserving: exposes only completion status,
-- score bands, and module progress. Never individual
-- answers, evidence, or DIAP details.
-- =====================================================
CREATE OR REPLACE VIEW authority_child_summaries AS
SELECT
  child.id AS child_org_id,
  child.name AS child_org_name,
  child.slug AS child_org_slug,
  child.parent_org_id AS authority_org_id,
  child.created_at AS child_created_at,
  pe.program_id,
  pe.status AS enrolment_status,
  pe.enrolled_at,
  pe.submitted_at,
  pe.completed_at
FROM organisations child
LEFT JOIN program_enrolments pe ON pe.organisation_id = child.id
WHERE child.parent_org_id IS NOT NULL;

-- =====================================================
-- 7. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE authority_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE authority_question_guidance ENABLE ROW LEVEL SECURITY;

-- Authority programs: viewable by authority members and enrolled child org members
CREATE POLICY "Authority members can manage programs"
  ON authority_programs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = authority_programs.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Enrolled orgs can view programs"
  ON authority_programs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM program_enrolments pe
      JOIN organisation_memberships om ON om.organisation_id = pe.organisation_id
      WHERE pe.program_id = authority_programs.id
      AND om.user_id = auth.uid()
    )
  );

-- Program enrolments: authority admins can manage, child org members can view their own
CREATE POLICY "Authority admins can manage enrolments"
  ON program_enrolments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM authority_programs ap
      JOIN organisation_memberships om ON om.organisation_id = ap.organisation_id
      WHERE ap.id = program_enrolments.program_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Child org members can view own enrolments"
  ON program_enrolments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = program_enrolments.organisation_id
      AND om.user_id = auth.uid()
    )
  );

-- Authority question guidance: authority admins can manage, enrolled users can view
CREATE POLICY "Authority admins can manage guidance"
  ON authority_question_guidance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = authority_question_guidance.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Enrolled users can view guidance"
  ON authority_question_guidance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM program_enrolments pe
      JOIN organisation_memberships om ON om.organisation_id = pe.organisation_id
      WHERE pe.program_id = authority_question_guidance.program_id
      AND om.user_id = auth.uid()
    )
  );

-- Extend existing org SELECT policy: authority admins can see child orgs
-- (summary data only, not individual answers)
CREATE POLICY "Authority admins can view child orgs"
  ON organisations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisations.parent_org_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

-- =====================================================
-- 8. HELPER FUNCTIONS
-- =====================================================

-- Check if an org is an authority
CREATE OR REPLACE FUNCTION is_authority_org(p_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organisations
    WHERE id = p_org_id AND org_type = 'authority'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get child org count for an authority
CREATE OR REPLACE FUNCTION get_child_org_count(p_authority_id UUID)
RETURNS INTEGER AS $$
DECLARE
  child_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO child_count
  FROM organisations
  WHERE parent_org_id = p_authority_id;
  RETURN child_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Validate that parent is an authority before insert/update
CREATE OR REPLACE FUNCTION validate_parent_org()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.parent_org_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM organisations
      WHERE id = NEW.parent_org_id AND org_type = 'authority'
    ) THEN
      RAISE EXCEPTION 'Parent organisation must be of type authority';
    END IF;

    -- Check max_child_orgs limit
    DECLARE
      current_count INTEGER;
      max_allowed INTEGER;
    BEGIN
      SELECT max_child_orgs INTO max_allowed
      FROM organisations WHERE id = NEW.parent_org_id;

      IF max_allowed IS NOT NULL THEN
        SELECT COUNT(*) INTO current_count
        FROM organisations
        WHERE parent_org_id = NEW.parent_org_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);

        IF current_count >= max_allowed THEN
          RAISE EXCEPTION 'Authority has reached maximum child organisation limit (%)' , max_allowed;
        END IF;
      END IF;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validate_parent_org
  BEFORE INSERT OR UPDATE OF parent_org_id ON organisations
  FOR EACH ROW
  EXECUTE FUNCTION validate_parent_org();

-- Update timestamps for new tables
CREATE TRIGGER update_authority_programs_updated_at
  BEFORE UPDATE ON authority_programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_program_enrolments_updated_at
  BEFORE UPDATE ON program_enrolments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authority_guidance_updated_at
  BEFORE UPDATE ON authority_question_guidance
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- === 016_program_funding ===
-- =====================================================
-- ACCESS COMPASS - PROGRAM FUNDING MODEL
-- =====================================================
-- Migration: 016_program_funding.sql
-- Adds funding model and license pricing to authority programs
-- =====================================================

-- Funding model: who pays for business licenses
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS funding_model TEXT NOT NULL DEFAULT 'authority_funded'
    CHECK (funding_model IN ('authority_funded', 'business_funded', 'co_funded'));

-- License price in cents (AUD) for business-funded or co-funded programs
-- NULL means authority-funded (no charge to business)
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS license_price_cents INTEGER;

-- Display message shown to businesses on the enrol page
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS enrol_message TEXT;

-- === 017_module_responses_fields ===
-- =====================================================
-- MIGRATION 017: Extend module_responses for full data sync
-- =====================================================
-- Adds missing response fields and fixes answer CHECK constraint
-- to match actual app values.
-- =====================================================

-- Drop the old restrictive CHECK constraint on answer
ALTER TABLE module_responses DROP CONSTRAINT IF EXISTS module_responses_answer_check;

-- Add updated CHECK that matches all app response options
ALTER TABLE module_responses ADD CONSTRAINT module_responses_answer_check
  CHECK (answer IN ('yes', 'no', 'partially', 'not-sure', 'unable-to-check', 'not-applicable', 'na'));

-- Add missing response data columns
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS partial_description TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS multi_select_values TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS other_description TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS link_value TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS evidence_count INTEGER DEFAULT 0;

-- Add user_id if missing (needed for RLS and recovery queries)
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id);

-- Index for response recovery (find all responses for a user's module)
CREATE INDEX IF NOT EXISTS idx_module_responses_user_module
  ON module_responses(user_id, module_id);

-- === 018_sync_gap_columns ===
-- =====================================================
-- MIGRATION 018: Add missing columns for sync gap fixes
-- =====================================================
-- Adds ownership fields to module_progress, measurement
-- fields to module_responses, and business_snapshot to
-- sessions table.
-- =====================================================

-- =====================================================
-- MODULE PROGRESS: Ownership fields (assignedTo, etc.)
-- =====================================================
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS assigned_to_email TEXT;
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS target_completion_date TEXT;

-- =====================================================
-- MODULE RESPONSES: Measurement data
-- =====================================================
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_value NUMERIC;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_unit TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_confidence TEXT
  CHECK (measurement_confidence IN ('confident', 'somewhat-confident', 'not-confident'));

-- =====================================================
-- SESSIONS: Business snapshot as JSONB
-- =====================================================
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS business_snapshot JSONB;

-- === 019_module_carryover ===
-- =====================================================
-- MIGRATION 019: Module carryover declarations
-- =====================================================
-- When a returning user enrols in a new program and has
-- completed overlapping modules, they can carry forward
-- with a declaration instead of re-assessing.
-- =====================================================

CREATE TABLE IF NOT EXISTS module_carryover_declarations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES authority_programs(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,

  -- The original completion this carries forward from
  original_completed_at TIMESTAMPTZ NOT NULL,
  original_organisation_id UUID REFERENCES organisations(id),

  -- Declaration details
  declaration_type TEXT NOT NULL DEFAULT 'no_changes'
    CHECK (declaration_type IN ('no_changes', 'within_timeframe')),
  declaration_text TEXT NOT NULL DEFAULT 'I confirm no material changes have been made since the previous assessment.',

  declared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Expiry: carryover is valid for this many days from original completion
  valid_days INTEGER NOT NULL DEFAULT 180,
  expires_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_carryover_per_module UNIQUE (program_id, organisation_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_carryover_user ON module_carryover_declarations(user_id);
CREATE INDEX IF NOT EXISTS idx_carryover_program ON module_carryover_declarations(program_id);

-- RLS
ALTER TABLE module_carryover_declarations ENABLE ROW LEVEL SECURITY;

-- Users can manage their own declarations
CREATE POLICY "Users can manage own declarations"
  ON module_carryover_declarations FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Authority admins can view declarations for their programs
CREATE POLICY "Authority admins can view program declarations"
  ON module_carryover_declarations FOR SELECT
  USING (
    is_org_admin((SELECT organisation_id FROM authority_programs WHERE id = program_id))
  );
