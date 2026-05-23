import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";
import { recordAudit } from "@/server/audit";
import {
  PATIENTS,
  MEALS,
  REFERRALS,
  SYMPTOMS,
  THREADS,
  type Patient,
  type MealLog,
  type Referral,
  type SymptomLog,
  type MessageThread,
} from "@/lib/mock";

/**
 * Stage 5b service layer.
 *
 * Each function tries Supabase first when configured and falls back to the
 * Stage 1–4 mock fixtures so the app keeps working through the cutover. Every
 * mutation calls `recordAudit()` so the audit trail starts the moment Supabase
 * is wired in.
 */

export async function listPatients(): Promise<Patient[]> {
  if (!isSupabaseConfigured()) return PATIENTS;
  const sb = await supabaseServer();
  const { data } = await sb
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as Patient[];
}

export async function getPatient(id: string): Promise<Patient | undefined> {
  if (!isSupabaseConfigured()) return PATIENTS.find((p) => p.id === id);
  const sb = await supabaseServer();
  const { data } = await sb
    .from("patients")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data ?? undefined) as unknown as Patient | undefined;
}

export async function listMeals(patientId?: string): Promise<MealLog[]> {
  if (!isSupabaseConfigured()) {
    return patientId ? MEALS.filter((m) => m.patientId === patientId) : MEALS;
  }
  const sb = await supabaseServer();
  let q = sb
    .from("meal_logs")
    .select("*")
    .order("logged_at", { ascending: false });
  if (patientId) q = q.eq("patient_id", patientId);
  const { data } = await q;
  return (data ?? []) as unknown as MealLog[];
}

export async function approveMeal(
  mealId: string,
  dietitianId: string,
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = await supabaseServer();
  await sb
    .from("meal_analysis")
    .update({
      dietitian_review_status: "approved",
      reviewed_by: dietitianId,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq("meal_log_id", mealId);
  await recordAudit({
    action: "meal.approved",
    actorRole: "dietitian",
    targetType: "meal_log",
    targetId: mealId,
    meta: { reviewer: dietitianId },
  });
}

export async function listReferrals(): Promise<Referral[]> {
  if (!isSupabaseConfigured()) return REFERRALS;
  const sb = await supabaseServer();
  const { data } = await sb
    .from("referrals")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as Referral[];
}

export async function createReferral(input: {
  patientId: string;
  reason: string;
  cuisine?: string;
  priority?: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await sb.from("referrals").insert({
    patient_id: input.patientId,
    from_user_id: user.id,
    reason: input.reason,
    cuisine_pref: (input.cuisine ?? null) as never,
    priority: input.priority ?? "standard",
    status: "new",
  } as never);
  await recordAudit({
    action: "referral.created",
    actorRole: "gp",
    targetType: "patient",
    targetId: input.patientId,
    patientId: input.patientId,
  });
}

export async function listSymptoms(patientId: string): Promise<SymptomLog[]> {
  if (!isSupabaseConfigured()) {
    return SYMPTOMS.filter((s) => s.patientId === patientId);
  }
  const sb = await supabaseServer();
  const { data } = await sb
    .from("symptom_logs")
    .select("*")
    .eq("patient_id", patientId)
    .order("logged_at", { ascending: false });
  return (data ?? []) as unknown as SymptomLog[];
}

export async function listThreads(): Promise<MessageThread[]> {
  if (!isSupabaseConfigured()) return THREADS;
  const sb = await supabaseServer();
  const { data } = await sb
    .from("message_threads")
    .select("*")
    .order("last_message_at", { ascending: false });
  return (data ?? []) as unknown as MessageThread[];
}
