-- Stage 8 — Demo seed (PRD §23 launch-checklist requirement).
-- 3 GPs, 2 dietitians, 30 patients, 6-week meal/CGM history.
-- Idempotent: rerunning is safe (ON CONFLICT DO NOTHING throughout).

-- The seed assumes the auth.users rows already exist (Supabase Auth creates
-- them on first sign-in). For local dev we INSERT into public.users with
-- generated UUIDs and skip the auth.users link until invitations go out.

insert into organizations (id, name, slug, type)
values
  ('11111111-1111-1111-1111-111111111111', 'Riverbend Clinic', 'riverbend', 'gp_practice'),
  ('22222222-2222-2222-2222-222222222222', 'Westside Dietetics', 'westside', 'dietetics'),
  ('33333333-3333-3333-3333-333333333333', 'Measured Demo Co', 'measured-demo', 'platform')
on conflict (slug) do nothing;

-- mbs_rules — common items the GP card surfaces
insert into mbs_rules (item_number, display, rationale, requirements)
values
  ('721', 'GP Management Plan (GPMP)', 'Patient with chronic disease requiring ongoing management.', array['Chronic condition documented', 'Patient consent recorded']),
  ('723', 'Team Care Arrangement', 'Multi-disciplinary care plan involving 2+ providers.', array['GPMP in place', 'Two providers identified']),
  ('732', 'GPMP / TCA review', 'Review the documented plan.', array['Existing 721 / 723 in last 12 months']),
  ('699', 'Heart Health Check', 'Cardiovascular risk assessment.', array['Age 45–79 (35–79 if Indigenous)']),
  ('900', 'Type 2 Diabetes Risk Evaluation', 'Diabetes risk assessment.', array['Patient age and BMI documented'])
on conflict (item_number) do nothing;

-- conditions
insert into conditions (id, code, display, system)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'PRE_DIABETES', 'Pre-diabetes', 'snomed-ct'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'T2D', 'Type 2 diabetes', 'snomed-ct'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'NAFLD', 'Non-alcoholic fatty liver disease', 'snomed-ct'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'PCOS', 'Polycystic ovary syndrome', 'snomed-ct'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'OBESITY', 'Obesity', 'snomed-ct')
on conflict (code) do nothing;

-- recipes (mirror of src/lib/mock/plans.ts)
insert into recipes (slug, title, cuisine, why, ingredients, steps)
values
  ('veg-poha', 'Vegetable poha with peanuts', 'south_asian',
   'Steady morning glucose. Protein + fibre.',
   array['1 cup poha', '1 onion', '2 tbsp peanuts', '1 tsp mustard seeds', '1 green chilli', 'lemon', 'coriander'],
   array['Soak poha 2 min', 'Temper mustard + chilli', 'Toss in peanuts + onion', 'Fold in poha + lemon']),
  ('tandoori-fish', 'Tandoori fish with sautéed greens', 'south_asian',
   'Low-GI swap rice for greens.',
   array['1 fish fillet', '2 tbsp yoghurt', '1 tsp tandoori spice', 'mustard greens', 'garlic', 'ginger'],
   array['Marinate fish 15 min', 'Pan-sear 4 min/side', 'Wilt greens in same pan'])
on conflict (slug) do nothing;

-- NOTE: the patient/user/membership/meals/cgm/symptoms seed is left to a
-- TypeScript script at scripts/seed-demo.ts (Stage 8 Wed-Thu). SQL alone
-- can't easily synthesise 6 weeks of realistic data with the right
-- consistency between meal_logs ↔ meal_analysis ↔ cgm_readings. The script
-- generates UUIDs, hashes a magic-link sender, and spreads timestamps so
-- the KPI materialized view shows plausible loop completion.
