#!/usr/bin/env python3
"""Run-12 phpLD-5 URL-param wizard submitter for the two hosts surfaced by run-12 sibling-ack
mining and never tried by pairdish:

  hulu  huludirectory.com           free tier LINK_TYPE=1 ("Link - free"), DO_MATH challenge
  mwd   marketingwebdirectory.com   free tier LINK_TYPE=1 ("Link - free"), 5-char IMAGEHASH captcha

Wizard flow (same family as excitedirectory.com, verified for this class):
  GET  /submit                -> whole category tree in <select name="ADD_CATEGORY_ID[]">
  GET  /submit?c=<cat>        -> step 2, LINK_TYPE radios (read the LABEL before posting: the
                                 free tier is a per-install value, never assume "normal")
  GET  /submit?c=<cat>&LINK_TYPE=<free>  -> step 3 (detail fields + challenge)
  POST urlencoded to the step-3 URL with every named field from the saved page

Modes:
  probe <key>            GET step 3, save page + jar (+ captcha png when the install has one)
  tree  <key> <categID>  dump the category select options matching a keyword
  post  <key> <code>     POST; <code> is the OCR'd captcha (mwd) or "-" (hulu, DO_MATH solved here)

Set PD_IPV4=1 to force AF_INET (phpLD writes REMOTE_ADDR into a varchar column; IPv6 egress
fails the INSERT with "Data too long for column 'IPADDRESS'").
"""
import html
import http.cookiejar
import importlib.util
import json
import os
import pathlib
import re
import socket
import sys
import urllib.parse
import urllib.request

if os.environ.get("PD_IPV4") == "1":
    _orig = socket.getaddrinfo

    def _afinet(host, port, family=0, *a, **kw):
        return _orig(host, port, socket.AF_INET, *a, **kw)

    socket.getaddrinfo = _afinet

ROOT = pathlib.Path(__file__).resolve().parent.parent
TMP = pathlib.Path("/tmp")

_spec = importlib.util.spec_from_file_location("pd10", ROOT / "scripts/dir_run10_phpld.py")
pd10 = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(pd10)

UA = pd10.UA
TITLE, URL, DESC = pd10.TITLE, pd10.URL, pd10.DESC_MED
OWNER_NAME = "Abdul Rahim"
OWNER_EMAIL = "mabdulrahim+pairdish-dir12@gmail.com"

SITES = {
    "hulu": {"bases": ["https://huludirectory.com", "https://www.huludirectory.com"],
             "cat": "297"},
    "mwd": {"bases": ["https://www.marketingwebdirectory.com", "https://marketingwebdirectory.com"],
            "cat": "297"},
}

SUCCESS = ("Link submitted", "awaiting approval", "pending review", "successfully submitted",
           "Thank you")


def jarf(k):
    return TMP / f"pd12_{k}_jar.txt"


def pagef(k):
    return TMP / f"pd12_{k}_step3.html"


def metaf(k):
    return TMP / f"pd12_{k}_meta.json"


def opener(key, load=False):
    cj = http.cookiejar.LWPCookieJar(str(jarf(key)))
    if load and jarf(key).exists():
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
        return r.status, r.read(), r.geturl()


def free_link_type(step2_html):
    """Return the LINK_TYPE value whose label says free and does not say premium/paid."""
    for m in re.finditer(r'<input type="radio" name="LINK_TYPE" value="([^"]+)"[^>]*>(.{0,400})',
                         step2_html, re.S):
        val, snip = m.group(1), re.sub(r"<[^>]+>", " ", m.group(2))
        snip = html.unescape(re.sub(r"\s+", " ", snip)).strip().lower()
        if "free" in snip and "premium" not in snip[:60] and "$" not in snip[:40]:
            return val
    return None


def fields_from_step3(page):
    """Every named field on the saved step-3 page, with our values overwritten."""
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
            v = re.search(r'value="([^"]*)"', attrs, re.I)
            out[name] = html.unescape(v.group(1)) if v else "Continue"
        elif typ == "checkbox":
            out[name] = "on"
        elif m.group(1).lower() == "select":
            out[name] = html.unescape(v.group(1)) if v else ""
        else:
            out[name] = html.unescape(v.group(1)) if v else ""
    return out


def probe(key):
    cfg = SITES[key]
    for base in cfg["bases"]:
        try:
            op, cj = opener(key)
            st, raw, final = get(op, base + "/submit")
            t = raw.decode("utf-8", "replace")
        except Exception as e:
            print(f"   {base}: {e}")
            continue
        if st != 200:
            print(f"   {base}: status={st}")
            continue
        final_base = re.match(r"^(https?://[^/]+)", final).group(1)
        cats = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', t, re.S)
        hit = [(v, html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", lab))).strip())
               for v, lab in cats
               if re.search(r"(?<![A-Za-z])Cooking(?![A-Za-z])", html.unescape(lab).replace("\xa0", " "))]
        print(f"=== {key} base={final_base} step1 status={st} options={len(cats)}")
        print("   cooking options:", hit[:3] or "none")
        cat = hit[0][0] if hit else cfg["cat"]
        st2, raw2, _ = get(op, f"{final_base}/submit?c={cat}", referer=final_base + "/submit")
        s2 = raw2.decode("utf-8", "replace")
        lt = free_link_type(s2)
        print(f"   step2 status={st2} free LINK_TYPE={lt}")
        st3, raw3, url3 = get(op, f"{final_base}/submit?c={cat}&LINK_TYPE={lt}",
                              referer=f"{final_base}/submit?c={cat}")
        s3 = raw3.decode("utf-8", "replace")
        pagef(key).write_text(s3, encoding="utf-8")
        math_m = re.search(r"DO THE MATH.{0,400}?(\d+)\s*\+\s*(\d+)", s3, re.S)
        ih = re.search(r'name="IMAGEHASH"[^>]*value="([^"]+)"', s3)
        has_cap = bool(ih)
        meta = {"final_base": final_base, "cat": cat, "link_type": lt, "status": st3,
                "math": (int(math_m.group(1)) + int(math_m.group(2))) if math_m else None,
                "imagehash": ih.group(1) if ih else None,
                "step3_url": f"{final_base}/submit?c={cat}&LINK_TYPE={lt}"}
        metaf(key).write_text(json.dumps(meta), encoding="utf-8")
        print(f"   step3 status={st3} size={len(s3)} math={meta['math']} captcha={has_cap}")
        print("   fields:", sorted(fields_from_step3(s3))[:24])
        if has_cap:
            cu = f"{final_base}/captcha.php?imagehash={ih.group(1)}"
            cst, img, _ = get(op, cu, referer=meta["step3_url"])
            (TMP / f"pd12_{key}_captcha.png").write_bytes(img)
            print(f"   captcha GET {cst} {len(img)}B -> /tmp/pd12_{key}_captcha.png")
        cj.save(ignore_discard=True)
        print("   jar + page saved")
        return
    print(f"=== {key} PROBE FAILED (no reachable /submit)")


def post(key, code):
    meta = json.loads(metaf(key).read_text())
    page = pagef(key).read_text(encoding="utf-8")
    op, _ = opener(key, load=True)
    data = fields_from_step3(page)
    data.update({
        "TITLE": TITLE, "URL": URL, "DESCRIPTION": DESC,
        "OWNER_NAME": OWNER_NAME, "OWNER_EMAIL": OWNER_EMAIL,
        "CATEGORY_ID": meta["cat"], "LINK_TYPE": meta["link_type"],
        "formSubmitted": "1", "AGREERULES": "on", "continue": "Continue",
        "RECPR_URL": "", "OWNER_NEWSLETTER_ALLOW": "",
    })
    data.pop("search", None)
    if meta.get("math") is not None:
        data["DO_MATH"] = str(meta["math"])
    if meta.get("imagehash"):
        data["CAPTCHA"] = code
        data["IMAGEHASH"] = meta["imagehash"]
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(meta["step3_url"], data=body, headers={
        "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded",
        "Referer": meta["step3_url"]})
    with op.open(req, timeout=45) as r:
        out = r.read().decode("utf-8", "replace")
    print(f"=== {key} POST -> {r.status} len={len(out)}")
    ok = [m for m in SUCCESS if m.lower() in out.lower()]
    if ok:
        snip = re.search(r'.{0,200}(Link submitted|awaiting approval|pending review|successfully submitted|Thank you).{0,120}',
                         out, re.S | re.I)
        print("   SUCCESS marker:", re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", snip.group(0))).strip()[:260] if snip else ok)
    else:
        errs = re.findall(r'class="[^"]*(?:msg|error|errForm)[^"]*"[^>]*>(.{0,200})', out, re.S | re.I)
        print("   NO success marker. error blocks:", [re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", e)).strip()[:160] for e in errs[:3]])
        print("   saved result ->", TMP / f"pd12_{key}_result.html")
    (TMP / f"pd12_{key}_result.html").write_text(out, encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(0)
    mode, key = sys.argv[1], sys.argv[2]
    if mode == "probe":
        probe(key)
    elif mode == "post":
        post(key, sys.argv[3] if len(sys.argv) > 3 else "-")
    else:
        print(__doc__)
