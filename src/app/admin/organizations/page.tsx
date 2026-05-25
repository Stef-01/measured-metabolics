import { PATIENTS, GP_PROFILES, DIETITIAN_PROFILES } from "@/lib/mock";

export default function AdminOrganizationsPage() {
  const practices = Object.values(GP_PROFILES).map((gp) => {
    const gpPatients = PATIENTS.filter((p) => p.referringGpId === gp.id);
    const dietitianIds = new Set(gpPatients.map((p) => p.assignedDietitianId));
    const dietitians = Array.from(dietitianIds)
      .map((id) => DIETITIAN_PROFILES[id])
      .filter(Boolean);
    return { gp, patients: gpPatients, dietitians };
  });

  const totalPatients = PATIENTS.length;
  const totalGps = Object.keys(GP_PROFILES).length;
  const totalDietitians = Object.keys(DIETITIAN_PROFILES).length;
  const consentSigned = PATIENTS.filter(
    (p) => p.consentStatus === "signed",
  ).length;

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
        Network
      </p>
      <h1 className="mt-1 font-serif text-[34px] leading-tight tracking-tight text-[var(--measured-dark)]">
        Organizations
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        GP practices, assigned dietitians, and enrolled patients.
      </p>

      <div className="mt-6 grid grid-cols-4 gap-3">
        {[
          { label: "GP practices", value: totalGps },
          { label: "Dietitians", value: totalDietitians },
          { label: "Enrolled patients", value: totalPatients },
          {
            label: "Consent signed",
            value: `${consentSigned}/${totalPatients}`,
            accent: consentSigned === totalPatients,
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-4 ${
              s.accent
                ? "border-[var(--measured-accent)] bg-[var(--measured-accent-soft)]"
                : "border-[var(--measured-border)] bg-[var(--measured-card)]"
            }`}
          >
            <p className="text-[11px] uppercase tracking-wider text-[var(--measured-subtext)]">
              {s.label}
            </p>
            <p className="mt-1.5 text-[26px] font-semibold text-[var(--measured-text)]">
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
          GP practices
        </h2>
        <ul className="mt-3 space-y-4">
          {practices.map(({ gp, patients, dietitians }) => (
            <li
              key={gp.id}
              className="rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[15px] font-semibold text-[var(--measured-text)]">
                    {gp.clinic}
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--measured-subtext)]">
                    {gp.name} · {patients.length} patient
                    {patients.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="rounded-full bg-[var(--measured-accent-soft)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--measured-accent)]">
                  Active
                </span>
              </div>

              {dietitians.length > 0 && (
                <div className="mt-4 border-t border-[var(--measured-border-soft)] pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                    Assigned dietitians
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {dietitians.map((d) => (
                      <li
                        key={d.id}
                        className="rounded-xl bg-[var(--measured-bg)] px-3 py-1.5 text-[13px] text-[var(--measured-text)]"
                      >
                        <span className="font-medium">{d.name}</span>
                        <span className="ml-1.5 text-[var(--measured-subtext)]">
                          {d.credential} · {d.focus}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {patients.length > 0 && (
                <div className="mt-3 border-t border-[var(--measured-border-soft)] pt-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--measured-subtext)]">
                    Patients
                  </p>
                  <ul className="mt-2 space-y-1">
                    {patients.map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between gap-4 rounded-lg bg-[var(--measured-bg)] px-3 py-2 text-[13px]"
                      >
                        <span className="font-medium text-[var(--measured-text)]">
                          {p.firstName} {p.lastName}
                        </span>
                        <div className="flex items-center gap-3 text-[var(--measured-subtext)]">
                          <span>{p.conditions.join(", ")}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                              p.risk === "high"
                                ? "bg-[var(--measured-evaluate)]/10 text-[var(--measured-evaluate)]"
                                : p.risk === "medium"
                                  ? "bg-[var(--measured-clinical-amber)]/15 text-[var(--measured-clinical-amber)]"
                                  : "bg-[var(--measured-clinical-blue)]/10 text-[var(--measured-clinical-blue)]"
                            }`}
                          >
                            {p.risk}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
