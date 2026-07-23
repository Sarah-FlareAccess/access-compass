-- Riverside Theatre top-up for the Convention Centre org (generated).
-- Adds the later modules to the EXISTING Riverside; safe to run once.
do $$
declare v_org uuid; v_user uuid; v_site uuid;
begin
  select id into v_org from organisations where name = 'Redgum Convention & Exhibition Centre' order by created_at limit 1;
  if v_org is null then raise exception 'Convention Centre org not found'; end if;
  select user_id into v_user from organisation_memberships where organisation_id = v_org and status = 'active' order by created_at limit 1;
  select id into v_site from sites where organisation_id = v_org and name = 'Riverside Theatre';
  if v_site is null then raise exception 'Riverside Theatre not found in the Convention Centre org'; end if;

  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
  values ('seed-redgum-riverside-theatre','1.2','1.2','completed','strong','{"doingWell":["Can all website content be accessed using only a keyboard (no mouse required)?","Where does keyboard access break down?","When using the keyboard, can you always see which element is currently focused?"],"priorityActions":[],"areasToExplore":[],"professionalReview":[]}'::jsonb,now() - interval '6 days',now() - interval '4 days',v_org,v_site,v_user,v_user)
  on conflict (organisation_id, site_id, module_id) do nothing;
  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values
    ('seed-redgum-riverside-theatre','1.2','1.2-1-1','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-1a',null,null,null,'["focus-invisible","main-nav","dropdowns","forms","booking","embedded","modals"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-1b','yes','Verified with the venue coordinator.',null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-2','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-2a',null,null,null,'["always"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-3','yes','Confirmed on site during the March access walk-through.',null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-3a',null,null,null,'["yes-recent"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-3b',null,null,null,'["yes-throughout"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-4','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-5','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-5c','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-6',null,null,null,'["yes"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-6a',null,null,null,'["yes-accurate"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-6b','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-7','yes','Confirmed on site during the March access walk-through.',null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-8',null,null,null,'["yes-regular"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-8b',null,null,null,'["yes-interested"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-1-9','yes','Confirmed on site during the March access walk-through.',null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-F-10',null,null,null,'["yes"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-D-10',null,null,null,'["yes-extended"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','1.2','1.2-MA-1',null,null,null,'["both"]',v_org,v_site,v_user)
  on conflict (organisation_id, site_id, module_id, question_id) do nothing;
  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
  values ('seed-redgum-riverside-theatre','3.4','3.4','completed','strong','{"doingWell":["Do you offer equipment or resources that customers can use during their visit?","Do customers know what equipment is available before they visit?","Is it easy for customers to access or request equipment when they arrive?"],"priorityActions":[],"areasToExplore":[],"professionalReview":[]}'::jsonb,now() - interval '6 days',now() - interval '4 days',v_org,v_site,v_user,v_user)
  on conflict (organisation_id, site_id, module_id) do nothing;
  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values
    ('seed-redgum-riverside-theatre','3.4','3.4-F-1',null,null,null,'["yes-multiple"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-F-2',null,null,null,'["clearly-communicated"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-F-3',null,null,null,'["easy-request"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-F-4',null,null,null,'["yes-free"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-1',null,null,null,'["wheelchairs","mobility-scooters","walking-aids","sensory-kits","sensory-maps","communication-cards","magnifiers","portable-seating","hearing-loops","assistive-listening","quiet-space","weighted-items"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-2',null,null,null,'["yes-dedicated"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-3',null,null,null,'["yes-available"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-4',null,null,null,'["yes-individual"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-5',null,null,null,'["yes-multiple"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-6',null,null,null,'["yes-regular"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-7',null,null,null,'["yes-range"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-8',null,null,null,'["yes-all"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-9',null,null,null,'["budget","knowledge","storage","maintenance","staff-training","demand"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-10',null,null,null,'["beach-entry","pool-hoist","platform-lift","ramp","steps-rails","transfer-wall"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-11',null,null,null,'["yes-multiple"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-12',null,null,null,'["yes-full"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-13',null,null,null,'["yes-both"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-14',null,null,null,'["yes"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.4','3.4-D-15',null,null,null,'["yes"]',v_org,v_site,v_user)
  on conflict (organisation_id, site_id, module_id, question_id) do nothing;
  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
  values ('seed-redgum-riverside-theatre','3.6','3.6','completed','strong','{"doingWell":["Are large print versions of key materials available?","Can staff read menus or materials aloud for customers who need it?","Are digital alternatives available (QR codes, online menus)?"],"priorityActions":[],"areasToExplore":[],"professionalReview":[]}'::jsonb,now() - interval '6 days',now() - interval '4 days',v_org,v_site,v_user,v_user)
  on conflict (organisation_id, site_id, module_id) do nothing;
  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values
    ('seed-redgum-riverside-theatre','3.6','3.6-1-1','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-1-2','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-1-3','yes','Confirmed on site during the March access walk-through.',null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-1-4',null,null,null,'["easy-read"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-1-5',null,null,null,'["yes-allergens"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-1',null,null,null,'["yes-accessible"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-2','yes',null,null,null,v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-3',null,null,null,'["yes-available"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-4',null,null,null,'["yes-audio-guide"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-5',null,null,null,'["yes-multiple"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-6',null,null,null,'["yes-3d-model"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-7',null,null,null,'["yes-all"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-8',null,null,null,'["yes-all"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-9',null,null,null,'["yes"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-10',null,null,null,'["yes-process"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','3.6','3.6-D-11','yes','Confirmed on site during the March access walk-through.',null,null,v_org,v_site,v_user)
  on conflict (organisation_id, site_id, module_id, question_id) do nothing;
  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
  values ('seed-redgum-riverside-theatre','6.4','6.4','completed','strong','{"doingWell":["What hearing access services will be available at the event?","What vision access services will be available?","Are there sensory considerations for neurodivergent attendees?"],"priorityActions":[],"areasToExplore":[],"professionalReview":[]}'::jsonb,now() - interval '6 days',now() - interval '4 days',v_org,v_site,v_user,v_user)
  on conflict (organisation_id, site_id, module_id) do nothing;
  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values
    ('seed-redgum-riverside-theatre','6.4','6.4-PC-1',null,null,null,'["auslan","live-captioning","hearing-loop","assistive-listening","captioned-videos","on-request","none-planned"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-PC-2',null,null,null,'["audio-description","large-print","braille","tactile-elements","verbal-description","guide-dog","sighted-guide","on-request","none-planned"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-PC-3',null,null,null,'["quiet-space","sensory-kits","low-sensory-session","warning-effects","dim-areas","sensory-map","none-planned"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-1',null,null,null,'["spot-lighting"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-2',null,null,null,'["both"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-3',null,null,null,'["portable"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-4',null,null,null,'["live-ad"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-5',null,null,null,'["yes-provided"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-6',null,null,null,'["yes-wearables"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-7',null,null,null,'["yes-advance-and-immediate"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-8',null,null,null,'["yes-dedicated"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-9',null,null,null,'["sensory-vests","vibrating-wristbands","subpac","vibrating-floor","visual-music","led-wristbands","considering","no"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-10',null,null,null,'["policy-enforced"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-11',null,null,null,'["no"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','6.4','6.4-D-12',null,null,null,'["both"]',v_org,v_site,v_user)
  on conflict (organisation_id, site_id, module_id, question_id) do nothing;
  insert into module_progress (session_id, module_id, module_code, status, confidence_snapshot, summary, started_at, completed_at, organisation_id, site_id, user_id, last_modified_by_user_id)
  values ('seed-redgum-riverside-theatre','7.2','7.2','completed','strong','{"doingWell":["Do you formally curate an accessibility-focused programming track (relaxed, audio-described, captioned, sensory-friendly)?","Do you brief artists and performers on accessibility expectations before they program?","Are accessibility-programmed events marketed with the same prominence as the main program?"],"priorityActions":[],"areasToExplore":[],"professionalReview":[]}'::jsonb,now() - interval '6 days',now() - interval '4 days',v_org,v_site,v_user,v_user)
  on conflict (organisation_id, site_id, module_id) do nothing;
  insert into module_responses (session_id, module_id, question_id, answer, notes, partial_description, multi_select_values, organisation_id, site_id, user_id) values
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-1',null,null,null,'["yes-curated"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-2',null,null,null,'["yes-formal"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-3',null,null,null,'["yes-equal"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-4',null,null,null,'["yes-named"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-5',null,null,null,'["yes-multiple"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-PC-6',null,null,null,'["yes-detailed"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-1',null,null,null,'["yes-basic"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-2',null,null,null,'["yes-all"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-3',null,null,null,'["yes-paid"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-4',null,null,null,'["yes-certified"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-5',null,null,null,'["yes-contract"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-6',null,null,null,'["yes-program"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-7',null,null,null,'["yes-detailed"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-8',null,null,null,'["yes-always"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-9',null,null,null,'["yes-detailed"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-10',null,null,null,'["yes-equal"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-11',null,null,null,'["yes-formal"]',v_org,v_site,v_user),
    ('seed-redgum-riverside-theatre','7.2','7.2-DD-12',null,null,null,'["yes-detailed"]',v_org,v_site,v_user)
  on conflict (organisation_id, site_id, module_id, question_id) do nothing;

  raise notice 'Riverside top-up complete for Convention Centre org %', v_org;
end $$;
