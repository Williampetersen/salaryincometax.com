import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CalculatorShell } from "@/components/calculator/calculator-shell";
import { FAQSection } from "@/components/calculator/faq-section";
import { CountryFlag } from "@/components/shared/country-flag";
import {
  buildDefaultInput,
  getAllCountries,
  getCountryFaqItems,
  getCountryGroups,
  getCountryRule,
  getCountrySummary,
  getRelatedCountries,
} from "@/lib/country-catalog";
import { SITE_URL } from "@/lib/site";
import { calculateSalaryTax } from "@/lib/tax-engine/calculate";

interface CountryPageProps {
  params: {
    country: string;
  };
}

export function generateStaticParams(): Array<{ country: string }> {
  return getAllCountries().map((country) => ({
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
  const description = `Estimate ${rule.countryName} salary after tax for ${rule.taxYear}. Compare gross and net pay, effective tax rate, regional benchmarks, and reverse net-to-gross results.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/salary-calculator/${rule.slug}`,
    },
    openGraph: {
      title,
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

  const initialInput = buildDefaultInput(rule);
  const initialResult = calculateSalaryTax(initialInput, rule);
  const countryGroups = getCountryGroups();
  const faqItems = getCountryFaqItems(rule);
  const relatedCountries = getRelatedCountries(rule.slug, 4);

  return (
    <div className="shell pb-16 pt-10">
      <div className="mb-8">
        <Link className="text-sm font-medium text-ink/55 transition hover:text-coral" href="/">
          Home
        </Link>
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
        <FAQSection items={faqItems} />
      </div>
    </div>
  );
}
