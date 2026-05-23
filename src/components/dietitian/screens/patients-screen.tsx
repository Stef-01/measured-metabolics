"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, AlertTriangle } from "lucide-react";
import { PATIENTS } from "@/lib/mock";
import type { Cuisine, Patient, RiskLevel } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

type RiskFilter = "all" | RiskLevel;
type CuisineFilter = "all" | Cuisine;

const RISK_TONE: Record<RiskLevel, string> = {
  high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  medium:
    "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  low: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
};

const RISK_FILTERS: { id: RiskFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "high", label: "High risk" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

export function DietitianPatientsScreen() {
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [cuisine, setCuisine] = useState<CuisineFilter>("all");
  const [query, setQuery] = useState("");

  const cuisineOptions = useMemo(() => {
    const set = new Set<Cuisine>();
    for (const p of PATIENTS) set.add(p.cuisine);
    return Array.from(set);
  }, []);

  const cuisineLabel = useMemo(() => {
    const map = new Map<Cuisine, string>();
    for (const p of PATIENTS) map.set(p.cuisine, p.cuisineLabel);
    return map;
  }, []);

  const list = useMemo(() => {
    return PATIENTS.filter((p) => risk === "all" || p.risk === risk)
      .filter((p) => cuisine === "all" || p.cuisine === cuisine)
      .filter(
        (p) =>
          query === "" ||
          `${p.firstName} ${p.lastName}`
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          p.conditions.some((c) =>
            c.toLowerCase().includes(query.toLowerCase()),
          ) ||
          p.cuisineLabel.toLowerCase().includes(query.toLowerCase()),
      );
  }, [risk, cuisine, query]);

  const flagged = list.filter((p) => p.alerts.length > 0);
  const calm = list.filter((p) => p.alerts.length === 0);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex items-end justify-between gap-6">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            Caseload
          </div>
          <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
            Patient panel
          </h1>
          <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
            {list.length} patients · {flagged.length} flagged
          </p>
        </div>
      </div>

      <div className="mt-6 grid items-center gap-3 md:grid-cols-[1fr_auto]">
        <label className="relative">
          <Search
            size={16}
            strokeWidth={2}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--measured-subtext)]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, condition, or cuisine"
            className="w-full rounded-2xl border border-[var(--measured-border)] bg-white py-3 pl-10 pr-4 text-[14px] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
          />
        </label>
        <div className="flex gap-1 rounded-full border border-[var(--measured-border)] bg-white p-1">
          {RISK_FILTERS.map((f) => (
            <button
              type="button"
              key={f.id}
              onClick={() => setRisk(f.id)}
              aria-pressed={risk === f.id}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                risk === f.id
                  ? "bg-[var(--measured-green)] text-white"
                  : "text-[var(--measured-subtext)]",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          Cuisine
        </span>
        <button
          type="button"
          onClick={() => setCuisine("all")}
          aria-pressed={cuisine === "all"}
          className={cn(
            "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
            cuisine === "all"
              ? "bg-[var(--measured-dark)] text-white"
              : "bg-white text-[var(--measured-subtext)] ring-1 ring-[var(--measured-border)] hover:text-[var(--measured-dark)]",
          )}
        >
          All
        </button>
        {cuisineOptions.map((c) => (
          <button
            type="button"
            key={c}
            onClick={() => setCuisine(c)}
            aria-pressed={cuisine === c}
            className={cn(
              "rounded-full px-3 py-1 text-[12px] font-semibold transition-colors",
              cuisine === c
                ? "bg-[var(--measured-dark)] text-white"
                : "bg-white text-[var(--measured-subtext)] ring-1 ring-[var(--measured-border)] hover:text-[var(--measured-dark)]",
            )}
          >
            {cuisineLabel.get(c) ?? c}
          </button>
        ))}
      </div>

      <Section
        title="Flagged"
        items={flagged}
        empty="No patients flagged today."
      />
      <Section title="Stable" items={calm} empty="No matches." />
    </div>
  );
}

function Section({
  title,
  items,
  empty,
}: {
  title: string;
  items: Patient[];
  empty: string;
}) {
  return (
    <section className="mt-7">
      <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        {title}
        <span className="ml-2 rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] normal-case tracking-normal">
          {items.length}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {items.length === 0 && (
          <li className="text-[13px] italic text-[var(--measured-subtext)]">
            {empty}
          </li>
        )}
        {items.map((p, idx) => (
          <PatientRow key={p.id} p={p} idx={idx} />
        ))}
      </ul>
    </section>
  );
}

function PatientRow({ p, idx }: { p: Patient; idx: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: idx * 0.02 }}
    >
      <Link
        href={`/d/patients/${p.id}`}
        className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-2xl border border-[var(--measured-border-soft)] bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-raised)]"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-[15px] font-semibold text-[var(--measured-dark)]">
              {p.firstName} {p.lastName}
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                RISK_TONE[p.risk],
              )}
            >
              {p.risk}
            </span>
            <span className="text-[12px] text-[var(--measured-subtext)]">
              {p.age}
              {p.sex.toLowerCase()}
            </span>
            {p.alerts.length > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--measured-evaluate)]/10 px-2 py-0.5 text-[11px] font-semibold text-[var(--measured-evaluate)]">
                <AlertTriangle size={11} strokeWidth={2.2} aria-hidden="true" />
                {p.alerts[0]}
              </span>
            )}
          </div>
          <div className="mt-0.5 text-[13px] text-[var(--measured-dark)]">
            {p.conditions.join(" · ")}
          </div>
          <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
            HbA1c {p.hbA1cPct}% · weight Δ {p.weightDeltaKg > 0 ? "+" : ""}
            {p.weightDeltaKg.toFixed(1)} kg · TIR {p.timeInRangePct}% ·{" "}
            {p.cuisineLabel}
          </div>
        </div>
        <div className="text-[12px] text-[var(--measured-subtext)]">
          Week {p.weekNumber}
        </div>
        <div className="text-[12px] text-[var(--measured-subtext)]">→</div>
      </Link>
    </motion.li>
  );
}
