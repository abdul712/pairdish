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
| Pinterest | @pairdish | todo | 2026-09-07 | HIGH-VALUE for food niche; create board structure: Pairing Guides / Cheese Boards / Meal Prep |
| X (Twitter) | @pairdish | todo | 2026-09-07 | check handle availability first |
| Facebook page | /pairdish | todo | 2026-09-07 | create after first 10 articles live |
| Instagram | @pairdish | todo | 2026-09-07 | photo-heavy; needs consistent real-food imagery |

## Run log

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