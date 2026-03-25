-- =====================================================
-- MIGRATION 009: Row Level Security policies for data tables
-- =====================================================
-- Principle: Users can CRUD their own data. Users can READ
-- data from their organisation. Org admins/owners can WRITE
-- org-wide data. Unauthenticated users have no access.
--
-- IMPORTANT: After enabling RLS, only rows matching a policy
-- are visible. Existing rows without user_id will be invisible
-- until backfilled. Run the backfill helper after this migration.
-- =====================================================

-- =====================================================
-- ENABLE RLS ON ALL DATA TABLES
-- =====================================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE diap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE diap_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE discovery_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE diap_custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE diap_custom_category_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE diap_team_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_metadata ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER: Check if user is admin/owner of an org
-- =====================================================
CREATE OR REPLACE FUNCTION is_org_admin_or_owner(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE user_id = p_user_id
      AND organisation_id = p_org_id
      AND status = 'active'
      AND role IN ('admin', 'owner')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- =====================================================
-- SESSIONS
-- =====================================================
CREATE POLICY sessions_select_own ON sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY sessions_select_org ON sessions
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sessions_insert_own ON sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY sessions_update_own ON sessions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY sessions_delete_own ON sessions
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- MODULE PROGRESS
-- =====================================================
CREATE POLICY module_progress_select_own ON module_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY module_progress_select_org ON module_progress
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_progress_insert_own ON module_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY module_progress_update_own ON module_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY module_progress_delete_own ON module_progress
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- MODULE RESPONSES
-- =====================================================
CREATE POLICY module_responses_select_own ON module_responses
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY module_responses_select_org ON module_responses
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY module_responses_insert_own ON module_responses
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY module_responses_update_own ON module_responses
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY module_responses_delete_own ON module_responses
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DIAP ITEMS
-- =====================================================
CREATE POLICY diap_items_select_own ON diap_items
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY diap_items_select_org ON diap_items
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_items_insert_own ON diap_items
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY diap_items_update_own ON diap_items
  FOR UPDATE USING (user_id = auth.uid());

-- Org admins can also update DIAP items for their org
CREATE POLICY diap_items_update_org_admin ON diap_items
  FOR UPDATE USING (
    is_org_admin_or_owner(auth.uid(), organisation_id)
  );

CREATE POLICY diap_items_delete_own ON diap_items
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DIAP DOCUMENTS
-- =====================================================
CREATE POLICY diap_documents_select_own ON diap_documents
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY diap_documents_select_org ON diap_documents
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_documents_insert_own ON diap_documents
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY diap_documents_update_own ON diap_documents
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY diap_documents_delete_own ON diap_documents
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DISCOVERY DATA
-- =====================================================
CREATE POLICY discovery_data_select_own ON discovery_data
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY discovery_data_select_org ON discovery_data
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY discovery_data_insert_own ON discovery_data
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY discovery_data_update_own ON discovery_data
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY discovery_data_delete_own ON discovery_data
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DISCOVERY PROGRESS
-- =====================================================
CREATE POLICY discovery_progress_select_own ON discovery_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY discovery_progress_insert_own ON discovery_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY discovery_progress_update_own ON discovery_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY discovery_progress_delete_own ON discovery_progress
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- ASSESSMENT ACTIONS
-- =====================================================
CREATE POLICY actions_select_own ON actions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY actions_select_org ON actions
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY actions_insert_own ON actions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY actions_update_own ON actions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY actions_delete_own ON actions
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- ASSESSMENT EVIDENCE
-- =====================================================
CREATE POLICY evidence_select_own ON evidence
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY evidence_select_org ON evidence
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY evidence_insert_own ON evidence
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY evidence_delete_own ON evidence
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- ASSESSMENT CLARIFICATIONS
-- =====================================================
CREATE POLICY clarifications_select_own ON clarifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY clarifications_select_org ON clarifications
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY clarifications_insert_own ON clarifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY clarifications_update_own ON clarifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY clarifications_delete_own ON clarifications
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- TRAINING PROGRESS
-- =====================================================
CREATE POLICY training_progress_select_own ON training_progress
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY training_progress_insert_own ON training_progress
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY training_progress_update_own ON training_progress
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY training_progress_delete_own ON training_progress
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DIAP CUSTOM CATEGORIES
-- =====================================================
CREATE POLICY diap_custom_categories_select_own ON diap_custom_categories
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY diap_custom_categories_select_org ON diap_custom_categories
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_custom_categories_insert_own ON diap_custom_categories
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY diap_custom_categories_update_own ON diap_custom_categories
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY diap_custom_categories_delete_own ON diap_custom_categories
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DIAP CUSTOM CATEGORY NAMES
-- =====================================================
CREATE POLICY diap_category_names_select_own ON diap_custom_category_names
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY diap_category_names_select_org ON diap_custom_category_names
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_category_names_insert_own ON diap_custom_category_names
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY diap_category_names_update_own ON diap_custom_category_names
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY diap_category_names_delete_own ON diap_custom_category_names
  FOR DELETE USING (user_id = auth.uid());

-- =====================================================
-- DIAP TEAM ROLES
-- =====================================================
CREATE POLICY diap_team_roles_select_org ON diap_team_roles
  FOR SELECT USING (
    organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY diap_team_roles_insert_own ON diap_team_roles
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Only admins/owners can manage team roles
CREATE POLICY diap_team_roles_update_admin ON diap_team_roles
  FOR UPDATE USING (
    is_org_admin_or_owner(auth.uid(), organisation_id)
  );

CREATE POLICY diap_team_roles_delete_admin ON diap_team_roles
  FOR DELETE USING (
    is_org_admin_or_owner(auth.uid(), organisation_id)
  );

-- =====================================================
-- SYNC METADATA
-- =====================================================
CREATE POLICY sync_metadata_select_own ON sync_metadata
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY sync_metadata_insert_own ON sync_metadata
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY sync_metadata_update_own ON sync_metadata
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY sync_metadata_delete_own ON sync_metadata
  FOR DELETE USING (user_id = auth.uid());
