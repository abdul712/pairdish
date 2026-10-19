#!/usr/bin/env python3
"""Run-19: Bing SubmitUrlBatch for the three edited tool pages."""
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
URLS = [f"{SITE}/tools/dietary-finder", f"{SITE}/tools/glycemic-index", f"{SITE}/tools/caffeine-calculator"]

for url in URLS:
    body = json.dumps({"siteUrl": SITE, "url": url})
    api = (f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey={key}"
           f"&siteUrl={urllib.parse.quote(SITE, safe='')}")
    r = subprocess.run(["curl", "-s", "--max-time", "45", "-H", "Content-Type: application/json",
                        "-d", body, api], capture_output=True, text=True).stdout
    print(url, "->", r.strip()[:120])
q = json.loads(subprocess.run(["curl", "-s", "--max-time", "45",
    f"https://ssl.bing.com/webmaster/api.svc/json/GetQuota?apikey={key}"
    f"&siteUrl={urllib.parse.quote(SITE, safe='')}"], capture_output=True, text=True).stdout or "{}")
print("quota:", q.get("d"))
