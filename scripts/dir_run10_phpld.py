#!/usr/bin/env python3
"""Run-10 PairDish phpLD submitters for four siblings this campaign has never tried
(proven first-try for the NY-tax campaign on 2026-09-23):
  mid    marketinginternetdirectory.com  single-form, desc cap 800, cat 297 Cooking
  asud   allstatesusadirectory.com       single-form, desc cap 1000, cat 297 Cooking
  prolink prolinkdirectory.com           AJAX categ-tree (hidden CATEGORY_ID=0), desc 1000
  dgb    digabusiness.com                AJAX categ-tree, 5-glyph captcha, desc 1000

Modes:
  probe <key>              GET /submit.php (jar) -> save page + captcha png + IMAGEHASH json
  tree <url> <categID>     drill a categ-tree.php AJAX tree
  post <key> <code> [cat]  POST free LINK_TYPE=normal submission with the OCR'd captcha

Set PD_IPV4=1 to force AF_INET resolution (the phpLD family writes REMOTE_ADDR into a
varchar column and IPv6 connections blow up with "Data too long for column 'IPADDRESS'").
"""
import http.cookiejar
import json
import os
import pathlib
import re
import socket
import sys
import urllib.error
import urllib.parse
import urllib.request

if os.environ.get("PD_IPV4") == "1":
    _orig = socket.getaddrinfo

    def _afinet(host, port, family=0, *a, **kw):
        return _orig(host, port, socket.AF_INET, *a, **kw)

    socket.getaddrinfo = _afinet

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")
TMP = pathlib.Path("/tmp")

SITES = {
    "mid": {"candidates": ["https://www.marketinginternetdirectory.com",
                           "https://marketinginternetdirectory.com"], "desc_limit": 800},
    "asud": {"candidates": ["https://www.allstatesusadirectory.com",
                            "https://allstatesusadirectory.com"], "desc_limit": 1000},
    "prolink": {"candidates": ["https://www.prolinkdirectory.com",
                               "https://prolinkdirectory.com"], "desc_limit": 1000},
    "dgb": {"candidates": ["https://www.digabusiness.com",
                           "https://digabusiness.com"], "desc_limit": 1000},
}

TITLE = "PairDish - Food Pairing Tools & Recipe Calculators"
URL = "https://pairdish.com/"
DESC_LONG = (
    "PairDish is a free kitchen toolkit for food pairing and recipe planning: a flavor pairing "
    "finder, recipe nutrition calculator, macro and protein calculators, meal prep and grocery "
    "list builders, cheese board, buffet and potluck planners, plus more than 30 other cooking "
    "tools. The pairing guides answer what to serve with popular dishes with portion math and "
    "official-source data from the FDA, USDA FoodData Central and FSIS. No signup required; "
    "everything runs in the browser.")
DESC_MED = (
    "PairDish is a free food pairing and recipe planning toolkit: flavor pairing finder, recipe "
    "nutrition and macro calculators, meal prep and grocery list builders, cheese board and "
    "buffet planners, plus 30+ cooking tools. The what-to-serve guides combine portion math with "
    "official USDA and FDA nutrition data. No signup required.")
DESC_SHORT = (
    "PairDish is a free food pairing and recipe toolkit: flavor pairing finder, nutrition, macro "
    "and meal prep calculators, cheese board and buffet planners, plus what-to-serve guides with "
    "official USDA data.")
META_KEYWORDS = "food pairing, recipe nutrition calculator, meal prep, flavor pairing, cooking tools"
META_DESCRIPTION = ("Free food pairing and recipe tools: flavor pairing finder, nutrition, macro and "
                    "meal prep calculators, plus what-to-serve guides.")
OWNER_NAME = "Abdul Rahim"
OWNER_EMAIL = "mabdulrahim+pairdish-dir10@gmail.com"
DEFAULT_CATEGORY = "297"  # shared taxonomy: Recreation & Sports > Cooking


def jarf(k):
    return TMP / f"pd10_{k}.jar"


def hf(k):
    return TMP / f"pd10_{k}_hash.json"


def pagef(k):
    return TMP / f"pd10_{k}_submit.html"


def resf(k):
    return TMP / f"pd10_{k}_result.html"


def opener(key, load=False):
    cj = http.cookiejar.LWPCookieJar(str(jarf(key)))
    if load and jarf(key).exists():
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception:
            pass
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/xhtml+xml,*/*"),
                     ("Accept-Language", "en-US,en;q=0.9")]
    return op, cj


def get(op, url, referer=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    if referer:
        req.add_header("Referer", referer)
    with op.open(req, timeout=45) as r:
        return r.status, r.read(), r.geturl()


def probe(key):
    cfg = SITES[key]
    last = None
    for base in cfg["candidates"]:
        try:
            op, cj = opener(key)
            status, raw, final = get(op, base + "/submit.php")
            t = raw.decode("utf-8", "replace")
        except Exception as e:
            last = f"{base}: {e}"
            continue
        if status != 200 or ("submit" not in t.lower()):
            last = f"{base}: status={status} len={len(t)}"
            continue
        final_base = re.match(r"^(https?://[^/]+)", final).group(1)
        print(f"=== {key} base={base} final_base={final_base} status={status} len={len(t)}")
        ttl = re.search(r"<title>([^<]*)", t)
        print("   title:", (ttl.group(1).strip()[:90] if ttl else "?"))
        for m in re.finditer(r"<option[^>]*value=\"([^\"]*)\"[^>]*>([^<]*)", t):
            v, lab = m.group(1), m.group(2)
            if re.search(r"cook|food|recipe|kitchen|beverage|drink|wine|home|restaur", lab, re.I):
                print(f"   CATOPT {v} | {lab.replace('&nbsp;', ' ').strip()}")
        names = sorted(set(re.findall(r"<input[^>]*name=\"([^\"]+)\"", t, re.I)))
        print("   inputs:", names[:32])
        for h in re.findall(r"<input[^>]*type=\"hidden\"[^>]*>", t, re.I)[:18]:
            n = re.search(r'name="([^"]+)"', h)
            v = re.search(r'value="([^"]*)"', h)
            print("   hidden:", n.group(1) if n else "?", "=", (v.group(1)[:60] if v else ""))
        # radios
        for m in re.finditer(r"<input[^>]*name=\"LINK_TYPE\"[^>]*>", t, re.I):
            v = re.search(r'value="([^"]*)"', m.group(0))
            print("   LINK_TYPE radio:", v.group(1) if v else "?")
        # JS category tree?
        if re.search(r"update_categ_selection", t):
            print(f"   JS CATEGORY TREE detected -> drill: tree {final_base}/categ-tree.php <id>")
        m = re.search(r'name="IMAGEHASH"[^>]*value="([^"]+)"', t)
        has_captcha = bool(re.search(r"captcha", t, re.I))
        ih = m.group(1) if m else None
        if has_captcha:
            cu = f"{final_base}/captcha.php" + (f"?imagehash={ih}" if ih else "")
            try:
                st, img, _ = get(op, cu, referer=final_base + "/submit.php")
                (TMP / f"pd10_{key}_captcha.png").write_bytes(img)
                print(f"   captcha GET {st} {len(img)}B -> /tmp/pd10_{key}_captcha.png")
            except Exception as e:
                print("   captcha error:", e)
        else:
            print("   no captcha on page")
        json.dump({"IMAGEHASH": ih, "final_base": final_base}, hf(key).open("w"))
        pagef(key).write_text(t, encoding="utf-8")
        cj.save(ignore_discard=True)
        print("   jar + page saved")
        return
    print(f"=== {key} PROBE FAILED: {last}")
    sys.exit(2)


def tree(base, cid):
    op, _ = opener("tree")
    status, raw, _ = get(op, f"{base}/categ-tree.php?categID={cid}")
    page = raw.decode("utf-8", "replace")
    print(f"categ-tree {cid} -> {status} len={len(page)}")
    items = re.findall(r'class="categ-item[^"]*"\s+title="([^"]*)"[^>]*onclick="update_categ_selection\((\d+)', page)
    if not items:
        items = re.findall(r'title="([^"]*)"[^>]*update_categ_selection\((\d+)', page)
    for lab, i in items:
        print(f"   id={i} | {lab}")
    return page


def post(key, code, cat=None):
    cfg = SITES[key]
    meta = json.load(hf(key).open())
    ih, final_base = meta["IMAGEHASH"], meta["final_base"]
    submit = final_base + "/submit.php"
    limit = int(cfg["desc_limit"])
    pool = [DESC_LONG, DESC_MED, DESC_SHORT]
    desc = next((d for d in pool if len(d) <= limit), DESC_SHORT[:limit])
    page = pagef(key).read_text(encoding="utf-8")
    names = set(re.findall(r'<[^>]+name="([^"]+)"', page))
    op, cj = opener(key, load=True)
    fields = {}
    # build from every named field on the saved page, then overwrite the known ones
    for n in names:
        if re.match(r"^(ot\d+|social|ot_)", n, re.I):
            continue
        fields[n] = ""
    fields.update({
        "LINK_TYPE": "normal",
        "TITLE": TITLE,
        "URL": URL,
        "DESCRIPTION": desc,
        "OWNER_NAME": OWNER_NAME,
        "OWNER_EMAIL": OWNER_EMAIL,
        cfg_cat_field(page): cat or DEFAULT_CATEGORY,
        "AGREERULES": "on",
    })
    if "DESCRIPTION_limit" in names:
        fields["DESCRIPTION_limit"] = str(limit)
    if "META_KEYWORDS" in names:
        fields["META_KEYWORDS"] = META_KEYWORDS
    if "META_DESCRIPTION" in names:
        fields["META_DESCRIPTION"] = META_DESCRIPTION[:250]
    if "META_DESCRIPTION_limit" in names:
        fields["META_DESCRIPTION_limit"] = "250"
    if ih:
        fields["IMAGEHASH"] = ih
    if "CAPTCHA" in names or ih:
        fields["CAPTCHA"] = code.strip()
    # submit button field (must be posted; phpLD silently re-renders without it)
    mbtn = re.search(r'<input[^>]*name="(submit|continue)"[^>]*value="([^"]*)"', page, re.I)
    if mbtn:
        fields[mbtn.group(1)] = mbtn.group(2)
    else:
        fields["submit"] = "Continue"
    for n in ("formSubmitted", "choicemade"):
        if n in names:
            fields[n] = "1"
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(submit, data=data, headers={
        "User-Agent": UA, "Referer": submit, "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with op.open(req, timeout=60) as r:
            body = r.read().decode("utf-8", "replace")
            status = r.status
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        status = e.code
    markers = ["Link submitted", "awaiting approval", "pending review", "We got your submission",
               "thank you", "in the review queue"]
    ok = any(mk.lower() in body.lower() for mk in markers)
    paid = bool(re.search(r"link payment|unit price|paypal|expected_amount", body, re.I))
    msgs = re.findall(r'class="msg"[^>]*>(.*?)</', body, re.S)
    errs = re.findall(r'class="errForm"[^>]*>(.*?)</span>', body, re.S)
    clean = lambda s: re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", s)).strip()[:170]
    print(f"POST {key} status={status} len={len(body)} SUCCESS={ok} PAID_PAGE={paid} cat={fields.get('CATEGORY_ID')}")
    print("   msgs:", [clean(x) for x in msgs][:4])
    print("   errors:", [clean(x) for x in errs][:8])
    resf(key).write_text(body, encoding="utf-8")
    sys.exit(0 if (ok and not paid) else 2)


def cfg_cat_field(page):
    m = re.search(r'name="(CATEGORY_ID\d?)"', page)
    return m.group(1) if m else "CATEGORY_ID"


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    mode, key = sys.argv[1], sys.argv[2]
    if mode == "probe":
        probe(key)
    elif mode == "tree":
        tree(key, sys.argv[3])
    elif mode == "post":
        post(key, sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)
    else:
        print(__doc__)
