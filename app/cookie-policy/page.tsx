import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageShell } from "@/components/content/content-page-shell";
import { ContentSections } from "@/components/content/content-sections";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import {
  GOOGLE_ADS_SETTINGS_URL,
  GOOGLE_PARTNER_SITES_DATA_URL,
  SUPPORT_EMAIL,
} from "@/lib/site";

export const metadata: Metadata = buildStaticPageMetadata(
  "Cookie Policy",
  "Read the salaryincometax.com cookie policy covering essential cookies, analytics cookies, advertising cookies, Google Analytics, Google AdSense, and user controls.",
  "/cookie-policy",
);

export default function CookiePolicyPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Cookie Policy", url: absoluteUrl("/cookie-policy") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Cookie Policy" },
      ]}
      description="This Cookie Policy explains what cookies and similar technologies may be used on salaryincometax.com, why they are used, and how visitors can control them."
      eyebrow="Policy"
      title="Cookie Policy"
    >
      <StructuredData data={structuredData} />
      <ContentSections
        sections={[
          {
            title: "What cookies are",
            paragraphs: [
              "Cookies are small text files or similar browser-storage technologies used to remember preferences, measure website usage, and support certain website features.",
              "Salaryincometax.com also uses browser storage for features such as recent calculator history and cookie preference choices.",
              "Depending on the service involved, similar technologies can also include web beacons, pixels, IP-based identifiers, or other browser and device identifiers.",
            ],
          },
          {
            title: "Essential cookies",
            paragraphs: [
              "Essential cookies or equivalent storage are always enabled because they are necessary for core functionality, such as remembering consent choices and supporting important site behavior.",
            ],
          },
          {
            title: "Analytics cookies",
            paragraphs: [
              "Analytics cookies are optional and are used to understand how visitors move through the site, which pages are used most, and where usability or content improvements are needed.",
              "We currently use Google Analytics for analytics measurement when the visitor accepts analytics cookies.",
            ],
          },
          {
            title: "Advertising cookies",
            paragraphs: [
              "Advertising cookies are optional and are relevant only when advertising services such as Google AdSense are active. They may be used to support ad delivery, ad measurement, frequency controls, or ad personalization by vendors involved in the advertising process.",
            ],
          },
          {
            title: "Google Analytics cookies",
            paragraphs: [
              "When analytics consent is granted, Google Analytics may use cookies or similar technologies to collect interaction data such as page views, route changes, article engagement, and calculator usage patterns.",
            ],
          },
          {
            title: "Google AdSense cookies",
            paragraphs: [
              "If Google AdSense is activated after approval, Google and third-party vendors may use cookies to serve ads based on previous visits to this or other sites. Advertising-related storage remains disabled unless the visitor explicitly accepts advertising cookies.",
              "When advertising is active, Google or other participating vendors may also use web beacons, IP addresses, or similar identifiers for ad delivery, measurement, fraud prevention, and personalization where permitted.",
            ],
          },
          {
            title: "How users can control cookies",
            paragraphs: [
              "Visitors can accept all cookies, reject non-essential cookies, or manage cookie preferences through the on-site cookie banner and settings control.",
              "Browser controls may also allow users to delete or block cookies, although doing so can affect some website behavior.",
            ],
          },
          {
            title: "Cookie consent explanation",
            paragraphs: [
              "Salaryincometax.com uses a consent-based model for non-essential cookies. Essential cookies stay enabled because the website relies on them for basic operation, while analytics and advertising cookies remain optional.",
            ],
          },
          {
            title: "Contact",
            paragraphs: [
              `For cookie-related questions, contact ${SUPPORT_EMAIL}.`,
            ],
          },
        ]}
      />
      <section className="panel mt-6 p-5 text-base leading-8 text-ink/72 sm:p-7">
        <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
          Helpful controls
        </h2>
        <p className="mt-4">
          Google Ad Settings:{" "}
          <Link className="text-coral hover:text-ink" href={GOOGLE_ADS_SETTINGS_URL}>
            {GOOGLE_ADS_SETTINGS_URL}
          </Link>
        </p>
        <p className="mt-3">
          How Google uses data from partner sites:{" "}
          <Link
            className="text-coral hover:text-ink"
            href={GOOGLE_PARTNER_SITES_DATA_URL}
          >
            {GOOGLE_PARTNER_SITES_DATA_URL}
          </Link>
        </p>
      </section>
    </ContentPageShell>
  );
}
