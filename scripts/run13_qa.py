#!/usr/bin/env python3
"""Run-13 pre-deploy QA gate for the three edited tool pages (clone of run12_qa.py)."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "src/pages/tools/coffee-pairing.astro": [
        "Matching Coffee With Dessert, by Roast and by Dessert",
        "Sweetness, bitterness, and the 31-to-1 rule",
        "Pairing by dessert, not by coffee",
        "How much coffee is on the table",
    ],
    "src/pages/tools/cheese-pairing.astro": [
        "Cheese Pairing by Family, and What to Do With the Leftovers",
        "Why cheese and wine work at all",
        "Which cheeses need the fridge",
    ],
    "src/pages/tools/nutrition-calculator.astro": [
        "Raw or Cooked? Why a Calculated Number Often Looks Too High",
        "A three-step check when the total looks wrong",
        "The per-gram rule, and where rounding creeps in",
    ],
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "food.unl.edu", "foodsafety.gov", "fda.gov", "cdc.gov",
    "kingarthurbaking.com", "ams.usda.gov", "usdalocalfoodportal.com",
    "snaped.fns.usda.gov", "ers.usda.gov", "bls.gov", "usda.gov", "extension.umn.edu",
    "nchfp.uga.edu", "myplate.gov", "dietaryguidelines.gov", "fdc.nal.usda.gov",
    "nature.com", "udel.edu", "blogs.extension.iastate.edu", "uaex.uada.edu",
    "extension.missouri.edu", "cdr.wisc.edu", "pmc.ncbi.nlm.nih.gov",
)

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
    for tag in ("section", "div", "article", "figure", "table", "tr", "td", "th", "ul", "ol", "li", "p", "a"):
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

print(f"checked {len(PAGES)} pages")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined, all internal links resolve, externals official")
