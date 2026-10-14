#!/usr/bin/env python3
"""Run-17 PairDish: phpLD-5 `/submit` URL-param wizard submitters (directory4.org, upsdirectory.com).

These two hosts are proven free-tier phpLD-5 installs from another campaign (they approved within
minutes there) and are UNTRACKED for pairdish. Cloned from the run-16 addfreewebdirectory flow,
which is this same vein:

  GET  <base>/submit                    -> category <select>
  GET  <base>/submit?c=<cat>            -> LINK_TYPE radios (read the LABELS; free tier varies:
                                           value 1 = "Link - free" on installs that use 1-7)
  GET  <base>/submit?c=<cat>&LINK_TYPE=<free>
                                        -> detail form (TITLE / URL / DESCRIPTION / OWNER_* /
                                           RECPR_* / DO_MATH arithmetic / AGREERULES / continue)
  POST back to that same step-3 URL with AGREERULES=on + continue=Continue + formSubmitted=1.

IPv6 egress breaks this family (REMOTE_ADDR into a varchar column) -> force AF_INET.
Success re-renders an EMPTY form with no marker on some installs: the duplicate-title retry
("already exists in our database") is the proof an entry was created. Never log a failure
before the retry has answered.

Usage:
  python3 scripts/dir_run17_phpld5.py probe <host-key>
  python3 scripts/dir_run17_phpld5.py cats  <host-key>
  python3 scripts/dir_run17_phpld5.py post  <host-key> <cat> <free-value>
"""
import http.cookiejar
import html
import pathlib
import re
import socket
import sys
import urllib.parse
import urllib.request

_gai = socket.getaddrinfo
socket.getaddrinfo = lambda h, p, family=0, type=0, proto=0, flags=0: _gai(h, p, socket.AF_INET, type, proto, flags)

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

HOSTS = {
    "d4": "https://www.directory4.org",
    "ups": "https://www.upsdirectory.com",
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
EMAIL = "mabdulrahim+pairdish-r17b@gmail.com"
FOOD_RE = re.compile(r"cook|food|recipe|kitchen|gastronom|culinar|home|drink|bever|health|restaurant", re.I)


def paths(key):
    d = pathlib.Path("/tmp")
    return (d / f"pd17_{key}.jar", d / f"pd17_{key}_p1.html",
            d / f"pd17_{key}_p2.html", d / f"pd17_{key}_p3.html", d / f"pd17_{key}_result.html")


def opener(key, load=True):
    jar = paths(key)[0]
    cj = http.cookiejar.LWPCookieJar(str(jar))
    if load and jar.exists():
        try:
            cj.load(ignore_discard=True, ignore_expires=True)
        except Exception:
            pass
    return urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj)), cj


def get(url, key, save=None, base=""):
    op, cj = opener(key)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*",
                                               "Referer": base + "/submit"})
    with op.open(req, timeout=35) as r:
        data = r.read()
    cj.save(ignore_discard=True, ignore_expires=True)
    if save:
        pathlib.Path(save).write_bytes(data)
    return r.geturl(), data.decode("utf-8", "replace")


def submit_path(base):
    """phpLD-5 serves /submit on some installs and /submit.php on others; find the live one."""
    for suffix in ("/submit", "/submit.php"):
        try:
            final, page = get(base + suffix, "detect", base=base)
        except Exception as e:
            print(f"  {suffix}: {type(e).__name__} {e}")
            continue
        if "LINK_TYPE" in page or "CATEGORY_ID" in page:
            print(f"  live submit path: {suffix} -> {final} ({len(page)} chars)")
            return suffix
    return None


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
    for m in re.finditer(r"<textarea\b[^>]*name=[\"']([^\"']+)[\"'][^>]*>", page, re.I):
        out[m.group(1)] = ""
    for m in re.finditer(r"<select\b[^>]*name=[\"']([^\"']+)[\"'][^>]*>", page, re.I):
        out.setdefault(m.group(1), "0")
    return out


def radios(page):
    out = []
    for m in re.finditer(r'<input[^>]*type=["\']radio["\'][^>]*>', page, re.I):
        tag = m.group(0)
        n = re.search(r'name=["\']([^"\']+)["\']', tag)
        v = re.search(r'value=["\']([^"\']*)["\']', tag)
        if n and v and n.group(1).upper() == "LINK_TYPE":
            tail = re.sub(r"<[^>]+>", " ", page[m.end():m.end() + 160])
            out.append((v.group(1), re.sub(r"\s+", " ", tail).strip()[:80]))
    return out


def solve_math(page):
    for pat in (r"(\d+)\s*\+\s*(\d+)\s*=", r"(\d+)\s*[x*]\s*(\d+)\s*=", r"(\d+)\s*-\s*(\d+)\s*="):
        m = re.search(pat, re.sub(r"<[^>]+>", " ", page))
        if m:
            a, b = int(m.group(1)), int(m.group(2))
            op = "+" if "+" in m.group(0) else ("x" if ("x" in m.group(0) or "*" in m.group(0)) else "-")
            return str(a + b if op == "+" else (a * b if op == "x" else a - b)), m.group(0)
    return None, None


def main():
    mode, key = sys.argv[1], sys.argv[2]
    base = HOSTS[key]
    jar, p1, p2, p3, res = paths(key)

    if mode == "detect":
        sp = submit_path(base)
        print(f"{base}: submit suffix = {sp}")
        return

    if mode in ("probe", "cats"):
        sp = "/submit"
        url = base + sp
        _, page = get(url, key, save=p1, base=base)
        pathlib.Path(f"/tmp/pd17_{key}_subpath.txt").write_text(sp)
        print(f"GET {url} -> {len(page)} chars")
        print("  fields:", sorted(fields(page).keys()))
        for m in re.finditer(r"<option[^>]*value=[\"']([^\"']+)[\"'][^>]*>([^<]*)</option>", page, re.I):
            label = html.unescape(m.group(2)).replace("\xa0", " ").strip()
            if FOOD_RE.search(label):
                print(f"   cat {m.group(1):>6s}  {label[:60]}")
        if mode == "probe":
            fs = fields(page)
            cat = next((v for k, v in fs.items() if k.upper().startswith("CATEGORY_ID") and v not in ("", "0")), None)
            print("  CATEGORY_ID default:", cat)
            for v, lab in radios(page):
                print(f"   radio {v!r}: {lab}")
        return

    if mode == "step2":
        cat = sys.argv[3]
        _, page = get(f"{base}/submit?c={cat}", key, save=p2, base=base)
        print(f"GET /submit?c={cat} -> {len(page)} chars")
        for v, lab in radios(page):
            print(f"   radio {v!r}: {lab}")
        return

    if mode == "captcha":
        # GET step 3 (fresh), save the page, then fetch the captcha IMAGE with the SAME jar.
        # Never re-GET between OCR and POST: the IMAGEHASH is minted per GET.
        cat, free = sys.argv[3], sys.argv[4]
        url = f"{base}/submit?c={cat}&LINK_TYPE={free}"
        _, page = get(url, key, save=p3, base=base)
        pathlib.Path(f"/tmp/pd17_{key}_step3url.txt").write_text(url)
        h = re.search(r'name=["\']IMAGEHASH["\'][^>]*value=["\']([^"\']+)', page)
        print(f"GET {url} -> {len(page)} chars | IMAGEHASH={h.group(1) if h else None}")
        caps = re.findall(r'<img[^>]*src=["\']([^"\']*captcha[^"\']*)["\']', page, re.I)
        print("  captcha srcs:", caps)
        if caps:
            csrc = html.unescape(caps[0])
            curl = csrc if csrc.startswith("http") else base + ("/" + csrc.lstrip("/"))
            # ONE raw fetch, saved as bytes: a second request for the same phrase returns
            # "Could not fetch image phrase!" because the phrase is consumed per request.
            op, cj = opener(key)
            req = urllib.request.Request(curl, headers={"User-Agent": UA, "Referer": url,
                                                        "Accept": "image/*,*/*"})
            with op.open(req, timeout=30) as r:
                png = r.read()
            cj.save(ignore_discard=True, ignore_expires=True)
            pathlib.Path(f"/tmp/pd17_{key}_cap.png").write_bytes(png)
            print(f"  captcha image {len(png)} bytes -> /tmp/pd17_{key}_cap.png")
        return

    if mode == "post-imagehash":
        # POST against the SAVED step-3 page + saved jar (the hash must still be valid).
        code = sys.argv[3]
        url = pathlib.Path(f"/tmp/pd17_{key}_step3url.txt").read_text().strip()
        page = p3.read_text("utf-8", "replace")
        f = fields(page)
        h = re.search(r'name=["\']IMAGEHASH["\'][^>]*value=["\']([^"\']+)', page)
        f["IMAGEHASH"] = h.group(1) if h else f.get("IMAGEHASH", "")
        f["CAPTCHA"] = code
        f.update({"LINK_TYPE": f.get("LINK_TYPE", "1"), "TITLE": TITLE, "URL": URL,
                  "DESCRIPTION": DESC, "OWNER_NAME": OWNER, "OWNER_EMAIL": EMAIL,
                  "RECPR_URL": "", "RECPR_TEXT": "", "AGREERULES": "on",
                  "formSubmitted": "1", "continue": "Continue"})
        for k in list(f):
            if k.startswith("ADD_CATEGORY_ID"):
                f[k] = f.get("CATEGORY_ID") or "203"
        body = urllib.parse.urlencode(f).encode()
        op, cj = opener(key)
        req = urllib.request.Request(url, data=body, headers={
            "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded",
            "Referer": url, "Accept": "text/html,*/*"})
        with op.open(req, timeout=45) as r:
            out = r.read().decode("utf-8", "replace")
            cj.save(ignore_discard=True, ignore_expires=True)
            print(f"POST {url} -> {r.status} len={len(out)} final={r.geturl()}")
        res.write_text(out, encoding="utf-8")
        for mk in ("Link submitted", "awaiting approval", "pending review", "already exists",
                   "We got your submission", "Incorrect code", "CAPTCHA:", "errForm"):
            if mk.lower() in out.lower():
                i = out.lower().find(mk.lower())
                print(f"  MARKER {mk!r}: {re.sub(r'<[^>]+>', ' ', out[max(0, i - 120):i + 220]).strip()[:260]}")
        print("  TITLE echoed:", TITLE in out)
        return

    if mode == "post":
        cat, free = sys.argv[3], sys.argv[4]
        url = f"{base}/submit?c={cat}&LINK_TYPE={free}"
        _, page = get(url, key, save=p3, base=base)
        f = fields(page)
        ans, expr = solve_math(page)
        print(f"GET {url} -> {len(page)} chars | DO_MATH {expr!r} -> {ans}")
        f.update({"LINK_TYPE": free, "TITLE": TITLE, "URL": URL, "CATEGORY_ID": cat,
                  "DESCRIPTION": DESC, "OWNER_NAME": OWNER, "OWNER_EMAIL": EMAIL,
                  "RECPR_URL": "", "RECPR_TEXT": "", "DO_MATH": ans or "",
                  "AGREERULES": "on", "formSubmitted": "1", "continue": "Continue"})
        for k in list(f):
            if k.startswith("ADD_CATEGORY_ID"):
                f[k] = cat
        body = urllib.parse.urlencode(f).encode()
        op, cj = opener(key)
        req = urllib.request.Request(url, data=body, headers={
            "User-Agent": UA, "Content-Type": "application/x-www-form-urlencoded",
            "Referer": url, "Accept": "text/html,*/*"})
        with op.open(req, timeout=45) as r:
            out = r.read().decode("utf-8", "replace")
            cj.save(ignore_discard=True, ignore_expires=True)
            print(f"POST {url} -> {r.status} len={len(out)} final={r.geturl()}")
        res.write_text(out, encoding="utf-8")
        for mk in ("Link submitted", "awaiting approval", "pending review", "already exists",
                   "We got your submission", "Please Check Your Math", "Incorrect", "errForm",
                   "recaptcha", "agreement"):
            if mk.lower() in out.lower():
                i = out.lower().find(mk.lower())
                print(f"  MARKER {mk!r}: {re.sub(r'<[^>]+>', ' ', out[max(0, i - 120):i + 200]).strip()[:260]}")
        print("  TITLE echoed:", TITLE in out, "| empty TITLE input:", 'name="TITLE" value=""' in out)
        return

    raise SystemExit("unknown mode")


if __name__ == "__main__":
    main()
