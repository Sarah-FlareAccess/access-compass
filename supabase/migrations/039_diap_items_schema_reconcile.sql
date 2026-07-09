-- Reconcile diap_items with every column the sync write path sends.
--
-- The org-scoped write (cloudSync.syncOrgRecord) always injects
-- last_modified_by_user_id, and syncItemToCloud sends sort_order, board_column,
-- framework_domain(s), source_answer and content_edited. Several of these were
-- never added to diap_items on prod:
--   * last_modified_by_user_id: migration 023 added it to module_responses and
--     module_progress but skipped diap_items.
--   * sort_order: no migration ever created it.
--   * framework_domain (035) had not landed on prod.
-- A single unknown column makes PostgREST reject the WHOLE upsert with
-- PGRST204, and the sync layer swallows that error, so DIAP edits silently
-- never synced across devices. All additions are IF NOT EXISTS so existing
-- columns (from 001/013/023/034/035/036/038) are untouched.

ALTER TABLE public.diap_items
  ADD COLUMN IF NOT EXISTS last_modified_by_user_id UUID,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER,
  ADD COLUMN IF NOT EXISTS board_column TEXT,
  ADD COLUMN IF NOT EXISTS framework_domain TEXT,
  ADD COLUMN IF NOT EXISTS framework_domains TEXT[],
  ADD COLUMN IF NOT EXISTS source_answer TEXT,
  ADD COLUMN IF NOT EXISTS content_edited BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS site_id UUID,
  ADD COLUMN IF NOT EXISTS comments JSONB DEFAULT '[]';

-- PostgREST caches the schema; new columns are invisible to the API until it
-- reloads. Nudge it so writes are accepted immediately.
NOTIFY pgrst, 'reload schema';
