"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!configured) {
      setStatus("error");
      setErrorMsg(
        "Supabase not yet configured. Set env vars to enable sign-in.",
      );
      return;
    }
    setStatus("sending");
    try {
      const sb = supabaseBrowser();
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${origin}/auth/callback` },
      });
      if (error) throw error;
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Sign-in failed.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-3xl border border-[var(--measured-border)] bg-[var(--measured-card)] p-8 shadow-[var(--shadow-raised)]">
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--measured-green)] text-white shadow-[var(--shadow-card)]">
            <Mail size={18} strokeWidth={2.2} aria-hidden="true" />
          </div>
          <span className="font-serif text-[18px] tracking-tight text-[var(--measured-dark)]">
            Measured
          </span>
        </div>
        <h1 className="font-serif text-[28px] leading-tight tracking-tight text-[var(--measured-dark)]">
          Sign in
        </h1>
        <p className="mt-1.5 text-[14px] text-[var(--measured-subtext)]">
          We email a magic link — no passwords.
        </p>

        {!configured && (
          <p className="mt-4 rounded-2xl border border-[var(--measured-clinical-amber)] bg-[var(--measured-clinical-amber-soft)] p-3 text-[12px] text-[var(--measured-text)]">
            Stage 5a wiring complete; Supabase project not yet provisioned. Set
            <code className="mx-1 rounded bg-[var(--measured-card)] px-1">
              NEXT_PUBLIC_SUPABASE_URL
            </code>
            and
            <code className="mx-1 rounded bg-[var(--measured-card)] px-1">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>
            in <code>.env.local</code> to enable.
          </p>
        )}

        <form onSubmit={send} className="mt-6 space-y-4">
          <label className="block text-[12px] font-medium text-[var(--measured-subtext)]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@clinic.au"
              className="mt-1 block w-full rounded-2xl border border-[var(--measured-border)] bg-[var(--measured-bg)] px-4 py-3 text-[15px] text-[var(--measured-text)] outline-none focus:border-[var(--measured-accent)]"
            />
          </label>
          <button
            type="submit"
            disabled={status === "sending" || !email}
            className="cta-shadow flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--measured-green)] px-4 py-3 text-[15px] font-semibold text-white hover:bg-[var(--measured-dark-green)] disabled:opacity-50 transition-colors"
          >
            <Mail size={16} />
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Link sent"
                : "Send magic link"}
          </button>
        </form>

        {status === "sent" && (
          <p className="mt-4 text-[13px] text-[var(--measured-text)]">
            Check {email}. The link signs you in and routes you to your persona.
          </p>
        )}
        {status === "error" && errorMsg && (
          <p className="mt-4 rounded-xl bg-[var(--measured-evaluate)]/8 px-3 py-2 text-[13px] text-[var(--measured-evaluate)]">
            {errorMsg}
          </p>
        )}

        <p className="mt-6 text-[12px] text-[var(--measured-subtext)]">
          Demo only?{" "}
          <Link href="/" className="underline">
            Return to role chooser
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
