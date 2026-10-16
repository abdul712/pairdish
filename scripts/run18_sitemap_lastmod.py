#!/usr/bin/env python3
"""Run-18: bump sitemap lastmod to 2026-10-16 for the pages edited this run.

Every edited page is a real content change, so its lastmod is real (a build-date stamp on every
URL would be a defect). The three expanded tool pages and /contact are bumped; nothing is added
and nothing is removed.
"""
import pathlib
import re

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-10-16"
SLUGS = ["tools/cooking-time", "tools/unit-converter", "tools/sourdough-calculator", "contact"]

t = SM.read_text(encoding="utf-8")
for slug in SLUGS:
    pat = re.compile(r"(<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {slug}: {k} matches")
SM.write_text(t, encoding="utf-8")
print(f"updated {len(SLUGS)} lastmod entries to {DATE}; urls={t.count('<loc>')}")
