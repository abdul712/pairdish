#!/usr/bin/env python3
"""Run-18: submit the changed URLs to Bing (SubmitUrlBatch) and show feed status.

Includes the three expanded tool pages and the three legacy URLs that now 301 (re-submitting a
301 source is the documented way to get the redirect re-crawled and the ranking signal moved).
"""
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"

URLS = [
    "https://pairdish.com/tools/cooking-time",
    "https://pairdish.com/tools/unit-converter",
    "https://pairdish.com/tools/sourdough-calculator",
    "https://pairdish.com/contact",
    "https://pairdish.com/what-to-serve-with-fried-fish/",
    "https://pairdish.com/what-to-serve-with-roasted-potatoes/",
    "https://pairdish.com/what-to-serve-with-pesto-chicken/",
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
