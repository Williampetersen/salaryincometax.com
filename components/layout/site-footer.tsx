import Link from "next/link";

import { FOOTER_LINK_GROUPS } from "@/lib/navigation";
import { DISCLAIMER, SITE_NAME, SUPPORT_EMAIL } from "@/lib/site";

export function SiteFooter(): JSX.Element {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-white/65">
      <div className="shell grid gap-8 py-8 text-sm text-ink/68 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]">
        <div>
          <p className="font-semibold text-ink">{SITE_NAME}</p>
          <p className="mt-3 leading-7">{DISCLAIMER}</p>
          <Link
            className="mt-3 inline-flex font-medium text-coral transition hover:text-ink"
            data-analytics-action="contact_click"
            data-analytics-category="engagement"
            data-analytics-label="footer-email-link"
            href={`mailto:${SUPPORT_EMAIL}`}
          >
            {SUPPORT_EMAIL}
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {FOOTER_LINK_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                {group.heading}
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {group.links.map((link) => (
                  <Link
                    className="transition hover:text-coral"
                    href={link.href}
                    key={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="shell border-t border-ink/8 py-4 text-xs uppercase tracking-[0.16em] text-ink/48">
        © {year} {SITE_NAME}. All rights reserved.
      </div>
    </footer>
  );
}
