#!/usr/bin/env python3
"""Run-17 URL + legacy-status probe. Read-only. No redirects followed for status class."""
import subprocess, sys

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

def head(url):
    out = subprocess.run(["curl", "-s", "-o", "/dev/null", "-D", "-", "--max-time", "20", "-A", UA, url],
                         capture_output=True, text=True).stdout
    lines = [l.strip() for l in out.splitlines() if l.strip()]
    code = lines[0].split(" ", 1)[1] if lines else "?"
    loc = ""
    for l in lines:
        if l.lower().startswith("location:"):
            loc = l.split(":", 1)[1].strip()
    return code, loc

LEGACY = [
    "/what-to-serve-with-philly-cheesesteak/",
    "/what-to-serve-with-schnitzel/",
    "/what-to-serve-with-pork-loin/",
    "/what-to-serve-with-garlic-shrimp/",
    "/what-to-serve-with-lentil-soup/",
    "/what-to-serve-with-paella/",
    "/what-to-serve-with-fried-fish/",
    "/what-to-serve-with-roasted-potatoes/",
    "/what-to-serve-with-pesto-chicken/",
]
print("== legacy root URLs ==")
for p in LEGACY:
    c, l = head("https://pairdish.com" + p)
    print(f"  {c:4s} {p:45s} {l}")

if len(sys.argv) > 1:
    print("== extra ==")
    for p in sys.argv[1:]:
        c, l = head("https://pairdish.com" + p)
        print(f"  {c:4s} {p:45s} {l}")
