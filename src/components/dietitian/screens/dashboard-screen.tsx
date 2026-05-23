"use client";

import Link from "next/link";
import {
  Users,
  ClipboardCheck,
  Activity,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { DietitianStatCard } from "@/components/dietitian/stat-card";
import {
  PATIENTS,
  DEMO_QUEUE_MEALS,
  recentSevereSymptoms,
  newReferrals,
  CURRENT_DIETITIAN_ID,
} from "@/lib/mock";

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
    </div>
  );
}
