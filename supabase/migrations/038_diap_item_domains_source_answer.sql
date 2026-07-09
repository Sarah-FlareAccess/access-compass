-- Sync two more DIAP item fields across devices.
--
-- framework_domains: the current multi-pillar statutory tagging for an action.
--   An action can be pinned to several outcome domains at once (e.g.
--   ARRAY['VIC-B','VIC-C']). Supersedes the legacy single framework_domain
--   column (035) but both are kept: framework_domains wins when non-empty,
--   otherwise we fall back to framework_domain, then the derived module mapping.
--   Without this column, dragging a card onto a domain column or tagging domains
--   in the edit modal never reached other devices.
--
-- source_answer: the original discovery answer (no / partially / not-sure) the
--   action was generated from. Drives the "source response changed" alert. When
--   it was missing on a second device the change-detection could not fire.

ALTER TABLE public.diap_items
  ADD COLUMN IF NOT EXISTS framework_domains TEXT[],
  ADD COLUMN IF NOT EXISTS source_answer TEXT;

COMMENT ON COLUMN public.diap_items.framework_domains IS
  'Per-item multi-pillar statutory outcome-domain tags (e.g. VIC-B, VIC-C). Non-empty overrides the legacy framework_domain and the derived module mapping.';

COMMENT ON COLUMN public.diap_items.source_answer IS
  'Original discovery answer (no/partially/not-sure) the action was generated from. Drives the source-response-changed alert.';
