import type { Metadata } from "next";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Terms and Conditions",
  "Review the salaryincometax.com terms and conditions covering calculator estimates, user responsibilities, intellectual property, prohibited use, and liability limits.",
  "/terms",
);

export default function TermsPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Terms", url: absoluteUrl("/terms") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Terms" },
      ]}
      description="These Terms and Conditions govern the use of salaryincometax.com, including the calculator pages, blog content, contact forms, and all related information published on the site."
      eyebrow="Legal"
      title="Terms and Conditions"
    >
      <StructuredData data={structuredData} />
      <ContentSections
        sections={[
          {
            title: "Use of website",
            paragraphs: [
              "By using salaryincometax.com, you agree to use the website lawfully and in a way that does not interfere with the website, its content, or other visitors.",
              "The website is intended to provide informational tools and editorial content about salary after tax, income tax, minimum wage, and cost of living topics.",
            ],
          },
          {
            title: "Calculator estimates",
            paragraphs: [
              "Calculator results are estimates generated from structured assumptions and country-specific rule files. They are not payroll slips, tax filings, or official tax authority outputs.",
              "A result can be useful for comparing job offers, checking whether a monthly budget is realistic, or preparing questions for HR, payroll, or an adviser. It should not be treated as a final assessment of tax due, benefits eligibility, pension treatment, or residency status.",
            ],
          },
          {
            title: "Appropriate use examples",
            bullets: [
              "Comparing the same gross salary across two countries before a relocation discussion.",
              "Estimating monthly take-home pay before signing a lease or accepting an offer.",
              "Using reverse mode to understand the gross salary range needed for a target net income.",
              "Reading source notes and caveats before relying on any country-specific assumption.",
            ],
          },
          {
            title: "No financial, tax, legal, or accounting advice",
            paragraphs: [
              "Nothing on the website constitutes financial, tax, legal, or accounting advice. Users should consult official authorities or qualified advisers before making decisions that depend on precise legal or financial treatment.",
            ],
          },
          {
            title: "User responsibilities",
            bullets: [
              "Use the site with accurate input values when relying on estimates.",
              "Review official rules or professional advice before acting on major decisions.",
              "Do not submit unlawful, abusive, or misleading material through forms or other site features.",
              "Do not present calculator results as guaranteed payroll, tax authority, or employer-approved figures.",
            ],
          },
          {
            title: "Corrections and content quality",
            paragraphs: [
              "We may update, merge, remove, or redirect pages when a calculator model, article, or data note is no longer useful enough for public users. Keeping weak pages unpublished is part of the site's quality process.",
              "If you find a factual issue, send the page URL, tax year, disputed figure, and the official or public source that supports the correction.",
            ],
          },
          {
            title: "Intellectual property",
            paragraphs: [
              "The website design, original code, editorial content, and structured data arrangement are protected by applicable intellectual-property laws. Users may not reproduce or republish substantial parts of the site in a misleading or unauthorized way.",
            ],
          },
          {
            title: "Prohibited use",
            bullets: [
              "Attempting to disrupt, overload, probe, or misuse the website or its infrastructure.",
              "Using the site for unlawful scraping, spam, or deceptive behavior.",
              "Misrepresenting calculator outputs as official tax or payroll advice from the site.",
            ],
          },
          {
            title: "External links",
            paragraphs: [
              "The site may link to external resources such as official tax authorities and public datasets. We do not control those third-party sites or accept responsibility for their content or policies.",
            ],
          },
          {
            title: "Limitation of liability",
            paragraphs: [
              "To the maximum extent permitted by law, salaryincometax.com and its operators are not liable for losses or damages arising from reliance on website content, calculator outputs, unavailable pages, third-party links, or temporary service interruptions.",
            ],
          },
          {
            title: "Changes to terms",
            paragraphs: [
              "These Terms may be updated from time to time. Continued use of the website after updates are published means you accept the revised terms.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              `Questions about these Terms can be sent to ${SUPPORT_EMAIL}.`,
            ],
          },
        ]}
      />
    </ContentPageShell>
  );
}
