#!/usr/bin/env python3
"""Run-18 mail sweep (read-only): directory acks in the shared mailbox whose HOST is not already
in this campaign's tracker (the sibling-ack sourcing vein that produced the run-15/16/17 hosts).
Also lists the Submitter acknowledgements from the addfreewebdirectory / brestlinks cohort so the
confirm-click step can be run if one is still unclicked. Never prints credentials.
"""
import csv
import imaplib
import pathlib
import re
from email.header import decode_header, make_header

ROOT = pathlib.Path(__file__).resolve().parent.parent
env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

tracked = set()
with (ROOT / "outreach/tracker.csv").open(encoding="utf-8", newline="") as f:
    for row in csv.DictReader(f):
        m = re.search(r"https?://([^/]+)", (row.get("url") or "").strip().lower())
        if m:
            tracked.add(m.group(1).replace("www.", ""))
print(f"tracker hosts: {len(tracked)}")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])

SINCE = "05-Oct-2026"
CRITS = [
    f'(SINCE {SINCE} SUBJECT "Link Request")',
    f'(SINCE {SINCE} SUBJECT "Link submitted")',
    f'(SINCE {SINCE} SUBJECT "submitted")',
    f'(SINCE {SINCE} SUBJECT "Action Required")',
    f'(SINCE {SINCE} SUBJECT "Confirm")',
    f'(SINCE {SINCE} SUBJECT "Link added")',
    f'(SINCE {SINCE} SUBJECT "Link Review")',
    f'(SINCE {SINCE} SUBJECT "approved")',
    f'(SINCE {SINCE} SUBJECT "Approved")',
    f'(SINCE {SINCE} SUBJECT "listing")',
]
NONFIT = {"google.com", "mail.perplexity.ai", "provenexpert.com", "starterbest.com",
          "gmail.com", "mail.google.com", "accounts.google.com"}
IGNORE_SUBSTR = ("google account", "security alert", "perplexity", "provenexpert")

seen = {}
for folder in ('"[Gmail]/All Mail"', '"INBOX"', '"[Gmail]/Spam"'):
    try:
        M.select(folder)
    except Exception as e:
        print("select", folder, e)
        continue
    for crit in CRITS:
        typ, data = M.uid("search", None, crit)
        # imap.search returns SEQUENCE numbers; only uid('search') results are UIDs (skill rule)
        uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
        for u in uids:
            typ, d = M.uid("fetch", u, "(BODY[HEADER.FIELDS (FROM TO SUBJECT DATE)])")
            if not d or not d[0]:
                continue
            txt = d[0][1].decode("utf-8", "replace")

            def hdr(name):
                m = re.search(rf"^{name}: (.*)$", txt, re.M | re.I)
                return str(make_header(decode_header(m.group(1)))).strip() if m else ""

            frm, subj = hdr("FROM"), hdr("SUBJECT")
            if any(s in subj.lower() for s in IGNORE_SUBSTR):
                continue
            m = re.search(r"@([A-Za-z0-9.-]+)", frm)
            if not m:
                continue
            host = m.group(1).lower().strip(".")
            base = host.replace("www.", "")
            if base in NONFIT:
                continue
            if any(base == t or base.endswith("." + t) or t.endswith("." + base) for t in tracked):
                continue
            seen.setdefault(base, []).append((hdr("DATE")[:25], frm[:38], subj[:62]))
M.logout()

print("\n=== UNTRACKED hosts with directory-ish mail since 05-Oct ===")
if not seen:
    print("  (none)")
for host, rows in sorted(seen.items()):
    print(f"  {host}  ({len(rows)})")
    for r in rows[:2]:
        print("     ", " | ".join(r))
