import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";

interface AuditRow {
  id: string;
  occurred_at: string;
  actor_user_id: string | null;
  actor_role: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  patient_id: string | null;
  meta: Record<string, unknown>;
}

const VIBE_FIXTURE: AuditRow[] = [
  {
    id: "audit-1",
    occurred_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    actor_user_id: "asha",
    actor_role: "patient",
    action: "meal.uploaded",
    target_type: "meal_log",
    target_id: "m1",
    patient_id: "asha",
    meta: {
      requires_human_review: true,
      safety_flags: ["provider_unconfigured"],
    },
  },
  {
    id: "audit-2",
    occurred_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    actor_user_id: "maya",
    actor_role: "dietitian",
    action: "meal.approved",
    target_type: "meal_log",
    target_id: "m1",
    patient_id: "asha",
    meta: { reviewer: "maya" },
  },
  {
    id: "audit-3",
    occurred_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    actor_user_id: "lee",
    actor_role: "gp",
    action: "referral.created",
    target_type: "patient",
    target_id: "asha",
    patient_id: "asha",
    meta: { reason: "Pre-diabetes; cuisine-aligned coaching" },
  },
];

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; patient?: string }>;
}) {
  const sp = await searchParams;
  let rows: AuditRow[] = VIBE_FIXTURE;
  if (isSupabaseConfigured()) {
    const sb = await supabaseServer();
    let q = sb
      .from("audit_events")
      .select("*")
      .order("occurred_at", { ascending: false })
      .limit(200);
    if (sp.action) q = q.eq("action", sp.action);
    if (sp.patient) q = q.eq("patient_id", sp.patient);
    const { data } = await q;
    rows = (data ?? []) as unknown as AuditRow[];
  }

  return (
    <div>
      <header className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-[var(--measured-subtext)]">
            Compliance
          </p>
          <h1 className="mt-1 text-[24px] font-semibold text-[var(--measured-text)]">
            Audit log
          </h1>
          <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
            Append-only. Filter by action or patient via query string ({" "}
            <code className="rounded bg-[var(--measured-card)] px-1">
              ?action=meal.approved
            </code>
            ,{" "}
            <code className="rounded bg-[var(--measured-card)] px-1">
              ?patient=asha
            </code>
            ).
          </p>
        </div>
        <p className="text-[12px] text-[var(--measured-subtext)]">
          {rows.length} rows
        </p>
      </header>

      <div className="overflow-hidden rounded-3xl border border-[var(--measured-border)] bg-[var(--measured-card)]">
        <table className="w-full text-left text-[13px]">
          <thead className="bg-[var(--measured-bg)] text-[var(--measured-subtext)]">
            <tr>
              <th className="px-4 py-2 font-medium">When</th>
              <th className="px-4 py-2 font-medium">Actor</th>
              <th className="px-4 py-2 font-medium">Action</th>
              <th className="px-4 py-2 font-medium">Target</th>
              <th className="px-4 py-2 font-medium">Patient</th>
              <th className="px-4 py-2 font-medium">Meta</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr
                key={r.id}
                className="border-t border-[var(--measured-border-soft)] align-top"
              >
                <td className="px-4 py-2 text-[var(--measured-text)]">
                  {new Date(r.occurred_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-[var(--measured-text)]">
                  <span className="font-medium">{r.actor_role ?? "—"}</span>
                  <span className="ml-1 text-[var(--measured-subtext)]">
                    {r.actor_user_id ?? "—"}
                  </span>
                </td>
                <td className="px-4 py-2 text-[var(--measured-text)]">
                  {r.action}
                </td>
                <td className="px-4 py-2 text-[var(--measured-subtext)]">
                  {r.target_type ?? "—"}
                  {r.target_id ? (
                    <span className="ml-1 text-[var(--measured-text)]">
                      {r.target_id}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-2 text-[var(--measured-text)]">
                  {r.patient_id ?? "—"}
                </td>
                <td className="px-4 py-2 text-[var(--measured-subtext)]">
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">
                    {JSON.stringify(r.meta, null, 0)}
                  </pre>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-[12px] text-[var(--measured-subtext)]">
        Stage 7 vibe view: showing seeded fixtures. Stage 8 KPI page joins audit
        + meals to compute the north-star &ldquo;completed care loop rate&rdquo;
        metric.
      </p>
    </div>
  );
}
