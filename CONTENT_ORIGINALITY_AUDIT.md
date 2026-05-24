# Content Originality Audit

Last updated: 2026-05-24

## Scope

The current blog system is generated from structured data. There are no
`content/blog`, `posts`, or `mdx` article directories in this project at the
moment. The published article text now comes from:

- `data/blog/blogPosts.ts`
- `data/blog/taxData.ts`
- `data/blog/costOfLivingData.ts`
- `app/blog/[slug]/page.tsx`

Supporting render and audit files updated in the same rewrite:

- `data/blog/types.ts`
- `components/blog/blog-card.tsx`
- `app/sitemap.ts`
- `data/blog/README.md`
- `scripts/audit-blog-content.ts`

## What Was Rewritten

- Rewrote generated blog titles, meta titles, meta descriptions, excerpts,
  introductions, section copy, FAQ answers, and verdict copy in
  `data/blog/blogPosts.ts`.
- Added original `Summary`, `Who this guide is for`, and `Practical example`
  content blocks to every generated article.
- Reworked tax narrative defaults and overrides in `data/blog/taxData.ts`.
- Reworked cost-of-living benchmark copy so identical helper paragraphs are not
  reused across countries or cities.
- Removed visible template labels and user-facing placeholder language from the
  blog UI.
- Added a code-level originality audit script to catch repeated paragraphs,
  repeated FAQ answers, repeated quick-answer text, and duplicate meta
  descriptions.

## Audit Result

`corepack pnpm audit:blog` currently reports:

- Exact duplicate paragraphs across generated posts: `0`
- Exact duplicate FAQ answers: `0`
- Exact duplicate quick-answer text: `0`
- Duplicate meta descriptions: `0`

This confirms that copied-looking or repeated article blocks were removed from
the generated post set.

## Confirmation

- Copied or overly similar blog copy was removed from the structured generators.
- Visible TODO text and template labels were removed from public blog pages.
- Duplicate paragraphs were checked with an automated audit script before final
  verification.
- The standard disclaimer is now rendered consistently on article pages:
  `This article is for general information only and does not provide tax, legal, financial, or accounting advice.`

## Articles Still Needing Official Data Verification

These articles are structurally complete and original, but they still use
baseline editorial coverage and should be refreshed with stronger local or
official data before being treated as the strongest research tier.

- `average-salary-in-belgium-after-tax`
- `average-salary-in-france-after-tax`
- `average-salary-in-ireland-after-tax`
- `average-salary-in-italy-after-tax`
- `average-salary-in-luxembourg-after-tax`
- `average-salary-in-malta-after-tax`
- `average-salary-in-netherlands-after-tax`
- `average-salary-in-new-zealand-after-tax`
- `average-salary-in-norway-after-tax`
- `average-salary-in-spain-after-tax`
- `average-salary-in-sweden-after-tax`
- `best-cities-to-live-in-belgium-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-denmark-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-italy-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-luxembourg-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-malta-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-new-zealand-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-norway-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-singapore-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-sweden-based-on-salary-and-cost-of-living`
- `cost-of-living-in-belgium`
- `cost-of-living-in-france`
- `cost-of-living-in-ireland`
- `cost-of-living-in-italy`
- `cost-of-living-in-luxembourg`
- `cost-of-living-in-malta`
- `cost-of-living-in-netherlands`
- `cost-of-living-in-new-zealand`
- `cost-of-living-in-norway`
- `cost-of-living-in-spain`
- `cost-of-living-in-sweden`
- `gross-vs-net-salary-in-australia`
- `gross-vs-net-salary-in-belgium`
- `gross-vs-net-salary-in-canada`
- `gross-vs-net-salary-in-denmark`
- `gross-vs-net-salary-in-france`
- `gross-vs-net-salary-in-germany`
- `gross-vs-net-salary-in-ireland`
- `gross-vs-net-salary-in-italy`
- `gross-vs-net-salary-in-japan`
- `gross-vs-net-salary-in-luxembourg`
- `gross-vs-net-salary-in-malta`
- `gross-vs-net-salary-in-netherlands`
- `gross-vs-net-salary-in-new-zealand`
- `gross-vs-net-salary-in-norway`
- `gross-vs-net-salary-in-singapore`
- `gross-vs-net-salary-in-spain`
- `gross-vs-net-salary-in-sweden`
- `gross-vs-net-salary-in-united-kingdom`
- `gross-vs-net-salary-in-united-states`
- `income-tax-in-australia`
- `income-tax-in-belgium`
- `income-tax-in-canada`
- `income-tax-in-france`
- `income-tax-in-ireland`
- `income-tax-in-italy`
- `income-tax-in-japan`
- `income-tax-in-luxembourg`
- `income-tax-in-malta`
- `income-tax-in-netherlands`
- `income-tax-in-new-zealand`
- `income-tax-in-norway`
- `income-tax-in-singapore`
- `income-tax-in-spain`
- `income-tax-in-sweden`
- `income-tax-in-united-states`
- `is-belgium-expensive-to-live-in`
- `is-france-expensive-to-live-in`
- `is-ireland-expensive-to-live-in`
- `is-italy-expensive-to-live-in`
- `is-luxembourg-expensive-to-live-in`
- `is-malta-expensive-to-live-in`
- `is-netherlands-expensive-to-live-in`
- `is-new-zealand-expensive-to-live-in`
- `is-norway-expensive-to-live-in`
- `is-spain-expensive-to-live-in`
- `is-sweden-expensive-to-live-in`
- `minimum-wage-in-australia`
- `minimum-wage-in-belgium`
- `minimum-wage-in-denmark`
- `minimum-wage-in-france`
- `minimum-wage-in-germany`
- `minimum-wage-in-italy`
- `minimum-wage-in-japan`
- `minimum-wage-in-luxembourg`
- `minimum-wage-in-malta`
- `minimum-wage-in-netherlands`
- `minimum-wage-in-new-zealand`
- `minimum-wage-in-norway`
- `minimum-wage-in-singapore`
- `minimum-wage-in-spain`
- `minimum-wage-in-sweden`
- `minimum-wage-in-united-kingdom`
- `minimum-wage-in-united-states`

## Articles Ready For AdSense Review

These articles are in the stronger `expanded` research tier and are ready for
AdSense-quality review from a content-structure and originality standpoint.

- `average-salary-in-australia-after-tax`
- `average-salary-in-canada-after-tax`
- `average-salary-in-denmark-after-tax`
- `average-salary-in-germany-after-tax`
- `average-salary-in-japan-after-tax`
- `average-salary-in-singapore-after-tax`
- `average-salary-in-united-kingdom-after-tax`
- `average-salary-in-united-states-after-tax`
- `best-cities-to-live-in-australia-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-canada-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-france-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-germany-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-ireland-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-japan-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-netherlands-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-spain-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-united-kingdom-based-on-salary-and-cost-of-living`
- `best-cities-to-live-in-united-states-based-on-salary-and-cost-of-living`
- `cost-of-living-in-amsterdam`
- `cost-of-living-in-australia`
- `cost-of-living-in-barcelona`
- `cost-of-living-in-berlin`
- `cost-of-living-in-birmingham`
- `cost-of-living-in-canada`
- `cost-of-living-in-chicago`
- `cost-of-living-in-cork`
- `cost-of-living-in-denmark`
- `cost-of-living-in-dublin`
- `cost-of-living-in-germany`
- `cost-of-living-in-hamburg`
- `cost-of-living-in-japan`
- `cost-of-living-in-london`
- `cost-of-living-in-los-angeles`
- `cost-of-living-in-lyon`
- `cost-of-living-in-madrid`
- `cost-of-living-in-manchester`
- `cost-of-living-in-melbourne`
- `cost-of-living-in-miami`
- `cost-of-living-in-montreal`
- `cost-of-living-in-munich`
- `cost-of-living-in-new-york`
- `cost-of-living-in-osaka`
- `cost-of-living-in-paris`
- `cost-of-living-in-rotterdam`
- `cost-of-living-in-san-francisco`
- `cost-of-living-in-singapore`
- `cost-of-living-in-sydney`
- `cost-of-living-in-tokyo`
- `cost-of-living-in-toronto`
- `cost-of-living-in-united-kingdom`
- `cost-of-living-in-united-states`
- `cost-of-living-in-vancouver`
- `income-tax-in-denmark`
- `income-tax-in-germany`
- `income-tax-in-united-kingdom`
- `is-australia-expensive-to-live-in`
- `is-canada-expensive-to-live-in`
- `is-denmark-expensive-to-live-in`
- `is-germany-expensive-to-live-in`
- `is-japan-expensive-to-live-in`
- `is-singapore-expensive-to-live-in`
- `is-united-kingdom-expensive-to-live-in`
- `is-united-states-expensive-to-live-in`
- `minimum-wage-in-canada`
- `minimum-wage-in-ireland`
