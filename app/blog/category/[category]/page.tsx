import type { Metadata } from "next";
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

      <div className="mt-8 grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
