#!/usr/bin/env python3
"""Run-20 live verification: the two expanded tool pages and the refreshed article. Read-only.

Asserts, per page: 200, live word floor, table count, meta <=160, no FAQ/undefined, and the
new content markers. Then the sitemap (52 URLs, 2026-10-21 lastmod on the four edited URLs),
the three legacy 301s in both slash forms, and a sample of internal links.
"""
import html
import re
import subprocess
import urllib.error
import urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


OPENER = urllib.request.build_opener(NoRedirect)
PAGES = {
    "/tools/potluck-coordinator": [
        "How Much Food a Potluck Needs, and How Long It Can Sit Out",
        "The two-hour clock, and the one-hour exception",
        "never leave perishable foods such as meat, poultry, eggs and casseroles",
        "Reheating in a slow cooker or chafing dish",
        "14 pieces per person, per hour",
        "around 128 servings",
        "Cooking_for_Groups.pdf",
    ],
    "/tools/grocery-list": [
        "What a Grocery List Costs, and What the Food Has to Survive",
        "Average U.S. prices, September 2026",
        "$6.792",
        "$2.272",
        "Food at home (groceries)",
        "$7,800",
        "12 to 18 months",
        "ers.usda.gov/data-products/food-price-outlook",
    ],
    "/articles/grocery-budget-meal-planning": [
        "September 2026 forecast",
        "+9.4%",
        "-29.4%",
        "$2.06",
        "$1.67",
        "September 2026",
    ],
}
MINS = {
    "/tools/potluck-coordinator": 900,
    "/tools/grocery-list": 850,
    "/articles/grocery-budget-meal-planning": 900,
}
TABLES = {
    "/tools/potluck-coordinator": 2,
    "/tools/grocery-list": 3,
}

fails = []


def fetch(url):
    return subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA, url],
                          capture_output=True, text=True, encoding="utf-8", errors="replace").stdout


def words(body):
    m = re.search(r"<main[^>]*>(.*?)</main>", body, re.S | re.I)
    t = m.group(1) if m else body
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    t = html.unescape(t)
    return len(re.findall(r"[A-Za-z][A-Za-z'\-]+", t))


print("=== live pages ===")
for path, needles in PAGES.items():
    body = fetch("https://pairdish.com" + path + "?v=run20")
    if not body:
        fails.append(f"{path}: empty body")
        continue
    text = html.unescape(body)
    nw = words(body)
    tabs = body.count("<table")
    m = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', body)
    meta = html.unescape(m.group(1)) if m else ""
    print(f"  {path:42s} words={nw:5d} tables={tabs} meta={len(meta)}")
    if nw < MINS[path]:
        fails.append(f"{path}: live word count {nw} below {MINS[path]}")
    if path in TABLES and tabs < TABLES[path]:
        fails.append(f"{path}: {tabs} tables, expected >= {TABLES[path]}")
    for n in needles:
        if n not in body and n not in text:
            fails.append(f"{path}: live marker missing -> {n}")
    if len(meta) > 160 or not meta:
        fails.append(f"{path}: live meta length {len(meta)}")
    if re.search(r"Frequently Asked Questions|FAQPage", body):
        fails.append(f"{path}: FAQ markup on the live page")
    if 'href="undefined"' in body:
        fails.append(f"{path}: href=undefined on the live page")

print("\n=== sitemap ===")
sm = fetch("https://pairdish.com/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
print(f"  urls={len(locs)}")
if len(locs) != 52:
    fails.append(f"sitemap URL count {len(locs)} != 52")
for slug in ("tools/potluck-coordinator", "tools/grocery-list", "tools/buffet-planner",
             "articles/grocery-budget-meal-planning"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>([^<]+)</lastmod>", sm)
    if not m:
        fails.append(f"sitemap: no lastmod entry for {slug}")
    elif m.group(1) != "2026-10-21":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-21")
    else:
        print(f"  {slug} lastmod {m.group(1)}")

print("\n=== legacy 301s still in place (both slash forms) ===")
REDIR = {
    "/what-to-serve-with-fried-fish": "/articles/what-to-serve-with-fried-fish",
    "/what-to-serve-with-roasted-potatoes": "/articles/what-to-serve-with-roasted-potatoes",
    "/what-to-serve-with-pesto-chicken": "/articles/what-to-serve-with-pesto-chicken",
}
for src, target in REDIR.items():
    for variant in (src, src + "/"):
        req = urllib.request.Request("https://pairdish.com" + variant, headers={"User-Agent": UA})
        try:
            OPENER.open(req, timeout=25)
            fails.append(f"{variant}: no redirect (200)")
        except urllib.error.HTTPError as e:
            loc = e.headers.get("Location", "")
            print(f"  {variant} -> {e.code} {loc}")
            if e.code != 301 or loc.rstrip("/") != target.rstrip("/"):
                fails.append(f"{variant}: {e.code} {loc} != 301 {target}")

print("\n=== sampled internal links ===")
for path in PAGES:
    body = fetch("https://pairdish.com" + path)
    hrefs = sorted({h for h in re.findall(r'href="(/tools/[^"#?]+)"', body)})
    for h in hrefs[:5]:
        code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                               "--max-time", "20", "-A", UA, "https://pairdish.com" + h],
                              capture_output=True, text=True).stdout.strip()
        if code != "200":
            fails.append(f"{path}: internal link {h} -> {code}")
    print(f"  {path}: {len(hrefs)} internal tool links, sampled {min(5, len(hrefs))}")

print()
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
else:
    print("PASS: 2/2 expanded tool pages + the refreshed article live with the new sections, word "
          "floors, table counts, metas <=160, no FAQ/undefined; sitemap 52 URLs with 2026-10-21 "
          "lastmod on 4 edited URLs; 3/3 legacy 301s both slash forms; sampled internal links 200")
raise SystemExit(1 if fails else 0)
