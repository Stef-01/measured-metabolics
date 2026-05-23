import { useMemo } from "react";

export type TabId = "today" | "patients" | "insights";

type Tab = {
  id: TabId;
  label: string;
  href: string;
  visible: boolean;
};

/**
 * Banksia tab navigation.
 *
 * Today    — clinician dashboard (queue, alerts, today's prescriptions)
 * Patients — patient list and chart access
 * Insights — population-level analytics, gated until 30+ patients
 */
export function useNavigation(
  user: { insightsUnlocked: boolean } | null,
) {
  return useMemo<Tab[]>(() => {
    const tabs: Tab[] = [
      { id: "today", label: "Today", href: "/today", visible: true },
      { id: "patients", label: "Patients", href: "/patients", visible: true },
      {
        id: "insights",
        label: "Insights",
        href: "/insights",
        visible: user?.insightsUnlocked ?? true,
      },
    ];
    return tabs.filter((t) => t.visible);
  }, [user?.insightsUnlocked]);
}
