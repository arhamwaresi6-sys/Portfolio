import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/config";

export async function GET(request) {
  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextPath = requestUrl.searchParams.get("next");
  const redirectPath =
    nextPath?.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/admin";

  if (!code) {
    return NextResponse.redirect(new URL("/admin?authError=invalid-link", request.url));
  }

  const response = NextResponse.redirect(new URL(redirectPath, request.url));
  response.headers.set("Cache-Control", "no-store");

  const cookieStore = await cookies();
  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("Could not complete the Supabase sign-in callback:", error.message);
    return NextResponse.redirect(new URL("/admin?authError=invalid-link", request.url));
  }

  return response;
}
