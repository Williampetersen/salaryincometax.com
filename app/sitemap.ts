import type { MetadataRoute } from "next";

import { getAllCountries } from "@/lib/country-catalog";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const countryUrls = getAllCountries().map((country) => ({
    url: `${SITE_URL}/salary-calculator/${country.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified,
  }));

  return [
    {
      url: SITE_URL,
      changeFrequency: "weekly",
      priority: 1,
      lastModified,
    },
    {
      url: `${SITE_URL}/salary-calculator`,
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified,
    },
    ...countryUrls,
  ];
}
