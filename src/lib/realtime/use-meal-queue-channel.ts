"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Subscribes the dietitian queue to Supabase Realtime so a meal approved in
 * one window vanishes from the queue in every other window within ~1s.
 *
 * No-ops when Supabase env is unset (vibe stages keep working from
 * `localStorage` cross-tab sync via the existing storage event).
 */
export function useMealQueueChannel() {
  const qc = useQueryClient();
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const sb = supabaseBrowser();
    const channel = sb
      .channel("dietitian-meal-queue")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meal_analysis" },
        () => {
          qc.invalidateQueries({ queryKey: ["meal-queue"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "meal_logs" },
        () => {
          qc.invalidateQueries({ queryKey: ["meal-queue"] });
        },
      )
      .subscribe();
    return () => {
      void sb.removeChannel(channel);
    };
  }, [qc]);
}
