import {
  BLOG_CATEGORIES,
  BLOG_COUNTRIES,
  getBlogCountry as getBlogCountryDefinition,
} from "@/data/blog/countries";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import type { BlogCategorySlug, BlogFaqItem, BlogPost } from "@/data/blog/types";
import { getPublicCalculatorCountries } from "@/lib/country-catalog";
import { absoluteUrl } from "@/lib/seo";
import { SITE_DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

// Kept in sync with the flagship allowlist in data/blog/blogPosts.ts (see
// the comment near DETAILED_COUNTRY_COST_COUNTRIES). Ordered so the first
// six slugs already cover six of the seven flagship countries, since
// getFeaturedBlogPosts(6) powers the public blog index hero row.
const FEATURED_BLOG_SLUGS = [
  "income-tax-in-united-states",
  "cost-of-living-in-united-kingdom",
  "income-tax-in-denmark",
  "average-salary-in-germany-after-tax",
  "average-salary-in-canada-after-tax",
  "average-salary-in-australia-after-tax",
  "income-tax-in-ireland",
  "minimum-wage-in-ireland",
  "cost-of-living-in-united-states",
  "cost-of-living-in-denmark",
  "cost-of-living-in-germany",
  "is-australia-expensive-to-live-in",
  "minimum-wage-in-canada",
  "income-tax-in-united-kingdom",
];

const PUBLIC_CALCULATOR_COUNTRY_SLUGS = new Set(
  getPublicCalculatorCountries().map((country) => country.slug),
);
const MINIMUM_COUNTRY_ARCHIVE_POSTS = 3;

function isPublishedBlogPost(post: BlogPost): boolean {
  if (post.researchStatus !== "expanded") {
    return false;
  }

  // Hand-written, country-agnostic guides (articleType "editorial-guide")
  // use an empty countrySlug and are not gated by the public-calculator
  // country list, since they are not tied to any single country's data.
  if (post.articleType === "editorial-guide") {
    return true;
  }

  return PUBLIC_CALCULATOR_COUNTRY_SLUGS.has(post.countrySlug);
}

function getPublishedBlogPostSet(): BlogPost[] {
  return BLOG_POSTS.filter(isPublishedBlogPost);
}

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function getAllBlogPosts(): BlogPost[] {
  return getPublishedBlogPostSet();
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return getPublishedBlogPostSet().find((post) => post.slug === slug);
}

export function getBlogCategory(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function getBlogCountry(slug: string) {
  return getBlogCountryDefinition(slug);
}

export function getBlogCategories() {
  return BLOG_CATEGORIES.filter((category) =>
    getPublishedBlogPostSet().some((post) => post.category === category.slug),
  );
}

export function getBlogCountries() {
  return BLOG_COUNTRIES.filter((country) =>
    getPublishedBlogPostSet().filter((post) => post.countrySlug === country.slug).length >=
      MINIMUM_COUNTRY_ARCHIVE_POSTS,
  );
}

// Countries with at least one published post, for UI filtering only (for
// example the blog country dropdown). Unlike getBlogCountries(), this does
// not require enough posts for a dedicated /blog/country/[country] archive
// page, so a leaner flagship set (2 posts per country) still gets a useful
// filter option even while its standalone archive page stays unpublished.
export function getBlogCountriesWithPosts() {
  const publishedCountrySlugs = new Set(
    getPublishedBlogPostSet().map((post) => post.countrySlug),
  );

  return BLOG_COUNTRIES.filter((country) => publishedCountrySlugs.has(country.slug));
}

export function hasBlogCountryArchive(countrySlug: string): boolean {
  return (
    getPublishedBlogPostSet().filter((post) => post.countrySlug === countrySlug).length >=
    MINIMUM_COUNTRY_ARCHIVE_POSTS
  );
}

export function getBlogPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return getPublishedBlogPostSet().filter((post) => post.category === category);
}

export function getBlogPostsByCountry(countrySlug: string): BlogPost[] {
  return getPublishedBlogPostSet().filter((post) => post.countrySlug === countrySlug);
}

export function getFeaturedBlogPosts(limit = 6): BlogPost[] {
  return FEATURED_BLOG_SLUGS.map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post))
    .slice(0, limit);
}

export function getRelatedBlogPosts(
  slug: string,
  limit = 3,
): BlogPost[] {
  const current = getBlogPostBySlug(slug);

  if (!current) {
    return [];
  }

  const explicit = current.relatedSlugs
    .map((relatedSlug) => getBlogPostBySlug(relatedSlug))
    .filter((post): post is BlogPost => Boolean(post));

  if (explicit.length >= limit) {
    return explicit.slice(0, limit);
  }

  const fallback = getPublishedBlogPostSet().filter(
    (post) =>
      post.slug !== current.slug &&
      (post.countrySlug === current.countrySlug || post.category === current.category),
  );

  return [...explicit, ...fallback]
    .filter(
      (post, index, array) =>
        array.findIndex((candidate) => candidate.slug === post.slug) === index,
    )
    .slice(0, limit);
}

export function getBlogStaticPaths() {
  return {
    categories: BLOG_CATEGORIES.map((category) => category.slug),
    countries: getBlogCountries().map((country) => country.slug),
    posts: getPublishedBlogPostSet().map((post) => post.slug),
  };
}

export function buildArticleSchema(post: BlogPost): Record<string, unknown> {
  const country = getBlogCountryDefinition(post.countrySlug);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    dateModified: post.updatedAt,
    datePublished: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: absoluteUrl("/authors/salaryincometax-editorial-team"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(SITE_DEFAULT_OG_IMAGE),
      },
    },
    image: absoluteUrl(SITE_DEFAULT_OG_IMAGE),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "en",
    articleSection: [post.categoryLabel, post.countryName],
    keywords: [post.keyword, post.countryName, post.categoryLabel],
    about: [
      post.countryName,
      post.categoryLabel,
      country?.calculatorUrl ? absoluteUrl(country.calculatorUrl) : absoluteUrl("/salary-calculator"),
    ].filter(Boolean),
  };
}

export function buildFaqSchema(faqItems: BlogFaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBlogCollectionSchema(
  pageName: string,
  pageUrl: string,
  description: string,
  posts: BlogPost[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: pageName,
    url: pageUrl,
    description,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: post.title,
        url: absoluteUrl(`/blog/${post.slug}`),
      })),
    },
  };
}
