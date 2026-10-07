#!/usr/bin/env python3
"""Run-14 within-gate content: demand-matched sections on three tool pages.

Every block is matched to a live Bing query ridge (outreach/bing_queries_run14.txt):
  /tools/flavor-pairing      <- the whole "what to serve with <dish>" cluster
                                (philly cheesesteak 22 impr, schnitzel 6, pork loin 9,
                                 paella 4, garlic shrimp 4, lentil soup 4, trout 3,
                                 acorn squash 3, chicken kiev 3, flatbread 3+2, ...)
  /tools/seasonal-guide      <- "compare seasonal ingredients" 13, "seasonal ingredients
                                 breakdown" 12, "seasonal ingredients comparison" 5,
                                 "seasonal ingredients guide" 5, "fantastic seasonal
                                 ingredients comparison" 2 (~56 impr cluster)
  /tools/substitution-finder <- "what is the substitute for 2 1/2 cups all-purpose flour
                                 if using bread flour" 3, "how much cake flour for 2 3/4
                                 cup ap flour" 3, "for 60 grams of cake flour ..." 4,
                                 "3 cups flour + cornstarch" 4, "20 cups plain flour and
                                 5 cups cornstarch" 2, flour/sugar substitution cluster

Also repoints the seasonal-guide's dead SNAP-Ed citation (snaped.fns.usda.gov no longer
resolves publicly; the live host is snaped.fna.usda.gov).

Inserts each block immediately before the page's "<!-- Related Tools -->" anchor.
Usage: python3 scripts/run14_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# ------------------------------------------------- flavor-pairing: main dish -> sides
FLAVOR = """
  <!-- What to serve with a main dish -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Deciding What to Serve With a Main Dish
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Most pairing questions are not really about the main dish. They are about what the
        main dish is missing. A side earns its place by doing one of four jobs, and once you
        name the job the dish in front of you needs, the choice narrows to a handful of
        options instead of a search through endless lists.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The four jobs a side dish can do
      </h3>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Read the main dish first, then pick the job the side has to do.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Job</th>
              <th __TH__>Reads best with</th>
              <th __TH__>Sides that do it</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Cut the richness (acid)</td>
              <td __TD__>Anything fried, buttery or cheese-heavy: schnitzel, fried fish,
                fried chicken, au gratin potatoes, a cheesesteak</td>
              <td __TD__>Vinegar slaw, quick pickles, lemon-dressed greens, tomato salad,
                mustard or horseradish sauce</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Add contrast (texture)</td>
              <td __TD__>Soft or sauce-drowned mains: lasagna, manicotti, bolognese,
                braises, casseroles, risotto</td>
              <td __TD__>Crusty bread, crisp roasted vegetables, shaved raw salad, toasted
                nuts or breadcrumbs</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Carry salt and savoury depth</td>
              <td __TD__>Lean or mild mains: poached white fish, trout, chicken breast,
                grains and lentils</td>
              <td __TD__>Olives, anchovy or fish-sauce dressing, aged cheese, cured meat,
                soy and miso dressings</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Supply the starch</td>
              <td __TD__>Mains that are almost all protein or vegetable: steak, pork loin,
                roast chicken, grilled fish, a big salad</td>
              <td __TD__>Potatoes, rice, polenta, beans, bread, noodles</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Why acid beats sugar when a plate feels heavy
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Taste mixtures are not additive. In taste-mixture work, sweetness came out as both the
        strongest suppressor of the other tastes and the hardest taste to suppress (Green &amp;
        Lim, <em>Physiology &amp; Behavior</em> 2010). That is why a sweet side &mdash; honey
        carrots, glazed squash, a fruit chutney &mdash; can flatten an already salty or
        sweet-glazed main instead of lifting it, and why the faster fix on a heavy plate is a
        sour or bitter note rather than more sweetness. The other half of the picture is
        aromatic overlap: in the flavour-network analysis of recipe data, dishes in Western
        cuisines tend to share flavour compounds, so a side built on the same aromatics as the
        main (garlic, thyme, parsley, black pepper) reads as deliberate rather than random
        (Ahn et al., <em>Scientific Reports</em> 2011).
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        A worked example: a rich sandwich main
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Take the most-asked side question on the site this month &mdash; what to serve with a
        Philly cheesesteak. The main is already fat, salt and starch: griddled beef, melted
        cheese, a soft roll. A side therefore has to cut, not add. A vinegar-based slaw or a
        sharp pickle does the most work per forkful; a lemon-dressed green salad is the lighter
        version of the same move; a hoagie-style pepper relish adds acid and heat at once. If
        you want a second starch, keep it dry and crisp rather than creamy, and keep the total
        portion small, because the sandwich is already the starch.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Where several cold sides are on the table at once, safety sets the clock. Keep cold
        sides at or below 40 &deg;F and hot ones at or above 140 &deg;F, and do not leave food
        out for more than two hours &mdash; one hour above 90 &deg;F. Bacteria double in number
        in as little as 20 minutes inside that range. The
        <a href="/tools/buffet-planner" __SC__>buffet planner</a> scales the same rules to a
        full table, the <a href="/tools/leftover-matcher" __SC__>leftover matcher</a> handles
        what is left, and the worked examples on
        <a href="/articles/what-to-serve-with-fried-fish" __SC__>fried fish</a>,
        <a href="/articles/what-to-serve-with-roasted-potatoes" __SC__>roasted potatoes</a> and
        <a href="/articles/what-to-serve-with-pesto-chicken" __SC__>pesto chicken</a> apply the
        same four jobs to specific plates. For sides built on produce, the
        <a href="/tools/seasonal-guide" __SC__>seasonal guide</a> shows what is actually worth
        buying this month.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2975745/" rel="noopener" class="underline">Green &amp; Lim, &ldquo;Taste Mixture Interactions: Suppression, Additivity, and the Predominance of Sweetness&rdquo;, <em>Physiology &amp; Behavior</em> 101(5):731&ndash;737 (2010)</a>; <a href="https://www.nature.com/articles/srep00196" rel="noopener" class="underline">Ahn et al., &ldquo;Flavor network and the principles of food pairing&rdquo;, <em>Scientific Reports</em> 1:196 (2011)</a>; <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f" rel="noopener" class="underline">USDA Food Safety and Inspection Service, &ldquo;Danger Zone (40&deg;F &ndash; 140&deg;F)&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- seasonal-guide: fresh/frozen/canned
SEASONAL = """
  <!-- Fresh, frozen or canned -->
  <section class="py-16 bg-white">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Fresh, Frozen, or Canned: Comparing the Same Ingredient
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The guide above answers <em>when</em> a fruit or vegetable is at its best. This section
        answers the other half of the question: <em>in what form</em>. In-season produce bought
        at peak is cheaper and tastes better, but the preserving method is what decides how much
        of the nutrition reaches the plate &mdash; and the answer is not automatically
        &ldquo;fresh&rdquo;.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Four forms of the same ingredient: what each one is good at, and what it costs you.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Form</th>
              <th __TH__>How it is preserved</th>
              <th __TH__>Where it wins</th>
              <th __TH__>What to watch</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fresh, in season</td>
              <td __TD__>Eaten within days of harvest</td>
              <td __TD__>Flavour and texture; raw uses such as salads, garnishes and
                crudités; lowest price at peak</td>
              <td __TD__>Vitamin C and the B vitamins decline during storage and cooking;
                leafy greens lose quality fastest</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Fresh, out of season</td>
              <td __TD__>Shipped long distances, often picked early to survive the trip</td>
              <td __TD__>Availability &mdash; you can still buy it</td>
              <td __TD__>The longer it spent in transit and on the shelf, the smaller its
                advantage over frozen</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Frozen</td>
              <td __TD__>Blanched briefly, then frozen close to harvest</td>
              <td __TD__>Picked and processed at peak; very short heat exposure; no oxygen
                inside the pack</td>
              <td __TD__>Nutrients are lost gradually during long freezer storage through
                oxidation; watery vegetables soften, so use them in cooked dishes</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Canned</td>
              <td __TD__>Heat-processed in the sealed container</td>
              <td __TD__>Long shelf life; heat-stable nutrients such as carotenoids, vitamin E,
                minerals and fibre hold up well</td>
              <td __TD__>Vitamin C and the B vitamins take the biggest hit in the initial heat
                treatment; check sodium in brine and sugar in syrup, and drain and rinse</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Dried</td>
              <td __TD__>Water removed, sometimes with sulphur dioxide</td>
              <td __TD__>Concentrated flavour and a pantry-stable supply; fibre and minerals
                survive</td>
              <td __TD__>Water-soluble vitamins are largely gone, so it is not a like-for-like
                swap for fresh in a recipe</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        What the research actually shows
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A two-part review from the University of California, Davis compared fresh, frozen and
        canned fruits and vegetables across the published literature. Its first finding is
        uncomfortable for fresh-first advice: nutrient loss in fresh produce during storage and
        cooking can be more substantial than most shoppers assume, and depending on the
        commodity, freezing and canning do preserve nutrient value. The mechanisms differ in an
        interesting way. The initial heat treatment of processed produce costs water-soluble,
        oxygen-labile nutrients such as vitamin C and the B vitamins, but those nutrients are
        then relatively stable during canned storage because the sealed can holds no oxygen.
        Frozen produce loses less during the short blanch but more during storage, because
        oxidation continues in the freezer. The review's own conclusion is the line worth
        remembering: recommendations that point only at fresh produce ignore the nutrient
        benefits of canned and frozen products (Rickman, Barrett &amp; Bruhn, <em>Journal of the
        Science of Food and Agriculture</em> 87(6):930&ndash;944, 2007).
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        How to use this when you shop
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Buy fresh at peak for raw, texture-forward uses &mdash; salads, slaws, garnishes,
          platters &mdash; where the flavour difference is the point.</li>
        <li>Buy frozen for cooking out of season: soups, stews, curries, stir-fries and bakes
          where texture is not the deciding factor.</li>
        <li>Buy canned for pantry depth, and count the heat-stable nutrients (carotenoids,
          vitamin E, minerals, fibre) as real, not as a compromise.</li>
        <li>Drain and rinse canned beans and vegetables when sodium matters; that step removes a
          useful share of the added salt.</li>
        <li>Build the list around whichever form is cheapest at its peak &mdash; the
          <a href="/tools/grocery-list" __SC__>grocery list builder</a> and the
          <a href="/articles/grocery-budget-meal-planning" __SC__>grocery budget plan</a> both
          work per form; <a href="/tools/pantry-helper" __SC__>pantry helper</a> tells you what
          you can already skip buying.</li>
      </ul>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://snaped.fna.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide" rel="noopener" class="underline">USDA SNAP-Ed Connection &mdash; Seasonal Produce Guide</a>; <a href="https://scijournals.onlinelibrary.wiley.com/doi/10.1002/jsfa.2825" rel="noopener" class="underline">Rickman, Barrett &amp; Bruhn, &ldquo;Nutritional comparison of fresh, frozen and canned fruits and vegetables. Part 1&rdquo;, <em>Journal of the Science of Food and Agriculture</em> 87(6):930&ndash;944 (2007)</a>; <a href="https://www.ams.usda.gov/services/local-regional/food-directories" rel="noopener" class="underline">USDA AMS &mdash; Local Food Directories</a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- substitution-finder: weights
SUBSTITUTION = """
  <!-- Substituting by weight -->
  <section class="py-16 bg-white">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Substituting Flour and Sugar by Weight, Not by Cup
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Most failed substitutions are volume problems, not ingredient problems. A cup measures
        the scoop as much as the flour: how deep you dug into the bag, and whether you sifted
        first, can move the same &ldquo;cup&rdquo; by 20 per cent or more. Weighing removes that
        variable, and it turns every swap into arithmetic. A cup of all-purpose flour weighs
        120 g, cake flour 120 g, pastry flour 106 g and whole-wheat pastry flour 96 g; packed
        brown sugar weighs 213 g a cup against 198 g for granulated.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The gram weights to work from
      </h3>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            One cup, weighed &mdash; the numbers the substitutions below are built on.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Ingredient</th>
              <th __TH__>1 cup</th>
              <th __TH__>Note</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>All-purpose flour</td><td __TD__>120 g</td>
              <td __TD__>The reference flour for most substitution rules</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Bread flour</td><td __TD__>120 g</td>
              <td __TD__>More protein, so it takes up more water than all-purpose</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cake flour</td><td __TD__>120 g</td>
              <td __TD__>Lowest protein of the wheat flours; the lightest crumb</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Pastry flour</td><td __TD__>106 g</td>
              <td __TD__>Between cake and all-purpose in protein and weight</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Whole-wheat pastry flour</td><td __TD__>96 g</td>
              <td __TD__>Lightest of the list; add liquid and expect a denser bake</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Cornstarch</td><td __TD__>112 g</td>
              <td __TD__>A quarter cup weighs 28 g; used to dilute flour protein</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Granulated sugar</td><td __TD__>198 g</td>
              <td __TD__>1 lb is about 2&frac14; cups</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Brown sugar, packed</td><td __TD__>213 g</td>
              <td __TD__>Denser because of the molasses and moisture it carries</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Confectioners&rsquo; sugar, unsifted</td><td __TD__>113 g</td>
              <td __TD__>Weigh it; a sifted cup is lighter still</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The substitutions that come up most, worked out
      </h3>
      <ol class="list-decimal pl-6 space-y-3 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li><strong>All-purpose to bread flour.</strong> Both weigh 120 g a cup, so 2&frac12;
          cups all-purpose (300 g) is 300 g of bread flour. The protein is higher, so bread
          flour drinks more water: add a spoonful or two of extra liquid and let the dough rest
          before deciding it is too stiff.</li>
        <li><strong>Cake flour, when you only have all-purpose.</strong> The extension rule is
          1 cup of sifted cake flour for 1 cup of sifted all-purpose flour minus 2 tablespoons
          (a scant &frac78; cup). By weight: 120 g all-purpose less 15 g leaves 105 g, and
          2 tablespoons of cornstarch adds about 14 g back, so 1 cup cake flour &asymp; 105 g
          all-purpose flour plus 14 g cornstarch. For a batch calling for 2&frac34; cups cake
          flour (330 g) that is about <strong>289 g all-purpose flour plus 39 g
          cornstarch</strong>. The swap works because cake flour is simply a lower-protein
          flour, and cornstarch dilutes the protein further.</li>
        <li><strong>A small cake-flour batch.</strong> 60 g of cake flour is half a cup, so it
          becomes about <strong>53 g all-purpose flour plus 7 g cornstarch</strong> &mdash; one
          level tablespoon.</li>
        <li><strong>All-purpose to pastry flour.</strong> Pastry flour weighs 106 g a cup
          against 120 g, so weigh 106 g of all-purpose for each cup the recipe asks for and you
          are within a gram of the same mass.</li>
        <li><strong>Granulated to brown sugar.</strong> Two cups of granulated sugar is 396 g.
          Packed brown sugar is denser at 213 g a cup, so 396 g of brown sugar is a little
          under 1&frac78; cups. Expect a softer, darker crumb, because brown sugar carries
          molasses and moisture. Going the other way, 1 cup of firmly packed brown sugar
          substitutes for 1 cup of granulated.</li>
        <li><strong>Cornstarch as a thickener.</strong> 1 tablespoon of cornstarch thickens
          like 2 tablespoons of all-purpose flour, but it must first be stirred into cold
          liquid &mdash; added dry to a hot pan it clumps.</li>
      </ol>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        What the tool does with your numbers
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The substitution finder above works from these same ratios. Enter amounts as weights
        where you can, and treat the answer as a starting point rather than a guarantee:
        protein content, moisture, and the leavening already in the recipe all shift a little
        when flours change. Re-check the dough or batter before it goes in the oven. For the
        rest of the arithmetic, the <a href="/tools/flour-substitution" __SC__>flour
        substitution table</a> covers the full weight list, the
        <a href="/tools/recipe-scaler" __SC__>recipe scaler</a> re-sizes the whole batch, and
        the <a href="/tools/unit-converter" __SC__>unit converter</a> moves between cups and
        grams for anything not in the table.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.kingarthurbaking.com/learn/ingredient-weight-chart" rel="noopener" class="underline">King Arthur Baking &mdash; Ingredient Weight Chart</a>; <a href="https://randolph.ces.ncsu.edu/news/baking-substitutions-that-work/" rel="noopener" class="underline">N.C. Cooperative Extension, &ldquo;Baking Substitutions That Work&rdquo;</a>; <a href="https://extension.msstate.edu/publications/ingredient-substitutions-and-equivalents" rel="noopener" class="underline">Mississippi State University Extension, &ldquo;Ingredient Substitutions and Equivalents&rdquo;</a>; <a href="https://extension.usu.edu/archive/list-of-ingredient-substitutions-for-cooking-and-baking" rel="noopener" class="underline">Utah State University Extension, &ldquo;List of Ingredient Substitutions for Cooking and Baking&rdquo;</a>.
      </p>
    </div>
  </section>
"""

PAGES = [
    ("src/pages/tools/flavor-pairing.astro", FLAVOR, "Deciding What to Serve With a Main Dish"),
    ("src/pages/tools/seasonal-guide.astro", SEASONAL, "Fresh, Frozen, or Canned: Comparing the Same Ingredient"),
    ("src/pages/tools/substitution-finder.astro", SUBSTITUTION, "Substituting Flour and Sugar by Weight, Not by Cup"),
]

ANCHOR = "  <!-- Related Tools -->"

# dead SNAP-Ed citation -> live host (verified 2026-10-07: fns host no longer resolves)
DEAD_URL = "https://snaped.fns.usda.gov/seasonal-produce-guide"
LIVE_URL = "https://snaped.fna.usda.gov/resources/nutrition-education-materials/seasonal-produce-guide"


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

    # citation repoint
    p = ROOT / "src/pages/tools/seasonal-guide.astro"
    s = p.read_text(encoding="utf-8")
    if DEAD_URL in s:
        if check:
            print(f"WOULD REPOINT dead SNAP-Ed URL in {p.name}")
        else:
            p.write_text(s.replace(DEAD_URL, LIVE_URL), encoding="utf-8")
            print(f"REPOINTED dead SNAP-Ed URL in {p.name}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
