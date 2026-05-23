import type { SymptomLog } from "./types";

const minus = (mins: number) =>
  new Date(Date.now() - mins * 60000).toISOString();

export const SYMPTOMS: SymptomLog[] = [
  {
    id: "sym-asha-1",
    patientId: "asha",
    loggedAt: minus(60 * 18),
    nausea: "mild",
    constipation: "none",
    appetite: "normal",
    hypoSymptoms: false,
    medsAsPlanned: true,
  },
  {
    id: "sym-lina-1",
    patientId: "lina",
    loggedAt: minus(60 * 4),
    nausea: "severe",
    constipation: "mild",
    appetite: "lower",
    hypoSymptoms: false,
    medsAsPlanned: true,
  },
  {
    id: "sym-omar-1",
    patientId: "omar",
    loggedAt: minus(60 * 24),
    nausea: "none",
    constipation: "none",
    appetite: "normal",
    hypoSymptoms: false,
    medsAsPlanned: true,
  },
];

export function symptomsForPatient(patientId: string): SymptomLog[] {
  return SYMPTOMS.filter((s) => s.patientId === patientId);
}

export function recentSevereSymptoms(): SymptomLog[] {
  return SYMPTOMS.filter(
    (s) =>
      s.nausea === "severe" || s.constipation === "severe" || s.hypoSymptoms,
  );
}
