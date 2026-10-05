#!/usr/bin/env python3
"""Run-13 directory candidate probe: for each host, try /submit and /submit.php, report the
phpLD signature (category count, free LINK_TYPE radio, step-3 challenge). Prints only; no POST.

Usage: PD_IPV4=1 python3 scripts/dir_run13_probe.py
"""
import html
import http.cookiejar
import importlib.util
import pathlib
import re
import socket
import sys
import urllib.request

_orig = socket.getaddrinfo
socket.getaddrinfo = lambda h, p, f=0, *a, **k: _orig(h, p, socket.AF_INET, *a, **k)

ROOT = pathlib.Path(__file__).resolve().parent.parent
_spec = importlib.util.spec_from_file_location("w12", ROOT / "scripts/dir_run12_wizard.py")
w = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(w)
UA = w.UA

HOSTS = ["excitedirectory.com", "upsdirectory.com", "directory4.org"]


def get(op, url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with op.open(req, timeout=45) as r:
        return r.status, r.read().decode("utf-8", "replace"), r.geturl()


for host in HOSTS:
    for base in (f"https://www.{host}", f"https://{host}"):
        for path in ("/submit", "/submit.php"):
            try:
                cj = http.cookiejar.LWPCookieJar()
                op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
                st, t, final = get(op, base + path)
            except Exception as e:
                print(f"{base+path}: ERR {e}")
                continue
            if st != 200 or "LINK_TYPE" not in t:
                print(f"{base+path}: status={st} phpld={'LINK_TYPE' in t}")
                continue
            fb = re.match(r"^(https?://[^/]+)", final).group(1)
            cats = re.findall(r'<option[^>]*value="([^"]*)"[^>]*>(.*?)</option>', t, re.S)
            cook = [(v, html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", lab))).strip())
                    for v, lab in cats
                    if re.search(r"(?<![A-Za-z])(Cooking|Food)(?![A-Za-z])",
                                 html.unescape(lab).replace("\xa0", " "))]
            print(f"=== {base+path} -> {fb} cats={len(cats)} food/cooking={cook[:3]}")
            cat = cook[0][0] if cook else (cats[0][0] if cats else "0")
            st2, s2, _ = get(op, f"{fb}{path}?c={cat}")
            lt = w.free_link_type(s2)
            print(f"    step2 status={st2} free_LINK_TYPE={lt}")
            if lt:
                st3, s3, u3 = get(op, f"{fb}{path}?c={cat}&LINK_TYPE={lt}")
                ih = re.search(r'name="IMAGEHASH"[^>]*value="([^"]+)"', s3)
                mm = re.search(r"(\d+)\s*\+\s*(\d+)\s*=", s3)
                print(f"    step3 status={st3} size={len(s3)} captcha={bool(ih)} math={mm.groups() if mm else None}")
                print("    fields:", sorted(set(re.findall(r'name="([^"]+)"', s3)))[:20])
        break
