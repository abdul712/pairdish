#!/usr/bin/env python3
"""Run-10 sitemap lastmod bump: real edit date for the 11 URLs whose pages changed
(10 meta-description rewrites + 2 tool-page content sections; a hub edit counts too)."""
import pathlib
import re

SM = pathlib.Path("/home/hermes/projects/pairdish/public/sitemap.xml")
DATE = "2026-09-25"
PATHS = [
    "/articles",
    "/disclaimer",
    "/tools/herb-spice-matrix",
    "/tools/recipe-scaler",
    "/tools/substitution-finder",
    "/tools/appetizer-planner",
    "/tools/buffet-planner",
    "/tools/leftover-matcher",
    "/tools/macro-calculator",
    "/tools/cooking-style-quiz",
    "/tools/flour-substitution",
]

t = SM.read_text(encoding="utf-8")
for p in PATHS:
    pat = re.compile(r"(<loc>https://pairdish\.com" + re.escape(p) + r"</loc>\s*\n\s*<lastmod>)[^<]+(</lastmod>)")
    t, k = pat.subn(r"\g<1>" + DATE + r"\g<2>", t)
    if k != 1:
        raise SystemExit(f"FAILED for {p}: {k} matches")
SM.write_text(t, encoding="utf-8")
print(f"updated {len(PATHS)} lastmod entries to {DATE}")
print("total sitemap URLs:", t.count("<loc>"))
