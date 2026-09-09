#!/usr/bin/env python3
"""Huzzler: publish product on the FREE 72-day queue (listing_type=standard)."""
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"
HZ = "https://huzzler.so"
URL = HZ + "/products/J1LyjvxNyF/pairdish/publication"

r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L", URL],
                   capture_output=True, text=True, timeout=90)
h = r.stdout
tokv = re.search(r'name="_token" value="([^"]+)"', h).group(1)
p = subprocess.run(
    ["curl", "-sS", "--max-time", "90", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", URL,
     "-H", "X-Requested-With: XMLHttpRequest",
     "-H", "Accept: application/json",
     "-o", "/tmp/hz_publish_resp.json", "-w", "%{http_code}",
     "--data-urlencode", f"_token={tokv}",
     "--data-urlencode", "listing_type=standard",
     HZ + "/products/J1LyjvxNyF/publish"], capture_output=True, text=True, timeout=120)
print("publish http:", p.stdout)
rp = Path("/tmp/hz_publish_resp.json")
print("resp:", rp.read_text(encoding="utf-8", errors="replace")[:300] if rp.exists() else "(no file)")