#!/usr/bin/env python3
"""Run-15: status sweep of every URL in the live sitemap (200 check). Read-only."""
import re
import subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

sm = subprocess.run(["curl", "-s", "--compressed", "--max-time", "25", "-A", UA,
                     "https://pairdish.com/sitemap.xml"], capture_output=True, text=True).stdout
urls = re.findall(r"<loc>([^<]+)</loc>", sm)
bad = []
for u in urls:
    code = subprocess.run(["curl", "-s", "-o", "/dev/null", "--max-time", "25", "-A", UA,
                           "-w", "%{http_code}", u], capture_output=True, text=True).stdout.strip()
    if code != "200":
        bad.append((u, code))
print(f"sitemap URLs: {len(urls)} | non-200: {bad if bad else 'none'}")
