#!/usr/bin/env python3
"""List pairdish.com DNS records w/ creation dates (find when Pinterest TXT was added)."""
import subprocess, json, re, pathlib

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
tok = re.search(r"(?<=^CLOUDFLARE_API_TOKEN=).*", ENV, re.M).group(0).strip().strip('"').strip("'")

def cf(url):
    r = subprocess.run(["curl", "-s", "--max-time", "30", "-H", f"Authorization: Bearer {tok}", url],
                       capture_output=True, text=True)
    return json.loads(r.stdout)

z = cf("https://api.cloudflare.com/client/v4/zones?name=pairdish.com")
if not z.get("result"):
    print("zone lookup failed:", json.dumps(z)[:300]); raise SystemExit(1)
zid = z["result"][0]["id"]
print("zone:", zid, z["result"][0]["status"])

recs = cf(f"https://api.cloudflare.com/client/v4/zones/{zid}/dns_records?per_page=100")
print(f"total records: {len(recs['result'])}")
for r in sorted(recs["result"], key=lambda x: x.get("created_on", "")):
    if r["type"] in ("MX", "TXT", "CNAME", "A", "AAAA"):
        print(f"{r.get('created_on','?')[:10]} | {r['type']:5} | {r['name'][:40]:40} | {str(r['content'])[:90]}")
