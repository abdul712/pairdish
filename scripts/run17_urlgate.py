#!/usr/bin/env python3
"""Run-17 official-source URL gate: UA ladder (browser UA, then plain curl UA), report which worked."""
import subprocess
import sys
import re

BROWSER = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
           "Chrome/126.0.0.0 Safari/537.36")
PLAIN = "curl/8.5.0"

URLS = [
    "https://cdn.realfood.gov/DGA.pdf",
    "https://www.dietaryguidelines.gov/",
    "https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink",
    "https://www.cdc.gov/alcohol/standard-drink-sizes/index.html",
    "https://www.uaex.uada.edu/counties/miller/news/fcs/holiday-foods/Appetizers-or-Hors-d-oeuvres-Options-are-Endless.aspx",
    "https://redstaryeast.com/baking-tips/yeast-conversion-chart/",
    "https://extension.missouri.edu/publications/mp564",
    "https://pubs.nmsu.edu/_e/E131/index.html",
    "https://extension.colostate.edu/resource/ingredient-substitutions/",
    "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f",
    "https://www.kingarthurbaking.com/blog/2023/08/31/proofing-bread",
]
if len(sys.argv) > 1:
    URLS = sys.argv[1:]


def probe(url, ua):
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "25", "-A", ua,
                        "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    body = r.stdout
    code = ""
    if "@@" in body:
        body, code = body.rsplit("@@", 1)
    return code.strip(), body


for u in URLS:
    out = []
    for label, ua in (("browser", BROWSER), ("curl", PLAIN)):
        code, body = probe(u, ua)
        hit = ""
        m = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
        if m:
            hit = re.sub(r"\s+", " ", m.group(1)).strip()[:70]
        out.append(f"{label}={code} ({len(body)}b) {hit}")
    print(f"{u}\n    " + "\n    ".join(out))
