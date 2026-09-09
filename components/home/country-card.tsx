import Link from "next/link";

import { CountryFlag } from "@/components/shared/country-flag";
import type { CountrySummary } from "@/lib/country-catalog";

interface CountryCardProps {
  country: CountrySummary;
}

export function CountryCard({ country }: CountryCardProps): JSX.Element {
  return (
    <Link
      className="group panel relative flex h-full overflow-hidden px-5 py-5 pr-3 transition duration-300 hover:-translate-y-1 hover:border-sky/35 hover:bg-white hover:shadow-2xl hover:shadow-sky/10"
      data-analytics-action="country_selected"
      data-analytics-category="calculator"
      data-analytics-label={country.slug}
      href={`/salary-calculator/${country.slug}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(93,184,224,0.2),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0))] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full w-full items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-4">
            <CountryFlag
              className="h-14 w-14 rounded-full border border-white/70 object-cover shadow-md shadow-sky/10"
              countryCode={country.countryCode}
              countryName={country.name}
              flagSrc={country.flagSrc}
              size={56}
            />
            <div className="min-w-0">
              <h3 className="truncate font-[var(--font-display)] text-xl font-bold text-ink">
                {country.name}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky">
                  {country.currency}
                </span>
              </div>
            </div>
          </div>
        </div>
        <svg
          aria-hidden="true"
          className="h-6 w-6 shrink-0 text-ink/40 transition duration-300 group-hover:translate-x-1 group-hover:text-coral"
          fill="none"
          height={24}
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.75}
          viewBox="0 0 24 24"
          width={24}
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </div>
    </Link>
  );
}
