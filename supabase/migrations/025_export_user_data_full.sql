-- =========================================================================
-- Migration 025: Extend export_user_data to include assessment artefacts
-- =========================================================================
-- The original export_user_data RPC (in 004b_security_enhancements.sql)
-- returned only membership, sessions and audit_logs. That's a thin slice of
-- what a Privacy-Act-grade "give me my data" export should contain — it
-- omits the actual assessment work (responses, action plan, structural
-- config, evidence metadata).
--
-- This migration replaces the function to include the org-scoped tables
-- created in migration 023, scoped to the requesting user's org. Evidence
-- file binaries are NOT included (they live in Supabase Storage and can be
-- downloaded individually via signed URLs). The Storage paths are exposed
-- in the evidence_files rows so a consumer can reconstruct.
-- =========================================================================

BEGIN;

CREATE OR REPLACE FUNCTION export_user_data(p_org_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
  v_target_user UUID;
  v_result JSONB;
BEGIN
  v_target_user := COALESCE(p_user_id, auth.uid());

  IF v_target_user != auth.uid() THEN
    IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
      RAISE EXCEPTION 'Permission denied';
    END IF;
  END IF;

  SELECT jsonb_build_object(
    'exported_at', NOW(),
    'user_id', v_target_user,
    'organisation_id', p_org_id,
    'membership', (SELECT jsonb_agg(row_to_json(m)) FROM organisation_memberships m WHERE m.user_id = v_target_user AND m.organisation_id = p_org_id),
    'sessions', (SELECT jsonb_agg(row_to_json(s)) FROM sessions s WHERE s.user_id = v_target_user),
    'audit_logs', (SELECT jsonb_agg(row_to_json(a)) FROM audit_logs a WHERE a.user_id = v_target_user AND a.organisation_id = p_org_id),
    -- Assessment artefacts (org-scoped per migration 023)
    'sites', (SELECT jsonb_agg(row_to_json(st)) FROM sites st WHERE st.organisation_id = p_org_id),
    'module_progress', (SELECT jsonb_agg(row_to_json(mp)) FROM module_progress mp WHERE mp.organisation_id = p_org_id),
    'module_responses', (SELECT jsonb_agg(row_to_json(mr)) FROM module_responses mr WHERE mr.organisation_id = p_org_id),
    'diap_items', (SELECT jsonb_agg(row_to_json(d)) FROM diap_items d WHERE d.organisation_id = p_org_id),
    'diap_documents', (SELECT jsonb_agg(row_to_json(dd)) FROM diap_documents dd WHERE dd.organisation_id = p_org_id),
    'evidence_files_metadata', (SELECT jsonb_agg(row_to_json(ef)) FROM evidence_files ef WHERE ef.organisation_id = p_org_id)
  ) INTO v_result;

  PERFORM create_audit_log(auth.uid(), p_org_id, 'data_exported', 'user_data', v_target_user::TEXT, jsonb_build_object('exported_by', auth.uid()));
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION export_user_data TO authenticated;

COMMIT;
