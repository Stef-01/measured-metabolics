import "server-only";
import { isSupabaseServiceConfigured } from "@/lib/supabase/env";
import { supabaseService } from "@/lib/supabase/server";
import type { DiscoveryTimeBlock } from "@/types/db";

/**
 * Discovery-call lead capture (PRD — public funnel).
 *
 * The website assessment funnel pre-screens eligibility entirely client-side.
 * Only the contact fields + chosen slot reach this service — deliberately NO
 * health information (height, weight, BMI, age, activity, goals) is sent or
 * stored. Writes use the service role so the public anon key never touches the
 * `discovery_bookings` table (RLS denies anon by default).
 */

export interface DiscoveryBookingInput {
  first_name: string;
  last_name?: string;
  email: string;
  phone: string;
  /** ISO calendar date, yyyy-mm-dd (the requested call day). */
  preferred_date: string;
  time_block: DiscoveryTimeBlock;
}

export type DiscoveryBookingResult =
  | { ok: true; persisted: true; id: string }
  | { ok: true; persisted: false }
  | { ok: false; persisted: false; error: string };

export async function createDiscoveryBooking(
  input: DiscoveryBookingInput,
): Promise<DiscoveryBookingResult> {
  // Vibe / demo mode — accept the booking so the funnel completes, but make it
  // clear nothing was persisted. Surfacing config gaps beats silently dropping
  // a real lead.
  if (!isSupabaseServiceConfigured()) {
    console.warn(
      "[discovery-booking] Supabase service role not configured — booking not persisted.",
    );
    return { ok: true, persisted: false };
  }

  const sb = supabaseService();
  // `as never` mirrors the repo-wide insert convention: the hand-mirrored
  // Database type omits Relationships, so supabase-js infers payloads as never.
  const { data, error } = await sb
    .from("discovery_bookings")
    .insert({
      first_name: input.first_name,
      last_name: input.last_name?.trim() || null,
      email: input.email,
      phone: input.phone,
      preferred_date: input.preferred_date,
      time_block: input.time_block,
      source: "website_funnel",
    } as never)
    .select("id")
    .single();

  const row = data as { id: string } | null;
  if (error || !row) {
    console.error("[discovery-booking] insert failed:", error?.message);
    return { ok: false, persisted: false, error: "db_error" };
  }

  return { ok: true, persisted: true, id: row.id };
}
