import { GoogleAnalyticsTracker } from "@/components/google-analytics-tracker";

// Thin wrapper that keeps App Router GA tracking logic mounted globally. The
// manual Google tag snippet itself is emitted directly from the root layout.
export function GoogleAnalytics(): JSX.Element {
  return <GoogleAnalyticsTracker />;
}
