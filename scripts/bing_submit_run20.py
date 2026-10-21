#!/usr/bin/env python3
"""Run-20: submit the four edited URLs to Bing (SubmitUrl). apikey in the query, JSON body."""
import json
import pathlib
import re
import subprocess
import urllib.parse

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
KEY = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
URLS = [
    "/tools/potluck-coordinator",
    "/tools/grocery-list",
    "/tools/buffet-planner",
    "/articles/grocery-budget-meal-planning",
]

for u in URLS:
    body = json.dumps({"siteUrl": SITE, "url": SITE + u})
    out = subprocess.run(
        ["curl", "-s", "--max-time", "45", "-X", "POST",
         "-H", "Content-Type: application/json", "-d", body,
         f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey={KEY}"],
        capture_output=True, text=True).stdout
    print(f"{u:44s} {out.strip()[:120]}")
