import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { SectionHeader } from "@/components/sections/SectionHeader";

const projects = [
  {
    title: "PLACEHOLDER: project title",
    category: "Full-Stack",
    summary: "PLACEHOLDER: add a concise project summary.",
  },
  {
    title: "PLACEHOLDER: project title",
    category: "Product Design",
    summary: "PLACEHOLDER: add a concise project summary.",
  },
  {
    title: "PLACEHOLDER: project title",
    category: "Web Experience",
    summary: "PLACEHOLDER: add a concise project summary.",
  },
];

export function ProjectShowcase() {
  return (
    <section id="projects" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Featured projects"
          title="Selected work"
          description="PLACEHOLDER: add a short editorial intro about the projects you want to feature."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project, index) => (
            <GlassPanel key={project.title + index} className="group overflow-hidden p-3">
              <div className="rounded border border-white/10 bg-[#111111] p-0">
                <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,rgba(155,92,255,0.26),transparent_50%),linear-gradient(135deg,#1a1a1a,#101010)]">
                  <div className="aspect-[4/3] flex items-center justify-center text-center text-[10px] uppercase tracking-[0.32em] text-silver/70">
                    {project.category}
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-accent">
                      {project.category}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-silver/60">0{index + 1}</span>
                  </div>

                  <h3 className="font-display text-2xl text-white">{project.title}</h3>
                  <p className="text-sm leading-6 text-silver/75">{project.summary}</p>

                  <Link
                    href="/projects"
                    className="inline-flex text-[10px] uppercase tracking-[0.28em] text-white transition group-hover:text-accent"
                  >
                    View case study →
                  </Link>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
