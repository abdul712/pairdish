#!/usr/bin/env python3
"""List mail addressed to the pairdish alias since a date, with To/From/Subject, so
directory acks can be attributed to this campaign (the shared Gmail carries every
campaign's acks)."""
import imaplib, os, re, sys, quopri
from email.header import decode_header, make_header

since = sys.argv[1] if len(sys.argv) > 1 else "12-Sep-2026"

env = {}
for line in open(os.path.expanduser("~/.hermes/.env")):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select('"[Gmail]/All Mail"')
typ, data = M.search(None, f'(TO "pairdish") (SINCE {since})')
ids = data[0].split()
print(f"messages to pairdish since {since}: {len(ids)}")
for i in ids:
    typ, d = M.fetch(i, "(BODY[HEADER.FIELDS (TO FROM SUBJECT DATE)])")
    raw = d[0][1]
    txt = quopri.decodestring(raw).decode("utf-8", "replace")
    frm = re.search(r"^From: (.*)$", txt, re.M | re.I)
    to = re.search(r"^To: (.*)$", txt, re.M | re.I)
    sub = re.search(r"^Subject: (.*)$", txt, re.M | re.I)
    dat = re.search(r"^Date: (.*)$", txt, re.M | re.I)
    f = lambda m: str(make_header(decode_header(m.group(1)))).strip() if m else "?"
    print(f"- {f(dat)[:31]:31s} | TO {f(to)[:44]:44s} | FROM {f(frm)[:38]:38s} | {f(sub)[:70]}")
M.logout()
