#!/usr/bin/env python3
"""Run-18 official-source gate: UA ladder + expected-phrase assertion per URL. Read-only."""
import re
import subprocess
import sys

BROWSER = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
           "Chrome/126.0.0.0 Safari/537.36")
PLAIN = "curl/8.5.0"

PAIRS = [
    ("https://www.kingarthurbaking.com/learn/ingredient-weight-chart", ""),
    ("https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-137", "137.105"),
    ("https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9", "240"),
    ("https://www.nist.gov/pml/weights-and-measures/publications/nist-handbooks/handbook-44", ""),
    ("https://www.kingarthurbaking.com/learn/guides/sourdough-starter", ""),
    ("https://www.cdc.gov/food-safety/foods/no-raw-dough.html", ""),
    ("https://extension.colostate.edu/resource/ingredient-substitutions/", ""),
    ("https://www.fda.gov/consumers/consumer-updates/flour-raw-food-and-other-safety-facts", ""),
    ("https://www.kingarthurbaking.com/blog/2023/08/31/proofing-bread", ""),
    ("https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f", ""),
]
if len(sys.argv) > 1:
    PAIRS = [(u, "") for u in sys.argv[1:]]


def probe(url, ua):
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "25", "-A", ua,
                        "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    body = r.stdout
    code = ""
    if "@@" in body:
        body, code = body.rsplit("@@", 1)
    return code.strip(), body


for u, phrase in PAIRS:
    line = []
    best = None
    for label, ua in (("browser", BROWSER), ("curl", PLAIN)):
        code, body = probe(u, ua)
        hit = ""
        m = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
        if m:
            hit = re.sub(r"\s+", " ", m.group(1)).strip()[:60]
        found = ""
        if phrase:
            found = f" phrase={'YES' if phrase in body else 'NO'}"
        line.append(f"{label}={code} ({len(body)}b){found} {hit}")
        if code == "200" and body and best is None:
            best = (label, body)
    print(f"{u}\n    " + "\n    ".join(line))
