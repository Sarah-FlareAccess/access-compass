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
