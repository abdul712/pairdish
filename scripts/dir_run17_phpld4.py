#!/usr/bin/env python3
"""Run-17 PairDish: phpLD-4 bare-captcha family submitter for caida.eu.

caida.eu surfaced in the run-17 mail sweep as the only UNTRACKED directory host with a fresh
ack in the shared mailbox ("Action Required: Confirm your link submission at Caida Web
Directory", 2026-10-12). The family template is already proven for this campaign
(athenelinks / abicloud / brestlinks):
  - /submit.php renders the whole form; the captcha is a bare /captcha.php IMAGE bound to the
    session cookie (NO IMAGEHASH hidden field);
  - free tier radio value is `free` ("Regular Reviews"), NOT `normal` (paid "Fast Reviews");
  - IPv6 egress fails the DB write ("Data too long for column 'IPADDRESS'") -> force AF_INET;
  - success marker: class="msg" "Link submitted and awaiting approval.".

Modes: probe <key> | radios <key> | cats <key> | post <key> <code>
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
    "caida": {"bases": ["https://www.caida.eu", "https://caida.eu"], "cat": "185", "free": "free"},
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
EMAIL = "mabdulrahim+pairdish-r17@gmail.com"
FOOD_RE = re.compile(r"cook|food|recipe|kitchen|gastronom|culinar|home|drink|bever|health", re.I)


def paths(key):
    d = pathlib.Path("/tmp")
    return d / f"pd17_{key}.jar", d / f"pd17_{key}_submit.html", d / f"pd17_{key}_result.html", d / f"pd17_{key}_base.txt"


def opener(key, load=False):
    jar, _, _, _ = paths(key)
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


def main():
    mode, key = sys.argv[1], sys.argv[2]
    jar, submit_path, result_path, base_path = paths(key)

    if mode == "probe":
        for base in SITES[key]["bases"]:
            url = base + "/submit.php"
            try:
                final, data = get(url, key, save=submit_path, load=False)
            except Exception as e:
                print(f"probe {url}: {type(e).__name__} {e}")
                continue
            page = data.decode("utf-8", "replace")
            base_path.write_text(final.rsplit("/submit.php", 1)[0], encoding="utf-8")
            print(f"GET {url} -> {final} {len(page)} chars  [base={base}]")
            print(f"  fields: {sorted(fields(page).keys())}")
            for m in re.finditer(r'<input[^>]*type=["\']radio["\'][^>]*>', page, re.I):
                tail = page[m.end():m.end() + 90]
                print("   radio:", re.sub(r"\s+", " ", m.group(0))[:110], "|", re.sub(r"<[^>]+>", "", tail)[:60].strip())
            caps = re.findall(r'<img[^>]*src=["\']([^"\']*captcha[^"\']*)["\']', page, re.I)
            print(f"  captcha srcs: {caps}")
            if caps:
                csrc = caps[0]
                curl = csrc if csrc.startswith("http") else base + ("/" + csrc.lstrip("/"))
                try:
                    _, png = get(curl, key, save=f"/tmp/pd17_{key}_captcha.png", load=True)
                    print(f"GET captcha -> {len(png)} bytes -> /tmp/pd17_{key}_captcha.png")
                except Exception as e:
                    print(f"CAPTCHA FAIL: {type(e).__name__} {e}")
            return
        print("no /submit.php reachable on any base host")
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
        base = base_path.read_text().strip()
        page = submit_path.read_text("utf-8", "replace")
        f = fields(page)
        f["TITLE"] = TITLE
        f["URL"] = URL
        f["DESCRIPTION"] = DESC[:1000]
        f["OWNER_NAME"] = OWNER
        f["OWNER_EMAIL"] = EMAIL
        f["LINK_TYPE"] = SITES[key].get("free", "free")
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
        print(f"POST {base}/submit.php -> {len(out)} chars -> {result_path}")
        for marker in ("Link submitted and awaiting approval", "Link submitted.", "awaiting approval",
                       "pending review", "Incorrect code", "Invalid code", "already exists",
                       "link payment", "Unit Price", "Data too long"):
            if marker.lower() in out.lower():
                print(f"  MARKER: {marker}")
        m = re.search(r'class=["\']msg["\'][^>]*>(.*?)</', out, re.S | re.I)
        if m:
            print("  msg block:", re.sub(r"<[^>]+>", " ", m.group(1)).strip()[:200])
        return

    raise SystemExit("unknown mode")


if __name__ == "__main__":
    main()
