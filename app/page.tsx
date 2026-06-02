import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { CountryGroups } from "@/components/home/country-groups";
import { SalaryCountryMap } from "@/components/home/salary-country-map";
import { TypewriterHeading } from "@/components/home/typewriter-heading";
import { StructuredData } from "@/components/seo/structured-data";
import {
  getPublicCalculatorCountries,
  getPublicCountryGroups,
} from "@/lib/country-catalog";
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
  const groups = getPublicCountryGroups();
  const countries = getPublicCalculatorCountries();
  const sourceBackedModelCount = countries.length;
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
              <p className="eyebrow">Salary calculator</p>
              <h1 className="mt-5 max-w-3xl font-[var(--font-display)] text-5xl font-bold tracking-tight text-ink sm:text-6xl">
                <TypewriterHeading text="Find your salary after tax" />
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-ink/68 sm:text-lg">
                Check take-home pay with source-backed country calculators.
                Compare gross and net salary in a few steps.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  className="rounded-full bg-ink px-5 py-3 font-semibold text-white transition hover:bg-coral"
                  href="/salary-calculator"
                >
                  Open calculator
                </Link>
                <Link
                  className="rounded-full border border-ink/12 bg-white/75 px-5 py-3 font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
                  href="/salary-calculator"
                >
                  Choose country
                </Link>
              </div>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <StatCard
                  label="Public calculators"
                  value={String(sourceBackedModelCount)}
                />
                <StatCard label="Published focus" value="Reviewed routes" />
                <StatCard label="Reverse mode" value="Net to gross" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-4xl bg-ink p-6 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-white/65">
                  Why use it
                </p>
                <p className="mt-4 text-2xl font-semibold leading-9">
                  Fast salary and tax estimates for jobs, relocation, and pay
                  checks.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FeatureCard
                  description="Yearly, monthly, weekly, daily, or hourly pay."
                  iconSrc="/iconforhomepage/diagram.gif"
                  title="Pay periods"
                />
                <FeatureCard
                  description="Your last five checks stay in your browser."
                  iconSrc="/iconforhomepage/connection.gif"
                  title="Saved history"
                />
                <FeatureCard
                  description="See your pay next to median salary and minimum wage."
                  iconSrc="/iconforhomepage/money-bag.gif"
                  title="Salary compare"
                />
                <FeatureCard
                  description="Country tax rules are easy to update."
                  iconSrc="/iconforhomepage/award (1).gif"
                  title="Tax rules"
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
            <h2 className="mt-4 font-[var(--font-display)] text-2xl font-bold sm:text-3xl">
              Choose a country
            </h2>
          </div>
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
        <div className="panel grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="eyebrow">Methodology</p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              Built around source-backed country rules
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-7 text-ink/70">
              <p>
                Each public calculator starts from a country tax-rule file that
                defines the tax year, currency, pay-period defaults, personal
                allowances, social contributions, income tax brackets, and local
                or regional tax layers where those are modeled. The same
                structured rule powers the input form, charts, salary-period
                breakdowns, and source notes.
              </p>
              <p>
                This keeps the site more useful than a generic percentage
                estimate. A person comparing a job offer can enter yearly,
                monthly, weekly, daily, or hourly pay, then review the net result
                next to tax split, effective tax rate, median salary, and minimum
                wage context for that country.
              </p>
              <p>
                Estimate-only internal models are not promoted as public
                calculators until they have enough country-specific source
                coverage. Public pages focus on reviewed routes with clear
                assumptions, limitations, and links to source material.
              </p>
            </div>
          </div>
          <div className="rounded-4xl border border-ink/10 bg-white p-5">
            <h3 className="font-[var(--font-display)] text-2xl font-bold">
              What makes the results useful
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-7 text-ink/70">
              <li>Gross-to-net and net-to-gross salary estimates in one workflow.</li>
              <li>Annual, monthly, weekly, daily, and hourly result views.</li>
              <li>Tax split charts for income tax, social contributions, and local layers.</li>
              <li>Country pages that disclose coverage level, source links, and caveats.</li>
              <li>Saved calculation history kept locally in the user&apos;s browser.</li>
            </ul>
          </div>
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

      <SalaryCountryMap countries={countries} />
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
  iconSrc,
}: {
  title: string;
  description: string;
  iconSrc: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white/78 p-5">
      <Image
        alt=""
        aria-hidden="true"
        className="mb-4 h-12 w-12 object-contain"
        height={48}
        src={iconSrc}
        unoptimized
        width={48}
      />
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
