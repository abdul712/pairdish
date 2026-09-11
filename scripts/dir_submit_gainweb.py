#!/usr/bin/env python3
"""Submit PairDish to GainWeb (phpLD free listing, LINK_TYPE=2).
Flow (verified 2026-09-09 on another campaign):
  1. GET https://gainweb.org/submit.php (apex, NOT www) with cookie jar
  2. POST update_session.php 'url=https://gainweb.org/submit.php' (mimic onsubmit ajaxFunction)
  3. POST submit.php with the form payload
  4. Success marker: 'Link submitted and awaiting approval' inside class="msg"
"""
import urllib.request, urllib.parse, http.cookiejar, re, sys

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
opener.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/xhtml+xml")]

BASE = "https://gainweb.org"

def post(url, data_list, referer=None):
    data = urllib.parse.urlencode(data_list).encode()
    req = urllib.request.Request(url, data=data)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    if referer:
        req.add_header("Referer", referer)
    return opener.open(req, timeout=40)

# 1
r = opener.open(f"{BASE}/submit.php", timeout=40)
page = r.read().decode("utf-8", "replace")
print("step1 GET submit.php:", r.status, len(page), "bytes")

# 2
r2 = post(f"{BASE}/update_session.php", [("url", f"{BASE}/submit.php")], referer=f"{BASE}/submit.php")
print("step2 update_session:", r2.status)

# 3
short_desc = ("PairDish is a free food pairing toolkit: flavor pairing finder, cheese board builder, "
              "nutrition and meal-prep calculators, plus pairing guides that answer \"what to serve with\" any main dish.")
short_desc = short_desc[:200]
meta_desc = ("Free food pairing tools and guides for home cooks: flavor pairing finder, cheese board builder, "
             "calculators, and what-to-serve-with guides.")[:160]
payload = [
    ("LINK_TYPE", "2"),
    ("TITLE", "PairDish - Food Pairing Tools & Guides"),
    ("URL", "https://pairdish.com"),
    ("CATEGORY_ID", "913"),  # Food and Drink
    ("DESCRIPTION", short_desc),
    ("OWNER_NAME", "Abdul Rahim"),
    ("OWNER_EMAIL", "mabdulrahim+pairdish-gainweb@gmail.com"),
    ("META_KEYWORDS", "food pairing, wine pairing, cheese pairing, meal planning, nutrition calculator, what to serve with"),
    ("META_DESCRIPTION", meta_desc),
    ("AGREERULES", "1"),
    ("formSubmitted", "1"),
    ("continue", "Continue"),
]
r3 = post(f"{BASE}/submit.php", payload, referer=f"{BASE}/submit.php")
body = r3.read().decode("utf-8", "replace")
print("step3 POST submit.php:", r3.status, len(body), "bytes")
open("/tmp/gainweb_result.html", "w").write(body)

ok = "Link submitted and awaiting approval" in body
# also check msg block
msgs = re.findall(r'class="msg"[^>]*>(.*?)</', body, re.S)
errs = re.findall(r'class="errForm"[^>]*>(.*?)</span>', body, re.S)
print("SUCCESS MARKER:", ok)
print("msg blocks:", [re.sub(r"<[^>]+>", " ", m).strip()[:120] for m in msgs][:5])
print("errForm spans:", [re.sub(r"<[^>]+>", " ", m).strip()[:120] for m in errs][:8])
print("title:", re.search(r"<title>(.*?)</title>", body, re.S).group(1).strip()[:100])
sys.exit(0 if ok else 2)
