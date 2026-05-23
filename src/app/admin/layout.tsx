import type { ReactNode } from "react";
import Link from "next/link";
import { PersonaSwitcher } from "@/components/shared/persona-switcher";

const TABS = [
  { href: "/admin/kpi", label: "KPI" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/admin/organizations", label: "Organizations" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/patients", label: "Patients" },
  { href: "/admin/referrals", label: "Referrals" },
  { href: "/admin/settings", label: "Settings" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-[240px_1fr]">
      <aside className="flex h-screen flex-col border-r border-[var(--measured-border)] bg-[var(--measured-card)] px-4 py-6">
        <p className="px-3 text-[11px] uppercase tracking-wider text-[var(--measured-subtext)]">
          Measured Admin
        </p>
        <nav className="mt-4 flex flex-col gap-1">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-xl px-3 py-2 text-[14px] text-[var(--measured-text)] hover:bg-[var(--measured-bg)]"
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4">
          <PersonaSwitcher active="admin" variant="rail" />
        </div>
      </aside>
      <section className="bg-[var(--measured-bg)] px-8 py-6">
        {children}
      </section>
    </div>
  );
}
