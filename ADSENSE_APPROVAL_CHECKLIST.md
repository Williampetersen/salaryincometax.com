# AdSense Approval Checklist

Last updated: 2026-09-09

This checklist is for `salaryincometax.com` before submitting or resubmitting the
site for Google AdSense review.

## 2026-09-09 update: third rejection, deploy pipeline was broken, and real bugs found

Third rejection (2026-09-08), same "Low value content" reason. Two findings this
pass go beyond content structure:

1. **The last two content-fix commits never actually reached production.**
   `package.json` pinned `engines.pnpm` to an exact "9.4.0"; once Vercel's build
   image moved to pnpm 9.15.9, `pnpm install --frozen-lockfile` hard-failed in
   ~3 seconds on every push (pnpm enforces `engines.pnpm` by default, no
   engine-strict flag needed). `engines.node: "20.x"` was also deprecated and
   silently overriding the project's own 24.x setting. This means the
   2026-09-01 calculator de-templating and the 2026-09-09 blog title fix were
   both sitting unbuilt when AdSense did its review - whatever was reviewed
   predated both fixes. Fixed by dropping the pnpm engines pin and bumping
   node to 24.x. **Before any future resubmission, confirm the latest commit's
   GitHub commit status for context "Vercel" is `success`, not just that a
   push happened** - a failed deploy fails silently for production traffic
   (Vercel keeps serving the last successful build) and is easy to miss.

2. **Every published blog article's hero image, card thumbnail, Open Graph
   image, and Article structured-data image pointed at a file that was never
   committed to the repo**, in the project's entire git history. A client-side
   fallback masked this in-browser after the initial 404, but the OG/Twitter
   meta tags and schema.org `image` field bypass that fallback and pointed
   straight at a dead URL - a genuine broken-resource defect on 100% of
   published articles, not a structural/duplication issue. Fixed by building
   hero art from assets the site already owns (country flags, category
   palette) instead of sourcing stock photography needing its own licensing
   check. Also found and removed an orphaned git submodule reference (empty
   gitlink for a path named `salaryincometax.com`, no `.gitmodules` ever
   defined it) matching the "Failed to fetch one or more git submodules"
   warning that had been present in every build log.

3. Also fixed: the blog article template rendered an identical fixed 10-box
   section skeleton (same labels, same order) on every one of the 19 published
   articles regardless of topic - the same "scaled content" signal as the
   title-pattern and calculator-heading issues from the prior two rejections,
   just one level up the page structure. Replaced with per-article-type
   layouts. See the commit history on `app/blog/[slug]/page.tsx` for detail.

**Not yet resolved, blocking a confident resubmission:**
- Google Search Console's own Page indexing/Removals report was showing
  "Needs attention - Low value content" independently of the AdSense
  reviewer. This needs to be checked and cleared before resubmitting - if
  it's still flagged, the AdSense review will likely fail again regardless of
  further code changes, since it draws on the same underlying quality signal.
- Every author byline site-wide is a generic "Editorial Team" with no named
  person, credentials, or physical business address anywhere on the site -
  a real trust-signal gap for a reviewer evaluating who actually stands
  behind the content.
- Three rejections in ~10 weeks, each followed by a same-week fix and
  resubmission, is itself a pattern Google's systems can see. Real elapsed
  time and real (non-bot) traffic between this fix and the next submission
  matters more than further code changes at this point.

## 2026-07-06 update: rejection and remediation

Google AdSense rejected the site citing "Low value content" / "Your site
isn't ready to show ads." Most items below were already true (trust pages,
robots.txt, sitemap, ads.txt, cookie consent, and the homepage were all
already in place and were verified directly in code, not just assumed from
this checklist). The most likely real cause was a structural one this
checklist did not previously test for: the public blog was built from six
templates looped over every country/city, producing roughly 90 public
articles that all share an identical section skeleton - a pattern that
matches Google's "scaled content abuse" policy even though the underlying
sentences were unique.

Action taken: the public blog was pruned to a 14-article flagship allowlist
(7 countries, 2 templates each, no per-city or "best cities" pages) and 5
new hand-written, non-templated evergreen guide articles were added. See
`CONTENT_QUALITY_AUDIT_2026-07-06.md` for the full rationale and file list
before resubmitting.

## Core site requirements

- [x] HTTPS is enabled.
- [x] A custom domain is active.
- [x] The site has working navigation in the header and footer.
- [x] The site has crawlable routes for the homepage, calculators, blog, and legal pages.
- [x] The site includes a public contact path and support email.
- [x] The site includes a public About page.
- [x] The site includes Privacy Policy, Cookie Policy, Terms, Disclaimer,
  Editorial Policy, Advertising Policy, and Sources pages.

## Content quality requirements

- [x] Public blog pages use only the stronger reviewed article set.
- [x] Calculator pages include explanatory content, FAQs, sources, and a disclaimer.
- [x] Blog content is original and not copied from competitor websites.
- [x] Empty placeholder pages are not published.
- [x] Broken internal links should be fixed before submission.
- [x] Thin or low-confidence content should remain unpublished or unindexed until improved.

## AdSense policy alignment

- [x] No language encourages users to click ads.
- [x] No language offers rewards, support-us prompts, or similar incentives for ad clicks or ad views.
- [x] No fake download buttons, fake streaming claims, fake next-step prompts, or deceptive labels are used.
- [x] No fake download buttons, fake navigation items, or deceptive UI patterns are used.
- [x] No automatic redirects, popups, or software-driven navigation tricks are used.
- [x] No pages are intentionally published just to hold ads.
- [x] Ad placeholders do not render before approval.
- [x] Future ads must be visually separate from navigation, calculators, buttons, tables, and country-picker controls.
- [x] Future ads must not be paired with arrows, images, animation, or copy that draws unnatural attention to ads.
- [x] Future ads must not be implemented inside pop-ups, emails, or software-style screens.
- [x] Future ads must use clear advertising labels where appropriate.
- [x] Sponsored content must be labeled clearly if introduced later.
- [x] Advertising must not influence editorial or calculator methodology.

## Privacy and consent

- [x] Privacy Policy discloses Google-related data collection and cookie use.
- [x] Cookie Policy explains essential, analytics, and advertising storage.
- [x] Cookie consent allows rejecting non-essential cookies.
- [x] Google Analytics is consent-aware.
- [x] AdSense storage remains disabled until advertising consent is granted.
- [x] The site documents Google Ad Settings and Google partner-site data links.

## Technical publishing requirements

- [x] `robots.txt` is active and allows crawling.
- [x] `sitemap.xml` is active.
- [x] `blog-sitemap.xml` is active.
- [x] Static `public/ads.txt` exists and is served at `/ads.txt`.
- [x] `public/ads.txt` uses the exact publisher line from AdSense.
- [x] The contact form works server-side and returns clear errors.
- [x] The site builds successfully for production.
- [x] The site is mobile responsive.
- [x] No forced downloads, malware behavior, pop-unders, or browser-setting changes are implemented by the site.

## Manual checks before applying

- [ ] Do not click your own ads after approval.
- [ ] Do not ask friends, staff, or contractors to click ads.
- [ ] Do not buy paid-to-click, autosurf, click-exchange, or other invalid-traffic services.
- [ ] Review any paid traffic campaign against Google's landing page quality expectations before sending traffic to ad pages.
- [ ] Review Google Search Console for indexing issues - as of 2026-09-09 it
  was independently showing "Needs attention - Low value content" and this
  needs to be re-checked and confirmed clear before resubmitting.
- [x] Check Vercel production for broken images, 404s, and console errors -
  2026-09-09: checked all 69 sitemap URLs (all 200), found and fixed every
  published article's hero/OG/schema image pointing at a file that never
  existed in the repo (see the 2026-09-09 section above).
- [x] Manually review the published blog library for grammar, factual, and
  formatting issues - 2026-09-09: scanned all 19 published articles' live
  rendered output for leaked template artifacts (unresolved interpolation,
  `undefined`/`null`/`NaN` in visible text); none found.
- [x] Confirm no copyrighted images are used without permission - 2026-09-09:
  resolved by removing the stock-photo dependency entirely (see hero art fix
  above); the only imagery in use is the site's own logo and standard
  national flag files.
- [x] Confirm no low-value pages are being linked prominently from the public
  navigation - 2026-09-09: reviewed `lib/navigation.ts`; every header/footer
  link points to a substantive page.
- [x] Confirm no public page includes misleading navigation that could be
  confused with a future ad unit - 2026-09-09: reviewed `app/layout.tsx` and
  `advertising-policy`; ad scripts only load when `ADSENSE_CLIENT_ID` is set
  in production and no placeholder/ad-shaped UI exists pre-approval.
- [ ] Confirm `https://salaryincometax.com/ads.txt` serves the correct
  AdSense line after approval (already verified serving correctly pre-approval
  as of 2026-09-09; recheck once ads are actually enabled).
- [ ] Review Google Publisher Policies for content-level issues before enabling ads on newly published articles.
- [ ] Get a real named author (not just "Editorial Team") with a genuine,
  relevant bio onto the authors page, About page, and footer.

## Google references

- AdSense programme policies:
  https://support.google.com/adsense/answer/48182
- Ad placement policies:
  https://support.google.com/adsense/answer/1346295
- Google Publisher Policies privacy disclosures:
  https://support.google.com/publisherpolicies/answer/10437794
- Google Publisher Policies:
  https://support.google.com/adsense/answer/10502938
- Ads.txt guide:
  https://support.google.com/adsense/answer/12171612
