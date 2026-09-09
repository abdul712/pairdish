#!/usr/bin/env python3
"""Find onSaveProjectButtonClicked implementation: search huzzler app JS + any extra module."""
import re
import subprocess
from pathlib import Path

app = Path("/tmp/hz_app.js").read_text(encoding="utf-8", errors="replace")
idx = app.find("onSaveProjectButtonClicked")
print("in app.js idx:", idx)
if idx >= 0:
    print(app[idx - 100: idx + 900])
else:
    # find module that registers it
    m = re.search(r'"([A-Za-z]+)"\s*:\s*"onSaveProjectButtonClicked"|onSaveProjectButtonClicked', app)
    print("fallback:", m)
    # look for imports in create page
    h = Path("/tmp/hz_create.html").read_text(encoding="utf-8", errors="replace")
    for mm in re.finditer(r'src="([^"]*\.js[^"]*)"', h):
        print("page js:", mm.group(1))