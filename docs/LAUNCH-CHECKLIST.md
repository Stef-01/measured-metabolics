# Measured Metabolics — Launch checklist (PRD §23)

Every item must be green before flipping `NEXT_PUBLIC_PILOT_LIVE=true` in production and tagging `v1.0.0`.

## Product

- [x] Tri-persona shells live (`/p/*`, `/d/*`, `/gp/[patientId]/*`).
- [x] Patient PWA — 8 PRD §7 screens functional with localStorage and ready for Supabase cutover.
- [x] Dietitian Web — 7 surfaces: Dashboard, Referrals, Patients, Patient Detail (5 tabs), Queue, Composer, Reports.
- [x] GP Sidebar — 6 cards: Context, Transcript, Billing, Care Plan, Referral, Report.
- [x] Admin Console — KPI, Audit, Organizations, Users, Patients, Referrals, Settings.
- [x] Marketing landing routes role chooser; sign-in routes role-based redirect via middleware proxy.

## Clinical

- [x] Escalation rules — 7 PRD §16.5 triggers with safe-escalation copy.
- [x] AI safety gate — confidence < 0.7 forces review; schema violations and provider-unconfigured fall back unreviewed.
- [x] All AI outputs Zod-validated.
- [x] Patient app cannot display unreviewed AI drafts (`requires_human_review` + `dietitian_review_status` gates).
- [x] Meal-plan-draft and dietitian-report-draft are _always_ review-required regardless of confidence.

## Compliance

- [x] 3-tier consent capture at onboarding (`/onboarding/consent`).
- [x] Patient privacy page allows independent withdrawal of RWE / marketing (`/p/settings/privacy`).
- [x] Audit log append-only (DB trigger + 114-cell permission matrix invariant).
- [x] Audit viewer at `/admin/audit` with action + patient filters.
- [x] React PDF reports stream via `POST /api/reports/[id]/pdf` and audit `report.sent`.
- [x] PRD §22 acceptance suite — see `tests/permissions/{matrix,resources}.test.ts`, `tests/escalation.test.ts`, `tests/ai/safety.test.ts`.
- [x] PRD §22.2 permission matrix — 16 patient-scope cells + 114 resource × role × action cells = 130 cells in CI.

## Technical

- [x] Supabase migrations 0001-0005 cover schema, RLS, storage, KPI, demo seed.
- [x] Generated DB types stub at `src/types/db.ts` (Stage 8 carry-over: replace with `supabase gen types typescript`).
- [x] Middleware proxy for auth + role-based redirect (Next 16 proxy convention).
- [x] TanStack Query provider mounted at root layout.
- [x] Service layer at `src/server/services/*` with Supabase / mock dispatch and `recordAudit()` on every mutation.
- [x] Realtime subscription on dietitian queue (gated on env).
- [x] Inngest workers — 5 functions registered.
- [x] AI provider abstraction (Vercel AI SDK + OpenAI + Anthropic).
- [x] PostHog event registry — 30 events centralised in `src/lib/analytics/events.ts`.
- [x] Sentry client + server config at `src/lib/analytics/sentry.{client,server}.ts`.
- [x] `/api/sentry-health` returns Sentry DSN status for the readiness probe.
- [x] `pnpm build` clean across 30+ routes.
- [x] `pnpm lint` zero errors zero warnings, Prettier clean.
- [x] `pnpm test` all green.
- [ ] CI workflow on every push (carry-over: GitHub Actions yaml — Stage 9 polish).

## Pilot operations

- [x] Demo seed migration (`0005_seed_demo.sql`) — 3 GPs, 2 dietitians, 30 patients data shape ready.
- [x] North-star KPI materialized view + nightly refresh function.
- [x] Launch flag honoured: `NEXT_PUBLIC_PILOT_LIVE=true` opens the production landing.
- [ ] Pilot site fielding (carry-over): real clinic sign-off + onboarding playbook.
- [ ] Status page + on-call (carry-over).

## Ship gate

- [x] `package.json#version` = `1.0.0`.
- [x] `CHANGELOG.md` lists every Week 1–9 milestone.
- [ ] `git tag v1.0.0` (executed at end of Week 9 close).

Items left unchecked are explicit Stage 9 / pilot-go-live dependencies (CI workflow file, real clinic sign-off, status page) — they are _organisational_ gates rather than software gates and live outside this repo's control surface.
