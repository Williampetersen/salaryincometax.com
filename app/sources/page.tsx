import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { COUNTRY_COST_OF_LIVING_DATA } from "@/data/blog/costOfLivingData";
import { SALARY_DATA } from "@/data/blog/salaryData";
import { TAX_RULES } from "@/data/tax-rules";
import {
  getAllCountries,
  getCoverageLabel,
} from "@/lib/country-catalog";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Sources and Data Methodology",
  "Review tax, salary, minimum wage, and cost-of-living data methodology for salaryincometax.com, including source notes and update practices.",
  "/sources",
);

export default function SourcesPage(): JSX.Element {
  const countries = getAllCountries();
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Sources", url: absoluteUrl("/sources") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Sources" },
      ]}
      description="This page explains where salaryincometax.com gets its tax, salary, minimum wage, and cost-of-living data, how the calculator methodology works, and how updates are handled."
      eyebrow="Methodology"
      title="Sources and Data Methodology"
    >
      <StructuredData data={structuredData} />
      <div className="space-y-6">
        <ContentSections
          sections={[
            {
              title: "Tax data sources",
              paragraphs: [
                "Country-specific tax-rule files are stored as structured JSON in the project and are designed to reference official tax authority, finance ministry, or equivalent public-government materials wherever possible.",
                "Each country file includes source references, assumptions, coverage status, and implementation notes so updates can be audited and reviewed over time.",
              ],
            },
            {
              title: "Salary data sources",
              paragraphs: [
                "Salary benchmarks are tied to the structured tax-rule catalog and salary data layer used by the calculator and blog. They are intended as planning benchmarks rather than guaranteed current-market quotes for every city or profession.",
              ],
            },
            {
              title: "Minimum wage data sources",
              paragraphs: [
                "Minimum wage figures are stored in the site data model and compared against tax assumptions to estimate after-tax minimum wage. Some countries require benchmark floors rather than a simple statutory national minimum wage model, and those caveats are called out in the related content.",
              ],
            },
            {
              title: "Cost of living data sources",
              paragraphs: [
                "Cost-of-living guides use structured market baselines for rent, transport, food, utilities, childcare, and household budgets. For some countries and cities the content is detailed and publish-ready, while others remain structured templates that are clearly marked for future data refreshes.",
              ],
            },
            {
              title: "Calculation methodology",
              paragraphs: [
                "The calculator annualizes pay first, then applies deductions, allowances, progressive tax brackets, social-security rules, and configured regional layers before returning yearly, monthly, weekly, daily, and hourly outputs.",
                "Reverse calculation mode uses iterative search to estimate the gross salary needed to reach a target net amount under the active country and tax-year model.",
              ],
            },
            {
              title: "Update schedule",
              paragraphs: [
                "Core tax-year rules, legal pages, and major country guides are reviewed on a recurring basis and when major tax or methodology changes are identified.",
                "For public editorial routes, the site can restrict publishing to the stronger reviewed article set while lower-confidence drafts remain in the structured data layer until they are ready for broader indexing.",
              ],
            },
            {
              title: "Reporting outdated data",
              paragraphs: [
                `If you spot outdated country rules, salary benchmarks, or source links, contact ${SUPPORT_EMAIL} with the page URL and the specific issue you found.`,
              ],
            },
          ]}
        />

        <section className="panel p-5 sm:p-7">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
            Country-specific source notes
          </h2>
          <p className="mt-4 text-base leading-8 text-ink/72">
            The table below summarizes the current country catalog, model status,
            and the number of configured source references visible in the structured
            project data.
          </p>
          <p className="mt-2 text-sm leading-7 text-ink/64">
            A <strong>Partial</strong> model is source-backed but still excludes
            some country-specific layers such as province, state, commune, tax
            credits, or special household cases. An <strong>Estimate</strong> model
            remains illustrative and should be treated as planning-only.
          </p>
          <div className="mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Country</th>
                    <th className="px-4 py-3 font-semibold">Coverage</th>
                    <th className="px-4 py-3 font-semibold">Tax sources</th>
                    <th className="px-4 py-3 font-semibold">Salary sources</th>
                    <th className="px-4 py-3 font-semibold">Cost guide status</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country) => {
                    const yearMap = TAX_RULES[country.slug];
                    const latestYear = Math.max(...Object.keys(yearMap).map(Number));
                    const rule = yearMap[latestYear];
                    const salary = SALARY_DATA[country.slug];
                    const costData = COUNTRY_COST_OF_LIVING_DATA[country.slug];

                    return (
                      <tr className="border-t border-ink/8" key={country.slug}>
                        <td className="px-4 py-3 font-semibold text-ink">
                          <Link
                            className="transition hover:text-coral"
                            href={`/salary-calculator/${country.slug}`}
                          >
                            {country.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-ink/72">
                          {getCoverageLabel(rule.coverageLevel)}
                        </td>
                        <td className="px-4 py-3 text-ink/72">{rule.source.length}</td>
                        <td className="px-4 py-3 text-ink/72">{salary.sources.length}</td>
                        <td className="px-4 py-3 text-ink/72">
                          {costData.updatedAt.startsWith("2026") ? "Tracked" : "Needs refresh"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </ContentPageShell>
  );
}
