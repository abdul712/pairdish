#!/usr/bin/env python3
"""Run-20: explicit HTTP status for every sitemap URL (the audit only reported empties before)."""
import re
import subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
sm = subprocess.run(["curl", "-s", "--compressed", "--max-time", "30", "-A", UA,
                     "https://pairdish.com/sitemap.xml"], capture_output=True, text=True).stdout
urls = re.findall(r"<loc>([^<]+)</loc>", sm)
print("sitemap urls:", len(urls))
bad = []
for u in urls:
    code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "30",
                           "-A", UA, u], capture_output=True, text=True).stdout.strip()
    if code != "200":
        bad.append((u, code))
print(f"200s: {len(urls) - len(bad)}/{len(urls)}")
for u, c in bad:
    print("  NOT 200:", c, u)
