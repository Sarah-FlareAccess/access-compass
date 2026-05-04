# Evidence Storage Scaling — Architecture and Upgrade Triggers

Built 2026-05-04. This document captures the long-term architecture for evidence file storage and the exact triggers + steps for future upgrades when scale demands them.

## Current architecture

**Storage:** Two private Supabase Storage buckets in the Sydney project:

- `evidence-files` (10 MB limit) — module question evidence + DIAP item attachments
- `diap-documents` (25 MB limit) — workspace-level DIAP documents

**URLs:** On-demand signed URLs with 1-hour TTL, in-memory cache per browser tab.

- Helper: `src/utils/signedUrlCache.ts` (`getSignedUrl(bucket, path)`)
- React hook: `src/hooks/useSignedUrl.ts`
- Components fetch a fresh signed URL each mount; the cache returns the same URL for 59 minutes
- No expiring URLs are stored in the DB — fully regenerated on demand. This permanently solves the 1-year signed-URL expiry problem.

**Source of truth:** `evidence_files` table with `diap_item_id` FK back to `diap_items`. Local `item.attachments` is a mirror populated from the table on cloud restore.

## Scaling thresholds

| Trigger | What to do | Why |
|---|---|---|
| Evidence Library has > ~200 visible items per user OR feels slow on initial render | Add list virtualisation (react-window or similar) so only on-screen items request signed URLs | First-paint signed-URL burst grows linearly with item count |
| Approaching Supabase Pro-tier egress limit (~250 GB/month) | Generate image thumbnails at upload time (sharp on the server, or a Supabase Edge Function); load full file only on click | Every preview = full file download |
| > ~500 cached signed URLs all expiring within seconds of each other | Add jitter to TTL (e.g. `3600 + Math.random() * 600`) so refreshes stagger | Currently fine because rendering is lazy, but a single-page library could hit this |
| Cross-page persistence needed (URL cache wiped on every navigation) | Move cache into IndexedDB or a service worker | Memory-only cache is fine for dashboard-scoped use; not for SPA-wide persistence |
| Need to batch hundreds of signed URLs in one round trip | Build a Supabase Edge Function that accepts an array of paths and returns signed URLs in one response | Cuts round-trip count from N to 1 |

## Exact prompts to trigger an upgrade

When users complain or metrics flag a problem, paste one of these to Claude:

- **"Evidence library is slow / laggy when there are lots of items"** → "Add list virtualisation to the Evidence Library in `Dashboard.tsx` (and DIAP attachment lists in `DIAPWorkspace.tsx`) so only visible rows fire signed URL requests. Use react-window."

- **"We're hitting Supabase egress limits"** → "Add server-side thumbnail generation for image evidence on upload. Store thumbnail path alongside `storage_path` in `evidence_files`. Update the Evidence Library and DIAP attachment chips to display thumbnails instead of full files."

- **"Signed URLs are too slow on a fresh page load"** → "Build a Supabase Edge Function `batch-sign-urls` that accepts `{ bucket, paths: string[] }` and returns `{ urls: Record<path, signedUrl> }`. Call it once from `useDIAPManagement` cloud-restore instead of N individual `createSignedUrl` calls."

- **"Files disappear after browser tab is left open overnight"** → That's the in-memory cache being cleared by the browser. Either accept it (next render generates fresh URLs anyway), or migrate `signedUrlCache` storage from `Map` to IndexedDB.

## Things NOT to do (will reintroduce solved bugs)

- Do not store signed URLs in the database. They expire. We solved this; do not undo it.
- Do not make buckets public for "performance". Evidence is sensitive — auth must gate access.
- Do not use `getPublicUrl()` anywhere new. It generates URLs that only work on public buckets.
- Do not use base64 fallback in localStorage as a primary path. It blew up the quota the first time around.

## Files to touch when upgrading

- `src/utils/signedUrlCache.ts` — cache logic
- `src/hooks/useSignedUrl.ts` — hook
- `src/hooks/useDIAPManagement.ts` — DIAP attachment load/upload (around line 580 cloud restore, line 1690 addAttachment)
- `src/components/questions/EvidenceUpload.tsx` — module-level evidence upload (line 68 generateId, line 148 evidence_files insert)
- `src/utils/evidenceStorage.ts` — uploadEvidence helper (still returns 1-yr signedUrl for back-compat; ignore the URL in new code, use storagePath + getSignedUrl instead)
- `src/pages/Dashboard.tsx` — Evidence Library rendering (around line 1260 DIAP rows)
- `src/pages/DIAPWorkspace.tsx` — attachment chip click handlers

## Sydney DB migration applied 2026-05-04

```sql
alter table public.evidence_files alter column module_id drop not null;
alter table public.evidence_files alter column question_id drop not null;

alter table public.evidence_files
  add column if not exists diap_item_id uuid references public.diap_items(id) on delete cascade;

create index if not exists idx_evidence_diap_item on public.evidence_files(diap_item_id);

notify pgrst, 'reload schema';
```
