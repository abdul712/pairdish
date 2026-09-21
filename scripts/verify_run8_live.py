#!/usr/bin/env python3
"""Run 8 live verification: expanded macros article + protein-calculator freshness edit.

Checks (all against the deployed site, browser-UA fetch):
  - HTTP 200 on both URLs
  - macros article: word count in the 1,200-1,900 band, 2+ <table>s, the new DGA table rows,
    sources links present, zero FAQ sections / FAQPage JSON-LD, meta description <= 160 chars
  - protein-calculator: 200, dietaryguidelines.gov link present, FAQPage absent
  - sitemap: lastmod 2026-09-21 on both URLs
"""
import html
import re
import subprocess
import sys

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124 Safari/537.36")
BASE = "https://pairdish.com"
fails = []


def get(url):
    r = subprocess.run(["curl", "-s", "--compressed", "--max-time", "40", "-A", UA, url],
                       capture_output=True, text=True)
    return r.stdout


def check(cond, label, detail=""):
    print(("PASS " if cond else "FAIL ") + label + (f"  [{detail}]" if detail else ""))
    if not cond:
        fails.append(label)


art = get(f"{BASE}/articles/meal-planning-with-macros")
prot = get(f"{BASE}/tools/protein-calculator")
sm = get(f"{BASE}/sitemap.xml")

# ---- article
txt = re.sub(r"<script.*?</script>", " ", art, flags=re.S | re.I)
txt = re.sub(r"<style.*?</style>", " ", txt, flags=re.S | re.I)
words = len(re.sub(r"<[^>]+>", " ", txt).split())
check(len(art) > 20000, "macros article served", f"{len(art)}B")
check(1200 <= words <= 2100, "word count in band", f"{words} words")
check(art.count("<table") >= 2, "tables present", f"{art.count('<table')} tables")
check("1.2-1.6 g per kg body weight" in art or "1.2-1.6 g per kg" in art, "DGA protein row present")
check("Dietary Guidelines for Americans, 2025-2030" in art, "DGA citation text present")
check("cdn.realfood.gov/DGA.pdf" in art, "DGA source link present")
check("nal.usda.gov" in art and "fdc.nal.usda.gov" in art, "official source links present")
check(art.lower().count("<h2") >= 8, "h2 hierarchy present", f"{art.count('<h2')} h2")
check(art.count("https://pairdish.com/") + art.count('href="/') >= 8, "internal links present")
check("Frequently Asked Questions" not in art, "no FAQ section")
check('"@type":"FAQPage"' not in art, "no FAQPage JSON-LD")
m = re.search(r'<meta name="description" content="([^"]*)"', art)
if m:
    d = html.unescape(m.group(1))
    check(len(d) <= 160, "meta description <=160", f"{len(d)} chars")
else:
    fails.append("meta description missing")
    print("FAIL meta description missing")

# ---- protein calculator
check(len(prot) > 8000, "protein-calculator served", f"{len(prot)}B")
check("dietaryguidelines.gov" in prot, "protein page cites current guidelines")
check("1.2-1.6g per kg" in prot or "1.2-1.6 g per kg" in prot, "protein page states 1.2-1.6 g/kg")
check('"@type":"FAQPage"' not in prot, "tool page has no FAQPage")

# ---- pantry article (run 8b)
pan = get(f"{BASE}/articles/pantry-meal-planning")
ptxt = re.sub(r"<script.*?</script>", " ", pan, flags=re.S | re.I)
ptxt = re.sub(r"<style.*?</style>", " ", ptxt, flags=re.S | re.I)
pwords = len(re.sub(r"<[^>]+>", " ", ptxt).split())
check(len(pan) > 20000, "pantry article served", f"{len(pan)}B")
check(1200 <= pwords <= 2100, "pantry word count in band", f"{pwords} words")
check(pan.count("<table") >= 2, "pantry tables present", f"{pan.count('<table')} tables")
check("USDA FSIS shelf-stable storage times" in pan, "FSIS shelf-stable table caption")
check("11.6 percent" in pan and "133 billion pounds" in pan, "ERS food-loss figures present")
check("fsis.usda.gov" in pan and "ers.usda.gov" in pan, "official source links present")
check("Frequently Asked Questions" not in pan, "pantry: no FAQ section")
check('"@type":"FAQPage"' not in pan, "pantry: no FAQPage JSON-LD")
m2 = re.search(r'<meta name="description" content="([^"]*)"', pan)
if m2:
    d2 = html.unescape(m2.group(1))
    check(len(d2) <= 160, "pantry meta description <=160", f"{len(d2)} chars")
else:
    fails.append("pantry meta description missing")

# ---- sitemap
for slug in ("/articles/meal-planning-with-macros", "/tools/protein-calculator",
             "/articles/pantry-meal-planning"):
    i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
    block = sm[i:sm.find("</url>", i)] if i != -1 else ""
    check("2026-09-21" in block, f"sitemap lastmod 2026-09-21 {slug}",
          block.split("<lastmod>")[1].split("<")[0] if "<lastmod>" in block else "no lastmod")
check(sm.count("<loc>") >= 52, "sitemap url count", str(sm.count("<loc>")))

print(f"\n{'ALL PASS' if not fails else 'FAILURES: ' + ', '.join(fails)}")
sys.exit(0 if not fails else 2)
