-- =====================================================
-- 022. ADD pricing_tier COLUMN TO organisations
-- =====================================================
-- The org row stores `size` (small/medium/large/enterprise) which maps to a
-- member seat cap, but it does not preserve the original pricing tier name
-- ("Committed", "Major Venue", "Authority Enterprise", etc.) that the user
-- selected during signup. Without that, the Organisation Settings panel has
-- no way to show "you are on the Major Venue plan" — only the underlying
-- size category, which is an implementation detail.
--
-- Add a nullable text column that the signup flow can populate. Existing rows
-- stay NULL; the UI shows "Not set" for those until they upgrade.
-- =====================================================

ALTER TABLE organisations
  ADD COLUMN IF NOT EXISTS pricing_tier TEXT;

COMMENT ON COLUMN organisations.pricing_tier IS
  'Original pricing-tier name selected at signup (e.g. "Committed", "Major Venue", "Authority Enterprise"). Surfaced in the Organisation Settings overview. Null for orgs created before this column existed.';
