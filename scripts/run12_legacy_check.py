#!/usr/bin/env python3
"""Run-12 finding check: is Bing re-crawling the 27 archived legacy /what-to-serve-with-<dish>/
paths that 404 today? GetUrlInfo per path reports HttpStatus + LastCrawled when Bing knows the URL.
Read-only.
"""
import json
import pathlib
import re
import subprocess
import urllib.parse

key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*",
                (pathlib.Path.home() / ".hermes/.env").read_text(), re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"

LEGACY = [
    "what-to-serve-with-philly-cheesesteak", "what-to-serve-with-pizza",
    "what-to-serve-with-prime-rib", "what-to-serve-with-fish",
    "what-to-serve-with-asparagus", "what-to-serve-with-birria-tacos",
    "what-to-serve-with-stir-fry", "what-to-serve-with-tikka-masala",
]
CONTROL = ["tools/flavor-pairing", "articles/what-to-serve-with-fried-fish"]


def info(path):
    u = f"{SITE}/{path}/"
    r = subprocess.run(["curl", "-s", "--max-time", "45",
                        "https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey=" + key +
                        "&siteUrl=" + urllib.parse.quote(SITE, safe='') +
                        "&url=" + urllib.parse.quote(u, safe='')], capture_output=True, text=True)
    try:
        return json.loads(r.stdout).get("d", {})
    except Exception:
        return {"raw": r.stdout[:120]}


for group, paths in (("legacy (404 today)", LEGACY), ("control (live)", CONTROL)):
    print(f"--- {group}")
    for p in paths:
        d = info(p)
        if "raw" in d:
            print(f"  {p:38s} {d['raw']}")
        else:
            print(f"  {p:38s} HttpStatus={d.get('HttpStatus')} LastCrawled={d.get('LastCrawled')} "
                  f"DocumentSize={d.get('DocumentSize')} InIndex={d.get('InIndex')}")
        # live check
        code = subprocess.run(["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "20",
                               "-A", "Mozilla/5.0 Chrome/126", f"{SITE}/{p}/"], capture_output=True, text=True).stdout
        print(f"      live: {code}")
