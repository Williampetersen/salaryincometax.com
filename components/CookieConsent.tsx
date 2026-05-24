"use client";

import { useEffect, useState } from "react";

import {
  getCookieConsentState,
  persistCookieConsent,
  type CookieConsentState,
} from "@/lib/gtag";

// Minimal GDPR-focused cookie banner. Analytics stays off until the visitor
// explicitly accepts it.
export function CookieConsent(): JSX.Element {
  const [consentState, setConsentState] = useState<CookieConsentState>(null);
  const [isBannerOpen, setIsBannerOpen] = useState(false);

  useEffect(() => {
    const storedConsent = getCookieConsentState();
    setConsentState(storedConsent);
    setIsBannerOpen(storedConsent === null);
  }, []);

  function updateConsent(nextState: Exclude<CookieConsentState, null>): void {
    persistCookieConsent(nextState);
    setConsentState(nextState);
    setIsBannerOpen(false);
  }

  return (
    <>
      {isBannerOpen ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-4xl border border-ink/12 bg-white/95 p-5 shadow-card backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
            Cookies
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-2xl font-bold text-ink">
            Analytics cookies need your consent
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            We use Google Analytics to understand how visitors use the site.
            Analytics stays disabled until you accept.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
              onClick={() => updateConsent("granted")}
              type="button"
            >
              Accept analytics cookies
            </button>
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
              onClick={() => updateConsent("denied")}
              type="button"
            >
              Only necessary cookies
            </button>
          </div>
        </div>
      ) : null}

      {consentState ? (
        <button
          className="fixed bottom-4 right-4 z-40 rounded-full border border-ink/12 bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/65 shadow-card transition hover:border-coral/30 hover:text-coral"
          onClick={() => setIsBannerOpen(true)}
          type="button"
        >
          Cookie settings
        </button>
      ) : null}
    </>
  );
}
