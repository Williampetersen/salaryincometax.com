import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Manrope, Space_Grotesk } from "next/font/google";
import { Suspense } from "react";

import { AnalyticsClickTracker } from "@/components/analytics-click-tracker";
import { CookieConsent } from "@/components/CookieConsent";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import "@/app/globals.css";
import {
  SITE_DEFAULT_OG_IMAGE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/site";
import {
  GA_TRACKING_ID,
  GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS,
} from "@/lib/gtag";
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
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "salary after tax",
    "salary calculator",
    "income tax calculator",
    "net salary calculator",
    "gross to net salary",
    "net to gross salary",
    "salary after tax by country",
  ],
  category: "finance",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/websitelogo/logo transparent.png",
    shortcut: "/websitelogo/logo transparent.png",
    apple: "/websitelogo/logo transparent.png",
  },
  openGraph: {
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: SITE_DEFAULT_OG_IMAGE,
        width: 512,
        height: 512,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TAGLINE} | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    images: [SITE_DEFAULT_OG_IMAGE],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  const shouldInstallGoogleTag =
    process.env.NODE_ENV === "production" && Boolean(GA_TRACKING_ID);

  return (
    <html className={`${bodyFont.variable} ${displayFont.variable}`} lang="en">
      <head>
        {shouldInstallGoogleTag ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  window.gtag = gtag;
                  gtag('consent', 'default', {
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    analytics_storage: 'denied',
                    wait_for_update: ${GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS}
                  });
                  gtag('js', new Date());
                  gtag('config', '${GA_TRACKING_ID}');
                `,
              }}
            />
          </>
        ) : null}
      </head>
      <body>
        {/* Analytics and consent are mounted once here so they cover every route. */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <AnalyticsClickTracker />
        <CookieConsent />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
        {/* Vercel Analytics runs globally here without changing the page layout. */}
        <Analytics />
      </body>
    </html>
  );
}
