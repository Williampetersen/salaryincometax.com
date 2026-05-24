"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { HEADER_LINKS } from "@/lib/navigation";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export function SiteHeader(): JSX.Element {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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

          <nav className="hidden items-center gap-5 text-sm font-medium text-ink/72 lg:flex">
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

          <button
            aria-controls="mobile-navigation"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-ink/10 bg-white/88 text-ink transition hover:border-coral/30 hover:text-coral lg:hidden"
            onClick={() => {
              setIsMenuOpen((current) => !current);
            }}
            type="button"
          >
            <span className="sr-only">Menu</span>
            <span className="relative h-5 w-5">
              <span
                className={`absolute left-0 top-0.5 h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-2.5 h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-[18px] h-0.5 w-5 rounded-full bg-current transition ${
                  isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {isMenuOpen ? (
          <nav
            className="mt-4 rounded-4xl border border-ink/10 bg-white/92 p-3 shadow-xl shadow-ink/8 lg:hidden"
            id="mobile-navigation"
          >
            <div className="grid gap-2">
              {HEADER_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === link.href
                    : pathname === link.href || pathname.startsWith(`${link.href}/`);

                return (
                  <Link
                    className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-ink text-white"
                        : "bg-paper/70 text-ink/78 hover:bg-coral/8 hover:text-coral"
                    }`}
                    data-analytics-action={link.analyticsAction}
                    data-analytics-category={link.analyticsCategory}
                    data-analytics-label={link.analyticsLabel}
                    href={link.href}
                    key={`mobile-${link.href}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}
