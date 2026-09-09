#!/usr/bin/env python3
"""Huzzler: POST product PairDish (category 36 Food & Drink) via /products form POST.
Reads fresh csrf-token meta from /products/create, multipart fields per the form."""
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"  # session cookies from login probe
HZ = "https://huzzler.so"

r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L", HZ + "/products/create"],
                   capture_output=True, text=True, timeout=90)
h = r.stdout
tok = re.search(r'name="csrf-token" content="([^"]+)"', h)
print("csrf meta:", bool(tok))
if not tok:
    tok2 = re.search(r'name="_token" value="([^"]+)"', h)
    tok = tok2
print("token:", bool(tok))
desc = ("<p>PairDish helps home cooks answer the daily question \u201cwhat should I serve with this?\u201d "
        "with interactive tools \u2014 a flavor pairing finder, cheese board builder, buffet and party "
        "quantity calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. "
        "Its pairing guides combine practical tables, portion math, and citations to official sources "
        "like USDA MyPlate and FSIS food-safety charts. Free to use, no signup required.</p>")
short = ("Free food pairing toolkit: flavor pairing finder, cheese board builder, nutrition and "
         "meal-prep calculators, plus pairing guides for any main dish.")
out = subprocess.run(
    ["curl", "-s", "--max-time", "90", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/products/create",
     "-H", f"X-CSRF-TOKEN: {tok.group(1)}",
     "-H", "Accept: application/json",
     "-o", "/tmp/hz_product_resp.json",
     "-w", "%{http_code}",
     "-F", "_token=" + tok.group(1),
     "-F", "project_category_id=36",
     "-F", "name=PairDish",
     "-F", "url=https://pairdish.com",
     "-F", f"short_description={short}",
     "-F", f"description={desc}",
     HZ + "/products"], capture_output=True, text=True, timeout=120)
print("POST http:", out.stdout)
resp = Path("/tmp/hz_product_resp.json").read_text(encoding="utf-8", errors="replace")
print("resp:", resp[:400])