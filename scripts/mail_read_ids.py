#!/usr/bin/env python3
"""Read full bodies of specific Gmail message ids (pairdish mailbox sweeps).
Usage: python3 mail_read_ids.py 216601 216602 216627 216766
Prints from/subject/date + decoded text body + all full URLs (unwrapped).
"""
import imaplib, os, re, sys, quopri
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

url_re = re.compile(r"https?://[^\s<>\"')]+", re.I)
for i in sys.argv[1:]:
    typ, data = M.fetch(i.encode(), "(RFC822)")
    if typ != "OK" or not data or not isinstance(data[0], tuple):
        print(f"--- id={i}: FETCH FAILED")
        continue
    raw = data[0][1]
    msg_txt = quopri.decodestring(raw).decode("utf-8", "replace")
    m = re.search(r"^From: (.*)$", msg_txt, re.M | re.I)
    s = re.search(r"^Subject: (.*)$", msg_txt, re.M | re.I)
    d = re.search(r"^Date: (.*)$", msg_txt, re.M | re.I)
    frm = str(make_header(decode_header(m.group(1)))) if m else "?"
    sub = str(make_header(decode_header(s.group(1)))) if s else "?"
    dt = d.group(1) if d else "?"
    print(f"\n================ id={i}\nFrom: {frm}\nSubject: {sub}\nDate: {dt}")
    # strip html for readability
    body = msg_txt
    body = re.sub(r"<style.*?</style>", " ", body, flags=re.S | re.I)
    body = re.sub(r"<[^>]+>", " ", body)
    body = re.sub(r"&nbsp;?", " ", body)
    body = re.sub(r"\s+", " ", body)
    print("BODY:", body[:2200])
    urls = set(url_re.findall(msg_txt))
    if urls:
        print("URLS:")
        for u in sorted(urls):
            print("  ", u)
M.logout()
