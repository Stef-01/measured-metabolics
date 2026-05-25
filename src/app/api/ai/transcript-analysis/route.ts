import { NextRequest, NextResponse } from "next/server";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";

export async function POST(req: NextRequest) {
  let transcript: string, context: string;
  try {
    const body = (await req.json()) as {
      transcript?: unknown;
      context?: unknown;
    };
    transcript =
      typeof body.transcript === "string" ? body.transcript.slice(0, 8000) : "";
    context =
      typeof body.context === "string" ? body.context.slice(0, 2000) : "";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!transcript.trim()) {
    return NextResponse.json({ error: "transcript_required" }, { status: 422 });
  }

  try {
    const raw = await runStructured({
      schemaName: "transcript-analysis",
      variables: { transcript, context },
    });
    const safe = applySafety("transcript-analysis", raw);
    return NextResponse.json({
      ...(safe.output as object),
      requires_human_review: safe.requires_human_review,
      safety_flags: safe.safety_flags,
    });
  } catch (err) {
    if (err instanceof LLMUnconfiguredError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    console.error("[api/ai/transcript-analysis]", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
