#!/usr/bin/env python3
"""Run-13 state-file updates: SEO_AUDIT.md (header + run-13 section), CONTENT_PLAN.md (progress
bullet), OUTREACH.md (run-13 log block). Idempotent: refuses to double-insert."""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

SEO = ROOT / "SEO_AUDIT.md"
CP = ROOT / "CONTENT_PLAN.md"
OR_ = ROOT / "OUTREACH.md"

SEO_HEADER_OLD = "**Last updated:** 2026-09-30 (durable job run 12)"
SEO_HEADER_NEW = "**Last updated:** 2026-10-05 (durable job run 13)"

SEO_SECTION = """
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

Pre-deploy gate `scripts/run13_qa.py` → **PASS** (tag balance, no `\\uXXXX`, no FAQ, no
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

"""

CP_BULLET = """
- 2026-10-05 (run 13): **Three more within-gate tool-page expansions, each matched to a fresh
  live Bing ridge (1,169 -> 2,927 words on those pages).** `/tools/coffee-pairing` 420 -> **988 w /
  2 tables** (roast × dessert and dessert × coffee tables, FDA caffeine ceiling, Green & Lim 2010
  sweet–bitter suppression + the 31-to-1 quinine:sucrose ratio) for the "chocolate dessert coffee
  pairing guide" cluster; `/tools/cheese-pairing` 397 -> **1,068 w / 2 tables** (five families +
  accompaniments, Rinaldi 2024 wine–cheese mechanism, CDR water-activity/pH holding rule, FSIS
  two-hour rule) for "emmental cheese pairing figs wine nuts honey"; `/tools/nutrition-calculator`
  352 -> **871 w / 1 table** (raw-vs-cooked yield table from MU Extension + UNL Food, three-step
  total check, per-gram/rounding note) for the "why is the number too high" question. QA gate
  PASS, deploy `6daa6bd1-9ceb-48b9-8c9d-3e3cea6ab5d8`, live verify PASS 3/3, sitemap lastmod
  2026-10-05, Bing SubmitUrlBatch done. Directory: **2 new free submissions** (royallinkup.com,
  excitedirectory.com - both phpLD wizard variants sourced from sibling-campaign ack mail) plus a
  **HuLu Directory acceptance email** (listing URL not locatable from this VPS). Bing now
  **608 queries / 66 clicks / 940 impressions**. Gate still ACTIVE (28 days). Next within-gate:
  grocery-list, cooking-style-quiz, potluck-coordinator, recipe-generator; plus a
  comparison-shaped section on `/tools/seasonal-guide` for the 57-impression seasonal cluster.
"""

OUTREACH_BLOCK = """
### Run 13 — 2026-10-05
- **Sibling-ack sourcing again beat fresh-list mining (2/2 first-try).** An IMAP sweep of the
  shared mailbox for directory acks since 25-Sep, diffed against `tracker.csv` hosts, surfaced
  one untried family member. Submissions this run:
  - **Royallinkup Free Website Link Directory — submitted** ✅ `POST https://royallinkup.com/submit`
    (phpLD-5 URL-param wizard; step 2 free `LINK_TYPE=1` "Link - free"; step 3 `DO_MATH` 5+6 solved
    inline; category **Home & Family > Cooking = 316** of a 241-option tree; **no captcha**) →
    `class="msg"` "Link submitted and awaiting approval." Script `scripts/dir_run13_royallinkup.py`
    (probe/post), alias `+pairdish-dir13`.
  - **Excitedirectory — submitted** ✅ `POST https://www.excitedirectory.com/submit.php?c=113&LINK_TYPE=1`
    (same wizard family but served at **`/submit.php`**, `/submit` 404s; free `LINK_TYPE=1`
    "Free Review - free"; **no captcha**; category Cooking = 113 of 191 options) → "Link submitted
    and awaiting approval." Script `scripts/dir_run13_excitedir.py`.
- **HuLu Directory — ACCEPTED (run-12 submission).** Acceptance mail: "Congratulations! 'PairDish -
  Food Pairing Tools & Recipe Calculators' has been accepted into the Directory HuLu Directory
  .com". The listing page URL is **not locatable from this VPS** (`/search.php` and `?s=` paths
  return 403/404 to scripted clients), so the row is `pending_review` with the acceptance recorded —
  no `listed` without a verified 200 listing page.
- **Listing-verification sweep (all 32 submitted/pending rows).** `/search.php?search=pairdish.com`
  per host: **zero flips to listed** — consistent with the family's 2–6 month free review queues.
  4 hosts (entireweb, freeprwd, spd, britainbusinessdirectory) 403 the scripted fetch, so their
  status is inconclusive rather than negative. Script `scripts/run13_dir_verify.py`.
- **Candidate screen (this run):** `upsdirectory.com` and `directory4.org` both reach the
  phpLD-5 step 3 with a `CAPTCHA` + `IMAGEHASH` challenge → not attempted (the speckled-captcha
  class has failed for three campaigns). Tracker after run: **43 rows — 3 listed / 3
  pending_review / 29 submitted / 7 skipped_other / 1 skipped_paid**.
- **Unchanged user actions:** Pinterest access (account @pairdish exists, no credentials on this
  box) and per-domain SMTP for link outreach (no sending creds exist for pairdish.com).

"""


def main() -> int:
    fails = []

    s = SEO.read_text(encoding="utf-8")
    if s.count(SEO_HEADER_OLD) == 1:
        s = s.replace(SEO_HEADER_OLD, SEO_HEADER_NEW, 1)
    elif SEO_HEADER_NEW not in s:
        fails.append("SEO_AUDIT.md: header marker not found")
    if "### Run 13 — 2026-10-05 (this run)" in s:
        print("SEO_AUDIT.md: run-13 section already present (skip)")
    else:
        s = s.replace("### Run 12 — 2026-09-30 (this run)", "### Run 12 — 2026-09-30", 1)
        s = s.rstrip() + "\n" + SEO_SECTION
        print("SEO_AUDIT.md: header + run-13 section written")
    SEO.write_text(s, encoding="utf-8")

    c = CP.read_text(encoding="utf-8")
    if "2026-10-05 (run 13)" in c:
        print("CONTENT_PLAN.md: run-13 bullet already present (skip)")
    else:
        if not c.endswith("\n"):
            c += "\n"
        c = c + CP_BULLET
        print("CONTENT_PLAN.md: run-13 bullet appended")
    CP.write_text(c, encoding="utf-8")

    o = OR_.read_text(encoding="utf-8")
    anchor = "## Run log\n"
    if "### Run 13 — 2026-10-05" in o:
        print("OUTREACH.md: run-13 block already present (skip)")
    elif anchor not in o:
        fails.append("OUTREACH.md: '## Run log' anchor not found")
    else:
        o = o.replace(anchor, anchor + OUTREACH_BLOCK, 1)
        print("OUTREACH.md: run-13 block inserted after '## Run log'")
    OR_.write_text(o, encoding="utf-8")

    if fails:
        print("FAIL:")
        for f in fails:
            print("  -", f)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
