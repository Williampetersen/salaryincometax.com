import { BLOG_POSTS } from "@/data/blog/blogPosts";

interface DuplicateEntry {
  text: string;
  locations: string[];
}

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function collectDuplicates(
  items: Array<{ text: string; location: string }>,
  minimumLength = 60,
): DuplicateEntry[] {
  const buckets = new Map<string, string[]>();

  for (const item of items) {
    const normalized = normalize(item.text);

    if (normalized.length < minimumLength) {
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

const paragraphDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.sections.flatMap((section, sectionIndex) =>
      section.paragraphs.map((paragraph, paragraphIndex) => ({
        text: paragraph,
        location: `${post.slug} -> section:${sectionIndex + 1} paragraph:${paragraphIndex + 1}`,
      })),
    ),
  ),
);

const faqDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.faqItems.map((item, index) => ({
      text: item.answer,
      location: `${post.slug} -> faq:${index + 1}`,
    })),
  ),
);

const metaDescriptionDuplicates = collectDuplicates(
  BLOG_POSTS.map((post) => ({
    text: post.metaDescription,
    location: `${post.slug} -> metaDescription`,
  })),
  20,
);

const quickAnswerDuplicates = collectDuplicates(
  BLOG_POSTS.flatMap((post) =>
    post.quickAnswers.map((item, index) => ({
      text: item.answer,
      location: `${post.slug} -> quickAnswer:${index + 1}`,
    })),
  ),
);

const baselinePosts = BLOG_POSTS.filter((post) => post.researchStatus === "baseline").map(
  (post) => post.slug,
);

const report = {
  totalPosts: BLOG_POSTS.length,
  duplicateParagraphCount: paragraphDuplicates.length,
  duplicateFaqAnswerCount: faqDuplicates.length,
  duplicateQuickAnswerCount: quickAnswerDuplicates.length,
  duplicateMetaDescriptionCount: metaDescriptionDuplicates.length,
  baselinePostCount: baselinePosts.length,
  paragraphDuplicates,
  faqDuplicates,
  quickAnswerDuplicates,
  metaDescriptionDuplicates,
  baselinePosts,
};

console.log(JSON.stringify(report, null, 2));
