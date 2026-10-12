#!/usr/bin/env python3
"""Run-16: flip Brestlinks to pending_review after the confirmation link was clicked this run
(confirm mail had been sitting in Gmail Spam since 2026-10-09)."""
import csv
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
T = ROOT / "outreach" / "tracker.csv"
FIELDS = ["site_name", "url", "status", "date", "listing_url_or_proof", "notes"]

rows = list(csv.DictReader(T.open(newline="", encoding="utf-8")))
for r in rows:
    if r["site_name"].lower().startswith("brestlinks"):
        r["status"] = "pending_review"
        r["date"] = "2026-10-12"
        r["listing_url_or_proof"] = ("email confirmation CLICKED 2026-10-12 "
                                     "(brestlinks.com//emailconfirmation.php?linkurl=tz67ala -> "
                                     "'Your link submission was confirmed!')")
        r["notes"] = (r["notes"].rstrip() + " | run-16 (2026-10-12): confirmation mail found in "
                      "Gmail Spam dated Fri, 9 Oct 2026 16:48 (noreply@brestlinks.com, To: "
                      "+pairdish-r14); GET of the confirm URL returned 'Your link submission was "
                      "confirmed!' -> now in the review queue.")
with T.open("w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=FIELDS)
    w.writeheader()
    w.writerows(rows)
print("rows:", len(rows), "| header ok:", T.read_text(encoding="utf-8").splitlines()[0])
