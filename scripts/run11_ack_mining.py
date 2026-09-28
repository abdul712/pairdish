#!/usr/bin/env python3
"""Run-11 directory sourcing: mine the SHARED mailbox for recent directory acknowledgements
and list the hosts that demonstrably worked for sibling campaigns in the last ~10 days,
minus every host this campaign already has in tracker.csv.

Server-side IMAP filtering only (client-side filtering of a 900-message window times out).
Prints From-domain + subject; never prints credentials.
"""
import csv
import imaplib
import os
import pathlib
import re
from email.header import decode_header, make_header

ROOT = pathlib.Path(__file__).resolve().parent.parent
SINCE = "18-Sep-2026"

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

tracked = set()
tracker = ROOT / "outreach/tracker.csv"
if tracker.exists():
    for row in csv.DictReader(tracker.open()):
        u = (row.get("url") or "").strip().lower()
        m = re.search(r"https?://([^/]+)", u)
        if m:
            tracked.add(m.group(1).replace("www.", ""))
print(f"tracker domains: {len(tracked)}")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select('"[Gmail]/All Mail"')

SUBJECTS = ["Link Request", "Link Review", "Link added", "submitted your site", "link submission",
            "Link submitted", "Action Required", "directory"]
seen = {}
for sub in SUBJECTS:
    typ, data = M.uid("search", None, f'(SINCE {SINCE} SUBJECT "{sub}")')
    uids = sorted(data[0].split(), key=lambda b: int(b))
    for u in uids:
        typ, d = M.uid("fetch", u, "(BODY[HEADER.FIELDS (FROM SUBJECT DATE)])")
        if not d or not d[0]:
            continue
        txt = d[0][1].decode("utf-8", "replace")
        frm = re.search(r"^From: (.*)$", txt, re.M | re.I)
        su = re.search(r"^Subject: (.*)$", txt, re.M | re.I)
        dat = re.search(r"^Date: (.*)$", txt, re.M | re.I)
        dec = lambda m: str(make_header(decode_header(m.group(1)))).strip() if m else ""
        frm_s = dec(frm)
        host = ""
        m = re.search(r"@([A-Za-z0-9.-]+\.[A-Za-z]{2,})", frm_s)
        if m:
            host = m.group(1).lower().replace("www.", "")
        key = (host, dec(su)[:70])
        seen.setdefault(key, dec(dat)[:31])
M.logout()

print(f"ack-like messages: {len(seen)}")
for (host, sub), dat in sorted(seen.items()):
    flag = "TRACKED " if host in tracked else "UNTRIED "
    print(f"{flag} {dat:31s} {host:38s} {sub}")
