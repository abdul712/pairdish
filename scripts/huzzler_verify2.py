#!/usr/bin/env python3
"""Fetch Huzzler verify email with proper quoted-printable decoding, click the link."""
import imaplib, os, quopri, re, subprocess
from pathlib import Path

env = {}
for line in open(os.path.expanduser("~/.hermes/.env")):
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")
M = imaplib.IMAP4_SSL("imap.gmail.com", 993)
M.login(env["EMAIL_ADDRESS"], env["GMAIL_APP_PASSWORD"])
M.select("INBOX")
typ, data = M.search(None, '(FROM "huzzler")', "(SINCE 08-Sep-2026)")
ids = data[0].split()
url_re = re.compile(r"https?://huzzler\.so/verify-email/[^\s<>\"'&]+", re.I)
verify_url = None
for i in sorted(ids, key=lambda x: int(x)):
    typ, data = M.fetch(i, "(RFC822)")
    raw = data[0][1]
    dec = quopri.decodestring(raw).decode("utf-8", "replace")
    urls = url_re.findall(dec)
    print(f"id={i.decode()} decoded verify urls: {urls}")
    if urls:
        verify_url = urls[-1]
if verify_url:
    print("CLICKING:", verify_url)
    r = subprocess.run(["curl", "-s", "-L", "--max-time", "45", "-o", "/tmp/hz_verify2.html",
                        "-w", "%{http_code}|%{url_effective}", "-A",
                        "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0", verify_url],
                       capture_output=True, text=True, timeout=60)
    print("verify result:", r.stdout)
    b = Path("/tmp/hz_verify2.html").read_text(encoding="utf-8", errors="replace") if Path("/tmp/hz_verify2.html").exists() else ""
    flat = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", re.sub(r"<script.*?</script>", " ", b, flags=re.S | re.I)))
    print("page text snippet:", flat[:300])
else:
    print("no verify url")