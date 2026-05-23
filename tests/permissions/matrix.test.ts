import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { Role } from "@/types/db";

/**
 * Stage 5a — 16-cell permission matrix.
 *
 * The four roles (patient, dietitian, gp, admin) crossed with four resource
 * scopes (own, assigned, referred, other) yields 16 cells. Each cell encodes
 * the *expected* RLS outcome for a SELECT against a row in that scope. The
 * test asserts the policy decision tree (mirrored from `0002_rls.sql`)
 * agrees with PRD §22.2.
 *
 * When `NEXT_PUBLIC_SUPABASE_URL` is set, an integration variant should be
 * added at `tests/permissions/integration.spec.ts` (Stage 5b) that runs the
 * same matrix against a live Supabase project with seeded actors.
 */

type Scope = "own" | "assigned" | "referred" | "other";

interface Actor {
  role: Role;
  patientId?: string;
  assignedPatients: Set<string>;
  referredPatients: Set<string>;
  hasClinicalAccess?: boolean;
}

interface Row {
  patientId: string;
}

function canSeePatient(actor: Actor, row: Row): boolean {
  // Mirrors auth_can_see_patient() in 0002_rls.sql.
  if (actor.role === "admin") return Boolean(actor.hasClinicalAccess);
  if (actor.role === "patient") return actor.patientId === row.patientId;
  if (actor.role === "dietitian")
    return actor.assignedPatients.has(row.patientId);
  if (actor.role === "gp") return actor.referredPatients.has(row.patientId);
  return false;
}

const ASHA = "patient-asha";
const KEN = "patient-ken";
const LINA = "patient-lina";
const OMAR = "patient-omar";

const actors: Record<Role, Actor> = {
  patient: {
    role: "patient",
    patientId: ASHA,
    assignedPatients: new Set(),
    referredPatients: new Set(),
  },
  dietitian: {
    role: "dietitian",
    assignedPatients: new Set([ASHA, KEN]),
    referredPatients: new Set(),
  },
  gp: {
    role: "gp",
    assignedPatients: new Set(),
    referredPatients: new Set([ASHA, LINA]),
  },
  admin: {
    role: "admin",
    assignedPatients: new Set(),
    referredPatients: new Set(),
    hasClinicalAccess: true,
  },
};

const rowFor = (scope: Scope, role: Role): Row => {
  // "own" means the actor's own patient row — only meaningful for the
  // patient role. For clinician roles "own" is intentionally a non-related
  // patient row so the matrix correctly asserts they cannot read random
  // patients via the "this is mine" code path.
  if (scope === "own") {
    if (role === "patient") return { patientId: ASHA };
    if (role === "admin") return { patientId: ASHA };
    return { patientId: OMAR };
  }
  if (scope === "assigned") return { patientId: KEN };
  if (scope === "referred") return { patientId: LINA };
  return { patientId: OMAR };
};

// PRD §22.2 expectations encoded as a truth table.
// Each cell: actor's role × scope of the row → expected access?
const EXPECTED: Record<Role, Record<Scope, boolean>> = {
  patient: { own: true, assigned: false, referred: false, other: false },
  dietitian: { own: false, assigned: true, referred: false, other: false },
  gp: { own: false, assigned: false, referred: true, other: false },
  admin: { own: true, assigned: true, referred: true, other: true },
};

describe("RLS permission matrix (PRD §22.2 — 16 cells)", () => {
  const roles: Role[] = ["patient", "dietitian", "gp", "admin"];
  const scopes: Scope[] = ["own", "assigned", "referred", "other"];

  for (const role of roles) {
    for (const scope of scopes) {
      const actor = actors[role];
      const row = rowFor(scope, role);
      const expected = EXPECTED[role][scope];
      it(`${role.padEnd(9)} × ${scope.padEnd(8)} -> ${expected ? "ALLOW" : "DENY"}`, () => {
        const got = canSeePatient(actor, row);
        expect(got).toBe(expected);
      });
    }
  }
});

describe("Admin without clinical_access claim is denied clinical reads", () => {
  it("admin without clinical_access -> DENY", () => {
    const adminNoClaim: Actor = {
      role: "admin",
      assignedPatients: new Set(),
      referredPatients: new Set(),
      hasClinicalAccess: false,
    };
    expect(canSeePatient(adminNoClaim, { patientId: ASHA })).toBe(false);
  });
});

describe("Audit immutability invariant (mirrors 0001_init.sql trigger)", () => {
  it("audit_events_immutable() blocks UPDATE/DELETE conceptually", () => {
    // The trigger raises an exception. We assert the rule exists in the
    // SQL by reading the migration file at build time. (Lightweight — just
    // a presence check; integration test in Stage 5b verifies on live DB.)
    const sql = readFileSync(
      join(process.cwd(), "supabase/migrations/0001_init.sql"),
      "utf8",
    );
    expect(sql).toMatch(/audit_events_no_update/);
    expect(sql).toMatch(/audit_events_no_delete/);
    expect(sql).toMatch(/append-only/);
  });
});
