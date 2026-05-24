// Central GA4 and consent helpers. All analytics and advertising consent checks
// go through this file so behavior stays consistent across the app.
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
export const COOKIE_PREFERENCES_KEY = "salaryincometax-cookie-preferences";

export interface CookiePreferences {
  advertising: boolean;
  analytics: boolean;
  essential: true;
}

interface TrackEventInput {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const DEFAULT_COOKIE_PREFERENCES: CookiePreferences = {
  essential: true,
  analytics: false,
  advertising: false,
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function debugLog(message: string, payload?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[ga] ${message}`, payload ?? "");
  }
}

function isCookiePreferences(value: unknown): value is CookiePreferences {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const preferences = value as Record<string, unknown>;

  return (
    preferences.essential === true &&
    typeof preferences.analytics === "boolean" &&
    typeof preferences.advertising === "boolean"
  );
}

export function getCookiePreferences(): CookiePreferences | null {
  if (!isBrowser()) {
    return null;
  }

  const storedPreferences = window.localStorage.getItem(COOKIE_PREFERENCES_KEY);

  if (!storedPreferences) {
    // Backward compatibility for the old granted/denied string model.
    const legacyValue = window.localStorage.getItem("salaryincometax-cookie-consent");

    if (legacyValue === "granted") {
      return {
        essential: true,
        analytics: true,
        advertising: false,
      };
    }

    if (legacyValue === "denied") {
      return DEFAULT_COOKIE_PREFERENCES;
    }

    return null;
  }

  try {
    const parsed = JSON.parse(storedPreferences) as unknown;

    return isCookiePreferences(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function hasMadeCookieChoice(): boolean {
  return getCookiePreferences() !== null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookiePreferences()?.analytics ?? false;
}

export function hasAdvertisingConsent(): boolean {
  return getCookiePreferences()?.advertising ?? false;
}

export function persistCookiePreferences(
  nextPreferences: CookiePreferences,
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(
    COOKIE_PREFERENCES_KEY,
    JSON.stringify(nextPreferences),
  );
  window.localStorage.removeItem("salaryincometax-cookie-consent");

  document.documentElement.dataset.analyticsConsent = String(
    nextPreferences.analytics,
  );
  document.documentElement.dataset.advertisingConsent = String(
    nextPreferences.advertising,
  );
  window.dispatchEvent(
    new CustomEvent("cookie-preferences-updated", {
      detail: nextPreferences,
    }),
  );
  debugLog("cookie preferences updated", nextPreferences);
}

export function buildPageUrl(pathname: string, search = ""): string {
  return search ? `${pathname}?${search}` : pathname;
}

function canTrack(): boolean {
  if (!GA_TRACKING_ID) {
    debugLog("tracking skipped because NEXT_PUBLIC_GA_ID is missing");
    return false;
  }

  if (!isBrowser()) {
    return false;
  }

  if (!hasAnalyticsConsent()) {
    debugLog("tracking skipped because analytics consent is not granted");
    return false;
  }

  if (
    process.env.NODE_ENV === "production" &&
    typeof window.gtag !== "function"
  ) {
    debugLog("tracking skipped because gtag is not ready yet");
    return false;
  }

  return true;
}

export const pageview = (url: string): void => {
  if (!canTrack()) {
    return;
  }

  const payload = {
    page_path: url,
    page_location: `${window.location.origin}${url}`,
    send_to: GA_TRACKING_ID,
  };

  debugLog("pageview", payload);
  window.gtag?.("event", "page_view", payload);
};

export const event = ({
  action,
  category,
  label,
  value,
}: TrackEventInput): void => {
  if (!canTrack()) {
    return;
  }

  const payload = {
    event_category: category,
    ...(label ? { event_label: label } : {}),
    ...(typeof value === "number" ? { value } : {}),
    send_to: GA_TRACKING_ID,
  };

  debugLog(`event:${action}`, payload);
  window.gtag?.("event", action, payload);
};
