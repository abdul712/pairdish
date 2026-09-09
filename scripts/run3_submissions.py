#!/usr/bin/env python3
"""Run-3 directory submissions for pairdish.com (free-only).
Targets: Active Search Results (POST), Entireweb (GET), ShowMySites (Django flow),
Huzzler (probe -> signup -> product form).
Prints evidence per target; tracker rows are added by the operator after review.
Never prints passwords. Kit values from outreach/SUBMISSION_KIT.md.
"""
import json
import re
import subprocess
import urllib.parse
from pathlib import Path

BASE_SITE = "https://pairdish.com"
NAME = "PairDish"
UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
GMAIL_BASE = "mabdulrahim@gmail.com"

env = {}
for line in Path("/home/hermes/.hermes/.env").read_text().splitlines():
    line = line.strip()
    if "=" in line and not line.startswith("#"):
        k, v = line.split("=", 1)
        env[k.strip()] = v.strip().strip('"').strip("'")

out = {}

# ---------- 1. Active Search Results (POST addwebsite.php; base gmail only) ----------
r = subprocess.run(
    ["curl", "-s", "--max-time", "45", "-A", UA, "-L", "-w", "\nHTTP:%{http_code}",
     "-e", "https://www.activesearchresults.com/addwebsite.php",
     "-d", f"url={BASE_SITE}&email={GMAIL_BASE}&submiturl=Submit",
     "https://www.activesearchresults.com/addwebsite.php"],
    capture_output=True, text=True, timeout=60)
body = r.stdout
out["activesearchresults"] = {
    "http": body.rsplit("HTTP:", 1)[-1][:3],
    "confirm_page": "urladdedconfirm" in body or "Thank you" in body,
    "snip": re.sub(r"<[^>]+>", " ", body)[:220].strip(),
}

# ---------- 2. Entireweb (GET process.php) ----------
em2 = "mabdulrahim+pairdish-entireweb@gmail.com"
r = subprocess.run(
    ["curl", "-s", "--max-time", "45", "-A", UA, "-L", "-w", "\nHTTP:%{http_code}|URL:%{url_effective}",
     f"https://www.entireweb.com/free_submission/process.php?url={urllib.parse.quote(BASE_SITE, safe='')}&email={urllib.parse.quote(em2, safe='')}"],
    capture_output=True, text=True, timeout=60)
b2 = r.stdout
out["entireweb"] = {
    "http": b2.rsplit("HTTP:", 1)[-1].split("|")[0][:3],
    "sent_redirect": "/free_submission/sent/" in b2,
    "zid": (re.search(r"zid=([a-z0-9]+)", b2) or [None, ""])[1][:12],
    "promo_note": "confirmation email sent; clicking opts into promo mail",
}

# ---------- 3. ShowMySites (Django: signup -> maybe login -> create -> verify) ----------
SMS = "https://www.showmysites.com"
SMSU = "pairdish"
SMSE = "mabdulrahim+pairdish-sms@gmail.com"
sms_pass = "PD!sh2026-Dir7k"
CJ = "/tmp/sms_pairdish_cookies.txt"
for f in (CJ,):
    Path(f).unlink(missing_ok=True)


def curl(args):
    rr = subprocess.run(["curl", "-s", "--max-time", "45", "-A", UA, "-b", CJ, "-c", CJ] + args,
                        capture_output=True, text=True, timeout=60)
    return rr.stdout


def csrf_of(html):
    m = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', html)
    return m.group(1) if m else None


sms = {}
h = curl(["-L", SMS + "/accounts/signup/"])
tok = csrf_of(h)
sms["signup_page"] = bool(tok)
if tok:
    r = subprocess.run(
        ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
         "-e", SMS + "/accounts/signup/",
         "-d", f"csrfmiddlewaretoken={tok}&username={SMSU}&email={SMSE}&password1={sms_pass}&password2={sms_pass}",
         SMS + "/accounts/signup/"], capture_output=True, text=True, timeout=90)
    body = r.stdout
    sms["signup_post_len"] = len(body)
    if 'name="login"' in body or "Sign In" in body:
        tok2 = csrf_of(body)
        r2 = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
             "-e", SMS + "/accounts/login/",
             "-d", f"csrfmiddlewaretoken={tok2}&login={SMSE}&password={sms_pass}",
             SMS + "/accounts/login/"], capture_output=True, text=True, timeout=90)
        body = r2.stdout
    sms["logged_in"] = "logout" in body.lower()
    h2 = curl(["-L", SMS + "/my-websites/create/"])
    tok3 = csrf_of(h2)
    sms["create_form"] = bool(tok3)
    if tok3:
        desc = ("PairDish is a free food pairing toolkit: flavor pairing finder, cheese board "
                "builder, nutrition and meal-prep calculators, plus pairing guides that answer "
                "what to serve with any main dish, with tables and citations to USDA sources.")
        fields = {
            "csrfmiddlewaretoken": tok3,
            "name": NAME,
            "url": BASE_SITE,
            "visit_link_anchor": "Visit PairDish",
            "tagline": "Food pairing tools and guides for home cooks",
            "description": desc,
            "category": "tool",
            "language": "en",
        }
        data = urllib.parse.urlencode(fields)
        r3 = subprocess.run(
            ["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L",
             "-e", SMS + "/my-websites/create/", "-d", data, SMS + "/my-websites/create/"],
            capture_output=True, text=True, timeout=90)
        rb = r3.stdout
        sms["create_post"] = {
            "len": len(rb),
            "form_returned": bool(csrf_of(rb)) and "my-websites" in rb,
            "error_snip": re.sub(r"<[^>]+>", " ", rb)[:200] if ("error" in rb.lower() or "invalid" in rb.lower()) else "",
        }
listing = f"{SMS}/{SMSU}/pairdish/"
r4 = subprocess.run(["curl", "-s", "--max-time", "30", "-A", UA, "-L", "-o", "/tmp/sms_pairdish.html",
                     "-w", "%{http_code}", listing], capture_output=True, text=True, timeout=45)
sms["listing_url"] = listing
sms["listing_http"] = r4.stdout
try:
    lh = Path("/tmp/sms_pairdish.html").read_text(encoding="utf-8", errors="replace")
    sms["listing_has_name"] = NAME in lh
except FileNotFoundError:
    sms["listing_has_name"] = False
out["showmysites"] = sms

# ---------- 4. Huzzler (probe signup + product form) ----------
HZ = "https://huzzler.so"
hze = {}
r = subprocess.run(["curl", "-s", "--max-time", "45", "-A", UA, "-L", "-o", "/tmp/hz_signup.html",
                    "-w", "%{http_code}", HZ + "/signup"], capture_output=True, text=True, timeout=60)
hze["signup_http"] = r.stdout
hb = Path("/tmp/hz_signup.html").read_text(encoding="utf-8", errors="replace") if Path("/tmp/hz_signup.html").exists() else ""
hze["has_email_field"] = ('type="email"' in hb) or ('name="email"' in hb)
hze["is_react"] = ("__NEXT_DATA__" in hb) or ("react" in hb.lower())
hze["has_password_field"] = 'type="password"' in hb
out["huzzler_probe"] = hze

print(json.dumps(out, indent=1))