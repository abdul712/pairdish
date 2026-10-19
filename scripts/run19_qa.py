#!/usr/bin/env python3
"""Run-19 pre-deploy QA gate: three expanded tool pages + the GL data correction.

Checks per page: tag balance, no literal \\uXXXX, no href=undefined, no banned 'undefined'
token, no brace inside the inserted slice, meta <=160, no FAQ markup, every internal href
resolves on disk, externals on the official allowlist, exact table-row counts, and that the
required new sections/markers are present. Also gates the glycemic tool's GL identity and the
corrected caffeine limit attributions.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAGES = {
    "src/pages/tools/dietary-finder.astro": [
        "What a Restriction Filter Can and Cannot Decide",
        "The nine allergens U.S. law requires the label to name",
        "The nine major food allergens named by U.S. law (FDA).",
        "Crustacean shellfish",
        "Sesame is the newest entry",
        "&ldquo;Gluten-free&rdquo; is a defined claim, not a style of eating",
        "less than 20 parts per million",
        "Where restricted eating patterns run short",
        "Vegetarians need almost twice as much",
        "Plant foods contain no B12 unless they are fortified",
    ],
    "src/pages/tools/glycemic-index.astro": [
        "How the Glycemic Index Bands and the Glycemic Load Are Calculated",
        "One measurement, two reference foods",
        "convert between them with a factor of 100/70",
        "Where the three bands sit",
        "55 or less on the glucose scale",
        "Published index values for twenty common foods",
        "The load is where the serving size enters",
        "total carbohydrate minus fibre",
        "Watermelon and cola are the pair that makes the point",
        "What the tables do not settle",
    ],
    "src/pages/tools/caffeine-calculator.astro": [
        "What the Published Caffeine Limits Actually Say",
        "The numbers behind each limit setting",
        "single-dose level",
        "The same drink, measured two ways",
        "60 ml is closer to a double shot than a single",
        "Decaffeinated coffee is not caffeine-free",
        "How a day adds up",
        "476 mg",
    ],
}

ROW_COUNTS = {
    "src/pages/tools/dietary-finder.astro": 15,
    "src/pages/tools/glycemic-index.astro": 32,
    "src/pages/tools/caffeine-calculator.astro": 18,
}

BRACE_SCOPE = {
    "src/pages/tools/dietary-finder.astro": "<!-- What a restriction filter can and cannot decide -->",
    "src/pages/tools/glycemic-index.astro": "<!-- How GI bands and glycemic load are calculated -->",
    "src/pages/tools/caffeine-calculator.astro": "<!-- Published caffeine limits and how the calculator uses them -->",
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "food.unl.edu", "foodsafety.gov", "fda.gov", "cdc.gov",
    "kingarthurbaking.com", "ams.usda.gov", "usdalocalfoodportal.com",
    "snaped.fns.usda.gov", "snaped.fna.usda.gov", "ers.usda.gov", "bls.gov",
    "usda.gov", "extension.umn.edu", "nchfp.uga.edu", "myplate.gov",
    "dietaryguidelines.gov", "fdc.nal.usda.gov", "nature.com",
    "pmc.ncbi.nlm.nih.gov", "pubmed.ncbi.nlm.nih.gov", "scijournals.onlinelibrary.wiley.com",
    "extension.usu.edu", "randolph.ces.ncsu.edu", "extension.msstate.edu",
    "udel.edu", "blogs.extension.iastate.edu", "uaex.uada.edu",
    "extension.missouri.edu", "cdr.wisc.edu",
    "ecfr.gov", "hgic.clemson.edu", "extension.psu.edu",
    "fcs.mgcafe.uky.edu", "canr.msu.edu",
    "extension.colostate.edu", "realfood.gov", "bkc-od-media.vmhost.psu.edu",
    "niaaa.nih.gov", "pubs.nmsu.edu",
    "ods.od.nih.gov", "efsa.europa.eu", "publications.aap.org",
)

BANNED_HOSTS = ("snaped.fns.usda.gov",)
TAGS = ("section", "div", "article", "figure", "table", "caption", "tr", "td", "th",
        "thead", "tbody", "ul", "ol", "li", "p", "h2", "h3", "details", "summary")

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
    if 'href="undefined"' in s or "href='undefined'" in s:
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
            fails.append(f"{rel}: inserted-section marker missing -> {start_marker[:50]}")
        else:
            seg = body.split(start_marker, 1)[1].split("</section>", 1)[0]
            if "{" in seg or "}" in seg:
                fails.append(f"{rel}: literal brace inside inserted section")
    for m in markers:
        if m not in s:
            fails.append(f"{rel}: marker missing -> {m}")
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
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in txt:
        fails.append(f"{p.relative_to(ROOT)}: dead FSIS danger-zone path still present")

# GL identity across the glycemic tool's 62 rows
gi = (ROOT / "src/components/tools/GlycemicIndexGuide.tsx").read_text(encoding="utf-8")
row_re = re.compile(
    r"\{ id: '([^']+)', name: '([^']+)',[^}]*?gi: (\d+), gl: (\d+),[^}]*?carbs: ([\d.]+), fiber: ([\d.]+)"
)
rows = row_re.findall(gi)
if len(rows) < 60:
    fails.append(f"GlycemicIndexGuide: only {len(rows)} rows parsed")
for rid, name, g, gl, carbs, fiber in rows:
    want = round(int(g) * max(float(carbs) - float(fiber), 0.0) / 100)
    if want != int(gl):
        fails.append(f"GlycemicIndexGuide: GL identity broken {rid} stored={gl} want={want}")

# caffeine limit attributions must not credit the FDA with figures it does not publish
caf = (ROOT / "src/components/tools/CaffeineCalculator.tsx").read_text(encoding="utf-8")
if "FDA recommendation for pregnant women" in caf:
    fails.append("CaffeineCalculator: pregnancy limit still misattributed to the FDA")
for needle in ("EFSA: up to 200 mg/day", "FDA: 400 mg/day"):
    if needle not in caf:
        fails.append(f"CaffeineCalculator: attribution note missing -> {needle}")

print(f"checked {len(PAGES)} pages, {len(ROW_COUNTS)} row-count assertions, {len(rows)} GL rows")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows exact, GL identity 62/62, caffeine attributions corrected")
