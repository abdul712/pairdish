#!/usr/bin/env python3
"""Run-19: webdirectory.top free submission (Laravel form, leaf categoryId, APEX host).

Recipe per the skill: /submit carries _token + cookies; the JS builder posts the last
non-empty select as `categoryId` (leaf ids only, parent ids are rejected); description must
be >=150 chars; the www host 301s and drops a POST, so post to the APEX host.
Category tree: House (118) > Cooking (121) is a leaf.
"""
import http.cookiejar
import re
import sys
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36")
SITE = "https://webdirectory.top"
EMAIL = "mabdulrahim+pairdish@gmail.com"
TITLE = "PairDish Food Pairing Tools"
DOMAIN = "https://pairdish.com"
DESC = ("PairDish is a free culinary toolkit: a flavour pairing guide, cheese, coffee and chocolate "
        "pairing charts, nutrition, macro, caffeine and glycemic-load calculators, a recipe scaler, "
        "unit converter and meal planner. Forty-plus tools, no account needed.")


def opener_for(jar):
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))


def main(mode):
    jar = http.cookiejar.CookieJar()
    op = opener_for(jar)
    req = urllib.request.Request(SITE + "/submit", headers={"User-Agent": UA})
    html = op.open(req, timeout=30).read().decode("utf-8", "replace")
    token = re.search(r'name="_token"\s+value="([^"]+)"', html)
    if not token:
        print("no _token found; bytes", len(html))
        return 1
    print("token ok, desc len", len(DESC), "title len", len(TITLE))
    if mode == "probe":
        print("probe only; posting would send categoryId=121 (House > Cooking)")
        return 0
    data = urllib.parse.urlencode({
        "title": TITLE,
        "domain": DOMAIN,
        "description": DESC,
        "email": EMAIL,
        "categoryId": "121",
        "_token": token.group(1),
    }).encode()
    req = urllib.request.Request(SITE + "/submit", data=data, headers={
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": SITE + "/submit",
    })
    try:
        resp = op.open(req, timeout=40)
        body = resp.read().decode("utf-8", "replace")
        print("status", resp.status, "url", resp.geturl(), "bytes", len(body))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        print("HTTPError", e.code, "url", e.geturl(), "bytes", len(body))
    text = re.sub(r"<[^>]+>", " ", body)
    text = re.sub(r"\s+", " ", text)
    err = re.findall(r'class="[^"]*error[^"]*"[^>]*>(.*?)</', body, re.S)
    print("errors:", [re.sub(r"\s+", " ", e)[:120] for e in err][:6])
    for marker in ("thank", "success", "pending", "moderation", "added", "already", "Error", "required"):
        m = re.search(marker, text, re.I)
        if m:
            print(f"  '{marker}':", text[max(0, m.start() - 80):m.start() + 140])
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1] if len(sys.argv) > 1 else "probe"))
