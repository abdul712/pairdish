"""Phase 6 monitoring: GSC (clicks/impressions/queries, indexed estimate) + Bing (query stats).
Uses ~/.hermes/google_token.json (refreshes access token, writes BOTH keys per skill)
and BING_WEBMASTER_API_KEY from ~/.hermes/.env. Read-only APIs.
"""
import subprocess, json, re, pathlib, time, urllib.parse, datetime

ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
m = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M)
if not m:
    print("BLOCKER: BING_WEBMASTER_API_KEY missing")
    raise SystemExit(1)
bing_key = m.group(0).strip().strip('"').strip("'")

# --- GSC: refresh access token from google_token.json ---
tok_path = pathlib.Path("/home/hermes/.hermes/google_token.json")
tok = json.loads(tok_path.read_text())
r = subprocess.run(
    ["curl", "-s", "--max-time", "30", "-X", "POST", "-d",
     f"client_id={tok['client_id']}&client_secret={tok['client_secret']}&refresh_token={tok['refresh_token']}&grant_type=refresh_token",
     tok["token_uri"]], capture_output=True, text=True)
try:
    fresh = json.loads(r.stdout)
    access = fresh["access_token"]
    # dual-writer fix: update BOTH keys
    tok["token"] = access
    tok["access_token"] = access
    tok_path.write_text(json.dumps(tok, indent=2))
    print(f"GSC token refreshed (expires_in={fresh.get('expires_in')}s)")
except Exception as e:
    print(f"BLOCKER: GSC token refresh failed: {r.stdout[:200]}")
    raise SystemExit(1)

SITE = "https://pairdish.com"
enc = urllib.parse.quote("sc-domain:pairdish.com", safe="")
today = datetime.date.today().isoformat()
start = (datetime.date.today() - datetime.timedelta(days=28)).isoformat()

def gsc_post(url, body):
    r = subprocess.run(["curl", "-s", "--max-time", "45", "-X", "POST",
                        "-H", f"Authorization: Bearer {access}",
                        "-H", "Content-Type: application/json", "-d", json.dumps(body), url],
                       capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        return {"error": r.stdout[:300]}

# 1) GSC totals last 28d (date dimension collapsed)
d = gsc_post(f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query",
             {"startDate": start, "endDate": today, "dimensions": ["date"]})
rows = d.get("rows", [])
clicks = sum(r.get("clicks", 0) for r in rows)
impressions = sum(r.get("impressions", 0) for r in rows)
print(f"\nGSC last-28d (through {today}): clicks={clicks:.0f} impressions={impressions:.0f} days_with_data={len(rows)}")

# 2) Top queries last 28d
q = gsc_post(f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query",
             {"startDate": start, "endDate": today, "dimensions": ["query"], "rowLimit": 10})
print("\nGSC top queries (28d):")
for r_ in q.get("rows", [])[:10]:
    k = r_.get("keys", [""])[0]
    print(f"  {k} | clicks={r_.get('clicks',0):.0f} impr={r_.get('impressions',0):.0f} pos={r_.get('position',0):.1f}")

# 3) Top pages (indexed proxies)
p = gsc_post(f"https://www.googleapis.com/webmasters/v3/sites/{enc}/searchAnalytics/query",
             {"startDate": start, "endDate": today, "dimensions": ["page"], "rowLimit": 15})
print("\nGSC pages with impressions (28d):")
for r_ in p.get("rows", [])[:15]:
    pg = r_.get("keys", [""])[0]
    print(f"  {pg.replace('https://pairdish.com','')} | clicks={r_.get('clicks',0):.0f} impr={r_.get('impressions',0):.0f} pos={r_.get('position',0):.1f}")

# 4) Sitemap status
r = subprocess.run(["curl", "-s", "--max-time", "45",
                    "-H", f"Authorization: Bearer {access}",
                    f"https://www.googleapis.com/webmasters/v3/sites/{enc}/sitemaps"],
                   capture_output=True, text=True)
try:
    sm = json.loads(r.stdout)
    for s in sm.get("sitemap", []):
        print(f"\nGSC sitemap: {s.get('path')} lastDownloaded={s.get('lastDownloaded')} errors={s.get('errors')} isPending={s.get('isPending')}")
except Exception:
    print(f"\nGSC sitemap fetch issue: {r.stdout[:200]}")

# 5) Bing: query stats (GET with apikey+siteUrl as QUERY params)
b = subprocess.run(["curl", "-s", "--max-time", "45",
                    f"https://ssl.bing.com/webmaster/api.svc/json/GetQueryStats?apikey={bing_key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                   capture_output=True, text=True)
try:
    bq = json.loads(b.stdout).get("d", [])
    agg = {}
    for row in bq:
        qn = row.get("Query", "")
        a = agg.setdefault(qn, {"c": 0, "i": 0})
        a["c"] += row.get("Clicks", 0) or 0
        a["i"] += row.get("Impressions", 0) or 0
    tot_c = sum(a["c"] for a in agg.values()); tot_i = sum(a["i"] for a in agg.values())
    print(f"\nBing query stats (Bing's own range, ~4mo): queries={len(agg)} clicks={tot_c} impressions={tot_i}")
    for qn, a in sorted(agg.items(), key=lambda x: -x[1]["i"])[:8]:
        print(f"  {qn} | c={a['c']} i={a['i']}")
except Exception:
    print(f"\nBing GetQueryStats issue: {b.stdout[:200]}")

# 6) Bing indexed-URL count
b2 = subprocess.run(["curl", "-s", "--max-time", "45",
                     f"https://ssl.bing.com/webmaster/api.svc/json/GetUrlStatistics?apikey={bing_key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                    capture_output=True, text=True)
print("Bing GetUrlStatistics:", b2.stdout[:300])