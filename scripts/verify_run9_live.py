#!/usr/bin/env python3
"""Run 9 live verification: fetch the four touched pages from pairdish.com and assert the
new content is actually rendered (word bands, tables, official-source links, no FAQ
sections, no FAQPage JSON-LD, meta <=160).
"""
import html
import re
import subprocess
import sys

CHECKS = []
FAILS = []


def fetch(url):
    out = subprocess.run(
        ["curl", "-sL", "--compressed", "--max-time", "30", "-A", "Mozilla/5.0 (compatible; PairDishQA/1.0)",
         f"{url}?v=run9"],
        capture_output=True, text=True).stdout
    return out


def text_words(h):
    h = re.sub(r"<script.*?</script>", " ", h, flags=re.S)
    h = re.sub(r"<style.*?</style>", " ", h, flags=re.S)
    t = html.unescape(re.sub(r"<[^>]+>", " ", h))
    return len([w for w in re.split(r"\s+", t) if re.search(r"[A-Za-z0-9]", w)])


def check(label, cond, detail=""):
    (CHECKS if cond else FAILS).append(f"{'PASS' if cond else 'FAIL'} {label} {detail}")


PAGES = [
    {
        "url": "https://pairdish.com/articles/recipe-nutrition-calculator-guide",
        "min_words": 1200, "max_words": 2000, "tables": 2,
        "must": ["Daily Values behind %DV", "Added sugars versus total sugars",
                 "raw-versus-cooked check", "fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label",
                 "fdc.nal.usda.gov", "22.5 g", "32.1 g", "2,300 mg", "50 g"],
    },
    {
        "url": "https://pairdish.com/articles/high-protein-meal-prep",
        "min_words": 1200, "max_words": 2000, "tables": 2,
        "must": ["What the protein numbers actually look like per portion",
                 "Do the batch math from raw weight", "Keep the week inside the safe storage window",
                 "fdc.nal.usda.gov", "fsis.usda.gov", "32.1 g", "8.86 g", "306 g"],
    },
    {
        "url": "https://pairdish.com/tools/seasonal-guide",
        "min_words": 700, "max_words": 2200, "tables": 1,
        "must": ["Seasonal Ingredients, Broken Down by Season", "snaped.fns.usda.gov/seasonal-produce-guide",
                 "Rhubarb", "Winter Squash", "/tools/flavor-pairing"],
    },
    {
        "url": "https://pairdish.com/tools/flavor-pairing",
        "min_words": 500, "max_words": 2000, "tables": 1,
        "must": ["Flavour Pairing", "flavour pairing chart", "Base ingredient", "/tools/seasonal-guide"],
    },
]

for p in PAGES:
    page = fetch(p["url"])
    code = subprocess.run(
        ["curl", "-sL", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "25", p["url"]],
        capture_output=True, text=True).stdout.strip()
    check(f"HTTP 200 {p['url']}", code == "200", f"(got {code})")
    if code != "200":
        continue
    n = text_words(page)
    check(f"word band {p['url']}", p["min_words"] <= n <= p["max_words"], f"({n} words)")
    check(f"tables {p['url']}", page.count("<table") >= p["tables"], f"({page.count('<table')})")
    for s in p["must"]:
        check(f"contains {s!r}", s in page)
    check(f"no FAQ section {p['url']}", "Frequently Asked Questions" not in page)
    check(f"no FAQPage JSON-LD {p['url']}", "FAQPage" not in page)
    m = re.search(r'<meta name="description" content="([^"]*)"', page)
    if m:
        ln = len(html.unescape(m.group(1)))
        check(f"meta <=160 {p['url']}", ln <= 160, f"({ln} chars)")
    else:
        check(f"meta present {p['url']}", False)

# sitemap lastmods
sm = fetch("https://pairdish.com/sitemap.xml")
for slug in ["/articles/recipe-nutrition-calculator-guide", "/articles/high-protein-meal-prep",
             "/tools/seasonal-guide", "/tools/flavor-pairing"]:
    i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
    blk = sm[i:sm.find("</url>", i)] if i != -1 else ""
    check(f"sitemap lastmod 2026-09-23 {slug}", "<lastmod>2026-09-23</lastmod>" in blk)
check("sitemap url count", sm.count("<loc>") == 52, f"({sm.count('<loc>')})")

print("\n".join(CHECKS))
if FAILS:
    print("\n".join(FAILS))
print(f"\n{len(CHECKS)}/{len(CHECKS)+len(FAILS)} checks passed")
sys.exit(1 if FAILS else 0)
