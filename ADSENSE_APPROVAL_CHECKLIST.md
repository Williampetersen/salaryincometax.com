# AdSense Approval Checklist

Last updated: 2026-05-24

This checklist is for `salaryincometax.com` before submitting or resubmitting the
site for Google AdSense review.

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
- [x] No fake download buttons, fake navigation items, or deceptive UI patterns are used.
- [x] No automatic redirects, popups, or software-driven navigation tricks are used.
- [x] Ad placeholders do not render before approval.
- [x] Future ads must be visually separate from navigation, calculators, buttons, and tables.
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
- [x] `ads.txt` route exists at `/ads.txt`.
- [ ] Set `ADSENSE_ADS_TXT` after AdSense approval using the exact publisher line from AdSense.
- [x] The contact form works server-side and returns clear errors.
- [x] The site builds successfully for production.
- [x] The site is mobile responsive.

## Manual checks before applying

- [ ] Review Google Search Console for indexing issues.
- [ ] Check Vercel production for broken images, 404s, and console errors.
- [ ] Manually review the published blog library for grammar, factual, and formatting issues.
- [ ] Confirm no copyrighted images are used without permission.
- [ ] Confirm no low-value pages are being linked prominently from the public navigation.
- [ ] Confirm `https://salaryincometax.com/ads.txt` serves the correct AdSense line after approval.

## Google references

- AdSense programme policies:
  https://support.google.com/adsense/answer/48182
- Ad placement policies:
  https://support.google.com/adsense/answer/1346295
- Google Publisher Policies privacy disclosures:
  https://support.google.com/adsense/answer/10502938
- Ads.txt guide:
  https://support.google.com/adsense/answer/12171612
