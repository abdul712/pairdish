#!/usr/bin/env python3
"""Debug ShowMySites auth for pairdish: try login directly, dump form errors."""
import re
import subprocess
from pathlib import Path

SMS = "https://www.showmysites.com"
SMSU = "pairdish"
SMSE = "mabdulrahim+pairdish-sms@gmail.com"
P = "PD!sh2026-Dir7k"
UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/sms_pd_dbg.txt"
Path(CJ).unlink(missing_ok=True)


def curl(args, extra=None):
    rr = subprocess.run(["curl", "-s", "--max-time", "45", "-A", UA, "-b", CJ, "-c", CJ] + (extra or []) + args,
                        capture_output=True, text=True, timeout=60)
    return rr.stdout


def csrf_of(html):
    m = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', html)
    return m.group(1) if m else None


h = curl(["-L", SMS + "/accounts/login/"])
tok = csrf_of(h)
print("login page ok:", bool(tok))
r = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
     "-e", SMS + "/accounts/login/",
     "-d", f"csrfmiddlewaretoken={tok}&login={SMSE}&password={P}",
     SMS + "/accounts/login/"], capture_output=True, text=True, timeout=90)
body = r.stdout
print("post-login len:", len(body))
print("logged_in (logout present):", "logout" in body.lower())
txt = re.sub(r"<[^>]+>", " ", body)
txt = re.sub(r"\s+", " ", txt)
# find errorlist content
errs = re.findall(r"errorlist[^<]*<ul>(.*?)</ul>", body, re.S | re.I)
flat = " | ".join(re.sub(r"<[^>]+>", "", e).strip() for e in errs)
print("errors:", flat[:400])
# also check for alert/danger text
danger = re.findall(r'class="[^"]*(?:danger|alert|error)[^"]*"[^>]*>(.*?)</', body, re.S | re.I)
print("danger:", (" | ".join(re.sub(r"<[^>]+>", "", d).strip() for d in danger))[:300])
# whoami probe
h2 = curl(["-L", SMS + "/accounts/profile/"]) if "logout" in body.lower() else ""
print("profile probe len:", len(h2))