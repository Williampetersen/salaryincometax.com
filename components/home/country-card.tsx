import Link from "next/link";

import type { CountrySummary } from "@/lib/country-catalog";

interface CountryCardProps {
  country: CountrySummary;
}

export function CountryCard({ country }: CountryCardProps): JSX.Element {
  const isDetailed = country.implementationStatus === "complete";

  return (
    <Link
      className="group panel flex h-full flex-col justify-between p-5 transition duration-300 hover:-translate-y-1 hover:border-coral/30 hover:bg-white"
      href={`/salary-calculator/${country.slug}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-3xl">{country.flag}</p>
          <h3 className="mt-3 font-[var(--font-display)] text-lg font-bold text-ink">
            {country.name}
          </h3>
        </div>
        <span
          className={`status-chip ${
            isDetailed
              ? "bg-moss/10 text-moss"
              : "bg-sand/55 text-ink/72"
          }`}
        >
          {isDetailed ? "Detailed model" : "Example model"}
        </span>
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-ink/60">
        <span>{country.currency}</span>
        <span className="transition group-hover:text-coral">Open calculator</span>
      </div>
    </Link>
  );
}
