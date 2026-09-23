#!/usr/bin/env python3
"""Run-9 PairDish: phpLD single-form submitters for three siblings the NY-tax campaign
proved submittable (fire-directory.com, ask-directory.com, freetoprankdirectory.com) --
none of them tracked by this campaign yet.

Modes:
  probe <key>            GET /submit.php (cookie jar) -> save page, dump food-ish categories
  cats  <key>            print food/cooking category ids found in the saved page
  post  <key>            POST the free Regular submission (cat from PD_CAT or cfg default)
  tree  <url> <categID>  drill a categ-tree.php AJAX tree (prolink-style)

Keys: firedir askdir ftrdir
"""
import http.cookiejar
import os
import pathlib
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

SITES = {
    "firedir": {"base": "https://fire-directory.com", "submit": "/submit.php",
                "cat": "0", "catfield": "CATEGORY_ID", "desc_limit": 1000,
                "agree": False, "meta": False, "submit_value": "Submit"},
    "askdir": {"base": "https://ask-directory.com", "submit": "/submit.php",
               "cat": "0", "catfield": "CATEGORY_ID", "desc_limit": 1000,
               "agree": False, "meta": False, "submit_value": "Submit"},
    "ftrdir": {"base": "https://www.freetoprankdirectory.com", "submit": "/submit.php",
               "cat": "0", "catfield": "CATEGORY_ID", "desc_limit": 500,
               "agree": True, "meta": True, "submit_value": "Continue"},
}

TITLE = "PairDish - Food Pairing Tools & Recipe Calculators"
URL = "https://pairdish.com/"
DESC = ("PairDish is a free kitchen toolkit for food pairing and recipe planning: a flavor pairing "
        "finder, recipe nutrition calculator, macro and protein calculators, meal prep and grocery "
        "list builders, cheese board, buffet and potluck planners, plus more than 30 other cooking "
        "tools. The guides cover what to serve with popular dishes with portion math and "
        "official-source nutrition data from the FDA and USDA FoodData Central. No signup required; "
        "everything runs in the browser.")
DESC_SHORT = ("PairDish is a free kitchen toolkit for food pairing and recipe planning: flavor pairing "
              "finder, recipe nutrition and macro calculators, meal prep and grocery list builders, "
              "cheese board and buffet planners, plus 30+ cooking tools and official-source guides.")
KEYWORDS = "food pairing, recipe nutrition calculator, meal prep calculator, flavor pairing, cooking tools"
META_DESC = "Free food pairing and recipe tools: flavor pairing finder, nutrition, macro and meal prep calculators, plus what-to-serve guides."
OWNER = "PairDish"
EMAIL = "mabdulrahim+pairdish-dir9@gmail.com"

FOOD_RE = re.compile(r"cook|food|recipe|kitchen|drink|bever|gastron|culinar|home", re.I)


def paths(key):
    d = pathlib.Path("/tmp")
    return d / f"pd9_{key}.jar", d / f"pd9_{key}_submit.html", d / f"pd9_{key}_result.html"


def opener(key, load=False):
    jar, _, _ = paths(key)
    cj = http.cookiejar.LWPCookieJar(str(jar))
    if load and jar.exists():
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception:
            pass
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA),
                     ("Accept", "text/html,application/xhtml+xml,*/*"),
                     ("Accept-Language", "en-US,en;q=0.9")]
    return op, cj


def get(op, url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with op.open(req, timeout=45) as r:
        return r.status, r.read().decode("utf-8", "replace"), r.geturl()


def probe(key):
    cfg = SITES[key]
    op, cj = opener(key)
    status, t, final = get(op, cfg["base"] + cfg["submit"])
    cj.save(ignore_discard=True)
    _, page, _ = paths(key)
    page.write_text(t, encoding="utf-8")
    print(f"[{key}] GET status={status} len={len(t)} final={final}")
    print("   IMAGEHASH:", ("IMAGEHASH" in t), "| captcha img:", bool(re.search(r'captcha', t, re.I)))
    print("   free radio:", re.findall(r'name=["\']LINK_TYPE["\'][^>]*value=["\']([^"\']+)', t)[:7])
    for m in re.finditer(r'<option[^>]*value="([^"]*)"[^>]*>([^<]{2,60})</option>', t):
        if FOOD_RE.search(m.group(2)):
            print(f"   cat option {m.group(1):>6} = {m.group(2).strip()}")
    for m in re.finditer(r'name=["\'](CATEGORY_ID\d?)["\']', t):
        print("   category field:", m.group(1))
    return t


def cats(key):
    _, page, _ = paths(key)
    t = page.read_text(encoding="utf-8")
    root = re.search(r'<div class="categ-item[^>]*onclick="update_categ_selection\((\d+)', t)
    if root:
        print(f"[{key}] JS category tree detected, top id {root.group(1)} "
              f"-- drill with: tree {SITES[key]['base']}/categ-tree.php?categID=<id>")
    return t


def tree(base, cid):
    op, _ = opener("tree")
    status, page, _ = get(op, f"{base}/categ-tree.php?categID={cid}")
    print(f"categ-tree {cid} -> {status} len={len(page)}")
    items = re.findall(r'update_categ_selection\((\d+),\s*(\d+),\s*(\d+)\)[^>]*>\s*([^<]*)', page)
    if not items:
        items = re.findall(r'title="([^"]+)"[^>]*onclick="update_categ_selection\((\d+)', page)
    for it in items[:40]:
        print("   ", it)
    return page


def post(key):
    cfg = SITES[key]
    _, page, res = paths(key)
    if not page.exists():
        raise SystemExit(f"[{key}] run probe first")
    t = page.read_text(encoding="utf-8")
    op, _ = opener(key, load=True)
    names = set(re.findall(r'<[^>]+name="([^"]+)"', t))
    cat = os.environ.get("PD_CAT", cfg["cat"])
    desc = DESC if cfg["desc_limit"] > 800 else DESC_SHORT
    fields = {
        "LINK_TYPE": "normal",
        "TITLE": TITLE,
        "URL": URL,
        "DESCRIPTION": desc[: cfg["desc_limit"]],
        "OWNER_NAME": OWNER,
        "OWNER_EMAIL": EMAIL,
        cfg["catfield"]: cat,
        "submit": cfg["submit_value"],
    }
    if "DESCRIPTION_limit" in names:
        fields["DESCRIPTION_limit"] = str(cfg["desc_limit"])
    if cfg["meta"]:
        fields["META_KEYWORDS"] = KEYWORDS
        fields["META_DESCRIPTION"] = META_DESC[:250]
        if "META_DESCRIPTION_limit" in names:
            fields["META_DESCRIPTION_limit"] = "250"
    if cfg["agree"]:
        fields["AGREERULES"] = "on"
    mbtn = re.search(r'<input[^>]*name="submit"[^>]*value="([^"]*)"', t)
    if mbtn:
        fields["submit"] = mbtn.group(1)
    # captcha, if the page has one
    mh = re.search(r'name=["\']IMAGEHASH["\'][^>]*value=["\']([^"\']+)', t)
    if mh:
        fields["IMAGEHASH"] = mh.group(1)
        print(f"[{key}] captcha present, IMAGEHASH={mh.group(1)[:12]}...")
    submit = cfg["base"] + cfg["submit"]
    data = urllib.parse.urlencode(fields).encode()
    req = urllib.request.Request(submit, data=data, headers={
        "User-Agent": UA, "Referer": submit, "Content-Type": "application/x-www-form-urlencoded"})
    try:
        with op.open(req, timeout=60) as r:
            body, status, fin = r.read().decode("utf-8", "replace"), r.status, r.geturl()
    except urllib.error.HTTPError as e:
        body, status, fin = e.read().decode("utf-8", "replace"), e.code, submit
    ok = bool(re.search(r"Link submitted|awaiting approval|pending review|thank you", body, re.I))
    msgs = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m)).strip()[:160]
            for m in re.findall(r'class="msg"[^>]*>(.*?)</', body, re.S)]
    errs = [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m)).strip()[:160]
            for m in re.findall(r'class="errForm"[^>]*>(.*?)</span>', body, re.S)]
    print(f"POST {key} status={status} final={fin} len={len(body)} SUCCESS={ok} cat={cat}")
    print("   msgs:", msgs[:4])
    print("   errors:", errs[:6])
    res.write_text(body, encoding="utf-8")
    return ok


if __name__ == "__main__":
    mode = sys.argv[1]
    if mode == "probe":
        probe(sys.argv[2])
    elif mode == "cats":
        cats(sys.argv[2])
    elif mode == "tree":
        tree(sys.argv[2], sys.argv[3])
    elif mode == "post":
        sys.exit(0 if post(sys.argv[2]) else 2)
    else:
        raise SystemExit("modes: probe|cats|tree|post")
