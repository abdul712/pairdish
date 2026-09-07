"""Source REAL food images from Wikimedia Commons for PairDish articles.

Per content-site-asset-sourcing skill: generator=search + imageinfo + extmetadata,
license filter (CC0/PD/CC BY/CC BY-SA; reject NC/ND), mime filter, width>=1200,
token-relevance + BAD_TITLE filters, global dedupe, idempotent per-slug.
Uses curl (urllib fetches were stalled/blocked from this VPS in run 1).

Output: assets_sourcing/manifest.json + credits.csv
"""
import json, re, html, subprocess, time, pathlib, csv, hashlib

ROOT = pathlib.Path("/home/hermes/projects/pairdish")
OUT = ROOT / "assets_sourcing"
OUT.mkdir(exist_ok=True)
UA = "PairDishContentBot/1.0 (admin@pairdish.com) commons-image-sourcing"

ARTICLES = {
    "what-to-serve-with-roasted-potatoes": {
        "queries": ["roasted potatoes plate", "crispy roast potatoes bowl", "roasted potato wedges"],
        "tokens": ["potato"],
    },
    "what-to-serve-with-fried-fish": {
        "queries": ["fried fish fillets plate", "fish and chips plate", "breaded fried fish dish"],
        "tokens": ["fish"],
    },
    "what-to-serve-with-pesto-chicken": {
        "queries": ["pesto chicken dish", "chicken pesto pasta plate", "grilled chicken pesto"],
        "tokens": ["chicken"],
    },
}

LICENSE_OK = re.compile(r"(CC0|public domain|CC BY(?!-NC|-ND)|CC BY-SA|attribution)", re.I)
LICENSE_BAD = re.compile(r"(NC|ND|non-commercial|noncommercial|noderivs|fair use)", re.I)
BAD_TITLE = re.compile(
    r"(paint|painting|drawing|illustration|logo|stamp|map|statue|sculpture|"
    r"book|cover|page scan|menu\b|sign\b|label|poster|coat of arms|model\b|"
    r"toy|figurine|game|airport|street|building|train|car\b|bicycle)", re.I)


def api(params, tries=4):
    base = "https://commons.wikimedia.org/w/api.php?"
    from urllib.parse import urlencode
    # NOTE: action=query MUST be present — api.php without it returns the HTML help page
    url = base + urlencode({"action": "query", **params, "format": "json"})
    for attempt in range(tries):
        r = subprocess.run(["curl", "-s", "--max-time", "45", "-H", f"User-Agent: {UA}", url],
                           capture_output=True, text=True)
        if r.returncode == 0 and r.stdout.strip().startswith("{"):
            try:
                return json.loads(r.stdout)
            except json.JSONDecodeError:
                pass
        time.sleep(min(30, 8 * (attempt + 1)))
    return None


def find_candidates(query):
    data = api({
        "generator": "search", "gsrsearch": query, "gsrnamespace": "6", "gsrlimit": "20",
        "prop": "imageinfo",
        "iiprop": "url|mime|size|extmetadata", "iiurlwidth": "1600",
    })
    if not data:
        return []
    out = []
    for p in (data.get("query", {}).get("pages", {}) or {}).values():
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
        # reject AI-generated-flagged descriptions
        desc = html.unescape((em.get("ImageDescription") or {}).get("value", "")).lower()
        if "generated" in desc or "ai-generated" in desc or "midjourney" in desc or "dall" in desc:
            continue
        if BAD_TITLE.search(title):
            continue
        artist_raw = (em.get("Artist") or {}).get("value", "")
        artist = html.unescape(re.sub(r"<[^>]+>", "", artist_raw)).strip()[:120] or "Unknown"
        out.append({
            "title": title, "width": w, "height": ii.get("height"),
            "thumburl": ii.get("thumburl") or ii.get("url"),
            "descurl": ii.get("descriptionurl", ""),
            "license": lic, "artist": artist,
        })
    out.sort(key=lambda c: -c["width"])
    return out


def main():
    manifest_path = OUT / "manifest.json"
    credits_path = OUT / "credits.csv"
    manifest = json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    # global dedupe: seed from ALL previously ok entries
    used = {m["title"] for m in manifest.values() if m.get("status") == "ok"}

    for slug, spec in ARTICLES.items():
        if manifest.get(slug, {}).get("status") == "ok":
            print(f"{slug}: already sourced -> {manifest[slug]['title']}")
            continue
        picked = None
        q_used = None
        for q in spec["queries"]:
            print(f"{slug}: query '{q}'")
            q_used = q
            cands = find_candidates(q)
            token_hit = [c for c in cands if all(t in c["title"].lower() for t in spec["tokens"])]
            if token_hit:
                picked = token_hit[0]
                break
            time.sleep(2)
        if picked:
            manifest[slug] = {"status": "ok", "query": q_used, **picked}
            used.add(picked["title"])
            print(f"  PICKED: {picked['title']} [{picked['license']}] {picked['width']}px")
        else:
            manifest[slug] = {"status": "none", "queries_tried": spec["queries"]}
            print("  NO suitable image")
        manifest_path.write_text(json.dumps(manifest, indent=1))
        time.sleep(2)

    # regenerate credits.csv from manifest (skill pitfall: regenerate at end, never accumulate)
    with open(credits_path, "w", newline="") as f:
        wcsv = csv.writer(f)
        wcsv.writerow(["article_slug", "file_title", "artist", "license", "source_page", "thumb_url", "local_path"])
        for slug in ARTICLES:
            m = manifest.get(slug, {})
            if m.get("status") == "ok":
                wcsv.writerow([slug, m["title"], m["artist"], m["license"], m["descurl"], m["thumburl"],
                               f"/images/articles/{slug}.jpg"])
    print("\n=== SUMMARY ===")
    for slug in ARTICLES:
        m = manifest.get(slug, {})
        print(slug, "->", m.get("status"), "|", m.get("title", "")[:60], "|", m.get("license", ""))


if __name__ == "__main__":
    main()