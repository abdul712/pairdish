#!/usr/bin/env python3
"""Run-12 pre-deploy QA gate for the three edited tool pages (clone of run11_qa.py).

Per page: tag balance, no literal \\uXXXX escapes, no FAQ markup, no href="undefined",
every internal href resolves to a page file on disk or a public asset, every external href is
https on an allowed official host, and the new section's marker phrase is present.
"""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
PAGES = {
    "src/pages/tools/flavor-pairing.astro": [
        "How a Pairing Tool Decides What Works",
        "The shared-compound idea is a measured tendency, not a law",
        "A workflow that gets more out of the results",
        "What a pairing tool cannot see",
    ],
    "src/pages/tools/party-calculator.astro": [
        "How Much Food Per Guest, by Party Type",
        "Appetizer-only parties: count by the hour, not by the tray",
        "Worked example: 70 guests, 11 kinds of passed appetizers",
        "The two clocks that matter more than the totals",
    ],
    "src/pages/tools/herb-spice-matrix.astro": [
        "What Seasoning Goes With What Food",
        "Named blends worth keeping on hand",
        "Using the pairings without overshooting the dose",
    ],
}

ALLOWED_EXT_HOSTS = (
    "fsis.usda.gov", "food.unl.edu", "foodsafety.gov", "fda.gov", "cdc.gov",
    "kingarthurbaking.com", "ams.usda.gov", "usdalocalfoodportal.com",
    "snaped.fns.usda.gov", "ers.usda.gov", "bls.gov", "usda.gov", "extension.umn.edu",
    "nchfp.uga.edu", "myplate.gov", "dietaryguidelines.gov", "fdc.nal.usda.gov",
    "nature.com", "udel.edu", "blogs.extension.iastate.edu", "uaex.uada.edu",
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
