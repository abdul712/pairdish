#!/usr/bin/env python3
"""Run-12 live verification after `npx wrangler deploy` (version 2895b848).

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
            "How a Pairing Tool Decides What Works",
            "The shared-compound idea is a measured tendency, not a law",
            "A workflow that gets more out of the results",
            "What a pairing tool cannot see",
            "nature.com/articles/srep00196",
            "East Asian cuisines tended to avoid compound-sharing",
        ],
        "tables": 1,
    },
    "/tools/party-calculator": {
        "phrases": [
            "How Much Food Per Guest, by Party Type",
            "Appetizer-only parties: count by the hour, not by the tray",
            "Worked example: 70 guests, 11 kinds of passed appetizers",
            "The two clocks that matter more than the totals",
            "blogs.extension.iastate.edu/answerline/2026/03/03/graduation-party-planning",
            "uaex.uada.edu",
            "extension.umn.edu/cooking-safely-crowd/planning-quantity-food-occasion",
        ],
        "tables": 2,
    },
    "/tools/herb-spice-matrix": {
        "phrases": [
            "What Seasoning Goes With What Food",
            "Named blends worth keeping on hand",
            "Using the pairings without overshooting the dose",
            "udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/herbs-spices-on-food",
        ],
        "tables": 2,
    },
}

fails, warns, ok = [], [], 0


def fetch(url, bust=False):
    u = url + ("?v=run12" if bust else "")
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
for slug in ("tools/flavor-pairing", "tools/party-calculator", "tools/herb-spice-matrix"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*<lastmod>([^<]+)", sm)
    if not m:
        fails.append(f"sitemap: {slug} entry missing")
    elif m.group(1) != "2026-09-30":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-09-30")
print(f"sitemap urls: {sm.count('<loc>')}")

print(f"pages checked OK: {ok}/3")
for w in warns:
    print("WARN:", w)
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: all run-12 live checks green")
