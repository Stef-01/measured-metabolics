"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart2,
  ClipboardList,
  Building2,
  Users,
  UserCircle,
  FileText,
  Settings,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PersonaSwitcher } from "@/components/shared/persona-switcher";

const TABS = [
  { href: "/admin/kpi", label: "KPI", Icon: BarChart2 },
  { href: "/admin/audit", label: "Audit log", Icon: ClipboardList },
  { href: "/admin/organizations", label: "Organizations", Icon: Building2 },
  { href: "/admin/users", label: "Users", Icon: Users },
  { href: "/admin/patients", label: "Patients", Icon: UserCircle },
  { href: "/admin/referrals", label: "Referrals", Icon: FileText },
  { href: "/admin/settings", label: "Settings", Icon: Settings },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen flex-col border-r border-[var(--measured-border)] bg-[var(--measured-card)] px-3 py-6">
      <div className="mb-5 flex items-center gap-2.5 px-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white">
          <Shield size={15} strokeWidth={2.2} aria-hidden="true" />
        </div>
        <div>
          <div className="font-serif text-[16px] leading-tight tracking-tight text-[var(--measured-dark)]">
            Measured
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--measured-subtext)]">
            Admin
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-0.5">
        {TABS.map((t) => {
          const isActive =
            pathname === t.href || pathname.startsWith(`${t.href}/`);
          return (
            <Link
              key={t.href}
              href={t.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]"
                  : "text-[var(--measured-subtext)] hover:bg-[var(--measured-bg)] hover:text-[var(--measured-dark)]",
              )}
            >
              <t.Icon
                size={16}
                strokeWidth={2}
                className={cn(
                  isActive
                    ? "text-[var(--measured-green)]"
                    : "text-[var(--measured-subtext)]",
                )}
                aria-hidden="true"
              />
              {t.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[var(--measured-border-soft)] pt-3">
        <PersonaSwitcher active="admin" variant="rail" />
      </div>
    </aside>
  );
}
