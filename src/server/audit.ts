import "server-only";
import { supabaseServer } from "@/lib/supabase/server";
import type { AuditAction, Role } from "@/types/db";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export interface AuditInput {
  action: AuditAction;
  actorRole?: Role;
  targetType?: string;
  targetId?: string | null;
  patientId?: string | null;
  meta?: Record<string, unknown>;
}

/** Records an audit_events row. No-op when Supabase is unconfigured (vibe stages). */
export async function recordAudit(input: AuditInput): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  const row = {
    actor_user_id: user?.id ?? null,
    actor_role: input.actorRole ?? null,
    action: input.action,
    target_type: input.targetType ?? null,
    target_id: input.targetId ?? null,
    patient_id: input.patientId ?? null,
    meta: input.meta ?? {},
  };
  await sb.from("audit_events").insert(row as never);
}
