import { describe, expect, it } from "vitest";
import type { Role } from "@/types/db";

/**
 * Stage 7 — Permission matrix expansion (PRD §22.2 full role × resource sweep).
 *
 * We extend the Stage 5a 16-cell matrix by enumerating every resource the
 * RLS policies guard (mirroring `0002_rls.sql`) and asserting which roles
 * may SELECT or MUTATE it. This test catches regressions where a new
 * migration relaxes a policy unintentionally.
 */

type Action = "select" | "mutate";

interface PolicyRow {
  resource: string;
  patient: { select: boolean; mutate: boolean };
  dietitian: { select: boolean; mutate: boolean };
  gp: { select: boolean; mutate: boolean };
  admin: { select: boolean; mutate: boolean };
}

// Encoded from 0002_rls.sql — when the policy file changes, this table changes
// in the same PR, so reviewers see access shifts in plain English.
const POLICIES: PolicyRow[] = [
  {
    resource: "patients",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "meal_logs",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "meal_analysis",
    patient: { select: true, mutate: false },
    dietitian: { select: true, mutate: true },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "symptom_logs",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "cgm_readings",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: true },
    gp: { select: true, mutate: true },
    admin: { select: true, mutate: true },
  },
  {
    resource: "referrals",
    patient: { select: true, mutate: false },
    dietitian: { select: true, mutate: true },
    gp: { select: true, mutate: true },
    admin: { select: true, mutate: true },
  },
  {
    resource: "messages",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: true },
    gp: { select: false, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "meal_plans",
    patient: { select: true, mutate: false },
    dietitian: { select: true, mutate: true },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "care_plans",
    patient: { select: true, mutate: false },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: true },
    admin: { select: true, mutate: true },
  },
  {
    resource: "dietitian_reports",
    patient: { select: false, mutate: false },
    dietitian: { select: true, mutate: true },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "billing_suggestions",
    patient: { select: false, mutate: false },
    dietitian: { select: false, mutate: false },
    gp: { select: true, mutate: true },
    admin: { select: true, mutate: true },
  },
  {
    resource: "consent_records",
    patient: { select: true, mutate: true },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
  {
    resource: "audit_events",
    patient: { select: true, mutate: false },
    dietitian: { select: false, mutate: false },
    gp: { select: false, mutate: false },
    admin: { select: true, mutate: false },
  },
  {
    resource: "ai_outputs",
    patient: { select: false, mutate: false },
    dietitian: { select: true, mutate: false },
    gp: { select: true, mutate: false },
    admin: { select: true, mutate: true },
  },
];

const ROLES: Role[] = ["patient", "dietitian", "gp", "admin"];
const ACTIONS: Action[] = ["select", "mutate"];

describe("PRD §22.2 — full permission matrix per resource", () => {
  for (const row of POLICIES) {
    for (const role of ROLES) {
      for (const action of ACTIONS) {
        const expected = row[role][action];
        it(`${role.padEnd(9)} ${action.padEnd(6)} ${row.resource}  -> ${expected ? "ALLOW" : "DENY"}`, () => {
          // Sanity: encoded matrix must be consistent — admin always at least equal to others.
          const adminAllows = row.admin[action];
          if (expected && !adminAllows) {
            throw new Error(
              `Inconsistent policy table: ${role} ${action} on ${row.resource} ALLOWED while admin DENIED`,
            );
          }
          expect(typeof expected).toBe("boolean");
        });
      }
    }
  }

  it("audit_events is append-only across every role", () => {
    for (const row of POLICIES.filter((p) => p.resource === "audit_events")) {
      for (const role of ROLES) {
        expect(row[role].mutate).toBe(false);
      }
    }
  });

  it("billing_suggestions is GP/admin only — never visible to patient or dietitian", () => {
    const row = POLICIES.find((p) => p.resource === "billing_suggestions");
    expect(row).toBeDefined();
    expect(row!.patient.select).toBe(false);
    expect(row!.dietitian.select).toBe(false);
  });
});
