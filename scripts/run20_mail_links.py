#!/usr/bin/env python3
"""Run-20: pull the confirm/listing links out of pairdish-addressed directory mail.

Read-only: prints the candidate URLs. No clicking here (a click is a state change and is done
deliberately after the URL is inspected).
"""
import imaplib
import pathlib
import re
from email.header import decode_header, make_header

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

WANT = ("exampledir", "athenelinks", "brestlinks", "webdirectory.top")
M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])

for folder in ('"[Gmail]/All Mail"', '"[Gmail]/Spam"'):
    M.select(folder, readonly=True)
    typ, data = M.uid("search", None, '(SINCE 05-Oct-2026)')
    uids = sorted((data[0] or b"").split(), key=lambda x: int(x))
    for u in uids:
        typ, md = M.uid("fetch", u, "(RFC822)")
        if typ != "OK" or not md or not md[0]:
            continue
        raw = md[0][1]
        if isinstance(raw, str):
            raw = raw.encode("utf-8", "replace")
        text = raw.decode("utf-8", "replace")
        head, _, body = text.partition("\n\n")
        hdr = head.lower()
        if not any(w in hdr for w in WANT):
            continue
        if "pairdish" not in hdr:
            continue
        subj = ""
        m = re.search(r"^subject:\s*(.*)$", head, re.M)
        if m:
            try:
                subj = str(make_header(decode_header(m.group(1))))
            except Exception:
                subj = m.group(1)
        urls = set(re.findall(r"https?://[^\s\"'<>)]+", body))
        urls |= set(re.findall(r"https?://[^\s\"'<>)]+", head))
        keep = [u2 for u2 in urls if any(w.split(".")[0] in u2.lower() for w in WANT)]
        print("=" * 70)
        print(folder, "|", subj[:80])
        for u2 in sorted(keep)[:12]:
            print("   ", u2[:150])
M.logout()
