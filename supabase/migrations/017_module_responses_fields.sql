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
