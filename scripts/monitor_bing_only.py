#!/usr/bin/env python3
"""Bing-only monitoring for pairdish.com (GSC path blocked while Google token awaits re-consent).
Uses BING_WEBMASTER_API_KEY from ~/.hermes/.env. Read-only.
"""
import json, re, pathlib, urllib.parse, subprocess

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
m = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M)
if not m:
    print("BLOCKER: BING_WEBMASTER_API_KEY missing")
    raise SystemExit(1)
bing_key = m.group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"

b = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?apikey={bing_key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
try:
    bq = json.loads(b.stdout).get("d", [])
    agg = {}
    for row in bq:
        qn = row.get("Query", "")
        a = agg.setdefault(qn, {"c": 0, "i": 0})
        a["c"] += row.get("Clicks", 0) or 0
        a["i"] += row.get("Impressions", 0) or 0
    tot_c = sum(a["c"] for a in agg.values()); tot_i = sum(a["i"] for a in agg.values())
    print(f"Bing query stats (Bing's own range, ~4mo): queries={len(agg)} clicks={tot_c} impressions={tot_i}")
    for qn, a in sorted(agg.items(), key=lambda x: -x[1]["i"])[:12]:
        print(f"  {qn} | c={a['c']} i={a['i']}")
except Exception:
    print(f"Bing GetQueryStats issue: {b.stdout[:300]}")

b2 = subprocess.run(["curl", "-s", "--max-time", "45",
                     f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlStatistics?apikey={bing_key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                    capture_output=True, text=True)
print("\nBing GetUrlStatistics:", b2.stdout[:400])

# sitemap feeds status
f = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetFeeds?apikey={bing_key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
print("\nBing GetFeeds:", f.stdout[:600])
