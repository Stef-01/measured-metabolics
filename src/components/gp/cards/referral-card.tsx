"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Smartphone } from "lucide-react";
import { toast } from "@/lib/hooks/use-toast";
import type { Patient, ReferralPriority, Cuisine } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

const CUISINES: { id: Cuisine; label: string }[] = [
  { id: "south_asian", label: "South Asian" },
  { id: "east_asian", label: "East Asian" },
  { id: "mediterranean", label: "Mediterranean" },
  { id: "anglo", label: "Anglo" },
  { id: "middle_eastern", label: "Middle Eastern" },
  { id: "latin_american", label: "Latin American" },
  { id: "african", label: "African" },
  { id: "other", label: "Other" },
];

const PRIORITIES: { id: ReferralPriority; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export function GpReferralCard({ patient }: { patient: Patient }) {
  const [reason, setReason] = useState(
    `${patient.conditions.join(", ")} with cultural fit ${patient.cuisineLabel}.`,
  );
  const [priority, setPriority] = useState<ReferralPriority>(
    patient.risk === "high" ? "high" : "medium",
  );
  const [cuisine, setCuisine] = useState<Cuisine>(patient.cuisine);
  const [sent, setSent] = useState(false);
  const [previewSms, setPreviewSms] = useState(false);

  const send = () => {
    setSent(true);
    toast.push({
      variant: "success",
      title: "Referral sent",
      body: `Maya gets it on her queue. Consent SMS sent to ${patient.firstName}.`,
      duration: 2400,
    });
  };

  const sms = `Hi ${patient.firstName}, Dr Lee has referred you to dietitian Maya Singh, APD via Measured. Reply YES to consent: measured.app/c/abc123`;

  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed text-[var(--measured-subtext)]">
        2-minute referral. Maya receives it instantly; consent SMS goes to{" "}
        {patient.firstName}.
      </p>

      <label className="block">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Reason
        </span>
        <textarea
          rows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 w-full resize-none rounded-xl border border-[var(--measured-border)] bg-white px-3 py-2 text-[13px] focus:border-[var(--measured-green)] focus:outline-none"
        />
      </label>

      <fieldset>
        <legend className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Cuisine fit
        </legend>
        <div className="mt-1 flex flex-wrap gap-1">
          {CUISINES.map((c) => (
            <motion.button
              type="button"
              key={c.id}
              onClick={() => setCuisine(c.id)}
              aria-pressed={cuisine === c.id}
              whileTap={{ scale: 0.91 }}
              transition={{ type: "spring", stiffness: 480, damping: 26 }}
              className={cn(
                "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                cuisine === c.id
                  ? "border-[var(--measured-green)] bg-[var(--measured-green)] text-white"
                  : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
              )}
            >
              {c.label}
            </motion.button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Priority
        </legend>
        <div className="mt-1 grid grid-cols-3 gap-1.5">
          {PRIORITIES.map((p) => (
            <motion.button
              type="button"
              key={p.id}
              onClick={() => setPriority(p.id)}
              aria-pressed={priority === p.id}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 480, damping: 26 }}
              className={cn(
                "rounded-lg border px-2 py-1.5 text-[12px] font-semibold transition-colors",
                priority === p.id
                  ? p.id === "high"
                    ? "border-[var(--measured-evaluate)] bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]"
                    : "border-[var(--measured-green)] bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                  : "border-[var(--measured-border)] bg-white text-[var(--measured-subtext)]",
              )}
            >
              {p.label}
            </motion.button>
          ))}
        </div>
      </fieldset>

      <motion.button
        type="button"
        onClick={() => setPreviewSms((s) => !s)}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--measured-border)] bg-white px-3 py-2 text-[12px] font-semibold text-[var(--measured-dark)]"
      >
        <Smartphone size={12} strokeWidth={2.2} aria-hidden="true" />
        {previewSms ? "Hide SMS preview" : "Preview consent SMS"}
      </motion.button>
      {previewSms && (
        <div className="rounded-xl bg-[var(--measured-cream)] p-3 text-[12px] leading-relaxed text-[var(--measured-dark)]">
          {sms}
        </div>
      )}

      <motion.button
        type="button"
        onClick={send}
        disabled={sent}
        whileTap={!sent ? { scale: 0.97 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] font-semibold",
          sent
            ? "cursor-default bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
            : "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
        )}
      >
        <Send size={14} strokeWidth={2.2} aria-hidden="true" />
        {sent ? "Referral sent" : "Send referral"}
      </motion.button>
    </div>
  );
}
