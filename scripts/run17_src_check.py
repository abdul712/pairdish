#!/usr/bin/env python3
"""Run-17 source inspector: headings / tables / links for given page files."""
import re
import sys
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
for rel in sys.argv[1:]:
    s = (ROOT / rel).read_text(encoding="utf-8")
    print("#" * 20, rel, len(s), "chars")
    for m in re.finditer(r"<h([23])[^>]*>(.*?)</h\1>", s, re.S):
        t = re.sub(r"<[^>]+>", "", m.group(2))
        t = re.sub(r"\s+", " ", t).strip()
        if t:
            print("  H%s: %s" % (m.group(1), t))
    print("  tables:", s.count("<table"))
    print("  internal:", len(re.findall(r'href="/', s)))
    print("  externals:")
    for u in sorted(set(re.findall(r'href="(https?://[^"]+)', s))):
        print("    ", u)
