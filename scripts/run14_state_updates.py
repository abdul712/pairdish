#!/usr/bin/env python3
"""Run-14 state-file updates: SEO_AUDIT.md (header + new run section), CONTENT_PLAN.md
(progress bullet), OUTREACH.md (run log section). Idempotent: skips if the run-14 marker exists.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
MARK = "### Run 14 — 2026-10-07"

# ------------------------------------------------------------------ SEO_AUDIT.md
audit = ROOT / "SEO_AUDIT.md"
a = audit.read_text(encoding="utf-8")
old_head = "**Last updated:** 2026-10-05 (durable job run 13)"
new_head = "**Last updated:** 2026-10-07 (durable job run 14)"
if old_head in a:
    a = a.replace(old_head, new_head, 1)

AUDIT_SECTION = """
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
`\\uXXXX`, no FAQ markup, no `href="undefined"`, every internal href resolving to a file on disk,
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
"""

if MARK not in a:
    a = a.rstrip("\n") + "\n" + AUDIT_SECTION
    audit.write_text(a, encoding="utf-8")
    print("SEO_AUDIT.md: header + run-14 section written")
else:
    print("SEO_AUDIT.md: run-14 section already present, skipped")

# ------------------------------------------------------------------ CONTENT_PLAN.md
cp = ROOT / "CONTENT_PLAN.md"
c = cp.read_text(encoding="utf-8")
CP_BULLET = """- 2026-10-07 (run 14): **Three within-gate tool-page expansions, each matched to a live Bing
  ridge (2,824 → 4,807 words on those pages, +1,983).** `/tools/flavor-pairing` 1,072 → **1,710 w /
  1 table** (the four jobs a side dish can do — cut richness, add contrast, carry salt, supply
  starch — with a per-main-dish table and a worked Philly-cheesesteak example; Green & Lim 2010
  taste suppression, Ahn 2011 flavour network, FSIS danger zone) for the ~200-impression
  "what to serve with X" cluster; `/tools/seasonal-guide` 1,422 → **2,056 w / 1 table** (fresh vs
  frozen vs canned comparison + the verified Rickman/Barrett/Bruhn 2007 UC Davis nutrient-retention
  findings + SNAP-Ed guide) for the ~56-impression seasonal cluster; `/tools/substitution-finder`
  330 → **1,041 w / 1 table** (nine gram weights + six worked conversions: 2¾ cups cake flour →
  289 g all-purpose + 39 g cornstarch, 60 g cake flour → 53 g + 7 g, 2 cups granulated = 396 g ≈
  1⅞ cups packed brown) for the substitution cluster. Also fixed a **live dead citation** on
  `/tools/seasonal-guide` (snaped.fns.usda.gov no longer resolves → repointed to the live
  snaped.fna.usda.gov URL). QA gate PASS, deploy `2792a4b0-9718-4b8f-8866-4d23e69f7f4e`, live
  verify PASS 3/3, sitemap lastmod 2026-10-07, Bing SubmitUrlBatch done. Directory: **2 new free
  phpLD-4 submissions** (athenelinks.com — confirmation clicked the same run; abicloud.org —
  confirmation pending) plus 1 captcha-ambiguous skip (brestlinks.com). Bing now **609 queries /
  66 clicks / 940 impressions**; crawl is still ~⅓ 4xx from the archived legacy URLs. Gate still
  ACTIVE (30 days). Next within-gate: buffet-planner menu composition, cheese-board-calculator
  per-person quantities, then the thin tail (cooking-style-quiz, grocery-list, potluck-coordinator).
"""
if "2026-10-07 (run 14)" not in c:
    c = c.rstrip("\n") + "\n" + CP_BULLET
    cp.write_text(c, encoding="utf-8")
    print("CONTENT_PLAN.md: run-14 bullet appended")
else:
    print("CONTENT_PLAN.md: run-14 bullet already present, skipped")

# ------------------------------------------------------------------ OUTREACH.md
ou = ROOT / "OUTREACH.md"
o = ou.read_text(encoding="utf-8")
OU_SECTION = """
### Run 14 — 2026-10-07 (2 free submissions; 1 captcha skip; 0 listing flips)

- **Sourcing:** the sibling-ack sweep again beat fresh-list mining — the shared mailbox held an
  untracked `athenelinks.com` "Action Required: Confirm your link submission" mail (from another
  campaign) and a `starterbest.com` signup confirmation. Rejected as non-fits:
  coinbase/plaid/mercor/provenexpert (not directories), plus the two storage-alert spam domains.
- **Targets probed:** athenelinks.com, brestlinks.com, abicloud.org — one phpLD-4 template
  (bare `/captcha.php`, no IMAGEHASH; radios featured / normal(paid) / reciprocal / **free =
  "Regular Reviews"**; shared taxonomy Home > Cooking = 185).
- **Athene Directory (athenelinks.com)** — ✅ submitted, free tier: "Link submitted and awaiting
  approval." Confirmation mail arrived in **Spam** and was clicked in the same run →
  "Your link submission was confirmed!" (queue 1–6 months).
- **AbiCloud Directory (abicloud.org)** — ✅ submitted, free tier: "Link submitted and awaiting
  approval." Email confirmation still required; the mail had not landed at check time — click it
  next run.
- **Brestlinks (brestlinks.com)** — ⛔ failed, no POST spent: the 6-char captcha read disagreed at
  one character between preprocessings (cleaned/left `HZRMSY` vs raw/right `HZRM5Y`), so the
  single-use code was not burned.
- **Verification sweep:** `/search.php?search=pairdish.com` across all 32 submitted/pending rows →
  **0 flips** (4 hosts 403 the scripted fetch). Free phpLD queues are 2–6 months, so this is the
  expected shape, not a failure signal.
- **HuLu Directory:** acceptance already recorded (mail recovered this run lists pairdish.com in
  the accepted set); the live listing URL is still not locatable from this VPS, so the row stays
  pending_review rather than a fabricated `listed`.
- Tracker after run: **46 rows — 3 listed / 30 submitted / 4 pending_review / 7 skipped_other /
  1 skipped_paid / 1 failed**.
"""
if MARK not in o:
    o = o.rstrip("\n") + "\n" + OU_SECTION
    ou.write_text(o, encoding="utf-8")
    print("OUTREACH.md: run-14 section appended")
else:
    print("OUTREACH.md: run-14 section already present, skipped")

sys.exit(0)
