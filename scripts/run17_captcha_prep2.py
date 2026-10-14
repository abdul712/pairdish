#!/usr/bin/env python3
"""Run-17 captcha prep variant B: median-filter smoothing (speckle removal) + upscale, no threshold.

Usage: python3 scripts/run17_captcha_prep2.py <in.png> <out.png> [median_size] [scale]
"""
import sys
from PIL import Image, ImageFilter, ImageOps

src, dst = sys.argv[1], sys.argv[2]
med = int(sys.argv[3]) if len(sys.argv) > 3 else 5
scale = int(sys.argv[4]) if len(sys.argv) > 4 else 4

im = Image.open(src).convert("L")
im = im.filter(ImageFilter.MedianFilter(med))
im = ImageOps.autocontrast(im)
im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
im.save(dst)
print(f"{src} -> {dst} {im.size} median={med}")
