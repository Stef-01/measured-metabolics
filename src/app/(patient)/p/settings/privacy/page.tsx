"use client";

import { useState } from "react";

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
    <main className="px-5 py-6">
      <h1 className="text-[22px] font-semibold text-[var(--measured-text)]">
        Privacy
      </h1>
      <p className="mt-2 text-[13px] text-[var(--measured-subtext)]">
        Withdrawing research or marketing consent does not affect your care.
      </p>

      <section className="mt-6 space-y-3">
        <Row
          title="Research & real-world evidence"
          on={rwe}
          onChange={setRwe}
          onWithdraw={() => withdraw("rwe")}
          withdrawnAt={withdrawnAt.rwe}
        />
        <Row
          title="Marketing communications"
          on={marketing}
          onChange={setMarketing}
          onWithdraw={() => withdraw("marketing")}
          withdrawnAt={withdrawnAt.marketing}
        />
      </section>

      <p className="mt-8 text-[12px] text-[var(--measured-subtext)]">
        Care provision consent is required to use Measured. To revoke it,
        contact your care team.
      </p>
    </main>
  );
}

function Row(props: {
  title: string;
  on: boolean;
  onChange: (v: boolean) => void;
  onWithdraw: () => void;
  withdrawnAt?: string;
}) {
  return (
    <div className="rounded-3xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[14px] font-semibold text-[var(--measured-text)]">
          {props.title}
        </p>
        <input
          type="checkbox"
          checked={props.on}
          onChange={(e) => props.onChange(e.target.checked)}
          className="h-5 w-5 accent-[var(--measured-accent)]"
        />
      </div>
      {props.on ? (
        <button
          type="button"
          onClick={props.onWithdraw}
          className="mt-3 rounded-2xl border border-[var(--measured-border)] px-3 py-1.5 text-[12px] text-[var(--measured-text)]"
        >
          Withdraw
        </button>
      ) : props.withdrawnAt ? (
        <p className="mt-2 text-[11px] text-[var(--measured-subtext)]">
          Withdrawn {new Date(props.withdrawnAt).toLocaleString()}
        </p>
      ) : null}
    </div>
  );
}
