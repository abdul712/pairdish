#!/usr/bin/env python3
"""Run-15 monitoring: Bing crawl stats + GetUrlInfo for the edited/live pages. Read-only."""
import datetime as dt
import json
import pathlib
import re
import subprocess
import urllib.parse

key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*",
                (pathlib.Path.home() / ".hermes/.env").read_text(), re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"


def get(method, extra=""):
    url = (f"https://ssl.bing.com/webmaster/api.svc/json/{method}?apikey={key}"
           f"&siteUrl={urllib.parse.quote(SITE, safe='')}{extra}")
    return subprocess.run(["curl", "-s", "--max-time", "45", url], capture_output=True, text=True).stdout


print("=== GetCrawlStats (last 4) ===")
try:
    for r in json.loads(get("GetCrawlStats")).get("d", [])[-4:]:
        m = re.search(r"/Date\((\d+)", r.get("Date", ""))
        d = dt.datetime.fromtimestamp(int(m.group(1)) / 1000, dt.UTC).date().isoformat() if m else r.get("Date")
        print("  ", d, {k: v for k, v in r.items() if k != "Date"})
except Exception as e:
    print("  ERR", e)

print("=== GetUrlInfo ===")
URLS = [
    "https://pairdish.com/tools/flavor-pairing",
    "https://pairdish.com/tools/seasonal-guide",
    "https://pairdish.com/tools/substitution-finder",
    "https://pairdish.com/articles/what-to-serve-with-fried-fish",
    "https://pairdish.com/tools/coffee-pairing",
    "https://pairdish.com/what-to-serve-with-philly-cheesesteak/",
]
for u in URLS:
    r = subprocess.run(["curl", "-s", "--max-time", "45",
                        "https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey=" + key +
                        "&siteUrl=" + urllib.parse.quote(SITE, safe='') +
                        "&url=" + urllib.parse.quote(u, safe='')], capture_output=True, text=True)
    try:
        d = json.loads(r.stdout).get("d", {}) or {}
        lc = d.get("LastCrawled")
        mm = re.search(r"/Date\((\d+)", lc or "")
        lcs = dt.datetime.fromtimestamp(int(mm.group(1)) / 1000, dt.UTC).date().isoformat() if mm else lc
        print(f"  {u.split('pairdish.com')[-1][:44]:46s} Http={d.get('HttpStatus')} InIndex={d.get('InIndex')} "
              f"LastCrawled={lcs} Size={d.get('DocumentSize')}")
    except Exception:
        print(f"  {u[:50]}: {r.stdout[:100]}")
