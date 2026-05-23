# Measured Metabolics

A metabolic care operating system. Three minimal interfaces sharing one clinical brain:

- **Patient PWA** — captures meals, symptoms, CGM, weight, and goals
- **Dietitian Web** — review queue, meal plan builder, GP report builder
- **GP Sidebar** — patient context, transcript analysis, care plan, dietitian referral, dietitian report

> The on-disk folder is `Banksia` for historical reasons (a Windows file lock prevented the rename during scaffolding). The project, package, and brand are all **Measured Metabolics**.

## Tech stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion, lucide-react, Recharts
- **State**: TanStack Query (server) + Zustand (client) + react-hook-form + Zod
- **Backend (Stage 5+)**: Supabase Postgres, Auth, Storage, Realtime, RLS
- **AI (Stage 6+)**: Vercel AI SDK with provider-agnostic LLMProvider abstraction, Inngest workers
- **Compliance (Stage 7+)**: 3-tier consent ledger, audit log, React PDF, escalation rules

## Commands

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build
pnpm lint
pnpm test
```

## Routes

```
/                         role chooser (Stage 1) → onboarding (Stage 5)
/p/home                   patient home
/p/meal                   add meal
/p/plan                   today's meal plan
/p/metrics                glucose / weight / symptoms
/p/symptoms               quick symptom check
/p/messages               dietitian thread
/d/dashboard              dietitian today
/d/referrals              referral inbox
/d/patients               patient panel
/d/patients/[id]          patient detail
/d/queue                  meal review queue
/d/reports                GP report builder
/d/messages               composer
/gp/[patientId]/context   sidebar patient context card
/gp/[patientId]/transcript transcript paste + analysis
/gp/[patientId]/billing   eligibility + billing
/gp/[patientId]/care-plan care plan draft
/gp/[patientId]/referral  dietitian referral
/gp/[patientId]/report    dietitian report (30-second summary)
```

## Design language

Ported from the Sous design system, retuned for clinical trust:

- Inter (sans) + DM Serif Display (serif) typography
- Deep clinical green palette (`--measured-green` / `--measured-dark-green`) over cream
- Three-tier border + shadow system, soft scrollbars, mobile-first patient surface
- Phone-shaped DeviceFrame on `/p/*`; full-bleed for `/d/*` and `/gp/*`
- Sticky `app-header`, `surface-card` / `surface-raised` utilities, motion-driven nav

## Project structure

```
src/
  app/
    (patient)/p/{home,meal,plan,metrics,symptoms,messages}/page.tsx
    (dietitian)/d/{dashboard,referrals,patients,queue,reports,messages}/page.tsx
    (dietitian)/d/patients/[id]/page.tsx
    (gp)/gp/[patientId]/{context,transcript,billing,care-plan,referral,report}/page.tsx
    layout.tsx                 # root: providers, error boundary, toast host
    page.tsx                   # role chooser
    globals.css                # design tokens + base styles
    error.tsx, not-found.tsx
  components/
    marketing/landing.tsx
    patient/                   # bottom-nav, FAB, screens
    dietitian/                 # side-nav, queue cards, builders
    gp/                        # sidebar shell, stacked cards
    shared/                    # device-frame, error-boundary, toast-host, persona-shell
    ui/                        # icon-button + primitives
  lib/
    hooks/                     # use-navigation, use-toast, use-haptic
    mock/                      # patients, referrals, meals, cgm, symptoms, messages
    utils/                     # cn, format
  types/                       # shared Zod-derived types
```

## Roadmap

See [planning.md](./planning.md) for the 8-stage / 9-week build plan with weekly cadence and recursive 2-loop test/fix rhythm.
