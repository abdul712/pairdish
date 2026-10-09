#!/usr/bin/env python3
"""Run-15 live verification after `wrangler deploy` (version 81ff673d).

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
    "/tools/chocolate-pairing": {
        "phrases": [
            "What the Cocoa Percentage Really Tells You",
            "Pairing by chocolate type",
            "Chocolate, coffee and the after-dinner question",
            "Storing chocolate so the pairing still tastes right",
            "At least 35% chocolate liquor",
            "ecfr.gov/current/title-21",
            "nal.usda.gov/sites/default/files/page-files/caffeine.pdf",
            "hgic.clemson.edu/chocolate-overload",
        ],
        "tables": 2,
    },
    "/tools/cheese-board-calculator": {
        "phrases": [
            "How Much Cheese and Charcuterie Per Person",
            "How many varieties, and how much of each",
            "Keeping the board safe past the first hour",
            "extension.psu.edu/creating-a-healthy-charcuterie-board",
            "fcs.mgcafe.uky.edu",
            "fda.gov/food/buy-store-serve-safe-food/serving-safe-buffets",
        ],
        "tables": 2,
    },
    "/tools/buffet-planner": {
        "phrases": [
            "Building a Buffet Menu: A Worked Six-Category Example",
            "Turning the template into numbers",
            "Keeping a four-protein line safe",
            "canr.msu.edu/news/food_safety_should_be_your_most_important_buffet_guest",
            "fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f",
        ],
        "tables": 3,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=True):
    u = url + ("?v=run15" if bust else "")
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
    if "snaped.fns.usda.gov" in body:
        fails.append(f"{path}: retired snaped.fns.usda.gov citation still live")
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in body:
        fails.append(f"{path}: dead FSIS danger-zone path still live")
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
for slug in ("tools/chocolate-pairing", "tools/cheese-board-calculator", "tools/buffet-planner"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-10-09":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-09")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-15 live checks green")
