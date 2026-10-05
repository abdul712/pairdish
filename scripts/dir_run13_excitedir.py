#!/usr/bin/env python3
"""Run-13 directory submitter — excitedirectory.com (phpLD URL-param wizard served at
/submit.php, not /submit; no captcha on step 3).

Flow:
  GET  /submit.php                       -> whole category tree
  GET  /submit.php?c=<cat>               -> step 2 (LINK_TYPE radios; free = the label with "free")
  GET  /submit.php?c=<cat>&LINK_TYPE=1   -> step 3 detail form
  POST urlencoded every named field back to the step-3 URL

Modes: probe ex | post ex
"""
import html
import http.cookiejar
import importlib.util
import json
import pathlib
import re
import socket
import sys
import urllib.parse
import urllib.request

_orig = socket.getaddrinfo
socket.getaddrinfo = lambda h, p, f=0, *a, **k: _orig(h, p, socket.AF_INET, *a, **k)

ROOT = pathlib.Path(__file__).resolve().parent.parent
TMP = pathlib.Path("/tmp")

_spec = importlib.util.spec_from_file_location("pd10", ROOT / "scripts/dir_run10_phpld.py")
pd10 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(pd10)

UA = pd10.UA
TITLE, URL, DESC = pd10.TITLE, pd10.URL, pd10.DESC_MED
OWNER_NAME = "Abdul Rahim"
OWNER_EMAIL = "mabdulrahim+pairdish-dir13@gmail.com"

BASE = "https://www.excitedirectory.com"
PATH = "/submit.php"
CAT = "113"  # Cooking (191-option tree: 29 Food and Drink, 113 Cooking, 156 Food and Related Products)

SUCCESS = ("Link submitted", "awaiting approval", "pending review", "successfully submitted",
           "Thank you", "already exists in our database")

JAR = TMP / "pd13_ex_jar.txt"
PAGE = TMP / "pd13_ex_step3.html"
META = TMP / "pd13_ex_meta.json"


def opener(load=False):
    cj = http.cookiejar.LWPCookieJar(str(JAR))
    if load and JAR.exists():
        cj.load(ignore_discard=True, ignore_expires=True)
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
    op.addheaders = [("User-Agent", UA), ("Accept", "text/html,application/xhtml+xml,*/*"),
                     ("Accept-Language", "en-US,en;q=0.9")]
    return op, cj


def get(op, url, referer=None):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    if referer:
        req.add_header("Referer", referer)
    with op.open(req, timeout=45) as r:
        return r.status, r.read().decode("utf-8", "replace"), r.geturl()


def free_link_type(step2_html):
    for m in re.finditer(r'<input type="radio" name="LINK_TYPE" value="([^"]+)"[^>]*>(.{0,400})',
                         step2_html, re.S):
        val, snip = m.group(1), html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", m.group(2)))).strip().lower()
        if "free" in snip and "premium" not in snip[:60] and "$" not in snip[:40]:
            return val
    return None


def fields_from_step3(page):
    out = {}
    for m in re.finditer(r"<(input|select|textarea)\b([^>]*)>", page, re.I):
        attrs = m.group(2)
        n = re.search(r'name="([^"]+)"', attrs, re.I)
        if not n:
            continue
        name = n.group(1)
        v = re.search(r'value="([^"]*)"', attrs, re.I)
        typ = (re.search(r'type="([^"]*)"', attrs, re.I) or [None, "text"])[1].lower()
        if typ in ("submit", "button", "image"):
            out[name] = html.unescape(v.group(1)) if v else "Continue"
        elif typ == "checkbox":
            out[name] = "on"
        else:
            out[name] = html.unescape(v.group(1)) if v else ""
    return out


def probe():
    op, cj = opener()
    st, t, final = get(op, BASE + PATH)
    fb = re.match(r"^(https?://[^/]+)", final).group(1)
    cats = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', t, re.S)
    hit = [(v, html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", lab))).strip())
           for v, lab in cats
           if re.search(r"(?<![A-Za-z])(Cooking|Food)(?![A-Za-z])",
                        html.unescape(lab).replace("\xa0", " "))]
    cat = CAT
    print(f"=== step1 status={st} base={fb} options={len(cats)} food={hit[:3]}")
    st2, s2, _ = get(op, f"{fb}{PATH}?c={cat}", referer=fb + PATH)
    lt = free_link_type(s2)
    print(f"   step2 status={st2} free LINK_TYPE={lt}")
    st3, s3, u3 = get(op, f"{fb}{PATH}?c={cat}&LINK_TYPE={lt}", referer=f"{fb}{PATH}?c={cat}")
    PAGE.write_text(s3, encoding="utf-8")
    META.write_text(json.dumps({"base": fb, "cat": cat, "link_type": lt,
                                "step3_url": f"{fb}{PATH}?c={cat}&LINK_TYPE={lt}"}))
    print(f"   step3 status={st3} size={len(s3)} captcha={bool(re.search(chr(34)+'IMAGEHASH'+chr(34), s3))}")
    print("   fields:", sorted(fields_from_step3(s3))[:22])
    cj.save(ignore_discard=True)


def post():
    meta = json.loads(META.read_text())
    page = PAGE.read_text(encoding="utf-8")
    op, _ = opener(load=True)
    data = fields_from_step3(page)
    data.update({
        "TITLE": TITLE, "URL": URL, "DESCRIPTION": DESC,
        "OWNER_NAME": OWNER_NAME, "OWNER_EMAIL": OWNER_EMAIL,
        "CATEGORY_ID": meta["cat"], "LINK_TYPE": meta["link_type"],
        "formSubmitted": "1", "AGREERULES": "on", "continue": "Continue",
        "RECPR_URL": "", "RECPR_TEXT": "", "ADDRESS": "", "PHONE_NUMBER": "",
        "OWNER_NEWSLETTER_ALLOW": "",
    })
    data.pop("search", None)
    req = urllib.request.Request(meta["step3_url"], data=urllib.parse.urlencode(data).encode(),
                                 headers={"User-Agent": UA,
                                          "Content-Type": "application/x-www-form-urlencoded",
                                          "Referer": meta["step3_url"]})
    with op.open(req, timeout=45) as r:
        out = r.read().decode("utf-8", "replace")
    (TMP / "pd13_ex_result.html").write_text(out, encoding="utf-8")
    print(f"=== POST -> {r.status} len={len(out)}")
    snip = re.search(r".{0,160}(Link submitted|awaiting approval|pending review|successfully submitted|Thank you|already exists in our database).{0,140}",
                     out, re.S | re.I)
    print("   marker:", re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", snip.group(0))).strip()[:280]
          if snip else "NONE")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
    elif sys.argv[1] == "probe":
        probe()
    elif sys.argv[1] == "post":
        post()
    else:
        print(__doc__)
