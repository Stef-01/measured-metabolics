-- Stage 8 — North-star KPI (PRD §17.1).
-- "Completed metabolic care loop rate":
--   referral.created → patient onboards → uploads ≥3 meals →
--   dietitian approves → report.sent → GP record.viewed (report)
-- All within a 4-week window.

create materialized view if not exists kpi_completed_loops as
with referral_starts as (
  select target_id as patient_id, occurred_at as started_at
  from audit_events
  where action = 'referral.created'
),
loops as (
  select
    r.patient_id,
    r.started_at,
    (select count(*) from audit_events
       where action = 'meal.uploaded'
         and patient_id = r.patient_id
         and occurred_at between r.started_at and r.started_at + interval '4 weeks'
    ) as meals_uploaded,
    (select count(*) from audit_events
       where action = 'meal.approved'
         and patient_id = r.patient_id
         and occurred_at between r.started_at and r.started_at + interval '4 weeks'
    ) as meals_approved,
    exists (
      select 1 from audit_events
       where action = 'report.sent'
         and patient_id = r.patient_id
         and occurred_at between r.started_at and r.started_at + interval '4 weeks'
    ) as report_sent,
    exists (
      select 1 from audit_events
       where action = 'record.viewed'
         and target_type = 'dietitian_report'
         and patient_id = r.patient_id
         and occurred_at between r.started_at and r.started_at + interval '4 weeks'
    ) as report_viewed
  from referral_starts r
)
select
  patient_id,
  started_at,
  meals_uploaded >= 3 and meals_approved >= 1 and report_sent and report_viewed as completed_loop
from loops;

create unique index if not exists kpi_completed_loops_pk
  on kpi_completed_loops (patient_id, started_at);

-- Refresh nightly via Supabase cron / pg_cron. Stage 9: wire to Vercel cron.
create or replace function refresh_kpi_completed_loops() returns void
language plpgsql as $$
begin
  refresh materialized view concurrently kpi_completed_loops;
end;
$$;
