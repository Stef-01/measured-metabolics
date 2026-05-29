"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Clock, Users as UsersIcon } from "lucide-react";
import {
  getDietitianRecipes,
  type DietitianRecipe,
} from "@/lib/mock/dietitian-recipes";
import type { Cuisine, MealType } from "@/lib/mock/types";
import { cn } from "@/lib/utils/cn";

const CUISINE_LABEL: Record<Cuisine, string> = {
  south_asian: "South Asian",
  east_asian: "East Asian",
  mediterranean: "Mediterranean",
  middle_eastern: "Middle Eastern",
  anglo: "Anglo",
  latin_american: "Latin American",
  african: "African",
  other: "Other",
};

interface Props {
  open: boolean;
  dietitianId: string;
  /** Pre-filter to recipes matching this cuisine (the patient's cuisine). */
  patientCuisine?: Cuisine;
  /** Pre-filter to recipes whose `defaultMealType` matches. */
  mealTypeFilter?: MealType | null;
  onClose: () => void;
  onPick: (recipe: DietitianRecipe) => void;
}

/**
 * RecipePicker — a right-side drawer that lets a dietitian pull a recipe
 * from their personal library into the patient's draft plan.
 *
 * Defaults to filtering by the current patient's cuisine, so the highest-
 * leverage matches surface first. The dietitian can clear the filter to see
 * the full library.
 */
export function RecipePicker({
  open,
  dietitianId,
  patientCuisine,
  mealTypeFilter,
  onClose,
  onPick,
}: Props) {
  const [query, setQuery] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<Cuisine | "all">(
    patientCuisine ?? "all",
  );

  const all = useMemo(() => getDietitianRecipes(dietitianId), [dietitianId]);

  const filtered = useMemo(() => {
    return all
      .filter((r) =>
        cuisineFilter === "all" ? true : r.cuisine === cuisineFilter,
      )
      .filter((r) =>
        mealTypeFilter ? r.defaultMealType === mealTypeFilter : true,
      )
      .filter(
        (r) =>
          query === "" ||
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.why.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        const sameCuisineA = a.cuisine === patientCuisine ? 1 : 0;
        const sameCuisineB = b.cuisine === patientCuisine ? 1 : 0;
        if (sameCuisineA !== sameCuisineB) return sameCuisineB - sameCuisineA;
        return b.timesApplied - a.timesApplied;
      });
  }, [all, cuisineFilter, mealTypeFilter, query, patientCuisine]);

  const cuisinesPresent = useMemo(() => {
    const set = new Set<Cuisine>();
    for (const r of all) set.add(r.cuisine);
    return Array.from(set);
  }, [all]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-[rgba(13,13,13,0.32)]"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed right-0 top-0 z-[71] flex h-dvh w-full max-w-md flex-col border-l border-[var(--measured-border-soft)] bg-white shadow-[var(--shadow-raised)]"
            role="dialog"
            aria-label="Pick recipe from your library"
          >
            <header className="flex items-start justify-between gap-3 border-b border-[var(--measured-border-soft)] px-5 pt-5 pb-3">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                  Recipe library
                </div>
                <h2 className="mt-1 font-serif text-[22px] leading-tight text-[var(--measured-dark)]">
                  Pick from your saved plans
                </h2>
                <p className="mt-1 text-[12px] text-[var(--measured-subtext)]">
                  Recipes you&apos;ve approved for past patients, grouped by
                  cuisine.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close picker"
                className="-mr-1 -mt-1 rounded-lg p-1.5 text-[var(--measured-subtext)] hover:bg-[var(--measured-cream)]"
              >
                <X size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            </header>

            <div className="border-b border-[var(--measured-border-soft)] px-5 py-3">
              <label className="relative block">
                <Search
                  size={14}
                  strokeWidth={2}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--measured-subtext)]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title or rationale"
                  className="w-full rounded-xl border border-[var(--measured-border)] bg-white py-2 pl-9 pr-3 text-[13px] placeholder:text-[var(--measured-subtext)] focus:border-[var(--measured-green)] focus:outline-none"
                />
              </label>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <FilterChip
                  active={cuisineFilter === "all"}
                  onClick={() => setCuisineFilter("all")}
                >
                  All (<span className="tnum">{all.length}</span>)
                </FilterChip>
                {cuisinesPresent.map((c) => (
                  <FilterChip
                    key={c}
                    active={cuisineFilter === c}
                    onClick={() => setCuisineFilter(c)}
                    highlight={c === patientCuisine}
                  >
                    {CUISINE_LABEL[c]}
                    {c === patientCuisine && " ·  match"}
                  </FilterChip>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filtered.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[var(--measured-border)] bg-[var(--measured-cream)] px-4 py-8 text-center">
                  <p className="text-[13px] text-[var(--measured-subtext)]">
                    No recipes match. Try clearing the cuisine filter or
                    searching by ingredient.
                  </p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {filtered.map((r) => (
                    <li key={r.id}>
                      <motion.button
                        type="button"
                        onClick={() => {
                          onPick(r);
                          onClose();
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 22,
                        }}
                        className="w-full rounded-xl border border-[var(--measured-border-soft)] bg-white p-3 text-left transition-shadow hover:shadow-[var(--shadow-card)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="text-[14px] font-semibold text-[var(--measured-dark)]">
                              {r.title}
                            </div>
                            <div className="mt-0.5 text-[12px] italic text-[var(--measured-dark-green)]">
                              {r.why}
                            </div>
                          </div>
                          <span
                            className={cn(
                              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                              r.cuisine === patientCuisine
                                ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                                : "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
                            )}
                          >
                            {CUISINE_LABEL[r.cuisine]}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-[var(--measured-subtext)]">
                          <span className="inline-flex items-center gap-1">
                            <Clock
                              size={11}
                              strokeWidth={2.2}
                              aria-hidden="true"
                            />
                            <span className="tnum">{r.prepMinutes}</span> min
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UsersIcon
                              size={11}
                              strokeWidth={2.2}
                              aria-hidden="true"
                            />
                            Used in{" "}
                            <span className="tnum">{r.timesApplied}</span> plans
                          </span>
                          <span className="font-semibold uppercase tracking-wider">
                            {r.defaultMealType}
                          </span>
                        </div>
                      </motion.button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-[var(--measured-border-soft)] bg-[var(--measured-cream)] px-5 py-3 text-[10px] text-[var(--measured-subtext)]">
              Stage 5 wires this to a per-dietitian Supabase table, auto-seeded
              from approved plans.
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function FilterChip({
  active,
  onClick,
  highlight,
  children,
}: {
  active: boolean;
  onClick: () => void;
  highlight?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      whileTap={{ scale: 0.93 }}
      transition={{ type: "spring", stiffness: 480, damping: 26 }}
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
        active
          ? "bg-[var(--measured-green)] text-white"
          : highlight
            ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)] ring-1 ring-[var(--measured-green)]/30"
            : "bg-[var(--measured-cream)] text-[var(--measured-subtext)] hover:text-[var(--measured-dark)]",
      )}
    >
      {children}
    </motion.button>
  );
}
