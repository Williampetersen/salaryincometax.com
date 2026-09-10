import type { CountrySummary } from "@/lib/country-catalog";

import { CountryCard } from "@/components/home/country-card";

interface CountryGroupsProps {
  groups: Array<{
    region: string;
    countries: CountrySummary[];
  }>;
}

export function CountryGroups({ groups }: CountryGroupsProps): JSX.Element {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.region}>
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">{group.region}</p>
            </div>
            <p className="text-sm text-ink/55">
              {group.countries.length}{" "}
              {group.countries.length === 1 ? "calculator" : "calculators"}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {group.countries.map((country) => (
              <CountryCard country={country} key={country.slug} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
