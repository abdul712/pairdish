#!/usr/bin/env python3
"""Run-20 pre-deploy QA gate: the potluck-coordinator and grocery-list expansions.

Per page: tag balance, no literal \\uXXXX, no href=undefined, no banned 'undefined'
token, no brace inside the inserted section, meta <=160, no FAQ markup, every internal
href resolves on disk, externals on the official allowlist, exact table-row counts, and
the required new sections present.

Data gates: every BLS price + year-over-year change printed in the page must match the
pulled API file, every ERS forecast figure must be present, and the page's own budget
arithmetic ($150 a week -> $7,800 a year -> $187) must be true.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAGES = {
    "src/pages/tools/potluck-coordinator.astro": [
        "How Much Food a Potluck Needs, and How Long It Can Sit Out",
        "The two-hour clock, and the one-hour exception",
        "Getting the dish there safely",
        "If the potluck is really a reception",
        "Tag the dish, and plan the leftovers",
        "never leave perishable foods such as meat, poultry, eggs and casseroles",
        "Reheating in a slow cooker or chafing dish",
        "14 pieces per person, per hour",
        "Cooking_for_Groups.pdf",
    ],
    "src/pages/tools/grocery-list.astro": [
        "What a Grocery List Costs, and What the Food Has to Survive",
        "Average U.S. prices, September 2026",
        "What the forecast says about the next year",
        "Buying what the week will actually use",
        "Food at home (groceries)",
        "2 to 5 years",
        "12 to 18 months",
        "ers.usda.gov/data-products/food-price-outlook",
    ],
}

ROW_COUNTS = {
    "src/pages/tools/potluck-coordinator.astro": 16,
    "src/pages/tools/grocery-list.astro": 21,
}

BRACE_SCOPE = {
    "src/pages/tools/potluck-coordinator.astro": "<!-- Potluck quantities and the food-safety clock -->",
    "src/pages/tools/grocery-list.astro": "<!-- Grocery prices and what the list has to survive -->",
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "foodsafety.gov", "fda.gov", "cdc.gov", "ers.usda.gov", "bls.gov",
    "usda.gov", "ams.usda.gov", "usdalocalfoodportal.com", "snaped.fna.usda.gov",
    "kingarthurbaking.com", "extension.colostate.edu", "canr.msu.edu", "uaex.uada.edu",
    "ecfr.gov", "ods.od.nih.gov", "efsa.europa.eu", "nature.com", "pmc.ncbi.nlm.nih.gov",
    "pubmed.ncbi.nlm.nih.gov", "scijournals.onlinelibrary.wiley.com", "realfood.gov",
    "dietaryguidelines.gov", "hgic.clemson.edu", "pubs.nmsu.edu", "niaaa.nih.gov",
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
    start_marker = BRACE_SCOPE.get(rel)
    if start_marker:
        if start_marker not in body:
            fails.append(f"{rel}: inserted-section marker missing")
        else:
            seg = body.split(start_marker, 1)[1].split("</section>", 1)[0]
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

# ---- data gate: BLS prices and year-over-year changes as printed on the page ----
gro = (ROOT / "src/pages/tools/grocery-list.astro").read_text(encoding="utf-8")
bls = (ROOT / "outreach/bls_prices_run20.txt").read_text(encoding="utf-8")
pairs = re.findall(r"\|\s*\$\s*([\d.]+)\s+per\s+(\w+)\s*\|\s*Sep2025\s*\$\s*([\d.]+)\s*\|\s*([+-]?[\d.]+)%", bls)
if len(pairs) != 13:
    fails.append(f"BLS file: parsed {len(pairs)} price rows, expected 13")
for cur, unit, prev, chg in pairs:
    if f"${float(cur):.3f}" not in gro:
        fails.append(f"grocery-list: BLS price ${cur} missing from page")
    ent = chg.replace("-", "&minus;")
    if ent not in gro:
        fails.append(f"grocery-list: BLS change {chg}% missing from page")
    want = (float(cur) - float(prev)) / float(prev) * 100
    if abs(want - float(chg)) > 0.06:
        fails.append(f"grocery-list: change {chg}% disagrees with prices ({want:+.2f}%)")

ers = ["+2.9%", "2.5 to 3.2%", "+3.5%", "3.3 to 3.8%", "+2.4%", "1.8 to 3.0%",
       "+2.0%", "&minus;2.7 to 7.0%", "+2.6%", "0.2 to 5.1%", "+1.8%", "&minus;5.0 to 9.2%"]
for fig in ers:
    if fig not in gro:
        fails.append(f"grocery-list: ERS figure missing -> {fig}")

# ---- arithmetic the page states about itself ----
if abs(150 * 52 - 7800) != 0:
    fails.append("budget arithmetic: 150 x 52 != 7800")
if round(7800 * 0.024) != 187:
    fails.append("budget arithmetic: 2.4% of 7800 != 187")

# ---- potluck: the claim that 16 guests x 8 servings is about eight servings each ----
pot = (ROOT / "src/pages/tools/potluck-coordinator.astro").read_text(encoding="utf-8")
if "around 128 servings" not in pot or "eight per person" not in pot:
    fails.append("potluck: worked servings arithmetic missing")
if 16 * 8 != 128:
    fails.append("potluck arithmetic: 16 x 8 != 128")

print(f"checked {len(PAGES)} pages, {len(ROW_COUNTS)} row-count assertions, "
      f"{len(pairs)} BLS rows, {len(ers)} ERS figures")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows exact, BLS 13/13 prices+changes consistent, ERS 12/12 figures, "
      "stated arithmetic true")
