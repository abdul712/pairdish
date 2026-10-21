#!/usr/bin/env python3
"""Run-20: bump sitemap lastmod to 2026-10-21 for the pages edited this run.

Every edited page is a real content change, so its lastmod is real. The two expanded tool
pages, the buffet-planner link edit and the grocery-budget article (price tables refreshed
to the September 2026 vintages) are bumped; nothing is added and nothing is removed.
"""
import pathlib
import re

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-10-21"
SLUGS = [
    "tools/potluck-coordinator",
    "tools/grocery-list",
    "tools/buffet-planner",
    "articles/grocery-budget-meal-planning",
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
