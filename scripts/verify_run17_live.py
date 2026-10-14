#!/usr/bin/env python3
"""Run-17 live verification after `wrangler deploy` (version de3165d6).

A. Per expanded page: 200 (cache-busted), meta <=160, no FAQPage, no href=undefined, the new
   section phrases present, minimum table count, every internal href 200, external official
   sources (403/000 = WARN: datacenter-IP blocked from this VPS, 404 = FAIL).
B. Legacy URLs: assert a 301 WITHOUT following redirects (curl without -L; the redirect_url is
   read from curl itself, so a followed redirect cannot masquerade as the 301), in BOTH slash
   forms, and the target must return 200.
C. Sitemap: the three edited URLs carry lastmod 2026-10-14; the redirect slugs are absent.
"""
import html
import re
import subprocess
import sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://pairdish.com"

CHECKS = {
    "/tools/drink-calculator": {
        "phrases": [
            "What Counts as One Drink",
            "One U.S. standard drink, by beverage",
            "Standard drinks in the containers people actually buy",
            "about 17",
            "25.4 &times; 0.40 &divide; 0.6 = 16.9",
            "Non-alcoholic drinks need their own count",
            "Beverage planning, as a percentage of attendance",
            "165 &divide; 20 = 8.25 gallons",
            "niaaa.nih.gov/alcohols-effects-health/what-standard-drink",
            "cdc.gov/alcohol/standard-drink-sizes",
        ],
        "tables": 3,
    },
    "/tools/appetizer-planner": {
        "phrases": [
            "What the Extension Services Actually Recommend",
            "Per-person appetizer benchmarks published by extension services",
            "The four-hour rule worked for three party sizes",
            "1,200",
            "Holding limits once the table is set",
            "140 &deg;F or warmer",
            "39 &deg;F or colder",
            "uaex.uada.edu",
            "canr.msu.edu/news/6_tips_for_food_safety",
        ],
        "tables": 3,
    },
    "/tools/yeast-converter": {
        "phrases": [
            "Converting Between Fresh, Active Dry and Instant Yeast",
            "Published conversion rules",
            "Worked conversions",
            "about 17.5 g",
            "Reading the packet instead of the scale",
            "kingarthurbaking.com/pro/reference/yeast",
            "pubs.nmsu.edu/_e/E131",
        ],
        "tables": 2,
    },
}

LEGACY = {
    "/what-to-serve-with-fried-fish": "/articles/what-to-serve-with-fried-fish",
    "/what-to-serve-with-roasted-potatoes": "/articles/what-to-serve-with-roasted-potatoes",
    "/what-to-serve-with-pesto-chicken": "/articles/what-to-serve-with-pesto-chicken",
}

fails, warns = [], []
ok = 0


def fetch(url, bust=True):
    u = url + ("?v=run17" if bust else "")
    return subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA, u],
                          capture_output=True, text=True, encoding="utf-8", errors="replace").stdout


def status(url):
    return subprocess.run(["curl", "-s", "-o", "/dev/null", "--max-time", "25", "-A", UA,
                           "-w", "%{http_code}", url], capture_output=True, text=True).stdout.strip()


def status_noredirect(url):
    """code + Location without following the redirect."""
    out = subprocess.run(["curl", "-s", "-o", "/dev/null", "--max-time", "25", "-A", UA,
                          "-w", "%{http_code}|%{redirect_url}", url],
                         capture_output=True, text=True).stdout.strip()
    code, _, loc = out.partition("|")
    return code, loc


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
    for href in sorted(set(re.findall(r'href="(/[^"#?]*)"', body))):
        if re.search(r"\.(css|js|svg|png|jpg|webp|ico|xml|txt)$", href):
            continue
        code = status(BASE + href)
        if code != "200":
            fails.append(f"{path}: internal {href} -> {code}")
    for href in sorted(set(re.findall(r'href="(https://[^"]+)"', body))):
        host = href.split("/")[2].lower()
        if host in ("fonts.googleapis.com", "fonts.gstatic.com"):
            continue
        code = status(href)
        if code in ("403", "000"):
            warns.append(f"{path}: external {href[:58]} -> {code} (DC-IP blocked from VPS)")
        elif code not in ("200", "301", "302", "303"):
            fails.append(f"{path}: external {href[:70]} -> {code}")

print("--- legacy 301s (no-redirect read) ---")
for path, target in LEGACY.items():
    for variant in (path, path + "/"):
        code, loc = status_noredirect(BASE + variant)
        if code != "301":
            fails.append(f"{variant}: {code} (want 301)")
        if loc.rstrip("/") != (BASE + target).rstrip("/"):
            fails.append(f"{variant}: Location {loc!r} != {BASE + target}")
        print(f"  {variant:42s} {code} -> {loc}")
    tcode = status(BASE + target)
    if tcode != "200":
        fails.append(f"{target}: target {tcode} (want 200)")
    print(f"  target {target:42s} {tcode}")

sm = fetch(BASE + "/sitemap.xml", bust=True)
for slug in ("tools/drink-calculator", "tools/appetizer-planner", "tools/yeast-converter"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-10-14":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-14")
for slug in LEGACY:
    if f"<loc>{BASE}{slug}</loc>" in sm:
        fails.append(f"sitemap: redirect slug present -> {slug}")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/{len(CHECKS)}")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: run-17 live checks green (pages, tables, links, legacy 301s both slash forms, sitemap)")
