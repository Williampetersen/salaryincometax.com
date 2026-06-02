import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { FAQSection } from "@/components/calculator/faq-section";
import { CountrySeoContent } from "@/components/seo/country-seo-content";
import { StructuredData } from "@/components/seo/structured-data";
import { CountryFlag } from "@/components/shared/country-flag";
import {
  buildDefaultInput,
  getCountryFaqItems,
  getPublicCalculatorCountries,
  getPublicCountryGroups,
  isPublicCalculatorCountry,
  getCountryRule,
  getCountrySummary,
  getRelatedCountries,
} from "@/lib/country-catalog";
import {
  absoluteUrl,
  buildBreadcrumbSchema,
  buildCountryCalculatorSchema,
} from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";

interface CountryPageProps {
  params: {
    country: string;
  };
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ country: string }> {
  return getPublicCalculatorCountries().map((country) => ({
    country: country.slug,
  }));
}

export function generateMetadata({ params }: CountryPageProps): Metadata {
  const rule = getCountryRule(params.country);

  if (!rule) {
    return {
      title: "Salary calculator",
    };
  }

  const title = `${rule.countryName} Salary Calculator ${rule.taxYear}`;
  const description = `Estimate ${rule.countryName} salary after tax for ${rule.taxYear}. Use this ${rule.countryName} net salary and income tax calculator to compare gross pay, net pay, tax, deductions, and reverse net-to-gross results.`;

  return {
    title,
    description,
    keywords: [
      `${rule.countryName} salary calculator`,
      `${rule.countryName} salary after tax`,
      `${rule.countryName} net salary calculator`,
      `${rule.countryName} income tax calculator`,
      `how much tax do I pay in ${rule.countryName}`,
    ],
    alternates: {
      canonical: `${SITE_URL}/salary-calculator/${rule.slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/salary-calculator/${rule.slug}`,
    },
  };
}

export default function CountryPage({ params }: CountryPageProps): JSX.Element {
  const rule = getCountryRule(params.country);
  const country = getCountrySummary(params.country);

  if (!rule || !country) {
    notFound();
  }

  if (!isPublicCalculatorCountry(country)) {
    notFound();
  }

  const initialInput = buildDefaultInput(rule);
  const initialResult = calculateSalaryTax(initialInput, rule);
  const countryGroups = getPublicCountryGroups();
  const faqItems = getCountryFaqItems(rule);
  const relatedCountries = getRelatedCountries(rule.slug, 4);
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Salary calculators", url: absoluteUrl("/salary-calculator") },
      { name: rule.countryName, url: absoluteUrl(`/salary-calculator/${rule.slug}`) },
    ]),
    buildCountryCalculatorSchema(rule, country, faqItems),
  ];

  return (
    <div className="shell pb-16 pt-10">
      <StructuredData data={structuredData} />
      <div className="mb-8">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-sm text-ink/55"
        >
          <Link className="transition hover:text-coral" href="/">
            Home
          </Link>
          <span>/</span>
          <Link className="transition hover:text-coral" href="/salary-calculator">
            Salary calculators
          </Link>
          <span>/</span>
          <span className="text-ink/75">{rule.countryName}</span>
        </nav>
        <div className="mt-4 flex items-center gap-4">
          <CountryFlag
            className="h-12 w-12 rounded-full border border-ink/10 object-cover sm:h-14 sm:w-14"
            countryCode={country.countryCode}
            countryName={country.name}
            flagSrc={country.flagSrc}
            size={56}
          />
          <h1 className="font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
            {rule.countryName} salary calculator
          </h1>
        </div>
        <p className="mt-4 max-w-3xl text-base leading-8 text-ink/68">
          Estimate gross salary, net salary, total tax, and effective rate for{" "}
          {rule.countryName} in {rule.taxYear}. This page also compares your annual
          salary with the configured median salary and minimum-wage benchmark.
        </p>
      </div>

      <CalculatorShell
        country={country}
        countryGroups={countryGroups}
        initialResult={initialResult}
        relatedCountries={relatedCountries}
        rule={rule}
      />

      <div className="mt-8">
        <CountrySeoContent
          country={country}
          relatedCountries={relatedCountries}
          rule={rule}
        />
      </div>

      <div className="mt-8">
        <FAQSection items={faqItems} />
      </div>
    </div>
  );
}
