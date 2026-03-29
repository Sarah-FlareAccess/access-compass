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
