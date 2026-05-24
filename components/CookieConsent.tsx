"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  DEFAULT_COOKIE_PREFERENCES,
  getCookiePreferences,
  hasMadeCookieChoice,
  persistCookiePreferences,
  type CookiePreferences,
} from "@/lib/gtag";

// GDPR-focused cookie banner with explicit preferences for essential,
// analytics, and advertising cookies.
export function CookieConsent(): JSX.Element {
  const [preferences, setPreferences] = useState<CookiePreferences>(
    DEFAULT_COOKIE_PREFERENCES,
  );
  const [isBannerOpen, setIsBannerOpen] = useState(false);
  const [isManagingPreferences, setIsManagingPreferences] = useState(false);

  useEffect(() => {
    const storedPreferences = getCookiePreferences();
    setPreferences(storedPreferences ?? DEFAULT_COOKIE_PREFERENCES);
    setIsBannerOpen(!hasMadeCookieChoice());
  }, []);

  function savePreferences(nextPreferences: CookiePreferences): void {
    persistCookiePreferences(nextPreferences);
    setPreferences(nextPreferences);
    setIsBannerOpen(false);
    setIsManagingPreferences(false);
  }

  return (
    <>
      {isBannerOpen ? (
        <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-4xl border border-ink/12 bg-white/95 p-5 shadow-card backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-coral">
            Cookie consent
          </p>
          <h2 className="mt-3 font-[var(--font-display)] text-2xl font-bold text-ink">
            Choose how cookies are used
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            Essential cookies keep the site working. Analytics cookies help us
            understand usage, and advertising cookies are only relevant after
            AdSense approval. You can read more in our{" "}
            <Link className="text-coral hover:text-ink" href="/privacy-policy">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link className="text-coral hover:text-ink" href="/cookie-policy">
              Cookie Policy
            </Link>
            .
          </p>

          {isManagingPreferences ? (
            <div className="mt-5 space-y-4 rounded-3xl border border-ink/10 bg-paper/55 p-4">
              <PreferenceRow
                checked
                description="Required for security, navigation, and core site features."
                disabled
                label="Essential cookies"
                onChange={() => undefined}
              />
              <PreferenceRow
                checked={preferences.analytics}
                description="Allows Google Analytics to measure visits and behavior."
                label="Analytics cookies"
                onChange={(checked) =>
                  setPreferences((current) => ({
                    ...current,
                    analytics: checked,
                  }))
                }
              />
              <PreferenceRow
                checked={preferences.advertising}
                description="Allows advertising-related storage when AdSense is enabled after approval."
                label="Advertising cookies"
                onChange={(checked) =>
                  setPreferences((current) => ({
                    ...current,
                    advertising: checked,
                  }))
                }
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
              onClick={() =>
                savePreferences({
                  essential: true,
                  analytics: true,
                  advertising: true,
                })
              }
              type="button"
            >
              Accept all
            </button>
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
              onClick={() => savePreferences(DEFAULT_COOKIE_PREFERENCES)}
              type="button"
            >
              Reject non-essential
            </button>
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
              onClick={() => {
                if (isManagingPreferences) {
                  savePreferences(preferences);
                  return;
                }

                setIsManagingPreferences(true);
              }}
              type="button"
            >
              {isManagingPreferences ? "Save preferences" : "Manage preferences"}
            </button>
          </div>
        </div>
      ) : null}

      {hasMadeCookieChoice() ? (
        <button
          className="fixed bottom-4 right-4 z-40 rounded-full border border-ink/12 bg-white/92 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink/65 shadow-card transition hover:border-coral/30 hover:text-coral"
          onClick={() => {
            setPreferences(getCookiePreferences() ?? DEFAULT_COOKIE_PREFERENCES);
            setIsBannerOpen(true);
            setIsManagingPreferences(true);
          }}
          type="button"
        >
          Cookie settings
        </button>
      ) : null}
    </>
  );
}

function PreferenceRow({
  checked,
  description,
  disabled = false,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}): JSX.Element {
  return (
    <label className="flex items-start gap-3 rounded-3xl border border-ink/10 bg-white/85 p-4 text-sm text-ink/72">
      <input
        checked={checked}
        className="mt-1 h-4 w-4 rounded border-ink/20 text-coral focus:ring-coral/20"
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        type="checkbox"
      />
      <span>
        <span className="block font-semibold text-ink">{label}</span>
        <span className="mt-1 block leading-6">{description}</span>
      </span>
    </label>
  );
}
