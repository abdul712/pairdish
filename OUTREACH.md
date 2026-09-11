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