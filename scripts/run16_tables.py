#!/usr/bin/env python3
"""Run-16: parse the CSU substitution rows and the USU sweetener table as proper cells."""
import re, subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"


def html(u):
    return subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "35", "-A", UA, u],
                          capture_output=True, text=True).stdout


def clean(x):
    x = re.sub(r"<[^>]+>", " ", x)
    x = x.replace("&nbsp;", " ").replace("&amp;", "&").replace("&#8217;", "'")
    return re.sub(r"\s+", " ", x).strip()


print("### CSU ingredient-substitution rows (honey / maple / herbs / spices)")
h = html("https://extension.colostate.edu/resource/ingredient-substitutions/")
rows = re.findall(r"<tr[^>]*>(.*?)</tr>", h, re.S)
for r in rows:
    cells = [clean(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, re.S)]
    if cells and re.match(r"^(Honey|Maple syrup|Herbs, fresh|Mint leaves|Allspice|Pumpkin pie spice|Italian seasoning)", cells[0], re.I):
        print("   ", " | ".join(cells))

print("\n### USU Table 1 rows (sweetener table)")
h2 = html("https://extension.usu.edu/preserve-the-harvest/research/reduced-sugar-preservation")
rows = re.findall(r"<tr[^>]*>(.*?)</tr>", h2, re.S)
for r in rows:
    cells = [clean(c) for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", r, re.S)]
    if cells:
        print("   ", " | ".join(cells))
