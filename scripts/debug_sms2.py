#!/usr/bin/env python3
"""Dump ShowMySites signup POST response to see the actual validation error."""
import re
import subprocess
from pathlib import Path

SMS = "https://www.showmysites.com"
SMSU = "pairdish"
SMSE = "mabdulrahim+pairdish-sms@gmail.com"
P = "PD!sh2026-Dir7k"
UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/sms_pd_dbg2.txt"
Path(CJ).unlink(missing_ok=True)


def curl(args):
    rr = subprocess.run(["curl", "-s", "--max-time", "45", "-A", UA, "-b", CJ, "-c", CJ] + args,
                        capture_output=True, text=True, timeout=60)
    return rr.stdout


h = curl(["-L", SMS + "/accounts/signup/"])
m = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', h)
tok = m.group(1) if m else None
print("token:", bool(tok))
r = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
     "-e", SMS + "/accounts/signup/",
     "-d", f"csrfmiddlewaretoken={tok}&username={SMSU}&email={SMSE}&password1={P}&password2={P}",
     SMS + "/accounts/signup/"], capture_output=True, text=True, timeout=90)
body = r.stdout
Path("/tmp/sms_signup_resp.html").write_text(body)
print("len:", len(body))
txt = re.sub(r"<script.*?</script>", " ", body, flags=re.S | re.I)
txt = re.sub(r"<[^>]+>", "\n", txt)
txt = re.sub(r"\n\s*\n+", "\n", txt)
lines = [l.strip() for l in txt.splitlines() if l.strip()]
# print text lines around keywords
for i, l in enumerate(lines):
    low = l.lower()
    if any(k in low for k in ("error", "invalid", "password", "username", "email", "already", "signed", "welcome", "logout", "sign in", "log in")):
        print(f"  [{i}] {l[:160]}")