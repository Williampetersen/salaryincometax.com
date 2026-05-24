import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlogBreadcrumbs } from "@/components/blog/blog-breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { CountryFlag } from "@/components/shared/country-flag";
import { StructuredData } from "@/components/seo/structured-data";
import {
  buildBlogCollectionSchema,
  getBlogCountries,
  getBlogPostsByCountry,
  getBlogStaticPaths,
} from "@/lib/blog";
import { getBlogCountry } from "@/data/blog/countries";
import { absoluteUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { SITE_NAME, SITE_URL } from "@/lib/site";

interface BlogCountryPageProps {
  params: {
    country: string;
  };
}

export function generateStaticParams(): Array<{ country: string }> {
  return getBlogStaticPaths().countries.map((country) => ({ country }));
}

export function generateMetadata({
  params,
}: BlogCountryPageProps): Metadata {
  const country = getBlogCountry(params.country);

  if (!country) {
    return {
      title: "Country blog archive",
    };
  }

  const description = `Browse salary, tax, cost of living, and minimum wage articles for ${country.name}, all linked to the ${country.name} salary calculator.`;

  return {
    title: `${country.name} Salary and Tax Guides`,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/country/${country.slug}`,
    },
    openGraph: {
      title: `${country.name} Salary and Tax Guides | ${SITE_NAME}`,
      description,
      url: `${SITE_URL}/blog/country/${country.slug}`,
    },
  };
}

export default function BlogCountryPage({
  params,
}: BlogCountryPageProps): JSX.Element {
  const country = getBlogCountry(params.country);

  if (!country) {
    notFound();
  }

  const posts = getBlogPostsByCountry(country.slug);

  if (posts.length === 0) {
    notFound();
  }

  const structuredData = [
    buildBreadcrumbSchema([
      { name: "Home", url: absoluteUrl("/") },
      { name: "Blog", url: absoluteUrl("/blog") },
      { name: country.name, url: absoluteUrl(`/blog/country/${country.slug}`) },
    ]),
    buildBlogCollectionSchema(
      `${country.name} guides`,
      absoluteUrl(`/blog/country/${country.slug}`),
      `Salary, tax, cost of living, and minimum wage content for ${country.name}.`,
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
            { label: country.name },
          ]}
        />
        <div className="mt-5 flex items-center gap-4">
          <CountryFlag
            className="h-12 w-12 rounded-full border border-ink/10 object-cover"
            countryCode={country.slug.slice(0, 2).toUpperCase()}
            countryName={country.name}
            flagSrc={country.flagSrc}
            size={48}
          />
          <div>
            <p className="eyebrow">{country.region}</p>
            <h1 className="mt-3 font-[var(--font-display)] text-4xl font-bold tracking-tight sm:text-5xl">
              {country.name} salary and tax guides
            </h1>
          </div>
        </div>
        <p className="mt-4 text-base leading-8 text-ink/68">
          Browse all blog content for {country.name}, including cost of living,
          salary after tax, income tax, minimum wage, and city-level guides where
          available.
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
