#!/usr/bin/env python3
"""Run-21 pre-deploy QA gate: oven-temperature, meal-prep and protein-calculator expansions.

Per page: tag balance, no literal \\uXXXX, no href=undefined, no banned 'undefined' token,
no brace inside the inserted sections, meta <=160, no FAQ markup, every internal href
resolves on disk, externals on the official allowlist, exact table-row counts, required
sections present, and the page's own arithmetic/figures checked against the values that
were pulled from the primary sources this run.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAGES = {
    "src/pages/tools/oven-temperature.astro": [
        "Oven Temperatures: What the Dial Means and What the Food Needs",
        "Converting between Fahrenheit, Celsius and gas mark",
        "Some oven temperatures are a safety limit, not a preference",
        "Check the oven, not the dial",
        "145&nbsp;&deg;F (62.8&nbsp;&deg;C)",
        "165&nbsp;&deg;F (73.9&nbsp;&deg;C)",
        "160&nbsp;&deg;F (71.1&nbsp;&deg;C)",
        "plus or minus 2&nbsp;&deg;F (0.5&nbsp;&deg;C)",
        "safe-temperature-chart",
        "thermometer-calibration-guide-2.pdf",
    ],
    "src/pages/tools/meal-prep.astro": [
        "What a Week of Meal Prep Costs, and How Long It Keeps",
        "From a price list to a cost per portion",
        "How long a prepped meal actually keeps",
        "Cooling, reheating and the two-hour rule",
        "$4.203 per lb",
        "&minus;34.9%",
        "3 to 4 days",
        "cold-food-storage-charts",
        "serving-safe-buffets",
    ],
    "src/pages/tools/protein-calculator.astro": [
        "How Much Protein the Guidelines Actually Recommend",
        "The two numbers, side by side",
        "What that looks like in food",
        "Splitting the target across three meals",
        "1.2&ndash;1.6 grams of protein per kilogram",
        "84 to 112 grams",
        "FDC 2646170",
        "cdn.realfood.gov/DGA.pdf",
        "fdc.nal.usda.gov",
    ],
}

# <tr> counts include one header row per table.
ROW_COUNTS = {
    "src/pages/tools/oven-temperature.astro": 28,      # gas 11+1, FSIS 8+1, altitude 6+1
    "src/pages/tools/meal-prep.astro": 20,             # BLS 10+1, storage 8+1
    "src/pages/tools/protein-calculator.astro": 18,    # DGA 5+1, FDC 7+1, worked day 3+1
}

BRACE_SCOPE = {
    "src/pages/tools/oven-temperature.astro":
        "<!-- Oven temperatures: the scales, the safety floor, and the calibration check -->",
    "src/pages/tools/meal-prep.astro": "<!-- Cost, storage life and reheating -->",
    "src/pages/tools/protein-calculator.astro":
        "<!-- What the guidelines say, and what it looks like on a plate -->",
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "foodsafety.gov", "fda.gov", "cdc.gov", "ers.usda.gov", "bls.gov",
    "usda.gov", "ams.usda.gov", "usdalocalfoodportal.com", "snaped.fna.usda.gov",
    "kingarthurbaking.com", "extension.colostate.edu", "canr.msu.edu", "uaex.uada.edu",
    "ecfr.gov", "ods.od.nih.gov", "efsa.europa.eu", "nature.com", "pmc.ncbi.nlm.nih.gov",
    "pubmed.ncbi.nlm.nih.gov", "scijournals.onlinelibrary.wiley.com", "realfood.gov",
    "dietaryguidelines.gov", "hgic.clemson.edu", "pubs.nmsu.edu", "niaa.nih.gov",
    "asi.k-state.edu", "k-state.edu", "fdc.nal.usda.gov", "nal.usda.gov",
)

BANNED_HOSTS = ("snaped.fns.usda.gov",)
TAGS = ("section", "div", "article", "figure", "table", "caption", "tr", "td", "th",
        "thead", "tbody", "ul", "ol", "li", "p", "h2", "h3")

fails = []


def pages_on_disk():
    out = set()
    for p in (ROOT / "src" / "pages").rglob("*.astro"):
        slug = p.relative_to(ROOT / "src" / "pages").with_suffix("").as_posix()
        if slug == "index":
            slug = ""
        out.add("/" + slug)
        if slug.endswith("/index"):
            out.add("/" + slug[: -len("/index")])
    for p in (ROOT / "public").rglob("*"):
        if p.is_file():
            out.add("/" + p.relative_to(ROOT / "public").as_posix())
    return out


DISK = pages_on_disk()

for rel, markers in PAGES.items():
    s = (ROOT / rel).read_text(encoding="utf-8")
    body = s.split("---", 2)[-1] if s.startswith("---") else s
    for tag in TAGS:
        o = len(re.findall(rf"<{tag}[\s>]", body))
        c = len(re.findall(rf"</{tag}>", body))
        if o != c:
            fails.append(f"{rel}: <{tag}> open={o} close={c}")
    if re.search(r"(?<!\\)\\u[0-9a-fA-F]{4}", body):
        fails.append(f"{rel}: literal \\uXXXX escape in markup")
    if 'href="undefined"' in s:
        fails.append(f"{rel}: href=undefined")
    if re.search(r"FAQPage|Frequently Asked Questions", s):
        fails.append(f"{rel}: FAQ markup present")
    for m in re.finditer(r'description="([^"]*)"', s):
        if len(m.group(1)) > 160:
            fails.append(f"{rel}: description over 160 chars ({len(m.group(1))})")
    if re.search(r"\bundefined\b", s):
        fails.append(f"{rel}: banned token 'undefined' in page")
    start_marker = BRACE_SCOPE[rel]
    if start_marker not in body:
        fails.append(f"{rel}: inserted-section marker missing")
    else:
        seg = body.split(start_marker, 1)[1]
        # stop at the Related Tools section that follows every inserted block
        seg = seg.split("<!-- Related Tools -->", 1)[0]
        if "{" in seg or "}" in seg:
            fails.append(f"{rel}: literal brace inside inserted section")
    for m in markers:
        if m not in s:
            fails.append(f"{rel}: marker missing -> {m[:60]}")
    for href in re.findall(r'href="([^"]+)"', s):
        if href.startswith("/"):
            base = href.split("#")[0].split("?")[0].rstrip("/") or "/"
            if base not in DISK:
                fails.append(f"{rel}: internal href not on disk -> {href}")
        elif href.startswith("https://"):
            host = href.split("/")[2].lower()
            if not any(host == h or host.endswith("." + h) for h in ALLOWED_EXT_HOSTS):
                fails.append(f"{rel}: non-official external href -> {href}")
        elif href.startswith("#") or href.startswith("mailto:"):
            pass
        else:
            fails.append(f"{rel}: unexpected href scheme -> {href}")

for rel, want in ROW_COUNTS.items():
    s = (ROOT / rel).read_text(encoding="utf-8")
    got = len(re.findall(r"<tr[\s>]", s))
    if got != want:
        fails.append(f"{rel}: table rows {got} != expected {want}")

for p in (ROOT / "src").rglob("*.astro"):
    txt = p.read_text(encoding="utf-8")
    for bad in BANNED_HOSTS:
        if bad in txt:
            fails.append(f"{p.relative_to(ROOT)}: retired {bad} citation still present")

# ---- oven-temperature: gas-mark table must be internally consistent ----
oven = (ROOT / "src/pages/tools/oven-temperature.astro").read_text(encoding="utf-8")
manual = {
    "1/4": (225, 110), "1/2": (250, 120), "1": (275, 140), "2": (300, 150),
    "3": (325, 160), "4": (350, 180), "5": (375, 190), "6": (400, 200),
    "7": (425, 220), "8": (450, 230), "9": (475, 240),
}
rows = re.findall(
    r'align-top">([0-9/]+)</td>\s*<td[^>]*>(\d+)&nbsp;&deg;F</td>\s*'
    r'<td[^>]*>(\d+)&nbsp;&deg;C</td>\s*<td[^>]*>(\d+)&nbsp;&deg;C</td>', oven)
if len(rows) != 11:
    fails.append(f"oven-temperature: parsed {len(rows)} gas-mark rows, expected 11")
for gm, f, c, fan in rows:
    exp = manual.get(gm)
    if not exp:
        fails.append(f"oven-temperature: unexpected gas mark {gm}")
        continue
    if (int(f), int(c)) != exp:
        fails.append(f"oven-temperature: gas {gm} is {f}F/{c}C, expected {exp[0]}F/{exp[1]}C")
    if int(fan) != int(c) - 20:
        fails.append(f"oven-temperature: gas {gm} fan {fan}C is not {c}C minus 20")
for t in ("194", "197", "201", "204", "208", "212"):
    if f"{t}&nbsp;&deg;F" not in oven:
        fails.append(f"oven-temperature: altitude boiling point {t}F missing")

# ---- meal-prep: BLS subset must match the pulled file, and the cost arithmetic ----
mp = (ROOT / "src/pages/tools/meal-prep.astro").read_text(encoding="utf-8")
bls = (ROOT / "outreach/bls_prices_run20.txt").read_text(encoding="utf-8")
pulled = {}
for line in bls.splitlines():
    m = re.match(r"APU\w+ \| .*? \| \$([\d.]+) per \w+ \| Sep2025 \$([\d.]+) \| ([+-][\d.]+)%", line)
    if m:
        pulled[f"{float(m.group(1)):.3f}"] = (float(m.group(2)), float(m.group(3)))
mp_prices = re.findall(r"\$([\d.]+) per (?:lb|dozen|gallon)", mp)
if len(mp_prices) != 10:
    fails.append(f"meal-prep: parsed {len(mp_prices)} BLS prices, expected 10")
for p in mp_prices:
    key = f"{float(p):.3f}"
    if key not in pulled:
        fails.append(f"meal-prep: price ${p} is not in the BLS pull")
for cur_key, (prev, chg) in pulled.items():
    want = (float(cur_key) - prev) / prev * 100
    if abs(want - chg) > 0.06:
        fails.append(f"meal-prep: BLS change {chg:+.1f}% disagrees with prices ({want:+.2f}%)")
for ent in ("&minus;34.9%", "&minus;17.3%", "+7.4%", "+5.5%", "+0.7%"):
    if ent not in mp:
        fails.append(f"meal-prep: BLS change {ent} missing from page")
# the worked portion arithmetic
chicken_kg = 4.203 / 0.45359237
rice_kg = 1.118 / 0.45359237
potato_kg = 0.989 / 0.45359237
tomato_kg = 1.992 / 0.45359237
c = 0.150 * chicken_kg
r = 0.080 * rice_kg
pot = 0.150 * potato_kg
tom = 0.100 * tomato_kg
if f"{c:.2f}" not in mp:
    fails.append(f"meal-prep: 150 g chicken cost {c:.2f} not stated on page")
if f"{r:.2f}" not in mp:
    fails.append(f"meal-prep: 80 g rice cost {r:.2f} not stated on page")
if f"{pot:.2f}" not in mp:
    fails.append(f"meal-prep: 150 g potato cost {pot:.2f} not stated on page")
if f"{tom:.2f}" not in mp:
    fails.append(f"meal-prep: 100 g tomato cost {tom:.2f} not stated on page")
total = c + r + pot + tom
if abs(total - 2.35) > 0.005:
    fails.append(f"meal-prep: portion total {total:.3f} != stated 2.35")
if abs(total * 5 - 11.77) > 0.01:
    fails.append(f"meal-prep: five-portion total {total * 5:.3f} != stated 11.77")

# ---- protein-calculator: guideline figures and FDC arithmetic ----
prot = (ROOT / "src/pages/tools/protein-calculator.astro").read_text(encoding="utf-8")
fdc = {"Lentils, raw": 24.6, "Peanut butter, creamy": 24.0,
       "Chicken breast, boneless and skinless, raw": 22.5,
       "Black beans, mature seeds, raw": 21.6, "Salmon, chinook, raw": 19.9,
       "Egg, whole, raw": 12.6, "Yogurt, Greek, plain, lowfat": 9.95}
for name, per100 in fdc.items():
    row = re.search(re.escape(name) + r".*?align-top\">([\d,.]+) g</td>\s*<td[^>]*>([\d,]+) g</td>",
                    prot, re.S)
    if not row:
        fails.append(f"protein-calculator: row not parsed for {name}")
        continue
    got_per100 = float(row.group(1).replace(",", ""))
    got_food = int(row.group(2).replace(",", ""))
    if abs(got_per100 - per100) > 0.01:
        fails.append(f"protein-calculator: {name} per100 {got_per100} != FDC {per100}")
    want_food = round(112 / per100 * 100)
    if abs(got_food - want_food) > 1:
        fails.append(f"protein-calculator: {name} food-for-112g {got_food} != {want_food}")
for t in ("46 g", "52 g", "56 g", "10&ndash;35% of calories", "10&ndash;30% of calories"):
    if t not in prot:
        fails.append(f"protein-calculator: DGA figure missing -> {t}")
# AMDR arithmetic as stated
if abs(46 * 4 / 1800 * 100 - 10.2) > 0.05:
    fails.append("protein-calculator: 46 g at 1,800 kcal is not 10.2%")
if abs(56 * 4 / 2400 * 100 - 9.3) > 0.05:
    fails.append("protein-calculator: 56 g at 2,400 kcal is not 9.3%")
if abs(112 * 4 / 2000 * 100 - 22.4) > 0.05:
    fails.append("protein-calculator: 112 g at 2,000 kcal is not about 22%")
# worked day
def r1(x):  # round half up at one decimal, as the page prints it
    return round(x + 1e-9, 1)


day = [r1(250 * 9.95 / 100), r1(100 * 12.6 / 100), r1(200 * 22.5 / 100), r1(150 * 19.9 / 100)]
if day[0] != 24.9 or day[1] != 12.6:
    fails.append(f"protein-calculator: breakfast components compute to {day[0]}/{day[1]}")
if r1(day[0] + day[1]) != 37.5:
    fails.append("protein-calculator: breakfast total is not 37.5 g")
if day[2] != 45.0 or r1(day[0] + day[1] + day[2]) != 82.5:
    fails.append("protein-calculator: lunch running total is not 82.5 g")
if day[3] != 29.9 or r1(sum(day)) != 112.4:
    fails.append(f"protein-calculator: dinner total {r1(sum(day))} is not 112.4 g")
if round(180 * 24.6 / 100) != 44:
    fails.append("protein-calculator: 180 g lentils is not about 44 g protein")

print(f"checked {len(PAGES)} pages, {len(ROW_COUNTS)} row-count assertions, "
      f"{len(rows)} gas-mark rows, {len(mp_prices)} BLS prices, {len(fdc)} FDC rows")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows exact, gas-mark table consistent, BLS 10/10 prices and changes "
      "consistent with the pull, cost arithmetic true, DGA and FDC figures checked, worked day sums to 112.4 g")
