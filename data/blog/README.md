# Blog Data Guide

The blog system is generated from structured TypeScript data so country pages,
category pages, archive pages, metadata, schema, and sitemaps stay aligned.

## Files

- `countries.ts`
  Defines the supported blog countries, category labels, and city coverage.
- `salaryData.ts`
  Derives average salary and minimum-wage baselines from the tax engine.
- `taxData.ts`
  Holds tax-specific editorial summaries and source lists.
- `costOfLivingData.ts`
  Holds country and city cost-of-living benchmarks, answer-first summaries, and
  editorial notes.
- `blogPosts.ts`
  Generates all blog post objects and article sections from the structured data.

## Updating a country

1. Refresh the tax-year JSON in `data/tax-rules/` if salary, tax, or minimum-wage
   assumptions changed.
2. Update the country entry in `costOfLivingData.ts` if you have stronger local
   rent, transport, childcare, or household budget data.
3. Update `taxData.ts` if the editorial explanation for the tax system changed.
4. Keep the `sources` array current with public or official references.
5. Run:
   - `corepack pnpm typecheck`
   - `corepack pnpm lint`
   - `corepack pnpm build`

## Detailed vs template articles

- Detailed articles are meant to be publish-ready for current SEO use.
- Template articles are intentionally visible in the UI, but they include update
  notices so they can be upgraded country by country without breaking routes.

## Blog images

- Upload blog images to `public/blog/`.
- The UI currently falls back to the site logo if a referenced blog image is not
  present yet.
