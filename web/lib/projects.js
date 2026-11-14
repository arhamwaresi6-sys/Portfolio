import {
  getSupabaseConfig,
  PROJECT_MEDIA_BUCKET,
} from "@/lib/supabase/config";
import { createSupabasePublicClient } from "@/lib/supabase/public";

async function addSignedMediaUrls(supabase, projects) {
  const paths = [
    ...new Set(
      projects.flatMap((project) => [
        ...(project.image_paths ?? []),
        project.video_path,
      ]).filter(Boolean),
    ),
  ];

  if (!paths.length) {
    return {
      projects: projects.map((project) => ({
        ...project,
        image_urls: [],
        video_media_url: null,
      })),
      error: null,
    };
  }

  const { data: signedFiles, error } = await supabase.storage
    .from(PROJECT_MEDIA_BUCKET)
    .createSignedUrls(paths, 3600);

  if (error) {
    console.error("Could not create project media URLs:", error.message);
    return { projects: null, error: "Project media could not be loaded right now." };
  }

  const urlsByPath = new Map(
    (signedFiles ?? []).map((file) => [file.path, file.signedUrl]),
  );
  const missingPath = paths.find((path) => !urlsByPath.get(path));
  if (missingPath) {
    console.error("Supabase did not return a signed URL for a project media file.");
    return { projects: null, error: "Project media could not be loaded right now." };
  }

  return {
    projects: projects.map((project) => ({
      ...project,
      image_urls: (project.image_paths ?? []).map((path) => urlsByPath.get(path)),
      video_media_url: project.video_path ? urlsByPath.get(project.video_path) : null,
    })),
    error: null,
  };
}

export async function getPublishedProjects({ featuredOnly = false } = {}) {
  if (!getSupabaseConfig()) {
    return {
      items: [],
      error: "Project content is not available yet.",
    };
  }

  const supabase = createSupabasePublicClient();
  let query = supabase
    .from("portfolio_projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (featuredOnly) {
    query = query.eq("featured", true);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Could not load published projects:", error.message);
    return { items: [], error: "Projects could not be loaded right now." };
  }

  const { projects, error: mediaError } = await addSignedMediaUrls(
    supabase,
    data ?? [],
  );
  if (mediaError) {
    return { items: [], error: mediaError };
  }

  return { items: projects, error: null };
}

export async function getPublishedProject(slug) {
  if (!getSupabaseConfig()) {
    return {
      project: null,
      error: "Project content is not available yet.",
    };
  }

  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error(`Could not load project "${slug}":`, error.message);
    return { project: null, error: "This project could not be loaded right now." };
  }

  if (!data) {
    return { project: null, error: null };
  }

  const { projects, error: mediaError } = await addSignedMediaUrls(supabase, [data]);
  if (mediaError) {
    return { project: null, error: mediaError };
  }

  return { project: projects[0], error: null };
}
