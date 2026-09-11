import type { Metadata } from "next";

import { CompareShell } from "@/components/compare/compare-shell";
import { StructuredData } from "@/components/seo/structured-data";
import {
  buildDefaultInput,
  getCountryRule,
  getPublicCalculatorCountries,
  getPublicCountryGroups,
} from "@/lib/country-catalog";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";

const PREFERRED_DEFAULT_PAIR = ["united-states", "united-kingdom"];

export const metadata: Metadata = {
  title: "Compare Salary After Tax Between Two Countries",
  description:
    "Compare take-home pay, income tax, social contributions, and effective tax rate between two countries side by side. Enter a gross salary for each country and see the tax split.",
  alternates: {
    canonical: `${SITE_URL}/compare`,
  },
  openGraph: {
    title: `Compare Salary After Tax Between Two Countries | ${SITE_NAME}`,
    description:
      "Compare take-home pay, income tax, and effective tax rate between two countries side by side.",
    url: `${SITE_URL}/compare`,
  },
};

export default function ComparePage(): JSX.Element {
  const countries = getPublicCalculatorCountries();
  const groups = getPublicCountryGroups();

  const [defaultA, defaultB] = PREFERRED_DEFAULT_PAIR.every((slug) =>
    countries.some((country) => country.slug === slug),
  )
    ? PREFERRED_DEFAULT_PAIR
    : [countries[0]?.slug, countries[1]?.slug ?? countries[0]?.slug];

  const ruleA = getCountryRule(defaultA);
  const ruleB = getCountryRule(defaultB);

  const initialResultA = ruleA
    ? calculateSalaryTax(buildDefaultInput(ruleA), ruleA)
    : undefined;
  const initialResultB = ruleB
    ? calculateSalaryTax(buildDefaultInput(ruleB), ruleB)
    : undefined;

  const defaultAmounts = Object.fromEntries(
    countries.map((country) => [
      country.slug,
      getCountryRule(country.slug)?.medianSalary ?? 50000,
    ]),
  );

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Salary calculators", url: absoluteUrl("/salary-calculator") },
      { name: "Compare countries", url: absoluteUrl("/compare") },
    ]),
  ];

  return (
    <div className="shell pb-16 pt-10">
      <StructuredData data={structuredData} />
      <div className="mb-8 max-w-4xl">
        <p className="eyebrow">Compare</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Compare salary after tax between two countries
        </h1>
        <p className="mt-4 text-base leading-8 text-ink/68">
          Enter a gross salary for each country and see net pay, income tax,
          social contributions, and effective tax rate side by side. Useful
          for comparing job offers, relocation decisions, or two roles in
          different countries.
        </p>
        <p className="mt-3 text-sm leading-7 text-ink/62">
          Each country keeps its own currency. This tool does not convert
          between currencies, so treat the effective tax rate - not the raw
          net pay figures - as the fairest head-to-head comparison when the
          two countries use different currencies.
        </p>
      </div>

      {ruleA && ruleB && initialResultA && initialResultB ? (
        <CompareShell
          countries={countries}
          defaultAmounts={defaultAmounts}
          groups={groups}
          initialCountryASlug={ruleA.slug}
          initialCountryBSlug={ruleB.slug}
          initialResultA={initialResultA}
          initialResultB={initialResultB}
        />
      ) : null}
    </div>
  );
}
