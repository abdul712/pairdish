#!/usr/bin/env python3
"""Probe the Divi 'Premium Free Web Directory' /submit-site/ vein (untried hosts)."""
import re, subprocess
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
HOSTS = ["latesttopdirectory.org", "freedirectory-listings.org", "linkdirectorylistings.org"]
for host in HOSTS:
    for path in ("/submit-site/", "/submit/"):
        url = "https://" + host + path
        out = subprocess.run(["curl", "-4", "-s", "-L", "--compressed", "--max-time", "25", "-A", UA,
                              "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                             encoding="utf-8", errors="replace").stdout
        body, _, code = out.rpartition("\n@@")
        cap = re.search(r'data-first_digit="(\d+)"[^>]*data-second_digit="(\d+)"', body)
        radios = re.findall(r'et_pb_contact_type_\d+[^>]*value="([^"]{0,50})"', body)
        print(f"{host:30s} {path:14s} {code.strip()} len={len(body):7d} "
              f"divi={'et_pb_contact' in body} math={cap.groups() if cap else None} radios={radios[:4]}")
