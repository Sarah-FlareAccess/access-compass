-- =====================================================
-- 033. CLOUD-PERSISTED REASSESSMENT SNAPSHOTS
-- =====================================================
-- Until now the reassessment/comparison feature stored its run history ONLY in
-- each browser's localStorage (the runs[] array on module_progress). That meant
-- reassessment history did not survive a browser clear, a device switch, or a
-- different team member signing in - a durability gap for a sold feature.
--
-- This table is the cloud home for reassessment history. Each completed or
-- archived run is one immutable snapshot row, org-scoped and (optionally)
-- site-scoped, mirroring the localStorage ModuleRun shape. The live/current
-- assessment continues to live in module_progress + module_responses; this
-- table only holds historical runs alongside it.
--
-- run_id is the client-generated run identifier (globally unique), used as the
-- upsert arbiter so PostgREST on_conflict works with a plain non-partial index.
-- Safe: additive, no existing data touched.
-- =====================================================

CREATE TABLE IF NOT EXISTS module_assessment_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  module_id TEXT NOT NULL,
  module_code TEXT,
  run_id TEXT NOT NULL,
  context JSONB,                                   -- { type, name, description }
  status TEXT,                                     -- 'in-progress' | 'completed' | 'not-started'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  confidence_snapshot TEXT,                        -- 'strong' | 'mixed' | 'needs-work'
  summary JSONB,                                   -- ModuleSummary snapshot
  responses JSONB NOT NULL DEFAULT '[]'::jsonb,    -- QuestionResponse[] snapshot
  created_by_user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- run_id is globally unique -> use it directly as the on_conflict arbiter.
CREATE UNIQUE INDEX IF NOT EXISTS module_assessment_snapshots_run_uniq
  ON module_assessment_snapshots (run_id);

CREATE INDEX IF NOT EXISTS idx_mas_org
  ON module_assessment_snapshots (organisation_id);
CREATE INDEX IF NOT EXISTS idx_mas_org_site_module
  ON module_assessment_snapshots (organisation_id, site_id, module_id);

ALTER TABLE module_assessment_snapshots ENABLE ROW LEVEL SECURITY;

-- Org-scoped RLS, mirroring migration 023's assessment-table policies.
CREATE POLICY mas_select_org ON module_assessment_snapshots
  FOR SELECT USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY mas_insert_org ON module_assessment_snapshots
  FOR INSERT WITH CHECK (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY mas_update_org ON module_assessment_snapshots
  FOR UPDATE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY mas_delete_org ON module_assessment_snapshots
  FOR DELETE USING (
    organisation_id IS NOT NULL AND organisation_id IN (
      SELECT organisation_id FROM organisation_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

COMMENT ON TABLE module_assessment_snapshots IS
  'Cloud-persisted reassessment history. One immutable row per completed/archived module run, org- and optionally site-scoped. Live assessment stays in module_progress + module_responses.';
