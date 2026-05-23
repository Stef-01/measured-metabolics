-- Measured Metabolics — Stage 5a Row-Level Security
-- PRD §16.3, §22.2 — patient sees own; dietitian sees assigned;
-- GP sees referred; admin gated by clinical_access claim.
--
-- Convention: every table is (a) ENABLE RLS, (b) a deny-by-default state,
-- and (c) one or more policies that grant explicit access.

-- =========================================================
-- Helper functions
-- =========================================================
create or replace function auth_role() returns role_enum
language sql stable security definer as $$
  select role from memberships
  where user_id = auth.uid() and active
  order by case role
    when 'admin' then 0
    when 'gp' then 1
    when 'dietitian' then 2
    when 'patient' then 3
  end
  limit 1
$$;

create or replace function auth_is_admin() returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from memberships
    where user_id = auth.uid() and active and role = 'admin'
  )
$$;

create or replace function auth_has_clinical_access() returns boolean
language sql stable security definer as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'clinical_access')::boolean, false)
$$;

-- patient.id of the signed-in patient (null otherwise)
create or replace function auth_patient_id() returns uuid
language sql stable security definer as $$
  select id from patients where user_id = auth.uid()
$$;

-- can the current dietitian see this patient?
create or replace function auth_can_see_patient(p uuid) returns boolean
language sql stable security definer as $$
  select case
    when auth_is_admin() and auth_has_clinical_access() then true
    when exists (
      select 1 from patients
      where id = p and user_id = auth.uid()
    ) then true
    when exists (
      select 1 from patients pa
      where pa.id = p
        and (pa.primary_dietitian_id = auth.uid()
             or pa.primary_gp_id = auth.uid())
    ) then true
    when exists (
      select 1 from referrals r
      where r.patient_id = p
        and (r.from_user_id = auth.uid() or r.to_user_id = auth.uid())
        and r.status in ('accepted', 'in_progress', 'completed')
    ) then true
    else false
  end
$$;

-- =========================================================
-- Enable RLS on every table
-- =========================================================
do $$
declare t text;
begin
  for t in
    select table_name from information_schema.tables
    where table_schema = 'public' and table_type = 'BASE TABLE'
  loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end$$;

-- =========================================================
-- Identity tables
-- =========================================================
create policy "users self read" on users
  for select using (id = auth.uid() or auth_is_admin());
create policy "users self update" on users
  for update using (id = auth.uid()) with check (id = auth.uid());
create policy "users admin all" on users
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "memberships self read" on memberships
  for select using (user_id = auth.uid() or auth_is_admin());
create policy "memberships admin write" on memberships
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "organizations member read" on organizations
  for select using (
    exists (
      select 1 from memberships m
      where m.organization_id = id and m.user_id = auth.uid() and m.active
    ) or auth_is_admin()
  );
create policy "organizations admin write" on organizations
  for all using (auth_is_admin()) with check (auth_is_admin());

-- =========================================================
-- Patient core
-- =========================================================
create policy "patients self read" on patients
  for select using (
    user_id = auth.uid()
    or auth_can_see_patient(id)
  );
create policy "patients self update" on patients
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "patients admin write" on patients
  for all using (auth_is_admin() and auth_has_clinical_access())
  with check (auth_is_admin() and auth_has_clinical_access());

create policy "clinician_profiles self" on clinician_profiles
  for all using (user_id = auth.uid() or auth_is_admin())
  with check (user_id = auth.uid() or auth_is_admin());

create policy "dietitian_profiles self" on dietitian_profiles
  for all using (user_id = auth.uid() or auth_is_admin())
  with check (user_id = auth.uid() or auth_is_admin());

-- =========================================================
-- Clinical
-- =========================================================
create policy "patient_conditions read" on patient_conditions
  for select using (auth_can_see_patient(patient_id));
create policy "patient_conditions write" on patient_conditions
  for all using (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'dietitian', 'admin')
  ) with check (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'dietitian', 'admin')
  );

create policy "medications read" on medications
  for select using (auth_can_see_patient(patient_id));
create policy "medications write" on medications
  for all using (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'admin')
  ) with check (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'admin')
  );

create policy "observations read" on observations
  for select using (auth_can_see_patient(patient_id));
create policy "observations write" on observations
  for insert with check (auth_can_see_patient(patient_id));

create policy "labs read" on labs
  for select using (auth_can_see_patient(patient_id));
create policy "labs write" on labs
  for all using (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'admin')
  ) with check (
    auth_can_see_patient(patient_id)
    and auth_role() in ('gp', 'admin')
  );

create policy "conditions read all" on conditions for select using (true);

-- =========================================================
-- CGM, meals, symptoms (patient-owned)
-- =========================================================
create policy "cgm_readings read" on cgm_readings
  for select using (auth_can_see_patient(patient_id));
create policy "cgm_readings insert" on cgm_readings
  for insert with check (
    patient_id = auth_patient_id()
    or auth_role() in ('dietitian', 'gp', 'admin')
  );

create policy "meal_logs read" on meal_logs
  for select using (auth_can_see_patient(patient_id));
create policy "meal_logs patient insert" on meal_logs
  for insert with check (patient_id = auth_patient_id());
create policy "meal_logs patient update" on meal_logs
  for update using (patient_id = auth_patient_id())
  with check (patient_id = auth_patient_id());

create policy "meal_analysis read" on meal_analysis
  for select using (
    exists (
      select 1 from meal_logs ml
      where ml.id = meal_analysis.meal_log_id
        and auth_can_see_patient(ml.patient_id)
    )
  );
create policy "meal_analysis dietitian write" on meal_analysis
  for all using (auth_role() in ('dietitian', 'admin'))
  with check (auth_role() in ('dietitian', 'admin'));

create policy "symptom_logs read" on symptom_logs
  for select using (auth_can_see_patient(patient_id));
create policy "symptom_logs patient insert" on symptom_logs
  for insert with check (patient_id = auth_patient_id());

-- =========================================================
-- Care coordination
-- =========================================================
create policy "referrals read" on referrals
  for select using (
    from_user_id = auth.uid()
    or to_user_id = auth.uid()
    or patient_id = auth_patient_id()
    or auth_is_admin()
  );
create policy "referrals gp insert" on referrals
  for insert with check (
    from_user_id = auth.uid() and auth_role() in ('gp', 'admin')
  );
create policy "referrals dietitian update" on referrals
  for update using (to_user_id = auth.uid() or auth_is_admin())
  with check (to_user_id = auth.uid() or auth_is_admin());

create policy "message_threads read" on message_threads
  for select using (
    auth_can_see_patient(patient_id)
    or dietitian_id = auth.uid()
  );
create policy "message_threads write" on message_threads
  for all using (
    auth_can_see_patient(patient_id)
    or dietitian_id = auth.uid()
  ) with check (
    auth_can_see_patient(patient_id)
    or dietitian_id = auth.uid()
  );

create policy "messages read" on messages
  for select using (
    exists (
      select 1 from message_threads t
      where t.id = thread_id
        and (auth_can_see_patient(t.patient_id) or t.dietitian_id = auth.uid())
    )
  );
create policy "messages insert" on messages
  for insert with check (
    from_user_id = auth.uid()
    and exists (
      select 1 from message_threads t
      where t.id = thread_id
        and (auth_can_see_patient(t.patient_id) or t.dietitian_id = auth.uid())
    )
  );

create policy "meal_plans read" on meal_plans
  for select using (auth_can_see_patient(patient_id));
create policy "meal_plans dietitian write" on meal_plans
  for all using (auth_role() in ('dietitian', 'admin'))
  with check (auth_role() in ('dietitian', 'admin'));

create policy "meal_plan_items read" on meal_plan_items
  for select using (
    exists (
      select 1 from meal_plans p
      where p.id = meal_plan_id and auth_can_see_patient(p.patient_id)
    )
  );
create policy "meal_plan_items dietitian write" on meal_plan_items
  for all using (auth_role() in ('dietitian', 'admin'))
  with check (auth_role() in ('dietitian', 'admin'));

create policy "recipes read all" on recipes for select using (true);
create policy "recipes admin write" on recipes
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "care_plans read" on care_plans
  for select using (auth_can_see_patient(patient_id));
create policy "care_plans gp write" on care_plans
  for all using (auth_role() in ('gp', 'admin'))
  with check (auth_role() in ('gp', 'admin'));

create policy "dietitian_reports read" on dietitian_reports
  for select using (
    auth_can_see_patient(patient_id)
    and auth_role() in ('dietitian', 'gp', 'admin')
  );
create policy "dietitian_reports dietitian write" on dietitian_reports
  for all using (auth_role() in ('dietitian', 'admin'))
  with check (auth_role() in ('dietitian', 'admin'));

-- =========================================================
-- Billing (GP-only)
-- =========================================================
create policy "mbs_rules read all" on mbs_rules for select using (true);
create policy "mbs_rules admin write" on mbs_rules
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "billing_suggestions gp" on billing_suggestions
  for all using (
    gp_user_id = auth.uid()
    or auth_is_admin()
  ) with check (
    gp_user_id = auth.uid()
    or auth_is_admin()
  );

-- =========================================================
-- Tasks
-- =========================================================
create policy "tasks read" on tasks
  for select using (
    assigned_to = auth.uid()
    or (patient_id is not null and auth_can_see_patient(patient_id))
  );
create policy "tasks write" on tasks
  for all using (
    assigned_to = auth.uid() or auth_is_admin()
  ) with check (
    assigned_to = auth.uid() or auth_is_admin()
  );

-- =========================================================
-- Consent / documents / audit
-- =========================================================
create policy "consent_records patient read" on consent_records
  for select using (
    patient_id = auth_patient_id()
    or auth_can_see_patient(patient_id)
  );
create policy "consent_records patient write" on consent_records
  for insert with check (patient_id = auth_patient_id() or auth_is_admin());
create policy "consent_records patient update" on consent_records
  for update using (patient_id = auth_patient_id() or auth_is_admin())
  with check (patient_id = auth_patient_id() or auth_is_admin());

create policy "documents read" on documents
  for select using (
    patient_id is null and created_by = auth.uid()
    or (patient_id is not null and auth_can_see_patient(patient_id))
  );
create policy "documents write" on documents
  for all using (
    created_by = auth.uid() or auth_is_admin()
  ) with check (
    created_by = auth.uid() or auth_is_admin()
  );

-- audit_events: append-only; read for admin + actor + patient
create policy "audit_events actor read" on audit_events
  for select using (
    actor_user_id = auth.uid()
    or (patient_id is not null and patient_id = auth_patient_id())
    or (auth_is_admin() and auth_has_clinical_access())
  );
create policy "audit_events insert" on audit_events
  for insert with check (
    actor_user_id = auth.uid() or auth_is_admin()
  );

-- =========================================================
-- AI subsystem (admin + dietitian read; admin + service write)
-- =========================================================
create policy "prompt_versions read" on prompt_versions
  for select using (
    auth_role() in ('admin', 'dietitian', 'gp')
  );
create policy "prompt_versions admin write" on prompt_versions
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "ai_jobs read" on ai_jobs
  for select using (
    triggered_by = auth.uid()
    or (patient_id is not null and auth_can_see_patient(patient_id))
    or auth_is_admin()
  );
create policy "ai_jobs admin write" on ai_jobs
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "ai_outputs read" on ai_outputs
  for select using (auth_role() in ('dietitian', 'gp', 'admin'));
create policy "ai_outputs admin write" on ai_outputs
  for all using (auth_is_admin()) with check (auth_is_admin());

create policy "integration_connections admin" on integration_connections
  for all using (auth_is_admin()) with check (auth_is_admin());
