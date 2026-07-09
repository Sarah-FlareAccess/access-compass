# Plan: scoped member access (sites, events, programs, role-per-scope)

**Goal:** let an org admin decide *what each member can access* — specific
sites/venues, specific events, and (for authorities) specific programs — and
*what they can do there* (role per scope). Today every active member sees and
edits everything in the org.

Status: DRAFT for review. No code yet.

---

## 1. Current state (what we build on)

- **Membership:** `organisation_memberships (user_id, organisation_id, role, status)`.
  Access is **org-wide**: RLS is `organisation_id IN (SELECT organisation_id FROM
  organisation_memberships WHERE user_id = auth.uid() AND status = 'active')`.
- **Roles:** DB enum `org_role` is only `('admin','member')`. The app's TS
  `OrgRole` is richer: `owner | admin | approver | editor | member | viewer`.
  These are out of sync. Helper fns exist and are the right pattern to reuse:
  `user_has_role_level(user, org, min_role)`, `is_org_admin_or_owner(...)`,
  `get_role_level(...)` — all `SECURITY DEFINER` (avoid RLS recursion).
- **Sites:** `sites` table; `site_id` stamped on `module_progress`,
  `module_responses`, `diap_items`, `evidence_files`. Site switcher via
  `useSites` + `activeSiteId`. No per-member site restriction exists.
- **Programs (authorities):** `authority_programs`, `program_enrolments`
  (enrolled businesses), `authority_question_guidance` (migration 015).
- **Events:** no first-class `events` table found. Events today are module
  groups (6.x events, 7.x major-events) inside a normal site assessment.
  ⚠️ This is the biggest open question — see §3.

## 2. Design principles

- **Default open, opt-in narrowing.** A member keeps full org access until an
  admin restricts them. Nothing changes for existing users until an admin acts.
  (Safer than default-closed, which would lock everyone out on deploy.)
- **Defense in depth.** Enforce in the database (RLS) AND in the app (hide what
  they can't reach). RLS is the real boundary; the app is UX.
- **Non-recursive RLS.** All new checks go through `SECURITY DEFINER` helper
  functions like the existing ones. This is why the Authority policies broke
  before; do not write policies that re-query the same table they protect.
- **One scoping mechanism, three scope types.** Sites, events and programs are
  all "scopes". Model them uniformly so we build the machinery once.

## 3. Decisions (confirmed 2026-07-09)

1. **Events are first-class records.** Add an `events` table (each event belongs
   to a site/org), stamp `event_id` onto the relevant assessment rows, and let
   admins staff people onto events like sites. (Phase 4 includes this table.)
2. **Expand the DB `org_role` enum** to match the TS type
   (`owner/approver/editor/viewer` added) and reconcile. Confirmed.
3. **Role granularity — ship uniform, schema-ready for matrix.** Implement
   Option A: a member has ONE org role; scope controls only *which* sites/events/
   programs they see. BUT keep the nullable `scope_role` column now (NULL =
   inherit org role) so a full per-scope matrix can be switched on later with no
   further migration. CONFIRMED 2026-07-09: ship A.
4. **Owners/admins always bypass scoping** — they see everything. Confirmed.

## 4. Data model

New join table (the core of the feature):

```sql
-- One row per (member, scope) grant. Absence of ANY rows for a member = full
-- org access (default open). Presence of rows = restricted to exactly those.
CREATE TABLE membership_scope_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES organisation_memberships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,               -- denormalised for fast RLS checks
  scope_type TEXT NOT NULL CHECK (scope_type IN ('site','event','program')),
  scope_id UUID NOT NULL,              -- sites.id | events.id | authority_programs.id
  scope_role org_role,                 -- NULL = inherit org membership role
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (membership_id, scope_type, scope_id)
);
CREATE INDEX idx_msa_user ON membership_scope_access(user_id, organisation_id);
```

Plus, if we choose §3.1 option (b): a first-class `events` table with `site_id`
/ `organisation_id`, and stamp `event_id` onto the relevant assessment rows.

Role enum expansion (if §3.2 = expand):
```sql
ALTER TYPE org_role ADD VALUE IF NOT EXISTS 'owner';
ALTER TYPE org_role ADD VALUE IF NOT EXISTS 'approver';
ALTER TYPE org_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE org_role ADD VALUE IF NOT EXISTS 'viewer';
-- then update get_role_level() ordering
```

## 5. Security (RLS) — the careful part

Add a `SECURITY DEFINER` helper, then reference it from data-table policies:

```sql
-- TRUE if the user may access this scope: either they have no scope grants at
-- all for this org (full access), or they have a grant for this scope_id.
CREATE OR REPLACE FUNCTION user_can_access_scope(
  p_user UUID, p_org UUID, p_scope_type TEXT, p_scope_id UUID
) RETURNS BOOLEAN AS $$
  SELECT
    is_org_admin_or_owner(p_user, p_org)
    OR NOT EXISTS (
      SELECT 1 FROM membership_scope_access
      WHERE user_id = p_user AND organisation_id = p_org AND scope_type = p_scope_type
    )
    OR EXISTS (
      SELECT 1 FROM membership_scope_access
      WHERE user_id = p_user AND organisation_id = p_org
        AND scope_type = p_scope_type AND scope_id = p_scope_id
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
```

Then the site-scoped tables (`module_progress`, `module_responses`,
`diap_items`, `evidence_files`, and `sites` itself) get their SELECT/UPDATE/
INSERT/DELETE `_v3` policies extended with
`AND user_can_access_scope(auth.uid(), organisation_id, 'site', site_id)`.
Rows with `site_id IS NULL` (org-wide items) stay visible to all members.
Programs get the same treatment keyed on `program`. This is additive: keep the
existing org check, AND the scope check.

**Test matrix before ship:** unrestricted member (sees all), site-restricted
member (sees only theirs), admin (sees all regardless), org-wide/NULL-site rows
(visible to all), cross-org isolation still holds.

## 6. App changes

- **`useScopeAccess` hook** — returns the current user's allowed sites / events /
  programs (or "all"). Drives filtering everywhere.
- **`useSites`** — filter returned sites to the allowed set; if the active site
  is no longer allowed, reset to the first allowed one.
- **Program + (event) switchers** — same filtering.
- **Admin UI** — extend the member-management screen (`useOrgAdmin`,
  `getMembers`/`changeRole` live there) with an "Access" panel per member:
  choose All vs Specific, tick sites/events/programs, optionally set role per
  scope. Writes `membership_scope_access` rows.
- **Client gating** — hide nav/routes/records the user can't reach so they never
  see a flash of forbidden data before RLS trims it.
- **Report generators** — respect the allowed scope when a restricted user
  exports (they should not be able to export sites they can't see).

## 7. Suggested phasing (since you want all of it)

1. **Phase 1 — sites.** Table + `user_can_access_scope` + site-table policies +
   `useScopeAccess` + admin "Access" panel (sites only). Ships the core value.
2. **Phase 2 — role per scope.** Expand `org_role`, reconcile TS, honour
   `scope_role` in app + policies.
3. **Phase 3 — programs.** Reuse the machinery for `authority_programs`.
4. **Phase 4 — events.** Depends on §3.1 decision; may include the `events`
   table + `event_id` stamping first.

Each phase is independently shippable and safe (default-open).

## 8. Risks

- **RLS recursion / lockout** — mitigated by SECURITY DEFINER helpers and
  default-open semantics; stage on a test org first.
- **Enum expansion is one-way** in Postgres (`ADD VALUE` can't be removed) — get
  the role set right before running it.
- **Migration ordering** — as we just learned, columns/policies must land on
  prod (manual SQL) before the code that uses them deploys. Same discipline.
- **Report/PDF leakage** — restricted users exporting scopes they can't see;
  covered in §6 but easy to miss.

## 9. Effort

- Phase 1 (sites): ~1 session. Phases 2–4: ~1 session each, less if events reuse
  the site pattern. Full feature ~3–4 sessions.

## 10. Decisions needed from Sarah
- §3.1 what an "event" is (reuse sites vs new `events` table)
- §3.2 expand the role enum? §3.3 same role everywhere vs full role matrix?
- §3.4 confirm owners/admins always bypass scoping
- Phasing order OK (sites first)?
