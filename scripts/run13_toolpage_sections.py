#!/usr/bin/env python3
"""Run-13 within-gate content: demand-matched sections on three thin tool pages.

Every section is matched to a live Bing query ridge (outreach/bing_queries_run13.txt):
  /tools/coffee-pairing        <- "chocolate dessert coffee pairing guide",
                                  "coffee dessert pairing guide chocolate cheesecake fruit desserts"
  /tools/cheese-pairing        <- "emmental cheese pairing figs wine nuts honey official cheese pairing"
  /tools/nutrition-calculator  <- "macro balance calculator" / "why is the number too high"
                                  (cooked-vs-raw entry states)

Inserts each block immediately before the page's "<!-- Related Tools -->" anchor.
Usage: python3 scripts/run13_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# ---------------------------------------------------------------- coffee pairing
COFFEE = """
  <!-- Coffee and dessert pairing by roast -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Matching Coffee With Dessert, by Roast and by Dessert
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The roast level is the dial that matters most. It sets how much bitterness the cup carries
        and how much fruit, and those two things decide whether a dessert tastes lifted or
        flattened. Sweetness and bitterness pull against each other in the mouth, so a very sweet
        dessert can dull a delicate brew, while a very bitter cup needs sugar, fat or salt before
        it lands.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Roast level, what the cup tastes like, and the desserts that tend to work with it.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Roast level</th>
              <th __TH__>What the cup tastes like</th>
              <th __TH__>Desserts that tend to work</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Light roast</td>
              <td __TD__>Bright, fruity, tea-like; the most perceived acidity</td>
              <td __TD__>Fruit tarts, lemon bars, berry desserts, almond biscotti, shortbread</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Medium roast</td>
              <td __TD__>Balanced; caramel, toasted nut and milk-chocolate notes</td>
              <td __TD__>Carrot cake, banana bread, chocolate chip cookies, blondies, scones</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Dark roast</td>
              <td __TD__>Bittersweet and smoky, heavier body, less perceived acidity</td>
              <td __TD__>Brownies, flourless chocolate cake, tiramisu, cheesecake, dark chocolate</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Sweetness, bitterness, and the 31-to-1 rule
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        In taste-mixture research, sweetness came out as both the strongest suppressor of the other
        tastes and the one most resistant to being suppressed (Green &amp; Lim, <em>Physiology &amp;
        Behavior</em> 2010). The same work found bitter compounds are perceived at far lower
        concentrations than sweet ones: quinine sulfate at 0.18 mM matched the sweetness of 0.56 M
        sucrose, a concentration ratio of roughly 31 to 1. The practical reading is that bitterness
        in coffee reaches your palate at trace amounts and a small change in roast or brew strength
        moves perceived bitterness a long way. When a pairing falls flat, adjust the cup before
        reaching for more sugar.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Pairing by dessert, not by coffee
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Working from the plate backwards is often faster, because the dessert is what you already
        decided on.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Dessert first: the coffee that usually works, and why.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Dessert type</th>
              <th __TH__>Coffee that usually works</th>
              <th __TH__>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Chocolate desserts &mdash; brownies, flourless cake, truffles</td>
              <td __TD__>Dark roast or espresso</td>
              <td __TD__>Roasting develops the roasted, bittersweet notes that both sides share</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Cheesecake, custard, cr&egrave;me br&ucirc;l&eacute;e</td>
              <td __TD__>Medium roast, cappuccino, flat white</td>
              <td __TD__>Fat and sugar coat the palate; the milk and caramel notes cut in without adding more bitterness</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Fruit desserts &mdash; tarts, cobblers, poached pears</td>
              <td __TD__>Light to medium roast; cold brew in summer</td>
              <td __TD__>Fruit and the acidity of a lighter roast reinforce each other</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Cookies, biscotti, shortbread</td>
              <td __TD__>Espresso or moka pot</td>
              <td __TD__>A small strong cup suits dry, low-moisture textures; biscotti are built to be dunked</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Nut and caramel desserts &mdash; pecan pie, praline, sticky toffee</td>
              <td __TD__>Medium-dark roast</td>
              <td __TD__>Toasted-nut and caramel notes overlap on both sides</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        How much coffee is on the table
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        The FDA cites 400 milligrams of caffeine a day &mdash; about two to three 12-fluid-ounce cups
        of coffee &mdash; as an amount not generally associated with negative effects for most
        adults, while noting that sensitivity varies widely from person to person. A tasting with
        several cups and several desserts is a good moment to tally the day; the
        <a href="/tools/caffeine-calculator" __SC__>caffeine calculator</a> adds it up. For the
        chocolate side of the table, the
        <a href="/tools/chocolate-pairing" __SC__>chocolate pairing guide</a> goes deeper, and the
        <a href="/tools/flavor-pairing" __SC__>flavor pairing finder</a> covers the aromatic overlap
        in more detail.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.fda.gov/consumers/consumer-updates/spilling-beans-how-much-caffeine-too-much" rel="noopener" class="underline">U.S. Food and Drug Administration, &ldquo;Spilling the Beans: How Much Caffeine Is Too Much?&rdquo;</a>; <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2975745/" rel="noopener" class="underline">Green &amp; Lim, &ldquo;Taste Mixture Interactions: Suppression, Additivity, and the Predominance of Sweetness&rdquo;, <em>Physiology &amp; Behavior</em> 101(5):731&ndash;737 (2010)</a>.
      </p>
    </div>
  </section>
"""

# ---------------------------------------------------------------- cheese pairing
CHEESE = """
  <!-- Cheese pairing by family -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Cheese Pairing by Family, and What to Do With the Leftovers
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The matcher above works one cheese at a time. Families are faster: if you know which family
        the cheese belongs to, you already know roughly how assertive it is, and intensity matching
        does most of the work. Pair mild with delicate and bold with assertive, then let sweetness,
        salt and fat settle the details.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            The five families, common members, and the accompaniments that suit each one.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Family</th>
              <th __TH__>Common members</th>
              <th __TH__>Fruit, nuts and sweets that work</th>
              <th __TH__>Drink direction</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fresh (unripened)</td>
              <td __TD__>Mozzarella, ricotta, burrata, ch&egrave;vre</td>
              <td __TD__>Tomatoes and olive oil, fresh herbs, citrus, light honey</td>
              <td __TD__>Crisp white, dry cider, sparkling water</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Soft-ripened</td>
              <td __TD__>Brie, camembert, triple-cream</td>
              <td __TD__>Apple, grapes, figs, walnuts, honey</td>
              <td __TD__>Sparkling wine, light red, cider</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Semi-hard</td>
              <td __TD__>Emmental, gouda, comt&eacute;, young cheddar</td>
              <td __TD__>Figs, pears, walnuts, honey, dried apricots</td>
              <td __TD__>Fruity red, cider, amber beer</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Hard</td>
              <td __TD__>Parmigiano-Reggiano, pecorino, aged cheddar</td>
              <td __TD__>Honey, balsamic, figs, marcona almonds</td>
              <td __TD__>Bold red, dry sherry</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Blue</td>
              <td __TD__>Roquefort, gorgonzola, stilton</td>
              <td __TD__>Pears, figs, honey, dates, walnuts</td>
              <td __TD__>Port, sweet wine, stout</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Why cheese and wine work at all
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        It is not only tradition. An in-vitro tasting study (Rinaldi et al., <em>Current Research in
        Food Science</em> 2024) simulated cheese, wine and saliva together and measured what
        actually changes in the mouth. Two drivers kept coming up. First, the fat and protein in
        cheese bind the tannins in red wine, which softens the dry, puckering astringency. Second,
        the wine rinses the mouth of the fat the cheese leaves behind. Among the cheeses tested,
        a semi-hard cheese produced the best pairing with both red wines &mdash; exactly where
        emmental, comt&eacute; and gouda sit. That is the mechanical reason a semi-hard cheese with
        figs, walnuts and honey beside a fruity red is such a reliable combination. The same study
        notes that a roughly six-gram piece of cheese leaves a measurable film in the mouth:
        about 15% of it for high-fat cheeses against about 4% for low-fat ones, which is one more
        argument for a moderate-fat semi-hard over a triple-cream if you are serving several
        cheeses in a row.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Which cheeses need the fridge
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Fresh cheeses are the most perishable and the least forgiving. The Center for Dairy Research
        at the University of Wisconsin&ndash;Madison explains that two measurements &mdash; water
        activity and pH, alongside salt, acidity and an active starter culture &mdash; decide
        whether a cheese can safely be held out of temperature control at all. Firm, low-moisture,
        salty and acidic cheeses sit far from that line. High-moisture fresh cheeses sit close to
        it, so keep them cold until the moment they are served.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Storage at a glance. The two-hour rule applies to every row.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Cheese</th>
              <th __TH__>Refrigerate?</th>
              <th __TH__>Practical note</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fresh &mdash; ricotta, mozzarella, burrata, ch&egrave;vre</td>
              <td __TD__>Yes, always</td>
              <td __TD__>Eat within a few days of opening; serve from the fridge onto the plate, not out on the table</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Soft-ripened &mdash; brie, camembert</td>
              <td __TD__>Yes</td>
              <td __TD__>Bring to room temperature about 30 minutes before serving, then return the remainder to the fridge</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Semi-hard, hard and blue</td>
              <td __TD__>Yes for storage</td>
              <td __TD__>Tolerate a serving window better than fresh types, wrapped and away from strong odours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        The serving clock is the one rule that applies to all of them: the USDA Food Safety and
        Inspection Service says never leave food out of refrigeration for more than two hours
        &mdash; one hour above 90 &deg;F &mdash; keeping cold food at or below 40 &deg;F and hot
        food at or above 140 &deg;F. For how much to buy, the
        <a href="/tools/cheese-board-calculator" __SC__>cheese board calculator</a> gives per-guest
        quantities by board style, and the
        <a href="/tools/cheese-board-builder" __SC__>cheese board builder</a> assembles the board
        itself. The <a href="/tools/flavor-pairing" __SC__>flavor pairing finder</a> covers the
        compound side of the same question.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11245939/" rel="noopener" class="underline">Rinaldi et al., &ldquo;Exploring cheese and red wine pairing by an <em>in vitro</em> simulation of tasting&rdquo;, <em>Current Research in Food Science</em> 9:100792 (2024)</a>; <a href="https://cdr.wisc.edu/cheese-safety-storage" rel="noopener" class="underline">Center for Dairy Research, University of Wisconsin&ndash;Madison, &ldquo;Cheese Safety/Storage&rdquo;</a>; <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f" rel="noopener" class="underline">USDA Food Safety and Inspection Service, &ldquo;&lsquo;Danger Zone&rsquo; (40 &deg;F &ndash; 140 &deg;F)&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# ---------------------------------------------------------------- nutrition calculator
NUTRITION = """
  <!-- Raw vs cooked entry states -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Raw or Cooked? Why a Calculated Number Often Looks Too High
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The single most common reason a nutrition total looks wrong is a state mismatch. Food
        composition data is recorded per food in one specific state &mdash; dry or cooked, raw or
        roasted &mdash; and the two are not interchangeable. Enter cooked rice against dry-rice
        data and the calories come back close to three times too high, because the water that
        tripled the volume added no calories at all.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Enter these in the state the data expects. Yields are the published extension figures.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Ingredient</th>
              <th __TH__>Enter it as</th>
              <th __TH__>Yield</th>
              <th __TH__>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Rice</td>
              <td __TD__>Dry weight</td>
              <td __TD__>1 cup dry &asymp; 3 cups cooked</td>
              <td __TD__>Three cups of cooked rice carry the calories of one cup dry</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Pasta</td>
              <td __TD__>Dry weight</td>
              <td __TD__>1 cup dry &asymp; 2 to 2&frac14; cups cooked</td>
              <td __TD__>Doubling the volume roughly halves the density</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Dried beans and lentils</td>
              <td __TD__>Dry weight</td>
              <td __TD__>1 cup dry &asymp; 3 cups cooked</td>
              <td __TD__>Soaked and simmered beans absorb their cooking liquid</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Meat, poultry and fish</td>
              <td __TD__>One state, used consistently</td>
              <td __TD__>Weight falls as fat renders and water cooks off</td>
              <td __TD__>The same portion weighs less after cooking; mixing states inflates the total</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Leafy greens and vegetables</td>
              <td __TD__>Raw weight, unless the entry says cooked</td>
              <td __TD__>Greens collapse to a fraction of their raw volume</td>
              <td __TD__>A large raw handful cooks down to a small serving</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        A three-step check when the total looks wrong
      </h3>
      <ol class="list-decimal pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Check the serving count first. Dividing by eight when the recipe makes four doubles
          every number on the panel, and it is the easiest mistake to make and to miss.</li>
        <li>Check the entry states. If the total is high by roughly two to three times, this is
          almost always a dry-versus-cooked mismatch on a grain, pasta or legume.</li>
        <li>Check for double entry. Oil, butter, sugar and sauces are often listed once as an
          ingredient and again inside a prepared component, so they get counted twice. Use the
          <a href="/tools/recipe-scaler" __SC__>recipe scaler</a> to re-check a scaled batch, and
          the <a href="/tools/unit-converter" __SC__>unit converter</a> to move between cups and
          grams before comparing against the data.</li>
      </ol>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The per-gram rule, and where rounding creeps in
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Protein and carbohydrate each supply about 4 kilocalories per gram and fat about 9, so the
        macro figures will not always sum exactly to the calorie line. Fat contains more than twice
        the energy per gram of the other two, which is why a small change in the oil or butter
        figure moves the total far more than the same change in a starch. The calorie line also
        counts alcohol and organic acids where they are present, and the FDA&rsquo;s nutrition-label
        guidance notes that declared values are rounded to set increments &mdash; so a small
        difference between a calculator and a printed label is normal, not a bug. The
        <a href="/articles/recipe-nutrition-calculator-guide" __SC__>guide to using recipe nutrition
        data</a> walks through how to read the panel once the inputs are right.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://extension.missouri.edu/publications/mp563" rel="noopener" class="underline">University of Missouri Extension, &ldquo;In a Pinch: Food Yields&rdquo; (mp563)</a>; <a href="https://food.unl.edu/article/nutrition-education-program-nep/all-about-cooking-rice/" rel="noopener" class="underline">University of Nebraska&ndash;Lincoln Food, &ldquo;All About Cooking Rice&rdquo;</a>; <a href="https://www.fda.gov/food/nutrition-facts-label/how-understand-and-use-nutrition-facts-label" rel="noopener" class="underline">U.S. Food and Drug Administration, &ldquo;How to Understand and Use the Nutrition Facts Label&rdquo;</a>.
      </p>
    </div>
  </section>
"""

PAGES = [
    ("src/pages/tools/coffee-pairing.astro", COFFEE, "Matching Coffee With Dessert, by Roast and by Dessert"),
    ("src/pages/tools/cheese-pairing.astro", CHEESE, "Cheese Pairing by Family, and What to Do With the Leftovers"),
    ("src/pages/tools/nutrition-calculator.astro", NUTRITION, "Raw or Cooked? Why a Calculated Number Often Looks Too High"),
]

ANCHOR = "  <!-- Related Tools -->"


def main() -> int:
    check = "--check" in sys.argv
    for rel, block, marker in PAGES:
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        if marker in s:
            print(f"SKIP (already present): {rel}")
            continue
        if ANCHOR not in s:
            print(f"FAIL: anchor not found in {rel}")
            return 1
        body = block.replace("__TH__", TH).replace("__TD__", TD).replace("__SC__", SC).rstrip() + "\n"
        new = s.replace(ANCHOR, body + "\n" + ANCHOR, 1)
        if check:
            print(f"WOULD INSERT: {rel} (+{len(new) - len(s)} chars)")
            continue
        p.write_text(new, encoding="utf-8")
        print(f"INSERTED: {rel} (+{len(new) - len(s)} chars)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
