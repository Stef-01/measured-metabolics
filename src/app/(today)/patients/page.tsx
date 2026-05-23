"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SearchTrigger } from "@/components/today/search-trigger";

const PATIENTS = [
  { name: "Aroha Mehta", condition: "Bariatric (post-op)", lastSeen: "2 days ago" },
  { name: "Daniel Kahale", condition: "Type 2 diabetes", lastSeen: "6 weeks ago" },
  { name: "Priya Sharma", condition: "IBS-D · new", lastSeen: "Today" },
  { name: "Marcus O'Connell", condition: "Endurance fueling", lastSeen: "3 weeks ago" },
  { name: "Lena Iverson", condition: "PCOS · maintenance", lastSeen: "1 month ago" },
  { name: "Tom Albright", condition: "Heart failure", lastSeen: "2 months ago" },
];

export default function PatientsPage() {
  return (
    <motion.div
      className="min-h-full bg-[var(--banksia-cream)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
    >
      <header className="app-header px-4 py-2.5">
        <div className="mx-auto max-w-md">
          <h1 className="font-serif text-lg font-semibold text-[var(--banksia-dark)]">
            Patients
          </h1>
          <p className="text-[11px] text-[var(--banksia-subtext)]">
            {PATIENTS.length} active in your panel
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-md space-y-4 px-4 pt-4 pb-8">
        <SearchTrigger />

        <ul className="space-y-2">
          {PATIENTS.map((p) => (
            <li key={p.name}>
              <button
                type="button"
                className="surface-card group flex w-full items-center gap-3 px-4 py-3 text-left transition-shadow hover:shadow-[var(--shadow-raised)]"
              >
                <div
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--banksia-green)]/8 font-serif text-sm font-semibold text-[var(--banksia-dark-green)]"
                >
                  {p.name
                    .split(" ")
                    .map((s) => s[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[var(--banksia-dark)]">
                    {p.name}
                  </p>
                  <p className="truncate text-xs text-[var(--banksia-subtext)]">
                    {p.condition} · last seen {p.lastSeen}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 text-[var(--banksia-subtext)] transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </li>
          ))}
        </ul>
      </main>
    </motion.div>
  );
}
