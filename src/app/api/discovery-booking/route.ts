import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createDiscoveryBooking } from "@/server/services/discovery-booking";

/**
 * Public discovery-call booking endpoint.
 *
 * Receives ONLY contact details + the chosen slot from the website funnel —
 * never any health data. Eligibility is screened client-side; this route just
 * validates and persists the lead (service-role write, see the service module).
 */

const TIME_BLOCKS = ["9-12", "12-3", "3-6", "6-9"] as const;

const BookingSchema = z.object({
  first_name: z.string().trim().min(1, "first name required").max(80),
  last_name: z.string().trim().max(80).optional().default(""),
  email: z.string().trim().toLowerCase().email().max(160),
  phone: z.string().trim().min(6, "phone required").max(40),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "expected yyyy-mm-dd"),
  time_block: z.enum(TIME_BLOCKS),
});

export async function POST(req: NextRequest) {
  let parsed: z.infer<typeof BookingSchema>;
  try {
    parsed = BookingSchema.parse(await req.json());
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_body" },
      { status: 400 },
    );
  }

  // Reject calendar dates in the past (1-day slack absorbs timezone skew).
  const today = new Date();
  today.setUTCDate(today.getUTCDate() - 1);
  if (parsed.preferred_date < today.toISOString().slice(0, 10)) {
    return NextResponse.json(
      { ok: false, error: "date_in_past" },
      { status: 400 },
    );
  }

  const result = await createDiscoveryBooking(parsed);

  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
