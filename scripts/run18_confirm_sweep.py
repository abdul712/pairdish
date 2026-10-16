#!/usr/bin/env python3
"""Run-18: recover UNCLICKED directory confirmation links for this campaign from the shared mailbox.

Only mails whose body carries a confirm/verify URL for a host this campaign has submitted to are
clicked; every GET is reported with the status it returned. Credentials are never printed.
"""
import csv
import imaplib
import pathlib
import re
import subprocess
from email.header import decode_header, make_header
from urllib.parse import urlparse

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

pending_hosts = {}
with (ROOT / "outreach/tracker.csv").open(encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        if row.get("status") in ("submitted", "pending_review"):
            m = re.search(r"https?://([^/]+)", (row.get("url") or ""))
            if m:
                pending_hosts[m.group(1).replace("www.", "").lower()] = row.get("site_name")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])

hits = []
for folder in ('"[Gmail]/All Mail"', '"[Gmail]/Spam"', '"INBOX"'):
    try:
        M.select(folder)
    except Exception as e:
        print("select", folder, e)
        continue
    for crit in ['(SINCE 01-Oct-2026 SUBJECT "Confirm")',
                 '(SINCE 01-Oct-2026 SUBJECT "confirm")',
                 '(SINCE 01-Oct-2026 SUBJECT "Action Required")',
                 '(SINCE 01-Oct-2026 SUBJECT "Verify")']:
        typ, data = M.uid("search", None, crit)
        uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
        for u in uids:
            typ, d = M.uid("fetch", u, "(BODY[HEADER.FIELDS (FROM TO SUBJECT DATE)] BODY[TEXT])")
            if not d or not d[0]:
                continue
            raw = d[0][1].decode("utf-8", "replace")

            def hdr(name):
                m = re.search(rf"^{name}: (.*)$", raw, re.M | re.I)
                return str(make_header(decode_header(m.group(1)))).strip() if m else ""

            frm = hdr("FROM")
            m = re.search(r"@([A-Za-z0-9.-]+)", frm)
            if not m:
                continue
            host = m.group(1).lower().replace("www.", "")
            if host not in pending_hosts:
                continue
            urls = [u for u in re.findall(r"https?://[^\s\"'<>)\]]+", raw)
                    if re.search(r"confirm|verify|activ|approve", u, re.I)]
            if urls:
                hits.append((host, hdr("DATE")[:25], hdr("SUBJECT")[:60], urls))
M.logout()

print(f"pending hosts: {len(pending_hosts)}")
print(f"confirmation mails matched: {len(hits)}")
for host, date, subj, urls in hits:
    print(f"\n{host} | {date} | {subj}")
    for u in dict.fromkeys(urls):
        body = u.replace("=3D", "=")
        out = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "30", "-A", UA,
                              "-w", "\n@@%{http_code}", body], capture_output=True, text=True,
                             encoding="utf-8", errors="replace").stdout
        page, _, code = out.rpartition("\n@@")
        text = re.sub(r"<[^>]+>", " ", page)
        text = re.sub(r"\s+", " ", text)[:180]
        print(f"   GET {code} {body[:110]}")
        print(f"       {text}")
