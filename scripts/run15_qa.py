#!/usr/bin/env python3
"""Run-15 pre-deploy QA gate for the three edited tool pages (clone of run14_qa.py)."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "src/pages/tools/chocolate-pairing.astro": [
        "What the Cocoa Percentage Really Tells You",
        "Pairing by chocolate type",
        "Chocolate, coffee and the after-dinner question",
        "Storing chocolate so the pairing still tastes right",
    ],
    "src/pages/tools/cheese-board-calculator.astro": [
        "How Much Cheese and Charcuterie Per Person",
        "How many varieties, and how much of each",
        "Keeping the board safe past the first hour",
    ],
    "src/pages/tools/buffet-planner.astro": [
        "Building a Buffet Menu: A Worked Six-Category Example",
        "Turning the template into numbers",
        "Keeping a four-protein line safe",
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
)

fails = []

BRACE_SCOPE = {
    "src/pages/tools/chocolate-pairing.astro": ["<!-- Cocoa percentage + pairing by type -->"],
    "src/pages/tools/cheese-board-calculator.astro": ["<!-- Per-person quantities + varieties + holding -->"],
    "src/pages/tools/buffet-planner.astro": ["<!-- Worked multi-protein buffet menu -->"],
}


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
    for tag in ("section", "div", "article", "figure", "table", "tr", "td", "th", "ul", "ol", "li", "p", "a", "tbody", "thead"):
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
    # brace safety: a literal { } inside the newly inserted section breaks the Astro build.
    # Scan only the inserted block (frontmatter / JSON-LD / <style> legitimately contain braces).
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

# dead-citation guards: retired hosts / the mis-pathed FSIS danger-zone URL must be gone
for p in (ROOT / "src").rglob("*.astro"):
    txt = p.read_text(encoding="utf-8")
    if "snaped.fns.usda.gov" in txt:
        fails.append(f"{p.relative_to(ROOT)}: retired snaped.fns.usda.gov citation still present")
    if "fsis.usda.gov/food-safe-handling-and-preparation/" in txt:
        fails.append(f"{p.relative_to(ROOT)}: dead FSIS danger-zone path (missing /food-safety/) still present")

print(f"checked {len(PAGES)} pages")
if fails:
    print("FAIL:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("PASS: tag balance, no escapes/FAQ/undefined/braces, internal links resolve, externals official, no dead citations")
