-- Measured Metabolics — Stage 5a schema (PRD §13)
-- Purpose: full relational schema for tri-persona care platform.
-- Conventions: snake_case, uuid PKs, created_at/updated_at on every row,
-- soft FKs always reference auth.users(id) for actor columns.

set check_function_bodies = off;

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =========================================================
-- Enums
-- =========================================================
create type role_enum as enum ('patient', 'dietitian', 'gp', 'admin');
create type meal_type_enum as enum ('breakfast', 'lunch', 'dinner', 'snack');
create type cuisine_enum as enum (
  'south_asian', 'east_asian', 'mediterranean', 'middle_eastern',
  'african', 'latin_american', 'european', 'oceania', 'other'
);
create type review_status_enum as enum ('pending_ai', 'pending_review', 'approved', 'rejected');
create type referral_status_enum as enum ('new', 'in_progress', 'accepted', 'completed', 'cancelled');
create type symptom_severity_enum as enum ('mild', 'moderate', 'severe');
create type ai_job_status_enum as enum ('queued', 'running', 'succeeded', 'failed');
create type consent_kind_enum as enum ('clinical_care', 'rwe', 'marketing');
create type audit_action_enum as enum (
  'record.viewed', 'record.created', 'record.updated', 'record.deleted',
  'meal.uploaded', 'meal.approved', 'meal.flagged',
  'plan.drafted', 'plan.approved', 'plan.sent',
  'report.drafted', 'report.approved', 'report.sent',
  'referral.created', 'referral.accepted',
  'consent.granted', 'consent.withdrawn',
  'auth.signed_in', 'auth.signed_out',
  'admin.exported', 'admin.impersonated'
);

-- =========================================================
-- Identity & tenancy
-- =========================================================
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  type text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  date_of_birth date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  role role_enum not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (user_id, organization_id, role)
);

-- =========================================================
-- Patient core
-- =========================================================
create table patients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid unique references users(id) on delete cascade,
  external_id text,
  organization_id uuid references organizations(id),
  cuisine_pref cuisine_enum,
  primary_dietitian_id uuid references users(id),
  primary_gp_id uuid references users(id),
  onboarded_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table clinician_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  ahpra_number text,
  organization_id uuid references organizations(id),
  specialty text,
  bio text,
  created_at timestamptz not null default now()
);

create table dietitian_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  apd_number text,
  organization_id uuid references organizations(id),
  cuisine_specialties cuisine_enum[],
  bio text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Clinical
-- =========================================================
create table conditions (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  display text not null,
  system text not null default 'snomed-ct'
);

create table patient_conditions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  condition_id uuid not null references conditions(id),
  onset date,
  recorded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table medications (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  name text not null,
  dose text,
  frequency text,
  started_on date,
  stopped_on date,
  recorded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table observations (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  kind text not null,
  value numeric,
  unit text,
  observed_at timestamptz not null default now(),
  recorded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table labs (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  test text not null,
  value numeric,
  unit text,
  reference_low numeric,
  reference_high numeric,
  taken_on date not null,
  reported_at timestamptz,
  source text,
  created_at timestamptz not null default now()
);

-- =========================================================
-- CGM, meals, symptoms
-- =========================================================
create table cgm_readings (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  reading_at timestamptz not null,
  glucose_mmol numeric not null,
  source text default 'libre',
  created_at timestamptz not null default now()
);
create index on cgm_readings (patient_id, reading_at desc);

create table meal_logs (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  meal_type meal_type_enum not null,
  logged_at timestamptz not null default now(),
  cuisine cuisine_enum,
  portion_confidence smallint,
  note text,
  photo_url text,
  storage_path text,
  source text default 'patient',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on meal_logs (patient_id, logged_at desc);

create table meal_analysis (
  id uuid primary key default uuid_generate_v4(),
  meal_log_id uuid unique not null references meal_logs(id) on delete cascade,
  ai_output_id uuid,
  detected_dishes jsonb,
  est_carbs_g numeric,
  est_protein_g numeric,
  est_fat_g numeric,
  est_fibre_g numeric,
  glycaemic_load numeric,
  cgm_pairing jsonb,
  rationale text,
  confidence_score numeric,
  requires_human_review boolean not null default true,
  dietitian_review_status review_status_enum not null default 'pending_review',
  reviewed_by uuid references users(id),
  reviewed_at timestamptz,
  safety_flags text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table symptom_logs (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  logged_at timestamptz not null default now(),
  domain text not null,
  severity symptom_severity_enum not null,
  note text,
  escalated boolean not null default false,
  escalation_audit_id uuid,
  created_at timestamptz not null default now()
);
create index on symptom_logs (patient_id, logged_at desc);

-- =========================================================
-- Care coordination
-- =========================================================
create table referrals (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  from_user_id uuid not null references users(id),
  to_user_id uuid references users(id),
  to_organization_id uuid references organizations(id),
  reason text,
  attached_documents text[] default '{}',
  cuisine_pref cuisine_enum,
  priority text default 'standard',
  status referral_status_enum not null default 'new',
  accepted_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on referrals (to_user_id, status);

create table message_threads (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  dietitian_id uuid references users(id),
  topic text,
  severe_symptom boolean not null default false,
  last_message_at timestamptz,
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  from_user_id uuid not null references users(id),
  from_role role_enum not null,
  body text not null,
  attachments jsonb default '[]',
  read_at timestamptz,
  sent_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on messages (thread_id, sent_at desc);

create table meal_plans (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  dietitian_id uuid references users(id),
  ai_output_id uuid,
  starts_on date not null,
  ends_on date not null,
  status review_status_enum not null default 'pending_review',
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table meal_plan_items (
  id uuid primary key default uuid_generate_v4(),
  meal_plan_id uuid not null references meal_plans(id) on delete cascade,
  meal_type meal_type_enum not null,
  day_index smallint not null,
  recipe_id uuid,
  custom_title text,
  notes text,
  locked boolean not null default false
);

create table recipes (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  cuisine cuisine_enum,
  why text,
  ingredients text[] default '{}',
  steps text[] default '{}',
  source_url text,
  created_at timestamptz not null default now()
);

create table care_plans (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  gp_user_id uuid references users(id),
  problems text[] default '{}',
  goals text[] default '{}',
  team text[] default '{}',
  actions jsonb default '[]',
  review_due date,
  status review_status_enum not null default 'pending_review',
  ai_output_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table dietitian_reports (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  dietitian_id uuid not null references users(id),
  gp_user_id uuid references users(id),
  period_start date not null,
  period_end date not null,
  summary text,
  recommendations jsonb default '[]',
  pdf_url text,
  status review_status_enum not null default 'pending_review',
  approved_at timestamptz,
  sent_at timestamptz,
  ai_output_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Billing
-- =========================================================
create table mbs_rules (
  id uuid primary key default uuid_generate_v4(),
  item_number text unique not null,
  display text not null,
  rationale text,
  requirements text[] default '{}',
  active boolean not null default true
);

create table billing_suggestions (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  gp_user_id uuid references users(id),
  mbs_rule_id uuid not null references mbs_rules(id),
  rationale text,
  status text default 'suggested',
  created_at timestamptz not null default now()
);

-- =========================================================
-- Tasks
-- =========================================================
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  assigned_to uuid references users(id),
  kind text not null,
  due_at timestamptz,
  completed_at timestamptz,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

-- =========================================================
-- Consent, documents, audit
-- =========================================================
create table consent_records (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid not null references patients(id) on delete cascade,
  kind consent_kind_enum not null,
  version text not null,
  granted boolean not null,
  granted_at timestamptz,
  withdrawn_at timestamptz,
  evidence_url text,
  created_at timestamptz not null default now()
);
create unique index consent_records_active_uk on consent_records (patient_id, kind, version);

create table documents (
  id uuid primary key default uuid_generate_v4(),
  patient_id uuid references patients(id) on delete cascade,
  kind text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table audit_events (
  id uuid primary key default uuid_generate_v4(),
  actor_user_id uuid references users(id),
  actor_role role_enum,
  action audit_action_enum not null,
  target_type text,
  target_id uuid,
  patient_id uuid references patients(id),
  meta jsonb default '{}',
  ip inet,
  user_agent text,
  occurred_at timestamptz not null default now()
);
create index on audit_events (patient_id, occurred_at desc);
create index on audit_events (actor_user_id, occurred_at desc);

-- audit immutability: forbid UPDATE / DELETE
create or replace function audit_events_immutable() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_events is append-only';
end;
$$;
create trigger audit_events_no_update before update on audit_events
  for each row execute function audit_events_immutable();
create trigger audit_events_no_delete before delete on audit_events
  for each row execute function audit_events_immutable();

-- =========================================================
-- AI subsystem
-- =========================================================
create table prompt_versions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  version text not null,
  system_prompt text not null,
  user_template text not null,
  output_schema jsonb not null,
  safety_rules jsonb default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (name, version)
);

create table ai_jobs (
  id uuid primary key default uuid_generate_v4(),
  kind text not null,
  status ai_job_status_enum not null default 'queued',
  patient_id uuid references patients(id) on delete cascade,
  triggered_by uuid references users(id),
  payload jsonb,
  enqueued_at timestamptz not null default now(),
  started_at timestamptz,
  finished_at timestamptz,
  error text
);

create table ai_outputs (
  id uuid primary key default uuid_generate_v4(),
  ai_job_id uuid references ai_jobs(id) on delete cascade,
  prompt_version_id uuid references prompt_versions(id),
  output jsonb not null,
  confidence_score numeric,
  requires_human_review boolean not null default true,
  safety_flags text[] default '{}',
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);

create table integration_connections (
  id uuid primary key default uuid_generate_v4(),
  organization_id uuid references organizations(id),
  kind text not null,
  config jsonb not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- =========================================================
-- Helper views (used by RLS)
-- =========================================================
create or replace view current_membership as
  select m.*, u.email
  from memberships m
  join users u on u.id = m.user_id
  where m.user_id = auth.uid() and m.active;

-- =========================================================
-- updated_at trigger helper
-- =========================================================
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select table_name from information_schema.columns
    where table_schema = 'public' and column_name = 'updated_at'
  loop
    execute format('drop trigger if exists set_updated_at on %I', t);
    execute format('create trigger set_updated_at before update on %I
                    for each row execute function set_updated_at()', t);
  end loop;
end$$;
