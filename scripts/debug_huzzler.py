#!/usr/bin/env python3
"""Find how Huzzler login/register submit works (Alpine @submit.prevent + fetch target)."""
import re
from pathlib import Path

h = Path("/tmp/hz_login.html").read_text(encoding="utf-8", errors="replace")
# find the register form block
i = h.find("register-form-element")
print("form idx:", i)
block = h[max(0, i - 400): i + 1200]
# strip tags for readability
print(re.sub(r"\s+", " ", block)[:1400])
print("=====")
# alpine x-data handlers on the page
for m in re.finditer(r'x-data="([^"]{0,180})"', h):
    print("x-data:", m.group(1)[:170])
# any js fetch to /register or /login endpoints
app = Path("/tmp/hz_app.js").read_text(encoding="utf-8", errors="replace")
for m in re.finditer(r'["\'](/(?:register|login|signup|auth)[a-z0-9/_-]*)["\']', app):
    print("endpoint:", m.group(1))
for m in re.finditer(r'fetch\(\s*["\']([^"\']+)["\']', app):
    u = m.group(1)
    if "register" in u or "login" in u or "auth" in u:
        print("fetch:", u)