import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { StructuredData } from "@/components/seo/structured-data";
import {
  buildBlogCollectionSchema,
  getBlogCategories,
  getBlogCategory,
  getBlogPostsByCategory,
  getBlogStaticPaths,
} from "@/lib/blog";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface BlogCategoryPageProps {
  params: {
    category: string;
  };
}

export function generateStaticParams(): Array<{ category: string }> {
  return getBlogStaticPaths().categories.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: BlogCategoryPageProps): Metadata {
  const category = getBlogCategory(params.category);

  if (!category) {
    return {
      title: "Blog category",
    };
  }

  return {
    title: `${category.name} Articles`,
    description: category.description,
    alternates: {
      canonical: `${SITE_URL}/blog/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Articles | ${SITE_NAME}`,
      description: category.description,
      url: `${SITE_URL}/blog/category/${category.slug}`,
    },
  };
}

export default function BlogCategoryPage({
  params,
}: BlogCategoryPageProps): JSX.Element {
  const category = getBlogCategory(params.category);

  if (!category) {
    notFound();
  }

  const posts = getBlogPostsByCategory(category.slug);

  if (posts.length === 0) {
    notFound();
  }

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Blog", url: absoluteUrl("/blog") },
      { name: category.name, url: absoluteUrl(`/blog/category/${category.slug}`) },
    ]),
    buildBlogCollectionSchema(
      `${category.name} articles`,
      absoluteUrl(`/blog/category/${category.slug}`),
      category.description,
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
            { href: "/blog", label: "Blog" },
            { label: category.name },
          ]}
        />
        <p className="eyebrow mt-5">{category.name}</p>
        <h1 className="mt-4 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
          {category.name} articles
        </h1>
        <p className="mt-4 text-base leading-8 text-ink/68">
          {category.description}
        </p>
      </div>

      <section className="panel mt-8 grid gap-5 p-5 sm:p-7 lg:grid-cols-3">
        {buildCategoryGuidance(category.slug).map((item) => (
          <div className="rounded-3xl border border-ink/10 bg-white p-4" key={item.title}>
            <h2 className="font-[var(--font-display)] text-2xl font-bold text-ink">
              {item.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/68">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-4xl border border-sand/70 bg-sand/35 p-5 text-sm leading-7 text-ink/72 sm:p-6">
        <p className="font-semibold text-ink">How to use this archive</p>
        <p className="mt-2">
          Start with the article closest to your decision, then open the relevant{" "}
          <Link className="font-semibold text-coral hover:text-ink" href="/salary-calculator">
            salary calculator
          </Link>{" "}
          to test your own gross salary, tax year, and household assumptions. Category
          pages are kept limited to published guides with enough detail to support
          a real salary or relocation decision.
        </p>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

function buildCategoryGuidance(
  category: string,
): Array<{ title: string; text: string }> {
  switch (category) {
    case "cost-of-living":
      return [
        {
          title: "Compare after tax",
          text: "Cost guides should be read next to net salary, not gross salary. Rent and fixed bills decide whether a market works.",
        },
        {
          title: "Check household fit",
          text: "Single-person, couple, and family budgets can point to different answers, especially when childcare or larger housing is involved.",
        },
        {
          title: "Replace estimates",
          text: "Use current rent listings, transport prices, and employer benefit details before making a relocation commitment.",
        },
      ];
    case "income-tax":
      return [
        {
          title: "Read the payroll layers",
          text: "Income-tax guides explain brackets, allowances, social contributions, and local rules that can all affect take-home pay.",
        },
        {
          title: "Avoid bracket mistakes",
          text: "Top marginal rates do not apply to every currency unit of income. Effective tax rate is the better comparison metric.",
        },
        {
          title: "Verify tax year",
          text: "Always check the tax year and source notes before using a guide for negotiation or payroll planning.",
        },
      ];
    case "minimum-wage":
      return [
        {
          title: "Use as a floor",
          text: "Minimum wage is labour-market context, not a comfort benchmark. Compare it with rent and full-time hours.",
        },
        {
          title: "Calculate net pay",
          text: "Gross minimum wage can look very different after payroll deductions, hours, and paid weeks are applied.",
        },
        {
          title: "Test affordability",
          text: "A legal wage can still be hard to live on in high-rent cities, so pair the wage guide with cost-of-living pages.",
        },
      ];
    default:
      return [
        {
          title: "Start with the offer",
          text: "Salary guides are most useful when you compare a real offer against market benchmarks and monthly net pay.",
        },
        {
          title: "Compare like for like",
          text: "Convert gross, net, monthly, and annual figures into the same period before judging whether a salary is strong.",
        },
        {
          title: "Add location costs",
          text: "A strong salary can become average after rent, commute, and family costs are included.",
        },
      ];
  }
}
