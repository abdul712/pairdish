#!/usr/bin/env python3
"""Run-11 within-gate content: demand-matched data section on /tools/cheese-board-builder.

Answers live Bing ridges: "cheese board how much cheese", "how much cheese per person for a
cheese board per variety", "cheese board variety proportions hard soft blue goat cheese",
"cheese baord ideas for 6 people as an app", "blue cheese weight".

Storage numbers verified this run against FSIS "How long can you keep dairy products..."
and the University of Nebraska-Lincoln Extension home food storage chart (both fetched).
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

SRC_FSIS = "https://ask.fsis.usda.gov/article/How-long-can-you-keep-dairy-products-like-yogurt-milk-and-cheese-in-the-refrigerator"
SRC_UNL = "https://food.unl.edu/free-resource/food-storage/"
SRC_DZ = "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"
SRC_CFS = "https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts"

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'

BLOCK = """
  <!-- Cheese quantities, board proportions and storage -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        How Much Cheese Per Person, by Board Style
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The builder above sizes your board from one number: ounces of cheese per guest. What
        changes between events is that number, and it changes a lot &mdash; a pre-dinner board
        with dinner still coming needs a third of what a cheese-only supper needs. The table
        below is the same scale the builder uses, written out so you can check it at a glance.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Per-guest cheese quantities by board style, with the number of cheeses that keeps a
            board readable rather than crowded.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Board style</th>
              <th __TH__>Cheese per guest</th>
              <th __TH__>Cheeses to include</th>
              <th __TH__>Why it works out that way</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Cocktail hour, dinner to follow</td>
              <td __TD__>1.5&ndash;2 oz</td>
              <td __TD__>3&ndash;4</td>
              <td __TD__>Guests are grazing, not eating a course; the board is one of several
                things on the table, so 2 oz each still leaves plenty per person.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Appetizer board before a meal</td>
              <td __TD__>2 oz</td>
              <td __TD__>3&ndash;5</td>
              <td __TD__>Enough to take the edge off without filling anyone before the main
                course &mdash; the level most hosts should start from.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cheese is the main event</td>
              <td __TD__>3&ndash;4 oz</td>
              <td __TD__>5&ndash;6</td>
              <td __TD__>With bread, fruit and something pickled alongside, 3&ndash;4 oz of
                cheese reads as a full plate once the accompaniments are added.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Cheese-only dinner</td>
              <td __TD__>4&ndash;5 oz</td>
              <td __TD__>5&ndash;6</td>
              <td __TD__>The board is dinner, so portion it like a main course rather than a
                garnish &mdash; and expect the blue and the aged wedges to go last.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Variety proportions for a balanced board
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Variety is about contrast in three directions at once: how long the cheese was aged
        (which drives salt and intensity), how much moisture it holds, and which milk it came
        from. Splitting the total weight by style &mdash; rather than buying an ounce of six
        things &mdash; is what stops a board from becoming six near-identical slices.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            A workable split of the total cheese weight by style; adjust by a few points to taste
            but keep the spread in intensity.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Style</th>
              <th __TH__>Share of weight</th>
              <th __TH__>Examples</th>
              <th __TH__>What it contributes</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Hard and aged</td>
              <td __TD__>30%</td>
              <td __TD__>Aged cheddar, Parmesan, Manchego, Gruy&egrave;re</td>
              <td __TD__>Salt, structure and a long finish; also the most forgiving to leave on
                the board for an hour.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Semi-hard</td>
              <td __TD__>20%</td>
              <td __TD__>Gouda, Comt&eacute;, Jarlsberg, young Manchego</td>
              <td __TD__>The middle ground that most guests actually eat most of &mdash; mild,
                sliceable, pairs with everything else on the board.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Soft and bloomy</td>
              <td __TD__>20%</td>
              <td __TD__>Brie, Camembert, triple-cream</td>
              <td __TD__>Richness and spreadability; these want about 30 minutes out of the
                fridge so the paste relaxes.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Fresh and goat</td>
              <td __TD__>20%</td>
              <td __TD__>Ch&egrave;vre, feta, ricotta salata</td>
              <td __TD__>Acid and brightness &mdash; the reset button between two rich bites.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Blue</td>
              <td __TD__>10%</td>
              <td __TD__>Roquefort, Gorgonzola, Stilton</td>
              <td __TD__>A small wedge goes an unusually long way: it is the most assertive
                thing on the board, so weight it lightly.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Storage and food-safety windows after the board is built
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Cheese is a perishable food, and the softer it is, the shorter the window. Keep the
        refrigerator at or below 40&nbsp;&deg;F, keep wrapped wedges in the vegetable drawer or
        another cold spot, and follow the same two-hour rule the rest of your food follows:
        anything left out longer than two hours &mdash; one hour if the room is above
        90&nbsp;&deg;F &mdash; should be discarded rather than re-chilled.
      </p>

      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Refrigerator and freezer storage times (USDA FSIS dairy guidance and the
            University of Nebraska-Lincoln Extension home food storage chart).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Cheese</th>
              <th __TH__>Refrigerator (40&nbsp;&deg;F or below)</th>
              <th __TH__>Freezer (0&nbsp;&deg;F or below)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white"><td __TD__>Hard &mdash; cheddar, Swiss, block Parmesan</td><td __TD__>6 months unopened; 3&ndash;4 weeks after opening</td><td __TD__>6 months</td></tr>
            <tr class="bg-[var(--color-cream)]"><td __TD__>Soft &mdash; Brie, Camembert, Bel Paese</td><td __TD__>1&ndash;2 weeks</td><td __TD__>6 months</td></tr>
            <tr class="bg-white"><td __TD__>Shredded &mdash; cheddar, mozzarella</td><td __TD__>1 month</td><td __TD__>3&ndash;4 months</td></tr>
            <tr class="bg-[var(--color-cream)]"><td __TD__>Cottage or ricotta</td><td __TD__>2 weeks unopened; 1 week opened</td><td __TD__>Does not freeze well</td></tr>
            <tr class="bg-white"><td __TD__>Cream cheese</td><td __TD__>2 weeks</td><td __TD__>Does not freeze well</td></tr>
            <tr class="bg-[var(--color-cream)]"><td __TD__>Processed slices</td><td __TD__>3&ndash;4 weeks</td><td __TD__>Does not freeze well</td></tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Scale the guest count first with
        <a href="/tools/cheese-board-calculator" class="text-[var(--color-wine)] underline">the cheese board calculator</a>,
        then pick cheeses by contrast with
        <a href="/tools/cheese-pairing" class="text-[var(--color-wine)] underline">the cheese pairing guide</a>.
        If the board is one station of a larger spread, the
        <a href="/tools/appetizer-planner" class="text-[var(--color-wine)] underline">appetizer planner</a>
        and <a href="/tools/party-calculator" class="text-[var(--color-wine)] underline">party calculator</a>
        keep the other stations in proportion.
      </p>

      <p class="fine-print text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="__SRC_FSIS__" rel="noopener" class="underline">USDA FSIS &mdash; dairy storage times</a>,
        <a href="__SRC_UNL__" rel="noopener" class="underline">University of Nebraska-Lincoln Extension home food storage chart</a>,
        <a href="__SRC_CFS__" rel="noopener" class="underline">FoodSafety.gov cold food storage chart</a>, and
        <a href="__SRC_DZ__" rel="noopener" class="underline">USDA FSIS &ldquo;Danger Zone&rdquo; (40&nbsp;&deg;F&ndash;140&nbsp;&deg;F)</a>.
      </p>
    </div>
  </section>

"""

DUP = """        <a href="/tools/cheese-pairing" class="card bg-white hover:border-[var(--color-wine)] border border-transparent flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center text-2xl">
            🧀
          </div>
          <div>
            <h4 class="font-medium text-[var(--text-primary)]">Cheese Pairing Guide</h4>
            <p class="text-sm text-[var(--text-muted)]">Perfect accompaniments</p>
          </div>
        </a>"""

FIXED = """        <a href="/tools/appetizer-planner" class="card bg-white hover:border-[var(--color-wine)] border border-transparent flex items-center gap-4 p-4">
          <div class="w-12 h-12 rounded-lg bg-rose-100 flex items-center justify-center text-2xl">
            🫒
          </div>
          <div>
            <h4 class="font-medium text-[var(--text-primary)]">Appetizer Planner</h4>
            <p class="text-sm text-[var(--text-muted)]">Size the rest of the spread</p>
          </div>
        </a>"""


def main():
    p = ROOT / "src/pages/tools/cheese-board-builder.astro"
    s = p.read_text(encoding="utf-8")
    block = (BLOCK.replace("__TH__", TH).replace("__TD__", TD)
             .replace("__SRC_FSIS__", SRC_FSIS).replace("__SRC_UNL__", SRC_UNL)
             .replace("__SRC_DZ__", SRC_DZ).replace("__SRC_CFS__", SRC_CFS))
    out = []
    if "Cheese quantities, board proportions and storage" in s:
        out.append("cheese block: ALREADY PRESENT")
    else:
        anchor = "  <!-- Related Tools -->"
        n = s.count(anchor)
        if n != 1:
            raise SystemExit(f"anchor count {n} != 1")
        s = s.replace(anchor, block + anchor)
        out.append(f"cheese block: inserted {len(block)} chars")
    if DUP in s:
        s = s.replace(DUP, FIXED)
        out.append("duplicate cheese-pairing card replaced with appetizer-planner")
    else:
        out.append("duplicate card: not found (already fixed?)")
    p.write_text(s, encoding="utf-8")
    print("\n".join(out))


if __name__ == "__main__":
    main()
