import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { supabaseServer } from "@/lib/supabase/server";
import { recordAudit } from "@/server/audit";
import type { ConsentKind } from "@/types/db";

/**
 * Stage 7 — Consent ledger (PRD §16.2).
 *
 * Three independent consent records: clinical_care (gates the entire app),
 * rwe (research / real-world evidence), marketing. RWE withdrawal must NOT
 * affect care; the policy here is enforced at the audit + service layer.
 */

export const CONSENT_VERSION = "1.0.0";

export interface ConsentState {
  clinical_care: boolean;
  rwe: boolean;
  marketing: boolean;
  versions: Partial<Record<ConsentKind, string>>;
  withdrawnAt: Partial<Record<ConsentKind, string | null>>;
}

const VIBE_DEFAULT: ConsentState = {
  clinical_care: true,
  rwe: false,
  marketing: false,
  versions: { clinical_care: CONSENT_VERSION },
  withdrawnAt: {},
};

export async function readConsent(patientId: string): Promise<ConsentState> {
  if (!isSupabaseConfigured()) return VIBE_DEFAULT;
  const sb = await supabaseServer();
  const { data } = await sb
    .from("consent_records")
    .select("*")
    .eq("patient_id", patientId);
  const rows = (data ?? []) as Array<{
    kind: ConsentKind;
    granted: boolean;
    version: string;
    withdrawn_at: string | null;
  }>;
  const state: ConsentState = {
    clinical_care: false,
    rwe: false,
    marketing: false,
    versions: {},
    withdrawnAt: {},
  };
  for (const row of rows) {
    state[row.kind] = row.granted && !row.withdrawn_at;
    state.versions[row.kind] = row.version;
    state.withdrawnAt[row.kind] = row.withdrawn_at;
  }
  return state;
}

export async function grantConsent(opts: {
  patientId: string;
  kind: ConsentKind;
  version?: string;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = await supabaseServer();
  await sb.from("consent_records").insert({
    patient_id: opts.patientId,
    kind: opts.kind,
    version: opts.version ?? CONSENT_VERSION,
    granted: true,
    granted_at: new Date().toISOString(),
  } as never);
  await recordAudit({
    action: "consent.granted",
    actorRole: "patient",
    targetType: "consent_record",
    patientId: opts.patientId,
    meta: { kind: opts.kind, version: opts.version ?? CONSENT_VERSION },
  });
}

export async function withdrawConsent(opts: {
  patientId: string;
  kind: ConsentKind;
}): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const sb = await supabaseServer();
  await sb
    .from("consent_records")
    .update({ withdrawn_at: new Date().toISOString() } as never)
    .eq("patient_id", opts.patientId)
    .eq("kind", opts.kind)
    .is("withdrawn_at", null);
  await recordAudit({
    action: "consent.withdrawn",
    actorRole: "patient",
    targetType: "consent_record",
    patientId: opts.patientId,
    meta: {
      kind: opts.kind,
      isolation: "rwe withdrawal does not affect clinical_care",
    },
  });
}
