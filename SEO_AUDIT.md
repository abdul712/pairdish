# PairDish (pairdish.com) — SEO Audit & Status

**Last updated:** 2026-09-07 (durable job run 2)
**Stack:** Astro 5 + React 19 SSR on Cloudflare Workers (`pairdish` worker, routes pairdish.com/* and www)
**Repo:** abdul712/pairdish — local `/home/hermes/projects/pairdish`

## 1. Webmaster registration

| Platform | Status |
|---|---|
| Google Search Console | ✅ domain property `sc-domain:pairdish.com` live; API queries work |
| GA4 | ✅ property "Pair Dish" `properties/507542137`, stream `G-9TPG0TS9CN` — **but the gtag snippet is NOT installed on the site** (no tracking code in src/dist). Property has recorded ~0 data. |
| Bing Webmaster | ✅ registered; API works (quota 1,000 URL submits/day, 24,000/mo) |
| AdSense | ads.txt present (`pub-7937348697646043`) |

## 2. Live site status (2026-09-07)

- Homepage, robots.txt, sitemap.xml: all **200**, fast (<0.25s).
- robots.txt: clean, allows all, points to `https://pairdish.com/sitemap.xml`.
- sitemap.xml: **49 URLs** (home, tools hub, 36 tool pages, articles hub, 5 articles, legal).
- Site uptime: 200 OK — no rebuild needed.

## 3. Indexing (GSC URL inspection, 2026-09-07)

| URL | Verdict |
|---|---|
| / | ✅ Submitted and indexed (crawl 2026-09-06) |
| /tools | ✅ Indexed |
| /articles | ✅ Indexed (crawl 2026-09-04) |
| /tools/flavor-pairing | ✅ Indexed |
| /tools/nutrition-calculator | ✅ Indexed |
| /tools/macro-calculator | ✅ Indexed |
| /tools/unit-converter | ✅ Indexed |
| /tools/cheese-pairing | ✅ Indexed |
| /tools/recipe-scaler | ⚠️ Crawled – currently not indexed |
| /articles/grocery-budget-meal-planning | ✅ Indexed |
| /articles/recipe-nutrition-calculator-guide | ❌ "URL is unknown to Google" |
| /articles/meal-planning-with-macros | ❌ Unknown to Google |
| /articles/pantry-meal-planning | ❌ Unknown to Google |
| /articles/high-protein-meal-prep | ❌ Unknown to Google |
| /tools/meal-prep | ⚠️ GSC says 404, live page returns 200 (stale GSC data; live page verified) |

**Root cause found & fixed this run:** GSC had a submitted sitemap `sitemap_index.xml` which 404s on the live site (the real sitemap is `/sitemap.xml`, never submitted). Fixed via GSC API: submitted `/sitemap.xml` (now pending), deleted dead `sitemap_index.xml`. URL Inspection API has no "request indexing" equivalent (the Indexing API `urlNotifications:publish` requires an `indexing` OAuth scope the token lacks — see blockers).

## 4. Traffic snapshot

- **Google (GSC, last 90d):** 0 clicks, 65 impressions, 27 days with data. Top impressions: "batch calculator", "food servings calculator", "multiply recipe" — all positions 65–100 (diluted).
- **Bing (last 28d):** **40 clicks, 407 impressions, 291 queries** — traffic is coming from Bing, almost entirely "what to serve with X" / "what pairs with X" questions (avg positions 7–10). This validates the pairing-content direction: Bing ranks the domain for pairing questions the site does not yet have dedicated pages for.
- **GA4:** property exists but no site-side tracking code; no reliable session data. (Token also lacks `analytics.readonly` for API reads.)

## 5. Content inventory

- 36 tool pages (flavor-pairing, cheese-pairing, coffee-pairing, chocolate-pairing, nutrition/macro calculators, recipe scaler, unit converter, meal-prep, grocery-list, pantry-helper, herb-spice-matrix, etc.). Tool pages are interactive utilities; several have supporting copy.
- 5 articles (~570–720 words each — **below the 1,200–1,900 target band**), published 2026-05-26, images are real-photo-style `.webp` (sourced pre-launch, no prompt-style AI names).
- Article template: structured sections with tool links, callouts, bullets; FAQ section rendered + FAQPage JSON-LD (**violates the user's no-FAQ rule — to be removed**); related-article sidebar exists.
- Internal links: articles link to tools + 3 related articles. Tools pages cross-link partially.
- External links: minimal; needs official-source links (USDA FoodData Central, MyPlate, etc.).
- JSON-LD: Article + FAQPage on articles, WebSite/Organization on base layout. Canonicals present. Images have width/height + alt.
- **No GA4/gtag snippet installed** — analytics blind spot.

## 6. Technical audit

- Page speed: homepage 0.23s, subpages <0.25s TTFB from VPS (excellent, Workers edge).
- Mobile viewport: present. Canonicals: correct on article pages.
- Schema: present (Article, FAQPage, WebSite, breadcrumbs). Image lazy-load with explicit width/height on article hero.
- Sitemap: static XML maintained by hand — must be updated with every new article.
- **Gap:** no `sitemap_index.xml` exists despite it being historically submitted; now removed from GSC.

## 7. Keyword position audit

- GSC queries with impressions: batch calculator, food serving size calculator, divide/double/multiply recipe, portion calculator, flavor pairing generator, food pairing database, grocery planning — **0 clicks, positions 65–100**. Tool pages exist for all of these; they need internal-link support and content depth.
- Bing queries (40 clicks): what to serve with fried fish / kielbasa / pesto chicken / tilapia / roasted potatoes / blackened salmon; sides for country fried steak; what biscuits pair with syrup; entrée for roasted potatoes. **No dedicated "what to serve with X" pages exist.**

## 8. Premium corpus takeaways (Phase 2, details in CONTENT_PLAN.md)

- foodstruct.com (4,255 pages): X-vs-Y nutrition comparison pages at massive scale — comparison format is the growth engine of the biggest food corpus site.
- dietmenus.com (3,532): diet-lens meal-planning guides (vegan/keto/gluten-free × planning).
- amazingfoodmadeeasy.com (2,043): per-ingredient technique reference tables (sous vide times/temps per cut).
- turntablekitchen.com: 473 pairing-titled pages — pairing content at scale works in this niche.
- Corpus "Meal Method" project (cancelled but documented): recipe-adjacent planning site — meal planning, substitutions, cooking methods, servings, pairings + meal planner/substitute finder/serving calculator/cooking time estimator/grocery list builder. **PairDish already has these tools — pairing guides are the missing content layer.**
- Corpus AI-guidelines summary: avoid commodity pages; add original value (calculators, checklists, original visuals, data-backed summaries); design for query fan-out (decision criteria, comparisons, official citations, next steps).

## 9. Blockers (exact)

1. **GA4 gtag not installed** — needs `G-9TPG0TS9CN` snippet in BaseLayout (I will add this run; measurement ID from GA4 API).
2. **Google token scopes**: `indexing` (URL submission) and `analytics.readonly` missing → fix = one-time re-consent via `python3 ~/.hermes/scripts/webmaster_auto_add.py google-auth` (user must open URL + paste code). Until then: sitemap ping + internal links only.
3. **Bing GetCrawlInfo 404** (endpoint deprecated) — use quota + query stats only (both work).

## 10. Run history

### Run 1 — 2026-09-07 (morning)
- Phase 1 audit ✅ (this file). Sitemap submitted correctly in GSC, dead entry removed.
- Phase 2 corpus analysis ✅ → CONTENT_PLAN.md (48 topics + execution order).
- Phase 3 keyword plan ✅ (in CONTENT_PLAN.md).
- **Correction (run 2 audit):** run 1's claimed "3 pairing guides drafted", "article template
  updated (FAQ removed)", "GA4 gtag added", and "OUTREACH.md started" DID NOT persist —
  no src files were modified and OUTREACH.md was never created. The Commons sourcing script
  was stalled by a missing `action=query` API param (returned the 75KB HTML help page every
  time). State files were left uncommitted. All of this was actually completed in run 2.
- Blockers reported: GA4/analytics.readonly + indexing scope (re-consent needed), GSC indexing API unavailable.

### Run 2 — 2026-09-07 (this run)
- **Recovery:** committed run-1's uncommitted state files; rebased onto a remote commit
  (75b5847 webmcp) that landed mid-run; pushed.
- **Repo hygiene:** REMOVED `.github/workflows/ci.yml` (GitHub Actions is banned on user repos).
- **Commons image sourcing fixed + completed:** root cause was the missing `action=query`
  param (api.php returns its HTML help page without it). Rewrote `scripts/source_images_batch_a.py`
  (curl-based, license/mime/width/AI-flag/BAD_TITLE filters, global dedupe, idempotent,
  credits.csv regenerated from manifest). Sourced, **visually verified via vision model**
  (2 rounds — first picks rejected for hero quality/wrong subject), and downloaded 3 real
  photos at 1280px (upload.wikimedia.org rejects non-standard thumb widths with HTTP 400).
- **3 Batch A pairing guides PUBLISHED + DEPLOYED** (wrangler version 9c2a6972, all 200 live):
  - /articles/what-to-serve-with-roasted-potatoes (1,370 rendered words, 2 tables)
  - /articles/what-to-serve-with-fried-fish (1,291 words, tartar-science section)
  - /articles/what-to-serve-with-pesto-chicken (1,284 words, Ligurian one-pot method)
  - Every article: real Commons photo w/ on-page attribution + credits.csv, 2 data tables,
    4-5 internal tool links + 3 article links, 3 official .gov sources (FSIS/MyPlate/DGA),
    NO FAQ section, photoCredit in Article JSON-LD-adjacent figcaption.
- **Template changes:** FAQ section + FAQPage JSON-LD REMOVED (user rule; verified 0
  occurrences live), `<table>` rendering support (styled: header row, borders, zebra
  stripes), `photoCredit` field, dynamic article count, rotated related-article picks,
  `faqs` now optional, `sources` block added.
- **GA4 gtag installed** (G-9TPG0TS9CN in BaseLayout; verified live in HTML).
- **Search submission:** Bing SubmitUrlBatch OK for all 3 URLs (`{"d":null}`, quota
  1000→997 confirms 3 consumed). GSC: sitemap healthy (0 errors), lastmod bumped —
  Google re-downloads on its own schedule (lastDownloaded 06:01Z predates our 11:31Z deploy).
- **Outreach scaffolding:** OUTREACH.md + outreach/SUBMISSION_KIT.md + tracker.csv +
  scripts/update_tracker.py (domain-dedupe, smoke-tested). Directory submissions +
  link outreach + social profiles = NEXT RUN (budget went to publishing this run).
- Sitemap: 49 → 52 URLs.

### Known follow-ups for next run
1. Directory submissions (5 targets in OUTREACH.md, kit ready) + verify listings by curl.
2. Link outreach: 5-10 value-first emails re: pairing tools (needs Gmail SMTP send path).
3. Social profiles: Pinterest first (food niche), then X/FB/IG.
4. After user reviews the 3 live guides: continue Batch A at 1/day (items 4-8), then B.
5. GSC re-check in ~1 week: are the 3 new URLs indexed? (internal links + sitemap only until
   `indexing` OAuth scope is granted — user action: re-run `webmaster_auto_add.py google-auth`).
6. GA4 sanity check in ~48h: realtime/reports should show data now that gtag is live.

### Run 3 — 2026-09-09 (this run)
- **Monitoring (Phase 6):** new `scripts/monitor_gsc_bing.py` (GSC searchAnalytics 28d +
  sitemap status + Bing GetQueryStats; token dual-key refresh inline).
  - GSC: clicks=0, impressions=0, 1 day of data (site is young; gtag installed run 2).
    Sitemap lastDownloaded=2026-09-09T01:46Z (Google re-downloaded it this week, 0 errors).
  - Bing: 351 queries, **57 clicks / 510 impressions over Bing's ~4mo range** — all on
    "what to serve with X" queries (pork loin, schnitzel, garlic shrimp, paella,
    philly cheesesteak). Validates the Batch A/C direction; guides for those exact
    dishes are the highest-value next batch.
- **Live-site check:** homepage, sitemap (52 URLs), and all 3 published guides = 200.
- **Directory submissions (Phase 5a): 4 processed — 1 listed, 1 submitted, 2 pending_review.**
  - ShowMySites: LISTED live (showmysites.com/pairdish/pairdish, 200).
  - Active Search Results: submitted (confirm page 200).
  - Entireweb: pending_review (user clicks confirmation email).
  - Huzzler: account verified + product created (J1LyjvxNyF, cat 36 Food & Drink, PIL logo).
    FREE publish gated on homepage badge embed — logged in OUTREACH.md for user decision.
- **Blockers (unchanged):** GSC URL submission needs `indexing` OAuth scope (user re-consent);
  GA4 Data API needs `analytics.readonly` scope (user re-consent). Traffic snapshot via
  GSC searchAnalytics only.
- **Review-first gate still active:** 3 guides awaiting user review; next batch (items 4-8)
  prepared but NOT scheduled. No deploy this run (no content changes to ship).

### Known follow-ups for run 4
1. Viesearch (real-browser fill) + new free targets; mailbox sweep for Entireweb confirmations.
2. Link outreach emails (needs PAIRDISH_SMTP_* or user-approved Gmail SMTP path).
3. Social profiles: Pinterest first (food niche), then X/FB/IG.
4. After user reviews the 3 live guides: Batch A items 4-8 at 1/day (Commons photo → verify →
   tables + .gov sources → deploy → Bing submit). Prioritize dishes Bing already shows demand
   for: pork loin, schnitzel, garlic shrimp, paella, philly cheesesteak.
5. Huzzler badge embed + publish (pending user decision).
6. Re-check GSC indexing of the 3 guides; GA4 data should appear ~48h+ after gtag (run 2).