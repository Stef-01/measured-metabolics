import { NextRequest, NextResponse } from "next/server";
import { runStructured, LLMUnconfiguredError } from "@/ai/provider";
import { applySafety } from "@/ai/safety";

export async function POST(req: NextRequest) {
  let thread: string, latest: string;
  try {
    const body = (await req.json()) as {
      thread?: unknown;
      latest?: unknown;
    };
    thread = typeof body.thread === "string" ? body.thread.slice(0, 4000) : "";
    latest = typeof body.latest === "string" ? body.latest.slice(0, 500) : "";
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!latest.trim()) {
    return NextResponse.json({ error: "latest_required" }, { status: 422 });
  }

  try {
    const raw = await runStructured({
      schemaName: "message-assistant",
      variables: { thread, latest },
    });
    const safe = applySafety("message-assistant", raw);
    return NextResponse.json({
      ...(safe.output as object),
      requires_human_review: safe.requires_human_review,
    });
  } catch (err) {
    if (err instanceof LLMUnconfiguredError) {
      return NextResponse.json({ error: "unconfigured" }, { status: 503 });
    }
    console.error("[api/ai/message-assistant]", err);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
