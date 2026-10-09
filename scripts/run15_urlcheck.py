#!/usr/bin/env python3
"""Run-15: verify a batch of URLs (status + a phrase match). Read-only."""
import subprocess
import sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

URLS = [
    ("https://www.fsis.usda.gov/food-safe-handling-and-preparation/food-safety-basics/danger-zone-40f-140f", "Danger Zone"),
    ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f", "Danger Zone"),
    ("https://extension.umn.edu/food/preparing/cooking-at-home/cooking-safely-for-a-crowd/planning-the-quantity-food-occasion", "quantity"),
    ("https://www.fda.gov/food/buy-store-serve-safe-food/serving-safe-buffets", "buffet"),
    ("https://extension.psu.edu/creating-a-healthy-charcuterie-board", "charcuterie"),
    ("https://fcs.mgcafe.uky.edu/sites/fcs.mgcafe.uky.edu/files/charcuterieboards101-pub.pdf", "charcuterie"),
    ("https://hgic.clemson.edu/chocolate-overload-tips-for-storing-various-forms-of-chocolate/", "chocolate"),
    ("https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-163", "Cacao"),
    ("https://www.nal.usda.gov/sites/default/files/page-files/caffeine.pdf", "Caffeine"),
    ("https://www.canr.msu.edu/news/food_safety_should_be_your_most_important_buffet_guest", "buffet"),
]

for url, phrase in URLS:
    r = subprocess.run(["curl", "-s", "-L", "--max-time", "25", "-A", UA, "-w", "\n%{http_code}", url],
                       capture_output=True, text=True)
    body = r.stdout
    code = body.rsplit("\n", 1)[-1] if "\n" in body else "?"
    hit = "HIT" if phrase.lower() in body.lower() else "miss"
    print(f"{code:>4}  {hit:4}  {url}")
