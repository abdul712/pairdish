#!/usr/bin/env python3
"""Probe directory submit pages: status, forms, fields (name/type/value). Saves HTML to /tmp.
Usage: python3 dir_probe.py <url> [<url> ...]
"""
import sys, re, subprocess, html as _html

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

def probe(url):
    out = subprocess.run(["curl", "-s", "-L", "--max-time", "35", "-A", UA,
                          "-c", "/tmp/dir_probe_cj.txt", "-b", "/tmp/dir_probe_cj.txt",
                          "-w", "\n@@HTTP:%{http_code} @@URL:%{url_effective}",
                          url], capture_output=True, text=True)
    body = out.stdout
    m = re.search(r"@@HTTP:(\d+) @@URL:(\S+)$", body)
    code, final = (m.group(1), m.group(2)) if m else ("?", url)
    print(f"\n===== {url}\nstatus={code} final={final} len={len(body)}")
    # save
    fn = "/tmp/probe_" + re.sub(r"[^a-z0-9]+", "_", url.lower())[:80] + ".html"
    open(fn, "w").write(body)
    print("saved:", fn)
    # forms
    for fm in re.finditer(r"<form[^>]*>", body, re.I):
        print("FORM:", fm.group(0)[:300])
    # fields (limit noise)
    fields = re.findall(r"<(input|select|textarea)\b[^>]*>", body, re.I)
    seen = []
    for tag, attrs in [(m.group(0), m.group(0)) for m in re.finditer(r"<(input|select|textarea)\b[^>]*>", body, re.I)][:80]:
        nm = re.search(r'name=["\']([^"\']+)', tag, re.I)
        ty = re.search(r'type=["\']([^"\']+)', tag, re.I)
        vl = re.search(r'value=["\']([^"\']{0,40})', tag, re.I)
        if nm:
            seen.append(f"{nm.group(1)} [{ty.group(1) if ty else 'sel/txt'}]" + (f" ={vl.group(1)}" if vl else ""))
    print("FIELDS:", "; ".join(seen[:60]))

if __name__ == "__main__":
    for u in sys.argv[1:]:
        probe(u)
