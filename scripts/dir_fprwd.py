#!/usr/bin/env python3
"""FreePRWebDirectory (phpLD) submission — two-phase (captcha is session-bound).

Phase 1: python3 dir_fprwd.py capture
  - fresh LWPCookieJar session, GET /submit.php, extract IMAGEHASH,
    download /captcha.php?imagehash=... with SAME session, save /tmp/fprwd_captcha.png
  - saves cookies to /tmp/fprwd_cookies.txt and prints the hash
Phase 2: python3 dir_fprwd.py submit <CODE>
  - reloads cookies, POSTs the form. Success marker: "Link submitted and awaiting approval".
  - on failure: prints errForm spans + saves HTML to /tmp/fprwd_result.html
"""
import urllib.request, urllib.parse, http.cookiejar, re, sys, os

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://www.freeprwebdirectory.com"
JAR_FILE = "/tmp/fprwd_cookies.txt"
HASH_FILE = "/tmp/fprwd_hash.txt"

def make_opener(load=False):
    cj = http.cookiejar.LWPCookieJar(JAR_FILE)
    if load and os.path.exists(JAR_FILE):
        cj.load(ignore_discard=True, ignore_expires=True)
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/xhtml+xml,*/*")]
    return op, cj

def capture():
    op, cj = make_opener()
    r = op.open(f"{BASE}/submit.php", timeout=40)
    page = r.read().decode("utf-8", "replace")
    print("GET /submit.php:", r.status, len(page))
    m = re.search(r'name="IMAGEHASH"[^>]*value="([0-9a-f]+)"', page)
    if not m:
        print("NO IMAGEHASH FOUND — debug:"); print(page[:1500]); sys.exit(1)
    h = m.group(1)
    open(HASH_FILE, "w").write(h)
    print("IMAGEHASH:", h)
    cap = op.open(f"{BASE}/captcha.php?imagehash={h}", timeout=40)
    data = cap.read()
    open("/tmp/fprwd_captcha.png", "wb").write(data)
    print("captcha image:", cap.status, len(data), "bytes -> /tmp/fprwd_captcha.png")
    cj.save(ignore_discard=True)
    print("cookies saved")

def submit(code):
    h = open(HASH_FILE).read().strip()
    op, cj = make_opener(load=True)
    desc = ("PairDish is a free food pairing toolkit and guide site for home cooks. Interactive tools include "
            "a flavor pairing finder, cheese board builder, buffet and party quantity calculators, recipe "
            "nutrition and macro calculators, and a meal-prep planner. The pairing guides answer the daily "
            "question \"what to serve with\" any main dish, with practical tables, portion math, and citations "
            "to official sources like USDA MyPlate. Free to use, no signup required.")[:500]
    mdesc = ("Free food pairing tools and guides for home cooks: flavor pairing finder, cheese board builder, "
             "calculators, and what-to-serve-with guides.")[:250]
    fields = [
        ("LINK_TYPE", "normal"),
        ("TITLE", "PairDish - Food Pairing Tools & Guides"),
        ("URL", "https://pairdish.com"),
        ("DESCRIPTION", desc),
        ("DESCRIPTION_limit", "500"),
        ("META_KEYWORDS", "food pairing, wine pairing, cheese pairing, meal planning, nutrition calculator, what to serve with"),
        ("META_DESCRIPTION", mdesc),
        ("META_DESCRIPTION_limit", "250"),
        ("OWNER_NAME", "Abdul Rahim"),
        ("OWNER_EMAIL", "mabdulrahim+pairdish-fprwd@gmail.com"),
        ("CATEGORY_ID", "297"),
        ("IMAGEHASH", h),
        ("CAPTCHA", code.strip()),
        ("AGREERULES", "on"),
        ("submit", "Continue"),
    ]
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(f"{BASE}/submit.php", data=data)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("Referer", f"{BASE}/submit.php")
    r = op.open(req, timeout=40)
    body = r.read().decode("utf-8", "replace")
    open("/tmp/fprwd_result.html", "w").write(body)
    ok = "Link submitted and awaiting approval" in body
    errs = re.findall(r'class="errForm"[^>]*>(.*?)</span>', body, re.S)
    msgs = re.findall(r'class="msg"[^>]*>(.*?)</', body, re.S)
    print("POST result:", r.status, "len", len(body))
    print("SUCCESS:", ok)
    print("errors:", [re.sub(r"<[^>]+>", " ", e).strip()[:100] for e in errs][:8])
    print("msgs:", [re.sub(r"<[^>]+>", " ", m2).strip()[:100] for m2 in msgs][:5])
    print("title:", (re.search(r"<title>(.*?)</title>", body, re.S) or [None, "?"])[1][:100])
    sys.exit(0 if ok else 2)

if __name__ == "__main__":
    if sys.argv[1] == "capture":
        capture()
    elif sys.argv[1] == "submit":
        submit(sys.argv[2])
    else:
        print("usage: capture | submit <code>")
