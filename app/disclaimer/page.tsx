import type { Metadata } from "next";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Disclaimer",
  "Read the salaryincometax.com disclaimer covering calculator estimates, tax-rule changes, cost-of-living variability, and the absence of guaranteed accuracy.",
  "/disclaimer",
);

export default function DisclaimerPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Disclaimer", url: absoluteUrl("/disclaimer") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Disclaimer" },
      ]}
      description="This Disclaimer explains the limits of calculator outputs, tax-rule modeling, salary data, and cost-of-living content published on salaryincometax.com."
      eyebrow="Legal"
      title="Disclaimer"
    >
      <StructuredData data={structuredData} />
      <ContentSections
        sections={[
          {
            title: "Calculator estimates only",
            paragraphs: [
              "Salary and tax calculations on this website are estimates only. They are based on structured data files, model assumptions, and simplified representations of tax and payroll systems.",
            ],
          },
          {
            title: "Rules may change",
            paragraphs: [
              "Tax rules, thresholds, deductions, social contributions, salary distributions, and cost-of-living conditions can change at any time. A calculator that is directionally useful today may still require updates when official rules move.",
            ],
          },
          {
            title: "Professional and official guidance",
            paragraphs: [
              "Users should consult official tax authorities, payroll departments, accountants, or other qualified professional advisers before relying on a result for legal, financial, or tax-sensitive decisions.",
            ],
          },
          {
            title: "Cost of living may vary",
            paragraphs: [
              "Cost-of-living figures vary by city, district, family structure, lifestyle, and timing. Published numbers are best treated as planning ranges rather than guaranteed personal outcomes.",
            ],
          },
          {
            title: "No guarantee of accuracy",
            paragraphs: [
              "We aim to maintain useful and well-sourced content, but we do not guarantee that every calculator result, article figure, or country note is complete, current, or error-free at all times.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              `For corrections or clarification requests, contact ${SUPPORT_EMAIL}.`,
            ],
          },
        ]}
      />
    </ContentPageShell>
  );
}
