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
