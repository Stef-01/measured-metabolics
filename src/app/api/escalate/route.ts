import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  let patient_id: string, symptoms: string;
  try {
    const body = (await req.json()) as {
      patient_id?: unknown;
      symptoms?: unknown;
    };
    patient_id =
      typeof body.patient_id === "string" ? body.patient_id : "unknown";
    symptoms =
      typeof body.symptoms === "string" ? body.symptoms.slice(0, 300) : "";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    await inngest.send({
      name: "notification.dispatch",
      data: {
        kind: "symptom_escalation",
        patient_id,
        subject: `Severe symptoms — ${patient_id}`,
        body: `Patient reported: ${symptoms}. Please review immediately.`,
      },
    });
  } catch {
    // Inngest may not be reachable in demo mode — the patient store
    // records the symptom log client-side regardless.
  }

  return NextResponse.json({ ok: true });
}
