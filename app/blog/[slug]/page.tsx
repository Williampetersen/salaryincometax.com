import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogImage } from "@/components/blog/blog-image";
import { BlogAnalytics } from "@/components/blog/blog-analytics";
import { RelatedCalculatorBox } from "@/components/blog/related-calculator-box";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { StructuredData } from "@/components/seo/structured-data";
import { CountryFlag } from "@/components/shared/country-flag";
import { getBlogCountry } from "@/data/blog/countries";
import {
  buildArticleSchema,
  buildFaqSchema,
  formatBlogDate,
  getBlogPostBySlug,
  getBlogStaticPaths,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

const ARTICLE_DISCLAIMER =
  "This content is for general information only and is not tax, legal, financial, or accounting advice.";

export function generateStaticParams(): Array<{ slug: string }> {
  return getBlogStaticPaths().posts.map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: BlogArticlePageProps): Metadata {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog article",
    };
  }

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.metaTitle} | ${SITE_NAME}`,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      type: "article",
      images: [
        {
          url: post.image,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.metaTitle} | ${SITE_NAME}`,
      description: post.metaDescription,
      images: [post.image],
    },
    keywords: [post.keyword, post.countryName, post.categoryLabel],
  };
}

export default function BlogArticlePage({
  params,
}: BlogArticlePageProps): JSX.Element {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const country = getBlogCountry(post.countrySlug);
  const relatedPosts = getRelatedBlogPosts(post.slug, 3);
  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Blog", url: absoluteUrl("/blog") },
      {
        name: post.categoryLabel,
        url: absoluteUrl(`/blog/category/${post.category}`),
      },
      { name: post.title, url: absoluteUrl(`/blog/${post.slug}`) },
    ]),
    buildArticleSchema(post),
    buildFaqSchema(post.faqItems),
  ];

  return (
    <div className="shell pb-16 pt-10">
      <StructuredData data={structuredData} />
      <BlogAnalytics
        countryName={post.countryName}
        slug={post.slug}
        title={post.title}
      />
      <div className="max-w-5xl">
        <BlogBreadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/blog", label: "Blog" },
            { href: `/blog/category/${post.category}`, label: post.categoryLabel },
            { label: post.title },
          ]}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0 space-y-6">
          <header className="panel overflow-hidden">
            <div className="relative aspect-[16/8] min-h-[16rem] bg-ink/5">
              <BlogImage
                alt={post.title}
                className="object-cover"
                fill
                priority
                sizes="(min-width: 1280px) 900px, 100vw"
                src={post.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70"
                    href={`/blog/category/${post.category}`}
                  >
                    {post.categoryLabel}
                  </Link>
                  {country ? (
                    <Link
                      className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/70"
                      href={`/blog/country/${country.slug}`}
                    >
                      {country.name}
                    </Link>
                  ) : null}
                </div>
                <h1 className="mt-4 max-w-4xl font-[var(--font-display)] text-4xl font-bold tracking-tight text-white sm:text-5xl">
                  {post.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-8 text-white/80">
                  {post.heroSummary}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span>{post.readingTime}</span>
                  <span>Updated {formatBlogDate(post.updatedAt)}</span>
                  <span>{post.author}</span>
                  {country ? (
                    <span className="inline-flex items-center gap-2">
                      <CountryFlag
                        className="h-5 w-5 rounded-full object-cover"
                        countryCode={country.slug.slice(0, 2).toUpperCase()}
                        countryName={country.name}
                        flagSrc={country.flagSrc}
                        size={20}
                      />
                      {post.cityName ? `${post.cityName}, ${country.name}` : country.name}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <section className="grid gap-4 md:grid-cols-3">
            {post.heroHighlights.map((highlight) => (
              <div
                className="rounded-3xl border border-ink/10 bg-white p-4"
                key={highlight}
              >
                <p className="text-sm font-semibold leading-6 text-ink">{highlight}</p>
              </div>
            ))}
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Key takeaways
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              {post.summaryBox.title}
            </h2>
            <div className="mt-5 grid gap-3">
              {post.summaryBox.items.map((item) => (
                <div
                  className="rounded-3xl border border-ink/10 bg-white px-4 py-4 text-sm leading-7 text-ink/72"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
            {post.summaryBox.note ? (
              <p className="mt-4 text-sm leading-7 text-ink/62">{post.summaryBox.note}</p>
            ) : null}
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Who this guide is for
            </p>
            <div className="mt-5 grid gap-3">
              {post.whoThisGuideIsFor.map((item) => (
                <div
                  className="rounded-3xl border border-ink/10 bg-white px-4 py-4 text-sm leading-7 text-ink/72"
                  key={item}
                >
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Quick answers
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {post.quickAnswers.map((item) => (
                <div
                  className="rounded-3xl border border-ink/10 bg-white p-4"
                  key={item.question}
                >
                  <p className="font-semibold text-ink">{item.question}</p>
                  <p className="mt-2 text-sm leading-7 text-ink/68">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Quick facts
            </p>
            <div className="mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                    <tr>
                      {post.quickFactsTable.columns.map((column) => (
                        <th className="px-4 py-3 font-semibold" key={column}>
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {post.quickFactsTable.rows.map((row, rowIndex) => (
                      <tr className="border-t border-ink/8" key={`${row.join("-")}-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                          <td
                            className={`px-4 py-3 text-ink/72 ${
                              cellIndex === 0 ? "font-semibold text-ink" : "tabular-nums"
                            }`}
                            key={`${cell}-${cellIndex}`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <RelatedCalculatorBox post={post} />

          <section className="panel p-5 sm:p-7">
            <div className="space-y-10">
              {post.sections.map((section) => (
                <section id={section.id} key={section.id}>
                  <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
                    {section.title}
                  </h2>
                  <div className="mt-4 space-y-4 text-base leading-8 text-ink/72">
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={`${section.id}-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                  {section.note ? (
                    <div className="mt-4 rounded-3xl border border-sand/70 bg-sand/40 px-4 py-3 text-sm leading-7 text-ink/72">
                      {section.note}
                    </div>
                  ) : null}
                  {section.table ? (
                    <div className="mt-5 overflow-hidden rounded-3xl border border-ink/10 bg-white">
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="bg-ink/4 text-left text-xs uppercase tracking-[0.18em] text-ink/55">
                            <tr>
                              {section.table.columns.map((column) => (
                                <th className="px-4 py-3 font-semibold" key={column}>
                                  {column}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row, rowIndex) => (
                              <tr
                                className="border-t border-ink/8"
                                key={`${section.id}-${rowIndex}`}
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    className={`px-4 py-3 text-ink/72 ${
                                      cellIndex === 0
                                        ? "font-semibold text-ink"
                                        : "tabular-nums"
                                    }`}
                                    key={`${section.id}-${rowIndex}-${cellIndex}`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Practical example
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              {post.practicalExample.title}
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/72">
              {post.practicalExample.scenario}
            </p>
            <div className="mt-5 grid gap-3">
              {post.practicalExample.steps.map((step) => (
                <div
                  className="rounded-3xl border border-ink/10 bg-white px-4 py-4 text-sm leading-7 text-ink/72"
                  key={step}
                >
                  {step}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm leading-7 text-ink/62">
              {post.practicalExample.takeaway}
            </p>
          </section>

          <section className="panel p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Important note
            </p>
            <p className="mt-4 text-base leading-8 text-ink/72">{ARTICLE_DISCLAIMER}</p>
          </section>

          <section className="panel p-5 sm:p-6" id="faq">
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/66">
              Direct answers to the search questions people ask most often about{" "}
              {post.countryName}.
            </p>
            <div className="mt-5">
              <BlogFaq items={post.faqItems} />
            </div>
          </section>

          <section className="panel p-5 sm:p-6" id="verdict">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
              Verdict
            </p>
            <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              {post.verdictTitle}
            </h2>
            <p className="mt-4 text-base leading-8 text-ink/72">
              {post.verdictSummary}
            </p>
          </section>

          <section className="panel p-5 sm:p-6">
            <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
              Sources
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-ink/68">
              {post.sources.map((source) => (
                <li key={source}>
                  <a
                    className="break-all text-coral transition hover:text-ink"
                    href={source}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {source}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="xl:sticky xl:top-24 xl:self-start">
          <TableOfContents sections={post.sections} />
        </aside>
      </div>

      {relatedPosts.length > 0 ? (
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">You might also like</p>
              <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold">
                Related articles
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-ink/66">
              Keep researching the same market with matching cost-of-living,
              salary, income-tax, and minimum-wage articles.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
