-- Per-item statutory-framework domain override for DIAP action items.
--
-- The DAP outcomes board groups actions by the org jurisdiction's framework
-- outcome domains (e.g. VIC Disability Act s38 objectives). By default an
-- action's domain is derived from its module->domain mapping. This column lets
-- a council pin an individual action to a chosen outcome domain by dragging it
-- to a different column, overriding the derived mapping for both the board and
-- the statutory framework report.
--
-- NULL = no override (use the derived module mapping). Value is a framework
-- domain id such as 'VIC-D', 'NSW-1', 'WA-7', validated client-side against the
-- org's jurisdiction framework.

ALTER TABLE public.diap_items
  ADD COLUMN IF NOT EXISTS framework_domain TEXT;

COMMENT ON COLUMN public.diap_items.framework_domain IS
  'Per-item override pinning this action to a statutory framework outcome domain (e.g. VIC-D). NULL = derived from the module mapping.';
