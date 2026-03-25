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
