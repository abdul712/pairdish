#!/usr/bin/env python3
"""Run-20: bump sitemap lastmod to 2026-10-23 for the pages edited this run.

Every edited page is a real content change, so its lastmod is real. The three expanded tool
pages and the nutrition-calculator inbound link edit are bumped; nothing is added or removed.
"""
import pathlib
import re

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-10-23"
SLUGS = [
    "tools/oven-temperature",
    "tools/meal-prep",
    "tools/protein-calculator",
    "tools/nutrition-calculator",
]

t = SM.read_text(encoding="utf-8")
for slug in SLUGS:
    pat = re.compile(r"(<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {slug}: {k} matches")
SM.write_text(t, encoding="utf-8")
print(f"updated {len(SLUGS)} lastmod entries to {DATE}; urls={t.count('<loc>')}")
for slug in SLUGS:
    m = re.search(r"<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>([^<]+)", t)
    print("  ", slug, "->", m.group(1) if m else "MISSING")
