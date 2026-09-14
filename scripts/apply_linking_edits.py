#!/usr/bin/env python3
"""Run-5 internal linking edits: add relatedGuides to core articles (articles.ts)
and pairing guides (JSON). Assertions ensure anchors are unique; JSON validated before write.
"""
import json

TS = "src/data/articles.ts"

def ins_after(text: str, anchor: str, block: str) -> str:
    assert text.count(anchor) == 1, f"anchor not unique ({text.count(anchor)}): {anchor[:80]}"
    return text.replace(anchor, anchor + "\n" + block)

CORE = {
    "grocery-list": """    relatedGuides: [
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Twelve cheap mains and sauces, with per-person portion math.' },
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Budget fish night with sides that keep the plate light.' }
    ],""",
    "protein-calculator": """    relatedGuides: [
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'A fast protein anchor you can repeat all week.' },
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Lean protein with sides that fit a prep plan.' }
    ],""",
    "macro-calculator": """    relatedGuides: [
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Protein anchor, starch, and greens in one pan.' },
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Starchy sides that slot into a macro template.' }
    ],""",
    "pantry-helper": """    relatedGuides: [
      { slug: 'what-to-serve-with-roasted-potatoes', label: 'What to Serve with Roasted Potatoes', teaser: 'Potatoes are the ultimate pantry base.' },
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Jarred pesto turns pantry chicken into dinner.' }
    ],""",
    "nutrition-calculator', label: 'Open the Recipe Nutrition Calculator": """    relatedGuides: [
      { slug: 'what-to-serve-with-fried-fish', label: 'What to Serve with Fried Fish', teaser: 'Portion and calorie math for a fish dinner.' },
      { slug: 'what-to-serve-with-pesto-chicken', label: 'What to Serve with Pesto Chicken', teaser: 'Run a one-pan chicken dinner through the calculator.' }
    ],""",
}

s = open(TS).read()
for anchor_key, block in CORE.items():
    # find the full primaryTool line containing the anchor key
    lines = [ln for ln in s.splitlines() if "primaryTool:" in ln and anchor_key in ln]
    assert len(lines) == 1, f"primaryTool line for {anchor_key}: {len(lines)} matches"
    s = ins_after(s, lines[0], block)
open(TS, "w").write(s)
print("articles.ts updated")

JSONS = {
    "src/data/articles/what-to-serve-with-roasted-potatoes.json": [
        ("what-to-serve-with-fried-fish", "What to Serve with Fried Fish", "Fish and chips, done as a real weeknight dinner."),
        ("grocery-budget-meal-planning", "Grocery Budget Meal Planning", "Potatoes as a price anchor for a week of meals."),
    ],
    "src/data/articles/what-to-serve-with-fried-fish.json": [
        ("what-to-serve-with-roasted-potatoes", "What to Serve with Roasted Potatoes", "The classic potato side, twelve ways."),
        ("meal-planning-with-macros", "Meal Planning with Macros", "Work fish night into a weekly macro plan."),
    ],
    "src/data/articles/what-to-serve-with-pesto-chicken.json": [
        ("what-to-serve-with-roasted-potatoes", "What to Serve with Roasted Potatoes", "Crispy potatoes under a Ligurian pan."),
        ("high-protein-meal-prep", "High-Protein Meal Prep That Stays Flexible", "Prep chicken as a component, not five identical boxes."),
    ],
}

for path, items in JSONS.items():
    t = open(path).read()
    assert t.count('"faqs": []') == 1, f"faqs anchor issue in {path}"
    block = "\n".join(
        '    { "slug": "%s", "label": "%s", "teaser": "%s" },' % (sl, lb, ts)
        for sl, lb, ts in items
    ).rstrip(",")
    new = '"relatedGuides": [\n' + block + "\n  ],\n  \"faqs\": []"
    t = t.replace('"faqs": []', new)
    json.loads(t)  # validate
    open(path, "w").write(t)
    print(f"{path} updated + validated")
