import { listReferrals, listPatients } from "@/server/services";
import { StatusDot } from "@/components/shared/status-dot";

const STATUS_DOT_TONE: Record<string, "low" | "medium" | "good" | "neutral"> = {
  new: "low",
  consent_pending: "medium",
  accepted: "good",
  in_progress: "good",
  discharged: "neutral",
};

const STATUS_TONE: Record<string, string> = {
  new: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
  consent_pending:
    "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  accepted: "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
  in_progress:
    "bg-[var(--measured-green)]/10 text-[var(--measured-dark-green)]",
  discharged: "bg-[var(--measured-cream)] text-[var(--measured-subtext)]",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  consent_pending: "Consent pending",
  accepted: "Accepted",
  in_progress: "In progress",
  discharged: "Discharged",
};

export default async function AdminReferralsPage() {
  const [refs, patients] = await Promise.all([listReferrals(), listPatients()]);
  const patientMap = new Map(patients.map((p) => [p.id, p]));

  const byStatus = refs.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Referral pipeline
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Referrals
      </h1>
      <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
        {refs.length} total · GP to dietitian hand-offs across all practices.
      </p>

      {Object.keys(byStatus).length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {Object.entries(byStatus).map(([status, count]) => (
            <span
              key={status}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${STATUS_TONE[status] ?? "bg-[var(--measured-cream)] text-[var(--measured-subtext)]"}`}
            >
              {STATUS_LABEL[status] ?? status}
              <span className="font-bold">{count}</span>
            </span>
          ))}
        </div>
      )}

      <ul className="mt-6 space-y-2">
        {refs.map((r) => {
          const patient = patientMap.get(r.patientId);
          const displayName = patient
            ? `${patient.firstName} ${patient.lastName}`
            : r.patientId;
          return (
            <li
              key={r.id}
              className="rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-card)] px-4 py-3 shadow-[var(--shadow-card)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[14px] font-semibold text-[var(--measured-text)]">
                      {displayName}
                    </span>
                    <StatusDot
                      tone={STATUS_DOT_TONE[r.status] ?? "neutral"}
                      label={STATUS_LABEL[r.status] ?? r.status}
                      size="sm"
                    />
                    {r.priority && (
                      <StatusDot
                        tone={r.priority as "high" | "medium" | "low"}
                        label={`${r.priority} priority`}
                        size="sm"
                      />
                    )}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
                    {r.referringGpName} · {r.cuisineLabel} ·{" "}
                    <span className="tnum">
                      {new Date(r.createdAt).toLocaleDateString([], {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {r.reason && (
                    <p className="mt-1 text-[12px] italic text-[var(--measured-subtext)]">
                      &ldquo;{r.reason}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
