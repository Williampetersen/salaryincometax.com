import Link from "next/link";

import { CountryFlag } from "@/components/shared/country-flag";
import { getCoverageLabel, type CountrySummary } from "@/lib/country-catalog";

interface CountryCardProps {
  country: CountrySummary;
}

export function CountryCard({ country }: CountryCardProps): JSX.Element {
  const coverageLabel = getCoverageLabel(country.coverageLevel);

  return (
    <Link
      className="group panel relative flex h-full overflow-hidden p-5 transition duration-300 hover:-translate-y-1 hover:border-sky/35 hover:bg-white hover:shadow-2xl hover:shadow-sky/10"
      data-analytics-action="country_selected"
      data-analytics-category="calculator"
      data-analytics-label={country.slug}
      href={`/salary-calculator/${country.slug}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(93,184,224,0.2),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.2),rgba(255,255,255,0))] opacity-0 transition duration-300 group-hover:opacity-100" />
      <div className="relative flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
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
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    country.coverageLevel === "verified"
                      ? "bg-moss/10 text-moss"
                      : country.coverageLevel === "partial"
                        ? "bg-sky/15 text-sky"
                        : "bg-sand/55 text-ink/72"
                  }`}
                >
                  {coverageLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-ink/10 bg-white/90 text-xl font-semibold text-ink transition duration-300 group-hover:border-sky/30 group-hover:bg-sky/8 group-hover:text-sky">
          <span aria-hidden="true">+</span>
        </div>
      </div>
    </Link>
  );
}
