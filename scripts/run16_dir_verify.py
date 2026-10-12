#!/usr/bin/env python3
"""Run-15 directory listing verification sweep.

For every tracker row with status submitted / pending_review, query the host's phpLD search
endpoint with the site NAME (the skill's rule: `?search=<domain>` returns 0 hits even when a
listing exists, while `?search=<site name>` finds it). Report only; the tracker is updated by
hand afterwards (never log `listed` without a 200 listing page whose body lacks a pending marker).

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


flips = []
for r in rows:
    if r["status"] not in ("submitted", "pending_review"):
        continue
    host = urlparse(r["url"] if "//" in r["url"] else "https://" + r["url"]).netloc
    if not host:
        continue
    short = host.replace("www.", "")
    base = "https://www." + short
    note = ""
    for q in ("PairDish", "pairdish"):
        code, body = fetch(base + "/search.php?search=" + q)
        listings = re.findall(r'href="([^"]*listing/[^"]+)"', body)
        if code == "200" and listings:
            lc, lb = fetch(listings[0] if listings[0].startswith("http") else base + listings[0])
            pending = bool(re.search(r"pending|awaiting|not yet", lb, re.I))
            print(f"{short:36s} q={q:9s} search={code} listing={lc} pairdish_in_body={'pairdish' in lb.lower()} pending_marker={pending}")
            if lc == "200" and "pairdish" in lb.lower() and not pending:
                flips.append((short, listings[0]))
            note = "found"
            break
        note = f"search={code} links={len(listings)}"
    else:
        print(f"{short:36s} {note} (no listing link)")

print()
print("FLIPS (verify + flip to listed):", flips if flips else "none")
