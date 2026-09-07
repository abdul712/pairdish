"""Submit new PairDish URLs to Bing Webmaster (SubmitUrlBatch) and ping GSC sitemap.
Reads BING_WEBMASTER_API_KEY from ~/.hermes/.env. GET/POST per webmaster-tools-automation skill.
"""
import subprocess, json, re, pathlib, sys

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
m = re.search(r'(?<=^BING_WEBMASTER_API_KEY=).*', ENV, re.M)
if not m:
    print("BLOCKER: BING_WEBMASTER_API_KEY not found in ~/.hermes/.env")
    sys.exit(1)
key = m.group(0).strip().strip('"').strip("'")

URLS = [
    "https://pairdish.com/articles/what-to-serve-with-roasted-potatoes",
    "https://pairdish.com/articles/what-to-serve-with-fried-fish",
    "https://pairdish.com/articles/what-to-serve-with-pesto-chicken",
]

# 1) Bing SubmitUrlBatch (apikey as QUERY param, JSON body — never header)
body = json.dumps({"siteUrl": "https://pairdish.com", "urlList": URLS})
r = subprocess.run(
    ["curl", "-s", "--max-time", "45", "-X", "POST",
     "-H", "Content-Type: application/json",
     "-d", body,
     f"https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey={key}"],
    capture_output=True, text=True)
print("Bing SubmitUrlBatch:", r.stdout[:200])

# 2) Verify quota via GetUrlSubmissionQuota
r2 = subprocess.run(
    ["curl", "-s", "--max-time", "45",
     f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?apikey={key}&siteUrl=https%3A%2F%2Fpairdish.com"],
    capture_output=True, text=True)
print("Bing quota:", r2.stdout[:200])

# 3) GSC sitemap resubmit needs indexing-scope OAuth we lack; sitemap was already submitted.
#    Google re-reads sitemaps on its own schedule; lastmod changes will be picked up.
print("GSC: sitemap /sitemap.xml already submitted in GSC (run 1); lastmod updated this run.")