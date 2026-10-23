#!/usr/bin/env python3
"""Inspect phpLD submit pages: LINK_TYPE labels, captcha class, DESCRIPTION cap, category field."""
import re, subprocess, sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
HOSTS = sys.argv[1:] or ["afunnydir.com", "harddirectory.net", "steeldirectory.net",
                         "jet-links.com", "royaldirectory.biz", "directory8.org"]

for host in HOSTS:
    url = "https://" + host + "/submit.php"
    body = subprocess.run(["curl", "-4", "-s", "-L", "--compressed", "--max-time", "25", "-A", UA, url],
                          capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    print("=" * 70)
    print(f"{host}  len={len(body)}")
    for m in re.finditer(r'<input[^>]*name="LINK_TYPE"[^>]*>', body):
        tag = m.group(0)
        val = re.search(r'value="([^"]*)"', tag)
        after = body[m.end():m.end() + 260]
        label = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", after)).strip()[:90]
        print(f"  LINK_TYPE={val.group(1) if val else '?':12s} label: {label}")
    print(f"  captcha: IMAGEHASH={'IMAGEHASH' in body} captcha.php={'captcha.php' in body} "
          f"recaptcha={'recaptcha' in body.lower()} DO_MATH={'DO_MATH' in body}")
    cap = re.search(r'name="DESCRIPTION_limit"[^>]*value="?(\d+)', body)
    print(f"  DESCRIPTION_limit={cap.group(1) if cap else 'none'} "
          f"hidden CATEGORY_ID={'yes' if re.search(r'name=\"CATEGORY_ID\"[^>]*value=\"0\"', body) else 'no'} "
          f"select_categories={'ADD_CATEGORY_ID' in body}")
    cats = re.findall(r'<option[^>]*value="(\d+)"[^>]*>([^<]{0,40})', body)
    cooks = [c for c in cats if re.search(r"(?i)cook|food|recipe|gastron|küche|cuisine|baking", c[1])]
    print(f"  categories={len(cats)} food-ish: {cooks[:6]}")
