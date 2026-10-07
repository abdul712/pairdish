#!/usr/bin/env python3
"""Run-14 pre-deploy QA gate for the three edited tool pages (clone of run13_qa.py)."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "src/pages/tools/flavor-pairing.astro": [
        "Deciding What to Serve With a Main Dish",
        "The four jobs a side dish can do",
        "Why acid beats sugar when a plate feels heavy",
        "A worked example: a rich sandwich main",
    ],
    "src/pages/tools/seasonal-guide.astro": [
        "Fresh, Frozen, or Canned: Comparing the Same Ingredient",
        "What the research actually shows",
        "How to use this when you shop",
    ],
    "src/pages/tools/substitution-finder.astro": [
        "Substituting Flour and Sugar by Weight, Not by Cup",
        "The gram weights to work from",
        "The substitutions that come up most, worked out",
        "What the tool does with your numbers",
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

# dead-citation guard: the retired SNAP-Ed host must be gone from the whole page tree
for p in (ROOT / "src").rglob("*.astro"):
    if "snaped.fns.usda.gov" in p.read_text(encoding="utf-8"):
        fails.append(f"{p.relative_to(ROOT)}: retired snaped.fns.usda.gov citation still present")

print(f"checked {len(PAGES)} pages")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined, all internal links resolve, externals official")
