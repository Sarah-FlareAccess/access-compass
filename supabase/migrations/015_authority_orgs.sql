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
