"use client";

import { useEffect } from "react";

import { event } from "@/lib/gtag";

// Delegated click tracking for future UI elements. Any element with
// data-analytics-action/category/label/value will emit a GA event, e.g.
// contact_click or newsletter_signup buttons added later.
export function AnalyticsClickTracker(): null {
  useEffect(() => {
    function handleClick(mouseEvent: MouseEvent): void {
      const target = mouseEvent.target as HTMLElement | null;
      const trackedElement = target?.closest<HTMLElement>("[data-analytics-action]");

      if (!trackedElement) {
        return;
      }

      const action = trackedElement.dataset.analyticsAction;
      const category = trackedElement.dataset.analyticsCategory;

      if (!action || !category) {
        return;
      }

      const label = trackedElement.dataset.analyticsLabel;
      const rawValue = trackedElement.dataset.analyticsValue;
      const value = rawValue ? Number(rawValue) : undefined;

      event({
        action,
        category,
        label,
        value: Number.isFinite(value) ? value : undefined,
      });
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
