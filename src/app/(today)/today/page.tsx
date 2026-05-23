"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { StatPill } from "@/components/today/stat-pill";
import { SearchTrigger } from "@/components/today/search-trigger";
import { CaseCard, type CaseRow } from "@/components/today/case-card";
import { toast } from "@/lib/hooks/use-toast";

const TODAYS_CASES: CaseRow[] = [
  {
    id: "1",
    name: "Aroha Mehta",
    note: "Post-op nutrition review",
    detail: "Bariatric, 6 weeks post-op. Weight trend stable, B12 due.",
    tag: "priority",
  },
  {
    id: "2",
    name: "Daniel Kahale",
    note: "Type 2 diabetes — 6-week follow-up",
    detail: "HbA1c down 0.4 since intake. Adherence to plan: 78%.",
    tag: "follow-up",
  },
  {
    id: "3",
    name: "Priya Sharma",
    note: "New referral · IBS-D",
    detail: "GP referral. Wants a low-FODMAP starting plan.",
    tag: "intake",
  },
  {
    id: "4",
    name: "Marcus O'Connell",
    note: "Athlete fueling check-in",
    detail: "Ultra-marathon, 12 wks out. Iron and ferritin pulled today.",
    tag: "follow-up",
  },
];

export default function TodayPage() {
  const [resumeCase, setResumeCase] = useState<CaseRow | null>(TODAYS_CASES[0]);

  const handleOpenCase = (row: CaseRow) => {
    toast.push({
      variant: "info",
      title: `Opening ${row.name.split(" ")[0]}'s chart`,
      body: row.note,
      duration: 2200,
    });
  };

  const handleOpenSearch = () => {
    toast.push({
      variant: "info",
      title: "Patient search",
      body: "Search would open here.",
      duration: 1800,
    });
  };

  const handlePersonalize = () => {
    toast.push({
      variant: "level-up",
      title: "Banksia v0.1",
      body: "More options coming soon.",
      duration: 2400,
    });
  };

  return (
    <motion.div
      className="min-h-full bg-[var(--banksia-cream)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      {/* Header */}
      <header className="app-header px-4 py-2.5">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-lg font-semibold text-[var(--banksia-dark)]">
                Banksia
              </h1>
              <StatPill label="cases" value={TODAYS_CASES.length} tone="green" />
            </div>
            <span className="text-[10px] leading-tight italic text-[var(--banksia-subtext)]/80">
              Friday morning · 4 in your queue
            </span>
          </div>
          <button
            type="button"
            onClick={handleOpenSearch}
            aria-label="Open patient search"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--banksia-green)]/8 text-[var(--banksia-dark-green)] transition-colors hover:bg-[var(--banksia-green)]/15"
          >
            <span className="font-serif text-sm font-semibold">Dr</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-md space-y-5 px-4 pt-4 pb-8">
        <SearchTrigger onClick={handleOpenSearch} />

        {/* Daily cue card — mirrors Sous CookingTipCard */}
        <div className="rounded-2xl border border-[var(--banksia-border-soft)] bg-white p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--banksia-gold)]/15 text-[var(--banksia-gold)]">
              <Sparkles size={14} strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--banksia-subtext)]">
                Today&apos;s cue
              </p>
              <p className="mt-1 text-sm leading-relaxed text-[var(--banksia-dark)]">
                Patients on metformin benefit from B12 screening every 12 months
                — Aroha is overdue.
              </p>
            </div>
          </div>
        </div>

        {/* Resume banner — mirrors Sous resume cook */}
        <AnimatePresence>
          {resumeCase && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="rounded-xl border border-[var(--banksia-green)]/25 bg-[var(--banksia-green)]/5 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--banksia-dark)]">
                    Resume {resumeCase.name}&apos;s chart?
                  </p>
                  <p className="text-[11px] text-[var(--banksia-subtext)]">
                    You left mid-prescription · 12 min ago
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenCase(resumeCase)}
                    className="rounded-lg bg-[var(--banksia-green)] px-3 py-1.5 text-[11px] font-semibold text-white transition-colors hover:bg-[var(--banksia-dark-green)]"
                  >
                    Resume
                  </button>
                  <button
                    type="button"
                    onClick={() => setResumeCase(null)}
                    className="rounded-lg px-2 py-1.5 text-[11px] font-medium text-[var(--banksia-subtext)] transition-colors hover:text-[var(--banksia-dark)]"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Today's queue — the hero */}
        <section className="space-y-3">
          <div className="flex items-baseline justify-between px-1">
            <h2 className="font-serif text-lg font-semibold text-[var(--banksia-dark)]">
              Today&apos;s queue
            </h2>
            <span className="text-[11px] text-[var(--banksia-subtext)]">
              4 cases · 1 priority
            </span>
          </div>

          <div className="space-y-3">
            {TODAYS_CASES.map((row) => (
              <CaseCard
                key={row.id}
                row={row}
                onOpen={() => handleOpenCase(row)}
              />
            ))}
          </div>
        </section>

        {/* More options row — visually subordinate */}
        <div className="flex items-center justify-center gap-3 pt-1">
          <button
            type="button"
            onClick={handlePersonalize}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium text-[var(--banksia-subtext)] transition-colors hover:text-[var(--banksia-green)]"
          >
            <MoreHorizontal size={13} strokeWidth={2} />
            More options
          </button>
        </div>
      </main>
    </motion.div>
  );
}
