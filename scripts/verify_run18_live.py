#!/usr/bin/env python3
"""Run-18 live verification: the four edited pages, in both directions. Read-only."""
import html
import re
import subprocess
import urllib.request
import urllib.error

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


OPENER = urllib.request.build_opener(NoRedirect)
PAGES = {
    "/tools/cooking-time": [
        "Safe Minimum Internal Temperatures",
        "145 &deg;F (62.8 &deg;C)",  # checked unescaped below
        "All poultry",
        "Never more than 2 hours",
        "safe-temperature-chart",
    ],
    "/tools/unit-converter": [
        "How a Cup Is Actually Defined",
        "240 mL",
        "Sugar (granulated white)",
        "198 g",
        "section-101.9",
    ],
    "/tools/sourdough-calculator": [
        "Feeding Ratios, Ripening Checks and Dough Temperature",
        "1:1:1",
        "72 &deg;F to 78 &deg;F",
        "Water still to add",
        "sourdough-101-guide",
    ],
    "/contact": [
        "Working With PairDish",
        "API access for developers",
        "food science research",
    ],
}

fails = []
warns = []


MINS = {"/tools/cooking-time": 950, "/tools/unit-converter": 950, "/tools/sourdough-calculator": 950,
        "/contact": 150}


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
    body = fetch("https://pairdish.com" + path + "?v=run18")
    if not body:
        fails.append(f"{path}: empty body")
        continue
    text = html.unescape(body)
    nw = words(body)
    tabs = body.count("<table")
    m = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', body)
    meta = html.unescape(m.group(1)) if m else ""
    print(f"  {path:34s} words={nw:5d} tables={tabs} meta={len(meta)}")
    if nw < MINS.get(path, 900):
        fails.append(f"{path}: live word count {nw} below {MINS.get(path, 900)}")
    for n in needles:
        if n not in body and n not in text:
            fails.append(f"{path}: live marker missing -> {n}")
    if len(meta) > 160 or not meta:
        fails.append(f"{path}: live meta length {len(meta)}")
    if re.search(r"Frequently Asked Questions|FAQPage", body):
        fails.append(f"{path}: FAQ markup on the live page")
    if 'href="undefined"' in body:
        fails.append(f"{path}: href=undefined on the live page")
    if path == "/contact":
        if body.count("<table"):
            warns.append("/contact renders a table (unexpected)")
        for ans in ["No account required, no hidden fees",
                    "we'll consider it for future development",
                    "scientifically supported and widely accepted in culinary practice"]:
            if ans not in text:
                fails.append(f"/contact: preserved answer sentence missing -> {ans[:40]}")

print("\n=== sitemap ===")
sm = fetch("https://pairdish.com/sitemap.xml")
locs = re.findall(r"<loc>([^<]+)</loc>", sm)
print(f"  urls={len(locs)}")
if len(locs) != 52:
    fails.append(f"sitemap URL count {len(locs)} != 52")
for slug in ["tools/cooking-time", "tools/unit-converter", "tools/sourdough-calculator", "contact"]:
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>([^<]+)</lastmod>", sm)
    if not m:
        fails.append(f"sitemap: no lastmod entry for {slug}")
    elif m.group(1) != "2026-10-16":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-16")

print("\n=== redirects still in place (both slash forms) ===")
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

print()
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
else:
    print("PASS: 4/4 edited pages live with content, band, meta, no FAQ; sitemap 52 URLs with "
          "2026-10-16 lastmod; 3/3 legacy 301s intact in both slash forms")
for w in warns:
    print("WARN:", w)
raise SystemExit(1 if fails else 0)
