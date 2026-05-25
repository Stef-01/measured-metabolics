import { NextRequest, NextResponse } from "next/server";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";

export async function POST(req: NextRequest) {
  let patient_summary: string, period: string, summary: string;
  try {
    const body = (await req.json()) as {
      patient_summary?: unknown;
      period?: unknown;
      summary?: unknown;
    };
    patient_summary =
      typeof body.patient_summary === "string"
        ? body.patient_summary.slice(0, 500)
        : "metabolic patient";
    period =
      typeof body.period === "string"
        ? body.period.slice(0, 100)
        : "last 4 weeks";
    summary =
      typeof body.summary === "string"
        ? body.summary.slice(0, 1000)
        : "no data";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  try {
    const raw = await runStructured({
      schemaName: "dietitian-report-draft",
      variables: { patient_summary, period, summary },
    });
    const safe = applySafety("dietitian-report-draft", raw);
    return NextResponse.json({
      ...(safe.output as object),
      requires_human_review: safe.requires_human_review,
      safety_flags: safe.safety_flags,
    });
  } catch (err) {
    if (err instanceof LLMUnconfiguredError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    console.error("[api/ai/report-draft]", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
