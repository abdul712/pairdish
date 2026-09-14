#!/usr/bin/env python3
"""Bump lastmod to 2026-09-14 for the 8 articles edited in run 5 (internal links)."""
import re, pathlib

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-09-14"
SLUGS = [
    "what-to-serve-with-roasted-potatoes", "what-to-serve-with-fried-fish", "what-to-serve-with-pesto-chicken",
    "recipe-nutrition-calculator-guide", "meal-planning-with-macros", "pantry-meal-planning",
    "grocery-budget-meal-planning", "high-protein-meal-prep",
]

t = SM.read_text()
n = 0
for slug in SLUGS:
    pat = re.compile(r"(<loc>https://pairdish\.com/articles/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t2, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {slug}: {k} matches")
    t = t2
    n += 1
SM.write_text(t)
print(f"updated {n}/8 lastmod entries to {DATE}")
