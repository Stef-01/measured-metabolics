"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  ClipboardList,
  Activity,
  CalendarDays,
  FileText,
  MessageSquare,
  CheckCircle2,
  Send,
} from "lucide-react";
import {
  ASHA_PLAN,
  CGM_BY_PATIENT,
  THREADS,
  recipeById,
  RECIPES,
} from "@/lib/mock";
import { mealsForPatient, pendingMeals } from "@/lib/mock/meals";
import { symptomsForPatient } from "@/lib/mock/symptoms";
import type { Patient, MealType } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";

type TabId = "overview" | "cgm" | "plan" | "reports" | "messages";

const TABS: { id: TabId; label: string; Icon: typeof ClipboardList }[] = [
  { id: "overview", label: "Overview", Icon: ClipboardList },
  { id: "cgm", label: "CGM + Meals", Icon: Activity },
  { id: "plan", label: "Plan", Icon: CalendarDays },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "messages", label: "Messages", Icon: MessageSquare },
];

interface Props {
  patient: Patient;
}

export function DietitianPatientDetailScreen({ patient }: Props) {
  const [tab, setTab] = useState<TabId>("overview");
  const cgm = CGM_BY_PATIENT[patient.id];
  const meals = mealsForPatient(patient.id);
  const symptoms = symptomsForPatient(patient.id);
  const thread = THREADS.find((t) => t.patientId === patient.id);
  const pending = pendingMeals().filter((m) => m.patientId === patient.id);

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/d/patients"
        className="inline-flex items-center gap-1 text-[12px] text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]"
      >
        <ArrowLeft size={12} strokeWidth={2.2} aria-hidden="true" />
        Back to caseload
      </Link>

      <header className="mt-2 flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Patient · Week {patient.weekNumber}
          </div>
          <h1 className="mt-1 font-serif text-[36px] leading-tight tracking-tight text-[var(--measured-dark)]">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
            {patient.age}
            {patient.sex.toLowerCase()} · {patient.conditions.join(" · ")} ·{" "}
            {patient.cuisineLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-[12px] text-[var(--measured-subtext)]">
          <div>
            HbA1c{" "}
            <span className="font-semibold text-[var(--measured-dark)]">
              {patient.hbA1cPct}%
            </span>
          </div>
          <div>
            TIR{" "}
            <span className="font-semibold text-[var(--measured-dark)]">
              {patient.timeInRangePct}%
            </span>
          </div>
          <div>
            Weight Δ{" "}
            <span className="font-semibold text-[var(--measured-dark)]">
              {patient.weightDeltaKg > 0 ? "+" : ""}
              {patient.weightDeltaKg.toFixed(1)} kg
            </span>
          </div>
        </div>
      </header>

      {/* Tab strip */}
      <div className="mt-6 flex gap-2 overflow-x-auto border-b border-[var(--measured-border-soft)] pb-px">
        {TABS.map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              type="button"
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={isActive}
              className={cn(
                "relative inline-flex items-center gap-1.5 px-3 py-2.5 text-[13px] font-semibold transition-colors",
                isActive
                  ? "text-[var(--measured-dark-green)]"
                  : "text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]",
              )}
            >
              <t.Icon size={14} strokeWidth={2.2} aria-hidden="true" />
              {t.label}
              {isActive && (
                <motion.span
                  layoutId="patient-detail-tab"
                  className="absolute -bottom-px left-0 right-0 h-[2px] rounded-full bg-[var(--measured-green)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {tab === "overview" && (
              <div className="grid gap-4 md:grid-cols-2">
                <Card title="Pattern summary">
                  <ul className="space-y-2 text-[14px] leading-relaxed text-[var(--measured-dark)]">
                    {patient.patternSummary.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card title="Recent symptoms">
                  {symptoms.length === 0 ? (
                    <p className="text-[13px] text-[var(--measured-subtext)]">
                      No symptom check-ins yet.
                    </p>
                  ) : (
                    <ul className="space-y-2 text-[13px]">
                      {symptoms.slice(0, 3).map((s) => (
                        <li
                          key={s.id}
                          className="rounded-xl bg-[var(--measured-cream)] px-3 py-2"
                        >
                          <div className="text-[12px] text-[var(--measured-subtext)]">
                            {new Date(s.loggedAt).toLocaleString([], {
                              weekday: "short",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className="text-[var(--measured-dark)]">
                            Nausea: {s.nausea} · Constipation: {s.constipation}{" "}
                            · Appetite: {s.appetite}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
                {patient.alerts.length > 0 && (
                  <Card title="Open alerts" tone="danger">
                    <ul className="space-y-1 text-[13px] text-[var(--measured-evaluate)]">
                      {patient.alerts.map((a) => (
                        <li key={a}>· {a}</li>
                      ))}
                    </ul>
                  </Card>
                )}
                <Card title="Demographics">
                  <dl className="grid grid-cols-2 gap-2 text-[13px]">
                    <Item k="BMI" v={patient.bmi.toFixed(1)} />
                    {patient.bp && (
                      <Item
                        k="BP"
                        v={`${patient.bp.systolic}/${patient.bp.diastolic}`}
                      />
                    )}
                    {patient.ldl !== undefined && (
                      <Item k="LDL" v={`${patient.ldl} mmol/L`} />
                    )}
                    <Item
                      k="Meds"
                      v={
                        patient.meds.length > 0
                          ? patient.meds.join(", ")
                          : "None"
                      }
                    />
                  </dl>
                </Card>
              </div>
            )}

            {tab === "cgm" && (
              <div className="grid gap-4">
                <Card title={`Glucose · ${cgm ? "last 48h" : "no CGM data"}`}>
                  {cgm ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <AreaChart
                        data={cgm.readings.map((r) => ({
                          time: new Date(r.ts).getTime(),
                          mmolL: r.mmolL,
                        }))}
                      >
                        <defs>
                          <linearGradient
                            id="dpglu"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2d5a3d"
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="100%"
                              stopColor="#2d5a3d"
                              stopOpacity={0.02}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          stroke="rgba(0,0,0,0.06)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="time"
                          type="number"
                          domain={["dataMin", "dataMax"]}
                          tickFormatter={(t: number) =>
                            new Date(t).toLocaleTimeString([], {
                              hour: "numeric",
                              hour12: false,
                            })
                          }
                          stroke="rgba(0,0,0,0.4)"
                          fontSize={10}
                        />
                        <YAxis
                          domain={[3, 12]}
                          stroke="rgba(0,0,0,0.4)"
                          fontSize={10}
                        />
                        <Tooltip
                          formatter={(v: number) => `${v.toFixed(1)} mmol/L`}
                        />
                        <ReferenceArea
                          y1={3.9}
                          y2={10}
                          fill="#2d5a3d"
                          fillOpacity={0.06}
                        />
                        <Area
                          type="monotone"
                          dataKey="mmolL"
                          stroke="#2d5a3d"
                          strokeWidth={2}
                          fill="url(#dpglu)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-[13px] text-[var(--measured-subtext)]">
                      CGM not connected. Stage 6 will provision device pairing
                      via Inngest.
                    </p>
                  )}
                </Card>
                <Card title={`Recent meals (${meals.length})`}>
                  <ul className="space-y-2">
                    {meals.length === 0 && (
                      <li className="text-[13px] text-[var(--measured-subtext)]">
                        No meals logged yet.
                      </li>
                    )}
                    {meals.slice(0, 5).map((m) => (
                      <li
                        key={m.id}
                        className="grid grid-cols-[40px_1fr_auto] items-start gap-3 rounded-xl bg-[var(--measured-cream)] p-3"
                      >
                        <span className="text-[28px]" aria-hidden="true">
                          {m.photoEmoji}
                        </span>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold text-[var(--measured-dark)]">
                            {m.mealType} ·{" "}
                            {new Date(m.eatenAt).toLocaleString([], {
                              weekday: "short",
                              hour: "numeric",
                            })}
                          </div>
                          <div className="text-[12px] text-[var(--measured-subtext)]">
                            {m.analysis.dietitianSummary}
                          </div>
                        </div>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                            m.reviewStatus === "approved"
                              ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                              : m.reviewStatus === "flagged"
                                ? "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]"
                                : "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
                          )}
                        >
                          {m.reviewStatus.replace("_", " ")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {pending.length > 0 && (
                    <Link
                      href="/d/queue"
                      className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[var(--measured-dark-green)]"
                    >
                      {pending.length} pending in queue →
                    </Link>
                  )}
                </Card>
              </div>
            )}

            {tab === "plan" && <PlanBuilder patient={patient} />}

            {tab === "reports" && (
              <ReportPreview
                patient={patient}
                mealCount={meals.length}
                symptomCount={symptoms.length}
              />
            )}

            {tab === "messages" && (
              <Card
                title={
                  thread
                    ? `Thread with ${patient.firstName}`
                    : "No messages yet"
                }
              >
                {thread && thread.messages.length > 0 ? (
                  <ul className="space-y-2">
                    {thread.messages.slice(-6).map((m) => (
                      <li
                        key={m.id}
                        className={cn(
                          "max-w-[80%] rounded-xl p-3 text-[13px] leading-relaxed",
                          m.fromRole === "patient"
                            ? "bg-[var(--measured-cream)] text-[var(--measured-dark)]"
                            : "ml-auto bg-[var(--measured-green)] text-white",
                        )}
                      >
                        <div
                          className={cn(
                            "mb-1 text-[10px] font-semibold uppercase tracking-wider",
                            m.fromRole === "patient"
                              ? "text-[var(--measured-subtext)]"
                              : "text-white/80",
                          )}
                        >
                          {m.fromName}
                        </div>
                        {m.body}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[13px] text-[var(--measured-subtext)]">
                    No messages yet. Start one from{" "}
                    <Link
                      href="/d/messages"
                      className="font-semibold text-[var(--measured-dark-green)]"
                    >
                      composer
                    </Link>
                    .
                  </p>
                )}
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
  tone = "default",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <section
      className={cn(
        "surface-card p-5",
        tone === "danger" && "ring-1 ring-[var(--measured-evaluate)]/30",
      )}
    >
      <h3 className="font-serif text-[18px] text-[var(--measured-dark)]">
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        {k}
      </dt>
      <dd className="text-[var(--measured-dark)]">{v}</dd>
    </div>
  );
}

function PlanBuilder({ patient }: { patient: Patient }) {
  const [items, setItems] = useState(ASHA_PLAN.items);
  const [approved, setApproved] = useState(true);

  const update = (idx: number, patch: Partial<(typeof items)[number]>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
    setApproved(false);
  };

  const approve = () => {
    setApproved(true);
    toast.push({
      variant: "success",
      title: `Plan approved for ${patient.firstName}`,
      duration: 2000,
    });
  };

  const mealLabel: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
  };

  return (
    <div className="grid gap-4">
      <Card title="Meal plan builder">
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div
              key={it.mealType}
              className="rounded-xl border border-[var(--measured-border-soft)] bg-[var(--measured-cream)] p-3"
            >
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                {mealLabel[it.mealType]}
              </div>
              <input
                type="text"
                value={it.title}
                onChange={(e) => update(idx, { title: e.target.value })}
                className="mt-1 w-full bg-transparent text-[15px] font-semibold text-[var(--measured-dark)] focus:outline-none"
              />
              <textarea
                rows={1}
                value={it.description}
                onChange={(e) => update(idx, { description: e.target.value })}
                className="mt-1 w-full resize-none bg-transparent text-[13px] leading-relaxed text-[var(--measured-dark)] focus:outline-none"
              />
              <input
                type="text"
                value={it.rationale ?? ""}
                onChange={(e) => update(idx, { rationale: e.target.value })}
                placeholder="Rationale (one line for the patient)"
                className="mt-1 w-full bg-transparent text-[12px] italic text-[var(--measured-dark-green)] placeholder:text-[var(--measured-subtext)] focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={approve}
          disabled={approved}
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold",
            approved
              ? "cursor-default bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
              : "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
          )}
        >
          {approved ? (
            <>
              <CheckCircle2 size={16} strokeWidth={2.2} aria-hidden="true" />
              Approved
            </>
          ) : (
            <>Approve & send to {patient.firstName}</>
          )}
        </button>
      </Card>
      <Card title="Recipe library">
        <ul className="grid gap-2 md:grid-cols-2">
          {RECIPES.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-[var(--measured-border-soft)] bg-white p-3"
            >
              <Link
                href={`/p/plan/${r.id}`}
                className="text-[14px] font-semibold text-[var(--measured-dark-green)]"
              >
                {r.title}
              </Link>
              <p className="mt-1 text-[12px] text-[var(--measured-subtext)]">
                {r.why}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-[var(--measured-subtext)]">
          Stage 6 will let dietitians draft new recipes and approve them into
          the patient&apos;s plan.
        </p>
      </Card>
    </div>
  );
}

function ReportPreview({
  patient,
  mealCount,
  symptomCount,
}: {
  patient: Patient;
  mealCount: number;
  symptomCount: number;
}) {
  const [recommendations, setRecommendations] = useState([
    `Continue current dose; review at next visit.`,
    `Reinforce dinner-rice substitution given Δ${"3.4"} mmol/L spike.`,
    `Repeat HbA1c in 6 weeks.`,
  ]);
  const [sent, setSent] = useState(false);

  const send = () => {
    setSent(true);
    toast.push({
      variant: "success",
      title: `Report sent to ${patient.referringGpId.toUpperCase()}`,
      duration: 1800,
    });
  };

  return (
    <Card title="GP report draft">
      <p className="text-[14px] leading-relaxed text-[var(--measured-dark)]">
        Over the past 4 weeks, {patient.firstName} has uploaded {mealCount}{" "}
        meals and logged {symptomCount} symptom check-ins. Time-in-range
        improved from {Math.max(50, patient.timeInRangePct - 6)}% to{" "}
        {patient.timeInRangePct}%. Weight is{" "}
        {patient.weightDeltaKg > 0 ? "up" : "down"}{" "}
        {Math.abs(patient.weightDeltaKg).toFixed(1)} kg.
      </p>
      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Recommendations
        </div>
        <ul className="mt-2 space-y-1.5">
          {recommendations.map((r, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--measured-green)]" />
              <input
                type="text"
                value={r}
                onChange={(e) =>
                  setRecommendations((prev) =>
                    prev.map((p, i) => (i === idx ? e.target.value : p)),
                  )
                }
                className="w-full bg-transparent text-[14px] text-[var(--measured-dark)] focus:outline-none"
              />
            </li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={send}
        disabled={sent}
        className={cn(
          "mt-5 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold",
          sent
            ? "cursor-default bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
            : "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
        )}
      >
        {sent ? (
          <>
            <CheckCircle2 size={14} strokeWidth={2.2} /> Sent to GP
          </>
        ) : (
          <>
            <Send size={14} strokeWidth={2.2} /> Send to GP
          </>
        )}
      </button>
      <p className="mt-3 text-[11px] text-[var(--measured-subtext)]">
        Stage 8 wires this to React PDF and writes an audit row.
      </p>
    </Card>
  );
}
// Reference recipeById to keep the import live for future expansion of the
// patient detail recipe picker (Week 6+).
void recipeById;
