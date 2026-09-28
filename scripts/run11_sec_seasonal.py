#!/usr/bin/env python3
"""Run-11 within-gate content: demand-matched section on /tools/seasonal-guide.

Answers the live Bing ridge cluster around "where to find seasonal ingredients" (10 impr),
"seasonal ingredients breakdown" (10), "compare seasonal ingredients" (8), "seasonal
ingredients guide" (5) and friends.

Verified this run: USDA AMS Local Food Directories hub page (farmers market, on-farm market,
CSA, food hub, agritourism) and the USDA Local Food Portal the directories now live on.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

SRC_AMS = "https://www.ams.usda.gov/services/local-regional/food-directories"
SRC_PORTAL = "https://www.usdalocalfoodportal.com/"
SRC_SNAPED = "https://snaped.fns.usda.gov/seasonal-produce-guide"

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'

BLOCK = """
  <!-- Where to find seasonal ingredients -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Where to Find Seasonal Ingredients Near You
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The table further up answers <em>what</em> is in season; the harder half is
        <em>where</em> to buy it. The USDA Agricultural Marketing Service runs a set of
        national directories that cover exactly that &mdash; farmers markets, on-farm markets,
        CSAs, food hubs and agritourism operations, all searchable by location on the
        <a href="__SRC_PORTAL__" rel="noopener" class="text-[var(--color-wine)] underline">USDA Local Food Portal</a>.
        Each type of outlet solves a different problem, so it helps to know which one you want
        before you drive anywhere.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            USDA Local Food Directory types, and the shopping job each one is best at.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Where to look</th>
              <th __TH__>Best for</th>
              <th __TH__>What to ask when you get there</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Farmers market (National Farmers Market Directory)</td>
              <td __TD__>The widest choice of peak-season produce in one trip, plus the ability
                to taste before buying.</td>
              <td __TD__>Which items were picked this week, and which are at the end of their
                local window.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>On-farm market or farm stand (On-Farm Market Directory)</td>
              <td __TD__>Produce that is hours off the plant rather than days &mdash; the shortest
                possible supply chain.</td>
              <td __TD__>Opening days (many are seasonal or weekend-only) and whether seconds are
                sold by the box.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>CSA share (Community Supported Agriculture)</td>
              <td __TD__>A predictable weekly box that rotates you through the season
                automatically &mdash; the no-decisions version of seasonal eating.</td>
              <td __TD__>Share size, pick-up day, and how much of the season is left; then plan
                the week with <a href="/tools/meal-prep" class="text-[var(--color-wine)] underline">the meal prep planner</a>.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Food hub (Food Hub Directory)</td>
              <td __TD__>Volume buying &mdash; cases for preserving, freezing, or a buffet-sized
                spread from more than one farm.</td>
              <td __TD__>Minimum order, delivery day, and what is coming in next week.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>U-pick and agritourism (Agritourism Directory)</td>
              <td __TD__>Fruit at true tree-ripeness, in quantity, for jam, freezing or a
                weekend outing.</td>
              <td __TD__>How long the u-pick window stays open, and whether containers are
                provided.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        How to time a seasonal shop
      </h3>
      <ul class="mb-8 list-disc space-y-2 pl-6 text-[var(--text-secondary)]">
        <li><strong>Start with the national baseline, then check locally.</strong> The USDA
          SNAP-Ed table above tells you which items are plausibly in season; the directories tell
          you who has them within driving distance this week.</li>
        <li><strong>Buy the peak, not the shoulder.</strong> Prices bottom out when a crop is
          abundant, so the cheapest item at the stall is usually the one at its true peak &mdash;
          the same signal that works in a supermarket.</li>
        <li><strong>Plan the preserving trip separately.</strong> A food hub or u-pick is where you
          buy the flat of tomatoes or the case of peaches; the weekly market is for eating.</li>
        <li><strong>Write the list from the box.</strong> A CSA share is only cheaper than the
          supermarket if the produce gets used &mdash; run the week's box through
          <a href="/tools/grocery-list" class="text-[var(--color-wine)] underline">the grocery list builder</a>
          and the pairing tools before it wilts.</li>
        <li><strong>Check the price context.</strong> Seasonal shopping shows up as a lower
          grocery bill over a year, which is the point of
          <a href="/articles/grocery-budget-meal-planning" class="text-[var(--color-wine)] underline">the grocery budget plan</a>.</li>
      </ul>

      <p class="fine-print text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="__SRC_AMS__" rel="noopener" class="underline">USDA AMS &mdash; Local Food Directories</a>,
        <a href="__SRC_PORTAL__" rel="noopener" class="underline">USDA Local Food Portal</a>, and
        <a href="__SRC_SNAPED__" rel="noopener" class="underline">USDA SNAP-Ed Seasonal Produce Guide</a>.
      </p>
    </div>
  </section>

"""


def main():
    p = ROOT / "src/pages/tools/seasonal-guide.astro"
    s = p.read_text(encoding="utf-8")
    if "Where to find seasonal ingredients" in s:
        print("seasonal block: ALREADY PRESENT")
        return
    anchor = "  <!-- Related Tools -->"
    n = s.count(anchor)
    if n != 1:
        raise SystemExit(f"anchor count {n} != 1")
    block = (BLOCK.replace("__TH__", TH).replace("__TD__", TD)
             .replace("__SRC_AMS__", SRC_AMS).replace("__SRC_PORTAL__", SRC_PORTAL)
             .replace("__SRC_SNAPED__", SRC_SNAPED))
    s = s.replace(anchor, block + anchor)
    p.write_text(s, encoding="utf-8")
    print(f"seasonal block: inserted {len(block)} chars")


if __name__ == "__main__":
    main()
