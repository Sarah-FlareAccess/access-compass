-- Scoped member access, phase 1a: data model + admin RPC (additive only).
--
-- Lets an org admin restrict a member to specific sites (and later events /
-- programs). DEFAULT OPEN: a member with NO grant rows for a scope_type keeps
-- full org access. Grant rows narrow them to exactly those scope_ids.
--
-- This migration does NOT change any existing table's RLS policies, so current
-- data access is untouched. Enforcement in the data-table policies is phase 1b
-- (staged and tested separately). For now the app filters what a restricted
-- member sees; user_can_access_scope() is defined here ready for 1b.

CREATE TABLE IF NOT EXISTS membership_scope_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  membership_id UUID NOT NULL REFERENCES organisation_memberships(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,            -- denormalised for fast per-user RLS checks
  scope_type TEXT NOT NULL CHECK (scope_type IN ('site','event','program')),
  scope_id UUID NOT NULL,           -- sites.id | events.id | authority_programs.id
  scope_role org_role,              -- NULL = inherit org membership role (phase 2)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (membership_id, scope_type, scope_id)
);

CREATE INDEX IF NOT EXISTS idx_msa_user_org
  ON membership_scope_access(user_id, organisation_id, scope_type);
CREATE INDEX IF NOT EXISTS idx_msa_membership
  ON membership_scope_access(membership_id);

ALTER TABLE membership_scope_access ENABLE ROW LEVEL SECURITY;

-- A user can read their own grants; admins can read grants across their org.
-- All writes go through set_member_scope_access() (SECURITY DEFINER), so no
-- direct insert/update/delete policy is granted.
DROP POLICY IF EXISTS msa_select ON membership_scope_access;
CREATE POLICY msa_select ON membership_scope_access
  FOR SELECT USING (
    user_id = auth.uid()
    OR is_org_admin_or_owner(auth.uid(), organisation_id)
  );

-- TRUE if the user may access this scope. Ready for phase 1b data-table policies.
-- Order matters: org-wide (NULL scope) and admins always pass; a member with no
-- grants of this type passes (default open); otherwise they must hold the grant.
CREATE OR REPLACE FUNCTION user_can_access_scope(
  p_user UUID,
  p_org UUID,
  p_scope_type TEXT,
  p_scope_id UUID
) RETURNS BOOLEAN AS $$
  SELECT
    p_scope_id IS NULL
    OR is_org_admin_or_owner(p_user, p_org)
    OR NOT EXISTS (
      SELECT 1 FROM membership_scope_access
      WHERE user_id = p_user
        AND organisation_id = p_org
        AND scope_type = p_scope_type
    )
    OR EXISTS (
      SELECT 1 FROM membership_scope_access
      WHERE user_id = p_user
        AND organisation_id = p_org
        AND scope_type = p_scope_type
        AND scope_id = p_scope_id
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin-only: replace a member's grants for one scope_type with the given ids.
-- An empty array clears the member's grants for that type = full access again.
CREATE OR REPLACE FUNCTION set_member_scope_access(
  p_membership_id UUID,
  p_scope_type TEXT,
  p_scope_ids UUID[]
) RETURNS VOID AS $$
DECLARE
  v_org UUID;
  v_user UUID;
BEGIN
  SELECT organisation_id, user_id INTO v_org, v_user
  FROM organisation_memberships WHERE id = p_membership_id;

  IF v_org IS NULL THEN
    RAISE EXCEPTION 'membership % not found', p_membership_id;
  END IF;
  IF NOT is_org_admin_or_owner(auth.uid(), v_org) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;
  IF p_scope_type NOT IN ('site','event','program') THEN
    RAISE EXCEPTION 'invalid scope_type %', p_scope_type;
  END IF;

  DELETE FROM membership_scope_access
    WHERE membership_id = p_membership_id AND scope_type = p_scope_type;

  IF array_length(p_scope_ids, 1) IS NOT NULL THEN
    INSERT INTO membership_scope_access
      (organisation_id, membership_id, user_id, scope_type, scope_id)
    SELECT v_org, p_membership_id, v_user, p_scope_type, unnest(p_scope_ids)
    ON CONFLICT (membership_id, scope_type, scope_id) DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

NOTIFY pgrst, 'reload schema';
