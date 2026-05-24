import type { Metadata } from "next";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SUPPORT_EMAIL } from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Advertising Policy",
  "Read how salaryincometax.com approaches Google AdSense, ad placement, sponsored content labeling, editorial independence, and user privacy.",
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
      description="This Advertising Policy explains how salaryincometax.com plans to use advertising, including Google AdSense, clear ad placement, editorial independence, and privacy protections."
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
              "AdSense is not active by default before approval, and the site does not intentionally display empty ad boxes, deceptive ad placeholders, or visual elements that could be mistaken for paid ads.",
            ],
          },
          {
            title: "Ad placement and labeling",
            paragraphs: [
              "If ads are enabled later, they will be clearly separated from navigation, calculator controls, tables, buttons, and internal-link blocks so visitors can distinguish editorial content from advertising at a glance.",
              "Advertising labels will be clear and non-misleading. The site will not place ads under headings that make them look like tools, downloads, resources, or required next steps.",
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
              "The site’s Privacy Policy and Cookie Policy explain how Google-related cookies, partner-site data, and optional ad-personalization settings are handled.",
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
