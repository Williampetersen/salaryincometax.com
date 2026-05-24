import type { Metadata } from "next";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Advertising Policy",
  "Read how salaryincometax.com approaches Google AdSense, sponsored content labeling, editorial independence, privacy, and ad personalization.",
  "/advertising-policy",
);

export default function AdvertisingPolicyPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Advertising Policy", url: absoluteUrl("/advertising-policy") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Advertising Policy" },
      ]}
      description="This Advertising Policy explains how salaryincometax.com plans to use advertising, including Google AdSense, editorial independence, and user privacy protections."
      eyebrow="Advertising"
      title="Advertising Policy"
    >
      <StructuredData data={structuredData} />
      <ContentSections
        sections={[
          {
            title: "Google AdSense",
            paragraphs: [
              "Salaryincometax.com may display advertising through Google AdSense after approval. Advertising will be integrated in a way that does not interfere with calculator use, article readability, or site navigation.",
            ],
          },
          {
            title: "Editorial independence",
            paragraphs: [
              "Advertising relationships do not determine tax-rule content, salary guides, cost-of-living analysis, or editorial conclusions. Ads do not influence the calculation methodology or whether a topic is updated.",
            ],
          },
          {
            title: "Sponsored content",
            paragraphs: [
              "If sponsored content is ever published, it will be clearly labeled so users can distinguish advertising or sponsored material from editorial content.",
            ],
          },
          {
            title: "User privacy and ad personalization",
            paragraphs: [
              "Advertising-related scripts and storage are only relevant after AdSense activation and are subject to the site’s cookie consent controls. Users can reject advertising cookies or change preferences later through the cookie settings control.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              `For advertising questions, contact ${SUPPORT_EMAIL}.`,
            ],
          },
        ]}
      />
    </ContentPageShell>
  );
}
