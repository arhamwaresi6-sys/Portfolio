import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/sections/SectionHeader";
import { getPublishedProjects } from "@/lib/projects";

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Projects"
            title="Work, systems, and product stories"
            description="A selection of digital products and systems built with care."
          />
          <GlassPanel className="p-5">
            <p role="status" className="text-sm text-silver/80">Loading projects...</p>
          </GlassPanel>
        </main>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}

async function ProjectsPageContent() {
  await connection();
  const { items: projects, error } = await getPublishedProjects();

  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Projects"
        title="Work, systems, and product stories"
        description="A selection of digital products and systems built with care."
      />

      {error ? (
        <GlassPanel className="p-5">
          <p role="alert" className="text-sm text-silver/80">{error}</p>
        </GlassPanel>
      ) : projects.length ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => {
            const imageUrl = project.image_urls?.[0];

            return (
              <GlassPanel key={project.id} className="group overflow-hidden p-3">
                <div className="rounded border border-white/10 bg-[#111111]">
                  <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(155,92,255,0.22),transparent_55%)]">
                    {imageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={imageUrl}
                        alt={`${project.title} website preview`}
                        loading={index < 3 ? "eager" : "lazy"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.32em] text-silver/70">
                        {project.category}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.22em] text-accent">
                        {project.category}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.22em] text-silver/60">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl text-white">{project.title}</h2>
                    <p className="text-sm leading-6 text-silver/75">{project.short_description}</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex text-[10px] uppercase tracking-[0.28em] text-white transition group-hover:text-accent"
                      >
                        Open project →
                      </Link>
                      {project.live_url ? (
                        <a
                          href={project.live_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] uppercase tracking-[0.2em] text-silver/70 hover:text-white"
                        >
                          Live site ↗
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            );
          })}
        </div>
      ) : (
        <GlassPanel className="p-6">
          <p className="text-sm leading-6 text-silver/75">
            Project stories will appear here as they are published.
          </p>
        </GlassPanel>
      )}
    </main>
  );
}
