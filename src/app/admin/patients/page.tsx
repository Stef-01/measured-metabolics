import { listPatients } from "@/server/services";
import { StatusDot } from "@/components/shared/status-dot";

const RISK_TONE: Record<string, string> = {
  high: "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]",
  medium:
    "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]",
  low: "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]",
};

const CONSENT_DOT_TONE: Record<string, "good" | "medium" | "high"> = {
  signed: "good",
  pending: "medium",
  withdrawn: "high",
};

export default async function AdminPatientsPage() {
  const patients = await listPatients();
  const byRisk = {
    high: patients.filter((p) => p.risk === "high").length,
    medium: patients.filter((p) => p.risk === "medium").length,
    low: patients.filter((p) => p.risk === "low").length,
  };

  return (
    <div className="max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Caseload
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Patients
      </h1>
      <p className="mt-1 text-[14px] text-[var(--measured-subtext)]">
        {patients.length} enrolled across all practices.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {(["high", "medium", "low"] as const).map((risk) => (
          <span
            key={risk}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${RISK_TONE[risk]}`}
          >
            {risk.charAt(0).toUpperCase() + risk.slice(1)} risk
            <span className="font-bold">{byRisk[risk]}</span>
          </span>
        ))}
      </div>

      <ul className="mt-6 space-y-2">
        {patients.map((p) => {
          const initials = `${p.firstName[0]}${p.lastName[0]}`;
          return (
            <li
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-card)] px-4 py-3 shadow-[var(--shadow-card)]"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                style={{
                  backgroundColor:
                    p.risk === "high"
                      ? "var(--measured-evaluate)"
                      : p.risk === "medium"
                        ? "var(--measured-clinical-amber)"
                        : "var(--measured-clinical-blue)",
                }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[14px] font-semibold text-[var(--measured-text)]">
                    {p.firstName} {p.lastName}
                  </span>
                  <StatusDot tone={p.risk} label={`${p.risk} risk`} size="sm" />
                  {p.consentStatus && CONSENT_DOT_TONE[p.consentStatus] && (
                    <StatusDot
                      tone={CONSENT_DOT_TONE[p.consentStatus]}
                      label={p.consentStatus}
                      size="sm"
                    />
                  )}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-[var(--measured-subtext)]">
                  <span>{p.conditions.join(" · ")}</span>
                  <span>·</span>
                  <span>HbA1c <span className="tnum">{p.hbA1cPct}%</span></span>
                  <span>·</span>
                  <span>TIR <span className="tnum">{p.timeInRangePct}%</span></span>
                  <span>·</span>
                  <span>Wk <span className="tnum">{p.weekNumber}</span></span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
