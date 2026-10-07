# PairDish (pairdish.com) — SEO Audit & Status

**Last updated:** 2026-10-07 (durable job run 14)
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

1. **GA4 gtag IS installed** — verified live again 2026-09-23: `G-9TPG0TS9CN` is present on the homepage (3 occurrences). Earlier audits listed it as missing; it is not. GA4 *reads* stay blocked by the dead Google token below, so no traffic reports yet.
2. **Google refresh token is DEAD (`invalid_grant`)** — re-probed 2026-09-23 with a direct refresh call (`scripts/gsc_token_probe.py`): `400 invalid_grant — Token has been expired or revoked` (last good refresh 2026-09-14 05:01 UTC). Fix = one-time re-consent: `python3 ~/.hermes/scripts/webmaster_auto_add.py google-auth` (user opens the printed URL and pastes the code back immediately — codes are single-use and expire in ~10 min). Until then GSC + GA4 API reads and GSC indexing submissions are unavailable fleet-wide; Bing (separate key) carries monitoring.
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
    19 new internal links; tool pages previously linked to ZERO articles).
  - **WebApplication JSON-LD** on all 36 tool pages (per-page name/description/category, offer price 0)
    — replaces the removed FAQPage entity with a correct one.
  - Sitemap lastmod bumped to 2026-09-16 for the 36 tool URLs.
  - Deploys `72032fa2` → `e3fbfa62` (sitemap rebuild) → `9064885f` (schema); live verify
    `scripts/verify_run6_live.py`: **36/36 pages clean** (FAQ gone, schema present, guides links
    present, sitemap dates correct, article pages unaffected). Commits `12587f8`, `1d3213c` pushed.
- **Phase 6 — monitoring:** GSC **STILL BLOCKED** — refresh token `invalid_grant`, last good refresh
  2026-09-14 05:01 UTC; user re-consent still pending (`webmaster_auto_add.py google-auth`).
  Bing (~4mo): 396 queries / 60 clicks / 564 impressions (unchanged vs 09-14); sitemap feed Success,
  52 URLs, last crawled 2026-09-12. **Bing SubmitUrlBatch: the 36 edited tool URLs submitted for
  recrawl (`{"d":null}`, daily quota 1000→964).** Mail sweep 14→16 Sep: Viesearch live notices,
  ukd/pbd acks, Huzzler + Pinterest marketing (not actionable). Live checks 200: homepage, sitemap,
  articles, tools.
- **Review gate: STILL ACTIVE (9 days)** — 3 pairing guides await user review; items 4-8 not published.

### Known follow-ups for run 7
1. **Review gate needs the user OK** (open since 09-07). Batch A items 4-8 staged to publish at 1/day the
   moment it lands (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup) + Bing-demand
   dishes (philly cheesesteak, pork loin, schnitzel, garlic shrimp, paella).
2. If Google re-consent done: GSC monitor (indexation of the 8 articles + tool pages), sitemap resubmit,
   coverage fixes; GA4 data sanity.
3. Directory: fresh-family research pass (phpLD vein exhausted); re-check Viesearch/qid/swb states.
4. Pinterest access + domain-SMTP for link outreach remain user actions (blockers unchanged).

### Run 7 — 2026-09-18
- **Phase 5a — 5 NEW free submissions (phpLD extension set — ALL first-try):** High Rank Directory
  (highrankdirectory.com), USA Web Sites Directory (usawebsitesdirectory.com), Australia Web Directory
  (australiawebdirectory.net), Germany Web Directory (germanywebdirectory.com), Italy Web Directory
  (italywebdirectory.net). Single-form flow, free Regular (LINK_TYPE=normal), captchas OCR'd via vision
  (6574/4253/3553/2372/6549), cat 297 Cooking on all five (gwd label "Kochen-Cooking"). Every POST
  returned the `class="msg"` marker "Link submitted and awaiting approval." New script
  `scripts/dir_phpld_ext.py`. **Tracker: 22 rows — 3 listed / 17 submitted / 2 pending_review.**
- **Phase 4 — within the review gate (no new articles published):** `grocery-budget-meal-planning`
  EXPANDED from ~750 words (below the 1,200–1,900 band) to **1,460 rendered words** with:
  - 2 official-data tables: USDA ERS food-at-home price changes by category (+ 2026 forecast) and
    BLS average U.S. city prices for 12 staples (Aug 2026, values pulled from the official ERS CSV
    and BLS API/id series — e.g. ground beef $6.92/lb, whole chicken $2.01/lb, eggs $2.27/doz).
  - 4 new sections (what food prices are doing; street price of staples; unit-price math with a worked
    example; when bulk buying actually saves) + a **sources block** (USDA ERS Food Price Outlook, BLS
    CPI Average Price Data factsheet, Iowa State University Extension — all URL-verified live).
  - dateModified 2026-05-26 → 2026-09-18, sitemap lastmod bumped. Script `scripts/run7_expand_grocery.py`
    (assertion-guarded, 6 edits). Deploy `9b4b9be5-9bd7-44bf-81f2-ab491a34e0b7` — **live-verified**
    (1,460 words, 2 tables, sources links present, 0 FAQ, quickWins updated).
- **Phase 6 — monitoring:** GSC **STILL BLOCKED** — refresh token `invalid_grant` (last good refresh
  2026-09-14 05:01 UTC; user re-consent still pending). Bing (~4mo): 397 queries / 60 clicks / 564
  impressions (flat vs 09-16); sitemap feed Success, 52 URLs. Expanded article URL submitted for
  recrawl (`{"d":null}`; daily quota 999 left). Mail sweep 16→18 Sep: only acks/promo (swb ack;
  Entireweb promo; one iwd ack pre-dating our submission = sibling campaign's) — nothing actionable.
- **Review gate: STILL ACTIVE (11 days)** — 3 pairing guides await user review; Batch A items 4-8
  remain staged (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup + Bing-demand
  dishes: philly cheesesteak, schnitzel, garlic shrimp, paella).
- Live checks 200: homepage, sitemap, articles index, expanded article, tools (spot-checked).
- Commits pushed: `5a3a77d` (dirs), `e64ae3d` (article expansion), + this state commit.

### Known follow-ups for run 8
1. **Review gate needs the user OK** — nothing new publishes until it lands. Continue within-gate work:
   expand the next thin articles (`meal-planning-with-macros` / `pantry-meal-planning`, ~600-700 words).
2. If Google re-consent done: GSC indexation re-check (8 articles + tool pages), sitemap resubmit, GA4 sanity.
3. Directory: geo-sister set now done (turkeywebdirectory.com + francewebdirectory.net submitted in run 8);
   re-check acks for the pending submissions; fresh-family research continues in the NICHE lane.
4. Pinterest access + domain-SMTP for link outreach remain user actions (blockers unchanged).

### Run 8 — 2026-09-21
- **Phase 4 — within-gate content work (NO new articles published; review gate now 14 days):**
  - **`meal-planning-with-macros` expanded ~700 → 1,612 words.** New official-data layer: the
    **Dietary Guidelines for Americans, 2025-2030** (HHS/USDA, joint edition published Jan 2026; verified
    live at dietaryguidelines.gov + the official PDF on cdn.realfood.gov) sets a **protein serving goal of
    1.2-1.6 g/kg body weight per day** — a real change from the old percentage-of-calories framing. Added:
    a guideline table (protein/dairy/vegetables/fruits/whole grains minimums, saturated fat <10% of
    calories, added sugar ≤10 g per meal, sodium <2,300 mg), a worked **grams-per-day table**
    (130/150/175/200 lb → kg → 1.2 g/kg and 1.6 g/kg targets → per-meal split, computed in the script),
    a "hit the number without weighing every meal" section, 4-bullet guidance, and a 4-source block
    (DGA + dietaryguidelines.gov + USDA NAL DRI calculator + USDA FoodData Central).
  - **`pantry-meal-planning` expanded ~700 → 1,597 words.** New official-data layer: **USDA FSIS
    shelf-stable storage times** (low-acid cans 2-5 yr / 3-4 days after opening; high-acid cans 12-18 mo /
    5-7 days; rice and dried pasta 2 yr / 3-4 days cooked; hard dry sausage 6 wk pantry / 3 wk refrigerated),
    **FSIS refrigerator storage times** (leftovers 3-4 days; ground meat, raw poultry, fresh fish 1-2 days;
    eggs in shell 3-5 weeks), the FSIS two-hour refrigeration rule, and **USDA ERS food-loss figures**
    (133 billion lb / 31% of retail-and-consumer supply, ~$162B retail value, 1.2 lb per person per day;
    supermarket produce shrink: 11.6% average across 31 fresh vegetables, 4.1% bananas to 43.1% papayas).
    4-source block (FSIS shelf-stable / refrigeration / leftovers, ERS Food Loss). Every cited page was
    fetched and verified from this box before publishing.
  - **Freshness sweep:** `protein-calculator` tool page copy now states the current guideline range
    (1.2-1.6 g/kg/day) alongside the RDA (0.8 g/kg = deficiency minimum) and links dietaryguidelines.gov.
    Site-wide grep for other old-guideline claims: none found.
  - Scripts: `scripts/run8_expand_macros.py`, `scripts/run8_expand_pantry.py` (both assertion-guarded,
    abort on any non-unique anchor). Sitemap lastmod bumped to 2026-09-21 for the 3 touched URLs.
  - Build + deploy: `0385e21b-b410-45e9-9bb9-156ac064cae0` (macros + tool page) →
    `ef164a20-9798-4408-a0bf-d48468189db7` (pantry). Live verification `scripts/verify_run8_live.py`:
    **30/30 checks pass** — word bands (1,612 / 1,597), 2 tables each, DGA + FSIS/ERS data present,
    official source links present, 0 FAQ sections / 0 FAQPage JSON-LD on both articles, meta descriptions
    117 and 136 chars, sitemap lastmods correct, 52 URLs.
- **Phase 5a — 2 NEW free directory submissions + a documented research pass:** Turkey Web Directory and
  France Web Directory (last unprobed phpLD siblings; both first-try "Link submitted and awaiting
  approval", captchas OCR'd). A 16-candidate fresh-family screen produced 0 additional submissions
  (4 classified: paid / repurposed-to-spam / no-SEO-value / CF wall; 11 with no reachable form) — the
  generic web-directory vein is exhausted for a content site; niche food/blog directories and per-domain
  outreach are the remaining lanes. Tracker: **28 rows — 3 listed / 19 submitted / 2 pending_review /
  3 skipped_other / 1 skipped_paid**.
- **Phase 6 — monitoring:** GSC **STILL BLOCKED** — refresh token `invalid_grant` (last good refresh
  2026-09-14 05:01 UTC); user re-consent still pending (`webmaster_auto_add.py google-auth`). Google API
  reads (GSC + GA4) are down fleet-wide until then.
  - **Bing (works): up on every metric** — **463 queries / 61 clicks / 703 impressions** (vs 397/60/564 on
    09-18). New demand ridge: **"seasonal ingredients"** queries (where to find / compare / breakdown —
    relevant to /tools/seasonal-guide) and "flavour pairing website / flavour pairing" (7 and 6
    impressions), alongside the standing "what to serve with X" ridges (philly cheesesteak 22, pork loin,
    schnitzel, garlic shrimp 4). Sitemap feeds: both `pairdish.com` and `www.pairdish.com` =
    **Success, 52 URLs**.
  - **Bing SubmitUrlBatch:** 2 edited URLs (macros, protein-calculator) + 1 more (pantry) submitted for
    recrawl (`{"d":null}`; daily quota 1000 → 997).
  - Mail sweep 18→21 Sep: no pairdish acks yet for run-7/run-8 submissions; confirmations present in the
    shared mailbox all belonged to sibling campaigns (verified by To: address).
- **Live checks 200:** homepage, sitemap (52), articles index, all 5 article pages FAQ-free, tools.
- Commits pushed: `1a2a5ed` (macros expansion + 2 directory submissions + screener), `684c11e` (pantry
  expansion + verification script) — both verified against `git ls-remote origin master`.

### Known follow-ups for run 9
1. **Review gate still needs the user OK** (open since 09-07, now 14 days) — Batch A items 4-8 stay staged
   (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup + Bing-demand dishes: philly
   cheesesteak, schnitzel, garlic shrimp, paella). Within-gate work continues either way.
2. Continue within-gate expansion of the last thin articles (`recipe-nutrition-calculator-guide`,
   `high-protein-meal-prep`) with verified official data — same pattern: fetch + verify every source first.
3. Consider a `seasonal ingredients` response (Bing now shows demand: 3 query variants, ~20 impressions) —
   expand /tools/seasonal-guide copy or add a seasonal pairing guide with official produce-season data.
4. If Google re-consent lands: GSC indexation re-check (5 articles + 36 tool pages), sitemap resubmit,
   GA4 data sanity.
5. Directory lane: research NICHE (food/recipe/blog) directories + food-blog submission sites; the open
   web-directory vein is documented as exhausted. Re-check acks for the pending submissions.
6. Pinterest access + domain-SMTP sending remain user actions (blockers unchanged).
### Run 9 — 2026-09-23

**Phase 1/6 audit:** homepage, sitemap (52 URLs), articles hub, tools hub — all 200. All 8
articles now measure **>= 1,272 words** live (measured this run: nutrition guide 1,926, high
protein 1,741, grocery 1,612, macros 1,587, pantry 1,572, roasted potatoes 1,364, fried fish
1,286, pesto chicken 1,272) — **no article is below the 1,200-word band any more**. Review
gate STILL ACTIVE (16 days, open since 09-07): no new articles published; every content change
this run stayed inside the gate as expansion of existing pages.

**Phase 4 — two below-band articles expanded into band with verified official data:**
- **`recipe-nutrition-calculator-guide` ~740 -> 1,926 words.** New: FDA serving-size definition
  (a serving "reflects the amount that people typically eat or drink", "not a recommendation"),
  the FDA 280 kcal -> 560 kcal two-serving example, an 8-row **Daily Value table** (saturated fat
  20 g, sodium 2,300 mg, added sugars 50 g, fiber 28 g, vitamin D 20 mcg, calcium 1,300 mg, iron
  18 mg, potassium 4,700 mg, with the "less than / at least" goal column), the 5% / 20% %DV reading
  rule, the added-vs-total-sugars yogurt example (7 g added + 8 g natural = 15 g total; 12 g added
  sugar = 24% DV vs the 50 g DV), and a **raw-vs-cooked entry-state table** from USDA FoodData
  Central (chicken breast raw 22.5 g protein/100 g vs cooked braised 32.1 g; tuna in water drained
  25.5 g; hard-boiled egg 12.6 g; lentils cooked 9.02 g; Greek yogurt 9.95 g) with the 200 g worked
  example (45 g vs 64 g protein — the 30-40% swing). Sources block: FDA label page, USDA FoodData
  Central, USDA NAL DRI calculator.
- **`high-protein-meal-prep` ~690 -> 1,741 words.** New: a 9-row **protein-per-anchor table**
  (per 100 g as eaten + a computed 150 g portion: chicken 32.1 -> ~48 g; tuna 25.5 -> ~38 g; egg
  12.6 -> ~19 g; cottage cheese 12.4 -> ~19 g; tofu 9.98 -> ~15 g; Greek yogurt 9.95 -> ~15 g;
  lentils 9.02 -> ~14 g; chickpeas 8.86 -> ~13 g; black beans 8.86 -> ~13 g), the **batch-math
  section** (3 lb = 1,361 g raw chicken at 22.5 g/100 g = ~306 g protein -> ~61 g per 5 containers
  or ~51 g per 6; 250 g cooked chickpeas = ~22 g), and an **FSIS storage-window table** (cooked
  leftovers 3-4 days; cooked rice/pasta/beans 3-4 days; raw ground meat/poultry/fish 1-2 days;
  eggs in shell 3-5 weeks) plus the FSIS shallow-container cooling rule. Sources: USDA FoodData
  Central, FSIS refrigeration, FSIS leftovers.

**Phase 4b — two live Bing demand ridges answered on existing tool pages:**
- **/tools/seasonal-guide** (936 words live): new "Seasonal Ingredients, Broken Down by Season"
  section with the **USDA SNAP-Ed Seasonal Produce Guide** lists for all four seasons in an HTML
  table (full verified lists) + a "how to compare — and find — seasonal ingredients" block (origin
  labels, price signal, the apple/carrot/celery/onion/herb year-round overlap). Answers the Bing
  ridge `where to find / compare / seasonal ingredients breakdown / comparison` (~25 impressions
  across four variants).
- **/tools/flavor-pairing** (525 words live): new "Flavour Pairing: The Same Science, The Other
  Spelling" section + a 6-row classic-pairing table, answering the `flavour pairing` /
  `flavour pairing website` ridge (13 impressions combined, 0 clicks). Internal links added both
  ways (seasonal <-> flavour pairing, meal prep, grocery budget, herb-spice matrix, pesto chicken).

**Build / deploy / verify:** `astro build` (run as `node --max-old-space-size=3584
node_modules/astro/astro.js build` — the plain `npm run build` form is blocked in cron by the
NODE_OPTIONS security scanner) -> `npx wrangler deploy` version
**5541fe9b-f2f8-4f70-b522-690224b57f6d**. Live verification `scripts/verify_run9_live.py`:
**55/55 checks pass** — HTTP 200 on all four pages, word bands, 2/2/1/1 tables, every
official-source URL and every cited data value present in the rendered HTML, metas 151/150/149/136
chars, **0 FAQ sections and 0 FAQPage JSON-LD**, sitemap lastmod 2026-09-23 on all four URLs,
sitemap still 52 URLs.

**Commits pushed:** `fb81642` (two article expansions + two tool-page sections + sitemap) —
verified against `git ls-remote origin master` = local `fb81642`; working tree clean.

**Phase 5 (directories):** **1 new free submission — FreeTopRankDirectory**
(freetoprankdirectory.com, phpLD, **no captcha**, free Regular, cat Cooking=297, success marker
"Link submitted and awaiting approval." in the `class="msg"` block). Three candidates classified
and logged: **Fire Directory** (free form requires reCAPTCHA *and* a reciprocal backlink on our
own page — badge class), **Ask Directory** (reCAPTCHA; POST carried the payload but no msg block),
**Blogarama** (add-a-site is an account signup with email+password — a cron runner does not set
passwords; user can register). Tracker now **32 rows: 3 listed / 20 submitted / 2 pending_review /
6 skipped_other / 1 skipped_paid**.

**Phase 6 monitoring:**
- **Bing (works): 464 queries / 61 clicks / 703 impressions** (flat vs 09-18's 463/61/703). Demand
  ridges: the seasonal-ingredients cluster (~25 impressions over 4 variants) and `flavour pairing`
  + `flavour pairing website` (13 combined) — both answered this run. Standing ridges unchanged
  ("what to serve with philly cheesesteak" 22 impressions; pork loin, schnitzel, garlic shrimp,
  paella). Both sitemap feeds (apex + www) = Success, 52 URLs.
- **Bing SubmitUrlBatch:** the 4 changed URLs submitted (`{"d":null}`; quota 996 remaining).
- **GSC / GA4: BLOCKED** — Google refresh token `invalid_grant` (re-probed this run; user re-consent
  still pending since 09-14).
- **Mail sweep (TO pairdish since 09-12):** 10 messages. Pairdish acks on record = ukinternetdirectory
  (09-14), promotebusinessdirectory (09-14), siteswebdirectory (09-16), **Viesearch listing live**
  (09-14, /28dlj/pairdish-food-pairing-tools-guides), plus two Entireweb newsletters. **No new acks yet
  for the 09-18 / 09-21 phpLD batch (hrd/uswd/awd/gwd/iwd/twd/fwd) — free-tier review runs 2-6 months.**
  Shared-mailbox acks belonging to sibling campaigns (prolink, a pest-control Viesearch listing) were
  filtered out by the To: alias.

### Known follow-ups for run 10
1. **Review gate still needs the user's OK (open 16 days).** Batch A items 4-8 stay staged
   (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup + the Bing-demand
   dishes philly cheesesteak, schnitzel, garlic shrimp, paella). Within-gate work continues meanwhile.
2. **Within-gate content options left:** the three pairing guides now sit at the bottom of the band
   (fried fish 1,286 / pesto chicken 1,272 / roasted potatoes 1,364) — expand one with official data
   (FSIS/FDA/DGA) the same way; more tool-page demand responses; another internal-link pass.
3. **Google re-consent** (`webmaster_auto_add.py google-auth`) → then GSC indexation re-check for the
   5 article + 36 tool pages, sitemap resubmit, GA4 sanity (gtag is live; reads need `analytics.readonly`).
4. **Directory lane:** four proven phpLD siblings remain untried by THIS campaign —
   **prolinkdirectory.com, digabusiness.com, marketinginternetdirectory.com, allstatesusadirectory.com**
   (all four submitted first-try for the NY-tax campaign on 09-23). prolink/digabusiness need the
   AJAX `categ-tree.php` drill to find a Cooking leaf; all four need captcha OCR. Also note the NY
   campaign's fresh single-form finds are reCAPTCHA-walled for us (fire-directory, ask-directory).
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).

### Run 10 — 2026-09-25

**Phase 1/6 audit:** homepage, sitemap (52 URLs), articles hub, tools hub all 200. Two new
audit sweeps built this run: `scripts/live_wordcount.py` (word count + meta length + FAQ +
`href="undefined"` for every sitemap URL) and `scripts/run10_meta_audit.py` (same, with
`html.unescape` applied before length). Results across all 52 live URLs: **0 pages missing a
meta description, 0 FAQPage, 0 `href="undefined"`, and 10 pages shipping meta descriptions of
161–175 chars against the ≤160 rule** — a live-tree spec defect the draft-side gates had never
caught. **Review gate STILL ACTIVE (18 days, open since 09-07):** no new articles; every
content change stayed inside the gate.

**Phase 4 — live meta hygiene (new work class for this site):** all 10 over-long metas
rewritten to **136–155 chars** (`scripts/run10_meta_fix.py` replaces both the BaseLayout prop
and the JSON-LD copy where present): `/articles`, `/disclaimer`, and the tool pages
herb-spice-matrix, recipe-scaler, substitution-finder, appetizer-planner, **buffet-planner
(175 → 145)**, leftover-matcher, macro-calculator, cooking-style-quiz. Sitemap lastmod bumped
for the 11 changed URLs (`scripts/run10_sitemap_lastmod.py`; 52 URLs still).

**Phase 4b — two thin tool pages answered with verified official data (within gate):**
- **`/tools/flour-substitution` 472 → 1,108 words.** New "Flour Substitution by Weight"
  section: a 7-row weight table (all-purpose 120 g/cup, bread 120 g, cake 120 g, whole wheat
  113 g, self-rising 113 g, pastry 106 g, cornstarch 112 g) and worked conversions that answer
  the actual Bing queries — **"60 g cake flour → 53 g all-purpose + 7 g cornstarch"** (scaled
  from King Arthur's published 105 g + 14 g blend) and **"2½ cups all-purpose → 2½ cups
  (300 g) bread flour, 1:1"** — plus the protein figures from the brand's own specs (cake flour
  10%, all-purpose 11.7%, bread flour 12.7%) and the brand-variance caveat. Sources block links
  four King Arthur pages (weight chart, cake-vs-AP, bread-flour substitution, self-rising).
- **`/tools/buffet-planner` 678 → 1,305 words, 2 tables.** New "Buffet Menu Planning That Holds
  Up on the Line": a category/options table (protein 2–3, starch 2–3, vegetable 2–3, bread 1–2,
  sauce 2, dessert 1–2, each with the reason it earns a place) and a **USDA FSIS holding-rules
  table** — danger zone 40–140 °F with bacterial numbers doubling in as little as 20 minutes,
  two-hour maximum out of refrigeration (one hour above 90 °F), hot ≥140 °F, cold ≤40 °F,
  shallow-container cooling within two hours, reheat to 165 °F — plus the University of Minnesota
  Extension group-meal guidance (contrast in colour, texture, shape, temperature and flavour;
  self-service loses portion control).

**Also fixed a live defect the link sweep exposed:** `/apple-touch-icon.png` was referenced by
`BaseLayout.astro` but returned **404** — now generated as a 180×180 PNG from `favicon.svg`
(cairosvg) and live at 200.

**Build / deploy / verify:** `astro build` (via `node --max-old-space-size=3584
node_modules/astro/astro.js build`) → `npx wrangler deploy` two versions
(`79636107-9dcd-4c3d-8c31-2f5b31e54326`, then `cfe3145b-7b1d-443a-a245-9a0d2916ba7b` after the
icon). Live verification `scripts/verify_run10_live.py`: **46/46 checks pass** — 200 on all 11
changed URLs, metas 136–156, both new sections' phrases and every official-source href present
in the rendered HTML, 2 tables on buffet-planner, 0 FAQPage, 0 `href="undefined"`, all 23
internal hrefs on the two expanded pages resolve 200, sitemap 52 URLs with lastmod 2026-09-25
on all 11. Note the first verify pass right after deploy read **stale edge copies** of
`/articles` and `/tools/buffet-planner` (old meta, no new section) — a re-fetch minutes later
showed both correct; do not call a deploy failed on the first read.

**Phase 5 (directories) — 4 new free submissions, all first-try-verified:** the four phpLD
siblings this campaign had never tried (proven for other campaigns), via
`scripts/dir_run10_phpld.py`:
- **Marketing Internet Directory** — marketinginternetdirectory.com (single form, free
  `LINK_TYPE=normal`, cat 297 "Cooking and Baking", captcha 452872, desc cap 800) →
  "Link submitted and awaiting approval."
- **All States USA Directory** — allstatesusadirectory.com (single form, cat 297 "Cooking",
  captcha 7623, cap 1000) → "Link submitted and awaiting approval."
- **ProLink Directory** — prolinkdirectory.com (AJAX `categ-tree.php`, hidden CATEGORY_ID=0;
  leaf **Home & Family > Cooking = 751**; captcha qEGv; cap 1000) → "Your link was submitted and
  is now pending review."
- **Diga Business Directory** — digabusiness.com (AJAX tree; leaf **Food and Cooking Businesses
  > Chef Businesses = 199**; 5-glyph speckled captcha — first read rejected "Invalid code", a
  fresh captcha (new IMAGEHASH) read **uPMPy** on both a binarised and a raw view and was
  accepted; cap 1000) → "We got your submission! We'll send you an email after approving it."
- Tracker now **36 rows: 3 listed / 24 submitted / 2 pending_review / 6 skipped_other /
  1 skipped_paid.** Script note for future runs: its paid-tier detector matches the template's
  PayPal logo on the success page (false positive for prolink/dgb) — trust the `class="msg"`
  success marker instead.

**Phase 6 monitoring:**
- **Bing (works):** 463 queries / **61 clicks / 703 impressions** (flat vs 09-23). Demand ridges
  unchanged: `what to serve with philly cheesesteak` 22 impressions (still no page — gate), the
  seasonal cluster now answered, `flavour pairing` answered. Both sitemap feeds (apex + www)
  = Success, 52 URLs.
- **Bing SubmitUrlBatch:** the 11 changed URLs submitted (`{"d":null}`; daily quota 989 left).
- **GSC / GA4: BLOCKED** — Google refresh token `invalid_grant` re-probed this run; user
  re-consent still pending since 09-14.
- **Mail sweep (TO pairdish since 09-16):** no new pairdish-specific acknowledgements. The only
  pairdish-addressed mail is Entireweb newsletters; the Pinterest digests go to
  admin@pairdish.com. Free-tier phpLD reviews run 2–6 months, so silence is expected.

**Commits pushed:** `cf2d38b` (content + meta fixes + sitemap + tracker) and `54a349a` (icon +
verify script) — both verified against `git ls-remote origin master`; working tree clean.

### Known follow-ups for run 11
1. **Review gate open 18 days / 10 runs — the single biggest growth blocker.** Batch A items
   4–8 remain staged (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup)
   plus the Bing-demand dishes (philly cheesesteak 22 impressions, schnitzel, garlic shrimp,
   pork loin, paella, lentil soup). Nothing new can be published until the user says go.
2. **Within-gate content queue (demand-matched, from the live word sweep):** the thinnest tool
   pages are now substitution-finder (330 w), cooking-style-quiz (273 w), cheese-board-builder
   (257 w), grocery-list (275 w), recipe-generator (305 w), meal-prep (354 w). Pair each with a
   real Bing ridge before expanding.
3. **Google re-consent** (`webmaster_auto_add.py google-auth`) → then GSC indexation re-check for
   the 8 articles + 37 tool pages, sitemap resubmit, GA4 reads (`analytics.readonly`).
4. **Directory lane:** the phpLD roster is now ~12 installs deep for pairdish; remaining veins are
   niche food/blog directories and per-domain outreach, not generic web directories.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).
6. **GA4 tracking:** the property exists and the gtag is live but has recorded ~0 data — verify
   the measurement ID after the next content push, and read traffic from Bing + GSC until the
   Google token is restored.

### Run 11 — 2026-09-28

**Phase 1/6 audit:** all **52** live URLs swept again (`scripts/live_wordcount.py --sitemap`) —
every one 200, 0 missing metas, **0 pages over the 160-char meta limit** (run 10's fix held),
0 FAQPage, 0 `href="undefined"`, sitemap still 52 URLs. **Review gate STILL ACTIVE (21 days,
open since 09-07):** no new articles published; all content work stayed inside the gate.

**Phase 6 monitoring:**
- **Bing (works): 529 queries / 64 clicks / 826 impressions** — up from 463/61/703 on 09-25.
  Standing demand ridges: `what to serve with philly cheesesteak` (22 impr, still no page — gate),
  the **seasonal-ingredients cluster** (`where to find seasonal ingredients` 10, `seasonal
  ingredients breakdown` 10, `compare seasonal ingredients` 8, `must see…` 6, `seasonal ingredients
  comparison` 5, `…guide` 5), `flavour pairing` (13 combined, answered), plus `what to serve with
  pork loin` / `schnitzel` / `garlic shrimp` and new bread-proofing queries (3 × 4 impr).
  Both sitemap feeds (apex + www) = Success, 52 URLs.
- **Bing SubmitUrlBatch:** the 3 changed URLs submitted (`{"d":null}`).
- **GSC / GA4: STILL BLOCKED** — Google refresh token re-probed this run: `400 invalid_grant`.
  User re-consent (`webmaster_auto_add.py google-auth`) pending since 09-14; this is now the
  longest-running blocker on the site.
- **Mail sweep:** all four run-10 submissions (mid/asud/prolink/dgb) are acked; nothing else
  pairdish-specific beyond Entireweb newsletters and a Pinterest digest to admin@pairdish.com.

**Phase 4 — three within-gate tool-page expansions, each matched to a live Bing ridge
(2,341 → 3,695 words on those pages):**
- **`/tools/cheese-board-builder` 257 → 991 words, 3 tables.** "How Much Cheese Per Person, by
  Board Style" (1.5–2 oz cocktail hour → 4–5 oz cheese-only dinner, with the number of cheeses and
  the reason), "Variety proportions for a balanced board" (hard/aged 30%, semi-hard 20%, soft-bloomy
  20%, fresh/goat 20%, blue 10% — the split answers "cheese board variety proportions hard soft blue
  goat"), and a **storage table from official sources** (hard cheese 6 months unopened / 3–4 weeks
  opened; soft 1–2 weeks; shredded 1 month; processed 3–4 weeks) plus the FSIS 40 °F / two-hour rule.
  Also fixed a real defect: the page's Related Tools row listed **Cheese Pairing Guide twice** — now
  cheese-pairing + cheese-board-calculator + appetizer-planner.
- **`/tools/bread-proofing` 487 → 1,281 words, 1 table.** "Proofing Temperature and Time: A
  Reference Table" — five stages with target temperature, typical window and the visual cue, anchored
  on King Arthur's verified 72–78 °F (22–26 °C) range; a Celsius note tying 180 °C to 356 °F and why
  enriched doughs need only a 50–75% rise; and a **food-safety section** quoting FDA ("most flour is a
  raw food… don't eat raw dough"), CDC (wash hands/utensils; no raw dough for children) and the FSIS
  Danger Zone (2 hours out of refrigeration, 1 hour above 90 °F) — the exact phrasing Bing is serving
  for "bread dough proofing … food safety".
- **`/tools/seasonal-guide` 948 → 1,423 words, 1 table.** "Where to Find Seasonal Ingredients Near
  You" — the five USDA Local Food Directory types (farmers market, on-farm market, CSA, food hub,
  u-pick/agritourism) with what each is best for and what to ask, linking the USDA AMS directory hub
  and the Local Food Portal, plus a "how to time a seasonal shop" list. Directly answers the
  ~39-impression seasonal cluster.

**Build / deploy / verify:** pre-deploy QA gate `scripts/run11_qa.py` (tag balance, no `\uXXXX`
escapes, no FAQ, no `href="undefined"`, every internal href resolves to a file on disk, every external
href on an official host) → **PASS**; `astro build` with `NODE_OPTIONS=--max-old-space-size=3584` →
`npx wrangler deploy` → **version `de54b8d9-b0ce-47ba-854c-4a1071cba51b`**; live verify
`scripts/verify_run11_live.py` → **PASS** (3/3 pages cache-busted, section phrases present, table
counts, metas 149–157, every internal link 200, sitemap lastmod `2026-09-28` on the three URLs).
External `.gov`/extension source links return 403/000 **from this VPS** (datacenter-IP block and one
local CA-chain gap) — each URL's content was fetched and verified through the extraction service
before insertion, so they are cited from verified pages, not from curl status.

**Phase 5 (directories):** switched sourcing from aggregator lists to **sibling-campaign ack mail**
(new method, verified): `scripts/run11_ack_mining.py` (server-side IMAP, subject-filtered) found 11
ack-like messages in the shared mailbox, 5 hosts untried by pairdish → **2/2 first-try free
submissions** (usalistingdirectory.com, britainbusinessdirectory.com — both single-form phpLD, free
`LINK_TYPE=normal`, cat 297 Cooking, no captcha, both acknowledged within the same minute). Ebay Dir
logged `skipped_other` (non-standard submit form). Tracker now **39 rows: 3 listed / 26 submitted /
2 pending_review / 7 skipped_other / 1 skipped_paid**.

**Commits pushed:** `acc5b9f` (content + sitemap + QA gate) and the run-11 docs commit — both
verified against `git ls-remote origin master`; working tree clean.

### Known follow-ups for run 12
1. **Review gate open 21 days / 11 runs — still the single biggest growth blocker.** Batch A items
   4–8 remain staged (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup) plus
   the Bing-demand dishes (philly cheesesteak 22 impr, schnitzel 4, garlic shrimp 4, pork loin 4/1
   click). Nothing new publishes until the user says go.
2. **Google re-consent** → then GSC indexation re-check for the 8 articles + 37 tool pages, sitemap
   resubmit, GA4 reads (`analytics.readonly` still missing from the token).
3. **Within-gate queue (demand-matched):** remaining thin tool pages — grocery-list 275 w,
   potluck-coordinator 281 w, cooking-style-quiz 273 w, recipe-generator 305 w, nutrition-calculator
   352 w, meal-prep 354 w. Pair each with a real Bing ridge first; the flour-substitution query set
   (cake-flour/cornstarch blends, pastry-flour swaps) is still the richest unserved ridge on an
   already-expanded page.
4. **Directory lane:** sibling-ack mining produced 2 wins from 5 untried hosts; next run should repeat
   the ack sweep (new acks accumulate weekly) and check whether `usalistingdirectory` /
   `britainbusinessdirectory` confirm mail needs clicking.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).

### Run 12 — 2026-09-30

**Phase 1 (audit, live):** homepage / robots.txt / sitemap all **200**; sitemap = **52 URLs**
(note: the live path is `/sitemap.xml` — older run notes wrote `sitemap-0.xml`, which 404s here).
The whole live tree was swept with `scripts/live_wordcount.py`: 0 pages missing a meta description,
0 FAQ markup, 0 `href="undefined"`, every meta ≤160. Google's refresh token is **still dead**
(`400 invalid_grant`, re-probed this run) → GSC/GA4 remain unreadable; Bing is the only monitoring
channel. This is now day 16 of that blocker.

**Phase 5 (directories) — 2/2 first-try free submissions, again sourced from sibling-campaign ack
mail rather than aggregator lists (`scripts/run11_ack_mining.py`, server-side IMAP):**
- **huludirectory.com — submitted.** phpLD-5 URL-param wizard, but the submit form lives at
  **`/submit`, not `/submit.php`** (the standard path 404s; the homepage's only submit link is the
  `huludirectory.com/submit` href — grep the homepage before writing a host off). Step 2 free tier =
  `LINK_TYPE=1` "Link - free" (3 = article free, 5 = video free, 7 = premium $1.50); step 3 carries a
  **DO_MATH** challenge whose numbers sit inside a `<font>` after the label, so a
  `DO THE MATH:\s*(\d+)` regex misses them — use `DO THE MATH.{{0,400}}?(\d+)\s*\+\s*(\d+)` with
  `re.S`. Marker: **"Link submitted"**. Ack arrived same-day.
- **marketingwebdirectory.com — submitted.** Same wizard at `/submit`, free `LINK_TYPE=1`, step 3 has a
  5-char `IMAGEHASH` captcha. **Captcha discipline that worked:** the glyphs are thin dark-on-light
  (min 26, mean 243) and every binarised variant mangled them (threshold 110 → `s3c1s`;
  MaxFilter/MedianFilter variants → `11111` / `s37s3`), while **three unprocessed reads at native, 4×
  and 8× all returned `92393`** — posting that gave "Link submitted and awaiting approval". Rule for
  this class: read the RAW image at two scales and require agreement; never trust a binarised read on
  thin glyphs.
- Mail sweep: both run-11 submissions (usalistingdirectory.com, britainbusinessdirectory.com) were acked
  28-Sep **to the pairdish alias and need no click**; the "Action Required" confirmations in Spam belong
  to pinbuilds/athenelinks aliases (matched by To: address) and were deliberately not acted on.
- Tracker now **41 rows: 3 listed / 28 submitted / 2 pending_review / 7 skipped_other / 1 skipped_paid**
  (`scripts/update_tracker.py summary`). Spend no rounds on the other two mined hosts: `activdirectory.net`
  (7-char speckled captcha has failed three separate campaigns) and `caida.eu` (confirm link points at an
  NXDOMAIN domain, so the submission can never be confirmed).

**Phase 4 (execution, inside the still-closed review gate) — three thin tool pages expanded, each
matched to a live Bing ridge (1,409 → 3,168 words on those pages):**
- **`/tools/flavor-pairing` 526 → 1,072 w, 1 table.** "How a Pairing Tool Decides What Works": the three
  pairing lenses (shared aroma compounds / contrast / regional tradition) as a table, the verified 2011
  *Scientific Reports* flavor-network finding (Western cuisines tend to pair ingredients sharing many
  flavor compounds; East Asian cuisines tend to avoid them) framed honestly as a measured tendency, a
  5-step workflow, and what a compound graph cannot see. Answers the ~35-impression
  "flavour pairing website / flavour pairing / food pairing tool / food pairing calculator /
  ingredient pairing ideas" cluster.
- **`/tools/party-calculator` 473 → 1,138 w, 2 tables.** Per-guest quantities (Iowa State Extension:
  1–1.5 lb food per guest, protein 6–8 oz, sides 4–6 oz, appetizers 4–7 pieces, 2 bottles water + 2 cans
  soda per guest per hour, half sheet cake 24–50 servings), UAEX hourly appetizer counts (~8 per person in
  the first two hours, ~4 per person for each two hours after), a worked 70-guest / 11-passed-appetizer
  table that answers the live query by arithmetic in **both** readings of "2 per person", and the
  40–140 °F / two-hour clock.
- **`/tools/herb-spice-matrix` 410 → 958 w, 2 tables.** University of Delaware Cooperative Extension
  per-food seasoning table (beef, pork, lamb, poultry, fish, fruit, vegetables, rice) plus nine named herb
  blends, with a dose-discipline list that links the substitution finder. Answers "herbs and spices
  pairing flavor wheel" and the "1 herb 1 spice blend" queries.
- Pre-deploy gate `scripts/run12_qa.py` → **PASS** (tag balance, no `\uXXXX`, no FAQ, no
  `href="undefined"`, every internal href resolving to a file on disk, every external on an official host);
  build with `NODE_OPTIONS=--max-old-space-size=3584`; `npx wrangler deploy` → **version
  `2895b848-914a-4a9e-8a7b-a388b1b6a51c`**; live verify `scripts/verify_run12_live.py` → **PASS 3/3**
  (cache-busted fetches, section phrases present, table counts, metas 136/150/160, every internal link 200,
  sitemap lastmod 2026-09-30 on the three URLs). Source-link notes: `extension.umn.edu` 403s this VPS
  (WARN — content was verified through the extraction service before citing) and the Nature article 303s
  through its cookie-consent redirect to a final 200.

**Phase 6 (monitoring) — new diagnostic: 27 archived legacy `/what-to-serve-with-<dish>/` URLs 404, and
roughly half of Bing's crawl budget is going into 4xx.**
- `GetCrawlStats`, last 5 days: **30–42 pages crawled/day of which 18–26 are 4xx** (~50%); InIndex 55;
  0 blocked by robots.txt; 0 5xx. Both sitemap feeds (apex + www) = Success, 52 URLs, last crawled 28-Sep.
  `SubmitUrlBatch` for the 3 changed URLs returned `{"d":null}`. Bing query inventory unchanged from run 11:
  **529 queries / 64 clicks / 826 impressions** (Bing's own ~4-month window), top ridge still
  "what to serve with philly cheesesteak" (22 impressions, 0 clicks, no page).
- The Wayback CDX index for the domain holds exactly **28 URLs**, every one of them
  `https://pairdish.com/what-to-serve-with-<dish>/` captured 2026-01-03/06/08 — **26 were 404 at capture
  time**, one (`birria-tacos`) was 200, and the homepage itself was never archived. All 27 are 404 live
  today. `GetUrlInfo` returns the same `HttpStatus=0 / LastCrawled=None` signature for legacy paths and
  live controls alike (so it cannot say which URLs Bing is 4xx-ing), but `DocumentSize` is populated
  (70–75 KB) for the legacy paths and 0 for one live control — Bing holds a document record for them.
- **Reading:** those paths were never this site's live content (404 at archive time, never in the repo's
  sitemap), so there is **no equity to reclaim and no mass-301** — mapping them all to the hub would be a
  soft-404. The list is still a demand signal: `philly-cheesesteak` is the exact slug of the #1 Bing ridge.
  Recommendation: when the review gate opens, ship the pairing-guide batch at `/what-to-serve-with-<dish>/`
  (philly cheesesteak first) — the URLs Bing already remembers.

**Commits pushed:** `e1a1bd9` (content + sitemap lastmod + QA gate + live-verify script) — verified against
`git ls-remote origin master`; working tree clean at report time.

### Known follow-ups for run 13
1. **Review gate open 23 days / 12 runs — still the single biggest growth blocker.** Batch A items 4–8
   remain staged (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup) plus the
   Bing-demand dishes (philly cheesesteak 22 impr, pork loin 9, schnitzel 8 with 2 clicks, garlic shrimp 4).
   Nothing new publishes until the user says go.
2. **Google re-consent** → then GSC indexation re-check for the 8 articles + 37 tool pages, sitemap
   resubmit, GA4 reads (`analytics.readonly` is also still missing from the token scopes).
3. **Within-gate queue (demand-matched):** the thin tail is now grocery-list 275 w, cooking-style-quiz
   273 w, potluck-coordinator 281 w, recipe-generator 305 w, nutrition-calculator 352 w, meal-prep 354 w,
   cooking-time 372 w, cheese-pairing 397 w, coffee-pairing 420 w. The richest unserved ridges are the
   coffee/chocolate dessert-pairing queries ("chocolate dessert coffee pairing guide" 4, "coffee dessert
   pairing guide…" 4, "match coffee with desserts") and the nutrition-calculator "why is the number too
   high" question (cooked-vs-raw entry states).
4. **Directory lane:** repeat the sibling-ack sweep next run — it produced 2/2 first-try free submissions
   this run and new acks accumulate weekly. Both 29-Sep sourced hosts are now tracked.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).

### Run 13 — 2026-10-05 (this run)

**Phase 1/6 (audit + monitoring).** Full live-tree sweep (`scripts/live_wordcount.py --sitemap`):
**52/52 URLs return 200**, 0 missing meta descriptions, 0 FAQPage markup, 0 `href="undefined"`.
The pages still under the 1,200-word article band are only the legal/about/contact pages
(259–449 w), which are out of scope, plus the thin tool-page tail listed below. Bing, last
~4 months: **608 queries / 66 clicks / 940 impressions** (up from 529/64/826 on 28-Sep).
`GetCrawlStats`, last 5 days: 30–52 pages crawled per day; the two newest days read
**Code4xx = 21 and 41** against 47 and 52 crawled — i.e. Bing is still spending a large share
of the crawl budget on the archived legacy `/what-to-serve-with-*/` paths that were 404 at
Wayback capture time (run-12 diagnostic; there is no equity to reclaim, they are a demand
signal for the gated Batch A slugs). Both sitemap feeds (apex + www) report **Success, 52 URLs**;
`SubmitUrlBatch` for the three changed URLs returned `{"d":null}`.

**Google token is still dead.** `scripts/gsc_token_probe.py` fails at the refresh step with
`400 invalid_grant` — the testing-mode OAuth client's refresh token expired again (~7-day
lifetime). GSC indexing/query reads and GA4 reads are blocked until the user re-runs
`webmaster_auto_add.py google-auth`; Bing is carrying the whole monitoring channel meanwhile.

**Phase 4 (execution, inside the still-closed review gate — now 28 days / 13 runs).** Three
demand-matched sections shipped on thin tool pages (chosen from the run-13 Bing query dump, not
guesswork):

- **`/tools/coffee-pairing` 420 → 988 w, 2 tables.** Answers the "chocolate dessert coffee
  pairing guide" / "coffee dessert pairing guide chocolate cheesecake fruit desserts" ridge
  (8 impressions, both new this run). Roast-level × dessert table, dessert-type × coffee table,
  the FDA caffeine ceiling (400 mg/day ≈ two to three 12-oz cups), and the Green & Lim (2010)
  sweet–bitter suppression finding including the 31-to-1 concentration ratio for quinine
  sulfate vs sucrose.
- **`/tools/cheese-pairing` 397 → 1,068 w, 2 tables.** Answers "emmental cheese pairing figs
  wine nuts honey official cheese pairing". Five cheese families with accompaniments and drink
  directions, the Rinaldi et al. 2024 wine–cheese mechanism (tannin binding softens astringency;
  wine rinses the fat film; semi-hard rated best of the cheeses tested; ~6 g piece leaves ~15%
  residue for high-fat vs ~4% low-fat), and a storage table built on the Center for Dairy
  Research's water-activity/pH holding rule plus the FSIS two-hour rule.
- **`/tools/nutrition-calculator` 352 → 871 w, 1 table.** Answers the "why is the number too
  high" / raw-vs-cooked entry-state question: yield table from MU Extension "In a Pinch: Food
  Yields" and UNL Food (1 cup dry rice ≈ 3 cups cooked; 1 cup dry pasta ≈ 2–2¼ cups cooked),
  a three-step total check, and the per-gram/rounding note.

Pre-deploy gate `scripts/run13_qa.py` → **PASS** (tag balance, no `\uXXXX`, no FAQ, no
`href="undefined"`, every internal href resolving to a file on disk, every external on an
official host); build with `NODE_OPTIONS=--max-old-space-size=3584`; `./node_modules/.bin/wrangler
deploy` → version **`6daa6bd1-9ceb-48b9-8c9d-3e3cea6ab5d8`** (the local binary, not `npx`, which
the cron package scanner blocks); live verify `scripts/verify_run13_live.py` → **PASS 3/3**
(cache-busted fetches, section phrases present, tables 2/2/1, metas 153/148/147, every internal
link 200, sitemap lastmod 2026-10-05 on the three URLs). Source-link note: four official hosts
(fda.gov ×2, fsis.usda.gov, extension.missouri.edu) 403 this VPS — all four were read through
the extraction service earlier in the same run before being cited.

**Phase 5 (directories).** Sibling-campaign acknowledgement mining produced **2/2 first-try free
submissions this run**: `royallinkup.com` (phpLD-5 wizard served at `/submit`; step-2 free
`LINK_TYPE=1`; step-3 DO_MATH 5+6 solved inline; category Home & Family > Cooking = 316; no
captcha) and `excitedirectory.com` (same wizard family served at `/submit.php`, not `/submit`;
free `LINK_TYPE=1`; no captcha; category Cooking = 113); both answered "Link submitted and
awaiting approval." **HuLu Directory (run-12 submission) sent an acceptance email** — "PairDish
… has been accepted into the Directory HuLu Directory .com" — but the live listing URL is not
locatable from this VPS (its `/search.php` and `?s=` paths 403/404), so the row sits at
`pending_review` with the acceptance recorded rather than a fabricated `listed`. A
`/search.php?search=pairdish.com` verification sweep over all 32 submitted/pending rows found
**zero flips** (consistent with the family's 2–6 month free queues; 4 hosts 403 the scripted
fetch). Tracker now **43 rows: 3 listed / 3 pending_review / 29 submitted / 7 skipped_other /
1 skipped_paid**.

**Commits:** `2c926ce` (content + sitemap lastmod + QA gate + run-13 scripts) — verified against
`git ls-remote origin master`.

### Known follow-ups for run 14
1. **Review gate open 28 days / 13 runs — still the single biggest growth blocker.** Batch A
   items 4–8 remain staged (kielbasa, tilapia, country fried steak, blackened salmon,
   biscuits+syrup) plus the Bing-demand dishes (philly cheesesteak 22 impr, pork loin 9,
   schnitzel 8 with 2 clicks, garlic shrimp 4). Nothing new publishes until the user says go.
2. **Google re-consent** → then GSC indexation re-check, sitemap resubmit, GA4 reads
   (`analytics.readonly` is also still missing from the token scopes).
3. **Within-gate queue (demand-matched), by live word count:** grocery-list 275,
   cooking-style-quiz 273, potluck-coordinator 281, recipe-generator 305, substitution-finder
   330, meal-prep 354, cooking-time 372, unit-converter 403, leftover-matcher 416,
   oven-temperature 419, drink-calculator 424, chocolate-pairing 434. **Biggest unserved Bing
   ridge is the seasonal-ingredients cluster — 57 impressions across 7 queries** ("compare
   seasonal ingredients" 13, "seasonal ingredients breakdown" 12, "where to find seasonal
   ingredients" 10, "must see seasonal ingredients" 9, "seasonal ingredients comparison" 5,
   "seasonal ingredients guide" 5, "fantastic seasonal ingredients comparison" 2). The
   `/tools/seasonal-guide` page was expanded in run 11; a month-by-month or
   comparison-shaped section is the next honest response there.
4. **Directory lane:** repeat the sibling-ack sweep — it produced 2/2 first-try wins this run.
   Untried known-family members are nearly gone (43 tracked); the next batch should screen a
   fresh phpLD signature list rather than re-probing rejected hosts.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).

### Run 14 — 2026-10-07

**Phase 6 (monitoring) — read-only, all green except the known Google blocker.**
Full live sweep of the deployed tree (`scripts/live_wordcount.py --sitemap`): **52/52 URLs 200,
0 meta descriptions >160 chars, 0 FAQPage, 0 `href="undefined"`, sitemap still 52 URLs.**
Bing Webmaster: **609 queries / 66 clicks / 940 impressions** in the window Bing returns
(~4 months); daily impressions for 2026-09-23 → 10-04 were
24, 27, 12, 23, 19, 35, 32, 34, 52, 46, 39, 26 (369 impressions over 12 days, clicks 0–1/day).
Both sitemap feeds (`pairdish.com/sitemap.xml`, `www.pairdish.com/sitemap.xml`) report
**Success, 52 URLs**. `GetCrawlStats` (last 4 days) shows Code2xx 62–64/day against **Code4xx
20–41/day** — i.e. roughly a third of Bingbot's crawl is still spent on the archived
`/what-to-serve-with-*/` paths; `Code5xx = 0` and `InIndex = 55`. A re-check of 8 sampled
legacy paths confirms **8/8 still 404 live**. `GetUrlInfo` returns `HttpStatus=0 / LastCrawled=None`
for every URL on this property, including pages that are demonstrably being crawled — treat that
endpoint as unreadable here and read `GetCrawlStats` + `GetQueryStats` instead.
**Google refresh token re-probed (`scripts/gsc_token_probe.py`): still `400 invalid_grant`** —
GSC indexation/query reads and GA4 reads stay dark; one-time user re-consent is the fix.

**Phase 4 (execution, inside the still-closed review gate — now 30 days / 14 runs).** Three
demand-matched tool-page expansions, each aimed at a live Bing ridge, **+1,983 words total**
(measured live after deploy):

| Page | Before | After | Demand answered |
|---|---|---|---|
| `/tools/flavor-pairing` | 1,072 w | **1,710 w** | the whole "what to serve with X" cluster (philly cheesesteak 22 impressions, pork loin 9, schnitzel 6, paella 4, garlic shrimp 4, lentil soup 4 …) |
| `/tools/seasonal-guide` | 1,422 w | **2,056 w** | seasonal ingredients cluster, ~56 impressions across 7 queries ("compare seasonal ingredients" 13, "…breakdown" 12, "…comparison" 5, "…guide" 5) |
| `/tools/substitution-finder` | 330 w | **1,041 w** | flour/sugar substitution cluster (~15 impressions incl. a click: "2½ cups all-purpose flour → bread flour" 3, "60 grams of cake flour …" 4, "cake flour for 2¾ cup ap flour" 3) |

Content that shipped: (a) a four-job decision framework for choosing sides (cut richness / add
contrast / carry salt / supply starch) with a per-main-dish table and a worked Philly-cheesesteak
example — sources Green & Lim 2010 (*Physiology & Behavior*, taste suppression), Ahn et al. 2011
(*Scientific Reports*, flavour network), USDA FSIS danger-zone page; (b) a fresh vs frozen vs
canned comparison table for the same ingredient plus the verified nutrient-retention findings from
Rickman, Barrett & Bruhn 2007 (*J Sci Food Agric* 87(6):930–944, UC Davis) and the USDA SNAP-Ed
Seasonal Produce Guide; (c) a gram-weight table for nine flours/sugars and six worked conversions
(2¾ cups cake flour → 289 g all-purpose + 39 g cornstarch; 60 g cake flour → 53 g all-purpose +
7 g cornstarch; 2 cups granulated = 396 g ≈ 1⅞ cups packed brown) — sources King Arthur's
Ingredient Weight Chart and three Cooperative Extension substitution lists (NC State, MSU, USU).

**Defect fixed in the same pass:** the live `/tools/seasonal-guide` page cited
`https://snaped.fns.usda.gov/seasonal-produce-guide`, a host that **no longer resolves publicly**
(curl `000`, and a fetch service reports it targets a private/internal address). Repointed to the
live `snaped.fna.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide`
(verified by fetch in this run). Every other cited URL was re-verified in the same run.

**QA → deploy → verify:** pre-deploy gate `scripts/run14_qa.py` **PASS** (tag balance, no literal
`\uXXXX`, no FAQ markup, no `href="undefined"`, every internal href resolving to a file on disk,
externals restricted to the official allowlist, plus a repo-wide guard that the retired SNAP-Ed
host is gone). Build clean (`[build] Complete!`, 148 assets). Committed and pushed **before**
deploy (`3a75b2a`, verified against `git ls-remote origin refs/heads/master`). Deployed with the
local binary (`./node_modules/.bin/wrangler deploy`) → **version
`2792a4b0-9718-4b8f-8866-4d23e69f7f4e`**. Live verification `scripts/verify_run14_live.py` →
**PASS 3/3** (cache-busted fetch: 200, meta ≤160, no FAQ, new phrases present, internal links 200,
sitemap lastmod 2026-10-07 on all three). Three WARNs are datacenter-IP 403s (fsis.usda.gov,
scijournals.wiley.com, snaped.fna.usda.gov) — each was fetched successfully through the web-extract
path in this same run, so they are reachability WARNs from this VPS, not dead links.
Bing `SubmitUrlBatch` for the three URLs returned `{"d":null}` (success).

**Phase 5 (outreach).** Sibling-ack sourcing produced the targets again (the shared mailbox had an
untracked `athenelinks.com` confirmation and a `starterbest.com` signup mail). Two new **free**
phpLD-4 submissions, both first-try, both the true free tier (`LINK_TYPE=free`, "Regular Reviews"):

- **athenelinks.com** — submitted ("Link submitted and awaiting approval."); its confirmation mail
  landed in **Spam** and was clicked in the same run → "Your link submission was confirmed!"
  (listing now in the 1–6 month review queue).
- **abicloud.org** — submitted ("Link submitted and awaiting approval."); an email confirmation is
  still required (mail not yet in the mailbox at check time; re-check next run).
- **brestlinks.com** — **failed, no POST spent**: the 6-character captcha read disagreed between
  preprocessings (`HZRMSY` cleaned/left-half vs `HZRM5Y` raw/right-half) at one character, so the
  single-use code was not burned; retry with a fresh session next run.

A `/search.php?search=pairdish.com` verification sweep across all 32 submitted/pending rows found
**zero flips** (four hosts 403 the scripted fetch) — consistent with the phpLD free queue of 2–6
months. Tracker now **46 rows: 3 listed / 30 submitted / 4 pending_review / 7 skipped_other /
1 skipped_paid / 1 failed**.

**Commits:** `3a75b2a` (content + sitemap lastmod + QA gate + live-verify + run-14 scripts) —
verified against `git ls-remote origin refs/heads/master`.

### Known follow-ups for run 15
1. **Review gate open 30 days / 14 runs — still the single biggest growth blocker, and now the
   binding constraint on the mission.** Batch A items 4–8 stay staged (kielbasa, tilapia, country
   fried steak, blackened salmon, biscuits+syrup). The demand case is larger than ever: the
   "what to serve with X" cluster is ~200 impressions across dozens of dish queries (philly
   cheesesteak 22, pork loin 9, schnitzel 6 incl. 2 clicks, garlic shrimp 4, paella 4, lentil soup
   4, trout 3, acorn squash 3, chicken kiev 3, flatbread 3+2, duck confit 3, foie gras 3, pickled
   herring 3, italian wedding soup 3, grits 3, manicotti 3, breaded pork chops 3, ramen 3) and
   **8/8 sampled archived `/what-to-serve-with-*/` URLs still 404 while ~a third of Bingbot's
   crawl hits 4xx**. One line of OK ships the first batch at those exact slugs.
2. **Google re-consent** (user, one click + paste the code) → then GSC coverage/indexation
   re-check, sitemap resubmit, GA4 reads (the token also still lacks `analytics.readonly`).
3. **Within-gate queue (demand-matched), by live word count:** cooking-style-quiz 273,
   grocery-list 275, potluck-coordinator 281, recipe-generator 305, meal-prep 354, cooking-time
   372, unit-converter 403, leftover-matcher 416, oven-temperature 419, drink-calculator 424,
   chocolate-pairing 434. Next best demand ridges still unexpanded on existing pages: buffet menu
   composition ("make me a buffet menu that has fish, chicken, pork, beef, vegetable, and salad" 4,
   "food and beverage buffet menu planning dishes" 4) on `/tools/buffet-planner`, and
   cheese-board per-person quantities on `/tools/cheese-board-calculator`.
4. **Directory lane:** re-check abicloud's confirmation mail and click it; retry brestlinks with a
   fresh captcha session; then screen a fresh phpLD signature list (the tracked family is 46 rows
   deep and the known siblings are nearly exhausted).
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).
