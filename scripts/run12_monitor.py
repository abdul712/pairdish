#!/usr/bin/env python3
"""Run-12 monitoring sweep: (a) check the shared mailbox for directory CONFIRMATION mails addressed
to a pairdish alias (run-11 submissions usalistingdirectory / britainbusinessdirectory, plus any
ack that needs a click), and (b) pull Bing crawl stats + a couple of GetUrlInfo reads.

Read-only. Never prints credentials. Server-side IMAP filters only.
"""
import csv
import datetime as dt
import imaplib
import json
import pathlib
import re
import subprocess
import urllib.parse
from email.header import decode_header, make_header

ROOT = pathlib.Path(__file__).resolve().parent.parent
env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

print("=== mailbox: pairdish-addressed directory mail (since 23-Sep) ===")
M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
hits = []
for folder in ('"[Gmail]/All Mail"', '"INBOX"', '"[Gmail]/Spam"'):
    try:
        M.select(folder)
    except Exception as e:
        print(f"  select {folder}: {e}")
        continue
    for crit in ['(SINCE 23-Sep-2026 SUBJECT "Action Required")',
                 '(SINCE 23-Sep-2026 SUBJECT "confirm")',
                 '(SINCE 23-Sep-2026 SUBJECT "verify")',
                 '(SINCE 23-Sep-2026 TO "pairdish")']:
        typ, data = M.uid("search", None, crit)
        uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
        for u in uids:
            typ, d = M.uid("fetch", u, "(BODY[HEADER.FIELDS (FROM TO SUBJECT DATE)])")
            if not d or not d[0]:
                continue
            txt = d[0][1].decode("utf-8", "replace")

            def hdr(name):
                m = re.search(rf"^{name}: (.*)$", txt, re.M | re.I)
                return str(make_header(decode_header(m.group(1)))).strip() if m else ""

            hits.append((folder, hdr("DATE")[:31], hdr("FROM")[:45], hdr("TO")[:45], hdr("SUBJECT")[:70]))
M.logout()
seen = set()
for row in hits:
    if row in seen:
        continue
    seen.add(row)
    print("  ", " | ".join(row))
print(f"  ({len(seen)} unique)")

print()
print("=== Bing crawl stats ===")
key = re.search(r"(?<=^BING_WEBMASTER_API_KEY=).*",
                (pathlib.Path.home() / ".hermes/.env").read_text(), re.M).group(0).strip().strip('"').strip("'")
SITE = "https://pairdish.com"
cs = subprocess.run(["curl", "-s", "--max-time", "45",
                     f"https://ssl.bing.com/webmaster/api.svc/json/GetCrawlStats?apikey={key}&siteUrl={urllib.parse.quote(SITE, safe='')}"],
                    capture_output=True, text=True)
try:
    rows = json.loads(cs.stdout).get("d", [])[-5:]
    for r in rows:
        print("  ", r)
except Exception:
    print("  GetCrawlStats:", cs.stdout[:200])

for u in ("https://pairdish.com/tools/flavor-pairing",
          "https://pairdish.com/tools/party-calculator",
          "https://pairdish.com/tools/herb-spice-matrix",
          "https://pairdish.com/tools/seasonal-guide"):
    r = subprocess.run(["curl", "-s", "--max-time", "45",
                        "https://ssl.bing.com/webmaster/api.svc/json/GetUrlInfo?apikey=" + key +
                        "&siteUrl=" + urllib.parse.quote(SITE, safe='') + "&url=" + urllib.parse.quote(u, safe='')],
                       capture_output=True, text=True)
    try:
        d = json.loads(r.stdout).get("d", {})
        print(f"  {u.split('/')[-1]}: HttpStatus={d.get('HttpStatus')} LastCrawled={d.get('LastCrawled')} DocumentSize={d.get('DocumentSize')}")
    except Exception:
        print(f"  {u}: {r.stdout[:120]}")
