#!/usr/bin/env python3
"""Screen fresh directory candidates for pairdish (run 8 family research).

For each candidate host: fetch /(submit-url variants) with a desktop UA and classify:
  FORM_OK      -> a <form> with >=2 named non-search fields (a real submission form)
  PHPld        -> page carries IMAGEHASH/CAPTCHA (phpLD family flow, scriptable)
  PAID         -> page mentions price/checkout/plan amounts near submit copy
  BADGE        -> free tier gated on backlink/badge embed on our site
  LOGIN        -> login/auth-walled submit
  WALL         -> 403/CF challenge from this IP
  DEAD/NONE    -> no reachable form

Usage: python3 scripts/screen_dir_candidates.py [candidates.txt]
Reads outreach/dir_candidates_run8.txt by default; skips domains already in tracker.csv.
"""
import json
import pathlib
import re
import sys
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124 Safari/537.36")

PRICE_RE = re.compile(r"(?:\$\s?\d{1,4}(?:\.\d{2})?|USD\s?\d|\d{1,3}\s?(?:EUR|€)|checkout|stripe|paypal)", re.I)
BADGE_RE = re.compile(r"(?:badge|backlink is required|link back to|reciprocal link|embed (?:our|the) (?:badge|code))", re.I)
LOGIN_RE = re.compile(r"(?:log ?in to submit|sign ?in to submit|continue with google|register to submit)", re.I)
CHALLENGE_RE = re.compile(r"(?:Just a moment|cf-challenge|Checking your browser|Attention Required)", re.I)
FORM_RE = re.compile(r"<form[^>]*>(.*?)</form>", re.I | re.S)
FIELD_RE = re.compile(r"<(?:input|textarea|select)[^>]*name=\"([^\"]+)\"[^>]*>", re.I)
SEARCHY = re.compile(r"search|query|s\b|q\b", re.I)


def tracked_domains():
    rows = (ROOT / "outreach" / "tracker.csv").read_text().splitlines()
    out = set()
    for line in rows[1:]:
        parts = line.split(",")
        if len(parts) > 1 and "//" in parts[1]:
            out.add(re.sub(r"^www\.", "", parts[1].split("//")[1].split("/")[0].lower()))
    return out


def fetch(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA,
                                              "Accept": "text/html,application/xhtml+xml,*/*",
                                              "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.status, r.geturl(), r.read().decode("utf-8", "replace")


def screen(url):
    variants = [url.rstrip("/") + p for p in ("", "/submit.php", "/submit", "/add-url")]
    best = None
    for v in variants:
        try:
            status, final, html = fetch(v)
        except urllib.error.HTTPError as e:
            if e.code in (403, 429) and best is None:
                best = ("WALL", v, f"HTTP {e.code}")
            continue
        except Exception as e:
            continue
        if CHALLENGE_RE.search(html[:4000]):
            best = best or ("WALL", v, "cf challenge")
            continue
        forms = FORM_RE.findall(html)
        named = []
        for f in forms:
            names = [n for n in FIELD_RE.findall(f) if not SEARCHY.search(n)]
            if len(names) >= 2:
                named = names
                break
        if not named and "IMAGEHASH" not in html:
            continue
        kind = "FORM_OK"
        note = "fields=" + ",".join(named[:8]) if named else "IMAGEHASH"
        if "IMAGEHASH" in html:
            kind = "FORM_OK(phpLD)"
        if LOGIN_RE.search(html):
            note += " | LOGIN-word"
        if BADGE_RE.search(html):
            note += " | BADGE-word"
        if PRICE_RE.search(html):
            note += " | PRICE-word"
        # score: prefer pages with a real form and no gate words
        score = (2 if named else 1) + (1 if "IMAGEHASH" in html else 0) \
                - (1 if PRICE_RE.search(html) else 0) - (1 if BADGE_RE.search(html) else 0) \
                - (1 if LOGIN_RE.search(html) else 0)
        cand = (kind, v, note, score)
        if best is None or best[0] == "WALL" or score >= best[3]:
            best = cand
    return best or ("NONE", url, "no reachable form", -9)


def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "outreach" / "dir_candidates_run8.txt"
    urls = [l.strip() for l in src.read_text().splitlines() if l.strip() and not l.startswith("#")]
    skip = tracked_domains()
    todo = []
    for u in urls:
        dom = re.sub(r"^www\.", "", u.split("//")[-1].split("/")[0].lower())
        if dom in skip:
            print(f"SKIP(tracked) {dom}")
            continue
        todo.append(u)
    print(f"candidates={len(urls)} untracked={len(todo)}\n")
    results = []
    with ThreadPoolExecutor(max_workers=6) as ex:
        for u, r in zip(todo, ex.map(screen, todo)):
            results.append((u, r))
            print(f"{r[0]:14s} score={r[3]:+d}  {u}\n    via {r[1]}\n    {r[2][:160]}")
    json.dump([{"url": u, "kind": r[0], "via": r[1], "note": r[2], "score": r[3]} for u, r in results],
              open(ROOT / "outreach" / "dir_screen_run8.json", "w"), indent=2)


if __name__ == "__main__":
    main()
