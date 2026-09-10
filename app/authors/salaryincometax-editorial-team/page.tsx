import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { getAllBlogPosts } from "@/lib/blog";
import { getPublicCalculatorCountries } from "@/lib/country-catalog";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import {
  DISCLAIMER,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

const AUTHOR_NAME = "William Petersen";
const AUTHOR_CREDENTIAL = "CPA (Certified Public Accountant, United States)";

export const metadata: Metadata = buildStaticPageMetadata(
  `${AUTHOR_NAME}, CPA - Salaryincometax.com`,
  "William Petersen, a US Certified Public Accountant with over 10 years in independent tax and accounting practice, founded and maintains salaryincometax.com, including the tax-rule sourcing, calculator methodology, and editorial review process behind its salary, tax, and cost-of-living guides.",
  "/authors/salaryincometax-editorial-team",
);

export default function EditorialTeamAuthorPage(): JSX.Element {
  const countryCount = getPublicCalculatorCountries().length;
  const articleCount = getAllBlogPosts().length;
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      {
        name: AUTHOR_NAME,
        url: absoluteUrl("/authors/salaryincometax-editorial-team"),
      },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: `${SITE_URL}/authors/salaryincometax-editorial-team`,
      mainEntity: {
        "@type": "Person",
        name: AUTHOR_NAME,
        url: SITE_URL,
        email: SUPPORT_EMAIL,
        jobTitle: "Founder, editor, and Certified Public Accountant (CPA)",
        hasCredential: {
          "@type": "EducationalOccupationalCredential",
          credentialCategory: "professional certification",
          name: "Certified Public Accountant (CPA)",
        },
        worksFor: {
          "@type": "Organization",
          name: "Salaryincometax.com",
          url: SITE_URL,
        },
        description:
          "US Certified Public Accountant with over 10 years in independent tax and accounting practice. Founder and editor of salaryincometax.com, responsible for the site's tax-rule sourcing, calculator methodology, and editorial review process.",
      },
    },
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: AUTHOR_NAME },
      ]}
      description="William Petersen, CPA, founded and maintains salaryincometax.com, including its tax-rule sourcing, calculator methodology, and editorial review process."
      eyebrow="Author"
      title={`${AUTHOR_NAME}, CPA`}
    >
      <StructuredData data={structuredData} />
      <div className="space-y-6">
        <section className="panel grid gap-5 p-5 sm:p-7 lg:grid-cols-4">
          <MetricCard label="Credential" value="CPA (US)" />
          <MetricCard label="Public calculators" value={String(countryCount)} />
          <MetricCard label="Published guides" value={String(articleCount)} />
          <MetricCard label="Contact" value={SUPPORT_EMAIL} />
        </section>

        <ContentSections
          sections={[
            {
              title: "Who I am",
              paragraphs: [
                `${AUTHOR_NAME} is a US Certified Public Accountant (CPA) with over 10 years of experience in independent tax and accounting practice, working directly with individual and small-business clients on tax preparation, payroll questions, and general accounting.`,
                `${AUTHOR_NAME} founded salaryincometax.com and is personally responsible for the tax-rule sourcing, calculator methodology, and editorial decisions published on the site.`,
                "The focus is practical salary questions: how gross salary becomes net pay, how tax and social contributions work, how cost of living changes affordability, and how workers can compare job offers across countries.",
                "The goal is not to replace a payroll department or tax adviser. It's to help readers ask better questions, understand the assumptions behind salary calculators, and spot the costs that can change a relocation or negotiation decision.",
              ],
            },
            {
              title: "Research method",
              bullets: [
                "Apply CPA training and practice experience to check that each country's modeled tax logic (bracket order, deduction timing, how social contributions interact with income tax) reflects how payroll actually works, not just what a published rate table shows.",
                "Use official tax authority, statistics office, and public payroll references where available - see the Sources page for the reference list behind each country model.",
                "Separate source-backed calculator pages from illustrative estimate models that are not ready for public navigation.",
                "Translate tax and salary rules into practical examples, monthly cash-flow context, and clear limitations.",
                "Link country guides to calculators, source notes, and related cost-of-living articles so readers can verify assumptions themselves rather than take a figure on faith.",
              ],
            },
            {
              title: "Editorial standards",
              paragraphs: [
                "Articles are written for readers making real salary decisions, not for search engines alone. Every guide should answer the core question directly, include practical examples, explain common mistakes, and identify when a reader should replace benchmark data with current quotes or professional advice.",
                "When a figure is estimated, benchmark-based, or dependent on household circumstances, the page says so clearly. The full process is documented on the Editorial Policy page, including where AI-assisted drafting is used and how it's reviewed.",
              ],
            },
            {
              title: "Corrections and updates",
              paragraphs: [
                "Tax rules, contribution rates, wage benchmarks, and housing costs change. Source-backed country pages and blog guides are reviewed as new tax-year data becomes available or when readers report an issue.",
                `Corrections can be sent to ${SUPPORT_EMAIL}. Please include the page URL, the disputed figure or paragraph, and the source you believe should be reviewed.`,
              ],
            },
            {
              title: "Limitations",
              paragraphs: [
                DISCLAIMER,
                "Calculator outputs and editorial guides are planning tools. Final payroll results can change because of residency status, local deductions, benefits, pension choices, employer setup, bonuses, tax credits, and personal circumstances.",
              ],
            },
          ]}
        />

        <section className="panel p-5 text-base leading-8 text-ink/72 sm:p-7">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
            Useful pages
          </h2>
          <div className="mt-5 flex flex-wrap gap-3">
            <LinkButton href="/sources" label="Sources and methodology" />
            <LinkButton href="/editorial-policy" label="Editorial policy" />
            <LinkButton href="/salary-calculator" label="Salary calculators" />
            <LinkButton href="/contact" label="Contact" />
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element {
  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
        {label}
      </p>
      <p className="mt-2 break-words font-[var(--font-display)] text-2xl font-bold text-ink">
        {value}
      </p>
    </div>
  );
}

function LinkButton({
  href,
  label,
}: {
  href: string;
  label: string;
}): JSX.Element {
  return (
    <Link
      className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
      href={href}
    >
      {label}
    </Link>
  );
}
