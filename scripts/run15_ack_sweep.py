#!/usr/bin/env python3
"""Run-15 mail sweep (read-only):
 (a) pull the HuLu Directory approval mail body to recover the live listing URL,
 (b) list every directory ack in the shared mailbox from the last 10 days whose HOST is not
     already in this campaign's tracker (sibling-campaign sourcing, which produced 2/2 wins
     in run 12).
Never prints credentials; server-side IMAP filters only.
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
        u = (row.get("url") or "").strip().lower()
        m = re.search(r"https?://([^/]+)", u)
        if m:
            tracked.add(m.group(1).replace("www.", ""))

print(f"tracker hosts: {len(tracked)}")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])

# (a) HuLu approval body
for folder in ('"INBOX"', '"[Gmail]/All Mail"'):
    M.select(folder)
    typ, data = M.uid("search", None, '(SINCE 30-Sep-2026 SUBJECT "HuLu")')
    uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
    for u in uids:
        typ, d = M.uid("fetch", u, "(BODY[TEXT])")
        if not d or not d[0]:
            continue
        txt = d[0][1].decode("utf-8", "replace")
        urls = re.findall(r"https?://[^\s\"'<>)]+", txt)
        urls = [x for x in urls if "hulu" in x.lower()]
        print("HULU body urls:", urls[:6])
        print("HULU body snippet:", re.sub(r"\s+", " ", txt)[:600])

# (b) sibling-ack host sweep
print()
print("=== directory acks since 25-Sep whose host is UNTRACKED ===")
seen = {}
for folder in ('"[Gmail]/All Mail"', '"INBOX"', '"[Gmail]/Spam"'):
    try:
        M.select(folder)
    except Exception as e:
        print("select", folder, e)
        continue
    for crit in ['(SINCE 01-Oct-2026 SUBJECT "Link Request")',
                 '(SINCE 01-Oct-2026 SUBJECT "Link submitted")',
                 '(SINCE 01-Oct-2026 SUBJECT "submitted")',
                 '(SINCE 01-Oct-2026 SUBJECT "Action Required")',
                 '(SINCE 01-Oct-2026 SUBJECT "Confirm")',
                 '(SINCE 01-Oct-2026 SUBJECT "Link added")',
                 '(SINCE 01-Oct-2026 SUBJECT "Link Review")']:
        typ, data = M.uid("search", None, crit)
        uids = sorted(data[0].split(), key=lambda b: int(b)) if data and data[0] else []
        for u in uids:
            typ, d = M.uid("fetch", u, "(BODY[HEADER.FIELDS (FROM TO SUBJECT DATE)])")
            if not d or not d[0]:
                continue
            txt = d[0][1].decode("utf-8", "replace")

            def hdr(name):
                m = re.search(rf"^{name}: (.*)$", txt, re.M | re.I)
                return str(make_header(decode_header(m.group(1)))).strip() if m else ""

            frm = hdr("FROM")
            host = ""
            m = re.search(r"@([A-Za-z0-9.-]+)", frm)
            if m:
                host = m.group(1).lower().strip(".")
            if not host or host in ("gmail.com",):
                continue
            base = host.replace("www.", "")
            if any(base == t or base.endswith("." + t) or t.endswith("." + base) for t in tracked):
                continue
            seen.setdefault(base, []).append((hdr("DATE")[:25], frm[:40], hdr("SUBJECT")[:60]))
M.logout()

for host, rows in sorted(seen.items()):
    print(f"  {host}  ({len(rows)})")
    for r in rows[:2]:
        print("     ", " | ".join(r))
