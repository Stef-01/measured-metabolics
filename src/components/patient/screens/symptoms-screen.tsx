"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { EscalationCard } from "@/components/patient/escalation-card";
import { patientStore } from "@/lib/storage/patient-store";
import { CURRENT_PATIENT_ID } from "@/lib/mock";
import type { SymptomLog, SymptomSeverity } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

interface ChipQuestion {
  id: keyof Pick<SymptomLog, "nausea" | "constipation">;
  prompt: string;
}

const SEVERITY_CHIPS: {
  id: SymptomSeverity;
  label: string;
  dot: string;
  selected: string;
}[] = [
  {
    id: "none",
    label: "None",
    dot: "bg-[var(--measured-green)]",
    selected:
      "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
  },
  {
    id: "mild",
    label: "Mild",
    dot: "bg-[var(--measured-clinical-amber)]",
    selected:
      "border-[var(--measured-clinical-amber)] bg-[var(--measured-clinical-amber)]/10 text-[var(--measured-clinical-amber)]",
  },
  {
    id: "severe",
    label: "Severe",
    dot: "bg-[var(--measured-evaluate)]",
    selected:
      "border-[var(--measured-evaluate)] bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  },
];

const SEVERITY_QUESTIONS: ChipQuestion[] = [
  { id: "nausea", prompt: "Nausea today?" },
  { id: "constipation", prompt: "Constipation today?" },
];

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];
const fieldsetItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease } },
};
const fieldsetContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

export function PatientSymptomsScreen() {
  const router = useRouter();
  const [nausea, setNausea] = useState<SymptomSeverity>("none");
  const [constipation, setConstipation] = useState<SymptomSeverity>("none");
  const [appetite, setAppetite] = useState<SymptomLog["appetite"]>("normal");
  const [hypoSymptoms, setHypoSymptoms] = useState(false);
  const [medsAsPlanned, setMedsAsPlanned] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const escalateBecauseOf =
    nausea === "severe" || constipation === "severe" || hypoSymptoms;

  const submit = () => {
    const log: SymptomLog = {
      id: `sym-${Date.now()}`,
      patientId: CURRENT_PATIENT_ID,
      loggedAt: new Date().toISOString(),
      nausea,
      constipation,
      appetite,
      hypoSymptoms,
      medsAsPlanned,
    };
    patientStore.addSymptom(CURRENT_PATIENT_ID, log);
    setSubmitted(true);

    if (escalateBecauseOf) {
      const parts: string[] = [];
      if (nausea === "severe") parts.push("severe nausea");
      if (constipation === "severe") parts.push("severe constipation");
      if (hypoSymptoms) parts.push("hypo symptoms (shaky/dizzy)");
      void fetch("/api/escalate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_id: CURRENT_PATIENT_ID,
          symptoms: parts.join(", "),
        }),
      }).catch(() => {});
    } else {
      setTimeout(() => router.push("/p/home"), 1100);
    }
  };

  return (
    <>
      <PatientAppHeader eyebrow="Quick check" title="How are you?" />

      <motion.div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8" variants={fieldsetContainer} initial="hidden" animate="show">
        <AnimatePresence>
          {submitted && escalateBecauseOf && (
            <motion.div
              key="escalate"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <EscalationCard
                dietitianName="Maya"
                reason="That sounds severe — Maya should know now so she can adjust your plan or check medication."
                href="/p/messages"
                cta="Message Maya"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {SEVERITY_QUESTIONS.map((q) => {
          const value = q.id === "nausea" ? nausea : constipation;
          const setValue = q.id === "nausea" ? setNausea : setConstipation;
          return (
            <motion.fieldset key={q.id} variants={fieldsetItem} className="surface-card p-4">
              <legend className="px-1 text-[13px] font-medium text-[var(--measured-dark)]">
                {q.prompt}
              </legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {SEVERITY_CHIPS.map((c) => (
                  <motion.button
                    type="button"
                    key={c.id}
                    onClick={() => setValue(c.id)}
                    aria-pressed={value === c.id}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3.5 text-[13px] font-semibold transition-all",
                      value === c.id
                        ? c.selected
                        : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
                    )}
                    whileTap={{ scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "h-2 w-2 rounded-full transition-colors",
                        value === c.id ? c.dot : "bg-[var(--measured-border)]",
                      )}
                    />
                    {c.label}
                  </motion.button>
                ))}
              </div>
            </motion.fieldset>
          );
        })}

        <motion.fieldset variants={fieldsetItem} className="surface-card p-4">
          <legend className="px-1 text-[12px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
            Appetite today?
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(
              [
                { id: "lower", label: "Lower" },
                { id: "normal", label: "Normal" },
                { id: "higher", label: "Higher" },
              ] as { id: SymptomLog["appetite"]; label: string }[]
            ).map((c) => (
              <motion.button
                type="button"
                key={c.id}
                onClick={() => setAppetite(c.id)}
                aria-pressed={appetite === c.id}
                className={cn(
                  "rounded-xl border px-3 py-3 text-[13px] font-semibold transition-colors",
                  appetite === c.id
                    ? "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                    : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
                )}
                whileTap={{ scale: 0.93 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
              >
                {c.label}
              </motion.button>
            ))}
          </div>
        </motion.fieldset>

        <motion.div variants={fieldsetItem}><ToggleRow
          label="Any hypo symptoms (shaky, dizzy)?"
          checked={hypoSymptoms}
          onChange={setHypoSymptoms}
          dangerOnTrue
        /></motion.div>
        <motion.div variants={fieldsetItem}><ToggleRow
          label="Took medication as planned?"
          checked={medsAsPlanned}
          onChange={setMedsAsPlanned}
        /></motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.button
              key="submit"
              type="button"
              onClick={submit}
              className="cta-shadow inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-4 font-semibold text-white"
              variants={fieldsetItem}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              Save check-in
            </motion.button>
          ) : !escalateBecauseOf ? (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              className="flex flex-col items-center gap-2 rounded-3xl bg-[var(--measured-green)] px-5 py-5 text-center text-white shadow-[0_4px_20px_-4px_rgba(45,90,61,0.35)]"
            >
              <CheckCircle2 size={28} strokeWidth={2} aria-hidden="true" />
              <div className="text-[15px] font-semibold">Check-in logged</div>
              <div className="text-[12px] text-white/75">Returning to home…</div>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {!submitted && (
          <Link
            href="/p/home"
            className="text-center text-[13px] text-[var(--measured-subtext)]"
          >
            Skip for now
          </Link>
        )}
      </motion.div>
    </>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
  dangerOnTrue,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  dangerOnTrue?: boolean;
}) {
  const isDanger = dangerOnTrue && checked;
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-[14px] transition-colors",
        isDanger
          ? "border-[var(--measured-evaluate)] bg-[var(--measured-evaluate)]/5 text-[var(--measured-evaluate)]"
          : checked
            ? "border-[var(--measured-green)] bg-[var(--measured-green)]/5 text-[var(--measured-dark-green)]"
            : "border-[var(--measured-border)] bg-white text-[var(--measured-dark)]",
      )}
    >
      <span className="font-medium">{label}</span>
      <span
        className={cn(
          "rounded-full px-3 py-1 text-[12px] font-semibold uppercase tracking-wider",
          checked
            ? isDanger
              ? "bg-[var(--measured-evaluate)] text-white"
              : "bg-[var(--measured-green)] text-white"
            : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
        )}
      >
        {checked ? "Yes" : "No"}
      </span>
    </button>
  );
}
