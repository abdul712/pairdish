#!/usr/bin/env python3
"""Run-21: sweep the tracker for listing flips and re-verify live ones.

Two passes:
  1. every `listed` row: fetch its recorded listing URL, assert 200 and 'pairdish' in the body.
  2. every `submitted` / `pending_review` row on a phpLD-family host: fetch
     /search.php?search=pairdish and look for a `listing/` href (a real listing, not a title hit).
     Rows already flagged as "proof unavailable" hosts are reported, not failed.

Read-only: prints a summary and never edits the tracker (the caller records flips).
"""
import csv
import pathlib
import re
import subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
NO_PROOF = ("highrankdirectory", "prolinkdirectory", "digabusiness", "athenelinks", "abicloud", "brestlinks")


def get(url):
    out = subprocess.run(["curl", "-4", "-s", "--compressed", "-L", "--max-time", "30", "-A", UA,
                          "-w", "\n@@%{http_code}", url], capture_output=True, text=True,
                         encoding="utf-8", errors="replace").stdout
    body, _, code = out.rpartition("\n@@")
    return code.strip(), body


rows = list(csv.DictReader(open(ROOT / "outreach/tracker.csv", encoding="utf-8", newline="")))
live, gone, flips, noproof, errors = [], [], [], [], []

print("=== 1. listed rows, re-verified ===")
for r in rows:
    if r.get("status") != "listed":
        continue
    url = (r.get("listing_url_or_proof") or "").strip().split()[0] if (r.get("listing_url_or_proof") or "").strip() else ""
    if not url.startswith("http"):
        url = (r.get("url") or "").strip()
    code, body = get(url)
    ok = code == "200" and "pairdish" in body.lower()
    (live if ok else gone).append((r["site_name"], code, url))
    print(f"  {r['site_name']:26s} {code:4s} pairdish_in_body={'pairdish' in body.lower()} {url[:64]}")

print("\n=== 2. phpLD name-search flip sweep ===")
for r in rows:
    if r.get("status") not in ("submitted", "pending_review"):
        continue
    host = (r.get("url") or "").strip().split("//")[-1].split("/")[0]
    if any(k in host for k in NO_PROOF):
        noproof.append(host)
        continue
    code, body = get(f"https://{host}/search.php?search=pairdish")
    if not body or len(body) < 500:
        noproof.append(host)
        print(f"  {host:34s} proof unavailable (status {code}, {len(body)}b)")
        continue
    hrefs = re.findall(r'href="([^"]*listing/[^"]+)"', body)
    if hrefs:
        flips.append((host, hrefs[0]))
        print(f"  {host:34s} FLIP candidate listing={hrefs[0][:70]}")
    else:
        print(f"  {host:34s} no listing href (status {code})")

print(f"\nlisted-live={len(live)} listed-gone={len(gone)} flips={len(flips)} "
      f"no-proof-hosts={len(set(noproof))}")
