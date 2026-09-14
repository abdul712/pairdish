#!/usr/bin/env python3
"""Verify run-5 internal links are live on all 8 articles (post-deploy)."""
import subprocess

CHECKS = [
    ("what-to-serve-with-roasted-potatoes", ["Fish and chips, done as a real weeknight dinner", "Potatoes as a price anchor for a week of meals"]),
    ("what-to-serve-with-fried-fish", ["The classic potato side, twelve ways", "Work fish night into a weekly macro plan"]),
    ("what-to-serve-with-pesto-chicken", ["Crispy potatoes under a Ligurian pan", "Prep chicken as a component, not five identical boxes"]),
    ("grocery-budget-meal-planning", ["Twelve cheap mains and sauces", "Budget fish night with sides that keep the plate light"]),
    ("high-protein-meal-prep", ["A fast protein anchor you can repeat all week", "Lean protein with sides that fit a prep plan"]),
    ("meal-planning-with-macros", ["Protein anchor, starch, and greens in one pan", "Starchy sides that slot into a macro template"]),
    ("pantry-meal-planning", ["Potatoes are the ultimate pantry base", "Jarred pesto turns pantry chicken into dinner"]),
    ("recipe-nutrition-calculator-guide", ["Portion and calorie math for a fish dinner", "Run a one-pan chicken dinner through the calculator"]),
]

ok = 0
for slug, needles in CHECKS:
    url = f"https://pairdish.com/articles/{slug}"
    html = subprocess.run(["curl", "-s", "--max-time", "30", url], capture_output=True, text=True).stdout
    results = [html.count(n) for n in needles]
    status = "OK" if all(c >= 1 for c in results) else "MISS"
    if status == "OK":
        ok += 1
    print(f"{status} {slug}: {results}")
print(f"\n{ok}/8 articles show both related-guide cards")
