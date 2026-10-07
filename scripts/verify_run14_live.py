#!/usr/bin/env python3
"""Run-14 live verification after `wrangler deploy` (version 2792a4b0).

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
    "/tools/flavor-pairing": {
        "phrases": [
            "Deciding What to Serve With a Main Dish",
            "The four jobs a side dish can do",
            "Why acid beats sugar when a plate feels heavy",
            "A worked example: a rich sandwich main",
            "pmc.ncbi.nlm.nih.gov/articles/PMC2975745",
            "fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f",
        ],
        "tables": 1,
    },
    "/tools/seasonal-guide": {
        "phrases": [
            "Fresh, Frozen, or Canned: Comparing the Same Ingredient",
            "What the research actually shows",
            "How to use this when you shop",
            "snaped.fna.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide",
            "scijournals.onlinelibrary.wiley.com/doi/10.1002/jsfa.2825",
        ],
        "tables": 1,
    },
    "/tools/substitution-finder": {
        "phrases": [
            "Substituting Flour and Sugar by Weight, Not by Cup",
            "The gram weights to work from",
            "The substitutions that come up most, worked out",
            "289 g all-purpose flour plus 39 g",
            "kingarthurbaking.com/learn/ingredient-weight-chart",
            "randolph.ces.ncsu.edu/news/baking-substitutions-that-work",
            "extension.msstate.edu/publications/ingredient-substitutions-and-equivalents",
            "extension.usu.edu/archive/list-of-ingredient-substitutions-for-cooking-and-baking",
        ],
        "tables": 1,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=True):
    u = url + ("?v=run14" if bust else "")
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
for slug in ("tools/flavor-pairing", "tools/seasonal-guide", "tools/substitution-finder"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-10-07":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-07")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-14 live checks green")
