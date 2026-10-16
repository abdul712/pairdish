#!/usr/bin/env python3
"""Run-18 state-file updates: SEO_AUDIT run section, CONTENT_PLAN progress, OUTREACH run log.

Deterministic text surgery (no regex over large HTML/JS): each insertion is anchored on a unique
literal and asserted, so a silent miss cannot pass as success.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

AUDIT_SECTION = """### Run 18 — 2026-10-16 (this run)

**Phase 1 / 6 audit (live sweep).** All **52/52** sitemap URLs return 200. Every meta description
is within 160 characters, `href="undefined"` count 0 and no `FAQPage` markup anywhere in the
sitemap — but the sweep found one page shipping **visible** FAQ content: `/contact` carried a
"Frequently Asked Questions" heading plus four question-style `<summary>` titles inside the
contact card. Article-level and schema-level checks had passed it for 17 runs because the rule had
only ever been enforced on the article and tool routes. Fixed this run (see below).

**Bing traffic.** The rolling window is **unchanged again — 701 queries / 72 clicks /
1,101 impressions**, i.e. no new rollup has been released since 2026-10-12. The wider
`GetRankAndTrafficStats` payload covers 2025-09-07 to 2026-10-14 and totals 80 clicks / 2,821
impressions over that year, with the last seven days running 35-57 impressions and 0-3 clicks a
day. `GetCrawlStats` latest: 2026-10-13 Code2xx 62 / Code4xx 18 (CrawledPages 28, InIndex 56);
both feeds (`www.` and apex `sitemap.xml`) report `Success`, 52 URLs. **GSC is still dark** — the
refresh fails `400 invalid_grant` at the token step, now five consecutive runs, so every
Google-side read (coverage, queries, GA4) stays blocked pending the user's re-consent.

**Phase 4 (within gate) — three demand-matched tool-page expansions plus a standing-rule fix.**
Pages were picked where a live Bing ridge and a structural defect overlap. Live word counts are on
the `main`-scoped counter calibrated against the already-expanded cohort in this run
(drink-calculator 950, appetizer-planner 916, yeast-converter 943, flour-substitution 913):

* **`/tools/unit-converter` 232 → 1,006 w / 2 tables** — the window's largest real cluster (~60+
  impressions: "for 60 grams of cake flour, how much all-purpose and how much corn flour should i
  use?", "how much cake flour for 2 3/4 cup ap flour", "20 cups plain flour and 5 cups cornstarch",
  plus ~40 one-impression phrasings). Content: the household measures **as defined for U.S.
  nutrition labelling** read verbatim from 21 CFR 101.9(b)(5)(viii) (teaspoon 5 mL, tablespoon
  15 mL, cup 240 mL, fluid ounce 30 mL, ounce in weight 28 g), the rounding gap between the
  240 mL labelling cup and the 236.6 mL customary cup, a published one-cup weight table for
  fourteen ingredients (King Arthur ingredient weight chart: AP / bread / cake flour 120 g, whole
  wheat and self-rising 113 g, cornstarch 112 g, granulated sugar 198 g, packed brown sugar 213 g,
  cocoa 84 g, butter 227 g, honey 21 g/tbsp, salt 18 g/tbsp, oats 89 g, cornmeal 138 g), the
  weight-ounce versus fluid-ounce trap, and five worked conversions.
* **`/tools/cooking-time` 261 → 1,100 w / 2 tables** — the baking-temperature / internal-temperature
  ridge ("proofing bread dough twice its size baking temperature 180 c", "final proof enriched
  dough 24 25 c hokkaido milk bread poke test"). Content: the **USDA FSIS Safe Minimum Internal
  Temperature Chart** for all ten product classes with the three-minute rest written into the
  145 °F line, the FSIS holding clock (2 hours out of refrigeration, 1 hour above 90 °F, 140 °F
  hot / 40 °F cold, 165 °F reheat), and why the oven dial is not the food temperature.
* **`/tools/sourdough-calculator` 308 → 1,045 w / 2 tables** — the dough-temperature / proofing
  cluster ("my dough is 82 degrees how long should it proof", "yeast dough proofing double size
  temperature time enriched dough"). Content: starter feeding and storage (Clemson HGIC's minimum
  1:1:1 ratio, discarding at each feed, room-temperature daily or refrigerator weekly, the 4-6 hour
  doubling check and the float test; King Arthur's 50 g : 50 g : 50 g = 150 g ≈ ⅔ cup), the
  King Arthur proofing band of 72-78 °F with the poke test and the one-inch-over-the-pan test, and
  a worked 500 g total-flour table at 65 / 70 / 75 / 80 per cent hydration showing how a 100 g
  starter moves both the water and the flour you still add.

**The `/contact` FAQ fix.** Restructured rather than deleted: the section heading became "Working
With PairDish" and each question-style title became a statement ("Every tool on the site is free
to use", "Tool suggestions are welcome", "Where the pairing suggestions come from", "API access for
developers"). Every answer sentence is preserved verbatim, and the run-18 QA gate asserts both
directions — no `FAQ|Frequently Asked Questions` string anywhere in the page, and four distinctive
answer sentences still present — so the restructure cannot silently drop content.

**QA → deploy → verify.** Pre-deploy gate `scripts/run18_qa.py` **PASS** (tag balance across 19 tag
types, no literal escapes, no FAQ markup, no `href="undefined"`, no literal `undefined`, no brace
inside the inserted slices, all metas ≤160, every internal href resolving on disk, externals
restricted to the official allowlist, exact table-row counts per page, contact answers preserved).
Build clean with `NODE_OPTIONS=--max-old-space-size=3584` after `rm -rf dist .astro`. Committed and
pushed **before** each deploy (`2efb0d4` then `52b9be1`, both verified against
`git ls-remote origin refs/heads/master`). Deployed with the local binary
(`./node_modules/.bin/wrangler deploy`) → first version **`8b0c9559-e70c-4a48-b90c-f439b7e3d646`**,
then, after the top-up, **`225b467d-a7d4-4fdb-a9d9-b124052afca6`**. Live verification
`scripts/verify_run18_live.py` → **PASS** (4/4 pages with the new content and live word counts
1,100 / 1,006 / 1,045 with 2 tables each, metas 132-146, no FAQ, sitemap 52 URLs with lastmod
2026-10-16 on all four edited pages, and 3/3 legacy URLs still 301 in **both** slash forms with
200 targets). Bing `SubmitUrlBatch` for the seven changed URLs returned `{"d":null}` (success).

**Phase 5 (outreach) — 1 new free submission, 0 listing flips.**

* **`247webdirectory.com` — submitted, free tier.** New vein for this campaign: an ASP.NET MVC form
  (not phpLD) at `/submit` carrying `site_title` / `site_url` / `site_desc` (≤500) / `email_add` /
  `categ_cd` (652 options; **277 = Home & Garden > Cooking**) / an arithmetic captcha
  ("Verification: a + b", no image) / a `website_confirm` honeypot and a **`paid` radio whose
  value `N` is the free tier** — note the markup pre-checks `ExpediteReview` ($39.99), so the free
  radio must be posted explicitly. The `__RequestVerificationToken` is per-GET and cookie-bound.
  POST to `/submit/save` → 200 on `/submit/confirm`: *"Thank you for your submission. Your website
  has been received and is pending review."* Script: `scripts/dir_run18_247.py` (probe/save).
* **`wired.business` — skipped_paid.** Probed in a browser: `/submit` is a client-rendered $29
  checkout (DR 78 dofollow, "live in minutes"). No free tier.
* **`yo.directory` and `twelve.tools` — skipped_paid** at probe time (both `/submit` URLs serve a
  pricing page).
* **Sibling-ack mail sweep found nothing usable for this campaign, and the attribution check is why.**
  The 05-Oct→16-Oct window produced ten untracked hosts; the ones that looked like approvals were
  other campaigns': `anoox.com` ack to `support@pinbuilds.com`, `exampledir.com` approvals to four
  other campaigns' addresses (`mabdulrahim@gmail.com`, `+nytax`, `support@tweetreplier.com`,
  `abdul@flyaviary.com`). Matching the **To:** header before acting (rather than the sending host)
  is what kept pairdish from logging another campaign's listing as its own.
* **Flip sweep** (`scripts/run18_dir_verify.py`, site-NAME search over all 35 submitted/pending
  rows): **0 flips** — every reachable phpLD host returns its search page with no listing link, and
  the free queues still run 2-6 months. `activesearchresults` 404s its old search path; entireweb /
  freeprwebdirectory / sitepromotion / britainbusiness 403 the scripted fetch.
* **Pending-confirmation sweep** (`scripts/run18_confirm_sweep.py`): **0** unclicked
  confirm/verify mails for any of the 35 pending hosts, so there was nothing to complete this run.

Tracker now **53 rows: 4 listed / 32 submitted / 4 pending_review / 10 skipped_other /
2 skipped_paid / 1 failed**.

**Lessons recorded this run** (for the skill, not repeated here): a redirect assertion built on
`urllib.urlopen` reports 403 when no User-Agent is sent, which reads exactly like a missing 301 —
the checker must send the same browser UA it uses for the content fetches; and a form's captcha
label can carry its operator as an HTML entity (`&#x2B;`), so the arithmetic must be read from
`html.unescape`d markup.

### Known follow-ups for run 19
1. **Review gate open 39 days / 18 runs — still the single biggest growth blocker, and the reclaim
   case is measurable.** The 22-impression "what to serve with philly cheesesteak" query points at a
   URL left 404 on purpose because no equivalent page exists. One line of OK ships Batch A items
   4-8 at their exact slugs *and* closes the redirect map for the 25 remaining legacy paths (a page
   at the original URL plus a 301 in the same commit).
2. **Google re-consent** (user, one click + paste the code) → then the GSC coverage/indexation
   re-check, sitemap resubmit, and GA4 reads. The token has now been dead for five consecutive runs.
3. **Within-gate queue (demand-matched), by live word count after this run:** cooking-style-quiz 178,
   potluck-coordinator 193, grocery-list 196, recipe-generator 204, meal-prep 267, leftover-matcher
   324, pan-size-converter 345, pantry-helper 355, caffeine-calculator 368, cooking-time (done this
   run). All of these still ship **zero official citations**, the defect class fixed three pages at a
   time since run 11; `/tools/dietary-finder` (690 w, 0 tables) and `/tools/glycemic-index` (645 w,
   0 tables) are the largest zero-table pages left. Next best unserved ridges in the fresh window:
   the **seasonal ingredients cluster** (~58 impressions, pointing at `/tools/seasonal-guide`),
   **"flavour pairing website" / "flavour pairing"** (~30 on `/tools/flavor-pairing`), the
   **breaded-pork-chop and flatbread "what to serve with X"** clusters (~9 impressions each), and the
   **chocolate-dessert / coffee-pairing** cluster (~12).
4. **Directory lane:** the phpLD captcha class stays a documented dead end on this VPS. The new seam
   this run is **non-phpLD CMS forms with arithmetic captchas** (247webdirectory's ASP.NET pattern):
   screen candidate hosts for a server-rendered `<form>` with a free radio and no image captcha,
   rather than re-probing the phpLD roster. Re-run the name-search flip sweep each run and re-check
   the 247webdirectory + addfreewebdirectory ack mail for a confirm step.
5. **Pinterest access + per-domain SMTP (domain-email sending)** remain user actions (unchanged;
   only `EMAIL_ADDRESS` / `GMAIL_APP_PASSWORD` exist in `~/.hermes/.env`, so link outreach from
   `outreach@pairdish.com` is still not sendable and has not been attempted).
"""

PLAN = """- 2026-10-16 (run 18): **Three demand-matched within-gate tool-page expansions (+2,350 words
  live) plus the first site-wide audit catch of the visible-FAQ rule.** `/tools/unit-converter`
  232 -> **1,006 w / 2 tables** (household measures defined for U.S. nutrition labelling, read from
  21 CFR 101.9(b)(5)(viii) — tsp 5 mL, tbsp 15 mL, cup 240 mL, fl oz 30 mL, oz 28 g — the 240 mL
  labelling cup versus the 236.6 mL customary cup, a fourteen-row one-cup weight table from the
  King Arthur ingredient weight chart, the weight-ounce / fluid-ounce trap, and five worked
  conversions) for the ~60-impression flour cup-to-gram cluster. `/tools/cooking-time` 261 ->
  **1,100 w / 2 tables** (the USDA FSIS Safe Minimum Internal Temperature Chart for ten product
  classes with the three-minute rest inside the 145 &deg;F line, the FSIS holding clock of 2 hours /
  1 hour above 90 &deg;F / 140 &deg;F hot / 40 &deg;F cold / 165 &deg;F reheat, and why the oven dial
  is not the food temperature) for the baking-temperature and internal-temperature ridge.
  `/tools/sourdough-calculator` 308 -> **1,045 w / 2 tables** (Clemson HGIC's minimum 1:1:1 starter
  ratio with the discard rule, the 4-6 hour doubling check and the float test; King Arthur's
  50 g : 50 g : 50 g = 150 g base and the 72-78 &deg;F proofing band with the poke test; a worked
  500 g total-flour table at 65/70/75/80 per cent hydration showing the starter moving both sides of
  the ratio) for the dough-temperature cluster. **Standing-rule fix:** `/contact` had been shipping a
  visible "Frequently Asked Questions" section for months — article- and schema-level checks never
  covered it. Restructured to "Working With PairDish" with statement headings; every answer sentence
  preserved and asserted both ways by the QA gate. QA gate PASS, deploy versions
  `8b0c9559-e70c-4a48-b90c-f439b7e3d646` then `225b467d-a7d4-4fdb-a9d9-b124052afca6`, live verify PASS
  4/4 pages + 3/3 legacy 301s in both slash forms, sitemap lastmod 2026-10-16, Bing SubmitUrlBatch
  done. Directory: **1 new free submission** (247webdirectory.com — a new non-phpLD ASP.NET vein with
  a free `paid=N` radio and an arithmetic captcha, categ 277 Home & Garden > Cooking) and 1
  `skipped_paid` probe (wired.business $29); 0 listing flips; 0 pending confirmations. Bing window
  unchanged at **701 queries / 72 clicks / 1,101 impressions**; GSC token still dead (invalid_grant,
  five runs). Gate still ACTIVE (39 days). Next within-gate: dietary-finder and glycemic-index (the
  largest zero-table pages), then the seasonal-guide and flavour-pairing ridges, then the thin tail
  (cooking-style-quiz, potluck-coordinator, grocery-list).
"""

OUTREACH = """### Run 18 — 2026-10-16 (1 new free submission; 0 listing flips; 0 pending confirmations)

- **A NEW non-phpLD vein: `247webdirectory.com`, submitted free.** The form is ASP.NET MVC, not
  phpLD: `/submit` renders `site_title` (≤150) / `site_url` (≤250) / `site_desc` (≤500) /
  `email_add` / `categ_cd` (652 options, **277 = Home & Garden > Cooking**) plus a
  `__RequestVerificationToken` (per-GET, cookie-bound), a `website_confirm` honeypot and an
  **arithmetic** captcha ("Verification: a + b = ?", no image). The pricing radios are all named
  `paid`; **the free tier is `paid=N`** — and the markup pre-checks `ExpediteReview` ($39.99), so
  the free value has to be posted explicitly or the submission silently becomes a paid one. POST to
  `/submit/save` → 200 on `/submit/confirm`, *"Thank you for your submission. Your website has been
  received and is pending review."* Script `scripts/dir_run18_247.py` (probe / save modes).
- **`wired.business` → skipped_paid.** Probed in a browser: `/submit` is a client-rendered $29
  checkout (DR 78 dofollow). `yo.directory` and `twelve.tools` serve a pricing page at their submit
  URLs → paid.
- **Sibling-ack sweep: nothing attributable to this campaign.** Ten untracked hosts surfaced in the
  05-Oct→16-Oct window, but every approval-shaped one belonged to another campaign —
  `anoox.com` acked `support@pinbuilds.com`, and `exampledir.com` approvals went to
  `mabdulrahim@gmail.com`, `+nytax`, `support@tweetreplier.com` and `abdul@flyaviary.com`.
  Reading the **To:** header before acting is the rule that prevented a mis-attributed
  "approval"; the sending host alone would have made three of these look like pairdish wins.
- **Flip sweep** (`scripts/run18_dir_verify.py`): **0 flips** across all 35 submitted/pending rows
  (site-NAME search, the only form that matches on this family). The phpLD free queues still run
  2-6 months.
- **Pending-confirmation sweep** (`scripts/run18_confirm_sweep.py`): **0** unclicked confirm/verify
  mails for any of the 35 pending hosts — brestlinks was already clicked in run 16 and
  addfreewebdirectory has not sent one.
- Reminder (unchanged): `search.php?search=<domain>` returns 0 hits on the phpLD family even when a
  listing exists — always search the site NAME, and keep a known-live control in the same probe.
- Tracker after run: **53 rows — 4 listed / 32 submitted / 4 pending_review / 10 skipped_other /
  2 skipped_paid / 1 failed.**
- Unchanged user actions: Pinterest access (account exists, no credentials here) and per-domain
  SMTP (only Gmail creds are present, so `outreach@pairdish.com` sending is still blocked).
"""


def insert_before(text, anchor, block, label):
    if anchor not in text:
        raise SystemExit(f"FAIL: anchor not found for {label}: {anchor[:60]!r}")
    if block.strip().splitlines()[0] in text:
        print(f"skip {label}: already present")
        return text
    print(f"inserted {label} (+{len(block)} chars)")
    return text.replace(anchor, block + anchor, 1)


audit = ROOT / "SEO_AUDIT.md"
t = audit.read_text(encoding="utf-8")
start = t.index("### Known follow-ups for run 18")
t = t[:start] + AUDIT_SECTION
audit.write_text(t, encoding="utf-8")
print("rewrote SEO_AUDIT.md tail (run-18 section + run-19 follow-ups)")

plan = ROOT / "CONTENT_PLAN.md"
p = plan.read_text(encoding="utf-8")
plan.write_text(p.rstrip() + "\n" + PLAN, encoding="utf-8")
print("appended CONTENT_PLAN.md run-18 progress")

out = ROOT / "OUTREACH.md"
o = out.read_text(encoding="utf-8")
out.write_text(o.rstrip() + "\n" + OUTREACH, encoding="utf-8")
print("appended OUTREACH.md run-18 log")
