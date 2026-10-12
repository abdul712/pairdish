#!/usr/bin/env python3
"""Run-16 pre-deploy QA gate for the three edited tool pages (clone of run15_qa.py,
extended allowlist for the run-16 official sources: CSU / USU / Penn State media host /
USDA FNS dietary-guidelines page)."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "src/pages/tools/macro-calculator.astro": [
        "The Macro Balancing Math Behind the Percentages",
        "Calorie factors used for U.S. nutrition labelling",
        "Four common splits converted to grams at 2,000 calories",
        "Why the totals never land exactly",
        "Two official anchors to check a plan against",
    ],
    "src/pages/tools/sugar-substitution.astro": [
        "Converting Liquid Sweeteners Without Breaking the Recipe",
        "Sweetener-to-sugar conversions",
        "Calories per gram and suitability for home canning",
        "One safety rule that overrides taste",
    ],
    "src/pages/tools/herb-spice-matrix.astro": [
        "Mapping Herbs and Spices by Taste, Not by Food",
        "Taste descriptor and partners for sixteen seasonings",
        "Building a blend you do not have",
        "Keeping the flavour once you have the blend",
    ],
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "food.unl.edu", "foodsafety.gov", "fda.gov", "cdc.gov",
    "kingarthurbaking.com", "ams.usda.gov", "usdalocalfoodportal.com",
    "snaped.fns.usda.gov", "snaped.fna.usda.gov", "ers.usda.gov", "bls.gov",
    "usda.gov", "extension.umn.edu", "nchfp.uga.edu", "myplate.gov",
    "dietaryguidelines.gov", "fdc.nal.usda.gov", "nature.com",
    "pmc.ncbi.nlm.nih.gov", "scijournals.onlinelibrary.wiley.com",
    "extension.usu.edu", "randolph.ces.ncsu.edu", "extension.msstate.edu",
    "udel.edu", "blogs.extension.iastate.edu", "uaex.uada.edu",
    "extension.missouri.edu", "cdr.wisc.edu",
    # run-15 additions
    "ecfr.gov", "hgic.clemson.edu", "extension.psu.edu",
    "fcs.mgcafe.uky.edu", "canr.msu.edu",
    # run-16 additions
    "extension.colostate.edu", "realfood.gov", "bkc-od-media.vmhost.psu.edu",
)

fails = []

BRACE_SCOPE = {
    "src/pages/tools/macro-calculator.astro": ["<!-- Macro balancing: calorie factors + percentage-to-grams math -->"],
    "src/pages/tools/sugar-substitution.astro": ["<!-- Liquid sweetener conversions + high-intensity sweeteners -->"],
    "src/pages/tools/herb-spice-matrix.astro": ["<!-- Flavour-family mapping + build-your-own blend substitutions -->"],
}

# markers that must NOT appear as rendered headings, and external hosts that must NOT appear
BANNED_PHRASES = ("Frequently Asked Questions",)
BANNED_HOSTS = ("snaped.fns.usda.gov",)


def pages_on_disk():
    out = set()
    for p in (ROOT / "src/pages").rglob("*.astro"):
        rel = p.relative_to(ROOT / "src/pages").as_posix()
        slug = rel[:-len(".astro")]
        slug = slug[:-len("/index")] if slug.endswith("/index") else slug
        if slug == "index":
            slug = ""
        out.add("/" + slug)
    for p in (ROOT / "public").rglob("*"):
        if p.is_file():
            out.add("/" + p.relative_to(ROOT / "public").as_posix())
    return out


DISK = pages_on_disk()
TAGS = ("section", "div", "article", "figure", "table", "caption", "tr", "td", "th",
        "ul", "ol", "li", "p", "a", "tbody", "thead", "em", "strong")

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
    # meta description length (frontmatter prop + JSON-LD copy both use description=)
    for m in re.finditer(r'description="([^"]*)"', s):
        if len(m.group(1)) > 160:
            fails.append(f"{rel}: description over 160 chars ({len(m.group(1))}) -> {m.group(1)[:60]}...")
    # brace safety inside only the inserted section
    for start_marker in BRACE_SCOPE.get(rel, []):
        if start_marker in body:
            seg = body.split(start_marker, 1)[1].split("</section>", 1)[0]
            if "{" in seg or "}" in seg:
                fails.append(f"{rel}: literal brace inside inserted section after {start_marker!r}")
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
        elif href.startswith("#"):
            pass
        else:
            fails.append(f"{rel}: unexpected href scheme -> {href}")

# expected table row counts for the new blocks (guards against a partial insert)
ROW_COUNTS = {
    "src/pages/tools/macro-calculator.astro": 11,   # 6 (calorie factors) + 5 (worked splits)
    "src/pages/tools/sugar-substitution.astro": 14,  # 6 (conversions) + 8 (calories/canning)
    "src/pages/tools/herb-spice-matrix.astro": 42,   # 19 existing + 17 (taste families) + 6 (blends)
}
for rel, want in ROW_COUNTS.items():
    s = (ROOT / rel).read_text(encoding="utf-8")
    got = len(re.findall(r"<tr[\s>]", s))
    if got != want:
        fails.append(f"{rel}: table rows {got} != expected {want}")

# dead-citation guards: retired hosts / the mis-pathed FSIS danger-zone URL must be gone
for p in (ROOT / "src").rglob("*.astro"):
    txt = p.read_text(encoding="utf-8")
    for bad in BANNED_HOSTS:
        if bad in txt:
            fails.append(f"{p.relative_to(ROOT)}: retired {bad} citation still present")
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in txt:
        fails.append(f"{p.relative_to(ROOT)}: dead FSIS danger-zone path (missing /food-safety/) still present")

print(f"checked {len(PAGES)} pages")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows present, no dead citations")
