#!/usr/bin/env python3
"""Run-17: re-verify the tracker's `listed` rows are still live (200 + site name in body)."""
import csv
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

rows = list(csv.DictReader(open(ROOT / "outreach/tracker.csv", encoding="utf-8", newline="")))
for r in rows:
    if r.get("status") != "listed":
        continue
    url = (r.get("listing_url_or_proof") or "").strip() or (r.get("url") or "").strip()
    url = url.split()[0] if url else ""   # proof fields sometimes append a note after the URL
    if not url.startswith("http"):
        print(f"{r['site_name']:24s} no listing URL recorded")
        continue
    out = subprocess.run(["curl", "-4", "-s", "--compressed", "-L", "--max-time", "30", "-A", UA,
                          "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                         encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    low = body.lower()
    print(f"{r['site_name']:24s} {code.strip():4s} pairdish_in_body={'pairdish' in low} "
          f"url={url[:70]}")
