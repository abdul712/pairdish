#!/usr/bin/env python3
"""Run-16: verify official candidate sources are live and carry the facts we cite. Read-only."""
import re, subprocess

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

CANDIDATES = [
    ("https://www.dietaryguidelines.gov/", ["macronutrient", "protein"]),
    ("https://odphp.health.gov/our-work/nutrition-physical-activity/dietary-guidelines", ["macronutrient", "protein"]),
    ("https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9", ["general factors", "kcal"]),
    ("https://extension.usu.edu/preserve-the-harvest/research/reduced-sugar-preservation", ["honey", "maple", "corn syrup"]),
    ("https://extension.oregonstate.edu/food/preservation/sweeteners-nutritive-non-nutritive", ["honey", "maple", "non-nutritive"]),
    ("https://extension.psu.edu/preserving-herbs-by-drying", ["1 Tablespoon fresh", "dried"]),
    ("https://extension.colostate.edu/resource/ingredient-substitutions/", ["Herbs, fresh", "Maple syrup"]),
    ("https://extension.psu.edu/canning-with-less-sugar", ["sugar substitute"]),
    ("https://www.fda.gov/food/food-additives-petitions/high-intensity-sweeteners", ["sweeteners", "GRAS"]),
    ("https://www.cdc.gov/botulism/prevention/index.html", ["honey", "younger than 1 year"]),
]

for url, phrases in CANDIDATES:
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", "30", "-A", UA,
                        "-w", "\n__CODE__%{http_code}", url], capture_output=True, text=True)
    out = r.stdout
    code = out.rsplit("__CODE__", 1)[-1].strip() if "__CODE__" in out else "?"
    html = out.rsplit("\n__CODE__", 1)[0]
    txt = re.sub(r"<[^>]+>", " ", html)
    txt = re.sub(r"\s+", " ", txt)
    hits = {p: (p.lower() in txt.lower()) for p in phrases}
    print(f"{code} len={len(html):7d} {url}")
    for p, h in hits.items():
        print(f"      {'OK ' if h else 'MISS'}  {p!r}")
