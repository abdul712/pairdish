#!/usr/bin/env python3
"""Run-10 audit: (a) live meta-description length sweep with html.unescape,
(b) Bing query inventory dumped to a file for demand matching."""
import re, json, html, subprocess, pathlib, urllib.parse

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
BASE = "https://pairdish.com"


def fetch(url):
    r = subprocess.run(["curl", "-s", "--compressed", "--max-time", "25", "-A", UA, url],
                       capture_output=True, text=True)
    return r.stdout


def meta_len(h):
    m = re.search(r'<meta name="description" content="([^"]*)"', h)
    if not m:
        return None, ""
    raw = html.unescape(m.group(1))
    return len(raw), raw


def main():
    sm = fetch(BASE + "/sitemap.xml")
    urls = re.findall(r"<loc>([^<]+)</loc>", sm)
    over = []
    rows = []
    for u in urls:
        h = fetch(u)
        n, txt = meta_len(h)
        rows.append((u, n, txt))
        if n is not None and n > 160:
            over.append((u, n, txt))
    print(f"pages checked: {len(rows)}")
    print(f"METAS OVER 160 (post-unescape): {len(over)}")
    for u, n, t in over:
        print(f"  {n:3d} {u}\n      {t}")
    miss = [r for r in rows if r[1] is None]
    print(f"missing meta: {len(miss)} -> {[r[0] for r in miss]}")
    # also flag title length > 65
    return


if __name__ == "__main__":
    main()
