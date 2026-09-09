#!/usr/bin/env python3
"""Get Huzzler product-category options from the create form."""
import re
from pathlib import Path

h = Path("/tmp/hz_create.html").read_text(encoding="utf-8", errors="replace")
i = h.find('name="project_category_id"')
print("select idx:", i)
block = h[i - 200: i + 3000]
opts = re.findall(r'<option value="(\d+)"[^>]*>([^<]+)</option>', block)
print(f"options ({len(opts)}):")
for v, label in opts:
    print(f"  {v} = {label.strip()}")