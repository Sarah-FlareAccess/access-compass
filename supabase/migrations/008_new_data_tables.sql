-- =====================================================
-- MIGRATION 008: Create new data tables
-- =====================================================
-- Creates tables for all data currently stored only in
-- localStorage. Handles pre-existing tables by adding
-- missing columns via ALTER TABLE.
-- =====================================================

-- Ensure the updated_at trigger function exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- DISCOVERY DATA
-- This table already exists but may be missing columns.
-- Add them if needed, then create if it somehow doesn't exist.
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'discovery_data' AND table_schema = 'public') THEN
    -- Table exists, add missing columns
    BEGIN ALTER TABLE discovery_data ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN selected_touchpoints TEXT[] DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN selected_sub_touchpoints TEXT[] DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN not_applicable_phases TEXT[] DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN touchpoint_responses JSONB DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN recommendation_result JSONB; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN review_mode TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN recommended_modules TEXT[] DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN custom_selected_modules TEXT[] DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN budget_range TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN work_approach TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN action_timing TEXT; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN business_context JSONB DEFAULT '{}'; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW(); EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE discovery_data ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW(); EXCEPTION WHEN duplicate_column THEN NULL; END;
  ELSE
    CREATE TABLE discovery_data (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
      session_id TEXT NOT NULL UNIQUE,
      selected_touchpoints TEXT[] DEFAULT '{}',
      selected_sub_touchpoints TEXT[] DEFAULT '{}',
      not_applicable_phases TEXT[] DEFAULT '{}',
      touchpoint_responses JSONB DEFAULT '{}',
      recommendation_result JSONB,
      review_mode TEXT,
      recommended_modules TEXT[] DEFAULT '{}',
      custom_selected_modules TEXT[] DEFAULT '{}',
      budget_range TEXT,
      work_approach TEXT,
      action_timing TEXT,
      business_context JSONB DEFAULT '{}',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_discovery_data_user_id ON discovery_data(user_id);
CREATE INDEX IF NOT EXISTS idx_discovery_data_session_id ON discovery_data(session_id);

-- =====================================================
-- EXISTING actions/evidence/clarifications TABLES
-- Add user_id and organisation_id if missing
-- =====================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'actions' AND table_schema = 'public') THEN
    BEGIN ALTER TABLE actions ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE actions ADD COLUMN organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_column THEN NULL; END;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'evidence' AND table_schema = 'public') THEN
    BEGIN ALTER TABLE evidence ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE evidence ADD COLUMN organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_column THEN NULL; END;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'clarifications' AND table_schema = 'public') THEN
    BEGIN ALTER TABLE clarifications ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE; EXCEPTION WHEN duplicate_column THEN NULL; END;
    BEGIN ALTER TABLE clarifications ADD COLUMN organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL; EXCEPTION WHEN duplicate_column THEN NULL; END;
  END IF;
END $$;

-- =====================================================
-- DISCOVERY PROGRESS (in-progress auto-save state)
-- =====================================================
CREATE TABLE IF NOT EXISTS discovery_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL UNIQUE,
  selected_touchpoints TEXT[] DEFAULT '{}',
  selected_sub_touchpoints TEXT[] DEFAULT '{}',
  not_applicable_phases TEXT[] DEFAULT '{}',
  custom_selected_modules TEXT[] DEFAULT '{}',
  current_step TEXT DEFAULT 'touchpoints',
  business_context JSONB DEFAULT '{}',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discovery_progress_user_id ON discovery_progress(user_id);

-- =====================================================
-- TRAINING PROGRESS (lesson completion tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  courses JSONB DEFAULT '{}',
  viewed_resources TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- DIAP CUSTOM CATEGORIES (user-created DIAP categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS diap_custom_categories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_diap_custom_categories_user_id ON diap_custom_categories(user_id);
CREATE INDEX IF NOT EXISTS idx_diap_custom_categories_org_id ON diap_custom_categories(organisation_id);

-- =====================================================
-- DIAP CUSTOM CATEGORY NAMES (renamed built-in categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS diap_custom_category_names (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  category_id TEXT NOT NULL,
  custom_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category_id)
);

CREATE INDEX IF NOT EXISTS idx_diap_category_names_user_id ON diap_custom_category_names(user_id);

-- =====================================================
-- DIAP TEAM ROLES (roles for DIAP task assignment)
-- =====================================================
CREATE TABLE IF NOT EXISTS diap_team_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id) ON DELETE SET NULL,
  role_name TEXT NOT NULL,
  role_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, role_name)
);

CREATE INDEX IF NOT EXISTS idx_diap_team_roles_org_id ON diap_team_roles(organisation_id);

-- =====================================================
-- SYNC METADATA (tracks per-device sync state)
-- =====================================================
CREATE TABLE IF NOT EXISTS sync_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  device_id TEXT NOT NULL,
  device_label TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT NOW(),
  data_tables_synced TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

CREATE INDEX IF NOT EXISTS idx_sync_metadata_user_id ON sync_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_sync_metadata_session_id ON sync_metadata(session_id);

-- =====================================================
-- UPDATED_AT TRIGGERS for new tables
-- Use DROP + CREATE to be safe on re-runs
-- =====================================================
DROP TRIGGER IF EXISTS update_discovery_data_updated_at ON discovery_data;
CREATE TRIGGER update_discovery_data_updated_at
  BEFORE UPDATE ON discovery_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_discovery_progress_updated_at ON discovery_progress;
CREATE TRIGGER update_discovery_progress_updated_at
  BEFORE UPDATE ON discovery_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_training_progress_updated_at ON training_progress;
CREATE TRIGGER update_training_progress_updated_at
  BEFORE UPDATE ON training_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diap_custom_categories_updated_at ON diap_custom_categories;
CREATE TRIGGER update_diap_custom_categories_updated_at
  BEFORE UPDATE ON diap_custom_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diap_category_names_updated_at ON diap_custom_category_names;
CREATE TRIGGER update_diap_category_names_updated_at
  BEFORE UPDATE ON diap_custom_category_names
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sync_metadata_updated_at ON sync_metadata;
CREATE TRIGGER update_sync_metadata_updated_at
  BEFORE UPDATE ON sync_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
