"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/**
 * Uploads a meal photo into the `meal-photos` bucket under
 * `{userId}/{logId}.jpg`. Returns the storage path so the caller can write it
 * onto `meal_logs.storage_path` and the resolved signed URL for immediate UI.
 *
 * Falls back to a `data:` URL in vibe stages so the patient flow keeps working
 * without Supabase. The caller stores either the data URL (vibe) or the
 * storage path (real) on the meal log row.
 */
export async function uploadMealPhoto(
  blob: Blob,
  opts: { userId: string; logId: string },
): Promise<{
  storagePath: string | null;
  signedUrl: string | null;
  dataUrl: string | null;
}> {
  if (!isSupabaseConfigured()) {
    const dataUrl = await blobToDataUrl(blob);
    return { storagePath: null, signedUrl: null, dataUrl };
  }
  const sb = supabaseBrowser();
  const path = `${opts.userId}/${opts.logId}.jpg`;
  const { error } = await sb.storage.from("meal-photos").upload(path, blob, {
    contentType: blob.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw error;
  const { data: signed } = await sb.storage
    .from("meal-photos")
    .createSignedUrl(path, 60 * 60);
  return {
    storagePath: path,
    signedUrl: signed?.signedUrl ?? null,
    dataUrl: null,
  };
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
