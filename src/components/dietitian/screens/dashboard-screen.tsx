"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
  Users,
  ClipboardCheck,
  Activity,
  CalendarClock,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  MessageSquarePlus,
  Send,
} from "lucide-react";
import { DietitianStatCard } from "@/components/dietitian/stat-card";
import { StatusDot } from "@/components/shared/status-dot";
import {
  PATIENTS,
  DEMO_QUEUE_MEALS,
  recentSevereSymptoms,
  newReferrals,
  CURRENT_DIETITIAN_ID,
} from "@/lib/mock";
import {
  patientStore,
  type MealConsultationRequest,
} from "@/lib/storage/patient-store";

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

const statsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};

const statsItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.52, ease } },
};

const patientCardContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.0 } },
};

const patientCardItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};

export function DietitianDashboardScreen() {
  const myPatients = PATIENTS.filter(
    (p) => p.assignedDietitianId === CURRENT_DIETITIAN_ID,
  );
  const pendingMeals = DEMO_QUEUE_MEALS.length;
  const severe = recentSevereSymptoms();
  const newRefs = newReferrals();

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        className="flex items-end justify-between gap-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
      >
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Today
          </div>
          <h1 className="mt-1 font-serif text-[36px] leading-tight tracking-tight text-[var(--measured-dark)]">
            Good morning, Maya
          </h1>
          <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
            <span className="tnum">{pendingMeals}</span> meals to review ·{" "}
            <span className="tnum">{newRefs.length}</span> new referrals ·{" "}
            <span className="tnum">{severe.length}</span> severe-symptom flags
          </p>
        </div>
        <motion.div
          whileHover={{ y: -2, scale: 1.03 }}
          transition={{ type: "spring", stiffness: 380, damping: 22 }}
        >
          <Link
            href="/d/queue"
            className="cta-shadow inline-flex items-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-3 text-[14px] font-semibold text-white"
          >
            Open meal review
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden="true" />
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-7 grid gap-4 md:grid-cols-4"
        variants={statsContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={statsItem}>
          <DietitianStatCard
            label="Active patients"
            value={myPatients.length}
            Icon={Users}
            tone="default"
            hint="Caseload"
          />
        </motion.div>
        <motion.div variants={statsItem}>
          <DietitianStatCard
            label="Meals to review"
            value={pendingMeals}
            Icon={ClipboardCheck}
            tone={pendingMeals > 5 ? "warning" : "default"}
            hint={
              pendingMeals > 5 ? "Above target · start queue" : "Within target"
            }
          />
        </motion.div>
        <motion.div variants={statsItem}>
          <DietitianStatCard
            label="Severe flags"
            value={severe.length}
            Icon={AlertTriangle}
            tone={severe.length > 0 ? "danger" : "success"}
            hint={severe.length > 0 ? "Action required" : "All clear"}
          />
        </motion.div>
        <motion.div variants={statsItem}>
          <DietitianStatCard
            label="Sessions today"
            value={3}
            Icon={CalendarClock}
            tone="default"
            hint="2 telehealth · 1 in-clinic"
          />
        </motion.div>
      </motion.div>

      {severe.length > 0 && (
        <motion.section
          className="mt-8 rounded-2xl border border-[var(--measured-evaluate)]/30 bg-[var(--measured-evaluate)]/5 p-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
        >
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
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <SymChip label="Nausea" value={s.nausea} />
                      <SymChip label="Constipation" value={s.constipation} />
                      <span className="text-[11px] text-[var(--measured-subtext)]">
                        {new Date(s.loggedAt).toLocaleString([], {
                          weekday: "short",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </span>
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
        </motion.section>
      )}

      <motion.section
        className="mt-8 grid gap-5 md:grid-cols-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
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
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[12px] text-[var(--measured-subtext)]">
                      <span>{r.referringGpName}</span>
                      <span>·</span>
                      <span>{r.cuisineLabel}</span>
                      <StatusDot
                        tone={r.priority}
                        label={r.priority}
                        size="sm"
                      />
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
      </motion.section>

      {/* Caseload at a glance */}
      <motion.section
        className="mt-8"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between">
          <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Caseload
            <span className="tnum ml-2 rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] normal-case tracking-normal">
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
        <motion.div
          className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3"
          variants={patientCardContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {myPatients.map((p) => (
            <motion.div key={p.id} variants={patientCardItem}>
              <PatientMiniCard patient={p} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <PatientRequestsSection />
    </div>
  );
}

function SymChip({
  label,
  value,
}: {
  label: string;
  value: "none" | "mild" | "severe";
}) {
  const cls =
    value === "none"
      ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
      : value === "mild"
        ? "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]"
        : "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      <span className="opacity-70">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function PatientRequestsSection() {
  const [requests, setRequests] = useState<
    Array<MealConsultationRequest & { patientName: string }>
  >(() => {
    const all: Array<MealConsultationRequest & { patientName: string }> = [];
    for (const p of PATIENTS) {
      const reqs = patientStore.getRequests(p.id);
      for (const r of reqs) {
        if (!r.dietitianReply) {
          all.push({ ...r, patientName: `${p.firstName} ${p.lastName}` });
        }
      }
    }
    return all.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  });
  const [replies, setReplies] = useState<Record<string, string>>({});

  const reply = (req: (typeof requests)[number]) => {
    const text = replies[req.id]?.trim();
    if (!text) return;
    patientStore.replyToRequest(req.patientId, req.id, text);
    setReplies((prev) => ({ ...prev, [req.id]: "" }));
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  if (requests.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        <MessageSquarePlus size={14} strokeWidth={2} aria-hidden="true" />
        Patient meal requests
        <span className="tnum rounded-full bg-[var(--measured-clinical-amber)]/15 px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[var(--measured-clinical-amber)]">
          {requests.length}
        </span>
      </div>
      <ul className="mt-3 space-y-3">
        {requests.map((req) => (
          <li key={req.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--measured-dark)]">
                    {req.patientName}
                  </span>
                  <span className="rounded-full bg-[var(--measured-clinical-amber)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-amber)]">
                    {req.type.replace("_", " ")}
                  </span>
                  <span className="text-[11px] text-[var(--measured-subtext)]">
                    {new Date(req.createdAt).toLocaleString([], {
                      weekday: "short",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--measured-dark)]">
                  {req.body}
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={replies[req.id] ?? ""}
                onChange={(e) =>
                  setReplies((prev) => ({ ...prev, [req.id]: e.target.value }))
                }
                placeholder="Reply with a suggestion…"
                className="flex-1 rounded-xl border border-[var(--measured-border)] bg-[var(--measured-cream)] px-3 py-2 text-[12px] focus:border-[var(--measured-green)] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    reply(req);
                  }
                }}
              />
              <motion.button
                type="button"
                onClick={() => reply(req)}
                disabled={!replies[req.id]?.trim()}
                whileTap={replies[req.id]?.trim() ? { scale: 0.95 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--measured-green)] px-3 py-2 text-[12px] font-semibold text-white disabled:bg-[var(--measured-cream)] disabled:text-[var(--measured-subtext)]"
              >
                <Send size={13} strokeWidth={2.2} />
                Reply
              </motion.button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PatientMiniCard({
  patient: p,
}: {
  patient: (typeof PATIENTS)[number];
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 350, damping: 24 }}
    >
      <Link
        href={`/d/patients/${p.id}`}
        className="group flex items-center gap-3 rounded-2xl border border-[var(--measured-border-soft)] bg-white p-3.5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
      >
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{
            backgroundColor:
              p.risk === "high"
                ? "var(--measured-evaluate)"
                : p.risk === "medium"
                  ? "var(--measured-clinical-amber)"
                  : "var(--measured-clinical-blue)",
          }}
        >
          {p.firstName[0]}
          {p.lastName[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate text-[13px] font-semibold text-[var(--measured-dark)]">
              {p.firstName} {p.lastName}
            </span>
            <StatusDot tone={p.risk} label={p.risk} size="sm" />
          </div>
          <div className="tnum mt-0.5 flex items-center gap-2 text-[11px] text-[var(--measured-subtext)]">
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
        <ChevronRight
          size={14}
          className="shrink-0 text-[var(--measured-border-strong)] transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </motion.div>
  );
}
