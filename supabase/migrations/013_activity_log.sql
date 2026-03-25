-- =====================================================
-- MIGRATION 013: Activity log for team collaboration
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID REFERENCES organisations(id),
  type TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_org_time ON activity_log(organisation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_session ON activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_log(user_id);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Org members can read all org activity
DO $$ BEGIN
  CREATE POLICY "Org members can view activity" ON activity_log
    FOR SELECT USING (
      organisation_id IN (SELECT get_user_org_ids(auth.uid()))
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can also read their own activity (even without org)
DO $$ BEGIN
  CREATE POLICY "Users can view own activity" ON activity_log
    FOR SELECT USING (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Users can insert their own activity
DO $$ BEGIN
  CREATE POLICY "Users can insert activity" ON activity_log
    FOR INSERT WITH CHECK (user_id = auth.uid());
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Add comments column to diap_items (if not exists)
DO $$ BEGIN
  ALTER TABLE diap_items ADD COLUMN comments JSONB DEFAULT '[]';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;
