import { PATIENTS, GP_PROFILES, DIETITIAN_PROFILES } from "@/lib/mock";
import { StatusDot } from "@/components/shared/status-dot";

type UserRole = "patient" | "dietitian" | "gp";

interface UserRow {
  id: string;
  name: string;
  role: UserRole;
  detail: string;
  consentStatus?: string;
}

export default function AdminUsersPage() {
  const rows: UserRow[] = [
    ...Object.values(DIETITIAN_PROFILES).map((d) => {
      const count = PATIENTS.filter(
        (p) => p.assignedDietitianId === d.id,
      ).length;
      return {
        id: d.id,
        name: d.name,
        role: "dietitian" as UserRole,
        detail: `${d.credential} · ${d.focus} · ${count} patient${count !== 1 ? "s" : ""}`,
      };
    }),
    ...Object.values(GP_PROFILES).map((gp) => {
      const count = PATIENTS.filter((p) => p.referringGpId === gp.id).length;
      return {
        id: gp.id,
        name: gp.name,
        role: "gp" as UserRole,
        detail: `${gp.clinic} · ${count} referral${count !== 1 ? "s" : ""}`,
      };
    }),
    ...PATIENTS.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      role: "patient" as UserRole,
      detail: `${p.conditions.join(", ")} · Week ${p.weekNumber}`,
      consentStatus: p.consentStatus,
    })),
  ];

  const ROLE_DOT_TONE: Record<UserRole, "good" | "low" | "neutral"> = {
    dietitian: "good",
    gp: "low",
    patient: "neutral",
  };

  const CONSENT_DOT_TONE: Record<string, "good" | "medium" | "high"> = {
    signed: "good",
    pending: "medium",
    withdrawn: "high",
  };

  const byRole: Record<UserRole, UserRow[]> = {
    dietitian: rows.filter((r) => r.role === "dietitian"),
    gp: rows.filter((r) => r.role === "gp"),
    patient: rows.filter((r) => r.role === "patient"),
  };

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Access control
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Users
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        {rows.length} users across {Object.keys(DIETITIAN_PROFILES).length}{" "}
        dietitians, {Object.keys(GP_PROFILES).length} GPs, and {PATIENTS.length}{" "}
        patients.
      </p>

      {(["dietitian", "gp", "patient"] as UserRole[]).map((role) => (
        <section key={role} className="mt-8">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
            {role === "gp"
              ? "GPs"
              : role.charAt(0).toUpperCase() + role.slice(1) + "s"}
            <span className="tnum ml-2 rounded-full bg-[var(--measured-cream)] px-2 py-0.5 text-[10px] normal-case tracking-normal">
              {byRole[role].length}
            </span>
          </h2>
          <ul className="mt-3 space-y-2">
            {byRole[role].map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--measured-border-soft)] bg-[var(--measured-card)] px-4 py-3 shadow-[var(--shadow-card)]"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-[var(--measured-dark)]">
                    {u.name}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[var(--measured-subtext)]">
                    {u.detail}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {u.consentStatus && CONSENT_DOT_TONE[u.consentStatus] && (
                    <StatusDot
                      tone={CONSENT_DOT_TONE[u.consentStatus]}
                      label={u.consentStatus}
                      size="sm"
                    />
                  )}
                  <StatusDot
                    tone={ROLE_DOT_TONE[u.role]}
                    label={u.role === "gp" ? "GP" : u.role}
                    size="sm"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
