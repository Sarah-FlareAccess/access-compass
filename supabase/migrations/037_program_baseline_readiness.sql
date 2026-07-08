-- =====================================================
-- 037. PROGRAM BASELINE READINESS (before/after improvement)
-- =====================================================
-- The program report can show cohort improvement (readiness before vs after)
-- only for businesses that have assessed more than once. The FIRST completed run
-- of each module is archived to module_assessment_snapshots (migration 033) when
-- a business re-assesses; the CURRENT run stays in module_progress.
--
-- This SECURITY DEFINER RPC returns, per enrolled business per in-scope module,
-- the EARLIEST archived confidence band = the baseline. The report pairs it with
-- the current band (from get_program_cohort_summaries) to compute improvement,
-- and shows a delta only for the re-assessed subset. Businesses assessed once
-- have no snapshot row and therefore contribute no baseline (correctly excluded).
--
-- Auth gate mirrors get_program_cohort_summaries (029): caller must be an
-- owner/admin of the authority org that owns the program. Returns only the
-- child org id + module + band + timestamp (no raw responses). Additive, safe.
-- =====================================================

CREATE OR REPLACE FUNCTION get_program_baseline_readiness(p_program_id UUID)
RETURNS TABLE (
  child_org_id UUID,
  module_id TEXT,
  baseline_confidence TEXT,
  baseline_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_authority_org_id UUID;
BEGIN
  SELECT ap.organisation_id INTO v_authority_org_id
  FROM authority_programs ap
  WHERE ap.id = p_program_id;

  IF v_authority_org_id IS NULL THEN
    RAISE EXCEPTION 'Program not found';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM organisation_memberships om
    WHERE om.organisation_id = v_authority_org_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  -- Earliest archived run per (business, module) = the baseline. DISTINCT ON
  -- with ascending completed_at keeps the first row per group.
  RETURN QUERY
  SELECT DISTINCT ON (mas.organisation_id, mas.module_id)
    mas.organisation_id AS child_org_id,
    mas.module_id,
    mas.confidence_snapshot AS baseline_confidence,
    mas.completed_at AS baseline_at
  FROM module_assessment_snapshots mas
  JOIN program_enrolments pe
    ON pe.organisation_id = mas.organisation_id
    AND pe.program_id = p_program_id
  JOIN authority_programs ap
    ON ap.id = pe.program_id
    AND mas.module_id = ANY(ap.required_module_ids)
  WHERE mas.confidence_snapshot IS NOT NULL
    AND mas.completed_at IS NOT NULL
  ORDER BY mas.organisation_id, mas.module_id, mas.completed_at ASC;
END;
$$;

GRANT EXECUTE ON FUNCTION get_program_baseline_readiness(UUID) TO authenticated;
