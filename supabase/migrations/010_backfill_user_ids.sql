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
