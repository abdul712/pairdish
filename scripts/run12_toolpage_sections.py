#!/usr/bin/env python3
"""Run-12 within-gate content: demand-matched sections on three thin tool pages.

Each section answers a ridge that is actually showing up in the live Bing query inventory
(outreach/bing_queries_run10.txt, 529 queries / 826 impressions):

1. /tools/flavor-pairing   <- "flavour pairing website", "flavour pairing", "flavor pairing tool",
                              "food pairing calculator", "food pairings tool website",
                              "cooking ingredients pair tool", "ingredient pairing ideas",
                              "things that pair with flavoured ingredients",
                              "which combinations of local flavours complement each other"
2. /tools/party-calculator <- "i am having a halloween cocktail party for about 70 people ...
                              is that enough food", "food to go with pretzel bites at a party",
                              "how many appetizers per person" (party-quantity class)
3. /tools/herb-spice-matrix<- "herbs and spices pairing flavor wheel", "culinary herb spice pairings",
                              "1 herb 1 spice blend (one must be fresh)"

Sources verified this run (content fetched, not assumed):
- Ahn, Ahnert, Bagrow & Barabasi, "Flavor network and the principles of food pairing",
  Scientific Reports 1:196 (2011) -- https://www.nature.com/articles/srep00196
  Abstract confirmed: Western cuisines tend to pair ingredients that share many flavor compounds;
  East Asian cuisines tend to avoid compound-sharing ingredients.
- UAEX (University of Arkansas System Division of Agriculture, Cooperative Extension Service):
  "For a four hour party, plan on about eight appetizers per person during the first two hours and
  four appetizers per person for the remaining two hours." Hot held at 140 F or warmer, cold at
  39 F or colder, two-hour rule.
- Iowa State University Extension and Outreach, AnswerLine -- per-person party quantities
  (protein 6-8 oz; sliders 1.5-2 oz; sandwich 3-4 oz; burgers 4-6 oz; meatballs 2-3; sides 4-6 oz;
  appetizers 4-7 bite-size pieces; water 2 bottles/hr; soda 2 cans/hr; punch 6 oz; cake 1 slice,
  cupcake/donut 1, cookies/bars 1-2; half sheet 13x18 = 24-50 servings, full sheet 18x26 = 48-100;
  1 to 1.5 lb of food per guest; plan 60% of invited guests for an open house; two-hour rule,
  one hour above 90 F).
- University of Minnesota Extension, "Planning the quantity food occasion" -- standardized quantity
  recipes for 25+ people; small recipes are out of proportion when multiplied.
- University of Delaware Cooperative Extension, "Herbs & Spices - What Goes With What Food"
  (Sue Snider, Ph.D.; reviewed August 2025) -- per-food seasoning table and named herb blends.

Usage: python3 scripts/run12_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# ---------------------------------------------------------------- flavor pairing
FLAVOR = """
  <!-- How pairing tools decide -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        How a Pairing Tool Decides What Works
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The results above come from a pairing graph: ingredients are nodes, and a link means
        &ldquo;these two are used together, or they share something.&rdquo; Which of those two the
        link means changes everything about how much weight a suggestion deserves. There are three
        rules in common use, and a good tool blends all three.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            The three pairing lenses, what each one actually claims, and where it holds up.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Lens</th>
              <th __TH__>What it claims</th>
              <th __TH__>Typical example</th>
              <th __TH__>Where it is strongest</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Shared aroma compounds</td>
              <td __TD__>Two ingredients taste related when their volatile compounds overlap.</td>
              <td __TD__>Cocoa and roasted coffee &mdash; both roasted, overlapping volatile
                compounds.</td>
              <td __TD__>Western European and North American cooking; desserts, spice blends,
                roasting.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Contrast and balance</td>
              <td __TD__>Opposites finish each other: fat with acid, sweet with salt, rich with
                something bitter or green.</td>
              <td __TD__>Fried fish with lemon (fat plus acid); salted caramel (sweet plus
                salt).</td>
              <td __TD__>Finishing a rich dish; sauces, dressings, and anything that tastes flat or
                heavy.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Regional tradition</td>
              <td __TD__>Ingredients grown, harvested or preserved together end up plated
                together.</td>
              <td __TD__>Tomato, basil and olive oil; rye bread with caraway.</td>
              <td __TD__>Everyday home cooking and anything with a regional accent.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The shared-compound idea is a measured tendency, not a law
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The chemistry lens was tested at scale in the 2011 &ldquo;flavor network&rdquo; study in
        <em>Scientific Reports</em>. The authors linked culinary ingredients when they share flavor
        compounds, then compared that network with the pairs real recipes actually use. Western
        cuisines showed a tendency to pair ingredients that share many flavor compounds &mdash; the
        food-pairing hypothesis &mdash; while East Asian cuisines tended to avoid compound-sharing
        pairs. Two useful consequences follow. First, a compound-based suggestion is a statistical
        pattern drawn from recipe data, not a verdict on your dinner. Second, the same tool will be
        a better guide to a European dish than to an East Asian one, and neither answer beats your
        own taste.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        A workflow that gets more out of the results
      </h3>
      <ol class="list-decimal pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Enter the ingredient you are building the dish around, not the whole recipe.</li>
        <li>Read the top matches as candidates, then keep two or three &mdash; not all of them.</li>
        <li>Pick your pairings from different lenses where you can: one shared-compound match, one
          contrasting match, one regional match.</li>
        <li>Taste them at spoon scale before they go in the pan. Salt, fat and acid move a pairing
          far more than a mismatch at trace level.</li>
        <li>Write down what worked. Pairings repeat, and the second time you need it you will not
          want to guess again.</li>
      </ol>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        What a pairing tool cannot see
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Compound tables are incomplete, and a shared compound at trace level may be far too weak to
        taste. The graph also ignores texture, temperature, seasoning level and how the dish is
        cooked &mdash; charred and raw versions of the same vegetable behave differently. Three
        checks fill the gaps: the
        <a href="/tools/seasonal-guide" __SC__>seasonal guide</a> for what is actually good right
        now, the
        <a href="/tools/herb-spice-matrix" __SC__>herb and spice matrix</a> for seasoning-level
        matches, and the
        <a href="/tools/cheese-pairing" __SC__>cheese pairing guide</a> when the plate already has
        a cheese on it. If you are cooking to a fixed dish, start from a
        <a href="/articles/what-to-serve-with-roasted-potatoes" __SC__>what-to-serve-with</a> guide
        instead and use this tool to fill the gaps.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.nature.com/articles/srep00196" rel="noopener" class="underline">Ahn et al., &ldquo;Flavor network and the principles of food pairing&rdquo;, <em>Scientific Reports</em> 1:196 (2011)</a>.
      </p>
    </div>
  </section>
"""

# ---------------------------------------------------------------- party calculator
PARTY = """
  <!-- How much food per guest -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        How Much Food Per Guest, by Party Type
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The calculator multiplies per-guest rates. This is where those rates come from: the
        per-person party quantities used by university extension food and nutrition programs, which
        plan quantity food service for crowds every week. Treat the numbers as a floor, then round
        up for the groups that eat more &mdash; and always keep the food-safety clock running.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Per-guest party quantities for a self-serve event (Iowa State University Extension and
            Outreach, AnswerLine).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Item</th>
              <th __TH__>Plan per guest</th>
              <th __TH__>Cross-check</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Main protein</td>
              <td __TD__>6&ndash;8 oz</td>
              <td __TD__>Sliders 1.5&ndash;2 oz each; sandwiches 3&ndash;4 oz; burgers 4&ndash;6 oz;
                meatballs 2&ndash;3 pieces.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Sides</td>
              <td __TD__>4&ndash;6 oz</td>
              <td __TD__>For 50 guests that is roughly 2.5 gal of baked beans or 12.5&ndash;15 lb
                of finished potato salad.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Appetizers</td>
              <td __TD__>4&ndash;7 bite-size pieces</td>
              <td __TD__>Rises with party length &mdash; see the hourly count below.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Dessert</td>
              <td __TD__>1 slice of cake, 1 cupcake or donut, 1&ndash;2 cookies or bars</td>
              <td __TD__>A half sheet cake (13 &times; 18 in) yields 24&ndash;50 servings and a full
                sheet (18 &times; 26 in) 48&ndash;100, depending on cut.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Beverages</td>
              <td __TD__>2 bottles of water and 2 cans of soda per guest per hour; 6 oz punch</td>
              <td __TD__>Drinks are the most under-bought line on a party list.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Everything combined</td>
              <td __TD__>1&ndash;1.5 lb of food per guest</td>
              <td __TD__>For an open-house style party, plan for about 60% of the people you
                invited &mdash; guests drift between parties.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Appetizer-only parties: count by the hour, not by the tray
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        When there is no main course, appetite is a function of time. The University of Arkansas
        System Division of Agriculture extension guidance is about eight appetizers per person
        during the first two hours of a party and about four per person for each two hours after
        that &mdash; roughly twelve pieces per guest over a four-hour event. A two-hour reception
        needs about half that.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Worked example: 70 guests, 11 kinds of passed appetizers
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        This is the shape of question the calculator gets most often: a large cocktail party, a
        caterer passing appetizers, and the worry that the quantity is too light. Running the
        four-hour benchmark of about twelve pieces per guest against the numbers gives an answer
        either way, depending on what &ldquo;two per person&rdquo; meant.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            70-guest cocktail party, four hours, 11 passed appetizer varieties.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Reading</th>
              <th __TH__>Pieces per guest</th>
              <th __TH__>Total pieces</th>
              <th __TH__>Verdict against the benchmark</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Two pieces of each of the 11 varieties</td>
              <td __TD__>22</td>
              <td __TD__>1,540</td>
              <td __TD__>Comfortably enough; passed appetizers alone cover the party.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Two pieces in total per guest</td>
              <td __TD__>2</td>
              <td __TD__>140</td>
              <td __TD__>Well short &mdash; add cheese and vegetable trays, and a stationary
                item guests can serve themselves.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Benchmark for comparison</td>
              <td __TD__>About 12</td>
              <td __TD__>840</td>
              <td __TD__>The number to plan to, then round up.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        The two clocks that matter more than the totals
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Perishable food should not sit in the 40&nbsp;&deg;F&ndash;140&nbsp;&deg;F range for
          more than two hours; above 90&nbsp;&deg;F that window shortens to one hour.</li>
        <li>Hold hot food at 140&nbsp;&deg;F or warmer and cold food at 39&nbsp;&deg;F or colder,
          and swap small trays rather than leaving one large tray out.</li>
        <li>Make dips and spreads a day or two ahead &mdash; most improve, and it moves work off
          party day.</li>
        <li>Standardized quantity recipes exist for 25, 50 and 100 portions. Multiplying a
          family-size recipe up by five is where baked goods and thickened sauces go wrong.</li>
      </ul>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Pair this page with the
        <a href="/tools/appetizer-planner" __SC__>appetizer planner</a> for the tray list, the
        <a href="/tools/buffet-planner" __SC__>buffet planner</a> for holding and refill timing,
        the <a href="/tools/drink-calculator" __SC__>drink calculator</a> so the bar is not the
        short line, and the
        <a href="/tools/cheese-board-calculator" __SC__>cheese board calculator</a> when a board is
        the stationary item.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources:
        <a href="https://blogs.extension.iastate.edu/answerline/2026/03/03/graduation-party-planning/" rel="noopener" class="underline">Iowa State University Extension and Outreach &mdash; party food quantities per guest</a>,
        <a href="https://www.uaex.uada.edu/counties/miller/news/fcs/holiday-foods/Appetizers-or-Hors-d-oeuvres-Options-are-Endless.aspx" rel="noopener" class="underline">University of Arkansas System Division of Agriculture &mdash; appetizers per person by party length</a>, and
        <a href="https://extension.umn.edu/cooking-safely-crowd/planning-quantity-food-occasion" rel="noopener" class="underline">University of Minnesota Extension &mdash; planning the quantity food occasion</a>.
      </p>
    </div>
  </section>
"""

# ---------------------------------------------------------------- herb & spice matrix
HERB = """
  <!-- What seasoning goes with what food -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        What Seasoning Goes With What Food
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The matrix above links one herb or spice at a time. This is the other direction: start from
        the food on the counter and read off the seasonings that reliably work with it. The table
        is the University of Delaware Cooperative Extension fact sheet on herb and spice pairing,
        which exists for exactly this &ldquo;what do I put on it&rdquo; moment.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Seasonings that pair with each food group (University of Delaware Cooperative
            Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Food</th>
              <th __TH__>Seasonings</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Beef</td>
              <td __TD__>Bay leaf, cayenne, chili, curry, dill, ginger, mustard, paprika, marjoram,
                oregano, parsley, rosemary, thyme.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Pork</td>
              <td __TD__>Allspice, basil, cardamom, cloves, curry, ginger, marjoram, mustard,
                oregano, paprika, parsley, rosemary, sage, savory, thyme.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Lamb</td>
              <td __TD__>Basil, cardamom, curry, dill, mace, marjoram, mint, oregano, paprika,
                rosemary, turmeric.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Poultry</td>
              <td __TD__>Allspice, anise, bay leaf, cayenne, curry, dill, ginger, marjoram, mustard,
                nutmeg, paprika, parsley, pepper, sage, savory, tarragon, thyme.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Fish</td>
              <td __TD__>Allspice, anise, basil, bay leaf, cayenne, chives, curry, dill, fennel,
                ginger, marjoram, nutmeg, oregano, paprika, parsley, tarragon, thyme.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Fruit</td>
              <td __TD__>Allspice, anise, cinnamon, cloves, curry, ginger, mace, mint, nutmeg,
                pepper.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Vegetables</td>
              <td __TD__>Green beans: dill, marjoram, nutmeg, oregano. Beets: allspice, nutmeg.
                Broccoli: mustard, nutmeg, sage. Carrots: dill, nutmeg, parsley, rosemary, thyme.
                Cucumbers: basil, dill, parsley. Eggplant: oregano, parsley. Mushrooms: garlic,
                sage. Peas: marjoram, mint. Potatoes: chives, cumin, dill, fennel, garlic, mace,
                rosemary, tarragon. Squash: cardamom, ginger, nutmeg. Tomato: allspice, basil,
                cloves, cumin, fennel, marjoram, oregano.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Rice</td>
              <td __TD__>Chives, cumin, curry, nutmeg, parsley, saffron, turmeric.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Named blends worth keeping on hand
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Premixed blends speed up cooking and keep a dish consistent from one week to the next.
        Assemble them in equal parts unless the ratio is given, then store them away from heat and
        light.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[560px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Classic herb combinations and what they are built for.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Blend or use</th>
              <th __TH__>Make it from</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fish</td>
              <td __TD__>Basil, crumbled bay leaf, French tarragon, lemon thyme, parsley (fennel,
                sage or savory optional).</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Poultry</td>
              <td __TD__>Lovage, 2 parts marjoram, 3 parts sage.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Egg dishes</td>
              <td __TD__>Basil, dill weed, garlic, parsley.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Salad dressing</td>
              <td __TD__>Basil, lovage, parsley, French tarragon.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Tomato sauce</td>
              <td __TD__>2 parts basil, bay leaf, marjoram, oregano, parsley (celery leaf or clove
                optional).</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Italian</td>
              <td __TD__>Basil, marjoram, oregano, rosemary, sage, savory, thyme.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Barbeque rub</td>
              <td __TD__>Cumin, garlic, hot pepper, oregano.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Fine herbs</td>
              <td __TD__>Parsley, chervil, chives, French tarragon.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Bouquet garni</td>
              <td __TD__>Bay leaf, 2 parts parsley, thyme &mdash; tied in cheesecloth and lifted
                out before serving.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Using the pairings without overshooting the dose
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Two or three seasonings from a row will read more clearly than six. Save the rest for
          the next time you cook the same thing.</li>
        <li>Dried herbs are roughly three times as strong as fresh by volume &mdash; 1 tsp dried
          stands in for about 1 tbsp fresh. The
          <a href="/tools/substitution-finder" __SC__>substitution finder</a> converts the rest of
          the pantry.</li>
        <li>Add dried seasonings early so their oils have time to bloom; hold fresh herbs and
          ground spices for the end of cooking.</li>
        <li>Toast whole spices in a dry pan for a minute or two until they smell like themselves,
          then grind &mdash; the flavor fades quickly once ground.</li>
        <li>Build the rest of the plate around what is in season &mdash; the
          <a href="/tools/seasonal-guide" __SC__>seasonal guide</a> lists what is worth buying now,
          and the <a href="/tools/flavor-pairing" __SC__>flavor pairing tool</a> covers pairings
          between ingredients rather than seasonings.</li>
      </ul>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.udel.edu/academics/colleges/canr/cooperative-extension/fact-sheets/herbs-spices-on-food/" rel="noopener" class="underline">University of Delaware Cooperative Extension, &ldquo;Herbs &amp; Spices &mdash; What Goes With What Food&rdquo; (reviewed August 2025)</a>.
      </p>
    </div>
  </section>
"""

PAGES = [
    ("src/pages/tools/flavor-pairing.astro", FLAVOR, "How a Pairing Tool Decides What Works"),
    ("src/pages/tools/party-calculator.astro", PARTY, "How Much Food Per Guest, by Party Type"),
    ("src/pages/tools/herb-spice-matrix.astro", HERB, "What Seasoning Goes With What Food"),
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
