"use client";

import { useEffect, useRef, useState } from "react";

import { CountryFlag } from "@/components/shared/country-flag";
import type { CountrySummary } from "@/lib/country-catalog";

interface CountryComboboxProps {
  id: string;
  label: string;
  value: CountrySummary;
  groups: Array<{
    region: string;
    countries: CountrySummary[];
  }>;
  onChange: (slug: string) => void;
}

export function CountryCombobox({
  id,
  label,
  value,
  groups,
  onChange,
}: CountryComboboxProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    function handlePointerDown(event: MouseEvent): void {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const filteredGroups = groups
    .map((group) => ({
      region: group.region,
      countries: group.countries.filter((country) =>
        country.name.toLowerCase().includes(normalizedQuery),
      ),
    }))
    .filter((group) => group.countries.length > 0);

  return (
    <div className="relative" ref={containerRef}>
      <span className="field-label" id={`${id}-label`}>
        {label}
      </span>
      <button
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
        className="form-control flex items-center justify-between gap-3 text-left"
        onClick={() => setIsOpen((current) => !current)}
        type="button"
      >
        <span className="flex min-w-0 items-center gap-3">
          <CountryFlag
            className="h-7 w-7 rounded-full border border-ink/10 object-cover"
            countryCode={value.countryCode}
            countryName={value.name}
            flagSrc={value.flagSrc}
            size={28}
          />
          <span className="truncate font-medium text-ink">{value.name}</span>
        </span>
        <span className="text-xs uppercase tracking-[0.18em] text-ink/45">
          {isOpen ? "Close" : "Choose"}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-[26rem] overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-card">
          <div className="border-b border-ink/8 p-3">
            <input
              aria-label={`Search countries for ${label}`}
              className="form-control"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search countries..."
              ref={searchRef}
              type="text"
              value={query}
            />
          </div>
          <div className="max-h-[20rem] overflow-y-auto p-3">
            {filteredGroups.length > 0 ? (
              <div className="space-y-4">
                {filteredGroups.map((group) => (
                  <div key={group.region}>
                    <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                      {group.region}
                    </p>
                    <div className="grid gap-1">
                      {group.countries.map((country) => (
                        <button
                          className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition hover:bg-paper ${
                            country.slug === value.slug
                              ? "bg-paper font-semibold text-ink"
                              : "text-ink/70"
                          }`}
                          key={country.slug}
                          onClick={() => {
                            onChange(country.slug);
                            setIsOpen(false);
                          }}
                          type="button"
                        >
                          <CountryFlag
                            className="h-7 w-7 rounded-full border border-ink/10 object-cover"
                            countryCode={country.countryCode}
                            countryName={country.name}
                            flagSrc={country.flagSrc}
                            size={28}
                          />
                          <span>{country.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="px-2 py-4 text-sm text-ink/55">
                No countries match &quot;{query}&quot;.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
