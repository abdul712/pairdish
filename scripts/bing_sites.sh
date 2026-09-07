#!/bin/bash
# List all Bing Webmaster sites for this API key; grep for pairdish
python3 - <<'PYEOF'
import subprocess, json, re, pathlib
ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r'(?<=^BING_WEBMASTER_API_KEY=).*', ENV, re.M).group(0).strip()
r = subprocess.run(["curl","-s","--max-time","45",
    f"https://ssl.bing.com/webmaster/api.svc/json/GetUserSites?apikey={key}"],
    capture_output=True, text=True)
d = json.loads(r.stdout)
for s in d.get("d", []):
    print(s.get("Url"), "| verified:", s.get("IsVerified"), "| last crawl:", s.get("LastCrawlTime"))
PYEOF