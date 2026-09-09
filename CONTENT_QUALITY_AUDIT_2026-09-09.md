# Content Quality Audit and Improvement Report

Last updated: 2026-09-09

This report documents the third AdSense remediation pass for
`salaryincometax.com`, after a third rejection (2026-09-08) citing "Low
value content" / "Your site isn't ready to show ads." It supersedes nothing
about blog publish scope from `CONTENT_QUALITY_AUDIT_2026-07-06.md` - the
14-article flagship allowlist and 5 generic guides from that pass are
unchanged. This pass targets a different problem: the *shape* of the
published article set, not which articles are published.

## Diagnosis

Two prior passes (2026-07-06 and 2026-09-01) each de-templatized one layer
of the site - first the blog body text, then the calculator country pages -
and each was followed by a resubmission that was rejected for the same
reason. Fetching the live production site directly (not just reading the
source) showed why: even after both passes, an outside reader still
described the blog as "a templated set of near-duplicate articles," citing
the headline pattern itself - `[Metric] in [Country]: Complete Guide`,
mechanically interpolated per country in `blogPosts.ts` - as the most
visible tell. The internal `CONTENT_QUALITY_SCORECARD_2026-06-02.md` audit
had rated every one of these same articles 7.9-8.7/10 and reported a "Pass"
each time, which means that audit process does not detect the specific
signal an external reviewer (human or automated) reacts to: structural and
title-pattern repetition across the published set, as distinct from
duplicate sentences (already fixed in the 2026-07-06 pass) or per-page prose
quality (what the scorecard actually measures).

## Action Taken

1. **De-formularized the 14 flagship article titles.** `ARTICLE_TITLE_OVERRIDES`
   in `data/blog/blogPosts.ts` replaces the mechanical
   `${metric} in ${country.name}` title/metaTitle with a hand-written title
   per article naming the specific mechanism that makes that country's
   system different (Denmark's municipal tax and AM-bidrag, Ireland's PAYE
   credits, the UK's Scotland exclusion, US federal-only scope, and so on),
   applied centrally via `applyTitleOverride()` when `BLOG_POSTS` is built so
   no per-template call site needed editing individually.

2. **Added a genuinely distinct body paragraph to seven flagship articles**
   (the one published article per country that best matches each country's
   distinguishing tax mechanism: `income-tax-in-{denmark,ireland,united-kingdom,united-states}`,
   `cost-of-living-in-germany`, `minimum-wage-in-canada`,
   `average-salary-in-australia-after-tax`) via `BLOG_COUNTRY_SYSTEM_NOTES`
   and `buildCountrySystemSection()`. This is hand-written prose, not reused
   from `data/tax-rules/countryHighlights.ts` - the calculator pages
   (`/salary-calculator/[country]`, via `components/seo/country-seo-content.tsx`
   and `lib/country-catalog.ts`) already render that file's `systemFacts` and
   `watchOuts` arrays verbatim, so copying the same array text into the
   matching blog article would have created new page-to-page duplication
   between the calculator page and the blog article for the same country -
   trading one scaled-content problem for another. Each country's note is
   injected into exactly one published template (see the per-call-site
   `countrySlug === "..."` guards in `buildMinimumWagePost` and
   `buildAverageSalaryPost`) so the same paragraph never appears on two live
   pages.

3. **Replaced 2 of 4 FAQ items on the income-tax articles** with
   `BLOG_INCOME_TAX_FAQS`, hand-written questions distinct from the FAQ
   items already rendered on the matching calculator page (which come from
   `COUNTRY_HIGHLIGHTS.faqs`), for the same page-to-page duplication reason
   as above.

### Why the calculator pages were left alone this pass

`components/seo/country-seo-content.tsx` reuses the same section-heading
structure across all 9 countries ("How {country}'s system works in this
model", "What this model doesn't cover yet", and so on), which reads as
templated on inspection. This is normal for a calculator-suite page (compare
any per-state paycheck calculator on a finance site) and each section's
*content* is already genuinely country-specific via `COUNTRY_HIGHLIGHTS`
since the 2026-09-01 pass. Changing shared UI chrome text per country would
mean re-touching all 9 pages for a much smaller signal than the blog title
fix above; this was deprioritized in favor of the blog fix, which directly
matched what the external read flagged first.

## Verification

Ran and passing after this change:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm check:tax`
- `pnpm audit:blog` - 0 duplicate paragraphs, FAQ answers, quick answers, or
  meta descriptions across all 164 generated articles (down from 36 duplicate
  paragraphs when the new per-country notes were first added without the
  single-template guard described in action 2 above - see git history on
  this file's commit for the intermediate regression and fix).
- `pnpm check:blog-originality` - same, 0 duplicates.
- `pnpm audit:quality` - scorecard regenerated, no route below 7/10.
- `pnpm build` - production build succeeds, 19 blog article pages and 9
  calculator country pages generated as expected.
- Manually confirmed in the built output that `income-tax-in-denmark`
  renders the new title as its `<h1>`, the new AM-bidrag paragraph, and the
  new FAQ question.

## Before the next resubmission

Three rejections in roughly ten weeks, each following a code-level fix
submitted almost immediately afterward, is itself a pattern worth being
honest about. Google generally expects real time and real traffic between a
content change and a resubmission, not a same-week fix-and-resubmit cycle.
Consider before resubmitting a fourth time:

- Let Search Console index the current article set for at least a few weeks
  and confirm no "low value content" or manual-action warnings appear there
  independent of the AdSense review itself.
- If a fourth rejection cites the same reason again, the root cause is
  probably no longer page-level template structure (three passes have now
  addressed article text, calculator page text, and title/heading patterns)
  but something this audit process cannot see from the code alone: overall
  site trust/age signals, backlink profile, or real user engagement data.
  Onsite content changes cannot fix that category of problem.
