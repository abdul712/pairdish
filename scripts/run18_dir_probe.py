#!/usr/bin/env python3
"""Run-18 directory candidate probe: does the host serve a usable submit form, and is the free
tier visible without a browser? Read-only (no POSTs)."""
import re
import subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
CANDIDATES = [
    "https://wired.business/submit",
    "https://wired.business/submit-site",
    "https://wired.business/add-listing",
    "https://www.247webdirectory.com/submit.php",
    "https://www.247webdirectory.com/submit",
    "https://yo.directory/submit",
    "https://yo.directory/add",
    "https://twelve.tools/submit",
    "https://twelve.tools/submit-tool",
]


def get(url):
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "25", "-A", UA,
                        "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    body = r.stdout
    code = ""
    if "@@" in body:
        body, code = body.rsplit("@@", 1)
    return code.strip(), body


for url in CANDIDATES:
    code, body = get(url)
    title = ""
    m = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
    if m:
        title = re.sub(r"\s+", " ", m.group(1)).strip()[:60]
    forms = re.findall(r"<form[^>]*>", body, re.I)
    fields = []
    for f in forms:
        pass
    named = sorted(set(re.findall(r'<(?:input|textarea|select)[^>]*name="([^"]+)"', body)))
    codes = sorted(set(re.findall(r'name="(LINK_TYPE|CAPTCHA|IMAGEHASH|DO_MATH|AGREERULES)"', body)))
    print(f"\n{url}\n  {code} ({len(body)}b) {title}")
    print(f"  forms={len(forms)} named_fields={len(named)} {named[:14]}")
    if codes:
        print(f"  phpLD markers: {codes}")
    for kw in ("recaptcha", "turnstile", "hcaptcha", "free", "$", "price", "badge", "backlink", "login"):
        n = len(re.findall(re.escape(kw), body, re.I))
        if n and kw in ("recaptcha", "turnstile", "hcaptcha"):
            print(f"  !! {kw} x{n}")
    labels = re.findall(r"LINK_TYPE[^>]*>\s*([^<]{0,40})", body)
    if labels:
        print("  LINK_TYPE labels:", [re.sub(r"\s+", " ", x).strip() for x in labels[:8]])
