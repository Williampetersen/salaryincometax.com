import type { Metadata } from "next";

import { SITE_NAME, SITE_URL } from "@/lib/site";

export interface NavLink {
  href: string;
  label: string;
  analyticsAction?: string;
  analyticsCategory?: string;
  analyticsLabel?: string;
}

export const HEADER_LINKS: NavLink[] = [
  {
    href: "/salary-calculator",
    label: "Salary Calculators",
    analyticsAction: "navigation_click",
    analyticsCategory: "navigation",
    analyticsLabel: "salary-calculators",
  },
  {
    href: "/blog",
    label: "Blog",
    analyticsAction: "navigation_click",
    analyticsCategory: "navigation",
    analyticsLabel: "blog",
  },
  {
    href: "/blog/category/cost-of-living",
    label: "Cost of Living",
    analyticsAction: "navigation_click",
    analyticsCategory: "navigation",
    analyticsLabel: "cost-of-living",
  },
  {
    href: "/blog/category/income-tax",
    label: "Income Tax Guides",
    analyticsAction: "navigation_click",
    analyticsCategory: "navigation",
    analyticsLabel: "income-tax-guides",
  },
  {
    href: "/contact",
    label: "Contact",
    analyticsAction: "contact_click",
    analyticsCategory: "engagement",
    analyticsLabel: "header-contact",
  },
];

export const FOOTER_LINK_GROUPS: Array<{
  heading: string;
  links: NavLink[];
}> = [
  {
    heading: "Explore",
    links: [
      { href: "/salary-calculator", label: "Salary Calculators" },
      { href: "/blog", label: "Blog" },
      { href: "/blog/category/cost-of-living", label: "Cost of Living" },
      { href: "/blog/category/income-tax", label: "Income Tax Guides" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/authors/salaryincometax-editorial-team", label: "Editorial Team" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/advertising-policy", label: "Advertising Policy" },
      { href: "/sources", label: "Sources" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export const STATIC_SITE_PAGES = [
  "/about",
  "/contact",
  "/authors/salaryincometax-editorial-team",
  "/privacy-policy",
  "/cookie-policy",
  "/terms",
  "/disclaimer",
  "/editorial-policy",
  "/advertising-policy",
  "/sources",
] as const;

export function buildStaticPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}${path}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}
