#!/usr/bin/env python3
"""Run 9a: expand the below-band `recipe-nutrition-calculator-guide` article with verified
FDA label-reading data (serving sizes, %DV guide, Daily Value table, added vs total sugars)
plus a raw-vs-cooked entry-state table built from USDA FoodData Central values.
Assertion-guarded: every replacement must match exactly once or the script aborts.
Also bumps the article's sitemap lastmod.
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
    "    dateModified: '2026-05-26',\n    readingTime: '7 min read',\n    category: 'Recipe Nutrition',",
    f"    dateModified: '{DATE}',\n    readingTime: '11 min read',\n    category: 'Recipe Nutrition',",
    "R1 date/readingTime",
)

# R2 keywords
rep(
    "    keywords: ['recipe nutrition calculator', 'recipe calories', 'macro calculator', 'per serving nutrition', 'nutrition facts for recipes'],",
    "    keywords: ['recipe nutrition calculator', 'recipe calories', 'macro calculator', 'per serving nutrition', 'nutrition facts for recipes', 'how to calculate calories in a recipe'],",
    "R2 keywords",
)

# R3 quickWin
rep(
    "      'Check oils, nuts, dairy, sweeteners, and grains first because small measurement errors change totals quickly.',",
    "      'Check oils, nuts, dairy, sweeteners, and grains first because small measurement errors change totals quickly.',\n"
    "      'Match the entry to the ingredient: raw weight with raw entries, cooked weight with cooked entries.',",
    "R3 quickWins",
)

SEC_A = """      {
        heading: 'What the Nutrition Facts label actually measures',
        body: [
          'A recipe calculator is doing the same job as a Nutrition Facts panel: describing a defined serving of a defined food. The FDA is explicit that a label serving size \u201creflects the amount that people typically eat or drink\u201d and that it \u201cis not a recommendation of how much you should eat or drink.\u201d That one sentence explains most serving-size arguments.',
          'It also explains why every number moves together. On the FDA sample label for frozen lasagna, one cup is 280 calories; eat two cups and you have taken in 560 calories, and every other nutrient and percentage doubles with it. A recipe calculator behaves the same way \u2014 change the yield and every per-serving figure changes \u2014 which is why setting servings first is part of the measurement, not bookkeeping.',
          'Labels also standardize the unit: a familiar household measure first, the metric weight second. That is the format worth copying into your own recipes. \u201cOne scoop\u201d does not travel between tools; \u201c45 g\u201d does.'
        ],
        table: {
          caption: 'Daily Values behind %DV on a 2,000-calorie diet (FDA)',
          headers: ['Nutrient', 'Daily Value', 'Goal'],
          rows: [
            ['Saturated fat', '20 g', 'Less than'],
            ['Sodium', '2,300 mg', 'Less than'],
            ['Added sugars', '50 g', 'Less than'],
            ['Dietary fiber', '28 g', 'At least'],
            ['Vitamin D', '20 mcg', 'At least'],
            ['Calcium', '1,300 mg', 'At least'],
            ['Iron', '18 mg', 'At least'],
            ['Potassium', '4,700 mg', 'At least']
          ]
        },
        bullets: [
          'The %DV column does not add up to 100% down the side of a label; each line is that nutrient\u2019s share of its own daily value.',
          'Protein, total sugars, and trans fat normally carry no %DV \u2014 a protein %DV appears only when the label makes a protein claim.',
          'FDA\u2019s reading rule: 5% DV or less of a nutrient per serving is low, 20% DV or more is high.'
        ],
        callout: 'The fastest sanity check on any recipe estimate is to ask what share of a day\u2019s sodium, added sugar, or protein one serving carries. That question catches more errors than recalculating every ingredient.',
        toolLink: { href: '/tools/dietary-finder', label: 'Match a recipe to a dietary pattern', description: 'Filter meal ideas when sodium, added sugar, or protein targets are the deciding factor.' }
      },
"""

SEC_B = """      {
        heading: 'Added sugars versus total sugars: the label line that fools recipe math',
        body: [
          'Total sugars counts everything: sugars naturally present in milk, fruit, and vegetables plus anything added during processing or cooking. Added sugars counts only the sweeteners \u2014 sucrose, dextrose, syrups, honey, and concentrated fruit or vegetable juices. On the FDA example, a yogurt label reading \u201cTotal Sugars 15 g, Includes 7 g Added Sugars\u201d means 7 g were added and 8 g occur naturally in the yogurt itself.',
          'For recipe math that distinction matters. A fruit-sweetened smoothie, a yogurt marinade, and a honey-glazed sheet pan can land on the same total sugar number with very different added sugar totals. If added sugar is what you are watching, enter the sweetener as its own line \u2014 honey, maple syrup, brown sugar \u2014 rather than relying on a combined ingredient entry that hides it.',
          'Percentages make the point faster than grams. Added sugars use 50 g per day as their 100% Daily Value, so a recipe contributing 12 g of added sugar per serving is already at 24% DV. By FDA\u2019s own reading rule, that is a high-sugar serving.'
        ],
        bullets: [
          'Enter sweeteners separately: they are the only added-sugar source most home recipes contain.',
          'Natural sugars from milk, fruit, and vegetables still count toward total sugars, so a smoothie can read high while carrying no added sugar at all.',
          'When a packaged ingredient is doing heavy lifting in a recipe, use its label numbers rather than a generic database entry.'
        ]
      },
"""

SEC_C = """      {
        heading: 'The raw-versus-cooked check that fixes most calculator errors',
        body: [
          'Ingredient databases carry separate entries for raw, cooked, drained, and ready-to-eat versions of the same food, and the gaps are large. USDA FoodData Central lists 22.5 g of protein per 100 g for raw boneless skinless chicken breast and 32.1 g per 100 g for the same cut cooked and braised. Nothing was added; water cooked off, so every gram of the cooked food now carries more protein.',
          'That means the entry you pick has to match the food in front of you. A 200 g portion of cooked chicken read against a raw entry comes out near 45 g of protein; read against a cooked entry it is about 64 g. Choosing the wrong state moves the number by 30 to 40 percent without a single ingredient being wrong.',
          'The same logic covers cans and packages. Drained solids, solids and liquids, and rinsed items are different entries, and as-purchased weights include parts you do not eat. Select the entry that describes what actually lands on the plate.'
        ],
        table: {
          caption: 'USDA FoodData Central: protein per 100 g by entry state',
          headers: ['Food and entry state', 'Protein per 100 g'],
          rows: [
            ['Chicken breast, boneless, skinless \u2014 raw', '22.5 g'],
            ['Chicken breast, meat only \u2014 cooked, braised', '32.1 g'],
            ['Fish, tuna, light, canned in water \u2014 drained solids', '25.5 g'],
            ['Egg, whole \u2014 cooked, hard-boiled', '12.6 g'],
            ['Lentils, mature seeds \u2014 cooked, boiled', '9.02 g'],
            ['Yogurt, Greek, plain, lowfat \u2014 ready to eat', '9.95 g']
          ]
        },
        bullets: [
          'Type the weight in the same state as the entry: raw weight with raw entries, cooked weight with cooked entries.',
          'Batch cooking? Note the raw weight before the pan, because that is the number the database understands.',
          'When a recipe and a package label disagree, the label wins for that packaged product; the database entry wins for loose ingredients.'
        ],
        callout: 'Before trusting a total, write the raw weight next to what came off the pan. If the two are far apart, check that the entry matches the weight you typed.',
        toolLink: { href: '/tools/unit-converter', label: 'Convert weights and volumes first', description: 'Get grams, ounces, cups, and tablespoons onto one scale before comparing entries.' }
      },
"""

# R4 insert the three sections before the last existing section
rep(
    "      {\n        heading: 'Use the result as an estimate, not medical advice',",
    SEC_A + SEC_B + SEC_C + "      {\n        heading: 'Use the result as an estimate, not medical advice',",
    "R4 new sections",
)

# R5 sources block
rep(
    "      { question: 'Why do recipe calorie estimates vary between tools?', answer: 'Different tools use different ingredient databases and assumptions for brands, preparation methods, and serving sizes.' }\n    ]\n  },",
    "      { question: 'Why do recipe calorie estimates vary between tools?', answer: 'Different tools use different ingredient databases and assumptions for brands, preparation methods, and serving sizes.' }\n    ],\n"
    "    sources: [\n"
    "      {\n"
    "        label: 'FDA \u2014 How to Understand and Use the Nutrition Facts Label',\n"
    "        href: 'https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label',\n"
    "        note: 'Source of the serving-size definition, the 5%/20% %DV reading guide, the Daily Value table, and the added-sugars example cited above.'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA FoodData Central',\n"
    "        href: 'https://fdc.nal.usda.gov/',\n"
    "        note: 'Source of the protein values in the entry-state table (chicken breast raw FDC 2646170, cooked FDC 331960, and the other food-detail pages for each row).'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA National Agricultural Library \u2014 DRI Calculator',\n"
    "        href: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator',\n"
    "        note: 'Estimates daily calorie and nutrient needs from the Dietary Reference Intakes.'\n"
    "      }\n"
    "    ]\n  },",
    "R5 sources block",
)

ART.write_text(t, encoding="utf-8")
print(f"\narticles.ts edits: {n_edits} (now {len(t)} chars)")

# R6 sitemap lastmod
sm = SM.read_text(encoding="utf-8")
slug = "/articles/recipe-nutrition-calculator-guide"
i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
if i == -1:
    raise SystemExit(f"ABORT [R6]: {slug} not found in sitemap")
j = sm.find("</url>", i)
block = sm[i:j]
if "<lastmod>" not in block:
    raise SystemExit(f"ABORT [R6]: no lastmod in {slug} block")
old_lm = block.split("<lastmod>")[1].split("</lastmod>")[0]
sm = sm[:i] + block.replace(f"<lastmod>{old_lm}</lastmod>", f"<lastmod>{DATE}</lastmod>") + sm[j:]
SM.write_text(sm, encoding="utf-8")
print(f"OK [R6 sitemap] {slug} lastmod {old_lm} -> {DATE}")
print("done")
