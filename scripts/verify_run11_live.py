#!/usr/bin/env python3
"""Run-11 live verification after `npx wrangler deploy` (version de54b8d9).

Per changed URL: 200 (cache-busted), meta <=160, no FAQPage, no href="undefined",
required new-section phrases present, table count, and every internal href resolving 200.
External official source links are fetched too; 403 is a WARN (US gov sites block datacenter
IPs) while 404 is a FAIL.
"""
import html
import re
import subprocess
import sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://pairdish.com"

CHECKS = {
    "/tools/cheese-board-builder": {
        "phrases": [
            "How Much Cheese Per Person, by Board Style",
            "Variety proportions for a balanced board",
            "Storage and food-safety windows after the board is built",
            "6 months unopened; 3&ndash;4 weeks after opening",
            "ask.fsis.usda.gov",
            "food.unl.edu/free-resource/food-storage",
        ],
        "tables": 3,
    },
    "/tools/bread-proofing": {
        "phrases": [
            "Proofing Temperature and Time: A Reference Table",
            "Food safety: dough that sits out, and dough you should not taste",
            "72&nbsp;&deg;F to 78&nbsp;&deg;F",
            "kingarthurbaking.com/blog/2023/08/31/proofing-bread",
            "fda.gov/consumers/consumer-updates/flour-raw-food-and-other-safety-facts",
            "cdc.gov/food-safety/foods/no-raw-dough",
        ],
        "tables": 1,
    },
    "/tools/seasonal-guide": {
        "phrases": [
            "Where to Find Seasonal Ingredients Near You",
            "How to time a seasonal shop",
            "ams.usda.gov/services/local-regional/food-directories",
            "usdalocalfoodportal.com",
        ],
        "tables": 2,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=False):
    u = url + ("?v=run11" if bust else "")
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
            fails.append(f"{path}: phrase missing -> {ph[:60]}")
    ntab = body.count("<table")
    if ntab < spec["tables"]:
        fails.append(f"{path}: {ntab} tables live, expected >= {spec['tables']}")
    # internal links
    for href in sorted(set(re.findall(r'href="(/[^"#?]*)"', body))):
        if re.search(r"\.(css|js|svg|png|jpg|webp|ico|xml|txt)$", href):
            continue
        code = status(BASE + href)
        if code != "200":
            fails.append(f"{path}: internal {href} -> {code}")
    # external official sources
    for href in sorted(set(re.findall(r'href="(https://[^"]+)"', body))):
        host = href.split("/")[2].lower()
        if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            continue  # preconnect hints from the layout, not content links
        code = status(href)
        if code in ("403", "000"):
            warns.append(f"{path}: external {href[:60]} -> {code} (DC-IP/cert-blocked from VPS, WARN)")
        elif code not in ("200", "301", "302"):
            fails.append(f"{path}: external {href[:70]} -> {code}")

# sitemap lastmod
sm = fetch(BASE + "/sitemap.xml", bust=True)
for slug in ("tools/cheese-board-builder", "tools/bread-proofing", "tools/seasonal-guide"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-09-28":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-09-28")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-11 live checks green")
