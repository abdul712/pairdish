#!/usr/bin/env python3
"""Run-16 PairDish: submit to addfreewebdirectory.com (phpLD-5 URL-param wizard, free tier).

Verified in this run against the live install:
  * GET /submit.php            -> category <select name="CATEGORY_ID"> only (no radios)
  * GET /submit.php?c=331      -> step 2 with FIVE LINK_TYPE radios; value 11 =
                                  "Free Regular Link--free  Review time - 6 to 9 months"
                                  (7/8/9/10 are $60 / $20 / $20 / $7 paid tiers)
  * GET /submit.php?c=331&LINK_TYPE=11 -> the detail form:
      LINK_TYPE(hidden)=11, TITLE, URL, CATEGORY_ID(hidden)=331, ADD_CATEGORY_ID[],
      DESCRIPTION, OWNER_NAME, OWNER_EMAIL, OWNER_NEWSLETTER_ALLOW, RECPR_URL, RECPR_TEXT,
      DO_MATH (arithmetic challenge), AGREERULES (checkbox -> posts "on"), continue=Continue
    No IMAGEHASH, no captcha. POST target = the same step-3 URL.
  * Category: 331 = Home & Family > Cooking on this tree.

IPv6 egress breaks this family (REMOTE_ADDR into a varchar column) -> force AF_INET.

Usage:
  python3 scripts/dir_run16_afwd.py probe              # GET step-3 + dump the challenge
  python3 scripts/dir_run16_afwd.py post               # GET step-3 then POST the submission
"""
import http.cookiejar
import html
import pathlib
import re
import socket
import sys
import urllib.parse
import urllib.request

_gai = socket.getaddrinfo
socket.getaddrinfo = lambda h, p, family=0, type=0, proto=0, flags=0: _gai(h, p, socket.AF_INET, type, proto, flags)

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

BASE = "https://www.addfreewebdirectory.com"
CATEGORY = "331"          # Home & Family > Cooking
LINK_TYPE = "11"          # "Free Regular Link--free"
STEP3 = f"{BASE}/submit.php?c={CATEGORY}&LINK_TYPE={LINK_TYPE}"

TITLE = "PairDish - Food Pairing Tools & Recipe Calculators"
URL = "https://pairdish.com/"
DESC = ("PairDish is a free kitchen toolkit for food pairing and recipe planning: a flavor pairing "
        "finder, recipe nutrition calculator, macro and protein calculators, meal prep and grocery "
        "list builders, cheese board, buffet and potluck planners, plus more than 30 other cooking "
        "tools. The guides cover what to serve with popular dishes, with portion math and "
        "official-source nutrition data from the FDA and USDA FoodData Central. No signup required; "
        "everything runs in the browser.")
OWNER = "PairDish"
EMAIL = "mabdulrahim+pairdish-r16@gmail.com"

JAR = pathlib.Path("/tmp/pd16_afwd_post.jar")
PAGE = pathlib.Path("/tmp/pd16_afwd_post.html")


def opener():
    cj = http.cookiejar.LWPCookieJar(str(JAR))
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj


def get(url, op, cj, save=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*",
                                               "Referer": BASE + "/submit.php"})
    with op.open(req, timeout=35) as r:
        data = r.read()
    cj.save(ignore_discard=True, ignore_expires=True)
    if save:
        pathlib.Path(save).write_bytes(data)
    return r.geturl(), data.decode("utf-8", "replace")


def solve_math(page):
    m = re.search(r"font[^>]*>\s*(\d+)\s*\+\s*(\d+)\s*=", page, re.I) or \
        re.search(r"(\d+)\s*\+\s*(\d+)\s*=\s*</font>", page, re.I)
    if not m:
        return None
    return str(int(m.group(1)) + int(m.group(2)))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else "probe"
    op, cj = opener()
    final, page = get(STEP3, op, cj, save=PAGE)
    fields = [n for n in re.findall(r'name=["\']([^"\']+)["\']', page)]
    print(f"GET {STEP3}\n  -> {final} len={len(page)}")
    ans = solve_math(page)
    print("  DO_MATH answer:", ans, "| DESCRIPTION field:", "DESCRIPTION" in fields)
    if mode == "probe":
        return

    body = {
        "LINK_TYPE": LINK_TYPE,
        "TITLE": TITLE,
        "URL": URL,
        "CATEGORY_ID": CATEGORY,
        "DESCRIPTION": DESC,
        "OWNER_NAME": OWNER,
        "OWNER_EMAIL": EMAIL,
        "RECPR_URL": "",
        "RECPR_TEXT": "",
        "DO_MATH": ans or "",
        "AGREERULES": "on",
        "formSubmitted": "1",
        "continue": "Continue",
    }
    data = urllib.parse.urlencode(body).encode()
    req = urllib.request.Request(STEP3, data=data, headers={
        "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded",
        "Referer": STEP3, "Accept": "text/html,*/*"})
    with op.open(req, timeout=45) as r:
        out = r.read().decode("utf-8", "replace")
        cj.save(ignore_discard=True, ignore_expires=True)
        print(f"POST {STEP3} -> {r.status} len={len(out)} final={r.geturl()}")
    pathlib.Path("/tmp/pd16_afwd_result.html").write_text(out)

    markers = ["Link submitted", "awaiting approval", "pending review", "already exists",
               "We got your submission", "msg", "errForm", "Please Check Your Math"]
    for mk in markers:
        if mk.lower() in out.lower():
            i = out.lower().find(mk.lower())
            print(f"  MARKER {mk!r}: {re.sub(r'[[:space:]]+', ' ', re.sub(r'<[^>]+>', ' ', out[max(0,i-140):i+220])).strip()[:320]}")
    if re.search(r'class=["\']msg["\']', out, re.I):
        m = re.search(r'class=["\']msg["\'][^>]*>(.*?)</', out, re.S | re.I)
        print("  msg block:", html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(1)))).strip()[:300] if m else "?")
    print("  errForm present:", "errForm" in out, "| TITLE echo:", TITLE in out)


if __name__ == "__main__":
    main()
