#!/usr/bin/env python3
"""Run-16: extract the exact cited figures from the verified official sources."""
import re, subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"


def text(url):
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "35", "-A", UA, url],
                       capture_output=True, text=True)
    h = re.sub(r"<script.*?</script>", " ", r.stdout, flags=re.S)
    h = re.sub(r"<style.*?</style>", " ", h, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", h)
    return re.sub(r"\s+", " ", t)


def ctx(t, pat, before=180, after=420, n=3):
    out = []
    for m in list(re.finditer(pat, t, re.I))[:n]:
        out.append(t[max(0, m.start() - before): m.start() + after])
    return out


print("=" * 70, "\n1) 21 CFR 101.9(c)(1)(i) general calorie factors")
t = text("https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9")
for c in ctx(t, r"general factors", before=120, after=700, n=2):
    print("   ...", c, "\n")

print("=" * 70, "\n2) ODPHP dietary guidelines page — macronutrient context")
t = text("https://odphp.health.gov/our-work/nutrition-physical-activity/dietary-guidelines")
for c in ctx(t, r"macronutrient", before=120, after=500, n=3):
    print("   ...", c, "\n")

print("=" * 70, "\n3) USU Extension — sweetener potency table")
t = text("https://extension.usu.edu/preserve-the-harvest/research/reduced-sugar-preservation")
for c in ctx(t, r"Maple Syrup", before=1500, after=900, n=1):
    print("   ...", c, "\n")

print("=" * 70, "\n4) OSU Extension — sweeteners: nutritive / non-nutritive")
t = text("https://extension.oregonstate.edu/food/preservation/sweeteners-nutritive-non-nutritive")
for c in ctx(t, r"honey", before=150, after=600, n=3):
    print("   ...", c, "\n")

print("=" * 70, "\n5) Penn State Extension — preserving herbs by drying (fresh/dried/powdered + storage)")
t = text("https://extension.psu.edu/preserving-herbs-by-drying")
for c in ctx(t, r"1 Tablespoon fresh", before=200, after=500, n=2):
    print("   ...", c, "\n")

print("=" * 70, "\n6) CSU Extension — ingredient substitutions rows we may cite")
t = text("https://extension.colostate.edu/resource/ingredient-substitutions/")
for k in ("Herbs, fresh", "Maple syrup", "Honey", "Allspice", "Pumpkin pie spice"):
    for c in ctx(t, re.escape(k), before=60, after=220, n=1):
        print(f"   [{k}] ...", c, "\n")
