#!/usr/bin/env python3
"""Run-20 official-source gate: fetch each cited URL with a UA ladder and assert a PHRASE.

Prints  status | bytes | phrase-hit  per (url, phrase). PASS on any UA that answers 200
with the phrase present. Also queries the BLS public API for average-price series.
"""
import json
import re
import subprocess
import urllib.parse

UA_BROWSER = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
              "Chrome/126 Safari/537.36")
UA_CURL = "curl/8.5.0"

TARGETS = [
    ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/cooking-groups",
     ["Cooking for Groups", "servings"]),
    ("https://www.ers.usda.gov/data-products/food-price-outlook/summary-findings",
     ["2.4 percent", "Food-at-home"]),
    ("https://www.fda.gov/food/buy-store-serve-safe-food/serving-safe-buffets",
     ["2 hours", "140"]),
    ("https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts",
     ["refrigerator", "freezer"]),
    ("https://www.canr.msu.edu/news/6_tips_for_food_safety_at_holidays_parties_and_dinners",
     ["2 hours", "140"]),
]


def fetch(url, ua, extra=None):
    cmd = ["curl", "-sL", "--compressed", "--max-time", "40", "-A", ua,
           "-w", "\n@@STATUS:%{http_code}", url]
    if extra:
        cmd = cmd[:-2] + extra + cmd[-2:]
    out = subprocess.run(cmd, capture_output=True, text=True).stdout
    m = re.search(r"\n@@STATUS:(\d+)$", out)
    status = int(m.group(1)) if m else 0
    body = out[: m.start()] if m else out
    return status, body


for url, phrases in TARGETS:
    print("=" * 78)
    print(url)
    for ua in (UA_BROWSER, UA_CURL):
        status, body = fetch(url, ua)
        hits = {p: (p.lower() in body.lower()) for p in phrases}
        print(f"  UA={ua.split('/')[0][:18]:18s} status={status} bytes={len(body)} hits={hits}")
        if status == 200 and all(hits.values()):
            break

# BLS average price series (U.S. city average)
SERIES = {
    "APU0000708111": "Eggs, grade A, large, per dozen",
    "APU0000709112": "Milk, whole, fortified, per 1/2 gal",
    "APU0000702111": "Bread, white, pan, per lb",
    "APU0000703112": "Chicken breast, boneless, per lb",
    "APU0000711211": "Bananas, per lb",
    "APU0000717311": "Coffee, 100%, ground, per lb",
}
payload = json.dumps({"seriesid": list(SERIES), "startyear": "2026", "endyear": "2026"})
print("=" * 78)
print("BLS average prices 2026")
res = subprocess.run(["curl", "-s", "--max-time", "60", "-X", "POST",
                      "-H", "Content-Type: application/json", "-d", payload,
                      "https://api.bls.gov/publicAPI/v1/timeseries/data/"],
                     capture_output=True, text=True).stdout
try:
    data = json.loads(res)
except Exception:
    print("  raw:", res[:400])
    raise SystemExit(0)
print("  status:", data.get("status"), "message:", (data.get("message") or [])[:2])
for s in (data.get("Results") or {}).get("series", []):
    sid = s.get("seriesID")
    rows = s.get("data", [])
    if rows:
        r = rows[0]
        print(f"  {sid} {SERIES.get(sid,'')}: {r.get('periodName')} {r.get('year')} = ${r.get('value')}")
    else:
        print(f"  {sid}: no rows")
