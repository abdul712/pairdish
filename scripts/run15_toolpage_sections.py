#!/usr/bin/env python3
"""Run-15 within-gate content: demand-matched sections on three tool pages.

Every block is matched to a live Bing query ridge (outreach/bing_queries_run15.txt):
  /tools/chocolate-pairing        <- "chocolate dessert coffee pairing guide" 4,
                                     "coffee dessert pairing guide chocolate cheesecake
                                     fruit desserts" 4, "chocolate pairings" 1,
                                     "chocolate flavor pairing guide" 1, "matching
                                     chocolate" 1, "pair related chocolates" 1,
                                     "chocolate.pairs.with" 1  (~13 impr cluster)
  /tools/cheese-board-calculator  <- "cheese board how much cheese" 1 (+1 click),
                                     "how much cheese per person for a cheese board
                                     per variety" 1, "cheese board variety proportions
                                     hard soft blue goat cheese" 1, "hosting 35 people
                                     ... charcuterie. how much of each should we buy" 1
  /tools/buffet-planner           <- "make me a buffet menu that has fish, chicken, pork,
                                     beef, vegetable, and salad" 4, "food and beverage
                                     buffet menu planning dishes" 4, "buffet menu
                                     planning" 2  (~10 impr cluster)

Also repoints a dead citation on /tools/buffet-planner: the FSIS danger-zone path is
written without the "/food-safety/" segment and returns the FSIS "Page Not Found" page
(verified this run); the live path is /food-safety/safe-food-handling-and-preparation/...

Inserts each block immediately before the page's "<!-- Related Tools -->" anchor.
Usage: python3 scripts/run15_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# ------------------------------------------------- chocolate-pairing
CHOCOLATE = """
  <!-- Cocoa percentage + pairing by type -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        What the Cocoa Percentage Really Tells You
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The number on a chocolate bar is not the share of cocoa solids. It is the share of the bar
        that came from the cacao bean &mdash; solids and cocoa butter together &mdash; which is why
        two bars both stamped &ldquo;70%&rdquo; can taste nothing alike. One can be dry and sharply
        bitter, the other round and buttery, depending on how much of that share is fat. The
        percentage is the first thing to read before choosing a partner, because it sets how much
        sweetness and bitterness the chocolate brings to whatever you serve it with.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        In the United States the words on the wrapper are backed by federal standards of identity,
        so each label carries a specific minimum cacao content.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            United States minimum content by label, from the FDA standards of identity for cacao products.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Label</th>
              <th __TH__>What it must contain</th>
              <th __TH__>How it behaves in a pairing</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Sweet chocolate</td>
              <td __TD__>At least 15% chocolate liquor &mdash; the ground cacao nib, solids and fat together</td>
              <td __TD__>The baseline bar: mild enough to take fruit and lighter wines.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Semisweet or bittersweet</td>
              <td __TD__>At least 35% chocolate liquor, built on the same standard with a higher cacao floor</td>
              <td __TD__>The workhorse: strong enough for coffee, red wine and aged cheese.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Milk chocolate</td>
              <td __TD__>At least 10% chocolate liquor, 3.39% milkfat and 12% total milk solids</td>
              <td __TD__>Sweeter and rounder; it needs a partner sweeter still.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>White chocolate</td>
              <td __TD__>At least 20% cacao fat, 3.5% milkfat and 14% total milk solids; no cocoa solids, no added colour, no more than 55% sweetener</td>
              <td __TD__>Fat, sugar and milk with no bitterness at all, so it wants acid rather than more sugar.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Ruby chocolate</td>
              <td __TD__>No United States standard of identity; made from ruby cacao beans</td>
              <td __TD__>Fruity and faintly tart &mdash; treat it as a light milk chocolate with berry notes.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Pairing by chocolate type
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Read down the row that matches the bar in front of you, then use the same logic the tool
        above applies: sweeter chocolate takes a sweeter partner, more bitter chocolate takes a
        bolder one.
      </p>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Chocolate</th>
              <th __TH__>Works with</th>
              <th __TH__>Keep away from</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Dark, 70% and up</td>
              <td __TD__>Port, Cabernet and other full reds, espresso, blue cheese, sour cherry, toasted almond</td>
              <td __TD__>Dry white wine and anything delicate &mdash; the bitterness swamps them</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Semisweet, 50&ndash;69%</td>
              <td __TD__>Zinfandel, tawny port, milk coffee, aged cheddar, raspberry, hazelnut</td>
              <td __TD__>Very sweet liqueurs, which flatten the fruit</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Milk</td>
              <td __TD__>Champagne and other sparkling wine, cream sherry, brie, banana, hazelnut</td>
              <td __TD__>Tannic reds and strong blue cheese</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>White</td>
              <td __TD__>Fresh berries, citrus and other tart fruit, ros&eacute;, prosecco, salted nuts</td>
              <td __TD__>Red wine, dark coffee and dark chocolate</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Ruby</td>
              <td __TD__>Berries, ros&eacute;, plain yoghurt, citrus desserts</td>
              <td __TD__>Espresso and heavy reds</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Chocolate, coffee and the after-dinner question
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        A chocolate dessert with coffee is the pairing people ask about most, and the caffeine is
        usually part of the worry. On the numbers, chocolate carries far less than coffee does: a
        one-ounce square of dark chocolate in the 60&ndash;69% band holds about 24&nbsp;mg of
        caffeine, a milk-chocolate candy bar around 7&nbsp;mg for a 1.69-ounce package, and even a
        serving of chocolate-covered coffee beans about 336&nbsp;mg because the beans themselves
        are in there. Match the roast to the dessert rather than the other way round &mdash; a
        darker roast against a bitter dark chocolate, a lighter one against milk or white. The
        <a href="/tools/coffee-pairing" __SC__>coffee and dessert pairing guide</a> works the same
        question from the cup side.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Storing chocolate so the pairing still tastes right
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Chocolate is expensive enough that the difference between a good bar and a tired one is
        worth a storage habit. Extension food-safety guidance is to keep it airtight, dark, and in
        a cool dry spot at 65&ndash;70&nbsp;&#176;F with relative humidity under 50&ndash;55%, and
        to avoid the refrigerator where possible because the moisture and stray odours push
        chocolate into bloom &mdash; the harmless white haze of fat or sugar that comes to the
        surface and dulls the snap. If you must refrigerate or freeze it, wrap it tightly and bring
        it back to room temperature before tasting. Quality fades in the order you would expect:
        cocoa powder holds for about three years, unsweetened and dark bars around two, milk
        chocolate about a year, and white chocolate the shortest of all at roughly six months,
        because it has the most milk and the least cacao holding it together.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.ecfr.gov/current/title-21/chapter-I/subchapter-B/part-163" rel="noopener" __SC__>21 CFR Part 163, &ldquo;Cacao Products&rdquo; (U.S. standards of identity)</a>;
        <a href="https://www.nal.usda.gov/sites/default/files/page-files/caffeine.pdf" rel="noopener" __SC__>USDA National Agricultural Library, caffeine per measure</a>;
        <a href="https://hgic.clemson.edu/chocolate-overload-tips-for-storing-various-forms-of-chocolate/" rel="noopener" __SC__>Clemson University HGIC, &ldquo;Tips for Storing Various Forms of Chocolate&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- cheese-board-calculator
CHEESE = """
  <!-- Per-person quantities + varieties + holding -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        How Much Cheese and Charcuterie Per Person
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The quantity depends on one question: is the board an appetizer or is it the meal? Extension
        guidance for charcuterie boards gives a figure for each, and the gap between them is wider
        than most people expect &mdash; a board that shares the table with dinner needs half the
        food of one standing in for dinner.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[620px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Buy to the role the board plays, not to the guest count alone.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Board role</th>
              <th __TH__>Cheese per person</th>
              <th __TH__>Charcuterie per person</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Grazing / cocktail appetizer</td>
              <td __TD__>1&ndash;2 oz</td>
              <td __TD__>2&ndash;3 oz</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>The board is the meal</td>
              <td __TD__>4 oz</td>
              <td __TD__>6 oz</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Penn State Extension puts an appetizer-board portion at 1&ndash;2&nbsp;ounces of cheese per
        person; University of Kentucky family and consumer sciences guidance for a board served as
        a meal doubles that to 4&nbsp;ounces, with charcuterie following the same shape at
        3&nbsp;ounces as an appetizer and 6&nbsp;ounces as a meal. When the board sits between
        those two roles, split the difference and take the lower number whenever a second course is
        coming.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        How many varieties, and how much of each
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The per-variety number people actually cut from is total ounces divided by the number of
        cheeses, so the variety count drives how generous each wedge looks. Three varieties carry a
        small board; five is the ceiling worth buying for a larger one, because past that the
        wedges get thin and the board reads as scraped rather than set. The mix that works is the
        one already used by the <a href="/tools/cheese-board-builder" __SC__>cheese board
        builder</a>: roughly 30% hard, 20% semi-hard, 20% soft, 20% fresh or goat, and 10% blue.
      </p>
      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[620px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            A worked example at the appetizer rate of 2 oz per person.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Guests</th>
              <th __TH__>Total cheese</th>
              <th __TH__>Varieties</th>
              <th __TH__>Per variety</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>8</td>
              <td __TD__>16 oz (1 lb)</td>
              <td __TD__>3</td>
              <td __TD__>about 5.3 oz each</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>16</td>
              <td __TD__>32 oz (2 lb)</td>
              <td __TD__>4</td>
              <td __TD__>8 oz each</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>26</td>
              <td __TD__>52 oz (3.25 lb)</td>
              <td __TD__>5</td>
              <td __TD__>about 10.4 oz each</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Keeping the board safe past the first hour
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Cheese and cured meat are both perishable, and a board is by design the food most likely to
        sit out. Keep it cold &mdash; at or below 40&nbsp;&#176;F until serving, nested on ice if it
        will stand out longer than two hours &mdash; and throw away anything that has been at room
        temperature past the two-hour mark (one hour if the room is above 90&nbsp;&#176;F). The
        habit that keeps a board looking set all evening is extension advice worth copying: build
        several small platters in advance and swap a nearly empty one for a fresh one from the
        refrigerator, rather than topping up a dish that has already been out. Adding new food to
        an old dish is how a safe board turns into a risky one.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://extension.psu.edu/creating-a-healthy-charcuterie-board" rel="noopener" __SC__>Penn State Extension, &ldquo;Creating a Healthy Charcuterie Board&rdquo;</a>;
        <a href="https://fcs.mgcafe.uky.edu/sites/fcs.mgcafe.uky.edu/files/charcuterieboards101-pub.pdf" rel="noopener" __SC__>University of Kentucky Family and Consumer Sciences, &ldquo;Charcuterie Boards 101&rdquo;</a>;
        <a href="https://www.fda.gov/food/buy-store-serve-safe-food/serving-safe-buffets" rel="noopener" __SC__>U.S. Food and Drug Administration, &ldquo;Serving Up Safe Buffets&rdquo;</a>;
        <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f" rel="noopener" __SC__>USDA Food Safety and Inspection Service, &ldquo;Danger Zone (40&nbsp;&#176;F &ndash; 140&nbsp;&#176;F)&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# ------------------------------------------------- buffet-planner
BUFFET = """
  <!-- Worked multi-protein buffet menu -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Building a Buffet Menu: A Worked Six-Category Example
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The request that comes up again and again is a buffet that carries several proteins at once
        &mdash; fish, chicken, pork, beef &mdash; plus a vegetable and a salad. The shape that
        handles it is six categories, each doing one job, with the proteins deliberately split by
        cooking method rather than by animal so nothing crowds the same flavour space.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[760px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            A menu template for a hot buffet line. Swap dishes within a row, keep the row.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Category</th>
              <th __TH__>Example dish</th>
              <th __TH__>Why it is in this slot</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fish</td>
              <td __TD__>Baked salmon, or a white fish in a lemon-butter sauce</td>
              <td __TD__>The lightest protein: it feeds guests who skip red meat and gives the line a second temperature and texture.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Poultry</td>
              <td __TD__>Roast chicken thighs, or a chicken in a cream or mushroom sauce</td>
              <td __TD__>The safe middle that nearly everyone eats; thighs hold far better on a warming tray than breast meat.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Pork</td>
              <td __TD__>Pulled pork, glazed ham, or a braised pork shoulder</td>
              <td __TD__>A rich, soft-textured main that contrasts the roasted or baked dishes either side of it.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Beef</td>
              <td __TD__>Sliced roast beef in au jus, or a braised beef</td>
              <td __TD__>The anchor for the meat-eaters, and the dish that sets how generous the portion math needs to be.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Starch</td>
              <td __TD__>Roast or mashed potatoes, rice pilaf, or a pasta bake</td>
              <td __TD__>The volume filler that keeps the line fed when a protein runs short, and the carrier for whichever sauce is left on the plate.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Vegetable and salad</td>
              <td __TD__>A roasted vegetable plus one cold dressed salad</td>
              <td __TD__>One hot, one cold: the temperature and texture contrast that stops a four-protein line reading as heavy.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Turning the template into numbers
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Four proteins do not mean four full portions per guest. Guests take a little of several and
        a full serving of one, so plan the protein total at roughly one serving per person across
        the whole category, not one per person per dish. For a 60-guest buffet that is about
        60 servings of protein in total, split however you expect the crowd to lean &mdash; often
        half beef and chicken, and the fish and pork sharing the remainder. Add a second, cheaper
        starch and a second salad so the line never empties into one dish, keep at least one
        vegetarian-friendly side that is not an afterthought, and put an acid (a vinegar slaw, a
        pickle, a lemon-dressed green) next to the richest meat. The per-category option counts and
        the portion sizes behind this menu are worked out in the tables above and in the
        <a href="/tools/party-calculator" __SC__>party food calculator</a>.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-3">
        Keeping a four-protein line safe
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        More proteins means more dishes in the danger zone at once, so the FDA's buffet rules carry
        more weight here than on a two-dish table. Hold every hot dish at an internal temperature
        of 140&nbsp;&#176;F or warmer and check it with a thermometer rather than trusting the
        warmer &mdash; some models top out at 110&ndash;120&nbsp;&#176;F, which is warm but not hot
        enough. Keep the cold salad and any chilled sides at 40&nbsp;&#176;F or colder, on ice once
        they have been out two hours. Never top up a partly eaten dish: replace it with a freshly
        filled one from the refrigerator or from an oven held at 200&ndash;250&nbsp;&#176;F. And
        discard anything perishable that has sat out past two hours, or one hour in a room above
        90&nbsp;&#176;F.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.fda.gov/food/buy-store-serve-safe-food/serving-safe-buffets" rel="noopener" __SC__>U.S. Food and Drug Administration, &ldquo;Serving Up Safe Buffets&rdquo;</a>;
        <a href="https://www.canr.msu.edu/news/food_safety_should_be_your_most_important_buffet_guest" rel="noopener" __SC__>Michigan State University Extension, &ldquo;Food safety should be your most important buffet guest&rdquo;</a>;
        <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f" rel="noopener" __SC__>USDA Food Safety and Inspection Service, &ldquo;Danger Zone (40&nbsp;&#176;F &ndash; 140&nbsp;&#176;F)&rdquo;</a>.
      </p>
    </div>
  </section>
"""

BLOCKS = {
    "src/pages/tools/chocolate-pairing.astro": CHOCOLATE,
    "src/pages/tools/cheese-board-calculator.astro": CHEESE,
    "src/pages/tools/buffet-planner.astro": BUFFET,
}

ANCHOR = "  <!-- Related Tools -->"

# dead FSIS path (no /food-safety/ segment) -> verified live path
DEAD_URL = "https://www.fsis.usda.gov/food-safe-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"
LIVE_URL = "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"


def main() -> int:
    check = "--check" in sys.argv
    for rel, block in BLOCKS.items():
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        body = block.replace("__TH__", TH).replace("__TD__", TD).replace("__SC__", SC).rstrip() + "\n"
        if ANCHOR not in s:
            print(f"FAIL {rel}: anchor not found")
            return 1
        new = s.replace(ANCHOR, body + "\n" + ANCHOR, 1)
        if check:
            print(f"would update {rel}: +{len(new) - len(s)} chars")
            continue
        p.write_text(new, encoding="utf-8")
        print(f"updated {rel}: +{len(new) - len(s)} chars")

    # repoint the dead FSIS citation (a prefix-different path, so a plain
    # replace cannot double-replace the live URL)
    for rel in BLOCKS:
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        if DEAD_URL in s:
            if check:
                print(f"would repoint dead FSIS url in {rel}")
            else:
                p.write_text(s.replace(DEAD_URL, LIVE_URL), encoding="utf-8")
                print(f"repointed dead FSIS url in {rel}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
