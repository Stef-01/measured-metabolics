import { TabBar } from "@/components/shared/tab-bar";

/**
 * Layout shared by Today / Patients / Insights — the in-app surfaces.
 * Pins the tab bar to the bottom over a cream backdrop.
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-[var(--banksia-cream)] pb-20">
      {children}
      <TabBar user={{ insightsUnlocked: true }} />
    </div>
  );
}
