#!/usr/bin/env python3
"""Huzzler product POST with hand-built multipart body (avoids curl -F quirks)."""
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"
HZ = "https://huzzler.so"

r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L", HZ + "/products/create"],
                   capture_output=True, text=True, timeout=90)
h = r.stdout
tokv = re.search(r'name="_token" value="([^"]+)"', h).group(1)

desc = ("<p>PairDish helps home cooks answer the daily question \u201cwhat should I serve with this?\u201d "
        "with interactive tools \u2014 a flavor pairing finder, cheese board builder, buffet and party "
        "quantity calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. "
        "Its pairing guides combine practical tables, portion math, and citations to official sources "
        "like USDA MyPlate and FSIS food-safety charts. Free to use, no signup required.</p>")
short = ("Free food pairing toolkit: flavor pairing finder, cheese board builder, nutrition and "
         "meal-prep calculators, plus pairing guides for any main dish.")
fields = [
    ("_token", tokv),
    ("project_category_id", "36"),
    ("name", "PairDish"),
    ("url", "https://pairdish.com"),
    ("short_description", short),
    ("description", desc),
]
BOUN = "----PairDishForm7f3a"
parts = []
for k, v in fields:
    parts.append(f"--{BOUN}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())
body = b"".join(parts) + f"--{BOUN}--\r\n".encode()

Path("/tmp/hz_body.bin").write_bytes(body)
p = subprocess.run(
    ["curl", "-sS", "--max-time", "90", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/products/create",
     "-H", f"X-CSRF-TOKEN: {tokv}",
     "-H", "Accept: application/json",
     "-H", f"Content-Type: multipart/form-data; boundary={BOUN}",
     "-o", "/tmp/hz_product_resp.json",
     "-w", "%{http_code}",
     "--data-binary", "@/tmp/hz_body.bin",
     HZ + "/products"], capture_output=True, text=True, timeout=120)
print("POST http:", p.stdout, "| stderr:", p.stderr[-200:])
rp = Path("/tmp/hz_product_resp.json")
print("resp:", rp.read_text(encoding="utf-8", errors="replace")[:400] if rp.exists() else "(no file)")