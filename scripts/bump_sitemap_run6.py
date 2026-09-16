#!/usr/bin/env python3
"""Run-6: bump lastmod to 2026-09-16 for the 36 tool pages edited this run
(FAQ removal site-wide + Related Guides links on 9 pages)."""
import re, pathlib

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-09-16"
SLUGS = [p.stem for p in sorted(pathlib.Path("/home/hermes/projects/pairdish/src/pages/tools").glob("*.astro"))
         if p.stem != "index"]

t = SM.read_text()
n = 0
for slug in SLUGS:
    pat = re.compile(r"(<loc>https://pairdish\.com/tools/" + re.escape(slug) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t2, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {slug}: {k} matches")
    t = t2
    n += 1
SM.write_text(t)
print(f"updated {n} tool lastmod entries to {DATE}")
