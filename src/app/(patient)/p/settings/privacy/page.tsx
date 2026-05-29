"use client";

import { useState } from "react";
import { PatientAppHeader } from "@/components/patient/app-header";
import { cn } from "@/lib/utils/cn";

export default function PatientPrivacyPage() {
  const [rwe, setRwe] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [withdrawnAt, setWithdrawnAt] = useState<{
    rwe?: string;
    marketing?: string;
  }>({});

  function withdraw(kind: "rwe" | "marketing") {
    if (kind === "rwe") setRwe(false);
    if (kind === "marketing") setMarketing(false);
    setWithdrawnAt((w) => ({ ...w, [kind]: new Date().toISOString() }));
  }

  return (
    <>
      <PatientAppHeader eyebrow="Account" title="Privacy" />
      <div className="mx-auto max-w-md px-5 pt-3 pb-8">
        <p className="text-[14px] leading-relaxed text-[var(--measured-subtext)]">
          Withdrawing research or marketing consent does not affect your care.
        </p>

        <section className="mt-5 space-y-3">
          <Row
            title="Research & real-world evidence"
            description="De-identified data used to support published metabolic care research."
            on={rwe}
            onChange={setRwe}
            onWithdraw={() => withdraw("rwe")}
            withdrawnAt={withdrawnAt.rwe}
          />
          <Row
            title="Marketing communications"
            description="Product updates and pilot study invitations."
            on={marketing}
            onChange={setMarketing}
            onWithdraw={() => withdraw("marketing")}
            withdrawnAt={withdrawnAt.marketing}
          />
        </section>

        <p className="mt-8 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
          Care provision consent is required to use Measured. To revoke it,
          contact your care team.
        </p>
      </div>
    </>
  );
}

function Row(props: {
  title: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
  onWithdraw: () => void;
  withdrawnAt?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border p-4 transition-colors",
        props.on
          ? "border-[var(--measured-green)]/30 bg-[var(--measured-green)]/4"
          : "border-[var(--measured-border-soft)] bg-[var(--measured-card)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-semibold text-[var(--measured-dark)]">
            {props.title}
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
            {props.description}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={props.on}
          onClick={() => props.onChange(!props.on)}
          className={cn(
            "relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--measured-green)]/50",
            props.on
              ? "bg-[var(--measured-green)]"
              : "bg-[var(--measured-border)]",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
              props.on && "translate-x-5",
            )}
          />
        </button>
      </div>
      {props.on && (
        <button
          type="button"
          onClick={props.onWithdraw}
          className="mt-3 rounded-xl border border-[var(--measured-evaluate)]/30 bg-[var(--measured-evaluate)]/5 px-3 py-1.5 text-[12px] font-semibold text-[var(--measured-evaluate)] transition-colors hover:bg-[var(--measured-evaluate)]/10"
        >
          Withdraw consent
        </button>
      )}
      {!props.on && props.withdrawnAt && (
        <p className="tnum mt-2 text-[11px] text-[var(--measured-subtext)]">
          Withdrawn{" "}
          {new Date(props.withdrawnAt).toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}
    </div>
  );
}
