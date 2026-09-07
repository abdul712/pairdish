"""Source real food images from Wikimedia Commons for PairDish articles.
Follows content-site-asset-sourcing skill: generator=search, imageinfo+extmetadata,
license filter CC0/PD/CC BY/CC BY-SA (reject NC/ND), mime filter, width>=1200,
token-relevance filter, global dedupe, attribution output. Idempotent per article.
"""
import json, re, html, time, urllib.request, urllib.parse, pathlib

OUT = pathlib.Path("/home/hermes/projects/pairdish/assets_sourcing")
OUT.mkdir(exist_ok=True)
UA = {"User-Agent": "PairDishContentBot/1.0 (contact: admin@pairdish.com) commons-image-sourcing"}

ARTICLES = {
    "what-to-serve-with-roasted-potatoes": {
        "queries": ["roasted potatoes dish", "roast potatoes dinner plate", "crispy roasted potatoes"],
        "tokens": ["potato", "roast", "roasted"],
    },
    "what-to-serve-with-fried-fish": {
        "queries": ["fried fish fillet plate", "fried fish and chips dish", "breaded fried fish"],
        "tokens": ["fish", "fried"],
    },
    "what-to-serve-with-pesto-chicken": {
        "queries": ["pesto chicken dish", "chicken pesto dinner", "grilled chicken pesto"],
        "tokens": ["chicken", "pesto"],
    },
}

LICENSE_OK = re.compile(r"(CC0|Public domain|Public Domain|CC BY(?!-NC|-ND)|CC BY-SA|CC BY 4|CC BY-SA 4|Attribution)", re.I)
LICENSE_BAD = re.compile(r"(NC|ND|Non-Commercial|NonCommercial|NoDeriv|fair use|Fair use)", re.I)

def api(params, tries=6):
    base = "https://commons.wikimedia.org/w/api.php?"
    qs = urllib.parse.urlencode({**params, "format": "json"})
    for attempt in range(tries):
        try:
            req = urllib.request.Request(base + qs, headers=UA)
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.loads(r.read())
        except Exception as e:
            wait = min(30, 5 * (attempt + 1) + (2 if attempt > 2 else 0))
            print(f"  retry {attempt+1} after err: {e} (wait {wait}s)")
            time.sleep(wait)
    return None

def find_image(query, tokens, used):
    data = api({
        "generator": "search", "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": "20",
        "prop": "imageinfo", "iiprop": "url|mime|size|extmetadata", "iiurlwidth": "1600",
    })
    if not data:
        return None
    pages = data.get("query", {}).get("pages", {})
    cands = []
    for p in pages.values():
        ii = (p.get("imageinfo") or [{}])[0]
        em = ii.get("extmetadata") or {}
        title = p.get("title", "")
        if not title.lower().endswith((".jpg", ".jpeg", ".png")):
            continue
        mime = ii.get("mime", "")
        if mime not in ("image/jpeg", "image/png"):
            continue
        w = ii.get("width", 0)
        if w < 1200:
            continue
        lic = html.unescape((em.get("LicenseShortName") or {}).get("value", ""))
        if LICENSE_BAD.search(lic) or not LICENSE_OK.search(lic):
            continue
        if (em.get("Credit") or {}).get("value", "") and "generated" in (em.get("ImageDescription") or {}).get("value", "").lower():
            continue  # skip AI-generated flagged descriptions
        lt = title.lower()
        if not any(t in lt for t in tokens):
            continue
        if title in used:
            continue
        cands.append({
            "title": title,
            "width": w, "height": ii.get("height"),
            "thumburl": ii.get("thumburl") or ii.get("url"),
            "page": ii.get("descriptionurl"),
            "license": lic,
            "artist": html.unescape(re.sub(r"<[^>]+>", "", (em.get("Artist") or {}).get("value", ""))).strip()[:120],
        })
    cands.sort(key=lambda c: -c["width"])
    return cands[0] if cands else None

manifest_path = OUT / "manifest.json"
manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
used = {m["title"] for m in manifest.values()}

for slug, spec in ARTICLES.items():
    if slug in manifest and manifest[slug].get("status") == "ok":
        print(f"{slug}: already sourced -> {manifest[slug]['title']}")
        continue
    picked = None
    for qi, q in enumerate(spec["queries"]):
        print(f"{slug}: query '{q}'")
        picked = find_image(q, spec["tokens"], used)
        if picked:
            print(f"  PICKED: {picked['title']} [{picked['license']}] {picked['width']}x{picked['height']}")
            print(f"  page: {picked['page']}")
            break
        time.sleep(2)
    if picked:
        manifest[slug] = {"status": "ok", "query": q, **picked}
        used.add(picked["title"])
    else:
        manifest[slug] = {"status": "none", "queries_tried": spec["queries"]}
        print("  NO suitable image")
    manifest_path.write_text(json.dumps(manifest, indent=1))
    time.sleep(2)

print("\n=== SUMMARY ===")
for slug, m in manifest.items():
    print(slug, "->", m.get("status"), "|", m.get("title", ""), "|", m.get("license", ""))