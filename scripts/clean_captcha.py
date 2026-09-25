#!/usr/bin/env python3
"""Clean + upscale a phpLD captcha for a second vision read (PIL only; no numpy here).
Usage: python3 scripts/clean_captcha.py <in.png> <out.png> [threshold]
"""
import sys
from PIL import Image, ImageFilter, ImageOps

src, dst = sys.argv[1], sys.argv[2]
thr = int(sys.argv[3]) if len(sys.argv) > 3 else 110

im = Image.open(src).convert("L")
im = im.filter(ImageFilter.MedianFilter(3))
im = ImageOps.autocontrast(im)
bw = im.point(lambda p: 0 if p < thr else 255)
w, h = bw.size
bw = bw.resize((w * 5, h * 5), Image.LANCZOS)
bw.save(dst)
print(f"{src} {Image.open(src).size} -> {dst} {bw.size} thr={thr}")
