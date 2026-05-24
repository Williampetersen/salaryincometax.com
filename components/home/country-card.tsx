import Link from "next/link";

import { CountryFlag } from "@/components/shared/country-flag";
import {
  getCoverageDescription,
  getCoverageLabel,
  type CountrySummary,
} from "@/lib/country-catalog";

interface CountryCardProps {
  country: CountrySummary;
}

export function CountryCard({ country }: CountryCardProps): JSX.Element {
  const coverageLabel = getCoverageLabel(country.coverageLevel);

  return (
    <Link
      className="group panel flex h-full flex-col justify-between p-5 transition duration-300 hover:-translate-y-1 hover:border-coral/30 hover:bg-white"
      data-analytics-action="country_selected"
      data-analytics-category="calculator"
      data-analytics-label={country.slug}
      href={`/salary-calculator/${country.slug}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <CountryFlag
            className="h-12 w-12 rounded-full border border-ink/10 object-cover"
            countryCode={country.countryCode}
            countryName={country.name}
            flagSrc={country.flagSrc}
            size={48}
          />
          <h3 className="mt-3 font-[var(--font-display)] text-lg font-bold text-ink">
            {country.name}
          </h3>
        </div>
        <span
          className={`status-chip ${
            country.coverageLevel === "verified"
              ? "bg-moss/10 text-moss"
              : country.coverageLevel === "partial"
                ? "bg-sky/15 text-sky"
                : "bg-sand/55 text-ink/72"
          }`}
          title={getCoverageDescription(country.coverageLevel)}
        >
          {coverageLabel} model
        </span>
      </div>
      <div className="mt-4 text-sm leading-6 text-ink/62">
        {getCoverageDescription(country.coverageLevel)}
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-ink/60">
        <span>{country.currency}</span>
        <span className="transition group-hover:text-coral">Open calculator</span>
      </div>
    </Link>
  );
}
