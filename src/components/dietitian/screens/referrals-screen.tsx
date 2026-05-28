"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Clock,
  ArrowRight,
} from "lucide-react";
import { REFERRALS, PATIENTS, CURRENT_DIETITIAN_ID } from "@/lib/mock";
import type { Referral, ReferralPriority } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";
import { toast } from "@/lib/hooks/use-toast";

const PRIORITY_TONE: Record<ReferralPriority, string> = {
  high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  medium:
    "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  low: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
};

export function DietitianReferralsScreen() {
  const [referrals, setReferrals] = useState<Referral[]>(REFERRALS);
  const newOnes = referrals.filter((r) => r.status === "new");
  const inProgress = referrals.filter((r) => r.status !== "new");

  const accept = (id: string) => {
    setReferrals((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "in_progress",
              assignedDietitianId: CURRENT_DIETITIAN_ID,
            }
          : r,
      ),
    );
    toast.push({
      variant: "success",
      title: "Referral accepted",
      body: "Patient is now in your panel.",
      duration: 2400,
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Referrals
        </div>
        <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
          Inbox
        </h1>
        <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
          {newOnes.length} new · {inProgress.length} in progress
        </p>
      </motion.div>

      <Section
        title="New"
        Icon={Inbox}
        empty="No new referrals."
        items={newOnes}
        renderItem={(r) => <Row key={r.id} r={r} accept={accept} />}
      />

      <Section
        title="In progress"
        Icon={UserCheck}
        empty="No active referrals."
        items={inProgress}
        renderItem={(r) => <Row key={r.id} r={r} accept={accept} accepted />}
      />
    </div>
  );
}

function Section<T>({
  title,
  Icon,
  items,
  empty,
  renderItem,
}: {
  title: string;
  Icon: typeof Inbox;
  items: T[];
  empty: string;
  renderItem: (item: T) => React.ReactNode;
}) {
  return (
    <section className="mt-8">
      <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        <Icon size={14} strokeWidth={2} aria-hidden="true" />
        {title}
        <span className="rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] font-bold normal-case tracking-normal text-[var(--measured-subtext)]">
          {items.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.length === 0 && (
          <li className="text-[13px] italic text-[var(--measured-subtext)]">
            {empty}
          </li>
        )}
        <AnimatePresence initial={false}>
          {items.map((item) => renderItem(item))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

function Row({
  r,
  accept,
  accepted,
}: {
  r: Referral;
  accept: (id: string) => void;
  accepted?: boolean;
}) {
  const p = PATIENTS.find((pp) => pp.id === r.patientId);
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2 }}
      className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)]"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {p ? (
            <Link
              href={`/d/patients/${p.id}`}
              className="text-[15px] font-semibold text-[var(--measured-dark)] hover:text-[var(--measured-dark-green)] hover:underline"
            >
              {p.firstName} {p.lastName}
            </Link>
          ) : (
            <div className="text-[15px] font-semibold text-[var(--measured-dark)]">
              {r.patientId}
            </div>
          )}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
              PRIORITY_TONE[r.priority],
            )}
          >
            {r.priority}
          </span>
          {r.consentStatus === "signed" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--measured-green)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-dark-green)]">
              <ShieldCheck size={11} strokeWidth={2.2} aria-hidden="true" />
              Consent signed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-subtext)]">
              <Clock size={11} strokeWidth={2.2} aria-hidden="true" />
              Consent pending
            </span>
          )}
        </div>
        <div className="mt-0.5 text-[13px] text-[var(--measured-dark)]">
          {r.reason}
        </div>
        <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
          {r.referringGpName} · {r.conditions.join(", ")} · {r.cuisineLabel}
        </div>
      </div>

      {accepted ? (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-[var(--measured-green)]/10 px-3 py-2 text-[12px] font-semibold text-[var(--measured-dark-green)]">
            <CheckCircle2 size={14} strokeWidth={2.2} aria-hidden="true" />
            Accepted
          </span>
          {p && (
            <Link
              href={`/d/patients/${p.id}`}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-[12px] font-semibold text-[var(--measured-dark-green)] ring-1 ring-[var(--measured-border)] hover:bg-[var(--measured-cream)]"
            >
              Open
              <ArrowRight size={12} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          )}
        </div>
      ) : (
        <motion.button
          type="button"
          onClick={() => accept(r.id)}
          disabled={r.consentStatus !== "signed"}
          className={cn(
            "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[12px] font-semibold",
            r.consentStatus === "signed"
              ? "bg-[var(--measured-green)] text-white hover:bg-[var(--measured-dark-green)]"
              : "cursor-not-allowed bg-[var(--measured-input-bg)] text-[var(--measured-subtext)]",
          )}
          whileHover={
            r.consentStatus === "signed" ? { scale: 1.03 } : undefined
          }
          whileTap={r.consentStatus === "signed" ? { scale: 0.95 } : undefined}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          {r.consentStatus === "signed" ? "Accept" : "Awaiting consent"}
        </motion.button>
      )}
    </motion.li>
  );
}
