#!/usr/bin/env python3
"""Run-19: Bing GetUrlInfo for the three edited pages (url as a QUERY param; body form returns empty)."""
import datetime as dt
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
q = urllib.parse.quote(SITE, safe="")

for path in ("/tools/dietary-finder", "/tools/glycemic-index", "/tools/caffeine-calculator", "/tools/cooking-time"):
    url = SITE + path
    api = (f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey={key}"
           f"&siteUrl={q}&url={urllib.parse.quote(url, safe='')}")
    raw = subprocess.run(["curl", "-s", "--max-time", "60", api], capture_output=True, text=True).stdout
    d = (json.loads(raw or "{}") or {}).get("d") or {}
    crawl = d.get("LastCrawledDate") or ""
    m = re.search(r"/Date\((\d+)", crawl)
    crawled = dt.datetime.fromtimestamp(int(m.group(1)) / 1000, dt.UTC).date().isoformat() if m else "-"
    print(f"{path:28s} size={d.get('DocumentSize')} anchors={d.get('AnchorCount')} lastCrawled={crawled}")
