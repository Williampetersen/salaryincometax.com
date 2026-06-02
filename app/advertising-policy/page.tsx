import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import {
  GOOGLE_ADSENSE_PROGRAM_POLICIES_URL,
  GOOGLE_AD_PLACEMENT_POLICIES_URL,
  GOOGLE_PUBLISHER_PRIVACY_DISCLOSURES_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

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
            title: "Google AdSense and policy scope",
            paragraphs: [
              "Salaryincometax.com may display advertising through Google AdSense after approval. Advertising will be integrated in a way that does not interfere with calculator use, article readability, or site navigation.",
              "The AdSense publisher script may be present for verification and site-readiness review, but the site does not intentionally display ad units, empty ad boxes, deceptive ad placeholders, or visual elements that could be mistaken for paid ads before approval.",
              "If AdSense is enabled later, this site will follow the Google AdSense Program Policies, Google ad placement policies, Google Publisher Policies, and related privacy requirements that apply to publishers.",
            ],
          },
          {
            title: "Invalid clicks and impressions",
            paragraphs: [
              "Salaryincometax.com does not permit artificial inflation of ad impressions or clicks. We do not click our own ads, ask team members to click ads, use bots or automation to generate activity, or use any software or service designed to manipulate ad performance.",
              "Any suspicious traffic, accidental-click patterns, or partner activity that appears inconsistent with genuine user interest should be investigated and corrected before ads remain live.",
            ],
          },
          {
            title: "No click encouragement or misleading prompts",
            paragraphs: [
              "The site must not ask users to click ads, reward users for viewing ads, or use phrases such as support-us click prompts, sponsored-link bait, or other language that draws unnatural attention to ad units.",
              "When ads are enabled, the design must not use arrows, animated hints, fake download controls, or labels that could make ads look like navigation, calculator actions, or required next steps.",
            ],
          },
          {
            title: "Traffic sources and promotion standards",
            paragraphs: [
              "Traffic to pages with Google ads should come from legitimate user interest. The site must not rely on paid-to-click systems, autosurf or click-exchange schemes, unwanted bulk email, or software that opens pages automatically or interferes with browser behavior.",
              "If paid promotion is used for salaryincometax.com in the future, landing pages must accurately match the ad promise and must not mislead users about the content they will reach.",
            ],
          },
          {
            title: "Ad placement and labeling",
            paragraphs: [
              "If ads are enabled later, they will be clearly separated from navigation, calculator controls, tables, buttons, internal-link blocks, and interactive tools so visitors can distinguish editorial content from advertising at a glance.",
              "Advertising labels will be clear and non-misleading. Ads should be identified with plain labels such as Advertisement or Sponsored where appropriate, and they must never be presented as menu items, country selectors, download links, or calculator results.",
              "Ads must not appear in pop-ups, emails, software screens, private communication screens, or pages created mainly to display ads instead of useful content.",
            ],
          },
          {
            title: "Site behavior and navigation",
            paragraphs: [
              "The website should remain easy to navigate and should not redirect users to irrelevant pages, trigger unwanted downloads, change browser settings, or use pop-ups or pop-unders that interfere with navigation.",
              "Salaryincometax.com must not frame unauthorized third-party content, claim downloads or streaming that do not exist, or use any navigation pattern that intentionally confuses users.",
            ],
          },
          {
            title: "Editorial independence and sponsored content",
            paragraphs: [
              "Advertising relationships do not determine tax-rule content, salary guides, cost-of-living analysis, or editorial conclusions. Ads do not influence the calculation methodology or whether a topic is updated.",
              "If sponsored content is ever published, it will be clearly labeled so users can distinguish commercial material from editorial content.",
            ],
          },
          {
            title: "Privacy, cookies, and ad personalization",
            paragraphs: [
              "Advertising-related scripts and storage are only relevant after AdSense activation and are subject to consent controls. For users in the European Economic Area, the United Kingdom, and Switzerland, ad consent should be collected through Google Privacy & Messaging or another Google-certified CMP integrated with the IAB Transparency and Consent Framework before personalized ads are served.",
              "Users can reject advertising cookies or change preferences later through the cookie settings control. Where Google's certified Privacy & Messaging CMP is active, that control opens the Google consent revocation flow rather than relying only on the site's local fallback banner.",
              "The site's Privacy Policy and Cookie Policy explain how Google-related cookies, identifiers, partner-site data, and optional ad-personalization settings are handled.",
            ],
          },
          {
            title: "Monitoring and enforcement",
            paragraphs: [
              "If Google flags a policy issue, ad placement concern, or invalid-traffic risk, the affected implementation should be reviewed promptly and corrected before further monetization continues.",
              "Pages with low-value content, broken navigation, misleading UX, or unresolved policy risks should remain ad-free until they are fixed.",
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
      <section className="panel mt-6 p-5 sm:p-7 text-base leading-8 text-ink/72">
        <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
          Official Google references
        </h2>
        <ul className="mt-4 space-y-3">
          <li>
            AdSense Program Policies:{" "}
            <Link
              className="text-coral hover:text-ink"
              href={GOOGLE_ADSENSE_PROGRAM_POLICIES_URL}
            >
              {GOOGLE_ADSENSE_PROGRAM_POLICIES_URL}
            </Link>
          </li>
          <li>
            Ad placement policies:{" "}
            <Link
              className="text-coral hover:text-ink"
              href={GOOGLE_AD_PLACEMENT_POLICIES_URL}
            >
              {GOOGLE_AD_PLACEMENT_POLICIES_URL}
            </Link>
          </li>
          <li>
            Privacy disclosures for Google publisher products:{" "}
            <Link
              className="text-coral hover:text-ink"
              href={GOOGLE_PUBLISHER_PRIVACY_DISCLOSURES_URL}
            >
              {GOOGLE_PUBLISHER_PRIVACY_DISCLOSURES_URL}
            </Link>
          </li>
        </ul>
      </section>
    </ContentPageShell>
  );
}
