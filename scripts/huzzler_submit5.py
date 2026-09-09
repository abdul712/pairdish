#!/usr/bin/env python3
"""Huzzler product POST v5: logo field name is logo[] per imageUploadZone config."""
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

short = "Free food pairing toolkit: pairing finder, calculators, and guides."
desc = ("<p>PairDish helps home cooks answer the daily question \u201cwhat should I serve with this?\u201d "
        "with interactive tools \u2014 a flavor pairing finder, cheese board builder, buffet and party "
        "quantity calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. "
        "Its pairing guides combine practical tables, portion math, and citations to official sources "
        "like USDA MyPlate and FSIS food-safety charts. Free to use, no signup required.</p>")
boundary = "----PairDishForm11e9"
parts = []


def add_field(k, v):
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())


for k, v in [("_token", tokv), ("project_category_id", "36"), ("name", "PairDish"),
             ("url", "https://pairdish.com"), ("short_description", short), ("description", desc)]:
    add_field(k, v)
logo = Path("/tmp/pairdish_logo.png").read_bytes()
parts.append(b"--" + boundary.encode() + b"\r\nContent-Disposition: form-data; name=\"logo[]\"; filename=\"pairdish-logo.png\"\r\nContent-Type: image/png\r\n\r\n")
parts.append(logo)
parts.append(b"\r\n--" + boundary.encode() + b"--\r\n")
Path("/tmp/hz_body5.bin").write_bytes(b"".join(parts))

p = subprocess.run(
    ["curl", "-sS", "--max-time", "120", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/products/create",
     "-H", f"X-CSRF-TOKEN: {tokv}",
     "-H", "Accept: application/json",
     "-H", f"Content-Type: multipart/form-data; boundary={boundary}",
     "-o", "/tmp/hz_product_resp5.json",
     "-w", "%{http_code}",
     "--data-binary", "@/tmp/hz_body5.bin",
     HZ + "/products"], capture_output=True, text=True, timeout=150)
print("POST http:", p.stdout)
rp = Path("/tmp/hz_product_resp5.json")
print("resp:", rp.read_text(encoding="utf-8", errors="replace")[:500] if rp.exists() else "(no file)")