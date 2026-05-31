// Stage 5a — Supabase env probe. Vibe stages run with mocks; real Supabase
// features no-op gracefully until the three environment variables below are
// set in `.env.local`.

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

/**
 * Service-role writes (e.g. public discovery-call bookings) need the URL plus
 * the service-role key. Falls back to a graceful no-op when unset so demo /
 * vibe stages keep working without a backend.
 */
export function isSupabaseServiceConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

export function assertSupabaseConfigured(): void {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase env not set. Copy .env.example → .env.local and provide NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}
