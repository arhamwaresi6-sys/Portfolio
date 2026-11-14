import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.34em] text-accent">404</p>
      <h1 className="mt-4 font-display text-5xl text-white">Page not found</h1>
      <p className="mt-4 text-silver/75">The route you requested is unavailable or unpublished.</p>
      <Link
        href="/"
        className="mt-8 rounded border border-accent/60 bg-accent px-5 py-3 text-[10px] uppercase tracking-[0.28em] text-white"
      >
        Back home
      </Link>
    </main>
  );
}
