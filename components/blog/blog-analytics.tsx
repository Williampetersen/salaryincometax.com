"use client";

import { useEffect, useRef } from "react";

import { event } from "@/lib/gtag";

interface BlogAnalyticsProps {
  countryName: string;
  slug: string;
  title: string;
}

// Tracks article opens and scroll-depth milestones for blog pages.
export function BlogAnalytics({
  countryName,
  slug,
  title,
}: BlogAnalyticsProps): null {
  const hasTrackedFifty = useRef(false);
  const hasTrackedNinety = useRef(false);

  useEffect(() => {
    event({
      action: "article_opened",
      category: "blog",
      label: `${slug}:${countryName}`,
    });
  }, [countryName, slug, title]);

  useEffect(() => {
    function handleScroll(): void {
      const root = document.documentElement;
      const scrollableHeight = root.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollDepth = (window.scrollY / scrollableHeight) * 100;

      if (!hasTrackedFifty.current && scrollDepth >= 50) {
        hasTrackedFifty.current = true;
        event({
          action: "article_scroll_50",
          category: "blog",
          label: slug,
          value: 50,
        });
      }

      if (!hasTrackedNinety.current && scrollDepth >= 90) {
        hasTrackedNinety.current = true;
        event({
          action: "article_scroll_90",
          category: "blog",
          label: slug,
          value: 90,
        });
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return null;
}
