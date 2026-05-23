import type { MetadataRoute } from "next";

import { getAllCountries } from "@/lib/country-catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const countryUrls = getAllCountries().map((country) => ({
    url: `${SITE_URL}/salary-calculator/${country.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...countryUrls,
  ];
}
