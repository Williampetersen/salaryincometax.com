// Central GA4 and consent helpers. All analytics and advertising consent checks
// go through this file so behavior stays consistent across the app.
// GA measurement IDs are public identifiers, not secrets. Keep the environment
// variable as the primary source, but fall back to the production site ID so a
// missed Vercel env setting does not silently remove the Google tag.
const DEFAULT_GA_TRACKING_ID = "G-JKSYLWLEVD";

export const GA_TRACKING_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || DEFAULT_GA_TRACKING_ID;
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "";
export const COOKIE_PREFERENCES_KEY = "salaryincometax-cookie-preferences";
export const GOOGLE_CONSENT_WAIT_FOR_UPDATE_MS = 500;

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

interface GoogleConsentState {
  ad_personalization: "denied" | "granted";
  ad_storage: "denied" | "granted";
  ad_user_data: "denied" | "granted";
  analytics_storage: "denied" | "granted";
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

function toConsentValue(value: boolean): "denied" | "granted" {
  return value ? "granted" : "denied";
}

// Maps the app's cookie preferences onto Google's consent mode fields so the
// tag can load globally while storage remains denied until the user opts in.
export function buildGoogleConsentState(
  preferences: CookiePreferences | null,
): GoogleConsentState {
  const safePreferences = preferences ?? DEFAULT_COOKIE_PREFERENCES;
  const advertisingConsent = toConsentValue(safePreferences.advertising);

  return {
    analytics_storage: toConsentValue(safePreferences.analytics),
    ad_storage: advertisingConsent,
    ad_user_data: advertisingConsent,
    ad_personalization: advertisingConsent,
  };
}

export function updateGoogleConsent(
  preferences: CookiePreferences | null,
): void {
  if (!isBrowser()) {
    return;
  }

  const nextConsentState = buildGoogleConsentState(preferences);
  debugLog("consent update", nextConsentState);
  window.gtag?.("consent", "update", nextConsentState);
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
