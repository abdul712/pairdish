#!/usr/bin/env python3
"""Resolve exampledir.com category ids to their top-level parent by walking the option list."""
import html
import re
import subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
body = subprocess.run(["curl", "-4", "-s", "--compressed", "-L", "--max-time", "40", "-A", UA,
                       "https://exampledir.com/submit"], capture_output=True, text=True,
                      encoding="utf-8", errors="replace").stdout

opts = re.findall(r'<option value="(\d+)"\s*>([^<]*)</option>', body)
parent = None
want = {"294", "405", "68", "114", "218", "502", "541"}
for val, raw in opts:
    label = html.unescape(raw).replace("\xa0", " ").strip()
    if "___" not in label:
        parent = label
    elif val in want:
        print(f"id={val:>4s}  parent={parent!r:28s} leaf={label.lstrip('| ').replace('___','')!r}")
print("total options:", len(opts))
