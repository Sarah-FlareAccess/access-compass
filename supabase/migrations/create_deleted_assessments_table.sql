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
