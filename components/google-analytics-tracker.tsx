"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_COOKIE_PREFERENCES,
  GA_TRACKING_ID,
  buildPageUrl,
  getCookiePreferences,
  pageview,
  type CookiePreferences,
  updateGoogleConsent,
} from "@/lib/gtag";

// Client-side GA tracker for App Router navigation. The Google tag script is
// mounted by the server component wrapper, while this tracker reacts to consent
// changes and route changes.
export function GoogleAnalyticsTracker(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [preferences, setPreferences] = useState<CookiePreferences>(
    () => getCookiePreferences() ?? DEFAULT_COOKIE_PREFERENCES,
  );
  const [isScriptReady, setIsScriptReady] = useState(
    process.env.NODE_ENV !== "production",
  );
  const hasLoggedDebugReady = useRef(false);
  const lastTrackedUrl = useRef<string | null>(null);
  const search = searchParams?.toString() ?? "";
  const url = buildPageUrl(pathname ?? "/", search);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.log("GA Loaded");
    }
  }, []);

  useEffect(() => {
    function syncConsent(): void {
      setPreferences(getCookiePreferences() ?? DEFAULT_COOKIE_PREFERENCES);
    }

    if (process.env.NODE_ENV !== "production" && !GA_TRACKING_ID) {
      console.log("[ga] NEXT_PUBLIC_GA_ID is missing");
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
    if (process.env.NODE_ENV !== "production" || !GA_TRACKING_ID) {
      setIsScriptReady(process.env.NODE_ENV !== "production");
      return;
    }

    const interval = window.setInterval(() => {
      if (typeof window.gtag === "function") {
        setIsScriptReady(true);

        if (!hasLoggedDebugReady.current) {
          console.log("GA Loaded");
          hasLoggedDebugReady.current = true;
        }

        window.clearInterval(interval);
      }
    }, 100);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isScriptReady || !GA_TRACKING_ID) {
      return;
    }

    updateGoogleConsent(preferences);
  }, [isScriptReady, preferences]);

  useEffect(() => {
    if (!preferences.analytics) {
      lastTrackedUrl.current = null;
      return;
    }

    if (!isScriptReady || !GA_TRACKING_ID) {
      return;
    }

    if (lastTrackedUrl.current === url) {
      return;
    }

    lastTrackedUrl.current = url;
    pageview(url);
  }, [isScriptReady, preferences.analytics, url]);

  return null;
}
