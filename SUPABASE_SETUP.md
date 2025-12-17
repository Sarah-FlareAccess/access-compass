# Supabase Setup Guide

This guide will help you set up Supabase for Access Compass.

## Step 1: Run Database Schema

1. **Go to your Supabase project:** https://app.supabase.com/project/ibvqlyyvlwnwjcoehjkt

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and paste the entire contents of `database-schema.sql`**

4. **Run the query** (click "Run" or press Ctrl/Cmd + Enter)

5. **Verify tables created:**
   - Click "Table Editor" in the left sidebar
   - You should see: `sessions`, `actions`, `evidence`, `clarifications`

## Step 2: Verify Environment Variables

Your `.env` file should already have:

```bash
VITE_SUPABASE_URL=https://ibvqlyyvlwnwjcoehjkt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidnFseXl2bHdud2pjb2Voamt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5MDk0NTksImV4cCI6MjA4MTQ4NTQ1OX0.uuUre8CG0pYD4qW9AYP5Xz_VFHbOsv6n5T5Oryq8lpg
```

✅ These are already in your `.env` file from the template!

## Step 3: Test Supabase Connection

Restart your dev server:

```bash
npm run dev
```

The Supabase client is now available at `src/utils/supabase.ts`.

## Database Schema Overview

### Tables Created

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `sessions` | User assessment sessions | business_snapshot, selected_modules, discovery_responses |
| `actions` | Accessibility actions/recommendations | priority, title, effort, cost_band, status |
| `evidence` | Photos/documents attached to actions | action_id, type, url, file_data |
| `clarifications` | "Not sure" items to review later | session_id, question, resolved |

### Security Features

✅ **Row Level Security (RLS)** enabled on all tables
✅ **Users can only access their own data**
✅ **Cascading deletes** - Deleting a session deletes all related data
✅ **Auto-timestamps** - created_at, updated_at managed automatically

## Current State: MVP (No Auth)

The app currently works with **localStorage only**. The database schema is ready for Phase 2 when you add authentication.

### How It Works Now

1. User visits app → Creates session in localStorage
2. Completes assessment → Data saved to localStorage
3. Views dashboard → Reads from localStorage

### Phase 2: With Supabase (Future)

1. User logs in → `user_id` linked to session
2. Completes assessment → Data synced to Supabase
3. Views dashboard → Reads from Supabase
4. Multi-device sync → Access from any device

## Migrating from localStorage to Supabase (Phase 2)

When you're ready to enable Supabase:

### 1. Update `src/utils/session.ts`

Replace localStorage functions with Supabase queries:

```typescript
import { supabase } from './supabase';

// Example: Get session
export const getSession = async (): Promise<Session | null> => {
  if (!supabase) return getSessionFromLocalStorage();

  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .single();

  return data;
};

// Example: Save actions
export const saveActions = async (actions: Action[]): Promise<void> => {
  if (!supabase) return saveActionsToLocalStorage(actions);

  const { error } = await supabase
    .from('actions')
    .upsert(actions);

  if (error) throw error;
};
```

### 2. Enable Authentication

Add authentication to your app:

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Sign out
await supabase.auth.signOut();
```

### 3. Link Sessions to Users

When creating a new session:

```typescript
const { data: { user } } = await supabase.auth.getUser();

const { data, error } = await supabase
  .from('sessions')
  .insert({
    user_id: user?.id,
    business_snapshot: snapshot,
    // ... other fields
  });
```

## Example Queries

### Get all sessions for current user

```typescript
const { data: sessions, error } = await supabase
  .from('sessions')
  .select('*')
  .order('created_at', { ascending: false });
```

### Get actions for a session with priority

```typescript
const { data: actions, error } = await supabase
  .from('actions')
  .select('*')
  .eq('session_id', sessionId)
  .eq('priority', 'act_now')
  .order('created_at');
```

### Update action status

```typescript
const { error } = await supabase
  .from('actions')
  .update({ status: 'in_progress', owner: 'Sarah' })
  .eq('id', actionId);
```

### Get unresolved clarifications

```typescript
const { data: clarifications, error } = await supabase
  .from('clarifications')
  .select('*')
  .eq('session_id', sessionId)
  .eq('resolved', false);
```

### Add evidence to an action

```typescript
const { data, error } = await supabase
  .from('evidence')
  .insert({
    action_id: actionId,
    type: 'photo',
    url: 'https://storage.example.com/photo.jpg',
    filename: 'entrance-ramp.jpg',
  });
```

## Database Management

### View Data in Supabase

1. Go to **Table Editor** in Supabase dashboard
2. Select a table to view/edit data
3. Use filters and search to find records

### Backup Database

```bash
# From Supabase dashboard: Settings > Database > Database backups
```

### Monitor Performance

- Go to **Reports** in Supabase dashboard
- View query performance, API usage, storage

## Troubleshooting

### ❌ "relation does not exist" error

**Fix:** Run the `database-schema.sql` file in SQL Editor

### ❌ "permission denied" errors

**Fix:** Check Row Level Security policies are correct. Users must be authenticated to access data.

### ❌ Supabase client is null

**Fix:** Verify `.env` has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

### ❌ Data not syncing

**Fix:** Check browser console for errors. Verify network requests in DevTools.

## Next Steps

1. ✅ **Schema created** - Your database is ready
2. ⏳ **Add authentication** - Implement sign up/sign in
3. ⏳ **Migrate session management** - Replace localStorage with Supabase
4. ⏳ **Test multi-device sync** - Verify data syncs across devices
5. ⏳ **Add file storage** - Upload evidence files to Supabase Storage

---

**Need help?** Check Supabase docs: https://supabase.com/docs
