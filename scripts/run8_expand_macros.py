#!/usr/bin/env python3
"""Run 8: expand the below-band `meal-planning-with-macros` article with official
2025-2030 Dietary Guidelines data (protein 1.2-1.6 g/kg/day, serving minimums,
saturated-fat / added-sugar ceilings), a worked grams-per-day table, a sources block,
and a freshness update to the protein-calculator tool page. Assertion-guarded: every
replacement must match exactly once or the script aborts without writing.

Also bumps sitemap lastmod to 2026-09-21 for the two touched URLs.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "src/data/articles.ts"
PROT = ROOT / "src/pages/tools/protein-calculator.astro"
SM = ROOT / "public/sitemap.xml"
DATE = "2026-09-21"

LB = [130, 150, 175, 200]


def kg(lb):
    return lb / 2.2046226218


def protein_rows():
    rows = []
    for lb in LB:
        k = kg(lb)
        lo, hi = 1.2 * k, 1.6 * k
        rows.append([f"{lb} lb", f"{k:.1f} kg", f"{lo:.0f} g", f"{hi:.0f} g",
                     f"{lo / 3:.0f}-{hi / 3:.0f} g"])
    return rows


ROWS = protein_rows()
print("protein table:")
for r in ROWS:
    print("   ", r)
print()

t = ART.read_text()
n_edits = 0


def rep(old, new, label, path=None):
    global t, n_edits
    target = t if path is None else path.read_text()
    c = target.count(old)
    if c != 1:
        raise SystemExit(f"ABORT [{label}]: expected 1 match, found {c}")
    if path is None:
        t = t.replace(old, new, 1)
    else:
        path.write_text(target.replace(old, new, 1))
    n_edits += 1
    print(f"OK [{label}]")


# ---------------------------------------------------------------- R1 date/reading
rep(
    "    dateModified: '2026-05-26',\n    readingTime: '8 min read',\n    category: 'Meal Planning',",
    f"    dateModified: '{DATE}',\n    readingTime: '11 min read',\n    category: 'Meal Planning',",
    "R1 date/readingTime",
)

# ---------------------------------------------------------------- R2 quickWins
rep(
    "      'Balance the week rather than forcing every single meal to hit perfect numbers.'",
    "      'Balance the week rather than forcing every single meal to hit perfect numbers.',\n"
    "      'Set the protein target from the current guidelines - 1.2 to 1.6 grams per kilogram of body weight per day.'",
    "R2 quickWins",
)

# ---------------------------------------------------------------- R3 new sections
SEC_1 = """      {
        heading: 'What the current U.S. guidelines actually say',
        body: [
          'Macro planning gets easier when the targets come from an official source instead of a viral template. The Dietary Guidelines for Americans, 2025-2030 - the joint HHS and USDA edition published in January 2026 - replaced the old "percentage of calories" framing with concrete daily serving and protein goals.',
          'The headline change for anyone building a macro plan is protein. The current edition sets a protein serving goal of 1.2 to 1.6 grams per kilogram of body weight per day and asks people to prioritize protein foods at every meal. That is a planning range, not a scoreboard: land inside it across the day and the rest of the plate gets much easier to arrange.'
        ],
        table: {
          caption: 'Dietary Guidelines for Americans, 2025-2030: the daily goals that shape a macro plan',
          headers: ['Guideline', 'Daily goal', 'How it lands in a plan'],
          rows: [
            ['Protein', '1.2-1.6 g per kg body weight', 'Anchors every meal; the first number to set'],
            ['Dairy', '3 servings (2,000-calorie pattern)', 'Breakfast and snacks, plus sauces'],
            ['Vegetables', '3 servings', 'Lunch and dinner volume, not an afterthought'],
            ['Fruits', '2 servings', 'Carb source with fiber built in'],
            ['Whole grains', '2-4 servings', 'Main carb lever; favor fiber-rich versions'],
            ['Saturated fat', 'Under 10% of daily calories', 'Caps butter, cheese, and fatty meat portions'],
            ['Added sugars', 'No more than 10 g in any one meal', 'Dessert and sweet drinks become occasional'],
            ['Sodium', 'Under 2,300 mg (ages 14 and up)', 'Favors home cooking over packaged food']
          ]
        },
        callout: 'Notice the shape of it: protein and produce have minimums, fats and sugars have ceilings, and grains sit in a range. A macro plan is mostly the work of hitting the minimums and staying under the ceilings.'
      },
      {
        heading: 'Turn the protein goal into grams per day',
        body: [
          'Protein is the one macro the current guidelines express in grams per kilogram of body weight, so it needs a single conversion step before it becomes a shopping list. Divide your weight in pounds by 2.205 to get kilograms, then multiply by 1.2 for the floor and 1.6 for the ceiling.',
          'Here is that arithmetic worked out for four common body weights, with the share each one implies if you eat three times a day:'
        ],
        table: {
          caption: 'Protein targets from the 1.2-1.6 g/kg/day guideline range',
          headers: ['Body weight', 'Kilograms', '1.2 g/kg per day', '1.6 g/kg per day', 'Per meal (3 meals)'],
          rows: __ROWS__
        },
        bullets: [
          'Round to the nearest 5 grams - no dinner plan needs a decimal.',
          'Use the lower end on rest days and the upper end on training or physically heavy days.',
          'Eating four smaller meals? Divide the daily number by four instead of three.'
        ],
        callout: 'A 175-pound cook lands between roughly 95 and 127 grams of protein a day, or 32 to 42 grams per meal. That is a real constraint on the plate, which is exactly why the protein anchor gets chosen first.',
        toolLink: { href: '/tools/protein-calculator', label: 'Get your own daily protein number', description: 'Enter weight and goal to see a daily protein target and how it splits across meals.' }
      },
      {
        heading: 'Hit the number without weighing every meal',
        body: [
          'Daily grams are a planning target, not a grade. The reliable shortcut is to build each meal around one protein anchor that is easy to judge by eye, then fill in the rest of the plate from the serving minimums.',
          'Anchors that fit a macro template: eggs at breakfast, Greek yogurt or cottage cheese for snacks, beans, lentils, or tofu in plant-forward meals, and poultry, fish, lean meat, or seafood at dinner. The guidelines also count frozen, dried, or canned produce as legitimate options, which matters when fresh prices move - and it keeps a plan from collapsing on a busy Tuesday.'
        ],
        bullets: [
          'One anchor per meal: choose it before anything else on the plate.',
          'Batch the anchor: cook two proteins at once and most of the week plans itself.',
          'Fill the rest from the minimums: 3 vegetables, 2 fruits, 2-4 whole grains.',
          'Cap rather than ban: saturated fat under 10 percent of calories, and no more than 10 grams of added sugar in a single meal.'
        ],
        toolLink: { href: '/tools/macro-calculator', label: 'Check the meal against your macros', description: 'Run a recipe through the macro calculator to see how far the plate moves your day.' }
      },
""".replace("__ROWS__", "[\n" + ",\n".join(
    "            [" + ", ".join("'" + c + "'" for c in r) + "]" for r in ROWS) + "\n          ]")

rep(
    "      {\n        heading: 'Plan a range, not perfection',",
    SEC_1 + "      {\n        heading: 'Plan a range, not perfection',",
    "R3 new sections",
)

# ---------------------------------------------------------------- R4 sources block
SOURCES = """    sources: [
      {
        label: 'Dietary Guidelines for Americans, 2025-2030 (HHS/USDA)',
        href: 'https://cdn.realfood.gov/DGA.pdf',
        note: 'Source of the protein serving goal (1.2-1.6 g/kg/day), the daily serving minimums, and the saturated-fat, added-sugar, and sodium limits used above.'
      },
      {
        label: 'DietaryGuidelines.gov - official Dietary Guidelines hub',
        href: 'https://www.dietaryguidelines.gov/',
        note: 'Federal landing page for the current edition and all previous editions.'
      },
      {
        label: 'USDA National Agricultural Library - DRI Calculator',
        href: 'https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator',
        note: 'Estimates daily calorie and macronutrient needs from the Dietary Reference Intakes.'
      },
      {
        label: 'USDA FoodData Central',
        href: 'https://fdc.nal.usda.gov/',
        note: 'Official food composition data for checking individual ingredients and portions.'
      }
    ]
"""
rep(
    "      { question: 'Can macro planning work for family dinners?', answer: 'Yes. Keep the shared meal flexible, then adjust portions or sides for individual goals.' }\n    ]\n  },",
    "      { question: 'Can macro planning work for family dinners?', answer: 'Yes. Keep the shared meal flexible, then adjust portions or sides for individual goals.' }\n    ],\n"
    + SOURCES + "  },",
    "R4 sources block",
)

ART.write_text(t)
print(f"\narticles.ts edits: {n_edits} (now {len(t)} chars)")

# ---------------------------------------------------------------- R5 protein page
rep(
    "              The RDA of 0.8g/kg is the minimum to prevent deficiency. Active individuals and\n"
    "              those building muscle may need 1.2-1.6g/kg or even higher for athletes.",
    "              The RDA of 0.8g/kg is the minimum to prevent deficiency. The Dietary Guidelines\n"
    "              for Americans, 2025-2030 go further for the general population and set a protein\n"
    "              serving goal of 1.2-1.6g per kg per day, prioritized at every meal. Athletes may\n"
    "              need more. <a href=\"https://www.dietaryguidelines.gov/\" class=\"text-[var(--accent)] underline\" target=\"_blank\" rel=\"noopener\">Read the current guidelines</a>.",
    "R5 protein-calculator copy",
    path=PROT,
)

# ---------------------------------------------------------------- R6 sitemap lastmod
sm = SM.read_text()
for slug in ("/articles/meal-planning-with-macros", "/tools/protein-calculator"):
    i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
    if i == -1:
        raise SystemExit(f"ABORT [R6]: {slug} not found in sitemap")
    j = sm.find("</url>", i)
    block = sm[i:j]
    if "<lastmod>" not in block:
        raise SystemExit(f"ABORT [R6]: no lastmod in {slug} block")
    new_block = block.replace(
        "<lastmod>" + block.split("<lastmod>")[1].split("</lastmod>")[0] + "</lastmod>",
        f"<lastmod>{DATE}</lastmod>")
    sm = sm[:i] + new_block + sm[j:]
    print(f"OK [R6 sitemap] {slug} -> {DATE}")
SM.write_text(sm)
print("done")
