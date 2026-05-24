import { TAX_RULES } from "@/data/tax-rules";
import type {
  CalculationInput,
  CountryTaxRule,
  Region,
} from "@/lib/tax-engine/types";

export interface CountrySummary {
  slug: string;
  name: string;
  countryCode: string;
  flagSrc?: string;
  region: Region;
  currency: string;
  availableYears: number[];
  implementationStatus: CountryTaxRule["implementationStatus"];
  coverageLevel: CountryTaxRule["coverageLevel"];
}

export interface FAQItem {
  question: string;
  answer: string;
}

const COUNTRY_FLAG_ASSETS: Record<string, string> = {
  australia: "/flag/Flag_of_Australia.svg",
  belgium: "/flag/Flag_of_Belgium.svg.png",
  canada: "/flag/Flag_of_Canada.png",
  denmark: "/flag/Flag_of_Denmark.svg.webp",
  france: "/flag/Flag_of_France.png",
  germany: "/flag/Flag_of_Germany.svg.png",
  ireland: "/flag/Flag_of_Ireland.svg.png",
  italy: "/flag/Flag_of_Italy.svg",
  japan: "/flag/Flag_of_Japan.svg.png",
  luxembourg: "/flag/Flag_of_Luxembourg.svg.webp",
  malta: "/flag/Flag_of_Malta.svg.png",
  netherlands: "/flag/Flag_of_the_Netherlands.png",
  "new-zealand": "/flag/Flag_of_New_Zealand.svg",
  norway: "/flag/Flag_of_Norway.png",
  singapore: "/flag/Flag_of_Singapore.svg.png",
  spain: "/flag/Flag_of_Spain.svg.png",
  sweden: "/flag/Flag_of_Sweden.svg.png",
  "united-kingdom": "/flag/Flag_of_the_United_Kingdom.svg",
  "united-states": "/flag/Flag_of_the_United_States.svg.png",
};

const REGION_SORT_WEIGHT: Record<Region, number> = {
  Europe: 1,
  "North America": 2,
  Pacific: 3,
  Asia: 4,
};

function sortYears(years: number[]): number[] {
  return [...years].sort((left, right) => right - left);
}

export function getCountryRule(
  slug: string,
  requestedYear?: number,
): CountryTaxRule | undefined {
  const availableRules = TAX_RULES[slug];

  if (!availableRules) {
    return undefined;
  }

  if (requestedYear && availableRules[requestedYear]) {
    return availableRules[requestedYear];
  }

  const latestYear = sortYears(Object.keys(availableRules).map(Number))[0];
  return availableRules[latestYear];
}

export function getAllCountries(): CountrySummary[] {
  return Object.entries(TAX_RULES)
    .map(([slug, yearsMap]) => {
      const availableYears = sortYears(Object.keys(yearsMap).map(Number));
      const latestRule = yearsMap[availableYears[0]];

      return {
        slug,
        name: latestRule.countryName,
        countryCode: latestRule.countryCode,
        flagSrc: COUNTRY_FLAG_ASSETS[slug],
        region: latestRule.region,
        currency: latestRule.currency,
        availableYears,
        implementationStatus: latestRule.implementationStatus,
        coverageLevel: latestRule.coverageLevel,
      };
    })
    .sort((left, right) => {
      const regionDelta =
        REGION_SORT_WEIGHT[left.region] - REGION_SORT_WEIGHT[right.region];

      return regionDelta === 0
        ? left.name.localeCompare(right.name)
        : regionDelta;
    });
}

export function getCountryGroups(): Array<{
  region: Region;
  countries: CountrySummary[];
}> {
  const countries = getAllCountries();
  const groups = new Map<Region, CountrySummary[]>();

  for (const country of countries) {
    const existing = groups.get(country.region) ?? [];
    existing.push(country);
    groups.set(country.region, existing);
  }

  return Array.from(groups.entries()).map(([region, countriesInRegion]) => ({
    region,
    countries: countriesInRegion,
  }));
}

export function getCountrySummary(slug: string): CountrySummary | undefined {
  return getAllCountries().find((country) => country.slug === slug);
}

export function getRelatedCountries(
  currentSlug: string,
  limit = 4,
): CountrySummary[] {
  const current = getCountrySummary(currentSlug);

  if (!current) {
    return [];
  }

  const countries = getAllCountries().filter(
    (country) => country.slug !== currentSlug,
  );
  const sameRegion = countries.filter(
    (country) => country.region === current.region,
  );
  const others = countries.filter((country) => country.region !== current.region);

  return [...sameRegion, ...others].slice(0, limit);
}

export function buildDefaultInput(rule: CountryTaxRule): CalculationInput {
  return {
    country: rule.slug,
    taxYear: rule.taxYear,
    amount: rule.medianSalary,
    currency: rule.currency,
    salaryPeriod: "yearly",
    paidMonthsPerYear: rule.defaults.paidMonthsPerYear,
    paidWeeksPerYear: rule.defaults.paidWeeksPerYear,
    workingDaysPerWeek: rule.defaults.workingDaysPerWeek,
    workingHoursPerWeek: rule.defaults.workingHoursPerWeek,
    extraIncome: 0,
    personalStatus: rule.personalStatuses[0]?.key ?? "single",
    numberOfChildren: 0,
    reverseCalculation: false,
    description: "",
  };
}

export function getCountryFaqItems(rule: CountryTaxRule): FAQItem[] {
  return [
    {
      question: `How does the ${rule.countryName} salary tax calculator work?`,
      answer: `It converts your chosen pay period into an annual gross salary, applies the ${rule.taxYear} deductions, allowances, income tax bands, social contributions, and any configured regional layers in this model, then converts the result back into yearly, monthly, weekly, daily, and hourly figures.`,
    },
    {
      question: `Can I use this ${rule.countryName} calculator for net-to-gross planning?`,
      answer: "Yes. The reverse mode uses a binary search to estimate the gross pay required to reach your requested net salary under the current rule set for the selected year.",
    },
    {
      question: `Is the ${rule.countryName} result exact?`,
      answer: `No. This page provides an estimate built from a structured ${getCoverageLabel(rule.coverageLevel).toLowerCase()} tax model. It is useful for planning and comparison, but it does not replace a payroll slip, accountant, or official tax assessment.`,
    },
  ];
}

export function getCoverageLabel(
  coverageLevel: CountryTaxRule["coverageLevel"],
): string {
  switch (coverageLevel) {
    case "verified":
      return "Verified";
    case "partial":
      return "Partial";
    case "estimate":
      return "Estimate";
  }
}

export function getCoverageDescription(
  coverageLevel: CountryTaxRule["coverageLevel"],
): string {
  switch (coverageLevel) {
    case "verified":
      return "Official-source model with full coverage for this route.";
    case "partial":
      return "Official-source baseline with important national or household limits.";
    case "estimate":
      return "Illustrative model that still needs deeper country-specific coverage.";
  }
}
