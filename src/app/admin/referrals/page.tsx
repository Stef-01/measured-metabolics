import { listReferrals } from "@/server/services";

export default async function AdminReferralsPage() {
  const refs = await listReferrals();
  return (
    <div>
      <h1 className="text-[24px] font-semibold text-[var(--measured-text)]">
        Referrals
      </h1>
      <p className="mt-1 text-[13px] text-[var(--measured-subtext)]">
        {refs.length} on file.
      </p>
      <ul className="mt-6 space-y-2">
        {refs.map((r) => (
          <li
            key={r.id}
            className="rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-card)] px-4 py-3 text-[14px] text-[var(--measured-text)]"
          >
            <span className="font-semibold">{r.patientId}</span>{" "}
            <span className="text-[var(--measured-subtext)]">
              · {r.status} · {new Date(r.createdAt).toLocaleDateString()} · from {r.referringGpName}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
