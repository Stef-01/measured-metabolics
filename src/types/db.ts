// Stage 5a database types — hand-mirrored from supabase/migrations/0001_init.sql.
// Stage 5b will replace this with `supabase gen types typescript` output.

export type Role = "patient" | "dietitian" | "gp" | "admin";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type Cuisine =
  | "south_asian"
  | "east_asian"
  | "mediterranean"
  | "middle_eastern"
  | "african"
  | "latin_american"
  | "european"
  | "oceania"
  | "other";

export type ReviewStatus =
  | "pending_ai"
  | "pending_review"
  | "approved"
  | "rejected";

export type ReferralStatus =
  | "new"
  | "in_progress"
  | "accepted"
  | "completed"
  | "cancelled";

export type SymptomSeverity = "mild" | "moderate" | "severe";

export type AiJobStatus = "queued" | "running" | "succeeded" | "failed";

export type ConsentKind = "clinical_care" | "rwe" | "marketing";

export type AuditAction =
  | "record.viewed"
  | "record.created"
  | "record.updated"
  | "record.deleted"
  | "meal.uploaded"
  | "meal.approved"
  | "meal.flagged"
  | "plan.drafted"
  | "plan.approved"
  | "plan.sent"
  | "report.drafted"
  | "report.approved"
  | "report.sent"
  | "referral.created"
  | "referral.accepted"
  | "consent.granted"
  | "consent.withdrawn"
  | "auth.signed_in"
  | "auth.signed_out"
  | "admin.exported"
  | "admin.impersonated"
  | "billing.scan.invoked"
  | "billing.suggestion.generated";

export interface Tables {
  organizations: {
    id: string;
    name: string;
    slug: string;
    type: string;
    created_at: string;
    updated_at: string;
  };
  users: {
    id: string;
    email: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    date_of_birth: string | null;
    created_at: string;
    updated_at: string;
  };
  memberships: {
    id: string;
    user_id: string;
    organization_id: string;
    role: Role;
    active: boolean;
    created_at: string;
  };
  patients: {
    id: string;
    user_id: string | null;
    external_id: string | null;
    organization_id: string | null;
    cuisine_pref: Cuisine | null;
    primary_dietitian_id: string | null;
    primary_gp_id: string | null;
    onboarded_at: string | null;
    archived_at: string | null;
    created_at: string;
    updated_at: string;
  };
  meal_logs: {
    id: string;
    patient_id: string;
    meal_type: MealType;
    logged_at: string;
    cuisine: Cuisine | null;
    portion_confidence: number | null;
    note: string | null;
    photo_url: string | null;
    storage_path: string | null;
    source: string;
    created_at: string;
    updated_at: string;
  };
  meal_analysis: {
    id: string;
    meal_log_id: string;
    ai_output_id: string | null;
    detected_dishes: unknown;
    est_carbs_g: number | null;
    est_protein_g: number | null;
    est_fat_g: number | null;
    est_fibre_g: number | null;
    glycaemic_load: number | null;
    cgm_pairing: unknown;
    rationale: string | null;
    confidence_score: number | null;
    requires_human_review: boolean;
    dietitian_review_status: ReviewStatus;
    reviewed_by: string | null;
    reviewed_at: string | null;
    safety_flags: string[];
    created_at: string;
    updated_at: string;
  };
  referrals: {
    id: string;
    patient_id: string;
    from_user_id: string;
    to_user_id: string | null;
    to_organization_id: string | null;
    reason: string | null;
    attached_documents: string[];
    cuisine_pref: Cuisine | null;
    priority: string | null;
    status: ReferralStatus;
    accepted_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
  };
  audit_events: {
    id: string;
    actor_user_id: string | null;
    actor_role: Role | null;
    action: AuditAction;
    target_type: string | null;
    target_id: string | null;
    patient_id: string | null;
    meta: Record<string, unknown>;
    ip: string | null;
    user_agent: string | null;
    occurred_at: string;
  };
  consent_records: {
    id: string;
    patient_id: string;
    kind: ConsentKind;
    version: string;
    granted: boolean;
    granted_at: string | null;
    withdrawn_at: string | null;
    evidence_url: string | null;
    created_at: string;
  };
}

export type Database = {
  public: {
    Tables: {
      [K in keyof Tables]: {
        Row: Tables[K];
        Insert: Partial<Tables[K]>;
        Update: Partial<Tables[K]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role_enum: Role;
      meal_type_enum: MealType;
      cuisine_enum: Cuisine;
      review_status_enum: ReviewStatus;
      referral_status_enum: ReferralStatus;
      symptom_severity_enum: SymptomSeverity;
      ai_job_status_enum: AiJobStatus;
      consent_kind_enum: ConsentKind;
      audit_action_enum: AuditAction;
    };
  };
};
