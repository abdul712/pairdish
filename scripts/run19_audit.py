#!/usr/bin/env python3
"""Run-19 audit: live sitemap sweep (status/meta/FAQ/undefined) + Bing reads. Read-only."""
import datetime as dt
import html
import json
import pathlib
import re
import subprocess
import sys
import urllib.parse

ROOT = pathlib.Path(__file__).resolve().parent.parent
LOG = (ROOT / "outreach" / "run19_audit.txt").open("w", encoding="utf-8")
_emit = __builtins__.print if not isinstance(__builtins__, dict) else __builtins__["print"]


def print(*a, **k):  # noqa: A001
    _emit(*a, **k, file=sys.stdout)
    _emit(*a, **k, file=LOG)
    LOG.flush()


UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
ENV = pathlib.Path("/home/hermes/.hermes/.env").read_text()
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*", ENV, re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "outreach"
OUT.mkdir(exist_ok=True)


def curl(url, extra=None):
    cmd = ["curl", "-s", "--compressed", "--max-time", "30", "-A", UA]
    if extra:
        cmd += extra
    cmd.append(url)
    return subprocess.run(cmd, capture_output=True, text=True).stdout


def bing_get(method, extra=""):
    url = (f"https://ssl.bing.com/webmaster/api.svc/json/{method}?apikey={key}"
           f"&siteUrl={urllib.parse.quote(SITE, safe='')}{extra}")
    return subprocess.run(["curl", "-s", "--max-time", "45", url], capture_output=True, text=True).stdout


print("=== 1. sitemap sweep ===")
sm = curl(f"{SITE}/sitemap.xml")
urls = re.findall(r"<loc>([^<]+)</loc>", sm)
print(f"sitemap URLs: {len(urls)}")
bad, longmeta, faq, undef = [], [], [], []
for u in urls:
    body = curl(u)
    if not body:
        bad.append((u, "EMPTY"))
        continue
    m = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', body)
    if m:
        desc = html.unescape(m.group(1))
        if len(desc) > 160:
            longmeta.append((u, len(desc)))
    else:
        longmeta.append((u, "NO-META"))
    if re.search(r'FAQPage|frequently asked questions', body, re.I):
        faq.append(u)
    if 'href="undefined"' in body:
        undef.append(u)
print(f"  meta>160 or missing: {longmeta if longmeta else 'none'}")
print(f"  FAQ markers: {faq if faq else 'none'}")
print(f"  href=undefined: {undef if undef else 'none'}")

print("\n=== 2. Bing traffic ===")
rank = json.loads(bing_get("GetRankAndTrafficStats") or "{}")
rows = rank.get("d") or []
if rows:
    def d2s(x):
        mm = re.search(r"/Date\((\d+)", x or "")
        return dt.datetime.fromtimestamp(int(mm.group(1)) / 1000, dt.UTC).date().isoformat() if mm else x
    first, last = d2s(rows[0]["Date"]), d2s(rows[-1]["Date"])
    ic = sum(r.get("Clicks", 0) or 0 for r in rows)
    ii = sum(r.get("Impressions", 0) or 0 for r in rows)
    print(f"  window {first} .. {last}: clicks={ic} impressions={ii} rows={len(rows)}")
    print("  last 7 rows:", [(d2s(r['Date']), r.get('Clicks'), r.get('Impressions')) for r in rows[-7:]])
else:
    print("  no rank rows")

print("\n=== 3. Bing query stats ===")
qdata = json.loads(bing_get("GetQueryStats") or "{}").get("d", [])
agg = {}
for row in qdata:
    q = (row.get("Query") or "").strip()
    a = agg.setdefault(q, {"c": 0, "i": 0})
    a["c"] += row.get("Clicks", 0) or 0
    a["i"] += row.get("Impressions", 0) or 0
out = sorted(agg.items(), key=lambda x: (-x[1]["i"], x[0]))
with (OUT / "bing_queries_run19.txt").open("w", encoding="utf-8") as f:
    for q, a in out:
        f.write(f"{a['i']:4d} {a['c']:4d} {q}\n")
print(f"  queries={len(out)} clicks={sum(a['c'] for a in agg.values())} impressions={sum(a['i'] for a in agg.values())}")
for q, a in out[:30]:
    print(f"    i={a['i']:3d} c={a['c']:2d}  {q}")

print("\n=== 4. Bing crawl stats (last 6) ===")
cs = json.loads(bing_get("GetCrawlStats") or "{}").get("d", [])
for r in cs[-6:]:
    mm = re.search(r"/Date\((\d+)", r.get("Date", ""))
    d = dt.datetime.fromtimestamp(int(mm.group(1)) / 1000, dt.UTC).date().isoformat() if mm else r.get("Date")
    print(f"  {d}: 2xx={r.get('Code2xx')} 4xx={r.get('Code4xx')} 5xx={r.get('Code5xx')} "
          f"301={r.get('Code301')} crawled={r.get('CrawledPages')} inIndex={r.get('InIndex')}")

print("\n=== 5. Bing feeds ===")
feeds = json.loads(bing_get("GetFeeds") or "{}").get("d", [])
for f in feeds:
    print(f"  {f.get('Url')} | {f.get('Status')} | urls={f.get('UrlCount')} | last={f.get('LastCrawled')}")
