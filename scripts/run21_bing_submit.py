#!/usr/bin/env python3
"""Run-21 Bing: SubmitUrl the four edited URLs, FetchUrl the pesto-chicken page (no record
after run 19's SubmitUrl), then read GetUrlInfo for all five."""
import json, pathlib, re, subprocess, urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
KEY = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
URLS = ["/tools/oven-temperature", "/tools/meal-prep", "/tools/protein-calculator",
        "/tools/nutrition-calculator"]
FETCH = "/articles/what-to-serve-with-pesto-chicken"


def post(method, payload):
    url = f"https://ssl.bing.com/webmaster/api.svc/json/{method}?apikey={KEY}"
    return subprocess.run(["curl", "-s", "--max-time", "45", "-H", "Content-Type: application/json",
                           "-d", json.dumps(payload), url], capture_output=True, text=True).stdout


def get(method, extra=""):
    url = (f"https://ssl.bing.com/webmaster/api.svc/json/{method}?apikey={KEY}"
           f"&siteUrl={urllib.parse.quote(SITE, safe='')}{extra}")
    return subprocess.run(["curl", "-s", "--max-time", "45", url], capture_output=True, text=True).stdout


for u in URLS:
    out = post("SubmitUrl", {"siteUrl": SITE, "url": SITE + u})
    print(f"SubmitUrl {u}: {out[:80]}")

out = post("FetchUrl", {"siteUrl": SITE, "url": SITE + FETCH})
print(f"FetchUrl {FETCH}: {out[:80]}")

print("\nGetUrlInfo:")
for u in URLS + [FETCH]:
    try:
        d = json.loads(get("GetUrlInfo", f"&url={urllib.parse.quote(SITE + u, safe='')}") or "{}").get("d") or {}
    except Exception as e:
        print(f"  {u}: parse error {e}"); continue
    print(f"  {u:44s} size={d.get('DocumentSize')} anchors={d.get('AnchorCount')} "
          f"last={d.get('LastCrawled')} http={d.get('HttpStatus')}")
