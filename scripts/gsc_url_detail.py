#!/usr/bin/env python3
"""GSC page-level detail for pairdish.com: query all pages with impressions (28d),
and any data for the 3 new guides. Refreshes token with BOTH keys."""
import subprocess, json, pathlib, urllib.parse, datetime

tok_path = pathlib.Path("/home/hermes/.hermes/google_token.json")
tok = json.loads(tok_path.read_text())
r = subprocess.run(
    ["curl", "-s", "--max-time", "30", "-X", "POST", "-d",
     f"client_id={tok['client_id']}&client_secret={tok['client_secret']}&refresh_token={tok['refresh_token']}&grant_type=refresh_token",
     tok["token_uri"]], capture_output=True, text=True)
fresh = json.loads(r.stdout)
access = fresh["access_token"]
tok["token"] = access
tok["access_token"] = access
tok_path.write_text(json.dumps(tok, indent=2))

enc = urllib.parse.quote("sc-domain:pairdish.com", safe="")
today = datetime.date.today().isoformat()
start = (datetime.date.today() - datetime.timedelta(days=28)).isoformat()

def gsc(body):
    r = subprocess.run(["curl", "-s", "--max-time", "45", "-X", "POST",
                        "-H", f"Authorization: Bearer {access}",
                        "-H", "Content-Type: application/json", "-d", json.dumps(body),
                        f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query"],
                       capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": r.stdout[:300]}

print("== ALL pages with impressions (28d) ==")
d = gsc({"startDate": start, "endDate": today, "dimensions": ["page"], "rowLimit": 100})
for row in d.get("rows", []):
    print(f"  clicks={row['clicks']:.0f} impr={row['impressions']:.0f} ctr={row['ctr']:.3f} pos={row['position']:.1f} {row['keys'][0]}")

print("\n== queries with impressions (28d) ==")
d = gsc({"startDate": start, "endDate": today, "dimensions": ["query"], "rowLimit": 50})
for row in d.get("rows", []):
    print(f"  clicks={row['clicks']:.0f} impr={row['impressions']:.0f} pos={row['position']:.1f} {row['keys'][0]}")

# sitemaps detail
r = subprocess.run(["curl", "-s", "--max-time", "30",
                    "-H", f"Authorization: Bearer {access}",
                    f"https://www.googleapis.com/webmasters/v3/sites/{enc}/sitemaps"],
                   capture_output=True, text=True)
try:
    sm = json.loads(r.stdout)
    print("\n== sitemaps ==")
    for s in sm.get("sitemap", []):
        print(f"  {s['path']} lastDownloaded={s.get('lastDownloaded')} errors={s.get('errors')} warnings={s.get('warnings')} submitted={s.get('contents',[{}])[0].get('submitted')}")
except Exception as e:
    print("sitemaps err", r.stdout[:200])
