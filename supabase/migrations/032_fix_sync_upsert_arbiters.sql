-- =====================================================
-- 032. FIX CLOUD SYNC UPSERT ARBITERS
-- =====================================================
-- Migration 023 created PARTIAL unique indexes on module_progress and
-- module_responses (one WHERE site_id IS NULL, one WHERE site_id IS NOT NULL).
-- The app upserts via PostgREST with on_conflict=<columns>, which cannot name
-- a partial index's WHERE predicate, so Postgres rejects every write with
-- "no unique or exclusion constraint matching the ON CONFLICT specification"
-- (SQLSTATE 42P10) -> HTTP 400. Result: assessment answers never reached the
-- cloud and lived only in each browser's localStorage.
--
-- Fix: replace the two partial indexes per table with a single NON-partial
-- unique index that uses NULLS NOT DISTINCT (Postgres 15+). This treats a NULL
-- site_id (org-wide) as a single value, so it enforces the same uniqueness the
-- two partial indexes did, while being a full index PostgREST CAN target as an
-- on_conflict arbiter. The app (cloudSync.ts) now always sends the
-- site-inclusive conflict key.
--
-- Safe: index-only change, no data is truncated or deleted. Existing rows
-- already satisfy both old partial constraints, so the combined index builds
-- without conflict.
-- =====================================================

-- module_progress: one canonical row per (org, site, module)
DROP INDEX IF EXISTS module_progress_org_module_no_site_key;
DROP INDEX IF EXISTS module_progress_org_site_module_key;

CREATE UNIQUE INDEX IF NOT EXISTS module_progress_org_site_module_uniq
  ON module_progress (organisation_id, site_id, module_id)
  NULLS NOT DISTINCT;

-- module_responses: one canonical row per (org, site, module, question)
DROP INDEX IF EXISTS module_responses_org_module_question_no_site_key;
DROP INDEX IF EXISTS module_responses_org_site_module_question_key;

CREATE UNIQUE INDEX IF NOT EXISTS module_responses_org_site_module_question_uniq
  ON module_responses (organisation_id, site_id, module_id, question_id)
  NULLS NOT DISTINCT;
