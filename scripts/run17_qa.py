#!/usr/bin/env python3
"""Run-17 pre-deploy QA gate: three expanded tool pages + three legacy-URL 301 pages.

Cloned from run16_qa.py. New this run:
  * allowlist extended for the run-17 official sources (niaaa.nih.gov, pubs.nmsu.edu);
  * the redirect pages are asserted to carry Astro.redirect(<target>, 301) and their target
    must resolve to a page on disk;
  * banned-token check for the literal word 'undefined' in the inserted prose.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAGES = {
    "src/pages/tools/drink-calculator.astro": [
        "What Counts as One Drink",
        "One U.S. standard drink, by beverage",
        "Standard drinks in the containers people actually buy",
        "Non-alcoholic drinks need their own count",
        "Beverage planning, as a percentage of attendance",
    ],
    "src/pages/tools/appetizer-planner.astro": [
        "What the Extension Services Actually Recommend",
        "Per-person appetizer benchmarks published by extension services",
        "The four-hour rule worked for three party sizes",
        "Holding limits once the table is set",
        "Holding and safety limits for a buffet or appetizer table",
    ],
    "src/pages/tools/yeast-converter.astro": [
        "Converting Between Fresh, Active Dry and Instant Yeast",
        "Published conversion rules",
        "Worked conversions",
        "Reading the packet instead of the scale",
        "What a conversion does not fix",
    ],
}

REDIRECT_PAGES = {
    "src/pages/what-to-serve-with-fried-fish.astro": "/articles/what-to-serve-with-fried-fish",
    "src/pages/what-to-serve-with-roasted-potatoes.astro": "/articles/what-to-serve-with-roasted-potatoes",
    "src/pages/what-to-serve-with-pesto-chicken.astro": "/articles/what-to-serve-with-pesto-chicken",
}

BRACE_SCOPE = {
    "src/pages/tools/drink-calculator.astro": ["<!-- Standard-drink math + non-alcoholic beverage planning -->"],
    "src/pages/tools/appetizer-planner.astro": ["<!-- Extension benchmarks for quantities + buffet holding limits -->"],
    "src/pages/tools/yeast-converter.astro": ["<!-- Published conversion multipliers + packet-based substitutions -->"],
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
    "ecfr.gov", "hgic.clemson.edu", "extension.psu.edu",
    "fcs.mgcafe.uky.edu", "canr.msu.edu",
    "extension.colostate.edu", "realfood.gov", "bkc-od-media.vmhost.psu.edu",
    # run-17 additions
    "niaaa.nih.gov", "pubs.nmsu.edu",
)

BANNED_HOSTS = ("snaped.fns.usda.gov",)
TAGS = ("section", "div", "article", "figure", "table", "caption", "tr", "td", "th",
        "ul", "ol", "li", "p", "a", "tbody", "thead", "em", "strong")

ROW_COUNTS = {
    "src/pages/tools/drink-calculator.astro": 18,     # 5 + 8 + 5
    "src/pages/tools/appetizer-planner.astro": 15,    # 6 + 4 + 5
    "src/pages/tools/yeast-converter.astro": 8,       # 3 + 5
}

fails = []


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
    for start_marker in BRACE_SCOPE.get(rel, []):
        if start_marker in body:
            seg = body.split(start_marker, 1)[1].split("</section>", 1)[0]
            if "{" in seg or "}" in seg:
                fails.append(f"{rel}: literal brace inside inserted section")
            if re.search(r"\bundefined\b", seg):
                fails.append(f"{rel}: banned token 'undefined' in inserted prose")
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

for rel, target in REDIRECT_PAGES.items():
    p = ROOT / rel
    if not p.exists():
        fails.append(f"{rel}: redirect page missing")
        continue
    s = p.read_text(encoding="utf-8")
    if f"Astro.redirect('{target}', 301)" not in s:
        fails.append(f"{rel}: no Astro.redirect('{target}', 301)")
    if target not in DISK:
        fails.append(f"{rel}: redirect target not on disk -> {target}")

for p in (ROOT / "src").rglob("*.astro"):
    txt = p.read_text(encoding="utf-8")
    for bad in BANNED_HOSTS:
        if bad in txt:
            fails.append(f"{p.relative_to(ROOT)}: retired {bad} citation still present")
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in txt:
        fails.append(f"{p.relative_to(ROOT)}: dead FSIS danger-zone path still present")

print(f"checked {len(PAGES)} expanded pages + {len(REDIRECT_PAGES)} redirect pages")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows exact, redirects present and targets on disk, no dead citations")
