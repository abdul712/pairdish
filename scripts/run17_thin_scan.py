#!/usr/bin/env python3
"""Run-17 thin-page defect scan: tables / external official links / internal links per tool page."""
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
LIVE = {}

for p in sorted((ROOT / "src/pages/tools").glob("*.astro")):
    s = p.read_text(encoding="utf-8")
    tabs = s.count("<table")
    ext = sorted(set(re.findall(r'href="(https?://[^"]+)', s)))
    intl = len(re.findall(r'href="/', s))
    print(f"{p.name:32s} tables={tabs} externals={len(ext):2d} internal={intl:2d}")
    if tabs == 0 or len(ext) == 0:
        for u in ext:
            print("      ext:", u)
