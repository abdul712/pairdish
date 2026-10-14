#!/usr/bin/env python3
"""Run-17 glyph crop: slice a captcha into per-character cells and upscale each for a decisive read.

Usage: python3 scripts/run17_captcha_crop.py <in.png> <out_prefix> <n_chars>
"""
import sys
from PIL import Image, ImageOps

src, pref, n = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert("L")
im = ImageOps.autocontrast(im)
w, h = im.size
step = w / n
for i in range(n):
    x0 = int(i * step)
    x1 = int((i + 1) * step)
    cell = im.crop((max(0, x0 - 3), 0, min(w, x1 + 3), h))
    cell = cell.resize((cell.width * 8, cell.height * 8), Image.LANCZOS)
    cell.save(f"{pref}_char{i+1}.png")
print("wrote", ", ".join(f"{pref}_char{i+1}.png" for i in range(n)))
