#!/usr/bin/env python3
"""Run-17 tracker rows: the three directory hosts probed this run (no POST spent on the captcha class).

Writes with csv.DictWriter and an explicit writeheader() (the documented header-eating bug), then
prints the summary as proof the file still parses.
"""
import csv
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TRACKER = ROOT / "outreach/tracker.csv"
FIELDS = ["site_name", "url", "status", "date", "listing_url_or_proof", "notes"]
DATE = "2026-10-14"

ROWS = [
    {
        "site_name": "Caida Web Directory",
        "url": "https://caida.eu",
        "status": "skipped_other",
        "date": DATE,
        "listing_url_or_proof": "no listing",
        "notes": ("run-17 (2026-10-14): phpLD-4 bare /captcha.php template, free radio LINK_TYPE=free "
                  "('Regular Listings (6+ months + review time, depending on waiting list)'); "
                  "www->apex 301 handled and AF_INET forced. THREE fresh captures each read split at "
                  "exactly one character (raw/mild pairs: WFOYJM/WF0YUM, 9EPGUK/BEPGUK, HUXFAB/6UXFAB) "
                  "and isolated high-zoom glyph crops contradicted each other (char 3 O/0/D; char 1 "
                  "9/B; char 1 H/6); the heavy threshold read was garbage and the column ink profile "
                  "shows no clean glyph segmentation. NO POST spent (family rule: never burn a "
                  "single-use code on a split read). Sourced from the run-17 sibling-ack mail sweep "
                  "(Action Required mail dated 2026-10-12 13:06).")
    },
    {
        "site_name": "Directory4.org",
        "url": "https://www.directory4.org",
        "status": "skipped_other",
        "date": DATE,
        "listing_url_or_proof": "no listing",
        "notes": ("run-17 (2026-10-14): phpLD-5 /submit URL-param wizard. /submit?c=203 = Home > "
                  "Cooking; step-2 radios 1-6 are all free ('Link - free', business, article, "
                  "picture, video, coupon) and 7 is $1.50 premium. Step 3 carries an IMAGEHASH plus a "
                  "7-character /captcha.php?imagehash= captcha (note: a second request for the same "
                  "phrase returns 'Could not fetch image phrase!' -- fetch the image once and save "
                  "bytes). Four preprocessings of one capture split in the middle (raw 7K8yCMH / "
                  "mild 7KEVCMH / median5 7K8ycMII / median3 7KBVCMH -- two votes each); no POST "
                  "spent. Untried proven sibling of the phpLD-5 vein.")
    },
    {
        "site_name": "UPS Directory",
        "url": "https://www.upsdirectory.com",
        "status": "skipped_other",
        "date": DATE,
        "listing_url_or_proof": "no listing",
        "notes": ("run-17 (2026-10-14): same install/template as directory4.org (identical category "
                  "tree, cat 203 = Home > Cooking, LINK_TYPE 1-6 free and 7 paid at $1.50, IMAGEHASH "
                  "7-char captcha). Free tier confirmed; captcha did not read consistently; no POST "
                  "spent. Both hosts answered 'CAPTCHA: Incorrect code.' to the empty-captcha probe "
                  "POST, which is expected and does not create an entry.")
    },
]


def main():
    rows = list(csv.DictReader(open(TRACKER, encoding="utf-8", newline="")))
    have = {r["url"].lower().rstrip("/") for r in rows}
    added = 0
    for r in ROWS:
        if r["url"].lower().rstrip("/") in have:
            print("skip (already tracked):", r["url"])
            continue
        rows.append(r)
        added += 1
    with open(TRACKER, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=FIELDS)
        w.writeheader()
        w.writerows({k: r.get(k, "") for k in FIELDS} for r in rows)
    print(f"added {added} rows; total {len(rows)}")
    subprocess.run([sys.executable, str(ROOT / "scripts/update_tracker.py"), "summary"], check=False)


if __name__ == "__main__":
    main()
