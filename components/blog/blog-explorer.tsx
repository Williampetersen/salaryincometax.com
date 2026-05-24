"use client";

import { useDeferredValue, useState } from "react";

import { BlogCard } from "@/components/blog/blog-card";
import type {
  BlogCategoryDefinition,
  BlogCountryDefinition,
  BlogPost,
} from "@/data/blog/types";

interface BlogExplorerProps {
  categories: BlogCategoryDefinition[];
  countries: BlogCountryDefinition[];
  posts: BlogPost[];
}

export function BlogExplorer({
  categories,
  countries,
  posts,
}: BlogExplorerProps): JSX.Element {
  const [query, setQuery] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const filteredPosts = posts.filter((post) => {
    const matchesCountry =
      countryFilter === "all" || post.countrySlug === countryFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;
    const searchableText = [
      post.title,
      post.excerpt,
      post.keyword,
      post.countryName,
      post.cityName ?? "",
      post.categoryLabel,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery =
      deferredQuery.length === 0 || searchableText.includes(deferredQuery);

    return matchesCountry && matchesCategory && matchesQuery;
  });

  return (
    <div className="space-y-6">
      <div className="panel p-5 sm:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(12rem,0.8fr)_minmax(12rem,0.8fr)]">
          <div>
            <label className="field-label" htmlFor="blog-search">
              Search articles
            </label>
            <input
              className="form-control"
              id="blog-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search salary, tax, cost of living, or country"
              type="search"
              value={query}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="country-filter">
              Country
            </label>
            <select
              className="form-control"
              id="country-filter"
              onChange={(event) => setCountryFilter(event.target.value)}
              value={countryFilter}
            >
              <option value="all">All countries</option>
              {countries.map((country) => (
                <option key={country.slug} value={country.slug}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="category-filter">
              Category
            </label>
            <select
              className="form-control"
              id="category-filter"
              onChange={(event) => setCategoryFilter(event.target.value)}
              value={categoryFilter}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/60">
          <p>
            Showing <span className="font-semibold text-ink">{filteredPosts.length}</span>{" "}
            articles
          </p>
          {(query || countryFilter !== "all" || categoryFilter !== "all") ? (
            <button
              className="rounded-full border border-ink/10 bg-white px-4 py-2 font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
              onClick={() => {
                setQuery("");
                setCountryFilter("all");
                setCategoryFilter("all");
              }}
              type="button"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {filteredPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
