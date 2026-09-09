#!/usr/bin/env python3
"""Huzzler register via curl (Laravel): GET /login for CSRF cookie+token, POST /register
multipart FormData (name, username, email, password, password_confirmation, avatar dataURI,
previous_url, _token). JSON response per authAlpineData. Then check for verification email."""
import json
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies.txt"
Path(CJ).unlink(missing_ok=True)
HZ = "https://huzzler.so"
NAME = "PairDish"
USER = "pairdish"
EMAIL = "mabdulrahim+pairdish-hz@gmail.com"
P = "PD!sh2026-Hz3k"


def curl(args, extra=None):
    rr = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ] + (extra or []) + args,
                        capture_output=True, text=True, timeout=90)
    return rr.stdout


h = curl(["-L", HZ + "/login"])
tok = re.search(r'name="_token" value="([^"]+)"', h)
print("csrf token found:", bool(tok))
if not tok:
    raise SystemExit(1)
t = tok.group(1)
# avatar: small transparent png data URI (form just needs a value; site regenerates avatars anyway)
AVATAR = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")
out = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/login",
     "-H", "X-Requested-With: XMLHttpRequest",
     "-H", "Accept: application/json",
     "-o", "/tmp/hz_reg_resp.json",
     "-w", "%{http_code}",
     "-F", f"_token={t}",
     "-F", f"avatar={AVATAR}",
     "-F", f"name={NAME}",
     "-F", f"username={USER}",
     "-F", f"email={EMAIL}",
     "-F", f"password={P}",
     "-F", f"password_confirmation={P}",
     "-F", f"previous_url={HZ}/login",
     "-F", "referral_code=",
     HZ + "/register"], capture_output=True, text=True, timeout=90)
print("register http:", out.stdout)
resp = Path("/tmp/hz_reg_resp.json").read_text(encoding="utf-8", errors="replace")
print("resp:", resp[:500])