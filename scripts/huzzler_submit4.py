#!/usr/bin/env python3
"""Huzzler product POST v4: short_description <=100 chars + required logo upload.
Logo: 512x512 PNG generated with PIL (text 'PD' on food-palette bg) - original work."""
import io
import re
import subprocess
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) PairDish-directory/1.0"
CJ = "/tmp/hz_cookies2.txt"
HZ = "https://huzzler.so"

# 1) logo via PIL (original, no AI, no living beings)
from PIL import Image, ImageDraw, ImageFont
img = Image.new("RGB", (512, 512), "#F4A63C")
d = ImageDraw.Draw(img)
# simple plate motif: white circle + smaller inner circle
d.ellipse([76, 76, 436, 436], fill="#FFFFFF")
d.ellipse([136, 136, 376, 376], outline="#F4A63C", width=18)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 150)
except Exception:
    font = ImageFont.load_default()
d.text((256, 256), "PD", font=font, fill="#7A4A1B", anchor="mm")
img.save("/tmp/pairdish_logo.png", "PNG")
print("logo bytes:", Path("/tmp/pairdish_logo.png").stat().st_size)

# 2) fresh token + post
r = subprocess.run(["curl", "-s", "--max-time", "60", "-A", UA, "-b", CJ, "-c", CJ, "-L", HZ + "/products/create"],
                   capture_output=True, text=True, timeout=90)
h = r.stdout
tokv = re.search(r'name="_token" value="([^"]+)"', h).group(1)

short = "Free food pairing toolkit: pairing finder, calculators, and guides."
boundary = "----PairDishForm9d2c"
parts = []


def add_field(k, v):
    parts.append(f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode())


for k, v in [
    ("_token", tokv),
    ("project_category_id", "36"),
    ("name", "PairDish"),
    ("url", "https://pairdish.com"),
    ("short_description", short),
]:
    add_field(k, v)
desc = ("<p>PairDish helps home cooks answer the daily question \u201cwhat should I serve with this?\u201d "
        "with interactive tools \u2014 a flavor pairing finder, cheese board builder, buffet and party "
        "quantity calculators, recipe nutrition and macro calculators, and a weekly meal-prep planner. "
        "Its pairing guides combine practical tables, portion math, and citations to official sources "
        "like USDA MyPlate and FSIS food-safety charts. Free to use, no signup required.</p>")
add_field("description", desc)
logo = Path("/tmp/pairdish_logo.png").read_bytes()
parts.append(b"--" + boundary.encode() + b"\r\nContent-Disposition: form-data; name=\"logo\"; filename=\"pairdish-logo.png\"\r\nContent-Type: image/png\r\n\r\n")
parts.append(logo)
parts.append(b"\r\n--" + boundary.encode() + b"--\r\n")
body = b"".join(parts)
Path("/tmp/hz_body4.bin").write_bytes(body)
print("body bytes:", len(body))

p = subprocess.run(
    ["curl", "-sS", "--max-time", "120", "-A", UA, "-b", CJ, "-c", CJ,
     "-e", HZ + "/products/create",
     "-H", f"X-CSRF-TOKEN: {tokv}",
     "-H", "Accept: application/json",
     "-H", f"Content-Type: multipart/form-data; boundary={boundary}",
     "-o", "/tmp/hz_product_resp4.json",
     "-w", "%{http_code}",
     "--data-binary", "@/tmp/hz_body4.bin",
     HZ + "/products"], capture_output=True, text=True, timeout=150)
print("POST http:", p.stdout, "| stderr:", p.stderr[-200:])
rp = Path("/tmp/hz_product_resp4.json")
print("resp:", rp.read_text(encoding="utf-8", errors="replace")[:500] if rp.exists() else "(no file)")