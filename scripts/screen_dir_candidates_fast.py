#!/usr/bin/env python3
"""Fast directory-candidate screener (curl-based, per-request wall clock, incremental output).

The urllib version stalls on slow/hanging hosts; this one shells out to curl with an
8s --max-time per request and appends each host's verdict to a JSONL file as it
finishes, so a killed run still leaves results.

Usage: python3 scripts/screen_dir_candidates_fast.py <candidates.txt>
"""
import json
import pathlib
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = pathlib.Path(__file__).resolve().parent.parent
UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
      "Chrome/124 Safari/537.36")
OUT = ROOT / "outreach" / "dir_screen_run8.jsonl"

PRICE_RE = re.compile(r"(?:\$\s?\d{1,4}(?:\.\d{2})?|USD\s?\d|checkout|stripe|paypal)", re.I)
BADGE_RE = re.compile(r"(?:badge|backlink is required|link back to|reciprocal link)", re.I)
LOGIN_RE = re.compile(r"(?:log ?in to submit|sign ?in to submit|continue with google|register to submit)", re.I)
CHALLENGE_RE = re.compile(r"(?:Just a moment|cf-challenge|Checking your browser|Attention Required|Enable JavaScript and cookies)", re.I)
FORM_RE = re.compile(r"<form[^>]*>(.*?)</form>", re.I | re.S)
FIELD_RE = re.compile(r"<(?:input|textarea|select)[^>]*name=\"([^\"]+)\"[^>]*>", re.I)
SEARCHY = re.compile(r"^s$|search|query|^q$", re.I)


def curl(url, timeout=8):
    r = subprocess.run(["curl", "-s", "-L", "--compressed", "--max-time", str(timeout),
                        "-A", UA, "-w", "\n==HTTP:%{http_code}", url],
                       capture_output=True, text=True)
    body = r.stdout
    code = ""
    if "\n==HTTP:" in body:
        body, code = body.rsplit("\n==HTTP:", 1)
    return code.strip(), body


def screen(url):
    best = None
    for p in ("", "/submit.php", "/submit", "/add-url", "/add.html"):
        v = url.rstrip("/") + p
        code, html = curl(v)
        if CHALLENGE_RE.search(html[:3000]):
            best = best or {"kind": "WALL", "via": v, "note": "cf/js challenge", "score": -9}
            continue
        if code in ("000", "403", "404", "500", "502", "503"):
            continue
        named = []
        for f in FORM_RE.findall(html):
            names = [n for n in FIELD_RE.findall(f) if n and not SEARCHY.search(n)]
            if len(names) >= 2:
                named = names
                break
        if not named and "IMAGEHASH" not in html:
            continue
        notes = []
        score = 1 + (1 if named else 0) + (1 if "IMAGEHASH" in html else 0)
        kind = "FORM_OK" + ("(phpLD)" if "IMAGEHASH" in html else "")
        if named:
            notes.append("fields=" + ",".join(named[:8]))
        if LOGIN_RE.search(html):
            notes.append("LOGIN-word"); score -= 1
        if BADGE_RE.search(html):
            notes.append("BADGE-word"); score -= 1
        if PRICE_RE.search(html):
            notes.append("PRICE-word"); score -= 1
        cand = {"kind": kind, "via": v, "note": " | ".join(notes)[:200], "score": score}
        if best is None or best["kind"] == "WALL" or score >= best["score"]:
            best = cand
    return best or {"kind": "NONE", "via": url, "note": "no reachable form", "score": -9}


def main():
    src = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "outreach" / "dir_candidates_run8.txt"
    tracked = set()
    for line in (ROOT / "outreach" / "tracker.csv").read_text().splitlines()[1:]:
        parts = line.split(",")
        if len(parts) > 1 and "//" in parts[1]:
            tracked.add(re.sub(r"^www\.", "", parts[1].split("//")[1].split("/")[0].lower()))
    todo = []
    for u in [l.strip() for l in src.read_text().splitlines() if l.strip() and not l.startswith("#")]:
        dom = re.sub(r"^www\.", "", u.split("//")[-1].split("/")[0].lower())
        if dom in tracked:
            print(f"SKIP(tracked) {dom}")
            continue
        todo.append(u)
    print(f"untracked candidates: {len(todo)}\n", flush=True)
    with open(OUT, "w") as fh, ThreadPoolExecutor(max_workers=8) as ex:
        futs = {ex.submit(screen, u): u for u in todo}
        for fu in as_completed(futs):
            u = futs[fu]
            try:
                r = fu.result()
            except Exception as e:
                r = {"kind": "ERR", "via": u, "note": str(e)[:120], "score": -9}
            rec = {"url": u, **r}
            fh.write(json.dumps(rec) + "\n"); fh.flush()
            print(f"{r['kind']:16s} score={r['score']:+d}  {u}\n    via {r['via']}\n    {r['note'][:180]}", flush=True)
    print(f"\nresults -> {OUT}")


if __name__ == "__main__":
    main()
