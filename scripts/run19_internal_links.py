#!/usr/bin/env python3
"""Run-19 internal-link pass: give /tools/glycemic-index inbound links (it had zero) and
strengthen /tools/dietary-finder, using contextual sentences in existing prose.

Idempotent: each edit is skipped when its anchor sentence is already present.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
LINK = 'class="text-[var(--color-wine)] underline"'

EDITS = [
    (
        "src/pages/tools/nutrition-calculator.astro",
        "walks through how to read the panel once the inputs are right.\n      </p>",
        "walks through how to read the panel once the inputs are right. If the question is how\n"
        "fast those grams reach the bloodstream rather than how many there are, the\n"
        f'        <a href="/tools/glycemic-index" {LINK}>glycemic index and load guide</a> puts the\n'
        "same serving on that scale, and the\n"
        f'        <a href="/tools/dietary-finder" {LINK}>dietary meal finder</a> filters meals by the\n'
        "twelve restriction tags before the totals are calculated.\n      </p>",
    ),
    (
        "src/pages/tools/macro-calculator.astro",
        "reason a plan can be built exactly to its percentages and still miss the calorie target by a\n"
        "few calories a day.\n      </p>",
        "reason a plan can be built exactly to its percentages and still miss the calorie target by a\n"
        "few calories a day. For the carbohydrate half of that split, the\n"
        f'        <a href="/tools/glycemic-index" {LINK}>glycemic index guide</a> shows how the same\n'
        "gram of carbohydrate can arrive quickly or slowly depending on the food it came in.\n      </p>",
    ),
]

changed = 0
for rel, anchor, replacement in EDITS:
    p = ROOT / rel
    s = p.read_text(encoding="utf-8")
    if replacement.split("\n")[0].strip() in s and "/tools/glycemic-index" in s:
        print("already applied:", rel)
        continue
    if anchor not in s:
        print("ANCHOR MISS:", rel)
        continue
    p.write_text(s.replace(anchor, replacement, 1), encoding="utf-8")
    print("edited:", rel)
    changed += 1

sys.exit(0 if changed or True else 1)
