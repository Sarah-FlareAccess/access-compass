-- =====================================================
-- 029. PROGRAM REPORTS - Snapshots + aggregation
-- =====================================================
-- Adds:
--  1. program_reports table for point-in-time snapshots
--     councils generate for board reporting, grant
--     acquittals, or quarterly reviews. snapshot_data
--     jsonb holds the full rendered payload.
--  2. SECURITY DEFINER aggregation functions that respect
--     the authority/child-org privacy boundary established
--     by migration 015: only authority admins of the
--     parent org can call, only counts and the already-
--     generated module_progress.summary jsonb are exposed.
--     Raw question responses are never returned.
--
-- Design notes:
--  - module_progress has org-scoped RLS so an authority
--    admin cannot SELECT directly from it for child orgs.
--    A SECURITY DEFINER function is the supported escape
--    hatch when callable access is narrower than the
--    underlying table.
--  - module_progress.summary jsonb is generated narrative
--    (priority actions, strengths, areas to explore),
--    not raw answers, so exposing it for cohort
--    aggregation is consistent with the existing privacy
--    contract on authority_child_summaries.
--  - module_ids_snapshot on the report row captures program
--    scope at generation time so old reports remain
--    readable even after a program edit.
-- =====================================================

-- =====================================================
-- 1. PROGRAM REPORTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS program_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES authority_programs(id) ON DELETE CASCADE,
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,

  -- Caption shown on the report. Defaults to program name + date
  -- but the council can edit it (e.g. "Q3 2026 Tourism Permit Report").
  name TEXT NOT NULL,

  -- Audit
  generated_by_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Snapshot of program scope at generation time. Lets historical
  -- reports stay readable even if the program's modules change later.
  access_level access_level,
  module_ids_snapshot TEXT[] NOT NULL DEFAULT '{}',
  enrolment_count INTEGER NOT NULL DEFAULT 0,
  completed_count INTEGER NOT NULL DEFAULT 0,
  submitted_count INTEGER NOT NULL DEFAULT 0,
  in_progress_count INTEGER NOT NULL DEFAULT 0,

  -- Full rendered payload: per-module aggregates, top priority actions
  -- across the cohort, strengths, methodology meta, etc.
  snapshot_data JSONB NOT NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_program_reports_program
  ON program_reports(program_id);
CREATE INDEX IF NOT EXISTS idx_program_reports_org
  ON program_reports(organisation_id);
CREATE INDEX IF NOT EXISTS idx_program_reports_generated_at
  ON program_reports(generated_at DESC);

ALTER TABLE program_reports ENABLE ROW LEVEL SECURITY;

-- Authority admins/owners manage their org's reports.
CREATE POLICY program_reports_manage_authority_admins ON program_reports
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = program_reports.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );

DROP TRIGGER IF EXISTS update_program_reports_updated_at ON program_reports;
CREATE TRIGGER update_program_reports_updated_at
  BEFORE UPDATE ON program_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 2. AGGREGATION FUNCTIONS (SECURITY DEFINER)
-- =====================================================

-- Per-module completion + confidence rollup across enrolled cohort.
-- Returns one row per module in the program, even modules with zero
-- engagement so the report shows the full scope.
CREATE OR REPLACE FUNCTION get_program_module_aggregates(p_program_id UUID)
RETURNS TABLE (
  module_id TEXT,
  total_enrolments INTEGER,
  completed INTEGER,
  in_progress INTEGER,
  not_started INTEGER,
  confidence_strong INTEGER,
  confidence_mixed INTEGER,
  confidence_needs_work INTEGER
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

  -- Caller must be admin/owner of the authority org that owns the program.
  IF NOT EXISTS (
    SELECT 1 FROM organisation_memberships om
    WHERE om.organisation_id = v_authority_org_id
    AND om.user_id = auth.uid()
    AND om.role IN ('owner', 'admin')
  ) THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;

  RETURN QUERY
  WITH program_modules AS (
    SELECT UNNEST(ap.required_module_ids) AS m_id
    FROM authority_programs ap
    WHERE ap.id = p_program_id
  ),
  enrolled_orgs AS (
    SELECT pe.organisation_id
    FROM program_enrolments pe
    WHERE pe.program_id = p_program_id
  )
  SELECT
    pm.m_id AS module_id,
    COUNT(DISTINCT eo.organisation_id)::INTEGER AS total_enrolments,
    COUNT(DISTINCT CASE WHEN mp.status = 'completed' THEN eo.organisation_id END)::INTEGER AS completed,
    COUNT(DISTINCT CASE WHEN mp.status = 'in-progress' THEN eo.organisation_id END)::INTEGER AS in_progress,
    COUNT(DISTINCT CASE
      WHEN mp.status IS NULL OR mp.status = 'not-started'
      THEN eo.organisation_id
    END)::INTEGER AS not_started,
    COUNT(CASE WHEN mp.confidence_snapshot = 'strong' THEN 1 END)::INTEGER AS confidence_strong,
    COUNT(CASE WHEN mp.confidence_snapshot = 'mixed' THEN 1 END)::INTEGER AS confidence_mixed,
    COUNT(CASE WHEN mp.confidence_snapshot = 'needs-work' THEN 1 END)::INTEGER AS confidence_needs_work
  FROM program_modules pm
  CROSS JOIN enrolled_orgs eo
  LEFT JOIN module_progress mp
    ON mp.organisation_id = eo.organisation_id
    AND mp.module_id = pm.m_id
  GROUP BY pm.m_id;
END;
$$;

GRANT EXECUTE ON FUNCTION get_program_module_aggregates(UUID) TO authenticated;

-- Cohort summary jsonb across the program for JS-side aggregation of
-- priority actions, strengths, and areas to explore. Returns no
-- identifying info about the child org beyond its id (which is already
-- visible to authority admins via authority_child_summaries). The
-- summary jsonb is generated narrative, never raw question responses.
CREATE OR REPLACE FUNCTION get_program_cohort_summaries(p_program_id UUID)
RETURNS TABLE (
  child_org_id UUID,
  module_id TEXT,
  status TEXT,
  confidence_snapshot TEXT,
  summary JSONB,
  completed_at TIMESTAMPTZ
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
  SELECT
    mp.organisation_id AS child_org_id,
    mp.module_id,
    mp.status,
    mp.confidence_snapshot,
    mp.summary,
    mp.completed_at
  FROM module_progress mp
  JOIN program_enrolments pe
    ON pe.organisation_id = mp.organisation_id
    AND pe.program_id = p_program_id
  JOIN authority_programs ap
    ON ap.id = pe.program_id
    AND mp.module_id = ANY(ap.required_module_ids);
END;
$$;

GRANT EXECUTE ON FUNCTION get_program_cohort_summaries(UUID) TO authenticated;

-- =====================================================
-- 3. COMMENTS
-- =====================================================
COMMENT ON TABLE program_reports IS
  'Snapshots of program-level reports for board reporting, grant acquittals, and quarterly reviews. snapshot_data jsonb holds the full rendered payload.';

COMMENT ON FUNCTION get_program_module_aggregates IS
  'Per-module completion + confidence distribution rollup across all businesses enrolled in a program. SECURITY DEFINER: only authority admins/owners of the program-owning org can call. Returns counts only.';

COMMENT ON FUNCTION get_program_cohort_summaries IS
  'Returns module_progress.summary jsonb across the cohort for JS-side aggregation of priorities/strengths. SECURITY DEFINER: only authority admins/owners of the program-owning org can call. Returns generated narrative only, never raw question responses.';
