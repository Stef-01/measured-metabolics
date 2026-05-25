"use client";

import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  Activity,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { DietitianStatCard } from "@/components/dietitian/stat-card";
import {
  PATIENTS,
  DEMO_QUEUE_MEALS,
  recentSevereSymptoms,
  newReferrals,
  CURRENT_DIETITIAN_ID,
} from "@/lib/mock";
import type { RiskLevel } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

export function DietitianDashboardScreen() {
  const myPatients = PATIENTS.filter(
    (p) => p.assignedDietitianId === CURRENT_DIETITIAN_ID,
  );
  const pendingMeals = DEMO_QUEUE_MEALS.length;
  const severe = recentSevereSymptoms();
  const newRefs = newReferrals();

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Today
          </div>
          <h1 className="mt-1 font-serif text-[36px] leading-tight tracking-tight text-[var(--measured-dark)]">
            Good morning, Maya
          </h1>
          <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
            {pendingMeals} meals to review · {newRefs.length} new referrals ·{" "}
            {severe.length} severe-symptom flags
          </p>
        </div>
        <Link
          href="/d/queue"
          className="cta-shadow inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-3 text-[14px] font-semibold text-white"
        >
          Open meal review
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-7 grid gap-4 md:grid-cols-4">
        <DietitianStatCard
          label="Active patients"
          value={myPatients.length}
          Icon={Users}
          tone="default"
          hint="Caseload"
        />
        <DietitianStatCard
          label="Meals waiting"
          value={pendingMeals}
          Icon={ClipboardCheck}
          tone={pendingMeals > 5 ? "warning" : "default"}
          hint={pendingMeals > 5 ? "Above 5-meal target" : "Within target"}
        />
        <DietitianStatCard
          label="Severe flags"
          value={severe.length}
          Icon={AlertTriangle}
          tone={severe.length > 0 ? "danger" : "success"}
          hint={severe.length > 0 ? "Action required" : "All clear"}
        />
        <DietitianStatCard
          label="Sessions today"
          value={3}
          Icon={CalendarClock}
          tone="default"
          hint="2 telehealth · 1 in-clinic"
        />
      </div>

      {severe.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--measured-evaluate)]/30 bg-[var(--measured-evaluate)]/5 p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-evaluate)]">
            <AlertTriangle size={14} strokeWidth={2.2} aria-hidden="true" />
            Severe symptoms today
          </div>
          <ul className="mt-3 space-y-2">
            {severe.map((s) => {
              const p = PATIENTS.find((pp) => pp.id === s.patientId);
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3 shadow-[var(--shadow-card)]"
                >
                  <div className="min-w-0">
                    {p ? (
                      <Link
                        href={`/d/patients/${p.id}`}
                        className="text-[14px] font-semibold text-[var(--measured-dark)] hover:text-[var(--measured-evaluate)] hover:underline"
                      >
                        {p.firstName} {p.lastName}
                      </Link>
                    ) : (
                      <div className="text-[14px] font-semibold text-[var(--measured-dark)]">
                        {s.patientId}
                      </div>
                    )}
                    <div className="text-[12px] text-[var(--measured-subtext)]">
                      Nausea: {s.nausea} · Constipation: {s.constipation} ·{" "}
                      {new Date(s.loggedAt).toLocaleString([], {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <Link
                    href={p ? `/d/patients/${p.id}` : "/d/patients"}
                    className="rounded-lg bg-[var(--measured-evaluate)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--measured-evaluate-hover)]"
                  >
                    Open
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            <Activity size={14} strokeWidth={2} aria-hidden="true" />
            New referrals
          </div>
          <ul className="mt-3 space-y-2">
            {newRefs.length === 0 && (
              <li className="text-[13px] text-[var(--measured-subtext)]">
                No new referrals today.
              </li>
            )}
            {newRefs.map((r) => {
              const p = PATIENTS.find((pp) => pp.id === r.patientId);
              return (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    {p ? (
                      <Link
                        href={`/d/patients/${p.id}`}
                        className="text-[14px] font-semibold text-[var(--measured-dark)] hover:text-[var(--measured-dark-green)] hover:underline"
                      >
                        {p.firstName} {p.lastName}
                      </Link>
                    ) : (
                      <div className="text-[14px] font-semibold text-[var(--measured-dark)]">
                        {r.patientId}
                      </div>
                    )}
                    <div className="text-[12px] text-[var(--measured-subtext)]">
                      {r.referringGpName} · {r.cuisineLabel} · {r.priority}
                    </div>
                  </div>
                  <Link
                    href="/d/referrals"
                    className="rounded-lg bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--measured-dark-green)] ring-1 ring-[var(--measured-border)] hover:bg-[var(--measured-cream)]"
                  >
                    Review
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            <ClipboardCheck size={14} strokeWidth={2} aria-hidden="true" />
            Today&apos;s sweep
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--measured-dark)]">
            Use the meal review queue to clear pending photos. Target: 5 meals
            in under 5 minutes via shortcuts —
            <kbd className="mx-1 rounded bg-[var(--measured-cream)] px-1.5 py-0.5 text-[11px] font-mono">
              A
            </kbd>
            approve,
            <kbd className="mx-1 rounded bg-[var(--measured-cream)] px-1.5 py-0.5 text-[11px] font-mono">
              E
            </kbd>
            edit,
            <kbd className="mx-1 rounded bg-[var(--measured-cream)] px-1.5 py-0.5 text-[11px] font-mono">
              F
            </kbd>
            flag,
            <kbd className="mx-1 rounded bg-[var(--measured-cream)] px-1.5 py-0.5 text-[11px] font-mono">
              M
            </kbd>
            message,
            <kbd className="mx-1 rounded bg-[var(--measured-cream)] px-1.5 py-0.5 text-[11px] font-mono">
              N
            </kbd>
            next.
          </p>
        </div>
      </section>

      {/* Caseload at a glance */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Caseload
            <span className="ml-2 rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] normal-case tracking-normal">
              {myPatients.length}
            </span>
          </div>
          <Link
            href="/d/patients"
            className="text-[12px] font-semibold text-[var(--measured-dark-green)] hover:underline"
          >
            View all →
          </Link>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {myPatients.map((p) => (
            <PatientMiniCard key={p.id} patient={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

const RISK_CHIP: Record<RiskLevel, string> = {
  high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  medium: "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  low: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
};

function PatientMiniCard({ patient: p }: { patient: (typeof PATIENTS)[number] }) {
  return (
    <Link
      href={`/d/patients/${p.id}`}
      className="group flex items-center gap-3 rounded-2xl border border-[var(--measured-border-soft)] bg-white p-3.5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
        style={{
          backgroundColor: p.risk === "high" ? "var(--measured-evaluate)" : p.risk === "medium" ? "var(--measured-clinical-amber)" : "var(--measured-clinical-blue)",
        }}
      >
        {p.firstName[0]}{p.lastName[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate text-[13px] font-semibold text-[var(--measured-dark)]">
            {p.firstName} {p.lastName}
          </span>
          <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase", RISK_CHIP[p.risk])}>
            {p.risk}
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-[11px] text-[var(--measured-subtext)]">
          <span>HbA1c {p.hbA1cPct}%</span>
          <span>·</span>
          <span>TIR {p.timeInRangePct}%</span>
          <span>·</span>
          <span>Wk {p.weekNumber}</span>
        </div>
        {p.alerts.length > 0 && (
          <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--measured-evaluate)]">
            <AlertTriangle size={10} strokeWidth={2.2} aria-hidden="true" />
            {p.alerts[0]}
          </div>
        )}
      </div>
      <ChevronRight size={14} className="shrink-0 text-[var(--measured-border-strong)] transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}
