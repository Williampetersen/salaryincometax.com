import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleDecisionSupport } from "@/components/blog/article-decision-support";
import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { BlogFaq } from "@/components/blog/blog-faq";
import { BlogHeroArt } from "@/components/blog/blog-hero-art";
import { BlogAnalytics } from "@/components/blog/blog-analytics";
import { RelatedCalculatorBox } from "@/components/blog/related-calculator-box";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { StructuredData } from "@/components/seo/structured-data";
import { CountryFlag } from "@/components/shared/country-flag";
import { getBlogCountry } from "@/data/blog/countries";
import type { BlogArticleType, BlogPost } from "@/data/blog/types";
import {
  buildArticleSchema,
  buildFaqSchema,
  formatBlogDate,
  getBlogPostBySlug,
  getBlogStaticPaths,
  getRelatedBlogPosts,
  hasBlogCountryArchive,
} from "@/lib/blog";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/site";

interface BlogArticlePageProps {
  params: {
    slug: string;
  };
}

type PreBodySectionKey = "summary" | "who" | "quickAnswers" | "quickFacts";
type PostBodySectionKey = "practicalExample" | "importantNote" | "faq" | "verdict";

interface ArticleLayoutCopy {
  summaryEyebrow: string;
  whoEyebrow: string;
  quickAnswersEyebrow: string;
  quickFactsEyebrow: string;
  practicalEyebrow: string;
  noteEyebrow: string;
  noteText: string;
  verdictEyebrow: string;
  faqIntro: (post: BlogPost) => string;
  preBodyOrder: PreBodySectionKey[];
  postBodyOrder: PostBodySectionKey[];
}

// Each article type gets its own section labels, disclaimer wording, and box
// order so the 19 published articles don't all read as one fixed skeleton
// with the country name swapped in - the exact "scaled content" signal that
// drove three prior AdSense "low value content" rejections at the title and
// calculator-heading level. Content inside each box was already unique; this
// varies the shape of the page itself.
const ARTICLE_TYPE_LAYOUTS: Record<BlogArticleType, ArticleLayoutCopy> = {
  "country-cost-of-living": {
    summaryEyebrow: "Budget snapshot",
    whoEyebrow: "Who this budget fits",
    quickAnswersEyebrow: "Fast cost answers",
    quickFactsEyebrow: "Monthly cost breakdown",
    practicalEyebrow: "Sample monthly budget",
    noteEyebrow: "Before you budget around this",
    noteText:
      "Cost of living figures are planning benchmarks based on typical spending patterns, not a personal quote. Actual costs vary by neighborhood, lifestyle, and household size, and this is not financial advice.",
    verdictEyebrow: "Is it worth it",
    faqIntro: (post) =>
      `Direct answers to what people ask before moving to or budgeting for ${post.countryName}.`,
    preBodyOrder: ["quickFacts", "summary", "quickAnswers", "who"],
    postBodyOrder: ["practicalExample", "importantNote", "faq", "verdict"],
  },
  "city-cost-of-living": {
    summaryEyebrow: "City budget snapshot",
    whoEyebrow: "Who this city fits",
    quickAnswersEyebrow: "Fast city answers",
    quickFactsEyebrow: "Monthly cost breakdown",
    practicalEyebrow: "Sample city budget",
    noteEyebrow: "Before you rely on this",
    noteText:
      "City cost figures are planning benchmarks, not a quote. Rent and daily costs can vary sharply by neighborhood inside the same city, and this is not financial advice.",
    verdictEyebrow: "Worth the move?",
    faqIntro: (post) =>
      `Quick answers to what people ask before budgeting for ${post.cityName ?? post.countryName}.`,
    preBodyOrder: ["summary", "quickFacts", "who", "quickAnswers"],
    postBodyOrder: ["faq", "practicalExample", "importantNote", "verdict"],
  },
  "income-tax": {
    summaryEyebrow: "Tax snapshot",
    whoEyebrow: "Who should read this",
    quickAnswersEyebrow: "Fast answers",
    quickFactsEyebrow: "Tax facts at a glance",
    practicalEyebrow: "Worked example",
    noteEyebrow: "Before you file",
    noteText:
      "This guide explains how income tax generally works and is not tax, legal, financial, or accounting advice. Confirm your exact liability with your local tax authority or an accountant.",
    verdictEyebrow: "Bottom line",
    faqIntro: (post) =>
      `Quick answers to what people search before checking their ${post.countryName} tax bill.`,
    preBodyOrder: ["quickAnswers", "summary", "who", "quickFacts"],
    postBodyOrder: ["practicalExample", "faq", "verdict", "importantNote"],
  },
  "minimum-wage": {
    summaryEyebrow: "Wage snapshot",
    whoEyebrow: "Who this affects",
    quickAnswersEyebrow: "Common questions",
    quickFactsEyebrow: "Minimum wage facts",
    practicalEyebrow: "Real budget example",
    noteEyebrow: "Read before relying on this",
    noteText:
      "Minimum wage figures change with policy updates and can vary by age, sector, or region. Treat this as background information, not a payroll guarantee or financial advice.",
    verdictEyebrow: "What this means for you",
    faqIntro: (post) =>
      `Straight answers to what workers usually ask about the ${post.countryName} minimum wage.`,
    preBodyOrder: ["summary", "quickFacts", "who", "quickAnswers"],
    postBodyOrder: ["importantNote", "practicalExample", "faq", "verdict"],
  },
  "average-salary": {
    summaryEyebrow: "Salary snapshot",
    whoEyebrow: "Useful for",
    quickAnswersEyebrow: "At a glance",
    quickFactsEyebrow: "Salary benchmarks",
    practicalEyebrow: "How to use this benchmark",
    noteEyebrow: "A note on averages",
    noteText:
      "Average salary figures are benchmarks, not a prediction of any individual paycheck. Actual pay depends on role, seniority, sector, and employer, so treat this as general information rather than advice.",
    verdictEyebrow: "Takeaway",
    faqIntro: (post) =>
      `Answers to what job seekers usually ask about average pay in ${post.countryName}.`,
    preBodyOrder: ["who", "summary", "quickAnswers", "quickFacts"],
    postBodyOrder: ["faq", "practicalExample", "verdict", "importantNote"],
  },
  "gross-vs-net": {
    summaryEyebrow: "The short version",
    whoEyebrow: "Useful if you're",
    quickAnswersEyebrow: "Quick clarifications",
    quickFactsEyebrow: "Gross vs net at a glance",
    practicalEyebrow: "See the difference",
    noteEyebrow: "One caveat",
    noteText:
      "This explains general principles, not a specific payroll calculation. Deductions vary by country, employer, and personal circumstances, so treat this as general information rather than tax or financial advice.",
    verdictEyebrow: "The takeaway",
    faqIntro: () => "Quick answers to the gross-versus-net questions people search most.",
    preBodyOrder: ["quickAnswers", "who", "summary", "quickFacts"],
    postBodyOrder: ["practicalExample", "verdict", "faq", "importantNote"],
  },
  expensive: {
    summaryEyebrow: "Cost verdict at a glance",
    whoEyebrow: "Who should read this",
    quickAnswersEyebrow: "Quick verdicts",
    quickFactsEyebrow: "Cost comparison facts",
    practicalEyebrow: "See it in a budget",
    noteEyebrow: "Keep in mind",
    noteText:
      "“Expensive” is relative to income, household size, and lifestyle. Use this alongside local salary data before drawing a conclusion, and treat it as general information rather than financial advice.",
    verdictEyebrow: "Final verdict",
    faqIntro: (post) =>
      `Quick answers to the comparison questions people ask about ${post.countryName}.`,
    preBodyOrder: ["summary", "quickAnswers", "who", "quickFacts"],
    postBodyOrder: ["verdict", "practicalExample", "faq", "importantNote"],
  },
  "best-cities": {
    summaryEyebrow: "Shortlist snapshot",
    whoEyebrow: "Best for",
    quickAnswersEyebrow: "Quick picks",
    quickFactsEyebrow: "City comparison facts",
    practicalEyebrow: "How to shortlist",
    noteEyebrow: "Before you pick a city",
    noteText:
      "A ranking like this depends on the weighting between salary, rent, and lifestyle. Treat it as a starting shortlist rather than a personal recommendation or financial advice.",
    verdictEyebrow: "Our shortlist",
    faqIntro: (post) =>
      `Quick answers to how people narrow down cities in ${post.countryName}.`,
    preBodyOrder: ["quickFacts", "who", "summary", "quickAnswers"],
    postBodyOrder: ["practicalExample", "faq", "importantNote", "verdict"],
  },
  "editorial-guide": {
    summaryEyebrow: "The short version",
    whoEyebrow: "Who this explains things for",
    quickAnswersEyebrow: "Quick definitions",
    quickFactsEyebrow: "Reference table",
    practicalEyebrow: "Walkthrough example",
    noteEyebrow: "Good to know",
    noteText:
      "This is a general explainer, not tax, legal, financial, or accounting advice. Rules vary by country, so confirm specifics with a country calculator or a qualified adviser.",
    verdictEyebrow: "In short",
    faqIntro: () => "Quick answers to the questions people search most often on this topic.",
    preBodyOrder: ["quickAnswers", "summary", "who", "quickFacts"],
    postBodyOrder: ["practicalExample", "faq", "verdict", "importantNote"],
  },
};

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
          url: SITE_DEFAULT_OG_IMAGE,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.metaTitle} | ${SITE_NAME}`,
      description: post.metaDescription,
      images: [SITE_DEFAULT_OG_IMAGE],
    },
    keywords: [post.keyword, post.countryName, post.categoryLabel].filter(Boolean),
  };
}

export default function BlogArticlePage({
  params,
}: BlogArticlePageProps): JSX.Element {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const layout = ARTICLE_TYPE_LAYOUTS[post.articleType];
  const country = getBlogCountry(post.countrySlug);
  const countryHref =
    country && hasBlogCountryArchive(country.slug)
      ? `/blog/country/${country.slug}`
      : post.calculatorUrl;
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
              <BlogHeroArt className="absolute inset-0" post={post} priority />
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
                      href={countryHref}
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
                  <Link
                    className="underline underline-offset-4 transition hover:text-white"
                    href="/authors/salaryincometax-editorial-team"
                  >
                    Editorial profile
                  </Link>
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

          {/* This checklist assumes a specific country context (calculator
              link, "open the X calculator" copy) and does not apply to
              hand-written, country-agnostic guides. */}
          {post.countryName ? <ArticleDecisionSupport post={post} /> : null}

          {layout.preBodyOrder.map((sectionKey) => {
            if (sectionKey === "summary") {
              return (
                <section className="panel p-5 sm:p-6" key={sectionKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                    {layout.summaryEyebrow}
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
              );
            }

            if (sectionKey === "who") {
              return (
                <section className="panel p-5 sm:p-6" key={sectionKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                    {layout.whoEyebrow}
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
              );
            }

            if (sectionKey === "quickAnswers") {
              return (
                <section className="panel p-5 sm:p-6" key={sectionKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                    {layout.quickAnswersEyebrow}
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
              );
            }

            return (
              <section className="panel p-5 sm:p-6" key={sectionKey}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                  {layout.quickFactsEyebrow}
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
                          <tr
                            className="border-t border-ink/8"
                            key={`${row.join("-")}-${rowIndex}`}
                          >
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
            );
          })}

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

          {layout.postBodyOrder.map((sectionKey) => {
            if (sectionKey === "practicalExample") {
              return (
                <section className="panel p-5 sm:p-6" key={sectionKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                    {layout.practicalEyebrow}
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
              );
            }

            if (sectionKey === "importantNote") {
              return (
                <section className="panel p-5 sm:p-6" key={sectionKey}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                    {layout.noteEyebrow}
                  </p>
                  <p className="mt-4 text-base leading-8 text-ink/72">{layout.noteText}</p>
                </section>
              );
            }

            if (sectionKey === "faq") {
              return (
                <section className="panel p-5 sm:p-6" id="faq" key={sectionKey}>
                  <h2 className="font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
                    Frequently asked questions
                  </h2>
                  <p className="mt-3 text-sm leading-7 text-ink/66">{layout.faqIntro(post)}</p>
                  <div className="mt-5">
                    <BlogFaq items={post.faqItems} />
                  </div>
                </section>
              );
            }

            return (
              <section className="panel p-5 sm:p-6" id="verdict" key={sectionKey}>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-coral">
                  {layout.verdictEyebrow}
                </p>
                <h2 className="mt-4 font-[var(--font-display)] text-3xl font-bold tracking-tight text-ink">
                  {post.verdictTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-ink/72">{post.verdictSummary}</p>
              </section>
            );
          })}

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
