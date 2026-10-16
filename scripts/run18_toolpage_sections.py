#!/usr/bin/env python3
"""Run-18 within-gate content work.

Three demand-matched tool-page expansions, each tied to a live Bing ridge in
outreach/bing_queries_run18.txt (window unchanged: 701 queries / 72 clicks / 1,101 impressions):

  /tools/cooking-time        <- "proofing bread dough twice its size baking temperature 180 c" (4),
                                "final proof enriched dough 24 25 c hokkaido milk bread poke test" (4),
                                "bread dough proofing 6 hours room temperature food safety yeast
                                dough" (4) -> the baking-temperature / internal-temperature ridge.
  /tools/unit-converter      <- the largest real cluster in the window: the flour cup<->gram
                                conversion conversation ("for 60 grams of cake flour, how much
                                all-purpose and how much corn flour should i use?" 4, "no, 3 cups
                                flour + cornstarch" 4, "how much cake flour for 2 3/4 cup ap
                                flour" 3, "20 cups plain flour and 5 cups cornstarch" 2, plus
                                ~40 one-impression phrasings) -- ~60+ impressions.
  /tools/sourdough-calculator<- "final proof enriched dough 24 25 c hokkaido milk bread poke test" (4),
                                "my dough is 82 degrees how long should it proof" (3), "instant yeast
                                bread dough first rise 2 hours overproof room temperature" (1),
                                "yeast dough proofing double size temperature time enriched dough" (1),
                                "bread dough prove measurer" (1), "81 degrees bread" (1) -- the
                                dough-temperature / proofing cluster.

Facts were re-fetched and read in THIS run before writing:
  * safe minimum internal temperatures, the rest-time instruction and the reheat/holding figures --
    read from USDA FSIS "Safe Minimum Internal Temperature Chart" (last updated 2025-04-14),
    reached through an independent fetch path because fsis.usda.gov answers 403 to every scripted
    UA from this box;
  * the danger-zone clock (2 hours out of refrigeration, 1 hour above 90 F, hot holding at or
    above 140 F, cold holding at or below 40 F, reheat to 165 F) -- read from USDA FSIS
    "Danger Zone (40 F - 140 F)" through the same path;
  * the legal U.S. cooking measures used on food labels -- read verbatim from 21 CFR
    101.9(b)(5)(viii) on eCFR: a teaspoon means 5 mL, a tablespoon 15 mL, a cup 240 mL,
    1 fl oz 30 mL, 1 oz in weight 28 g;
  * one-cup gram weights for flours, sugars, cocoa, cornstarch, butter, water, milk, honey, salt,
    oats and cornmeal -- read from the King Arthur Baking ingredient weight chart;
  * starter maintenance (minimum 1:1:1 starter:flour:water by weight, discard each feed, room
    temperature fed daily or refrigerator fed weekly, ready when it doubles within 4-6 hours and
    floats in water) -- read from Clemson HGIC "How to Make, Feed, and Bake With a Sourdough
    Starter"; 1:1:1 = 50 g each = 150 g (about 2/3 cup) and the fridge/room-temperature options --
    read from the King Arthur Baking "Feeding and Maintaining Your Sourdough Starter" recipe;
  * the proofing temperature band (breads do well at 72-78 F), the doubling expectation and the
    poke test -- read from King Arthur Baking "What is proofing bread?".

Also fixes a standing site-rule violation found by this run's audit: /contact shipped a visible
"Frequently Asked Questions" section. Restructured (not deleted) into a topic section with
statement headings; every answer sentence is preserved verbatim.

Usage: python3 scripts/run18_toolpage_sections.py [--check]
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# --------------------------------------------------- cooking-time
COOKING = """
  <!-- FSIS safe minimum internal temperatures + the holding clock -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Safe Minimum Internal Temperatures: the Numbers Behind the Timer
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Recipes give you minutes because minutes are what a cook can watch. The federal food-safety
        guidance gives you degrees, because degrees are what a thermometer can check. The two are
        not interchangeable: a roast that reaches its target temperature five minutes early is
        done, and a roast that has sat in the oven for the recipe's full time can still be under
        done if it started cold or the oven ran low. The table below is the published target list
        used by the U.S. Department of Agriculture's Food Safety and Inspection Service, and it is
        meant to be read with a probe thermometer in hand.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Safe minimum internal temperatures (USDA FSIS, last updated 14 April 2025). Measure
            with a food thermometer before the food leaves the heat source.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Product</th>
              <th __TH__>Minimum internal temperature</th>
              <th __TH__>Rest time</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Beef, pork, veal and lamb steaks, chops and roasts</td>
              <td __TD__>145 &deg;F (62.8 &deg;C)</td>
              <td __TD__>At least 3 minutes</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Ground meats (beef, pork, veal, lamb)</td>
              <td __TD__>160 &deg;F (71.1 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Ground poultry</td>
              <td __TD__>165 &deg;F</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Ham, fresh or smoked (uncooked)</td>
              <td __TD__>145 &deg;F (62.8 &deg;C)</td>
              <td __TD__>At least 3 minutes</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Fully cooked ham, reheated</td>
              <td __TD__>140 &deg;F (60 &deg;C) if packaged in a USDA-inspected plant; 165 &deg;F (73.9 &deg;C) otherwise</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>All poultry &mdash; breasts, whole bird, legs, thighs, wings, giblets, stuffing</td>
              <td __TD__>165 &deg;F (73.9 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Eggs and egg dishes</td>
              <td __TD__>160 &deg;F (71.1 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Fish and shellfish</td>
              <td __TD__>145 &deg;F (62.8 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Leftovers</td>
              <td __TD__>165 &deg;F (73.9 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Casseroles</td>
              <td __TD__>165 &deg;F (73.9 &deg;C)</td>
              <td __TD__>Not specified</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The rest time is not a serving suggestion. FSIS writes the three-minute rest into the same
        line as the 145 &deg;F figure for steaks, chops and roasts, which means the temperature and
        the waiting are one instruction. There is a mechanical reason: a roast pulled from the oven
        keeps rising in temperature as heat migrates from the surface to the centre, so the reading
        you take at the moment you move it to the board is not the reading five minutes later.
        Carrying the meat to its rest and then slicing it early is what produces the pool of juice
        on the board &mdash; the liquid leaves with the cut instead of staying in it.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Convert the targets once and keep them on the fridge. The
        <a href="/tools/oven-temperature" class="text-[var(--color-wine)] underline">oven temperature
        converter</a> handles the Celsius side of the same problem, and the
        <a href="/tools/unit-converter" class="text-[var(--color-wine)] underline">unit converter</a>
        covers the weights and volumes you measure the rest of the meal in.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        How long food can wait once it is cooked
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Cooking time ends when the food comes off the heat. What happens next has its own published
        limits, and they are the ones most often broken at a buffet, a cookout or a holiday table,
        where the food is held for the length of the meal rather than eaten straight away.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[620px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Holding and resting limits (USDA FSIS).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Situation</th>
              <th __TH__>Published limit</th>
              <th __TH__>Why it is the number it is</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Food left out of refrigeration</td>
              <td __TD__>Never more than 2 hours</td>
              <td __TD__>Bacteria grow most rapidly between 40 &deg;F and 140 &deg;F and can double in number in as little as 20 minutes.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Food left out when the air temperature is above 90 &deg;F</td>
              <td __TD__>Not more than 1 hour</td>
              <td __TD__>A hot room shortens the safe window; the same 20-minute doubling applies faster.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Hot holding at the table or on a buffet</td>
              <td __TD__>140 &deg;F or above</td>
              <td __TD__>Chafing dishes, preheated steam tables, warming trays and slow cookers are the listed equipment.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cold holding at the table or on a buffet</td>
              <td __TD__>40 &deg;F or below</td>
              <td __TD__>Keep containers on ice; this is the bottom edge of the danger zone.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Reheating leftovers</td>
              <td __TD__>165 &deg;F, or until hot and steaming</td>
              <td __TD__>Higher than the original cook temperature because the food has been handled and stored since.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        One practical consequence for timing: build the rest into the plan instead of treating it as
        dead time. If a roast needs three minutes on the board before carving, that is three minutes
        you can spend moving the
        <a href="/tools/buffet-planner" class="text-[var(--color-wine)] underline">buffet</a> to the
        table, and it is also three minutes the
        <a href="/tools/sourdough-calculator" class="text-[var(--color-wine)] underline">bread or
        dough</a> sitting next to it does not get. The
        <a href="/tools/recipe-scaler" class="text-[var(--color-wine)] underline">recipe scaler</a>
        handles the quantity side of the same meal.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart" rel="noopener" class="text-[var(--color-wine)] underline">USDA Food Safety and Inspection Service, &ldquo;Safe Minimum Internal Temperature Chart&rdquo;</a>;
        <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f" rel="noopener" class="text-[var(--color-wine)] underline">USDA FSIS, &ldquo;Danger Zone (40 &deg;F &ndash; 140 &deg;F)&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# --------------------------------------------------- unit-converter
UNITS = """
  <!-- Legal U.S. cooking measures + one-cup weights -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        How a Cup Is Actually Defined
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        There is no single international cup. A U.S. recipe cup, a metric cup and a British cup are
        three different volumes, which is why a converter is worth more than a conversion chart.
        For food sold in the United States there is one authoritative set of definitions: the
        nutrition-labelling rule spells out the household measures in metric terms, and those
        rounded numbers are what appears on every U.S. nutrition label and in every recipe that has
        been checked against them.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[560px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Household measures as defined for U.S. nutrition labelling, 21 CFR 101.9(b)(5)(viii).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Measure</th>
              <th __TH__>Label definition</th>
              <th __TH__>Equals</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Teaspoon</td>
              <td __TD__>5 mL</td>
              <td __TD__>The base unit for small measures; three make a tablespoon.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Tablespoon</td>
              <td __TD__>15 mL</td>
              <td __TD__>Three teaspoons.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cup</td>
              <td __TD__>240 mL</td>
              <td __TD__>Sixteen tablespoons, or eight labelled fluid ounces.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Fluid ounce</td>
              <td __TD__>30 mL</td>
              <td __TD__>Two tablespoons.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Ounce in weight</td>
              <td __TD__>28 g</td>
              <td __TD__>The weight ounce, not the fluid ounce &mdash; the two are not interchangeable.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Those labelling values are deliberately rounded, and it is worth knowing by how much. Eight
        fluid ounces of the customary U.S. fluid ounce (29.5735 mL) come to 236.6 mL, so the
        labelled 240 mL cup is about 1.4 per cent larger than the cup you would pour from a
        graduated jug. That gap never matters for a single cake and it does matter when a
        commercial recipe is scaled by a hundred. Where the number has to be exact, weigh the
        ingredient instead &mdash; a cup is a volume, and the same volume of two powders weighs two
        different amounts.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        What one cup actually weighs
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        This is the table the flour-conversion questions all come down to. Fill a cup by scooping
        straight from the bag and you compact the flour and add on the order of ten to twenty per
        cent more of it; spoon it in and level it and you get the published figure. Both methods
        are called "one cup", and the recipes that work in grams are the ones that avoid the
        argument.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Published one-cup weights (King Arthur Baking ingredient weight chart; figures listed
            by the chart in cups, half cups or quarter cups are stated per cup here).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Ingredient</th>
              <th __TH__>1 cup weighs</th>
              <th __TH__>Per tablespoon</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>All-purpose flour</td>
              <td __TD__>120 g (4&#188; oz)</td>
              <td __TD__>About 7.5 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Bread flour</td>
              <td __TD__>120 g (4&#188; oz)</td>
              <td __TD__>About 7.5 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cake flour, unbleached</td>
              <td __TD__>120 g (4&#188; oz)</td>
              <td __TD__>About 7.5 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Whole wheat flour</td>
              <td __TD__>113 g (4 oz)</td>
              <td __TD__>About 7 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Self-rising flour</td>
              <td __TD__>113 g (4 oz)</td>
              <td __TD__>About 7 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cornstarch</td>
              <td __TD__>112 g (4 oz)</td>
              <td __TD__>About 7 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Sugar (granulated white)</td>
              <td __TD__>198 g (7 oz)</td>
              <td __TD__>About 12 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Brown sugar, packed</td>
              <td __TD__>213 g (7&#189; oz)</td>
              <td __TD__>About 13 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Confectioners' sugar, unsifted</td>
              <td __TD__>113 g (4 oz)</td>
              <td __TD__>About 7 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cocoa, unsweetened</td>
              <td __TD__>84 g (listed at 42 g per &#189; cup)</td>
              <td __TD__>About 5 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Butter</td>
              <td __TD__>227 g (8 oz; listed at 113 g per &#189; cup)</td>
              <td __TD__>About 14 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Water or milk</td>
              <td __TD__>227 g (8 oz)</td>
              <td __TD__>About 14 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Honey</td>
              <td __TD__>336 g (listed at 21 g per tablespoon)</td>
              <td __TD__>21 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Table salt</td>
              <td __TD__>288 g (listed at 18 g per tablespoon)</td>
              <td __TD__>18 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Rolled oats</td>
              <td __TD__>89 g (3&#8539; oz)</td>
              <td __TD__>About 5.5 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cornmeal, whole</td>
              <td __TD__>138 g (4&#8541; oz)</td>
              <td __TD__>About 8.6 g</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Read the table as a set of density conversions rather than a fixed law. A cup of flour
        holds 240 mL of volume whichever way you fill it; what changes is how much flour occupies
        that volume. Once you have the gram weight, the
        <a href="/tools/flour-substitution" class="text-[var(--color-wine)] underline">flour
        substitution calculator</a> turns it into a swap between flour types, and the
        <a href="/tools/recipe-scaler" class="text-[var(--color-wine)] underline">recipe scaler</a>
        applies it to a whole recipe instead of a single line.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9" rel="noopener" class="text-[var(--color-wine)] underline">21 CFR 101.9(b)(5)(viii), nutrition labelling of food, on eCFR</a>;
        <a href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart" rel="noopener" class="text-[var(--color-wine)] underline">King Arthur Baking, ingredient weight chart</a>.
      </p>
    </div>
  </section>
"""

# --------------------------------------------------- sourdough-calculator
SOURDOUGH = """
  <!-- Starter ratios, ripening checks and dough temperature -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Feeding Ratios, Ripening Checks and Dough Temperature
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Hydration is the arithmetic of a sourdough recipe; the starter is the part that is alive,
        and living things keep their own schedule. That is why two bakers can follow the same
        formula and get dough that proofs in four hours and dough that proofs in nine. The
        published extension and test-kitchen guidance below covers the two variables you actually
        control &mdash; how much food you give the starter, and how warm you keep the dough.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[660px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Starter feeding and storage, from Clemson Extension and the King Arthur Baking test
            kitchen. Ratios are by weight, not volume.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Practice</th>
              <th __TH__>Published guidance</th>
              <th __TH__>What it means for your schedule</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Maintenance ratio</td>
              <td __TD__>A minimum of 1:1:1 &mdash; equal parts starter, flour and water by weight, discarding starter at each feed</td>
              <td __TD__>One part starter carried over, one part fresh flour, one part water.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>A worked 1:1:1 feed</td>
              <td __TD__>50 g starter + 50 g flour + 50 g water = 150 g of starter, about &#8532; cup</td>
              <td __TD__>King Arthur calls 150 g an ideal amount to keep on hand; scale all three numbers together to keep more.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Kept at room temperature</td>
              <td __TD__>Feed it daily</td>
              <td __TD__>The organisms in a starter thrive at room temperature, so this is the option for baking several times a week.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Kept in the refrigerator</td>
              <td __TD__>Feed it about once a week, then give it a few room-temperature feedings before baking</td>
              <td __TD__>Cold storage slows the culture; the extra feedings are what wake it back up.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Readiness &mdash; rise</td>
              <td __TD__>It should rise to double its size within 4 to 6 hours after feeding</td>
              <td __TD__>Clemson Extension's first test. No rise means keep feeding on the 12-hour routine.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Readiness &mdash; float test</td>
              <td __TD__>A small spoonful placed in a bowl of water floats when the starter is ready</td>
              <td __TD__>Clemson Extension's second test, and the quickest one to run on the day.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Beyond the minimum</td>
              <td __TD__>Higher flour-to-starter ratios extend the time between feedings</td>
              <td __TD__>Use them when you want to feed tonight and bake tomorrow rather than twice a day.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Dough temperature, and what it does to proofing time
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Once the dough is mixed, temperature is the dial. Yeast activity rises with warmth, so a
        dough that proofs in a warm kitchen can finish in half the time of the same dough on a cold
        counter, and the failure mode at the fast end is over-proofing &mdash; the dough puffs,
        then collapses, and no amount of baking brings the structure back. King Arthur's baking
        ambassador Martin Philip puts the working band for bread dough at 72 &deg;F to 78 &deg;F,
        described as warm enough to encourage yeast activity without letting the dough move so fast
        that it over-proofs or fails to develop flavour.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        With the dough in that band, proofing is judged by the dough rather than the clock. Bread
        typically doubles, or nearly doubles, in size as it proofs. For a shaped loaf in a tin the
        published test is height: look for the dough to rise about an inch above the lip of the pan
        and measure it rather than guessing. For a free-form loaf the test is the poke &mdash;
        lightly flour a finger, press the dough down about an inch, and read the indentation. If
        the indent stays, the loaf is ready to bake; if it springs back out, it needs more time.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Where the starter goes in the hydration arithmetic
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A starter is not a free ingredient. At 100 per cent hydration it is half flour and half
        water by weight, so it counts toward both sides of the ratio. The table works the same
        dough three ways: 500 g of total flour, 100 g of starter, and three target hydrations. In
        every row the flour you add is 450 g, because 50 g of the flour is already inside the
        starter.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            One dough, three targets: 500 g total flour including 100 g of 100 per cent hydration
            starter (50 g flour + 50 g water).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Target hydration</th>
              <th __TH__>Total water</th>
              <th __TH__>Water still to add</th>
              <th __TH__>Flour still to add</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>65% &mdash; stiff, for sandwich loaves</td>
              <td __TD__>325 g</td>
              <td __TD__>275 g</td>
              <td __TD__>450 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>70% &mdash; a middle ground</td>
              <td __TD__>350 g</td>
              <td __TD__>300 g</td>
              <td __TD__>450 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>75% &mdash; open-crumb country loaf</td>
              <td __TD__>375 g</td>
              <td __TD__>325 g</td>
              <td __TD__>450 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>80% &mdash; high hydration, harder to handle</td>
              <td __TD__>400 g</td>
              <td __TD__>350 g</td>
              <td __TD__>450 g</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Read the third column as the number you put on the scale and the second as the number you
        are aiming at. If you change the starter weight, both the flour and the water you add move
        in opposite directions, which is exactly the correction the calculator above automates. For
        the leavening conversions that sit alongside this one, see the
        <a href="/tools/yeast-converter" class="text-[var(--color-wine)] underline">yeast
        converter</a> and the
        <a href="/tools/bread-proofing" class="text-[var(--color-wine)] underline">bread proofing
        calculator</a>, and for the bake itself the
        <a href="/tools/oven-temperature" class="text-[var(--color-wine)] underline">oven
        temperature converter</a> covers the gas-mark and convection adjustments.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://hgic.clemson.edu/how-to-make-feed-and-bake-with-a-sourdough-starter-sourdough-101-guide/" rel="noopener" class="text-[var(--color-wine)] underline">Clemson University Home &amp; Garden Information Center, &ldquo;How to Make, Feed, and Bake With a Sourdough Starter&rdquo;</a>;
        <a href="https://www.kingarthurbaking.com/recipes/feeding-and-maintaining-your-sourdough-starter-recipe" rel="noopener" class="text-[var(--color-wine)] underline">King Arthur Baking, &ldquo;Feeding and Maintaining Your Sourdough Starter&rdquo;</a>;
        <a href="https://www.kingarthurbaking.com/blog/2023/08/31/proofing-bread" rel="noopener" class="text-[var(--color-wine)] underline">King Arthur Baking, &ldquo;What is proofing bread? And how do I get it right?&rdquo;</a>.
      </p>
    </div>
  </section>
"""

BLOCKS = {
    "src/pages/tools/cooking-time.astro": COOKING,
    "src/pages/tools/unit-converter.astro": UNITS,
    "src/pages/tools/sourdough-calculator.astro": SOURDOUGH,
}

ANCHOR = "  <!-- Related Tools -->"

# --------------------------------------------------- /contact FAQ restructure
CONTACT_REPLACEMENTS = [
    ("        <!-- FAQ Section -->\n", "        <!-- Service information -->\n"),
    ("            Frequently Asked Questions\n", "            Working With PairDish\n"),
    ("                Are the tools free to use?\n", "                Every tool on the site is free to use\n"),
    ("                Can I suggest a new tool?\n", "                Tool suggestions are welcome\n"),
    ("                How accurate are the pairing suggestions?\n", "                Where the pairing suggestions come from\n"),
    ("                Do you offer an API for developers?\n", "                API access for developers\n"),
]


def main() -> int:
    check = "--check" in sys.argv
    rc = 0
    for rel, block in BLOCKS.items():
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        body = block.replace("__TH__", TH).replace("__TD__", TD).replace("__SC__", SC).rstrip() + "\n"
        if ANCHOR not in s:
            print(f"FAIL {rel}: anchor not found")
            rc = 1
            continue
        head = block.strip().splitlines()[0].strip()
        if head in s:
            print(f"skip {rel}: block already present")
            continue
        new = s.replace(ANCHOR, body + "\n" + ANCHOR, 1)
        if check:
            print(f"would update {rel}: +{len(new) - len(s)} chars")
            continue
        p.write_text(new, encoding="utf-8")
        print(f"updated {rel}: +{len(new) - len(s)} chars")

    p = ROOT / "src/pages/contact.astro"
    s = p.read_text(encoding="utf-8")
    if "Frequently Asked Questions" not in s:
        print("skip src/pages/contact.astro: already restructured")
    else:
        new = s
        for old, rep in CONTACT_REPLACEMENTS:
            if old not in new:
                print(f"FAIL contact.astro: pattern not found -> {old.strip()[:60]}")
                rc = 1
                continue
            new = new.replace(old, rep, 1)
        if check:
            print(f"would update src/pages/contact.astro: +{len(new) - len(s)} chars")
        else:
            p.write_text(new, encoding="utf-8")
            print(f"updated src/pages/contact.astro: +{len(new) - len(s)} chars")
            assert "Frequently Asked Questions" not in new
    return rc


if __name__ == "__main__":
    raise SystemExit(main())
