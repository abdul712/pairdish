#!/usr/bin/env python3
"""Run-10 meta-length fix: the live-tree audit found 10 pages shipping
meta descriptions of 161-175 chars (post-html.unescape) against the <=160 rule.
Rewrite each to a <=160-char description, in BOTH places it appears in a page
(BaseLayout prop + JSON-LD "description").
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

REPLACEMENTS = [
    # (file, old description, new description)
    ("src/pages/articles/index.astro",
     "PairDish guides for food pairing, recipe nutrition, macro meal planning, pantry dinners, grocery budgets, and high-protein meal prep — with calculators for each.",
     "PairDish guides to food pairing, recipe nutrition, macro meal planning, pantry dinners, grocery budgets and high-protein meal prep, each with a calculator."),
    ("src/pages/disclaimer.astro",
     "PairDish nutrition calculators, meal planning guides, and food tools are for general information only and are not medical, allergy, or professional food safety advice.",
     "PairDish calculators, guides and food tools are for general information only — not medical, allergy, or professional food-safety advice."),
    ("src/pages/tools/herb-spice-matrix.astro",
     "Interactive guide to herb and spice combinations. Discover which herbs complement each other, explore flavor profiles, and learn culinary uses for 20+ seasonings.",
     "Interactive herb and spice pairing guide: which herbs complement each other, the flavor profile behind each one, and culinary uses for 20+ seasonings."),
    ("src/pages/tools/recipe-scaler.astro",
     "Easily scale any recipe up or down. Our smart calculator adjusts ingredient quantities with beautiful fraction display and baking tips for perfect results every time.",
     "Scale any recipe up or down: the calculator adjusts each ingredient quantity with fraction display, plus pan-size and baking tips for reliable results."),
    ("src/pages/tools/substitution-finder.astro",
     "Find ingredient substitutes for allergies, dietary restrictions, or when you're out of something. Vegan, dairy-free, gluten-free, and keto alternatives with ratios.",
     "Find ingredient substitutes for allergies, dietary needs or an empty pantry — vegan, dairy-free, gluten-free and keto swaps with exact ratios."),
    ("src/pages/tools/appetizer-planner.astro",
     "Calculate how many appetizers to make for your party. Get per-person quantities, variety recommendations, and prep timing for cocktail parties, receptions, and more.",
     "Calculate how many appetizers to make for your party: per-person quantities, variety targets and prep timing for cocktail parties and receptions."),
    ("src/pages/tools/buffet-planner.astro",
     "Plan the perfect buffet with calculated quantities per guest. Get dish recommendations, category balance tips, and serving amounts for brunch, lunch, dinner, or holiday meals.",
     "Plan a buffet with quantities per guest: dish recommendations, category balance for fish, meat, vegetable and salad, and serving amounts by meal."),
    ("src/pages/tools/leftover-matcher.astro",
     "Turn your leftovers into delicious meals! Enter ingredients you have and get recipe suggestions instantly. Never waste food again with our ingredient-to-recipe finder.",
     "Turn leftovers into meals: enter the ingredients you have and get matching recipe ideas instantly, with food-safety storage windows for each one."),
    ("src/pages/tools/macro-calculator.astro",
     "Calculate your ideal macronutrient ratios based on your goals. Get personalized protein, carbs, and fat targets for keto, low-carb, high-protein, and balanced diets.",
     "Calculate macronutrient ratios for your goals: protein, carb and fat targets in grams for keto, low-carb, high-protein and balanced diets."),
    ("src/pages/tools/cooking-style-quiz.astro",
     "Discover your unique cooking personality! Take our fun quiz to find out if you're an Adventurous Chef, Comfort Cook, Wellness Warrior, or one of our other cooking styles.",
     "Take the cooking style quiz to find your cooking personality — Adventurous Chef, Comfort Cook, Wellness Warrior and more — with matching recipes."),
]


def main():
    fails = []
    for rel, old, new in REPLACEMENTS:
        p = ROOT / rel
        if not p.exists():
            fails.append(f"MISSING FILE {rel}")
            continue
        s = p.read_text(encoding="utf-8")
        n_new = len(new)
        if n_new > 160:
            fails.append(f"{rel}: replacement is {n_new} chars (>160)")
            continue
        cnt = s.count(old)
        if cnt == 0:
            fails.append(f"{rel}: old description not found")
            continue
        s2 = s.replace(old, new)
        p.write_text(s2, encoding="utf-8")
        print(f"{rel}: replaced {cnt}x | {len(old)} -> {n_new} chars")
    if fails:
        print("\nFAILURES:")
        for f in fails:
            print("  -", f)
        sys.exit(2)
    print(f"\nOK: {len(REPLACEMENTS)} pages updated, all replacements <=160 chars")


if __name__ == "__main__":
    main()
