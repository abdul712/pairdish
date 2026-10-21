#!/usr/bin/env python3
"""Run-20: Bing GetUrlInfo for the edited pages, plus the pesto-chicken discovery check.

GetUrlInfo takes the url as a QUERY param (the body form returns an empty reply).
"""
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
KEY = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
Q = urllib.parse.quote(SITE, safe="")

PATHS = [
    "/tools/potluck-coordinator",
    "/tools/grocery-list",
    "/tools/buffet-planner",
    "/articles/grocery-budget-meal-planning",
    "/articles/what-to-serve-with-pesto-chicken",
]

for p in PATHS:
    api = (f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey={KEY}"
           f"&siteUrl={Q}&url={urllib.parse.quote(SITE + p, safe='')}")
    raw = subprocess.run(["curl", "-s", "--max-time", "60", api], capture_output=True, text=True).stdout
    d = (json.loads(raw or "{}") or {}).get("d") or {}
    if not d:
        print(f"{p:46s} NO RECORD ({raw.strip()[:60]})")
        continue
    print(f"{p:46s} docSize={d.get('DocumentSize')} lastCrawled={str(d.get('LastCrawled'))[:34]} "
          f"anchors={d.get('AnchorCount')} httpStatus={d.get('HttpStatus')}")
