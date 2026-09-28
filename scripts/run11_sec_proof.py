#!/usr/bin/env python3
"""Run-11 within-gate content: demand-matched section on /tools/bread-proofing.

Answers live Bing ridges: "bread dough proofing 6 hours room temperature food safety yeast
dough", "final proof enriched dough 24 25 c ... poke test", "proofing bread dough twice its
size baking temperature 180 c".

Verified this run: King Arthur proofing guide (72-78 F range, quote from Baking Ambassador
Martin Philip; recipes give 1-1.5 h rise ranges as guidelines), King Arthur "has risen enough"
(poke test), FDA raw-flour page, CDC raw-dough page, FSIS Danger Zone / two-hour rule.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

SRC_KA = "https://www.kingarthurbaking.com/blog/2023/08/31/proofing-bread"
SRC_KAP = "https://www.kingarthurbaking.com/blog/2022/08/22/how-to-tell-if-bread-dough-has-risen-enough"
SRC_FDA = "https://www.fda.gov/consumers/consumer-updates/flour-raw-food-and-other-safety-facts"
SRC_CDC = "https://www.cdc.gov/food-safety/foods/no-raw-dough.html"
SRC_DZ = "https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/danger-zone-40f-140f"

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'

BLOCK = """
  <!-- Proofing temperature and time reference -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Proofing Temperature and Time: A Reference Table
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The calculator above converts a temperature into an expected rise time. This table is the
        same ground covered the other way round: for each stage of a bake, what the dough
        temperature should be, how long it usually takes at that temperature, and what you are
        actually looking for when you decide to move on. King Arthur's baking team puts the sweet
        spot for proofing at
        <strong>72&nbsp;&deg;F to 78&nbsp;&deg;F (22&ndash;26&nbsp;&deg;C)</strong> &mdash;
        &ldquo;the right range to encourage yeast activity without having your dough move so fast
        that it overproofs or fails to develop flavor.&rdquo;
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[680px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Typical proofing windows in a 72&ndash;78&nbsp;&deg;F kitchen, with the visual cue that
            ends each stage. Times are starting points, not timers &mdash; judge the dough.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Stage</th>
              <th __TH__>Target temperature</th>
              <th __TH__>Typical window</th>
              <th __TH__>What you are looking for</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Bulk fermentation, commercial yeast</td>
              <td __TD__>72&ndash;78&nbsp;&deg;F (22&ndash;26&nbsp;&deg;C)</td>
              <td __TD__>1&ndash;1&frac12; hours</td>
              <td __TD__>Dough roughly doubles, feels puffy and pillowy, and springs back slowly
                when pressed.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Bulk fermentation, sourdough</td>
              <td __TD__>75&ndash;78&nbsp;&deg;F (24&ndash;26&nbsp;&deg;C)</td>
              <td __TD__>3&ndash;5 hours</td>
              <td __TD__>A domed surface, visible bubbles at the edge of the bowl, and a jiggle
                when you shake the container &mdash; volume up roughly 30&ndash;50%.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Final proof at room temperature</td>
              <td __TD__>72&ndash;78&nbsp;&deg;F (22&ndash;26&nbsp;&deg;C)</td>
              <td __TD__>45&ndash;90 minutes</td>
              <td __TD__>Poke test: a floured finger pressed 1&nbsp;inch in leaves a dent that
                fills back slowly and only partway.</td>
            </tr>
            <tr class="bg-[var(--color-cream)]">
              <td __TD__>Final proof in a warm spot or proofer</td>
              <td __TD__>78&ndash;85&nbsp;&deg;F (26&ndash;29&nbsp;&deg;C)</td>
              <td __TD__>30&ndash;60 minutes</td>
              <td __TD__>Same poke test, checked sooner &mdash; warm dough goes from ready to
                overproofed quickly.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Cold retard in the refrigerator</td>
              <td __TD__>38&ndash;40&nbsp;&deg;F (3&ndash;4&nbsp;&deg;C)</td>
              <td __TD__>8&ndash;24 hours (up to 48)</td>
              <td __TD__>A modest rise, a firm but springy feel, and better flavour &mdash; the
                cold slows yeast while flavour compounds keep developing.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Doubling in Celsius, and why enriched dough is different
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Recipes written in Celsius often pair &ldquo;let it double&rdquo; with an oven number. If
        yours says bake at 180&nbsp;&deg;C, that is 356&nbsp;&deg;F &mdash; run it through
        <a href="/tools/oven-temperature" class="text-[var(--color-wine)] underline">the oven temperature converter</a>
        rather than guessing, because 180&nbsp;&deg;C sits close to the 350&nbsp;&deg;F that most
        bread recipes assume.
      </p>
      <ul class="mb-8 list-disc space-y-2 pl-6 text-[var(--text-secondary)]">
        <li><strong>Doubling is a lean-dough rule.</strong> A dough of flour, water, yeast and salt
          has little to hold it back, so a full double is the classic cue.</li>
        <li><strong>Enriched doughs rarely need a double.</strong> Butter, eggs, sugar and milk
          slow the rise and soften the gluten; a 50&ndash;75% increase, a domed top and a slow
          spring-back are the real signs of readiness.</li>
        <li><strong>Temperature beats the clock.</strong> Same recipe, same kitchen, a
          10&nbsp;&deg;F difference in dough temperature can shift the final proof by half an hour
          or more &mdash; which is exactly what the calculator above is for.</li>
      </ul>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Food safety: dough that sits out, and dough you should not taste
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Proofing is a warm, moist, sugary environment &mdash; the same conditions that let bacteria
        grow. The USDA FSIS &ldquo;Danger Zone&rdquo; is 40&nbsp;&deg;F to 140&nbsp;&deg;F, where
        bacteria can double in number in as little as 20 minutes, so never leave dough &mdash; or
        anything with eggs or milk in it &mdash; out of refrigeration for more than two hours, or
        more than one hour above 90&nbsp;&deg;F. A long proof belongs in the refrigerator, not on
        the counter overnight.
      </p>
      <ul class="mb-8 list-disc space-y-2 pl-6 text-[var(--text-secondary)]">
        <li>The FDA's rule on flour is blunt: most flour is a raw food that has not been treated to
          kill bacteria, so <strong>do not eat or taste raw flour, dough or batter</strong> &mdash;
          cooking and baking is what makes it safe.</li>
        <li>The CDC adds the handling side: wash hands, bowls, utensils and countertops after
          working with raw flour, eggs or dough, and don't let children play with raw dough.</li>
        <li>Refrigerated dough is not a substitute for baking: it is a slower ferment, not a shelf
          food. Use the storage windows on
          <a href="/tools/meal-prep" class="text-[var(--color-wine)] underline">the meal prep planner</a>
          when you are prepping dough ahead.</li>
      </ul>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-4">
        Converting between yeast types for a longer or shorter proof? Use
        <a href="/tools/yeast-converter" class="text-[var(--color-wine)] underline">the yeast converter</a>,
        and check hydration percentages in
        <a href="/tools/sourdough-calculator" class="text-[var(--color-wine)] underline">the sourdough calculator</a>.
      </p>

      <p class="fine-print text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="__SRC_KA__" rel="noopener" class="underline">King Arthur Baking &mdash; proofing bread</a>,
        <a href="__SRC_KAP__" rel="noopener" class="underline">King Arthur Baking &mdash; how to tell if dough has risen enough</a>,
        <a href="__SRC_FDA__" rel="noopener" class="underline">FDA &mdash; flour is a raw food</a>,
        <a href="__SRC_CDC__" rel="noopener" class="underline">CDC &mdash; raw flour and dough</a>, and
        <a href="__SRC_DZ__" rel="noopener" class="underline">USDA FSIS &mdash; &ldquo;Danger Zone&rdquo; (40&ndash;140&nbsp;&deg;F)</a>.
      </p>
    </div>
  </section>

"""


def main():
    p = ROOT / "src/pages/tools/bread-proofing.astro"
    s = p.read_text(encoding="utf-8")
    if "Proofing temperature and time reference" in s:
        print("proofing block: ALREADY PRESENT")
        return
    anchor = "  <!-- Related Tools -->"
    n = s.count(anchor)
    if n != 1:
        raise SystemExit(f"anchor count {n} != 1")
    block = (BLOCK.replace("__TH__", TH).replace("__TD__", TD)
             .replace("__SRC_KA__", SRC_KA).replace("__SRC_KAP__", SRC_KAP)
             .replace("__SRC_FDA__", SRC_FDA).replace("__SRC_CDC__", SRC_CDC)
             .replace("__SRC_DZ__", SRC_DZ))
    s = s.replace(anchor, block + anchor)
    p.write_text(s, encoding="utf-8")
    print(f"proofing block: inserted {len(block)} chars")


if __name__ == "__main__":
    main()
