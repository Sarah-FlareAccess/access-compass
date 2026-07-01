-- 030_organisation_jurisdiction.sql
-- Statutory Plan Alignment: record which disability-inclusion framework an
-- authority reports against, so Access Compass can output its findings
-- categorised by that framework's domains (SA SDIP, ADS, etc.).

alter table public.organisations
  add column if not exists jurisdiction text not null default 'AU';

comment on column public.organisations.jurisdiction is
  'Statutory framework key driving the Outcomes view (e.g. ''AU'', ''AU-SA''). Validated client-side against FRAMEWORKS in src/data/frameworks.ts.';

-- Per-org overrides to the auto module->domain mapping (Layer 3). Councils can
-- move modules/actions between framework domains to match their own DAIP.
-- Shape: { "module": { "<moduleId>": ["<domainId>", ...] } , "action": { ... } }
-- Empty object = use the built-in two-layer defaults.
alter table public.organisations
  add column if not exists domain_overrides jsonb not null default '{}'::jsonb;

comment on column public.organisations.domain_overrides is
  'Per-org overrides of module/action to framework-domain mappings for the Outcomes view. Empty {} = use defaults from frameworkMappings.ts.';
