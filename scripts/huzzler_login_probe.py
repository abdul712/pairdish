#!/usr/bin/env python3
"""Huzzler login (XHR) then probe /products/create form fields."""
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"
Path(CJ).unlink(missing_ok=True)
HZ = "https://huzzler.so"
EMAIL = "mabdulrahim+pairdish-hz@gmail.com"
P = "PD!sh2026-Hz3k"


def curl(args):
    rr = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ] + args,
                        capture_output=True, text=True, timeout=90)
    return rr.stdout


h = curl(["-L", HZ + "/login"])
tok = re.search(r'name="_token" value="([^"]+)"', h).group(1)
r = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/login", "-H", "X-Requested-With: XMLHttpRequest", "-H", "Accept: application/json",
     "-o", "/tmp/hz_login_resp.json", "-w", "%{http_code}",
     "--data-urlencode", f"_token={tok}",
     "--data-urlencode", f"email={EMAIL}",
     "--data-urlencode", f"password={P}",
     HZ + "/login"], capture_output=True, text=True, timeout=90)
print("login http:", r.stdout)
print("login resp:", Path("/tmp/hz_login_resp.json").read_text()[:200])

# authenticated probe
h2 = curl(["-L", HZ + "/products/create"])
Path("/tmp/hz_create.html").write_text(h2)
print("create page len:", len(h2), "| has form:", "form" in h2.lower(), "| logged-in nav:", ("logout" in h2.lower() or "dashboard" in h2.lower()))
# form fields
names = sorted(set(re.findall(r'name="([a-z_0-9]+)"', h2)))
print("field names:", names[:25])
acts = re.findall(r'action="([^"]+)"', h2)
print("actions:", acts[:5])
# look for submit endpoint hints in inline js
hints = re.findall(r'fetch\(\s*["\']([^"\']+)["\']', h2)
print("fetch targets:", hints[:10])