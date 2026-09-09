#!/usr/bin/env python3
"""Huzzler product POST retry with proper error visibility (curl exit code + verbose tail)."""
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"
HZ = "https://huzzler.so"

r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L", HZ + "/products/create"],
                   capture_output=True, text=True, timeout=90)
h = r.stdout
tok = re.search(r'name="_token" value="([^"]+)"', h)
tokv = tok.group(1) if tok else ""
print("token:", bool(tok), "| page len:", len(h), "| logged_in:", "logout" in h.lower())
desc = ("<p>PairDish helps home cooks answer the daily question \u201cwhat should I serve with this?\u201d "
        "with interactive tools \u2014 a flavor pairing finder, cheese board builder, buffet and party "
        "quantity calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. "
        "Its pairing guides combine practical tables, portion math, and citations to official sources "
        "like USDA MyPlate and FSIS food-safety charts. Free to use, no signup required.</p>")
short = ("Free food pairing toolkit: flavor pairing finder, cheese board builder, nutrition and "
         "meal-prep calculators, plus pairing guides for any main dish.")
p = subprocess.run(
    ["curl", "-sS", "--max-time", "90", "--connect-timeout", "30", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/products/create",
     "-H", f"X-CSRF-TOKEN: {tokv}",
     "-H", "Accept: application/json",
     "-o", "/tmp/hz_product_resp.json",
     "-w", "%{http_code}",
     "--fail-with-body",
     "-F", "_token=" + tokv,
     "-F", "project_category_id=36",
     "-F", "name=PairDish",
     "-F", "url=https://pairdish.com",
     "-F", f"short_description={short}",
     "-F", f"description={desc}",
     HZ + "/products"], capture_output=True, text=True, timeout=120)
print("POST http:", p.stdout, "| stderr:", p.stderr[-300:])
rp = Path("/tmp/hz_product_resp.json")
print("resp:", rp.read_text(encoding="utf-8", errors="replace")[:400] if rp.exists() else "(no file)")