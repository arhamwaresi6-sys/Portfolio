"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GlassPanel } from "@/components/ui/GlassPanel";
import {
  OWNER_EMAIL,
  PROJECT_MEDIA_BUCKET,
} from "@/lib/supabase/config";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const EMPTY_FORM = {
  id: null,
  slug: "",
  title: "",
  short_description: "",
  category: "Website",
  overview: "",
  problem: "",
  solution: "",
  description: "",
  features: "",
  challenges: "",
  implementation_notes: "",
  tech_stack: "",
  live_url: "",
  github_url: "",
  video_url: "",
  image_paths: [],
  video_path: null,
  featured: false,
  published: false,
  sort_order: 0,
};

const ADMIN_SIGN_IN_COOLDOWN_KEY = "portfolio.adminSignInCooldownUntil";
const ADMIN_SIGN_IN_COOLDOWN_MS = 5 * 60 * 1000;

const fieldClassName =
  "admin-field mt-2 w-full rounded border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition placeholder:text-silver/40 focus:border-accent/70";

function formatCooldown(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseLines(value) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseTags(value) {
  return value
    .split(/[,\r\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateVideoFile(file) {
  return new Promise((resolve, reject) => {
    const source = URL.createObjectURL(file);
    const video = document.createElement("video");
    let timeout;

    const cleanup = () => {
      clearTimeout(timeout);
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("error", onError);
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(source);
    };

    const onLoadedData = () => {
      const hasVideoFrame = video.videoWidth > 0 && video.videoHeight > 0;
      cleanup();
      if (hasVideoFrame) resolve();
      else reject(new Error("The selected video has no decodable video frame."));
    };

    const onError = () => {
      cleanup();
      reject(new Error("The selected video has no browser-supported video stream."));
    };

    timeout = setTimeout(() => {
      cleanup();
      reject(new Error("The selected video did not produce a decodable frame in time."));
    }, 15000);

    video.preload = "auto";
    video.muted = true;
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("error", onError);
    video.src = source;
    video.load();
  });
}

function optionalHttpUrl(value, label) {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new Error(`${label} must be a valid URL.`);
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error(`${label} must start with http:// or https://.`);
  }

  return url.toString();
}

function getProjectForm(project) {
  return {
    ...EMPTY_FORM,
    ...project,
    features: (project.features ?? []).join("\n"),
    tech_stack: (project.tech_stack ?? []).join(", "),
    image_paths: project.image_paths ?? [],
    live_url: project.live_url ?? "",
    github_url: project.github_url ?? "",
    video_url: project.video_url ?? "",
    video_path: project.video_path ?? null,
  };
}

function MediaImage({ path, onRemove, alt = "Project media" }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadPreview() {
      try {
        const { data, error: signedUrlError } = await createSupabaseBrowserClient()
          .storage.from(PROJECT_MEDIA_BUCKET)
          .createSignedUrl(path, 3600);

        if (!active) {
          return;
        }

        if (signedUrlError) {
          setError(signedUrlError.message);
          return;
        }

        setUrl(data.signedUrl);
      } catch (previewError) {
        if (active) {
          setError(previewError instanceof Error ? previewError.message : "Preview unavailable.");
        }
      }
    }

    loadPreview();
    return () => {
      active = false;
    };
  }, [path]);

  return (
    <div className="relative overflow-hidden rounded border border-white/10">
      {url ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={url} alt={alt} className="aspect-video w-full object-cover" />
      ) : (
        <p role={error ? "alert" : "status"} className="p-4 text-xs text-silver/70">
          {error ? "Preview unavailable." : "Loading image preview..."}
        </p>
      )}
      <button
        type="button"
        onClick={onRemove}
        className="admin-button admin-button--danger admin-media-remove"
      >
        Remove
      </button>
    </div>
  );
}

export function AdminLogin({ errorMessage, infoMessage }) {
  const [message, setMessage] = useState(infoMessage ?? "");
  const [error, setError] = useState(errorMessage ?? "");
  const [isSending, setIsSending] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  useEffect(() => {
    function restoreCooldown() {
      try {
        const expiresAt = Number(window.localStorage.getItem(ADMIN_SIGN_IN_COOLDOWN_KEY) || 0);
        setCooldownSeconds(Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)));
      } catch (storageError) {
        console.error("Could not restore the admin sign-in cooldown:", storageError);
      }
    }

    restoreCooldown();
    const timer = window.setInterval(() => {
      setCooldownSeconds((remaining) => Math.max(0, remaining - 1));
    }, 1000);
    window.addEventListener("storage", restoreCooldown);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener("storage", restoreCooldown);
    };
  }, []);

  async function sendSignInLink() {
    if (isSending || cooldownSeconds > 0) {
      return;
    }

    setError("");
    setMessage("");
    setLinkSent(false);
    setIsSending(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: OWNER_EMAIL,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`,
        },
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      setLinkSent(true);
      setMessage(`Check ${OWNER_EMAIL} for your secure sign-in link. If it is not there, check your spam folder. You can request another link in five minutes.`);
      const expiresAt = Date.now() + ADMIN_SIGN_IN_COOLDOWN_MS;
      setCooldownSeconds(Math.ceil(ADMIN_SIGN_IN_COOLDOWN_MS / 1000));
      try {
        window.localStorage.setItem(ADMIN_SIGN_IN_COOLDOWN_KEY, String(expiresAt));
      } catch (storageError) {
        console.error("Could not save the admin sign-in cooldown:", storageError);
      }
    } catch (signInError) {
      setError(signInError instanceof Error ? signInError.message : "Could not request a sign-in link.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="admin-shell admin-shell--login">
      <div className="admin-heading">
        <p>Owner access</p>
        <h1>Project manager</h1>
      </div>
      <GlassPanel className="admin-login-card">
        <p className="text-sm leading-6 text-silver/80">
          Password-free sign-in. We&apos;ll email a one-time secure link to{" "}
          <strong className="text-white">{OWNER_EMAIL}</strong>.
        </p>
        {error ? (
          <p role="alert" className="admin-notice admin-notice--error mt-5">
            {error}
          </p>
        ) : null}
        {message ? (
          <p role="status" className="admin-notice admin-notice--info mt-5">
            {message}
          </p>
        ) : null}
        {linkSent ? (
          <a
            href={`https://mail.google.com/mail/u/0/?authuser=${encodeURIComponent(OWNER_EMAIL)}#inbox`}
            target="_blank"
            rel="noopener noreferrer"
            className="admin-button mt-6"
          >
            Open Gmail
          </a>
        ) : null}
        <button
          type="button"
          onClick={sendSignInLink}
          disabled={isSending || cooldownSeconds > 0}
          className={`admin-button ${linkSent ? "admin-button--secondary mt-3" : "mt-6"}`}
        >
          {isSending
            ? "Sending email..."
            : cooldownSeconds > 0
              ? `Resend available in ${formatCooldown(cooldownSeconds)}`
              : linkSent
                ? "Resend sign-in link"
                : "Email me a sign-in link"}
        </button>
      </GlassPanel>
    </main>
  );
}

export function AdminProjectManager({
  email,
  initialProjects,
  initialProfileImagePath,
  profileSettingsError,
}) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(EMPTY_FORM);
  const [profileImagePath, setProfileImagePath] = useState(initialProfileImagePath);
  const [savedProfileImagePath, setSavedProfileImagePath] = useState(initialProfileImagePath);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [videoFile, setVideoFile] = useState(null);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingProfileImage, setIsSavingProfileImage] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const draftsCount = projects.filter((project) => !project.published).length;

  function resetEditor() {
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setVideoFile(null);
    setRemoveVideo(false);
  }

  function editProject(project) {
    setForm(getProjectForm(project));
    setImageFiles([]);
    setVideoFile(null);
    setRemoveVideo(false);
    setError("");
    setNotice("");
    window.requestAnimationFrame(() => {
      document.getElementById("project-editor")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function uploadMedia(supabase, slug, kind, file, uploadedPaths) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const path = `${slug}/${kind}/${Date.now()}-${crypto.randomUUID()}-${safeName}`;
    const { data, error: uploadError } = await supabase.storage
      .from(PROJECT_MEDIA_BUCKET)
      .upload(path, file, {
        cacheControl: "31536000",
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Could not upload ${file.name}: ${uploadError.message}`);
    }

    uploadedPaths.push(data.path);
    return data.path;
  }

  async function saveProfileImage(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];
    if (
      profileImageFile &&
      (!allowedImageTypes.includes(profileImageFile.type) ||
        profileImageFile.size > 10 * 1024 * 1024)
    ) {
      setError("Choose a JPEG, PNG, WebP, AVIF, or GIF image no larger than 10 MB.");
      return;
    }

    setIsSavingProfileImage(true);
    const uploadedPaths = [];
    let nextPath = profileImagePath || null;

    try {
      const supabase = createSupabaseBrowserClient();
      if (profileImageFile) {
        nextPath = await uploadMedia(
          supabase,
          "profile",
          "portrait",
          profileImageFile,
          uploadedPaths,
        );
      }

      const { error: saveError } = await supabase
        .from("portfolio_site_settings")
        .upsert(
          { id: "main", profile_image_path: nextPath },
          { onConflict: "id" },
        );
      if (saveError) {
        throw new Error(saveError.message);
      }
    } catch (saveError) {
      let cleanupMessage = "";
      if (uploadedPaths.length) {
        try {
          const { error: cleanupError } = await createSupabaseBrowserClient()
            .storage.from(PROJECT_MEDIA_BUCKET)
            .remove(uploadedPaths);
          if (cleanupError) {
            cleanupMessage = ` Uploaded image cleanup failed: ${cleanupError.message}`;
          }
        } catch (cleanupError) {
          cleanupMessage = ` Uploaded image cleanup failed: ${
            cleanupError instanceof Error ? cleanupError.message : "unknown storage error"
          }`;
        }
      }

      setError(
        `${saveError instanceof Error ? saveError.message : "Could not save the portrait."}${cleanupMessage}`,
      );
      setIsSavingProfileImage(false);
      return;
    }

    const oldPath = savedProfileImagePath;
    setSavedProfileImagePath(nextPath ?? "");
    setProfileImagePath(nextPath ?? "");
    setProfileImageFile(null);
    setIsSavingProfileImage(false);
    router.refresh();

    if (oldPath && oldPath !== nextPath) {
      try {
        const { error: cleanupError } = await createSupabaseBrowserClient()
          .storage.from(PROJECT_MEDIA_BUCKET)
          .remove([oldPath]);
        if (cleanupError) {
          setNotice(`Portrait updated, but the previous image could not be removed: ${cleanupError.message}`);
          return;
        }
      } catch (cleanupError) {
        setNotice(
          `Portrait updated, but the previous image could not be removed: ${
            cleanupError instanceof Error ? cleanupError.message : "unknown storage error"
          }`,
        );
        return;
      }
    }

    setNotice(nextPath ? "Website portrait updated." : "Website portrait removed.");
  }

  async function saveProject(event) {
    event.preventDefault();
    setError("");
    setNotice("");

    const slug = slugify(form.slug);
    const title = form.title.trim();
    const summary = form.short_description.trim();

    if (!title || !summary || !slug) {
      setError("Project title, URL slug, and short description are required.");
      return;
    }

    if (summary.length > 500) {
      setError("The short description must be 500 characters or fewer.");
      return;
    }

    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
      "image/gif",
    ];
    const invalidImage = imageFiles.find(
      (file) => !allowedImageTypes.includes(file.type) || file.size > 10 * 1024 * 1024,
    );
    if (invalidImage) {
      setError("Each image must be an image file no larger than 10 MB.");
      return;
    }

    if (
      videoFile &&
      (!["video/mp4", "video/webm", "video/quicktime"].includes(videoFile.type) ||
        videoFile.size > 100 * 1024 * 1024)
    ) {
      setError("Choose an MP4, WebM, or MOV video no larger than 100 MB.");
      return;
    }

    if (videoFile) {
      try {
        await validateVideoFile(videoFile);
      } catch (validationError) {
        console.error("Could not decode the selected project video:", validationError);
        setError("This video cannot be played in your browser. Re-export it as an H.264 MP4 and try again.");
        return;
      }
    }

    setIsSaving(true);
    const supabase = createSupabaseBrowserClient();
    const uploadedPaths = [];
    let savedProject;

    try {
      const newImagePaths = [];
      for (const file of imageFiles) {
        newImagePaths.push(await uploadMedia(supabase, slug, "images", file, uploadedPaths));
      }

      const newVideoPath = videoFile
        ? await uploadMedia(supabase, slug, "videos", videoFile, uploadedPaths)
        : null;
      const videoPath = newVideoPath ?? (removeVideo ? null : form.video_path);
      const payload = {
        slug,
        title,
        short_description: summary,
        category: form.category.trim() || "General",
        overview: form.overview.trim(),
        problem: form.problem.trim(),
        solution: form.solution.trim(),
        description: form.description.trim(),
        features: parseLines(form.features),
        challenges: form.challenges.trim(),
        implementation_notes: form.implementation_notes.trim(),
        tech_stack: parseTags(form.tech_stack),
        live_url: optionalHttpUrl(form.live_url, "Live website"),
        github_url: optionalHttpUrl(form.github_url, "GitHub URL"),
        video_url: optionalHttpUrl(form.video_url, "Video URL"),
        image_paths: [...form.image_paths, ...newImagePaths],
        video_path: videoPath,
        featured: form.featured,
        published: form.published,
        sort_order: Number(form.sort_order) || 0,
      };

      const projectQuery = form.id
        ? supabase.from("portfolio_projects").update(payload).eq("id", form.id)
        : supabase.from("portfolio_projects").insert(payload);
      const { data, error: saveError } = await projectQuery.select("*").single();

      if (saveError) {
        throw new Error(saveError.message);
      }

      savedProject = data;
    } catch (saveError) {
      let cleanupMessage = "";
      if (uploadedPaths.length) {
        try {
          const { error: cleanupError } = await supabase.storage
            .from(PROJECT_MEDIA_BUCKET)
            .remove(uploadedPaths);
          if (cleanupError) {
            cleanupMessage = ` Uploaded files could not be cleaned up: ${cleanupError.message}`;
          }
        } catch (cleanupError) {
          cleanupMessage = ` Uploaded files could not be cleaned up: ${
            cleanupError instanceof Error ? cleanupError.message : "unknown storage error"
          }`;
        }
      }

      setError(
        `${saveError instanceof Error ? saveError.message : "Could not save the project."}${cleanupMessage}`,
      );
      setIsSaving(false);
      return;
    }

    const oldImagePaths = form.image_paths.filter(
      (path) => !savedProject.image_paths.includes(path),
    );
    const oldVideoPath =
      form.video_path && form.video_path !== savedProject.video_path ? [form.video_path] : [];
    const oldMediaPaths = [...oldImagePaths, ...oldVideoPath];

    setProjects((current) => {
      const remaining = current.filter((project) => project.id !== savedProject.id);
      return [...remaining, savedProject].sort(
        (left, right) =>
          left.sort_order - right.sort_order ||
          new Date(right.created_at) - new Date(left.created_at),
      );
    });
    resetEditor();
    setIsSaving(false);

    if (oldMediaPaths.length) {
      try {
        const { error: cleanupError } = await supabase.storage
          .from(PROJECT_MEDIA_BUCKET)
          .remove(oldMediaPaths);
        if (cleanupError) {
          setNotice(`Project saved, but old media cleanup failed: ${cleanupError.message}`);
          return;
        }
      } catch (cleanupError) {
        setNotice(
          `Project saved, but old media cleanup failed: ${
            cleanupError instanceof Error ? cleanupError.message : "unknown storage error"
          }`,
        );
        return;
      }
    }

    setNotice(form.id ? "Project updated." : "Project created.");
  }

  async function deleteProject(project) {
    if (!window.confirm(`Delete "${project.title}" and remove it from the portfolio?`)) {
      return;
    }

    setError("");
    setNotice("");
    const supabase = createSupabaseBrowserClient();
    let data;
    try {
      const result = await supabase
        .from("portfolio_projects")
        .delete()
        .eq("id", project.id)
        .select("id");

      if (result.error) {
        setError(`Could not delete the project: ${result.error.message}`);
        return;
      }

      data = result.data;
    } catch (deleteError) {
      setError(
        `Could not delete the project: ${
          deleteError instanceof Error ? deleteError.message : "unknown database error"
        }`,
      );
      return;
    }

    if (!data?.length) {
      setError("The project was not found or is no longer available.");
      return;
    }

    setProjects((current) => current.filter((item) => item.id !== project.id));
    if (form.id === project.id) {
      resetEditor();
    }

    const mediaPaths = [...(project.image_paths ?? []), project.video_path].filter(Boolean);
    if (mediaPaths.length) {
      try {
        const { error: mediaError } = await supabase.storage
          .from(PROJECT_MEDIA_BUCKET)
          .remove(mediaPaths);
        if (mediaError) {
          setError(`Project deleted, but media cleanup failed: ${mediaError.message}`);
          return;
        }
      } catch (mediaError) {
        setError(
          `Project deleted, but media cleanup failed: ${
            mediaError instanceof Error ? mediaError.message : "unknown storage error"
          }`,
        );
        return;
      }
    }

    setNotice("Project deleted.");
  }

  async function signOut() {
    setError("");
    setIsSigningOut(true);

    try {
      const { error: signOutError } = await createSupabaseBrowserClient().auth.signOut();
      if (signOutError) {
        setError(`Could not sign out: ${signOutError.message}`);
        setIsSigningOut(false);
        return;
      }
    } catch (signOutError) {
      setError(
        `Could not sign out: ${
          signOutError instanceof Error ? signOutError.message : "unknown authentication error"
        }`,
      );
      setIsSigningOut(false);
      return;
    }

    router.refresh();
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div className="admin-heading">
          <p>Owner-only</p>
          <h1>Project manager</h1>
          <p>Signed in as {email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={isSigningOut}
          className="admin-button admin-button--secondary"
        >
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </header>

      <div className="admin-stats">
        {[
          ["Projects", projects.length],
          ["Published", projects.filter((project) => project.published).length],
          ["Drafts", draftsCount],
        ].map(([label, count]) => (
          <GlassPanel key={label} className="admin-stat-card">
            <p className="text-[10px] uppercase tracking-[0.22em] text-silver/70">{label}</p>
            <p className="mt-4 text-3xl text-white">{String(count).padStart(2, "0")}</p>
          </GlassPanel>
        ))}
      </div>

      {error ? (
        <p role="alert" className="admin-notice admin-notice--error mt-6">
          {error}
        </p>
      ) : null}
      {notice ? (
        <p role="status" className="admin-notice admin-notice--info mt-6">
          {notice}
        </p>
      ) : null}

      <GlassPanel className="admin-panel-section">
        <div className="admin-section-heading">
          <p>Website portrait</p>
          <h2>Homepage picture</h2>
          <p className="mt-2 text-sm leading-6 text-silver/70">
            Replace the portrait shown in the homepage intro. The change appears on the public site after saving.
          </p>
        </div>

        {profileSettingsError ? (
          <p role="alert" className="admin-notice admin-notice--error mb-5">
            {profileSettingsError}
          </p>
        ) : null}

        <form onSubmit={saveProfileImage} className="admin-profile-form">
          <div>
            {profileImagePath ? (
              <MediaImage
                path={profileImagePath}
                alt="Current homepage portrait"
                onRemove={() => setProfileImagePath("")}
              />
            ) : (
              <p className="rounded border border-white/10 p-4 text-xs leading-5 text-silver/70">
                The built-in portrait is currently being used.
              </p>
            )}
          </div>
          <div className="space-y-4">
            <label className="block text-xs text-silver" htmlFor="profile-image">
              Choose a new portrait
              <input
                id="profile-image"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                onChange={(event) => setProfileImageFile(event.target.files?.[0] ?? null)}
                disabled={Boolean(profileSettingsError) || isSavingProfileImage}
                className={`${fieldClassName} file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white`}
              />
            </label>
            <p className="text-[11px] text-silver/60">JPEG, PNG, WebP, AVIF, or GIF, up to 10 MB.</p>
            {profileImageFile ? (
              <p className="text-xs text-silver/70">Selected: {profileImageFile.name}</p>
            ) : null}
            <button
              type="submit"
              disabled={Boolean(profileSettingsError) || isSavingProfileImage}
              className="admin-button"
            >
              {isSavingProfileImage ? "Saving portrait..." : "Save portrait"}
            </button>
          </div>
        </form>
      </GlassPanel>

      <div className="admin-workspace">
        <GlassPanel className="admin-editor-panel">
          <div className="admin-section-heading mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] text-accent">
                {form.id ? "Edit project" : "New project"}
              </p>
              <h2 className="mt-2 font-display text-2xl text-white">
                {form.id ? form.title || "Project details" : "Add to your portfolio"}
              </h2>
            </div>
            {form.id ? (
              <button
                type="button"
                onClick={resetEditor}
                className="admin-button admin-button--secondary"
              >
                New project
              </button>
            ) : null}
          </div>

          <form id="project-editor" onSubmit={saveProject} className="admin-editor-form scroll-mt-24 space-y-6">
            <div className="admin-field-grid">
              <label className="block text-xs text-silver">
                Project title *
                <input
                  required
                  value={form.title}
                  onChange={(event) => {
                    const title = event.target.value;
                    setForm((current) => ({
                      ...current,
                      title,
                      slug: current.id ? current.slug : slugify(title),
                    }));
                  }}
                  className={fieldClassName}
                  maxLength={255}
                />
              </label>
              <label className="block text-xs text-silver">
                URL slug *
                <input
                  required
                  value={form.slug}
                  onChange={(event) => updateField("slug", slugify(event.target.value))}
                  className={fieldClassName}
                  maxLength={255}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                />
              </label>
              <label className="block text-xs text-silver">
                Category
                <input
                  value={form.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className={fieldClassName}
                  maxLength={120}
                />
              </label>
              <label className="block text-xs text-silver">
                Sort order
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) => updateField("sort_order", event.target.value)}
                  className={fieldClassName}
                />
              </label>
            </div>

            <label className="block text-xs text-silver">
              Short description *
              <textarea
                required
                value={form.short_description}
                onChange={(event) => updateField("short_description", event.target.value)}
                className={fieldClassName}
                rows={2}
                maxLength={500}
              />
            </label>

            <div className="admin-field-grid">
              {[
                ["Overview", "overview"],
                ["Problem", "problem"],
                ["Solution", "solution"],
                ["Full description", "description"],
                ["Challenges", "challenges"],
                ["Implementation notes", "implementation_notes"],
              ].map(([label, name]) => (
                <label key={name} className="block text-xs text-silver">
                  {label}
                  <textarea
                    value={form[name]}
                    onChange={(event) => updateField(name, event.target.value)}
                    className={fieldClassName}
                    rows={3}
                  />
                </label>
              ))}
            </div>

            <div className="admin-field-grid">
              <label className="block text-xs text-silver">
                Tech stack (comma-separated)
                <textarea
                  value={form.tech_stack}
                  onChange={(event) => updateField("tech_stack", event.target.value)}
                  className={fieldClassName}
                  rows={3}
                  placeholder="Next.js, Supabase, Tailwind CSS"
                />
              </label>
              <label className="block text-xs text-silver">
                Features (one per line)
                <textarea
                  value={form.features}
                  onChange={(event) => updateField("features", event.target.value)}
                  className={fieldClassName}
                  rows={3}
                />
              </label>
            </div>

            <div className="admin-field-grid">
              {[
                ["Live website URL", "live_url"],
                ["GitHub repository URL", "github_url"],
                ["External video URL (optional)", "video_url"],
              ].map(([label, name]) => (
                <label key={name} className="block text-xs text-silver">
                  {label}
                  <input
                    type="url"
                    value={form[name]}
                    onChange={(event) => updateField(name, event.target.value)}
                    className={fieldClassName}
                    placeholder="https://"
                  />
                </label>
              ))}
            </div>

            <div className="space-y-4 rounded border border-white/10 p-4">
              <div>
                <label className="block text-xs text-silver" htmlFor="project-images">
                  Project images
                </label>
                <input
                  id="project-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
                  multiple
                  onChange={(event) => setImageFiles(Array.from(event.target.files ?? []))}
                  className={`${fieldClassName} file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white`}
                />
                <p className="mt-2 text-[11px] text-silver/60">Images up to 10 MB each.</p>
              </div>

              {form.image_paths.length ? (
                <div className="admin-image-grid">
                  {form.image_paths.map((path) => (
                    <MediaImage
                      key={path}
                      path={path}
                      onRemove={() =>
                        updateField(
                          "image_paths",
                          form.image_paths.filter((imagePath) => imagePath !== path),
                        )
                      }
                    />
                  ))}
                </div>
              ) : null}
              {imageFiles.length ? (
                <p className="text-xs text-silver/70">
                  New images: {imageFiles.map((file) => file.name).join(", ")}
                </p>
              ) : null}

              <div>
                <label className="block text-xs text-silver" htmlFor="project-video">
                  Website video
                </label>
                <input
                  id="project-video"
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(event) => {
                    setVideoFile(event.target.files?.[0] ?? null);
                    setRemoveVideo(false);
                  }}
                  className={`${fieldClassName} file:mr-3 file:rounded file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:text-white`}
                />
                <p className="mt-2 text-[11px] text-silver/60">
                  MP4, WebM, or MOV up to 100 MB. H.264 MP4 is recommended.
                </p>
              </div>
              {form.video_path && !removeVideo ? (
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-silver/80">
                  <span>Uploaded video is attached.</span>
                  <button
                    type="button"
                    onClick={() => setRemoveVideo(true)}
                    className="admin-button admin-button--quiet admin-button--danger"
                  >
                    Remove video
                  </button>
                </div>
              ) : null}
              {videoFile ? <p className="text-xs text-silver/70">New video: {videoFile.name}</p> : null}
            </div>

            <div className="flex flex-wrap gap-6">
              <label className="inline-flex items-center gap-2 text-xs text-silver">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => updateField("featured", event.target.checked)}
                  className="accent-accent"
                />
                Show in home carousel
              </label>
              <label className="inline-flex items-center gap-2 text-xs text-silver">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => updateField("published", event.target.checked)}
                  className="accent-accent"
                />
                Publish on website
              </label>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="admin-button"
            >
              {isSaving ? "Saving project..." : form.id ? "Save changes" : "Create project"}
            </button>
          </form>
        </GlassPanel>

        <div className="admin-project-list">
          <div className="admin-section-heading">
            <p>Your content</p>
            <h2>Projects</h2>
          </div>
          {projects.length ? (
            projects.map((project) => (
              <GlassPanel key={project.id} className="admin-project-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-silver/60">
                      {project.category} · {project.published ? "Published" : "Draft"}
                    </p>
                    <h3 className="mt-2 truncate font-display text-xl text-white">{project.title}</h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-silver/70">
                      {project.short_description}
                    </p>
                  </div>
                  <span className="text-xs text-silver/50">{project.sort_order}</span>
                </div>
                <div className="admin-project-actions">
                  <button
                    type="button"
                    onClick={() => editProject(project)}
                    aria-label={`Edit all details for ${project.title}`}
                    className="admin-button admin-button--quiet"
                  >
                    Edit all details
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProject(project)}
                    className="admin-button admin-button--quiet admin-button--danger"
                  >
                    Delete
                  </button>
                </div>
              </GlassPanel>
            ))
          ) : (
            <GlassPanel className="admin-project-card">
              <p className="text-sm leading-6 text-silver/75">
                No projects yet. Add a project here, then publish it when it is ready.
              </p>
            </GlassPanel>
          )}
        </div>
      </div>
    </main>
  );
}
