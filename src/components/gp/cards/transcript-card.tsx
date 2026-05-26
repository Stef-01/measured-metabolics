"use client";

import { useState } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";
import type { Patient } from "@/lib/mock/types";

interface SoapDraft {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  confidence: number;
  requiresReview?: boolean;
}

interface ClinicalInsights {
  detected_conditions: { name: string; evidence: string }[];
  referral_intent: string;
  possible_mbs_prompts: string[];
  rationale: string;
}

const SOAP_CONFIG = [
  {
    key: "subjective" as const,
    letter: "S",
    label: "Subjective",
    bg: "bg-[var(--measured-clinical-blue)]/8",
    ring: "ring-[var(--measured-clinical-blue)]/25",
    text: "text-[var(--measured-clinical-blue)]",
  },
  {
    key: "objective" as const,
    letter: "O",
    label: "Objective",
    bg: "bg-[var(--measured-clinical-blue)]/5",
    ring: "ring-[var(--measured-clinical-blue)]/15",
    text: "text-[var(--measured-clinical-blue)]",
  },
  {
    key: "assessment" as const,
    letter: "A",
    label: "Assessment",
    bg: "bg-[var(--measured-clinical-amber)]/8",
    ring: "ring-[var(--measured-clinical-amber)]/25",
    text: "text-[var(--measured-clinical-amber)]",
  },
  {
    key: "plan" as const,
    letter: "P",
    label: "Plan",
    bg: "bg-[var(--measured-green)]/8",
    ring: "ring-[var(--measured-green)]/25",
    text: "text-[var(--measured-dark-green)]",
  },
] as const;

export function GpTranscriptCard({ patient }: { patient: Patient }) {
  const [text, setText] = useState("");
  const [draft, setDraft] = useState<SoapDraft | null>(null);
  const [insights, setInsights] = useState<ClinicalInsights | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    if (!text.trim()) return;
    setAnalyzing(true);
    setInsights(null);
    try {
      const context = `${patient.firstName} ${patient.lastName}, ${patient.age}yo. Conditions: ${patient.conditions.join(", ")}. Meds: ${patient.meds.join(", ") || "nil"}. HbA1c ${patient.hbA1cPct}%, TIR ${patient.timeInRangePct}%.`;

      const [soapRes, insightsRes] = await Promise.allSettled([
        fetch("/api/ai/soap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text, context }),
        }),
        fetch("/api/ai/transcript-analysis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: text, context }),
        }),
      ]);

      if (soapRes.status === "fulfilled" && soapRes.value.ok) {
        const data = (await soapRes.value.json()) as {
          subjective: string;
          objective: string;
          assessment: string;
          plan: string;
          confidence_score: number;
          requires_human_review?: boolean;
        };
        setDraft({
          subjective: data.subjective,
          objective: data.objective,
          assessment: data.assessment,
          plan: data.plan,
          confidence: data.confidence_score,
          requiresReview: data.requires_human_review ?? false,
        });
      } else {
        setDraft(stubAnalyze(text, patient));
      }

      if (insightsRes.status === "fulfilled" && insightsRes.value.ok) {
        const data = (await insightsRes.value.json()) as ClinicalInsights;
        if (
          data.detected_conditions?.length > 0 ||
          data.possible_mbs_prompts?.length > 0
        ) {
          setInsights(data);
        }
      }
    } catch {
      setDraft(stubAnalyze(text, patient));
    } finally {
      setAnalyzing(false);
    }
  };

  const copy = async () => {
    if (!draft) return;
    const out = `S: ${draft.subjective}\nO: ${draft.objective}\nA: ${draft.assessment}\nP: ${draft.plan}`;
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
      toast.push({
        variant: "success",
        title: "SOAP copied",
        body: "Paste into MD or BP.",
        duration: 1400,
      });
    } catch {
      toast.push({
        variant: "info",
        title: "Copy unavailable",
        body: "Select the text manually.",
        duration: 1800,
      });
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-[12px] leading-relaxed text-[var(--measured-subtext)]">
        Paste the consult transcript. Returns a SOAP draft ready to drop into MD
        or BP.
      </p>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Paste transcript for ${patient.firstName}…`}
        className="w-full resize-y rounded-2xl border border-[var(--measured-border)] bg-white px-3 py-2.5 text-[13px] focus:border-[var(--measured-green)] focus:outline-none"
      />
      <button
        type="button"
        onClick={analyze}
        disabled={analyzing || !text.trim()}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[13px] font-semibold",
          analyzing || !text.trim()
            ? "cursor-not-allowed bg-[var(--measured-green)]/40 text-white"
            : "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]",
        )}
      >
        <Sparkles size={14} strokeWidth={2.2} aria-hidden="true" />
        {analyzing ? "Analyzing…" : "Analyze transcript"}
      </button>

      {draft && (
        <div className="space-y-2 overflow-hidden rounded-xl border border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-card)]">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--measured-border-soft)] px-3 py-2">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
              SOAP draft
            </div>
            <div className="flex items-center gap-1.5">
              {draft.requiresReview && (
                <span className="rounded-full bg-[var(--measured-evaluate)]/10 px-2 py-0.5 text-[10px] font-bold text-[var(--measured-evaluate)]">
                  Review required
                </span>
              )}
              <span className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-bold text-[var(--measured-subtext)]">
                {Math.round(draft.confidence * 100)}%
              </span>
            </div>
          </div>

          {/* SOAP sections — each with a distinct coloured block */}
          <div className="space-y-1.5 px-3 pb-3">
            {SOAP_CONFIG.map((cfg) => (
              <div
                key={cfg.key}
                className={cn(
                  "flex items-start gap-2.5 rounded-xl p-2.5 ring-1",
                  cfg.bg,
                  cfg.ring,
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
                    cfg.text,
                    "bg-white/60",
                  )}
                >
                  {cfg.letter}
                </span>
                <p className="flex-1 text-[12px] leading-relaxed text-[var(--measured-dark)]">
                  {draft[cfg.key]}
                </p>
              </div>
            ))}
          </div>

          {/* Copy button */}
          <div className="border-t border-[var(--measured-border-soft)] px-3 py-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--measured-green)] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[var(--measured-dark-green)]"
            >
              {copied ? (
                <>
                  <Check size={13} strokeWidth={2.4} aria-hidden="true" />
                  Copied to clipboard
                </>
              ) : (
                <>
                  <Copy size={13} strokeWidth={2.2} aria-hidden="true" />
                  Copy SOAP note
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {insights && (
        <div className="space-y-2 rounded-xl border border-[var(--measured-border-soft)] bg-[var(--measured-clinical-blue)]/5 p-3 text-[12px]">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-blue)]">
            Clinical insights
          </div>
          {insights.detected_conditions.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold text-[var(--measured-subtext)]">
                Detected
              </div>
              <ul className="space-y-1">
                {insights.detected_conditions.map((c, i) => (
                  <li
                    key={i}
                    className="leading-relaxed text-[var(--measured-dark)]"
                  >
                    <span className="font-semibold">{c.name}</span>
                    {c.evidence ? (
                      <span className="ml-1 text-[var(--measured-subtext)]">
                        — &ldquo;{c.evidence}&rdquo;
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {insights.referral_intent !== "none" && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-semibold text-[var(--measured-subtext)]">
                Referral intent:
              </span>
              <span className="rounded-full bg-[var(--measured-clinical-blue)]/15 px-2 py-0.5 text-[10px] font-semibold capitalize text-[var(--measured-clinical-blue)]">
                {insights.referral_intent}
              </span>
            </div>
          )}
          {insights.possible_mbs_prompts.length > 0 && (
            <div>
              <div className="mb-1 text-[10px] font-semibold text-[var(--measured-subtext)]">
                Possible MBS
              </div>
              <div className="flex flex-wrap gap-1">
                {insights.possible_mbs_prompts.map((item, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold text-[var(--measured-dark)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function stubAnalyze(text: string, patient: Patient): SoapDraft {
  const lower = text.toLowerCase();
  const subjective = lower.includes("nausea")
    ? "Patient reports persistent nausea, particularly after dinner."
    : `Patient reports follow-up for ${patient.conditions.join(", ").toLowerCase()}.`;
  const objective =
    `HbA1c ${patient.hbA1cPct}%, weight ${patient.weightKg.toFixed(1)} kg, ${patient.timeInRangePct}% time-in-range. ${patient.bp ? `BP ${patient.bp.systolic}/${patient.bp.diastolic}.` : ""}`.trim();
  const assessment =
    patient.alerts.length > 0
      ? `${patient.conditions[0]} with ${patient.alerts.join("; ").toLowerCase()}.`
      : `${patient.conditions[0]} stable on current regimen.`;
  const plan =
    lower.includes("rice") || patient.cuisine === "south_asian"
      ? "Continue current dose; reinforce dinner-rice substitution; review HbA1c in 6 weeks."
      : "Continue current plan; review symptoms in 4 weeks; repeat metabolic panel.";
  return {
    subjective,
    objective,
    assessment,
    plan,
    confidence: 0.78,
    requiresReview: false,
  };
}
