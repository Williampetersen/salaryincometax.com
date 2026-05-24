# Content Style Guide

This document defines the writing rules for all future blog content on
`salaryincometax.com`.

## Originality Rules

- Never copy text from salaryaftertax.com, competitor calculators, blogs, or
  government summaries.
- Never lightly paraphrase another publisher's paragraph structure.
- Rewrite every explanation in fresh wording that matches the exact article
  context.
- If a sentence could fit unchanged into multiple articles, rewrite it until it
  becomes market-specific.
- Avoid repeated FAQ answers across countries. Use the article subject, country,
  or city directly in the answer.

## Source Rules

- Use official or public sources for factual numbers, tax rules, minimum wage,
  salary benchmarks, and cost-of-living references.
- Source notes are for facts and figures only, not for copied explanations.
- If a number is estimated or benchmark-based, say so clearly in the article.
- Do not invent statistics, city rankings, or tax outcomes.

## Writing Rules

- Write in clear, simple English.
- Prefer answer-first paragraphs that help real readers quickly.
- Keep the tone practical and independent, not promotional.
- Avoid robotic filler, empty transitions, and keyword stuffing.
- Use examples that explain how a person would actually use the number or rule.
- Add internal links to the relevant salary calculator and related blog guides.
- Include the article disclaimer where relevant:
  `This content is for general information only and is not tax, legal, financial, or accounting advice.`

## Structure Rules

Each article should include:

- One H1 only.
- A unique SEO title.
- A unique meta description.
- A summary box.
- A `Who this guide is for` section.
- A `Quick answers` section.
- A quick facts table.
- Main H2 sections that match the search intent.
- A practical example.
- FAQ content and FAQ schema where relevant.
- A final verdict.
- Internal links to calculators and related posts.

## SEO Rules

- Keep titles, descriptions, and intros unique across articles.
- Use natural keyword placement instead of repeating the same phrase.
- Keep canonical URLs, Open Graph data, breadcrumb schema, and article schema in
  place.
- Do not publish visible placeholder text, TODO text, or unfinished notes.
- Re-run the blog originality audit before publishing major content changes.

## Review Workflow

1. Update or verify the structured data source in `data/blog/`.
2. Rewrite article copy in `data/blog/blogPosts.ts` and supporting source files.
3. Run `corepack pnpm audit:blog`.
4. Run `corepack pnpm check:blog-originality`.
5. Run `corepack pnpm lint`.
6. Run `corepack pnpm typecheck`.
7. Run `corepack pnpm build`.
