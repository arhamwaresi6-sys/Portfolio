"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfig } from "./config";

let supabaseClient;

export function createSupabaseBrowserClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const config = getSupabaseConfig();
  if (!config) {
    throw new Error("Supabase is not configured.");
  }

  supabaseClient = createBrowserClient(config.url, config.key);
  return supabaseClient;
}
