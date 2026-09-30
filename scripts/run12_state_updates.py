#!/usr/bin/env python3
"""Run-12: write the run-12 sections into SEO_AUDIT.md, CONTENT_PLAN.md and OUTREACH.md."""
import pathlib

ROOT = pathlib.Path("/home/hermes/projects/pairdish")

AUDIT = """
### Run 12 — 2026-09-30 (this run)

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
  `DO THE MATH:\\s*(\\d+)` regex misses them — use `DO THE MATH.{{0,400}}?(\\d+)\\s*\\+\\s*(\\d+)` with
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
- Pre-deploy gate `scripts/run12_qa.py` → **PASS** (tag balance, no `\\uXXXX`, no FAQ, no
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
"""

PROGRESS = """
- 2026-09-30 (run 12): **Three within-gate tool-page expansions, each matched to a live Bing ridge
  (1,409 -> 3,168 words on those pages).** `/tools/flavor-pairing` 526 -> **1,072 w / 1 table** (three
  pairing lenses, the verified 2011 flavor-network finding, a 5-step workflow, tool limits) for the
  ~35-impression flavour/flavor pairing tool cluster; `/tools/party-calculator` 473 -> **1,138 w /
  2 tables** (ISU Extension per-guest quantities, UAEX hourly appetizer counts, a worked 70-guest /
  11-appetizer answer, sheet-cake servings, 40-140 F clock); `/tools/herb-spice-matrix` 410 -> **958 w /
  2 tables** (UD Cooperative Extension per-food seasoning table + 9 named blends + dose guidance).
  QA gate PASS, deploy `2895b848-914a-4a9e-8a7b-a388b1b6a51c`, live verify PASS 3/3, sitemap lastmod
  2026-09-30, Bing SubmitUrlBatch done. Directory: **2 new free submissions** (huludirectory.com,
  marketingwebdirectory.com - both phpLD-5 wizards served at `/submit`). New diagnostic: 27 archived
  legacy `/what-to-serve-with-*/` URLs 404 while Bing spends ~half its crawl budget on 4xx -> when the
  gate opens, ship Batch A at those exact slugs (philly cheesesteak first). Gate still ACTIVE (23 days).
"""

OUTREACH = """
### Run 12 — 2026-09-30
- **Sourcing method (repeat of run 11, still the best yield): sibling-campaign ack mail, not aggregator lists.**
  `scripts/run11_ack_mining.py` (server-side IMAP, subject-filtered) surfaced 4 hosts untried by pairdish:
  `huludirectory.com` and `marketingwebdirectory.com` (fresh 29-Sep acks from sibling campaigns), plus two
  known dead ends — `activdirectory.net` (7-char speckled captcha has failed three separate campaigns) and
  `caida.eu` (confirm link points at an NXDOMAIN domain). 2/2 first-try free submissions from the two live ones.
- **huludirectory.com — submitted.** phpLD-5 URL-param wizard whose form is at **`/submit`**, not `/submit.php`
  (`/submit.php` 404s on both hosts this run — always grep the homepage for its submit href first). Step 2 free
  tier = `LINK_TYPE=1` "Link - free" (3 = article free, 5 = video free, 7 = premium $1.50); step 3 = DO_MATH
  challenge + AGREERULES + `continue`. Marker: "Link submitted". Ack arrived same-day.
- **marketingwebdirectory.com — submitted.** Same wizard, free `LINK_TYPE=1`, step 3 5-char IMAGEHASH captcha.
  Binarised reads (thr 110 → `s3c1s`, MaxFilter/MedianFilter → `11111` / `s37s3`) were all garbage on the thin
  dark-on-light glyphs; three unprocessed reads (native, 4x, 8x) agreed on `92393` and the POST was accepted →
  "Link submitted and awaiting approval". `scripts/dir_run12_wizard.py` holds the reusable flow (probe/post).
- **Mail:** both run-11 submissions (usalistingdirectory.com, britainbusinessdirectory.com) were acked 28-Sep to
  the pairdish alias; **neither needs a click**. The "Action Required" confirmations in Spam are for
  pinbuilds/athenelinks aliases — matched by To: address and deliberately not acted on.
- Tracker after run: **41 rows — 3 listed / 28 submitted / 2 pending_review / 7 skipped_other /
  1 skipped_paid** (`scripts/update_tracker.py summary`).
"""

sm = ROOT / "SEO_AUDIT.md"
t = sm.read_text(encoding="utf-8")
t = t.replace("**Last updated:** 2026-09-28 (durable job run 11)",
              "**Last updated:** 2026-09-30 (durable job run 12)")
t = t.rstrip("\n") + "\n" + AUDIT
sm.write_text(t, encoding="utf-8")
print("SEO_AUDIT.md updated:", len(t), "chars")

cp = ROOT / "CONTENT_PLAN.md"
t = cp.read_text(encoding="utf-8").rstrip("\n")
cp.write_text(t + "\n" + PROGRESS, encoding="utf-8")
print("CONTENT_PLAN.md updated")

ot = ROOT / "OUTREACH.md"
t = ot.read_text(encoding="utf-8")
anchor = "### Run 11 — 2026-09-28"
assert anchor in t, "run-11 log anchor missing"
t = t.replace(anchor, OUTREACH.strip("\n") + "\n\n" + anchor, 1)
ot.write_text(t, encoding="utf-8")
print("OUTREACH.md updated")
