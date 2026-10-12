#!/usr/bin/env python3
"""Run-16 directory probe: GET <host>/submit.php with a persisted cookie jar and dump the
phpLD signature — free-tier radios with their labels, IMAGEHASH, captcha URL, category options
with the food/cooking match, and the description cap.

Usage: python3 scripts/dir_run16_probe.py <host>        e.g. addfreewebdirectory.com
"""
import http.cookiejar
import html
import pathlib
import re
import socket
import sys
import urllib.request

if True:  # force IPv4: this phpLD family writes REMOTE_ADDR into a varchar column
    _gai = socket.getaddrinfo

    def _af_inet_only(host, port, family=0, type=0, proto=0, flags=0):
        return _gai(host, port, socket.AF_INET, type, proto, flags)

    socket.getaddrinfo = _af_inet_only

UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0.0.0 Safari/537.36")

host = sys.argv[1]
KEY = re.sub(r"[^a-z0-9]", "", host.lower())[:18]
jar_p = pathlib.Path(f"/tmp/pd16_{KEY}.jar")
page_p = pathlib.Path(f"/tmp/pd16_{KEY}_submit.html")

cj = http.cookiejar.LWPCookieJar(str(jar_p))
op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
url = f"https://www.{host}/submit.php"
req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
try:
    with op.open(req, timeout=35) as r:
        data = r.read()
        final = r.geturl()
        code = r.status
except Exception as e:
    print(f"ERR {url} -> {e}")
    raise SystemExit(1)
cj.save(ignore_discard=True, ignore_expires=True)
page_p.write_bytes(data)
page = data.decode("utf-8", "replace")

print(f"GET {url} -> {code} final={final} len={len(page)}")

radios = re.findall(r'<input[^>]*type=["\']radio["\'][^>]*>', page, re.I)
print(f"\nradios ({len(radios)}):")
for tag in radios:
    name = re.search(r'name=["\']([^"\']+)', tag)
    val = re.search(r'value=["\']([^"\']*)', tag)
    idx = page.find(tag)
    tail = html.unescape(re.sub(r"<[^>]+>", " ", page[idx:idx + 400]))
    tail = re.sub(r"\s+", " ", tail).strip()
    print(f"   {name.group(1) if name else '?'}={val.group(1) if val else ''!r} :: {tail[:150]}")

print("\nIMAGEHASH:", bool(re.search(r'name=["\']IMAGEHASH["\']', page, re.I)))
for m in re.finditer(r'(captcha[^"\'\s>]*)', page, re.I):
    print("   captcha ref:", m.group(1))
    break

print("\nhidden inputs:")
for m in re.finditer(r'<input[^>]*type=["\']hidden["\'][^>]*>', page, re.I):
    tag = m.group(0)
    n = re.search(r'name=["\']([^"\']+)', tag)
    v = re.search(r'value=["\']([^"\']*)', tag)
    print(f"   {n.group(1) if n else '?'} = {(v.group(1) if v else '')[:40]}")

lim = re.search(r'DESCRIPTION_limit["\'][^>]*value=["\']?(\d+)', page, re.I)
print("\nDESCRIPTION_limit:", lim.group(1) if lim else "not found")

print("\nfood/cooking-ish category options:")
for m in re.finditer(r'<option[^>]*value=["\']([^"\']*)["\'][^>]*>(.*?)</option>', page, re.S | re.I):
    label = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", m.group(2)))).replace("\xa0", " ").strip()
    if re.search(r"cook|food|recipe|kitchen|gastronom|culinar|drink|bever|home", label, re.I):
        print(f"   {m.group(1)} :: {label[:90]}")
print(f"\nsaved: {page_p}  jar: {jar_p}")
