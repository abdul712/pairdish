# PairDish (pairdish.com) — SEO Audit & Status

**Last updated:** 2026-09-07 (durable job run 1)
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

### Run 1 — 2026-09-07
- Phase 1 audit ✅ (this file). Sitemap submitted correctly in GSC, dead entry removed.
- Phase 2 corpus analysis ✅ → CONTENT_PLAN.md (48 topics + execution order).
- Phase 3 keyword plan ✅ (in CONTENT_PLAN.md).
- Phase 4 execution: 3 pairing guides drafted (review-first batch), article template updated (FAQ made optional per user rule, official external links added, richer internal links), GA4 gtag added. Deploy pending user review.
- Phase 5: outreach tracker started (OUTREACH.md).
- Blockers reported: GA4/analytics.readonly + indexing scope (re-consent needed), GSC indexing API unavailable.