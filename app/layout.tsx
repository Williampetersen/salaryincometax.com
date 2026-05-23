import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "@/app/globals.css";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TAGLINE} | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Estimate salary after tax across major global markets with editable JSON tax rules, reverse net-to-gross mode, and mobile-friendly country calculators.",
  openGraph: {
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description:
      "Estimate salary after tax across major global markets with editable JSON tax rules and reverse net-to-gross mode.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description:
      "Estimate salary after tax across major global markets with editable JSON tax rules and reverse net-to-gross mode.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html className={`${bodyFont.variable} ${displayFont.variable}`} lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
