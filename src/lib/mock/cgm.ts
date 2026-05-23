import type { CgmReading, CgmSeries } from "./types";

function buildDay(
  date: Date,
  base: number,
  spikes: {
    hour: number;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    deltaMmol: number;
  }[],
): CgmReading[] {
  const out: CgmReading[] = [];
  for (let m = 0; m < 24 * 12; m++) {
    const hour = m / 12;
    const ts = new Date(date);
    ts.setHours(0, 0, 0, 0);
    ts.setMinutes(m * 5);
    let value = base + Math.sin(hour / 4) * 0.3;
    for (const sp of spikes) {
      const dt = hour - sp.hour;
      if (dt > 0 && dt < 2.5) {
        // spike rises 90min then falls
        const peakWindow = 1.0;
        const arc = Math.exp(-Math.pow((dt - peakWindow) * 1.4, 2));
        value += sp.deltaMmol * arc;
      }
    }
    out.push({ ts: ts.toISOString(), mmolL: Math.round(value * 10) / 10 });
  }
  return out;
}

const today = new Date();

export const ASHA_CGM: CgmSeries = {
  patientId: "asha",
  timeInRangePct: 78,
  highestSpike: {
    mealType: "dinner",
    deltaMmol: 3.4,
    at: new Date(today.getTime() - 86400000).toISOString(),
  },
  readings: [
    ...buildDay(new Date(today.getTime() - 86400000), 6.2, [
      { hour: 8, mealType: "breakfast", deltaMmol: 1.2 },
      { hour: 13, mealType: "lunch", deltaMmol: 1.6 },
      { hour: 19.5, mealType: "dinner", deltaMmol: 3.4 },
    ]),
    ...buildDay(today, 6.4, [
      { hour: 8.25, mealType: "breakfast", deltaMmol: 0.9 },
      { hour: 13, mealType: "lunch", deltaMmol: 1.4 },
    ]),
  ],
};

export const KEN_CGM: CgmSeries = {
  patientId: "ken",
  timeInRangePct: 88,
  highestSpike: {
    mealType: "dinner",
    deltaMmol: 1.6,
    at: new Date(today.getTime() - 86400000).toISOString(),
  },
  readings: [
    ...buildDay(new Date(today.getTime() - 86400000), 5.8, [
      { hour: 7.5, mealType: "breakfast", deltaMmol: 0.8 },
      { hour: 12.5, mealType: "lunch", deltaMmol: 1.0 },
      { hour: 21, mealType: "dinner", deltaMmol: 1.6 },
    ]),
    ...buildDay(today, 5.9, [
      { hour: 8.25, mealType: "breakfast", deltaMmol: 0.8 },
      { hour: 13, mealType: "lunch", deltaMmol: 1.0 },
    ]),
  ],
};

export const CGM_BY_PATIENT: Record<string, CgmSeries> = {
  asha: ASHA_CGM,
  ken: KEN_CGM,
};

export function cgmForPatient(patientId: string): CgmSeries | undefined {
  return CGM_BY_PATIENT[patientId];
}
