#!/usr/bin/env python3
"""Run-20 directory attempt: exampledir.com (phpLD-5 /submit variant, free LINK_TYPE=1).

Probe mode lists the category options that look food-related so the leaf id is read from the
install's own tree, then prints the step-2 radios. `post <cat> <math>` runs the submission.
"""
import html
import http.cookiejar
import re
import subprocess
import sys
import urllib.parse

HOST = "https://exampledir.com"
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126 Safari/537.36")
JAR = http.cookiejar.CookieJar()


def get(url, use_jar=True):
    cmd = ["curl", "-4", "-s", "--compressed", "-L", "--max-time", "35", "-A", UA]
    if use_jar:
        cmd += ["-b", "/tmp/pd_exampledir.jar", "-c", "/tmp/pd_exampledir.jar"]
    cmd += ["-w", "\n@@%{http_code}", url]
    out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


def post(url, fields):
    args = []
    for k, v in fields.items():
        args += ["--data-urlencode", f"{k}={v}"]
    cmd = ["curl", "-4", "-s", "--compressed", "-L", "--max-time", "45", "-A", UA,
           "-b", "/tmp/pd_exampledir.jar", "-c", "/tmp/pd_exampledir.jar",
           "-H", "Content-Type: application/x-www-form-urlencoded", "-w", "\n@@%{http_code}"]
    cmd += args + [url]
    out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


def named_fields(body):
    fields = {}
    for m in re.finditer(r"<(input|select|textarea)\b([^>]*)>", body, re.I):
        attrs = m.group(2)
        name = re.search(r'name=["\']([^"\']+)', attrs)
        if not name:
            continue
        n = name.group(1)
        t = re.search(r'type=["\']([^"\']+)', attrs)
        typ = (t.group(1).lower() if t else ("select" if m.group(1).lower() == "select" else "text"))
        val = re.search(r'value=["\']([^"\']*)', attrs)
        v = html.unescape(val.group(1)) if val else ""
        if typ in ("checkbox", "radio"):
            checked = "checked" in attrs.lower()
            if checked:
                fields[n] = v
            else:
                fields.setdefault(n, "")
        else:
            fields.setdefault(n, v)
    return fields


mode = sys.argv[1] if len(sys.argv) > 1 else "probe"

code, base = get(f"{HOST}/submit")
print("GET /submit ->", code, len(base), "bytes")
if code != "200":
    raise SystemExit("submit page not reachable")

# category options, if the tree is in the page
opts = re.findall(r'<option value="(\d+)"[^>]*>([^<]*)</option>', base)
food = [(i, re.sub(r"\s+", " ", html.unescape(t)).strip()) for i, t in opts
        if re.search(r"cook|food|recipe|kitchen|culinar|gastron", t, re.I)]
print(f"options={len(opts)} food-ish={len(food)}")
for i, t in food[:20]:
    print("   ", i, t)

if mode == "probe":
    # also look for the hidden LINK_TYPE + math challenge shape
    print("LINK_TYPE present:", "LINK_TYPE" in base, "| DO_MATH present:", "DO_MATH" in base)
    raise SystemExit(0)

cat = sys.argv[2]
code, step2 = get(f"{HOST}/submit?c={cat}")
print("GET step2 ->", code, len(step2), "bytes")
radios = re.findall(r'<input[^>]+name=["\']LINK_TYPE["\'][^>]*>', step2)
for r in radios:
    val = re.search(r'value=["\']([^"\']*)', r)
    lbl = re.search(r"<label[^>]*>(.*?)</label>", step2[step2.find(r):step2.find(r) + 900], re.S)
    lab = re.sub(r"<[^>]+>", "", lbl.group(1)) if lbl else ""
    print("   radio", val.group(1) if val else "?", "|", re.sub(r"\s+", " ", html.unescape(lab)).strip()[:60])

if mode == "step2":
    raise SystemExit(0)

code, form = get(f"{HOST}/submit?c={cat}&LINK_TYPE=1")
print("GET detail form ->", code, len(form), "bytes")
if "DO_MATH" not in form and "TITLE" not in form:
    code, form = get(f"{HOST}/submit.php?c={cat}&LINK_TYPE=1")
    print("GET /submit.php detail form ->", code, len(form), "bytes")

m = re.search(r'(\d+)\s*([+\-*x])\s*(\d+)\s*=?', form)
print("math hint:", m.group(0) if m else "none")
fields = named_fields(form)
print("field count:", len(fields))
print("keys:", sorted(fields)[:25])
