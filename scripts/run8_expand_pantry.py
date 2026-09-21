#!/usr/bin/env python3
"""Run 8b: expand the below-band `pantry-meal-planning` article with verified official
storage data (USDA FSIS shelf-stable + refrigeration charts) and USDA ERS food-loss
figures, plus a sources block. Assertion-guarded: every replacement must match exactly
once or the script aborts without writing. Also bumps the article's sitemap lastmod.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "src/data/articles.ts"
SM = ROOT / "public/sitemap.xml"
DATE = "2026-09-21"

t = ART.read_text()
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
    "    dateModified: '2026-05-26',\n    readingTime: '7 min read',\n    category: 'Pantry Planning',",
    f"    dateModified: '{DATE}',\n    readingTime: '10 min read',\n    category: 'Pantry Planning',",
    "R1 date/readingTime",
)

# R2 quickWin
rep(
    "      'Shop only for fresh items that complete two or more pantry meals.'",
    "      'Shop only for fresh items that complete two or more pantry meals.',\n"
    "      'Write the open date on cans: an opened can of beans has days, not years.'",
    "R2 quickWins",
)

SEC_A = """      {
        heading: 'How long the staples in your pantry actually keep',
        body: [
          'A pantry plan is only as good as its storage facts. The USDA Food Safety and Inspection Service publishes shelf-stable storage times for exactly the items a pantry plan leans on, and the spread is wide enough to change what you cook first.',
          'The pattern is worth memorizing: sealed low-acid cans keep for years, high-acid cans keep about a year, dry goods keep about two years - and the clock restarts the moment a can is opened. An opened can of beans or soup is a three-to-four-day refrigerator item, not a shelf item.'
        ],
        table: {
          caption: 'USDA FSIS shelf-stable storage times',
          headers: ['Pantry item', 'On the shelf', 'After opening'],
          rows: [
            ['Low-acid canned goods (beans, soups, stews, canned meat, potatoes, corn, carrots, peas, pumpkin)', '2 to 5 years', '3 to 4 days in the refrigerator'],
            ['High-acid canned goods (tomatoes, tomato and citrus juice, pineapple, peaches, pears, pickles, sauerkraut)', '12 to 18 months', '5 to 7 days in the refrigerator'],
            ['Rice and dried pasta', '2 years', '3 to 4 days in the refrigerator once cooked'],
            ['Commercially packaged jerky', '12 months', 'Not applicable'],
            ['Hard or dry sausage', '6 weeks in the pantry', '3 weeks refrigerated, or until it no longer smells or tastes right']
          ]
        },
        bullets: [
          'Anything labeled “Keep Refrigerated” is not pantry food - some canned hams and seafood fall into that group.',
          'Dented, leaking, bulging, or rusted can? Discard it instead of planning a meal around it.',
          'Rotate by window, not by shelf position: the item with the shortest remaining life goes into the next meal formula.'
        ],
        callout: 'The most useful habit in a pantry is a marker: write the open date on the container. Labels tell you how long food keeps sealed, never how long it keeps once you have used half of it.'
      },
"""

SEC_B = """      {
        heading: 'Sequence the week so nothing dies in the fridge',
        body: [
          'Pantry items are the backup; the refrigerator is where food actually gets lost. FSIS storage times give you the ordering rules for a week of pantry-led cooking.',
          'Cooked leftovers keep three to four days. Ground meat, raw poultry, and fresh fish keep one to two days. Eggs in the shell keep three to five weeks. Those three numbers explain why pantry planning works: dry and canned goods wait patiently while the perishables get eaten in order, and the pantry fills the gaps.'
        ],
        table: {
          caption: 'USDA FSIS refrigerator storage times (refrigerator held at 40 °F or below)',
          headers: ['Item', 'Refrigerator time'],
          rows: [
            ['Cooked leftovers: casseroles, soups, stews, cooked meat, poultry, fish', '3 to 4 days'],
            ['Ground meat, ground poultry, and stew meat', '1 to 2 days'],
            ['Fresh poultry, whole or in parts', '1 to 2 days'],
            ['Fresh fish and shellfish', '1 to 2 days'],
            ['Steaks, chops, roasts', '3 to 5 days'],
            ['Eggs, fresh in shell', '3 to 5 weeks'],
            ['Opened hot dogs / opened lunch meat', '1 week / 3 to 5 days'],
            ['Cooked rice, pasta, or beans', '3 to 4 days']
          ]
        },
        callout: 'Two refrigerator rules do most of the work: get leftovers into the fridge within two hours of cooking, and cool big batches fast by dividing them into shallow containers.'
      },
"""

SEC_C = """      {
        heading: 'Why storage windows are a waste fix, not a chore',
        body: [
          'The scale of avoidable loss is documented. The USDA Economic Research Service estimates that 133 billion pounds - 31 percent of the food available at the retail and consumer level - went uneaten in its most recent national estimate, worth roughly $162 billion at retail value, or about 1.2 pounds of food per person per day.',
          'Retail shrink shows the same pattern in fresh produce: ERS found supermarket loss averaged 11.6 percent across 31 fresh vegetables and ranged from 4.1 percent for bananas to 43.1 percent for papayas across 24 fresh fruits. Home kitchens are not the only place food disappears, but a pantry plan is one of the few fixes that costs nothing and needs no equipment.'
        ],
        bullets: [
          'Eat in window order: leftovers first, then short-life fresh items, then the pantry.',
          'Cook the perishable proteins you bought this week before opening another can.',
          'Keep one flexible “use-it-up” dinner per week - it is where the savings actually appear.'
        ]
      },
"""

# R3 insert the three sections before the last existing section
rep(
    "      {\n        heading: 'Keep nutrition balanced without overthinking',",
    SEC_A + SEC_B + SEC_C + "      {\n        heading: 'Keep nutrition balanced without overthinking',",
    "R3 new sections",
)

# R4 sources block (after the pantry article's faqs array)
rep(
    "      { question: 'Can pantry meals be high protein?', answer: 'Yes. Beans, lentils, eggs, tofu, canned fish, Greek yogurt, and protein pasta can all raise protein.' }\n    ]\n  },",
    "      { question: 'Can pantry meals be high protein?', answer: 'Yes. Beans, lentils, eggs, tofu, canned fish, Greek yogurt, and protein pasta can all raise protein.' }\n    ],\n"
    "    sources: [\n"
    "      {\n"
    "        label: 'USDA FSIS - Shelf-Stable Food Safety',\n"
    "        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/shelf-stable-food',\n"
    "        note: 'Source of the shelf, opening, and pantry storage times in the first table.'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA FSIS - Refrigeration & Food Safety',\n"
    "        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/refrigeration',\n"
    "        note: 'Source of the refrigerator storage times in the second table (40 °F or below).'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA FSIS - Leftovers and Food Safety',\n"
    "        href: 'https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety',\n"
    "        note: 'Basis for the two-hour refrigeration rule and leftover storage guidance.'\n"
    "      },\n"
    "      {\n"
    "        label: 'USDA Economic Research Service - Food Loss',\n"
    "        href: 'https://www.ers.usda.gov/data-products/food-availability-per-capita-data-system/food-loss',\n"
    "        note: 'Source of the retail and consumer food-loss estimates and the fresh produce shrink rates cited above.'\n"
    "      }\n"
    "    ]\n  },",
    "R4 sources block",
)

ART.write_text(t)
print(f"\narticles.ts edits: {n_edits} (now {len(t)} chars)")

# R5 sitemap lastmod
sm = SM.read_text()
slug = "/articles/pantry-meal-planning"
i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
if i == -1:
    raise SystemExit(f"ABORT [R5]: {slug} not found in sitemap")
j = sm.find("</url>", i)
block = sm[i:j]
if "<lastmod>" not in block:
    raise SystemExit(f"ABORT [R5]: no lastmod in {slug} block")
sm = sm[:i] + block.replace(
    "<lastmod>" + block.split("<lastmod>")[1].split("</lastmod>")[0] + "</lastmod>",
    f"<lastmod>{DATE}</lastmod>") + sm[j:]
SM.write_text(sm)
print(f"OK [R5 sitemap] {slug} -> {DATE}")
print("done")
