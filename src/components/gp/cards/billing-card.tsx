"use client";

import { useState } from "react";
import {
  BrainCircuit,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  ExternalLink,
  FileSearch,
  Receipt,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";
import {
  billingDeepDiveForPatient,
  billingFeaturePhases,
  billingSuggestionsForPatient,
  type BillingIntelligenceSuggestion,
} from "@/lib/mock/billing-suggestions";
import type { Patient } from "@/lib/mock/types";
import type { BillingSuggestionItem } from "@/ai/schemas";

const STANCE_LABEL: Record<BillingIntelligenceSuggestion["stance"], string> = {
  candidate: "Candidate",
  "needs-review": "Needs review",
  defer: "Defer",
};

const STANCE_TONE: Record<BillingIntelligenceSuggestion["stance"], string> = {
  candidate: "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
  "needs-review":
    "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  defer: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
};

function isMbsItem(item: string): boolean {
  return item.startsWith("MBS ");
}

const EVIDENCE_KIND_LABEL: Record<
  BillingSuggestionItem["evidence"][number]["kind"],
  string
> = {
  message: "Message",
  symptom: "Symptom",
  meal: "Meal",
  referral: "Referral",
  care_plan: "Care plan",
  report: "Report",
};

interface GpBillingCardProps {
  patient: Patient;
  /**
   * `gp` (default) shows the full billing-action toolset.
   * `dietitian` renders the same intelligence read-only — copy + task
   * actions are hidden because allied health doesn't bill these items.
   */
  variant?: "gp" | "dietitian";
}

export function GpBillingCard({ patient, variant = "gp" }: GpBillingCardProps) {
  const items = billingSuggestionsForPatient(patient);
  const deepDive = billingDeepDiveForPatient(patient);
  const phases = billingFeaturePhases();
  const [expanded, setExpanded] = useState<string | null>(
    items[0]?.item ?? null,
  );
  const [aiOpen, setAiOpen] = useState(true);
  const [scanning, setScanning] = useState(false);
  const readOnly = variant === "dietitian";

  const triggerScan = async () => {
    setScanning(true);
    try {
      await fetch("/api/billing/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: patient.id }),
      });
      toast.push({
        variant: "success",
        title: "Background scan queued",
        body: "Audit record will be written when the worker completes.",
        duration: 2200,
      });
    } catch {
      toast.push({
        variant: "info",
        title: "Scan logged (demo mode)",
        body: "Inngest not reachable; deterministic result shown above.",
        duration: 2200,
      });
    } finally {
      setScanning(false);
    }
  };

  const copy = (h: BillingIntelligenceSuggestion) => {
    const text = `${h.item} ${h.service}\n\n${h.documentationDraft}`;
    const clipboard = navigator.clipboard;
    if (!clipboard) {
      toast.push({
        variant: "info",
        title: "Clipboard unavailable",
        body: "Open the item and copy the clinic-note draft manually.",
        duration: 2600,
      });
      return;
    }

    clipboard.writeText(text).then(
      () => {
        toast.push({
          variant: "info",
          title: `${h.item} copied`,
          duration: 1400,
        });
      },
      () => {
        toast.push({
          variant: "info",
          title: "Clipboard unavailable",
          body: "Open the item and copy the clinic-note draft manually.",
          duration: 2600,
        });
      },
    );
  };

  const createTask = (h: BillingIntelligenceSuggestion) => {
    toast.push({
      variant: "success",
      title: `Task created: verify ${h.item}`,
      body: "Demo task only. Phase 5 writes this to the GP task list.",
      duration: 2200,
    });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]">
            <BrainCircuit size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-[19px] leading-tight text-[var(--measured-dark)]">
                Billing intelligence scan
              </h2>
              <span className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                Phase 2 local scan
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
              Deterministic Australian Medicare candidates from conditions,
              symptoms, dietitian thread, referral context, and meal patterns.
              Never auto-claimed; GP verification remains mandatory.
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <ScanPill Icon={FileSearch} label="5 data sources" />
          <ScanPill Icon={ShieldAlert} label="Needs GP verification" />
          <ScanPill Icon={Sparkles} label={`${items.length} candidates`} />
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={triggerScan}
            disabled={scanning}
            className={cn(
              "mt-3 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-semibold",
              scanning
                ? "cursor-not-allowed bg-[var(--measured-green)]/30 text-white"
                : "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)] hover:bg-[var(--measured-green)]/20",
            )}
          >
            <Sparkles size={11} strokeWidth={2.2} aria-hidden="true" />
            {scanning ? "Queuing…" : "Queue background scan"}
          </button>
        )}
      </section>

      <ul className="space-y-2">
        {items.map((h) => {
          const isOpen = expanded === h.item;
          return (
            <li
              key={h.item}
              className="rounded-xl border border-[var(--measured-border-soft)] bg-white text-[12px]"
            >
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : h.item)}
                className="flex w-full items-start justify-between gap-3 px-3 py-2.5 text-left"
                aria-expanded={isOpen}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                        isMbsItem(h.item)
                          ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                          : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
                      )}
                    >
                      {h.item}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                        STANCE_TONE[h.stance],
                      )}
                    >
                      {STANCE_LABEL[h.stance]}
                    </span>
                    <span className="font-semibold text-[var(--measured-dark)]">
                      {h.service}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[var(--measured-subtext)]">
                    {Math.round(h.confidence * 100)}% confidence
                    {h.stance !== "defer" &&
                      h.estimatedRebateAud > 0 &&
                      ` · est. rebate $${h.estimatedRebateAud.toFixed(2)}`}
                  </div>
                  <p className="mt-1 text-[var(--measured-dark)]">{h.whyNow}</p>
                </div>
                {isOpen ? (
                  <ChevronUp
                    size={14}
                    className="text-[var(--measured-subtext)]"
                    aria-hidden="true"
                  />
                ) : (
                  <ChevronDown
                    size={14}
                    className="text-[var(--measured-subtext)]"
                    aria-hidden="true"
                  />
                )}
              </button>
              {isOpen && (
                <div className="space-y-3 border-t border-[var(--measured-border-soft)] px-3 py-2.5">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      Rationale
                    </div>
                    <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
                      {h.rationale}
                    </p>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      Evidence found
                    </div>
                    <ul className="mt-1 space-y-1.5">
                      {h.evidence.map((e, idx) => (
                        <li
                          key={`${h.item}-${e.kind}-${e.label}-${idx}`}
                          className="rounded-lg bg-[var(--measured-cream)] px-2.5 py-2"
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                            {e.label}
                          </div>
                          <blockquote className="mt-0.5 leading-relaxed text-[var(--measured-dark)]">
                            &ldquo;{e.quote}&rdquo;
                          </blockquote>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                    Still needs
                  </div>
                  <ul className="mt-1 space-y-0.5">
                    {h.missingPrerequisites.map((n) => (
                      <li key={n} className="text-[var(--measured-dark)]">
                        · {n}
                      </li>
                    ))}
                  </ul>

                  {h.documentationRequirements &&
                    h.documentationRequirements.length > 0 && (
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                          Documentation requirements
                        </div>
                        <ul className="mt-1 space-y-0.5">
                          {h.documentationRequirements.map((requirement) => (
                            <li
                              key={requirement}
                              className="text-[var(--measured-dark)]"
                            >
                              · {requirement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="rounded-lg border border-[var(--measured-border-soft)] bg-white px-2.5 py-2">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                      Clinic-note draft
                    </div>
                    <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
                      {h.documentationDraft}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {!readOnly && (
                      <>
                        <button
                          type="button"
                          onClick={() => copy(h)}
                          className={cn(
                            "inline-flex items-center gap-1 rounded-lg bg-[var(--measured-green)]/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark-green)]",
                          )}
                        >
                          <Receipt
                            size={12}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                          Copy justification
                        </button>
                        <button
                          type="button"
                          onClick={() => createTask(h)}
                          className="inline-flex items-center gap-1 rounded-lg bg-[var(--measured-cream)] px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark)]"
                        >
                          <ClipboardList
                            size={12}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                          Create verification task
                        </button>
                      </>
                    )}
                    {h.officialSourceUrl && (
                      <a
                        href={h.officialSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-[var(--measured-cream)] px-2.5 py-1 text-[11px] font-semibold text-[var(--measured-dark)]"
                      >
                        MBS source
                        <ExternalLink
                          size={11}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </a>
                    )}
                  </div>
                  {h.sourceLastReviewedAt && (
                    <p className="text-[10px] text-[var(--measured-subtext)]">
                      MBS source last reviewed {h.sourceLastReviewedAt}. GP must
                      verify against live Medicare guidance before billing.
                    </p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <section className="rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)]">
        <button
          type="button"
          onClick={() => setAiOpen((open) => !open)}
          className="flex w-full items-start gap-3 text-left"
          aria-expanded={aiOpen}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--measured-evaluate)]/15 text-[var(--measured-evaluate)]">
            <Sparkles size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-serif text-[17px] leading-tight text-[var(--measured-dark)]">
                AI conversation deep dive
              </h3>
              <span className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                Phase 4 simulator
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--measured-clinical-amber)]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-clinical-amber)]">
                <ShieldCheck size={10} strokeWidth={2.4} aria-hidden="true" />
                {deepDive.requires_human_review
                  ? "GP review required"
                  : "GP review"}
              </span>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
              Verbatim citations from messages, symptoms, meals, referral, and
              care plan. Same Zod schema and safety gate as the production
              `billing-intelligence` worker; no LLM key is required for this
              demo build, so the deterministic simulator is shown.
            </p>
          </div>
          {aiOpen ? (
            <ChevronUp
              size={14}
              className="mt-1 text-[var(--measured-subtext)]"
              aria-hidden="true"
            />
          ) : (
            <ChevronDown
              size={14}
              className="mt-1 text-[var(--measured-subtext)]"
              aria-hidden="true"
            />
          )}
        </button>

        {aiOpen && (
          <div className="mt-3 space-y-2">
            {deepDive.suggestions.length === 0 ? (
              <p className="rounded-xl bg-[var(--measured-cream)] px-3 py-3 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
                No MBS candidate from AI deep dive. Continue normal care
                documentation; re-run when new dietitian, symptom, or meal
                evidence appears.
              </p>
            ) : (
              <ul className="space-y-2">
                {deepDive.suggestions.map((s) => (
                  <li
                    key={s.itemNumber}
                    className="rounded-xl border border-[var(--measured-border-soft)] px-3 py-2.5 text-[12px]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-[var(--measured-evaluate)]/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--measured-evaluate)]">
                        {s.itemNumber}
                      </span>
                      <span className="font-semibold text-[var(--measured-dark)]">
                        {s.serviceName}
                      </span>
                      <span className="text-[var(--measured-subtext)]">
                        {Math.round(s.confidence_score * 100)}% AI confidence
                      </span>
                    </div>
                    <p className="mt-1 leading-relaxed text-[var(--measured-dark)]">
                      {s.rationale}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {s.evidence.map((e, idx) => (
                        <div
                          key={`${s.itemNumber}-${e.kind}-${e.id}-${idx}`}
                          className="rounded-lg bg-[var(--measured-cream)] px-2.5 py-2"
                        >
                          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                            <span>{EVIDENCE_KIND_LABEL[e.kind]}</span>
                            <span className="font-mono normal-case tracking-normal text-[10px] text-[var(--measured-subtext)]">
                              {e.id}
                            </span>
                          </div>
                          <blockquote className="mt-0.5 leading-relaxed text-[var(--measured-dark)]">
                            &ldquo;{e.quote}&rdquo;
                          </blockquote>
                        </div>
                      ))}
                    </div>
                    {s.safety_flags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {s.safety_flags.map((flag) => (
                          <span
                            key={flag}
                            className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]"
                          >
                            {flag.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-[10px] leading-relaxed text-[var(--measured-subtext)]">
              Phase 4 outputs go through the same Zod schema (
              <code>BillingSuggestionSchema</code>) and safety gate as the
              production worker. Phase 5 swaps in retrieval-augmented MBS
              guidance and on-disk audit trails.
            </p>
          </div>
        )}
      </section>
      <section className="rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-cream)] p-3">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Billing Intelligence rollout
        </div>
        <ol className="mt-2 space-y-1.5">
          {phases.map((phase) => (
            <li
              key={phase.phase}
              className="flex items-start gap-2 text-[11px] text-[var(--measured-dark)]"
            >
              {phase.status === "live" ? (
                <CheckCircle2
                  size={13}
                  strokeWidth={2.2}
                  className="mt-0.5 shrink-0 text-[var(--measured-dark-green)]"
                  aria-hidden="true"
                />
              ) : (
                <span
                  className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-[var(--measured-border)]"
                  aria-hidden="true"
                />
              )}
              <span>
                <span className="font-semibold">{phase.phase}</span> ·{" "}
                {phase.label}{" "}
                <span className="text-[var(--measured-subtext)]">
                  ({phase.week})
                </span>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function ScanPill({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-xl bg-[var(--measured-cream)] px-2.5 py-2 text-[var(--measured-dark)]">
      <Icon size={12} strokeWidth={2.2} aria-hidden="true" />
      <span className="truncate">{label}</span>
    </div>
  );
}
