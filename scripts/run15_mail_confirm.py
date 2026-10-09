#!/usr/bin/env python3
"""Run-15: find + follow the phpLD-4 email-confirmation links for athenelinks / abicloud.

Search window matches today's submissions. Server-side IMAP filters only; never prints creds.
Confirm URLs are taken from the raw body with soft line breaks collapsed only (=CRLF -> ''),
never a full quopri decode (hex pairs like =77 must survive).

Usage: python3 scripts/run14_mail_confirm.py [host ...]
"""
import imaplib
import os
import pathlib
import re
import subprocess
import sys
import urllib.request
from email.header import decode_header, make_header

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

HOSTS = sys.argv[1:] or ["athenelinks", "abicloud", "brestlinks"]
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])

found = []
for folder in ('"INBOX"', '"[Gmail]/Spam"', '"[Gmail]/All Mail"'):
    try:
        M.select(folder)
    except Exception as e:
        print(f"select {folder}: {e}")
        continue
    typ, data = M.uid("search", None, '(SINCE 05-Oct-2026 TO "pairdish")')
    uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
    for u in uids:
        typ, d = M.uid("fetch", u, "(RFC822)")
        if not d or not d[0]:
            continue
        raw = d[0][1].decode("utf-8", "replace")
        low = raw.lower()
        for h in HOSTS:
            if h in low and h not in [f[0] for f in found]:
                def hdr(name):
                    m = re.search(rf"^{name}: (.*)$", raw, re.M | re.I)
                    return str(make_header(decode_header(m.group(1)))).strip() if m else ""
                found.append((h, folder, hdr("DATE")[:31], hdr("FROM")[:40], hdr("TO")[:46], raw))
M.logout()


def hdr_of(raw, name):
    m = re.search(rf"^{name}: (.*)$", raw, re.M | re.I)
    return str(make_header(decode_header(m.group(1)))).strip() if m else ""


for h, folder, date, frm, to, raw in found:
    print(f"=== {h} | {folder} | {date} | {frm} | {to}")
    body = raw.split("\r\n\r\n", 1)[-1] if "\r\n\r\n" in raw else raw
    body = body.replace("=\r\n", "").replace("=\n", "")
    urls = re.findall(r"https?://[^\s<>\"'\)]+", body)
    conf = [u for u in urls if re.search(r"confirm|verify|activ", u, re.I) and h in u.lower()]
    if not conf:
        conf = [u for u in urls if re.search(r"confirm|verify|activ", u, re.I)][:1]
    if not conf:
        print("   no confirm URL in body; subject:", hdr_of(raw, "SUBJECT")[:70])
        continue
    for u in conf[:2]:
        print("   confirm:", u[:130])
        req = urllib.request.Request(u, headers={"User-Agent": UA})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                page = r.read().decode("utf-8", "replace")
                print(f"   -> {r.status} {r.geturl()[:90]} {len(page)} chars")
                txt = re.sub(r"<[^>]+>", " ", page)
                txt = re.sub(r"\s+", " ", txt).strip()
                print("   body:", txt[:220])
        except Exception as e:
            print("   FAIL:", type(e).__name__, e)

if not found:
    print("no confirmation mail found yet for:", ", ".join(HOSTS))
