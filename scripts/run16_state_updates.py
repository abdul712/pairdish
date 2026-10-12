#!/usr/bin/env python3
"""Run-16 (2026-10-12) state-file updates: SEO_AUDIT run-16 section + run-17 follow-ups,
CONTENT_PLAN progress entry, OUTREACH run-16 log. Appends only; never rewrites history."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

AUDIT = ROOT / "SEO_AUDIT.md"
PLAN = ROOT / "CONTENT_PLAN.md"
OUT = ROOT / "OUTREACH.md"

AUDIT_BLOCK = """
### Run 16 — 2026-10-12

**Phase 6 (monitoring) — read-only; every local channel green, Google still dark.**

* Live tree: **52/52 sitemap URLs return 200** with real content (`scripts/run16_status_sweep.py`),
  0 empty bodies. Sitemap still 52 URLs. Meta descriptions ≤160, 0 FAQPage, 0 `href="undefined"`.
* **Bing Webmaster: the rolling window FINALLY ADVANCED — 701 queries / 72 clicks / 1,101
  impressions** (previous runs sat frozen at 609/66/940). Top ridges: "what to serve with philly
  cheesesteak" 22, the seasonal-ingredients cluster ~58 across six phrasings, "flavour pairing" +
  "flavour pairing website" 14, "macro balance calculator" 7, "herbs and spices pairing flavor
  wheel" 5.
* `GetCrawlStats` window moved to **2026-10-03 → 10-06**: Code2xx **62–63/day** against Code4xx
  **13–29/day** (down from 20–41 last run — the legacy 404 share is shrinking), Code3xx 3–4,
  Code5xx 0, InIndex 56, CrawledPages 27–88.
* `GetUrlInfo` for six representative URLs: `HttpStatus=0` / `LastCrawled=None` on all of them,
  but **`DocumentSize` 33.7 KB–72.5 KB** — per the standing note, size (not HttpStatus) is the
  usable signal, and Bing holds real content for every one.
* Both sitemap feeds report **Success, 52 URLs**. GSC refresh token re-probed
  (`scripts/gsc_token_probe.py`): **still `400 invalid_grant`** — indexation/query reads and GA4
  stay dark; one user re-consent unblocks them.

**Phase 2/3 (corpus + demand grounding).** No corpus re-query this run: the plan is already
48 pieces deep and the binding constraint is the closed review gate, not the topic list. The
within-gate queue was re-ranked from the fresh Bing window instead (three ridges picked).

**Phase 4 (execution, inside the still-closed review gate — now 35 days / 16 runs).** Three
demand-matched tool-page expansions, **+1,967 live words total** (measured live after deploy),
each carrying official-source data verified in this same run:

| Page | Before | After | Demand answered |
|---|---|---|---|
| `/tools/macro-calculator` | 464 w | **1,140 w** | "macro balance calculator" 7, "macro balancing calculator" 2, "macro balancing formula" 3 |
| `/tools/sugar-substitution` | 517 w | **1,179 w** | maple-syrup→monk-fruit ratio cluster (~6), "liquid stevia versus monk fruit proportions calculator", "replacement mixture percentage formula honey syrup ratio", "clalculate granulated sugar into liquid sugar" |
| `/tools/herb-spice-matrix` | 958 w | **1,587 w** | "herbs and spices pairing flavor wheel" 5, "culinary herb spice pairings … " 3, "mapping of herb flavors" 2, "herbs and spices match up" 1 |

Content that shipped:
* **`/tools/macro-calculator`** — a **calorie-factor table read verbatim from 21 CFR
  101.9(c)(1)(i)**: protein 4, total carbohydrate 4, total fat 9 kcal/g, soluble non-digestible
  carbohydrate 2, and the eight published sugar-alcohol factors (isomalt 2.0, lactitol 2.0,
  xylitol 2.4, maltitol 2.1, sorbitol 2.6, hydrogenated starch hydrolysates 3.0, mannitol 1.6,
  erythritol 0). A four-row percentage→grams table at 2,000 kcal (balanced 25/50/25, high-protein
  40/35/25, low-carb 30/30/40, ketogenic 20/5/75) plus the reconciliation step that shows the
  balanced row summing to 2,004 kcal, and the three reasons totals never land exactly (rounding,
  fibre at half rate, sugar alcohols). Anchored to the **current Dietary Guidelines for
  Americans, 2025–2030**: protein **1.2–1.6 g/kg/day**, **no meal over 10 g of added sugars**,
  saturated fat **≤10% of calories**. Note the edition moved — the site previously cited the
  guidelines only by portal; the 2025–2030 PDF was fetched and read this run.
* **`/tools/sugar-substitution`** — the **Colorado State University Extension** substitution rows
  (honey 1 cup → 1¼ cups sugar + ¼ cup liquid; corn syrup 1 cup → 1 cup sugar + ¼ cup liquid, or
  1 cup honey; maple syrup → 2 cups sugar + 1 cup water boiled with ½ tsp flavouring; molasses
  1 cup → ¾ cup sugar with +5 tbsp liquid, −½ tsp soda, +2 tsp baking powder; brown sugar 1 cup →
  1 cup granulated, or granulated + ¼ cup molasses), a **Utah State University Extension** table of
  calories per gram (sucrose 4, corn syrup 4, honey/agave/maple syrup 3, stevia/monk fruit 0) and
  canning suitability (of the natural liquids only honey is listed as suitable), the **FDA**
  high-intensity-sweetener rule (food-additive regulation unless GRAS, which is where stevia and
  monk fruit sit), the **Dietary Guidelines** added-sugar classification (honey, agave syrup, corn
  syrup and molasses are all named), and the **CDC** infant-botulism rule (no honey under 1 year).
  The page's own vague "about 3 tablespoons of liquid" line was corrected to the cited ¼ cup.
* **`/tools/herb-spice-matrix`** — the **Penn State Extension herb & spice pairing chart**
  re-ordered into a taste-descriptor table (16 seasonings with their taste and partner lists),
  the resulting three flavour families (warm-sweet / bright-sour / green-savoury), a **build-your-
  own-blend** table from Colorado State University Extension (allspice, apple pie spice, pumpkin
  pie spice, Italian seasoning, fresh→dried), and storage guidance (airtight, whole-vs-ground
  shelf life, why dried parsley is not worth buying) from Penn State's herb-drying guide.

**QA → deploy → verify:** pre-deploy gate `scripts/run16_qa.py` **PASS** (tag balance across 18
tag types, no literal `\\uXXXX`, no FAQ markup, no `href="undefined"`, all metas ≤160, every
internal href resolving to a file on disk, externals restricted to the official allowlist,
exact table-row counts per page, dead-citation guards). Build clean (`[build] Complete!`) with
`NODE_OPTIONS=--max-old-space-size=3584` after `rm -rf dist .astro`. Committed and pushed
**before** deploy (`017c561`, verified against `git ls-remote origin refs/heads/master`).
Deployed with the local binary (`./node_modules/.bin/wrangler deploy`) → **version
`ba9c9ada-14fb-45ac-bf2b-87c7733e99fe`**. Live verification `scripts/verify_run16_live.py` →
**PASS 3/3** on a cache-busted fetch (200, meta ≤160, no FAQ, all new phrases present, table
counts, internal links 200, sitemap lastmod 2026-10-12). Two WARNs are datacenter-IP 403s
(cdc.gov, fda.gov) — both were read successfully through the extraction path in this same run,
so they are reachability WARNs from this VPS, not dead links. Bing `SubmitUrlBatch` for the three
URLs returned `{"d":null}` (success).

**Phase 5 (outreach).**
* **addfreewebdirectory.com — SUBMITTED, free tier.** A fresh host surfaced from sibling-campaign
  acknowledgement mail (two acks, the newest today). It is a **phpLD-5 URL-param wizard**:
  `/submit.php` alone serves only the category `<select>`; `?c=<cat>` renders the link-type
  radios (7 = $60 featured, 8 = $20/yr, 9 = $20 lifetime regular, 10 = $7/yr regular,
  **11 = "Free Regular Link--free"**, 6–9 month review); `?c=331&LINK_TYPE=11` renders the detail
  form (TITLE / URL / DESCRIPTION / OWNER_* / RECPR_* / **DO_MATH arithmetic** / AGREERULES /
  continue=Continue), **no captcha**. Category 331 = Home & Family > Cooking. POST →
  *"Link submitted and awaiting approval."*
* **brestlinks.com — confirmation CLICKED, now pending review.** The confirmation mail had been
  sitting in Gmail **Spam** since 2026-10-09; GETting its
  `brestlinks.com//emailconfirmation.php?linkurl=tz67ala` returned *"Your link submission was
  confirmed!"*, so the entry is now genuinely in the review queue (it would have been auto-deleted
  otherwise).
* Flip sweep (`scripts/run16_dir_verify.py`, name search over all 35 submitted/pending rows):
  **0 new flips** — every live phpLD host still returns its search page with no listing link (the
  free queues run 2–6 months); 4 hosts 403 the scripted fetch (athenelinks 404 on its old search
  path, abicloud/brestlinks 302 to the search form).

Tracker now **48 rows: 4 listed / 31 submitted / 4 pending_review / 7 skipped_other /
1 skipped_paid / 1 failed**.

**Commits:** `017c561` (content + sitemap lastmod + run-16 QA gate + scripts) — verified against
`git ls-remote origin refs/heads/master`.

### Known follow-ups for run 17
1. **Review gate open 35 days / 16 runs — still the single biggest growth blocker.** Batch A items
   4–8 stay staged (kielbasa, tilapia, country fried steak, blackened salmon, biscuits+syrup). The
   demand case is now the strongest on record: "what to serve with philly cheesesteak" alone is
   22 impressions, the seasonal cluster ~58, and Bingbot still spends a large share of its crawl
   on the archived `/what-to-serve-with-*/` 404s. One line of OK ships the first batch at those
   exact slugs.
2. **Google re-consent** (user, one click + paste the code) → then GSC coverage/indexation
   re-check, sitemap resubmit, GA4 reads (the token also still lacks `analytics.readonly`).
3. **Within-gate queue (demand-matched), by live word count:** cooking-style-quiz 273,
   grocery-list 275, potluck-coordinator 281, recipe-generator 305, meal-prep 354, cooking-time
   372, unit-converter 403, leftover-matcher 416, oven-temperature 419, drink-calculator 424,
   protein-calculator 648. Next best unserved ridges in the fresh window: the **seasonal
   ingredients cluster** (~58 impressions; `/tools/seasonal-guide` is already 2,056 w, so this
   needs a *comparison*-shaped answer rather than more volume), "flavour pairing website" (14) on
   `/tools/flavor-pairing`, and the bread-proofing questions ("final proof enriched dough 24 25 c
   hokkaido milk bread poke test" 4, "bread dough proofing 6 hours room temperature food safety
   yeast dough" 4) on `/tools/bread-proofing`.
4. **Directory lane:** addfreewebdirectory added this run; re-check its ack and the brestlinks
   queue. Mine the next sibling-ack batch (the family's ack mail is the most reliable vein), and
   re-run the name-search flip sweep — the phpLD-5 `/submit` cohort approves in ~2 days, so
   royallinkup/huludirectory-class rows may mature.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged;
   only `EMAIL_ADDRESS` / `GMAIL_APP_PASSWORD` exist in `~/.hermes/.env`, so link outreach from
   `outreach@pairdish.com` is still not sendable and has not been attempted).
"""

PLAN_BLOCK = """
- 2026-10-12 (run 16): **Three within-gate tool-page expansions, each matched to a live Bing
  ridge (2,233 -> 4,147 words on those pages, +1,967).** `/tools/macro-calculator` 464 ->
  **1,140 w / 2 tables** (calorie factors read verbatim from 21 CFR 101.9(c)(1)(i) — 4/4/9 plus
  fibre at 2 and the eight published sugar-alcohol factors — a percentage-to-grams table for four
  common splits at 2,000 kcal, the reconciliation step showing the balanced row sums to 2,004 kcal,
  and the current Dietary Guidelines for Americans 2025-2030 anchors: protein 1.2-1.6 g/kg/day,
  no meal over 10 g of added sugars, saturated fat <=10% of calories) for the "macro balance
  calculator" cluster; `/tools/sugar-substitution` 517 -> **1,179 w / 2 tables** (Colorado State
  University Extension liquid-sweetener conversion rows, Utah State University Extension
  calories-per-gram + canning-suitability table, the FDA GRAS rule for high-intensity sweeteners,
  the Dietary Guidelines added-sugar classification, and the CDC no-honey-under-1-year rule) for
  the maple-syrup-to-monk-fruit and liquid-sweetener conversion cluster; `/tools/herb-spice-matrix`
  958 -> **1,587 w / 2 tables** (the Penn State Extension herb & spice pairing chart re-ordered
  into taste families, the three flavour-family groupings, CSU blend-building substitutions, and
  storage/whole-vs-ground guidance) for the "herbs and spices pairing flavor wheel" cluster.
  Also corrected the sugar page's own vague liquid-adjustment line to the cited 1/4 cup figure.
  QA gate PASS, deploy `ba9c9ada-14fb-45ac-bf2b-87c7733e99fe`, live verify PASS 3/3, sitemap
  lastmod 2026-10-12, Bing SubmitUrlBatch done. Directory: **1 new free submission**
  (addfreewebdirectory.com — phpLD-5 URL-param wizard, free radio value 11, no captcha) and
  **1 confirmation CLICKED** (brestlinks.com, recoverable from Gmail Spam) -> pending_review;
  0 listing flips this sweep. Bing's rolling window finally advanced: **701 queries / 72 clicks /
  1,101 impressions**; crawl stats now 2026-10-03..10-06 with Code2xx 62-63/day vs Code4xx
  13-29/day (the legacy-404 share is shrinking). Gate still ACTIVE (35 days). Next within-gate:
  the seasonal-comparison ridge, flavour-pairing-website, and the bread-proofing cluster, then the
  thin tail (cooking-style-quiz, grocery-list, potluck-coordinator).
"""

OUT_BLOCK = """
### Run 16 — 2026-10-12 (1 free submission; 1 confirmation clicked; 0 listing flips)

- **Sourcing again came from sibling-campaign ack mail, not a fresh list.** An IMAP sweep for
  untracked directory acks surfaced `addfreewebdirectory.com` (two acks, the newest today).
- **addfreewebdirectory.com — submitted, free tier.** phpLD-5 URL-param wizard: `/submit.php`
  alone shows only the category `<select>`; `?c=331` (Home & Family > Cooking) renders five
  link-type radios where **value 11 = "Free Regular Link--free"** (7/8/9/10 are $60 / $20 per year
  / $20 lifetime / $7 per year paid); `?c=331&LINK_TYPE=11` renders the detail form with
  TITLE / URL / DESCRIPTION / OWNER_NAME / OWNER_EMAIL / RECPR_* / a **DO_MATH arithmetic
  challenge** / AGREERULES — **no captcha**. POST → *"Link submitted and awaiting approval."*
  Script: `scripts/dir_run16_afwd.py` (probe/post); category probe: `scripts/dir_run16_probe.py`.
- **brestlinks.com — confirmation clicked.** The confirm mail (noreply@brestlinks.com, 2026-10-09
  16:48) was in **Gmail Spam**; GETting its `emailconfirmation.php?linkurl=tz67ala` URL returned
  *"Your link submission was confirmed!"* — without that click the entry is auto-deleted, so the
  run-15 submission is only now genuinely queued. Status moved `submitted` → `pending_review`.
- **Flip sweep: 0 flips.** Name-search over all 35 submitted/pending rows found no new live
  listings (the free queues run 2–6 months). Four hosts 403/404/302 the scripted search.
- Reminder: `search.php?search=<domain>` returns 0 hits on this family even when a listing exists —
  always search the site NAME.
- Tracker: **48 rows — 4 listed / 31 submitted / 4 pending_review / 7 skipped_other /
  1 skipped_paid / 1 failed.**
- Unchanged user actions: Pinterest access (account exists, no credentials here) and per-domain
  SMTP (only Gmail creds are present, so `outreach@pairdish.com` sending is still blocked).
"""


def append(path, block, marker=None):
    t = path.read_text(encoding="utf-8")
    if marker and marker in t:
        print(f"skip {path.name}: marker already present")
        return
    path.write_text(t.rstrip() + "\n" + block, encoding="utf-8")
    print(f"updated {path.name}: +{len(block)} chars")


append(AUDIT, AUDIT_BLOCK, marker="### Run 16 — 2026-10-12")
append(PLAN, PLAN_BLOCK, marker="2026-10-12 (run 16)")
append(OUT, OUT_BLOCK, marker="### Run 16 — 2026-10-12")
