import { getSupabaseConfig, PROJECT_MEDIA_BUCKET } from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

export async function getPublishedProfileImageUrl() {
  if (!getSupabaseConfig()) {
    return null;
  }

  const supabase = createSupabasePublicClient();
  const { data: settings, error: settingsError } = await supabase
    .from("portfolio_site_settings")
    .select("profile_image_path")
    .eq("id", "main")
    .maybeSingle();

  if (settingsError) {
    console.error("Could not load the portfolio profile image setting:", settingsError.message);
    return null;
  }

  if (!settings?.profile_image_path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(PROJECT_MEDIA_BUCKET)
    .createSignedUrl(settings.profile_image_path, 3600);

  if (error || !data?.signedUrl) {
    console.error(
      "Could not create a signed URL for the portfolio profile image:",
      error?.message ?? "No signed URL was returned.",
    );
    return null;
  }

  return data.signedUrl;
}
