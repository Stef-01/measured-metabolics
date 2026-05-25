import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { PATIENTS, THREADS, mealsForPatient } from "@/lib/mock";
import { symptomsForPatient } from "@/lib/mock/symptoms";
import { REFERRALS } from "@/lib/mock/referrals";

export async function POST(req: NextRequest) {
  let patient_id: string;
  try {
    const body = (await req.json()) as { patient_id?: unknown };
    patient_id =
      typeof body.patient_id === "string" ? body.patient_id : "unknown";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const patient = PATIENTS.find((p) => p.id === patient_id);
  if (!patient) {
    return NextResponse.json({ error: "patient_not_found" }, { status: 404 });
  }

  const context = {
    patient,
    thread: THREADS.find((t) => t.patientId === patient_id),
    symptoms: symptomsForPatient(patient_id),
    meals: mealsForPatient(patient_id),
    referral: REFERRALS.find((r) => r.patientId === patient_id),
  };

  try {
    await inngest.send({
      name: "billing.scan.requested",
      data: { patient_id, context },
    });
  } catch {
    // Inngest unreachable in demo mode — context is already shown client-side.
  }

  return NextResponse.json({ ok: true, patient_id });
}
