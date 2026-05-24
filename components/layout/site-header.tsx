import Image from "next/image";
import Link from "next/link";

import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
      <div className="shell flex items-center justify-between gap-4 py-4">
        <Link className="group flex items-center gap-3" href="/">
          <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-lg shadow-ink/10 transition group-hover:-translate-y-0.5">
            <Image
              alt={`${SITE_NAME} logo`}
              className="h-10 w-10 object-contain"
              height={40}
              src="/websitelogo/logo transparent.png"
              width={40}
            />
          </span>
          <div>
            <p className="font-[var(--font-display)] text-lg font-bold tracking-tight">
              {SITE_NAME}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-ink/55">
              {SITE_TAGLINE}
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-ink/72 md:flex">
          <Link className="transition hover:text-coral" href="/salary-calculator">
            Countries
          </Link>
          <Link className="transition hover:text-coral" href="/blog">
            Blog
          </Link>
          <Link className="transition hover:text-coral" href="/#engine">
            Tax engine
          </Link>
          <Link className="transition hover:text-coral" href="/#disclaimer">
            Disclaimer
          </Link>
        </nav>
      </div>
    </header>
  );
}
