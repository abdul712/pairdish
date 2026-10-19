#!/usr/bin/env python3
"""Run-19 directory probe: two non-phpLD veins the skill lists as still working.

webdirectory.top  — Laravel /submit, JS-built categoryId, leaf ids only, desc >=150 chars, POST to APEX
iqode.com         — SPA wizard, title >=10 chars, category chips via a plain <select> change event

Probe only: report what the submit pages expose. No POST is sent unless a free tier is visible.
"""
import re
import subprocess
import sys

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126.0 Safari/537.36")


def fetch(url, extra=None):
    cmd = ["curl", "-sL", "--compressed", "--max-time", "30", "-A", UA]
    if extra:
        cmd += extra
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True, text=True, errors="replace")
    return r.stdout or ""


def summarise(name, url):
    body = fetch(url)
    print(f"== {name}  {url}  bytes={len(body)}")
    if not body:
        print("   EMPTY")
        return
    title = re.search(r"<title[^>]*>(.*?)</title>", body, re.S | re.I)
    print("   title:", (title.group(1).strip()[:90] if title else "-"))
    fields = re.findall(r'<(?:input|textarea|select)[^>]*name="([^"]+)"', body)
    print("   fields:", sorted(set(fields))[:20])
    for word in ("free", "price", "$", "paid", "cook", "food", "recipe"):
        n = len(re.findall(word, body, re.I))
        if n:
            print(f"   '{word}': {n}")
    for m in re.finditer(r"(?i)(free listing|free submission|submit your (?:site|website|link))", body):
        print("   copy:", re.sub(r"\s+", " ", body[max(0, m.start()-90):m.start()+120]))
        break
    opts = re.findall(r"<option[^>]*value=\"(\d+)\"[^>]*>([^<]{0,60})</option>", body)
    food = [(v, t.strip()) for v, t in opts if re.search(r"(?i)cook|food|recipe|kitchen|gastr", t)]
    print(f"   select options={len(opts)} food-ish={food[:8]}")


summarise("webdirectory.top", "https://webdirectory.top/submit")
summarise("iqode.com", "https://iqode.com/submit")
