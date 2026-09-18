#!/usr/bin/env python3
"""Run 7: expand the grocery-budget-meal-planning article (below the 1,200-1,900 word band)
with official-data tables (USDA ERS price changes, BLS average prices), 4 new sections,
official sources block, and an updated dateModified. Assertion-guarded: every replacement
must match exactly once, or the script aborts without writing.

Also bumps the article's sitemap lastmod to 2026-09-18.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
ART = ROOT / "src/data/articles.ts"
SM = ROOT / "public/sitemap.xml"

t = ART.read_text()
orig_len = len(t)
n_edits = 0

def rep(old, new, label):
    global t, n_edits
    c = t.count(old)
    if c != 1:
        raise SystemExit(f"ABORT [{label}]: expected 1 match, found {c}")
    t = t.replace(old, new, 1)
    n_edits += 1
    print(f"OK [{label}]")

# R1 - dateModified + readingTime
rep(
    "    dateModified: '2026-05-26',\n    readingTime: '8 min read',\n    category: 'Grocery Budget',",
    "    dateModified: '2026-09-18',\n    readingTime: '10 min read',\n    category: 'Grocery Budget',",
    "R1 date/readingTime",
)

# R2 - quickWins 4th bullet
rep(
    "      'Plan one flexible “use-it-up” dinner to prevent waste.'",
    "      'Plan one flexible “use-it-up” dinner to prevent waste.',\n"
    "      'Check official average prices before trusting any “deal”; the unit price settles arguments fast.'",
    "R2 quickWins",
)

# R3 - Section A before 'Pick price anchors'
SEC_A = """      {
        heading: 'What food prices are doing right now',
        body: [
          'Budget math works better when it starts from the official picture instead of a headline. The USDA Economic Research Service tracks food prices every month. As of July 2026, food-at-home prices were 2.7 percent higher than a year earlier, and the agency expects a further rise of about 2.5 percent across 2026.',
          'The category detail is where it gets useful for planning. Egg prices are down sharply from their 2025 spike, dairy and cooking-oil prices are flat to falling, and the increases are concentrated in meat, produce, and sweets. That tells you where substitutions pay off this year and where they do not:'
        ],
        table: {
          caption: 'USDA ERS: food-at-home prices, change over the last 12 months (July 2025 to July 2026) and the 2026 forecast midpoint',
          headers: ['Category', 'Last 12 months', '2026 forecast'],
          rows: [
            ['Food at home (all)', '+2.7%', '+2.5%'],
            ['Meats, poultry, and fish', '+4.5%', '+4.8%'],
            ['Eggs', '-25.7%', '-30.8%'],
            ['Dairy products', '-0.5%', '0.0%'],
            ['Fats and oils', '-1.5%', '-2.2%'],
            ['Fruits and vegetables', '+5.1%', '+4.2%'],
            ['Cereals and bakery products', '+2.7%', '+2.8%'],
            ['Sugar and sweets', '+7.4%', '+7.1%'],
            ['Nonalcoholic beverages', '+4.1%', '+4.3%'],
            ['Other foods', '+2.1%', '+2.3%']
          ]
        },
        callout: 'Planning rule for the year: lean on eggs, dairy, and cooking fats while they are flat or falling, and make fresh produce and sweets the categories where substitutions earn their keep.'
      },
"""
rep(
    "      },\n      {\n        heading: 'Pick price anchors for the week',",
    "      },\n" + SEC_A + "      {\n        heading: 'Pick price anchors for the week',",
    "R3 section A",
)

# R4 - Section B before 'Use one grocery list'
SEC_B = """      {
        heading: 'Know the street price of your staples',
        body: [
          'Price anchors only work when you know what they normally cost. Every month the Bureau of Labor Statistics publishes average U.S. city prices for common foods, which makes a free reality check for any deal you see. Here is what the basics averaged in August 2026:'
        ],
        table: {
          caption: 'BLS average price data: U.S. city average, August 2026',
          headers: ['Staple', 'Average price'],
          rows: [
            ['Eggs, grade A large (per dozen)', '$2.27'],
            ['Milk, whole (per gallon)', '$4.23'],
            ['Bread, white pan (per pound)', '$1.82'],
            ['Chicken, whole (per pound)', '$2.01'],
            ['Ground beef, 100% beef (per pound)', '$6.92'],
            ['Spaghetti and macaroni (per pound)', '$1.37'],
            ['Rice, white long grain, uncooked (per pound)', '$1.11'],
            ['Beans, dried (per pound)', '$1.63'],
            ['Potatoes, white (per pound)', '$0.98'],
            ['Bananas (per pound)', '$0.65'],
            ['Tomatoes, field grown (per pound)', '$1.98'],
            ['Lettuce, iceberg (per pound)', '$1.47']
          ]
        },
        callout: 'Notice the spread: whole chicken near $2 a pound and dried beans at $1.63 give you very different dinner math than ground beef at $6.92. A price only beats these averages when it lands meaningfully under them.'
      },
"""
rep(
    "      {\n        heading: 'Use one grocery list for multiple meals',",
    SEC_B + "      {\n        heading: 'Use one grocery list for multiple meals',",
    "R4 section B",
)

# R5 - Sections C + D before 'Protect one flexible night'
SEC_C = """      {
        heading: 'Unit price: the one number that beats every coupon',
        body: [
          'The unit price, or cost per ounce, pound, quart, or gram, is the single most honest number in the store. Most shelf tags print it; when they do not, it takes ten seconds to figure out: divide the price by the size of the package.',
          'A $6.49 jar holding 64 ounces comes to about 10.1 cents per ounce. A $3.99 jar holding 32 ounces is about 12.5 cents per ounce. The bigger jar can look like the expensive choice at checkout, yet per ounce it is roughly 19 percent cheaper. Two habits catch almost every mistake: convert both options to the same unit before comparing, and never let a sale tag on a small package beat a larger pack without the math to prove it.'
        ],
        bullets: [
          'Compare within one unit: convert pounds, ounces, and grams first, and the converter below handles the arithmetic.',
          'Recheck unit prices when packaging changes; sizes shrink quietly while shelf prices hold.',
          'On multipacks, compare the per-item price, not the bundle price.'
        ],
        toolLink: { href: '/tools/unit-converter', label: 'Convert the units before you compare', description: 'Turn any price into per-ounce, per-pound, or per-gram numbers so two packages compete fairly.' }
      },
"""
SEC_D = """      {
        heading: 'When bulk buying actually saves money',
        body: [
          'Bulk buying is a math problem with two variables: the unit price, and how much of the item you will realistically finish. Bigger is only cheaper when both work out. A warehouse pack loses money the moment it goes stale, expires, or crowds out food you would have eaten.',
          'A workable default for most kitchens: bulk-buy the shelf-stable items you use weekly, such as rice, oats, pasta, dried beans, and flour, and keep fresh items at the sizes you actually consume.'
        ],
        bullets: [
          'Run the unit-price comparison every time; a bigger pack is not automatically a lower unit price.',
          'Buy the size that finishes within its storage life: grains keep for months, oils and nuts go stale sooner, spices fade within about a year.',
          'Count the freezer math. If you will freeze half, containers and freezer space are real costs.',
          'Skip bulk deals on foods you do not normally eat; food you throw away is the most expensive food in the store.'
        ]
      },
"""
rep(
    "      {\n        heading: 'Protect one flexible night',",
    SEC_C + SEC_D + "      {\n        heading: 'Protect one flexible night',",
    "R5 sections C+D",
)

# R6 - sources block after grocery faqs
SRC = """    ],
    sources: [
      {
        label: 'USDA Economic Research Service - Food Price Outlook',
        href: 'https://www.ers.usda.gov/data-products/food-price-outlook/',
        note: 'Source of the category price changes and 2026 forecast figures (data through July 2026).'
      },
      {
        label: 'BLS - CPI Average Price Data',
        href: 'https://www.bls.gov/cpi/factsheets/average-prices.htm',
        note: 'Documents the average-price series behind the staples table (U.S. city average, August 2026).'
      },
      {
        label: 'Iowa State University Extension - Spend Smart. Eat Smart.',
        href: 'https://spendsmart.extension.iastate.edu/',
        note: 'University extension resources for budget meal planning and home cooking.'
      }
    ]
  },
"""
rep(
    "    ]\n  },\n  {\n    slug: 'high-protein-meal-prep',",
    SRC + "  {\n    slug: 'high-protein-meal-prep',",
    "R6 sources",
)

ART.write_text(t)
print(f"articles.ts: {orig_len} -> {len(t)} chars, {n_edits} edits")

# sitemap lastmod bump for the expanded article
sm = SM.read_text()
old = "<loc>https://pairdish.com/articles/grocery-budget-meal-planning</loc>\n    <lastmod>2026-09-14</lastmod>"
new = "<loc>https://pairdish.com/articles/grocery-budget-meal-planning</loc>\n    <lastmod>2026-09-18</lastmod>"
if sm.count(old) != 1:
    raise SystemExit(f"ABORT [sitemap]: expected 1 match, found {sm.count(old)}")
SM.write_text(sm.replace(old, new, 1))
print("OK [sitemap] lastmod -> 2026-09-18")
