"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/db";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isSupabaseConfigured } from "./env";

let client: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function supabaseBrowser() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase not configured (browser).");
  }
  if (!client) {
    client = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return client;
}
