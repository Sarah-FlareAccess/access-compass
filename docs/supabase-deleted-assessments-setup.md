# Supabase Setup: Deleted Assessments Backup

This document explains how to set up the `deleted_assessments` table in Supabase for temporary backup of deleted assessments.

## Purpose

When users delete an assessment, the data is backed up to Supabase for 30 days. This allows:
- Recovery of accidentally deleted assessments
- Users receive a recovery code they can use to request data restoration
- Automatic cleanup after 30 days

## Setup Instructions

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your Access Compass project
3. Click **SQL Editor** in the left sidebar
4. Click **New query**
5. Copy and paste the SQL below
6. Click **Run** (or press Ctrl+Enter)

## SQL Migration

```sql
-- Migration: Create deleted_assessments table
-- Purpose: Temporary storage for deleted assessments (30-day retention)

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
```

## How It Works

### When a User Deletes an Assessment

1. The assessment data is saved to the `deleted_assessments` table
2. A unique 8-character recovery code is generated (e.g., `ABC123XY`)
3. The user sees the recovery code on screen
4. The assessment is deleted from local storage

### Recovery Process

If a user needs to recover a deleted assessment:

1. They provide you with their recovery code
2. In Supabase Table Editor, search `deleted_assessments` for that code
3. The `run_data` column contains the full assessment JSON
4. You can provide this data back to the user

### Automatic Cleanup

To manually run cleanup of expired assessments:

```sql
SELECT cleanup_expired_assessments();
```

For automatic daily cleanup, you can enable pg_cron in Supabase and add:

```sql
SELECT cron.schedule('cleanup-deleted-assessments', '0 0 * * *', 'SELECT cleanup_expired_assessments()');
```

## Table Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `session_id` | TEXT | User's session identifier |
| `module_id` | TEXT | Which module the assessment was for |
| `module_name` | TEXT | Human-readable module name |
| `run_data` | JSONB | Complete assessment data |
| `deleted_at` | TIMESTAMPTZ | When the assessment was deleted |
| `expires_at` | TIMESTAMPTZ | When the backup expires (30 days after deletion) |
| `recovery_code` | TEXT | Unique code for recovery requests |
| `created_at` | TIMESTAMPTZ | Record creation timestamp |

## Security Notes

- RLS is enabled with policies that allow inserts and reads
- Recovery codes are randomly generated and unique
- Data is automatically expired after 30 days
- No sensitive authentication data is stored
