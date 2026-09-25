#!/usr/bin/env python3
"""Measure live word counts + basic QA for pairdish article/tool pages.
Usage: python3 scripts/live_wordcount.py <slug-path> [<slug-path> ...]
       python3 scripts/live_wordcount.py --sitemap
"""
import sys, re, subprocess, json

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"


def fetch(url):
    out = subprocess.run(
        ["curl", "-s", "--compressed", "--max-time", "25", "-A", UA, url],
        capture_output=True, text=True,
    )
    return out.stdout


def count_words(html):
    h = re.sub(r"<script.*?</script>", "", html, flags=re.S)
    h = re.sub(r"<style.*?</style>", "", h, flags=re.S)
    t = re.sub(r"<[^>]+>", " ", h)
    return len(re.findall(r"[A-Za-z0-9'\u2019-]+", t))


def meta_desc(html):
    m = re.search(r'<meta name="description" content="([^"]*)"', html)
    return m.group(1) if m else ""


def main():
    args = sys.argv[1:]
    if args and args[0] == "--sitemap":
        sm = fetch("https://pairdish.com/sitemap.xml")
        urls = re.findall(r"<loc>([^<]+)</loc>", sm)
        for u in urls:
            h = fetch(u)
            w = count_words(h)
            faq = "FAQPage" in h
            print(f"{u:70s} {w:6d}w meta={len(meta_desc(h)):3d} faq={faq}")
        return
    for path in args:
        url = path if path.startswith("http") else "https://pairdish.com" + (path if path.startswith("/") else "/" + path)
        h = fetch(url)
        print(json.dumps({
            "url": url,
            "status_len": len(h),
            "words": count_words(h),
            "meta_len": len(meta_desc(h)),
            "meta": meta_desc(h),
            "faq_page": "FAQPage" in h,
            "literal_hashhash": h.count("##"),
            "href_undefined": h.count('href="undefined"'),
        }))
        # word count of main content block only (rough)
    return


if __name__ == "__main__":
    main()
