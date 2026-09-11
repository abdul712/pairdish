#!/usr/bin/env python3
"""Sweep Gmail INBOX for PairDish-related mail (entireweb, viesearch, huzzler, showmysites,
directory confirmations) since a given date. Prints subjects + candidate confirm links."""
import imaplib, os, re, sys, quopri
from email.header import decode_header, make_header

since = sys.argv[1] if len(sys.argv) > 1 else "07-Sep-2026"

env = {}
for line in open(os.path.expanduser("~/.hermes/.env")):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select("INBOX")

queries = [
    'TO "pairdish"',
    'SUBJECT "entireweb"',
    'SUBJECT "viesearch"',
    'SUBJECT "huzzler"',
    'SUBJECT "showmysites"',
    'SUBJECT "directory"',
]
hits = {}
for q in queries:
    try:
        typ, data = M.search(None, q, f"(SINCE {since})")
        hits[q] = data[0].split()
    except Exception as e:
        hits[q] = []
        print(f"ERR {q}: {e}")

ids = set()
for v in hits.values():
    ids |= set(v)
print(f"total matched ids: {len(ids)}")
url_re = re.compile(r"https?://[^\s<>\"')]+", re.I)
for i in sorted(ids, key=lambda x: int(x)):
    typ, data = M.fetch(i, "(RFC822)")
    raw = data[0][1]
    msg_txt = quopri.decodestring(raw).decode("utf-8", "replace")
    m = re.search(r"^From: (.*)$", msg_txt, re.M | re.I)
    s = re.search(r"^Subject: (.*)$", msg_txt, re.M | re.I)
    d = re.search(r"^Date: (.*)$", msg_txt, re.M | re.I)
    frm = str(make_header(decode_header(m.group(1)))) if m else "?"
    sub = str(make_header(decode_header(s.group(1)))) if s else "?"
    dat = d.group(1) if d else "?"
    print(f"\n--- id={i.decode()} date={dat[:31]}")
    print(f"    from={frm[:70]}")
    print(f"    subj={sub[:90]}")
    links = [u for u in url_re.findall(msg_txt)]
    keep = [u for u in links if any(k in u.lower() for k in
            ("confirm", "verify", "activate", "entireweb", "viesearch", "huzzler", "showmysites", "token", "validate"))]
    for u in keep[:6]:
        print("      link:", u[:150])
M.logout()
