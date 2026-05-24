import { getAllBlogPosts, getBlogStaticPaths } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

function buildUrlNode(url: string, lastModified: string): string {
  return [
    "<url>",
    `<loc>${url}</loc>`,
    `<lastmod>${lastModified}</lastmod>`,
    "</url>",
  ].join("");
}

export async function GET(): Promise<Response> {
  const paths = getBlogStaticPaths();
  const posts = getAllBlogPosts();
  const now = new Date().toISOString();

  const urlSet = [
    buildUrlNode(`${SITE_URL}/blog`, now),
    ...paths.categories.map((category) =>
      buildUrlNode(`${SITE_URL}/blog/category/${category}`, now),
    ),
    ...paths.countries.map((country) =>
      buildUrlNode(`${SITE_URL}/blog/country/${country}`, now),
    ),
    ...posts.map((post) =>
      buildUrlNode(`${SITE_URL}/blog/${post.slug}`, new Date(post.updatedAt).toISOString()),
    ),
  ].join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlSet,
    "</urlset>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
