#!/usr/bin/env python3
"""Run-20: submit PairDish to exampledir.com (phpLD-5 /submit, free LINK_TYPE=1, math captcha).

Flow (verified shape, 2026-10-20 probe): GET /submit -> pick leaf Home > Cooking (id 294) ->
GET /submit?c=294 -> GET /submit?c=294&LINK_TYPE=1 renders the detail form with DO_MATH ->
POST every named field back to that URL with AGREERULES=on and the form's own continue button.

Usage: python3 scripts/dir_run20_exampledir.py submit [description-variant]
  variant: short (default) | long
"""
import html
import re
import subprocess
import sys

HOST = "https://exampledir.com"
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/126 Safari/537.36")
JARP = "/tmp/pd_exampledir.jar"
CAT = "294"  # Home > Cooking (leaf)

TITLE = "PairDish - Food Pairing Tools and What-to-Serve Guides"
SHORT = ("PairDish is a free food pairing toolkit: a flavor pairing finder, cheese board builder, "
         "nutrition and meal-prep calculators, and pairing guides that answer what to serve with any "
         "main dish. No signup needed.")
LONG = ("PairDish helps home cooks answer the daily question of what to serve with a dish. Free "
        "interactive tools include a flavor pairing finder, cheese and chocolate pairing guides, "
        "buffet and party quantity calculators, recipe nutrition and macro calculators, and a weekly "
        "meal-prep planner. The pairing guides combine practical tables, portion math and citations to "
        "official sources such as USDA FSIS food-safety charts and USDA ERS price data. Free to use, "
        "no signup required.")
EMAIL = "mabdulrahim+pairdish@gmail.com"


def get(url):
    out = subprocess.run(["curl", "-4", "-s", "--compressed", "-L", "--max-time", "40", "-A", UA,
                          "-b", JARP, "-c", JARP, "-w", "\n@@%{http_code}", url],
                         capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


def post(url, fields):
    args = []
    for k, v in fields.items():
        args += ["--data-urlencode", f"{k}={v}"]
    cmd = ["curl", "-4", "-s", "--compressed", "-L", "--max-time", "50", "-A", UA,
           "-b", JARP, "-c", JARP, "-H", "Content-Type: application/x-www-form-urlencoded",
           "-w", "\n@@%{http_code}"] + args + [url]
    out = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


def named_fields(body):
    fields = {}
    for m in re.finditer(r"<(input|select|textarea)\b([^>]*)>", body, re.I):
        attrs = m.group(2)
        nm = re.search(r'name=["\']([^"\']+)', attrs)
        if not nm:
            continue
        n = nm.group(1)
        t = re.search(r'type=["\']([^"\']+)', attrs)
        typ = t.group(1).lower() if t else ("select" if m.group(1).lower() == "select" else "text")
        val = re.search(r'value=["\']([^"\']*)', attrs)
        v = html.unescape(val.group(1)) if val else ""
        if typ in ("radio", "checkbox"):
            if "checked" in attrs.lower():
                fields[n] = v
            else:
                fields.setdefault(n, "")
        else:
            fields.setdefault(n, v)
    return fields


variant = sys.argv[2] if len(sys.argv) > 2 else "short"
DESC = LONG if variant == "long" else SHORT

code, form = get(f"{HOST}/submit?c={CAT}&LINK_TYPE=1")
print(f"detail form: {code} {len(form)}b")
# the challenge is the bold <font> immediately before the DO_MATH input, e.g. "9 + 1 = "
m = re.search(r"<font[^>]*>\s*(\d+)\s*([+\-*x])\s*(\d+)\s*=\s*</font>", form) or \
    re.search(r"(\d+)\s*([+\-*x])\s*(\d+)\s*=\s*<", form)
if not m:
    raise SystemExit("no math challenge found")
a, op, b = int(m.group(1)), m.group(2), int(m.group(3))
answer = a + b if op == "+" else a - b if op == "-" else a * b if op in "*x" else a // b
print(f"math {a}{op}{b} = {answer}")

f = named_fields(form)
f.update({
    "TITLE": TITLE,
    "URL": "https://pairdish.com",
    "DESCRIPTION": DESC,
    "OWNER_NAME": "Abdul Rahim",
    "OWNER_EMAIL": EMAIL,
    "LINK_TYPE": "1",
    "CATEGORY_ID": CAT,
    "AGREERULES": "on",
    "DO_MATH": str(answer),
    "formSubmitted": "1",
    "continue": "Continue",
})
f.pop("search", None)
f["CATEGORY_ID"] = CAT
print("posting", len(f), "fields; description", len(DESC), "chars")

code, resp = post(f"{HOST}/submit?c={CAT}&LINK_TYPE=1", f)
text = re.sub(r"<script.*?</script>", " ", resp, flags=re.S | re.I)
text = re.sub(r"<[^>]+>", " ", text)
text = re.sub(r"\s+", " ", html.unescape(text))
print(f"response {code} {len(resp)}b")
markers = ["Link submitted and awaiting approval", "is now pending review", "We got your submission",
           "already exists", "Incorrect", "Please check your math", "error", "must have"]
low = text.lower()
for mk in markers:
    if mk.lower() in low:
        i = low.find(mk.lower())
        print(f"  MARKER: {mk} -> ...{text[max(0, i-90):i+160]}...")
print("  title echoed:", TITLE[:30] in text)
with open("outreach/run20_exampledir_response.html", "w", encoding="utf-8") as fh:
    fh.write(resp)
