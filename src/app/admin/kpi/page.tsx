import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";

interface KpiRow {
  patient_id: string;
  started_at: string;
  completed_loop: boolean;
}

const VIBE_FIXTURE: KpiRow[] = [
  { patient_id: "asha", started_at: "2026-04-01T10:00:00Z", completed_loop: true },
  { patient_id: "ken", started_at: "2026-04-04T14:00:00Z", completed_loop: true },
  { patient_id: "lina", started_at: "2026-04-08T09:00:00Z", completed_loop: false },
  { patient_id: "omar", started_at: "2026-04-12T11:00:00Z", completed_loop: true },
  { patient_id: "priya", started_at: "2026-04-15T09:30:00Z", completed_loop: true },
  { patient_id: "james", started_at: "2026-04-22T11:15:00Z", completed_loop: false },
  { patient_id: "sofia", started_at: "2026-05-01T08:45:00Z", completed_loop: false },
  { patient_id: "ravi", started_at: "2026-02-10T10:00:00Z", completed_loop: true },
  { patient_id: "grace", started_at: "2026-04-28T14:30:00Z", completed_loop: false },
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
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        North-star metric
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Completed care loop rate
      </h1>
      <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
        Referral → 3+ meals → approval → GP report viewed within 4 weeks.
      </p>

      {/* Hero completion card */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-[var(--measured-green)]/25 bg-[var(--measured-green)]/5 p-6">
        <div className="flex items-end gap-6">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
              Completion rate
            </div>
            <div className="mt-1 font-serif text-[64px] leading-none tracking-tight text-[var(--measured-dark)]">
              {rate}%
            </div>
          </div>
          <div className="mb-2 flex-1">
            <div className="mb-1 flex justify-between text-[11px] text-[var(--measured-subtext)]">
              <span>{completed} completed</span>
              <span>{total - completed} in progress</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-white shadow-inner">
              <div
                className="h-full rounded-full bg-[var(--measured-green)] transition-all"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <StatCard label="Loops started" value={total.toString()} />
        <StatCard label="Completed (4-wk)" value={completed.toString()} />
        <StatCard label="In progress" value={(total - completed).toString()} muted />
      </div>

      <p className="mt-6 text-[12px] leading-relaxed text-[var(--measured-subtext)]">
        Materialised view{" "}
        <code className="rounded bg-[var(--measured-card)] px-1 py-0.5">
          kpi_completed_loops
        </code>{" "}
        refreshed nightly via{" "}
        <code className="rounded bg-[var(--measured-card)] px-1 py-0.5">
          refresh_kpi_completed_loops()
        </code>
        .
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)]">
        <div className="border-b border-[var(--measured-border-soft)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          All loops · {rows.length} rows
        </div>
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[var(--measured-bg)] text-[var(--measured-subtext)]">
            <tr>
              <th className="px-4 py-2.5 font-medium">Patient</th>
              <th className="px-4 py-2.5 font-medium">Started</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={`${r.patient_id}-${r.started_at}`}
                className="border-t border-[var(--measured-border-soft)]"
              >
                <td className="px-4 py-2.5 font-medium text-[var(--measured-text)]">
                  {r.patient_id}
                </td>
                <td className="px-4 py-2.5 text-[var(--measured-subtext)]">
                  {new Date(r.started_at).toLocaleDateString([], {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-4 py-2.5">
                  {r.completed_loop ? (
                    <span className="inline-flex rounded-full bg-[var(--measured-green)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--measured-dark-green)]">
                      Completed
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-[var(--measured-clinical-amber)]/15 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--measured-clinical-amber)]">
                      In progress
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-4">
      <p className="text-[11px] uppercase tracking-wider text-[var(--measured-subtext)]">
        {label}
      </p>
      <p className={`mt-2 font-serif text-[28px] leading-none ${muted ? "text-[var(--measured-subtext)]" : "text-[var(--measured-dark)]"}`}>
        {value}
      </p>
    </div>
  );
}
