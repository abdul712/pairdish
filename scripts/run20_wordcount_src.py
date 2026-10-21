#!/usr/bin/env python3
"""Run-20: word count + structure from SOURCE .astro pages (pre-deploy sizing).

Strips the YAML frontmatter, script/style blocks and tags, then counts words in the
rendered text. Matches run19_wordcount_src's counting rule so source and live are comparable.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SLUGS = sys.argv[1:] or [
    "cooking-style-quiz",
    "potluck-coordinator",
    "grocery-list",
    "recipe-generator",
    "meal-prep",
    "seasonal-guide",
    "flavor-pairing",
]


def count(path):
    s = path.read_text(encoding="utf-8")
    s = re.sub(r"^---.*?---", " ", s, count=1, flags=re.S)
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"&[a-zA-Z#0-9]+;", " ", s)
    return len(re.findall(r"[A-Za-z][A-Za-z'\-]+", s))


print(f"{'slug':22s} {'words':>6s} {'tables':>7s} {'h2':>4s} {'h3':>4s} {'ext':>4s} {'int':>4s}")
for s in SLUGS:
    p = ROOT / "src/pages/tools" / f"{s}.astro"
    src = p.read_text(encoding="utf-8")
    print(f"{s:22s} {count(p):6d} {src.count('<table'):7d} {src.count('<h2'):4d} "
          f"{src.count('<h3'):4d} {len(set(re.findall(r'href=\"(https?://[^\"]+)', src))):4d} "
          f"{len(re.findall(r'href=\"/', src)):4d}")
