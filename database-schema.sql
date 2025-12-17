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
-- ============================================
