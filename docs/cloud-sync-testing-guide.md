# Cloud Sync Testing Guide

## Prerequisites
- Migrations 007, 008, 009 run on Supabase (already done)
- Run migration 010 (backfill) in SQL Editor
- Create the `evidence-files` storage bucket in Supabase Dashboard > Storage > New Bucket (set to private, 10MB file limit)
- Deploy the latest code (or run `npm run dev` locally)

## Test 1: Basic Cloud Sync (Single Device)

1. Open the app and **log in** with your account
2. Go through discovery and start a module assessment
3. Answer 3-4 questions
4. Open Supabase Dashboard > Table Editor > `module_progress`
5. **Verify**: You should see a row with your `user_id` and the module data
6. Check `module_responses` table too - individual answers should appear

**Pass criteria**: Data appears in Supabase within a few seconds of answering.

## Test 2: Session & Discovery Sync

1. Complete the discovery flow (select touchpoints, get recommendations)
2. Check `sessions` table in Supabase - your session should have `user_id` set
3. Check `discovery_data` table - your touchpoint selections should be there

**Pass criteria**: Session and discovery data visible in Supabase.

## Test 3: DIAP Sync

1. Go to the DIAP workspace
2. Create or edit a DIAP item
3. Check `diap_items` table in Supabase within ~5 seconds (2-second debounce)

**Pass criteria**: DIAP items appear in Supabase.

## Test 4: Multi-Device Conflict Detection

1. **Device A** (e.g. Chrome): Log in, make some changes, wait a few seconds for sync
2. **Device B** (e.g. Edge, or another browser/incognito): Log in with the same account
3. **Verify**: A modal should appear on Device B saying "Data found from another device"
4. Choose "Use cloud data" - your data from Device A should load
5. Alternatively, test "Keep this device's data" option

**Pass criteria**: Conflict modal appears, both resolution options work.

## Test 5: Offline Resilience

1. Log in and load the app normally
2. Go offline (browser DevTools > Network > Offline, or disconnect WiFi)
3. Answer several questions, create a DIAP item
4. **Verify**: App works normally, no errors visible
5. Go back online
6. Wait 5-10 seconds
7. Check Supabase tables

**Pass criteria**: Data created offline syncs to Supabase once back online.

## Test 6: Training Progress Sync

1. Start a training course, complete a lesson
2. Check `training_progress` table in Supabase

**Pass criteria**: Course progress appears in Supabase.

## Test 7: Evidence Upload (requires evidence-files bucket)

1. In a module assessment, attach a photo to a question
2. Wait a few seconds
3. Check Supabase Storage > `evidence-files` bucket

**Pass criteria**: Photo appears in storage bucket. If bucket doesn't exist, the photo stays as base64 in localStorage (no error).

## Test 8: Custom DIAP Categories Sync

1. In DIAP workspace, create a custom category
2. Rename an existing category
3. Check `diap_custom_categories` and `diap_custom_category_names` tables

**Pass criteria**: Custom categories and renames appear in Supabase.

## Troubleshooting

- **No data in Supabase**: Check browser console for `[CloudSync]` log messages. Common issues: not logged in, Supabase URL/key not set in .env
- **RLS blocking writes**: If you see 403 or "new row violates row-level security policy", the user_id might not match auth.uid(). Check that the `user_id` being sent matches the logged-in user.
- **Sync queue growing**: Check localStorage key `access_compass_sync_queue` to see pending operations
- **Conflict modal not showing**: Only appears if another device synced within 24 hours. Check `sync_metadata` table for device entries.
