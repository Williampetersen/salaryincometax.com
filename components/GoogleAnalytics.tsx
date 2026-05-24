"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  GA_TRACKING_ID,
  buildPageUrl,
  getCookiePreferences,
  pageview,
} from "@/lib/gtag";

// Global GA4 loader for the App Router. The scripts only render in production
// after consent is granted, while route changes still log in development.
export function GoogleAnalytics(): JSX.Element | null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [hasAnalyticsConsent, setHasAnalyticsConsent] = useState(
    () => getCookiePreferences()?.analytics ?? false,
  );
  const [isScriptReady, setIsScriptReady] = useState(
    process.env.NODE_ENV !== "production",
  );
  const hasHandledInitialRoute = useRef(false);
  const search = searchParams?.toString() ?? "";
  const url = buildPageUrl(pathname ?? "/", search);
  const shouldRenderScripts =
    process.env.NODE_ENV === "production" &&
    hasAnalyticsConsent &&
    Boolean(GA_TRACKING_ID);

  useEffect(() => {
    function syncConsent(): void {
      setHasAnalyticsConsent(getCookiePreferences()?.analytics ?? false);
    }

    syncConsent();
    window.addEventListener("cookie-preferences-updated", syncConsent);
    window.addEventListener("storage", syncConsent);

    return () => {
      window.removeEventListener("cookie-preferences-updated", syncConsent);
      window.removeEventListener("storage", syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!shouldRenderScripts) {
      setIsScriptReady(process.env.NODE_ENV !== "production");
      return;
    }

    const interval = window.setInterval(() => {
      if (typeof window.gtag === "function") {
        setIsScriptReady(true);
        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, [shouldRenderScripts]);

  useEffect(() => {
    if (!hasAnalyticsConsent || !isScriptReady || !GA_TRACKING_ID) {
      return;
    }

    // The initial production page view is handled by gtag('config'). Manual
    // pageview events are sent for subsequent App Router navigations.
    if (!hasHandledInitialRoute.current) {
      hasHandledInitialRoute.current = true;

      if (process.env.NODE_ENV !== "production") {
        pageview(url);
      }

      return;
    }

    pageview(url);
  }, [hasAnalyticsConsent, isScriptReady, url]);

  if (!GA_TRACKING_ID) {
    return null;
  }

  return shouldRenderScripts ? (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_TRACKING_ID}');
        `}
      </Script>
    </>
  ) : null;
}
