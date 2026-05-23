import "server-only";
import { recordAudit } from "@/server/audit";
import type { SymptomSeverity } from "@/types/db";

/**
 * Stage 7 — Escalation engine (PRD §16.5).
 *
 * Seven triggers; every match returns the safe-escalation copy that the
 * patient app shows, *plus* a side-effect path that alerts the dietitian and
 * writes an audit row. The copy is intentionally non-emergency:
 *   "If this is a medical emergency, call 000."
 * Measured never claims real-time emergency capacity.
 */

export interface EscalationContext {
  patientId: string;
  domain: string;
  severity: SymptomSeverity;
  note?: string;
}

export interface EscalationOutcome {
  triggered: boolean;
  ruleId: string | null;
  copy: string | null;
  alertDietitian: boolean;
}

const SAFE_COPY =
  "Thank you for telling us. Your dietitian has been alerted and will reach out within one business day. " +
  "If this is a medical emergency, call 000 or go to your nearest emergency department. " +
  "Measured does not provide real-time emergency care.";

interface Rule {
  id: string;
  match: (ctx: EscalationContext) => boolean;
  copy: string;
  alertDietitian: boolean;
}

const RULES: Rule[] = [
  {
    id: "e1-severe-hypo",
    match: (c) =>
      c.domain === "hypo" &&
      (c.severity === "severe" || /unconscious|fainted/i.test(c.note ?? "")),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
  {
    id: "e2-severe-nausea-72h",
    match: (c) =>
      c.domain === "nausea" &&
      c.severity === "severe" &&
      /72h|three days|3 days/i.test(c.note ?? ""),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
  {
    id: "e3-suicidality",
    match: (c) =>
      /suicid|self.harm|kill myself/i.test(c.note ?? "") ||
      (c.domain === "mental_health" && c.severity === "severe"),
    copy:
      "Please tell someone you trust right now. " +
      "Lifeline: 13 11 14 (24/7). Beyond Blue: 1300 22 4636. " +
      "If you are in immediate danger, call 000. Your dietitian has been alerted.",
    alertDietitian: true,
  },
  {
    id: "e4-medication-non-adherence-7d",
    match: (c) =>
      c.domain === "medication" &&
      /missed|skipped/i.test(c.note ?? "") &&
      /7|seven/i.test(c.note ?? ""),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
  {
    id: "e5-rapid-weight-loss",
    match: (c) =>
      c.domain === "weight" && /rapid|>3kg|>5kg/i.test(c.note ?? ""),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
  {
    id: "e6-severe-constipation-2w",
    match: (c) =>
      c.domain === "constipation" &&
      c.severity === "severe" &&
      /2 weeks|14 days|fortnight/i.test(c.note ?? ""),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
  {
    id: "e7-cgm-extreme",
    match: (c) =>
      c.domain === "cgm" &&
      (c.severity === "severe" || /3.0|<3 mmol|>20 mmol/i.test(c.note ?? "")),
    copy: SAFE_COPY,
    alertDietitian: true,
  },
];

export async function evaluateEscalation(
  ctx: EscalationContext,
): Promise<EscalationOutcome> {
  const rule = RULES.find((r) => r.match(ctx));
  if (!rule) {
    return {
      triggered: false,
      ruleId: null,
      copy: null,
      alertDietitian: false,
    };
  }
  await recordAudit({
    action: "record.created",
    actorRole: "patient",
    targetType: "escalation",
    patientId: ctx.patientId,
    meta: { ruleId: rule.id, domain: ctx.domain, severity: ctx.severity },
  });
  return {
    triggered: true,
    ruleId: rule.id,
    copy: rule.copy,
    alertDietitian: rule.alertDietitian,
  };
}

/** Pure-logic variant for unit tests (no audit / DB side effect). */
export function matchEscalation(ctx: EscalationContext): {
  ruleId: string | null;
  copy: string | null;
} {
  const rule = RULES.find((r) => r.match(ctx));
  return rule
    ? { ruleId: rule.id, copy: rule.copy }
    : { ruleId: null, copy: null };
}

export const ESCALATION_RULE_IDS = RULES.map((r) => r.id);
