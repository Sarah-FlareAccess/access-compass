-- Patch: create missing enums + actions/evidence/clarifications tables
-- Run this BEFORE migration 009

DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('act_now', 'plan_next', 'consider_later');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE effort_level AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE action_status AS ENUM ('not_started', 'in_progress', 'complete', 'on_hold');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE evidence_type AS ENUM ('photo', 'pdf', 'link');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  priority priority_level NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  why_matters TEXT NOT NULL,
  effort effort_level NOT NULL,
  cost_band TEXT NOT NULL,
  how_to_steps TEXT[] NOT NULL DEFAULT '{}',
  example TEXT NOT NULL,
  owner TEXT,
  timeframe TEXT,
  status action_status NOT NULL DEFAULT 'not_started',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_actions_session_id ON actions(session_id);
CREATE INDEX IF NOT EXISTS idx_actions_priority ON actions(priority);
CREATE INDEX IF NOT EXISTS idx_actions_status ON actions(status);

CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action_id UUID NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
  type evidence_type NOT NULL,
  filename TEXT,
  url TEXT NOT NULL,
  file_data TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_evidence_action_id ON evidence(action_id);

CREATE TABLE IF NOT EXISTS clarifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  module TEXT NOT NULL,
  why_matters TEXT NOT NULL,
  how_to_check TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_clarifications_session_id ON clarifications(session_id);
CREATE INDEX IF NOT EXISTS idx_clarifications_resolved ON clarifications(resolved);
