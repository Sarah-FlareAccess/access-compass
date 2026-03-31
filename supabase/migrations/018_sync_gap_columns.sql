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
