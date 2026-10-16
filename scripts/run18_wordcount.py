#!/usr/bin/env python3
"""Run-18: live word count + structure per tool page (main/article text, tags stripped). Read-only."""
import re
import subprocess
import sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
SLUGS = [
    "flour-substitution", "substitution-finder", "unit-converter", "sourdough-calculator",
    "cooking-time", "oven-temperature", "bread-proofing", "pan-size-converter",
    "leftover-matcher", "pantry-helper", "meal-prep", "grocery-list", "recipe-generator",
    "potluck-coordinator", "cooking-style-quiz", "dietary-finder", "glycemic-index",
    "caffeine-calculator", "seasonal-guide", "flavor-pairing",
]


def fetch(url):
    return subprocess.run(["curl", "-s", "--compressed", "--max-time", "25", "-A", UA, url],
                          capture_output=True, text=True).stdout


def count_words(html):
    m = re.search(r"<main[^>]*>(.*?)</main>", html, re.S | re.I)
    body = m.group(1) if m else html
    body = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", body, flags=re.S | re.I)
    body = re.sub(r"<[^>]+>", " ", body)
    body = re.sub(r"&[a-zA-Z#0-9]+;", " ", body)
    return len(re.findall(r"[A-Za-z][A-Za-z'\-]+", body))


print(f"{'slug':24s} {'words':>6s} {'tables':>7s} {'h2':>4s} {'h3':>4s} {'ext':>4s} {'int':>4s}")
for s in SLUGS:
    h = fetch(f"https://pairdish.com/tools/{s}")
    if not h:
        print(f"{s:24s}   FETCH-FAIL")
        continue
    print(f"{s:24s} {count_words(h):6d} {h.count('<table'):7d} {h.count('<h2'):4d} "
          f"{h.count('<h3'):4d} {len(set(re.findall(r'href=\"(https?://[^\"]+)', h))):4d} "
          f"{len(re.findall(r'href=\"/', h)):4d}")
