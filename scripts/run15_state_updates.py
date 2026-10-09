#!/usr/bin/env python3
"""Run-15: append the run-15 sections to the project state files (SEO_AUDIT / CONTENT_PLAN / OUTREACH)."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

AUDIT = """
### Run 15 — 2026-10-09

**Phase 6 (monitoring) — read-only, all green except the known Google blocker.**
Full live status sweep of the deployed tree (`scripts/run15_status_sweep.py`): **52/52 sitemap URLs
return 200** and every one served real content (`scripts/live_wordcount.py --sitemap`), 0 empty
bodies. Meta descriptions all ≤160 chars, 0 FAQPage, 0 `href="undefined"`. Sitemap still 52 URLs.
Bing Webmaster: **609 queries / 66 clicks / 940 impressions** in the window Bing returns (~4
months) — unchanged from run 14, i.e. the rolling window has not advanced. `GetCrawlStats` still
returns its newest days as 2026-09-29 → 10-02: **Code2xx 61–64/day against Code4xx 20–41/day**
(the archived `/what-to-serve-with-*/` legacy paths), `Code5xx = 0`, `InIndex = 55`. Both sitemap
feeds report **Success, 52 URLs**.
**Google refresh token re-probed (`scripts/gsc_token_probe.py`): still `400 invalid_grant`** —
GSC indexation/query reads and GA4 reads stay dark; one user re-consent is the fix.

**Phase 4 (execution, inside the still-closed review gate — now 32 days / 15 runs).** Three
demand-matched tool-page expansions, each aimed at a live Bing ridge, **+1,914 words total**
(measured live after deploy):

| Page | Before | After | Demand answered |
|---|---|---|---|
| `/tools/chocolate-pairing` | 434 w | **1,205 w** | the chocolate-pairing cluster (~13 impressions: "chocolate dessert coffee pairing guide" 4, "coffee dessert pairing guide chocolate cheesecake fruit desserts" 4, "chocolate pairings"/"chocolate flavor pairing guide"/"matching chocolate"/"pair related chocolates"/"chocolate.pairs.with" 1 each) |
| `/tools/cheese-board-calculator` | 494 w | **1,017 w** | the cheese-board quantity cluster ("cheese board how much cheese" 1 + 1 click, "how much cheese per person for a cheese board per variety" 1, "cheese board variety proportions hard soft blue goat cheese" 1, "hosting 35 people … charcuterie. how much of each should we buy" 1) |
| `/tools/buffet-planner` | 1,305 w | **1,925 w** | the buffet menu-composition cluster ("make me a buffet menu that has fish, chicken, pork, beef, vegetable, and salad" 4, "food and beverage buffet menu planning dishes" 4, "buffet menu planning" 2) |

Content that shipped: (a) a **cocoa-percentage table built on the FDA standards of identity**
(21 CFR Part 163: sweet chocolate ≥15% chocolate liquor, semisweet/bittersweet ≥35%, milk
chocolate ≥10% chocolate liquor + 3.39% milkfat + 12% milk solids, white chocolate ≥20% cacao fat
+ 3.5% milkfat + 14% milk solids + no cocoa solids/colour and ≤55% sweetener), a pairing-by-type
table covering dark/semisweet/milk/white/ruby, the **USDA National Agricultural Library caffeine
figures** (24 mg per 1 oz of 60–69% dark chocolate, 13 mg/oz for dark chocolate NFS, 7 mg per
1.69 oz milk-chocolate package, 336 mg per serving of chocolate-covered coffee beans) tied to the
existing coffee-pairing page, and **Clemson HGIC storage guidance** (65–70 °F, RH under 50–55%,
airtight and dark; cocoa powder ≈3 y, unsweetened/dark ≈2 y, milk ≈1 y, white ≈6 months; bloom is
harmless); (b) a **per-person cheese and charcuterie table** (Penn State Extension 1–2 oz cheese
per person for an appetizer board; University of Kentucky FCS 2 oz appetizer / 4 oz meal for
cheese and 3 oz / 6 oz for charcuterie) with a varieties-vs-guests worked table that answers the
"per variety" query directly, plus the FDA/FSIS holding rules and the FDA "small platters,
replace don't top up" habit; (c) a **worked six-category buffet menu template** (fish / poultry /
pork / beef / starch / vegetable-and-salad) answering the exact multi-protein query, with the
"one serving per person across the whole protein category, not per dish" rule and the FDA safe-
buffet holding guidance.

**Defect fixed in the same pass:** the live `/tools/buffet-planner` page cited the FSIS danger-zone
page at a path missing its `/food-safety/` segment
(`fsis.usda.gov/food-safe-handling-and-preparation/…`), which serves the FSIS **"Page Not Found"**
page — verified this run through the extraction path while the correct
`/food-safety/safe-food-handling-and-preparation/…` URL returned the real page. Repointed, and the
QA gate now fails if the dead path reappears anywhere in `src/`.

**QA → deploy → verify:** pre-deploy gate `scripts/run15_qa.py` **PASS** (tag balance, no literal
`\\uXXXX`, no FAQ markup, no `href="undefined"`, no literal braces inside the inserted sections,
every internal href resolving to a file on disk, externals restricted to the official allowlist,
plus dead-citation guards for the retired SNAP-Ed host and the mis-pathed FSIS URL). Build clean
(`[build] Complete!`, 148 assets) with `NODE_OPTIONS=--max-old-space-size=3584`. Committed and
pushed **before** deploy (`eb4239b`, verified against `git ls-remote origin refs/heads/master`).
Deployed with the local binary (`./node_modules/.bin/wrangler deploy`) → **version
`81ff673d-1809-4ad3-b002-26408010f2c1`**. Live verification `scripts/verify_run15_live.py` →
**PASS 3/3** (cache-busted fetch: 200, meta ≤160, no FAQ, new phrases present, exact table counts,
internal links 200, sitemap lastmod 2026-10-09 on all three). Five WARNs are datacenter-IP 403s
(fda.gov ×2, fsis.usda.gov ×2, extension.umn.edu) — each source was read successfully through the
web-extract path in this same run, so they are reachability WARNs from this VPS, not dead links.
Bing `SubmitUrlBatch` for the three URLs returned `{"d":null}` (success).

**Phase 5 (outreach).** Sibling-ack mining plus a fresh captcha session produced:
- **brestlinks.com — submitted, free tier** (`LINK_TYPE=free`, "Regular Reviews (1–6 months review
  time)"; the 6-character captcha read `MTB8F2` agreed across the raw and the cleaned binarised
  preprocessing, so the one-shot POST was spent) → "Link submitted and awaiting approval." Its
  email confirmation is still required and has not arrived for pairdish yet.
- **huludirectory.com — FLIPPED TO LISTED.** The listing is live at
  `https://huludirectory.com/listing/pairdish--food-pairing-tools-and-recipe-calculators-2256734`
  (200, title "PairDish - Food Pairing Tools & Recipe Calculators", outbound `<a>` to
  pairdish.com, no pending marker). Found with a **name** search (`?search=PairDish`) — the domain
  search (`?search=pairdish.com`) returns 0 hits on this install, exactly as the skill warns. This
  is the first new listing flip in several runs.
- **chameleonwebservices.com — failed (silent no-op).** phpLD-4 template with a real free radio
  ("Regular Reviews (2+ months review wait time)"), www→apex 301 handled, AF_INET forced. Two POSTs
  (the first from a split-case captcha read `CKVZ3H`/`CkVz3H`, the second from an agreed read
  `8RPJGH`) each re-rendered a **byte-identical blank form** — no message block, no error, no field
  echo, and critically **no duplicate-title message on the retry**, which per the skill is the
  proof that no entry was created. Logged `failed`.
- Verification sweep (`scripts/run15_dir_verify.py`, name search over all 34 submitted/pending
  rows): **1 flip** (huludirectory.com); every other live phpLD host returns its search page with
  no listing link yet (the free queues run 2–6 months), and 4 hosts 403 the scripted fetch.

Tracker now **47 rows: 4 listed / 31 submitted / 3 pending_review / 7 skipped_other /
1 skipped_paid / 1 failed**.

**Commits:** `eb4239b` (content + sitemap lastmod + QA gate + run-15 scripts) — verified against
`git ls-remote origin refs/heads/master`.

### Known follow-ups for run 16
1. **Review gate open 32 days / 15 runs — still the single biggest growth blocker and now the
   binding constraint on the mission.** Batch A items 4–8 stay staged (kielbasa, tilapia, country
   fried steak, blackened salmon, biscuits+syrup). The demand case keeps growing: the
   "what to serve with X" cluster spans ~200 impressions across dozens of dishes (philly
   cheesesteak 22, pork loin 9 incl. 1 click, schnitzel 6 incl. 2 clicks, garlic shrimp 4 incl. 1
   click, paella 4, lentil soup 4, trout 3, acorn squash 3, chicken kiev 3, flatbread 3+2, duck
   confit 3, foie gras 3 incl. 1 click, pickled herring 3, italian wedding soup 3, grits 3,
   manicotti 3, breaded pork chops 3, ramen 3) and **a third of Bingbot's crawl still lands on the
   archived `/what-to-serve-with-*/` 404s**. One line of OK ships the first batch at those slugs.
2. **Google re-consent** (user, one click + paste the code) → then GSC coverage/indexation
   re-check, sitemap resubmit, GA4 reads (the token also still lacks `analytics.readonly`).
3. **Within-gate queue (demand-matched), by live word count:** cooking-style-quiz 273,
   grocery-list 275, potluck-coordinator 281, recipe-generator 305, meal-prep 354, cooking-time
   372, unit-converter 403, leftover-matcher 416, oven-temperature 419, drink-calculator 424,
   chocolate-pairing now 1,205. Next best still-unserved demand ridges: the **macro balance
   calculator** queries ("macro balance calculator" 2, "macro balancing calculator" 2) on
   `/tools/macro-calculator` (464 w), the sugar-substitution ridges on `/tools/sugar-substitution`
   (517 w), and the beef/pork side-dish cluster on `/tools/flavor-pairing`.
4. **Directory lane:** re-check brestlinks' confirmation mail and click it; then screen a fresh
   phpLD signature list — the tracked family is 47 rows deep and the known siblings are nearly
   exhausted. Also re-run the name-search sweep for flips (huludirectory flipped this run, so the
   family's queue is starting to mature).
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged).
"""

PLAN = """
- 2026-10-09 (run 15): **Three within-gate tool-page expansions, each matched to a live Bing
  ridge (2,233 -> 4,147 words on those pages, +1,914).** `/tools/chocolate-pairing` 434 ->
  **1,205 w / 2 tables** (FDA 21 CFR Part 163 standards-of-identity table for sweet / semisweet /
  milk / white / ruby chocolate with the exact minimum contents, a pairing-by-type table, the
  USDA National Agricultural Library caffeine figures tied to the coffee-pairing page, and
  Clemson HGIC storage/bloom guidance) for the ~13-impression chocolate-pairing cluster;
  `/tools/cheese-board-calculator` 494 -> **1,017 w / 2 tables** (per-person cheese and
  charcuterie by board role from Penn State Extension and University of Kentucky FCS, a
  varieties-vs-guests worked table that answers "how much cheese per person per variety", and the
  FDA/FSIS holding rules) for the cheese-board quantity cluster; `/tools/buffet-planner`
  1,305 -> **1,925 w** (a worked six-category fish / poultry / pork / beef / starch /
  vegetable-and-salad menu template answering the exact multi-protein query, with the
  one-serving-per-person-across-the-category rule and FDA safe-buffet guidance). Also **fixed a
  live dead citation** on `/tools/buffet-planner` (FSIS danger-zone path missing its
  `/food-safety/` segment served the FSIS Page Not Found page -> repointed and guarded).
  QA gate PASS, deploy `81ff673d-1809-4ad3-b002-26408010f2c1`, live verify PASS 3/3, sitemap
  lastmod 2026-10-09, Bing SubmitUrlBatch done. Directory: **1 new free phpLD-4 submission
  (brestlinks.com, free tier, captcha agreed across preprocessings)**, **1 listing FLIP**
  (huludirectory.com now live at /listing/pairdish--food-pairing-tools-and-recipe-calculators-2256734,
  found via the site-NAME search), and 1 failed no-op host (chameleonwebservices.com — two POSTs,
  byte-identical re-renders, no duplicate-title proof). Tracker 47 rows (4 listed). Bing still
  609 queries / 66 clicks / 940 impressions; crawl still ~1/3 4xx from the archived legacy URLs.
  Gate still ACTIVE (32 days). Next within-gate: macro-calculator, sugar-substitution, then the
  thin tail (cooking-style-quiz, grocery-list, potluck-coordinator).
"""

OUTREACH = """
### Run 15 — 2026-10-09 (1 free submission; 1 listing FLIP; 1 failed no-op)

- **Sourcing:** sibling-ack sweep over the shared mailbox (01-Oct window) re-confirmed the HuLu
  Directory acceptance for pairdish.com and surfaced one untracked host with a submission ack,
  `chameleonwebservices.com`. Non-fits rejected: google.com (Flow notice), mail.perplexity.ai,
  mercor.com, provenexpert.com, starterbest.com.
- **Brestlinks (brestlinks.com)** — submitted, free tier: `LINK_TYPE=free` ("Regular Reviews
  (1-6 months review time)"). Run 14 skipped this host because two captcha preprocessings
  disagreed at one character; this run the raw and cleaned reads both returned `MTB8F2`, so the
  single-use POST was spent -> "Link submitted and awaiting approval." Its confirmation email is
  still required and has not landed for pairdish yet — re-check next run.
- **Directory HuLu (huludirectory.com)** — **listed**. Live at
  https://huludirectory.com/listing/pairdish--food-pairing-tools-and-recipe-calculators-2256734
  (200; title "PairDish - Food Pairing Tools & Recipe Calculators"; outbound link to
  pairdish.com; no pending marker). Found with `?search=PairDish` — the domain search
  (`?search=pairdish.com`) returns no hits on this install.
- **Chameleon Web Services (chameleonwebservices.com)** — failed, silent no-op. phpLD-4 template
  with a real free radio; www->apex 301 handled; AF_INET forced. Two POSTs (split-case read
  `CKVZ3H`/`CkVz3H`, then agreed read `8RPJGH`) each returned a byte-identical blank form with no
  message block, no error and no field echo — and the retry produced no "TITLE already exists"
  message, which is the proof no entry was created.
- **Verification sweep:** `scripts/run15_dir_verify.py` (site-NAME search across all 34
  submitted/pending rows) -> **1 flip** (huludirectory). All other reachable phpLD hosts return
  their search page with no listing link yet (free queues run 2-6 months); 4 hosts 403 the
  scripted fetch.
- Tracker after run: **47 rows — 4 listed / 31 submitted / 3 pending_review / 7 skipped_other /
  1 skipped_paid / 1 failed**.
"""

for rel, block in (
    ("SEO_AUDIT.md", AUDIT),
    ("CONTENT_PLAN.md", PLAN),
    ("OUTREACH.md", OUTREACH),
):
    p = ROOT / rel
    s = p.read_text(encoding="utf-8")
    if "### Run 15 — 2026-10-09" in s or "- 2026-10-09 (run 15)" in s:
        print(f"{rel}: already contains a run-15 section, skipping")
        continue
    p.write_text(s.rstrip() + "\n" + block, encoding="utf-8")
    print(f"{rel}: appended run-15 section (+{len(block)} chars)")
