-- Measured Metabolics — Discovery-call booking funnel (lead capture)
-- Purpose: capture pre-patient discovery-call bookings produced by the public
-- website assessment funnel. Stores ONLY contact details + the requested call
-- slot — deliberately NO health information (height, weight, BMI, age, etc.).
--
-- Eligibility is pre-screened client-side; only the contact fields and the
-- chosen slot ever cross the wire and land here. The funnel writes server-side
-- with the service role, so the public anon key never touches this table.
--
-- Conventions mirror 0001_init.sql: snake_case, uuid PK, created_at/updated_at,
-- enums for constrained vocab. Self-contained — depends only on uuid-ossp and
-- Supabase's auth.jwt(), so it applies cleanly on a fresh project independent
-- of the clinical schema.

set check_function_bodies = off;

create extension if not exists "uuid-ossp";

-- Three-hour preference windows offered in the funnel. Declared in
-- chronological order so `order by time_block` sorts the day correctly.
create type discovery_time_block as enum ('9-12', '12-3', '3-6', '6-9');

-- Lead pipeline the admin team moves a booking through.
create type discovery_booking_status as enum (
  'new', 'contacted', 'scheduled', 'completed', 'cancelled', 'no_show'
);

create table discovery_bookings (
  id             uuid primary key default uuid_generate_v4(),
  first_name     text not null,
  last_name      text,
  email          text not null,
  phone          text not null,
  preferred_date date not null,
  time_block     discovery_time_block not null,
  status         discovery_booking_status not null default 'new',
  source         text not null default 'website_funnel',
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint discovery_bookings_email_chk check (position('@' in email) > 1),
  constraint discovery_bookings_first_name_chk check (length(btrim(first_name)) > 0)
);

comment on table discovery_bookings is
  'Public discovery-call leads from the website funnel. Contact + requested slot only; no health data is stored.';

-- Admin-team access patterns: the daily call sheet (date, slot) and the
-- follow-up worklist (pipeline state).
create index discovery_bookings_date_block_idx on discovery_bookings (preferred_date, time_block);
create index discovery_bookings_status_idx on discovery_bookings (status, created_at desc);
create index discovery_bookings_email_idx on discovery_bookings (lower(email));

-- updated_at maintenance. Unique function name avoids clobbering the global
-- set_updated_at() helper from 0001 when both migrations are present.
create or replace function discovery_bookings_touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger discovery_bookings_set_updated_at
  before update on discovery_bookings
  for each row execute function discovery_bookings_touch_updated_at();

-- =========================================================
-- Admin reading view — the "call sheet". Friendly slot labels plus absolute
-- AEST/AEDT start + end so the team can sort by real time or drop a slot into
-- a calendar. security_invoker keeps the base-table RLS in force.
-- =========================================================
create or replace view discovery_bookings_admin
  with (security_invoker = on) as
select
  b.id,
  btrim(b.first_name || ' ' || coalesce(b.last_name, ''))   as full_name,
  b.first_name,
  b.last_name,
  b.email,
  b.phone,
  b.preferred_date,
  to_char(b.preferred_date, 'Dy DD Mon YYYY')               as preferred_date_label,
  b.time_block,
  case b.time_block
    when '9-12' then '9:00 AM – 12:00 PM'
    when '12-3' then '12:00 PM – 3:00 PM'
    when '3-6'  then '3:00 PM – 6:00 PM'
    when '6-9'  then '6:00 PM – 9:00 PM'
  end                                                        as time_block_label,
  ((b.preferred_date + case b.time_block
      when '9-12' then time '09:00' when '12-3' then time '12:00'
      when '3-6'  then time '15:00' else time '18:00' end)
      at time zone 'Australia/Sydney')                       as slot_start_at,
  ((b.preferred_date + case b.time_block
      when '9-12' then time '12:00' when '12-3' then time '15:00'
      when '3-6'  then time '18:00' else time '21:00' end)
      at time zone 'Australia/Sydney')                       as slot_end_at,
  b.status,
  b.source,
  b.notes,
  b.created_at,
  b.updated_at
from discovery_bookings b
order by b.preferred_date asc, b.time_block asc, b.created_at asc;

comment on view discovery_bookings_admin is
  'Admin call-sheet over discovery_bookings: friendly slot labels + AEST start/end, ordered by day then slot.';

-- =========================================================
-- RLS — lock the table down. Inserts happen server-side via the service role,
-- which bypasses RLS; the public anon key gets no access at all. Authenticated
-- admins (JWT app_metadata.role = 'admin') may read/manage directly when a
-- future admin surface is wired up.
-- =========================================================
alter table discovery_bookings enable row level security;
alter table discovery_bookings force row level security;

create or replace function discovery_is_admin() returns boolean
language sql stable as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

create policy "discovery_bookings admin read" on discovery_bookings
  for select using (discovery_is_admin());
create policy "discovery_bookings admin update" on discovery_bookings
  for update using (discovery_is_admin()) with check (discovery_is_admin());
create policy "discovery_bookings admin delete" on discovery_bookings
  for delete using (discovery_is_admin());
-- (no insert policy: inserts are server-side via the service role)
