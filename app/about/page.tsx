import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { getPublicCalculatorCountries } from "@/lib/country-catalog";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { DISCLAIMER, SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "About Salary Income Tax",
  "Learn what salaryincometax.com does, which countries it covers, how salary after tax estimates are calculated, and how to contact the team.",
  "/about",
);

export default function AboutPage(): JSX.Element {
  const countries = getPublicCalculatorCountries();
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "About", url: absoluteUrl("/about") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "About" },
      ]}
      description="Salaryincometax.com helps people estimate gross salary, net salary, total tax, social contributions, and cost-of-living tradeoffs across multiple countries."
      eyebrow="About"
      title="About Salary Income Tax"
    >
      <StructuredData data={structuredData} />
      <div className="space-y-6">
        <ContentSections
          sections={[
            {
              title: "Who we are",
              paragraphs: [
                "Salaryincometax.com is an independent salary and tax information website founded and maintained by William Petersen, CPA, a US Certified Public Accountant with over 10 years of experience in independent tax and accounting practice, focused on helping users understand what a salary may look like after tax in different countries.",
                "The site is built for job seekers, relocators, expats, employers, and anyone comparing compensation between countries or cities.",
              ],
            },
            {
              title: "What the website does",
              paragraphs: [
                "The platform combines a reusable tax engine, country-specific rule files, salary context, cost-of-living content, and editorial guides. Users can estimate gross salary, net salary, total tax, employee social contributions, and effective tax rates.",
                "The site also publishes original blog content about salary after tax, cost of living, minimum wage, and income tax systems so users can move from calculators into deeper research.",
              ],
            },
            {
              title: "Countries covered",
              paragraphs: [
                "The public calculator catalog currently focuses on source-backed country models. Earlier estimate files stay internal until they have enough country-specific source coverage to provide useful public pages.",
              ],
            },
            {
              title: "How calculations work",
              paragraphs: [
                "Each calculator route converts the selected salary period into an annual gross figure, applies the configured tax-year assumptions, deductions, allowances, social contributions, and any local or regional payroll layers defined for that market, then converts the result back into yearly, monthly, weekly, daily, and hourly views.",
                "Where reverse calculation is enabled, the site estimates the gross salary required to reach a desired net amount using an iterative search. That makes the tool useful for both pay analysis and salary negotiation planning.",
              ],
            },
            {
              title: "Editorial and review process",
              paragraphs: [
                "The editorial process starts with the user decision: comparing an offer, checking monthly take-home pay, planning a relocation, or understanding a payroll deduction. Articles are written to support that decision with examples, caveats, source notes, and links to the relevant calculator.",
                "When a country model is not strong enough for public use, it stays out of public navigation and the sitemap until it has enough source-backed detail. That keeps the public site focused on pages that can genuinely help readers.",
              ],
            },
            {
              title: "Corrections and feedback",
              paragraphs: [
                "Readers, employers, payroll specialists, and tax professionals can report corrections or missing assumptions. Useful reports include the page URL, the tax year, the disputed figure, and a link to the official or public source that should be reviewed.",
                `Correction requests can be sent through the contact page or directly to ${SUPPORT_EMAIL}.`,
              ],
            },
            {
              title: "Accuracy and limitations",
              paragraphs: [
                DISCLAIMER,
                "Tax laws, contribution rates, allowances, salary distributions, and cost-of-living conditions change over time. We update structured data and editorial content regularly, but the site should not replace a payroll slip, accountant, or official tax authority guidance.",
              ],
            },
            {
              title: "How to contact us",
              paragraphs: [
                `You can contact the team at ${SUPPORT_EMAIL} for correction requests, general support, business inquiries, or questions about how the site works.`,
                "For privacy, policy, or data-methodology questions, use the contact page so we can route your request correctly.",
              ],
            },
          ]}
        />

        <section className="panel p-5 sm:p-7">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
            Countries in the current catalog
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {countries.map((country) => (
              <Link
                className="rounded-3xl border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink transition hover:border-coral/25 hover:text-coral"
                href={`/salary-calculator/${country.slug}`}
                key={country.slug}
              >
                {country.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="panel p-5 sm:p-7">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
            Author and policies
          </h2>
          <p className="mt-4 text-base leading-8 text-ink/72">
            The site keeps its author profile, editorial standards, source notes,
            advertising rules, and correction process public so readers can judge
            the work behind each calculator and guide.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
              href="/authors/salaryincometax-editorial-team"
            >
              William Petersen, CPA
            </Link>
            <Link
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
              href="/editorial-policy"
            >
              Editorial policy
            </Link>
            <Link
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
              href="/sources"
            >
              Sources
            </Link>
            <Link
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/25 hover:text-coral"
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}
