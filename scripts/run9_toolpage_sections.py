#!/usr/bin/env python3
"""Run 9c: respond to two live Bing demand ridges inside existing tool pages (within the
review gate, no new pages):
  1. /tools/seasonal-guide  -> seasonal-ingredients table from the USDA SNAP-Ed Seasonal
     Produce Guide (verified lists, fetched this run) + how-to-compare section.
  2. /tools/flavor-pairing  -> "flavour pairing" (British spelling) coverage + a classic
     pairing table, since Bing shows ~13 impressions on 'flavour pairing' variants.
Bumps both sitemap lastmods. Assertion-guarded: aborts if an anchor is not unique.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SM = ROOT / "public/sitemap.xml"
DATE = "2026-09-23"

TH = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 font-display text-sm font-semibold uppercase tracking-wide text-[var(--text-primary)]"'
TD = 'class="border-b border-[var(--color-cream-dark)] px-4 py-3 align-top"'
FIG_OPEN = '<figure class="mb-10 overflow-x-auto rounded-2xl border border-[var(--color-cream-dark)] bg-white shadow-[var(--shadow-soft)]">'
TBL_OPEN = '<table class="w-full min-w-[560px] border-collapse text-left text-[var(--text-secondary)]">'
CAP = 'class="px-4 pt-3 text-left text-sm font-medium text-[var(--text-muted)]"'
H2 = 'class="text-display text-2xl font-semibold text-[var(--text-primary)] mb-6 mt-12"'
H3 = 'class="text-display text-xl font-semibold text-[var(--text-primary)] mb-4 mt-10"'
P = 'class="text-[var(--text-secondary)] text-base leading-relaxed mb-6"'
UL = 'class="mb-6 list-disc space-y-2 pl-6 text-[var(--text-secondary)]"'


def rows_html(data, zebra=True):
    out = []
    for i, cells in enumerate(data):
        cls = ' class="bg-[var(--color-cream)]"' if (zebra and i % 2 == 1) else ' class="bg-white"'
        tds = "".join(f"<td {TD}>{c}</td>" for c in cells)
        out.append(f"              <tr{cls}>{tds}</tr>")
    return "\n".join(out)


SEASON_ROWS = [
    ["Spring", "Apples, Apricots, Asparagus, Avocados, Bananas, Blackberries, Broccoli, Cabbage, Carrots, Celery, Collard Greens, Garlic, Herbs, Kale, Kiwifruit, Lemons, Lettuce, Limes, Mushrooms, Onions, Peas, Pineapples, Plantains, Radishes, Rhubarb, Spinach, Strawberries, Swiss Chard, Turnips"],
    ["Summer", "Apples, Apricots, Avocados, Bananas, Beets, Bell Peppers, Blackberries, Blueberries, Cantaloupe, Carrots, Celery, Cherries, Corn, Cucumbers, Eggplant, Garlic, Grapes, Green Beans, Herbs, Honeydew Melon, Lemons, Lima Beans, Limes, Mangos, Okra, Onions, Peaches, Pears, Peas, Pineapples, Plantains, Plums, Raspberries, Strawberries, Summer Squash, Tomatillos, Tomatoes, Watermelon, Zucchini"],
    ["Fall", "Apples, Bananas, Beets, Bell Peppers, Broccoli, Brussels Sprouts, Cabbage, Carrots, Cauliflower, Celery, Collard Greens, Cranberries, Garlic, Ginger, Grapes, Green Beans, Herbs, Kale, Kiwifruit, Lemons, Lettuce, Limes, Mangos, Mushrooms, Okra, Onions, Parsnips, Pears, Peas, Plantains, Pomegranates, Potatoes, Pumpkin, Radishes, Raspberries, Rutabagas, Spinach, Sweet Potatoes and Yams, Swiss Chard, Turnips, Winter Squash"],
    ["Winter", "Apples, Avocados, Bananas, Beets, Brussels Sprouts, Cabbage, Carrots, Celery, Collard Greens, Grapefruit, Grapes, Herbs, Kale, Kiwifruit, Leeks, Lemons, Limes, Onions, Oranges, Parsnips, Pears, Plantains, Pomegranates, Potatoes, Pumpkin, Rutabagas, Sweet Potatoes and Yams, Swiss Chard, Turnips, Winter Squash"],
]

SEASONAL_SECTION = f"""        <h2 {H2}>
          Seasonal Ingredients, Broken Down by Season
        </h2>

        <p {P}>
          When people compare seasonal ingredients, they are usually asking a practical question:
          what is actually at its best right now? The USDA SNAP-Ed Seasonal Produce Guide tracks
          that season by season, and the table below condenses it. Seasonal produce varies by
          growing conditions and weather, so treat this as a national baseline rather than a local
          forecast.
        </p>

        {FIG_OPEN}
          {TBL_OPEN}
            <caption {CAP}>USDA SNAP-Ed Seasonal Produce Guide &mdash; fruits and vegetables listed for each season</caption>
            <thead>
              <tr class="bg-[var(--color-cream-soft)]">
                <th scope="col" {TH}>Season</th>
                <th scope="col" {TH}>Fruits and vegetables at their best</th>
              </tr>
            </thead>
            <tbody>
{rows_html(SEASON_ROWS)}
            </tbody>
          </table>
        </figure>

        <h3 {H3}>
          How to compare &mdash; and find &mdash; seasonal ingredients
        </h3>

        <ul {UL}>
          <li><strong>Read the origin label.</strong> A sticker or sign naming a nearby state is the fastest signal that an item is in its local window; imports cover the rest of the year.</li>
          <li><strong>Watch the price, not the marketing.</strong> Peak-season supply lowers cost, so the cheapest item in the produce section is often the most seasonal one.</li>
          <li><strong>Shop the overlap.</strong> Apples, carrots, celery, onions, and herbs appear in every season on the USDA guide, which makes them reliable year-round buys rather than compromise picks.</li>
          <li><strong>Rotate the rest.</strong> Rhubarb and asparagus belong to spring, corn and tomatoes to summer, pumpkin and parsnips to fall, citrus and winter squash to winter.</li>
        </ul>

        <p {P}>
          Seasonality data in the table above comes from the
          <a href="https://snaped.fns.usda.gov/seasonal-produce-guide" rel="noopener" class="text-[var(--color-wine)] underline">USDA SNAP-Ed Seasonal Produce Guide</a>.
          Once you have a seasonal ingredient, pair it with
          <a href="/tools/flavor-pairing" class="text-[var(--color-wine)] underline">the flavor pairing finder</a>
          or run it through the
          <a href="/tools/meal-prep" class="text-[var(--color-wine)] underline">meal prep calculator</a>
          to size the batch. Budget shoppers can also see how seasonal buying shows up in
          <a href="/articles/grocery-budget-meal-planning" class="text-[var(--color-wine)] underline">the grocery budget plan</a>.
        </p>

"""

FLAVOUR_ROWS = [
    ["Apples", "Cinnamon, sharp cheddar, pork", "Sweet-tart fruit against warm spice, salt, or rich fat"],
    ["Tomatoes", "Basil, mozzarella, olive oil", "Green herb and savory notes balance the acidity"],
    ["Salmon", "Dill, lemon, capers", "Bright and salty accents cut the richness of oily fish"],
    ["Mushrooms", "Thyme, garlic, soy sauce", "Earthy notes lifted by allium and fermented umami"],
    ["Chocolate", "Coffee, orange, chilli", "Roasted, citrus, and warm heat notes stack rather than clash"],
    ["Lamb", "Rosemary, garlic, mint", "Resinous herb and allium standing up to a strong red meat"],
]

FLAVOUR_SECTION = f"""        <h3 {H3}>
          Flavour Pairing: The Same Science, The Other Spelling
        </h3>

        <p {P}>
          A search for a flavour pairing chart is really a search for what the tool above does &mdash;
          <em>flavour</em> is the British and Commonwealth spelling of the same word. Both spellings
          describe one idea: ingredients that share aromatic compounds tend to taste harmonious
          together, which is why basil suits tomato, dill suits salmon, and rosemary suits lamb.
        </p>

        <p {P}>
          If you are cooking from a British recipe book or a European menu, the workflow does not
          change. Pick the base ingredient in the finder, then compare the classic matches with the
          less obvious ones: the classics are the safe route, and the unusual matches are where a
          dish starts to feel deliberate.
        </p>

        {FIG_OPEN}
          {TBL_OPEN}
            <caption {CAP}>Classic pairings the finder returns for common base ingredients</caption>
            <thead>
              <tr class="bg-[var(--color-cream-soft)]">
                <th scope="col" {TH}>Base ingredient</th>
                <th scope="col" {TH}>Classic matches</th>
                <th scope="col" {TH}>Why the combination works</th>
              </tr>
            </thead>
            <tbody>
{rows_html(FLAVOUR_ROWS)}
            </tbody>
          </table>
        </figure>

        <p {P}>
          Pair it with the
          <a href="/tools/herb-spice-matrix" class="text-[var(--color-wine)] underline">herb and spice matrix</a>
          when you want to swap seasonings, the
          <a href="/tools/seasonal-guide" class="text-[var(--color-wine)] underline">seasonal ingredient guide</a>
          to see what is at its best right now, or the
          <a href="/articles/what-to-serve-with-pesto-chicken" class="text-[var(--color-wine)] underline">pesto chicken pairing guide</a>
          to see pairing decisions turned into a full dinner.
        </p>

"""

PAGES = [
    (
        ROOT / "src/pages/tools/seasonal-guide.astro",
        "/tools/seasonal-guide",
        "keywords={['seasonal produce guide', 'whats in season', 'seasonal fruits vegetables', 'peak season produce', 'seasonal cooking']}",
        "keywords={['seasonal produce guide', 'seasonal ingredients', 'whats in season', 'seasonal fruits vegetables', 'peak season produce', 'seasonal cooking']}",
        SEASONAL_SECTION,
        None,
    ),
    (
        ROOT / "src/pages/tools/flavor-pairing.astro",
        "/tools/flavor-pairing",
        None,
        None,
        FLAVOUR_SECTION,
        None,
    ),
]

for path, slug, kw_old, kw_new, section, _ in PAGES:
    html = path.read_text(encoding="utf-8")
    if kw_old:
        if html.count(kw_old) != 1:
            raise SystemExit(f"ABORT [{slug}]: keyword anchor not unique")
        html = html.replace(kw_old, kw_new, 1)
        print(f"OK [{slug} keywords]")
    if html.count("</article>") != 1:
        raise SystemExit(f"ABORT [{slug}]: expected exactly one </article>, found {html.count('</article>')}")
    html = html.replace("</article>", section + "      </article>", 1)
    path.write_text(html, encoding="utf-8")
    print(f"OK [{slug} section] file now {len(html)} chars")

# sitemap lastmods
sm = SM.read_text(encoding="utf-8")
for slug in ["/tools/seasonal-guide", "/tools/flavor-pairing"]:
    i = sm.find(f"<loc>https://pairdish.com{slug}</loc>")
    if i == -1:
        raise SystemExit(f"ABORT [sitemap]: {slug} not found")
    j = sm.find("</url>", i)
    block = sm[i:j]
    if "<lastmod>" not in block:
        raise SystemExit(f"ABORT [sitemap]: no lastmod in {slug}")
    old = block.split("<lastmod>")[1].split("</lastmod>")[0]
    sm = sm[:i] + block.replace(f"<lastmod>{old}</lastmod>", f"<lastmod>{DATE}</lastmod>") + sm[j:]
    print(f"OK [sitemap] {slug} lastmod {old} -> {DATE}")
SM.write_text(sm, encoding="utf-8")
print("done")
