import { listPatients } from "@/server/services";

export default async function AdminPatientsPage() {
  const patients = await listPatients();
  return (
    <div>
      <h1 className="text-[24px] font-semibold text-[var(--measured-text)]">
        Patients
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        {patients.length} on file.
      </p>
      <ul className="mt-6 space-y-2">
        {patients.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)] px-4 py-3 text-[14px] text-[var(--measured-text)]"
          >
            {p.firstName} {p.lastName}{" "}
            <span className="text-[var(--measured-subtext)]">· {p.id}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
