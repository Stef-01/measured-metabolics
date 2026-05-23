# Changelog

## v1.0.0 — 2026-05-22 — Pilot-ready

The 9-week, 8-stage Measured Metabolics overhaul completes. Tri-persona PWA / Web / GP-sidebar is live on a single Supabase data model with full RLS, AI safety gating, audit, consent, and React-PDF reports.

### Stage 1 (Week 1) — Rebrand + tri-shell skeleton

- In-place rebrand `Banksia` → `Measured Metabolics` (CSS vars, brand copy, manifest).
- Three route groups: `(patient)/p/*`, `(dietitian)/d/*`, `(gp)/gp/[patientId]/*`.
- Persona-aware navigation with TS function overloads.
- Mock fixtures for the canonical demo cohort (Asha, Ken, Lina, Omar).
- 20 stub routes; lint/build/test all green.

### Stage 2 (Week 2) — Patient PWA

- 8 PRD §7 screens (Home, Add Meal, Saved, Plan, Recipe, Metrics, Symptoms, Messages).
- localStorage-backed `patientStore` with cross-tab sync.
- Recharts metrics; severe-symptom safe-escalation copy.

### Stage 3a (Week 3) — Dietitian queue surfaces

- Dashboard, Referrals, Patients, Meal Queue with A/E/F/M/N keyboard shortcuts.
- Zustand queue store; 100-meal synthesizer for performance.

### Stage 3b + Stage 4 (Week 4) — Dietitian polish + GP sidebar

- Patient Detail (5 tabs), Composer, Reports.
- All 6 GP cards: Context, Transcript (SOAP draft), Billing, Care Plan, Referral, Report.
- Tri-persona end-to-end vibe smoke.

### Stage 5a (Week 5) — Supabase schema + Auth + RLS

- 30 tables (`0001_init.sql`) with audit immutability trigger.
- Deny-by-default RLS (`0002_rls.sql`) with `auth_can_see_patient()` helper.
- Magic-link auth + middleware proxy + role-based redirect.
- 16-cell permission matrix in CI.

### Stage 5b (Week 6) — Storage + data layer + Realtime

- Storage RLS (`0003_storage.sql`) for `meal-photos`, `report-pdfs`, `consent-docs`.
- TanStack Query provider; service layer with `recordAudit()` on every mutation.
- Realtime subscription on dietitian queue.
- Inngest scaffold.

### Stage 6 (Week 7) — AI layer + workers

- 5 Zod schemas + in-code prompt registry + Vercel-AI-SDK provider.
- 5 Inngest workers: meal-vision, transcript-analyzer, report-draft, meal-plan-draft, notifications.
- Safety gate: confidence < 0.7 forces review; plan/report drafts always reviewed.
- 5 PRD §22.3 cells in CI.

### Stage 7 (Week 8) — Compliance

- 3-tier consent capture + privacy page with isolated RWE withdrawal.
- Admin audit viewer (`/admin/audit`).
- 7 PRD §16.5 escalation rules.
- React-PDF report streaming (`POST /api/reports/[id]/pdf`).
- 114-cell resource permission matrix in CI.

### Stage 8 (Week 9) — Admin Console + KPI + telemetry + ship

- Admin Console: KPI, Audit, Organizations, Users, Patients, Referrals, Settings.
- North-star KPI materialized view + nightly refresh function.
- 30-event PostHog registry.
- Sentry client + server config + `/api/sentry-health`.
- Demo seed migration (`0005_seed_demo.sql`) — orgs, mbs_rules, conditions, recipes; cohort generator deferred to a Stage 9 TS script.
- Launch checklist + PRD §24 clause sweep.
- `package.json#version` → `1.0.0`.
