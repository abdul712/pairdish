#!/usr/bin/env python3
"""Run-21: attribute directory mail by the To: address (shared mailbox, several campaigns).

Prints Date | To | From | Subject for messages from the given hosts, plus every message
addressed to a pairdish alias since the given date. Read-only, never prints credentials.
"""
import imaplib
import pathlib
import re
import sys
from email.header import decode_header, make_header

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

HOSTS = ["activdirectory", "anoox", "secretsearchenginelabs", "toolwise", "founder.best"]
SINCE = "19-Oct-2026"


def dec(v):
    try:
        return str(make_header(decode_header(v or "")))
    except Exception:
        return v or ""


M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
for folder in ("INBOX", '"[Gmail]/Spam"', '"[Gmail]/All Mail"'):
    try:
        typ, _ = M.select(folder, readonly=True)
        if typ != "OK":
            print("skip", folder)
            continue
    except imaplib.IMAP4.error as e:
        print("skip", folder, e)
        continue
    print("=" * 70)
    print("FOLDER", folder)
    typ, data = M.uid("search", None, f'(SINCE {SINCE})')
    uids = sorted((data[0] or b"").split(), key=lambda x: int(x))
    print("  messages since", SINCE, ":", len(uids))
    shown = 0
    for u in uids[-800:]:
        typ, md = M.uid("fetch", u, "(BODY.PEEK[HEADER.FIELDS (FROM TO SUBJECT DATE)])")
        if typ != "OK" or not md or not md[0]:
            continue
        raw = md[0][1].decode("utf-8", "replace")
        frm = dec(re.search(r"^From:\s*(.*)$", raw, re.M).group(1) if re.search(r"^From:", raw, re.M) else "")
        to = dec(re.search(r"^To:\s*(.*)$", raw, re.M).group(1) if re.search(r"^To:", raw, re.M) else "")
        subj = dec(re.search(r"^Subject:\s*(.*)$", raw, re.M).group(1) if re.search(r"^Subject:", raw, re.M) else "")
        date = (re.search(r"^Date:\s*(.*)$", raw, re.M).group(1) if re.search(r"^Date:", raw, re.M) else "").strip()
        hit_host = any(h.lower() in frm.lower() for h in HOSTS)
        hit_pair = "pairdish" in (to or "").lower()
        if hit_host or hit_pair:
            shown += 1
            flag = "PAIRDISH" if hit_pair else "other-campaign"
            print(f"  [{flag}] {date[:31]} | to={to[:46]} | from={frm[:34]} | {subj[:64]}")
    print("  shown:", shown)
M.logout()
