#!/usr/bin/env python3
"""Run-16 live verification after `wrangler deploy` (version ba9c9ada).

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
    "/tools/macro-calculator": {
        "phrases": [
            "The Macro Balancing Math Behind the Percentages",
            "Why the totals never land exactly",
            "Two official anchors to check a plan against",
            "125 &times; 4 + 250 &times; 4 + 56 &times; 9 = 2,004",
            "ecfr.gov/current/title-21",
            "cdn.realfood.gov/DGA.pdf",
            "hydrogenated starch hydrolysates 3.0, mannitol 1.6, erythritol 0",
            "1.2 to 1.6",
        ],
        "tables": 2,   # the two new rendered tables (calorie factors + worked splits)
    },
    "/tools/sugar-substitution": {
        "phrases": [
            "Converting Liquid Sweeteners Without Breaking the Recipe",
            "Sweetener-to-sugar conversions",
            "Calories per gram and suitability for home canning",
            "One safety rule that overrides taste",
            "extension.colostate.edu/resource/ingredient-substitutions/",
            "extension.usu.edu/preserve-the-harvest",
            "fda.gov/food/food-additives-petitions/high-intensity-sweeteners",
            "cdc.gov/botulism/prevention/index.html",
            "Only in jams and jellies made with no-sugar pectin",
        ],
        "tables": 2,
    },
    "/tools/herb-spice-matrix": {
        "phrases": [
            "Mapping Herbs and Spices by Taste, Not by Food",
            "Taste descriptor and partners for sixteen seasonings",
            "Building a blend you do not have",
            "Keeping the flavour once you have the blend",
            "bkc-od-media.vmhost.psu.edu/documents/HO_PE_foodherbspicepairing.pdf",
            "extension.psu.edu/preserving-herbs-by-drying",
            "1/2 tsp cinnamon plus 1/2 tsp ground cloves",
        ],
        "tables": 3,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=True):
    u = url + ("?v=run16" if bust else "")
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
    for href in sorted(set(re.findall(r'href="(/[^\"#?]*)"', body))):
        if re.search(r"\.(css|js|svg|png|jpg|webp|ico|xml|txt)$", href):
            continue
        code = status(BASE + href)
        if code != "200":
            fails.append(f"{path}: internal {href} -> {code}")
    for href in sorted(set(re.findall(r'href="(https://[^\"]+)"', body))):
        host = href.split("/")[2].lower()
        if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            continue
        code = status(href)
        if code in ("403", "000"):
            warns.append(f"{path}: external {href[:60]} -> {code} (DC-IP/cert-blocked from VPS, WARN)")
        elif code not in ("200", "301", "302", "303"):
            fails.append(f"{path}: external {href[:70]} -> {code}")

sm = fetch(BASE + "/sitemap.xml", bust=True)
for slug in ("tools/macro-calculator", "tools/sugar-substitution", "tools/herb-spice-matrix"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-10-12":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-12")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-16 live checks green")
