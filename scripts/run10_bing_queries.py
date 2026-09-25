#!/usr/bin/env python3
"""Dump full Bing query inventory for pairdish.com to a file (read-only)."""
import json, re, pathlib, urllib.parse, subprocess

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
m = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M)
key = m.group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"

r = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?apikey={key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
data = json.loads(r.stdout).get("d", [])
agg = {}
for row in data:
    q = (row.get("Query") or "").strip()
    a = agg.setdefault(q, {"c": 0, "i": 0})
    a["c"] += row.get("Clicks", 0) or 0
    a["i"] += row.get("Impressions", 0) or 0
out = sorted(agg.items(), key=lambda x: (-x[1]["i"], x[0]))
p = pathlib.Path("outreach/bing_queries_run10.txt")
p.parent.mkdir(exist_ok=True)
with p.open("w", encoding="utf-8") as f:
    for q, a in out:
        f.write(f"{a['i']:4d} {a['c']:4d} {q}\n")
print(f"wrote {len(out)} queries -> {p}")
print(f"totals: clicks={sum(a['c'] for a in agg.values())} impressions={sum(a['i'] for a in agg.values())}")
print("\nTOP 40 by impressions:")
for q, a in out[:40]:
    print(f"  i={a['i']:3d} c={a['c']:2d}  {q}")
