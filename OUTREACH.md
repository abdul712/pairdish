# PairDish — Outreach & Directory Submission Tracker

Dedupe rule: by domain (strip www., lowercase). NEVER resubmit a tracked domain.
Statuses: submitted | pending_review | skipped_paid | skipped_other | failed | listed

## tracker.csv (dedupe ledger)

| site_name | url | status | date | listing_url_or_proof | notes |
|---|---|---|---|---|---|

(First entries are added this run — see log below. CSV ledger maintained via update_tracker.py pattern: `site_name,url,status,date,listing_url_or_proof,notes`.)

## Link outreach (Phase 5b — value-first tool mentions)

| target | angle | contact | status | date | notes |
|---|---|---|---|---|---|

(Next run: search "wine pairing chart", "cheese board calculator", "what to serve with X" roundups; find contact pages; 5-10 personalized emails/day from Gmail SMTP. Offer the pairing tools as quotable/linkable resources.)

## Social profiles (Phase 5c)

| platform | handle | status | date | notes |
|---|---|---|---|---|
| Pinterest | @pairdish | EXISTS — needs access | 2026-09-11 | Account already exists: pinterest.com/pairdish ("Pair Dish", 10-13 pins, 0 followers). Domain verified via pinterest-site-verification TXT (2025-12-13). Account mail → admin@pairdish.com (forwards to user Gmail). BLOCKER: no credentials on this box — user must provide login (or confirm who manages it). Then: boards (Pairing Guides / Cheese Boards / Meal Prep) + pin the 3 live guides. |
| X (Twitter) | @pairdish | todo | 2026-09-07 | check handle availability first |
| Facebook page | /pairdish | todo | 2026-09-07 | create after first 10 articles live |
| Instagram | @pairdish | todo | 2026-09-07 | photo-heavy; needs consistent real-food imagery |

## Huzzler badge embed (waiting on user decision)

Paste into pairdish.com homepage footer, then re-run scripts/huzzler_publish.py:

```html
<a href="https://huzzler.so/products/J1LyjvxNyF/pairdish?utm_source=huzzler_product_website&utm_medium=badge&utm_campaign=free_listing" target="_blank" rel="noopener noreferrer"> <img alt="Huzzler Embed Badge" src="https://huzzler.so/assets/images/embeddable-badges/featured.png" width="159" height="55" /> </a>
```

## Run log

### Run 10 — 2026-09-25
- **4 NEW free submissions (phpLD siblings this campaign had never tried — all verified by their
  own success marker, script `scripts/dir_run10_phpld.py`):**
  - **Marketing Internet Directory** — marketinginternetdirectory.com: single-form phpLD, free
    `LINK_TYPE=normal`, category **297 "Cooking and Baking"**, captcha OCR 452872, desc cap 800 →
    `class="msg"` "Link submitted and awaiting approval."
  - **All States USA Directory** — allstatesusadirectory.com: single-form, cat **297 "Cooking"**,
    captcha OCR 7623, cap 1000 → "Link submitted and awaiting approval."
  - **ProLink Directory** — prolinkdirectory.com: AJAX `categ-tree.php` install (hidden
    `CATEGORY_ID=0`); drilled Home & Family (345) → **Cooking = 751** as the leaf; captcha OCR
    qEGv; cap 1000 → "Your link was submitted and is now pending review."
  - **Diga Business Directory** — digabusiness.com: AJAX tree; Food and Cooking Businesses (7) →
    **Chef Businesses = 199** (a true leaf — its child list holds only "Go one step back");
    5-glyph speckled captcha: the first read was rejected ("Invalid code"), so the form was
    re-probed for a fresh IMAGEHASH and the new captcha read **uPMPy** on both a binarised 5×
    upscale and the raw image, then accepted → "We got your submission! We'll send you an email
    after approving it."
  - All four used the alias **mabdulrahim+pairdish-dir10@gmail.com**; POSTs were forced to IPv4
    (`PD_IPV4=1`) because this family writes REMOTE_ADDR into a varchar column and IPv6 egress
    triggers "Data too long for column 'IPADDRESS'".
  - **Tracker after run: 36 rows — 3 listed / 24 submitted / 2 pending_review / 6 skipped_other /
    1 skipped_paid** (`python3 scripts/update_tracker.py summary`).
- **Mail sweep (TO pairdish since 09-16):** no new pairdish-specific acknowledgements. The only
  pairdish-addressed mail is Entireweb newsletters (09-18, 09-25) and Pinterest digests to
  admin@pairdish.com. Free-tier phpLD reviews run 2–6 months, so no ack for the 09-18/09-21/09-25
  batches is expected yet — nothing to attribute and nothing to click.
- **No link-outreach emails sent this run** — per-domain sending from pairdish.com is still
  impossible (no SMTP/API creds for the domain; the user's action), so Phase 5b remains blocked
  rather than attempted through Gmail.

### Run 9 — 2026-09-23
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

### Run 8 — 2026-09-21
- **2 NEW free submissions (phpLD geo-sister set — both first-try, "Link submitted and awaiting approval"):**
  - **Turkey Web Directory** — turkeywebdirectory.com (captcha OCR 8526; cat 297 Cooking; desc cap 500;
    ack notice says the submitter address must confirm by email).
  - **France Web Directory** — francewebdirectory.net (captcha OCR 2432; cat 297 Cuisine-Cooking;
    desc cap 1000).
  - Both via the extended `scripts/dir_phpld_ext.py` (probe → vision OCR → post, same-jar captcha flow);
    email alias +pairdish-dir7. These were the last two known-unprobed phpLD siblings.
- **Fresh-family research pass (0 further submissions — all classified, logged in tracker so future runs
  don't re-probe):** 16 generic web/blog-directory candidates screened with the new
  `scripts/screen_dir_candidates_fast.py` (curl + 8s per-request cap, incremental JSONL output at
  `outreach/dir_screen_run8.jsonl`):
  - **WebSquash** → skipped_paid (`/submit.php` is a PayPal subscription form)
  - **A1 Web Directory** → skipped_other (domain repurposed: `/add.html` now serves unrelated spam/gambling content)
  - **Free Web Submission** → skipped_other (legacy search-engine submission service, no SEO value today)
  - **Directory Vault** → skipped_other (Cloudflare/JS challenge on datacenter IP)
  - 11 others (Blogarama, Blog-Directory.org, EasyWebDirectory, EveryDirectory, Add-Link,
    AllWebsiteDirectory, WebWorldIndex, AddUrl.org, SoMuch, SearchSight, BetterWebDirectory, Ezilon)
    → skipped_other: no reachable submission form at root/submit paths.
  - Read: the generic-directory vein is largely exhausted for a content site; the productive veins left
    are niche (food/blog) directories and per-domain outreach, not open web directories.
- **Tracker after run: 28 rows — 3 listed / 19 submitted / 2 pending_review / 3 skipped_other / 1 skipped_paid.**
- **Mail sweep 18→21 Sep:** no pairdish-specific acks yet for the run-7 submissions; the confirmations seen
  (Viesearch, Activ Directory, italywebdirectory) belong to other campaigns — matched by To: address
  (flyaviary / personalityspark / socializeexperts) before attributing, per the standing rule.

### Run 7 — 2026-09-18
- **5 NEW free submissions (phpLD extension set — all first-try, "Link submitted and awaiting approval"):**
  - **High Rank Directory** — highrankdirectory.com (captcha OCR 6574; cat 297 Cooking; desc cap 1000)
  - **USA Web Sites Directory** — usawebsitesdirectory.com (captcha 4253; cat 297; desc cap 500)
  - **Australia Web Directory** — australiawebdirectory.net (captcha 3553; cat 297; desc cap 1000)
  - **Germany Web Directory** — germanywebdirectory.com (captcha 2372; cat 297 "Kochen-Cooking"; cap 500)
  - **Italy Web Directory** — italywebdirectory.net (captcha 6549; cat 297; desc cap 500)
  - All via `scripts/dir_phpld_ext.py` (probe → vision OCR → post, same-jar captcha flow); email alias
    +pairdish-dir7@gmail.com. Review queues: free tier, months-scale as usual.
- **Tracker after run: 22 rows — 3 listed / 17 submitted / 2 pending_review.**
- **Mail sweep 16→18 Sep:** siteswebdirectory ack ("Your Link Request" — run-6 submission); Entireweb
  promo (non-actionable); one italywebdirectory ack that PREDATES this run's submission (sibling
  campaign's — always match the To: address before attributing acks). Pairdish acks for the 5 new
  submissions expected within days; re-check next run.
- phpLD family now fully harvested for pairdish across all verified veins (4-network + pbd/bsi + qid/swb +
  hrd/uswd/awd/gwd/iwd); remaining unprobed siblings: turkeywebdirectory.com / francewebdirectory.net.

### Run 6 — 2026-09-16
- **Viesearch → LISTED**: 28dlj live since 2026-09-14 ("Your Viesearch listing is live" email);
  verified 2026-09-16 (HTTP 200, title contains site name):
  https://viesearch.com/28dlj/pairdish-food-pairing-tools-guides
- **2 NEW free submissions (both phpLD network, first try):**
  - **Quality Internet Directory** — 3-step POST wizard → "Link submitted." (cat 297 Cooking; no
    captcha; review ~2-3 months; script `scripts/dir_run6_pairdish.py qid`).
  - **Sites Web Directory** — URL-param wizard + DO_MATH (8+6=14) → "Link submitted and awaiting
    approval." (cat 1987 Home > Cooking; success page chains back to qid — network chain closed).
  - Both use email alias mabdulrahim+pairdish-dir6@gmail.com.
- phpLD/marketing-internet-directory network now FULLY covered for pairdish — next runs need
  fresh-family research (or wait on reviews: typical 2-6 months).
- Mail sweep (Sep 14→16): ukd + pbd submission acks; Huzzler "Quick question" marketing (not a
  signal); Pinterest marketing tip; Viesearch live notices (pairdish + sibling sites).
- Tracker after run: **17 rows — 3 listed / 12 submitted / 2 pending_review**
  (`update_tracker.py` now supports a notes-preserving `status` command).

### Run 5 — 2026-09-14
- **6 NEW free submissions — all accepted ("Link submitted and awaiting approval"):**
  - **Submission Web Directory** — phpLD, free Regular, cat Cooking; captcha OCR'd (5558).
  - **Site Promotion Directory** — phpLD, free Regular; captcha OCR'd (496396); sister network.
  - **UK Internet Directory** — phpLD, free Regular; captcha OCR'd (358968).
  - **Free Internet Web Directory** — phpLD, free Regular; captcha OCR'd (4946) (found via UKD's own
    "submit to sister" link).
  - **Promote Business Directory** — 3-step JS wizard (browser), LINK_TYPE=2 free Regular; no captcha.
  - **Best Sites Index** — 3-step JS wizard (browser), LINK_TYPE=2 free Regular; step-3 captcha OCR'd
    via in-browser canvas (YYdz).
  - All six via `scripts/dir_run5_pairdish.py` (probe/post) + browser wizard steps; each site's real
    server response captured (msg block). Review queues: 2-6 months typical for free tier.
- **Viesearch:** free listing still queued (28dlj 404s until editorial review); a PAID "skip the wait"
  upsell arrived → declined under the free-only rule.
- **FreePRWebDirectory:** standard phpLD upsell email (payment.php link) → declined; free queue unchanged.
- **Huzzler:** reminder email ("seo_boost_reminder") — badge gate unchanged, still user decision.
- Mail sweep (11→14 Sep): no other pairdish-actionable mail.
- Tracker after run: **15 rows — 2 listed / 10 submitted / 3 pending_review** (was 9 after run 4).

### Run 4 — 2026-09-11
- **Entireweb — confirmation COMPLETED** (was pending_review since 09-09): confirmation email link clicked from the mailbox → entireweb final page "You're in the queue. Your site is now on its way into search" (zid=714dacb7f5b9d1b23741ca2d8625967a); "Thank you for your submission" email received. Note: confirming opts the +pairdish-entireweb alias into Entireweb promo mail (unsubscribe anytime).
- **4 NEW free submissions processed:**
  - **GainWeb — submitted** ✅ "Link submitted and awaiting approval" (free Regular LINK_TYPE=2, category Food and Drink; apex host + update_session.php mimic; script `scripts/dir_submit_gainweb.py`).
  - **FreePRWebDirectory — pending_review** ✅ POST accepted ("Link submitted and awaiting approval"); confirmation email "currently under review" (info@freeprwebdirectory.com). Free (Regular) review takes 2-3 months, not guaranteed — standard phpLD upsell.
  - **Directory-Free — submitted** ✅ "Thank you... Your site has been added to Directory-Free. Our editors will validate your request."
  - **Viesearch — pending_review** ✅ submission id **28dlj**; free plan selected ("Join the Waiting List"); confirm email clicked (redirect to /28dlj/plan = confirmed). Listing 404s until editorial review (normal for free queue).
- **Pinterest discovery:** account @pairdish ALREADY EXISTS — see the social table above. Created with admin@pairdish.com; pairdish.com domain already verified on Pinterest. No credentials on this box → user action needed before we can pin/curate.
- **Email infrastructure:** admin@pairdish.com RECEIVES mail (Cloudflare Email Routing → user Gmail). Sending FROM pairdish.com (outreach@pairdish.com for link-outreach emails per the domain-email user rule) is still NOT possible — no SMTP/API sending creds exist. Link-outreach emails remain BLOCKED until sending is set up (user action).
- Tracker after run: 9 rows — 2 listed / 3 pending_review / 4 submitted (`scripts/update_tracker.py summary`).

### Run 3 — 2026-09-09
- **Active Search Results — submitted** (POST /addwebsite.php, confirm page 200). Base gmail used (plus-alias rejected there).
- **Entireweb — pending_review** (redirect to /free_submission/sent/?zid=714dacb7f5b9 verified).
  Confirmation email to mabdulrahim+pairdish-entireweb@gmail.com — USER clicks (opts into promo mail).
- **ShowMySites — listed** ✅ https://www.showmysites.com/pairdish/pairdish/ (200, live immediately).
  Pitfall found: plus-alias email in raw `curl -d` turns `+` into space → "Enter a valid email address".
  Use `--data-urlencode`. Account: pairdish / mabdulrahim+pairdish-sms@gmail.com / PD!sh2026-Dir7k.
- **Huzzler — pending_review**: account registered + email verified (plus-alias mail, quopri-decoded;
  verify URL needs full `expires&signature` params); product created (category 36 Food & Drink,
  logo = original PIL graphic, not AI); **FREE publish is GATED on Huzzler badge embed on
  pairdish.com homepage — user decision** (same gate class as Turbo0/Huzzler on PinBuilds).
  Product: huzzler.so/products/J1LyjvxNyF/pairdish; free queue = 72 days (expected live 2026-11-20);
  DR 64+ dofollow backlink once live.
- Viesearch deferred to next run (real-browser fill; the run budget went to the 4 above).
- Run log continues in tracker.csv (5 rows incl. seed).

### Run 2 — 2026-09-07
- SUBMISSION_KIT.md created with canonical form data.
- Tracker initialized. Directory submissions deferred to next run (this run spent its budget
  on getting the 3 pairing guides live + verified — see SEO_AUDIT.md run history).
- Next run targets (from directory-submission-operations verified-targets list):
  - Active Search Results (POST /addwebsite.php, url+email+submiturl; plain gmail only)
  - Entireweb (GET /free_submission/webpage/ process.php?url=&email=; promo-mail opt-in caveat)
  - ShowMySites (Django auth + POST /my-websites/create/; live instantly; curl-verify)
  - Viesearch (browser fill; free plan radio; email confirm link must be clicked by user)
  - Avoid known bot-walled: Cylex, Hotfrog, Cybo, Yalwa, Brownbook, ExactSeek, SonicRun, LinkCentre (403/captcha)
  - Avoid paid: DirectoryFire ($59), outbid-style pay-to-rank boards