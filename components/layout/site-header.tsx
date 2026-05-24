import Image from "next/image";
import Link from "next/link";

import { HEADER_LINKS } from "@/lib/navigation";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function SiteHeader(): JSX.Element {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-paper/85 backdrop-blur-xl">
      <div className="shell py-4">
        <div className="flex items-center justify-between gap-4">
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
          {HEADER_LINKS.map((link) => (
            <Link
              className="transition hover:text-coral"
              data-analytics-action={link.analyticsAction}
              data-analytics-category={link.analyticsCategory}
              data-analytics-label={link.analyticsLabel}
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        </div>
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 md:hidden">
          {HEADER_LINKS.map((link) => (
            <Link
              className="whitespace-nowrap rounded-full border border-ink/10 bg-white/82 px-4 py-2 text-sm font-medium text-ink/72 transition hover:border-coral/30 hover:text-coral"
              data-analytics-action={link.analyticsAction}
              data-analytics-category={link.analyticsCategory}
              data-analytics-label={link.analyticsLabel}
              href={link.href}
              key={`mobile-${link.href}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
