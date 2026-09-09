#!/usr/bin/env python3
"""Check Gmail for ShowMySites welcome/confirmation mail for the pairdish account."""
import imaplib, os, re
from email.header import decode_header, make_header

env = {}
for line in open(os.path.expanduser("~/.hermes/.env")):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select("INBOX")
hits = {}
for q in ['FROM "showmysites"', 'TO "pairdish-sms"', 'SUBJECT "showmysites"',
          'SUBJECT "confirmation"', 'SUBJECT "welcome"']:
    try:
        typ, data = M.search(None, q, "(SINCE 08-Sep-2026)")
        hits[q] = data[0].split()
    except Exception as e:
        hits[q] = [f"ERR {e}"]
for q, ids in hits.items():
    print(q, "->", len(ids))
ids = set()
for v in hits.values():
    if isinstance(v, list) and (not v or not str(v[0]).startswith("ERR")):
        ids |= set(v)
url_re = re.compile(r"https?://[^\s<>\"']+", re.I)
for i in sorted(ids, key=lambda x: int(x))[-10:]:
    typ, data = M.fetch(i, "(RFC822)")
    msg = data[0][1]
    m = re.search(r"^From: (.*)$", msg.decode("utf-8", "replace"), re.M | re.I)
    s = re.search(r"^Subject: (.*)$", msg.decode("utf-8", "replace"), re.M | re.I)
    body = msg.decode("utf-8", "replace")
    links = [u for u in url_re.findall(body)[:4]]
    frm = str(make_header(decode_header(m.group(1))) if m else "?")
    sub = str(make_header(decode_header(s.group(1))) if s else "?")
    print(f"--- id={i.decode()} from={frm[:60]} subj={sub[:70]}")
    for u in links:
        print("   ", u[:140])