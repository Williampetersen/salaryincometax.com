"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { CountrySummary } from "@/lib/country-catalog";
import { CountryFlag } from "@/components/shared/country-flag";

interface CountryPickerProps {
  currentCountry: CountrySummary;
  groups: Array<{
    region: string;
    countries: CountrySummary[];
  }>;
}

export function CountryPicker({
  currentCountry,
  groups,
}: CountryPickerProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        aria-expanded={isOpen}
        className="form-control flex items-center justify-between gap-3 text-left"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-3">
          <CountryFlag
            className="h-7 w-7 rounded-full border border-ink/10 object-cover"
            countryCode={currentCountry.countryCode}
            countryName={currentCountry.name}
            flagSrc={currentCountry.flagSrc}
            size={28}
          />
          <span className="truncate font-medium text-ink">{currentCountry.name}</span>
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-ink/45">
          {isOpen ? "Close" : "Choose"}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[28rem] overflow-y-auto rounded-3xl border border-ink/10 bg-white p-3 shadow-card">
          <div className="space-y-4">
            {groups.map((group) => (
              <div key={group.region}>
                <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                  {group.region}
                </p>
                <div className="grid gap-1">
                  {group.countries.map((country) => (
                    <Link
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition hover:bg-paper ${
                        country.slug === currentCountry.slug ? "bg-paper font-semibold text-ink" : "text-ink/70"
                      }`}
                      data-analytics-action="country_selected"
                      data-analytics-category="calculator"
                      data-analytics-label={country.slug}
                      href={`/salary-calculator/${country.slug}`}
                      key={country.slug}
                      onClick={() => setIsOpen(false)}
                    >
                      <CountryFlag
                        className="h-7 w-7 rounded-full border border-ink/10 object-cover"
                        countryCode={country.countryCode}
                        countryName={country.name}
                        flagSrc={country.flagSrc}
                        size={28}
                      />
                      <span>{country.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
