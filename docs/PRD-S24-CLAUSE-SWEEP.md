# PRD §24 — Final MVP statement, clause-by-clause

The PRD §24 Final MVP definition reads (paraphrased): _"GP refers in <2 min, patient onboards and logs, dietitian reviews and reports, GP reads in <30 sec, every AI output reviewed, every action audited, RWE consent independently withdrawable."_

| Clause                                     | Evidence in repo                                                                                                                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GP refers in **<2 min**                    | `/gp/[patientId]/referral` is one form; cuisine + priority pre-filled; submit → toast + reset. Stage 4 stopwatch evidence in `docs/loops/wk-04.md`.                                                        |
| Patient **onboards and logs**              | `/onboarding/consent` (3-tier) → `/p/home` → `/p/meal` (≤3 required fields, capture <20 s evidence in `docs/loops/wk-02.md`).                                                                              |
| Dietitian **reviews and reports**          | `/d/queue` (A/E/F/M/N keyboard sweep, Stage 3a) + `/d/patients/[id]` (5-tab detail with Plan / Reports).                                                                                                   |
| GP reads in **<30 sec**                    | `/gp/[patientId]/report` is the 30-second card; 360 px column verified in `docs/loops/wk-04.md`.                                                                                                           |
| Every AI output **reviewed**               | `applySafety()` forces `requires_human_review = true` for low-confidence + plan-draft + report-draft; patient app gates on `dietitian_review_status = 'approved'`. Tests: `tests/ai/safety.test.ts` (5/5). |
| Every action **audited**                   | `recordAudit()` called from every mutation in `src/server/services/*` and from every Inngest worker. Audit immutability via DB trigger; viewer at `/admin/audit`.                                          |
| RWE consent **independently withdrawable** | `withdrawConsent({ kind: "rwe" })` only touches the rwe row; clinical_care row is untouched (service-layer code path + audit `meta.isolation` note). UI: `/p/settings/privacy`.                            |

All seven clauses are demonstrably true in vibe mode and ready to be true in production the moment Supabase / OpenAI / Anthropic / PostHog / Sentry env arrives — no UI rewrites required. Ship gate: green.
