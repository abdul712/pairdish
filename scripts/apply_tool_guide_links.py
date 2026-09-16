#!/usr/bin/env python3
"""Run-6: add a "Related Guides" card block to the most relevant tool pages so
guide/article pages get inbound internal links from tool pages (the gap: tools
linked to zero articles). Inserted just before </BaseLayout>, styled exactly
like the existing Related Tools cards.
Usage: python3 scripts/apply_tool_guide_links.py --dry | --apply
"""
import sys, pathlib

TOOLS = pathlib.Path('src/pages/tools')

G = {
    'roasted': ('what-to-serve-with-roasted-potatoes', 'What to Serve with Roasted Potatoes',
                '12 mains and sauces, with per-person portion math.', '🥔', 'amber'),
    'fried': ('what-to-serve-with-fried-fish', 'What to Serve with Fried Fish',
              'Classic sides and the science behind tartar sauce.', '🐟', 'sky'),
    'pesto': ('what-to-serve-with-pesto-chicken', 'What to Serve with Pesto Chicken',
              'A Ligurian one-pot method for weeknights.', '🍗', 'green'),
    'nutrition-guide': ('recipe-nutrition-calculator-guide', 'Using a Recipe Nutrition Calculator',
                        'Turn per-serving numbers into real decisions.', '🧮', 'purple'),
    'macros': ('meal-planning-with-macros', 'Meal Planning With Macros',
               'A simple weekly system around your targets.', '📐', 'indigo'),
    'pantry': ('pantry-meal-planning', 'Pantry Meal Planning',
               'Turn shelf staples into real dinners.', '🥫', 'orange'),
    'grocery-budget': ('grocery-budget-meal-planning', 'Grocery Budget Meal Planning',
                       'Build a week around your real number.', '🛒', 'rose'),
    'high-protein': ('high-protein-meal-prep', 'High-Protein Meal Prep',
                     'Flexible prep that doesn\u2019t feel like diet food.', '💪', 'red'),
}

PAGES = {
    'flavor-pairing.astro': ['roasted', 'fried', 'pesto'],
    'meal-prep.astro': ['macros', 'high-protein', 'pantry'],
    'nutrition-calculator.astro': ['nutrition-guide', 'high-protein'],
    'macro-calculator.astro': ['macros', 'high-protein'],
    'protein-calculator.astro': ['high-protein', 'macros'],
    'grocery-list.astro': ['grocery-budget', 'pantry'],
    'pantry-helper.astro': ['pantry', 'grocery-budget'],
    'recipe-scaler.astro': ['nutrition-guide'],
    'buffet-planner.astro': ['fried', 'roasted'],
}

HEAD = """
  <!-- Related Guides -->
  <section class="py-12 bg-[var(--color-cream)]">
    <div class="container">
      <h2 class="text-display text-xl font-semibold text-[var(--text-secondary)] mb-6 text-center">
        Related Guides
      </h2>
      <div class="grid grid-cols-1 {cols} gap-4 max-w-{maxw} mx-auto">
"""
TAIL = """      </div>
    </div>
  </section>
"""

CARD = """        <a href="/articles/{slug}" class="card bg-white hover:border-[var(--color-wine)] border border-transparent flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-lg bg-{color}-100 flex items-center justify-center text-{color}-700">
            {icon}
          </div>
          <div>
            <h4 class="font-medium text-[var(--text-primary)]">{title}</h4>
            <p class="text-sm text-[var(--text-muted)]">{teaser}</p>
          </div>
        </a>
"""


def build_block(keys):
    n = len(keys)
    if n == 1:
        cols, maxw = 'grid-cols-1', 'md'
    elif n == 2:
        cols, maxw = 'md:grid-cols-2', '4xl'
    else:
        cols, maxw = 'md:grid-cols-3', '4xl'
    cards = '\n'.join(
        CARD.format(slug=G[k][0], title=G[k][1], teaser=G[k][2], icon=G[k][3], color=G[k][4])
        for k in keys)
    return HEAD.format(cols=cols, maxw=maxw) + cards + TAIL


def main():
    apply = '--apply' in sys.argv
    for fname, keys in PAGES.items():
        p = TOOLS / fname
        s = p.read_text()
        close = s.rfind('</BaseLayout>')
        assert close != -1, f'{fname}: no </BaseLayout>'
        assert s.count('</BaseLayout>') == 1, f'{fname}: multiple BaseLayout closes'
        # guard: not already applied
        for k in keys:
            assert f'/articles/{G[k][0]}"' not in s, f'{fname}: link {k} already present'
        # guard: no collision with the Related-Tools section marker
        assert '<!-- Related Guides -->' not in s, f'{fname}: guides block already present'
        block = build_block(keys)
        s = s[:close] + block + s[close:]
        # post-conditions
        assert s.count('</BaseLayout>') == 1
        for k in keys:
            assert f'/articles/{G[k][0]}"' in s
        if apply:
            p.write_text(s)
        print(f'{fname}: {len(keys)} guide link(s) {"added" if apply else "(dry)"}')
    print('--- applied' if apply else '--- dry run')


if __name__ == '__main__':
    main()
