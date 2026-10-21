#!/usr/bin/env python3
"""Run-20: print every URL in the exampledir approval mail, soft-line-break safe.

Quoted-printable wraps long URLs as "=\\r\\n"; join those first, then unescape =3D etc.
Prints the URLs plus a small text window so the listing path is identifiable.
"""
import imaplib
import pathlib
import quopri
import re

env = {}
for line in (pathlib.Path.home() / ".hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select('"[Gmail]/Spam"', readonly=True)
typ, data = M.uid("search", None, '(SINCE 20-Oct-2026 FROM "exampledir")')
uids = (data[0] or b"").split()
print("mails:", len(uids))
for u in uids:
    typ, md = M.uid("fetch", u, "(RFC822)")
    raw = md[0][1]
    if isinstance(raw, str):
        raw = raw.encode("utf-8", "replace")
    txt = raw.decode("utf-8", "replace")
    txt = re.sub(r"=\r?\n", "", txt)      # QP soft breaks
    txt = quopri.decodestring(txt.encode("utf-8", "replace")).decode("utf-8", "replace")
    urls = sorted(set(re.findall(r"https?://[^\s\"'<>)]+", txt)))
    print("=" * 70)
    for u2 in urls:
        if "exampledir" in u2 or "pairdish" in u2:
            print("   ", u2[:200])
    # context windows around the word listing
    body = re.sub(r"<[^>]+>", " ", txt)
    body = re.sub(r"\s+", " ", body)
    print("  BODY:", body[:1800])
    rel = sorted(set(re.findall(r"""["'](/?listing/[^"']+)""", txt)))
    print("  RELATIVE listing hrefs:", rel[:6])
M.logout()
