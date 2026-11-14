import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

export default function BrandOptions() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 pb-20 pt-16 text-white sm:px-8 sm:pt-24">
      <header className="mx-auto max-w-5xl">
        <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-accent">
          ARHAM / IDENTITY
        </p>
        <div className="mt-6 flex items-center gap-5">
          <BrandMark size={72} className="h-14 w-auto text-accent sm:h-[4.5rem]" />
          <div>
            <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-none tracking-[-0.06em] text-white">
              ARHAM
            </h1>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-silver/70">ARHAM.WARESI</p>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-sm leading-7 text-silver/75 sm:text-base">
          A star mark in the spirit of tomdekoning.work — geometric, sharp, and tied to the site accent.
        </p>
      </header>

      <section className="mx-auto mt-12 grid max-w-5xl items-center gap-8 rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)] sm:p-10">
        <div className="flex aspect-square items-center justify-center rounded-xl border border-white/10 bg-black/40">
          <BrandMark size={180} className="h-32 w-auto text-accent sm:h-44" />
        </div>
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-accent">Primary mark</p>
          <h2 className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">The star mark</h2>
          <p className="mt-4 text-sm leading-7 text-silver/75">
            Used in the navigation and browser icon, matching the rotating star motif on the homepage.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/brand/arham/mark.svg"
              download
              className="rounded-full border border-accent/50 bg-accent/15 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-accent/25"
            >
              Download SVG
            </a>
            <Link
              href="/"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white transition hover:bg-white/10"
            >
              Back to website
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
