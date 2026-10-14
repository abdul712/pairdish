#!/usr/bin/env python3
"""Run-17 within-gate content + URL-hygiene work.

Three demand-matched tool-page expansions, each tied to a live Bing ridge in
outreach/bing_queries_run16.txt (fresh window: 701 queries / 72 clicks / 1,101 impressions):

  /tools/drink-calculator    <- "cocktail party drink calculation per person formula",
                                "drink measure calculator to make multiple drinks",
                                "sour mix for two drink what oz do i need for each ingriefent",
                                "if i have 10 bags of drinks each one comes with 4 drinks
                                 how much drinks would i have"                      (~6 impr)
  /tools/appetizer-planner   <- "how to calculate weekly appetizer recipes from total" (3),
                                plus the party-appetizer cluster (halloween cocktail party
                                for 70, spinach pies per serving)                    (~6 impr)
  /tools/yeast-converter     <- the yeast/proofing cluster: "bread dough proofing 6 hours
                                room temperature food safety yeast dough" (4),
                                "instant yeast bread dough first rise 2 hours overproof
                                room temperature" (1), "king arthur baking how to tell bread
                                dough risen enough warm temperature rise time yeast dough" (1),
                                "yeast dough proofing double size temperature time enriched
                                dough" (1)                                          (~7 impr)

Facts were re-fetched and read in THIS run before writing:
  * U.S. standard drink = 0.6 fl oz / 14 g pure alcohol; 12 fl oz beer at 5% ABV,
    5 fl oz wine at 12% ABV, 1.5 fl oz distilled spirits at 40% ABV; and the published note
    that a 12 oz bottle at 10% ABV is TWO standard drinks -- read from NIAAA
    ("What Is A Standard Drink?") and CDC ("About Standard Drink Sizes");
  * beverage planning percentages (morning/afternoon break, by audience mix), the
    "divide cups by 20 to get gallons" rule, the round-up-to-half-gallon rule, appetizer
    benchmarks (14 per person per hour for receptions with no meal, 10 over the lunch hour,
    6-8 for late afternoon/evening) and bar staffing (one bar per 75 guests hosted / 100 cash)
    -- read from the Michigan State University Extension "Food & Beverage Planning Tips" PDF;
  * UAEX (University of Arkansas System Division of Agriculture) appetizer rule (about 8 per
    person in the first two hours and 4 per person for the remaining two hours of a four-hour
    party), hold hot at 140 F or warmer / cold at 39 F or colder, and the two-hour discard rule
    -- read from the UAEX Miller County FCS page;
  * reheat to 165 F, keep cold foods on ice, and the two-hour rule again -- Michigan State
    University Extension "6 tips for food safety at holidays parties and dinners";
  * yeast conversion multipliers -- fresh to active dry multiply by 0.4, fresh to instant
    multiply by 0.33, with the hydration and water-adjustment notes -- read from the King
    Arthur Baking professional reference page;
  * a 1/4 oz (7 g) package of active dry yeast = 2 1/2 tsp dry yeast or 1 compressed yeast
    cake -- Colorado State University Extension "Ingredient Substitutions"; 1 tbsp active dry
    yeast = 1 cake compressed yeast -- New Mexico State University Extension "In a Pinch".

Also creates three 301 redirect pages for the legacy pre-rebrand root URLs whose live
replacements exist (Bing still crawls the old paths: /what-to-serve-with-*/ returns 404 while
the campaign's own crawl stats show a 4xx share every day).

Usage: python3 scripts/run17_toolpage_sections.py [--check]
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
SC = 'class="text-[var(--color-wine)] underline"'

# --------------------------------------------------- drink-calculator
DRINK = """
  <!-- Standard-drink math + non-alcoholic beverage planning -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        What Counts as One Drink &mdash; and Why the Bottle Count Lies
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The calculator above works in servings. A serving is not a fixed amount of alcohol, and
        that is where most party bars go wrong: the same twelve-ounce bottle is one drink or two
        depending only on what is inside it. U.S. health agencies settle the definition the way a
        bar measures a pour &mdash; a standard drink contains about 0.6 fluid ounces, or 14 grams,
        of pure alcohol &mdash; and then translate that into the glass sizes people actually use.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            One U.S. standard drink, by beverage (NIAAA; CDC).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Beverage</th>
              <th __TH__>Standard serving</th>
              <th __TH__>Alcohol by volume</th>
              <th __TH__>Why it matters when you buy</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Regular beer</td>
              <td __TD__>12 fl oz</td>
              <td __TD__>5%</td>
              <td __TD__>The reference case: one bottle, one standard drink.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Malt liquor or hard seltzer</td>
              <td __TD__>8 to 10 fl oz</td>
              <td __TD__>7%</td>
              <td __TD__>More alcohol per ounce, so the standard serving is a smaller pour.</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Table wine</td>
              <td __TD__>5 fl oz</td>
              <td __TD__>12%</td>
              <td __TD__>A restaurant pour, not a full mug &mdash; the five-glasses-per-bottle
                figure comes from this measure.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Distilled spirits (gin, rum, vodka, whiskey)</td>
              <td __TD__>1.5 fl oz</td>
              <td __TD__>40% (80 proof)</td>
              <td __TD__>The shot measure most cocktail recipes assume.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        Mixers change the volume of a drink, not the alcohol in it. A cocktail built on
        1.5 fl oz of spirits and topped with four ounces of juice, soda or sour mix is still one
        standard drink; it simply takes longer to drink. That is the arithmetic your calculator is
        already doing at the guest level, and it is the arithmetic you need at the shopping level
        too.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Standard drinks in the containers people actually buy (1 fl oz = 29.57 mL; the
            arithmetic is shown so you can redo it for any bottle).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Container</th>
              <th __TH__>Volume</th>
              <th __TH__>ABV</th>
              <th __TH__>Standard drinks</th>
              <th __TH__>The arithmetic</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Beer can or bottle</td>
              <td __TD__>12 fl oz</td>
              <td __TD__>5%</td>
              <td __TD__>1</td>
              <td __TD__>12 &times; 0.05 &divide; 0.6 = 1.0</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Craft or imperial beer, same can</td>
              <td __TD__>12 fl oz</td>
              <td __TD__>10%</td>
              <td __TD__>2</td>
              <td __TD__>12 &times; 0.10 &divide; 0.6 = 2.0</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Beer pint glass</td>
              <td __TD__>16 fl oz</td>
              <td __TD__>5%</td>
              <td __TD__>about 1 1/3</td>
              <td __TD__>16 &times; 0.05 &divide; 0.6 = 1.3</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Wine bottle</td>
              <td __TD__>750 mL (25.4 fl oz)</td>
              <td __TD__>12%</td>
              <td __TD__>about 5</td>
              <td __TD__>25.4 &times; 0.12 &divide; 0.6 = 5.1</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Large-format wine bottle</td>
              <td __TD__>1.5 L (50.7 fl oz)</td>
              <td __TD__>12%</td>
              <td __TD__>about 10</td>
              <td __TD__>50.7 &times; 0.12 &divide; 0.6 = 10.1</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Spirits bottle (a fifth)</td>
              <td __TD__>750 mL (25.4 fl oz)</td>
              <td __TD__>40%</td>
              <td __TD__>about 17</td>
              <td __TD__>25.4 &times; 0.40 &divide; 0.6 = 16.9</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Spirits bottle (a handle)</td>
              <td __TD__>1.75 L (59.2 fl oz)</td>
              <td __TD__>40%</td>
              <td __TD__>about 39</td>
              <td __TD__>59.2 &times; 0.40 &divide; 0.6 = 39.5</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        Read the two tables together and the shopping list writes itself: divide the servings the
        calculator gives you for wine by 5 and you have bottles, divide the spirits servings by 17
        and you have fifths. Size the food side of the same event with the
        <a href="/tools/appetizer-planner" __SC__>appetizer planner</a>, and check the whole
        menu still adds up with the
        <a href="/tools/party-calculator" __SC__>party food calculator</a>.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Non-alcoholic drinks need their own count
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Coffee, tea and soda are the drinks most hosts under-buy, because they are planned as an
        afterthought to the bar. Michigan State University Extension publishes percentages of
        attendance for each, split by the makeup of the group and by whether the break falls in
        the morning or the afternoon. Multiply the percentage by your guest count to get cups,
        then divide by 20 (the number of eight-ounce cups in a gallon) to get gallons &mdash; and
        round each partial gallon up to the next half gallon.
      </p>
      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Beverage planning, as a percentage of attendance (Michigan State University
            Extension).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Beverage</th>
              <th __TH__>Morning break: all-male / all-female / mixed</th>
              <th __TH__>Afternoon break: all-male / all-female / mixed</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Regular coffee</td>
              <td __TD__>60% / 50% / 55%</td>
              <td __TD__>35% / 30% / 35%</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Decaf coffee</td>
              <td __TD__>20% / 25% / 25%</td>
              <td __TD__>20% / 20% / 20%</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Tea</td>
              <td __TD__>10% / 15% / 10%</td>
              <td __TD__>10% / 15% / 10%</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Soda</td>
              <td __TD__>25% / 25% / 25%</td>
              <td __TD__>70% / 70% / 70%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Worked once: 300 guests at a mixed morning break means 300 &times; 55% = 165 cups of
        regular coffee, which is 165 &divide; 20 = 8.25 gallons, rounded up to 8.5 gallons. The
        same 300 guests take 75 cups of tea and 75 sodas on that break, and 210 sodas if the break
        falls in the afternoon. The same guidance sizes the bar itself at one bar and bartender per
        75 guests for a hosted bar and per 100 for a cash bar, and suggests opening the bars
        furthest from the entrance first so the queue does not bottleneck at the door.
      </p>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        One caution that has nothing to do with quantities: the amount of alcohol a person drinks
        affects their health, and U.S. health agencies publish the standard-drink definitions used
        above so that count is possible. If you are buying for a mixed group, plan the alcohol-free
        share first, then let the alcohol count fall out of it &mdash; the
        <a href="/tools/buffet-planner" __SC__>buffet planner</a> covers the food side of the same
        event.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.niaaa.nih.gov/alcohols-effects-health/what-standard-drink" rel="noopener" __SC__>National Institute on Alcohol Abuse and Alcoholism, &ldquo;What Is A Standard Drink?&rdquo;</a>;
        <a href="https://www.cdc.gov/alcohol/standard-drink-sizes/index.html" rel="noopener" __SC__>U.S. Centers for Disease Control and Prevention, &ldquo;About Standard Drink Sizes&rdquo;</a>;
        <a href="https://www.canr.msu.edu/eventservices/uploads/files/Food%20&amp;%20Beverage%20Planning%20Tips.pdf" rel="noopener" __SC__>Michigan State University Extension, &ldquo;Food &amp; Beverage Planning Tips&rdquo; (PDF)</a>.
      </p>
    </div>
  </section>
"""

# --------------------------------------------------- appetizer-planner
APPETIZER = """
  <!-- Extension benchmarks for quantities + buffet holding limits -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        What the Extension Services Actually Recommend
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The per-event-type figures above are a starting point. Two university extension services
        publish the benchmarks behind them, and they agree on the shape of the answer: the count
        per person depends on when the party falls and whether a meal is coming afterwards. A
        reception that replaces dinner needs several times the food of a late-evening reception
        where guests have already eaten.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Per-person appetizer benchmarks published by extension services.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Occasion</th>
              <th __TH__>Appetizers per person</th>
              <th __TH__>Published by</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Reception with no meal</td>
              <td __TD__>14 per hour</td>
              <td __TD__>Michigan State University Extension</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Over the lunch hour</td>
              <td __TD__>10</td>
              <td __TD__>Michigan State University Extension</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Late afternoon or late evening reception</td>
              <td __TD__>6 to 8</td>
              <td __TD__>Michigan State University Extension</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Four-hour party, first two hours</td>
              <td __TD__>about 8</td>
              <td __TD__>UAEX, University of Arkansas System Division of Agriculture</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Four-hour party, hours three and four</td>
              <td __TD__>about 4</td>
              <td __TD__>UAEX, University of Arkansas System Division of Agriculture</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        The two sources describe different kinds of party, which is why the numbers look far apart.
        The Michigan State figures are a catering guide for receptions; the UAEX figures describe a
        four-hour party where the appetite falls off as the evening goes on. For a four-hour event,
        the UAEX rule is the more useful one to price, because it scales with the clock rather than
        assuming a single rate.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            The four-hour rule worked for three party sizes (UAEX: about 8 per person in the first
            two hours, about 4 per person after that).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Guests</th>
              <th __TH__>First two hours</th>
              <th __TH__>Last two hours</th>
              <th __TH__>Total pieces</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>20</td>
              <td __TD__>160</td>
              <td __TD__>80</td>
              <td __TD__>240</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>50</td>
              <td __TD__>400</td>
              <td __TD__>200</td>
              <td __TD__>600</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>100</td>
              <td __TD__>800</td>
              <td __TD__>400</td>
              <td __TD__>1,200</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-10">
        That total is pieces, not varieties. Serving four kinds of appetizer to fifty guests means
        about 150 pieces of each rather than 600 of one, which is also the answer to the
        &ldquo;how much of each thing&rdquo; question the planner above cannot know on its own.
        Pair the quantities with the
        <a href="/tools/flavor-pairing" __SC__>flavour pairing tool</a> so the spread reads as a
        menu rather than a list.
      </p>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Holding limits once the table is set
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Appetizer food sits out longer than any other course, which makes holding temperatures part
        of the planning rather than an afterthought. The limits below come from the same extension
        guidance as the quantities.
      </p>
      <div class="overflow-x-auto mb-8">
        <table class="w-full min-w-[640px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Holding and safety limits for a buffet or appetizer table.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Item</th>
              <th __TH__>Limit</th>
              <th __TH__>Published by</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Hot appetizers held for service</td>
              <td __TD__>140 &deg;F or warmer</td>
              <td __TD__>UAEX</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Cold appetizers held for service</td>
              <td __TD__>39 &deg;F or colder</td>
              <td __TD__>UAEX</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>Food left at room temperature</td>
              <td __TD__>discard after 2 hours</td>
              <td __TD__>UAEX; Michigan State University Extension</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Reheating a dish before it goes back out</td>
              <td __TD__>165 &deg;F</td>
              <td __TD__>Michigan State University Extension</td>
            </tr>
          </tbody>
        </table>
      </div>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>Serve hot appetizers in stages rather than all at once, so a hot tray replaces an
          emptied one instead of sitting under a lamp.</li>
        <li>Nest cold dishes in bowls of ice, or use small trays and replace them often &mdash;
          dips, salads and cut fruit are the items that spend the longest on the table.</li>
        <li>Do not reheat food in a slow cooker. Heat it to 165 &deg;F in the oven or microwave
          first, then move it to the slow cooker to hold.</li>
        <li>Keep the count honest: the two-hour clock applies to the food that has been out, not to
          the party, so a late-arriving tray gets its own two hours.</li>
      </ul>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.uaex.uada.edu/counties/miller/news/fcs/holiday-foods/Appetizers-or-Hors-d-oeuvres-Options-are-Endless.aspx" rel="noopener" __SC__>UAEX (University of Arkansas System Division of Agriculture), &ldquo;Appetizers or hors d&rsquo;oeuvres Options are Endless&rdquo;</a>;
        <a href="https://www.canr.msu.edu/eventservices/uploads/files/Food%20&amp;%20Beverage%20Planning%20Tips.pdf" rel="noopener" __SC__>Michigan State University Extension, &ldquo;Food &amp; Beverage Planning Tips&rdquo; (PDF)</a>;
        <a href="https://www.canr.msu.edu/news/6_tips_for_food_safety_at_holidays_parties_and_dinners" rel="noopener" __SC__>Michigan State University Extension, &ldquo;6 tips for food safety at holidays parties and dinners&rdquo;</a>.
      </p>
    </div>
  </section>
"""

# --------------------------------------------------- yeast-converter
YEAST = """
  <!-- Published conversion multipliers + packet-based substitutions -->
  <section class="py-16 bg-[var(--color-cream)]">
    <div class="container max-w-4xl">
      <h2 class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-4">
        Converting Between Fresh, Active Dry and Instant Yeast
      </h2>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Fresh yeast, active dry yeast and instant yeast are the same organism packaged at three
        different moisture levels, so the conversion is a matter of weight rather than of strength.
        King Arthur Baking&rsquo;s professional reference publishes the two multipliers that cover
        most substitutions, both written from fresh yeast as the starting point because that is
        where the water is.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Published conversion rules (King Arthur Baking professional reference).
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>Converting</th>
              <th __TH__>Multiply the fresh weight by</th>
              <th __TH__>Handling note</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fresh yeast to active dry yeast</td>
              <td __TD__>0.4</td>
              <td __TD__>Active dry must be hydrated in warm water before it goes into the
                dough.</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Fresh yeast to instant yeast</td>
              <td __TD__>0.33</td>
              <td __TD__>Instant can be added straight to the flour; make up the weight difference
                with extra water so the dough yield stays the same.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Going the other way means dividing by the same multiplier, which is how a recipe written
        around a packet of dry yeast gets translated to the block of fresh yeast at the back of the
        shop. The two multipliers also imply a cross-rate between the dry yeasts: instant yeast is
        about 0.825 times the weight of active dry (0.33 divided by 0.4), so active dry is about
        1.21 times instant. Keep that in mind as an estimate rather than a rule &mdash; the
        published guidance is to use the manufacturer&rsquo;s own ratio when it is printed on the
        package.
      </p>

      <div class="overflow-x-auto mb-10">
        <table class="w-full min-w-[720px] border-collapse text-left text-[var(--text-secondary)]">
          <caption class="px-4 pb-2 text-left text-sm font-medium text-[var(--text-muted)]">
            Worked conversions. Arithmetic from the rules above: fresh &times; 0.4 for
            active dry, fresh &times; 0.33 for instant, and division to travel back to fresh.
          </caption>
          <thead>
            <tr class="bg-[var(--color-cream-soft)]">
              <th __TH__>The recipe calls for</th>
              <th __TH__>Fresh</th>
              <th __TH__>Active dry</th>
              <th __TH__>Instant</th>
            </tr>
          </thead>
          <tbody>
            <tr class="bg-white">
              <td __TD__>Fresh yeast, 30 g</td>
              <td __TD__>30 g</td>
              <td __TD__>12 g</td>
              <td __TD__>10 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>Fresh yeast, 10 g</td>
              <td __TD__>10 g</td>
              <td __TD__>4 g</td>
              <td __TD__>3.3 g</td>
            </tr>
            <tr class="bg-white">
              <td __TD__>One packet active dry, 7 g (1/4 oz)</td>
              <td __TD__>about 17.5 g</td>
              <td __TD__>7 g</td>
              <td __TD__>about 5.8 g</td>
            </tr>
            <tr class="bg-[var(--color-cream-soft)]">
              <td __TD__>One packet instant, 7 g</td>
              <td __TD__>about 21 g</td>
              <td __TD__>about 8.5 g</td>
              <td __TD__>7 g</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        Reading the packet instead of the scale
      </h3>
      <ul class="list-disc pl-6 space-y-2 text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        <li>A 1/4 ounce (7 g) package of active dry yeast holds 2 1/2 teaspoons &mdash; Colorado
          State University Extension lists it as the equivalent of one compressed yeast cake.</li>
        <li>A tablespoon of active dry yeast is also listed as one cake of compressed yeast by New
          Mexico State University Extension, which is the handier measure when a recipe calls for
          an odd fraction of a packet.</li>
        <li>Only active dry needs the warm-water step. Instant yeast can be mixed straight into the
          flour, and fresh yeast is crumbled into the dough.</li>
        <li>Weigh rather than scoop when precision matters: a tablespoon of active dry is a volume
          measure, and the two dry yeasts differ in granule size.</li>
      </ul>

      <h3 class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4">
        What a conversion does not fix
      </h3>
      <p class="text-[var(--text-secondary)] text-base leading-relaxed mb-6">
        Changing the yeast form does not change how fast the dough rises. Dough temperature, the
        amount of sugar and salt in the formula, and the temperature of the room do that, which is
        why the same recipe can double in ninety minutes in summer and in four hours in a cold
        kitchen. Judge the rise by the dough rather than the clock: the
        <a href="/tools/bread-proofing" __SC__>bread proofing guide</a> covers the visual cues and
        the time-and-temperature reference table, the
        <a href="/tools/sourdough-calculator" __SC__>sourdough calculator</a> covers the wild-yeast
        case, and the <a href="/tools/flour-substitution" __SC__>flour substitution tool</a>
        covers the other half of a formula swap when the flour changes at the same time. If you
        are scaling the whole recipe rather than one ingredient, run it through the
        <a href="/tools/recipe-scaler" __SC__>recipe scaler</a> afterwards.
      </p>

      <p class="text-sm text-[var(--text-muted)] leading-relaxed">
        Sources: <a href="https://www.kingarthurbaking.com/pro/reference/yeast" rel="noopener" __SC__>King Arthur Baking, professional reference: &ldquo;Yeast&rdquo;</a>;
        <a href="https://extension.colostate.edu/resource/ingredient-substitutions/" rel="noopener" __SC__>Colorado State University Extension, &ldquo;Ingredient Substitutions&rdquo;</a>;
        <a href="https://pubs.nmsu.edu/_e/E131/index.html" rel="noopener" __SC__>New Mexico State University Extension, &ldquo;In a Pinch: Ingredient Substitution&rdquo;</a>.
      </p>
    </div>
  </section>
"""

BLOCKS = {
    "src/pages/tools/drink-calculator.astro": DRINK,
    "src/pages/tools/appetizer-planner.astro": APPETIZER,
    "src/pages/tools/yeast-converter.astro": YEAST,
}

ANCHOR = "  <!-- Related Tools -->"

# legacy root URLs (pre-rebrand, still crawled) -> the live, topically-equivalent page
REDIRECTS = {
    "what-to-serve-with-fried-fish": "/articles/what-to-serve-with-fried-fish",
    "what-to-serve-with-roasted-potatoes": "/articles/what-to-serve-with-roasted-potatoes",
    "what-to-serve-with-pesto-chicken": "/articles/what-to-serve-with-pesto-chicken",
}

REDIRECT_TMPL = """---
// Legacy pre-rebrand URL. Bing still crawls it (404 before this change); the live guide that
// covers the same question sits under /articles/. 301 so the old URL is not thrown away.
// Both slash variants match this route: Astro's trailingSlash default is 'ignore'.
return Astro.redirect('%(target)s', 301);
---

<p>This page has moved to <a href="%(target)s">%(target)s</a>.</p>
"""

MARKERS = ["The Macro Balancing Math", "Converting Liquid Sweeteners", "Mapping Herbs and Spices by Taste"]


def main() -> int:
    check = "--check" in sys.argv
    for rel, block in BLOCKS.items():
        p = ROOT / rel
        s = p.read_text(encoding="utf-8")
        body = block.replace("__TH__", TH).replace("__TD__", TD).replace("__SC__", SC).rstrip() + "\n"
        if ANCHOR not in s:
            print(f"FAIL {rel}: anchor not found")
            return 1
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

    for slug, target in REDIRECTS.items():
        p = ROOT / "src/pages" / f"{slug}.astro"
        if p.exists():
            print(f"skip {p.name}: already present")
            continue
        if check:
            print(f"would create src/pages/{slug}.astro -> {target}")
            continue
        p.write_text(REDIRECT_TMPL % {"target": target}, encoding="utf-8")
        print(f"created src/pages/{slug}.astro -> {target}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
