-- =====================================================
-- 023. ORG-SCOPED ASSESSMENT DATA + SITES AS FIRST-CLASS
-- =====================================================
-- Shifts module_responses, module_progress, sessions, discovery_data,
-- evidence_files, diap_items from per-user storage to per-org canonical
-- state with per-response user attribution. Adds sites as a first-class
-- entity for multi-site customers.
--
-- All existing data is test data (confirmed 2026-05-20 by Sarah).
-- This migration TRUNCATES the affected tables. Apply this migration
-- BEFORE deploying the matching JS changes that expect the new schema.
--
-- See data-architecture-org-scoped-responses.md for the full design.
-- =====================================================

-- =========================================================================
-- 1. TRUNCATE existing assessment data (test data only)
-- =========================================================================
TRUNCATE module_responses CASCADE;
TRUNCATE module_progress CASCADE;
TRUNCATE sessions CASCADE;
TRUNCATE discovery_data CASCADE;
TRUNCATE evidence_files CASCADE;
TRUNCATE diap_items CASCADE;

-- =========================================================================
-- 2. Sites table (first-class multi-site entity)
-- =========================================================================
CREATE TABLE IF NOT EXISTS sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (organisation_id, name)
);

CREATE INDEX IF NOT EXISTS idx_sites_organisation ON sites(organisation_id);

ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

CREATE POLICY sites_select_org_members ON sites
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sites_insert_org_members ON sites
  FOR INSERT WITH CHECK (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sites_update_org_admins ON sites
  FOR UPDATE USING (
    user_has_role_level(auth.uid(), organisation_id, 'admin')
  );

CREATE POLICY sites_delete_org_admins ON sites
  FOR DELETE USING (
    user_has_role_level(auth.uid(), organisation_id, 'admin')
  );

-- =========================================================================
-- 3. Attribution + site_id columns on assessment tables
-- =========================================================================
ALTER TABLE module_responses
  ADD COLUMN IF NOT EXISTS last_modified_by_user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS last_modified_by_user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

ALTER TABLE diap_items
  ADD COLUMN IF NOT EXISTS site_id UUID REFERENCES sites(id) ON DELETE SET NULL;

-- =========================================================================
-- 4. Replace per-session unique constraints with per-(org, site) unique
-- Partial unique indexes handle the nullable site_id case:
--   - When site_id IS NULL: one canonical record per (org, module, question)
--   - When site_id IS NOT NULL: one canonical record per (org, site, module, question)
-- =========================================================================
ALTER TABLE module_responses
  DROP CONSTRAINT IF EXISTS module_responses_session_id_module_id_question_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS module_responses_org_module_question_no_site_key
  ON module_responses (organisation_id, module_id, question_id)
  WHERE site_id IS NULL AND organisation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS module_responses_org_site_module_question_key
  ON module_responses (organisation_id, site_id, module_id, question_id)
  WHERE site_id IS NOT NULL;

ALTER TABLE module_progress
  DROP CONSTRAINT IF EXISTS module_progress_session_id_module_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS module_progress_org_module_no_site_key
  ON module_progress (organisation_id, module_id)
  WHERE site_id IS NULL AND organisation_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS module_progress_org_site_module_key
  ON module_progress (organisation_id, site_id, module_id)
  WHERE site_id IS NOT NULL;

-- =========================================================================
-- 5. Org-scoped RLS policies (additive — keep existing user-scoped policies
-- so anonymous pre-signup access still works. Postgres OR-passes policies,
-- so adding org-scoped read/write alongside user-scoped read/write means
-- both paths are permitted.)
-- =========================================================================

-- module_responses
CREATE POLICY module_responses_select_org_v2 ON module_responses
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_responses_insert_org_v2 ON module_responses
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_responses_update_org_v2 ON module_responses
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_responses_delete_org_v2 ON module_responses
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- module_progress
CREATE POLICY module_progress_select_org_v2 ON module_progress
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_progress_insert_org_v2 ON module_progress
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_progress_update_org_v2 ON module_progress
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_progress_delete_org_v2 ON module_progress
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- sessions
CREATE POLICY sessions_select_org_v2 ON sessions
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sessions_insert_org_v2 ON sessions
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sessions_update_org_v2 ON sessions
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sessions_delete_org_v2 ON sessions
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- discovery_data
CREATE POLICY discovery_data_select_org_v2 ON discovery_data
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY discovery_data_insert_org_v2 ON discovery_data
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY discovery_data_update_org_v2 ON discovery_data
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY discovery_data_delete_org_v2 ON discovery_data
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- evidence_files
CREATE POLICY evidence_files_select_org_v2 ON evidence_files
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY evidence_files_insert_org_v2 ON evidence_files
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY evidence_files_update_org_v2 ON evidence_files
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY evidence_files_delete_org_v2 ON evidence_files
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- diap_items
CREATE POLICY diap_items_select_org_v2 ON diap_items
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_items_insert_org_v2 ON diap_items
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_items_update_org_v2 ON diap_items
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_items_delete_org_v2 ON diap_items
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

-- =========================================================================
-- 6. Indexes for query performance
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_module_responses_org ON module_responses(organisation_id);
CREATE INDEX IF NOT EXISTS idx_module_responses_org_site ON module_responses(organisation_id, site_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_org ON module_progress(organisation_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_org_site ON module_progress(organisation_id, site_id);
CREATE INDEX IF NOT EXISTS idx_sessions_org ON sessions(organisation_id);
CREATE INDEX IF NOT EXISTS idx_diap_items_org ON diap_items(organisation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_files_org ON evidence_files(organisation_id);

COMMENT ON TABLE sites IS 'First-class multi-site entity. Customers with Multi-Site Pulse/Deep/Plus, Premier/Major Venue, or Authority tiers can create one site per physical location.';
COMMENT ON COLUMN module_responses.last_modified_by_user_id IS 'Per-response user attribution for audit trail. Set on every upsert.';
COMMENT ON COLUMN module_responses.site_id IS 'Optional site association for multi-site customers. NULL means organisation-wide.';
