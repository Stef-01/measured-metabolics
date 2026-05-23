import type { Referral } from "./types";

const minus = (mins: number) =>
  new Date(Date.now() - mins * 60000).toISOString();

export const REFERRALS: Referral[] = [
  {
    id: "ref-1",
    patientId: "asha",
    referringGpId: "lee",
    referringGpName: "Dr Lee",
    assignedDietitianId: "maya",
    conditions: ["T2DM", "obesity"],
    cuisineLabel: "South Asian",
    priority: "high",
    consentStatus: "signed",
    status: "in_progress",
    createdAt: minus(60 * 24 * 14),
    reason: "HbA1c 8.2%; needs culturally aligned plan",
  },
  {
    id: "ref-2",
    patientId: "lina",
    referringGpId: "chen",
    referringGpName: "Dr Chen",
    conditions: ["PCOS", "Insulin resistance"],
    cuisineLabel: "Mediterranean",
    priority: "high",
    consentStatus: "signed",
    status: "new",
    createdAt: minus(60 * 5),
    reason: "Severe nausea symptoms reported on intake.",
  },
  {
    id: "ref-3",
    patientId: "ken",
    referringGpId: "khan",
    referringGpName: "Dr Khan",
    assignedDietitianId: "maya",
    conditions: ["Prediabetes"],
    cuisineLabel: "East Asian",
    priority: "medium",
    consentStatus: "signed",
    status: "in_progress",
    createdAt: minus(60 * 24 * 28),
    reason: "Family history; lifestyle plan needed.",
  },
  {
    id: "ref-4",
    patientId: "omar",
    referringGpId: "lee",
    referringGpName: "Dr Lee",
    assignedDietitianId: "maya",
    conditions: ["Hypertension"],
    cuisineLabel: "Middle Eastern",
    priority: "low",
    consentStatus: "signed",
    status: "in_progress",
    createdAt: minus(60 * 24 * 42),
    reason: "DASH-style plan with cultural alignment.",
  },
];

export function referralsForDietitian(dietitianId: string): Referral[] {
  return REFERRALS.filter(
    (r) => !r.assignedDietitianId || r.assignedDietitianId === dietitianId,
  );
}

export function newReferrals(): Referral[] {
  return REFERRALS.filter((r) => r.status === "new");
}
