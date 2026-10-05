#!/usr/bin/env python3
"""Run-13 directory listing verification sweep.

For every tracker row with status submitted / pending_review, fetch the host's phpLD search
endpoint (/search.php?search=pairdish.com) and look for a listing link. Report only; the
tracker is updated by hand afterwards (never log `listed` without a 200 listing page).

Read-only. Writes nothing except stdout.
"""
import csv
import pathlib
import re
import subprocess
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"

rows = list(csv.DictReader(open(ROOT / "outreach/tracker.csv", encoding="utf-8", newline="")))


def fetch(url):
    r = subprocess.run(["curl", "-s", "--compressed", "--max-time", "25", "-A", UA,
                        "-w", "\n@@%{http_code}", url], capture_output=True, text=True)
    out = r.stdout or ""
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


for r in rows:
    if r["status"] not in ("submitted", "pending_review"):
        continue
    host = urlparse(r["url"] if "//" in r["url"] else "https://" + r["url"]).netloc
    if not host:
        continue
    base = "https://www." + host.replace("www.", "")
    code, body = fetch(base + "/search.php?search=pairdish.com")
    listings = re.findall(r'href="([^"]*listing/[^"]+)"', body)
    hit = "pairdish" in body.lower()
    print(f"{host:36s} search={code:3s} pairdish_in_body={hit} links={listings[:2]}")
    if listings:
        lc, lb = fetch(base + listings[0] if listings[0].startswith("/") else listings[0])
        print(f"     -> listing page {lc} pairdish={('pairdish' in lb.lower())}")
print("done")
