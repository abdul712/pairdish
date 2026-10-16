#!/usr/bin/env python3
"""Run-18: 247webdirectory.com free submission (ASP.NET form, arithmetic captcha, no image captcha).

Flow (verified against the live form this run):
  GET  /submit          -> __RequestVerificationToken + the "Verification: a + b = ?" sum, cookie jar
  POST /submit/save     -> every named field, paid=N (the "Free" radio; ExpediteReview $39.99 is
                           pre-checked in the markup, Basic $19.99 / Featured $59.99 / Premium are
                           also paid), website_confirm honeypot left empty, categ_cd=277
                           (Home & Garden > Cooking)

Usage: python3 scripts/dir_run18_247.py probe | save
"""
import http.cookiejar
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")
BASE = "https://www.247webdirectory.com"
SUBMIT = BASE + "/submit"
SAVE = BASE + "/submit/save"
CATEGORY = "277"  # Home & Garden > Cooking
TITLE = "PairDish - Food Pairing Tools and Recipe Calculators"
DESC = ("PairDish is a free food pairing toolkit: a flavor pairing finder, cheese board builder, "
        "buffet and party quantity calculators, recipe nutrition and macro calculators, and "
        "\"what to serve with\" guides citing USDA and FSIS sources. No signup required.")
EMAIL = "mabdulrahim@gmail.com"
URL = "https://pairdish.com"

jar = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
opener.addheaders = [("User-Agent", UA), ("Accept-Language", "en-US,en;q=0.9")]

page = opener.open(SUBMIT, timeout=40).read().decode("utf-8", "replace")

import html as _html  # noqa: E402  (the captcha label renders its + as &#x2B;)

tok = re.search(r'name="__RequestVerificationToken"[^>]*value="([^"]+)"', page)
cap = re.search(r"Verification:\s*(\d+)\s*\+\s*(\d+)", _html.unescape(page))
print("token:", "yes" if tok else "NO", "| captcha:", cap.groups() if cap else "NO")
if not tok or not cap:
    raise SystemExit("probe FAILED: token or captcha missing")
if "--save" not in sys.argv and sys.argv[-1] != "save":
    print("probe OK (no POST sent); free radio value:", re.findall(r'name="paid" id="radioFree" value="([^"]*)"', page))
    raise SystemExit(0)

# persistence: a phpLD/ASP.NET form issues the token per GET, so post to the same session
body = urllib.parse.urlencode({
    "__RequestVerificationToken": tok.group(1),
    "website_confirm": "",
    "site_title": TITLE,
    "site_url": URL,
    "site_desc": DESC,
    "email_add": EMAIL,
    "categ_cd": CATEGORY,
    "paid": "N",
    "captcha_answer": str(int(cap.group(1)) + int(cap.group(2))),
}).encode()
req = urllib.request.Request(SAVE, data=body, headers={
    "User-Agent": UA,
    "Content-Type": "application/x-www-form-urlencoded",
    "Referer": SUBMIT,
    "Origin": BASE,
})
try:
    resp = opener.open(req, timeout=40)
    text = resp.read().decode("utf-8", "replace")
    code = resp.status
    final = resp.geturl()
except urllib.error.HTTPError as e:
    text = e.read().decode("utf-8", "replace")
    code = e.code
    final = e.geturl()
plain = re.sub(r"<[^>]+>", " ", text)
plain = re.sub(r"\s+", " ", plain)
print(f"POST {code} -> {final}")
print("body:", plain[:700])

free_paid = re.search(r"Verification:\s*(\d+)\s*[+]\s*(\d+)", text)
if free_paid:
    print("RESULT: form re-rendered with a NEW captcha -> likely rejected")
for marker in ("thank you", "Thank you", "submitted", "received", "pending", "review", "awaiting", "success"):
    if marker in plain:
        print(f"  marker present: {marker!r}")
