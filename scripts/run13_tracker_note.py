#!/usr/bin/env python3
"""Run-13: append the HuLu Directory acceptance finding to its tracker note (never replace)."""
import csv
import pathlib

TRACKER = pathlib.Path("/home/hermes/projects/pairdish/outreach/tracker.csv")
FIELDS = ["site_name", "url", "status", "date", "listing_url_or_proof", "notes"]

rows = list(csv.DictReader(open(TRACKER, encoding="utf-8", newline="")))
n = 0
for r in rows:
    if r["site_name"].startswith("HuLu"):
        r["status"] = "pending_review"
        extra = (" | 2026-10-05 (run-13): acceptance email received ('Congratulations! "
                 "\"PairDish - Food Pairing Tools & Recipe Calculators\" has been accepted into the "
                 "Directory HuLu Directory .com'); listing page URL not yet locatable - the site's "
                 "/search.php?search= and ?s= paths return 403/404 to this VPS, so status = approved "
                 "by email, live listing unverified.")
        if "acceptance email received" not in r["notes"]:
            r["notes"] = r["notes"] + extra
        n += 1
with open(TRACKER, "w", encoding="utf-8", newline="") as f:
    w = csv.DictWriter(f, fieldnames=FIELDS)
    w.writeheader()
    w.writerows(rows)
print(f"updated {n} row(s); total {len(rows)}")
