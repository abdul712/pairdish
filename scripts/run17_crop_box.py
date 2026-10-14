#!/usr/bin/env python3
"""Run-17 single-glyph crop by explicit pixel box (no even-split assumption).

Usage: python3 scripts/run17_crop_box.py <in.png> <out.png> <x0> <x1> [<y0> <y1>] [scale]
"""
import sys
from PIL import Image, ImageOps

src, dst, x0, x1 = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
y0, y1 = (int(sys.argv[5]), int(sys.argv[6])) if len(sys.argv) > 6 else (0, 0)
scale = int(sys.argv[7]) if len(sys.argv) > 7 else 8

im = Image.open(src).convert("L")
if y1 == 0:
    y1 = im.height
im = ImageOps.autocontrast(im.crop((x0, y0, x1, y1)))
w, h = im.size
im = im.resize((w * scale, h * scale), Image.LANCZOS)
im.save(dst)
print(f"{src} crop=({x0},{y0},{x1},{y1}) -> {dst} {im.size}")
