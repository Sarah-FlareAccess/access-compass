-- =====================================================
-- Backfill confidence_snapshot using the corrected banding
-- =====================================================
-- confidence_snapshot is written once, when a module is completed, so fixing
-- calculateConfidenceSnapshot in the app only affects modules completed from
-- that point on. Everything already stored keeps its old, wrong value.
--
-- The two corrections this applies, matching src/hooks/useModuleProgress.ts:
--   1. 'not-applicable' (and its legacy alias 'na') and unanswered questions
--      leave the denominator. A question that does not apply to your site must
--      not make 'strong' harder to reach.
--   2. 'partially' counts as half a positive instead of only inflating the
--      denominator, which previously pushed almost every module into 'mixed'.
--
-- SCOPE, read this before running:
--   Only rows that actually HAVE responses in module_responses are touched.
--   The Authority-Portal demo cohorts (venue_demo_programs.sql and friends)
--   write confidence_snapshot directly and store no responses, so they are
--   deliberately left alone here. Reseed those instead.
--
-- Direction of travel is UP: expect fewer 'mixed', more 'strong'.
-- Idempotent. Safe to run twice.
--
-- DRY RUN FIRST: run the SELECT at the bottom on its own to see what would
-- change, before running the DO block.
-- =====================================================

do $$
declare
  v_eligible int;
  v_changed  int;
  v_from     text;
  v_to       text;
  v_rec      record;
begin
  -- Pair each completed module with its responses.
  --
  -- The canonical key on both tables is (organisation_id, site_id, module_id),
  -- NULLS NOT DISTINCT, since migration 032. An earlier version of this script
  -- joined on session_id and matched only 229 of the 446 rows that actually
  -- have responses, because session ids diverged between the two tables.
  --
  -- Org-scoped rows join on the canonical key. Legacy rows with no
  -- organisation_id fall back to session_id: matching those on a NULL org
  -- would pair every orphan response with every orphan progress row for that
  -- module.
  create temp table _cs_src on commit drop as
    select mp.id, mp.confidence_snapshot as old_band, mr.answer
      from module_progress mp
      join module_responses mr
        on mp.organisation_id is not null
       and mr.organisation_id = mp.organisation_id
       and mr.site_id is not distinct from mp.site_id
       and mr.module_id = mp.module_id
     where mp.status = 'completed'
    union all
    select mp.id, mp.confidence_snapshot, mr.answer
      from module_progress mp
      join module_responses mr
        on mp.organisation_id is null
       and mr.session_id = mp.session_id
       and mr.module_id = mp.module_id
     where mp.status = 'completed';

  -- Count only answered, applicable responses. Legacy aliases folded in:
  -- 'na' predates 'not-applicable', 'not-sure' predates 'unable-to-check'.
  create temp table _cs_calc on commit drop as
  select
    id,
    old_band,
    count(*) filter (where answer is not null and answer not in ('not-applicable', 'na')) as total,
    count(*) filter (where answer = 'yes') as n_yes,
    count(*) filter (where answer = 'partially') as n_partial,
    count(*) filter (where answer = 'no') as n_no,
    count(*) filter (where answer in ('unable-to-check', 'not-sure')) as n_unsure
  from _cs_src
  group by id, old_band;

  alter table _cs_calc add column new_band text;

  update _cs_calc set new_band =
    case
      when total = 0 then 'needs-work'
      when ((n_yes + n_partial * 0.5) / total::numeric) * 100 >= 70 then 'strong'
      when ((n_no + n_unsure) / total::numeric) * 100 >= 50 then 'needs-work'
      else 'mixed'
    end;

  select count(*) into v_eligible from _cs_calc;
  select count(*) into v_changed  from _cs_calc where new_band is distinct from old_band;

  raise notice 'Completed modules with responses: %', v_eligible;
  raise notice 'Rows whose band changes: %', v_changed;

  for v_rec in
    select coalesce(old_band, '(none)') as f, new_band as t, count(*) as n
      from _cs_calc
     where new_band is distinct from old_band
     group by 1, 2 order by 3 desc
  loop
    raise notice '  % -> % : % rows', v_rec.f, v_rec.t, v_rec.n;
  end loop;

  update module_progress mp
     set confidence_snapshot = c.new_band,
         updated_at = now()
    from _cs_calc c
   where c.id = mp.id
     and c.new_band is distinct from mp.confidence_snapshot;

  raise notice 'Backfill complete.';
end $$;

-- =====================================================
-- DRY RUN. Run this on its own first to preview the change.
-- =====================================================
-- select
--   coalesce(mp.confidence_snapshot, '(none)') as current_band,
--   case
--     when count(*) filter (where mr.answer is not null and mr.answer not in ('not-applicable','na')) = 0
--       then 'needs-work'
--     when ((count(*) filter (where mr.answer = 'yes')
--          + count(*) filter (where mr.answer = 'partially') * 0.5)
--          / nullif(count(*) filter (where mr.answer is not null and mr.answer not in ('not-applicable','na')),0)::numeric) * 100 >= 70
--       then 'strong'
--     when ((count(*) filter (where mr.answer = 'no')
--          + count(*) filter (where mr.answer in ('unable-to-check','not-sure')))
--          / nullif(count(*) filter (where mr.answer is not null and mr.answer not in ('not-applicable','na')),0)::numeric) * 100 >= 50
--       then 'needs-work'
--     else 'mixed'
--   end as new_band,
--   count(distinct mp.id) as rows
-- from module_progress mp
-- join module_responses mr on mr.session_id = mp.session_id and mr.module_id = mp.module_id
-- where mp.status = 'completed'
-- group by mp.id, mp.confidence_snapshot;
