import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";

interface KpiRow {
  patient_id: string;
  started_at: string;
  completed_loop: boolean;
}

const VIBE_FIXTURE: KpiRow[] = [
  {
    patient_id: "asha",
    started_at: "2026-04-01T10:00:00Z",
    completed_loop: true,
  },
  {
    patient_id: "ken",
    started_at: "2026-04-04T14:00:00Z",
    completed_loop: true,
  },
  {
    patient_id: "lina",
    started_at: "2026-04-08T09:00:00Z",
    completed_loop: false,
  },
  {
    patient_id: "omar",
    started_at: "2026-04-12T11:00:00Z",
    completed_loop: true,
  },
];

export default async function AdminKpiPage() {
  let rows: KpiRow[] = VIBE_FIXTURE;
  if (isSupabaseConfigured()) {
    const sb = await supabaseServer();
    const { data } = await sb
      .from("kpi_completed_loops" as never)
      .select("*")
      .order("started_at", { ascending: false })
      .limit(200);
    if (Array.isArray(data) && data.length) rows = data as unknown as KpiRow[];
  }

  const total = rows.length;
  const completed = rows.filter((r) => r.completed_loop).length;
  const rate = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <p className="text-[12px] uppercase tracking-wider text-[var(--measured-subtext)]">
        North-star
      </p>
      <h1 className="mt-1 text-[24px] font-semibold text-[var(--measured-text)]">
        Completed metabolic care loop rate
      </h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <Card label="Loops started" value={total.toString()} />
        <Card label="Completed (4-week window)" value={completed.toString()} />
        <Card label="Completion rate" value={`${rate}%`} accent />
      </div>

      <p className="mt-6 text-[13px] text-[var(--measured-subtext)]">
        Loop = referral.created → ≥3 meal.uploaded → ≥1 meal.approved →
        report.sent → record.viewed (the GP opening the report). Window: 4
        weeks. Materialised view{" "}
        <code className="rounded bg-[var(--measured-card)] px-1">
          kpi_completed_loops
        </code>{" "}
        refreshed nightly via{" "}
        <code className="rounded bg-[var(--measured-card)] px-1">
          refresh_kpi_completed_loops()
        </code>
        .
      </p>

      <table className="mt-6 w-full text-left text-[13px]">
        <thead className="text-[var(--measured-subtext)]">
          <tr>
            <th className="px-4 py-2">Patient</th>
            <th className="px-4 py-2">Started</th>
            <th className="px-4 py-2">Completed</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={`${r.patient_id}-${r.started_at}`}
              className="border-t border-[var(--measured-border-soft)]"
            >
              <td className="px-4 py-2 text-[var(--measured-text)]">
                {r.patient_id}
              </td>
              <td className="px-4 py-2 text-[var(--measured-subtext)]">
                {new Date(r.started_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2 text-[var(--measured-text)]">
                {r.completed_loop ? "Yes" : "No"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        accent
          ? "border-[var(--measured-accent)] bg-[var(--measured-accent-soft)]"
          : "border-[var(--measured-border)] bg-[var(--measured-card)]"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-[var(--measured-subtext)]">
        {label}
      </p>
      <p className="mt-2 text-[28px] font-semibold text-[var(--measured-text)]">
        {value}
      </p>
    </div>
  );
}
