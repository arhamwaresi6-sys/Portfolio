import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { getPublishedProject } from "@/lib/projects";

export default function ProjectDetailPage({ params }) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <GlassPanel className="p-6">
            <p role="status" className="text-sm text-silver/80">Loading project...</p>
          </GlassPanel>
        </main>
      }
    >
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}

async function ProjectDetailContent({ params }) {
  await connection();
  const { slug } = await params;
  const { project, error } = await getPublishedProject(slug);

  if (error) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <GlassPanel className="p-6">
          <p role="alert" className="text-sm text-silver/80">{error}</p>
          <Link href="/projects" className="mt-5 inline-flex text-[10px] uppercase tracking-[0.28em] text-white">
            ← Back to projects
          </Link>
        </GlassPanel>
      </main>
    );
  }

  if (!project) {
    notFound();
  }

  const imageUrls = project.image_urls ?? [];
  const videoUrl = project.video_media_url ?? project.video_url;

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <Link
        href="/projects"
        className="inline-flex text-[10px] uppercase tracking-[0.28em] text-silver/80 hover:text-white"
      >
        ← Back to projects
      </Link>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent">{project.category}</p>
          <h1 className="mt-3 font-display text-5xl text-white sm:text-6xl">{project.title}</h1>
          <p className="mt-5 text-base leading-7 text-silver/80">{project.short_description}</p>
          {project.overview ? (
            <p className="mt-5 text-sm leading-7 text-silver/70">{project.overview}</p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-5">
            {project.live_url ? (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-[0.24em] text-white hover:text-accent"
              >
                Visit live site ↗
              </a>
            ) : null}
            {project.github_url ? (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-[0.24em] text-white hover:text-accent"
              >
                View source ↗
              </a>
            ) : null}
          </div>
        </div>

        <GlassPanel className="overflow-hidden p-3">
          {imageUrls[0] ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded border border-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrls[0]}
                alt={`${project.title} preview`}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center rounded border border-white/10 bg-[radial-gradient(circle_at_top,rgba(155,92,255,0.2),transparent_55%),linear-gradient(135deg,#161616,#0d0d0d)] text-center text-[10px] uppercase tracking-[0.3em] text-silver/75">
              {project.category}
            </div>
          )}
        </GlassPanel>
      </div>

      {imageUrls.length > 1 ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {imageUrls.slice(1).map((imageUrl, index) => (
            <GlassPanel key={imageUrl} className="overflow-hidden p-2">
              <div className="relative aspect-video overflow-hidden rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`${project.title} gallery image ${index + 2}`}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </GlassPanel>
          ))}
        </div>
      ) : null}

      {videoUrl ? (
        <GlassPanel className="mt-8 overflow-hidden p-3">
          {project.video_media_url ? (
            <video
              controls
              preload="metadata"
              poster={imageUrls[0] ?? undefined}
              src={videoUrl}
              className="w-full rounded border border-white/10"
            >
              Your browser does not support embedded video.
            </video>
          ) : (
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex p-4 text-[10px] uppercase tracking-[0.24em] text-white hover:text-accent"
            >
              Watch project video ↗
            </a>
          )}
        </GlassPanel>
      ) : null}

      {project.description ? (
        <GlassPanel className="mt-8 p-6">
          <p className="whitespace-pre-line text-sm leading-7 text-silver/80">{project.description}</p>
        </GlassPanel>
      ) : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {project.problem ? (
          <GlassPanel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Problem</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-silver/80">{project.problem}</p>
          </GlassPanel>
        ) : null}
        {project.solution ? (
          <GlassPanel className="p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Solution</p>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-silver/80">{project.solution}</p>
          </GlassPanel>
        ) : null}
      </div>

      {project.features?.length ? (
        <GlassPanel className="mt-8 p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Highlights</p>
          <ul className="mt-4 grid gap-3 text-sm leading-6 text-silver/80 sm:grid-cols-2">
            {project.features.map((feature) => <li key={feature}>— {feature}</li>)}
          </ul>
        </GlassPanel>
      ) : null}

      {project.tech_stack?.length ? (
        <div className="mt-8 space-y-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Tech stack</p>
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/10 bg-white/5 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-silver"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {project.challenges || project.implementation_notes ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {project.challenges ? (
            <GlassPanel className="p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Challenges</p>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-silver/80">{project.challenges}</p>
            </GlassPanel>
          ) : null}
          {project.implementation_notes ? (
            <GlassPanel className="p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] text-accent">Implementation notes</p>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-silver/80">
                {project.implementation_notes}
              </p>
            </GlassPanel>
          ) : null}
        </div>
      ) : null}
    </main>
  );
}
