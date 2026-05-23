import type { Metadata } from "next";

import { CountryGroups } from "@/components/home/country-groups";
import { StructuredData } from "@/components/seo/structured-data";
import { getAllCountries, getCountryGroups } from "@/lib/country-catalog";
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
  const groups = getCountryGroups();
  const countries = getAllCountries();

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
          Browse country-specific salary after tax calculators for people searching
          how much tax they may pay, how much salary they keep after deductions,
          and how compensation compares across countries and tax years.
        </p>
      </div>

      <CountryGroups groups={groups} />
    </div>
  );
}
