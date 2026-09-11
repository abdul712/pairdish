#!/usr/bin/env python3
"""Directory-Free.com (2-step + session-bound captcha) — two-phase.

Phase 1: python3 dir_dirfree.py step1
  - fresh jar: GET /submit/submit.php -> POST /submit/add.php (categorie=Recreation/Food,
    Submit=Submit Regular Site) -> capture insert form fields (catname etc.)
  - fetch randomImage3.php captcha with SAME jar -> /tmp/df_captcha.png
  - persists jar (/tmp/df_cookies.txt) + captured fields (/tmp/df_fields.json)
Phase 2: python3 dir_dirfree.py step2 <CODE>
  - POST /submit/insert.php with all fields + txtNumber=CODE
  - success marker: "Thank you" / "has been added"
"""
import urllib.request, urllib.parse, http.cookiejar, re, sys, os, json

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://www.directory-free.com"
JAR = "/tmp/df_cookies.txt"
FIELDS = "/tmp/df_fields.json"

def opener(load=False):
    cj = http.cookiejar.LWPCookieJar(JAR)
    if load and os.path.exists(JAR):
        cj.load(ignore_discard=True, ignore_expires=True)
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA), ("Accept", "text/html,*/*")]
    return op, cj

def step1():
    op, cj = opener()
    r = op.open(f"{BASE}/submit/submit.php", timeout=40)
    page = r.read().decode("utf-8", "replace")
    print("GET submit.php:", r.status, len(page))
    # category check
    has_food = "Recreation/Food" in page
    print("category 'Recreation/Food' present:", has_food)

    # POST add.php (Regular)
    data = urllib.parse.urlencode([("categorie", "Recreation/Food"), ("Submit", "Submit Regular Site")]).encode()
    req = urllib.request.Request(f"{BASE}/submit/add.php", data=data)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("Referer", f"{BASE}/submit/submit.php")
    r2 = op.open(req, timeout=40)
    form_page = r2.read().decode("utf-8", "replace")
    print("POST add.php:", r2.status, len(form_page))
    open("/tmp/df_form.html", "w").write(form_page)

    # capture hidden/known fields
    fields = {}
    for m in re.finditer(r'<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"[^>]*>', form_page, re.I):
        fields[m.group(1)] = m.group(2)
    catname = fields.get("catname", "")
    print("captured catname:", repr(catname))
    if not catname:
        fields["catname"] = "Recreation/Food"
        print("catname empty -> using Recreation/Food")
    json.dump(fields, open(FIELDS, "w"))

    # find captcha img src
    m = re.search(r'<img[^>]*src="([^"]*randomImage3[^"]*)"', form_page, re.I)
    src = m.group(1) if m else "randomImage3.php"
    cap_url = src if src.startswith("http") else f"{BASE}/submit/{src.lstrip('/')}"
    print("captcha url:", cap_url)
    r3 = op.open(cap_url, timeout=40)
    img = r3.read()
    open("/tmp/df_captcha.png", "wb").write(img)
    print("captcha image:", r3.status, len(img), "bytes")
    cj.save(ignore_discard=True)
    print("saved. next: OCR /tmp/df_captcha.png then step2 <code>")

def step2(code):
    op, cj = opener(load=True)
    fields = json.load(open(FIELDS))
    long_desc = ("PairDish is a free food pairing toolkit and guide site for home cooks: a flavor pairing "
                 "finder backed by food-science aromatic data, a cheese board builder, buffet and party quantity "
                 "calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. The "
                 "pairing guides answer the daily question \"what to serve with\" any main dish with practical "
                 "tables, portion math, and citations to official sources like USDA MyPlate and FSIS food-safety "
                 "charts. Free to use, no signup required.")[:1000]
    payload = {
        "catname": fields.get("catname", "Recreation/Food"),
        "linkname": "PairDish - Food Pairing Tools & Guides",
        "linkurl": "https://pairdish.com",
        "descriere": long_desc,
        "email": "mabdulrahim+pairdish-dirfree@gmail.com",
        "txtNumber": code.strip(),
        "Submit": "Add URL",
    }
    data = urllib.parse.urlencode(payload).encode()
    req = urllib.request.Request(f"{BASE}/submit/insert.php", data=data)
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    req.add_header("Referer", f"{BASE}/submit/add.php")
    r = op.open(req, timeout=40)
    body = r.read().decode("utf-8", "replace")
    open("/tmp/df_result.html", "w").write(body)
    ok = ("Thank you" in body) or ("has been added" in body)
    title = (re.search(r"<title>(.*?)</title>", body, re.S) or [None, "?"])[1].strip()
    text = re.sub(r"<[^>]+>", " ", body)
    text = re.sub(r"\s+", " ", text)
    print("POST insert.php:", r.status, "len", len(body))
    print("SUCCESS:", ok, "| title:", title[:80])
    print("page text:", text[:400])
    sys.exit(0 if ok else 2)

if __name__ == "__main__":
    if sys.argv[1] == "step1":
        step1()
    elif sys.argv[1] == "step2":
        step2(sys.argv[2])
    else:
        print("usage: step1 | step2 <code>")
