#!/usr/bin/env python3
"""Fetch Huzzler verification email and click the verification link."""
import imaplib, os, re, subprocess, time
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
typ, data = M.search(None, '(FROM "huzzler")', "(SINCE 08-Sep-2026)")
ids = data[0].split()
print("huzzler emails:", len(ids))
if not ids:
    raise SystemExit(0)
url_re = re.compile(r"https?://[^\s<>\"']+", re.I)
verify_url = None
for i in sorted(ids, key=lambda x: int(x)):
    typ, data = M.fetch(i, "(RFC822)")
    body = data[0][1].decode("utf-8", "replace")
    links = url_re.findall(body)
    v = [u for u in links if "verify" in u or "email/verify" in u or "confirm" in u]
    sub = re.search(r"^Subject: (.*)$", body, re.M | re.I)
    print(f"id={i.decode()} subj={sub.group(1)[:60] if sub else '?'} links={len(links)} verify_links={len(v)}")
    for u in v:
        print("   ", u[:130])
        if verify_url is None:
            verify_url = u
if verify_url:
    verify_url = verify_url.rstrip("=. ").replace("=\r\n", "").replace("= ", "")
    print("CLICKING:", verify_url[:130])
    r = subprocess.run(["curl", "-s", "-L", "--max-time", "45", "-o", "/tmp/hz_verify.html",
                        "-w", "%{http_code}|%{url_effective}", "-A",
                        "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0", verify_url],
                       capture_output=True, text=True, timeout=60)
    print("verify result:", r.stdout)
    b = open("/tmp/hz_verify.html", encoding="utf-8", errors="replace").read() if __import__("pathlib").Path("/tmp/hz_verify.html").exists() else ""
    print("page mentions verified:", "verified" in b.lower(), "| mentions login:", "login" in b.lower(), "| len:", len(b))
else:
    print("NO verify link found yet")