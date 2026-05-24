import type { CountrySummary, FAQItem } from "@/lib/country-catalog";
import type { CountryTaxRule } from "@/lib/tax-engine/types";
import {
  SITE_DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

export function absoluteUrl(path = ""): string {
  if (!path) {
    return SITE_URL;
  }

  return new URL(path, SITE_URL).toString();
}

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(SITE_DEFAULT_OG_IMAGE),
    email: SUPPORT_EMAIL,
    contactPoint: {
      "@type": "ContactPoint",
      email: SUPPORT_EMAIL,
      contactType: "customer support",
      availableLanguage: "English",
      url: absoluteUrl("/contact"),
    },
  };
}

export function buildWebsiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "en",
  };
}

export function buildBreadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildCountryCollectionSchema(
  pageName: string,
  pageUrl: string,
  countries: CountrySummary[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageName,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: countries.map((country, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: country.name,
        url: absoluteUrl(`/salary-calculator/${country.slug}`),
      })),
    },
  };
}

export function buildCountryCalculatorSchema(
  rule: CountryTaxRule,
  country: CountrySummary,
  faqItems: FAQItem[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${rule.countryName} Salary Calculator`,
    url: absoluteUrl(`/salary-calculator/${rule.slug}`),
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    inLanguage: "en",
    image: absoluteUrl(country.flagSrc ?? SITE_DEFAULT_OG_IMAGE),
    description: `Use this ${rule.countryName} salary after tax calculator to estimate gross salary, net salary, income tax, social contributions, and effective tax rate for tax year ${rule.taxYear}.`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: rule.currency,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    featureList: [
      "Gross to net salary calculation",
      "Net to gross salary estimate",
      "Annual, monthly, weekly, daily, and hourly breakdowns",
      "Country-specific tax-year assumptions",
      "Comparison with median salary and minimum wage",
    ],
    about: faqItems.map((item) => item.question),
  };
}
