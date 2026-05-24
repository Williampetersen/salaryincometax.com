import type { Metadata } from "next";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Editorial Policy",
  "Read how salaryincometax.com creates, reviews, updates, and corrects salary, tax, and cost-of-living content, including AI-assisted drafting disclosure.",
  "/editorial-policy",
);

export default function EditorialPolicyPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Editorial Policy", url: absoluteUrl("/editorial-policy") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Editorial Policy" },
      ]}
      description="This Editorial Policy explains how salaryincometax.com creates and maintains salary, tax, and cost-of-living content."
      eyebrow="Editorial"
      title="Editorial Policy"
    >
      <StructuredData data={structuredData} />
      <ContentSections
        sections={[
          {
            title: "How content is created",
            paragraphs: [
              "Content is created from structured internal data, original writing, and reviews of public or official sources relevant to tax, salary, minimum wage, and cost-of-living topics.",
              "We do not copy text, protected databases, or proprietary editorial material from competing websites.",
            ],
          },
          {
            title: "Use of official and public sources",
            paragraphs: [
              "Where possible, tax-rule and methodology content references official tax authorities, government salary or labour publications, transport bodies, statistics agencies, and other public institutional sources.",
            ],
          },
          {
            title: "How tax and salary data are reviewed",
            paragraphs: [
              "Structured tax rules are reviewed at the data-file level, then checked through the calculator engine, smoke tests, and production builds. Salary and minimum-wage benchmarks are reviewed alongside tax assumptions so the content and calculator remain aligned.",
            ],
          },
          {
            title: "AI-assisted content disclosure",
            paragraphs: [
              "The editorial workflow may use AI-assisted drafting, data organization, summarization, or code generation as part of the production process. AI assistance does not remove the need for editorial judgment, source review, or structured data validation.",
            ],
          },
          {
            title: "Human review process",
            paragraphs: [
              "Human review is used to check structure, clarity, consistency with the calculator model, legal-sensitivity disclaimers, and obvious factual issues before major content goes live.",
            ],
          },
          {
            title: "Update frequency",
            paragraphs: [
              "Tax-year data, legal pages, and core country guides are reviewed on a recurring basis and also when major rule or methodology changes are identified.",
            ],
          },
          {
            title: "Corrections policy",
            paragraphs: [
              "If a material error is reported, we review the affected calculator rule, article, or methodology note and update the content when warranted. Correction timing depends on severity, source certainty, and the scope of the fix.",
            ],
          },
          {
            title: "Contact for corrections",
            paragraphs: [
              `Report factual or sourcing concerns to ${SUPPORT_EMAIL}.`,
            ],
          },
        ]}
      />
    </ContentPageShell>
  );
}
