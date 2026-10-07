#!/usr/bin/env python3
"""Run-14 PairDish: phpLD-4 bare-captcha family submitters (athenelinks / brestlinks / abicloud).

Template facts (verified in prior campaigns):
  - /submit.php renders the whole form; the captcha is a bare /captcha.php IMAGE bound to the
    session cookie (NO IMAGEHASH hidden field).
  - The free tier radio value is `free` ("Regular Reviews"), NOT `normal` (that is a paid
    "Fast Reviews" => PayPal page). Read the labels off the saved page before posting.
  - IPv6 egress makes the DB write fail with "Data too long for column 'IPADDRESS'" -> force AF_INET.
  - Success marker: class="msg" "Link submitted and awaiting approval."
  - athenelinks additionally requires an email confirmation before the listing shows.

Modes:
  probe <key>   GET /submit.php (jar) + GET /captcha.php (same jar) -> save page + PNG
  cats  <key>   print food/cooking-ish category options from the saved page
  post  <key> <code>
"""
import http.cookiejar
import html
import os
import pathlib
import re
import socket
import sys
import urllib.parse
import urllib.request

if os.environ.get("PD_IPV4", "1") == "1":
    _gai = socket.getaddrinfo

    def _af_inet_only(host, port, family=0, type=0, proto=0, flags=0):
        return _gai(host, port, socket.AF_INET, type, proto, flags)

    socket.getaddrinfo = _af_inet_only

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

SITES = {
    "athene": {"base": "https://www.athenelinks.com", "cat": "185"},
    "brestlinks": {"base": "https://brestlinks.com", "cat": "185"},
    "abicloud": {"base": "https://abicloud.org", "cat": "185"},
}

TITLE = "PairDish - Food Pairing Tools & Recipe Calculators"
URL = "https://pairdish.com/"
DESC = ("PairDish is a free kitchen toolkit for food pairing and recipe planning: a flavor pairing "
        "finder, recipe nutrition calculator, macro and protein calculators, meal prep and grocery "
        "list builders, cheese board, buffet and potluck planners, plus more than 30 other cooking "
        "tools. The guides cover what to serve with popular dishes, with portion math and "
        "official-source nutrition data from the FDA and USDA FoodData Central. No signup required; "
        "everything runs in the browser.")
OWNER = "PairDish"
EMAIL = "mabdulrahim+pairdish-r14@gmail.com"
FOOD_RE = re.compile(r"cook|food|recipe|kitchen|gastronom|culinar|home|drink|bever|health", re.I)


def paths(key):
    d = pathlib.Path("/tmp")
    return d / f"pd14_{key}.jar", d / f"pd14_{key}_submit.html", d / f"pd14_{key}_result.html"


def opener(key, load=False):
    jar, _, _ = paths(key)
    cj = http.cookiejar.LWPCookieJar(str(jar))
    if load and jar.exists():
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception:
            pass
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj


def get(url, key, save=None, load=True):
    op, cj = opener(key, load=load)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    with op.open(req, timeout=30) as r:
        data = r.read()
    cj.save(ignore_discard=True, ignore_expires=True)
    if save:
        pathlib.Path(save).write_bytes(data)
    return r.geturl(), data


def fields(page):
    out = {}
    for m in re.finditer(r"<input\b[^>]*>", page, re.I):
        tag = m.group(0)
        n = re.search(r'name=["\']([^"\']+)["\']', tag)
        if not n:
            continue
        v = re.search(r'value=["\']([^"\']*)["\']', tag)
        t = re.search(r'type=["\']([^"\']+)["\']', tag)
        out[n.group(1)] = v.group(1) if v else (("on" if t and t.group(1).lower() == "checkbox" else ""))
    for m in re.finditer(r"<textarea\b[^>]*name=[\"']([^\"']+)[\"'][^>]*>(.*?)</textarea>", page, re.I | re.S):
        out[m.group(1)] = ""
    for m in re.finditer(r"<select\b[^>]*name=[\"']([^\"']+)[\"'][^>]*>.*?</select>", page, re.I | re.S):
        out.setdefault(m.group(1), "0")
    return out


def radios(page):
    out = []
    for m in re.finditer(r'<input[^>]*type=["\']radio["\'][^>]*>', page, re.I):
        tag = m.group(0)
        n = re.search(r'name=["\']([^"\']+)["\']', tag)
        v = re.search(r'value=["\']([^"\']*)["\']', tag)
        if n and v and n.group(1).upper() == "LINK_TYPE":
            out.append(v.group(1))
    return out


def main():
    mode, key = sys.argv[1], sys.argv[2]
    base = SITES[key]["base"]
    jar, submit_path, result_path = paths(key)

    if mode == "probe":
        url = base + "/submit.php"
        try:
            final, data = get(url, key, save=submit_path, load=False)
        except Exception as e:
            print(f"PROBE FAIL {url}: {type(e).__name__} {e}")
            return
        page = data.decode("utf-8", "replace")
        f = fields(page)
        print(f"GET {url} -> {final} {len(page)} chars")
        print(f"  fields: {sorted(f.keys())}")
        print(f"  LINK_TYPE radios: {radios(page)}")
        caps = re.findall(r'<img[^>]*src=["\']([^"\']*captcha[^"\']*)["\']', page, re.I)
        print(f"  captcha srcs: {caps}")
        if not caps:
            return
        csrc = caps[0]
        curl = csrc if csrc.startswith("http") else base + ("/" + csrc.lstrip("/"))
        try:
            _, png = get(curl, key, save=f"/tmp/pd14_{key}_captcha.png", load=True)
            print(f"GET captcha -> {len(png)} bytes -> /tmp/pd14_{key}_captcha.png")
        except Exception as e:
            print(f"CAPTCHA FAIL: {type(e).__name__} {e}")
            return
        # labels for the free tier
        for m in re.finditer(r'<input[^>]*type=["\']radio["\'][^>]*>([^<]{0,80})', page, re.I):
            print("   radio:", re.sub(r"\s+", " ", m.group(0))[:130])
        return

    if mode == "cats":
        page = submit_path.read_text("utf-8", "replace")
        for m in re.finditer(r"<option[^>]*value=[\"']([^\"']+)[\"'][^>]*>([^<]*)</option>", page, re.I):
            label = html.unescape(m.group(2)).replace("\xa0", " ").strip()
            if FOOD_RE.search(label):
                print(f"  {m.group(1):>6s}  {label[:60]}")
        return

    if mode == "post":
        code = sys.argv[3]
        page = submit_path.read_text("utf-8", "replace")
        f = fields(page)
        free = SITES[key].get("free", "free")
        f["TITLE"] = TITLE
        f["URL"] = URL
        f["DESCRIPTION"] = DESC[:1000]
        f["OWNER_NAME"] = OWNER
        f["OWNER_EMAIL"] = EMAIL
        f["LINK_TYPE"] = free
        if "CATEGORY_ID" in f and SITES[key]["cat"] != "0":
            f["CATEGORY_ID"] = SITES[key]["cat"]
        f["CAPTCHA"] = code
        for k in ("AGREERULES", "agreerules"):
            if k in f:
                f[k] = "on"
        if "formSubmitted" in f:
            f["formSubmitted"] = "1"
        for k in list(f):
            if k.lower() in ("submit", "continue"):
                f[k] = "Continue"
        body = urllib.parse.urlencode(f).encode()
        op, cj = opener(key, load=True)
        req = urllib.request.Request(base + "/submit.php", data=body, headers={
            "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded",
            "Referer": base + "/submit.php"})
        try:
            with op.open(req, timeout=40) as r:
                out = r.read().decode("utf-8", "replace")
        except Exception as e:
            print(f"POST FAIL: {type(e).__name__} {e}")
            return
        cj.save(ignore_discard=True, ignore_expires=True)
        result_path.write_text(out, encoding="utf-8")
        print(f"POST -> {len(out)} chars -> {result_path}")
        for marker in ("Link submitted and awaiting approval", "Link submitted.",
                       "awaiting approval", "pending review", "Incorrect code", "Invalid code",
                       "link payment", "Unit Price"):
            if marker.lower() in out.lower():
                print(f"  MARKER: {marker}")
        m = re.search(r'class=["\']msg["\'][^>]*>(.*?)</', out, re.S | re.I)
        if m:
            print("  msg block:", re.sub(r"<[^>]+>", " ", m.group(1)).strip()[:200])
        return

    raise SystemExit("unknown mode")


if __name__ == "__main__":
    main()
