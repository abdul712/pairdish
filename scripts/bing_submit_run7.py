#!/usr/bin/env python3
"""Run-7: submit the expanded article URL to Bing (SubmitUrlBatch) for recrawl + show quota."""
import subprocess, json, re, pathlib, sys

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
m = re.search(r'(?<=^BING_WEBMASTER_API_KEY=).*', ENV, re.M)
if not m:
    print("BLOCKER: BING_WEBMASTER_API_KEY missing")
    sys.exit(1)
key = m.group(0).strip().strip('"').strip("'")

URLS = ["https://pairdish.com/articles/grocery-budget-meal-planning"]
print(f"submitting {len(URLS)} URL(s)")
body = json.dumps({"siteUrl": "https://pairdish.com", "urlList": URLS})
r = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-X", "POST", "-H", "Content-Type: application/json",
     "-d", body, f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={key}"],
    capture_output=True, text=True)
print("SubmitUrlBatch:", r.stdout[:200])

r2 = subprocess.run(
    ["curl", "-s", "--max-time", "45",
     f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?apikey={key}&siteUrl=https%3A%2F%2Fpairdish.com"],
    capture_output=True, text=True)
print("Quota after:", r2.stdout[:200])
