-- =====================================================
-- MIGRATION 007: Add user_id and organisation_id to data tables
-- =====================================================
-- Links all user data to authenticated users and their organisations.
-- Columns are nullable to preserve existing rows and support
-- unauthenticated/offline usage during transition.
-- =====================================================

-- =====================================================
-- SESSIONS TABLE
-- =====================================================
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS device_id TEXT,
  ADD COLUMN IF NOT EXISTS device_label TEXT;

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_org_id ON sessions(organisation_id);

-- =====================================================
-- MODULE PROGRESS TABLE
-- =====================================================
ALTER TABLE module_progress
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_module_progress_user_id ON module_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_org_id ON module_progress(organisation_id);

-- =====================================================
-- MODULE RESPONSES TABLE
-- Create if missing (was in 001 but may not have been run)
-- =====================================================
CREATE TABLE IF NOT EXISTS module_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  answer TEXT CHECK (answer IN ('yes', 'no', 'not-sure', 'na')),
  confidence TEXT CHECK (confidence IN ('certain', 'mostly', 'guess')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, module_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_module_responses_session ON module_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_module_responses_module ON module_responses(module_id);

ALTER TABLE module_responses
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_module_responses_user_id ON module_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_module_responses_org_id ON module_responses(organisation_id);

-- =====================================================
-- DIAP ITEMS TABLE
-- =====================================================
ALTER TABLE diap_items
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_diap_items_user_id ON diap_items(user_id);
CREATE INDEX IF NOT EXISTS idx_diap_items_org_id ON diap_items(organisation_id);

-- =====================================================
-- DIAP DOCUMENTS TABLE
-- =====================================================
ALTER TABLE diap_documents
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_diap_documents_user_id ON diap_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_diap_documents_org_id ON diap_documents(organisation_id);

-- =====================================================
-- BACKFILL: Link existing rows to users where possible
-- =====================================================
-- If sessions already have a session_id that matches a known user,
-- this can be run manually after migration. For now, new rows will
-- always include user_id when the user is authenticated.

-- =====================================================
-- HELPER FUNCTION: Get current user's organisation_id
-- Used by RLS policies and application code
-- =====================================================
CREATE OR REPLACE FUNCTION get_user_organisation_id(p_user_id UUID)
RETURNS UUID AS $$
  SELECT organisation_id FROM organisation_memberships
  WHERE user_id = p_user_id AND status = 'active'
  ORDER BY joined_at ASC
  LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
