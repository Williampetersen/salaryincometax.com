import type { Metadata } from "next";

import { CountryGroups } from "@/components/home/country-groups";
import { StructuredData } from "@/components/seo/structured-data";
import {
  getPublicCalculatorCountries,
  getPublicCountryGroups,
} from "@/lib/country-catalog";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildCountryCollectionSchema,
} from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Salary Calculators by Country",
  description:
    "Browse salary after tax calculators by country. Compare take-home pay, net salary, gross salary, and income tax assumptions across Europe, North America, Pacific, and Asia.",
  alternates: {
    canonical: `${SITE_URL}/salary-calculator`,
  },
  openGraph: {
    title: `Salary Calculators by Country | ${SITE_NAME}`,
    description:
      "Browse salary after tax calculators by country and compare take-home pay assumptions across global markets.",
    url: `${SITE_URL}/salary-calculator`,
  },
};

export default function SalaryCalculatorIndexPage(): JSX.Element {
  const groups = getPublicCountryGroups();
  const countries = getPublicCalculatorCountries();

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Salary calculators", url: absoluteUrl("/salary-calculator") },
    ]),
    buildCountryCollectionSchema(
      "Salary calculators by country",
      absoluteUrl("/salary-calculator"),
      countries,
    ),
  ];

  return (
    <div className="shell pb-16 pt-10">
      <StructuredData data={structuredData} />
      <div className="mb-8 max-w-4xl">
        <p className="eyebrow">Directory</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Salary calculators by country
        </h1>
        <p className="mt-4 text-base leading-8 text-ink/68">
          Browse source-backed salary after tax calculators for people searching
          how much tax they may pay, how much salary they keep after deductions,
          and how compensation compares across countries and tax years.
        </p>
        <p className="mt-3 text-sm leading-7 text-ink/62">
          Public calculator pages are limited to reviewed country models with
          complete implementation status and non-estimate coverage. Earlier
          illustrative models remain out of public navigation until they have
          enough source-backed detail.
        </p>
      </div>

      <CountryGroups groups={groups} />

      <section className="panel mt-12 grid gap-8 p-6 sm:p-8 lg:grid-cols-3">
        <DirectoryInfoCard
          title="Choose the right country"
          text="Start with the country where the salary will be taxed. If you are comparing relocation options, run the same gross offer through two country calculators and compare net pay, tax split, and salary benchmarks."
        />
        <DirectoryInfoCard
          title="Check the assumptions"
          text="Every country calculator includes its tax year, coverage level, personal allowance, salary benchmarks, and source notes. Use those notes before relying on a result for a job offer or payroll discussion."
        />
        <DirectoryInfoCard
          title="Use reverse mode carefully"
          text="Reverse calculation estimates the gross salary needed for a target net amount. It is useful for negotiation planning, but final payroll can change with household status, local deductions, benefits, and employer setup."
        />
      </section>
    </div>
  );
}

function DirectoryInfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}): JSX.Element {
  return (
    <div className="rounded-4xl border border-ink/10 bg-white p-5">
      <h2 className="font-[var(--font-display)] text-2xl font-bold text-ink">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-ink/68">{text}</p>
    </div>
  );
}
