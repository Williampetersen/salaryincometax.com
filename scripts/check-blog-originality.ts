import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

import { BLOG_POSTS } from "@/data/blog/blogPosts";

interface DuplicateEntry {
  text: string;
  locations: string[];
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function countWords(value: string): number {
  return normalize(value).split(" ").filter(Boolean).length;
}

function collectDuplicates(
  items: Array<{ text: string; location: string }>,
  minimumWords: number,
): DuplicateEntry[] {
  const buckets = new Map<string, string[]>();

  for (const item of items) {
    const normalized = normalize(item.text);

    if (!normalized || countWords(normalized) < minimumWords) {
      continue;
    }

    const locations = buckets.get(normalized) ?? [];
    locations.push(item.location);
    buckets.set(normalized, locations);
  }

  return [...buckets.entries()]
    .filter(([, locations]) => locations.length > 1)
    .map(([text, locations]) => ({ text, locations }))
    .sort((left, right) => right.locations.length - left.locations.length);
}

function walkFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }

  const entries = readdirSync(root, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(root, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!/\.(json|ts|tsx|md|mdx)$/i.test(entry.name)) {
      continue;
    }

    files.push(fullPath);
  }

  return files;
}

const cwd = process.cwd();
const configuredRoots = [
  "app/blog",
  "data/blog",
  "content/blog",
  "posts",
  "mdx",
  "src/data/blog",
  "src/content/blog",
];

const checkedFiles = configuredRoots.flatMap((root) => walkFiles(join(cwd, root))).map((file) =>
  relative(cwd, file).split(sep).join("/"),
);

const paragraphDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.sections.flatMap((section, sectionIndex) =>
      section.paragraphs.map((paragraph, paragraphIndex) => ({
        text: paragraph,
        location: `${post.slug} -> section:${sectionIndex + 1} paragraph:${paragraphIndex + 1}`,
      })),
    ),
  ),
  12,
);

const faqDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.faqItems.map((item, index) => ({
      text: item.answer,
      location: `${post.slug} -> faq:${index + 1}`,
    })),
  ),
  12,
);

const quickAnswerDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.quickAnswers.map((item, index) => ({
      text: item.answer,
      location: `${post.slug} -> quickAnswer:${index + 1}`,
    })),
  ),
  12,
);

const metaDescriptionDuplicates = collectDuplicates(
  BLOG_POSTS.map((post) => ({
    text: post.metaDescription,
    location: `${post.slug} -> metaDescription`,
  })),
  5,
);

const titleDuplicates = collectDuplicates(
  BLOG_POSTS.map((post) => ({
    text: post.title,
    location: `${post.slug} -> title`,
  })),
  2,
);

const hasDuplicates =
  paragraphDuplicates.length > 0 ||
  faqDuplicates.length > 0 ||
  quickAnswerDuplicates.length > 0 ||
  metaDescriptionDuplicates.length > 0 ||
  titleDuplicates.length > 0;

console.log("Blog originality report");
console.log(`Checked source files: ${checkedFiles.length}`);
for (const file of checkedFiles) {
  console.log(`- ${file}`);
}
console.log(`Generated articles checked: ${BLOG_POSTS.length}`);
console.log(`Duplicate paragraphs (>12 words): ${paragraphDuplicates.length}`);
console.log(`Duplicate FAQ answers (>12 words): ${faqDuplicates.length}`);
console.log(`Duplicate quick answers (>12 words): ${quickAnswerDuplicates.length}`);
console.log(`Duplicate meta descriptions: ${metaDescriptionDuplicates.length}`);
console.log(`Duplicate titles: ${titleDuplicates.length}`);

if (hasDuplicates) {
  console.log("");
  console.log("Duplicates found:");

  for (const [label, entries] of [
    ["paragraph", paragraphDuplicates],
    ["faq", faqDuplicates],
    ["quick", quickAnswerDuplicates],
    ["meta", metaDescriptionDuplicates],
    ["title", titleDuplicates],
  ] as Array<[string, DuplicateEntry[]]>) {
    for (const entry of entries) {
      console.log(`[${label}] ${entry.locations.join(" | ")}`);
      console.log(`  ${entry.text}`);
    }
  }

  process.exit(1);
}

console.log("No repeated blog paragraphs, FAQ answers, quick answers, titles, or meta descriptions were found.");
