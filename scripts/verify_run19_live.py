#!/usr/bin/env python3
"""Run-19 live verification: the three expanded tool pages, both directions. Read-only."""
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
    "/tools/dietary-finder": [
        "What a Restriction Filter Can and Cannot Decide",
        "The nine major food allergens named by U.S. law",
        "Crustacean shellfish",
        "less than 20 parts per million",
        "Plant foods contain no B12 unless they are fortified",
        "ods.od.nih.gov/factsheets/VitaminB12-Consumer",
    ],
    "/tools/glycemic-index": [
        "How the Glycemic Index Bands and the Glycemic Load Are Calculated",
        "convert between them with a factor of 100/70",
        "Watermelon and cola are the pair that makes the point",
        "total carbohydrate minus fibre",
        "International Tables of Glycemic Index and Glycemic Load Values",
        "pubmed.ncbi.nlm.nih.gov/34258626",
    ],
    "/tools/caffeine-calculator": [
        "What the Published Caffeine Limits Actually Say",
        "single-dose level",
        "Decaffeinated coffee is not caffeine-free",
        "About 1,200 mg",
        "476 mg",
        "efsa.europa.eu/en/topics/topic/caffeine",
    ],
}
MINS = {"/tools/dietary-finder": 1100, "/tools/glycemic-index": 1150, "/tools/caffeine-calculator": 1000}
TABLES = {"/tools/dietary-finder": 2, "/tools/glycemic-index": 3, "/tools/caffeine-calculator": 2}

fails = []
warns = []


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
    body = fetch("https://pairdish.com" + path + "?v=run19")
    if not body:
        fails.append(f"{path}: empty body")
        continue
    text = html.unescape(body)
    nw = words(body)
    tabs = body.count("<table")
    m = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', body)
    meta = html.unescape(m.group(1)) if m else ""
    print(f"  {path:32s} words={nw:5d} tables={tabs} meta={len(meta)}")
    if nw < MINS[path]:
        fails.append(f"{path}: live word count {nw} below {MINS[path]}")
    if tabs < TABLES[path]:
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
for slug in ("tools/dietary-finder", "tools/glycemic-index", "tools/caffeine-calculator"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>([^<]+)</lastmod>", sm)
    if not m:
        fails.append(f"sitemap: no lastmod entry for {slug}")
    elif m.group(1) != "2026-10-19":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-19")

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
    for h in hrefs[:4]:
        code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                               "--max-time", "20", "-A", UA, "https://pairdish.com" + h],
                              capture_output=True, text=True).stdout.strip()
        if code != "200":
            fails.append(f"{path}: internal link {h} -> {code}")
    print(f"  {path}: {len(hrefs)} internal tool links, sampled 4")

print()
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
else:
    print("PASS: 3/3 expanded pages live with new sections, word bands, table counts, metas <=160, "
          "no FAQ/undefined; sitemap 52 URLs with 2026-10-19 lastmod; 3/3 legacy 301s both slash forms")
for w in warns:
    print("WARN:", w)
raise SystemExit(1 if fails else 0)
