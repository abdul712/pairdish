#!/usr/bin/env python3
"""Run-17 captcha segmentation: print a column ink profile so glyph boxes can be cut precisely."""
import sys
from PIL import Image, ImageOps

src = sys.argv[1]
im = Image.open(src).convert("L")
im = ImageOps.autocontrast(im)
w, h = im.size
px = im.load()
cols = []
for x in range(w):
    ink = sum(1 for y in range(h) if px[x, y] < 128)
    cols.append(ink)
# print a compact profile
line = "".join("#" if c > h * 0.35 else ("+" if c > h * 0.15 else ("." if c > 0 else " ")) for c in cols)
print(f"size {w}x{h}")
print(line)
# suggest boundaries at near-empty columns
gaps = [x for x in range(1, w - 1) if cols[x] <= 1 and cols[x - 1] <= 1 and cols[x + 1] <= 1]
print("near-empty columns:", gaps)
