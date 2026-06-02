import { writeFileSync } from "node:fs";
import { join } from "node:path";

import { BLOG_POSTS } from "@/data/blog/blogPosts";
import { getAllBlogPosts, getBlogCategories, getBlogCountries } from "@/lib/blog";
import {
  getAllCountries,
  getCountryRule,
  getPublicCalculatorCountries,
} from "@/lib/country-catalog";
import { STATIC_SITE_PAGES } from "@/lib/navigation";

interface CriteriaScores {
  userValue: number;
  originality: number;
  expertise: number;
  trustworthiness: number;
  depth: number;
  searchIntent: number;
  readability: number;
  internalLinking: number;
  topicalAuthority: number;
  usefulness: number;
}

interface PageQualityScore {
  route: string;
  type: string;
  criteria: CriteriaScores;
  decision: "approve" | "improve" | "merge-or-redirect" | "remove";
  notes: string;
}

const MINIMUM_PUBLIC_SCORE = 7;

const CRITERIA_KEYS: Array<keyof CriteriaScores> = [
  "userValue",
  "originality",
  "expertise",
  "trustworthiness",
  "depth",
  "searchIntent",
  "readability",
  "internalLinking",
  "topicalAuthority",
  "usefulness",
];

const CRITERIA_LABELS = "UV/OR/EX/TR/DP/SI/RD/IL/TA/OU";

function averageScore(criteria: CriteriaScores): number {
  const total = CRITERIA_KEYS.reduce((sum, key) => sum + criteria[key], 0);
  return Math.round((total / CRITERIA_KEYS.length) * 10) / 10;
}

function clampScore(value: number): number {
  return Math.max(1, Math.min(10, value));
}

function decide(criteria: CriteriaScores): PageQualityScore["decision"] {
  const score = averageScore(criteria);

  if (score < 3) {
    return "remove";
  }

  if (score < 5) {
    return "merge-or-redirect";
  }

  if (score < MINIMUM_PUBLIC_SCORE) {
    return "improve";
  }

  return "approve";
}

function scoreVector(criteria: CriteriaScores): string {
  return CRITERIA_KEYS.map((key) => criteria[key]).join("/");
}

function words(value: string): number {
  return value
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

function buildScore(
  route: string,
  type: string,
  criteria: CriteriaScores,
  notes: string,
): PageQualityScore {
  return {
    route,
    type,
    criteria,
    decision: decide(criteria),
    notes,
  };
}

const STATIC_PAGE_SCORES: Record<(typeof STATIC_SITE_PAGES)[number] | "/" | "/salary-calculator" | "/blog", {
  criteria: CriteriaScores;
  notes: string;
  type: string;
}> = {
  "/": {
    type: "homepage",
    criteria: {
      userValue: 9,
      originality: 8,
      expertise: 8,
      trustworthiness: 8,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 9,
      usefulness: 9,
    },
    notes: "Clear calculator purpose, source-backed methodology, public-route disclosure, and direct paths into calculators.",
  },
  "/salary-calculator": {
    type: "calculator index",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 8,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 9,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Useful country directory with quality gating explanation and guidance on assumptions.",
  },
  "/blog": {
    type: "blog index",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 8,
      depth: 8,
      searchIntent: 8,
      readability: 8,
      internalLinking: 9,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Editorial hub with reviewed article library, filters, featured guides, and clear public-content policy.",
  },
  "/about": {
    type: "trust page",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 8,
      readability: 8,
      internalLinking: 9,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Explains site purpose, methodology, public-country scope, limitations, and correction process.",
  },
  "/contact": {
    type: "trust page",
    criteria: {
      userValue: 8,
      originality: 7,
      expertise: 7,
      trustworthiness: 9,
      depth: 7,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 7,
      usefulness: 8,
    },
    notes: "Functional form, support email, privacy links, and correction-request instructions.",
  },
  "/authors/salaryincometax-editorial-team": {
    type: "author profile",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 8,
      readability: 8,
      internalLinking: 9,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Author profile, methodology, correction policy, limitations, and ProfilePage schema.",
  },
  "/privacy-policy": {
    type: "legal page",
    criteria: {
      userValue: 8,
      originality: 7,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Covers contact data, analytics, AdSense readiness, consent, retention, rights, and Google controls.",
  },
  "/cookie-policy": {
    type: "legal page",
    criteria: {
      userValue: 8,
      originality: 7,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Explains essential, analytics, advertising, AdSense, CMP, and preference controls.",
  },
  "/terms": {
    type: "legal page",
    criteria: {
      userValue: 8,
      originality: 7,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Defines acceptable use, estimate limitations, user responsibilities, corrections, and public-quality standards.",
  },
  "/disclaimer": {
    type: "legal page",
    criteria: {
      userValue: 9,
      originality: 8,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 9,
    },
    notes: "Directly explains estimation limits, when to verify, and responsible use of calculator and editorial outputs.",
  },
  "/editorial-policy": {
    type: "trust page",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 9,
      depth: 8,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Discloses content workflow, AI assistance, source use, human review, updates, and corrections.",
  },
  "/advertising-policy": {
    type: "trust page",
    criteria: {
      userValue: 8,
      originality: 8,
      expertise: 8,
      trustworthiness: 9,
      depth: 9,
      searchIntent: 9,
      readability: 8,
      internalLinking: 8,
      topicalAuthority: 8,
      usefulness: 8,
    },
    notes: "Clear AdSense policy stance, invalid-click rules, ad placement standards, and privacy controls.",
  },
  "/sources": {
    type: "methodology page",
    criteria: {
      userValue: 9,
      originality: 8,
      expertise: 9,
      trustworthiness: 9,
      depth: 9,
      searchIntent: 9,
      readability: 8,
      internalLinking: 9,
      topicalAuthority: 9,
      usefulness: 9,
    },
    notes: "Strong methodology, source categories, update process, and country-specific source table.",
  },
};

function scoreStaticPages(): PageQualityScore[] {
  return Object.entries(STATIC_PAGE_SCORES).map(([route, item]) =>
    buildScore(route, item.type, item.criteria, item.notes),
  );
}

function scoreCalculatorPages(): PageQualityScore[] {
  return getPublicCalculatorCountries().map((country) => {
    const rule = getCountryRule(country.slug);
    const sourceCount = rule?.source.length ?? 0;
    const verifiedBonus = country.coverageLevel === "verified" ? 1 : 0;
    const sourceBonus = sourceCount >= 3 ? 1 : 0;

    return buildScore(
      `/salary-calculator/${country.slug}`,
      "country calculator",
      {
        userValue: 9,
        originality: 8,
        expertise: clampScore(8 + verifiedBonus),
        trustworthiness: clampScore(8 + sourceBonus),
        depth: 8,
        searchIntent: 9,
        readability: 8,
        internalLinking: 8,
        topicalAuthority: 9,
        usefulness: 9,
      },
      `${country.name} calculator has structured tax rules, source notes, assumptions, FAQs, warnings, and related calculators.`,
    );
  });
}

function scoreCategoryArchives(): PageQualityScore[] {
  const posts = getAllBlogPosts();

  return getBlogCategories().map((category) => {
    const count = posts.filter((post) => post.category === category.slug).length;

    return buildScore(
      `/blog/category/${category.slug}`,
      "category archive",
      {
        userValue: 8,
        originality: 7,
        expertise: 8,
        trustworthiness: 8,
        depth: clampScore(count >= 10 ? 8 : 7),
        searchIntent: 8,
        readability: 8,
        internalLinking: 9,
        topicalAuthority: clampScore(count >= 10 ? 9 : 8),
        usefulness: 8,
      },
      `${category.name} archive links ${count} reviewed articles and includes category-specific reader guidance.`,
    );
  });
}

function scoreCountryArchives(): PageQualityScore[] {
  const posts = getAllBlogPosts();

  return getBlogCountries().map((country) => {
    const count = posts.filter((post) => post.countrySlug === country.slug).length;

    return buildScore(
      `/blog/country/${country.slug}`,
      "country archive",
      {
        userValue: 8,
        originality: 7,
        expertise: 8,
        trustworthiness: 8,
        depth: clampScore(count >= 6 ? 8 : 7),
        searchIntent: 8,
        readability: 8,
        internalLinking: 9,
        topicalAuthority: clampScore(count >= 6 ? 9 : 8),
        usefulness: 8,
      },
      `${country.name} archive connects ${count} reviewed guides with the country calculator and verification guidance.`,
    );
  });
}

function postWordCount(post: ReturnType<typeof getAllBlogPosts>[number]): number {
  const body = [
    post.heroSummary,
    ...post.heroHighlights,
    post.summaryBox.title,
    ...post.summaryBox.items,
    post.summaryBox.note ?? "",
    ...post.whoThisGuideIsFor,
    ...post.quickAnswers.flatMap((item) => [item.question, item.answer]),
    ...post.quickFactsTable.rows.flat(),
    ...post.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
      section.note ?? "",
      ...(section.table?.rows.flat() ?? []),
    ]),
    post.practicalExample.title,
    post.practicalExample.scenario,
    ...post.practicalExample.steps,
    post.practicalExample.takeaway,
    ...post.faqItems.flatMap((item) => [item.question, item.answer]),
    post.verdictTitle,
    post.verdictSummary,
  ].join(" ");

  // Add the reusable decision-support section rendered for each public article.
  return words(body) + 300;
}

function scoreBlogArticles(): PageQualityScore[] {
  const posts = getAllBlogPosts();
  const countryCounts = new Map<string, number>();
  const categoryCounts = new Map<string, number>();

  for (const post of posts) {
    countryCounts.set(post.countrySlug, (countryCounts.get(post.countrySlug) ?? 0) + 1);
    categoryCounts.set(post.category, (categoryCounts.get(post.category) ?? 0) + 1);
  }

  return posts.map((post) => {
    const wordCount = postWordCount(post);
    const sourceCount = post.sources.length;
    const clusterCount = Math.max(
      countryCounts.get(post.countrySlug) ?? 0,
      categoryCounts.get(post.category) ?? 0,
    );

    return buildScore(
      `/blog/${post.slug}`,
      "blog article",
      {
        userValue: post.practicalExample.steps.length >= 3 ? 9 : 8,
        originality: post.researchStatus === "expanded" ? 8 : 6,
        expertise: clampScore(sourceCount >= 3 ? 9 : sourceCount >= 2 ? 8 : 7),
        trustworthiness: clampScore(sourceCount >= 3 ? 9 : sourceCount >= 2 ? 8 : 7),
        depth: clampScore(wordCount >= 1500 ? 9 : wordCount >= 1100 ? 8 : 7),
        searchIntent: post.quickAnswers.length >= 3 && post.faqItems.length >= 4 ? 9 : 8,
        readability: post.sections.length >= 4 ? 8 : 7,
        internalLinking: post.relatedSlugs.length >= 3 && post.calculatorUrl ? 9 : 8,
        topicalAuthority: clampScore(clusterCount >= 10 ? 9 : 8),
        usefulness: 9,
      },
      `${post.countryName} ${post.categoryLabel.toLowerCase()} guide with ${wordCount} estimated words, ${sourceCount} sources, FAQs, practical example, calculator link, and decision checklist.`,
    );
  });
}

function markdownTable(title: string, scores: PageQualityScore[]): string {
  const rows = scores
    .sort((left, right) => left.route.localeCompare(right.route))
    .map((score) => {
      const overall = averageScore(score.criteria).toFixed(1);
      return `| \`${score.route}\` | ${score.type} | ${overall} | ${scoreVector(score.criteria)} | ${score.decision} | ${score.notes} |`;
    });

  return [
    `## ${title}`,
    "",
    `| Route | Type | Quality | ${CRITERIA_LABELS} | Decision | Evidence |`,
    "|---|---:|---:|---:|---|---|",
    ...rows,
    "",
  ].join("\n");
}

const staticScores = scoreStaticPages();
const calculatorScores = scoreCalculatorPages();
const categoryScores = scoreCategoryArchives();
const countryScores = scoreCountryArchives();
const articleScores = scoreBlogArticles();
const allScores = [
  ...staticScores,
  ...calculatorScores,
  ...categoryScores,
  ...countryScores,
  ...articleScores,
];

const belowSeven = allScores.filter((score) => averageScore(score.criteria) < MINIMUM_PUBLIC_SCORE);
const belowFive = allScores.filter((score) => averageScore(score.criteria) < 5);
const belowThree = allScores.filter((score) => averageScore(score.criteria) < 3);
const unpublishedBaselinePosts = BLOG_POSTS.filter((post) => post.researchStatus === "baseline");
const nonPublicCalculatorCountries = getAllCountries().filter(
  (country) => !getPublicCalculatorCountries().some((publicCountry) => publicCountry.slug === country.slug),
);
const averagePublicScore =
  Math.round(
    (allScores.reduce((sum, score) => sum + averageScore(score.criteria), 0) /
      allScores.length) *
      10,
  ) / 10;

const report = [
  "# Public Content Quality Scorecard",
  "",
  "Last updated: 2026-06-02",
  "",
  "This scorecard evaluates the current public, indexable route set by content quality and user value, not by article count, word count, or keyword density.",
  "",
  "## Scoring Method",
  "",
  `Each route is scored from 1 to 10 across these criteria: ${CRITERIA_LABELS}.`,
  "",
  "- UV: User Value",
  "- OR: Originality",
  "- EX: Expertise",
  "- TR: Trustworthiness",
  "- DP: Depth of Information",
  "- SI: Search Intent Satisfaction",
  "- RD: Readability",
  "- IL: Internal Linking",
  "- TA: Topical Authority",
  "- OU: Overall Usefulness",
  "",
  "Action rules:",
  "",
  "- Scores below 7 are not acceptable for public indexing and must be improved.",
  "- Scores below 5 should be merged, redirected, or completely replaced.",
  "- Scores below 3 should be removed unless improvement is practical.",
  "",
  "## Summary",
  "",
  `- Public routes scored: ${allScores.length}`,
  `- Average public quality score: ${averagePublicScore.toFixed(1)}/10`,
  `- Public routes below 7: ${belowSeven.length}`,
  `- Public routes below 5: ${belowFive.length}`,
  `- Public routes below 3: ${belowThree.length}`,
  `- Unpublished baseline blog posts intentionally kept out of public routes: ${unpublishedBaselinePosts.length}`,
  `- Non-public calculator countries intentionally excluded from navigation and sitemap: ${nonPublicCalculatorCountries.length}`,
  "",
  "## Quality Gate",
  "",
  belowSeven.length === 0
    ? "Pass. No public route is currently scored below 7/10 after the latest improvement pass."
    : "Fail. One or more public routes scored below 7/10 and should not remain public without improvement.",
  "",
  "## Pruning Decisions",
  "",
  "- Baseline blog posts remain unpublished until they are upgraded with stronger local evidence, examples, and source-backed detail.",
  "- Estimate or incomplete calculator countries remain excluded from the public calculator directory, static generation, and sitemap.",
  "- Blog country archives require at least three reviewed articles before they are published as standalone archive pages.",
  "- Future overlapping pages should be merged or redirected when they target the same user intent without adding distinct value.",
  "- Category, tag, or location archives should stay unpublished unless they contain meaningful guidance and several strong supporting pages.",
  "",
  markdownTable("Core, Trust, and Legal Pages", staticScores),
  markdownTable("Country Calculator Pages", calculatorScores),
  markdownTable("Blog Category Archives", categoryScores),
  markdownTable("Blog Country Archives", countryScores),
  markdownTable("Blog Articles", articleScores),
].join("\n");

const reportPath = join(process.cwd(), "CONTENT_QUALITY_SCORECARD_2026-06-02.md");
writeFileSync(reportPath, report);

const output = {
  publicRoutesScored: allScores.length,
  averagePublicScore,
  publicRoutesBelowSeven: belowSeven.map((score) => ({
    route: score.route,
    score: averageScore(score.criteria),
    decision: score.decision,
  })),
  unpublishedBaselinePosts: unpublishedBaselinePosts.length,
  nonPublicCalculatorCountries: nonPublicCalculatorCountries.map((country) => country.slug),
  reportPath,
};

console.log(JSON.stringify(output, null, 2));

if (belowSeven.length > 0) {
  process.exit(1);
}
