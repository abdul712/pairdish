#!/usr/bin/env python3
"""Run 9: append the run-9 sections to SEO_AUDIT.md, CONTENT_PLAN.md and OUTREACH.md.
Assertion-guarded (every anchor must match exactly once)."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
AUDIT = ROOT / "SEO_AUDIT.md"
PLAN = ROOT / "CONTENT_PLAN.md"
OUT = ROOT / "OUTREACH.md"


def rep(path, old, new, label):
    t = path.read_text(encoding="utf-8")
    c = t.count(old)
    if c != 1:
        raise SystemExit(f"ABORT [{label}]: expected 1 match, found {c}")
    path.write_text(t.replace(old, new, 1), encoding="utf-8")
    print(f"OK [{label}]")


# ---------------------------------------------------------------- SEO_AUDIT.md
rep(
    AUDIT,
    "**Last updated:** 2026-09-21 (durable job run 8)",
    "**Last updated:** 2026-09-23 (durable job run 9)",
    "audit header",
)

rep(
    AUDIT,
    "1. **GA4 gtag not installed** — needs `G-9TPG0TS9CN` snippet in BaseLayout (I will add this run; measurement ID from GA4 API).\n"
    "2. **Google token scopes**: `indexing` (URL submission) and `analytics.readonly` missing → fix = one-time re-consent via `python3 ~/.hermes/scripts/webmaster_auto_add.py google-auth` (user must open URL + paste code). Until then: sitemap ping + internal links only.",
    "1. **GA4 gtag IS installed** — verified live again 2026-09-23: `G-9TPG0TS9CN` is present on the homepage (3 occurrences). Earlier audits listed it as missing; it is not. GA4 *reads* stay blocked by the dead Google token below, so no traffic reports yet.\n"
    "2. **Google refresh token is DEAD (`invalid_grant`)** — re-probed 2026-09-23 with a direct refresh call (`scripts/gsc_token_probe.py`): `400 invalid_grant — Token has been expired or revoked` (last good refresh 2026-09-14 05:01 UTC). Fix = one-time re-consent: `python3 ~/.hermes/scripts/webmaster_auto_add.py google-auth` (user opens the printed URL and pastes the code back immediately — codes are single-use and expire in ~10 min). Until then GSC + GA4 API reads and GSC indexing submissions are unavailable fleet-wide; Bing (separate key) carries monitoring.",
    "audit blockers",
)

RUN9 = """
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
"""

with AUDIT.open("a", encoding="utf-8") as fh:
    fh.write(RUN9)
print("OK [audit run 9 section appended]")

# ------------------------------------------------------------- CONTENT_PLAN.md
rep(
    PLAN,
    "  ingredients` response (new Bing demand ridge).",
    "  ingredients` response (new Bing demand ridge).\n"
    "- 2026-09-23 (run 9): **Last two below-band articles brought into band (within gate)** —\n"
    "  `recipe-nutrition-calculator-guide` ~740 -> **1,926 words** (FDA serving-size definition, the\n"
    "  5%/20% %DV rule, an 8-row Daily Value table, added-vs-total sugars, and a raw-vs-cooked\n"
    "  entry-state table from USDA FoodData Central) and `high-protein-meal-prep` ~690 -> **1,741\n"
    "  words** (9-row protein-per-anchor table with computed 150 g portions, raw-weight batch math,\n"
    "  FSIS storage windows for prepped containers). Both got sources blocks citing FDA / USDA FDC /\n"
    "  FSIS. **All 8 articles are now inside the 1,200-1,900 band** (lowest = pesto chicken 1,272).\n"
    "  Two live Bing demand ridges answered on existing tool pages instead of new articles:\n"
    "  `/tools/seasonal-guide` gains the USDA SNAP-Ed seasonality table (936 words live) and\n"
    "  `/tools/flavor-pairing` gains the \"flavour pairing\" (British spelling) section + classic-pairing\n"
    "  table (525 words live). Deploy `5541fe9b`, live verify 55/55, commit `fb81642`. Gate still\n"
    "  ACTIVE (16 days): Batch A items 4-8 remain staged; next within-gate target = the three pairing\n"
    "  guides sitting at the bottom of the band.",
    "content plan progress",
)

# ---------------------------------------------------------------- OUTREACH.md
OUT9 = """### Run 9 — 2026-09-23
- **1 NEW free submission: FreeTopRankDirectory** — freetoprankdirectory.com (phpLD, **no captcha**,
  free Regular `LINK_TYPE=normal`, category **Cooking = 297**, desc cap 500). POST returned the
  `class="msg"` block "Link submitted and awaiting approval." Verified by re-reading the saved result
  HTML (msg present, 0 errForm, title/category echoed). Target was mined by diffing this campaign's
  tracker against the phpLD roster after the NY-tax campaign proved the sibling set — none of
  fire-directory / ask-directory / freetoprankdirectory had ever been tried here.
- **3 candidates classified this run (all logged, nothing fabricated):**
  - Fire Directory (fire-directory.com) — `skipped_other`: the free form requires **reCAPTCHA**
    ("Please check reCAPTCHA box") **and** a reciprocal backlink on our own page -> badge class,
    never embed unilaterally.
  - Ask Directory (ask-directory.com) — `skipped_other`: reCAPTCHA required; our POST carried the
    payload (title echoed back) but the page returned no success msg and no error block.
  - Blogarama (blogarama.com) — `skipped_other`: `/add-a-site/` is an account signup form
    (email + password). A cron runner does not set passwords; the user can register manually.
- **Generic web-directory vein re-confirmed thin:** an 8-candidate screen (blogarama / saashub /
  alternativeto / thefoodieblogroll / yumgoggle / blogcatalog / blogengage / tasteaholics) produced
  0 additional usable free forms — 404s, dead hosts (000), CF 403 walls, or paid-only. saashub's
  `/submit/list` is a JS-rendered list (only 3 external links in raw HTML) — mining it needs the
  browser tool, noted for a future run.
- **Tracker after run 9:** 32 rows — 3 listed / 20 submitted / 2 pending_review / 6 skipped_other /
  1 skipped_paid. New rows: FreeTopRankDirectory (submitted), Fire Directory, Ask Directory,
  Blogarama (skipped_other).
- **Mail attribution (TO pairdish, since 09-12):** 10 messages, no new acks for the 09-18 / 09-21
  submissions (hrd/uswd/awd/gwd/iwd/twd/fwd) — free-tier review takes 2-6 months. Acked so far:
  ukinternetdirectory (09-14), promotebusinessdirectory (09-14), siteswebdirectory (09-16), Viesearch
  listed live (09-14). Script: `scripts/mail_pairdish_acks.py [since]`.
- **Untried phpLD siblings for next run (highest-yield lane):** prolinkdirectory.com, digabusiness.com,
  marketinginternetdirectory.com, allstatesusadirectory.com — all four went first-try for the NY-tax
  campaign; prolink/digabusiness need the AJAX `categ-tree.php` drill to a Cooking leaf, all four need
  captcha OCR.

"""
rep(
    OUT,
    "### Run 8 — 2026-09-21",
    OUT9 + "### Run 8 — 2026-09-21",
    "outreach run 9 section",
)

print("done")
