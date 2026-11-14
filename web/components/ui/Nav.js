import Link from "next/link";
import { BrandMark } from "@/components/ui/BrandMark";

const links = [
  { href: "/#about", label: "About" },
  { href: "/#work", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/#contact", label: "Contact" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.26em] text-white/90">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded border border-accent/40 bg-accent/10 text-accent">
            <BrandMark size={18} />
          </span>
          ARHAM.WARESI
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.24em] text-silver transition hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#contact"
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:border-accent/60 hover:bg-accent/10"
        >
          Let&apos;s talk
        </Link>
      </div>
    </header>
  );
}
