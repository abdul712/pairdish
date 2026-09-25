#!/usr/bin/env python3
"""Run-10 within-gate content: demand-responsive data sections on two thin tool pages.

  /tools/flour-substitution  -> "Flour Substitution by Weight" (weight table + worked
     conversions for the exact Bing queries: cake-flour grams, AP -> bread flour cups)
  /tools/buffet-planner      -> "Buffet Menu Planning That Holds Up on the Line"
     (category table + FSIS holding-temperature table)

Every number inserted here was verified against the quoted source in the same run
(King Arthur ingredient weight chart / product specs / substitution posts; FSIS
"Danger Zone"; UMN Extension quantity-food planning).
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

SRC_W = "https://www.kingarthurbaking.com/learn/ingredient-weight-chart"
SRC_CAKE = "https://www.kingarthurbaking.com/blog/2023/01/18/cake-flour-vs-all-purpose-flour"
SRC_BREAD = "https://www.kingarthurbaking.com/blog/2016/07/21/substitute-bread-flour-for-all-purpose-flour"
SRC_SELF = "https://www.kingarthurbaking.com/blog/2024/01/18/self-rising-flour"
SRC_FSIS = "https://www.fsis.usda.gov/food-safe-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"
SRC_UMN = "https://extension.umn.edu/food/preparing/cooking-at-home/cooking-safely-for-a-crowd/planning-the-quantity-food-occasion"

TH = ('class="border-b border-[var(--color-cream-dark)] px-4 py-3 text-sm font-semibold '
      'text-[var(--text-primary)]"')
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'

FLOUR_BLOCK = """
  <!-- Flour Substitution by Weight -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Flour Substitution by Weight: The Numbers Behind the Swap
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Volume is the reason flour substitutions go wrong. A "cup" of all-purpose flour can weigh
        anything from roughly 100 g to 145 g depending on whether it was scooped, spooned or sifted
        &mdash; and a two-tablespoon error is enough to turn a tender cake into a tough one. Every
        swap below is written as a weight ratio, so you can scale it to any recipe size and use
        <a href="/tools/unit-converter" class="text-[var(--color-wine)] underline">the unit
        converter</a> when the recipe only gives cups.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pt-3 text-left text-sm font-medium text-[var(--text-muted)]">
            One cup of flour on a scale, and what changes when you swap it in (King Arthur Baking
            ingredient weight chart and product specifications).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Flour</th>
              <th __TH__>1 cup weighs</th>
              <th __TH__>What changes when you swap it in</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>All-purpose</td>
              <td __TD__>120 g</td>
              <td __TD__>The default. 11.7% protein in the brand tested &mdash; strong enough for
              bread-ish doughs, weak enough for cookies and quick breads.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Bread flour</td>
              <td __TD__>120 g</td>
              <td __TD__>12.7% protein. Swaps 1:1 by weight or volume for all-purpose in a pinch;
              the dough absorbs slightly more liquid, so the crumb comes out a little tighter.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cake flour</td>
              <td __TD__>120 g</td>
              <td __TD__>10% protein &mdash; the tenderest of the three. Fine to use all-purpose
              instead; the reverse (cake flour into a bread recipe) risks a sunken or crumbly
              result because it cannot build enough gluten.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Whole wheat (100%)</td>
              <td __TD__>113 g</td>
              <td __TD__>Bran interferes with gluten, so whole wheat loaves are usually paired with a
              stronger flour &mdash; a 50/50 whole wheat and bread-flour blend was tested to give a
              better structure and rise than whole wheat and all-purpose.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Self-rising</td>
              <td __TD__>113 g</td>
              <td __TD__>Already contains baking powder and salt, so do not add more leavening on
              top of it. Swap it for all-purpose only after adjusting the recipe's leavening.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Pastry flour</td>
              <td __TD__>106 g</td>
              <td __TD__>Lighter than all-purpose, heavier than cake flour. Good 1:1 by weight for
              pie dough and biscuits that should stay flaky rather than chewy.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cornstarch</td>
              <td __TD__>112 g</td>
              <td __TD__>Not a flour substitute on its own &mdash; it is the tenderiser in every
              do-it-yourself cake flour blend (see the ratio below).</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Worked conversions
      </h3>
      <ul class="list-disc pl-6 mb-8 space-y-3 text-[var(--text-secondary)] text-base leading-relaxed">
        <li><strong>2&#189; cups all-purpose, but the shelf only has bread flour?</strong> Bread
        flour weighs the same per cup, so the swap is 1:1 &mdash; 2&#189; cups (300 g) of bread
        flour for 2&#189; cups (300 g) of all-purpose. Expect a slightly chewier result and be ready
        to add a splash of water if the dough feels stiff.</li>
        <li><strong>60 g of cake flour, built from all-purpose plus cornstarch?</strong> The
        published blend is 105 g all-purpose whisked with 14 g cornstarch to stand in for 1 cup
        (about 120 g) of cake flour. Scaled down: 60 g cake flour &#8776; 53 g all-purpose + 7 g
        cornstarch, whisked together twice so the starch is evenly distributed.</li>
        <li><strong>Measuring by spoons instead?</strong> That same blend is 3/4 cup + 2 tablespoons
        all-purpose plus 2 tablespoons cornstarch &mdash; the starch lowers the overall protein of
        the mixture to mimic cake flour and adds tenderness.</li>
        <li><strong>Making self-rising flour from all-purpose?</strong> Whisk 1 cup (120 g)
        all-purpose with 1&#189; teaspoons baking powder and &#188; teaspoon salt for each cup of
        self-rising flour the recipe calls for.</li>
      </ul>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        One caveat that matters more than the math: published weights and protein percentages are
        brand-specific. Milling companies blend different wheat, and substituting one brand's bread
        flour for another brand's all-purpose can move the protein level by two to three points,
        which is enough to change how a loaf rises. Check the bag you actually own, and once you
        have the weight, <a href="/tools/recipe-scaler" class="text-[var(--color-wine)] underline">scale
        the whole recipe</a> rather than adjusting one ingredient in isolation. For leavening
        maths that pair with these flours, see the
        <a href="/tools/yeast-converter" class="text-[var(--color-wine)] underline">yeast converter</a>
        and <a href="/tools/bread-proofing" class="text-[var(--color-wine)] underline">bread proofing
        calculator</a>.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: King Arthur Baking
        <a href="__SRC_W__" rel="noopener" class="text-[var(--color-wine)] underline">Ingredient
        Weight Chart</a>,
        <a href="__SRC_CAKE__" rel="noopener" class="text-[var(--color-wine)] underline">cake flour
        vs. all-purpose flour</a>,
        <a href="__SRC_BREAD__" rel="noopener" class="text-[var(--color-wine)] underline">how to
        substitute bread flour for all-purpose flour</a>, and
        <a href="__SRC_SELF__" rel="noopener" class="text-[var(--color-wine)] underline">self-rising
        flour</a>.
      </p>
    </div>
  </section>

"""

BUFFET_BLOCK = """
  <!-- Buffet Menu Planning -->
  <section class="py-16 bg-white">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Buffet Menu Planning That Holds Up on the Line
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Quantities are only half of a buffet. The other half is menu shape: how many options sit in
        each category, and whether the food can stay safe while guests work their way down the
        table. Extension guidance for group meals is explicit that a buffet needs planning for
        contrast in colour, texture, shape, temperature and flavour &mdash; and that self-service
        means portion control is lost, so each dish needs a little more headroom than a plated meal
        would.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pt-3 text-left text-sm font-medium text-[var(--text-muted)]">
            How many choices to put in each category, and what each one does for the table.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Category</th>
              <th __TH__>How many options</th>
              <th __TH__>Why it earns its place</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Protein / main</td>
              <td __TD__>2&ndash;3</td>
              <td __TD__>Guests choose by sight, and one option is always the one that empties
              first. Two structurally different mains (one roasted or braised, one lighter) cover
              most dietary drop-outs without a separate menu.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Starch</td>
              <td __TD__>2&ndash;3</td>
              <td __TD__>The volume filler that keeps a crowd fed when the mains run short. Vary the
              shape &mdash; a grain, a potato or bread-style item, and a pasta or rice.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Vegetable or salad</td>
              <td __TD__>2&ndash;3</td>
              <td __TD__>One cold or raw option and one cooked option give the temperature and
              texture contrast group meals are planned around.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Bread</td>
              <td __TD__>1&ndash;2</td>
              <td __TD__>Cheap insurance at the end of the line, and the carrier for whatever sauce
              or spread you are serving.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Sauce / condiment</td>
              <td __TD__>2</td>
              <td __TD__>One sharp or acidic, one rich. They let guests re-season a plate instead of
              leaving food behind.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Dessert</td>
              <td __TD__>1&ndash;2</td>
              <td __TD__>One dependable option beats three half-eaten ones; if the event runs long,
              a dessert that holds at room temperature is the safer pick.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Keep it out of the danger zone
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A buffet line is the highest-risk way to serve food, because everything sits out while people
        eat. The U.S. Department of Agriculture's Food Safety and Inspection Service publishes the
        limits &mdash; bacteria grow most rapidly between 40&nbsp;&#176;F and 140&nbsp;&#176;F,
        doubling in number in as little as 20 minutes, which is why the holding rules are strict.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[620px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pt-3 text-left text-sm font-medium text-[var(--text-muted)]">
            USDA FSIS holding rules for a self-service buffet.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Situation</th>
              <th __TH__>The rule</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Bacterial growth zone</td>
              <td __TD__>40&nbsp;&#176;F to 140&nbsp;&#176;F &mdash; numbers can double in as
              little as 20 minutes.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Hot dishes on the line</td>
              <td __TD__>Hold at or above 140&nbsp;&#176;F using chafing dishes, preheated steam
              tables, warming trays or slow cookers. Warm is not the same as hot.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cold dishes on the line</td>
              <td __TD__>Hold at or below 40&nbsp;&#176;F, with containers nested in ice where
              possible.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Total time out of refrigeration</td>
              <td __TD__>Two hours maximum. Above 90&nbsp;&#176;F &mdash; a summer cookout &mdash;
              cut that to one hour.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Packing away the leftovers</td>
              <td __TD__>Shallow containers and into the refrigerator within two hours; improper
              cooling is one of the most common causes of foodborne illness.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Reheating the next day</td>
              <td __TD__>To an internal temperature of 165&nbsp;&#176;F, or until hot and steaming;
              cover and rotate in a microwave so it heats evenly.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Two more habits that make a line run better. First, pre-portion anything risky &mdash; dips,
        dressings, sauces &mdash; into small serving dishes that can be swapped out when they hit
        the two-hour mark, instead of refilling one big bowl all afternoon. Second, keep the
        quantities honest: work out the head count in the
        <a href="/tools/party-calculator" class="text-[var(--color-wine)] underline">party food
        calculator</a>, add the drinks with the
        <a href="/tools/drink-calculator" class="text-[var(--color-wine)] underline">drink
        calculator</a>, and if the menu is mostly finger food, size it with the
        <a href="/tools/appetizer-planner" class="text-[var(--color-wine)] underline">appetizer
        planner</a> instead. The <a href="/articles/grocery-budget-meal-planning" class="text-[var(--color-wine)] underline">grocery
        budget guide</a> covers what those quantities cost at current U.S. prices.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: USDA Food Safety and Inspection Service,
        <a href="__SRC_FSIS__" rel="noopener" class="text-[var(--color-wine)] underline">"Danger
        Zone" (40&nbsp;&#176;F &ndash; 140&nbsp;&#176;F)</a>; University of Minnesota Extension,
        <a href="__SRC_UMN__" rel="noopener" class="text-[var(--color-wine)] underline">Planning the
        quantity food occasion</a>.
      </p>
    </div>
  </section>

"""


def insert(rel, block, anchor):
    p = ROOT / rel
    s = p.read_text(encoding="utf-8")
    if "Run-10" in s or block.strip()[:60] in s:
        return f"{rel}: ALREADY PRESENT (skipped)"
    n = s.count(anchor)
    if n != 1:
        raise SystemExit(f"{rel}: anchor found {n} times, expected 1")
    s = s.replace(anchor, block + anchor)
    p.write_text(s, encoding="utf-8")
    return f"{rel}: inserted {len(block)} chars before {anchor!r}"


def main():
    fb = (FLOUR_BLOCK.replace("__TH__", TH).replace("__TD__", TD)
          .replace("__SRC_W__", SRC_W).replace("__SRC_CAKE__", SRC_CAKE)
          .replace("__SRC_BREAD__", SRC_BREAD).replace("__SRC_SELF__", SRC_SELF))
    bb = (BUFFET_BLOCK.replace("__TH__", TH).replace("__TD__", TD)
          .replace("__SRC_FSIS__", SRC_FSIS).replace("__SRC_UMN__", SRC_UMN))
    print(insert("src/pages/tools/flour-substitution.astro", fb, "  <!-- Related Tools -->"))
    print(insert("src/pages/tools/buffet-planner.astro", bb, "  <!-- Related Tools -->"))


if __name__ == "__main__":
    main()
