"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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

const SEVERITY_CHIPS: { id: SymptomSeverity; label: string }[] = [
  { id: "none", label: "None" },
  { id: "mild", label: "Mild" },
  { id: "severe", label: "Severe" },
];

const SEVERITY_QUESTIONS: ChipQuestion[] = [
  { id: "nausea", prompt: "Nausea today?" },
  { id: "constipation", prompt: "Constipation today?" },
];

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
    if (!escalateBecauseOf) {
      // give the success state a beat, then bounce home
      setTimeout(() => router.push("/p/home"), 1100);
    }
  };

  return (
    <>
      <PatientAppHeader eyebrow="Quick check" title="How are you?" />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8">
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
            <fieldset key={q.id} className="surface-card p-4">
              <legend className="px-1 text-[12px] font-medium uppercase tracking-wider text-[var(--measured-subtext)]">
                {q.prompt}
              </legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {SEVERITY_CHIPS.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setValue(c.id)}
                    aria-pressed={value === c.id}
                    className={cn(
                      "rounded-xl border px-3 py-3 text-[13px] font-semibold transition-colors",
                      value === c.id
                        ? c.id === "severe"
                          ? "border-[var(--measured-evaluate)] bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]"
                          : "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                        : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}

        <fieldset className="surface-card p-4">
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
              <button
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
              >
                {c.label}
              </button>
            ))}
          </div>
        </fieldset>

        <ToggleRow
          label="Any hypo symptoms (shaky, dizzy)?"
          checked={hypoSymptoms}
          onChange={setHypoSymptoms}
          dangerOnTrue
        />
        <ToggleRow
          label="Took medication as planned?"
          checked={medsAsPlanned}
          onChange={setMedsAsPlanned}
        />

        {!submitted ? (
          <button
            type="button"
            onClick={submit}
            className="cta-shadow inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-5 py-4 font-semibold text-white"
          >
            Save check-in
          </button>
        ) : !escalateBecauseOf ? (
          <div className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)]/10 px-5 py-4 text-[13px] font-semibold text-[var(--measured-dark-green)]">
            <CheckCircle2 size={18} strokeWidth={2.2} aria-hidden="true" />
            Logged · returning to home
          </div>
        ) : null}

        {!submitted && (
          <Link
            href="/p/home"
            className="text-center text-[13px] text-[var(--measured-subtext)]"
          >
            Skip for now
          </Link>
        )}
      </div>
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
            : "bg-[var(--measured-input-bg)] text-[var(--measured-subtext)]",
        )}
      >
        {checked ? "Yes" : "No"}
      </span>
    </button>
  );
}
