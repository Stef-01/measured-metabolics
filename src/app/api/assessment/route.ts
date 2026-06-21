import { NextRequest, NextResponse } from "next/server";

/**
 * Assessment submission.
 *
 * Emails a completed funnel assessment to the clinic, regardless of the
 * eligibility outcome, so the team can follow up. Sends via Resend when
 * RESEND_API_KEY is set; otherwise it logs and no-ops gracefully so the funnel
 * UX never breaks in demo / unconfigured environments.
 */

const TO_EMAIL = "care@clove.au";

type Payload = {
  first?: unknown;
  last?: unknown;
  email?: unknown;
  mobile?: unknown;
  age?: unknown;
  gender?: unknown;
  heightCm?: unknown;
  weightKg?: unknown;
  activity?: unknown;
  priorities?: unknown;
  eligible?: unknown;
};

const str = (v: unknown, max = 200) =>
  typeof v === "string"
    ? v.slice(0, max)
    : typeof v === "number"
      ? String(v)
      : "";

export async function POST(req: NextRequest) {
  let data: Payload;
  try {
    data = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const first = str(data.first, 80);
  const last = str(data.last, 80);
  const email = str(data.email, 160);
  const mobile = str(data.mobile, 40);
  const age = str(data.age, 4);
  const gender = str(data.gender, 40);
  const heightCm = str(data.heightCm, 5);
  const weightKg = str(data.weightKg, 5);
  const activity = str(data.activity, 120);
  const priorities = Array.isArray(data.priorities)
    ? data.priorities
        .filter((p): p is string => typeof p === "string")
        .slice(0, 12)
        .join(", ")
    : "";
  const eligible = data.eligible === true;

  const subject =
    `New assessment — ${first} ${last}`.trim() +
    (eligible ? " (qualified)" : " (not eligible)");
  const body = [
    `Name: ${first} ${last}`.trim(),
    `Email: ${email}`,
    `Mobile: ${mobile}`,
    `Age: ${age}`,
    `Sex: ${gender}`,
    `Height: ${heightCm} cm`,
    `Weight: ${weightKg} kg`,
    `Activity: ${activity}`,
    `Priorities: ${priorities}`,
    `Eligibility: ${eligible ? "Met the metabolic-baseline pre-screen" : "Did not meet pre-screen"}`,
    "",
    "Sent from the CLOVE assessment funnel.",
  ].join("\n");

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "CLOVE <noreply@measured.health>",
          to: [TO_EMAIL],
          reply_to: email || undefined,
          subject,
          text: body,
        }),
      });
      if (!res.ok) {
        const err = await res.text();
        console.error("[assessment] Resend error", res.status, err);
        return NextResponse.json({ ok: false, sent: false }, { status: 502 });
      }
    } catch (e) {
      console.error("[assessment] send failed", e);
      return NextResponse.json({ ok: false, sent: false }, { status: 502 });
    }
    return NextResponse.json({ ok: true, sent: true });
  }

  // No mail provider configured: record server-side and succeed so the funnel
  // still advances to the booking step.
  console.info("[assessment] RESEND_API_KEY unset — not emailed:", subject);
  return NextResponse.json({ ok: true, sent: false });
}
