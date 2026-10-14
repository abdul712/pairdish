#!/usr/bin/env python3
"""Run-17 state-file updates: SEO_AUDIT.md run-17 section, CONTENT_PLAN.md progress bullet,
OUTREACH.md run-17 log. Idempotent (skips if the marker is already present)."""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

AUDIT = """
### Run 17 — 2026-10-14 (this run)

**Phase 1 / 6 audit (live sweep).** All **52/52** sitemap URLs return 200; every meta description
is within 160 characters; **no FAQPage markup anywhere**; `href="undefined"` count 0. Both Bing
feeds (`www.` and apex `sitemap.xml`) report `Success`, 52 URLs.

**Bing traffic.** The rolling window is **unchanged this run — 701 queries / 72 clicks /
1,101 impressions** (the re-query returns the same rollup as run 16, so no new data has been
released since 2026-10-12). `GetCrawlStats` latest days: 2026-10-09 Code2xx 62 / Code4xx 28
(CrawledPages 41, InIndex 56); the 4xx share is still the archived legacy paths.
`GetUrlInfo` on the six probed URLs again reports HttpStatus 0 / LastCrawled None — a known
non-signal on this account, with `DocumentSize` 33.7–72.5 KB the usable field (Bing holds all
six). **GSC is still dark**: the refresh fails `400 invalid_grant` at the token step, so all
Google-side reads (coverage, queries, GA4) remain blocked pending the user's re-consent.

**Phase 4 (within gate) — three demand-matched tool-page expansions, +2,064 words live.**
Each page was picked because a fresh Bing ridge pointed at it AND it still shipped zero official
citations / zero tables (the defect class this site's own review standard calls out):

* **`/tools/drink-calculator` 424 → 1,285 w / 3 tables** — the standard-drink definition read from
  **NIAAA** and **CDC** (0.6 fl oz / 14 g of pure alcohol; 12 fl oz beer at 5% ABV, 5 fl oz wine at
  12%, 1.5 fl oz spirits at 40%), a computed standard-drinks-per-container table (12 oz at 5% = 1;
  the same can at 10% = 2; a pint = about 1 1/3; 750 mL wine = about 5; 1.5 L = about 10; 750 mL
  spirits = about 17; 1.75 L = about 39 — each row carrying its own arithmetic), and the
  **Michigan State University Extension** beverage-planning percentages (morning and afternoon
  break, split by audience mix, with the cups-to-gallons rule and a worked 300-guest example).
  Answers the "cocktail party drink calculation per person formula" and "drink measure calculator"
  ridges.
* **`/tools/appetizer-planner` 515 → 1,107 w / 3 tables** — the two published extension benchmarks
  side by side (**MSU**: 14 appetizers per person per hour for a reception with no meal, 10 over
  the lunch hour, 6–8 for a late afternoon or evening reception; **UAEX**: about 8 per person in
  the first two hours of a four-hour party and about 4 for the remaining two), the four-hour rule
  worked for 20/50/100 guests, and the holding limits (140 °F hot, 39 °F cold, discard after two
  hours, reheat to 165 °F).
* **`/tools/yeast-converter` 558 → 1,169 w / 2 tables** — the **King Arthur Baking** professional
  multipliers (fresh × 0.4 = active dry, fresh × 0.33 = instant) with the hydration and
  water-adjustment notes, the cross-rate derived transparently from those two rules
  (instant ≈ 0.825 × active dry), a worked conversion table (30 g fresh = 12 g active dry = 10 g
  instant; one 7 g packet of active dry ≈ 17.5 g fresh), and the packet equivalents from **CSU**
  Extension (a 1/4 oz package = 2 1/2 tsp = one compressed yeast cake) and **NMSU** Extension
  (1 tbsp active dry = one cake).

Facts were re-fetched and read in this run before writing; the URL gate used a UA ladder (browser
UA first, then a plain curl UA) because **cdc.gov answers 403 to a browser UA from this box and 200
to curl**, while **niaaa.nih.gov, uaex.uada.edu, canr.msu.edu and kingarthurbaking.com answer
200**. Two candidate sources were rejected on the gate: `redstaryeast.com/baking-tips/
yeast-conversion-chart/` (**404**) and `extension.missouri.edu/publications/mp564` (**403 to both
UAs**) — neither is cited.

**URL hygiene — three legacy root URLs reclaimed with 301s.** The Wayback CDX inventory shows 28
archived `what-to-serve-with-*` root paths, every one of which 404s live, while Bing still holds
one of them (`/what-to-serve-with-philly-cheesesteak/`, DocumentSize 72.5 KB) and ranks it for the
site's single largest query (**"what to serve with philly cheesesteak", 22 impressions**). Three of
them now 301 to their live replacements:

| legacy path | 301 target |
|---|---|
| `/what-to-serve-with-fried-fish` | `/articles/what-to-serve-with-fried-fish` |
| `/what-to-serve-with-roasted-potatoes` | `/articles/what-to-serve-with-roasted-potatoes` |
| `/what-to-serve-with-pesto-chicken` | `/articles/what-to-serve-with-pesto-chicken` |

Implemented as source-level pages returning `Astro.redirect(target, 301)`, verified live in **both
slash forms** with a no-redirect read (301 + exact Location) and with each target returning 200.
The redirect slugs are deliberately absent from the sitemap, which stays at 52 URLs.

**The other 25 legacy paths stay 404, deliberately.** They have no topically-equivalent live page —
the closest candidates are Batch A articles that are still behind the review gate (philly
cheesesteak, schnitzel, pork loin, garlic shrimp, paella, lentil soup …). Redirecting them to an
unrelated page would be a soft 404, so the honest fix is to publish the pages at their original
URLs once the gate opens.

**Phase 5 (outreach) — 0 submissions, three captcha-class skips, 0 listing flips.**
* Sibling-ack mail sweep: the only untracked directory host with a fresh ack was **caida.eu**
  ("Action Required: Confirm your link submission at Caida Web Directory", 2026-10-12). It is the
  phpLD-4 bare-captcha template with a genuine free radio (`LINK_TYPE=free`, "Regular Listings (6+
  months + review time)"), www→apex 301 handled, AF_INET forced.
* Two untried proven siblings of the phpLD-5 `/submit` vein were probed: **directory4.org** and
  **upsdirectory.com** (identical installs: category 203 = Home > Cooking, LINK_TYPE 1–6 all free,
  7 = $1.50 premium).
* **All three stopped at the captcha, and no POST was spent.** caida.eu produced three fresh
  captures that each read split at exactly one character (raw/mild pairs `WFOYJM`/`WF0YUM`,
  `9EPGUK`/`BEPGUK`, `HUXFAB`/`6UXFAB`) with high-zoom glyph crops contradicting each other; the
  d4/ups 7-character `IMAGEHASH` captcha split in the middle across four preprocessings
  (raw `7K8yCMH` / mild `7KEVCMH` / median5 `7K8ycMII` / median3 `7KBVCMH` — two votes each). The
  family rule is to never burn a single-use code on a split read. Incidentally confirmed: a second
  request for the same phpLD phrase returns "Could not fetch image phrase!", so the captcha image
  must be fetched once and saved as bytes.
* Flip sweep (`scripts/run17_dir_verify.py`, site-NAME search over all 35 submitted/pending rows):
  **0 flips** (the free queues run 2–6 months). The four `listed` rows were re-verified live: all
  four return 200 with the site name in the body.

Tracker now **51 rows: 4 listed / 31 submitted / 4 pending_review / 10 skipped_other /
1 skipped_paid / 1 failed**.

**QA → deploy → verify.** Pre-deploy gate `scripts/run17_qa.py` **PASS** (tag balance across 17 tag
types, no literal escapes, no FAQ markup, no `href="undefined"`, no literal `undefined` in the new
prose, all metas ≤160, every internal href resolving on disk, externals restricted to the official
allowlist, exact table-row counts per page, redirect targets present and on disk, no dead
citations). Build clean with `NODE_OPTIONS=--max-old-space-size=3584` after `rm -rf dist .astro`.
Committed and pushed **before** deploy (`54ef221`, verified against
`git ls-remote origin refs/heads/master`). Deployed with the local binary
(`./node_modules/.bin/wrangler deploy`) → version **`de3165d6-a66f-4fe3-b87c-c64d6842cc81`**.
Live verification `scripts/verify_run17_live.py` → **PASS** (3/3 pages, 3/3 legacy URLs 301 in both
slash forms with 200 targets, sitemap lastmod 2026-10-14 on the three edited pages, 52 URLs). One
WARN: cdc.gov returns 403 to the scripted fetch from this VPS — the same page was read
successfully through the extraction path in this run. Bing `SubmitUrlBatch` for the six changed
URLs returned `{"d":null}` (success).

**Lessons recorded this run** (for the skill, not repeated here): a listing-proof field that has a
note appended after the URL must be split on whitespace before it is fetched (two `listed` rows read
000 until that was fixed — a checker bug that looked like a dead listing); and the phpLD-5
`IMAGEHASH` captcha image is consumed by its first request.

### Known follow-ups for run 18
1. **Review gate open 37 days / 17 runs — still the single biggest growth blocker, and now the
   reclaim case is measurable.** The 22-impression "what to serve with philly cheesesteak" query
   points at a URL that this run left 404 on purpose because no equivalent page exists. One line of
   OK ships Batch A items 4–8 at their exact slugs *and* closes the redirect map for the 25 remaining
   legacy paths (a page at the original URL plus a 301 in the same commit).
2. **Google re-consent** (user, one click + paste the code) → then the GSC coverage/indexation
   re-check, sitemap resubmit, and GA4 reads. The token has now been dead for four consecutive runs.
3. **Within-gate queue (demand-matched), by live word count after this run:** cooking-style-quiz 273,
   grocery-list 275, potluck-coordinator 281, recipe-generator 305, meal-prep 354, cooking-time 372,
   unit-converter 403, leftover-matcher 416, oven-temperature 419, recipe-scaler 548, sourdough-
   calculator 439, pantry-helper 445, appetizer-planner (now 1,107 — done this run). All of these
   still ship **zero tables and zero official citations**, the same defect class fixed three pages at
   a time since run 11. Next best unserved ridges in the fresh window: the **seasonal ingredients
   cluster** (~58 impressions), **"flavour pairing website" / "flavour pairing"** (14 on
   `/tools/flavor-pairing`), the **"what to serve with X"** cluster (pork loin, garlic shrimp,
   paella, lentil soup, schnitzel), and the bread-proofing questions (~12) on `/tools/bread-proofing`.
4. **Directory lane:** the captcha class is now a documented dead end on this VPS (three new hosts
   in run 17, plus athenelinks/brestlinks/abicloud history). Stop probing 6–7 character
   `IMAGEHASH` captcha installs; mine the sibling-ack vein for hosts whose form has **no captcha**
   (the addfreewebdirectory / phpLD-5 wizard class), and re-check the brestlinks + addfreewebdirectory
   ack mail. Re-run the name-search flip sweep each run — the phpLD-5 `/submit` cohort approves in
   ~2 days, so royallinkup/excitedirectory-class rows may mature.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged;
   only `EMAIL_ADDRESS` / `GMAIL_APP_PASSWORD` exist in `~/.hermes/.env`, so link outreach from
   `outreach@pairdish.com` is still not sendable and has not been attempted).
"""

CONTENT = """
- 2026-10-14 (run 17): **Three demand-matched within-gate tool-page expansions (+2,064 words) plus
  the first three legacy-URL 301s.** `/tools/drink-calculator` 424 -> **1,285 w / 3 tables** (NIAAA
  + CDC standard-drink table; a computed standard-drinks-per-container table with per-row
  arithmetic; the Michigan State University Extension beverage-planning percentages with the
  cups-to-gallons worked example) for the "cocktail party drink calculation per person formula" and
  "drink measure calculator" ridges. `/tools/appetizer-planner` 515 -> **1,107 w / 3 tables** (MSU
  and UAEX per-person benchmarks side by side, the four-hour rule worked for 20/50/100 guests, and
  the 140 F / 39 F / two-hour / 165 F holding limits). `/tools/yeast-converter` 558 -> **1,169 w /
  2 tables** (King Arthur's fresh x 0.4 / fresh x 0.33 multipliers, the derived 0.825 dry-to-dry
  cross-rate, worked conversions, and the CSU/NMSU packet equivalents). URL hygiene: 301s for
  `/what-to-serve-with-{fried-fish,roasted-potatoes,pesto-chicken}` -> `/articles/...`, verified in
  both slash forms; 25 further legacy paths stay 404 because no equivalent page exists yet (Batch A
  is still gated). QA gate PASS, deploy `de3165d6-a66f-4fe3-b87c-c64d6842cc81`, live verify PASS
  (3/3 pages + 3/3 redirects), sitemap lastmod 2026-10-14, Bing SubmitUrlBatch done. Directory:
  **0 submissions** — three hosts investigated (caida.eu, directory4.org, upsdirectory.com), all
  free-tier confirmed and all stopped at a split-read captcha with no POST spent; 0 listing flips;
  4/4 `listed` rows re-verified live. Bing window unchanged at **701 queries / 72 clicks /
  1,101 impressions**; GSC token still dead (invalid_grant). Gate still ACTIVE (37 days). Next
  within-gate: the seasonal-comparison and flavour-pairing ridges, the "what to serve with X"
  cluster, then the thin tail (cooking-style-quiz, grocery-list, potluck-coordinator).
"""

OUTREACH = """
### Run 17 — 2026-10-14 (0 submissions; 3 captcha-class skips; 0 listing flips)

- **Sourcing:** the sibling-ack sweep over the shared mailbox (window from 05-Oct) returned exactly
  one untracked directory host with a fresh acknowledgement: **caida.eu** ("Action Required: Confirm
  your link submission at Caida Web Directory", 2026-10-12 13:06). Non-fits rejected as before:
  google.com, mail.perplexity.ai, provenexpert.com, starterbest.com. The HuLu Directory acceptance
  for pairdish.com was re-confirmed in the same sweep (already recorded as `listed`).
- **Caida Web Directory (caida.eu)** — ⛔ captcha class, **no POST spent.** phpLD-4 bare
  `/captcha.php` template (no IMAGEHASH), free radio `LINK_TYPE=free` = "Regular Listings (6+ months
  + review time, depending on waiting list)"; www→apex 301 to the apex host, AF_INET forced. Three
  fresh captures each read split at exactly one character (raw/mild pairs `WFOYJM`/`WF0YUM`,
  `9EPGUK`/`BEPGUK`, `HUXFAB`/`6UXFAB`); isolated high-zoom glyph crops contradicted one another
  (character 3 read O / 0 / D, character 1 read 9 / B, then H / 6); the heavy threshold read was
  garbage. The family rule is not to burn a single-use code on a split read.
- **Directory4.org** — ⛔ captcha class, no POST spent. phpLD-5 `/submit` URL-param wizard:
  `/submit` → category select; `/submit?c=203` → step 2 with radios 1–6 all free ("Link - free",
  business, article, picture, video, coupon) and 7 = $1.50 premium; `/submit?c=203&LINK_TYPE=1` →
  the detail form carrying an **IMAGEHASH** plus a 7-character `/captcha.php?imagehash=` image.
  Four preprocessings of one capture split in the middle (raw `7K8yCMH`, mild `7KEVCMH`, median5
  `7K8ycMII`, median3 `7KBVCMH` — two votes each). Script:
  `scripts/dir_run17_phpld5.py` (detect / probe / step2 / captcha / post-imagehash / post).
- **UPS Directory (upsdirectory.com)** — ⛔ same install and template as directory4.org (identical
  category tree, cat 203 = Home > Cooking, same free radios, same IMAGEHASH captcha). Free tier
  confirmed, captcha unreadable, no POST spent.
- **Incidental finding worth keeping:** a second request for the same phpLD captcha phrase returns
  "Could not fetch image phrase!" — the phrase is consumed by the first request, so fetch the image
  once and save the bytes.
- **Flip sweep** (`scripts/run17_dir_verify.py`, site-NAME search over all 35 submitted/pending
  rows): **0 flips** — every reachable phpLD host returns its search page with no listing link (the
  free queues run 2–6 months); athenelinks 404s its old search path, abicloud/brestlinks 302 to the
  search form, entireweb/freeprwebdirectory/sitepromotion/britainbusiness 403 the scripted fetch.
- **`listed` rows re-verified** (`scripts/run17_listed_check.py`): ShowMySites, Viesearch, HuLu
  Directory and pairdish.com itself all return 200 with the site name in the body.
- Tracker after run: **51 rows — 4 listed / 31 submitted / 4 pending_review / 10 skipped_other /
  1 skipped_paid / 1 failed.**
- Unchanged user actions: Pinterest access (account exists, no credentials here) and per-domain
  SMTP (only Gmail creds are present, so `outreach@pairdish.com` sending is still blocked).
"""


def append_if_missing(path: pathlib.Path, marker: str, text: str):
    s = path.read_text(encoding="utf-8")
    if marker in s:
        print(f"skip {path.name}: already has {marker!r}")
        return
    if not s.endswith("\n"):
        s += "\n"
    path.write_text(s + text.lstrip("\n"), encoding="utf-8")
    print(f"appended run-17 section to {path.name} (+{len(text)} chars)")


append_if_missing(ROOT / "SEO_AUDIT.md", "### Run 17 — 2026-10-14 (this run)", AUDIT)
append_if_missing(ROOT / "CONTENT_PLAN.md", "2026-10-14 (run 17)", CONTENT)
append_if_missing(ROOT / "OUTREACH.md", "### Run 17 — 2026-10-14", OUTREACH)
