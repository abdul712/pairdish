#!/usr/bin/env python3
"""Run-13: bump sitemap lastmod to 2026-10-05 for the three tool pages edited this run."""
import pathlib
import re

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-10-05"
SLUGS = ["tools/coffee-pairing", "tools/cheese-pairing", "tools/nutrition-calculator"]

t = SM.read_text(encoding="utf-8")
for slug in SLUGS:
    pat = re.compile(r"(<loc>https://pairdish\.com/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {slug}: {k} matches")
SM.write_text(t, encoding="utf-8")
print(f"updated {len(SLUGS)} lastmod entries to {DATE}; urls={t.count('<loc>')}")
