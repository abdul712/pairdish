#!/usr/bin/env python3
"""PairDish run-5 directory submissions (phpLD family + probes).
Modes:
  probe <key>            GET submit page; dump form fields, selects, captcha; save jar
  post <key> <code> <imagehash>   POST the submission form; report markers
  url <url> [outfile]    fetch arbitrary URL for inspection
Keys: swd=submissionwebdirectory, spd=sitepromotiondirectory, pbd=promotebusinessdirectory,
      bsi=bestsitesindex, ukd=ukinternetdirectory
"""
import sys, re, json, html, urllib.request, urllib.parse, urllib.error, http.cookiejar

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"

SITES = {
    "swd": {"base": "https://www.submissionwebdirectory.com", "link_type": ("LINK_TYPE", "normal"), "desc_limit": "700"},
    "spd": {"base": "https://www.sitepromotiondirectory.com", "link_type": ("LINK_TYPE", "normal"), "desc_limit": "1000"},
    "pbd": {"base": "https://www.promotebusinessdirectory.com", "link_type": ("LINK_TYPE", "2"), "desc_limit": "1000"},
    "bsi": {"base": "https://www.bestsitesindex.com", "link_type": ("LINK_TYPE", "normal"), "desc_limit": "1000"},
    "ukd": {"base": "https://www.ukinternetdirectory.net", "link_type": ("LINK_TYPE", "normal"), "desc_limit": "1000"},
    "fiwd": {"base": "https://www.freeinternetwebdirectory.com", "link_type": ("LINK_TYPE", "normal"), "desc_limit": "1000"},
}

TITLE = "PairDish - Free Food Pairing Tools & Cooking Guides"
URL = "https://pairdish.com"
DESCRIPTION = ("PairDish is a free food pairing toolkit for home cooks: a flavor pairing finder, cheese board "
               "builder, buffet and party quantity calculators, recipe nutrition and macro calculators, plus "
               "practical pairing guides that answer what to serve with any main dish. Combines interactive "
               "tools with researched, source-cited guides. Free, no signup.")
META_KEYWORDS = "food pairing, cheese pairing, meal planning, nutrition calculator, what to serve with, cooking tools"
META_DESCRIPTION = ("Free food pairing tools and guides for home cooks: flavor pairing finder, cheese board builder, "
                    "portion and nutrition calculators, and what-to-serve-with pairing guides.")
OWNER_NAME = "Abdul Rahim"
OWNER_EMAIL = "mabdulrahim+pairdish-dir5@gmail.com"

def new_opener():
    cj = http.cookiejar.CookieJar()
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj

def save_jar(key, cj):
    data = [{"name": c.name, "value": c.value, "domain": c.domain, "path": c.path} for c in cj]
    json.dump(data, open(f"/tmp/pd_{key}_jar.json", "w"))

def load_opener(key):
    cj = http.cookiejar.CookieJar()
    for d in json.load(open(f"/tmp/pd_{key}_jar.json")):
        ck = http.cookiejar.Cookie(0, d["name"], d["value"], None, False, d["domain"], True,
                                   d["domain"].startswith("."), d["path"], True, False, None, False, None, None, {})
        cj.set_cookie(ck)
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj

def get(url, opener=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    op = opener or urllib.request.build_opener()
    with op.open(req, timeout=45) as r:
        return r.read(), r.status

def probe(key):
    cfg = SITES[key]
    base = cfg["base"]
    submit = f"{base}/submit.php"
    op, cj = new_opener()
    try:
        body, status = get(submit, op)
    except Exception as e:
        print(f"{key}: SUBMIT FETCH FAILED: {e}")
        return
    t = body.decode("utf-8", "replace")
    title = re.search(r"<title>([^<]*)", t)
    print(f"=== {key} {submit}\nstatus={status} title={title.group(1).strip()[:80] if title else '?'}")
    # form fields
    forms = re.findall(r"<form[^>]*>", t, re.I)
    print("forms:", forms[:3])
    inputs = re.findall(r"<input[^>]+>", t, re.I)
    shown = []
    for i in inputs:
        nm = re.search(r'name="([^"]+)"', i)
        tp = re.search(r'type="([^"]+)"', i)
        vl = re.search(r'value="([^"]*)"', i)
        if nm:
            shown.append(f"{nm.group(1)}:{tp.group(1) if tp else '?'}={ (vl.group(1) if vl else '')[:40] }")
    print("inputs:", shown[:40])
    for m in re.finditer(r'<select[^>]*name="([^"]+)"[^>]*>', t, re.I):
        name = m.group(1)
        seg = t[m.end():t.find("</select>", m.end())]
        opts = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)', seg)
        food = [o for o in opts if re.search(r"food|cook|recipe|drink|beverage", o[1], re.I)]
        print(f"select[{name}] options={len(opts)} food_matches={food[:12]}")
    # captcha
    m = re.search(r'name="IMAGEHASH"[^>]*value="([^"]+)"', t)
    if m:
        imagehash = m.group(1)
        try:
            img, istatus = get(f"{base}/captcha.php?imagehash={imagehash}", op)
            open(f"/tmp/pd_{key}_captcha.png", "wb").write(img)
            print(f"IMAGEHASH={imagehash} captcha bytes={len(img)} status={istatus} -> /tmp/pd_{key}_captcha.png")
        except Exception as e:
            print(f"IMAGEHASH={imagehash} captcha fetch failed: {e}")
    else:
        print("no IMAGEHASH field found")
    for marker in ["agreerules", "formSubmitted", "category", "CID", "cat="]:
        hits = len(re.findall(marker, t, re.I))
        if hits:
            print(f"marker '{marker}': {hits}")
    save_jar(key, cj)
    open(f"/tmp/pd_{key}_submit.html", "w").write(t)
    print(f"saved -> /tmp/pd_{key}_submit.html  jar saved")

def post(key, code, imagehash, cat=""):
    cfg = SITES[key]
    base = cfg["base"]
    submit = f"{base}/submit.php"
    op, cj = load_opener(key)
    lt_name, lt_val = cfg["link_type"]
    fields = {
        lt_name: lt_val,
        "TITLE": TITLE,
        "URL": URL,
        "DESCRIPTION": DESCRIPTION,
        "DESCRIPTION_limit": cfg.get("desc_limit", "700"),
        "META_KEYWORDS": META_KEYWORDS,
        "META_DESCRIPTION_limit": "250",
        "META_DESCRIPTION": META_DESCRIPTION,
        "OWNER_NAME": OWNER_NAME,
        "OWNER_EMAIL": OWNER_EMAIL,
        "AGREERULES": "on",
        "submit": "Continue",
    }
    if cat:
        fields["CATEGORY_ID"] = cat
    fields["IMAGEHASH"] = imagehash
    fields["CAPTCHA"] = code
    for extra in ("formSubmitted", "submit"):
        pass
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(submit, data=data, headers={"User-Agent": UA, "Referer": submit,
                                                             "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with op.open(req, timeout=60) as r:
            body = r.read().decode("utf-8", "replace")
            status = r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        status = e.code
    print("POST status:", status, "| len:", len(body))
    for marker in ["thank", "Thank", "awaiting approval", "awaiting", "added", "pending",
                   "Invalid", "invalid", "wrong", "errForm", "must agree", "You must", "Success"]:
        m = re.search(marker, body)
        if m:
            snippet = body[max(0, m.start() - 90):m.start() + 170].replace("\n", " ")
            print(f"  [{marker}] ...{snippet}...")
    open(f"/tmp/pd_{key}_post_result.html", "w").write(body)
    print(f"saved -> /tmp/pd_{key}_post_result.html")

def urlmode(url, out=None):
    try:
        body, status = get(url)
    except Exception as e:
        print("FETCH FAILED:", e)
        return
    t = body.decode("utf-8", "replace")
    print("status", status, "len", len(t))
    if out:
        open(out, "w").write(t)
        print("saved ->", out)
    else:
        print(t[:1500])

if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "probe":
        probe(sys.argv[2])
    elif mode == "post":
        post(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5] if len(sys.argv) > 5 else "")
    elif mode == "url":
        urlmode(sys.argv[2], sys.argv[3] if len(sys.argv) > 3 else None)
