#!/usr/bin/env python3
"""ShowMySites signup with --data-urlencode (plus-alias email must be %2B-encoded)."""
import re
import subprocess
from pathlib import Path

SMS = "https://www.showmysites.com"
SMSU = "pairdish"
SMSE = "mabdulrahim+pairdish-sms@gmail.com"
P = "PD!sh2026-Dir7k"
UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/sms_pd3.txt"
Path(CJ).unlink(missing_ok=True)


def curl(args):
    rr = subprocess.run(["curl", "-s", "--max-time", "45", "-A", UA, "-b", CJ, "-c", CJ] + args,
                        capture_output=True, text=True, timeout=60)
    return rr.stdout


h = curl(["-L", SMS + "/accounts/signup/"])
tok = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', h).group(1)
r = subprocess.run(
    ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
     "-e", SMS + "/accounts/signup/",
     "--data-urlencode", f"csrfmiddlewaretoken={tok}",
     "--data-urlencode", f"username={SMSU}",
     "--data-urlencode", f"email={SMSE}",
     "--data-urlencode", f"password1={P}",
     "--data-urlencode", f"password2={P}",
     SMS + "/accounts/signup/"], capture_output=True, text=True, timeout=90)
body = r.stdout
txt = re.sub(r"<script.*?</script>", " ", body, flags=re.S | re.I)
txt = re.sub(r"<[^>]+>", "\n", txt)
lines = [l.strip() for l in txt.splitlines() if l.strip()]
errors = [l for l in lines if any(k in l.lower() for k in ("error", "invalid", "already", "correct the errors"))]
print("signup2:", {"len": len(body), "errors": errors[:3], "has_logout": "logout" in body.lower(),
                  "has_signin": "sign in" in body.lower()})

# login if needed
if "logout" not in body.lower():
    h2 = curl(["-L", SMS + "/accounts/login/"])
    tok2 = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', h2)
    if tok2:
        r2 = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
             "-e", SMS + "/accounts/login/",
             "--data-urlencode", f"csrfmiddlewaretoken={tok2.group(1)}",
             "--data-urlencode", f"login={SMSE}",
             "--data-urlencode", f"password={P}",
             SMS + "/accounts/login/"], capture_output=True, text=True, timeout=90)
        b2 = r2.stdout
        txt2 = re.sub(r"<script.*?</script>", " ", b2, flags=re.S | re.I)
        flat = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", txt2))
        errs2 = re.findall(r"(?:Error|error|invalid|Enter a valid)[^|]{0,120}", flat)
        print("login2:", {"len": len(b2), "logged_in": "logout" in b2.lower(), "errs": errs2[:2]})
        body = b2

# create listing if logged in
if "logout" in body.lower():
    h3 = curl(["-L", SMS + "/my-websites/create/"])
    tok3 = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', h3)
    print("create form:", bool(tok3))
    if tok3:
        desc = ("PairDish is a free food pairing toolkit: flavor pairing finder, cheese board "
                "builder, nutrition and meal-prep calculators, plus pairing guides that answer "
                "what to serve with any main dish, with tables and citations to USDA sources.")
        r4 = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
             "-e", SMS + "/my-websites/create/",
             "--data-urlencode", f"csrfmiddlewaretoken={tok3.group(1)}",
             "--data-urlencode", "name=PairDish",
             "--data-urlencode", "url=https://pairdish.com",
             "--data-urlencode", "visit_link_anchor=Visit PairDish",
             "--data-urlencode", "tagline=Food pairing tools and guides for home cooks",
             "--data-urlencode", f"description={desc}",
             "--data-urlencode", "category=tool",
             "--data-urlencode", "language=en",
             SMS + "/my-websites/create/"], capture_output=True, text=True, timeout=90)
        print("create posted, len:", len(r4.stdout))
listing = f"{SMS}/{SMSU}/pairdish/"
r5 = subprocess.run(["curl", "-s", "--max-time", "30", "-A", UA, "-L", "-o", "/tmp/sms_pd_listing.html",
                     "-w", "%{http_code}", listing], capture_output=True, text=True, timeout=45)
lh = Path("/tmp/sms_pd_listing.html").read_text(encoding="utf-8", errors="replace") if Path("/tmp/sms_pd_listing.html").exists() else ""
print("listing:", {"url": listing, "http": r5.stdout, "has_name": "PairDish" in lh})