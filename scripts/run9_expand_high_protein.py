#!/usr/bin/env python3
"""Run 9b: expand the below-band `high-protein-meal-prep` article with verified
USDA FoodData Central protein values (per-anchor table + batch math) and USDA FSIS
refrigerator storage windows for prepped containers. Assertion-guarded; bumps sitemap.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "src/data/articles.ts"
SM = ROOT / "public/sitemap.xml"
DATE = "2026-09-23"

t = ART.read_text(encoding="utf-8")
n_edits = 0


def rep(old, new, label):
    global t, n_edits
    c = t.count(old)
    if c != 1:
        raise SystemExit(f"ABORT [{label}]: expected 1 match, found {c}")
    t = t.replace(old, new, 1)
    n_edits += 1
    print(f"OK [{label}]")


# R1 date + reading time
rep(
    "    dateModified: '2026-05-26',\n    readingTime: '7 min read',\n    category: 'Meal Prep',",
    f"    dateModified: '{DATE}',\n    readingTime: '11 min read',\n    category: 'Meal Prep',",
    "R1 date/readingTime",
)

# R2 quickWin
rep(
    "      'Add protein to snacks and breakfasts, not only lunch and dinner.'",
    "      'Add protein to snacks and breakfasts, not only lunch and dinner.',\n"
    "      'Weigh protein raw and divide by containers: that number does not change when water cooks off.'",
    "R2 quickWins",
)

SEC_A = """      {
        heading: 'What the protein numbers actually look like per portion',
        body: [
          'Component prep gets easier once you know how much protein each anchor really delivers, because that number decides how many containers a batch fills. These are USDA FoodData Central values for protein per 100 g of the food as eaten; the portion column is the same figure multiplied out for a 150 g serving.',
          'The spread is the useful part. A 150 g portion of cooked poultry delivers more protein than three times that weight of cooked chickpeas, so \u201cprotein anchor\u201d is really several tiers. Building a week from two tiers \u2014 one dense anchor plus one plant anchor \u2014 holds up better than trying to hit the top of the list at every meal.',
          'It also explains why portions look so different. Reaching 30 g of protein from cooked chickpeas means eating roughly 340 g of them; 100 g of cooked poultry already clears 30 g. Neither is better, but the container is not the same size.'
        ],
        table: {
          caption: 'USDA FoodData Central \u2014 protein per 100 g as eaten, with a 150 g portion worked out',
          headers: ['Protein anchor', 'Protein per 100 g', 'In a 150 g portion'],
          rows: [
            ['Chicken or turkey breast, meat only, cooked', '32.1 g', 'about 48 g'],
            ['Tuna, light, canned in water, drained solids', '25.5 g', 'about 38 g'],
            ['Eggs, whole, hard-boiled', '12.6 g', 'about 19 g'],
            ['Cottage cheese, lowfat (1% milkfat)', '12.4 g', 'about 19 g'],
            ['Tofu, extra firm, prepared with nigari', '9.98 g', 'about 15 g'],
            ['Yogurt, Greek, plain, lowfat', '9.95 g', 'about 15 g'],
            ['Lentils, cooked, boiled', '9.02 g', 'about 14 g'],
            ['Chickpeas, cooked, boiled', '8.86 g', 'about 13 g'],
            ['Black beans, cooked, boiled', '8.86 g', 'about 13 g']
          ]
        },
        bullets: [
          'Use the 100 g column to compare anchors; use the portion column to plan containers.',
          'Cheese, nuts, and seeds add protein but arrive with much more fat per gram, so they support a meal rather than anchor it.',
          'Protein powders and bars are label-driven: read the package rather than a database entry.'
        ],
        callout: 'If you track one number in meal prep, track grams of protein per container. It survives every cooking method, and it is the figure the plan is actually built on.',
        toolLink: { href: '/tools/protein-calculator', label: 'Set your daily protein target', description: 'Work out grams per day and per meal before dividing a batch into containers.' }
      },
"""

SEC_B = """      {
        heading: 'Do the batch math from raw weight',
        body: [
          'Protein is not lost when meat cooks; water is. That single fact makes batch math simple: multiply the raw weight of the protein by the protein density of the raw food, and you have the protein in the whole package no matter what the pan does to the scale.',
          'A 3 lb (1,361 g) pack of raw boneless skinless chicken breast at 22.5 g of protein per 100 g carries roughly 306 g of protein. Divided into five containers that is about 61 g each; six containers gives about 51 g. The container count sets the per-serving number, not the cooked weight on the day.',
          'The same approach covers plant anchors. A 250 g portion of cooked chickpeas at 8.86 g per 100 g comes to about 22 g of protein \u2014 roughly one plant-anchor serving. Write the batch number on the lid once and you never recalculate lunch again.'
        ],
        bullets: [
          'Weigh raw, note the batch total, then divide by the containers you actually filled.',
          'Sauces, marinades, and oils are their own lines: they change fat and sodium, not the protein math.',
          'Freezing half the batch? Split the protein figure before it goes in the freezer so both halves carry their own number.'
        ],
        callout: 'Cooked weight changes; protein content does not. Do the division from the raw package and the containers stay consistent from week to week.',
        toolLink: { href: '/tools/nutrition-calculator', label: 'Calculate the full batch', description: 'Turn a batch recipe into per-container calories, protein, and macros.' }
      },
"""

SEC_C = """      {
        heading: 'Keep the week inside the safe storage window',
        body: [
          'A prep plan is also a food-safety plan, and the USDA Food Safety and Inspection Service publishes the windows that apply. Cooked leftovers \u2014 casseroles, soups, stews, cooked meat, poultry, and fish \u2014 keep three to four days in a refrigerator held at 40 \u00b0F or below. Cooked rice, pasta, and beans follow the same three-to-four-day rule. Raw ground meat, raw poultry, and fresh fish are far shorter: one to two days.',
          'That is the argument for four containers instead of seven. Build the week in two batches, or freeze the back half in the containers you plan to eat later and thaw it in the refrigerator.',
          'Two habits protect the batch. Get cooked food into the refrigerator promptly \u2014 FSIS guidance for leftovers is within two hours \u2014 and cool large batches fast by dividing them into small portions in shallow containers instead of leaving a deep pot to shed heat slowly.'
        ],
        table: {
          caption: 'USDA FSIS refrigerator storage windows (40 \u00b0F or below)',
          headers: ['Prepped item', 'Refrigerator time'],
          rows: [
            ['Cooked leftovers: casseroles, soups, stews, cooked meat, poultry, fish', '3 to 4 days'],
            ['Cooked rice, pasta, or beans', '3 to 4 days'],
            ['Raw ground meat or poultry, fresh poultry, fresh fish', '1 to 2 days'],
            ['Eggs, fresh in shell', '3 to 5 weeks']
          ]
        },
        bullets: [
          'Write the cook date on each lid so day four is obvious at a glance.',
          'Cool in shallow containers first, then stack and cover once the food stops steaming.',
          'Freeze anything you will not eat inside the window \u2014 and label the container with the freeze date too.'
        ],
        callout: 'A four-day container is not a suggestion about freshness; it is the outer edge of the safe window for cooked food.'
      },
"""

# R3 insert sections before the final section
rep(
    "      {\n        heading: 'Check the recipe once, then repeat confidently',",
    SEC_A + SEC_B + SEC_C + "      {\n        heading: 'Check the recipe once, then repeat confidently',",
    "R3 new sections",
)

# R4 sources block
rep(
    "      { question: 'Should every meal be high protein?', answer: 'Not necessarily. Many people do better by spreading protein across the day and balancing the week overall.' }\n    ]\n  }\n];",
    "      { question: 'Should every meal be high protein?', answer: 'Not necessarily. Many people do better by spreading protein across the day and balancing the week overall.' }\n    ],\n"
    "    sources: [\n"
    "      {\n"
    "        label: 'USDA FoodData Central',\n"
    "        href: 'https://fdc.nal.usda.gov/',\n"
    "        note: 'Source of every protein value in the anchor table (for example chicken breast cooked, FDC 331960; raw, FDC 2646170).'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA FSIS \u2014 Refrigeration & Food Safety',\n"
    "        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/refrigeration',\n"
    "        note: 'Source of the refrigerator storage windows and the shallow-container cooling guidance.'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA FSIS \u2014 Leftovers and Food Safety',\n"
    "        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety',\n"
    "        note: 'Basis for the two-hour refrigeration rule for cooked food.'\n"
    "      }\n"
    "    ]\n  }\n];",
    "R4 sources block",
)

ART.write_text(t, encoding="utf-8")
print(f"\narticles.ts edits: {n_edits} (now {len(t)} chars)")

# R5 sitemap lastmod
sm = SM.read_text(encoding="utf-8")
slug = "/articles/high-protein-meal-prep"
i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
if i == -1:
    raise SystemExit(f"ABORT [R5]: {slug} not found in sitemap")
j = sm.find("</url>", i)
block = sm[i:j]
if "<lastmod>" not in block:
    raise SystemExit(f"ABORT [R5]: no lastmod in {slug} block")
old_lm = block.split("<lastmod>")[1].split("</lastmod>")[0]
sm = sm[:i] + block.replace(f"<lastmod>{old_lm}</lastmod>", f"<lastmod>{DATE}</lastmod>") + sm[j:]
SM.write_text(sm, encoding="utf-8")
print(f"OK [R5 sitemap] {slug} lastmod {old_lm} -> {DATE}")
print("done")
