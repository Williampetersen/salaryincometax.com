import type { Metadata } from "next";
import Link from "next/link";

import { CountryGroups } from "@/components/home/country-groups";
import { StructuredData } from "@/components/seo/structured-data";
import { getAllCountries, getCountryGroups } from "@/lib/country-catalog";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildCountryCollectionSchema,
  buildOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/seo";
import { DISCLAIMER, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Find your salary after tax",
  description:
    "Explore salary after tax calculators for Europe, North America, Pacific, and Asia. Compare take-home pay with editable JSON tax rules and reverse gross-to-net estimates.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: `Find your salary after tax | ${SITE_NAME}`,
    description:
      "Explore salary after tax calculators by country and compare net salary, gross salary, and income tax assumptions.",
    url: SITE_URL,
  },
};

export default function HomePage(): JSX.Element {
  const groups = getCountryGroups();
  const countries = getAllCountries();
  const structuredData = [
    buildOrganizationSchema(),
    buildWebsiteSchema(),
    buildBreadcrumbSchema([{ name: "Home", url: absoluteUrl("/") }]),
    buildCountryCollectionSchema(
      "Find your salary after tax",
      absoluteUrl("/"),
      countries,
    ),
  ];

  return (
    <div className="pb-16">
      <StructuredData data={structuredData} />
      <section className="shell pt-10 sm:pt-14">
        <div className="panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <p className="eyebrow">Global tax calculator</p>
              <h1 className="mt-5 max-w-3xl font-[var(--font-display)] text-5xl font-bold tracking-tight text-ink sm:text-6xl">
                Find your salary after tax
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/68 sm:text-lg">
                Estimate take-home pay across 19 countries with a calculator built
                on editable JSON tax rules, region-grouped country pages, and
                reverse net-to-gross planning.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-coral"
                  href="/salary-calculator/denmark"
                >
                  Open a calculator
                </Link>
                <Link
                  className="rounded-full border border-ink/12 bg-white/75 px-5 py-3 font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
                  href="/salary-calculator"
                >
                  Browse countries
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <StatCard label="Countries" value="19" />
                <StatCard label="Detailed models" value="8" />
                <StatCard label="Reverse mode" value="Net to gross" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-4xl bg-ink p-6 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/65">
                  What this site does
                </p>
                <p className="mt-4 text-2xl font-semibold leading-9">
                  One calculation flow, reusable tax engine, and SEO-ready country
                  pages for every market in the catalog.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  description="Switch between yearly, monthly, weekly, daily, and hourly salary periods."
                  title="Period-aware inputs"
                />
                <FeatureCard
                  description="Store the latest five calculations locally without sending personal data to a database."
                  title="Local history"
                />
                <FeatureCard
                  description="Compare your salary with the configured median salary and minimum-wage benchmark."
                  title="Benchmark charts"
                />
                <FeatureCard
                  description="Update tax logic by editing country-year JSON rather than rewriting UI code."
                  title="Editable tax data"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell pt-12" id="countries">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Regions</p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
              Choose a country
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-ink/62">
            Each card opens a dedicated salary calculator page with dynamic SEO,
            country-specific tax rules, a FAQ, and internal links to nearby markets.
          </p>
        </div>
        <CountryGroups groups={groups} />
      </section>

      <section className="shell pt-12" id="engine">
        <div className="panel grid gap-6 p-6 sm:p-8 lg:grid-cols-3">
          <EngineCard
            number="01"
            text="Convert the entered pay period into annual gross income using the country defaults and user overrides."
            title="Annualize pay"
          />
          <EngineCard
            number="02"
            text="Apply deductions, personal allowances, social contributions, and tax brackets from the country JSON rule."
            title="Run the tax engine"
          />
          <EngineCard
            number="03"
            text="Return take-home pay, effective tax rate, period breakdowns, history items, and comparison charts."
            title="Return results"
          />
        </div>
      </section>

      <section className="shell pt-12">
        <div className="panel mb-12 p-6 sm:p-8">
          <p className="eyebrow">Search intent</p>
          <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
            What people use this site for
          </h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            <SearchIntentCard
              description="Estimate how much of your salary you keep after income tax and employee deductions."
              title="Salary after tax"
            />
            <SearchIntentCard
              description="Check how much tax you may pay in a specific country before accepting a new job offer."
              title="Income tax by country"
            />
            <SearchIntentCard
              description="Reverse a target take-home pay into the gross salary you may need to negotiate."
              title="Net to gross planning"
            />
          </div>
        </div>

        <div className="panel p-6 sm:p-8" id="disclaimer">
          <p className="eyebrow">Important</p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-ink/70">{DISCLAIMER}</p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/72 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-ink/55">{label}</p>
      <p className="mt-2 font-[var(--font-display)] text-2xl font-bold text-ink">
        {value}
      </p>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white/78 p-5">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-2 text-sm leading-6 text-ink/62">{description}</p>
    </div>
  );
}

function EngineCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}): JSX.Element {
  return (
    <div className="rounded-4xl bg-white p-6">
      <p className="text-xs uppercase tracking-[0.28em] text-coral">{number}</p>
      <h3 className="mt-4 font-[var(--font-display)] text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink/65">{text}</p>
    </div>
  );
}

function SearchIntentCard({
  title,
  description,
}: {
  title: string;
  description: string;
}): JSX.Element {
  return (
    <div className="rounded-4xl border border-ink/10 bg-white p-5">
      <p className="font-semibold text-ink">{title}</p>
      <p className="mt-3 text-sm leading-7 text-ink/65">{description}</p>
    </div>
  );
}
