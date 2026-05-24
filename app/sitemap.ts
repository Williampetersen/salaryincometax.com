import type { MetadataRoute } from "next";

import { getAllBlogPosts, getBlogStaticPaths } from "@/lib/blog";
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
  const blogPaths = getBlogStaticPaths();
  const blogPosts = getAllBlogPosts();
  const blogUrls = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: post.templateStatus === "detailed" ? 0.85 : 0.7,
    lastModified: new Date(post.updatedAt),
  }));
  const blogCategoryUrls = blogPaths.categories.map((category) => ({
    url: `${SITE_URL}/blog/category/${category}`,
    changeFrequency: "weekly" as const,
    priority: 0.75,
    lastModified,
  }));
  const blogCountryUrls = blogPaths.countries.map((country) => ({
    url: `${SITE_URL}/blog/country/${country}`,
    changeFrequency: "weekly" as const,
    priority: 0.72,
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
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.88,
      lastModified,
    },
    ...countryUrls,
    ...blogCategoryUrls,
    ...blogCountryUrls,
    ...blogUrls,
  ];
}
