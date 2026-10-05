#!/usr/bin/env python3
"""Run-13 live verification after `wrangler deploy` (version 6daa6bd1).

Per changed URL: 200 (cache-busted), meta <=160, no FAQPage, no href="undefined",
required new-section phrases present, table count, and every internal href resolving 200.
External official source links are fetched too; 403/000 is a WARN (datacenter-IP/cert-blocked
from this VPS) while 404 is a FAIL.
"""
import html
import re
import subprocess
import sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://pairdish.com"

CHECKS = {
    "/tools/coffee-pairing": {
        "phrases": [
            "Matching Coffee With Dessert, by Roast and by Dessert",
            "Sweetness, bitterness, and the 31-to-1 rule",
            "quinine sulfate at 0.18 mM",
            "Pairing by dessert, not by coffee",
            "fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much",
            "pmc.ncbi.nlm.nih.gov/articles/PMC2975745",
        ],
        "tables": 2,
    },
    "/tools/cheese-pairing": {
        "phrases": [
            "Cheese Pairing by Family, and What to Do With the Leftovers",
            "Why cheese and wine work at all",
            "Which cheeses need the fridge",
            "cdr.wisc.edu/cheese-safety-storage",
            "pmc.ncbi.nlm.nih.gov/articles/PMC11245939",
            "fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f",
        ],
        "tables": 2,
    },
    "/tools/nutrition-calculator": {
        "phrases": [
            "Raw or Cooked? Why a Calculated Number Often Looks Too High",
            "A three-step check when the total looks wrong",
            "extension.missouri.edu/publications/mp563",
            "food.unl.edu/article/nutrition-education-program-nep/all-about-cooking-rice",
        ],
        "tables": 1,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=False):
    u = url + ("?v=run13" if bust else "")
    return subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA, u],
                          capture_output=True, text=True).stdout


def status(url):
    return subprocess.run(["curl", "-s", "-o", "/dev/null", "--max-time", "25", "-A", UA,
                           "-w", "%{http_code}", url], capture_output=True, text=True).stdout.strip()


for path, spec in CHECKS.items():
    body = fetch(BASE + path, bust=True)
    if len(body) < 2000:
        fails.append(f"{path}: short/empty body ({len(body)} chars)")
        continue
    ok += 1
    meta = re.search(r'<meta name="description" content="([^"]*)"', body)
    if not meta:
        fails.append(f"{path}: no meta description")
    else:
        ml = len(html.unescape(meta.group(1)))
        if ml > 160:
            fails.append(f"{path}: meta {ml} chars > 160")
    if "FAQPage" in body or "Frequently Asked Questions" in body:
        fails.append(f"{path}: FAQ markup live")
    if 'href="undefined"' in body:
        fails.append(f"{path}: href=undefined live")
    for ph in spec["phrases"]:
        if ph not in body:
            fails.append(f"{path}: phrase missing -> {str(ph)[:60]}")
    ntab = body.count("<table")
    if ntab < spec["tables"]:
        fails.append(f"{path}: {ntab} tables live, expected >= {spec['tables']}")
    for href in sorted(set(re.findall(r'href="(/[^"#?]*)"', body))):
        if re.search(r"\.(css|js|svg|png|jpg|webp|ico|xml|txt)$", href):
            continue
        code = status(BASE + href)
        if code != "200":
            fails.append(f"{path}: internal {href} -> {code}")
    for href in sorted(set(re.findall(r'href="(https://[^"]+)"', body))):
        host = href.split("/")[2].lower()
        if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            continue  # preconnect hints from the layout, not content links
        code = status(href)
        if code in ("403", "000"):
            warns.append(f"{path}: external {href[:60]} -> {code} (DC-IP/cert-blocked from VPS, WARN)")
        elif code not in ("200", "301", "302", "303"):
            fails.append(f"{path}: external {href[:70]} -> {code}")

sm = fetch(BASE + "/sitemap.xml", bust=True)
for slug in ("tools/coffee-pairing", "tools/cheese-pairing", "tools/nutrition-calculator"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-10-05":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-05")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-13 live checks green")
