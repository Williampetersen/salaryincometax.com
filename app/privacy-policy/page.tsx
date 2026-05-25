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
  "Privacy Policy",
  "Read the salaryincometax.com privacy policy covering contact form data, analytics, cookies, Google services, user rights, retention, and deletion requests.",
  "/privacy-policy",
);

export default function PrivacyPolicyPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Privacy Policy", url: absoluteUrl("/privacy-policy") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Privacy Policy" },
      ]}
      description="This Privacy Policy explains what information salaryincometax.com collects, how it is used, which third-party services are involved, and what rights users have."
      eyebrow="Policy"
      title="Privacy Policy"
    >
      <StructuredData data={structuredData} />
      <div className="space-y-6">
        <ContentSections
          sections={[
            {
              title: "Introduction",
              paragraphs: [
                "This Privacy Policy describes how salaryincometax.com collects, uses, stores, and discloses information when you use the website, its calculators, blog pages, and contact forms.",
                "The site is designed to offer salary, income-tax, cost-of-living, and editorial information while limiting unnecessary data collection. We do not ask users to create accounts for basic use of the calculators or blog.",
              ],
            },
            {
              title: "Information we collect",
              bullets: [
                "Technical usage information such as page views, browser information, device data, and interaction data when analytics consent is granted.",
                "Contact form details you submit, including your name, email address, subject, message, and consent confirmation.",
                "Locally stored preference information such as cookie choices and recent calculator history stored in your browser.",
              ],
            },
            {
              title: "Contact form data",
              paragraphs: [
                "If you contact us through the contact page, we collect the information you provide so we can review, respond to, and follow up on your inquiry. We do not use contact form data for unrelated marketing unless you separately request that type of communication in the future.",
                `If you would like contact-form information deleted after your request has been handled, you can email ${SUPPORT_EMAIL}.`,
              ],
            },
            {
              title: "Analytics data",
              paragraphs: [
                "When analytics cookies are accepted, we use Google Analytics to understand how the site is used, which pages perform well, and where improvements are needed. This helps us improve navigation, content quality, and calculator usability.",
                "Analytics data is aggregated and used for operational, editorial, and product-improvement purposes rather than for personalized user profiles inside the site itself.",
              ],
            },
            {
              title: "Cookies",
              paragraphs: [
                "The site uses essential cookies or equivalent browser storage to remember consent choices and to support core functionality. Optional cookies may be used for analytics and, after approval and activation, advertising.",
                "You can read the dedicated Cookie Policy for more detail about specific categories and user controls.",
              ],
            },
            {
              title: "Google Analytics",
              paragraphs: [
                "Google Analytics is loaded only after analytics consent has been granted. It may use cookies or similar technologies to measure visits, route changes, article engagement, and calculator interactions.",
                "You can revoke analytics consent later through the cookie settings control shown on the site.",
              ],
            },
            {
              title: "Google AdSense and advertising cookies",
              paragraphs: [
                "The website may display ads through Google AdSense after approval. If advertising is activated in the future, Google and third-party vendors may use cookies to serve ads based on previous visits to this site or other sites.",
                "Advertising-related scripts and storage are not activated until the relevant advertising consent has been granted through the site's cookie controls.",
                "When advertising is active, Google or other participating vendors may place and read cookies, use web beacons, collect IP address information, or use similar identifiers to support ad delivery, measurement, fraud prevention, and ad personalization where legally permitted.",
              ],
            },
            {
              title: "Third-party vendors and Google partner-site data",
              paragraphs: [
                "Third-party vendors, including Google, may process data in connection with analytics or advertising services when those services are active and consent has been provided where required.",
                "Users can manage ad personalization through Google Ad Settings and can learn more about how Google uses data from partner sites through Google's partner-sites data disclosure.",
              ],
            },
            {
              title: "Legal basis for EU and GDPR users",
              paragraphs: [
                "Where the GDPR or similar laws apply, our legal bases may include consent for optional analytics and advertising cookies, legitimate interests for site security and essential operation, and steps taken at the user's request when responding to contact inquiries.",
                "Essential website functions remain available even if optional analytics or advertising consent is rejected.",
              ],
            },
            {
              title: "User rights",
              bullets: [
                "Request access to the personal data we hold about you.",
                "Request correction or deletion of contact-form information where applicable.",
                "Withdraw optional cookie consent at any time through cookie settings.",
                "Object to or restrict certain processing where the law gives you that right.",
              ],
            },
            {
              title: "Data retention",
              paragraphs: [
                "Contact form data is retained for as long as reasonably necessary to respond to the inquiry, maintain basic correspondence records, resolve follow-up issues, and comply with legal obligations.",
                "Analytics and cookie-preference data retention depends partly on the underlying third-party service configuration and your browser storage lifecycle.",
              ],
            },
            {
              title: "How to request deletion",
              paragraphs: [
                `To request deletion of contact-form data or to raise a privacy question, email ${SUPPORT_EMAIL} and include enough detail for us to identify the request accurately.`,
              ],
            },
            {
              title: "Children's privacy",
              paragraphs: [
                "Salaryincometax.com is not directed to children under 13, and we do not knowingly collect personal information from children through the site.",
                "If you believe a child has submitted personal data to us, contact us so we can review and remove it where appropriate.",
              ],
            },
            {
              title: "External links",
              paragraphs: [
                "The site links to official tax authorities, public statistics sources, Google services, and other external resources. Those third-party websites operate under their own privacy policies and practices.",
              ],
            },
            {
              title: "Policy updates",
              paragraphs: [
                "This Privacy Policy may be updated as the site grows, legal requirements evolve, or third-party service usage changes. Material changes will be reflected on this page with updated wording or structure.",
              ],
            },
            {
              title: "Contact",
              paragraphs: [
                `For privacy questions or requests, contact ${SUPPORT_EMAIL}.`,
              ],
            },
          ]}
        />

        <section className="panel p-5 text-base leading-8 text-ink/72 sm:p-7">
          <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
            Helpful external controls
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
      </div>
    </ContentPageShell>
  );
}
