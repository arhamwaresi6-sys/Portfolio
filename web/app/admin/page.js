import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import "./admin.css";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { AdminLogin, AdminProjectManager } from "@/components/admin/AdminWorkspace";
import {
  getMissingSupabaseConfigMessage,
  OWNER_EMAIL,
} from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default function AdminPage({ searchParams }) {
  return (
    <Suspense
      fallback={
        <main className="admin-shell admin-shell--message">
          <div className="admin-heading">
            <p>Owner-only</p>
            <h1>Project manager</h1>
          </div>
          <GlassPanel className="admin-login-card">
            <p role="status" className="text-sm leading-6 text-silver/80">Loading project manager...</p>
          </GlassPanel>
        </main>
      }
    >
      <AdminPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function AdminPageContent({ searchParams }) {
  await connection();
  const { authError } = (await searchParams) ?? {};
  const configMessage = getMissingSupabaseConfigMessage();

  if (configMessage) {
    return (
      <main className="admin-shell admin-shell--message">
        <div className="admin-heading">
          <p>Owner-only</p>
          <h1>Project manager</h1>
        </div>
        <GlassPanel className="admin-login-card">
          <p role="alert" className="text-sm leading-6 text-silver/80">
            {configMessage}
          </p>
        </GlassPanel>
      </main>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();

  if (claimsError && claimsError.name !== "AuthSessionMissingError") {
    console.error("Could not verify the project manager session:", claimsError.message);
    return <AdminLogin errorMessage="Your sign-in session could not be verified. Request a new link." />;
  }

  const claims = claimsData?.claims;
  if (!claims) {
    return (
      <AdminLogin
        errorMessage={
          authError === "invalid-link"
            ? "That sign-in link is invalid or expired. Request a new one."
            : ""
        }
      />
    );
  }

  const email = typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  if (email !== OWNER_EMAIL) {
    notFound();
  }

  const [projectsResult, settingsResult] = await Promise.all([
    supabase
      .from("portfolio_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("portfolio_site_settings")
      .select("profile_image_path")
      .eq("id", "main")
      .maybeSingle(),
  ]);
  const { data: projects, error: projectsError } = projectsResult;
  const { data: settings, error: settingsError } = settingsResult;

  if (projectsError) {
    console.error("Could not load projects for the project manager:", projectsError.message);
    return (
      <main className="admin-shell admin-shell--message">
        <div className="admin-heading">
          <p>Owner-only</p>
          <h1>Project manager</h1>
        </div>
        <GlassPanel className="admin-login-card">
          <p role="alert" className="text-sm leading-6 text-silver/80">
            The project database is not ready. Apply the Supabase migration at{" "}
            <code className="text-white">supabase/migrations</code>, then refresh this page.
          </p>
        </GlassPanel>
      </main>
    );
  }

  if (settingsError) {
    console.error("Could not load portfolio settings:", settingsError.message);
  }

  return (
    <AdminProjectManager
      email={email}
      initialProjects={projects ?? []}
      initialProfileImagePath={settings?.profile_image_path ?? ""}
      profileSettingsError={
        settingsError ? "Apply the profile image migration to enable portrait editing." : ""
      }
    />
  );
}
