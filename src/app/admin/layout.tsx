import type { ReactNode } from "react";
import { AdminNav } from "./admin-nav";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh grid-cols-[240px_1fr]">
      <AdminNav />
      <section className="overflow-y-auto bg-[var(--measured-bg)] px-8 py-6">
        {children}
      </section>
    </div>
  );
}
