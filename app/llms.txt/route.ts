import {
  getFeaturedBlogPosts,
  getBlogCategories,
} from "@/lib/blog";
import { getAllCountries } from "@/lib/country-catalog";
import { STATIC_SITE_PAGES } from "@/lib/navigation";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export async function GET(): Promise<Response> {
  const countries = getAllCountries();
  const categories = getBlogCategories();
  const featuredBlogPosts = getFeaturedBlogPosts(10);

  const body = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "This site provides country-specific salary after tax calculators with editable tax-year JSON rules.",
    "Use the country calculator pages for gross-to-net estimates, net-to-gross estimates, and tax breakdowns.",
    "Use the blog for answer-first guidance on salary after tax, income tax, cost of living, and minimum wage topics.",
    "",
    "## Primary pages",
    `- [Homepage](${SITE_URL})`,
    `- [All salary calculators](${SITE_URL}/salary-calculator)`,
    `- [Blog](${SITE_URL}/blog)`,
    "",
    "## Trust and policy pages",
    ...STATIC_SITE_PAGES.map((path) => `- [${path.slice(1)}](${SITE_URL}${path})`),
    "",
    "## Blog categories",
    ...categories.map(
      (category) =>
        `- [${category.name}](${SITE_URL}/blog/category/${category.slug})`,
    ),
    "",
    "## Featured blog articles",
    ...featuredBlogPosts.map(
      (post) => `- [${post.title}](${SITE_URL}/blog/${post.slug})`,
    ),
    "",
    "## Country calculators",
    ...countries.map(
      (country) =>
        `- [${country.name} salary calculator](${SITE_URL}/salary-calculator/${country.slug})`,
    ),
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
