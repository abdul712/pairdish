#!/usr/bin/env python3
"""Run-16 within-gate content: demand-matched sections on three tool pages.

Every block is matched to a live Bing query ridge (outreach/bing_queries_run16.txt,
window advanced this run: 701 queries / 72 clicks / 1,101 impressions):

  /tools/macro-calculator        <- "macro balance calculator" 7,
                                    "macro balancing calculator" 2,
                                    "macro balancing formula" 3   (~12 impr cluster)
  /tools/sugar-substitution      <- "1/3 cup real maple syrup to monk fruit cooking ratio" 2,
                                    "how much monk fruit sweetener would 1/3 cup maple syrup be" 2,
                                    "replacement mixture percentage formula honey syrup ratio" 2,
                                    "1/3 cup real maple syrup to monk fruit ratio" 1,
                                    "baking stevia substitute maple syrup muffins liquid adjustment" 1,
                                    "liquid stevia versus monk fruit proportions calculator" 1,
                                    "clalculate granulated sugar into liquid sugar" 1  (~10 impr)
  /tools/herb-spice-matrix       <- "herbs and spices pairing flavor wheel" 5,
                                    "culinary herb spice pairings dill parsley cumin basil rosemary
                                     mint oregano thyme chives bay coriander nutmeg cajun" 3,
                                    "mapping of herb flavors" 2, "herbs and spices match up" 1 (~11)

Facts were re-verified in THIS run before writing:
  * calorie factors 4 / 4 / 9 (+ 2 for soluble non-digestible carbohydrate; sugar-alcohol
    factors 0-3.0) read verbatim from 21 CFR 101.9(c)(1)(i) on ecfr.gov;
  * protein 1.2-1.6 g/kg/day, added sugars <= 10 g per meal, saturated fat <= 10% of calories
    read from the current Dietary Guidelines for Americans, 2025-2030 (USDA FNS);
  * honey / corn-syrup / maple-syrup / molasses / brown-sugar / fresh-herb conversion rows and
    the spice-blend substitutions from Colorado State University Extension;
  * sweetness-independent calorie-per-gram values and canning suitability from Utah State
    University Extension Table 1;
  * high-intensity sweetener regulation (GRAS class, no premarket approval) from FDA;
  * honey and infants under 1 year from CDC Botulism Prevention;
  * taste descriptors and partner lists from the Penn State Extension herb & spice pairing chart.

Inserts each block immediately before the page's "<!-- Related Tools -->" anchor.
Usage: python3 scripts/run16_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# ------------------------------------------------- macro-calculator
MACRO = """
  <!-- Macro balancing: calorie factors + percentage-to-grams math -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        The Macro Balancing Math Behind the Percentages
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A macro split is only half a plan. The percentages say how the day&rsquo;s calories are
        divided; they say nothing about how many grams of each nutrient that works out to, and the
        grams are the number you actually weigh. The conversion depends on how much energy a gram of
        each macronutrient carries &mdash; and those figures are not a fitness-app convention. They
        are the general factors the U.S. Food and Drug Administration uses to calculate the calorie
        content printed on a nutrition label.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Calorie factors used for U.S. nutrition labelling (21 CFR 101.9(c)(1)(i)).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Nutrient</th>
              <th __TH__>Calories per gram</th>
              <th __TH__>What it means on a 2,000-calorie day</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Protein</td>
              <td __TD__>4</td>
              <td __TD__>100 g is 400 calories &mdash; a fifth of the day from a food you may think of
                as &ldquo;free&rdquo;.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Total carbohydrate</td>
              <td __TD__>4</td>
              <td __TD__>The same 4 as protein, which is why a high-carb day fills up fast.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Total fat</td>
              <td __TD__>9</td>
              <td __TD__>One gram of fat carries as much energy as 2.25 grams of protein or
                carbohydrate.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Soluble non-digestible carbohydrate (fibre)</td>
              <td __TD__>2</td>
              <td __TD__>Counted at half rate, not the full 4.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Sugar alcohols</td>
              <td __TD__>0 to 3</td>
              <td __TD__>Isomalt and lactitol 2.0, xylitol 2.4, maltitol 2.1, sorbitol 2.6,
                hydrogenated starch hydrolysates 3.0, mannitol 1.6, erythritol 0.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        From a percentage to grams
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Multiply the calorie target by the percentage for that macro, then divide by its factor
        &mdash; 4 for protein and carbohydrate, 9 for fat. A 2,000-calorie day at 40% protein,
        35% carbohydrate and 25% fat becomes 2,000 &times; 0.40 &divide; 4 = 200 g of protein,
        2,000 &times; 0.35 &divide; 4 = 175 g of carbohydrate and 2,000 &times; 0.25 &divide; 9 =
        56 g of fat.
      </p>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Four common splits converted to grams at 2,000 calories.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Split (protein / carbohydrate / fat)</th>
              <th __TH__>Protein</th>
              <th __TH__>Carbohydrate</th>
              <th __TH__>Fat</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Balanced 25 / 50 / 25</td>
              <td __TD__>125 g</td>
              <td __TD__>250 g</td>
              <td __TD__>56 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>High protein 40 / 35 / 25</td>
              <td __TD__>200 g</td>
              <td __TD__>175 g</td>
              <td __TD__>56 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Low carb 30 / 30 / 40</td>
              <td __TD__>150 g</td>
              <td __TD__>150 g</td>
              <td __TD__>89 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Ketogenic 20 / 5 / 75</td>
              <td __TD__>100 g</td>
              <td __TD__>25 g</td>
              <td __TD__>167 g</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        Run the arithmetic back the other way and the rounding shows up. The balanced row is
        125 &times; 4 + 250 &times; 4 + 56 &times; 9 = 2,004 calories, not 2,000. That gap is the
        reason a plan can be built exactly to its percentages and still miss the calorie target by a
        few calories a day.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Why the totals never land exactly
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        <li>Grams are rounded to whole numbers and the calories they carry are not. The imbalance is
          always small, but it is always there.</li>
        <li>Fibre sits inside the carbohydrate total and is counted at 2 calories per gram, so a
          high-fibre day delivers less energy than the plain 4-per-gram arithmetic predicts.</li>
        <li>Sugar alcohols in protein bars and reduced-sugar sweets run from 0 to 3 calories per
          gram, so two bars with the same protein figure can carry very different calorie totals.</li>
        <li>Alcoholic drinks carry calories that no macro percentage accounts for. A drink on a
          training day is the usual reason the numbers will not reconcile.</li>
      </ul>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Two official anchors to check a plan against
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>The current Dietary Guidelines for Americans set a protein goal of <strong>1.2 to 1.6
          grams per kilogram of body weight per day</strong>, adjusted for calories. For a 70 kg
          adult that is 84 to 112 g &mdash; convert it per person with the
          <a href="/tools/protein-calculator" __SC__>protein calculator</a>.</li>
        <li>They set a ceiling rather than a target for added sugars: no single meal should contain
          more than 10 grams. Check what the sweetener in a recipe contributes with the
          <a href="/tools/sugar-substitution" __SC__>sugar substitution tool</a>.</li>
        <li>Saturated fat should not exceed 10% of total daily calories &mdash; about 22 g on a
          2,000-calorie day. Because fat carries 9 calories per gram, that ceiling arrives sooner
          than most people expect.</li>
      </ul>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-101/subpart-A/section-101.9" rel="noopener" __SC__>21 CFR 101.9(c)(1)(i), &ldquo;Nutrition labelling of food&rdquo; (calorie factors)</a>;
        <a href="https://cdn.realfood.gov/DGA.pdf" rel="noopener" __SC__>USDA Food and Nutrition Service, <em>Dietary Guidelines for Americans, 2025&ndash;2030</em></a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- sugar-substitution
SUGAR = """
  <!-- Liquid sweetener conversions + high-intensity sweeteners -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Converting Liquid Sweeteners Without Breaking the Recipe
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Liquid sweeteners are not a one-for-one swap for sugar. They carry water, they brown at
        different rates, and some of them pull a recipe&rsquo;s acid and soda balance out of line.
        The rows below are the substitution rules published by Colorado State University Extension,
        written in the direction a recipe question usually arrives: the recipe calls for one cup of
        this sweetener, so what do I use instead.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Sweetener-to-sugar conversions (Colorado State University Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Called for</th>
              <th __TH__>Replace with</th>
              <th __TH__>Adjust the rest of the recipe</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Honey, 1 cup</td>
              <td __TD__>1 1/4 cups sugar</td>
              <td __TD__>Add 1/4 cup of the liquid already in the recipe.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Corn syrup, 1 cup</td>
              <td __TD__>1 cup granulated sugar, or 1 cup honey</td>
              <td __TD__>With the sugar, add 1/4 cup of the liquid in the recipe.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Maple syrup</td>
              <td __TD__>2 cups sugar plus 1 cup water, boiled clear, then 1/2 tsp maple
                flavouring</td>
              <td __TD__>None &mdash; the water is already in the substitute.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Molasses, 1 cup</td>
              <td __TD__>3/4 cup sugar</td>
              <td __TD__>Increase liquid by 5 tbsp, drop the baking soda by 1/2 tsp, and add 2 tsp
                baking powder.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Brown sugar, 1 cup</td>
              <td __TD__>1 cup granulated sugar, or 1 cup granulated plus 1/4 cup unsulphured
                molasses</td>
              <td __TD__>Nothing, unless you build it from molasses, which brings its own acid.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Sweeteners differ in calories as much as in sweetness
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The calorie-per-gram figures below come from Utah State University Extension&rsquo;s
        comparison of frequently used sweeteners. Note what they say about the natural liquids: a
        gram of honey, agave or maple syrup carries 3 calories against the 4 in table sugar, while
        the high-intensity sweeteners contribute none.
      </p>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Calories per gram and suitability for home canning (Utah State University Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Sweetener</th>
              <th __TH__>Calories per gram</th>
              <th __TH__>Listed as suitable for canning</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Sucrose (table sugar)</td>
              <td __TD__>4</td>
              <td __TD__>Yes</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Light corn syrup</td>
              <td __TD__>4</td>
              <td __TD__>Yes</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Honey</td>
              <td __TD__>3</td>
              <td __TD__>Yes</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Agave</td>
              <td __TD__>3</td>
              <td __TD__>No</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Maple syrup</td>
              <td __TD__>3</td>
              <td __TD__>No</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Stevia</td>
              <td __TD__>0</td>
              <td __TD__>Only in jams and jellies made with no-sugar pectin</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Monk fruit</td>
              <td __TD__>0</td>
              <td __TD__>No</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        That third column matters more than the second if you preserve food. A sweetener can be
        perfectly safe to bake with and still not be a safe substitute in a jar, because sugar also
        controls water activity in preserved fruit and jam. Of the natural liquid sweeteners, only
        honey is listed as suitable for canning; agave and maple syrup are not.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        What the label means by &ldquo;substitute&rdquo;
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The Food and Drug Administration regulates high-intensity sweeteners as food additives
        unless their use as a sweetener is generally recognized as safe, the GRAS class that stevia
        and monk fruit sit in. That is why they reach the shelf without a premarket approval step.
        Two consequences follow for cooking. They are many times sweeter than table sugar, so a
        fraction of a spoon replaces a cup, and they contribute few or no calories and generally do
        not raise blood sugar. The calculator above converts sweetness; it does not restore the
        volume or the browning that the sugar itself was providing.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The Dietary Guidelines for Americans count liquid sweeteners as added sugars &mdash; honey,
        agave syrup, corn syrup and molasses are all named in the added-sugar list, and the guidance
        caps a meal at 10 grams. Swapping one liquid for another changes the flavour and the water
        balance, not the classification.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        One safety rule that overrides taste
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Do not feed honey to a child younger than 1 year. Honey can contain the spores that cause
        infant botulism, and the warning covers honey as an ingredient and products made with it.
        For a baby&rsquo;s food, use a different sweetener or none at all.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://extension.colostate.edu/resource/ingredient-substitutions/" rel="noopener" __SC__>Colorado State University Extension, &ldquo;Ingredient Substitutions&rdquo;</a>;
        <a href="https://extension.usu.edu/preserve-the-harvest/research/reduced-sugar-preservation" rel="noopener" __SC__>Utah State University Extension, &ldquo;Reduced Sugar and Sugar-free Food Preservation&rdquo;</a>;
        <a href="https://www.fda.gov/food/food-additives-petitions/high-intensity-sweeteners" rel="noopener" __SC__>U.S. Food and Drug Administration, &ldquo;High-Intensity Sweeteners&rdquo;</a>;
        <a href="https://www.cdc.gov/botulism/prevention/index.html" rel="noopener" __SC__>U.S. Centers for Disease Control and Prevention, &ldquo;Botulism Prevention&rdquo;</a>;
        <a href="https://cdn.realfood.gov/DGA.pdf" rel="noopener" __SC__>USDA Food and Nutrition Service, <em>Dietary Guidelines for Americans, 2025&ndash;2030</em></a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- herb-spice-matrix
HERB = """
  <!-- Flavour-family mapping + build-your-own blend substitutions -->
  <section class="py-16 bg-white">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Mapping Herbs and Spices by Taste, Not by Food
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A flavour wheel groups seasonings by the taste they carry rather than by what they are
        traditionally sprinkled on. That is the more useful direction when you are holding an
        unfamiliar jar: place it next to the seasonings whose taste descriptor it shares, and the
        pairings write themselves. Penn State Extension&rsquo;s herb and spice pairing chart lists a
        taste descriptor and a set of partners for each seasoning; the table below is that chart,
        reordered so the families sit together.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Taste descriptor and partners for sixteen seasonings (Penn State Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Seasoning</th>
              <th __TH__>Taste</th>
              <th __TH__>Partners</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Basil</td>
              <td __TD__>Sweet, spicy</td>
              <td __TD__>Chives, cilantro, garlic, oregano, mint, parsley, rosemary, thyme</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cardamom</td>
              <td __TD__>Sweet, bitter</td>
              <td __TD__>Caraway, cinnamon, cloves, coriander, cumin, ginger</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Caraway</td>
              <td __TD__>Sweet, bitter</td>
              <td __TD__>Coriander, garlic, parsley, thyme</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cinnamon</td>
              <td __TD__>Sweet, bitter</td>
              <td __TD__>Cloves, coriander, cumin, ginger, nutmeg, turmeric</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Coriander</td>
              <td __TD__>Sour</td>
              <td __TD__>Cinnamon, cloves, cumin, garlic, ginger, fennel, nutmeg</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cumin</td>
              <td __TD__>Bitter, sweet</td>
              <td __TD__>Cardamom, cinnamon, cloves, coriander, curry leaves, fennel seed, garlic,
                ginger, nutmeg, oregano, paprika, thyme, turmeric</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Dill</td>
              <td __TD__>Sour, sweet</td>
              <td __TD__>Basil, cumin, garlic, ginger, parsley, turmeric</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Ginger</td>
              <td __TD__>Sour</td>
              <td __TD__>Basil, cilantro, coconut, garlic, lime, lemongrass, mint, scallions,
                turmeric</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Lemongrass</td>
              <td __TD__>Sour</td>
              <td __TD__>Basil, cilantro, cinnamon, cloves, coconut milk, garlic, ginger,
                turmeric</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Mint</td>
              <td __TD__>Sweet, tangy</td>
              <td __TD__>Basil, clove, cumin, dill, ginger, oregano, parsley, thyme</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Nutmeg</td>
              <td __TD__>Sweet, bitter</td>
              <td __TD__>Cardamom, cinnamon, cloves, coriander, cumin, ginger, thyme</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Oregano</td>
              <td __TD__>Bitter, savoury</td>
              <td __TD__>Basil, cumin, garlic, parsley, rosemary, sage, thyme</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Parsley</td>
              <td __TD__>Sweet, tangy</td>
              <td __TD__>Basil, chives, garlic, mint, oregano, rosemary, tarragon</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Rosemary</td>
              <td __TD__>Savoury</td>
              <td __TD__>Bay, chives, garlic, lavender, mint, oregano, parsley, sage, thyme</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Clove</td>
              <td __TD__>Sweet</td>
              <td __TD__>Cinnamon, coriander, curry, fennel, ginger, nutmeg</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Mustard seed</td>
              <td __TD__>Sweet</td>
              <td __TD__>Bay, coriander, cumin, dill, fennel, garlic, parsley, tarragon,
                turmeric</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        Read as three loose families, the chart is easy to hold in your head. The
        <strong>warm-sweet</strong> group is cinnamon, cardamom, nutmeg, clove, allspice and
        ginger; the <strong>bright and sour</strong> group is coriander, ginger, lemongrass and
        dill; the <strong>green and savoury</strong> group is basil, parsley, oregano, rosemary,
        sage and thyme. Seasonings inside a family swap for each other cleanly. A blend that tastes
        finished usually draws one or two from each family rather than three from the same one.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Building a blend you do not have
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The same logic answers the pantry question. A pre-mixed blend is a recipe, and Colorado
        State University Extension publishes the recipe for most of them.
      </p>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Blend and seasoning substitutions (Colorado State University Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Called for</th>
              <th __TH__>Build it from</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Allspice, 1 tsp</td>
              <td __TD__>1/2 tsp cinnamon plus 1/2 tsp ground cloves</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Apple pie spice, 1 tsp</td>
              <td __TD__>1/2 tsp cinnamon, 1/4 tsp nutmeg and 1/8 tsp cardamom</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Pumpkin pie spice, 1 tsp</td>
              <td __TD__>1/2 tsp cinnamon, 1/4 tsp ginger, 1/8 tsp allspice and 1/8 tsp nutmeg</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Italian seasoning, 1 tsp</td>
              <td __TD__>1/4 tsp basil, 2/3 tsp dried parsley and a pinch of oregano</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Fresh herbs, 1 tbsp</td>
              <td __TD__>1 tsp dried herbs, or 1/4 tsp powdered</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Keeping the flavour once you have the blend
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Store the blend in an airtight jar, away from light and the heat above the stove. Whole
          seed pods hold for a year or more that way; ground spices fade in months.</li>
        <li>Buy whole and grind as needed where you can. Ground cumin and ground nutmeg lose their
          character far faster than the whole seed or nut.</li>
        <li>Skip dried parsley for a blend you will use raw. It carries very little flavour, which
          is why the substitution above leans on it only as bulk.</li>
        <li>Fresh herbs keep a few days in the vegetable crisper, and stems stand longer in a glass
          of water. Anything limp or blackened goes out before it flavours the jar.</li>
      </ul>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://bkc-od-media.vmhost.psu.edu/documents/HO_PE_foodherbspicepairing.pdf" rel="noopener" __SC__>Penn State Extension, &ldquo;Food herb &amp; spice pairing chart&rdquo; (PDF)</a>;
        <a href="https://extension.psu.edu/preserving-herbs-by-drying" rel="noopener" __SC__>Penn State Extension, &ldquo;Preserving Herbs by Drying&rdquo;</a>;
        <a href="https://extension.colostate.edu/resource/ingredient-substitutions/" rel="noopener" __SC__>Colorado State University Extension, &ldquo;Ingredient Substitutions&rdquo;</a>.
      </p>
    </div>
  </section>
"""

BLOCKS = {
    "src/pages/tools/macro-calculator.astro": MACRO,
    "src/pages/tools/sugar-substitution.astro": SUGAR,
    "src/pages/tools/herb-spice-matrix.astro": HERB,
}

ANCHOR = "  <!-- Related Tools -->"

# existing vague line on the sugar page -> the official liquid-adjustment figure
OLD_LIQ = "When substituting for granulated sugar, reduce other liquids by about\n              3 tablespoons per cup of liquid sweetener used."
NEW_LIQ = "When substituting for granulated sugar, reduce other liquids by about\n              1/4 cup (4 tablespoons) per cup of liquid sweetener used."


def main() -> int:
    check = "--check" in sys.argv
    for rel, block in BLOCKS.items():
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        body = block.replace("__TH__", TH).replace("__TD__", TD).replace("__SC__", SC).rstrip() + "\n"
        if ANCHOR not in s:
            print(f"FAIL {rel}: anchor not found")
            return 1
        if "The Macro Balancing Math" in s or "Converting Liquid Sweeteners" in s or "Mapping Herbs and Spices by Taste" in s:
            print(f"skip {rel}: block already present")
            continue
        new = s.replace(ANCHOR, body + "\n" + ANCHOR, 1)
        if check:
            print(f"would update {rel}: +{len(new) - len(s)} chars")
            continue
        p.write_text(new, encoding="utf-8")
        print(f"updated {rel}: +{len(new) - len(s)} chars")

    # align the vague liquid-adjustment sentence with the cited official figure
    p = ROOT / "src/pages/tools/sugar-substitution.astro"
    s = p.read_text(encoding="utf-8")
    if OLD_LIQ in s:
        if check:
            print("would update liquid-adjustment sentence on sugar-substitution")
        else:
            p.write_text(s.replace(OLD_LIQ, NEW_LIQ), encoding="utf-8")
            print("updated liquid-adjustment sentence on sugar-substitution")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
