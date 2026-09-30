#!/usr/bin/env python3
"""Run-12: submit the 3 changed URLs to Bing (SubmitUrlBatch) and show feed status."""
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"

URLS = [
    "https://pairdish.com/tools/flavor-pairing",
    "https://pairdish.com/tools/party-calculator",
    "https://pairdish.com/tools/herb-spice-matrix",
]
body = json.dumps({"siteUrl": SITE, "urlList": URLS})
r = subprocess.run(["curl", "-s", "--max-time", "60", "-X", "POST",
                    "-H", "Content-Type: application/json", "-d", body,
                    f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={key}"],
                   capture_output=True, text=True)
print(f"SubmitUrlBatch ({len(URLS)} urls):", r.stdout[:200])

q = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetQuota?apikey={key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
print("GetQuota:", q.stdout[:300])
f = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetFeeds?apikey={key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
try:
    for feed in json.loads(f.stdout).get("d", []):
        print(f"feed {feed['Url']} status={feed['Status']} urls={feed['UrlCount']} lastCrawled={feed['LastCrawled']}")
except Exception:
    print("GetFeeds:", f.stdout[:200])
