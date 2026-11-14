import Link from "next/link";
import { GlassPanel } from "@/components/ui/GlassPanel";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-screen items-center overflow-hidden px-4 pb-10 pt-28 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(155,92,255,0.22),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(184,184,184,0.08),transparent_30%)]" />

      <div className="relative mx-auto w-full max-w-7xl">
        <div className="grid items-end gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.34em] text-accent">Independent developer</p>
            <h1 className="mt-6 font-display text-[4.1rem] leading-[0.86] tracking-[-0.08em] text-white sm:text-[5.5rem] lg:text-[8rem]">
              Arham.
              <span className="mt-2 block text-white/90">Waresi</span>
            </h1>

            <div className="mt-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-silver/80">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(155,92,255,0.9)]" />
              Full-stack developer
            </div>

            <p className="mt-8 max-w-lg text-base leading-7 text-silver/80 sm:text-lg">
              I build bold digital products, systems, and visual experiences that blend thoughtful strategy with technical precision.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/#work"
                className="rounded-full border border-accent/60 bg-accent px-5 py-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-accent-deep"
              >
                Explore work
              </Link>
              <Link
                href="/#contact"
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.28em] text-white transition hover:border-white/25 hover:bg-white/10"
              >
                Contact me
              </Link>
            </div>
          </div>

          <GlassPanel className="relative overflow-hidden p-3 sm:p-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded border border-white/10 bg-[#151515] shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_45%),linear-gradient(135deg,rgba(155,92,255,0.35),transparent_58%)]" />
              <div className="absolute inset-4 flex items-center justify-center rounded border border-white/10 bg-black/20 text-center text-sm uppercase tracking-[0.26em] text-silver/70">
                PLACEHOLDER: add your photo
              </div>
              <div className="absolute inset-x-6 bottom-5 flex items-center justify-between rounded border border-white/10 bg-black/30 px-4 py-3 backdrop-blur-sm">
                <span className="text-[10px] uppercase tracking-[0.26em] text-silver/75">Creative developer</span>
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(155,92,255,0.9)]" />
              </div>
            </div>
          </GlassPanel>
        </div>

        <div className="mt-14 grid gap-3 border-t border-white/10 pt-6 md:grid-cols-4">
          {[
            ["Services", "Brand systems, product builds, APIs"],
            ["Experience", "8+ years across design and engineering"],
            ["Approach", "Strategy, UI, code, and launch"],
            ["Availability", "Open to select freelance work"],
          ].map(([label, value]) => (
            <div key={label} className="border-l border-white/8 pl-4 first:border-l-0 first:pl-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-silver/65">{label}</p>
              <p className="mt-3 text-sm leading-6 text-silver/85">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
