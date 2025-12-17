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
