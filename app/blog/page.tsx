import type { Metadata } from "next";
import Link from "next/link";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { StructuredData } from "@/components/seo/structured-data";
import {
  buildBlogCollectionSchema,
  getAllBlogPosts,
  getBlogCategories,
  getBlogCountries,
  getFeaturedBlogPosts,
} from "@/lib/blog";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Salary, Tax and Cost of Living Blog",
  description:
    "Explore salary guides, income tax explainers, minimum wage updates, and cost of living articles for countries and major cities covered by salaryincometax.com.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Salary, Tax and Cost of Living Blog | ${SITE_NAME}`,
    description:
      "Salary after tax guides, cost of living articles, minimum wage explainers, and income tax breakdowns by country.",
    url: `${SITE_URL}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: `Salary, Tax and Cost of Living Blog | ${SITE_NAME}`,
    description:
      "Salary after tax guides, cost of living articles, minimum wage explainers, and income tax breakdowns by country.",
  },
};

export default function BlogIndexPage(): JSX.Element {
  const posts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts(6);
  const categories = getBlogCategories();
  const countries = getBlogCountries();
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Blog", url: absoluteUrl("/blog") },
    ]),
    buildBlogCollectionSchema(
      "Salary, Tax and Cost of Living Blog",
      absoluteUrl("/blog"),
      "Salary guides, income tax explainers, cost of living articles, and minimum wage references by country and city.",
      posts.slice(0, 24),
    ),
  ];

  return (
    <div className="shell pb-16 pt-10">
      <StructuredData data={structuredData} />
      <div className="max-w-4xl">
        <BlogBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { label: "Blog" },
          ]}
        />
        <p className="eyebrow mt-5">Editorial hub</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          Salary, tax and cost of living blog
        </h1>
        <p className="mt-4 text-base leading-8 text-ink/68">
          Research salary after tax, cost of living, minimum wage, and income tax
          by country. Every published article links back to the relevant salary
          calculator so you can move from reading to estimating take-home pay in
          the same flow.
        </p>
        <p className="mt-3 text-sm leading-7 text-ink/62">
          Public blog pages are limited to the stronger reviewed article set.
          Lower-confidence drafts stay in the internal data layer until they are
          upgraded.
        </p>
      </div>

      <section className="panel mt-8 overflow-hidden p-6 sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Featured articles
            </p>
            <h2 className="mt-3 font-[var(--font-display)] text-3xl font-bold text-ink">
              High-intent guides built for search and comparison
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/66">
              Start with the biggest search intents: cost of living, salary after
              tax, income tax, and minimum wage.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm font-semibold">
            {categories.map((category) => (
              <Link
                className="rounded-full border border-ink/10 bg-white px-4 py-2 transition hover:border-coral/30 hover:text-coral"
                href={`/blog/category/${category.slug}`}
                key={category.slug}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {featuredPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">All articles</p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
              Browse the full content library
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-ink/66">
            Use search, country filtering, and category filtering to find the exact
            reviewed article that matches your query. The public library currently
            includes{" "}
            <span className="font-semibold text-ink">{posts.length}</span> pages.
          </p>
        </div>

        <BlogExplorer categories={categories} countries={countries} posts={posts} />
      </section>
    </div>
  );
}
