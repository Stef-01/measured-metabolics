"use client";

import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { PatientAppHeader } from "@/components/patient/app-header";
import { CGM_BY_PATIENT, CURRENT_PATIENT_ID, PATIENTS } from "@/lib/mock";
import { useStoredSymptoms } from "@/lib/storage/patient-store";
import { cn } from "@/lib/utils/cn";

type TabId = "glucose" | "weight" | "symptoms";

const TABS: { id: TabId; label: string }[] = [
  { id: "glucose", label: "Glucose" },
  { id: "weight", label: "Weight" },
  { id: "symptoms", label: "Symptoms" },
];

const SEVERITY_TO_NUM = {
  none: 0,
  mild: 1,
  severe: 2,
} as const;

export function PatientMetricsScreen() {
  const [tab, setTab] = useState<TabId>("glucose");
  const me = PATIENTS.find((p) => p.id === CURRENT_PATIENT_ID)!;
  const cgm = CGM_BY_PATIENT[me.id];
  const symptoms = useStoredSymptoms(me.id);

  const cgmData = useMemo(
    () =>
      cgm?.readings.map((r) => ({
        time: new Date(r.ts).getTime(),
        mmolL: r.mmolL,
      })) ?? [],
    [cgm],
  );

  const weightData = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: i + 1,
        kg:
          Math.round(
            (me.weightKg + (Math.sin(i / 1.7) * 0.4 + i * 0.04) - 0.6) * 10,
          ) / 10,
      })),
    [me.weightKg],
  );

  const symptomData = useMemo(() => {
    return symptoms
      .slice()
      .reverse()
      .map((s, idx) => ({
        idx,
        nausea: SEVERITY_TO_NUM[s.nausea],
        constipation: SEVERITY_TO_NUM[s.constipation],
      }));
  }, [symptoms]);

  return (
    <>
      <PatientAppHeader
        eyebrow={`Week ${me.weekNumber}`}
        title="Metrics"
        trailing={
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-[var(--measured-green)]/10 text-center text-[var(--measured-dark-green)]">
            <div className="text-[14px] font-bold leading-none">
              {me.timeInRangePct}%
            </div>
            <div className="text-[8px] uppercase tracking-wider">in range</div>
          </div>
        }
      />

      <div className="mx-auto flex max-w-md flex-col gap-4 px-5 pt-3 pb-8">
        <div className="flex gap-2 rounded-full border border-[var(--measured-border)] bg-white p-1">
          {TABS.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={cn(
                "flex-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors",
                tab === t.id
                  ? "bg-[var(--measured-green)] text-white"
                  : "text-[var(--measured-subtext)]",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="surface-card p-4">
          {tab === "glucose" && (
            <ChartShell
              title="Glucose · last 48h"
              subtitle={`${me.timeInRangePct}% time in range`}
            >
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={cgmData}>
                  <defs>
                    <linearGradient id="glu" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#2d5a3d"
                        stopOpacity={0.35}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2d5a3d"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis
                    dataKey="time"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    tickFormatter={(t: number) =>
                      new Date(t).toLocaleTimeString([], {
                        hour: "numeric",
                        hour12: false,
                      })
                    }
                    stroke="rgba(0,0,0,0.4)"
                    fontSize={10}
                  />
                  <YAxis
                    domain={[3, 12]}
                    stroke="rgba(0,0,0,0.4)"
                    fontSize={10}
                    label={{
                      value: "mmol/L",
                      angle: -90,
                      position: "insideLeft",
                      offset: 8,
                      fontSize: 10,
                      fill: "rgba(0,0,0,0.4)",
                    }}
                  />
                  <Tooltip
                    formatter={(v: number) => `${v.toFixed(1)} mmol/L`}
                    labelFormatter={(t: number) =>
                      new Date(t).toLocaleString([], {
                        weekday: "short",
                        hour: "numeric",
                        minute: "2-digit",
                      })
                    }
                  />
                  <ReferenceArea
                    y1={3.9}
                    y2={10}
                    fill="#2d5a3d"
                    fillOpacity={0.06}
                  />
                  <Area
                    type="monotone"
                    dataKey="mmolL"
                    stroke="#2d5a3d"
                    strokeWidth={2}
                    fill="url(#glu)"
                  />
                </AreaChart>
              </ResponsiveContainer>
              <p className="mt-3 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
                Highest spike: {cgm?.highestSpike.deltaMmol.toFixed(1)} mmol/L
                after {cgm?.highestSpike.mealType}.
              </p>
            </ChartShell>
          )}
          {tab === "weight" && (
            <ChartShell
              title="Weight · last 14 days"
              subtitle={`${me.weightDeltaKg > 0 ? "+" : ""}${me.weightDeltaKg.toFixed(1)} kg`}
            >
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={weightData}>
                  <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(0,0,0,0.4)" fontSize={10} />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke="rgba(0,0,0,0.4)"
                    fontSize={10}
                  />
                  <Tooltip formatter={(v: number) => `${v.toFixed(1)} kg`} />
                  <Line
                    type="monotone"
                    dataKey="kg"
                    stroke="#2d5a3d"
                    strokeWidth={2.4}
                    dot={{ r: 3, fill: "#2d5a3d" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartShell>
          )}
          {tab === "symptoms" && (
            <ChartShell title="Symptoms" subtitle="Last logged check-ins">
              {symptomData.length === 0 ? (
                <div className="flex h-[220px] items-center justify-center text-center text-[13px] text-[var(--measured-subtext)]">
                  No symptom check-ins yet. Open the Symptoms tab to log one.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={symptomData}>
                    <CartesianGrid stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis
                      dataKey="idx"
                      stroke="rgba(0,0,0,0.4)"
                      fontSize={10}
                    />
                    <YAxis
                      domain={[0, 2]}
                      ticks={[0, 1, 2]}
                      tickFormatter={(v: number) =>
                        ["none", "mild", "severe"][v] ?? ""
                      }
                      stroke="rgba(0,0,0,0.4)"
                      fontSize={10}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      name="Nausea"
                      dataKey="nausea"
                      stroke="#8c1515"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#8c1515" }}
                    />
                    <Line
                      type="monotone"
                      name="Constipation"
                      dataKey="constipation"
                      stroke="#2c5e8a"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#2c5e8a" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </ChartShell>
          )}
        </div>

        <a
          href="/p/symptoms"
          className="rounded-2xl border border-[var(--measured-border)] bg-white px-4 py-3 text-center text-[13px] font-semibold text-[var(--measured-dark-green)] hover:bg-[var(--measured-cream)]"
        >
          Quick symptom check
        </a>
      </div>
    </>
  );
}

function ChartShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <div className="font-serif text-[18px] text-[var(--measured-dark)]">
          {title}
        </div>
        {subtitle && (
          <div className="text-[12px] text-[var(--measured-subtext)]">
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
