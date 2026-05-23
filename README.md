# Banksia

The clinician companion. Banksia is the dietitian/clinician-facing twin of Sous — same UI language, built for clinical workflows.

Banksia is a native Australian flower; the name signals nutrition rooted in real science and a calm, professional surface.

## Tech stack

- **Framework**: Next.js 16 (App Router) with TypeScript
- **UI**: React 19, Tailwind CSS 4, Framer Motion, lucide-react
- **State**: React local state (extend with Zustand/TanStack Query as needed)

## Commands

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint
```

## Design language

Banksia is a faithful port of the Sous visual system:

- Inter (sans) + DM Serif Display (serif) typography
- Banksia green palette (`--banksia-green` / `--banksia-dark-green` / `--banksia-light-green`)
- Cream surface (`--banksia-cream`) over white cards
- Three-tier border + shadow system, soft scrollbars, mobile-first
- Phone-shaped DeviceFrame on desktop, full-bleed on real mobile
- Sticky `app-header`, surface utility classes, Framer-Motion-powered tab bar

## Project structure

```
src/
  app/                    # Next.js App Router
    (today)/today/        # clinician dashboard (the home of the app)
    layout.tsx
    page.tsx              # marketing landing
    globals.css           # design tokens + base styles
  components/
    marketing/            # landing
    shared/               # device frame, tab bar, error boundary, toast host
    today/                # dashboard cards (patient queue, alerts, etc.)
    ui/                   # primitives (icon button)
  lib/
    hooks/                # use-toast, use-haptic, use-navigation
    utils/                # cn
```

## Relationship to Sous

Banksia is **fully separate** from Sous — independent repo, dependencies, and CSS variable namespace (`--banksia-*` instead of `--nourish-*`). They share a visual language; nothing else.
