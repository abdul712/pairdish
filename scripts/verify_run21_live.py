#!/usr/bin/env python3
"""Run-21 live verification: three expanded tool pages, the inbound-link edit, sitemap, 301s."""
import html, re, subprocess, urllib.error, urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None

OPENER = urllib.request.build_opener(NoRedirect)

PAGES = {
    "/tools/oven-temperature": [
        "Oven Temperatures: What the Dial Means and What the Food Needs",
        "Converting between Fahrenheit, Celsius and gas mark",
        "Some oven temperatures are a safety limit, not a preference",
        "Check the oven, not the dial",
        "145", "62.8", "73.9", "194", "212",
        "safe-temperature-chart", "thermometer-calibration-guide-2.pdf",
    ],
    "/tools/meal-prep": [
        "What a Week of Meal Prep Costs, and How Long It Keeps",
        "From a price list to a cost per portion",
        "How long a prepped meal actually keeps",
        "Cooling, reheating and the two-hour rule",
        "4.203", "11.77", "cold-food-storage-charts", "serving-safe-buffets",
    ],
    "/tools/protein-calculator": [
        "How Much Protein the Guidelines Actually Recommend",
        "Splitting the target across three meals",
        "1.2", "1.6", "FDC 2646170", "DGA.pdf", "fdc.nal.usda.gov",
    ],
    "/tools/nutrition-calculator": ["protein calculator"],
}
MINS = {"/tools/oven-temperature": 950, "/tools/meal-prep": 950,
        "/tools/protein-calculator": 950, "/tools/nutrition-calculator": 780}
TABLES = {"/tools/oven-temperature": 3, "/tools/meal-prep": 2, "/tools/protein-calculator": 3}

fails = []

def fetch(url):
    return subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA, url],
                          capture_output=True, text=True, encoding="utf-8", errors="replace").stdout

def words(body):
    m = re.search(r"<main[^>]*>(.*?)</main>", body, re.S | re.I)
    t = m.group(1) if m else body
    t = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", t, flags=re.S | re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    return len(re.findall(r"[A-Za-z][A-Za-z'\-]+", html.unescape(t)))

print("=== live pages ===")
for path, needles in PAGES.items():
    body = fetch("https://pairdish.com" + path + "?v=run21")
    if not body:
        fails.append(f"{path}: empty body"); continue
    text = html.unescape(body)
    nw, tabs = words(body), body.count("<table")
    m = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', body)
    meta = html.unescape(m.group(1)) if m else ""
    print(f"  {path:34s} words={nw:5d} tables={tabs} meta={len(meta)}")
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
for slug in ("tools/oven-temperature", "tools/meal-prep", "tools/protein-calculator",
             "tools/nutrition-calculator"):
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>([^<]+)</lastmod>", sm)
    if not m:
        fails.append(f"sitemap: no lastmod entry for {slug}")
    elif m.group(1) != "2026-10-23":
        fails.append(f"sitemap: {slug} lastmod {m.group(1)} != 2026-10-23")
    else:
        print(f"  {slug} lastmod {m.group(1)}")

print("\n=== legacy 301s (both slash forms) ===")
REDIR = {"/what-to-serve-with-fried-fish": "/articles/what-to-serve-with-fried-fish",
         "/what-to-serve-with-roasted-potatoes": "/articles/what-to-serve-with-roasted-potatoes",
         "/what-to-serve-with-pesto-chicken": "/articles/what-to-serve-with-pesto-chicken"}
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
        code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "20",
                               "-A", UA, "https://pairdish.com" + h], capture_output=True, text=True).stdout.strip()
        if code != "200":
            fails.append(f"{path}: internal link {h} -> {code}")
    print(f"  {path}: {len(hrefs)} internal tool links, sampled {min(5, len(hrefs))}")

print()
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
else:
    print("PASS: 3/3 expanded tool pages + the inbound-link page live with new sections, word floors, "
          "table counts, metas <=160, no FAQ/undefined; sitemap 52 URLs with 2026-10-23 lastmod on 4 edited "
          "URLs; 3/3 legacy 301s both slash forms; sampled internal links 200")
raise SystemExit(1 if fails else 0)
