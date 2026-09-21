#!/usr/bin/env python3
"""PairDish phpLD-extension submitter — hrd / uswd / awd / gwd / iwd.

Targets (verified phpLD family, free 'Regular' listing; flow same as the 4-network):
  hrd  highrankdirectory.com      desc cap 1000
  uswd usawebsitesdirectory.com   desc cap 500
  awd  australiawebdirectory.net  desc cap 1000
  gwd  germanywebdirectory.com    desc cap 500
  iwd  italywebdirectory.net      desc cap 500

Flow: GET /submit.php (fresh jar; record final host after redirects) ->
      fetch captcha.php?imagehash=<IMAGEHASH> with the SAME jar ->
      OCR via vision -> POST fields (LINK_TYPE=normal = free Regular;
      AGREERULES=on; submit=Continue) -> success marker in class="msg".
Pitfall respected: POST must go to the FINAL https host (http->https 301
reissues urllib POSTs as GET, dropping all data silently).

Modes:
  probe <key>                 GET submit page; dump food category options; save captcha + jar + hash json
  post <key> <code> [cat_id]  load jar; POST submission; report msg/err markers
"""
import sys, re, os, json, urllib.request, urllib.parse, http.cookiejar, urllib.error

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
SITES = {
    "hrd":  {"candidates": ["https://www.highrankdirectory.com", "https://highrankdirectory.com"], "desc_limit": "1000"},
    "uswd": {"candidates": ["https://www.usawebsitesdirectory.com", "https://usawebsitesdirectory.com"], "desc_limit": "500"},
    "awd":  {"candidates": ["https://www.australiawebdirectory.net", "https://australiawebdirectory.net"], "desc_limit": "1000"},
    "gwd":  {"candidates": ["https://www.germanywebdirectory.com", "https://germanywebdirectory.com"], "desc_limit": "500"},
    "iwd":  {"candidates": ["https://www.italywebdirectory.net", "https://italywebdirectory.net"], "desc_limit": "500"},
    "twd":  {"candidates": ["https://www.turkeywebdirectory.com", "https://turkeywebdirectory.com"], "desc_limit": "500"},
    "fwd":  {"candidates": ["https://www.francewebdirectory.net", "https://francewebdirectory.net"], "desc_limit": "1000"},
}

TITLE = "PairDish - Food Pairing Tools & Guides"
URL = "https://pairdish.com/"
DESCRIPTION_FULL = (
    "PairDish helps home cooks answer the daily question \"what should I serve with this?\" with "
    "interactive tools: a flavor pairing finder backed by food-science aromatic data, cheese and "
    "chocolate pairing guides, buffet and party quantity calculators, recipe nutrition and macro "
    "calculators, and a weekly meal-prep planner. Its pairing guides combine practical tables, "
    "portion math, and citations to official sources like USDA MyPlate and FSIS food-safety "
    "charts. Free to use, no signup required.")
DESCRIPTION_SHORT = (
    "PairDish is a free food pairing toolkit for home cooks: a flavor pairing finder, cheese and "
    "chocolate pairing guides, buffet and party quantity calculators, recipe nutrition and macro "
    "calculators, and meal-prep planning tools. The guides answer \"what to serve with\" any main "
    "dish using practical tables and official-source citations. No signup required.")
META_KEYWORDS = "food pairing, cheese pairing, meal planning, nutrition calculator, what to serve with"
META_DESCRIPTION = ("Food pairing tools and guides for home cooks: flavor finder, cheese board builder, "
                    "recipe nutrition and meal-prep calculators. Free, no signup required.")
OWNER_NAME = "Abdul Rahim"
OWNER_EMAIL = "mabdulrahim+pairdish-dir7@gmail.com"
DEFAULT_CATEGORY = "297"  # shared taxonomy: Recreation & Sports > Cooking

TMP = "/tmp"


def jar_file(key):
    return f"{TMP}/pd_{key}_cookies.txt"


def hash_file(key):
    return f"{TMP}/pd_{key}_hash.json"


def make_opener(key, load=False):
    cj = http.cookiejar.LWPCookieJar(jar_file(key))
    if load and os.path.exists(jar_file(key)):
        cj.load(ignore_discard=True, ignore_expires=True)
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/xhtml+xml,*/*")]
    return op, cj


def get(op, url, referer=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    if referer:
        req.add_header("Referer", referer)
    with op.open(req, timeout=45) as r:
        return r.status, r.geturl(), r.read().decode("utf-8", "replace")


def probe(key):
    cfg = SITES[key]
    last_err = None
    for base in cfg["candidates"]:
        submit = f"{base}/submit.php"
        try:
            op, cj = make_opener(key)
            status, final_url, t = get(op, submit)
        except Exception as e:
            last_err = f"{base}: {e}"
            continue
        if status != 200 or "IMAGEHASH" not in t:
            last_err = f"{base}: status={status} len={len(t)} no IMAGEHASH"
            continue
        # record the final host we actually talk to (post goes to the same)
        final_base = re.match(r"^(https?://[^/]+)", final_url).group(1)
        print(f"=== {key} base={base} final_base={final_base} status={status} len={len(t)}")
        title = re.search(r"<title>([^<]*)", t)
        print("title:", title.group(1).strip()[:90] if title else "?")
        for m in re.finditer(r'<option[^>]*value="([^"]*)"[^>]*>([^<]*)', t):
            v, label = m.group(1), m.group(2)
            if re.search(r"cook|food|recipe|kitchen|beverage|drink|wine|home", label, re.I):
                print(f"  CATOPT {v} | {label.replace('&nbsp;', ' ').strip()}")
        names = sorted(set(re.findall(r'<input[^>]*name="([^"]+)"', t, re.I)))
        print("inputs:", names[:30])
        for h in re.findall(r"<input[^>]*type=\"hidden\"[^>]*>", t, re.I)[:16]:
            n = re.search(r'name="([^"]+)"', h)
            v = re.search(r'value="([^"]*)"', h)
            print("  hidden:", n.group(1) if n else "?", "=", (v.group(1)[:60] if v else ""))
        m = re.search(r'name="IMAGEHASH"[^>]*value="([^"]+)"', t)
        ih = m.group(1)
        req = urllib.request.Request(f"{final_base}/captcha.php?imagehash={ih}",
                                     headers={"User-Agent": UA, "Referer": submit})
        with op.open(req, timeout=45) as r:
            img = r.read()
        open(f"{TMP}/pd_{key}_captcha.png", "wb").write(img)
        json.dump({"IMAGEHASH": ih, "final_base": final_base}, open(hash_file(key), "w"))
        print(f"IMAGEHASH={ih} captcha {len(img)}B -> {TMP}/pd_{key}_captcha.png")
        cj.save(ignore_discard=True)
        open(f"{TMP}/pd_{key}_submit.html", "w").write(t)
        print("jar saved; submit page dumped")
        return
    print(f"=== {key} PROBE FAILED: {last_err}")
    sys.exit(2)


def post(key, code, cat=None):
    cfg = SITES[key]
    meta = json.load(open(hash_file(key)))
    ih, final_base = meta["IMAGEHASH"], meta["final_base"]
    submit = f"{final_base}/submit.php"
    limit = int(cfg["desc_limit"])
    desc = DESCRIPTION_FULL if len(DESCRIPTION_FULL) <= limit else DESCRIPTION_SHORT[:limit]
    op, cj = make_opener(key, load=True)
    fields = {
        "LINK_TYPE": "normal",
        "TITLE": TITLE,
        "URL": URL,
        "DESCRIPTION": desc,
        "DESCRIPTION_limit": str(limit),
        "META_KEYWORDS": META_KEYWORDS,
        "META_DESCRIPTION": META_DESCRIPTION[:250],
        "META_DESCRIPTION_limit": "250",
        "OWNER_NAME": OWNER_NAME,
        "OWNER_EMAIL": OWNER_EMAIL,
        "CATEGORY_ID": cat or DEFAULT_CATEGORY,
        "AGREERULES": "on",
        "submit": "Continue",
        "IMAGEHASH": ih,
        "CAPTCHA": code.strip(),
    }
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
    ok = "Link submitted" in body
    errs = re.findall(r'class="errForm"[^>]*>(.*?)</span>', body, re.S)
    msgs = re.findall(r'class="msg"[^>]*>(.*?)</', body, re.S)
    print(f"POST {key} status={status} len={len(body)} SUCCESS={ok}")
    print("msgs:", [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", mm)).strip()[:140] for mm in msgs][:6])
    print("errors:", [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", e2)).strip()[:140] for e2 in errs][:8])
    open(f"{TMP}/pd_{key}_result.html", "w").write(body)
    sys.exit(0 if ok else 2)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    mode, key = sys.argv[1], sys.argv[2]
    if mode == "probe":
        probe(key)
    elif mode == "post":
        post(key, sys.argv[3], sys.argv[4] if len(sys.argv) > 4 else None)
    else:
        print(__doc__)
