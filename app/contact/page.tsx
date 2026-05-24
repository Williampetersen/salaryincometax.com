import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { ContentPageShell } from "@/components/content/content-page-shell";
import { StructuredData } from "@/components/seo/structured-data";
import { buildStaticPageMetadata } from "@/lib/navigation";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = buildStaticPageMetadata(
  "Contact Salary Income Tax",
  "Contact salaryincometax.com for support, corrections, partnership questions, or general inquiries using the website contact form.",
  "/contact",
);

export default function ContactPage(): JSX.Element {
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Contact", url: absoluteUrl("/contact") },
    ]),
  ];

  return (
    <ContentPageShell
      breadcrumbs={[
        { href: "/", label: "Home" },
        { label: "Contact" },
      ]}
      description="Use the contact form to report an issue, request a correction, ask a partnership question, or get help with a calculator or article."
      eyebrow="Contact"
      title="Contact Salary Income Tax"
    >
      <StructuredData data={structuredData} />
      <ContactForm />
    </ContentPageShell>
  );
}
