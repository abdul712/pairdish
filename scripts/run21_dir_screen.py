#!/usr/bin/env python3
"""Run-21 directory screen: probe candidate hosts for a server-rendered phpLD submit form
with a FREE tier. Prints host | path | status | LINK_TYPE values | free-label hit."""
import csv, pathlib, re, subprocess
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"

CANDIDATES = """onemilliondirectory.com synergy-directory.com triplewdirectory.com polypat.org
info-listings.com onlinesociety.org kiwidir.com blackabsolute.com rdirectory.net nexusdirectory.com
sitelistings.net priordirectory.com obln.org linkpedia.net snapcc.org directory8.org directory6.org
1websdirectory.com theseoking.com illumirate.com amray.com backpagedir.com afunnydir.com
interesting-dir.com w3catalog.com abstractdirectory.net addirectory.org elitesitesdirectory.com
nonar.com comeonaussie.com txtlinks.com seooptimizationdirectory.com relevantdirectory.biz
relevantdirectories.com internet-web-directory.com rapidenetwork.eu ecctrade.com efdir.com
jet-links.com eslovar.com mioola.com cotid.org octopedia.com azlisted.com harddirectory.net
royaldirectory.biz pr8directory.com steeldirectory.net relateddirectory.org somuch.com
ntdirectory.com topsiteswebdirectory.com noanxiety.com edinburghdirectory.info""".split()

tracked = set()
for r in csv.DictReader(open(ROOT / "outreach/tracker.csv", encoding="utf-8", newline="")):
    d = re.sub(r"^https?://(www\.)?", "", (r.get("url") or "").strip().lower()).split("/")[0]
    tracked.add(d)

todo = [h for h in CANDIDATES if h not in tracked and ("www." + h) not in tracked]
print(f"candidates={len(CANDIDATES)} untracked={len(todo)}")


def probe(host):
    for path in ("/submit.php", "/submit"):
        url = "https://" + host + path
        out = subprocess.run(["curl", "-4", "-s", "-L", "--compressed", "--max-time", "20", "-A", UA,
                              "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                             encoding="utf-8", errors="replace").stdout
        body, _, code = out.rpartition("\n@@")
        code = code.strip()
        if code == "200" and ("LINK_TYPE" in body or "IMAGEHASH" in body or "CATEGORY_ID" in body):
            radios = re.findall(r'name="LINK_TYPE"[^>]*value="([^"]+)"', body)
            free = bool(re.search(r"(?i)free", body))
            return f"{host:32s} {path:12s} {code} radios={radios[:8]} freeword={free} len={len(body)}"
        if code not in ("404", "000", "403"):
            last = f"{host:32s} {path:12s} {code} len={len(body)} (no phpLD fields)"
    return None


with ThreadPoolExecutor(max_workers=10) as ex:
    for line in ex.map(probe, todo):
        if line:
            print(line)
