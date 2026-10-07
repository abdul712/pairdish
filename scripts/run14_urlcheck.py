#!/usr/bin/env python3
"""Run-14: verify every URL we intend to cite still serves content from this box."""
import subprocess

UA = "Mozilla/5.0 Chrome/126"
URLS = [
    "https://snaped.fns.usda.gov/seasonal-produce-guide",
    "https://snaped.fna.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide",
    "https://snaped.fna.usda.gov/seasonal-produce-guide/fall",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC2975745/",
    "https://www.nature.com/articles/srep00196",
    "https://fdc.nal.usda.gov/",
    "https://www.kingarthurbaking.com/learn/ingredient-weight-chart",
    "https://scijournals.onlinelibrary.wiley.com/doi/10.1002/jsfa.2825",
    "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f",
    "https://extension.usu.edu/archive/list-of-ingredient-substitutions-for-cooking-and-baking",
    "https://randolph.ces.ncsu.edu/news/baking-substitutions-that-work/",
    "https://extension.msstate.edu/publications/ingredient-substitutions-and-equivalents",
    "https://www.ams.usda.gov/services/local-regional/food-directories",
]

for u in URLS:
    r = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code} %{size_download}",
         "--compressed", "--max-time", "25", "-A", UA, u],
        capture_output=True, text=True)
    print(f"{r.stdout.strip():16s} {u}")
