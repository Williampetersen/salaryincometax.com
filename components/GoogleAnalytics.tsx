import Script from "next/script";

import { GoogleAnalyticsTracker } from "@/components/google-analytics-tracker";
import {
  GA_TRACKING_ID,
  GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS,
} from "@/lib/gtag";

// Global GA4 installer for the App Router. The Google tag is mounted once from
// the root layout so it applies to every route, while consent-aware tracking
// logic runs in the client tracker component.
export function GoogleAnalytics(): JSX.Element {
  const shouldLoadScripts =
    process.env.NODE_ENV === "production" && Boolean(GA_TRACKING_ID);

  return (
    <>
      {shouldLoadScripts ? (
        <>
          <Script
            id="google-tag-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-tag-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'wait_for_update': ${GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS}
              });
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                'send_page_view': false
              });
            `}
          </Script>
        </>
      ) : null}
      <GoogleAnalyticsTracker />
    </>
  );
}
