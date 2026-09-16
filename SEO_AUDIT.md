# PairDish (pairdish.com) — SEO Audit & Status

**Last updated:** 2026-09-16 (durable job run 6)
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

### Run 4 — 2026-09-11
- **Monitoring (Phase 6):** GSC 28d: 0 clicks / 4 impressions / 3 days with data (top pages /
  /articles + /grocery-budget-meal-planning). Sitemap healthy: 52 URLs submitted, 0 errors,
  lastDownloaded 2026-09-10. The 3 new guides are not yet in GSC data (young site + 2–5 day
  lag; no `indexing` scope for manual submission — sitemap + internal links only).
  Bing (~4mo): 351 queries / 57 clicks / 510 impressions — top demand ridges: philly
  cheesesteak (22 impr), pork loin, schnitzel, garlic shrimp, paella, lentil soup. All
  "what to serve with X" style → Batch A/C direction stays valid.
- **Live checks:** homepage, /articles, all 3 guides, sitemap = 200. Guides re-verified:
  `<table>`s present, zero FAQ sections, Commons credit lines, JSON-LD present.
- **Outreach (Phase 5a):** Entireweb confirmation COMPLETED (link clicked; "You're in the
  queue"); 4 NEW free submissions: GainWeb (submitted), FreePRWebDirectory (pending_review +
  email), Directory-Free (submitted), Viesearch (id 28dlj, confirm clicked, pending_review).
  Tracker: 9 rows (2 listed / 4 submitted / 3 pending_review).
- **Pinterest:** discovered @pairdish already exists (10-13 pins, 0 followers; domain
  verification TXT present since 2025-12-13; creator mail to admin@pairdish.com). No creds
  on box → user must provide access before pinning.
- **Email infra:** admin@pairdish.com receives (CF Email Routing → user Gmail). No sending
  creds → domain-email link outreach still blocked.
- **Standing blockers (unchanged):** GSC `indexing` scope + GA4 `analytics.readonly` scope
  need one-time user re-consent; link-outreach sending needs domain SMTP/API creds (user).
- **Review gate: still ACTIVE** — the 3 guides await user review (no publish of items 4-8).

### Known follow-ups for run 5
1. Check listing states: Entireweb crawl status, Viesearch (28dlj), FreePRWebDirectory,
   Directory-Free reviews; re-sweep mailbox for anything actionable.
2. Pinterest: on user access → create boards (Pairing Guides / Cheese Boards / Meal Prep) +
   pin the 3 live guides. X/FB/IG: check handle availability (user identity decisions).
3. After user OK on the 3 guides → Batch A items 4-8 at 1/day (kielbasa, tilapia, country
   fried steak, blackened salmon, biscuits+syrup) with the full pipeline (Commons photo →
   vision verify → tables + .gov sources → deploy → Bing submit). Prioritize Bing demand:
   philly cheesesteak, pork loin, schnitzel, garlic shrimp, paella, lentil soup.
4. Huzzler badge embed + publish (pending user decision; embed code in OUTREACH.md).
5. GSC re-check: are the 3 guides indexed? GA4 data check once scope granted.

### Run 5 — 2026-09-14
- **Phase 4 — internal-linking layer SHIPPED:** new `relatedGuides` field + rendered card block in the
  article template ("Keep planning your plate" section). All 8 articles now carry 2 in-body related
  links each (16 new internal links; every pairing guide gets 4-5 inbound links from related pages,
  every core article at least 1). Drafted via `scripts/apply_linking_edits.py` (assertion-guarded),
  built, deployed (wrangler version `c6da2103-4067-4b12-8e6d-b032d0d4b11a`), **verified live 8/8**
  (`scripts/verify_run5_links.py` — both cards present on every article).
- **Phase 6 — monitoring:** GSC **BLOCKED** — Google OAuth refresh token expired/revoked
  (`invalid_grant`; last successful refresh 2026-09-14 05:01 UTC = the known testing-mode ~7-day
  expiry). **User action required, fleet-wide:** `python3 ~/.hermes/scripts/webmaster_auto_add.py
  google-auth` (open the URL, paste the code) — until then GSC + GA4 APIs are down for ALL jobs.
- **Bing (works):** ~4mo range: **396 queries / 60 clicks / 564 impressions** (up from 351/57/510 on
  09-11). Top demand: philly cheesesteak (22 impr), pork loin (2 listed), schnitzel, garlic shrimp,
  paella, "what to eat with fried fish", lentil soup, french toast. Sitemap feed: Success, 52 URLs,
  last crawled 2026-09-12.
- **Phase 5a — 6 NEW free directory submissions (all accepted into review queues):** Submission Web
  Directory, Site Promotion Directory, UK Internet Directory, Free Internet Web Directory (phpLD +
  captcha OCR), Promote Business Directory, Best Sites Index (3-step JS wizard). Tracker: 15 rows —
  2 listed / 10 submitted / 3 pending_review.
  - Viesearch free listing still queued (28dlj 404s until review); received a PAID "skip the wait"
    upsell → declined (free-only policy). FreePRWebDirectory: standard upsell email → queue unchanged.
- **Sitemap maintenance:** bumped `<lastmod>` to 2026-09-14 for the 8 edited articles (script
  `scripts/bump_sitemap_lastmod.py`), rebuilt + redeployed (wrangler version `4c21fef9-773d-449f-9e88-de86bf141a78`),
  verified live (sitemap shows the new date). Commit `6b11800` pushed.
- **Review gate: STILL ACTIVE** — the 3 pairing guides await user review; Batch A items 4-8 not
  published. On user OK → 1/day cadence.
- **Live checks:** homepage, sitemap (52), all 8 articles = 200.

### Known follow-ups for run 6
1. AFTER user re-consents: re-run GSC monitor (are the 3 guides + core articles indexed?), GA4 sanity.
2. Directory follow-up sweep: Viesearch /28dlj status; new phpLD listings (review 2-6mo); Huzzler
   badge decision (user); Pinterest @pairdish access (user).
3. On user OK for the guides: Batch A items 4-8 at 1/day (kielbasa, tilapia, country fried steak,
   blackened salmon, biscuits+syrup) + Bing-demand dishes (philly cheesesteak, pork loin, schnitzel).
4. Keep committing+deploying within the review-gate constraints; no bulk article publishing until OK.

### Run 6 — 2026-09-16
- **Phase 5a — 2 NEW free submissions + 1 LISTING LIVE:**
  - **Quality Internet Directory** (qualityinternetdirectory.com) — phpLD network sibling; 3-step POST
    wizard; free Regular; cat 297 Recreation & Sports > Cooking; no captcha → "Link submitted." → `submitted`.
  - **Sites Web Directory** (siteswebdirectory.com) — phpLD network sibling; URL-param wizard + DO_MATH
    (8+6=14); cat 1987 Home > Cooking → "Link submitted and awaiting approval." → `submitted`.
    (Its success page points back at qid — chain closed.)
  - **Viesearch 28dlj WENT LIVE** (2026-09-14 email; listing verified 2026-09-16: HTTP 200, title
    contains site name) → https://viesearch.com/28dlj/pairdish-food-pairing-tools-guides → tracker `listed`
    (confirm → live took ~3 days).
  - phpLD/marketing-internet-directory network now fully covered for pairdish; tracker: **17 rows —
    3 listed / 12 submitted / 2 pending_review** (`update_tracker.py` gained a notes-preserving `status` command).
- **Phase 4 — structural content work (review gate respected; NO new articles):**
  - **FAQ removal site-wide (user hard rule):** all 36 tool pages — visible FAQ sections + FAQPage
    JSON-LD removed (3,630 lines; assertion-guarded script `scripts/remove_tool_faqs.py`).
    Live-verified 0 occurrences on 36/36.
  - **Related Guides internal links (tools → articles layer):** new card block on 9 tool pages
    (flavor-pairing ×3 guides, meal-prep ×3, nutrition-calculator ×2, macro-calculator ×2,
    protein-calculator ×2, grocery-list ×2, pantry-helper ×2, recipe-scaler ×1, buffet-planner ×2 =
    18 new internal links; tool pages previously linked to ZERO articles).
  - **WebApplication JSON-LD** on all 36 tool pages (per-page name/description/category, offer price 0)
    — replaces the removed FAQPage entity with a correct one.
  - Sitemap lastmod bumped to 2026-09-16 for the 36 tool URLs.
  - Deploys `72032fa2` → `e3fbfa62` (sitemap rebuild) → `9064885f` (schema); live verify
    `scripts/verify_run6_live.py`: **36/36 pages clean** (FAQ gone, schema present, guides links
    present, sitemap dates correct, article pages unaffected). Commits `12587f8`, `1d3213c` pushed.
- **Phase 6 — monitoring:** GSC **STILL BLOCKED** — refresh token `invalid_grant`, last good refresh
  2026-09-14 05:01 UTC; user re-consent still pending (`webmaster_auto_add.py google-auth`).
  Bing (~4mo): 396 queries / 60 clicks / 564 impressions (unchanged vs 09-14); sitemap feed Success,
  52 URLs, last crawled 2026-09-12. Mail sweep 14→16 Sep: Viesearch live notices, ukd/pbd acks,
  Huzzler + Pinterest marketing (not actionable). Live checks 200: homepage, sitemap, articles, tools.
- **Review gate: STILL ACTIVE (9 days)** — 3 pairing guides await user review; items 4-8 not published.

### Known follow-ups for run 7
1. **Review gate needs the user OK** (open since 09-07). Batch A items 4-8 staged to publish at 1/day the
   moment it lands (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup) + Bing-demand
   dishes (philly cheesesteak, pork loin, schnitzel, garlic shrimp, paella).
2. If Google re-consent done: GSC monitor (indexation of the 8 articles + tool pages), sitemap resubmit,
   coverage fixes; GA4 data sanity.
3. Directory: fresh-family research pass (phpLD vein exhausted); re-check Viesearch/qid/swb states.
4. Pinterest access + domain-SMTP for link outreach remain user actions (blockers unchanged).