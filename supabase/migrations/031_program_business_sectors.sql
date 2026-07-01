-- 031_program_business_sectors.sql
-- Statutory Plan Alignment (Layer 2): return each enrolled business's sector
-- categories (business_types) for a program, so the Outcomes view can roll a
-- facility's on-site findings into its service-domain (e.g. a leisure/health
-- facility -> Health & wellbeing).
--
-- Privacy: returns sector CATEGORIES only (no names, no responses). Same
-- SECURITY DEFINER guard as the 029 report RPCs - only admins/owners of the
-- authority org that owns the program can call it.

CREATE OR REPLACE FUNCTION get_program_business_sectors(p_program_id UUID)
RETURNS TABLE (
  child_org_id UUID,
  business_types TEXT[]
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

  RETURN QUERY
  WITH enrolled_orgs AS (
    SELECT pe.organisation_id
    FROM program_enrolments pe
    WHERE pe.program_id = p_program_id
  ),
  latest_snapshot AS (
    SELECT DISTINCT ON (s.organisation_id)
      s.organisation_id,
      s.business_snapshot
    FROM sessions s
    JOIN enrolled_orgs eo ON eo.organisation_id = s.organisation_id
    WHERE s.business_snapshot IS NOT NULL
    ORDER BY s.organisation_id, s.updated_at DESC NULLS LAST
  )
  SELECT
    eo.organisation_id AS child_org_id,
    COALESCE(
      ARRAY(
        SELECT jsonb_array_elements_text(ls.business_snapshot -> 'business_types')
      ),
      ARRAY[]::TEXT[]
    ) AS business_types
  FROM enrolled_orgs eo
  LEFT JOIN latest_snapshot ls ON ls.organisation_id = eo.organisation_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_program_business_sectors(UUID) TO authenticated;

COMMENT ON FUNCTION get_program_business_sectors(UUID) IS
  'Returns enrolled businesses'' sector categories (business_snapshot.business_types) for a program, for the Outcomes view facility overlay. SECURITY DEFINER: only authority admins/owners of the program-owning org. Categories only, no names or responses.';
