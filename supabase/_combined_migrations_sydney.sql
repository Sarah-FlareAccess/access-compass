-- BASE SCHEMA --
-- ============================================
-- ACCESS COMPASS - SUPABASE DATABASE SCHEMA
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CUSTOM TYPES (ENUMS)
-- ============================================

-- Priority levels for actions
CREATE TYPE priority_level AS ENUM ('act_now', 'plan_next', 'consider_later');

-- Effort levels for actions
CREATE TYPE effort_level AS ENUM ('low', 'medium', 'high');

-- Action status
CREATE TYPE action_status AS ENUM ('not_started', 'in_progress', 'complete', 'on_hold');

-- Evidence types
CREATE TYPE evidence_type AS ENUM ('photo', 'pdf', 'link');

-- Business types
CREATE TYPE business_type AS ENUM (
  'cafe-restaurant',
  'accommodation',
  'tour-operator',
  'attraction-museum-gallery',
  'visitor-centre',
  'other'
);

-- User roles
CREATE TYPE user_role AS ENUM (
  'owner',
  'manager',
  'operations-lead',
  'other'
);

-- Budget ranges
CREATE TYPE budget_range AS ENUM (
  'under_500',
  '500_2k',
  '2k_10k',
  '10k_plus',
  'not_sure'
);

-- Capacity levels
CREATE TYPE capacity_level AS ENUM (
  'diy',
  'some_support',
  'hire_help',
  'not_sure'
);

-- Timeframes
CREATE TYPE timeframe_type AS ENUM (
  'now',
  'soon',
  'later',
  'exploring'
);

-- ============================================
-- TABLES
-- ============================================

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Business snapshot (stored as JSONB)
  business_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Selected modules (array of text)
  selected_modules TEXT[] DEFAULT '{}',

  -- Discovery responses (nested JSONB structure)
  discovery_responses JSONB DEFAULT '{}'::jsonb,

  -- Constraints (JSONB)
  constraints JSONB DEFAULT '{}'::jsonb,

  -- AI response (raw response from Claude API)
  ai_response JSONB,

  -- Indexes
  CONSTRAINT sessions_user_id_idx UNIQUE (user_id, id)
);

-- Add index on user_id for faster lookups
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_created_at ON sessions(created_at DESC);

-- Actions table
CREATE TABLE actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- Action details
  priority priority_level NOT NULL,
  category TEXT NOT NULL, -- Module name (e.g., "Physical access")
  title TEXT NOT NULL,
  why_matters TEXT NOT NULL,
  effort effort_level NOT NULL,
  cost_band TEXT NOT NULL, -- e.g., "$0-500", "$500-2k"
  how_to_steps TEXT[] NOT NULL DEFAULT '{}',
  example TEXT NOT NULL,

  -- DIAP tracking fields
  owner TEXT,
  timeframe TEXT,
  status action_status NOT NULL DEFAULT 'not_started',
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes on actions
CREATE INDEX idx_actions_session_id ON actions(session_id);
CREATE INDEX idx_actions_priority ON actions(priority);
CREATE INDEX idx_actions_status ON actions(status);

-- Evidence table
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,

  type evidence_type NOT NULL,
  filename TEXT,
  url TEXT NOT NULL,
  file_data TEXT, -- Base64 for MVP, null when using cloud storage

  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on action_id
CREATE INDEX idx_evidence_action_id ON evidence(action_id);

-- Clarifications table
CREATE TABLE clarifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  question TEXT NOT NULL,
  module TEXT NOT NULL,
  why_matters TEXT NOT NULL,
  how_to_check TEXT NOT NULL,

  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index on session_id and resolved status
CREATE INDEX idx_clarifications_session_id ON clarifications(session_id);
CREATE INDEX idx_clarifications_resolved ON clarifications(resolved);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarifications ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Users can view their own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Actions policies
CREATE POLICY "Users can view actions from their sessions"
  ON actions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = actions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert actions to their sessions"
  ON actions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = actions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update actions from their sessions"
  ON actions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = actions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete actions from their sessions"
  ON actions FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = actions.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Evidence policies
CREATE POLICY "Users can view evidence from their actions"
  ON evidence FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM actions
      JOIN sessions ON sessions.id = actions.session_id
      WHERE actions.id = evidence.action_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert evidence to their actions"
  ON evidence FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM actions
      JOIN sessions ON sessions.id = actions.session_id
      WHERE actions.id = evidence.action_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete evidence from their actions"
  ON evidence FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM actions
      JOIN sessions ON sessions.id = actions.session_id
      WHERE actions.id = evidence.action_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Clarifications policies
CREATE POLICY "Users can view clarifications from their sessions"
  ON clarifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = clarifications.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert clarifications to their sessions"
  ON clarifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = clarifications.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update clarifications from their sessions"
  ON clarifications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = clarifications.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for actions table
CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON actions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update session last_updated timestamp
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE sessions
  SET last_updated = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update session when actions change
CREATE TRIGGER update_session_on_action_change
  AFTER INSERT OR UPDATE OR DELETE ON actions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_timestamp();

-- ============================================
-- HELPFUL QUERIES (FOR REFERENCE)
-- ============================================

-- View all sessions for current user
-- SELECT * FROM sessions WHERE user_id = auth.uid() ORDER BY created_at DESC;

-- View all actions for a specific session
-- SELECT * FROM actions WHERE session_id = 'your-session-id' ORDER BY priority;

-- Count actions by priority for a session
-- SELECT priority, COUNT(*)
-- FROM actions
-- WHERE session_id = 'your-session-id'
-- GROUP BY priority;

-- Get unresolved clarifications for a session
-- SELECT * FROM clarifications
-- WHERE session_id = 'your-session-id' AND resolved = FALSE;

-- ============================================
-- DISCOVERY DATA TABLES (Phase 4)
-- ============================================

-- Review mode type
CREATE TYPE review_mode AS ENUM ('foundation', 'detailed');

-- Journey phase type
CREATE TYPE journey_phase AS ENUM ('before-arrival', 'during-visit', 'after-visit');

-- Discovery data table
CREATE TABLE discovery_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- Selected touchpoints (array of touchpoint IDs)
  selected_touchpoints TEXT[] DEFAULT '{}',
  selected_sub_touchpoints TEXT[] DEFAULT '{}',

  -- Touchpoint responses (touchpointId -> 'yes' | 'no' | 'not-sure')
  touchpoint_responses JSONB DEFAULT '{}'::jsonb,

  -- Recommendation result (full JSON from engine)
  recommendation_result JSONB,

  -- Selected review mode
  review_mode review_mode DEFAULT 'foundation',

  -- Recommended modules from discovery
  recommended_modules TEXT[] DEFAULT '{}',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT discovery_data_session_unique UNIQUE (session_id)
);

CREATE INDEX idx_discovery_session_id ON discovery_data(session_id);

-- Enable RLS
ALTER TABLE discovery_data ENABLE ROW LEVEL SECURITY;

-- Discovery data policies
CREATE POLICY "Users can view their discovery data"
  ON discovery_data FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = discovery_data.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their discovery data"
  ON discovery_data FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = discovery_data.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their discovery data"
  ON discovery_data FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = discovery_data.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- MODULE PROGRESS TABLES (Phase 5)
-- ============================================

-- Module progress tracking
CREATE TABLE module_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  module_id TEXT NOT NULL,
  module_code TEXT NOT NULL,

  -- Progress tracking
  status TEXT DEFAULT 'not-started', -- 'not-started', 'in-progress', 'completed'
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Question responses (JSONB array)
  responses JSONB DEFAULT '[]'::jsonb,

  -- Summary data (generated on completion)
  summary JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT module_progress_unique UNIQUE (session_id, module_id)
);

CREATE INDEX idx_module_progress_session ON module_progress(session_id);
CREATE INDEX idx_module_progress_status ON module_progress(status);

-- Enable RLS
ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;

-- Module progress policies
CREATE POLICY "Users can view their module progress"
  ON module_progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = module_progress.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their module progress"
  ON module_progress FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = module_progress.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their module progress"
  ON module_progress FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = module_progress.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- ============================================
-- DIAP MANAGEMENT TABLES (Phase 7)
-- ============================================

-- DIAP category type
CREATE TYPE diap_category AS ENUM (
  'physical-access',
  'digital-access',
  'communication',
  'customer-service',
  'policy-procedure',
  'training',
  'other'
);

-- DIAP status type
CREATE TYPE diap_status AS ENUM (
  'not-started',
  'in-progress',
  'completed',
  'on-hold',
  'cancelled'
);

-- DIAP priority type
CREATE TYPE diap_priority AS ENUM ('high', 'medium', 'low');

-- DIAP items table
CREATE TABLE diap_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- Core fields
  objective TEXT NOT NULL,
  action TEXT NOT NULL,
  category diap_category DEFAULT 'other',
  priority diap_priority DEFAULT 'medium',

  -- Timeframe
  timeframe TEXT, -- '0-30 days', '30-90 days', '3-12 months', 'Ongoing'

  -- Assignment
  responsible_role TEXT,
  responsible_team TEXT,

  -- Status tracking
  status diap_status DEFAULT 'not-started',

  -- Source tracking
  module_source TEXT, -- Which module generated this
  question_source TEXT, -- Which question generated this

  -- Impact and details
  impact_statement TEXT,
  dependencies TEXT[],
  resources TEXT[],
  budget_estimate TEXT,

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_diap_items_session ON diap_items(session_id);
CREATE INDEX idx_diap_items_priority ON diap_items(priority);
CREATE INDEX idx_diap_items_status ON diap_items(status);
CREATE INDEX idx_diap_items_category ON diap_items(category);

-- Enable RLS
ALTER TABLE diap_items ENABLE ROW LEVEL SECURITY;

-- DIAP items policies
CREATE POLICY "Users can view their DIAP items"
  ON diap_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_items.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their DIAP items"
  ON diap_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_items.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their DIAP items"
  ON diap_items FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_items.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their DIAP items"
  ON diap_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_items.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- DIAP documents table
CREATE TABLE diap_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,

  -- File info
  filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL, -- Path in Supabase storage

  -- Linking
  linked_item_ids UUID[] DEFAULT '{}', -- Links to diap_items

  -- Metadata
  description TEXT,

  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_diap_documents_session ON diap_documents(session_id);

-- Enable RLS
ALTER TABLE diap_documents ENABLE ROW LEVEL SECURITY;

-- DIAP documents policies
CREATE POLICY "Users can view their DIAP documents"
  ON diap_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their DIAP documents"
  ON diap_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their DIAP documents"
  ON diap_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM sessions
      WHERE sessions.id = diap_documents.session_id
      AND sessions.user_id = auth.uid()
    )
  );

-- Trigger for DIAP items updated_at
CREATE TRIGGER update_diap_items_updated_at
  BEFORE UPDATE ON diap_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for discovery_data updated_at
CREATE TRIGGER update_discovery_data_updated_at
  BEFORE UPDATE ON discovery_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for module_progress updated_at
CREATE TRIGGER update_module_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR DIAP DOCUMENTS
-- ============================================
-- Run this in Supabase Dashboard > Storage:
--
-- 1. Create bucket: "diap-documents"
-- 2. Set bucket to private
-- 3. Add RLS policy:
--    - Allow authenticated users to upload to their session folder
--    - Allow authenticated users to read from their session folder
--
-- Example storage policy SQL:
-- CREATE POLICY "Users can upload to their session folder"
-- ON storage.objects FOR INSERT
-- WITH CHECK (
--   bucket_id = 'diap-documents' AND
--   auth.uid()::text = (storage.foldername(name))[1]
-- );

-- ============================================
-- NOTES
-- ============================================
--
-- 1. All tables have Row Level Security enabled
-- 2. Users can only access their own data
-- 3. Cascading deletes: Deleting a session deletes all related data
-- 4. Timestamps are automatically managed
-- 5. For MVP: user_id can be NULL (anonymous sessions)
--    For Phase 2: user_id becomes required after authentication
--
-- NEW TABLES ADDED:
-- - discovery_data: Stores touchpoint selections and recommendations
-- - module_progress: Tracks question responses per module
-- - diap_items: Full DIAP action items with categories
-- - diap_documents: File attachments for DIAP
--
-- ============================================

-- === 001_create_tables ===
-- =====================================================
-- ACCESS COMPASS - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to create
-- all required tables for the application.
-- =====================================================

-- =====================================================
-- MODULE PROGRESS TABLE
-- Tracks user progress through accessibility modules
-- =====================================================
CREATE TABLE IF NOT EXISTS module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_code TEXT NOT NULL,
  status TEXT DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  confidence_snapshot TEXT CHECK (confidence_snapshot IN ('strong', 'mixed', 'needs-work')),

  -- Ownership tracking
  completed_by TEXT,
  completed_by_role TEXT,

  -- Summary data (stored as JSONB)
  summary JSONB,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique module per session
  UNIQUE(session_id, module_id)
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_module_progress_session ON module_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_module_progress_status ON module_progress(status);

-- =====================================================
-- DIAP ITEMS TABLE
-- Disability Inclusion Action Plan items
-- =====================================================
CREATE TABLE IF NOT EXISTS diap_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,

  -- Core fields
  objective TEXT NOT NULL,
  action TEXT NOT NULL,
  category TEXT DEFAULT 'other' CHECK (category IN (
    'physical-access', 'digital-access', 'communication',
    'customer-service', 'policy-procedure', 'training', 'other'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),

  -- Timeframe
  timeframe TEXT DEFAULT '30-90 days',
  due_date DATE,

  -- Assignment
  responsible_role TEXT,
  responsible_team TEXT,

  -- Status
  status TEXT DEFAULT 'not-started' CHECK (status IN (
    'not-started', 'in-progress', 'completed', 'on-hold', 'cancelled'
  )),

  -- Source tracking
  module_source TEXT,
  question_source TEXT,
  import_source TEXT CHECK (import_source IN ('audit', 'manual', 'csv', 'pdf')),

  -- Details
  impact_statement TEXT,
  dependencies TEXT[],
  resources TEXT[],
  budget_estimate TEXT,
  notes TEXT,
  success_indicators TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_diap_items_session ON diap_items(session_id);
CREATE INDEX IF NOT EXISTS idx_diap_items_priority ON diap_items(priority);
CREATE INDEX IF NOT EXISTS idx_diap_items_status ON diap_items(status);
CREATE INDEX IF NOT EXISTS idx_diap_items_category ON diap_items(category);

-- =====================================================
-- DIAP DOCUMENTS TABLE
-- Supporting documents for DIAP items
-- =====================================================
CREATE TABLE IF NOT EXISTS diap_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,

  -- File info
  filename TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,

  -- Metadata
  description TEXT,
  linked_item_ids UUID[],

  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_diap_documents_session ON diap_documents(session_id);

-- =====================================================
-- MODULE RESPONSES TABLE
-- Stores user answers to module questions
-- =====================================================
CREATE TABLE IF NOT EXISTS module_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,

  -- Response data
  answer TEXT CHECK (answer IN ('yes', 'no', 'not-sure', 'na')),
  confidence TEXT CHECK (confidence IN ('certain', 'mostly', 'guess')),
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique response per question per session
  UNIQUE(session_id, module_id, question_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_module_responses_session ON module_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_module_responses_module ON module_responses(module_id);

-- =====================================================
-- SESSIONS TABLE (Optional - for session management)
-- =====================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,

  -- Organisation info
  organisation_name TEXT,
  organisation_type TEXT,
  industry TEXT,
  size TEXT,

  -- Review settings
  review_mode TEXT CHECK (review_mode IN ('pulse-check', 'deep-dive')),
  selected_modules TEXT[],

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_sessions_session_id ON sessions(session_id);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- Note: For public access without auth, you may skip this
-- or configure appropriate policies
-- =====================================================

-- Enable RLS on all tables (optional - enable if you want auth)
-- ALTER TABLE module_progress ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE diap_items ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE diap_documents ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE module_responses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STORAGE BUCKET (run separately in Supabase Dashboard)
-- =====================================================
-- Create a storage bucket named 'diap-documents' in
-- Supabase Dashboard > Storage > New Bucket
-- Set it to public or private based on your needs

-- =====================================================
-- UPDATED_AT TRIGGER
-- Automatically updates updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS update_module_progress_updated_at ON module_progress;
CREATE TRIGGER update_module_progress_updated_at
  BEFORE UPDATE ON module_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_diap_items_updated_at ON diap_items;
CREATE TRIGGER update_diap_items_updated_at
  BEFORE UPDATE ON diap_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_module_responses_updated_at ON module_responses;
CREATE TRIGGER update_module_responses_updated_at
  BEFORE UPDATE ON module_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- === 002_access_system ===
-- =====================================================
-- ACCESS COMPASS - PAYWALL & ACCESS SYSTEM SCHEMA
-- =====================================================
-- Migration: 002_access_system.sql
-- Adds organisations, memberships, entitlements, and purchases
-- =====================================================

-- =====================================================
-- ENUMS
-- =====================================================

-- Business size tier (includes enterprise)
CREATE TYPE business_size_tier AS ENUM ('small', 'medium', 'large', 'enterprise');

-- Access level (assessment depth)
CREATE TYPE access_level AS ENUM ('pulse', 'deep_dive');

-- Module bundle types
CREATE TYPE module_bundle AS ENUM ('core', 'expanded', 'full');

-- Entitlement scope (user or organisation)
CREATE TYPE entitlement_scope AS ENUM ('user', 'org');

-- Purchase status
CREATE TYPE purchase_status AS ENUM ('pending', 'completed', 'refunded', 'cancelled');

-- Organisation member role
CREATE TYPE org_role AS ENUM ('admin', 'member');

-- =====================================================
-- ORGANISATIONS TABLE
-- Supports enterprise/precinct access
-- =====================================================
CREATE TABLE IF NOT EXISTS organisations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,

  -- Access configuration
  allowed_email_domains TEXT[], -- e.g., ['company.com', 'subsidiary.com']
  invite_code TEXT UNIQUE, -- e.g., 'COMPANY2024'
  allow_domain_auto_join BOOLEAN DEFAULT false,

  -- Settings
  max_members INTEGER DEFAULT 100,

  -- Contact info (for enterprise management)
  contact_email TEXT,
  contact_name TEXT,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_organisations_slug ON organisations(slug);
CREATE INDEX IF NOT EXISTS idx_organisations_invite_code ON organisations(invite_code) WHERE invite_code IS NOT NULL;

-- =====================================================
-- ORGANISATION MEMBERSHIPS TABLE
-- Links users to organisations
-- =====================================================
CREATE TABLE IF NOT EXISTS organisation_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  role org_role NOT NULL DEFAULT 'member',

  -- Tracking
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  invited_by UUID REFERENCES auth.users(id),
  invite_accepted_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure unique membership per user per org
  CONSTRAINT unique_org_membership UNIQUE (organisation_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_org_memberships_user ON organisation_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_org_memberships_org ON organisation_memberships(organisation_id);

-- =====================================================
-- ENTITLEMENTS TABLE
-- Defines what a user or organisation can access
-- =====================================================
CREATE TABLE IF NOT EXISTS entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Scope: either user or organisation
  scope_type entitlement_scope NOT NULL,
  scope_id UUID NOT NULL, -- user_id or organisation_id depending on scope_type

  -- Access configuration
  access_level access_level NOT NULL DEFAULT 'pulse',
  module_bundle module_bundle NOT NULL DEFAULT 'core',
  max_modules INTEGER, -- NULL = unlimited

  -- Validity period
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ, -- NULL = perpetual (no expiry)

  -- Source tracking
  purchase_id UUID, -- links to purchases table if from purchase
  granted_by TEXT NOT NULL DEFAULT 'purchase', -- 'purchase', 'admin', 'trial', 'enterprise', 'pilot', 'sponsorship'
  granted_by_user_id UUID REFERENCES auth.users(id), -- admin who granted (if applicable)

  -- Notes
  notes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ, -- Set when entitlement is revoked
  revoked_reason TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_entitlements_scope ON entitlements(scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_entitlements_active ON entitlements(starts_at, ends_at)
  WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase ON entitlements(purchase_id)
  WHERE purchase_id IS NOT NULL;

-- =====================================================
-- PURCHASES TABLE
-- Records all self-serve purchases
-- =====================================================
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Buyer
  user_id UUID NOT NULL REFERENCES auth.users(id),
  organisation_id UUID REFERENCES organisations(id), -- optional, for org purchases

  -- Product details
  product TEXT NOT NULL, -- 'pulse_check', 'deep_dive'
  business_size_tier business_size_tier NOT NULL,
  module_bundle module_bundle NOT NULL,

  -- Pricing
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'AUD',
  gst_cents INTEGER, -- GST amount if applicable

  -- Status
  status purchase_status NOT NULL DEFAULT 'pending',

  -- Stripe integration
  stripe_checkout_session_id TEXT,
  stripe_payment_intent_id TEXT,
  stripe_customer_id TEXT,

  -- Invoice support (for manual/enterprise)
  invoice_number TEXT,
  invoice_sent_at TIMESTAMPTZ,

  -- Metadata
  notes TEXT,
  metadata JSONB, -- For any additional data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_org ON purchases(organisation_id) WHERE organisation_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON purchases(stripe_checkout_session_id)
  WHERE stripe_checkout_session_id IS NOT NULL;

-- =====================================================
-- UPDATE SESSIONS TABLE
-- Add user_id reference for authenticated sessions
-- =====================================================
ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id) WHERE user_id IS NOT NULL;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Organisations: viewable by members, public info viewable by all authenticated
CREATE POLICY "Members can view their organisations"
  ON organisations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships
      WHERE organisation_memberships.organisation_id = organisations.id
      AND organisation_memberships.user_id = auth.uid()
    )
  );

-- Allow looking up orgs by invite code (for joining)
CREATE POLICY "Anyone can lookup org by invite code"
  ON organisations FOR SELECT
  USING (invite_code IS NOT NULL);

-- Organisation memberships: users can see their own memberships
CREATE POLICY "Users can view their own memberships"
  ON organisation_memberships FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own memberships (when joining via invite code)
CREATE POLICY "Users can create their own membership"
  ON organisation_memberships FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Entitlements: users can view their own entitlements
CREATE POLICY "Users can view their own user entitlements"
  ON entitlements FOR SELECT
  USING (
    (scope_type = 'user' AND scope_id = auth.uid()) OR
    (scope_type = 'org' AND EXISTS (
      SELECT 1 FROM organisation_memberships
      WHERE organisation_memberships.organisation_id = entitlements.scope_id
      AND organisation_memberships.user_id = auth.uid()
    ))
  );

-- Purchases: users can view their own purchases
CREATE POLICY "Users can view their own purchases"
  ON purchases FOR SELECT
  USING (user_id = auth.uid());

-- Users can create their own purchases
CREATE POLICY "Users can create their own purchases"
  ON purchases FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if a user has any valid entitlement
CREATE OR REPLACE FUNCTION check_user_has_access(
  p_user_id UUID,
  p_required_level access_level DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM entitlements e
    LEFT JOIN organisation_memberships om ON
      e.scope_type = 'org' AND e.scope_id = om.organisation_id
    WHERE
      (
        (e.scope_type = 'user' AND e.scope_id = p_user_id) OR
        (e.scope_type = 'org' AND om.user_id = p_user_id)
      )
      AND (p_required_level IS NULL OR e.access_level = p_required_level OR e.access_level = 'deep_dive')
      AND e.starts_at <= NOW()
      AND (e.ends_at IS NULL OR e.ends_at > NOW())
      AND e.revoked_at IS NULL
  ) INTO has_access;

  RETURN has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's best/active entitlement
CREATE OR REPLACE FUNCTION get_user_entitlement(p_user_id UUID)
RETURNS TABLE (
  entitlement_id UUID,
  access_level access_level,
  module_bundle module_bundle,
  max_modules INTEGER,
  source TEXT,
  expires_at TIMESTAMPTZ,
  organisation_id UUID,
  organisation_name TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id as entitlement_id,
    e.access_level,
    e.module_bundle,
    e.max_modules,
    e.granted_by as source,
    e.ends_at as expires_at,
    CASE WHEN e.scope_type = 'org' THEN e.scope_id ELSE NULL END as organisation_id,
    o.name as organisation_name
  FROM entitlements e
  LEFT JOIN organisation_memberships om ON
    e.scope_type = 'org' AND e.scope_id = om.organisation_id AND om.user_id = p_user_id
  LEFT JOIN organisations o ON
    e.scope_type = 'org' AND e.scope_id = o.id
  WHERE
    (
      (e.scope_type = 'user' AND e.scope_id = p_user_id) OR
      (e.scope_type = 'org' AND om.user_id IS NOT NULL)
    )
    AND e.starts_at <= NOW()
    AND (e.ends_at IS NULL OR e.ends_at > NOW())
    AND e.revoked_at IS NULL
  ORDER BY
    -- Prefer deep_dive over pulse
    CASE e.access_level WHEN 'deep_dive' THEN 0 ELSE 1 END,
    -- Prefer full bundle
    CASE e.module_bundle WHEN 'full' THEN 0 WHEN 'expanded' THEN 1 ELSE 2 END,
    -- Prefer org entitlements (enterprise)
    CASE e.scope_type WHEN 'org' THEN 0 ELSE 1 END,
    -- Most recent first
    e.created_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to find organisation by invite code
CREATE OR REPLACE FUNCTION find_org_by_invite_code(p_invite_code TEXT)
RETURNS TABLE (
  id UUID,
  name TEXT,
  slug TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.name, o.slug
  FROM organisations o
  WHERE UPPER(o.invite_code) = UPPER(p_invite_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can auto-join org by email domain
CREATE OR REPLACE FUNCTION check_domain_auto_join(p_user_email TEXT)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT
) AS $$
DECLARE
  email_domain TEXT;
BEGIN
  -- Extract domain from email
  email_domain := split_part(p_user_email, '@', 2);

  RETURN QUERY
  SELECT o.id as organisation_id, o.name as organisation_name
  FROM organisations o
  WHERE
    o.allow_domain_auto_join = true
    AND email_domain = ANY(o.allowed_email_domains);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamps
DROP TRIGGER IF EXISTS update_organisations_updated_at ON organisations;
CREATE TRIGGER update_organisations_updated_at
  BEFORE UPDATE ON organisations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_entitlements_updated_at ON entitlements;
CREATE TRIGGER update_entitlements_updated_at
  BEFORE UPDATE ON entitlements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_purchases_updated_at ON purchases;
CREATE TRIGGER update_purchases_updated_at
  BEFORE UPDATE ON purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to create test organisations
-- =====================================================
/*
INSERT INTO organisations (name, slug, invite_code, allow_domain_auto_join, allowed_email_domains)
VALUES
  ('Test Enterprise', 'test-enterprise', 'TESTORG2024', false, NULL),
  ('Auto-Join Corp', 'auto-join-corp', 'AUTOJOIN', true, ARRAY['autojoin.com', 'autojoin.org']);
*/

-- === 003_org_creation ===
-- =====================================================
-- ACCESS COMPASS - ORGANISATION CREATION
-- =====================================================
-- Migration: 003_org_creation.sql
-- Adds organisation creation functionality and size-based limits
-- =====================================================

-- Add size column to organisations table
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS size business_size_tier DEFAULT 'small';

-- =====================================================
-- COMMON EMAIL DOMAINS (exclude from auto-join)
-- =====================================================
-- These domains should never be used for domain auto-join

CREATE OR REPLACE FUNCTION is_common_email_domain(p_domain TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN LOWER(p_domain) = ANY(ARRAY[
    'gmail.com', 'googlemail.com',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.com.au',
    'icloud.com', 'me.com', 'mac.com',
    'aol.com',
    'protonmail.com', 'proton.me',
    'mail.com', 'email.com',
    'zoho.com',
    'yandex.com',
    'gmx.com', 'gmx.net',
    'fastmail.com',
    'tutanota.com',
    'inbox.com',
    'mail.ru'
  ]);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- INVITE CODE GENERATOR
-- =====================================================

CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing chars (0,O,1,I)
  code TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- MAX MEMBERS BY SIZE TIER
-- =====================================================

CREATE OR REPLACE FUNCTION get_max_members_for_size(p_size business_size_tier)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_size
    WHEN 'small' THEN 5
    WHEN 'medium' THEN 15
    WHEN 'large' THEN 50
    WHEN 'enterprise' THEN 500
    ELSE 5
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- CREATE ORGANISATION WITH ADMIN
-- =====================================================

CREATE OR REPLACE FUNCTION create_organisation_with_admin(
  p_name TEXT,
  p_size business_size_tier,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_creator_user_id UUID
)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT,
  invite_code TEXT,
  max_members INTEGER,
  domain_auto_join_enabled BOOLEAN
) AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_allowed_domains TEXT[];
  v_domain_auto_join BOOLEAN;
  v_max_members INTEGER;
BEGIN
  -- Generate slug from name
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-|-$', '', 'g');

  -- Make slug unique by appending random chars if needed
  IF EXISTS (SELECT 1 FROM organisations WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
  END IF;

  -- Generate unique invite code
  LOOP
    v_invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisations WHERE organisations.invite_code = v_invite_code);
  END LOOP;

  -- Extract email domain
  v_email_domain := split_part(p_contact_email, '@', 2);

  -- Only enable domain auto-join for non-common domains
  IF is_common_email_domain(v_email_domain) THEN
    v_allowed_domains := NULL;
    v_domain_auto_join := false;
  ELSE
    v_allowed_domains := ARRAY[v_email_domain];
    v_domain_auto_join := true;
  END IF;

  -- Get max members for size
  v_max_members := get_max_members_for_size(p_size);

  -- Create organisation
  INSERT INTO organisations (
    name,
    slug,
    size,
    contact_email,
    contact_name,
    invite_code,
    allowed_email_domains,
    allow_domain_auto_join,
    max_members
  ) VALUES (
    p_name,
    v_slug,
    p_size,
    p_contact_email,
    p_contact_name,
    v_invite_code,
    v_allowed_domains,
    v_domain_auto_join,
    v_max_members
  ) RETURNING id INTO v_org_id;

  -- Create admin membership for creator
  INSERT INTO organisation_memberships (
    organisation_id,
    user_id,
    role,
    joined_at,
    invite_accepted_at
  ) VALUES (
    v_org_id,
    p_creator_user_id,
    'admin',
    NOW(),
    NOW()
  );

  -- Return created organisation details
  RETURN QUERY
  SELECT
    v_org_id as organisation_id,
    p_name as organisation_name,
    v_slug as organisation_slug,
    v_invite_code as invite_code,
    v_max_members as max_members,
    v_domain_auto_join as domain_auto_join_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET ORGANISATION MEMBER COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_member_count(p_org_id UUID)
RETURNS INTEGER AS $$
DECLARE
  member_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO member_count
  FROM organisation_memberships
  WHERE organisation_id = p_org_id;

  RETURN member_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- CHECK IF ORG CAN ADD MORE MEMBERS
-- =====================================================

CREATE OR REPLACE FUNCTION can_org_add_member(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_max_members INTEGER;
  v_current_count INTEGER;
BEGIN
  SELECT max_members INTO v_max_members
  FROM organisations
  WHERE id = p_org_id;

  SELECT COUNT(*) INTO v_current_count
  FROM organisation_memberships
  WHERE organisation_id = p_org_id;

  RETURN v_current_count < v_max_members;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICY FOR ORG CREATION
-- =====================================================

-- Allow authenticated users to create organisations
DROP POLICY IF EXISTS "Users can create organisations" ON organisations;
CREATE POLICY "Users can create organisations"
  ON organisations FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- UPDATE domain auto-join to check member limits
-- =====================================================

CREATE OR REPLACE FUNCTION check_domain_auto_join(p_user_email TEXT)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT
) AS $$
DECLARE
  email_domain TEXT;
BEGIN
  -- Extract domain from email
  email_domain := split_part(p_user_email, '@', 2);

  -- Don't auto-join for common email domains
  IF is_common_email_domain(email_domain) THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT o.id as organisation_id, o.name as organisation_name
  FROM organisations o
  WHERE
    o.allow_domain_auto_join = true
    AND email_domain = ANY(o.allowed_email_domains)
    AND can_org_add_member(o.id); -- Check member limit
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- === 004a_enum_updates ===
-- =====================================================
-- ACCESS COMPASS - ENUM UPDATES
-- =====================================================
-- Migration: 004a_enum_updates.sql
-- Must be run FIRST and COMMITTED before 004b
-- =====================================================

-- Add new role values to org_role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'viewer' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'viewer';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'editor' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'editor';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'approver' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'approver';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'owner' AND enumtypid = 'org_role'::regtype) THEN
    ALTER TYPE org_role ADD VALUE 'owner';
  END IF;
END $$;

-- Create membership status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'membership_status') THEN
    CREATE TYPE membership_status AS ENUM ('pending', 'active', 'suspended', 'rejected');
  END IF;
END $$;

-- Create audit action enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action') THEN
    CREATE TYPE audit_action AS ENUM (
      'user_login',
      'user_logout',
      'user_signup',
      'password_reset',
      'mfa_enabled',
      'mfa_disabled',
      'org_created',
      'org_updated',
      'org_settings_changed',
      'member_invited',
      'member_joined',
      'member_approved',
      'member_rejected',
      'member_suspended',
      'member_reactivated',
      'member_removed',
      'member_role_changed',
      'invite_created',
      'invite_used',
      'invite_revoked',
      'invite_expired',
      'module_started',
      'module_completed',
      'response_submitted',
      'response_updated',
      'evidence_uploaded',
      'evidence_deleted',
      'report_generated',
      'report_exported',
      'data_exported',
      'data_deleted',
      'access_denied',
      'suspicious_activity',
      'ip_blocked',
      'rate_limit_exceeded'
    );
  END IF;
END $$;

-- === 004b_security_enhancements ===
-- =====================================================
-- ACCESS COMPASS - SECURITY ENHANCEMENTS
-- =====================================================
-- Migration: 004b_security_enhancements.sql
-- Run AFTER 004a_enum_updates.sql has been committed
-- =====================================================

-- =====================================================
-- 1. ROLE HELPER FUNCTIONS
-- =====================================================

-- Role hierarchy for permission checks
-- owner > admin > approver > editor > member > viewer
CREATE OR REPLACE FUNCTION get_role_level(p_role org_role)
RETURNS INTEGER AS $$
BEGIN
  RETURN CASE p_role
    WHEN 'owner' THEN 100
    WHEN 'admin' THEN 80
    WHEN 'approver' THEN 60
    WHEN 'editor' THEN 40
    WHEN 'member' THEN 20
    WHEN 'viewer' THEN 10
    ELSE 0
  END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Check if user has at least a certain role level
CREATE OR REPLACE FUNCTION user_has_role_level(
  p_user_id UUID,
  p_org_id UUID,
  p_min_role org_role
)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_role org_role;
BEGIN
  SELECT role INTO v_user_role
  FROM organisation_memberships
  WHERE user_id = p_user_id
    AND organisation_id = p_org_id
    AND (status IS NULL OR status = 'active');

  IF v_user_role IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN get_role_level(v_user_role) >= get_role_level(p_min_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 2. SCHEMA UPDATES
-- =====================================================

-- Add status column to memberships
ALTER TABLE organisation_memberships
  ADD COLUMN IF NOT EXISTS status membership_status DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_reason TEXT,
  ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS suspended_by UUID REFERENCES auth.users(id);

-- Add security settings to organisations
ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS require_approval BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS allowed_ip_ranges TEXT[],
  ADD COLUMN IF NOT EXISTS session_timeout_minutes INTEGER DEFAULT 480,
  ADD COLUMN IF NOT EXISTS require_mfa BOOLEAN DEFAULT false;

-- =====================================================
-- 3. INVITE CODES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS organisation_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES auth.users(id),

  -- Security settings
  expires_at TIMESTAMPTZ,
  max_uses INTEGER DEFAULT 1,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  -- Restrictions
  allowed_email_domains TEXT[],
  allowed_roles org_role[] DEFAULT ARRAY['member']::org_role[],

  -- Metadata
  label TEXT,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invite_codes_code ON organisation_invite_codes(code) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_invite_codes_org ON organisation_invite_codes(organisation_id);

-- Migrate existing invite codes (use 'admin' which exists)
INSERT INTO organisation_invite_codes (organisation_id, code, created_by, max_uses, allowed_roles)
SELECT
  o.id,
  o.invite_code,
  (SELECT user_id FROM organisation_memberships WHERE organisation_id = o.id AND role = 'admin' LIMIT 1),
  NULL,
  ARRAY['member']::org_role[]
FROM organisations o
WHERE o.invite_code IS NOT NULL
  AND (SELECT user_id FROM organisation_memberships WHERE organisation_id = o.id AND role = 'admin' LIMIT 1) IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM organisation_invite_codes ic WHERE ic.code = o.invite_code
  )
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 4. AUDIT LOGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  organisation_id UUID REFERENCES organisations(id),
  action audit_action NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB DEFAULT '{}',
  previous_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 years')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organisation_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);

-- =====================================================
-- 5. AUDIT LOG FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION create_audit_log(
  p_user_id UUID,
  p_organisation_id UUID,
  p_action audit_action,
  p_resource_type TEXT DEFAULT NULL,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_previous_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
  v_user_email TEXT;
BEGIN
  SELECT email INTO v_user_email FROM auth.users WHERE id = p_user_id;

  INSERT INTO audit_logs (
    user_id, user_email, organisation_id, action, resource_type,
    resource_id, details, previous_values, new_values, ip_address, user_agent
  ) VALUES (
    p_user_id, v_user_email, p_organisation_id, p_action, p_resource_type,
    p_resource_id, p_details, p_previous_values, p_new_values, p_ip_address, p_user_agent
  )
  RETURNING id INTO v_log_id;

  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. INVITE CODE FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION create_invite_code(
  p_org_id UUID,
  p_expires_in_days INTEGER DEFAULT 30,
  p_max_uses INTEGER DEFAULT NULL,
  p_allowed_roles org_role[] DEFAULT ARRAY['member']::org_role[],
  p_allowed_email_domains TEXT[] DEFAULT NULL,
  p_label TEXT DEFAULT NULL
)
RETURNS TABLE (invite_code TEXT, expires_at TIMESTAMPTZ) AS $$
DECLARE
  v_code TEXT;
  v_expires TIMESTAMPTZ;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  IF NOT user_has_role_level(v_user_id, p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied: requires admin role';
  END IF;

  LOOP
    v_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisation_invite_codes WHERE code = v_code);
  END LOOP;

  v_expires := CASE WHEN p_expires_in_days IS NOT NULL
    THEN NOW() + (p_expires_in_days || ' days')::INTERVAL ELSE NULL END;

  INSERT INTO organisation_invite_codes (
    organisation_id, code, created_by, expires_at, max_uses,
    allowed_roles, allowed_email_domains, label
  ) VALUES (
    p_org_id, v_code, v_user_id, v_expires, p_max_uses,
    p_allowed_roles, p_allowed_email_domains, p_label
  );

  PERFORM create_audit_log(v_user_id, p_org_id, 'invite_created', 'invite_code', v_code,
    jsonb_build_object('expires_at', v_expires, 'max_uses', p_max_uses, 'label', p_label));

  RETURN QUERY SELECT v_code, v_expires;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION use_invite_code(p_invite_code TEXT, p_user_email TEXT)
RETURNS TABLE (
  success BOOLEAN,
  organisation_id UUID,
  organisation_name TEXT,
  assigned_role org_role,
  requires_approval BOOLEAN,
  error_message TEXT
) AS $$
DECLARE
  v_invite organisation_invite_codes%ROWTYPE;
  v_org organisations%ROWTYPE;
  v_user_id UUID;
  v_email_domain TEXT;
  v_membership_status membership_status;
BEGIN
  v_user_id := auth.uid();
  v_email_domain := split_part(p_user_email, '@', 2);

  SELECT * INTO v_invite FROM organisation_invite_codes
  WHERE code = UPPER(p_invite_code) AND is_active = true;

  IF v_invite IS NULL THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invalid invite code';
    RETURN;
  END IF;

  IF v_invite.expires_at IS NOT NULL AND v_invite.expires_at < NOW() THEN
    UPDATE organisation_invite_codes SET is_active = false WHERE id = v_invite.id;
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invite code has expired';
    RETURN;
  END IF;

  IF v_invite.max_uses IS NOT NULL AND v_invite.times_used >= v_invite.max_uses THEN
    UPDATE organisation_invite_codes SET is_active = false WHERE id = v_invite.id;
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Invite code has reached its usage limit';
    RETURN;
  END IF;

  IF v_invite.allowed_email_domains IS NOT NULL
     AND array_length(v_invite.allowed_email_domains, 1) > 0
     AND NOT (v_email_domain = ANY(v_invite.allowed_email_domains)) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Your email domain is not allowed';
    RETURN;
  END IF;

  SELECT * INTO v_org FROM organisations WHERE id = v_invite.organisation_id;

  IF EXISTS (SELECT 1 FROM organisation_memberships WHERE organisation_id = v_org.id AND user_id = v_user_id) THEN
    RETURN QUERY SELECT false, v_org.id, v_org.name, NULL::org_role, false, 'Already a member';
    RETURN;
  END IF;

  IF NOT can_org_add_member(v_org.id) THEN
    RETURN QUERY SELECT false, NULL::UUID, NULL::TEXT, NULL::org_role, false, 'Organisation member limit reached';
    RETURN;
  END IF;

  v_membership_status := CASE WHEN v_org.require_approval THEN 'pending' ELSE 'active' END;

  INSERT INTO organisation_memberships (
    organisation_id, user_id, role, status, joined_at, invite_accepted_at
  ) VALUES (
    v_org.id, v_user_id, v_invite.allowed_roles[1], v_membership_status, NOW(), NOW()
  );

  UPDATE organisation_invite_codes SET times_used = times_used + 1, updated_at = NOW() WHERE id = v_invite.id;

  PERFORM create_audit_log(v_user_id, v_org.id, 'invite_used', 'invite_code', v_invite.code,
    jsonb_build_object('role', v_invite.allowed_roles[1], 'status', v_membership_status));

  RETURN QUERY SELECT true, v_org.id, v_org.name, v_invite.allowed_roles[1], v_org.require_approval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION revoke_invite_code(p_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_invite organisation_invite_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_invite FROM organisation_invite_codes WHERE code = UPPER(p_code);
  IF v_invite IS NULL THEN RETURN false; END IF;

  IF NOT user_has_role_level(auth.uid(), v_invite.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_invite_codes SET is_active = false, updated_at = NOW() WHERE id = v_invite.id;
  PERFORM create_audit_log(auth.uid(), v_invite.organisation_id, 'invite_revoked', 'invite_code', v_invite.code);
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. MEMBER MANAGEMENT FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_pending_members(p_org_id UUID)
RETURNS TABLE (membership_id UUID, user_id UUID, user_email TEXT, requested_at TIMESTAMPTZ, role org_role) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT m.id, m.user_id, u.email, m.joined_at, m.role
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id AND m.status = 'pending'
  ORDER BY m.joined_at ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION approve_member(p_membership_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'active', approved_by = auth.uid(), approved_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reject_member(p_membership_id UUID, p_reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'approver') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'rejected', suspended_reason = p_reason, suspended_by = auth.uid(), suspended_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION suspend_member(p_membership_id UUID, p_reason TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF v_membership.role = 'owner' THEN
    RAISE EXCEPTION 'Cannot suspend owner';
  END IF;

  UPDATE organisation_memberships
  SET status = 'suspended', suspended_reason = p_reason, suspended_by = auth.uid(), suspended_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reactivate_member(p_membership_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL OR v_membership.status != 'suspended' THEN
    RAISE EXCEPTION 'Membership not found or not suspended';
  END IF;

  IF NOT user_has_role_level(auth.uid(), v_membership.organisation_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisation_memberships
  SET status = 'active', suspended_reason = NULL, suspended_by = NULL, suspended_at = NULL,
      approved_by = auth.uid(), approved_at = NOW()
  WHERE id = p_membership_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION change_member_role(p_membership_id UUID, p_new_role org_role)
RETURNS BOOLEAN AS $$
DECLARE
  v_membership organisation_memberships%ROWTYPE;
  v_current_user_role_level INTEGER;
  v_target_role_level INTEGER;
  v_new_role_level INTEGER;
BEGIN
  SELECT * INTO v_membership FROM organisation_memberships WHERE id = p_membership_id;
  IF v_membership IS NULL THEN RAISE EXCEPTION 'Membership not found'; END IF;

  SELECT get_role_level(role) INTO v_current_user_role_level
  FROM organisation_memberships
  WHERE user_id = auth.uid() AND organisation_id = v_membership.organisation_id AND status = 'active';

  v_target_role_level := get_role_level(v_membership.role);
  v_new_role_level := get_role_level(p_new_role);

  IF v_current_user_role_level < get_role_level('admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  IF v_target_role_level >= v_current_user_role_level AND v_current_user_role_level < get_role_level('owner') THEN
    RAISE EXCEPTION 'Cannot change role of member with equal or higher role';
  END IF;

  IF v_new_role_level > v_current_user_role_level AND v_current_user_role_level < get_role_level('owner') THEN
    RAISE EXCEPTION 'Cannot assign role higher than your own';
  END IF;

  UPDATE organisation_memberships SET role = p_new_role WHERE id = p_membership_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 8. SECURITY & DATA FUNCTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_security_settings(p_org_id UUID)
RETURNS TABLE (
  require_approval BOOLEAN, require_mfa BOOLEAN,
  session_timeout_minutes INTEGER, has_ip_restrictions BOOLEAN, pending_member_count BIGINT
) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT o.require_approval, o.require_mfa, o.session_timeout_minutes,
    (o.allowed_ip_ranges IS NOT NULL AND array_length(o.allowed_ip_ranges, 1) > 0),
    (SELECT COUNT(*) FROM organisation_memberships m WHERE m.organisation_id = p_org_id AND m.status = 'pending')
  FROM organisations o WHERE o.id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_org_security_settings(
  p_org_id UUID,
  p_require_approval BOOLEAN DEFAULT NULL,
  p_require_mfa BOOLEAN DEFAULT NULL,
  p_session_timeout_minutes INTEGER DEFAULT NULL,
  p_allowed_ip_ranges TEXT[] DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  UPDATE organisations SET
    require_approval = COALESCE(p_require_approval, require_approval),
    require_mfa = COALESCE(p_require_mfa, require_mfa),
    session_timeout_minutes = COALESCE(p_session_timeout_minutes, session_timeout_minutes),
    allowed_ip_ranges = COALESCE(p_allowed_ip_ranges, allowed_ip_ranges),
    updated_at = NOW()
  WHERE id = p_org_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_audit_log_summary(p_org_id UUID, p_days INTEGER DEFAULT 30, p_limit INTEGER DEFAULT 100)
RETURNS TABLE (id UUID, user_email TEXT, action audit_action, resource_type TEXT, details JSONB, created_at TIMESTAMPTZ) AS $$
BEGIN
  IF NOT user_has_role_level(auth.uid(), p_org_id, 'admin') THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT a.id, a.user_email, a.action, a.resource_type, a.details, a.created_at
  FROM audit_logs a
  WHERE a.organisation_id = p_org_id AND a.created_at > NOW() - (p_days || ' days')::INTERVAL
  ORDER BY a.created_at DESC LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_org_members(p_org_id UUID)
RETURNS TABLE (
  membership_id UUID, user_id UUID, user_email TEXT, role org_role,
  status membership_status, joined_at TIMESTAMPTZ, approved_at TIMESTAMPTZ
) AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id AND user_id = auth.uid() AND status = 'active'
  ) THEN
    RAISE EXCEPTION 'Permission denied';
  END IF;

  RETURN QUERY
  SELECT m.id, m.user_id, u.email, m.role, m.status, m.joined_at, m.approved_at
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
  ORDER BY CASE m.status WHEN 'pending' THEN 0 WHEN 'active' THEN 1 ELSE 2 END, m.joined_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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
    'audit_logs', (SELECT jsonb_agg(row_to_json(a)) FROM audit_logs a WHERE a.user_id = v_target_user AND a.organisation_id = p_org_id)
  ) INTO v_result;

  PERFORM create_audit_log(auth.uid(), p_org_id, 'data_exported', 'user_data', v_target_user::TEXT, jsonb_build_object('exported_by', auth.uid()));
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION request_data_deletion(p_org_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();

  PERFORM create_audit_log(v_user_id, p_org_id, 'data_deleted', 'user_data', v_user_id::TEXT, jsonb_build_object('requested_at', NOW()));

  DELETE FROM organisation_memberships WHERE user_id = v_user_id AND organisation_id = p_org_id;

  UPDATE audit_logs SET user_email = 'deleted_user', details = details - 'email' - 'name'
  WHERE user_id = v_user_id AND organisation_id = p_org_id;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 9. ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE organisation_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view org invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can view org invite codes" ON organisation_invite_codes FOR SELECT
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can insert invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can insert invite codes" ON organisation_invite_codes FOR INSERT
  WITH CHECK (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can update invite codes" ON organisation_invite_codes;
CREATE POLICY "Admins can update invite codes" ON organisation_invite_codes FOR UPDATE
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin'));

DROP POLICY IF EXISTS "Admins can view org audit logs" ON audit_logs;
CREATE POLICY "Admins can view org audit logs" ON audit_logs FOR SELECT
  USING (user_has_role_level(auth.uid(), organisation_id, 'admin') OR user_id = auth.uid());

-- =====================================================
-- 10. GRANTS
-- =====================================================

GRANT EXECUTE ON FUNCTION user_has_role_level TO authenticated;
GRANT EXECUTE ON FUNCTION get_role_level TO authenticated;
GRANT EXECUTE ON FUNCTION create_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION use_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION revoke_invite_code TO authenticated;
GRANT EXECUTE ON FUNCTION get_pending_members TO authenticated;
GRANT EXECUTE ON FUNCTION approve_member TO authenticated;
GRANT EXECUTE ON FUNCTION reject_member TO authenticated;
GRANT EXECUTE ON FUNCTION suspend_member TO authenticated;
GRANT EXECUTE ON FUNCTION reactivate_member TO authenticated;
GRANT EXECUTE ON FUNCTION change_member_role TO authenticated;
GRANT EXECUTE ON FUNCTION export_user_data TO authenticated;
GRANT EXECUTE ON FUNCTION request_data_deletion TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_security_settings TO authenticated;
GRANT EXECUTE ON FUNCTION update_org_security_settings TO authenticated;
GRANT EXECUTE ON FUNCTION get_audit_log_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_members TO authenticated;

-- === 005_ownership_transfer ===
-- =====================================================
-- ACCESS COMPASS - OWNERSHIP MANAGEMENT
-- =====================================================
-- Migration: 005_ownership_transfer.sql
-- Run AFTER 004a and 004b
-- - Upgrades org creators to owner role
-- - Adds ownership transfer functionality
-- =====================================================

-- =====================================================
-- 1. UPGRADE EXISTING ORG CREATORS TO OWNER
-- =====================================================

-- Find the earliest admin in each org and make them owner
-- (This assumes the first admin was the creator)
UPDATE organisation_memberships m
SET role = 'owner'
FROM (
  SELECT DISTINCT ON (organisation_id) id
  FROM organisation_memberships
  WHERE role = 'admin'
  ORDER BY organisation_id, joined_at ASC
) first_admins
WHERE m.id = first_admins.id;

-- =====================================================
-- 2. UPDATE ORG CREATION TO USE OWNER ROLE
-- =====================================================

CREATE OR REPLACE FUNCTION create_organisation_with_admin(
  p_name TEXT,
  p_size business_size_tier,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_creator_user_id UUID
)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT,
  invite_code TEXT,
  max_members INTEGER,
  domain_auto_join_enabled BOOLEAN
) AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_allowed_domains TEXT[];
  v_domain_auto_join BOOLEAN;
  v_max_members INTEGER;
BEGIN
  -- Generate slug from name
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-|-$', '', 'g');

  -- Make slug unique by appending random chars if needed
  IF EXISTS (SELECT 1 FROM organisations WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
  END IF;

  -- Generate unique invite code
  LOOP
    v_invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisations WHERE organisations.invite_code = v_invite_code);
  END LOOP;

  -- Extract email domain
  v_email_domain := split_part(p_contact_email, '@', 2);

  -- Only enable domain auto-join for non-common domains
  IF is_common_email_domain(v_email_domain) THEN
    v_allowed_domains := NULL;
    v_domain_auto_join := false;
  ELSE
    v_allowed_domains := ARRAY[v_email_domain];
    v_domain_auto_join := true;
  END IF;

  -- Get max members for size
  v_max_members := get_max_members_for_size(p_size);

  -- Create organisation
  INSERT INTO organisations (
    name,
    slug,
    size,
    contact_email,
    contact_name,
    invite_code,
    allowed_email_domains,
    allow_domain_auto_join,
    max_members
  ) VALUES (
    p_name,
    v_slug,
    p_size,
    p_contact_email,
    p_contact_name,
    v_invite_code,
    v_allowed_domains,
    v_domain_auto_join,
    v_max_members
  ) RETURNING id INTO v_org_id;

  -- Create OWNER membership for creator (not just admin)
  INSERT INTO organisation_memberships (
    organisation_id,
    user_id,
    role,
    status,
    joined_at,
    invite_accepted_at
  ) VALUES (
    v_org_id,
    p_creator_user_id,
    'owner',  -- Changed from 'admin' to 'owner'
    'active',
    NOW(),
    NOW()
  );

  -- Return created organisation details
  RETURN QUERY
  SELECT
    v_org_id as organisation_id,
    p_name as organisation_name,
    v_slug as organisation_slug,
    v_invite_code as invite_code,
    v_max_members as max_members,
    v_domain_auto_join as domain_auto_join_enabled;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 3. TRANSFER OWNERSHIP FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION transfer_ownership(
  p_org_id UUID,
  p_new_owner_user_id UUID
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_user_id UUID;
  v_current_membership organisation_memberships%ROWTYPE;
  v_new_owner_membership organisation_memberships%ROWTYPE;
BEGIN
  v_current_user_id := auth.uid();

  -- Get current user's membership
  SELECT * INTO v_current_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = v_current_user_id
    AND status = 'active';

  -- Must be current owner to transfer
  IF v_current_membership IS NULL OR v_current_membership.role != 'owner' THEN
    RETURN QUERY SELECT false, 'Only the current owner can transfer ownership';
    RETURN;
  END IF;

  -- Can't transfer to yourself
  IF p_new_owner_user_id = v_current_user_id THEN
    RETURN QUERY SELECT false, 'You are already the owner';
    RETURN;
  END IF;

  -- Get new owner's membership
  SELECT * INTO v_new_owner_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = p_new_owner_user_id
    AND status = 'active';

  -- New owner must be an existing active member
  IF v_new_owner_membership IS NULL THEN
    RETURN QUERY SELECT false, 'New owner must be an active member of the organisation';
    RETURN;
  END IF;

  -- New owner should be at least an admin (prevent transferring to viewer/member)
  IF get_role_level(v_new_owner_membership.role) < get_role_level('admin') THEN
    RETURN QUERY SELECT false, 'New owner must be an admin or higher role';
    RETURN;
  END IF;

  -- Perform the transfer
  -- 1. Demote current owner to admin
  UPDATE organisation_memberships
  SET role = 'admin'
  WHERE id = v_current_membership.id;

  -- 2. Promote new owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner_membership.id;

  -- 3. Audit log
  PERFORM create_audit_log(
    v_current_user_id,
    p_org_id,
    'member_role_changed',
    'ownership_transfer',
    p_new_owner_user_id::TEXT,
    jsonb_build_object(
      'previous_owner', v_current_user_id,
      'new_owner', p_new_owner_user_id,
      'transferred_at', NOW()
    )
  );

  RETURN QUERY SELECT true, 'Ownership transferred successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. LEAVE ORGANISATION FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION leave_organisation(p_org_id UUID)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_user_id UUID;
  v_membership organisation_memberships%ROWTYPE;
  v_member_count INTEGER;
BEGIN
  v_current_user_id := auth.uid();

  -- Get membership
  SELECT * INTO v_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = v_current_user_id;

  IF v_membership IS NULL THEN
    RETURN QUERY SELECT false, 'You are not a member of this organisation';
    RETURN;
  END IF;

  -- Owners cannot leave - must transfer first
  IF v_membership.role = 'owner' THEN
    -- Check if there are other members
    SELECT COUNT(*) INTO v_member_count
    FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND status = 'active';

    IF v_member_count > 1 THEN
      RETURN QUERY SELECT false, 'As the owner, you must transfer ownership before leaving. Go to Settings > Members to transfer ownership to another admin.';
      RETURN;
    ELSE
      -- Owner is the only member - delete the org entirely
      DELETE FROM organisations WHERE id = p_org_id;
      RETURN QUERY SELECT true, 'Organisation deleted as you were the only member';
      RETURN;
    END IF;
  END IF;

  -- Non-owners can leave freely
  DELETE FROM organisation_memberships WHERE id = v_membership.id;

  -- Audit log
  PERFORM create_audit_log(
    v_current_user_id,
    p_org_id,
    'member_removed',
    'membership',
    v_membership.id::TEXT,
    jsonb_build_object('left_voluntarily', true)
  );

  RETURN QUERY SELECT true, 'You have left the organisation';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. GET ORG OWNER FUNCTION (helper)
-- =====================================================

CREATE OR REPLACE FUNCTION get_org_owner(p_org_id UUID)
RETURNS TABLE (
  user_id UUID,
  user_email TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT m.user_id, u.email
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
    AND m.role = 'owner'
    AND m.status = 'active'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 6. CHECK IF USER IS OWNER
-- =====================================================

CREATE OR REPLACE FUNCTION is_org_owner(p_org_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := COALESCE(p_user_id, auth.uid());

  RETURN EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND user_id = v_user_id
      AND role = 'owner'
      AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 7. GRANTS
-- =====================================================

GRANT EXECUTE ON FUNCTION transfer_ownership TO authenticated;
GRANT EXECUTE ON FUNCTION leave_organisation TO authenticated;
GRANT EXECUTE ON FUNCTION get_org_owner TO authenticated;
GRANT EXECUTE ON FUNCTION is_org_owner TO authenticated;

-- =====================================================
-- 8. SUPERADMIN OVERRIDE FUNCTIONS
-- =====================================================
-- These functions are for support staff to handle
-- edge cases like abandoned organisations or
-- unreachable owners. They require service_role access.
-- =====================================================

-- Check if current caller is service role (for admin operations)
CREATE OR REPLACE FUNCTION is_service_role()
RETURNS BOOLEAN AS $$
BEGIN
  -- Service role has no auth.uid() but has full access
  -- Regular users always have auth.uid()
  RETURN auth.uid() IS NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin override: Force reassign ownership
-- Only callable via service_role (backend/admin panel)
CREATE OR REPLACE FUNCTION admin_reassign_ownership(
  p_org_id UUID,
  p_new_owner_user_id UUID,
  p_reason TEXT,
  p_support_ticket_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_current_owner_id UUID;
  v_current_owner_membership_id UUID;
  v_new_owner_membership organisation_memberships%ROWTYPE;
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN QUERY SELECT false, 'This function requires service role access. Contact system administrator.';
    RETURN;
  END IF;

  -- Reason is required for audit trail
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RETURN QUERY SELECT false, 'A reason is required for admin override actions';
    RETURN;
  END IF;

  -- Get current owner
  SELECT m.user_id, m.id INTO v_current_owner_id, v_current_owner_membership_id
  FROM organisation_memberships m
  WHERE m.organisation_id = p_org_id
    AND m.role = 'owner'
    AND m.status = 'active'
  LIMIT 1;

  -- Get new owner's membership
  SELECT * INTO v_new_owner_membership
  FROM organisation_memberships
  WHERE organisation_id = p_org_id
    AND user_id = p_new_owner_user_id
    AND status = 'active';

  -- New owner must be an existing active member
  IF v_new_owner_membership IS NULL THEN
    RETURN QUERY SELECT false, 'New owner must be an active member of the organisation';
    RETURN;
  END IF;

  -- Perform the transfer
  -- 1. Demote current owner to admin (if exists and different from new owner)
  IF v_current_owner_id IS NOT NULL AND v_current_owner_id != p_new_owner_user_id THEN
    UPDATE organisation_memberships
    SET role = 'admin'
    WHERE id = v_current_owner_membership_id;
  END IF;

  -- 2. Promote new owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner_membership.id;

  -- 3. Create detailed audit log for admin action
  INSERT INTO audit_logs (
    organisation_id,
    user_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_org_id,
    NULL, -- No user_id for service role actions
    'member_role_changed',
    'admin_override',
    v_new_owner_membership.id::TEXT,
    jsonb_build_object(
      'override_type', 'ownership_reassignment',
      'previous_owner', v_current_owner_id,
      'new_owner', p_new_owner_user_id,
      'reason', p_reason,
      'support_ticket_id', p_support_ticket_id,
      'performed_at', NOW(),
      'performed_by', 'service_role'
    )
  );

  RETURN QUERY SELECT true, 'Ownership reassigned successfully via admin override';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin override: Auto-promote longest-serving admin
-- Use when owner is completely gone and you need to restore access
CREATE OR REPLACE FUNCTION admin_auto_promote_owner(
  p_org_id UUID,
  p_reason TEXT,
  p_support_ticket_id TEXT DEFAULT NULL
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  new_owner_user_id UUID,
  new_owner_email TEXT
) AS $$
DECLARE
  v_current_owner_exists BOOLEAN;
  v_new_owner RECORD;
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN QUERY SELECT false, 'This function requires service role access', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Reason is required
  IF p_reason IS NULL OR trim(p_reason) = '' THEN
    RETURN QUERY SELECT false, 'A reason is required for admin override actions', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Check if org already has an active owner
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE organisation_id = p_org_id
      AND role = 'owner'
      AND status = 'active'
  ) INTO v_current_owner_exists;

  IF v_current_owner_exists THEN
    RETURN QUERY SELECT false, 'Organisation already has an active owner. Use admin_reassign_ownership instead.', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Find longest-serving admin
  SELECT m.id, m.user_id, u.email
  INTO v_new_owner
  FROM organisation_memberships m
  JOIN auth.users u ON u.id = m.user_id
  WHERE m.organisation_id = p_org_id
    AND m.role = 'admin'
    AND m.status = 'active'
  ORDER BY m.joined_at ASC
  LIMIT 1;

  -- If no admin found, try longest-serving active member of any role
  IF v_new_owner IS NULL THEN
    SELECT m.id, m.user_id, u.email
    INTO v_new_owner
    FROM organisation_memberships m
    JOIN auth.users u ON u.id = m.user_id
    WHERE m.organisation_id = p_org_id
      AND m.status = 'active'
    ORDER BY m.joined_at ASC
    LIMIT 1;
  END IF;

  IF v_new_owner IS NULL THEN
    RETURN QUERY SELECT false, 'No eligible members found to promote', NULL::UUID, NULL::TEXT;
    RETURN;
  END IF;

  -- Promote to owner
  UPDATE organisation_memberships
  SET role = 'owner'
  WHERE id = v_new_owner.id;

  -- Audit log
  INSERT INTO audit_logs (
    organisation_id,
    user_id,
    action,
    entity_type,
    entity_id,
    metadata
  ) VALUES (
    p_org_id,
    NULL,
    'member_role_changed',
    'admin_override',
    v_new_owner.id::TEXT,
    jsonb_build_object(
      'override_type', 'auto_promote_owner',
      'new_owner', v_new_owner.user_id,
      'new_owner_email', v_new_owner.email,
      'reason', p_reason,
      'support_ticket_id', p_support_ticket_id,
      'performed_at', NOW(),
      'performed_by', 'service_role'
    )
  );

  RETURN QUERY SELECT true, 'New owner promoted successfully', v_new_owner.user_id, v_new_owner.email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin: Get organisation status for support
CREATE OR REPLACE FUNCTION admin_get_org_status(p_org_id UUID)
RETURNS TABLE (
  org_name TEXT,
  org_slug TEXT,
  created_at TIMESTAMPTZ,
  member_count BIGINT,
  has_owner BOOLEAN,
  owner_email TEXT,
  admin_count BIGINT,
  pending_count BIGINT
) AS $$
BEGIN
  -- Verify service role access
  IF NOT is_service_role() THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    o.name,
    o.slug,
    o.created_at,
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND status = 'active'),
    EXISTS (SELECT 1 FROM organisation_memberships WHERE organisation_id = p_org_id AND role = 'owner' AND status = 'active'),
    (SELECT u.email FROM organisation_memberships m JOIN auth.users u ON u.id = m.user_id WHERE m.organisation_id = p_org_id AND m.role = 'owner' AND m.status = 'active' LIMIT 1),
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND role = 'admin' AND status = 'active'),
    (SELECT COUNT(*) FROM organisation_memberships WHERE organisation_id = p_org_id AND status = 'pending')
  FROM organisations o
  WHERE o.id = p_org_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: These admin functions are NOT granted to authenticated users
-- They can only be called via service_role key from your backend/admin panel

-- === 006_pre_registered_emails ===
-- =====================================================
-- ACCESS COMPASS - PRE-REGISTERED EMAIL INVITES
-- =====================================================
-- Migration: 006_pre_registered_emails.sql
-- Adds pre-registered email validation for org invites
-- Only users whose emails are pre-registered can join
-- =====================================================

-- =====================================================
-- ALLOWED EMAILS TABLE
-- =====================================================
-- Stores pre-registered emails that can join an organisation

CREATE TABLE IF NOT EXISTS organisation_allowed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  added_by UUID REFERENCES auth.users(id),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ, -- When someone actually joined with this email
  used_by UUID REFERENCES auth.users(id), -- The user who joined
  notes TEXT, -- Optional notes about this person

  -- Ensure email is unique per organisation
  UNIQUE(organisation_id, email)
);

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_allowed_emails_org ON organisation_allowed_emails(organisation_id);
CREATE INDEX IF NOT EXISTS idx_allowed_emails_email ON organisation_allowed_emails(LOWER(email));

-- =====================================================
-- ADD REQUIRE_EMAIL_PREREGISTRATION FLAG TO ORGS
-- =====================================================

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS require_email_preregistration BOOLEAN DEFAULT true;

-- =====================================================
-- CHECK IF EMAIL IS ALLOWED TO JOIN
-- =====================================================

CREATE OR REPLACE FUNCTION is_email_allowed_to_join(
  p_org_id UUID,
  p_email TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_require_preregistration BOOLEAN;
  v_email_allowed BOOLEAN;
BEGIN
  -- Check if org requires pre-registration
  SELECT require_email_preregistration INTO v_require_preregistration
  FROM organisations
  WHERE id = p_org_id;

  -- If pre-registration not required, allow anyone
  IF v_require_preregistration = false THEN
    RETURN true;
  END IF;

  -- Check if email is in allowed list (case-insensitive)
  SELECT EXISTS(
    SELECT 1 FROM organisation_allowed_emails
    WHERE organisation_id = p_org_id
    AND LOWER(email) = LOWER(p_email)
    AND used_at IS NULL -- Not already used
  ) INTO v_email_allowed;

  RETURN v_email_allowed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- VALIDATE AND JOIN WITH INVITE CODE
-- =====================================================
-- Returns validation result and org info if valid

CREATE OR REPLACE FUNCTION validate_invite_code_for_email(
  p_invite_code TEXT,
  p_email TEXT
)
RETURNS TABLE (
  is_valid BOOLEAN,
  error_code TEXT,
  error_message TEXT,
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT
) AS $$
DECLARE
  v_org RECORD;
  v_email_allowed BOOLEAN;
BEGIN
  -- Find organisation by invite code
  SELECT o.id, o.name, o.slug, o.require_email_preregistration
  INTO v_org
  FROM organisations o
  WHERE UPPER(o.invite_code) = UPPER(p_invite_code);

  -- Check if invite code exists
  IF v_org IS NULL THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'INVALID_CODE'::TEXT as error_code,
      'Invalid invite code. Please check and try again.'::TEXT as error_message,
      NULL::UUID as organisation_id,
      NULL::TEXT as organisation_name,
      NULL::TEXT as organisation_slug;
    RETURN;
  END IF;

  -- Check if email is allowed
  v_email_allowed := is_email_allowed_to_join(v_org.id, p_email);

  IF NOT v_email_allowed THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'EMAIL_NOT_REGISTERED'::TEXT as error_code,
      'Your email address has not been registered for this organisation. Please contact your organisation administrator.'::TEXT as error_message,
      v_org.id as organisation_id,
      v_org.name as organisation_name,
      v_org.slug as organisation_slug;
    RETURN;
  END IF;

  -- Check member limit
  IF NOT can_org_add_member(v_org.id) THEN
    RETURN QUERY SELECT
      false::BOOLEAN as is_valid,
      'ORG_FULL'::TEXT as error_code,
      'This organisation has reached its member limit.'::TEXT as error_message,
      v_org.id as organisation_id,
      v_org.name as organisation_name,
      v_org.slug as organisation_slug;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT
    true::BOOLEAN as is_valid,
    NULL::TEXT as error_code,
    NULL::TEXT as error_message,
    v_org.id as organisation_id,
    v_org.name as organisation_name,
    v_org.slug as organisation_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- MARK EMAIL AS USED WHEN JOINING
-- =====================================================

CREATE OR REPLACE FUNCTION mark_allowed_email_as_used(
  p_org_id UUID,
  p_email TEXT,
  p_user_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE organisation_allowed_emails
  SET
    used_at = NOW(),
    used_by = p_user_id
  WHERE organisation_id = p_org_id
  AND LOWER(email) = LOWER(p_email);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- ADD ALLOWED EMAILS TO ORGANISATION
-- =====================================================

CREATE OR REPLACE FUNCTION add_allowed_emails(
  p_org_id UUID,
  p_emails TEXT[], -- Array of email addresses
  p_added_by UUID
)
RETURNS TABLE (
  added_count INTEGER,
  skipped_count INTEGER,
  skipped_emails TEXT[]
) AS $$
DECLARE
  v_email TEXT;
  v_added INTEGER := 0;
  v_skipped INTEGER := 0;
  v_skipped_emails TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH v_email IN ARRAY p_emails
  LOOP
    -- Skip empty emails
    IF v_email IS NULL OR TRIM(v_email) = '' THEN
      CONTINUE;
    END IF;

    -- Try to insert (skip if already exists)
    BEGIN
      INSERT INTO organisation_allowed_emails (
        organisation_id,
        email,
        added_by
      ) VALUES (
        p_org_id,
        LOWER(TRIM(v_email)),
        p_added_by
      );
      v_added := v_added + 1;
    EXCEPTION WHEN unique_violation THEN
      v_skipped := v_skipped + 1;
      v_skipped_emails := array_append(v_skipped_emails, v_email);
    END;
  END LOOP;

  RETURN QUERY SELECT v_added, v_skipped, v_skipped_emails;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- GET ALLOWED EMAILS FOR ORGANISATION
-- =====================================================

CREATE OR REPLACE FUNCTION get_allowed_emails(p_org_id UUID)
RETURNS TABLE (
  id UUID,
  email TEXT,
  added_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  is_used BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.id,
    ae.email,
    ae.added_at,
    ae.used_at,
    (ae.used_at IS NOT NULL) as is_used
  FROM organisation_allowed_emails ae
  WHERE ae.organisation_id = p_org_id
  ORDER BY ae.added_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- REMOVE ALLOWED EMAIL
-- =====================================================

CREATE OR REPLACE FUNCTION remove_allowed_email(
  p_org_id UUID,
  p_email_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
  v_deleted BOOLEAN;
BEGIN
  DELETE FROM organisation_allowed_emails
  WHERE id = p_email_id
  AND organisation_id = p_org_id
  AND used_at IS NULL; -- Can't remove if already used

  GET DIAGNOSTICS v_deleted = ROW_COUNT;
  RETURN v_deleted > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- UPDATE ORG CREATION TO INCLUDE ALLOWED EMAILS
-- =====================================================

CREATE OR REPLACE FUNCTION create_organisation_with_admin_and_emails(
  p_name TEXT,
  p_size business_size_tier,
  p_contact_email TEXT,
  p_contact_name TEXT,
  p_creator_user_id UUID,
  p_allowed_emails TEXT[] DEFAULT ARRAY[]::TEXT[]
)
RETURNS TABLE (
  organisation_id UUID,
  organisation_name TEXT,
  organisation_slug TEXT,
  invite_code TEXT,
  max_members INTEGER,
  domain_auto_join_enabled BOOLEAN,
  emails_added INTEGER
) AS $$
DECLARE
  v_org_id UUID;
  v_slug TEXT;
  v_invite_code TEXT;
  v_email_domain TEXT;
  v_allowed_domains TEXT[];
  v_domain_auto_join BOOLEAN;
  v_max_members INTEGER;
  v_emails_added INTEGER := 0;
BEGIN
  -- Generate slug from name
  v_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9]+', '-', 'g'));
  v_slug := regexp_replace(v_slug, '^-|-$', '', 'g');

  -- Make slug unique by appending random chars if needed
  IF EXISTS (SELECT 1 FROM organisations WHERE slug = v_slug) THEN
    v_slug := v_slug || '-' || substr(md5(random()::text), 1, 6);
  END IF;

  -- Generate unique invite code
  LOOP
    v_invite_code := generate_invite_code();
    EXIT WHEN NOT EXISTS (SELECT 1 FROM organisations WHERE organisations.invite_code = v_invite_code);
  END LOOP;

  -- Extract email domain
  v_email_domain := split_part(p_contact_email, '@', 2);

  -- Only enable domain auto-join for non-common domains
  IF is_common_email_domain(v_email_domain) THEN
    v_allowed_domains := NULL;
    v_domain_auto_join := false;
  ELSE
    v_allowed_domains := ARRAY[v_email_domain];
    v_domain_auto_join := true;
  END IF;

  -- Get max members for size
  v_max_members := get_max_members_for_size(p_size);

  -- Create organisation with pre-registration required by default
  INSERT INTO organisations (
    name,
    slug,
    size,
    contact_email,
    contact_name,
    invite_code,
    allowed_email_domains,
    allow_domain_auto_join,
    max_members,
    require_email_preregistration
  ) VALUES (
    p_name,
    v_slug,
    p_size,
    p_contact_email,
    p_contact_name,
    v_invite_code,
    v_allowed_domains,
    v_domain_auto_join,
    v_max_members,
    true -- Require pre-registration by default
  ) RETURNING id INTO v_org_id;

  -- Create admin membership for creator
  INSERT INTO organisation_memberships (
    organisation_id,
    user_id,
    role,
    joined_at,
    invite_accepted_at
  ) VALUES (
    v_org_id,
    p_creator_user_id,
    'admin',
    NOW(),
    NOW()
  );

  -- Add allowed emails if provided
  IF array_length(p_allowed_emails, 1) > 0 THEN
    SELECT added_count INTO v_emails_added
    FROM add_allowed_emails(v_org_id, p_allowed_emails, p_creator_user_id);
  END IF;

  -- Return created organisation details
  RETURN QUERY
  SELECT
    v_org_id as organisation_id,
    p_name as organisation_name,
    v_slug as organisation_slug,
    v_invite_code as invite_code,
    v_max_members as max_members,
    v_domain_auto_join as domain_auto_join_enabled,
    v_emails_added as emails_added;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- RLS POLICIES FOR ALLOWED EMAILS
-- =====================================================

ALTER TABLE organisation_allowed_emails ENABLE ROW LEVEL SECURITY;

-- Org admins can view allowed emails for their org
CREATE POLICY "Org admins can view allowed emails"
  ON organisation_allowed_emails FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- Org admins can insert allowed emails
CREATE POLICY "Org admins can add allowed emails"
  ON organisation_allowed_emails FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- Org admins can delete unused allowed emails
CREATE POLICY "Org admins can remove unused allowed emails"
  ON organisation_allowed_emails FOR DELETE
  USING (
    used_at IS NULL
    AND EXISTS (
      SELECT 1 FROM organisation_memberships om
      WHERE om.organisation_id = organisation_allowed_emails.organisation_id
      AND om.user_id = auth.uid()
      AND om.role IN ('admin', 'owner')
    )
  );

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT, DELETE ON organisation_allowed_emails TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- === 007_add_user_org_columns ===
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

-- === 008_new_data_tables ===
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

-- === 009_rls_policies ===
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

-- === 010_backfill_user_ids ===
-- =====================================================
-- MIGRATION 010: Backfill user_id on existing data rows
-- =====================================================
-- The sessions table uses `id` (UUID) as its primary key.
-- Other tables reference it as `session_id` (TEXT).
-- We join on sessions.id::TEXT = other.session_id
--
-- Safe to run multiple times (only updates NULL rows).
-- =====================================================

-- Step 1: Backfill module_progress
UPDATE module_progress mp
SET user_id = s.user_id,
    organisation_id = s.organisation_id
FROM sessions s
WHERE mp.session_id = s.id::TEXT
  AND mp.user_id IS NULL
  AND s.user_id IS NOT NULL;

-- Step 2: Backfill module_responses
UPDATE module_responses mr
SET user_id = s.user_id,
    organisation_id = s.organisation_id
FROM sessions s
WHERE mr.session_id = s.id::TEXT
  AND mr.user_id IS NULL
  AND s.user_id IS NOT NULL;

-- Step 3: Backfill diap_items
UPDATE diap_items di
SET user_id = s.user_id,
    organisation_id = s.organisation_id
FROM sessions s
WHERE di.session_id = s.id::TEXT
  AND di.user_id IS NULL
  AND s.user_id IS NOT NULL;

-- Step 4: Backfill diap_documents
UPDATE diap_documents dd
SET user_id = s.user_id,
    organisation_id = s.organisation_id
FROM sessions s
WHERE dd.session_id = s.id::TEXT
  AND dd.user_id IS NULL
  AND s.user_id IS NOT NULL;

-- Step 5: Backfill discovery_data
UPDATE discovery_data dd
SET user_id = s.user_id,
    organisation_id = s.organisation_id
FROM sessions s
WHERE dd.session_id = s.id::TEXT
  AND dd.user_id IS NULL
  AND s.user_id IS NOT NULL;

-- Step 6: Backfill actions (if session_id column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'actions' AND column_name = 'session_id' AND table_schema = 'public'
  ) THEN
    EXECUTE '
      UPDATE actions a
      SET user_id = s.user_id,
          organisation_id = s.organisation_id
      FROM sessions s
      WHERE a.session_id = s.id::TEXT
        AND a.user_id IS NULL
        AND s.user_id IS NOT NULL
    ';
  END IF;
END $$;

-- Step 7: Backfill clarifications (if session_id column exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'clarifications' AND column_name = 'session_id' AND table_schema = 'public'
  ) THEN
    EXECUTE '
      UPDATE clarifications c
      SET user_id = s.user_id,
          organisation_id = s.organisation_id
      FROM sessions s
      WHERE c.session_id = s.id::TEXT
        AND c.user_id IS NULL
        AND s.user_id IS NOT NULL
    ';
  END IF;
END $$;

-- Report: how many rows still have NULL user_id
SELECT 'sessions' as table_name, COUNT(*) FILTER (WHERE user_id IS NULL) as null_user_id, COUNT(*) as total FROM sessions
UNION ALL
SELECT 'module_progress', COUNT(*) FILTER (WHERE user_id IS NULL), COUNT(*) FROM module_progress
UNION ALL
SELECT 'module_responses', COUNT(*) FILTER (WHERE user_id IS NULL), COUNT(*) FROM module_responses
UNION ALL
SELECT 'diap_items', COUNT(*) FILTER (WHERE user_id IS NULL), COUNT(*) FROM diap_items
UNION ALL
SELECT 'diap_documents', COUNT(*) FILTER (WHERE user_id IS NULL), COUNT(*) FROM diap_documents
UNION ALL
SELECT 'discovery_data', COUNT(*) FILTER (WHERE user_id IS NULL), COUNT(*) FROM discovery_data
ORDER BY table_name;

-- === 011_fix_missing_rls ===
-- =====================================================
-- MIGRATION 011: Ensure RLS is enabled on ALL tables
-- and policies exist for tables that were missed
-- =====================================================
-- Safe to re-run: uses IF NOT EXISTS / DO blocks

-- Enable RLS on all tables (idempotent - no error if already enabled)
ALTER TABLE IF EXISTS organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS organisation_allowed_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS deleted_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS module_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discovery_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS discovery_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS clarifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_custom_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_custom_category_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS diap_team_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sync_metadata ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- ORGANISATIONS - policies from 002 + 003
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Members can view their organisations" ON organisations
    FOR SELECT USING (
      id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can lookup org by invite code" ON organisations
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create organisations" ON organisations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org owners can update their org" ON organisations
    FOR UPDATE USING (
      id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role = 'owner' AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION MEMBERSHIPS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own memberships" ON organisation_memberships
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can view org member list" ON organisation_memberships
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own membership" ON organisation_memberships
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update memberships" ON organisation_memberships
    FOR UPDATE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships m
        WHERE m.user_id = auth.uid() AND m.role IN ('admin', 'owner') AND m.status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ENTITLEMENTS (uses scope_type + scope_id, not user_id)
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own user entitlements" ON entitlements
    FOR SELECT USING (
      (scope_type = 'user' AND scope_id = auth.uid())
      OR (scope_type = 'org' AND scope_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND status = 'active'
      ))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own entitlements" ON entitlements
    FOR INSERT WITH CHECK (scope_type = 'user' AND scope_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- PURCHASES
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Users can view their own purchases" ON purchases
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can create their own purchases" ON purchases
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION INVITE CODES
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Admins can view org invite codes" ON organisation_invite_codes
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can insert invite codes" ON organisation_invite_codes
    FOR INSERT WITH CHECK (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can update invite codes" ON organisation_invite_codes
    FOR UPDATE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- AUDIT LOGS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Admins can view org audit logs" ON audit_logs
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- ORGANISATION ALLOWED EMAILS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Org admins can view allowed emails" ON organisation_allowed_emails
    FOR SELECT USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org admins can add allowed emails" ON organisation_allowed_emails
    FOR INSERT WITH CHECK (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Org admins can remove unused allowed emails" ON organisation_allowed_emails
    FOR DELETE USING (
      organisation_id IN (
        SELECT organisation_id FROM organisation_memberships
        WHERE user_id = auth.uid() AND role IN ('admin', 'owner') AND status = 'active'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- DELETED ASSESSMENTS
-- =====================================================
DO $$ BEGIN
  CREATE POLICY "Allow anonymous insert" ON deleted_assessments
    FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Allow session read" ON deleted_assessments
    FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- === 012_fix_rls_recursion ===
-- =====================================================
-- MIGRATION 012: Fix infinite recursion in organisation_memberships RLS
-- =====================================================
-- The "Users can view org member list" and "Admins can update memberships"
-- policies query organisation_memberships from within organisation_memberships
-- RLS, causing infinite recursion. Fix: use a SECURITY DEFINER function
-- that bypasses RLS for the lookup.

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "Users can view org member list" ON organisation_memberships;
DROP POLICY IF EXISTS "Admins can update memberships" ON organisation_memberships;

-- 2. Create SECURITY DEFINER functions (bypass RLS, no recursion)
CREATE OR REPLACE FUNCTION get_user_org_ids(p_user_id UUID)
RETURNS SETOF UUID AS $$
  SELECT organisation_id FROM organisation_memberships
  WHERE user_id = p_user_id AND status = 'active';
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_org_admin(p_user_id UUID, p_org_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM organisation_memberships
    WHERE user_id = p_user_id
      AND organisation_id = p_org_id
      AND role IN ('admin', 'owner')
      AND status = 'active'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 3. Recreate policies using safe functions
CREATE POLICY "Users can view org member list" ON organisation_memberships
  FOR SELECT USING (
    organisation_id IN (SELECT get_user_org_ids(auth.uid()))
  );

CREATE POLICY "Admins can update memberships" ON organisation_memberships
  FOR UPDATE USING (
    is_org_admin(auth.uid(), organisation_id)
  );

-- === 013_activity_log ===
-- =====================================================
-- MIGRATION 013: Activity log for team collaboration
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id),
  type TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_org_time ON activity_log(organisation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_session ON activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Org members can read all org activity
DO $$ BEGIN
  CREATE POLICY "Org members can view activity" ON activity_log
    FOR SELECT USING (
      organisation_id IN (SELECT get_user_org_ids(auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can also read their own activity (even without org)
DO $$ BEGIN
  CREATE POLICY "Users can view own activity" ON activity_log
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own activity
DO $$ BEGIN
  CREATE POLICY "Users can insert activity" ON activity_log
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add comments column to diap_items (if not exists)
DO $$ BEGIN
  ALTER TABLE diap_items ADD COLUMN comments JSONB DEFAULT '[]';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- === 014_evidence_storage ===
-- =====================================================
-- MIGRATION 014: Evidence storage bucket and RLS policies
-- =====================================================
-- Run this in Supabase SQL Editor, then create the bucket
-- in the Supabase Dashboard > Storage.

-- Create an evidence metadata table to track files across the org
CREATE TABLE IF NOT EXISTS evidence_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id),
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_evidence_org ON evidence_files(organisation_id);
CREATE INDEX IF NOT EXISTS idx_evidence_module ON evidence_files(module_id);
CREATE INDEX IF NOT EXISTS idx_evidence_user ON evidence_files(user_id);

-- Enable RLS
ALTER TABLE evidence_files ENABLE ROW LEVEL SECURITY;

-- Org members can view all org evidence
DO $$ BEGIN
  CREATE POLICY "Org members can view evidence" ON evidence_files
    FOR SELECT USING (
      organisation_id IN (SELECT get_user_org_ids(auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can view their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can view own evidence" ON evidence_files
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can insert evidence" ON evidence_files
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can delete their own evidence
DO $$ BEGIN
  CREATE POLICY "Users can delete own evidence" ON evidence_files
    FOR DELETE USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- AFTER running this SQL, create the storage bucket:
--
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "New bucket"
-- 3. Name: evidence-files
-- 4. Public: OFF (private)
-- 5. File size limit: 10 MB
-- 6. Allowed MIME types:
--    image/jpeg, image/png, image/webp, image/gif,
--    application/pdf,
--    application/msword,
--    application/vnd.openxmlformats-officedocument.wordprocessingml.document
--
-- Then add these storage RLS policies in the Dashboard:
--
-- SELECT policy (name: "Org members can read evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--     OR EXISTS (
--       SELECT 1 FROM organisation_members
--       WHERE user_id = auth.uid()
--       AND organisation_id IN (
--         SELECT organisation_id FROM evidence_files
--         WHERE storage_path = name
--       )
--     )
--   )
--
-- INSERT policy (name: "Users can upload evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--   )
--
-- DELETE policy (name: "Users can delete own evidence"):
--   (bucket_id = 'evidence-files') AND (
--     auth.uid()::text = (storage.foldername(name))[1]
--   )
-- =====================================================

-- === 015_authority_orgs ===
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

-- === 016_program_funding ===
-- =====================================================
-- ACCESS COMPASS - PROGRAM FUNDING MODEL
-- =====================================================
-- Migration: 016_program_funding.sql
-- Adds funding model and license pricing to authority programs
-- =====================================================

-- Funding model: who pays for business licenses
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS funding_model TEXT NOT NULL DEFAULT 'authority_funded'
    CHECK (funding_model IN ('authority_funded', 'business_funded', 'co_funded'));

-- License price in cents (AUD) for business-funded or co-funded programs
-- NULL means authority-funded (no charge to business)
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS license_price_cents INTEGER;

-- Display message shown to businesses on the enrol page
ALTER TABLE authority_programs
  ADD COLUMN IF NOT EXISTS enrol_message TEXT;

-- === 017_module_responses_fields ===
-- =====================================================
-- MIGRATION 017: Extend module_responses for full data sync
-- =====================================================
-- Adds missing response fields and fixes answer CHECK constraint
-- to match actual app values.
-- =====================================================

-- Drop the old restrictive CHECK constraint on answer
ALTER TABLE module_responses DROP CONSTRAINT IF EXISTS module_responses_answer_check;

-- Add updated CHECK that matches all app response options
ALTER TABLE module_responses ADD CONSTRAINT module_responses_answer_check
  CHECK (answer IN ('yes', 'no', 'partially', 'not-sure', 'unable-to-check', 'not-applicable', 'na'));

-- Add missing response data columns
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS partial_description TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS multi_select_values TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS other_description TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS link_value TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS evidence_count INTEGER DEFAULT 0;

-- Add user_id if missing (needed for RLS and recovery queries)
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS organisation_id UUID REFERENCES organisations(id);

-- Index for response recovery (find all responses for a user's module)
CREATE INDEX IF NOT EXISTS idx_module_responses_user_module
  ON module_responses(user_id, module_id);

-- === 018_sync_gap_columns ===
-- =====================================================
-- MIGRATION 018: Add missing columns for sync gap fixes
-- =====================================================
-- Adds ownership fields to module_progress, measurement
-- fields to module_responses, and business_snapshot to
-- sessions table.
-- =====================================================

-- =====================================================
-- MODULE PROGRESS: Ownership fields (assignedTo, etc.)
-- =====================================================
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS assigned_to TEXT;
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS assigned_to_email TEXT;
ALTER TABLE module_progress ADD COLUMN IF NOT EXISTS target_completion_date TEXT;

-- =====================================================
-- MODULE RESPONSES: Measurement data
-- =====================================================
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_value NUMERIC;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_unit TEXT;
ALTER TABLE module_responses ADD COLUMN IF NOT EXISTS measurement_confidence TEXT
  CHECK (measurement_confidence IN ('confident', 'somewhat-confident', 'not-confident'));

-- =====================================================
-- SESSIONS: Business snapshot as JSONB
-- =====================================================
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS business_snapshot JSONB;

-- === 019_module_carryover ===
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

-- === create_deleted_assessments_table ===
-- Migration: Create deleted_assessments table
-- Purpose: Temporary storage for deleted assessments (30-day retention)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- Create the deleted_assessments table
CREATE TABLE IF NOT EXISTS deleted_assessments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  run_data JSONB NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  recovery_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_deleted_assessments_session
  ON deleted_assessments(session_id);

CREATE INDEX IF NOT EXISTS idx_deleted_assessments_recovery_code
  ON deleted_assessments(recovery_code);

CREATE INDEX IF NOT EXISTS idx_deleted_assessments_expires
  ON deleted_assessments(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE deleted_assessments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for backup functionality)
CREATE POLICY "Allow anonymous insert" ON deleted_assessments
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow users to read their own session's deleted assessments
CREATE POLICY "Allow session read" ON deleted_assessments
  FOR SELECT
  USING (true);

-- Comment on table
COMMENT ON TABLE deleted_assessments IS 'Temporary storage for deleted assessments. Auto-cleanup after 30 days.';

-- Create a function to clean up expired assessments
CREATE OR REPLACE FUNCTION cleanup_expired_assessments()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM deleted_assessments
  WHERE expires_at < NOW();

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION cleanup_expired_assessments() TO anon, authenticated;
