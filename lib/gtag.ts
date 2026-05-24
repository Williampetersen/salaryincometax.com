// Central GA4 helpers. All tracking goes through this file so consent checks,
// environment handling, and development logging stay consistent.
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";
export const COOKIE_CONSENT_KEY = "salaryincometax-cookie-consent";

export type CookieConsentState = "granted" | "denied" | null;

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

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function debugLog(message: string, payload?: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[ga] ${message}`, payload ?? "");
  }
}

export function getCookieConsentState(): CookieConsentState {
  if (!isBrowser()) {
    return null;
  }

  const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_KEY);

  return storedConsent === "granted" || storedConsent === "denied"
    ? storedConsent
    : null;
}

export function hasAnalyticsConsent(): boolean {
  return getCookieConsentState() === "granted";
}

export function persistCookieConsent(
  nextState: Exclude<CookieConsentState, null>,
): void {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(COOKIE_CONSENT_KEY, nextState);
  document.documentElement.dataset.cookieConsent = nextState;
  window.dispatchEvent(
    new CustomEvent("cookie-consent-updated", {
      detail: nextState,
    }),
  );
  debugLog("cookie consent updated", nextState);
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

  if (process.env.NODE_ENV === "production" && typeof window.gtag !== "function") {
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
