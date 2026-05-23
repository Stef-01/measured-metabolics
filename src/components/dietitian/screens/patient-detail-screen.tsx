"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ClipboardList,
  Activity,
  CalendarDays,
  FileText,
  MessageSquare,
  CheckCircle2,
  Send,
  Library,
  Sparkles,
  PlusCircle,
  RotateCcw,
  Receipt,
  ShieldCheck,
  Pencil,
} from "lucide-react";
import {
  ASHA_PLAN,
  CGM_BY_PATIENT,
  THREADS,
  findSameCuisinePlanFor,
} from "@/lib/mock";
import { mealsForPatient, pendingMeals } from "@/lib/mock/meals";
import { symptomsForPatient } from "@/lib/mock/symptoms";
import type {
  Patient,
  MealType,
  MealPlanItem,
  MealLog,
} from "@/lib/mock/types";
import type { DietitianRecipe } from "@/lib/mock/dietitian-recipes";
import { RecipePicker } from "@/components/dietitian/recipe-picker";
import { CgmMealChart } from "@/components/shared/cgm-meal-chart";
import { MealAnnotationDrawer } from "@/components/dietitian/meal-annotation-drawer";
import { GpBillingCard } from "@/components/gp/cards/billing-card";
import { useStoredAnnotations } from "@/lib/storage/patient-store";
import { mealImageBySlug } from "@/lib/images";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";

type TabId = "overview" | "cgm" | "plan" | "reports" | "billing" | "messages";

const TABS: { id: TabId; label: string; Icon: typeof ClipboardList }[] = [
  { id: "overview", label: "Overview", Icon: ClipboardList },
  { id: "cgm", label: "CGM + Meals", Icon: Activity },
  { id: "plan", label: "Plan", Icon: CalendarDays },
  { id: "reports", label: "Reports", Icon: FileText },
  { id: "billing", label: "Billing", Icon: Receipt },
  { id: "messages", label: "Messages", Icon: MessageSquare },
];

const DIETITIAN_NAME = "Maya Singh, APD";

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
  const annotations = useStoredAnnotations(patient.id);
  const [annotateMeal, setAnnotateMeal] = useState<MealLog | null>(null);

  const annotationByMealId = useMemo(() => {
    const map = new Map<string, (typeof annotations)[number]>();
    for (const a of annotations) map.set(a.mealId, a);
    return map;
  }, [annotations]);

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
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTab("plan")}
              className="cta-shadow inline-flex items-center gap-1.5 rounded-2xl bg-[var(--measured-green)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--measured-dark-green)]"
            >
              <CalendarDays size={14} strokeWidth={2.2} aria-hidden="true" />
              Build plan
            </button>
            <Link
              href={`/d/queue?patient=${patient.id}`}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark)] hover:bg-[var(--measured-cream)]"
            >
              <ClipboardList size={14} strokeWidth={2.2} aria-hidden="true" />
              Review meals
            </Link>
            <Link
              href={`/d/messages?patient=${patient.id}`}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-2 text-[13px] font-semibold text-[var(--measured-dark)] hover:bg-[var(--measured-cream)]"
            >
              <MessageSquare size={14} strokeWidth={2.2} aria-hidden="true" />
              Message
            </Link>
          </div>
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
                    <>
                      <p className="-mt-1 mb-2 text-[12px] text-[var(--measured-subtext)]">
                        Hover any spike to see the causal meal photo. Click a
                        spike to leave a note that lands on {patient.firstName}
                        &rsquo;s dashboard.
                      </p>
                      <CgmMealChart
                        readings={cgm.readings}
                        meals={meals}
                        annotations={annotations}
                        height={260}
                        onAnnotateMeal={setAnnotateMeal}
                      />
                    </>
                  ) : (
                    <p className="text-[13px] text-[var(--measured-subtext)]">
                      CGM not connected. Stage 6 will provision device pairing
                      via Inngest.
                    </p>
                  )}
                </Card>
                <Card title={`Recent meals (${meals.length})`}>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {meals.length === 0 && (
                      <li className="text-[13px] text-[var(--measured-subtext)]">
                        No meals logged yet.
                      </li>
                    )}
                    {meals.slice(0, 6).map((m) => {
                      const slug =
                        m.analysis.foods[0]?.name?.toLowerCase() ?? "";
                      const ann = annotationByMealId.get(m.id);
                      return (
                        <li
                          key={m.id}
                          className="overflow-hidden rounded-2xl border border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-card)]"
                        >
                          <button
                            type="button"
                            onClick={() => setAnnotateMeal(m)}
                            className="block w-full text-left transition-shadow hover:shadow-[var(--shadow-raised)] focus:outline-none focus:ring-2 focus:ring-[var(--measured-green)]/40"
                          >
                            <div className="relative h-44 w-full bg-[var(--measured-cream)]">
                              <Image
                                src={mealImageBySlug(slug)}
                                alt={m.analysis.dietitianSummary}
                                fill
                                sizes="(min-width: 640px) 280px, 100vw"
                                className="object-cover"
                              />
                              <span
                                className={cn(
                                  "absolute left-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur",
                                  m.reviewStatus === "approved"
                                    ? "bg-[var(--measured-green)]/85 text-white"
                                    : m.reviewStatus === "flagged"
                                      ? "bg-[var(--measured-evaluate)]/85 text-white"
                                      : "bg-[var(--measured-clinical-amber)]/85 text-white",
                                )}
                              >
                                {m.reviewStatus.replace("_", " ")}
                              </span>
                              {ann && (
                                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--measured-clinical-blue)]/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                                  <Pencil
                                    size={10}
                                    strokeWidth={2.4}
                                    aria-hidden="true"
                                  />
                                  Note sent
                                </span>
                              )}
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pt-6 pb-2 text-white">
                                <div className="text-[10px] font-semibold uppercase tracking-wider opacity-90">
                                  {m.mealType} ·{" "}
                                  {new Date(m.eatenAt).toLocaleString([], {
                                    weekday: "short",
                                    hour: "numeric",
                                  })}
                                </div>
                                <div className="text-[14px] font-semibold leading-tight">
                                  {m.analysis.foods
                                    .slice(0, 2)
                                    .map((f) => f.name)
                                    .join(" + ")}
                                </div>
                              </div>
                            </div>
                            <div className="px-3 py-2 text-[13px] text-[var(--measured-dark)]">
                              <div className="flex items-center justify-between text-[11px] text-[var(--measured-subtext)]">
                                <span>
                                  Peak Δ{" "}
                                  {m.analysis.cgmPeakDeltaMmol?.toFixed(1) ??
                                    "?"}{" "}
                                  mmol/L
                                </span>
                                <span className="inline-flex items-center gap-1 text-[var(--measured-dark-green)]">
                                  <Pencil
                                    size={11}
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                  />
                                  {ann ? "Edit note" : "Add note"}
                                </span>
                              </div>
                              <p className="mt-1 line-clamp-2 leading-snug">
                                {m.analysis.dietitianSummary}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
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

            {tab === "billing" && (
              <div className="grid gap-3">
                <div className="surface-card flex items-start gap-3 border-l-4 border-[var(--measured-clinical-blue)] p-4">
                  <ShieldCheck
                    size={18}
                    strokeWidth={2.2}
                    className="mt-0.5 shrink-0 text-[var(--measured-clinical-blue)]"
                    aria-hidden="true"
                  />
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
                      Read-only · shared by GP for context
                    </div>
                    <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--measured-dark)]">
                      Billing intelligence is owned by the GP. This view shows
                      what they can see so allied health knows which MBS pathway
                      is funding this episode of care. Items aren&rsquo;t
                      auto-claimed — the GP verifies and submits.
                    </p>
                  </div>
                </div>
                <GpBillingCard patient={patient} variant="dietitian" />
              </div>
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

      <MealAnnotationDrawer
        open={annotateMeal !== null}
        meal={annotateMeal}
        patientId={patient.id}
        patientFirstName={patient.firstName}
        dietitianName={DIETITIAN_NAME}
        existing={
          annotateMeal ? annotationByMealId.get(annotateMeal.id) : undefined
        }
        onClose={() => setAnnotateMeal(null)}
      />
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

const MEAL_LABEL: Record<MealType, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

const EMPTY_PLAN_ITEMS: MealPlanItem[] = [
  {
    mealType: "breakfast",
    title: "",
    description: "",
    rationale: "",
  },
  {
    mealType: "lunch",
    title: "",
    description: "",
    rationale: "",
  },
  {
    mealType: "dinner",
    title: "",
    description: "",
    rationale: "",
  },
  {
    mealType: "snack",
    title: "",
    description: "",
    rationale: "",
  },
];

function PlanBuilder({ patient }: { patient: Patient }) {
  const isAsha = patient.id === "asha";
  const [items, setItems] = useState<MealPlanItem[]>(
    isAsha ? ASHA_PLAN.items : EMPTY_PLAN_ITEMS,
  );
  const [approved, setApproved] = useState(isAsha);
  const [pickerSlot, setPickerSlot] = useState<number | null>(null);

  const sibling = useMemo(
    () => findSameCuisinePlanFor(patient.id),
    [patient.id],
  );

  const update = (idx: number, patch: Partial<MealPlanItem>) => {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)),
    );
    setApproved(false);
  };

  const applyRecipe = (idx: number, recipe: DietitianRecipe) => {
    update(idx, {
      title: recipe.title,
      description: recipe.ingredients.slice(0, 3).join(" · "),
      rationale: recipe.why,
    });
    toast.push({
      variant: "success",
      title: `${recipe.title} added to ${MEAL_LABEL[items[idx].mealType]}`,
      duration: 1800,
    });
  };

  const cloneFromSibling = () => {
    if (!sibling) return;
    setItems(sibling.plan.items.map((it) => ({ ...it })));
    setApproved(false);
    toast.push({
      variant: "success",
      title: `Copied ${sibling.sourcePatientName}'s plan as draft`,
      duration: 2200,
    });
  };

  const reset = () => {
    setItems(isAsha ? ASHA_PLAN.items : EMPTY_PLAN_ITEMS);
    setApproved(isAsha);
  };

  const approve = () => {
    setApproved(true);
    toast.push({
      variant: "success",
      title: `Plan approved for ${patient.firstName}`,
      duration: 2000,
    });
  };

  const isEmpty = items.every((it) => !it.title);

  return (
    <div className="grid gap-4">
      {sibling && isEmpty && (
        <section className="surface-card relative overflow-hidden border-l-4 border-[var(--measured-green)] p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-dark-green)]">
                <Sparkles size={12} strokeWidth={2.4} aria-hidden="true" />
                Same-cuisine precedent
              </div>
              <h3 className="mt-1.5 font-serif text-[19px] leading-tight text-[var(--measured-dark)]">
                You already wrote a {patient.cuisineLabel} plan for{" "}
                {sibling.sourcePatientName}
              </h3>
              <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
                Copy it as a draft for {patient.firstName}, then adjust per
                their conditions ({patient.conditions.join(" · ")}).
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link
                href={`/d/patients/${sibling.sourcePatientId}`}
                className="inline-flex items-center rounded-xl border border-[var(--measured-border)] bg-white px-3 py-1.5 text-[12px] font-semibold text-[var(--measured-dark)] hover:bg-[var(--measured-cream)]"
              >
                Open source
              </Link>
              <button
                type="button"
                onClick={cloneFromSibling}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--measured-green)] px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-[var(--measured-dark-green)]"
              >
                <PlusCircle size={14} strokeWidth={2.2} aria-hidden="true" />
                Copy as draft
              </button>
            </div>
          </div>
        </section>
      )}

      <Card title="Meal plan builder">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-[12px] text-[var(--measured-subtext)]">
          <span>
            Cuisine{" "}
            <span className="font-semibold text-[var(--measured-dark)]">
              {patient.cuisineLabel}
            </span>{" "}
            · 4 meal slots
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]"
          >
            <RotateCcw size={11} strokeWidth={2.2} aria-hidden="true" />
            Reset
          </button>
        </div>
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div
              key={it.mealType}
              className="rounded-xl border border-[var(--measured-border-soft)] bg-[var(--measured-cream)] p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                  {MEAL_LABEL[it.mealType]}
                </div>
                <button
                  type="button"
                  onClick={() => setPickerSlot(idx)}
                  className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)] ring-1 ring-[var(--measured-border)] hover:bg-[var(--measured-green)]/5"
                >
                  <Library size={11} strokeWidth={2.2} aria-hidden="true" />
                  Pick from library
                </button>
              </div>
              <input
                type="text"
                value={it.title}
                onChange={(e) => update(idx, { title: e.target.value })}
                placeholder={`${MEAL_LABEL[it.mealType]} title`}
                className="mt-1 w-full bg-transparent text-[15px] font-semibold text-[var(--measured-dark)] placeholder:text-[var(--measured-subtext)]/60 focus:outline-none"
              />
              <textarea
                rows={1}
                value={it.description}
                onChange={(e) => update(idx, { description: e.target.value })}
                placeholder="Description for the patient"
                className="mt-1 w-full resize-none bg-transparent text-[13px] leading-relaxed text-[var(--measured-dark)] placeholder:text-[var(--measured-subtext)]/60 focus:outline-none"
              />
              <input
                type="text"
                value={it.rationale ?? ""}
                onChange={(e) => update(idx, { rationale: e.target.value })}
                placeholder="Rationale (one line)"
                className="mt-1 w-full bg-transparent text-[12px] italic text-[var(--measured-dark-green)] placeholder:text-[var(--measured-subtext)] focus:outline-none"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={approve}
          disabled={approved || isEmpty}
          className={cn(
            "mt-4 inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-[13px] font-semibold",
            approved
              ? "cursor-default bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
              : isEmpty
                ? "cursor-not-allowed bg-[var(--measured-cream)] text-[var(--measured-subtext)]"
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

      <RecipePicker
        open={pickerSlot !== null}
        dietitianId={patient.assignedDietitianId}
        patientCuisine={patient.cuisine}
        mealTypeFilter={pickerSlot !== null ? items[pickerSlot].mealType : null}
        onClose={() => setPickerSlot(null)}
        onPick={(r) => {
          if (pickerSlot !== null) applyRecipe(pickerSlot, r);
        }}
      />
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
