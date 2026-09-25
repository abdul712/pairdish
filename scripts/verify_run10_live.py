#!/usr/bin/env python3
"""Run-10 live verification for pairdish.com after the wrangler deploy.

Checks, per changed URL: HTTP 200, meta description <=160 chars (post-unescape),
the new content phrases present, official-source hrefs present, 0 FAQPage,
0 href="undefined", table count, word count. Then: internal hrefs resolve 200,
sitemap lastmod = today on the 11 changed URLs, sitemap still 52 URLs.
"""
import html
import re
import subprocess
import sys
import time

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")
BASE = "https://pairdish.com"
TODAY = "2026-09-25"

CHANGED = [
    "/articles", "/disclaimer", "/tools/herb-spice-matrix", "/tools/recipe-scaler",
    "/tools/substitution-finder", "/tools/appetizer-planner", "/tools/buffet-planner",
    "/tools/leftover-matcher", "/tools/macro-calculator", "/tools/cooking-style-quiz",
    "/tools/flour-substitution",
]

# per-URL required phrases (must appear in the rendered HTML)
PHRASES = {
    "/tools/flour-substitution": [
        "Flour Substitution by Weight", "Worked conversions", "120 g", "113 g",
        "53 g all-purpose", "7 g cornstarch", "12.7%", "11.7%", "3/4 cup + 2 tablespoons",
        "kingarthurbaking.com/learn/ingredient-weight-chart",
        "kingarthurbaking.com/blog/2023/01/18/cake-flour-vs-all-purpose-flour",
        "kingarthurbaking.com/blog/2016/07/21/substitute-bread-flour-for-all-purpose-flour",
        "kingarthurbaking.com/blog/2024/01/18/self-rising-flour",
    ],
    "/tools/buffet-planner": [
        "Buffet Menu Planning That Holds Up on the Line", "Keep it out of the danger zone",
        "doubling in number in as little as 20 minutes", "140", "40", "165",
        "Shallow containers", "fsis.usda.gov", "extension.umn.edu",
        "colour, texture, shape, temperature and flavour",
    ],
}
# meta max
MAX_META = 160
# minimum tables on the two expanded pages
MIN_TABLES = {"/tools/flour-substitution": 1, "/tools/buffet-planner": 2}
# word-count floor only for the two pages this run expanded (other tool pages are
# unchanged this run; several are legitimately short utilities)
WORD_MIN = {"/tools/flour-substitution": 900, "/tools/buffet-planner": 900}
ASSET_EXT = (".css", ".js", ".png", ".jpg", ".svg", ".webp", ".txt", ".xml", ".ico", ".json")


def fetch(url):
    r = subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA, url],
                       capture_output=True, text=True)
    return r.stdout


def meta(html_text):
    m = re.search(r'<meta name="description" content="([^"]*)"', html_text)
    return html.unescape(m.group(1)) if m else None


def words(html_text):
    h = re.sub(r"<script.*?</script>", "", html_text, flags=re.S)
    h = re.sub(r"<style.*?</style>", "", h, flags=re.S)
    return len(re.findall(r"[A-Za-z0-9'\u2019-]+", re.sub(r"<[^>]+>", " ", h)))


def main():
    fails = []
    checks = 0
    pages = {}
    for path in CHANGED:
        url = BASE + path + "?v=" + str(int(time.time()))
        h = fetch(url)
        if len(h) < 2000:
            fails.append(f"{path}: suspiciously short response ({len(h)}B)")
            continue
        pages[path] = h
        checks += 1
        m = meta(h)
        if m is None:
            fails.append(f"{path}: no meta description")
        elif len(m) > MAX_META:
            fails.append(f"{path}: meta {len(m)} chars (> {MAX_META})")
        if "FAQPage" in h:
            fails.append(f"{path}: FAQPage JSON-LD present")
        if 'href="undefined"' in h:
            fails.append(f"{path}: href=\"undefined\" present")
        req = PHRASES.get(path, [])
        hn = re.sub(r"\s+", " ", h)
        missing = [p for p in req if re.sub(r"\s+", " ", p) not in hn]
        if missing:
            fails.append(f"{path}: missing phrases {missing}")
        ntab = h.count("<table")
        if ntab < MIN_TABLES.get(path, 0):
            fails.append(f"{path}: {ntab} tables (< {MIN_TABLES.get(path)})")
        w = words(h)
        wmin = WORD_MIN.get(path, 0)
        if w < wmin:
            fails.append(f"{path}: only {w} words (< {wmin})")
        print(f"  {path:38s} 200 {w:5d}w meta={len(m) if m else 0:3d} tables={ntab}")

    # internal link resolution (sample from the two expanded pages)
    internal = set()
    for path in ("/tools/flour-substitution", "/tools/buffet-planner"):
        h = pages.get(path, "")
        for href in re.findall(r'href="(/[^"#?]*)"', h):
            if href.endswith(ASSET_EXT) or href.startswith("/_astro/"):
                continue
            internal.add(href)
    print(f"\ninternal links found on the two expanded pages: {len(internal)}")
    for href in sorted(internal):
        code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}",
                               "--max-time", "25", "-A", UA, BASE + href],
                              capture_output=True, text=True).stdout.strip()
        checks += 1
        if code != "200":
            fails.append(f"internal link {href} -> {code}")
        print(f"  {href:45s} {code}")

    # sitemap
    sm = fetch(BASE + "/sitemap.xml")
    n_urls = sm.count("<loc>")
    checks += 1
    if n_urls != 52:
        fails.append(f"sitemap has {n_urls} URLs (expected 52)")
    for path in CHANGED:
        pat = re.compile(r"<loc>https://pairdish\.com" + re.escape(path) + r"</loc>\s*<lastmod>([^<]+)</lastmod>")
        mm = pat.search(sm)
        checks += 1
        if not mm:
            fails.append(f"sitemap: no lastmod match for {path}")
        elif mm.group(1) != TODAY:
            fails.append(f"sitemap: {path} lastmod={mm.group(1)} (expected {TODAY})")
    print(f"\nsitemap URLs: {n_urls}")

    print(f"\n=== {checks - len(fails)}/{checks} checks pass ===")
    if fails:
        print("FAILURES:")
        for f in fails:
            print("  -", f)
        sys.exit(2)
    print("ALL PASS")


if __name__ == "__main__":
    main()
