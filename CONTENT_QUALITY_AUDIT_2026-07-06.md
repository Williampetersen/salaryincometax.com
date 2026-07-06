# Content Quality Audit and Improvement Report

Last updated: 2026-07-06

This report documents the AdSense resubmission pass for `salaryincometax.com`
after a rejection citing "Low value content" / "Your site isn't ready to show
ads." It supersedes the route counts and public article list in
`CONTENT_QUALITY_AUDIT_2026-06-02.md`, `CONTENT_QUALITY_SCORECARD_2026-06-02.md`,
and `CONTENT_ORIGINALITY_AUDIT.md` for anything related to blog publish scope.
Those documents remain useful for their originality methodology and per-article
research notes, but their public/unpublished article lists are now out of
date - this document is the current source of truth for blog publish scope.

## Diagnosis

The 2026-06-02 pass verified that generated articles had zero duplicate
paragraphs, FAQ answers, or meta descriptions, and pruned the public set from
159 generated posts down to roughly 90. That pass treated "no duplicate text"
as the bar for AdSense readiness.

On inspection, the real risk was different: the public blog was built from
six template functions (`income-tax-in-{country}`,
`minimum-wage-in-{country}`, `average-salary-in-{country}-after-tax`,
`gross-vs-net-salary-in-{country}`, `is-{country}-expensive-to-live-in`,
`best-cities-to-live-in-{country}...`) plus a per-city cost-of-living template,
mechanically looped over every supported country and city. Even at ~90
public articles with unique sentences, every article of a given type shared
an identical section skeleton (hero summary, key takeaways, who this guide is
for, quick answers, quick facts table, practical example, FAQ, verdict), and
the per-city cost-of-living template was unconditionally published for every
city regardless of research depth. This structural sameness at scale is a
direct match for Google's "scaled content abuse" spam policy
(https://support.google.com/publisherpolicies/answer/11035931), which is a
distinct and more serious problem than thin content or duplicate text, and is
not caught by a duplicate-text checker.

## Action Taken: Flagship Allowlist

The public blog is now limited to a flagship allowlist of 14 articles across
7 countries (2 templates per country, chosen for both source strength and
template diversity), with all per-city pages and "best cities" pages
unpublished for this pass:

| Country | Templates kept public |
|---|---|
| United States | Income tax, Cost of living |
| United Kingdom | Income tax, Cost of living |
| Germany | Cost of living, Average salary |
| Denmark | Income tax, Cost of living |
| Canada | Average salary, Minimum wage |
| Australia | Average salary, Is it expensive |
| Ireland | Income tax, Minimum wage |

Unpublished for this pass (kept in the codebase, not deleted, so they can be
re-expanded deliberately later):

- All per-city cost-of-living articles (`cost-of-living-in-{city}`), roughly
  32 pages.
- All "best cities to live in {country}" articles.
- `gross-vs-net-salary-in-{country}` articles (already baseline-only before
  this pass).
- Income tax, minimum wage, average salary, and cost-of-living articles for
  every country outside the flagship list above.

### Files changed

- `data/blog/blogPosts.ts`
  - Split the single `DETAILED_COST_COUNTRIES` set (which previously gated
    three unrelated templates at once - country cost of living, average
    salary, and "is it expensive" - for the same country) into three
    independent sets: `DETAILED_COUNTRY_COST_COUNTRIES`,
    `DETAILED_AVERAGE_SALARY_COUNTRIES`, `DETAILED_IS_EXPENSIVE_COUNTRIES`.
    This was necessary because the flagship picks above deliberately mix
    templates per country (for example Germany keeps cost-of-living and
    average-salary, but not "is it expensive"), which the old shared set
    could not express.
  - Narrowed `DETAILED_TAX_COUNTRIES` to the four flagship income-tax
    countries.
  - Left `DETAILED_MINIMUM_WAGE_COUNTRIES` unchanged (already exactly
    Canada and Ireland).
  - Changed the per-city cost-of-living generator (`buildCityCostPost`) from
    an unconditional `"expanded"` status to `"baseline"`, unpublishing every
    city page.
  - Changed the "best cities" generator (`buildBestCitiesPost`) from a
    data-availability gate (`cityEntries.length > 0`, effectively always
    true) to `buildResearchStatus(false)`, unpublishing every country's
    "best cities" article.
- `lib/blog.ts`
  - Rewrote `FEATURED_BLOG_SLUGS` to the 14 flagship slugs, ordered so the
    first six already span six of the seven flagship countries.
  - Added `getBlogCountriesWithPosts()`, a lighter country list (any
    published post, no minimum) used only for the blog index country filter
    dropdown, so the filter stays useful even though no single country has
    enough posts for a dedicated `/blog/country/[country]` archive page yet.
- `app/blog/page.tsx`
  - Switched the country-filter data source from `getBlogCountries()` (3+
    posts required) to `getBlogCountriesWithPosts()` (any published post).

### Effect on generated routes

- Public blog articles: 14 (down from ~90).
- Blog category archives: 4 unchanged (`income-tax`, `cost-of-living`,
  `minimum-wage`, `salary-guides`), each still has at least 2 published
  articles.
- Blog country archives (`/blog/country/[country]`): 0. Every flagship
  country now has exactly 2 published posts, below the existing
  `MINIMUM_COUNTRY_ARCHIVE_POSTS = 3` gate in `lib/blog.ts`. These pages stop
  being statically generated (the route uses `dynamicParams = false`) and
  return a real 404 rather than a thin or duplicate-content page.
- Sitemap (`app/sitemap.ts`) and `blog-sitemap.xml`
  (`app/blog-sitemap.xml/route.ts`) both derive their URLs from
  `getAllBlogPosts()` / `getBlogStaticPaths()`, so they automatically reflect
  the smaller set with no further changes needed.
- `getBlogPostBySlug()` already filtered through `getPublishedBlogPostSet()`
  before this pass, so newly unpublished slugs return `undefined` and the
  article page calls `notFound()` - visiting an unpublished slug directly
  returns a real 404, not a soft-hidden but still-crawlable page.

## New Original Content Added

Five hand-written, country-agnostic guide articles were added to the
`salary-guides` category to balance the country-specific flagship set with
evergreen educational content that is not part of any country/city template
loop:

- `/blog/gross-vs-net-salary-explained`
- `/blog/how-income-tax-works`
- `/blog/tax-deductions-explained`
- `/blog/monthly-vs-annual-salary`
- `/blog/how-to-use-a-salary-calculator`

See `data/blog/genericGuides.ts` for the source content and
`GENERIC_GUIDES.md` (this file's companion note in `data/blog/README.md`) for
how these differ structurally from the country-template system.

## Re-expansion Plan (after AdSense approval)

Do not re-expand the blog back to the prior ~90-article scale immediately
after approval. Re-expand deliberately:

1. Wait for Search Console to show the flagship set indexed cleanly with no
   manual actions or "low value content" style warnings.
2. Add a small number of additional countries (2-3 at a time) to one template
   set at a time, prioritizing countries with the strongest source data in
   `data/blog/taxData.ts` and `data/blog/costOfLivingData.ts`.
3. Before re-enabling per-city or "best cities" pages at scale, consider
   whether each city page can carry genuinely distinct, non-templated
   material (unique local commentary, an original chart, or a distinct
   analysis) rather than the same section skeleton with different numbers.
4. Re-run `npm run audit:blog`, `npm run check:blog-originality`, and
   `npm run audit:quality` after every expansion.

## Verification

Automated checks that should be run before resubmission (this pass could not
run them in the assistant's sandbox - no Node.js runtime was available):

- `npm run lint`
- `npm run typecheck`
- `npm run audit:blog`
- `npm run check:blog-originality`
- `npm run audit:quality`
- `npm run build`

Manual verification still needed:

- Confirm the production build generates exactly 14 blog article pages, 4
  category archive pages, and 0 country archive pages.
- Click through all 14 flagship articles and the 5 new guide articles in a
  local `npm run dev` session.
- Confirm `/blog/cost-of-living-in-paris` (or any other now-unpublished slug)
  returns a real 404, not a rendered page.
