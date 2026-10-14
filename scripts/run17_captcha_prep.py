#!/usr/bin/env python3
"""Run-17 captcha prep: mild (autocontrast + upscale, no hard threshold) and heavy variants.

Usage: python3 scripts/run17_captcha_prep.py <in.png> <out_prefix>
"""
import sys
from PIL import Image, ImageFilter, ImageOps

src, pref = sys.argv[1], sys.argv[2]
im = Image.open(src).convert("L")
print("size", im.size)

mild = ImageOps.autocontrast(im).resize((im.width * 4, im.height * 4), Image.LANCZOS)
mild.save(f"{pref}_mild.png")

heavy = im.filter(ImageFilter.MedianFilter(3))
heavy = ImageOps.autocontrast(heavy)
heavy = heavy.point(lambda p: 0 if p < 110 else 255)
heavy = heavy.resize((im.width * 5, im.height * 5), Image.LANCZOS)
heavy.save(f"{pref}_heavy.png")
print("wrote", f"{pref}_mild.png", f"{pref}_heavy.png")
