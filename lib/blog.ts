import {
  BLOG_CATEGORIES,
  BLOG_COUNTRIES,
  getBlogCountry as getBlogCountryDefinition,
} from "@/data/blog/countries";
import { BLOG_POSTS } from "@/data/blog/blogPosts";
import type { BlogCategorySlug, BlogFaqItem, BlogPost } from "@/data/blog/types";
import { absoluteUrl } from "@/lib/seo";
import { SITE_DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

const FEATURED_BLOG_SLUGS = [
  "cost-of-living-in-germany",
  "cost-of-living-in-denmark",
  "cost-of-living-in-united-kingdom",
  "cost-of-living-in-united-states",
  "cost-of-living-in-canada",
  "cost-of-living-in-australia",
  "cost-of-living-in-singapore",
  "cost-of-living-in-japan",
  "income-tax-in-germany",
  "income-tax-in-denmark",
  "income-tax-in-united-kingdom",
  "minimum-wage-in-canada",
  "minimum-wage-in-ireland",
];

export function formatBlogDate(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function getAllBlogPosts(): BlogPost[] {
  return BLOG_POSTS;
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogCategory(slug: string) {
  return BLOG_CATEGORIES.find((category) => category.slug === slug);
}

export function getBlogCountry(slug: string) {
  return getBlogCountryDefinition(slug);
}

export function getBlogCategories() {
  return BLOG_CATEGORIES;
}

export function getBlogCountries() {
  return BLOG_COUNTRIES.filter((country) =>
    BLOG_POSTS.some((post) => post.countrySlug === country.slug),
  );
}

export function getBlogPostsByCategory(category: BlogCategorySlug): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.category === category);
}

export function getBlogPostsByCountry(countrySlug: string): BlogPost[] {
  return BLOG_POSTS.filter((post) => post.countrySlug === countrySlug);
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

  const fallback = BLOG_POSTS.filter(
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
    posts: BLOG_POSTS.map((post) => post.slug),
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
    image: absoluteUrl(post.image || SITE_DEFAULT_OG_IMAGE),
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    inLanguage: "en",
    articleSection: [post.categoryLabel, post.countryName],
    keywords: [post.keyword, post.countryName, post.categoryLabel],
    about: [
      post.countryName,
      post.categoryLabel,
      country?.calculatorUrl ? absoluteUrl(country.calculatorUrl) : absoluteUrl("/salary-calculator"),
    ],
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
