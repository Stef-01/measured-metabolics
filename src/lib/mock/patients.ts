import type { Patient } from "./types";

export const PATIENTS: Patient[] = [
  {
    id: "asha",
    firstName: "Asha",
    lastName: "Patel",
    age: 52,
    sex: "F",
    conditions: ["Type 2 diabetes", "Obesity"],
    cuisine: "south_asian",
    cuisineLabel: "South Asian",
    hbA1cPct: 8.2,
    weightKg: 82.4,
    weightDeltaKg: -0.8,
    bmi: 32.1,
    bp: { systolic: 142, diastolic: 88 },
    ldl: 3.1,
    meds: ["metformin", "semaglutide"],
    risk: "high",
    timeInRangePct: 78,
    weekNumber: 2,
    alerts: ["Dinner spikes", "Mild nausea"],
    patternSummary: [
      "Breakfast stable with higher protein.",
      "Dinner rice portions linked to largest spikes.",
      "Mild nausea on injection day.",
    ],
    assignedDietitianId: "maya",
    referringGpId: "lee",
    consentStatus: "signed",
  },
  {
    id: "ken",
    firstName: "Ken",
    lastName: "Watanabe",
    age: 61,
    sex: "M",
    conditions: ["Prediabetes"],
    cuisine: "east_asian",
    cuisineLabel: "East Asian",
    hbA1cPct: 6.1,
    weightKg: 74.2,
    weightDeltaKg: -0.3,
    bmi: 24.8,
    bp: { systolic: 138, diastolic: 84 },
    meds: [],
    risk: "medium",
    timeInRangePct: 88,
    weekNumber: 4,
    alerts: [],
    patternSummary: [
      "Stable glucose across breakfast and lunch.",
      "Late dinners linked to overnight rises.",
    ],
    assignedDietitianId: "maya",
    referringGpId: "khan",
    consentStatus: "signed",
  },
  {
    id: "lina",
    firstName: "Lina",
    lastName: "Novak",
    age: 34,
    sex: "F",
    conditions: ["PCOS", "Insulin resistance"],
    cuisine: "mediterranean",
    cuisineLabel: "Mediterranean",
    hbA1cPct: 5.9,
    weightKg: 71.0,
    weightDeltaKg: 0.2,
    bmi: 26.4,
    meds: ["metformin"],
    risk: "high",
    timeInRangePct: 65,
    weekNumber: 1,
    alerts: ["Severe nausea reported", "CGM data missing"],
    patternSummary: ["Symptoms flagged on intake; awaiting first review."],
    assignedDietitianId: "sarah",
    referringGpId: "chen",
    consentStatus: "signed",
  },
  {
    id: "omar",
    firstName: "Omar",
    lastName: "Saleh",
    age: 47,
    sex: "M",
    conditions: ["Hypertension"],
    cuisine: "middle_eastern",
    cuisineLabel: "Middle Eastern",
    hbA1cPct: 5.4,
    weightKg: 88.1,
    weightDeltaKg: -1.2,
    bmi: 27.5,
    bp: { systolic: 148, diastolic: 92 },
    meds: ["amlodipine"],
    risk: "low",
    timeInRangePct: 92,
    weekNumber: 6,
    alerts: [],
    patternSummary: [
      "Strong meal plan adherence (94%).",
      "BP gradually trending down on revised plan.",
    ],
    assignedDietitianId: "maya",
    referringGpId: "lee",
    consentStatus: "signed",
  },
];

export function findPatient(id: string): Patient | undefined {
  return PATIENTS.find((p) => p.id === id);
}

export const PATIENT_USER_ID = "asha";

export const DIETITIAN_PROFILES: Record<
  string,
  { id: string; name: string; credential: string; focus: string }
> = {
  maya: {
    id: "maya",
    name: "Maya Singh",
    credential: "APD",
    focus: "South Asian diabetes",
  },
  sarah: {
    id: "sarah",
    name: "Sarah Liu",
    credential: "APD",
    focus: "PCOS and reproductive metabolic health",
  },
};

export const GP_PROFILES: Record<
  string,
  { id: string; name: string; clinic: string }
> = {
  lee: { id: "lee", name: "Dr Lee", clinic: "Macquarie Family Practice" },
  khan: { id: "khan", name: "Dr Khan", clinic: "Crows Nest Medical" },
  chen: { id: "chen", name: "Dr Chen", clinic: "Bondi Junction Health" },
};
