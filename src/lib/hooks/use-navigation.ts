import { useMemo } from "react";

export type Persona = "patient" | "dietitian" | "gp";

export type PatientTabId = "home" | "meal" | "plan" | "metrics" | "messages";

export type DietitianTabId =
  | "dashboard"
  | "referrals"
  | "patients"
  | "queue"
  | "reports"
  | "messages";

export type GpTabId =
  | "context"
  | "transcript"
  | "billing"
  | "care-plan"
  | "referral"
  | "report";

export type TabId = PatientTabId | DietitianTabId | GpTabId;

export interface Tab<TId extends TabId = TabId> {
  id: TId;
  label: string;
  href: string;
}

const PATIENT_TABS: Tab<PatientTabId>[] = [
  { id: "home", label: "Home", href: "/p/home" },
  { id: "meal", label: "Meal", href: "/p/meal" },
  { id: "plan", label: "Plan", href: "/p/plan" },
  { id: "metrics", label: "Metrics", href: "/p/metrics" },
  { id: "messages", label: "Messages", href: "/p/messages" },
];

const DIETITIAN_TABS: Tab<DietitianTabId>[] = [
  { id: "dashboard", label: "Dashboard", href: "/d/dashboard" },
  { id: "referrals", label: "Referrals", href: "/d/referrals" },
  { id: "patients", label: "Patients", href: "/d/patients" },
  { id: "queue", label: "Meal queue", href: "/d/queue" },
  { id: "reports", label: "Reports", href: "/d/reports" },
  { id: "messages", label: "Messages", href: "/d/messages" },
];

/**
 * Returns the tab definitions for a given persona.
 *
 * Patient nav is a 5-tab bottom bar (PRD §7.3).
 * Dietitian nav is a left rail (PRD §8.3).
 * GP nav is contextual to the patient sidebar (PRD §9.3) — those tabs
 * only exist when a patient context is selected, so they're not returned here.
 */
export function useNavigation(persona: "patient"): Tab<PatientTabId>[];
export function useNavigation(persona: "dietitian"): Tab<DietitianTabId>[];
export function useNavigation(persona: "gp"): Tab<GpTabId>[];
export function useNavigation(persona: Persona) {
  return useMemo(() => {
    switch (persona) {
      case "patient":
        return PATIENT_TABS;
      case "dietitian":
        return DIETITIAN_TABS;
      case "gp":
        return [] as Tab<GpTabId>[];
    }
  }, [persona]);
}

export function gpSidebarTabs(patientId: string): Tab<GpTabId>[] {
  return [
    { id: "context", label: "Context", href: `/gp/${patientId}/context` },
    {
      id: "transcript",
      label: "Transcript",
      href: `/gp/${patientId}/transcript`,
    },
    { id: "billing", label: "Billing", href: `/gp/${patientId}/billing` },
    { id: "care-plan", label: "Care plan", href: `/gp/${patientId}/care-plan` },
    { id: "referral", label: "Referral", href: `/gp/${patientId}/referral` },
    { id: "report", label: "Report", href: `/gp/${patientId}/report` },
  ];
}
