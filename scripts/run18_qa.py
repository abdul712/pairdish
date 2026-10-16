#!/usr/bin/env python3
"""Run-18 pre-deploy QA gate: three expanded tool pages + the restructured /contact page.

Cloned from run17_qa.py. New this run:
  * /contact is gated for the standing no-FAQ rule (it shipped a visible FAQ section until now)
    and for preserved answer sentences, so the restructure cannot silently delete content;
  * table-row counts asserted for the three new tables;
  * the allowlist is unchanged from run 17.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

PAGES = {
    "src/pages/tools/cooking-time.astro": [
        "Safe Minimum Internal Temperatures: the Numbers Behind the Timer",
        "Safe minimum internal temperatures",
        "All poultry",
        "How long food can wait once it is cooked",
        "Holding and resting limits",
        "Never more than 2 hours",
    ],
    "src/pages/tools/unit-converter.astro": [
        "How a Cup Is Actually Defined",
        "Household measures as defined for U.S. nutrition labelling",
        "What one cup actually weighs",
        "Published one-cup weights",
        "Sugar (granulated white)",
        "Cornmeal, whole",
    ],
    "src/pages/tools/sourdough-calculator.astro": [
        "Feeding Ratios, Ripening Checks and Dough Temperature",
        "Starter feeding and storage",
        "Dough temperature, and what it does to proofing time",
        "Where the starter goes in the hydration arithmetic",
        "One dough, three targets",
        "65% ",
    ],
    "src/pages/contact.astro": [
        "Working With PairDish",
        "Every tool on the site is free to use",
        "Tool suggestions are welcome",
        "Where the pairing suggestions come from",
        "API access for developers",
    ],
}

# answer sentences that must survive the FAQ restructure verbatim
CONTACT_ANSWERS = [
    "Yes! All of our culinary tools are completely free to use. No account required, no hidden fees.",
    "Absolutely! We love hearing ideas from our users.",
    "Our pairing suggestions are based on food science research",
    "Not currently, but it's something we're considering.",
]

ROW_COUNTS = {
    "src/pages/tools/cooking-time.astro": 17,
    "src/pages/tools/unit-converter.astro": 23,
    "src/pages/tools/sourdough-calculator.astro": 13,
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
    "niaaa.nih.gov", "pubs.nmsu.edu",
)

BANNED_HOSTS = ("snaped.fns.usda.gov",)
TAGS = ("section", "div", "article", "figure", "table", "caption", "tr", "td", "th",
        "thead", "tbody", "ul", "ol", "li", "p", "h2", "h3", "details", "summary")

# the brace / 'undefined' checks apply to the SLICE this run inserted (a whole-page scan trips on
# legitimate Astro props such as keywords={[...]} in the layout call)
BRACE_SCOPE = {
    "src/pages/tools/cooking-time.astro": "<!-- FSIS safe minimum internal temperatures + the holding clock -->",
    "src/pages/tools/unit-converter.astro": "<!-- Legal U.S. cooking measures + one-cup weights -->",
    "src/pages/tools/sourdough-calculator.astro": "<!-- Starter ratios, ripening checks and dough temperature -->",
}

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

contact = (ROOT / "src/pages/contact.astro").read_text(encoding="utf-8")
for answer in CONTACT_ANSWERS:
    if answer not in contact:
        fails.append(f"src/pages/contact.astro: answer sentence lost -> {answer[:50]}")

for p in (ROOT / "src").rglob("*.astro"):
    txt = p.read_text(encoding="utf-8")
    for bad in BANNED_HOSTS:
        if bad in txt:
            fails.append(f"{p.relative_to(ROOT)}: retired {bad} citation still present")
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in txt:
        fails.append(f"{p.relative_to(ROOT)}: dead FSIS danger-zone path still present")

print(f"checked {len(PAGES)} pages + {len(ROW_COUNTS)} row-count assertions")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, metas <=160, internal links resolve, "
      "externals official, table rows exact, contact answers preserved")
